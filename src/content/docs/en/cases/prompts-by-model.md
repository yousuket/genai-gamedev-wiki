---
title: What models, prompts, and results - a cross-case comparison
description: Compare 12 case studies across prompt types, models, deliverables, and time and cost. A quick reference table to find the prompt approach closest to your goal.
sidebar:
  order: 20
lastUpdated: 2026-09-29
---

## Overview

Reading case studies one by one makes it unclear what you should write yourself. This article lines up 12 case studies and compares them by **prompt type**, **model**, **deliverables**, and **time and cost**.

The numbers in the table are only those the creators published publicly. Items not disclosed are marked "not public." Details for each row are in the linked case study article.

## Prompts can be categorized into five types

| Type | Content | Best for | Examples |
|---|---|---|---|
| A. Goal + comparison + critic role | Write the goal briefly, place a critic role to compare against the actual result, and iterate until satisfied (about 150 words) | Raising visual quality quickly. Producing amounts of implementation that would be hard to do manually | [Claude of Duty](/en/cases/claude-of-duty/), [Starfall](/en/cases/oneshot-starfall/) |
| B. Design document | Write experience definition, research, task division, verification, and success criteria as a design document (about 1,590 lines) | Projects using real-world locations or existing works where accuracy matters | [fable51-worlds](/en/cases/oneshot-fable51-worlds/) |
| C. "Non-negotiable constraints" + autonomous execution | Fix one constraint (like visual style), then let the model run for extended time without intervention | Let the model figure out the content | [THE LONG SILENCE](/en/cases/oneshot-long-silence/) |
| D. Concept in one line + play and iterate | Give the concept in a single sentence, let the model handle design and implementation, and relay playtest feedback directly to fix it | Build something playable quickly, then refine the feel by hand | [Grumbulus](/en/cases/browser-grumbulus/), [fly.pieter.com](/en/cases/postmortem-fly-pieter/) |
| E. Requirements clarified by questions + staged implementation | Have the model create a spec, plan, and todo list; then repeat implementation and commits on small chunks | Growing long-term. Making it easy to fix later | [claude-breakout-clone](/en/cases/browser-breakout/) |

These types are not mutually exclusive. [A Game About Capybaras Delivering Food](/en/cases/browser-capybara/) combines building tools first (closer to type D) with instruction file rules (type E).

## By model

### Claude Opus 5 (July 2026)

| Case study | Prompt | Deliverable | Time and cost (published) |
|---|---|---|---|
| Claude of Duty | Type A. About 150 words in English, 3 paragraphs | About 55,000 lines of 3D FPS. The creator noted it "doesn't reach Call of Duty" standards | "Several hours," cost not disclosed |
| Starfall | Type A (variation of above). Adds one line to narrow scope and RTS-specific rendering instructions | Space RTS with 13 ship types. Multiple fixes in days after release | About $633 (creator's post) |
| THE LONG SILENCE | Type C. Initial prompt and 24-hour `/goal` with a judge role | Procedural-generation space exploration. First commit added 54,228 lines | 24 hours. Cost not disclosed |

### Claude Fable 5.1 (September 2026)

| Case study | Prompt | Deliverable | Time and cost (published) |
|---|---|---|---|
| fable51-worlds | Type B. About 1,590-line design document and another file of about 10 KB | 3D recreation of Union Square (453 buildings), about 18,000 lines of Trench Run | About 2 hours, about 8 million tokens, about $33 (creator explanation on Hacker News) |

### Other models and tools

| Case study | Model / tool | Prompt | Deliverable | Time and cost (published) |
|---|---|---|---|---|
| A Game About Capybaras Delivering Food | Claude Code (Opus 4.7) | Full text not public. Editor creation request and adjustment slider rules published in fragments | About 27,000 lines, 188 commits of 3D delivery game. First place in Vibe Jam 2026 | About two weeks |
| Grumbulus | Claude (version not specified) | Type D. Started with concept only | About 15,000 lines of 2D game | Grew through 2 days of playtesting |
| Plug & Prosper | Codex CLI, GPT 5.6 Sol (creator's statement) | Not public | Hand-made 5-level 2D puzzle. First in 126 jam entries, "fun" ranked 11th | Not public |
| claude-breakout-clone | Claude Opus 4, then Sonnet 4 (July 2025) | Type E. Spec, plan, and chat logs all public | Breakout with power-ups | About 4 hours, 47 commits |
| fly.pieter.com | Cursor (Claude, server: Grok 3) (February 2025) | Type D. Started with "3D flying game with skyscrapers," one sentence | Playable in about 3 hours, multiplayer in about 8 hours | About $87,000/month in ad revenue (creator's post) |
| CODEX MORTIS | Claude Code (Opus 4.1, 4.5) | Not public | Bullet-hell survivor. v1.0 has 200 spells and 14 stages | About 3 months to first playable |
| Patent Tycoon | ChatGPT, Codex, Claude Code | Not public | About 90,000 lines of management sim | About 3.5 months to demo, about 7.5 months to release |
| Caldra | Codex, Cursor | Not public | Online card battle game with about 60 card types | About 1 year 10 months |

## Key takeaways

**1. Even within the same generation of model, how you write a prompt changes what you get.** The three Opus 5 examples from July 2026 all started with "a short goal and a critic role comparing against reality." What they produced varies widely by genre—FPS, RTS, space exploration.

**2. Cost varies by nearly 20x in published figures.** From about $33 (about 2 hours, about 8 million tokens) to about $633. The case with the longest prompt (about 1,590 lines) is on the cheaper end. Prompt length and cost do not correlate. In fable51-worlds, each sub-agent has a token limit set in advance.

**3. Many case studies do not publish their prompts.** Cases that went to product release almost never publish the prompt itself. Instead, they document the process, instruction granularity, and how things went wrong.

**4. Even across generations, the process is similar.** [claude-breakout-clone](/en/cases/browser-breakout/) and [fly.pieter.com](/en/cases/postmortem-fly-pieter/) from 2025 predate current models. Yet both center on a loop of playing and fixing—no different from 2026 examples.

## How to choose a prompt approach

| Goal | Choose type | Start with |
|---|---|---|
| Raise visual quality in one pass | A (comparison + critic role) | [Claude of Duty](/en/cases/claude-of-duty/) |
| Recreate a real place or work accurately | B (design document) | [fable51-worlds](/en/cases/oneshot-fable51-worlds/) |
| Let the model figure out the content | C (constraints + long run) | [THE LONG SILENCE](/en/cases/oneshot-long-silence/) |
| Build fast and refine feel by hand | D (one line + play and iterate) | [Grumbulus](/en/cases/browser-grumbulus/) |
| Grow over time and keep it fixable | E (clarify by questions) | [claude-breakout-clone](/en/cases/browser-breakout/) |

Prompt writing patterns are covered in [Game development prompt patterns](/en/agent-dev/prompt-patterns/). The path from one-shot to product is covered in [From one-shot to product](/en/agent-dev/from-one-shot-to-product/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version created.
<!-- AUTO-UPDATE:END -->

## References
- [Claude of Duty prompt (GitHub)](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md) — Source for type A
- [fable51-worlds (GitHub)](https://github.com/PhiloLabs/fable51-worlds) — Source for type B
- [claude-breakout-clone (GitHub)](https://github.com/lmorchard/claude-breakout-clone) — Source for type E. Spec, plan, and chat logs are public
