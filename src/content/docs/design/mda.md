---
title: MDAフレームワーク
description: ゲームをメカニクス・ダイナミクス・エステティクスの3層で捉えるMDAフレームワークと、8種類の美的要素、設計への使い方
sidebar:
  order: 2
lastUpdated: 2026-09-29
---

## 概要

- **MDAフレームワーク**は、ゲームを Mechanics（ルール）・Dynamics（遊んだときの振る舞い）・Aesthetics（プレイヤーが感じる感情）の3層に分けて考える枠組みです。
- 出典は Robin Hunicke、Marc LeBlanc、Robert Zubek による2004年の論文「MDA: A Formal Approach to Game Design and Game Research」です。GDCの Game Design and Tuning Workshop（2001〜2004年）で教えられていた内容をまとめたものです（[AAAI](https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/)）。
- 「面白い」という曖昧な言葉を、8種類の美的要素（楽しさの種類）に分けて話せるようになるのが大きな利点です。
- この記事では3層の意味、8つの美的要素、企画・調整への使い方を説明します。

## 3つの層

論文では、ゲームを次の3つの要素に分け、それぞれの設計上の対応物を示しています（[MDA論文](https://users.cs.northwestern.edu/~hunicke/MDA.pdf)）。

| 層 | 論文での定義（要約） | 対応するもの | 例（カードゲーム） |
|---|---|---|---|
| Mechanics（メカニクス） | データ表現とアルゴリズムのレベルでのゲームの構成要素 | ルール | シャッフル、トリックテイキング、賭け |
| Dynamics（ダイナミクス） | メカニクスがプレイヤーの入力や互いの出力に反応して、時間とともに生まれる実行時の振る舞い | システム | ブラフ（はったり） |
| Aesthetics（エステティクス） | プレイヤーがゲームと関わるときに引き起こされる、望ましい感情的な反応 | 楽しさ | 駆け引きの緊張感 |

エンジニア向けに言い換えると、メカニクスは「コードとデータ」、ダイナミクスは「実行したときの挙動」、エステティクスは「ユーザー体験」です。論文の例では、シューターの武器・弾薬・リスポーン地点（メカニクス）から、待ち伏せや狙撃（ダイナミクス）が生まれるとしています。

### 作り手と遊び手で見る順番が逆

- **作り手**: メカニクス → ダイナミクス → エステティクス の順に作用する
- **遊び手**: エステティクス（雰囲気・感情）→ ダイナミクス → メカニクス の順に触れる

作り手が直接いじれるのはメカニクスだけです。感情は、ダイナミクスを通じて間接的にしか作れません。論文は、プレイヤー側から考えることで「機能を積み上げる設計」ではなく「体験から逆算する設計」になると述べています。

## 8種類の美的要素

論文は「fun」や「gameplay」といった言葉の代わりに、次の分類を示しています。論文自身が「これに限らない」と断っている点に注意してください。

| # | 名前 | 論文の一言定義 | 日本語での意味 |
|---|---|---|---|
| 1 | Sensation | Game as sense-pleasure | 感覚の快楽（映像・音・手触り） |
| 2 | Fantasy | Game as make-believe | ごっこ遊び、別の世界や役になりきる |
| 3 | Narrative | Game as drama | 物語、ドラマの展開 |
| 4 | Challenge | Game as obstacle course | 挑戦、障害を乗り越える |
| 5 | Fellowship | Game as social framework | 仲間との交流、社会的な場 |
| 6 | Discovery | Game as uncharted territory | 発見、未知の場所の探索 |
| 7 | Expression | Game as self-discovery | 自己表現 |
| 8 | Submission | Game as pastime | 暇つぶし、没頭して時間を過ごす |

論文では、既存ゲームを次のように分析しています。

- ジェスチャーゲーム（Charades）: Fellowship、Expression、Challenge
- Quake: Challenge、Sensation、Competition（競争）、Fantasy
- The Sims: Discovery、Fantasy、Expression、Narrative
- Final Fantasy: Fantasy、Narrative、Expression、Discovery、Challenge、Submission

1つのゲームが複数の美的要素を、異なる比重で持っていることが分かります。

## 設計への使い方

### 1. 狙う美的要素を先に決める

企画の最初に、8つのうち主に狙うものを2〜3個選び、優先順位を付けます。例えば「Challenge を主、Discovery を副」と決めれば、迷ったときの判断基準になります。企画書に書く方法は [企画書テンプレート](/design/game-design-doc/) を参照してください。

### 2. ダイナミクスに落とす

論文では、Challenge は時間制限や対戦相手によって生まれ、Fellowship は情報をチームだけで共有させたり、1人では達成しにくい勝利条件を置いたりすることで促せる、と例示しています。Expression は、アイテムの購入・建築、レベルや世界の作成、キャラクターの個性化といった仕組みから生まれるとしています。

### 3. メカニクスで調整する

論文の代表例がモノポリーです。

- **問題（ダイナミクス）**: 裕福なプレイヤーほど他人から効率よく取り立てられ、差が開き続ける。やがて一部の人しか熱中していない状態になり、緊張感が失われる
- **対策（メカニクス）**: 遅れているプレイヤーへの補助や、裕福なプレイヤーへの課税を加える。あるいは時間とともに資源が減る仕組みで展開を速める
- **調整**: 数値をプレイテストで繰り返し詰める。ただし計算が複雑すぎると、プレイヤーが状況を把握しにくくなり逆効果になる

このように「狙う感情 → それを壊しているダイナミクス → 変えるべきメカニクス」の順に原因を追うのがMDAの基本的な使い方です。数値の詰め方は [バランス調整](/design/balancing/) を参照してください。

## 注意点と批判

- 8分類は網羅的でも排他的でもありません。論文中の分析にも、一覧にない Competition が登場します。
- 美的要素の分類が恣意的である、物語や体験重視の設計を扱いにくい、といった批判もあります（[Wikipedia: MDA framework](https://en.wikipedia.org/wiki/MDA_framework)）。
- 「チェックリストを埋める道具」ではなく、チーム（個人開発なら未来の自分）と会話するための共通語彙として使うのが実用的です。

## AIの活用ポイント

- **既存ゲームの分析**: 「このゲームの主な美的要素を MDA の8分類で挙げ、それを生むダイナミクスとメカニクスを表にして」と頼むと、分析の叩き台になります。ただし、実在ゲームの細かい仕様はハルシネーション（もっともらしい誤り）が混ざりやすいので、自分で遊ぶか公式情報で確認してください。
- **逆算の壁打ち**: 「狙う美的要素は Discovery。それを生むダイナミクスを10案、各案に必要なメカニクスを添えて」のように、層をまたぐ発想の補助に使えます。
- **問題の切り分け**: プレイテストで「つまらない」と言われた箇所を、どの層の問題かLLMに仮説として分類させ、検証の順番を決める材料にできます（[プレイテスト](/design/playtesting/)）。
- **注意**: 美的要素は実際のプレイヤーの感情です。AIの分析は仮説にとどめ、判断は観察結果で行ってください。

## 最新情報

:::note[自動更新]
この欄は情報収集エージェントが毎週更新しています。
:::

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [MDA: A Formal Approach to Game Design and Game Research（PDF）](https://users.cs.northwestern.edu/~hunicke/MDA.pdf) — Hunicke, LeBlanc, Zubek（2004）の原論文
- [AAAI 論文ページ（WS-04-04）](https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/) — 書誌情報とアブストラクト
- [MDA framework（Wikipedia）](https://en.wikipedia.org/wiki/MDA_framework) — 概要と主な批判のまとめ
