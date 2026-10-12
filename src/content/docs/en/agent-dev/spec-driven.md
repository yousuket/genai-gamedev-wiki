---
title: "Spec-Driven Development: Converting Design Documents into Agent-Readable Specifications"
description: Learn how to rewrite design documents into specifications and acceptance criteria that agents can work with, including copy-and-paste templates.
sidebar:
  order: 5
lastUpdated: 2026-09-29
---

## Overview

One-shot generation works without specifications. However, in later iterations, you need documentation of "what counts as done" so that both agents and people can judge completion. This article explains how to convert design documents into agent-readable form, how to break down tasks, how to write acceptance criteria (what counts as done), how to manage specification files in the repository, tools for spec-driven development, and copy-and-paste templates. The prompt examples and templates in this article were written specifically for it.

## Why specifications matter

Claude Code's official documentation explains that agents stop when work appears to be finished. Without executable verification means, "appearing finished" is the only clue, putting people in the role of verifier ([Best practices](https://code.claude.com/docs/en/best-practices), as of September 2026). Acceptance criteria in specifications define that verification method.

The same documentation recommends that for large features, you have agents ask questions to create specifications, then use those specifications to implement in a new conversation. Useful specifications include the names of related files and interfaces, clearly marked out-of-scope items, and a procedure to verify the feature works at the end.

