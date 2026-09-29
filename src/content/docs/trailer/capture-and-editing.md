---
title: 画面キャプチャと編集ツール
description: PV用のゲーム映像を録画するツール、UI非表示やデバッグカメラを備えたキャプチャ用ビルドの作り方、解像度・フレームレート、編集ツールの選び方をまとめます。
sidebar:
  order: 2
lastUpdated: 2026-09-29
---

## 概要

PVの品質は、編集テクニックよりも **素材（録画した映像）の質** で大きく決まります。この記事では次のことが分かります。

- ゲーム映像を録画するツールの選び方
- 撮影を楽にする「キャプチャ用ビルド」の作り方
- 解像度・フレームレートの考え方
- 無料で使える編集ツールと書き出し設定

構成の考え方は [PVの構成](/trailer/structure/) を先に読むと理解しやすくなります。

## 全体の流れ

1. 見せたい場面のリスト（ショットリスト）を作る
2. キャプチャ用ビルドで、場面ごとに何度も録画する
3. 編集ソフトで並べ、音楽と効果音を合わせる
4. 配信先ごとの設定で書き出す

「遊びながら録画して良い場面を探す」より、「見せたい場面を決めて練習してから撮る」ほうが結果的に早く終わります（[Derek Lieu: 10 Common Indie Game Trailer Mistakes](https://www.derek-lieu.com/blog/2020/9/14/10-common-indie-game-trailer-mistakes-and-how-to-fix-them)）。

## 録画ツール

### 汎用の録画ツール

| ツール | 対応OS | 特徴 |
|---|---|---|
| [OBS Studio](https://obsproject.com/) | Windows / macOS / Linux | 無料・オープンソース。設定の自由度が高い。最新安定版は32.2.2（2026年8月14日、[GitHub Releases](https://github.com/obsproject/obs-studio/releases)）で、33.0はベータ中（2026年9月時点） |
| [NVIDIA App](https://www.nvidia.com/en-us/software/nvidia-app/)（ShadowPlay） | Windows（NVIDIA製GPU） | 直前のプレイを保存するインスタントリプレイ機能がある。公式サイトでは4K HDR 120fpsでの録画に対応とされている（2026年9月時点） |
| [Xbox Game Bar](https://support.xbox.com/en-US/help/friends-social-activity/share-socialize/record-game-clips-game-bar-windows-10) | Windows | OS標準。`Win + Alt + R` で録画開始・停止 |
| [macOS スクリーンショットApp](https://support.apple.com/en-us/102618) | macOS | OS標準。`Shift + Command + 5` で録画ツールバーを開く |

インスタントリプレイは「偶然うまくいった瞬間」を逃さないのに便利です。狙った場面を丁寧に撮るならOBSが扱いやすいでしょう。

### OBSの設定のポイント

OBS公式の [Audio/Video Formats Guide](https://obsproject.com/kb/audio-video-formats-guide) によると（2026年9月時点）、次の点に注意します。

- **保存形式**: 通常のMP4/MOVは書き込みが中断されると復旧できないことがあるため、直接の録画には推奨されていません。既定のMKV、またはHybrid MP4／Fragmented MP4を使います。MKVは録画後に「再多重化（remux）」でMP4に変換できます。
- **エンコーダー**: ローカル録画では、使える中で最も良いハードウェアエンコーダー（AV1 > HEVC > H.264の順）を選ぶよう勧めています。
- **ビットレート**: 編集で画質が落ちるので、配信用より高めに設定します。

### エンジン内蔵の録画機能

エンジンの機能を使うと、処理が重い場面でもコマ落ちのない映像を作れます。

| エンジン | 機能 | 特徴 |
|---|---|---|
| Godot | [Movie Maker モード](https://docs.godotengine.org/en/stable/tutorials/animation/creating_movies.html) | 固定FPSで非リアルタイムに書き出すため、PCの性能に関係なくコマ落ちしない。`--write-movie` と `--fixed-fps` でコマンドラインからも実行できる |
| Unity | [Unity Recorder](https://docs.unity3d.com/Packages/com.unity.recorder@5.1/manual/index.html) | 動画・画像連番・音声を録画できる。**エディタのPlayモードでのみ動作** し、ビルドしたゲームでは使えない |
| Unreal Engine | [Take Recorder](https://dev.epicgames.com/documentation/en-us/unreal-engine/record-gameplay-in-unreal-engine) / [Movie Render Queue](https://dev.epicgames.com/documentation/en-us/unreal-engine/rendering-high-quality-frames-with-movie-render-queue-in-unreal-engine) | プレイを記録してSequencerで編集し、高品質に書き出せる |

## キャプチャ用ビルドを作る

キャプチャ用ビルドとは、撮影を楽にするための機能を足した開発用ビルドです。エンジニアにとっては一番効果の大きい投資です。

### 入れておきたい機能

| 機能 | 目的 |
|---|---|
| HUD・UIの表示切り替え | HUDあり／なしの両方を撮る |
| デバッグカメラ（フリーカメラ） | プレイヤーと独立してカメラを動かし、引きの画や寄りの画を撮る |
| 時間の速度変更・一時停止 | スローモーションや決定的瞬間の静止画 |
| チート（無敵、敵の出現、ステージ移動） | 見せたい場面をすぐ再現する |
| 乱数シードの固定 | 同じ展開を何度も撮り直す |
| デバッグ表示・マウスカーソルの非表示 | 不要な映り込みを防ぐ |
| 解像度プリセット（縦長を含む） | [SNS向けショート動画](/trailer/social-shorts/) 用の縦型を別に撮る |

### 実装例（Godot 4）

オートロード（常駐スクリプト）に登録して使う、最小限の例です。

```gdscript
# capture_tools.gd — プロジェクト設定の Autoload に登録する
extends Node

func _ready() -> void:
    # ゲームを一時停止しても、このノードは入力を受け付ける
    process_mode = Node.PROCESS_MODE_ALWAYS

func _unhandled_input(event: InputEvent) -> void:
    if not OS.is_debug_build():
        return  # リリースビルドでは無効
    if event is InputEventKey and event.pressed and not event.echo:
        match event.keycode:
            KEY_F1:  # "hud" グループに入れたノードの表示を切り替え
                for node in get_tree().get_nodes_in_group("hud"):
                    node.visible = not node.visible
            KEY_F2:  # スローモーション
                Engine.time_scale = 0.25 if Engine.time_scale == 1.0 else 1.0
            KEY_F3:  # 一時停止
                get_tree().paused = not get_tree().paused
            KEY_F4:  # マウスカーソルの表示切り替え
                if Input.mouse_mode == Input.MOUSE_MODE_HIDDEN:
                    Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
                else:
                    Input.mouse_mode = Input.MOUSE_MODE_HIDDEN
```

Unityでは、同様の処理を `#if UNITY_EDITOR || DEVELOPMENT_BUILD` で囲み、`Time.timeScale` で速度を変えるのが一般的な方法です。

:::caution
キャプチャ用の機能がリリースビルドに残らないようにしてください。上の例のようにビルド種別で分岐させるか、専用のビルド設定を用意します。
:::

## 解像度とフレームレート

| 項目 | 目安 | 理由 |
|---|---|---|
| 録画解像度 | 最終出力と同じか、それ以上 | 4Kで録っておくと、1080pで書き出すときに拡大・切り抜きの余裕ができる |
| 録画フレームレート | 60fps | Steamは30fpsと60fpsに対応（[Steamworks](https://partner.steamgames.com/doc/store/trailer)）。60fpsで撮れば両方に使える |
| Steam向け出力 | 1920×1080、16:9 | Steamworksが推奨する最大解像度（2026年9月時点） |
| 縦型動画 | 1080×1920、9:16 | ショート動画向け |

素材ごとにフレームレートが混在すると、動きがカクついて見えます。Derek Lieu氏の [品質チェックリスト](https://www.derek-lieu.com/blog/2022/7/11/quality-control-check-list-for-game-trailers) でも確認項目に挙げられています。重い場面は、前述のGodot Movie Makerのような非リアルタイム書き出しを使うと安定します。

## 編集ツール

| ツール | 価格 | 対応OS | 特徴 |
|---|---|---|---|
| [DaVinci Resolve](https://www.blackmagicdesign.com/products/davinciresolve) | 無料版あり／Studio版は295ドル | Windows / macOS / Linux | 最新は21。無料版は8bit・最大60fps・Ultra HD（3840×2160）まで。Studio版はAI機能（DaVinci Neural Engine）や120fps、4K超に対応（2026年9月時点） |
| [Kdenlive](https://kdenlive.org/) | 無料・オープンソース | Linux / Windows / macOS / BSD | 最新は26.08.1（2026年9月11日） |
| [Shotcut](https://shotcut.org/) | 無料・オープンソース | Windows / macOS / Linux | 最新は26.9（2026年9月時点）。動作が軽い |
| [CapCut](https://www.capcut.com/) | 無料・有料プランあり | Windows / macOS / モバイル | テンプレートが多くショート動画向け。規約に注意（下記） |

どれを選ぶか迷ったら、まずは無料のツールで1本作ってみて、不足を感じてから乗り換えるのが良いでしょう。DaVinci Resolveは多機能ですが覚えることも多めです。

:::caution[CapCutの規約]
CapCutの利用規約（2026年4月15日更新）では、ユーザーがアップロードしたコンテンツについて、CapCutに非独占・無償・永続・全世界的な利用許諾を与える条項があります（[CapCut Terms of Service](https://www.capcut.com/clause/terms-of-service)）。未発表のゲーム映像を扱う前に、規約本文を確認してください。ツールの規約の考え方は [AIツールの商用利用条件](/legal/tool-terms/) も参照してください。
:::

### 書き出し設定（Steam向け）

Steamworksの推奨は次のとおりです（[Steamworks: トレーラー](https://partner.steamgames.com/doc/store/trailer)、2026年9月時点）。

- コンテナ: .mp4 / .mov / .wmv
- 映像: H.264推奨、5,000kbps以上
- 音声: AAC推奨、44.1kHzまたは48kHz（ステレオに変換される）
- Adobe Media Encoder向けには「H.264 Video（20Mbps）＋AAC Stereo Audio（192kbps）」のプリセットが案内されている

詳しくは [Steamトレーラーの要件](/trailer/steam-trailer/) を参照してください。

## AIの活用ポイント

- **キャプチャ用機能の実装**: デバッグカメラやチートコマンドは定型的なコードなので、AIコーディングツールに任せやすい部分です。ただし「リリースビルドで無効になっているか」は自分で確認しましょう。
- **ffmpegコマンドの作成**: 変換作業はLLMにコマンドを書かせると早く済みます。実行前に意味を確認してください。

```sh
# MKV を再エンコードせずに MP4 へ変換（remux）
ffmpeg -i input.mkv -c copy output.mp4

# 16:9 の中央を切り抜いて 1080x1920 の縦型にする
ffmpeg -i input.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:a copy vertical.mp4
```

- **編集ソフトのAI機能**: 文字起こしや字幕生成、ノイズ除去などは作業時間を減らせます。ただし、映像そのものを生成・改変する機能を使う場合は、ゲーム内容と異ならないよう注意が必要です（[AI動画生成の使いどころ](/trailer/ai-video/)）。

## 最新情報

:::note[自動更新]
この欄は情報収集エージェントが毎週更新しています。
:::

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [OBS Studio](https://obsproject.com/) — 無料の録画・配信ソフト
- [OBS Audio/Video Formats Guide](https://obsproject.com/kb/audio-video-formats-guide) — 保存形式とエンコーダーの選び方
- [OBS Studio Releases（GitHub）](https://github.com/obsproject/obs-studio/releases) — バージョン履歴
- [NVIDIA App](https://www.nvidia.com/en-us/software/nvidia-app/) — ShadowPlayによる録画機能
- [Godot: Creating movies](https://docs.godotengine.org/en/stable/tutorials/animation/creating_movies.html) — Movie Maker モードの公式ドキュメント
- [Unity Recorder](https://docs.unity3d.com/Packages/com.unity.recorder@5.1/manual/index.html) — Unityの録画パッケージ
- [Record Gameplay in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/record-gameplay-in-unreal-engine) — Take Recorderの使い方
- [DaVinci Resolve](https://www.blackmagicdesign.com/products/davinciresolve) — 無料版と有料版の比較
- [Kdenlive](https://kdenlive.org/) / [Shotcut](https://shotcut.org/) — オープンソースの編集ソフト
- [Trailers（Steamworks ドキュメント）](https://partner.steamgames.com/doc/store/trailer) — Steam向けの書き出し仕様
