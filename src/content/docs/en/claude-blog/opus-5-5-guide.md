---
title: "Getting the Most Out of Opus 5.5: How to Ask, How to Monitor Long Tasks, How to Verify Results"
description: How to write prompts for Opus 5.5, rules for CLAUDE.md when assigning long tasks to Claude Code, how to verify results, how to use Claude app, and what to do when a message is flagged, following the structure of the original article.
sidebar:
  order: 9
lastUpdated: 2026-10-04
---

## Overview

- The original title is "Getting the most out of Opus 5.5 in Claude and Claude Code". Published on September 22, 2026, authored by Addy Osmani. Reading time: 9 minutes ([Original article](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/)).
- Opus 5.5 works with the same approach as before, but three points are different, according to the original. It can work on long tasks by itself, it communicates clearly about what it has done, and it thinks before every response.
- What this article covers: four types of how to ask, three techniques for monitoring long tasks in Claude Code, three types of verifying results, four ways to use Claude app, what happens when a message is flagged, fast mode, and the checklist at the end of the original.
- The original article covers each section in three points: "What to do," "Why it works with Opus 5.5," and "How to do it." This article also organizes them in the same order.
- The original does not mention Opus 5.5's pricing or model specifications. Pricing was verified from Anthropic's announcement and official pricing table. Input: 4 dollars per 1 million tokens, output: 20 dollars, cache reads: 0.20 dollars (as of October 2026, [Introducing Claude Opus 5.5](https://www.anthropic.com/news/claude-opus-5-5), [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)).
- A companion article is [Getting the Most Out of Sonnet 5.5](/en/claude-blog/sonnet-5-5/) (same author).

## Three Things to Try First

The original lists three things to try in your first session with Opus 5.5.

1. Hand over the entire task. Tell it what success looks like and when to stop and ask for input, then let it work.
2. Remove the line that says "think carefully." Opus 5.5 already thinks before responding.
3. When a long task is done, first read what you are being asked to do.

## 1. How to Ask

### Write what done looks like and hand it over

- What to do: Hand over the entire task in one message. Name the finish line, such as "all tests pass" or "all endpoints migrated to the new client."
- Why it works: Opus 5.5 works through long, multi-step tasks more persistently than Opus 5. The biggest gain compared to earlier Opus versions is multi-step work like running changes through tests until they pass on a large repository. Early testers let Opus 5.5 run multi-hour coding tasks with very little watching. With a finish line, you know when you are done.
- How to do it: An example from the original for Claude Code.
  ```text
  Migrate the payment endpoint from the old client to the new client.
  Completion criteria: All endpoints use the new client, the old client is removed, and tests pass.
  Stop and ask only if tests fail for a reason you cannot explain.
  ```
  (This is the meaning of the English example in the original, written in English.)

### Remove "think carefully"

- What to do: Remove lines from your prompts or saved instructions that say "think carefully," "think step by step," and so on.
- Why it works: Opus 5.5 always thinks before responding, and decides how much to think on its own. You do not need to ask. The original says that in testing with the chat product, removing the "think carefully" line made responses start faster with no noticeable drop in quality.
- How to do it: Remove the line. If you want it to answer simple questions quickly, say "answer directly." In Claude Code, if you want to change how much it thinks, change the effort level ([the effort article](/en/claude-blog/spending-your-effort/)).

### Add to the task in the middle

- What to do: If you remember something while work is going on, you can add it in a message while the work is running.
- Why it works: Because the task is long, the cost of having to start over is high.
- How to do it: In Claude Code, type a message and press Enter while Claude is working. For example, "Keep the old endpoint names as aliases."

### For design, name the style you want to avoid

- What to do: When asking for a page, app, or artifact, list the design habits you want to avoid.
- Why it works: Without a direction for the design, Opus 5.5 returns to some default styles. A general instruction like "avoid a common look" mostly just swaps one default for another. Being concrete about which patterns to skip works much better.
- How to do it: The original example is for a personal website, asking it to skip a cream or near-white background, italic text for emphasis on headings, numbered section labels like "01 / 02 / 03," monospace fonts for labels, and pill-shaped buttons. Then you look at what was chosen instead, and if you do not like it, add that pattern to the list and ask again.

## 2. Monitoring Long Tasks in Claude Code

### Name where to stop

- What to do: Write a short rule in CLAUDE.md that says "when to stop and ask, when to keep going."
- Why it works: Opus 5.5 reports the situation well while working. In long tasks, it sometimes stops instead of continuing. These are summaries that name the next step without doing it, requests for permission to continue, and lists of ways to keep going. It follows rules that name where to stop.
- How to do it: A rule that the original shows to add to CLAUDE.md (adjust it for your own project).
  ```text
  Continue with steps that do not need input. Put notes about status in the same message as the next task.
  Stop and ask only when I cannot continue without you, and before destructive actions.
  Destructive actions are deleting data, force-push, and changes outside this repository.
  ```
  (This is the meaning of the English in the original, written in English.)

Three notes on how to run this:
- If it stops with "Want me to continue?", you answer "continue." If this happens often, the rule above will help.
- The rule to keep going reduces how often it stops. Keep the check before work you cannot undo. That is the last line of the rule above. Keep the permission check for destructive commands on. It stays on.
- If you want to watch like pair programming, you can write the opposite rule. A one-line plan before each step, a short look-back at the end. Opus 5.5 will follow either way.

### Split big work into sub-agents

- What to do: For audits, migrations, and reviews of large codebases, split the work into sub-agents (separate agents that take on tasks), and have it verify the results.
- Why it works: Early testers had Opus 5.5 adjust parallel sub-agents on long audits and migrations with very little watching.
- How to do it: An example from the original.
  ```text
  Audit the services in services/ to see if each has the retry bug from the linked issue.
  Hand each service to a separate sub-agent. Before you accept the result each sub-agent gives back, verify the evidence.
  At the end, put the service name, whether it is affected, and one piece of evidence in a table.
  ```
  (The meaning in the original, written in English.)

### Keep a task list in a file

- What to do: For work that takes time, have it keep a task list in a file and update it as it goes. Check your progress from that file, not by scrolling back.
- Why it works: In long work, the context window fills up, and Claude Code summarizes old turns. A file list is not affected by this, so what is done and what is left is clear at a glance.
- How to do it: Say "Create a checklist in TASKS.md. Check off each item when it is done, and add new things you find."

## 3. Verifying Results

### Read what you are being asked for first

- What to do: When a long task is done, first find what Claude is waiting for you to do (decisions left, changes to approve). Read the summary after that.
- Why it works: Opus 5.5 reports what it did more clearly than Opus 5. Both mid-task reports and final summaries say what it did, what it found, and what it needs from you in simple language.
- How to do it: If you want the shape of the summary to be different, write it in CLAUDE.md. For example: "At the end of each task, add three headings: 'Waiting for me', 'Changes', 'Findings'."

### Have it review code

- What to do: Before a person sees it, ask Opus 5.5 to review the diff or pull request.
- Why it works: The original says that in one tester's experience, the lowest effort Opus 5.5 found more bugs than high-effort Opus 5, with fewer false reports. Because it explains changes in simple language, the pull request description is easier to review.
- How to do it: The idea from the original prompt.
  ```text
  Review the diff in this branch against main.
  List only problems that would make me want to stop the merge. For each problem, write the file and line, why it is wrong, and a way to show the failure.
  ```

### Mark what you could not verify

- What to do: In research or analysis, say what you could not find or verify.
- Why it works: "Could not find" is worth reading, and if you ask for it, it is more likely to find what is there.
- How to do it: Add "Mark what you could not verify, and write where you looked." You can use it in Claude's research reports or in Claude Code.

## 4. How to Use Claude App

First, verify that the model choice is set to Opus 5.5.

| Situation | What to do | Why the original says it works and examples |
|---|---|---|
| Charts and screens | Attach charts, diagrams, screenshots, and slides as they are. Do not retype the numbers | Reading charts is more accurate than in Opus 5, no extra steps needed. It understands what arrows connect which boxes, the difference between two versions of a chart, and what it means when a calendar screen's meeting start and end times are defined by position. Ask concretely: "Which service in this diagram calls the billing API directly?" |
| Reviewing long documents | Hand over long plans, reports, or slides and have it find mistakes | It pays more attention to detail than earlier Opus. In testing, it found a date with a mismatched day of the week and a chart that did not match the numbers in the slide, during a long plan exchange. "Find contradictions in numbers, dates, and names. Quote each problem and write the location." |
| Complete files | Ask for files, not outlines | The tables and documents it produces need less editing before sharing than Opus 5. "Make it a spreadsheet you can share. One company per row, with columns for cost, contract end date, and contact person." |
| Closing projects | In a long chat, if it is slow to answer a follow-up question, tell it that previous answers are settled | In long chats, with short added questions, it sometimes reviews earlier answers while thinking, and responses are slow |

Write the instruction for the last row in your project instructions in this sense:

```text
Treat what I have asked once as settled. Focus on this question, and do not review or revisit earlier answers unless I ask or point out a problem.
```

However, do not add it to long analysis projects. Later steps may find errors in earlier steps.

## 5. When a Message is Flagged

According to the original, Opus 5.5 is the first Opus model to be released with protections as strong as Fable for biology and cybersecurity risks. In Claude app and Claude Code, many flagged messages switch to an older model, and the work goes on there. Work that finds security vulnerabilities in source code is permitted, and everyday health and education questions should continue to work. The protections sometimes flag legitimate work, and adjustments to reduce false flags are ongoing.

### Claude app

- What you see: A notification that starts with "Switched to," and the name of the older model. That model answers, and the chat stays there.
- To switch back to Opus 5.5, choose it from the model menu. If the earlier message stays in the chat, it may flag again, so you can avoid it by starting a new chat.
- If you want to be asked first, go to Settings, Capabilities, and turn off "Switch models when a message is flagged." A "paused" card appears, and choices are shown.
- The check covers the whole conversation (including files and search results). It is not just the last message; earlier content may cause it.

### Claude Code

- What you see: A notification with the name of the older model, and the session goes on with that model.
- How to handle it: Four ways: use `/model` to switch back, press Esc twice to fix the last message and try again, use `/config` to change "Switch models when a message is flagged" to ask first, or use `/feedback` if the flag is wrong.

### Do not ask it to reproduce reasoning in the response

Remove from your prompts or instructions any request to "put internal reasoning into the response." A request to reproduce reasoning can be refused, and it is one class of flag. Ask for what you need in another way. For example, "Explain why you chose this approach in three sentences."

## 6. Speed: fast mode

- What to do: In Claude Code, use fast mode for back-and-forth work where you read responses and send the next message.
- Why it works: Opus 5.5's fast mode is available as a research preview at release. Same model, text arrives faster. You need to turn on extra usage, and the cost per token is higher than standard mode.
- How to do it: Type `/fast`.

## Opus 5.5 Checklist

Items from the end of the original to verify before long work.

| Category | Item |
|---|---|
| How to ask | You have written what done looks like / "Think carefully" lines are gone / For design requests, you have listed the styles to avoid / You have attached charts and screens without retyping |
| Claude Code long tasks | CLAUDE.md says where to stop and where to keep going, and to stop before destructive actions / Permission checks for destructive commands stay on / Large audits and migrations are split into sub-agents / Task list is kept in a file |
| Verify | Read what you are being asked for first / Run the review step before people see it / Research answers have a mark for what could not be verified |
| Flags | You know how to switch back (model menu or `/model`) / "Switch models when a message is flagged" is set to your preference |

## Where This Fits in Game Development

The original does not mention games. What follows is this Wiki's view. Keep model choices in the range the original covers (long work where careful thought matters goes to Opus 5.5).

### CLAUDE.md for Long Tasks

If you ask to "add 5 enemy types and make them all playable," in a game prototype, write the completion criteria in the language of games.

```text
Completion criteria:
- 5 enemy types exist in data/enemies.json, and each appears in one stage
- npm test and npm run smoke (headless, 60 seconds, run a bot) pass
- Existing save data loads without changes
Stop and ask only when I need to decide balance numbers and when you want to change the save format.
```

The rule for where to stop is, for games, "stop for decisions about game fun (difficulty, game feel, reward amount)." Game feel is decided by a person playing it ([game feel](/en/agent-dev/game-feel/)). The verification loop is in [verification loop](/en/agent-dev/verification-loop/), prompt patterns in [prompt patterns](/en/agent-dev/prompt-patterns/), and the full view of instructions in [project instructions](/en/agent-dev/project-instructions/).

### Split large organization work into sub-agents

Even in small games, as code grows, you find cross-cutting investigations like "find event listeners that are not removed when each scene ends." You can translate the original's audit prompt to game language.

```text
For each scene in scenes/, find event listeners and timers not removed when the scene ends.
Hand each scene to a separate sub-agent, and verify the lines it found before accepting the result.
At the end, put the scene name, whether it has the problem, and the relevant lines in a table.
```

How to split and when not to split is in [parallel agents](/en/agent-dev/parallel-agents/).

### Track progress of long tasks in TASKS.md

For work you run for hours, like one-shot generation, keep a list of features and checkboxes in `TASKS.md`. Even as context is summarized, the file remains, and you have one place to check how far you have gone. The ideas about summaries and progress files are in [context management](/en/agent-dev/context-management/).

### Review and mark what could not be verified

You can use the way to ask it to list "only problems that would make me want to stop the merge" on your own changes before merging. For example, collision detection changes, save format, or code that affects frame time. "Mark what could not be verified" is likely useful for making clear which parts have not been tested on a real browser (a guess).

### Attach screenshots

Game bugs are clearer in screenshots than in words. The original lists image reading as a way to use Claude app. The original does not cover how to show screens in Claude Code.

### Name the style you want to avoid in the game UI (applying the original's example)

If you translate the original's personal website example to a game's menu screen, list the styles you want to avoid.

```text
Make a mockup of the title screen and menu. Placeholder text is fine.
Do not use: gradient background from purple to blue, pill-shaped buttons, monospace font labels, all cards the same size.
```

Look at what was chosen instead, and if you do not like it, add that style to the list.

## How to use AI

- At the start of a request, write the completion criteria and where to stop. That alone makes Opus 5.5 work through long tasks on its own.
- When a task is done, read what you are being asked for first. Define the shape of the summary in CLAUDE.md ahead of time.
- Before people see it, ask for review. Narrow the range to "only problems that would make me want to stop the merge," and the report is easier to read.
- For research and analysis, add "Mark what you could not verify, and write where you looked."
- Remove "think carefully" from older prompts. When you want speed, use fast mode and "answer directly."
- Instead of "write your reasoning as you go," ask "explain why in three sentences."

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: First version.
<!-- AUTO-UPDATE:END -->

## References

- [Getting the most out of Opus 5.5 in Claude and Claude Code](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/) — Original article (Addy Osmani, September 22, 2026)
- [Introducing Claude Opus 5.5 (Anthropic)](https://www.anthropic.com/news/claude-opus-5-5) — Release date (September 22, 2026), pricing, safety explanation
- [Pricing (Claude API Docs)](https://platform.claude.com/docs/en/about-claude/pricing) — Pricing table (October 2026)
