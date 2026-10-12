---
title: CODEX MORTIS — Selling a "100% AI" Bullet-Hell Roguelite on Steam via Claude Code
description: CODEX MORTIS, marketed as made entirely by AI, shipped on Steam. This case traces the nine-month journey from demo to 1.0 using announcements and statements from the developer and publisher.
sidebar:
  order: 11
lastUpdated: 2026-09-29
---

## Overview

CODEX MORTIS is a top-down bullet-hell roguelite (Vampire Survivors style) published on Steam by GROLAF (publishing as CRUNCHFEST), with the tagline that "code, text, art, sound, and music are all AI-generated" on the store page. The necromancer protagonist is the game's central character. The first prototype was created in about three months; the demo launched in December 2025, early access on March 26, 2026, and version 1.0 on September 24, 2026.

The game's defining feature is that it openly markets itself as AI-made rather than hiding the fact, even putting it front and center. This approach initially drew criticism from international media and Steam comments. As of September 2026, 70 out of 92 Steam reviews across all languages are positive. Revenue and unit sales have not been disclosed.

| Item | Details |
|---|---|
| Developer | GROLAF (Steam developer). Publishing name is CRUNCHFEST. Goes by "Crunchfest3" and "Crunch Fest" on Reddit and YouTube. |
| Release dates and platform | Demo around December 10, 2025; Early Access March 26, 2026; Version 1.0 September 24, 2026. Steam (Windows, Steam Deck verified, 28 languages) |
| AI models | Claude Code using Claude Opus 4.1 and 4.5 (as of December 2025, per developer Reddit posts). Art from ChatGPT. Models used in 2026 work not disclosed. |
| Tools and agents | Claude Code, ChatGPT. No game engine; built with TypeScript, PixiJS, bitECS, and Electron. |
| Genre and scope | Top-down (changed to isometric in 1.0) bullet-hell roguelite with spell deck-building. At 1.0: 200 spells across 10 systems, 31 playable characters, 14 stages, up to 4-player online cooperative play |
| Development time | About three months to first demo (per developer posts). About nine months from demo to 1.0 |
| Results (publicly disclosed) | Base price $3.99 (30% off at 1.0 launch = $2.79 as of September 29, 2026). Steam reviews are Mostly Positive (70 out of 92 across all languages). Sales figures, unit sales, and wishlist count are private. |

## What was built

According to the Steam store page, the core loop centers on "building a spell deck before deployment and battling zombie hordes" (as of September 2026).

- A roguelite with waves of enemies where you grow stronger—each run you select upgrades (familiar from Vampire Survivors)
- 10 schools of dark magic with 200 total spells; all schools combine with each other
- "Mutations" that modify spells (249 total as of May 2026)
- Spend earned points to open booster packs and grow your spell collection (deck-building)
- 31 playable characters, 14 stages, 3 game modes, password-protected 4-player online co-op

The store page discloses AI usage as follows:

> AI is used for entire code of the game, text, arts, sounds and music.

The game uses no commercial engine. The developer built it with TypeScript for code, PixiJS for rendering, bitECS for entity management, and Electron to ship on desktop. The developer posted on Reddit that they "vibecoded using Claude Code (mainly Opus 4.1 and 4.5)," created art with ChatGPT, and animated characters using shaders written by Claude Code (reported in PC Gamer, December 2025).

## Development approach: from one-shot to product

The developer wrote in a YouTube video description that they "tried every usable AI model and shipped a game." The prototype started from a chat window, as noted in the 1.0 announcement. The approach is traceable through Steam announcements:

| Timeline | Details |
|---|---|
| December 2025 | Demo released. Called for wishlist registrations. Added a free demo-exclusive stage at year's end. |
| December 2025–February 2026 | Published early-access design. Plan: "8 stages, each with different mechanics." Recruited beta testers on Discord. |
| February 23–March 2, 2026 | Participated in Steam Next Fest (limited-time demo event). Added a stage exclusive to the event. |
| March 26, 2026 | Early access launched (delayed one week from plan). Sold at 10% discount. |
| March 31–April 29, 2026 | 15 "community updates" in one month: bug fixes, survivor mode, endgame progression, leaderboards, Steam Deck verification. |
| May 21, 2026 | Added "Mutations" (249 across 31 skills). Reduced level-up choices from 5 to 3. |
| August 2026 | Changed from top-down to isometric view. Redrew all character sprites, expanded schools from 5 to 10, increased playable characters to 31. |
| September 11–24, 2026 | Introduced deck-building and booster packs. Added online co-op and released 1.0. |

The development pattern that emerged:

- **Separated stable and test builds.** Along with the public release, a Discord beta hosted unstable builds so participants could test changes first. They announced "1,500 mutations in testing" but shipped only 249.
- **Kept each update small.** Releases were focused units—two spells, one stage, etc.—announced with each patch.
- **Redesigned the core loop after launch.** Late in early access, they changed perspective, added deck-building and booster packs. This was not a continuation of the one-shot but a redesign based on how people actually played.

