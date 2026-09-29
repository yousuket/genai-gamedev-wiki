---
title: 販売プラットフォーム
description: Steam、itch.io、App Store / Google Play、ブラウザゲームポータルなどの手数料・登録費・審査・日本からの税務手続きを比較します。
sidebar:
  order: 1
lastUpdated: 2026-09-29
---

## 概要

個人開発のゲームをどこで売るか（または配るか）を決めるための比較記事です。

- 主要プラットフォームごとの**手数料（プラットフォームの取り分）・登録費・審査**を一覧で比べます。
- 日本在住の開発者が最初につまずきやすい**米国税務情報（W-8BEN相当）の提出**について説明します。
- 数字はすべて公式情報で確認したもので、**2026年9月時点**の内容です。規約は頻繁に変わるので、登録前に必ず出典を確認してください。

:::caution[税務について]
この記事の税務に関する記述は一般的な情報提供であり、税務・法務の助言ではありません。実際の手続きや申告は、税理士など専門家に確認してください。
:::

## 比較表

| プラットフォーム | 主な対象 | 登録費 | プラットフォームの取り分 | 審査 |
|---|---|---|---|---|
| Steam | PCゲーム | 1タイトルごとに100ドル（売上1,000ドルで回収可） | 30%（1,000万ドル超は25%、5,000万ドル超は20%） | あり（1〜5日） |
| itch.io | PC・ブラウザ・インディー全般 | 無料 | 開発者が自由に設定（初期値10%） | 基本なし |
| App Store | iOS | 年99ドル | 30%（小規模事業者プログラムで15%）※日本は別体系 | あり |
| Google Play | Android | 1回25ドル | 最初の100万ドルまで15%、超過分30% ※日本は2026年9月30日から新体系 | あり |
| Poki | ブラウザ | 応募制 | 広告収益をPoki経由の流入は50/50、自前の流入は100%開発者 | 厳選 |
| CrazyGames | ブラウザ | 応募制 | 広告収益の分配（率は非公開） | 段階的な公開 |

（2026年9月時点。出典は各節を参照）

## Steam

PCゲームの最大手ストアです。個人でも「Steam Direct」という仕組みで直接出品できます。

