---
title: AIコーディングツール
description: Claude Code・Cursor・GitHub Copilot・OpenAI Codex・Gemini CLI/Antigravity CLIの特徴と料金、ゲームエンジンとの連携方法を比較します。
sidebar:
  order: 2
lastUpdated: 2026-09-29
---

## 概要

AIコーディングツールは、コードの補完だけでなく、ファイルの読み書きやコマンド実行まで自律的に行う「エージェント」型が主流になっています。
この記事では、主要ツールの提供形態・料金・プロジェクト指示ファイル・MCP対応を比較し、ゲームエンジンのエディタとつなぐ方法を紹介します。
料金や提供形態は頻繁に変わるため、契約前に必ず公式ページを確認してください。

## 主要ツールの比較

| ツール | 提供形態 | 個人向け料金（2026年9月時点） | プロジェクト指示ファイル | MCP |
|---|---|---|---|---|
| Claude Code（Anthropic） | ターミナル（CLI）、VS Code・JetBrains拡張、デスクトップアプリ、Web | Claude の Pro（月20ドル、年払いなら月17ドル相当）以上に含まれる。Max は月100ドルから。Free プランには含まれない | `CLAUDE.md`（`AGENTS.md` も読める） | 対応 |
| Cursor | AIエディタ、CLI、クラウドエージェント | Hobby（無料、利用制限あり）、Individual は月20ドルから（上位に Pro+ / Ultra）。Teams は月40ドル/ユーザー | `.cursor/rules`、`AGENTS.md`、`CLAUDE.md` | 対応 |
| GitHub Copilot | VS Code などのIDE、Copilot CLI、クラウドエージェント | Free（無料、制限あり）、Pro 月10ドル、Pro+ 月39ドル、Max 月100ドル。チャットやエージェントの利用は「GitHub AI Credits」（1クレジット=0.01ドル）を消費 | `.github/copilot-instructions.md`、`AGENTS.md` など | 対応 |
| OpenAI Codex | CLI、IDE拡張、Web（クラウド）、デスクトップアプリ | ChatGPT の全プラン（Free、Go 月8ドル、Plus 月20ドル、Pro 月100ドルから）に含まれる。使える形態はプランで異なる | `AGENTS.md` | 対応（`codex mcp`） |
| Antigravity CLI / IDE（Google） | CLI、IDE | Individual は無料（利用制限あり）。Google AI Pro / Ultra で上限が上がる | 公式情報では確認できず（Gemini CLI の Skills、Hooks、Subagents、Extensions は引き継ぐ） | 対応（Phaser などがMCPの接続先として案内） |

:::caution[Gemini CLI は個人向けの提供が終了]
Google は2026年5月19日に Antigravity CLI を公開し、2026年6月18日に無料ユーザーと Google AI Pro / Ultra 利用者向けの Gemini CLI の提供を終了しました。Gemini Code Assist Standard / Enterprise など企業向けライセンスの利用者は、引き続き Gemini CLI を使えます（2026年9月時点）。古い記事の「Gemini CLI は無料で1日1,000リクエスト」という情報は、個人には当てはまりません。
:::

### 選び方の目安

- **ターミナル中心で、エージェントに長い作業を任せたい**: Claude Code、Codex、Antigravity CLI。ゲームエンジンのCLI（ビルド、テスト）と組み合わせやすい形です。
- **エディタ上で差分を見ながら進めたい**: Cursor、GitHub Copilot（VS Code）、または Claude Code の VS Code 拡張。
- **すでに契約しているサービスを活かしたい**: ChatGPT 契約者は Codex、GitHub を使っているなら Copilot、というように追加費用を抑えられます。
- **まず無料で試したい**: Copilot Free、Cursor Hobby、ChatGPT Free の Codex、Antigravity の Individual。いずれも利用量の上限があります。

複数のツールを併用する場合は、指示を `AGENTS.md` にまとめると共有しやすくなります。Claude Code、Cursor、Copilot、Codex はいずれも `AGENTS.md` を読めます（2026年9月時点）。

## ゲームエンジンのエディタと連携する

MCP（Model Context Protocol）は、AIツールと外部のアプリやデータをつなぐ共通の規格です。ゲームエンジン側がMCPサーバーを用意していれば、AIがエディタ内のシーン構造やログを直接読み、操作できます。

