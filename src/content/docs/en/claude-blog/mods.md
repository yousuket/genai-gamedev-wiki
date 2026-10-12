---
title: Get Started with Claude Code Mods
description: "Addy Osmani's \"Getting started with Claude Code mods\" explained: the mechanics, how to make Token Weather, Blast Radius and Replay Theater, sharing and trust. Applied to game development for verification, balance tuning, and safeguarding assets."
sidebar:
  order: 7
lastUpdated: 2026-10-04
---

## Overview

A mod is a small JavaScript or TypeScript file that runs inside Claude Code. It can observe what Claude Code is doing, modify its behavior, and draw custom screens. This article walks through the original post, centered on "Token Weather" built from an empty folder: the mechanics, how to build it, two larger examples (Blast Radius, Replay Theater), how to share, and what to watch for. Parts backed by official documentation are listed separately.

- Published: October 1, 2026. Author: Addy Osmani.
- Original: [Getting started with Claude Code mods](https://claude.dev/blog/getting-started-with-claude-code-mods/)
- Environment: Claude Code 2.1.287 and later. Mods are on by default. The API changes between releases; the type definitions Claude Code outputs to `.claude-plugin/types/` on each load are the accurate spec for that version.
- The original does not mention games. "Using mods for game development" is this wiki's idea.

A term to clarify: a hook is a function called when an event occurs. A plugin is a folder with a standard structure that extends Claude Code.

## What is a mod?

A mod is an extension that goes deeper than settings, permissions, slash commands, skills, and the status line. It can rewrite or replace Claude Code's behavior and draw custom screens. Inside is a hook in a plugin, and each hook can see every event during a session at the moment it happens.

The original post lists three uses: add a display you always check, place a guard before an risky command, and create a custom review screen when changes are read. It works in both the terminal and desktop app.

### Start with Claude

You do not need to know the API. Launch `claude`, describe the mod you want in plain language, and Claude Code writes it. When you save the first file, you are asked to permit hot-reloading. If you allow it, the mod appears at the end of the turn, and changes reflect in place from then on. You can keep asking for tweaks: "Start Storm at 70%", for example.

This kind of mod loads only in that session; the folder is cleaned up later. If you want to keep it, copy the folder outside and load it as a normal plugin. Claude Code has built-in guidance on how to write mods: managing state, checking with `claude plugin validate`, and picking which events to use. Claude knows all of this.

## How it works

### Folder structure

A mod is a Claude Code plugin where the behavior lives in a JavaScript or TypeScript module.

- The folder is a normal plugin with `.claude-plugin/plugin.json` (the manifest).
- `hooks/hooks.json` points to exactly one module (in the `modules` field).
- The module exports `register(on, options)`. Inside, call `on(event name, filter, hook)` to add hooks.

### Hook form

All hooks have the same shape.

```js
on("tool.call", { tool: "Bash" }, async ($, e, next) => {
  // $: the mods API (ui, session, state, store, fs, process, clock, http, tool, command, model, etc.)
  // e: the input to this event (plain data)
  // next: passes e to other plugins, then Claude Code itself
  return next(e);
});
```

Hooks chain like middleware. Your hook runs, you pass `e` forward with `next(e)`, and finally Claude Code does its normal work. A hook can do three things.

| Action | How | Example |
|---|---|---|
| Observe | Get the result of `next(e)`, look at it, return it | Log every file edit. Read a number after the turn |
| Rewrite | Pass a changed event to `next` | Change what downstream processing sees (make a command safer, etc.) |
| Answer yourself | Return `{ deny: "…" }` without calling `next` | Deny a tool call. Offer a command or tool instead |

The events you can handle are tool calls, prompts sent, turn start and end, session start and end, slash commands, and `ui.render` (when each screen part is drawn). The module runs in a dedicated isolated environment with no DOM or Node. All communication with the outside world goes through `$`.

### How it differs from config hooks

Claude Code has hooks you write in the settings file. They run a shell command per event and pass JSON over standard input and output. A mod loads once and stays in the session. It can hold state, draw screens that update with events, and call Claude Code back: open a pane, run a process, register a slash command, add tools that the model can call, and more.

Some of Claude Code's own features are built with mods. Support for AGENTS.md and the `/diff` pane next to chat. The source and tests are public (anthropics/claude-code in the `mods/` folder), so you can read how the team builds.

## Making your first mod: Token Weather

### What it does

Each turn, it reads how full the context window (how much of the conversation fits in the prompt) is, and draws it on one line above the prompt. The display shows a weather icon, the percentage used, tokens used and total, a small graph of the last turns, and how many tokens the previous turn added.

| Usage | Forecast |
|---|---|
| Less than 25% | ☀ Clear |
| 25–49% | ☁ Cloudy |
| 50–74% | ☂ Showers |
| 75–89% | ☇ Storm |
| 90% or more | ↯ Compact soon |

In the original examples, each turn reads a file, and the window goes 18%, then 67%, then 81% (of a 200k window), moving from Clear through Showers to Storm. The whole thing is about 80 lines.

### The shortcut: have Claude write it

The prompt in the original post just describes what you want to see. One line: a weather icon and label, a percentage and token count, a graph of the last 12 turns (using `▁▂▃▄▅▆▇█`), and the previous turn's increase, updated each turn. No API knowledge needed. Change the "What it should show" line to what you actually want, and it becomes your mod.

### Six steps by hand

For people who want to know how it is built, or to check what Claude wrote, the original shows six steps. Here is the short form.

1. Make a folder. Use `claude --version` to confirm 2.1.287 or later. Add `plugin.json`, `hooks/hooks.json` (pointing to one module), and `hooks/token-weather.mjs`. Later, `types/index.d.ts` and `tests/` are added.
2. Draw something. The strip right above the prompt is an `AbovePrompt` component, and Claude Code leaves it blank, so that is the first place to target. Listen for `ui.render` with `{ component: "AbovePrompt" }`, and return a tree of `Box` and `Text`. Get components with `$.ui.resolve(e)` (not global, because each surface has slightly different options). Run `claude --plugin-dir ./token-weather`, save, and it appears without a restart. That immediate feedback is most of the fun of writing mods, the original says.
3. Read real numbers and keep them in `$.state`. `$.session.usage()` returns the same numbers the status line shows (`context.tokens`, `context.window`, `context.percent`). Calling is free; checking breakdown only sends a token query. Listen on `session.start` and `turn.complete`. Store history in `$.state`, not a module variable—hot-reload is a fresh load, so variables are reset. `$.state` lives on the host side and persists across the session.
4. Draw the forecast. Make a forecast table (limits, icon, label, color), pick one by percentage. Add the graph and change amount only when the width is 60 columns or more.
5. Validate and test. `claude plugin validate` lists the events being hooked and the `$` functions being called. `claude plugin test` runs `*.test.ts` against the actual runtime. Hooks registered in tests run after the mod and can replace Claude Code's answer, so you can set what `$.session.usage()` returns as you like.
6. Share. Put it in a marketplace (a folder with `.claude-plugin/marketplace.json`), then install it with `claude plugin marketplace add` and `claude plugin install name@marketplace --scope user`.

The original names three details worth taking into other mods.

- Component input is in `e.props`. If `hasSurvey` (a survey wants the strip), the hook steps back. `bodyColumns` is the strip's actual width; if a pane is beside it, narrower than the terminal. Build the tree to fit this width. Only `e.component`, `e.surface`, `e.requestId`, and `e.viewport` are at the top level of `e`.
- When you have nothing to draw, return `next(e)` to give the strip back to Claude Code and other mods.
- Use single-width symbols (☀ ☁ ☂ ☇ ↯), not emoji. They line up on every font.

Declare the state type in a contract file for the plugin (a small `.d.ts`). Without it, `claude plugin validate` stops and names the missing declaration. Another win: calling `$.state.get` in a render hook subscribes that render, so later `$.state.set` redraws automatically. No call to request a redraw is needed.

## Sharing and trust

A mod is a plugin, so sharing works the same as other plugins. Put a marketplace file in a GitHub repo, and that repo becomes a marketplace. Install in three commands.

```text
/plugin marketplace add your-org/my-mods
/plugin install token-weather@my-mods
/reload-plugins
```

The mod starts when it loads. If it does not appear, restart Claude Code. Updates are a normal `push`. You can submit a plugin containing a mod to Claude's directory (claude.ai/directory/manage) to be found without a link.

The original notes a caution. A mod is code that runs on your machine with the same rights as Claude Code. The author is whoever posted it, not Anthropic. Approach it like installing a package: read the repo first, and only load what you trust. Nothing runs until you run the command yourself.

## Two larger examples

Token Weather only watches and draws. The next two dig into events, open panes, and take input.

### Blast Radius: see what a risky command would touch before it runs

When Claude calls `rm -rf`, `git reset --hard`, `git clean`, force push, or a database migration in Bash, the hook stops it. It checks what the command would touch and opens a pane with "Run" and "Cancel" buttons. Press 2 to cancel; Claude gets a refusal with a reason. Press 1 to run as written. The example shows `rm -rf build` deleting 9 files (1.1 MB) in a list.

Three hooks do this. `tool.call` (for Bash), `ui.render` (for a Pane), `ui.render` (for AbovePrompt). The center is "answer yourself" from the table above.

| What to learn | How |
|---|---|
| Dry-run with `$.process.run` | Reports come from each tool's own check command (`git status --porcelain`, `git clean -n`, `git log HEAD..origin/main`, `showmigrations`). Pass arguments as an array, so path contents do not run as shell code |
| Hold the call | A hook gets 10 seconds per event, but time spent in `$` calls does not count. Run a short `sleep` process, wait for a button press. Press Esc to cancel (stops `next.signal`), and stop waiting |
| Buttons with hotkeys | `Button({ label, hotkey, onPress })`. Press with click, Tab and Enter, or a number key |
| Switch to a strip | If the width is too tight and the pane does not fit (`isPlaced: false`), draw the same report on the strip above the prompt |

The original makes clear this is a safety net, not a permissions system. It reads the command string, so `$(…)`, aliases, and scripts that call `rm` slip through. To be sure it is blocked, use a permissions rule.

### Replay Theater: review the last turn's edits one at a time

During a turn, record every Edit and Write call (file, before and after text). When the turn ends, a hint appears above the prompt. Press `r` or type `/replay` to open a pane that shows each edit as a diff. A numbered strip and buttons for previous, next, and close. The example shows 5 changes across 3 files, all renames. It only observes edits; it does not stop or change them.

| What to learn | How |
|---|---|
| Group events by turn | `turn.start` and `turn.complete` batch edits into one turn. Filter by `e.agentId` to skip subagent turns |
| Register a slash command | Call `$.command.register` at `session.start`, answer at `command.run` |
| Read a file | Just before Write, use `$.fs.read` to get the old content, so the diff is real |
| Where to put it depends on the surface | On full screen, it goes on the right. On 80 columns, above the prompt. The mod draws the same tree either way |

## Four habits

1. Trust Claude Code's types. Each load puts the version's declarations in `.claude-plugin/types/`, so your editor and `tsc -p` work without extra setup. The source of truth for events, `$` functions, and component inputs.
2. Read input from `e.props`.
3. Write for hot-reload. The `register` and `session.start` run on every save, so keep data in `$.state`, not module variables.
4. When drawing fails, read the logs. Run `claude --debug`, look for "hook returned a tree that did not pass validation".

## Ideas to explore

The original says three mods, each born from one question. How full is the context? What is this command about to delete? What did Claude change? It then lists some ideas.

- From `$.session.usage()`, build a meter for cost or rate limits, and show it on the status line with `$.ui.status`.
- Hook `prompt.submit` to add your team's rules to every prompt.
- A live map pane listing files Claude has read in this session.
- A focus timer that sends a notification with `$.ui.toast` when a long turn ends.
- A custom `tool.call` guard for your setup: production `kubectl` context, `terraform apply`, etc.

## What we learned from official documentation

The official docs for mods (as of October 2026: [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview), [React to events](https://code.claude.com/docs/en/plugins/mods/events), [Mods reference](https://code.claude.com/docs/en/plugins/mods/reference)) expand on the original. No contradiction found.

- The three examples in the original are published by Anthropic as samples in the `anthropics/claude-code-playground` repo, under `claude-code/mods` (`token-weather`, `blast-radius`, `replay-theater`). No support, shared as-is. To try them, clone and load with `--plugin-dir` for one session.
- Before loading, run `claude plugin validate ./some-mod` to list which events the mod hooks (`hooks:`) and which operations it asks for (`calls:`) without executing anything.
- A mod's reach is wide, the docs say. With your permissions, it can read and write files, launch processes, and communicate. It can read environment variables and settings files (including API keys), see all prompts and tool calls, and approve tool calls before they run. The original's "isolated environment" means the JavaScript module has no direct DOM or Node. The docs' "not sandboxed" means a mod's launched process runs outside the Bash sandbox. Not a contradiction; different layers.
- How to stop: one mod with `/plugin`. a whole session with `--safe-mode`. Always: set `"disableAllHooks": true` in `~/.claude/settings.json`. Org admins can stop mods a user installed.
- Where it works: terminal and desktop Code tabs run both hooks and drawing. VS Code chat and `claude -p` and Agent SDK run hooks but not drawing. WSL desktop sessions do not work.
- Hold and timeout: a hook gets 10 seconds per event (time in `$` calls does not count). Your own waiting Promise does. Over time, a hook is skipped and the held command runs as-is, so wait inside an API like `$.ui.ask`.
- Ask API: `$.ui.ask` shows a question and choices in the same dialog Claude uses to ask, returning the chosen label. A short way to confirm without building a pane.
- `tool.check` is an event. You can see and change the judgment (allow, ask, deny) after permissions and config hooks decide. Use it when the choice depends on facts at that moment (current branch). Fixed commands belong in permissions.

## Using mods for game development

What follows is this wiki's thinking. The original does not mention games. Mods shine when a move is hard to undo and a long conversation needs managing.

### Confirm before an irreversible move

A game repo often holds generated assets (images, sound, 3D models), files you should not touch by hand (like Godot's `.tscn`), and large binaries. If `git clean` or `git reset --hard` or `rm -rf` deletes uncommitted generated files, regenerating them takes time and money. Use Blast Radius the same way: confirm before it runs.

```text
Write a Claude Code mod. Call it asset-guard.
Hook Bash calls for rm -rf, git clean, git reset --hard, git push --force, and hold them.
Show what is about to be deleted. For git clean, show how many files and the first 10 paths from git clean -n.
Offer "Run" and "Cancel". If cancel, refuse with a reason.
Also hold Edit and Write calls under assets/raw/.
```

The shortest form, written with `$.ui.ask`, is in the official docs (ask a question, deny if not answered). Like the original, it watches the command string, so `git push -f` or other forms slip by. If you really need something stopped, use a permissions rule; mods are the safety net against accidents (see [context management](/en/agent-dev/context-management/), the git section).

### Judge when to split by watching the remaining space

Token Weather shows how full the context is on one line at all times. A game is a lot of talk—specs, code, screenshots—and midway through, instructions blur and the pace slows ([context management](/en/agent-dev/context-management/)). If you decide "when Storm hits 75%, save progress and start a new session," the display makes the call simple. The cutoff numbers can change with how you ask ("Start Storm at 70%").

### Check balance changes one at a time

Replay Theater is made for tuning. If you have an agent tweak 30 numbers in `data/balance.json`, a full diff is hard to read. Seeing changes one by one, before and after side by side, makes it easier to ask "did we mean to raise this enemy's HP?" (see [balancing](/en/design/balancing/)).  You can use the same mod as-is.

### Add a rule to every prompt from the mod side

The idea in the original about adding rules with `prompt.submit` works for solo work too. The official docs show how: use `next({ ...e, text: ... })` to rewrite the text sent.

```js
const REMINDER = "\n\n(This project uses fixed 1/60-second time steps. Random uses seeded RNG. After changes, run npm run verify)";
on("prompt.submit", async ($, e, next) => next({ ...e, text: e.text + REMINDER }));
```

Long talks often drop things written in the instruction file. This adds it on every send. But appending text to every send burns context. Keep it to one short line ([project instructions](/en/agent-dev/project-instructions/)). The trade-off is this wiki's guess.

### Know when a long check is done by notification

Running a bot 100 times, capturing screenshots for every stage—long checks finish while you do other work. The original's idea uses `$.ui.toast` to notify when a turn ends (see [verification loop](/en/agent-dev/verification-loop/)).

## How to use AI

### Describe what you want to see or guard, and have Claude write it

As the original shows, a mod is something Claude writes from a description. A template for a request made to fit your game.

```text
Write a Claude Code mod called game-status.
Show on one line above the prompt:
- The latest npm run verify result (pass or fail, and how long ago). Read from reports/verify-latest.json.
- Current branch and the number of uncommitted files.
- Color: pass is green, fail is red, result older than 30 minutes is gray.
Update at the end of every turn.
```

### Have Claude check before you install

```text
Review this repo (someone else's mod) before I install it.
Paste the output of `claude plugin validate` (hooks: and calls:).
For each item, say:
- File reads and writes, process launches, and communication (http): what and why
- Does it read environment variables or settings files?
- Does it approve tool calls without asking?
Then sort by whether each is needed for the mod's purpose.
```

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: Created.
<!-- AUTO-UPDATE:END -->

## References

- [Getting started with Claude Code mods](https://claude.dev/blog/getting-started-with-claude-code-mods/) — Original post (October 1, 2026, Addy Osmani)
- [Mods overview (Claude Code Docs)](https://code.claude.com/docs/en/plugins/mods/overview) — What is a mod, how to load it, trust, where it runs, samples
- [React to events with a mod (Claude Code Docs)](https://code.claude.com/docs/en/plugins/mods/events) — Observe, rewrite, answer. Hold tool calls and ask
- [Mods reference (Claude Code Docs)](https://code.claude.com/docs/en/plugins/mods/reference) — Events, API, timeout
- [Mods in claude-code-playground (GitHub)](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods) — Samples: token-weather, blast-radius, replay-theater
