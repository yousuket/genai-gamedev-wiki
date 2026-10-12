---
title: Level Design
description: How to design difficulty curves, create tutorials that teach through play, and combine procedural generation with handcrafted levels
sidebar:
  order: 3
lastUpdated: 2026-09-29
---

## Overview

- **Level design** is the work of designing stages, maps, enemy placement, and the sequence of challenges to shape the flow of the player's experience.
- This article covers three areas:
  - Difficulty curves: how to gradually increase challenge
  - Tutorial design: how to teach players while they play
  - Combining with procedural generation: how to mix automated and handcrafted content
- When using generative AI in solo game development, understanding how to work with procedural generation (automatically creating levels through code) becomes especially important.

## Difficulty Curves

### The Flow Channel

Jenova Chen of thatgamecompany applies psychologist Csikszentmihalyi's "flow" theory to games ([Flow in Games (and Everything Else)](https://cacm.acm.org/opinion/flow-in-games-and-everything-else/), Communications of the ACM, 2007).

- When challenge exceeds the player's ability, they feel **anxious**
- When challenge falls below their ability, they feel **bored**
- The zone between them is the **flow channel**, where engagement continues
- Many games offer only a single fixed difficulty level

The same paper points out that the flow channel is different for beginners and experts. It recommends **building choice into the core gameplay itself** rather than just offering difficulty options, since choosing between options interrupts engagement.

### Climb with Ups and Downs

