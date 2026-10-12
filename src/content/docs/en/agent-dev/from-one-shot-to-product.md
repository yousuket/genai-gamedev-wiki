---
title: "From One-Shot to Product: How to Move Forward"
description: Divides development after one-shot generation into phases (direction, vertical slice, spec, iteration, quality, release prep, and operations), showing the goal, human and agent tasks, prompt examples, and completion criteria for each phase.
sidebar:
  order: 4
lastUpdated: 2026-10-05
---

## Overview

After one-shot generation produces a working prototype, you proceed phase by phase. This article shows the goal, human tasks, agent tasks, prompt examples, and completion criteria for each phase.
It also covers the criteria for deciding to discard and rebuild, and how to handle the repository and history.
The big picture is in [Building Games with Coding Agents: Overview](/en/agent-dev/overview/).
The prompt examples are examples written for this article.

## List of phases

| Phase | Goal | Completion criteria |
|---|---|---|
| 0 One-shot generation | Obtain a working prototype as material | Build succeeds, screen appears, playable for 30 minutes |
| 1 Direction and scope narrowing | Decide what to keep, discard, and add | What you keep is explainable in 3 lines, design document is one page |
| 2 Vertical slice | Polish one portion to product quality | Others can play 5 minutes without explanation |
| 3 Spec | Document the working code | Spec and implementation match, with completion conditions per feature |
| 4 Iteration | Add features and adjust in small loops | One feature per commit, completion conditions met and committed |
| 5 Quality | Make it stable, fast, and accessible to everyone | Testing, performance, and accessibility pass agreed-upon standards |
| 6 Release prep | Format for distribution and store | Distribution files, store assets, and disclosures are ready |
| 7 Operations | Run updates after release | Flow from bug report to fix is established |

## Phase 0 One-shot generation

- Goal: Obtain a working prototype as material. Do not polish it here.
- Human tasks: Decide what to build and provide a verification method (build, screenshot). Record the prompt, model used, and date.
- Agent tasks: Implement and self-verify
- Completion criteria: Build succeeds, screen appears, playable for 30 minutes

```text
Create a top-down action game that runs in a browser and fits on one screen (Three.js, Vite, no image or audio files).
- Controls are WASD and mouse aiming. Enemies press forward; clear if you survive 60 seconds.
- npm run build must pass
- Take 3 screenshots in a headless browser and review them yourself; fix any obvious issues
- Report the verification result and any unimplemented points at the end
```

When done, commit and tag it `oneshot-v0`. The one-shot result becomes a baseline for later comparison.

## Phase 1 Direction and scope narrowing

- Goal: Decide what to keep, discard, and add
- Human tasks: Play for 30 minutes, write "keep/discard/add" in 3 lines. Create a one-page design document ([design document template](/en/design/game-design-doc/))
- Agent tasks: Explain code structure, delete features to cut, ask questions to flesh out the design document
- Completion criteria: What you keep is explainable in 3 lines, design document is one page

