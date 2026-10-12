---
title: "Web Games as Apps: PWA, Wrappers, and Engine Export"
description: Take a browser-based game to app stores through three approaches in order of effort (PWA, wrappers like Capacitor, and engine export). Learn registration, review, and testing requirements for App Store and Google Play from official sources.
sidebar:
  order: 4
lastUpdated: 2026-09-29
---

## Overview

This article outlines three paths to publish a browser game as an app, ordered by complexity.

- ①**PWA**: Add to home screen and open as an app. No app store required.
- ②**Wrapper**: Use [Capacitor](https://capacitorjs.com/) to wrap your web build in a WebView, create iOS and Android projects, and submit to stores. For desktop, use [Tauri](https://tauri.app/) or [Electron](https://www.electronjs.org/).
- ③**Engine export**: Export directly from Godot or Unity for each platform.

We explain:
- Registration fees, review timelines, required preparation, and beta testing ([TestFlight](https://developer.apple.com/testflight/) and Google Play closed tests) for [App Store](https://developer.apple.com/app-store/) and [Google Play](https://play.google.com/console/about/).
- How app stores treat WebView-only apps.
- Results from setting up a Capacitor project by hand.

Numbers and conditions are verified against official documentation (as of September 2026).

## Three Paths

| | ①PWA | ②Wrapper (Capacitor, etc.) | ③Engine export |
|---|---|---|---|
| What changes | Add manifest and icons | Wrap existing web build as is | Export from engine project |
| Distribution | Web (URL). Not in app stores | [App Store](https://developer.apple.com/app-store/), [Google Play](https://play.google.com/console/about/) | App Store, Google Play |
| Store costs | None | Developer account (see next section) | Developer account |
| Development environment | Browser only | iOS: Mac and Xcode; Android: Android Studio | iOS: Mac and Xcode; Android: SDK and JDK |
| Updates | Changes appear immediately on your site | Submit new build to store | Submit new build to store |

Start with ① in order of increasing effort; move to ② when you need stores. If you built with an engine, ③ is the direct path ([Game Engine Comparison](/en/dev-env/engines/)). See [Browser Game Technology Stack](/en/agent-dev/web-game-stack/) for how to build browser games.

## ①PWA: Add to Home Screen

A PWA (Progressive Web App) is a website with a manifest (JSON defining the app name and icons), installable on the home screen.

### Requirements

On Chromium-based browsers (Chrome, Edge, Samsung Internet), installation requires ([Making PWAs installable (MDN)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)):

- Manifest includes `name` (or `short_name`), `icons` (192px and 512px), `start_url`, and `display` (or `display_override`)
- `prefer_related_applications` is `false` or absent
- Served over HTTPS (during development, `localhost` and `127.0.0.1` are allowed)
- Every page links to the manifest in `<head>` via `<link rel="manifest">`

A service worker (for offline support) is not required for installation. Add it to your game if you want offline play.

```json
{
  "name": "Sample Game",
  "short_name": "Sample",
  "start_url": "./index.html",
  "display": "fullscreen",
  "icons": [
    { "src": "icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Setting `display` to `standalone` or `fullscreen` opens the app without browser chrome (MDN). This example was created for this article.

### Differences Between iOS and Android

| | Android (Chrome) | iOS / iPadOS (Safari) |
|---|---|---|
| Installation UI | Browser install prompt. On GMS devices and Samsung phones, Chrome and Samsung Internet install as WebAPK | Share menu → "Add to Home Screen". iOS 16.4+ allows adding from Chrome, Edge, Firefox, and Orion |
| Custom install button (`beforeinstallprompt`) | Available | Not available |
| Description and screenshots in install screen (manifest `description`, `screenshots`) | Displayed | Not displayed |
| Sites without manifest | Chrome can still add sites as apps without a manifest | iOS 26+ treats all sites as apps by default (users can turn off "Open as Web App") |
| Push notifications | — | iOS 16.4+: web apps added to home screen can ask for Web Push permission. Requests must respond to user action (e.g., button press) |

Sources: [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable), [Web Push for Web Apps on iOS and iPadOS (WebKit)](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/), [News from WWDC25 (WebKit)](https://webkit.org/blog/16993/news-from-wwdc25-web-technology-coming-this-fall-in-safari-26-beta/).

On iOS, specify the icon in the manifest's `icons` (iOS 15.4+) or `apple-touch-icon` in `<head>`. If both exist, `apple-touch-icon` takes precedence. Web Push for PWAs does not require [Apple Developer Program](https://developer.apple.com/programs/) membership (WebKit).

### Limitations of PWA

- Not listed in [App Store](https://developer.apple.com/app-store/) or [Google Play](https://play.google.com/console/about/). Users cannot discover you through store search.
- In-app purchases through store systems are not available. See [Monetization with Ads and In-App Purchases](/en/monetization/ads-and-iap/) for payment options.
- On Android, you can submit a PWA to Play using Chrome's Trusted Web Activity (opening a PWA from an Android app). Bubblewrap is a tool for this ([Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity/)). PWABuilder also packages PWAs for Google Play, Microsoft Store, Meta Quest Store, and iOS App Store.

## ②Wrapper: Package for App Store via WebView

A wrapper runs your browser game inside a WebView (embedded browser) within an app. Your web code stays the same; native features (notifications, etc.) are added via plugins.

### Capacitor

[Capacitor](https://capacitorjs.com/) adds iOS and Android projects to a web project. iOS uses WKWebView; Android uses Android System WebView ([iOS](https://capacitorjs.com/docs/ios), [Android](https://capacitorjs.com/docs/android)).

| Item | Details (Capacitor 8.5.2) |
|---|---|
| Node.js | 22 or later |
| iOS | macOS, Xcode 26.0+. Target iOS 15+. Dependency management: Swift Package Manager by default (CocoaPods also available) |
| Android | Android Studio 2025.2.1+, Android SDK (API 24+). Target Android 7+. JDK installed by Android Studio |
| Web setup | `package.json` present. Built web output (e.g., `dist`) contains `index.html`. `index.html` has a `<head>` |

Sources: [Environment Setup](https://capacitorjs.com/docs/getting-started/environment-setup), [Installing Capacitor](https://capacitorjs.com/docs/getting-started).

On our machine (Node.js 26, macOS), we ran these commands on a small [Vite](https://vite.dev/) sample. The `init` arguments replace interactive prompts with app name, app ID, and web build directory.

```bash
npm i @capacitor/core
npm i -D @capacitor/cli
npx cap init "Sample Game" com.example.samplegame --web-dir dist
npm i @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
npx cap sync
npx cap doctor
```

| Command | Our result |
|---|---|
| `npx cap init …` | Created `capacitor.config.json` (`appId`, `appName`, `webDir`) |
| `npx cap add android` / `npx cap add ios` | Created `android/` and `ios/` directories. Web build copied to `android/app/src/main/assets/public` and `ios/App/App/public`. Android: `targetSdkVersion = 36`, `minSdkVersion = 24`; iOS: minimum iOS 15.0 |
| `npx cap sync` | Completed |
| `npx cap doctor` | Reported no issues for iOS and Android |

Notes:
- On the first `npx cap add android`, the CLI halted in our environment after creating `android/` and did not return. After interrupting, we ran `npx cap telemetry off`, which allowed `sync` and `add ios` to complete. Capacitor's CLI automatically enrolls in telemetry; to disable it, run `npx cap telemetry off` ([Telemetry](https://capacitorjs.com/docs/cli/telemetry)).
- When you change your web code, rebuild it, then run `npx cap sync` to re-copy ([Capacitor Workflow](https://capacitorjs.com/docs/basics/workflow)).
- Android's generated `targetSdkVersion` of 36 matches Android 16 (API 36), required by [Google Play](https://play.google.com/console/about/) for new apps and updates as of August 31, 2026 ([Target API level requirements](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en)).

Debug run, open in Xcode/Android Studio, and release build commands are ([Workflow](https://capacitorjs.com/docs/basics/workflow), [cap build](https://capacitorjs.com/docs/cli/commands/build)):

```bash
npx cap run ios
npx cap run android
npx cap open ios
npx cap open android
npx cap build android --androidreleasetype AAB --keystorepath <keystore> --keystorealias <alias>
```

`cap build` creates signed AAB, APK, and IPA files. Pass the signing password via CI secrets, not command arguments.

The app ID (e.g., `com.example.samplegame`) becomes the iOS Bundle ID and Android Application ID. Once set in Google Play, the package name cannot be deleted or reused ([Create and set up your app](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en)). Choose carefully, using the reverse of a domain you own.

### For Desktop: Tauri and Electron

| | Tauri | Electron |
|---|---|---|
| How it works | Uses the OS's WebView. Minimal app is under 600KB | Bundles Chromium and Node.js |
| Prerequisites | Rust required | JavaScript only |
| Platforms | [Tauri](https://tauri.app/) v2 targets desktop and iOS/Android | Windows, macOS, Linux. Use [Electron](https://www.electronjs.org/) Forge with `electron-forge make` |

Sources: [Tauri](https://v2.tauri.app/start/), [Electron](https://www.electronjs.org/docs/latest/), [Packaging (Electron)](https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging). For desktop distribution, use [itch.io](https://itch.io/) downloads or [Steam](https://store.steampowered.com/) ([Publishing to itch.io](/en/publish/itch-io/), [Monetization Platforms](/en/monetization/platforms/)).

## ③Engine Export

Godot and Unity can export directly to Android and iOS.

- **Godot**: iOS export requires macOS with Xcode; [App Store](https://developer.apple.com/app-store/) Team ID and Bundle ID are mandatory. Android requires OpenJDK 17+ and Android SDK. C# projects are exportable as of Godot 4.2 but are experimental ([iOS](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_ios.html), [Android](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_android.html)).
- **Unity**: Build guides for [Android](https://docs.unity3d.com/6000.3/Documentation/Manual/android-BuildProcess.html) and [iOS](https://docs.unity3d.com/6000.3/Documentation/Manual/iphone-BuildProcess.html) are available.

See [Game Engine Comparison](/en/dev-env/engines/) for engine choice guidance. Registration and review procedures below apply to both ② and ③.

## Publishing to App Store and Google Play

Fee details are in [Monetization Platforms](/en/monetization/platforms/). Here is the preparation checklist.

### Accounts and Review

| | App Store (Apple) | Google Play |
|---|---|---|
| Registration fee | $99/year (local currency in some regions) | One-time $25 |
| Identity verification | Two-factor Apple account. Must be an adult. For individuals, your legal name appears as the seller | 18 or older. Government ID and credit card (legal name) may be required. Prepaid cards not accepted |
| Review time | 90% of submissions reviewed within 24 hours | Approved immediately after review. Some apps may take 7+ days |
| Beta testing | [TestFlight](https://developer.apple.com/testflight/) | Internal test, closed test, open test |
| Build requirements | Built with Xcode 26+ (as of April 28, 2026). Target iOS 13+ (as of September 9, 2026) | Target API 36+ (as of August 31, 2026; extended to November 1 with request) |

Sources: [What's included](https://developer.apple.com/programs/whats-included/), [Enrollment](https://developer.apple.com/support/enrollment/), [App Review](https://developer.apple.com/distribute/app-review/), [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/), [Play Console Sign Up](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en), [Create and set up your app](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en), [App Review](https://support.google.com/googleplay/android-developer/answer/9859751?hl=en), [Target API level](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en).

### Closed Testing for Personal Accounts on Google Play

**New personal developer accounts created after November 13, 2023 must run a closed test with at least 12 testers who continuously opt in for at least 14 days before releasing to production.** Once this condition is met, submit a production release request in Play Console ([App testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en), as of September 2026).

- The 14 days are consecutive. Users who opt out before 14 days do not count. If they opt out and return, a new 14-day period begins.
- In the request form, describe your testing (whether you found testers easily, how much of the feature set they tested, feedback received, and changes made).
- Review usually takes 7 days or less. If you have fewer than 12 testers or insufficient participation, you are asked to continue testing.
- Internal testing is optional and for quick feedback from a small group. Open testing is available after you receive production access.
- This requirement applies to personal accounts only.
- New personal accounts are also asked to verify Android device ownership via the Play Console mobile app ([Play Console Sign Up](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en)).

Find testers among friends, family, colleagues, or communities with shared interests. The official docs recommend providing a feedback channel and asking testers to stay opted in for the full 14 days.

### Preparation Checklist

| | App Store | Google Play |
|---|---|---|
| Icon | Include in app. Changes require a new version submission | For store: 512×512px, 32-bit PNG, under 1024KB |
| Screenshots | 1–10 images (JPEG or PNG, no alpha). iPhone: 6.9 inch (e.g., 1320×2868). Must show the app in use | Up to 8 per device type. Feature graphic (1024×500) is mandatory |
| Text | App name: 30 characters max | App name: 30 chars; short description: 80 chars; full description: 4,000 chars |
| Privacy | Privacy policy URL required (in metadata and in-app) | Data safety form answers and privacy policy required. Even apps that collect no data must answer |
| Age rating | Answer questions in [App Store](https://developer.apple.com/app-store/) Connect. Results: 4+, 9+, 13+, 16+, 18+ | Answer content rating questionnaire. Also set target age |
| Pre-submission | Verify functionality on device with the final build (2.1) | No crashes or major bugs. Review is not a troubleshooting service |

Sources: [Add an app icon](https://developer.apple.com/help/app-store-connect/manage-app-information/add-an-app-icon/), [Screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/), [Age ratings](https://developer.apple.com/help/app-store-connect/reference/age-ratings-values-and-definitions/), [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) (June 8, 2026 update), [Store listing assets](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en), [Data safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en), [Content ratings](https://support.google.com/googleplay/android-developer/answer/9859655?hl=en).

### TestFlight

TestFlight is Apple's beta distribution system. Upload your build to App Store Connect, assign it to groups, and distribute. Internal testers (up to 100) are App Store Connect users; external testers (up to 10,000) are anyone you invite. Builds sent to external testers may require beta app review. Builds expire after 90 days ([TestFlight Overview](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/)). Apple's guidelines require you to use TestFlight (not the App Store) for demos, betas, and trials, and prohibit distributing TestFlight builds in exchange for rewards (2.2).

### Distributing Android Outside Play

APK files distributed outside Play are subject to Android developer verification. As of September 30, 2026, this applies to installs from participating stores in Brazil, Indonesia, Singapore, and Thailand; it will expand globally in 2027+. Play automatically registers most apps (99%), with the remainder registered manually in Play Console ([Android developer verification](https://developer.android.com/developer-verification)).

## Guidelines for WebView-only Apps

### Apple

App Review Guideline 4.2 (Minimum Functionality) requires apps to offer "functionality, content, and UI beyond a repacked web page." Apps lacking utility, originality, or app-like qualities do not belong in the App Store; those without sufficient entertainment value or practical utility may be rejected. Specific feature requirements are not listed.

WebView apps themselves are not prohibited. Apps functioning as web browsers must use WebKit (2.5.6); [Capacitor](https://capacitorjs.com/) uses WKWebView. Guideline 4.2.6 rejects apps from templates or app generators unless the content provider submits their own content. Submitting your own game raises no issues.

Guideline 4.7 covers mini-apps and mini-games in HTML5 hosted inside an app without binary inclusion. It requires a game list, reporting mechanisms, and age restrictions. For a single game bundled in ②, guideline 4.2 is the focus, not 4.7 (author's interpretation).

### Google Play

[Google Play](https://play.google.com/console/about/) policy states:

- **"Webviews and Affiliate Spam"**: Prohibited are apps that display a website's WebView without the site owner's permission, or whose main purpose is directing affiliate traffic. Your own game does not qualify.
- **"Functionality, Content, and User Experience"**: Rejected are apps that crash, lack basic mobile utility, have no compelling content, or have limited features and sparse content.
- **"Device and Network Abuse"**: Apps must not modify themselves via means other than Play updates, or download executable code (dex, JAR, .so). This does not apply to code running in a virtual machine or interpreter, such as WebView or browser JavaScript.

Sources: [Spam](https://support.google.com/googleplay/android-developer/answer/9899034?hl=en), [Functionality, Content, and User Experience](https://support.google.com/googleplay/android-developer/answer/9898783?hl=en), [Device and Network Abuse](https://support.google.com/googleplay/android-developer/answer/9888379?hl=en).

### Making Apps Feel Native

Review criteria are not formally enumerated; these are suggestions for this article.

- Use device features (haptics, local notifications, device storage via Capacitor plugins).
- Bundle assets in the app so the full game is playable offline.
- Support screen orientation, notches, and safe areas.

## Web or App: When to Choose Each

| Factor | Web (itch.io, your site) | App |
|---|---|---|
| Where people play | Share a URL; instant play. No install needed | Store search, home screen icon. Install required |
| Notifications | Browser notifications. iOS web apps on home screen can use Web Push | Device notifications (requires plugins and per-platform setup) |
| Payments | Web payment. [itch.io](https://itch.io/) offers pay-what-you-want and download sales | In-app unlocks (Apple [App Store](https://developer.apple.com/app-store/) requires app purchases for digital goods; exceptions vary by region, Japan fees listed in [Monetization Platforms](/en/monetization/platforms/)) |
| Review and updates | No review. Changes deploy immediately | Resubmit every update. Xcode and target API requirements increase over time |
| Cost and setup | Free to start | Apple: $99/year; Google: $25. Icon, screenshots, privacy policy, age rating, tester recruitment |
| Policy | Platform rules (e.g., [Platform AI Policies](/en/legal/platform-policies/)) | App store review standards. WebView-centric apps subject to 4.2, etc. |

Guidelines:

- **Start on web**: Prototypes, game jam entries, gathering feedback. Publish on [itch.io](https://itch.io/) or your own site ([Publishing to itch.io](/en/publish/itch-io/), [Web Game Hosting](/en/publish/web-hosting/)).
- **Add PWA**: Already played in browser; want home screen access. Minimal effort.
- **Wrapper to stores**: Want to be found in stores, use notifications or payments. Budget time for registration and finding testers.
- **Design payments first**: Revenue model (ads, in-app purchases, buy once) determines distribution. See [Monetization with Ads and In-App Purchases](/en/monetization/ads-and-iap/).

## Delegating App Creation to Agents

You handle account registration, payment, signing keys, and store submission. Delegate project generation, builds, testing, and asset export to agents.

### Creating a Capacitor Project

```text
Turn this browser game (Vite, built to dist) into an iOS and Android app with Capacitor.
Please set up the groundwork and report results after each step.

1. Read the Capacitor official docs (capacitorjs.com/docs/getting-started) and verify
   the version and required environment (Node.js, Xcode, Android Studio)
2. Run npm i @capacitor/core and npm i -D @capacitor/cli
3. Run npx cap init "<app-name>" <app-id> --web-dir dist
   Use app ID com.<reverse-of-your-domain>.<game-name>. Ask me before deciding
4. Run npm i @capacitor/android @capacitor/ios, npx cap add android, npx cap add ios
5. If interactive prompts (like telemetry confirmation) pause the process, ask me
6. Run npm run build, npx cap sync, npx cap doctor
7. Verify android/variables.gradle has targetSdkVersion meeting Google Play requirements
   (API 36 as of August 31, 2026)
8. Ask me whether to add ios/ and android/ to Git

Do not: create store accounts, make payments, generate signing keys or keystores,
or upload to stores. I will handle those.
```

### Exporting Screenshots

This Playwright example exports an iPhone 6.9-inch store screenshot (1320×2868) for [App Store](https://developer.apple.com/app-store/). Logical size 440×956 multiplied by device pixel ratio 3 gives 1320×2868. This example was written for this article.

```js
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 440, height: 956 },
  deviceScaleFactor: 3,
});
await page.goto('http://127.0.0.1:4173/?seed=1');
await page.waitForFunction('window.__READY__ === true');
await page.screenshot({ path: 'store/ios-6.9-01.png' }); // 1320x2868
await browser.close();
```

```text
Export 5 App Store screenshots into store/.
- 1320x2868 PNG. No alpha channel
- Show gameplay (early stage, battle, results, settings, etc.), not title screen
- Wait for window.__READY__ on the game side before capturing
- Fix the random seed with ?seed= parameter
- After capture, verify dimensions and alpha absence, then report in a table
```

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Making PWAs installable (MDN)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) — PWA installation requirements and iOS/Android differences
- [Web Push for Web Apps on iOS and iPadOS (WebKit)](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) — iOS 16.4 home screen web apps and notifications
- [News from WWDC25 (WebKit)](https://webkit.org/blog/16993/news-from-wwdc25-web-technology-coming-this-fall-in-safari-26-beta/) — iOS 26 treats all sites as apps
- [Trusted Web Activity (Chrome for Developers)](https://developer.chrome.com/docs/android/trusted-web-activity/) — Opening a PWA from an Android app
- [Capacitor: Installing Capacitor](https://capacitorjs.com/docs/getting-started) — Project setup and sync workflow
- [Capacitor: Environment Setup](https://capacitorjs.com/docs/getting-started/environment-setup) — Node.js, Xcode, Android Studio requirements
- [Capacitor: cap build](https://capacitorjs.com/docs/cli/commands/build) — Signed build commands
- [Tauri](https://v2.tauri.app/start/) — System WebView framework
- [Electron](https://www.electronjs.org/docs/latest/) — Chromium and Node.js bundled
- [App Review Guidelines (Apple)](https://developer.apple.com/app-store/review/guidelines/) — Sections 4.2, 4.7, 2.2, 2.3, 3.1.1, 5.1.1
- [Apple Developer Program: What's included](https://developer.apple.com/programs/whats-included/) — Annual fee and commission
- [TestFlight Overview (Apple)](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/) — Tester limits and duration
- [Upcoming Requirements (Apple)](https://developer.apple.com/news/upcoming-requirements/) — Xcode 26+ builds
- [App testing requirements for new personal developer accounts (Google Play)](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en) — 12 tester, 14-day closed test
- [Target API level requirements (Google Play)](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en) — API 36 requirement
- [Android developer verification](https://developer.android.com/developer-verification) — Verification timeline
- [Exporting for iOS (Godot)](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_ios.html) — Godot iOS export
- [Exporting for Android (Godot)](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_android.html) — Godot Android export
- [Android Build Process (Unity)](https://docs.unity3d.com/6000.3/Documentation/Manual/android-BuildProcess.html) — Unity Android build
- [iOS Build Process (Unity)](https://docs.unity3d.com/6000.3/Documentation/Manual/iphone-BuildProcess.html) — Unity iOS build
