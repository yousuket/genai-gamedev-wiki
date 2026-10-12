---
title: How to Use AI Video Generation
description: A guide to using video generation AI, music generation AI, and voice synthesis for trailer production, with notes on avoiding misleading viewers when video differs from actual gameplay.
sidebar:
  order: 3
lastUpdated: 2026-09-29
---

## Overview

AI video generation can produce short clips in minutes. However, game trailers convey "what you can actually play." Misusing AI-generated footage can lead to buyer confusion or platform policy violations.

This article covers:

- The current state of video generation AI, music generation AI, and voice synthesis (as of September 2026)
- Appropriate and inappropriate uses in trailer production
- Points to verify in store and social media rules

## Core Principle: Show the Game Itself

Each platform requires store materials to match the actual game.

- **Steam**: The Steam Distribution Agreement requires developers to promise Valve that "your game matches marketing materials" ([Steamworks: Content Survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey)). Screenshots must show gameplay only; concept art and pre-rendered stills should be avoided ([Steamworks: Store Graphical Assets](https://partner.steamgames.com/doc/store/assets/standard)).
- **App Store**: App Store Review Guideline 2.3.4 requires App Previews to use <strong>only screen recordings of the app itself</strong>. Narration and text overlays are permitted ([App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/), as of September 2026).

In short, do not create scenes, visual quality, or effects with AI that do not exist in the game, then present them as gameplay. For platform-specific AI policies, see [Platform AI Policies](/en/legal/platform-policies/).

:::caution
Steam's Content Survey treats AI-created content that is "bundled in the game and consumed by players" as subject to disclosure. Whether store materials themselves (like trailers) require disclosure is not explicitly stated in official documentation (as of September 2026). When in doubt, it is safest to explain your use honestly in the store page description.
:::

## Major AI Tools (as of September 2026)

### Video Generation

| Service | Latest Model | Features |
|---|---|---|
| Google [Veo](https://deepmind.google/models/veo/) | Veo 3.1 | Generates video and audio together. Generated videos include SynthID (digital watermark identifying AI-generated content). The new [Gemini Omni Flash](https://ai.google.dev/gemini-api/docs/video) is now the default recommended model in the Gemini API |
| [Kling AI](https://kling.ai/) | Kling 3.0 (announced February 2026) | Generates up to 15 seconds, multi-language voice generation, multi-shot storyboard feature ([announcement](https://www.prnewswire.com/news-releases/kling-ai-launches-3-0-model-ushering-in-an-era-where-everyone-can-be-a-director-302679944.html)) |
| [Runway](https://runway.com/) | Gen-4.5 (announced December 2025) | Strong at physics and camera movement instructions. Official documentation lists limitations: sequence of cause and effect can break down, objects can disappear or appear unexpectedly ([announcement article](https://runway.com/research/introducing-runway-gen-4.5)) |

:::note[Sora Discontinuation]
OpenAI's Sora ended web and app service on April 26, 2026, and API service on September 24, 2026 ([OpenAI Help Center](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation)). Services can end unexpectedly, so avoid becoming dependent on a single tool in your production workflow.
:::

### Music and Voice Generation

| Service | Purpose | Notes |
|---|---|---|
| [Suno](https://suno.com/) | Song and BGM generation | Released v6 on September 9, 2026 ([official blog](https://suno.com/blog/introducing-v6)). Commercial use terms vary by plan |
| [ElevenLabs Music](https://elevenlabs.io/music) | BGM generation | The terms (updated May 26, 2026) exclude self-serve plans (Free through Business) from use in "Studio Games." Studio Games are defined as "games monetized through sales or advertising and offered on multiple platforms" ([Eleven Music Model-Specific Terms](https://elevenlabs.io/eleven-music-model-specific-terms)) |
| [ElevenLabs](https://elevenlabs.io/) | Narration and voice synthesis | Public and commercial use terms vary by plan |
| [VOICEVOX](https://voicevox.hiroshiba.jp/) | Japanese voice synthesis (free) | Commercial use is allowed, but must credit VOICEVOX. Each voice library (character) has its own terms ([Terms of Use](https://voicevox.hiroshiba.jp/term/)) |

As ElevenLabs Music shows, even "commercial use allowed" may have separate terms for games. See [Commercial Use Terms for AI Tools](/en/legal/tool-terms/) for details.

## Appropriate Uses

Use AI generation as a **production aid** or for **clearly non-gameplay segments**.

| Use | Details |
|---|---|
| Storyboards / Video concept boards | Preview composition and camera work with short clips before shooting. Do not use in the final product |
| Temporary audio | Placeholder BGM to set editing tempo. Replace with final music in production |
| Narration | Voiceover for dev logs or explainer videos. Mark as synthetic voice to avoid confusion |
| Subtitles / Translation | Rough subtitles for multi-language trailers |
| Background elements | Abstract backgrounds for title cards or end slates. Only where not confused with gameplay |

## Uses to Avoid

| Use | Problem |
|---|---|
| Showing AI-generated footage as gameplay | Differs from actual game; misleads buyers. May violate Steam Distribution Agreement or App Store guidelines |
| Making the game appear higher quality or more dramatic than reality | Causes low reviews and refund requests for "trailer was different" |
| Footage or voice resembling real people or existing works | Risk of publicity rights or copyright issues |
| Music without confirmed license terms | Some tools restrict commercial use or game use |

:::tip
If you must use AI-generated cinematic footage, Steam lets you post it as a separate "general / cinematic" trailer, with a gameplay trailer first ([Steamworks: Trailers](https://partner.steamgames.com/doc/store/trailer)). Marking video as "concept footage" further reduces misunderstanding.
:::

## AI Labels on Social Media

When posting to social media, AI-generated content has its own disclosure rules.

- **YouTube**: AI-generated or altered content that could be mistaken for real must be disclosed at upload. Non-photorealistic animated content and minor edits are exempt ([YouTube Help](https://support.google.com/youtube/answer/14328491)).
- **TikTok**: Posts with AI-generated images, audio, or video resembling reality must be labeled ([TikTok Newsroom](https://newsroom.tiktok.com/en-us/new-labels-for-disclosing-ai-generated-content)).

## How to Use AI

- **Before using, ask: "Does this footage exist in the game?"** When in doubt, do not use it—that is the safe choice.
- **Read terms by use case**: Confirm not just "commercial use allowed" but also game-specific, advertising, and streaming terms.
- **Keep generation records**: Note the tool, plan, date, and prompt. This helps later when checking platform disclosures or store requirements.
- **Plan for service discontinuation**: As Sora shows, services can end. Download generated content and keep it locally.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial publication.
<!-- AUTO-UPDATE:END -->

## References

- [Content Survey (Steamworks Documentation)](https://partner.steamgames.com/doc/gettingstarted/contentsurvey) — Disclosure of AI-generated content and matching marketing materials to the game
- [Store Graphical Assets (Steamworks Documentation)](https://partner.steamgames.com/doc/store/assets/standard) — Screenshot rules
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) — Section 2.3.4: Preview video rules
- [Veo (Google DeepMind)](https://deepmind.google/models/veo/) — Veo 3.1 overview
- [Video generation in the Gemini API](https://ai.google.dev/gemini-api/docs/video) — Video generation models available in the API
- [Kling AI 3.0 announcement](https://www.prnewswire.com/news-releases/kling-ai-launches-3-0-model-ushering-in-an-era-where-everyone-can-be-a-director-302679944.html) — Kling 3.0 features
- [Introducing Runway Gen-4.5](https://runway.com/research/introducing-runway-gen-4.5) — Features and limitations of Gen-4.5
- [What to know about the Sora discontinuation](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation) — Announcement of Sora discontinuation
- [Introducing v6 (Suno)](https://suno.com/blog/introducing-v6) — Suno v6 announcement
- [Eleven Music Model-Specific Terms](https://elevenlabs.io/eleven-music-model-specific-terms) — Use terms by application
- [VOICEVOX Terms of Use](https://voicevox.hiroshiba.jp/term/) — Credit requirements
- [Disclosing use of altered or synthetic content (YouTube)](https://support.google.com/youtube/answer/14328491) — Disclosure of AI content
