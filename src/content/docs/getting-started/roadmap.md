---
title: 企画からリリースまでの全体ロードマップ
description: 個人ゲーム開発を企画・プロトタイプ・バーティカルスライス・制作・PV/ストアページ・リリース・運営の7段階に分け、各段階の目標と読むべき記事を示します。
sidebar:
  order: 2
lastUpdated: 2026-09-29
---

## 概要

ゲーム制作は「作って終わり」ではなく、知ってもらい、売り、リリース後も手を入れる作業まで続きます。
この記事では、個人開発の流れを7つの段階に分け、それぞれの**目標・完了の目安・読むべき記事**をまとめます。
今どの段階にいるかを確認し、必要な記事だけを拾い読みする地図として使ってください。

## 全体像

| 段階 | 目標 | 完了の目安 |
|---|---|---|
| 1. 企画 | 何を作るかを決める | 1ページの企画書と、切り捨てる要素のリストがある |
| 2. プロトタイプ | コアの遊びが面白いか確かめる | 仮の見た目で、コアループが数分遊べる |
| 3. バーティカルスライス | 完成品の品質を小さな範囲で作る | 1ステージ分が製品に近い見た目・音で遊べる |
| 4. 制作 | 残りの中身を量産する | 最初から最後まで通しで遊べる |
| 5. PV/ストアページ | 知ってもらい、ウィッシュリストを集める | ストアページ公開、PVと体験版がある |
| 6. リリース | 販売を開始する | 発売日に告知・ビルド・ストア情報がそろっている |
| 7. 運営 | 不具合修正と継続的な改善 | アップデート計画と問い合わせ対応の手順がある |

5の「ストアページ」は、4の制作と並行して早めに始めるのが一般的です。
段階は一方通行ではなく、プロトタイプで面白くなければ企画に戻る、といった行き来が前提です。

## 1. 企画

「どんなゲームを、どの規模で作るか」を決める段階です。
個人開発では、アイデアの良し悪しよりも**完成させられる規模に収めること**が結果を大きく左右します。

やること:

- ジャンルを選び、似た作品を5本ほど遊んで比較する
- コアループ（ゲームの中で繰り返す基本の遊び）を1文で書く
- 作らない要素を先に決める（マルチプレイ、長いストーリー、多数のキャラクターなど）
- 販売先と価格帯の見当をつける

読む記事:

- [スコープの決め方](/getting-started/scope/)
- [ジャンルと個人開発の向き不向き](/genres/overview/)
- [生成AIと相性の良いジャンル](/genres/ai-friendly/)
- [LLMをゲームの中で使うジャンル](/genres/llm-native/)（ゲーム内でLLMを使う場合）
- [コアループ](/design/core-loop/)
- [MDAフレームワーク](/design/mda/)
- [企画書テンプレート](/design/game-design-doc/)
- [AIを企画の壁打ちに使う方法](/design/ai-brainstorming/)
- [販売プラットフォーム](/monetization/platforms/)

## 2. プロトタイプ

コアループが面白いかを、**最小限の実装で確かめる**段階です。
見た目は四角や丸などの仮素材で十分です。ここでアートに時間をかけると、面白くなかったときの損失が大きくなります。

やること:

- ゲームエンジンを選び、コアループだけを実装する
- 自分以外の人に数分遊んでもらい、反応を見る
- 面白くなければ、ルールを変えるか企画に戻る

読む記事:

- [ゲームエンジンの比較](/dev-env/engines/)
- [AIコーディングツール](/dev-env/ai-coding-tools/)
- [AI駆動の開発ワークフロー](/dev-env/ai-workflow/)
- [プレイテスト](/design/playtesting/)

:::tip
AIツールを使い始めるこの段階で、[AIツールの商用利用条件](/legal/tool-terms/)も一度確認しておくと、後から素材を作り直す事態を避けやすくなります。
:::

## 3. バーティカルスライス

バーティカルスライスとは、**ゲームの一部分（1ステージなど）だけを、製品版に近い品質で作ったもの**です。
「全部を少しずつ」ではなく「一部を完成品の品質で」作ることで、次のことが分かります。

- アートの方向性（画風）と、1ステージあたりの制作時間
- 全体を作り切るのに必要な作業量の見積もり
- PVやストアページに使える素材になるか

生成AIでアセットを作る場合、**画風をそろえられるか**をここで確かめておくのが重要です。

読む記事:

- [アセット生成](/dev-env/asset-generation/)
- [レベルデザイン](/design/level-design/)
- [生成AI素材の著作権](/legal/copyright/)
- [アセット・OSSのライセンス](/legal/licenses/)

## 4. 制作

バーティカルスライスで決めた品質を、残りの範囲に広げる段階です。
期間が最も長く、スコープが膨らみやすい段階でもあります。

やること:

- ステージ・カード・敵などの中身を量産する
- 定期的にプレイテストし、難易度や報酬を調整する
- 追加したい要素は「次回作・アップデート用リスト」に回す

読む記事:

- [バランス調整](/design/balancing/)
- [プレイテスト](/design/playtesting/)
- [AI駆動の開発ワークフロー](/dev-env/ai-workflow/)
- [アセット生成](/dev-env/asset-generation/)

## 5. PV/ストアページ

