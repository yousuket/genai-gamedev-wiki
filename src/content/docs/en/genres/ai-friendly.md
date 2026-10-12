---
title: Genres That Pair Well with Generative AI
description: For visual novels and adventures, roguelikes, card games, puzzles, survivors-like, and idle games, explains why each pairs well with generative AI and what to watch for.
sidebar:
  order: 2
lastUpdated: 2026-09-29
---

## Overview

Generative AI is not equally useful in every genre.
The more a genre lets you "make each asset independently", "mass-produce content as data", and "compete on mechanics rather than looks", the easier it is to shorten the work with AI.
This article takes six genres said to pair well with generative AI, and sorts out why they pair well, where to use AI, and what to watch for.
Genres that run an LLM inside the game are covered separately in [Genres that use an LLM inside the game](/en/genres/llm-native/).

## Three criteria for "pairs well"

| Criterion | Explanation | Examples that fit |
|---|---|---|
| Assets are independent | One picture or one sound effect does not depend on the others. Unlike animation, you do not need to match the frames before and after | Card art, background images, icons |
| Content can be mass-produced as data | Enemies, items, cards, and so on can be defined as tabular data, which the AI can draft easily | Card effects, item descriptions, dialogue branches |
| You compete on mechanics | The fun of rules and number design is rated above lavish graphics | Puzzle, idle, roguelike |

Conversely, in genres where smooth character animation or good-feeling controls matter (2D action, fighting games, and so on), generative AI alone tends not to reduce the work much.

:::note
"Procedural generation", used in roguelikes and other games, is a technique for automatically generating maps and the like by program rules, and is a different thing from generative AI.
In this article, generative AI means AI models that make images, sound, text, and code.
:::

## Comparison by genre

| Genre | Why it pairs well | Main uses of AI | Main things to watch |
|---|---|---|---|
| Visual novel / adventure | Backgrounds and character art are independent, one image at a time | Trial backgrounds, drafting and proofreading the scenario | Consistency of characters' faces and clothes, quality of the writing |
| Roguelike | Enemies, items, and events can be mass-produced as data | Item ideas and descriptions, icons | AI does not reduce balancing work |
| Card game / deck-building | Card art is independent and there are many cards | Card art, drafting effect text | Consistency of the visual style, duplicate effects and broken combinations |
| Puzzle | Few assets; code and rules are the core | Logic code, scripts that verify solutions | Designing a good puzzle is human work |
| Survivors-like | Many enemy and weapon types, but 2D images are enough | Sprites for enemies and projectiles, effects | Readability when the screen gets crowded, processing load |
| Idle / incremental | Number design matters more than looks | UI, icons, simulating formulas | Tuning the growth curve, testing long play |

## Visual novel / adventure

### Why it pairs well

