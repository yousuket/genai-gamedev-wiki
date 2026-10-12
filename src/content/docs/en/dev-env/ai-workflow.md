---
title: AI-Driven Development Workflow
description: Loops from specification to implementation to testing to playtest, project instruction files, Git operations, automated testing, and dealing with what AI cannot do.
sidebar:
  order: 4
lastUpdated: 2026-09-29
---

## Overview

When you use AI coding tools, the speed of writing code increases significantly. However, a game is not complete just because it "works." Whether it feels good to play and whether the visuals are correct must be verified by people.
This article explains the development loop for delegating implementation to AI while maintaining quality, how to write project instruction files, Git operations, automated testing, and how to handle the parts that AI cannot do well.
For choosing tools, see [AI Coding Tools](/en/dev-env/ai-coding-tools/).
For an approach that places coding agents at the center of development, see the category [Agent Development](/en/agent-dev/overview/). Real-world examples are collected in [Case Studies and Postmortems](/en/cases/).

## Basic Loop: Specification → Implementation → Testing → Playtest

Perform the following 4 steps for each feature, cycling through them in small increments. One cycle takes anywhere from tens of minutes to a few hours.

| Step | Who does it | What to do |
|---|---|---|
| 1. Specification | Person (consulting with AI) | Write the feature to be made and "completion conditions" in short form |
| 2. Implementation | AI | Write code according to the specification and pass existing tests |
| 3. Testing | AI + automated tests | Add and run logic tests; if they fail, fix them |
| 4. Playtest | Person | Actually play the game and verify game feel and visuals. Write findings in the next specification |

### 1. Write Specifications Down to "Completion Conditions"

If the request to AI is vague, AI will fill in the gaps with assumptions. Write it in a verifiable form like this:

```markdown
## Feature: Double Jump
- When the jump button is pressed again while in the air, perform one additional jump
- Reset the count when landing
- The height of the second jump is 80% of the first
- Completion condition: Unit tests for landing detection and count reset pass
```

Store specifications in `docs/specs/` or similar and manage them with Git. For large features, have AI output an implementation plan first, review it, then have AI implement it; this reduces rework.

Implementation and testing are requested as "read the specification, implement it, add tests, and fix everything until all tests pass." For this to work, write the test command in the instruction file. Playtesting is a step that cannot be skipped; focus on the parts where AI struggles (discussed later).

## Project Instruction Files

Project instruction files are notes that AI reads at the start of each session. The name differs by tool (as of September 2026).

| Tool | File |
|---|---|
| Claude Code | `CLAUDE.md` (also reads `AGENTS.md`) |
| OpenAI Codex | `AGENTS.md` |
| Cursor | `.cursor/rules`, `AGENTS.md` |
| GitHub Copilot | `.github/copilot-instructions.md`, `AGENTS.md` |

Claude Code's official documentation recommends the following:

- Aim for under 200 lines per file. The longer it is, the more burden on reading and the harder instructions are to follow
- Write specific, verifiable instructions like "indent with 2 spaces" rather than "format properly"
- Use the `/init` command to auto-generate a draft from the codebase
- Instructions that apply to only specific files can be separated into `.claude/rules/`
- Things that must be followed (linting before commit, etc.) should be automated with hooks, not written in instruction files

### Example for Game Development

```markdown
# Project Overview
- 2D top-down action. Godot 4.7, GDScript (using static typing)
- Design and specifications are in docs/. Read the relevant specification before implementing

# Commands
- Test: ./addons/gdUnit4/runtest.sh -a res://test (set GODOT_BIN environment variable to Godot path)
- Run: godot --path . res://scenes/main.tscn

# Rules
- Game numbers (speed, damage, etc.) are not written directly in code; place them in Resources in data/
- Do not edit .tscn files by hand; modify via editor or MCP
- Change only one feature per request. Do not do unrelated refactoring
- Do not use Godot 3 patterns (yield, export var, etc.)
```

Modify the test command to match the test framework you use.

## Git Operations

AI changes many files at once. Use Git frequently so you can always revert.

