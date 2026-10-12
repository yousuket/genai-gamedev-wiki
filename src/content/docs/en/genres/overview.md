---
title: Genres and What Suits Solo Development
description: Compares the main game genres by development size, asset volume, and solo-developer track record, and shows how to choose a genre for your first game.
sidebar:
  order: 1
lastUpdated: 2026-09-29
---

## Overview

Choosing a genre is the first decision in setting the scope (what you will build) of a solo project.
Even for the same "fun idea", the amount of assets (materials such as images, sound, 3D models, and text) and the tuning effort change a great deal by genre.
This article compares the main genres in a table, and introduces examples of solo and small-team success and the criteria for choosing a genre.

## How to read the comparison

- **Development size**: A rough measure of getting to the point where one person can play it from start to finish. Small = a few weeks to 3 months, medium = 3 months to a year, large = over a year.
- **Asset volume**: The amount of material the finished game needs. It is not the amount of code.
- **Track record**: Games developed by one person or a small team that were rated well commercially or critically. The team size is given as far as the sources confirm.

## Genre comparison table

| Genre | Development size | Asset volume | Main assets | Solo / small-team examples |
|---|---|---|---|---|
| Puzzle | Small to medium | Low | Simple 2D images, UI | Baba Is You (Hempuli Oy) |
| Idle / incremental | Small | Low | UI, icons, number design | Cookie Clicker (Orteil, DashNet) |
| Survivors-like | Small to medium | Medium | 2D images of enemies, weapons, and effects | Vampire Survivors (poncle), Brotato (Blobfish) |
| Roguelike / deck-building | Medium | Medium | Card and icon art, sound effects | Balatro (LocalThunk), Slay the Spire (Mega Crit) |
| Short horror / walking sim | Small to medium | Medium | 3D environments, ambient sound | The Exit 8 (KOTAKE CREATE), Buckshot Roulette (Mike Klubnika) |
| Visual novel / adventure | Small to medium | Medium to high | Character art, backgrounds, large amounts of text, BGM | Doki Doki Literature Club! (Team Salvato), Slay the Princess (Black Tabby Games) |
| Rule-driven simulation | Medium | Medium | UI, 2D images, text | Papers, Please (Lucas Pope) |
| RPG | Large | High | Characters, maps, enemies, dialogue, BGM | Undertale (tobyfox) |
| Life / farming sim | Large | High | Characters, animation, maps, items | Stardew Valley (ConcernedApe) |
| 3D co-op / sandbox | Large | High | 3D models, animation, networking | Lethal Company (Zeekerss), Schedule I (TVGS) |
| 2D action / platformer | Medium to large | High | Lots of animation, stages | (Tuning the controls takes time. Keep the size down for a first game) |
| Competitive online / MMO / large open world | Extra large | Extra large | Nearly everything, plus running servers | Not suited to a solo first game |

