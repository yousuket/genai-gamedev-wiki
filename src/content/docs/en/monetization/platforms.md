---
title: Distribution Platforms
description: "Comparing Steam, itch.io, App Store, Google Play, and browser-based game portals: platform fees, registration costs, review processes, and tax procedures for developers in Japan."
sidebar:
  order: 1
lastUpdated: 2026-10-05
---

## Overview

A comparison article to help you decide where to sell (or distribute) your indie game.

- Compare **platform fees (the store's cut), registration costs, and review processes** across major platforms in a single table.
- Explains **US tax information filing (W-8BEN equivalent) submission**, which Japanese developers often struggle with initially.
- All numbers are confirmed from official sources and reflect the situation **as of September 2026**.

## Comparison table

| Platform | Primary target | Registration fee | Platform fee | Review |
|---|---|---|---|---|
| [Steam](https://store.steampowered.com/) | PC games | 100 USD per title (recoverable once you reach 1,000 USD in adjusted revenue) | 30% (25% for sales over 10 million USD, 20% over 50 million USD) | Yes (1-5 days) |
| [itch.io](https://itch.io/) | PC, browser, indie | Free | Developer-controlled (default 10%) | Usually none |
| [App Store](https://developer.apple.com/app-store/) | iOS | 99 USD per year | 30% (15% for Small Business Program) ※different system in Japan | Yes |
| [Google Play](https://play.google.com/console/about/) | Android | 25 USD one-time | First 1 million USD: 15%, above that 30% ※new system in Japan from September 30, 2026 | Yes |
| [Poki](https://poki.com/) | Browser | Application required | 50/50 for Poki referrals, 100% for your own traffic | Curated |
| [CrazyGames](https://www.crazygames.com/) | Browser | Application required | Revenue split (rate not disclosed) | Gradual rollout |

(As of September 2026. See individual sections for sources.)

## Steam

The largest PC game store. Individuals can list games directly through "Steam Direct."

- **Registration fee**: 100 USD per title. Not refunded, but recoverable once a title's adjusted total revenue reaches 1,000 USD ([Steam Direct Fee](https://partner.steamgames.com/doc/gettingstarted/appfee), as of September 2026).
- **Platform fee**: Standard 30%. For sales exceeding 10 million USD on a single title, the rate drops to 25%; over 50 million USD, 20% ([Valve announcement](https://steamcommunity.com/groups/steamworks/announcements/detail/1697191267930157838), effective October 2018). For solo developers, assume roughly 30%.
- **Review process**: Store page and build are reviewed in 1-5 days. For your first title, there is a waiting period between paying the registration fee and launch. Additionally, you must keep a "Coming Soon" page public for **at least 2 weeks** ([Onboarding](https://partner.steamgames.com/doc/gettingstarted/onboarding)).
  - The waiting period is listed as 21 days on the onboarding page and 30 days on the [Steam Direct information page](https://partner.steamgames.com/steamdirect), with different documentation (as of September 2026). To be safe, plan for 30 days.
- **Not allowed**: Apps with advertising as the main business model, apps dealing with NFTs or cryptocurrency, and similar content. **On Steam, you cannot make a free game that primarily earns through advertising** ([Onboarding](https://partner.steamgames.com/doc/gettingstarted/onboarding)). Keep this in mind.
- **AI disclosure**: Games using generative AI require an AI usage declaration when submitting to the store. See [Platform AI policies](/en/legal/platform-policies/) for details.

## itch.io

An indie-focused distribution platform. Registration and uploading are free, making it popular for prototypes and game jam entries.

- **Cost**: Free to use ([FAQ](https://itch.io/docs/creators/faq)).
- **Revenue share**: Uses "open revenue sharing"—you decide what percentage of sales go to [itch.io](https://itch.io/), from 0% to any amount. The default is 10% ([Payments](https://itch.io/docs/creators/payments), as of September 2026).
- **Payment processing fees**: Separate from the platform share, PayPal and Stripe charge approximately 0.30 USD plus 2.9%. itch.io recommends pricing at 2 USD or above ([Payments](https://itch.io/docs/creators/payments)).
- **Payout method**: The default "Collected by itch.io" makes itch.io the merchant, handling EU VAT. You can request a payout of 5 USD or more once your balance has been held for at least 7 days after each sale ([Payments](https://itch.io/docs/creators/payments)).
- **Pricing**: You can set a minimum price of 0 to use a "pay what you want" model ([FAQ](https://itch.io/docs/creators/faq)).

## App Store (iOS)

- **Registration fee**: The [Apple Developer Program](https://developer.apple.com/programs/) costs 99 USD per year (pricing varies in local currency) ([What is included](https://developer.apple.com/programs/whats-included/), as of September 2026). If you enroll as an individual, your real name appears as the seller on the store ([Enrollment](https://developer.apple.com/support/enrollment/)).
- **Platform fee (most regions outside Japan)**: 30%. Developers with less than 1 million USD in annual revenue can enroll in the "[App Store](https://developer.apple.com/app-store/) Small Business Program" to reduce this to 15% ([What is included](https://developer.apple.com/programs/whats-included/), [Small Business Program](https://developer.apple.com/app-store/small-business-program/)).
- **Japan store front**: Following the Smartphone Software Competition Promotion Law effective December 2025, the fee structure is "Commission (21%, or 10% for small businesses) plus Apple's payment processing fee of 5%." Using Apple's in-app purchases results in a total of 26% (or 15% for small businesses). External payment methods and links to external sites are also options ([Payment options on the App Store in Japan](https://developer.apple.com/support/payment-options-on-the-app-store-in-japan/), as of September 2026).
- **EU and US**: The EU updated terms in August 2026 ([Apple announcement](https://www.apple.com/newsroom/2026/08/apple-announces-changes-for-apps-in-the-european-union/)), and the US App Store now permits links to external purchasing options ([App Review Guidelines 3.1.1(a)](https://developer.apple.com/app-store/review/guidelines/)). Note that terms vary by region.

## Google Play (Android)

- **Registration fee**: A one-time 25 USD fee. A government-issued ID and credit card are required for identity verification ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en)).
- **New account restrictions**: Individual accounts created after November 13, 2023 cannot go public until they complete **14 consecutive days of closed testing with at least 12 testers** ([Testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)). Start recruiting testers early.
- **Platform fee (traditional)**: 15% on the first 1 million USD in annual sales, 30% on amounts above that, and 15% for subscriptions ([Service fees](https://support.google.com/googleplay/android-developer/answer/112622?hl=en)).
- **Japan to adopt new fee system from September 30, 2026**: A revised fee structure with rates such as 10% on the first 1 million USD (plus a billing fee) is coming to Japan. The billing fee rate for Japan is "to be announced" ([Understanding Google Play's lower service fees](https://support.google.com/googleplay/android-developer/answer/16954621?hl=en), as of September 2026).

## Browser game portals

Sites that host HTML5 (web browser) games and share ad revenue. **The model is free-to-play with ads, not direct sales**.

- **[Poki](https://poki.com/)**: Revenue from Poki referrals is split 50/50; revenue from players coming via your own social media or bookmarks goes entirely to you. The requirement is "web exclusivity"—you can still sell on [Steam](https://store.steampowered.com/) and app stores elsewhere. Featured games are hand-selected ([Working with Poki](https://developers.poki.com/guide/working-with-poki), as of September 2026).
- **[CrazyGames](https://www.crazygames.com/)**: Games start in "Basic Launch" for 7-21 days of testing. Once playtime and retention metrics meet the threshold, you progress to "Full Launch" and revenue sharing begins ([CrazyGames Documentation](https://docs.crazygames.com/)). Payouts occur monthly for balances of 100 EUR or more. You can list games already published on other platforms ([FAQ](https://docs.crazygames.com/faq/)). The revenue split rate could not be found in official documentation.

## Others (summary only)

- **Epic Games Store**: On the first 1 million USD per product per year, developers keep 100%. Above that, 88% (Epic takes 12%) ([Epic Games Store news](https://store.epicgames.com/en-US/news/epic-games-store-updates-revenue-share-keep-100-of-the-first-1m-per-product-per-year), [Distribution](https://store.epicgames.com/en-US/distribution)).
- **Nintendo (Switch / Switch 2)**: Individuals can register on the Nintendo Developer Portal, but accessing Switch development information requires a separate application after registration ([Nintendo Developer Portal](https://developer.nintendo.com/)). Console development is typically harder due to hardware requirements and review burden, so most solo developers start with PC or mobile to build a track record.

## Tax procedures for Japan-based developers

[Steam](https://store.steampowered.com/), [itch.io](https://itch.io/), [App Store](https://developer.apple.com/app-store/), and [Google Play](https://play.google.com/console/about/) all require **US tax information (W-8BEN equivalent) submission**. You fill this in through a "tax interview" questionnaire in each platform's registration flow.

| Platform | What to submit | Notes |
|---|---|---|
| [Steam](https://store.steampowered.com/) | W-8BEN equivalent information | Standard withholding rate is 30%. Residents of countries with tax treaties with the US can provide a US or home-country Tax Identification Number (TIN) to potentially reduce this. **Amounts already withheld cannot be refunded, even if you provide a number later** ([Tax FAQ](https://partner.steamgames.com/doc/finance/taxfaq)) |
| [itch.io](https://itch.io/) | Tax interview | Without a TIN, the rate is 30% even for countries with treaties ([Payments](https://itch.io/docs/creators/payments)) |
| [App Store](https://developer.apple.com/app-store/) | W-8BEN or equivalent | Answer App Store Connect questions to determine the appropriate form ([Provide tax information](https://developer.apple.com/help/app-store-connect/manage-tax-information/provide-tax-information/)) |
| [Google Play](https://play.google.com/console/about/) | W-8BEN or equivalent | If not provided, payments may be blocked ([US tax information](https://support.google.com/paymentscenter/answer/10349995?hl=en)) |

- Japan has a tax treaty with the US ([US-Japan tax treaty](https://www.irs.gov/pub/irs-trty/japan.pdf)). The Japanese Tax Identification Number for individuals is the <strong>My Number (individual identification number)</strong> ([OECD TIN information](https://www.oecd.org/content/dam/oecd/en/topics/policy-issue-focus/aeoi/japan-tin.pdf)).
- The actual withholding rate applied is displayed in your platform account after completing the tax interview. If it differs from your expectation, verify and resubmit before you start earning.
- Separate from US withholding, **you must declare income and residence tax in Japan**. Depending on your revenue level, consumption tax may also apply.

## How to choose

- **Selling on PC** → [Steam](https://store.steampowered.com/) is the first choice. Testing with [itch.io](https://itch.io/) prototypes to gauge interest is also effective.
- **Free with wide reach and ad-supported earnings** → Browser portals or mobile. Steam does not permit ad-based models.
- **Mobile with in-app purchases** → Plan ahead for membership fees, testing requirements, and regional fee differences. See [Ads and in-app purchases](/en/monetization/ads-and-iap/) for purchase design details.
- When publishing on multiple stores, Steam's Early Access has rules like "do not price higher than on other stores." Pricing is detailed in [Pricing](/en/monetization/pricing/).

## How to use AI

- **Reading terms and policies**: Have AI summarize long distribution agreements or review guidelines, then ask questions like "Are ads allowed?" or "Can I link to external payment?" This is efficient.
- **Preparing for tax interviews**: Ask AI to explain unfamiliar terms (TIN, withholding tax, tax treaty). This is helpful.
- **Translating store content**: Use AI to localize your store page into multiple languages.
- **AI disclosure**: Platforms like [Steam](https://store.steampowered.com/) require declaration of AI use. See [Platform AI policies](/en/legal/platform-policies/) for details.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-02**: GOG.com adds Japanese yen pricing. For example, "Transport Fever 3" is priced at 7,900 yen on GOG and 6,990 yen on Steam, according to reports ([source](https://automaton-media.com/articles/newsjp/20261002-471335/) (in Japanese))
- **2026-09-29**: Initial version created.
<!-- AUTO-UPDATE:END -->

## References

- [Steam Direct](https://partner.steamgames.com/steamdirect) — Requirements for publishing on Steam
- [Steamworks: Onboarding](https://partner.steamgames.com/doc/gettingstarted/onboarding) — Steps from registration to launch
- [Steamworks: Tax FAQ](https://partner.steamgames.com/doc/finance/taxfaq) — Withholding tax and tax forms
- [itch.io: Payments](https://itch.io/docs/creators/payments) — Revenue sharing, payouts, and taxes
- [Apple: Payment options on the App Store in Japan](https://developer.apple.com/support/payment-options-on-the-app-store-in-japan/) — Platform fees for the Japan store front
- [Apple: App Store Small Business Program](https://developer.apple.com/app-store/small-business-program/) — Reduced 15% for eligible developers
- [Google Play: Understanding lower service fees](https://support.google.com/googleplay/android-developer/answer/16954621?hl=en) — New fee structure and regional rollout dates
- [Working with Poki](https://developers.poki.com/guide/working-with-poki) — Poki revenue sharing and exclusivity terms
- [CrazyGames Documentation](https://docs.crazygames.com/) — Publishing flow
