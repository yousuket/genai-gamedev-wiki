---
title: Patterns across case studies
description: Organizing 8 common patterns found across 12 case studies, with supporting examples and evidence for each.
sidebar:
  order: 21
lastUpdated: 2026-09-29
---

## Overview

Reading the 12 case studies side by side reveals patterns repeating across different genres and models. This article organizes 8 common points from those patterns, with examples as evidence for each.

## 1. Short prompts can produce working games. The difference is in the "verification mechanism"

The prompt for [Claude of Duty](/en/cases/claude-of-duty/) is about 150 words. No design document or feature list was provided. What was written were three things: the goal, the criteria for comparing against an actual game, and a critic role to judge by those criteria.

[THE LONG SILENCE](/en/cases/oneshot-long-silence/) also had only one non-negotiable condition: the visual style. [fable51-worlds](/en/cases/oneshot-fable51-worlds/) used about 1,590 lines of design document, defining the experience and responsibilities, plus a detailed review system where separate roles reviewed geometry, meaning, and visuals independently.

The difference is not length. **What matters is whether the agent has criteria to verify its own quality.** The detailed approach is documented in [verification loop](/en/agent-dev/verification-loop/).

## 2. Issues that the initial output lacks are found only through play

| Case study | Issues found only through play |
|---|---|
| [Starfall](/en/cases/oneshot-starfall/) | The production panel "displays but does nothing." The selection box is too small to see. The mothership looks like a "brick wall" at that scale. |
| [Grumbulus](/en/cases/browser-grumbulus/) | 15 features exist only in data but are never used in code. Shop currency stays at zero forever. |
| [fly.pieter.com](/en/cases/postmortem-fly-pieter/) | Network design flaws, bot behavior, modifications, and disk-filling logs. These problems appeared only after public play. |
| [Patent Tycoon](/en/cases/postmortem-patent-tycoon/) | Missing background graphics in the demo. About 70 players left within the first 10 minutes. |

Visual lists and feature inventories are mostly complete in the initial output. What is missing is **whether things connect and work together** and **whether they feel good to interact with**.

## 3. "Game feel" and "fun" are decided by humans

[Plug & Prosper](/en/cases/browser-plug-prosper/) placed first overall in a game jam with 126 entries, but ranked 11th in the fun category. The author's other three games placed 22nd, 39th, and 79th overall.

In [claude-breakout-clone](/en/cases/browser-breakout/), implementing multi-ball took 8 minutes, but tuning the behavior took about 40 minutes. Generation became fast, but the time to verify "does it work as intended" and adjust dominated the process.

The author of [A Game About Capybaras Delivering Food](/en/cases/browser-capybara/) instead of asking for "faster" development, created a rule requiring the agent to make all values adjustable via sliders. This approach expects humans to touch and decide the feel before finalizing. For details, see [Polishing game feel with agents](/en/agent-dev/game-feel/).

## 4. Uniqueness lives outside the game or in one rule

Flight, controls, and visuals that come out on the first pass tend to be similar no matter who requests them. In the case studies, the difference came from:

- **Subject matter matching the developer's expertise**: [Patent Tycoon](/en/cases/postmortem-patent-tycoon/) was created by a developer working in intellectual property law, making it a management sim about patents.
- **How it is sold**: [fly.pieter.com](/en/cases/postmortem-fly-pieter/) generates income from ad space and the author's existing audience, not the game price itself. [CODEX MORTIS](/en/cases/postmortem-codex-mortis/) explicitly marketed itself as "100% AI" and continued updating despite criticism.
- **One rule point**: [Caldra](/en/cases/postmortem-caldra/) centers on buying and selling cards mid-match to rebuild the deck on the fly.
- **Handcrafted parts**: Plug & Prosper included 5 hand-designed levels.

Strategy thinking is covered in [Differentiation beyond one-shot generation](/en/agent-dev/differentiation/).

## 5. Narrowing scope improves polish

The prompt for [Starfall](/en/cases/oneshot-starfall/) contains one line: "Random mode only, missions are not needed." This reduced the amount to build and let effort focus on the remaining quality.

The author of Plug & Prosper had the gameplay mechanics, presentation, and theme combination clearly in mind, which reduced the volume of design decisions given to the agent. Of the four games submitted to the same jam, the smallest in scope won first place.

The Capybara author judged that the game offers only 5 to 10 minutes of play and lacks content for hours, so decided not to sell on Steam. **Deciding what counts as a complete work is human work.** The article [Deciding scope](/en/getting-started/scope/) also offers guidance.

## 6. Agent self-evaluation is neither harsh nor lenient

The README for Claude of Duty states the author's own view: "it does not reach Call of Duty." The critic score rose only from 3.59 to 5.05 out of 10, and in blind comparison tests, every critic chose the original every time.

The QA report for fable51-worlds shows geography accuracy at 7.5 out of 9, falling short of the goal of 9.

**Self-scoring cannot serve as proof of reaching a goal.** The honesty about not meeting the target is what supports the credibility of both case studies.

## 7. Costs published so far vary by nearly 20 times

According to the [prompts and model list](/en/cases/prompts-by-model/), the range runs from about $33 (about 2 hours) to about $633. However, costs for Claude of Duty and THE LONG SILENCE are not published. Many projects that advanced to commercialization also do not publish their costs.

[Caldra](/en/cases/postmortem-caldra/) notes that even free releases incur monthly fixed costs for a game with a server. Cost estimation thinking is covered in [Cost and quota management](/en/agent-dev/cost-management/).

## 8. Those who keep records help others

[claude-breakout-clone](/en/cases/browser-breakout/) has nothing new in the game itself. However, by publishing the spec, plan, and conversation logs, it became a valuable example where readers can see "what to ask for when adding a feature" and "where you get stuck."

The developer of [Patent Tycoon](/en/cases/postmortem-patent-tycoon/) posted dev logs to note.com every day, and these logs became promotional material themselves. Recording your own work helps later when reviewing and revising, and also when publishing to reach an audience.

## Limits of this case collection

- Case studies are limited to what authors have published. Unsuccessful projects rarely get published, so they do not appear in this collection.
- Among the 12 cases, only 5 have published the full prompt or conversation logs (Claude of Duty, Starfall, THE LONG SILENCE, fable51-worlds, claude-breakout-clone).
- Only [fly.pieter.com](/en/cases/postmortem-fly-pieter/) has published sales figures as a number.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version created.
<!-- AUTO-UPDATE:END -->

## References

- [How to read case studies](/en/cases/) — List of 12 case studies
- [Prompts and model list](/en/cases/prompts-by-model/) — Comparison of types and costs
- [From one-shot to product](/en/agent-dev/from-one-shot-to-product/) — Development approach based on case studies
