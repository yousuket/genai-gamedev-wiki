# 英訳エージェント 指示書

日本語版の記事 `src/content/docs/<slug>.md` を、英語版 `src/content/docs/en/<slug>.md` として訳す。1回の依頼で訳すのは1記事。日本語版が更新されたときの英語版の更新にも、同じ手順を使う。

英語版の位置づけ、frontmatter、見出しの対応、リンクの書き方は `agents/STYLE.md` の「英語版」にある。先にそこを読む。訳し終えた見本は `src/content/docs/en/genres/overview.md` と `src/content/docs/en/getting-started/scope.md`（原文は日本語版の同じパス）。迷ったら見本に合わせる。

## 手順

1. 日本語版を最後まで読む。
2. `src/content/docs/en/<slug>.md` に英訳を書く（新規作成、または更新）。ディレクトリがなければ作る。
3. `node scripts/check-en.mjs <slug>` を実行する。エラーが出たら直して、通るまで繰り返す。
4. `node scripts/check-content.mjs` を実行して、リンク切れがないことを確認する。
5. 日本語版や他の記事は変更しない。コミットもしない。
6. 最後に、次の3点だけを報告する（長い説明は不要）。
   - 英語版のタイトル
   - 迷った訳や、原文の誤りに見えた箇所（なければ「なし」）
   - `check-en` の結果

## 守ること（構造）

- frontmatter は `title` と `description` だけ英訳する。`sidebar.order`、`lastUpdated`、`template` などは日本語版と同じ値にする。
- 見出しの数と順番、表の行数、箇条書き、コードブロック、`:::note` などの aside、`<!-- AUTO-UPDATE:START/END -->` のマーカーを、日本語版と同じにする。
- 見出しは英語にする。共通の見出しは決まった訳にする。
  - `## 概要` → `## Overview`
  - `## AIの活用ポイント` → `## How to use AI`
  - `## 最新情報` → `## Latest updates`
  - `## 参考リンク` → `## References`
- **すべての URL を、日本語版と同じものを残す。** 1つも落とさず、足さない。出典の記述を省略・要約しない。
- Wiki内リンクは、先頭に `/en/` を付ける（`/genres/overview/` → `/en/genres/overview/`）。リンクの文字列は、リンク先の記事の英語タイトルに合わせる（訳済みの記事は `src/content/docs/en/` で確認。未訳なら自然な英語にする）。
- 記事内のページ内リンク（`#参考リンク` など）は、英語版の見出しに合わせる（`#references`）。
- 出典が日本語のページなら、リンクの後に `(in Japanese)` を付ける（表の出典欄、参考リンクの一覧の両方）。
- 太字 `**` が、閉じ括弧の直後に文字が続く場所で崩れる場合は `<strong>` を使う。
- コードブロックの中身（コマンド、設定、JSON）は訳さない。ただし中のコメントや、プロンプト例の日本語は、記事の説明に必要なら英訳する。日本語のままにするのは、ゲーム内に実際に出る日本語のテキストなど、そのままでなければ意味がないものだけ。
- 日本語の固有名詞（作品名・サービス名）は、英語圏での名前にする。公式の英語名がなければ、ローマ字か通称にして、初出で日本語名を括弧で併記する（例: The Exit 8 (8番出口)）。

## 守ること（文体と内容）

- 平易な英語。1文は短く。短縮形（don't など）は使わず、do not のように書く。です・ます調のような丁寧さは、自然な英語の丁寧さにする。
- 誇張や宣伝的な表現を足さない。原文にない情報・意見・注意書きを足さない。原文にある事実を省かない。
- 「（2026年9月時点）」は「(as of September 2026)」にする。日付は `2026-10-05` のような ISO 形式のまま。
- 数の表記を英語圏の読みに直す。300万本 → 3 million copies、約2週間 → about two weeks、1,000円 → 1,000 yen（または ¥1,000）。
- 引用符は直線の `"` を使う。原文の「」は `"` に置き換える。
- 見出しや本文中の「〜しよう」のような呼びかけは、命令形か、"you" を主語にした文にする。
- AIに渡すプロンプトの例が日本語で書かれている場合は、英語にして、英語圏の読者がそのまま使える形にする。

## 用語集

| 日本語 | 英語 |
|---|---|
| 生成AI | generative AI |
| コーディングエージェント | coding agent |
| ポン出し | one-shot（"one-shot generation" / "one-shot prompting"） |
| 検証ループ | verification loop |
| 仕様書駆動 | spec-driven development |
| 並列開発（エージェント） | parallel agents |
| コンテキスト管理 | context management |
| プロジェクトの指示ファイル | project instruction file（CLAUDE.md / AGENTS.md） |
| コアループ | core loop |
| バーティカルスライス | vertical slice |
| スコープ | scope |
| 企画書 | design document |
| プレイテスト | playtest / playtesting |
| 手触り（操作感） | game feel |
| バランス調整 | balancing |
| レベルデザイン | level design |
| ゲームジャム | game jam |
| 体験版 | demo |
| 近日登場ページ | Coming Soon page |
| ウィッシュリスト | wishlist |
| ストアページ | store page |
| 事例・ポストモーテム | case studies / postmortems |
| PV（プロモーション映像） | trailer |
| 権利・規約 | rights and terms |
| 二次情報 / 一次情報 | secondary information / primary sources |
| 商用利用 | commercial use |
| 週次レポート | weekly report |
| 最新動向 | latest news |
| 個人開発（者） | solo development (solo developer) |
| アセット | assets |
| 画風 | visual style / art style |
| 手続き型生成 | procedural generation |
| ゲームエンジン | game engine |
| SNS | social media |

用語集にない語は、ゲーム開発・Web開発で一般的な英語を使う。同じ語は、同じ記事の中で同じ訳に統一する。
