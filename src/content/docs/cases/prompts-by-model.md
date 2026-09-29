---
title: どのモデルに、どんなプロンプトで、何が作れたか
description: 事例集の12本を、モデル、プロンプトの型、成果物、かかった時間と費用で横断して比べます。自分の目的に近いプロンプトの型を選ぶための早見表です。
sidebar:
  order: 20
lastUpdated: 2026-09-29
---

## 概要

事例を1本ずつ読むと、「結局、自分は何を書けばいいのか」が分かりにくくなります。この記事では12本の事例を並べ、**プロンプトの型**、**モデル**、**成果物**、**かかった時間と費用**で比べます。

表の数字は、作者が自分で公表したものだけです。公表されていない項目は「非公開」と書いています。各行の詳細は、リンク先の事例記事にあります。

## プロンプトの型は5つに分けられる

| 型 | 中身 | 向いている場面 | 事例 |
|---|---|---|---|
| A. 目標＋実物比較＋批評役 | 目標を短く書き、実物と見比べる批評役を置いて、満足するまで回す（約150語） | 見た目の完成度を一気に上げたい。手作業では作れない量の実装 | [Claude of Duty](/cases/claude-of-duty/)、[Starfall](/cases/oneshot-starfall/) |
| B. 設計書型 | 体験の定義、調査、分担、検証、終了条件までを設計書として書く（約1,590行） | 対象が実在する場所や作品で、正確さが要る | [fable51-worlds](/cases/oneshot-fable51-worlds/) |
| C. 「譲れない条件」＋自律実行 | 見た目などの条件を1点だけ固定し、あとはモデルに任せて長時間回す | 内容はモデルに考えさせたい | [THE LONG SILENCE](/cases/oneshot-long-silence/) |
| D. 概念の一言＋遊んで直す | 概念を1行で渡し、設計と実装をモデルに任せ、遊んだ感想をそのまま伝えて直す | 手早く動くものを作って、手触りを人が詰める | [Grumbulus](/cases/browser-grumbulus/)、[fly.pieter.com](/cases/postmortem-fly-pieter/) |
| E. 仕様を質問で詰めて段階実装 | 仕様書、計画書、TODOを作らせ、小さな塊で実装とコミットを繰り返す | 長く育てる。あとで直しやすい形にしたい | [claude-breakout-clone](/cases/browser-breakout/) |

型は排他的ではありません。[A Game About Capybaras Delivering Food](/cases/browser-capybara/) は、エディタなどの道具を先に作らせる進め方（型Dに近い）に、指示ファイルのルール（型E）を組み合わせています。

## モデル別の一覧

### Claude Opus 5（2026年7月）

| 事例 | プロンプト | 成果物 | 時間・費用（公表分） |
|---|---|---|---|
| Claude of Duty | 型A。英語で約150語、3段落 | 約5.5万行の3D FPS。作者自身が「Call of Duty には届いていない」と評価 | 「何時間も」とだけ述べ、数字は非公開 |
| Starfall | 型A（上の改造版）。範囲を絞る一文と、RTS向けの描画指示を追加 | 13種の艦船を持つ宇宙RTS。公開後の数日間で多数の修正 | 約633ドル（作者の投稿） |
| THE LONG SILENCE | 型C。初回のプロンプトと、判定役を置いた24時間の `/goal` の2本 | 手続き生成の宇宙探索。初回コミットは54,228行の追加 | 24時間。費用は非公開 |

### Claude Fable 5.1（2026年9月）

| 事例 | プロンプト | 成果物 | 時間・費用（公表分） |
|---|---|---|---|
| fable51-worlds | 型B。約1,590行の設計書と、約10KBのもう1本 | Union Square の3D再現（453棟）、約1.8万行の Trench Run | 約2時間、約800万トークン、約33ドル（Hacker News での作者側の説明） |

### それ以外のモデルとツール

