---
title: Design Document Template
description: The differences between a one-page design proposal and a Game Design Document (GDD), and copyable Markdown templates for both
sidebar:
  order: 6
lastUpdated: 2026-09-29
---

## Overview

- Even in solo development, writing down your game concept in a document becomes a reference point for decisions and helps prevent scope creep.
- This article covers two types of documents:
  - **One-page design proposal**: Distills the core concept onto a single page. Create this first.
  - **GDD** (Game Design Document): A detailed specification document that you update continuously during development.
- Both come with copyable Markdown templates.
- If you keep them in your repository as Markdown, you can also use them as "specifications" to feed to AI coding tools.

## Why keep it brief?

Stone Librande, a designer at EA at the time, pointed out in his GDC 2010 talk "One-Page Designs" that most lengthy traditional GDDs go unread, and proposed a method to fit design onto one page using annotated diagrams ([GDC Vault](https://gdcvault.com/play/1012356/One-Page), [Game Developer introduction article](https://www.gamedeveloper.com/design/video-one-page-designs)). In the talk, he explains that the effort to fit everything on one page forces you to truly understand the problem, resulting in more concise design.

Tim Ryan also recommended in a 1999 article that documentation in the earliest stage of game planning (the game concept) should fit on one to two pages ([The Anatomy of a Design Document, Part 1](https://www.gamedeveloper.com/design/the-anatomy-of-a-design-document-part-1-documentation-guidelines-for-the-game-concept-and-proposal)).

## Two types of documents

| Item | One-page proposal | GDD |
|---|---|---|
| Purpose | Decide and communicate what you're making | Decide and record how you're making it |
| When to create | Early in planning, around the prototype stage | After the prototype feels promising |
| Length | One page | As much as needed. Can be split into chapters |
| Updates | Only when the direction changes | Throughout development |
| Audience | Yourself, collaborators, publishers, friends | Yourself, collaborators, AI coding tools |

Tim Ryan's article lists items for the game concept section: a one-sentence pitch (Introduction), description from a player's perspective (Description), key features (Key Features), genre, platform, and so on. The templates below are based on these ideas.

## One-page proposal template

````markdown
# (Working Title)

## One sentence

(In one sentence. "A game where [player] [verb] [challenge]." Example: A 20-minute-per-run survival action game where you dispatch incoming enemies with magic combos.)

## Player experience

(Second person, 2–3 sentences. "You [verb]. When you [action], [result] happens.")

## Target fun

- Primary: (Example: Challenge — the tension of barely surviving)
- Secondary: (Example: Discovery — finding magic combos)

(Choose 2–3 from the MDA framework)

## Core loop

(Connect roughly 3 verbs with arrows)

Example: Dodge → Collect → Choose → (back to Dodge)

## Meta loop

(What happens outside a single run)

## Key features (3 max)

1.
2.
3.

## Reference games and differences

| Game | Similarity | Difference |
|---|---|---|
|  |  |  |

## Basic info

- Genre:
- Platform:
- Length per run / total volume:
- Expected price:
- Target development time:

## Out of scope

(Explicitly list what you won't do. Examples: online multiplayer, voice acting, story mode)

## Biggest risk

(The most uncertain element and how you'll test it)
````

Writing "out of scope" acts as a guardrail when you're tempted to add features during development (see [Deciding scope](/en/getting-started/scope/)). For the "target fun" classification, see [MDA framework](/en/design/mda/); for how to write loops, see [Core loop](/en/design/core-loop/).

## GDD template

You don't need to fill out the entire GDD from the start. Write as you decide things, and clearly mark undecided items as "TBD".

````markdown
# (Title) Game Design Document

- Last updated: YYYY-MM-DD
- Version: 0.1
- One-page proposal: (link)

## 1. Overview

- One sentence:
- Target fun (MDA):
- Target audience (what kind of games do they normally play?):

## 2. Core loop

(As a diagram or list. Include estimate of time per cycle)

## 3. Meta loop and progression

- Flow of a single run:
- Unlocks and progression:
- Win condition / how the game ends:

## 4. Controls

| Input | Keyboard/Mouse | Gamepad | Action |
|---|---|---|---|
|  |  |  |  |

## 5. Game elements

### 5.1 Player

### 5.2 Enemies and obstacles

### 5.3 Items, cards, skills

(Don't list numbers here; link to the parameters table)

## 6. Levels and stages

- Structure (hand-made / procedural / combinatorial):
- Difficulty progression:
- What the tutorial teaches (in order):

## 7. Balance

- Target metrics (Example: 30% win rate for the first boss on a blind run):
- Parameters table: (link to spreadsheet or CSV)
- Simulation: (location of script)

## 8. UI and screen flow

(Screen inventory and transition diagram)

## 9. Art and sound direction

- Visual style and references:
- Generative AI tools used and their purpose:
- Asset rights verification: (checked terms and licenses?)

## 10. Technical

- Engine / language:
- Target platforms:
- Save data:

## 11. Scope and milestones

| Milestone | Description | Target date |
|---|---|---|
| Prototype | One full core loop |  |
| Vertical slice | One level at production quality |  |
| Demo |  |  |
| Release |  |  |

## 12. Out of scope

## 13. Outstanding decisions

- [ ]

## 14. Change log

| Date | Change | Reason |
|---|---|---|
|  |  |  |
````

A **vertical slice** is a portion of your game (e.g., one level) built to the same quality as the final product. You can use it to estimate development time and to create assets for trailers or store pages.

## Operational tips

- **Use diagrams**: As Librande's talk shows, screen flow and loops are clearer as diagrams than as prose. You can write diagrams as text using Mermaid notation inside Markdown, and they'll render as diagrams on GitHub ([GitHub Docs](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)).
- **Separate numbers**: If you write numbers directly into the GDD, they often drift out of sync with your game data. Link to a parameters table instead ([Balancing](/en/design/balancing/)).
- **Include dates**: Librande recommends including dates in the document so you can track updates. If you're using Git, the change history is automatic, but writing "why" in the document itself is useful later.
- **Incorporate playtest results**: When testing changes your direction, go back and rewrite your one-page proposal too ([Playtesting](/en/design/playtesting/)).

## How to use AI

- **As a spec document for AI**: Place it in your repository as `docs/gdd.md` and instruct your AI coding tool with "Implement the enemy according to section 5.2 of the GDD." The more your specification is in the document, the less likely the AI's output will drift from your design ([AI-driven development workflow](/en/dev-env/ai-workflow/)).
- **As a gap-finder**: Give the template and your draft plan to an AI, ask it to "list any blank or contradictory items and ask questions about what needs to be decided," and it will help surface gaps.
- **Summarizing and transforming**: You can have AI write a one-page proposal from a GDD, or create a GDD outline from a one-page proposal.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [One-Page Designs (Stone Librande, GDC 2010)](https://gdcvault.com/play/1012356/One-Page) — Talk on how to communicate design on one page
- [Video: One-page designs (Game Developer)](https://www.gamedeveloper.com/design/video-one-page-designs) — Introduction and summary of the above talk
- [The Anatomy of a Design Document, Part 1 (Tim Ryan, 1999)](https://www.gamedeveloper.com/design/the-anatomy-of-a-design-document-part-1-documentation-guidelines-for-the-game-concept-and-proposal) — Structure of game concept and proposal documents