## Where the game stood out

- **Marketed the AI angle.** The demo announcement included "100% AI-driven development." The trailer featured a scene of the player defeating demons labeled "AI antis" (reported in PC Gamer). Early-access announcements used self-deprecating language like "your favorite AI slop game."
- **Built deck-building and spell synergies into a familiar genre.** The developer described it as "Vampire Survivors meets Guild Wars-style builds" (quoted in Insider Gaming).
- **Made each stage distinct.** Examples: break buildings to weaken a boss, defend five pillars for 90 seconds each, escape rising void (Steam announcements).
- **Developed with the community.** Announcements were signed "CRUNCHFEST & GROLAF" and cited Discord and forum requests in update notes (1.0 announcement).

Press noted the art as "hazy and hard to distinguish" (PC Gamer). For 1.0, they redrew all sprites for the new isometric perspective.

## What did not work

- **Early criticism.** Insider Gaming reported that comment sections called it "soulless slop." PC Gamer questioned the "world's first fully AI" claim. Steam forums included posts from refund requests.
- **Promised features delayed.** The 1.0 announcement stated: "Online co-op was the only feature promised on early-access day one, and it just shipped." Six months elapsed between promise and release.
- **Numerical balance breakage.** Stacking cooldown reduction drove the stat to zero, causing spells to fire every frame and the screen to become unreadable. The developer added "cast time," a separate cooldown, to every spell (August 7 announcement).
- **Bugs at launch.** Early-access patches fixed an enemy spawn timer that advanced during pause (was wall-clock time, not game time), boss attack timers that did not reset on retry, and more (March 31 announcement). After 1.0, local co-op on Steam Deck and Linux broke and was reverted (September 29 announcement).
- **Animation challenges.** The developer said character animation was difficult, so they used shaders to shake characters instead (reported in Interesting Engineering, citing developer comments). The May 21 update announced all characters and all enemies finally had proper animations.

## Results

- Steam reviews: 70 out of 92 across all languages are positive (Mostly Positive rating, as of September 29, 2026).
- Pricing: Base $3.99; 30% off at 1.0 launch = $2.79 (Steam store, as of September 29, 2026).
- Sales, unit count, demo downloads, and wishlist totals remain undisclosed by both developer and publisher.
- Alongside 1.0, they released a ~15-minute video on YouTube: "How I made a game using ONLY AI (full story)."

## What to learn

- **Labeling something as AI-made is both a barrier and marketing.** Criticism was inevitable, but maintaining transparency and continuing to ship updates led to "Mostly Positive" reviews by September 2026. Refer to [platform policies](/en/legal/platform-policies/) for how to disclose AI.
- **Build the initial version with one-shot prompting; redesign the core loop after launch.** The perspective, deck-building, and number of spell schools all changed substantially during early access. The approach is described in [From one-shot to product](/en/agent-dev/from-one-shot-to-product/).
- **Rein in runaway stats with alternate caps.** When advancement stacks, unbounded stats break the game. A secondary limit like cast time prevents numerical explosion.
- **Ship small updates frequently with announcements.** 15 updates in one month proved sustainable for a tiny team.
- **You can ship without an engine, but you own platform integration.** The developer noted that Electron's Steam integration is not as smooth as Unity or Unreal (reported in Interesting Engineering).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version created.
<!-- AUTO-UPDATE:END -->

## References

- [CODEX MORTIS (Steam)](https://store.steampowered.com/app/4084120/CODEX_MORTIS/) — Store page. AI disclosure, pricing, reviews.
- [Steam announcements (CODEX MORTIS)](https://steamcommunity.com/app/4084120) — Development log since demo, update notes, 1.0 announcement.
- [How I made a game using ONLY AI (full story)](https://www.youtube.com/watch?v=v6J99oT7l-c) — Developer's ~15-minute video walkthrough of the process.
- [PC Gamer: This roguelite claims to have the dubious honor of being "the world's first fully playable game created 100% through AI"](https://www.pcgamer.com/games/roguelike/this-roguelite-claims-to-have-the-dubious-honor-of-being-the-worlds-first-fully-playable-game-created-100-percent-through-ai-in-a-milestone-for-slop-everywhere/) — Cites developer Reddit posts (technical stack and models).
- [Reddit r/aigamedev: My first vibecoded game, Codex Mortis demo is live](https://www.reddit.com/r/aigamedev/comments/1pidb5g/my_first_vibecoded_game_codex_mortis_demo_is_live/) — Developer's own post.
- [Interesting Engineering: Codex Mortis](https://interestingengineering.com/ai-robotics/worlds-first-game-completely-made-with-ai) — Reports developer comments on animation and Steam integration.
- [Insider Gaming: The 'World's First Game Created 100% Through AI' Has a Playable Demo](https://insider-gaming.com/ai-game-playable-demo-codex-mortis/) — Reports on reception at demo launch.
