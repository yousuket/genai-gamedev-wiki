---
title: Common Failures and How to Fix Them
description: 10 common mistakes when building games with coding agents, organized by symptom, cause, and remedy, with sources from official documentation and published case studies.
sidebar:
  order: 13
lastUpdated: 2026-10-12
---

## Overview

Development with agents moves quickly, but can fail in ways that differ from human-written code. This article organizes 10 types of failure into a symptom-cause-remedy framework: pristine-looking code that does not work, bloated files, repeated bug fixes that loop, unwanted feature additions, tests rewritten to pass, dependency proliferation, breaking changes, performance degradation, context decay, and rework. Sources include Anthropic official documentation and engineering articles, the Claude of Duty repository, and published research and incident reports.

## List of 10 failures

| # | Failure | First step |
|---|---|---|
| 1 | Code looks good but does not work | Verify that the game actually plays by scripting interactions |
| 2 | Massive file bloat | Set line limits on files and detect violations with a linter |
| 3 | Same bug fixed over and over | If the fix fails twice, use `/clear` and ask again with reproduction steps |
| 4 | Unwanted features added | Spell out scope in the request, and review the diff |
| 5 | Tests rewritten to pass | Make test files read-only |
| 6 | Dependency explosion | Forbid new dependencies, and review the `package.json` diff |
| 7 | Breaking changes | Commit before work starts, and set up regression tests |
| 8 | Performance degradation | Measure p99 and frame hitches, not median |
| 9 | Context decay | Use `/clear` at milestones and write progress to a file |
| 10 | Rework | Plan first, divide into small steps, and commit often |

## 1. Code looks good but does not work

**Symptom**: Screenshots look great, but the game does not run. Buttons do nothing. The agent reports "complete."

**Cause**: Without a way to verify, agents judge success by appearance or code shape. Anthropic's long-running agent article reports a tendency to mark tasks complete without running features end-to-end, and a tendency late in a session to declare completion because "we have made good progress already." Unit tests and `curl` calls pass, but features do not work from end to end. The Claude of Duty README also lists what the author missed: mannequin-like enemies, noisy surfaces, block-shaped hands.

**Remedies**:
- Write completion criteria in the form "can be verified by operation." Not "enemies die," but "use a script to move, fire, and verify that enemy health decreases."
- Use browser automation (Playwright, etc.) to actually operate and screenshot. Anthropic's article reports that when agents are given explicit browser-operation tools, they find and fix bugs invisible to code alone.
- List features and keep pass/fail in a file. The same article describes a method where a feature list is JSON, and agents are only allowed to change a pass/fail column.
- Claude of Duty provides a minimal playtest that automatically tries movement and firing (`tools/playtest.mjs`).

See [Verification loop](/en/agent-dev/verification-loop/) for details.

## 2. Massive file bloat

**Symptom**: A single file grows to thousands of lines. On each fix, the agent reads it in full. Similar code is pasted in many places.

**Cause**: Agents find it easier to append to existing files than to split into new ones. A count of the Claude of Duty repository (as of 2026-09-29) found the largest file, `src/world/dressing.js`, had 2,269 lines, with two files exceeding 2,000 lines. GitClear's survey through 2024 reports that copy-paste code rose from 8.3% in 2021 to 12.3%, and refactoring changes (code moves) fell from 25% to under 10%.

**Remedies**:
- Check line limits with a linter. ESLint's `max-lines` rule works:

```js
// eslint.config.js
export default [
  { rules: { 'max-lines': ['error', { max: 400, skipBlankLines: true, skipComments: true }] } },
];
```

- Write in the project instruction file: "1 file is 400 lines max. If you exceed it, propose a split first." (See [Project instruction files](/en/agent-dev/project-instructions/).)
- Schedule periodic cleanup work. Claude Code's `/goal` continues work until completion conditions are met; the official example includes "split large files until each meets its line budget."
- In Carlini's C compiler experiment, a dedicated agent was assigned to consolidate duplicate code.

## 3. Same bug fixed over and over

**Symptom**: "Fixed." "Still broken." Repeats. Each fix breaks something else.

**Cause**: Failed fix attempts pile up in the conversation, and context becomes cluttered with failed attempts. Claude Code's official best practices recommend: if the same problem takes more than one fix, context is littered with failed approaches, so use `/clear`, add what you learned to a concrete prompt, and start fresh. Often the cause is reproduced without investigation, fixed by guess.

**Remedies**:
- Create steps to reproduce the symptom (or a failing test) first.
- Instruct: "do not hide the symptom; fix the root cause." Include the error message and reproduction steps.
- If two fixes do not work, use `/clear`, then ask again, listing what was tried under "attempts made."
- Use `/rewind` (checkpointing) to roll back. Note that checkpoints record changes from Claude's file editor only, not Bash changes, so Git commits are required.
- In Carlini's experiment, a stuck agent kept writing its own list of "failed approaches" and "remaining work."

## 4. Unwanted features added

**Symptom**: Settings screens, debug keys, or logging functions appear that were not requested. A bug fix changes surrounding code too.

