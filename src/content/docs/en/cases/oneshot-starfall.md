---
title: Starfall — A case study of adapting Claude of Duty for a space RTS
description: Mike Luan adapted Matt Shumer's prompt and spent about 633 dollars to create a Homeworld-inspired space RTS with Claude Opus 5. This case study breaks down the prompt changes, costs, and modifications revealed in the commit history.
sidebar:
  order: 3
lastUpdated: 2026-09-29
---

## Overview

Starfall is a Homeworld-inspired space real-time strategy game (RTS—a game where you command multiple units in combat) created by Mike Luan in July 2026 using Claude Opus 5. The author adapted Matt Shumer's Claude of Duty prompt by changing only the game genre and reference title. Luan published detailed token counts and costs (approximately 633 dollars) on X. The game is playable in a browser and the source is published under the MIT license.

This article examines what was learned from analyzing the prompt differences, cost breakdown, and commits made in the days after release—what was missing from the initial one-shot output.

| Field | Details |
|---|---|
| Creator | Mike Luan (X: @mikeluan123, e01.ai) |
| Release date | Posted on X on July 27, 2026 (UTC). Repository published on July 28 |
| Model | Claude Opus 5 (README, repository description) |
| Tools / agents | "Multi-agent workflow" (phrasing in README). The name of the runtime environment used is not disclosed |
| Genre and scale | Space RTS. 13 ship types, TypeScript, Three.js, simulation at fixed 60 Hz |
| Hosted at | [Play: e01.ai/starfall](https://e01.ai/starfall/), [GitHub: e01-ai/starfall](https://github.com/e01-ai/starfall) (MIT) |

## What was built

The README lists these features (as of September 2026):

- 13 ship classes, from scout to a 2-km mothership
- Homeworld-style 3D movement—drag right to set the z-axis height of orders
- Formations, stance modes (hold / attack), control groups, fleet bar, area selection
- Production, research, resource gathering, enemy AI
- Thruster flames, curved trails, ion cannons, tracers, shields, multi-stage explosions
- Dynamic music that shifts with combat intensity

The art direction uses no image files. Ships are built using lofting—arranging cross-sections smoothly—and add hull details and mechanical parts within the triangle budget. Planets use noise, and the background nebula is baked into a cubemap, which also serves as ambient lighting, so ships are lit by the nebula. To render large fleets, identical ship shapes use `InstancedMesh` (rendering the same shape in a single draw call), and distant ships are replaced with billboards (flat polygons).

Audio only uses external assets. Music comes from OpenGameArt and sound effects from Kenney, both CC0 (public domain). After the X post claiming "Asset: none," a commit on July 28 replaced synthesized music with CC0 streaming audio. The commit message notes something to the effect that "two sawtooth waves are not music."

## What the prompt contained

The author published the prompt in [prompt.md](https://github.com/e01-ai/starfall/blob/main/prompt.md) and in an X [post](https://x.com/mikeluan123/status/2081727054928900211). The opening explicitly states it was adapted from "Matt Shumer's AAA prompt." The differences from the original are:

| Section | Claude of Duty | Starfall |
|---|---|---|
| Goal | Match the latest Call of Duty as an FPS | Homeworld-style, large-scale space RTS. Adds emphasis on "scale and grand scope" |
| Reference | An actual Call of Duty game | An actual Homeworld game |
| Division of labor, critic role, `/loop`, `ultracode` | Present | Nearly identical phrasing |
| Scope definition | None | "Only random mode needed; skip missions" |
| Additional requirements | None | Multiple ship types, UI, HUD, game mechanics, smooth controls, "highest quality" |
| Rendering instructions | "Three.js only" | Shaders for ships and effects, procedural textures, instancing |

Two insights emerge from the differences. First, one line is added to constrain scope: "missions not needed" reduces the volume of work. Second, for RTS-specific performance challenges (rendering hundreds of ships), the prompt names specific techniques—shaders, instancing—at the end. The FPS prompt had no equivalent line.

## How it was developed (agent operations)

The author states in the README and prompt.md: "No design document, asset list, or architecture specified upfront." Based on the first commit message, the structure follows a "contract-first" approach:

- Shared types go in `core/types.ts`, module interfaces in `core/contracts.ts`
- `core/registry.ts` is the single source of truth for all 13 ship definitions (weapon positions, engine positions, cost, research tree)
- Simulation runs at fixed 60 Hz; rendering only reads state and never modifies it

This mirrors the approach in Claude of Duty's ARCHITECTURE.md, where shared contracts are locked in first so agents can work independently. Because the prompt does not specify architecture, but the result has contract-first structure, the model appears to have designed the contracts itself (inferred).

### Cost

The README states "approximately 633 dollars for the first run."

| Type | Token count |
|---|---|
| Input | 68,600 |
| Output | 4,600,000 |
| Cache reads | 837,200,000 |
| Cache writes | 13,600,000 |

Output costs 25 dollars per million tokens (per [Anthropic](https://www.anthropic.com/news/claude-opus-5), as of September 2026), so output alone was about 115 dollars. The remaining 518 dollars comes from the input side, mostly from cache reads and writes. The run performed over 8 billion token reads from cache. This shows how accumulated context was read repeatedly over the course of a long execution. Execution time is not disclosed.

On X, commenters questioned whether that token count was sufficient (reported by explainx.ai, a secondary source).

## Results and limitations

The author noted in the video: "There are minor gameplay issues" (X post). Commits in the days after release reveal what the first output was missing. Here is a summary of issues from commit messages:

| Date (UTC) | Problem found | Details |
|---|---|---|
| July 26 | Game feel adjustments | Visual polish applied twice; camera feel, selection precision, minimap controls, production panel "appeared but did nothing" |
| July 26 | Rendering performance | Changed noise hash function to avoid `sin`, improving performance from 13 fps to 61 fps at 1440p |
| July 27 | Display corruption | Bloom from the sky spread across the entire screen; bullet trails were 38 times larger than ships; thrusters disappeared based on their own depth; no pan with mouse drag |
| July 27 | Selection mechanics | Selection box too small to see; clicking away from the bow of a 2-km ship still selected it |
| July 27 | Scaling | All ships covered by the same-sized billboard; mothership looked like "a brick wall." Command markers were 8.4 times too large |
| July 28 | Missing rendering | Thrusters invisible—not a shader problem, but WebGL feedback loop (reading from the texture being drawn to) discarded the entire draw call |
| July 28 | Audio | Replaced synthesized music with CC0-licensed music |

Notably, the missing thrusters issue could not be fixed in the first attempt (shader adjustment) and required a second fix to uncover the pipeline bug. This type of problem is not easy to find from visual critique alone. According to the README, `scripts/` includes tools to capture screenshots, inspect the running scene, read histogram data from images, and measure the effect of mouse input on the camera. Most fixes were discovered with these tools.

Game-level evaluation (balance, enemy AI strength, engagement) is not in public materials. No critic scores like those in Claude of Duty are published. Repository engagement as of September 29, 2026: 69 stars, 23 forks—much smaller than Claude of Duty (around 3,400 stars).

One secondary source has an update gap: explainx.ai wrote on July 28 that "the public repository could not be confirmed," but the repository was created that same day and is now public (GitHub creation date: July 28, 2026).

## What you can learn

### If you want to try it yourself

1. **Adapting a prompt to a different genre only requires changing the goal and reference title.** The division-of-labor, critic, and loop sections work as-is. This is concrete proof.
2. **Add one sentence to narrow scope.** Writing "missions not needed" or "random mode only" reduces the amount to build.
3. **Name genre-specific challenges in one line at the end.** For RTS, that is "large numbers of units," which means instancing ([Web game architecture](/en/agent-dev/web-game-stack/)).
4. **Use 633 dollars as a rough estimate.** Opus 5 input and output per-token costs are smaller; most of the expense comes from cache reads in a long execution ([Cost management](/en/agent-dev/cost-management/)).
5. **Plan for a few days of fixes after the first run.** Controls, scaling, and missing rendering are the kinds of issues you notice by playing the game yourself after release.

### To add your own identity beyond one-shot generation

Now that "missions not needed" is written, what is missing as a game is clear. See [Beyond one-shot generation](/en/agent-dev/from-one-shot-to-product/) for more detail:

- **Add game structure.** Define win conditions, missions, role differentiation by ship type (rock-paper-scissors mechanics), and resource trade-offs ([Core loop](/en/design/core-loop/)).
- **Polish controls.** Looking at the commit history, most fixes address controls and readability. Playing it yourself and fixing one discomfort at a time becomes the core of what makes it your own ([Game feel](/en/agent-dev/game-feel/)).
- **Let humans choose assets.** Music switched from synthesis to CC0 assets. Picking assets that match your vision is human work ([Procedural assets](/en/agent-dev/procedural-assets/)).
- **Set distance from the original.** Starfall explicitly states: "An independent homage that uses no art, audio, code, or trademarks from Homeworld" ([Copyright](/en/legal/copyright/)).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Starfall (playable)](https://e01.ai/starfall/) — Creator's public page, includes prompt and costs
- [e01-ai/starfall (README)](https://github.com/e01-ai/starfall) — Architecture, costs, features
- [prompt.md](https://github.com/e01-ai/starfall/blob/main/prompt.md) — The prompt used
- [Mike Luan's demo post (X)](https://x.com/mikeluan123/status/2081716631986983093) — Token count and cost breakdown
- [Mike Luan's prompt post (X)](https://x.com/mikeluan123/status/2081727054928900211) — Prompt release
- [Introducing Claude Opus 5 (Anthropic)](https://www.anthropic.com/news/claude-opus-5) — Model announcement and pricing
- [Claude of Duty (GitHub)](https://github.com/mshumer/Claude-of-Duty) — Original prompt
- [explainx.ai case study](https://explainx.ai/blog/opus-5-homeworld-space-rts-mikeluan-july-2026) — Secondary source