| エンジン | 連携手段（2026年9月時点） | 概要 |
|---|---|---|
| Unity | 公式 Unity MCP | AI Assistant パッケージに同梱。シーン階層、GameObject、コンポーネントの値、コンソールのメッセージなどにアクセスできる。Claude Code、Cursor、Codex などに対応。オープンベータで、Unity AI ツールの試用またはサブスクリプションが必要。MCP自体はクレジットを消費しない |
| Unreal Engine | UE 5.8 の実験的MCPプラグイン | ブループリント、アセット、レベル、マテリアルなどへのアクセス機能を持つ。任意のモデルを接続できる |
| Godot | コミュニティ製MCPサーバー | 例: Godot AI（MIT License）は Claude Code、Codex、Cursor などから起動中のエディタに接続し、シーンやスクリプトを操作できる。公式プロジェクトではない |
| Phaser | 公式 Phaser Game Agent MCP | Claude Code、Cursor、VS Code、Codex、Antigravity などに対応。クラウド上のサンドボックスで開発し、実行時間は分単位課金、画像・音声の生成はクレジット消費 |

導入の基本的な流れは、どのツールでもほぼ同じです。

1. エンジン側でMCPサーバー（またはプラグイン）を有効にする
2. AIツールの設定にMCPサーバーを登録する（例: Claude Code なら `claude mcp add`、Codex なら `codex mcp add`）
3. 「現在のシーンのノード構成を一覧して」のような読み取りだけの依頼で、接続を確かめる
4. 変更を伴う依頼は、Git でコミットしてから行う

:::tip
コミュニティ製のMCPサーバーは、エディタ内でコードを実行できる強い権限を持ちます。導入前にリポジトリの更新状況やライセンスを確認し、信頼できるものだけを使ってください。
:::

## AIの活用ポイント

- **「どのツールが一番か」より「自分の作業の流れに合うか」で選ぶ**: 試用期間や無料枠で、同じ小さな課題（例: 「プレイヤーをジャンプさせる」）を各ツールに頼んで比べるのが確実です。
- **利用上限を意識する**: 多くのプランは一定時間あたりの利用量やクレジットで制限されます。長い作業は、仕様を先に固めてから一度に頼む方が無駄が減ります。
- **エンジンのバージョンと言語を指示ファイルに書く**: AIは古いAPIを使いがちです。詳しくは [AI駆動の開発ワークフロー](/dev-env/ai-workflow/) を参照してください。
- **生成したコードの権利や規約も確認する**: ツールごとの商用利用条件は [AIツールの商用利用条件](/legal/tool-terms/) にまとめています。

## 最新情報

:::note[自動更新]
この欄は情報収集エージェントが毎週更新しています。
:::

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Claude Code overview](https://code.claude.com/docs/en/overview) — Claude Code の提供形態と主な機能
- [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp) — `claude mcp add` によるMCPサーバーの登録
- [Claude の料金プラン](https://claude.com/pricing) — Pro / Max / Team の料金と Claude Code の対象プラン
- [Cursor Pricing](https://cursor.com/pricing) — Cursor の各プラン
- [Cursor Rules](https://cursor.com/docs/rules) — `.cursor/rules` と `AGENTS.md` の使い方
- [GitHub Copilot plans](https://github.com/features/copilot/plans) — Copilot の各プランと GitHub AI Credits
- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot) — Copilot の指示ファイル
- [Copilot coding agent now supports AGENTS.md](https://github.blog/changelog/2025-08-28-copilot-coding-agent-now-supports-agents-md-custom-instructions/) — Copilot の `AGENTS.md` 対応（GitHub Changelog）
- [Codex の料金](https://learn.chatgpt.com/docs/pricing) — ChatGPT の各プランと Codex の提供範囲
- [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) — Codex CLI の導入、MCP、`AGENTS.md`
- [Transitioning Gemini CLI to Antigravity CLI](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) — Gemini CLI から Antigravity CLI への移行（Google Developers Blog）
- [Gemini CLI: Quotas and pricing](https://geminicli.com/docs/resources/quota-and-pricing/) — 企業向けに残る Gemini CLI の利用枠
- [Google Antigravity Pricing](https://antigravity.google/pricing) — Antigravity の各プラン
- [Unity MCP Server: Connect Claude Code, Cursor, and other AI Agents](https://unity.com/blog/unity-ai-mcp-how-to-get-started) — 公式 Unity MCP の導入手順
- [Unity AI](https://unity.com/features/ai) — Unity AI の料金と、MCP がクレジットを消費しないこと
- [Unreal Engine 5.8 がリリースされました](https://www.unrealengine.com/news/unreal-engine-5-8-is-now-available) — 実験的MCPプラグインの紹介
- [Godot AI（GitHub）](https://github.com/hi-godot/godot-ai) — コミュニティ製の Godot 向けMCPサーバー
- [Phaser Game Agent MCP setup](https://phaser.io/agent/mcp) — Phaser 公式のMCP接続手順
