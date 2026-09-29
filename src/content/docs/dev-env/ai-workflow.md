---
title: AI駆動の開発ワークフロー
description: 仕様→実装→テスト→プレイ確認のループ、CLAUDE.mdなどの指示ファイル、Git運用、自動テスト、AIが苦手なことへの対処をまとめます。
sidebar:
  order: 4
lastUpdated: 2026-09-29
---

## 概要

AIコーディングツールを使うと、コードを書く速さは大きく上がります。一方で、ゲームは「動く」だけでは完成しません。遊んで気持ちいいか、見た目が正しいかは、人が確かめる必要があります。
この記事では、AIに実装を任せつつ品質を保つための開発ループ、プロジェクト指示ファイルの書き方、Git運用、自動テスト、AIが苦手な部分への対処を説明します。
ツールの選び方は [AIコーディングツール](/dev-env/ai-coding-tools/) を参照してください。

## 基本のループ: 仕様→実装→テスト→プレイ確認

1機能ずつ、次の4ステップを小さく回します。1周は数十分〜数時間が目安です。

| ステップ | 誰がやるか | やること |
|---|---|---|
| 1. 仕様 | 人（AIと相談） | 作る機能と「完成の条件」を短く書く |
| 2. 実装 | AI | 仕様に沿ってコードを書き、既存のテストを通す |
| 3. テスト | AI＋自動テスト | ロジックのテストを追加・実行し、失敗したら直す |
| 4. プレイ確認 | 人 | 実際に遊び、手触りと見た目を確かめる。気づいたことを次の仕様に書く |

### 1. 仕様は「完成の条件」まで書く

AIへの依頼があいまいだと、AIは推測で埋めます。次のように、確認できる形で書きます。

```markdown
## 機能: 二段ジャンプ
- 空中でジャンプボタンをもう一度押すと、1回だけ追加でジャンプする
- 着地したら回数をリセットする
- 2回目のジャンプの高さは1回目の80%
- 完成の条件: 着地判定と回数リセットのユニットテストが通ること
```

仕様は `docs/specs/` などに置き、Git で管理します。大きな機能は、先にAIに実装計画を出させ、確認してから実装させると手戻りが減ります。

実装とテストは「仕様を読んで実装し、テストを追加して、全テストが通るまで直して」と頼みます。そのために、テストのコマンドを指示ファイルに書いておきます。プレイ確認は省けない工程で、後述の「AIが苦手なこと」を中心に見ます。

## プロジェクト指示ファイル

プロジェクト指示ファイルは、AIが毎回のセッション開始時に読み込むメモです。ツールごとに名前が違います（2026年9月時点）。

| ツール | ファイル |
|---|---|
| Claude Code | `CLAUDE.md`（`AGENTS.md` も読める） |
| OpenAI Codex | `AGENTS.md` |
| Cursor | `.cursor/rules`、`AGENTS.md` |
| GitHub Copilot | `.github/copilot-instructions.md`、`AGENTS.md` |

Claude Code の公式ドキュメントでは、次のような使い方が推奨されています。

- 1ファイルあたり200行未満を目安にする。長いほど読み込みの負担が増え、指示が守られにくくなる
- 「きちんと整形して」ではなく「インデントはスペース2つ」のように、確認できる具体的な指示を書く
- `/init` コマンドで、コードベースから下書きを自動生成できる
- 特定のファイルだけに効く指示は `.claude/rules/` に分けられる
- 必ず守らせたいこと（コミット前のリントなど）は、指示ファイルではなくフック（hooks）で自動実行する

### ゲーム開発向けの例

```markdown
# プロジェクト概要
- 2D見下ろしアクション。Godot 4.7、GDScript（静的型付けを使う）
- 企画と仕様は docs/ にある。実装前に該当する仕様を読むこと

# コマンド
- テスト: ./addons/gdUnit4/runtest.sh -a res://test（環境変数 GODOT_BIN に Godot のパスを設定済み）
- 実行: godot --path . res://scenes/main.tscn

# ルール
- ゲームの数値（速度、ダメージ等）はコードに直接書かず、data/ の Resource に置く
- .tscn ファイルは手で書き換えず、エディタかMCP経由で変更する
- 1つの依頼で変更するのは1機能だけ。関係ないリファクタリングはしない
- Godot 3 の書き方（yield、export var 等）は使わない
```

テストコマンドは、使うテストフレームワークに合わせて書き換えてください。

## Git運用

AIは一度に多くのファイルを変更します。いつでも戻せるように、Git をこまめに使います。

- **小さくコミットする**: 1機能＝1コミット（または1ブランチ）にし、AIに作業させる前に自分の変更をコミットしておきます。おかしな変更はそのコミットだけ戻せます。
- **不要なファイルを除外する**: Godot 4.1 以降では `.godot/`（キャッシュ）をバージョン管理から外します。Unity では `.meta` ファイルを必ずコミットします。
- **大きなバイナリは Git LFS で管理する**: 画像・音声・3Dモデルは Git LFS（大きなファイルを別管理するGitの拡張）を使うと、リポジトリが肥大化しにくくなります。Godot の公式ドキュメントに `.gitattributes` の例があります。

