---
title: Commercial Use Terms for AI Tools
description: Compares commercial use conditions, output rights, free plan restrictions, and indemnity for image, music, video, audio, 3D, and code generation AI tools based on their terms of service.
sidebar:
  order: 2
lastUpdated: 2026-09-29
---

## Overview

If you plan to sell a game with AI-generated assets, check these four points for each tool:

1. **Can you use it commercially?** (often depends on the plan)
2. **Who owns the output?** (does it belong to you or to the service?)
3. **Free plan restrictions** (non-commercial only, public visibility, credit attribution required, etc.)
4. **Indemnity** (if a third party sues for copyright infringement, will the service defend you or pay damages?)

The table below shows information verified from terms of service as of September 2026.

:::note[About Indemnity]
Personal plans typically do not include indemnity from the service. In fact, most terms include a clause where **you indemnify the service** (you take responsibility for any claims resulting from your use). Service indemnity is usually limited to enterprise contracts or API agreements, with many specific conditions and exclusions.
:::

## Image Generation

| Tool | Output Rights | Commercial Use and Plan Conditions | Indemnity | Terms |
|---|---|---|---|---|
| Midjourney | You own it (to the extent permitted by law) | Companies with annual revenue exceeding 1 million dollars (or their employees) cannot own the output unless they use Pro or Mega plans. Generated images are public by default and others can remix them. Making them private (Stealth mode) is a Pro/Mega feature only | None. You indemnify Midjourney | [Terms of Service](https://docs.midjourney.com/hc/en-us/articles/32083055291277-Terms-of-Service) (May 27, 2026) |
| OpenAI (ChatGPT image generation, etc.) | OpenAI transfers its rights to you | The personal terms do not appear to prohibit commercial use. OpenAI notes that outputs are not unique and similar outputs may be generated for other users | None for personal use. API and enterprise Services Agreement include conditional indemnity clauses | [Terms of Use](https://openai.com/policies/row-terms-of-use/) (effective January 1, 2026), [Services Agreement](https://openai.com/policies/services-agreement/) |
| Adobe Firefly | FAQ confirms commercial use eligibility (check each plan's terms for ownership details) | Outputs from features without beta labels can be used commercially. Beta features can also be used commercially unless explicitly marked otherwise in the product. Adobe's own models are trained on Adobe Stock and public domain sources. **If you choose partner models (Google, OpenAI, etc.), it is your responsibility to determine suitability** | Available for enterprise contracts (personal plan indemnity not confirmed) | [Firefly FAQ](https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/adobe-firefly-faq.html), [Explanation of Partner Models](https://helpx.adobe.com/creative-cloud/apps/generative-ai/non-adobe-models-in-adobe-products.html) |
| Stable Diffusion and others (Stability AI Community License) | You own it | Free commercial use for companies with annual revenue under 1 million dollars. Commercial use requires registration. Over that threshold requires an Enterprise license. If you distribute the model or derivatives, display "Powered by Stability AI" | None | [Community License](https://stability.ai/community-license-agreement) (updated July 5, 2024) |
| Google (Gemini app, etc.) | Google does not claim ownership | Prohibits making AI-generated content appear human-created or misleading. Also prohibits using AI-generated content to train models | Not confirmed in personal terms. Google Cloud has a list of services covered by indemnity | [Google Terms of Service](https://policies.google.com/terms) (effective July 30, 2026), [Google Cloud Indemnified Services](https://cloud.google.com/terms/generative-ai-indemnified-services) |

## Music and Audio

| Tool | Output Rights | Commercial Use and Plan Conditions | Indemnity | Terms |
|---|---|---|---|---|
| Suno | Songs created with paid plans (Pro / Premier) transfer Suno's rights to you. Songs from the free plan are limited to personal, non-commercial use | **Songs created on the free plan cannot be used commercially even after upgrading to a paid plan**. Only songs downloaded through approved channels can be used commercially, and the number of downloadable songs is limited per plan | None. You indemnify Suno | [Terms of Service](https://suno.com/terms) (effective September 3, 2026), [Help: Rights to Songs Created Before Joining](https://help.suno.com/en/articles/2425729) |
| ElevenLabs (Voice synthesis and voice cloning) | You retain output rights (you also grant ElevenLabs a license) | **Free use is limited to non-commercial purposes**. Paid plans allow commercial use. Voices you clone must be your own or voices where you have rights and consent. Music generation (Eleven Music) has separate terms, and for all self-serve plans, movies, television, radio, and "games monetized across multiple platforms" are not eligible for commercial use (see [Music-specific terms](https://elevenlabs.io/eleven-music-model-specific-terms); see [AI-generated Game BGM](/en/dev-env/ai-music/) for details) | None. You indemnify ElevenLabs | [Terms of Service](https://elevenlabs.io/terms-of-use) (updated March 31, 2026) |

:::caution[If Using Udio]
Udio settled with Universal Music Group in fall 2025. After that, it stopped allowing downloads and moved toward a system where songs can only be used within the platform (reported at [New Industry Focus](https://newindustryfocus.com/articles/udio-allows-downloads-for-48-hours-following-umg-deal-outcry)).
:::

## Video and 3D

| Tool | Output Rights | Commercial Use and Plan Conditions | Indemnity | Terms |
|---|---|---|---|---|
| Runway | Runway does not claim ownership of outputs | Does not restrict commercial use of outputs. However, you grant Runway broad rights for both inputs and outputs, including use for model training | None. You indemnify Runway | [Terms of Use](https://runway.com/terms-of-use) (updated September 15, 2026) |
| Meshy (3D model generation) | **Outputs from the free plan are owned by Meshy and provided under CC BY 4.0**. Paid plans are owned by you | If you use free plan outputs, you must comply with CC BY 4.0 and provide credit attribution | None. You indemnify Meshy | [Terms of Use](https://www.meshy.ai/terms-of-use) (updated September 19, 2026) |

If you use video generation AI in trailers (promotional videos), also see [Uses of AI Video Generation](/en/trailer/ai-video/).

## Code Generation

| Tool | Output Rights | Commercial Use and Plan Conditions | Indemnity | Terms |
|---|---|---|---|---|
| GitHub Copilot | GitHub does not own your input or output | Personal plans are covered under GitHub's standard terms. There is a setting to block suggestions that match public code | Enterprise and similar contracts may include defense clauses against third-party claims. You must maintain necessary safeguards (filters, etc.) as a condition | [Generative AI Services Terms](https://github.com/customer-terms/github-generative-ai-services-terms) (from March 5, 2026) |
| Claude (Anthropic) | Both personal and commercial terms transfer Anthropic's rights to you | Personal use prohibits developing competing services or using outputs for model training | None for personal use. API and enterprise Commercial Terms include intellectual property indemnity, with exclusions for modified outputs | [Consumer Terms](https://www.anthropic.com/legal/consumer-terms) (effective October 8, 2025), [Commercial Terms](https://www.anthropic.com/legal/commercial-terms) (effective June 17, 2025) |
| Cursor | Anysphere transfers its rights to you | Prohibits using outputs to develop competing models or for model training | None. You indemnify Anysphere | [Terms of Service](https://cursor.com/terms-of-service) (updated September 3, 2026) |
| OpenAI Codex | Personal use falls under OpenAI's personal terms (see image generation row). API use falls under the Services Agreement | Same as above | None for personal use. Services Agreement includes conditional indemnity clauses | [Terms of Use](https://openai.com/policies/row-terms-of-use/), [Services Agreement](https://openai.com/policies/services-agreement/) |

With code, beyond ownership rights, there is a **risk that existing OSS code may be output exactly as is**. For details, see [Licenses for Assets and OSS](/en/legal/licenses/).

## Key Points When Reading Terms

- **"Ownership" and "copyright exists" are different matters**: Even if terms state that outputs belong to you, that does not guarantee copyright exists under law (see [Copyright of AI-Generated Assets](/en/legal/copyright/)). Most terms include conditions like "to the extent permitted by law" or "if rights exist."
- **The plan at the time of creation matters**: Like Suno, outputs created on a free plan may not become commercially usable even after upgrading to a paid plan. If you plan to commercialize, it is safer to create with a paid plan from the start.
- **Check visibility settings**: Some services like Midjourney have defaults where outputs are visible to others. Your unreleased character designs could be distributed before announcement.
- **Check free plan licenses**: If free plan outputs come with CC BY 4.0 like Meshy, you must provide credit attribution (see [Licenses for Assets and OSS](/en/legal/licenses/)).
- **Keep a copy of the terms**: Record the date you created assets, the URL of the terms in effect, and the version date. If terms change, you can still explain the conditions at the time.
- **If using through an API**: If you embed generation in your game for players to generate, API terms and usage policies apply (see [Platform AI Policies](/en/legal/platform-policies/)).

## How to Use AI

- **Use AI for terms comparison tracking**: Periodically save terms pages and have an LLM summarize the differences from the previous version. This makes it easier to notice updates.
- **Create an asset inventory**: Use AI coding tools to create a CSV or script that tracks "asset name, tool, plan, generation date, terms version, modification status." This makes management easier. Related: [Asset Generation](/en/dev-env/asset-generation/), [AI Coding Tools](/en/dev-env/ai-coding-tools/)
- **Pre-sale verification**: You can generate the AI usage disclosure for your sales platform from this inventory. Related: [Sales Platforms](/en/monetization/platforms/)

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Midjourney Terms of Service](https://docs.midjourney.com/hc/en-us/articles/32083055291277-Terms-of-Service) — Output ownership and the 1 million dollar threshold
- [OpenAI Terms of Use](https://openai.com/policies/row-terms-of-use/) — Personal terms for regions outside the EU, including Japan
- [OpenAI Services Agreement](https://openai.com/policies/services-agreement/) — API and enterprise contract (includes indemnity clauses)
- [Adobe Firefly FAQ](https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/adobe-firefly-faq.html) — Commercial use and beta features
- [Stability AI Community License](https://stability.ai/community-license-agreement) — Free commercial use for revenue under 1 million dollars
- [Suno Terms of Service](https://suno.com/terms) — Differences in rights between free and paid plans
- [ElevenLabs Terms of Service](https://elevenlabs.io/terms-of-use) — Non-commercial restrictions for free use and voice rights
- [Runway Terms of Use](https://runway.com/terms-of-use) — Treatment of video generation outputs
- [Meshy Terms of Use](https://www.meshy.ai/terms-of-use) — CC BY 4.0 for free plan
- [GitHub Generative AI Services Terms](https://github.com/customer-terms/github-generative-ai-services-terms) — Enterprise terms for Copilot and others
- [Anthropic Commercial Terms](https://www.anthropic.com/legal/commercial-terms) — Indemnity clauses for API and enterprise
- [Cursor Terms of Service](https://cursor.com/terms-of-service) — Ownership of suggested code
