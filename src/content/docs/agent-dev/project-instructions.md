---
title: プロジェクトの指示ファイル（CLAUDE.md / AGENTS.md など）の書き方
description: ゲーム開発向けに指示ファイルへ何を書き、何を書かないか。各エージェントのファイル名と読み込みの仕組み、Godot・Unity・Three.js の例、コピーして使えるテンプレートを紹介します。
sidebar:
  order: 7
lastUpdated: 2026-09-29
---

## 概要

- 指示ファイルは、エージェントがセッションの開始時に読む、プロジェクト専用のメモです。ビルドやテストのコマンド、規約、禁止事項など、コードを読んでも分からないことを書きます。
- Claude Code、Codex、Cursor、GitHub Copilot、Gemini CLI、Antigravity のファイル名と読み込みの仕組みを表にまとめます。
- ゲーム開発では、ゲームのルールと用語、数値の置き場所、アセットの置き場所、エンジン固有の禁止事項を書くと効果が出やすくなります。
- 最後に、Godot、Unity、Three.js/ブラウザ向けの例と、コピーして使えるテンプレートを載せます。ファイル名の一覧と基本的な使い方は [AI駆動の開発ワークフロー](/dev-env/ai-workflow/) にもあります。この記事は、その先の書き方を扱います。

## 各エージェントの指示ファイル

| ツール | ファイル | 読み込みの仕組み | サイズの目安 |
|---|---|---|---|
| Claude Code | `CLAUDE.md`（`./CLAUDE.md` か `./.claude/CLAUDE.md`）、個人用の `CLAUDE.local.md`、`.claude/rules/*.md` | 作業ディレクトリと上位ディレクトリのものを起動時に読む。サブディレクトリのものは、そこのファイルを読んだときに読む。`@パス` で他のファイルを取り込める | 1ファイル200行未満 |
| OpenAI Codex | `AGENTS.md`、上書き用の `AGENTS.override.md` | `~/.codex` のグローバル分を読んだあと、Git のルートから作業ディレクトリまで各階層を順に読み、上から連結する。近いファイルが後ろに来て優先される | 合計32KiB（`project_doc_max_bytes` の既定値） |
| Cursor | `.cursor/rules/` の `.mdc` ファイル、`AGENTS.md` | ルールは常時適用、AIの判断で適用、特定ファイルに適用、手動の4種類。`AGENTS.md` はサブディレクトリにも置け、そのディレクトリ配下の作業に適用される | 1ルール500行未満 |
| GitHub Copilot | `.github/copilot-instructions.md`、`.github/instructions/*.instructions.md`、`AGENTS.md` | リポジトリ全体用と、`applyTo` で対象を絞るパス別のもの。`AGENTS.md` は最も近いものが優先される。ルートの `CLAUDE.md` や `GEMINI.md` も使える | — |
| Gemini CLI | `GEMINI.md`（設定の `context.fileName` で `AGENTS.md` なども指定可） | `~/.gemini/GEMINI.md`、ワークスペースと親ディレクトリ、ツールがファイルにアクセスした先の順に読む。`@ファイル` で分割できる | — |
| Antigravity | `AGENTS.md` または `GEMINI.md`、`.agents/rules/*.md` | どの階層にも置ける。`.agents/rules/` の各ファイルは YAML の前付けで、常時、AIの判断、glob、手動の4種類の起動方法を選ぶ | 1ファイル24KB、常時適用のルール全体で20,000トークン |

（2026年9月時点。出典は記事末尾の参考リンク）

読み込みの細かい違いが、書き方に影響します。

