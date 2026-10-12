---
title: Prompt Patterns for Game Development
description: Reusable prompt patterns for different game development scenarios—from one-shot generation to feature additions, bug fixes, visuals, balancing, performance, testing, and reviews—with examples of common mistakes and best practices.
sidebar:
  order: 6
lastUpdated: 2026-09-29
---

## Overview

- This article presents "patterns" for requests to coding agents by scenario. Ten types are covered: one-shot generation, feature additions, bug fixes, visual adjustments, balancing, refactoring, performance improvements, test creation, code review, and consultation before deciding on a direction.
- What is common to all patterns is writing the purpose, scope, constraints, and verification method. Because agents stop working as soon as something "appears to work," the result changes significantly depending on whether you provide a verification method.
- The prompts in this article are examples written for this Wiki. Replace the proper nouns and numbers to fit your project.
- Prerequisites that are the same each time (commands, conventions) are moved to [project instruction files](/en/agent-dev/project-instructions/), and verification workflows are set up in [verification loops](/en/agent-dev/verification-loop/).

## Basics of requests

Claude Code official best practices recommend providing specific file targets, referencing existing patterns, and describing symptoms to reduce revision rounds when instructions are precise ([Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), as of September 2026). In game development, paying attention to the following five points each time makes it easier to create patterns.

| Element | What to write | Example |
|---|---|---|
| Purpose | What experience or result you want to achieve | Want the player to feel a sense of urgency when enemies approach |
| Scope | Where to make changes and where not to touch | Only `src/enemies/` and `tuning.ts`. Do not touch scene definitions |
| Constraints | Technology, numbers, performance, dependencies | No additional libraries. Maintain 60fps |
| Verification method | Execution command, screen to check, tests | `npm run verify` passes. Check with a screenshot |
| Completion condition | When the work is done | 5 enemies at once with no errors. HUD does not overlap |

The same official guide explains that when you provide verification means (tests, builds, screenshot comparisons), the agent can read the results and run the correction loop on its own.

## Bad examples and good examples

| Scenario | Bad example | Good example |
|---|---|---|
| Game feel | Make jumping feel good | Set jump air time to 0.55 seconds and apex to 3.2 blocks. Place the values in `player.jump` in `tuning.ts` |
| Balancing | Enemies are too weak, make them stronger | Simulation of Stage 3 clear rate shows 80%. Target is 50%. Suggest 3 options with numbers for changing enemy HP or spawn interval before making changes |
| Bug | Does not work, fix it | Write three things: reproduction steps, output log, and expected behavior (see below) |
| Visuals | Make it cooler | Attach a reference image and specify differences like "HUD padding to 8px" and "screen edges turn red for 0.2 seconds on hit" |
| Performance | It is slow, make it faster | Combat scene p95 is 40ms. Target is under 20ms. Measure with `npm run perf`. Do not change visuals |

The common point in bad examples is that the agent cannot determine on its own whether something is "fixed." Good examples always include either a number or a verification command.

## Request size

| Size | Guideline | How to proceed |
|---|---|---|
| Small | Difference can be described in one sentence. 1-2 files | Request directly without planning |
| Medium | One feature. Multiple files involved | First get a plan and confirm it before implementation. Make one feature one commit |
| Large | Multiple features, new subsystem | Split into specification, implement each feature in a separate session |

The official guide also has a guideline along the lines of "skip planning if the difference can be explained in one sentence." For large features, ask the agent questions to write the specification (`SPEC.md`), and start implementation in a new session. For handling long conversations, see [Context management for long-term projects](/en/agent-dev/context-management/).

## Have the agent clarify prerequisites and constraints first

Rather than having the code written immediately after the request, have the agent output assumptions first to eliminate misunderstandings before implementation.

