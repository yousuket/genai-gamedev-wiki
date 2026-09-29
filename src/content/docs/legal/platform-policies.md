---
title: プラットフォームのAIポリシー
description: Steam・itch.io・App Store・Google Play・コンソールの生成AI関連ポリシーと、ゲーム中にLLMで生成する場合に必要なガードレールをまとめます。
sidebar:
  order: 3
lastUpdated: 2026-09-29
---

## 概要

生成AIを使ったゲームを販売するときは、ツールの規約（[AIツールの商用利用条件](/legal/tool-terms/)）に加えて、**販売プラットフォームのルール**も守る必要があります。

- **Steam** は、AI生成コンテンツの開示を申請時に求めています。開示の内容はストアページにも載ります。
- **itch.io** は、アセット（素材）ページでAI使用の開示を事実上必須にしています。
- **App Store / Google Play** には、AIに関する個別の規定があります。
- **ゲーム中にLLMで文章や画像を生成する**（ライブ生成）場合は、どのプラットフォームでも追加の安全対策（ガードレール）が必要です。

販売先の選び方は[販売プラットフォーム](/monetization/platforms/)を参照してください。

## Steam

### 開示の仕組み

Steamでは、ゲームを審査に出す前に「コンテンツ調査（Content Survey）」に回答します。その3番目のセクションが生成AIについての質問です（[Steamworksドキュメント](https://partner.steamgames.com/doc/gettingstarted/contentsurvey)、2026年9月時点）。

AIの使い方は次の2つに分けて申告します。

| 区分 | 定義（要約） | 追加の要件 |
|---|---|---|
| **事前生成（Pre-Generated）** | 開発中にAIツールの助けを借りて作り、ゲームに同梱してプレイヤーが目にするコンテンツ | 違法・権利侵害のコンテンツを含まないこと、宣伝内容とゲームが一致すること（Steam配信契約の約束）。AI以外のコンテンツと同じ基準で審査される |
| **ライブ生成（Live-Generated）** | ゲームの実行中にAIツールの助けを借りて作られるコンテンツ | 事前生成と同じルールに加えて、**違法なコンテンツを生成させないためのガードレール**の内容を申告する |

### 開示の対象にならないもの

同じドキュメントには、次のように書かれています。最近のゲーム開発環境にはAIツールが組み込まれていることが多いが、それによる効率化はこのセクションの対象ではない。対象は、ゲームに同梱されてプレイヤーが消費するコンテンツ（アートワーク、サウンド、ナラティブ、ローカライズなど）である。

この書き方は2026年1月の更新で明確になったと報じられています（[PC Gamer](https://www.pcgamer.com/software/ai/steam-updates-ai-disclosure-form-to-specify-that-its-focused-on-ai-generated-content-that-is-consumed-by-players-not-efficiency-tools-used-behind-the-scenes/)）。たとえば、コード補完ツールを使っただけなら、この開示の対象になるとは読めません。一方で、プレイヤーが見聞きする素材をAIで作ったなら申告します。

### ストアページでの表示とプレイヤーからの報告

2024年1月のValveの発表「[AI Content on Steam](https://steamcommunity.com/groups/steamworks/announcements/detail/3862463747997849619)」では、次のように説明されています。

- 開示の内容は審査に使われ、**その多くがストアページに掲載される**。購入者がAIの使い方を理解できるようにするため
- ライブ生成AIを含むゲームでは、プレイヤーがゲーム内オーバーレイから違法なコンテンツを報告できる
- **ライブ生成AIによる「成人向け性的コンテンツ（Adult Only Sexual Content）」は、現時点ではリリースできない**

### その他の注意点

- リリース後は、調査の一部の回答を自分で変更できなくなります。内容を変えた場合は、Steamサポートに連絡する必要があります（[Steamworksドキュメント](https://partner.steamgames.com/doc/gettingstarted/contentsurvey)）。
- 外部のAIサービスを使うと、利用のたびに費用がかかります。FAQでは、その費用をどう回収するかの例として、本体価格への上乗せ、マイクロトランザクション、サブスクリプション、DLCが挙げられています。

## itch.io

- 2024年11月から、プロジェクトの編集画面に「Generative AI Disclosure」欄があります。**アセット（素材）ページは開示が必須**です。未申告のAI素材は、ブラウズページに表示されなくなります。ゲームのページは、開示が推奨されています（[itch.io公式投稿](https://itch.io/t/4309690/generative-ai-disclosure-tagging)）。
- 「はい」を選ぶと「AI Generated」タグが付きます。さらにグラフィック、サウンド、テキスト・会話、コードの種類別のタグも付きます。「いいえ」を選ぶと「No AI」タグが付きます。
- [品質ガイドライン](https://itch.io/docs/creators/quality-guidelines)では、AI生成コンテンツを大量に作ることや、ページを量産することを避けるよう求めています。
- 大規模データセットを使わない従来型のアルゴリズムは、生成AIのタグの対象外です。例として、NPCの経路探索や手続き型生成が挙げられています。

## App Store（Apple）

[App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)（2026年9月時点）の主な関連項目は次のとおりです。

- **5.1.2(i)**: 個人データを第三者と共有するとき、**第三者のAIと共有する場合も含めて**、共有先を明示し、事前に明確な許可を得る必要があります。この「third-party AI」の文言は2025年11月13日の改定で加わりました（[Apple Developer News](https://developer.apple.com/news/?id=ey6d8onl)）。プレイヤーの入力を外部のLLM APIに送る場合は、これに当たる可能性があります。
- **1.2（ユーザー生成コンテンツ）**: ユーザー生成コンテンツがあるアプリには、不適切な内容のフィルタリング、報告の仕組み、悪質なユーザーのブロック、連絡先の公開が求められます。LLMの出力がこの項目の対象になるかは明記されていません。ただし、プレイヤーの入力をもとに生成するゲームでは、同等の仕組みを用意しておくと安全です。
- **4.7**: バイナリに含まれないソフトウェアとして、チャットボットやHTML5のミニゲームなどが挙げられています。それらが規約と法律に従うことは、開発者の責任とされています。

## Google Play

[AI生成コンテンツのポリシー](https://support.google.com/googleplay/android-developer/answer/13985936?hl=en)（2026年9月時点）の要点は次のとおりです。

- AIで生成するアプリも、既存のポリシーに従う必要があります。児童の搾取につながるコンテンツや、人をだますコンテンツなどを生成させないようにします。
- **アプリを離れずに、不快なコンテンツを開発者へ報告・フラグ付けできる機能**を入れる必要があります。その報告をフィルタリングやモデレーションの改善に使うことも求められています。
- [対象範囲の解説](https://support.google.com/googleplay/android-developer/answer/14094294?hl=en)では、AIチャットボットとの対話が中心機能のアプリや、プロンプトから画像を作るアプリが対象の例に挙がっています。AIで作った素材を載せているだけで生成機能がないアプリは、対象外とされています。

## コンソール・その他のストア

- PlayStation、Xbox、Nintendo の開発者向けルールは、主に秘密保持契約（NDA）のもとで提供されます。2026年9月時点で、Steamのような**公開されたAI開示ルールは確認できませんでした**。報道でも、Steam以外の主要ストアには明確な開示ルールがないと指摘されています（[The Conversation](https://theconversation.com/are-video-game-developers-using-ai-players-want-to-know-but-the-rules-are-patchy-274850)、2026年2月）。
- コンソールの最新の要件は、各社の開発者ポータルで案内されます。
- EUでは、AI法（AI Act）の透明性ルールが2026年8月から適用されると欧州委員会が説明しています。チャットボットと話していることを利用者が分かるようにする、といった内容です（[欧州委員会](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)）。EU向けにライブ生成のゲームを配信するなら、自分のゲームが対象になるかを確認してください。

## ライブ生成する場合のガードレール

ゲーム中にLLMでセリフや画像を生成する場合（AI NPCなど）は、上のポリシーから、少なくとも次の対策が必要になると考えられます。

| 対策 | 内容 | 関係するルール |
|---|---|---|
| 入力と出力のフィルタリング | プレイヤーの入力とAIの出力の両方を、モデレーションAPIやNGワードで検査する | Steam（ガードレールの申告）、Google Play、App Store 1.2 |
| システムプロンプトでの制限 | 世界観の外の話題、性的・暴力的な内容、実在の人物についての話題を断るよう指示する | Steam（違法コンテンツの防止） |
| ゲーム内の報告ボタン | ゲームを離れずに報告できるようにする。Steamのオーバーレイ報告とは別に、自前でも用意する | Google Play（必須）、App Store 1.2 |
| レーティングとの整合 | 生成される内容が、申告したレーティングや成人向けの設定を超えないようにする | Steam のコンテンツ調査 |
| 個人データの同意 | 外部のAIに送るデータ、送り先の事業者名を示し、同意を得る | App Store 5.1.2(i) |
| AIであることの表示 | 生成されたセリフや画像がAIによるものだと、プレイヤーに分かるようにする | Steam のストア表示、EU AI法 |
| ログと改善 | 報告された出力や、ブロックした件数を記録し、フィルターを改善する | Google Play |

**使うLLM APIの規約**にも制限があります。たとえば、[Gemini API の追加利用規約](https://ai.google.dev/gemini-api/terms)は、18歳未満向け、または18歳未満が利用する可能性が高いアプリでの利用を禁じています（2026年9月時点）。Anthropicも、未成年が使う製品にAPIを組み込む組織に追加の安全対策を求めています（[Claudeヘルプセンター](https://support.claude.com/en/articles/9307344-responsible-use-of-anthropic-s-models-guidelines-for-organizations-serving-minors)）。

## AIの活用ポイント

- **申告文の下書き**: 素材台帳（どの素材をどのツールで作り、どう加工したか）をLLMに渡すと、Steamのコンテンツ調査に書く説明文を下書きできます。
- **レッドチーミング（安全性の攻撃テスト）**: ライブ生成のNPCに対して、わざと不適切な発言を引き出す入力を別のLLMに大量に作らせ、フィルターが働くかを自動テストできます。
- **注意点**: ガードレールは完全には防げません。報告を受け付ける窓口と、問題が起きたときに生成機能を止められる仕組み（サーバー側のフラグなど）を用意しておきます。関連: [AIコーディングツール](/dev-env/ai-coding-tools/)

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Content Survey（Steamworksドキュメント）](https://partner.steamgames.com/doc/gettingstarted/contentsurvey) — AI開示セクションの定義とFAQ
- [AI Content on Steam（Steamworks Development）](https://steamcommunity.com/groups/steamworks/announcements/detail/3862463747997849619) — 2024年1月のValveの発表
- [Generative AI Disclosure tagging（itch.io）](https://itch.io/t/4309690/generative-ai-disclosure-tagging) — itch.ioのAI開示タグの説明
- [itch.io Quality Guidelines](https://itch.io/docs/creators/quality-guidelines) — AI生成コンテンツに関する品質ガイドライン
- [App Review Guidelines（Apple）](https://developer.apple.com/app-store/review/guidelines/) — 5.1.2(i)、1.2 など
- [AI-Generated Content（Google Play）](https://support.google.com/googleplay/android-developer/answer/13985936?hl=en) — アプリ内報告の義務
- [Understanding Google Play's AI-Generated Content policy](https://support.google.com/googleplay/android-developer/answer/14094294?hl=en) — 対象範囲の解説
- [Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms) — 年齢に関する制限
- [AI Act（欧州委員会）](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) — 透明性ルールの概要
