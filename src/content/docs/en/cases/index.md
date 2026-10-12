---
title: Case Studies & Postmortems
description: 13 real examples of games created with coding agents. From primary sources, this page covers which model was used, what prompts worked, what was built, and where developers got stuck.
sidebar:
  order: 1
  label: How to Read This Collection
lastUpdated: 2026-10-05
---

## Overview

"Can you really make a game with a single prompt?" "If you can, what comes next?" To answer these questions, we have collected real examples from developers.

Every case study is verified through **primary sources** only: the creator's own posts, repositories, development logs, store pages, and similar. If a prompt is not public, we note that. Numbers such as revenue are included only if the developer has published them.

## Case Study List

### One-Shot Generation: Complete game from a short prompt

| Case Study | Date | Model | What Was Built |
|---|---|---|---|
| [Claude of Duty](/en/cases/claude-of-duty/) | July 2026 | Claude Opus 5 | A 3D FPS with about 55,000 lines of code. One prompt of about 150 words |
| [Starfall](/en/cases/oneshot-starfall/) | July 2026 | Claude Opus 5 | A Homeworld-style space RTS. A modified version of the prompt above. Cost about 633 USD |
| [THE LONG SILENCE](/en/cases/oneshot-long-silence/) | July 2026 | Claude Opus 5 | A procedural-generation space exploration game. 24 hours of autonomous execution |
| [fable51-worlds](/en/cases/oneshot-fable51-worlds/) | September 2026 | Claude Fable 5.1 | 3D recreations of a real city and a film scene. A design-document-style prompt of about 1,590 lines |

### Iterative Development: One-shot output polished through playtesting

| Case Study | Date | Model | What Was Built |
|---|---|---|---|
| [A Game About Capybaras Delivering Food](/en/cases/browser-capybara/) | April–June 2026 | Claude Code (Opus 4.7) | A 3D delivery game made in two weeks. Won first place in Vibe Jam 2026, an AI-exclusive game jam |
| [Grumbulus](/en/cases/browser-grumbulus/) | March 2026 | Claude | A 2D game of about 15,000 lines made from the single phrase "a storm cloud" |
| [Plug & Prosper](/en/cases/browser-plug-prosper/) | August 2026 | Codex CLI (creator's report) | A small puzzle game. First place overall in AI Browser Game Jam 4, but ranked 11th for "fun" |
| [claude-breakout-clone](/en/cases/browser-breakout/) | July 2025 | Claude Opus 4 / Sonnet 4 | Breakout game. Specification, plan, and conversation logs all public |

### Production Release: Shipped and sold to players

| Case Study | Date | Tool | Results (as disclosed) |
|---|---|---|---|
| [fly.pieter.com](/en/cases/postmortem-fly-pieter/) | February 2025 onward | Cursor (Claude, Grok 3) | Working in 3 hours. Sold ad space to earn USD 87,000 per month (annualized) in 17 days. Creator notes it did not sustain |
| [CODEX MORTIS](/en/cases/postmortem-codex-mortis/) | December 2025 onward | Claude Code | Sold on Steam marked "100% AI." 70 of 92 reviews were positive |
| [Patent Tycoon](/en/cases/postmortem-patent-tycoon/) | September 2025 onward | ChatGPT, Codex, Claude Code | A patent-trading sim released free on Steam. 221 launches 10 days after release, median playtime 14 minutes |
| [Caldra](/en/cases/postmortem-caldra/) | August 2024 onward | Codex, Cursor | An online trading-card game released free on Steam. About 1 year 10 months in development |
| [Regional Quests](/en/cases/port-cocos2dx-to-ue5/) | September 2026 | Claude (Fable 5, Opus 5) | Three live mobile RPGs (about 190,000 lines each) ported from Cocos2d-x to Unreal Engine 5.8 without rewriting. Three to 16 days from start to launch |

## How to Read This Case Study Collection

- **The length of a prompt does not predict the result.** A 150-word prompt produced 55,000 lines of code, while a 1,590-line design document took about two hours to build. Compare what each approach covered in [Prompts by Model](/en/cases/prompts-by-model/).
- **"Built" and "playable" are different things.** In most case studies, issues found during play were not apparent in the first output. See [Common Threads in Case Studies](/en/cases/lessons/) for details.
- **Originality lives outside the one-shot.** Difference comes from subject matter, game feel, marketing, and how updates are managed. Read [Finding Your Voice Beyond the One-Shot](/en/agent-dev/differentiation/) to explore this further.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-05**: Added one case study ([Regional Quests](/en/cases/port-cocos2dx-to-ue5/): migration of three mobile RPGs from Cocos2d-x to Unreal Engine 5.8).
- **2026-09-29**: First version created. 12 case studies included.
<!-- AUTO-UPDATE:END -->

## References

- [Claude of Duty (GitHub)](https://github.com/mshumer/Claude-of-Duty) — This project launched the case study collection. Sources for all cases are listed in the References section of each individual article.
