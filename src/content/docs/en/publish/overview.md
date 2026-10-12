---
title: "Where to Host and Publish: Choosing a Platform"
description: Compares self-hosted sites, itch.io, browser portals, PWA, Google Play, App Store, and Steam by effort, cost, review, how games are played, monetization, and which games suit each. Shows a gradual path to release.
sidebar:
  order: 1
lastUpdated: 2026-10-05
---

## Overview

This article helps you decide where to host and publish a browser game you have made.

- It divides publishing platforms into eight categories: "self-hosted", "[itch.io](https://itch.io/)", "browser portals", "PWA", "Android", "iOS", "[Steam](https://store.steampowered.com/)", and "consoles". It compares them by effort, cost, review process, how players discover and play games, monetization, and which games suit each.
- The quickest path is "publish on the web first, watch the response, then move to the next platform if needed". This article shows how to advance through the stages and the decision flow.
- Before choosing a platform, check six technical points: multiplayer servers, screen orientation, save data, audio autoplay, performance, and input methods. Also check the generation AI policy for each platform.
- Costs are covered in detail in [Sales platforms](/en/monetization/platforms/), and the steps to turn a web game into an app are in [Web to app](/en/publish/web-to-app/). This article focuses on how to choose.

## Compare eight publishing platforms

Information is current as of September 2026. The sources are shown in the next section.

### Effort, cost, and review

