---
title: Asset Generation
description: Key tools for creating 2D images, pixel art, 3D models, music, sound effects, and voice with generative AI, plus tips for keeping quality and style consistent.
sidebar:
  order: 3
lastUpdated: 2026-10-05
---

## Overview

Assets are the materials used in games: images, 3D models, music, sound effects, and voice. Generative AI makes it possible to assemble these materials even without experience in art or composition. However, because tools vary in art style and audio quality, games often end up looking inconsistent. This article introduces the main tools for each type of asset and methods for keeping your style unified.

**Terms of commercial use vary significantly by tool and plan.** See [Commercial use terms for AI tools](/en/legal/tool-terms/) for details.

## Main tools by domain

The information below is current as of September 2026. Pricing and features change frequently.

### 2D images (characters, backgrounds, UI, icons)

| Tool | Features |
|---|---|
| Midjourney | Alpha version of V8 released in March 2026, with ongoing V8 updates. Style Reference (`--sref`) preserves art style from images or style codes |
| GPT Image 2 (OpenAI) | Image generation and editing model available via API. Supports image input and partial redrawing (inpainting) |
| Nano Banana 2 / Nano Banana Pro (Google) | Image generation model in Gemini. Nano Banana 2 can maintain the appearance of up to 5 characters in a single workflow. Generated images include SynthID watermarks and C2PA information |
| Scenario | Platform designed for game assets. Learn custom models for your own art style and characters from 10-50 reference images |

### Pixel art (dot art)

Output from general-purpose image generation models often has inconsistent dot sizes and color counts, making it difficult to use as pixel art directly. Specialized tools or post-processing are often required.

| Tool | Features |
|---|---|
| PixelLab | Generates character sprites (4- and 8-directional), animations, tile sets, and UI assets. Integrates with Aseprite and supports MCP |
| Retro Diffusion | Extension for the pixel art editor Aseprite. Uses a custom model trained on licensed pixel art, with color reduction and palette creation features |

### 3D models

| Tool | Features |
|---|---|
| Meshy | Meshy 7 is the latest version. Generates 3D models from text or images, with PBR textures, automatic rigging, and over 600 motion options. Outputs in FBX / GLB and more. Also offers API and MCP server |
| Tripo | Smart Mesh for games generates quad-based meshes from 500 to 25,000 polygons. Supports automatic rigging and exports to GLB / FBX / OBJ / USD for importing into Unity, Unreal, and Godot |
| Hunyuan3D (Tencent) | 3D generation model with published weights. Can run on your own PC or server. However, Hunyuan3D 2.1 license does not apply in the EU, UK, or South Korea, and separate licensing is required for over 1 million monthly active users |

Generated 3D models often have inconsistent polygon counts and UV mapping. Plan to verify and fix them in Blender or similar tools.

### Music (BGM)

| Tool | Features |
|---|---|
| Suno | Released v6 family (v6 / v6-wild / v6-mini) on September 9, 2026. Includes a feature to edit portions of songs with words. Free plan does not include commercial rights; commercial rights are included in Pro and higher |
| ElevenLabs Music | Eleven Music v2.5 is the latest music model. Available via API |

For commercial use terms by tool (Stable Audio 3, Suno, ElevenLabs Music, Lyria, ACE-Step, and more) and how to create game BGM, see [Creating game BGM and sound effects with AI](/en/dev-env/ai-music/) for details. Games monetizing across multiple platforms cannot use ElevenLabs Music for commercial purposes.

### Sound effects (SE)

| Tool | Features |
|---|---|
| ElevenLabs Sound Effects | Generate sound effects from text. Up to 30 seconds per generation. Supports loopless generation for repeating seamlessly, useful for environmental sounds |

### Voice

| Tool | Features |
|---|---|
| ElevenLabs | Latest Eleven v4 supports over 90 languages including Japanese. Useful for mass-producing dialogue and temporary voice tracks |
| VOICEVOX | Free Japanese speech synthesis software. Can be used for commercial and non-commercial purposes, but requires credit attribution. Each character (voice library) has separate terms that must also be followed |

## Keeping quality and style consistent

When creating assets with generative AI, the most time-consuming part is not creating one good image, but making all your assets look like they belong to the same game.

