---
title: ジャンルと個人開発の向き不向き
description: 主要なゲームジャンルを開発規模・必要アセット量・個人開発での実績例で比較し、最初の1本に向くジャンルの選び方を示します。
sidebar:
  order: 1
lastUpdated: 2026-09-29
---

## 概要

ジャンル選びは、個人開発のスコープ（作る範囲）を決める最初の判断です。
同じ「面白いアイデア」でも、ジャンルによって必要なアセット（画像・音・3Dモデル・テキストなどの素材）の量や、調整にかかる手間は大きく変わります。
この記事では主要ジャンルを表で比較し、個人・少人数で実際に成功した例と、ジャンルを選ぶときの判断基準を紹介します。

## 比較の見方

- **開発規模**: 個人で「最初から最後まで遊べる」状態にするまでの目安です。小＝数週間〜3か月、中＝3か月〜1年、大＝1年以上。
- **必要アセット量**: 完成品として必要な素材の量です。コードの量ではありません。
- **実績例**: 個人または少人数で開発され、商業的・批評的に評価された作品です。開発体制は出典で確認できた範囲で書いています。

## ジャンル比較表

| ジャンル | 開発規模 | 必要アセット量 | 主なアセット | 個人・少人数での実績例 |
|---|---|---|---|---|
| パズル | 小〜中 | 少 | シンプルな2D画像、UI | Baba Is You（Hempuli Oy） |
| 放置・インクリメンタル | 小 | 少 | UI、アイコン、数値設計 | Cookie Clicker（Orteil, DashNet） |
| サバイバー系 | 小〜中 | 中 | 敵・武器・エフェクトの2D画像 | Vampire Survivors（poncle）、Brotato（Blobfish） |
| ローグライク・デッキ構築 | 中 | 中 | カード・アイコンの絵、効果音 | Balatro（LocalThunk）、Slay the Spire（Mega Crit） |
| 短編ホラー・ウォーキングシム | 小〜中 | 中 | 3D環境、環境音 | 8番出口（KOTAKE CREATE）、Buckshot Roulette（Mike Klubnika） |
| ノベル・ADV | 小〜中 | 中〜多 | 立ち絵、背景、大量のテキスト、BGM | Doki Doki Literature Club!（Team Salvato）、Slay the Princess（Black Tabby Games） |
| ルール重視のシミュレーション | 中 | 中 | UI、2D画像、テキスト | Papers, Please（Lucas Pope） |
| RPG | 大 | 多 | キャラクター、マップ、敵、会話、BGM | Undertale（tobyfox） |
| 生活・農業シム | 大 | 多 | キャラクター、アニメーション、マップ、アイテム | Stardew Valley（ConcernedApe） |
| 3D協力・サンドボックス | 大 | 多 | 3Dモデル、アニメーション、ネットワーク機能 | Lethal Company（Zeekerss）、Schedule I（TVGS） |
| 2Dアクション・プラットフォーマー | 中〜大 | 多 | 大量のアニメーション、ステージ | （操作感の調整に時間がかかる。最初の1本では規模を絞る） |
| 対戦オンライン・MMO・大規模オープンワールド | 特大 | 特大 | ほぼすべて＋サーバー運用 | 個人での最初の1本には向かない |

