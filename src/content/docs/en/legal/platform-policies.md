---
title: Platform AI Policies
description: Generative AI policies from Steam, itch.io, App Store, Google Play, and consoles, plus guardrails needed when using LLMs to generate content in-game.
sidebar:
  order: 3
lastUpdated: 2026-09-29
---

## Overview

When selling a game that uses generative AI, you must follow not only the terms of the AI tools themselves ([AI Tool Commercial Use Terms](/en/legal/tool-terms/)) but also the rules of your sales platforms.

- **[Steam](https://store.steampowered.com/)** requires disclosure of AI-generated content at submission. The disclosure appears on the store page as well.
- **[itch.io](https://itch.io/)** effectively requires AI use disclosure on asset pages.
- **[App Store](https://developer.apple.com/app-store/) / [Google Play](https://play.google.com/console/about/)** have specific rules about AI.
- When you generate text or images in-game using an LLM (live generation), all platforms require additional safeguards called guardrails.

For choosing where to sell, see [Sales Platforms](/en/monetization/platforms/).

## Steam

### How disclosure works

On [Steam](https://store.steampowered.com/), before your game enters review, you answer a "Content Survey." The third section asks about generative AI ([Steamworks documentation](https://partner.steamgames.com/doc/gettingstarted/contentsurvey), as of September 2026).

AI use is divided into two categories.

| Category | Definition (summary) | Additional requirements |
|---|---|---|
| **Pre-Generated** | Content you create during development with help from AI tools and ship with the game for players to see | No illegal or infringing content, marketing matches the game (Steam Distribution Agreement). Reviewed by the same standards as non-AI content |
| **Live-Generated** | Content created during gameplay with help from AI tools | Same rules as pre-generated, plus **disclose the guardrails you use to prevent illegal content generation** |

### What does not need disclosure

The same documentation states that modern game development tools often have AI built in, but efficiency gains from them are not covered by this section. The focus is on content shipped with the game that players consume (artwork, sound, narrative, localization, and so on).

This clarification came in a January 2026 update, according to reporting ([PC Gamer](https://www.pcgamer.com/software/ai/steam-updates-ai-disclosure-form-to-specify-that-its-focused-on-ai-generated-content-that-is-consumed-by-players-not-efficiency-tools-used-behind-the-scenes/)). For example, simply using a code completion tool would not seem to trigger disclosure. However, if you create material that players see or hear using AI, you disclose it.

### Store page display and player reports

In a January 2024 Valve announcement, "[AI Content on Steam](https://steamcommunity.com/groups/steamworks/announcements/detail/3862463747997849619)," it is explained as follows:

- Disclosure content is used in review and **much of it appears on the store page**. This helps buyers understand how AI is used.
- Games with live-generation AI let players report illegal content through an in-game overlay.
- **Games with live-generation AI producing "Adult Only Sexual Content" cannot be released at this time.**

### Other notes

- After release, you cannot change some of your survey answers yourself. If you need to change content, you must contact Steam Support ([Steamworks documentation](https://partner.steamgames.com/doc/gettingstarted/contentsurvey)).
- Using an external AI service costs money each time. The FAQ gives examples of recovering that cost: raising the base price, in-game purchases, subscriptions, or DLC.

## itch.io

- Since November 2024, the project edit page has a "Generative AI Disclosure" field. **Asset pages require disclosure.** Undisclosed AI assets no longer appear on browse pages. Game pages have disclosure recommended ([itch.io official post](https://itch.io/t/4309690/generative-ai-disclosure-tagging)).
- Selecting "yes" applies an "AI Generated" tag. Additional tags by type also appear: graphics, sound, text and dialogue, and code. Selecting "no" applies a "No AI" tag.
- The [Quality Guidelines](https://itch.io/docs/creators/quality-guidelines) ask you to avoid creating AI content in bulk or mass-producing pages.
- Traditional algorithms that do not use large datasets do not trigger the generative AI tag. Examples include NPC pathfinding and procedural generation.

## App Store (Apple)

Key related sections of the [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) (as of September 2026) are:

- **5.1.2(i)**: When sharing personal data with third parties, **including third-party AI**, you must disclose the recipient and get clear prior permission. The phrase "third-party AI" was added in an update on November 13, 2025 ([Apple Developer News](https://developer.apple.com/news/?id=ey6d8onl)). Sending player input to an external LLM API may fall into this category.
- **1.2 (User-Generated Content)**: Apps with user-generated content must include filtering for inappropriate content, a reporting mechanism, user blocking, and public contact information. It is not stated whether LLM output falls under this section. However, for games where generation happens based on player input, it is safer to have similar mechanisms in place.
- **4.7**: Software not included in the binary is mentioned, such as chatbots or HTML5 mini-games. Developers are responsible for ensuring these follow the guidelines and the law.

## Google Play

The key points of the [AI-Generated Content policy](https://support.google.com/googleplay/android-developer/answer/13985936?hl=en) (as of September 2026) are:

- Apps that generate AI content must still follow existing policies. Do not generate content that exploits children, deceives people, or other harmful material.
- **The app must have a feature to report or flag uncomfortable content to the developer without leaving the app.** You must also use these reports to improve filtering and moderation.
- The [scope explanation](https://support.google.com/googleplay/android-developer/answer/14094294?hl=en) lists examples such as apps where interacting with an AI chatbot is the main feature, or apps that create images from prompts. Apps that only include AI-created assets without generation functionality are out of scope.

## Consoles and other stores

- Rules for PlayStation, Xbox, and Nintendo developers are provided mainly under non-disclosure agreements (NDA). As of September 2026, **no publicly available AI disclosure rules like Steam's have been confirmed.** News reports note that major stores other than Steam lack clear disclosure rules ([The Conversation](https://theconversation.com/are-video-game-developers-using-ai-players-want-to-know-but-the-rules-are-patchy-274850), February 2026).
- The latest requirements for consoles are announced on each company's developer portal.
- In the EU, the European Commission explains that the transparency rules of the AI Act take effect from August 2026. These include requirements like making it clear to users that they are talking to a chatbot ([European Commission](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)). If you publish a live-generation game for the EU, confirm whether your game is covered.

## Guardrails for live generation

When your game uses an LLM to generate dialogue or images in-game (such as AI NPCs), the policies above suggest the following safeguards are needed at minimum.

| Safeguard | Details | Related rule |
|---|---|---|
| Input and output filtering | Check both player input and AI output using moderation APIs or keyword blocklists | [Steam](https://store.steampowered.com/) (guardrail disclosure), [Google Play](https://play.google.com/console/about/), [App Store](https://developer.apple.com/app-store/) 1.2 |
| System prompt restrictions | Instruct the model to refuse topics outside the world, sexual or violent content, and topics about real people | Steam (illegal content prevention) |
| In-game report button | Allow reporting without leaving the game. Provide this separately from Steam's overlay reporting | Google Play (required), App Store 1.2 |
| Rating alignment | Ensure generated content does not exceed the declared rating or adult setting | Steam Content Survey |
| Personal data consent | Disclose the data sent to external AI, the recipient organization, and obtain consent | App Store 5.1.2(i) |
| AI disclosure | Make it clear to players that generated dialogue and images come from AI | Steam store display, EU AI Act |
| Logging and improvement | Record reported outputs and blocked counts, and improve filters | Google Play |

**The terms of the LLM API you use also have restrictions.** For example, the [Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms) prohibit use in apps for under-18 audiences or where under-18 users are likely (as of September 2026). Anthropic also requires additional safety measures from organizations that embed its API in products used by minors ([Claude Help Center](https://support.claude.com/en/articles/9307344-responsible-use-of-anthropic-s-models-guidelines-for-organizations-serving-minors)).

## How to use AI

- **Draft disclosure text**: Pass a material inventory (which assets you made with which tools and how you modified them) to an LLM to draft the description you write in the [Steam](https://store.steampowered.com/) Content Survey.
- **Red teaming (safety testing)**: For live-generation NPCs, use another LLM to generate large numbers of intentionally inappropriate prompts and automatically test whether your filters catch them.
- **A note**: Guardrails cannot prevent everything. Keep a channel to receive reports and a way to shut down generation if problems occur (such as a server-side flag). Related: [AI Coding Tools](/en/dev-env/ai-coding-tools/)

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: First published.
<!-- AUTO-UPDATE:END -->

## References

- [Content Survey (Steamworks documentation)](https://partner.steamgames.com/doc/gettingstarted/contentsurvey) — Definitions and FAQ for the AI disclosure section
- [AI Content on Steam (Steamworks Development)](https://steamcommunity.com/groups/steamworks/announcements/detail/3862463747997849619) — Valve announcement from January 2024
- [Generative AI Disclosure tagging (itch.io)](https://itch.io/t/4309690/generative-ai-disclosure-tagging) — Explanation of itch.io AI disclosure tags
- [itch.io Quality Guidelines](https://itch.io/docs/creators/quality-guidelines) — Quality guidelines on AI-generated content
- [App Review Guidelines (Apple)](https://developer.apple.com/app-store/review/guidelines/) — Sections 5.1.2(i), 1.2, and others
- [AI-Generated Content (Google Play)](https://support.google.com/googleplay/android-developer/answer/13985936?hl=en) — In-app reporting requirement
- [Understanding Google Play's AI-Generated Content policy](https://support.google.com/googleplay/android-developer/answer/14094294?hl=en) — Scope explanation
- [Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms) — Age-related restrictions
- [AI Act (European Commission)](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) — Transparency rules overview
