---
title: Patent Tycoon — A Patent Management Sim Built with ChatGPT, Codex, and Claude Code, Then Released Free on Steam
description: A non-programmer working in intellectual property created a 90,000-line patent management sim in 4 months using ChatGPT, Codex, Claude Code, and AI image and music tools, then released it free on Steam. This case study follows the development and post-launch statistics from the developer's own blog posts.
sidebar:
  order: 12
lastUpdated: 2026-09-29
---

## Overview

Patent Tycoon is a management simulation game created by "Torasute," a developer working in intellectual property. The game uses patents as weapons to grow a company through invention, patent filing, licensing negotiations, and litigation.
On September 1, 2025, the developer decided to "try making a game with ChatGPT" and began development, posting daily development logs to note (a Japanese blogging platform). The code reached about 90,000 lines, and the developer states: "The code is 100% written by generative AI. I have not edited it myself."
A demo was released on December 17, 2025, and the full version on April 17, 2026, both free on Steam. The developer published statistics including launch counts and playtime about 10 days after release.

| Item | Details |
|---|---|
| Developer | Torasute (solo developer. Works in intellectual property; writes Python and Java casually; nearly no Git experience, per the developer) |
| Release date and location | Demo on December 17, 2025; full version on April 17, 2026. [Steam](https://store.steampowered.com/app/4154200/Patent_Tycoon/) (free-to-play, Japanese and English) |
| Models | Not publicly disclosed (only service names). ChatGPT, Gemini, and Claude for consultation; Codex and Claude Code for coding |
| Tools and agents | ChatGPT (specification writing, Canvas), Codex (Web version), Claude Code (Web version; became primary tool midway), Midjourney and DALL-E 3 (backgrounds), Nano Banana (layout suggestions), Suno AI (background music) |
| Genre and scale | Turn-based patent-themed management sim with story and boss battles. TypeScript and React Electron app. About 90,000 lines |
| Development period | From September 1, 2025 onward. Demo submitted to Steam review on day 99; about 3.5 months to demo release, about 7.5 months to full version release |
| Results (publicly disclosed) | 10 days after release: 9,276 library adds, 221 launches, median playtime 14 minutes. Over 2,000 wishlist additions (December 2025). 7 Steam reviews (4 positive, as of September 2026). No revenue due to free release |

## What Was Created

The game's core is a management simulation set in three industries—pharmaceuticals, machinery, and software—where players advance research and development, file patents, negotiate licensing agreements, and pursue litigation to grow a company. The developer references Victoria 3 as inspiration for the management system, aiming for a simplified business model.

According to the store page description, the game features a story that deepens with each playthrough and boss battles unusual for management games. An AI guide character named "Aki" and a mysterious character called "Tiger-Cat" appear, with the player positioned as the "100th challenger."

Between the demo and full version updates, new features were added: employee recruitment gacha, company DNA inheritance mechanics, a score-attack mode, and randomized AI company personalities.

## Development Approach (From One-Shot Generation to Product)

The developer's note posts show how the approach evolved over time.

### 1. Started with ChatGPT chat only and hit a wall (days 1–5)

Initially, the developer wrote code in ChatGPT's chat interface, copying and pasting it to run. The specification was created using ChatGPT's Canvas feature, where "ChatGPT proposes agenda and writes drafts, the person approves or requests changes"—repeated until reaching about 15,000 characters (roughly 78 manuscript pages) in two days.

However, once the code reached about 1,000 lines across 18 files, copy-paste debugging could no longer converge.

### 2. Switched to a coding agent (day 6 onward)

On day 6, the developer began using Codex, and development speed changed dramatically according to the developer's account. The workflow was as follows:

1. Create a repository on GitHub
2. Give a prompt to Codex Web (later Claude Code Web), have it create a branch and pull request (about 5 minutes per request)
3. Locally in VS Code, check out that branch and test it
4. Merge if working, otherwise request revisions

The developer states that the only commands used were branch checkout and pull, plus running `npm run electron`. Without editing the code personally, the codebase reached 10,000 lines by day 16 and about 75,000 lines by day 100 (about 88,000 lines including comments).

The coding AI tool shifted to Claude Code as the primary tool midway through. The developer wrote that while Codex speaks minimally, Claude Code is easier to work with because it listens to suggestions and engages in dialogue.

The developer adopted a practice: for risky specifications, use Codex's "plan mode" (consultation without implementation) to align understanding before requesting implementation.

### 3. Delegated visuals and audio to AI as well

- Background illustrations: The main screen uses DALL-E 3, which can preserve logical structure (room layout), while Midjourney rendered characters in each room
- Layout: The developer took a screenshot of the current screen, sent it to Nano Banana for suggestions, then showed Claude Code the resulting image and requested "make the layout like this image"
- Background music: The developer showed Suno AI prompts to ChatGPT by showing it the visuals, generated about 30 songs, and selected the best ones

During development, the layout had to be completely redesigned to support different resolutions and scaling (1920×1080, 2560×1440, etc.) around days 36–41.

### 4. Spent significant time on launch preparation (around day 50 onward)

From around day 50, when development took shape, the focus shifted to marketing:

- Built an X account from scratch and tested automated note promotion posts
- On day 63, registered with Steamworks; on day 69, submitted the store page for review
- Around day 80, hired testers on Coconala (a Japanese freelance platform) to collect bug reports and tutorial improvement suggestions
- On day 99 (December 8, 2025), submitted the demo to Steam review

## Where Uniqueness Came From

- <strong>The subject matter is the developer's own work.</strong> A mundane topic—patents—becomes a management sim thanks to the developer's professional expertise. The store page emphasizes "wield patents as weapons."
- <strong>Borrowed the game format, added narrative.</strong> The management system references Victoria 3, the UI and music reference Persona 5, and the developer combined management simulation with episodic story and boss battles.
- <strong>World-building through character art.</strong> Each sub-screen places characters; the main screen shows everyone, creating visual cohesion across AI-generated art.
- <strong>Used the development log as marketing itself.</strong> Daily note posts (67 articles in a magazine format), later moved to X.

## What Did Not Go As Planned

- <strong>Development with ChatGPT chat alone.</strong> Hit a wall after a week; switching to a coding agent was the turning point.
- <strong>Misjudged the impact of X advertising.</strong> The store page gained about 1,800 wishlist additions in the first 3 days post-launch, but investigation showed most came from an article on the gaming media site Famitsu. Advertising was scaled back and stopped.
- <strong>Store page review was rejected twice.</strong> First, the English description of AI use was missing. Second (for the demo), image count and size mismatches in the store.
- <strong>Post-launch bug caused panic.</strong> After the demo launched, testing revealed background images did not appear when launched via Steam. After 30 minutes of fixes, the developer still could not resolve it and spent another 10 minutes finding how to unpublish. About 40 minutes elapsed from launch. Of about 190 people who added it to their library, roughly 70 left within 10 minutes. The developer's lesson: "Decide the procedure for handling post-launch bugs in advance."
- <strong>Early abandonment.</strong> Both demo and full version saw over 40% of players abandon within 10 minutes of first play. The developer has iteratively simplified tutorial text to be more accessible to those unfamiliar with patents.
- <strong>Overlap with major releases.</strong> The full version launched during a week with multiple major game releases, likely capturing less available leisure time, the developer notes.

## Results

After the full version released, the developer published the following statistics (blog posts on April 20 and April 28, 2026):

| Metric | Value |
|---|---|
| Players 3 days after launch | About 140 |
| Unlock rate for the final achievement (bonus episode) | 11.8% (3 days after launch) |
| Library additions (Lifetime free licenses) | 9,276 (10 days after launch) |
| Launch count (Lifetime unique users) | 221 (launch rate about 2.4%) |
| Average playtime | 1 hour 23 minutes |
| Median playtime | 14 minutes |
| Abandoned within 10 minutes | 43% |
| Played 10+ hours | 2% (1% played 20+ hours) |
| Store page visits per day | About 300 (external links about 100, discovery queue and new releases 30–40 each) |

Library additions are numbers that increase just from free games with an "Add to Library" button. Actual players correspond to the launch count of 221. The developer verified with AI that this launch rate is reasonable for free games.

As of September 29, 2026, Steam reviews total 7 (4 positive, 3 negative). No revenue due to free release. The developer's next project is a detective game, with a store page already published.

## Lessons Learned

- <strong>Copy-paste development in chat plateaus quickly.</strong> The developer's code reached about 1,000 lines across 18 files before convergence broke. Switching to a coding agent that could read the repository made development speed incomparable. See [AI Coding Tools](/en/dev-env/ai-coding-tools/) for tool options.
- <strong>Non-engineers can reach 90,000 lines with minimal Git skills.</strong> Used only branch checkout, test runs, and merge. However, decisions—what to build, which art to use, approvals and selections—were made by the developer.
- <strong>Pre-launch interest is measured by wishlists.</strong> In this case, game media articles outperformed X advertising. See [Wishlists](/en/monetization/wishlists/) for fundamentals.
- <strong>The first 10 minutes is the biggest hurdle even for free games.</strong> Over 40% of players quit within 10 minutes of first launch. Post-launch updates focused on tutorial improvements.
- <strong>Decide the launch and shutdown procedure in advance.</strong> The demo's background image bug caused roughly 70 of about 190 initial players to leave within the first 10 minutes. Plan ahead.
- <strong>Do not forget to disclose AI use in English.</strong> It was a cause of review rejection. See [Platform Policies](/en/legal/platform-policies/) for details.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version created.
<!-- AUTO-UPDATE:END -->

## References

- [Patent Tycoon (Steam)](https://store.steampowered.com/app/4154200/Patent_Tycoon/) — Store page. Development updates and reviews
- [What I learned making games for 50 days with generative AI & introduction](https://note.com/patent_tycoon/n/nb441c22ccbf0) (in Japanese) — Days 1–50: development approach (ChatGPT, Codex, image and music AI)
- [Generative AI game development day 100: Reflections & Steam review submission](https://note.com/patent_tycoon/n/n8bcfde2ca34c) (in Japanese) — Marketing, testing, store review
- [Generative AI game development: 4-month challenge complete!](https://note.com/patent_tycoon/n/nb3375d82dbaf) (in Japanese) — Demo launch, immediate post-launch bugs, AI tool inventory
- [Patent Tycoon released 4/17!](https://note.com/patent_tycoon/n/nbeadf7fcdc78) (in Japanese) — Full version launch situation
- [Patent Tycoon: Steam statistics 10 days after release](https://note.com/patent_tycoon/n/n4ca0291701c4) (in Japanese) — Launch counts, playtime, visit statistics
- [AI Dev Tips: Solo development × AI for keeping design and code fresh](https://note.com/patent_tycoon/n/ndbf3a3cf8f6c) (in Japanese) — By the same developer: managing specification files and automated checks (Claude Code)
