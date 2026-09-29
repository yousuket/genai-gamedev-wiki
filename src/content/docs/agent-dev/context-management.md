---
title: 長期プロジェクトのコンテキスト管理
description: コンテキストが埋まると何が起きるか、セッションを分ける単位、進捗ファイルと決定の記録、コンパクト、ファイル分割、git のチェックポイント、サブエージェントの使い方を Claude Code の公式ドキュメントにもとづいて説明します。
sidebar:
  order: 8
lastUpdated: 2026-09-29
---

## 概要

- コンテキストとは、エージェントが1回の作業で「見えている」情報の全体です。会話、読んだファイル、コマンドの出力、指示ファイルが入ります。埋まるほどエージェントの精度が落ちるため、長いゲーム開発では、コンテキストを管理することが品質管理の一部になります。
- この記事では、埋まったときに起きること、セッションを分ける単位、進捗ファイル（`PROGRESS.md`）と決定の記録、コンパクトの使い方、巨大ファイルを避ける理由、git のコミットをチェックポイントにする運用、サブエージェントの使い方を扱います。
- 挙動の説明は Claude Code の公式ドキュメントにもとづきます（2026年9月時点）。考え方は他のエージェントでも共通ですが、コマンド名は Claude Code のものです。

## コンテキストが埋まると何が起きるか