- <strong>Claude Code は、`CLAUDE.md` が1つでもあると `AGENTS.md` を読みません</strong>（既定の設定）。`AGENTS.md` だけのリポジトリなら、そのまま読みます（v2.1.277以降）。両方使うなら、`CLAUDE.md` の先頭に `@AGENTS.md` と書いて取り込みます。Windows 環境が混ざるチームでは、シンボリックリンクより取り込みの方が安全です。
- 複数のツールを併用するなら、共通部分を `AGENTS.md` に書き、ツール固有の内容だけを各ツールのファイルに書きます。
- パスを絞ったルール（Claude Code の `paths:`、Cursor の globs、Copilot の `applyTo`）は、対象のファイルを触ったときにだけ効きます。ゲームでは「`scenes/` を触るときの注意」「`src/render/` を触るときの注意」のような分け方が合います。
- Claude Code では、サブディレクトリの `CLAUDE.md` と `paths:` 付きのルールは、コンパクト後に、対象のファイルを読み直すまで戻りません。常に守らせたいことは、ルートの `CLAUDE.md` に書きます。

## ゲーム開発で何を書くか

| 項目 | 書くこと | 例 |
|---|---|---|
| 概要 | ジャンル、エンジンとバージョン、言語 | 見下ろし型アクション。Godot 4、GDScript |
| コマンド | ビルド、実行、テスト、検証。エージェントが推測できないもの | `npm run verify` は Playwright でスクリーンショットを撮る |
| 構成 | 主要なディレクトリの役割（コードから分からない意図だけ） | `src/systems/` は独立したモジュール。互いを直接 import しない |
| 規約 | 既定と違う規則 | 静的型付けを使う。`Math.random()` は禁止 |
| 禁止事項 | 触ってはいけないもの | `.tscn` を手で編集しない。`assets/generated/` は再生成のみ |
| ゲームのルール・用語 | 用語と、コードに現れにくい仕様 | 「ヒットストップ」は被弾側と攻撃側の両方を止める |
| 数値の置き場所 | 調整用の数値をどこに置くか | 速度やダメージは `tuning.ts`。コードに直接書かない |
| アセットの置き場所 | 種類ごとのディレクトリ、命名、生成物かどうか | 画像は `assets/sprites/`、名前は `snake_case` |
| 確認の手順 | 完了と言う前にやること | `npm run verify` が通り、スクリーンショットを見てから報告する |

「ゲームのルール・用語」は、ゲーム開発に固有の項目です。エージェントは、「ダッシュ」「回避」「ヒットストップ」のような用語を自分の解釈で実装します。用語を1行ずつ定義しておくと、依頼の言葉のずれを減らせます。仕様の全文は指示ファイルに入れず、`docs/` に置いて、必要なときに読ませます（[ゲームデザインドキュメント](/design/game-design-doc/)）。

## 書かない方がよいこと

