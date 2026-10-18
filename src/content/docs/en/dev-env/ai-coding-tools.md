---
title: AI Coding Tools
description: Compare features, pricing, and game engine integration for Claude Code, Cursor, GitHub Copilot, OpenAI Codex, Gemini CLI, and Antigravity CLI.
sidebar:
  order: 2
lastUpdated: 2026-10-19
---

## Overview

AI coding tools are shifting from simple code completion toward autonomous "agent" models that can read and write files and execute commands. This article compares the major tools by deployment method, pricing, project instruction files, and MCP support, and shows how to connect them with game engine editors.

## Comparison of major tools

| Tool | Deployment | Pricing for individuals (as of September 2026) | Project instruction file | MCP |
|---|---|---|---|---|
| Claude Code (Anthropic) | Terminal (CLI), VS Code and JetBrains extensions, desktop app, web | Included in Claude Pro (USD 20/month, USD 17/month annual) and higher. Max starts at USD 100/month. Not included in Free plan | `CLAUDE.md` (can also read `AGENTS.md`) | Supported |
| Cursor | AI editor, CLI, cloud agent | Hobby (free, usage limits), Individual from USD 20/month (Pro+, Ultra available). Teams USD 40/month per user | `.cursor/rules`, `AGENTS.md`, `CLAUDE.md` | Supported |
| GitHub Copilot | VS Code and other IDEs, Copilot CLI, cloud agent | Free (limited), Pro USD 10/month, Pro+ USD 39/month, Max USD 100/month. Chat and agent usage consume "GitHub AI Credits" (1 credit = USD 0.01) | `.github/copilot-instructions.md`, `AGENTS.md`, etc. | Supported |
| OpenAI Codex | CLI, IDE extensions, web (cloud), desktop app | Included in all ChatGPT plans (Free, Go USD 8/month, Plus USD 20/month, Pro USD 100+/month). Available features vary by plan | `AGENTS.md` | Supported (`codex mcp`) |
| Antigravity CLI / IDE (Google) | CLI, IDE | Individual free (usage limits). Limits increase with Google AI Pro / Ultra | `AGENTS.md`, `GEMINI.md`, `.agents/rules/` ([Antigravity Rules](https://antigravity.google/docs/rules). Gemini CLI Skills, Hooks, Subagents, and Extensions carry over) | Supported (guides services like Phaser as MCP connection points) |

:::caution[Gemini CLI personal offering ended]
Google released Antigravity CLI on May 19, 2026, and discontinued Gemini CLI for free users and Google AI Pro / Ultra subscribers on June 18, 2026. Users with Gemini Code Assist Standard / Enterprise and other enterprise licenses can continue using Gemini CLI (as of September 2026). Older articles stating "Gemini CLI is free with 1,000 requests per day" do not apply to individuals.
:::

### How to choose

- **Terminal-focused, want agents for long-running tasks**: Claude Code, Codex, Antigravity CLI. These pair well with game engine CLI tools (build, test).
- **Want to see diffs while editing**: Cursor, GitHub Copilot (VS Code), or Claude Code's VS Code extension.
- **Want to leverage existing services**: ChatGPT subscribers can use Codex, GitHub users can use Copilot, and so on, reducing additional costs.
- **Want to try free first**: Copilot Free, Cursor Hobby, ChatGPT Free's Codex, and Antigravity Individual. All have usage limits.

When using multiple tools together, putting instructions in `AGENTS.md` makes them easier to share. Claude Code, Cursor, Copilot, and Codex can all read `AGENTS.md` (as of September 2026).

## Connecting with game engine editors

MCP (Model Context Protocol) is a shared standard that links AI tools with external apps and data. If a game engine provides an MCP server, the AI can read and manipulate scene structure, logs, and other editor internals directly.

| Engine | Integration (as of September 2026) | Overview |
|---|---|---|
| Unity | Unity CLI MCP mode (`unity mcp`), official plugins | Access to scene hierarchy, GameObjects, component values, console messages, and more. Supports Claude Code, Cursor, Codex, and others. CLI is free; Unity AI contract not required (legacy AI Assistant package MCP server is deprecated; CLI replaces it). Official plugins target Claude Code, Codex, Grok Build. See [Unity's official agent integration](/en/dev-env/unity-agent-plugins/) |
| Unreal Engine | UE 5.8 experimental MCP plugin | Access to blueprints, assets, levels, materials, and more. Supports any model |
| Godot | Community-made MCP server | Example: Godot AI (MIT License) connects from Claude Code, Codex, Cursor to a running editor and can manipulate scenes and scripts. Not an official project |
| Phaser | Official Phaser Game Agent MCP | Supports Claude Code, Cursor, VS Code, Codex, Antigravity, and others. Development runs in a cloud sandbox; runtime is billed per minute, image and audio generation consumes credits |

The basic setup flow is nearly the same across all tools.

1. Enable the MCP server (or plugin) in the engine
2. Register the MCP server in the AI tool's configuration (example: `claude mcp add` for Claude Code, `codex mcp add` for Codex)
3. Verify the connection with read-only requests like "list the current scene's node structure"
4. For changes, commit to Git first

:::tip
Community-made MCP servers have the powerful ability to execute code inside the editor. Before adopting one, check the repository's update status and license, and use only those you trust.
:::

## How to use AI

- **Choose based on "Does it fit my workflow" not "Which is best"**: Use free trials or credits to try the same small task (example: "make the player jump") across tools and compare.
- **Be aware of usage limits**: Most plans limit usage per unit time or through credit consumption. Lock down your spec first for longer tasks; doing it all at once wastes less.
- **Write engine version and language in your instruction file**: AI tends to use older APIs. See [AI-driven development workflow](/en/dev-env/ai-workflow/) for details.
- **Rights and terms for generated code**: Commercial use terms for each tool are summarized in [Commercial use of AI tools](/en/legal/tool-terms/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-10-13**: Google released Gemini 4 Argon. It is available in AI Studio and the Gemini API, and Google AI Ultra subscribers can also use it in Antigravity. The introductory price is $2 per million input tokens and $10 per million output tokens until November 30, 2026. After that, it will be $4 for input and $20 for output. The official blog shows demos of 3D games rendered in the browser without external libraries, but it has no performance comparison for game development ([source](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/))
- **2026-10-01**: Unity releases official plugin for Grok Build. Includes 30+ skills written by Unity engineers (UI Toolkit, Shader Graph, physics, IAP, multiplayer, and more); targets Unity 6 and later. Third agent to support (after Claude Code and Codex) ([source](https://unity.com/blog/unity-plugin-grok))
- **2026-09-28**: Claude Sonnet 5.5 released. 30% faster output and up to 30% lower cost per task vs. Sonnet 5. API pricing remains USD 2/input, USD 10/output (per million tokens) ([source](https://www.anthropic.com/claude-sonnet-5-5))
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Claude Code overview](https://code.claude.com/docs/en/overview) — Claude Code deployment methods and main features
- [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp) — Register MCP servers with `claude mcp add`
- [Claude pricing plans](https://claude.com/pricing) — Pro / Max / Team pricing and eligible Claude Code plans
- [Cursor Pricing](https://cursor.com/pricing) — Cursor plan options
- [Cursor Rules](https://cursor.com/docs/rules) — How to use `.cursor/rules` and `AGENTS.md`
- [GitHub Copilot plans](https://github.com/features/copilot/plans) — Copilot plan options and GitHub AI Credits
- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot) — Copilot instruction files
- [Copilot coding agent now supports AGENTS.md](https://github.blog/changelog/2025-08-28-copilot-coding-agent-now-supports-agents-md-custom-instructions/) — Copilot `AGENTS.md` support (GitHub Changelog)
- [Codex pricing](https://learn.chatgpt.com/docs/pricing) — ChatGPT plan options and Codex availability (in Japanese)
- [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) — Codex CLI setup, MCP, `AGENTS.md`
- [Transitioning Gemini CLI to Antigravity CLI](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) — Migration from Gemini CLI to Antigravity CLI (Google Developers Blog)
- [Gemini CLI: Quotas and pricing](https://geminicli.com/docs/resources/quota-and-pricing/) — Usage limits for Gemini CLI remaining for enterprise users
- [Google Antigravity Pricing](https://antigravity.google/pricing) — Antigravity plan options
- [Replace the in-Editor MCP server with the Unity CLI](https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli) — Deprecation of old MCP server and migration to CLI
- [Unity's AI tools](https://unity.com/features/ai) — Positioning and pricing of Unity's AI tools
- [Unreal Engine 5.8 is now available](https://www.unrealengine.com/news/unreal-engine-5-8-is-now-available) — Introduction of experimental MCP plugin
- [Godot AI (GitHub)](https://github.com/hi-godot/godot-ai) — Community-made MCP server for Godot
- [Phaser Game Agent MCP setup](https://phaser.io/agent/mcp) — Phaser's official MCP setup instructions
