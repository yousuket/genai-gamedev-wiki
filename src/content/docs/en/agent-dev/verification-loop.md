---
title: "Verification Loop: Making Agents Verify Their Work"
description: Headless execution, Playwright screenshots, exposing game state via window.__game, fixed seeds, bots, FPS measurement, and critic loops — how to build a framework for agents to verify their own work, with working code examples.
sidebar:
  order: 9
lastUpdated: 2026-10-05
---

## Overview

- Without verification tools, agents stop as soon as their output "looks done." Games involve graphics, input, and randomness, so having a human play-test and verify each time makes humans part of the verification loop.
- This article builds a framework for agents to verify their own work: headless execution, automated tests, browser automation with screenshots, exposing game state, fixed seeds, player bots, performance measurement, and image comparison.
- It covers the verification toolset used by Claude of Duty and the critic loop pattern for comparing against reference implementations.
- The code examples are written for this Wiki. State retrieval, input injection, reproducible seeds, and frame time aggregation are tested with a small 2D game running on Playwright.

## Why verification matters

The Claude Code official guide explains that providing agents with executable verification tools—tests, builds, screenshot comparisons, and other proof they can read—is one of the most effective improvements. Without verification tools, agents only know something is "done" when it looks done, leaving the actual verification to humans ([Best practices](https://code.claude.com/docs/en/best-practices), as of September 2026).

The same guide recommends asking for evidence—test output, commands and their results, screenshots—rather than claims of success. Evidence is faster to evaluate than running the code yourself.

## Verification stages

| Stage | Method | Finds | Effort |
|---|---|---|---|
| 1 | Build, type check, lint | Syntax and type errors | Minimal |
| 2 | Unit tests (formulas, state transitions) | Logic errors | Small |
| 3 | Headless startup | Crashes, exceptions at startup | Small |
| 4 | Browser automation and screenshots | Missing visuals, black screens, UI overflow | Medium |
| 5 | Expose game state | "Runs but state is wrong" | Medium |
| 6 | Player bot | Softlock, NaN, unexpected deaths | Medium |
| 7 | FPS and memory measurement | Hitches, memory growth | Medium |
| 8 | Image comparison with reference (critic) | Visual quality gaps | Large |

Build from stage 1 upward. Stages 1-3 use existing tools. Stages 4 and later require small changes to the game.

## Case study: Claude of Duty's verification toolset

Claude of Duty is a Three.js FPS with about 55,000 lines and 11 subsystems. Assets (images and audio) are generated from code. The `tools/` directory in the repository contains verification scripts ([README](https://github.com/mshumer/Claude-of-Duty), as of September 2026).

| Tool | Purpose |
|---|---|
| `capture.mjs` | One screenshot of a named scene from headless Chromium with GPU |
| `baseline.mjs` | 11 scenes, each on a fresh page, capturing the same identical image each run |
| `imagediff.mjs` | Pixel-by-pixel comparison of two images; exits nonzero if any pixel differs |
| `profile.mjs` | Frame timings from actual play, output as p50, p95, p99 to identify hitches |
| `playtest.mjs` | Simple smoke test with automated movement and shooting |

Reading the source reveals what the game exposes: `window.__READY__` (startup complete), `window.__ENGINE__` (engine internals), `window.__APPLY_SHOT__(name)` (replay a named scene). The capture scripts use these to replay scenes, advance a fixed number of frames, and screenshot.

Three lessons from this case:

- <strong>Fix the conditions for shooting</strong>. Running 11 shots in one page let particle timings and exposure carry over, so 10 of 11 looked different even with the same inputs. Each scene got a fresh page and fixed time progression to get identical images. Subsystems reading time from `performance.now()` were changed to use the engine's clock.
- <strong>Make image difference the pass/fail criterion</strong>. During performance optimization, the team proved visuals did not change using pixel diff, not code assertions. Frame rate rose from 12-17 fps to 28-30 fps, and all 11 reference images matched before and after the optimization.
- <strong>Watch the distribution, not the average</strong>. One test reported 94 fps while play was janky. The cause: 34+ shaders compiled during play, peaking at 700-1,200 ms per frame. Frame count of WebGL programs identified the culprit; pre-compiling them reduced it to zero.

## Step 1: Expose game state to external readers

Pixels alone do not tell you "did the player move" or "how many enemies are there." Expose a debug port only when `?debug=1`:

```ts
// src/debug-hooks.ts
import type { WebGLRenderer } from 'three';
import type { Game } from './game';

export interface Snapshot {
  frame: number;
  seed: number;
  player: { x: number; y: number; hp: number };
  enemies: { x: number; y: number }[];
  score: number;
}

export interface DebugApi {
  snapshot(): Snapshot;
  /** Advance frame by fixed step (1/60 second), render once at the end */
  step(frames: number): void;
  setInput(input: { moveX?: number; moveY?: number; fire?: boolean }): void;
  renderStats(): { calls: number; triangles: number; geometries: number; textures: number; programs: number };
}

declare global {
  interface Window {
    __READY__?: boolean;
    __game?: DebugApi;
  }
}

const FIXED_DT = 1 / 60;

export function installDebugHooks(game: Game, renderer: WebGLRenderer): void {
  if (!new URLSearchParams(location.search).has('debug')) return;
  window.__game = {
    snapshot: () => game.snapshot(),
    step(frames) {
      for (let i = 0; i < frames; i++) game.update(FIXED_DT);
      game.render();
    },
    setInput: (input) => game.setInput(input),
    renderStats: () => ({
      calls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
      geometries: renderer.info.memory.geometries,
      textures: renderer.info.memory.textures,
      programs: renderer.info.programs?.length ?? 0,
    }),
  };
  window.__READY__ = true; // Set after the first render is done
}
```

`renderer.info` is a Three.js stat object: render calls, triangle count, geometry and texture counts, and active shader programs ([WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html), as of September 2026). `render.calls` resets after each draw, so read it right after `step()` renders.

## Step 2: Fixed random seeds and fixed timestep

Verification must be deterministic. Fix both:

- Use a seeded random function instead of `Math.random()`. This function is a small PRNG that returns the same sequence for the same seed:

```ts
// src/rng.ts
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

- Drive time from frame count, not wall time. The `step()` function from Step 1 does this. When `?lockstep=1`, stop the game's own `requestAnimationFrame` loop and advance only via external `step()` calls.

With the same seed and same frame count, you get the same state and the same image. Godot achieves this by setting `RandomNumberGenerator.seed` to the same value ([RandomNumberGenerator](https://docs.godotengine.org/en/stable/classes/class_randomnumbergenerator.html)).

Playwright also offers `page.clock` for manual time control: `Date`, `setTimeout`, `requestAnimationFrame`, `performance` ([Clock](https://playwright.dev/docs/clock)). This is an option if you want to control time without modifying the game.

## Step 3: Playwright boot, input, screenshot

Setup:

```bash
npm i -D playwright pngjs pixelmatch
npx playwright install chromium
```

The verification script starts the game, reads state, screenshots, and exits nonzero on failure:

```js
// tools/verify.mjs (run via npm run verify)
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.GAME_URL ?? 'http://127.0.0.1:5173/';
const url = (query) => `${BASE}?${query}`;

mkdirSync('shots', { recursive: true });
const failures = [];
const errors = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

const browser = await chromium.launch({
  headless: true,
  args: ['--ignore-gpu-blocklist', '--force-color-profile=srgb'],
});
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    // Ignore 404 for missing favicon alone
    if (m.type() === 'error' && !m.location().url.endsWith('/favicon.ico')) errors.push(m.text());
  });

  async function boot() {
    await page.goto(url('debug=1&seed=42&lockstep=1'));
    await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 60_000 });
  }

  // 1. Boot, advance 2 seconds, screenshot after startup
  await boot();
  await page.evaluate(() => window.__game.step(120));
  await page.screenshot({ path: 'shots/start.png' });
  const s0 = await page.evaluate(() => window.__game.snapshot());

  // 2. Inject input, check moved right after 1 second
  await page.evaluate(() => window.__game.setInput({ moveX: 1 }));
  await page.evaluate(() => window.__game.step(60));
  const s1 = await page.evaluate(() => window.__game.snapshot());
  check(s1.player.x > s0.player.x + 10, 'Player did not move right');

  // 3. Let bot play for 60 seconds (Step 4)
  const bot = await page.evaluate((totalFrames) => {
    const g = window.__game;
    let minHp = Infinity;
    for (let f = 0; f < totalFrames; f += 6) {
      const s = g.snapshot();
      minHp = Math.min(minHp, s.player.hp);
      // Move away from nearest enemy, keep shooting
      let dx = 0, dy = 0, best = Infinity;
      for (const e of s.enemies) {
        const d = Math.hypot(e.x - s.player.x, e.y - s.player.y);
        if (d < best) { best = d; dx = s.player.x - e.x; dy = s.player.y - e.y; }
      }
      const len = Math.hypot(dx, dy) || 1;
      g.setInput({ moveX: dx / len, moveY: dy / len, fire: true });
      g.step(6); // Decide every 0.1 seconds
    }
    return { minHp, last: g.snapshot() };
  }, 3600);
  await page.screenshot({ path: 'shots/after-bot.png' });
  check(Number.isFinite(bot.last.player.x) && Number.isFinite(bot.last.player.y), 'Player coordinates are NaN');

  // 4. Replay from the same seed, check state matches (determinism)
  await boot();
  await page.evaluate(() => window.__game.step(120));
  const again = await page.evaluate(() => window.__game.snapshot());
  check(JSON.stringify(again) === JSON.stringify(s0), 'State does not match with same seed');

  check(errors.length === 0, `Console has ${errors.length} error(s)`);
  writeFileSync('shots/report.json', JSON.stringify({ failures, errors, minHp: bot.minHp, last: bot.last }, null, 2));
} finally {
  await browser.close();
}

