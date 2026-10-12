---
title: MDA Framework
description: The MDA framework that views games through three layers—Mechanics, Dynamics, and Aesthetics—with 8 aesthetic elements and how to apply it to game design
sidebar:
  order: 2
lastUpdated: 2026-09-29
---

## Overview

- **MDA Framework** is a way of thinking about games by dividing them into three layers: Mechanics (rules), Dynamics (behavior when played), and Aesthetics (emotions players feel).
- The source is the 2004 paper "MDA: A Formal Approach to Game Design and Game Research" by Robin Hunicke, Marc LeBlanc, and Robert Zubek. It summarizes content taught in the GDC Game Design and Tuning Workshop (2001–2004) ([AAAI](https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/)).
- A major advantage is being able to break down the vague term "fun" into 8 types of aesthetic elements (kinds of enjoyment).
- This article explains the meaning of the 3 layers, the 8 aesthetic elements, and how to use them in planning and balancing.

## 3 Layers

The paper divides games into the following 3 elements and shows the corresponding design counterparts for each ([MDA paper](https://users.cs.northwestern.edu/~hunicke/MDA.pdf)).

| Layer | Definition in paper (summary) | What it corresponds to | Example (card game) |
|---|---|---|---|
| Mechanics | Game components at the level of data representation and algorithms | Rules | Shuffling, trick-taking, betting |
| Dynamics | Runtime behavior that emerges over time as mechanics respond to player input and mutual outputs | System | Bluffing |
| Aesthetics | Desired emotional responses evoked when players engage with the game | Fun | The tension of strategic decision-making |

To rephrase for engineers: mechanics is "code and data," dynamics is "behavior when executed," and aesthetics is "user experience." In the paper's example, shooter weapons, ammunition, and respawn points (mechanics) create ambushes and sniping (dynamics).

### Designers and players see in reverse order

- **Designers**: Mechanics → Dynamics → Aesthetics acts in that order
- **Players**: Aesthetics (atmosphere, emotion) → Dynamics → Mechanics are encountered in that order

Designers can only directly adjust mechanics. Emotions can only be created indirectly through dynamics. The paper argues that by thinking from the player's perspective, design becomes "working backward from experience" rather than "stacking features."

## 8 Aesthetic Elements

The paper presents the following classification instead of vague words like "fun" or "gameplay." Note that the paper itself states these are "not exhaustive."

| # | Name | One-line definition in paper | Meaning |
|---|---|---|---|
| 1 | Sensation | Game as sense-pleasure | Pleasure from sensory experience (visuals, sound, tactile feel) |
| 2 | Fantasy | Game as make-believe | Pretend play, becoming a different character or world |
| 3 | Narrative | Game as drama | Story, dramatic progression |
| 4 | Challenge | Game as obstacle course | Challenge, overcoming obstacles |
| 5 | Fellowship | Game as social framework | Interaction with companions, a social space |
| 6 | Discovery | Game as uncharted territory | Discovery, exploring unknown places |
| 7 | Expression | Game as self-discovery | Self-expression |
| 8 | Submission | Game as pastime | Passing time, immersion and losing oneself |

The paper analyzes existing games as follows:

- Charades: Fellowship, Expression, Challenge
- Quake: Challenge, Sensation, Competition, Fantasy
- The Sims: Discovery, Fantasy, Expression, Narrative
- Final Fantasy: Fantasy, Narrative, Expression, Discovery, Challenge, Submission

Each game has multiple aesthetic elements in different proportions.

## How to Use in Game Design

### 1. Choose target aesthetic elements first

At the start of planning, select 2–3 of the 8 elements you primarily target and prioritize them. For example, "Challenge as primary, Discovery as secondary" becomes a decision-making standard when uncertain. For how to write this in a design document, see [Game Design Document Template](/en/design/game-design-doc/).

### 2. Translate to dynamics

The paper illustrates that Challenge emerges from time limits and opponents, Fellowship is fostered by sharing information only with the team or placing victory conditions that are hard to achieve alone, and Expression comes from mechanisms like purchasing items, building, creating levels or worlds, and character customization.

### 3. Adjust with mechanics

Monopoly is the paper's flagship example.

- **Problem (dynamics)**: Wealthier players can collect from others more efficiently, widening the gap. Eventually only a few stay engaged, and tension is lost.
- **Solution (mechanics)**: Add assistance for lagging players or taxation for wealthy players. Or speed up play by making resources decrease over time.
- **Tuning**: Iterate numbers through playtesting. However, if calculation becomes too complex, players lose sight of the situation and it backfires.

This is MDA's basic use: tracing the cause in the order "target emotion → dynamics breaking it → mechanics to change." For details on tuning numbers, see [Balancing](/en/design/balancing/).

## Caveats and criticism

- The 8-category classification is neither exhaustive nor mutually exclusive. The paper's own analysis includes Competition, which is not in the list.
- Some criticisms: the classification is arbitrary, it's difficult to handle narrative- or experience-focused design ([Wikipedia: MDA framework](https://en.wikipedia.org/wiki/MDA_framework)).
- It's most practical to use it not as "a checklist to fill" but as shared vocabulary for conversation with your team (or your future self if solo developing).

## How to use AI

- **Analyzing existing games**: Ask "List the main aesthetic elements of this game in the MDA 8-category framework, and show a table of the dynamics and mechanics that produce each." This provides a foundation for analysis.
- **Reverse-engineering brainstorming**: Use it to help ideation across layers, like "My target aesthetic is Discovery. Give me 10 dynamics that create it, with the mechanics needed for each."
- **Sorting out problems**: When playtesting reveals something is "unfun," ask an LLM to hypothesize which layer the problem belongs to, then use that to prioritize what to test ([Playtesting](/en/design/playtesting/)).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: First version created.
<!-- AUTO-UPDATE:END -->

## References

- [MDA: A Formal Approach to Game Design and Game Research (PDF)](https://users.cs.northwestern.edu/~hunicke/MDA.pdf) — Original paper by Hunicke, LeBlanc, Zubek (2004)
- [AAAI Paper page (WS-04-04)](https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/) — Bibliographic information and abstract
- [MDA framework (Wikipedia)](https://en.wikipedia.org/wiki/MDA_framework) — Overview and summary of major criticisms
