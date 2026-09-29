---
title: コストと利用枠の管理
description: コーディングエージェント開発のコスト構造（入力・出力・キャッシュ）、サブスクリプションとAPI従量課金の違い、モデルの使い分け、ポン出しや並列で費用が跳ねる理由と節約の技を、公開された実測とともに解説します。
sidebar:
  order: 14
lastUpdated: 2026-09-29
---

## 概要

コーディングエージェントは、会話のたびにコンテキスト全体を読み直すので、使い方によって費用が大きく変わります。
この記事では、費用の構造（入力、出力、キャッシュ、ツール呼び出し）、料金プラン（サブスクリプションの利用枠とAPI従量課金）、作業ごとのモデルの使い分け、ポン出しや並列展開で費用が跳ねる理由、節約の技を説明します。
公開されている実測は、Claude Code の公式ドキュメント、Anthropic の実験記事、作者の投稿にあるものだけを載せ、そのほかは計算式で示します。料金は Anthropic のものを扱い、ほかのツールの料金は [AIコーディングツール](/dev-env/ai-coding-tools/) にまとめています。

## 費用の構造

### 4種類のトークン

API では、処理するトークン（文字を細かく区切った単位）の量に応じて課金されます。エージェント開発では、次の4種類が請求に現れます。

| 種類 | 何にかかるか |
|---|---|
| 入力（キャッシュなし） | 初めて送る内容。新しいファイルの内容、ツールの実行結果、自分のメッセージ |
| キャッシュの書き込み | 次のターン以降に再利用するために、内容を保存する処理 |
| キャッシュの読み出し | 保存済みの内容を読み直す処理。通常の入力よりずっと安い |
| 出力 | モデルが書くコード、説明、内部の思考。思考の分も出力として課金される |

Claude Code のドキュメントによれば、モデルは会話を覚えていないので、Claude Code は毎回、システムプロンプト、指示ファイル、過去のやり取りとツールの結果、新しいメッセージをすべて送り直します。前回と同じ部分はキャッシュから読まれ、キャッシュの読み出しの単価で課金されます。

### 料金表（2026年9月時点）

Claude API の料金（100万トークンあたり、米ドル）です。

| モデル | 入力 | キャッシュ書き込み（5分） | キャッシュ読み出し | 出力 |
|---|---|---|---|---|
| Claude Fable 5.1 | 10 | 12.50 | 0.25 | 50 |
| Claude Opus 5.5 | 4 | 5 | 0.20 | 20 |
| Claude Opus 5 | 5 | 6.25 | 0.50 | 25 |
| Claude Sonnet 5.5 | 2 | 2.50 | 0.20 | 10 |
| Claude Haiku 4.5 | 1 | 1.25 | 0.10 | 5 |

