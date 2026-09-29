---
title: プレイテスト
description: テストプレイヤーの集め方、観察のしかた、アンケートの使いどころ、Steam Playtest などの配布手段、AIによるフィードバック集計
sidebar:
  order: 5
lastUpdated: 2026-09-29
---

## 概要

- **プレイテスト**とは、開発中のゲームを他人に遊んでもらい、狙った体験になっているかを確かめることです。バグを探す QA（品質保証）とは目的が違います。
- Valve の Mike Ambinder は、ゲームデザインを「仮説」、プレイテストを「実験」と捉え、早く・頻繁にデータを取って改善を繰り返す考え方を紹介しています（[GDC 2009 講演スライド](https://cdn.akamai.steamstatic.com/apps/valve/2009/GDC2009_ValvesApproachToPlaytesting.pdf)）。
- この記事では、テスターの募集、観察のしかた、アンケートの使いどころ、Steam Playtest などの配布手段、AIでのフィードバック集計を扱います。

## いつ・誰に遊んでもらうか

### 早い段階から始める

独立系開発者 Adriaan de Jongh は GDC 2017 の講演で、完成間際だけでなく v0.1 から v1.0 まで継続的にテストするよう勧めています（[Playtesting: Avoiding Evil Data（スライド）](https://media.gdcvault.com/gdc2017/Presentations/deJongh_PlaytestingAvoidingEvilData.pdf)）。仮素材のプロトタイプでも、[コアループ](/design/core-loop/) が面白いかどうかは確かめられます。

### いろいろな人に頼む

同講演は、テストする人によってはつまずく箇所を完全に見逃すことがあるとして、幅広い層に頼むことを勧めています。

| 募集先 | 良い点 | 注意点 |
|---|---|---|
| 友人・家族 | 頼みやすく、対面で観察できる | 遠慮して褒めがち |
| 他のゲーム開発者 | 具体的な指摘がもらえる | 一般のプレイヤーと視点が違う |
| ゲーム制作の勉強会・展示イベント | 初見の反応を一度に多く見られる | 準備に手間がかかる |
| SNS・Discord のコミュニティ | 人数を集めやすい | 対面観察ができない |
| Steam / itch.io の公開テスト | 実際の購入層に近い | 事前に公開ページの準備が要る |

## 観察のしかた

**「言ったこと」より「やったこと」** を重視します。Ambinder のスライドでも、直接観察は人が何を言うかではなく何をするかが分かる点を利点に挙げています（観察者がいることで結果が偏る点は欠点として挙げています）。

### 始める前

- ゲームの説明をしない。操作方法、ストーリー、未実装の部分も説明しない
- 「まだ完成していない」ことだけ伝える

これは de Jongh の講演の主な主張の1つです。説明してしまうと、実際のプレイヤーが最初に出会う問題を見逃します。

### 遊んでいる間

The Level Design Book は、少し後ろから見て、行動と反応をメモし、質問は控えめにし、プレイヤーが完全に詰まったとき以外は割り込まないよう勧めています（[Playtesting](https://book.leveldesignbook.com/process/blockout/playtesting)）。

**メモする項目の例**

- 時刻と場面
- 迷った・止まった場所（何秒止まったか）
- 意図と違う行動（例: 扉だと思わせたい場所を無視した）
- 表情や声（笑った、ため息をついた）
- 途中でやめた場所

**考えを声に出してもらう方法**（シンク・アラウド）もあります。Ambinder は「なぜ」を知るのに有効な一方、プレイの妨げになり不自然な体験になりうると整理しています。

### 終わったあと

- 理解の確認: 「オレンジの光は何を意味していると思いましたか？」
- 主観の確認: 「戦闘は簡単でしたか、難しかったですか？」
- 印象に残ったこと

（質問例は [The Level Design Book](https://book.leveldesignbook.com/process/blockout/playtesting) より）

「どう直せばいいと思いますか？」への答えは、そのまま採用しないのが基本です。問題の存在を示すヒントとして受け取り、直し方は自分で考えます。

## アンケートの使いどころ

アンケートには賛否があります。

- **慎重派**: de Jongh は、アンケートやオンラインでの文章フィードバックは避け、直接観察やプレイ録画を優先するよう述べています。
- **併用派**: Valve の Ambinder は、選択式の質問は偏りの少ない回答を得やすく、時系列の比較もしやすい一方、ニュアンスが失われ、評価を具体的な判断に変えにくいと整理しています。同社では観察・個別Q&A・グループQ&Aと組み合わせています。

個人開発では、**観察を主、アンケートを補助**にするのが無難です。アンケートを使うなら次の点に気をつけます。

- 5〜10問程度に絞る
- 「難しさ」「わかりやすさ」など、毎回同じ質問を入れて版ごとに比較する
- 誘導しない（×「新しいボスは楽しかったですか？」→ ○「新しいボスの印象を教えてください」）
- 自由記述を1〜2問入れる
- 年齢や普段遊ぶジャンルなど、回答者の属性を最小限だけ聞く（個人情報は必要以上に集めない）

## 配布の手段

### Steam Playtest

Steam には、本編とは別のアプリとしてテスト版を配る **Steam Playtest** 機能があります（[Steamworks ドキュメント](https://partner.steamgames.com/doc/features/playtest)、2026年9月時点）。

- 本編のストアページに参加登録の欄が表示される
- 参加方式は、開発者が人数を見ながら順に許可する方式（既定）と、申し込めば自動で参加できる方式を選べる
- 開発者・プレイヤーともに無料
- テストへの参加・離脱はウィッシュリストに影響せず、参加者は本編のレビューを書けない

ストアページとウィッシュリストについては [ウィッシュリストの集め方](/monetization/wishlists/) を参照してください。

### itch.io

itch.io では、プロジェクトページを「下書き（Draft）」にして秘密のリンクを知る人だけに見せたり、「制限公開（Restricted）」にしてダウンロードキーやパスワードを持つ人だけに絞ったりできます（[Limited Playtests & Releases](https://itch.io/docs/creators/limited-releases)、[Access control](https://itch.io/docs/creators/access-control)）。

### その他

- ビルドを直接渡す（知人向け）
- ブラウザ版を限定URLで公開する

どの手段でも、**プレイ録画（画面と音声）をもらえる形**にしておくと、対面で観察できない弱点を補えます。

## 手間を減らす工夫

de Jongh は、テスターの一覧表、依頼メールのテンプレート、リマインダーを用意して、テストを始める手間を小さくすることを勧めています。講演では、オンラインテストの依頼に7日以内に反応するのは約30%で、リマインダー後にさらに約30%が反応したという自身の経験も紹介しています。

## AIの活用ポイント

- **フィードバックの集計**: アンケートの自由記述や観察メモをLLMに渡し、「問題点を場面ごとに分類し、言及した人数を数えて」と頼むと、傾向をつかむのが速くなります。
- **引用を必ず付けさせる**: 集計では、各分類に元の発言をそのまま引用させます。Anthropic のドキュメントも、根拠となる引用を示させ、見つからない主張は取り下げさせる方法を紹介しています（[Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)）。これで、AIが存在しない意見を作ることを防ぎやすくなります。
- **少数意見を消さない**: 要約は多数派の意見に寄りがちです。「1人だけが言及した問題も別に列挙して」と指示してください。
- **ログの分析**: 死亡位置や所要時間のログから、詰まりやすい場所を集計するスクリプトをAIに書かせることもできます（[バランス調整](/design/balancing/)）。
- **個人情報に注意**: テスターの名前や連絡先は、AIサービスに渡す前に取り除いてください。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Playtesting: Avoiding Evil Data（GDC Vault, 2017）](https://www.gdcvault.com/play/1024132/playtesting-avoiding-evil) — 誤解を招くデータを避けるプレイテストの講演（[スライドPDF](https://media.gdcvault.com/gdc2017/Presentations/deJongh_PlaytestingAvoidingEvilData.pdf)）
- [Valve's Approach to Playtesting: The Application of Empiricism（GDC Vault, 2009）](https://www.gdcvault.com/play/1566/Valve-s-Approach-to-Playtesting) — 観察・Q&A・アンケート・データ収集の長所と短所（[スライドPDF](https://cdn.akamai.steamstatic.com/apps/valve/2009/GDC2009_ValvesApproachToPlaytesting.pdf)）
- [Playtesting（The Level Design Book）](https://book.leveldesignbook.com/process/blockout/playtesting) — 観察のしかたと事後の質問
- [Steam Playtest（Steamworks ドキュメント）](https://partner.steamgames.com/doc/features/playtest) — Steam のテスト版配布機能の公式説明
- [Limited Playtests & Releases（itch.io）](https://itch.io/docs/creators/limited-releases) — itch.io での限定配布
- [Access control（itch.io）](https://itch.io/docs/creators/access-control) — itch.io のアクセス制限の設定
