---
title: "Making Games with Coding Agents: The Big Picture"
description: How coding agents differ from pasting code in chat, the flow from one-shot to shipping, the division of labor between humans and agents, and an example of a day's work in an agent-driven workflow.
sidebar:
  order: 1
lastUpdated: 2026-10-19
---

## Overview

This category assumes that game implementation is handed to a coding agent like Claude Code. It covers what happens after you ask an agent to build something in one shot, and how to move forward from there. This article explains how one-shot agents differ from pasting code in chat, shows the overall development flow, describes the division of labor between humans and agents, suggests how to read the rest of the category, and walks through an example of a day's work. The reader is assumed to be an engineer who can code but is new to game development. The prompt examples in this article were written for this article.

## How coding agents differ from pasting code in chat

Chat-based AI reads pasted code fragments and returns pieces of code. Running that code, fixing errors, and pasting them back is human work. A coding agent handles most of that back-and-forth itself. Claude Code's official documentation explains the mechanism as three repeating stages: "gather context," "take action," and "verify results" ([How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works), as of September 2026).

| Aspect | Pasting code in chat | Coding agent |
|---|---|---|
| What is visible | Only the pasted fragment | Entire project (files, Git state, instruction files) |
| Changing files | Humans copy and paste | Agent reads and writes directly |
| Running code | Humans run and paste the result | Agent builds, tests, and starts the dev server |
| When it fails | Humans paste the error and ask again | Agent reads the output, fixes it, and runs again |
| Scale of a request | Function or file level | Feature level to multi-hour tasks |
| Dividing work | Not possible | Agents can delegate investigation or review to subagents |

The difference is most visible in game development, especially in "run and verify." For a browser game, an agent can start a dev server, take a screenshot with a headless browser, look at the image, and fix issues. A single request like "fix the test" can lead an agent to:

1. Run the test and see it fail
2. Read the error output
3. Find and read the relevant source code
4. Fix the code
5. Run the test again

The official documentation includes this flow as an example. For games, you add "take a screenshot and check" and "operate with a script to verify" at the end.

### Case study: Claude of Duty's prompt was short, the work was long

