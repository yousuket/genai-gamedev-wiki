---
title: Managing Costs and Usage Limits
description: Cost structure for coding agents (input, output, caching), differences between subscription and API billing, model selection per task, why one-shot and parallel approaches increase costs, and cost-saving techniques with published benchmarks.
sidebar:
  order: 14
lastUpdated: 2026-09-29
---

## Overview

Coding agents re-read the entire context with each conversation turn, so costs vary significantly based on how you use them.
This article explains cost structure (input, output, caching, tool calls), billing plans (subscription usage limits and pay-as-you-go API), model selection by task type, why one-shot generation and parallel agents increase costs, and cost-saving techniques.
Published benchmarks come from Claude Code's official documentation, Anthropic's research articles, and author posts; other costs are calculated with formulas.
Pricing covers Anthropic; pricing for other tools is summarized in [AI Coding Tools](/en/dev-env/ai-coding-tools/).

## Cost structure

### Four types of tokens

The API charges based on the number of tokens processed (text divided into small units). Agent development involves four types that appear in billing:

| Type | Applies to |
|---|---|
| Input (without caching) | Content you send for the first time. File contents, tool execution results, your messages |
| Cache write | Storing content for reuse in later turns |
| Cache read | Re-reading stored content. Costs much less than normal input |
| Output | Code the model writes, explanations, internal reasoning. Reasoning counts as output for billing |

According to Claude Code's documentation, the model does not remember conversations, so Claude Code resends the system prompt, instruction files, past interactions with tool results, and new messages every turn. Unchanged portions are read from cache and billed at cache read rates.

### Pricing table (as of September 2026)

Claude API pricing per 1 million tokens (USD).

| Model | Input | Cache write (5 min) | Cache read | Output |
|---|---|---|---|---|
| Claude Fable 5.1 | 10 | 12.50 | 0.25 | 50 |
| Claude Opus 5.5 | 4 | 5 | 0.20 | 20 |
| Claude Opus 5 | 5 | 6.25 | 0.50 | 25 |
| Claude Sonnet 5.5 | 2 | 2.50 | 0.20 | 10 |
| Claude Haiku 4.5 | 1 | 1.25 | 0.10 | 5 |

