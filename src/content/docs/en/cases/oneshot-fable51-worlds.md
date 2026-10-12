---
title: fable51-worlds — Creating a real city and a movie scene with a long spec-driven prompt
description: PhiloLabs created a 3D reconstruction of Union Square and a Death Star Trench Run using Claude Fable 5.1's agent swarm. We explain the spec-like prompt of about 1,590 lines, a reported cost of about 2 hours and 33 dollars, and the self-assessment methodology from primary sources.
sidebar:
  order: 5
lastUpdated: 2026-09-29
---

## Overview

fable51-worlds is a repository published by PhiloLabs on September 2, 2026. An agent swarm using Claude Fable 5.1 created real-world locations and movie scenes as 3D worlds that run on Three.js alone. Three worlds are included: Union Square in San Francisco, Higashiyama in Kyoto, and Death Star Trench Run based on a movie scene.

Unlike short goal-only prompts like Claude of Duty, the Union Square prompt is about 1,590 lines of specification. A comparison video showing the same task given to GPT-6 Astra is also included.

The game-like element is a playable cinematic of about three minutes: Trench Run. This article focuses on Trench Run, combined with the Union Square prompt and cost disclosure.

| Item | Details |
|---|---|
| Creator | PhiloLabs (the poster on Hacker News uses "we") |
| Release date | September 2, 2026 (UTC). GitHub creation and Hacker News post on the same day |
| Model | Claude Fable 5.1 (announced by Anthropic on September 1, 2026. Pricing: 10 dollars per 1 million input tokens, 50 dollars for output. As of September 2026) |
| Tools / Agents | "Agent swarm." Parallel sub-agents, screen verification with Playwright, independent critic agent. The execution environment name is not disclosed in public materials |
| Genre / Scale | 3D world generation. Union Square is 453 buildings, Trench Run is about 18,000 lines (TypeScript and GLSL) |
| Release location | [GitHub: PhiloLabs/fable51-worlds](https://github.com/PhiloLabs/fable51-worlds) (MIT). The README does not offer a hosted version; run it with `npm install` and `npm run dev` |

## What was created

### Death Star Trench Run

According to the README, a three-minute-twelve-second cinematic based on a scene from the movie Star Wars, where the "trench run" in the middle is playable (as of September 2026).

- The stage scale is 1 unit equals 1 meter. A fortress 100 km in diameter, a trench 30 km long, 124 m wide, and 105 m deep, curving along a great circle
- 12 phases and 30 camera shots. Approach, formation, enemy interception, dive, trench entry, playable run, targeting, torpedo, escape, six stages of destruction, and aftermath
- Controls are WASD, Q/E for roll, Shift for boost, Space for laser, F for torpedo, C for autopilot. At the start, choose between "Launch" (pilot from the trench) and "Cinematic" (fully automated)
- Texture, models, and audio files are not used; everything is generated from code

The use of "based on a movie scene" is a notable point. According to the README, the input is a video clip, and the brief (work instructions) created from it are published in full in [PROMPT.md](https://github.com/PhiloLabs/fable51-worlds/blob/main/death-star-trench-run/PROMPT.md). How the brief was created from the video (by a human or a model) is not described.

### Union Square

A 3D recreation of the Union Square area in San Francisco (about 800×720 m) that can be walked through. According to the QA report, the scale is as follows.

| Item | Number |
|---|---|
| Buildings loaded from map data | 453 (OpenStreetMap) |
| Identified shops | 129 (only Apple and Nintendo interiors are accessible) |
| Pedestrians and vehicles | 220 people, 109 vehicles |
| Generated 3D models (created offline in Blender) | 206 files, 5.1 MB |
| Screen comparison tests | 147 sheets from 14 runs |

At runtime, only Three.js is used; Blender is used as a Python library only for asset generation beforehand.

## Prompt structure

### Union Square: about 1,590 lines of specification

[PROMPT.md](https://github.com/PhiloLabs/fable51-worlds/blob/main/union-square-sf/PROMPT.md) is a completely different form from Claude of Duty (about 150 words). The author explained on Hacker News: "It is one-shot output, but with a very long prompt that clearly instructs the use of sub-agents and self-QA loops." The key points of the structure are as follows.

| Section | Content |
|---|---|
| Experience definition | Union Square is visible when opened. By this point, it is clear this is a real city |
| Quality goals | "Not a toy, not just a few representative buildings" |
| Investigation phase | Use Google Earth, photos, and official pages as reference materials, researched in parallel. However, Google's 3D data and images are not included in the deliverable |
| Parallel reconstruction | Square, west, east, north, and south streets, shop list, Apple, and Nintendo, each with dedicated agents |
| Asset generation | Architecture, street fixtures, retail, vehicles, plants, each with dedicated agents |
| Content specification | Three levels of buildings (mass, facade, street level), shops, interiors, pedestrians, cars, cable cars, time of day, materials, signs |
| Verification | Reviews by different roles: geometry, semantics (correct shops in correct locations), visual (architects, locals, technical artists, game environment artists, playability). Overlay with photographs |
| Process | Milestones 0 through 11. Parallelization is "mandatory." Each sub-agent is given a scope, modifiable files, deliverables, verification method, and maximum token budget |
| Exit condition | Continue until quality scores meet targets (geography 9, building distinctiveness 9, etc.). Do not ask humans |

Compared to Claude of Duty, the prompt itself serves as a specification that defines the content and verification mechanisms in detail. The instruction to set token budgets for each sub-agent is also useful as a cost management tool ([cost management](/en/agent-dev/cost-management/)).

### Trench Run: about 10KB instructions

[Trench Run's PROMPT.md](https://github.com/PhiloLabs/fable51-worlds/blob/main/death-star-trench-run/PROMPT.md) begins with specifications for Three.js, WebGL, GLSL, and TypeScript, and shows the overall flow (approach to destruction) with arrows. The next 17 sections specify X-wing, Death Star, trench, piloting, enemy aircraft, gun turrets, shader effects, torpedo, six stages of destruction, camera, post-processing, and performance. Eight types of agents share the work (aircraft, fortress shape, trench, shaders, enemy aircraft, piloting, camera, integration/performance), and it states: "Each agent owns a limited range of files."

Quality checks are done three times (shape and scale, gameplay and presentation, effects and final quality), and the final check concludes: "Do not claim completion until you run the entire sequence and confirm it visually."

A distinctive feature is that it explicitly forbids common failure modes, like "do not make destruction just a glowing sphere disappearing."

## Process (agent operations)

The README explains the workflow in four stages.

1. Investigation: Parallel investigation agents research maps, elevation, traffic, and shops, attaching sources and confidence to each data point (In Union Square, 11 investigation agents created 453 buildings from OpenStreetMap, 1,317 elevation points, 122 shops, etc.)
2. Asset generation: Scripts output components like exterior walls, street fixtures, vehicles, plants
3. Execution: A Three.js app assembles terrain, streets, buildings, crowds, and traffic from JSON specifications
4. Verification: Playwright runs the app, takes screenshots from fixed viewpoints, and compares them with photos of the same location. An independent critic role produces a report for the next round of fixes. "The creator does not score their own work"

For Trench Run, [CONTRACTS.md](https://github.com/PhiloLabs/fable51-worlds/blob/main/death-star-trench-run/CONTRACTS.md) documents the promises of parallel workers. Scale, coordinate transformation functions for the trench, and common components (randomness, object pools, GLSL snippets) are fixed first, and hand-written trigonometry is forbidden. This is the same approach as Claude of Duty's ARCHITECTURE.md and Starfall's `core/contracts.ts`. For verification, `window.__demo` enables fixed-timestep playback and locked camera, so photography produces the same image every time.

### Cost and time

| Target | Time | Tokens | Cost | Source |
|---|---|---|---|---|
| Union Square | About 2 hours (using many sub-agents) | About 8 million | About 33 dollars (API) | Author's Hacker News comment |
| Trench Run | Not disclosed | Not disclosed | Not disclosed | — |

The Union Square figures are self-reported by the author and are not in the repository record. Fable 5.1 pricing is 10 dollars per 1 million input tokens and 50 dollars for output, with cache read-back at 0.25 dollars ([Anthropic](https://www.anthropic.com/claude/fable), as of September 2026).

## Results and limitations

### Self-assessment and remaining issues

The Union Square QA report includes a second-round score from an independent critic role, unmodified against targets.

| Item | Score (out of 10) | Target |
|---|---|---|
| Geographic accuracy | 7.5 | 9 |
| Building distinctiveness | 5.5 (estimated 6.5 after fixes) | 9 |
| Shop accuracy | 6 | 9 |
| Street detail | 6 | 8.5 |
| Materials | 6 | 8.5 |
| Usability | 7 | 8.5 |
| Performance | 6 | 8.5 |

All items fell short of the prompt targets. For shops, more than 30 unidentified addresses remain in the list.

The main defects in Trench Run are documented in the README's "defects found by visual QA."

- All PBR materials were emitting bright white. Two modules misunderstood the Three.js specification (emissive default value), causing the entire scene to blow out white
- Air combat did not work. The player is more than 4 times faster than the enemy, which did not engage from 20 km behind
- Camera lag. Following the fast target slowly, wingmates did not appear on screen
- Holes in the fortress (the trench was carved but appeared to penetrate from a distance)
- The player passed the exhaust port before the torpedo

Remaining issues include the screen approaching white at peak destruction, shockwave not spreading at the intended speed, and camera crossing taking less than 0.5 seconds, making it impossible to photograph.

### Performance

Measured on Apple M5 Pro headless Chrome (README).

| Phase | fps | Triangle count |
|---|---|---|
| Approach | 81 | About 550,000 |
| Trench run | 98–110 | About 1.9–2 million |
| Destruction peak | 41 | About 200,000 (render resolution is automatically reduced due to additive blending covering the entire screen) |

### Model comparison and third-party reactions

The README includes a side-by-side video comparing the result to one given to GPT-6 Astra. It states: "Conducted under the same conditions, and the Astra world was finalized before seeing Fable's video," but the comparison was done by the author, and no evaluation scores are provided. On the Astra side, four meshes were explicitly created using Blender MCP.

On Hacker News (September 2, 2026, 327 points), reactions included:

- Criticism that the title "World Modeling" is misleading
- Questions about building topology and texture quality. The author replied that code-generated worlds have structurally clean topology, but textures are still a challenge
- Complaints that overlay images did not align
- Conflicting personal opinions: "Opus 5 can do the same thing and cheaper" versus "fine detail precision goes beyond Opus 5 when it increases"
- Opinion that one world at 33 dollars is not yet usable for games

As a game, Trench Run's README lacks win conditions, scoring, and failure conditions, positioning it as a "playable cinematic."

## What you can learn

### To try it yourself

1. Know that there are two types of prompts: short goal-only prompts and spec-like long prompts. Claude of Duty is about 150 words, leaving the content creation to the model. Union Square is about 1,590 lines, specifying research, role assignment, verification, and exit conditions. Guidance on choosing the level of prompt detail is organized in [prompt patterns](/en/agent-dev/prompt-patterns/)
2. Explicitly forbid common failure modes. For example: "do not make destruction just a glowing sphere disappearing"
3. For each sub-agent, decide the scope, modifiable files, deliverables, verification method, and maximum token budget
4. Separate creation roles from evaluation roles. An operations practice of not adjusting critic scores to match targets, leaving them as-is, becomes the entry point for the next round of work ([verification loop](/en/agent-dev/verification-loop/))
5. Create a system that can play back with fixed timesteps and capture identical images every time, from the start
6. Cost estimate: one city takes about 2 hours, about 8 million tokens, about 33 dollars (author's report)

### To show uniqueness beyond one-shot

- Add gameplay. The weakness of this case is the lack of game design. The README states: "The world is the foundation; the purpose lies above it," and the author themselves place the next stage on a roadmap. If you build your own, decide the core loop on this foundation and add it there ([core loop](/en/design/core-loop/), [beyond one-shot](/en/agent-dev/from-one-shot-to-product/))
- Tailor the subject to your own location or preference. The ability to create from real places, video, and photos means input changes lead to world changes. Using your local city or your own video as input makes your work harder to overlap with others' ([showing uniqueness](/en/agent-dev/differentiation/))
- Make quality targets numeric and record achievement. Numeric scores show where to make improvements next
- Decide how to handle reference material. This case splits it: map data license (OpenStreetMap is ODbL), photos are not redistributed, movie video and audio are not used ([copyright](/en/legal/copyright/))

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [PhiloLabs/fable51-worlds (README)](https://github.com/PhiloLabs/fable51-worlds) — Three worlds, workflow, model comparison
- [death-star-trench-run (README)](https://github.com/PhiloLabs/fable51-worlds/blob/main/death-star-trench-run/README.md) — Trench Run content, performance, defect log
- [death-star-trench-run/PROMPT.md](https://github.com/PhiloLabs/fable51-worlds/blob/main/death-star-trench-run/PROMPT.md) — Brief used
- [union-square-sf/PROMPT.md](https://github.com/PhiloLabs/fable51-worlds/blob/main/union-square-sf/PROMPT.md) — Union Square spec-like prompt
- [union-square-sf/FINAL_QA_REPORT.md](https://github.com/PhiloLabs/fable51-worlds/blob/main/union-square-sf/FINAL_QA_REPORT.md) — Self-assessment and unresolved items
- [Hacker News: Fable 5.1 World Modeling](https://news.ycombinator.com/item?id=49541458) — Author's comments (cost and time) and discussion
- [Claude Fable 5.1 (Anthropic)](https://www.anthropic.com/claude/fable) — Model and pricing
