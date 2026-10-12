---
title: How we made claude.ai 3x faster in two weeks
description: We explore Anthropic's official Claude Code blog article about performance improvements, including the approach of creating measurable metrics before optimization, using Slack threads for iteration loops, guardrails, and human roles. This article extracts insights that web game developers can apply.
sidebar:
  order: 11
lastUpdated: 2026-10-04
---

## Overview

This article is a deeper dive into the Claude Code official blog article "How we made claude.ai 3x faster in two weeks." The entry point to the series is [Claude Code Official Blog Series](/en/claude-blog/).

- Original article: [How we made claude.ai 3x faster in two weeks](https://claude.dev/blog/how-we-made-claude-ai-faster/)
- Published: September 23, 2026. Authors: Raymond Wang, Sam Attard, Issac G. Reading time: 15 minutes (as shown in the original). Category: Engineering

The original article covers how Anthropic made its web app (claude.ai) and desktop app faster during a two-week sprint in August 2026. It is not a game development article and does not discuss games. The article reports on how Claude was stationed in every Slack thread, tasked with measurement, benchmark creation, fixes, and deployment monitoring.

For game developers (especially those building browser-based games), the portable take-aways are methodological. Create measurable metrics first, place guardrails in your CI (automated tests that run with every code change) to prevent regression, and let humans set goals, taste, and direction. This article first covers the original content, then summarizes the game development applications in the "Use in game development" section.

## Results and overview of approach

These are the numbers from the beginning of the original article. The team focused on four user journeys that account for 95 percent of user activity. The values are at the 75th percentile (p75, representing the slower end of the user distribution).

| User journey | Before | After |
|---|---|---|
| Load claude.ai from scratch and be able to type | 3.1 seconds | 0.55 seconds |
| Start a new Claude Code session | 0.8 seconds | 0.3 seconds |
| Load a Claude Cowork cloud session | 2.6 seconds | 0.73 seconds |

According to the original article's figure captions, this is a comparison of real user monitoring (RUM) data from August 13 and August 27. The team estimates that total waiting time decreased by tens of thousands of user-hours per day.

The overall approach was as follows:

- Run everything in a single Slack channel, with Claude in each thread
- Used Claude Tag (beta) and an internal research model roughly equivalent to Opus 5.5
- Claude handled bottleneck detection, benchmark creation, improvement implementation, and deployment monitoring. Humans made decisions about goals, trade-offs, and approved all changes
- Integrated more than 3,000 changes without any visible outages or rollbacks

## The initial brief

Before the sprint, the team created a Slack channel and placed standing instructions for Claude. The essence of the instructions shown in the original is: handle everything related to performance of the claude.ai website and desktop app. This includes monitoring deployments for performance regressions, evaluating existing telemetry for accuracy and gaps, maintaining a clear monitoring dashboard, implementing discovered issues and achievable improvements independently, proposing performance work, and maintaining communication with human teammates. The brief also notes that while the final goal is full autonomy, that is not yet possible.

### Four user journeys and thirteen measurements

The team gave Claude access to Datadog's MCP server (a tool for connecting external systems to Claude) to analyze usage data. Claude selected the four journeys with the most impact:

1. Launch the app
2. Start a conversation
3. Load an existing conversation
4. Send a message

Across web and desktop products, this resulted in 13 measurements. To create a baseline, the team added more measurements until each measurement could be compared. Each measurement starts with a user action and ends with the result being rendered, with client-side and server-side work clearly distinguished.

### About 20 candidate issues and the first three days

The team prepared about 20 candidate issues at the start of the sprint. Each targeted one user journey. Claude estimated the effect of each in milliseconds and added those up to set the sprint's goals. The team achieved 12 of 13 goals by day three.

Examples of planned work include:

- Faster startup: baked a static input field directly into the HTML so it could accept input while React was initializing. The desktop shell pre-compiled the V8 code cache so the main process did not have to recompile from scratch each time
- Faster navigation between conversations: kept the input field mounted across conversations. Preloaded hovered sessions. Reduced sidebar re-renders by 90 percent

When the planned work finished early, the team let Claude use the remaining time. Claude found opportunities and proposed new work that grew into independent issues. The team re-set goals and looked for more measurable targets. The human instruction was simple: since we are funding nearly every issue, let us revisit what is untouched, what we can climb next, and where the opportunity is largest. Even unconventional ideas are welcome.

## "Everything can become hill climbing"

This is the central section of the original article. Hill climbing is the practice of choosing one metric, then repeatedly finding changes that improve it.

### What can be measured in the lab

The starting point was to iterate faster than deployment frequency. Claude could work asynchronously for hours or overnight, so the team wanted to validate changes in the lab without waiting for real user data. To do this, they looked for ways to measure performance in a lab environment.

Wall-clock time (the time actually elapsed) is what users feel, but it has high variance and millisecond values are not reliable for CI gates. The breakthrough Sam found was instruction counting. It is deterministic (the same value every run). In the original thread reproduction, Claude answered as follows:

- Pure JavaScript work: run benchmarks under Valgrind with `node --predictable` and compare against baselines stored in the repository. One run is enough. No statistics needed
- Work in the browser: Chromium does not count instructions, but there are other deterministic numbers. React commit count per operation, V8 precise coverage by function call count, layout and style recalculation count, DOM change count

Within 11 minutes, five threads were running. Instruction count, V8 call count, React commits, style recalculation, and DOM changes, one thread each.

### Skepticism about benchmarks

The team treated new benchmarks with skepticism. Each benchmark had two roles. One was to be a metric Claude could run in the lab. The other was to act as a guardrail in CI, allowing values to move only downward (a ratchet). Unstable benchmarks or those that did not correlate with user latency were discarded to prevent Claude from climbing the wrong mountain.

Claude was told to prove that improvements in these metrics would lead to wall-clock improvements and to discard candidate benchmarks that could not be proven. For proof, they picked two processes: building a message tree in a conversation and a scanner finding the status line in Claude Code output. Claude profiled both with Valgrind and found that in the first process, one quarter of the instructions came from a megamorphic dictionary lookup (retrieving the same message ID three times separately, with types so varied that the JIT could not optimize). Within an hour, Claude had reduced instruction count for both processes by 48 percent and 31 percent respectively, and wall-clock time had dropped by 78 percent and 44 percent.

This meant instruction count was correlated with wall-clock time. The team added ratchets to these two paths. After that, any PR that increased instruction count would fail CI, and daily jobs would lower the limit if the count went down.

### Central lesson of the sprint

The original article sums this up as: "With Claude, anything measurable is achievable." Before, measurement was stage zero—add metrics, wait for data, then begin to understand the problem. With Claude, measurement is the first step of climbing. If there is a number to beat, optimization can begin immediately. The biggest win was adding more things to measure.

## The loop by thread

Everything happened in a single Slack channel, with multiple engineers and Claude discussing in threads. The loop settled into this shape:

1. Someone opens a thread saying a part of a user journey is slow, often with screenshots or recordings
2. Claude traces the flow and finds or creates a benchmark showing the problem
3. When promising lab results emerge, Claude opens a PR. Claude splits changes based on risk and review ease, placing user-visible changes behind feature flags
4. After shipping, Claude monitors the deployment and reads real data
5. If improved, the team lowers the benchmark ratchet to lock in the gain. If not improved, they turn off the flag and repeat
6. Look for the next slow spot in the same journey

### Example: Screen jitter (layout shift)

Someone shared a screen recording showing sidebar rows appearing after page load. Chat and Cowork rows were determined at different times, making the page feel jerky. Existing monitors had not caught this. The closest existing metric, CLS (Cumulative Layout Shift), showed about 0.008 per shift, within the "good" threshold of 0.1.

Issac thought to look directly at the Layout Instability API (the browser's record of layout shifts). Claude created telemetry events that mapped each shift to a region (sidebar, conversation history, etc.) and stage (before first paint, after input became available). Claude also wrote an integration test that held sidebar data until after first paint and failed if any named region shifted. The fix used this test for proof: 20 out of 20 runs on main failed (red), 20 out of 20 runs on the fix PR passed (green).

After deploying the events, reading real data showed that 31 percent of web page loads had something moving after the user became able to input, without the user doing anything. Claude systematically eliminated the causes by name. Delayed header rows, the caret shifting horizontally after the username loaded, the scrollbar appearing and moving the list. The team fixed clusters of top causes, and when those disappeared, Claude found the next group.

## Scaling horizontally

Once the loop worked in one thread, the rest was just opening more threads. Rather than closing threads when requirements were met, Claude kept going. Single threads produced 50, sometimes 100 optimization PRs. Claude increasingly opened new threads to pursue opportunities it found through separate investigations or overnight jobs, rather than waiting for human direction. The original article reports that more than 150 threads were running at peak.

Every time something was measured, something was found.

| What was measured | What was found |
|---|---|
| Count of React hooks | The input path for the input field had 6,900 hooks and 900 store subscriptions, causing a re-render on every keystroke |
| Style recalculation count | A single `:root:has()` selector was adding 24 milliseconds every DOM change |
| Code paths after first paint | Remaining `location.reload()` calls were causing 500,000 invisible reloads per day. None of the load metrics caught this |
| Profile of idle tabs | The same cache snapshot was being duplicated to IndexedDB twice per minute on the main thread |

### Example: An em-dash stops the page for one second

While sweeping for CPU hangs, Claude noticed that syntax highlighting a finished code block sometimes froze the page for about a second. Investigating the cause in the lab, Claude found it was the em-dash (—). When the reply Markdown contained even a single character outside Latin-1 (basic Western characters), like an em-dash or curly quote, V8 held the entire string in UTF-16 (two bytes per character). Then the syntax highlighting regex would take the slow two-byte path for every character. A fix in about 20 lines of code copied each code block to a single-byte string before highlighting.

### Scale of the effort

By week two, daily reports could not contain the work, and the busiest days saw more than 200 changes land. Claude kept proposing new benchmarks, and about one third of PRs included additional telemetry or guardrails. With each new measurement came a new thread and opportunity. Everything was public in one channel, so other teams started bringing their changes to performance review, and thanks to the guardrails and Claude's skills, new work became performance-conscious.

## Guardrails

Nearly everything touched hot paths: first paint, input field, conversation history. So the team built safety mechanisms first:

- Every PR goes through automated review and approval from at least one human
- Always write unit tests before optimizing
- Changes that could cause visible issues are shipped behind short-lived feature flags

When flags accumulated, the team opened a thread to coordinate rollout and cleanup. Claude classified all flags as kill-switches (to stop in an emergency) or ramps (to roll out gradually), and removed them as they became safe. The team introduced about 200 flags in two weeks; more than half were removed by the end.

### Preventing regression

In a fast-shipping codebase, performance wins regress. Because Anthropic ships code quickly, the team invested in protecting proven wins. An example was the static input field. The page shows an HTML copy almost immediately, with React rendering on top. If React is off by one pixel, the effect disappears—a fragile system. Claude created dozens of guardrails:

- Static markup was generated by rendering the actual React component with jsdom (a library for handling DOM without a browser) and tested to ensure they do not drift
- Integration tests compared the static page and React render across 14 viewport sizes, confirming alignment within one pixel
- Key input tests kept typing during the handoff and failed if any key was dropped or reordered
- In production, every handoff reported drift to 0.1 pixel precision, and Claude opened a thread on every event showing non-zero movement

For what the lab could not catch, the team used the oldest guardrail: gradual rollout. High-risk changes went to employees first, then one percent of users, then everyone. Four hours after shipping the static input field internally, a colleague shared a recording of a layout shift that no metric had caught. Opening a new tab on claude.ai made the input field drop. But the cause was not Anthropic's code.

Claude's investigation showed:

- On new tab pages, Chrome draws a 56px footer ("Managed by anthropic.com" etc.) at the bottom. When you navigate to claude.ai, that footer vanishes and the page grows 56px taller, about 100 milliseconds after first paint
- `/new` positions the greeting and input field at 18 percent of page height, so 0.18 × 56 is about 10px drop. The recording measurement also showed 10px
- It happens "sometimes" because Chrome prerender the page while you type in the address bar, that hidden page is built to the current tab's height (slightly shorter due to the footer), and only after displaying does it stretch
- The handoff from static input to real input was 0px in all 49 loads that day
- The issue had been latent, but the page had never rendered this quickly. Headless Chrome has no browser UI, so layout tests do not see it

Claude traced all the way to Chrome's edge case with prerendering, locked layout across resizes, and added a test simulating the prerender flow.

## Human role: Steering

The loop was productive but not autonomous. Going fast, safely, and not off the rails was the human job, split three ways:

### Ambition

Claude defaults to being cautious about scope. It turns findings into tickets, hedges feasibility, and leaves slack in estimates. But the humans had confidence in the guardrails, so especially early on they often pushed Claude to be bolder, the original article says. In a thread reproduction, when Claude said it would ship a small PR this week, Raymond said to ship it now, approve it immediately, and be bolder. Claude replied it would ship a PR within an hour. As threads hit their goals and went flat, Sam would write the same one-liner to every thread: the goal is not where you stop, what is next, think ambitiously.

### Taste

Each thread had a named human owner. Claude showed user-visible changes with before and after screenshots or recordings and let the owner judge. The questions the original lists are:

- Do we populate the table cell by cell or wait for rows to align?
- Show skeleton loading immediately or half a second later?
- Is fading each word in streaming text worth the frame budget impact (one fifth)?

Claude found ways to shave milliseconds; humans put trade-offs on the scale.

### Direction

Threads were kept intentionally narrow. Limited to one benchmark or journey, searching for improvements only in that scope. The original compares them to 150 "hammers looking for nails." Most human judgment was about order and user impact. Which screen to prioritize, how to combine threads that interfere with each other, when to close a thread with diminishing returns. One 900-line PR got a one-line reply: maintaining this build plugin does not justify two milliseconds per send.

## The 8-millisecond budget

One tangent shows the big picture well. To demonstrate syntax highlighting regex optimization, Claude added a screen recording of long replies streaming in the lab, with frame rate display in the corner (calculated from animation frame timestamps on the page).

Raymond asked if the 60fps ceiling was hard or if scroll and streaming could go to 120. Claude said the environment was 60Hz because that is Chromium headless's default, but 120 should be possible, and reported back in 25 minutes. Using DevTools frame control (begin-frame), Claude had driven headless Chrome at a deterministic 120Hz. In 240 begin-frames, exactly 240 frames, each 8.33 milliseconds. This made "does this frame fit in the 120Hz budget" a precise, noise-free read.

With an 8.33 millisecond per-frame budget, Claude incremented through long replies frame by frame, measuring frame time to find slow spots. Here is what it actually did:

- Eliminated O(message length) processing proportional to message length per chunk by memoizing finished blocks
- Moved tokenization of growing code fences to a worker (separate thread)
- Showed tables cell by cell

This thread alone took nearly 60 PRs. The time long replies spent stopping the main thread dropped from about 750 milliseconds to about 200 milliseconds, CPU use to one third, and a 120Hz MacBook maintained 120fps from start to finish. The 120Hz test environment became an overnight job where Claude watches for regression. The official account post quoted in the original (August 24, 2026) says streaming became about 4x smoother, long-reply hangs on slow notebooks dropped to one ninth, and the worst hiccups dropped to one fourth.

The team had not originally planned to hill-climb the milliseconds between frames during streaming. If it is measurable, Claude can climb it—that is the sense of the original's closing reflection.

## Looking forward

The original article states that claude.ai and the desktop app are about 3x faster than early August, and ratchets will keep them there. Remaining work includes the 95th percentile, other user journeys, and very long conversations. A future article will also cover tangents during the sprint (contributing to [Electron](https://www.electronjs.org/), Chromium, Node.js, etc.).

## Applying this to game development

The original article does not mention games. The following is this Wiki's thinking (speculative) about how to apply it to small browser-based games. This is not part of the original article.

### Techniques you can take away

| Technique from the original | Application to browser games (speculative) |
|---|---|
| First, align measurements for each user journey | Measure "until you can operate on the title screen," "until stage start," "until a button click triggers a response," with defined start and end points |
| Create CI guardrails with deterministic numbers, not wall-clock time | Count function calls, elements processed, etc. in enemy updates, collision checks, pathfinding, and fail the test if a baseline is exceeded |
| Lab frame budget | For 60fps, about 16.7ms per frame; for 120fps, about 8.3ms. Measure frame processing time and track how many frames exceed budget |
| Look at hiccups (p99) | Not average fps, but the worst 1 percent of frames. The examples in [Web game tech stack](/en/agent-dev/web-game-stack/) also looked at p99 and worst-frame numbers |
| Lock in wins with ratchets | Put the baseline for a sped-up area in a file and do not merge changes that slow it down |
| Keep changes small, behind feature flags, rolled out gradually | In personal games, toggle old and new with a constant in settings, test with yourself and friends before release |

The startup story seems particularly relevant to browser games. The original's static input field technique—showing the page look in HTML immediately while JavaScript boots and accepting input—translates to showing a loading screen or title screen in plain HTML before asset loading begins (speculative). But the original's numbers (3.1 seconds to 0.55 seconds) are for claude.ai, not games.

### How to work with Claude Code

Rather than Slack residence as in the original, individual games can use Claude Code and repository scripts. Here is what this article suggests for the order of work:

1. Have Claude create "measurable things" first. Write performance metrics and how to measure them in CLAUDE.md
2. Put baselines in the repository as files
3. With each improvement, have Claude check if the metric dropped and the look did not change
4. Once improved, update the baseline and have CI prevent backsliding

A snippet from CLAUDE.md as an example:

```md
## Performance (budget)
- Update + render per frame is p95 less than 8ms, worst case less than 16ms (`npm run perf` to measure)
- On a 200-enemy stage, collision check call count does not exceed `perf/baseline.json` (run `npm run perf:count`)
- Performance changes: include output from `npm run perf` before and after and diff from `npm run shot` in the PR
- Only update baseline.json downward (never upward) after confirming speed improved
```

Concrete examples of how to measure (frame time aggregation without lockstep, image diff) are in [Verification loop](/en/agent-dev/verification-loop/). The original's DevTools begin-frame approach to advancing 120Hz frames deterministically is the same thinking as "random seed and fixed tick" there (speculative).

Instruction counting (Valgrind) targets pure JavaScript. In games, that is functions decoupled from rendering, like damage calculation or pathfinding. The original does not cover the environment for running Valgrind. Whether it works in your setup is something to check separately, but counting function calls or elements processed is a method you can build in any environment (speculative).

### Mindset from the original, portable as-is

- Without numbers, asking Claude to "speed this up" does not let you judge if it worked. Measure first
- Verify that measurement metrics actually correlate with user experience, and discard those that do not. The original verified instruction count and wall-clock correlation on two processes before adopting it
- Keep one thread (conversation) focused on one benchmark or journey. Do not broaden scope
- Claude defaults to caution, so when it hits a goal, push it: what is next, think ambitiously. On the other hand, humans should close changes that do not justify their complexity (the original's 900-line PR for 2 milliseconds)

For parallel working patterns, see [Subagents and parallel development](/en/agent-dev/parallel-agents/). For the measurement and improvement philosophy, see the series article [Eval and hill climbing](/en/claude-blog/eval-hillclimbing/).

## How to use AI

With prompts like these, you can transfer the original's approach to a small game:

- "List three scenes in this game that feel slow. Pick a start and end point for each, and write a Playwright script to measure time. Just measure; do not fix yet."
- "Save `npm run perf` output to `perf/baseline.json` and add a test that fails if the baseline is exceeded. Only update the baseline downward."
- "Create a benchmark that counts this function's call count under reproducible conditions (fixed seed, fixed frame count) and verify it correlates with wall-clock time. If it does not, report that this metric should not be used."
- "Find places the screen moves after loading (jitter) by recording layout-shift with `PerformanceObserver` and list which elements moved."
- "For found improvements, do not bundle them. Make each PR (each commit) target one metric. For user-visible changes, toggle with a constant so you can try before shipping."

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [How we made claude.ai 3x faster in two weeks (Claude Code Blog)](https://claude.dev/blog/how-we-made-claude-ai-faster/) — Original article (September 23, 2026; Raymond Wang, Sam Attard, Issac G.)
- [Web game tech stack](/en/agent-dev/web-game-stack/) — Performance targets and how to measure p99
- [Verification loop](/en/agent-dev/verification-loop/) — FPS measurement, fixed tick, image diff
