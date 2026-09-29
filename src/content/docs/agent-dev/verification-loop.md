---
title: 検証ループ：エージェントに動作確認をさせる
description: ヘッドレス実行、Playwright のスクリーンショット、window.__game による状態の公開、seed 固定、ボット、FPS計測、批評役のループまで、エージェントが自分で確認できる仕組みの作り方を、動くコード例つきで説明します。
sidebar:
  order: 9
lastUpdated: 2026-09-29
---

## 概要

- エージェントは、確認する手段を渡されないと、「動いたように見える」時点で作業を止めます。ゲームは画面と操作と乱数が絡むため、人が毎回遊んで確かめると、人が検証ループの一部になってしまいます。
- この記事では、エージェントが自分で確認できる仕組みを、ヘッドレス実行、自動テスト、ブラウザの自動操作とスクリーンショット、ゲーム状態の公開、seed の固定、プレイヤー役のボット、性能計測、参照画像との比較の順に作ります。
- 具体例として、Claude of Duty が使った計測ツール群と、実際の Call of Duty と見比べる批評役のループを取り上げます。
- コード例は、このWikiのために書いたものです。状態の取得、入力の注入、seed を固定した再現、フレーム時間の集計は、小さな2Dゲームを相手に Playwright で実行して動作を確かめています。

## なぜ検証の仕組みが要るか

