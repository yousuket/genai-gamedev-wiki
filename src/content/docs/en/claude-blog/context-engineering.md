---
title: The new rules of context engineering for Claude 5 generation models
description: Explores why the Claude Code system prompt was stripped down by over 80% and how six old best practices have changed. Learn how to structure CLAUDE.md, Skills, and reference materials effectively.
sidebar:
  order: 2
lastUpdated: 2026-10-04
---

## Overview

This article takes a single post from the Claude Code official blog by Thariq Shihipar titled "The new rules of context engineering for Claude 5 generation models" and examines it in depth. The original article was published on July 24, 2026, and takes about 7 minutes to read. This article covers four key points:

- Why the Claude Code development team removed over 80% of the system prompt
- How six old best practices (rules, examples, batch input, repetition, CLAUDE.md memory, and simple specs) have been replaced
- What to write in each of these places: system prompt, CLAUDE.md, Skills, and reference materials
- The `/doctor` command for reviewing your own instructions

"Context" refers to all the information a model receives in a single request. Your prompt is just one part; the rest comes from the system prompt, Skills, CLAUDE.md, memory, and more. This article calls the design of how these pieces fit together "context engineering."

The original article does not mention games. For how to apply this to game development, see "Using this in game development" below, which represents the Wiki's perspective and is kept separate from the original article. The entry point to the series is [Claude Code official blog](/en/claude-blog/).

