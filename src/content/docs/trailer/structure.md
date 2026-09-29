---
title: PVの構成
description: ゲームのPV（トレーラー）で最初の数秒に何を見せるか、ゲームプレイ主体の組み立て方、長さの目安、よくある失敗をまとめます。
sidebar:
  order: 1
lastUpdated: 2026-09-29
---

## 概要

PV（プロモーションビデオ。ゲーム業界では「トレーラー」と呼ぶことが多い）は、ストアページやSNSで「このゲームは自分向きか」を判断してもらうための動画です。

この記事では、次のことが分かります。

- 最初の数秒で何を見せるべきか
- ゲームプレイを中心にした構成の作り方（初心者向けのテンプレート2つ）
- 長さの目安と、よくある失敗

撮影や編集の具体的な手順は [画面キャプチャと編集ツール](/trailer/capture-and-editing/)、Steam固有の仕様は [Steamトレーラーの要件](/trailer/steam-trailer/) を参照してください。

## トレーラーの種類

まず「どの場面で流す動画か」を決めます。Steamはトレーラーを次の4カテゴリに分けています（[Steamworks: トレーラー](https://partner.steamgames.com/doc/store/trailer)、2026年9月時点）。

| 種類 | 中身 | 主な用途 |
|---|---|---|
| ティーザー | ゲームプレイをあまり見せない短い告知 | 発表直後、SNS |
| ゲームプレイ | プレイヤー視点のゲームプレイが中心 | **Steamストアページの先頭** |
| 一般／シネマティック | プリレンダー映像、ロゴ、受賞歴などを含み、ゲームプレイは少なめ | イベント、発表会 |
| インタビュー／開発日記 | 開発者の解説などノンフィクション | devlog、コミュニティ向け |

個人開発で最初に作るべきなのは **ゲームプレイトレーラー** です。Steamworksのドキュメントも、ほとんどのユーザーはゲームプレイを見に来ているので、先頭にはゲームプレイ中心のトレーラーを置くよう勧めています。

## 最初の数秒で何を見せるか

### 10秒で判断される前提で作る

Steamworksのドキュメントは、ディスカバリーキュー（Steamがおすすめのゲームを1本ずつ見せる機能）を見ている人には「10秒もない」こと、また **音声なしで見ている** 可能性があることを指摘しています（[Steamworks: トレーラー](https://partner.steamgames.com/doc/store/trailer)）。

トレーラー編集者のDerek Lieu氏（『Half-Life: Alyx』『Among Us』などのトレーラーを担当）も、映画のように雰囲気を積み上げてから15〜30秒後にゲームプレイを見せる構成は、Steamでは視聴者が待ってくれないと指摘しています（[GameDiscoverCo](https://newsletter.gamediscover.co/p/game-trailers-breaking-down-a-key)、2022年）。

### 冒頭ショットの4つの型

Derek Lieu氏は冒頭ショットの作り方を4つに分類しています（[The First Shot of the Game Trailer](https://www.derek-lieu.com/blog/2022/8/1/the-first-shot-of-the-game-trailer)）。

| 型 | 内容 | 向いているゲーム |
|---|---|---|
| 基本ループのワンカット | 基本的な遊び（コアループ＝繰り返し行う中心の遊び）をカットを割らずに1本で見せる | アクション、パズル、ローグライク |
| 世界観のある風景 | 印象的な背景から入る | 探索、雰囲気重視 |
| ゲームプレイの詰め合わせ | 見どころの短いカットを連続で見せる | 要素が多いゲーム |
| 印象的なセリフ | 会話から入る | ノベル、ADV |

風景から入る型には注意が必要です。同氏は、軍事基地の風景だけではFPSなのかストラテジーなのかジャンルが分からない、と例を挙げています。風景から入る場合も、早めにプレイヤーの操作を見せましょう。

:::tip
迷ったら「基本ループのワンカット」から始めるのが無難です。冒頭の1ショットを「このゲームの良いスクリーンショット」として成立させるつもりで選びます。
:::

## ゲームプレイ主体の構成

### テンプレート1: 最小構成のSteamトレーラー

Derek Lieu氏が、フォロワーのいない初めての個人開発者向けに勧めている最小構成です（[The Simplest Trailer to Make For Your Steam Page](https://www.derek-lieu.com/blog/2021/4/18/the-simplest-trailer-to-make-for-your-steam-page)）。同氏はこれを「ちょっと豪華なアニメGIF」と表現しています。

1. ロゴやシネマティックは入れず、いきなりゲームループから始める
2. ステージ、敵、仕組みなどのバリエーションを見せる
3. 1ショットは3〜5秒程度とやや長めにする（シークバーで飛ばされても内容が伝わるように）
4. 「コンテンツ量」を見せるカットは中盤以降に置く
5. 同じ要素を3回以上繰り返さない

### テンプレート2: Tell, Show, Repeat

タイトルカード（文字だけの画面）で説明してから、その内容を映像で見せる構成です（[Tell, Show, Repeat](https://www.derek-lieu.com/blog/2023/4/9/tell-show-repeat-the-2nd-easiest-game-trailer-to-make)）。

1. ジャンルが分かるゲームプレイで始める
2. タイトルカードで特徴を1つ書く
3. その特徴を示すゲームプレイを見せる
4. 2〜3を繰り返す
5. 盛り上がる場面のモンタージュで締める

タイトルカードは、最初は「ボールを投げて敵を倒せ」のような **遊びの説明** で十分です。慣れてきたら「過去と向き合え」のような **キャラクターの目的** を書くと、ありきたりな印象を避けやすくなります。

### 締めくくり

最後にタイトルロゴ、対応プラットフォーム、発売時期、「ウィッシュリストに追加」などの呼びかけを入れた画面（エンドスレート）を置くのが一般的です。ウィッシュリストについては [ウィッシュリストの集め方](/monetization/wishlists/) を参照してください。

### HUDは見せるべきか

HUD（体力ゲージなど画面上の情報表示）については、見解が2つあります。

- Steamworksは、HUDが入っていると遊び方が伝わりやすく有益なことが多いとしています。
- Derek Lieu氏は、情報過多を避けるためにHUDやUIの不要な要素を減らすよう勧めています（[10 Common Indie Game Trailer Mistakes](https://www.derek-lieu.com/blog/2020/9/14/10-common-indie-game-trailer-mistakes-and-how-to-fix-them)）。

実用的には「遊びを理解するのに必要なHUDは残し、デバッグ表示や余計なウィンドウは消す」が落としどころです。HUDを出し分けられる [キャプチャ用ビルド](/trailer/capture-and-editing/) を用意しておくと両方に対応できます。

## 長さの目安

Derek Lieu氏は長さを次のように整理し、一般的なゲームトレーラーは **90秒以下** を勧めています（[Ideal Game Trailer Length and Labeling](https://www.derek-lieu.com/blog/2018/12/20/ideal-game-trailer-length-and-labeling)）。

| 長さ | 位置づけ |
|---|---|
| 0〜30秒 | ティーザー |
| 30〜90秒 | 標準的なトレーラー |
| 90〜180秒 | 映画的なトレーラー |
| 180秒以上 | 詳しい解説動画 |

一方で、前述の最小構成のSteamトレーラーについては、視聴者がシークバーで飛ばしながら見ることを前提に **90〜180秒** を勧めています。用途によって目安が違う点に注意してください。

同氏は、動画タイトルの付け方で視聴者が期待する長さが変わるとも述べています。「Trailer」なら短く、「Gameplay」「Devlog」なら長くても受け入れられやすくなります。

## よくある失敗

Derek Lieu氏の [10 Common Indie Game Trailer Mistakes](https://www.derek-lieu.com/blog/2020/9/14/10-common-indie-game-trailer-mistakes-and-how-to-fix-them) から、個人開発で特に起きやすいものをまとめます。

| 失敗 | 対策 |
|---|---|
| 無名のスタジオロゴから始める | ゲームプレイから始める |
| 導入が遅い | 冒頭の数ショット以内にゲームプレイを入れる |
| 同じ背景・敵が続く | 重複を削って短くする |
| ゲーム音がない | BGMなしで録画し、効果音で手触りを伝える |
| ゲーム内BGMをループで流すだけ | 起承転結のある曲を使う |
| 適当に遊んだ録画をつなぐ | 見せたい場面を決めて、練習してから撮る |
| 汎用的なタイトルカード（「50ステージ収録」など） | そのゲームだけの特徴を書く |
| 独自性が伝わらない | 一番の売り（フック）を早く大きく見せる |

仕上げには同氏の [品質チェックリスト](https://www.derek-lieu.com/blog/2022/7/11/quality-control-check-list-for-game-trailers) が役立ちます。誤字、マウスカーソルや録画ソフトのアイコンの映り込み、フレームレートの混在、一瞬だけ映る不要なコマ、文字がシークバーに隠れていないか、などを確認します。

## AIの活用ポイント

- **ショットリストの壁打ち**: ゲームの特徴を箇条書きでLLMに渡し、「Tell, Show, Repeat形式のタイトルカード案と、それぞれで見せるべき場面」を出させると、撮影計画の叩き台になります。
- **タイトルカードの推敲**: 汎用的な文言になっていないか、LLMに「どのゲームにも当てはまる表現」を指摘させます。
- **構成レビュー**: 編集後のショット一覧（秒数と内容）をテキストで渡し、冒頭10秒でジャンルが伝わるかを確認させます。

注意点として、AIは映像の手触りやテンポを実際には見ていません。最終判断は、ゲームを知らない人に実際に見てもらって行いましょう。また、AIで生成した映像をゲームプレイのように見せるのは避けてください。詳しくは [AI動画生成の使いどころ](/trailer/ai-video/) を参照してください。

## 最新情報

:::note[自動更新]
この欄は情報収集エージェントが毎週更新しています。
:::

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Trailers（Steamworks ドキュメント）](https://partner.steamgames.com/doc/store/trailer) — Steamのトレーラー仕様とベストプラクティス
- [How to Make a Trailer（Derek Lieu）](https://www.derek-lieu.com/start-here) — トレーラー制作の記事一覧
- [The First Shot of the Game Trailer](https://www.derek-lieu.com/blog/2022/8/1/the-first-shot-of-the-game-trailer) — 冒頭ショットの4つの型
- [The Simplest Trailer to Make For Your Steam Page](https://www.derek-lieu.com/blog/2021/4/18/the-simplest-trailer-to-make-for-your-steam-page) — 初心者向けの最小構成
- [Tell, Show, Repeat](https://www.derek-lieu.com/blog/2023/4/9/tell-show-repeat-the-2nd-easiest-game-trailer-to-make) — タイトルカードを使う構成
- [Ideal Game Trailer Length and Labeling](https://www.derek-lieu.com/blog/2018/12/20/ideal-game-trailer-length-and-labeling) — 長さと動画タイトルの付け方
- [10 Common Indie Game Trailer Mistakes](https://www.derek-lieu.com/blog/2020/9/14/10-common-indie-game-trailer-mistakes-and-how-to-fix-them) — よくある失敗と対策
- [Quality Control Check List for Game Trailers](https://www.derek-lieu.com/blog/2022/7/11/quality-control-check-list-for-game-trailers) — 仕上げのチェックリスト
- [Game trailers: breaking down a key discovery mistake（GameDiscoverCo）](https://newsletter.gamediscover.co/p/game-trailers-breaking-down-a-key) — ゲームプレイを先に見せるべき理由
