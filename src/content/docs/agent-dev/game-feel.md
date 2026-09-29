---
title: ゲームの手触りをエージェントと詰める
description: エージェントは手触りを感じられないため、人が触って言語化し、エージェントが数値に落とす分業にします。調整用パラメータの一元化、デバッグUI、ジュース、遅延の測定、動画フレームによる調整サイクルを説明します。
sidebar:
  order: 10
lastUpdated: 2026-09-29
---

## 概要

- ゲームの手触り（ゲームフィール）とは、操作したときの気持ちよさのことです。ジャンプの浮遊感、攻撃が当たったときの重さ、画面の揺れなどが含まれます。
- コーディングエージェントは、コードを書けても、操作して感じることはできません。そこで、人が触って言葉にし、エージェントがその言葉を数値と実装に落とす分業にします。
- この記事では、感覚を数値に対応づける方法、調整用パラメータを1か所にまとめる設計、デバッグUI（スライダー）、ジュース（演出）の入れ方、操作の遅延の測り方、参照ゲームとの比較、プレイ動画のフレームを見せる方法、調整サイクルの例を扱います。
- コードとプロンプトは、このWikiのために書いた例です。

## 分業の考え方

| 役割 | 人 | エージェント |
|---|---|---|
| 感じる | 実際に触り、違和感を見つける | できない |
| 言葉にする | 「どの場面で、何が、どう感じたか」を書く | 曖昧な言葉を、確認の質問で具体化する |
| 数値にする | 方向（重い、軽い）を決める | 数値案を複数作り、実装する |
| 比べる | 案どうしを触り比べる | 案を切り替えられる仕組みを作る |
| 測る | 決める | 遅延、フレーム数、揺れの大きさを、コードで測る |
| 決める | 人 | しない |

[AI駆動の開発ワークフロー](/dev-env/ai-workflow/) でも、調整用の数値を外に出し、人が数値で伝えると、意図どおりに直りやすいと説明しています。この記事は、その手順を具体的にします。

## 感覚を数値にする

「気持ちよくして」だけでは、エージェントは何を動かせばよいか決められません。感覚の言葉と、動かすパラメータの対応表を持っておくと、指示が速くなります。次の表は、調整の出発点になる対応です。

| 感じたこと | 動かす候補 |
|---|---|
| 重い、もっさり | 加速にかかる時間を短くする、最高速を上げる、攻撃の前の硬直を減らす |
| ふわふわ浮く | 重力を上げる、下降中だけ重力を強める（下降の重力倍率） |
| 滑る | 減速にかかる時間を短くする（摩擦を上げる） |
| 押したのに出ない | 入力バッファ（着地の直前に押したジャンプを覚えておく時間）を延ばす、コヨーテタイム（足場を離れた直後も少しの間ジャンプを受け付ける猶予）を延ばす |
| 反応が遅い | 遅延を測る（後述）。予備動作のアニメーションのフレーム数を減らす |
| 当たった感じがない | ヒットストップ、画面の揺れ、効果音、パーティクル、ノックバックを足す |

言葉にするときは、次の4点を書きます。

```text
場面: 崖の端から歩いて落ちる直前にジャンプを押したとき
感じたこと: 押したのにジャンプが出ないことがある
方向: もっと出やすく（許す猶予を長く）
程度: 今の倍くらい
```

「程度」は、数値でなくても構いません。エージェントが、その言葉を数値の変更案に直します。

## 調整用パラメータを1か所にまとめる

数値がコードのあちこちにあると、エージェントも人も、どこを直せばよいか分からなくなります。調整用の数値は1つのファイルに集め、外から見える形にします。

```ts
// src/tuning.ts
export const tuning = {
  player: {
    maxSpeed: 6.0,          // マス/秒
    accelTime: 0.12,        // 秒。最高速に達するまで
    decelTime: 0.08,        // 秒。止まるまで
    jumpHeight: 3.2,        // マス
    jumpTime: 0.55,         // 秒。上昇から着地まで
    fallGravityScale: 1.6,  // 下降中の重力の倍率
    coyoteTime: 0.08,       // 秒
    jumpBuffer: 0.10,       // 秒
  },
  juice: {
    enabled: { hitStop: true, shake: true, particles: true },
    hitStopMs: 60,
    shakeAmplitude: 0.15,   // マス
    shakeDecay: 8,          // 大きいほど早く収まる
  },
};

// 高さと時間（上昇と下降が対称の場合）から、重力と初速を導く
export function deriveJump(heightCells: number, totalTimeSec: number) {
  return {
    gravity: (8 * heightCells) / (totalTimeSec * totalTimeSec), // マス/秒²
    initialSpeed: (4 * heightCells) / totalTimeSec,             // マス/秒
  };
}

if (new URLSearchParams(location.search).has('debug')) {
  (window as unknown as { __tuning: typeof tuning }).__tuning = tuning;
}
```