Cutting is something agents do well. It is easier to verify than adding features.
The design document is created by having the agent ask you questions. The Claude Code official documentation recommends starting with a minimal prompt and having the agent ask detailed questions, then writing the results to SPEC.md ([Best practices](https://code.claude.com/docs/en/best-practices), as of September 2026).

```text
I want to create a one-page design document for this game. First, ask me questions.
- Ask about the player, play length per session, the fun we are aiming for, and my biggest concern
- Ask at most 3 questions at a time
- When questions run out, write to docs/one-pager.md
The current code is in src/. Do not change it yet.
```

## Phase 2 Vertical slice

- Goal: Polish one portion (one level, one mission) to product quality. It also serves as a reference for the overall finish.
- Human tasks: Show quality standards (reference games, style guide). Play and judge the result.
- Agent tasks: Implement, self-check with screenshots, review with a critic subagent
- Completion criteria: Others can play 5 minutes without explanation

The critic is a method used in Claude of Duty. Showing the result to a different agent than the one who built it reduces bias (["Claude of Duty" case study](/en/cases/claude-of-duty/)). However, as the Claude Code official documentation points out, a critic told to find flaws will report something even if the work is sound. To avoid over-polishing, ask for only issues related to accuracy and the requirements you set.

```text
Polish stage 1 to product quality. Use docs/style.md and images in refs/ as the standard.
1. Implement → take screenshots
2. Have a different subagent compare to the standard and list 5 ways it falls short. Only list difference from the standard, not preferences.
3. Fix
Repeat this 3 times, then report the remaining issues.
```

## Phase 3 Spec

- Goal: Document the working code. This becomes the "ground truth" for later work.
- Human tasks: Decide the intent and completion conditions
- Agent tasks: Draft the spec from the current code
- Completion criteria: Spec and implementation match, with completion conditions per feature

Starting from working code and writing the spec later results in fewer rework cycles than writing a long spec first. See [Spec-driven development](/en/agent-dev/spec-driven/) for the format and template.

```text
Read the current implementation and create a draft SPEC.md.
- Only write what the implementation confirms. Clearly mark anything you infer as "inferred"
- For each feature, include how to verify it (command, screenshot, or playing)
- If you find behavior that the spec does not cover, list it separately
```

## Phase 4 Iteration

- Goal: Add features and adjust in small loops
- Human tasks: Play and decide; write the next instruction. Communicate game feel in numbers.
- Agent tasks: Implement features, add tests, fix bugs
- Completion criteria: One feature per commit, completion conditions met and committed

The loop has three rules.

1. One feature is one commit. Commit your changes before making a request.
2. Keep tightly coupled code in one request and one owner. In Claude of Duty, splitting ownership over coupled code broke assumptions and increased bugs. When work stayed sequential, bugs decreased. Only separate, independent work runs in parallel. (See [Parallel agents](/en/agent-dev/parallel-agents/))
3. For work that takes time, set an end condition. Claude Code has a `/goal` command that continues work until the condition is met, and evaluates completion with a different model per turn ([Keep Claude working toward a goal](https://code.claude.com/docs/en/goal), as of September 2026).

```text
/goal All items in TODO.md under "Stage 2" are complete, npm test and npm run build pass,
and screenshots from tools/shot.mjs are saved in shots/stage2/. Or stop after 20 turns.
```

## Phase 5 Quality

- Goal: Make it stable, fast, and accessible to everyone
- Human tasks: Set pass/fail standards. Play on your own hardware.
- Agent tasks: Add tests, measure performance, fix bugs
- Completion criteria: Agreed-upon standards are confirmed with a single command

| Area | What to do | Reference |
|---|---|---|
| Logic testing | Write tests for math, progression, saving. Use fixed seeds for deterministic results. | [AI-driven development workflow](/en/dev-env/ai-workflow/) |
| Screen regression | Take screenshots of fixed scenes and compare changes | Below |
| Performance | Measure median, lower percentiles, and worst-case frame time, not just median | Below |
| Accessibility | Remappable controls, captions, per-stream volume adjustment, design that does not rely on color alone | Below |
| Validation flow | Combine tests and screenshots into a single command | [Verification loop](/en/agent-dev/verification-loop/) |

Claude of Duty left three lessons (README, as of September 2026).

- Median frame time hid problems. Fixed-camera measurement showed 94 fps, but actual play had pauses over 1 second. A frame-time distribution script found the cause (shader lazy compilation).
- Recording needed reproducibility. Leftover state from the previous scene changed the result of the same input, so each scene was reset from a fresh page. After this, image diffs worked as a check for "not moving".
- Random numbers come from a fixed function. ARCHITECTURE.md had a rule: do not use `Math.random()` in game logic or visuals. This is for reproducibility.

The baseline for accessibility is Game Accessibility Guidelines Basic items ([Basic](https://gameaccessibilityguidelines.com/basic/)). Remappable controls, captions, per-stream volume (effects, voice, BGM), no color-only information, readable initial text size, and others. You can hand these to an agent to list, implement, and verify.

```text
Create tools/profile.mjs. Run actual operations (script) for 60 seconds.
Output the median, 95th percentile, 99th percentile, and worst-case frame time.
Do not judge by median alone. List all frames over 100ms with their timestamps and causes.
```

## Phase 6 Release prep

- Goal: Format for distribution and store
- Human tasks: Write store copy, set price, decide on AI disclosure
- Agent tasks: Build, export assets, list licenses of dependencies, draft copy
- Completion criteria: Distribution files, store assets, and disclosures are ready

To release a browser game on itch.io, upload a ZIP containing `index.html`. After extraction, the maximum is 1,000 files, 500MB total, 200MB per file, and all references must be relative paths ([itch.io Docs](https://itch.io/docs/creators/html5), as of September 2026).
Steam content survey asks you to disclose AI-generated content by separating pre-generated from in-game generation ([Steamworks](https://partner.steamgames.com/doc/gettingstarted/contentsurvey), as of September 2026). Keep the [one-shot record](#repository-and-history-handling) so you can trace where you used AI.
For choice of store, see [Choosing a platform](/en/monetization/platforms/), and [wishlists](/en/monetization/wishlists/). For trailers, see [Trailer structure](/en/trailer/structure/) and [Steam trailer](/en/trailer/steam-trailer/). For terms, see [AI policies on platforms](/en/legal/platform-policies/) and [Copyright for AI-generated assets](/en/legal/copyright/).

```text
Create npm run release:check to build for distribution and verify:
- dist/ has index.html, file count is 1,000 or less, total is 500MB or less
- No absolute-path references
- Output a list of dependencies and their licenses to LICENSES.md
```

## Phase 7 Operations

- Goal: Run post-release updates in a set flow
- Human tasks: Decide what to fix and what not to. Talk with players.
- Agent tasks: Reproduce reports, fix bugs, draft release notes, watch CI
- Completion criteria: Flow from bug report to fix is established

One report per issue. Have the agent write a test to reproduce it. You can use Claude Code `/loop` to check CI results at intervals and have it fix failures ([Run prompts on a schedule](https://code.claude.com/docs/en/scheduled-tasks), as of September 2026).

## Criteria for deciding to discard and rebuild

| When you see | Decision |
|---|---|
| Same bug fixed twice and still not fixed | Reset conversation, retry with a more specific prompt informed by what you learned (official documentation recommends this) |
| One change ripples to multiple unexpected files | Coupling is too tight. Consolidate that part under one owner, review the structure. |
| No way to verify if it is broken | Build verification first. If you cannot, rebuild. |
| Neither you nor the agent can explain the structure | Create a map (ARCHITECTURE.md). If you cannot, rebuild. |
| You want to change the core loop itself | Spec changes before code. Work on a separate branch, start over from vertical slice. |
| Root cause of performance is in the design | Redesign that part. |

Rollback options, from lightest to heaviest:

1. `/rewind` (reset conversation and code to a prior point)
2. Git: revert the commit
3. Rewrite the module
4. Bring in spec, tests, style guide, rebuild from scratch

`/rewind` restores only files Claude directly edited. Changes from Bash commands and subagents cannot be undone. Keep using Git as a permanent record ([Checkpointing](https://code.claude.com/docs/en/checkpointing), as of September 2026).
Someone else used the same prompt to rebuild a different shooter ([Decrypt](https://decrypt.co/374560/dumbest-ai-prompt-claude-beat-careful-game-design)).

Rebuild discards only the code. Bring spec, prompts, tests, validation scripts, style guide, and decision records to the next iteration.

## Repository and history handling

```text
mygame/
  CLAUDE.md            # Instructions for agents (AGENTS.md is also fine)
  SPEC.md              # Spec
  TODO.md              # Work list
  docs/
    oneshot.md         # One-shot prompt, model, date
    style.md           # Style guide
    decisions/         # Decision log (including why things were discarded)
  src/
  tools/               # shot.mjs, playtest.mjs, profile.mjs
  tests/
  shots/               # Screenshots (Git LFS or .gitignore)
```

- main always builds successfully. Experiments use branches in `exp/`, and only adopted work is merged in.
- Tag `oneshot-v0` right after one-shot, and `vertical-slice` when vertical slice is done.
- To try multiple approaches in parallel, use Git worktrees ([worktrees](https://code.claude.com/docs/en/worktrees)).
- Large binaries are managed with Git LFS ([AI-driven development workflow](/en/dev-env/ai-workflow/)).
- If you decide to discard, write one line in `docs/decisions/` explaining why. The next agent will not repeat the same mistake.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: "Crownlands" developer's retrospective on 100% AI development. Define the experience → discuss core rules and exceptions first → make small changes → verify appearance, behavior, and multiplayer → fix and check the release version. Repeat. (Author's report; [source](https://www.reddit.com/r/gamedev/comments/1wxd42m/building_crownlands_100_with_ai_what_ive_learned_along_the_way/))
- **2026-10-01**: Porting three Cocos2d-x mobile RPGs (around 190,000 lines each, nearly 200,000 all three) to Unreal Engine 5.8 using Claude (Fable 5 / Opus 5) with a compatibility layer. First took 16 days to release, second 5 days, third 3 days. Used automated testing and adb/Appium device control combined. ([source](https://zenn.dev/kiarina/articles/2026-10-01-cocos2dx-to-unreal) (in Japanese), [case study explanation](/en/cases/port-cocos2dx-to-ue5/))
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — Verification methods, planning, conversation reset, using a critic
- [Keep Claude working toward a goal](https://code.claude.com/docs/en/goal) — How `/goal` works and evaluation
- [Run prompts on a schedule](https://code.claude.com/docs/en/scheduled-tasks) — Using `/loop` for recurring runs
- [Checkpointing](https://code.claude.com/docs/en/checkpointing) — What `/rewind` covers and its limits
- [Claude of Duty (GitHub)](https://github.com/mshumer/Claude-of-Duty) — Comparison of parallel vs. sequential, performance measurement insights
- [Decrypt: The Dumbest-Looking AI Prompt Just Beat Months of Careful Game-Design Prompt Engineering](https://decrypt.co/374560/dumbest-ai-prompt-claude-beat-careful-game-design) — Time and tokens for retries
- [Game Accessibility Guidelines: Basic](https://gameaccessibilityguidelines.com/basic/) — Accessibility baseline
- [itch.io: Uploading HTML5 games](https://itch.io/docs/creators/html5) — Distribution format and limits for browser games
- [Steamworks: Content survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey) — How to disclose AI-generated content