| 事例 | モデル・ツール | プロンプト | 成果物 | 時間・費用（公表分） |
|---|---|---|---|---|
| A Game About Capybaras Delivering Food | Claude Code（Opus 4.7） | 全文は非公開。エディタを作らせる依頼と、調整用スライダーのルールが断片で公開 | 約27,000行、188コミットの3D配達ゲーム。Vibe Jam 2026 で1位 | 約2週間 |
| Grumbulus | Claude（版は非公開） | 型D。最初は概念だけ | 約15,000行の2Dゲーム | 2日間のプレイテストで育てた |
| Plug & Prosper | Codex CLI、GPT 5.6 Sol（作者の申告） | 非公開 | 手作りの5レベルの2Dパズル。ジャム126本中1位、「楽しさ」は11位 | 非公開 |
| claude-breakout-clone | Claude Opus 4、途中から Sonnet 4（2025年7月） | 型E。仕様書、計画書、会話ログが全部公開 | パワーアップ付きのブロック崩し | 約4時間、47コミット |
| fly.pieter.com | Cursor（Claude、サーバーは Grok 3）（2025年2月） | 型D。最初は「高層ビルのある3D飛行ゲーム」の一言 | 約3時間で動き、約8時間でマルチプレイ | 月額換算8.7万ドルの広告枠の売上（本人の投稿） |
| CODEX MORTIS | Claude Code（Opus 4.1、4.5） | 非公開 | 弾幕サバイバー。1.0で200種のスペルと14ステージ | 最初のデモまで約3か月 |
| Patent Tycoon | ChatGPT、Codex、Claude Code | 非公開 | 約9万行の経営シム | 約3.5か月で体験版、約7.5か月で製品版 |
| Caldra | Codex、Cursor | 非公開 | 約60種のカードのオンライン対戦ゲーム | 約1年10か月 |

## 読み取れること

**1. 同じ世代のモデルでも、プロンプトの書き方で出てくるものが違う。** 2026年7月の Opus 5 の3事例は、どれも「短い目標と、実物と比べる批評役」で始まっています。作れたものは、FPS、RTS、宇宙探索と、ジャンルによって大きく違います。

**2. 費用は、公表されている範囲で20倍近い開きがある。** 約33ドル（約2時間、約800万トークン）から約633ドルまでです。最も長いプロンプト（約1,590行）の事例が、安い側にあります。プロンプトの長さと費用は比例していません。fable51-worlds は、サブエージェントごとにトークンの上限を決めさせています。

**3. プロンプトが非公開の事例が多い。** 製品化まで行った事例では、プロンプトそのものはほぼ公開されていません。代わりに、進め方、指示の粒度、失敗談が言葉で残っています。

**4. 世代の違う事例も、進め方は似ている。** 2025年の [claude-breakout-clone](/cases/browser-breakout/) と [fly.pieter.com](/cases/postmortem-fly-pieter/) は、今のモデルより前の世代です。それでも、遊んで直す往復が中心になる点は、2026年の事例と変わりません。

## 自分のプロンプトを選ぶには

| 目的 | 選ぶ型 | 最初に読む記事 |
|---|---|---|
| 見た目の完成度を一気に上げたい | A（実物比較＋批評役） | [Claude of Duty](/cases/claude-of-duty/) |
| 実在の場所や作品を正確に再現したい | B（設計書型） | [fable51-worlds](/cases/oneshot-fable51-worlds/) |
| 内容はモデルに考えさせたい | C（譲れない条件＋長時間） | [THE LONG SILENCE](/cases/oneshot-long-silence/) |
| 早く動かして、手触りを詰めたい | D（一言＋遊んで直す） | [Grumbulus](/cases/browser-grumbulus/) |
| 長く育てる。あとで直しやすくしたい | E（仕様を質問で詰める） | [claude-breakout-clone](/cases/browser-breakout/) |

プロンプトの書き方の型は [ゲーム開発のプロンプトの型](/agent-dev/prompt-patterns/)、ポン出しの先の進め方は [ポン出しから製品まで](/agent-dev/from-one-shot-to-product/) にまとめています。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク
- [Claude of Duty のプロンプト（GitHub）](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md) — 型Aの原典
- [fable51-worlds（GitHub）](https://github.com/PhiloLabs/fable51-worlds) — 型Bの原典
- [claude-breakout-clone（GitHub）](https://github.com/lmorchard/claude-breakout-clone) — 型Eの原典。仕様書、計画書、会話ログが公開されている
