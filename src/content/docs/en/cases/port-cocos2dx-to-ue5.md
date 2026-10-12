---
title: How Three Cocos2d-x Mobile RPGs Were Ported to Unreal Engine 5.8 Without a Rewrite
description: A solo developer named kiarina ported three running mobile RPGs (about 190,000 lines each) from Cocos2d-x to Unreal Engine 5.8 using Claude (Fable 5 and Opus 5), with a compatibility runtime approach, automated testing, and save data migration.
sidebar:
  order: 14
lastUpdated: 2026-10-05
---

## Overview

The "Regional Quest" series is a mobile RPG where players travel through real Japanese municipalities (Gifu Quest, Mie Quest, Aichi Quest). In September 2026, solo developer kiarina ported all three titles from Cocos2d-x 3.17.2 to Unreal Engine 5.8. The article published on Zenn on October 1, 2026, is the source for this case study.

What stands out is that the games were not rewritten. Instead, a "compatibility runtime" with the same interface as Cocos2d-x was built on top of Unreal Engine, allowing the old C++, Lua, and Cocos Studio UI to run unchanged. Most of the work was done by an AI agent (Claude, using Fable 5 and Opus 5). The developer handled policy decisions, approval during testing, and device verification.

| Aspect | Details |
|---|---|
| Developer | kiarina (on Zenn and GitHub). Solo development. Currently working on a Unreal Engine game called Tokyo Canvas, shipping October 15, 2026 (stated in the article) |
| Timeline | Started September 6, 2026. UE versions launched: Gifu on September 22, Mie on September 25, Aichi on September 28 |
| Models | Claude (Fable 5 and Opus 5). Tool names (Claude Code, etc.) were not mentioned in the article |
| What was ported | Custom RPG engine on Cocos2d-x 3.17.2, game logic in Lua, UI in Cocos Studio, maps in Tiled. Ads (AdMob), in-app purchases, custom server, and save data |
| Codebase size (developer's count) | Gifu: about 190,000 lines (60% Lua, 40% C++). Mie: 3,463 files, about 186,000 lines. Aichi: 5,753 files, about 193,000 lines. Newly written code in Gifu: about 12,600 lines |
| Commits | Gifu: 315, Mie: 133, Aichi: 103 |
| API usage | Claude's Max 5x plan, about one week's quota per game. Gifu alone consumed about two weeks' quota (developer's estimate) |
| Distribution | All three are free. Distributed as updates to existing apps on [App Store](https://developer.apple.com/app-store/) and [Google Play](https://play.google.com/console/about/) |

## What was ported

Gifu Quest, the first in the Regional Quest series, launched in February 2021. All three use the same custom RPG engine, with game logic in Lua, UI in Cocos Studio, and maps in Tiled. Revenue comes from AdMob ads and in-app purchases. Later titles added more features.

The developer positioned these as "games in production — with ads and purchases, connected to a custom server, with daily active users." The task was not to build from scratch, but to migrate a live product along with user save data and purchase rights.

The line counts shown at the start reflect the scale of the migration target: all three codebases approached 200,000 lines. The amount of new code written (about 12,600 lines in Gifu) was small because the old code was not modified; instead, the compatibility runtime absorbed the changes.

## Why Unreal Engine

For 2D mobile games, Godot, Unity, and Cocos Creator come to mind first. The developer cited several reasons for choosing Unreal Engine:

- **Active development**: Having chosen Cocos2d-x about 15 years ago and experienced the pain of running a game on an engine that was no longer maintained, he prioritized an engine with longevity.
- **Source availability**: Both engine and editor source are public, allowing deep troubleshooting when needed.
- **Expansion potential**: PlayStation, Xbox, and Switch support are possible. The asset and plugin ecosystem is rich. He wanted to use Epic Online Services.
- **Prior AI + Unreal knowledge**: He had experience with Unreal MCP in developing Tokyo Canvas, where he had AI control the editor.

He also notes that the current approach uses almost no Unreal Engine features. What was needed was "a foundation to run as an app on each platform" and "the peace of mind that comes with long-term support." For a comparison of game engines, see [How to choose a game engine](/en/dev-env/engines/).

## How it was done

### 1. Rewrite abandoned after two days

On September 6, the initial plan was to rebuild the game logic in Unreal Engine and wire up Lua events one by one. In two days, the first map, dialogue, basic combat, recruiting party members, and treasure chests all worked. However, the screen was a separate reimplementation, not the original, and he judged this pace unsustainable. Regional Quest has hundreds of events, and C++ contains both combat calculations and state transitions—it was not a case of "just swap the graphics."

On September 8, he switched tactics: "Run the old C++ entirely as-is. Underneath, build a compatibility runtime that looks like Cocos2d-x." That day, the old code ran in the editor through title screen, field, and battles. By evening, it ran on both iPad and Pixel 6 with the old save data loaded. The two days of rewrite work were deleted the next day.

### 2. Three principles for the compatibility runtime

- **Build only what is used**: Do not reimplement all of Cocos2d-x; only create the APIs that the old code and Lua actually call.
- **Never modify the old code; move changes to the runtime**: Where the old code had to be touched, each instance was logged. For Mie and Aichi, the log was reapplied as a patch.
- **Narrow the boundary with the outside world to one interface**: Drawing, device input, audio, HTTP, and native code (ads, purchases, tracking consent, location) are the only five points of contact.

By narrowing the boundary, the same old code could run both "inside Unreal Engine" and "in a non-rendering command-line host." The host used sanitizers (ASan and UBSan, tools that detect memory issues) to run the old code and catch memory bugs earlier than in the editor or on device.

### 3. Cocos Studio UI worked as-is

The developer calls this the biggest win. Nearly all screens—menus, shops, encyclopedias, dialogs—were built in Cocos Studio. Aichi alone has 231 files. The runtime does not load the distribution format (.csb) but the authoring format (.csd, which is XML), handling nested ProjectNode, plist atlases, fonts, and animations at runtime.

Correct appearance is not enough. Cocos Studio UI can look right but not respond to touches. In Gifu, the shop row's touch area was compressed from 640x100 (in the CSD) to 10x10 (from a transparent image), making items unselectable. To be certain, he built a test that loaded all CSDs in the non-rendering host and compared every Widget's size and touch settings against the CSD values. Of Aichi's 231 files, zero mismatches. He could verify all screens without opening a single one.

There was one pitfall: the Visible attribute in CSD is the eye icon in the editor. Cocos2d-x 3.17 ignores it. The runtime respected it, hiding nodes that were visible in the old version. This was discovered when debug displays were missing in Aichi. All three games were corrected.

### 4. Revenue model verified first

Working and being deliverable to existing players are different things. Before locking in the approach, he set a gate: "If ads and purchases do not work on both platforms, abandon Unreal Engine." He tested this first.

| Area | What was done |
|---|---|
| Ads | AdMob banners and rewarded videos. iOS used Google Mobile Ads 13.9, Android 24.9 |
| Purchases | Consumable and non-consumable. Android used Play Billing 8, iOS used StoreKit. Tested in both store sandboxes and with production builds |
| Save data | Old saves and user IDs were read directly. On the first update, old saves were archived to the device, and a menu option "Restore old save" allowed recovery |
| Updates | Delivered as an update with the same bundle ID and package name. Verified on both platforms that updating from the store version and continuing from where it left off worked |
| Server | Used the existing API unchanged. Tested all endpoints against the production server |

The save archival proved invaluable. During early testing on Pixel 6, an old save was lost when overwritten without the archive. The developer recovered it from the archive.

### 5. Device operation was also automated

For Android (Pixel 6), adb was used to swap builds, tap, capture screenshots, collect logs, and send debug commands. For iOS (iPad Air 4), Appium (XCUITest and WebDriverAgent) was used to capture screens and tap. For Aichi, he even automated reinstalling the old version from [App Store](https://developer.apple.com/app-store/) and updating to the UE version via [TestFlight](https://developer.apple.com/testflight/) using Appium.

The developer only acted when human approval was required: confirming purchases (purchase sheet buttons, fingerprint), OS dialogs (tracking consent, location, "Trust this computer"), and verifying that ads actually appeared.

### 6. Coverage tracked with numbers

The most crucial reason he trusted the AI, he says, was seeing progress in numbers from automated testing. The engine was swapped, but Lua, maps, master data, and servers remained the same. The question was not "Is the game complete?" but "Does the runtime support every engine feature the game uses?"

- The boundary from Lua to the engine is C++-registered commands only: 402 in Mie, 477 in Aichi.
- He listed these commands in a ledger. During tests, the runtime counted which commands were actually called and compared against the ledger.
- Commands that were not called either had tests written for them or were marked with a reason: "Not called in production", "Only happens on device", and so on.

Running faster in larger numbers makes the blind spots harder to see. There were two: error logs were searched by string, but the old version logged errors in Japanese ("An error occurred in a coroutine"), which were not being caught. A macro registering commands was defined in two places, and counting was only in one. For the first, he switched to counting at a single point where all errors pass, and verified the fix by deliberately triggering errors. For the second, he merged the counting.

### 7. Debug commands for automated play, running 16x speed

Testing used debug commands added to the game. Two kinds: a scenario that starts a new user, sends dialogue, walks to a goal, completes combat to the ending (automated play), and single-feature tests of every skill, item, enemy party, and round (feature tests).

Early on, commands were entered from the console one at a time: 1 to 8 minutes per battle, and about 20 hours just for the scenario's second half. He sped it up in stages:

1. Move input logic from outside the engine to inside, running every frame.
2. Run at 60 fps even with the editor hidden in the background.
3. For fast-forward, instead of "taking larger time steps," "call the game update N times per frame" (behavior stays the same).
4. Run the test list inside the engine too.

He verified that speeding up did not change results by running the same test at 1x and 16x, comparing the order of field transitions and skills used. According to the developer, all three games had zero Lua errors from new user through ending, and from feature tests. A 16x-speed automated play video of all three games is embedded in the article (no editing, just playback speed).

### 8. Why the second and third ports were faster

From start to launch: Gifu took 16 days, Mie took 5 days, Aichi took 3 days. For the second and third, he copied the newest game's runtime and added only the differences. Renaming happened once in bulk. Changes to the old code were reapplied as patches from the log. Game-specific features (location in Aichi, screen compositing, arc drawing) were identified upfront.

He did not create a shared library. Making it common would require checking that changes to one game do not break another each time. With AI, keeping a per-game compatibility layer is low-cost, and fixes found in later games can be applied to future versions of earlier games.

## Issues and fixes

From the article's table, the problems and solutions are:

| Issue | Details and fix |
|---|---|
| CSD Visible attribute | The eye icon in the editor hid nodes in the runtime. Corrected in all three games |
| TArray with std::function | If five or more HTTP responses queued in one frame, array reallocation corrupted the std::function and crashed. Changed to std::vector |
| iOS 27 SDK and UIScene | Apps built with Xcode 27 crash on launch on iOS 27 if they do not support UIScene. The developer's device was iOS 26; this was discovered by App Review rejection |
| Ads SDK and SQLite | The engine's bundled SQLite shadowed the ads SDK's SQLite, crashing on iOS startup. Resolved with symbol management |
| UE iOS without ARC | Holding Objective-C autorelease objects over time caused crashes. Addressed by proper lifecycle management |
| Drawing to screen edge | Unlike the old version, the new one draws to the notch bottom, causing UI to overlap the camera hole and ads. Kept UI inside the Safe Area |
| Old bugs lying dormant | Animation index overflow from float rounding, etc. Fixed these alongside the new issues |

The "iOS 27 crash" was not reproducible on his devices and only appeared during review. Testing only on your own OS version can miss problems.

## After launch

The developer monitors daily: users, crashes, reviews, and feedback. At the article's date (October 1, 2026), the figures are (all from his reporting):

- Migration is underway. Auto-update on the store is gradually moving users to the UE version; in Gifu, the UE version now accounts for 8 to 9 out of 10 daily users. He confirms daily that new registrations are not spiking abnormally (no major data-loss-induced restarts).
- Crashes are minimal. [Google Play](https://play.google.com/console/about/) logs (through September 28) show Gifu's UE version had only 2 crashes in 2.0.0 (one each), and zero in later versions. Mie's UE version also shows zero.
- Some issues did arise. Aichi saw a crash on a specific old Android device at battle start, and one crash carried over from the old version. Both are under investigation.
- Post-launch fixes. In Aichi, a new iPhone user in character creation was blocked by an ad overlay. Fixed in 2.0.1.

Checking [App Store](https://developer.apple.com/app-store/) public data (as of October 5, 2026), current versions are Gifu 2.0.3, Mie 2.0.3, Aichi 2.0.1—consistent with his report. Review counts are Gifu 469, Mie 59, Aichi 68, but these are cumulative from the old version, not UE-only. UE performance and game feel have not been independently verified.

## AI and author roles

| Developer decided / did | AI agent did |
|---|---|
| Choosing Unreal Engine, switching to the non-rewrite approach | Investigating the old code, implementing the compatibility runtime |
| Fix criteria (fix and release; do not revert versions) | Building and running automated tests, managing the ledger |
| Device ops requiring human approval (purchase confirmation, OS dialogs, ad verification) | Device operation (adb, Appium), building, signing, uploading and submitting to stores |
| Decision to ship | Post-launch monitoring and reporting |

The article does not include full prompt text or the exact instructions given to the AI, so "what prompts were used" cannot be verified from public sources.

## Lessons from this case

The following are insights from this Wiki. They are separate from what the original article states.

- **Boundary first, rebuild later**: A rewrite proved intractable in two days. By shifting to building a compatibility layer, the remaining work became a finite problem: "how much of the runtime to build." The same boundary approach applies to other engine-end-of-life and store-requirement migrations.
- **Measure "working" in numbers**: With a ledger of called commands, a full Widget hit-test against CSD values, and 1x vs. 16x result matching, the AI could set its own pass/fail bar. Widening the automation scope becomes possible with clear success criteria. See [Verification loop](/en/agent-dev/verification-loop/) for more.
- **Question the measuring system itself**: As in the example where error logs were in Japanese and not being caught, the counting mechanism has blind spots. Deliberate failure testing is needed to find them.
- **Separate human-approval moments from AI-runnable ones**: Purchases, OS permissions, and ad viewing are human; everything else on the device (adb, Appium) is AI-runnable. This split is directly reusable in mobile game verification. See [Ads and in-app purchases](/en/monetization/ads-and-iap/).
- **Set exit criteria up front**: He decided "if ads and purchases do not work on both platforms, quit" and tested the riskiest part first.
- **Verify on new OS versions too**: Testing only on your own OS can miss failures. Real devices with newer OS versions will catch problems.
- **Understanding the cost**: This case paid by subscription quota, not per-API call. Token counts and exact spend were not published. Compare in [Cost management](/en/agent-dev/cost-management/).

## How to use AI

The following prompts are examples built from this case, for this Wiki:

- At the phase of choosing a migration strategy, have the AI estimate whether a rewrite or compatibility layer is realistic:

```text
I want to migrate this repository to a different game engine.
(1) Compare the rewrite approach (rebuild game logic) vs. the compatibility approach (run old code with a new engine adapter) by: listing and counting the actual APIs called, and estimating work for each.
(2) List every boundary where the old code exits to the outside world: rendering, audio, input, network, store SDKs.
```

- Have the AI build a ledger for verification:

```text
List every command exported from your script engine. Make a ledger.
During test runs, count which commands are actually called and cross-check against the ledger.
For commands not called, note "not called in production", "only on real device", or similar.
Verify your counting mechanism is not broken: deliberately trigger an error and re-count.
```

- Automate device testing: use adb for Android and Appium for iOS. Let the AI handle build swaps, taps, screenshots, and log collection. Reserve human approval for purchases, OS dialogs, and ad verification.
- For the second and later games, copy the newest game's compatibility layer and apply only the differences. Keep changes to the old code logged so they can be re-patched.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-05**: First version.
<!-- AUTO-UPDATE:END -->

## References

- [Cocos2d-x: How we ported three mobile games to Unreal Engine without rewriting (Zenn)](https://zenn.dev/kiarina/articles/2026-10-01-cocos2dx-to-unreal) — Author's original article (October 1, 2026). Source for this case (in Japanese)
- [Gifu Quest (App Store)](https://apps.apple.com/jp/app/id1545595606) — Public page
- [Mie Quest (App Store)](https://apps.apple.com/jp/app/id1567070156) — Public page
- [Aichi Quest (App Store)](https://apps.apple.com/jp/app/id1606958077) — Public page
- [Gifu Quest (Google Play)](https://play.google.com/store/apps/details?id=jp.blazeworks.gifuquest) — Public page
- [Mie Quest (Google Play)](https://play.google.com/store/apps/details?id=jp.blazeworks.miequest) — Public page
- [Aichi Quest (Google Play)](https://play.google.com/store/apps/details?id=jp.blazeworks.aichiquest) — Public page
- [Tokyo Canvas](https://tokyocanvas.blazeworks.jp/) — A separate Unreal Engine game the developer is working on. Linked in the article