Claude of Duty used `ARCHITECTURE.md` as "the sole coordination mechanism" for multiple agents working together ([repository](https://github.com/mshumer/Claude-of-Duty)). It contained four sections:

| Content | Details |
|---|---|
| Rules to follow | Do not edit directories outside your own. Do not directly import modules from other parts. Use a designated function for random numbers. Do not allocate memory every frame. Build must pass |
| Common component shape | Components have designated functions like initialization, update, and cleanup |
| Assignment list | A table showing each component's directory and responsibilities |
| Inter-component communication | Names of events and the information they carry |

Game specifications are not just explanations of design, but also agreements about how agents behave.

## From design document to agent-ready specification

A design document ([design document template](/en/design/game-design-doc/)) is written for people. When passing it to agents, rewrite it this way:

| People-friendly style | Agent-friendly style |
|---|---|
| "Dash feels great" | "Dash distance is 3 tiles, duration is 0.2 seconds. Values in data/feel.json" |
| Embed numbers in text | Place numbers in data files, reference them in text |
| "Implement enemies" | "Add to src/enemies/. Follow the common shape in src/enemies/base.js" |
| Implicit assumptions | Explicitly state "out of scope" items |
| "Show me when done" | Write verification method (command, screen, manual review) |

Here is an example of rewriting:

```markdown
## Dash (before revision)
Dash is quick movement over a short distance. Must feel great.

## Dash (after revision)
- Press Shift to dash. Move 3 tiles in the facing direction in 0.2 seconds
- During movement, do not take damage from enemy projectiles. After finishing, cannot dash again for 0.5 seconds
- Store values in data/feel.json under dash.* (do not hardcode)
- Out of scope: dashing in mid-air, attacking while dashing
- How to verify: tests/dash.test.js passes. Game feel verified manually
```

You cannot specify "feels great." Game feel is confirmed by playing it and decided by numbers ([game feel](/en/agent-dev/game-feel/)). In the specification, note where those numbers go and that people verify it manually.

## Organizing specification files

Divide specifications into three layers and keep them in the repository.

```text
mygame/
  CLAUDE.md (or AGENTS.md)   # Standing rules. Keep brief
  SPEC.md                    # Product specification
  TODO.md                    # Task list and status
  tasks/
    012-dash.md              # Task specification and acceptance criteria
  docs/decisions/            # Decisions made and their rationale
```

| Layer | File | Content | Update frequency |
|---|---|---|---|
| Standing | CLAUDE.md, AGENTS.md | Build and test commands, rules to follow | When the same note needs repeating twice |
| Product | SPEC.md | Game specification, out-of-scope items, verification method | When direction changes |
| Task | TODO.md, tasks/ | One request unit. Includes acceptance criteria | Every request |

`AGENTS.md` is an open format for writing instructions for coding agents. Codex, GitHub Copilot, Cursor and others read it ([AGENTS.md](https://agents.md/), as of September 2026). Information on `CLAUDE.md` format is in [AI-driven development workflow](/en/dev-env/ai-workflow/).

## How to divide tasks

| Principle | Details |
|---|---|
| 1 task = 1 commit | You can revert just one if needed |
| Ends in playable state | Not "create all enemy types" but "create one enemy type, in a playable state" |
| At least one acceptance criterion per task | Tasks without verifiable criteria must be split or marked for manual review |
| Ordered by dependencies | Movement → Attack → Enemies → Stages |
| Size fits in one request | If uncertain, split in half |

Dividing by engine systems (rendering, physics, UI) means you cannot play until everything is done. For games, creating one vertical slice first (control → enemies → win condition) lets you play and verify earlier.

You can ask agents for a draft task breakdown. The ordering and sizing are decided by you.

```text
Read SPEC.md and create TODO.md.
- Make each task a size that fits in 1 commit
- Each task should be playable when finished (do not divide by system)
- Add acceptance criteria to each task (command, screen, or manual review)
- For dependent items, write the dependency task number
Do not implement yet.
```

## How to write acceptance criteria

Write acceptance criteria in "observable" or "executable" form.

| Type | Example |
|---|---|
| Command | `npm test` passes. `npm run build` passes |
| Metric | With 100 enemies on screen, frame time at the 95th percentile is 20ms or less |
| Screen | Running `tools/shot.mjs`, screenshot shows HUD does not overflow the screen |
| Input recording | Running `tools/playtest.mjs`, reach the clear screen after 60 seconds |
| Manual review | "Jump game feel." Values in feel.json, verified manually |

The pattern is "when X, Y happens."

```markdown
- When enemy health reaches 0, enemy disappears and score increases by 100
- When health reaches 0, game over screen appears and pressing R restarts the game
- Verification: tests/score.test.js (command), game over screen with tools/shot.mjs (screen)
```

Manual review is also a formal acceptance criterion. Keep it separate from the agent's completion report and record manual verification with a checkbox.

## Best practices for operation

- Start changes with specifications. Fix SPEC.md or tasks/ before changing code
- When agents rewrite specifications, read the diff with a human eye
- Do one task in one conversation. A new conversation starts with only specifications, exposing gaps
- For work when you step away, use acceptance criteria as the stopping condition. Claude Code's `/goal` command shows an example of using it to keep working until all acceptance criteria in the design doc are met ([Keep Claude working toward a goal](https://code.claude.com/docs/en/goal), as of September 2026)
- Sync specification and implementation regularly as they drift

```text
Compare SPEC.md with the current implementation.
List three categories:
- In specification but not implemented
- Implemented but not in specification
- Specification and implementation disagree
Do not fix anything yet.
```

## Tools and techniques for spec-driven development

| Technique / Tool | Details (as of September 2026) | Best for |
|---|---|---|
| Markdown + questions | Method recommended by Claude Code official docs. Have agents ask questions, write SPEC.md, then implement in a new conversation | Small games, solo development |
| GitHub Spec Kit | Open source (MIT). Follows a sequence: principles, specification, plan, tasks, implementation, convergence (verification against spec). Requires Python 3.11 or higher. See the next section for setup command and request order | Many features, wanting to structure specification, plan, and tasks formally |
| Kiro | Manage specifications using `requirements.md`, `design.md`, `tasks.md`. Store project knowledge in `.kiro/steering/`. Tasks without dependencies run in parallel | Integration from specification through implementation in the editor |
| AGENTS.md | Standard format for agent instructions | Using multiple tools together |

Spec Kit emphasizes deciding specifications (what, why) before implementation (how). The README shows the flow: principles once per project, then for each feature, run through specification, plan, tasks, implementation, and convergence ([github/spec-kit](https://github.com/github/spec-kit)). GitHub's blog explains this flow in four stages: specification, plan, tasks, and implementation ([GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/), September 2, 2025).

Kiro shows three stages: requirements, design, tasks, with status displayed per task ([Kiro Docs: Specs](https://kiro.dev/docs/specs/), [Steering](https://kiro.dev/docs/steering/)).

### Spec Kit setup command (for Claude Code)

First, install Spec Kit itself (`specify`). UV is recommended, but pipx or pip work too ([Installation](https://github.com/github/spec-kit/blob/main/docs/installation.md), as of September 2026).

```bash
uv tool install specify-cli
```

Next, integrate it into your project. **Use `--integration` to specify which agent you are using.** If omitted, GitHub Copilot becomes the default for non-interactive execution (CI or pipelines) ([init options](https://github.com/github/spec-kit/blob/main/docs/reference/core.md)). The key for Claude Code is `claude`, and it appears as a `/speckit-<command>` skill. Codex CLI uses `codex` and calls it with `$speckit-<command>` ([Integrations](https://github.github.io/spec-kit/reference/integrations.html)).

For a new project:

```bash
specify init mygame --integration claude
```

If you already have a game repository, commit or stash your work first and create a branch for the setup. This lets you review the generated files in the normal review process. Then run this in the repository root:

```bash
specify init --here --force --integration claude
```

`--here` installs in the current folder, `--force` allows setup in non-empty folders. `--force` may replace files if there are conflicts with managed files. Read the diff after running. It does not rewrite your app code or guess specifications for existing behavior ([Setup in existing projects](https://github.github.io/spec-kit/guides/existing-projects.html)).

After integration, request the following in order in the agent chat. The principle is one run per feature, cycling through specification to convergence ([README](https://github.com/github/spec-kit)):

```text
/speckit-constitution   # Project principles (once)
/speckit-specify        # Feature specification
/speckit-plan           # Technical plan
/speckit-tasks          # Split into tasks
/speckit-implement      # Implementation
/speckit-converge       # Verify against specification
```

The correspondence for games is:

| Spec Kit stage | Correspondence in this approach (not Spec Kit output) |
|---|---|
| constitution | Standing rules (CLAUDE.md, AGENTS.md). Technologies used, testing approach, rules like "random numbers from designated function" |
| specify | SPEC.md. Rewrite of design document |
| plan | Technical plan. Engine, architecture, performance goals |
| tasks | TODO.md. Divide by vertical slice |
| implement | Implementation per task |
| converge | Verify acceptance criteria. Manual review is done by people |

Using Spec Kit creates actual files in these locations ([Specification updates and file placement](https://github.com/github/spec-kit/blob/main/docs/guides/evolving-specs.md), [Project principles placement](https://github.github.io/spec-kit/upgrade.html)):

```text
.specify/memory/constitution.md   # Project principles
specs/<feature>/spec.md           # Specification per feature
specs/<feature>/plan.md           # Technical plan per feature
specs/<feature>/tasks.md          # Tasks per feature
```

Choose either the earlier approach in this article (`SPEC.md`, `TODO.md`, `tasks/`) or the Spec Kit approach. Using both creates duplicate specifications that can diverge.

Whether using tools or not, judging game feel and fun remains people's work. Add a "manual review" item to the tool's output. For small personal games, start with just Markdown.

## Copy-and-paste specification templates

### SPEC.md

````markdown
# (Game name) Specification

- Last updated: YYYY-MM-DD
- Design document: docs/one-pager.md

## 1. Purpose and experience
- In one sentence:
- Player and play length:
- Target enjoyment:

## 2. Core loop
(3 or so verbs)

## 3. Controls
| Input | Action | Values location |
|---|---|---|

## 4. Features
### 4.1 (Feature name)
- Behavior:
- Values: data/(file name)
- Out of scope:
- Verification: (command / screen / manual review)

## 5. Technology
- Engine and language:
- Build, run, and test commands:
- Rules to follow (random numbers, memory, adding dependencies, etc.):

## 6. Quality acceptance threshold
- Performance:
- Accessibility:
- Supported environments:

## 7. Out of scope

## 8. Undecided items
- [ ]
````

### Task specification (tasks/NNN-name.md)

````markdown
# NNN (Task name)

- Dependencies: (task number(s) to finish first)
- Related specification: SPEC.md section 4.1

## What to do
(2-5 lines)

## Files you may touch
- src/…
- data/…

## Acceptance criteria
- [ ] (When X, Y happens)  Verification: command
- [ ] (When X, Y happens)  Verification: screen
- [ ] (Game feel, etc.)    Verification: manual review

## Out of scope
- (Things not included this time)

## Please report
- Commands you ran and their results
- Location of any screenshots
- Anything undecided that is being deferred
````

### TODO.md

````markdown
# TODO

## In progress
- [ ] 012 Dash (tasks/012-dash.md)

## Next
- [ ] 013 Enemy projectiles (depends on: 012)

## Done
- [x] 011 Movement and collision
````

### Example: One feature (Dash), tracked across three files

Here is an example filling the templates above with "Dash." You can follow how the same requirement splits across three files. Values and behavior are the same as "Dash (after revision)" in the earlier section.

**SPEC.md**: Product specification. Write only the feature definition.

````markdown
### 4.3 Dash
- Behavior: Press Shift to dash. Move 3 tiles in the facing direction in 0.2 seconds. During movement, do not take damage from enemy projectiles. After finishing, cannot dash again for 0.5 seconds
- Values: dash.distanceTiles, dash.durationSec, dash.cooldownSec in data/feel.json
- Out of scope: Dashing in mid-air, attacking while dashing
- Verification: See acceptance criteria in tasks/012-dash.md
````

**tasks/012-dash.md**: One request unit. Write "what counts as done" with verification method.

````markdown
# 012 Dash

- Dependencies: 011 (Movement and collision)
- Related specification: SPEC.md section 4.3

## What to do
Implement dash when Shift is pressed. Read values from data/feel.json, do not hardcode.

## Files you may touch
- src/player/dash.js
- data/feel.json
- tests/dash.test.js

## Acceptance criteria
- [x] Pressing Shift moves 3 tiles in the facing direction in 0.2 seconds  Verification: command (tests/dash.test.js)
- [x] During the 0.2 seconds of dashing, do not take damage from enemy projectiles  Verification: command (tests/dash.test.js)
- [x] When dashing toward a wall, stop before the wall, do not pass through  Verification: command (tests/dash.test.js)
- [x] While cooldown period (0.5 seconds) is active, pressing Shift does not dash. Input is not queued  Verification: command (tests/dash.test.js)
- [x] Changing dash.distanceTiles to 5 in feel.json results in moving 5 tiles (values not hardcoded)  Verification: command (tests/dash.test.js)
- [ ] Dash game feel matches target "feels great"  Verification: manual review (play it, adjust values in feel.json)

## Out of scope
- Dashing in mid-air, attacking while dashing

## Please report
- Commands you ran and their results
- Anything undecided that is being deferred
````

**TODO.md**: Task list and status. Track agent completion and manual review separately.

````markdown
## In progress
- [ ] 012 Dash (tasks/012-dash.md)
  - 5 command-verifiable criteria: Complete (agent reported)
  - 1 manual-review criterion (game feel): Pending

## Next
- [ ] 013 Enemy projectiles (depends on: 012)
````

In this example, 5 of the 6 acceptance criteria can be verified by command. Only the last one requires manual review. Even when the agent reports "complete," task 012 in TODO.md stays "in progress" until game feel is verified.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version created.
<!-- AUTO-UPDATE:END -->

## References

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — Passing verification means, having agents ask questions to write SPEC.md
- [Keep Claude working toward a goal](https://code.claude.com/docs/en/goal) — Using `/goal` with acceptance criteria as the stopping condition
- [github/spec-kit](https://github.com/github/spec-kit) — Spec Kit README, setup and spec-driven flow
- [Spec Kit: Installation](https://github.com/github/spec-kit/blob/main/docs/installation.md) — Setup methods (uv, pipx, PyPI)
- [Spec Kit: init options](https://github.com/github/spec-kit/blob/main/docs/reference/core.md) — `--integration`, `--here`, `--force`
- [Spec Kit: Setup in existing projects](https://github.github.io/spec-kit/guides/existing-projects.html) — Integrating into existing repository
- [Spec Kit: Specification updates and file placement](https://github.com/github/spec-kit/blob/main/docs/guides/evolving-specs.md) — `specs/<feature>/` layout
- [Spec-driven development with AI (GitHub Blog)](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) — Spec Kit introduction and four stages
- [Kiro Docs: Specs](https://kiro.dev/docs/specs/) — Structure of requirements.md, design.md, tasks.md
- [Kiro Docs: Steering](https://kiro.dev/docs/steering/) — Persistent knowledge in `.kiro/steering/`
- [AGENTS.md](https://agents.md/) — Standard format for agent instructions
- [Claude of Duty (GitHub)](https://github.com/mshumer/Claude-of-Duty) — Example of `ARCHITECTURE.md` used for agent coordination
