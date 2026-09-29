---
title: レベルデザイン
description: 難易度曲線の考え方、説明に頼らないチュートリアルの作り方、手続き生成と手作りレベルの組み合わせ方
sidebar:
  order: 3
lastUpdated: 2026-09-29
---

## 概要

- **レベルデザイン**は、ステージやマップ、敵の配置、出題の順番などを設計して、プレイヤーの体験の流れを作る仕事です。
- この記事では、次の3つを扱います。
  - 難易度曲線: 難しさをどう上げていくか
  - チュートリアル設計: 遊びながら覚えてもらう方法
  - 手続き生成との組み合わせ: 自動生成と手作りをどう混ぜるか
- 個人開発で生成AIを使う場合、特に「手続き生成（プログラムでレベルを自動生成すること）」との付き合い方が重要になります。

## 難易度曲線

### フローゾーン

thatgamecompany の Jenova Chen は、心理学者チクセントミハイの「フロー」理論をゲームに当てはめて説明しています（[Flow in Games (and Everything Else)](https://cacm.acm.org/opinion/flow-in-games-and-everything-else/), Communications of the ACM, 2007）。

- 挑戦がプレイヤーの能力を上回ると**不安**になる
- 挑戦が能力を下回ると**退屈**になる
- その間の帯が**フローゾーン**で、没頭した状態が続く

同じ論考では、初心者と上級者でフローゾーンの位置が違うこと、そして多くのゲームが1本の固定的な難易度しか用意していないことを指摘しています。対策として、選択肢を増やすだけでは選ぶ手間が没頭を妨げるため、**選択を中心の遊びそのものに組み込む**ことを勧めています。

### 上げ下げしながら上げる

難易度は単調に上げ続けるより、山と谷を作るほうが疲れにくくなります。The Level Design Book は、強い緊張が長く続くとプレイヤーが慣れてしまうこと、そのため緊張と休息を交互に置くことを説明しています（[Pacing](https://book.leveldesignbook.com/process/preproduction/pacing)）。

実務では、次のような形がよく使われます。

1. 新しい要素を出すときは、いったん難易度を下げる
2. その要素の組み合わせで徐々に難しくする
3. 山場のあとに、成長を実感できる簡単な区間を置く
4. 次の新要素で1に戻る（全体としては少しずつ上がっていく）

同書は、各区間の「強度（intensity）」を0〜100%でグラフにして、ペース配分を目で確認する方法も紹介しています。

## チュートリアル設計

### 説明より体験で教える

任天堂の宮本茂氏と手塚卓志氏は、2015年の Eurogamer のインタビューで、スーパーマリオブラザーズの1-1を「学校」のように設計したと語っています（[Miyamoto on World 1-1（Eurogamer の動画, YouTube）](https://www.youtube.com/watch?v=zRGRJRUWafY)、[World 1-1（Wikipedia）](https://en.wikipedia.org/wiki/World_1-1)）。最初の数歩で、敵の避け方・倒し方、ハテナブロックの仕組み、敵と味方キノコの見分け方を、文字の説明なしに学べるよう配置されています。

### 導入・展開・ひねり・結び

スーパーマリオ3Dランドのディレクター林田宏一氏は、Game Developer のインタビューで、ステージ構成を**起承転結**になぞらえています（[The Structure of Fun](https://www.gamedeveloper.com/design/the-structure-of-fun-learning-from-i-super-mario-3d-land-i-s-director), 2012）。

| 段階 | ステージでやること |
|---|---|
| 起 | 新しい仕掛けの使い方を安全な場所で覚える |
| 承 | 少し複雑な状況でその仕掛けを使う |
| 転 | 予想していなかった使い方を求める |
| 結 | 身に付けた腕前を披露する |

The Level Design Book では、同じ考え方を **teach / test / twist**（教える・確かめる・ひねる）の3拍子として紹介しています（[Pacing](https://book.leveldesignbook.com/process/preproduction/pacing)）。

### チュートリアルのチェックリスト

- 1度に教える要素は1つにする
- 失敗しても損が小さい場所で最初に試させる
- テキストは最後の手段にする。まず配置と見た目で気づかせる
- 教えた要素は、直後に一度「使わないと進めない」場面を置いて確かめる
- 実際に説明なしで遊んでもらい、詰まった場所を直す（[プレイテスト](/design/playtesting/)）

## 手続き生成との組み合わせ

**手続き生成**（PCG: Procedural Content Generation）は、ルールや乱数でレベルを自動的に作る手法です。遊ぶたびに変化が出る反面、完全にランダムだと「クリア不能」「単調」「難易度がばらつく」といった問題が起きやすくなります。代表的な成功例は、手作りの部品と生成を組み合わせています。

### Spelunky: 解ける道を先に作る

Darius Kazemi による解説では、Spelunky のレベル生成は次の順で進みます（[Spelunky Generator Lessons](http://tinysubversions.com/spelunkyGen/)）。

1. レベルを4×4（16個）の部屋に分ける
2. 入口から出口までの**解ける経路**を先に決める
3. 経路上の部屋には、必要な出口（左右・上・下）を持つ種類の部屋を当てはめる
4. 各部屋を用意されたテンプレートで埋め、そのあとトゲ・矢の罠・敵・宝を置く

「クリアできることを保証してから、ばらつきを足す」という順番が要点です。

### Dead Cells: 手作りの骨組みの中で生成する

Dead Cells のリードデザイナー Sébastien Bénard は、生成アルゴリズムの関与を最小限にとどめる「ハイブリッド」方式を説明しています（[Building the Level Design of a procedurally generated Metroidvania](https://www.gamedeveloper.com/design/building-the-level-design-of-a-procedurally-generated-metroidvania-a-hybrid-approach-), 2017）。

1. 世界全体の構成とステージのつながりは手作りで固定する
2. 部屋（タイル）は手作りし、役割（戦闘、宝、商人など）を付ける
3. ステージごとに「どんな部屋をどの順に並べるか」のグラフを作る
4. アルゴリズムがグラフに合う部屋を選んで配置する
5. 敵とアイテムを、戦闘区間の長さなどの制約に沿って配置する

### 個人開発での選び方

| 方式 | 向いているゲーム | 手間 |
|---|---|---|
| 全部手作り | パズル、物語重視のゲーム | レベル数に比例して増える |
| 部品を手作り＋配置を生成 | ローグライク、アクション | 部品と生成ルールの両方が必要 |
| ほぼ全自動生成 | サンドボックス、探索 | 生成ルールの調整に時間がかかる |

手法の体系的な解説は、無料で読める教科書 [Procedural Content Generation in Games](https://www.pcgbook.com/)（Shaker, Togelius, Nelson, Springer, 2016）が参考になります。

## AIの活用ポイント

- **生成コードの作成**: 「4×4の部屋グリッドで入口から出口までの経路を先に決め、テンプレートを当てはめる」のように、上記の手順を具体的に指示すると、AIコーディングツールで生成器の叩き台を作りやすくなります（[AI駆動の開発ワークフロー](/dev-env/ai-workflow/)）。
- **クリア可能性の自動チェック**: 生成したレベルを経路探索で検証するテストコードもAIに書かせやすい分野です。大量に生成して「解けないレベルが出ないか」を確認できます。
- **部品の量産**: 部屋テンプレートや敵の配置パターンの案をLLMに出させ、人が選んで直す使い方ができます。ただし、出力は似通いやすいので、人の手で変化を加えることが前提です（[AIを企画の壁打ちに使う](/design/ai-brainstorming/)）。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Flow in Games (and Everything Else)（Jenova Chen, CACM, 2007）](https://cacm.acm.org/opinion/flow-in-games-and-everything-else/) — フローゾーンと難易度の関係
- [Pacing（The Level Design Book）](https://book.leveldesignbook.com/process/preproduction/pacing) — teach/test/twist、強度グラフ、緊張と休息
- [The Structure of Fun: Learning from Super Mario 3D Land's Director（Game Developer, 2012）](https://www.gamedeveloper.com/design/the-structure-of-fun-learning-from-i-super-mario-3d-land-i-s-director) — 起承転結によるステージ構成
- [Miyamoto on World 1-1: How Nintendo made Mario's most iconic level（Eurogamer, 2015）](https://www.youtube.com/watch?v=zRGRJRUWafY) — 宮本氏が1-1の設計意図を解説する動画
- [World 1-1（Wikipedia）](https://en.wikipedia.org/wiki/World_1-1) — 1-1の設計についての解説と出典一覧
- [Spelunky Generator Lessons（Darius Kazemi）](http://tinysubversions.com/spelunkyGen/) — Spelunky のレベル生成を動かしながら学べる解説
- [Building the Level Design of a procedurally generated Metroidvania（Game Developer, 2017）](https://www.gamedeveloper.com/design/building-the-level-design-of-a-procedurally-generated-metroidvania-a-hybrid-approach-) — Dead Cells のハイブリッド生成
- [Procedural Content Generation in Games](https://www.pcgbook.com/) — 手続き生成の教科書（無料公開）