Claude Code の公式ガイドは、テスト、ビルド、スクリーンショットの比較など、エージェントが実行して合否を読める確認手段を渡すことが、最も効果の大きい工夫の1つだと説明しています。確認手段がないと、エージェントにとっての判定基準は「完成したように見える」ことだけになり、間違いに気づくのは人の役目になります（[Best practices](https://code.claude.com/docs/en/best-practices)、2026年9月時点）。

同じガイドは、成功したと言わせるのではなく、テスト出力、実行したコマンドとその結果、スクリーンショットなどの証拠を出させることも勧めています。証拠を見る方が、自分で再実行するより速いためです。

## 検証手段の段階

| 段階 | 手段 | 見つかるもの | 作る手間 |
|---|---|---|---|
| 1 | ビルド、型チェック、リント | 文法と型の誤り | ほぼなし |
| 2 | ユニットテスト（数式、状態遷移） | ロジックの誤り | 小 |
| 3 | ヘッドレスでの起動確認 | 起動時のクラッシュ、例外 | 小 |
| 4 | ブラウザの自動操作とスクリーンショット | 画面の欠け、真っ黒、UIのはみ出し | 中 |
| 5 | ゲーム状態の公開 | 「動いたが状態がおかしい」 | 中 |
| 6 | プレイヤー役のボット | 進行不能、NaN、想定外の死亡 | 中 |
| 7 | FPS・メモリの計測 | ひっかかり、メモリの増加 | 中 |
| 8 | 参照画像との比較（批評役） | 見た目の品質の差 | 大 |

上から順に足していきます。1〜3は既存のツールですぐ使えます。4以降は、ゲーム側に少し手を入れる必要があります。

## 事例: Claude of Duty の検証ツール群

Claude of Duty は、約5.5万行、11のサブシステムから成る Three.js の FPS です。画像・音声のアセットを使わず、すべてコードから生成しています。リポジトリの `tools/` には、検証用のスクリプトが入っています（[README](https://github.com/mshumer/Claude-of-Duty)、2026年9月時点）。

| ツール | 役割 |
|---|---|
| `capture.mjs` | GPU 付きのヘッドレス Chromium で、名前を付けた場面を1枚撮る |
| `baseline.mjs` | 11の場面を、場面ごとに新しいページで撮り、実行のたびに完全に同じ画像になるようにする |
| `imagediff.mjs` | 2枚の画像を1ピクセルずつ比べ、1つでも違えば非ゼロで終了する |
| `profile.mjs` | 実際のプレイ中のフレーム時間を p50・p95・p99 で出し、ひっかかりの原因を突き止める |
| `playtest.mjs` | 移動と射撃を自動で行う簡単な動作確認 |

これらのスクリプトのソースを読むと、ゲーム側が外から操作できる口を持っていることが分かります。`window.__READY__`（起動完了）、`window.__ENGINE__`（エンジンの内部）、`window.__APPLY_SHOT__(name)`（名前付きの場面を再現する）が公開されており、撮影のスクリプトはそれらを使って場面を再現し、一定のフレーム数を進めてから撮影します。

この事例から学べる点が3つあります。

- <strong>撮る条件を固定する</strong>。1つのページで11枚を続けて撮ると、パーティクルの経過時間や露出の状態が引き継がれ、同じ操作でも11枚中10枚が違いました。そこで場面ごとに新しいページを立て、時間の進みを固定して、完全に同じ画像を得ています。時間を `performance.now()` で読んでいたサブシステムは、エンジンの時計を使うように直されました。
- <strong>画像の差分を「合否」にする</strong>。性能改善の作業では、見た目を変えないことを、コードのアサーションではなく `imagediff.mjs` の差分ゼロで保証しています。最適化でフレームレートは12〜17fpsから28〜30fpsに上がり、11場面の画像は最適化の前後で同一でした。
- <strong>平均ではなく分布を見る</strong>。カメラを動かさない計測では94fpsと出ながら、実際のプレイでは操作できない状態でした。原因は、34個以上のシェーダーがプレイ中に遅れてコンパイルされ、最悪で700〜1,200msのフレームが出ていたことです。フレームごとの WebGL プログラム数を数えて原因を特定し、事前にコンパイルしておく処理で0にしています。

## 手順1: ゲーム状態を外から読めるようにする

画面のピクセルだけでは、「プレイヤーが動いたか」「敵が何体いるか」は分かりません。デバッグ用の口を、`?debug=1` のときだけ公開します。

```ts
// src/debug-hooks.ts
import type { WebGLRenderer } from 'three';
import type { Game } from './game';

export interface Snapshot {
  frame: number;
  seed: number;
  player: { x: number; y: number; hp: number };
  enemies: { x: number; y: number }[];
  score: number;
}

export interface DebugApi {
  snapshot(): Snapshot;
  /** 固定刻み（1/60秒）でフレームを進め、最後に1回だけ描画する */
  step(frames: number): void;
  setInput(input: { moveX?: number; moveY?: number; fire?: boolean }): void;
  renderStats(): { calls: number; triangles: number; geometries: number; textures: number; programs: number };
}

declare global {
  interface Window {
    __READY__?: boolean;
    __game?: DebugApi;
  }
}

const FIXED_DT = 1 / 60;

export function installDebugHooks(game: Game, renderer: WebGLRenderer): void {
  if (!new URLSearchParams(location.search).has('debug')) return;
  window.__game = {
    snapshot: () => game.snapshot(),
    step(frames) {
      for (let i = 0; i < frames; i++) game.update(FIXED_DT);
      game.render();
    },
    setInput: (input) => game.setInput(input),
    renderStats: () => ({
      calls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
      geometries: renderer.info.memory.geometries,
      textures: renderer.info.memory.textures,
      programs: renderer.info.programs?.length ?? 0,
    }),
  };
  window.__READY__ = true; // 初回の描画まで終わったら立てる
}
```

`renderer.info` は Three.js が持つ描画の統計です。描画呼び出し数、三角形数、ジオメトリとテクスチャの数、使用中のシェーダープログラムの一覧が入っています（[WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html)、2026年9月時点）。`render.calls` などは描画のたびにリセットされるため、`step()` が最後に描画した直後に読みます。

## 手順2: 乱数の seed と固定刻み

検証が毎回違う結果になると、失敗の原因が分からなくなります。次の2つで揃えます。

- 乱数は `Math.random()` を使わず、seed を渡せる関数にします。次の関数は小さな疑似乱数で、同じ seed なら同じ列を返します。

```ts
// src/rng.ts
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

- 時間は、実時間ではなくゲーム内のフレーム数から進めます。手順1の `step()` が、その仕組みです。`?lockstep=1` のときは、ゲーム自身の `requestAnimationFrame` ループを止め、外からの `step()` でだけ進めます。

これで、同じ seed で同じフレーム数を進めれば、同じ状態と同じ画像になります。Godot では `RandomNumberGenerator` の `seed` に同じ値を設定すると再現できる列になります（[RandomNumberGenerator](https://docs.godotengine.org/en/stable/classes/class_randomnumbergenerator.html)）。

Playwright には、`Date`、`setTimeout`、`requestAnimationFrame`、`performance` などの時間を手動で進める `page.clock` もあります（[Clock](https://playwright.dev/docs/clock)）。既存のゲームを改造せずに時間を制御したい場合の選択肢です。

## 手順3: Playwright で起動、操作、スクリーンショット

準備は次のとおりです。

```bash
npm i -D playwright pngjs pixelmatch
npx playwright install chromium
```

検証のスクリプトは、ゲームを起動し、状態を読み、スクリーンショットを撮り、失敗があれば非ゼロで終了します。

```js
// tools/verify.mjs（npm run verify で実行）
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.GAME_URL ?? 'http://127.0.0.1:5173/';
const url = (query) => `${BASE}?${query}`;

mkdirSync('shots', { recursive: true });
const failures = [];
const errors = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

const browser = await chromium.launch({
  headless: true,
  args: ['--ignore-gpu-blocklist', '--force-color-profile=srgb'],
});
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    // favicon が無いだけの 404 は除く
    if (m.type() === 'error' && !m.location().url.endsWith('/favicon.ico')) errors.push(m.text());
  });

  async function boot() {
    await page.goto(url('debug=1&seed=42&lockstep=1'));
    await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 60_000 });
  }

  // 1. 起動して2秒進め、開始直後の画面を撮る
  await boot();
  await page.evaluate(() => window.__game.step(120));
  await page.screenshot({ path: 'shots/start.png' });
  const s0 = await page.evaluate(() => window.__game.snapshot());

  // 2. 入力を注入して、1秒後に右へ動いていることを確かめる
  await page.evaluate(() => window.__game.setInput({ moveX: 1 }));
  await page.evaluate(() => window.__game.step(60));
  const s1 = await page.evaluate(() => window.__game.snapshot());
  check(s1.player.x > s0.player.x + 10, 'プレイヤーが右に動いていない');

  // 3. 60秒分をボットに遊ばせる（手順4）
  const bot = await page.evaluate((totalFrames) => {
    const g = window.__game;
    let minHp = Infinity;
    for (let f = 0; f < totalFrames; f += 6) {
      const s = g.snapshot();
      minHp = Math.min(minHp, s.player.hp);
      // 一番近い敵から逃げる方向へ動き、撃ち続ける
      let dx = 0, dy = 0, best = Infinity;
      for (const e of s.enemies) {
        const d = Math.hypot(e.x - s.player.x, e.y - s.player.y);
        if (d < best) { best = d; dx = s.player.x - e.x; dy = s.player.y - e.y; }
      }
      const len = Math.hypot(dx, dy) || 1;
      g.setInput({ moveX: dx / len, moveY: dy / len, fire: true });
      g.step(6); // 0.1秒ごとに判断する
    }
    return { minHp, last: g.snapshot() };
  }, 3600);
  await page.screenshot({ path: 'shots/after-bot.png' });
  check(Number.isFinite(bot.last.player.x) && Number.isFinite(bot.last.player.y), 'プレイヤー座標が NaN');

  // 4. 同じ seed でやり直して、同じ状態になること（決定性）を確かめる
  await boot();
  await page.evaluate(() => window.__game.step(120));
  const again = await page.evaluate(() => window.__game.snapshot());
  check(JSON.stringify(again) === JSON.stringify(s0), 'seed が同じでも状態が一致しない');

  check(errors.length === 0, `コンソールのエラーが ${errors.length} 件`);
  writeFileSync('shots/report.json', JSON.stringify({ failures, errors, minHp: bot.minHp, last: bot.last }, null, 2));
} finally {
  await browser.close();
}

