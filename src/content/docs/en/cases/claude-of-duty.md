---
title: Claude of Duty — Aiming for Call of Duty-Level 3D FPS with a Single Prompt
description: Matt Shumer created a browser-based FPS with about 55,000 lines of code using Claude Opus 5 and a single prompt. This article explains the prompt structure, agent operations, results and limitations, and how to try it yourself using primary sources.
sidebar:
  order: 2
lastUpdated: 2026-09-29
---

## Overview

Claude of Duty is a first-person shooter (FPS) released by Matt Shumer on July 25, 2026 for browsers. A short prompt saying "create an FPS matching the latest Call of Duty in quality" was given to Claude Code, and Claude Opus 5 spawned many sub-agents to build it. The game consists of approximately 55,000 lines of code, with no images, 3D models, or audio files—everything is generated from code.

Right after release, people on X questioned whether it was fake. However, the author released the prompt and code under the MIT license. The README also notes that the game "does not" reach the level of actual Call of Duty, which is why it is used as a reference.

This article explains what was built, the prompt structure, agent operations, limitations, and how to try the same approach yourself.

| Item | Content |
|---|---|
| Author | Matt Shumer (@mattshumer_ on X) |
| Release date | July 25, 2026 (UTC). Demo video post on X, repository release, and prompt release on the same day |
| Model | Claude Opus 5 (author stated "Claude Opus 5 one-shotted this game" in an X post) |
| Tools / Agents | Claude Code, many parallel sub-agents, `/loop`, `ultracode` (per author's explanation article) |
| Genre / Scale | Browser FPS. About 55,000 lines, 11 subsystems, Three.js r180 (WebGL2), runtime dependency is `three` only |
| Publication | [GitHub: mshumer/Claude-of-Duty](https://github.com/mshumer/Claude-of-Duty) (MIT). No official hosting; run locally with `npm install` and `npm run dev` |

## What Was Built

The setting is a marketplace street about 120m square. Buildings have thick walls with interiors you can enter, and hundreds of props are placed around. According to the README, the content consists of these 11 subsystems (as of September 2026).

| Subsystem | Capabilities |
|---|---|
| render | HDR pipeline, cascaded shadow maps, GTAO (screen-space ambient occlusion), TAA (temporal anti-aliasing), bloom, motion blur, AgX tonemapping |
| materials | 19 types of surfaces (concrete, brick, rusted metal, wood, fabric, glass, etc.) generated on GPU. Tiles seamlessly |
| sky | Atmospheric scattering, time-of-day changes, volumetric fog and light rays |
| world | Marketplace street, modular building kit, interiors you can enter |
| physics | Custom implementation without a physics library. BVH (spatial partitioning), capsule character controller, ragdoll, multi-layer bullet penetration |
| player | Movement state machine (sliding, vaulting, leaning) |
| weapons | Weapons built from code, ADS (aiming), spring recoil, reload, ballistics (flight time and drop) |
| fx | GPU particles, bullet holes, tracer rounds, explosions |
| ai | Skinned enemies, nav mesh, perception, cover usage, ragdoll on death |
| ui | HUD (crosshair, hit marker, minimap, compass, kill feed) |
| audio | Audio synthesis with Web Audio. Gun sounds, reverb, 3D audio, occlusion |

Controls are WASD to move, mouse to look around, left-click to shoot, right-click for ADS, `R` to reload, `Shift` to sprint, `Ctrl` to crouch, `Space` to jump, and `Q`/`E` to lean.

The repository history shows 2 commits, with the first commit adding 185 files and 71,270 lines (including lock files and tools, which differs from the roughly 55,000 lines the author mentions). Since textures, meshes, and audio are created from code at runtime, the repository contains no assets. The fact that even the physics engine is custom-built is likely because ARCHITECTURE.md forbids adding new npm dependencies.

## The Prompt

The full prompt is published in [prompt.md](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md). It is written in English, about 150 words, in just 3 paragraphs. Rather than reproduce it entirely, I have organized what it contains into 4 roles (the third paragraph contains both end conditions and technical specifications).

| Role | Content |
|---|---|
| 1. Goal and quality standards | "Create an FPS matching the latest Call of Duty in quality," "perfectly," "all textures through physics in AAA quality" |
| 2. Division of labor and critical review | Assign tasks to sub-agents. Loop each item with `/loop`, and have a separate sub-agent review the visuals. This critic is "very harsh," and continue if it does not look AAA |
| 3. End condition | Compare with actual Call of Duty footage blind, deciding which is better. Do not stop until all critics are amazed |
| 4. Technology and execution method | Build with Three.js. Loop with `/loop`, end with "fan out sub-agents and ultracode" |

What is not written is important. No design document, feature list, asset inventory, architecture, or game rules are specified. Only "the goal," "quality standards (comparison with the real thing)," and "division of labor with a critic in place" are specified. In his explanation article, Shumer says that instructing implementation methods replaces the model's judgment with human judgment ([explanation of Gauntlet Loop](https://somethingbig.ai/gauntlet-loop)).

Shumer later named this pattern "Gauntlet Loop" (explanation at [Gauntlet Loop](/en/agent-dev/gauntlet-loop/), [X post](https://x.com/mattshumer_/status/2081830214384886228)). The explanation article centers on these ideas:

- Place a verifiable standard, such as a screenshot of the real thing. "Make it really good" is not a standard
- Let the commanding agent divide the goal into the smallest units that can be improved and judged individually
- Separate the building role from the evaluation role, and show the evaluation role only the actual output, not the explanation from the building role
- Do not put a boundary like "end after 3 rounds"

## Process (Agent Operations)

### Overview

In his explanation article, Shumer says he gave Claude Code a single prompt, touched nothing after that, and Claude ran for hours spawning many sub-agents. The exact runtime is not published. For large-scale runs, he recommends using `/effort` to select `ultracode`. Costs go up, but results are more likely to be good.

### Contract File: ARCHITECTURE.md

To prevent parallel agents from conflicting, the repository has [ARCHITECTURE.md](https://github.com/mshumer/Claude-of-Duty/blob/main/ARCHITECTURE.md). The beginning states "all agents must read this before writing code. This is the only coordination mechanism." The content is as follows:

- Each subsystem owns only its own directory and does not edit others
- Do not import modules from other subsystems; retrieve them at runtime using `ctx.get('fx')`
- Do not add new npm dependencies. Do not use external images, models, or audio
- Do not use `Math.random()` for random numbers; use seeded `ctx.rng` (to make screenshots reproducible)
- Do not allocate memory per frame. Clean up what you create
- After changes, the build must pass and screenshots must be capturable
- Common parts (`src/core/`, `tools/`, etc.) are owned by the commanding agent
- Fix the shared vocabulary of event names and surface types (concrete, metal, wood, etc., 12 types) in a table

Quality floor is also written. Do not create flat surfaces, do not use uniform lighting, do not make things too straight and clean, attach weight to all actions—4 points.

Who wrote this file is not confirmed in public sources. Issue #28 asks which files were prepared beforehand, but as of September 29, 2026, there is no answer. Shumer says "the prompt is one," and the explanation article (by Matt Paige on Substack) says "Claude wrote the architecture contract itself at the beginning." The latter is secondary information.

### Critics and Comparison Mechanism

According to the README, 11 independent critics (agents) scored the game by comparing its screen to actual Call of Duty footage on a scale of 10. The score progression was 3.59, 4.14, 4.05, 5.05. In blind A/B comparisons, all critics chose the actual Call of Duty screen in every round.

### Measurement Tools

To avoid taking the critics' words at face value, there are measurement scripts in `tools/`.

| Tool | Role |
|---|---|
| `baseline.mjs` | Take screenshots on a new page for each scene, making the image the same every time (reproducible capture) |
| `imagediff.mjs` | Compare pixel-by-pixel; end with failure if even one pixel differs |
| `profile.mjs` | Show frame time distribution (p50/p95/p99) during actual play and causes of hitches |
| `playtest.mjs` | Automatic movement and shooting for functionality checks |

The README says these tools are "the more interesting part than the game itself." Static camera measurements showed 94 fps, but actual play showed 12–17 fps with 728–1236 ms pauses. More than 34 shaders were compiling late during rendering. Pre-compiling shaders at startup (`prewarm.js`) eliminated the pauses.

### Scripted Performance Optimization Workflow

`tools/workflows/perf.js` contains a workflow script with 4 phases (removing clock dependencies, establishing verification gates, optimizing, measuring) for performance improvement. In each phase, agents are launched in parallel for each directory to ensure "visuals do not change by 1 pixel," verified by image comparison. The file contains "user requirements are literally '1:1, 100% identical.'" This suggests humans requested additional requirements at the optimization stage (speculation), but it is not clear from published sources whether this was in the same session.

### Sequential Over Parallel

The "process notes" in the README contain an interesting record. Six agents assigned to each directory in parallel work over 3 rounds only improved the score by 0.46, and screen-breaking defects actually increased from 60 to 47, then to 66. Tonemapping, sky, and indirect lighting are interconnected, so agents assigned in parallel broke each other's assumptions. With one agent per related concern, assigned sequentially in one pass, the score increased by 1.00 and defects dropped from 66 to 26.

Another record shows an agent going against instructions to find the right answer. Critics reported 3 rounds in a row that weapons appeared "without texture." Actually, diffuse reflection was too dark and specular reflection too strong. Previous rounds, responding to "too bright" feedback, lowered albedo and killed diffuse further. The right answer was to raise it instead.

## Results and Limitations

### Author's Own Assessment

The "Honest assessment" in the README states clearly that it does not reach Call of Duty (quote: "It does not."). 2 of 11 shots reached "CLOSE," the rest remain "AMATEUR." The weaknesses are written specifically in the README.

- Hands: Fingers look like boards; they do not look like gripping a weapon
- Materials: Up close, looks like noise, not a photograph. This is the limit of procedural textures
- Characters: Distant enemies look like mannequins
- Indirect lighting: An approximation, not true global illumination
- Frame rate: 28–30 fps on Retina

### Performance

Measured on an Apple silicon notebook (1512×982, DPR 2, ultra preset):

| Metric | Before optimization | After optimization |
|---|---|---|
| fps (p50) | 12–17 | 28–30 |
| fps (p99) | 4–9 | 14–17 |
| Worst frame | 728–1236 ms | 66–82 ms |
| Shader compilation during play | 34–35 times | 0 times |
| Startup | about 9–12 seconds | 3.7–4.6 seconds |

In an earlier optimization phase, triangle count increased from 5.9 million to 11.3 million due to art additions. The workflow goal was "p99 above 60 fps, every frame at or below 30 ms," but the final result fell short. It is also slow on other PCs. Issue #13 reports the game freezing on a notebook with Core Ultra 7, with a reply recommending running the browser on a dedicated GPU.

### Third-party Observations

- Audit PRs: Two days after release, 9 fix PRs (#4–#12) claimed to find defects via agent audits. Ragdoll limbs not pinned to the torso, spawn points inside tree trunks, compass blank depending on direction, enemy flanking permanently disabled after about 20 seconds, etc. (#4 and #5 are by daxdax89). As of September 29, 2026, none have been merged
- Cost: Issue #30 asks about token usage, but there is no answer. Official numbers for time, token count, and cost are not published
- Reproduction: Another user ran the same type of prompt overnight and hit session limits 3 times (Matt Paige on Substack; paywalled, only opening confirmed). This is a separate run, not the repository result

### As a Game

The README's feature list centers on technical elements (rendering, physics, AI, audio). Missions, progression, weapon unlocks, mode selection are not mentioned. What runs is a single marketplace level where you can fight enemies. The "gameplay" design was not included in the prompt; the goal was visual quality, so game fun and balance were not evaluation criteria.

### Discrepancies with Secondary Sources

| Secondary source statement | Primary sources (README, repository) |
|---|---|
| Runs in browser only, no install needed (baeseokjae) | Official requires `npm install` and `npm run dev`. Official hosting does not exist; third-party hosting (Issues #13, PR #18, etc.) |
| Compute shader particles (baeseokjae) | README says only "GPU particles." WebGL2 has no compute shaders |
| Sequential method was "one agent sequentially fixed everything" (baeseokjae) | "One agent per related concern" in sequential pass |
| "Full deferred rendering" (baeseokjae) | "MRT (depth, normal, velocity) pre-pass." No deferred mentioned |
| Explanation of each round score (baeseokjae) | README shows only score progression, not per-round details |

This article matches discrepancies to primary sources.

## What to Learn

### If you try it yourself

1. Use an agent environment. Shumer says you need an environment where you can open files, run code, take screenshots, and spawn sub-agents (Claude Code or Codex)—not just pasting into chat. See [AI Coding Tools](/en/dev-env/ai-coding-tools/) and [Parallel Agents](/en/agent-dev/parallel-agents/) for details
2. Decide on a standard first. Prepare something the critics can compare, such as a screenshot of a real game. If you cannot decide on a standard, finding the standard is part of the task, the author recommends
3. Start with a short prompt. Write only five things: goal, standard, division of labor, critics, and the instruction to not stop. Leave the design to the agent. The pattern is also organized in [Prompt Patterns](/en/agent-dev/prompt-patterns/)
4. Have it prepare measurement tools first. Screenshot capture, image diff, frame time distribution are ways to back up the critics' "looks good" with numbers ([Verification Loop](/en/agent-dev/verification-loop/))
5. Have it write a contract file. Fix directory ownership, prohibitions, and event names before running in parallel
6. Make progress visible. Shumer recommends having the agent update an HTML progress page that you can view on your phone
7. Have a cost estimate. Opus 5 pricing is 5 dollars per 1 million input tokens, 25 dollars per 1 million output tokens ([Anthropic](https://www.anthropic.com/news/claude-opus-5), as of September 2026). Claude of Duty cost is not published, but a related project (space RTS) cost about 633 dollars ([Cost Management](/en/agent-dev/cost-management/) has a summary)

### To add uniqueness beyond one-shot generation

Claude of Duty is specialized in "pushing visual quality closer to the real thing," with no gameplay design. Outputs from the same method look similar, so add uniqueness in this order. See [From One-Shot to Product](/en/agent-dev/from-one-shot-to-product/) and [Adding Uniqueness](/en/agent-dev/differentiation/) for details.

- Decide on the core loop. Humans decide what repeats and what is fun ([Core Loop](/en/design/core-loop/)). There is ample room to add objectives beyond shooting, missions, and progression
- Change the standard. Replace "Call of Duty" with "a scene from a movie I want to make" or "real reference from another genre," and the output direction changes. Examples exist where Shumer's pattern was applied to space RTS and genres beyond FPS
- Refine game feel by hand. Recoil, hit reaction, camera shake are hard for critics to evaluate from images ([Game Feel](/en/agent-dev/game-feel/))
- Target known weaknesses. Hands, characters, and materials are acknowledged as weak in the README. Examples like The Long Silence in the same category add other methods (Blender, etc.)
- Set performance goals and chase them. p99 60 fps was not reached. Use profiler metrics as targets and iterate
- Do not rely on code alone for visuals. If you bring in external assets, license checks are required ([Copyright](/en/legal/copyright/))

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version created.
<!-- AUTO-UPDATE:END -->

## References

- [mshumer/Claude-of-Duty (README)](https://github.com/mshumer/Claude-of-Duty) — Features, performance, self-assessment, process notes
- [prompt.md](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md) — Full prompt used
- [ARCHITECTURE.md](https://github.com/mshumer/Claude-of-Duty/blob/main/ARCHITECTURE.md) — Agent coordination contract
- [tools/workflows/perf.js](https://github.com/mshumer/Claude-of-Duty/blob/main/tools/workflows/perf.js) — Optimization workflow script
- [Issues](https://github.com/mshumer/Claude-of-Duty/issues) — Third-party questions, audit PRs, hosting reports
- [Matt Shumer demo post (X)](https://x.com/mattshumer_/status/2081054356405731740) — "Claude Opus 5 one-shotted this game"
- [Matt Shumer prompt post (X)](https://x.com/mattshumer_/status/2081100592689324502) — Prompt release
- [How to Run a Gauntlet Loop (Matt Shumer)](https://somethingbig.ai/gauntlet-loop) — Method explanation
- [Introducing Claude Opus 5 (Anthropic)](https://www.anthropic.com/news/claude-opus-5) — Model announcement and pricing
- [baeseokjae explanation article (in Japanese)](https://baeseokjae.github.io/posts/claude-of-duty-single-prompt-fps-2026/) — Secondary source
- [explainx.ai explanation article (in Japanese)](https://explainx.ai/blog/claude-of-duty-opus-5-procedural-fps-july-2026) — Secondary source
- [Matt Paige Substack (in Japanese)](https://mattpaige68.substack.com/p/claude-opus-5-built-a-playable-call) — Secondary source. Experience from a separate run
