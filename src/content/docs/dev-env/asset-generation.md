---
title: アセット生成
description: 2D画像・ピクセルアート・3Dモデル・音楽・効果音・ボイスを生成AIで作るための主要ツールと、品質（スタイル）を揃えるコツをまとめます。
sidebar:
  order: 3
lastUpdated: 2026-10-05
---

## 概要

アセットとは、ゲームで使う画像・3Dモデル・音楽・効果音・ボイスなどの素材のことです。
生成AIを使うと、絵や作曲の経験がなくても素材をそろえられます。一方で、ツールごとに絵柄や音の質感がばらつき、ゲーム全体がちぐはぐに見えやすくなります。
この記事では、分野ごとの主要ツールと、スタイルを統一する方法を紹介します。
**商用利用の条件はツールやプランごとに大きく異なります。** 条件は [AIツールの商用利用条件](/legal/tool-terms/) にまとめています。

## 分野別の主要ツール

以下はすべて2026年9月時点の情報です。料金や機能は頻繁に変わります。

### 2D画像（キャラクター、背景、UI、アイコン）

| ツール | 特徴 |
|---|---|
| Midjourney | 2026年3月に V8 のアルファ版を公開し、以降 V8 系の更新が続いている。スタイルリファレンス（`--sref`）で、画像やスタイルコードから絵柄を引き継げる |
| GPT Image 2（OpenAI） | API から使える画像生成・編集モデル。画像入力と部分的な描き直し（インペインティング）に対応 |
| Nano Banana 2 / Nano Banana Pro（Google） | Gemini の画像生成モデル。Nano Banana 2 は1つのワークフローで最大5人のキャラクターの見た目を保てる。生成画像には SynthID の透かしと C2PA 情報が付く |
| Scenario | ゲーム素材向けのプラットフォーム。10〜50枚程度の参考画像から、自分の絵柄やキャラクターの専用モデルを学習できる |

### ピクセルアート（ドット絵）

一般的な画像生成AIの出力は、ドットの大きさや色数がそろわず、そのままではドット絵として使いにくいことがあります。専用ツールを使うか、後処理が必要です。

| ツール | 特徴 |
|---|---|
| PixelLab | キャラクターの4方向・8方向の向き違い、アニメーション、タイルセット、UI素材を生成。Aseprite 連携と MCP に対応 |
| Retro Diffusion | ドット絵エディタ Aseprite の拡張機能。ライセンスを得たドット絵で学習した独自モデルを使い、減色やパレット作成の機能もある |

### 3Dモデル

| ツール | 特徴 |
|---|---|
| Meshy | Meshy 7 が最新。テキストや画像から3Dモデルを生成し、PBRテクスチャ、自動リギング（骨の設定）、600種以上のモーションを利用できる。FBX / GLB などで出力。API と MCP サーバーもある |
| Tripo | ゲーム向けの Smart Mesh で、500〜25,000ポリゴンの範囲で四角形ポリゴンのメッシュを生成。自動リギングに対応し、GLB / FBX / OBJ / USD で Unity・Unreal・Godot に取り込める |
| Hunyuan3D（Tencent） | 重みが公開されている3D生成モデル。自分のPCやサーバーで動かせる。ただし Hunyuan3D 2.1 のライセンスは EU・英国・韓国では適用されず、月間アクティブユーザー100万人超では別途許諾が必要 |

生成した3Dモデルは、ポリゴン数やUV（テクスチャの貼り方）が不揃いなことがあります。Blender などで確認・修正する前提で考えてください。

### 音楽（BGM）

| ツール | 特徴 |
|---|---|
| Suno | 2026年9月9日に v6 系（v6 / v6-wild / v6-mini）を公開。曲の一部を言葉で編集する機能がある。Free プランには商用利用権がなく、Pro 以上で商用利用権が付く |
| ElevenLabs Music | Eleven Music v2.5 が最新の音楽モデル。API から利用できる |

ツールごとの商用利用の条件（Stable Audio 3、Suno、ElevenLabs Music、Lyria、ACE-Step など）と、ゲームBGMの作り方は、[ゲームBGM・効果音をAIで作る](/dev-env/ai-music/)で詳しく扱います。ElevenLabs Music は、複数のプラットフォームで収益化するゲームが商用利用の対象外です。

### 効果音（SE）

| ツール | 特徴 |
|---|---|
| ElevenLabs Sound Effects | テキストから効果音を生成。1回あたり最大30秒。継ぎ目なく繰り返せるループ生成に対応し、環境音に使いやすい |

### ボイス

| ツール | 特徴 |
|---|---|
| ElevenLabs | 最新の Eleven v4 は日本語を含む90以上の言語に対応。セリフの量産や仮ボイスに使える |
| VOICEVOX | 無料の日本語音声合成ソフト。商用・非商用で使えるが、クレジット表記が必要。キャラクター（音声ライブラリ）ごとに別の規約があり、それにも従う必要がある |

## 品質の揃え方（スタイル統一）