**Cause**: Models tend to broaden the scope of a request. Anthropic's prompt guide explains that Opus 4.5 and 4.6 add unwanted files, abstractions, and flexibility not asked for. Opus 5 may also add unrequested steps or change the work scope on its own.

**Remedies**: Write scope into the request. Here is an example adapted from the official guide, rewritten for games (written for this article):

```text
Perform only the requested changes.
- Do not add features, settings, or debug functions that were not requested.
- Do not refactor or tidy surrounding code while fixing a bug.
- Do not create generic helpers or abstractions for one-off processing.
- If you think the request is wrong, say so in one sentence, then proceed as requested.
```

- Confirm changed files in planning mode first. If the change is small enough to describe in one sentence, skip planning.
- After changes, run `git diff --stat` to see the count and size of changed files.
- When showing a diff to a sub-agent for review, instruct: "report only issues of correctness and requirements." The official best practices warn that a reviewer role can find issues in sound changes, so responding to all notes leads to overengineering.

## 5. Tests rewritten to pass

**Symptom**: All tests pass, but the game does not run. Test expectations changed silently. Implementations return test values directly.

**Cause**: When "tests pass" becomes the goal, agents take shortcuts instead of general solutions. Anthropic stated in the Claude 4 announcement that new models have 65% lower rates of shortcuts and cheats on tasks where these are easy. This reflects previous models excelling at this behavior. The prompt guide includes examples of instructions for when agents focus too much on passing tests and stop writing general solutions.

**Remedies**:
- Make spec-defining tests read-only. Claude Code will reject edits to a path listed in `permissions.deny` as `Edit(path)`:

```json
{
  "permissions": {
    "deny": ["Edit(tests/spec/**)"]
  }
}
```

- Instruct: "if you think a test is wrong, report it without editing." The Anthropic long-running agent article also strongly advises "do not delete or edit tests."
- Separate the session that writes tests from the session that implements. Official best practices mention a division where one writes tests and the other writes passing code.
- Carlini reports that the more autonomous an agent is, the more critical tests must be close to perfect, or the agent "solves the wrong problem." He spent the most time on test design.

## 6. Dependency explosion

**Symptom**: A small game has a huge `node_modules`. `package.json` lists packages you do not recognize. Package installs fail with nonexistent names.

**Cause**: Agents add packages as needs arise. Research also reports a phenomenon where agents hallucinate package names that look real. A USENIX Security 2025 survey analyzed 576,000 code snippets from 16 models and found 5.2% of nonexistent packages in commercial models and 21.7% in open-source models. Attackers can register those names first and distribute malicious code (a tactic called dependency squatting).

**Remedies**:
- Write in your instructions: "Do not add new dependencies. If necessary, explain why and ask." The Claude of Duty design document freezes dependencies to `three` only, and forbids CDN fetches and external files too.
- Before completion, review the diff of `package.json` and `package-lock.json`.
- When new dependencies are allowed, verify the package name, publisher, and recent update date before installation.

## 7. Breaking changes

**Symptom**: Adding a new feature breaks a previously working one. Files or save data disappear.

**Cause**: Agents miss side effects outside their explicit scope. In Carlini's experiment, late in the session, new features started breaking existing ones on each addition. This happens in human-written code too, but is harder to spot with more changes.

