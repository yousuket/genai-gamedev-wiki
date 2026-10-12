---
title: Core Loop
description: The core loop is the repeated action a player takes in a game, supported by a meta-loop that provides long-term goals. Learn the concept, spot examples by genre, and validate your design with a prototype.
sidebar:
  order: 1
lastUpdated: 2026-09-29
---

## Overview

- A **core loop** is the repeating sequence of actions a player takes in a game (for example: fight → earn reward → grow stronger → fight again).
- Outside this sits a **meta-loop**: a goal that unfolds over hours or tens of hours.
- This article explains how loops work, gives concrete examples by genre, and walks you through how to validate your loop with a small prototype.
- Solo developers often build features and content before the core loop is solid, then waste time rebuilding. Knowing what to validate first helps you avoid that.

## What are loops?

Game designer Daniel Cook explains that the "play" in a game is built from repeating **loops** ([Loops and Arcs](https://lostgarden.com/2012/04/30/loops-and-arcs/)). One pass through a loop typically flows like this:

1. The player holds a mental model: "If I do this, that should happen"
2. They act (input)
3. The game's rules process the input
4. Feedback comes back
5. The player's model updates, leading to the next action

Cook emphasizes that loops nest—short ones inside longer ones—and that value emerges from repetition. Story elements that play out once and end, he calls **arcs**, a different thing from loops. When looking at your design, it helps to write down "what repeats and what does not."

## Core loop and meta-loop

| Layer | Typical duration | Purpose | Examples |
|---|---|---|---|
| Momentary input | Seconds | Does it feel good to control? | Jump, attack, play a card |
| Core loop | 10 seconds to a few minutes | Does repeating get boring? | One fight, one level, one turn |
| Meta-loop | 10 minutes to tens of hours | Is there a reason to keep going? | Unlock, upgrade a base, progress a story |

The boundary between layers shifts between designers and studios. What matters are two points: **the inner loop is fun on its own**, and **the outer loop changes the inner loop**. When a meta-loop reward (a new weapon, a new card) alters how you play the core loop, the two loops mesh well.

Cook also recommends checking whether the loop stands alone without arcs like story ([Loops and Arcs](https://lostgarden.com/2012/04/30/loops-and-arcs/)).

## Examples by genre

| Genre | Core loop | Meta-loop |
|---|---|---|
| Survivors-like (auto-attack many enemies) | Dodge enemies → pick up experience → choose one upgrade per level-up | Permanent upgrades or character unlocks, earned per run |
| Roguelike / deck-building | Play cards in combat → pick new cards for your deck from the reward screen → enter the next room | Unlock new characters, difficulty tiers |
| Farm / life sim | Plant crops → tend them → harvest and sell | Buy equipment and land with money, expand what you can do |
| Puzzle | Look at the board → try a move → see the result and rethink | Unlock levels in sequence |

For which genres pair well with generative AI, see [Genres that work with AI](/en/genres/ai-friendly/).

## Write out your core loop

At the start of planning, summarize three things on one page:

1. **The verbs the player repeats**: Pick about 3, like "dodge," "choose," "combine"
2. **The flow of one pass**: Connect the verbs with arrows so the end loops back to the start
3. **What changes each pass**: Why it is not the same thing twice (randomness, choice, growth)

Game Developer warns that if you don't settle your core loop, you keep working on features you'll throw away ([Why the Core Gameplay Loop is Critical For Game Design](https://www.gamedeveloper.com/business/why-the-core-gameplay-loop-is-critical-for-game-design)). For how to set scope, see [Scoping Your Project](/en/getting-started/scope/).

## Validate with a prototype

Carnegie Mellon's Experimental Gameplay Project made 50+ games in a week per person. From that, they wrote down how to prototype fast ([How to Prototype a Game in Under 7 Days](https://www.gamedeveloper.com/game-platforms/how-to-prototype-a-game-in-under-7-days)). Here are the points that help you test a core loop:

- **Build a toy first**: Before adding win/loss or goals, get the central mechanic working on its own.
- **Cut corners**: Looks and correct implementation matter less than confirming the play works.
- **Kill bad ideas early**: Do not keep an idea alive if it does not work.
- **Time-box it**: More time spent brings fewer returns.

### Validation steps (example)

1. **Build in 1–3 days**: Use gray-box stand-in art; make only one pass of the core loop work.
2. **Play it yourself 10 times**: After pass 5, do you still think "one more"?
3. **Watch someone else play**: Hand it to them with no explanation; stay silent and watch ([Playtesting](/en/design/playtesting/)).
4. **Decide**:
   - **Keep going**: People replayed it even with placeholder art.
   - **Change it**: It was partly fun. Try adding or dropping one verb, then test again.
   - **Abandon it**: No tweak makes it click.

:::tip
You may think "graphics and sound will make it fun," but the research says good looks cannot save broken play. Check for a spark of fun before you add art.
:::

## How to use AI

- **Speed up prototyping**: A core loop's code—one pass—is the right size for an AI coding tool. Being specific helps: "A minimal prototype in Godot where a square player dodges enemies and picks up experience" narrows the scope. See [AI-driven development workflow](/en/dev-env/ai-workflow/).
- **Assume it is throwaway**: The prototype code from an AI is not meant for your final game; plan to throw it out once you know what works. That way you can move fast without worrying about clean architecture.
- **Pitch your loop to an LLM**: Write out your core loop and ask the model "What could bore a player by the 10th pass?" It can catch oversights ([Use AI to brainstorm your design](/en/design/ai-brainstorming/)).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: First version.
<!-- AUTO-UPDATE:END -->

## References

- [Loops and Arcs (Lostgarden, Daniel Cook, 2012)](https://lostgarden.com/2012/04/30/loops-and-arcs/) — The foundational thinking on loops vs. arcs
- [How to Prototype a Game in Under 7 Days (Game Developer, 2005)](https://www.gamedeveloper.com/game-platforms/how-to-prototype-a-game-in-under-7-days) — Fast prototyping techniques from the Experimental Gameplay Project
- [How to Prototype a Game in Under 7 Days (GDC Vault, 2006)](https://www.gdcvault.com/play/1013294/How-to-Prototype-a-Game) — The same topic as a GDC talk
- [Why the Core Gameplay Loop is Critical For Game Design (Game Developer, 2019)](https://www.gamedeveloper.com/business/why-the-core-gameplay-loop-is-critical-for-game-design) — Why settling your loop early matters
