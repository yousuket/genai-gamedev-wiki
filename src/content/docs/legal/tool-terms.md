---
title: AIツールの商用利用条件
description: 画像・音楽・動画・音声・3D・コード生成AIの商用利用条件、出力の権利、無料プランの制限、補償の有無を規約本文をもとに比較します。
sidebar:
  order: 2
lastUpdated: 2026-09-29
---

## 概要

生成AIで作った素材をゲームに入れて販売するなら、ツールごとに次の4点を確認します。

1. **商用利用できるか**（プランによって違うことが多い）
2. **出力の権利は誰のものか**（利用者に帰属するか、サービス側が持つか）
3. **無料プランの制限**（非商用限定、公開される、クレジット表記が必要など）
4. **補償（indemnity）の有無**（第三者から権利侵害で訴えられたとき、サービス側が防御や賠償をしてくれるか）

以下の表は、2026年9月時点で規約本文を確認した内容です。

:::note[「補償」について]
個人向けプランの規約では、補償がないのが一般的です。逆に、**利用者がサービス側を補償する**（利用者の使い方が原因の請求について、利用者が責任を負う）条項が入っていることがほとんどです。サービス側の補償は、法人向け契約やAPI契約に限られることが多く、対象外になる条件も細かく決められています。
:::

## 画像生成

