---
title: 広告・アプリ内課金
description: モバイル・ブラウザゲームの広告とアプリ内課金の基本、ガチャの規制、LLMを使うゲームでAPIコストと収益を釣り合わせる方法を解説します。
sidebar:
  order: 3
lastUpdated: 2026-09-29
---

## 概要

無料で遊べるゲームは、広告やアプリ内課金（IAP: In-App Purchase）で収益を得ます。この記事では次のことを扱います。

- 広告の種類と、モバイル・ブラウザでの広告の入れ方
- アプリ内課金の基本ルールと、ガチャ（ランダム型アイテム販売）の注意点
- **LLM（大規模言語モデル）をゲーム内で使う場合の、APIコストと収益の釣り合わせ方**

プラットフォームごとの手数料は [販売プラットフォーム](/monetization/platforms/) を参照してください。

## 収益モデルの種類

| モデル | 仕組み | 向いている場所 |
|---|---|---|
| 買い切り | 1回払って全部遊べる | Steam、itch.io、家庭用ゲーム機 |
| 広告 | 無料で遊ばせ、広告表示で稼ぐ | スマホ、ブラウザ（Steamは不可） |
| アプリ内課金 | 無料で遊ばせ、アイテムや追加要素を売る | スマホ、Steamの基本無料ゲーム |
| サブスクリプション | 月額などの定期課金 | 継続的にサーバー費用がかかるゲーム |

