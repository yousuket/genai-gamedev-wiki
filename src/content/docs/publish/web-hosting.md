---
title: HTML/CSS/JavaScript のゲームを手軽に公開できるサービス
description: GitHub Pages、Cloudflare、Netlify、Vercel、Firebase Hosting、GitLab Pages、Renderなどを無料枠と商用利用の規約で比較し、ViteのゲームをGitHub PagesとCloudflareに出す手順を示します。
sidebar:
  order: 2
lastUpdated: 2026-10-05
---

## 概要

[Vite](https://vite.dev/) などでビルドしたブラウザゲームを、URLを開けば遊べる状態にするためのサービスを比べる記事です。

- [GitHub Pages](https://pages.github.com/)、Cloudflare、[Netlify](https://www.netlify.com/)、[Vercel](https://vercel.com/)、[Firebase Hosting](https://firebase.google.com/products/hosting)、[GitLab Pages](https://docs.gitlab.com/user/project/pages/)、[Render](https://render.com/)、[itch.io](https://itch.io/) を、無料枠・独自ドメイン・自動デプロイ・**商用や広告への制限**で比較します。
- Vite でビルドして GitHub Pages と Cloudflare に出す手順を、設定ファイルつきで示します。
- サブパスの `base`、キャッシュ、大きなアセット、`SharedArrayBuffer` のヘッダー、コーディングエージェントへの依頼文も扱います。
- サーバーが要るゲーム（マルチプレイ、ランキング）の入口も、短く紹介します。

公開先の全体像は [どこで動かすか、どこで公開するか](/publish/overview/) を参照してください。数字はすべて2026年9月時点です。

## 先に目安

- 個人の作品・試作で商用を考えない: [GitHub Pages](https://pages.github.com/) か Cloudflare
- 広告や課金をつける可能性がある: Cloudflare、[Netlify](https://www.netlify.com/)、[Render](https://render.com/)、Firebase など。**GitHub Pages と [Vercel](https://vercel.com/) の無料プランは、用途に制限があります**（下の節）
- 大量のアクセスを見込む: Cloudflare（静的アセットへのリクエストは無料・無制限）
- 同じ `dist` を [itch.io](/publish/itch-io/) にも上げて、二重に公開する

## 主要サービスの比較

### 無料枠と手間

| サービス | 無料枠（転送・容量・ビルド） | 独自ドメイン | 公開の仕組み |
|---|---|---|---|
| [GitHub Pages](https://pages.github.com/) | サイト1GBまで。転送は月100GB（ソフトな上限）。ブランチからの公開は1時間に10回（ソフトな上限。GitHub Actionsは対象外）。Freeは公開リポジトリのみ | 対応。HTTPSは自動 | GitHub Actions |
| [Cloudflare Workers](https://workers.cloudflare.com/)（静的アセット） | 静的アセットへのリクエストは無料・無制限。1サイト20,000ファイルまで、1ファイル25MiBまで。Git連携のビルド（Workers Builds）は月3,000分 | 対応。証明書は自動発行。ドメインがCloudflareのDNS上にある必要がある | `wrangler deploy` かGit連携 |
| [Cloudflare Pages](https://pages.cloudflare.com/) | 月500ビルド。1サイト20,000ファイルまで、1ファイル25MiBまで | 対応。1プロジェクトに100個まで | ダッシュボードのGit連携か `wrangler pages deploy` |
| [Netlify](https://www.netlify.com/) | 月300クレジット。帯域1GBで20クレジット、本番デプロイ1回で15クレジット。使い切ると全サイトが停止 | SSL付きで対応 | Git連携かCLI |
| [Vercel](https://vercel.com/)（Hobby） | Fast Data Transferは月100GB。デプロイは1日100回。上限を超えると、原則として30日間その機能が使えない | 1プロジェクトに50個まで | Git連携かCLI |
| [Firebase Hosting](https://firebase.google.com/products/hosting)（Spark） | 保存10GB、転送は月10GB。1ファイル2GBまで。超えると猶予の後にサイトが停止 | SSL付きで対応 | CLI（`firebase deploy`） |
| [GitLab Pages](https://docs.gitlab.com/user/project/pages/) | サイトは1GBまで（CIの成果物の上限） | 対応。150個まで | `.gitlab-ci.yml` |
| [Render](https://render.com/)（静的サイト） | デプロイは無料。転送はHobbyワークスペースに月5GB含み、超過は1GBあたり0.15ドル | Hobbyは2個まで。TLSは自動 | Git連携 |
| [itch.io](https://itch.io/) | 無料。ZIPは展開後500MB、1,000ファイル、1ファイル200MBまで | itch.ioのURL | ZIPのアップロード |

出典: [GitHub Pagesの制限](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)、[GitHub Pagesの作成](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)、[HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)、[Workers静的アセットの課金](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)、[Workersの制限](https://developers.cloudflare.com/workers/platform/limits/)、[Workers Buildsの料金](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/)、[Workersのカスタムドメイン](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)、[Pagesの制限](https://developers.cloudflare.com/pages/platform/limits/)、[Netlifyの料金](https://www.netlify.com/pricing/)、[Netlifyのクレジット](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)、[Vercel Hobby](https://vercel.com/docs/plans/hobby)、[Firebase Hostingの割り当て](https://firebase.google.com/docs/hosting/usage-quotas-pricing)、[GitLab.comの制限](https://docs.gitlab.com/user/gitlab_com/)、[GitLab Pages](https://docs.gitlab.com/user/project/pages/)、[Renderの料金](https://render.com/pricing)、[itch.ioのHTML5](https://itch.io/docs/creators/html5)。

Netlifyの無料プランは、帯域だけに使うと月15GB前後が上限です（300クレジット÷20。デプロイ分を除く筆者の計算）。クレジットを使い切ると、すべてのサイトが止まり、訪問者には「Site not available」のページが出ます（[How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/)）。ゲームが拡散した月に、遊べなくなる危険があります。

### 商用・広告の制限と、日本からの速度

| サービス | 商用・広告 | 日本からの速度 |
|---|---|---|
| [GitHub Pages](https://pages.github.com/) | 個人・組織のプロジェクトの紹介が主な用途。オンラインで事業を営むための無料ホスティング、主に商取引を目的とするサイトは不可 | 公式資料に拠点の記載なし |
| Cloudflare | 非商用に限る記載は、利用規約に見当たらない | 日本に東京、大阪、福岡の拠点 |
| [Netlify](https://www.netlify.com/) | 非商用に限る記載は、利用規約と利用ポリシーに見当たらない | 世界規模のCDN |
| [Vercel](https://vercel.com/)（Hobby） | **非商用の個人利用のみ**。決済を受ける、商品・サービスの販売を宣伝する、広告（Google AdSenseなど）を載せる、はすべて商用。寄付の依頼は商用に含まれない | 計算用のリージョンに東京と大阪 |
| [Firebase Hosting](https://firebase.google.com/products/hosting) | 非商用に限る記載は見当たらない | 世界規模のCDN |
| [GitLab Pages](https://docs.gitlab.com/user/project/pages/) | — | 公式資料に拠点の記載なし |
| [Render](https://render.com/) | 非商用に限る記載は見当たらない | 世界規模のCDN |
| [itch.io](https://itch.io/) | 商用のプロジェクトを置ける。ページには広告が出ない。HTML5のゲームは寄付形式のみ | 公式資料に拠点の記載なし |

出典: [GitHub: Additional Products and Features](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features)、[Cloudflare利用規約](https://www.cloudflare.com/terms/)、[Cloudflareのネットワーク](https://www.cloudflare.com/network/)、[Netlify利用規約](https://www.netlify.com/legal/terms-of-use/)、[Netlify利用ポリシー](https://www.netlify.com/legal/acceptable-use-policy/)、[Vercel Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines)、[Vercelのリージョン](https://vercel.com/docs/regions)、[Firebase Hosting](https://firebase.google.com/docs/hosting/usage-quotas-pricing)、[Firebase利用規約](https://firebase.google.com/terms)、[Render利用規約](https://render.com/terms)、[itch.io FAQ](https://itch.io/docs/creators/faq)。

- **広告や課金を入れるなら**: Vercel の無料プランは、広告を載せた時点で商用になり、Pro（開発者の席が月20ドル）が要ります。GitHub Pages も、商取引が主目的のサイトは対象外です。広告やアプリ内課金を付けるなら、非商用の限定が見当たらない Cloudflare、Netlify、Render、Firebase にします。
- **速度**: 静的ファイルは、CDN（世界中に置いたキャッシュ用のサーバー）から配られます。日本の拠点を公式資料で確認できたのは、Cloudflare と Vercel です。

### 提供状況

- **Glitch**: プロジェクトのホスティングとユーザープロフィールを、2025年7月8日に終了しました（[Glitchの告知](https://blog.glitch.com/post/changes-are-coming-to-glitch/)）。
- **[CodeSandbox](https://codesandbox.io/)**: Together AI の傘下に入り、主力はAIエージェント向けの実行環境（SDK）になりました（[CodeSandbox](https://codesandbox.io/)）。ゲームの公開先としては、ここでは扱いません。
- **Cloudflare Pages**: 提供中です。ただし公式は、新しいプロジェクトは Workers で始めるよう案内しています（[Cloudflare Pages](https://developers.cloudflare.com/pages/)）。この記事の手順では、Workers を先に、Pages を続けて示します。

### コードのまま共有できるサービス

[StackBlitz](https://stackblitz.com/) は、ブラウザ上でNode.jsが動くエディタで、公開プロジェクトをURLで共有できます（[What is StackBlitz](https://developer.stackblitz.com/guides/user-guide/what-is-stackblitz)）。無料の個人プランでも、公開プロジェクトは無制限です（[料金](https://stackblitz.com/pricing)）。実行環境はChrome系で完全に動き、SafariとFirefoxはベータ対応です（[ブラウザ対応](https://developer.stackblitz.com/platform/webcontainers/browser-support)）。[CodePen](https://codepen.io/) も、コードを共有する場です。

いずれも「作りかけを人に見せる」用途に向きます。ゲームとして公開して遊んでもらう場所は、上の静的ホスティングか [itch.io](/publish/itch-io/) にします。

## 実践: Vite でビルドして、GitHub Pages と Cloudflare に出す

ここで示す `vite.config.ts`、`wrangler.jsonc`、`_headers` は、`npm create vite@latest`（[Vite](https://vite.dev/) 8.3.1、`vanilla-ts` テンプレート）で作ったプロジェクトに当てて、ビルドとローカルでの配信を確かめたものです。

### 1. プロジェクトと `base`

```bash
npm create vite@latest my-game -- --template vanilla-ts
cd my-game
npm install
npm run build   # dist/ ができる
```

公開URLによって、`base`（アセットのURLの前につく部分）を変える必要があります。

| 公開URL | 必要な `base` |
|---|---|
| `https://ユーザー名.github.io/リポジトリ名/` | `/リポジトリ名/` |
| `https://ユーザー名.github.io/`、独自ドメイン、`*.workers.dev` | `/` |
| どこに置くか決まっていない | `./`（相対パス） |

`/` のままビルドしたものをサブパスに置くと、JavaScriptもCSSも404になり、画面が真っ白になります（ローカルで確かめました）。環境変数で切り替えると、両方の公開先で同じ設定を使えます。

```ts
// vite.config.ts
import { defineConfig } from 'vite';

// GitHub Actions では BASE_PATH=/<リポジトリ名>/ を渡す。未指定なら '/'
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
});
```

コードから画像やデータを読むときは、`/data/level1.json` のように先頭に `/` をつけて書かず、`import.meta.env.BASE_URL` を使います。

```ts
const res = await fetch(`${import.meta.env.BASE_URL}data/level1.json`);
```

### 2. GitHub Pages

1. リポジトリを作って `main` に push する（Freeプランでは公開リポジトリにする）
2. **Settings → Pages → Build and deployment → Source** で **GitHub Actions** を選ぶ
3. 次のワークフローを `.github/workflows/deploy.yml` に置いて push する

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    env:
      BASE_PATH: /${{ github.event.repository.name }}/
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: lts/*
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v5
```

Vite の公式ガイドのワークフローと同じ構成です（[Deploying a Static Site](https://vite.dev/guide/static-deploy)）。`ユーザー名.github.io` という名前のリポジトリや、独自ドメインを設定した場合は、`BASE_PATH` の行を消して `/` にします。以後は `main` に push するたびに公開されます。

### 3. Cloudflare（Workers の静的アセット）

`wrangler.jsonc` をプロジェクトの直下に置きます。

```jsonc
{
  "name": "my-game",
  "compatibility_date": "2026-09-01",
  "assets": {
    "directory": "./dist"
  }
}
```

```bash
npm install -D wrangler
npm run build
npx wrangler deploy      # 初回はブラウザでログインする。my-game.<サブドメイン>.workers.dev に公開される
```

`npx wrangler deploy --dry-run` は、ログインなしで動作を確かめられます（ローカルで確認済み）。Git連携にするときは、ダッシュボードの Workers & Pages で **Import a repository** を選び、リポジトリを接続します。デプロイのコマンドの初期値は `npx wrangler deploy` です（[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)）。

### 4. Cloudflare Pages

1. **Workers & Pages → Create a new Project → Pages → Git** で、リポジトリを選ぶ
2. ビルドコマンドに `npm run build`、出力ディレクトリに `dist` を入れて保存する
3. `https://プロジェクト名.pages.dev/` に公開される

CLIから直接上げるなら、`npx wrangler pages project create` でプロジェクトを作り、`npx wrangler pages deploy dist` で上げます（[Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)）。`base` は `/` のままでかまいません。

### 5. 単一ページアプリのURL

ゲームの画面をURLで分ける（`/settings`、`/level/3` など）と、直接開いたときに404になります。

| サービス | 対処 |
|---|---|
| [Cloudflare Workers](https://workers.cloudflare.com/) | `"not_found_handling": "single-page-application"` を `assets` に足す。存在しないパスに `index.html` を返す（ローカルで、`/foo` が404から200になることを確認済み） |
| [Cloudflare Pages](https://pages.cloudflare.com/) | `404.html` がなければ、SPAとして扱う |
| [Firebase Hosting](https://firebase.google.com/products/hosting) | `firebase.json` の `rewrites` で `**` を `/index.html` に向ける |
| [GitHub Pages](https://pages.github.com/) | 存在しないパスには `404.html` が表示される（[カスタム404ページ](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)）。URLの代わりに `#` を使うハッシュルーティングにするのが簡単 |

出典: [Workers SPA](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/)、[Pagesの配信](https://developers.cloudflare.com/pages/configuration/serving-pages/)、[Firebaseの設定](https://firebase.google.com/docs/hosting/full-config)。ほとんどの1画面のゲームでは、URLを分けないので、この設定は要りません。

### 6. キャッシュ

Vite は、ビルド時にファイル名へハッシュを付けます（`assets/index-CXOZm1xX.js`）。中身が変わればファイル名が変わるので、`assets/` の下は長期間キャッシュして構いません。`index.html` だけは、毎回確かめさせます。

Cloudflare と [Netlify](https://www.netlify.com/) では、`public/_headers` に書きます（ビルドで `dist/_headers` に入る）。

```text
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

Cloudflare のWorkersは、何も書かなければ `Cache-Control: public, max-age=0, must-revalidate` を返します（[Workersのヘッダー](https://developers.cloudflare.com/workers/static-assets/headers/)）。上の設定が効くことは、`wrangler dev` で確認しました。

## ゲームでよくある落とし穴

### 大きなアセット

| 公開先 | 上限 |
|---|---|
| [GitHub Pages](https://pages.github.com/) | サイト全体で1GB |
| Cloudflare | 1ファイル25MiB、1サイト20,000ファイル |
| [Firebase Hosting](https://firebase.google.com/products/hosting) | 1ファイル2GB、保存10GB |
| [itch.io](https://itch.io/) | 1ファイル200MB、全体500MB、1,000ファイル |

音楽や大きなテクスチャは、圧縮して分けます。Cloudflareは25MiBを超えるファイルを置けないので、分割するか別のストレージに置きます。

### `SharedArrayBuffer` を使うエンジン

WebAssemblyのスレッドや、Godot のスレッド有効の書き出し（[Godotの解説](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)）など、`SharedArrayBuffer` を使うものは、ページを cross-origin isolated（他のオリジンから隔離された状態）にする必要があります。次の2つのヘッダーを返します（[MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy)）。

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

`require-corp` のもとでは、他のサイトの画像やスクリプトは、相手が許可した場合のみ読めます。広告SDKや外部フォントを使うときは、この制約に当たります。

| 公開先 | ヘッダーの付け方 |
|---|---|
| Cloudflare、[Netlify](https://www.netlify.com/) | `public/_headers` に書く（Cloudflareはローカルで動作を確認した。[Netlifyの書式](https://docs.netlify.com/manage/routing/headers/)） |
| [Firebase Hosting](https://firebase.google.com/products/hosting) | `firebase.json` の `headers`（[設定](https://firebase.google.com/docs/hosting/full-config)） |
| [Vercel](https://vercel.com/) | `vercel.json` の `headers`（[vercel.json](https://vercel.com/docs/project-configuration/vercel-json)） |
| [GitHub Pages](https://pages.github.com/) | ヘッダーを設定できない。GitHubは対応を検討しているが、時期は未定（[議論](https://github.com/orgs/community/discussions/13309)）。サービスワーカーでヘッダーを足す回避策が知られている |

### モバイルでの音

ブラウザは、ユーザーが操作するまで音の再生を止めます。「タップして開始」の画面を最初に置き、その操作の中で `AudioContext.resume()` を呼びます（[MDN: Autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)）。iOSは、アプリが裏に回ると `AudioContext` が止まるので、戻ってきたときのタッチで再開します（[CrazyGames: Technical](https://docs.crazygames.com/requirements/technical/)）。

## コーディングエージェントに公開を頼む

認証が要る操作（`wrangler login`、GitHubの設定画面）は自分で行い、エージェントには設定ファイルの作成と、手元での検証までを任せます。

```text
このVite + TypeScript のプロジェクトを GitHub Pages に公開できるようにしてください。
- 公開URLは https://<ユーザー名>.github.io/<リポジトリ名>/ です
- vite.config.ts の base は環境変数 BASE_PATH から読み、未指定なら '/' にしてください
- .github/workflows/deploy.yml を作り、main への push で npm ci → npm run build → GitHub Pages へ公開してください
- コード中の '/assets/...' や fetch('/...') のような絶対パスを探し、import.meta.env.BASE_URL を使う形に直してください
- 終わったら BASE_PATH=/<リポジトリ名>/ npm run build を実行し、dist/index.html の src と href が /<リポジトリ名>/ で始まることを確認して報告してください
- git push とリポジトリの設定画面の操作は私が行います。手順を最後に箇条書きで教えてください
```

```text
このゲームを Cloudflare の Workers の静的アセットで公開できるようにしてください。
- wrangler.jsonc を作り、assets.directory は ./dist にしてください
- public/_headers に、/assets/* へ Cache-Control: public, max-age=31536000, immutable を付ける設定を書いてください
- npm run build のあと npx wrangler deploy --dry-run が通ることを確認してください
- 25MiB を超えるファイルが dist にないか調べ、あれば一覧を出してください
- wrangler login と本番の deploy は私が行います
```

## サーバーが要るゲームの入口

マルチプレイ、ランキング、クラウドセーブには、静的ホスティングとは別にサーバーが要ります。無料枠で試せる代表を並べます。

| サービス | 無料枠 | 向く用途 |
|---|---|---|
| [Cloudflare Workers](https://workers.cloudflare.com/) | 1日10万リクエスト。1回の実行のCPU時間は10ミリ秒（[料金](https://developers.cloudflare.com/workers/platform/pricing/)） | ランキングのAPI |
| Cloudflare Durable Objects | 無料プランはSQLite版のみ。1日10万リクエスト、保存5GB。WebSocketの受信メッセージは20件を1リクエストと数える（[料金](https://developers.cloudflare.com/durable-objects/platform/pricing/)） | 部屋ごとのマルチプレイ |
| Supabase（Free） | プロジェクト2つ、DB 500MB、Realtimeの同時接続200、月200万メッセージ。1週間動かないとプロジェクトが停止（[料金](https://supabase.com/pricing)） | ランキング、ログイン、簡易な同期 |
| Firebase（Spark） | Realtime Databaseは同時接続100、保存1GB、ダウンロード月10GB。Firestoreは保存1GiB、1日の読み取り5万・書き込み2万（[料金](https://firebase.google.com/pricing)、[制限](https://firebase.google.com/docs/database/usage/limits)） | セーブデータ、小規模な同期 |

無料枠の同時接続数は小さく（Firebaseは100、Supabaseは200）、遊ばれた数がそのまま上限に当たります。まず静的な公開で反応を見て、サーバー側は必要になってから足すのが、費用を抑える進め方です。ポータルに出す場合の制約は [公開先の選び方](/publish/overview/) を参照してください。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-10-02**: 同じ `Web/` フォルダを GitHub Actions 経由で Cloudflare Pages に、ZIP で CrazyGames に出す手順の報告。CrazyGames はサブディレクトリ配信のため絶対パス参照が壊れること、読み込み進捗の表示が品質要件になっていることが挙げられている（[出典](https://zenn.dev/acro_tomo/articles/toilettactics-02-static-web)）
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Vite: Deploying a Static Site](https://vite.dev/guide/static-deploy) — GitHub Pages、GitLab Pages、Netlify、Vercel、Cloudflare、Firebase の手順
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) — 容量、転送、ビルドの上限と禁止用途
- [GitHub: Additional Products and Features](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features) — Pagesの用途の規約
- [Cloudflare Workers: Static assets](https://developers.cloudflare.com/workers/static-assets/) — 静的アセットの配信と設定
- [Netlify: Credit-based pricing plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) — クレジットの消費量
- [Vercel: Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines) — 商用利用の定義
- [Firebase Hosting: Usage, quotas, and pricing](https://firebase.google.com/docs/hosting/usage-quotas-pricing) — 無料枠と停止の条件
- [itch.io: HTML5 games](https://itch.io/docs/creators/html5) — ZIPの要件と上限
- [MDN: Cross-Origin-Embedder-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy) — `SharedArrayBuffer` に必要なヘッダー
