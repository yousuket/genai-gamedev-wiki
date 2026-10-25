---
title: Services for Publishing HTML/CSS/JavaScript Games Easily
description: Compare GitHub Pages, Cloudflare, Netlify, Vercel, Firebase Hosting, GitLab Pages, and Render by free tier and commercial use terms. Shows steps to deploy a Vite game to GitHub Pages and Cloudflare with configuration files.
sidebar:
  order: 2
lastUpdated: 2026-10-26
---

## Overview

This article compares services for making browser games built with [Vite](https://vite.dev/) playable by opening a URL.

- Compares [GitHub Pages](https://pages.github.com/), Cloudflare, [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/), [Firebase Hosting](https://firebase.google.com/products/hosting), [GitLab Pages](https://docs.gitlab.com/user/project/pages/), [Render](https://render.com/), and [itch.io](https://itch.io/) by free tier, custom domains, automatic deployment, and **restrictions on commercial use and advertising**.
- Shows steps to build with Vite and deploy to GitHub Pages and Cloudflare, with configuration files.
- Covers the `base` subpath, caching, large assets, `SharedArrayBuffer` headers, and how to request a coding agent for deployment.
- Briefly introduces the entry point for server-based games (multiplayer, leaderboards).

For an overview of hosting options, see [Where to run and publish your game](/en/publish/overview/). All figures are as of September 2026.

## Quick guide

- **For personal projects or prototypes with no commercial plans**: [GitHub Pages](https://pages.github.com/) or Cloudflare
- **If you plan to add ads or in-app purchases**: Cloudflare, [Netlify](https://www.netlify.com/), [Render](https://render.com/), Firebase, and others. **The free plans of GitHub Pages and [Vercel](https://vercel.com/) have usage restrictions** (see the section below).
- **For large amounts of traffic**: Cloudflare (requests for static assets are free and unlimited)
- **Publishing the same `dist` to [itch.io](/en/publish/itch-io/) as well**: Publish twice

## Comparison of major services

### Free tier and effort

| Service | Free tier (bandwidth, storage, builds) | Custom domain | Deployment method |
|---|---|---|---|
| [GitHub Pages](https://pages.github.com/) | 1 GB per site. 100 GB per month bandwidth (soft limit). 10 deployments per hour from branch (soft limit; GitHub Actions exempt). Free plan: public repositories only | Supported. HTTPS automatic | GitHub Actions |
| [Cloudflare Workers](https://workers.cloudflare.com/) (static assets) | Static asset requests free and unlimited. 20,000 files per site, 25 MiB per file. Git-linked builds (Workers Builds) 3,000 minutes per month | Supported. Certificate auto-issued. Domain must be on Cloudflare DNS | `wrangler deploy` or Git integration |
| [Cloudflare Pages](https://pages.cloudflare.com/) | 500 builds per month. 20,000 files per site, 25 MiB per file | Supported. 100 per project | Dashboard Git integration or `wrangler pages deploy` |
| [Netlify](https://www.netlify.com/) | 300 credits per month. 1 GB bandwidth = 20 credits, one production deploy = 15 credits. When exhausted, all sites stop | Supported with SSL | Git integration or CLI |
| [Vercel](https://vercel.com/) (Hobby) | 100 GB Fast Data Transfer per month. 100 deployments per day. Exceeding limits typically disables the feature for 30 days | 50 per project | Git integration or CLI |
| [Firebase Hosting](https://firebase.google.com/products/hosting) (Spark) | 10 GB storage, 10 GB per month bandwidth. 2 GB per file. Exceeding limits: site stops after grace period | Supported with SSL | CLI (`firebase deploy`) |
| [GitLab Pages](https://docs.gitlab.com/user/project/pages/) | 1 GB per site (CI artifact limit) | Supported. 150 maximum | `.gitlab-ci.yml` |
| [Render](https://render.com/) (static site) | Free deployments. Hobby tier includes 5 GB per month bandwidth, overage at 0.15 USD per GB | 2 per Hobby workspace. TLS automatic | Git integration |
| [itch.io](https://itch.io/) | Free. ZIP expands to 500 MB, 1,000 files, 200 MB per file | itch.io URL | ZIP upload |

Sources: [GitHub Pages Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), [GitHub Pages Creation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https), [Workers Static Assets Billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/), [Workers Limits](https://developers.cloudflare.com/workers/platform/limits/), [Workers Builds Pricing](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/), [Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [Pages Limits](https://developers.cloudflare.com/pages/platform/limits/), [Netlify Pricing](https://www.netlify.com/pricing/), [Netlify Credits](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/), [Vercel Hobby](https://vercel.com/docs/plans/hobby), [Firebase Hosting Quotas](https://firebase.google.com/docs/hosting/usage-quotas-pricing), [GitLab.com Limits](https://docs.gitlab.com/user/gitlab_com/), [GitLab Pages](https://docs.gitlab.com/user/project/pages/), [Render Pricing](https://render.com/pricing), [itch.io HTML5](https://itch.io/docs/creators/html5).

Netlify's free plan reaches about 15 GB per month bandwidth as a practical limit (300 credits divided by 20, excluding deploys, per author calculation). When credits run out, all sites stop and visitors see "Site not available" ([How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/)). If your game spreads, it can become unplayable that month.

### Commercial and advertising restrictions, and speed from Japan

| Service | Commercial and advertising | Speed from Japan |
|---|---|---|
| [GitHub Pages](https://pages.github.com/) | Main use for personal or organization project promotion. Not for non-profit operation, and not primarily for commercial transactions | No official mention of locations |
| Cloudflare | No "non-commercial only" clause in terms | Locations in Tokyo, Osaka, Fukuoka in Japan |
| [Netlify](https://www.netlify.com/) | No "non-commercial only" clause in terms or policy | Global CDN |
| [Vercel](https://vercel.com/) (Hobby) | **Non-commercial personal use only**. Accepting payments, selling products or services, and advertising (Google AdSense, etc.) are all considered commercial. Donation requests are not commercial | Regions: Tokyo and Osaka for computation |
| [Firebase Hosting](https://firebase.google.com/products/hosting) | No "non-commercial only" clause found | Global CDN |
| [GitLab Pages](https://docs.gitlab.com/user/project/pages/) | — | No official mention of locations |
| [Render](https://render.com/) | No "non-commercial only" clause found | Global CDN |
| [itch.io](https://itch.io/) | Can host commercial projects. No ads on the page. HTML5 games use donation format only | No official mention of locations |

Sources: [GitHub: Additional Products and Features](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features), [Cloudflare Terms](https://www.cloudflare.com/terms/), [Cloudflare Network](https://www.cloudflare.com/network/), [Netlify Terms of Use](https://www.netlify.com/legal/terms-of-use/), [Netlify Acceptable Use Policy](https://www.netlify.com/legal/acceptable-use-policy/), [Vercel Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines), [Vercel Regions](https://vercel.com/docs/regions), [Firebase Hosting](https://firebase.google.com/docs/hosting/usage-quotas-pricing), [Firebase Terms](https://firebase.google.com/terms), [Render Terms](https://render.com/terms), [itch.io FAQ](https://itch.io/docs/creators/faq).

- **If adding ads or in-app payments**: Vercel's free plan becomes commercial when ads appear, requiring a Pro plan (developer seat USD 20/month). GitHub Pages is also off-limits for sites whose main purpose is commercial. For ads or in-app purchases, use Cloudflare, Netlify, Render, Firebase where no non-commercial restriction is found.
- **Speed**: Static files are served from CDNs (servers cached around the world). Official documentation confirms locations in Japan only for Cloudflare and Vercel.

### Service status

- **Glitch**: Project hosting and user profiles ended on July 8, 2025 ([Glitch announcement](https://blog.glitch.com/post/changes-are-coming-to-glitch/)).
- **[CodeSandbox](https://codesandbox.io/)**: Joined Together AI, now focuses on an execution environment (SDK) for generative AI agents ([CodeSandbox](https://codesandbox.io/)). Not covered here as a game publishing destination.
- **Cloudflare Pages**: Currently available. However, the official documentation guides new projects to start with Workers ([Cloudflare Pages](https://developers.cloudflare.com/pages/)). In this article, the steps show Workers first, then Pages.

### Services for sharing code as-is

[StackBlitz](https://stackblitz.com/) is a browser-based editor where Node.js runs, and public projects can be shared by URL ([What is StackBlitz](https://developer.stackblitz.com/guides/user-guide/what-is-stackblitz)). Even on the free personal plan, public projects are unlimited ([Pricing](https://stackblitz.com/pricing)). The runtime runs fully on Chrome and is in beta for Safari and Firefox ([Browser support](https://developer.stackblitz.com/platform/webcontainers/browser-support)). [CodePen](https://codepen.io/) is another place to share code.

Both are suited for "showing work in progress to others." For publishing a game for people to play, use the static hosting above or [itch.io](/en/publish/itch-io/).

## Practice: Build with Vite and deploy to GitHub Pages and Cloudflare

The `vite.config.ts`, `wrangler.jsonc`, and `_headers` shown here were tested on a project made with `npm create vite@latest` (Vite 8.3.1, `vanilla-ts` template), confirming builds and local serving work.

### 1. Project and `base`

```bash
npm create vite@latest my-game -- --template vanilla-ts
cd my-game
npm install
npm run build   # creates dist/
```

The `base` (the part prepended to asset URLs) must change depending on the deployment URL.

| Deployment URL | Required `base` |
|---|---|
| `https://<username>.github.io/<repository>/` | `/<repository>/` |
| `https://<username>.github.io/`, a custom domain, or `*.workers.dev` | `/` |
| Not yet decided | `./` (relative path) |

Building with `base: /` and deploying to a subpath breaks both JavaScript and CSS (404), showing a blank screen (verified locally). Using environment variables allows the same config for both deployment targets.

```ts
// vite.config.ts
import { defineConfig } from 'vite';

// GitHub Actions passes BASE_PATH=/<repository>/ . Defaults to '/' if not set
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
});
```

When reading images or data from code, do not write absolute paths like `/data/level1.json`. Use `import.meta.env.BASE_URL`:

```ts
const res = await fetch(`${import.meta.env.BASE_URL}data/level1.json`);
```

### 2. GitHub Pages

1. Create a repository and push to `main` (Free plan requires public repository)
2. **Settings → Pages → Build and deployment → Source** select **GitHub Actions**
3. Place the following workflow in `.github/workflows/deploy.yml` and push

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    env:
      BASE_PATH: /${{ github.event.repository.name }}/
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: lts/*
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v5
```

This matches the official Vite workflow structure ([Deploying a Static Site](https://vite.dev/guide/static-deploy)). For a repository named `<username>.github.io` or with a custom domain configured, remove the `BASE_PATH` line and use `/`. From then on, every push to `main` deploys automatically.

### 3. Cloudflare (Workers static assets)

Place `wrangler.jsonc` in your project root:

```jsonc
{
  "name": "my-game",
  "compatibility_date": "2026-09-01",
  "assets": {
    "directory": "./dist"
  }
}
```

```bash
npm install -D wrangler
npm run build
npx wrangler deploy      # First run logs in via browser. Deploys to my-game.<subdomain>.workers.dev
```

`npx wrangler deploy --dry-run` confirms behavior without login (verified locally). For Git integration, go to Workers & Pages in the dashboard, select **Import a repository**, and connect your repository. The default deploy command is `npx wrangler deploy` ([Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)).

### 4. Cloudflare Pages

1. **Workers & Pages → Create a new Project → Pages → Git**, select your repository
2. Set build command to `npm run build` and output directory to `dist`
3. Deploys to `https://<project-name>.pages.dev/`

To deploy directly from CLI, create a project with `npx wrangler pages project create` and deploy with `npx wrangler pages deploy dist` ([Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)). The `base` can stay `/`.

### 5. Single-page app URLs

If you split your game screen by URL (`/settings`, `/level/3`, etc.), opening them directly returns 404.

| Service | Solution |
|---|---|
| [Cloudflare Workers](https://workers.cloudflare.com/) | Add `"not_found_handling": "single-page-application"` to `assets`. Returns `index.html` for nonexistent paths (verified locally: `/foo` goes from 404 to 200) |
| [Cloudflare Pages](https://pages.cloudflare.com/) | If `404.html` does not exist, treats as SPA |
| [Firebase Hosting](https://firebase.google.com/products/hosting) | In `firebase.json`, set `rewrites` to point `**` to `/index.html` |
| [GitHub Pages](https://pages.github.com/) | Shows `404.html` for nonexistent paths ([Custom 404 page](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)). Hash routing (using `#` in URLs) is simpler |

Sources: [Workers SPA](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/), [Pages Serving](https://developers.cloudflare.com/pages/configuration/serving-pages/), [Firebase Config](https://firebase.google.com/docs/hosting/full-config). Most single-screen games do not split URLs, so this setup is usually not needed.

### 6. Caching

Vite adds a hash to filenames at build time (`assets/index-CXOZm1xX.js`). When content changes, the filename changes, so files under `assets/` can be cached long-term. Only `index.html` should be checked every time.

Cloudflare and [Netlify](https://www.netlify.com/) use `public/_headers` (becomes `dist/_headers` after build):

```text
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

Cloudflare Workers returns `Cache-Control: public, max-age=0, must-revalidate` by default ([Workers Headers](https://developers.cloudflare.com/workers/static-assets/headers/)). The setting above works, verified with `wrangler dev`.

## Common pitfalls for games

### Large assets

| Hosting | Limit |
|---|---|
| [GitHub Pages](https://pages.github.com/) | 1 GB total per site |
| Cloudflare | 25 MiB per file, 20,000 files per site |
| [Firebase Hosting](https://firebase.google.com/products/hosting) | 2 GB per file, 10 GB storage |
| [itch.io](https://itch.io/) | 200 MB per file, 500 MB total, 1,000 files |

Compress music and large textures. Cloudflare cannot host files over 25 MiB, so split them or store elsewhere.

### Engines using `SharedArrayBuffer`

WebAssembly threading and Godot with threading enabled ([Godot docs](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)) use `SharedArrayBuffer`, which requires the page to be cross-origin isolated. Return these two headers ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy)).

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

With `require-corp`, external images and scripts only load if the source permits it. This affects ad SDKs and external fonts.

| Hosting | How to set headers |
|---|---|
| Cloudflare, [Netlify](https://www.netlify.com/) | Write in `public/_headers` (Cloudflare verified locally. [Netlify format](https://docs.netlify.com/manage/routing/headers/)) |
| [Firebase Hosting](https://firebase.google.com/products/hosting) | `headers` in `firebase.json` ([Config](https://firebase.google.com/docs/hosting/full-config)) |
| [Vercel](https://vercel.com/) | `headers` in `vercel.json` ([vercel.json](https://vercel.com/docs/project-configuration/vercel-json)) |
| [GitHub Pages](https://pages.github.com/) | Cannot set headers. GitHub is considering support, but timeline is undecided ([Discussion](https://github.com/orgs/community/discussions/13309)). A service worker workaround is known |

### Mobile audio

Browsers block audio playback until the user interacts. Place a "Tap to start" screen first, and call `AudioContext.resume()` in that interaction ([MDN: Autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)). On iOS, `AudioContext` pauses when the app goes to the background, so resume on touch when returning ([CrazyGames: Technical](https://docs.crazygames.com/requirements/technical/)).

## Requesting deployment from a coding agent

Do the steps that require authentication (`wrangler login`, GitHub settings) yourself. Ask the agent only for config files and local verification.

```text
Make this Vite + TypeScript project deployable to GitHub Pages.
- The deployment URL is https://<username>.github.io/<repository>/
- In vite.config.ts, read `base` from the BASE_PATH environment variable, defaulting to '/' if not set
- Create .github/workflows/deploy.yml to deploy to GitHub Pages on push to main: npm ci → npm run build → GitHub Pages
- Find absolute paths like '/assets/...' or fetch('/...') in the code and replace them with import.meta.env.BASE_URL
- When done, run BASE_PATH=/<repository>/ npm run build and verify that src and href in dist/index.html begin with /<repository>/. Report your findings
- I will handle git push and the repository settings. Provide setup steps as a bulleted list at the end
```

```text
Make this game deployable via Cloudflare Workers static assets.
- Create wrangler.jsonc with assets.directory set to ./dist
- In public/_headers, add the setting for /assets/* to have Cache-Control: public, max-age=31536000, immutable
- Verify that npx wrangler deploy --dry-run succeeds after npm run build
- Check if any files in dist exceed 25 MiB and list them if found
- I will handle wrangler login and the production deploy
```

## Entry point for server-based games

Multiplayer, leaderboards, and cloud saves need a separate server beyond static hosting. Here are representative free-tier options:

| Service | Free tier | Best for |
|---|---|---|
| [Cloudflare Workers](https://workers.cloudflare.com/) | 100,000 requests per day. 10 milliseconds CPU per execution ([Pricing](https://developers.cloudflare.com/workers/platform/pricing/)) | Leaderboard API |
| Cloudflare Durable Objects | Free plan: SQLite only. 100,000 requests per day, 5 GB storage. Incoming WebSocket messages count as 20 per 1 request ([Pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)) | Per-room multiplayer |
| Supabase (Free) | 2 projects, 500 MB database, 200 concurrent Realtime, 2 million messages per month. Inactive for one week pauses the project ([Pricing](https://supabase.com/pricing)) | Leaderboards, login, light sync |
| Firebase (Spark) | Realtime Database: 100 concurrent, 1 GB storage, 10 GB per month downloads. Firestore: 1 GiB storage, 50,000 reads and 20,000 writes per day ([Pricing](https://firebase.google.com/pricing), [Limits](https://firebase.google.com/docs/database/usage/limits)) | Save data, small-scale sync |

Free-tier concurrency is tight (Firebase 100, Supabase 200), matching your player count directly to the ceiling. Start with static hosting to gauge interest, then add server features as needed to keep costs down. For portal restrictions, see [Where to run and publish your game](/en/publish/overview/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-24**: swipla is a site for publishing small portrait-orientation mobile browser games, and it accepts AI-made games. You place a single portrait HTML file as `index.html`, log in with X, and post it; it is published without review (according to the article). Games run in a sandboxed iframe, so external images and audio cannot be used and assets must be embedded. Limits are 15 MB per file, 40 MB per game, and 200 MB and 50 games per user. There is also a draft-creation API for AI (10 per day, HTML up to 2 MB). No pricing is mentioned ([source: Zenn (in Japanese)](https://zenn.dev/penbool/articles/303b8de348df03))
- **2026-10-23**: Asobiai is a site where AI tools such as Claude, ChatGPT, Claude Code, Codex, and Gemini CLI connect over MCP (OAuth login) and publish browser games they made, right in the conversation. After publishing, you can ask the AI to upload a fixed version, and players can react with likes, comments, bug reports, and scores. You can also publish by pasting HTML or dropping a folder ([source: Zenn (in Japanese)](https://zenn.dev/asobiai/articles/78e70c7068141c))
- **2026-10-15**: A poster reports being unable to pull an HTML5 game listed on CrazyGames and considering an exclusive listing on Poki. They say they asked for removal, got no reply for three days, and there is no withdraw button. This is the poster's account only; CrazyGames' terms and response are unconfirmed. It is a reminder to check the withdrawal procedure and exclusivity terms before listing ([source: Reddit](https://www.reddit.com/r/gamedev/comments/1x6wnwu/crazygames_wont_let_me_pull_my_game_and_im/))
- **2026-10-15**: The operator of "Dead Simple," a swipe feed of tiny games, reports building a production CLI that agents can drive. Every command answers with `--json`, so an agent can scaffold, build, run contract tests, and prepare an upload without terminal interaction. A game is a single HTML file, and libraries such as Three.js load from the operator's mirror, so they do not count toward the 5 MB limit ([source: Reddit](https://www.reddit.com/r/aigamedev/comments/1x6xlx8/we_ship_our_tiny_phone_games_with_claude_code_and/))
- **2026-10-07**: Google released Playground, an experimental platform where you can make and share games just by describing them in text. It is open to users aged 18 and over in the United States. Games can be private, shared by link, or listed in a public gallery. Google also announced that a closed beta for integration with Unity Spark is coming ([Source](https://blog.google/innovation-and-ai/technology/ai/playground-experimental-gaming-platform/))
- **2026-10-02**: Report on deploying the same `Web/` folder to Cloudflare Pages via GitHub Actions and to CrazyGames via ZIP. CrazyGames serves from a subdirectory, breaking absolute path references, and requires a load progress indicator as a quality requirement ([Source](https://zenn.dev/acro_tomo/articles/toilettactics-02-static-web)) (in Japanese)
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Vite: Deploying a Static Site](https://vite.dev/guide/static-deploy) — GitHub Pages, GitLab Pages, Netlify, Vercel, Cloudflare, Firebase steps
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) — Storage, bandwidth, and build limits and prohibited uses
- [GitHub: Additional Products and Features](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features) — Pages usage terms
- [Cloudflare Workers: Static assets](https://developers.cloudflare.com/workers/static-assets/) — Static asset delivery and configuration
- [Netlify: Credit-based pricing plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) — Credit consumption
- [Vercel: Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines) — Commercial use definitions
- [Firebase Hosting: Usage, quotas, and pricing](https://firebase.google.com/docs/hosting/usage-quotas-pricing) — Free tier and suspension conditions
- [itch.io: HTML5 games](https://itch.io/docs/creators/html5) — ZIP requirements and limits
- [MDN: Cross-Origin-Embedder-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy) — Headers required for `SharedArrayBuffer`