各作品のストアページと、開発体制の出典は[参考リンク](#参考リンク)にまとめています。

## 個人開発者の実例から分かること

表の作品のうち、開発体制が公表されている例をいくつか見てみます。

| 作品 | 分かっていること | 出典 |
|---|---|---|
| 8番出口 | 個人開発。構想6か月・実作業3か月で制作し、2026年9月に累計300万本を突破 | [GameBusiness.jp](https://www.gamebusiness.jp/article/2024/12/09/23720.html)、[4Gamer.net](https://www.4gamer.net/games/751/G075133/20260907030/) |
| Balatro | 個人開発者 LocalThunk による作品。2025年1月に500万本を突破 | [PC Gamer](https://www.pcgamer.com/i-dont-play-poker-at-all-says-solo-developer-who-made-the-poker-roguelike-i-cant-stop-playing/)、[Playstack](https://www.playstack.com/news/balatro-5-million-copies-sold/) |
| Vampire Survivors | 個人開発で始まり、初期はオープンソースのHTML5エンジン Phaser で作られた | [Game Developer](https://www.gamedeveloper.com/design/vampire-survivors-development-sounds-like-an-open-source-fueled-fever-dream) |
| Stardew Valley | 約4年かけて1人で開発 | [公式プレスキット](https://www.stardewvalley.net/press/) |
| Schedule I | 個人開発者による作品で、2025年のSteamで大きなヒットになった | [80.lv](https://80.lv/articles/walter-white-simulator-schedule-i-becomes-steam-s-most-popular-indie-game-of-2025) |

ここから次のような傾向が読み取れます。

- **遊びが1つに絞られている**: 8番出口は「異変を見つけて進むか戻るか」、Balatroは「ポーカーの役で得点を伸ばす」という明確なコアループ（繰り返す基本の遊び）を持っています。
- **見た目より仕組みで勝負している**: Vampire SurvivorsやBaba Is Youは、豪華なグラフィックよりもルールの面白さで評価されました。
- **大規模ジャンルの成功例は長期間かかっている**: Stardew Valleyのような生活シムは、1人で数年単位の開発が必要でした。

:::caution
ヒット作は「生存者バイアス」がかかった例です。同じジャンルで同じくらい作り込んでも、売れなかった作品の方がはるかに多いことに注意してください。
ジャンルは「売れるかどうか」より「自分が完成させられるかどうか」で選ぶのがおすすめです。
:::

## ジャンルの選び方

### 判断の基準

| 質問 | 「はい」なら向いているジャンル |
|---|---|
| 絵を描くのが苦手、またはアセットを最小限にしたい | パズル、放置・インクリメンタル、ルール重視のシミュレーション |
| 数値やシステムを考えるのが好き | ローグライク・デッキ構築、サバイバー系、放置・インクリメンタル |
| 文章や物語を書きたい | ノベル・ADV |
| 3Dの空間表現を試したい | 短編ホラー・ウォーキングシム（舞台を1か所に絞る） |
| 操作の気持ちよさを追求したい | 2Dアクション（ステージ数を少なくする） |

### 最初の1本で避けたい要素

ジャンルに関わらず、次の要素は作業量を大きく増やします。

- **オンラインマルチプレイ**: 通信・同期・不正対策・サーバー運用が必要になります。
- **長いストーリーとボイス**: テキスト量と収録・生成の手間が膨らみます。
- **広いマップ**: 配置・移動・テストの範囲が広がります。
- **多数のキャラクターのアニメーション**: 1体増えるごとに、動きの数だけ素材が必要です。

スコープの詳しい考え方は[スコープの決め方](/getting-started/scope/)を参照してください。

## AIの活用ポイント

- **アセット量の多いジャンルほどAIの効果は大きいが、統一感の手直しも増える**: ノベルの背景やデッキ構築のカード絵は枚数が多く、生成AIで試作を速められます。一方で画風をそろえる作業は残ります。詳しくは[生成AIと相性の良いジャンル](/genres/ai-friendly/)で扱います。
- **類似作品の分析に使う**: 候補ジャンルの代表作について、コアループ・プレイ時間・課金形態をAIに整理させ、比較表の叩き台にできます。ただし販売本数などの数字は、AIの回答をそのまま使わず出典で確認します。
- **LLMそのものを遊びにする選択肢もある**: 会話や推理にLLMを使う新しいジャンルもあります。APIコストや安全性の設計が必要になるため、[LLMをゲームの中で使うジャンル](/genres/llm-native/)を読んでから検討してください。
- **AIの利用は開示が必要になる場合がある**: Steamでは、開発中にAIで作ったコンテンツとゲーム実行中にAIが生成するコンテンツの申告が求められます（[Steamworks: コンテンツアンケート](https://partner.steamgames.com/doc/gettingstarted/contentsurvey)、2026年9月時点）。詳しくは[プラットフォームのAIポリシー](/legal/platform-policies/)を参照してください。

## 最新情報

:::note[自動更新]
この欄は情報収集エージェントが毎週更新しています。
:::

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

各作品のSteamストアページ（開発者名・発売日の確認用）:

- [Baba Is You](https://store.steampowered.com/app/736260/) — Hempuli Oy
- [Cookie Clicker](https://store.steampowered.com/app/1454400/) — Orteil, DashNet
- [Vampire Survivors](https://store.steampowered.com/app/1794680/) — poncle
- [Brotato](https://store.steampowered.com/app/1942280/) — Blobfish
- [Balatro](https://store.steampowered.com/app/2379780/) — LocalThunk
- [Slay the Spire](https://store.steampowered.com/app/646570/) — Mega Crit
- [8番出口](https://store.steampowered.com/app/2653790/) — KOTAKE CREATE
- [Buckshot Roulette](https://store.steampowered.com/app/2835570/) — Mike Klubnika
- [Doki Doki Literature Club!](https://store.steampowered.com/app/698780/) — Team Salvato
- [Slay the Princess — The Pristine Cut](https://store.steampowered.com/app/1989270/) — Black Tabby Games
- [Papers, Please](https://store.steampowered.com/app/239030/) — Lucas Pope
- [Undertale](https://store.steampowered.com/app/391540/) — tobyfox
- [Stardew Valley](https://store.steampowered.com/app/413150/) — ConcernedApe
- [Lethal Company](https://store.steampowered.com/app/1966720/) — Zeekerss
- [Schedule I](https://store.steampowered.com/app/3164500/) — TVGS

開発体制・実績の出典:

- [8番出口の開発振り返り（GameBusiness.jp）](https://www.gamebusiness.jp/article/2024/12/09/23720.html) — 個人開発、構想6か月・実作業3か月
- [「8番出口」の累計販売本数が300万本を突破（4Gamer.net）](https://www.4gamer.net/games/751/G075133/20260907030/) — 2026年9月の販売本数
- [PC Gamer: Balatro 開発者インタビュー](https://www.pcgamer.com/i-dont-play-poker-at-all-says-solo-developer-who-made-the-poker-roguelike-i-cant-stop-playing/) — 個人開発者であること
- [Playstack: Balatro 500万本突破](https://www.playstack.com/news/balatro-5-million-copies-sold/) — パブリッシャーによる販売本数の発表
- [Game Developer: Vampire Survivors の開発](https://www.gamedeveloper.com/design/vampire-survivors-development-sounds-like-an-open-source-fueled-fever-dream) — Phaser での初期開発
- [Stardew Valley 公式プレスキット](https://www.stardewvalley.net/press/) — 1人での開発期間と販売本数
- [80.lv: Schedule I](https://80.lv/articles/walter-white-simulator-schedule-i-becomes-steam-s-most-popular-indie-game-of-2025) — 個人開発者によるヒット
- [GamesRadar+: Zeekerss インタビュー](https://www.gamesradar.com/games/horror/life-after-lethal-company-solo-creator-zeekerss-says-weirdly-not-a-lot-has-changed-after-one-of-the-biggest-indie-hits-in-recent-memory-and-he-still-has-a-good-handful-of-ideas-for-games/) — Lethal Company の個人開発者