Claude Code の公式ガイドは、ベストプラクティスの多くが「コンテキストはすぐ埋まり、埋まるほど性能が落ちる」という制約から来ていると説明しています。窓がいっぱいに近づくと、初期の指示を忘れたり、間違いが増えたりすることがあります（[Best practices](https://code.claude.com/docs/en/best-practices)）。

窓が近づくと、自動で圧縮（コンパクト）されます。まず古いツールの出力を消し、それでも足りなければ会話を要約します。依頼内容と重要なコードは残りますが、会話の初期にあった細かい指示は失われることがあります（[How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)）。1つのファイルや出力が大きすぎて、要約のたびにすぐ埋まる場合は、数回試したところで自動コンパクトが止まり、エラーになります。

窓の大きさは、モデルによって違います。Sonnet 5 系、Fable 系、Opus 4.7 以降（Anthropic API）は100万トークンの窓を持ち、既定では約96.7万トークンで自動コンパクトが働きます（[Model configuration](https://code.claude.com/docs/en/model-config)、2026年9月時点）。窓が大きくなっても、埋まるほど精度が落ちる性質は変わらないため、管理の考え方は同じです。

### ゲーム開発で埋まりやすいもの

| 原因 | 例 | 対策 |
|---|---|---|
| 巨大なファイル | 3,000行の `game.ts`、大きな `.tscn` | ファイルを分割する（後述） |
| ログとテスト出力 | ビルドログ、毎フレームの `console.log` | サブエージェントに実行させ、要約だけ受け取る |
| スクリーンショット | 検証のたびに撮る数十枚 | 枚数を絞り、必要な範囲を切り出す |
| 長い試行錯誤 | 直らないバグに10回以上の修正依頼 | 新しいセッションで依頼し直す |

画像は、大きさに応じてトークンを使います。Anthropic のドキュメントでは、標準の解像度のモデルで1920×1080の画像が約1,560トークン、高解像度に対応するモデル（Claude 4.7 以降）では約2,691トークンです（[Vision](https://platform.claude.com/docs/en/build-with-claude/vision)、2026年9月時点）。検証で1回に20枚見せると、数万トークンになります。

### 埋まりかけのサイン

- さっき決めた規約（例: 数値は `tuning.ts` に置く）を守らなくなる
- 一度直したバグを、別の形で再発させる
- 依頼していないファイルまで変更する
- 同じ質問を繰り返す

サインが出たら、状況を進捗ファイルに書き出させ、新しいセッションで再開します。

## セッションを分ける単位

| 単位 | 目安 |
|---|---|
| 1機能 | 仕様、実装、検証、コミットまでを1セッションで終える |
| 無関係な作業 | `/clear` で会話をリセットしてから始める |
| 実装とレビュー | 別のセッション（新しい文脈）で行う。自分が書いたコードには甘くなりやすいため |
| 直らない修正 | 2回直して直らなければ、`/clear` して、分かったことを含めた新しい依頼で始める |
| 大きな機能 | 質問形式で `SPEC.md` を書かせ、実装は新しいセッションで始める |

公式ガイドは、無関係な作業を1つのセッションに混ぜること（キッチンシンク・セッション）と、直らない修正を延々と重ねることを、典型的な失敗パターンとして挙げています。セッションには `/rename` で名前を付け、`claude --continue`（直近の再開）や `claude --resume`（一覧から選択）で再開できます。

## 進捗ファイルと決定の記録

新しいセッションは、前の会話を覚えていません。引き継ぎは、リポジトリ内のファイルで行います。Claude Code には自動メモリ（Claude が自分で書くメモ）もありますが、保存先は自分のマシンの `~/.claude/projects/` 以下で、他のマシンやチームとは共有されません（[How Claude remembers your project](https://code.claude.com/docs/en/memory)）。プロジェクトの状態は、リポジトリに置く進捗ファイルで管理します。

```markdown
# PROGRESS.md

## 現在地（2026-09-29）
- 完了: 移動、自動射撃、敵3種、ウェーブ管理
- 作業中: ボス戦（docs/specs/boss.md）。第1形態まで実装済み
- 次: 第2形態、被弾演出

## 動かし方の変更点
- npm run verify にボットプレイ60秒を追加した

## 既知の問題
- 敵が80体を超えると p95 が30msを超える（perf-notes.md 参照）

## 直近のコミット
- （git log --oneline -5 の結果を貼る）
```

決定の記録は、`docs/decisions/` などに1決定1ファイルで残します。

```markdown
# 決定: 敵AIはステートマシンにする（2026-09-20）
- 状況: 同時80体、60fps、1週間で実装
- 検討した案: ステートマシン、ビヘイビアツリー、追跡＋群れ回避
- 決定と理由: ステートマシン。デバッグしやすく、実装量が最小
- 見直す条件: 敵の種類が10を超えたとき
```

決定を記録しておくと、新しいセッションが同じ議論を蒸し返したり、決定に反する実装をしたりするのを防げます。

セッションの開始と終了に、次のように頼みます。

```text
（開始）PROGRESS.md と docs/decisions/ を読み、現在地と次にやることを3行で述べてください。まだ変更はしないでください。
（終了）今回の作業を PROGRESS.md に反映してください。完了したこと、途中のこと、次にやること、既知の問題を書き、変更をコミットしてください。
```

指示ファイルには「作業の開始時に PROGRESS.md を読む」と1行だけ書きます。進捗の中身は頻繁に変わるため、指示ファイルには入れません（[指示ファイルの書き方](/agent-dev/project-instructions/)）。

## コンパクトと要約の使い方

| 操作 | 内容 |
|---|---|
| `/compact 指示` | 要約に残す内容を指定してコンパクトする。例: `/compact 敵AIの変更内容とテストの実行方法を残して` |
| 指示ファイルの「Compact Instructions」 | コンパクト時に必ず残す内容を、指示ファイルに書いておく |
| `Esc` 2回、または `/rewind` | 会話の途中の1点を選び、「そこから先」または「そこまで」を要約する |
| `/autocompact 500k` | 自動コンパクトが働くまでの大きさを変える |
| `/context` | コンテキストの使用状況を確認する |
| `/btw` | 答えを会話に残さず、ちょっとした質問をする |

コンパクトの後に何が残るかは、読み込み方で決まります（[Explore the context window](https://code.claude.com/docs/en/context-window)）。

| 内容 | コンパクト後 |
|---|---|
| ルートの `CLAUDE.md`、自動メモリ | ディスクから再び読み込まれる |
| サブディレクトリの `CLAUDE.md`、`paths:` 付きのルール | 対象のファイルを読み直したときに戻る |
| 読んだ・編集したファイル | 最近のもの最大5つを読み直す。5,000トークンを超えるファイルは、中身ではなくパスの参照だけになる |
| 会話の中で伝えた指示 | 要約に含まれるかは保証されない |

会話の中だけで伝えた指示は、消えることがあります。残したい指示は、指示ファイルか進捗ファイルに書きます。

コンパクトのたびに決まった内容を思い出させたい場合は、`SessionStart` フックで `compact` を指定します。コマンドの標準出力がコンテキストに追加されます（[Hooks guide](https://code.claude.com/docs/en/hooks-guide)）。

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          { "type": "command", "command": "head -n 40 PROGRESS.md" }
        ]
      }
    ]
  }
}
```

## ファイルの分割とモジュール境界

巨大なファイルは、読むたびに全体がコンテキストを占めます。さらに、上の表のとおり、5,000トークンを超えるファイルはコンパクト後に中身が戻りません。1ファイルの目安は300〜500行、責務は1つにします。行数は目安ですが、1つのファイルが数千行になった時点で、エージェントの作業効率と精度が落ちやすくなります。

Claude of Duty は、境界の決め方の参考になります。約5.5万行を11のサブシステムに分け、`ARCHITECTURE.md` にサブシステムのインターフェース、ディレクトリの担当、システム間のイベントの名前、共有する型を定義していました。各エージェントは自分のディレクトリだけを編集し、他のシステムは直接 import せず、実行時に `ctx.get('fx')` のように取得する決まりです（[README](https://github.com/mshumer/Claude-of-Duty)、[ARCHITECTURE.md](https://github.com/mshumer/Claude-of-Duty/blob/main/ARCHITECTURE.md)、2026年9月時点）。

小さなゲームでも、次の形の `ARCHITECTURE.md` を最初に作らせると、分割の指針になります。

```markdown
# ARCHITECTURE.md
## システムと担当ディレクトリ
- player: src/player/  入力、移動、被弾
- enemies: src/enemies/  種類、AI、スポーン
- ui: src/ui/  HUD、メニュー
## ルール
- システム同士は直接 import しない。イベント（src/events.ts）で連携する。
- 各ファイルは400行以内を目標にする。超えたら分割する。
## イベント一覧
- enemy:killed { id, position }
- player:damaged { amount }
```

すでに巨大化したファイルを分けるときは、`/goal` が使えます。公式ドキュメントも、「各ファイルが行数の上限を満たすまで大きなファイルを分割する」を使い道の例に挙げています（[Keep Claude working toward a goal](https://code.claude.com/docs/en/goal)）。

```text
/goal src/game.ts を機能ごとのモジュールに分割し、src/ 以下のどのファイルも500行以内で、npm run verify が通り、スクリーンショット比較の差分が0であること。20ターンで止めること。
```

Godot ではスクリプトとシーンの単位、Unity では asmdef の単位が、モジュールの境界になります。

## git のコミットをチェックポイントにする

Claude Code には、編集前のファイルを保存するチェックポイント機能があり、`/rewind` で戻せます。ただし、次の制限があります（[Checkpointing](https://code.claude.com/docs/en/checkpointing)）。

- Bash コマンドで変更したファイル（`rm`、`mv`、`cp` など）は追跡されない
- サブエージェントの編集は、たいてい巻き戻せない
- セッション内の素早い復旧用で、バージョン管理の代わりにはならない

そのため、戻る地点は git で作ります。

- 大きな依頼の前に、今の状態をコミットする
- 検証（テストとスクリーンショット）が通ってからコミットする。1機能を1コミットにする
- コミットメッセージに、何を、なぜ、どう確認したかを書く。新しいセッションが `git log --oneline -20` を読めば、経緯が分かる
- 大きなリファクタリングの前に、タグを付ける（例: `git tag before-split`）
- 試したい案は別ブランチで進める。並列で試すなら git worktree を使う（[複数エージェントの並列運用](/agent-dev/parallel-agents/)）

完了の定義に「検証が通ってからコミットする」と書いておくと、エージェントが自分でチェックポイントを作ります。

## サブエージェントでコンテキストを守る

サブエージェントは、独立したコンテキストで動き、終わると要約だけを返します。テストの実行やログの読み込みのように、出力が長い作業を任せると、本体のコンテキストを守れます。公式ドキュメントも、テストの実行、ドキュメントの取得、ログの処理を、出力の多い作業として挙げています（[Subagents](https://code.claude.com/docs/en/sub-agents)、2026年9月時点）。

`.claude/agents/` に、Markdown ファイルで定義します。

```markdown
---
name: verify-runner
description: 検証（npm run verify）を実行し、失敗した項目とスクリーンショットの気づきだけを報告する
tools: Bash, Read
---

npm run verify を実行してください。
成功した項目は「成功」の1行にまとめ、失敗した項目だけを、エラーメッセージとファイル名つきで報告してください。
shots/ に保存されたスクリーンショットを見て、UIの欠け、はみ出し、真っ暗な画面があれば報告してください。
ログ全文は返さないでください。
```

使うときは「サブエージェントで検証を実行して」と頼みます。

- サブエージェントには、会話の履歴は渡りません。指示ファイルと、依頼の文面が渡ります。依頼には必要な前提をすべて書きます。
- 調べものにも使えます。「敵AIの現在の構成を、サブエージェントで調べて要約して」と頼めば、読んだファイルは本体のコンテキストに入りません。
- 実装を頼んだあとのレビューにも使えます。実装した会話とは別の文脈で見るため、見落としに気づきやすくなります（[プロンプトの型](/agent-dev/prompt-patterns/)）。
- サブエージェントは、別の文脈で動く分、トークンも別に使います。費用は [コスト管理](/agent-dev/cost-management/) を参照してください。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — コンテキスト管理、`/clear`、サブエージェント、失敗パターン
- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) — 自動コンパクトの挙動と「Compact Instructions」
- [Explore the context window](https://code.claude.com/docs/en/context-window) — 起動時に読み込まれるものと、コンパクト後に残るもの
- [How Claude remembers your project](https://code.claude.com/docs/en/memory) — 指示ファイルと自動メモリ
- [Model configuration](https://code.claude.com/docs/en/model-config) — 100万トークンの窓と自動コンパクトのしきい値
- [Checkpointing](https://code.claude.com/docs/en/checkpointing) — `/rewind` と、追跡されない変更
- [Subagents](https://code.claude.com/docs/en/sub-agents) — サブエージェントの定義と、独立したコンテキスト
- [Hooks guide](https://code.claude.com/docs/en/hooks-guide) — コンパクト後にコンテキストを再注入するフック
- [Keep Claude working toward a goal](https://code.claude.com/docs/en/goal) — `/goal` の条件の書き方
- [Vision（Claude API Docs）](https://platform.claude.com/docs/en/build-with-claude/vision) — 画像のトークン数と解像度の上限
- [Claude of Duty（GitHub）](https://github.com/mshumer/Claude-of-Duty) — サブシステム分割と `ARCHITECTURE.md` の例
