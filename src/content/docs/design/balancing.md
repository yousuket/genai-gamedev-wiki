---
title: バランス調整
description: ゲームの数値設計の考え方、スプレッドシートでの管理、シミュレーションによる検証、AIにシミュレーションコードを書かせる方法
sidebar:
  order: 4
lastUpdated: 2026-09-29
---

## 概要

- **バランス調整**とは、HP・攻撃力・価格・出現率などの数値を決め、ゲームが公平で、ほどよく難しく、特定の選択肢だけが強すぎない状態にする作業です。
- Ian Schreiber は、バランス調整の多くは「ゲームでどの数値を使うかを決めること」だと述べています（[Game Balance Concepts, Level 1](https://gamebalanceconcepts.wordpress.com/2010/07/07/level-1-intro-to-game-balance/)）。
- この記事では、数値設計の基本、スプレッドシートでの管理、シミュレーションでの検証、そしてAIにシミュレーションコードを書かせる手順を説明します。
- エンジニアにとっては、最も得意分野を活かしやすい工程です。

## 数値設計の基本

### まず「狙い」を決める

数値は、狙う体験から逆算して決めます（[MDAフレームワーク](/design/mda/)）。例えば次のような目標を先に文章にします。

- 最初のボスは、初見で3回に1回くらい勝てる
- 1プレイ（1ラン）は20〜30分で終わる
- どの武器を選んでも、クリア率の差は1割以内に収める

目標が数字で書ければ、あとでシミュレーションやプレイデータで達成度を測れます。

### コストと効果を揃える

Schreiber は、カードやアイテムのように「コストを払って効果を得る」要素では、コストと効果の関係（**コストカーブ**）を決めてから個々の数値を当てはめる方法を解説しています（[Level 3: Transitive Mechanics and Cost Curves](https://gamebalanceconcepts.wordpress.com/2010/07/21/level-3-transitive-mechanics-and-cost-curves/)）。

- 高コストほど効果の伸びが小さい曲線にすると、序盤の選択が重要になる
- 高コストほど効果が大きく伸びる曲線にすると、終盤が重要になる
- 特定の段階で曲線を急に変えると、序盤・中盤・終盤の区切りを作れる

### よく使う数値の形

| 用途 | よく使う式の形 | 特徴 |
|---|---|---|
| レベルアップに必要な経験値 | `base * level ^ k`（k は1.5〜2程度から試す） | 後半ほど伸びる。k で伸び方を調整 |
| 敵の強さ | `base * (1 + rate) ^ stage` | 指数的に強くなる。プレイヤーの成長と比べる |
| 価格 | 効果量 × 係数 ＋ 固定費 | コストカーブと同じ考え方 |

ここでの係数は出発点の例です。正解の値はゲームごとに違うので、次の節の方法で検証します。

## スプレッドシートで管理する

数値はコードに直接書かず、スプレッドシート（Google スプレッドシート、Excel、LibreOffice Calc など）に集めてから、CSV や JSON に書き出してゲームで読み込む形にすると、調整が楽になります。

**おすすめのシート構成（例）**

| シート | 内容 |
|---|---|
| params | 全体に効く定数（基礎HP、成長率など） |
| units / cards | 1行1個の要素。コストと効果の列、コストカーブから計算した「理論値」の列 |
| curves | レベル・ステージごとの必要経験値や敵の強さ。グラフも置く |
| log | いつ、何を、なぜ変えたかの記録 |

- **理論値との差分列**を作ると、「コストの割に強すぎる要素」が一目で分かります。
- 数値をファイルとしてGitで管理すれば、変更履歴とプレイテストの結果を対応づけられます。
- 体系的に学ぶなら、Schreiber と Brenda Romero の書籍『Game Balance』（CRC Press, 2021）が、スプレッドシートの技法を含めて詳しく扱っています（[Routledge](https://www.routledge.com/Game-Balance/Schreiber-Romero/p/book/9781498799577)）。

## シミュレーションで検証する

乱数や組み合わせが多いゲームは、頭の中や表計算だけでは結果を予測しにくくなります。そこで、ゲームのルールを簡略化したコードを何千回も実行して、結果の分布を見ます（**モンテカルロ・シミュレーション**）。

MDA論文も、2個のサイコロの確率分布を使ってモノポリーの盤を一周する時間を見積もる例を挙げ、盤の大きさを変えたときの影響を事前に評価できるとしています（[MDA論文](https://users.cs.northwestern.edu/~hunicke/MDA.pdf)）。

### 例: 武器ごとのボス戦勝率

```python
import random
import statistics

WEAPONS = {
    # 名前: (1回の攻撃力, 会心率, 会心倍率)
    "sword": (12, 0.10, 2.0),
    "dagger": (8, 0.35, 2.5),
    "axe": (18, 0.05, 1.5),
}
PLAYER_HP = 100
BOSS_HP = 130
BOSS_DAMAGE = (6, 14)  # ボスの1ターンのダメージ幅

def fight(weapon, rng):
    atk, crit_rate, crit_mul = WEAPONS[weapon]
    hp, boss = PLAYER_HP, BOSS_HP
    turns = 0
    while hp > 0:
        turns += 1
        dmg = atk * (crit_mul if rng.random() < crit_rate else 1)
        boss -= dmg
        if boss <= 0:
            return True, turns
        hp -= rng.randint(*BOSS_DAMAGE)
    return False, turns

def simulate(weapon, n=10_000, seed=0):
    rng = random.Random(seed)
    results = [fight(weapon, rng) for _ in range(n)]
    win_rate = sum(win for win, _ in results) / n
    avg_turns = statistics.mean(t for _, t in results)
    return win_rate, avg_turns

for w in WEAPONS:
    rate, turns = simulate(w)
    print(f"{w:7s} 勝率 {rate:6.1%}  平均ターン {turns:5.1f}")
```

実行結果（Python 3 で実行）:

```text
sword   勝率  76.4%  平均ターン   9.8
dagger  勝率  42.4%  平均ターン  10.1
axe     勝率 100.0%  平均ターン   7.7
```

この結果からは、斧（axe）が強すぎ、短剣（dagger）が弱すぎることが読み取れます。「どの武器でもクリア率の差は1割以内」という狙いから大きく外れているので、斧の攻撃力を下げる、短剣の会心率を上げる、などの案を試して再実行します。

- 乱数のシードを固定すると、数値を変えたときの差だけを比べられます。
- 「勝率」「所要時間」など、最初に決めた**狙いの数字**を出力するのが要点です。
- 本物のゲームのコードを使わず、ルールだけを抜き出した小さなモデルにすると、何万回でも素早く回せます。

### ノーコードの選択肢

ゲーム内の資源の流れ（通貨の入手と消費など）を図で描いてシミュレーションするツールとして、ブラウザで使える [Machinations](https://machinations.io/) があります。無料プランから始められると案内されています（2026年9月時点）。コードを書くか、図で組むかは好みで選んでください。

### プレイデータとの照合

シミュレーションは仮説です。最終的には実際のプレイ結果で確かめます。Slay the Spire の開発元 Mega Crit は、カードが提示されたときの選択率や、そのカードを含むデッキの勝率などをサーバーで集め、調整に使ったと GDC 2019 で紹介しています（[GDC Vault](https://www.gdcvault.com/play/1025731/-Slay-the-Spire-Metrics)、[Game Developer の記事](https://www.gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder)）。個人開発でも、テスト版に簡単なログ出力を入れておくと役立ちます（[プレイテスト](/design/playtesting/)）。

## AIの活用ポイント

- **シミュレーションコードの生成**: ルールを箇条書きにしてLLMに渡し、「このルールのモンテカルロ・シミュレーションを Python で。シード固定、各武器の勝率と平均ターン数を出力」のように頼むと、上の例のようなコードを短時間で作れます。
- **ルールの書き起こしを先に**: AIに渡すルールの説明が曖昧だと、AIは勝手に仮定を置きます。「不明な仕様があれば推測せず質問して」と指示し、出てきたコードのルールがゲームと一致しているか、必ず自分で読んで確認してください。
- **スプレッドシートの数式**: 「コストカーブから理論値を計算し、実際の値との差を色分けする数式」なども頼みやすい作業です。
- **結果の読み取り**: シミュレーション結果の表を渡して、狙いから外れている項目と、変更候補を挙げさせる使い方もできます。ただし、どの体験を優先するかの判断は自分で行ってください。
- **注意**: LLMは計算を間違えることがあります。数値の結論はLLMの暗算ではなく、実行したコードの出力で判断してください。

## 最新情報

:::note[自動更新]
この欄は情報収集エージェントが毎週更新しています。
:::

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Game Balance Concepts（Ian Schreiber）](https://gamebalanceconcepts.wordpress.com/) — バランス調整を10回で学べる無料のオンライン講座
- [Level 3: Transitive Mechanics and Cost Curves](https://gamebalanceconcepts.wordpress.com/2010/07/21/level-3-transitive-mechanics-and-cost-curves/) — コストカーブの考え方
- [Game Balance（Schreiber & Romero, CRC Press, 2021）](https://www.routledge.com/Game-Balance/Schreiber-Romero/p/book/9781498799577) — スプレッドシート技法を含む体系的な書籍
- [Slay the Spire: Metrics Driven Design and Balance（GDC Vault, 2019）](https://www.gdcvault.com/play/1025731/-Slay-the-Spire-Metrics) — プレイデータを使ったバランス調整の講演
- [How Slay the Spire's devs use data to balance their roguelike deck-builder（Game Developer）](https://www.gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder) — 上記の取り組みの記事
- [Machinations](https://machinations.io/) — ゲーム内経済を図でシミュレーションするブラウザツール
- [MDA: A Formal Approach to Game Design and Game Research（PDF）](https://users.cs.northwestern.edu/~hunicke/MDA.pdf) — サイコロの確率モデルによる検討例を含む