Steamは「広告収益を主とするビジネスモデルのアプリ」を受け付けていません（[Steamworks オンボーディング](https://partner.steamgames.com/doc/gettingstarted/onboarding)、2026年9月時点）。広告モデルはスマホかブラウザで考えましょう。

## 広告

### 広告の形式

| 形式 | 内容 | 注意点 |
|---|---|---|
| リワード広告 | プレイヤーが自分で選んで見る動画広告。見ると報酬がもらえる | 満足度を下げにくい。報酬のバランス調整が必要 |
| インタースティシャル広告 | ステージの合間などに出る全画面広告 | 出しすぎると離脱の原因になる |
| バナー広告 | 画面の端に常に出る小さな広告 | 収益は小さめ。誤タップを誘う配置は避ける |

一般に、**プレイヤーが自分で選ぶリワード広告**から始めると、体験を損ねにくくなります。

### モバイル

AdMobなどの広告SDK（アプリに組み込むライブラリ）を使います。複数の広告ネットワークを切り替えて収益を上げる「メディエーション」という仕組みもあります。収益の分配率や単価は広告ネットワークや地域によって変わり、公式に固定の率が示されていないものも多いため、**実際の収益はテスト公開で計測する**のが確実です。

### ブラウザ

- **ポータルに載せる**: PokiやCrazyGamesは専用SDKを通じて広告を表示し、収益を分け合います。自分で広告契約をする必要はありません（[Working with Poki](https://developers.poki.com/guide/working-with-poki)、[CrazyGames FAQ](https://docs.crazygames.com/faq/)）。CrazyGamesは、収益化するゲームに外部広告や他ポータルのロゴを入れないことを求めています（同FAQ）。
- **自分のサイトで配信する**: GoogleのAdSense H5 Games Adsは、HTML5ゲームの合間の広告やリワード広告を出せる仕組みで、申請制です（[Sign up for AdSense H5 Games Ads](https://support.google.com/adsense/answer/1705831?hl=en)）。

## アプリ内課金

### ストアの決済を使う義務

- **App Store**: 機能やコンテンツのロック解除（サブスク、ゲーム内通貨、追加ステージなど）にはAppleのアプリ内課金を使う必要があります。例外は地域ごとに定められており、米国のストアフロントでは外部の購入手段へのリンクが認められています（[App Review Guidelines 3.1](https://developer.apple.com/app-store/review/guidelines/)、2026年9月時点）。日本では外部決済も選べるようになりました（[Payment options on the App Store in Japan](https://developer.apple.com/support/payment-options-on-the-app-store-in-japan/)）。
- **Google Play**: 地域によって代替決済や外部リンクの選択肢があり、手数料体系も移行中です（[Understanding Google Play's lower service fees](https://support.google.com/googleplay/android-developer/answer/16954621?hl=en)）。

### ガチャ（ランダム型アイテム）の注意点

- **確率の開示**: App StoreとGoogle Playはいずれも、ランダムにアイテムが出る課金要素（ルートボックス）について、**購入前に確率を開示する**ことを求めています（[App Review Guidelines 3.1.1](https://developer.apple.com/app-store/review/guidelines/)、[Google Play Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en)）。
- **コンプガチャの禁止（日本）**: 特定の組み合わせをそろえると別のアイテムがもらえる「コンプガチャ」は、景品表示法で禁止される「カード合わせ」に当たる場合があると消費者庁が示しています（[消費者庁の見解](https://www.caa.go.jp/policies/policy/representation/fair_labeling/guideline/pdf/120518premiums_1.pdf)、[Q&A](https://www.caa.go.jp/policies/policy/representation/fair_labeling/faq/card/)）。
- 国・地域ごとに独自の規制があります（韓国の確率表示義務など。[Google Playの国別要件](https://support.google.com/googleplay/android-developer/answer/6223646?hl=en)）。

### 課金設計の基本

- **買えるものを分かりやすく**: 見た目（スキン）、広告の削除、追加ステージなど、何が手に入るかを明確にします。
- **無課金でも楽しめる状態を保つ**: 課金しないと進めない設計は、レビューの悪化につながりやすくなります。
- **小さく始める**: 最初は「広告削除」や「追加コンテンツ」など単純な商品から試し、データを見て増やしましょう。

## LLMを使うゲームのAPIコスト

AI NPC（LLMで会話するキャラクター）や生成型ストーリーのゲームでは、**プレイヤーが遊ぶほどAPIの利用料がかかります**。買い切りで売ると、よく遊ぶプレイヤーほど赤字になる構造になりがちです。

### 料金の例（2026年9月時点）

| モデル | 入力（100万トークンあたり） | 出力（100万トークンあたり） | 出典 |
|---|---|---|---|
| Claude Haiku 4.5 | 1ドル | 5ドル | [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Sonnet 5.5 | 2ドル | 10ドル | 同上 |
| Gemini 3.1 Flash-Lite | 0.25ドル | 1.50ドル | [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing) |

トークンはモデルが文章を処理する単位です。日本語と英語で同じ文字数でもトークン数は変わるため、実際のプロンプトで計測してください。

### 試算の例

AI NPCとの会話1回あたり、入力3,000トークン（うち2,000トークンは毎回同じ設定文）、出力200トークンと仮定します。

| 条件 | 1回あたり | 300回（10時間程度の想定） |
|---|---|---|
| Claude Haiku 4.5（キャッシュなし） | 約0.004ドル | 約1.2ドル |
| Claude Haiku 4.5（設定文をキャッシュ） | 約0.0022ドル | 約0.66ドル |
| Gemini 3.1 Flash-Lite（キャッシュなし） | 約0.00105ドル | 約0.32ドル |

- Anthropicのプロンプトキャッシュは、キャッシュから読む分が通常の入力の0.1倍（Haiku 4.5の場合）です。書き込み時は1.25倍（5分間）または2倍（1時間）かかります（[Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)）。
- 非同期の一括処理（Batch API）は50%引きですが、会話のようにすぐ応答が必要な処理には向きません（同上）。事前に大量のテキストを生成しておく用途なら使えます。
- 10ドルで売ってSteamの取り分30%を引くと、手元に残るのは約7ドル（税金は別）です。上の試算で**10倍遊ぶヘビーユーザー**がいると、モデルによっては売上を超えます。

### 収益モデルの選択肢

| 方式 | 内容 | 長所 | 短所 |
|---|---|---|---|
| 買い切り＋利用上限 | 1日あたりの会話回数などに上限を設ける | 分かりやすい | 上限に不満が出やすい |
| サブスクリプション | 月額でAI機能を提供 | 継続的なコストと収入が釣り合う | 解約されないだけの価値が必要 |
| 従量課金（クレジット制） | 会話回数分のクレジットを販売 | コストと収入が比例する | 課金の心理的な抵抗が大きい。ストアの課金ルールに従う必要がある |
| BYOK | プレイヤーが自分のAPIキーを入力する（Bring Your Own Key） | 開発者のAPIコストがゼロ | 一般のプレイヤーには難しい。キーの扱いに責任が伴う |
| ローカルモデル | プレイヤーのPC上で小さなモデルを動かす | APIコストがゼロ | 必要スペックが上がる。品質が下がりやすい |
| ハイブリッド | 基本はローカルや安いモデル、重要な場面だけ高性能モデル | コストと品質のバランスを取れる | 実装が複雑 |

### 実装上の注意

- **APIキーをゲームに埋め込まない**: クライアントに入れたキーは抜き取られます。自前のサーバー（プロキシ）を経由させ、プレイヤーごとの利用量を制限しましょう。
- **BYOKを採用する場合**: キーの保存方法（端末内に暗号化して保存するなど）と、各ストアの審査方針で問題にならないかを事前に確認してください。
- **無料枠のデータの扱い**: Gemini APIの無料枠では、入力が製品改善に使われると料金ページに記載されています（[Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)）。プレイヤーの入力を送る場合は、利用規約やプライバシーポリシーで説明が必要になります。
- **ストアの申告**: ゲーム内でリアルタイムにAI生成を行う場合、Steamなどでは追加の申告が求められます。詳しくは [プラットフォームのAIポリシー](/legal/platform-policies/) を参照してください。

## AIの活用ポイント

- **コスト試算のスクリプト化**: 想定プレイ時間・会話頻度・トークン数を変数にしたスプレッドシートやスクリプトをAIに作らせると、価格や上限の検討が速くなります。
- **プロンプトの短縮**: 毎回送る設定文をAIに要約・圧縮させると、入力トークンを減らせます。短くしすぎて品質が落ちないか、テストで確認しましょう。
- **課金まわりの文言**: 商品説明や確率表示の文章の下書きにAIを使えます。
- **ログ分析**: 広告の視聴率や課金率のデータを集計・可視化するコードの作成にもAIが役立ちます。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) — Appleの課金ルール（3.1）
- [Google Play: Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en) — Google Playの課金ポリシー
- [消費者庁: カード合わせに関するQ&A](https://www.caa.go.jp/policies/policy/representation/fair_labeling/faq/card/) — コンプガチャ規制の考え方
- [AdSense H5 Games Ads](https://support.google.com/adsense/answer/1705831?hl=en) — ブラウザゲーム向け広告の申請
- [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing) — Claude APIの料金、キャッシュ、バッチ割引
- [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing) — Gemini APIの料金と無料枠