ジャンプは、重力と初速のような物理の値ではなく、「高さ」と「時間」で持つ方が、人が感覚と結びつけやすくなります。`deriveJump` のとおり、上昇と下降が対称なら、重力は 8h/t²、初速は 4h/t です。たとえば高さ3.2マス、時間0.55秒なら、重力は約84.6マス/秒²、初速は約23.3マス/秒になります。

- 単位とコメントを必ず付けます。エージェントが「0.12」の意味を取り違えなくなります。
- 数値を追加するときの決まりは、[指示ファイル](/agent-dev/project-instructions/) に書きます。
- `window.__tuning` に公開すると、検証のスクリプト（[検証ループ](/agent-dev/verification-loop/)）が数値を読み書きでき、エージェントが自分で実験できます。
- Godot では Resource（`.tres`）、Unity では ScriptableObject に同じ役割を持たせます。エンジンのインスペクタから、値を直接触れます。

## デバッグUIを作らせる

数値を変えるたびにコードを編集して再読み込みする方法では、触り比べが進みません。実行中にスライダーで動かせるUIを、エージェントに作らせます。Three.js やブラウザのゲームなら、lil-gui が使えます。`gui.add(オブジェクト, 'プロパティ', 最小, 最大, 刻み)` で、数値のスライダーを作れます（[lil-gui](https://lil-gui.georgealways.com/)）。

```ts
// src/debug-ui.ts
import GUI from 'lil-gui';
import { tuning } from './tuning';

// [最小, 最大, 刻み]
const RANGES: Record<string, [number, number, number]> = {
  maxSpeed: [1, 12, 0.1],
  accelTime: [0.01, 0.5, 0.01],
  decelTime: [0.01, 0.5, 0.01],
  jumpHeight: [1, 6, 0.1],
  jumpTime: [0.2, 1.2, 0.01],
  fallGravityScale: [1, 3, 0.05],
  coyoteTime: [0, 0.25, 0.01],
  jumpBuffer: [0, 0.25, 0.01],
  hitStopMs: [0, 200, 5],
  shakeAmplitude: [0, 0.6, 0.01],
  shakeDecay: [1, 20, 0.5],
};

export function createDebugUi(): GUI {
  const gui = new GUI({ title: 'tuning' });
  for (const [groupName, group] of Object.entries(tuning)) {
    const target = group as Record<string, unknown>;
    const folder = gui.addFolder(groupName);
    for (const [key, value] of Object.entries(target)) {
      if (typeof value === 'boolean') folder.add(target as Record<string, boolean>, key);
      else if (RANGES[key]) folder.add(target as Record<string, number>, key, ...RANGES[key]);
    }
  }
  // 気に入った値を、そのままエージェントに貼れるようにする
  gui.add({ copy: () => navigator.clipboard.writeText(JSON.stringify(tuning, null, 2)) }, 'copy').name('現在値をコピー');
  return gui;
}
```

エージェントへの頼み方の例です。

```text
実行中に tuning の数値を触れるデバッグUIを、lil-gui で作ってください。
- ?debug=1 のときだけ表示する。
- 範囲と刻みは、tuning.ts の単位とコメントから妥当な値を決める。
- 「現在値をコピー」ボタンを付け、押すと tuning の JSON がクリップボードに入るようにする。
- 完成したら、スクリーンショットを撮って、UIがゲーム画面に重なっていないことを確かめる。
```

人はスライダーを動かして気に入った値を探し、「現在値をコピー」で JSON を貼ってエージェントに渡します。エージェントはその値を `tuning.ts` に反映し、コミットします。

案を比べるときは、A/B/C の3つのプリセットを作らせ、キーの1、2、3で切り替えられるようにすると、触り比べがしやすくなります。

## ジュースの入れ方

ジュースとは、操作への反応を大げさに返す小さな演出の総称です。ヒットストップ、画面の揺れ、効果音、パーティクルなどがあります。

代表的な講演が2つあります。

- Jan Willem Nijman（Vlambeer）の「The art of screenshake」（INDIGO Classes 2013）は、簡単なシューターに小さな変更を1つずつ足し、そのたびに手触りが変わる様子を見せる講演です。動画と、講演をたどれる対話式の資料が公開されています（[YouTube](https://www.youtube.com/watch?v=AJdEqssNZ-U)、[Internet Archive](https://archive.org/details/the-art-of-screenshake)）。
- Martin Jonasson と Petri Purho の「Juice it or lose it」（GDC Europe 2012）は、簡単な基本のゲームに、演出を舞台上で足していく講演です。パーティクルなどの効果を加え、デモに使ったソースコードが提供されました（[GDC Vault](https://www.gdcvault.com/play/1016487/juice-it-or-lose)）。

| 演出 | 内容 | 調整する値の例 |
|---|---|---|
| ヒットストップ | 攻撃が当たった瞬間に、進行を短く止める | 止める時間（ミリ秒） |
| 画面の揺れ | 発砲や被弾でカメラを揺らす | 振幅、収まる速さ、方向 |
| 効果音 | 打撃音を重ね、音の高さを少しずらす | 音量、ピッチの幅、層の数 |
| パーティクル | 当たった位置から火花や破片を出す | 数、寿命、速さ、色 |
| ノックバックと反動 | 当たった側と撃った側を動かす | 距離、時間 |
| フラッシュ | 当たった瞬間に白や赤を点滅させる | 不透明度、時間 |

- <strong>1回の依頼で足す演出は1つ</strong>にします。複数を同時に足すと、どれが効いたか分かりません。
- 演出ごとに、`enabled` のフラグを付けます。上の `tuning.juice.enabled` のように、オンとオフを切り替えて比べられるようにします。
- 「全部を強くする」と、画面が読みにくくなります。GDC Europe 2014 では、Folmer Kelly が、見た目の装飾に偏ると文脈がおろそかになると、ジュースの偏重に注意を促す講演をしました（[Game Developer の記事](https://www.gamedeveloper.com/design/video-indies-resist-the-urge-to-juice-it-or-lose-it-)）。敵の位置や弾が見えなくなっていないか、自分で確かめます。
- 揺れなど、動きの大きい演出は、強さを設定で下げられるようにしておくと、人によって快適さが違う点に対応できます。

```text
被弾時の演出を1つだけ追加してください（今回はヒットストップのみ）。
- 敵に弾が当たった瞬間、ゲームの進行を tuning.juice.hitStopMs ミリ秒止める。描画は止めない。
- 連続で当たった場合は、止める時間を足し合わせず、最長の1回分にする。
- tuning.juice.enabled.hitStop で切り替えられるようにする（比較のため）。
- 数値は tuning.ts に置き、デバッグUIに追加する。
- 他の演出（揺れ、効果音、パーティクル）は今回は触らない。
```

## 操作の遅延を測る

「反応が遅い」という感覚が、本当に遅延なのかを、測って確かめます。

| 方法 | 測るもの | 特徴 |
|---|---|---|
| ゲームの中で測る | 入力イベントから、結果が描画されるまでの時間 | 自動化でき、エージェントが自分で実行できる。画面に表示されるまでの時間は含まれない |
| ブラウザの Event Timing | 入力イベントの遅れと、次の描画までの時間 | 標準のAPI。`duration` は8ms単位に丸められる |
| スマートフォンで撮影する | 入力から画面に表示されるまでの全体 | 手間がかかるが、表示装置の遅れまで含む |

ゲームの中で測る例です。キーを押した時刻を記録し、ジャンプが始まったフレームの描画の直後に差を取ります。

```ts
// src/latency.ts
const latencies: number[] = [];
let pressedAt: number | null = null;

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !e.repeat) pressedAt = e.timeStamp; // イベントが発生した時刻
});

/** ゲームループの、描画の直後に毎フレーム呼ぶ */
export function afterRender(jumpStartedThisFrame: boolean): void {
  if (pressedAt !== null && jumpStartedThisFrame) {
    latencies.push(performance.now() - pressedAt);
    pressedAt = null;
  }
}

if (new URLSearchParams(location.search).has('debug')) {
  (window as unknown as { __latencies: number[] }).__latencies = latencies;
}
```

Playwright でキーを20回押して、中央値と最悪値を出します。

```js
for (let i = 0; i < 20; i++) {
  await page.keyboard.press('Space');
  await page.waitForTimeout(200);
}
const ms = (await page.evaluate(() => window.__latencies)).sort((a, b) => a - b);
console.log({ median: ms[Math.floor(ms.length / 2)], worst: ms[ms.length - 1] });
```

小さなテスト用のページで実行したところ、数ミリ秒から十数ミリ秒の値が出ました。60fps の1フレームは約16.7ms です。中央値が1フレーム以内で、最悪値も2フレーム以内に収まっていれば、「反応が遅い」という感覚の原因は、遅延ではなく、予備動作のアニメーションの長さや、ジャンプの立ち上がりの弱さにある可能性が高くなります。

Event Timing の `PerformanceEventTiming` は、`startTime`（イベントの時刻）、`processingStart`（処理の開始）、`duration`（次の描画まで、8msに丸め）を持ちます。既定では、`duration` が104ms以上のイベントだけが通知され、`durationThreshold` に16以上の値を指定すると閾値を下げられます（[PerformanceEventTiming（MDN）](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming)）。数十ミリ秒の差を見たい手触りの調整には、上の自作の計測の方が向いています。

## 参照ゲームと比べる

「あのゲームのジャンプのような感じ」という指示は、エージェントには伝わりません。参照ゲームの挙動を、数値にしてから渡します。

1. 参照ゲームを触り、真似たい挙動を1つに絞る（ジャンプ、ダッシュ、被弾など）。
2. 画面を録画し、動画を1フレームずつ見て、フレーム数と位置を書き出す。
3. 数値の表にして、エージェントに渡す。

| 項目 | 参照（例） | 自作（例） |
|---|---|---|
| 地面を離れてから最高点まで | 20フレーム | 27フレーム |
| 最高点から着地まで | 14フレーム | 27フレーム |
| 最高点の高さ（キャラの身長比） | 2.4倍 | 2.4倍 |
| 押してから地面を離れるまで | 2フレーム | 6フレーム |

この表なら、「上昇を短く、下降をさらに短く（下降の重力倍率を上げる）、予備動作を4フレーム減らす」という数値の指示になります。数値は、上のような架空の例です。60fps の動画ではフレーム数を秒に直せます（20フレームは約0.33秒）。

自作ゲーム側の数値は、状態の公開（[検証ループ](/agent-dev/verification-loop/)）を使い、フレームごとの座標を出力させて測ります。目で動画を見て数えるより、確実で、再現もできます。

## プレイ動画のフレームを見せて直させる

エージェントに動画そのものを見せることは、通常できません。動画をフレームの画像に分けて渡します。Anthropic のドキュメントでは、GIF は最初の1フレームだけが使われます（[Vision](https://platform.claude.com/docs/en/build-with-claude/vision)、2026年9月時点）。連続した動きは、静止画に分けて渡す必要があります。

録画は、OBS などの画面録画、Playwright の `recordVideo`（コンテキストを閉じたあとに保存）、Godot の `--write-movie` などで撮れます。ffmpeg で、1秒間に10コマを抜き出したり、コマを1枚の一覧表にまとめたりできます。

```bash
# 1秒あたり10コマを、連番の画像にする
ffmpeg -i play.mp4 -vf fps=10 frames/%04d.png

# 1秒あたり10コマを、幅300pxで並べた1枚の画像にする（横5コマ×縦4コマ）
ffmpeg -i play.mp4 -vf "fps=10,scale=300:-1,tile=5x4" -frames:v 1 sheet.png
```

`fps` フィルタは出力のフレームレートを指定し、`tile` フィルタは指定した行と列に並べた一覧の画像を作ります（[FFmpeg Filters](https://ffmpeg.org/ffmpeg-filters.html)）。

画像は、長辺が一定の大きさを超えると縮小されます。標準の解像度のモデルでは1568px、Claude 4.7 以降の高解像度のモデルでは2576px が上限です。上の一覧の画像は幅が約1,500px なので、縮小されにくい大きさです。

```text
添付は、被弾の瞬間の前後1.9秒を0.1秒ごとに並べた一覧です（左上から右へ、上から下へ時間順）。
4コマ目でヒットが起きています。次の点を、コマの番号で答えてください。
1. ヒットの前後で、敵とプレイヤーの見た目に、反応が現れているコマはどれか。
2. 画面の揺れが収まるまで何コマかかっているように見えるか。
3. ヒット直後に、弾や敵の位置が見えにくくなっているコマはあるか。
そのうえで、tuning.juice の値の変更案を、理由つきで3つ出してください。まだ変更はしないでください。
```

画像から読み取れる位置や大きさは、おおよその値です（同じドキュメントも、位置の出力は近似だと説明しています）。「揺れが何ピクセルか」のような正確な値は、画像から読ませず、フレームごとのカメラの位置を出力して測ります。画像は、「見た目として違和感がないか」の確認に向いています。

## 調整サイクルの例

ジャンプの手触りを詰める、架空の例です。

| 回 | 人の言葉 | エージェントの変更 | 確認 |
|---|---|---|---|
| 1 | 上がるのが遅くて重い | `jumpTime` を0.55秒から0.45秒に（高さは3.2マスのまま） | 触り比べて「軽くなったが、落ちるとき浮く」 |
| 2 | 落ちるときに浮いている | `fallGravityScale` を1.0から1.6に | 「よくなった」 |
| 3 | 着地の瞬間に何もなくて寂しい | 着地に、小さな縮みと効果音を追加（演出は1つずつ） | 「効果音だけで十分」→縮みは無効に |
| 4 | 崖の端でジャンプが出ないことがある | `coyoteTime` を0から0.08秒に | 「出るようになった」 |
| 5 | 押してから跳ぶまでが遅い気がする | 遅延を測ると中央値12ms。予備動作を6フレームから2フレームに | 「反応がよくなった」 |

進め方は、次の繰り返しです。

1. 人が5分ほど触り、違和感を1つ見つけて、言葉にする（場面、感じたこと、方向、程度）。
2. エージェントが、数値の案をA/B/Cのプリセットとして作る。
3. 人が触り比べて、1つ選ぶ。
4. 選んだ値を `tuning.ts` に反映し、コミットする。
5. 次の違和感へ進む。

```text
「上がるのが遅くて重い」という指摘に対する案を、3つのプリセット（A/B/C）として tuning に追加してください。
- A: jumpTime を0.50、B: 0.45、C: 0.40。jumpHeight は3.2のまま。
- キーの1、2、3でプリセットを切り替えられるようにする。
- 切り替え時に、今のプリセット名を画面の隅に表示する。
- どのプリセットでも、ジャンプの最高点が3.1〜3.3マスに収まることを確認するテストを書く。
```

最後のテストは、手触りを変えても、ジャンプの高さのような基本の性質が壊れないための保険です。ステージが「ジャンプで届く高さ」で作られている場合、高さが変わるとゲームが進行不能になります。[検証ループ](/agent-dev/verification-loop/) のボットと組み合わせると、調整のあとに進行不能になっていないかも確認できます。

自分の手に馴染んだ値が、他の人にも心地よいとは限りません。[プレイテスト](/design/playtesting/) で、他の人の反応も見てください。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [The Art of Screenshake（Jan Willem Nijman, Vlambeer, INDIGO Classes 2013）](https://www.youtube.com/watch?v=AJdEqssNZ-U) — 演出を1つずつ足して手触りを変える講演の動画
- [The Art Of Screenshake（Internet Archive）](https://archive.org/details/the-art-of-screenshake) — 講演の対話式の資料
- [Juice It or Lose It（GDC Europe 2012）](https://www.gdcvault.com/play/1016487/juice-it-or-lose) — Martin Jonasson と Petri Purho の講演
- [Video: Indies, resist the urge to 'juice it or lose it'（Game Developer）](https://www.gamedeveloper.com/design/video-indies-resist-the-urge-to-juice-it-or-lose-it-) — ジュースの偏重に注意を促す講演（GDC Europe 2014）
- [lil-gui](https://lil-gui.georgealways.com/) — スライダー式のデバッグUIライブラリ
- [PerformanceEventTiming（MDN）](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming) — 入力イベントの遅延を測るAPI
- [Vision（Claude API Docs）](https://platform.claude.com/docs/en/build-with-claude/vision) — 画像の入力、GIF の扱い、解像度の上限
- [FFmpeg Filters Documentation](https://ffmpeg.org/ffmpeg-filters.html) — `fps` と `tile` フィルタ
- [Videos（Playwright）](https://playwright.dev/docs/videos) — `recordVideo` による録画
- [Creating movies（Godot Docs）](https://docs.godotengine.org/en/stable/tutorials/animation/creating_movies.html) — `--write-movie` による録画
