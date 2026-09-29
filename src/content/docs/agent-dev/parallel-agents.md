---
title: サブエージェントと並列開発
description: サブエージェント、git worktree、エージェントチームの仕組みと使い分け、Claude of Duty のモジュール分担と批評役の構成、衝突・マージ・コストの管理を解説します。
sidebar:
  order: 11
lastUpdated: 2026-09-29
---

## 概要

コーディングエージェントは、1つの作業を1本の会話で進めるだけでなく、複数のエージェントに仕事を分けて同時に走らせることもできます。
この記事では、Claude Code の並列実行の道具（サブエージェント、git worktree、エージェントチームなど）の違い、モジュール単位の分担のしかた、Claude of Duty が公開している構成、衝突とマージの管理、並列にしない方がよい場面、コストへの影響を説明します。
Claude of Duty の全体像は [Claude of Duty の事例](/cases/claude-of-duty/)、ポン出し（一発生成）の考え方は [ポン出し（一発生成）の技術](/agent-dev/one-shot/) を参照してください。

## 並列実行の道具

Claude Code の公式ドキュメントでは、複数の作業を同時に進める方法を次のように整理しています（2026年9月時点）。

| 道具 | 何をするか | 向く場面 |
|---|---|---|
| サブエージェント | 1つのセッション内で、別の作業者が独立したコンテキストで作業し、要約だけを返す | 調査やテスト実行など、出力が多くて本会話を汚したくない作業 |
| git worktree | 同じリポジトリの別の作業ディレクトリとブランチを作り、セッションごとにファイル編集を隔離する | 複数のセッションが同じファイルを触るのを避けたいとき |
| エージェントビュー（`claude agents`） | 独立した作業をバックグラウンドのセッションに渡し、1画面で進捗を見る。リサーチプレビュー | 互いに関係の薄い作業をいくつか任せて、あとで確認したいとき |
| エージェントチーム | リーダーが複数のセッションに作業を割り当て、共有のタスク一覧とメッセージで連携させる。実験的機能で、既定では無効 | プロジェクトを分割して、作業者どうしを連携させたいとき |
| 動的ワークフロー | Claude が書いたスクリプトが多数のサブエージェントを動かし、結果を相互に検証する | 数十〜数百のエージェントが必要な監査や移行。Claude Code の `ultracode` 設定もこれを使う |
| `/batch` | 大きな変更を5〜30個のサブエージェントに分け、それぞれを worktree で隔離する | 多数のファイルにまたがる機械的な変更 |

