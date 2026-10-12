---
title: Context management for long-term projects
description: This article explains what happens when context becomes full, how to split sessions, progress files and decision logs, context compaction, file splitting, git checkpoints, and how to use subagents, based on Claude Code's official documentation.
sidebar:
  order: 8
lastUpdated: 2026-10-12
---

## Overview

- Context is all the information an agent can "see" in one work session. It includes conversation history, files read, command output, and instruction files. As context fills up, the agent's accuracy drops, so in long game development projects, managing context becomes part of quality management.
- This article covers what happens when context becomes full, units for splitting sessions, progress files (`PROGRESS.md`) and decision logs, how to use context compaction, why to avoid large files, how to use git commits as checkpoints, and how to use subagents.
- The explanations of behavior are based on Claude Code's official documentation (as of September 2026). The concepts also apply to other agents, but the command names are those of Claude Code.

## What happens when context becomes full

Claude Code's official guide explains that many best practices come from the constraint that "context fills up quickly and accuracy drops as it fills" ([Best practices](https://code.claude.com/docs/en/best-practices)).

When the window approaches its limit, the system automatically compacts (compresses). It first removes output from older tools, then summarizes the conversation if needed. The original request and important code remain, but detailed early instructions can be lost ([How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)). If a single file or output is so large that it fills up again immediately after each summary, the automatic compaction eventually stops and returns an error.

