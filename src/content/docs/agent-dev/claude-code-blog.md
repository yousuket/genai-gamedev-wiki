---
title: Claude Code 公式ブログのまとめ：ゲーム制作に効く7本
description: Claude Code の公式ブログから、effort、コンテキスト設計、Skill、ツール設計、動的ワークフロー、eval、mods の7本を選び、ゲーム制作での使いどころとあわせて要約します。
sidebar:
  order: 17
lastUpdated: 2026-10-04
---

## 概要

Claude Code の公式ブログ（claude.dev）から、ゲーム制作にコーディングエージェントを使う人に役立つ7本を選び、原文を読んで要約しました。2026年10月時点の内容です。
どの記事もゲームには触れていません。そのため各記事に、ゲームのプロジェクトでどう使えるかを、この Wiki の考えとして付けています。
要点は、日々の設定（effort、コンテキスト）、知識の置き方（Skill、ツール設計）、大きな作業（動的ワークフロー、eval）、拡張（mods）の4つの層に分かれます。

## 7本を、どの順番で読むか

次の順番は、手元の作業に近いものから並べたものです。読了時間は合計で約67分です。

| 順番 | 記事 | 公開日 | 一言 | ゲーム制作での使いどころ |
|---|---|---|---|---|
| 1 | Spending your effort | 2026-09-25 | effort を上げると、確認と抜け漏れの検討が増える | 試作は低く、仕上げの確認は高くする |
| 2 | The new rules of context engineering | 2026-07-24 | 指示を減らし、必要なときに読ませる | CLAUDE.md を削る、UI の参照を HTML で渡す |
| 3 | How we use skills | 2026-06-03 | Skill は、手順書ではなくフォルダ | 検証用 Skill、ゲーム固有の落とし穴の記録 |
| 4 | Seeing like an agent | 2026-04-10 | ツールは、モデルの視点で設計する | 検証用 API の設計、ドキュメント調べの分離 |
| 5 | A harness for every task | 2026-06-02 | 作業ごとに、複数エージェントの構成を作らせる | 大規模な整理、原因調査、名前案の選抜 |
| 6 | Automating eval design and hillclimbing | 2026-09-28 | eval を作り、過学習を避けて改善する | ゲーム内のAI機能、Skill や指示の改善 |
| 7 | Getting started with Claude Code mods | 2026-10-01 | Claude Code の動作と画面を、JS/TS で拡張する | 危険なコマンドの確認、コンテキストの残量表示 |

原文どうしには、次のつながりがあります。
- 2、3、4 は、いずれも「必要なときに読み込む」設計（progressive disclosure）を扱っています。
- 5 は、作ったワークフローを Skill として配れること、Skill の評価に使えることを書いています。
- 6 は、改善の対象に、プロンプト、Skill、指示ファイル、モデル、effort を挙げています。1 の effort は、6 では調整するパラメータの1つです。

## 1. effort をどこに使うか

