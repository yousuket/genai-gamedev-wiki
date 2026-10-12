---
title: Ads and In-App Purchases
description: How to use ads and in-app purchases in mobile and browser games, rules for gacha items, and how to balance API costs with revenue for games using LLMs.
sidebar:
  order: 3
lastUpdated: 2026-09-29
---

## Overview

Free-to-play games earn revenue through ads and in-app purchases (IAP). This article covers:

- Types of ads and how to implement them on mobile and browser platforms
- Basic rules for in-app purchases and important considerations for gacha (random item sales)
- **How to balance API costs and revenue for games that use LLMs in gameplay**

For platform-specific fees, see [Sales Platforms](/en/monetization/platforms/).

## Revenue Models

| Model | How it works | Best for |
|---|---|---|
| Pay-to-play | Pay once, play everything | [Steam](https://store.steampowered.com/), [itch.io](https://itch.io/), home game consoles |
| Ads | Free to play, earn from ad views | Mobile, browser (not allowed on Steam) |
| In-app purchases | Free to play, sell items and features | Mobile, Steam free-to-play games |
| Subscription | Regular monthly payments | Games with ongoing server costs |

Steam does not accept apps with "ad revenue as the primary business model" ([Steamworks Onboarding](https://partner.steamgames.com/doc/gettingstarted/onboarding), as of September 2026). Consider ads only for mobile or browser games.

## Ads

### Ad Formats

| Format | How it works | Considerations |
|---|---|---|
| Rewarded ads | Players choose to watch a video and get rewards | Does not harm user satisfaction much; needs reward balance |
| Interstitial ads | Full-screen ads between stages or levels | Too many can cause players to leave |
| Banner ads | Small ads always on screen edges | Low revenue; avoid layouts that cause accidental clicks |

Generally, **rewarded ads that players choose to watch** are the best starting point, as they harm the experience least.

### Mobile

Use advertising SDKs like Google AdMob, which are libraries you add to your app. There is also a technique called "mediation" that switches between multiple ad networks to increase revenue. Revenue share rates and prices vary by network and region—most do not publish fixed rates—so **measure actual revenue with a test release** to be sure.

### Browser

- **Post to a portal**: [Poki](https://poki.com/) and [CrazyGames](https://www.crazygames.com/) display ads through their own SDKs and share revenue with you. You do not need to negotiate with ad networks directly ([Working with Poki](https://developers.poki.com/guide/working-with-poki), [CrazyGames FAQ](https://docs.crazygames.com/faq/)). CrazyGames requires that monetized games not include external ads or logos from other portals (CrazyGames FAQ).
- **Serve from your own site**: Google's AdSense H5 Games Ads is a system for showing ads between HTML5 games and rewarded ads. It requires application ([Sign up for AdSense H5 Games Ads](https://support.google.com/adsense/answer/1705831?hl=en)).

## In-App Purchases

### Required Use of Store Payment Systems

- **[App Store](https://developer.apple.com/app-store/)**: You must use Apple's in-app purchase system to unlock features or content (subscriptions, in-game currency, additional levels, etc.). Exceptions vary by region. In the US storefront, links to external purchase methods are allowed ([App Review Guidelines 3.1](https://developer.apple.com/app-store/review/guidelines/), as of September 2026). Japan now offers external payment options ([Payment options on the App Store in Japan](https://developer.apple.com/support/payment-options-on-the-app-store-in-japan/)).
- **[Google Play](https://play.google.com/console/about/)**: Different regions have alternative payment and external link options, and the fee structure is changing ([Understanding Google Play's lower service fees](https://support.google.com/googleplay/android-developer/answer/16954621?hl=en)).

### Gacha (Random Items) Requirements

- **Probability disclosure**: Both App Store and Google Play require you to **disclose probabilities before purchase** for any paid items with randomized outcomes (loot boxes) ([App Review Guidelines 3.1.1](https://developer.apple.com/app-store/review/guidelines/), [Google Play Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en)).
- **Composite gacha ban (Japan)**: "Composite gacha" (where combining specific items unlocks another item) may violate Japan's law against unfair premiums under the Antimonopoly Act, according to the Consumer Affairs Agency (in Japanese) ([Consumer Affairs Agency](https://www.caa.go.jp/policies/policy/representation/fair_labeling/guideline/pdf/120518premiums_1.pdf), [FAQ](https://www.caa.go.jp/policies/policy/representation/fair_labeling/faq/card/)).
- Each country and region has its own rules (South Korea requires probability disclosure; see [Google Play's country-specific requirements](https://support.google.com/googleplay/android-developer/answer/6223646?hl=en)).

### Basics of Monetization Design

- **Make purchases clear**: Make it obvious what players get—cosmetics, ad removal, additional levels, etc.
- **Keep free play fun**: Games that require payment to progress tend to get poor reviews.
- **Start small**: Begin with simple items like "remove ads" or "bonus content," then add more once you have data.

## API Costs for Games Using LLMs

Games with AI NPCs (characters you talk to powered by LLMs) or procedural story generation **incur API usage fees each time a player plays**. If sold as pay-to-play, heavy players can end up costing you more than they pay, leading to losses.

### Cost Examples (as of September 2026)

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Source |
|---|---|---|---|
| Claude Haiku 4.5 | $1 | $5 | [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Sonnet 5.5 | $2 | $10 | Same |
| Gemini 3.1 Flash-Lite | $0.25 | $1.50 | [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing) |

Tokens are the unit of text processing for LLMs. The same number of characters in Japanese and English does not mean the same token count, so measure with your actual prompts.

### Sample Calculation

Assume one conversation with an AI NPC uses 3,000 input tokens (2,000 are the same system prompt every time) and 200 output tokens:

| Condition | Per conversation | 300 conversations (approximately 10 hours) |
|---|---|---|
| Claude Haiku 4.5 (no cache) | approximately $0.004 | approximately $1.20 |
| Claude Haiku 4.5 (cached system prompt) | approximately $0.0022 | approximately $0.66 |
| Gemini 3.1 Flash-Lite (no cache) | approximately $0.00105 | approximately $0.32 |

- Anthropic's prompt caching charges 0.1 times the normal input rate (for Haiku 4.5) when reading from cache. Writing to cache costs 1.25 times (5 minutes) or 2 times (1 hour) the normal rate ([Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)).
- The Batch API offers 50% off but is not suitable for conversations that need immediate responses (same source). It works for pre-generating large amounts of text.
- If you sell for $10 on [Steam](https://store.steampowered.com/) and Steam takes 30%, you get about $7 (before taxes). In the sample above, if even **one heavy user plays 10 times more**, some models will cost more than you earned.

### Monetization Options

| Method | How it works | Pros | Cons |
|---|---|---|---|
| Pay-to-play + usage limits | Cap conversations per day, etc. | Simple to understand | Players often object to limits |
| Subscription | Charge monthly for AI features | Ongoing revenue matches ongoing costs | Must provide enough value to avoid cancellation |
| Pay-per-use (credits) | Sell credits for conversations | Revenue is proportional to cost | Players resist per-use payments; must follow store rules |
| BYOK | Players enter their own API key (Bring Your Own Key) | Your API cost is zero | Too difficult for most players; you are responsible for key security |
| Local models | Run a small model on the player's PC | Your API cost is zero | Increases system requirements; quality usually drops |
| Hybrid | Mostly local or cheap model, high-quality model for key moments | Balance cost and quality | Complex to implement |

### Implementation Notes

- **Do not embed API keys in your game**: Keys in the client can be stolen. Use your own server (proxy) as an intermediary and limit usage per player.
- **If using BYOK**: Confirm in advance how keys should be stored (encrypted on device, etc.) and whether app stores accept this in their review policies.
- **Free tier data handling**: Gemini API's free tier states that inputs may be used for product improvement (listed on the [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing) page). If you send player input, your terms of service and privacy policy must explain this.
- **Platform disclosure**: If your game generates AI in real-time during gameplay, some platforms like Steam may require additional disclosure. For details, see [Platform AI Policies](/en/legal/platform-policies/).

## How to use AI

- **Automate cost calculations**: Have AI create spreadsheets or scripts where playtime, conversation frequency, and token count are variables. This speeds up decisions about pricing and limits.
- **Shorten prompts**: Ask AI to summarize and compress the system prompt you send every time. This reduces input tokens. Test to make sure quality does not drop.
- **Payment text**: Use AI to draft product descriptions and probability disclosures.
- **Log analysis**: AI helps create code to aggregate and visualize data like ad view rates and purchase rates.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) — Apple's in-app purchase rules (section 3.1)
- [Google Play: Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en) — Google Play's payment policy
- [Consumer Affairs Agency: FAQ on composite gacha](https://www.caa.go.jp/policies/policy/representation/fair_labeling/faq/card/) (in Japanese) — Gacha regulation guidance
- [AdSense H5 Games Ads](https://support.google.com/adsense/answer/1705831?hl=en) — Applying for browser game ads
- [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing) — Claude API pricing, caching, and batch discounts
- [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing) — Gemini API pricing and free tier
