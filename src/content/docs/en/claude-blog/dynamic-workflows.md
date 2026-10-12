---
title: Build a harness for every task with dynamic workflows
description: Claude Code's official blog post "A harness for every task" is broken down into how it works, why it works, six combination patterns, use cases, when not to use it, and tips. Apply these to game development for planning, root cause analysis, naming, and rule verification.
sidebar:
  order: 5
lastUpdated: 2026-10-04
---

## Overview

This article summarizes dynamic workflows in Claude Code—a feature developed through experience by development teams. Claude writes scripts on the fly that orchestrate multiple subagents. The article organizes the mechanism, why it works, six combination patterns, use cases, when not to use it, and tips, following the structure of the original.

- Published: June 2, 2026. Authors: Thariq Shihipar and Sid Bidasaria (both technical staff at Anthropic, responsible for Claude Code). Reading time: 11 minutes
- Original: [A harness for every task: dynamic workflows in Claude Code](https://claude.dev/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code/)
- The original does not mention games. The section "Use cases in game development" represents this Wiki's perspective.
- An example of using this feature as a critic comparing against an implementation is in [Gauntlet Loop](/en/agent-dev/gauntlet-loop/). This article focuses on the official blog post that forms the basis, without overlapping with the Gauntlet Loop procedure.

A note on terminology: a subagent is a worker that runs in a separate context from the main conversation. A harness is the external framework that supplies tools to the model and controls the flow of work.

## What's new

The standard Claude Code harness is designed for coding. Most tasks resemble coding, so it suffices. However, work like investigation, security analysis, multi-agent teams, and code review has required developers to write custom harnesses on top of Claude Code to achieve good results. These are tasks that are long-running, heavily parallel, highly structured, or adversarial.

Dynamic workflows let Claude build such custom harnesses for each task on the fly. Workflows you create can be shared with others and reused. The original article captures the authors' first experience and lessons learned right after the feature launched. Best practices are still evolving, and because they consume many tokens, they suit complex, high-value work.

## Eight prompt examples from the original

Before diving into detailed explanation, the original lists eight prompt examples to show what is possible. I have restated them in a table.

| Example | What you are asking for |
|---|---|
| Flaky test | For a test that fails one in 50 times, form multiple competing hypotheses, then continue until one hypothesis survives scrutiny of the evidence |
| Your own editing patterns | From the last 50 sessions, find repetitive fix instructions you give. Codify the ones that recur as rules in CLAUDE.md |
| Incident records | Study six months of Slack incident channel history, find root causes of recurring issues that have no ticket |
| Business plan critique | Have separate agents argue against a plan from the perspectives of an investor, customer, and competitor |
| Ranking job applications | Rank 80 resumes against a role, then double-check the top 10. Build the criteria by asking the candidate questions with a tool |
| Naming | Generate many names for a command-line tool, then narrow to the top 3 with a tournament |
| Bulk rename | Change the name of a model representing users throughout the entire codebase |
| Fact-checking an article | Verify every technical claim in a blog post draft against the codebase |

Notice that some examples are not programming—business planning, job applications, incident records. The original also notes that workflows can sometimes be more useful for non-technical work.

## How it works

Dynamic workflows execute a JavaScript file. That file can use special functions that launch subagents and orchestrate them together.

| Function | Role |
|---|---|
| `agent()` | Launch one subagent |
| `parallel()` | Run multiple in parallel |
| `pipeline()` | Chain multiple operations in sequence |

You can also use standard JavaScript functions like JSON, Math, and Array.

The original emphasizes two points. First, you can decide on the workflow side which model each agent uses and whether to run it in a dedicated worktree (an isolated copy for the task). Claude can choose both the intelligence level and degree of isolation. Second, if execution is interrupted (by user action or terminal exit), resuming the session continues from where it left off.

### Additional details confirmed in official documentation

Information confirmed in the official documentation (as of October 2026, [Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows)). This information does not appear in the original article.

- Workflows execute in an isolated environment separate from the conversation. Intermediate results remain in script variables, and only the final answer enters Claude's context.
- In one execution, up to 16 agents can run simultaneously by default (fewer on systems with limited CPU), up to 1,000 agents total per execution. A single call to `parallel()` or `pipeline()` can handle up to 4,096 items.
- Progress is visible at `/workflows`, showing agent counts per phase, token counts, and elapsed time. You can pause or stop from there.
- Executions with more than 25 agents or an estimate exceeding 1.5 million tokens show a "Large workflow" warning in the progress line. The warning is advisory; execution does not stop.
- Inside the script, `Date.now()` and `Math.random()` are not available. This ensures the same calls repeat identically when resumed.

## Why dynamic workflows

The standard harness handles planning and execution in a single context window. This works well for much coding. However, long-running, heavily parallel, highly structured, or adversarial work sometimes breaks down. The longer you keep a complex task in one context, the easier three kinds of failure become.

| Failure | Meaning | Example |
|---|---|---|
| Agentic laziness | Advancing only part of a complex, multi-part task, then declaring it done | Handling 35 out of 50 security checklist items, then stopping |
| Self-preferential bias | A tendency to favor your own results and findings. It shows up especially when asked to verify or judge against standards | Rating your own fix as passing, when you wrote it |
| Goal drift | As many turns pass, fidelity to the original intent gradually erodes. It happens especially after compression; each summary loses information, and boundary conditions or "do not" constraints fall away | A prohibition decided at the start is forgotten by the later part |

The answer is to combine independent subagents, each with their own context and a narrowly defined goal. Dividing the work reduces what any one agent must remember. Making judgment a separate role makes favoritism less likely to creep in.

### Difference from static workflows

Before this, you could already build static workflows combining multiple Claude Code sessions using the Claude Agent SDK or `claude -p`. But static frameworks had to handle every edge case, so they tend to become generic. The original explains that with Claude Opus 4.8 and dynamic workflows, Claude has become smart enough to write a harness designed for that specific task alone. It is not a framework that runs the same procedure each time; it is one that shapes itself to the question at hand.

## Six combination patterns

The original lists six patterns that Claude commonly combines. You can ask for a workflow and simply say "create a workflow" or include `ultracode`, and you are on your way. But understanding the patterns helps you know when to use them and how to guide Claude.

| Pattern | What it does | Use when |
|---|---|---|
| Classify and act | A classifier decides the type of task, then routes to different agents or actions by type. You can also use it at the end to determine the type of output | Your request needs different handling based on type |
| Fan out and synthesize | Break work into small stages, launch an agent per stage, then combine the results. The synthesis stage is a gate that waits for all to finish | Many small stages, or each stage needs clean context and isolation from the others |
| Adversarial verification | Pair each agent with another that questions the output against criteria | You want to guarantee quality of the output |
| Generate and filter | Produce many ideas, narrow with criteria or verification, remove duplicates, and return only ones that are high-quality and verified | Brainstorming or exploring options |
| Tournament | Do not divide the work. Have N agents compete on the same task. Vary the approach and let a judge compare them in pairs, with winners advancing until one remains | Your task has no single right answer |
| Loop until done | When the volume is unknown, do not run a fixed number of times. Instead, keep launching agents until a stopping condition is met (no new discoveries, no errors in logs) | Exploration where the scope is unclear |

## Use cases

The original lists ten use cases with concrete guidance. Here I retain the reasoning and distill.

### Migration and refactoring

The original cites Bun being rewritten from Zig to Rust as an example where a workflow was used. The trick is to break the work into processing units: call sites, failing tests, modules. For each fix, launch a subagent in a worktree, have another agent review it adversarially, then merge. To maximize parallelism, instruct to avoid heavy commands so your local machine does not run out of resources.

### Deep research

Claude Code includes an official Skill for research that runs in workflows: `/deep-research`. It chains web searches, fetches sources, adversarially tests claims, and synthesizes a sourced report. The target of research is not limited to the web. You can apply it to reporting based on Slack content, diving deep into your codebase's features, and more.

### Deep verification

When you want to verify every factual claim in a report. One agent extracts all claims; subagents verify each one in detail. You can structure it so a further agent audits the quality of the sources the verification agents found.

### Sorting and ranking

When you need to reorder 1,000+ lines by a qualitative criterion—such as prioritizing support inquiries by bug severity. Putting everything in one prompt lowers quality and overflows context. Instead, use a tournament of agents comparing pairs, or rank regions in parallel then merge. The original notes that comparing is more trustworthy than absolute scoring. Each comparison uses a fresh agent, so only the intermediate state remains on the script side.

### Memory and rule adherence

When rules written in CLAUDE.md are not followed consistently. Supply a list of rules and attach one verification agent per rule. A skeptical agent reviewing the verification agent's findings further reduces false positives. You can reverse it too: gather repetitive fixes from recent sessions or review comments, classify them in parallel, adversarially verify each candidate (asking "would this rule have prevented the actual mistake?"), and compile the survivors into CLAUDE.md.

### Root cause investigation

Debugging works better when you form and test multiple independent hypotheses. In a single context, you favor your own hypothesis. Workflows prevent this structurally. Separate agents form hypotheses for each non-overlapping class of evidence (logs, files, data), and each hypothesis faces a team of verifiers and challengers. This works beyond code: why revenue fell in March, why a data operation failed, or general postmortems.

### Large-scale triage

Support backlogs or bug reports that people cannot process fast enough. Classify each one, remove duplicates of already-tracked items, and respond. Responses range from attempting a fix to escalating to a person. A useful pattern is quarantine: agents reading untrusted public content are denied powerful operations; a separate agent with strong permissions receives only the summary and acts.

Combine with `/loop` to run continuously.

### Exploration and preference

For exploration involving preference, such as design or naming. Generate many solutions, hand review agents criteria (a scoring rubric). When the rubric is satisfied, you are done. You can also use a tournament to select based on the rubric.

### Light eval

Run separate agents on copies of your codebase, then have a judge agent score outputs against criteria. For example, evaluate a Skill you created against certain criteria and improve it.

### Model and intelligence routing

A classifier agent suited to the task decides which model to use. Checking before execution reveals the optimal model when complexity depends on factors you can examine first. In the example, when explaining an authentication module, the optimal model depends on file count and codebase shape, so the classifier checks and routes to Sonnet or Opus based on expected complexity.

## When not to use

The original cautions that workflows are new and deliver major wins in some cases, but not every task needs them, and they can consume far more tokens. Creative use for work that standard approaches cannot handle is the sweet spot. For ordinary coding, ask yourself "does this really need more compute?" For instance, ordinary coding does not need five review agents.

At a higher level, the same logic applies to choosing multi-agent versus single-agent. Parallelism and specialization must justify their coordination cost.

## Best practices

| Item | From the original |
|---|---|
| Be specific | Using the pattern names above and requesting in detail yields better results |
| Use for small tasks too | You can ask for a "lightweight workflow"—light verification of assumptions, for instance |
| `/goal` and `/loop` | For recurring work (triage, research, verification), add `/loop` to run periodically, and use `/goal` to strongly specify stopping conditions |
| Token budget | Specifying "use 10,000 tokens" makes it a ceiling |
| Save and share | Press `s` in the workflows menu to save. Place in `~/.claude/workflows` or distribute as a Skill |
| Distributing as a Skill | Put the JavaScript workflow in the Skill folder and reference it from SKILL.md. Asking to use it flexibly as a template, rather than running it straight as a script, works better |

### Additional operational details confirmed in official documentation

The following is also from the official documentation (as of October 2026), not the original.

- Including `ultracode` in your prompt, or writing "use a workflow," makes only that request a workflow. Using `/effort ultracode` makes Claude plan and create workflows throughout the session for tasks where they make sense. This uses more tokens, reaching your quota sooner.
- Save to `.claude/workflows/` in the project (shared with anyone who clones the repo) or your personal `~/.claude/workflows/`. After saving, call it with `/<name>`.
- Before running, a confirmation screen shows the planning phase. You can see the script text.
- When cost is unclear, try a small scope first (one directory, narrow question), as documentation recommends.
- The target count in `/config` under "Size guidance" lets you choose (small is under 5 agents, medium under 10, large under 50).

## Use cases in game development

What follows is this Wiki's perspective. The original has no game examples. Following the original's caution to ask first whether you really need a workflow, I narrow to cases where it genuinely applies.

### Deciding whether to use it

| Task | Fit | Reason |
|---|---|---|
| Add one enemy, change a UI color | Poor | Ordinary coding. Five review agents are not needed |
| Break up a giant `game.ts` by feature, bulk-rename identifiers | Good | Migration and refactoring. Many fix units, mechanically verifiable |
| Investigating a rare bug | Good | Multiple hypotheses; you easily favor your own |
| Names for enemies, skills, items; brainstorming | Good | Preference exploration. Generate and filter |
| Checking rule adherence in your instruction file | Good | One verification agent per rule |
| Tweaking game feel | Poor | This is a phase where humans play and decide ([Game feel](/en/agent-dev/game-feel/)) |

### Large refactoring or renaming

Your request might look like this. Keep tightly coupled pieces (rendering, lighting, physics) with one agent in sequence. The Gauntlet Loop case study reports that when coupled components were divided by role, they kept breaking each other's assumptions, and score gains were small ([Gauntlet Loop](/en/agent-dev/gauntlet-loop/)).

```text
Use a workflow to split src/game.ts (3,000 lines) into modules by feature.
Procedure: first, create one plan for how to split, prioritizing by dependency. Stop there so I can review.
After approval, run a subagent in each module's worktree, then have another agent review it adversarially before merging in order.
Keep rendering and physics—which are tightly coupled—in one agent running in sequence, not parallel.
Run npm run verify after each merge. Do not use heavy commands in parallel.
```

The official documentation shows a plan phase confirmation screen before running a workflow. The "stop there" is a separate ask to see the plan itself, distinct from that confirmation.

### Investigating a rare bug

Physics pass-through, rare crashes, sudden frame-time spikes.

```text
Use a workflow to investigate why a player rarely passes through a wall after the boss attacks.
Assign a separate agent to each type of evidence:
(a) logs in docs/logs/, (b) collision code, (c) output from running a seeded bot 100 times.
Each agent forms up to two hypotheses without seeing the other evidence.
Then a verification agent and a challenger agent test each hypothesis with a test that reproduces it.
Continue until one hypothesis survives the evidence, with a maximum of three rounds.
```

The seed-fixed approach and bot-running are evidence used in [Verification loop](/en/agent-dev/verification-loop/).

### Choosing names or ideas

```text
Use a workflow to brainstorm names for an enemy character.
World-building is in docs/world.md. Generate 40 names first, remove duplicates and names too close to existing famous works.
Then use a tournament comparing pairs to narrow to three. Criteria are: short, pronounceable, fits the world.
Show me the final three with reasons. I decide.
```

The final preference choice is made by a human. Checking whether a name is too close to existing works or trademarks is done by human search ([Copyright](/en/legal/copyright/)).

### Checking rule adherence

Your [instruction file](/en/agent-dev/project-instructions/) might have rules like "hit stop freezes both characters" or "do not edit `.tscn` by hand," but you are unsure they are kept.

```text
Use a workflow to check whether each rule in the "Rules" section of CLAUDE.md was followed in the last 10 commits.
One verification agent per rule. Each agent knows only its own rule, looking for violations.
Afterward, a skeptical agent reviews each finding to filter out false positives.
Show results per rule: a table with violation count and locations.
```

### Understanding cost

Workflows use many tokens in one run. In solo development, you may hit your quota first. Start by narrowing to one directory, then check token volume in `/workflows` ([Cost management](/en/agent-dev/cost-management/)). How to split parallel work is in [Parallel agents](/en/agent-dev/parallel-agents/); using a critic role comparing against implementation is in [Verification loop](/en/agent-dev/verification-loop/).

## How to use AI

### Have AI assess whether your task suits workflows

```text
Decide whether the following task should proceed with a workflow, a regular conversation, or neither.
Task: (example: reconcile names and stats for 120 enemy data records)
Reasoning: how many units of work, whether each is independent, whether results can be checked mechanically, whether there is danger of favoring your own output.
If workflows fit, list which patterns apply (classify, fan out and synthesize, adversarial verification, generate and filter, tournament, loop), estimate agent count, and rough token count.
If not, explain why.
```

### Have AI create a scoring rubric

In preference-driven exploration, the rubric you give review agents determines the outcome.

```text
Create a scoring rubric for review agents to evaluate the appearance of this game's menu screen.
Aim for 5 criteria or fewer. Each criterion should be something judged from a screenshot alone (not "readable" but "minimum text is at least 2% of screen width").
Attach to each criterion a one-line pass condition and a one-line fail example.
```

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: Initial version created.
<!-- AUTO-UPDATE:END -->

## References

- [A harness for every task: dynamic workflows in Claude Code](https://claude.dev/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code/) — Original (June 2, 2026, by Thariq Shihipar and Sid Bidasaria)
- [Orchestrate subagents at scale with dynamic workflows (Claude Code Docs)](https://code.claude.com/docs/en/workflows) — Execution limits, save locations, `ultracode`, understanding cost
- [Gauntlet Loop: divide the roles of creator and critic, loop while comparing to implementation](/en/agent-dev/gauntlet-loop/) — Example using adversarial verification and loop until done on game polish