if (failures.length > 0) {
  console.error('検証に失敗しました:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log('検証に成功しました（shots/ にスクリーンショットを保存）');
```

`page.screenshot({ path })` は、`fullPage` や切り出しの範囲も指定できます（[Screenshots](https://playwright.dev/docs/screenshots)）。`page.waitForFunction` で `window.__READY__` を待つのは、ゲームの読み込みが終わる前に操作してしまう失敗を防ぐためです。`chromium.launch` の `args` はブラウザに渡すオプションで、Playwright の公式ドキュメントは、独自の指定が動作を壊すことがあると注意しています（[BrowserType](https://playwright.dev/docs/api/class-browsertype)）。

ここまでのエージェント側の頼み方は、次のとおりです。

```text
npm run verify を実行し、失敗したらログとスクリーンショット（shots/*.png）を見て原因を直し、通るまで繰り返してください。
最後に、shots/start.png と shots/after-bot.png を見て、UIの欠け、はみ出し、真っ暗な領域がないか報告してください。
```

### ボットの作り方

上のコードのボットは、逃げながら撃つだけの単純な方針です。それでも、次の問題を見つけるのに役立ちます。

- 数十秒で進行不能になる、または座標や体力が NaN になる
- 敵が増え続けて、処理が破綻する
- ボットが一度も死なない、または常に開始直後に死ぬ（難しさの極端な偏り）

方針を差し替えれば、別の観点のテストになります。壁に向かって動き続ける「壁押しボット」、入力をランダムに連打する「連打ボット」などです。難易度の調整には、ボットの結果を集計して勝率を出します（[バランス調整](/design/balancing/)）。

## 手順4: FPS とメモリの計測

平均のfpsだけでは、ひっかかりが見えません。Claude of Duty の事例のとおり、フレーム時間の分布と最悪値を見ます。次のスクリプトは、ロックステップなしで実際の描画ループを回し、`requestAnimationFrame` の間隔を集計します。

```js
// tools/perf.mjs（npm run perf で実行）
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto((process.env.GAME_URL ?? 'http://127.0.0.1:5173/') + '?debug=1&seed=42');
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 60_000 });

const result = await page.evaluate(async (durationMs) => {
  const dts = [];
  let last = performance.now();
  const end = last + durationMs;
  await new Promise((resolve) => {
    function tick(t) {
      dts.push(t - last);
      last = t;
      if (t < end) requestAnimationFrame(tick);
      else resolve();
    }
    requestAnimationFrame(tick);
  });
  dts.splice(0, 60); // 起動直後の60フレームは除く
  dts.sort((a, b) => a - b);
  const q = (p) => dts[Math.min(dts.length - 1, Math.floor(dts.length * p))];
  return {
    frames: dts.length,
    p50: q(0.5),
    p95: q(0.95),
    p99: q(0.99),
    worst: dts[dts.length - 1],
    heapMB: performance.memory ? performance.memory.usedJSHeapSize / 1048576 : null, // Chromium のみ
    render: window.__game.renderStats?.(),
  };
}, 10_000);

console.log(JSON.stringify(result, null, 2));
await browser.close();
```

- `p95` と `worst`（最悪のフレーム）を目標値と比べます。目標は、たとえば p95 が20ms未満、最悪が50ms未満のように決めます。
- ひっかかりの原因がシェーダーのコンパイルかどうかは、`render.programs` が計測中に増えていないかで分かります。Claude of Duty の `profile.mjs` も、ひっかかったフレームで WebGL のプログラム数が増えたかを突き合わせていました。
- `performance.memory` は Chromium だけにある非標準の値で、Claude of Duty の `profile.mjs` もヒープの使用量の確認に使っています。長時間のプレイで増え続けるなら、リークの疑いがあります。
- GPU のない環境では、描画がCPUで行われ、fps が実機と大きく変わります。性能の判断は、実機に近い環境で測った値で行います。GPU を使うためのブラウザの起動オプションの例は [こちらの記事](https://www.createit.com/blog/headless-chrome-testing-webgl-using-playwright/) にあります。

## 手順5: 画像の差分で「見た目を変えていない」を保証する

リファクタリングや性能改善では、見た目が変わらないことを機械的に確認します。Claude of Duty の `imagediff.mjs` と同じ考え方で、pixelmatch を使う例です。

```js
// tools/imagediff.mjs
// 使い方: node tools/imagediff.mjs before.png after.png diff.png
import { readFileSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const [beforePath, afterPath, diffPath] = process.argv.slice(2);
const before = PNG.sync.read(readFileSync(beforePath));
const after = PNG.sync.read(readFileSync(afterPath));
if (before.width !== after.width || before.height !== after.height) {
  console.error('画像のサイズが違います');
  process.exit(2);
}
const diff = new PNG({ width: before.width, height: before.height });
const changed = pixelmatch(before.data, after.data, diff.data, before.width, before.height, { threshold: 0 });
writeFileSync(diffPath, PNG.sync.write(diff));
console.log(`差分のピクセル数: ${changed}`);
process.exit(changed === 0 ? 0 : 1);
```

`pixelmatch` は、異なるピクセルの数を返します。`threshold` は0〜1で、既定値は0.1、0にすると厳密な比較になります（[pixelmatch](https://github.com/mapbox/pixelmatch)）。厳密な比較が意味を持つのは、seed と時間を固定して、毎回同じ画像が出せる場合だけです。テストランナーの Playwright Test を使うなら、`toHaveScreenshot` による比較も選べます。

## 批評役のループ: 参照と見比べて直す

Claude of Duty の元プロンプトは、実際の Call of Duty と見比べて厳しく評価する批評役を置くよう指示していました（[prompt.md](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md)）。README によると、11体の独立した批評役が、生成した画面を Call of Duty を基準に採点しています。採点は、1回目が3.59、2回目が4.14、3回目が4.05、最適化の後が5.05（10点満点）でした。目隠しの比較では、すべての批評役が、すべての回で、本物の Call of Duty の画面を選んでいます。

この事例から、ループの作り方を学べます。

| 要素 | Claude of Duty の例 | 自分のプロジェクトでは |
|---|---|---|
| 参照 | 実際の Call of Duty の画面 | 自分で用意できる参照（過去のビルド、自作の目標画像、使ってよい素材）。README には、参照画像の入手方法は書かれていない |
| 批評役 | 実装とは別の、独立した厳しい評価者 | 実装した会話とは別のサブエージェントに、画像だけを見せる |
| 判定 | 目隠しの比較と、10点満点の採点 | どちらが参照かを当てさせ、項目別に採点させる |
| 直し方 | 指摘の原因が結合した系（トーンマップ、空、間接光）は、1人の担当が順に直す | 見た目の系を複数の担当に分けず、1つのセッションで順番に直す |

README は、複数のエージェントを並列に走らせた3ラウンドでは、欠陥の数が60、47、66と減らなかったのに対し、結合した問題ごとに1人の担当が順に直す方式では、66から26へ減ったと報告しています。トーンマップ、空、間接光は1つの系であり、分担すると互いの前提を壊したためとされています。並列の運用は [複数エージェントの並列運用](/agent-dev/parallel-agents/) を参照してください。

もう1つの学びは、批評役の指摘が、原因を取り違えることがある点です。「武器のテクスチャがない」という指摘が3ラウンド続きましたが、実際はテクスチャがあり、反射が強すぎて見えていませんでした。指摘どおりにアルベド（拡散反射の色）を暗くした並列ラウンドでは、かえって悪化し、修正はその逆でした。批評役の指摘は、症状の報告として受け取り、原因は実験で確かめます。

批評役のプロンプトの例です。

```text
あなたは厳しい批評役です。実装者ではありません。コードは読まず、画像だけで判断してください。
入力: shots/ の現在の画面と、docs/reference/ の目標画像（同じ場面どうしを対にしてある）。
1. 各対を、次の5項目で0〜10点で採点する: 構図、光と影、素材の質感、UIの読みやすさ、動きの気配（ブラー、パーティクル）。
2. 各項目で、目標との差が最も大きい点を1つ、画像上の位置つきで書く。
3. 直すべき順に3件だけ挙げる。好みの問題は挙げない。
4. reports/critic-prev.json の前回の採点と比べ、下がった項目があれば必ず書く。
5. 結果を reports/critic-latest.json に保存する。
```

実装側には、「批評役の指摘を1つ直すたびに `npm run verify` と画像の差分を実行し、採点が前回より下がったら元に戻す」と指示します。

## Claude Code につなぐ

- 1回の依頼の中で、「検証を実行して、通るまで直して」と頼みます。
- セッション全体で続けるなら、`/goal` に条件を書きます。`/goal` は、毎ターンの後に別の小さなモデルが条件を確認し、満たされるまで作業を続けさせます。判定するモデルはコマンドを実行せず、会話に出た内容だけを読むため、「`npm run verify` が終了コード0で終わる」のように、エージェントの出力で示せる条件にします（[Keep Claude working toward a goal](https://code.claude.com/docs/en/goal)）。

```text
/goal npm run verify が終了コード0で終わり、shots/ の画像を見て UI の欠けがないと報告できること。20ターンで止めること。
```

- 決まったチェックを必ず通したいなら、Stop フックで検証スクリプトを実行させ、通るまで終了させない設定にできます（[Hooks guide](https://code.claude.com/docs/en/hooks-guide)）。
- 検証の出力が長い場合は、[サブエージェントに実行させ](/agent-dev/context-management/)、要約だけを受け取ります。
- 実際のブラウザを見せたいときは、`claude --chrome` で Chrome を操作させる方法もあります（Claude in Chrome の拡張機能が必要。[Use Claude Code with Chrome](https://code.claude.com/docs/en/chrome)）。

## エンジン別の手段

### Godot

- `godot --headless` は、画面と音を出さずに起動します。`--quit-after N` で N 回の反復のあとに終了でき、`--check-only` は `--script` と組み合わせて、スクリプトの構文だけを調べて終了します（[Command line tutorial](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html)）。
- `--` のあとに書いた引数は、エンジンに無視され、`OS.get_cmdline_user_args()` で読めます。検証用の起動オプション（seed、フレーム数）の受け渡しに使えます。
- 自動テストは、gdUnit4 のコマンドラインで実行します（[gdUnit4 Command Line Tool](https://godot-gdunit-labs.github.io/gdUnit4/latest/advanced_testing/cmd/)）。
- 動画は `--write-movie 出力.avi`（`--fixed-fps` で固定のフレームレート）で書き出せます。ヘッドレスでは使えず、実時間の録画用でもありません（[Creating movies](https://docs.godotengine.org/en/stable/tutorials/animation/creating_movies.html)）。

```gdscript
# autoload の Verify.gd。godot --headless --path . -- --verify --seed=42 --frames=3600 で実行する
extends Node

var _frames := 0
var _limit := 0

func _ready() -> void:
	var args := OS.get_cmdline_user_args()
	if not args.has("--verify"):
		set_physics_process(false)
		return
	for a in args:
		if a.begins_with("--seed="):
			seed(int(a.get_slice("=", 1)))
		if a.begins_with("--frames="):
			_limit = int(a.get_slice("=", 1))

func _physics_process(_delta: float) -> void:
	_frames += 1
	if _frames >= _limit:
		print(JSON.stringify({"frames": _frames, "score": Game.score}))  # Game はゲーム側の autoload
		get_tree().quit(0)
```

### Unity

- `Unity -runTests -batchmode -projectPath <パス> -testResults <出力先.xml> -testPlatform <EditMode か PlayMode>` で、コマンドラインからテストを実行し、結果を XML に出力できます（[Run tests from the command line](https://docs.unity3d.com/6000.3/Documentation/Manual/test-framework/run-tests-from-command-line.html)）。
- Play Mode のテストでは、コルーチンを使う `[UnityTest]` で、シーンを読み込み、数フレーム進めて状態を確認できます（[Unity Test Framework](https://docs.unity3d.com/Packages/com.unity.test-framework@1.4/manual/index.html)）。
- エージェントには、XML の結果と、失敗したテストの名前を読ませます。

## つまずきやすい点

- スクリーンショットは `step()` の直後に撮る前提です。`step()` の最後で必ず描画しておかないと、1つ前の画面が撮れます。
- ヘッドレスの描画結果は、GPU、ドライバ、OS で変わることがあります。画像の差分は、同じマシンで撮った画像どうしで比べます。
- 検証スクリプト自体が壊れると、エージェントが原因をゲームに探し続けます。検証のスクリプトも、コミットして管理します。
- 手触りや面白さは、この仕組みでは測れません。その部分は [ゲームの手触りをエージェントと詰める](/agent-dev/game-feel/) と、[失敗パターン](/agent-dev/failure-patterns/) を参照してください。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Claude of Duty（GitHub）](https://github.com/mshumer/Claude-of-Duty) — 一発生成のリポジトリ、README の計測結果と批評役の採点
- [Claude of Duty: prompt.md](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md) — 元プロンプト（批評役の指示を含む）
- [Claude of Duty: tools/（GitHub）](https://github.com/mshumer/Claude-of-Duty/tree/main/tools) — `capture.mjs`、`baseline.mjs`、`imagediff.mjs`、`profile.mjs`、`playtest.mjs`
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — エージェントに確認手段を渡す考え方
- [Keep Claude working toward a goal](https://code.claude.com/docs/en/goal) — `/goal` の条件の書き方と評価の仕組み
- [Hooks guide](https://code.claude.com/docs/en/hooks-guide) — Stop フックなどの自動実行
- [Use Claude Code with Chrome](https://code.claude.com/docs/en/chrome) — Chrome の自動操作
- [Screenshots（Playwright）](https://playwright.dev/docs/screenshots) — スクリーンショットの取得
- [Clock（Playwright）](https://playwright.dev/docs/clock) — ページ内の時間の制御
- [BrowserType（Playwright）](https://playwright.dev/docs/api/class-browsertype) — `launch` のオプション
- [WebGLRenderer（three.js docs）](https://threejs.org/docs/pages/WebGLRenderer.html) — `renderer.info`
- [pixelmatch（GitHub）](https://github.com/mapbox/pixelmatch) — 画像の差分ライブラリ
- [Headless Chrome testing WebGL using Playwright（createIT）](https://www.createit.com/blog/headless-chrome-testing-webgl-using-playwright/) — ヘッドレスでの WebGL とGPUの起動オプション（二次情報）
- [Command line tutorial（Godot Docs）](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html) — `--headless`、`--quit-after`、`--check-only`
- [OS（Godot Docs）](https://docs.godotengine.org/en/stable/classes/class_os.html) — `get_cmdline_user_args()`
- [RandomNumberGenerator（Godot Docs）](https://docs.godotengine.org/en/stable/classes/class_randomnumbergenerator.html) — seed による再現
- [Creating movies（Godot Docs）](https://docs.godotengine.org/en/stable/tutorials/animation/creating_movies.html) — `--write-movie`
- [gdUnit4 Command Line Tool](https://godot-gdunit-labs.github.io/gdUnit4/latest/advanced_testing/cmd/) — Godot のテストの実行
- [Run tests from the command line（Unity Manual）](https://docs.unity3d.com/6000.3/Documentation/Manual/test-framework/run-tests-from-command-line.html) — Unity のテストの実行
- [Unity Test Framework](https://docs.unity3d.com/Packages/com.unity.test-framework@1.4/manual/index.html) — Edit Mode と Play Mode のテスト
