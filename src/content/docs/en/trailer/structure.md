---
title: Trailer Structure
description: Learn what to show in the first few seconds of your game trailer, how to structure a gameplay-focused video, video length guidelines, and common mistakes to avoid.
sidebar:
  order: 1
lastUpdated: 2026-09-29
---

## Overview

A PV (or trailer, as it is commonly called in the game industry) is a video that helps potential players decide if a game is right for them on store pages and social media.

This article covers the following topics:

- What to show in the first few seconds
- How to structure a gameplay-focused trailer (two beginner-friendly templates)
- Video length guidelines and common mistakes

For specific technical details on screen capture and editing tools, see [Screen Capture and Editing Tools](/en/trailer/capture-and-editing/). For Steam-specific requirements, see [Steam Trailer Requirements](/en/trailer/steam-trailer/).

## Types of Trailers

Start by deciding where your video will be shown. Steam categorizes trailers into four types ([Steamworks: Trailers](https://partner.steamgames.com/doc/store/trailer), as of September 2026).

| Type | Content | Primary Use |
|---|---|---|
| Teaser | Short announcement with minimal gameplay footage | Right after announcement, social media |
| Gameplay | Player perspective gameplay as the main focus | **Top of Steam store page** |
| Cinematic / General | Prerendered footage, logos, awards, minimal gameplay | Events, announcements |
| Interview / Development | Developer commentary and other non-fiction | Devlogs, community content |

For solo developers, the first priority is a **gameplay trailer**. Steamworks documentation notes that most users come to watch gameplay, and recommends placing a gameplay-focused trailer at the top of the store page.

## What to Show in the First Few Seconds

### Make Your Decision in 10 Seconds

Steamworks documentation points out that users in the Discovery Queue (Steam's feature that shows one recommended game at a time) have "less than 10 seconds," and **may be watching without sound** ([Steamworks: Trailers](https://partner.steamgames.com/doc/store/trailer)).

Derek Lieu, a professional trailer editor who has worked on trailers for "Half-Life: Alyx" and "Among Us," notes that building atmosphere like a film before showing gameplay 15 to 30 seconds in does not work on Steam — viewers will not wait ([GameDiscoverCo](https://newsletter.gamediscover.co/p/game-trailers-breaking-down-a-key), 2022).

### Four Types of Opening Shots

Derek Lieu categorizes opening shots into four approaches ([The First Shot of the Game Trailer](https://www.derek-lieu.com/blog/2022/8/1/the-first-shot-of-the-game-trailer)).

| Type | Content | Works Best For |
|---|---|---|
| Core Loop Single Shot | A single uncut shot of the basic gameplay loop (core loop = the repeating central action) | Action, puzzle, roguelike |
| Memorable Environment | An impressive background scene | Exploration, atmosphere-focused |
| Gameplay Montage | Quick cuts of highlights | Games with many features |
| Striking Dialogue | Starting with conversation | Visual novels, adventure games |

Be careful with environment-first approaches. Lieu points out that a military base scenery alone does not tell you if the game is a first-person shooter or a strategy game. If you start with scenery, show player input controls early.

:::tip
When in doubt, start with a "core loop single shot." Choose your opening shot as if it were a strong screenshot of the game itself.
:::

## Gameplay-Focused Structure

### Template 1: Minimal Steam Trailer Setup

This is the simplest structure Derek Lieu recommends for solo developers with no following ([The Simplest Trailer to Make For Your Steam Page](https://www.derek-lieu.com/blog/2021/4/18/the-simplest-trailer-to-make-for-your-steam-page)). He describes it as "a fancier animated GIF."

1. Skip logos and cinematics, start with gameplay immediately
2. Show variety: different stages, enemies, mechanics
3. Keep each shot 3 to 5 seconds long (long enough to convey content even if viewers skip ahead)
4. Place shots showing "content quantity" in the middle or later
5. Do not repeat the same element more than three times

### Template 2: Tell, Show, Repeat

A structure where title cards (text-only screens) explain a feature, then gameplay shows it in action ([Tell, Show, Repeat](https://www.derek-lieu.com/blog/2023/4/9/tell-show-repeat-the-2nd-easiest-game-trailer-to-make)).

1. Start with recognizable gameplay that makes the genre clear
2. Show a title card with one feature
3. Show gameplay that demonstrates that feature
4. Repeat steps 2 and 3
5. End with a montage of exciting moments

At first, title cards can simply **explain the gameplay mechanic** ("throw balls to defeat enemies"). As you improve, **describe the character's goal** ("face your past") to avoid sounding generic.

### Closing

It is standard to end with a title logo, supported platforms, release date, and a call to action like "add to your wishlist" (an end slate). For more on wishlists, see [How to Build Your Wishlist](/en/monetization/wishlists/).

### Should You Show the HUD?

There are two schools of thought on showing the HUD (on-screen information like health bars).

- Steamworks says a HUD makes gameplay easier to understand and is often valuable.
- Derek Lieu recommends reducing unnecessary HUD and UI elements to avoid information overload ([10 Common Indie Game Trailer Mistakes](https://www.derek-lieu.com/blog/2020/9/14/10-common-indie-game-trailer-mistakes-and-how-to-fix-them)).

A practical approach is to "keep the HUD necessary to understand gameplay and remove debug displays and unnecessary windows." Using a [capture build](/en/trailer/capture-and-editing/) that can toggle HUD visibility helps you address both needs.

## Video Length Guidelines

Derek Lieu breaks down trailer length and recommends **90 seconds or less** for typical game trailers ([Ideal Game Trailer Length and Labeling](https://www.derek-lieu.com/blog/2018/12/20/ideal-game-trailer-length-and-labeling)).

| Length | Category |
|---|---|
| 0-30 seconds | Teaser |
| 30-90 seconds | Standard trailer |
| 90-180 seconds | Cinematic trailer |
| 180+ seconds | Detailed gameplay video |

For the minimal Steam trailer setup mentioned earlier, he recommends **90 to 180 seconds**, assuming viewers will skip ahead. Note that guidelines vary by use case.

Lieu also notes that the video title affects viewer expectations: "Trailer" suggests something short, while "Gameplay" or "Devlog" sets expectations for longer content.

## Common Mistakes

From Derek Lieu's [10 Common Indie Game Trailer Mistakes](https://www.derek-lieu.com/blog/2020/9/14/10-common-indie-game-trailer-mistakes-and-how-to-fix-them), these are the most common problems in solo development.

| Mistake | Solution |
|---|---|
| Unknown studio logo at the start | Start with gameplay |
| Slow setup | Put gameplay in the first few shots |
| Repeated backgrounds and enemies | Remove duplicates and tighten the cut |
| No sound design | Record without game audio, use sound effects to convey game feel |
| Game soundtrack on loop | Use music with a beginning, middle, and end |
| Random footage strung together | Plan your shots and practice before recording |
| Generic title cards ("50 stages included") | Highlight what makes *your* game unique |
| Fails to show unique value | Show your biggest hook early and prominently |

For final polish, his [Quality Control Check List for Game Trailers](https://www.derek-lieu.com/blog/2022/7/11/quality-control-check-list-for-game-trailers) is useful. Check for typos, mouse cursors and screen recording icons, mismatched framerates, unwanted single frames, and text hidden behind the seek bar.

## How to use AI

- **Shot list brainstorm**: Pass your game's key features as bullet points to an LLM and ask it to suggest "title cards and scenes for a Tell, Show, Repeat structure." This gives you a starting point for your shot plan.
- **Title card refinement**: Have an LLM identify "phrases that could describe any game" in your title cards to avoid sounding generic.
- **Structure review**: Paste a text list of your shots (timing and description) and ask the LLM whether viewers can identify the genre in the first 10 seconds.

Avoid using generated video footage as if it were gameplay footage. For more, see [Where AI Video Generation Fits](/en/trailer/ai-video/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Trailers (Steamworks Documentation)](https://partner.steamgames.com/doc/store/trailer) — Steam trailer specifications and best practices
- [How to Make a Trailer (Derek Lieu)](https://www.derek-lieu.com/start-here) — Index of trailer creation articles
- [The First Shot of the Game Trailer](https://www.derek-lieu.com/blog/2022/8/1/the-first-shot-of-the-game-trailer) — Four types of opening shots
- [The Simplest Trailer to Make For Your Steam Page](https://www.derek-lieu.com/blog/2021/4/18/the-simplest-trailer-to-make-for-your-steam-page) — Minimal structure for beginners
- [Tell, Show, Repeat](https://www.derek-lieu.com/blog/2023/4/9/tell-show-repeat-the-2nd-easiest-game-trailer-to-make) — Structure using title cards
- [Ideal Game Trailer Length and Labeling](https://www.derek-lieu.com/blog/2018/12/20/ideal-game-trailer-length-and-labeling) — Length and video title naming
- [10 Common Indie Game Trailer Mistakes](https://www.derek-lieu.com/blog/2020/9/14/10-common-indie-game-trailer-mistakes-and-how-to-fix-them) — Common problems and solutions
- [Quality Control Check List for Game Trailers](https://www.derek-lieu.com/blog/2022/7/11/quality-control-check-list-for-game-trailers) — Final polish checklist
- [Game trailers: breaking down a key discovery mistake (GameDiscoverCo)](https://newsletter.gamediscover.co/p/game-trailers-breaking-down-a-key) — Why gameplay should come first