- Background images and event art are independent one by one, which makes them materials that are easy to try with generative AI.
- Text is the star, so you can use an LLM to propose a scenario structure, draft it, and check for typos.
- Dedicated engines exist, so the programming burden is light. Representative examples are [Ren'Py](https://www.renpy.org/) and, with plenty of information in Japanese and support for smartphones, [TyranoScript](https://tyrano.jp/). To add a dialogue system to an existing game engine, you can use [ink](https://www.inklestudios.com/ink/), or [Yarn Spinner](https://www.yarnspinner.dev/), which has official integrations for Unity, Godot, and Unreal Engine.

### What to watch for

- **Character consistency**: Matching character art of the same character across different expressions and outfits is something generative AI is poor at. Allow time for touch-ups.
- **Quality of the writing**: LLM prose tends to settle into something safe, and the "voice" and "pacing" that give a work its personality have to be made by a human. In a visual novel the writing itself is the product, so be careful about using AI for more than drafts.

## Roguelike

A roguelike is a genre where the map and rewards change each run, and you improve by failing and starting over.

### Why it pairs well

- You need to prepare large numbers of items, enemies, and random events, and an LLM can speed up both the "coming up with ideas" and "drafting the descriptions".
- Item icons and enemy images are often small 2D assets, which are easy to try with generative AI.

### What to watch for

- The more elements you add, the more combinations explode, and the more time balancing and testing take. Just because the AI produces ideas easily, do not add too many elements.
- Finding "overpowered combinations" depends on playtesting. See also [Balancing](/en/design/balancing/) and [Playtesting](/en/design/playtesting/).

## Card game / deck-building

### Why it pairs well

- Each card needs an illustration, and this is a genre with many cards. Because each one is independent, these are assets where generative AI works well.
- Card effects can be defined as data in JSON or CSV, which makes it easy to hand an LLM the job of proposing effects or checking text for inconsistent wording.

### What to watch for

- **Consistency of the visual style**: The more cards, the more the variation in color tone, line weight, and composition stands out. Fix the style instructions (the prompt) and the template frame, and add a step where a human matches the color tone at the end.
- **Duplicate effects and broken combos**: Effect ideas from an LLM can duplicate existing cards or produce infinite loops. Confirm them with simulation or testing before adopting them.

## Puzzle

### Why it pairs well

- It needs few assets, and the core of the work is implementing the rules and designing stages. An AI coding tool lets you try out the logic quickly.
- If you have the AI write a verification script that checks "does this puzzle have a solution" and "what is the minimum number of moves", you can cut the checking work in making stages.

### What to watch for

- A good puzzle comes from designing the moment of insight. If you have the AI make the puzzle itself, you tend to get ones that can be solved but are not fun.
- How you order the stages (how difficulty rises) shapes the experience. See [Level design](/en/design/level-design/).

## Survivors-like

A survivors-like is a genre where you defeat swarms of enemies with automatic attacks and survive by choosing an upgrade each time you level up. The representative game is Vampire Survivors ([Steam](https://store.steampowered.com/app/1794680/)).

### Why it pairs well

- There are many kinds of enemies, weapons, projectiles, and effects, but each one is a small 2D asset.
- The core loop is simple, so you can build a prototype in a short time.

### What to watch for

- With so many enemies and projectiles on screen, this is a genre where processing load easily becomes a problem.
- You need a look in which the player, enemies, and projectiles can be told apart even when the screen is crowded. Put readability when they are all lined up ahead of the quality of each individual asset.
- There are many similar games. Think about what sets yours apart at the [core loop](/en/design/core-loop/) stage.

## Idle / incremental

An idle or incremental game repeats a cycle of growing a number and spending it to buy the next growth. Cookie Clicker ([Steam](https://store.steampowered.com/app/1454400/)) is the representative example.

### Why it pairs well

- Number design matters more than looks, and the assets are mostly UI and icons.
- You can write a simulation of the growth curve (how far you get in how many hours) in code, and have the AI help with graphing and estimates.

### What to watch for

- You are designing a play experience that lasts hours to weeks, so testing takes time. Build in a debug feature that fast-forwards time from the start.
- It combines easily with in-app purchases and ads, but depending on the design it can lead to player complaints. See [Ads and in-app purchases](/en/monetization/ads-and-iap/).

## What to watch for in every genre

### Disclosing AI use

On Steam, in the content survey you declare content you made with AI during development and included in the game (pre-generated), and content the AI generates while the game runs (live-generated).
It is stated explicitly that efficiency gains from AI tools built into your development environment are not subject to this declaration ([Steamworks: Content Survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey), as of September 2026).
See [Platform AI policies](/en/legal/platform-policies/) for details.

### Use of generative AI is growing, but opinions are split

- According to Totally Human Media's tally, just under 20% of the games released on Steam in 2025 disclosed using generative AI, and generating visual assets such as images made up about 60% of the disclosures ([Totally Human Media](https://www.totallyhuman.io/blog/the-surprising-new-number-of-genai-games-on-steam)).
- On the other hand, in GDC's 2026 industry survey, 52% of respondents said "generative AI is having a negative effect on the industry" ([GDC 2026 State of the Game Industry](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/)).

You do not need to avoid using AI itself, but it matters to **disclose accurately where you used it, and make a game that is judged on its quality**.

### Rights and terms of use

Whether you can use generated output commercially depends on the conditions of each tool.
The conditions are collected in [Commercial-use terms of AI tools](/en/legal/tool-terms/) and [Copyright of generative AI assets](/en/legal/copyright/).

## How to use AI

- **Start with "per-piece" assets**: Assets that are independent one by one, such as card art, backgrounds, and icons, are where generative AI works best. Leave animation and consecutive frames for later.
- **Make a style guide first**: If you fix the number of colors, line weight, viewpoint, and direction of the light source in text and sample images before mass-producing, you cut the touch-ups needed to unify the style.
- **Use it to draft data and text**: For card effects, item descriptions, dialogue branches, and so on, have the LLM output them in tabular form and you can load them straight into the game as data.
- **Use it for verification too**: Having the AI write scripts that "check", not only "make" (verifying a puzzle's solutions, simulating deck combinations, estimating an idle game's growth curve), is effective.
- **Do not leave it to judge what is fun**: In every genre, decide whether it is fun from the results of actually playing.

A comparison of asset generation tools is covered in [Asset generation](/en/dev-env/asset-generation/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: First version.
<!-- AUTO-UPDATE:END -->

## References

- [Steamworks: Content Survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey) — rules for disclosing AI-generated content
- [Totally Human Media: a tally of Steam games that use generative AI](https://www.totallyhuman.io/blog/the-surprising-new-number-of-genai-games-on-steam) — the number of disclosing games and the breakdown of uses
- [GDC 2026 State of the Game Industry](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/) — generative AI use in the industry and how it is received
- [Ren'Py](https://www.renpy.org/) — an engine for visual novels
- [TyranoScript](https://tyrano.jp/) — a Japanese visual novel engine that also supports smartphones (site in Japanese)
- [ink](https://www.inklestudios.com/ink/) — a scripting language for writing narrative, by inkle
- [Yarn Spinner](https://www.yarnspinner.dev/) — a dialogue system you can build into a game engine
- [Vampire Survivors (Steam)](https://store.steampowered.com/app/1794680/) — the representative survivors-like
- [Cookie Clicker (Steam)](https://store.steampowered.com/app/1454400/) — the representative idle / incremental game
