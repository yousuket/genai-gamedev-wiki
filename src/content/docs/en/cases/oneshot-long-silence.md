---
title: THE LONG SILENCE — A space exploration game created with initial prompt and 24-hour /goal
description: A procedurally generated space exploration game created by Anshu Chimala with Claude Opus 5. This article explains the initial prompt, the 24-hour /goal prompt with a verification agent, and subsequent Blender usage, based on primary sources.
sidebar:
  order: 4
lastUpdated: 2026-09-29
---

## Overview

THE LONG SILENCE is a browser-based space exploration game created by Anshu Chimala in July 2026 using Claude Opus 5. The player pilots a spaceship, surveys star systems, lands on planets, and walks inside the ship.

The author states "ran continuously for 24 hours" and explicitly writes "not one-shot, but created in several stages." Both the initial prompt and the 24-hour `/goal` prompt for visual refinement are published in full on X.

This is a case study in adapting Claude of Duty's "comparison with reality as a critical agent" for a space game.

| Property | Details |
|---|---|
| Creator | Anshu Chimala (X: @anshuc, GitHub: achimala) |
| Release date | July 27, 2026 (UTC). Major updates on September 2-3 |
| Model | Claude Opus 5 (July development). September update commits show co-authorship by Claude Fable 5.1 and Claude Opus 5 (1M context) |
| Tools / Agents | Claude Code, `/goal`, parallel sub-agents, separate verification sub-agent, Blender MCP (per author's X posts) |
| Genre and scale | 3D space exploration. Procedurally generated galaxy, landing, ship interior walking. Initial commit added 54,228 lines. JavaScript approximately 2.4MB |
| Release location | [Play: longsilence.anshu.dev](https://longsilence.anshu.dev/), [GitHub: achimala/TheLongSilence](https://github.com/achimala/TheLongSilence) (MIT) |

## What was created

According to the README, the game contains the following (as of September 2026):

- Story: 4,000 years ago, 900 inhabited stars within 80 light-years fell silent in four days. The player pilots the research vessel Pale Seeker to investigate star systems and align with seven "resonators" to enhance the drive. Once all seven are collected, the "aperture" opens.
- Gameplay: Piloting, scanning, warping, planetary landing, ship interior walking, star chart, archive.
- Scale: One world unit equals 1 km. When dealing with a ship 0.1 units long among millions of star systems, a "floating origin" fixed to the ship and logarithmic depth buffer are used.
- Planets: Baked into cube maps at runtime (avoiding computing 20+ octaves of noise per pixel per frame). Atmosphere uses single-scattering raymarch.
- Rendering: Auto-exposure on GPU, custom bloom, lens effects, and AgX tone mapping. Render resolution scales between 0.62x and 2x based on frame time to maintain 60 fps.
- Travel: Uses analytical orbits synced to clock rather than simulation. Remains in correct position after warp or pause.

The README states it does not run on smartphones. Due to performance demands, it shows a "not supported" message rather than a simplified version.

The scope of "no external assets" has changed over time. The author's July X post stated "no external assets or code. Everything created by Claude." The current README notes that ground materials (textures, stone, leaves) were created with an image generation model and Blender and are included as images and small GLB files. No photographs or third-party files are used—this is the stated positioning.

## How the prompts work

There are two prompts, both available in full in a [reply](https://x.com/anshuc/status/2081801979131818412) on the author's X timeline. Rather than reproduce them in full, here is the structure:

### First prompt: Initial prompt (high reasoning strength)

This prompt asks the model to create a space exploration game in Three.js for an empty repository.

| Element | Content |
|---|---|
| Approach | Do not ask questions; decide the game mechanics yourself |
| Non-negotiable requirements | Visuals match AAA studio quality, photorealistic. No low resolution, low polygon, or plastic-like appearance. |
| Content | Pilot a spaceship. Walk inside the ship and operate controls. Can sit in the cockpit. |
| Quality | Refine every detail: graphics, story, sound, menus, HUD |
| Constraints | Do not bring in external assets or code (Three.js only) |
| Game loop | Fly, discover, learn, move toward a goal, have a reason to go to the next location. Do not impose tutorials. Balance the vastness and emptiness of space. |
| Verification | Test in the browser yourself; run to completion at 60 fps. When you think it is finished, take a screenshot. If it does not look like AAA or photography, improve visual quality. |

The game content (story, goals, mechanics) is left to the model. The only non-negotiable requirement is the appearance.

### Second prompt: 24-hour `/goal` prompt (highest reasoning strength)

Building on the initial output, this prompt sets a long-term goal for visual refinement.

- Keep procedural generation while pushing visuals to the limit. Divide work across parallel sub-agents.
- Make the universe feel "alive." Encounter other ships, land on planets, cutscenes without interruption.
- Use Blender. Read Blender skills and have sub-agents create high-quality models (cannot parallelize, so queue them). "I do not want to see blocky, obviously procedurally-generated objects."
- Search for glitches like z-fighting (surface flicker) and banding artifacts by compiling cutscenes and gameplay frames into a sheet and fixing them.
- Completion condition: Install an independent, impartial verification agent. The agent compares screens from AAA space games like Starfield with your own game and criticizes specifically. Do not consider the task complete until the agent says "equals AAA quality." Do not rewrite the agent's prompt to soften the criteria.

The author states this verification agent was inspired by Matt Shumer's Claude of Duty concept. The constraint against rewriting the agent's prompt is an addition the author made—it is not in Claude of Duty itself.

## How it progressed (agent operations)

According to the author's explanation, the process was as follows (X posts):

1. Create an initial version with the first prompt.
2. Have Claude Code install Blender MCP. "I found it myself and installed it," the author states.
3. Have it create a spaceship in Blender, and provide feedback until it improves.
4. Have it compile everything it learned into a skill. This becomes `.claude/skills/blender-hardsurface`, included in the repository.
5. Run the 24-hour `/goal`.

The author also describes how they participated during execution. Claude worked mostly autonomously while the author monitored from a smartphone, changing direction only a few times. For example, when Claude spent too much time on space and planets, the author refocused it on the ship interior. Most of the work progressed while the author was away or sleeping.

The `/goal` did not complete. The verification agent kept criticizing, and after running overnight the author manually stopped it. Afterward, a different Claude fixed several rendering bugs, recorded video, organized assets, and deployed.

The repository's `tools/` folder contains game verification utilities. `play.mjs` verifies piloting, scanning, warping, and other features with 17 assertions. `survey.mjs` photographs all showcase moments and outputs frame time and draw call counts. `levels.mjs` outputs statistics on frame brightness. The README explains the reason for metrics: "Saying it 'looks flat' does not advance the discussion, but saying '99th percentile is 165' does."

### September update

The repository history shows the July 27 initial commit (one large commit consolidating everything) and 49 commits from September 2-3 (including merges). In the September update, ground rendering changed from per-vertex computation to placement passes, reducing worst-case frames from 50 ms to 13 ms. Ground materials are now created with an image generation model and Blender scripts; the ship hull uses a subtractive Blender modeling approach. A tool was added to create side-by-side comparison videos of old and new versions (commit named "montage"). Commits carry "Co-Authored-By: Claude Fable 5.1" and links to Claude sessions.

## Results and limitations

- The verification agent never became satisfied. The goal was stopped incomplete (X post).
- After autonomous overnight execution, a separate Claude hand-fixed rendering bugs. A single run did not produce a recordable state (X post).
- Runtime is stated as "24 hours," but cost and token count are not published.
- Smartphone is not supported. Issue #3 reports the page displays incorrectly in Edge on Windows 11 (open as of September 29, 2026).
- Public materials do not evaluate gameplay fun. The README focuses on rendering and verification; whether the game loop (collecting seven resonators) is fun to play is not discussed.
- By September, the README shifted from "no assets" to "ground is made from materials created with an image model and Blender," inconsistent with the July description.

## What you can learn

### If you try it yourself

1. Divide into two stages. "Create the initial version" and "refine the visuals" as separate prompts. Comparing an incomplete skeleton to an AAA standard causes the verification agent and the creator to conflict constantly (this inference is speculative).
2. In the first pass, narrow non-negotiable requirements to one. This case study narrowed only appearance, delegating mechanics.
3. Place a verification agent and forbid rewriting it. The comparison target is a real AAA title. Full details are at [verification loop](/en/agent-dev/verification-loop/).
4. For long-running execution, define an end condition using `/goal`. If it does not end, the human stops it. This case took 24 hours.
5. Have it find glitches by compiling frame sheets. Z-fighting and banding are easier to spot when cutscene and gameplay frames are placed in a single image ([procedural generation assets](/en/agent-dev/procedural-assets/)).
6. Save external tool procedures as skills. The Blender MCP learning was saved as a skill and reused in the next run ([project instruction file](/en/agent-dev/project-instructions/)).
7. Monitor from a smartphone. The author left their seat and only adjusted direction ([parallel agents](/en/agent-dev/parallel-agents/)).

### To add uniqueness beyond one-shot generation

This case can serve as an example of adding custom tools and manual work after one-shot generation. The full picture is at [Beyond one-shot](/en/agent-dev/from-one-shot-to-product/) and [Adding uniqueness](/en/agent-dev/differentiation/).

- Accept the limits of procedural generation and mix in other methods. The author learned "stacking has a ceiling" and saved this insight as a skill. They made the ship hull in Blender and delegated ground materials to an image model.
- Decide the world and story yourself. The story in this case study (900 silent stars and seven resonators) appears to come from the model after the "refine the story" instruction in the initial prompt. Your game's uniqueness emerges when you decide this yourself.
- Validate the gameplay. The rendering evaluation is thorough, but the game loop's fun factor is blank. A step remains to play the game and adjust goal design ([core loop](/en/design/core-loop/)).
- Polish game feel. Visual elements like ship hull, cockpit, and engine fire received major updates in September—the initial output was only a starting point.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version created.
<!-- AUTO-UPDATE:END -->

## References

- [Anshu Chimala's demo post (X)](https://x.com/anshuc/status/2081801966158811506) — "Made in 24 hours continuous"
- [Anshu Chimala's prompt post (X)](https://x.com/anshuc/status/2081801979131818412) — Both prompts and full procedure in full text
- [achimala/TheLongSilence (GitHub)](https://github.com/achimala/TheLongSilence) — README, commit history, Blender skill, verification tools
- [THE LONG SILENCE (playable page)](https://longsilence.anshu.dev/) — Author's public page
- [Claude of Duty (GitHub)](https://github.com/mshumer/Claude-of-Duty) — The original prompt that inspired the verification agent
