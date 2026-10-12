---
title: How Steam Discovery Works and the Shift to Algorithm-Driven Discounts
description: In early 2027, Steam is moving from manual curation to algorithm-driven displays in the "Discounts & Events" tab. This article explains the changes, discovery paths on Steam, what you can control, how the algorithm shift may affect visibility, and what to set up on your store page now.
sidebar:
  order: 6
lastUpdated: 2026-10-05
---

## Overview

To get your game played on [Steam](https://store.steampowered.com/), first you need to get it discovered. On September 29, 2026, Valve announced that it will stop manually curating the "Discounts & Events" tab (where Valve staff select which games appear) and shift to algorithm-driven, per-user displays by early 2027.

This article covers:

- What was announced and what remains uncertain
- The main discovery paths on Steam, who controls each one, and what solo developers can do
- How the algorithm shift may affect visibility (Valve's statements and this article's analysis)
- What to set up on your store page now

For how to collect wishlists, see [Wishlists](/en/monetization/wishlists/). For discount rules, see [Pricing](/en/monetization/pricing/). For store requirements, see [Platform Comparison](/en/monetization/platforms/). This article ties those topics together from the discovery angle.

## What Valve Announced (September 29, 2026)

Valve's explanation in the [Steamworks announcement](https://steamcommunity.com/groups/steamworks/announcements/detail/676258795703240952) (as of October 2026):

| Item | Details |
|---|---|
| Timeline | Early 2027; no fixed date. Valve will share details within weeks |
| Change | "Discounts & Events" will shift from manual calendar-based displays to algorithm-driven, per-user displays |
| Current setup | Valve or partners (via [Steamworks](https://partner.steamgames.com/)) control scheduled slots |
| Paused | New schedules for Weekend Deal, Midweek Deal, and Daily Deal are no longer being accepted |
| Existing slots | Already-scheduled Weekend, Midweek, and Daily Deals will run as planned; no developer action needed |
| New tools | Valve plans new or updated tools to manage discounts and sales events |
| Valve's view | This may not be perfect at launch, but Valve expects good outcomes for players and developers |

**Numbers Valve cited:**

- In recent months, Valve tested replacing some curated slots with personalized recommendations. The number of unique games shown to players per day in that section increased tenfold.
- Store page visits, wishlist adds, and cart adds showed "meaningful increases" as a result.

The announcement does not say what "tenfold" is measured against, the test duration or scope, or the exact rate of increase in visits. The "10x" refers to the number of different games shown, not visits per game.

**What the announcement does not address:**

The announcement includes no changes to themed sales events (Fests), seasonal sales, or Steam Next Fest. Discount rules (the 30-day spacing requirement) show no changes; as of October 5, 2026, the [Discounting](https://partner.steamgames.com/doc/marketing/discounts) page still describes the old system with curated slots.

### What has been observed externally

According to Game Developer's [reporting](https://www.gamedeveloper.com/pc/steam-s-discounts-and-events-tab-will-soon-be-fully-algorithm-driven), the following has been noted:

- In early September, Simon Carless of GameDiscoverCo noticed the tab was already showing personalized content, a development he called favorable for smaller studios.
- Tim Bender of Hooded Horse shared on LinkedIn that one game (title undisclosed) received over 7,000 store visits from this tab in one month. In the prior six months combined, it had 7,355 visits total. "The five months before that were only 14 visits," he wrote—suggesting that a niche indie game went from nearly invisible to the store's top traffic source via this tab.

This is one developer's report on one game; the conditions (genre, discount status, timeframe) are unknown. Read it as a reference point only.

## Mapping Discovery Paths

Based on [Steamworks](https://partner.steamgames.com/) documentation (as of October 2026). The "Who decides" column shows what you can influence:

| Discovery path | Who decides | What solo developers can do |
|---|---|---|
| Wishlist notifications | Automatic if wishlists exist. Sent when the game launches, a discount of 20% or more runs (8+ hours, including the cheapest package), or a demo opens ([Wishlists](https://partner.steamgames.com/doc/marketing/wishlist)) | Launch a store page early. See [Wishlists](/en/monetization/wishlists/) for gathering strategy |
| Discounts & Events | Until early 2027: some slots picked by Valve. After: algorithm-driven per user (see announcement above) | Set discounts and optimize conditions for display |
| New & Trending / New Releases | Algorithm. Games recently launched with low visibility get prioritized in each user's queue. Some are filtered by tag ([Visibility](https://partner.steamgames.com/doc/marketing/visibility)) | Tag accurately. Polish your store page before launch |
| Recommended For You, More Like This | Algorithm. Based on tag overlap, language, and user purchase and play history (same sources, [Steam Tags](https://partner.steamgames.com/doc/store/tags)) | Tags, supported languages, store page content |
| Discovery Queue | Personalized by algorithm. Valve states trailers must make an impression in under 10 seconds ([Trailers](https://partner.steamgames.com/doc/store/trailer)) | Trailer opening frames, capsule image |
| Top Sellers, Tag Pages | Sales only. No editorial curation. Weighted toward the last 24 hours of sales, with the last 3 hours weighted most heavily ([Top Sellers Lists](https://partner.steamgames.com/doc/store/top_sellers)) | Generate sales. DLC and in-game purchases count |
| Next Fest, Themed Sales | Next Fest is opt-in and categorized by the two categories and tags you choose at signup ([Tips](https://partner.steamgames.com/doc/marketing/upcoming_events/nextfest/tips)). Themed Sales: Valve auto-invites based on tags and store page content ([Themed Sales](https://partner.steamgames.com/doc/marketing/upcoming_events/themed_sales)) | Release a demo. Tag accurately and honestly to match the theme |
| Update Visibility Round | Developer-initiated. Shows in the library and wishlists of players who own or wish for your game, visible on the home page for up to 30 days. First five per title; popular games may get more ([Update Visibility Rounds](https://partner.steamgames.com/doc/marketing/visibility/update_rounds)) | Time it with major updates. Use after the launch window ends |
| Off Steam (social media, streamers, curators, ads) | You | [Short-form video for social](/en/trailer/social-shorts/), Curator Connect. Measure external ad results with [UTM Analytics](https://partner.steamgames.com/doc/marketing/utm_analytics) ([Advertising on Steam](https://partner.steamgames.com/doc/marketing/advertising)) |

Steam has no paid ad slots inside the storefront. Valve explicitly states you cannot buy visibility ([Visibility](https://partner.steamgames.com/doc/marketing/visibility), [Advertising on Steam](https://partner.steamgames.com/doc/marketing/advertising)).

### What Valve says helps and hurts visibility

The [Visibility](https://partner.steamgames.com/doc/marketing/visibility) page breaks down what affects algorithm-driven displays:

- **Helps:** Sales and playtime (a game is selling and people are playing it), supported languages (games matching the player's language get priority), tags.
- **Barely helps:** Wishlists (some paths like Popular Upcoming are exceptions), store page views, store page conversion rate.
- **No effect if strong enough:** Review score. "Mixed" (40% or higher positive) or better has no effect; ratings drop to "Mostly Negative" and visibility declines.

One caveat: this describes the current system. Whether the new "Discounts & Events" algorithm uses the same factors is not stated. However, the Wishlists page notes that a game you wishlisted may appear with a "Wishlisted" badge on your personal screen ([Wishlists](https://partner.steamgames.com/doc/marketing/wishlist))—it does not affect the ranking, but you see it more easily.

## What May Change With the Algorithm Shift

The following are this article's predictions based on the facts above. They are not confirmed.

- **Pushing for slots will stop working.** Historically, Valve has prioritized high-sales and high-play-count games for curated slots and invited developers of games with hundreds of thousands of dollars in recent sales to pitch ([Discounting](https://partner.steamgames.com/doc/marketing/discounts)). Solo indie releases had a narrow opening. That avenue likely closes.
- **When and how much you discount directly affects visibility chances.** The Discounting page explains that discounted games appear in "sales" sections based on tags, popularity, and recommendation ranking. Without a discount, you are unlikely to appear in that tab at all.
- **Tag quality becomes more competitive.** Because recommendations use tag overlap, choosing your genre accurately will increasingly determine whether niche players find you.
- **Visibility increases, but so does competition.** More games appear, but ours and others compete for the same players. Store page quality—capsule image, trailer, reviews—becomes the deciding factor. A wider entrance means the quality gap shows more.
- **The 30-day discount spacing rule may not change.** More visibility does not mean unlimited discounts; there may still be frequency caps.

Valve will share details "within weeks." Until those details arrive, avoid big changes to your discount strategy. Spend time on store page quality instead.

## What to Set Up on Your Store Page

Once the algorithm runs the show, your store page becomes your sales team. These are Valve's top recommendations (as of October 2026):

### Tags

- Add at least 5 before launch; up to 20 is recommended. The top 20 are public and used for matching ([Steam Tags](https://partner.steamgames.com/doc/store/tags)).
- The top 5 explain your game. Some filters prioritize the top 15.
- Specific tags like "Party-Based RPG" carry more weight in recommendations than broad ones like "Action."
- The Tag Wizard's "Suggest Prioritization" tool orders subgenres first and low-information tags ("Indie," "Singleplayer") last—use it as a starting point.
- User-added tags also influence ranking. You can remove tags that do not match your game.

### Capsule Images and Screenshots

The capsule is the cover image in store lists and recommendations ([Store Graphical Assets](https://partner.steamgames.com/doc/store/assets/standard)).

- Header capsule (920×430 px): key art and logo showing what the game is. No text besides the title.
- Small capsule (462×174 px): used in search, top sellers, new releases. Must be legible even at small size.
- Screenshots: 5 or more, 1920×1080 px or larger. Show only in-game screens, not concept art or ad text.
- Mark at least 4 as "all ages" friendly or some home page displays will skip you.

### Game Description

Based on [Store Page Written Description](https://partner.steamgames.com/doc/store/page/description):

- Short description: plaintext, under a few hundred characters, highlighting what sets your game apart. Include the genre. Do not include "Out Now" or release dates.
- "About This Game": break it into bold sections so it is easy to skim. Avoid jargon and write for people new to the genre.
- GIFs and screenshots combined must be under 15 MB. No external links or images mimicking the Steam interface.

### Trailer

See [Trailer Requirements for Steam](/en/trailer/steam-trailer/) and [Video Structure](/en/trailer/structure/). Valve recommends leading with gameplay and making it work without audio ([Trailers](https://partner.steamgames.com/doc/store/trailer)).

### Demo, Languages, Reviews

- A demo can be set to display above the "Buy" button. Demos inherit the tags of the full game ([Demos](https://partner.steamgames.com/doc/store/application/demos), [Next Fest Tips](https://partner.steamgames.com/doc/marketing/upcoming_events/nextfest/tips)).
- Translate your store page by language. Over 60% of Steam users use a language other than English. Use your wishlist breakdown by region to prioritize translations ([Localization and Languages](https://partner.steamgames.com/doc/store/localization)).
- Offering paid reviews or encouraging reviews in-game is prohibited ([User Reviews](https://partner.steamgames.com/doc/store/reviews)).

### Measuring Results

The "Store & Steam Platform Traffic Breakdown" section under "Marketing & Visibility" in [Steamworks](https://partner.steamgames.com/) shows impressions (how many times your store page appeared) and visits (how many times it was clicked). After the algorithm rolls out, you can measure whether "Discounts & Events" traffic grows here ([Store and Platform Traffic Reporting](https://partner.steamgames.com/doc/marketing/traffic_reporting)).

## How to use AI

- **Short description drafts**: Pass in the game's features and constraints:
  ```text
  Create 5 Steam short description options in English and 5 in Japanese. Constraints: a few hundred characters max, plaintext, include the genre, no "Out Now" or dates, highlight one thing different from other games.
  Game summary: (core loop, features, similar games, target players)
  ```
- **Tag selection**: Paste tags from 5–10 similar games plus your game description. Ask for 30 candidate tags sorted by genre, visuals, theme, and mechanics. Have it split "many games use this" tags from "few games use this" ones, and propose an order for your top 5. This makes Tag Wizard adjustments easier.
- **Store page self-review**: Paste your description, tags, and screenshot captions. Ask: "Can someone seeing this genre for the first time understand what it is in 10 seconds?" and "Does it violate Valve's guidance?" Run it past multiple viewpoints—a newcomer and a genre fan—to spot differences.
- **Discount schedule**: Share your launch date, past discount end dates, any price increase, and planned major update dates. Ask for a 30-day-compliant discount schedule. Rerun it when Valve's details arrive.
- **Traffic analysis**: Download your Traffic Breakdown data (impressions, visits, click rate). Paste it and ask to find high-impression, low-click-rate areas. Low click rate suggests a capsule image redesign may help.
- **Review trends**: Paste reviews from your game and ask it to categorize gaps between promises and reality—where your store page misleads. Use the results to fix your description or screenshots.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-05**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Steamworks: Upcoming Changes to the Discounts & Events Section on Steam](https://steamcommunity.com/groups/steamworks/announcements/detail/676258795703240952) — Valve's announcement on September 29, 2026
- [Game Developer: Steam's discounts and events tab will soon be fully algorithm-driven](https://www.gamedeveloper.com/pc/steam-s-discounts-and-events-tab-will-soon-be-fully-algorithm-driven) — Coverage and external observations of the announcement
- [Steamworks: Visibility on Steam](https://partner.steamgames.com/doc/marketing/visibility) — What helps and hurts visibility
- [Steamworks: Discounting](https://partner.steamgames.com/doc/marketing/discounts) — Discount types and rules
- [Steamworks: Steam Tags](https://partner.steamgames.com/doc/store/tags) — Tags and their role in visibility and recommendations
- [Steamworks: Store Graphical Assets](https://partner.steamgames.com/doc/store/assets/standard) — Capsule and screenshot specs
- [Steamworks: Store Page Written Description](https://partner.steamgames.com/doc/store/page/description) — Description guidelines
- [Steamworks: Store and Platform Traffic Reporting](https://partner.steamgames.com/doc/marketing/traffic_reporting) — Measuring impressions and visits
