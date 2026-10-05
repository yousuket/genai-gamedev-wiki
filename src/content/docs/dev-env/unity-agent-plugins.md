---
title: Unity の公式エージェント連携（CLI・プラグイン・エディター内AI）
description: Unity が公式に出している、コーディングエージェント向けの仕組み（Unity CLI、Claude Code・Codex・Grok Build 向けの公式プラグイン、エディター内のAIアシスタント）の中身と入れ方、費用、個人制作者の使い方と選び方を整理します。
sidebar:
  order: 5
lastUpdated: 2026-10-05
---

## 概要

Unity は2026年7月から、コーディングエージェント（Claude Code など、ファイルを読み書きしコマンドを実行するAI）を Unity に接続するための公式の仕組みを、段階的に出してきました。10月1日には Grok Build 向けのプラグインが加わり、公式プラグインの対応エージェントは3つになりました（2026年10月時点、[出典](https://unity.com/blog/unity-plugin-grok)）。

この記事では次の3点を整理します。

- 公式の仕組みが何種類あり、それぞれ何ができて、入れ方・対象バージョン・費用がどうなっているか
- 公式プラグインの中身（スキルの分野と、スキルがやること）
- 小さな Unity プロジェクトで、何を頼み、どう検証するか

エンジンそのものの比較は [ゲームエンジンの比較](/dev-env/engines/)、エージェントの比較は [AIコーディングツール](/dev-env/ai-coding-tools/) にあります。この記事は、Unity を選んだあとの「公式の道具をどう使うか」を扱います。

## 公式の仕組みの全体像

Unity の公式ブログによると、公式の仕組みは下の層に分かれます。下の層が実行を担い、上の層がそれを使います（[出典](https://unity.com/blog/meet-the-unity-cli)）。

| 仕組み | できること | 入れ方 | 対象 | 費用（2026年10月時点） |
|---|---|---|---|---|
| Unity CLI | `unity` という1つのコマンドで、Editor・モジュールのインストール、プロジェクトの作成と起動、ビルド、テスト、ログの確認ができる。出力は JSON や TSV にでき、終了コードが決まっている | `curl -fsSL https://unity.com/install.sh \| bash`（macOS・Linux）、`brew install --cask unity-cli`、`winget install Unity.CLI` | macOS 14 以降、Windows 10 21H1 以降、Ubuntu 22.04 以降・RHEL 9。実験的（experimental）な機能 | 無料 |
| Pipeline パッケージ（`com.unity.pipeline`） | CLI から、起動中の Editor（や開発ビルドのゲーム）を操作する。GameObject の作成、シーンの編集、C# のその場実行（`eval`）など | プロジェクトで `unity pipeline install` | Unity 6.0 LTS 以降。実験的 | CLI と組で使う。単独の料金の記載は確認できず |
| 公式プラグイン（`unity-agent-plugin`） | Unity のエンジニアが書いた「スキル」をエージェントに追加する。スキルは、各作業を Unity の想定どおりにやるための手順書。CLI の使い方を教える `unity-cli` スキルも入っている | エージェントごとのコマンド（次章） | Unity 6.0 以降。バージョン 0.1.8-beta（2026年10月1日） | 無料。ライセンスは Unity Companion License |
| CLI 組み込みの MCP モード | `unity mcp` で MCP サーバーとして動き、シェルコマンドを実行できないエージェントでも Editor を操作できる | CLI のインストール後、`unity mcp configure <クライアント名>` | Unity 6 以降 | 無料。Unity のクレジットは不要 |
| エディター内のAIアシスタント | Editor の中のチャットから、質問、コードの作成、シーンの操作、スプライト・テクスチャ・サウンドなどの生成を行う | Editor の AI ボタンから、または Package Manager で `com.unity.ai.assistant` を入れる | Unity 6.0 以降。ベータ | クレジット制（下記） |

出典は、[Unity のAIツール（unity.com）](https://unity.com/features/ai)、[Unity CLI の使い方](https://docs.unity.com/en-us/unity-cli/use-unity-cli)、[Unity の公式プラグインの説明](https://docs.unity.com/en-us/ai/unity-plugin/about-unity-plugin)、[リポジトリの README](https://github.com/Unity-Technologies/unity-agent-plugin) です。

### 呼び名についての補足

以前の「Unity AI」という名前は廃止され、現在は「Unity's AI tools」（エディター内アシスタント、AI ゲートウェイ、MCP サーバー、公式プラグイン、CLI の総称）と呼ばれています（2026年10月時点、[出典](https://unity.com/features/ai)）。古い記事で「Unity AI」「Unity MCP」と書かれているものは、この中のどれかを指しています。

### エディター内アシスタントのクレジット

エディター内のアシスタントは、Pro・Enterprise・Industry の契約に含まれます。Personal は無料トライアルがあり、その後は月10ドルの契約になります（2026年10月時点、[出典](https://unity.com/features/ai)）。使うたびに Unity Credits を消費し、月ごとの割り当ては翌月に繰り越されません（[出典](https://docs.unity.com/en-us/ai/credits/credits-about)）。

公式が代表例として示す消費量は、短い質問が約4クレジット（Unity Lite モデル）、三人称視点のプレイヤー操作の作成が約190クレジット（Unity Default モデル）、画像1枚の生成が1〜6クレジットです。実際の消費は、プロジェクトの規模や会話の長さで大きく変わります。

エージェント（Claude Code など）から公式プラグインや CLI で Unity を操作する場合、Unity のクレジットは消費しません。ただし、エージェント側の利用料（各サービスのサブスクリプションや API 料金）は別にかかります。

## 公式プラグインの中身

プラグインは `Unity-Technologies/unity-agent-plugin` という1つのリポジトリで管理され、Claude Code・Codex・Grok Build の3つに同じスキルが配られます（2026年10月時点、[出典](https://github.com/Unity-Technologies/unity-agent-plugin)）。スキルの数は、公式ブログでは Claude Code 向けが29（9月9日）、Codex 向けが31（9月16日）、Grok Build 向けが「30以上」（10月1日）と時期によって異なります。2026年10月5日にリポジトリの `skills/` フォルダを数えると33個でした。

各スキルは、Unity の機能チームが書いた手順（`SKILL.md`）と、詳しい資料（`references/` フォルダ）でできています。エージェントは、頼まれた作業に合うスキルを選んで読み込みます。スキル名を直接指定することもできます。

### スキルの分野

リポジトリの `SKILL.md` に書かれた説明にもとづく分類です（2026年10月時点）。

| 分野 | スキル | 内容 |
|---|---|---|
| 始める・道具 | `new-unity-project`、`unity-cli`、`unity-package-management` | 新規プロジェクトの案内（コンセプト、対応機種、収益化を聞いてから、Editor・プロジェクト・バージョン管理・パッケージを用意する。ゲームのコードは作らない）、CLI の操作、UPM パッケージの追加・更新（ヘッドレスや CI でも可） |
| UI・テキスト | `ui`、`ui-uitk`、`ui-ugui`、`ui-imgui`、`optimize-text-mesh-pro` | UI の枠組みを判別してから、UI Toolkit・uGUI・IMGUI の専門スキルに回す。TextMeshPro のフォントや日本語などの CJK フォントの設定 |
| 2D | `2d-pixel-perfect`、`sprite-editor`、`manage-sprite-atlas`、`tilemap-palette-create`、`tilemap-ruletile-*`（3つ）、`sprite-segment-3x3grid` | ドット絵のぼやけ・ジッターの修正、スプライトの切り出し、スプライトアトラス、タイルパレット、自動で接続するルールタイル |
| 描画 | `urp-postprocessing`、`shader-graph-create-custom-node`、`validate-urp-render-graph-renderer-feature`、`migrate-birp-to-urp` | URP のポストプロセス、HLSL から Shader Graph のカスタムノード、Render Graph を使うレンダラー機能の検査、標準パイプラインから URP への移行 |
| 音 | `audio-setup-mixers`、`optimize-audio`、`setup-vivox-voice-chat` | Audio Mixer への振り分け、音のメモリ・CPU の削減、ボイスチャット |
| ゲームの中身 | `initialize-ai-navigation`、`physics-3d-collision` | NavMesh と経路探索、3D の当たり判定・トリガーが動かない問題の診断 |
| 収益化・運営 | `implement-in-app-purchases`、`levelplay-unity-integration`、`build-live-game` | アプリ内課金、広告（LevelPlay）、クラウドセーブ・ランキング・リモート設定など |
| マルチプレイヤー | `setup-multiplayer-services` | ホスト、マッチメイキング、ロビー |
| 配信・多言語 | `optimize-web`、`localization` | WebGL・WebGPU ビルドの軽量化、Unity Localization |
| 検索・ツール開発 | `generate-editor-search-query`、`build-gtk`、`asset-transformer-toolkit` | Editor 内検索の式の作成、Graph Toolkit（Unity 6.6 以降）でのノード型ツールの開発、3D モデルのインポート |

個人制作で出番が多いのは、`unity-cli`、`ui` 系、2D 系、`localization`、`optimize-web` あたりです（推測ですが、プロトタイプから公開までの流れで使う順にそうなります）。収益化や運営の系統は、リリースが見えてから使うことになります。

### unity-cli スキルの中身

このスキルは、エージェントに CLI の使い方を教えます（2026年10月時点、[出典](https://github.com/Unity-Technologies/unity-agent-plugin/tree/main/skills/unity-cli)）。

- Editor が開いていれば、シーンやアセットのファイルを手で書き換えず、Pipeline 経由で GameObject の作成や設定の変更を行います。ファイル直編集は、ID の付け間違いや、開いているのと別のシーンを書き換える事故が起きやすいという理由です。
- `unity command` で、接続中の Editor が使えるコマンドの一覧を見られます。コマンドの名前と引数は Editor 側（Pipeline パッケージ）が決めるので、使う前に一覧で確認する手順になっています。Editor が複数開いているときは `--project-path` で対象を指定します。
- CLI は、クラッシュレポートと匿名の使用状況の通知を送ります。クラッシュレポートは環境変数 `UNITY_NO_CRASH_REPORT` で止められます。
- `unity command eval` は C# を Editor の中で実行できるため、セキュリティトークンで守られ、通信は手元のマシンの中に限られます（[出典](https://unity.com/blog/meet-the-unity-cli)）。

## 入れ方

どのエージェントでも、プラグイン自体はエージェントに対して1回入れます。プロジェクトごとの設定は要りません（Pipeline パッケージだけは、操作したいプロジェクトごとに `unity pipeline install` が必要です）（[出典](https://docs.unity.com/en-us/ai/unity-plugin/about-unity-plugin)）。Unity Asset Store のアセットや Package Manager のパッケージではありません。

| エージェント | 入れるコマンド | 確認 | 更新 |
|---|---|---|---|
| Claude Code | セッション内で `/plugin marketplace add Unity-Technologies/unity-agent-plugin`、続けて `/plugin install unity@unity-agent-plugin`。ターミナルからは `claude plugin marketplace add ...` と `claude plugin install unity@unity-agent-plugin` | `/unity:` と入力するとスキルが出る | `/plugin marketplace update unity-agent-plugin`。サードパーティのマーケットプレイスは、自動更新が既定でオフ |
| Codex | `codex plugin marketplace add Unity-Technologies/unity-agent-plugin`、続けて `codex plugin add unity@unity-agent-plugin` | `codex plugin list` | `codex plugin marketplace upgrade unity-agent-plugin` |
| Grok Build | `grok plugin install Unity-Technologies/unity-agent-plugin --trust`。または `/marketplace` で Unity を検索して `i` を押す | `/` でスキルが出る。`grok plugin list`、`grok plugin details unity` | `grok plugin update unity` |

出典は、[Claude Code](https://docs.unity.com/en-us/ai/unity-plugin/claude-code)、[Codex](https://docs.unity.com/en-us/ai/unity-plugin/codex)、[Grok](https://docs.unity.com/en-us/ai/unity-plugin/grok) の各公式ドキュメントです（2026年10月時点）。

補足です。

- Claude Code は、インストール時に適用範囲（ユーザー、プロジェクト、ローカル）を選びます。公式は、複数の Unity プロジェクトで使うならユーザー範囲を勧めています。ターミナルから入れるときの既定もユーザー範囲です。
- プラグインを使わず、リポジトリを clone してスキルのフォルダをリンクする手動インストールも、Claude Code と Codex には用意されています（README）。この場合、スキル名に `unity:` の接頭辞は付きません。
- CLI が入っていないとき、スキルはエージェントに CLI のインストールと Pipeline パッケージの追加を提案させます（README）。Unity Hub を使っている場合は、Hub が CLI を自動で入れます。エージェントにスクリプトを実行させたくなければ、先に自分で入れておきます。

### CLI 単体を入れる場合

プラグインなしで CLI だけ使うこともできます。

```bash
unity --version                           # 確認
unity install lts                         # 最新の LTS の Editor を入れる
unity editors -i                          # 入っている Editor の一覧
unity open ./MyProject                    # プロジェクトを開く
unity pipeline install                    # プロジェクトに Pipeline パッケージを入れる
unity self-update                         # CLI の更新
```

出典: [Use the Unity CLI](https://docs.unity.com/en-us/unity-cli/use-unity-cli)、[Unity CLI のブログ](https://unity.com/blog/meet-the-unity-cli)（2026年10月時点）。

## 個人制作者の使い方

### 準備

1. プロジェクトを Git で管理し、頼む前にコミットします。README に「スキルはエージェントがプロジェクトを直接変更する。変更の一部は Editor から元に戻せない」とあります。
2. 指示ファイル（`CLAUDE.md` や `AGENTS.md`）に、Unity のバージョン、UI の枠組み（UI Toolkit か uGUI）、レンダーパイプライン（URP か標準）、2D か 3D かを書きます。書き方は [プロジェクトの指示ファイル](/agent-dev/project-instructions/) を参照してください。
3. 公式の注意として、UI の依頼では枠組みの名前を最初に書きます。Unity は新規プロジェクトでは UI Toolkit を勧めていて、すでに uGUI を使っているプロジェクトでは uGUI と指定します（[出典](https://docs.unity.com/en-us/ai/unity-plugin/about-unity-plugin)）。

### 頼み方

README の例は、「コインのパックを買えるアプリ内課金を足して」「設定画面を作りたい」「ドット絵がぼやけて、カメラを動かすとジッターが出る」のように、やりたいことと症状を普通の文章で書いています。スキルは、依頼の文面から選ばれます。

- 小さな単位で頼みます。1回の依頼で変える範囲を、1つの画面、1つのシステムにします。
- プラグインを入れていると、エージェントは変更の前に質問をしてきます。対話で使うときは役に立ちますが、自動実行の流れでは止まってしまうので、その場合は判断に必要な条件を依頼文に先に書きます（公式の best practices）。
- スキルが使われないときは、スキル名を指定します（例: 「`ui-uitk` スキルを使って」）。
- 結果がおかしいときは、「そのスキルの `references/` を読んでからやり直して」と頼みます。公式は、この確認を飛ばすと出力が不正確になりやすいと説明しています。

### 検証のしかた

[検証ループ](/agent-dev/verification-loop/) の考え方を、Unity では次の道具に当てはめます。

| 確かめたいこと | 手段 |
|---|---|
| コンパイルが通るか | `unity recompile`（起動中の Editor のコンパイルエラーを報告する） |
| ロジックが壊れていないか | `unity test`（`--mode EditMode`、`--mode PlayMode`、`--filter`。結果は XML で出る） |
| 実際に動いているか | プレイモードに入り、フレームが進んでいることを確かめてから、スクリーンショットとコンソールを見る |
| 何が起きたか | `unity logs`、Editor のコンソール |

プレイモードの確認は、公式の手順書に落とし穴が書かれています（[出典](https://github.com/Unity-Technologies/unity-agent-plugin/tree/main/skills/unity-cli)）。

- プレイモードに入っただけ、スクリーンショットが返ってきただけでは、動いている証拠になりません。フォーカスのない Editor では、ゲームが最初のフレームで止まったまま、状態は「再生中」と出ることがあります。スクリーンショットも、止まった画面を撮るだけのことがあります。
- 対策として、`set_autotick` コマンドを Editor のセッションごとに1回呼び、`Time.frameCount` が増えることを確かめてから、画面とコンソールを見る、という順番が示されています。
- コンパイルエラーがある状態で Editor を起動すると、セーフモードになり、Pipeline が読み込まれません。`unity status` も `unity command` も接続できなくなります。`unity pipeline list` で確認し、C# のエラーを直して Editor を再起動するのが正しい手順です。
- エージェントがサンドボックス（制限された環境）で動いていると、起動中の Editor が `unity status` から見えないことがあります。「Editor が無い」と決めつける前に、この可能性も確かめます。

### うまくいかないとき

公式ドキュメントが、Claude Code のプラグインの限界を2点書いています（[出典](https://docs.unity.com/en-us/ai/unity-plugin/claude-code)）。

- 単純な uGUI の作業では、プラグインがあっても手作業との差はほとんどない。
- Sonnet 5 は、プラグインなしでも Unity の機能の多くを作れるが、古い方法を選びやすい。プラグインが主に補うのは、正しさ。

長く続けるときは、[コンテキスト管理](/agent-dev/context-management/) のとおり、進捗をファイルに残して、作業の区切りでセッションを分けます。プレイモードの確認は出力が長くなりやすいので、推測ですが、1つの機能ごとにセッションを分けると扱いやすくなります。

## エンジン選びとの関係

公式プラグインと CLI は、Unity を選んだ人のための道具です。Godot やブラウザ向けのエンジンとどちらが向くかは、テキスト中心で AI に任せやすいか、エディターの操作まで AI に頼めるかなどの観点で、[ゲームエンジンの比較](/dev-env/engines/) にまとめています。この記事で扱う公式の仕組みは、そこで Unity を選んだときに使える手段です。

## どれを使うか

| やりたいこと | 向く仕組み |
|---|---|
| いつものエージェントで Unity の作業を頼みたい | 公式プラグイン（無料） |
| スクリプトや CI から、Editor のインストール・テスト・ビルドを自動化したい | CLI（無料） |
| シェルを使えないエージェントや、MCP でつなぎたいツールから Editor を操作したい | CLI の `unity mcp`（無料） |
| Editor の中で完結させたい。アセットも生成したい | エディター内アシスタント（クレジット制） |

プラグインの中身は3つのエージェントで同じです。公式ブログも「エージェントは好みで選んでほしい」と書いています。したがって選ぶ基準は、各エージェントの料金、使えるモデル、普段使っているかどうかになります。比較は [AIコーディングツール](/dev-env/ai-coding-tools/) と [コストと利用枠の管理](/agent-dev/cost-management/) を参照してください。

## AIの活用ポイント

プラグインと CLI を入れたエージェントに、次のように頼めます。

- 新規プロジェクトの立ち上げ:

```text
Unity 6 の 2D ゲームを新規に作りたい。new-unity-project スキルで、
コンセプト・対応機種・収益化の方針を私に質問してから、Editor とプロジェクトと Git を用意して。
ゲームのコードはまだ書かないで。
```

- 症状から原因を調べさせる:

```text
プレイヤーが床をすり抜けることがある。physics-3d-collision スキルを使って、
Editor のシーンを unity command で調べて原因の候補を挙げて。まだ直さないで。
```

- 変更と検証をセットで頼む:

```text
UI Toolkit で設定画面（音量スライダーと戻るボタン）を作って。
作ったら unity recompile でエラーが無いことを確認し、PlayMode で開いて
スクリーンショットとコンソールの結果を報告して。
```

- 指示ファイルの下書き:

```text
このプロジェクトの Packages/manifest.json と ProjectSettings を読んで、
CLAUDE.md に書くべき項目（Unity のバージョン、レンダーパイプライン、UI の枠組み、
使っているパッケージ）を下書きして。
```

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-10-05**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Meeting you where you work: Unity Plugin for Grok Build](https://unity.com/blog/unity-plugin-grok) — Grok Build 向けプラグインの発表（2026年10月1日）
- [Meet the Unity CLI](https://unity.com/blog/meet-the-unity-cli) — Unity CLI と Pipeline パッケージの発表（2026年7月20日）
- [Unity Plugin for Claude Code](https://unity.com/blog/unity-plugin-for-claude-code) — Claude Code 向けプラグインの発表（2026年9月9日）
- [Unity Plugin for Codex](https://unity.com/blog/unity-plugin-codex) — Codex 向けプラグインの発表（2026年9月16日）
- [unity-agent-plugin（GitHub）](https://github.com/Unity-Technologies/unity-agent-plugin) — プラグインのリポジトリ。README とスキル一覧
- [About Unity's plugin（Unity Docs）](https://docs.unity.com/en-us/ai/unity-plugin/about-unity-plugin) — スキルの使い方と best practices
- [Unity's plugin for Claude Code（Unity Docs）](https://docs.unity.com/en-us/ai/unity-plugin/claude-code) — インストール、更新、制限事項
- [Unity's plugin for Codex（Unity Docs）](https://docs.unity.com/en-us/ai/unity-plugin/codex) — Codex のインストールと更新
- [Unity's plugin for Grok（Unity Docs）](https://docs.unity.com/en-us/ai/unity-plugin/grok) — Grok Build のインストールと更新
- [Use the Unity CLI（Unity Docs）](https://docs.unity.com/en-us/unity-cli/use-unity-cli) — CLI のインストールと主なコマンド
- [Unity CLI as the replacement for the in-Editor MCP server（Unity Docs）](https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli) — `unity mcp` への移行
- [Unity's AI tools（unity.com）](https://unity.com/features/ai) — 各ツールの位置づけ、料金、FAQ
- [About Unity Credits（Unity Docs）](https://docs.unity.com/en-us/ai/credits/credits-about) — クレジットの消費の目安
