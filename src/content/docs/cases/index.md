---
title: 事例・ポストモーテム集
description: コーディングエージェントで作られたゲームの実例12本。どのモデルに、どんなプロンプトで、何ができて、どこで詰まったかを、作者本人の発信などの一次情報から整理しています。
sidebar:
  order: 1
  label: 事例集の読み方
lastUpdated: 2026-09-29
---

## 概要

「プロンプト1本で、本当にゲームは作れるのか」「作れたとして、そこから先はどう進めるのか」。この疑問に答えるために、実在する事例を集めました。

すべての事例は、作者本人の投稿、リポジトリ、開発ログ、ストアページなどの**一次情報**で確認できたものだけです。プロンプトが非公開の事例は、非公開と書いています。売上などの数字も、開発者が公表しているものだけを載せています。

## 事例の一覧

### ポン出し型：短いプロンプトから一気に作る

| 事例 | 時期 | モデル | 何が作れたか |
|---|---|---|---|
| [Claude of Duty](/cases/claude-of-duty/) | 2026年7月 | Claude Opus 5 | 約5.5万行の3D FPS。約150語のプロンプト1本 |
| [Starfall](/cases/oneshot-starfall/) | 2026年7月 | Claude Opus 5 | Homeworld 風の宇宙 RTS。上のプロンプトの改造版。費用は約633ドル |
| [THE LONG SILENCE](/cases/oneshot-long-silence/) | 2026年7月 | Claude Opus 5 | 手続き生成の宇宙探索ゲーム。24時間の自律実行 |
| [fable51-worlds](/cases/oneshot-fable51-worlds/) | 2026年9月 | Claude Fable 5.1 | 実在の街と映画の一場面の3D再現。約1,590行の設計書型プロンプト |

### 反復型：ポン出しのあと、遊んで育てる

| 事例 | 時期 | モデル | 何が作れたか |
|---|---|---|---|
| [A Game About Capybaras Delivering Food](/cases/browser-capybara/) | 2026年4〜6月 | Claude Code（Opus 4.7） | 2週間で作った3D配達ゲーム。AI専用ジャム Vibe Jam 2026 で1位 |
| [Grumbulus](/cases/browser-grumbulus/) | 2026年3月 | Claude | 「嵐の雲」の一言から作った約15,000行の2Dゲーム |
| [Plug & Prosper](/cases/browser-plug-prosper/) | 2026年8月 | Codex CLI（作者の申告） | 小さなパズルで AI Browser Game Jam 4 の総合1位。ただし「楽しさ」は11位 |
| [claude-breakout-clone](/cases/browser-breakout/) | 2025年7月 | Claude Opus 4 / Sonnet 4 | ブロック崩し。仕様・計画・会話ログをすべて公開 |

### 製品化型：公開・販売まで行った

| 事例 | 時期 | ツール | 結果（公表されている範囲） |
|---|---|---|---|
| [fly.pieter.com](/cases/postmortem-fly-pieter/) | 2025年2月〜 | Cursor（Claude、Grok 3） | 3時間で動き、広告枠を売って17日で月額換算8.7万ドル。本人は「持続しなかった」と分類 |
| [CODEX MORTIS](/cases/postmortem-codex-mortis/) | 2025年12月〜 | Claude Code | Steam で「100% AI」と明記して販売。レビューは92件中70件が好評 |
| [Patent Tycoon](/cases/postmortem-patent-tycoon/) | 2025年9月〜 | ChatGPT、Codex、Claude Code | 特許の経営シムを Steam で無料公開。公開10日後の起動221件、プレイ時間の中央値14分 |
| [Caldra](/cases/postmortem-caldra/) | 2024年8月〜 | Codex、Cursor | オンライン対戦カードゲームを Steam で無料公開。約1年10か月 |

## この事例集の読み方

- **プロンプトの長さと成果は比例しない。** 約150語のプロンプトが約5.5万行を生み、約1,590行の設計書は約2時間の作業になりました。何を書くかの違いは [プロンプトとモデルの一覧](/cases/prompts-by-model/) で比べられます。
- **「作れた」と「遊べる」は別。** 多くの事例で、最初の出力に足りなかったものは、遊んでから見つかっています。詳しくは [事例から見える共通点](/cases/lessons/) にまとめました。
- **独自性は、ポン出しの外側にある。** 題材、手触り、売り方、更新の仕方で差がついています。考え方は [ポン出しの先で独自性を出す](/agent-dev/differentiation/) を読んでください。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。12事例を収録。
<!-- AUTO-UPDATE:END -->

## 参考リンク
- [Claude of Duty（GitHub）](https://github.com/mshumer/Claude-of-Duty) — 事例集の出発点になったプロジェクト。各事例の出典は、それぞれの記事の参考リンクにまとめています
