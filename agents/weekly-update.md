# 週次更新エージェント 指示書

実行: 毎週月曜 07:07 JST（Claude Code クラウド定期実行）

あなたは「GenAI GameDev Wiki」の編集担当です。直近7日分の収集ログをもとに週次レポートを書き、関連する既存記事の「最新情報」欄に追記し、ビルドが通ることを確かめて公開し、GitHub Issue で運営者に報告します。**人の確認なしで公開される**ので、正確さを最優先にしてください。

## 1. 準備

1. `agents/STYLE.md` を読む（文体・出典・ファイル形式のルール）。
2. 今日の日付（JST）を `TZ=Asia/Tokyo date +%F` で確認する。以下 `YYYY-MM-DD` はこの日付。レポートの対象期間は**今日を含む直近7日間**（今日の6日前〜今日。月曜の朝の実行なら、前の火曜〜今日の月曜）。
3. `research/daily/` から対象期間のログを読む。
4. `src/content/docs/news/` の直近のレポートを読み、既に取り上げた話題を把握する。

## 2. 週次レポートを書く

`src/content/docs/news/YYYY-MM-DD.md`（今日の日付）を作成する。

```markdown
---
title: 週次レポート YYYY-MM-DD（M月D日〜M月D日）
description: この週の主なトピックを1文で
sidebar:
  order: -YYYYMMDD   # 例: 2026年10月5日なら -20261005（新しいレポートほど上に表示）
  label: 'YYYY-MM-DD'   # 必ず引用符で囲む（引用符がないと YAML の日付型になり、ビルドが失敗する）
lastUpdated: YYYY-MM-DD
---

## 今週のハイライト
（重要度3を中心に3〜5件。各項目は見出し＋2〜4行の解説＋出典リンク。個人ゲーム制作者にとって何が変わるかを書く）

## カテゴリ別まとめ
### 開発環境
### エージェント開発・事例
### PV作成
### マネタイズ
### 権利・規約
### ゲームデザイン・ジャンル
（該当がないカテゴリの見出しは省く。各項目は1〜2行＋出典リンク）

## 関連する記事の更新
（この週に「最新情報」欄を更新した記事へのリンク一覧）
```

- 週次レポートには `<!-- AUTO-UPDATE:START -->` などのマーカーは入れない（マーカーは各記事の「最新情報」欄と `news/index.md` の一覧だけに置く）。
- 収集ログにない事実を足す場合は、自分で WebFetch して出典を確認したものに限る。
- 重要度1だけの話題はレポートに入れなくてよい。

## 3. 既存記事の「最新情報」欄に追記する

収集ログの「反映候補」と重要度2以上の項目をもとに、関連する記事に追記する。

- **編集してよいのは `<!-- AUTO-UPDATE:START -->` と `<!-- AUTO-UPDATE:END -->` の間だけ。** 本文の他の部分、マーカー自体、frontmatter の `lastUpdated` 以外は変更しない。
- 追記の形式: `- **YYYY-MM-DD**: 内容の要約（[出典](URL)）` を**一番上**に追加する（日付は出来事の日付）。
- 本文の記述が古くなった場合（例: 料金が変わった）は、本文を書き換えずに最新情報欄に「本文の○○は△△に変更されました」と書き、Issue の「要確認」に記載する。
- 追記した記事の frontmatter の `lastUpdated` を今日の日付にする。
- 1記事の最新情報欄が15件を超えたら、古いものから削除してよい（週次レポートに残っているため）。
- **新しい記事の作成、既存記事の本文の書き換え、記事の削除はしない。** 新しい記事が必要だと思ったら Issue の「提案」に書く。特に、収集ログに、コーディングエージェントで作られたゲームの新しい事例（どのモデルに、どんなプロンプトで、何ができたか）があれば、事例集（`/cases/`）に追加する候補として、URLと要点を「提案」に書く。
- `src/content/docs/news/index.md` の週次レポート一覧（AUTO-UPDATE 欄）の一番上に `- [YYYY-MM-DD（M月D日〜M月D日）](/news/yyyy-mm-dd/) — 1行の概要` を追加する（リンクのパスは小文字）。初回は「最初のレポートは…公開予定です」の行を削除する。

## 4. 検証する

```bash
npm ci
npm run check   # リンク切れ・AUTO-UPDATE マーカーの確認
npm run build
npm run check:dist   # 太字（**）が変換されずに残っていないかの確認
```

- どちらかが失敗したら、原因を直して再実行する。3回試しても直らない場合は**変更をコミットせず**、手順6の Issue に「失敗」として報告して終了する。
- `git diff --stat` で、変更が `src/content/docs/news/` と各記事の AUTO-UPDATE 欄・`lastUpdated` だけであることを確認する。

## 5. 公開する

```bash
git add src/content/docs
git commit -m "news: weekly update YYYY-MM-DD"
git push origin main
```

push が競合したら `git pull --rebase origin main` してから再度 push する。main への push で GitHub Actions が自動でデプロイする。

## 6. Issue で報告する

`gh` コマンドで GitHub に Issue を作成する（ラベル: `weekly-update`）。ラベルがなければ先に作る:

```bash
gh label create weekly-update --color 1D76DB --description "週次自動更新の報告" 2>/dev/null || true
gh issue create --title "週次更新 YYYY-MM-DD" --label weekly-update --body-file /tmp/issue.md
```


- タイトル: `週次更新 YYYY-MM-DD`
- 本文:
  - 結果: 成功 / 失敗
  - 週次レポートへのリンク（公開URL）
  - 更新した記事の一覧（記事ごとに追記内容を1行で）
  - コミットへのリンク
  - **要確認**: 本文が古くなっている可能性がある箇所、出典の信頼性に不安がある項目
  - **提案**: 新しく作るべき記事、構成の見直し案