Difficulty increases more naturally when you create peaks and valleys rather than raising it monotonically. The Level Design Book explains how prolonged tension causes players to adapt, so alternating tension and rest maintains engagement ([Pacing](https://book.leveldesignbook.com/process/preproduction/pacing)).

A common pattern in practice:

1. When introducing a new element, temporarily lower the difficulty
2. Gradually increase difficulty through combinations of that element
3. After a peak, include an easy section where players can feel their growth
4. Return to step 1 with the next new element (overall difficulty rises slowly)

The book also introduces a method of graphing the "intensity" (0–100%) of each section to visually plan pacing.

## Tutorial Design

### Teach Through Experience, Not Text

Nintendo designers Shigeru Miyamoto and Takashi Tezuka described in a 2015 Eurogamer interview how they designed Super Mario Bros.' 1-1 as a "classroom" ([Miyamoto on World 1-1 (Eurogamer video, YouTube)](https://www.youtube.com/watch?v=zRGRJRUWafY), [World 1-1 (Wikipedia)](https://en.wikipedia.org/wiki/World_1-1)). Within the first few steps, players learn how to avoid enemies, defeat them, understand how question-mark blocks work, and distinguish between enemies and helpful mushrooms—all without written explanation.

### Introduction, Development, Twist, Resolution

Super Mario 3D Land director Hirohito Hayashida described stage structure as **Ki-Sho-Ten-Ketsu** (Introduction-Development-Twist-Resolution) in a Game Developer interview ([The Structure of Fun](https://www.gamedeveloper.com/design/the-structure-of-fun-learning-from-i-super-mario-3d-land-i-s-director), 2012).

| Stage | What the player does |
|---|---|
| Introduction | Learn how to use a new mechanic in a safe place |
| Development | Use that mechanic in slightly complex situations |
| Twist | Face unexpected uses of the mechanic |
| Resolution | Demonstrate mastery |

The Level Design Book presents the same thinking as **teach / test / twist** ([Pacing](https://book.leveldesignbook.com/process/preproduction/pacing)).

### Tutorial Checklist

- Teach one element at a time
- Let players first try in a low-stakes failure environment
- Use text as a last resort—first reveal through placement and visuals
- Right after teaching an element, place a section where the player "must use it to progress" to reinforce learning
- Play-test without explanation and fix sections where players get stuck ([Playtesting](/en/design/playtesting/))

## Combining with Procedural Generation

**Procedural content generation** (PCG) automatically creates levels using rules and randomness. While this adds variety with each playthrough, purely random generation often creates problems: unsolvable layouts, monotonous design, and inconsistent difficulty. Successful examples combine handcrafted components with generation.

### Spelunky: Make the Solution Path First

According to Darius Kazemi's explanation, Spelunky's level generation proceeds in this order ([Spelunky Generator Lessons](http://tinysubversions.com/spelunkyGen/)):

1. Divide the level into a 4×4 grid (16 rooms)
2. First decide the **solvable path** from entrance to exit
3. Place room types that have the necessary exits (left/right/up/down) on that path
4. Fill each room with templates, then place spikes, arrow traps, enemies, and treasure

The key insight is the order: **guarantee a solution, then add variation**.

### Dead Cells: Generate Within a Handcrafted Framework

Dead Cells lead designer Sébastien Bénard describes a "hybrid" approach that minimizes the generation algorithm's role ([Building the Level Design of a procedurally generated Metroidvania](https://www.gamedeveloper.com/design/building-the-level-design-of-a-procedurally-generated-metroidvania-a-hybrid-approach-), 2017):

1. Fix the overall world structure and stage connections by hand
2. Create rooms (tiles) by hand and assign them roles (combat, treasure, merchant, etc.)
3. For each stage, create a graph describing "which rooms in what order"
4. The algorithm selects and places rooms that fit the graph
5. Place enemies and items within constraints such as combat section length

### Choosing an Approach for Solo Development

| Approach | Best for | Effort |
|---|---|---|
| All handcrafted | Puzzles, story-driven games | Grows with level count |
| Handcrafted components + generated placement | Roguelikes, action games | Requires both components and generation rules |
| Mostly automated generation | Sandboxes, exploration | Time spent tuning generation rules |

The free textbook [Procedural Content Generation in Games](https://www.pcgbook.com/) (Shaker, Togelius, Nelson, Springer, 2016) provides systematic explanation.

## How to Use AI

- **Creating generation code**: When you describe a step-by-step approach like "decide the path first in a 4×4 room grid, then apply templates," coding agents can easily produce a working generator prototype ([AI-driven development workflow](/en/dev-env/ai-workflow/)).
- **Automated solvability checks**: Test code that validates generated levels via pathfinding is also well-suited to AI generation. You can create and verify that "unsolvable levels never appear."
- **Bulk component creation**: Have an LLM generate room templates and enemy placement patterns, then have humans select and refine them ([Using AI for design ideation](/en/design/ai-brainstorming/)). Note that outputs tend to be similar, so human variation is required.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Flow in Games (and Everything Else) (Jenova Chen, CACM, 2007)](https://cacm.acm.org/opinion/flow-in-games-and-everything-else/) — The relationship between flow channel and difficulty
- [Pacing (The Level Design Book)](https://book.leveldesignbook.com/process/preproduction/pacing) — teach/test/twist, intensity graphs, tension and rest
- [The Structure of Fun: Learning from Super Mario 3D Land's Director (Game Developer, 2012)](https://www.gamedeveloper.com/design/the-structure-of-fun-learning-from-i-super-mario-3d-land-i-s-director) — Stage structure using Ki-Sho-Ten-Ketsu
- [Miyamoto on World 1-1: How Nintendo made Mario's most iconic level (Eurogamer, 2015)](https://www.youtube.com/watch?v=zRGRJRUWafY) — Video of Miyamoto explaining the design intent of 1-1
- [World 1-1 (Wikipedia)](https://en.wikipedia.org/wiki/World_1-1) — Explanation of 1-1's design and sources
- [Spelunky Generator Lessons (Darius Kazemi)](http://tinysubversions.com/spelunkyGen/) — Interactive explanation of Spelunky's level generation
- [Building the Level Design of a procedurally generated Metroidvania (Game Developer, 2017)](https://www.gamedeveloper.com/design/building-the-level-design-of-a-procedurally-generated-metroidvania-a-hybrid-approach-) — Dead Cells' hybrid generation
- [Procedural Content Generation in Games](https://www.pcgbook.com/) — Free textbook on procedural generation
