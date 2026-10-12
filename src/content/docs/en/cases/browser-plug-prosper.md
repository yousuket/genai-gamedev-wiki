---
title: Plug & Prosper — Winning 1st Place at AI Browser Game Jam 4 with a "Complete Scope" Small Puzzle
description: Plug & Prosper, a Godot-made 2D puzzle game created by directing Codex CLI, won 1st place overall in AI Browser Game Jam 4 with 126 participants. This article organizes how to decide the scope of AI work based on the creator's postmortem and what made the game stand out.
sidebar:
  order: 8
lastUpdated: 2026-09-29
---

## Overview

Plug & Prosper is a puzzle management game where you run a charging shop, connecting cables and adapters to your customers' phones and devices. Cables move with physics simulation—moving one cable pulls the whole setup.

The developer (Small Loop Works) submitted four games to "AI Browser Game Jam 4" (August 1–18, 2026; 126 participants) following the theme "CHARGE!" Plug & Prosper, the smallest in scope of the four, unexpectedly won 1st place overall—the author said the result was "unexpected."

After the jam, the developer has continued updating the same game, making it possible to track "how to expand the game after release."

| Item | Details |
|---|---|
| Developer | RaresKeY (Small Loop Works) |
| Release date | Early August 2026 (development log posted August 2). AI Browser Game Jam 4: August 1–18, 2026 |
| Model | Creator listed in the GitHub registration issue (September 24, 2026): "Codex CLI, GPT 5.6 Sol xhigh, GPT Image 2, Lyria" (as of September 2026) |
| Tools / agents | Codex CLI, Godot |
| Genre and scope | 2D puzzle management. Five handcrafted levels and an infinite daily mode |
| Release location | [Plug & Prosper on itch.io (playable in browser; Windows/macOS/Linux versions also available)](https://smallloopworks.itch.io/plug-prosper). Source is not published |

## What Was Built

Based on the game's itch.io page (September 2026, version 1.3.11):

- Before customers' wait time runs out, drag floating plugs to matching sockets. Round plugs connect directly to wall sockets; other shapes require adapters
- Earn coins to buy adapters you will need next. Adapters can be reused after customers leave
- Five handcrafted "Workshop Path" levels. Start with simple connections, progressing to sideways gravity and updrafts
- "Kiosk" mode starts with four orders per day and a 30-second clock, gaining tools as days progress
- Six plug types, five adapter types. A unique customer roster with a collection book that fills as you meet them
- Supports saves, mouse and touch input, zoom, and reduced-motion settings

The game's "AI Disclosure" section on itch.io marks code, graphics, sound, and text as "AI Assisted."

## About the Prompts

Plug & Prosper's prompts have not been published. The developer's log contains no model names or prompt details.

What is known:

- Another game submitted to the same jam (Charge Grid) has a development log post with "~40 minutes from iterating the initial prompt" and a screenshot. The isometric power-plant builder reached this level of polish at that stage
- In the postmortem, the author writes that having a clear mental picture of the game's mechanics, presentation, and theme combination made it possible to give precise instructions to the coding agent and reduce the scope of decisions delegated to it. The explanation: being clear about what to build led to prompt precision

## Workflow (Agent Operations)

The flow drawn from the development logs:

1. On jam day one, the author laid out four interpretations of the "CHARGE!" theme side by side to compare: speed-focused Horizon Charge, tactical formation-building Charge Knights, infrastructure management Charge Grid, and cable-routing Plug & Prosper. The goal was to compare four different play styles (speed, formation, management, puzzle routing), not to ship all four
2. Initially Charge Grid was the lead, but Plug & Prosper was "made for the jam, then I pivoted in a different direction for the actual submission, but I liked it so I finished it and released it" (development log, August 2, 2026)
3. In the end, all four games were submitted to the jam
4. Asset handling shows care. Plug and socket graphics are cut into a 12-cell atlas (one image with all frames), and every connection point is specified by pixel coordinates in the original image. Although visually centered, this makes it possible to spot snapping, stacking, and cable curvature issues with a guide image
5. The clock, gravity compass, and shape-reader displays are rendered as code shapes projected onto the angled in-game equipment art. This is how code-drawn graphics are composited over the illustration

## Results and Limitations

From the developer's postmortem (development log, September 1, 2026, "The Scope Was Complete") and the jam results:

| Item | Details |
|---|---|
| Overall rank | 1st of 126 (10 votes) |
| Categories | 1st in theme, graphics, audio, and AI use. Theme rated 4.9/5 (highest) |
| "Fun" rank | 11th (lowest of all categories) |
| Developer's other three games | Charge Knights 22nd, Charge Grid 39th, Horizon Charge 79th |

- The author notes "vote count is small; I do not treat rank as a universal quality measure." Low vote count is a limitation
- Charge Grid, which stood out most in a pre-jam Discord survey, placed 39th—opposite to expectations
- After release, itch.io playtest feedback pointed to two issues: a results screen showing "all devices lit" even at 0/4 completions, and description text that did not match the current version. The author responded with a patched version addressing some points
- The game remains in development after release. Updates since version 1.2.0 (September 2, 2026) include 1.3.0 (new customers, a gravity-shifting day, batteries) and 1.3.5 (five-level Workshop Path)

## What You Can Learn

### If you try it yourself

- The approach of laying out multiple prototypes with different directions on jam day one and comparing their play before narrowing down is reusable. The author produced the first Charge Grid prototype in about 40 minutes
- The genre is a small 2D physics puzzle; the engine is Godot. It can be exported for the browser, so distribution is simple. For engine comparison, see [Engines](/en/dev-env/engines/)
- The tighter your own grasp of the technology you use, the more precisely you can instruct the agent and avoid delegating too many decisions, the author notes in the postmortem

### If you want to stand out after one-shot generation

- Build out a small, self-contained idea all the way. The author reframed the sense that "this game has small scope"—not as having no room to expand, but as having complete, well-defined boundaries
- Pick one tactile feel and nail it. In this game, "cables have physical presence" shifts the frame from a matching menu to a small workspace
- After release, use player feedback to refine clarity (tutorial, result-screen wording, description text)
- After release, add layers that extend play time. Post-jam updates added a daily-progress mode, upgrades, and a customer collection book

The general workflow for moving from one-shot generation to a finished product is documented in [From One-Shot to Product](/en/agent-dev/from-one-shot-to-product/) and [How to Create Differentiation](/en/agent-dev/differentiation/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version created.
<!-- AUTO-UPDATE:END -->

## References

- [Plug & Prosper (itch.io)](https://smallloopworks.itch.io/plug-prosper) — Play, feature descriptions, AI Disclosure, update history
- [The Scope Was Complete (Small Loop Works development log, September 1, 2026)](https://github.com/RaresKeY/devlog/blob/main/feed/posts/plug-charge-2026-09-01-the-scope-was-complete.json) — Developer's postmortem
- [Small Loop Works development log](https://rareskey.github.io/devlog/) — Public development journal including Charge Grid prototype work and asset atlas posts
- [AI Browser Game Jam 4 (itch.io)](https://itch.io/jam/ai-jam-4) — Jam rules (AI generates majority of content, playable in browser) and participant count
- [AI Browser Game Jam 4 results](https://itch.io/jam/ai-jam-4/results) — Overall rankings and category rankings
- [[Game]: Plug & Prosper (awesome-ai-built-games registration issue)](https://github.com/lappemic/awesome-ai-built-games/issues/47) — Developer listed tools used (Codex CLI, etc.)