## 自動テスト

ゲームは画面と入力が絡むため、全部を自動テストするのは現実的ではありません。**ロジックを画面から切り離してテストする**のが基本です。

### テストしやすいもの

- ダメージ計算、経験値、ドロップ率などの数式
- インベントリ、クエスト進行、セーブデータの読み書き
- ステージ生成など、乱数を使う処理（乱数のシードを固定すれば結果を再現できる）

### エンジン別のテスト手段

| エンジン | 手段 |
|---|---|
| Godot | gdUnit4（GDScript・C#対応）。`runtest.sh` でエディタを開かずにテストを実行でき、HTML と JUnit XML のレポートを出力する。CI（GitHub Actions など）にも組み込める |
| Unity | Unity Test Framework。`-batchmode` と `-runTests` でコマンドラインから実行できる |
| Phaser | 通常の JavaScript / TypeScript のテストツール。画面を含む確認には Playwright などのブラウザ自動化ツールでスクリーンショットを撮れる |

## AIが苦手なことと対処

### ゲームフィール（手触り）

ゲームフィールとは、操作したときの気持ちよさのことです。ジャンプの浮遊感、攻撃が当たったときの重さなどがこれにあたります。AIはコードを書けても、遊んだ感覚は分かりません。

- **調整用の数値を外に出す**: 速度・重力・硬直時間などを変数やデータファイルにまとめ、エディタや実行中のデバッグUIから変えられるようにします。この仕組み作りはAIに頼めます。
- **人が遊んで、数値で伝える**: 「もっと軽く」ではなく「重力を20%下げて」のように指示すると、意図どおりに直りやすくなります。
- 数値の調整全般は [バランス調整](/design/balancing/) も参照してください。

### 見た目の確認

AIは、画面に正しく表示されているかを自分では見られないことが多いです。

- **スクリーンショットを渡す**: 画像入力に対応したツールなら、スクリーンショットを貼って「UIが画面外にはみ出していないか」を確認させられます。
- **自動で画面を記録する**: Godot は `--write-movie` で実行中の画面を連番画像や動画に書き出せます。Phaser では Playwright でスクリーンショットを撮れます。
- **エディタ連携を使う**: Unity MCP などを使うと、AIがシーン構造やコンソールのエラーを直接読めます。

## AIの活用ポイント

- **ループを小さく保つ**: 一度に大きな機能を頼むほど、AIの誤りを見つけにくくなります。作る範囲の絞り方は [スコープの決め方](/getting-started/scope/) を参照してください。
- **同じ注意を2回したら指示ファイルに書く**: 繰り返し起きる間違いの再発を防げます。
- **テストとスクリーンショットでAIに「目」を与える**: AIが自分で結果を確かめられる手段が多いほど、任せられる範囲が広がります。
- **面白さの最終判断は人がする**: 「このゲームは面白いか」はAIに聞いても当てになりません。早めに他の人にも遊んでもらってください。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [How Claude remembers your project（Claude Code Docs）](https://code.claude.com/docs/en/memory) — `CLAUDE.md` と `AGENTS.md`、`.claude/rules/` の書き方
- [Hooks guide（Claude Code Docs）](https://code.claude.com/docs/en/hooks-guide) — 決まった操作を自動実行するフック
- [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) — Codex の `AGENTS.md`
- [Cursor Rules](https://cursor.com/docs/rules) — Cursor の指示ファイル
- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot) — Copilot の指示ファイル
- [Version control systems（Godot Docs）](https://docs.godotengine.org/en/stable/tutorials/best_practices/version_control_systems.html) — Godot の除外ファイルと Git LFS の例
- [How to Author Scenes and Prefabs with Version Control（Unity）](https://unity.com/blog/author-scenes-and-prefabs-with-verson-control) — Unity のシーンとバージョン管理
- [Command line tutorial（Godot Docs）](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html) — `--headless` や `--write-movie` などのオプション
- [gdUnit4（GitHub）](https://github.com/godot-gdunit-labs/gdUnit4) — Godot 4 向けのテストフレームワーク
- [gdUnit4 Command Line Tool](https://godot-gdunit-labs.github.io/gdUnit4/latest/advanced_testing/cmd/) — gdUnit4 のコマンドライン実行
- [Run tests from the command line（Unity Manual）](https://docs.unity3d.com/6000.3/Documentation/Manual/test-framework/run-tests-from-command-line.html) — Unity Test Framework のコマンドライン実行
- [Screenshots（Playwright）](https://playwright.dev/docs/screenshots) — ブラウザのスクリーンショット取得
- [Unity MCP overview](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.0/manual/unity-mcp-overview.html) — Unity MCP でAIがエディタにアクセスする仕組み
