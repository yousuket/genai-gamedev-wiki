---
title: "Building with Claude Sonnet 5.5: When to use Sonnet vs. Opus, pricing, migration, and configuration"
description: How to use Sonnet 5.5 alongside Opus 5.5, pricing and model specs, six breaking changes from Sonnet 5, effort and verification settings, refusals and fallbacks, and Sonnet's role in Claude Code, explored in detail alongside the original.
sidebar:
  order: 8
lastUpdated: 2026-10-04
---

## Overview

- The original article is titled "Building with Claude Sonnet 5.5", published on September 28, 2026, by Addy Osmani. Reading time is 9 minutes ([original](https://claude.dev/blog/building-with-claude-sonnet-5-5/)). The subtitle is "When to choose Sonnet over Opus, costs, and how to adjust."
- Sonnet 5.5 is the second model in the Claude 5.5 family, following Opus 5.5. The original describes it as smarter, more efficient, and 30 percent faster than Sonnet 5. The per-token price remains the same as Sonnet 5, but tasks use fewer tokens, reducing overall costs by up to 30 percent in many cases.
- What you will learn in this article: a table for choosing between Opus 5.5 and Sonnet 5.5, pricing and model specs, changes needed when migrating from Sonnet 5 (thinking, `tool_choice`, computer use, and more), tuning effort and verification, handling refusals, and how Sonnet 5.5 works in Claude Code.
- The original is aimed at API developers building their own applications. Game development is mentioned only once, in a comment from Epic Games. The application to game making, discussed in later sections, reflects this Wiki's perspective.
- A companion article is [Mastering Claude Opus 5.5](/en/claude-blog/opus-5-5-guide/) (same author).

## Try it out: read responses by block type

The original starts with minimal code. The model ID is `claude-sonnet-5-5`, `effort` is set to `medium`, and the prompt asks to "analyze the trade-offs between microservices and monoliths."

```python
response = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    output_config={"effort": "medium"},
)
for block in response.content:
    if block.type == "text":
        print(block.text)
```

The key emphasis here is reading the returned content by block type. Sonnet 5.5 thinks before answering by default (thinking is on by default). So the start of the response may be a thinking block, and code that hardcodes reading `content[0].text` will break.

## Choosing between Sonnet 5.5 and Opus 5.5

The original describes the roles of the Claude 5.5 family as follows.
- Opus 5.5: For complex tasks that need careful judgment.
- Sonnet 5.5: For scoped, everyday work (bug fixes, quick feature iteration). It can produce well-formatted documents, slides, and spreadsheets with design sense. Speed favors quick iteration.
- Haiku 5.5: Expected to join the family within weeks, for high-volume, low-latency work (at the time the original was published).

| Task | Model to try first |
|---|---|
| Scoped everyday coding (bug fixes, quick feature iteration, validation against requirements) | Sonnet 5.5 |
| High-volume everyday development | Sonnet 5.5 |
| Well-formatted documents, slides, spreadsheets (one-page overviews, diagrams, summary slides, document editing, table organization). Tasks where design sense matters | Sonnet 5.5 |
| Repeatable, well-defined agent work (research, review, drafting) | Sonnet 5.5 |
| Complex work requiring careful judgment (long-term agent-style coding, knowledge work) | Opus 5.5 |
| The hardest problems needing the highest intelligence | Opus 5.5 |

The original sums up the guideline in one sentence: Sonnet 5.5 works best for tasks with clear specifications and a way to verify results. It quotes guidance for prompts: harder, long-term work calls for Opus models.

### Early testing by Epic Games

The original includes a comment from Epic Games's COO, Daniel Vogel. In summary: early testing showed Sonnet 5.5 exceeded the quality bar expected of a top model. It held up to system design audits and data flow reviews, managed tens of thousands of lines of code for game systems design, responded quickly, accomplished multi-hour tasks, and produced results without fine-grained direction. Game development is mentioned only once in the original.

## Pricing (as of October 2026)

Per million tokens.

| Item | Sonnet 5.5 | Opus 5.5 |
|---|---|---|
| Input | $2 | $4 |
| Output | $10 | $20 |
| Cache write (5 minutes) | $2.50 | $5 |
| Cache write (1 hour) | $4 | $8 |
| Cache read | $0.20 | $0.20 |

Additional notes:
- Across batch processing and prompt caching, Sonnet 5.5 pricing is entirely the same as Sonnet 5. Changing the model ID does not change per-token billing.
- Inference limited to the United States only (`inference_geo: "us"`) is 1.1 times the standard rate.
- Per-token pricing is the same, but total billing changes. Sonnet 5.5 uses fewer tokens per task than Sonnet 5.
- Default effort varies by platform. Claude Platform (API) defaults to high, Claude Code defaults to medium.
- Images use the high-resolution tier (longest edge up to 2,576 pixels). A 2,000 × 1,500 image uses about 2.5 times as many tokens compared to Sonnet 4.6, Sonnet 4.5, and Haiku 4.5. If detail is not needed, scale down before sending.

Pricing has been verified against the official pricing page ([Pricing](https://platform.claude.com/docs/en/about-claude/pricing)). For overall cost thinking, see [Cost management](/en/agent-dev/cost-management/).

## Model specifications (as of October 2026)

| Item | Sonnet 5.5 |
|---|---|
| Model ID | `claude-sonnet-5-5` on Claude API, Claude Platform on AWS, Google Cloud, and Microsoft Foundry. `anthropic.claude-sonnet-5-5` on Amazon Bedrock |
| Context window | 1 million tokens. Available by default, no beta header required |
| Max output | 128,000 tokens. With Message Batches API, use the beta header `output-300k-2026-03-24` for up to 300,000 tokens |
| Knowledge cutoff | June 2026 |
| thinking | On by default (adaptive). Can be turned off with `between_tools` for the initial thinking phase only |
| effort | low, medium, high, xhigh, max |
| Default effort | API is high, Claude Code is medium |
| Tokenizer | Same as Sonnet 5 |
| Minimum cacheable prompt | 512 tokens (Sonnet 5 is 1,024) |
| Rate limit | Separate from Sonnet 5. Default tier values are the same |
| Priority Tier | Available on Claude API |
| Data retention | Zero-retention available for eligible customers |

Regarding effort settings, the original explains that the API defaults to high because the goal is to start with strong results. First evaluate with high, then choose the effort that matches the task. If you are tempted to use xhigh or max, longer thinking increases costs and may diminish Sonnet's strength (quality, speed, and cost-effectiveness). In that case, consider Opus 5.5.

## Migrating from Sonnet 5: breaking changes and procedures

After changing the model ID to `claude-sonnet-5-5`, address five breaking changes and one change to response format. The original mentions a detailed migration guide for each. In Claude Code, you can ask `/claude-api migrate this project to claude-sonnet-5-5`, and the bundled claude-api Skill applies model ID replacements and parameter changes across the codebase.

### 1. Turn off initial thinking with `between_tools`

In Sonnet 5.5, a request without `thinking` specified uses adaptive thinking. `thinking: {"type": "disabled"}` returns a 400 error. Use the new `between_tools` instead. Thinking occurs only between tool calls, and response time is the same or faster.

Limits for `between_tools`:
- Usable effort levels are low, medium, and high. xhigh and max return 400 errors. To use those, use adaptive thinking.
- Other fields (`display`, `budget_tokens`, `block_binding`) cannot be sent together. Doing so returns a 400 error.
- Effort cannot be changed mid-conversation. To change per turn, use adaptive thinking.
- Short progress notes between tool calls return as summary-style thinking blocks. Read the content by type and pass them on unchanged, together with the assistant's other turns. With no tools, only text is returned.
- Works across all platforms without a beta header. If your SDK does not know `between_tools`, update it.

For multi-step thinking without tools, use adaptive thinking instead of `between_tools`.

### 2. Replace forced `tool_choice` with auto and strict tools

If `tool_choice` type is `any` or `tool`, a 400 error occurs (the same applies to the token-counting API). Send `auto`, and mark tools with `strict: true` to ensure inputs conform to the schema. Describe the use case in the prompt. Strict tools require `additionalProperties: false` on every object.

### 3. Append to conversations only

Sonnet 5.5's thinking blocks are bound to the model and conversation. Sonnet 5.5 can read Sonnet 5's thinking blocks, so conversations switched from Sonnet 5 can carry forward reasoning. However, no model other than Sonnet 5.5 can read Sonnet 5.5 blocks.

### 4. Move computer use to toolset

Computer use (the ability to see and control the screen) works on Claude API and Google Cloud only through `{"type": "computer_toolset_20260801"}`. Declaring `computer_20251124` returns a 400 error. These changes are needed:
- Remove the `anthropic-beta: computer-use-2025-11-24` header. In SDKs, drop the `betas` parameter and use a standard client for the Messages API, not a beta one.
- Replace items in `tools`, and adjust the agent loop to `tool_use` block structure, bulk operations, and the result's `toolset_name`.
- If sending the `fine-grained-tool-streaming-2025-05-14` beta header, remove it. It returns a 400 error with toolset. Add `eager_input_streaming: true` to tools that need it.
- Amazon Bedrock still accepts `computer_20251124`.

### 5. Check advisor combinations

With the advisor tool (a mechanism to ask a higher model for advice), when the executor is Sonnet 5.5, Opus 4.8, Opus 4.7, and Sonnet 5 are rejected as advisors. Accepted are Opus 5.5, Opus 5, and Sonnet 5.5 itself. All advice is encrypted and returned in an `advisor_redacted_result` block. Advice text cannot be read from code.

### 6. Read inter-tool text from thinking blocks

This change does not cause errors, but model notes may stop appearing on screen. Notes longer than one or two sentences between tool calls return as progress thinking blocks, and the default display is empty. With adaptive thinking, set `thinking.display` to `"updates"` (beta, header `thinking-display-updates-2026-08-18`) or `"summarized"` to show non-empty thinking blocks before the next `tool_use` block. With `between_tools`, text returns without `display`.

Sonnet 5.5 also adds per-message effort (beta), mid-conversation system messages, and mid-conversation tool changes (beta). For migrating from Sonnet 4.6 or earlier, or Haiku 4.5, a migration guide has a checklist.

## How to tune

### Re-sweep effort levels

The effort levels have been recalibrated. Because the same level does not produce the same amount of thinking as in Sonnet 5, old settings cannot be carried forward. Starting points are:

| Scenario | Starting effort |
|---|---|
| Non-agent, non-latency-critical work | high |
| Agent-style coding, multi-step tool use (firm specs) | medium |
| Same (hard, long) | high |
| Chat-like work where latency matters | medium or low |
| xhigh and max | only where evals confirm quality gains |

Thinking counts toward `max_tokens`, so budget generously. For agent-style coding, set `max_tokens` to the model's limit of 128,000 and stream the response. To reduce thinking, lower effort. Asking the system prompt to "think less" does not reliably reduce it.

### Remove Sonnet 5 workarounds

Sonnet 5 prompts should work unchanged. If you added diversionary language to avoid refusals, retries for tool calls, or phrases like "do not be lazy," delete them and re-run evals. Other tuning comes after.

### Make low effort do real verification

Sonnet 5.5 normally checks its own work before reporting, but at low effort it may skip running changes to verify them. If tests or build output is missing and "done" is reported, the prompt guidance suggests a system prompt paragraph like:

```text
When you change code that can run, build, or be type-checked, perform actual verification of the changes before reporting completion.
Run tests, type checks, builds, or the changed command itself for the project.
Only checking syntax, or checking for build failures, does not count. If only declared dependencies are missing,
add them using the project's own package manager and lock file (not sudo or system package managers).
Only when no practical verification exists, write the name and reason for the check not performed.
```

### Read progress with thinking.display

Do not extract reasoning into prose. This causes a `reasoning_extraction` refusal. Read summarized thinking instead.

```python
thinking={"type": "adaptive", "display": "summarized"}
```

If you want only user-facing progress notes, use `display: "updates"` (beta). To emit updates at set points, write in the system prompt for example one line before the first tool call, a short reflection at the end.

### Use caching widely

The minimum cacheable prompt has dropped to 512 tokens, so short system prompts and tool definitions can be cached too. Cache reads cost one-tenth of input price. Changing top-level effort between requests invalidates cache. To use a different level for one turn, use per-message effort (beta). It preserves cache.

## Refusals and fallbacks

According to the original, automated behavior audits show Sonnet 5.5 exceeds or matches Sonnet 5 on most alignment and honesty metrics. It is the first Sonnet to carry security protections nearly as strong as the most powerful models. For typical software development, this has no impact.

When refused, HTTP 200 is returned with `stop_reason: "refusal"`, and `stop_details` indicates one of five categories: `cyber`, `bio`, `frontier_llm`, `reasoning_extraction`, or `general_harms`. Server-side fallback (beta, `fallbacks: "default"` on Claude API) retries only `cyber` and `frontier_llm` refusals with Sonnet 5. The other three are not retried. Middleware in the SDK or custom retry logic can also be used. For legitimate security work, Cyber Verification Program access is expanding to Sonnet 5.5 soon.

## Availability and Claude Code

Availability as of the publication date includes Claude API (`claude-sonnet-5-5`), Amazon Bedrock (`anthropic.claude-sonnet-5-5`), Claude Platform on AWS, Google Cloud, and Microsoft Foundry (Global Standard deployments only).

Sonnet 5.5 in Claude Code works as follows (as of October 2026):
- Starting with v2.1.284 (Agent SDK for TypeScript v0.3.284 and later), an alias `sonnet` points to Sonnet 5.5 on Claude API.
- Default effort is medium, with a 1-million-token window as standard.
- In Claude Code, Sonnet 5.5's thinking cannot be turned off. The amount of thinking is controlled by effort.
- Sonnet 5.5 does not have fast mode.
- The default model remains Opus 5.5. For scoped work, switch with `/model sonnet`.

How to use effort is covered in [Spending your effort](/en/claude-blog/spending-your-effort/), and cost estimation in [Claude Opus 5.5 costs](/en/claude-blog/opus-5-5-cost/).

## Where Sonnet 5.5 fits in game development

The original does not address game development. The following reflects this Wiki's perspective. Model choice should follow the original's scope (Sonnet for scoped work, Opus for the hardest long-term work) without making stronger claims.

### Switching in Claude Code

Even small solo games can adapt the original's table to categorize work.
- For work with clear specs and verification (adding an enemy, rewording UI, fixing one bug, adding a save item), run with `/model sonnet`.
- For design phases (restructuring the core loop, major data structure changes), keep the default Opus 5.5.
- For effort, start with medium for work with firm specs, and high for difficult or long work. This is the original's starting point for agent-style coding.

### Add verification to CLAUDE.md

The paragraph preventing "done" without test or build output can work in Claude Code instruction files too. For games, rewrite the verification means specifically.

```text
When you change game code, perform the following before reporting completion:
- npm test
- npm run build
- npm run smoke (launch headless, run a bot for 60 seconds, confirm no exceptions)
Report any verification not performed by its name and reason.
```

Verification mechanisms themselves are in [Verification loop](/en/agent-dev/verification-loop/), and instruction file writing in [Project instructions](/en/agent-dev/project-instructions/).

### In-game AI features (speculation)

If the game calls the API for NPC dialogue or judging player input, this article serves as a migration and tuning guide.
- If the game shows "thinking" on screen, thinking progress (`display`) can be used.
- For dialogue where speed matters, try effort starting at low or medium. This matches the original's "chat-like work where latency matters."
- Long fixed system prompts (world-building) suit caching. At 512 tokens minimum, even short settings qualify.
- Compare quality and cost by eval, not guessing. The [eval design and hillclimbing](/en/claude-blog/eval-hillclimbing/) article's steps apply.

### Cost and speed

In prototyping iterations, speed matters. The original positions Sonnet 5.5 as built for fast iteration. In the original's pricing table, input and output per-token rates are half of Opus 5.5 (input $2 vs. $4, output $10 vs. $20). In scenarios running dozens of multi-minute tasks, this difference compounds (speculation). Detailed cost examples are in [Cost management](/en/agent-dev/cost-management/).

## How to use AI

- For scoped tasks, include completion conditions and how to verify in the request.
  ```text
  Reduce the movement speed of enemy "Slime" in data/enemies.json by 20%.
  Done when: npm test passes and npm run smoke runs to completion.
  If any verification could not run, name it and explain why.
  ```
- If tests or build output are missing and "done" is reported, raise effort by one level or add a paragraph requiring real verification. The original notes this omission can happen at low effort.
- When switching to a new model, first remove old workarounds and see the results.
- For migration, ask Claude as in `/claude-api migrate this project to claude-sonnet-5-5`. Read the changes as a diff.
- With the API, read responses by block type. Thinking blocks at the start do not break code.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Building with Claude Sonnet 5.5](https://claude.dev/blog/building-with-claude-sonnet-5-5/) — Original (Addy Osmani, September 28, 2026)
- [Introducing Claude Sonnet 5.5 (Anthropic)](https://www.anthropic.com/claude-sonnet-5-5) — Release date, pricing, speed, and cost explanation (September 28, 2026)
- [Pricing (Claude API Docs)](https://platform.claude.com/docs/en/about-claude/pricing) — Pricing table (as of October 2026)
- [Models overview (Claude API Docs)](https://platform.claude.com/docs/en/about-claude/models/overview) — Model IDs, context window, max output, knowledge cutoff (as of October 2026)
