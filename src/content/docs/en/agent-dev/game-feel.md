---
title: Refining Game Feel with Coding Agents
description: Agents cannot feel game interactions, so humans try the game and describe the feel in words while agents turn it into numbers and implementation. This explains how to unify parameters, create debug UIs, add juice effects, measure input latency, and run iteration cycles.
sidebar:
  order: 10
lastUpdated: 2026-09-29
---

## Overview

- **Game feel** is the pleasure of interaction: the floatiness of a jump, the weight of an attack landing, the screen shake. Coding agents can write code but cannot play the game and feel it.
- Instead, humans play and put the feeling into words. Agents take those words and turn them into numbers and implementation. This is the division of labor.
- This article covers how to map sensations to numbers, design parameters for tuning in one place, create debug UIs with sliders, add juice effects, measure input latency, compare against reference games, show the agent play video frames, and iterate.
- Code and prompts in this article are examples written for this Wiki.

## How humans and agents divide the work

| Role | Humans | Agents |
|---|---|---|
| Feel | Play the game and spot what feels wrong | Cannot |
| Describe | Write "what feels wrong, where, and how" | Clarify vague words with follow-up questions |
| Convert to numbers | Pick direction (heavy, light) | Propose multiple numeric options and code them |
| Compare | Play options and pick one | Create a way to switch between options |
| Measure | Decide what to measure | Measure latency, frame count, shake size in code |
| Decide | Make the choice | Do not |

In [AI-Driven Development Workflow](/en/dev-env/ai-workflow/), we explain that exposing tuning numbers and letting humans specify them by number makes fixes more precise. This article walks through that process in detail.

## Map sensations to numbers

"Make it feel good" is too vague for agents to know which numbers to move. Keep a reference table of sensations and the parameters that control them to speed up requests.

| Sensation | Parameters to try |
|---|---|
| Heavy, sluggish | Shorten acceleration time, raise top speed, reduce attack startup |
| Floaty | Raise gravity, or increase fall gravity scale (gravity stronger on the way down) |
| Slippery | Shorten deceleration time (raise friction) |
| Input not responding | Extend input buffer (how long to remember a jump press before landing), extend coyote time (window to jump after leaving ground) |
| Laggy response | Measure latency (covered later). Reduce animation frames in startup |
| Impact feels nothing | Add hitstop, screen shake, sound effect, particles, knockback |

When describing, write down four things:

```text
Scene: Jumping just before stepping off a cliff edge
Sensation: Jump sometimes does not come out
Direction: Easier to jump (longer window)
Degree: About twice as long
```

"Degree" does not need to be a number. Agents turn the words into numeric change proposals.

## Centralize tuning parameters

If numbers are scattered through code, both agents and humans get lost. Put all tuning numbers in one file where they are visible.

```ts
// src/tuning.ts
export const tuning = {
  player: {
    maxSpeed: 6.0,          // cells/second
    accelTime: 0.12,        // seconds to reach max speed
    decelTime: 0.08,        // seconds to stop
    jumpHeight: 3.2,        // cells
    jumpTime: 0.55,         // seconds from apex to landing
    fallGravityScale: 1.6,  // gravity multiplier on the way down
    coyoteTime: 0.08,       // seconds
    jumpBuffer: 0.10,       // seconds
  },
  juice: {
    enabled: { hitStop: true, shake: true, particles: true },
    hitStopMs: 60,
    shakeAmplitude: 0.15,   // cells
    shakeDecay: 8,          // larger = stops faster
  },
};

// Derive gravity and initial speed from height and time (symmetric up and down)
export function deriveJump(heightCells: number, totalTimeSec: number) {
  return {
    gravity: (8 * heightCells) / (totalTimeSec * totalTimeSec), // cells/second²
    initialSpeed: (4 * heightCells) / totalTimeSec,             // cells/second
  };
}

if (new URLSearchParams(location.search).has('debug')) {
  (window as unknown as { __tuning: typeof tuning }).__tuning = tuning;
}
```

For jump, use "height" and "time" instead of physics values like gravity and initial speed. Players understand these better. With the formula in `deriveJump`, if the jump is symmetric (up and down take the same time), gravity is 8h/t² and initial speed is 4h/t. For example, height 3.2 cells and time 0.55 seconds give gravity about 84.6 cells/second² and initial speed about 23.3 cells/second.

