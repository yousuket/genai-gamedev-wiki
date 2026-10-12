---
title: "Where to Spend your Effort (Using Claude Code: Spending your effort)"
description: "This article explores what Claude Code's effort parameter changes, using the author's three experiments and Terminal-Bench 3.0 analysis to explain how to choose between low and max effort, with applications to game development."
sidebar:
  order: 1
lastUpdated: 2026-10-04
---

## Overview

This article takes a single post from Claude Code's official blog by Thariq Shihipar, "Using Claude Code: Spending your effort," and explores it in depth. The original post was published on September 25, 2026, and has a reading time of 8 minutes.

This article covers four key points:

- What the effort parameter actually changes in how the model behaves (the original's explanation)
- How time and output quality vary when running the same request from low to max effort (numbers from the original's experiments)
- How effort works differently on tasks where it helps versus does not help, using Terminal-Bench 3.0 analysis
- The author's own workflow for switching effort levels and a four-level guide for when to use each

The original post does not mention games. The application to game development appears in later sections, clearly labeled as "This Wiki's perspective." The entry point for this series is [Claude Code's official blog](/en/claude-blog/).

Original: [Using Claude Code: Spending your effort](https://claude.dev/blog/spending-your-effort/)

## What the author wanted to confirm

The opening establishes that the latest models (Opus 5.5 and Fable 5.1) respond to effort without breaking Claude Code's prompt caching (a mechanism that skips recalculation of the same content). The author also notes receiving many questions from users: "What is effort, really?" "Which level should I use when?" "Why is it needed in the first place?"

So the author read evaluations and tested effort themselves in their own work. The conclusion: effort is a dial for "how thoroughly to check, how thoroughly to test edge cases, and how much to decide independently." In fields like hardware, code review, and security, where checking and edge-case analysis pay off, higher effort leads to better results.

For typical software development, the author uses this flow: "ask questions, implement at low effort, review the content, verify at high effort." Later sections cover this workflow in detail.

## What effort is

The original's explanation uses an analogy of delegating work to a person.

- If you ask someone to "spend 12 hours," they understand you want maximum effort.
- Ask for "1 hour" on the same task, and they get that you want the best version that meets the requirement first, then iterate.
- Or they might say "this will take at least 3 hours" and proceed from there.

Effort is a value that tells the model how much computation it can use, and relates to how hard you estimate the task to be. At any level, Claude tries to complete the request properly. What changes at higher effort is that the model takes more actions on its own for judgment and verification.

The original includes an "efficiency curve" diagram. Fable 5.1 and Opus 5.5 show the best curve yet: each level up raises both the benchmark score and token count. According to the diagram's note, Terminal-Bench 3.0's 70 tasks (excluding 4 GPU-intensive tasks) are run identically across all models. Opus 5.5 runs took about 3 weeks; responses were capped at 128k tokens and had no connections to GitHub or PyPI.

## Three experiments: How differences shift with instruction specificity

The author ran the same request at multiple effort levels with Opus 5.5 to compare results. The original notes these are "very simple examples."

### Experiment 1: Creating an app with vague requirements

The request: "Build a personal fitness and workout tracking app," with nothing else.

| effort | Time | Result |
|---|---|---|
| low | 1.5 min | A list of records and a simple chart only |
| medium | 4 min | (Original shows time only) |
| high | 11 min | (Original shows time only) |
| max | 67 min | Polished screens and a heat chart |

The original's reading: as the level rises, not only details increase, but Claude also makes more choices along the way. If you want a simple foundation to build from, low is enough. If you want the best single result, choose max.

### Experiment 2: Exploring a design with some constraints

The request: redesign Claude Code's `/config` menu. At all levels, the broad outline (improved submenus and search) stayed the same.

- low (1 min): Communicates the idea and produces a working sketch, but does not look like Claude Code.
- max (28 min): Produces a mock that matches Claude Code's appearance and includes explanations of multiple interaction flows.

The author's judgment: low is much faster if you plan to give feedback and iterate, while max produces a polished result from the start. For this task, the author prefers low to understand Claude's reasoning.

### Experiment 3: Creating an app with detailed specifications

The author interviewed Claude in detail to produce specifications for a fitness app, then implemented those specs at different effort levels. The result: at all levels, appearance and implementation were quite similar. The only differences appeared in details, where max spent time simplifying a few things. Times were 16 minutes for low, 22 for medium, 33 for high, and 79 for max.

The striking contrast is between low in Experiment 1 and low in Experiment 3. Without detailed specs, low takes 1.5 minutes and max takes 67 minutes; the results are worlds apart. With specs finished, low and max take 16 and 79 minutes, and the results are close. This reveals: effort makes a difference where the model has room to decide.

## The author's workflow

From the experiments, the original concludes that effort is chosen based on "how much of the work loop you want to stay in." Low returns a starting point quickly; higher levels do more work but also lean on Claude to make decisions on your behalf. The four-step workflow the author actually uses is:

1. Hand over specs and have the model interview you about missing points.
2. Implement at low effort.
3. Check whether the essentials are covered; if needed, fix at low effort.
4. Verify and test at high effort.

## How effort works on hard problems: Terminal-Bench 3.0

Toy problems can be solved at any level. To understand what happens at the boundary between success and failure, the author examined Terminal-Bench 3.0, a community-sourced benchmark. Tasks span security, hardware, ML, science, software, operations, and media. Examples the original cites:

- Build an 8-bit game console that fits in a small FPGA using Verilog, and draw a test ROM.
- Formally prove Takens' embedding theorem in Lean 4.
- Merge 16 checkpoints from a mixture-of-experts model into one and reproduce the baseline output.
- Execute a company's monthly EU trade statistics filing from start to finish.
- Convert a poster image into an editable layout file.

The author notes that these tasks are vastly more complex and larger in scale than typical work.

### High effort shines when many hidden edge cases exist

The main finding: high effort works best on tasks with many hidden edge cases. An example is html-js-filter, a task to build an HTML sanitizer that removes all ways to sneak JavaScript into a page. Fable 5.1 succeeded at low 1 out of 5 times, and at xhigh 5 out of 5 times.

- The 1 success at low took about 2 minutes. The model nearly wrote the filter in a single pass, tested it on one hand-written page, and stopped.
- The high success took about 33 minutes. In the original's trace, the model adversarially reviewed the first draft itself, read the source of the parser it used to verify bugs, ran many tests to ensure clean input produces the same output, ran a standard XSS test suite, and even wrote a fuzz test that generates random documents.

The original states that for optimization and security review—work where quality demands are high and the work is complex—this effort is worth the cost. But it clarifies that not all work needs it.

### Failure types: Some shrink with effort, some do not

The full results show failure reasons listed out. In summary: raising effort reduces failures from overlooked edge cases, but does not fix failures where the approach itself is wrong. Failure categorization is approximate, based on model judgment, as stated in the diagram's note.

The text data for Fable 5.1 (370 trials each) shows:

| Outcome | low | max |
|---|---|---|
| Success | 140 | 214 |
| Bugs the model's own tests missed | 40 | 14 |
| Incomplete or incorrect fixes | 31 | 10 |
| Misread requirements | 45 | 26 |
| Applied domain rules incorrectly | 32 | 24 |
| Chose an incorrect interpretation | 25 | 47 |

"Missed bugs" and "incomplete fixes" drop sharply, yet "chose incorrect interpretation" actually rises. The original's text does not assign these categories to "edge cases" versus "approach"—the table's labels are as listed above.

### Where effort helps most by domain

Pass rates by domain (Fable 5.1, from lower levels to top level):

| Domain | Lower levels | Top level |
|---|---|---|
| Security | 64% | 87% |
| Hardware | 34% | 75% |
| ML | 54% | 73% |
| Science | 41% | 61% |
| Software | 43% | 56% |
| Media | 18% | 30% |
| Operations | 12% | 22% |

Hardware shows the biggest lift. Software, media, and operations show smaller gains.

### Three concrete examples with Opus 5.5

Tasks the original cites where low fails but high or above passes—in all cases, differences lie in testing and edge-case handling:

- mvcc-lsm-compaction (storage engine bug fix): 0/5 at low, 4/5 at xhigh. Low (~1 min per run) edited code before even building or reproducing, and did not check whether the new test could detect the original bug. xhigh (~11 min) first reproduced the crash, wrote a randomized test comparing an uncompressed baseline, and verified that incomplete fixes would fail the test.
- cli-2ph-simplex (linear programming solver CLI): 0/5 at low, 5/5 at high. Low wrote once, tested on a small problem, and finished at about 10k tokens. It noted "might be slow on big problems" but did not check. High compared against a different brute-force solver using randomized problems, measured time on large ones, found slowdowns or crashes, and rewrote the search.
- gsea-proteomics (gene set enrichment analysis): 0/5 at low, 4/5 at high. Low did a single analysis with the most plausible preprocessing and reported. High tried two preprocessing approaches, noticed the list of significant gene sets changed, investigated the cause, and chose the correct one.

On the last example, the original adds that a human present might have prompted Claude to ask about preprocessing, but in an environment without a person, high performs better.

As a caveat, the note states these are internal runs (5 tries per task) where Fable 5.1 had safety measures disabled, and security tasks ran without internet. They do not match public leaderboard or published figures.

## When to use each level (the author's guidelines)

| effort | Fits these scenarios (original's examples) |
|---|---|
| low | Fast response needed, human in the loop. Brainstorming, sketches, simple changes |
| medium | Most of typical development. Implementing new features |
| high | Confirmation critical, or many edge cases. Fixing bugs in an existing codebase |
| max | No human present, want the model to solve a hard problem end-to-end. Building and testing an app, finding critical security flaws |

You can switch with `/effort` mid-conversation. The author asks for reader feedback on whether these guidelines match your intuition.

## Where to use effort in game development

From here on, this is this Wiki's perspective. The original does not discuss games.

We apply the original's observation—that effort's difference shows where the model has room to decide—to game development scenarios:

| Scenario | Suggested setting | Why |
|---|---|---|
| Early prototype like "make something brick-breaker–like" | low | You expect to see it, add more direction, and iterate. 67 minutes is not worth it. |
| Implementing a feature with specs (add an enemy type, build a menu screen) | low to medium | The tighter the specs, the smaller the gap between levels. |
| Collision slip-through, save-file migration, a crash on one specific stage | high | Many branching cases; having the model write and check tests itself pays off. |
| Verify that a boss behavior randomized by seed does not break down | high or above | Fuzz-like trials are effective here. |
| Tuning game feel, visual preference | low | The human plays and decides in this phase; faster returns make iteration smoother. |

The four-step flow translates to game development (this is educated guessing):

```text
1. /effort medium   # Hand over spec sketches; ask "what's missing?"
2. /effort low      # Implement, then you play and verify
3. /effort high     # "Run the enemy wave 1000 times with different seeds;
                    # check for softlock or exceptions"
```

Step 3 only matters if you have a verification framework. Tools for reading game state from the outside, pinning seeds, taking screenshots—see [verification loop](/en/agent-dev/verification-loop/). The original's high-level runs using fuzz and brute-force comparison show why providing verification tools is valuable.

The step of asking to pin down specs mirrors [spec-driven development](/en/agent-dev/spec-driven/) and its idea of "acceptance criteria." Experiment 3 shows that the tighter the specs, the smaller the effort gap—a path to lower costs (see [cost management](/en/agent-dev/cost-management/)).

Game feel tuning does not speed up when effort rises, because the human's playtime dominates (see [game feel](/en/agent-dev/game-feel/)). This aligns with the author's preference for low's quick returns in Experiment 2.

## How to use AI

One way to use AI before choosing effort is to ask the model to estimate the "room to decide."

```text
For the following request, which effort level—low, medium, or high—is appropriate?
Answer with your reasoning. Use these two criteria:
(1) Are specs vague, leaving many decisions to you?
(2) Is the cost of missing something high (e.g., save-file corruption)?

Request: Fix a wall-pass bug that occurs while dashing. Reproduction steps are attached.
```

For verification after implementation, ask at a higher level in a fresh session to get a different perspective:

```text
/effort high
Apply the following to the recent change:
- First write a test that reproduces the bug in the unfixed state; confirm it fails
- Confirm it passes in the fixed state
- Add three edge cases: wall corner, just after jumping, just after unpausing
- Report in three lines what the test guarantees
```

This is the original's mvcc-lsm-compaction high-level behavior (reproduce first, write tests, verify that incomplete fixes fail) adapted to game bug fixes. (This is educated guessing.)

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Using Claude Code: Spending your effort](https://claude.dev/blog/spending-your-effort/) — The original. Explanation of effort, three experiments, Terminal-Bench 3.0 analysis, and usage guidelines (as of October 2026)
- [Terminal-Bench 3.0 release](https://github.com/harbor-framework/terminal-bench/releases/tag/v3.0.0) — Task list referenced in the original
- [Cost and quota management](/en/agent-dev/cost-management/) — The relationship between effort and cost
- [Claude Code's official blog](/en/claude-blog/) — Entry point and summary of seven posts