The store page for each game and the sources for team size are collected in [References](#references).

## What solo developers' examples tell us

Let us look at a few of the games in the table whose team size is public.

| Game | What is known | Source |
|---|---|---|
| The Exit 8 (8番出口) | Solo development. Made with six months of concept work and three months of actual work, and passed 3 million copies sold in September 2026 | [GameBusiness.jp](https://www.gamebusiness.jp/article/2024/12/09/23720.html), [4Gamer.net](https://www.4gamer.net/games/751/G075133/20260907030/) (both in Japanese) |
| Balatro | A game by the solo developer LocalThunk. Passed 5 million copies in January 2025 | [PC Gamer](https://www.pcgamer.com/i-dont-play-poker-at-all-says-solo-developer-who-made-the-poker-roguelike-i-cant-stop-playing/), [Playstack](https://www.playstack.com/news/balatro-5-million-copies-sold/) |
| Vampire Survivors | Started as a solo project, and was first built with Phaser, an open-source HTML5 engine | [Game Developer](https://www.gamedeveloper.com/design/vampire-survivors-development-sounds-like-an-open-source-fueled-fever-dream) |
| Stardew Valley | Built alone over about four years | [Official press kit](https://www.stardewvalley.net/press/) |
| Schedule I | A game by a solo developer, and a big hit on [Steam](https://store.steampowered.com/) in 2025 | [80.lv](https://80.lv/articles/walter-white-simulator-schedule-i-becomes-steam-s-most-popular-indie-game-of-2025) |

You can read these trends from them:

- **The play is narrowed to one idea**: The Exit 8 has a clear core loop (the basic play that repeats): "spot the anomaly, then decide whether to go forward or turn back". Balatro's is "raise your score with poker hands".
- **They compete on mechanics, not looks**: Vampire Survivors and Baba Is You were rated for how fun their rules are, not for lavish graphics.
- **Successes in large genres took a long time**: A life sim like Stardew Valley took one person years of development.

:::caution
Hit games are examples with "survivorship bias". Note that, in the same genre and with the same amount of polish, far more games did not sell.
Choose a genre by "can I finish it", not by "will it sell".
:::

## How to choose a genre

### Criteria

| Question | If "yes", genres that suit you |
|---|---|
| I am not good at drawing, or I want to keep assets to a minimum | Puzzle, idle / incremental, rule-driven simulation |
| I like designing numbers and systems | Roguelike / deck-building, survivors-like, idle / incremental |
| I want to write text or a story | Visual novel / adventure |
| I want to try 3D spatial expression | Short horror / walking sim (limit the setting to one place) |
| I want to chase good-feeling controls | 2D action (keep the number of stages low) |

### What to avoid in a first game

Whatever the genre, these elements add a lot of work:

- **Online multiplayer**: It needs networking, synchronization, cheat prevention, and running servers.
- **A long story and voice**: The amount of text, and the effort of recording or generating voice, swells.
- **A wide map**: The range of layout, movement, and testing grows.
- **Animation for many characters**: Each added character needs as many assets as it has movements.

For more on thinking about scope, see [How to decide your scope](/en/getting-started/scope/).

## How to use AI

- **The more assets a genre needs, the bigger the AI effect, but the more unifying touch-ups there are too**: A visual novel's backgrounds or a deck-builder's card art come in large numbers, and generative AI can speed up trial versions. The work of matching the visual style remains, though. This is covered in more detail in [Genres that pair well with generative AI](/en/genres/ai-friendly/).
- **Use it to analyze similar games**: For the representative games in your candidate genres, have the AI organize the core loop, play time, and monetization model, and use that as a draft of your comparison table.
- **Making the LLM itself the play is also an option**: There are new genres that use an LLM for conversation or deduction. They need design for API cost and safety, so read [Genres that use an LLM inside the game](/en/genres/llm-native/) before you consider one.
- **Disclosing AI use may be required**: [Steam](https://store.steampowered.com/) asks you to declare content you made with AI during development and content the AI generates while the game runs ([Steamworks: Content Survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey), as of September 2026). See [Platform AI policies](/en/legal/platform-policies/) for details.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: First version.
<!-- AUTO-UPDATE:END -->

## References

Steam store page of each game (to check the developer name and release date):

- [Baba Is You](https://store.steampowered.com/app/736260/) — Hempuli Oy
- [Cookie Clicker](https://store.steampowered.com/app/1454400/) — Orteil, DashNet
- [Vampire Survivors](https://store.steampowered.com/app/1794680/) — poncle
- [Brotato](https://store.steampowered.com/app/1942280/) — Blobfish
- [Balatro](https://store.steampowered.com/app/2379780/) — LocalThunk
- [Slay the Spire](https://store.steampowered.com/app/646570/) — Mega Crit
- [The Exit 8](https://store.steampowered.com/app/2653790/) — KOTAKE CREATE
- [Buckshot Roulette](https://store.steampowered.com/app/2835570/) — Mike Klubnika
- [Doki Doki Literature Club!](https://store.steampowered.com/app/698780/) — Team Salvato
- [Slay the Princess — The Pristine Cut](https://store.steampowered.com/app/1989270/) — Black Tabby Games
- [Papers, Please](https://store.steampowered.com/app/239030/) — Lucas Pope
- [Undertale](https://store.steampowered.com/app/391540/) — tobyfox
- [Stardew Valley](https://store.steampowered.com/app/413150/) — ConcernedApe
- [Lethal Company](https://store.steampowered.com/app/1966720/) — Zeekerss
- [Schedule I](https://store.steampowered.com/app/3164500/) — TVGS

Sources for team size and track record:

- [Looking back on the development of The Exit 8 (GameBusiness.jp)](https://www.gamebusiness.jp/article/2024/12/09/23720.html) — solo development, six months of concept and three months of actual work (in Japanese)
- [The Exit 8 passes 3 million copies sold (4Gamer.net)](https://www.4gamer.net/games/751/G075133/20260907030/) — sales as of September 2026 (in Japanese)
- [PC Gamer: Interview with Balatro's developer](https://www.pcgamer.com/i-dont-play-poker-at-all-says-solo-developer-who-made-the-poker-roguelike-i-cant-stop-playing/) — that it is a solo developer
- [Playstack: Balatro passes 5 million](https://www.playstack.com/news/balatro-5-million-copies-sold/) — the publisher's sales announcement
- [Game Developer: The development of Vampire Survivors](https://www.gamedeveloper.com/design/vampire-survivors-development-sounds-like-an-open-source-fueled-fever-dream) — early development in Phaser
- [Stardew Valley official press kit](https://www.stardewvalley.net/press/) — development period for one person, and sales
- [80.lv: Schedule I](https://80.lv/articles/walter-white-simulator-schedule-i-becomes-steam-s-most-popular-indie-game-of-2025) — a hit by a solo developer
- [GamesRadar+: Interview with Zeekerss](https://www.gamesradar.com/games/horror/life-after-lethal-company-solo-creator-zeekerss-says-weirdly-not-a-lot-has-changed-after-one-of-the-biggest-indie-hits-in-recent-memory-and-he-still-has-a-good-handful-of-ideas-for-games/) — the solo developer of Lethal Company