Original article: [The new rules of context engineering for Claude 5 generation models](https://claude.dev/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models/)

## Problem statement: General instructions are difficult to write

The article begins by explaining the difference between a prompt and context. A prompt can be written specifically for the task at hand. Context must work across many different requests, so it cannot be that specific. How do you write general guidance when you do not know what requests will come in? This is hard, and it becomes even harder when the model's abilities change.

The team recently noticed something significant. When they removed over 80% of the Claude Code system prompt for models like Claude Opus 5 and Claude Fable 5, coding performance as measured by their benchmarks did not drop.

## Unhobbling: Too many constraints

From the article's perspective, the system prompt, CLAUDE.md, and Skills had been overconstraining Claude.

Looking at records from internal use, they found cases where contradictory instructions appeared in the same request. For example, the system prompt said "document appropriately," while another instruction said "do not write comments." The system prompt, Skills, and user requests were clashing with each other.

Claude can read your intent and arrive at the right answer. However, when overlapping instructions conflict, it must think more carefully about which one to follow. The article's point is that excessive instructions added extra work for the model.

Constraints that were once necessary to avoid worst-case scenarios can now be removed and left to the surrounding context and the model's judgment, the article states.

Another background factor is that tooling has expanded. The old Claude relied on CLAUDE.md as the place for memory, information, and guidance. Now there are memory, artifacts, and Skills, and the model itself can create new paths to read and share context across sessions.

## Six old practices and what's changed

The article says some things that were once best practices have become myths. It presents six of them in pairs, old and new.

### 1. From giving rules to trusting judgment

Early in Claude Code, the team wanted to avoid worst-case scenarios like file deletion, so they wrote strong guidelines in the system prompt. For code, they roughly said (the article quotes the original English; here only the summary):

- Do not write comments as a rule.
- Do not write multi-line docstrings or multi-line comment blocks.
- Do not write intermediate documents like plans or analysis unless asked.

However, some requests make these rules wrong. For example, when a user has preferences for documentation, or when part of very complex code needs multi-line comments. Still, older models would often get comments wrong without guardrails, so the team accepted the tradeoff. The new models judge better and handle these decisions well without explicit rules.

In the new system prompt, the corresponding statement is simplified to roughly one line: "Write to match the surrounding code. Align comment quantity, naming, and phrasing." A list of rules has been replaced by a single judgment criterion: "match your surroundings."

### 2. From giving examples to designing interfaces

For how to use tools, the old first rule was to give examples. The latest models showed that examples narrow the model's search to the area around those examples.

Instead, think about the design of the tool, script, or file itself. What arguments does the model receive? Can you make them more expressive? The article's example is a todo management tool. Just by making the status a three-value enum (pending, in_progress, completed), the tool's purpose becomes clear. "Only one item in progress at a time" is what the design itself enforces.

Tool design is covered in detail in another article in the series ([Tool design](/en/claude-blog/tool-design/)).

### 3. From loading everything upfront to progressive disclosure

Claude Code was originally specialized for coding, so the system prompt spelled out in detail how to do code review and verification. These are not needed every time, but they are crucial information when needed.

Since then, Claude Code became very good at reading the right context at the right time. The team split code review and verification into separate Skills and call them when needed. This progressive disclosure is not limited to Skills. It is also used in tools—some tools are "lazily loaded." Before using a tool, the model searches for its full definition with ToolSearch and pulls it in. This way, the system can have many tools (like Task tools) that do not take up context until they are actually used.

You can use the same approach with CLAUDE.md and Skill files. The myth the article refers to is the idea that these should be a central place for every possible practice you might encounter. The concern is "if you do not write it down, the model will not find it." Instead, the article recommends building a tree of files that can be read at the right time.

### 4. From repetition to concise tool definitions

Old models would not listen without repetition, and they tended to listen better to instructions at the end of the context. This led to duplication: tools were mentioned in the system prompt's body, and instructions were also written in the tool descriptions.

Now you can remove this duplication. Instructions on how to use a tool go in the tool description, not in the system prompt.

### 5. From CLAUDE.md to automatic memory

In the past, the team recommended using the `#` hotkey to automatically write to CLAUDE.md. Now Claude automatically saves things related to the work and the user. The article goes this far but does not give details about what automatic memory stores.

### 6. From simple specs to rich reference materials

In plan mode, plans were saved as Markdown files and referenced when needed. For long projects, the rule was to put specs in the codebase and reference them.

The new Claude can handle more complex reference materials:

- Instead of Markdown, you can reference HTML artifacts created with the artifact feature.
- References can be in code form. Specs can be a detailed test suite, or a function from another codebase that you want to port.
- Rubrics (scoring criteria) are also a kind of reference. For example, if you write down "what is good API design" according to your preferences, you can use dynamic workflows ([dynamic workflows](/en/claude-blog/dynamic-workflows/)) to start multiple agents in a reviewer role with that rubric and have them check if the code fits your taste.

## How to organize your context: Four places

The article sums up the six changes and describes what to do in each part of your context.

| Place | Role and how to write (per the original article) |
|---|---|
| System prompt | Connected to the product's context (what product, what are you doing in it). For Claude Code, do not change it. If you create your own agent, spend the most time here |
| CLAUDE.md | Keep it light. Write the repository's purpose briefly; use most of the space for gotchas in the codebase. Do not write obvious things that you can see from the file structure. If you have multiple custom instructions (like how to verify), create a Skill for verification and reference it from CLAUDE.md |
| Skills | Treat as lightweight signposting to find information when you need it. Do not constrain unless it is an important area. If a Skill is long, split it into files. Unique opinions, knowledge, and best practices for you, your team, or your product work well here |
| Reference materials | Bring in files with `@`. Specs, mocks, or even the whole codebase work. Materials written in code are good because they are clear, precise instructions in a language the model already knows well |

As an example of a gotcha, the article mentions a configuration where type definitions are kept in only one large file. This is something specific to that repository that you cannot see from the file structure alone.

As an example of a reference material, the article says that an HTML mock design generally produces better results than a written description or screenshot.

## Simplifying your instructions: `/doctor`

Finally, the article recommends trying to simplify your system prompt, Skills, and CLAUDE.md the way the team did. A new command called `claude doctor` (or `/doctor` in Claude Code) helps with this automatically. The article says this approach is built into that command. For more details on how to write prompts for the new generation of models, refer to the "Fable Field Guide" that the article mentions.

## Using this in game development

From here on, this is the Wiki's perspective. The original article does not mention games.

### Trimming your instruction file

Based on the guidelines in [How to write project instruction files](/en/agent-dev/project-instructions/), you should review a CLAUDE.md that has grown over six months. Using the article's standard, you can judge whether to keep something like this:

| What is written | Judgment |
|---|---|
| "Do not write comments," "use TypeScript" | You can see this from the files themselves. Delete. |
| "`src/` has scenes and systems" | You can see this from the structure. Delete. |
| "Hitstop stops both the enemy and the player" | This is a rule specific to this game. Keep. |
| "Do not edit `.tscn` by hand. Always use the editor." | This is a gotcha. Keep. |
| "Damage calculation only in `damage.ts`. Write it nowhere else." | This is a gotcha. Keep. |
| A 20-line verification procedure | Split into a Skill; put only one line in CLAUDE.md as a reference |

Once you are done, you can get a review with `/doctor`.

```markdown
# CLAUDE.md (example for a game, written speculatively)
Horizontal-scrolling action. Phaser + TypeScript.
## Gotchas
- Damage calculation only in `src/systems/damage.ts`. Read values from `data/balance.json`.
- Hitstop stops both the enemy and the player (stopping only one breaks game feel).
## Verification
- After changes, use the `/verify` Skill.
```

Like the progress files in [Context management for long projects](/en/agent-dev/context-management/), you can split long information into separate files and load it only when needed. This is what the article calls a tree structure.

### Passing reference materials as code

- For HUD or menu screens, you can hand over an HTML static mock instead of a written description (this is a guess, applying the article's design example to game screens).
- For numeric rules like damage formulas or drop rates, pass them as test cases with expected values, not as prose. The test becomes the spec, and the AI can keep fixing code until it passes ([Balancing](/en/design/balancing/)).
- For game feel preferences, you can write them as a rubric and pass them to a reviewer. The article mentions the combination of rubric and reviewer, but does not discuss games. How to use a reviewer is in [Verification loop](/en/agent-dev/verification-loop/) under "Reviewer loop."

### Reducing examples through tool design

When writing a verification interface (a function that reads game state and sends commands), design it so the argument names and types convey intent, rather than listing examples. As the article's todo example shows, just making the status an enum is enough for the intent to be clear.

## How to use AI

Here is an example prompt to have AI review your CLAUDE.md:

```text
Read CLAUDE.md and mark each line as "keep / delete / move to Skill" using this standard:
- If you can tell from looking at the files → delete
- If it is a rule or gotcha specific to this game → keep
- If the procedure spans multiple lines → move to a Skill, leaving only a one-line reference in CLAUDE.md
- If you find contradictory instructions, point them out together
Put the results in a table and write one line explaining why you are deleting each item.
```

After removing old prohibitions, try the same request before and after, and confirm that output does not change. The article describes the team's method using benchmarks, but for solo development you can pick three tasks you often ask for, and compare results before and after deletion (this is a guess).

Another approach is to ask for a screen reference in HTML mock form:

```text
Read the title screen description and create one HTML mock (CSS included, no images) based on it.
Resolution 1280x720, three buttons, including focus state.
I will use this mock as a reference when implementing.
```

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [The new rules of context engineering for Claude 5 generation models](https://claude.dev/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models/) — Original article. Over 80% of system prompt removal and six practice pairs (as of October 2026)
- [How to write project instruction files](/en/agent-dev/project-instructions/) — How to write CLAUDE.md and length guidelines
- [Context management for long projects](/en/agent-dev/context-management/) — Splitting progress files and sessions
- [Claude Code official blog](/en/claude-blog/) — Series entry point and overview of seven posts
