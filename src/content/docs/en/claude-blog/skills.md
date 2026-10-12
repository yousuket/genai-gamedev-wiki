---
title: "How to use Skills (Lessons from building Claude Code: How we use skills)"
description: Learn from Anthropic's management of hundreds of Skills—nine types, nine creation tips, distribution methods, and measurement approaches. This article focuses on verification Skills for game development.
sidebar:
  order: 3
lastUpdated: 2026-10-04
---

## Overview

This article covers a single post from the Claude Code official blog: "Lessons from building Claude Code: How we use skills" by Thariq Shihipar. The original was published on June 3, 2026, with a reading time of 11 minutes. It summarizes Anthropic's experience managing hundreds of Skills internally.

This article covers five key points:

- Understanding Skills as "folders," not just Markdown files
- Nine types of Skills used internally, with examples
- Nine tips for creation (avoid stating the obvious, develop a gotchas section, use filesystem and progressive disclosure, do not over-constrain Claude, initial configuration, write descriptions for models, add memory, include scripts, use hooks sparingly)
- Distribution methods (place in repositories or plugin marketplaces), combination approaches, and measurement of usage
- A report that verification Skills proved most effective

A Skill is a collection of instructions, scripts, and resources that Claude Code reads when needed, helping accomplish tasks more accurately and efficiently. The original article does not mention games. The application to game development is covered separately in "Game development use cases," reflecting the Wiki's perspective. The series entry point is the [Claude Code official blog](/en/claude-blog/).

