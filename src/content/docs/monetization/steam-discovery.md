---
title: Steamの「発見」の仕組みと割引枠のアルゴリズム化
description: 2027年初めに予定されているSteamの「割引とイベント」タブのアルゴリズム化と、ウィッシュリスト・おすすめ・新作キュー・Next Fest・タグなどの発見経路、ストアページで整えること、AIの使いどころをまとめます。
sidebar:
  order: 6
lastUpdated: 2026-10-05
---

## 概要

[Steam](https://store.steampowered.com/)で遊んでもらうには、まず「見つけてもらう」必要があります。2026年9月29日、Valveは「割引とイベント（Discounts & Events）」タブの手動キュレーション（Valveの担当者が枠に載せるゲームを選ぶ運用）をやめ、2027年初めにユーザーごとのアルゴリズム表示へ移すと発表しました。

この記事では次のことが分かります。

- 何が発表され、何がまだ決まっていないか
- Steamの発見経路ごとに、誰が表示を決め、個人開発者に何ができるか
- アルゴリズム化で変わりそうなこと（Valveの説明と、この記事の推測を分けて）
- ストアページで今から整えておくこと

ウィッシュリストの集め方は [ウィッシュリストの集め方](/monetization/wishlists/)、割引のルールは [価格設定](/monetization/pricing/)、ストアへの出品条件は [プラットフォーム比較](/monetization/platforms/) にあります。この記事は、それらを「どこで見つけてもらうか」の視点でつなぎます。

## 発表の内容（2026年9月29日）

Valveが [Steamworksのお知らせ](https://steamcommunity.com/groups/steamworks/announcements/detail/676258795703240952) で説明した内容です（2026年10月時点）。

| 項目 | 内容 |
|---|---|
| 時期 | 2027年初めに、キュレーションの暦（カレンダー）を完全にやめる予定。確定日はなく、詳細は数週間以内に案内するとしている |
| 変わること | 「割引とイベント」の表示が、手動のカレンダーから、顧客ごとに動的に変わる表示へ移る |
| 現在の運用 | Valveまたはパートナー（[Steamworks](https://partner.steamgames.com/)経由）が日程を決める枠で構成されている |
| 停止済み | Weekend Deal、Midweek Deal、Daily Deal の新規スケジュール（キュレーション枠）は停止中 |
| 予約済みの枠 | すでに予約済みのWeekend／Midweek／Daily Dealは予定どおり表示され、開発者の操作は不要 |
| 新しい仕組み | 割引とセールイベントを管理する、新しい・更新されたツールを用意する予定 |
| Valveの見方 | 今回は完璧ではないかもしれないが、顧客にも開発者にも良い結果になると考えている |

**Valveが挙げた数字**は次の2点です。

- ここ数か月、一部のキュレーション枠を個人化したおすすめに置き換える実験をした。その結果、このセクションで1日に顧客へ見せるゲームの数が10倍になった。
- その結果として、ストアページの訪問、ウィッシュリスト追加、カート追加が「意味のある増加」を見せた。

お知らせには、10倍の比較対象（以前の何と比べたのか）、実験の期間・対象の範囲、ストアページ訪問などの増加率は書かれていません。「10倍」は表示されるゲームの本数の話で、1本あたりの訪問が10倍になったという意味ではありません。

**発表が触れていないこと**もあります。テーマ別セール（Fest）、四季のシーズナルセール、Steam Next Festについては、このお知らせに記述がありません。割引のルール（30日の間隔など）についても変更の記載はなく、2026年10月5日時点で [Discounting](https://partner.steamgames.com/doc/marketing/discounts) のページはキュレーション枠を含む従来の説明のままです。

### 外部で観測されたこと

Game Developer（[報道](https://www.gamedeveloper.com/pc/steam-s-discounts-and-events-tab-will-soon-be-fully-algorithm-driven)）によると、次の動きがありました。

- 9月上旬、GameDiscoverCoのSimon Carless氏が、このタブの表示が個人化されていることに気づき、小さな開発者に有利な動きだと評価した。
- Hooded HorseのTim Bender氏はLinkedInで、あるゲーム（タイトル非公表）について、このタブ経由のストアページ訪問が1か月で7,000件を超え、過去6か月の合計は7,355件だったと書いた。「それ以前の5か月はわずか14件」とも述べ、ニッチなインディーにとって存在しなかった流入源が、ストア内で最大になったと評価している。

これは1本のゲームについての本人の報告で、条件（ジャンル、割引の有無、期間）は分かりません。参考値として読んでください。

## 発見の経路を整理する

[Steamworks](https://partner.steamgames.com/)のドキュメントから、主な経路を整理します（2026年10月時点）。「誰が決めるか」の列が、自分で動かせる範囲の目安になります。

| 経路 | 誰が決めるか | 個人開発者ができること |
|---|---|---|
| ウィッシュリスト通知 | 登録者がいれば自動。発売時、20%以上の割引時（最も安いパッケージを含み、8時間超）、デモ公開時に通知が出る（[Wishlists](https://partner.steamgames.com/doc/marketing/wishlist)） | ストアページを早く公開する。通知の仕組みは [ウィッシュリストの集め方](/monetization/wishlists/) |
| 割引とイベント | 2027年初めまでは一部をValveが選定。その後は顧客ごとのアルゴリズムへ（上の発表） | 割引を設定して、表示される条件を整える |
| 新作キュー・新作一覧 | アルゴリズム。発売直後のゲームのプールから、閲覧数が少ないものを優先して各ユーザーのキューに入れる。タグ等で除外されることもある（[Visibility](https://partner.steamgames.com/doc/marketing/visibility)） | タグを正確に付ける。ページの完成度を発売前に上げる |
| おすすめ、More Like This | アルゴリズム。タグの重なり、言語、購入・プレイの状況などを使う（同上、[Steam Tags](https://partner.steamgames.com/doc/store/tags)） | タグ、対応言語、ストアページの内容 |
| ディスカバリーキュー | アルゴリズムによる個人化。トレーラーに10秒未満で印象づける必要があるとValveは説明している（[Trailers](https://partner.steamgames.com/doc/store/trailer)） | トレーラーの冒頭、カプセル画像 |
| トップセラー、タグ別ページ | 売上のみ。手動の編集はない。直近24時間の売上に、直近3時間を重く見る（[Top Sellers Lists](https://partner.steamgames.com/doc/store/top_sellers)） | 売上を作る。DLCや課金も含まれる |
| Next Fest、テーマ別セール | Next Festは登録制で、登録時の2カテゴリとタグで分類される（[Tips](https://partner.steamgames.com/doc/marketing/upcoming_events/nextfest/tips)）。テーマ別セールはタグとストアページの内容を見て、Valveが自動で招待する（[Themed Sales](https://partner.steamgames.com/doc/marketing/upcoming_events/themed_sales)） | デモを公開する。タグをテーマに合わせて正直に付ける |
| 更新の告知（Update Visibility Round） | 開発者が開始する。ライブラリやウィッシュリストにゲームがあるユーザーに、ホームで最大30日表示。1本あたり最初は5回で、売れているタイトルには追加されることがある（[Update Visibility Rounds](https://partner.steamgames.com/doc/marketing/visibility/update_rounds)） | 大型更新に合わせて使う。発売直後の期間が終わってから |
| [Steam](https://store.steampowered.com/)の外（SNS、配信者、キュレーター、広告） | 自分 | [SNS向けショート動画](/trailer/social-shorts/)、Curator Connect。外部広告の成果は [UTM Analytics](https://partner.steamgames.com/doc/marketing/utm_analytics) で測れる（[Advertising on Steam](https://partner.steamgames.com/doc/marketing/advertising)） |

Steam内に有料の広告枠はありません。Valveは、表示を買うことはできないと明記しています（[Visibility](https://partner.steamgames.com/doc/marketing/visibility)、[Advertising on Steam](https://partner.steamgames.com/doc/marketing/advertising)）。

### Valveが「効く」「効かない」と書いている要素

[Visibility](https://partner.steamgames.com/doc/marketing/visibility) のページに、アルゴリズムによる表示への影響が整理されています。

- 効く: 購入とプレイ（売れていて遊ばれていること）、対応言語（ユーザーの言語に対応しているゲームが優先される）、タグ。
- ほとんど効かない: ウィッシュリスト（Popular Upcomingなど一部を除く）、ストアページへのアクセス数、ストアページの購入転換率。
- 一定以上なら効かない: レビュースコア。「Mixed（賛否両論）」以上（40%以上）なら要素にならず、「Mostly Negative」まで下がると表示されにくくなる。

注意点は、これが現行の説明であることです。割引とイベントの新方式が同じ要素を使うかどうかは、発表に書かれていません。一方、ウィッシュリストのページは、ウィッシュリストに入れたゲームがユーザー個人の画面に「ウィッシュリスト登録済み」の目印つきで出ることがあると説明しています（[Wishlists](https://partner.steamgames.com/doc/marketing/wishlist)）。全体の順位には効かなくても、登録した本人には見えやすくなります。

## アルゴリズム化で何が変わりうるか

上の事実を踏まえた、この記事の推測です。確定した情報ではありません。

- 推測ですが、枠を得るための交渉や売り込みは意味を失います。従来、Valveはキュレーション枠について、プレイ数や売上の多いゲームを中心に選ぶ方針で、過去数か月の売上が数十万ドル規模のゲームには相談を呼びかけていました（[Discounting](https://partner.steamgames.com/doc/marketing/discounts)）。個人開発者の新作には、枠の入口が狭かったと考えられます。
- 推測ですが、「いつ、どれだけ割引するか」が表示の機会に直結します。割引のページは、割引中のゲームが、タグ、人気、ユーザーへの推薦度に基づいて「特売」系のセクションに出ると説明しています。割引を設定しないと、このタブの表示対象にもなりにくいと考えるのが自然です。
- 推測ですが、タグの質で差がつきます。おすすめがタグの重なりで決まるため、ジャンルの見極めが、ニッチなプレイヤーに届くかどうかを左右しそうです。
- 推測ですが、掲載の本数が増えるほど、競合も増えます。表示されても、カプセル画像、トレーラー、レビューで選ばれなければ訪問も売上も増えません。入口が広がるぶん、ストアページの質の差が結果に出やすくなります。
- 割引の間隔のルール（割引の終了から次の割引まで30日。シーズナルセールは例外）が変わるかどうかは不明です。表示の機会が増えても、回数の上限がある可能性があります。

新しい運用の詳細は、Valveが数週間以内に案内するとしています。細部が出るまでは、割引を増やす・減らすといった大きな判断を急がず、ストアページの整備に時間を使うのが安全です。

## ストアページで整えること

アルゴリズムで選ばれる前提では、ストアページ自体が営業担当になります。Valveのドキュメントにある推奨を、優先度の高い順に挙げます（2026年10月時点）。

### タグ

- 発売前に最低5つ、推奨は最大20個まで付けます。公開されて表示に使われるのは上位20個です（[Steam Tags](https://partner.steamgames.com/doc/store/tags)）。
- 上位5つがゲームの説明に使われます。一部のフィルターは上位15個を優先します。
- 「Action」のような多くのゲームに付く語より、「Party-Based RPG」のように少ない語のほうが、おすすめでの類似判定に強く働きます。
- Tag Wizardの「Suggest Prioritization」は、サブジャンルを上に、「Indie」「Singleplayer」のような情報量の少ない語を下に並べる簡易的な機能で、出発点として使えます。
- ユーザーが付けたタグも重みに混ざります。実態に合わないタグは削除できます。

### カプセル画像とスクリーンショット

カプセル画像とは、ストアの一覧やおすすめに並ぶ見出し画像です（[Store Graphical Assets](https://partner.steamgames.com/doc/store/assets/standard)）。

- ヘッダーカプセルは920×430px。ゲームの内容が分かるキーアートとロゴで、タイトル以外の文字は入れません。
- 小カプセル（462×174px）は検索結果、トップセラー、新作などの一覧で使われます。小さくてもロゴが読めることが条件です。
- スクリーンショットは5枚以上、1920×1080px以上。ゲーム中の画面だけを使い、コンセプトアートや宣伝文は入れません。
- 全年齢向けに適した画像を4枚以上マークしないと、ホームでの一部の表示に出ないことがあります。

### 紹介文

[Store Page Written Description](https://partner.steamgames.com/doc/store/page/description) の要点です。

- 短い紹介文は数百文字以内のプレーンテキストで、ほかのゲームとの違いを書きます。ジャンルを入れるとよいとされています。「発売中」「○月○日発売」のような時期の文言は入れません。
- 「About This Game」は壁のような長文を避け、太字の見出しで流し読みできるようにします。ゲームやジャンルに詳しくない人向けに、業界用語を減らします。
- GIFとスクリーンショットの合計は15MB以下にします。他サイトへのリンクや[Steam](https://store.steampowered.com/)の画面に似せた画像は禁止です。

### トレーラー

仕様は [Steamトレーラーの要件](/trailer/steam-trailer/)、構成は [PVの構成](/trailer/structure/) を参照してください。Valveは、1本目をゲームプレイ中心にすること、音声なしでも伝わることを勧めています（[Trailers](https://partner.steamgames.com/doc/store/trailer)）。

### デモ、言語、レビュー

- デモは、ストアページの購入ボタンの上に表示する設定にできます。デモは本編のタグを引き継ぎます（[Demos](https://partner.steamgames.com/doc/store/application/demos)、[Next Fest Tips](https://partner.steamgames.com/doc/marketing/upcoming_events/nextfest/tips)）。
- ストアページは言語ごとに翻訳でき、Steamの利用者の60%以上が英語以外の言語を使っています。地域別のウィッシュリストを見て、翻訳の優先度を決める方法も案内されています（[Localization and Languages](https://partner.steamgames.com/doc/store/localization)）。
- レビューについては、報酬と引き換えに依頼すること、ゲーム内でレビューを促すことが禁止されています（[User Reviews](https://partner.steamgames.com/doc/store/reviews)）。

### 計測する

[Steamworks](https://partner.steamgames.com/)の「Marketing & Visibility」にある「Store & Steam Platform Traffic Breakdown」で、どの場所で何回表示され（インプレッション）、何回ストアページが開かれたか（訪問）を見られます（[Store and Platform Traffic Reporting](https://partner.steamgames.com/doc/marketing/traffic_reporting)）。アルゴリズム化の後、「割引とイベント」からの流入が増えたかどうかは、ここで確かめられます。

## AIの活用ポイント

- **短い紹介文の下書き**: 次のように、ゲームの特徴と制約を渡します。
  ```text
  次のゲームのSteam短い紹介文を、日本語と英語で各5案作ってください。
  条件: 数百文字以内、プレーンテキスト、ジャンルを入れる、
  「発売中」などの時期の文言は入れない、ほかのゲームとの違いを1つ入れる。
  ゲームの概要: （コアループ、特徴、似たゲーム、遊ぶ人の想定）
  ```
- **タグ選び**: 似たゲーム5〜10本のタグ一覧を貼り付け、自分のゲームの説明を添えて、ジャンル、見た目、テーマ、機能に分けた候補を30個ほど出させます。「多くのゲームに付く語」と「少ない語」を分けて並べさせ、上位5つの順序案も作らせると、Tag Wizardで調整しやすくなります。
- **ストアページの自己評価**: 紹介文、タグ、スクリーンショットの説明を貼り、「初めてこのジャンルを見る人が、10秒で何のゲームか分かるか」「Valveの紹介文の推奨に反している点はないか」を点検させます。他人の視点を得る目的で、「まったく知らないプレイヤー」「ジャンルのファン」と複数の立場で読ませると差が出ます。
- **割引計画**: 発売日、これまでの割引の終了日、値上げの有無、予定している大型更新の日を渡し、30日ルールに反しない割引日程の案を作らせます。新方式の詳細が出たら、その内容も渡して作り直します。
- **トラフィックの分析**: 「Traffic Breakdown」からダウンロードできるデータ（インプレッション、訪問、クリック率）を貼り、表示の多い場所とクリック率の低い場所を洗い出させます。クリック率が低ければ、カプセル画像の見直しが候補になります。
- **レビューの傾向の整理**: 自分のゲームのレビューを貼り、期待と実際のズレ（ストアページの約束と中身の違い）がどこにあるかを分類させます。結果は、紹介文やスクリーンショットの修正に使えます。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-10-05**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Steamworks: Upcoming Changes to the Discounts & Events Section on Steam](https://steamcommunity.com/groups/steamworks/announcements/detail/676258795703240952) — 2026年9月29日のValveの発表
- [Game Developer: Steam's discounts and events tab will soon be fully algorithm-driven](https://www.gamedeveloper.com/pc/steam-s-discounts-and-events-tab-will-soon-be-fully-algorithm-driven) — 発表の報道と外部の観測
- [Steamworks: Visibility on Steam](https://partner.steamgames.com/doc/marketing/visibility) — 表示に効く要素と効かない要素
- [Steamworks: Discounting](https://partner.steamgames.com/doc/marketing/discounts) — 割引の種類とルール
- [Steamworks: Steam Tags](https://partner.steamgames.com/doc/store/tags) — タグと表示・おすすめの関係
- [Steamworks: Store Graphical Assets](https://partner.steamgames.com/doc/store/assets/standard) — カプセル画像とスクリーンショットの規格
- [Steamworks: Store Page Written Description](https://partner.steamgames.com/doc/store/page/description) — 紹介文の推奨とルール
- [Steamworks: Store and Platform Traffic Reporting](https://partner.steamgames.com/doc/marketing/traffic_reporting) — 表示と訪問の計測