The window size varies by model. Sonnet 5 series, Fable series, and Opus 4.7 and later (Anthropic API) have a 1 million token window, and automatic compaction normally activates around 967,000 tokens ([Model configuration](https://code.claude.com/docs/en/model-config), as of September 2026). Even as the window grows larger, accuracy drops as it fills, so the management approach remains the same.

### What fills context quickly in game development

| Cause | Examples | Solution |
|---|---|---|
| Large files | 3,000-line `game.ts`, large `.tscn` | Split files (see below) |
| Logs and test output | Build logs, every-frame `console.log` | Run with a subagent, receive only the summary |
| Screenshots | Dozens taken for each verification | Reduce the number, crop to needed areas |
| Long trial-and-error | 10 or more fixes for a bug that will not resolve | Open a new session and start fresh |

Images use tokens based on size. The Anthropic documentation states that a 1920 x 1080 image uses about 1,560 tokens on standard-resolution models and about 2,691 tokens on high-resolution models like Claude 4.7 or later ([Vision](https://platform.claude.com/docs/en/build-with-claude/vision), as of September 2026). If you show 20 images in verification, it can use tens of thousands of tokens.

### Signs that context is becoming full

- You stop following conventions you decided earlier (for example, "numbers go in `tuning.ts`")
- A bug you fixed once comes back in a different form
- Files you did not ask to change get modified
- The same question comes up again

When you see these signs, have the agent write the situation to a progress file and start fresh in a new session.

## Units for splitting sessions

| Unit | When |
|---|---|
| One feature | Complete the specification, implementation, verification, and commit in one session |
| Unrelated work | Reset the conversation with `/clear` before starting |
| Implementation and review | Do them in separate sessions (fresh context). You tend to be lenient on code you wrote |
| Fixes that do not work | After two failed fixes, `/clear` and start with a new request that includes what you learned |
| Large features | Have the agent write a specification in `SPEC.md` in question form, then start implementation in a new session |

The official guide lists two common failure patterns: mixing unrelated work into one session (a "kitchen-sink session") and repeatedly retrying fixes that do not work. Sessions can be named with `/rename`, and resumed with `claude --continue` (most recent) or `claude --resume` (choose from a list).

## Progress files and decision logs

A new session does not remember the previous conversation. Handoff happens through files in the repository. Claude Code has automatic memory (notes Claude writes itself), but it is stored in `~/.claude/projects/` on your machine only and is not shared across machines or teams ([How Claude remembers your project](https://code.claude.com/docs/en/memory)). Manage project state with progress files kept in the repository.

```markdown
# PROGRESS.md

## Current status (2026-09-29)
- Complete: movement, automatic fire, 3 enemy types, wave management
- In progress: boss fight (docs/specs/boss.md). Phase 1 is implemented
- Next: phase 2, hit effects

## Changes to how the game runs
- Added 60 seconds of bot play to `npm run verify`

## Known issues
- Enemies over 80 cause p95 to exceed 30ms (see perf-notes.md)

## Recent commits
- (output of `git log --oneline -5` pasted here)
```

Keep decision logs in `docs/decisions/` with one file per decision.

```markdown
# Decision: Enemy AI uses a state machine (2026-09-20)
- Situation: up to 80 enemies simultaneous, 60 fps, one week to implement
- Options considered: state machine, behavior tree, pursuit + flocking
- Decision and reason: state machine. Easiest to debug and implement
- Review if: number of enemy types exceeds 10
```

A decision log prevents new sessions from relitigating the same discussion or implementing something that goes against a past decision.

At the start and end of a session, request it like this.

```text
(Start) Read PROGRESS.md and docs/decisions/, and state the current situation and next step in three lines. Do not make any changes yet.
(End) Reflect this session's work into PROGRESS.md. Write what is complete, what is in progress, what is next, and any known issues, and commit the change.
```

In the instruction file, write only one line: "Read PROGRESS.md at the start of work". Leave the content of progress out of the instruction file because it changes frequently ([How to write an instruction file](/en/agent-dev/project-instructions/)).

## Context compaction and summary techniques

| Action | What it does |
|---|---|
| `/compact instruction` | Compact and specify what to keep in the summary. Example: `/compact Keep the changes to enemy AI and the test run method` |
| "Compact Instructions" in the instruction file | Always keep certain content during compaction by writing it in the instruction file |
| `Esc` twice, or `/rewind` | Pick a point in the conversation and summarize from that point forward or back to that point |
| `/autocompact 500k` | Change the context size at which automatic compaction triggers |
| `/context` | Check current context usage |
| `/btw` | Ask a quick question without adding the answer to the conversation |

What remains after compaction depends on how things are read ([Explore the context window](https://code.claude.com/docs/en/context-window)).

| Content | After compaction |
|---|---|
| `CLAUDE.md` in the root, automatic memory | Reloaded from disk |
| `CLAUDE.md` in subdirectories, rules with `paths:` | Returns when you read the target file again |
| Read or edited files | Up to 5 recent ones re-read. Files over 5,000 tokens show only the path, not the contents |
| Instructions given in conversation | Not guaranteed to be included in the summary |

Instructions given only in conversation can be lost. Write instructions you want to keep in the instruction file or progress file.

If you want certain content recalled every time it compacts, use the `SessionStart` hook with `compact`. The command's standard output is added to context ([Hooks guide](https://code.claude.com/docs/en/hooks-guide)).

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          { "type": "command", "command": "head -n 40 PROGRESS.md" }
        ]
      }
    ]
  }
}
```

## File splitting and module boundaries

Large files take up context every time they are read. Furthermore, as shown in the table above, files over 5,000 tokens do not get their contents back after compaction. Aim for about 300 to 500 lines per file, with one responsibility. Line count is a guideline, but when a single file reaches thousands of lines, agent work efficiency and accuracy tend to drop.

Claude of Duty is a useful reference for deciding boundaries. It divided about 55,000 lines into 11 subsystems and defined subsystem interfaces, directory ownership, event names between systems, and shared types in `ARCHITECTURE.md`. Each agent edits only its own directory and does not import from other systems directly, instead retrieving them at runtime with calls like `ctx.get('fx')` ([README](https://github.com/mshumer/Claude-of-Duty), [ARCHITECTURE.md](https://github.com/mshumer/Claude-of-Duty/blob/main/ARCHITECTURE.md), as of September 2026).

Even for a small game, writing an `ARCHITECTURE.md` in the form below from the start gives you guidance for splitting.

```markdown
# ARCHITECTURE.md
## Systems and their directories
- player: src/player/  input, movement, hit reactions
- enemies: src/enemies/  types, AI, spawning
- ui: src/ui/  HUD, menus
## Rules
- Systems do not import each other directly. They communicate through events (src/events.ts).
- Each file should aim to stay under 400 lines. Split if it exceeds this.
## Events list
- enemy:killed { id, position }
- player:damaged { amount }
```

When splitting a file that has already grown large, `/goal` is useful. The official documentation lists "splitting large files until each one meets the line count limit" as an example use case ([Keep Claude working toward a goal](https://code.claude.com/docs/en/goal)).

```text
/goal Split src/game.ts into feature-based modules so every file under src/ is under 500 lines, `npm run verify` passes, and screenshot-comparison diff is 0. Stop at 20 turns.
```

In Godot, script and scene units form the module boundary. In Unity, asmdef units do.

## Using git commits as checkpoints

Claude Code has a checkpointing feature that saves files before edit and lets you rewind with `/rewind`. However, it has these limits ([Checkpointing](https://code.claude.com/docs/en/checkpointing)):

- Files changed by Bash (like with `rm`, `mv`, `cp`) are not tracked
- Edits by subagents usually cannot be rewound
- It is for quick recovery within a session, not a replacement for version control

So create undo points in git instead.

- Commit the current state before a large request
- Commit only after verification (tests and screenshots) passes. Make one feature one commit
- In the commit message, write what changed, why, and how you confirmed it. A new session reading `git log --oneline -20` should understand the history
- Tag before a large refactor (for example, `git tag before-split`)
- Try ideas on a separate branch. For parallel work, use git worktree ([Running multiple agents in parallel](/en/agent-dev/parallel-agents/))

If you write "commit only after verification" into your definition of done, the agent will create checkpoints on its own.

## Protecting context with subagents

Subagents run in a separate context and return only a summary when done. Use them for work with long output, like running tests or reading logs, and you protect the main context. The official documentation lists test runs, documentation retrieval, and log processing as high-output work ([Subagents](https://code.claude.com/docs/en/sub-agents), as of September 2026).

Define them as Markdown files in `.claude/agents/`.

```markdown
---
name: verify-runner
description: Run verification (`npm run verify`) and report only failures and screenshot findings
tools: Bash, Read
---

Run `npm run verify`.
Summarize successful items as "passed" in one line. Report only failures with error messages and file names.
Look at the screenshots saved in shots/ and report any UI cutoffs, overflow, or dark screens.
Do not return the full log.
```

When you use it, request it like "run verification with a subagent".

- Subagents do not receive conversation history. They receive the instruction file and the request text. Write all necessary context into the request.
- You can also use them for research. Request "look up the current structure of enemy AI with a subagent and summarize", and the files it reads do not go into the main context.
- You can use them to review work after implementation. Reviewing from a separate context instead of the implementation conversation makes it easier to catch oversights ([Prompt patterns](/en/agent-dev/prompt-patterns/)).
- Subagents consume tokens separately from the main agent. See [Cost management](/en/agent-dev/cost-management/) for fees.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-09**: A record of running agents on decompiling an FPS game for over three months and more than 500 billion tokens. It describes practices such as lowering the compaction threshold from 90% to 42%, having the agent re-read a document of goals and prohibitions via an hourly cron job, and tracking progress with GitHub Issues ([Source](https://momo5502.com/posts/2026-10-09-game-decompilation/)).
- **2026-09-29**: First version.
<!-- AUTO-UPDATE:END -->

## References

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — context management, `/clear`, subagents, failure patterns
- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) — automatic compaction behavior and "Compact Instructions"
- [Explore the context window](https://code.claude.com/docs/en/context-window) — what loads at startup and what remains after compaction
- [How Claude remembers your project](https://code.claude.com/docs/en/memory) — instruction files and automatic memory
- [Model configuration](https://code.claude.com/docs/en/model-config) — 1 million token window and automatic compaction threshold
- [Checkpointing](https://code.claude.com/docs/en/checkpointing) — `/rewind` and what changes are not tracked
- [Subagents](https://code.claude.com/docs/en/sub-agents) — defining subagents and separate context
- [Hooks guide](https://code.claude.com/docs/en/hooks-guide) — re-injecting context after compaction with hooks
- [Keep Claude working toward a goal](https://code.claude.com/docs/en/goal) — how to write `/goal` conditions
- [Vision (Claude API Docs)](https://platform.claude.com/docs/en/build-with-claude/vision) — image token count and resolution limits
- [Claude of Duty (GitHub)](https://github.com/mshumer/Claude-of-Duty) — subsystem splitting and `ARCHITECTURE.md` example