生成AIで素材を作るときに最も時間がかかるのは、「1枚の良い絵」を作ることより「全部の絵を同じゲームの絵に見せる」ことです。

### 1. 先に「アートバイブル」を決める

アートバイブルは、ゲームの見た目のルールをまとめた資料です。最低限、次を決めて1ページにまとめます。

- 絵柄（例: 太い輪郭線、セル塗り、影は1段階）
- 色（使うパレット、基調色、禁止色）
- 解像度と比率（例: キャラクターは 32×32 ドット、表示倍率は整数倍）
- 視点（真横、見下ろし、斜め見下ろしなど）

### 2. プロンプトを部品化して固定する

「共通部分（絵柄・色・視点）」と「個別部分（何を描くか）」に分け、共通部分は毎回同じ文言を使います。プロンプトはテキストファイルで Git 管理すると、あとで再生成するときにも同じ条件に戻せます。

### 3. 参照画像や専用モデルを使う

- 基準となる1枚を決め、スタイルリファレンス（Midjourney の `--sref` など）や参照画像として毎回渡します。
- 素材の数が多いなら、Scenario のように自分の絵柄でモデルを学習させる方法もあります。

### 4. 後処理でそろえる

- **2D・ドット絵**: 減色して同じパレットに合わせる、輪郭線を統一する、縮小は最近傍法（ニアレストネイバー）で行う。
- **3D**: ポリゴン数とテクスチャ解像度の上限を決め、エンジン内で同じライティングで確認する。
- **音**: 音量をそろえる（ラウドネスの正規化）。BGMは同じツール・同じ系統のプロンプトで作ると統一感が出やすくなります。

### 5. ゲーム画面で確認する

素材単体で良く見えても、実際の画面に並べると浮くことがあります。仮素材の段階から早めにゲームに組み込み、スクリーンショットで全体を見比べてください。

## AIの活用ポイント

- **AIコーディングツールに素材パイプラインを作らせる**: 「フォルダ内のPNGを32色に減色し、スプライトシートにまとめる」といったスクリプトは、AIに書かせやすい作業です。
- **MCP対応の生成ツールをつなぐ**: PixelLab や Meshy は MCP に対応しており、AIエージェントから素材生成を依頼できます（2026年9月時点）。
- **仮素材と本番素材を分けて管理する**: 開発初期はAI素材で仮置きし、目立つ部分だけ後で作り込むと、スコープが膨らみにくくなります（[スコープの決め方](/getting-started/scope/)）。
- **権利と開示を記録する**: どのツール・どのプランで生成したかを素材ごとに記録しておくと、規約の確認やストアでのAI使用の申告に役立ちます。条件は [AIツールの商用利用条件](/legal/tool-terms/) と [アセット・OSSのライセンス](/legal/licenses/) にまとめています。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-10-03**: AI が生成したスプライトシートはコマが等間隔に並ばないため、等分割では切り出せない。外周から背景を除去し、不透明ピクセルの分布から各コマの位置を検出して、固定グリッドに詰め直す方法の紹介（[出典](https://zenn.dev/maruhana/articles/ai-sprite-sheet-band-split)）
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Midjourney Style Reference](https://docs.midjourney.com/hc/en-us/articles/32180011136653-Style-Reference) — スタイルリファレンスの使い方
- [Midjourney V8 Alpha](https://updates.midjourney.com/v8-alpha/) — V8 の公開告知
- [GPT-Image-2 Model（OpenAI API）](https://developers.openai.com/api/docs/models/gpt-image-2) — GPT Image 2 の機能
- [Nano Banana 2（Google）](https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/) — Nano Banana 2 の機能と SynthID
- [Scenario Custom Model Training](https://www.scenario.com/features/train) — 専用モデルの学習
- [PixelLab](https://www.pixellab.ai/) — ドット絵キャラクター・アニメーション生成
- [Retro Diffusion for Aseprite](https://astropulse.gitbook.io/retro-diffusion/aseprite-extension/retro-diffusion-for-aseprite) — Aseprite 拡張の説明
- [Meshy](https://www.meshy.ai/) — 3Dモデル生成、リギング、MCPサーバー
- [Tripo](https://www.tripo3d.ai/) — ゲーム向け3Dモデル生成
- [Hunyuan3D 2.1 License](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1/blob/main/LICENSE) — Hunyuan3D 2.1 のライセンス本文
- [Introducing v6（Suno）](https://suno.com/blog/introducing-v6) — Suno v6 の公開告知
- [Suno Pricing](https://suno.com/pricing) — Suno の各プランと商用利用権
- [ElevenLabs Models](https://elevenlabs.io/docs/overview/models) — 音声・音楽モデルの一覧と対応言語
- [ElevenLabs Sound effects](https://elevenlabs.io/docs/overview/capabilities/sound-effects) — 効果音生成の仕様
- [VOICEVOX 利用規約](https://voicevox.hiroshiba.jp/term/) — VOICEVOX ソフトウェアの規約