| ツール | 出力の権利 | 商用利用・プランの条件 | 補償 | 規約 |
|---|---|---|---|---|
| Midjourney | 利用者が所有（法律上可能な範囲） | 年間売上100万ドル超の企業（またはその従業員）は、ProかMegaプランでないと所有できない。生成物は初期設定で公開され、他人がリミックスできる。非公開にする Stealth は Pro / Mega の機能 | なし。利用者がMidjourneyを補償する | [Terms of Service](https://docs.midjourney.com/hc/en-us/articles/32083055291277-Terms-of-Service)（2026年5月27日版） |
| OpenAI（ChatGPTの画像生成など） | OpenAIが持つ権利を利用者に譲渡 | 個人向け規約に、商用を禁じる条項は見当たらない。出力は唯一のものではなく、他の利用者にも似た出力が出る可能性があると明記 | 個人向けはなし。API・法人向けの Services Agreement には、条件付きの補償条項がある | [Terms of Use](https://openai.com/policies/row-terms-of-use/)（2026年1月1日発効）、[Services Agreement](https://openai.com/policies/services-agreement/) |
| Adobe Firefly | 確認したFAQでは商用利用の可否を案内（権利帰属の条文は各プランの規約で確認） | ベータ表示のない機能の出力は商用利用できる。ベータ機能も、製品内で特に明示がなければ商用利用できる。Adobe独自のモデルは、Adobe Stockやパブリックドメインなどで学習。**提携先のモデル（Google、OpenAIなど）を選んだ場合、適否の判断は利用者の責任** | 企業向けの対象契約で提供（個人プランでの補償は確認できず） | [Firefly FAQ](https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/adobe-firefly-faq.html)、[提携モデルの説明](https://helpx.adobe.com/creative-cloud/apps/generative-ai/non-adobe-models-in-adobe-products.html) |
| Stable Diffusion など（Stability AI Community License） | 利用者が所有 | 年間売上100万ドル未満なら無料で商用利用できる。商用利用する場合は登録が必要。超えたらEnterpriseライセンスが必要。モデルや派生物を配布する場合は「Powered by Stability AI」の表示が必要 | なし | [Community License](https://stability.ai/community-license-agreement)（2024年7月5日更新） |
| Google（Geminiアプリなど） | Googleは所有権を主張しない | AI生成物を人間が作ったように見せて誤解させることを禁止。AI生成物を使ったモデル開発も禁止 | 個人向け規約では確認できず。Google Cloud には補償対象サービスの一覧がある | [Google利用規約](https://policies.google.com/terms)（2026年7月30日発効）、[Google Cloud 補償対象サービス](https://cloud.google.com/terms/generative-ai-indemnified-services) |

## 音楽・音声

| ツール | 出力の権利 | 商用利用・プランの条件 | 補償 | 規約 |
|---|---|---|---|---|
| Suno | 有料プラン（Pro / Premier）で作った曲は、Sunoの権利を利用者に譲渡。無料プランの曲は個人的・非商用の利用に限る | **無料プランで作った曲は、後から有料プランにしても自動的には商用利用できるようにならない**。商用で使えるのは、承認された経路でダウンロードした曲だけで、ダウンロードできる数はプランごとに決まっている | なし。利用者がSunoを補償する | [Terms of Service](https://suno.com/terms)（2026年9月3日発効）、[ヘルプ：加入前の曲の権利](https://help.suno.com/en/articles/2425729) |
| ElevenLabs（音声合成・ボイスクローン） | 利用者が出力の権利を保持（ElevenLabsにも利用許諾を与える） | **無料利用は非商用に限る**。有料プランは商用利用できる。クローンする声は、自分の声か、権利や同意を得た声に限る。音楽生成（Eleven Music）は別の条件があり、セルフサーブの全プランで、映画・テレビ・ラジオと「複数のプラットフォームで提供し収益化するゲーム」は商用利用の対象外（[Music の個別規約](https://elevenlabs.io/eleven-music-model-specific-terms)。詳しくは [ゲームBGMのAI生成](/dev-env/ai-music/)） | なし。利用者がElevenLabsを補償する | [Terms of Service](https://elevenlabs.io/terms-of-use)（2026年3月31日更新） |

:::caution[Udio を使う場合]
Udioは2025年秋に Universal Music Group と和解しました。その後、楽曲のダウンロードを停止し、作った曲をプラットフォームの中だけで使う方式へ移る方針が報じられています（[New Industry Focus](https://newindustryfocus.com/articles/udio-allows-downloads-for-48-hours-following-umg-deal-outcry)）。
:::

## 動画・3D

| ツール | 出力の権利 | 商用利用・プランの条件 | 補償 | 規約 |
|---|---|---|---|---|
| Runway | Runwayは出力の所有権を主張しない | 出力の商用利用を制限しない。ただし入力と出力について、モデル学習を含む広い利用許諾をRunwayに与える | なし。利用者がRunwayを補償する | [Terms of Use](https://runway.com/terms-of-use)（2026年9月15日更新） |
| Meshy（3Dモデル生成） | **無料プランの出力はMeshyが所有し、CC BY 4.0 で提供される**。有料プランは利用者が所有 | 無料プランの出力を使うなら CC BY 4.0 に従ったクレジット表記が必要 | なし。利用者がMeshyを補償する | [Terms of Use](https://www.meshy.ai/terms-of-use)（2026年9月19日更新） |

トレーラー（PV）に動画生成AIを使う場合は、[AI動画生成の使いどころ](/trailer/ai-video/)も参照してください。

## コード生成

| ツール | 出力の権利 | 商用利用・プランの条件 | 補償 | 規約 |
|---|---|---|---|---|
| GitHub Copilot | GitHubは入力も出力も所有しない | 個人プランは GitHub の通常の規約で扱われる。「公開コードと一致する提案」をブロックする設定がある | Business / Enterprise などの契約に第三者請求への防御条項があれば、それが適用される。必要な対策（フィルター等）を守ることが条件 | [Generative AI Services Terms](https://github.com/customer-terms/github-generative-ai-services-terms)（2026年3月5日から） |
| Claude（Anthropic） | 個人向け・商用向けとも、Anthropicが持つ権利を利用者に譲渡 | 個人向けでは、競合サービスの開発やモデル学習への利用などを禁止 | 個人向けはなし。API・法人向けの Commercial Terms には知的財産の補償があるが、出力を改変した場合などは対象外 | [Consumer Terms](https://www.anthropic.com/legal/consumer-terms)（2025年10月8日発効）、[Commercial Terms](https://www.anthropic.com/legal/commercial-terms)（2025年6月17日発効） |
| Cursor | Anysphereが持つ権利を利用者に譲渡 | 競合モデルの開発・学習への利用を禁止 | なし。利用者がAnysphereを補償する | [Terms of Service](https://cursor.com/terms-of-service)（2026年9月3日更新） |
| OpenAI Codex | 個人で使う場合はOpenAIの個人向け規約の対象（画像生成の行を参照）。API経由では Services Agreement の対象 | 同左 | 個人向けはなし。Services Agreement には条件付きの補償条項がある | [Terms of Use](https://openai.com/policies/row-terms-of-use/)、[Services Agreement](https://openai.com/policies/services-agreement/) |

コードの場合は、権利の帰属とは別に、**既存のOSSのコードがそのまま出力されるリスク**があります。詳しくは[アセット・OSSのライセンス](/legal/licenses/)を参照してください。

## 規約を読むときのポイント

- **「所有できる」と「著作権が発生する」は別の話**: 規約で「出力は利用者のもの」とされていても、法律上の著作権が発生するとは限りません（[生成AI素材の著作権](/legal/copyright/)）。多くの規約は「法律上可能な範囲で」「権利があれば」と条件をつけています。
- **作った時点のプランが重要**: Sunoのように、無料プランで作ったものは後から有料にしても商用利用できない場合があります。商用にする予定なら、最初から有料プランで作ると安全です。
- **公開設定を確認する**: Midjourneyの初期設定のように、生成物が他人に見える状態になるサービスもあります。発表前のキャラクターデザインが先に出回るおそれがあります。
- **無料プランのライセンスを確認する**: Meshyの無料プランのように、出力に CC BY 4.0 が付く場合は、クレジット表記が必要です（[アセット・OSSのライセンス](/legal/licenses/)）。
- **規約のコピーを残す**: 素材を作った日と、その時点の規約のURL・版の日付を記録しておきます。規約が変わっても、当時の条件を説明できます。
- **API経由で使う場合**: ゲームに組み込んでプレイヤーに生成させる場合は、API規約や利用ポリシーが適用されます（[プラットフォームのAIポリシー](/legal/platform-policies/)）。

## AIの活用ポイント

- **規約の差分チェックに使う**: 規約ページを定期的に保存して、前回との差分をLLMに要約させると、改定に気づきやすくなります。
- **素材台帳を作る**: 「素材名・ツール・プラン・生成日・規約の版・加工の有無」を記録するCSVやスクリプトを、AIコーディングツールで作っておくと管理が楽になります。関連: [アセット生成](/dev-env/asset-generation/)、[AIコーディングツール](/dev-env/ai-coding-tools/)
- **販売前の確認**: 販売プラットフォームに申告するAIの使用内容は、この台帳から作れます。関連: [販売プラットフォーム](/monetization/platforms/)

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Midjourney Terms of Service](https://docs.midjourney.com/hc/en-us/articles/32083055291277-Terms-of-Service) — 出力の所有と売上100万ドルの条件
- [OpenAI Terms of Use](https://openai.com/policies/row-terms-of-use/) — 日本を含むEU以外の地域向けの個人向け規約
- [OpenAI Services Agreement](https://openai.com/policies/services-agreement/) — API・法人向けの契約（補償条項あり）
- [Adobe Firefly FAQ](https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/adobe-firefly-faq.html) — 商用利用とベータ機能
- [Stability AI Community License](https://stability.ai/community-license-agreement) — 売上100万ドル未満の無料商用利用
- [Suno Terms of Service](https://suno.com/terms) — 無料プランと有料プランの権利の違い
- [ElevenLabs Terms of Service](https://elevenlabs.io/terms-of-use) — 無料利用の非商用制限と声の権利
- [Runway Terms of Use](https://runway.com/terms-of-use) — 動画生成の出力の扱い
- [Meshy Terms of Use](https://www.meshy.ai/terms-of-use) — 無料プランの CC BY 4.0
- [GitHub Generative AI Services Terms](https://github.com/customer-terms/github-generative-ai-services-terms) — Copilotなどの法人向け規約
- [Anthropic Commercial Terms](https://www.anthropic.com/legal/commercial-terms) — API・法人向けの補償条項
- [Cursor Terms of Service](https://cursor.com/terms-of-service) — 提案コードの権利
