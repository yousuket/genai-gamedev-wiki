---
title: What a task costs on Opus 5.5
description: A deep dive into Claude Code's official blog article on task costs, covering four factors (turns, cache, output, model), choosing effort and model, operations that break cache, and how to measure costs.
sidebar:
  order: 10
lastUpdated: 2026-10-04
---

## Overview

This article is a deep dive into Claude Code's official blog post "What a task costs on Opus 5.5," broken down into usable sections. The series entry point is at [Claude Code Official Blog](/en/claude-blog/).

- Original: [What a task costs on Opus 5.5](https://claude.dev/blog/what-a-task-costs-on-opus-5-5/)
- Published: September 25, 2026. Author: Addy Osmani. Reading time: 21 minutes (from original post)
- Topics: What determines the cost of one task in Claude Code, what changed with Opus 5.5, how to use effort, model, cache, and compression to reduce cost, and how to measure your own costs

The original is not only about token pricing. Its main theme is: "The cost of a single task varies greatly even at the same unit price." The whole post is built around the idea that one retry can cost more than the tokens you save.

The numbers in the original include both API list prices and illustrative examples created from list prices. The original states this distinction, and this article does the same.

The full cost overview and subscription limits are covered in [Cost and usage limit management](/en/agent-dev/cost-management/). This article fills in what is not there: "breaking down the cost of one task," "the reasoning behind choosing effort and model," and "operations that break cache."

## Cost is determined by tasks, not token price

The original post opens with this framing. What people want is a completed feature or a finished migration, not tokens; the token count is just what the model needed to get there.

Two models at the same unit price can behave differently. One reads the code once and fixes it. Another reads, tries a fix, then reads again. Each of these steps is a "turn," and on each turn, the entire conversation is sent again. A model with more turns costs more even at the same unit price.

The other foundation of this article is tradeoffs. Lowering effort, using a smaller model, or reducing context all save tokens. But if the task does not finish, the cost of a retry exceeds what you saved. The original explains that its goal is to put a price on each of these choices.

## Four elements that determine the cost of a single task

A Claude Code task is a loop. The model reads the conversation, calls tools, reads the results, and loops again. One iteration is one request. The original lists four things that determine the cost of the loop.

| Element | Content |
|---|---|
| Number of turns | On every turn, the entire conversation is resent. Fewer turns mean less input to process |
| Cache reads | Most of what is resent is the same text as the previous turn, charged at a fraction of the input price |
| Output tokens | Charged at five times the input price. Thinking also counts as output and is charged |
| Model | Each model has its own unit price, which determines the cost of all tokens |

The examples that follow are calculated with Opus 5.5 API pricing. Per million tokens, input costs 4 dollars, output costs 20 dollars, and cache reads cost 0.20 dollars (as of October 2026. Source: [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)). Cache reads are 5 percent of the input price (0.05 times), as stated on the official pricing page. In the examples, cached input is charged at read-out price, everything else at input price, and cache writes are omitted. Token counts are sample values for illustration.

### Number of turns

The example conditions are these. The task starts with 20K (20,000) tokens of context, which grows to 120K as you read files and tool results. At 40 turns, you send an average of about 70K per turn.

- 40 turns: total input is about 2.8M (2.8 million) tokens. The conversation never exceeds 120K, yet the total sent is this much. If 90 percent is cache reads, input cost is about $1.62
- 25 turns: same task, total input about 1.75M, input cost about $1.02

One turn costs more than the tokens it adds. You send everything again. The original's conclusion: "the cheapest turn is the turn you do not need."

The original lists two habits to cut turns. First, give the model a way to verify its work (tests, builds, scripts that hit endpoints). A model that can verify finds mistakes early. Second, a model that gathers needed information in one request and batches tool calls pays less on resends.

### Cache reads

With the same 2.8M input, cost ranges from $11.20 with no cache, to $1.62 at 90 percent hit rate, to about $0.99 at 96 percent. The original notes that no other setting moves input cost this much. Stable sessions naturally hold high hit rates. Scenarios where cache breaks are covered in a section below.

### Output tokens

In Opus 5.5, the cost of one output token is 100 times that of a cache read. Typical task output of 60K tokens costs $1.20—the same as reading 6M (6 million) tokens from cache. Output includes thinking, and Claude Code bills for all of it even if it only shows a summary. Effort moves cost so much because effort mainly changes how much thinking happens.

### Model

The original is brief. Cache reads are cheap for long sessions, output is cheap for reasoning-heavy tasks.

## What changed in Opus 5.5

Two things changed: unit price and how much work the model does.

### Pricing

The table below shows numbers from the original (API pricing, per million tokens, as of October 2026).

| | Opus 5 | Opus 5.5 | Decrease |
|---|---|---|---|
| Input | $5 | $4 | 20% |
| Output | $25 | $20 | 20% |
| Cache reads | $0.50 | $0.20 | 60% |

Cache read pricing dropped from one-tenth to one-twentieth of input pricing. Long autonomous sessions are mostly cache reads, so this change matters. In the original's example, cache cost dropped from $1.00 to $0.40, the largest single reduction in the bill.

In subscriptions (Pro, Max, Team), Opus 5.5's lower pricing applies to cached context too, and the allowance lasts about 25 percent longer, the original states. The extra cache read discount is an API pricing change only. Separately, Pro, Max, Team, and Enterprise per-seat subscriptions gain five more hours of allowance, and eligible subscribers get a reset of discretionary usage that can be used anytime. Settings are in the web or Claude Desktop under Settings > Usage; Claude Code in the terminal does not have them. The reset applies to your whole account.

How much you save depends on your work pattern. For sessions that are mostly cache reads, input can be 60 percent cheaper at maximum. For a short question with a long answer and no cache, output dominates, so only 20 percent at maximum. Most Claude Code tasks fall in between.

### What does "40% cheaper" mean?

The original notes you might have seen "Opus 5.5 runs 40% cheaper than Opus 5," then explains. This is Anthropic's estimate of cost reduction for a typical workload charged with standard pricing. It assumes Opus 5.5 at standard medium effort, and fewer tokens per task. In other words, it does not mean unit prices dropped 40 percent. The effect of price changes alone is shown in Figure B below.

### How much work the model does

Opus 5.5 always thinks before answering, so one response may use more tokens. The original expects Opus 5.5 to finish more per task, but it varies by task, so measure on your own work.

- On well-scoped tasks, both models use about the same number of turns; the benefit is price only
- The gap is widest on ambiguous tasks. There is room for the model to spend many turns on wrong leads
- At the end of long work, Opus 5.5 reports what it changed, what it found, and what you need to know. Understanding what happened means fewer reruns of the session, another cost saving, the original says

## Comparing with the same tokens (Figures B and C)

Figure B is a bill for one session, with the same token count applied to both models. The only difference is unit price. Token counts are for illustration.

| Line | Tokens | Opus 5 | Opus 5.5 |
|---|---|---|---|
| Cache reads | 2.0M | $1.00 | $0.40 |
| New input | 200K | $1.00 | $0.80 |
| Output | 60K | $1.50 | $1.20 |
| Total | | $3.50 | $2.40 (about 31% less) |

Numbers in the Opus 5.5 column are calculated by this Wiki from the original pricing (above table). The total of $3.50 and $2.40, about 31 percent less, are in the original.

The three lines in the bill match the three lines that `/usage` outputs. Cache reads are the biggest by token count, output the smallest, but output is the biggest by cost. New input is the first read of each file and new tool results.

Figure C is a calculator where you can change input tokens, cache percentage, output, and tasks per day. Months are calculated at 22 working days, API list pricing, cache writes not included, and batch or bulk discounts do not apply. For subscriptions, this is not your bill.

The starting values are 2.2M input, 91 percent cache, 60K output, 10 tasks per day, so Opus 5 is $770 per month and Opus 5.5 is $528 per month (about 31% less, $242 less per month).

The original's three presets have these values (values embedded in the original page). The right two columns are this Wiki's calculation of cost per task from these values and the pricing above.

| Preset | Input | Cache | Output | Tasks per day | Opus 5 | Opus 5.5 |
|---|---|---|---|---|---|---|
| Small fix | 150K | 80% | 5K | 30 | about $0.34 | about $0.24 (about 27% less) |
| Large refactoring | 6M | 92% | 250K | 3 | about $11.4 | about $8.0 (about 30% less) |
| Long autonomous run | 20M | 96% | 600K | 1 | about $28.6 | about $19.0 (about 33% less) |

The higher the cache percentage and the longer each run, the bigger the benefit from the price cut. The last slider in the calculator is your own assumption: "what percentage do tokens per task increase or decrease with Opus 5.5?" Leave it at 0 percent to see only the effect of pricing. To find your actual number, run the same task once with Opus 5 and once with Opus 5.5, and compare the number of turns and output tokens.

## How to reduce costs

The heart of the original. Pricing is down, but how you use tokens determines cost.

### 1. Increase effort before changing models

Effort sets the level of tokens the model uses per turn (thinking, writing, tool calls). Low means fewer, shorter tool calls. Opus 5.5 has four levels: low, medium, high, xhigh, plus max which you can use for one session.

| Level | When to use (from original) |
|---|---|
| low | Mechanical work. Renaming, applying known patterns across files |
| medium | Well-scoped everyday work. Start here |
| high | When medium gets stuck. Cheaper than switching models |
| xhigh | Hard problems |
| max | One session only |

Set it with `/effort medium`; check the current level with `/effort status`. You can change it in the middle of a task; the next request uses the new level.

Two cautions. First, Opus 5.5's default is medium, one step lower than Opus 5's default of high. Even with the same name, Opus 5.5 thinks more per turn than Opus 5 (especially xhigh and max). Do not carry over the level you chose for Opus 5; start with medium, and use xhigh and max only on tasks where you measured the benefit, the original says.

Second, the relationship between effort change and cache. With API key or Claude subscription, changing effort keeps cache intact. You can raise just one hard step, then lower it again. On Bedrock, Google Cloud's Agent Platform, and gateways, a change clears cached conversation, and the next request pays cache write price for everything. Opus 5.5 always thinks, so there is no thinking setting.

#### The payoff calculation for effort

The original's estimate. Say high uses 20K extra tokens of thinking for the whole task. On Opus 5.5, that is $0.40. A retry loop of 10 turns (100K cached context, 10K total output) is also about $0.40. So high pays for itself on a task where it cuts one retry, but it is wasted on a task that medium finishes from the start.

#### Example: medium only fixes one layer

The original lists a sign that you should raise effort: "fixes stop at one layer." You are changing an API handler field name. Medium fixes the handler, and the handler tests pass, but the client still sends the old field name. You did what was asked, but you did not read far enough to find the second caller. High adds turns before writing, so it reads callers before fixing both layers in one pass.

The same bug can be caught by testing. If you can run a test that goes through the client, the old field name fails in medium's writing turn. So before raising effort, check if the model has a way to verify. One test costs one turn plus output. Effort adds thinking to every turn. Try both testing and raising effort, and if both fail, switch to a larger model.

### 2. Choose a model that fits the task

Model sets the unit price for all tokens, so it moves cost more than effort. Subage agents inherit the main model's price. The original recommends using three models for everyday work: a small model for research, Opus 5.5 for work you are watching, and a large model for the hardest problems.

- Use Opus 5.5 as your everyday main model: changes across files, debugging, fixes after review. Short loops where you read and intervene if something is off
- Move to Fable 5.1 when the result matters more than price. Long runs with no one watching, problems with no precedent in the codebase, coordinating many subage agents for a large change. The original says: do not wait for three failures; if you hit the same problem twice with xhigh Opus 5.5, switch. If it solves it, switch back. Interactive work is better with the low-latency, cheap Opus 5.5
- Drop to a smaller model for research: small models (Sonnet or Haiku) work as subage agents for search and summary, reading logs and test output, and answering "where is this defined?" Do not use them to write code. Many mechanical edits across files stay at Opus 5.5 with effort set to low

Fable 5.1 list price is input $10, output $50, 2.5 times Opus 5.5. Cache reads are $0.25, only 1.25 times Opus 5.5 (because they are charged at 0.025 times input price). The gap is smallest for long cache-heavy runs, biggest for tasks with lots of writing (as of October 2026).

Switch at a natural break. Cache belongs to the old model, so the new model's first turn pays cache write price for everything. Run `/compact` first, or write a short plan and start a new session, so that first turn stays small. Pass a nickname or model name to `/model` to switch. `/model` saves what you chose as the default for new sessions, so switch back when the hard part is done.

To set a subage agent to a small model, write `model: haiku` or `model: sonnet` in the definition. To use one model for all subage agents, set the `CLAUDE_CODE_SUBAGENT_MODEL` environment variable. Model settings in a definition take priority over the variable. Subage agents with no model setting use the main model unless the variable sets otherwise. Subage agents run in their own context window and return only a summary, so file reads do not go into the main conversation. But they still count toward your token bill.

Agent teams (experimental) double this cost. Each member is a separate Claude Code, spending tokens until it finishes. In the Cost Management docs the original cites, members in planning mode use about seven times the tokens of a normal session. Keep teams small, give each task independence, and stop members when they finish.

There are tradeoffs. If a small model misreads search results, the main model goes down the wrong path, and you pay for the detour. Give the small model tasks where mistakes are easy to spot (finding files, running tests, reading logs). Keep judgment with the main model. An alias called `opusplan` splits planning to Opus and execution to Sonnet, putting code edits on Sonnet, the opposite of the recommendation above. Measure on your own tasks before making it the default.

### 3. Check your prompts after migrating

Instructions written for an old model can make Opus 5.5 repeat tool calls needlessly. Running `/claude-api prompt-audit` in Claude Code checks your skills and CLAUDE.md for these antipatterns. It also checks code made on Claude Platform.

The original shares results from an internal customer support benchmark (44 tickets). The prompts had several of these patterns. Moving from Opus 4.8 to Opus 5.5 (at low effort) cut costs about 18 percent. Running prompt-audit further cut it about 9 percent, so Opus 4.8 starting cost fell about 25 percent. Removed were six-step rules, scratchpad rules, two-check rules, contradictory instructions—"ritual instructions" that cause writing too much and repeating.

The original says this is one benchmark result, not a number to expect, just an example. It recommends that after you run it, compare `/usage` before and after on real tasks.

### 4. Caching and compression

Claude Code does caching and compression automatically, but how you work with your session determines the savings.

#### How caching works

Claude Code caches the parts of each request that repeat: the system prompt, tool definitions, and the conversation so far. On Opus 5.5, cache reads cost 5 percent of new input. Writes are higher: 1.25 times input price for five-minute cache, 2 times for one-hour cache (as of October 2026. Source: [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)). Each hit resets the expiry for free.

Cache life in Claude Code depends on how you pay. One hour on Claude subscription, five minutes by default on API key or cloud providers. Starting to use credit with a subscription drops it to five minutes.

At 120K context tokens, Opus 5.5 five-minute cache write is about $0.60, read is about $0.02. One write costs 30 reads. On an API key, a six-minute coffee break turns the next $0.02 read into a $0.60 write. One-hour cache write costs about $0.96, and on API you can pay the extra to cover a day-long gap.

#### When caching becomes a write

Cache can reuse only the part that matches from the start. Stable sessions add to the end of the conversation, so hit rate stays high. Changing tool definitions clears the whole cache; changing the system prompt clears everything after it, which is nearly everything. The original lists scenarios where cache becomes a write:

- You waited longer than cache life
- On Bedrock, Google Cloud's Agent Platform, or gateways, you changed effort (the level is part of the cache match condition)
- You turned on fast mode for the first time in the conversation
- You connected or disconnected an MCP server (what loads at the start of each request changes)
- You switched models (the new model has empty cache)
- You compressed the conversation (cached history gets rewritten)

So the original recommends you set these at the session start and do not touch them during work.

#### The longer the session, the more expensive each turn

Every turn sends the whole context, so even with warm cache, longer context means higher turn cost. Opus 5.5 cache reads cost about $0.004 per turn at 20K context, about $0.03 at 150K. At 150K, 30 turns costs $0.90 in reads alone; at 20K, 30 turns costs about $0.12. For Claude 4.6 and later, a larger window does not change token unit price, so cost comes only from resending. Most of what gets resent is leftovers from old work: a stack trace from an hour ago, a file you are done with, test output from work you finished.

#### Compression, `/compact`, `/clear`

As context approaches its limit, Claude Code summarizes old history. Pass a token count to `/autocompact` to change when compression starts. Two commands are yours to use.

- `/clear`: empty the conversation. No cost. Use it when you move to unrelated work
- `/compact`: keep continuity, one request of cost. The conversation is read for summarization. You can write `/compact keep the failing test names and the schema change` to say what to keep

At 150K, compression costs about $0.25 (reading from cache, output of a few thousand tokens to summarize, new cache write of the shorter context). Each turn after is about $0.025 cheaper, so it pays for itself in about 10 turns. Compressing just before the end costs more than it saves.

This estimate assumes cache is warm. If it is, the summary request reads the conversation from cache. Compress before a break. After a break longer than cache life, the same `/compact` reads the conversation once again, at new-input prices. At 150K and five-minute cache, input alone is about $0.75. If you went down a path you want to drop, use `/rewind` to go back a turn. While cache is warm, you can go back to the beginning, which is already cached. Summarization loses detail, so compressing mid-debug might drop the one crucial log line. Compress at natural breaks; if the next step depends on specific information, write it in the `/compact` instruction.

#### What gets loaded before input

CLAUDE.md goes into context at the start of every session, so each line is resent on every turn. The Cost Management docs recommend fewer than 200 lines. MCP tool definitions load lazily; at start, only the name and server instructions load. Full definitions load when you use them. Run `/mcp` to see what servers are connected, and turn off ones you are not using. How to write an instruction file is in [Writing project instruction files](/en/agent-dev/project-instructions/).

### 5. Other rules that affect billing

The original's table, rephrased:

| Item | Details |
|---|---|
| Cache life | As described above. API also has one-hour cache with higher write price |
| Cache writes | Five-minute is 1.25 times input, one-hour is 2 times |
| Thinking | Charged as output. All thinking is billed, even what does not come back |
| Effort | Changes all output tokens (text, tool calls, thinking) |
| Auto-compression | Runs when window approaches limit. Change threshold with `/autocompact` |
| Subage agents and agent teams | Subage agents run in their own window and return summary only. Planning mode teams use about seven times normal |
| Batch API | Input and output both half price (asynchronous. As of October 2026) |
| Actual spending | Enterprise average is about $13 per developer per working day. 90 percent of users spend under $30 per working day (with current models) |

Fast mode makes Opus 5.5 up to 2.5 times faster in exchange for double the unit price (input $8, output $40. As of October 2026. Source: [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)). On subscription, it charges to usage credits, not allowance. The first request with it on pays the whole conversation at fast mode input price with no cache. So turn it on at session start, not in the middle.

## Measuring your own costs

The original recommends measuring on your own work, because codebase, prompt, and habits differ by person. Here is how:

- Run `/usage` during a session (or `/cost`, same thing). The Session row shows token use and estimated cost at list price. The prompt cache row shows what percentage of input came from cache. Cost is calculated at list price on your machine and is a work measure, not your bill if on subscription
- Run the same task twice. Opus 5.5 needs Claude Code v2.1.280 and later, so update first with `claude update`. Pick real work from your backlog, not a toy example, and switch between Opus 5 and Opus 5.5 with `/model`. Write down turns, output tokens, and cost. Do this on three or four tasks before you decide
- If you have a team, use the usage and cost report. Claude Code Analytics API shows estimated per-user cost; Usage and Cost API shows spending by model and cache
- Try the effort steps. Run one hard task at medium and high; run one mechanical task at low

### How to read your session

At the end, run `/usage` and look at three things:

- Cache percentage: on a long session, should be high. If low, look for a long break, model switch, MCP server connected mid-way, cloud or gateway effort change. The prompt cache row often hints at what went wrong last
- Output relative to input: lots of output for a small change means effort is too high or the model is retrying
- Total input against conversation size: if total is many times the conversation size, you had many turns; read the conversation and find where the loop repeated

The baselines are the $13 and $30 above. Sessions much higher than your normal are worth reviewing.

## Summary from the original (Keep in mind)

The original's closing points, rephrased in order:

1. For well-scoped everyday work, start at medium
2. Give the model a way to verify. For changes across files, start from planning mode
3. When medium gets stuck, go high. On API key or subscription, cache is kept. On cloud or gateway, change at a break
4. At xhigh with the same problem twice, switch to Fable 5.1. When it solves it, switch back
5. Make subage agents for search and log reading Sonnet or Haiku. Keep code edits on Opus 5.5
6. Keep long sessions running and cache warm
7. Between unrelated work, `/clear`; at breaks, `/compact` with what to keep
8. The most important thing is to run a real task twice, once with each model, and compare `/usage`

## How to apply this to game development

The original does not mention games. What follows is this Wiki's take on applying it to making a small web game solo.

### Divide your work into three types

In solo games, tasks roughly fall into small fixes, cross-cutting changes, and long autonomous runs. Using the preset numbers above (this Wiki's calculation at API list price), one task averages:

| Game work | Original preset | Opus 5.5 per task | Starting effort |
|---|---|---|---|
| Tweaking enemy HP or speed, fixing UI text | Small fix | about $0.24 | low or medium |
| Save file format change, rebuilding input handling | Large refactoring | about $8 | medium, high if stuck |
| "Build this room by the GDD" long run | Long autonomous run | about $19 | medium on. Fable 5.1 if no one watches |

This applies the original's preset values only; it is not measured game dev cost. On your own project, use `/usage` numbers.

### Use testing to catch bugs that only fix one layer

The original's "field name change, handler only" shows up in games as: you changed a save data field name, but the title screen load code still reads the old name (a guess). Before raising effort, add a test that runs save and load. By the original's logic, one test is one turn, and effort adds thinking to all turns.

```md
## Verification (excerpt from CLAUDE.md)
- When you change a save field, always run `npm run test:save` (save and load, check state is the same)
- Screen check with `npm run shot` (Playwright: title and play screens)
```

Test and screen check methods are in [Verification loop](/en/agent-dev/verification-loop/).

### Set the cost of subage agents

An example definition for search, log reading, and "where is this function called?" on a small model, following the original's guidance (`model: haiku`):

```md
---
name: finder
description: Find files or functions, return only location and summary
model: haiku
---
Return only the file paths, function names, and one-line role. Do not change code.
```

Parallel role division is in [Subage agents and parallel](/en/agent-dev/parallel-agents/). As the original says, agent teams use about seven times the tokens, so for a small solo game, one session is usually enough (a guess).

### Daily operational guidelines

- Decide model and effort at the start of work, do not change mid-task. To change, use `/compact` at a break
- When you move to unrelated work (bug fix to new enemy), use `/clear`
- Before a coffee break, compress with `/compact keep the current bug and the failing test`, naming what to keep
- Turn off unused MCP servers on days you do not use them (e.g. screen check). CLAUDE.md under 200 lines. Methods are in [Context management for long projects](/en/agent-dev/context-management/)
- Once a week, check `/usage` for days with lots of output per input, and days with low cache percentage

How to choose a web game tech stack is in [Web game tech stack](/en/agent-dev/web-game-stack/); pricing of other coding tools is in [AI coding tools](/en/dev-env/ai-coding-tools/).

## How to use AI

You can ask Claude Code to check your costs. Prompts like these work:

- "I will paste the `/usage` result from my last task. Look at cache percentage, output vs. input, and turns, and name three places where there is waste."
- "Run `/claude-api prompt-audit` and fix any too-long or repetitive instructions in CLAUDE.md and my skills. To compare `/usage` before and after, pick one task first."
- "On this bug fix: is medium enough, or should I go high? Before you answer, search whether the callers are in multiple layers. Give your reason."
- "For this task, make one test or script the model can use to check itself before you do anything else."

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [What a task costs on Opus 5.5 (Claude Code Blog)](https://claude.dev/blog/what-a-task-costs-on-opus-5-5/) — Original post (September 25, 2026, by Addy Osmani)
- [Pricing (Claude API Docs)](https://platform.claude.com/docs/en/about-claude/pricing) — Token unit prices, cache multipliers, fast mode, Batch API (as of October 2026)
- [Manage costs effectively (Claude Code Docs)](https://code.claude.com/docs/en/costs) — `/usage`, cache stats, enterprise cost average
- [Cost and usage limit management](/en/agent-dev/cost-management/) — Full cost picture in this Wiki (pricing table, subscriptions, parallel cost)
