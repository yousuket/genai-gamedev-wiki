---
title: "Seeing like an agent: tool design for game development"
description: Breaking down Claude Code's official blog post about tool design into four case studies, and showing how to apply these principles to game verification APIs and documentation structure.
sidebar:
  order: 4
lastUpdated: 2026-10-04
---

## Overview

The Claude Code development team published an article about how they design and redesign "tools"—the operations agents use to read files, run commands, ask questions, and so on. It covers four case studies, including failures. This article reorganizes those cases without dropping the flow, and adds perspectives on how these ideas apply to game development.

- Published: April 10, 2026. Author: Thariq Shihipar (Anthropic technical staff, Claude Code team). Reading time: 7 minutes.
- Original: [Seeing like an agent: how we design tools in Claude Code](https://claude.dev/blog/seeing-like-an-agent/)
- What you will learn: When to add or remove tools, why the question tool took three tries, why ToDo became Task, how search methods changed, and how to use custom subagents to extend capability.
- The original article does not mention games. The "Game development use cases" section is this wiki's own perspective.

Two terms to clarify. A tool is a named piece with arguments that agents use to perform operations—reading files, running commands, asking users questions. A harness is the surrounding machinery that passes tools to the model, executes them, and returns results.

## The problem: one tool or fifty?

The article starts with the difficult part: assembling tools for agents. Claude works only through tool calls. One approach is to pass a general-purpose tool like bash. Another is to provide fifty specialized tools for each task. Which is better? Neither works in general; it depends on what you are building.

### A hard math problem analogy

The article suggests thinking about what tools you want when solving a difficult math problem.

| Tool you give | What happens |
|---|---|
| Paper | Enough to solve it, but only hand calculation works |
| Calculator | Faster, but high-level features are hard to use without knowing how |
| Computer | Most powerful and fastest, but only if you can write and run code |

The right choice depends on the solver's skill. The same applies to models. Tools should match "the shape of that model's ability." How do you know what ability to match? The article's answer: read the output, test, observe. This is "seeing like an agent," the article's title concept.

The rest of the article shows this thinking in action. Each case study shows when to add or remove tools, and how to tell the difference.

## Case study 1: The question tool (AskUserQuestion)

### The goal

The goal was to improve the agent's ability to ask questions—often called "elicitation." Claude can ask in plain text, but answering took longer than necessary. The question was how to reduce friction with the user and let one exchange carry more information.

### Three attempts

| Attempt | What it did | Result |
|---|---|---|
| 1. Extend the plan-submission tool | Added an array of questions to the ExitPlanTool that submits plans. Simplest to implement | Claude got confused. The tool asked for both a plan and questions about the plan at once. If answers disagreed with the plan, the model could not decide whether to call the tool again. Dropped |
| 2. Change output format | Use prompting to output questions as bulleted lists with parenthetical options, then parse the format to display a dialog | Claude could often output the format, but not reliably. It added extra text, dropped options, or abandoned the format |
| 3. Build a dedicated tool | A tool Claude can call anytime, called often in planning mode. When called, it shows a question dialog and pauses the agent until it gets answers | Adopted |

### Why the third worked

The article gives three reasons.

1. It reliably returned structured output. Claude could always produce multiple options.
2. The tool was composable. You could call it from Agent SDK or name it in a Skill.
3. Claude itself wanted to use it. The article notes that even a well-designed tool does nothing if Claude does not understand how to call it.

The article does not claim this is the final form of questions. If the model gets smarter, the tools supporting it will change, too. The next case shows this.

## Case study 2: From ToDo to Task

### The original ToDo tool

When Claude Code launched, the model seemed to need a ToDo list. The thinking was: write a list at the start, delete items as you finish them, and you are less likely to drift. So there was a TodoWrite tool to write, update, and show ToDos to the user.

Even so, the model forgot what to do. They added reminders every five turns to remind the model of its goals.

### What happened as the model got smarter

| Change | Problem that appeared |
|---|---|
| The model improved, and ToDo lists became too tight | Every time a reminder came, Claude took it as "must follow the list." Even when the model realized it should change direction, it hesitated to edit the list |
| Opus 4.5 got far better at using subagents | The question "how do multiple subagents share one ToDo list?" came up |

### The replacement

TodoWrite was replaced with Task tools. The difference is purpose. ToDo existed to keep the model on track. Task exists for agents to coordinate with each other. Task tools can carry dependencies, share updates between subagents, and the model itself can modify or delete items.

The article's lesson: when the model's ability grows, a tool that once helped can become a constraint. You need to review your assumptions regularly. The article also notes a practical point: keep the set of supported models small with similar capability trends, and your reviews will be easier.

## Case study 3: Search as a window

The article says the most impactful tool for any agent is how it finds context for itself.

### From RAG to Grep

| Phase | Method | Problem |
|---|---|---|
| Early internal | RAG (retrieval-augmented generation). Build a vector index of the codebase in advance, then fetch related fragments and give them to Claude each time | Fast and powerful, but indexing is complex. It breaks in different environments. Most importantly, Claude does not find context itself—it is given context |
| Shift | Give Claude a Grep tool | Claude finds files itself and builds its own context |

The logic is simple. If Claude can search the web, it can search a codebase. The smarter the model, the better it builds its own context when you give it the right tools.

### Skills and progressive disclosure

Introducing Agent Skills brought "progressive disclosure" into shape. Read only what you need, when you need it. Claude reads a Skill file, that file points to another file, and Claude recursively follows the chain. The article says one common use of Skills is adding search capability (how to use an API, how to query a database).

In a year, Claude went from "cannot build context alone" to "follows multiple layers of files to reach the context it needs." Now this technique is used to add features without adding tools. The next case explains why.

## Case study 4: Claude Code Guide (a custom subagent)

### Why not add more tools

Claude Code currently has about twenty tools. The team regularly asks whether each is necessary. The bar for adding a new tool is high: every new tool is another option the model must consider.

### The problem and three options

The problem: Claude was not well-versed in how to use Claude Code itself. It could not answer how to add MCPs or what slash commands do.

| Option | What it does | Problem |
|---|---|---|
| Option A | Put all the information in the system prompt | Few people ask this. It clutters the context (the article calls this "context rot"). It gets in the way of the main job, writing code |
| Option B | Give links to docs, let Claude fetch them when needed | It works, but Claude loads a large document block into context for a one-sentence answer |
| Option C | Make a custom subagent called Claude Code Guide | Adopted |

Claude Code Guide is called when the user asks about Claude Code itself. The subagent searches docs in its own context, follows detailed instructions on how to search and extract, and returns only the answer. The main agent's context stays clean.

It is not a perfect solution, the article notes. Claude still sometimes gets confused when asked how to configure Claude itself. But they expanded Claude's range of action without adding a tool. That was a win.

## The original article's conclusion

Tool design is science and art at once. It depends heavily on which model you use, what the agent is for, and how it runs. The advice: test often, read the output, try new things, and see like an agent.

## Four principles from the case studies

This wiki extracted the following table from the article's cases.

| Question | What the article shows |
|---|---|
| Add a tool? | High bar. Each new tool is another option the model must weigh (case 4). Use Skills or custom subagents instead if you can |
| Need structured output? | Calling a tool is more reliable than format instructions (case 1) |
| Remove an old tool? | When the model gets smarter, rethink your assumptions. Support can become a constraint (case 2) |
| Give information or let them find it? | Giving tools to search is better than providing information upfront (case 3) |
| Where does long docs get read? | Keep it out of main context. Let a subagent read and return only answers (case 4) |
| How to verify design? | Actually test if the model wants to call it and if the output is good (case 1) |

## What the official docs say now

Related to the article, this wiki checked Claude Code's official documentation (as of October 2026). This information is not in the original article.

- In the tools list, TodoWrite now defaults to disabled, replaced by TaskCreate, TaskGet, TaskList, and TaskUpdate. Task tools are only enabled by default for some older models (Claude 3.x, Opus 4–4.7, Sonnet 4–4.6, Haiku 4.5). For other models, they are off by default. The reason: newer models can follow multi-step work without written checklists, and tool definitions plus reminders use context (see [Tools reference](https://code.claude.com/docs/en/tools-reference)). This is the article's "rethink assumptions" in action.
- AskUserQuestion is a tool for asking multiple-choice questions. It offers options and also a free-text field (same page).
- There is a built-in subagent called claude-code-guide, for Haiku, invoked when Claude Code features are discussed (see [Create custom subagents](https://code.claude.com/docs/en/sub-agents)).

## Game development use cases

From here on, this is the wiki's perspective. The original article is about Claude Code itself and does not mention games.

### Design verification as a tool agents use

[Verification loops](/en/agent-dev/verification-loop/) create a port where an agent can read and write game state (window.__game). This port is a tool from the agent's perspective. Applying the thinking from case 1 and case 4, you get two options.

| Option | What it does | Problem for the agent |
|---|---|---|
| Fine-grained | Dozens of functions: setPlayerX(x), setPlayerY(y), setHp(n), spawnEnemy(...) | Too many choices. The agent has to think through combinations and order every time |
| Coarse-grained | Three functions: snapshot() (return state as one structure), step(frames) (advance by fixed steps), setInput(...) (give input) | Few choices. Return values have structure. Less room for mistakes |

The second matches the DebugApi pattern in the verification loops article. After design, follow case 1's lesson: actually have an agent use it, and watch for confusion or misreadings.

```text
Treat window.__game's API as a new user seeing it for the first time.
Do not read code, only function names and types.
Try to run: "Spawn 3 enemies, advance 10 frames, report the player's position."
At the end, list any confusion, wrong calls, or names that did not make sense.
```

If confusion appears, rename functions or combine them.

### Ask about vague specs with multiple-choice questions

As case 1 shows, questions are easier to answer when they have options. Game design has many unclear points, and this fits well. Combine it with ["draft assumptions first"](/en/agent-dev/prompt-patterns/) from prompt patterns, and ask like this.

```text
Before you code, ask about vague specs using multiple-choice questions.
For each question, provide 2–4 options, plus your recommendation and why.
You must include: screen size, input method (keyboard or touch), whether the game saves, and how the player loses.
```

In Claude Code, the AskUserQuestion tool handles multiple-choice questions. Whether Claude calls it depends on what the model decides. The more you say "ask with multiple choices," the more likely it will be called.

### Say a task list can change mid-work

Case 2's "feel bound by the list" problem can happen in your own progress file (docs/progress.md, etc.). In your instructions, write: "The list is a guide, not a law. If you find new work needed, add items, edit them, or delete them. When you edit, write one sentence why." This makes it easier to change direction ([Context management](/en/agent-dev/context-management/), [Project instructions](/en/agent-dev/project-instructions/)). This is a guess. The article confirms that reminders chilled the model's willingness to change course.

### Organize resources so they can be found through an index

Case 3's progressive disclosure becomes a resource layout. Rather than put all specs, tables, and asset lists in the instructions, write an INDEX.md that says "what lives in what file," and in the instructions just say "see docs/INDEX.md." The agent opens the material it needs when it needs it. This is "files point to files" from case 3.

### Have a subagent look up long engine docs

Case 4's pattern scales to your project. Godot, Unity, Three.js docs are long. Reading them in the main chat uses a lot of context. Make a subagent just for research, and get back only answers. An example for `.claude/agents/engine-docs.md`:

```markdown
---
name: engine-docs
description: Look up how to use the engine (Three.js, etc.) in official docs and return only the answer. Do not write code
tools: Read, Grep, Glob, WebFetch
model: haiku
---

You are a research assistant. You do not write code.
When asked a question, find only the part of the docs you need.
Return in this form:
1. The answer (3 sentences or fewer)
2. The API name and a minimal code example
3. A URL to the source
Do not paste long passages from the docs.
```

The subagent's `tools` and `model` are settings you can check in the official docs ([Create custom subagents](https://code.claude.com/docs/en/sub-agents)). Whether Haiku is enough for research, try and decide. Context handling is in [Context management](/en/agent-dev/context-management/), and how subagents work is in [Parallel agents](/en/agent-dev/parallel-agents/).

## How to use AI

You can use an agent itself to check your game's tools and instructions from an agent's point of view.

### Test if tools are easy to use

```text
Look at this repo's npm scripts and window.__game API as if you were new to it.
From these viewpoints, list hard-to-use parts:
- Names that do not say what they do
- Similar names that are easy to confuse
- Functions that must be called in order, but that order is not written anywhere
- When they fail, the error does not say what went wrong
For each, give a naming suggestion and any functions that could merge.
```

If confusion comes up, fix names and arguments.

### Find assumptions that are now stale

Apply case 2's thinking to your instructions.

```text
Read CLAUDE.md. Find instructions that are now not needed or are getting in the way because the model is smarter.
Look especially for orders that are too detailed, instructions written twice, or things the model can tell just by reading files.
For each, say what you would delete and what problems might happen after you delete it. Show me before you delete.
```

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: First version created.
<!-- AUTO-UPDATE:END -->

## References

- [Seeing like an agent: how we design tools in Claude Code](https://claude.dev/blog/seeing-like-an-agent/) — Original article (April 10, 2026, Thariq Shihipar)
- [Tools reference (Claude Code Docs)](https://code.claude.com/docs/en/tools-reference) — Default availability of Task tools, AskUserQuestion behavior
- [Create custom subagents (Claude Code Docs)](https://code.claude.com/docs/en/sub-agents) — Built-in claude-code-guide, subagent settings
