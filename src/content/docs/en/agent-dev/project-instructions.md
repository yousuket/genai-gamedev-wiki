---
title: How to write project instruction files (CLAUDE.md / AGENTS.md, etc.)
description: What to write in project instruction files for game development and what to avoid. File names and loading mechanisms for each agent, examples for Godot, Unity, and Three.js, and a template you can copy and use.
sidebar:
  order: 7
lastUpdated: 2026-09-29
---

## Overview

- A project instruction file is a project-specific note that agents read when starting a session. It contains build and test commands, rules, prohibitions, and other things that cannot be understood by reading code alone.
- This article provides a table summarizing file names and loading mechanisms for Claude Code, Codex, Cursor, GitHub Copilot, Gemini CLI, and Antigravity.
- For game development, writing game rules and terminology, where numeric values are stored, where assets are located, and engine-specific prohibitions tends to be especially effective.
- At the end, we provide examples for Godot, Unity, and Three.js/browser, along with a template you can copy and use. A list of file names and basic usage is also in [AI-driven development workflow](/en/dev-env/ai-workflow/). This article covers the next level: how to write them.

## Project instruction files for each agent

| Tool | File | Loading mechanism | Recommended size |
|---|---|---|---|
| Claude Code | `CLAUDE.md` (either `./CLAUDE.md` or `./.claude/CLAUDE.md`), personal `CLAUDE.local.md`, `.claude/rules/*.md` | Reads files in the working directory and parent directories at startup. Files in subdirectories are read when accessing files there. Other files can be imported with `@path` | Less than 200 lines per file |
| OpenAI Codex | `AGENTS.md`, override version `AGENTS.override.md` | Reads global settings in `~/.codex`, then reads each layer from Git root to working directory in order, concatenating them. Files closer to the working directory appear later and take priority | Total 32 KiB (default value of `project_doc_max_bytes`) |
| Cursor | `.cursor/rules/` `.mdc` files, `AGENTS.md` | Rules apply at all times, at AI's discretion, to specific files, or manually. `AGENTS.md` can be placed in subdirectories and applies to work within that directory | Less than 500 lines per rule |
| GitHub Copilot | `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, `AGENTS.md` | Repository-wide settings and path-specific ones that narrow scope with `applyTo`. The closest `AGENTS.md` takes priority. Root `CLAUDE.md` or `GEMINI.md` also work | — |
| Gemini CLI | `GEMINI.md` (can specify `AGENTS.md` etc. via `context.fileName` in settings) | Reads `~/.gemini/GEMINI.md`, then workspace and parent directories, then in order of tool access. Can be split with `@file` | — |
| Antigravity | `AGENTS.md` or `GEMINI.md`, `.agents/rules/*.md` | Can be placed at any level. Each file in `.agents/rules/` uses a YAML preamble to choose loading method: always active, at AI's discretion, glob-based, or manual | 1 file up to 24 KB, globally active rules up to 20,000 tokens total |

(As of September 2026. Sources are linked at the end of the article.)

The details of how these files are loaded affects how you write them.

- <strong>Claude Code will not read `AGENTS.md` if it finds even one `CLAUDE.md`</strong> (default setting). If a repository has only `AGENTS.md`, it will be read as-is (v2.1.277 or later). To use both, start `CLAUDE.md` with `@AGENTS.md` to import it. In teams with Windows environments, importing is safer than symbolic links.
- When using multiple tools together, put common sections in `AGENTS.md`, and tool-specific content only in each tool's file.
- Rules scoped to paths (Claude Code's `paths:`, Cursor's globs, Copilot's `applyTo`) take effect only when you edit files in the target path. For games, patterns like "caution when editing `scenes/`" or "caution when editing `src/render/`" work well.
- In Claude Code, a `CLAUDE.md` in a subdirectory and rules with `paths:` do not revert until those target files are read again after compaction. Keep rules you always want enforced in the root `CLAUDE.md`.

## What to write for game development

| Item | What to write | Example |
|---|---|---|
| Overview | Genre, engine and version, language | Top-down action. Godot 4, GDScript |
| Commands | Build, run, test, verify. Things an agent cannot guess | `npm run verify` takes a screenshot with Playwright |
| Structure | Role of main directories (intent only, not things obvious from code) | `src/systems/` contains independent modules. Do not import from each other directly |
| Rules | Non-default conventions | Use static typing. `Math.random()` is prohibited |
| Prohibitions | Things not to touch | Do not hand-edit `.tscn`. `assets/generated/` is regeneration-only |
| Game rules and terminology | Terms and specifications that don't show clearly in code | "Hit stop" means stopping both the receiving and attacking side |
| Where numeric values go | Where to place tuning values | Speed and damage go in `tuning.ts`, not directly in code |
| Where assets go | Directory per type, naming, generated or not | Images go in `assets/sprites/`, named in `snake_case` |
| How to verify | What to do before reporting completion | Run `npm run verify`, check screenshots, then report |

"Game rules and terminology" is unique to game development. Agents implement terms like "dash", "dodge", and "hit stop" according to their own interpretation. Defining each term in one line reduces misalignment between your request and their work. Put the full specification in `docs/` rather than the instruction file, and have them read it when needed (see [Game Design Document](/en/design/game-design-doc/)).

## What not to write

Claude Code's official guide recommends against putting the following in instruction files (as of September 2026, [Best practices](https://code.claude.com/docs/en/best-practices)):

- Things obvious from reading code (descriptions per file, directory listing)
- Standard practices of the language ("write clean code" and other obvious things)
- Long API documentation or explanations (write a link instead)
- Information that changes frequently

For game development, also avoid the following:

- Full design documents or world-building. Rather than having them read thousands of words every session, it saves context to let them read the necessary document from `docs/`.
- Tables of numeric values. The data file is the source of truth; the instruction file should only note where things are stored.
- Progress (how much is done). Put changing information in a [progress file](/en/agent-dev/context-management/) instead.

The official guide offers a question to help decide: "If I deleted this line, would the agent get it wrong?" If not, delete it.

## Guidelines for length

Claude Code recommends less than 200 lines per file, Cursor less than 500 lines per rule. Codex's limit is 32 KiB total, Antigravity's 24 KB per file. In practice, keeping game development instruction files under about 100 lines makes them easier to review later.

- If they get longer, split content into path-specific rules or files in `docs/`. In Claude Code, files imported with `@path` also enter context at startup, so importing is an organization tool, not a way to save tokens.
- The official guide explains that overly long instructions make important rules hard to find and easy to ignore. Add emphasis like "IMPORTANT" only to lines you must enforce. Emphasizing many lines makes none of them stand out.
- In Claude Code, block-level HTML comments (`<!-- maintenance note -->`) are removed before entering context. Use them for notes to humans.

## Choosing where numeric values and assets go

When the location is not decided, agents tend to write numeric values directly throughout the code. When adjusting later, you have to hunt through everything to change them.

```markdown
## Numeric values
- All tuning values go in src/tuning.ts (three groups: player, enemy, effects).
- When adding a new value, write the unit and a reasonable range in the comment.
- When changing a value, include the before/after values and reason in the commit message.

## Assets
- Images: assets/sprites/, Audio: assets/audio/, Fonts: assets/fonts/
- assets/generated/ is the output of generation tools. Do not hand-edit. To regenerate, use tools/gen-assets.mjs.
- File names in snake_case. Sequences are 2-digit (walk_00.png).
```

Design of numeric values that affect game feel is covered in [Tuning game feel with agents](/en/agent-dev/game-feel/).

## Examples by engine

### Godot

```markdown
# Overview
- Top-down roguelike action. Godot 4, GDScript (static typing).
- Specification in docs/specs/. Read the relevant file before implementing.

# Commands
- Smoke test: godot --headless --path . --quit-after 300 (launch, ensure no errors)
- Syntax check: godot --headless --path . --check-only -s res://scripts/target.gd
- Tests: ./addons/gdUnit4/runtest.sh -a res://test (GODOT_BIN is pre-set)
- Export video: godot --path . --write-movie out.avi --fixed-fps 30 (not available in headless)

# Rules
- UNTYPED_DECLARATION warnings are enabled in project settings. Do not write untyped declarations.
- Do not hand-edit .tscn and .tres. Modify via the editor or MCP.
- Use signals for node communication. Do not use relative references like get_node("../..").
- Store values in Resources in res://data/. When using randomness, set seed on RandomNumberGenerator.
```

### Unity

```markdown
# Overview
- 2.5D platformer. Unity 6, C#.

# Commands
- EditMode tests: Unity -runTests -batchmode -projectPath . -testPlatform EditMode -testResults results.xml
- PlayMode tests: same as above with -testPlatform PlayMode

# Rules
- Always commit .meta files. Exclude Library/ and Temp/.
- Do not hand-edit scene and Prefab YAML. Modify via editor extensions or Unity MCP.
- Do not use new or LINQ inside Update() (avoid GC allocations).
- Store tuning values in ScriptableObject (Assets/Data/).
- Split asmdef per feature, do not directly reference other features.
```

### Three.js / Browser

```markdown
# Overview
- Three.js, TypeScript, Vite. No external image or audio assets (procedural generation).

# Commands
- Dev: npm run dev (http://127.0.0.1:5173)
- Verify: npm run verify (launch in headless browser, bot operation, save screenshot, confirm 0 errors)
- Performance: npm run perf

# Rules
- When ?debug=1, expose window.__READY__ and window.__game (state retrieval, fixed timestep, input injection).
- Do not use Math.random(). Use seeded random from src/rng.ts.
- Avoid new every frame. Reuse vectors and matrices. Dispose of geometries, materials, textures.
- Tuning values in src/tuning.ts.
```

The implementation of `window.__game` is in [Verification loop](/en/agent-dev/verification-loop/).

## Copy-and-use template

```markdown
# Project overview
- Genre: 
- Engine, language, version: 
- Specification: docs/specs/ (read the relevant file before implementing)

# Commands
- Run: 
- Test: 
- Verify (screenshots etc.): 
- Build: 

# Structure (things not obvious from code alone)
- 

# Rules
- 

# Prohibitions
- Files not to hand-edit: 
- Dependencies not to add: 

# Terminology (definitions of words that appear in code)
- 

# Numeric values and assets
- Where tuning values go: 
- Where and how to name assets: 

# Definition of done
- Run tests and verification before reporting.
- Include changed files and what you confirmed in your report.
```

## How instruction files grow

- Do not start from scratch; generate first. Claude Code's `/init` examines your codebase and drafts one. It also incorporates existing Cursor rules or Copilot instruction files.
- Add to the file the second time you correct something. The official guide also recommends moving something to the instruction file if you are typing the same correction every session.
- For rules you must enforce, use hooks instead of the instruction file. Contents of instruction files are passed as context, not enforced (see [How Claude remembers your project](https://code.claude.com/docs/en/memory)).
- Review periodically. Claude Code's `/doctor` suggests removing things obvious from code or obsolete entries.
- You can confirm it was read by checking `/context` in Claude Code (lists memory files). For Codex, the official way is to ask it to "summarize the current instructions."

Issues with instructions dropping out during long sessions are covered in [Context management for long-term projects](/en/agent-dev/context-management/). For prompt patterns, see [Game development prompt patterns](/en/agent-dev/prompt-patterns/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: First version created.
<!-- AUTO-UPDATE:END -->

## References

- [How Claude remembers your project (Claude Code Docs)](https://code.claude.com/docs/en/memory) — Reading `CLAUDE.md`, `AGENTS.md`, `.claude/rules/`, size guidelines
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — What to include and not include in instruction files
- [Hooks guide (Claude Code Docs)](https://code.claude.com/docs/en/hooks-guide) — Hooks for processes you must enforce
- [AGENTS.md (Codex)](https://learn.chatgpt.com/docs/agent-configuration/agents-md) — Load order, `project_doc_max_bytes`
- [Cursor Rules](https://cursor.com/docs/rules) — Rule types, `.mdc`, `AGENTS.md`, 500-line guideline
- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions) — Types of Copilot instruction files
- [GEMINI.md files (Gemini CLI)](https://geminicli.com/docs/cli/gemini-md/) — Load hierarchy, split with `@`, `context.fileName`
- [Antigravity Rules](https://antigravity.google/docs/rules) — `AGENTS.md`, `GEMINI.md`, `.agents/rules/`, size limits
- [AGENTS.md](https://agents.md) — Common format supported by multiple tools
- [Command line tutorial (Godot Docs)](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html) — `--headless`, `--quit-after`, `--check-only`
- [Creating movies (Godot Docs)](https://docs.godotengine.org/en/stable/tutorials/animation/creating_movies.html) — `--write-movie`, `--fixed-fps`
- [Static typing in GDScript (Godot Docs)](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/static_typing.html) — `UNTYPED_DECLARATION` warnings
- [Run tests from the command line (Unity Manual)](https://docs.unity3d.com/6000.3/Documentation/Manual/test-framework/run-tests-from-command-line.html) — `-runTests`, `-batchmode`
- [gdUnit4 Command Line Tool](https://godot-gdunit-labs.github.io/gdUnit4/latest/advanced_testing/cmd/) — gdUnit4 command-line execution
