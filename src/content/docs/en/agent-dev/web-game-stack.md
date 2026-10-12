---
title: "Web Game Technology Selection: Configurations Compatible with Coding Agents"
description: Compare Three.js, Babylon.js, PlayCanvas, Phaser, PixiJS, raw WebGL, and Godot/Unity Web output by agent compatibility, TypeScript and Vite, deployment options, and performance targets.
sidebar:
  order: 15
lastUpdated: 2026-09-29
---

## Overview

Browser-based games are well-suited for creation with coding agents. Code is entirely text-based, builds are lightweight, and you can capture and verify the screen through scripts.

This article compares the main options for browser games (Three.js, Babylon.js, PlayCanvas, Phaser, PixiJS, raw Canvas/WebGL, and Godot and Unity Web output) by their compatibility with coding agents. It also covers the choice between TypeScript and JavaScript, builds with [Vite](https://vite.dev/), deployment options ([itch.io](https://itch.io/), [GitHub Pages](https://pages.github.com/), [Cloudflare Pages](https://pages.cloudflare.com/)), and how to assess performance. Claude of Duty uses Three.js r180 and WebGL2, with `three` as the only runtime dependency, Vite for builds, and Playwright for screen verification ([GitHub](https://github.com/mshumer/Claude-of-Duty)). This article helps you select and adapt this configuration for your own game. For a broader comparison of game engines, see [Game Engine Comparison](/en/dev-env/engines/).

## Options Comparison

Versions and details are current as of 2026-09-29.

| Option | Version | License | Primary Use | Characteristics |
|---|---|---|---|---|
| Three.js | 0.186.1 (r186, 2026-09-24) | MIT | 3D | Offers both WebGL and WebGPU renderers. A 3D graphics library rather than a game engine; you write input and physics yourself |
| Babylon.js | 9.28.0 (2026-09-24) | Apache-2.0 | 3D | npm package is in ES6 format, so only used portions are bundled |
| PlayCanvas (engine) | 2.22.6 (2026-09-28) | MIT | 3D | Open-source engine built on WebGL2 and WebGPU. The editor is optional; use with `npm install playcanvas` |
| Phaser | 4.2.1 (2026-07-09) | MIT | 2D | Renders with both WebGL and Canvas. Supports JavaScript and TypeScript. Has an official MCP for AI coding tools ([AI Coding Tools](/en/dev-env/ai-coding-tools/)) |
| PixiJS | 8.21.0 (2026-09-17) | MIT | 2D | A 2D graphics library. Supports WebGL and WebGPU. You build the game framework (scene management, etc.) yourself |
| Raw Canvas 2D / WebGL2 | Browser standard | — | Small 2D, experiments | No dependencies. WebGL 2 has been available on major browsers since September 2021 |
| Godot Web output | 4.7 | MIT | 2D, light 3D | WebGL 2 only (Compatibility renderer). Godot 4 C# projects cannot be exported to Web |
| Unity Web output | Unity 6.3 | Unity license | 2D, 3D | No multithreading support for C#. Networking limited by browser constraints; direct sockets are not available |

Sources: each repository and npm pages ([three](https://www.npmjs.com/package/three), [@babylonjs/core](https://www.npmjs.com/package/@babylonjs/core), [playcanvas](https://www.npmjs.com/package/playcanvas), [phaser](https://www.npmjs.com/package/phaser), [pixi.js](https://www.npmjs.com/package/pixi.js)), [Godot Web output](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html), [Unity Web technical limitations](https://docs.unity3d.com/6000.3/Documentation/Manual/webgl-technical-overview.html), [WebGL2RenderingContext (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext).

## Agent Compatibility

The perspective is whether agents can drive the work independently.

| Aspect | Code-only options (Three.js, etc.) | Godot, Unity Web output |
|---|---|---|
| Entirely text-based? | Everything is code. Agents can read, write, and verify through diffs | Scenes are in text format, but the editor and official/community integrations (MCP) are involved ([Engine Comparison](/en/dev-env/engines/)) |
| Lightweight builds? | [Vite](https://vite.dev/) development server reflects changes immediately on save | An export step is needed (author's assumption; mediated through engine export) |
| Extensive documentation and training data? | As shown in the table below, Three.js stands out | Documentation centers on engine-specific languages (GDScript, etc.) |
| Easy headless verification? | Use Playwright to control the browser, capture screenshots and errors | Verify the final Web output the same way in a browser |

Documentation and training data volume cannot be directly measured. As a proxy, here are npm weekly downloads for each week of 2026-09-21 to 2026-09-27:

| Package | Weekly downloads |
|---|---|
| three | approximately 19.61 million |
| pixi.js | approximately 1.24 million |
| phaser | approximately 470,000 |
| @babylonjs/core | approximately 420,000 |
| playcanvas | approximately 120,000 |

Source: [npm public API](https://api.npmjs.org/downloads/point/last-week/three). These numbers include automatic builds and indirect inclusion from other libraries. However, Three.js's much higher volume suggests that articles, discussions, and samples are more prevalent, which likely means they are better represented in agents' training data (speculation).

Vite has features designed with agent compatibility in mind. The development server's `server.forwardConsole` detects AI coding agents and automatically forwards uncaught browser exceptions and `console.error` / `console.warn` messages to the development server logs ([Server Options](https://vite.dev/config/server-options)). Agents can read runtime errors without opening a browser.

## TypeScript or JavaScript

| | JavaScript | TypeScript |
|---|---|---|
| Ease | No configuration needed. Claude of Duty uses JavaScript (`.js`) | Requires `tsconfig.json` and type declarations |
| Effect on agents | Type errors only appear at runtime | Type errors are caught by the compiler before execution. This becomes a hint for fixes |

Claude Code's official documentation notes that with the type intelligence plugin for typed languages, type errors are reported automatically on every edit, and errors can be found without running the compiler ([Manage costs effectively](https://code.claude.com/docs/en/costs)).

My recommendation: if starting fresh, use TypeScript. However, [Vite](https://vite.dev/) only transpiles TypeScript to JavaScript and does not type-check. Type checking is done separately with `tsc --noEmit`, as the official documentation states ([Features (Vite)](https://vite.dev/guide/features)). Add this command before your build step.

## Building with Vite

[Vite](https://vite.dev/)'s latest version is 8.3.1 and uses Rolldown for builds. Node.js 20.19 or later, or 22.12 or later, is required ([Getting Started](https://vite.dev/guide/)).

```bash
npm create vite@latest my-game -- --template vanilla-ts
cd my-game
npm install three
npm install -D @types/three playwright
```

In your `package.json`, add `scripts` with commands that agents can run independently to verify their work (this is an example written for this article).

```json
{
  "scripts": {
    "dev": "vite",
    "typecheck": "tsc --noEmit",
    "build": "npm run typecheck && vite build",
    "preview": "vite preview",
    "test": "node --test",
    "shot": "node tools/capture.mjs"
  }
}
```

In the project instruction file, write "after making changes, run `npm run build` and `npm test`, then report the results" ([Project Instruction Files](/en/agent-dev/project-instructions/)).

[itch.io](https://itch.io/) requires relative paths, and [GitHub Pages](https://pages.github.com/) project sites are served under `/repository-name/`. To work on both, set `base` to relative in `vite.config.ts`.

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
});
```

### Screen Capture Script

A minimal script for agents to verify the screen. On the game side, after drawing the first frame, set `window.__READY__ = true`, and fix the random seed via the `?seed=` URL parameter. Claude of Duty's capture tool uses the same approach (waiting for a readiness signal before capturing).

```js
// tools/capture.mjs — Usage: node tools/capture.mjs shots/latest.png
import { chromium } from 'playwright';

const out = process.argv[2] ?? 'shots/latest.png';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

await page.goto('http://127.0.0.1:5173/?seed=1&capture=1');
await page.waitForFunction('window.__READY__ === true', null, { timeout: 60_000 });
await page.screenshot({ path: out });
await browser.close();

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('saved', out);
```

Claude of Duty's capture tool uses headless Chromium with GPU acceleration. In environments without a GPU, rendering is done in software and is slower (speculation). For the approach to verification, see [Verification Loop](/en/agent-dev/verification-loop/).

## Deployment Options

| Deployment | Limits (as of 2026-09-29) | Best for |
|---|---|---|
| [itch.io](https://itch.io/) HTML5 | ZIP must contain `index.html`. After extraction: up to 1,000 files, 500 MB total, 200 MB per file. Relative paths required | Releasing games, game jam submissions |
| [GitHub Pages](https://pages.github.com/) | Site up to 1 GB. Bandwidth approximately 100 GB/month (soft limit). Free hosting for online business operations not permitted | Prototypes, demos, portfolios |
| [Cloudflare Pages](https://pages.cloudflare.com/) | Free plan: up to 20,000 files, 25 MiB per file, 500 builds/month | Publishing with your own domain |

Sources: [itch.io HTML5 documentation](https://itch.io/docs/creators/html5), [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/). [Vite](https://vite.dev/) provides deployment steps for GitHub Pages and Cloudflare Pages ([Deploying a Static Site](https://vite.dev/guide/static-deploy)).

When using Godot Web output with threading enabled, the server must return `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers. For deployment options that do not allow header configuration, there is a workaround using Progressive Web App settings (service worker) ([Godot Web output](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)).

For choosing a deployment platform and monetization, see [Platform Selection](/en/monetization/platforms/).

## Performance Targets

Claude of Duty's README includes real-world measurements (Apple silicon laptop, 1512×982 resolution, DPR 2, highest quality, AI and shooting active during actual gameplay).

| | Before optimization | After optimization |
|---|---|---|
| fps (median) | 12–17 | 28–30 |
| fps (p99, worst 1%) | 4–9 | 14–17 |
| Worst frame | 728–1,236 ms | 66–82 ms |
| Shader compilation during play | 34–35 times | 0 times |
| Startup time | approximately 9–12 seconds | 3.7–4.6 seconds |

This is an example of "heavy 3D targeting AAA standards" and not representative of typical game goals. Key takeaways from these numbers:

- **Measure p99, not median**: even with 94 fps when the camera is still, the game was unplayable. Measurement code is in [Common Failures and Mitigations](/en/agent-dev/failure-patterns/)
- **Test at real-world resolution**: on high-DPI displays (DPR 2 and above), internal rendering resolution increases. With Three.js, cap it with `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` ([WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html))
- **Batch identical shapes into `InstancedMesh`**: when placing many copies of the same mesh, like trees or rocks ([InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html))
- **Pre-compile shaders**: render all materials you will use before the first frame
- **Use WebGL for rendering; WebGPU as an optional alternative**: according to MDN, WebGPU is not yet universally available on major browsers (not Baseline) and is HTTPS-only. Since Three.js has both renderers, you can start with WebGL and switch later

Performance budgets belong in the design document. See [Parallel Agent Development](/en/agent-dev/parallel-agents/) for the procedure.

## Configurations in Case Studies

One-shot generation examples often use Three.js. The following is based on Claude of Duty (confirmed from the repository) and a secondary source list from explainx.ai:

| Case | Configuration |
|---|---|
| Claude of Duty (Matt Shumer) | Three.js r180, WebGL2, [Vite](https://vite.dev/), JavaScript |
| Homeworld-style RTS (@mikeluan123) | Three.js (author's description; TypeScript also reported) |
| Desert exploration game | Babylon.js and WebGPU. Reported as approximately 14 hours, approximately 5 million tokens |

Source: [Top 10 Claude Opus 5 Game Prompts (explainx.ai)](https://www.explainx.ai/blog/claude-opus-5-top-10-game-prompts-july-2026). For details on each case, see [Claude of Duty Case Study](/en/cases/claude-of-duty/) and [Prompts and Results by Model](/en/cases/prompts-by-model/).

## Selection Guide

| What you want to build | Recommendation |
|---|---|
| 3D first-person or third-person game, one-shot generation experiment | Three.js. Abundant information and Claude of Duty uses it. Build physics and other features yourself |
| 3D with editor and engine features | PlayCanvas or Babylon.js |
| 2D action, puzzle | Phaser (with game framework). If you only need rendering, PixiJS |
| Small 2D experiment, game jam | Raw Canvas 2D and [Vite](https://vite.dev/) |
| Reuse existing editor work | Godot or Unity. Check Web output limitations first |

For genre-specific suitability, see [AI-Friendly Genres](/en/genres/ai-friendly/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Claude-of-Duty (GitHub)](https://github.com/mshumer/Claude-of-Duty) — Configuration with Three.js r180, WebGL2, Vite, and real-world performance measurements
- [three.js (GitHub)](https://github.com/mrdoob/three.js) — WebGL and WebGPU renderers
- [Babylon.js (GitHub)](https://github.com/BabylonJS/Babylon.js) — npm ES6 package
- [PlayCanvas Engine (GitHub)](https://github.com/playcanvas/engine) — Open-source engine using WebGL2 and WebGPU
- [Phaser (GitHub)](https://github.com/phaserjs/phaser) — 2D game framework
- [PixiJS (GitHub)](https://github.com/pixijs/pixijs) — 2D graphics library
- [three (npm)](https://www.npmjs.com/package/three) — Latest version and license
- [Vite: Getting Started](https://vite.dev/guide/) — Vite 8.3.1, Node.js requirements, commands
- [Vite: Features](https://vite.dev/guide/features) — TypeScript is transpiled only; type checking is separate
- [Vite: Server Options](https://vite.dev/config/server-options) — `server.forwardConsole` and `strictPort`
- [Vite: Deploying a Static Site](https://vite.dev/guide/static-deploy) — GitHub Pages and Cloudflare Pages
- [Exporting for the Web (Godot Docs)](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html) — Godot Web output limitations
- [Web technical overview (Unity Manual)](https://docs.unity3d.com/6000.3/Documentation/Manual/webgl-technical-overview.html) — Unity Web limitations
- [WebGPU API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) — WebGPU browser support
- [WebGL2RenderingContext (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext) — WebGL 2 browser support
- [HTML5 games (itch.io)](https://itch.io/docs/creators/html5) — HTML5 game upload requirements
- [GitHub Pages limits (GitHub Docs)](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) — Site capacity, bandwidth, and usage restrictions
- [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/) — File count, file size, and build frequency
- [Playwright: Screenshots](https://playwright.dev/docs/screenshots) — Screenshot capture
- [Top 10 Claude Opus 5 Game Prompts (explainx.ai)](https://www.explainx.ai/blog/claude-opus-5-top-10-game-prompts-july-2026) — One-shot generation case configurations (secondary source)
