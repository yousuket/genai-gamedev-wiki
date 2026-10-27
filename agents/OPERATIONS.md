# 運用メモ

公開の仕組み、定期実行、はまりどころをまとめる。記事の書き方は `agents/STYLE.md`、全体の指示は `AGENTS.md`。

## 公開

- GitHub Pages に、GitHub Actions（`.github/workflows/deploy.yml`）から公開する。`main` への push で動く（`research/` だけの変更では動かない）。手動でも動かせる（`gh workflow run deploy.yml`）。
- リポジトリ変数 `PUBLISH_SITE=true` のときだけ公開する。`false` ならチェックとビルドだけ。
- アクセス解析は Cloudflare Web Analytics。リポジトリ変数 `CF_ANALYTICS_TOKEN` があると、計測用スクリプトが入る。
- 独自ドメインはない。サイトの URL は `/genai-gamedev-wiki/` 以下（base は `BASE_PATH` で渡す）。

## 定期実行

| ジョブ | 時刻 | 指示書 | 変更してよい範囲 |
|---|---|---|---|
| 日次収集 | 毎日 06:07 JST | `agents/daily-collect.md` | `research/` だけ |
| 週次更新 | 毎週月曜 07:07 JST | `agents/weekly-update.md` | `src/content/docs/news/` と各記事の AUTO-UPDATE 欄、`lastUpdated`（日英） |

週次更新の結果は、ラベル `weekly-update` の Issue で報告される。運営者は Issue を読み、提案に対応したら、コメントを書いて閉じる。

### 動かしている場所

2026年10月、実行を Claude Code のクラウド定期実行（routines）から、Codex（GitHub Actions の `openai/codex-action`）へ移している。**二重に動かさない。** 片方を有効にしたら、もう片方を止める。

| 場所 | 設定 | 有効にする方法 | 止める方法 |
|---|---|---|---|
| Codex（GitHub Actions） | `.github/workflows/codex-daily.yml`、`codex-weekly.yml`、プロンプトは `.github/codex/prompts/` | シークレット `OPENAI_API_KEY` を登録し、リポジトリ変数 `CODEX_SCHEDULE` を `true` にする | 変数 `CODEX_SCHEDULE` を `false` にする |
| Claude Code（routines） | 日次 `trig_015B8Wxcs35w3dhofE6eMhiC`、週次 `trig_011jt2yGEjnPhGB6ETuEwt4E`（環境 `genai-gamedev-wiki`、ネットワーク Full、モデル Sonnet 5.5） | claude.ai の Routines で有効にする | claude.ai の Routines で無効にする |

Codex の workflow では、Codex 自身は commit、push、Issue 作成をしない（GitHub のトークンを渡していない）。Codex がファイルを書き換え、そのあとの workflow の手順が、チェック、変更範囲の確認、commit、push、デプロイの起動、Issue 作成を行う。変更範囲の外のファイルが変わっていたら、push せずに失敗する。

手動で試すときは、Actions の画面か `gh workflow run codex-daily.yml` で動かす（`CODEX_SCHEDULE` が `false` でも、手動の実行は動く）。

## 日次収集のはまりどころ

- ウェブ検索だけで済ませると、公開日が分からず0件になる。指示書のとおり、フィードを curl で1つずつ取る。
- GitHub の検索 API は、認証なしだと HTTP 403 や回数制限になることがある。`gh` が使えるなら `gh api` で取る。
- Reddit は HTTP 429 や bot 判定で取れないことが多い。失敗として記録して次へ進む。bot 判定を回避しない。
- 同じ日の再実行は、その日のログの `items` が1以上なら何もしない（0件のときだけ取り直す）。

## 週次更新のはまりどころ

- 週次レポートの `sidebar.label` は `'YYYY-MM-DD'` と引用符で囲む。囲まないと YAML の日付型になり、ビルドが失敗する。
- 週次レポートには AUTO-UPDATE マーカーを入れない（`check-content.mjs` は `news/` の週次レポートを対象外にしている）。
- 収集ログの数字を、出典で確かめずに転記しない（過去に「約12万行」を、原文の「各約19万行」と取り違えた）。

## ローカルのはまりどころ

- 運営者の Mac では、Homebrew の更新で `node` が壊れることがあった（`libsimdjson`）。`brew reinstall node` で直る。一時しのぎは、`DYLD_FALLBACK_LIBRARY_PATH` に旧版の `simdjson` の `lib` を付けて `node` を直接呼ぶ（`npm` 経由では環境変数が消える）。
- `git push` が止まるときは、`git-credential-osxkeychain` がキーチェーンの許可を待っていることがある。1回だけなら `git -c credential.helper= -c credential.helper='!gh auth git-credential' push origin main` で通る（設定は変えない）。
- Astro 7 は Markdown の処理に Sätteri を使う。`markdown.rehypePlugins` は使えない。HTML の加工は `satteri({ hastPlugins })` のプラグイン（`plugins/`）で行う。
- Starlight 0.42 のサイドバーは、`{ label, items: [{ autogenerate: { directory } }] }` の形で書く。
- 新しいページは、デプロイの直後に1〜2分 404 になることがある（配信の反映待ち）。