```text
Before implementing, answer the following in bullet points. Do not write code yet.
1. Files to change and files not to change
2. Assumptions you are making (do not guess unclear points; ask questions)
3. Existing patterns to match (example: how existing enemy classes are structured)
4. How to verify completion (command to run, screen to check)
Ask all questions together with options if you have any.
```

For large features, you can also have the agent ask you questions.

```text
I want to create a dash feature. Before implementing, ask me questions.
Focus on non-obvious parts about game feel, how it relates to existing dodge, edge cases,
and visual effects. Once you finish asking, summarize your findings in docs/specs/dash.md.
```

Claude Code also has a "plan mode" (toggle with `Shift+Tab`) to create only plans without implementation.

## Patterns by scenario

### 1. One-shot generation

Pattern: Divide into four blocks: game concept, how to proceed, verification setup, and quality approach.

```text
Create a top-down wave survival game playable in the browser using Three.js and TypeScript (Vite).

# Game
- 3 to 5 minutes per play. Player only moves; weapon fires automatically. Enemies advance in waves. Game over when HP reaches 0.
- Do not use image or audio files. Visuals are shapes; sound effects are generated with Web Audio.

# How to proceed
- First write the specification and completion conditions in docs/SPEC.md, then implement.
- Consolidate all numbers (speed, HP, spawn interval) in src/tuning.ts.
- Use a custom function that takes a seed for random numbers; do not use Math.random().

# Verification setup
- When appending ?debug=1&seed=N to the URL, you can read the game state in window.__game.
- npm run verify launches a headless browser, runs 60 seconds of bot play, saves screenshots, and confirms zero console errors.
- Correct until verify passes before reporting.

# Quality
- After completion, ask a sub-agent to review by comparing with target images in docs/reference/ and fix 3 of the issues it points out.
```

The original prompt for Claude of Duty centers on three points: a Call of Duty-level goal, instructions to delegate to sub-agents for each element, and strict feedback comparing against actual games ([prompt.md](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md), as of September 2026). The example above reproduces this framework with explicit verification setup for easier reuse. For actual one-shot results and how to proceed afterward, see [One-shot generation in practice](/en/agent-dev/one-shot/) and [Case study: Claude of Duty](/en/cases/claude-of-duty/).

### 2. Feature addition

Pattern: Point to a similar existing feature, write the scope, and completion conditions.

```text
Add a dash feature.
- Create it with the same structure as the existing "dodge" (src/player/dodge.ts). Add the state to PlayerState.
- Activated with Shift. Moves 3 blocks in 0.2 seconds; cooldown is 1.5 seconds. Place numbers in player.dash in tuning.ts.
- Player takes no collision damage while dashing.
- Only modify src/player/ and tuning.ts.
- Completion conditions: unit tests for cooldown and invincibility pass; npm run verify passes.
```

### 3. Bug fix

Pattern: Use the three-point set of reproduction steps, actual behavior and log, and expected behavior, plus "first write a test to reproduce."

```text
Fix a bug.
Reproduction steps: On Stage 2, defeat 10 or more enemies, then pause and resume.
Actual behavior: Enemies stop moving. The following error appears in the console:
  TypeError: Cannot read properties of undefined (reading 'position') at Spawner.update (spawner.ts:88)
Expected behavior: Enemies continue moving after resuming.
First write a failing test that reproduces this issue, then fix it to make the test pass.
Fix the root cause; do not hide the error with try/catch or similar.
```

### 4. Visual adjustment

Pattern: Provide a reference image, specify the "differences" by number and location, and have them verify with a screenshot.

```text
Bring it closer to the attached reference image. The differences are:
1. Move the HUD HP bar to the top left with 16px padding from the screen edge.
2. When hit, make the screen corners flash red for 0.2 seconds (max opacity 0.4).
3. Unify enemy color to #d94f4f.
Take a screenshot with npm run shot after each change, compare with the reference image,
and report any remaining differences in bullet points.
```

### 5. Balancing

