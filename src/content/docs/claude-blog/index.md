---
title: Claude Code 公式ブログ：11本を1本ずつ掘り下げ
description: Claude Code の公式ブログ（claude.dev）の11本を、1本ずつ別の記事に掘り下げました。原文の流れ、数字、例を押さえたうえで、ゲーム制作での使いどころをつけています。
sidebar:
  order: 0
  label: 連載の入口と読む順番
lastUpdated: 2026-10-04
---

## 概要

Claude Code の公式ブログ（[claude.dev/blog](https://claude.dev/blog/)）の記事を、1本ずつ別の記事にして掘り下げています。2026年10月時点で確認できた11本が対象です。
各記事は、原文の流れに沿って、数字、表、例、判断の理由を落とさず書き、そのあとに「ゲーム制作での使いどころ」を付けています。原文は、ほとんどがゲームに触れていません。ゲーム向けの話は、原文の内容とは分けて、この Wiki の考えとして書いています。
ここは、その入口です。どの順番で読むか、記事どうしのつながり、共通する考え方をまとめます。

## 11本の一覧

| 記事 | 公開日 | 一言 | 読了時間（原文） |
|---|---|---|---|
| [effort をどこに使うか](/claude-blog/spending-your-effort/) | 2026-09-25 | effort を上げると、確認と抜け漏れの検討が増える。仕様が固いほど差は縮む | 8分 |
| [コンテキストエンジニアリングの新ルール](/claude-blog/context-engineering/) | 2026-07-24 | システムプロンプトを8割以上削った。規則を減らし、必要なときに読ませる | 7分 |
| [Skill の使い方](/claude-blog/skills/) | 2026-06-03 | Skill は手順書ではなくフォルダ。検証用の Skill が一番効く | 11分 |
| [エージェントの視点で見るツール設計](/claude-blog/tool-design/) | 2026-04-10 | ツールは、モデルの目で見て作り直す | 7分 |
| [作業ごとにハーネスを作る動的ワークフロー](/claude-blog/dynamic-workflows/) | 2026-06-02 | サブエージェントの構成を、作業ごとにコードで組む | 11分 |
| [eval の設計と hillclimbing の自動化](/claude-blog/eval-hillclimbing/) | 2026-09-28 | 良い eval を作り、過学習を避けて1つずつ改善する | 12分 |
| [Claude Code の mods](/claude-blog/mods/) | 2026-10-01 | Claude Code の動作と画面を、JS/TS の小さなファイルで拡張する | 11分 |
| [Claude Sonnet 5.5 で作る](/claude-blog/sonnet-5-5/) | 2026-09-28 | Opus との使い分け、料金、Sonnet 5 からの移行 | 9分 |
| [Opus 5.5 を使いこなす](/claude-blog/opus-5-5-guide/) | 2026-09-22 | 頼み方、長い作業の見守り方、結果の確かめ方 | 9分 |
| [Opus 5.5 でタスク1件にいくらかかるか](/claude-blog/opus-5-5-cost/) | 2026-09-25 | ターン数、キャッシュ、出力、モデルの4要素で費用を分解する | 21分 |
| [claude.ai を2週間で3倍速くした方法](/claude-blog/faster-claude-ai/) | 2026-09-23 | 測れるものを作ってから、エージェントに登らせる性能改善 | 15分 |

公開日と読了時間は、原文のページで確かめたものです。著者は、effort、コンテキスト、Skill、ツール設計が Thariq Shihipar 氏、動的ワークフローが Thariq Shihipar 氏と Sid Bidasaria 氏、eval が Lance Martin 氏、mods、Sonnet 5.5、Opus 5.5 の使い方、Opus 5.5 の費用の4本が Addy Osmani 氏です。claude.ai の高速化は、Raymond Wang 氏、Sam Attard 氏、Issac G. 氏の3人です。

## どの順番で読むか

目的別に、入口を3つ用意しました。

| 目的 | 読む順番 |
|---|---|
| 毎日の使い方を整えたい | effort → コンテキストエンジニアリング → Skill |
| 費用と、モデルの選び方を知りたい | Opus 5.5 でタスク1件にいくらか → Sonnet 5.5 → Opus 5.5 を使いこなす → effort |
| 大きな作業を任せたい、品質を測りたい | 動的ワークフロー → eval と hillclimbing → ツール設計 → mods |

claude.ai の高速化の記事は、Webゲームの速度改善に使える部分を取り出して読む記事です（原文は Anthropic 自身のサービスの話です）。

## 記事どうしのつながり

- コンテキスト、Skill、ツール設計の3本は、いずれも「必要なときに読み込む」設計（progressive disclosure）を扱います。
- 動的ワークフローは、作ったワークフローを Skill として配れること、Skill の評価に使えることを書いています。
- eval は、改善の対象に、プロンプト、Skill、指示ファイル、モデル、effort を挙げています。effort は、その調整パラメータの1つです。
- 費用の記事は、effort やモデルの選び方を、請求の数字で説明します。effort の記事と、Sonnet 5.5 の記事とあわせて読むと、判断の材料がそろいます。
- 「別のエージェントが敵対的に検証する」と「終わるまで繰り返す」を、実物との比較で組み合わせた例が、Claude of Duty の作者が名付けた [Gauntlet Loop](/agent-dev/gauntlet-loop/) です。

## 11本に共通すること

原文から読み取れる共通点です。

- 全部を最初に入れない。コンテキスト、Skill、ツール設計が、必要なときに読ませる設計を勧めています。
- モデルが賢くなったら、古い前提を見直す。コンテキストの記事は規則と例を、ツール設計の記事は ToDo ツールを、そのために削除、置き換えています。
- 確認を分離する。動的ワークフローは検証役を別のコンテキストに置き、eval は未見のテスト用の事例で過学習を避けます。effort は、確認の量の調整として説明されています。
- 費用との釣り合いを見る。動的ワークフローは普通の作業に審査員5人は要らないと書き、費用の記事は、請求の内訳から効く場所を探します。

推測ですが、ゲーム制作では、検証の仕組み（Skill の検証用 Skill、eval の採点、mods のコマンド確認）を先に作り、そのうえで動的ワークフローのような大きな作業を任せる順番が、手戻りが少ないと考えられます。

## ゲーム制作との関係

この Wiki のほかの記事とは、次のようにつながっています。

| テーマ | この連載 | Wiki の記事 |
|---|---|---|
| 設定とコスト | effort、Sonnet 5.5、Opus 5.5 のコスト | [コスト管理](/agent-dev/cost-management/) |
| 指示ファイル、コンテキスト | コンテキストエンジニアリング、Skill | [指示ファイル](/agent-dev/project-instructions/)、[コンテキスト管理](/agent-dev/context-management/) |
| 検証 | Skill、eval、動的ワークフロー | [検証ループ](/agent-dev/verification-loop/)、[Gauntlet Loop](/agent-dev/gauntlet-loop/) |
| 並列、大きな作業 | 動的ワークフロー | [並列開発](/agent-dev/parallel-agents/) |
| Webゲームの性能 | claude.ai の高速化 | [Webゲームの技術選び](/agent-dev/web-game-stack/) |

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: 11本を、1本ずつ別の記事に掘り下げた。新たに Sonnet 5.5、Opus 5.5 の使い方、Opus 5.5 の費用、claude.ai の高速化の4本を追加。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Claude Code ブログ（claude.dev）](https://claude.dev/blog/) — 原文の一覧