Claude of Duty is a browser-based first-person shooter published by Matt Shumer in July 2026. The prompt is three paragraphs, and the game specifications are barely mentioned. Yet about 55,000 lines of game code were created because multiple agents kept working and verifying repeatedly ([repository](https://github.com/mshumer/Claude-of-Duty), [prompt.md](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md)). The repository's README suggests that "the testing harness might be more interesting than the game itself." It mentions scripts for taking screenshots, detecting image differences, and measuring frame time.

Details are collected in [Claude of Duty](/en/cases/claude-of-duty/).

This category is built on one key premise: an agent's capability depends not only on the model's intelligence but also on whether you provide it with ways to verify the work.

## What agents are good and bad at

Games have two kinds of quality: "works correctly" and "is fun to play."

- Whether it works correctly can be verified with tests, builds, screenshots, and operation scripts. You can hand this to an agent.
- Whether it is fun or feels good is something only human senses can judge. Humans decide this.

In Claude of Duty, a "critic" subagent tried to bridge these two aspects. When shown the actual game screen and asked to score it on a 10-point scale, scores increased from 3.59 to 5.05. However, in blind comparisons, every critic picked the real game every time (README, as of September 2026). An agent's scoring helps find directions for improvement, but it cannot judge "completion."

## The overall development flow

Starting from one-shot (having an agent build something working in one prompt), progress through seven stages:

```text
One-shot → Direction → Vertical slice → Specification → Iteration → Quality → Shipping (→ Operations)
```

| Stage | Purpose | Human's work | Agent's work |
|---|---|---|---|
| One-shot | Get working material | Decide what to build and provide verification methods | Implementation, self-verification |
| Direction | Decide what to keep, cut, or add | Play and decide what stays, goes, or is added | Code cleanup, removing unnecessary parts |
| Vertical slice | Polish one area to product quality | Show quality standards | Implementation, review by critic |
| Specification | Document what works | Decide intent and completion criteria | Draft spec from current state |
| Iteration | Cycle through features and adjustments | Play, judge, and write the next request | Implement features, add tests |
| Quality | Make it work, fast, and playable for anyone | Set the bar for passing | Tests, performance measurement, fixes |
| Shipping | Ready for store | Store text, trailer, pricing decisions | Build, export assets, write drafts |

Specification comes after the vertical slice because you do not really know what you want until you see something working. It is more efficient to write specs from working code than to write a long spec upfront.

Details for each stage are in [From one-shot to product](/en/agent-dev/from-one-shot-to-product/).

## Humans and agents: dividing the labor

Game development has roles: director (decides what to build and which direction to go) and designer (designs rules and player experience). In agent-driven development, humans take these two roles. Implementation is mostly handled by agents.

| Decision / Task | Who | Example |
|---|---|---|
| What to build, who plays it | Human | "A 5-minute survival game" |
| Judging if it is fun | Human | Playing and thinking "this part is boring" |
| World, theme, unique perspective | Human | Using your own work experience as a theme |
| Final tweaks to game feel | Human | "Lower gravity by 20 percent" |
| What to cut | Human | Remove half the features |
| Implementation | Agent | Movement, collision, UI |
| Building verification tools | Agent | Screenshot capture, operation script |
| Extracting and tuning numbers | Agent | Debug sliders |
| Research and comparison | Agent | "Research five games like this and compare" |
| Making data in bulk | Agent | Enemy list, item table |
| Choosing from bulk output | Human | Pick 3 from 10 options |

The boundary is "can you verify the answer?" If yes, hand it to an agent. If no, you decide. Where uniqueness comes from is covered in detail in [Bringing uniqueness after one-shot](/en/agent-dev/differentiation/).

## What to prepare before starting

- A Git repository. Agents change many files at once, so commit before handing off work ([AI-driven development workflow](/en/dev-env/ai-workflow/))
- Instruction files (`CLAUDE.md` or `AGENTS.md`). Write startup commands, test commands, and rules to follow ([AI coding tools](/en/dev-env/ai-coding-tools/))
- Ways to verify. At minimum, builds pass and you can take screenshots
- Permission settings. For long tasks, decide which commands to allow

Here is a minimal instruction file for a browser game:

```markdown
# Project
- A 3D browser game using Three.js and Vite. No asset files.
- Specification in SPEC.md, task list in TODO.md

# Commands
- Start: npm run dev
- Build: npm run build (must pass on every change)
- Check screen: node tools/shot.mjs (save screenshots to shots/)

# Rules
- Each request changes only one feature
- Game numbers go in src/config.js
- After any change, verify with build and screenshot before reporting
```

## How to read this category and the case studies

Reading this category in order will help you understand the entire flow from one-shot to shipping:

| What you want to know | Article |
|---|---|
| How much a one-shot can and cannot do | [How far you can go with a one-shot](/en/agent-dev/one-shot/) |
| How to make it your own after the one-shot | [Bringing uniqueness after one-shot](/en/agent-dev/differentiation/) |
| Step-by-step process for each phase and prompt examples | [From one-shot to product](/en/agent-dev/from-one-shot-to-product/) |
| How to format a design document for agents | [Spec-driven development](/en/agent-dev/spec-driven/) |
| Real cases and their prompts | [Case studies](/en/cases/), [Claude of Duty](/en/cases/claude-of-duty/), [Prompts by model](/en/cases/prompts-by-model/) |
| Lessons from cases | [Learning from case studies](/en/cases/lessons/) |

For game design basics, see [Core loop](/en/design/core-loop/) and [Game design document template](/en/design/game-design-doc/). For how to narrow your scope, see [Deciding scope](/en/getting-started/scope/).

## An example of a day's work

This is an example of a solo developer progressing from one-shot to the start of vertical slice work in a day off. Times are approximate.

| Time | Task | Who |
|---|---|---|
| 9:00 | Write a one-page design document. Let the agent ask questions to fill in gaps | Human + agent |
| 10:00 | One-shot. Have it also build verification tools (build, screenshots) | Agent |
| 11:00 | Play for 30 minutes. Write three lines about what to keep, cut, or add | Human |
| 12:00 | Lunch. Have the agent delete what you decided to cut | Agent |
| 13:00 | Play again with the cuts made. Pick one core loop | Human |
| 14:00 | Build around that core loop. One feature per commit | Agent |
| 16:00 | Have a friend play. Watch silently | Human |
| 17:00 | Collect feedback in TODO.md, ask the agent for priorities | Human + agent |
| 17:30 | Write tasks for tomorrow with "done when" conditions | Human |

At 10:00, the one-shot request might sound like:

```text
Build a one-screen action game that runs in a browser.
- Use Three.js and Vite. No image or audio files (use shapes and WebAudio).
- Controls: WASD to move, mouse to aim and shoot.
- Enemies approach. Survive 60 seconds to win.
- npm run build must pass.
- Take three headless browser screenshots. Look at them and fix any obvious problems.
- At the end, report the verification results and any unimplemented features.
```

The 11:00 play session cannot be handed to an agent. The boredom and unease you feel here become the starting point for the work ahead.

When running work during the lunch break, write the end conditions first. Claude Code's `/goal` is a feature that, given conditions, keeps an agent working toward them turn by turn while a different model checks progress ([Keep Claude working toward a goal](https://code.claude.com/docs/en/goal), as of September 2026).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-14**: Epic Games reportedly described its new Epic Games Store (in testing) as "vibe coded" entirely with AI coding agents. Epic claims that first launch loads about twice as fast as Steam (third-party verification is unconfirmed). It is also reported to have told developers of an unannounced game to stop writing code by hand (the original Bloomberg article is unconfirmed) ([Destructoid](https://www.destructoid.com/epic-games-store-ai-vibe-coded/), [VGC](https://www.videogameschronicle.com/news/epic-games-reportedly-orders-staff-to-implement-ai-first-development/))
- **2026-09-29**: First version.
<!-- AUTO-UPDATE:END -->

## References

- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) — The agent's three-stage loop, tools, context
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — Provide verification tools, plan before implementing, and other practical guidance
- [Keep Claude working toward a goal](https://code.claude.com/docs/en/goal) — The `/goal` feature for setting conditions and continuing work
- [Claude of Duty (GitHub)](https://github.com/mshumer/Claude-of-Duty) — A browser FPS built from a single prompt. The README discusses the harness and limitations.
- [Claude of Duty prompt.md](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md) — The full text of the published prompt