出典: [Run agents in parallel](https://code.claude.com/docs/en/agents)、[Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows)、[Model configuration](https://code.claude.com/docs/en/model-config)

同じドキュメントによれば、使い分けの軸は「誰が全体を調整するか」「作業者どうしが会話する必要があるか」「同じファイルを触るか」の3つです。同じファイルを触るなら worktree で隔離します。エージェントチームは worktree で隔離しないので、担当するファイルをあらかじめ分けておく必要があります。

## サブエージェントの仕組み

サブエージェントは、独自のコンテキストウィンドウ、システムプロンプト、使えるツール、権限を持つ作業者です。作業の途中経過は本会話に流れ込まず、最後の要約だけが戻ります。ただし、サブエージェント自身のリクエストも同じ利用枠を消費します。

ドキュメントに書かれている主な仕様は次のとおりです（2026年9月時点、[Create custom subagents](https://code.claude.com/docs/en/sub-agents)）。

- 組み込みの Explore（読み取り専用の探索）、Plan（計画用の調査）、general-purpose（調査と編集の両方）がある
- 自分で作るサブエージェントは、`.claude/agents/` に置く Markdown ファイル（先頭に YAML の設定）
- 同時に動かせる数の既定の上限は20。深さ（サブエージェントがさらにサブエージェントを呼ぶ段数）の既定は3
- 設定項目に `model`（使うモデル）と `isolation: worktree`（専用の worktree で動かす）がある

### 担当モジュールを持つサブエージェントの例

音を担当するサブエージェントの定義例です。この記事のために書いた例で、`src/audio/` 以外は触らせない前提です。

```markdown
---
name: audio-owner
description: src/audio/ だけを担当し、効果音とBGMの合成コードを書く。ほかのディレクトリは編集しない
tools: Read, Edit, Write, Glob, Grep, Bash
model: sonnet
isolation: worktree
---

あなたは src/audio/ の担当者です。
- docs/ARCHITECTURE.md を最初に読み、インターフェースとイベント名に従う
- src/audio/ の外のファイルは編集しない。必要な変更はレポートに書いて親に伝える
- 完了の条件: npm run build が通り、npm test が通ること
- 終わったら、変更したファイルと追加したイベントを箇条書きで報告する
```

見た目を採点する批評役は、コードを編集させず、スクリーンショットの撮影と閲覧だけをさせます。

```markdown
---
name: visual-critic
description: スクリーンショットを見て、見た目の質を10点満点で厳しく採点する。コードは編集しない
tools: Read, Glob, Bash
model: opus
---

あなたは厳しい批評役です。npm run shot でスクリーンショットを撮り、画像を見て採点してください。
- 良い点は書かず、欠点だけを具体的に挙げる（場所、症状、どう見えるか）
- 欠点は「重大」「中」「軽微」に分け、重大なものから最大5件まで報告する
- 最後に10点満点の点数を1つ付ける
```

## Claude of Duty の構成

Claude of Duty は、Matt Shumer 氏が2026年7月25日に公開した、Three.js 製のFPSです。リポジトリは MIT License で、README には「約5.5万行、11のサブシステム、オーケストレーションされたAIエージェント群が書いた」と書かれています。報道では、使ったモデルは Claude Opus 5 とされています（[Digital Today](https://www.digitaltoday.co.kr/en/view/86733/three-paragraph-prompt-enough-claude-opus-5-builds-fps-game-two-days-after-launch)）。

### プロンプトは3段落

リポジトリの `prompt.md` は「このリポジトリを生んだプロンプトの全文」として公開されています。内容は3つの要素です（要約）。

1. 最新の Call of Duty 級の見た目と品質のFPSを Three.js で作る
2. サブエージェントを展開して項目ごとに担当させ、別のサブエージェントに見た目を検査させる
3. 検査役は厳しい批評役で、本物の Call of Duty と並べた目隠し比較で勝つまで繰り返す

プロンプトには構成の指定がほとんどなく、11のサブシステムへの分け方は、後述の設計書（`ARCHITECTURE.md`）に現れています。

### 設計書が調整の唯一の手段だった

`ARCHITECTURE.md` は冒頭で「すべてのエージェントはコードを書く前にこれを読むこと。唯一の調整手段である」と宣言しています。並列作業を安全にするためのルールが具体的に書かれているので、自分のプロジェクトにも流用できます。

| ルール（要約） | 狙い |
|---|---|
| 自分のディレクトリだけを所有し、外は編集しない | 他の担当者の変更を消さない |
| 他のサブシステムを直接 import せず、実行時に `ctx.get('fx')` のように取得する | モジュール間の依存を切り、並列作業を安全にする |
| 新しい npm 依存を足さない（`three` のみ） | 依存の増殖を防ぐ |
| ゲームや描画の乱数は、種つきの共通乱数を使う | 撮影結果を再現できるようにする |
| フレームごとにメモリを確保しない | 性能の劣化を防ぐ |
| 変更後に `npm run build` が通り、撮影ツールが1枚撮れること | ビルドが壊れると全員の作業が止まる |

さらに、サブシステムごとの担当ディレクトリ表、サブシステム間のイベント名と中身の一覧、共有の型（表面の種類）が定義されています。共有部分（`src/core/`、`src/main.js`、`tools/` など）は、全体の責任者だけが編集します。

### 批評役の使い方

README によれば、11人の独立した批評役が、画面のスクリーンショットを Call of Duty と比べて採点しました。点数は 3.59、4.14、4.05、5.05（10点満点）と推移し、最後まで「本物の Call of Duty を選ぶ」結果は変わりませんでした。作者自身が「目標には届いていない」と認めています。

批評役の報告が間違っていた例も記録されています。3ラウンドにわたり、批評役は武器を「テクスチャなし」と報告しました。実際は光沢が強すぎて拡散反射が弱かったのが原因で、それまでのラウンドは明るさへの指摘に応えてアルベド（素の色）を暗くしており、逆に悪化させていました。原因を突き止めたエージェントは、依頼内容とは逆の修正をしています。批評役の指摘を鵜呑みにせず、数値で確かめる工程が要ります。

### 並列より順番の方が効いた

README の「プロセスの注記」は、並列展開について次の結果を報告しています。

| 方法 | 点数の変化 | 致命的な欠陥の数 |
|---|---|---|
| 6人のエージェントが各自のディレクトリを担当する並列ラウンドを3回 | +0.46 | 60 → 47 → 66（開始時より増えた） |
| 密に結合した関心事ごとに、担当者を1人にした逐次の1パス | +1.00 | 66 → 26 |

理由として、トーンマッピング（明るさの階調変換）、空、間接光は1つの結合したシステムであり、独立したエージェントが互いの前提を壊し続けたと書かれています。作者の結論は「逐次で担当者を1人にする方が、並列の展開より明確に勝った」です。

この結果からの推測ですが、分ける単位は「ディレクトリ」ではなく「結合の強さ」であるべきだと考えられます。根拠は上の表で、欠陥が増えたのは結合の強い描画まわりでした。音、UI、物理のように境界がはっきりしたモジュールは並列に向き、描画の色調、光、影のように互いに影響し合うものは、1人（1エージェント）に任せて順番に直す方が安定しました。

## 手を動かして再現する

自分のブラウザゲームで小さく再現する手順です。3つのモジュール（音、UI、敵）を並列に作る例で説明します。

### 1. 設計書を先に書く

`docs/ARCHITECTURE.md` を作ります。最低限、次を書きます。

```markdown
# アーキテクチャ（全エージェントが最初に読む）

## 所有権
| モジュール | ディレクトリ | 担当が編集してよい範囲 |
|---|---|---|
| audio | src/audio/ | このディレクトリのみ |
| ui | src/ui/ | このディレクトリのみ |
| enemy | src/enemy/ | このディレクトリのみ |
共有（親だけが編集）: src/core/, src/main.js, package.json, docs/

## インターフェース
- 各モジュールは init(ctx) と update(dt) を持つクラスをエクスポートする
- 他モジュールは ctx.get('audio') のように実行時に取得する（import しない）

## イベント（追加するときはこの表に行を足す）
| 名前 | 中身 | 発行元 |
|---|---|---|
| enemy:died | { position, score } | enemy |
| player:hit | { damage } | core |

## ルール
- 新しい npm 依存を足さない
- npm run build と npm test が通らない変更は完了にしない
```

### 2. 土台を親が作ってから、モジュールを分ける

共有の土台（`ctx`、イベント、`main.js`）は親が先に作り、コミットします。土台がない状態で並列に始めると、各エージェントが別々に土台を作り始めます。

### 3. 並列に走らせる

サブエージェントに任せる場合の依頼文の例です。

```text
docs/ARCHITECTURE.md を読み、audio・ui・enemy の3モジュールを、それぞれ別のサブエージェント
（worktree で隔離）に担当させてください。
- 各担当は自分のディレクトリ以外を編集しない
- 完了の条件は npm run build と npm test が通ること
- 同時に動かすサブエージェントは3つまで
- 全員が終わったら、親が1つずつマージし、そのたびにテストを実行する
```

自分でセッションを分けるなら、worktree を使います（[Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees)）。

```bash
claude --worktree audio   # .claude/worktrees/audio/ に作業ツリーと worktree-audio ブランチを作って起動
claude --worktree ui      # 別のターミナルで、もう1つ
```

worktree は新しいチェックアウトなので、それぞれで `npm install` が要ります。`.env` のような git 管理外のファイルを引き継ぐには `.worktreeinclude` を使います。`.claude/worktrees/` は `.gitignore` に入れておきます。Claude Code を使わずに手で作る場合は `git worktree add ../game-audio -b feat/audio` です（[git worktree](https://git-scm.com/docs/git-worktree)）。

開発サーバーを並列で起動するとポートがぶつかります。Vite は既定では使用中なら次のポートを自動で試すので、エージェントに「どのポートで動いているか」を出力させるか、ワークツリーごとにポートを固定します（[Server Options](https://vite.dev/config/server-options)）。incident.io の記事でも、データベースやポートの扱いが並列化の悩みどころとして挙げられています（[incident.io](https://incident.io/blog/shipping-faster-with-claude-code-and-git-worktrees)）。

## 衝突とマージの管理

並列開発でいちばん衝突しやすいのは、全員が触る場所です。

| 衝突しやすい場所 | 対策 |
|---|---|
| `main.js` などのモジュール登録 | 親だけが編集する。担当は「登録が要る」と報告する |
| `package.json` とロックファイル | 依存の追加を禁止する。必要なら親が追加する |
| イベント名の一覧、共有の型 | 設計書の表に行を足す形にし、追加は親が取りまとめる |
| 設定値のファイル | モジュールごとに設定ファイルを分ける |

マージの進め方は次のとおりです。

1. 依存の少ないモジュール（音、UI）から先にマージする
2. マージのたびに、ビルドとテストと、スクリーンショット1枚の確認をする
3. 衝突したら、両方の変更の意図を説明させたうえで解決させる。解決後は必ずテストを回す

Anthropic の Nicholas Carlini 氏は、16のエージェントを並列に走らせて C コンパイラを作った実験を公開しています。各エージェントは、`current_tasks/` にテキストファイルを書いて作業に「ロック」をかけ、git の同期でぶつかりを防ぎました。マージの衝突は頻繁に起きましたが、エージェントが自分で解決できたと報告されています。一方で、Linux カーネルのコンパイルのような「1つの巨大な作業」では、全員が同じバグに当たって互いの修正を上書きしました。この場合は、既知の正しいコンパイラ（GCC）と組み合わせて検証範囲を分割する仕組みを作り、並列化できる形に直しています（[Anthropic Engineering](https://www.anthropic.com/engineering/building-c-compiler)）。

Cursor の記事では、対等なエージェントがロックで調整する方式は、ロックの取りっぱなしなどで20のエージェントが2〜3のエージェント並みの速度に落ち、うまくいかなかったと報告されています。計画役が作業を作り、作業役が黙々と実行する階層型に変えてうまくいったとされています（[Cursor](https://cursor.com/blog/scaling-agents)）。

## 並列にしない方がよい場面

| 場面 | 理由 |
|---|---|
| 描画の色調と光のように、結合が強い部分 | Claude of Duty で、並列より逐次の方が効いた |
| 同じファイルを何人もが触る | 上書きが起きる。Carlini 氏の実験でも起きた |
| 設計が固まっていない初期 | 各担当が別々の前提で作り、あとで食い違う。先に [仕様駆動の進め方](/agent-dev/spec-driven/) で決める |
| 数回のツール呼び出しで終わる小さな作業 | 起動と要約のコストの方が大きい。Anthropic は Opus 5 について、小さな作業への委任はコストと時間を増やすと説明している |
| 手触りの調整 | 人が遊んで判断する工程は、並列にしても速くならない。[手触りの作り込み](/agent-dev/game-feel/) を参照 |
| 検証手段がない | 各担当が「できた」と言うだけになり、統合時に壊れる。[検証ループ](/agent-dev/verification-loop/) を先に作る |

## コストへの影響

並列にするほど、使うトークンは増えます。公開されている数字は次のとおりです。

| 出典 | 数字 |
|---|---|
| Anthropic のマルチエージェント研究システムの記事 | エージェントは通常のチャットの約4倍、マルチエージェントは約15倍のトークンを使う |
| Claude Code のコスト管理のドキュメント | エージェントチームは、各メンバーが計画モードで動く場合、通常のセッションの約7倍のトークンを使う |
| Carlini 氏の C コンパイラの実験 | 約2,000セッション、入力20億トークン、出力1.4億トークンで、費用は2万ドル弱 |

Opus 5 は、以前のモデルより積極的にサブエージェントへ委任する傾向があるとされ、公式のプロンプトガイドは、委任してよい場面を指示に書くこと、または上限を決定的に設定することを勧めています。Claude Code では環境変数 `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`（深さ）と `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`（同時数）で上限を設けられます。`ultracode` を有効にしたセッションでは、同時数の上限が適用されません。

節約の要点は、担当のモデルを小さくすること（メンバーには Sonnet を使うことがドキュメントで勧められている）、チームを小さく保つこと、終わったメンバーを止めることです。料金の見積もりは [コストと利用枠の管理](/agent-dev/cost-management/) にまとめています。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Run agents in parallel（Claude Code Docs）](https://code.claude.com/docs/en/agents) — 並列実行の方法の比較
- [Create custom subagents（Claude Code Docs）](https://code.claude.com/docs/en/sub-agents) — サブエージェントの定義、モデル、上限
- [Run parallel sessions with worktrees（Claude Code Docs）](https://code.claude.com/docs/en/worktrees) — `--worktree` と、サブエージェントの隔離
- [Orchestrate teams of Claude Code sessions（Claude Code Docs）](https://code.claude.com/docs/en/agent-teams) — エージェントチームと、ファイル衝突の避け方
- [Orchestrate subagents at scale with dynamic workflows（Claude Code Docs）](https://code.claude.com/docs/en/workflows) — 動的ワークフロー
- [Manage costs effectively（Claude Code Docs）](https://code.claude.com/docs/en/costs) — エージェントチームのトークン消費
- [Model configuration（Claude Code Docs）](https://code.claude.com/docs/en/model-config) — `ultracode` の説明
- [Claude-of-Duty（GitHub）](https://github.com/mshumer/Claude-of-Duty) — README、`ARCHITECTURE.md`、`prompt.md`
- [Prompting Claude Opus 5（Claude API Docs）](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5) — サブエージェントへの委任の制御
- [Building a C compiler with a team of parallel Claudes（Anthropic）](https://www.anthropic.com/engineering/building-c-compiler) — 16エージェントの並列実験
- [Scaling long-running autonomous coding（Cursor）](https://cursor.com/blog/scaling-agents) — ロック方式と階層型の比較
- [How we built our multi-agent research system（Anthropic）](https://www.anthropic.com/engineering/multi-agent-research-system) — マルチエージェントのトークン消費
- [How we're shipping faster with Claude Code and Git Worktrees（incident.io）](https://incident.io/blog/shipping-faster-with-claude-code-and-git-worktrees) — worktree を使った並列開発の経験談
- [git worktree（Git Documentation）](https://git-scm.com/docs/git-worktree) — worktree のコマンド
- [Server Options（Vite）](https://vite.dev/config/server-options) — ポートの既定の動作と `strictPort`