Source: [Pricing (Claude API Docs)](https://platform.claude.com/docs/en/about-claude/pricing). Cache write also offers 1-hour caching at 2x input pricing. Models Claude 4.7 and later use a new tokenizer, and the same text requires approximately 30% more tokens.

### Turn count matters

Each agent turn involves re-reading the entire context. As context grows with conversation, costs accelerate with additional turns. Cost approximation follows this formula:

```text
Cost ≈ Number of agents × Number of turns × (
          Context re-read × Read rate per token
        + New input × Write rate per token
        + Output × Output rate per token )
```

The following script calculates this formula directly (written as an example for this article):

```js
// Pricing per 1M tokens (USD, as of September 2026)
const PRICE = {
  'opus-5':     { write5m: 6.25, read: 0.5, output: 25 },
  'opus-5.5':   { write5m: 5,    read: 0.2, output: 20 },
  'sonnet-5.5': { write5m: 2.5,  read: 0.2, output: 10 },
  'haiku-4.5':  { write5m: 1.25, read: 0.1, output: 5 },
};

// turns: number of turns / ctx: average context re-read per turn (tokens)
// newIn: new input per turn / out: output per turn / agents: number of parallel agents
export function estimate(model, { turns, ctx, newIn, out, agents = 1 }) {
  const p = PRICE[model];
  return (agents * turns * (ctx * p.read + newIn * p.write5m + out * p.output)) / 1e6;
}
```

## Published benchmarks

| Case | Scale | Cost | Source |
|---|---|---|---|
| Homeworld-style space RTS (Opus 5, Three.js, no external assets) | Input 68.6k, output 4.6M, cache read 837.2M, cache write 13.6M tokens | $632.65 (author post) | [@mikeluan123 post](https://x.com/mikeluan123/status/2081716631986983093), [explainx.ai](https://explainx.ai/blog/opus-5-homeworld-space-rts-mikeluan-july-2026) |
| C compiler (Opus 4.6, 16 parallel agents, about 2,000 sessions) | Input about 2B, output about 140M tokens | Just under $20,000 | [Anthropic Engineering](https://www.anthropic.com/engineering/building-c-compiler) |
| Per developer (enterprise average) | Per working day | About $13. 90% of developers are under $30. Monthly $150–250 | [Manage costs effectively](https://code.claude.com/docs/en/costs) |
| One tool improvement (incident.io) | 18% speed improvement (30 seconds) | About $8 credit | [incident.io](https://incident.io/blog/shipping-faster-with-claude-code-and-git-worktrees) |

The cost of Claude of Duty itself is not published in the repository README, `prompt.md`, or confirmed reports. Instead, detailed numbers are public for a Homeworld-style RTS built with a similar prompt structure.

### Breaking down the $632.65 calculation

Applying published numbers to the pricing table above (Opus 5):

| Item | Tokens | Rate (per 1M) | Cost |
|---|---|---|---|
| Input | 68.6k | $5 | About $0.34 |
| Output | 4.6M | $25 | $115 |
| Cache read | 837.2M | $0.50 | About $418.60 |
| Cache write (5 min) | 13.6M | $6.25 | $85 |
| Total |  |  | About $618.90 (or about $669.90 with 1-hour caching) |

The published $632.65 falls between these two calculations. Key insights:

- Approximately 66% of cost came from cache reads. This is the cost of the agent re-reading large context with each conversation turn
- Output accounts for about 18%. The volume of code written matters less than the volume re-read
- Input (without caching) is nearly zero. Almost everything comes through cache, which is why costs remain at this level

### Applying the formula

Example calculations with these settings. These numbers are assumptions for this article, not published benchmarks.

| Setting | Assumption | Opus 5 | Opus 5.5 | Sonnet 5.5 | Haiku 4.5 |
|---|---|---|---|---|---|
| One session | 100 turns, 100k context, 3k new input, 1.5k output | $10.63 | $6.50 | $4.25 | $2.13 |
| 5 parallel | 5x the above | $53.13 | $32.50 | $21.25 | $10.63 |
| Long one-shot version | 10 agents × 300 turns, 150k context | $393.75 | | $157.50 | |

The last row falls in the same ballpark as the Homeworld benchmark ($632.65). Multi-digit agent costs for one-shot are natural outcomes of this structure.

## Billing plans: Usage limits and pay-as-you-go

### Subscription (as of September 2026)

| Plan | Price | Claude Code | Usage |
|---|---|---|---|
| Free | Free | Not included | Baseline |
| Pro | $20/month (or $17/month annually) | Included | At least 5x Free per 5-hour session |
| Max | From $100/month (two tiers: 5x and 20x) | Included | 5x or 20x Pro per 5-hour session |
| Team (Standard seat) | $20/month annually, $25/month monthly | Included | More than Pro |
| Team (Premium seat) | $100/month annually, $125/month monthly | Included | 5x Standard seat |

Source: [Claude Pricing](https://claude.com/pricing), [Claude Code with Pro or Max](https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan).

Usage limits work as follows:

- Pro and Max limits are shared between Claude chat and Claude Code
- Team and Enterprise manage per-seat limits using 5-hour windows and weekly windows ([Manage costs effectively](https://code.claude.com/docs/en/costs))
- When you reach your limit, you can upgrade to a higher plan, wait for a reset, or enable "usage credits" to continue on API rates. Usage credits do not charge automatically without consent
- Subagent work consumes the same limits

### API pay-as-you-go

Using Claude Code with an API key bills exactly as the pricing table above: per token. You pay only for what you use, with no monthly cap, but costs become harder to predict with one-shot and parallel experiments.

- `/usage` shows session cost (approximation at list price). On Pro or Max, the cost field is unrelated to billing; it shows limit usage instead
- Non-interactive execution (`claude -p`) offers `--max-budget-usd` to set a cost ceiling and `--max-turns` for a turn limit. Subagent costs count toward the budget

### Which to choose

| Situation | Recommendation |
|---|---|
| A few hours per week, single session | Pro |
| Several hours daily, multiple parallel sessions | Max |
| Long experiments like one-shot with a cost ceiling | API key with `--max-budget-usd` |
| Enough limit, but occasional overages | Enable usage credits with a monthly cap |

## Model selection by task

Anthropic's official blog recommends this model breakdown:

| Task type | Model | Rationale |
|---|---|---|
| Mechanical changes, precise edits to existing code | Sonnet | Reduce costs without sacrificing quality |
| Subtle bugs, unfamiliar territory, design decisions | Opus | Stronger at handling ambiguity |
| Extremely difficult tasks, long multi-step work that other models cannot finish | Fable | Higher per-token cost, but fewer iterations in some cases |

The same article explains that harder multi-step work sometimes costs less overall with larger models because fewer retries are needed. Compare on retry count, not unit price alone.

Example applied to game development (author's interpretation; unit prices from the table above):

| Task | Example | Selection |
|---|---|---|
| Numeric adjustments, UI text, asset-generation scripts | "Increase enemy speed 10%" | Sonnet 5.5, effort low–medium |
| New module implementation | Audio or UI work | Sonnet 5.5 or Opus 5.5 (default medium) |
| Mysterious bugs, rendering or physics design | "Slow only in specific scenes" | Opus |
| Function search, log investigation (subagent) | "Find callers of this function" | Haiku |

Claude Code offers these features ([Model configuration](https://code.claude.com/docs/en/model-config), [Create custom subagents](https://code.claude.com/docs/en/sub-agents)):

- `/model` and `--model` switch the model
- `opusplan` uses Opus for planning and Sonnet for execution
- Subagent definitions with `model: haiku` use a smaller model just for that subagent
- `CLAUDE_CODE_SUBAGENT_MODEL` sets the default subagent model
- `/effort` adjusts reasoning depth. Opus 5's guide recommends using `low` and `medium` as primary cost and time controls, raising to `xhigh` only for difficult work

## Why one-shot and parallel approaches increase costs

| Reason | Source |
|---|---|
| Endless loops | The Claude of Duty prompt directs repeating until perfection. Weak exit conditions multiply turns unbounded |
| Context grows with agent count | Anthropic reports agents use about 4x normal chat tokens; multi-agent systems use about 15x |
| Multi-agent team overhead | Each member in planning mode uses about 7x normal session tokens (Claude Code documentation) |
| Model delegation tendency | Opus 5 delegates to subagents more readily than earlier models, increasing cost and time for small tasks (Anthropic prompt guide) |
| Long sessions accumulate re-reads | As shown in the calculation above, larger context means more tokens re-read every turn |

For one-shot thinking, see [One-shot (one-shot generation) techniques](/en/agent-dev/one-shot/). For parallel use decisions, see [Subagents and parallel development](/en/agent-dev/parallel-agents/). Parallel limits are set by `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` (depth) and `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` (count).

## Cost-saving techniques

### 1. Keep context small

Main approaches from Claude Code's official documentation ([Manage costs effectively](https://code.claude.com/docs/en/costs)):

- `/clear` when moving to unrelated work
- Keep instruction files under 200 lines. Move task-specific procedures into "skills" that load only when needed
- Disable unused MCP servers with `/mcp`. `/context` shows what is consuming context
- For lengthy results like test output, use hooks to return only the failed portions. The documentation includes an example hook that extracts failure lines from `npm test`
- For output-heavy work (tests, log investigation), delegate to a subagent and receive only a summary
- Be specific in requests. Instead of "improve this codebase," write "add input validation to the login function in auth.ts" to reduce files to read

### 2. Fail fast and restart

If a problem does not resolve after two attempts, `/clear` and request again with specific directions ([Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)). Carrying failed attempts and re-reading them every turn wastes costs. If direction seems wrong, stop with Esc.

### 3. Do not break the cache

Each model has its cache. Switching models mid-conversation re-computes everything even if content is identical. With Opus 5.5 on API or Claude subscription, changing effort preserves cache. On Amazon Bedrock, Google Cloud's Agent Platform, or through a gateway, changing effort clears cache ([What a task costs on Opus 5.5](/en/claude-blog/opus-5-5-cost/), as of October 2026). The official recommendation is to set model and effort at the session start and delay `/compact` until work breaks (see [How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching)).

### 4. Lower reasoning depth

Reasoning tokens bill as output. For simple tasks, lower `/effort`. Opus 5.5, Sonnet 5.5, and Fable models do not allow disabling reasoning.

### 5. Use local models

Ollama publishes steps to use local models from Claude Code (`ollama launch claude`, or set `ANTHROPIC_BASE_URL=http://localhost:11434` and run `claude --model qwen3.5`). Large repositories benefit from 64k+ context ([Ollama](https://docs.ollama.com/integrations/claude-code)).

Published benchmarks comparing local model quality to Claude are not available. The author's estimate is that without costs, long-task success rates drop, making them suitable for low-stakes work like asset generation scripts or routine refactoring where failure has small cost. The reasoning comes from Anthropic's official blog, which emphasizes that larger models excel at ambiguous or difficult multi-step work.

### 6. Make usage visible

- `/usage` shows session cost approximation and (on subscription) limit consumption, with breakdowns per skill, subagent, and MCP server
- Display context usage on the status line
- `/insights` shows recent session trends (where you get stuck)

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Pricing (Claude API Docs)](https://platform.claude.com/docs/en/about-claude/pricing) — Token rates per model, cache multipliers
- [Claude Pricing](https://claude.com/pricing) — Pro, Max, Team, Enterprise pricing
- [Using Claude Code with your Pro or Max plan (Claude Help Center)](https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan) — Shared limits and usage credits
- [Manage costs effectively (Claude Code Docs)](https://code.claude.com/docs/en/costs) — Cost tracking, multi-agent tokens, cost-saving methods
- [How Claude Code uses prompt caching (Claude Code Docs)](https://code.claude.com/docs/en/prompt-caching) — Cache mechanics and cache-breaking operations
- [Model configuration (Claude Code Docs)](https://code.claude.com/docs/en/model-config) — Model aliases, `opusplan`, effort
- [Create custom subagents (Claude Code Docs)](https://code.claude.com/docs/en/sub-agents) — Subagent model specification
- [Claude Code CLI reference](https://code.claude.com/docs/en/cli-reference) — `--max-budget-usd` and `--max-turns`
- [Choosing a Claude model and effort level in Claude Code (Claude Blog)](https://claude.com/blog/claude-model-and-effort-level-in-claude-code) — Model selection by task
- [Prompting Claude Opus 5 (Claude API Docs)](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5) — Effort and subagent delegation
- [How we built our multi-agent research system (Anthropic)](https://www.anthropic.com/engineering/multi-agent-research-system) — Multi-agent token consumption (about 4x and 15x)
- [Building a C compiler with a team of parallel Claudes (Anthropic)](https://www.anthropic.com/engineering/building-c-compiler) — Cost of 16-agent experiment
- [Homeworld-style RTS post (@mikeluan123)](https://x.com/mikeluan123/status/2081716631986983093) — Published token count and cost
- [Opus 5 Homeworld RTS Demo (explainx.ai)](https://explainx.ai/blog/opus-5-homeworld-space-rts-mikeluan-july-2026) — Explanation of the post above
- [Claude of Duty prompt (GitHub)](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md) — Published prompt
- [Claude Code with Ollama](https://docs.ollama.com/integrations/claude-code) — Steps to connect local models
- [How we are shipping faster with Claude Code and Git Worktrees (incident.io)](https://incident.io/blog/shipping-faster-with-claude-code-and-git-worktrees) — Example of costs per task
