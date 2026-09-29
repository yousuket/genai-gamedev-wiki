---
title: "Webゲームをアプリにする：PWA、ラッパー、ストア"
description: ブラウザで動くゲームをアプリにする道筋を、手間の小さい順（PWA、Capacitor などのラッパー、エンジンの書き出し）に整理し、App Store と Google Play の登録、審査、テスト配信の条件を公式資料で確認します。
sidebar:
  order: 4
lastUpdated: 2026-09-29
---

## 概要

ブラウザで動くゲームを、アプリとして出す道筋を、手間の小さい順に整理します。

- ①**PWA**: ホーム画面に追加して、アプリのように開く。ストアは通さない。
- ②**ラッパー**: [Capacitor](https://capacitorjs.com/) などで WebView に包み、iOS と Android のプロジェクトを作って、ストアに出す。デスクトップ向けには [Tauri](https://tauri.app/) や [Electron](https://www.electronjs.org/) がある。
- ③**エンジンの書き出し**: Godot や Unity から、各プラットフォームの形式で出す。
- [App Store](https://developer.apple.com/app-store/) と [Google Play](https://play.google.com/console/about/) の登録費、審査、必要な準備、テスト配信（[TestFlight](https://developer.apple.com/testflight/)、Google Play のクローズドテスト）、「WebView だけのアプリ」の扱いを、公式の資料で確認した内容で説明します。
- 手元で、Capacitor のプロジェクトを作るところまで試した結果を載せます。

数字と条件は公式ドキュメントで確認したものです（2026年9月時点）。

## 3つの道筋

| | ①PWA | ②ラッパー（Capacitor など） | ③エンジンの書き出し |
|---|---|---|---|
| 変えるもの | manifest とアイコンを足す | 既存の Web ビルドをそのまま包む | エンジンのプロジェクトから出す |
| 配る場所 | Web（URL）。ストアには載らない | [App Store](https://developer.apple.com/app-store/)、[Google Play](https://play.google.com/console/about/) | App Store、Google Play |
| ストア関連の費用 | 不要 | 開発者アカウント（次の節） | 開発者アカウント |
| 手元の環境 | ブラウザだけ | iOS は Mac と Xcode、Android は Android Studio | iOS は Mac と Xcode、Android は SDK と JDK |
| 更新 | サイトを更新すれば反映 | ストアへ新しいビルドを提出 | ストアへ新しいビルドを提出 |

まず①で試し、ストアが必要になったら②に進むのが、手間の小さい順です。エンジンで作った人は、③が直接の道です（[ゲームエンジンの比較](/dev-env/engines/)）。ブラウザゲームの作り方は [ブラウザゲームの技術選定](/agent-dev/web-game-stack/) を参照してください。

## ①PWA：ホーム画面に追加する

PWA（Progressive Web App）は、Web サイトに manifest（アプリの名前やアイコンを書いた JSON）を付けて、端末にインストールできるようにしたものです。

### 要件

Chrome、Edge、Samsung Internet など Chromium 系のブラウザで、インストールできる条件は次のとおりです（[Making PWAs installable（MDN）](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)）。

- manifest に `name`（または `short_name`）、192px と 512px の `icons`、`start_url`、`display`（または `display_override`）がある
- `prefer_related_applications` が `false` か、書かれていない
- HTTPS で配信されている（開発中は `localhost` と `127.0.0.1` も可）
- 全ページの `<head>` から manifest を `<link rel="manifest">` で参照している

サービスワーカー（オフライン対応の仕組み）は、インストールの要件ではありません。ゲームでは、オフラインで遊べるようにしたいときに足します。

```json
{
  "name": "Sample Game",
  "short_name": "Sample",
  "start_url": "./index.html",
  "display": "fullscreen",
  "icons": [
    { "src": "icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

`display` を `standalone` か `fullscreen` にすると、ブラウザの枠のない、アプリのような表示で開きます（MDN）。この例は、この記事のために書いたものです。

### iOS と Android の違い

| | Android（Chrome） | iOS / iPadOS（Safari） |
|---|---|---|
| インストールの操作 | ブラウザのインストール表示。GMS 搭載端末の Chrome と、Samsung 端末の Samsung Internet は、WebAPK として入る | 共有メニューの「ホーム画面に追加」。iOS 16.4 以降は Chrome、Edge、Firefox、Orion の共有メニューからも追加できる |
| 独自のインストールボタン（`beforeinstallprompt`） | 使える | 使えない |
| インストール画面に出す説明・スクリーンショット（manifest の `description`、`screenshots`） | 表示される | 表示されない |
| manifest がないサイト | Chrome は、manifest がなくてもアプリとして追加できる | iOS 26 以降は、どのサイトも初期状態でアプリとして開く（ユーザーが「Open as Web App」をオフにできる） |
| プッシュ通知 | — | iOS 16.4 以降、ホーム画面に追加した Web アプリが、Web Push の許可を求められる。許可の要求は、ユーザーの操作（ボタンを押すなど）への反応として行う |

出典: [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)、[Web Push for Web Apps on iOS and iPadOS（WebKit）](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)、[News from WWDC25（WebKit）](https://webkit.org/blog/16993/news-from-wwdc25-web-technology-coming-this-fall-in-safari-26-beta/)。

iOS では、アイコンを manifest の `icons`（iOS 15.4 から）か、`<head>` の `apple-touch-icon` で指定します。両方あると `apple-touch-icon` が優先されます。iOS の Web Push は、[Apple Developer Program](https://developer.apple.com/programs/) の会員でなくても使えます（WebKit）。

### PWA の限界

- [App Store](https://developer.apple.com/app-store/) と [Google Play](https://play.google.com/console/about/) には載りません。「ストアで検索して見つけてもらう」経路は使えません。
- ストアのアプリ内課金は使えません。課金の選択肢は [広告・アプリ内課金](/monetization/ads-and-iap/) を参照してください。
- Android では、PWA を Play に出す方法があります。Chrome の Trusted Web Activity（Android アプリから PWA を開く仕組み）を使い、生成のツールとして Bubblewrap があります（[Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity/)）。MDN によれば、PWABuilder というツールは、Google Play、Microsoft Store、Meta Quest Store、iOS の App Store 向けに PWA をパッケージできます。

## ②ラッパー：WebView に包んでストアへ

ラッパーは、ブラウザゲームを、アプリの中の WebView（画面に埋め込んだブラウザ）で動かす方式です。Web のコードをそのまま使い、通知などの端末の機能は、プラグインで足します。

### Capacitor

[Capacitor](https://capacitorjs.com/) は、Web のプロジェクトに iOS と Android のプロジェクトを足すツールです。iOS は WKWebView、Android は Android System WebView で動きます（[iOS](https://capacitorjs.com/docs/ios)、[Android](https://capacitorjs.com/docs/android)）。

| 項目 | 内容（Capacitor 8.5.2） |
|---|---|
| Node.js | 22 以上 |
| iOS | macOS、Xcode 26.0 以上。対応は iOS 15 以上。依存管理は Swift Package Manager が初期値（CocoaPods も選べる） |
| Android | Android Studio 2025.2.1 以上、Android SDK（API 24 以上）。対応は Android 7 以上。JDK は Android Studio が入れる |
| Web 側の条件 | `package.json` がある。ビルドした Web の置き場所（`dist` など）に `index.html` がある。`index.html` に `<head>` がある |

出典: [Environment Setup](https://capacitorjs.com/docs/getting-started/environment-setup)、[Installing Capacitor](https://capacitorjs.com/docs/getting-started)。

手元（Node.js 26、macOS）で、[Vite](https://vite.dev/) の小さなサンプルに次のコマンドを実行しました。`init` の引数は、対話式の質問の代わりに、アプリ名、アプリ ID、Web のビルド先を渡しています。

```bash
npm i @capacitor/core
npm i -D @capacitor/cli
npx cap init "Sample Game" com.example.samplegame --web-dir dist
npm i @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
npx cap sync
npx cap doctor
```

| コマンド | 手元の結果 |
|---|---|
| `npx cap init …` | `capacitor.config.json`（`appId`、`appName`、`webDir`）ができた |
| `npx cap add android` / `npx cap add ios` | `android/` と `ios/` ができ、Web のビルドが `android/app/src/main/assets/public` と `ios/App/App/public` に複製された。Android は `targetSdkVersion = 36`、`minSdkVersion = 24`、iOS は最小 iOS 15.0 |
| `npx cap sync` | 完了 |
| `npx cap doctor` | iOS も Android も問題なしと表示された |

- 最初の `npx cap add android` は、エージェントの環境で、`android/` を作ったあとに応答を返さず止まりました。中断して `npx cap telemetry off` を実行すると、`sync` と `add ios` は最後まで進みました。Capacitor の CLI は、最初のコマンドのあと、使用状況のテレメトリの収集に自動で参加させます（対話のない環境では収集しません）。オフにするには `npx cap telemetry off` を実行します（[Telemetry](https://capacitorjs.com/docs/cli/telemetry)）。
- Web のコードを変えたら、ビルドしてから `npx cap sync` で複製し直します（[Capacitor Workflow](https://capacitorjs.com/docs/basics/workflow)）。
- 生成された Android の `targetSdkVersion` 36 は、[Google Play](https://play.google.com/console/about/) が2026年8月31日から新しいアプリと更新に求める Android 16（API 36）と同じです（[Target API level requirements](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en)）。

デバッグ実行、Xcode と Android Studio を開くコマンド、リリース用のビルドは次のとおりです（[Workflow](https://capacitorjs.com/docs/basics/workflow)、[cap build](https://capacitorjs.com/docs/cli/commands/build)）。

```bash
npx cap run ios
npx cap run android
npx cap open ios
npx cap open android
npx cap build android --androidreleasetype AAB --keystorepath <キーストア> --keystorealias <エイリアス>
```

`cap build` は、署名済みの AAB、APK、IPA を作ります。署名に使うパスワードは、コマンドの引数に直接書かず、CI のシークレットなどで渡します。

アプリ ID（`com.example.samplegame`）は、iOS の Bundle ID、Android の Application ID になります。Google Play のパッケージ名は、一度決めると削除も再利用もできません（[Create and set up your app](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en)）。持っているドメインの逆順で、慎重に決めます。

### デスクトップ向け：Tauri と Electron

| | Tauri | Electron |
|---|---|---|
| 仕組み | OS が持つ WebView を使う。最小のアプリは 600KB 未満 | Chromium と Node.js を同梱する |
| 開発の前提 | Rust が必要 | JavaScript だけで足りる |
| 書き出し | [Tauri](https://tauri.app/) v2 は、デスクトップと、iOS・Android の両方を対象にする | Windows、macOS、Linux。[Electron](https://www.electronjs.org/) Forge で `electron-forge make` |

出典: [Tauri](https://v2.tauri.app/start/)、[Electron](https://www.electronjs.org/docs/latest/)、[Packaging（Electron）](https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging)。デスクトップ向けの配布先は、[itch.io](https://itch.io/) のダウンロード版や [Steam](https://store.steampowered.com/) です（[itch.io で公開する](/publish/itch-io/)、[販売プラットフォーム](/monetization/platforms/)）。

## ③エンジンの書き出し

Godot と Unity は、Android と iOS に直接書き出せます。

- **Godot**: iOS への書き出しは、Xcode の入った macOS で行い、[App Store](https://developer.apple.com/app-store/) Team ID と Bundle ID が必須です。Android は OpenJDK 17 以上と Android SDK が要ります。C# のプロジェクトは、Godot 4.2 から書き出せますが、実験的な扱いです（[iOS](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_ios.html)、[Android](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_android.html)）。
- **Unity**: [Android](https://docs.unity3d.com/6000.3/Documentation/Manual/android-BuildProcess.html) と [iOS](https://docs.unity3d.com/6000.3/Documentation/Manual/iphone-BuildProcess.html) のビルド手順があります。

エンジンの選び方は [ゲームエンジンの比較](/dev-env/engines/) にあります。以降の登録・審査の話は、②と③に共通です。

## App Store と Google Play に出す

登録費や手数料の詳細は [販売プラットフォーム](/monetization/platforms/) にあります。ここでは、出すための準備を並べます。

### アカウントと審査

| | App Store（Apple） | Google Play |
|---|---|---|
| 登録費 | 年99ドル（現地通貨の地域あり） | 1回だけ25ドル |
| 本人確認 | 二要素認証つきの Apple アカウント。成人であること。個人は本名がストアの販売者名に出る | 18歳以上。政府発行の身分証とクレジットカード（法的な氏名）を求められることがある。プリペイドカードは不可 |
| 審査の時間 | 提出の90%が24時間以内 | 審査が済み次第公開される。一部のアプリは最長7日以上 |
| テスト配信 | [TestFlight](https://developer.apple.com/testflight/) | 内部テスト、クローズドテスト、オープンテスト |
| ビルドの条件 | Xcode 26 以降でビルド（2026年4月28日以降）。iOS 13 以降をターゲット（2026年9月9日以降） | ターゲット API 36 以上（2026年8月31日以降。延長申請で11月1日まで） |

出典: [What's included](https://developer.apple.com/programs/whats-included/)、[Enrollment](https://developer.apple.com/support/enrollment/)、[App Review](https://developer.apple.com/distribute/app-review/)、[Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/)、[Play Console 登録](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en)、[Play Console アプリの作成](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en)、[審査](https://support.google.com/googleplay/android-developer/answer/9859751?hl=en)、[ターゲット API](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en)。

### Google Play の個人アカウントのクローズドテスト

**2023年11月13日より後に作った個人アカウントは、12人以上のテスターが14日以上連続でオプトイン（参加）したクローズドテストを行わないと、本番公開できません。** その条件を満たしてから、Play Console で「本番環境へのアクセス」を申請します（[App testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)、2026年9月時点）。

- 数え方は「継続して14日」です。14日未満でオプトアウトした人は数えられません。オプトアウトして戻った場合も、連続の14日が必要です。
- 申請フォームで、テストの状況（テスターを集めやすかったか、機能をどれだけ使ったか、得たフィードバックと、それを受けた変更）を答えます。
- 審査は通常7日以内です。テスターが12人に満たない場合や、参加が十分でない場合は、テストの継続を求められます。
- 内部テストは、少人数を素早く試すためのもので、任意です。オープンテストは、本番環境へのアクセスを得たあとに使えます。
- この条件は、個人アカウント向けの規定です。
- 新しい個人アカウントは、Play Console のモバイルアプリで、Android 端末を持っていることの確認も求められます（[Play Console 登録](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en)）。

テスターは、友人、家族、同僚、同じ関心を持つコミュニティなどから集めます。公式は、フィードバックの窓口を用意し、14日間連続でオプトインしたままにしてもらうよう伝えることも勧めています。

### 必要な準備

| | App Store | Google Play |
|---|---|---|
| アイコン | アプリに含める。公開後に変えるには、新しいバージョンの提出が必要 | ストア用に 512×512px の32ビット PNG（1024KB以下） |
| スクリーンショット | 1〜10枚（JPEG・PNG、アルファなし）。iPhone は 6.9 インチ用（例: 1320×2868）。アプリを使っている画面であること | 端末の種類ごとに最大8枚。ほかにフィーチャーグラフィック（1024×500）が必須 |
| 文言 | アプリ名は30文字まで | アプリ名30文字、短い説明80文字、詳しい説明4,000文字 |
| プライバシー | プライバシーポリシーの URL（メタデータとアプリ内の両方）が必須 | Data safety フォームの回答と、プライバシーポリシーが必須。データを集めないアプリも回答する |
| 年齢区分 | [App Store](https://developer.apple.com/app-store/) Connect の質問に回答。結果は 4+、9+、13+、16+、18+ | コンテンツレーティングの質問票に回答。ターゲット層も設定する |
| 提出前 | 最終版で、端末で動作を確認する（2.1） | クラッシュや動作不良がないこと。審査は不具合の切り分けの場ではない |

出典: [Add an app icon](https://developer.apple.com/help/app-store-connect/manage-app-information/add-an-app-icon/)、[Screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/)、[Age ratings](https://developer.apple.com/help/app-store-connect/reference/age-ratings-values-and-definitions/)、[App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)（2026年6月8日更新版）、[Store listing assets](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)、[Data safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en)、[Content ratings](https://support.google.com/googleplay/android-developer/answer/9859655?hl=en)。

### TestFlight

TestFlight は、Apple のベータ配信の仕組みです。ビルドを App Store Connect にアップロードし、グループにひも付けて配ります。内部テスターは App Store Connect のユーザーで最大100人、外部テスターは最大1万人です。外部に配るビルドは、ベータ版の審査が必要になることがあります。ビルドは90日で使えなくなります（[TestFlight Overview](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/)）。Apple のガイドラインは、デモ、ベータ、体験版は App Store ではなく TestFlight を使うこと、TestFlight のビルドを報酬と引き換えに配らないことを求めています（2.2）。

### Android を Play 以外で配る場合

APK を Play の外で直接配る場合も、Android の開発者確認（Android developer verification）の対象です。2026年9月30日に、ブラジル、インドネシア、シンガポール、タイで、参加ストアからのインストールに適用が始まり、2027年以降に全世界へ広がります。Play で配るアプリは、Play が99%を自動で登録し、残りは Play Console で手動で登録します（[Android developer verification](https://developer.android.com/developer-verification)）。

## 「WebView だけのアプリ」の扱い

### Apple

App Review Guidelines の 4.2（Minimum Functionality）は、アプリに「単なる再パッケージされた Web サイトを超える機能、コンテンツ、UI」を求めています。役に立たない、独自性がない、アプリらしくないアプリは、[App Store](https://developer.apple.com/app-store/) に属さないとされ、長く続く娯楽としての価値か十分な実用性のどちらもないアプリは、受け入れられないことがあります。具体的な機能の一覧は挙げられていません。

WebView のアプリ自体は禁止されていません。Web ブラウザとして動くアプリには WebKit の使用が求められ（2.5.6）、[Capacitor](https://capacitorjs.com/) は WKWebView を使います。4.2.6 は、テンプレートやアプリ生成サービスで作ったアプリを、コンテンツの提供者本人が提出する場合を除いて拒否します。自分のゲームを自分で提出するなら、問題になりません。

4.7 は、バイナリに含まれない HTML5 のミニアプリ・ミニゲームを、アプリの中で提供する場合の規定です。ゲームの一覧、報告の仕組み、年齢制限などを求めます。自作の1本をアプリに同梱する②は、この規定より 4.2 が焦点になる、と読めます（筆者の読み）。

### Google Play

[Google Play](https://play.google.com/console/about/) のポリシーは、次のように書いています。

- 「Webviews and Affiliate Spam」: **サイトの所有者や管理者の許可なく**、Web サイトの WebView を提供する、またはアフィリエイトのトラフィックを誘導することが主な目的のアプリを禁じる。自作のゲームは、この点では該当しません。
- 「Functionality, Content, and User Experience」: クラッシュする、モバイルアプリとしての基本的な有用性がない、魅力的なコンテンツがないアプリは認められない。機能が限られ、内容が乏しいアプリも同様。
- 「Device and Network Abuse」: Play の更新手段以外で、アプリ自身を書き換えたり、実行コード（dex、JAR、.so）を外部から取得したりしてはならない。ただし、WebView やブラウザの JavaScript のような、仮想マシンやインタープリタで動くコードには適用されない。

出典: [Spam](https://support.google.com/googleplay/android-developer/answer/9899034?hl=en)、[Functionality, Content, and User Experience](https://support.google.com/googleplay/android-developer/answer/9898783?hl=en)、[Device and Network Abuse](https://support.google.com/googleplay/android-developer/answer/9888379?hl=en)。

### アプリらしくするために足せるもの

審査の基準は公式に列挙されていないので、次はこの記事の提案です。

- 端末の機能を使う（触覚、ローカル通知、端末へのセーブ）。Capacitor のプラグインで足せます。
- アセットをアプリに同梱し、オフラインで最後まで遊べるようにする。
- 画面の向き、ノッチ、セーフエリアに対応する。

## Webのまま公開するか、アプリにするか

| 判断の観点 | Web のまま（itch.io、自前のサイト） | アプリにする |
|---|---|---|
| 遊ばれる場所 | URL を送れば、すぐ遊べる。インストールが要らない | ストアの検索、ホーム画面のアイコンから。インストールが要る |
| 通知 | ブラウザの通知。iOS ではホーム画面に追加した Web アプリで使える | 端末の通知（プラグインと、各プラットフォームの通知の設定が要る） |
| 課金 | Web の決済。[itch.io](https://itch.io/) は投げ銭と、ダウンロード版の販売 | アプリ内で機能やゲーム内通貨を解放するなら、Apple は [App Store](https://developer.apple.com/app-store/) のアプリ内課金を要求（3.1.1）。地域によって例外があり、日本の手数料は [販売プラットフォーム](/monetization/platforms/) に整理している |
| 審査と更新 | 審査なし。デプロイで即反映 | 更新のたびにビルドを提出する。Xcode やターゲット API の要件が上がっていく |
| 費用と準備 | 0円から | Apple 年99ドル、Google 25ドル。アイコン、スクリーンショット、プライバシーポリシー、年齢区分、テスターの募集 |
| ポリシー | [プラットフォームのAIポリシー](/legal/platform-policies/) など、公開先の規約 | ストアの審査基準。WebView 中心のアプリは 4.2 などの対象 |

目安は次のとおりです。

- **まず Web で出す**: 試作品、ジャムの作品、反応を見たい段階。itch.io か自前のサイトで公開します（[itch.io で公開する](/publish/itch-io/)、[Webゲームの公開先](/publish/web-hosting/)）。
- **PWA を足す**: ブラウザで遊ばれていて、ホーム画面から開けるようにしたい。手間はほとんどかかりません。
- **ラッパーでストアに出す**: ストアで見つけてもらいたい、端末の通知や課金を使いたい、という理由がはっきりしてから。登録費用とテスター集めが先に要ります。
- **課金設計を先に決める**: 収益の形（広告、アプリ内課金、買い切り）で、出す場所が変わります。[広告・アプリ内課金](/monetization/ads-and-iap/) を参照してください。

## エージェントにアプリ化を頼む

アカウントの登録、支払い、署名鍵の作成と保管、ストアへの提出は、人が行います。エージェントには、プロジェクトの生成、ビルド、動作確認、素材の書き出しを任せます。

### Capacitor のプロジェクトを作る

```text
このブラウザゲーム（Vite、ビルド先は dist）を、Capacitor で iOS と Android のアプリにする
下準備をしてください。次の順に進め、各段階の結果を報告してください。

1. Capacitor の公式ドキュメント（capacitorjs.com/docs/getting-started）を読み、
   バージョンと必要な環境（Node.js、Xcode、Android Studio）を確認する
2. npm i @capacitor/core と npm i -D @capacitor/cli
3. npx cap init "<アプリ名>" <アプリID> --web-dir dist
   アプリIDは com.<私のドメインの逆順>.<ゲーム名> にする。決める前に私に聞く
4. npm i @capacitor/android @capacitor/ios、npx cap add android、npx cap add ios
5. 対話式の質問（テレメトリの確認など）で止まったら、私に聞く
6. npm run build、npx cap sync、npx cap doctor
7. android/variables.gradle の targetSdkVersion が Google Play の要件
   （2026年8月31日以降は API 36）を満たすか確認する
8. ios/ と android/ を Git に入れるか、私に聞く

やらないこと: ストアのアカウント作成、支払い、署名鍵やキーストアの生成、
ストアへのアップロード。これらは私が行います。
```

### スクリーンショットを書き出す

[App Store](https://developer.apple.com/app-store/) の iPhone 6.9 インチ用（1320×2868）の画面を、Playwright で書き出す例です（この記事のために書いた例です）。画面の論理サイズ 440×956 に、デバイスのピクセル比 3 を掛けると 1320×2868 になります。

```js
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 440, height: 956 },
  deviceScaleFactor: 3,
});
await page.goto('http://127.0.0.1:4173/?seed=1');
await page.waitForFunction('window.__READY__ === true');
await page.screenshot({ path: 'store/ios-6.9-01.png' }); // 1320x2868
await browser.close();
```

```text
store/ 以下に、App Store 用のスクリーンショットを5枚作ってください。
- 1320x2868 の PNG。アルファチャンネルなし
- タイトル画面ではなく、プレイ中の画面（ステージ序盤、戦闘、リザルト、設定など）
- ゲーム側の window.__READY__ を待ってから撮る。乱数の種は ?seed= で固定する
- 撮影後に、ファイルの寸法とアルファの有無を確認して表にして報告する
```

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Making PWAs installable（MDN）](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) — PWA のインストール要件と、iOS・Android の違い
- [Web Push for Web Apps on iOS and iPadOS（WebKit）](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) — iOS 16.4 のホーム画面 Web アプリと通知
- [News from WWDC25（WebKit）](https://webkit.org/blog/16993/news-from-wwdc25-web-technology-coming-this-fall-in-safari-26-beta/) — iOS 26 で、どのサイトもアプリとして開く
- [Trusted Web Activity（Chrome for Developers）](https://developer.chrome.com/docs/android/trusted-web-activity/) — PWA を Android アプリで開く仕組み
- [Capacitor: Installing Capacitor](https://capacitorjs.com/docs/getting-started) — プロジェクトの追加と同期の手順
- [Capacitor: Environment Setup](https://capacitorjs.com/docs/getting-started/environment-setup) — Node.js、Xcode、Android Studio の要件
- [Capacitor: cap build](https://capacitorjs.com/docs/cli/commands/build) — 署名済みのビルドを作るコマンド
- [Tauri](https://v2.tauri.app/start/) — システムの WebView を使うフレームワーク
- [Electron](https://www.electronjs.org/docs/latest/) — Chromium と Node.js を同梱するフレームワーク
- [App Review Guidelines（Apple）](https://developer.apple.com/app-store/review/guidelines/) — 4.2、4.7、2.2、2.3、3.1.1、5.1.1
- [Apple Developer Program: What's included](https://developer.apple.com/programs/whats-included/) — 年会費と手数料
- [TestFlight Overview（Apple）](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/) — テスターの人数と期間
- [Upcoming Requirements（Apple）](https://developer.apple.com/news/upcoming-requirements/) — Xcode 26 以降でのビルド
- [App testing requirements for new personal developer accounts（Google Play）](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en) — 12人・14日のクローズドテスト
- [Target API level requirements（Google Play）](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en) — API 36 の要件
- [Android developer verification](https://developer.android.com/developer-verification) — 開発者確認の日程
- [Exporting for iOS（Godot）](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_ios.html) — Godot の iOS 書き出し
