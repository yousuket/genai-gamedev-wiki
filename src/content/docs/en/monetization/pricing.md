---
title: Pricing
description: How to set prices for indie games, regional pricing on Steam, sale rules, early access, and how to use free demos—all explained.
sidebar:
  order: 2
lastUpdated: 2026-09-29
---

## Overview

Deciding "how much to charge" often feels like an afterthought, but it is actually something to think about from the planning stage. This article covers the following.

- How to set prices for indie games (comparing with similar games)
- [Steam](https://store.steampowered.com/) regional pricing and sales rules (as of September 2026)
- How to use early access and free demos

For platform-specific fees, see [Sales Platforms](/en/monetization/platforms/).

## How to set a price

### 1. Research similar games' prices

The most reliable approach is to **find games in the same genre and roughly the same scope, then check their prices**. Marketing expert Chris Zukowski recommends this process ([4 tips to help you price your indie game](https://howtomarketagame.com/2022/08/23/4-tips-to-help-you-price-your-indie-game/)):

1. Pick about 10 games released in the past 3 years that are similar in genre and scope (including games that did not sell well).
2. Create a table comparing their prices, how your game's quality stacks up, and how reviews responded.
3. Use SteamDB (a third-party site showing [Steam](https://store.steampowered.com/) price history) to see how often and how deeply each game discounts its price.

Zukowski also suggests setting a slightly higher price to account for the fact that "most people buy during sales." This is one perspective; combine it with your own research findings to decide.

### 2. Match volume and expectations

Price is also a signal to players about what kind of experience they should expect.

| Price tier | Suitable for |
|---|---|
| Free + ads or in-app purchases | Browser games, casual mobile games |
| Low price | Short games or game jam projects |
| Mid price | Indie games with several hours to tens of hours of playtime |
| High price | Games with strong scope and polish, and comparable alternatives at the same price point |

Specific amounts vary by genre; use your comparison research to decide. Zukowski notes that for newcomers or games made in a short timeframe, even $4.99 is reasonable ([Are indie games too cheap?](https://howtomarketagame.com/2022/08/17/are-indie-games-too-cheap/)).

### 3. Account for platform fees

Steam takes 30% by default ([Valve's announcement](https://steamcommunity.com/groups/steamworks/announcements/detail/1697191267930157838)). Additionally, different countries apply sales tax or VAT, and there may be US withholding taxes or Japanese taxes. **The full price × units sold does not go directly to your account.** Plan your pricing with this in mind, making sure you can recover development costs (AI tool subscriptions, API usage fees, asset purchases, and so on).

## Regional pricing (Steam)

On [Steam](https://store.steampowered.com/), you set prices in 37 currencies and 4 regional groups ([Pricing](https://partner.steamgames.com/doc/store/pricing), as of September 2026).

- Once you set a base USD price, [Steamworks](https://partner.steamgames.com/) can auto-generate prices for each currency. You can choose between three conversion methods: "exchange rate only," "purchasing power parity," or "multiple factors (purchasing power, local entertainment prices, exchange rate)" ([same source](https://partner.steamgames.com/doc/store/pricing)).
- **If a price is not set for a particular currency, users in that country cannot purchase the game.** For example, if there is no Japanese yen price, Japanese players cannot buy it ([same source](https://partner.steamgames.com/doc/store/pricing)).
- The minimum price is set at approximately the 0.99 USD level ([same source](https://partner.steamgames.com/doc/store/pricing)).
- Valve reviews price changes, which typically take 1 to 2 business days to go live ([same source](https://partner.steamgames.com/doc/store/pricing)).

:::tip
Auto-conversion is convenient, but it is worth reviewing Japanese yen prices against what Japanese players expect. Compare with indie games in the same genre released in Japan.
:::

## Sales (Steam)

[Steam](https://store.steampowered.com/) discounts have detailed rules ([Discounting](https://partner.steamgames.com/doc/marketing/discounts), as of September 2026).

| Rule | Details |
|---|---|
| Right after release | Cannot discount for 30 days from release (or early access launch). Exception: launch discounts. |
| Launch discount | Any discount set before release. 10–40%, lasting 7–14 days. Valve recommends 10–15%. |
| Discount spacing | 30 days must pass between the end of one discount and the start of the next. |
| After a price increase | Cannot discount for 30 days after raising the price in any currency. |
| Discount size | Between 10% and 95%. |
| Seasonal sales | Four times per year (spring, summer, fall, winter). Bypasses the 30-day spacing rule, but the release-window and post-raise restrictions still apply. |

- **Discounts of 20% or more** trigger notification emails to wishlist subscribers, provided the sale covers your cheapest package and lasts more than 8 hours ([Wishlists](https://partner.steamgames.com/doc/marketing/wishlist)).
- Plan your sale calendar by working backward from your release date, seasonal sales windows, and event dates.

## Early Access

Early Access means selling an incomplete game while listening to player feedback and continuing development. [Steam](https://store.steampowered.com/) describes the philosophy as follows ([Early Access](https://partner.steamgames.com/doc/store/earlyaccess), as of September 2026):

- **Not a tool to fund development.** If you cannot complete the game without hitting a sales target, you should revisit your plan.
- **Not a pre-order.** You must deliver a playable game at the time of purchase.
- **Not priced higher than elsewhere.** Early Access price on Steam should be equal to or lower than the price elsewhere.
- On final-release pricing, there are no fixed rules. Some games raise the price; some lower it. Valve recommends thinking about whether existing early-access players will feel the final price is fair.

For solo developers, first make sure you can write a concrete roadmap (upcoming updates) and have the bandwidth to keep updating.

## Free demo

A demo lets players experience a free portion of your game. It is an important tool for building your wishlist.

- On [Steam](https://store.steampowered.com/), you can attach a demo to your main store page or give it its own page. If it has its own page, the demo itself can receive reviews ([Demos](https://partner.steamgames.com/doc/store/application/demos), as of September 2026).
- The first time you release a demo, you can send a **one-time notification to people who already wishlisted your main game**. You must trigger this within 14 days of the demo release ([same source](https://partner.steamgames.com/doc/store/application/demos)).
- A demo is required to participate in Steam Next Fest (held three times a year). See [Building a Wishlist](/en/monetization/wishlists/) for details.

A good demo scope is the minimum needed to convey your game's core loop and appeal. For ideas on gauging demo response, see [Playtesting](/en/design/playtesting/).

## Pricing on other platforms

- **[itch.io](https://itch.io/)**: You can set the minimum price at 0 and let players choose how much to pay ([FAQ](https://itch.io/docs/creators/faq)). Payment fees apply (roughly $0.30 + 2.9%), so itch.io recommends pricing games at $2 or more ([Payments](https://itch.io/docs/creators/payments)).
- **Mobile and browser**: Free with ads or in-app purchases is more common than paid games. See [Ads and In-App Purchases](/en/monetization/ads-and-iap/) for details.

## How to use AI

- **Building comparison tables**: Have an AI organize a list of comparable games (prices, genres, review counts, and so on) for efficiency.
- **Checking regional pricing**: Feed the auto-converted price table for each currency into an AI and have it flag prices with odd decimals or prices that seem too high or too low.
- **Planning sales**: Provide your release date, seasonal sale windows, and event dates. An AI can sketch out a discount schedule that respects the 30-day spacing rules.
- **Should I lower the price if I used AI?**: Using AI to make the game does not directly affect pricing. Base your price on the quantity and quality of experience players receive. For disclosure requirements, see [Platform AI Policies](/en/legal/platform-policies/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Steamworks: Pricing](https://partner.steamgames.com/doc/store/pricing) — Regional pricing and minimum prices
- [Steamworks: Discounting](https://partner.steamgames.com/doc/marketing/discounts) — Sales rules
- [Steamworks: Early Access](https://partner.steamgames.com/doc/store/earlyaccess) — Early Access philosophy and rules
- [Steamworks: Demos](https://partner.steamgames.com/doc/store/application/demos) — How to release a demo
- [4 tips to help you price your indie game](https://howtomarketagame.com/2022/08/23/4-tips-to-help-you-price-your-indie-game/) — Chris Zukowski on pricing strategy
- [itch.io: Payments](https://itch.io/docs/creators/payments) — itch.io fees and payments
