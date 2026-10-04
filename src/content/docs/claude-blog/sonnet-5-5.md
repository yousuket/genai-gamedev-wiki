---
title: Claude Sonnet 5.5 で作る：Opus との使い分け、料金、移行と設定（Building with Claude Sonnet 5.5）
description: Sonnet 5.5 を Opus 5.5 とどう使い分けるか、料金とモデルの仕様、Sonnet 5 からの移行で壊れる6点、effort と検証の設定、拒否とフォールバック、Claude Code での扱いを、原文に沿って掘り下げます。
sidebar:
  order: 8
lastUpdated: 2026-10-04
---

## 概要

- 原題は「Building with Claude Sonnet 5.5」です。公開日は2026年9月28日、著者は Addy Osmani 氏、読了時間は9分です（[原文](https://claude.dev/blog/building-with-claude-sonnet-5-5/)）。副題は「Sonnet を Opus より選ぶ場面、費用、調整のしかた」です。
- Sonnet 5.5 は、Claude 5.5 ファミリーで、Opus 5.5 に続く2つ目のモデルです。原文は、Sonnet 5 より賢く、効率がよく、30%速い、としています。1トークンあたりの価格は Sonnet 5 のままで、同じ仕事に必要なトークンが少ないため、多くの作業で費用が最大30%下がる、という説明です。
- この記事で分かること: Opus 5.5 との使い分けの表、料金とモデルの仕様、Sonnet 5 から移るときの変更点（thinking、`tool_choice`、computer use など）、effort と検証の調整、拒否の扱い、Claude Code での使い方です。
- 原文は、API を使って自分のアプリを作る開発者向けの記事です。ゲームの話は、Epic Games の担当者のコメントが1つあるだけです。ゲーム制作への当てはめは、後半の節で、このWikiの考えとして書きます。
- 姉妹記事は、[Opus 5.5 を使いこなす](/claude-blog/opus-5-5-guide/)（同じ著者）です。

## 試しに動かす: レスポンスは型ごとに読む

原文は、まず最小のコードを載せています。モデルIDは `claude-sonnet-5-5`、`effort` は `medium` で、「マイクロサービスとモノリスのトレードオフを分析して」と頼む内容です。

```python
response = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    output_config={"effort": "medium"},
)
for block in response.content:
    if block.type == "text":
        print(block.text)
```

ここで原文が強調するのは、返ってきた内容を、ブロックの型（type）ごとに読むことです。Sonnet 5.5 は、既定で考えてから答えます（thinking が既定でオン）。そのため、レスポンスの最初が thinking ブロックのことがあり、`content[0].text` と決め打ちで読むコードは壊れます。

## Sonnet 5.5 と Opus 5.5 の使い分け

原文は、Claude 5.5 ファミリーの役割を、次のように分けます。
- Opus 5.5: 慎重な判断が必要な複雑な仕事向けです。
- Sonnet 5.5: 範囲の決まった日常の仕事（バグ修正、機能の素早い反復）向けです。体裁の整った文書、スライド、スプレッドシートも作れ、デザインの目がある、とされています。速さは、素早い反復に向きます。
- Haiku 5.5: 数週間のうちにファミリーに加わる予定で、大量で低遅延の処理向けです（原文の公開時点）。

| 作業 | 最初に試すモデル |
|---|---|
| 範囲の決まった日常のコーディング（バグ修正、機能の素早い反復、要件に対する確認） | Sonnet 5.5 |
| 大量の日常の開発 | Sonnet 5.5 |
| 体裁の整った文書、スライド、スプレッドシート（1枚の概要、図、要約スライド、文書の修正、表の整理など）。デザインの目が役立つ作業 | Sonnet 5.5 |
| 繰り返し実行する、定義のはっきりしたエージェント作業（調査、レビュー、下書き） | Sonnet 5.5 |
| 慎重な判断が要る複雑な仕事（長期のエージェント的コーディング、知識労働） | Opus 5.5 |
| 最高の知能が必要な、最も難しい問題 | Opus 5.5 |

原文は、使い分けの目安を一言でまとめています。Sonnet 5.5 が向くのは、はっきりした仕様と、結果を確かめる手段があるタスクです。プロンプトのガイドの言葉として、最も難しい長期の仕事には Opus 系が向く、とも引いています。

### Epic Games の早期テスト

原文は、Epic Games の COO、Daniel Vogel 氏のコメントを引いています。要約すると、早期テストで Sonnet 5.5 は、上位のモデルに期待する品質の水準を超えました。システム設計の監査とデータフローのレビューに耐え、ゲームプレイのシステム設計のために数万行のコードを管理し、応答は軽快で、数時間かかる作業をこなし、細かく指示しなくても成果を出した、という内容です。ゲーム業界の例は、原文ではこの1つだけです。

## 料金（2026年10月時点）

100万トークンあたりの価格です。

| 項目 | Sonnet 5.5 | Opus 5.5 |
|---|---|---|
| 入力 | 2ドル | 4ドル |
| 出力 | 10ドル | 20ドル |
| キャッシュ書き込み（5分） | 2.50ドル | 5ドル |
| キャッシュ書き込み（1時間） | 4ドル | 8ドル |
| キャッシュ読み出し | 0.20ドル | 0.20ドル |

補足は次のとおりです。
- バッチ処理とプロンプトキャッシュを含め、Sonnet 5.5 の価格はすべて Sonnet 5 と同じです。モデルIDを替えても、トークン単価の請求は変わりません。
- 米国内のみの推論（`inference_geo: "us"`）は、標準価格の1.1倍です。
- 単価は同じでも、請求総額は変わります。Sonnet 5.5 は、Sonnet 5 より、1タスクに使うトークンが少ないためです。
- 既定の effort は、画面や製品によって違います。Claude Platform（API）では high、Claude Code では medium です。
- 画像は、高解像度の区分（長辺が最大2576ピクセル）を使います。2000×1500の画像は、Sonnet 4.6、Sonnet 4.5、Haiku 4.5 に比べて、約2.5倍のトークンを使います。細部が要らないなら、送る前に縮小します。

価格は、公式の料金表でも確かめました（[Pricing](https://platform.claude.com/docs/en/about-claude/pricing)）。費用全体の考え方は、[コスト管理](/agent-dev/cost-management/) にあります。

## モデルの仕様（2026年10月時点）

| 項目 | Sonnet 5.5 |
|---|---|
| モデルID | Claude API、Claude Platform on AWS、Google Cloud、Microsoft Foundry では `claude-sonnet-5-5`。Amazon Bedrock では `anthropic.claude-sonnet-5-5` |
| コンテキストウィンドウ | 100万トークン。標準で使え、ベータ用のヘッダーは不要 |
| 最大出力 | 12.8万トークン。Message Batches API では、ベータヘッダー `output-300k-2026-03-24` で最大30万 |
| 知識の期限 | 2026年6月 |
| thinking | 既定でオン（適応型）。`between_tools` で、最初の考える段階をオフにできる |
| effort | low、medium、high、xhigh、max |
| 既定の effort | API は high、Claude Code は medium |
| トークナイザー | Sonnet 5 と同じ |
| キャッシュできる最小のプロンプト | 512トークン（Sonnet 5 は1,024） |
| レート制限 | Sonnet 5 とは別枠。既定の段階の値は同じ |
| Priority Tier | Claude API で利用可 |
| データの保持 | 対象の顧客はゼロ保持で利用可 |

effort の設定について、原文は、API が high を既定にしているのは、強い結果から始めるためだとします。まず high で評価し、そのうえで仕事に合う effort を選びます。xhigh や max を使いたくなったら、長く考えて費用が増え、Sonnet の持ち味（品質、速さ、費用の釣り合い）が薄れる可能性があります。その場合は Opus 5.5 を検討します。

## Sonnet 5 から移る: 壊れる点と手順

モデルIDを `claude-sonnet-5-5` に替えたうえで、5つの破壊的変更と、レスポンスの形の変更1つに対応します。原文は、それぞれを詳しく扱う移行ガイドがあるとしています。Claude Code では、`/claude-api migrate this project to claude-sonnet-5-5` と頼むと、同梱の claude-api Skill が、モデルIDの置き換えと、パラメータの変更をコード全体に適用します。

### 1. 最初の thinking は `between_tools` で切る

Sonnet 5.5 では、`thinking` を指定しない依頼は、適応型の thinking で動きます。`thinking: {"type": "disabled"}` は400エラーになります。代わりに、新しい `between_tools` を送ります。thinking はツール呼び出しの合間だけに起き、応答時間は同じか短くなります。

`between_tools` の制限は次のとおりです。
- 使える effort は、low、medium、high です。xhigh と max では400エラーになります。そこで動かすなら、適応型 thinking を使います。
- 他のフィールド（`display`、`budget_tokens`、`block_binding`）は一緒に送れません。送ると400エラーです。
- 会話の途中で、effort を変えられません。ターンごとに変えたいなら、適応型 thinking です。
- ツール呼び出しの合間の短い進捗メモは、要約つきの thinking ブロックとして返ります。内容は型ごとに読み、他のアシスタントのターンの内容と一緒に、変更せずに返します。ツールなしの依頼では、テキストだけが返ります。
- すべての提供プラットフォームで、ベータヘッダーなしで動きます。使っている SDK が `between_tools` を知らなければ、SDK を更新します。

数手の考えが要る、ツールなしの依頼には、`between_tools` ではなく適応型 thinking を使います。

### 2. 強制の `tool_choice` を、auto と strict なツールに置き換える

`tool_choice` の type が `any` や `tool` だと、400エラーになります（トークン数の数え上げの API も同じです）。`auto` を送り、ツールに `strict: true` を付けて、入力がスキーマに合うようにします。使う場面は、プロンプトに書きます。strict なツールでは、すべてのオブジェクトに `additionalProperties: false` が必要です。

### 3. 会話は追記だけにする

Sonnet 5.5 の thinking ブロックは、モデルと会話に結びついています。Sonnet 5.5 は、Sonnet 5 の thinking ブロックを読めるので、Sonnet 5 から切り替えた会話は、考えを引き継げます。一方、Sonnet 5.5 のブロックを読めるモデルは、Sonnet 5.5 以外にありません。

### 4. computer use は toolset に移す

computer use（画面を見て操作する機能）は、Claude API と Google Cloud では、`{"type": "computer_toolset_20260801"}` でのみ使えます。`computer_20251124` を宣言すると400エラーです。次の対応が要ります。
- `anthropic-beta: computer-use-2025-11-24` のヘッダーを外します。SDK では、`betas` パラメータを外し、ベータ用ではない標準のクライアントで Messages API を呼びます。
- `tools` の項目を替え、エージェントのループを、`tool_use` ブロックの構成要素、まとめて実行する操作、結果の `toolset_name` に合わせます。
- `fine-grained-tool-streaming-2025-05-14` のベータヘッダーを送っていれば外します。toolset と一緒だと400エラーです。必要なツールには `eager_input_streaming: true` を付けます。
- Amazon Bedrock は、今も `computer_20251124` を受け付けます。

### 5. advisor の組み合わせを確かめる

advisor ツール（上位のモデルに助言を求める仕組み）では、実行役が Sonnet 5.5 のとき、Opus 4.8、Opus 4.7、Sonnet 5 は助言役として拒否されます。受け付けるのは、Opus 5.5、Opus 5、Sonnet 5.5 自身です。助言は、どの助言役のものも暗号化され、`advisor_redacted_result` ブロックで返ります。コードから助言の文面は読めません。

### 6. ツール呼び出しの合間の文は、thinking ブロックから読む

これはエラーにならない変更ですが、画面にモデルのメモが出なくなることがあります。1〜2文より長い合間のメモは、進捗の thinking ブロックとして返り、既定の表示では空です。適応型 thinking では、`thinking.display` を `"updates"`（ベータ。ヘッダー `thinking-display-updates-2026-08-18`）か `"summarized"` に設定し、空でない thinking ブロックを、続く `tool_use` ブロックの前に表示します。`between_tools` では、`display` なしで文が返ります。

そのほか、Sonnet 5.5 には、メッセージごとの effort（ベータ）、会話の途中のシステムメッセージ、会話の途中のツール変更（ベータ）が加わっています。Sonnet 4.6 以前や Haiku 4.5 から移る場合のチェックリストは、移行ガイドにあります。

## 調整のしかた

### effort の掃引をやり直す

effort の段階は調整し直されています。同じ段階でも、Sonnet 5 と同じだけは考えないため、以前の設定は引き継げません。出発点は次のとおりです。

| 場面 | 最初の effort |
|---|---|
| エージェント的でも遅延重視でもない仕事 | high |
| エージェント的コーディング、複数ステップのツール使用（仕様が固い） | medium |
| 同上（難しい、長い） | high |
| チャットなど、遅延が気になる仕事 | medium か low |
| xhigh と max | eval で品質の向上が確認できた箇所だけ |

thinking は `max_tokens` に含まれるため、余裕を持たせます。エージェント的コーディングでは、`max_tokens` をモデルの上限の12.8万にして、ストリーミングで受けます。考える量を減らしたいときは、effort を下げます。システムプロンプトで「考えすぎないで」と頼んでも、確実には減りません。

### Sonnet 5 向けの回避策を外す

Sonnet 5 のプロンプトは、変更なしでよく動くはずです。拒否を避ける誘導、ツール呼び出しの再試行の補助、「怠けるな」のような一文を入れていたら、削って eval を回し直します。他の調整はその後です。

### 低い effort でも、本物の確認をさせる

Sonnet 5.5 は、報告前に自分の作業を確かめるのが普通ですが、low effort のときは、変更を実際に動かす確認を省くことがあります。テストやビルドの出力がないまま「完了」と報告されるなら、プロンプトのガイドは、次の趣旨の段落をシステムプロンプトに入れるよう勧めています。

```text
実行・ビルド・型検査できるコードを変更したら、完了と報告する前に、変更を実際に動かす確認を行う。
プロジェクトのテスト、型検査、ビルド、または変更したコマンド自体を実行する。
構文の確認だけ、あるいは起動に失敗した確認は数えない。足りないのが宣言済みの依存だけなら、
プロジェクト自身のパッケージマネージャーとロックファイルで入れる（sudo やシステムのパッケージマネージャーは使わない）。
実行できる確認が無いときだけ、行わなかった確認とその理由を書く。
```


### 進捗は thinking.display で読む

推論を、返答の文章に書き出させてはいけません。`reasoning_extraction` として断られる原因になります。要約された thinking を読みます。

```python
thinking={"type": "adaptive", "display": "summarized"}
```

ユーザー向けの進捗メモだけが欲しいなら、`display: "updates"`（ベータ）を使います。更新を決まった所で出したいなら、システムプロンプトに、たとえば最初のツール呼び出しの前に1行、最後に短い振り返り、と書きます。

### キャッシュを広く使う

キャッシュできる最小のプロンプトが512トークンに下がったため、短いシステムプロンプトやツール定義もキャッシュできます。キャッシュの読み出しは、入力価格の10分の1です。トップレベルの effort を依頼の間で変えると、キャッシュが無効になります。1ターンだけ別の段階にしたいなら、メッセージごとの effort（ベータ）を使います。こちらはキャッシュを保てます。

## 拒否とフォールバック

原文によると、自動の挙動監査で、Sonnet 5.5 は、アラインメントと誠実さのほとんどの指標で、Sonnet 5 を上回るか並びます。また、最も強力なモデルに近いサイバーセキュリティの防護を持つ、最初の Sonnet です。ふつうのソフトウェア開発には、影響しないとされています。

拒否されたときは、HTTP 200で `stop_reason: "refusal"` が返り、`stop_details` が5つの分類（`cyber`、`bio`、`frontier_llm`、`reasoning_extraction`、`general_harms`）のどれかを示します。サーバー側のフォールバック（`fallbacks: "default"`、ベータ、Claude API）は、`cyber` と `frontier_llm` の拒否だけを、Sonnet 5 で再試行します。他の3つは再試行しません。SDK のミドルウェアや、自前の再試行も使えます。正当なセキュリティ業務のために、Cyber Verification Program が Sonnet 5.5 にまもなく拡大されます。

## 提供状況と Claude Code

提供は、公開日の時点で、Claude API（`claude-sonnet-5-5`）、Amazon Bedrock（`anthropic.claude-sonnet-5-5`）、Claude Platform on AWS、Google Cloud、Microsoft Foundry（Global Standard のデプロイのみ）です。

Claude Code での扱いは、次のとおりです（2026年10月時点）。
- v2.1.284（Agent SDK for TypeScript は v0.3.284 以降）から、`sonnet` というエイリアスが、Claude API 上で Sonnet 5.5 を指します。
- 既定の effort は medium で、100万トークンの窓が標準です。
- Claude Code では、Sonnet 5.5 の thinking はオフにできません。effort で、考える量が決まります。
- Sonnet 5.5 に、fast mode はありません。
- 既定のモデルは Opus 5.5 のままです。範囲の決まった作業は、`/model sonnet` で切り替えます。

effort の使い方は [Spending your effort の記事](/claude-blog/spending-your-effort/)、費用の見積もりは [Opus 5.5 の費用の記事](/claude-blog/opus-5-5-cost/) にあります。

## ゲーム制作での使いどころ

原文はゲームの制作に触れていません。以下は、このWikiの考えです。モデルの使い分けは、原文が述べる範囲（範囲の決まった仕事は Sonnet、最も難しい長期の仕事は Opus）にとどめ、それ以上は断定しません。

### Claude Code での切り替え

小さな個人ゲームでも、原文の表を、作業の分類に置き換えられます。
- 敵の追加、UI の文言修正、バグ1件の修正、セーブの項目追加のように、仕様と確認手段がある作業は、`/model sonnet` で回します。
- 設計を決める段階（ゲームの核となるループの組み替え、データ構造の大きな変更）は、既定の Opus 5.5 のままにします。
- effort は、仕様が固い作業は medium、難しい作業や長い作業は high から始めます。これは、エージェント的コーディングについての原文の出発点です。

### 検証の段落を CLAUDE.md に入れる

「テストやビルドの出力なしに、完了と言わせない」ための段落は、API だけでなく、Claude Code の指示ファイルにも使えるはずです。ゲームなら、確認の手段を具体的に書き換えます。

```text
ゲームのコードを変更したら、完了と報告する前に、次を実行する。
- npm test
- npm run build
- npm run smoke（ヘッドレスで起動し、60秒間ボットを動かして、例外が出ないことを確かめる）
実行できなかった確認は、その名前と理由を、報告の最後に書く。
```

確認の仕組み自体は [検証ループ](/agent-dev/verification-loop/)、指示ファイルの書き方は [プロジェクト指示ファイル](/agent-dev/project-instructions/) にあります。

### ゲームの中でモデルを呼ぶ機能（推測）

NPC の会話や、プレイヤーの入力の判定に API を使うなら、この記事は移行と設定の手引きになります。
- ゲームの画面に「考え中」の表示を出すなら、thinking の進捗（`display`）が使えます。
- 返答の速さが大事な会話は、effort を low か medium から試します。原文の「チャットなど遅延が気になる仕事」に当たります。
- 固定の長いシステムプロンプト（世界観の設定など）は、キャッシュに向きます。512トークンから対象になるため、短い設定でも使えます。
- 返答の質と費用は、勘ではなく eval で比べます。[eval の設計と hillclimbing の記事](/claude-blog/eval-hillclimbing/) の手順が使えます。

### 費用と速さ

試作の反復では、速さが効きます。原文は、Sonnet 5.5 を、速い反復に向くモデルとして位置づけています。原文の料金表では、入力と出力の単価は Opus 5.5 の半分です（入力2ドルと4ドル、出力10ドルと20ドル）。1回に数分の作業を何十回も回す場面では、この差が積み上がるはずです（推測です）。具体的な計算の例は [コスト管理](/agent-dev/cost-management/) にあります。

## AIの活用ポイント

- 範囲の決まった作業を頼むときは、完了の条件と、確認の手段を依頼に入れます。
  ```text
  敵「スライム」の移動速度を、data/enemies.json で20%下げて。
  終わりの条件: npm test が通り、npm run smoke が最後まで動くこと。
  実行しなかった確認があれば、名前と理由を書いて。
  ```
- テストやビルドの出力がないまま「完了」と報告されたら、effort を1段上げるか、本物の確認を求める段落を入れます。原文は、low effort でこの省略が起きうるとしています。
- 古い設定の回避策は、新しいモデルに替えたとき、いったん外して、結果を見ます。
- 移行は、`/claude-api migrate this project to claude-sonnet-5-5` のように、Claude に頼めます。変更後のコードは、差分を読みます。
- API で使うときは、レスポンスをブロックの型ごとに読みます。thinking ブロックが先頭に来ても、壊れません。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Building with Claude Sonnet 5.5](https://claude.dev/blog/building-with-claude-sonnet-5-5/) — 原文（Addy Osmani、2026年9月28日）
- [Introducing Claude Sonnet 5.5（Anthropic）](https://www.anthropic.com/claude-sonnet-5-5) — 公開日、価格、速度と費用の説明（2026年9月28日）
- [Pricing（Claude API Docs）](https://platform.claude.com/docs/en/about-claude/pricing) — 価格表（2026年10月時点）
- [Models overview（Claude API Docs）](https://platform.claude.com/docs/en/about-claude/models/overview) — モデルID、コンテキストウィンドウ、最大出力、知識の期限（2026年10月時点）
