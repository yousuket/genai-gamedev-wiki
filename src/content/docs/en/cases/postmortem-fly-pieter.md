---
title: fly.pieter.com — Monetizing a Flight MMO Built with Cursor Using Ad Slots
description: Pieter Levels built a browser-based flight MMO with Cursor starting in February 2025. From the first one-shot generation in 3 hours, through multiplayer, bot mitigation, and ad slot sales, to hitting over 100 million yen in projected annual revenue by day 17—tracked in real time through the developer's posts.
sidebar:
  order: 10
lastUpdated: 2026-09-29
---

## Overview

fly.pieter.com is a browser-based flight game created by solo developer Pieter Levels (X: @levelsio) starting on February 22, 2025. With no prior game development experience, he asked Cursor to "make a 3D flying game in browser with skyscrapers." The game became playable in about 3 hours, and Levels live-streamed his subsequent development and launch on X in near real time. The game is free, with revenue from in-game ad slots (like "ad airships") and an F-16 aircraft purchase option ($29.99). By day 17, the reserved ad slots translated to $87,000 in monthly recurring revenue (projected $1 million annually). Levels later classified this project as "took off, made money but not sustainable."

| Item | Details |
|---|---|
| Developer | Pieter Levels (solo; stated he had no prior game development experience) |
| Launch date and location | Development began February 22, 2025, launched the same day. [fly.pieter.com](https://fly.pieter.com/) (browser, free) |
| Model | Claude inside Cursor (Levels mentioned "Sonnet 3.5" and "Claude 3.7 Sonnet"). Server code via Grok 3. |
| Tools / Agents | Cursor (AI-powered code editor), Three.js |
| Genre and scale | Free browser-based flight MMO. Started as a single HTML file; Levels reported Cursor became sluggish around 3,000 lines. |
| Development time | Playable in about 3 hours, multiplayer in about 8 hours. Reported revenue milestone by day 17. |
| Results (publicly announced) | Day 17: $87,000 MRR (projected $1M ARR), 320,000 cumulative players (Levels' post from March 11, 2025). Revenue figures after that have not been publicly disclosed, to my knowledge. |

## What Was Built

A flight game you can play immediately without waiting for Microsoft Flight Simulator to launch or update. Levels explained this motivation on his site. The initial prompt on February 22, 2025 was just one line:

```text
make a 3d flying game in browser with skyscrapers
```

The source is a post from Levels himself ([post](https://x.com/levelsio/status/1893350391158292550)). He describes iterating with "many questions and comments" until arriving at a flight simulator in plain HTML and JavaScript. Within the same day, these features were added:

- Shooting bullets and destroying buildings and ships
- Virtual joystick for smartphones (the community suggested nippleJS)
- Multiplayer by hour 8 (using PeerJS and WebRTC)

By February 25, he rebuilt the server to a shared world where all players fly together. He had Grok 3 write a Python WebSocket server that collects and broadcasts every player's position every 100 milliseconds ([post](https://x.com/levelsio/status/1894429987006288259)).

Later additions included dogfighting, health bars, minimap, leaderboard, chat, and multiple aircraft types (Cessna 172, F-16, A-10, anti-aircraft vehicle, UFO).

## How It Evolved from One-Shot Generation to Product

One-shot generation lasted only the first 3 hours. After that, it was nearly daily iterations: request one feature, play it, fix it. Levels' posts reveal his approach:

- **Shipped while building.** The game was public from day 1, and he incorporated player suggestions (WebRTC, nippleJS, FOV expansion tricks) continuously.
- **Changed which tool handled complex requests.** He switched server communication from Cursor to Grok 3. He assessed that PeerJS was fundamentally limited to P2P and decided to move to WebSocket himself.
- **Solved performance with expert advice.** When a Three.js contributor suggested changing runway lighting from PointLight to emissive materials—which could push some devices from 8 FPS to 60 FPS—he adopted it ([post](https://x.com/levelsio/status/1897728697253453865)).
- **Learned to distinguish what AI does well from what it struggles with.** The anti-aircraft vehicle came out on the first try with Cursor and Claude. The aerobatic flight model, by contrast, required "five attempts with Claude, each revision introducing a new issue," he wrote ([post](https://x.com/levelsio/status/1896308800895987743)).

## Where Differentiation Came From

Flight controls and graphics are generic AI outputs. The differentiation lay elsewhere.

- **Load-free, instantly playable free MMO.** Born from frustration with slow-launching flight games, the game lets anyone open a URL and fly in the same sky with everyone.
- **Monetizing through ad slots.** On February 26, he flew an ad plane for PHOTOAI (his own service) and added a Stripe button to sell F-16 for $29.99. Later, he sold ad airships, clouds, and other ad spaces to external companies.
- **Existing audience.** Levels already had a large following. The live development stream itself was marketing. He notes that his posts reached over 100 million impressions on X (citing someone's count).

## What Did Not Work

Issues that appeared in the record, in chronological order:

| Date (Feb 2025) | Issue | His response |
|---|---|---|
| Feb 23 | Game ballooned to ~3,000 lines in one file; each change took ~15 seconds to apply. Cursor's co-founder advised that large files were not the intended use case. | Posted for feedback ([post](https://x.com/levelsio/status/1893679316384244046)) |
| Feb 24 | Cursor left old functions in place and added a new function with the same name. JavaScript's last-definition-wins behavior meant no error occurred. Levels suspected Sonnet 3.5's context limit. | Shared the finding and theory publicly ([post](https://x.com/levelsio/status/1894052988655906896)) |
| Feb 28 | A bot appeared in the free multiplayer game, shooting down all players. | Added Cloudflare CAPTCHA, though he noted it might only work for a day ([post](https://x.com/levelsio/status/1895614492752703800)) |
| Mar 2 | A triangle-shaped UFO appeared, shooting other players. Levels believes a modified participant added it, not the original code. | Said he did not fully understand the mechanic but incorporated the code as a standard feature ([post](https://x.com/levelsio/status/1896213286737350769)) |
| Mar 2–3 | M3 MacBooks in low-power mode dropped FPS, slowing the entire game. | Decoupled physics updates from rendering FPS (Claude-generated code). |
| Mar 10 | Server logs grew to 16 GB, filling the disk and degrading performance. | Fixed log output ([post](https://x.com/levelsio/status/1899065515596722414)) |

Levels joked that he was experiencing all the free multiplayer game problems at once ([post](https://x.com/levelsio/status/1895608319127273954)).

## Results

All revenue figures come from Levels' X posts. The numbers primarily reflect monthly contract values for ad slots; actual deposits are not disclosed.

| Date (Feb/Mar 2025) | Reported figures |
|---|---|
| Feb 27 | 9 F-16 sales (~$270), 1 ad airship slot ($1,000). 89,000 cumulative players; peak concurrent 26,000 aircraft; 63% mobile. |
| Mar 2 (day 9 by his count) | 12 F-16 sales (~$360), 17 ad slots (projected $17,000/month) = $17,360/month. Raised slot price to $2,500/month. |
| Mar 3 (day 10) | 19 ad slots (projected $38,000/month) + F-16 = $38,360/month projected. That day's players: ~16,000. |
| Mar 6 (day 13) | Projected $67,000/month |
| Mar 10 | Peak single day: 31,000 players. Projected $72,000/month. Cumulative: 296,000 players. |
| Mar 11 (day 17) | Projected $87,000/month (projected $1M ARR). Cumulative: 320,000 players. 3 ad slots remaining. |

([Mar 2](https://x.com/levelsio/status/1896282625985102042), [Mar 3](https://x.com/levelsio/status/1896690611257844116), [Mar 6](https://x.com/levelsio/status/1897784027186446820), [Mar 10](https://x.com/levelsio/status/1899166414667178314), [Mar 11](https://x.com/levelsio/status/1899596115210891751), [Feb 27](https://x.com/levelsio/status/1895126942233350340) posts)

MRR stands for Monthly Recurring Revenue—the projected recurring monthly amount. Because ad slots were sold on monthly contracts, this figure assumes renewal. On Mar 3, ad slots accounted for roughly $38,000 of the $38,360 total; F-16 sales were ~$360, so ad slots drove most revenue.

Since then, Levels has classified fly.pieter.com on his project list as "Okay: took off, made money but not sustainable" ([List of all my projects ever](https://levels.io/projects), as of September 2026). The game is still playable as of September 29, 2026, with ad recruiting and F-16 sales ($29.99) still shown. A third-party article (from DEV Community's Promptway coverage) reports that Levels' X profile showed this venture at $0 monthly as of mid-2026. This is secondary information and not confirmed in this article.

## What to Learn

- **One-shot generation is the entry point, not the finish line.** Three hours made it playable, but value arrived when the next two weeks added the "fly in the same sky" multiplayer experience. For more on evolving from one-shot to product, see [From One-Shot Generation to Product](/en/agent-dev/from-one-shot-to-product/).
- **Large single files slow and destabilize AI editing.** At 3,000 lines, changes took 15 seconds and duplicate functions appeared. Splitting files for AI requests becomes essential early on.
- **Revenue came from audience and ad slots, not game sales.** The product was ad space in front of players. Ad slots, not in-app purchases (F-16), drove most revenue.
- **One-shot weaknesses show up as soon as it ships.** Network design, bots, mods, and disk-full logs only surface in live play. The speed of the public iteration cycle was what made this work.
- **Hype does not sustain.** Levels himself notes both that ad slots were monthly contracts and that the project "did not sustain."

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version created.
<!-- AUTO-UPDATE:END -->

## References

- [fly.pieter.com, my first vibecoded flight simulator which reached $1M ARR in 17 days](https://levels.io/fly-pieter-com-vibecoded-flight-simulator) — Author's retrospective with timeline of live development posts
- [Initial prompt post (February 22, 2025)](https://x.com/levelsio/status/1893350391158292550) — The one-line request to Cursor and path to launch (in Japanese)
- [Multiplayer complete post (February 25, 2025)](https://x.com/levelsio/status/1894429987006288259) — Python WebSocket server written by Grok 3 (in Japanese)
- [Day 17 revenue report (March 11, 2025)](https://x.com/levelsio/status/1899596115210891751) — $87,000/month, 320,000 cumulative players (in Japanese)
- [List of all my projects ever](https://levels.io/projects) — Author's classification of his projects by outcome
- [fly.pieter.com](https://fly.pieter.com/) — The game itself (credits Cursor and Three.js)
