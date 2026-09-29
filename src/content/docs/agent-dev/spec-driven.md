---
title: 仕様書駆動：企画書をエージェントに渡せる形にする
description: 企画書を、エージェントに渡せる仕様と受け入れ条件に書き換える方法を、コピーして使えるテンプレートつきで説明します。
sidebar:
  order: 5
lastUpdated: 2026-09-29
---

## 概要

ポン出しは仕様がなくても動きます。しかし、その先の反復では、「何ができたら完了か」を文書にしておかないと、エージェントも人も、終わりを判断できません。
この記事では、企画書をエージェントに渡せる形にする方法、タスク分割、受け入れ条件（何ができたら完了か）、仕様ファイルをリポジトリに置く運用、仕様駆動のツール、コピーして使えるテンプレートを説明します。
プロンプト例とテンプレートは、この記事のために書いた例です。

## なぜ仕様が要るのか

Claude Code の公式ドキュメントは、エージェントは作業が終わったように見えると止まると説明しています。実行できる確認手段がなければ、「終わったように見える」ことだけが手がかりになり、人が確認役になります（[Best practices](https://code.claude.com/docs/en/best-practices)、2026年9月時点）。仕様の中の「受け入れ条件」が、その確認手段を決めます。

同じドキュメントは、大きな機能では、エージェントに質問させて仕様を作り、新しい会話で仕様に沿って実装させる方法を勧めています。役に立つ仕様の条件として、関係するファイルやインターフェースの名前が挙がっていること、対象外が明記されていること、最後に機能が動くことを確かめる手順があることが挙げられています。

Claude of Duty は、複数のエージェントが作業するために、`ARCHITECTURE.md` を「唯一の調整手段」として置いていました（[リポジトリ](https://github.com/mshumer/Claude-of-Duty)）。内容は次の4つです。

| 内容 | 中身 |
|---|---|
| 守るルール | 自分の担当ディレクトリ以外は編集しない。他の部分のモジュールを直接読み込まない。乱数は決まった関数から取る。毎フレームでメモリを確保しない。ビルドが通ること |
| 部品の共通の形 | 初期化、更新、破棄などの決まった関数を持つ |
| 担当の一覧 | 部品ごとに、担当ディレクトリと責務を表にしたもの |
| 部品同士のやり取り | イベントの名前と、運ぶ情報の一覧 |

ゲームの仕様は、企画の説明だけでなく、エージェントの動き方の約束でもあります。

## 企画書から、エージェント向けの仕様へ

企画書（[企画書テンプレート](/design/game-design-doc/)）は、人が読むための文書です。エージェントに渡すときは、次のように書き換えます。

| 人向けの書き方 | エージェント向けの書き方 |
|---|---|
| 「ダッシュが気持ちいい」 | 「ダッシュの距離は3タイル、所要時間は0.2秒。値は data/feel.json」 |
| 数値を本文に埋め込む | 数値はデータファイルに置き、本文はファイルへのリンク |
| 「敵を実装する」 | 「src/enemies/ に追加。共通の形は src/enemies/base.js に従う」 |
| 暗黙の前提 | 「やらないこと」を明記する |
| 「できたら見せて」 | 確かめ方（コマンド、画面、人が確認）を書く |

書き換えの例です。

```markdown
## ダッシュ（変更前）
ダッシュは短い距離を素早く移動する。気持ちよく。

## ダッシュ（変更後）
- Shift でダッシュ。向いている方向に3タイル、0.2秒で移動する
- 移動中は敵の弾に当たらない。終わったら、0.5秒は再使用できない
- 値は data/feel.json の dash.* に置く（コードに直接書かない）
- 対象外: 空中でのダッシュ、ダッシュ中の攻撃
- 確かめ方: tests/dash.test.js が通る。手触りは人が確認する
```

「気持ちよく」の部分は、書けません。手触りは、人が触って、数値で決めます（[ゲームフィール](/agent-dev/game-feel/)）。仕様では、その数値を置く場所と、人が確認することを書いておきます。

## 仕様ファイルの置き方

仕様は3層に分け、リポジトリに置きます。

```text
mygame/
  CLAUDE.md（または AGENTS.md）   # 常設のルール。短く
  SPEC.md                         # 製品の仕様
  TODO.md                         # タスクの一覧と状態
  tasks/
    012-dash.md                   # タスクごとの仕様と受け入れ条件
  docs/decisions/                 # 決めたことと、その理由
```

| 層 | ファイル | 中身 | 更新の頻度 |
|---|---|---|---|
| 常設 | CLAUDE.md、AGENTS.md | 起動とテストのコマンド、守るルール | 同じ注意を2回したとき |
| 製品 | SPEC.md | ゲームの仕様、対象外、確かめ方 | 方針が変わったとき |
| タスク | TODO.md、tasks/ | 1回の依頼の単位。受け入れ条件つき | 毎回 |

`AGENTS.md` は、コーディングエージェント向けの指示を書く、オープンな形式です。Codex、GitHub Copilot、Cursor などが読み込みます（[AGENTS.md](https://agents.md/)、2026年9月時点）。`CLAUDE.md` の書き方は [AI駆動の開発ワークフロー](/dev-env/ai-workflow/) にあります。

## タスクの分け方

| 原則 | 内容 |
|---|---|
| 1タスク＝1コミット | 戻すときに、1つだけ戻せる |
| 遊べる状態で終わる | 「敵を全種類作る」ではなく「敵を1種類、倒せる状態まで」 |
| 受け入れ条件が1つ以上ある | 確かめられないタスクは、分けるか、人の確認と明記する |
| 依存の順に並べる | 移動 → 攻撃 → 敵 → ステージ |
| 1回の依頼で終わる大きさ | 迷うなら、半分にする |

エンジニアに馴染みのある「システムごと」（描画、物理、UI）に分けると、全部ができるまで遊べません。ゲームでは、1本の縦の筋（操作 → 敵 → 勝敗）を先に通すほうが、遊んで確かめられます。

タスクの分割は、エージェントに下書きを頼めます。順番と大きさは、人が決めます。

```text
SPEC.md を読み、TODO.md を作ってください。
- 1タスクは、1コミットで終わる大きさにする
- 各タスクは、終わった時点で遊べる状態にする（システム別に分けない）
- 各タスクに、受け入れ条件（コマンド、画面、人が確認のどれか）を付ける
- 依存があるものは、依存先の番号を書く
まだ実装はしないでください。
```

## 受け入れ条件の書き方

受け入れ条件は、「観察できる」「実行できる」形で書きます。

| 種類 | 例 |
|---|---|
| コマンド | `npm test` が通る。`npm run build` が通る |
| 数値 | 敵が100体いる場面で、フレーム時間の95パーセンタイルが 20ms 以下 |
| 画面 | tools/shot.mjs で、HUD が画面の外にはみ出していない画像が撮れる |
| 操作の記録 | tools/playtest.mjs の操作で、60秒後にクリア画面へ進む |
| 人が確認 | 「ジャンプの手触り」。値は feel.json、確認するのは自分 |

書き方の型は、「〜のとき、〜になる」です。

```markdown
- 敵の体力が0になったとき、敵が消え、スコアが100増える
- 体力が0になったとき、ゲームオーバー画面が出て、Rキーでやり直せる
- 確かめ方: tests/score.test.js（コマンド）、ゲームオーバー画面は tools/shot.mjs（画面）
```

「人が確認」も、正式な受け入れ条件です。エージェントの完了報告とは分けて、人の確認済みを、チェックボックスで記録します。

## 運用のコツ

- 変更は、仕様から始める。コードを変える前に、SPEC.md か tasks/ を直す
- エージェントが仕様を書き換えたら、差分を、人が読む
- 1タスクを1つの会話で行う。新しい会話は、仕様だけを頼りに始まるので、仕様の穴が見つかる
- 席を離れる作業は、受け入れ条件を終わりの条件にする。Claude Code の `/goal` は、設計書のすべての受け入れ条件が満たされるまで作業を続ける使い方を、例として挙げています（[Keep Claude working toward a goal](https://code.claude.com/docs/en/goal)、2026年9月時点）
- 仕様と実装が離れてきたら、定期的に合わせる

```text
SPEC.md と、現在の実装を比べてください。
- 仕様にあるが、実装にないもの
- 実装にあるが、仕様にないもの
- 仕様と、実装が食い違っているもの
を3つの一覧にしてください。まだ何も直さないでください。
```

## 仕様駆動のツールと手法

| 手法・ツール | 内容（2026年9月時点） | 向く場面 |
|---|---|---|
| Markdown ＋ 質問形式 | Claude Code の公式ドキュメントが勧める方法。エージェントに質問させ、SPEC.md に書かせ、新しい会話で実行する | 小さなゲーム、個人開発 |
| GitHub Spec Kit | オープンソース（MIT）。原則、仕様、計画、タスク、実装、収束（仕様どおりかの確認）の順に、型にはめて進める。Python 3.11 以上が必要。導入のコマンドと、エージェントへの依頼の順は、下の節 | 機能が多く、仕様、計画、タスクを型にはめたいとき |
| Kiro | 仕様を `requirements.md`、`design.md`、`tasks.md` の3つで管理する。プロジェクトの常設の知識は `.kiro/steering/` に置く。依存関係のないタスクは、並行して実行される | エディタの中で、仕様から実装までを通したいとき |
| AGENTS.md | エージェント向けの指示のための、共通の形式 | 複数のツールを併用するとき |

Spec Kit は、仕様（何を、なぜ）を、実装（どうやって）より先に決めることを掲げています。README では、プロジェクトの原則は1回、機能ごとに仕様、計画、タスク、実装、収束（仕様どおりかの確認）を回す流れが示されています（[github/spec-kit](https://github.com/github/spec-kit)）。GitHub のブログは、この流れを、仕様、計画、タスク、実装の4段階で説明しています（[GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)、2025年9月2日）。
Kiro は、要件、設計、タスクの3段階で、タスクごとに状態が表示されます（[Kiro Docs: Specs](https://kiro.dev/docs/specs/)、[Steering](https://kiro.dev/docs/steering/)）。

### Spec Kit を導入するコマンド（Claude Code の場合）

まず、Spec Kit の本体（`specify`）を入れます。uv が推奨で、pipx や pip でも入ります（[Installation](https://github.com/github/spec-kit/blob/main/docs/installation.md)、2026年9月時点）。

```bash
uv tool install specify-cli
```

次に、プロジェクトに組み込みます。**`--integration` で、使うエージェントを指定します。** 省くと、対話しない実行（CI やパイプ）では GitHub Copilot が既定になります（[init のオプション](https://github.com/github/spec-kit/blob/main/docs/reference/core.md)）。Claude Code のキーは `claude` で、`/speckit-<コマンド>` のスキルとして入ります。Codex CLI は `codex` で、`$speckit-<コマンド>` で呼びます（[Integrations](https://github.github.io/spec-kit/reference/integrations.html)）。

新しいプロジェクトの場合:

```bash
specify init mygame --integration claude
```

すでにゲームのリポジトリがある場合は、先に作業をコミットするか退避して、導入用のブランチを作ります。生成されるファイルを、通常のレビューと同じ形で見るためです。そのうえで、リポジトリのルートで実行します。

```bash
specify init --here --force --integration claude
```

`--here` は今のフォルダに組み込み、`--force` は空でないフォルダへの導入を許します。`--force` は、管理対象のファイルが衝突した場合に、置き換える可能性があります。実行後に差分を読んでください。アプリのコードを書き換えたり、既存の挙動の仕様を推測して書いたりはしません（[既存プロジェクトへの導入](https://github.github.io/spec-kit/guides/existing-projects.html)）。

組み込んだあとは、エージェントのチャットで、次の順に依頼します。原則は1回、機能ごとに、仕様から収束までを回します（[README](https://github.com/github/spec-kit)）。

```text
/speckit-constitution   # プロジェクトの原則（1回）
/speckit-specify        # 機能の仕様
/speckit-plan           # 技術の計画
/speckit-tasks          # タスクへの分割
/speckit-implement      # 実装
/speckit-converge       # 仕様どおりかの確認
```

ゲームで使うときの対応は、次のとおりです。これは考え方の対応で、Spec Kit が実際に作るファイル名や置き場所ではありません。

| Spec Kit の段階 | この記事の方式での対応（Spec Kit の生成物ではない） |
|---|---|
| constitution | 常設のルール（CLAUDE.md、AGENTS.md）。使う技術、テストの方針、「乱数は決まった関数から」などの規則 |
| specify | SPEC.md。企画書からの書き換え |
| plan | 技術の計画。エンジン、構造、性能の目標 |
| tasks | TODO.md。縦の筋で分ける |
| implement | 1タスクごとの実装 |
| converge | 受け入れ条件の確認。「人が確認」は、人が行う |

Spec Kit を使うと、実際のファイルは、次の場所にできます（[仕様の更新とファイル配置](https://github.com/github/spec-kit/blob/main/docs/guides/evolving-specs.md)、[プロジェクト原則の配置](https://github.github.io/spec-kit/upgrade.html)）。

```text
.specify/memory/constitution.md   # プロジェクトの原則
specs/<機能>/spec.md              # 機能ごとの仕様
specs/<機能>/plan.md              # 機能ごとの技術の計画
specs/<機能>/tasks.md             # 機能ごとのタスク
```

この記事の前半の方式（`SPEC.md`、`TODO.md`、`tasks/`）と、Spec Kit の方式は、どちらかを選びます。並べて使うと、仕様が2か所に分かれて、食い違います。

ツールを使っても、手触りや面白さの判断は、人の仕事です。ツールの出力に、「人が確認」の項目を足します。個人の小さなゲームなら、Markdown だけで始められます。

## コピーして使える仕様テンプレート

### SPEC.md

````markdown
# （ゲーム名） 仕様

- 最終更新: YYYY-MM-DD
- 企画書: docs/one-pager.md

## 1. 目的と体験
- 一言で:
- 遊ぶ人と、1プレイの長さ:
- 狙う楽しさ:

## 2. コアループ
（動詞を3つ程度）

## 3. 操作
| 入力 | 動作 | 値の場所 |
|---|---|---|

## 4. 機能
### 4.1 （機能名）
- 挙動:
- 値: data/（ファイル名）
- 対象外:
- 確かめ方: （コマンド／画面／人が確認）

## 5. 技術
- エンジンと言語:
- 起動、ビルド、テストのコマンド:
- 守るルール（乱数、メモリ、依存の追加など）:

## 6. 品質の合格ライン
- 性能:
- アクセシビリティ:
- 対応する環境:

## 7. やらないこと

## 8. 未決事項
- [ ]
````

### タスクの仕様（tasks/NNN-名前.md）

````markdown
# NNN （タスク名）

- 依存: （先に終わらせるタスクの番号）
- 参照する仕様: SPEC.md の 4.1

## やること
（2〜5行）

## 触ってよい場所
- src/…
- data/…

## 受け入れ条件
- [ ] （〜のとき、〜になる）  確かめ方: コマンド
- [ ] （〜のとき、〜になる）  確かめ方: 画面
- [ ] （手触りなど）        確かめ方: 人が確認

## 対象外
- （今回はやらないこと）

## 報告してほしいこと
- 実行したコマンドと、その結果
- 撮った画像の場所
- 決められず、保留にしたこと
````

### TODO.md

````markdown
# TODO

## 進行中
- [ ] 012 ダッシュ（tasks/012-dash.md）

## 次
- [ ] 013 敵の弾（依存: 012）

## 完了
- [x] 011 移動と当たり判定
````

### 記入例：ダッシュ1機能で、3つのファイルを追う

上の空欄のテンプレートを、「ダッシュ」1つで埋めた例です。同じ要件が、3つのファイルにどう分かれるかを追えます。値と挙動は、前の節の「ダッシュ（変更後）」と同じです。

**SPEC.md**：製品の仕様。機能の定義だけを書きます。

````markdown
### 4.3 ダッシュ
- 挙動: Shift でダッシュ。向いている方向に3タイル、0.2秒で移動する。移動中は敵の弾に当たらない。終わったら、0.5秒は再使用できない
- 値: data/feel.json の dash.distanceTiles、dash.durationSec、dash.cooldownSec
- 対象外: 空中でのダッシュ、ダッシュ中の攻撃
- 確かめ方: tasks/012-dash.md の受け入れ条件
````

**tasks/012-dash.md**：1回の依頼の単位。「何ができたら完了か」を、確かめ方つきで書きます。

````markdown
# 012 ダッシュ

- 依存: 011（移動と当たり判定）
- 参照する仕様: SPEC.md の 4.3

## やること
Shift でダッシュする。値は data/feel.json から読み、コードには書かない。

## 触ってよい場所
- src/player/dash.js
- data/feel.json
- tests/dash.test.js

## 受け入れ条件
- [x] Shift を押すと、向いている方向に3タイル、0.2秒で移動する  確かめ方: コマンド（tests/dash.test.js）
- [x] ダッシュ中の0.2秒は、敵の弾に当たってもダメージを受けない  確かめ方: コマンド（tests/dash.test.js）
- [x] 壁に向かってダッシュしたとき、壁の手前で止まり、壁の中には入らない  確かめ方: コマンド（tests/dash.test.js）
- [x] 再使用待ちの0.5秒の間に Shift を押しても、ダッシュしない。押した入力はためない  確かめ方: コマンド（tests/dash.test.js）
- [x] feel.json の dash.distanceTiles を5に変えると、5タイル移動する（値をコードに書いていない）  確かめ方: コマンド（tests/dash.test.js）
- [ ] ダッシュの手触りが、狙いどおり「気持ちいい」  確かめ方: 人が確認（自分で触って、値は feel.json で調整する）

## 対象外
- 空中でのダッシュ、ダッシュ中の攻撃

## 報告してほしいこと
- 実行したコマンドと、その結果
- 決められず、保留にしたこと
````

**TODO.md**：タスクの一覧と状態。エージェントの完了報告と、人の確認は、ここで分けて記録します。

````markdown
## 進行中
- [ ] 012 ダッシュ（tasks/012-dash.md）
  - コマンドで確かめる5項目: 完了（エージェントの報告あり）
  - 人が確認する1項目（手触り）: 未確認

## 次
- [ ] 013 敵の弾（依存: 012）
````

この例で、受け入れ条件の6項目のうち、上の5項目は、コマンドで確かめられます。最後の1項目だけが、人の確認です。エージェントが「完了」と報告しても、TODO.md の012は、手触りを確認するまで「進行中」のままです。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — 検証手段を渡す、質問させて SPEC.md を作る方法
- [Keep Claude working toward a goal](https://code.claude.com/docs/en/goal) — 受け入れ条件を終わりの条件にする `/goal`
- [github/spec-kit](https://github.com/github/spec-kit) — Spec Kit の README。導入方法と、仕様駆動の流れ
- [Spec Kit: Installation](https://github.com/github/spec-kit/blob/main/docs/installation.md) — 導入の方法（uv、pipx、PyPI）
- [Spec Kit: init のオプション](https://github.com/github/spec-kit/blob/main/docs/reference/core.md) — `--integration`、`--here`、`--force`
- [Spec Kit: 既存プロジェクトへの導入](https://github.github.io/spec-kit/guides/existing-projects.html) — 既存のリポジトリに組み込む手順
- [Spec Kit: 仕様の更新とファイル配置](https://github.com/github/spec-kit/blob/main/docs/guides/evolving-specs.md) — `specs/<機能>/` の配置
- [Spec-driven development with AI（GitHub Blog）](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) — Spec Kit の紹介と4段階
- [Kiro Docs: Specs](https://kiro.dev/docs/specs/) — requirements.md、design.md、tasks.md の構成
- [Kiro Docs: Steering](https://kiro.dev/docs/steering/) — `.kiro/steering/` の常設の知識
- [AGENTS.md](https://agents.md/) — エージェント向け指示の共通形式
- [Claude of Duty（GitHub）](https://github.com/mshumer/Claude-of-Duty) — `ARCHITECTURE.md` が、エージェント間の調整に使われた例
