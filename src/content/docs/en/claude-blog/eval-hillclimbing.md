---
title: Automating eval design and hillclimbing
description: Four conditions for good eval, hillclimbing one change at a time to avoid overfitting, the build-eval and hillclimb commands in the claude-api Skill, and real-world case studies on cost reduction and performance improvement—all grounded in the original article.
sidebar:
  order: 6
lastUpdated: 2026-10-04
---

## Overview

- The original article is "Automating eval design and hillclimbing with Claude," published on September 28, 2026 by Lance Martin. Reading time: 12 minutes ([original](https://claude.dev/blog/automating-eval-design-and-hillclimbing/)).
- Eval (evaluation) is a system to measure how well your app or Skill performs on a specific task. This article covers the principles of building eval, and the principles of improving eval scores (hillclimbing—gradually climbing the score like ascending a hill) without deceiving yourself.
- The claude-api Skill bundled with Claude Code encodes these principles into two commands: `/claude-api build-eval` and `/claude-api hillclimb`.
- What you will learn: conditions for good eval, how to select test cases, verifying scorers, avoiding overfitting, the flow of one hillclimbing round, and two real-world examples (cost reduction and performance improvement).
- A summary appears in [Claude Code Official Blog Overview](/en/claude-blog/) (Section 6). This article goes deeper into that summary.

## Before building eval: Four conditions for well-designed eval

The original article identifies four common elements in well-designed eval:

| Condition | What it means | Sign if missing |
|---|---|---|
| Reflects production | Select tasks from real-world usage, not just because they are easy to build or score | Scores go up, but real usage does not improve |
| Stronger models and higher effort improve the score | More capable models or longer-thinking settings should achieve higher scores | If not, the task is ambiguous or scorer disagreement is the bottleneck |
| Not maxed out at the top (headroom exists) | Even the strongest model at the highest effort setting should score significantly below 100% | If close to perfect, you cannot see the effect of changes |
| Low run-to-run variance | Running the same condition multiple times produces consistent scores | Ambiguous tasks, scorer drift, effort inconsistency, or leftover state from prior runs (files, git history) that leak answers |

The second and third conditions include clarifications. Headroom should not come from "unsolvable" or "ambiguous" tasks—look for tasks that fail consistently no matter how many times you try. A good task is one where two experts reach the same conclusion, and the scorer only needs to check what is already stated in the task description.

Effort (the setting for how much a model thinks) is covered in the [Spending your effort article](/en/claude-blog/spending-your-effort/) in this series. Eval is also a tool to decide on effort or model choice by score, not by guesswork.

### The adversarial sampling trap

The original article warns against selecting "only the cases your model fails on." Models have uneven abilities; if you collect only the cases the current model fails on, you are sampling only that model's weak spots. You measure that model's failure patterns, not what is genuinely hard or valuable for your app.

Instead, select cases as follows:
- Choose cases where a human can explain why it is hard. The ability to articulate the difficulty is a guide for whether to include the case.
- Include cases from real-world failures (bug reports, support tickets).
- However, do not take user logs at face value. Users try things that seem likely to work, so logs alone skew toward easier cases.

## /claude-api build-eval: The procedure to build eval

When you run `/claude-api build-eval` in Claude Code, Claude asks questions and builds eval into your codebase. It pauses at key points and asks for human approval.

### Gathering test cases (inputs)

Gather cases in this order:
1. Production conversation logs (after checking retention periods and sensitive data)
2. Bug reports and support tickets
3. 5 to 10 cases you write by hand
4. Synthetic cases composed from your codebase

Start with production data, but you can also create synthetic data anchored to a small number of real examples. Claude creates a page listing all inputs and does not proceed until you review it. The original article shows an example with an email-sorting app and displays that page.

### Decide on a scorer and verify it

Next, Claude proposes the cheapest scorer based on your output format.

| Output nature | Scorer | What it does |
|---|---|---|
| Fixed-form answers | Programmatic verification | Exact match, one of a set of labels, schema-valid JSON, test pass/fail |
| Free-form answers with clear quality criteria | LLM-as-judge (another model scores) | Read input, output, and scoring criteria; return a score and reasoning. Phrase criteria as verifiable claims, not a 1–5 scale |

LLM-as-judge has three notes:
- When you have a baseline to compare against, have it read two outputs in random order, hide which is baseline, and ask it to choose the better one.
- You choose the scorer model. Do not use the same model as the one being tested.
- Claude scores a few cases and asks you: "Are there any I would have scored differently?" The original article emphasizes reading the actual scoring records before trusting a scorer. Scoring errors are among the most common causes of eval setup mistakes.

After verifying the scorer, Claude shows the scale (test cases × repeat count × model count) and rough time, runs a baseline, and outputs scores with confidence intervals. The outputs are: test cases, scorer, execution code, a JSON line per case and full records, and a simple page listing each case's score and links to records. If you want graphs or more, you can request additional pages. Extra pages are static files you open locally and load nothing from the network.

### Diagnostic checks

While running the baseline, Claude verifies three things:
- Scorer: Score the same output twice and report whether the verdict changes.
- Plumbing: Check for timeouts, API errors, and incomplete responses to ensure infrastructure noise does not look like model variance.
- Headroom: If the baseline is already above 95% or so, warn you and suggest aiming your hillclimb at cost or latency instead of quality.

## Hillclimbing: Principles for improving scores

Once you have reliable scoring, you can improve your app. Hillclimbing is suited to adjusting parameters that trade off cost and performance, like effort or prompts. Three guidelines help you choose where to apply it:

- Cheap to iterate: The change is inexpensive in time, cost, or effort. Most in-house efforts and customer work focus on text like prompts or Skills, since they are easy to change and easy to revert. Free changes to the harness (code around the model) can become large code changes.
- Attributable: You can connect the score change to where you changed it. An example is improving whether a Skill is called correctly—the metric (call rate) directly follows from the Skill description you changed.
- Focused goal: Vague requests like "improve performance" often fail because they do not account for headroom. Saturated eval or overly broad targets like "fix the harness" are also prone to stalling. Many efforts succeed when the goal is cost: even if eval is saturated, you can ask, "Keep performance the same and lower cost."

### Preventing overfitting

Even with good eval, production distribution rarely matches your eval exactly. This makes overfitting common: scores go up on eval but nothing improves in production.

The original article lists ways eval information can leak into your harness. For example, if OCR (optical character recognition) is advantageous in eval but nearly useless in production, adding OCR to your app just to score better on eval lifts only the benchmark, not production. Similarly, as you improve, you may add special-case logic in the harness to handle individual eval cases.

Three strategies prevent this:
1. Split cases: Separate the learning set (which improvers can read) from the test set (never shown). If learning scores go up but test scores stay flat, that is classic overfitting.
2. Do not paste failure details into your prompt: Even if you read the failure logs, do not copy them directly into your prompt.
3. Put answers out of the model's reach: Models can engage in "reward hacking"—directly searching for the eval answers.

## /claude-api hillclimb: Automating improvement

`/claude-api hillclimb` turns the above principles into a procedure. You choose what you are allowed to change:

- System prompt
- Skills or instruction files
- Tool descriptions
- Model choice, effort, and other API parameters
- Harness code

### Before you start

First, Claude asks what you are optimizing (performance, or cost while maintaining performance), then splits your eval cases randomly into learning and test sets. If cost is the goal, Claude checks common cost factors: prompt caching (the mechanism to cheaply re-read the same preamble), fit between your chosen model and prompt, and model-and-effort selection.

Before the first round, Claude confirms that eval noise (the random variation in scores) is smaller than the smallest improvement you want to act on. If not, Claude tells you and suggests more repeats or more cases.

### The flow of one round

1. Claude reads the learning-set records from the previous round, proposes one change as a patch. It targets a change whose effect exceeds the noise. It does not just rephrase—it addresses the root cause of the failure (rewrites the section, adds missing rules, etc.).
2. Claude applies the patch and runs eval.
3. If learning score goes up and test score stays flat, suspect overfitting and revert the patch. Also revert if things get worse. Keep the patch only when both learning and test improve.

### When progress stalls

When scores plateau for 2 or 3 rounds, Claude reads each remaining failure in the learning set, classifies them by cause. If a single fix is unlikely to improve scores beyond the noise, Claude suggests grouping by cause early and using repeats and more cases instead of wasting rounds on tiny changes. At this stage, Claude may find ambiguous eval cases, harness bugs, or run-to-run variance. Later rounds use only genuine failures.

### How it ends

At the end, Claude sets your code to the version that performed best on the test set relative to your goal. It reports the comparison to baseline with confidence intervals. If the improvement is within error, Claude says so and recommends against merging.

## Case study 1: Reducing cost (support ticket eval)

A company ran `/claude-api hillclimb` on their internal customer support benchmark (44 tickets: 30 for exploration, 14 for unseen test) with goals of both reducing cost and improving performance. The starting point was Opus 4.8 at default (high) effort, with 74.4% accuracy on the learning set and 4.6 cents per ticket.

| Stage | Change | Accuracy (learning) | Cost per ticket |
|---|---|---|---|
| Starting point | Opus 4.8, high | 74.4% | 4.6 cents |
| After prompt cleanup to Opus 5.5 low | Removed unnecessary tool-call ceremony, writing phases, conflicting rules; switched model | 87.8% | 1.9 cents |
| Downgrade to next tier | Sonnet 5 low | about 88.9% | about 1 cent |
| Prompt refinement | Added categorization rules and cross-references to refund limits | 98.9% | about the same |

The cost drop when switching to Opus 5.5 was partly due to pricing: input and output tokens are 20% cheaper than Opus 4.8, and cache reads are 60% cheaper, the article states. Once Opus 5.5 exceeded the threshold, the team tried an even cheaper model and confirmed Sonnet 5 also exceeded it. On the unseen 14 cases, the final setup achieved 90.5% accuracy compared to 78.6% for the starting configuration, and cost about one-fifth as much.

Three observations stand out:
- The first move was prompt cleanup, not model change. Removing ceremony and conflicts laid the foundation for later stages.
- The decision to downgrade models was based on eval scores exceeding the threshold, not the assumption that cheaper models lose accuracy.
- Success is measured not by the 98.9% on the learning set, but the 90.5% on unseen cases. The gap between learning and test reveals overfitting margin.

## Case study 2: Improving performance (the claude-api Skill's own eval)

The second example is the claude-api Skill itself. The Skill guides users on Claude API usage and common practices with Claude. To verify that the Skill can write correct code using the API, the team built eval from the official documentation. The Skill's initial score was 66%. The improver was given access to documentation and the SDK to find and fix errors.

| Stage | Content | Score |
|---|---|---|
| 1 | Eight feature descriptions were missing from the Skill. Added those sections | 74% |
| 2 | Fixed errors in C# and Java type tables | 77% |
| 3 (reflection stage) | Classified failures by cause. Models were writing old API patterns. Added a migration table from old to current patterns at the start of the Skill | 80% |
| 4 | Investigated unimproving tasks; found eval bugs. Fixed Skill too | about 88% (87.9% in graphs) |

Stage 3 is the most instructive part. After two rounds of stalling, the improver did not edit at all, instead classifying remaining failures by cause. This revealed that the Skill contains the right information, but models use old API patterns from training. For example, extended thinking with fixed token budgets is now rejected by recent Opus versions and replaced with adaptive thinking. The same happened with older web search and web fetch tools. The improver placed a migration table at the top of the Skill showing the old patterns and their current equivalents, and moved C# and Java warnings about fixed budgets ahead of the adaptive examples.

Stage 4 demonstrates: "If improving obvious gaps does not help, the case or scorer is suspect." Indeed, one task asked code to catch one type of error, but the scorer checked for chains of three or more. Claude fixed the task description. Another scorer instruction contradicted the official documentation; testing against the live API confirmed the documentation was right.

## Getting started

The original article's procedure is brief. Since the claude-api Skill comes bundled with Claude Code, start by updating it:

```shell
claude update
```

Then in Claude Code, run:

```text
/claude-api build-eval
/claude-api hillclimb
```

- Use `build-eval` when you want to build eval for a specific problem. You can pass examples like traces (real records) to guide it. You always approve test cases and scorer.
- Use `hillclimb` when eval exists, you set a goal (improve performance, or reduce cost at fixed performance), and want to improve it. Before the first round and when scores plateau, Claude checks for overfitting and eval bugs (scorers incorrectly marking right answers wrong, harness bugs).

## Where it fits in game development

The original article does not address games. Below are ideas from this Wiki and speculation.

### Using a model inside the game (closest to the original use case)

Features that call a model during gameplay—NPC dialogue, classifying player input, generating quests—are what the article covers. For example, if you sort input into "attack," "talk," or "irrelevant," the answers are fixed labels, so programmatic verification works. For NPC response quality, where answers are free-form, use LLM-as-judge. Frame criteria as verifiable claims: "tone stays in character," "does not mention game-external proper nouns."

Gather cases in this order:
1. Playtest conversation logs (after getting consent and handling privacy)
2. Bug reports
3. 5 to 10 cases you write by hand
4. Synthetic cases composed from your world-building notes

### Improving your own Skills or instruction files

The article includes instruction files and Skills. In game development, you could eval whether "CLAUDE.md rules are followed." Create 5 to 10 test tasks like:

```text
- Add one enemy type (edit data/enemies.json, do not hardcode)
- Add save-data fields (keep reading old saves)
- Replace a sound effect (do not touch files outside assets/sfx/)
```

Score programmatically: check which files changed and whether tests pass. Then give `/claude-api hillclimb` access to your instruction file and aim to "keep pass rate the same while shortening the instruction file." This aligns with the article's emphasis on cost reduction as a strong goal. See [Project instruction files](/en/agent-dev/project-instructions/) and [Context management](/en/agent-dev/context-management/).

### Combine with verification loops

Eval scorers pair well with [verification loops](/en/agent-dev/verification-loop/) mechanics—headless runs, exposed state, fixed seeds—so the scorer can read game state and decide pass/fail.

### Balancing bots (speculation)

The overfitting idea may apply to difficulty tuning using bots ([Balancing](/en/design/balancing/)). Tuning numbers to beat a bot can diverge when humans play. Splitting seeds or stages between learning and test sets mirrors the article's "split cases." But this is speculation, not from the article.

## How to use AI

- Before building eval, ask Claude to interview you about your feature: "Ask me five questions to uncover the real-world scenarios where this runs. Then, based on my answers, propose 10 test cases and explain why each is hard."
- When verifying a scorer, read the scoring records yourself. For a few cases Claude scored, check whether you would assign a different score.
- When progress stalls, ask: "Do not edit. Classify remaining failures by cause." Eval bugs and case errors often emerge.
- Cost reduction as a goal works even when eval plateaus. Ask: "Keep performance the same and lower cost."
- After improvement, judge by the test-set score and confidence interval. If the gain is within noise, do not merge.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Automating eval design and hillclimbing with Claude](https://claude.dev/blog/automating-eval-design-and-hillclimbing/) — Original article (Lance Martin, September 28, 2026)
- [Pricing (Claude API Docs)](https://platform.claude.com/docs/en/about-claude/pricing) — Pricing for models mentioned in case studies (as of October 2026)
- [Introducing Claude Opus 5.5 (Anthropic)](https://www.anthropic.com/news/claude-opus-5-5) — Pricing reductions for Opus 5.5
