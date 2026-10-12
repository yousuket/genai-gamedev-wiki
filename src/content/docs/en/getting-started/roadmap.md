---
title: The Roadmap from Planning to Release
description: Splits solo game development into seven stages (planning, prototype, vertical slice, production, trailer and store page, release, live operation) and gives each stage's goal and the articles to read.
sidebar:
  order: 2
lastUpdated: 2026-09-29
---

## Overview

Making a game does not end when you finish building it. It continues through getting people to know about it, selling it, and keeping up the work after release.
This article splits solo development into seven stages and gives the **goal, the sign that a stage is done, and the articles to read** for each.
Use it as a map: check which stage you are in, and pick up only the articles you need.

## The big picture

| Stage | Goal | Sign that it is done |
|---|---|---|
| 1. Planning | Decide what to make | You have a one-page design document and a list of what you will cut |
| 2. Prototype | Check that the core play is fun | The core loop plays for a few minutes, with placeholder visuals |
| 3. Vertical slice | Build finished-product quality in a small area | One stage plays with visuals and sound close to the final product |
| 4. Production | Mass-produce the rest of the content | It plays through from start to finish |
| 5. Trailer / store page | Get people to know about it and collect wishlists | The store page is live, with a trailer and a demo |
| 6. Release | Start selling | On launch day, the announcement, build, and store information are all ready |
| 7. Live operation | Fix bugs and keep improving | You have an update plan and a procedure for handling inquiries |

The store page in stage 5 is usually started early, in parallel with production in stage 4.
The stages are not one-way: if the prototype is not fun, you go back to planning.

## 1. Planning

This is the stage where you decide what game to make, and at what size.
In solo development, **keeping the project to a size you can finish** affects the result far more than how good the idea is.

What to do:

- Pick a genre, and play about five similar games to compare them
- Write the core loop (the basic play that repeats in the game) in one sentence
- Decide first what you will not build (multiplayer, a long story, many characters, and so on)
- Get a rough idea of where you will sell and at what price

Articles to read:

- [How to decide your scope](/en/getting-started/scope/)
- [Genres and what suits solo development](/en/genres/overview/)
- [Genres that pair well with generative AI](/en/genres/ai-friendly/)
- [Genres that use an LLM inside the game](/en/genres/llm-native/) (if you use an LLM in the game)
- [Core loop](/en/design/core-loop/)
- [The MDA framework](/en/design/mda/)
- [Design document template](/en/design/game-design-doc/)
- [Using AI as a sounding board for planning](/en/design/ai-brainstorming/)
- [Sales platforms](/en/monetization/platforms/)

## 2. Prototype

In this stage you **check with a minimal implementation** whether the core loop is fun.
Placeholder assets such as squares and circles are enough. If you spend time on art here, the loss is larger when the game turns out not to be fun.

What to do:

- Pick a game engine and implement only the core loop
- Have someone other than yourself play for a few minutes, and watch their reaction
- If it is not fun, change the rules or go back to planning

Articles to read:

- [Comparing game engines](/en/dev-env/engines/)
- [AI coding tools](/en/dev-env/ai-coding-tools/)
- [AI-driven development workflow](/en/dev-env/ai-workflow/)
- [Making games with coding agents: the big picture](/en/agent-dev/overview/)
- [How far can "one-shot" prompting take you?](/en/agent-dev/one-shot/)
- [Playtesting](/en/design/playtesting/)

:::tip
This is the stage where you start using AI tools, so it also pays to check [the commercial-use terms of AI tools](/en/legal/tool-terms/) once now. That makes it easier to avoid having to redo assets later.
:::

## 3. Vertical slice

A vertical slice is **a small part of the game (such as one stage) built at near-release quality**.
Building "one part at finished quality" instead of "everything a little at a time" tells you:

- The art direction (the visual style), and how long one stage takes to make
- An estimate of the total work needed to finish the whole game
- Whether it gives you material usable for the trailer and store page

If you make assets with generative AI, it is important to check here **whether you can keep the visual style consistent**.

Articles to read:

- [Asset generation](/en/dev-env/asset-generation/)
- [Level design](/en/design/level-design/)
- [Copyright of generative AI assets](/en/legal/copyright/)
- [Licenses for assets and open-source software](/en/legal/licenses/)

## 4. Production

In this stage you extend the quality you set in the vertical slice to the rest of the game.
It is the longest stage, and also the one where scope tends to swell.

What to do:

- Mass-produce the content: stages, cards, enemies, and so on
- Playtest regularly and tune the difficulty and rewards
- Put anything you want to add on a "next game / update list"

Articles to read:

- [Balancing](/en/design/balancing/)
- [Playtesting](/en/design/playtesting/)
- [AI-driven development workflow](/en/dev-env/ai-workflow/)
- [From one-shot to a product: how to move development forward](/en/agent-dev/from-one-shot-to-product/)
- [Asset generation](/en/dev-env/asset-generation/)

## 5. Trailer / store page

