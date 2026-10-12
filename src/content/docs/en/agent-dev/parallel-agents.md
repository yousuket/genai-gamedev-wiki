---
title: Subagents and Parallel Development
description: Learn about subagents, git worktrees, and agent teams—their mechanisms, when to use each, Claude of Duty's module organization and critic setup, and how to manage conflicts, merging, and costs.
sidebar:
  order: 11
lastUpdated: 2026-09-29
---

## Overview

Coding agents can do more than just run one task in a single conversation.
You can divide the work among multiple agents and run them simultaneously.
This article explains the differences among Claude Code's parallel execution tools (subagents, git worktrees, agent teams, and others), how to divide work by module, the configuration that Claude of Duty publishes, how to manage conflicts and merging, when not to parallelize, and the impact on costs.
See [Claude of Duty case study](/en/cases/claude-of-duty/) for the full picture of Claude of Duty, and [One-shot generation techniques](/en/agent-dev/one-shot/) for the one-shot thinking method.

## Tools for parallel execution

As of September 2026, Claude Code's official documentation organizes methods for running multiple tasks at once as follows:

| Tool | What it does | When to use |
|---|---|---|
| Subagents | Within one session, a separate worker runs in an independent context and returns only a summary | For research and test runs that produce large outputs and should not clutter the main conversation |
| git worktree | Create a separate working directory and branch of the same repository, isolating file edits per session | When you want to avoid multiple sessions touching the same files |
| Agent view (`claude agents`) | Assign independent tasks to background sessions, monitor progress from one screen. Research preview | When you have several related tasks to delegate and want to check them later |
| Agent teams | A leader assigns work to multiple sessions and coordinates them using a shared task list and messages. Experimental feature, disabled by default | When you want to split the project and have workers coordinate with each other |
| Dynamic workflows | A script written by Claude runs many subagents, and they verify results against each other | For audits or migrations needing dozens to hundreds of agents. Claude Code's `ultracode` setting also uses this |
| `/batch` | Split a large change into 5 to 30 subagents, each isolated by worktree | For mechanical changes spanning many files |