if (failures.length > 0) {
  console.error('Verification failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log('Verification passed (screenshots saved to shots/)');
```

`page.screenshot({ path })` also accepts `fullPage` and a region to capture ([Screenshots](https://playwright.dev/docs/screenshots)). `page.waitForFunction` waits for `window.__READY__` to avoid operating the game before it finishes loading. The `args` in `chromium.launch` pass browser options; the Playwright docs warn that custom settings can break behavior ([BrowserType](https://playwright.dev/docs/api/class-browsertype)).

Brief to the agent:

```text
Run npm run verify. If it fails, check the logs and screenshots in shots/*.png, fix the cause, and repeat until it passes.
Finally, look at shots/start.png and shots/after-bot.png and report any missing UI, overflow, or dark areas.
```

### How to write a bot

The bot above is simple—flee and shoot the nearest enemy. It still finds:

- Softlock or NaN in tens of seconds
- Infinite enemy spawning causing slowdown
- Bot never dies or dies immediately (extreme difficulty imbalance)

Swap the strategy for different tests: a "wall-push bot" that runs into walls, a "mash bot" that mashes random input. Difficulty tuning uses bot statistics to compute win rate ([Balancing](/en/design/balancing/)).

## Step 4: FPS and memory measurement

Average FPS hides hitches. Measure distribution and worst-case like Claude of Duty did. This script runs without lockstep, using real frame rendering, and aggregates `requestAnimationFrame` intervals:

```js
// tools/perf.mjs (run via npm run perf)
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto((process.env.GAME_URL ?? 'http://127.0.0.1:5173/') + '?debug=1&seed=42');
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 60_000 });

const result = await page.evaluate(async (durationMs) => {
  const dts = [];
  let last = performance.now();
  const end = last + durationMs;
  await new Promise((resolve) => {
    function tick(t) {
      dts.push(t - last);
      last = t;
      if (t < end) requestAnimationFrame(tick);
      else resolve();
    }
    requestAnimationFrame(tick);
  });
  dts.splice(0, 60); // Skip first 60 frames after startup
  dts.sort((a, b) => a - b);
  const q = (p) => dts[Math.min(dts.length - 1, Math.floor(dts.length * p))];
  return {
    frames: dts.length,
    p50: q(0.5),
    p95: q(0.95),
    p99: q(0.99),
    worst: dts[dts.length - 1],
    heapMB: performance.memory ? performance.memory.usedJSHeapSize / 1048576 : null, // Chromium only
    render: window.__game.renderStats?.(),
  };
}, 10_000);

console.log(JSON.stringify(result, null, 2));
await browser.close();
```

- Compare `p95` and `worst` against targets. For example, target p95 < 20 ms and worst < 50 ms.
- Check whether hitches are from shader compilation: see if `render.programs` increased during measurement. Claude of Duty's `profile.mjs` correlated jitchy frames with WebGL program count increase.
- `performance.memory` is a nonstandard Chromium-only value. Claude of Duty's `profile.mjs` uses it to check heap usage. If heap grows over long play, suspect a leak.
- Headless rendering on CPU-only machines differs greatly from real devices. Measure on a machine similar to the target. For GPU-enabled headless, see [this article](https://www.createit.com/blog/headless-chrome-testing-webgl-using-playwright/).

## Step 5: Prove "visuals unchanged" with image diff

During refactoring or performance work, prove visuals stayed the same. Using `pixelmatch` like Claude of Duty's `imagediff.mjs`:

```js
// tools/imagediff.mjs
// Usage: node tools/imagediff.mjs before.png after.png diff.png
import { readFileSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const [beforePath, afterPath, diffPath] = process.argv.slice(2);
const before = PNG.sync.read(readFileSync(beforePath));
const after = PNG.sync.read(readFileSync(afterPath));
if (before.width !== after.width || before.height !== after.height) {
  console.error('Image sizes differ');
  process.exit(2);
}
const diff = new PNG({ width: before.width, height: before.height });
const changed = pixelmatch(before.data, after.data, diff.data, before.width, before.height, { threshold: 0 });
writeFileSync(diffPath, PNG.sync.write(diff));
console.log(`Different pixels: ${changed}`);
process.exit(changed === 0 ? 0 : 1);
```

`pixelmatch` returns the count of different pixels. `threshold` ranges 0–1; default is 0.1; 0 is strict ([pixelmatch](https://github.com/mapbox/pixelmatch)). Strict matching only makes sense when seed and time are fixed so the same image is guaranteed each run. If using Playwright Test runner, `toHaveScreenshot` is another option.

## Critic loop: compare against reference and improve

The form is called "Gauntlet Loop." The pattern and template for your game are in [Gauntlet Loop](/en/agent-dev/gauntlet-loop/).

The original Claude of Duty prompt instructed the agent to place a harsh critic who compared against actual Call of Duty ([prompt.md](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md)). The README reports 11 independent critics scored the output against Call of Duty baseline. Scores were round 1: 3.59, round 2: 4.14, round 3: 4.05, after optimization: 5.05 (out of 10). In blind comparison, every critic chose the real Call of Duty every time.

The pattern teaches loop design:

| Element | Claude of Duty | Your project |
|---|---|---|
| Reference | Real Call of Duty screenshots | Reference you can source (previous build, custom target, permissible assets). README does not explain how to obtain the images |
| Critic | Separate harsh evaluator, not the implementer | Separate sub-agent shown only images, not the implementation session |
| Judgment | Blind comparison and 10-point score | Guess which is the reference, score by category |
| Repair | Combine related systems (tonemap, sky, indirect light); one owner fixes them in sequence | Do not split visual systems across multiple owners; fix one subsystem per session in turn |

The README reports 3 parallel rounds cut defects from 60, 47, 66 down to... 66, 47, 60 (no improvement). One owner fixing tonemap → sky → indirect light in sequence cut defects from 66 to 26. Combined systems break when split across agents. For parallel patterns, see [Parallel agents](/en/agent-dev/parallel-agents/).

Another lesson: critics can misdiagnose. "Weapon texture missing" was raised 3 rounds running, but the texture existed; reflection was too strong. Parallel rounds that darkened albedo per the feedback actually worsened it; the fix was the reverse. Treat critic feedback as symptom reports. Verify root cause by experiment.

A sample critic prompt:

```text
You are a harsh critic, not the implementer. Do not read code; judge images only.
Input: current screenshots in shots/, and reference images in docs/reference/ (paired by scene).
1. Score each pair 0-10 on 5 axes: composition, lighting, material quality, UI clarity, motion feel (blur, particles).
2. For each axis, name one biggest gap against the reference, with screen coordinates.
3. List top 3 fixes, in order. Skip preference issues.
4. If reports/critic-prev.json shows any prior score dropped, report it.
5. Save results to reports/critic-latest.json.
```

Brief the implementer: "Fix one critic note per session. Run npm run verify and image diff after each fix. If a score drops below the prior round, revert."

## Connect to Claude Code

- In one request, ask the agent to "run verification, fix failures, repeat until it passes."
- For multi-turn work, write a `/goal` condition. `/goal` confirms the condition each turn with a lightweight model, running the agent until it is met. The judge model does not run commands, only reads conversation, so phrase the goal as observable output: "`npm run verify` exits code 0" ([Keep Claude working toward a goal](https://code.claude.com/docs/en/goal)).

```text
/goal npm run verify exits with code 0, and screenshots in shots/ show no missing UI or overflow.
Stop after 20 turns.
```

- For required checks, use a Stop hook to run verification and prevent exit if it fails ([Hooks guide](https://code.claude.com/docs/en/hooks-guide)).
- If verification output is verbose, [run it in a sub-agent](/en/agent-dev/context-management/) and receive only the summary.
- To watch a real browser, use `claude --chrome` to operate Chrome, which requires the Claude in Chrome extension ([Use Claude Code with Chrome](https://code.claude.com/docs/en/chrome)).

## Per-engine methods

### Godot

- `godot --headless` starts without display or audio. `--quit-after N` exits after N iterations; `--check-only` with `--script` checks syntax and exits ([Command line tutorial](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html)).
- Arguments after `--` are passed to the script, readable via `OS.get_cmdline_user_args()`. Use this to pass verification options (seed, frame count).
- Tests run via gdUnit4 command line ([gdUnit4 Command Line Tool](https://godot-gdunit-labs.github.io/gdUnit4/latest/advanced_testing/cmd/)).
- Video is written via `--write-movie output.avi` with `--fixed-fps` for fixed frame rate. Not usable headless; intended for real-time capture ([Creating movies](https://docs.godotengine.org/en/stable/tutorials/animation/creating_movies.html)).

```gdscript
# autoload Verify.gd. Run with: godot --headless --path . -- --verify --seed=42 --frames=3600
extends Node

var _frames := 0
var _limit := 0

func _ready() -> void:
	var args := OS.get_cmdline_user_args()
	if not args.has("--verify"):
		set_physics_process(false)
		return
	for a in args:
		if a.begins_with("--seed="):
			seed(int(a.get_slice("=", 1)))
		if a.begins_with("--frames="):
			_limit = int(a.get_slice("=", 1))

func _physics_process(_delta: float) -> void:
	_frames += 1
	if _frames >= _limit:
		print(JSON.stringify({"frames": _frames, "score": Game.score}))  # Game is a game autoload
		get_tree().quit(0)
```

### Unity

- `Unity -runTests -batchmode -projectPath <path> -testResults <output.xml> -testPlatform <EditMode or PlayMode>` runs tests from command line and writes results as XML ([Run tests from the command line](https://docs.unity3d.com/6000.3/Documentation/Manual/test-framework/run-tests-from-command-line.html)).
- Play Mode tests using `[UnityTest]` with coroutines load a scene, advance frames, and check state ([Unity Test Framework](https://docs.unity3d.com/Packages/com.unity.test-framework@1.4/manual/index.html)).
- Let the agent read the XML result and failing test names.

## Common pitfalls

- Screenshot is taken after `step()` assumes it renders at the end. If `step()` does not always render, you get the prior frame.
- Headless rendering differs by GPU, driver, and OS. Compare images shot on the same machine.
- A broken verification script causes the agent to chase the bug in the game. Version-control the test code.
- Game feel and fun are outside this framework. See [Game feel](/en/agent-dev/game-feel/) and [Failure patterns](/en/agent-dev/failure-patterns/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-30**: Paper RSIGame proposes a loop: agents generate a game, explore it, diagnose, and improve, keeping the best checkpoint. On 140 GameCraft-Bench tasks (Godot and Phaser), quality is consistently higher for the same agent budget ([source](https://arxiv.org/abs/2609.39045))
- **2026-10-01**: A solo developer ran Claude Code and Codex overnight, reviewing screenshots and test results each morning for a month. Writing prompts for one model in another model adds unwanted assumptions; write directly for the model you will use ([source](https://www.reddit.com/r/aigamedev/comments/1wv7t29/i_spent_months_using_ai_coding_agents_almost_247/))
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Claude of Duty (GitHub)](https://github.com/mshumer/Claude-of-Duty) — one-shot generation repository, README with measurement results and critic scores
- [Claude of Duty: prompt.md](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md) — original prompt (includes critic instructions)
- [Claude of Duty: tools/ (GitHub)](https://github.com/mshumer/Claude-of-Duty/tree/main/tools) — `capture.mjs`, `baseline.mjs`, `imagediff.mjs`, `profile.mjs`, `playtest.mjs`
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — rationale for giving agents verification tools
- [Keep Claude working toward a goal](https://code.claude.com/docs/en/goal) — `/goal` phrasing and evaluation
- [Hooks guide](https://code.claude.com/docs/en/hooks-guide) — Stop hook automation
- [Use Claude Code with Chrome](https://code.claude.com/docs/en/chrome) — Chrome automation
- [Screenshots (Playwright)](https://playwright.dev/docs/screenshots) — screenshot options
- [Clock (Playwright)](https://playwright.dev/docs/clock) — manual time control on pages
- [BrowserType (Playwright)](https://playwright.dev/docs/api/class-browsertype) — `launch` options
- [WebGLRenderer (three.js docs)](https://threejs.org/docs/pages/WebGLRenderer.html) — `renderer.info`
- [pixelmatch (GitHub)](https://github.com/mapbox/pixelmatch) — image diff library
- [Headless Chrome testing WebGL using Playwright (createIT)](https://www.createit.com/blog/headless-chrome-testing-webgl-using-playwright/) — headless WebGL and GPU options
- [Command line tutorial (Godot Docs)](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html) — `--headless`, `--quit-after`, `--check-only`
- [OS (Godot Docs)](https://docs.godotengine.org/en/stable/classes/class_os.html) — `get_cmdline_user_args()`
- [RandomNumberGenerator (Godot Docs)](https://docs.godotengine.org/en/stable/classes/class_randomnumbergenerator.html) — seeded randomness
- [Creating movies (Godot Docs)](https://docs.godotengine.org/en/stable/tutorials/animation/creating_movies.html) — `--write-movie`
- [gdUnit4 Command Line Tool](https://godot-gdunit-labs.github.io/gdUnit4/latest/advanced_testing/cmd/) — Godot test runner
- [Run tests from the command line (Unity Manual)](https://docs.unity3d.com/6000.3/Documentation/Manual/test-framework/run-tests-from-command-line.html) — Unity test execution
- [Unity Test Framework](https://docs.unity3d.com/Packages/com.unity.test-framework@1.4/manual/index.html) — Edit Mode and Play Mode tests
