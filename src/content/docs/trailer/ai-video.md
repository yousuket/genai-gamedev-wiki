---
title: AI動画生成の使いどころ
description: 動画生成AI・音楽生成AI・音声合成をPV制作にどう使うか、ゲーム内容と異なる映像で誤解を招かないための注意点をまとめます。
sidebar:
  order: 3
lastUpdated: 2026-09-29
---

## 概要

動画生成AIを使うと、短いクリップなら数分で作れます。しかしゲームのPVは「実際に遊べるもの」を伝える動画です。AI生成映像の使い方を誤ると、購入者の誤解やストア規約違反につながります。

この記事では次のことが分かります。

- 主な動画生成AI・音楽生成AI・音声合成の現状（2026年9月時点）
- PV制作での適切な使い方と、避けるべき使い方
- ストアやSNSのルールで確認すべき点

## 大原則: PVはゲームそのものを見せる

各プラットフォームは、ストアの素材が実際のゲームと一致していることを求めています。

- **Steam**: 配布契約（Steam Distribution Agreement）で、開発者は「ゲームがマーケティング素材と一致している」ことをValveに約束します（[Steamworks: コンテンツサーベイ](https://partner.steamgames.com/doc/gettingstarted/contentsurvey)）。また、スクリーンショットはゲームプレイだけを示すものとされ、コンセプトアートやプリレンダーの静止画は避けるよう求められています（[Steamworks: ストアのグラフィカルアセット](https://partner.steamgames.com/doc/store/assets/standard)）。
- **App Store**: App Storeの審査ガイドライン2.3.4は、App Previews（ストアのプレビュー動画）には **アプリ自体の画面収録のみ** を使うよう定めています。ナレーションや文字のオーバーレイを加えることは認められています（[App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)、2026年9月時点）。

つまり、ゲームに存在しない場面・画質・演出をAIで作り、ゲームプレイのように見せることは避けるべきです。プラットフォームごとのAIポリシーは [プラットフォームのAIポリシー](/legal/platform-policies/) を参照してください。

:::caution
Steamのコンテンツサーベイでは、AIで作成したコンテンツのうち「ゲームに同梱され、プレイヤーが消費するもの」を開示の対象としています。トレーラーなどのストア素材そのものが開示対象かは、公式ドキュメントでは明示されていません（2026年9月時点）。迷う場合は、ストアページの説明で使い方を正直に書いておくのが安全です。
:::

## 主な生成AIツール（2026年9月時点）

### 動画生成

| サービス | 最新モデル | 特徴 |
|---|---|---|
| Google [Veo](https://deepmind.google/models/veo/) | Veo 3.1 | 映像と音声を同時に生成。生成した動画にはSynthID（AI生成を識別する電子透かし）が入る。Gemini APIでは新しい [Gemini Omni Flash](https://ai.google.dev/gemini-api/docs/video) が既定の推奨モデルになっている |
| [Kling AI](https://kling.ai/) | Kling 3.0（2026年2月発表） | 最大15秒の生成、多言語の音声生成、マルチショットの絵コンテ機能（[発表資料](https://www.prnewswire.com/news-releases/kling-ai-launches-3-0-model-ushering-in-an-era-where-everyone-can-be-a-director-302679944.html)） |
| [Runway](https://runway.com/) | Gen-4.5（2025年12月発表） | 物理表現やカメラワークの指示に強い。公式に、原因と結果の順序が崩れる、物体が消える・現れるといった限界が挙げられている（[発表記事](https://runway.com/research/introducing-runway-gen-4.5)） |

:::note[Soraの提供終了]
OpenAIのSoraは、Web版・アプリが2026年4月26日に、APIが2026年9月24日に提供を終了しました（[OpenAI Help Center](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation)）。サービスが突然終わることもあるので、特定のツールに依存しすぎない制作手順にしておきましょう。
:::

### 音楽・音声生成

| サービス | 用途 | 注意点 |
|---|---|---|
| [Suno](https://suno.com/) | 歌・BGMの生成 | 2026年9月9日にv6を公開（[公式ブログ](https://suno.com/blog/introducing-v6)）。Warner Music Groupなどと提携して開発されたと説明されている。商用利用の条件はプランによって異なるので規約を確認する |
| [ElevenLabs Music](https://elevenlabs.io/music) | BGMの生成 | 規約（2026年5月26日更新）では、セルフサーブ（Free〜Business）プランは「Studio Games」での利用が除外されている。Studio Gamesは「販売や広告などで収益化され、複数のプラットフォームで提供されるゲーム」と定義されている（[Eleven Music Model-Specific Terms](https://elevenlabs.io/eleven-music-model-specific-terms)） |
| [ElevenLabs](https://elevenlabs.io/) | ナレーション・音声合成 | 生成物の公開・商用利用の条件はプランごとに異なる |
| [VOICEVOX](https://voicevox.hiroshiba.jp/) | 日本語の音声合成（無料） | 商用利用可だが、VOICEVOXを使ったと分かるクレジット表記が必要。さらに音声ライブラリ（キャラクター）ごとの規約にも従う（[利用規約](https://voicevox.hiroshiba.jp/term/)） |

ElevenLabs Musicの例のように、「商用利用可」でもゲーム用途が別扱いになっていることがあります。PVでの利用がどの区分に当たるか分からない場合は、規約本文を確認し、必要なら提供元に問い合わせてください。詳しくは [AIツールの商用利用条件](/legal/tool-terms/) を参照してください。

## 適切な使い方

ゲーム映像そのものではなく、**制作の補助** や **明らかにゲームプレイではない部分** に使うのが基本です。

| 使い方 | 内容 |
|---|---|
| 絵コンテ・Vコンテ | 撮影前に、構成やカメラワークのイメージを短い動画で確認する。完成品には使わない |
| 仮の音楽 | 編集のテンポを決めるための仮BGM。本番の曲は利用条件を確認してから差し替える |
| ナレーション | 開発日記（devlog）や解説動画の読み上げ。音声合成であることを明示すると誤解を避けやすい |
| 字幕・翻訳 | 多言語版トレーラーの字幕の下訳 |
| 背景素材 | タイトルカードやエンドスレート（最後の告知画面）の抽象的な背景。ゲーム画面と混同されないものに限る |

## 避けるべき使い方

| 使い方 | 問題 |
|---|---|
| AI生成の映像をゲームプレイとして見せる | 実際のゲームと異なり、購入者を誤解させる。Steamの配布契約やApp Storeのガイドラインに反するおそれがある |
| 実際より高画質・派手な演出に見せる | 「トレーラーと違う」という低評価や返金の原因になる |
| 実在の人物・既存作品に似せた映像や声 | 肖像権・著作権の問題になりうる |
| 利用条件を確認していない音楽 | 商用利用やゲーム用途が制限されている場合がある |

:::tip
AI生成のシネマティック映像をどうしても使いたい場合は、Steamでは「一般／シネマティック」カテゴリのトレーラーとして分け、先頭にはゲームプレイのトレーラーを置きます（[Steamworks: トレーラー](https://partner.steamgames.com/doc/store/trailer)）。映像内に「イメージ映像」などと明記すると、さらに誤解を減らせます。
:::

## SNSでのAIラベル

SNSに投稿する場合も、AI生成コンテンツの表示ルールがあります。

- **YouTube**: 本物と見間違うようなAI生成・改変コンテンツは、アップロード時に開示が必要です。現実的でないアニメ調のコンテンツや、軽微な修正は対象外とされています（[YouTube ヘルプ](https://support.google.com/youtube/answer/14328491)）。
- **TikTok**: 本物らしい画像・音声・映像を含むAI生成コンテンツにはラベルを付けるよう求めています（[TikTok Newsroom](https://newsroom.tiktok.com/en-us/new-labels-for-disclosing-ai-generated-content)）。

## AIの活用ポイント

- **使う前に「これはゲームに存在する映像か」を確認する**: 迷ったら使わない、が安全です。
- **規約は用途単位で読む**: 「商用利用可」だけでなく、ゲーム、広告、配信など用途ごとの条件を確認します。
- **生成の記録を残す**: 使ったツール、プラン、日付、プロンプトを記録しておくと、後で規約やストアの申告を確認するときに役立ちます。
- **サービス終了に備える**: Soraの例のように提供が終わることがあります。生成物はダウンロードして手元に保管しておきましょう。

## 最新情報

:::note[自動更新]
この欄は情報収集エージェントが毎週更新しています。
:::

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Content Survey（Steamworks ドキュメント）](https://partner.steamgames.com/doc/gettingstarted/contentsurvey) — AI生成コンテンツの開示とマーケティング素材との一致
- [Store Graphical Assets（Steamworks ドキュメント）](https://partner.steamgames.com/doc/store/assets/standard) — スクリーンショットのルール
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) — 2.3.4 プレビュー動画のルール
- [Veo（Google DeepMind）](https://deepmind.google/models/veo/) — Veo 3.1の概要
- [Video generation in the Gemini API](https://ai.google.dev/gemini-api/docs/video) — APIで使える動画生成モデル
- [Kling AI 3.0 発表](https://www.prnewswire.com/news-releases/kling-ai-launches-3-0-model-ushering-in-an-era-where-everyone-can-be-a-director-302679944.html) — Kling 3.0の機能
- [Introducing Runway Gen-4.5](https://runway.com/research/introducing-runway-gen-4.5) — Gen-4.5の機能と限界
- [What to know about the Sora discontinuation](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation) — Sora提供終了の案内
- [Introducing v6（Suno）](https://suno.com/blog/introducing-v6) — Suno v6の発表
- [Eleven Music Model-Specific Terms](https://elevenlabs.io/eleven-music-model-specific-terms) — 用途別の利用条件
- [VOICEVOX 利用規約](https://voicevox.hiroshiba.jp/term/) — クレジット表記の条件
- [Disclosing use of altered or synthetic content（YouTube）](https://support.google.com/youtube/answer/14328491) — AIコンテンツの開示