Sources: [Run agents in parallel](https://code.claude.com/docs/en/agents), [Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows), [Model configuration](https://code.claude.com/docs/en/model-config)

According to the same documentation, the key to choosing among them is "who adjusts the overall work", "do workers need to talk to each other", and "will they touch the same files". If they will touch the same files, isolate them by worktree.
Agent teams do not isolate by worktree, so you must divide the files they work on beforehand.

## How subagents work

A subagent is a worker with its own context window, system prompt, available tools, and permissions.
Progress during the task does not flow back to your main conversation—only the final summary returns.
However, requests from the subagent itself consume the same usage quota.

The main specifications written in the documentation are as follows (as of September 2026, [Create custom subagents](https://code.claude.com/docs/en/sub-agents)):

- Built-in subagents include Explore (read-only exploration), Plan (planning research), and general-purpose (both research and editing)
- Custom subagents you create are placed in `.claude/agents/` as Markdown files (YAML config at the top)
- The default concurrent limit is 20. The default depth (how many stages of subagents calling subagents) is 3
- Configuration options include `model` (which model to use) and `isolation: worktree` (run in a dedicated worktree)

### Example: a subagent with a module responsibility

A subagent responsible for audio. This example was written for this article and assumes it only touches `src/audio/`:

```markdown
---
name: audio-owner
description: Handles src/audio/ only, writing synthesis code for sound effects and BGM. Do not edit other directories
tools: Read, Edit, Write, Glob, Grep, Bash
model: sonnet
isolation: worktree
---

You are the owner of src/audio/.
- Read docs/ARCHITECTURE.md first and follow the interface and event names
- Do not edit files outside src/audio/. Write any necessary changes in your report to the parent
- Completion condition: npm run build succeeds, npm test succeeds
- When done, report the files you changed and any events you added in a bulleted list
```

A critic for visual quality has no code editing, only screenshot taking and viewing:

```markdown
---
name: visual-critic
description: Views screenshots and scores visual quality on 10 points strictly. Do not edit code
tools: Read, Glob, Bash
model: opus
---

You are a strict critic. Run npm run shot to take screenshots and review the images.
- Write only the flaws, not the strengths (location, symptom, how it appears)
- Sort flaws into "critical", "medium", "minor", reporting at most five of the critical ones
- Give one score out of 10 at the end
```

## Claude of Duty's organization

Claude of Duty is an FPS in Three.js that Matt Shumer published on July 25, 2026. The repository is MIT licensed; the README says it was written by "about 55,000 lines, 11 subsystems, orchestrated by a team of AI agents". News reports say the model used was Claude Opus 5 ([Digital Today](https://www.digitaltoday.co.kr/en/view/86733/three-paragraph-prompt-enough-claude-opus-5-builds-fps-game-two-days-after-launch)).

### The prompt was three paragraphs

The repository's `prompt.md` is published as "the full text of the prompt that created this repository". It has three parts (summary):

1. Make an FPS in Three.js with the latest Call of Duty level of looks and quality
2. Deploy subagents to own each area, and have another subagent check the visuals
3. The checker is a strict critic, and repeat until a blind comparison with real Call of Duty wins

The prompt gives little detail on structure. The breakdown into 11 subsystems appears in the design document (`ARCHITECTURE.md`) described below.

### The design document was the only adjustment mechanism

`ARCHITECTURE.md` opens with "All agents must read this before writing code. It is the only adjustment mechanism." It lays out concrete rules for safe parallel work—rules you can adapt to your own projects.

| Rule (summary) | Purpose |
|---|---|
| Own only your directory; do not edit outside it | Do not overwrite another worker's changes |
| Do not directly import other subsystems; fetch them at runtime with `ctx.get('fx')` | Decouple modules, make parallel work safe |
| Do not add new npm dependencies (only `three`) | Prevent dependency sprawl |
| For game and rendering randomness, use a seeded shared random | Reproduction of shots |
| Do not allocate memory per frame | Prevent performance degradation |
| After changes, `npm run build` must pass, and the shot tool must capture one frame | Broken builds block everyone |

Additionally, it defines a table of directory ownership per subsystem, a list of event names and their contents between subsystems, and shared types (surface kinds). Shared parts (`src/core/`, `src/main.js`, `tools/`, etc.) are edited only by the overall owner.

### How critics were used

According to the README, 11 independent critics scored the screen against Call of Duty.
Scores progressed as 3.59, 4.14, 4.05, 5.05 (out of 10), and "pick the real Call of Duty" never changed.
The author themselves say "the goal was not reached".

The README also logs a case where a critic was wrong.
Over three rounds, critics reported weapons as "no texture".
The actual problem was too-strong specularity and weak diffuse reflection.
Earlier rounds had answered criticism about brightness by darkening the albedo (base color), making things worse.
The agent that found the root cause made the opposite fix from what was asked.
You need a step that checks numbers, not just trusting the critic.

### Parallel was less effective than sequential

The README's "Process Notes" report this result on parallel deployment:

| Method | Score change | Critical defects |
|---|---|---|
| 3 rounds of parallel: 6 agents each owning a directory | +0.46 | 60 → 47 → 66 (more than start) |
| One sequential pass: one owner per tightly-coupled concern | +1.00 | 66 → 26 |

The reason: tone mapping (brightness remapping), sky, and indirect light are one coupled system, and independent agents kept breaking each other's assumptions.
The author's conclusion: "sequential with one owner per concern clearly beat parallel deployment."

From that result, we can infer that division should be by "coupling strength", not "directory".
The table shows why: defects grew in rendering, which is tightly coupled. Sound, UI, and physics, with clear boundaries, suited parallel work. Color tone, lighting, and shadows, which affect each other, were more stable one-owner and sequential.

## A hands-on example

A procedure to recreate this at small scale in your own browser game. Three modules (audio, UI, enemies) developed in parallel:

### 1. Write the design document first

Create `docs/ARCHITECTURE.md`. At minimum:

```markdown
# Architecture (all agents read this first)

## Ownership
| Module | Directory | What ownership can edit |
|---|---|---|
| audio | src/audio/ | This directory only |
| ui | src/ui/ | This directory only |
| enemy | src/enemy/ | This directory only |
Shared (owner only): src/core/, src/main.js, package.json, docs/

## Interface
- Each module exports a class with init(ctx) and update(dt)
- Other modules fetch it at runtime with ctx.get('audio') (do not import)

## Events (add rows when you add new ones)
| Name | Contents | Source |
|---|---|---|
| enemy:died | { position, score } | enemy |
| player:hit | { damage } | core |

## Rules
- Do not add new npm dependencies
- Changes that break npm run build or npm test are not done
```

### 2. The parent creates the foundation before splitting modules

The shared foundation (`ctx`, events, `main.js`) is created and committed by the parent first.
If you start parallel without a foundation, each agent will start building its own.

### 3. Run them in parallel

An example prompt for delegating to subagents:

```text
Read docs/ARCHITECTURE.md and have three separate subagents (isolated by worktree) own the audio, ui, and enemy modules.
- Each one edits only its directory
- Completion: npm run build and npm test pass
- Run at most three subagents in parallel
- When all finish, the parent merges them one by one, running tests each time
```

To split sessions yourself, use worktrees ([Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees)):

```bash
claude --worktree audio   # Creates a worktree and worktree-audio branch in .claude/worktrees/audio/
claude --worktree ui      # In another terminal, another
```

A worktree is a fresh checkout, so each needs `npm install`. To carry over files outside git like `.env`, use `.worktreeinclude`.
Add `.claude/worktrees/` to `.gitignore`.
Without Claude Code, use `git worktree add ../game-audio -b feat/audio` ([git worktree](https://git-scm.com/docs/git-worktree)).

Running dev servers in parallel causes port collisions. Vite automatically tries the next port if one is in use, so have the agent output which port is running, or fix the port per worktree ([Server Options](https://vite.dev/config/server-options)).
The incident.io article also lists databases and ports as the pain points in parallelization ([incident.io](https://incident.io/blog/shipping-faster-with-claude-code-and-git-worktrees)).

## Managing conflicts and merging

Conflicts most often hit places everyone touches.

| Conflict-prone places | How to avoid |
|---|---|
| Module registration in `main.js` etc. | Parent edits only. Workers report "registration needed" |
| `package.json` and lock files | Ban adding dependencies. Parent adds if needed |
| Event-name list, shared types | Design doc table—parent collects additions |
| Config-value files | Split config files per module |

The merging process:

1. Merge low-dependency modules first (audio, UI)
2. Each merge: build, test, and review one screenshot
3. On conflict: explain both changes' intent, then resolve. Always run tests after

Anthropic's Nicholas Carlini published an experiment running 16 agents in parallel to build a C compiler. Each agent wrote a lock file in `current_tasks/` and prevented collisions via git sync.
Merge conflicts happened often but agents resolved them, the report says.
For "one huge task" like Linux kernel compilation, everyone hit the same bug and overwrote each other's fixes.
The team split the verification range by pairing with a known correct compiler (GCC), reshaping work to parallelize ([Anthropic Engineering](https://www.anthropic.com/engineering/building-c-compiler)).

Cursor's article reports that peer agents using locks for coordination slowed 20 agents to the speed of 2 to 3, and did not work well.
Switching to a hierarchy (planner creates work, workers execute silently) worked better ([Cursor](https://cursor.com/blog/scaling-agents)).

## When not to parallelize

| Case | Why |
|---|---|
| Tight coupling like tone mapping and lighting | Claude of Duty: sequential beat parallel |
| Many people touching the same files | Overwrites happen. Carlini's experiment saw this |
| Design not yet settled | Each owner builds on different assumptions, collision later. Settle first with [spec-driven development](/en/agent-dev/spec-driven/) |
| Small task taking a few tool calls | Startup and summary cost is bigger. Anthropic says delegation adds cost and time for small tasks on Opus 5 |
| Tuning game feel | The phase where a human plays and judges does not speed up in parallel. See [Game feel](/en/agent-dev/game-feel/) |
| No verification method | Workers just say "done", breaks at merge. Build [verification loop](/en/agent-dev/verification-loop/) first |

## Impact on costs

Parallelization increases token use. Published figures are:

| Source | Figure |
|---|---|
| Anthropic's multi-agent research system article | Agents use about 4x tokens of normal chat; multi-agent about 15x |
| Claude Code cost management docs | Agent teams cost about 7x a normal session when members use plan mode |
| Carlini's C compiler experiment | About 2,000 sessions, 2 billion input tokens, 140 million output tokens; cost nearly $20,000 |

Opus 5 tends to delegate to subagents more than prior models. The official prompt guide recommends noting which tasks can be delegated or setting a hard limit.
Claude Code lets you set limits with environment variables `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` (depth) and `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` (concurrent).
Sessions with `ultracode` enabled do not respect the concurrent limit.

The way to save: use smaller models for members (Sonnet is recommended in the docs), keep teams small, and stop idle members.
Cost estimates are in [Cost and quota management](/en/agent-dev/cost-management/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: First version.
<!-- AUTO-UPDATE:END -->

## References

- [Run agents in parallel (Claude Code Docs)](https://code.claude.com/docs/en/agents) — comparison of parallel methods
- [Create custom subagents (Claude Code Docs)](https://code.claude.com/docs/en/sub-agents) — subagent definition, models, limits
- [Run parallel sessions with worktrees (Claude Code Docs)](https://code.claude.com/docs/en/worktrees) — `--worktree` and subagent isolation
- [Orchestrate teams of Claude Code sessions (Claude Code Docs)](https://code.claude.com/docs/en/agent-teams) — agent teams and avoiding file conflicts
- [Orchestrate subagents at scale with dynamic workflows (Claude Code Docs)](https://code.claude.com/docs/en/workflows) — dynamic workflows
- [Manage costs effectively (Claude Code Docs)](https://code.claude.com/docs/en/costs) — agent team token use
- [Model configuration (Claude Code Docs)](https://code.claude.com/docs/en/model-config) — `ultracode` explanation
- [Claude-of-Duty (GitHub)](https://github.com/mshumer/Claude-of-Duty) — README, `ARCHITECTURE.md`, `prompt.md`
- [Prompting Claude Opus 5 (Claude API Docs)](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5) — control of subagent delegation
- [Building a C compiler with a team of parallel Claudes (Anthropic)](https://www.anthropic.com/engineering/building-c-compiler) — 16-agent parallel experiment
- [Scaling long-running autonomous coding (Cursor)](https://cursor.com/blog/scaling-agents) — comparison of lock and hierarchy coordination
- [How we built our multi-agent research system (Anthropic)](https://www.anthropic.com/engineering/multi-agent-research-system) — multi-agent token use
- [How we are shipping faster with Claude Code and Git Worktrees (incident.io)](https://incident.io/blog/shipping-faster-with-claude-code-and-git-worktrees) — parallel development experience with worktrees
- [git worktree (Git Documentation)](https://git-scm.com/docs/git-worktree) — worktree commands
- [Server Options (Vite)](https://vite.dev/config/server-options) — port default behavior and `strictPort`
