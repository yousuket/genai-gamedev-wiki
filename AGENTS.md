# GenAI GameDev Wiki

生成AIを使う個人ゲーム制作者向けの日本語Wiki（英語版あり）。Astro Starlight で作り、GitHub Pages で公開する。仕様は `SPEC.md`、運用の詳細（公開、定期実行、はまりどころ）は `agents/OPERATIONS.md` を参照。

- リポジトリ: `yousuket/genai-gamedev-wiki`（公開）
- サイト: https://yousuket.github.io/genai-gamedev-wiki/

このファイルが、このリポジトリで作業するエージェント（Codex、Claude Code など）の共通の指示書。`CLAUDE.md` はこのファイルを読み込むだけ。

## 運営者とのやり取り

- 運営者への返答（進捗、報告、質問）は日本語で書く。コード、コマンド、ファイル名はそのままでよい。
- 環境、バージョン、設定を聞かれたら、手元で調べられることを調べてから答える。同じ名前の別物（例: デスクトップアプリと別に入っている CLI）を見て結論を出さない。調べても分からないことだけ「分からない」と言い、何を調べたかを添える。
- 事実は一次情報で確かめてから書く。確かめられないことは書かず、「確かめられなかった」と報告する。

## コマンド

- `npm run dev` — 開発サーバー（http://localhost:4321）
- `npm run check` — リンク切れと AUTO-UPDATE マーカーの確認
- `npm run check:en` — 英語版の構造（見出し、表、URL、マーカー）が日本語版と一致するかの確認
- `npm run build` — 本番ビルド（`dist/`）
- `npm run check:dist` — ビルド後、太字の `**` が変換されずに残っていないかの確認
- `npm run reviews` — レビュー（`reviews/`）の対応状況の一覧。未対応の項目と、表の記入漏れを確認する

記事を変えたら、`check`、`build`、`check:dist` を通してからコミットする。英語版を変えたら `check:en` も通す。

## 記事のルール

- 記事は `agents/STYLE.md` に従って書く。変わりうる事実には必ず出典URLと確認時点（「（2026年10月時点）」など）を付ける。
- 記事は `src/content/docs/<カテゴリ>/` に置く。サイドバーはディレクトリから自動生成され、並び順は frontmatter の `sidebar.order` で決まる。
- Wiki内リンクは `/genres/overview/` のようにルートからの絶対パスで書く（`plugins/satteri-base-links.mjs` が GitHub Pages の base を付ける）。ただしトップページ（`index.mdx`）の hero・カードは相対パスで書く。
- **定型の但し書き・注釈を書かない。** 「法的助言ではない」「専門家に相談」「公式で確認を」「AIの出力は要確認」の類は書かない。二次情報であること、責任を負わないこと、一次情報を調べて自己責任で、は共通の部品 `src/components/Disclaimer.astro` だけで出す（トップページ、権利・規約とマネタイズの記事の上、「このWikiについて」の免責事項）。実害のある警告（規約の中身、サービス終了、APIキーの漏えい）は事実として書く。
- **自動更新や運営体制について書かない。** エージェントが更新していること、人が確認していること、更新の仕組みには、記事でもサイトでも触れない。
- 運営者が非公開にしているもの（運営者が参考として共有した、運営者自身の作品や非公開リポジトリ）は、記事、事例、例のどこにも載せない。
- 太字の `**` は、閉じ括弧の直後に文字が続くと変換されない。その場所は `<strong>` を使う。
- サービス名は公式サイトへのリンクにする（`python3 scripts/link-services.py --apply <ファイル>`。誤検出があるので、適用後に差分を見る）。
- 記事の一部を大きく書き換えたら、関係する他の記事との食い違いも確かめる。

## 英語版

- 英語版は `src/content/docs/en/` に置く（書き方は `agents/STYLE.md` の「英語版」、訳し方は `agents/translate-en.md`）。カテゴリの英語名は `src/data/categories.ts`、英語版のサイドバーから未訳ページを外す処理は `src/routeData.ts`。
- **記事を作る・直すときは、日本語版と英語版（`en/`）を同じコミットで更新する。** 自動更新の手順も同じ（`agents/weekly-update.md`）。
- 訳すときは1記事ずつ行う。サブエージェントが使えるなら、記事ごとに分けて並行してよい。

## 定期実行

- 日次の情報収集は `agents/daily-collect.md`、週次の更新は `agents/weekly-update.md`。
- `research/` はサイトに公開されない収集ログ。
- どこで動いているか、止め方は `agents/OPERATIONS.md`。

## デザイン（カラフルポップ）

- 配色・フォント（BIZ UDPゴシック。ウェイトは 400 と 700 のみ）は `src/styles/theme.css`。ライト／ダークの両方を定義している。運営者が選んだデザインなので、方針を変えるときは先に相談する。
- カテゴリの表示名・色・アイコンは `src/data/categories.ts`。カテゴリを増やしたら `theme.css` のサイドバー色（`nth-child`）と `astro.config.mjs` の sidebar の並び順も合わせる。
- アイコンは Tabler Icons の outline 名で指定する（`src/components/TablerIcon.astro`）。
- 記事タイトル部分（カテゴリバッジ・読了時間）は `src/components/PageTitle.astro`、記事末尾の「同じカテゴリの記事」は `src/components/Footer.astro`。
- トップページの各ブロックは `src/components/home/`。
- 表は `plugins/satteri-table-wrap.mjs` が `div.table-wrap` で包む。表の見た目を変えたら、スマホ幅（375px）とPC幅（1280px）の両方で崩れないか確かめる。

## レビューの運用

- 外部のレビュアーの修正提案は `reviews/` に置かれる。手順と表の書き方は [reviews/README.md](reviews/README.md)。
- 提案は、根拠を確かめてから直す。直したら、コミットメッセージにレビューファイル名を書き、別のコミットで、そのファイルの「対応状況」の表を更新する（状態、対応コミット、対応日、メモ）。表が状態の唯一の記録。
- レビュアーは、表の状態を書き換えない（すべて「未対応」で作る）。
- 更新したら `npm run reviews` を実行して、エラーがないことを確かめる。

## git

- コミットは `main` に直接行う（このリポジトリは1人で運営している）。
- `git add -A` の前に、`.playwright-mcp/` など第三者のページの記録や、作業用の一時ファイルが入っていないか確かめる。
- 履歴の書き換え（`--force` の push、`filter-branch`）はしない。必要なら運営者に頼む。