- Always add units and comments. Agents will not misread "0.12".
- Rules for adding new numbers go in the [project instruction file](/en/agent-dev/project-instructions/).
- Expose the numbers in `window.__tuning` so [verification loops](/en/agent-dev/verification-loop/) can read and change them. Agents can run experiments on their own.
- In Godot, use a Resource (`.tres`), and in Unity, a ScriptableObject. You can tweak values directly in the engine inspector.

## Create debug UI with sliders

Changing numbers and reloading code slows down iteration. Have the agent create a UI with sliders so you can move values while the game runs. For Three.js or browser games, lil-gui works: `gui.add(object, 'property', min, max, step)` creates a slider ([lil-gui](https://lil-gui.georgealways.com/)).

```ts
// src/debug-ui.ts
import GUI from 'lil-gui';
import { tuning } from './tuning';

// [min, max, step]
const RANGES: Record<string, [number, number, number]> = {
  maxSpeed: [1, 12, 0.1],
  accelTime: [0.01, 0.5, 0.01],
  decelTime: [0.01, 0.5, 0.01],
  jumpHeight: [1, 6, 0.1],
  jumpTime: [0.2, 1.2, 0.01],
  fallGravityScale: [1, 3, 0.05],
  coyoteTime: [0, 0.25, 0.01],
  jumpBuffer: [0, 0.25, 0.01],
  hitStopMs: [0, 200, 5],
  shakeAmplitude: [0, 0.6, 0.01],
  shakeDecay: [1, 20, 0.5],
};

export function createDebugUi(): GUI {
  const gui = new GUI({ title: 'tuning' });
  for (const [groupName, group] of Object.entries(tuning)) {
    const target = group as Record<string, unknown>;
    const folder = gui.addFolder(groupName);
    for (const [key, value] of Object.entries(target)) {
      if (typeof value === 'boolean') folder.add(target as Record<string, boolean>, key);
      else if (RANGES[key]) folder.add(target as Record<string, number>, key, ...RANGES[key]);
    }
  }
  // Let people copy values to paste back to the agent
  gui.add({ copy: () => navigator.clipboard.writeText(JSON.stringify(tuning, null, 2)) }, 'copy').name('Copy current values');
  return gui;
}
```

Example of how to ask the agent.

```text
Create a debug UI in lil-gui where you can tweak tuning values while the game runs.
- Show only when ?debug=1.
- Choose reasonable min, max, and step from the units and comments in tuning.ts.
- Add a "Copy current values" button. When pressed, it copies the tuning JSON to the clipboard.
- When done, take a screenshot and check that the UI does not overlap the game.
```

You move the sliders to find values you like, press "Copy current values" to get the JSON, and give it to the agent. The agent updates `tuning.ts` and commits.

To compare options, create three presets (A, B, C) and let players switch with keys 1, 2, 3. Comparing by hand is easier that way.

## Add juice effects

Juice is small exaggerated feedback effects: hitstop, screen shake, sound effects, particles, and more.

Two classic talks explain this.

- Jan Willem Nijman (Vlambeer): "The art of screenshake" (INDIGO Classes 2013) shows a simple shooter, adding one small change at a time and watching the feel change. The video and interactive slide deck are public ([YouTube](https://www.youtube.com/watch?v=AJdEqssNZ-U), [Internet Archive](https://archive.org/details/the-art-of-screenshake)).
- Martin Jonasson and Petri Purho: "Juice it or lose it" (GDC Europe 2012) shows a bare game and adds effects on stage. They shared the demo source code ([GDC Vault](https://www.gdcvault.com/play/1016487/juice-it-or-lose)).

| Effect | What it does | Examples of tuned values |
|---|---|---|
| Hitstop | Freeze the game briefly when an attack lands | Duration in milliseconds |
| Screen shake | Move the camera on impact or shot | Amplitude, decay speed, direction |
| Sound effect | Layer hit sounds, shift pitch slightly | Volume, pitch range, number of layers |
| Particle | Spawn sparks or fragments at impact | Count, lifetime, speed, color |
| Knockback and recoil | Push both the hit and the hitter | Distance, time |
| Flash | Blink white or red on impact | Opacity, duration |

- <strong>Add one effect per request.</strong> If you add multiple at once, you will not know which one mattered.
- Each effect should have an `enabled` flag. Like `tuning.juice.enabled`, you can toggle effects on and off to compare.
- Adding everything makes the screen hard to read. Folmer Kelly at GDC Europe 2014 warned against over-juicing and losing readability ([Game Developer article](https://www.gamedeveloper.com/design/video-indies-resist-the-urge-to-juice-it-or-lose-it-)). Check that enemies, bullets, and other important things are still visible.
- For effects like shake that bother some people, make the strength tunable so players can adjust comfort.

```text
Add one effect after being hit: hitstop only.
- When an enemy bullet hits, freeze the game for tuning.juice.hitStopMs milliseconds. Keep drawing.
- If hits happen in a row, add the freeze times instead of taking the longest.
- Toggle on and off with tuning.juice.enabled.hitStop (for comparison).
- Put the number in tuning.ts and add it to the debug UI.
- Do not change other effects (shake, sound, particles) this time.
```

## Measure input latency

When you feel "this is slow to respond," measure to check if it is really latency.

| Method | What it measures | Notes |
|---|---|---|
| In-game measurement | Time from input event to result drawn on screen | Automated. Agents can run it. Does not include display latency |
| Browser Event Timing | Input delay and time to next frame | Standard API. `duration` rounds to 8 ms |
| Phone video | Input to appearance on screen, end to end | Time-consuming but includes display latency |

In-game example: record when the key is pressed, then measure the gap when the jump starts in the frame after rendering.

```ts
// src/latency.ts
const latencies: number[] = [];
let pressedAt: number | null = null;

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !e.repeat) pressedAt = e.timeStamp; // Event time
});

/** Call every frame after rendering in the game loop */
export function afterRender(jumpStartedThisFrame: boolean): void {
  if (pressedAt !== null && jumpStartedThisFrame) {
    latencies.push(performance.now() - pressedAt);
    pressedAt = null;
  }
}

if (new URLSearchParams(location.search).has('debug')) {
  (window as unknown as { __latencies: number[] }).__latencies = latencies;
}
```

With Playwright, press the key 20 times and check the median and worst case.

```js
for (let i = 0; i < 20; i++) {
  await page.keyboard.press('Space');
  await page.waitForTimeout(200);
}
const ms = (await page.evaluate(() => window.__latencies)).sort((a, b) => a - b);
console.log({ median: ms[Math.floor(ms.length / 2)], worst: ms[ms.length - 1] });
```

In a small test page, this gave values from a few milliseconds to a dozen. At 60 fps, one frame is about 16.7 ms. If the median is under one frame and the worst case is under two frames, the "slow to respond" feeling is likely caused by animation startup length or weak jump initial velocity, not latency.

PerformanceEventTiming has `startTime` (event time), `processingStart` (processing start), and `duration` (time to next frame, rounded to 8 ms). By default only events with `duration` over 104 ms notify, but you can lower the threshold with `durationThreshold` set to 16 or higher ([PerformanceEventTiming MDN](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming)). For fine-tuning game feel, the custom measurement above works better.

## Compare against reference games

An instruction like "make the jump feel like that game" is too vague for agents. Turn the reference game's behavior into numbers first.

1. Play the reference game, pick one behavior to copy (jump, dash, taking damage, etc.).
2. Record video, step through frame by frame, and count frames and positions.
3. Write a table and give it to the agent.

| Aspect | Reference (example) | Your game (example) |
|---|---|---|
| Ground to apex | 20 frames | 27 frames |
| Apex to landing | 14 frames | 27 frames |
| Apex height (body height ratio) | 2.4× | 2.4× |
| Button press to leaving ground | 2 frames | 6 frames |

Now you can say "shorten the rise, shorten the fall even more (raise fall gravity scale), cut 4 frames from startup animation." These are actual numbers. The numbers above are made up. At 60 fps, count frames as time (20 frames is about 0.33 seconds).

For your own game, use [state exposure](/en/agent-dev/verification-loop/) to output frame-by-frame coordinates and measure them. This is more reliable than counting from video and you can reproduce it.

## Show the agent play video frames

You usually cannot show agents video directly. Split the video into image frames and send those. Anthropic's docs say GIF plays only the first frame ([Vision](https://platform.claude.com/docs/en/build-with-claude/vision), as of September 2026). For continuous movement, split into still images.

Record with OBS, Playwright `recordVideo` (saved after the context closes), Godot `--write-movie`, or similar. Use ffmpeg to extract frames or arrange them in a grid.

```bash
# Extract 10 frames per second as numbered images
ffmpeg -i play.mp4 -vf fps=10 frames/%04d.png

# Extract 10 frames per second, scale to 300px width, arrange in grid (5 wide × 4 tall)
ffmpeg -i play.mp4 -vf "fps=10,scale=300:-1,tile=5x4" -frames:v 1 sheet.png
```

`fps` sets the output frame rate, and `tile` arranges the grid ([FFmpeg Filters](https://ffmpeg.org/ffmpeg-filters.html)).

Large images shrink if they exceed the limit: 1568px for the standard model, 2576px for Claude 4.7 and later. The grid above is about 1,500px wide, so it shrinks less.

```text
The attachment shows 1.9 seconds before and after a hit, one frame every 0.1 seconds (left to right, top to bottom). The hit happens at frame 4. Answer for each:
1. Which frames show a reaction in the enemy or player appearance before and after the hit?
2. How many frames does the screen shake take to stop?
3. Are there frames where bullets or enemies become hard to see right after the hit?
Then give three proposals for changes to tuning.juice values, with reasons. Do not apply changes yet.
```

Position and size from images are approximate (the Claude documentation notes that position output is approximate). Do not ask the image for exact measurements like "how many pixels is the shake." Instead, output camera position per frame and measure that. Images work better for "does the look feel right?"

## Iteration cycle example

Fictional example of refining jump feel.

| Round | What you say | What agent changes | Check |
|---|---|---|---|
| 1 | Rise is slow and heavy | Cut `jumpTime` from 0.55 to 0.45 seconds (height stays 3.2) | Try it: "Lighter but floaty on the way down" |
| 2 | Floats too much on the way down | Raise `fallGravityScale` from 1.0 to 1.6 | Try it: "Good" |
| 3 | Landing feels empty | Add a small landing effect and sound (one effect per request) | Try it: "Sound alone is enough" - turn off shrink |
| 4 | Jump sometimes does not come out at cliff edge | Extend `coyoteTime` from 0 to 0.08 seconds | Try it: "Now it comes out" |
| 5 | Feels slow to respond | Measure latency, median 12 ms. Cut startup from 6 frames to 2 | Try it: "Feels responsive now" |

The process repeats:

1. Play for about five minutes, find one thing that feels wrong, describe it (scene, sensation, direction, degree).
2. Agent proposes three numeric options (A, B, C) as presets.
3. Play and compare, pick one.
4. Update `tuning.ts` with the chosen values and commit.
5. Move to the next issue.

```text
For "Rise is slow and heavy," give three preset options in tuning.
- A: jumpTime 0.50, B: 0.45, C: 0.40. jumpHeight stays 3.2.
- Let keys 1, 2, 3 switch presets.
- Show the current preset name in a corner of the screen when switching.
- Write a test to check that jump apex stays within 3.1–3.3 cells for all three presets.
```

The final test is insurance: changing feel must not break the jump height, which might be baked into level design. Combine with [verification loop](/en/agent-dev/verification-loop/) bots to check that levels are still passable after adjusting.

Other people may not enjoy your personal tuning. [Playtest](/en/design/playtesting/) to see how others feel.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [The Art of Screenshake (Jan Willem Nijman, Vlambeer, INDIGO Classes 2013)](https://www.youtube.com/watch?v=AJdEqssNZ-U) — Talk showing how small changes build feel, with video
- [The Art Of Screenshake (Internet Archive)](https://archive.org/details/the-art-of-screenshake) — Interactive slides from the talk
- [Juice It or Lose It (GDC Europe 2012)](https://www.gdcvault.com/play/1016487/juice-it-or-lose) — Talk by Martin Jonasson and Petri Purho
- [Video: Indies, resist the urge to 'juice it or lose it' (Game Developer)](https://www.gamedeveloper.com/design/video-indies-resist-the-urge-to-juice-it-or-lose-it-) — Talk warning against over-juicing (GDC Europe 2014)
- [lil-gui](https://lil-gui.georgealways.com/) — Slider-based debug UI library
- [PerformanceEventTiming (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming) — API to measure input latency
- [Vision (Claude API Docs)](https://platform.claude.com/docs/en/build-with-claude/vision) — Image input, GIF handling, resolution limits
- [FFmpeg Filters Documentation](https://ffmpeg.org/ffmpeg-filters.html) — `fps` and `tile` filters
- [Videos (Playwright)](https://playwright.dev/docs/videos) — Video recording with `recordVideo`
- [Creating movies (Godot Docs)](https://docs.godotengine.org/en/stable/tutorials/animation/creating_movies.html) — Video creation with `--write-movie`
