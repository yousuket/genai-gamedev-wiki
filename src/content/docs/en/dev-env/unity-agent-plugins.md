---
title: Unity's official agent integrations (CLI, plugins, and in-editor AI)
description: An overview of the official tools Unity provides for coding agents (Unity CLI, official plugins for Claude Code, Codex, and Grok Build, and in-editor AI assistant) — their capabilities, how to install them, costs, and how solo developers should use and choose among them.
sidebar:
  order: 5
lastUpdated: 2026-10-05
---

## Overview

Starting in July 2026, Unity has gradually released official tools to connect coding agents (such as Claude Code — AI systems that read and write files and execute commands) to Unity. By October 1, a plugin for Grok Build was added, bringing the count of officially supported agents to three (as of October 2026, [source](https://unity.com/blog/unity-plugin-grok)).

This article clarifies three points:

- What kinds of official tools exist, what each can do, how to install them, target versions, and costs
- The contents of the official plugin (the skill domains and what each skill does)
- For small Unity projects, what to request from an agent and how to verify the results

For a comparison of game engines themselves, see [Game Engine Comparison](/en/dev-env/engines/); for a comparison of coding agents, see [AI Coding Tools](/en/dev-env/ai-coding-tools/). This article focuses on "how to use the official tools" after you have chosen Unity.

## Overview of official tools

According to Unity's official blog, the official tools are organized in layers. Lower layers handle execution; upper layers use those capabilities ([source](https://unity.com/blog/meet-the-unity-cli)).

| Tool | What it does | How to install | Supported | Cost (as of October 2026) |
|---|---|---|---|---|
| Unity CLI | A single `unity` command to install the Editor and modules, create and launch projects, build, test, and check logs. Output can be JSON or TSV, and exit codes are standardized | `curl -fsSL https://unity.com/install.sh \| bash` (macOS and Linux), `brew install --cask unity-cli`, `winget install Unity.CLI` | macOS 14 and later, Windows 10 21H1 and later, Ubuntu 22.04 and later, RHEL 9. Experimental | Free |
| Pipeline package (`com.unity.pipeline`) | Operate a running Editor (or a development build) from the CLI. Create GameObjects, edit scenes, evaluate C# on the fly (`eval`), and more | Run `unity pipeline install` in the project | Unity 6.0 LTS and later. Experimental | Works with CLI. No separate charge found |
| Official plugin (`unity-agent-plugin`) | Add "skills" written by Unity engineers to an agent. Skills are step-by-step guides to perform tasks the way Unity intends. The plugin includes a `unity-cli` skill that teaches agents how to use the CLI | Agent-specific commands (next section) | Unity 6.0 and later. Version 0.1.8-beta (October 1, 2026) | Free. License is Unity Companion License |
| CLI with built-in MCP mode | Run as an MCP server via `unity mcp` so that agents without shell command access can still operate the Editor | After installing the CLI, run `unity mcp configure <client-name>` | Unity 6 and later | Free. No Unity credits required |
| In-editor AI assistant | Ask questions, create code, manipulate scenes, and generate sprites, textures, and sounds from a chat panel in the Editor | Enable from the AI button in the Editor, or install `com.unity.ai.assistant` from the Package Manager | Unity 6.0 and later. Beta | Credit-based (see below) |

Sources: [Unity's AI tools (unity.com)](https://unity.com/features/ai), [How to use the Unity CLI](https://docs.unity.com/en-us/unity-cli/use-unity-cli), [About Unity's plugin](https://docs.unity.com/en-us/ai/unity-plugin/about-unity-plugin), [Repository README](https://github.com/Unity-Technologies/unity-agent-plugin).

### A note on naming

The earlier name "Unity AI" is deprecated. Currently these tools are collectively called "Unity's AI tools" (in-editor assistant, AI gateway, MCP server, official plugin, and CLI) (as of October 2026, [source](https://unity.com/features/ai)). Older articles that say "Unity AI" or "Unity MCP" are referring to one of these.

### Credits for the in-editor assistant

The in-editor assistant is included with Pro, Enterprise, and Industry licenses. Personal gets a free trial, then a subscription of $10 per month (as of October 2026, [source](https://unity.com/features/ai)). Using the assistant consumes Unity Credits, and the monthly allowance does not carry over to the next month ([source](https://docs.unity.com/en-us/ai/credits/credits-about)).

Official examples of consumption: a short question costs about 4 credits (Unity Lite model), creating third-person player movement costs about 190 credits (Unity Default model), and generating one image costs 1 to 6 credits. Actual consumption varies greatly with project size and conversation length.

When you use an agent (such as Claude Code) to operate Unity through the official plugin or CLI, you do not consume Unity credits. However, you do pay the agent's usage fee separately (subscriptions or API charges for each service).

## Contents of the official plugin

The plugin is managed in a single repository, `Unity-Technologies/unity-agent-plugin`, and the same skills are distributed to three agents: Claude Code, Codex, and Grok Build (as of October 2026, [source](https://github.com/Unity-Technologies/unity-agent-plugin)). The number of skills varies by time period according to official announcements: Claude Code had 29 (September 9), Codex had 31 (September 16), and Grok Build had "30 or more" (October 1). Counting the `skills/` folder in the repository on October 5, 2026, there are 33 skills.

Each skill consists of a step-by-step guide (`SKILL.md`) written by a Unity feature team and detailed reference materials in a `references/` folder. When given a task, an agent selects and reads the appropriate skill. You can also specify a skill by name directly.

### Skill domains

Classification based on descriptions in the repository's `SKILL.md` files (as of October 2026).

| Domain | Skills | What they do |
|---|---|---|
| Getting started and tools | `new-unity-project`, `unity-cli`, `unity-package-management` | Guides for new projects (asking about concept, target platforms, and monetization strategy before setting up the Editor, project, version control, and packages; does not write game code), CLI operation, adding and updating UPM packages (including for headless and CI) |
| UI and text | `ui`, `ui-uitk`, `ui-ugui`, `ui-imgui`, `optimize-text-mesh-pro` | Detects the UI framework, then routes to specialized UI Toolkit, uGUI, or IMGUI skills. Configures TextMeshPro fonts and CJK (Chinese, Japanese, Korean) fonts |
| 2D | `2d-pixel-perfect`, `sprite-editor`, `manage-sprite-atlas`, `tilemap-palette-create`, `tilemap-ruletile-*` (three), `sprite-segment-3x3grid` | Fixes blurriness and jitter in pixel art, cuts out sprites, manages sprite atlases, creates tile palettes, and sets up rule tiles that connect automatically |
| Rendering | `urp-postprocessing`, `shader-graph-create-custom-node`, `validate-urp-render-graph-renderer-feature`, `migrate-birp-to-urp` | Post-processing in URP, custom nodes in Shader Graph from HLSL, inspecting renderer features that use Render Graph, migrating from the standard pipeline to URP |
| Audio | `audio-setup-mixers`, `optimize-audio`, `setup-vivox-voice-chat` | Routes to Audio Mixers, reduces audio memory and CPU usage, sets up voice chat |
| Game logic | `initialize-ai-navigation`, `physics-3d-collision` | NavMesh and pathfinding, diagnosing 3D collider and trigger problems |
| Monetization and operations | `implement-in-app-purchases`, `levelplay-unity-integration`, `build-live-game` | In-app purchases, ads (LevelPlay), cloud saves, leaderboards, and remote config |
| Multiplayer | `setup-multiplayer-services` | Hosting, matchmaking, and lobbies |
| Distribution and localization | `optimize-web`, `localization` | Optimizing WebGL and WebGPU builds, using Unity Localization |
| Search and tool development | `generate-editor-search-query`, `build-gtk`, `asset-transformer-toolkit` | Creating Editor search expressions, developing node-based tools with Graph Toolkit (Unity 6.6 and later), importing 3D models |

The skills most used in solo development are `unity-cli`, UI skills, 2D skills, `localization`, and `optimize-web` (a guess based on the order from prototype to release). Monetization and operations skills come into play once you are close to launch.

### Contents of the unity-cli skill

This skill teaches agents how to use the CLI (as of October 2026, [source](https://github.com/Unity-Technologies/unity-agent-plugin/tree/main/skills/unity-cli)).

- If the Editor is open, do not hand-edit scene or asset files; instead, operate through the Pipeline to create GameObjects and change settings. Hand-editing risks ID mistakes and accidentally editing a different scene.
- Use `unity command` to see a list of commands available to the connected Editor. The command names and arguments are determined by the Editor side (Pipeline package), so you check the list before using them. If multiple Editors are open, use `--project-path` to specify the target.
- The CLI sends crash reports and anonymous usage notifications. You can disable crash reports with the `UNITY_NO_CRASH_REPORT` environment variable.
- `unity command eval` can execute C# inside the Editor. It is protected by a security token, and communication stays on your local machine ([source](https://unity.com/blog/meet-the-unity-cli)).

## Installation

Regardless of which agent you use, you install the plugin once for that agent. No per-project setup is needed (only the Pipeline package requires `unity pipeline install` for each project you want to operate) ([source](https://docs.unity.com/en-us/ai/unity-plugin/about-unity-plugin)).

| Agent | Installation command | Verify | Update |
|---|---|---|---|
| Claude Code | In a session, `/plugin marketplace add Unity-Technologies/unity-agent-plugin`, then `/plugin install unity@unity-agent-plugin`. From terminal: `claude plugin marketplace add ...` and `claude plugin install unity@unity-agent-plugin` | Type `/unity:` to see the skills | `/plugin marketplace update unity-agent-plugin`. Third-party marketplaces default to no auto-update |
| Codex | `codex plugin marketplace add Unity-Technologies/unity-agent-plugin`, then `codex plugin add unity@unity-agent-plugin` | `codex plugin list` | `codex plugin marketplace upgrade unity-agent-plugin` |
| Grok Build | `grok plugin install Unity-Technologies/unity-agent-plugin --trust`. Or search for Unity in `/marketplace` and press `i` | Press `/` to see skills. `grok plugin list`, `grok plugin details unity` | `grok plugin update unity` |

Sources: [Claude Code](https://docs.unity.com/en-us/ai/unity-plugin/claude-code), [Codex](https://docs.unity.com/en-us/ai/unity-plugin/codex), [Grok](https://docs.unity.com/en-us/ai/unity-plugin/grok) official documentation (as of October 2026).

Additional notes:

- Claude Code asks which scope to apply during installation (user, project, or local). The official recommendation for multiple Unity projects is user scope. The default when installing from the terminal is also user scope.
- Manual installation is also available for Claude Code and Codex: clone the repository and symlink the skills folder. In this case, skill names do not have the `unity:` prefix (see README).
- If the CLI is not installed, the skills will suggest that the agent install it and add the Pipeline package. If you use Unity Hub, the Hub automatically installs the CLI. If you do not want to let the agent run scripts, install it yourself first.

### Installing the CLI alone

You can use the CLI by itself, without the plugin.

```bash
unity --version                           # Check version
unity install lts                         # Install the latest LTS Editor
unity editors -i                          # List installed Editors
unity open ./MyProject                    # Open a project
unity pipeline install                    # Install the Pipeline package in the project
unity self-update                         # Update the CLI
```

Sources: [Use the Unity CLI](https://docs.unity.com/en-us/unity-cli/use-unity-cli), [Unity CLI blog](https://unity.com/blog/meet-the-unity-cli) (as of October 2026).

## How solo developers use the tools

### Setup

1. Manage your project with Git and commit before you make a request. The README states: "The skills change your project directly. Some changes cannot be undone from the Editor."
2. In your project instruction file (`CLAUDE.md` or `AGENTS.md`), write the Unity version, UI framework (UI Toolkit or uGUI), render pipeline (URP or standard), and whether it is 2D or 3D. See [Project instruction files](/en/agent-dev/project-instructions/) for the format.
3. According to official guidance, when requesting UI work, write the framework name first. Unity recommends UI Toolkit for new projects; if you are already using uGUI, specify uGUI ([source](https://docs.unity.com/en-us/ai/unity-plugin/about-unity-plugin)).

### How to make requests

The README's examples use plain language: "Add an in-app purchase for coin packs," "I want to make a settings screen," "Pixel art is blurry and the camera causes jitter." The skill is selected based on the request.

- Keep requests small. Change one screen or one system in each request.
- When the plugin is installed, the agent asks questions before making changes. This helps with interactive use, but in automated workflows it causes pauses. For automation, include the information the agent needs in the request text (official best practice).
- If a skill is not being used, specify the skill by name (example: "Use the `ui-uitk` skill to...").
- If the result looks wrong, ask: "Read the `references/` folder for that skill and try again." Skipping this review tends to make output less accurate, according to the official guide.

### How to verify

The [verification loop](/en/agent-dev/verification-loop/) approach is applied to these tools in Unity:

| What to check | How |
|---|---|
| Does it compile | `unity recompile` (reports compile errors in the running Editor) |
| Is the logic intact | `unity test` (`--mode EditMode`, `--mode PlayMode`, `--filter`; results come as XML) |
| Does it actually work | Enter play mode, verify frames are advancing, then check screenshots and console |
| What happened | `unity logs`, Editor console |

The official guide warns about pitfalls in verifying play mode ([source](https://github.com/Unity-Technologies/unity-agent-plugin/tree/main/skills/unity-cli)).

- Entering play mode alone or getting a screenshot does not prove anything is working. In an unfocused Editor, the game can freeze on the first frame while the state shows "playing." A screenshot might just capture that frozen frame.
- To fix this, call `set_autotick` once per Editor session, then check that `Time.frameCount` is increasing before you look at the screen and console. That is the correct order.
- When the Editor starts with compile errors, it enters safe mode and does not load the Pipeline. Both `unity status` and `unity command` cannot connect. Check with `unity pipeline list`, fix the C# errors, and restart the Editor. That is the right procedure.
- If the agent is running in a sandbox (restricted environment), the running Editor might not show up in `unity status`. Do not assume the Editor does not exist before checking this possibility.

### When something is not working

The official documentation lists two limits of the Claude Code plugin ([source](https://docs.unity.com/en-us/ai/unity-plugin/claude-code)).

- Simple uGUI work shows almost no difference even with the plugin.
- Sonnet 5 can create many Unity features without the plugin, but tends to choose older methods. The plugin mainly helps with correctness.

For longer sessions, follow [context management](/en/agent-dev/context-management/) — save progress to files and split work into separate sessions at natural breaks. Play mode verification produces long output, so as a guess, breaking work into one feature per session makes it easier to handle.

## Relationship to engine selection

The official plugin and CLI are tools for people who chose Unity. Whether Unity or Godot or a browser engine better suits you depends on factors like whether the work is text-focused enough for AI, and whether you can ask an AI to use the editor. [Game Engine Comparison](/en/dev-env/engines/) covers this. The official tools in this article are the options available after you have chosen Unity.

## Which to use

| What you want | The right tool |
|---|---|
| Ask your usual agent to do Unity work | Official plugin (free) |
| Automate Editor installation, testing, and builds from scripts or CI | CLI (free) |
| Operate the Editor from an agent without shell access, or connect it via MCP | CLI with `unity mcp` (free) |
| Stay inside the Editor. Generate assets too | In-editor assistant (credit-based) |

The plugin content is the same across the three agents. The official blog says "choose the agent you prefer." So your choice comes down to the agent's cost, available models, and which one you already use. See [AI Coding Tools](/en/dev-env/ai-coding-tools/) and [Cost and usage management](/en/agent-dev/cost-management/) for comparisons.

## How to use AI

With the plugin and CLI installed, you can ask the agent like this:

- Starting a new project:

```text
I want to create a new 2D game in Unity 6. Use the new-unity-project skill to ask me
about concept, target platforms, and monetization strategy, then set up the Editor,
project, and Git. Do not write any game code yet.
```

- Investigate a symptom:

```text
The player clips through the floor sometimes. Use the physics-3d-collision skill
to examine the scene with unity command and list possible causes. Do not fix it yet.
```

- Request a change and verification together:

```text
Create a settings screen in UI Toolkit (volume slider and back button). After you
make it, run unity recompile to check for errors, open it in PlayMode, and report
a screenshot and console output.
```

- Draft the project instruction file:

```text
Read the Packages/manifest.json and ProjectSettings from this project. Draft what
should go in CLAUDE.md (Unity version, render pipeline, UI framework, and packages
in use).
```

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-05**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Meeting you where you work: Unity Plugin for Grok Build](https://unity.com/blog/unity-plugin-grok) — Announcement of the Grok Build plugin (October 1, 2026)
- [Meet the Unity CLI](https://unity.com/blog/meet-the-unity-cli) — Announcement of Unity CLI and Pipeline package (July 20, 2026)
- [Unity Plugin for Claude Code](https://unity.com/blog/unity-plugin-for-claude-code) — Announcement of Claude Code plugin (September 9, 2026)
- [Unity Plugin for Codex](https://unity.com/blog/unity-plugin-codex) — Announcement of Codex plugin (September 16, 2026)
- [unity-agent-plugin (GitHub)](https://github.com/Unity-Technologies/unity-agent-plugin) — Plugin repository. README and skill list
- [About Unity's plugin (Unity Docs)](https://docs.unity.com/en-us/ai/unity-plugin/about-unity-plugin) — How to use skills and best practices
- [Unity's plugin for Claude Code (Unity Docs)](https://docs.unity.com/en-us/ai/unity-plugin/claude-code) — Installation, update, and limitations
- [Unity's plugin for Codex (Unity Docs)](https://docs.unity.com/en-us/ai/unity-plugin/codex) — Installation and update for Codex
- [Unity's plugin for Grok (Unity Docs)](https://docs.unity.com/en-us/ai/unity-plugin/grok) — Installation and update for Grok Build
- [Use the Unity CLI (Unity Docs)](https://docs.unity.com/en-us/unity-cli/use-unity-cli) — CLI installation and main commands
- [Unity CLI as the replacement for the in-Editor MCP server (Unity Docs)](https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli) — Migrating to `unity mcp`
- [Unity's AI tools (unity.com)](https://unity.com/features/ai) — Positioning of each tool, pricing, and FAQ
- [About Unity Credits (Unity Docs)](https://docs.unity.com/en-us/ai/credits/credits-about) — Guide to credit consumption
