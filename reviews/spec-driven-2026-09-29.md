# 「仕様書駆動」記事の修正提案

- 作成日: 2026-09-29
- レビュー対象: `src/content/docs/agent-dev/spec-driven.md` と公開ページ `https://yousuket.github.io/genai-gamedev-wiki/agent-dev/spec-driven/`
- 確認時のコミット: `e713fb464ef9f8e4dcf905f52aa3b31b7dd8dcba`
- 範囲: 事実・出典、実用性、文章構成、公開ページの使い勝手
- 状態: 提案。記事やスタイルの修正は未実施。

## 1. モバイルで比較表の右列を読めるようにする（優先度: 高）

### 現状と根拠

390px 幅の公開ページで「仕様駆動のツールと手法」の3列表を確認した。表の表示幅は約339px、内容幅は約513px。右端の「向く場面」列が画面から切れている。`src/styles/theme.css` の `.sl-markdown-content table` にある `overflow: hidden` のため、表そのものを横スクロールできない。コードブロックは `overflow-x: auto` で横スクロールできている。

### 修正案

- 表の角丸・枠線を保ちつつ、幅を超えた表は横スクロールできるようにする。表の外側にスクロール用の要素を置くか、既存の Starlight の表スタイルとの関係を整理する。
- 表の右に続きがあることがモバイルで分かる表示を検討する。
- この CSS はサイト内の全表に効くため、この記事以外の表も確認する。

### 完了条件

- 375px と390px の幅で「手法・ツール」「内容」「向く場面」の3列を操作して読める。
- 本文全体が横にスクロールしない。デスクトップ表示、ライト／ダーク両テーマで表の枠線と角丸が崩れない。

## 2. Spec Kit の導入手順を既存プロジェクト向けに具体化する（優先度: 中）

### 現状と根拠

「仕様駆動のツールと手法」の表には `uv tool install specify-cli` と `specify init` がある。しかし `specify init` だけでは、既存のゲームリポジトリを対象にすることも、Claude Code 向けの integration を選ぶことも読み取れない。非対話実行では integration の既定が GitHub Copilot になる。既存プロジェクト向けの公式手順は、変更をレビューできる状態にしてから `specify init --here --force --integration claude` を実行する。`uv` は推奨される導入手段だが、公式のインストールガイドには `pipx` などの代替もある。

### 修正案

- 表では導入手順の要約にとどめ、既存プロジェクト向けのコマンドと公式ガイドへのリンクを表の下に示す。
- 例: 「既存のリポジトリでは、変更をコミットするなど差分を確認できる状態にしてから `specify init --here --force --integration claude` を実行する。新規プロジェクトでは `specify init mygame --integration claude`。`--force` は既存の Spec Kit 管理ファイルを更新し得るため、実行後に差分を確認する」。
- 「uv が必要」は「ここでは uv を使う」に変更するか、他の公式導入手段があることを補足する。

### 完了条件

- Claude Code を使う読者が、既存プロジェクトと新規プロジェクトのコマンドを区別できる。
- コマンド、前提条件、他の導入手段の説明が公式資料と一致する。

### 一次情報

- [Spec Kit: 既存プロジェクトへの導入](https://github.github.io/spec-kit/guides/existing-projects.html)
- [Spec Kit: init のオプション](https://github.com/github/spec-kit/blob/main/docs/reference/core.md)
- [Spec Kit: インストール](https://github.com/github/spec-kit/blob/main/docs/installation.md)

## 3. 独自テンプレートと Spec Kit の生成ファイルを区別する（優先度: 中）

### 現状と根拠

記事の前半は独自の `CLAUDE.md`／`SPEC.md`／`TODO.md`／`tasks/` を提案し、後半の「ゲームで使うときの対応」表は `constitution → CLAUDE.md、AGENTS.md`、`specify → SPEC.md`、`tasks → TODO.md` と示す。この表は概念の対応としては有用だが、Spec Kit がこれらのルートファイルを生成・更新するという印象を与える。実際の Spec Kit はプロジェクト原則を `.specify/memory/constitution.md`、機能別の仕様・計画・タスクを `specs/<機能>/spec.md`、`plan.md`、`tasks.md` に置く。

### 修正案

- 対応表の直前に「以下は考え方の対応であり、Spec Kit の実際のファイル名・生成先ではない」と明記する。
- 表の後に Spec Kit の実際のファイル配置を1〜2行で示す。記事前半の `SPEC.md` 方式と Spec Kit 方式は、読者がどちらかを選べる形にする。

### 完了条件

- 読者が `SPEC.md` と `specs/<機能>/spec.md` を取り違えず、採用した方法のファイルを見つけられる。

### 一次情報

- [Spec Kit: 仕様を更新する方法とファイル配置](https://github.com/github/spec-kit/blob/main/docs/guides/evolving-specs.md)
- [Spec Kit: プロジェクト原則の配置](https://github.github.io/spec-kit/upgrade.html)

## 4. ダッシュ機能でテンプレートの記入例をつなぐ（優先度: 中）

### 現状と根拠

記事前半にはダッシュの仕様の一部があり、後半にはコピー用の `SPEC.md`、`tasks/NNN-名前.md`、`TODO.md` がある。ただし後半は空欄の型なので、初心者は同じ要件が3ファイルにどう分かれるかを追えない。

### 修正案

- ダッシュを題材に、`SPEC.md` の機能定義、`tasks/012-dash.md` の受け入れ条件、`TODO.md` の進行状態を、それぞれ短い記入済みの例で示す。
- 受け入れ条件には、正常動作だけでなく「壁に向かってダッシュしたとき」「再使用待ち中に Shift を押したとき」など、実装結果を判定できる例を入れる。数値と挙動は同じ仕様にそろえる。
- コピー用の空欄テンプレートは残し、記入例と区別する。

### 完了条件

- 3ファイルの役割と依存関係を、ダッシュの1機能だけで追える。
- 受け入れ条件から実行するテストと人が確認する項目を判別できる。

## 5. 冒頭の重複を短くする（優先度: 低）

`description` は記事の扱う項目を長く列挙し、「概要」でもほぼ同じ項目を繰り返す。スマートフォンではタイトルと説明文で最初の画面の多くを使う。`description` は読者が得る成果を1文で述べ、列挙は「概要」に任せると本文に早く到達できる。

## 修正後の確認

1. `npm run check`、`npm run build`、`npm run check:dist` を実行する。
2. 公開相当のページをデスクトップと375px／390pxで確認する。表、コードブロック、目次、記事内リンクを操作する。
3. Spec Kit の説明とコマンドを上記の一次情報に照らして再確認する。
4. Claude Code などが同時に記事を更新している場合は、修正前に最新の差分を読み直す。
