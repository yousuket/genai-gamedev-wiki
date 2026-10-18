---
title: What can you build with one-shot generation?
description: Explore what games can be built from a single prompt and their limitations, using public examples like Claude of Duty, and learn how to determine when one-shot generation is enough for your project.
sidebar:
  order: 2
lastUpdated: 2026-10-19
---

## Overview

One-shot generation means building a working game with a single prompt. This article organizes what can be built through one-shot generation, what cannot, and the limits by genre, based on publicly available examples as of September 2026. Using Claude of Duty as a concrete example, it also shows how to determine when one-shot generation is sufficient and when it is not. For detailed case studies, see [Claude of Duty](/en/cases/claude-of-duty/). This article focuses on key points and the boundaries of what one-shot generation can achieve. The prompt examples are written for this article.

## What is one-shot generation?

"One prompt" has three meanings, and it is important to distinguish them when reading examples.

| Type | Meaning | Example |
|---|---|---|
| Single response | A game works from just one response from the model | A small minigame in a single file |
| Single instruction, long execution | The human writes once, but an agent executes and validates repeatedly over an extended period | Claude of Duty |
| A few short instructions | After the initial instruction, corrections happen over just a few turns | A demo that gets published after a few fixes following initial generation |

Claude of Duty is the second type. The README explains that multiple agents divided the work by role (see the [README](https://github.com/mshumer/Claude-of-Duty)). In this article, "one-shot generation" refers mainly to the second type. Even though human input happens once, behind the scenes an agent builds, looks at the screen, and makes corrections multiple times.

## What you can build in 2026

On July 24, 2026, Anthropic released Claude Opus 5. The model ID is `claude-opus-5`, and pricing is $5 per 1 million input tokens and $25 per output million tokens (see [Introducing Claude Opus 5](https://www.anthropic.com/news/claude-opus-5), as of September 2026). Immediately after its release, examples of one-shot generation combining this model with agents appeared rapidly.

| Type | Example | Scale and conditions |
|---|---|---|
| 3D shooting | Claude of Duty (Matt Shumer) | Three.js, approximately 55,000 lines, 11 subsystems, no image or audio files |
| 3D space exploration | The Long Silence (Anshu) | Opus 5 run continuously for 24 hours. The README lists 17 test operations |
| 3D real-time strategy | [Starfall](/en/cases/oneshot-starfall/) (Mike Luan) | According to the author, cost was $632.65 and output was 4.6 million tokens. The [repository](https://github.com/e01-ai/starfall) (MIT license) was published on July 28, 2026 |
| Game jam scale | Cursor Vibe Jam 2026 submissions | 945 works were submitted with the condition that AI writes over 90 percent of the code |

Sources are: Claude of Duty from [README](https://github.com/mshumer/Claude-of-Duty); The Long Silence from [README](https://github.com/achimala/TheLongSilence) and [author's post](https://x.com/anshuc/status/2081801966158811506); Starfall from [author's post](https://x.com/mikeluan123/status/2081716631986983093); Vibe Jam from [official site](https://vibejam.com/) and [organizer's post](https://x.com/levelsio/status/2050213288609235424). The Starfall numbers are declared by the author.

The successful builds share common patterns:

- Combining a large number of parts (rendering, physics, AI, audio, etc.) for which public implementations are abundant
- Not using image or audio files, but generating them from code at runtime (the Claude of Duty README explains that all textures, meshes, animations, and sounds are created from code at runtime)
- The agent verifies its own work by running it and making corrections

Tim Soret, who served as a judge for Vibe Jam, noted that this year's submissions showed a significant quality increase from the previous year, and some are close to real games (see [Vibe Jam 2026 winners and how the games are getting close to real production quality](https://levels.io/vibe-jam-2026-winners-quality)).

## Deconstructing Claude of Duty

### What the prompt determined

The publicly released prompt is three paragraphs (see [prompt.md](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md)). Breaking it into elements, there are five:

| Element | Content |
|---|---|
| Goal | A first-person shooter at the latest Call of Duty standard. Everything from textures to physics at the highest quality |
| Division of labor | Deploy sub-agents and assign them to each item |
| Critic role | Another sub-agent strictly reviews the appearance. If the standard is not met, continue |
| Exit condition | Compare blind side-by-side with the real Call of Duty |
| Technology specified | Use Three.js |

The map size, weapon types, enemy behavior, and controls are not specified. All of these were choices made by the model. The prompt contains no instruction not to use image or audio files. That the final product has no files appears to be because the agent brought in no external assets and built them in code (this is an inference).

### What was accomplished

Numbers from the README (as of September 2026):

| Item | Content |
|---|---|
| Scale | Approximately 55,000 lines, 11 subsystems |
| Map | About 120×120m market street with buildings to enter |
| Enemies | Skeletal soldiers with pathfinding, environmental perception, cover usage, and physics on falling |
| Controls | Movement, shooting, aiming, reloading, sprinting, crouching, jumping, body lean |
| Performance | After optimization, 28–30 fps (median) at Retina resolution. Worst frame: 66–82 ms |
| Critic score | 10-point scale: 3.59 → 4.14 → 4.05 → 5.05 |
| Blind comparison | Every critic chose the real Call of Duty in every round |

The author states in the README that the goal was not achieved. Issues mentioned include hands looking like flat blocks, procedural noise visible up close, and enemies looking like mannequins.

### Lessons from the process

The README's "Process note" contains two lessons:

- Work sequentially, not in parallel. When six agents worked on separate directories in parallel across three iterations, the score increased only 0.46 points total, and screen-breaking bugs increased from 60 → 47 → 66. Tonemapping, sky, and indirect lighting are interconnected systems; when responsibility was divided, each agent undermined the other's assumptions. When assigning one agent to each connected part and working sequentially, the score increased by 1.00 points and bugs decreased from 66 to 26
- How to choose validation metrics. Fixed camera measurements showed 94 fps, but actual gameplay was 12–17 fps with stops up to 728–1236 ms. Shader lazy compilation was the cause. The issue was found using a script that measured not the median, but the distribution and the cause of slow moments

Additionally, agreements between agents were documented in `ARCHITECTURE.md`. These included responsibility directories, event names used between subsystems, and rules to follow (use a fixed random function, do not allocate memory every frame, etc.). Delivering specs in documents is covered in [Spec-driven development](/en/agent-dev/spec-driven/).

### Different developers with the same prompt

James Altucher used the same prompt to create Operation Blackout, a shooting game. Leon Lin wrote a detailed prompt divided into 20 items and created Dust Corridor using Opus 5 in Cursor. Both became browser games. Decrypt notes that follow-up works did not undergo the side-by-side comparison with the real game done in Shumer's work (see [Decrypt](https://decrypt.co/374560/dumbest-ai-prompt-claude-beat-careful-game-design), July 28, 2026).

The same article also presents another view: because there are many public implementations of first-person shooter mechanics, the model may have combined them rather than generating from scratch. This view relates to "uniqueness" in the next section.

## Limitations of one-shot generation

Weaknesses visible from examples are organized below.

| Weak area | What happens | Basis | Next step |
|---|---|---|---|
| Content depth | Many mechanisms but few places to play, few enemies, few goals | Claude of Duty has one map. The README has no description of purpose or progression | [From one-shot to product](/en/agent-dev/from-one-shot-to-product/) vertical slice |
| Balancing | Difficulty, economy, and growth numbers are unknown without play | Critics scored appearance but did not score gameplay adjustment | [Balancing](/en/design/balancing/) |
| Game feel | Appearance moves but the feel of controls is different | Hand appearance and weapon visibility remained issues throughout | [Game feel](/en/agent-dev/game-feel/) |
| Replay value | Amazing the first time, but no reason to play again | Progression and reward design were not in the prompt or README | [Core loop](/en/design/core-loop/) |
| Performance | Heavy on actual hardware, freezes mid-play | Initially 12–17 fps, maximum over 1 second freeze | Include performance measurement in validation |
| Uniqueness | Tends to be typical | May be recombination of public implementations in areas with many examples (Decrypt) | [Standing out](/en/agent-dev/differentiation/) |

The README of The Long Silence notes that ground materials and some ship parts use assets made with an image generation model and Blender. This can be read as an example of adding a materials creation step to pure code-only one-shot generation (this is an inference). Steam's content survey states that AI tool use in development is not the focus of disclosure; instead, AI-generated content that players see (pre-generated and in-game generation) is the disclosure target (see [Steamworks](https://partner.steamgames.com/doc/gettingstarted/contentsurvey), as of September 2026). The decision to add assets is also important for rights and disclosure.

## Capabilities by genre

Areas with confirmed examples and areas where examples have not been confirmed in this article are separated.

| Genre | Capabilities | Basis |
|---|---|---|
| 3D shooting | Works and visually polished. Game feel and performance are challenges | Claude of Duty README |
| Space exploration | Procedurally generated universe, progression with purpose works | The Long Silence README (seven devices to synchronize with open what is ahead) |
| Real-time strategy | Works. However, in the days after release, many display glitches and control bugs were fixed | [Starfall](/en/cases/oneshot-starfall/) |
| Game jam scale | Quality of submissions is increasing | Vibe Jam 2026 |
| Puzzle, idle, card, roguelike | Examples are not confirmed in this article. Suspected to be easier to build frameworks since rules are central and assets are minimal | [Genres that work well with generative AI](/en/genres/ai-friendly/) organization |
| Novel, adventure | Examples not confirmed. Suspected that text quality and character consistency require significant human involvement | Same as above |

Sections marked "suspected" have not been confirmed with examples in this article. Try yourself and compare results with the [case studies](/en/cases/).

## When one-shot is enough, when it isn't

| One-shot is enough | One-shot is not enough |
|---|---|
| Technology validation, testing if a concept works | Selling on a store |
| Game jam submission, personal use | Playing for more than a few hours |
| Demo to show friends | Needing to stand out from other games |
| Using as a foundation (code base) | When gameplay adjustment is the value |

When uncertain, answer these five questions:

1. How many people besides you will play it? (If only one, one-shot is often enough)
2. How many minutes will someone play? (If over five minutes, progression design is needed)
3. Would you be bothered if someone said "there are others like this"? (If yes, standing out work is needed)
4. Is the feel of interaction what matters? (If yes, game feel adjustment is needed)
5. Will you receive money? (If yes, quality, performance, and store requirements are needed)

If three or more are "needed," one-shot generation is the starting point and you proceed to [From one-shot to product](/en/agent-dev/from-one-shot-to-product/).

## Writing prompts for one-shot generation

The Claude of Duty example shows the value of providing "goal," "critic role," and "exit condition" over fine details. On the other hand, examples like Lin's detailed 20-item prompt also produce working results. Which is better cannot be determined from this example alone. When trying yourself, include these elements:

```text
Create a roguelike action game playable in a browser on a single screen.
- Goal: Ends in 5 minutes per run. Scored by enemies defeated and survival time
- Technology: Three.js and Vite. Do not use image or audio files; generate them from code
- Division of labor: Graphics, enemy AI, UI, and sound are handled by separate sub-agents. The main agent handles overall integration
- Validation: Run npm run build after each change and take 3 screenshots in a headless browser to verify
- Critic: Before completion, show the screen to another sub-agent and have it list 5 ways the game is inferior to existing similar games
- Exit condition: Stop when the critic's feedback contains no remaining issues with performance, controls, or visibility. However, maximum 2 hours
```

The time limit is included to prevent endless iteration. The longer it runs, the higher the cost. The author of a Homeworld-style example reported spending approximately $630.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-11**: A record of the author asking Claude Opus 5.5 to build a 3D browser game themed on the AI industry. The prompt specified the theme, required elements, permission to proceed without waiting for confirmation, automatic deployment to GitHub Pages with a public repository, and even an image feature for sharing. The result is published at picksandshovels.org. The state of the repository is unconfirmed ([source](https://blog.fsck.com/2026/10/11/picks-and-shovels/))
- **2026-10-04**: According to a Reddit user's report, Claude Code (Opus 5.5, Ultracode mode) was given a single prompt "Create a hyper-realistic AAA Olympic speed skating game" and completed it in 72 minutes. The quality of the result is unconfirmed ([source](https://www.reddit.com/r/aigamedev/comments/1wxlbt2/opus_55_oneshot_an_entire_olympic_speed_skating_game_in_72_min/))
- **2026-10-02**: GamesByAI, a catalog of 528 AI-made browser games, reports model usage: Claude 45%, GPT 20%, Gemini 6%; tools: Claude Code 38%, Cursor 20%; engines: Three.js 58% ([source](https://gamesbyai.win/stats/))
- **2026-09-28**: PacBench, a site comparing output from different models and harnesses (Claude Code, Codex, Cursor Cloud, etc.) for the single prompt "Create a Pac-Man game in a single html page," measuring score, cost, time, and token count, was published ([source](https://jonclegg.github.io/pacman-bakeoff/))
- **2026-09-29**: Initial version created.
<!-- AUTO-UPDATE:END -->

## References

- [Claude of Duty (GitHub)](https://github.com/mshumer/Claude-of-Duty) — README contains architecture, performance, author's evaluation, and process lessons
- [prompt.md](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md) — Full text of the public prompt
- [Introducing Claude Opus 5 (Anthropic)](https://www.anthropic.com/news/claude-opus-5) — Release date, model ID, pricing
- [The Long Silence (GitHub)](https://github.com/achimala/TheLongSilence) — Procedurally generated space exploration game. Includes explanations of asset creation and validation scripts
- [Anshu's post (X)](https://x.com/anshuc/status/2081801966158811506) — Introduction to creating continuously for 24 hours
- [Mike Luan's post (X)](https://x.com/mikeluan123/status/2081716631986983093) — Anshu's declaration of usage and cost for Starfall
- [Decrypt: The Dumbest-Looking AI Prompt Just Beat Months of Careful Game-Design Prompt Engineering](https://decrypt.co/374560/dumbest-ai-prompt-claude-beat-careful-game-design) — Follow-up works and the view of recombining existing implementations
- [Cursor Vibe Jam 2026](https://vibejam.com/) — Participation requirements and prizes
- [Vibe Jam 2026 winners and how the games are getting close to real production quality (levels.io)](https://levels.io/vibe-jam-2026-winners-quality) — Award winners and judge evaluations
- [Steamworks: Content Survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey) — Disclosure scope for AI-generated content
