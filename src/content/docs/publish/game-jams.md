---
title: ゲームジャム・コンテストに出す：選び方、準備、出品のコツ
description: ゲームジャムやコンテストに出す動機と、イベントの選び方、AI利用ルールの読み方、期間別のスコープと時間配分、出品チェックリスト、審査で見られること、出したあとの動き方を、事例と公式ルールから整理します。
sidebar:
  order: 5
lastUpdated: 2026-09-29
---

## 概要

ゲームジャムは、決められた期間でゲームを作って出すイベントです。コンテストは、審査や賞のあるイベントを指します。
個人でゲームを作る人にとって、締め切りとフィードバックを一度に手に入れられる場所です。この記事では次のことが分かります。

- 出す動機と、事例で実際に得られたもの
- 期間、審査方式、AI利用ルールでイベントを見分ける方法
- 応募前にAIの利用条件を読み取る手順
- 期間別のスコープと時間配分の例、出品チェックリスト
- 審査で見られたことと、出したあとの動き方

開催中・開催予定のイベントの一覧は [イベントカレンダー](/publish/events-calendar/) にあります。

## なぜ出すのか

| 動機 | 何が起きるか | 事例での根拠 |
|---|---|---|
| 締め切りがある | 範囲を絞らざるを得ず、完成まで進む | Capybara の作者はゲーム制作が初めてで、約2週間で提出まで到達した（[事例](/cases/browser-capybara/)） |
| フィードバックが来る | プレイした人の指摘で、説明不足や不具合が見つかる | Plug & Prosper は公開後に、結果画面の表示の不具合と説明文のずれを指摘され、修正版を出した（[事例](/cases/browser-plug-prosper/)） |
| 客観的な位置が分かる | 部門別の順位で、自分の作品の強みと弱みが見える | Plug & Prosper は総合1位でも「楽しさ」は11位だった |
| 発信の機会になる | 受賞や結果が、作品と作者を知ってもらうきっかけになる | Capybara は [Vibe Jam](https://vibej.am/) 2026 で945作品の中から1位（賞金25,000ドル）になった |
| 実験の場になる | 新しいモデルやエージェントを、期限つきで試せる | AI Browser Game Jam 4 は「AIを使った開発を試す」ことを目的に掲げている（[itch.io](https://itch.io/jam/ai-jam-4)、2026年9月時点） |

事例の共通点は、締め切りが「小さく作って最後まで出す」ことを後押ししている点です。Plug & Prosper の作者は、ジャム初日にテーマを4通りに解釈した試作を並べ、遊びを比べてから絞りました。4本すべてを提出しています。

## イベントの種類

### 期間

| 期間 | イベントの例（2026年9月時点） |
|---|---|
| 3時間 | Trijam。毎週末に開催され、3時間で作るのが目標。時間を超えた提出も受け付けるが、1位の対象は3時間以内の作品（[Trijam #388](https://itch.io/jam/trijam-388)） |
| 48時間 | Micro Jam（[Micro Jam 064](https://itch.io/jam/micro-jam-064)）。[Global Game Jam](https://globalgamejam.org/) は48時間で作る世界最大のイベントで、2027年は1月25〜31日の週に開催される（[About](https://globalgamejam.org/about)） |
| 72時間 | Mini Jam（[Mini Jam 219](https://itch.io/jam/mini-jam-219-nocturne)）、AI 専用の Ultimate AI-Powered Game Jam（[#3](https://itch.io/jam/ultimate-ai-powered-game-jam-3)）、All Tools Allowed（[#2](https://itch.io/jam/all-tools-allowed-2)） |
| 1週間 | Unity 1週間ゲームジャム。日曜20時にお題が出て、翌週の日曜20時までに投稿する（[unityroom](https://unityroom.com/unity1weeks)） |
| 2〜3週間 | AI Browser Game Jam 4（2026年8月1〜18日、126本）（[itch.io](https://itch.io/jam/ai-jam-4)） |
| 1か月 | [Vibe Jam](https://vibej.am/) 2026（2026年4月1日〜5月1日 13:37 UTC）（[公式](https://vibejam.com/)） |

### テーマと審査

- お題は、開始時に発表されるのが一般的です。AI Browser Game Jam 4 のように「テーマは提案で、無視してもよい」ものもあれば、Mini Jam のように、テーマとは別に必ず満たす「制限」を出すものもあります
- 審査は、参加者どうしの相互評価が中心です。Unity 1週間ゲームジャムは、投稿後の1週間が相互評価の期間で、結果はランキングではなく、評価の高かった作品のまとめとして掲載されます（[unityroom](https://unityroom.com/)）
- Vibe Jam 2026 は審査員が選ぶ方式で、賞金は金・銀・銅と、12の特別賞です（[公式](https://vibejam.com/)）
- Global Game Jam は競争ではなく、参加そのものが目的のイベントです（[About](https://globalgamejam.org/about)）

### AI利用のルール

AIへの姿勢は、イベントによって正反対です。

| 分類 | 内容 | 例（2026年9月時点） |
|---|---|---|
| AIが前提 | コードの90%以上をAIが書く | Vibe Jam 2026（[公式](https://vibejam.com/)） |
| AIが前提 | 開発が強くAIに支援され、ゲームの大半がAI生成であること | AI Browser Game Jam 4（[itch.io](https://itch.io/jam/ai-jam-4)） |
| 全ツール可、開示が条件 | 使ったツールを提出ページに書く。書かなければ参加できない。一発のプロンプトだけの投稿は削除されうる | All Tools Allowed #2（[itch.io](https://itch.io/jam/all-tools-allowed-2)） |
| 制限なし | 著作権などの既存の規則に沿えば、生成AIも含めて制限しない | Global Game Jam（[AI Policy](https://globalgamejam.org/news/global-game-jam-artificial-intelligence-policy)） |
| 使えるが、審査から外れる項目がある | AIが大半を作った部門は、自分で審査対象から外す（90%が目安） | [Ludum Dare](https://ldjam.com/)（[FAQ](https://ludumdare.com/resources/questions/can-i-use-ai/)） |
| 一部の使用が失格 | 画像と音の生成AIは禁止で、失格になる | GMTK Game Jam 2026（[itch.io](https://itch.io/jam/gmtk-jam-2026)） |
| 賞金の対象外 | 生成AIを使った作品は賞金の対象外 | Trijam #388（[itch.io](https://itch.io/jam/trijam-388)） |
| 全面禁止 | コード、画像、音、文章、サムネイルまで生成AIを使えず、見つかれば失格 | Godot Wild Jam（[ポリシー](https://godotwildjam.com/news/godot-wild-jams-policy-on-generative-ai/)） |

同じ「ゲームジャム」でも、AIで作ったゲームを出してよいかどうかは、まるで違います。次の節の手順で、応募前に必ず読み取ります。

## 選び方

### 目的から選ぶ

| 目的 | 合うイベントの傾向 | 期間の目安 |
|---|---|---|
| まず完成させる経験がほしい | 参加者の多い、締め切りの短い定期開催のジャム。未完成でも投稿できるもの | 48時間〜1週間 |
| AIとエージェントの実験をしたい | AI利用が前提か、許可されているジャム。AI専用は、AIを使うこと自体が評価の前提を共有している | 72時間〜2週間 |
| 発信・実績にしたい | 参加者や審査員の注目度が高いコンテスト。ブラウザで遊べる形にして、URLを共有できること | 2週間〜1か月 |
| 賞金を狙う | 賞金のあるコンテスト。AI利用の条件と、賞金の対象条件を確認する | 開催ごとに異なる |
| フィードバックがほしい | 相互評価が活発なジャム。評価数が少ない場合は、順位より講評を見る | 1週間以上 |

規模の見方も重要です。AI Browser Game Jam 4 は126本の参加で、1作品あたりの評価数は平均8.2件、中央値7件でした（[結果ページ](https://itch.io/jam/ai-jam-4/results)、2026年9月時点）。Plug & Prosper は10件の評価で1位です。作者自身が、評価数が少ないので順位を普遍的な品質の尺度とは見ない、と書いています（[事例](/cases/browser-plug-prosper/)）。順位の意味は、参加数と評価数で変わります。

### 応募前に、AIの利用条件を読み取る手順

1. ジャムのページで「AI」「generative」「assets」「disqualif」をページ内検索して、該当の段落をすべて読む
2. 対象の範囲を切り分ける。コード、画像、音、文章のどれが対象か。ゲーム本体だけでなく、ゲームのページやサムネイルまで含むか（GMTK は [itch.io](https://itch.io/) のページも対象、Godot Wild Jam はサムネイルも対象）
3. 制限の種類を見分ける。失格、賞金の対象外、審査部門からの除外、開示の義務、割合の条件（[Vibe Jam](https://vibej.am/) のコード90%以上、[Ludum Dare](https://ldjam.com/) の90%）のどれか
4. 割合が条件なら、数える方法を決める。コミットの履歴、プロンプトの記録、使ったツールの一覧を残す。Capybara の作者は、ジャムの規約を `.claude/rules` に入れて、失格を避けたと書いている（[事例](/cases/browser-capybara/)）
5. 事前に作ってよいものの範囲を読む。Vibe Jam は2026年4月1日より前に存在したゲームは提出できない。GMTK は、ジャム専用の素材を事前に作ることを認めず、空のプロジェクトや itch.io のプロフィールは事前に用意してよい
6. 開示の書式を読む。itch.io は、生成AIの利用を、プロジェクトの編集ページの AI Disclosure で正確に付けるよう求めている（[品質ガイドライン](https://itch.io/docs/creators/quality-guidelines)）。All Tools Allowed は、提出ページへのツール名の記載を参加の条件にしている
7. 開始直前と、提出前にもう一度、ルールのページを読む。質問の回答は、コミュニティのタブやDiscordに載ることがある
8. あいまいな点は主催者に質問し、回答をスクリーンショットで保存する

## 準備

### スコープの決め方

期間で作れる範囲が決まります。手順の詳細は [スコープの決め方](/getting-started/scope/) にあります。ここでは、ジャム向けの目安を示します。

| 期間 | 狙う範囲 | 入れないもの |
|---|---|---|
| 3時間 | 1つの操作と、1つの勝ち負けだけ | メニュー、複数ステージ、セーブ |
| 48時間 | 1分で遊びの核が伝わるコアループ1つと、最小のタイトルと結果画面 | 複数モード、多言語 |
| 1週間 | コアループと、手触りの調整、数ステージまたは数分の内容 | 作り込みの広がり（新しいシステムの追加） |
| 2週間 | 5〜10分遊べる内容と、独自の要素1〜2点 | 遊びの核と関係のない機能 |
| 1か月 | 上に加えて、ツール作りと、内容の層 | 完成後に足せるもの |

Plug & Prosper の作者は、同じジャムの4本のうち、最も規模の小さい作品が1位になったことから、「スコープが小さい」を「範囲が完結している」と解釈し直しました（[事例](/cases/browser-plug-prosper/)）。狭くて閉じた範囲のほうが、最後まで磨けます。

### 技術の選び方

ジャムの多くは、URLを開いてすぐ遊べる形を求めます。AI Browser Game Jam 4 は、ダウンロード不要でブラウザで遊べることが参加の条件です。[Vibe Jam](https://vibej.am/) 2026 は、ログイン不要、無料、読み込み画面なしで、ほぼ即座にゲームに入れることを条件にしています。GMTK は、Windows PC で動くことを求めます。
エンジンと構成の選び方は [Webゲームの技術スタック](/agent-dev/web-game-stack/) にまとめています。Vibe Jam の公式は Three.js を勧めており、Capybara も Three.js 製です。

### 事前にやっておくこと

- ひな形のリポジトリを作る。ビルド、ローカルの確認、公開までを、空のゲームで通しておく（GMTK は、空のプロジェクトの事前作成を認めている）
- 公開の手順を、空のゲームで一度通す。公開先ごとの手順は [Webゲームの公開先](/publish/web-hosting/) と [itch.io に出す](/publish/itch-io/) にあります
- [itch.io](https://itch.io/) に出すなら、ZIP の最初に `index.html` を置き、相対パスで参照し、ファイル名の大文字と小文字をそろえる。大文字と小文字は、自分のPCでは動いても、公開後に読み込めなくなる原因になる（[HTML5 games](https://itch.io/docs/creators/html5)、2026年9月時点）
- エージェントの指示ファイルに、ジャムのルール、締め切り、作らないものを書く
- 使うツールとモデル、プロンプトの記録の置き場所を決める。AI利用の開示と、AIの割合の説明に使える

### 期間中の時間配分の例

次の表は、事例と、公開の手順の落とし穴から組んだ目安です。最後に、提出の準備と予備の時間を必ず取ります。

| 期間 | 決める・ポン出し | 遊びの核を作る | 手触りを詰める | 提出の準備・予備 |
|---|---|---|---|---|
| 3時間 | 20分 | 100分 | 30分 | 30分 |
| 48時間 | 4時間 | 16時間 | 16時間 | 12時間 |
| 1週間 | 1日 | 3日 | 2日 | 1日 |
| 2週間 | 2日 | 5日 | 5日 | 2日 |

2週間の実例が Capybara です。1週目は主人公の操作、荷物の物理、スマホUI、天候、マップエディタ、マルチプレイなど、遊びの骨格。2週目は見た目の統一、質感の貼り替え、マップの作り込み、7言語対応、提出用のサムネイルでした（[事例](/cases/browser-capybara/)）。サムネイルまで含めて、2週目の作業として組み込まれています。

## 出品のチェックリスト

- [ ] URLを開いて、すぐ遊べる。ログインや登録がない
- [ ] 初回の起動と読み込みが速い。読み込み画面が長くない（[Vibe Jam](https://vibej.am/) 2026 は読み込み画面と重いダウンロードを避けるよう求めている）
- [ ] シークレットウィンドウと、キャッシュなしの状態で開く
- [ ] スマホとPCの両方で表示と操作を試す。片方しか対応しないなら、ページにそう書く
- [ ] 音が出る。ブラウザは、ユーザーの操作の前の音の再生を止める。Web Audio API の AudioContext は、操作の前に作ると suspended になり、クリックなどのあとに `resume()` を呼ぶ（[Chrome の自動再生ポリシー](https://developer.chrome.com/blog/autoplay)、[MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)、2026年9月時点）。タイトル画面の「はじめる」ボタンで音を始めるのが確実
- [ ] [itch.io](https://itch.io/) に出すなら、埋め込みの設定を選ぶ。Click to play をオフにして自動で始めると、ブラウザによって音が消される
- [ ] 操作の説明が、ゲーム内かページの最初にある
- [ ] スクリーンショット、GIF、説明文がある。動画の作り方は [ショート動画](/trailer/social-shorts/) を参照
- [ ] 素材とライブラリのライセンスと、クレジットを書く（[ライセンス](/legal/licenses/)）。AI Browser Game Jam 4 は、サードパーティの素材とツールのクレジットを求めている。[Global Game Jam](https://globalgamejam.org/) は、提出したゲームのデータを CC BY-NC-SA 4.0 で共有する前提のイベント（[AI Policy](https://globalgamejam.org/news/global-game-jam-artificial-intelligence-policy)）
- [ ] AI利用の開示を、規約どおりに書く。どのツールを何に使ったかを、コード、画像、音、文章に分けて書く
- [ ] 提出フォームの必須項目を埋める。Vibe Jam 2026 は、公式のウィジェットのスクリプトがない作品を失格にするとしている
- [ ] 締め切りの時刻とタイムゾーンを確認する。Vibe Jam 2026 は 2026年5月1日の 13:37 UTC。日本時間では 22:37。Unity 1週間ゲームジャムは日曜20時
- [ ] 投稿後に直せる期限を確認する。GMTK は、ジャムの終了後の5日間の評価期間中は、アップロードが固定され、修正版を出せない。All Tools Allowed も、締め切りで uploads lock と書く。一方、Vibe Jam 2026 は、提出後も締め切りまで作業を続けられる
- [ ] 自分の別のビルドへの誘導を、ページに書かない。GMTK は、別のビルドへのリンクを載せると失格にする

## 審査で見られること

### 事例に見る評価

- **[Vibe Jam](https://vibej.am/) 2026**: 審査員の一人、Tim Soret 氏は「質が昨年よりずっと高く、本物のゲームに近づいているものもある」と評しました（[levelsio のブログ](https://levels.io/vibe-jam-2026-winners-quality)、2026年6月17日）。賞は、金・銀・銅のほかに、Most Original、Best Art Direction、Most Played などの特別賞があります。公式のルールには、採点の観点の記載はありません（[公式](https://vibejam.com/)、2026年9月時点）。Capybara は、手触りを人が決め、マップを手で作り込み、小ネタを積んだ作品です（[事例](/cases/browser-capybara/)）
- **AI Browser Game Jam 4**: 部門は Overall、Fun、Graphics、Audio、Theme、AI Usage の6つです。Plug & Prosper は Overall 4.1、Fun 3.6（11位）、Theme 4.9、Audio 4.6、Graphics 4.5、AI Usage 4.4 で、Fun 以外の部門は1位でした（[結果ページ](https://itch.io/jam/ai-jam-4/results)）

### 「楽しさ」と総合は別物

Plug & Prosper は、総合で1位、「楽しさ」は11位でした。作者の他の3作品は、総合で22位、39位、79位でした。順位は、遊びの手触り以外の、テーマ、見た目、音、完成度の評価にも支えられます。
一方、Capybara の作者は、自分が楽しいと感じたコンビニの場面が、審査員には動きにくいと評価されたと書いています（[事例](/cases/browser-capybara/)）。作った人の「楽しい」は、プレイヤーの「楽しい」と一致するとは限りません。

### 範囲を絞ることの効果

Plug & Prosper は、4本のうち最も規模が小さく、1位になりました。事前のDiscordのアンケートで最も注目された Charge Grid は39位でした。範囲を絞るほど、審査員と参加者が触る部分を仕上げやすくなります（[事例集の共通点](/cases/lessons/)）。

### 主催が示す観点に合わせる

観点が公開されている場合は、その言葉どおりに準備します。All Tools Allowed #2 の観点は、没入感、プレイヤー体験、まとまりと作り込み、テーマの4つです。Mini Jam 219 は、楽しさ、コンセプト、見せ方、制限の使い方の4つでした。Micro Jam 064 は、テーマの使い方が投票の対象だと書いています。

## 出したあと

- **フィードバックの受け止め方**: コメントは、事実（起きたこと）と、好み（こうしてほしい）に分けます。事実の指摘は、修正の対象です。Plug & Prosper は、結果画面の表示の不具合と、説明文の食い違いの指摘に、修正版で応えました（[事例](/cases/browser-plug-prosper/)）。評価が少ないときは、順位より、コメントの中身を読みます
- **更新して公開を続ける**: Plug & Prosper は、ジャムの後も更新を続け、日ごとに進むモード、アップグレード、客の図鑑を加えました。[itch.io](https://itch.io/) はプレイ、配布、更新をまとめて扱えます（[itch.io に出す](/publish/itch-io/)）
- **ブラウザから別の形へ**: ブラウザのゲームをアプリにする方法は [Webゲームをアプリにする](/publish/web-to-app/) にあります
- **[Steam](https://store.steampowered.com/) への発展**: 内容の厚さが足りなければ、出さない判断もあります。Capybara の作者は、遊べる時間が5〜10分で、進行の実感と数時間分の内容がないため、Steam では売らないと述べています。発展させるなら、[ストアの選び方](/monetization/platforms/) と [ウィッシュリスト](/monetization/wishlists/) を見ます
- **次のイベントを探す**: [イベントカレンダー](/publish/events-calendar/) と、[itch.io のジャム一覧](https://itch.io/jams) を使います。itch.io は、関係のないジャムに、宣伝の目的だけで作品を提出することを、スパムとして扱い、提出の権限を止める場合があります（[品質ガイドライン](https://itch.io/docs/creators/quality-guidelines)、2026年9月時点）。テーマに合う作品を出します

## コーディングエージェントでジャムに出すコツ

事例から読み取れる要点です。詳しい方法は、それぞれの記事にあります。

| コツ | 根拠になった事例 | 詳しい記事 |
|---|---|---|
| 最初のポン出しは、動くものを得るだけ。手触りは遊んで詰める | Grumbulus は、概念の一言で遊べる最初の版を得て、2日間のプレイテストで育てた。Capybara の作者は、コードを書かせる時間より、考える・計画する・遊ぶ時間のほうが長かったと書いている | [ポン出しの使い方](/agent-dev/one-shot/)、[ポン出しから製品まで](/agent-dev/from-one-shot-to-product/) |
| 範囲を絞る | Plug & Prosper の作者は、頭に描けている範囲に収めるほど、エージェントに細かく指示できたと振り返る | [スコープの決め方](/getting-started/scope/) |
| 検証の仕組みを置く | 複数ファイルを並列に生成した Grumbulus は、最初のプレイの前に18件の結合バグを見つけて直した | [検証ループ](/agent-dev/verification-loop/) |
| 手触りは人が決める | Capybara の作者は、荷物の物理を、現実より面白さを優先する式に直した。調整用のスライダーも作らせた | [手触り](/agent-dev/game-feel/) |
| 独自の一点を決める | Capybara は手作りのマップと小ネタ、Plug & Prosper は物理で動くケーブルと5つの手作りレベル | [独自性の出し方](/agent-dev/differentiation/) |
| ルールを指示ファイルに入れる | Capybara の作者は、ジャムの規約を最初にルールに入れた | [全体像](/agent-dev/overview/) |
| 遊ぶ前に落とし穴を見る | 公開して初めて出る不具合は多い | [失敗パターン](/agent-dev/failure-patterns/)、[プレイテスト](/design/playtesting/) |

提出の前日に、次のようなプロンプトで最終確認を頼めます。

```text
提出前の点検をしてください。
- 公開URLをシークレットウィンドウ相当の状態で開き、初回の読み込み時間と、コンソールのエラーを報告する
- 390px幅と1280px幅でスクリーンショットを撮り、はみ出しや操作できない部分を挙げる
- 音は、最初のクリックのあとに鳴ることを確かめる
- README と提出ページの説明文が、現在の操作と機能に合っているか、食い違いを一覧にする
- 使った依存ライブラリと素材のライセンスの一覧を出す
直すのは、私が承認したものだけです。
```

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Cursor Vibe Jam 2026](https://vibejam.com/) — 規約（コード90%以上をAIが書く、読み込み画面なし、ウィジェット、締め切りの時刻）と賞金
- [Vibe Jam 2026 winners（levelsio）](https://levels.io/vibe-jam-2026-winners-quality) — 受賞作と審査員のコメント
- [AI Browser Game Jam 4（itch.io）](https://itch.io/jam/ai-jam-4) — ルール、参加数、審査の部門
- [AI Browser Game Jam 4 の結果](https://itch.io/jam/ai-jam-4/results) — 評価数、部門別の順位
- [All Tools Allowed #2（itch.io）](https://itch.io/jam/all-tools-allowed-2) — AI利用の開示が条件のジャム、審査の観点
- [GMTK Game Jam 2026（itch.io）](https://itch.io/jam/gmtk-jam-2026) — 画像と音の生成AIの禁止、評価期間のアップロード固定
- [Trijam #388（itch.io）](https://itch.io/jam/trijam-388) — 3時間ジャム、AI利用作品は賞金の対象外
- [Mini Jam 219（itch.io）](https://itch.io/jam/mini-jam-219-nocturne) — 72時間、審査の4項目
- [Micro Jam 064（itch.io）](https://itch.io/jam/micro-jam-064) — 48時間、遅れて提出できる時間
- [Global Game Jam の AI ポリシー](https://globalgamejam.org/news/global-game-jam-artificial-intelligence-policy) — 生成AIを制限しない方針
- [Global Game Jam について](https://globalgamejam.org/about) — 48時間、競争ではないこと、2027年の日程
- [Ludum Dare: Can I use AI?](https://ludumdare.com/resources/questions/can-i-use-ai/) — AIの利用と、審査部門からの除外
- [Godot Wild Jam のAIポリシー](https://godotwildjam.com/news/godot-wild-jams-policy-on-generative-ai/) — 生成AIの全面禁止
- [Unity 1週間ゲームジャム（unityroom）](https://unityroom.com/unity1weeks) — 1週間、相互評価
- [itch.io: Uploading HTML5 games](https://itch.io/docs/creators/html5) — 公開の形式、落とし穴、Click to play
- [itch.io: Content creator quality guidelines](https://itch.io/docs/creators/quality-guidelines) — AI Disclosure、ジャムへの提出の規則
- [itch.io ゲームジャム一覧](https://itch.io/jams) — 開催中のジャム
- [Chrome: Autoplay policy](https://developer.chrome.com/blog/autoplay) — AudioContext の自動再生の制限
- [MDN: Autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) — 自動再生が許される条件
