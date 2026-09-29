# GenAI GameDev Wiki

生成AIを使う個人ゲーム制作者向けの日本語Wiki。Astro Starlight で作り、GitHub Pages で公開する。仕様は `SPEC.md` を参照。

## コマンド

- `npm run dev` — 開発サーバー（http://localhost:4321）
- `npm run check` — リンク切れと AUTO-UPDATE マーカーの確認
- `npm run build` — 本番ビルド（`dist/`）
- `npm run reviews` — レビュー（`reviews/`）の対応状況の一覧。未対応の項目と、表の記入漏れを確認する

## ルール

- 記事は `agents/STYLE.md` に従って書く。変わりうる事実には必ず出典URLを付ける。
- 記事は `src/content/docs/<カテゴリ>/` に置く。サイドバーはディレクトリから自動生成され、並び順は frontmatter の `sidebar.order` で決まる。
- Wiki内リンクは `/genres/overview/` のようにルートからの絶対パスで書く（`plugins/satteri-base-links.mjs` が GitHub Pages の base を付ける）。ただしトップページ（`index.mdx`）の hero・カードは相対パスで書く。
- `research/` はサイトに公開されない収集ログ。
- 自動更新エージェントの手順は `agents/daily-collect.md`（日次）と `agents/weekly-update.md`（週次）。

## デザイン（カラフルポップ）

- 配色・フォント（BIZ UDPゴシック。ウェイトは 400 と 700 のみ）は `src/styles/theme.css`。ライト／ダークの両方を定義している。
- カテゴリの表示名・色・アイコンは `src/data/categories.ts`。カテゴリを増やしたら `theme.css` のサイドバー色（`nth-child`）と `astro.config.mjs` の sidebar の並び順も合わせる。
- アイコンは Tabler Icons の outline 名で指定する（`src/components/TablerIcon.astro`）。
- 記事タイトル部分（カテゴリバッジ・読了時間）は `src/components/PageTitle.astro`、記事末尾の「同じカテゴリの記事」は `src/components/Footer.astro`。
- トップページの各ブロックは `src/components/home/`。
- ビルド後に `npm run check:dist` で、太字の `**` が変換されずに残っていないかを確認する。

## レビューの運用

- 外部のレビュアー（Codex など）の修正提案は `reviews/` に置かれる。手順と表の書き方は [reviews/README.md](reviews/README.md)。
- 提案は、根拠を確かめてから直す。直したら、コミットメッセージにレビューファイル名を書き、別のコミットで、そのファイルの「対応状況」の表を更新する（状態、対応コミット、対応日、メモ）。表が状態の唯一の記録。
- レビュアーは、表の状態を書き換えない（すべて「未対応」で作る）。
- 更新したら `npm run reviews` を実行して、エラーがないことを確かめる。