A more serious example: in July 2025, Replit's AI agent deleted a user's production database despite being instructed not to modify code. The agent claimed recovery was impossible, but rollback actually worked ([The Register](https://www.theregister.com/2025/07/21/replit_saastr_vibe_coding_incident/)).

**Remedies**:
- Commit your own changes before the agent works. One commit per feature.
- Put regression tests in CI (automatic runs) so commits do not break existing features. Carlini added this late in the experiment.
- For changes that should not affect appearance (performance work), check screenshot diffs. Claude of Duty uses a tool that fails if even one pixel moved (`tools/imagediff.mjs`), confirming the screen is identical before and after optimization.
- Do not pass production data or credentials to a development agent. Work in isolated places like worktrees. (See [Parallel agents](/en/agent-dev/parallel-agents/).)

## 8. Performance degradation

**Symptom**: Light during development, heavy on real devices. Sometimes freezes for hundreds of milliseconds. Frame rate drops each time appearance improves.

**Cause**: Agents add render load when improving appearance. Without precise measurement, the problem goes unseen. Claude of Duty's README has concrete records:

- Benchmarks with a frozen camera showed 94 fps, but actual play (at Retina resolution) showed 12-17 fps with 728-1,236 millisecond freezes. The cause was 34 or more shaders compiling mid-frame late.
- Work to improve appearance grew triangle count from 5.9 million to 11.3 million, and optimization recovered about half.

**Remedies**:
- Write a performance budget into the design document. Claude of Duty forbids per-frame memory allocation and caps particle counts by quality in its design.
- Measure lower percentiles (p95, p99) and worst frames, not median. Here is a minimal example that produces p50, p95, p99 from frame intervals:

```js
const times = [];
let last = performance.now();

export function tick(now) {           // Call at the start of your requestAnimationFrame callback
  times.push(now - last);
  last = now;
}

export function report() {
  const sorted = [...times].sort((a, b) => a - b);
  const q = (p) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
  return { p50: q(0.5), p95: q(0.95), p99: q(0.99), worst: sorted.at(-1) };
}
```

- Compile shaders before the first frame. Claude of Duty used this remedy (prewarming) to cut mid-play compiles from 34-35 to 0.
- Measure on hardware and resolution close to real use. See [Web game tech stack](/en/agent-dev/web-game-stack/) for measurement design.

## 9. Context decay

**Symptom**: As conversations grow long, instructions are forgotten, the same questions repeat, mistakes rise.

**Cause**: Claude Code's official best practices say most recommendations rest on the constraint that "the context window fills quickly and performance drops as it does." Research confirms: Chroma's July 2025 report "Context Rot" surveyed 18 models and found that as input grows long, performance on simple tasks drops unevenly. Anthropic's long-running agent article reports that compression (compaction) alone may not pass clear enough instructions to the next session.

**Remedies**:
- Use `/clear` when moving to unrelated work.
- Have the agent write progress to a file. The same article describes reading a progress log and Git history at the start of a new session.
- Hand research tasks to sub-agents and take only the summary.
- Keep instruction files under 200 lines. Longer, and important instructions get buried.

See [Context management](/en/agent-dev/context-management/) for details.

## 10. Rework

**Symptom**: Implementation finishes, then "that is not what I meant" surfaces. A large feature is requested at once, work stops halfway, and implementation is half-done.

**Cause**: Direction diverges before large work begins. Anthropic's long-running agent article cites an example where the agent tried to do too much at once, ran out of context mid-implementation, and handed off a half-done feature to the next session. Claude of Duty shows a case where the design, after three rounds of critique, turned out to require the opposite of the instruction (see [Parallel agents](/en/agent-dev/parallel-agents/)).

**Remedies**:
- Divide into phases: research, plan, implement, commit. Official best practices say you can skip planning if the change is small enough to describe in one sentence.
- Write the spec and completion criteria first. (See [Spec-driven development](/en/agent-dev/spec-driven/).)
- Request one feature at a time. Anthropic's article uses this to avoid the "do too much at once" problem.
- Build the minimum working version first, a thin vertical slice. See [Scope](/en/getting-started/scope/) for deciding what to build.

## Prevention kit

Setting up these four things first prevents most of the failures above:

| What to set up | Prevents failures |
|---|---|
| Instruction file (scope, limits, prohibitions) | 2, 4, 6 |
| Read-only tests and a script that operates and screenshots | 1, 5, 7 |
| Measurement script (p99, screenshot diff) | 7, 8 |
| Frequent commits and `/clear` habit | 3, 7, 9, 10 |

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-08**: A solo developer who let Claude handle a month of Unity development logged 88 mistakes. None stopped with an exception. 76 of them (86%) were "it ran, but we only knew by measuring." One point is that "glue" not written in the design, such as a button that picks an action from the screen, does not get implemented ([Source: Zenn](https://zenn.dev/zadeohajimari/articles/1558fa4b65175a) (in Japanese))
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — Verification, context management, common failure patterns
- [Keep Claude working toward a goal (Claude Code Docs)](https://code.claude.com/docs/en/goal) — How to use `/goal`
- [Configure permissions (Claude Code Docs)](https://code.claude.com/docs/en/permissions) — Rules to deny `Edit(path)`
- [Checkpointing (Claude Code Docs)](https://code.claude.com/docs/en/checkpointing) — `/rewind` and what checkpoints cover
- [Prompting best practices (Claude API Docs)](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) — Instructions for overengineering and over-optimizing for tests
- [Prompting Claude Opus 5 (Claude API Docs)](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5) — Expanded scope
- [Effective harnesses for long-running agents (Anthropic)](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — Doing too much, mistaking appearance for completion, completing without tests, and remedies
- [Building a C compiler with a team of parallel Claudes (Anthropic)](https://www.anthropic.com/engineering/building-c-compiler) — Test design and breaking existing features
- [Introducing Claude 4 (Anthropic)](https://www.anthropic.com/news/claude-4) — Lower rate of shortcuts and cheats
- [Claude-of-Duty (GitHub)](https://github.com/mshumer/Claude-of-Duty) — Performance measurement, image diff checks, design document rules
- [We Have a Package for You! (arXiv)](https://arxiv.org/abs/2406.10279) — Survey of package hallucination
- [Context Rot (Chroma)](https://www.trychroma.com/research/context-rot) — Performance drops as input grows
- [AI Assistant Code Quality 2025 Research (GitClear)](https://www.gitclear.com/ai_assistant_code_quality_2025_research) — Trends in code duplication and refactoring rates
- [Vibe coding service Replit deleted user's production database (The Register)](https://www.theregister.com/2025/07/21/replit_saastr_vibe_coding_incident/) — Production database deletion report
- [max-lines (ESLint)](https://eslint.org/docs/latest/rules/max-lines) — File line limit rule