Claude Code の公式ガイドは、次のものを指示ファイルに入れないよう勧めています（2026年9月時点、[Best practices](https://code.claude.com/docs/en/best-practices)）。

- コードを読めば分かること（ファイルごとの説明、ディレクトリ一覧）
- 言語の標準的な作法（「きれいなコードを書く」など、当たり前のこと）
- 長いAPI資料や解説（リンクを書く）
- 頻繁に変わる情報

ゲーム開発では、さらに次も避けます。

- 企画書や世界観の全文。数千字を毎回読み込ませるより、必要な文書を `docs/` から読ませる方が、文脈を節約できます。
- 数値の表。データファイルが正なので、指示ファイルには置き場所だけを書きます。
- 進捗（今どこまで終わったか）。変わる情報は [進捗ファイル](/agent-dev/context-management/) に分けます。

判断の目安は、公式ガイドが示す問いです。「この行を消したら、エージェントが間違えるか」。間違えないなら削ります。

## 長さの目安

Claude Code は1ファイル200行未満、Cursor は1ルール500行未満を勧めています。Codex は合計32KiB、Antigravity は1ファイル24KBが上限です。実際には、ゲーム開発の指示ファイルは100行前後に収めると、後から見直しやすくなります。

- 長くなったら、内容をパス別のルールや `docs/` に分けます。Claude Code では、`@パス` で取り込んだファイルも起動時にコンテキストに入るため、取り込みは整理の手段であり、節約にはなりません。
- 公式ガイドは、指示が長すぎると重要なルールが埋もれ、無視されやすくなると説明しています。特に守らせたい行にだけ「IMPORTANT」のような強調を付けます。多くの行を強調すると、どれも目立たなくなります。
- Claude Code では、ブロック単位の HTML コメント（`<!-- 保守メモ -->`）は、コンテキストに入る前に取り除かれます。人間向けのメモに使えます。

## 数値とアセットの置き場所を決める

エージェントは、置き場所が決まっていないと、数値をコードのあちこちに直接書きます。あとで調整するときに、探して直すのが大変になります。

```markdown
## 数値
- 調整する数値はすべて src/tuning.ts に置く（プレイヤー、敵、演出の3グループ）。
- 新しい数値を追加するときは、単位と、妥当な範囲をコメントに書く。
- 数値を変えたら、変更前後の値とその理由をコミットメッセージに書く。

## アセット
- 画像: assets/sprites/、音声: assets/audio/、フォント: assets/fonts/
- assets/generated/ は生成ツールの出力先。手で編集しない。再生成する場合は tools/gen-assets.mjs を使う。
- ファイル名は snake_case。連番は2桁（walk_00.png）。
```

手触りに関わる数値の設計は [ゲームの手触りをエージェントと詰める](/agent-dev/game-feel/) で扱います。

## エンジン別の例

### Godot

```markdown
# 概要
- 見下ろし型ローグライトアクション。Godot 4、GDScript（静的型付け）。
- 仕様は docs/specs/。実装前に該当ファイルを読む。

# コマンド
- スモーク: godot --headless --path . --quit-after 300（起動してエラーが出ないこと）
- 構文チェック: godot --headless --path . --check-only -s res://scripts/対象.gd
- テスト: ./addons/gdUnit4/runtest.sh -a res://test（GODOT_BIN は設定済み）
- 動画の書き出し: godot --path . --write-movie out.avi --fixed-fps 30（ヘッドレスでは不可）

# ルール
- プロジェクト設定で UNTYPED_DECLARATION 警告を有効にしてある。型なしの宣言を書かない。
- .tscn と .tres は手で書き換えない。エディタか MCP 経由で変更する。
- ノード間の連携はシグナルで行い、get_node("../..") のような相対参照は使わない。
- 数値は res://data/ の Resource に置く。乱数は RandomNumberGenerator に seed を設定して使う。
```

### Unity

```markdown
# 概要
- 2.5D プラットフォーマー。Unity 6、C#。

# コマンド
- EditMode テスト: Unity -runTests -batchmode -projectPath . -testPlatform EditMode -testResults results.xml
- PlayMode テスト: 同上で -testPlatform PlayMode

# ルール
- .meta ファイルは必ずコミットする。Library/ と Temp/ は除外する。
- シーンと Prefab の YAML は手で編集しない。エディタ拡張か Unity MCP 経由で変更する。
- Update() 内で new や LINQ を使わない（GC の割り当てを避ける）。
- 調整用の数値は ScriptableObject（Assets/Data/）に置く。
- 機能ごとに asmdef を分け、他の機能を直接参照しない。
```

### Three.js / ブラウザ

```markdown
# 概要
- Three.js、TypeScript、Vite。外部の画像・音声アセットは使わない（プロシージャル生成）。

# コマンド
- 開発: npm run dev（http://127.0.0.1:5173）
- 検証: npm run verify（ヘッドレスブラウザで起動、ボット操作、スクリーンショット保存、エラー0件を確認）
- 性能: npm run perf

# ルール
- ?debug=1 のとき window.__READY__ と window.__game を公開する（状態の取得、固定刻みの進行、入力の注入）。
- Math.random() は使わない。src/rng.ts の seed 付き乱数を使う。
- 毎フレームの new を避け、ベクトルや行列は使い回す。ジオメトリ、マテリアル、テクスチャは dispose する。
- 調整用の数値は src/tuning.ts。
```

`window.__game` の作り方は [検証ループ](/agent-dev/verification-loop/) にあります。

## コピーして使えるテンプレート

```markdown
# プロジェクト概要
- ジャンル: 
- エンジン・言語・バージョン: 
- 仕様: docs/specs/（実装前に該当ファイルを読む）

# コマンド
- 実行: 
- テスト: 
- 検証（スクリーンショットなど）: 
- ビルド: 

# 構成（コードから分からないことだけ）
- 

# 規約
- 

# 禁止事項
- 手で編集しないファイル: 
- 追加してはいけない依存: 

# 用語（コードに出てくる言葉の定義）
- 

# 数値とアセット
- 調整用の数値の置き場所: 
- アセットの置き場所と命名: 

# 完了の定義
- テストと検証が通ってから報告する。
- 変更したファイルと、確認した内容を報告に含める。
```

## 指示ファイルの育て方

- 空から書かず、まず生成します。Claude Code の `/init` は、コードベースを調べて下書きを作ります。既存の Cursor のルールや Copilot の指示ファイルも取り込みます。
- 同じ間違いを2回したら追記します。公式ガイドも、同じ訂正を毎回入力しているなら指示ファイルに移すよう勧めています。
- 必ず守らせたいことは、指示ファイルではなくフックで自動実行します。指示ファイルの内容は、強制ではなく文脈として渡されます（[How Claude remembers your project](https://code.claude.com/docs/en/memory)）。
- 定期的に見直します。Claude Code の `/doctor` は、コードから分かる内容や古い記述の削除案を出します。
- 読み込まれたかは、Claude Code なら `/context`（メモリファイルの一覧）で確認できます。Codex は「現在の指示を要約して」と頼む方法が公式に案内されています。

長いセッションで指示が抜け落ちる問題は [長期プロジェクトのコンテキスト管理](/agent-dev/context-management/) で扱います。プロンプトの書き方は [ゲーム開発のプロンプトの型](/agent-dev/prompt-patterns/) を参照してください。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [How Claude remembers your project（Claude Code Docs）](https://code.claude.com/docs/en/memory) — `CLAUDE.md`、`AGENTS.md` の読み込み、`.claude/rules/`、サイズの目安
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — 指示ファイルに入れる内容と入れない内容
- [Hooks guide（Claude Code Docs）](https://code.claude.com/docs/en/hooks-guide) — 必ず実行させたい処理のフック
- [AGENTS.md（Codex）](https://learn.chatgpt.com/docs/agent-configuration/agents-md) — 読み込みの順序、`project_doc_max_bytes`
- [Cursor Rules](https://cursor.com/docs/rules) — ルールの種類、`.mdc`、`AGENTS.md`、500行の目安
- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions) — Copilot の指示ファイルの種類
- [GEMINI.md files（Gemini CLI）](https://geminicli.com/docs/cli/gemini-md/) — 読み込みの階層、`@` による分割、`context.fileName`
- [Antigravity Rules](https://antigravity.google/docs/rules) — `AGENTS.md`、`GEMINI.md`、`.agents/rules/`、サイズの上限
- [AGENTS.md](https://agents.md) — 複数のツールが対応する共通形式
- [Command line tutorial（Godot Docs）](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html) — `--headless`、`--quit-after`、`--check-only`
- [Creating movies（Godot Docs）](https://docs.godotengine.org/en/stable/tutorials/animation/creating_movies.html) — `--write-movie`、`--fixed-fps`
- [Static typing in GDScript（Godot Docs）](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/static_typing.html) — `UNTYPED_DECLARATION` 警告
- [Run tests from the command line（Unity Manual）](https://docs.unity3d.com/6000.3/Documentation/Manual/test-framework/run-tests-from-command-line.html) — `-runTests`、`-batchmode`
- [gdUnit4 Command Line Tool](https://godot-gdunit-labs.github.io/gdUnit4/latest/advanced_testing/cmd/) — gdUnit4 のコマンドライン実行
