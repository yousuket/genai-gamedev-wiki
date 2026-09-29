---
title: "どこで動かすか、どこで公開するか：公開先の選び方"
description: 自分のURL、itch.io、ブラウザゲームのポータル、PWA、Google Play、App Store、Steamを、手間・費用・審査・収益化・向くゲームで比べ、段階的な公開の道筋を示します。
sidebar:
  order: 1
lastUpdated: 2026-09-29
---

## 概要

作ったブラウザゲームを、どこで動かし、どこで公開するかを決めるための記事です。

- 公開先を「自分のURL」「[itch.io](https://itch.io/)」「ポータル」「PWA」「Android」「iOS」「[Steam](https://store.steampowered.com/)」「コンソール」の8つに分け、手間・費用・審査・遊ばれ方・収益化・向くゲームで比較します。
- 最短の道筋は「まずWebで公開して反応を見て、必要なら次の場所へ」です。段階の進め方と判断の流れを示します。
- 公開先を決める前に、マルチプレイのサーバー、縦画面、セーブデータ、音の自動再生、性能、入力、生成AIの扱いを確認します。
- 費用の数字は [販売プラットフォーム](/monetization/platforms/) に、アプリ化の手順は [Webゲームをアプリにする](/publish/web-to-app/) に任せ、ここでは選び方に絞ります。

## 8つの公開先を比べる

情報は2026年9月時点です。根拠は次の節で示します。

### 手間・費用・審査

| 公開先 | 手間 | 費用 | 審査 |
|---|---|---|---|
| ① 自分のURL（静的ホスティング） | 小。ビルドして置くだけ | 無料枠あり | なし |
| ② [itch.io](https://itch.io/) | 小。ZIPを上げる | 無料 | 基本なし |
| ③ ポータル（[Poki](https://poki.com/)、[CrazyGames](https://www.crazygames.com/)など） | 中。SDKの組み込みと審査 | 無料 | あり。厳選 |
| ④ PWA | 小〜中。マニフェストを足す | 無料 | なし |
| ⑤ Android | 中〜大 | [Google Play](https://play.google.com/console/about/)は1回25ドル | Google Playはあり |
| ⑥ iOS | 大 | 年99ドル | あり |
| ⑦ [Steam](https://store.steampowered.com/) | 大 | 1タイトル100ドル | あり |
| ⑧ コンソール | 最大 | 開発機材と審査の負担が大きい | あり |

### 遊ばれ方・収益化・向くゲーム

| 公開先 | 遊ばれ方 | 収益化 | 向くゲーム |
|---|---|---|---|
| ① 自分のURL | URLを開けば遊べる。集客は自分 | 自前で実装。ホスティングの規約に左右される | 何でも。最初の公開先 |
| ② [itch.io](https://itch.io/) | インディー好きが集まる。ゲームジャムが多い | HTML5は寄付形式。売るならダウンロード版 | 試作、ジャムの作品 |
| ③ ポータル | ポータルの来訪者に遊ばれる | 広告収益の分配 | 軽くて短く遊べるゲーム |
| ④ PWA | ホーム画面のアイコンから起動 | ①と同じ | 繰り返し遊ぶスマホ向けゲーム |
| ⑤ Android | ストアで検索される | 課金・広告 | スマホ中心のゲーム |
| ⑥ iOS | ストアで検索される | 課金・広告 | スマホ中心のゲーム |
| ⑦ [Steam](https://store.steampowered.com/) | PCゲーマーに遊ばれる | 販売 | PCで腰を据えて遊ぶゲーム |
| ⑧ コンソール | 家庭用ゲーム機 | 販売 | 実績を積んだ後の選択肢 |

## 各公開先の要点

### ① 自分のURL

[GitHub Pages](https://pages.github.com/)、Cloudflare、[Netlify](https://www.netlify.com/) などの静的ホスティングに、ビルドした `dist` を置きます。手順と各社の無料枠・規約は [Webゲームを手軽に公開できるサービス](/publish/web-hosting/) にまとめています。審査がなく、URLを送ればすぐ遊んでもらえるのが強みです。

### ② itch.io

無料で使え、商用のプロジェクトも置けます（[FAQ](https://itch.io/docs/creators/faq)、2026年9月時点）。HTML5のゲームは、ZIPに `index.html` を入れて上げます。展開後1,000ファイルまで、合計500MBまで、1ファイル200MBまでです（[HTML5のドキュメント](https://itch.io/docs/creators/html5)）。

HTML5のゲームは、プレイヤーからの支払いが寄付の形に限られます。購入してもらうには「Downloadable」の扱いにします（同上）。詳しくは [itch.ioで公開する](/publish/itch-io/) を参照してください。

### ③ ブラウザゲームのポータル

ポータルは、他人のゲームを集めて広告を出し、収益を開発者と分けるサイトです。

| ポータル | 応募から公開まで | 収益 | 独占 |
|---|---|---|---|
| [Poki](https://poki.com/) | 動作するWebビルドを上げ、内容の審査、プレイテストを経る。最終審査に1〜2週間、承認後の公開作業に2〜3か月 | Poki経由の来訪者は50/50、自分の経路の来訪者は100%開発者 | Web上のみ独占。[Steam](https://store.steampowered.com/)やアプリストアは自由 |
| [CrazyGames](https://www.crazygames.com/) | まず「Basic Launch」で7〜21日試験公開。基準を満たすと、SDKを組み込む「Full Launch」へ | Full Launchで広告収益の分配。残高が100ユーロ以上で毎月支払い | 独占なし。[itch.io](https://itch.io/)やSteamとの併売も収益分配に影響しない |

出典: [Working with Poki](https://developers.poki.com/guide/working-with-poki)、[Adding your game](https://developers.poki.com/guide/adding-your-game)、[Final review](https://developers.poki.com/guide/final-review)、[CrazyGames Documentation](https://docs.crazygames.com/)、[CrazyGames FAQ](https://docs.crazygames.com/faq/)。

収益を分け合う仕組みではなく、作品を見てもらう場としての性格が強いサイトもあります。

- **[Newgrounds](https://www.newgrounds.com/)**: 無料のアカウントで、HTML5のZIPを上げて公開できます（手順は [GDevelopの解説](https://gdevelop.io/page/how-to-publish-your-game-on-newgrounds-and-why-you-should-do-it) による）。投稿のルールは [Game Guidelines](https://www.newgrounds.com/wiki/help-information/terms-of-use/game-guidelines) にあり、AIの扱いは後の節にまとめます。
- **[Game Jolt](https://gamejolt.com/)**: ゲームのページを作り、ブラウザ用のビルド（HTMLなど）をパッケージの中に上げます。ゲームジャムの主催機能もあります（[Add your game](https://gamejolt.com/help-docs/creators/add-game)）。

Pokiは、審査の前に「プロトタイプでもよい」としています（[Adding your game](https://developers.poki.com/guide/adding-your-game)）。完成品でなくても応募できます。

### ④ PWA

PWA（Progressive Web App）は、Webサイトをアプリのようにホーム画面に置けるようにする仕組みです。Chrome系のブラウザでは、マニフェストに名前、192pxと512pxのアイコン、`start_url`、`display` を書くとインストールできます。iOS 16.4以降は、Safariのほか、Chrome、Edge、Firefoxの共有メニューからもホーム画面に追加できます。サービスワーカーは、インストールの条件ではありません（[MDN: Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)）。

Safariは、ユーザーが7日間触れなかったサイトのlocalStorageやIndexedDBを消します。ホーム画面に追加したWebアプリは、この対象から外れます（[WebKit: Tracking Prevention](https://webkit.org/tracking-prevention/)）。セーブデータを端末に持つゲームでは、PWA化にこの利点があります。

### ⑤ Android

- **[Google Play](https://play.google.com/console/about/)**: 登録費は1回25ドルです。2023年11月13日以降に作った個人アカウントは、12人以上のテスターによる14日間のクローズドテストが必要です（詳しくは [販売プラットフォーム](/monetization/platforms/)）。
- **Webゲームを包む**: Trusted Web Activity は、PWAをAndroidアプリから全画面で開く仕組みです。Digital Asset Links でアプリとサイトの持ち主が同じことを確認し、Chrome 72以上が必要です。BubblewrapというCLIでプロジェクトを作れます（[Chrome for Developers](https://developer.chrome.com/docs/android/trusted-web-activity/overview)）。ネイティブの機能が要るときは、[Capacitor](https://capacitorjs.com/) があります（[Capacitor](https://capacitorjs.com/docs)）。
- **直接配布**: APKを自分のサイトで配ること（サイドロード）は、引き続き可能です。ただしGoogleは開発者確認の制度を進めていて、2026年9月30日にブラジル、インドネシア、シンガポール、タイで、Google Playなど認定ストア経由のインストールに対して始まります。2027年以降は、認定されたAndroid端末すべてに広がる予定です。友人内の配布向けには、ID確認と登録費が不要で、最大20台の端末に配れる「限定配布アカウント」があります（[Android Developer Verification](https://developer.android.com/developer-verification/guides)）。

### ⑥ iOS

- 個人の登録は年99ドルで、ストア上の販売者名は本名になります。自分の端末にXcodeで入れて試すだけなら、登録は要りません（[Apple: Enrollment](https://developer.apple.com/support/enrollment/)）。
- [TestFlight](https://developer.apple.com/testflight/)では、外部のテスターを最大10,000人まで招待でき、ビルドの有効期間は90日です。グループへの最初のビルドは、App Reviewを通る必要があります（[TestFlight Overview](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/)）。
- ガイドライン4.2は、アプリに「Webサイトの再パッケージを超える機能・内容・UI」を求めます。Webサイトをそのまま包んだだけのアプリは、審査で通りにくくなります（[App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)）。

### ⑦ Steam

登録費は1タイトル100ドルで、「近日登場」のページを最低2週間公開する必要があります。広告収益を主とするアプリは出品できません（詳しくは [販売プラットフォーム](/monetization/platforms/)）。ブラウザゲームは、[Electron](https://www.electronjs.org/)や[Tauri](https://tauri.app/)などでデスクトップアプリに包んで出します。Electronは、ChromiumとNode.jsを同梱してWindows、macOS、Linuxで動かします（[Electron](https://www.electronjs.org/docs/latest/)）。Tauriは、OSのWebViewを使うので、最小のアプリは600KB未満です（[Tauri](https://v2.tauri.app/start/)）。Steamの準備は [ウィッシュリストの集め方](/monetization/wishlists/) も参照してください。

### ⑧ コンソール

個人でもNintendo Developer Portalに登録できますが、Switch向けの開発情報を見るには、登録後の別の申請が必要です（[Nintendo Developer Portal](https://developer.nintendo.com/)）。まずWebとPCで実績を作ってから考える先です。

## 段階で進める

いきなりストアを目指さず、手間の小さい順に進めます。

| 段階 | やること | 分かること |
|---|---|---|
| 1 | 自分のURLに置いて、知り合いに送る | 動くか。スマホで遊べるか |
| 2 | [itch.io](https://itch.io/)に置く。ゲームジャムに出す | 知らない人が遊ぶか。感想が来るか |
| 3 | ポータルに応募する。またはPWAにする | 広告収益の見込み。繰り返し遊ばれるか |
| 4 | アプリストアか[Steam](https://store.steampowered.com/)に出す | 課金してもらえるか |

段階を上がるごとに、手間と費用が増えます。前の段階で反応が弱ければ、次へ進まずに、ゲームを直します。コンテストやゲームジャムは、段階1〜2を締め切り付きで済ませる機会になります。締め切りがあると、公開まで到達しやすくなります。募集の探し方は [ゲームジャムの探し方](/publish/game-jams/) と [イベントカレンダー](/publish/events-calendar/) を参照してください。

## 判断の流れ

上から順に、当てはまるものを選びます。

1. **まず誰かに遊んでほしい** → ①か②。URLを1本送れる状態を最初に作る
2. **有料で売りたい** → ブラウザ単体は不向き。PCなら[Steam](https://store.steampowered.com/)、スマホならアプリストア、少額の試験販売なら[itch.io](https://itch.io/)のダウンロード版
3. **広告で稼ぎたい** → ③のポータル。Steamは広告モデルを受けつけない。①の無料枠は、広告を禁じるものがある（[Webゲームを手軽に公開できるサービス](/publish/web-hosting/)）
4. **スマホのアイコンから起動させたい** → ④。ストア上の露出が必要なら⑤⑥
5. **PCのゲームとして棚に置きたい** → ⑦。まずウィッシュリストを集める

広告や課金の設計は [広告とアプリ内課金](/monetization/ads-and-iap/) と [価格設定](/monetization/pricing/) を参照してください。

## 公開先を決める前に確認する技術面

同じゲームでも、公開先によって動かないことがあります。設計の早い段階で、次の6点を確かめます。

| 項目 | 起きること | 公開先ごとの事情 |
|---|---|---|
| マルチプレイのサーバー | 静的ホスティングにはサーバーがなく、リアルタイム通信は動かない | 外部のAPIやWebSocketには、HTTPSでつなぐ。[itch.io](https://itch.io/)はHTTPSを求める（[HTML5のドキュメント](https://itch.io/docs/creators/html5)）。サーバーの選び方は [Webゲームを手軽に公開できるサービス](/publish/web-hosting/) |
| 縦画面・画面サイズ | 縦持ちのスマホで崩れる | [Poki](https://poki.com/)はデスクトップ、モバイル、タブレットのすべてで動くことを求め、モバイルでは縦か横で全画面に表示する（[Requirements](https://developers.poki.com/guide/requirements-quality)）。[CrazyGames](https://www.crazygames.com/)は向きを申請時に選べる（[Technical](https://docs.crazygames.com/requirements/technical/)） |
| セーブデータ | ブラウザごと・端末ごとに別になる。Safariは7日で消すことがある | PWAなら消えない。CrazyGamesのFull Launchは、SDK経由のデータ保存を含める |
| 音の自動再生 | ユーザーが触る前は音が鳴らない | AudioContextは操作の後に `resume()` する（[MDN: Autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)）。iOSはバックグラウンドに回ると音が止まるので、タッチで再開する（CrazyGamesのTechnical）。Pokiは広告中に音をミュートすることを求める |
| 性能・容量 | 読み込みが長いと離脱する | Pokiは、10秒を超える読み込みで離脱が増えるとする。CrazyGamesの基準は、初回のダウンロード50MB以下、全体250MB以下、1,500ファイル以下 |
| 入力 | キーボードだけだとスマホで遊べない | CrazyGamesはマウス、キーボード、（モバイル対応なら）タッチを求める。Pokiはタブレットでモバイルの操作にする |

## 生成AIの扱いは公開先で違う

AIで作ったゲームへの態度は、公開先ごとに異なります（2026年9月時点）。

| 公開先 | 方針 |
|---|---|
| [itch.io](https://itch.io/) | 生成AIを使った素材を含むプロジェクトは、ページの「AI Disclosure」で申告する。守らないと掲載から外されることがある（[Quality guidelines](https://itch.io/docs/creators/quality-guidelines)） |
| [Poki](https://poki.com/) | AIは補助として認める。ただし非独創的な素材への依存が高いほど、テストの後に採用されない危険が上がる（[Content & player safety](https://developers.poki.com/guide/content-player-safety)） |
| [Newgrounds](https://www.newgrounds.com/) | AIへのプロンプトで生成したゲームは共有しないよう明記している。AIを使った場合は作者コメントで開示する（[Game Guidelines](https://www.newgrounds.com/wiki/help-information/terms-of-use/game-guidelines)） |
| [Steam](https://store.steampowered.com/) | 申告が必要。[プラットフォームのAIポリシー](/legal/platform-policies/) を参照 |

エージェントで作ったゲームを出すなら、公開先ごとの条件に合わせて、どこまで人が手を入れたかを整理しておきます。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [itch.io: HTML5 games](https://itch.io/docs/creators/html5) — HTML5のアップロード要件と支払いの扱い
- [itch.io: Quality guidelines](https://itch.io/docs/creators/quality-guidelines) — 生成AIの申告
- [Poki for Developers](https://developers.poki.com/guide/working-with-poki) — 収益分配、独占、応募の流れ
- [CrazyGames Documentation](https://docs.crazygames.com/) — Basic LaunchとFull Launch、技術要件
- [Game Jolt: Add your game](https://gamejolt.com/help-docs/creators/add-game) — ゲームページの作成とビルドのアップロード
- [Newgrounds: Game Guidelines](https://www.newgrounds.com/wiki/help-information/terms-of-use/game-guidelines) — 投稿のルールとAIの扱い
- [MDN: Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) — インストールの条件
- [WebKit: Tracking Prevention](https://webkit.org/tracking-prevention/) — Safariの7日のストレージ上限とホーム画面Webアプリの例外
- [Chrome for Developers: Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity/overview) — PWAをAndroidアプリとして出す仕組み
- [Android Developer Verification](https://developer.android.com/developer-verification/guides) — 開発者確認の時期と限定配布アカウント
- [Apple: TestFlight Overview](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/) — テスターの上限と有効期間
- [Apple: App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) — 4.2の最小限の機能
- [Capacitor](https://capacitorjs.com/docs) — WebアプリをiOS・Androidに包む
- [Electron](https://www.electronjs.org/docs/latest/) / [Tauri](https://v2.tauri.app/start/) — Webゲームのデスクトップアプリへのパッケージ化