ゲームを知ってもらい、ウィッシュリスト（Steamの「欲しいものリスト」）を集める段階です。
Steamでは、ウィッシュリストに登録したユーザーに発売時にメールで通知が届きます（[Steamworks: 近日登場ページ](https://partner.steamgames.com/doc/store/coming_soon)）。

Steamで押さえておきたい仕組み（2026年9月時点）:

| 項目 | 内容 | 出典 |
|---|---|---|
| 近日登場ページ | 新作は発売の少なくとも2週間前に公開が必要。画風と主要機能が固まってから公開するよう推奨されている | [Steamworks: 近日登場](https://partner.steamgames.com/doc/store/coming_soon) |
| Steam Next Fest | 体験版を出す未発売作品のための1週間のイベント。2月・6月・10月の年3回開催で、1作品につき参加は1回のみ | [Steamworks: Steam Next Fest](https://partner.steamgames.com/doc/marketing/upcoming_events/nextfest) |
| Steam Playtest | 本編とは別のアプリIDで無料のテストを行える機能。テストのレビューは本編に影響しない | [Steamworks: Steam Playtest](https://partner.steamgames.com/doc/features/playtest) |
| AI生成コンテンツの開示 | コンテンツアンケートで、開発時に作ったAI生成物と、ゲーム実行中にAIが生成するものを申告する | [Steamworks: コンテンツアンケート](https://partner.steamgames.com/doc/gettingstarted/contentsurvey) |

読む記事:

- [PVの構成](/trailer/structure/)
- [画面キャプチャと編集ツール](/trailer/capture-and-editing/)
- [AI動画生成の使いどころ](/trailer/ai-video/)
- [Steamトレーラーの要件](/trailer/steam-trailer/)
- [SNS向けショート動画](/trailer/social-shorts/)
- [ウィッシュリストの集め方](/monetization/wishlists/)
- [クラウドファンディング](/monetization/crowdfunding/)（資金を集める場合）
- [プラットフォームのAIポリシー](/legal/platform-policies/)

## 6. リリース

販売を始める段階です。発売日から逆算して準備します。

Steamの場合、アプリごとに100米ドル（相当額）のSteam Direct手数料がかかり、調整後の総収益が1,000米ドルに達すると回収できます（[Steamworks: Steam Direct手数料](https://partner.steamgames.com/doc/gettingstarted/appfee)、2026年9月時点）。
また、手数料の支払いからリリースまでには待機期間があります。
公式ページでも記載が分かれており、オンボーディングの文書では21日、Steam Directの案内ページでは30日とされています（[オンボーディング](https://partner.steamgames.com/doc/gettingstarted/onboarding)、[Steam Direct](https://partner.steamgames.com/steamdirect)、2026年9月時点）。
余裕を持って、発売予定日の1か月以上前に支払いを済ませておくと安全です。

やること:

- 価格と発売日を決める
- ストアの説明文・スクリーンショット・AI開示の内容を最終確認する
- 発売日の告知（SNS、ウィッシュリスト登録者への通知）を準備する

読む記事:

- [価格設定](/monetization/pricing/)
- [販売プラットフォーム](/monetization/platforms/)
- [広告・アプリ内課金](/monetization/ads-and-iap/)（モバイルやブラウザで出す場合）
- [プラットフォームのAIポリシー](/legal/platform-policies/)
- [AIツールの商用利用条件](/legal/tool-terms/)

## 7. 運営

リリース後は、不具合修正・レビューへの対応・アップデートが続きます。
発売直後はバグ報告が集中しやすいため、修正版を素早く出せる体制を整えておきます。

やること:

- 不具合報告を集める窓口（Steamのコミュニティ、Discordなど）を決める
- 修正アップデートと、追加コンテンツの計画を立てる
- 売上とプレイデータを見て、次回作の企画に生かす

読む記事:

- [プレイテスト](/design/playtesting/)（アップデート内容の検証）
- [バランス調整](/design/balancing/)
- [広告・アプリ内課金](/monetization/ads-and-iap/)
- 最新動向カテゴリの週次レポート（ツールや規約の変化の確認）

## AIの活用ポイント

| 段階 | AIが役立つ作業 | 人間が判断すべきこと |
|---|---|---|
| 企画 | アイデア出し、類似作品の整理、企画書の下書き | どれを作るか、何を捨てるか |
| プロトタイプ | コードの下書き、仮素材の作成 | 面白いかどうか |
| バーティカルスライス | アセットの試作、画風の検討 | 画風の統一、品質の基準 |
| 制作 | 量産作業、テストコード、データ整形 | バランス、全体の一貫性 |
| PV/ストアページ | 説明文の下書き、翻訳の下訳、動画素材の補助 | 実際のゲーム画面を正しく伝えているか |
| リリース・運営 | バグ報告の分類、パッチノートの下書き | 優先順位、ユーザーへの対応 |

GDCの2026年の業界調査では、生成AIを仕事で使う人の用途は「調査・ブレインストーミング」が81%、「コーディング支援」が47%、「プロトタイピング」が35%でした（[GDC 2026 State of the Game Industry](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/)）。
同じ調査では、回答者の52%が生成AIは業界に悪影響を与えていると答えています。
プレイヤーや業界の受け止め方にも差があるため、**どこでAIを使ったかを記録しておき、ストアの開示に正確に反映できるようにする**ことが大切です。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Steamworks: 近日登場ページ](https://partner.steamgames.com/doc/store/coming_soon) — ストアページの公開時期と2週間ルール
- [Steamworks: Steam Next Fest](https://partner.steamgames.com/doc/marketing/upcoming_events/nextfest) — 体験版イベントの参加条件
- [Steamworks: Steam Playtest](https://partner.steamgames.com/doc/features/playtest) — 無料で外部テストを行う機能
- [Steamworks: コンテンツアンケート](https://partner.steamgames.com/doc/gettingstarted/contentsurvey) — AI生成コンテンツの開示
- [Steamworks: Steam Direct手数料](https://partner.steamgames.com/doc/gettingstarted/appfee) — 手数料と回収条件
- [Steamworks: オンボーディング](https://partner.steamgames.com/doc/gettingstarted/onboarding) — 初回リリースまでの手順と待機期間
- [GDC 2026 State of the Game Industry](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/) — ゲーム業界での生成AI利用の調査