- **登録費**: 1タイトルごとに100ドル。返金はされませんが、そのタイトルの調整後総収益が1,000ドルに達すると回収できます（[Steam Direct Fee](https://partner.steamgames.com/doc/gettingstarted/appfee)、2026年9月時点）。
- **取り分**: 基本30%。1タイトルの売上が1,000万ドルを超えた分は25%、5,000万ドルを超えた分は20%です（[Valveの発表](https://steamcommunity.com/groups/steamworks/announcements/detail/1697191267930157838)、2018年10月から適用）。個人開発ではほぼ30%と考えてよいでしょう。
- **審査**: ストアページとビルドを1〜5日で確認します。初回のタイトルは、登録費の支払いからリリースまで待機期間があり、さらに「近日登場（Coming Soon）」ページを**最低2週間**公開する必要があります（[オンボーディング](https://partner.steamgames.com/doc/gettingstarted/onboarding)）。
  - 待機期間はオンボーディングのページでは21日、[Steam Directの案内ページ](https://partner.steamgames.com/steamdirect)では30日と書かれており、ページによって表記が違います（2026年9月時点）。余裕を持って30日と見ておくと安全です。
- **扱えないもの**: 広告収益を主とするビジネスモデルのアプリ、NFTや暗号資産を扱うアプリなどは出品できません（[オンボーディング](https://partner.steamgames.com/doc/gettingstarted/onboarding)）。**Steamでは「広告で稼ぐ無料ゲーム」は作れない**点に注意してください。
- **AIの開示**: 生成AIを使ったゲームは、ストア申請時にAI利用の申告が必要です。詳しくは [プラットフォームのAIポリシー](/legal/platform-policies/) を参照してください。

## itch.io

インディーゲーム向けのストアです。登録も出品も無料で、試作品やゲームジャムの作品を公開する場として広く使われています。

- **料金**: 利用料は無料です（[FAQ](https://itch.io/docs/creators/faq)）。
- **取り分**: 「オープン収益分配」という方式で、開発者がitch.ioに渡す割合を0%から自由に決められます。初期値は10%です（[Payments](https://itch.io/docs/creators/payments)、2026年9月時点）。
- **決済手数料**: 取り分とは別に、PayPal・Stripeの手数料（おおむね0.30ドル＋2.9%）がかかります。itch.io自身が「2ドル以上で売る」ことを勧めています（同上）。
- **支払い方式**: 初期設定の「Collected by itch.io（itch.ioが代理で集金）」では、itch.ioが販売者となりEUのVATも処理します。支払いは購入から7日以上たった残高を、5ドル以上で申請できます（同上）。
- **価格**: 最低価格を0にして「支払いたい額を払ってもらう」形にもできます（[FAQ](https://itch.io/docs/creators/faq)）。

## App Store（iOS）

- **登録費**: Apple Developer Programは年99ドル（現地通貨での表示あり）です（[What's included](https://developer.apple.com/programs/whats-included/)、2026年9月時点）。個人で登録すると、ストア上の販売者名に本名が表示されます（[Enrollment](https://developer.apple.com/support/enrollment/)）。
- **取り分（日本以外の多くの地域）**: 30%。前年の売上が100万ドル以下の開発者は「App Store Small Business Program」に申し込むと15%になります（[What's included](https://developer.apple.com/programs/whats-included/)、[Small Business Program](https://developer.apple.com/app-store/small-business-program/)）。
- **日本のストアフロント**: 2025年12月施行のスマホソフトウェア競争促進法（いわゆるスマホ新法）への対応で、手数料が「手数料（21%、小規模事業者は10%）＋Appleの決済処理手数料5%」という体系になりました。Appleのアプリ内課金を使う場合は合計26%（小規模事業者は15%）です。外部決済や外部サイトへの誘導も選べます（[Payment options on the App Store in Japan](https://developer.apple.com/support/payment-options-on-the-app-store-in-japan/)、2026年9月時点）。
- **EU・米国**: EUは2026年8月に条件が改定され（[Appleの発表](https://www.apple.com/newsroom/2026/08/apple-announces-changes-for-apps-in-the-european-union/)）、米国のストアフロントでは外部の購入手段へのリンクが認められています（[App Review Guidelines 3.1.1(a)](https://developer.apple.com/app-store/review/guidelines/)）。地域ごとに条件が違う点に注意してください。

## Google Play（Android）

- **登録費**: 1回だけ25ドル。政府発行の身分証とクレジットカードによる本人確認があります（[Play Console Help](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en)）。
- **新規の個人アカウントの制限**: 2023年11月13日以降に作った個人アカウントは、**12人以上のテスターによる14日間連続のクローズドテスト**を終えないと一般公開できません（[テスト要件](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)）。テスター集めを早めに始めましょう。
- **取り分（従来）**: 年間売上の最初の100万ドルまで15%、超過分30%、定期購読は15%です（[Service fees](https://support.google.com/googleplay/android-developer/answer/112622?hl=en)）。
- **日本は2026年9月30日から新体系**: 最初の100万ドルまで10%（＋請求手数料）などの新しい料金体系が日本でも始まる予定です。日本での請求手数料（billing fee）の率は「追って発表」とされています（[Understanding Google Play's lower service fees](https://support.google.com/googleplay/android-developer/answer/16954621?hl=en)、2026年9月時点）。

## ブラウザゲームのポータル

HTML5（Webブラウザ）のゲームを載せて、広告収益を分け合うサイトです。**販売ではなく無料配信＋広告**が基本です。

- **Poki**: Poki経由のプレイヤーからの収益は50/50、自分のSNSやブックマーク経由で来たプレイヤーからの収益は100%開発者に入ります。条件は「Web上での独占」で、Steamやアプリストアでの販売は自由です。掲載作品は手作業で厳選されます（[Working with Poki](https://developers.poki.com/guide/working-with-poki)、2026年9月時点）。
- **CrazyGames**: まず「Basic Launch」で7〜21日間の試験公開をして、プレイ時間や継続率が基準を満たすと「Full Launch」に進み、収益分配が始まります（[CrazyGames Documentation](https://docs.crazygames.com/)）。支払いは残高100ユーロ以上で毎月です。他のプラットフォームで公開済みのゲームも載せられます（[FAQ](https://docs.crazygames.com/faq/)）。分配率は公式ドキュメントでは確認できませんでした。

## その他（概要のみ）

- **Epic Games Store**: 1製品あたり年間100万ドルまでの売上は開発者が100%受け取り、それ以降は88%（取り分12%）です（[Epic Games Storeのニュース](https://store.epicgames.com/en-US/news/epic-games-store-updates-revenue-share-keep-100-of-the-first-1m-per-product-per-year)、[Distribution](https://store.epicgames.com/en-US/distribution)）。
- **Nintendo（Switch / Switch 2）**: 個人でもNintendo Developer Portalに登録できますが、Switch向けの開発情報を見るには登録後に別途申請が必要です（[Nintendo Developer Portal](https://developer.nintendo.com/)）。家庭用ゲーム機は開発機材や審査の負担が大きいので、まずPCやスマホで実績を作るのが一般的です。

## 日本からの税務手続き

Steam・itch.io・App Store・Google Playはいずれも、**米国の税務情報（W-8BEN相当の情報）の提出**を求めます。登録画面の「税務インタビュー（tax interview）」という質問形式のフォームで入力します。

| プラットフォーム | 提出するもの | 注意点 |
|---|---|---|
| Steam | W-8BEN相当の情報 | 標準の源泉徴収率は30%。租税条約のある国の居住者は、米国または自国の納税者番号（TIN）を出すと軽減されうる。**後から番号を出しても、すでに徴収された分は返金されない**（[Tax FAQ](https://partner.steamgames.com/doc/finance/taxfaq)） |
| itch.io | 税務インタビュー | TINを出さないと、条約のある国でも30%（[Payments](https://itch.io/docs/creators/payments)） |
| App Store | W-8BEN等 | App Store Connectの質問に答えて適切なフォームを選ぶ（[Provide tax information](https://developer.apple.com/help/app-store-connect/manage-tax-information/provide-tax-information/)） |
| Google Play | W-8BEN等 | 未提出だと支払いが止まることがある（[US tax information](https://support.google.com/paymentscenter/answer/10349995?hl=en)） |

- 日本は米国と租税条約を結んでいます（[日米租税条約](https://www.irs.gov/pub/irs-trty/japan.pdf)）。日本の個人の納税者番号は<strong>マイナンバー（個人番号）</strong>です（[OECDのTIN情報](https://www.oecd.org/content/dam/oecd/en/topics/policy-issue-focus/aeoi/japan-tin.pdf)）。
- 実際に適用される率は、税務インタビューを終えた後に管理画面に表示されます。表示された率が想定と違う場合は、売上が発生する前に確認・再提出してください。
- 米国での源泉徴収とは別に、**日本での所得税・住民税の申告**が必要です。売上の規模によっては消費税の扱いも関わってきます。具体的な申告方法は税理士や税務署に確認してください。

## 選び方の目安

- **PCで売りたい** → Steamが第一候補。まずitch.ioで試作品を公開して反応を見るのも有効です。
- **無料で広く遊んでもらい、広告で稼ぎたい** → ブラウザポータルかスマホ。Steamは広告モデル不可です。
- **スマホで課金したい** → 年会費・テスト要件・地域ごとの手数料の違いを踏まえて準備します。課金設計は [広告・アプリ内課金](/monetization/ads-and-iap/) を参照してください。
- 複数のストアで売る場合、SteamのEarly Access（早期アクセス）では「他のストアより高くしない」などのルールがあります。価格は [価格設定](/monetization/pricing/) で詳しく扱います。

## AIの活用ポイント

- **規約の読み込み補助**: 長い配信契約や審査ガイドラインをAIに要約させ、「広告は可か」「外部決済へのリンクは可か」などを質問するのは効率的です。ただしAIの要約は誤ることがあるので、**重要な判断は必ず原文で確認**してください。
- **税務インタビューの下調べ**: 用語（TIN、源泉徴収、租税条約）の意味をAIに説明させるのは有用です。ただし入力内容の最終判断は専門家に確認しましょう。
- **ストア文言の翻訳**: ストアページの多言語化にAI翻訳を使えます。ネイティブによる確認を挟むと安全です。
- **AI生成物の開示**: Steamなどは生成AIの利用申告を求めます。詳しくは [プラットフォームのAIポリシー](/legal/platform-policies/) を参照してください。

## 最新情報

:::note[自動更新]
この欄は情報収集エージェントが毎週更新しています。
:::

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Steam Direct](https://partner.steamgames.com/steamdirect) — Steamへの出品要件
- [Steamworks: オンボーディング](https://partner.steamgames.com/doc/gettingstarted/onboarding) — 登録からリリースまでの手順
- [Steamworks: Tax FAQ](https://partner.steamgames.com/doc/finance/taxfaq) — 源泉徴収と税務フォーム
- [itch.io: Payments](https://itch.io/docs/creators/payments) — 収益分配・支払い・税務
- [Apple: Payment options on the App Store in Japan](https://developer.apple.com/support/payment-options-on-the-app-store-in-japan/) — 日本のストアフロントの手数料
- [Apple: App Store Small Business Program](https://developer.apple.com/app-store/small-business-program/) — 小規模事業者向けの15%
- [Google Play: Understanding lower service fees](https://support.google.com/googleplay/android-developer/answer/16954621?hl=en) — 新料金体系と地域ごとの開始日
- [Working with Poki](https://developers.poki.com/guide/working-with-poki) — Pokiの収益分配と独占条件
- [CrazyGames Documentation](https://docs.crazygames.com/) — 公開の流れ