| Platform | Effort | Cost | Review |
|---|---|---|---|
| ① Self-hosted (static hosting) | Small. Build and upload. | Free tier available | None |
| ② [itch.io](https://itch.io/) | Small. Upload a ZIP file | Free | Usually none |
| ③ Browser portals ([Poki](https://poki.com/), [CrazyGames](https://www.crazygames.com/), etc.) | Medium. Embed SDK and pass review | Free | Yes, selective |
| ④ PWA | Small to medium. Add a manifest | Free | None |
| ⑤ Android | Medium to large | [Google Play](https://play.google.com/console/about/) is $25 once | Google Play: yes |
| ⑥ iOS | Large | $99 per year | Yes |
| ⑦ [Steam](https://store.steampowered.com/) | Large | $100 per title | Yes |
| ⑧ Consoles | Maximum | Significant hardware and review burden | Yes |

### How games are played, monetization, and which games suit each

| Platform | How games are played | Monetization | Games that suit this |
|---|---|---|---|
| ① Self-hosted | Open the URL and play. You handle discovery. | Implement yourself. Your hosting's terms apply. | Anything. Good for your first release. |
| ② [itch.io](https://itch.io/) | Indie fans gather here. Many game jams. | HTML5 uses a tip model. To sell, use downloadable builds. | Prototypes, jam entries |
| ③ Browser portals | Players who visit the portal | Ad revenue sharing | Light games that play in short sessions |
| ④ PWA | Launch from a home screen icon | Same as ① | Casual games meant to be replayed on mobile |
| ⑤ Android | Searchable in the store | In-app purchases, ads | Games centered on mobile |
| ⑥ iOS | Searchable in the store | In-app purchases, ads | Games centered on mobile |
| ⑦ [Steam](https://store.steampowered.com/) | PC gamers | Sales | Games to play at length on PC |
| ⑧ Consoles | Game consoles | Sales | A step after you have built a track record |

## Each platform in detail

### ① Self-hosted

Upload your built `dist` to a static hosting service such as [GitHub Pages](https://pages.github.com/), Cloudflare, or [Netlify](https://www.netlify.com/). The steps and free tiers for each are summarized in [Services to easily publish a web game](/en/publish/web-hosting/). The strength of self-hosting is that there is no review, and players can start playing the moment you send a link.

### ② itch.io

It is free, and commercial projects are allowed ([FAQ](https://itch.io/docs/creators/faq), as of September 2026). To upload an HTML5 game, put `index.html` in a ZIP file and upload it. After extraction, the limit is 1,000 files, 500 MB total, and 200 MB per file ([HTML5 guide](https://itch.io/docs/creators/html5)).

For HTML5 games, payments from players are tip-based only. To let players buy the game, use the "Downloadable" type (see above). For more, see [Publishing on itch.io](/en/publish/itch-io/).

### ③ Browser game portals

A portal gathers games from other developers, shows ads, and shares revenue with developers.

| Portal | From submission to launch | Revenue | Exclusivity |
|---|---|---|---|
| [Poki](https://poki.com/) | Upload a working web build, pass content review and playtesting. Final review takes 1-2 weeks; publishing work after approval takes 2-3 months | 50/50 share for Poki traffic, 100% for your own traffic | Exclusive on the web. [Steam](https://store.steampowered.com/) and app stores are free to use. |
| [CrazyGames](https://www.crazygames.com/) | First, pass "Basic Launch" (7-21 days of trial public release). If you meet the standard, embed the SDK for "Full Launch" | Full Launch receives ad revenue sharing. Payout at $100 EUR or more per month | No exclusivity. Selling on [itch.io](https://itch.io/) or Steam does not affect revenue share. |

Sources: [Working with Poki](https://developers.poki.com/guide/working-with-poki), [Adding your game](https://developers.poki.com/guide/adding-your-game), [Final review](https://developers.poki.com/guide/final-review), [CrazyGames Documentation](https://docs.crazygames.com/), [CrazyGames FAQ](https://docs.crazygames.com/faq/).

Some portals act less as revenue-sharing platforms and more as places to get visibility.

- **[Newgrounds](https://www.newgrounds.com/)**: You can upload HTML5 ZIPs with a free account ([walkthrough from GDevelop](https://gdevelop.io/page/how-to-publish-your-game-on-newgrounds-and-why-you-should-do-it)). Upload rules are in [Game Guidelines](https://www.newgrounds.com/wiki/help-information/terms-of-use/game-guidelines), and the AI policy is covered later in this article.
- **[Game Jolt](https://gamejolt.com/)**: Create a game page and upload a browser build (HTML, etc.) in the package. There is also a game jam feature ([Add your game](https://gamejolt.com/help-docs/creators/add-game)).

Poki says you can submit a prototype ([Adding your game](https://developers.poki.com/guide/adding-your-game)). You do not need a finished game.

### ④ PWA

A PWA (Progressive Web App) is a way to let users add a website to their home screen like an app. In Chromium-based browsers, if you write a name, 192px and 512px icons, `start_url`, and `display` in the manifest, it can be installed. On iOS 16.4 and later, Safari, Chrome, Edge, and Firefox all let users add to home screen from the share menu. A service worker is not required for installation ([MDN: Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)).

Safari clears localStorage and IndexedDB for sites a user has not touched in seven days. Web apps added to the home screen are exempt from this ([WebKit: Tracking Prevention](https://webkit.org/tracking-prevention/)). For games with save data on the device, this is an advantage of going PWA.

### ⑤ Android

- **[Google Play](https://play.google.com/console/about/)**: Registration is $25 once. Personal accounts created after November 13, 2023, must have at least 12 testers run a closed test for 14 days (see [Sales platforms](/en/monetization/platforms/) for detail).
- **Wrapping a web game**: Trusted Web Activity is a way to open a PWA from an Android app in fullscreen. Digital Asset Links confirms the app and website have the same owner, and Chrome 72 or later is required. You can make a project with Bubblewrap, a CLI tool ([Chrome for Developers](https://developer.chrome.com/docs/android/trusted-web-activity/overview)). If you need native features, there is [Capacitor](https://capacitorjs.com/) ([Capacitor](https://capacitorjs.com/docs)).
- **Direct distribution**: You can still distribute APKs from your own site (sideloading). Google is rolling out developer verification: as of September 30, 2026, in Brazil, Indonesia, Singapore, and Thailand; from 2027, on all certified Android devices. Installs outside approved stores will be affected. For sharing among friends, there is a "limited release account" that does not require ID or fees and works on up to 20 devices ([Android Developer Verification](https://developer.android.com/developer-verification/guides)).

### ⑥ iOS

- Individual enrollment is $99 per year, and your seller name on the store is your real name. You do not need to enroll to install on your own device with Xcode ([Apple: Enrollment](https://developer.apple.com/support/enrollment/)).
- [TestFlight](https://developer.apple.com/testflight/) lets you invite up to 10,000 external testers, and builds are valid for 90 days. The first build sent to a group must pass App Review ([TestFlight Overview](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/)).
- Guideline 4.2 requires apps to have "features, content, and UI that go beyond a repackaged website". Apps that simply wrap a website may not pass review ([App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)).

### ⑦ Steam

Registration is $100 per title, and you must have a "Coming Soon" page live for at least two weeks. Apps whose main model is ad revenue cannot be listed (see [Sales platforms](/en/monetization/platforms/) for more). Browser games are packaged as desktop apps using tools like [Electron](https://www.electronjs.org/) or [Tauri](https://tauri.app/). Electron bundles Chromium and Node.js to run on Windows, macOS, and Linux ([Electron](https://www.electronjs.org/docs/latest/)). Tauri uses the OS's WebView, so the smallest app is under 600 KB ([Tauri](https://v2.tauri.app/start/)). For Steam prep, also see [How to gather wishlists](/en/monetization/wishlists/).

### ⑧ Consoles

You can enroll in the Nintendo Developer Portal as an individual, but you need a separate application after enrollment to see Switch development information ([Nintendo Developer Portal](https://developer.nintendo.com/)). This is a step to consider after you have built a track record on the web and PC.

## Move through stages

Do not jump straight to the store. Move through stages from least effort to most.

| Stage | What to do | What you learn |
|---|---|---|
| 1 | Put it on your own URL and send it to people you know | Does it work? Can it be played on mobile? |
| 2 | Put it on [itch.io](https://itch.io/) and enter game jams | Do strangers play it? Do you get feedback? |
| 3 | Submit to a portal or make it a PWA | What is the ad revenue outlook? Does it get replayed? |
| 4 | Put it on an app store or [Steam](https://store.steampowered.com/) | Can you charge players? |

Effort and cost rise with each stage. If the response is weak in one stage, fix the game instead of moving to the next. Contests and game jams are a chance to finish stages 1-2 with a deadline. A deadline makes it easier to reach release. For how to find them, see [How to find game jams](/en/publish/game-jams/) and [Events calendar](/en/publish/events-calendar/).

## Decision flow

Work through the following in order. Pick the first one that fits.

1. **I want someone to play it first** → ① or ②. Start by having one URL ready to send.
2. **I want to charge money** → Browser alone is not ideal. PC: [Steam](https://store.steampowered.com/), mobile: app stores, small test sales: [itch.io](https://itch.io/) downloadable.
3. **I want to earn from ads** → ③ portals. Steam does not accept the ad model. ① free tier may prohibit ads ([Services to easily publish a web game](/en/publish/web-hosting/))
4. **I want to launch from a home screen icon** → ④. If you need store visibility, go to ⑤⑥.
5. **I want it as a PC game on a shelf** → ⑦. Start by gathering wishlists.

For ad and in-app purchase design, see [Ads and in-app purchases](/en/monetization/ads-and-iap/) and [Pricing](/en/monetization/pricing/).

## Technical points to check before choosing a platform

The same game may not work on all platforms. Early in design, check these six points.

| Point | What happens | Per-platform notes |
|---|---|---|
| Multiplayer server | Static hosting has no server; real-time communication does not work | Connect to external APIs or WebSocket over HTTPS. [itch.io](https://itch.io/) requires HTTPS ([HTML5 guide](https://itch.io/docs/creators/html5)). For server choices, see [Services to easily publish a web game](/en/publish/web-hosting/) |
| Vertical screen / screen size | Portrait mobile gets broken layouts | [Poki](https://poki.com/) requires it to work on desktop, mobile, and tablet, and to fill the screen vertically or horizontally on mobile ([Requirements](https://developers.poki.com/guide/requirements-quality)). [CrazyGames](https://www.crazygames.com/) lets you choose orientation at submission ([Technical](https://docs.crazygames.com/requirements/technical/)) |
| Save data | Varies by browser and device. Safari may clear it after 7 days | PWA does not clear it. CrazyGames Full Launch includes SDK-based save storage |
| Audio autoplay | Audio does not play until the user touches | AudioContext should `resume()` after user input ([MDN: Autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)). iOS pauses audio in the background; restart with touch (CrazyGames Technical). Poki requires you to mute audio during ads |
| Performance, capacity | Long loading causes users to leave | Poki says loading over 10 seconds increases drops. CrazyGames limits: first download 50 MB max, total 250 MB max, 1,500 files max |
| Input | Keyboard alone does not work on mobile | CrazyGames requires mouse, keyboard, and (if mobile) touch. Poki switches to mobile input on tablets |

## Generation AI policy differs by platform

Attitudes toward AI-made games vary by platform (as of September 2026).

| Platform | Policy |
|---|---|
| [itch.io](https://itch.io/) | Projects that include AI-generated assets must disclose them in the "AI Disclosure" section. Failure to disclose can result in removal ([Quality guidelines](https://itch.io/docs/creators/quality-guidelines)) |
| [Poki](https://poki.com/) | AI as a tool is permitted. The more you rely on generic AI assets, the more likely you are to be rejected after testing ([Content & player safety](https://developers.poki.com/guide/content-player-safety)) |
| [Newgrounds](https://www.newgrounds.com/) | Games made by prompting an AI are not to be shared. If you use AI, disclose it in the author comment ([Game Guidelines](https://www.newgrounds.com/wiki/help-information/terms-of-use/game-guidelines)) |
| [Steam](https://store.steampowered.com/) | Disclosure is required. See [Platform AI policies](/en/legal/platform-policies/) |

If you release an agent-made game, plan how much human effort went into it to meet each platform's rules.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-02**: Extortion emails arrived at multiple developers around September 29, saying "Pay $200 within 24 hours or we will release a clone on Steam first". The text is a template with only the game name changed; no reports of victims who paid ([source](https://automaton-media.com/articles/newsjp/20261002-471454/) (in Japanese))
- **2026-09-29**: First version.
<!-- AUTO-UPDATE:END -->

## References

- [itch.io: HTML5 games](https://itch.io/docs/creators/html5) — Upload requirements and payment model for HTML5
- [itch.io: Quality guidelines](https://itch.io/docs/creators/quality-guidelines) — AI disclosure
- [Poki for Developers](https://developers.poki.com/guide/working-with-poki) — Revenue sharing, exclusivity, submission process
- [CrazyGames Documentation](https://docs.crazygames.com/) — Basic Launch and Full Launch, technical requirements
- [Game Jolt: Add your game](https://gamejolt.com/help-docs/creators/add-game) — Game page creation and build upload
- [Newgrounds: Game Guidelines](https://www.newgrounds.com/wiki/help-information/terms-of-use/game-guidelines) — Upload rules and AI policy
- [MDN: Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) — Installation conditions
- [WebKit: Tracking Prevention](https://webkit.org/tracking-prevention/) — Safari 7-day storage limit and home-screen web app exception
- [Chrome for Developers: Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity/overview) — Mechanism for releasing a PWA as an Android app
- [Android Developer Verification](https://developer.android.com/developer-verification/guides) — Developer verification timeline and limited release account
- [Apple: TestFlight Overview](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/) — Tester limit and build validity
- [Apple: App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) — Guideline 4.2 minimum functionality
- [Capacitor](https://capacitorjs.com/docs) — Wrapping web apps for iOS and Android
- [Electron](https://www.electronjs.org/docs/latest/) / [Tauri](https://v2.tauri.app/start/) — Packaging web games as desktop apps
