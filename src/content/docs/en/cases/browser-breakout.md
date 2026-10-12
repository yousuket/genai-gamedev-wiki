---
title: claude-breakout-clone — A Breakout Game with Complete Specs, Plans, and Development Logs from Claude Code
description: A breakout clone where the real value lies not in the game itself but in the complete development records—specs, plans, TODOs, retrospectives, and full conversation logs—showing what comes after one-shot generation.
sidebar:
  order: 9
lastUpdated: 2026-09-29
---

## Overview

A Breakout game built with Phaser 3 by Les Orchard, created to show his colleagues how he uses Claude Code. The game itself is not innovative; the author notes, "The game is not particularly novel."

The value lies in the records. The repository contains an instruction file (CLAUDE.md), slash commands for each session, specifications, plans, TODOs, and retrospective notes for each session, and complete conversation logs with Claude. This is one of the rare cases where you can read exactly what is requested after one-shot generation and where debugging occurs.

| Item | Details |
|---|---|
| Author | Les Orchard |
| Release date | Committed on July 5, 2025 (initial commit); blog post published on July 10 |
| Model | Claude Opus 4; switched to Sonnet 4 after hitting the limit (visible in the multi-ball session logs, as of July 2025) |
| Tools/Agent | Claude Code (slash commands, CLAUDE.md). Phaser 3, TypeScript, Vite |
| Genre and scope | Breakout. About 4 hours of commit history, 47 commits. Includes power-ups (multi-ball) |
| Where to play | [Play](https://lmorchard.github.io/claude-breakout-clone/), [Repository](https://github.com/lmorchard/claude-breakout-clone) |

## What was built

- Seven rows of bricks at the top, a mouse-controlled paddle at the bottom, 20×20 ball, 3 lives, score, game over and clear screens, pause
- Internal resolution of 768×1024, scaled to fit browser size
- Configuration file (GameConfig.ts) consolidating speed, size, spacing, and other parameters
- As an added feature: a power-up drops 10% of the time when bricks are destroyed, and collecting it doubles the number of balls (balls bounce off each other too)

The author noted in their blog that the power-up addition was for "demonstrating iterative development"—made in a few hours on a Saturday afternoon while watching TV.

## Inside the prompts

The prompts are published in the repository. The structure is three layers.

### 1. Initial spec as a short bulleted description of the game rules

The spec opens with game rules—bricks, paddle, ball, lives, win or lose, score—written in plain language, line by line. It ends with "Use Phaser and Vite, write in TypeScript." Almost no jargon; the level of detail a person would give if explaining a game aloud.

### 2. Spec details by "asking me one question at a time"

The brainstorm slash command says (from `.claude/commands/session-02-brainstorm.md` in the repository):

> Ask me one question at a time so we can develop a thorough, step-by-step spec for this idea.

Claude asks one question at a time, the author answers with numbers, and the spec evolves. "Screen size?" "Brick dimensions and spacing?" "Ball speed and reflection angle based on where it hits?" The author answers: internal resolution 768×1024, ball 20×20 at 250 pixels per second, bricks 100×25 with 10-pixel spacing, and "all values go in the config file so we can tweak game feel later."

### 3. Plan and execution as commands

- The plan command takes the spec, breaks it into small iterations, then further into steps, and writes a series of code-generation prompts as a list in `plan.md`. The instruction says "do not leave code that is not used elsewhere"
- The execution command reads the plan, checks readiness, "always updates `todo.md` as you go," and commits at each stage
- The retrospective command writes a summary of what actually happened, deviations from the plan, lessons, improvements, and dialogue count into `notes.md`

CLAUDE.md also specifies where session files go (spec, plan, todo, notes in `docs/dev-sessions/date-slug/`). For more on instruction files, see [Project instruction files](/en/agent-dev/project-instructions/) and [Spec-driven development](/en/agent-dev/spec-driven/).

## How it progressed (agent workflow)

From the commit history (UTC) and session logs:

| Time | What happened |
|---|---|
| 17:58 | Initial commit, then "game idea braindump" and brainstorm |
| 18:36–19:10 | Execution following plan: foundation → structure → game objects → game logic → polish. Five commits over ~35 minutes, playable |
| 19:13–19:34 | Collision debugging: top wall bounce, passing through bottom, stuck ball. Final "reset to working state" commit |
| 19:55 | GitHub Pages deployment setup |
| 20:47–21:05 | Multi-ball spec, brainstorm, plan |
| 21:06–21:13 | Implementation (config, multiple balls, power-ups, spawning, multi-ball, debug keys) |
| 21:15–21:57 | About 40 minutes of debugging. Ball spawn position, stuck ball, type errors |

The same flow repeats for each feature (a new session is created per feature, with its own folder).

### Debugging visible in the logs

The multi-ball implementation shows a lengthy troubleshooting sequence in the logs:

1. Power-up does not appear. Fixed, but now a "striped box" (placeholder image) falls
2. New balls spawn at screen center, not near the original ball. Claude's debug log showed correct coordinates (near the original), but the author said "Log or no log, I see it appear at center." Claude replied "I believe what you see" and re-read the code
3. The author's question "Is the position set correctly on generation?" sparks the discovery: the spawn code calls `resetBall()` inside, which ignores the given coordinates and always places the ball at center
4. Next: balls spawned near bricks freeze. Adding collision avoidance does not help; the author clarifies "Do not avoid bricks—if the original ball is there, place it there anyway" (restating the intent)
5. Finally, the author says "Run `npm run build` and fix any issues," and a TypeScript error is found and fixed

## Results and limits

- Result: A working playable Breakout game and multi-ball feature, publicly released. The author writes that swapping ideas in and out "feels addictive"
- Time: The author writes "a few hours." The commit history spans about 4 hours
- Multi-ball implementation took ~8 minutes, but tuning behavior took ~40 minutes. Generation is fast; verifying "does it work as intended" and fixing it takes the majority of time
- The agent's debug logs sometimes disagreed with what the human saw on screen. The log values looked right, but the bug (coordinates being overwritten) was found through human observation and questions
- The author was working in a narrow scope for demonstration purposes, with no playtester feedback or recorded metrics
- Models used are from July 2025. The logs show a mid-session switch when the context limit was reached

## What you can learn

### If you try it yourself

- You can start with just a few lines: a bulleted list of game rules. No jargon, no detailed design
- Asking "one question at a time" draws out numbers and edge cases (like how to count lives) you may not have decided yourself
- The repository's slash commands can be copied directly into your own project. Just splitting brainstorm, plan, execute, and retrospective into separate commands gives structure to the AI's work
- Keeping spec, plan, TODO, notes in per-session folders lets you revisit them later. This is a good example of [context management](/en/agent-dev/context-management/)

### If you want to add uniqueness after one-shot

- This case has no novel game design. What it shows is the method for adding custom features. Write the rules in text (power-ups, ball doubling), expose them as config values, run it, and refine
- The author set a single decision principle—"multi-ball bounces like bricks and paddle"—to reduce guessing
- Undefined moments (what counts as a "life" with multiple balls) are decided in conversation and then written back into the spec
- As you progress, your unique rules accumulate in the spec. This is where you layer in creativity. For general workflows, see [From one-shot to product](/en/agent-dev/from-one-shot-to-product/) and [Adding uniqueness](/en/agent-dev/differentiation/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Building a Breakout clone with Claude (author's blog)](https://blog.lmorchard.com/2025/07/10/breakout-with-claude/) — Introduction by the author, goals and time spent
- [claude-breakout-clone (GitHub)](https://github.com/lmorchard/claude-breakout-clone) — Source code, CLAUDE.md, `.claude/commands`, `docs/dev-sessions` (specs, plans, notes, logs)
- [Multi-ball session record](https://github.com/lmorchard/claude-breakout-clone/tree/main/docs/dev-sessions/2025-07-05-1336-multiball) — Complete specs, plans, notes, conversation logs
- [session-02-brainstorm.md](https://github.com/lmorchard/claude-breakout-clone/blob/main/.claude/commands/session-02-brainstorm.md) — Brainstorm command for "ask one question at a time"
- [Play (GitHub Pages)](https://lmorchard.github.io/claude-breakout-clone/) — The released game