### 1. Decide on an art Bible first

An art Bible is documentation of your game's visual rules. At minimum, summarize the following on one page:

- Art style (example: thick outlines, cel shading, one-level shadows)
- Colors (palette to use, dominant colors, colors to avoid)
- Resolution and aspect ratio (example: characters are 32×32 pixels, display scale is integer multiples)
- Viewpoint (side view, top-down, diagonal top-down, etc.)

### 2. Modularize and fix your prompts

Divide prompts into "shared parts (art style, colors, viewpoint)" and "unique parts (what to draw)". Use the same wording for shared parts each time. Store prompts in text files under Git version control so you can return to the same conditions when regenerating later.

### 3. Use reference images or custom models

- Decide on a reference image, and provide it each time as a style reference (such as Midjourney's `--sref`) or reference image.
- If you need many assets, you can also train a custom model on your art style using a tool like Scenario.

### 4. Post-process for consistency

- **2D and pixel art**: Reduce colors to match your palette, unify outlines, use nearest-neighbor scaling.
- **3D**: Set limits on polygon count and texture resolution, check everything in the engine under the same lighting.
- **Audio**: Match volume levels (loudness normalization). BGM created with the same tool and similar prompts tends to have better cohesion.

### 5. Check in the game

Assets may look good alone but float out of place when placed together on screen. Integrate temporary assets into your game early and use screenshots to compare the overall appearance.

## How to use AI

- **Have coding agents create asset pipelines**: Scripts like "reduce PNG files in a folder to 32 colors and assemble them into a spritesheet" are easy for AI to write.
- **Connect MCP-compatible generation tools**: PixelLab and Meshy support MCP, allowing you to request asset generation from AI agents (as of September 2026).
- **Separate temporary assets from production assets**: Placeholder with AI assets in early development, then polish only the visible parts later. This prevents scope creep (see [Deciding on scope](/en/getting-started/scope/)).
- **Record rights and disclosure**: Keep a record of which tool and plan was used for each asset. This helps with checking terms and disclosing AI use on stores. Terms are summarized in [Commercial use terms for AI tools](/en/legal/tool-terms/) and [Licenses for assets and OSS](/en/legal/licenses/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-03**: Sprites generated by AI do not line up at equal intervals on spritesheets, so they cannot be cut out with equal division. A method for removing background from outer edges, detecting each frame position from opaque pixel distribution, and reassembling into a fixed grid is introduced ([source](https://zenn.dev/maruhana/articles/ai-sprite-sheet-band-split) (in Japanese))
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Midjourney Style Reference](https://docs.midjourney.com/hc/en-us/articles/32180011136653-Style-Reference) — How to use style references
- [Midjourney V8 Alpha](https://updates.midjourney.com/v8-alpha/) — V8 announcement
- [GPT-Image-2 Model (OpenAI API)](https://developers.openai.com/api/docs/models/gpt-image-2) — GPT Image 2 features
- [Nano Banana 2 (Google)](https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/) — Nano Banana 2 features and SynthID
- [Scenario Custom Model Training](https://www.scenario.com/features/train) — Training custom models
- [PixelLab](https://www.pixellab.ai/) — Pixel art character and animation generation
- [Retro Diffusion for Aseprite](https://astropulse.gitbook.io/retro-diffusion/aseprite-extension/retro-diffusion-for-aseprite) — Aseprite extension guide
- [Meshy](https://www.meshy.ai/) — 3D model generation, rigging, MCP server
- [Tripo](https://www.tripo3d.ai/) — Game-focused 3D model generation
- [Hunyuan3D 2.1 License](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1/blob/main/LICENSE) — Hunyuan3D 2.1 license text
- [Introducing v6 (Suno)](https://suno.com/blog/introducing-v6) — Suno v6 announcement
- [Suno Pricing](https://suno.com/pricing) — Suno plans and commercial rights
- [ElevenLabs Models](https://elevenlabs.io/docs/overview/models) — List of voice and music models and supported languages
- [ElevenLabs Sound effects](https://elevenlabs.io/docs/overview/capabilities/sound-effects) — Sound effects generation specifications
- [VOICEVOX Terms of Service](https://voicevox.hiroshiba.jp/term/) — VOICEVOX software terms
