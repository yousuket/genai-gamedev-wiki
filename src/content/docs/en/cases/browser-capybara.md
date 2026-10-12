---
title: A Game About Capybaras Delivering Food — Browser Game Built in 2 Weeks with Claude Code, Winner of Vibe Jam 2026
description: An iOS engineer with no game development experience created this Three.js browser game in 2 weeks using only Claude Code (Opus 4.7) and generative AI for images, 3D, and audio. It won first place in Vibe Jam 2026, an AI-exclusive game jam.
sidebar:
  order: 6
lastUpdated: 2026-09-29
---

## Overview

A browser game where capybaras deliver fruit from a scooter, built with Three.js. The author is an iOS engineer with about 9 years of experience but had never made a game before.

The game was submitted to Vibe Jam 2026, a game jam where code must be written 90% or more by AI. It was completed in 2 weeks and won first place out of 945 entries (according to the official website) and a prize of $25,000. All code, logos, textures, 3D models, music, and sound effects were AI-generated. The author did the human work: "write prompts," "play and adjust game feel," and "find what is missing and have AI build tools to fill those gaps."

| Item | Details |
|---|---|
| Author | Leo (X: @leocooout) |
| Release date | Submitted to Vibe Jam around April 29, 2026 (author's X post). Winners announced June 17, 2026 (levelsio's blog) |
| Model | Claude Code Opus 4.7 (per author's article, as of September 2026) |
| Tools / Agents | Claude Code (plan mode, `.claude/rules`, game-creator skill). Images from GPT Image 2 and Grok; 3D models from Tripo3D; music and sound effects from Suno and ElevenLabs |
| Genre / Scale | 3D delivery action. About 2 weeks, 188 commits, roughly 27,000 lines of code (per author's article). Multiplayer support |
| Play | [Play here](https://capybara-vibejam26.leocoout.dev/) (source code not published) |

## What was built

The core loop has three parts (from the author's article).

1. Receive orders on a smartphone screen. Each order has a different difficulty; the more items, the more easily the load topples.
2. Enter a convenience store and collect items within a time limit. The floor is slippery and you bounce off walls.
3. Deliver packages loaded on a scooter cargo rack. Physics makes the load tilt; improper steering causes it to collapse.

Around this core, the game adds urban, suburban, and rural areas, landmarks like the Christ the Redeemer statue or Hollywood sign, day and night with rain, drift boost, and multiplayer where players race in the same city. The smartphone screen is made with CSS only. There is even a map app (CapyMaps) and a music app (Capify) that plays actual music in-game. The author notes the first smartphone UI was generated so well it could be used as-is.

## Inside the prompts

The full text of the prompts is not published. Here is what we can gather from fragments in the author's article and the approach used.

### Examples of published instructions

- Map editor request: "Claude, create an editor tool with terrain construction and an entire road system…" (from the article). The author asked for terrain brushes, procedural roads, streetlights, and sidewalks in one request.
- Tree drawing: Specifically instructed to place two flat planes, rotated 90 degrees to form an "X" shape (from the article).
- Adjustment UI request: Instead of asking AI to make something "faster" or "bigger," create a rule where all object numbers can be changed with sliders and saved to a config file.

### Project rules

The author placed the jam's regulations and "coding conventions important to this project but not obvious to the model" into Claude Code's `.claude/rules` file to avoid disqualification for rule violations. For how to write rules, see [project instruction files](/en/agent-dev/project-instructions/).

### Prompts for images

The protagonist was created by having Grok and GPT generate style sheets, narrowing down the choices, then generating artwork from three angles: front, back, and side. This serves as input for 3D modeling. The author writes that more angles mean the AI does not have to "guess."

## How to proceed (agent workflow)

The author writes that thinking, planning, and playtesting took more time than having the AI write code. The workflow is as follows:

- Basic approach: "I think, Claude researches and brainstorms, we plan, I approve, Claude generates, and I test."
- Use plan mode to have the AI create plan documents (as .md files) for each feature before implementation. You can reread the plans even if a session disconnects.
- Before planning, ask "please interview me first." This tends to lead to implementation aligned with the author's intent.
- Run 2–3 Claude Code sessions in parallel, each handling a separate code area. Always start new features in a fresh session without context; keep longer sessions for bug fixes, which need context (see [parallel agents](/en/agent-dev/parallel-agents/)).
- Did not use `/loop` (auto-repeat). Game feel is only knowable by playtesting yourself; auto-repeat wastes tokens and reduces quality.
- When something is missing, have the AI build that tool. The map editor, road builder, and cutscene timeline editor were all tools written by AI.

### Two-week progression

| Period | Work done |
|---|---|
| Week 1 | Player control and collision, package physics, convenience store, smartphone UI, order flow, weather, map editor, multiplayer, temporary sound effects |
| Week 2 | PS1-style aesthetic unification, retexturing with generated images, road builder enhancements, map creation, cutscene editor, 7-language support, submission thumbnail |

## Results and limitations

- Result: First place in Vibe Jam 2026. In levelsio's announcement, judges noted this year's games are much higher quality than last year's.
- Attempts to have AI generate entire maps failed. Images drawn in Grok were converted to 3D with Tripo3D, but fine details could not be controlled, geometry broke under magnification, and single-piece assets could not be optimized. Maps were ultimately built by hand with the editor.
- 3D model generation did not succeed on the first try. The bridge model required 20 attempts and still had fine-detail issues, per the article.
- Features the author found fun were poorly received by judges. The convenience store feels clunky and remains poorly rated even after the jam.
- The author forgot to request Ctrl+Z (undo), so the editor had no undo feature through week 2.
- For 7-language support, Claude's translations work well for languages the author understands; for other languages, a separate agent will verify later.
- The author states there are no plans to sell on Steam. The game takes 5–10 minutes to play and lacks the sense of progression and hours of content needed for a commercial release.

## What you can learn

### If you want to try it yourself

- Benchmark: With a coding agent on the level of Opus 4.7 and Three.js, you can reach a playable 3D game jam entry in 2 weeks, even with no game development experience. However, the author spent much of this time on brainstorming, planning, and playtesting.
- Code goes to one tool; images, 3D, and audio go to separate generative AI services. Splitting assets by specialized tools is an approach to consider with [procedural assets](/en/agent-dev/procedural-assets/).
- About cost: The author includes a cost breakdown. Secondary source wccftech reports an additional $100 on top of a plan increase of 5× to 20×.
- Getting started: Place the jam rules and other important conventions as rules first, create and approve plan documents for each feature, then implement.

### To stand out beyond one-shot generation

The author cited these sources of uniqueness:

- Game feel is decided by humans. The package physics started realistic but were changed to "if tilt exceeds a threshold, drop with X% probability," prioritizing fun over realism and giving the game its own feel. For details, see [game feel](/en/agent-dev/game-feel/).
- Build out the world. The map was hand-created, with the convenience store placed at the top of a visible mountain, according to the author's vision. The author writes that much of the game's uniqueness comes from the map.
- Layer in details. Capybara-themed apps, phone lock screens, landmark parodies—these small touches become the work's character.
- Build tools to create with. The author concludes that the biggest multiplier was not the game code itself but tools built by AI to make the game.

General steps from one-shot generation to a finished product are covered in [from one-shot to product](/en/agent-dev/from-one-shot-to-product/) and [how to stand out](/en/agent-dev/differentiation/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial publication.
<!-- AUTO-UPDATE:END -->

## References

- [How I made $25k in 15 days with a game built entirely by Claude Code (Medium, author Leo)](https://leocoout.medium.com/how-i-made-25k-in-15-days-with-a-game-built-entirely-by-claude-code-94b3b817f0ce) — The author's account of the creation process: tool stack, workflow, and two-week progression
- [Capybara Delivery (play)](https://capybara-vibejam26.leocoout.dev/) — Play the submitted game in your browser
- [leo's X post (submission)](https://x.com/leocooout/status/2049610251381756307) — Author's post: "Made it in 2 weeks and submitted to Vibe Jam 2026"
- [Vibe Jam 2026 winners and how the games are getting close to real production quality (levelsio)](https://levels.io/vibe-jam-2026-winners-quality) — Award announcements and judge comments (June 17, 2026)
- [Cursor Vibe Jam 2026](https://vibejam.com/) — Rules (90% code must be AI-generated, free, no login required), prize money, sponsors
- [vibej.am (list of entries)](https://vibej.am/2026/#games) — Play submitted entries
- [game-creator (GitHub)](https://github.com/OpusGameLabs/game-creator) — Three.js skill the author used with plan mode
- [An iOS Developer Vibe-Coded A "Capybara Food Delivery" Game… (wccftech)](https://wccftech.com/ios-developer-made-capybara-game-using-vibe-coding-and-won-25000/) — Secondary source. Summary of author's Reddit post and cost breakdown with plan changes