出典: [Pricing（Claude API Docs）](https://platform.claude.com/docs/en/about-claude/pricing)。キャッシュ書き込みには1時間のキャッシュ（入力単価の2倍）もあります。Claude 4.7 以降のモデルは新しいトークナイザーを使い、同じ文章でトークン数が約30%増えるとされています。

### ターン数が効く

エージェントの1ターンごとに、コンテキスト全体の読み出しが発生します。コンテキストが会話とともに伸びるので、ターンを重ねるほど、読み出しの総量は加速して増えます。費用の概算は次の式で表せます。

```text
費用 ≒ エージェント数 × ターン数 ×（
          読み直すコンテキスト × 読み出し単価
        + 新しく増える入力 × 書き込み単価
        + 出力 × 出力単価 ）
```

次のスクリプトは、この式をそのまま計算します（この記事のために書いた例です）。

```js
// 1MTokあたりの料金（USD、2026年9月時点）
const PRICE = {
  'opus-5':     { write5m: 6.25, read: 0.5, output: 25 },
  'opus-5.5':   { write5m: 5,    read: 0.2, output: 20 },
  'sonnet-5.5': { write5m: 2.5,  read: 0.2, output: 10 },
  'haiku-4.5':  { write5m: 1.25, read: 0.1, output: 5 },
};

// turns: ターン数 / ctx: 毎ターン読み直す平均コンテキスト（トークン）
// newIn: 毎ターン新しく増える入力 / out: 毎ターンの出力 / agents: 並列数
export function estimate(model, { turns, ctx, newIn, out, agents = 1 }) {
  const p = PRICE[model];
  return (agents * turns * (ctx * p.read + newIn * p.write5m + out * p.output)) / 1e6;
}
```

## 公開されている実測

| 事例 | 規模 | 費用 | 出典 |
|---|---|---|---|
| Homeworld 風の宇宙RTS（Opus 5、Three.js、外部素材なし） | 入力6.86万、出力460万、キャッシュ読み出し8.372億、キャッシュ書き込み1,360万トークン | 632.65ドル（作者の投稿） | [@mikeluan123 の投稿](https://x.com/mikeluan123/status/2081716631986983093)、[explainx.ai](https://explainx.ai/blog/opus-5-homeworld-space-rts-mikeluan-july-2026) |
| C コンパイラ（Opus 4.6、エージェント16並列、約2,000セッション） | 入力約20億、出力約1.4億トークン | 2万ドル弱 | [Anthropic Engineering](https://www.anthropic.com/engineering/building-c-compiler) |
| 開発者1人あたり（企業での平均） | 稼働した日あたり | 約13ドル。90%の開発者は30ドル未満。月に150〜250ドル | [Manage costs effectively](https://code.claude.com/docs/en/costs) |
| ツールの改善1件（incident.io） | 18%（30秒）の速度改善 | 約8ドルのクレジット | [incident.io](https://incident.io/blog/shipping-faster-with-claude-code-and-git-worktrees) |

Claude of Duty 本体の費用は、リポジトリの README や `prompt.md`、確認できた報道には載っていません。その代わりに、同じ型のプロンプトで作られた Homeworld 風のRTSに、詳しい数字が公開されています。

### 632.65ドルの内訳を計算する

公開された数字を、上の料金表（Opus 5）に当てはめて計算します。

| 項目 | トークン数 | 単価（100万あたり） | 費用 |
|---|---|---|---|
| 入力 | 6.86万 | 5ドル | 約0.34ドル |
| 出力 | 460万 | 25ドル | 115ドル |
| キャッシュ読み出し | 8.372億 | 0.50ドル | 約418.6ドル |
| キャッシュ書き込み（5分） | 1,360万 | 6.25ドル | 85ドル |
| 合計 |  |  | 約618.9ドル（書き込みが1時間キャッシュなら約669.9ドル） |

公表された632.65ドルは、この2つの計算の間に収まります。読み取れることは次のとおりです。

- 費用の約66%は、キャッシュの読み出しでした。エージェントが会話のたびに大きなコンテキストを読み直した費用です
- 出力は約18%です。コードを書く量よりも、読み直す量が費用を決めています
- 入力（キャッシュなし）はほぼゼロです。ほぼすべてがキャッシュ経由で、キャッシュが効いているからこの金額に収まっています

### 計算式を当てはめる

次の設定で計算した例です。数字は、この記事の仮定であり、公開された実測ではありません。

| 設定 | 仮定 | Opus 5 | Opus 5.5 | Sonnet 5.5 | Haiku 4.5 |
|---|---|---|---|---|---|
| 1セッション | 100ターン、コンテキスト10万、新しい入力3千、出力1.5千 | 10.63ドル | 6.50ドル | 4.25ドル | 2.13ドル |
| 5並列 | 上の5倍 | 53.13ドル | 32.50ドル | 21.25ドル | 10.63ドル |
| ポン出しの長時間版 | 10エージェント × 300ターン、コンテキスト15万 | 393.75ドル | | 157.50ドル | |

最後の行は、Homeworld の実測（632.65ドル）と同じ桁に収まります。ポン出しで数百ドルになるのは、この構造から自然に出てくる金額です。

## 料金プラン：利用枠と従量課金

### サブスクリプション（2026年9月時点）

| プラン | 料金 | Claude Code | 利用量 |
|---|---|---|---|
| Free | 無料 | 含まれない | 基準 |
| Pro | 月20ドル（年払いで月17ドル相当） | 含まれる | 5時間のセッションあたり、Free の少なくとも5倍 |
| Max | 月100ドルから（5倍と20倍の2段階） | 含まれる | 5時間のセッションあたり、Pro の5倍または20倍 |
| Team（Standard席） | 年払いで月20ドル、月払いで月25ドル | 含まれる | Pro より多い |
| Team（Premium席） | 年払いで月100ドル、月払いで月125ドル | 含まれる | Standard 席の5倍 |

出典: [Claude の料金プラン](https://claude.com/pricing)、[Claude Code with Pro or Max](https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan)。

利用枠のしくみは次のとおりです。

- Pro と Max の利用枠は、Claude のチャットと Claude Code で共有されます
- Team と Enterprise では、席ごとの枠が、5時間の窓と週の窓で管理されます（[Manage costs effectively](https://code.claude.com/docs/en/costs)）
- 枠を使い切ったときは、上位プランへの変更、リセットを待つ、または「使用クレジット」を有効にして API 料金で続ける方法があります。使用クレジットは、同意しない限り自動では課金されません
- サブエージェントの作業も、同じ枠を消費します

### API従量課金

API キーで Claude Code を使うと、上の料金表どおりに、トークンごとに課金されます。使った分だけ払うので、月の上限がなく、ポン出しや並列の実験で費用が読みにくくなります。

- `/usage` でセッションの費用（定価での概算）を確認できる。Pro や Max では、費用の欄は請求に関係せず、枠の使用量が表示される
- 非対話の実行（`claude -p`）には、費用の上限を決める `--max-budget-usd` と、ターン数の上限を決める `--max-turns` がある。サブエージェントの費用も上限に含まれる

### どちらを選ぶか

| 状況 | 目安 |
|---|---|
| 週に数時間、1本のセッションで進める | Pro |
| 毎日長時間使う、複数のセッションを並列に動かす | Max |
| ポン出しなどの長時間の実験を、費用の上限つきで走らせる | API キーで、`--max-budget-usd` を付ける |
| 枠は足りているが、たまに超える | 使用クレジットに月の上限を付けて有効にする |

## 作業ごとのモデルの使い分け

Anthropic の公式ブログは、モデルを次のように使い分けることを勧めています。

| 作業の性質 | モデル | 根拠 |
|---|---|---|
| 機械的な変更、コンテキストにあるコードの精密な編集 | Sonnet | 品質を落とさずに費用を下げられる |
| 微妙なバグ、未知の領域、設計の判断 | Opus | 曖昧さの扱いが強い |
| 他のモデルでは終わらない非常に難しい作業、長い多段の作業 | Fable | 1トークンあたりは高いが、試行が少なく済む場合がある |

同じ記事は、難しい多段の作業では、大きなモデルの方が反復が少なく、合計の費用が安くなることもあると説明しています。単価だけで選ばず、やり直しの回数で比べます。

ゲーム開発に当てはめた例です（筆者の整理で、単価は上の料金表から）。

| 作業 | 例 | 選び方 |
|---|---|---|
| 数値の調整、UI の文言、アセット生成のスクリプト | 「敵の速度を10%上げる」 | Sonnet 5.5、effort は low〜medium |
| 新しいモジュールの実装 | 音や UI の担当 | Sonnet 5.5 か Opus 5.5（既定の medium） |
| 原因不明のバグ、描画や物理の設計 | 「特定の場面だけ重い」 | Opus |
| ファイル検索、ログの調査（サブエージェント） | 「この関数の呼び出し元を探して」 | Haiku |

Claude Code の機能では、次のものが使えます（[Model configuration](https://code.claude.com/docs/en/model-config)、[Create custom subagents](https://code.claude.com/docs/en/sub-agents)）。

- `/model` と `--model` でモデルを切り替える
- `opusplan` は、計画の段階では Opus、実行の段階では Sonnet を使う設定
- サブエージェントの定義に `model: haiku` と書くと、そのサブエージェントだけ小さなモデルにできる
- `CLAUDE_CODE_SUBAGENT_MODEL` で、サブエージェントの既定のモデルを決められる
- `/effort` で思考の深さを変える。Opus 5 のガイドは、`low` と `medium` を費用と時間の主な調整手段として積極的に使い、難しい作業でだけ `xhigh` に上げることを勧めている

## ポン出しや並列で費用が跳ねる理由

| 理由 | 根拠 |
|---|---|
| 終わりのないループ | Claude of Duty のプロンプトは、完璧になるまで繰り返すよう指示している。終了条件が甘いと、ターン数が際限なく増える |
| エージェントの数だけコンテキストが増える | Anthropic は、エージェントが通常のチャットの約4倍、マルチエージェントが約15倍のトークンを使うと報告している |
| エージェントチームの重さ | 各メンバーが計画モードで動くと、通常のセッションの約7倍のトークンを使う（Claude Code のドキュメント） |
| モデルの委任の傾向 | Opus 5 は以前のモデルより積極的にサブエージェントへ委任し、小さな作業では費用と時間が増える（Anthropic のプロンプトガイド） |
| 長いセッションが積み上げる読み直し | 上の計算のとおり、コンテキストが大きいほど、毎ターンの読み出しが増える |

ポン出しの考え方は [ポン出し（一発生成）の技術](/agent-dev/one-shot/)、並列の使い分けは [サブエージェントと並列開発](/agent-dev/parallel-agents/) を参照してください。並列の上限は、`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`（深さ）と `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`（同時数）で決められます。

## 節約の技

### 1. コンテキストを小さく保つ

Claude Code の公式ドキュメントが挙げる主な方法です（[Manage costs effectively](https://code.claude.com/docs/en/costs)）。

- 関係のない作業に移るときは `/clear` する
- 指示ファイルは200行未満にし、特定の作業だけに要る手順は、必要なときだけ読み込まれる「スキル」に移す
- 使っていない MCP サーバーは `/mcp` で無効にする。`/context` で何がコンテキストを使っているか見られる
- テストの出力のように長い結果は、フックで失敗した部分だけに絞る。ドキュメントには、`npm test` の出力から失敗の行だけを返すフックの例がある
- 出力の多い作業（テスト、ログの調査）は、サブエージェントに任せ、要約だけを受け取る
- 依頼は具体的にする。「このコードベースを改善して」ではなく、「auth.ts のログイン関数に入力の検証を足して」と書くと、読むファイルが減る

### 2. 失敗したら早めにやり直す

同じ問題を2回直して直らないなら、`/clear` して具体的な指示で頼み直します（[Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)）。失敗のやり取りを抱えたまま、毎ターン読み直すのは、費用の面でも損です。方向が違うと気づいたら、`Esc` で止めます。

### 3. キャッシュを壊さない

モデルごとにキャッシュがあり、会話の途中でモデルを切り替えると、内容が同じでも全体を再計算します。多くのモデルでは、effort を途中で変えても同様です。公式は、セッションの最初にモデルと effort を選び、`/compact` は作業の区切りまで待つことを勧めています（[How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching)）。

### 4. 思考の深さを下げる

思考のトークンは出力として課金されます。単純な作業では `/effort` を下げます。Opus 5.5、Sonnet 5.5、Fable のモデルは、思考を無効にできません。

### 5. ローカルモデルを使う

Ollama は、ローカルのモデルを Claude Code から使う手順を公開しています（`ollama launch claude`、または環境変数 `ANTHROPIC_BASE_URL=http://localhost:11434` などを設定して `claude --model qwen3.5`）。大きなリポジトリでは、64k 以上のコンテキストが推奨されています（[Ollama](https://docs.ollama.com/integrations/claude-code)）。

ローカルモデルの品質を、Claude と比べた公開の数字は確認できていません。筆者の推測では、費用がかからない代わりに、長い作業の成功率が下がると考えられるので、アセット生成のスクリプトや定型のリファクタリングのような、失敗しても損の小さい作業に向きます。根拠は、Anthropic の公式ブログが、曖昧さの多い作業や難しい多段の作業では大きなモデルの方が強いと説明していることです。

### 6. 使用状況を見える化する

- `/usage` で、セッションの概算費用と、（サブスクリプションでは）枠の使用量、スキル、サブエージェント、MCP サーバーごとの内訳を見る
- ステータスラインにコンテキストの使用量を出す
- `/insights` で、最近のセッションの傾向（どこで詰まったか）を見る

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Pricing（Claude API Docs）](https://platform.claude.com/docs/en/about-claude/pricing) — モデル別のトークン単価、キャッシュの倍率
- [Claude の料金プラン](https://claude.com/pricing) — Pro、Max、Team、Enterprise の料金
- [Using Claude Code with your Pro or Max plan（Claude Help Center）](https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan) — 利用枠の共有と使用クレジット
- [Manage costs effectively（Claude Code Docs）](https://code.claude.com/docs/en/costs) — 費用の追跡、エージェントチームのトークン、節約の方法
- [How Claude Code uses prompt caching（Claude Code Docs）](https://code.claude.com/docs/en/prompt-caching) — キャッシュの仕組みと、キャッシュを壊す操作
- [Model configuration（Claude Code Docs）](https://code.claude.com/docs/en/model-config) — モデルの別名、`opusplan`、effort
- [Create custom subagents（Claude Code Docs）](https://code.claude.com/docs/en/sub-agents) — サブエージェントのモデルの指定
- [Claude Code CLI reference](https://code.claude.com/docs/en/cli-reference) — `--max-budget-usd` と `--max-turns`
- [Choosing a Claude model and effort level in Claude Code（Claude Blog）](https://claude.com/blog/claude-model-and-effort-level-in-claude-code) — 作業ごとのモデルの選び方
- [Prompting Claude Opus 5（Claude API Docs）](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5) — effort とサブエージェントの委任
- [How we built our multi-agent research system（Anthropic）](https://www.anthropic.com/engineering/multi-agent-research-system) — マルチエージェントのトークン消費（約4倍と約15倍）
- [Building a C compiler with a team of parallel Claudes（Anthropic）](https://www.anthropic.com/engineering/building-c-compiler) — 16エージェントの実験の費用
- [Homeworld 風RTS の投稿（@mikeluan123）](https://x.com/mikeluan123/status/2081716631986983093) — トークン数と費用の公開
- [Opus 5 Homeworld RTS Demo（explainx.ai）](https://explainx.ai/blog/opus-5-homeworld-space-rts-mikeluan-july-2026) — 上の投稿の解説
- [Claude of Duty のプロンプト（GitHub）](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md) — 公開されているプロンプト
- [Claude Code with Ollama](https://docs.ollama.com/integrations/claude-code) — ローカルモデルの接続手順
- [How we're shipping faster with Claude Code and Git Worktrees（incident.io）](https://incident.io/blog/shipping-faster-with-claude-code-and-git-worktrees) — 作業ごとの費用の一例
