---
title: SNS向けショート動画
description: X、TikTok、YouTube Shorts、Instagram Reels向けの縦型動画の作り方、開発ログ（devlog）の発信方法、#screenshotsaturday などのハッシュタグの使い方をまとめます。
sidebar:
  order: 5
lastUpdated: 2026-09-29
---

## 概要

ショート動画は、ゲームをまだ知らない人に見つけてもらうための入口です。ストアページのトレーラーとは目的も見られ方も違います。

この記事では次のことが分かります。

- 主なSNSの動画仕様の違い（2026年9月時点）
- 縦型動画の作り方と、最初の1秒の考え方
- 開発ログ（devlog）の発信と、ハッシュタグの使い方
- SNSにどこまで時間をかけるべきか

## トレーラーとの違い

| 項目 | Steamトレーラー | ショート動画 |
|---|---|---|
| 視聴者 | ストアページに来た、ある程度興味のある人 | タイムラインを流し見している、ゲームを知らない人 |
| 判断の速さ | 10秒程度（[Steamworks](https://partner.steamgames.com/doc/store/trailer)） | 1秒程度でスワイプされる |
| 画面の向き | 横（16:9） | 縦（9:16）が中心 |
| 目的 | ウィッシュリスト登録・購入 | フォロー、ストアページへの誘導 |

## 各SNSの動画仕様

| サービス | 長さの上限 | 補足 |
|---|---|---|
| YouTube Shorts | 3分 | 正方形または縦長で3分以内の動画がShortsとして扱われる（[YouTube ヘルプ](https://support.google.com/youtube/answer/15424877)） |
| TikTok | アプリ内撮影は10分、アップロードは60分 | 先に音源を選ぶと、動画の長さは音源の長さで決まる（[TikTok サポート](https://support.tiktok.com/en/using-tiktok/creating-videos/camera-tools)） |
| Instagram Reels | 20分 | 3分を超えるリールは、フォロワー以外へのおすすめに表示されない（[Instagram ヘルプ](https://help.instagram.com/2720958398006062)） |
| X | 140秒（Premium以外） | Premium加入者はより長い動画を投稿できる（[X ヘルプ](https://help.x.com/en/using-x/premium-longer-videos)） |

上限はあくまで上限です。新しい人に見てもらうことが目的なら、どのサービスでも短くまとめるのが基本です。

## 縦型動画の作り方

### 撮影

横長の録画を中央で切り抜くと、画面の端にある情報が失われます。可能なら **縦長の解像度（1080×1920）で直接録画** できるようにしておきます。キャプチャ用ビルドに解像度プリセットを入れておく方法は [画面キャプチャと編集ツール](/trailer/capture-and-editing/) を参照してください。

縦画面に向くゲームと向かないゲームがあります。

- 向いている: パズル、カードゲーム、モバイル向け、キャラクターが画面中央にいるゲーム
- 工夫が必要: 横スクロール、ストラテジーなど横に広い画面のゲーム。カメラを寄せる、上下に分割して「プレイ画面」と「説明の文字」を並べる、などの工夫をします

### 画面の配置

ショート動画のアプリでは、画面の下部や右端にキャプション、ボタン、アカウント名が重なります。**重要な映像や文字は画面の中央付近に置く** ようにしましょう。投稿前に、実際のアプリで下書き表示して確認すると確実です。

### 最初の1秒と構成

How To Market A GameのChris Zukowski氏が紹介した、TikTokで成果を出した開発者のコツは次のとおりです（[Seven great tips for marketing your indie game on Tiktok](https://howtomarketagame.com/2022/02/07/seven-great-tips-for-marketing-your-indie-game-on-tiktok/)、2022年）。

- スワイプされるまでの **約1秒** でつかむ
- 前提知識がなくても分かる内容にする（視聴者はあなたもゲームも知らない）
- 短くし、最後から最初へ自然につながる **ループ** にする
- 「フォローして」「プロフィールのリンクから」などの呼びかけを、少なくとも3秒は見える形で入れる
- 作り込みすぎず、手作り感のある雰囲気を大切にする

冒頭の例としては、「一番気持ちいい瞬間から始める」「『これ、クリアできる？』のような問いかけ」「ありえない状況（大量の敵、巨大化など）を最初に見せる」などがあります。

## 開発ログ（devlog）の発信

devlogは、開発の過程を見せる投稿です。完成前のゲームでも発信でき、制作者の人柄も伝わります。

| ネタの例 | 内容 |
|---|---|
| ビフォー／アフター | 仮素材から完成版への変化、エフェクトの追加前後 |
| 新機能 | 実装したばかりの仕組みを短く見せる |
| 面白いバグ | 物理演算の暴走など。見て楽しいものが多い |
| 制作の裏側 | エディタの画面、AIツールを使った作業の様子 |
| 質問 | 「AとBどちらのデザインがいい？」のような投票 |

AIツールを使った制作過程は、それ自体が話題になりやすい一方で、受け止め方は人によって分かれます。どのように使っているかを正直に伝えるのが無難です。

:::caution
AIで生成した本物らしい映像や音声を投稿する場合、YouTubeやTikTokでは開示やラベル付けが求められることがあります。詳しくは [AI動画生成の使いどころ](/trailer/ai-video/) を参照してください。
:::

## ハッシュタグ

ゲーム開発者の間で定着しているハッシュタグがあります。

| ハッシュタグ | 使い方 |
|---|---|
| `#screenshotsaturday` | 毎週土曜日に開発中の画面やGIF・動画を投稿する習慣。X では [@ScreenshotSatRT](https://x.com/ScreenshotSatRT) などのアカウントが紹介している。Blueskyにも [Screenshot Saturday フィード](https://bsky.app/profile/trezy.codes/feed/screenshot-sat) がある |
| `#indiedev` / `#gamedev` | 個人開発・ゲーム開発全般 |
| `#indiegame` | 遊ぶ側にも届きやすい |
| `#madewithunity` / `#godotengine` など | 使用エンジンのコミュニティ |

ハッシュタグは関連するものを少数に絞るほうが、内容が伝わりやすくなります。開発者向けのタグは開発者仲間には届きますが、購入者層に届くとは限りません。遊ぶ側に届けたい投稿では、ジャンル名など遊ぶ人が使う言葉も入れましょう。

## SNSにどこまで時間をかけるか

SNSでの発信は必須ではありません。Chris Zukowski氏は、フォロワーがゼロでもゲームは売れるとし、SNS投稿よりも **フェスへの応募** や **配信者・YouTuberへの直接の連絡** に時間を使うよう勧めています。また、ヒット作の多くはヒットした後にフォロワーが増えたのであって、発売時点のフォロワーが多かったわけではない、とも指摘しています（[Can you market a game with zero following?](https://howtomarketagame.com/2025/07/15/can-you-market-a-game-with-zero-following/)、2025年）。

現実的な進め方は次のとおりです。

1. 開発の合間に、録画した素材から短い動画を作る習慣をつける（1本に時間をかけすぎない）
2. 反応の良かった動画の傾向をメモし、トレーラーの冒頭にも活かす
3. 反応が続かない形式はすぐにやめる
4. 最終的な目標（ウィッシュリスト）につながっているかを確認する

ウィッシュリストの集め方全体は [ウィッシュリストの集め方](/monetization/wishlists/) を参照してください。

## AIの活用ポイント

- **切り抜き候補の洗い出し**: 長い録画から見どころを探すのは手間がかかります。プレイログ（イベントの発生時刻）を残しておき、LLMに「派手なイベントが集中している時間帯」を抽出させると、素材探しが速くなります。
- **キャプション・ハッシュタグ案**: 投稿文の下書きや多言語化に使えます。
- **週次の振り返り**: 各投稿の再生数やフォロー数をまとめて渡し、傾向を分析させます。
- **投稿文は一言足す**: 完全に自動生成すると、似た文面の繰り返しになりがちです。自分の言葉で一言足すだけでも印象が変わります。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [YouTube Shorts の長さの変更（YouTube ヘルプ）](https://support.google.com/youtube/answer/15424877) — 3分までのShorts
- [TikTok サポート: カメラツール](https://support.tiktok.com/en/using-tiktok/creating-videos/camera-tools) — 撮影・アップロードできる動画の長さ
- [Record a reel on Instagram（Instagram ヘルプ）](https://help.instagram.com/2720958398006062) — リールの長さとおすすめ表示の条件
- [About longer videos for X Premium subscribers（X ヘルプ）](https://help.x.com/en/using-x/premium-longer-videos) — Xの動画の長さ
- [Seven great tips for marketing your indie game on Tiktok](https://howtomarketagame.com/2022/02/07/seven-great-tips-for-marketing-your-indie-game-on-tiktok/) — ショート動画のコツ
- [Can you market a game with zero following?](https://howtomarketagame.com/2025/07/15/can-you-market-a-game-with-zero-following/) — SNSに頼らないマーケティング
- [Screenshot Saturday フィード（Bluesky）](https://bsky.app/profile/trezy.codes/feed/screenshot-sat) — #screenshotsaturday の投稿をまとめたフィード
