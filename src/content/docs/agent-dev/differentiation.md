---
title: ポン出しの先で独自性を出す
description: 一発生成のゲームは誰でも同じように作れます。独自性が生まれる8つの軸ごとに、エージェントに任せる部分、人が決める部分、プロンプト例を整理し、市場の受け止め方と演習も付けます。
sidebar:
  order: 3
lastUpdated: 2026-09-29
---

## 概要

一発で出るゲームは、同じプロンプトを使えば、誰でも同じような水準で出せます。独自性は、その先で人が決めた差分から生まれます。
この記事では、独自性を「ルール」「題材」「制約」「アートと音」「コンテンツ」「手触り」「運営」「組み合わせ」の8つの軸に分け、各軸でエージェントに任せてよい部分、人が決める部分、プロンプト例を示します。
市場の受け止め方のデータと、自分の企画に当てはめる演習とチェックリストも付けています。
プロンプト例は、この記事のために書いた例です。

## ポン出しは、なぜ誰が出しても同じになるのか

事例から、3つの理由が読み取れます。

- 再現される。Claude of Duty のプロンプトは公開されており、James Altucher 氏は同じプロンプトで別のシューティングを作りました（[Decrypt](https://decrypt.co/374560/dumbest-ai-prompt-claude-beat-careful-game-design)、2026年7月28日）。Homeworld 風の宇宙ストラテジー [Starfall](/cases/oneshot-starfall/) の作者は、このプロンプトを改造して使ったと、自分のリポジトリで書いています（[prompt.md](https://github.com/e01-ai/starfall/blob/main/prompt.md)）
- 平均値に寄る。同じ Decrypt の記事は、一人称視点シューティングの実装は公開リポジトリに大量にあり、モデルは既存の型を組み合わせたのではないかという見方を紹介しています。README で作者自身が、目標とした Call of Duty には届いていないと書いています
- 複製が安くなる。Circana のアナリスト Mat Piscatella 氏は、AIによるコード生成で、他社のゲームを数十時間で再現できるようになり、良いゲームは複製されて埋もれると警告しています（[GamesRadar](https://www.gamesradar.com/games/good-games-will-get-cloned-and-buried-ai-vibe-coding-is-one-of-the-biggest-threats-on-storefronts-like-steam-analyst-warns/)、2026年9月時点）

つまり、ポン出しが返すのは「そのジャンルの典型」です。エージェントで安くなったのは実装で、高いまま残るのは、次の判断です。

- 何を作るか
- 誰のためか
- どんな体験にするか
- 何を捨てるか

## 市場は何を見ているか

| 指標 | 数字（2026年9月時点） | 出典 |
|---|---|---|
| Steamの新作のうち、AI生成コンテンツの開示があるもの | 2024年 10.9%、2025年 19.9%、2026年 30.8% | [GamesRadar による Sulka Haro 氏の分析の紹介](https://www.gamesradar.com/games/steam-study-of-over-53-000-games-finds-60-90-percent-of-the-growth-in-monthly-releases-on-valves-store-is-from-games-using-ai-and-almost-none-of-them-make-money/) |
| 開示のある作品の、新作に占める割合と推定売上の割合 | 2026年第1四半期は 28% と 17%、第2四半期は 33% と 10% | 同上 |
| 全体の売上の偏り | 上位1%が推定売上の約94% | 同上 |
| Steamプレイヤー約3,800人への調査 | AI開示のあるゲームの購入に、43%が問題なし、26%が中立、31%が否定的。8.1%はどんな場合も遊ばない | [GamesRadar による GameDiscoverCo 調査の紹介](https://www.gamesradar.com/games/survey-finds-only-31-percent-of-steam-users-have-a-problem-with-ai-in-games-with-43-percent-totally-fine-with-it/) |
| ゲーム業界の従事者 | 52%が、生成AIは業界に悪影響と回答（前年は30%） | [GDC 2026 State of the Game Industry](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/) |

Haro 氏の分析は、2023年7月から2026年7月までにSteamで発売された53,597本の全数調査です。同氏は、AIを使った作品は、使わない作品と同様に、ほとんどが売れないと述べ、AIは万能薬ではなかったと結論しています。
プレイヤー調査の回答者は、一般のSteam利用者より熱心な層です。

Steam のコンテンツアンケートは、開発を効率化するAIツールの利用は開示の中心ではないとし、事前生成とゲーム中の生成のAI生成コンテンツを開示の対象にしています（[Steamworks](https://partner.steamgames.com/doc/gettingstarted/contentsurvey)、2026年9月時点）。エージェントにコードを書かせること自体は、開示に直結しません。

ここから読み取れる方針は、次のとおりです（筆者の解釈です）。

- AIを使ったかどうかより、大量に出る似た作品の1本になることが問題になる。売上の偏りはAI以前から強い
- 発見される理由が要る。ジャンルの典型のままでは、その理由がない
- 見える部分（画像、音、文章）にAI生成物を使うなら、開示と、統一された方向性が要る

## 独自性の8つの軸

| 軸 | 一言で | 任せられる度合い | 人が決めること |
|---|---|---|---|
| 1 ルール・コアループ | 1点だけ尖らせる | 実装は任せる、案出しは一緒に | どの1点を突くか |
| 2 題材・世界観・専門知識 | 自分にしか作れない中身 | 文章と整理は任せる | 事実と、何を面白がるか |
| 3 制約 | あえて縛る | 実装は任せる | 何で縛るか |
| 4 アートと音 | 一貫した方向性 | 生成と実装は任せる | 参照、色、形、音の性格 |
| 5 コンテンツ | 量と並べ方 | 量産と検証を任せる | 順番、難所、教え方 |
| 6 手触り | 触って気持ちいい | 仕組みづくりを任せる | 触って決める数値 |
| 7 運営・コミュニティ | 出した後の関係 | 更新の実装を任せる | 方針と対話 |
| 8 組み合わせ | ニッチ同士を掛ける | 試作を任せる | どの組み合わせを選ぶか |

すべてを狙う必要はありません。主軸を1つ、副軸を1つ選びます。選び方は後の節で説明します。

### 1 ルール・コアループの一点突破

Baba Is You は、ルールそのものを、盤面上の動かせる言葉のタイルにしたパズルです。2017年の Nordic Game Jam で作った短いデモが原型で、2019年に発売され、レベル数は481です（[Wikipedia](https://en.wikipedia.org/wiki/Baba_Is_You)）。1つのアイデアを、最後まで掘り下げた例です。

- 任せてよい: 派生案の最小実装、切り替え可能な形への整理、数値表
- 人が決める: どの1点を突くか。遊んで面白いかの判断
- やり方: コアループを動詞3つで書き（[コアループ](/design/core-loop/)）、動詞を1つ変えるか、ルールを1つ足した派生を3案、並行して試作させます。エージェントには、案の良し悪しを評価させません。面白さは、確かめる手段が人しかないためです

```text
現在のコアループは「避ける → 拾う → 撃つ」です（docs/core-loop.md）。
ここに、ルールを1つだけ足した派生を3案、それぞれ別ブランチで最小実装してください。
- 既存のコードをほとんど変えずに済むルールにする
- 案ごとに、プレイヤーに生まれる新しい判断を2行で書く
- 案ごとに、スクリーンショットと、30秒の操作スクリプトの結果を残す
どの案が良いかの評価は不要です。選ぶのは私です。
```

### 2 題材・世界観・自分だけの体験や専門知識

The Long Silence は、4日間で900の居住世界が沈黙した、という設定から始まります。プレイヤーは調査船で、7つの装置を調べて先に進みます（[README](https://github.com/achimala/TheLongSilence)）。設定と目的があることで、手続き生成の宇宙に、進む理由が生まれています。

- 任せてよい: 用語集、テキストの量産、データへの変換、表記ゆれの点検
- 人が決める: 事実（実務で本当はどうか）、何を面白がるか、現実からの簡略化の範囲
- やり方: エンジニアの自分の仕事、趣味、地元など、自分の経験を題材にします。事実は自分で書き、エージェントには整理と構造化を頼みます

```text
題材は、私が実務で経験している「深夜のオンコール対応」です。以下は事実として扱ってください。
（ここに、自分が知っている事実を箇条書きで書く）
1. この題材で、プレイヤーが迷う判断を10個挙げてください。実務で本当に迷う順にしてください
2. 各判断を、ゲーム内の操作（選ぶ、置く、待つ）に対応づけてください
3. 現実から簡略化した点を一覧にしてください。私が承認したものだけを SPEC.md に入れます
```

### 3 制約の設計

Return of the Obra Dinn は、1ビット（白と黒の2色）の見た目を、独自のエンジンで実現し、Best Art Direction を受賞しました（[Wikipedia](https://en.wikipedia.org/wiki/Return_of_the_Obra_Dinn)）。制約が、作品の顔になった例です。
Claude of Duty も、画像や音声のファイルを使わないという制約が、作品の特徴です。Vibe Jam の「登録なしで遊べる」「すぐ読み込まれる」も、制約です。

- 任せてよい: 制約の中で動く実装、制約違反の検出（ファイル数、色数の検査）
- 人が決める: 何で縛るか。縛りが作品の顔になるか
- やり方: 制約は、指示ファイルに書き、検査スクリプトで守らせます。エージェントは、制約が書かれていなければ、無難な標準的な作り方に戻ります

```text
CLAUDE.md に、次の制約を追記してください。
- 画面の色は最大4色。src/palette.js の定義以外の色は使わない
- 入力は1ボタン（スペースキー、またはタップ）だけ
- 1プレイは90秒以内
これらを守っているか検査する npm run check:rules を作り、変更のたびに実行してください。
```

### 4 アートと音の方向性

ポン出しの見た目は、その分野の典型に寄ります。Claude of Duty の README は、手が板状のブロックに見えること、敵がマネキンに見えることを課題に挙げています。The Long Silence は、地面や船体に、画像生成モデルと Blender で作った素材を加えています。

- 任せてよい: 手続き生成のコード、パレットの適用、シェーダー、素材の書き出し
- 人が決める: 参照する作品、色、形の言語、音の性格
- やり方: スタイルガイドを1枚作り、正とします。参照画像は自分で選び、エージェントには規則の言語化を頼み、人が直します。生成した素材を出荷する場合の権利は [生成AI素材の著作権](/legal/copyright/) と [アセット生成](/dev-env/asset-generation/) を、コードで作る方法は [手続き生成でアセットを作る](/agent-dev/procedural-assets/) を参照してください

```text
docs/style.md を作ってください。参照画像は refs/ にあります。
1. 色（6色以内、16進表記）、形の規則（角か丸か、太さ）、光の規則を、参照画像から言語化する
2. 効果音とBGMの性格（音色、テンポ、使わない音）を書く
3. 「このゲームらしくない」例を5つ挙げる
私が修正したものを正とし、以後の実装はこれに従ってください。
```

### 5 コンテンツ（レベル、データ、シナリオ）

Baba Is You は、2021年の更新でレベルエディタと250の新レベルを加えました（[Wikipedia](https://en.wikipedia.org/wiki/Baba_Is_You)）。パズルでは、レベルの量と並び順が、そのまま商品です。

- 任せてよい: レベルの生成、解けるかの検証、最短手数の計算、データの整形
- 人が決める: 並べる順番、教える順番、難所の位置、全体の緩急
- やり方: エージェントに、量産と検証の道具を作らせます。採用は、人が実際に遊んで決めます（[レベルデザイン](/design/level-design/)、[プレイテスト](/design/playtesting/)）

```text
levels/ の JSON を読み込み、次を検証する npm run check:levels を作ってください。
- すべてのレベルに解が存在する（ソルバで確認）
- 最短手数と、レベル番号の順に難しくなるかの表を出力する
- 同じ解き方の繰り返しが3レベル以上続く箇所を警告する
新しいレベルは20個、levels/draft/ に作ってください。採用するかは私が決めます。
```

### 6 手触りの調整

Claude of Duty では、武器の見え方、反動、画面の動きが最後まで課題でした。手触りは、触って調整するしかない領域です（[ゲームフィール](/agent-dev/game-feel/)）。

- 任せてよい: 数値の外出し、実行中に値を変えるデバッグUI、変更の記録
- 人が決める: 触って気持ちいい値
- やり方: 「もっと軽く」ではなく数値で伝えます。バランスは [バランス調整](/design/balancing/) を参照してください

```text
ジャンプ関連の定数（重力、初速、空中の加速、崖から落ちた直後でもジャンプできる猶予時間、着地前のボタン入力の受け付け時間）を src/feel.js に集め、
実行中に F1 キーで開くスライダーで変えられるようにしてください。
変更した値は、localStorage に保存し、「現在の値を feel.js の形式で出力」ボタンも付けてください。
```

### 7 運営・コミュニティ・更新

出した後の関係も、独自性です。Baba Is You は、発売から約2年8か月後に、レベルエディタを加える更新を出しました。Haro 氏の分析で、売上は上位1%に集中しています。出した後に見つけてもらう活動が必要です（[ウィッシュリスト](/monetization/wishlists/)）。

- 任せてよい: 不具合の再現、修正、リリースノートの下書き、更新の実装
- 人が決める: 何を直し、何を直さないか、コミュニティとの対話の仕方
- やり方: 報告を1件ずつイシューにして、エージェントに再現手順を作らせます

```text
issues/ の報告を1件読み、再現するテストを書いてください。
再現できたら修正案を作り、修正前後の動作の違いを2行で説明してください。
再現できない場合は、追加で聞くべきことを3つ挙げてください。
```

### 8 ニッチの組み合わせ

Balatro は、ポーカーの役とローグライクのデッキ構築を組み合わせたゲームです。個人開発者 LocalThunk 氏が、Löve というフレームワークで作りました。着想は、広東地方のカードゲーム「大老二（Big Two）」と、スロットマシンを題材にしたローグライク Luck Be a Landlord です。2024年2月に発売され、2025年1月までに500万本以上が売れ、Game Developers Choice Awards の Game of the Year を受賞しました（[Wikipedia](https://en.wikipedia.org/wiki/Balatro)）。

- 任せてよい: 組み合わせ案の列挙、最小の試作、既存作品の調査
- 人が決める: どの組み合わせを選ぶか。本当に遊んで面白いか
- やり方: 「ジャンルA × ジャンルB × 題材」の表を作り、有望な組み合わせを試作します

```text
ジャンル10種と、私の題材（オンコール対応、家庭菜園、鉄道のダイヤ）を掛け合わせた組み合わせを、
30個、表にしてください。列は「一言の説明」「コアループ（動詞3つ）」「近い既存作品」「作りやすさ（1〜5）」です。
私が選んだ3つを、それぞれ1時間で遊べる試作にしてください。
```

## 自分の軸の選び方

1. 自分の資産を書き出します。専門知識、美意識、続けられる活動（発信、コミュニティ）です
2. 資産に近い軸を、主軸にします。エージェントで安くならない部分ほど、他人が真似しにくくなります
3. 副軸を、コストの低い軸から1つ選びます。制約（軸3）は、少ない作業で効果が出やすい軸です
4. 選ばなかった軸は、ポン出しのままで構いません。全部を磨くと、スコープが膨らみます（[スコープの決め方](/getting-started/scope/)）

## Claude of Duty を、独自性の視点で読む

Claude of Duty で独自だったのは、ゲームの中身より、作り方です。すべてを手続きで生成する制約、批評家のサブエージェントで採点する仕組み、検証用のスクリプトの公開です。README も、この道具立てのほうが面白いかもしれないと書いています。
ゲームとしては、Call of Duty という既存作品を目標にした、ジャンルの典型です。ここから独自の作品にするなら、上の8つの軸のうち、少なくとも「ルール」「題材」「制約」のどれかを人が決めることになります。

## 演習: ポン出しの後に変えるべき3つ

1. ポン出しの結果を、30分遊びます。「どのゲームでも見たことがある」と感じた場面を、メモします。そこが平均値の部分です
2. 変えるものを3つ選びます。次の組み合わせが、少ない作業で効果を出しやすい選び方です
   - ルールを1つ（軸1）
   - 題材か制約を1つ（軸2か軸3）
   - 見た目か音を1つ（軸4）
3. 3つそれぞれを、下の表の形で書きます
4. 1つずつ実装し、そのたびに、自分でも遊び、他人にも遊んでもらいます。変化が、体験に出ているかを見ます

| 変えること | 仕様（1行） | 完了の条件 | 確かめ方 |
|---|---|---|---|
| ルール | 例: 自動攻撃をやめ、敵の弱点に合わせて武器を手動で並べる | 最初の2分で、並べ方の違いで勝敗が変わる | 人が遊ぶ |
| 題材 | 例: 敵をアラートにして、深夜の障害対応を題材にする | 敵の名前と挙動が、実務の用語で説明できる | 自分で読み、同僚に見せる |
| 見た目 | 例: 4色に固定し、1ビット風にする | 画面の色が palette.js の4色以内 | 検査スクリプト |

（表の例は、サバイバー系のポン出し結果に当てはめた作例です。）

### 独自性のチェックリスト

- [ ] このゲームを一言で説明したとき、他の作品の名前を使わずに済む
- [ ] ポン出しに無かったルールが、少なくとも1つある
- [ ] 題材に、自分の経験や知識が入っている
- [ ] 制約を1つ決め、指示ファイルと検査で守らせている
- [ ] 見た目と音が、スタイルガイドに沿っている
- [ ] 手触りの数値を、自分が触って決めた
- [ ] 他人に30分遊んでもらい、その感想を記録した
- [ ] 「他にもある」と言われたときの答えを、1文で持っている
- [ ] AI生成物を使った部分と、その開示の要否を整理した
- [ ] やらないことを、企画書に書いた（[企画書テンプレート](/design/game-design-doc/)）

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Claude of Duty（GitHub）](https://github.com/mshumer/Claude-of-Duty) — 制約と作り方の特徴、作者自身の評価
- [Decrypt: The Dumbest-Looking AI Prompt Just Beat Months of Careful Game-Design Prompt Engineering](https://decrypt.co/374560/dumbest-ai-prompt-claude-beat-careful-game-design) — 追試と、既存実装の再構成という見方
- [explainx: Top 10 Claude Opus 5 Game Prompts](https://www.explainx.ai/blog/claude-opus-5-top-10-game-prompts-july-2026) — Opus 5 の事例のまとめ（二次情報）
- [GamesRadar: Steam study of over 53,000 games](https://www.gamesradar.com/games/steam-study-of-over-53-000-games-finds-60-90-percent-of-the-growth-in-monthly-releases-on-valves-store-is-from-games-using-ai-and-almost-none-of-them-make-money/) — Sulka Haro 氏の全数調査の紹介
- [GamesRadar: Survey finds only 31% of Steam users have a problem with AI in games](https://www.gamesradar.com/games/survey-finds-only-31-percent-of-steam-users-have-a-problem-with-ai-in-games-with-43-percent-totally-fine-with-it/) — GameDiscoverCo のプレイヤー調査の紹介
- [GamesRadar: "Good games will get cloned and buried"](https://www.gamesradar.com/games/good-games-will-get-cloned-and-buried-ai-vibe-coding-is-one-of-the-biggest-threats-on-storefronts-like-steam-analyst-warns/) — Circana の Mat Piscatella 氏の警告
- [GDC 2026 State of the Game Industry](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/) — 業界の生成AIへの見方
- [Steamworks: コンテンツアンケート](https://partner.steamgames.com/doc/gettingstarted/contentsurvey) — AI生成コンテンツの開示範囲
- [The Long Silence（GitHub）](https://github.com/achimala/TheLongSilence) — 設定と目的を持つ手続き生成ゲームの README
- [Baba Is You（Wikipedia）](https://en.wikipedia.org/wiki/Baba_Is_You) — ルールを盤面に置くパズルの成り立ち
- [Return of the Obra Dinn（Wikipedia）](https://en.wikipedia.org/wiki/Return_of_the_Obra_Dinn) — 1ビットの見た目と制約
- [Balatro（Wikipedia）](https://en.wikipedia.org/wiki/Balatro) — ジャンルの組み合わせで作られた個人開発作