In this stage you get people to know about the game and collect wishlists (the "want to buy" list on [Steam](https://store.steampowered.com/)).
On Steam, users who have wishlisted a game are notified by email when it launches ([Steamworks: Coming Soon page](https://partner.steamgames.com/doc/store/coming_soon)).

How Steam works, in the parts worth knowing (as of September 2026):

| Item | Details | Source |
|---|---|---|
| Coming Soon page | A new game's page must be live at least two weeks before launch. Valve recommends publishing it once the art style and main features are settled | [Steamworks: Coming Soon](https://partner.steamgames.com/doc/store/coming_soon) |
| [Steam](https://store.steampowered.com/) Next Fest | A one-week event for unreleased games that ship a demo. Held three times a year, in February, June, and October; each game can take part only once | [Steamworks: Steam Next Fest](https://partner.steamgames.com/doc/marketing/upcoming_events/nextfest) |
| [Steam](https://store.steampowered.com/) Playtest | A feature for running a free test under a separate app ID from the main game. Reviews of the test do not affect the main game | [Steamworks: Steam Playtest](https://partner.steamgames.com/doc/features/playtest) |
| Disclosing AI-generated content | In the content survey you declare AI-generated material made during development, and anything the AI generates while the game runs | [Steamworks: Content Survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey) |

Articles to read:

- [Trailer structure](/en/trailer/structure/)
- [Screen capture and editing tools](/en/trailer/capture-and-editing/)
- [Where to use AI video generation](/en/trailer/ai-video/)
- [Steam trailer requirements](/en/trailer/steam-trailer/)
- [Short videos for social media](/en/trailer/social-shorts/)
- [How to collect wishlists](/en/monetization/wishlists/)
- [Crowdfunding](/en/monetization/crowdfunding/) (if you are raising funds)
- [Platform AI policies](/en/legal/platform-policies/)

## 6. Release

This is the stage where you start selling. Prepare by counting back from launch day.

On [Steam](https://store.steampowered.com/), each app costs a Steam Direct fee of 100 US dollars (or the equivalent), which you can recoup once adjusted gross revenue reaches 1,000 US dollars ([Steamworks: Steam Direct fee](https://partner.steamgames.com/doc/gettingstarted/appfee), as of September 2026).
There is also a waiting period between paying the fee and release.
The official pages disagree: the onboarding document says 21 days, and the Steam Direct page says 30 days ([Onboarding](https://partner.steamgames.com/doc/gettingstarted/onboarding), [Steam Direct](https://partner.steamgames.com/steamdirect), as of September 2026).
To be safe, pay the fee more than a month before your planned launch date.

What to do:

- Decide the price and the launch date
- Do a final check of the store description, screenshots, and AI disclosure
- Prepare the launch-day announcement (social media, notifying people who wishlisted)

Articles to read:

- [Pricing](/en/monetization/pricing/)
- [Sales platforms](/en/monetization/platforms/)
- [Ads and in-app purchases](/en/monetization/ads-and-iap/) (if you publish on mobile or in the browser)
- [Platform AI policies](/en/legal/platform-policies/)
- [Commercial-use terms of AI tools](/en/legal/tool-terms/)

## 7. Live operation

After release, bug fixes, responding to reviews, and updates continue.
Bug reports tend to pile up right after launch, so set things up to ship fixes quickly.

What to do:

- Decide where bug reports are collected ([Steam](https://store.steampowered.com/) community, Discord, and so on)
- Plan fix updates and additional content
- Look at sales and play data, and use it in planning your next game

Articles to read:

- [Playtesting](/en/design/playtesting/) (to check the contents of an update)
- [Balancing](/en/design/balancing/)
- [Ads and in-app purchases](/en/monetization/ads-and-iap/)
- The weekly reports in the Latest News category (to follow changes in tools and terms)

## How to use AI

| Stage | Work where AI helps | What a human should decide |
|---|---|---|
| Planning | Brainstorming, organizing similar games, drafting the design document | Which idea to build, and what to drop |
| Prototype | Drafting code, making placeholder assets | Whether it is fun |
| Vertical slice | Trial assets, exploring a visual style | A consistent style, the quality bar |
| Production | Mass production, test code, shaping data | Balance, consistency of the whole |
| Trailer / store page | Drafting descriptions, first-pass translation, helping with video material | Whether it conveys the actual game screen correctly |
| Release / operation | Sorting bug reports, drafting patch notes | Priorities, how to respond to users |

In GDC's 2026 industry survey, among people who use generative AI at work, 81% use it for "research and brainstorming", 47% for "coding assistance", and 35% for "prototyping" ([GDC 2026 State of the Game Industry](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/)).
In the same survey, 52% of respondents said generative AI is having a negative effect on the industry.
Players and the industry also see it differently, so it matters to **keep a record of where you used AI, so you can reflect it accurately in the store disclosure**.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: First version.
<!-- AUTO-UPDATE:END -->

## References

- [Steamworks: Coming Soon page](https://partner.steamgames.com/doc/store/coming_soon) — when to publish the store page, and the two-week rule
- [Steamworks: Steam Next Fest](https://partner.steamgames.com/doc/marketing/upcoming_events/nextfest) — conditions for joining the demo event
- [Steamworks: Steam Playtest](https://partner.steamgames.com/doc/features/playtest) — a feature for running free external tests
- [Steamworks: Content Survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey) — disclosing AI-generated content
- [Steamworks: Steam Direct fee](https://partner.steamgames.com/doc/gettingstarted/appfee) — the fee and the recoup condition
- [Steamworks: Onboarding](https://partner.steamgames.com/doc/gettingstarted/onboarding) — the steps to a first release, and the waiting period
- [GDC 2026 State of the Game Industry](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/) — a survey of generative AI use in the game industry
