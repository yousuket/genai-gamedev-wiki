---
title: Publishing on itch.io
description: itch.io's HTML5 publishing steps, zip requirements and limits, pricing and revenue split, receiving payments from Japan, devlogs, jams, and the itch.io app, and how to grow your game after launch.
sidebar:
  order: 3
lastUpdated: 2026-09-29
---

## Overview

[itch.io](https://itch.io/) is a site for publishing and selling indie games made by individuals and small teams. Registration and publishing are free, and you do not need to wait for approval. It is one of the first places to consider for getting a browser game into the world as quickly as possible.

- HTML5 games can be published by uploading a single zip containing `index.html`. We have built zips locally and included the results of checking the structure.
- You set your own revenue split (10% by default). HTML5 games can only accept donations as-is, not direct sales.
- Using itch.io from Japan requires a U.S. tax interview. The details are in [Sales platforms](/en/monetization/platforms/), and we cover just the essentials here.
- After publishing, you can reach people through devlogs, tags, and jams, and move to [Steam](https://store.steampowered.com/) if the response is good.

All numbers have been confirmed in official documentation (as of September 2026).

## About itch.io

The official description calls it an open marketplace for independent creators, with a focus on indie games ([About itch.io](https://itch.io/docs/general/about)).

| Feature | Details |
|---|---|
| Cost | Free ([Creator FAQ](https://itch.io/docs/creators/faq)) |
| Approval | You do not need to collect votes, followers, or get approval to publish. However, appearing in search and listings ("indexing") has conditions (see below) |
| Price | All prices are "minimum price", which can be zero. Buyers can pay more than the minimum ([Pricing](https://itch.io/docs/creators/pricing)) |
| Page | You can design the color, font, and images yourself. No ads appear |
| Format | HTML5, Windows / macOS / Linux executables, assets, comics, soundtracks, and more |

As a place to host a browser game, the advantage is that you do not need to set up hosting yourself. For other options—hosting on your own server or custom domain—see [Web game hosting](/en/publish/web-hosting/).

## How to publish HTML5 games

### 1. Build with relative paths

For building and choosing a technology stack, see [Choosing a web game stack](/en/agent-dev/web-game-stack/). The first thing people stumble on with [itch.io](https://itch.io/) is how files are referenced ([HTML5 games](https://itch.io/docs/creators/html5)).

- Games are placed in a subdirectory of an HTML CDN. Absolute paths like `/assets/…` try to look outside the project and fail.
- The server is case-sensitive. If you wrote `Hello.png` on Mac or Windows, but referenced it as `hello.png`, you will get a 403 error after upload.
- Accessing a folder (a path ending in `/`) returns 403, not 404.
- External APIs and files are accessed over HTTPS.

With [Vite](https://vite.dev/), add `base: './'` to `vite.config.js`. If you build locally and compare, with the setting, `dist/index.html` refers to scripts as `./assets/index-…js`, and without it (the default) as `/assets/index-…js`.

```js
import { defineConfig } from 'vite';

export default defineConfig({ base: './' });
```

### 2. Put index.html directly in the zip root

`index.html` must be **directly in the zip root**. Zipping the `dist` folder as a whole, which creates a structure like `dist/index.html`, is a common mistake. This is confirmed from testing locally.

| How to zip | What is inside the zip | Result |
|---|---|---|
| `cd dist && zip -r ../game.zip .` | `index.html`, `assets/index-….js` | `index.html` is in the root |
| `zip -r game.zip dist` | `dist/index.html`, `dist/assets/…` | `index.html` is not in the root |

If your game is a single file, you can upload the `.html` file directly without zipping. In that case, you cannot refer to other files. For multiple files, use a zip. `.rar`, `.tar.gz`, and `.7z` are not supported ([HTML5 games](https://itch.io/docs/creators/html5)).

### 3. Check the limits

| Item | Limit (expanded) |
|---|---|
| Number of files | 1,000 |
| Total size | 500MB |
| Size per file | 200MB |
| Path length | 240 characters (case-sensitive, UTF-8) |

Source: [HTML5 games](https://itch.io/docs/creators/html5) (as of September 2026). The official documentation recommends using a downloadable version for very large HTML5 games, as they perform poorly on loading and performance. Size limits can be increased on request. New accounts also have separate limits on upload size, number of project pages (around 20), and number of files per page (10), which can be increased on request ([Getting started](https://itch.io/docs/creators/getting-started), [Creator FAQ](https://itch.io/docs/creators/faq)).

Here is a script that checks the conditions mechanically before uploading (an example written for this article). We tested it locally on three zips: the correct one, one made by zipping the `dist` folder, and one built with absolute paths—the latter two failed the checks.

```js
// tools/check-itch-zip.mjs — Usage: node tools/check-itch-zip.mjs game.zip
import { execFileSync } from 'node:child_process';

const zip = process.argv[2];
const list = execFileSync('unzip', ['-Z', zip], { encoding: 'utf8', maxBuffer: 1 << 26 })
  .split('\n')
  .map((l) => l.match(/^[-dl][-rwxsStT]{9}\s+\S+\s+\S+\s+(\d+)\s+\S+\s+\S+\s+\S+\s+\S+\s+(.+)$/))
  .filter(Boolean)
  .map((m) => ({ size: Number(m[1]), name: m[2] }))
  .filter((e) => !e.name.endsWith('/'));

const MB = 1024 * 1024;
const problems = [];
if (!list.some((e) => e.name === 'index.html')) problems.push('No index.html in the root');
if (list.length > 1000) problems.push(`Number of files: ${list.length} (limit 1,000)`);
if (list.reduce((s, e) => s + e.size, 0) > 500 * MB) problems.push('Expanded total exceeds 500MB');
for (const e of list) {
  if (e.size > 200 * MB) problems.push(`File exceeds 200MB: ${e.name}`);
  if (e.name.length > 240) problems.push(`Path exceeds 240 characters: ${e.name}`);
}
for (const e of list.filter((e) => e.name.endsWith('.html'))) {
  const html = execFileSync('unzip', ['-p', zip, e.name], { encoding: 'utf8' });
  const abs = [...html.matchAll(/(?:src|href)=["'](\/[^/"'][^"']*)["']/g)].map((m) => m[1]);
  if (abs.length) problems.push(`Absolute paths found in ${e.name}: ${abs.join(', ')}`);
}

console.log(problems.length ? problems.map((p) => `NG: ${p}`).join('\n') : `OK (${list.length} files)`);
process.exit(problems.length ? 1 : 0);
```

### 4. Create a page and upload

Start from "Create new game" on the dashboard ([Getting started](https://itch.io/docs/creators/getting-started)).

1. Enter a title, short description, and cover image. The cover image ratio is 315:250, with a minimum of 315×250 and larger sizes like 630×500 recommended. Three to five screenshots is typical.
2. Select **HTML Game** under "Kind of project" and upload the zip.
3. In the "Embed options" that appear, decide how to display it (see the next section).
4. Write a description, choose genres, and add tags (up to 10).
5. Click "Save & view page" to review. New pages are private by default.
6. Go to "Visibility & access" in the edit screen and set it to Public to publish.

## Embed settings

| Setting | What it does |
|---|---|
| Embed in page | Embed in the page at a width and height you set |
| Click to launch in fullscreen | Clicking "Launch game" fills the screen. You do not need to set size, but the game must be able to scale to screen size |
| Click to Play | On by default. For lightweight games you can turn it off, and the game starts when you open the page. Some browsers have no sound |
| Fullscreen Button | If your game has no fullscreen button, [itch.io](https://itch.io/) adds one automatically. In "Embed in page", it overlaps the bottom right |
| Scrollbars | Off by default. For games larger than the display area, allow scrolling |
| Mobile Friendly | Turn it on if you have confirmed the game works in a mobile browser |

Source: [HTML5 games](https://itch.io/docs/creators/html5).

- When you turn on "Mobile Friendly", opening the page on a mobile browser goes fullscreen regardless of the settings. Without it on, a warning appears saying the game may not work, but players can still play.
- The official documentation recommends making the canvas scale with the window size. With the fullscreen button, the display area changes to the viewer's screen size, and on mobile it becomes the device's portrait or landscape and resolution. If you embed at a fixed size, choose a value like 960×540.
- Assets compressed beforehand with gzip or Brotli can use `.gz` or `.br` extensions, and itch.io adds the right headers (Unity 2020's WebGL output uses this approach). Uncompressed `html`, `js`, `css`, `svg`, `wasm`, `wav`, `glb`, and `pck` are automatically gzipped by the CDN.

## Preparing for publication

You can ask an agent to handle building, zipping, checking, and screen capture, and you upload it yourself. This is a prompt example written for this article.

```text
Please prepare this game to publish as HTML5 on itch.io.

1. Check that vite.config base is './', or fix it if not
2. Run npm run build
3. Put the "contents" of dist into game.zip with index.html at the root
   (cd dist && zip -r ../game.zip . )
4. Run node tools/check-itch-zip.mjs game.zip and report if there are no errors
5. Start dist with vite preview and take screenshots at both 1280x720 and 390x844
   to confirm that the canvas fits on screen
6. Check the browser console and network for errors (case mismatches, absolute paths,
   http:// external reads)

I will handle the upload and publishing.
```

### Automating updates with butler

The official command-line tool **butler** lets you update without replacing the zip. `butler push` sends only the difference from the last build ([The butler manual](https://itch.io/docs/butler/)).

```bash
butler login
butler push dist your-name/your-game:html5
```

- `user/game` matches the page URL (lowercase). `:html5` is the channel name.
- To treat it as HTML5, after the first push, go to the edit screen, add "HTML5 / Playable in browser" to the channel, and change the page Kind from the default Downloadable to HTML ([Pushing builds](https://itch.io/docs/butler/pushing.html)).
- Use `--dry-run` to see the list of files to send.
- In CI, put the API key in the environment variable `BUTLER_API_KEY`. If the key appears in public logs, revoke it right away ([Logging in](https://itch.io/docs/butler/login.html)). Pass agents the CI secret name, not the key itself.
- If you do not use the command line, itch app (v26.12.0 and later) has a screen to send builds using butler.

## Setting prices

Choose one of three for the page price ([Pricing](https://itch.io/docs/creators/pricing)).

| Setting | Behavior | Best for |
|---|---|---|
| $0 or Donate | Suggest a donation amount. Clicking "Thanks, download" lets them proceed without paying | Release free and receive donations from interested players |
| Paid | Paying the minimum price or more makes them an owner. The price can change, but existing buyers stay owners | Sell for a price |
| No payments | Disable payments. All files download freely | Jam entries, fully free release |

People who pay become "owners" and get a download key. People who download without paying are not owners. If you are changing a free game to paid, watch for this difference.

**HTML5 games can only accept donations as-is.** The official documentation says all HTML5 games are set to donations only, and "one way to sell access is to make the 'Kind of Game' Downloadable" ([HTML5 games](https://itch.io/docs/creators/html5), as of September 2026). A practical approach is to have a free playable version in the browser and a paid download version in a separate file.

Individual files can have a minimum price (soundtracks or extra stages), sales, bundles, early access, and preorders. See [Pricing](/en/monetization/pricing/) for how to set prices.

## Revenue split and fees

[itch.io](https://itch.io/) uses "open revenue split". You **set the percentage itch.io takes yourself, anywhere from 0% to 100%**. The default is 10%, and you change it in your account settings under Seller settings ([Payments](https://itch.io/docs/creators/payments)).

Separately, PayPal and Stripe charge a payment processing fee of about "0.30 dollars + 2.9%" per transaction. We applied several prices to the official formula (split at the default 10%. The $10 row is the same as the official example).

| Price | itch.io share | Processing fee | Take-home | Percentage |
|---|---|---|---|---|
| 1 dollar | 0.10 dollars | 0.329 dollars | 0.571 dollars | About 57% |
| 2 dollars | 0.20 dollars | 0.358 dollars | 1.442 dollars | About 72% |
| 5 dollars | 0.50 dollars | 0.445 dollars | 4.055 dollars | About 81% |
| 10 dollars | 1.00 dollars | 0.590 dollars | 8.410 dollars | About 84% |

The fixed 0.30 dollars means lower prices have a lower take-home percentage. The official guidance is to sell for 2 dollars or more.

## Receiving payments and taxes

Choose one of two modes for receiving funds ([Payments](https://itch.io/docs/creators/payments)).

| | Direct to you | Collected by itch.io |
|---|---|---|
| Setup | Connect PayPal and Stripe yourself and provide tax info to each | Have a tax interview once, and agree to the seller terms |
| Deposits | Enter your payment provider's balance with each sale | Collected by [itch.io](https://itch.io/), then request a payout later (PayPal or Payoneer) |
| Seller | You | itch.io |
| Currency | You choose | Dollars |
| Chargebacks | You bear it | itch.io bears it |
| EU VAT | You collect and pay | itch.io collects and pays automatically |
| Group bundle | Not eligible | Can participate |

In collection mode, payouts require a balance of at least 5 dollars, a 7-day wait from the sale, and review (minimum 7 days, usually 10–14, and longer for first-timers). Up to 3 requests can be in progress at once, and batching monthly is recommended. If you do not withdraw for a year, a maintenance fee may be charged (as of September 2026).

Key points for use from Japan:

- Stripe direct payments work in the U.S., Canada, Ireland, and the UK, according to the official list—not Japan. From Japan, you can use direct PayPal receipt (it supports 6 currencies including yen; some regions need a business PayPal account) or collection mode.
- itch.io is a U.S. company. In collection mode, payments to sellers outside the U.S. are subject to withholding tax. If you do not provide a tax ID in the interview, it defaults to 30% even for countries with tax treaties. The rate that applies is shown on the settings page after the interview.
- The tax interview identity check incurs a one-time 3 dollar fee.
- Separate from U.S. withholding, you must file an income and resident tax return in Japan. The table and steps are in [Sales platforms](/en/monetization/platforms/) under "Tax procedures from Japan".

## Discoverability

### Getting indexed

Publishing does not automatically put your game in search and listings. Conditions apply ([Getting indexed](https://itch.io/docs/creators/getting-indexed)).

- Published as Public, and you have not chosen "disable new downloads and purchases" or "don't show in search and browse".
- You have a cover image.
- Buying, downloading, or playing in the browser is possible. Empty pages are not listed.
- New sellers uploading their first project go into a human review queue, which takes a few business days. During that time, the game is still playable from the direct URL.

Search is optimized for game titles; content text and tags are not search keywords. Tags are for listing pages. A title that is a single common word becomes hard to find. The official documentation notes that updating the publish date to appear higher in "New" is not possible, "New" adds hundreds of games a day and is low-impact as a place to launch, it says.

### Tags, devlogs, and AI disclosure

- **Tags**: Choose a genre and add up to 10 tags. The Metadata tab also has options for multiplayer, supported languages, and accessibility. Tag abuse is grounds for being delisted.
- **Devlog**: A development update posted to your project. It is distributed to users in email digests and other places, and is a way to grow followers. It can be indexed even before you have files, so you can use it to announce before launch. The page also shows links to recent posts ([Getting indexed](https://itch.io/docs/creators/getting-indexed), [Designing your page](https://itch.io/docs/creators/design)).
- **AI disclosure**: Do this in the "AI Disclosure" field in the edit screen. Details are in [Platform AI policies](/en/legal/platform-policies/).

### Engaging with buyers and followers

You can send an email to everyone who bought (once a day max; you cannot use it until your first sale). You can turn comments and a bulletin board on, and see a list of reviews and press contacts in the Interact tab ([Interacting with your fans](https://itch.io/docs/creators/interact)).

## Game jams

[itch.io](https://itch.io/) is also a place to host and join game jams. Anyone with a free account can run a jam. In ranked jams, you submit during the period and go through voting to get your ranking ([Hosting a game jam](https://itch.io/docs/creators/game-jams)). As a participant, you submit your browser game from the jam page. How to choose and join is in [Game jams](/en/publish/game-jams/), and upcoming events are in [Events calendar](/en/publish/events-calendar/).

## itch.io app

The [itch.io](https://itch.io/) app is a desktop application for Windows, macOS, and Linux. It installs, updates, and launches games. HTML5 games can also be downloaded and played on all platforms. It is a supplement to, not a replacement for, the website ([itch.io app FAQ](https://itch.io/docs/app/faq)).

For creators, it matters when you are distributing a downloadable version. The app finds and launches the executable; when multiple launch methods or API integration is needed, bundle an `app manifest`. If you want to distribute the browser version for desktop, see [Turning web games into apps](/en/publish/web-to-app/) for approaches like [Electron](https://www.electronjs.org/).

## After launch

1. **Make small updates**: Updates are a zip replacement or butler push. People who bought it get later files from the same page. If you attach a minimum price to an individual file that exceeds what a buyer paid, they cannot download that file. The page's minimum price sets the price ([Pricing](https://itch.io/docs/creators/pricing)).
2. **Write a devlog with each update**: Include what changed, with screenshots or short video. Video follows the style in [Short videos](/en/trailer/social-shorts/).
3. **Read feedback**: Turn comments or a bulletin board on, and fix the game based on player reactions. See [Playtesting](/en/design/playtesting/) for testing approaches.
4. **Bring people from your own channels**: The official docs explain that real people visiting the page and reacting raises it in listing rankings. Being followed and added to collections also boosts reach.
5. **Move to [Steam](https://store.steampowered.com/)**: If the response is good, move to Steam. The edit screen's Distribute tab has a feature to attach external keys (Steam keys, etc.) to purchases ([Getting started](https://itch.io/docs/creators/getting-started)). For Steam registration and review, see [Sales platforms](/en/monetization/platforms/). For wishlists, see [Wishlists](/en/monetization/wishlists/). To release on app stores, see [Turning web games into apps](/en/publish/web-to-app/).

The full picture of publishing venues is summed up in [Overview of publishing and events](/en/publish/overview/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: First version.
<!-- AUTO-UPDATE:END -->

## References

- [HTML5 games (itch.io)](https://itch.io/docs/creators/html5) — zip requirements, limits, embed settings, common mistakes
- [Accepting Payments and Getting Paid (itch.io)](https://itch.io/docs/creators/payments) — open revenue split, payment modes, payouts, taxes
- [Pricing (itch.io)](https://itch.io/docs/creators/pricing) — minimum price, donations, paid
- [Your first itch.io page (itch.io)](https://itch.io/docs/creators/getting-started) — creating and publishing a page
- [Getting indexed on Search & Browse (itch.io)](https://itch.io/docs/creators/getting-indexed) — indexing conditions, tags, devlogs
- [Creator FAQ (itch.io)](https://itch.io/docs/creators/faq) — costs, limits, download keys
- [Interacting with your fans (itch.io)](https://itch.io/docs/creators/interact) — email, comments, bulletin board
- [Hosting a game jam (itch.io)](https://itch.io/docs/creators/game-jams) — how jams work
- [itch.io app FAQ](https://itch.io/docs/app/faq) — desktop app
- [The butler manual](https://itch.io/docs/butler/) — butler setup, login, push
- [About itch.io](https://itch.io/docs/general/about) — service philosophy and open revenue split
