---
title: Grumbulus — A 15,000-line 2D browser game built with Claude, starting from a single idea
description: A case study of building a playable 2D browser game by having Claude generate 21 files in parallel from just the concept "a storm cloud attacking a city", then refining it through 2 days of playtesting with minimal direction.
sidebar:
  order: 7
lastUpdated: 2026-09-29
---

## Overview

Grumbulus is a 2D browser game where you play as a storm cloud attacking city dwellers with rain, lightning, frost, and more. All graphics are drawn with Canvas and all sound is generated with Web Audio—no external assets are used.

The game was created by Grigory Sapunov (co-founder and CTO of Intento) and his son. They gave Claude just one-sentence concept: "a storm cloud attacking a city." The first one-shot generation was already playable, and after two days of playtesting, it grew into a game with six types of attacks, 24 types of pedestrians, and 35 achievements. What stands out is how the work after one-shot generation is documented with specific details, making it a valuable learning resource.

| Item | Details |
|---|---|
| Authors | Grigory Sapunov and son (shared in Substack publication "Gonzo ML") |
| Release date | March 25, 2026 (publication date of the case study) |
| Model | Claude (version not specified in the article) |
| Tool / Agent | Claude (mentions CLAUDE.md in the article; execution environment name not specified) |
| Genre / Scale | 2D action. About 15,000 lines of vanilla JavaScript, 25 files, no build process |
| Play | [Grumbulus — Storm Cloud Simulator](https://cloud-heavy-industries.com/grumbulus/) (source not published) |

## What Was Built

Based on the details in the author's article (as of March 2026):

- Six types of weather attacks that unlock as the game progresses (rain, lightning, frost, fog, tornado, aurora)
- 24 types of pedestrians with 4 bosses. Police chase you, military shoot dodgeable projectiles, scientists deploy shields
- 12 types of power-ups (5-slot inventory), 10 hidden combos
- 13 upgrade types, 35 achievements (10 hidden), 7 procedurally generated music tracks, 4 save slots
- Virtual resolution of 1280×720 scaled up on any screen. Playable by simply opening index.html in a browser

The personality in pedestrian dialogue is distinctive. For example, a scientist shouts about not yet publishing a paper on arxiv, and there are many other humorous one-liners.

## Prompt Content

The full initial prompt was not published. The author describes it this way:

- The initial concept given was only "I want to make a game about a storm cloud attacking a city"—no design document or technical specification
- Claude generated the design including four weather attacks, 14 pedestrian types, a wave system, procedurally generated sound, a parallax-scrolling city, and a 21-file JavaScript architecture
- The author said "implement it" and Claude generated all 21 files in parallel

After that, most prompts were simply "I played it and noticed something" statements. Examples from the article:

| Author's feedback (summary) | What happened |
|---|---|
| "Time warp slows me down too" | Fixed so the cloud and bullets stay real-time while only the world slows |
| "I can't find the boss" | Discovered it existed in the design but was never implemented in code |
| "Power-ups are weak" | Changed from "rain heals 2x speed" to "rain unlimited, zero cost" |
| "Frost and fog feel weak" | Added shattering damage radius to frost and damage amplification for fog |

The author's advice: express what is wrong, not how to fix it. Rather than "increase frost damage by 20%", saying "frost feels weak" leads to more interesting developments like cascading effects and area attacks. The author notes this approach yielded better results.

## Development Process (Agent Operations)

1. Give only the concept, let AI handle design and implementation. The design document was not written by hand first—Claude created it.
2. Generate 21 files in parallel. Each file was handled by a different agent, causing inconsistencies in method names and return types. Claude found and fixed 18 merge bugs before the first playtest.
3. Play, notice problems, request fixes. Each cycle took 2–5 minutes. This repeated dozens of times over two days.
4. Request specific features and adopt AI's expansion proposals. "Power-ups" yielded 8 types with a 3-slot inventory system. "More enemies" yielded police, military, scientists, special forces, and bosses.
5. Track changes in a checklist. Many interconnected systems exist (achievements, saves, etc.), so "Did you update the encyclopedia?" became the most frequent question. The same content was added to CLAUDE.md, but the author notes it is not always helpful (see [project instruction file](/en/agent-dev/project-instructions/))

## Results and Limitations

The author's article documents specific bugs discovered only during play:

- 15 features existed in data only. 15 behavior flags for pedestrians were defined but never referenced in code. The encyclopedia described non-existent behaviors.
- The shop currency was always zero because scores were retrieved after being reset.
- Aurora shared freeze status with frost, slowly wiping out all enemies.
- A hidden Norse god boss was drawn 3,000 pixels off-screen due to a coordinate error. It took 6 attempts to fix the drawing.
- Browser and CDN caching prevented testers from seeing fixes.
- Analytics (PostHog) was added later, making it hard to tell early where players died or whether they found hidden combos.

The case study is a personal account with no player metrics or play counts included.

## Lessons to Apply

### If you try this yourself:

- Even without a specification, AI can build a playable first version from a single sentence concept. Try this approach for one day as a lightweight experiment.
- Using vanilla JavaScript with Canvas and Web Audio removes asset hunting and build steps. Compare this with other stacks in [Web game technology](/en/agent-dev/web-game-stack/).
- After generating multiple files in parallel, audit file-to-file inconsistencies before playtesting. In this case, 18 issues were caught beforehand.
- If using data-driven design, it is worth checking from the start: "Is everything defined in data actually referenced in code?" Combine this with the thinking in [verification loop](/en/agent-dev/verification-loop/).

### To add identity beyond one-shot generation:

- Turn "weak" into "extreme" rather than "strong." The author notes that a 20% boost is forgettable, while extreme changes (like "12 seconds of unlimited lightning") create memorable fun.
- Add personality. Once pedestrians started talking, the game transformed from a score-grinding game into something worth showing friends.
- After the midgame, hold player interest through variety, not difficulty alone. Random wave modifiers, bounties, and bosses that counter player strategy are proposed by AI.
- Hide features so players discover them. Achievement descriptions are intentionally cryptic.
- Balance through play, not spreadsheets. The economy was reviewed 5 times, frost damage 3 times. See [game feel](/en/agent-dev/game-feel/) and [from one-shot to product](/en/agent-dev/from-one-shot-to-product/) for methods.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: First version created.
<!-- AUTO-UPDATE:END -->

## References

- [How We Built a Full Browser Game in Two Evenings with Claude](https://gonzoml.substack.com/p/how-we-built-a-full-browser-game) — The author's own case study. Prompt examples, bugs, and lessons.
- [Grumbulus — Storm Cloud Simulator](https://cloud-heavy-industries.com/grumbulus/) — The playable game.
