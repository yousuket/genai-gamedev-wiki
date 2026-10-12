---
title: How to Decide Your Scope
description: How to design the scope (what you will build) so that you finish a solo game, which work generative AI reduces and which it does not, and a guide to the size of your first game.
sidebar:
  order: 3
lastUpdated: 2026-09-29
---

## Overview

Scope is the range of what you will and will not build in a game.
The most common reason solo projects go unfinished is not a lack of technical skill but a scope that grew too wide.
This article explains how to decide scope, which work generative AI reduces and which it does not, and a guide to the size of your first game.

## Why scope matters most

The workload of a game tends to grow by multiplication, not addition, as you add elements.

- Adding one enemy type adds graphics, animation, sound effects, balancing, and testing
- Adding one stage adds layout, difficulty tuning, and checking a full playthrough
- Adding one feature creates bugs where it combines with existing features

Most of the big solo hits were also built "narrow and deep".

| Game | Team and duration | Source |
|---|---|---|
| The Exit 8 (8番出口) | Solo development. Six months of concept work and three months of actual work. The developer looks back that they narrowed the play down to finish quickly | [GameBusiness.jp](https://www.gamebusiness.jp/article/2024/12/09/23720.html), [4Gamer.net](https://www.4gamer.net/games/751/G075133/20241203035/) (both in Japanese) |
| Stardew Valley | Eric Barone built it alone over about four years, teaching himself music, art, programming, and design | [Official press kit](https://www.stardewvalley.net/press/) |

A game that narrows the play to one idea, like The Exit 8, can be built in a few months, while a game with many elements, like Stardew Valley, takes one person years.
For a first game, the former approach is the realistic one.

## Steps to decide scope

### 1. Write the core in one sentence

Write in one sentence "what the player repeats, and what they aim for".
Example: "Defeat swarms of approaching enemies with automatic attacks, and survive by choosing upgrades each time you level up."

Drop from your first list any element unrelated to that sentence.
The thinking behind the core loop is covered in more detail in [Core loop](/en/design/core-loop/).

### 2. Set constraints first

| Constraint | Example of how to set it |
|---|---|
| Duration | Put the deadline first, such as "release in three months" |
| Working hours | One hour on weekdays and five on weekends is 10 hours a week × 12 weeks = about 120 hours |
| Play time | For a first game, assume a volume of about 30 minutes to 2 hours |
| Platform | Narrow it to one: PC (Steam / itch.io) or the browser |
| People | One. If you outsource, decide that range first |

Setting the deadline first and building only what fits inside it is called a "timebox".

### 3. Split the elements into three

| Category | Meaning | Examples |
|---|---|---|
| Must have | The game does not work without it | The core loop, one way to win, a title screen |
| Nice to have | Add it if you have room | Extra characters, achievements, multiple difficulty levels |
| Will not build | Say outright that it is not in this game | Online matches, a long story, multilingual voice |

If you write out the "will not build" list, then when you think of a feature during production, you only have to move it there to settle the question.

### 4. Check your estimate with a vertical slice

Build one stage at near-release quality (a vertical slice) and measure how long it takes.
If one stage took 20 hours and you have 100 hours left, you can build five stages at most.
In practice, tuning and bug fixing also take time, so allowing 1.5 to 2 times your estimate gives you some margin.

## Work AI reduces and work it does not

Generative AI can shorten some of the work a great deal.
But it does not make the whole of game development faster in proportion.

| Work | Does AI reduce it? | Why |
|---|---|---|
| Routine code (UI, saving, input handling) | Tends to | Many existing examples, so the AI can draft it |
| Placeholder assets and trying out ideas | Tends to | You can get a rough draft of images, sound effects, and text right away |
| Large amounts of text (item descriptions, dialogue drafts) | Tends to | Though you still need to check that the content is consistent |
| A full set of assets in one visual style | Not much | Each one is quick to make, but the touch-ups to unify the style take time |
| Game feel (controls, timing of effects) | No | You can only play it and adjust in small steps |
| Balancing | No | The basis for decisions is the playtest results |
| Bug fixing and full-playthrough testing | Only partly | A human checks that it works, including code the AI wrote |
| Promotion and community work | Only partly | Drafting text gets faster, but steady outreach is human work |
| Checking rights and terms | No | You need to read and record the terms of each tool ([commercial-use terms of AI tools](/en/legal/tool-terms/)) |

In GDC's 2026 industry survey too, the top uses among people who use generative AI were research and brainstorming (81%), everyday work such as email and coding assistance (47% each), and prototyping (35%) ([GDC 2026 State of the Game Industry](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/)).
Even in professional settings, AI is used first for work like thinking, drafting, and trying things out.

:::caution
The faster AI lets you build, the stronger the temptation to add elements.
Each element you add also adds the work that does not shrink: testing, tuning, and bug fixing.
Rather than adding more elements, spend the time AI frees up on playtesting and polish.
:::

## A guide to your first game

If this is your first game, starting from one of these makes it easier to reach the finish.

| Option | Size | Good for |
|---|---|---|
| Recreating a classic game | Days to weeks | People who want to learn the engine first |
| Joining a game jam | Days to a week | People who get things done with a deadline |
| A small paid or free game | 1 to 3 months | People who want to put a game on a store from the first one |

- **Recreating a classic game**: [The 20 Games Challenge](https://20_games_challenge.gitlab.io/challenge/) publishes a practice menu that starts with Pong and Flappy Bird and gets harder step by step, through Breakout, Space Invaders, Pac-Man, and Super Mario Bros.
- **Game jams**: Events where you make a game within a set period and on a set theme. In the Japanese-speaking world, unityroom's [Unity 1 Week Game Jam](https://unityroom.com/unity1weeks) runs regularly. You can find jams abroad on the [itch.io jam list](https://itch.io/jams).
- **A small game**: Aim for "one core loop, 30 minutes to 2 hours of play, and few stages", and go through everything up to publishing the store page once.

If you set the goal of your first game as "going through the whole path from planning to publishing once" rather than "selling well", your estimates for the second game and after become far more accurate.

## How to use AI

- **Use it to write the "will not build" list**: Give the AI your plan and have it list "the elements to cut if one person builds this in three months". It gives you a chance to review, objectively, elements that are hard to cut yourself.
- **A starting point for task breakdown and estimates**: Have it split the work into tasks by feature and find the work you missed (a settings screen, saving, localization, and so on). Do not leave the time estimate itself to the AI; decide it from the measured numbers of your vertical slice.
- **Do not adopt the AI's output as it is**: AI tends to suggest adding elements. Sort its suggestions into the "nice to have" or "will not build" list before you consider them.
- **Keep a record of AI use**: If you record which tool you used for which asset and which code, you will not be stuck later when you need to make a disclosure under [platform AI policies](/en/legal/platform-policies/).

How to plan with AI is covered in [Using AI as a sounding board for planning](/en/design/ai-brainstorming/), and the overall flow of work in [AI-driven development workflow](/en/dev-env/ai-workflow/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: First version.
<!-- AUTO-UPDATE:END -->

## References

- ["We have to make a hit in a short time": the many ideas packed into The Exit 8 (GameBusiness.jp)](https://www.gamebusiness.jp/article/2024/12/09/23720.html) — The Exit 8's development period and how the play was narrowed (in Japanese)
- [Report on the session where The Exit 8's creator Kotake looks back on development (4Gamer.net)](https://www.4gamer.net/games/751/G075133/20241203035/) — how to make a short game (in Japanese)
- [Stardew Valley official press kit](https://www.stardewvalley.net/press/) — the development period for one person
- [The 20 Games Challenge](https://20_games_challenge.gitlab.io/challenge/) — a practice menu for recreating classic games in order
- [Unity 1 Week Game Jam (unityroom)](https://unityroom.com/unity1weeks) — a regular game jam in the Japanese-speaking world
- [itch.io game jam list](https://itch.io/jams) — game jams around the world
- [GDC 2026 State of the Game Industry](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/) — a survey of generative AI use
