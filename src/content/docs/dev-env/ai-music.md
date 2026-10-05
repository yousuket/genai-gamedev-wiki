---
title: ゲームBGM・効果音をAIで作る：ツールの選び方と商用利用の条件
description: Stable Audio 3・Suno・ElevenLabs Music・Lyria・ACE-Step などの音楽生成AIを、商用利用の条件と権利の扱いで比較し、ゲームBGMとして使うときの作り方をまとめます。
sidebar:
  order: 6
lastUpdated: 2026-10-05
---

## 概要

BGM は、ゲームの雰囲気を決める素材です。作曲の経験がなくても、音楽生成AIで曲の候補を短時間で作れます。
ただし、音楽生成AIは**ツールごとに商用利用の条件がまったく違います**。ゲームに入れて売る前提なら、音質より先に規約を見て選ぶ必要があります。
この記事では、主要なツールの商用利用の条件と権利の扱いを規約・ライセンス本文で確認して比較し、ゲームBGMとしての作り方を紹介します。確認できなかった条件は、そのように書いています。
素材全般のツールは[アセット生成](/dev-env/asset-generation/)、規約の読み方の一般論は[AIツールの商用利用条件](/legal/tool-terms/)を参照してください。

## ツールの比較

すべて2026年10月時点の情報です。