原題: Using Claude Code: Spending your effort（2026年9月25日、8分）。著者は Thariq Shihipar 氏。
[原文](https://claude.dev/blog/spending-your-effort/)

### 要点

- effort は、モデルに「どれだけ計算を使ってよいか」を伝える値です。上げるほど、確認や抜け漏れの検討が増え、モデルが自分で判断する範囲も広がります。
- 仕様が曖昧な依頼では、effort で出来が大きく変わります。フィットネス記録アプリの例では、low が1.5分で記録とグラフだけ、max が67分でヒートチャートまである画面でした。仕様を詳しく渡すと、どの effort でも似た結果になります。
- Terminal-Bench 3.0 の分析では、effort を上げると「抜けていた場合分け」による失敗は減りますが、「方針の誤り」は直りません。
- 著者の目安は、low が相談や下書き、medium が普段の機能実装、high が検証が大切な作業（既存コードのバグ修正など）、max が人が付かずに任せる難題です。`/effort` で会話の途中でも変えられます。
- 機能開発では、「仕様を渡して質問させる、low で実装する、中身を確認する、high で検証する」という流れを使っています。

### ゲーム制作での使いどころ

- ポン出しや、遊んで方向を決める段階は、low か medium が合います。出来上がりを見て指示を足す前提なら、max に67分かける理由がありません。
- 当たり判定のすり抜け、セーブデータの移行、フレーム時間の悪化など、場合分けが多い作業は high が向きます。検証用スクリプトがあれば、high で回す効果も測れます（[検証ループ](/agent-dev/verification-loop/)）。
- 質問させて仕様を固めてから実装させる流れは、[仕様書駆動](/agent-dev/spec-driven/)と同じ形です。仕様が固いほど effort の差が小さくなるので、実装は低めで済みます。
- 手触りの調整は、人が遊んで判断する工程なので、effort を上げても短くなりません（[手触り](/agent-dev/game-feel/)）。利用枠への影響は [コスト管理](/agent-dev/cost-management/) にあります。

## 2. コンテキストエンジニアリングの新ルール

原題: The new rules of context engineering for Claude 5 generation models（2026年7月24日、7分）。著者は Thariq Shihipar 氏。
[原文](https://claude.dev/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models/)

### 要点

- Claude Code のシステムプロンプトの80%以上を、Claude Opus 5 や Claude Fable 5 向けに削除しました。コーディングの評価では、測れる性能低下はなかったとのことです。
- 古い規則は、いまは過剰でした。規則どうしが衝突して、モデルに余計な判断をさせる場面もありました。「規則を与える」より「判断に任せる」、「例を与える」より「道具の設計を良くする」、「全部を最初に入れる」より「必要なときに読ませる」が、新しい方針です。
- CLAUDE.md は短くし、書く量の大半を、コードベースの落とし穴に使います。ファイルを見れば分かることは書きません。検証の手順などは Skill に分けて、CLAUDE.md から参照します。
- 仕様は、Markdown だけでなく、HTML の成果物（artifacts）、テストコード、別のコードベースの関数でも渡せます。デザインは、文章やスクリーンショットよりも、HTML のモックのほうが良い結果になりやすいと書かれています。
- `/doctor` が、Skill と CLAUDE.md の見直しを手伝います。

### ゲーム制作での使いどころ

- 指示ファイルを、半年前の書き方のまま増やしていないか見直します。書き方は [指示ファイルの書き方](/agent-dev/project-instructions/) にあります。足す一方ではなく、古い禁止事項を消すところまでが手入れです。
- ゲーム固有の落とし穴（「ヒットストップは両者を止める」「`.tscn` は手で触らない」など）は、この記事の言う「落とし穴」にあたります。
- HUD やメニューのレイアウトは、説明文ではなく、HTML で作ったモックを渡す手があります。この記事はゲームには触れていませんが、画面の参照を、コードの形で渡す考え方を使えます。
- 見た目の好みは、批評役に渡す採点表（rubric）にして、渡す方法もあります（[検証ループ](/agent-dev/verification-loop/)の批評役）。進捗を残す方法は [コンテキスト管理](/agent-dev/context-management/) を参照してください。

## 3. Skill の使い方

原題: Lessons from building Claude Code: How we use skills（2026年6月3日、11分）。著者は Thariq Shihipar 氏。
[原文](https://claude.dev/blog/lessons-from-building-claude-code-how-we-use-skills/)

### 要点

- Anthropic 社内で数百個の Skill を使った経験をまとめた記事です。Skill は、指示だけでなく、スクリプト、資料、データを含むフォルダです。
- 社内の Skill は9種類に分かれました。ライブラリの参照、製品の検証、データの取得と分析、業務の自動化、雛形の生成、コードの品質とレビュー、CI/CD、障害対応の手順書、インフラ運用です。1つの種類にきれいに収まる Skill が良く、欲張ると迷わせます。
- 製品の検証用 Skill が、出力の質にもっとも効果がありました。検証用の Skill を磨くために、エンジニアが1週間かける価値があるとも書かれています。
- 作り方の勧めは、当たり前のことを書かない、失敗の記録（Gotchas）を育てる、細部は別ファイルに分けて読ませる、手順を縛りすぎない、description は要約でなく「いつ使うか」を書く、スクリプトを入れる、です。
- 配り方は、リポジトリに置くか、プラグインとして配るかです。置いた Skill は、そのぶんコンテキストを使います。

### ゲーム制作での使いどころ

- 最初に作る価値があるのは、検証用の Skill です。「`npm run verify` を実行し、`shots/` を見て報告する」手順と、ボットや撮影のスクリプトをフォルダに入れます（[検証ループ](/agent-dev/verification-loop/)）。
- 原文には、ゲームの例はありません。9種類に当てはめると、雛形の生成は「新しい敵の追加」、障害対応は「性能が落ちたときの調べ方」、業務の自動化は「リリース前の確認」にあたります。
- 一人で作る場合、リポジトリの `.claude/skills` に置けば足ります。マーケットプレイスは、人数が増えてから考えます。
- 同じ失敗を2回したら、Gotchas に1行足します。これは、指示ファイルの育て方（[指示ファイル](/agent-dev/project-instructions/)）と同じ運用です。

## 4. エージェントの視点で見るツール設計

原題: Seeing like an agent: how we design tools in Claude Code（2026年4月10日、7分）。著者は Thariq Shihipar 氏。
[原文](https://claude.dev/blog/seeing-like-an-agent/)

### 要点

- ツールは、モデルの能力に合う形にします。数学の問題に、紙、電卓、コンピューターのどれを渡すかを考えるのと同じです。そのために、出力を読み、試し、モデルの目で見ます。
- 質問のためのツール（AskUserQuestion）は、3回目で形になりました。計画の終了ツールに質問を足す案は混乱し、出力の書式で質問させる案は安定しませんでした。
- 最初の ToDo 管理（TodoWrite）は、モデルが賢くなると、かえって行動を縛りました。サブエージェントの間で共有できる Task に置き換えています。依存関係を持て、更新も削除もできます。
- コードの検索は、事前に索引を作って渡す方式から、モデルが自分で検索する方式（Grep）へ移りました。Skill の導入で、複数の階層をたどって探す形が一般的になりました。
- Claude Code のツールは約20個で、増やす基準は高いです。Claude Code 自身の使い方は、ドキュメントを検索して答えだけを返す専用のサブエージェント（Claude Code Guide）に任せています。

### ゲーム制作での使いどころ

- 検証用の窓口（`window.__game` のような口）は、道具として設計します。呼び出しが少なく、意味が分かる名前と引数にしておくと、使い間違いが減ります。
- 仕様の曖昧な点は、文章で聞き返させるより、選択肢つきの質問で埋められます（[プロンプトの型](/agent-dev/prompt-patterns/)）。
- エンジンの公式ドキュメントのように、読むと長いものは、答えだけを返すサブエージェントに分ける手があります。原文は Claude Code 自身の話ですが、同じ形を自分のプロジェクトに作れます（[コンテキスト管理](/agent-dev/context-management/)）。

## 5. 作業ごとにハーネスを作る動的ワークフロー

原題: A harness for every task: dynamic workflows in Claude Code（2026年6月2日、11分）。著者は Thariq Shihipar 氏と Sid Bidasaria 氏。
[原文](https://claude.dev/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code/)

### 要点

- 動的ワークフローは、Claude がその場で書いた JavaScript で、サブエージェントの構成（ハーネス）を作って動かす機能です。部品は、1体を起動する `agent()`、並べて動かす `parallel()`、連ねる `pipeline()` の3つです。
- 1つの会話で長く作業すると起きる問題への対策です。途中で終わらせる（agentic laziness）、自分の結果をひいきする、何ターンも続くうちに目的がずれる、の3つが挙げられています。別々のコンテキストで動かして避けます。
- 組み合わせるパターンは6つです。分類して振り分ける、分割して集約する（fan-out）、別のエージェントが敵対的に検証する、生成して選別する、総当たりで勝者を決める（トーナメント）、終わるまで繰り返す。
- 使い道は、移行や整理、調査、事実確認、並べ替え、規則の遵守の確認、原因調査、好みの選抜、簡易な eval などです。普通のコーディングに5人の審査員は要らず、トークンも多く使うため、使う場面を選びます。
- `ultracode` という語で、ワークフローを使うよう促せます。`/goal` や `/loop` と組み合わせられ、トークンの上限も指定できます。保存して、Skill として配ることもできます。

### ゲーム制作での使いどころ

- 原文にゲームの例はありません。大きな分割（巨大な `game.ts` を機能ごとに分ける）や名前の一括変更は、移行の項の使い方で、修正ごとに worktree と審査役を置く形にあたります。
- 再現しにくいバグは、原因調査の項のとおり、複数の仮説を別々に検証させます。物理の挙動のゆれや、まれに起きるクラッシュに向きます。
- 敵や技の名前、アイテムの案は、生成して選別し、トーナメントで3つに絞る使い方ができます。最後に決めるのは人です。
- 指示ファイルの規則を守れているかは、規則1つにつき1体の検証役を置く方式で調べられます。
- 並列の使い分けは [並列開発](/agent-dev/parallel-agents/) の表に、検証役の考え方は [検証ループ](/agent-dev/verification-loop/) にあります。
- 「別のエージェントが敵対的に検証する」と「終わるまで繰り返す」を、実物との比較で組み合わせた例が、Claude of Duty の作者が名付けた [Gauntlet Loop](/agent-dev/gauntlet-loop/) です。

## 6. eval の設計と hillclimbing の自動化

原題: Automating eval design and hillclimbing with Claude（2026年9月28日、12分）。著者は Lance Martin 氏。
[原文](https://claude.dev/blog/automating-eval-design-and-hillclimbing/)

### 要点

- eval は、アプリや Skill の性能を、決まったタスクで測る仕組みです。良い eval は、タスクが本番を反映し、強いモデルや高い effort ほど点が上がり、最上位でも満点に届かず、実行ごとのばらつきが小さいものです。
- 難しいケースは、今のモデルが落とすからではなく、人が難しいと判断した理由で選びます。
- claude-api Skill の `/claude-api build-eval` は、質問に答えると、事例、採点者、実行の仕組みをコードベースに作ります。採点者は、可能なら決まったコードの判定、開かれた出力では別のモデルによる採点を使います。採点が自分の感覚と合うかを、人が確かめます。
- `/claude-api hillclimb` は、1回に1つだけ変更して再測定します。事例を学習用と未見のテスト用に分け、学習用だけ上がってテスト用が上がらなければ、過学習を疑って戻します。
- 例では、サポートの問い合わせ44件（探索に30件、未見に14件）で、モデルと effort の選び直しとプロンプトの整理を行い、未見の14件で、正答の割合が78.6%から90.5%、費用は約5分の1になりました。

### ゲーム制作での使いどころ

- 原文は、AIを使うアプリ向けの記事です。ゲームでは、NPC の会話や生成クエストのように、ゲーム内でモデルを呼ぶ機能を作るときに使えます。
- 自分の Skill や指示ファイルの改善にも、同じ手順が使えます。改善の対象に、指示ファイルや Skill が含まれています。
- 推測ですが、ボットでの難易度調整（[バランス調整](/design/balancing/)）も、ボットに合わせすぎると人が遊んだときにずれます。学習用とテスト用に乱数の seed を分ける考え方が使えます。

## 7. Claude Code の mods

原題: Getting started with Claude Code mods（2026年10月1日、11分）。著者は Addy Osmani 氏。
[原文](https://claude.dev/blog/getting-started-with-claude-code-mods/)

### 要点

- mod は、Claude Code の中で動く小さな JavaScript か TypeScript のファイルです。観察、書き換え、画面の描画ができます。Claude Code 2.1.287 以降で使え、仕組みとしては、プラグインに入ったフックです。
- フックは連なっていて、観察する、渡す内容を書き換える、自分で答えて止める（拒否する）の3つができます。対象は、ツールの呼び出し、送信されたプロンプト、ターンの開始と終了、スラッシュコマンド、画面の描画です。
- 例の1つ目は、コンテキストの残量を天気で示す Token Weather で、約80行です。Claude に頼めば作ってもらえます。
- 2つ目の Blast Radius は、`rm -rf` や `git reset --hard` などの危険なコマンドを止め、影響するファイルを見せて、実行か取りやめかを選ばせます。コマンドの文字列を見る仕組みなので、確実に止めたいなら権限の設定を使います。
- mod は、公開した人が書いたコードで、Claude Code と同じ権限で動きます。読んでから入れます。

### ゲーム制作での使いどころ

- 原文にゲームの例はありません。生成した素材を消す整理や、巨大なバイナリを含むリポジトリでの `git reset --hard` のように、戻しにくい操作の前に確認を挟む使い方があります（[コンテキスト管理](/agent-dev/context-management/)の git の節）。
- Token Weather と同じ仕組みで、長いセッションの残量を見ながら、区切りどころを判断できます。
- 3つ目の例の Replay Theater は、直前のターンの編集を1つずつ差分で見直せます。数値調整の変更を確認するときに向きます。
- 原文の発想の例にある、プロンプトに自分のチームの規約を足すフックも、個人で使えます。毎回守らせたいことは、指示ファイルより、フックのほうが確実です（[指示ファイル](/agent-dev/project-instructions/)）。

## 7本に共通すること

原文から読み取れる共通点です。

- 全部を最初に入れない。2、3、4 が、必要なときに読ませる設計を勧めています。
- モデルが賢くなったら、古い前提を見直す。2 は規則と例、4 は ToDo ツールを、そのために削除、置き換えています。
- 確認を分離する。5 は検証役を別のコンテキストに置き、6 は未見のテスト用の事例で過学習を避けます。1 は effort を、確認の量の調整として説明しています。
- 費用との釣り合いを見る。5 は普通の作業に審査員5人は要らないと書き、6 は費用を下げる改善を例にしています。

推測ですが、ゲーム制作では、検証の仕組み（3 の検証用 Skill、6 の採点、7 のコマンド確認）を先に作り、そのうえで 5 のような大きな作業を任せる順番が、手戻りが少ないと考えられます。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-10-04**: 初版作成。7本を掲載。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Using Claude Code: Spending your effort](https://claude.dev/blog/spending-your-effort/) — effort の効き方と、使い分けの目安
- [The new rules of context engineering for Claude 5 generation models](https://claude.dev/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models/) — システムプロンプトの削減と、指示の設計
- [Lessons from building Claude Code: How we use skills](https://claude.dev/blog/lessons-from-building-claude-code-how-we-use-skills/) — Skill の9種類と作り方
- [Seeing like an agent: how we design tools in Claude Code](https://claude.dev/blog/seeing-like-an-agent/) — ツール設計の経緯
- [A harness for every task: dynamic workflows in Claude Code](https://claude.dev/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code/) — 動的ワークフローとパターン
- [Automating eval design and hillclimbing with Claude](https://claude.dev/blog/automating-eval-design-and-hillclimbing/) — eval と hillclimbing の原則とコマンド
- [Getting started with Claude Code mods](https://claude.dev/blog/getting-started-with-claude-code-mods/) — mods の仕組みと3つの例