Original source: [Lessons from building Claude Code: How we use skills](https://claude.dev/blog/lessons-from-building-claude-code-how-we-use-skills/)

## What are Skills?

According to the original article, a Skill is a folder of instructions, scripts, and materials that agents discover and use to accomplish work more accurately and efficiently. A common misconception is that Skills are merely Markdown files. In reality, they can contain scripts, assets, data, and more—agents can locate, examine, and operate on them. Claude Code Skills also include various configuration options, including dynamic hook registration.

The original article asserts that the most effective Skills use these configuration options and folder structure well. All subsequent content builds on this foundation.

## Nine types

When Anthropic conducted a complete inventory of internal Skills, they grouped into nine categories. The original article's claim is that good Skills fit cleanly into one type, while greedy Skills span multiple types and confuse agents. These nine types are not definitive; they are presented as a framework for identifying which types your own Skills might be missing.

| Type | What it does | Original examples |
|---|---|---|
| 1. Library and API reference | Correct usage of libraries, CLIs, SDKs. Often includes reference code snippets and a list of pitfalls to avoid | Internal billing library pitfalls, internal CLI subcommands and their use cases, configuration for outbound communication endpoints |
| 2. Product verification | Test and confirm that code is working. Combines with external tools like Playwright or tmux | Run registration through email confirmation and onboarding in a headless browser, test payment screens with test cards to confirm correct billing state, verify interactive CLIs that require a terminal |
| 3. Data retrieval and analysis | Connect to data and monitoring infrastructure. Includes authenticated retrieval libraries, dashboard IDs, common procedures | How to join events necessary for registration-to-billing funnels, compare retention rates across two cohorts, inventory of data sources in monitoring infrastructure |
| 4. Work and team automation | Convert repeated procedures into a single command. Logging results maintains consistency and allows reviewing past executions | Morning standup posts gathered from tickets, GitHub, and Slack history; structured ticket creation following schema; weekly summaries |
| 5. Template generation | Generate boilerplate code for specific features. Effective when natural language requirements cannot be expressed in code alone | Scaffolding for new workflows, migration file templates with pitfalls, configuration for authentication, logging, and deployment in new applications |
| 6. Code quality and review | Maintain organizational quality and assist review. Can embed fixed scripts to be more rigid. Can be called automatically via hooks or GitHub Actions | Critique from a fresh-perspective sub-agent until remarks become trivial; enforce formatting that Claude struggles with; teaching test writing |
| 7. CI/CD and deployment | Code retrieval, deployment, and release | Monitor PRs, retry unstable CI, resolve conflicts, enable automatic merging, staged rollout with automatic rollback on degradation |
| 8. Runbooks | From symptoms (threads, alerts, error types) through investigation spanning multiple tools, produce structured reports | Instrument selection and search patterns from symptoms, alert retrieval and standard checks, use request IDs to gather logs from all related systems |
| 9. Infrastructure operations | Regular maintenance. Includes destructive operations with guardrails in place | Find orphaned resources, notify, allow grace period and confirmation before deletion; approval workflows for dependencies; root cause analysis of cost spikes |

## Nine tips for creation

After deciding on a type, comes the question of how to write it. Organized in the order the original article presents them:

### 1. Do not state the obvious

Claude already knows how to write code and can read the codebase. Skills that repeat standard procedures add no value beyond consuming context. Knowledge-focused Skills should concentrate on information that pushes Claude outside routine thinking.

The original article highlights a good example: a frontend design Skill. Internal engineers created it by iterating with Claude on design preferences alongside users. It prevents falling into common patterns such as the Inter font or purple gradients.

### 2. Cultivate a gotchas section

In every Skill, the section with the highest information density is the gotchas section. Build it from the points where Claude frequently fails when using that Skill. The ideal is to continue incorporating gotchas as you update the Skill. The original article provides three examples—facts that cannot be discovered by reading code alone:

- One table is append-only; the desired row is not the one with the most recent creation date, but the one with the highest version number.
- One field is called `@request_id` in the API gateway but `trace_id` in the billing service—the same value with different names.
- The staging environment returns 200 even if the Stripe Webhook is not processed. Verify the actual state in a separate table.

### 3. Use the filesystem and progressive disclosure

A Skill is a folder, and the entire filesystem is both context design and a tool for progressive disclosure. When you tell Claude which files are in a Skill, it reads them at appropriate times.

The simplest approach is pointing to other Markdown files. Separate detailed function signatures and usage examples into `references/api.md`, place output templates in `assets/` if output is Markdown, and let Claude copy them as needed. In the original article's diagram, SKILL.md points to different files depending on context (for example, when jobs are stuck, consult `stuck-jobs.md`). By organizing references, scripts, and examples into folders, Claude operates efficiently.

### 4. Do not over-constrain Claude

Because Skills are reused, instructions tend to become specific. Claude follows instructions faithfully, and overdoing this prevents adapting to circumstances. Provide necessary information and leave room for adaptation. The motto in the original article's diagram is: "Write goals and constraints, not every procedure."

### 5. Think about initial configuration

Some Skills require the user's context. For example, a Skill that posts to a morning standup on Slack needs to know which channel.

In structure, store configuration in a `config.json` file in the Skill folder. If configuration is missing, the agent asks the user (the original article's diagram shows how to prompt for channel configuration). For multiple-choice questions, instruct the agent to use the AskUserQuestion tool.

### 6. Write descriptions for the model, not the human

When a session begins, Claude Code generates a list of all available Skill descriptions. Claude sees this list and decides: "Is there a Skill that matches this request?" Therefore, descriptions should not summarize—they should describe when the Skill activates. The original article's diagram suggests including activation keywords like "babysit" in the description.

### 7. Add memory

You can store data inside a Skill to give it memory. The form does not matter: append-only text logs, JSON, or even SQLite databases. For example, if a morning standup Skill writes to `standups.log` after each post, next time Claude can read its own history and report changes since yesterday.

The storage location is obtained from the environment variable `${CLAUDE_PLUGIN_DATA}`, providing a stable directory. Details appear in the Claude Code documentation section "persistent data directory" that the original article references.

### 8. Include scripts and let Claude generate code

One of the most powerful tools you can give Claude is code. If scripts or libraries are available, Claude focuses on assembling what to do rather than reconstructing standard boilerplate. For example, place a set of data retrieval functions in a data analysis Skill. Claude can respond to requests like "What happened on Tuesday?" by writing throwaway scripts combining helpers on the fly, performing more advanced analysis. The original article's diagram shows passing a small library where gotchas are written in function docstrings.

### 9. Use hooks that work only when needed

Skills can have hooks that activate only when called and persist only during the session. Suited to features that are rarely necessary but extremely helpful, and opinionated. The original article provides two examples:

- `/careful`: Use a PreToolUse matcher to stop `rm -rf`, `DROP TABLE`, force push, and `kubectl delete` on Bash. Use only when touching production. Constant reminders would exhaust you.
- `/freeze`: Prevent Edit and Write outside specific directories. Avoid accidents where you wanted to add a log line during debugging but Claude "fixed" unrelated code instead.

### Conclusion: grow it as you write

A point the original article makes separately from the nine tips: most of the best Skills started as a few lines and a single gotcha. People expanded them as Claude encountered new edge cases. Best practices are still evolving, and the article suggests starting, trying, and observing what works is the fastest path.

## Distribution, combination, and measurement

### Distribution

Two methods exist: place Skills in `./.claude/skills` in a repository, or create a plugin and make it available in Claude Code's plugin marketplace so users can post and adopt it.

The original article's decision criterion is scale. For small teams with few repositories, placing Skills in the repository is sufficient. However, Skills in the repository consume some of the model's context. At larger scale, run an internal plugin marketplace so each person can choose which Skills to add, complete with initial setup flows.

### Managing the marketplace

Anthropic has no central team deciding adoption. Useful Skills are discovered naturally. People who want feedback upload to a GitHub sandbox folder and publicize via Slack or similar. If there is response (a judgment by the owner), they submit a PR to move it to the marketplace.

### Combination

When you want Skills to depend on each other (a Skill that uploads files, combined with another that generates and uploads a CSV), the marketplace and Skills do not yet have built-in dependency management. However, if you reference other Skills by name, the model will invoke them when present.

### Measurement

Internally, Anthropic uses PreToolUse hooks to log Skill usage. Popular Skills and Skills that activate less often than expected (candidates for description revision) become visible.

## Game development use cases

From here, this reflects the Wiki's perspective. The original article does not mention games.

### Start with a verification Skill

The original article reports that verification Skills for products had the largest impact on output quality. For games, the first Skill to build should be this type. Translating video recording and assertions (from the original article) to games gives this structure:

```text
.claude/skills/verify-game/
  SKILL.md           # When to use, procedure, report format
  scripts/
    run-bot.mjs      # Run bot with fixed seed for 60 seconds, output state as JSON
    shoot.mjs        # Launch with Playwright, take screenshots per scene to shots/
  references/
    gotchas.md       # Pitfalls specific to this game
  config.json        # Launch port, screen size
```

The underlying approach is covered in [verification loop](/en/agent-dev/verification-loop/) (in Japanese). Packaging it as a Skill shortens instructions each time and prevents procedure drift.

### Nine types adapted to games (inferred)

| Original type | Game example |
|---|---|
| Library and API reference | List of pitfalls in the engine or libraries you use (Phaser scene transitions, etc.) |
| Product verification | The verify-game above |
| Template generation | Add new enemies, items, or stages as a three-piece set: data, implementation, and verification |
| Code quality and review | Critical eye from separate context to score how the game feels |
| Runbooks | From "framerate dropped" through measurement and root cause isolation, step by step |
| Work and team automation | Pre-release checklist (build, file size, public page review) |
| Infrastructure operations | Clean up orphaned generated assets (show a list and request confirmation before deletion) |

Data retrieval and CI/CD types can be deferred until small solo projects actually need them.

### Write the gotchas section at the second failure

When you see the same failure twice, add one line to gotchas. Examples follow (inferred approach):

```markdown
## Gotchas
- dt becomes 0 during hitstop. Timers advanced by dt freeze. Use realDt instead.
- Shots in shots/ are taken not immediately after game launch, but 2 seconds after the title screen animation finishes.
```

This mirrors how instruction files evolve (see [project instructions](/en/agent-dev/project-instructions/) (in Japanese)). Start short, expand with each failure. The original article's conclusion—start simple, try it, and expand based on what works—suits solo development.

### Distribution via repository is sufficient

For solo development, placing Skills in `.claude/skills` is adequate. Consider the marketplace when headcount grows. Because each Skill consumes context, remove Skills that are no longer used (see [context management](/en/agent-dev/context-management/) (in Japanese)).

### Hooks that work only when needed

The original article's `/careful` and `/freeze` concepts apply to game development:

- Before organizing asset folders, block `rm -rf` and `git clean`.
- While balancing enemies, block edits outside `data/enemies.json`.

The original article's point is that constant restrictions are intrusive, so use them only when needed.

## How to use AI

A practical division of labor: let AI draft the Skill, and focus your effort on developing the gotchas section alone.

```text
Please create SKILL.md for the verification Skill in this repository (.claude/skills/verify-game/).
- description should state the activation conditions. Include words like "verify," "confirm," or "check operation."
- Write only goals and constraints in the procedure, not step-by-step commands.
- Move details to references/ and reference them from SKILL.md.
- Create a Gotchas section as an empty heading. I will expand it as failures occur.
```

When a failure happens, ask AI to suggest a gotcha entry:

```text
Please write the cause of today's failure (timer froze) as a one- or two-line gotcha.
Do not write general knowledge visible from reading code. Write only facts specific to this project.
```

You can also use AI to refine descriptions:

```text
Please revise this Skill's description to state "when it activates."
List five phrasings of requests where you want it to trigger, and make sure they are included.
```

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: Initial publication.
<!-- AUTO-UPDATE:END -->

## References

- [Lessons from building Claude Code: How we use skills](https://claude.dev/blog/lessons-from-building-claude-code-how-we-use-skills/) — Original article. Nine Skill types and creation tips (as of October 2026)
- [Plugins reference: persistent data directory (Claude Code Docs)](https://code.claude.com/docs/en/plugins-reference#persistent-data-directory) — Where the original article directs Skill data storage
- [verification loop](/en/agent-dev/verification-loop/) (in Japanese) — Tools that form the content of a verification Skill
- [Claude Code official blog](/en/claude-blog/) — Series entry point and overview of seven posts