| ツール | 種類 | 商用利用の条件 | 権利の扱い | 向いている用途 | 出典 |
|---|---|---|---|---|---|
| [Stable Audio](https://stability.ai/stable-audio) 3 Medium / Small（オープンな重み） | BGM、効果音（Small SFX） | Stability AI Community License。登録すれば、年間売上100万ドル未満なら無料で商用利用できる。超えると許諾が必要 | 出力は利用者が所有（法律上可能な範囲）。学習データはライセンス済みの音源と CC 系の音源 | 自分のPCで量産する、素材を再現性高く作る | [Community License](https://stability.ai/community-license-agreement)、[モデルカード](https://huggingface.co/stabilityai/stable-audio-3-medium) |
| [Stable Audio](https://stability.ai/stable-audio)（Webアプリ・API） | BGM、効果音 | 無料プランは個人・非商用。有料プラン（Solo から）は商用ライセンス付き | 出力の権利を利用者に譲渡（法律上可能な範囲） | 環境構築なしで試す | [料金](https://stableaudio.com/pricing)、[Terms of Service](https://stability.ai/terms-of-service) |
| [Suno](https://suno.com/) | BGM、歌入りの曲 | 商用利用権は Pro・Premier のみ。商用で使えるのは、ダウンロード枠でダウンロードした曲だけ | Pro・Premier の出力は権利を利用者に譲渡。著作権が成立する保証はない | 歌入りの曲、タイトル曲 | [Terms of Service](https://suno.com/terms)、[料金](https://suno.com/pricing) |
| [ElevenLabs](https://elevenlabs.io/) Music | BGM、歌入りの曲 | 有料プランで商用利用できる。ただし<strong>複数のプラットフォームで販売するゲーム（Studio Games）は、セルフサーブのプランでは対象外</strong> | 出力の権利は利用者が保持 | 短い期間で曲数を作る、API で自動化する | [Music Model-Specific Terms](https://elevenlabs.io/eleven-music-model-specific-terms)、[Terms of Use](https://elevenlabs.io/terms-of-use) |
| [Lyria](https://deepmind.google/models/lyria/)（Google、Gemini API） | BGM（30秒のクリップ、数分の曲） | 有料枠のみで、無料枠はない（Lyria 3.5 は1曲あたり0.08ドル）。音楽に特化した商用条件は確認できなかった | 所有権を Google は主張しない。出力には SynthID の透かしが入る | 開発中の仮BGM、API で自動生成 | [Lyria のドキュメント](https://ai.google.dev/gemini-api/docs/music-generation)、[追加規約](https://ai.google.dev/gemini-api/terms)、[料金](https://ai.google.dev/gemini-api/docs/pricing) |
| [ACE-Step](https://ace-step.github.io/) 1.5（オープンな重み） | BGM、歌入りの曲 | MIT ライセンス。モデルカードは、生成した音楽を商用目的で使えるとしている | モデルカードに権利の帰属の記載はない。学習データはライセンス済みの音源とロイヤリティフリーの音源と説明されている | 自分のPCで試す、ライセンスを緩くしたい | [モデルカード](https://huggingface.co/ACE-Step/Ace-Step1.5) |
| [AIVA](https://www.aiva.ai/) | BGM（オーケストラなど） | 有料の Standard は、収益化の対象が YouTube・Twitch・TikTok・Instagram に限られる。ゲームでの収益化は Pro が対象と読める | Pro のみ著作権が利用者のもの。Free と Standard は AIVA のもの | MIDI で出力して手直しする | [料金](https://www.aiva.ai/pricing) |
| [Udio](https://www.udio.com/) | （ゲームBGMには使えない） | 出力は個人・非商用に限る。出力のダウンロードも禁止 | 出力は会社と権利者のもの | 使えない | [Terms of Service](https://www.udio.com/terms-of-service)（2025年11月12日改定） |
| MusicGen（Meta） | BGM | 重みは CC BY-NC 4.0 で、商用利用できない | 学習データは Meta の音源と Shutterstock・Pond5 の音源 | 試作・学習用 | [モデルカード](https://huggingface.co/facebook/musicgen-small) |

## Stable Audio 3 のライセンス

[Stable Audio](https://stability.ai/stable-audio) 3（Small・Medium）の重みは、2026年5月に Hugging Face で公開されています。ライセンスの条件は、公式の次のページで確認できます。

- モデルカードのライセンスは `stable-audio-community` で、商用利用は [stability.ai/license](https://stability.ai/license) を見るよう案内されています。このページの Community の欄に Stable Audio 3.0 が含まれ、Community License が適用されます。[Core Models の一覧](https://stability.ai/core-models)にも Small と Medium が載っています。
- Community License の中身は、売上100万ドル未満なら、研究・非商用だけでなく商用利用も無料です。商用利用するには Stability AI への登録が必要です。
- 100万ドルは、そのモデルの出力から得た収益ではなく、<strong>年間の収益の合計</strong>です。ゲーム以外の収益も含み、関連会社の分も合算します。超えると、ライセンスは超えた日に終了し、Stability AI に個別の許諾を求めることになります。
- 出力は、法律で認められる範囲で利用者が所有します。モデル、ソフトウェア、ドキュメントとその派生物（ファインチューンなど）が対象で、出力そのものは派生物の定義から除かれています。
- モデルやその派生物を第三者に配布するときは、規約のコピーの添付、Notice ファイルの同梱、「Powered by Stability AI」の表示が必要です。出力の音だけをゲームに入れる場合は、この配布には当たらないと読めます（推測ですが、条文の定義からの読み取りです）。ゲームの中にモデルを同梱して、実行時に音を作らせる場合は配布に当たります。
- 利用は、法律と Stability AI の利用ポリシーに従う必要があります。基盤モデルを作ったり改良したりするために、モデルや出力を使うことは禁止です。
- モデルのテキスト処理には T5Gemma が使われていて、Gemma の利用規約（3.2節の利用制限を含む）に同意することが求められます。
- 学習データは、AudioSparx からライセンスを得た約80万件と、Freesound の CC0・CC BY・CC Sampling+ の約47万件です（モデルカードの記載）。CC BY の音源が含まれるため、<strong>出力にクレジット表記が必要かどうかは、確認できませんでした</strong>。

Web アプリの有料プランでは、解約後も、有料プランで作った音は元のライセンスの対象のままです（[料金ページ](https://stableaudio.com/pricing)の FAQ）。Stability AI の規約は、利用者が Stability AI を補償する条項があり、Stability AI 側の補償は Enterprise ライセンスで提供されると案内されています（[Stable Audio](https://stability.ai/stable-audio)）。

## ライセンスの読み方

ゲームに入れて売るときは、次の点を見ます。

1. **作った時点のプラン**: [Suno](https://suno.com/) は、無料プランで作った曲は後から有料にしても、原則として商用利用できません（[ヘルプ](https://help.suno.com/en/articles/2425729)）。[ElevenLabs](https://elevenlabs.io/) は、プランを解約・格下げしても、作った時点のプランの権利が出力に残ります。
2. **ダウンロード枠**: Suno は、商用で使えるのは、枠の範囲でダウンロードした曲だけです。枠は Pro が月20曲、Premier が月60曲です（[料金](https://suno.com/pricing)）。録音やストリームの取り込みで手に入れた音は使えません。取得済みのダウンロードの商用利用権は、解約後も続きます（Suno の規約）。
3. **売る範囲**: ElevenLabs Music の「Studio Games」は、販売・広告などで収益化し、複数のプラットフォームで提供するゲームです。セルフサーブのプランは、映画・テレビ・ラジオとこの Studio Games を除く商用利用が対象で、Studio Games を含む用途は Enterprise Music の契約でのみ許可されています。同社のドキュメントは「ゲームを含む商用利用に対応」と案内していますが、規約の表はこの除外を明記しています。1つのプラットフォームだけで売るゲームが対象外に当たるかは、条文からは確認できませんでした。
4. **収益の上限**: [Stable Audio](https://stability.ai/stable-audio) 3 は年間売上100万ドルが境目です。
5. **クレジット表記**: ElevenLabs は、無料プランだけ表記が必要です。Stable Audio 3 の Community License は、モデルの配布時に表記を求めます。
6. **補償**: 個人向けの規約では、補償がないのが一般的です。確認できた範囲では、Stability AI の補償は Enterprise のみです。
7. **オープンな重み**: ライセンス本文が条件のすべてです。モデルごとに違い、同じ「オープン」でも、[ACE-Step](https://ace-step.github.io/) は MIT、Stable Audio 3 は売上上限つき、MusicGen は商用不可です。

「出力を所有できる」と「著作権が成立する」は別の話です。Suno も、著作権が成立する保証はしないと書いています。権利の考え方は[生成AI素材の著作権](/legal/copyright/)を参照してください。

## ゲームBGMとしての作り方

ここは、規約ではなく、実務の手順です。出典のない部分は、推測や一般的なやり方として書いています。

### 先に仕様を決める

曲を作る前に、場面ごとに「雰囲気、テンポ（BPM）、楽器、長さ、ループするか」を表にします。AIに曲を作らせるときも、この表がそのまま指示文の材料になります。

### ループさせる

AIの曲は、1曲として終わる構成になりやすいです（推測ですが、曲として聴かせる学習が中心のためです）。ゲーム用には、次の手順を取ります。

1. BPM を指定して生成する。小節の頭で切れるように、BPM が分かっている曲を使う。
2. DAW や波形エディタで、小節の境目でトリムする。
3. 終わりの部分を、先頭に重ねるようにクロスフェードして、つなぎ目を目立たなくする。
4. ゲームエンジンでループを有効にする。Godot の場合、Ogg Vorbis と MP3 の取り込みに、Loop、Loop Offset、BPM、Beat Count、Bar Beats の設定項目があります（[Godot ドキュメント](https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_audio_samples.html)）。

[Lyria](https://deepmind.google/models/lyria/) の Clip モデルは、30秒の短いクリップを作るモデルで、ドキュメントでも用途にループが挙げられています。[Stable Audio](https://stability.ai/stable-audio) 3 は、音の一部を作り直すインペインティングと、短い録音を続きとして伸ばす機能に対応しています（モデルカード）。曲の末尾の継ぎ目を作り直す用途に使えそうですが、試していません。

### 場面ごとに差し替える

- 探索、戦闘、ボス戦のように場面を分ける場合は、キー（調）、BPM、楽器編成を共通にして、強さだけを変えると、切り替えが自然になります。
- 同じツール、同じ系統のプロンプトで作ると、ゲーム全体の統一感が出ます（[アセット生成](/dev-env/asset-generation/)）。
- パートを分けて重ねたいなら、[Suno](https://suno.com/) の Pro 以上のステム分離（[料金](https://suno.com/pricing)）や、[ElevenLabs](https://elevenlabs.io/) の有料プランの API（ステム）が使えます。

### 長さと容量

ループ素材は短くても成立します。生成できる長さは、Lyria が30秒のクリップと数分の曲、ElevenLabs Music が3秒から5分、Stable Audio のWebアプリが最大6分です（各ドキュメント）。容量は、Ogg Vorbis などの圧縮形式で書き出して抑えます。

### ミキシングと、AIの癖の直し方

- 音量をそろえます（ラウドネスの正規化）。曲ごとに音量がばらつくことが多いためです。
- 効果音やボイスと周波数帯が重なる中域を、EQで少し下げると、聞き取りやすくなります。
- 歌が混ざったら、インストゥルメンタルと指定して作り直します。
- 曲の終盤で急に終わる、同じフレーズが不自然に繰り返される、といった癖は、使う部分だけを切り出して、DAWでつなぎ直します。

## 効果音とボイス

- **効果音**: [Stable Audio](https://stability.ai/stable-audio) 3 Small SFX は、効果音向けのオープンな重みです。モデルカードの例は7秒の音です。ライセンスは Medium と同じ Community License です。[ElevenLabs](https://elevenlabs.io/) の Sound Effects は、最大30秒で、ループ生成にも対応します（[アセット生成](/dev-env/asset-generation/)）。無料利用は非商用に限られます（[Terms of Use](https://elevenlabs.io/terms-of-use)）。Sound Effects に、Music の「Studio Games」のような条件があるかは、確認できませんでした。
- **ボイス**: ElevenLabs や VOICEVOX などの選択肢と規約は、[アセット生成](/dev-env/asset-generation/)を参照してください。

## 配信先での開示

プレイヤーが聞く BGM や効果音をAIで作った場合は、[Steam](https://store.steampowered.com/) などでAI生成コンテンツとして申告します。開示の仕組みと対象は[プラットフォームのAIポリシー](/legal/platform-policies/)に、素材の記録のしかたは[AIツールの商用利用条件](/legal/tool-terms/)にまとめています。ツール名、プラン、生成日、規約の版を、曲ごとに残しておくと、申告にも使えます。

## AIの活用ポイント

### BGM の指示文の書き方

[Lyria](https://deepmind.google/models/lyria/) のドキュメントは、楽器、BPM、キー（調）、雰囲気、構成を具体的に書くよう勧めています。[Stable Audio](https://stability.ai/stable-audio) 3 のモデルカードは英語のみ対応で、例も BPM を末尾に書く形です。
[ElevenLabs](https://elevenlabs.io/) Music は、アーティスト名、曲名、アルバム名、レーベル名、歌詞の大部分を入力に使うことを禁じています（[Music Terms](https://elevenlabs.io/music-terms)）。Lyria も、特定のアーティストの声を求めるプロンプトを止めます。「○○風」と名前で指定せず、音の特徴で書きます。

指示文は、次の順に書くと整理できます。

1. 用途（どの場面のBGMか）
2. ジャンルと楽器
3. テンポ（BPM）とキー
4. 雰囲気の変化（盛り上がり方）
5. 長さ・ループ・ボーカルの有無

### プロンプト例

探索場面のループ用:

```
Calm exploration theme for a top-down fantasy village, loopable.
Acoustic guitar, soft flute and light hand percussion. 90 BPM, D major.
Steady and warm, no big build-ups, no vocals. 60 seconds.
```

ボス戦用（探索の曲と BPM とキーをそろえる）:

```
Boss battle theme for a 2D action game, same key as the village theme.
Driving taiko, low strings and brass stabs, 135 BPM, D minor.
Intense from the start, with a short break in the middle, no vocals.
```

### 作業を任せる

- ゲームデザイン文書をAIに読ませ、「場面名、雰囲気、BPM、キー、長さ、ループの有無」の発注表を作らせます。そのままプロンプトの材料にできます。
- ループのつなぎ目の確認は、AIコーディングツールに、ffmpeg や Python で音量とつなぎ目の波形を調べるスクリプトを書かせると楽です（[AIコーディングツール](/dev-env/ai-coding-tools/)）。
- 曲ごとの「ツール、プラン、生成日、規約の版、ダウンロード日」の台帳も、スクリプトで管理できます。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-10-05**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Stability AI Community License Agreement](https://stability.ai/community-license-agreement) — 商用利用の条件、売上100万ドル、出力の所有
- [Stability AI License](https://stability.ai/license) — Stable Audio 3.0 が Community に含まれることの確認
- [Stability AI Core Models](https://stability.ai/core-models) — Stable Audio 3.0 Small / Medium の記載
- [Stable Audio 3 Medium（Hugging Face）](https://huggingface.co/stabilityai/stable-audio-3-medium) — モデルカード、学習データ、Gemma 規約の注記
- [Stable Audio 3 Small SFX（Hugging Face）](https://huggingface.co/stabilityai/stable-audio-3-small-sfx) — 効果音向けモデル
- [Stable Audio 料金](https://stableaudio.com/pricing) — 有料プランの商用ライセンスと解約後の扱い
- [Stability AI Terms of Service](https://stability.ai/terms-of-service) — 出力の権利と禁止事項（2026年9月30日発効）
- [Stable Audio（Stability AI）](https://stability.ai/stable-audio) — モデルの構成と Enterprise の補償
- [Suno Terms of Service](https://suno.com/terms) — 商用利用、ダウンロード枠、権利の譲渡（2026年9月3日発効）
- [Suno Pricing](https://suno.com/pricing) — プラン別のダウンロード数と商用利用権
- [Suno ヘルプ：加入前の曲の権利](https://help.suno.com/en/articles/2425729) — 無料プランで作った曲の扱い
- [ElevenLabs Eleven Music Model-Specific Terms](https://elevenlabs.io/eleven-music-model-specific-terms) — プラン別の商用権利の表、Studio Games の定義（2026年5月26日更新）
- [ElevenLabs Music Terms](https://elevenlabs.io/music-terms) — 禁止される入力、禁止業種
- [ElevenLabs Terms of Use](https://elevenlabs.io/terms-of-use) — 無料利用は非商用（2026年3月31日更新）
- [ElevenLabs Music](https://elevenlabs.io/docs/overview/capabilities/music) — 生成できる長さ
- [Generate music with Lyria 3.5（Gemini API）](https://ai.google.dev/gemini-api/docs/music-generation) — モデルの種類、長さ、SynthID、ベストプラクティス
- [Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms) — 生成物の所有権（2026年3月23日発効）
- [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing) — Lyria の料金
- [ACE-Step 1.5（Hugging Face）](https://huggingface.co/ACE-Step/Ace-Step1.5) — MIT ライセンスと商用利用の記載
- [AIVA 料金](https://www.aiva.ai/pricing) — プラン別の収益化の範囲と著作権
- [Udio Terms of Service](https://www.udio.com/terms-of-service) — 出力は個人・非商用、ダウンロード禁止
- [MusicGen（Hugging Face）](https://huggingface.co/facebook/musicgen-small) — 重みは CC BY-NC 4.0
- [Godot: Importing audio samples](https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_audio_samples.html) — ループ設定の項目
