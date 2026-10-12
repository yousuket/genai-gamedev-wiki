---
title: "Creating Game BGM and Sound Effects with AI: Choosing Tools and Commercial Use Conditions"
description: Compare generative AI music tools such as Stable Audio 3, Suno, ElevenLabs Music, Lyria, and ACE-Step by their commercial use conditions and rights handling, with guidance on creating game BGM.
sidebar:
  order: 6
lastUpdated: 2026-10-05
---

## Overview

Background music (BGM) sets the atmosphere of your game. Even without composition experience, you can generate music candidates in a short time using AI music generation tools.
However, AI music generation tools have **very different commercial use conditions depending on the tool**. If you plan to include music in your game for sale, you need to check the terms before evaluating sound quality.
This article compares the commercial use conditions and rights handling of major tools by examining their official terms and licenses, and introduces how to create game BGM. Where conditions could not be verified, this is stated explicitly.
For general tools covering all asset types, see [Asset generation](/en/dev-env/asset-generation/). For general information on reading terms, see [Commercial use conditions of AI tools](/en/legal/tool-terms/).

## Tool comparison

All information as of October 2026.

| Tool | Type | Commercial use conditions | Rights handling | Best for | Sources |
|---|---|---|---|---|---|
| [Stable Audio](https://stability.ai/stable-audio) 3 Medium / Small (open weights) | BGM, sound effects (Small SFX) | Stability AI Community License. With registration, free commercial use if annual revenue is under 1 million USD. Exceeding this requires permission. | Outputs are owned by the user (to the extent permitted by law). Training data includes licensed audio and CC-licensed audio. | Generating many tracks on your PC, creating assets with high reproducibility | [Community License](https://stability.ai/community-license-agreement), [Model Card](https://huggingface.co/stabilityai/stable-audio-3-medium) |
| [Stable Audio](https://stability.ai/stable-audio) (Web app, API) | BGM, sound effects | Free plan is for personal and non-commercial use. Paid plans (Solo and above) include commercial license. | Output rights are transferred to the user (to the extent permitted by law). | Testing without setting up a development environment | [Pricing](https://stableaudio.com/pricing), [Terms of Service](https://stability.ai/terms-of-service) |
| [Suno](https://suno.com/) | BGM, songs with vocals | Commercial rights are Pro and Premier only. Only tracks downloaded within the download quota can be used commercially. | Pro and Premier outputs are rights-transferred to the user. Copyright enforcement is not guaranteed. | Songs with vocals, title tracks | [Terms of Service](https://suno.com/terms), [Pricing](https://suno.com/pricing) |
| [ElevenLabs](https://elevenlabs.io/) Music | BGM, songs with vocals | Available on paid plans. However, <strong>games sold on multiple platforms (Studio Games) are not covered by self-serve plans</strong>. | Output rights are retained by the user. | Creating many tracks quickly, automating with API | [Music Model-Specific Terms](https://elevenlabs.io/eleven-music-model-specific-terms), [Terms of Use](https://elevenlabs.io/terms-of-use) |
| [Lyria](https://deepmind.google/models/lyria/) (Google, Gemini API) | BGM (30-second clips, multi-minute tracks) | Paid tier only; no free tier (Lyria 3.5 is 0.08 USD per track). Music-specific commercial terms could not be verified. | Google does not claim ownership. Outputs include SynthID watermark. | Placeholder BGM during development, API-based auto-generation | [Lyria documentation](https://ai.google.dev/gemini-api/docs/music-generation), [Additional terms](https://ai.google.dev/gemini-api/terms), [Pricing](https://ai.google.dev/gemini-api/docs/pricing) |
| [ACE-Step](https://ace-step.github.io/) 1.5 (open weights) | BGM, songs with vocals | MIT License. Model card states that generated music can be used for commercial purposes. | Model card does not specify rights attribution. Training data is described as licensed audio and royalty-free audio. | Testing on your PC, preferring looser licenses | [Model Card](https://huggingface.co/ACE-Step/Ace-Step1.5) |
| [AIVA](https://www.aiva.ai/) | BGM (orchestral, etc.) | Paid Standard plan limits monetization to YouTube, Twitch, TikTok, and Instagram. Game monetization appears to require Pro. | Pro only grants copyright ownership to the user. Free and Standard grant ownership to AIVA. | Exporting to MIDI for manual editing | [Pricing](https://www.aiva.ai/pricing) |
| [Udio](https://www.udio.com/) | (Cannot be used for game BGM) | Outputs are limited to personal and non-commercial use. Download is also prohibited. | Outputs are owned by the company and rights holders. | Cannot be used | [Terms of Service](https://www.udio.com/terms-of-service) (revised November 12, 2025) |
| MusicGen (Meta) | BGM | Weights are CC BY-NC 4.0, which does not permit commercial use. | Training data includes Meta audio and Shutterstock and Pond5 audio. | Prototyping and learning | [Model Card](https://huggingface.co/facebook/musicgen-small) |

## Stable Audio 3 licensing

[Stable Audio](https://stability.ai/stable-audio) 3 (Small and Medium) weights were released on Hugging Face in May 2026. License terms can be confirmed on the official pages below.

- The license in the model card is `stable-audio-community`, with commercial use directed to [stability.ai/license](https://stability.ai/license). The Community section of this page includes Stable Audio 3.0, and the Community License applies. Stable Audio 3.0 Small and Medium are also listed in the [Core Models list](https://stability.ai/core-models).
- Under the Community License, if annual revenue is under 1 million USD, commercial use is free in addition to research and non-commercial use. Registration with Stability AI is required for commercial use.
- The 1 million USD threshold refers to <strong>total annual revenue</strong>, not revenue from this model's outputs. Revenue from other sources is included, as is revenue from related entities. Once exceeded, the license ends on the date of overage, and you must seek individual permission from Stability AI.
- Outputs are owned by the user to the extent permitted by law. The model, software, documentation, and derivatives (such as fine-tuning) are covered, with outputs themselves excluded from the definition of derivatives.
- When distributing the model or derivatives to third parties, you must attach a copy of the terms, include a Notice file, and display "Powered by Stability AI". Using only the output audio in your game does not appear to constitute distribution (this is an interpretation of the contractual definition). If you bundle the model in your game and generate audio at runtime, this constitutes distribution.
- Use must comply with applicable law and Stability AI's usage policy. Using the model or outputs to create or improve foundation models is prohibited.
- The model's text processing uses T5Gemma, and you must agree to Gemma's terms of use (including usage restrictions in section 3.2).
- Training data includes approximately 800,000 tracks licensed from AudioSparx and approximately 470,000 tracks from Freesound (CC0, CC BY, and CC Sampling+) (per the model card). Because CC BY audio is included, <strong>whether credit attribution is required in outputs could not be verified</strong>.

For Web app paid plans, after cancellation, music created on paid plans remains subject to their original license (see the FAQ on the [pricing page](https://stableaudio.com/pricing)). Stability AI's terms include a user indemnification clause, with Stability AI indemnification provided only under Enterprise license (see [Stable Audio](https://stability.ai/stable-audio)).

## How to read licenses

When including music in a game for sale, check these points:

1. **Plan at creation time**: [Suno](https://suno.com/) music created on the free plan cannot generally be used commercially even if you later upgrade (see [Help](https://help.suno.com/en/articles/2425729)). [ElevenLabs](https://elevenlabs.io/) retains the rights of the plan under which output was created even after downgrading or canceling.
2. **Download quota**: Suno allows commercial use only for tracks downloaded within the quota. Pro includes 20 monthly downloads, Premier includes 60 monthly (see [Pricing](https://suno.com/pricing)). Audio obtained through recording or stream capture cannot be used. Commercial rights for already-obtained downloads continue after cancellation (per Suno's terms).
3. **Sales scope**: ElevenLabs Music "Studio Games" are games monetized through sales and advertising, offered on multiple platforms. Self-serve plans cover commercial use excluding movies, TV, radio, and Studio Games; Studio Games require an Enterprise Music contract. The company's documentation states support for "commercial use including games," but the terms table explicitly excludes this. Whether games sold on a single platform fall outside this exclusion cannot be confirmed from the contract language.
4. **Revenue ceiling**: [Stable Audio](https://stability.ai/stable-audio) 3 has a 1 million USD annual revenue threshold.
5. **Credit attribution**: ElevenLabs requires attribution only on the free plan. Stable Audio 3's Community License requires attribution when distributing the model.
6. **Indemnification**: Consumer terms typically exclude indemnification. Within what could be verified, Stability AI indemnification is Enterprise-only.
7. **Open weights**: The license text is the complete set of conditions. Licenses differ by model. Even among "open" licenses, [ACE-Step](https://ace-step.github.io/) is MIT, Stable Audio 3 has a revenue cap, and MusicGen is non-commercial.

"Being able to own outputs" and "having copyright protection" are different matters. Suno states that copyright enforcement is not guaranteed. For perspectives on rights, see [Copyright of AI-generated assets](/en/legal/copyright/).

## Creating game BGM

This section covers practical workflow, not licensing. Sections without sources are stated as approximations or general practice.

### Decide specifications first

Before creating music, make a table for each scene: "atmosphere, tempo (BPM), instruments, length, whether to loop". This table becomes material for your prompt to the AI.

### Making music loop

AI-generated music tends to have a complete musical structure, ending like a finished song (likely because training emphasizes finished compositions). For games, use this workflow:

1. Generate with the BPM specified. Use a track where the BPM is known so it aligns with bar lines.
2. Trim at bar boundaries using a DAW or waveform editor.
3. Overlap the end section with the beginning using crossfade to make the seam less noticeable.
4. Enable looping in the game engine. Godot's Ogg Vorbis and MP3 import includes settings for Loop, Loop Offset, BPM, Beat Count, and Bar Beats (see [Godot documentation](https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_audio_samples.html)).

[Lyria](https://deepmind.google/models/lyria/)'s Clip model generates 30-second short clips, and the documentation lists looping as an intended use. [Stable Audio](https://stability.ai/stable-audio) 3 supports inpainting (regenerating part of audio) and extend (continuing from short recordings) (per model card). These could be useful for redoing track endings to improve loops, but we have not tested them.

### Switching between scenes

- When dividing into scenes like exploration, combat, and boss battle, unifying key (musical key), BPM, and instrument arrangement while varying intensity makes transitions smoother.
- Using the same tool and similar prompts across a game creates visual cohesion (see [Asset generation](/en/dev-env/asset-generation/)).
- For layering parts, use [Suno](https://suno.com/) Pro and above stem separation (see [Pricing](https://suno.com/pricing)) or [ElevenLabs](https://elevenlabs.io/) paid-plan API (stems).

### Length and file size

Loop assets can be short. Generation length varies: Lyria offers 30-second clips and multi-minute tracks, ElevenLabs Music offers 3 seconds to 5 minutes, and Stable Audio's web app offers up to 6 minutes (per documentation). Keep file size down by exporting to compressed formats like Ogg Vorbis.

### Mixing and fixing AI quirks

- Normalize loudness across tracks. Volume variation is common across AI-generated pieces.
- Reduce the midrange where it overlaps with sound effects or voice using EQ for better clarity.
- If vocals are mixed in, regenerate with instrumental specified.
- Common quirks like sudden endings or unnatural phrase repetition can be fixed by cutting the usable section and splicing in your DAW.

## Sound effects and voice

- **Sound effects**: [Stable Audio](https://stability.ai/stable-audio) 3 Small SFX is open weights designed for sound effects. The model card example is 7 seconds. Licensing is the same Community License as Medium. [ElevenLabs](https://elevenlabs.io/) Sound Effects supports up to 30 seconds and offers loop generation (see [Asset generation](/en/dev-env/asset-generation/)). Free use is limited to non-commercial (see [Terms of Use](https://elevenlabs.io/terms-of-use)). Whether ElevenLabs Sound Effects has a "Studio Games" equivalent condition could not be verified.
- **Voice**: See [Asset generation](/en/dev-env/asset-generation/) for options like ElevenLabs and VOICEVOX and their terms.

## Disclosure at distribution

When game BGM or sound effects are AI-generated, disclose this on distribution platforms like [Steam](https://store.steampowered.com/) as AI-generated content. Disclosure mechanisms and scope are covered in [AI policies of platforms](/en/legal/platform-policies/). Guidance on recording assets is in [Commercial use conditions of AI tools](/en/legal/tool-terms/). Keeping records of the tool name, plan, generation date, and terms version per track is useful for disclosure.

## How to use AI

### Writing prompts for game BGM

[Lyria](https://deepmind.google/models/lyria/)'s documentation recommends being specific about instruments, BPM, key, mood, and structure. [Stable Audio](https://stability.ai/stable-audio) 3's model card is English-only and shows examples with BPM written at the end.
[ElevenLabs](https://elevenlabs.io/) Music prohibits using artist names, song titles, album names, label names, and most of the lyrics in inputs (see [Music Terms](https://elevenlabs.io/music-terms)). Lyria also stops prompts requesting a specific artist's voice. Specify sound characteristics instead of naming "in the style of [artist]".

Organizing prompts in this order helps:

1. Use (which scene this BGM is for)
2. Genre and instruments
3. Tempo (BPM) and key
4. Mood progression (how intensity builds)
5. Length, looping, and vocal presence

### Prompt examples

For an exploration scene loop:

```
Calm exploration theme for a top-down fantasy village, loopable.
Acoustic guitar, soft flute and light hand percussion. 90 BPM, D major.
Steady and warm, no big build-ups, no vocals. 60 seconds.
```

Boss battle theme (matching BPM and key to the exploration track):

```
Boss battle theme for a 2D action game, same key as the village theme.
Driving taiko, low strings and brass stabs, 135 BPM, D minor.
Intense from the start, with a short break in the middle, no vocals.
```

### Delegating work

- Have the AI read your game design document and create an order table with "scene name, mood, BPM, key, length, loop". Use this directly as prompt material.
- For checking loop seams, have a coding AI tool write scripts in ffmpeg or Python to analyze volume and waveforms at seam points (see [AI coding tools](/en/dev-env/ai-coding-tools/)).
- Keep a ledger of "tool, plan, generation date, terms version, download date" per track. Scripts can help manage this.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-05**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Stability AI Community License Agreement](https://stability.ai/community-license-agreement) — Commercial use conditions, 1 million USD threshold, output ownership
- [Stability AI License](https://stability.ai/license) — Confirmation that Stable Audio 3.0 is included in Community
- [Stability AI Core Models](https://stability.ai/core-models) — Listing of Stable Audio 3.0 Small / Medium
- [Stable Audio 3 Medium (Hugging Face)](https://huggingface.co/stabilityai/stable-audio-3-medium) — Model card, training data, Gemma terms note
- [Stable Audio 3 Small SFX (Hugging Face)](https://huggingface.co/stabilityai/stable-audio-3-small-sfx) — Sound effects model
- [Stable Audio Pricing](https://stableaudio.com/pricing) — Paid plan commercial license and post-cancellation handling
- [Stability AI Terms of Service](https://stability.ai/terms-of-service) — Output rights and prohibited uses (effective September 30, 2026)
- [Stable Audio (Stability AI)](https://stability.ai/stable-audio) — Model composition and Enterprise indemnification
- [Suno Terms of Service](https://suno.com/terms) — Commercial use, download quota, rights transfer (effective September 3, 2026)
- [Suno Pricing](https://suno.com/pricing) — Downloads and commercial rights per plan
- [Suno Help: Rights for pre-subscription tracks](https://help.suno.com/en/articles/2425729) — Free plan track handling
- [ElevenLabs Eleven Music Model-Specific Terms](https://elevenlabs.io/eleven-music-model-specific-terms) — Commercial rights table by plan, Studio Games definition (updated May 26, 2026)
- [ElevenLabs Music Terms](https://elevenlabs.io/music-terms) — Prohibited inputs, prohibited industries
- [ElevenLabs Terms of Use](https://elevenlabs.io/terms-of-use) — Free use is non-commercial only (updated March 31, 2026)
- [ElevenLabs Music](https://elevenlabs.io/docs/overview/capabilities/music) — Maximum generation length
- [Generate music with Lyria 3.5 (Gemini API)](https://ai.google.dev/gemini-api/docs/music-generation) — Model types, length, SynthID, best practices
- [Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms) — Output ownership (effective March 23, 2026)
- [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing) — Lyria pricing
- [ACE-Step 1.5 (Hugging Face)](https://huggingface.co/ACE-Step/Ace-Step1.5) — MIT license and commercial use note
- [AIVA Pricing](https://www.aiva.ai/pricing) — Monetization scope and copyright per plan
- [Udio Terms of Service](https://www.udio.com/terms-of-service) — Outputs are personal and non-commercial, download prohibited
- [MusicGen (Hugging Face)](https://huggingface.co/facebook/musicgen-small) — Weights are CC BY-NC 4.0
- [Godot: Importing audio samples](https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_audio_samples.html) — Loop settings