Pattern: Provide the target number, how to measure, and which parameters can be changed. For detailed steps, see [Balancing](/en/design/balancing/).

```text
Stage 3 is too difficult. The goal is "clear rate around 50% on first try."
- Measurement: Judge by the result of npm run sim -- --stage 3 --runs 2000 --seed 1 (clearRate). Currently 0.18.
- Can change: Only enemy.hp and spawn.interval in src/tuning.ts.
- Cannot change: Player performance, other stages.
First suggest 3 options with predicted clearRate, actually measure all 3, and report the results in a table. I will decide which to adopt.
```

### 6. Refactoring

Pattern: Decide on fixed verification means first (tests, screenshot comparison) to ensure behavior does not change.

```text
Split src/game.ts (1,800 lines).
- Do not change behavior at all. npm run verify output and screenshots must match before and after splitting.
- Split units: "input," "spawn," "collision," "HUD." Target 400 lines or less per file.
- Commit one module at a time; pass verify on each commit.
- Do not add new features or rename things.
```

### 7. Performance improvement

Pattern: Provide measurement method and target values together with the condition "do not change visuals."

```text
Reduce stuttering in the combat scene.
- Measurement: npm run perf (outputs frame time p50 / p95 / p99 and worst frame).
- Current: p95 is 42ms, worst frame is 310ms. Target: p95 under 20ms, worst frame under 50ms.
- Do not judge by average FPS alone. First identify the cause of the worst frame with code evidence.
- Do not change visuals. Keep screenshot diff (npm run imagediff) at zero difference.
```

### 8. Test creation

Pattern: Specify what to test and from which angle; specify what to avoid (heavy mocking, etc.).

```text
Write tests for src/combat/damage.ts.
- Angles: When defense exceeds attack, critical hits, damage minimum (1), rounding of fractions.
- Expected values come from the specification (docs/specs/combat.md). Do not use the current code output as the expected value.
- Do not use mocks; call the actual functions.
- Verify that the tests you wrote can actually fail by temporarily breaking the implementation to show it fails.
```

### 9. Code review request

Pattern: Have a review done by a separate, fresh context to narrow down feedback criteria. The official guide describes showing the diff to a sub-agent separate from the conversation that did the implementation. However, fixing all feedback unconditionally can lead to over-engineering.

```text
In a sub-agent, review the recent commit diff against docs/specs/dash.md.
Look at three things: unimplemented features, branches without tests, and changes outside the specification scope.
Do not report style preferences (naming, how things are written). Report findings with file, line, and a suggested fix.
```

### 10. Consultation before deciding on direction

Pattern: Do not have them implement; have them output options and decision criteria.

```text
I want to consult on the enemy AI implementation approach. Do not write code yet.
Constraints: Maximum 80 simultaneous, 60fps in browser, implement in one week or less.
Compare 3 approaches—"state machine," "behavior tree," "simple chase with flock avoidance"—in a table using implementation effort, gameplay interest, debugging ease, and fit to these constraints. Pick one recommendation.
Write the reasoning for your choice and conditions under which it could fail.
```

## When things do not work out

- If the same feedback does not get fixed after two tries, failed attempts are accumulating in the conversation. The official guide recommends clearing the conversation and starting fresh with a new request that incorporates what you learned.
- If you find yourself writing the same reminder repeatedly, move it to the [instruction file](/en/agent-dev/project-instructions/).
- For feedback that cannot be stated in numbers, like game feel, use the process in [Nailing down game feel with your agent](/en/agent-dev/game-feel/) to convert words into numbers before requesting.
- For actual prompts used with different models, see [Case studies by model](/en/cases/prompts-by-model/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — Writing specific instructions, how to provide verification means, separating planning and implementation, separating review
- [Claude of Duty: prompt.md](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md) — Original prompt used for one-shot generation
- [Claude of Duty (GitHub)](https://github.com/mshumer/Claude-of-Duty) — Repository and README
