---
title: itch.io で公開する
description: itch.io の HTML5 ゲームの公開手順、zip の要件と上限、価格と収益分配、日本からの支払い受け取り、devlog・ジャム・itch.io app、公開後の育て方をまとめます。
sidebar:
  order: 3
lastUpdated: 2026-09-29
---

## 概要

itch.io は、個人や少人数のインディーゲームを公開・販売するサイトです。登録も公開も無料で、承認を待つ必要がありません。ブラウザゲームを最短で世に出す場所として、最初の候補になります。

- HTML5 ゲームは、`index.html` を含む zip を1つ上げるだけで公開できます。手元で zip を作って、構成を確かめた結果を載せています。
- 売上の分け前は自分で決められます（初期値10%）。HTML5 ゲームは、そのままでは「投げ銭」しか受け取れません。
- 日本から使うときは、米国の税務インタビューが必要です。詳細は [販売プラットフォーム](/monetization/platforms/) にあり、ここでは要点だけを書きます。
- 公開後は、devlog（開発日誌）、タグ、ジャムで見つけてもらい、必要なら Steam に進みます。

数字はすべて公式ドキュメントで確認したものです（2026年9月時点）。

## itch.io とは

公式の説明では、独立したクリエイターのためのオープンなマーケットプレイスで、特にインディーゲームに力を入れています（[About itch.io](https://itch.io/docs/general/about)）。

| 特徴 | 内容 |
|---|---|
| 利用料 | 無料（[Creator FAQ](https://itch.io/docs/creators/faq)） |
| 承認 | 公開のために、票やフォローを集めたり、承認を得たりする必要はない。ただし検索・一覧に載る「インデックス」には条件がある（後述） |
| 価格 | すべての価格が「最低価格」で、0円にもできる。買い手は最低価格より多く払える（[Pricing](https://itch.io/docs/creators/pricing)） |
| ページ | 色・フォント・画像を自分で設計できる。広告は載らない |
| 形式 | HTML5、Windows・macOS・Linux の実行ファイル、素材、漫画、サウンドトラックなど |

ブラウザゲームを置く場所としては、ホスティングを自前で用意しなくてよい点が利点です。自前のサーバーや独自ドメインで公開する選択肢は [Webゲームの公開先](/publish/web-hosting/) を参照してください。

## HTML5ゲームを公開する手順

### 1. 相対パスでビルドする

ビルドや技術選定は [ブラウザゲームの技術選定](/agent-dev/web-game-stack/) にあります。itch.io で最初につまずくのは、ファイルの参照の仕方です（[HTML5 games](https://itch.io/docs/creators/html5)）。

- ゲームは HTML 用 CDN のサブディレクトリに置かれます。`/assets/…` のような**絶対パス**は、プロジェクトの外を見にいって失敗します。
- サーバーは大文字小文字を区別します。Mac や Windows で動いていた `Hello.png` を `hello.png` と書いていると、アップロード後に 403 になります。
- フォルダ（`/` で終わるパス）を読みにいくと、404 ではなく 403 が返ります。
- 外部の API やファイルは HTTPS で読みます。

Vite なら、`vite.config.js` に `base: './'` を指定します。手元でビルドして比べると、指定した場合の `dist/index.html` はスクリプトを `./assets/index-…js` で参照し、指定しない場合（初期値）は `/assets/index-…js` で参照しました。

```js
import { defineConfig } from 'vite';

export default defineConfig({ base: './' });
```

### 2. zip の直下に index.html を置く

zip の**直下**に `index.html` が必要です。`dist` フォルダごと圧縮して `dist/index.html` という構成にするのが、よくある間違いです。手元で確かめた結果です。

| 圧縮の仕方 | zip の中身 | 結果 |
|---|---|---|
| `cd dist && zip -r ../game.zip .` | `index.html`、`assets/index-….js` | 直下に `index.html` がある |
| `zip -r game.zip dist` | `dist/index.html`、`dist/assets/…` | 直下に `index.html` がない |

1つのファイルで完結するゲームなら、zip にせず `.html` を直接上げられます。その場合、他のファイルは参照できません。複数ファイルなら zip にします。`.rar`、`.tar.gz`、`.7z` は使えません（[HTML5 games](https://itch.io/docs/creators/html5)）。

### 3. 上限を確認する

| 項目 | 上限（展開後） |
|---|---|
| ファイル数 | 1,000 |
| 合計サイズ | 500MB |
| 1ファイルのサイズ | 200MB |
| パスの長さ | 240文字（大文字小文字を区別、UTF-8） |

出典: [HTML5 games](https://itch.io/docs/creators/html5)（2026年9月時点）。公式は、大きすぎる HTML5 ゲームは読み込みと性能の面で体験が悪くなるので、ダウンロード版にすることを勧めています。上限の引き上げは、問い合わせれば検討されます。新しいアカウントには、アップロードのサイズ、プロジェクトページの数（目安20）、ページあたりのファイル数（10）にも別の制限があり、問い合わせで引き上げられます（[Getting started](https://itch.io/docs/creators/getting-started)、[Creator FAQ](https://itch.io/docs/creators/faq)）。

アップロードの前に、条件を機械的に確かめるスクリプトです（この記事のために書いた例です）。手元で、正しい zip、`dist` ごと圧縮した zip、絶対パスのままビルドした zip の3つに実行し、後の2つが NG になることを確かめました。

```js
// tools/check-itch-zip.mjs — 使い方: node tools/check-itch-zip.mjs game.zip
import { execFileSync } from 'node:child_process';

const zip = process.argv[2];
const list = execFileSync('unzip', ['-Z', zip], { encoding: 'utf8', maxBuffer: 1 << 26 })
  .split('\n')
  .map((l) => l.match(/^[-dl][-rwxsStT]{9}\s+\S+\s+\S+\s+(\d+)\s+\S+\s+\S+\s+\S+\s+\S+\s+(.+)$/))
  .filter(Boolean)
  .map((m) => ({ size: Number(m[1]), name: m[2] }))
  .filter((e) => !e.name.endsWith('/'));

const MB = 1024 * 1024;
const problems = [];
if (!list.some((e) => e.name === 'index.html')) problems.push('直下に index.html がありません');
if (list.length > 1000) problems.push(`ファイル数: ${list.length} (上限1,000)`);
if (list.reduce((s, e) => s + e.size, 0) > 500 * MB) problems.push('展開後の合計が500MBを超えています');
for (const e of list) {
  if (e.size > 200 * MB) problems.push(`200MBを超えるファイル: ${e.name}`);
  if (e.name.length > 240) problems.push(`パスが240文字を超えています: ${e.name}`);
}
for (const e of list.filter((e) => e.name.endsWith('.html'))) {
  const html = execFileSync('unzip', ['-p', zip, e.name], { encoding: 'utf8' });
  const abs = [...html.matchAll(/(?:src|href)=["'](\/[^/"'][^"']*)["']/g)].map((m) => m[1]);
  if (abs.length) problems.push(`${e.name} に絶対パスがあります: ${abs.join(', ')}`);
}

console.log(problems.length ? problems.map((p) => `NG: ${p}`).join('\n') : `OK (${list.length} files)`);
process.exit(problems.length ? 1 : 0);
```

### 4. ページを作ってアップロードする

ダッシュボードの「Create new game」から始めます（[Getting started](https://itch.io/docs/creators/getting-started)）。

1. タイトル、短い説明、カバー画像を入れる。カバー画像の比率は 315:250 で、315×250 が最小、630×500 のように大きいものが勧められています。スクリーンショットは3〜5枚が目安です。
2. 「Kind of project」で **HTML Game** を選び、zip をアップロードする。
3. 現れる「Embed options」で、表示方法を決める（次の節）。
4. 説明文を書き、ジャンルとタグ（最大10個）を付ける。
5. 「Save & view page」で確認する。新しいページは、初期状態では非公開です。
6. 編集画面の「Visibility & access」を Public にして公開する。

## 埋め込みの設定

| 設定 | 内容 |
|---|---|
| Embed in page | ページの中に、指定した幅と高さで埋め込む |
| Click to launch in fullscreen | 「Launch game」を押すと画面いっぱいに広がる。サイズの指定は不要だが、ゲームが画面サイズに合わせて描画できる必要がある |
| Click to Play | 初期状態でオン。軽いゲームならオフにでき、ページを開くと始まる。音が出ないブラウザがある |
| Fullscreen Button | ゲームに全画面ボタンがないとき、itch.io が自動で付ける。「Embed in page」では右下に重なる |
| Scrollbars | 初期状態ではオフ。表示領域より大きいゲームで、スクロールを許可する |
| Mobile Friendly | スマホのブラウザで動くと確認できたらオンにする |

出典: [HTML5 games](https://itch.io/docs/creators/html5)。

- 「Mobile Friendly」をオンにすると、スマホでページを開いたとき、設定にかかわらず全画面起動になります。オンにしていないと、動かないかもしれないという警告が出ますが、遊ぶことはできます。
- 公式は、canvas がウィンドウの大きさに合わせて伸縮する作りを勧めています。全画面ボタンでは表示領域が視聴者の画面の大きさに変わり、スマホでは端末の縦横比と解像度になります。固定サイズで埋め込むなら、960×540 のような値を決めます。
- 事前に gzip や Brotli で圧縮した素材は、`.gz` や `.br` の拡張子があれば、itch.io が適切なヘッダーを付けます（Unity 2020 の WebGL 出力がこの方式）。未圧縮の `html`、`js`、`css`、`svg`、`wasm`、`wav`、`glb`、`pck` は、CDN が自動で gzip します。

## エージェントに公開準備を頼む

ビルド、zip、点検、画面確認をエージェントに任せ、アップロードは人が行います。この記事のために書いたプロンプト例です。

```text
このゲームを itch.io の HTML5 として公開できる状態にしてください。

1. vite.config の base が './' か確認し、違えば直す
2. npm run build を実行する
3. dist の「中身」を、直下に index.html が来る形で game.zip にする
   (cd dist && zip -r ../game.zip . )
4. node tools/check-itch-zip.mjs game.zip を実行し、NG がなければ報告する
5. vite preview で dist を起動し、幅 1280x720 と 390x844 の両方でスクリーンショットを
   撮って、canvas が画面に収まっているか確認する
6. ブラウザのコンソールとネットワークのエラー（大文字小文字のずれ、絶対パス、
   http:// の外部読み込み）がないか確認する

アップロードと公開は私が行います。
```

### butler で更新を自動化する

公式のコマンドラインツール **butler** なら、zip の差し替えなしで更新できます。`butler push` は、前回のビルドとの差分だけを送ります（[The butler manual](https://itch.io/docs/butler/)）。

```bash
butler login
butler push dist your-name/your-game:html5
```

- `user/game` はページの URL に対応します（小文字）。`:html5` がチャンネル名です。
- HTML5 として扱わせるには、最初の push のあと編集画面で、チャンネルに「HTML5 / Playable in browser」を付け、ページの Kind を初期値の Downloadable ではなく HTML にします（[Pushing builds](https://itch.io/docs/butler/pushing.html)）。
- `--dry-run` で、送るファイルの一覧を確認できます。
- CI では環境変数 `BUTLER_API_KEY` に API キーを入れます。キーが公開されたログに出たら、すぐ失効させます（[Logging in](https://itch.io/docs/butler/login.html)）。エージェントには、キーそのものではなく CI のシークレット名を渡します。
- コマンドラインを使わない場合は、itch app（v26.12.0 以降）に butler を使ってビルドを送る画面があります。

## 価格の付け方

ページの価格は、次の3つから選びます（[Pricing](https://itch.io/docs/creators/pricing)）。

| 設定 | 動き | 向く場面 |
|---|---|---|
| $0 or Donate | 投げ銭の額を提示する。「ありがとう、ダウンロードへ」で、払わずに進める | 無料で公開し、気に入った人からもらう |
| Paid | 最低価格以上を払うと、所有者になる。価格を変えても、既存の購入者は所有したまま | 有料で売る |
| No payments | 支払いを無効にする。すべてのファイルを自由にダウンロードできる | ジャムの作品、完全な無料公開 |

払った人は「所有者」になり、ダウンロードキーを持ちます。払わずにダウンロードした人は、所有者になりません。無料のゲームをあとで有料にするなら、この違いに注意します。

**HTML5 ゲームは、そのままでは投げ銭しか受け取れません。** 公式は、すべての HTML5 ゲームが投げ銭のみの設定になっていて、アクセスを売るには「Kind of Game」を Downloadable にする方法があると書いています（[HTML5 games](https://itch.io/docs/creators/html5)、2026年9月時点）。ブラウザで無料で遊べる版を置き、有料の版は Downloadable の別ファイルで売る、という組み合わせが現実的です。

個別のファイルに最低価格を付ける機能（サウンドトラックや追加ステージ）、セール、バンドル、早期アクセス、予約販売もあります。価格の決め方は [価格設定](/monetization/pricing/) を参照してください。

## 売上の分け前と手数料

itch.io は「オープン収益分配」という方式です。itch.io に渡す割合を、売り手が **0% から 100% の範囲で自分で決めます**。初期値は10%で、アカウント設定の Seller settings で変えます（[Payments](https://itch.io/docs/creators/payments)）。

これとは別に、PayPal と Stripe の決済手数料が、取引ごとに「0.30ドル＋2.9%」ほどかかります。公式の計算式に、いくつかの価格を当てはめました（分け前は初期値の10%。10ドルの行は公式の例と同じ）。

| 価格 | itch.io への分け前 | 決済手数料 | 手取り | 割合 |
|---|---|---|---|---|
| 1ドル | 0.10ドル | 0.329ドル | 0.571ドル | 約57% |
| 2ドル | 0.20ドル | 0.358ドル | 1.442ドル | 約72% |
| 5ドル | 0.50ドル | 0.445ドル | 4.055ドル | 約81% |
| 10ドル | 1.00ドル | 0.590ドル | 8.410ドル | 約84% |

固定の0.30ドルが効くので、安い値付けほど手取りの割合が下がります。公式は、2ドル以上で売ることを勧めています。

## 支払いの受け取りと税

受け取り方は、2つのモードから選びます（[Payments](https://itch.io/docs/creators/payments)）。

| | Direct to you（直接受け取り） | Collected by itch.io（集金） |
|---|---|---|
| 設定 | PayPal と Stripe を自分で接続し、税の情報も各社に出す | 税務インタビューを1回受け、売り手の規約に同意する |
| 入金 | 取引ごとに、決済会社の残高へ入る | itch.io に集められ、あとで払い出しを申請する（PayPal か Payoneer） |
| 販売者 | 自分 | itch.io |
| 通貨 | 自分で選ぶ | ドル |
| チャージバック | 自分が負う | itch.io が負う |
| EU の VAT | 自分で徴収・納付する | 自動で徴収し、itch.io が納付する |
| 共同バンドル | 対象外 | 参加できる |

集金モードの払い出しには、残高5ドル以上、取引から7日の待機、審査（最短7日、通常10〜14日、初めての人はさらにかかることがある）が必要です。同時に進められるのは3件までで、月1回ほどにまとめることが勧められています。1年以上引き出さずに置くと、維持費が引かれることがあります（2026年9月時点）。

日本から使うときの要点です。

- Stripe の直接受け取りが使える国は、公式の一覧では米国、カナダ、アイルランド、英国で、日本は入っていません。日本からは、PayPal での直接受け取り（円を含む6つの通貨に対応。地域によっては事業用の PayPal アカウントが必要）か、集金モードを使います。
- itch.io は米国の会社です。集金モードでは、米国の外の売り手への支払いが源泉徴収の対象になります。税務インタビューで納税者番号を出さないと、租税条約のある国でも既定の30%になります。適用される率は、インタビューのあと設定画面に表示されます。
- 税務インタビューの本人確認には、一度だけ3ドルの手数料が引かれます。
- 米国での源泉徴収とは別に、日本での所得税・住民税の申告が必要です。表と手順は [販売プラットフォーム](/monetization/platforms/) の「日本からの税務手続き」にあります。

## 見つけてもらう

### インデックスの条件

公開しても、検索と一覧に載るには条件があります（[Getting indexed](https://itch.io/docs/creators/getting-indexed)）。

- Public で公開していて、「新規のダウンロードと購入を無効にする」「検索と一覧に載せない」を選んでいない。
- カバー画像がある。
- 購入、ダウンロード、ブラウザでのプレイのどれかができる。空のページは載らない。
- 新しい売り手が最初のプロジェクトを売るときは、人の目による審査の列に入り、数営業日かかることがある。その間も、URL からは遊べる。

検索はゲーム名での検索に最適化されていて、本文の言葉やタグは検索語になりません。タグは一覧ページ用です。一般的な単語1つのような題名は、見つけにくくなります。公式は、「新着順」の上に出すための公開日の更新はできない、新着は1日に数百本が追加される場所で、公開の場所として効果が低い、と書いています。

### タグ、devlog、AI の申告

- **タグ**: ジャンルを選び、タグを最大10個付けます。Metadata タブに、マルチプレイ、対応言語、アクセシビリティも入力できます。タグの乱用は、インデックスから外される理由になります。
- **devlog**: プロジェクトに紐づけて投稿する更新記事です。メールのダイジェストなどでユーザーに配信され、フォロワーを増やす手段になります。ファイルがない段階でもインデックスされるので、公開前の告知にも使えます。ページには最近の投稿へのリンクも出ます（[Getting indexed](https://itch.io/docs/creators/getting-indexed)、[Designing your page](https://itch.io/docs/creators/design)）。
- **AI の申告**: 編集画面の「AI Disclosure」欄で行います。詳細は [プラットフォームのAIポリシー](/legal/platform-policies/) にあります。

### 購入者・フォロワーとのやり取り

買った人全員にメールを送れます（1日に1通まで。最初の売上が立つまでは書けません）。コメントと掲示板を有効にでき、評価の一覧と報道関係者のリンクを Interact タブで見られます（[Interacting with your fans](https://itch.io/docs/creators/interact)）。

## ジャム

itch.io は、ゲームジャムの開催と参加の場にもなっています。無料のアカウントがあれば誰でもジャムを開けます。ランク付けありのジャムでは、期間中に作品を提出し、投票の期間を経て順位が出ます（[Hosting a game jam](https://itch.io/docs/creators/game-jams)）。参加する側は、作ったブラウザゲームをジャムのページから提出します。選び方と参加の手順は [ゲームジャム](/publish/game-jams/) に、開催予定は [イベントカレンダー](/publish/events-calendar/) にあります。

## itch.io app

itch.io app は、Windows、macOS、Linux 向けのデスクトップアプリです。ゲームのインストール、更新、起動を行います。HTML5 ゲームも、全プラットフォームでダウンロードして遊べます。ウェブサイトを置き換えるのではなく、補うものです（[itch.io app FAQ](https://itch.io/docs/app/faq)）。

作り手にとっては、ダウンロード版を配るときに意味があります。app が実行ファイルを探して起動し、複数の起動方法や API 連携が要るときは `app manifest` を同梱します。ブラウザ版をデスクトップ向けにも配りたいときは、Electron などで包む方法を [Webゲームをアプリにする](/publish/web-to-app/) で扱います。

## 公開後の育て方

1. **小さく更新する**: 更新は zip の差し替えか butler の push です。買った人は、同じページから以後のファイルを受け取れます。個別のファイルに、購入者が払った額を上回る最低価格を付けると、そのファイルは受け取れなくなります。価格はページの最低価格で決めます（[Pricing](https://itch.io/docs/creators/pricing)）。
2. **更新のたびに devlog を書く**: 何が変わったかを、スクリーンショットや短い動画とともに載せます。動画は [ショート動画](/trailer/social-shorts/) の作り方に沿います。
3. **フィードバックを読む**: コメントか掲示板を有効にし、遊んだ人の反応でゲームを直します。テストの進め方は [プレイテスト](/design/playtesting/) を参照してください。
4. **自分の場所から人を呼ぶ**: 公式は、実際の人がページを訪れて反応することが、一覧での順位を上げると説明しています。フォローされることと、コレクションに追加されることも、リーチを高めるとされています。
5. **Steam に進む**: 反応が良ければ Steam に移ります。購入に外部キー（Steam キーなど）を付けて配る機能が、編集画面の Distribute タブにあります（[Getting started](https://itch.io/docs/creators/getting-started)）。Steam の登録費と審査は [販売プラットフォーム](/monetization/platforms/)、ウィッシュリストは [ウィッシュリスト](/monetization/wishlists/) を参照してください。アプリストアに出すなら [Webゲームをアプリにする](/publish/web-to-app/) です。

公開先の全体像は [公開・イベントの概要](/publish/overview/) にまとめています。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [HTML5 games（itch.io）](https://itch.io/docs/creators/html5) — zip の要件、上限、埋め込みの設定、よくある失敗
- [Accepting Payments and Getting Paid（itch.io）](https://itch.io/docs/creators/payments) — オープン収益分配、支払いモード、払い出し、税務
- [Pricing（itch.io）](https://itch.io/docs/creators/pricing) — 最低価格、投げ銭、有料
- [Your first itch.io page（itch.io）](https://itch.io/docs/creators/getting-started) — ページの作成と公開
- [Getting indexed on Search & Browse（itch.io）](https://itch.io/docs/creators/getting-indexed) — インデックスの条件、タグ、devlog
- [Creator FAQ（itch.io）](https://itch.io/docs/creators/faq) — 利用料、上限、ダウンロードキー
- [Interacting with your fans（itch.io）](https://itch.io/docs/creators/interact) — メール、コメント、掲示板
- [Hosting a game jam（itch.io）](https://itch.io/docs/creators/game-jams) — ジャムの仕組み
- [itch.io app FAQ](https://itch.io/docs/app/faq) — デスクトップアプリ
- [The butler manual](https://itch.io/docs/butler/) — butler の導入、ログイン、push
- [About itch.io](https://itch.io/docs/general/about) — サービスの方針とオープン収益分配
