---
title: Claude Code の mods を始める（Getting started with Claude Code mods）
description: Claude Code 公式ブログ「Getting started with Claude Code mods」を、仕組み、Token Weather の作り方、Blast Radius と Replay Theater、共有と信頼の注意まで掘り下げ、ゲーム制作での確認の挟み方や残量表示に当てはめます。
sidebar:
  order: 7
lastUpdated: 2026-10-04
---

## 概要

mod は、Claude Code の中で動く、小さな JavaScript か TypeScript のファイルです。Claude Code が何をしているかを見る、動作を変える、独自の画面を描く、の3つができます。この記事は、原文が空のフォルダから作る「Token Weather」を中心に、仕組みと作り方、さらに大きな2つの例（Blast Radius、Replay Theater）、共有のしかた、注意点を整理します。公式ドキュメントで裏づけが取れた部分は、別に分けて書きます。

- 公開日: 2026年10月1日。著者: Addy Osmani 氏。読了時間: 11分
- 原文: [Getting started with Claude Code mods](https://claude.dev/blog/getting-started-with-claude-code-mods/)
- 動作する環境: Claude Code 2.1.287 以降。mod は既定でオンです。API はリリースの間で変わることがあり、読み込みのたびに Claude Code が書き出す型定義（`.claude-plugin/types/`）が、その版の正確な仕様になる、と原文は書いています。
- 原文はゲームに触れていません。「ゲーム制作での使いどころ」は、この Wiki の考えです。

用語を補います。フック（hook）は、ある出来事（イベント）が起きたときに呼ばれる関数です。プラグインは、Claude Code に機能を足すための、決まった構成のフォルダです。

## mod とは何か

mod は、Claude Code の設定、権限の規則、スラッシュコマンド、Skill、ステータスラインより、さらに踏み込んだ拡張です。Claude Code の動作を書き換えたり置き換えたりでき、独自の画面も描けます。中身は、プラグインに入ったフックで、各フックは、セッション中のすべての出来事を、起きた瞬間に見られます。

原文は、使い方を3つ挙げています。いつも確認する表示を足す、不安なコマンドの前に番人を置く、変更を読むときの自分向けの確認画面を作る、です。端末と、デスクトップアプリの両方で動きます。

### まず試すなら、Claude に頼む

API を覚える必要はありません。`claude` を起動し、欲しい mod を日本語でも説明すれば、Claude Code が書いてくれます。最初のファイルを保存するときに、ホットリロードを許可するか聞かれます。許可すると、ターンが終わったときに mod が現れ、以降の変更は、その場で反映されます。「Storm を70%から始めて」のように、手直しを頼み続けられます。

この方式の mod は、そのセッションだけで読み込まれ、フォルダは後で掃除されます。残したい場合は、フォルダを外へコピーして、普通のプラグインとして入れます。Claude Code には、mod の書き方を扱う内蔵の案内があり、状態の持ち方、`claude plugin validate` での確認、使うイベントの選び方を、Claude が知っています。

## 仕組み

### フォルダの構成

mod は、動作が JavaScript か TypeScript のモジュールに入った、Claude Code のプラグインです。

- フォルダは普通のプラグインで、`.claude-plugin/plugin.json`（マニフェスト）を持つ。
- `hooks/hooks.json` が、モジュールを1つだけ指す（`modules` に書く）。
- モジュールは、`register(on, options)` を書き出す。その中で `on(イベント名, 絞り込み条件, フック)` を呼び、フックを足す。

### フックの形

すべてのフックは、同じ形です。

```js
on("tool.call", { tool: "Bash" }, async ($, e, next) => {
  // $: mods の API（ui, session, state, store, fs, process, clock, http, tool, command, model など）
  // e: このイベントの入力（普通のデータ）
  // next: 他のプラグイン、そして Claude Code 自身の動作に e を渡す
  return next(e);
});
```

フックは、ミドルウェアのように連なっています。自分のフックが走り、`next(e)` で次へ渡し、最後に Claude Code が本来の動作をします。フックにできることは3つです。

| 動き | やり方 | 例 |
|---|---|---|
| 観察する | `next(e)` の結果を受け取り、見てから返す | ファイルの編集をすべて記録する。ターンの後に数値を読む |
| 書き換える | 変えたイベントを `next` に渡す | 後ろの処理が見る内容を変える（コマンドを安全な形にするなど） |
| 自分で答える | `next` を呼ばずに `{ deny: "…" }` などを返す | ツール呼び出しを拒否する。コマンドやツールを代わりに提供する |

扱えるイベントは、ツール呼び出し、送信されたプロンプト、ターンの開始と終了、セッションの開始と終了、スラッシュコマンド、そして `ui.render`（画面の各部分が描かれるとき）です。モジュールは専用の隔離環境で動き、DOM も Node もありません。そのため、外の世界へ出る操作は、すべて `$` を通ります。

### 設定のフックとの違い

Claude Code にはもともと、設定ファイルに書くフックがあります。それは、イベントごとにシェルコマンドを走らせ、JSON を標準入出力で受け渡す方式です。mod は、一度読み込まれ、セッション中ずっと居続けます。状態を持て、イベントに応じて更新される画面を描け、Claude Code を呼び返せます。ペインを開く、プロセスを走らせる、スラッシュコマンドを登録する、モデルが呼べるツールを登録する、などです。

Claude Code 自身の機能にも、mod で作られたものがあります。AGENTS.md への対応と、会話の隣に出る `/diff` のペインです。ソースとテストは、公開リポジトリ（anthropics/claude-code）の `mods/` にあり、チームの作り方を読めます。

## 最初の mod を作る: Token Weather

### 何を作るか

ターンのたびにコンテキストウィンドウ（会話に載せられる量）の埋まり具合を読み、プロンプトの上の1行に描きます。表示は、天気のアイコン、使用率、使ったトークン数と全体、直近のターンの小さなグラフ、直前のターンで増えた量です。

| 使用率 | 予報 |
|---|---|
| 25% 未満 | ☀ Clear |
| 25〜49% | ☁ Cloudy |
| 50〜74% | ☂ Showers |
| 75〜89% | ☇ Storm |
| 90% 以上 | ↯ Compact soon |

原文の実例では、ターンごとにファイルを読ませると、18%、67%、81%（200k のウィンドウに対して）と、Clear から Showers、Storm へ進みました。全体で約80行です。

### 近道: Claude に作らせる

原文が示す依頼文は、見せたい内容を書くだけです。1行で、天気のアイコンと言葉、使用率とトークン数、直近12ターンのグラフ（`▁▂▃▄▅▆▇█`）、直前のターンの増分を表示し、毎ターン更新するよう頼んでいます。API の知識は要りません。「What it should show」の行を自分の欲しい表示に変えれば、自分の mod になります。

### 手作りの6ステップ

作り方を知りたい人、Claude が書いたものを確かめたい人向けに、原文は6ステップを示します。要点を整理します。

1. フォルダを作る。`claude --version` で 2.1.287 以降を確認する。`plugin.json`、`hooks/hooks.json`（モジュールを1つ指す）、`hooks/token-weather.mjs` を置く。後で `types/index.d.ts` と `tests/` が加わる。
2. 何かを描く。プロンプトのすぐ上の帯は `AbovePrompt` という部品で、Claude Code は何も描かないので、最初の対象に向く。`ui.render` を `{ component: "AbovePrompt" }` で受け、`Box` と `Text` の木を返す。部品は、グローバルではなく `$.ui.resolve(e)` で取り出す（描く面ごとに、使える部品が少し違うため）。`claude --plugin-dir ./token-weather` で起動し、保存すると、再起動なしで反映される。この即時のフィードバックが、mod を書く楽しさの大半だと原文は書いています。
3. 実際の数値を読み、`$.state` に持つ。`$.session.usage()` が、ステータスラインと同じ数値（`context.tokens`、`context.window`、`context.percent`）を返す。呼び出しは無料で、内訳を頼んだときだけ、トークン数の問い合わせを送る。`session.start` と `turn.complete` で読む。履歴は、モジュールの変数ではなく `$.state` に置く。ホットリロードは、新しい読み込みなので、変数が初期化されるため。`$.state` はホスト側で、セッションの間ずっと値を保持する。
4. 予報を描く。予報の表（上限、アイコン、言葉、色）を作り、使用率で選ぶ。幅が60桁以上のときだけ、グラフと増分を足す。
5. 検証とテスト。`claude plugin validate` が、フックしているイベントと、呼んでいる `$` の関数を一覧で出す。`claude plugin test` が、`*.test.ts` を実際のランタイムに対して走らせる。テストの中で `on` に登録したフックは、mod の後ろで走り、Claude Code の答えを差し替えられるので、`$.session.usage()` の返り値を自由に決められる。
6. 共有する。マーケットプレイス（`.claude-plugin/marketplace.json` を持つフォルダでよい）に入れ、`claude plugin marketplace add` と `claude plugin install 名前@マーケット --scope user` で入れる。

原文が「自分の mod にも取り入れる価値がある」と挙げる細部が3つあります。

- 部品の入力は `e.props` にある。`hasSurvey`（アンケートが帯を使いたいと言っている）なら、フックは譲る。`bodyColumns` は、帯の実際の幅で、ペインが横に付いていると、端末の幅より狭い。この幅に合わせて木を作る。トップレベルの `e` にあるのは、`e.component`、`e.surface`、`e.requestId`、`e.viewport` だけ。
- 描くものが無いときは `next(e)` を返して、帯を Claude Code と他の mod に返す。
- 絵文字ではなく、幅が1つの記号（☀ ☁ ☂ ☇ ↯）を使う。どの端末のフォントでも揃う。

状態の型は、プラグインの型の契約（小さな `.d.ts` ファイル）で宣言します。宣言しないと、`claude plugin validate` が、足りない宣言を名指しして止めます。もう1つの利点は、`$.state.get` を描画フックの中で呼ぶと、その描画が購読され、以降の `$.state.set` で、自動的に再描画されることです。再描画を頼む呼び出しは要りません。

## 共有のしかたと、信頼

mod はプラグインなので、共有の方法は他のプラグインと同じです。GitHub のリポジトリにマーケットプレイスのファイルを置けば、そのリポジトリがマーケットプレイスになります。インストールは3つのコマンドです。

```text
/plugin marketplace add your-org/my-mods
/plugin install token-weather@my-mods
/reload-plugins
```

読み込んだ時点で mod が始まります。現れなければ、Claude Code を再起動します。更新は、普通の push です。Claude のディレクトリ（claude.ai/directory/manage）に、mod を含むプラグインを申請して、リンクなしで見つけてもらうこともできます。

注意点として、原文は次を書いています。mod は、手元のマシンで、Claude Code と同じ権限で動くコードです。書くのは公開した人で、Anthropic ではありません。パッケージを入れるのと同じ姿勢で、先にリポジトリを読み、信頼できる人のものだけを入れます。自分でコマンドを実行するまで、何も入りません。

## 大きな2つの例

Token Weather は、見て描くだけです。次の2つは、イベントに踏み込み、ペインを開き、入力を受けます。

### Blast Radius: 危険なコマンドの影響を、実行前に見せる

Claude が Bash で `rm -rf`、`git reset --hard`、`git clean`、強制 push、データベースの移行を呼ぶと、その呼び出しを止めます。コマンドが触るものを調べ、「実行」と「取りやめ」のボタンのペインを開きます。2を押すと、Claude は理由つきの拒否を受け取ります。1を押すと、書かれたとおりに実行されます。例では、`rm -rf build` が消す9ファイル（1.1 MB）を一覧にしました。

使うフックは3つです。`tool.call`（Bash 向け）、`ui.render`（Pane 向け）、`ui.render`（AbovePrompt 向け）。中心は、先の表の「自分で答える」です。

| 学べること | 内容 |
|---|---|
| ドライランに `$.process.run` | 報告は、各ツール自身の確認用のコマンド（`git status --porcelain`、`git clean -n`、`git log HEAD..origin/main`、`showmigrations`）で作る。引数は配列で渡すので、パスの中身がシェルのコードとして走らない |
| 呼び出しを保留する | フックが1回のイベントで使える時間は10秒だが、`$` の呼び出しの中で待つ時間は数えない。短い `sleep` のプロセスを回して、ボタンの押下で決定が入るのを待つ。Esc で中断（`next.signal` が止まる）すれば、待ちをやめる |
| ホットキーつきのボタン | `Button({ label, hotkey, onPress })`。クリック、Tab と Enter、数字キーで押せる |
| 帯への切り替え | 幅が足りなくて、ペインが置けない（`isPlaced: false`）ときは、同じ報告を、プロンプトの上の帯に描く |

原文は、これは安全網であり、権限の仕組みではないと明記しています。コマンドの文字列を読むので、`$(…)`、エイリアス、`rm` を呼ぶスクリプトはすり抜けます。確実に止めたいなら、権限の規則を使います。

### Replay Theater: 直前のターンの編集を、1つずつ見直す

ターンの間、Edit と Write のすべての呼び出しを記録します（ファイル、変更前と変更後の文章）。ターンが終わると、プロンプトの上にヒントが出ます。`r` を押すか `/replay` と打つと、ペインが編集を1つずつ差分で見せます。番号つきの帯と、前へ、次へ、閉じるのボタンがあります。例は、3ファイルにまたがる5件の改名です。編集を止めたり変えたりせず、観察するだけです。

| 学べること | 内容 |
|---|---|
| イベントを組にする | `turn.start` と `turn.complete` で、編集を1ターン分にまとめる。`e.agentId` で、サブエージェントのターンを除く |
| スラッシュコマンドの登録 | `session.start` で `$.command.register` し、`command.run` で答える |
| ファイルを読む | Write の直前に `$.fs.read` で古い内容を取るので、差分が本物になる |
| 置く場所は、面が決める | 全画面では右に付き、80桁では、プロンプトの上に出る。mod は、どちらでも同じ木を描く |

## 4つの習慣

1. Claude Code が書く型を頼る。読み込みのたびに、その版の宣言が `.claude-plugin/types/` に出るので、エディタと `tsc -p` が追加の手順なしで使える。イベント、`$` の関数、部品の入力の、基準になる。
2. 入力は `e.props` から読む。
3. ホットリロードを前提にする。保存のたびに `register` と `session.start` が走り直すので、データは `$.state` に置き、モジュールの変数には置かない。
4. 描画が出ないときはログを読む。`claude --debug` で起動し、「フックが検証に通らない木を返した」という行を探す。

## 発想の種

原文は、3つの mod が、それぞれ1つの問いから生まれたと書きます。コンテキストはどれだけ埋まったか、このコマンドは何を消そうとしているか、Claude は何を変えたか。続けて、次の案を挙げています。

- `$.session.usage()` から、費用やレート制限のメーターを作り、`$.ui.status` でステータスラインに出す
- `prompt.submit` のフックで、チームの規約を、すべてのプロンプトに足す
- Claude が今のセッションで読んだファイルを並べる、live な地図のペイン
- 長いターンが終わったら、`$.ui.toast` で通知する集中タイマー
- 自分の環境に合わせた `tool.call` の番人。本番の `kubectl` のコンテキストや `terraform apply` など

## 公式ドキュメントで確認できたこと

mods の公式ドキュメント（2026年10月時点、[Mods overview](https://code.claude.com/docs/en/plugins/mods/overview)、[React to events](https://code.claude.com/docs/en/plugins/mods/events)、[Mods reference](https://code.claude.com/docs/en/plugins/mods/reference)）を読み、原文を補う内容を整理します。原文と食い違う点はありませんでした。

- 原文の3つの例は、Anthropic が `anthropics/claude-code-playground` リポジトリの `claude-code/mods` に、サンプルとして公開しています（`token-weather`、`blast-radius`、`replay-theater`）。サポートなしで、そのまま共有されています。試すときは、クローンして `--plugin-dir` で1セッションだけ読み込めます。
- 入れる前に、`claude plugin validate ./some-mod` で、その mod が扱うイベント（`hooks:`）と、頼んでいる操作（`calls:`）を、実行せずに一覧できます。
- mod が届く範囲は広いと書かれています。自分の権限で、ファイルの読み書き、プロセスの起動、通信ができ、環境変数や設定ファイル（API キーを含む）を読め、すべてのプロンプトとツール呼び出しを見られ、確認を出す前にツール呼び出しを承認できます。原文の「隔離環境」は、モジュールの JavaScript が DOM や Node を直接持たないことを指します。公式ドキュメントの「サンドボックスされていない」は、mod が起動したプロセスが、Bash 用のサンドボックスの外で走ることを指します。矛盾ではなく、見ている層が違います。
- 止め方: 1つの mod は `/plugin` で無効にする。1セッション全部は `--safe-mode`。常に全部は、`~/.claude/settings.json` に `"disableAllHooks": true`。組織の管理者は、管理設定でユーザーが入れた mod を止められます。
- 動く場所: 端末と、デスクトップアプリの Code タブでは、フックも描画も動く。VS Code 拡張のチャットと、`claude -p`、Agent SDK では、フックは動くが描画は出ない。WSL のデスクトップのセッションでは動かない。
- 保留と時間制限: フックが使える時間は、1イベントにつき10秒（`$` の呼び出し中は数えない）。自分で待つ Promise は数える。時間切れのフックは飛ばされ、保留していたコマンドが、そのまま実行されてしまうため、待ちは `$.ui.ask` のような API の中で行う。
- 質問を出す API: `$.ui.ask` が、質問と選択肢を、Claude が質問するときと同じダイアログで出し、選ばれたラベルを返す。ペインを作り込まずに、確認だけを出したいときの、短い書き方です。
- `tool.check` というイベントがあり、権限の規則と設定のフックが決めた後の判断（許可、確認、拒否）を、見て変えられます。条件が、その時点の事実（現在のブランチなど）で決まるときに使います。固定のコマンドは、権限の規則で足ります。

## ゲーム制作での使いどころ

ここからは、この Wiki の考えです。原文は、ゲームの例を書いていません。ゲーム制作で、戻しにくい操作と、長い会話の管理に、mod が効く場面を挙げます。

### 戻しにくい操作の前に確認を挟む

ゲームのリポジトリには、生成したアセット（画像、音、3D モデル）、Godot の `.tscn` のような手で触りたくないファイル、大きなバイナリが入りがちです。`git clean` や `git reset --hard`、`rm -rf` で、まだコミットしていない生成物が消えると、再生成に時間と費用がかかります。Blast Radius と同じ考え方で、実行前に確認を出す mod を、Claude に頼めます。

```text
Claude Code の mod を作ってください。名前は asset-guard。
Bash の呼び出しのうち、rm -rf、git clean、git reset --hard、git push --force を保留して、
「何が消えるか」を表示する。git clean の場合は、git clean -n の結果の件数と先頭10件のパスを出す。
選択肢は「実行する」と「取りやめ」。取りやめなら、理由つきで Claude に断りを返す。
さらに、assets/raw/ 以下を編集する Edit と Write も保留する。
```

これを、`$.ui.ask` で書いた最小の形が、公式ドキュメントにあります（質問を出し、答えがなければ拒否する）。原文のとおり、コマンドの文字列を見る仕組みなので、`git push -f` のような別の書き方はすり抜けます。確実に止める必要があるものは、権限の規則（`permissions`）で止め、mod は、うっかりを防ぐ網として使います（[コンテキスト管理](/agent-dev/context-management/)の git の節）。

### 長いセッションの残量を見て、区切りを判断する

Token Weather は、会話の埋まり具合を、1行で常に見せます。ゲームの制作は、仕様、コード、スクリーンショットで会話が膨らみやすく、途中で指示を忘れたり、動きが鈍くなったりします（[コンテキスト管理](/agent-dev/context-management/)）。Storm（75% 以上）になったら、進捗をファイルに書き出して、セッションを分ける、と決めておくと、判断が楽になります。表示の区切りは、原文のとおり、頼み方で変えられます（「Storm を70%から始めて」）。

### 数値調整の変更を、1つずつ確認する

Replay Theater の発想は、バランス調整に向きます。エージェントに `data/balance.json` の数値を30か所直させると、差分の全体では読み切れません。1つずつ、変更前と後を並べて見られると、「この敵の HP を上げたのは意図どおりか」を確かめやすくなります（[バランス調整](/design/balancing/)）。同じ mod を、そのまま使うこともできます。

### 毎回守らせたいことを、プロンプトの側に足す

原文の発想の例にある、`prompt.submit` で規約を足すフックは、個人でも使えます。公式ドキュメントでは、`next({ ...e, text: ... })` で、送られるテキストを書き換えると説明されています。

```js
const REMINDER = "\n\n(このプロジェクトは固定刻み 1/60 秒。乱数は seeded RNG を使う。変更後は npm run verify を通す)";
on("prompt.submit", async ($, e, next) => next({ ...e, text: e.text + REMINDER }));
```

指示ファイルに書いても、会話が長くなると守られにくくなる、という課題に、毎回の送信で補う方法です。ただし、毎回の送信にテキストを足すと、そのぶんコンテキストを使います。短い一行に絞ります（[指示ファイル](/agent-dev/project-instructions/)）。この使い分けは、この Wiki の推測です。

### 長い検証の終わりを、通知で知る

ボットを100回走らせる、スクリーンショットを全ステージ分撮る、といった長い検証は、別の作業をしている間に終わります。原文の案にある `$.ui.toast` で、ターンが終わったときに通知できます（[検証ループ](/agent-dev/verification-loop/)）。

## AIの活用ポイント

### 欲しい表示や番人を、説明して作らせる

原文のとおり、mod は、見たいものを説明するだけで、Claude が書きます。自分のゲームに合わせた依頼文の型です。

```text
Claude Code の mod を作ってください。名前は game-status。
プロンプトの上の1行に、次を表示します。
- 直近の npm run verify の結果（合格か不合格か、何分前か）。結果は reports/verify-latest.json から読む。
- 現在のブランチ名と、未コミットのファイル数。
- 色は、合格を緑、不合格を赤、結果が30分以上前なら灰色にする。
ターンが終わるたびに更新してください。
```

### 入れる前の点検を、Claude にさせる

```text
このリポジトリ（他の人が作った mod）を、入れる前に点検してください。
claude plugin validate の hooks: と calls: の出力を貼り、次の点を挙げてください。
- ファイルの読み書き、プロセスの起動、通信（http）を、どこで何のために行っているか
- 環境変数や設定ファイルを読んでいるか
- ツール呼び出しを、確認なしで承認するフックがあるか
挙げた内容を、「この mod の目的に必要か」で、必要・不要に分けてください。
```

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Getting started with Claude Code mods](https://claude.dev/blog/getting-started-with-claude-code-mods/) — 原文（2026年10月1日、Addy Osmani 氏）
- [Mods overview（Claude Code Docs）](https://code.claude.com/docs/en/plugins/mods/overview) — mod の定義、入れ方、信頼、動く場所、サンプル
- [React to events with a mod（Claude Code Docs）](https://code.claude.com/docs/en/plugins/mods/events) — 観察、書き換え、答える。ツール呼び出しの保留と質問
- [Mods reference（Claude Code Docs）](https://code.claude.com/docs/en/plugins/mods/reference) — イベント、API、時間制限
- [claude-code-playground の mods（GitHub）](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods) — token-weather、blast-radius、replay-theater のサンプル
