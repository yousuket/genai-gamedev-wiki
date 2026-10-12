---
title: "Claude Code Official Blog: Deep dives into 11 posts"
description: We have explored 11 posts from the Claude Code official blog (claude.dev), one by one in separate articles. Each article covers the original's flow, numbers, and examples, with added insights on how to use them in game development.
sidebar:
  order: 0
  label: Entry point and reading order
lastUpdated: 2026-10-04
---

## Overview

We are exploring posts from the Claude Code official blog ([claude.dev/blog](https://claude.dev/blog/)), one at a time in separate articles. As of October 2026, 11 posts are covered.

Each article follows the original post's flow and preserves numbers, tables, examples, and reasoning, then adds "How to use in game development." The original posts rarely mention games. The game-focused insights are separate from the original content and represent this Wiki's perspective.

This page is the entry point. It summarizes the reading order, connections between articles, and common themes.

## List of 11 articles

| Article | Published | Summary | Read time (original) |
|---|---|---|---|
| [Where to spend effort](/en/claude-blog/spending-your-effort/) | 2026-09-25 | Higher effort increases verification and checking for gaps. The difference shrinks as specs become tighter | 8 min |
| [New rules for context engineering](/en/claude-blog/context-engineering/) | 2026-07-24 | Cut system prompt by over 80%. Reduce rules, make them readable when needed | 7 min |
| [How to use Skills](/en/claude-blog/skills/) | 2026-06-03 | A Skill is a folder, not a manual. Verification Skills are the most effective | 11 min |
| [Tool design from an agent perspective](/en/claude-blog/tool-design/) | 2026-04-10 | Build tools by viewing them from the model's perspective | 7 min |
| [Dynamic workflows: harnesses built per task](/en/claude-blog/dynamic-workflows/) | 2026-06-02 | Assemble sub-agent configurations in code, per task | 11 min |
| [Eval design and hillclimbing automation](/en/claude-blog/eval-hillclimbing/) | 2026-09-28 | Create good evals, avoid overfitting, and improve one step at a time | 12 min |
| [Claude Code mods](/en/claude-blog/mods/) | 2026-10-01 | Extend Claude Code behavior and UI with small JS/TS files | 11 min |
| [Building with Claude Sonnet 5.5](/en/claude-blog/sonnet-5-5/) | 2026-09-28 | When to use Sonnet vs. Opus, pricing, and migration from Sonnet 5 | 9 min |
| [Mastering Opus 5.5](/en/claude-blog/opus-5-5-guide/) | 2026-09-22 | How to ask for what you need, monitor long tasks, and verify results | 9 min |
| [How much does Opus 5.5 cost per task?](/en/claude-blog/opus-5-5-cost/) | 2026-09-25 | Break down cost by turn count, caching, output, and model | 21 min |
| [How we made claude.ai 3x faster in 2 weeks](/en/claude-blog/faster-claude-ai/) | 2026-09-23 | Performance improvement by building what you can measure, then having agents climb it | 15 min |

Publish dates and read times are from the original pages. Authors: Thariq Shihipar wrote effort, context engineering, Skills, and tool design; Thariq Shihipar and Sid Bidasaria wrote dynamic workflows; Lance Martin wrote eval; Addy Osmani wrote mods, Sonnet 5.5, how to use Opus 5.5, and Opus 5.5 cost (4 posts). Raymond Wang, Sam Attard, and Issac G. wrote the claude.ai speedup post.

## Reading order

We offer three entry points by goal.

| Goal | Reading order |
|---|---|
| Polish your daily workflow | effort → context engineering → Skills |
| Learn cost and model choice | How much does Opus cost → Sonnet 5.5 → Mastering Opus 5.5 → effort |
| Assign large tasks, measure quality | Dynamic workflows → eval and hillclimbing → tool design → mods |

The claude.ai speedup article extracts the parts useful for web game performance (the original covers Anthropic's own service).

## Connections between articles

- Context engineering, Skills, and tool design all address "load when needed" design (progressive disclosure).
- Dynamic workflows mention packaging built workflows as Skills and using them in Skill evaluation.
- Eval lists prompt, Skill, instruction file, model, and effort as improvement targets. Effort is one tuning parameter.
- The cost article explains effort and model choice through billing numbers. Read it together with the effort and Sonnet 5.5 articles for a complete picture.
- "Separate agent verifying adversarially" plus "repeat until done" combined with real-world comparison is called the [Gauntlet Loop](/en/agent-dev/gauntlet-loop/), named by the author of Claude of Duty.

## What is common across all 11

Themes we can read from the original posts.

- Do not load everything upfront. Context engineering, Skills, and tool design all recommend "load when needed" design.
- When the model gets smarter, reconsider old assumptions. The context article removes rules and examples, the tool design article replaces a To-Do tool—for this reason.
- Separate verification. Dynamic workflows place verification in a separate context; eval avoids overfitting by using unseen test cases. Effort is explained as a way to adjust verification quantity.
- Balance against cost. Dynamic workflows note that 5 reviewers are overkill for normal work; the cost article searches for high-impact areas in the billing breakdown.

It is likely that for game development, building verification systems first (verification Skills in Skills, scoring in eval, command checking in mods), then assigning larger tasks like dynamic workflows, reduces rework.

## Connection to game development

This series connects to other Wiki articles as follows.

| Theme | This series | Wiki articles |
|---|---|---|
| Settings and cost | effort, Sonnet 5.5, Opus 5.5 cost | [Cost management](/en/agent-dev/cost-management/) |
| Instruction files, context | Context engineering, Skills | [Project instructions](/en/agent-dev/project-instructions/), [Context management](/en/agent-dev/context-management/) |
| Verification | Skills, eval, dynamic workflows | [Verification loop](/en/agent-dev/verification-loop/), [Gauntlet Loop](/en/agent-dev/gauntlet-loop/) |
| Parallel work, large tasks | Dynamic workflows | [Parallel agents](/en/agent-dev/parallel-agents/) |
| Web game performance | claude.ai speedup | [Web game stack](/en/agent-dev/web-game-stack/) |

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: Explored 11 posts, one by one in separate articles. Added 4 new posts: Sonnet 5.5, how to use Opus 5.5, Opus 5.5 cost, and claude.ai speedup.
<!-- AUTO-UPDATE:END -->

## References

- [Claude Code Blog (claude.dev)](https://claude.dev/blog/) — Original post list
