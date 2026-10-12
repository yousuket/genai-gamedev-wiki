---
title: "Gauntlet Loop: Separating the Maker and Critic Roles, Comparing Against Reality"
description: A first-hand guide to "Gauntlet Loop," the method Matt Shumer named from his Claude of Duty process. Includes procedures and prompt templates applicable to 2D games, balancing, and UI.
sidebar:
  order: 16
lastUpdated: 2026-10-04
---

## Overview

Gauntlet Loop is the name Matt Shumer gave to his development process in Claude of Duty, a browser-based FPS with a single 55,000-word prompt. It separates the maker and critic roles into different agents, has the critic compare the output against a real reference, and continues looping until the target is met or you stop it manually.

This article explains the definition, how it was used in Claude of Duty and the results, why it works and where it has limits, procedures for adapting it to games beyond 3D FPS, reusable prompt templates, and common failure points. Finally, it frames how Gauntlet Loop handles the question "Is this fun to play?"—a judgment only humans can make.

## What Is Gauntlet Loop?

### Where the Name Comes From

Shumer published the Claude of Duty demo and prompt on July 25, 2026 (UTC). Two days later, on July 27 (UTC), he quoted the prompt post and wrote that "we will henceforth formally call this a Gauntlet Loop" ([X post](https://x.com/mattshumer_/status/2081830214384886228)). On the same day, he published an explainer article, [How to Run a Gauntlet Loop](https://somethingbig.ai/gauntlet-loop). The post describes how the agent itself (not a human) breaks the goal into components, assigns a specialist maker and an impartial blind critic to each component, and only approves the work when it surpasses the real-world equivalent.

This is not official Anthropic terminology—it is the author's own naming. At the time of Claude of Duty, there was no name for it; the method was formalized only after the prompt was written.

### Contents

From the author's explainer, we can identify five elements.

| Element | Content |
|---|---|
| 1. Provide only the goal | Do not specify how to make it (structure, division of labor, steps). The author writes, "Give only the destination, let them choose the path." |
| 2. Place a reference to compare against | "Very good" is not a standard. Place something you can compare side by side, like a screenshot of a real game. You don't need to reach it. When you don't know the standard, finding it is part of the work. |
| 3. Break into components | Break into the smallest units that can be improved and judged independently. Let the directing agent decide how to break them down. |
| 4. Do not let the maker score | Activate the critic in a fresh context with only the goal, standard, rules, and output. Do not provide the maker's history or explanations. Hide which is your output and which is the reference, and let it choose the better one. |
| 5. Place no stopping point | Do not write "stop after 3 rounds." Stop when you are satisfied, when improvements become small, or when you use up your computation budget. |

As support, for long runs, you can have an agent update an HTML page (or `workbench.md`) showing progress and view it on your smartphone. At the end of each round, you can place one new agent to review everything and ensure consistency—a "smoothing pass." The author notes that the core remains "divide, make, judge, repeat."

The execution environment assumes an agent environment (Claude Code or Codex) that can open files, run code, take screenshots, and launch sub-agents. The author explicitly states this method does not produce the same results when pasted into a chat.

### Alignment with Anthropic's Official Blog Patterns

Anthropic's official blog post [A harness for every task: dynamic workflows in Claude Code](https://claude.dev/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code/) (June 2, 2026) describes how Claude can run multiple sub-agents on its own in "dynamic workflows." The term Gauntlet Loop does not appear in that article. However, some of the patterns described align with Gauntlet Loop's elements.

| Official Blog Pattern / Description | Gauntlet Loop Element |
|---|---|
| Adversarial verification: A separate agent verifies each generated agent's output against a standard. | Place a maker and a separate critic for each component (elements 3, 4). |
| Loop until done: Continuously generate agents until a stopping condition is met, not a fixed number of times. | No stopping point (element 5). The blog's example uses "no new discoveries." Gauntlet Loop uses "beat the reference, or a human stops it." |
| Avoid "self-serving bias"—favoring your own results—by using separate agents in separate contexts. | Do not let the maker score (element 4). |
| In exploratory tasks with preference (like design), give the reviewer the standard and continue until they judge it met. | Place a reference to compare against (element 2). |
| Fan out: divide into many pieces and run in parallel. | Break into components (element 3). |

The alignment we can confirm extends to what the table shows. The blog does not address the fact that the reference is a real product, or blind A/B comparison. The blog also states in its sorting section that "pairwise comparison is more reliable than absolute evaluation." Gauntlet Loop's "choose which is better" approach points in the same direction, but the blog is talking about sorting.

## How Claude of Duty Used It

### Prompt Structure

The prompt is [prompt.md](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md), about 150 words in 3 paragraphs. It states only the goal, sub-agent division, a blind impartial critic comparing to the real thing, an instruction not to stop, and mentions of Three.js, `/loop`, and `ultracode`. There is no design document, feature list, or game rules. The contract file [ARCHITECTURE.md](https://github.com/mshumer/Claude-of-Duty/blob/main/ARCHITECTURE.md)—directory ownership, prohibitions, event names—is the agreement to keep parallel agents from interfering. Who wrote it is not confirmed in public materials. Details are in the [Claude of Duty case study](/en/cases/claude-of-duty/).

### Scoring Over Time

According to the README (as of September 2026), 11 independent critics scored the game screen compared to the real Call of Duty on a scale of 0–10.

| Item | Result |
|---|---|
| Score progression | 3.59, 4.14, 4.05, 5.05 (last after optimization) |
| Blind A/B comparison | Every critic chose the real version in every round. |
| Judgment breakdown | 2 images rated "CLOSE," the rest "AMATEUR." |
| Author's assessment | Did not reach the target. Weak points: hands, material texture, distant enemies, indirect lighting, frame rate. |

The README numbers do not go into what happened in each round. The time is described only as "many hours" in the explainer; specific values and costs are not published.

### Parallel vs. Sequential Comparison

The README's "Process note" contains a record of how they divided the work.

| Approach | Score Change | Number of Defects Breaking the Screen |
|---|---|---|
| 6 people assigned to each directory in 3 parallel rounds | +0.46 | 60 → 47 → 66 |
| 1 person sequentially fixing each coupled concern | +1.00 | 66 → 26 |

The reason given is that tone mapping, sky, and indirect lighting are tightly coupled, so parallel assignees kept breaking each other's assumptions. The explainer recommends "divide into the smallest units," but this record shows that dividing too much can backfire. Divide based on coupling strength, not directory structure. (See [parallel-agents](/en/agent-dev/parallel-agents/).)

Another record shows an example where the critic misidentified the cause. For 3 rounds in a row, the weapon was flagged as "missing texture." The actual cause was too-strong reflection drowning out diffuse color; responding to "too bright" feedback by darkening it made things worse. The fix was opposite to the feedback.

### Why It Did Not Finish and Its Limits

- The exit condition was "beat the reference," and it did not beat it. The author writes that improvements were still happening when he stopped. This matches the design: "reaching the reference is optional."
- In his self-assessment in the README, the author explicitly states he did not reach Call of Duty.
- The critic sees only static frames, not real play performance. Static camera measurement showed 94 fps, but real play ran at 12–17 fps with pauses over 700 ms. That is why measurement tools (`tools/` for screenshots, image diff, frame-time distribution) were set up first.
- Game design (missions, progression, balance) is not included in the prompt or the author's evaluation in the README.

## Why It Works and Where It Does Not

### Why It Works

From the author's explanation and the official blog, the principles backed by evidence are these:

| Principle | Basis |
|---|---|
| Place a reference to compare against | The author writes the standard is crucial. "Sort of good for AI" does not tell you what to aim for; the reference does. |
| Show the critic output only, not the maker's explanation | The author explains the maker remembers its own reasoning and excels at plausible justification. The official blog's "self-serving bias" is the same problem. |
| Keep components small | "Make the game better" is easier to loop than "make this tree match the reference image." (author) |
| Place no stopping point | If the standard is high, there will always be a gap left to close. A human or a budget decides when to stop. (author) |

The same principles appear in other case studies.

- [THE LONG SILENCE](/en/cases/oneshot-long-silence/): A 24-hour `/goal` with an independent judge comparing the output to a Starfield-like space game screenshot. The author's X post forbids rewriting the judge's prompt to ease conditions.
- [Starfall](/en/cases/oneshot-starfall/): Used Shumer's prompt with Homeworld as the reference instead. The critic's score is not published.
- [fable51-worlds](/en/cases/oneshot-fable51-worlds/): A long design-document-style prompt, but with an independent review agent. The README states "the maker does not score its own work."

### Cost

| Case Study | Cost | Source |
|---|---|---|
| Claude of Duty | Not published | README, Issue #30 asks but no answer |
| Starfall | About $633 (first run. 4.6M output tokens, 837M cache reads) | [README](https://github.com/e01-ai/starfall) |
| Union Square (fable51-worlds) | About $33, about 2 hours, about 8M tokens | Author's Hacker News comment (2026-09-02) |

In Starfall, most of the cost came from cache reads of accumulated context over a long run. The longer you run and the more critics you add, the more you re-read. How to think about costs is in [cost-management](/en/agent-dev/cost-management/). The official blog also states dynamic workflows use many tokens and suit complex, high-value tasks—you do not need 5 reviewers for routine coding.

## Procedures for Your Game

You can use Gauntlet Loop for anything where "output can be inspected and fixed." The author also notes it applies beyond games (websites, writing, backends). Here is how to adapt it to game targets, a suggestion from this article.

### 1. Decide the Goal and Reference

| Target | Reference Example | What the Critic Sees |
|---|---|---|
| Appearance of a 2D action game | Screenshots of the target existing game or a finished image you drew | Game screen screenshot |
| 2D puzzle board | A puzzle board from an existing game that feels readable | Board screenshot, screens per move count |
| UI | A screen from an app you find easy to use | Screenshots of screen transitions, the task being performed |
| Pixel art | A reference drawing and constraints you set (resolution, color limit) | Zoomed image of the drawing. Color and resolution checked by script automatically. |
| Sound | Reference audio. Listening comparison done by you. | Measurements: loudness, silence gaps, clipping. |
| Level | Table of target clear time and clear rate | Bot playthrough result log |

When you do not know the standard, as the author recommends, finding it is part of the work (ask the agent, "What counts as a comparison or measurement matching a reference in this task?").

Do not mix reference images into the final product; use them only for comparison (see "Reference sourcing and rights" below).

### 2. Decide Evaluation Perspectives and Scoring Format

Narrow perspectives to 5 or fewer. Pick one scoring format:

- A/B comparison with both sides unlabeled, showing win/loss (Claude of Duty's format).
- 0–10 points per perspective each round, showing previous scores and reporting where scores dropped.
- Pass/fail against a target range for numeric values (balance, performance, loudness).

With any format, have it output "up to 1–3 items with the biggest gap, with location" so the maker can fix. Do not have it list preference-only complaints.

### 3. Separate the Maker and Critic

- One maker agent per component. Tightly coupled components (lighting, color grade, shadow) should be handled by one agent in order.
- Activate the critic in a fresh context each time. Provide only the goal, reference, rules, and output. Do not provide the maker's explanation or code.
- In A/B comparison, rename files to `a.png` and `b.png` so only the directing agent knows which is the reference.
- Do not let the critic edit. Restrict its available tools.

Claude Code sub-agents have their own context window, system prompt, and available tools, and return only a summary. You can narrow down tools with `tools` ([Create custom subagents](https://code.claude.com/docs/en/sub-agents), as of October 2026). An example `.claude/agents/gauntlet-critic.md`:

```markdown
---
name: gauntlet-critic
description: A critic agent comparing screens to a reference and pointing out the biggest gaps. Does not edit.
tools: Read, Glob
---

You are a stern critic. You are not the maker.

Judge only from the images given. Do not read code or work history.

Compare a.png and b.png, choose the better one, and list up to 3 points where the worse one lags, with location.

Do not list preference-only complaints.
```

### 4. Decide Loop Count, Time, and Budget Limits

The author recommends "place no stopping point," but you as a human set a limit. The author himself lists "when you use up your computation budget" as a stopping condition. Decide in advance:

- Maximum rounds per component.
- Overall time and budget limit.
- Test first on a small scope (one component), note the cost per round. Official documentation also recommends testing on a small scope before a large task ([Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows)).

### 5. Decide Exit Conditions

| Condition | Example |
|---|---|
| Beat the reference | The critic chose your version. |
| Score at target or higher | All perspectives 7+ points. |
| Improvement becomes small | 2 rounds in a row, change under 0.3 points. |
| Hit budget limit | 6 rounds, or 2 hours. |
| You stop manually | You saw the progress page and liked it. |

### 6. Where You Check In

Review the progress page every few rounds, actually play the game (appearance pass and fun are separate), verify the critic's feedback with measurement to ensure it is not misdiagnosing, watch the cost speed, and watch the progression. These four points matter.

### Claude Code Execution

The tools available to run this, confirmed in Claude Code docs as of October 2026, are:

| Feature | What It Does | Use in Gauntlet Loop |
|---|---|---|
| `/goal` | Given a completion condition, a small model checks after each turn whether it is met, looping until it is. The condition is up to 4,000 characters. The evaluator sees only what appeared in the conversation. You can add conditions like `or stop after 20 turns`. `/goal` shows status (elapsed time, turn count, token use); `/goal clear` removes it. ([Keep Claude working toward a goal](https://code.claude.com/docs/en/goal)) | Write the "keep going" condition and limit. Have the critic's judgment print to the conversation. |
| `/loop` | Reruns a prompt at fixed time intervals. Omit the interval to let Claude pick. Scheduled tasks expire 7 days after creation. ([Run prompts on a schedule](https://code.claude.com/docs/en/scheduled-tasks)) | Use this for time-based reruns. Use `/goal` for condition-based looping. |
| Sub-agents | Separate context and restricted tools, task-specific workers. | The maker and critic. |
| `isolation: worktree` | Run a sub-agent in its own worktree. | Isolation when the maker touches the same files (see [parallel-agents](/en/agent-dev/parallel-agents/)). |
| `ultracode` | Add to a prompt to have Claude write a dynamic workflow launching many sub-agents. Enable for the whole session with `/effort ultracode`. Token consumption increases. | The author recommends it for large-scale runs. |

Example of how to use `/goal`:

```text
/goal All components in reports/critic-latest.json are "pass", and npm run verify exits 0. Or, stop after 30 turns.
```

The `/goal` evaluator does not read files by itself. Have the critic not only save its judgment to a file, but also print it to the conversation. While sub-agents are running, evaluation for that turn is deferred (same documentation).

## Prompt Templates

Templates written for this article. Replace the text in `( )` with your game details. Like the author's explainer, write only the goal, reference, how to divide work, critic conditions, and the "keep going" condition—not design details.

### 1. Polishing the Appearance of a 2D Action Game

```text
Goal: Polish the appearance of (game name) to match the visual standard in docs/reference/. Do not change the game rules or controls.

Division: Break the screen into components you can fix and judge separately (background layers, protagonist, enemies, effects, HUD, etc.). How to divide is your choice. Tightly coupled components (color grade, lighting, shadow) should be handled together by one person in order.

Assign one maker agent and one critic agent per component. The critic runs in a fresh context each time.

What the critic receives: the goal, reference images, current screen from npm run shot. Not the maker's explanation, code, or history.

Critic's job: Rename files to a.png and b.png (2 images, only the director knows which is the reference). Choose the better one. If your version loses, list up to 3 points of biggest gaps with location. Do not list preference-only complaints.

Maker's job: Fix the criticism, pass npm run verify, then send to the critic again.

Constraints: Do not copy artwork or materials from the reference into the game. Reference images stay in docs/reference/. Do not rewrite the critic's prompt to ease conditions.

Progress: Update docs/progress.html with screenshots and judgments per component over time.

How it ends: No fixed stopping point. The critic chooses your version for all components, or you stop it. If total time exceeds (2) hours or total cost exceeds ($20), stop and report.
```

### 2. Verify Game Balance

```text
Goal: Keep (game name)'s difficulty for (first 5 stages) within the target range in docs/balance-target.md.

Reference: docs/balance-target.md table (target clear rate, average clear time, number of stuck points per stage). This replaces a real game as the reference.

Maker: Adjust only the numbers in data/balance.json. Do not change stage structure or rules.

Verifier: Runs in a fresh context each time. Use a fixed random seed and have a bot play each stage (1,000) times. Output a table: clear rate, average time, breakdown of loss causes. Do not read the maker's explanation.

Critic: Look only at the verifier's table. List up to 3 items outside the target range, most off-target first. For items where a bot limitation (different move than humans) plausibly explains it, note that. The maker fixes the criticism and sends to the verifier again. If the same item is outside range for 3 rounds straight, report it as hard to fix with numbers alone and stop.

How it ends: All items within range, or 10 rounds reached.

What you verify: At the end, you play it and write your thoughts. The bot result is your starting point.
```

### 3. Verify UI Usability

```text
Goal: Make (game name)'s menu and settings screens usable for a first-time player without confusion.

Reference: docs/reference/ (game screens you find easy to use), and docs/tasks.md (tasks like "set volume to half," "save and quit"—about 5 total).

Critic: Play the role of someone seeing this game for the first time. Runs in a fresh context each time. You receive only screenshots (from npm run shot-ui) and task text. Not the maker's explanation. For each task, note where you would operate next, why, where you got confused, how many steps you needed.

Maker: Fix the confusion in wording, layout, size, or color. Do not remove features.

From the second round onward: give the same task to a new critic and compare: did the step count drop?

Constraints: Do not copy layout or artwork from the reference.

How it ends: All 5 tasks: the critic solves without confusion, reaching the same number of steps as the reference or fewer. Or, 8 rounds reached.

What you verify: You try it on smartphone and game controller too.
```

## Common Pitfalls

| Pitfall | What Happens | How to Fix |
|---|---|---|
| Critic becomes lenient | A critic that is also the maker grows lenient on itself (official blog "self-serving bias"). Running a critic in the same context has the same effect. | Critic is a new sub-agent each time. Never give it the maker's explanation, only the output. |
| Critic's conditions get relaxed | The director might rewrite the critic's rules to finish (author's conjecture). | The author of THE LONG SILENCE forbids rewriting the judge's prompt in the prompt itself. |
| Too strict to finish | The judge stays unsatisfied and runs until you manually stop (THE LONG SILENCE ran 24 hours, unfinished). | Set round, time, and budget limits upfront. |
| Costs balloon | Starfall cost about $633. Mostly from cache reads. | Test small. Watch token use in `/goal` status. |
| Feedback misdiagnoses the cause | In Claude of Duty, the weapon was flagged "no texture." It was actually too-strong reflection drowning diffuse color. Fixing "too bright" made it worse. | Treat feedback as a symptom. Verify the cause with measurement. If scores drop, revert. |
| Only appearance improves | Game rules, progression, balance stay out of the critic's scope. Starfall saw many operation and scaling issues after launch. | Set game-design perspectives separately. Have a human play to verify. |
| Reference sourcing and rights | Existing game video or images accidentally get mixed into the final product. | See below. |

### Reference Sourcing and Rights

Claude of Duty's reference was actual Call of Duty gameplay—used only for comparison. Starfall describes itself as an "independent homage that uses no art, audio, code, or trademarks from Homeworld." For your game, we recommend this approach (the author's view):

- Keep reference images in a comparison-only folder. Do not include them in your game build. If you publish source, do not put them in the repository.
- Show references only to the critic, not the maker. This reduces paths for accidental copying.
- Do not have the maker recreate artwork or materials themselves. The standard is "quality level," not a template to imitate.
- Publish only materials you made or have permission to use. (See [copyright](/en/legal/copyright/).)

## Game Feel and Fun Are Human Decisions

Gauntlet Loop excels at properties that show on screen and can be compared.

| Strength | Weakness |
|---|---|
| Visual quality, consistency, breaking points | Whether it is fun to play |
| Performance, frame time, measurable values | Game feel (recoil, impact, jump sensation) |
| Component alignment (smoothing pass) | Finding the root cause (feedback is symptom-only) |
| Numeric convergence to a target (balance, performance) | Final human confirmation of clarity |

Claude of Duty's scoring focused on rendering and technical quality; game design was out of scope. Starfall's post-launch fixes were mostly operation and readability. THE LONG SILENCE's README centers on rendering and verification, not whether collecting 7 resonators is fun.

This is where humans decide. How to turn operation lag, recoil, and impact sensation into numbers and fix them is in [game-feel](/en/agent-dev/game-feel/). How to build critics and measurement tools is in [verification-loop](/en/agent-dev/verification-loop/). How to playtest with humans is in [playtesting](/en/design/playtesting/). How to adjust numbers is in [balancing](/en/design/balancing/).

The rule of thumb is this: use Gauntlet Loop to polish appearance to the limit. Use yourself to decide gameplay. Then run Gauntlet Loop again on top of gameplay you decided, to refine appearance and performance.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: First version.
<!-- AUTO-UPDATE:END -->

## References

- [Matt Shumer's naming post (X)](https://x.com/mattshumer_/status/2081830214384886228) — "Gauntlet Loop" named, 2026-07-27 (UTC)
- [How to Run a Gauntlet Loop (Matt Shumer)](https://somethingbig.ai/gauntlet-loop) — Method explainer
- [mshumer/Claude-of-Duty (README)](https://github.com/mshumer/Claude-of-Duty) — Score progression, parallel vs. sequential, self-assessment
- [prompt.md](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md) — Original prompt
- [ARCHITECTURE.md](https://github.com/mshumer/Claude-of-Duty/blob/main/ARCHITECTURE.md) — Agent contract
- [A harness for every task: dynamic workflows in Claude Code (Anthropic)](https://claude.dev/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code/) — Adversarial verification, loop until done, patterns
- [Keep Claude working toward a goal (Claude Code Docs)](https://code.claude.com/docs/en/goal) — `/goal`
- [Run prompts on a schedule (Claude Code Docs)](https://code.claude.com/docs/en/scheduled-tasks) — `/loop`
- [Create custom subagents (Claude Code Docs)](https://code.claude.com/docs/en/sub-agents) — Sub-agents and worktree isolation
- [Orchestrate subagents at scale with dynamic workflows (Claude Code Docs)](https://code.claude.com/docs/en/workflows) — `ultracode`, token viewing
- [Anshu Chimala's prompt post (X)](https://x.com/anshuc/status/2081801979131818412) — Judge agent with `/goal`
- [e01-ai/starfall (README)](https://github.com/e01-ai/starfall) — Cost breakdown
- [PhiloLabs/fable51-worlds (README)](https://github.com/PhiloLabs/fable51-worlds) — Maker does not score its own work
- [Fable 5.1 World Modeling (Hacker News)](https://news.ycombinator.com/item?id=49541458) — Union Square cost disclosure