- **Commit small**: Keep 1 feature = 1 commit (or 1 branch), and commit your own changes before having AI work. If a change is wrong, you can revert just that commit.
- **Exclude unnecessary files**: In Godot 4.1 and later, exclude `.godot/` (cache) from version control. In Unity, always commit `.meta` files.
- **Use Git LFS for large binaries**: Images, audio, and 3D models can be managed with Git LFS (Git's extension for separate management of large files); this keeps the repository from growing too large. Godot's official documentation has examples for `.gitattributes`.

## Automated Testing

Games involve screens and input, so testing everything automatically is not realistic. **The basic approach is to separate logic from the screen and test it.**

### Things That Are Easy to Test

- Damage formulas, experience points, drop rates, and other calculations
- Inventory, quest progress, save data reading and writing
- Stage generation and other processes using random numbers (seeding the random number generator lets you reproduce results)

### Test Methods by Engine

| Engine | Method |
|---|---|
| Godot | gdUnit4 (supports GDScript and C#). The `runtest.sh` command can run tests without opening the editor and outputs HTML and JUnit XML reports. It integrates with CI (GitHub Actions, etc.) |
| Unity | Unity Test Framework. Can run from the command line with `-batchmode` and `-runTests` |
| Phaser | Standard JavaScript / TypeScript test tools. For confirmation including the screen, use browser automation tools like Playwright to take screenshots |

## What AI Cannot Do Well and How to Handle It

### Game Feel

Game feel is the pleasantness of the control experience. The floating sensation of a jump, the heaviness of a hit, and so on. AI can write code, but does not understand the sensation of playing.

- **Expose adjustment values**: Collect speed, gravity, stun time, etc. in variables or data files so you can change them from the editor or in-game debug UI. AI can help build this system.
- **You play and communicate in numbers**: Instead of "feel lighter," instructions like "reduce gravity by 20%" will be interpreted more accurately.
- See [Balancing](/en/design/balancing/) for general information on number adjustments.

### Checking Appearance

AI often cannot see for itself whether something is displayed correctly on screen.

- **Provide screenshots**: If the tool supports image input, paste a screenshot and have it check "is the UI off-screen?"
- **Automatically record the screen**: Godot can output the running screen to numbered images or video with `--write-movie`. For Phaser, Playwright can take screenshots.
- **Use editor integration**: Using something like Unity MCP lets AI directly read scene structure and console errors.

## How to use AI

- **Keep loops small**: The larger the feature you ask for at once, the harder it is to spot AI errors. For how to narrow down the scope, see [Deciding Scope](/en/getting-started/scope/).
- **When you have to tell AI the same thing twice, write it in the instruction file**: You prevent the same mistake from happening again.
- **Give AI "eyes" with tests and screenshots**: The more ways AI can verify results for itself, the broader the range of work you can delegate.
- **Let humans make the final judgment on whether it is fun**: Asking AI "is this game fun?" will not give a reliable answer. Have other people play it early.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [How Claude remembers your project (Claude Code Docs)](https://code.claude.com/docs/en/memory) — How to write `CLAUDE.md` and `AGENTS.md`, `.claude/rules/`
- [Hooks guide (Claude Code Docs)](https://code.claude.com/docs/en/hooks-guide) — Hooks to automatically perform fixed operations
- [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) — Codex's `AGENTS.md`
- [Cursor Rules](https://cursor.com/docs/rules) — Cursor's instruction file
- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot) — Copilot's instruction file
- [Version control systems (Godot Docs)](https://docs.godotengine.org/en/stable/tutorials/best_practices/version_control_systems.html) — Godot's excluded files and Git LFS example
- [How to Author Scenes and Prefabs with Version Control (Unity)](https://unity.com/blog/author-scenes-and-prefabs-with-verson-control) — Unity scenes and version control
- [Command line tutorial (Godot Docs)](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html) — Options like `--headless` and `--write-movie`
- [gdUnit4 (GitHub)](https://github.com/godot-gdunit-labs/gdUnit4) — Test framework for Godot 4
- [gdUnit4 Command Line Tool](https://godot-gdunit-labs.github.io/gdUnit4/latest/advanced_testing/cmd/) — Command line execution of gdUnit4
- [Run tests from the command line (Unity Manual)](https://docs.unity3d.com/6000.3/Documentation/Manual/test-framework/run-tests-from-command-line.html) — Unity Test Framework command line execution
- [Screenshots (Playwright)](https://playwright.dev/docs/screenshots) — Browser screenshot capture
- [Unity MCP overview](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.0/manual/unity-mcp-overview.html) — How Unity MCP gives AI access to the editor
