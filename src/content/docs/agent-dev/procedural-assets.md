---
title: コードでアセットを作る：手続き生成
description: 画像・3Dモデル・音を外部ファイルなしでコードから作る手続き生成の方法を、動かせるJavaScriptの例とともに解説し、生成AIとの使い分けと限界を整理します。
sidebar:
  order: 12
lastUpdated: 2026-09-29
---

## 概要

手続き生成とは、画像、3Dモデル、音を、ファイルではなくコードで作る方法です。実行時にプログラムがノイズや数式から素材を組み立てるので、画像ファイルも音声ファイルも配布物に入りません。
Claude of Duty はこの方法を全面的に使い、すべてのテクスチャ、メッシュ、アニメーション、音を起動時にコードから生成しています。
この記事では、テクスチャ（ノイズ、SVG）、メッシュ、シェーダー、WebAudio による効果音とBGMを、短い動くコードで説明します。外部の生成AIで作る方法との使い分けと、見た目の質の限界も扱います。

コード例は、この記事のために書いたものです。Three.js 0.186.1 と Chromium（ヘッドレス）で動作を確認しています（2026年9月時点）。

## なぜコーディングエージェントと相性がよいか

素材がすべてテキスト（コード）なので、エージェントが読み、書き、差分で確認できます。画像や音のファイルを扱う場合は、生成ツールの操作や、ファイルの取り込みが必要になります。手続き生成なら、次の利点があります。

- 「岩をもう少しごつごつに」を、パラメータの変更として頼める
- 乱数の種を固定すれば、毎回同じ結果になり、スクリーンショットで比較できる
- 配布物が小さく、ロード後にネットワークからの取得が要らない

Claude of Duty の README には、素材の作り方が次のように書かれています（[GitHub](https://github.com/mshumer/Claude-of-Duty)）。

| 素材 | 生成の方法（READMEの記述の要約） |
|---|---|
| 表面のテクスチャ | GPU上で19種類の表面（コンクリート、レンガ、錆びた金属、木、布、ガラスなど）を生成。周期性のあるノイズで継ぎ目なく並ぶ。高さから法線を求め、パララックス（視差）表現も行う |
| 武器や敵のモデル | 形状もコードで組み立てる |
| 空 | 大気散乱と時刻の変化を計算する |
| 音 | WebAudio で合成し、音声ファイルは使わない。銃声は複数の層を重ね、発射のたびに音程や長さを少しずつ変える |

## 使い分け：手続き生成と生成AI

[アセット生成](/dev-env/asset-generation/) で扱う画像・3D・音楽の生成AIと、手続き生成は得意な領域が違います。

| 観点 | 手続き生成（コード） | 生成AIのツール |
|---|---|---|
| 得意な表現 | 幾何学的なもの、繰り返し、ノイズ状の質感、低ポリ、フラットな色面、電子音の効果音 | 手描き風のイラスト、写真的な質感、キャラクター、人の声、生楽器風のBGM |
| 修正のしやすさ | パラメータや式を変えるだけ。再生成しても同じ結果 | 再生成のたびに変わり、絵柄を揃える工夫が要る |
| 容量 | ほぼゼロ | 画像、3D、音声のファイルが増える |
| 品質の上限 | 写実やキャラクターは苦手（後述） | ツールに依存する |
| エージェントとの相性 | コードだけで完結する | ツールの操作（MCPなど）や取り込みが要る |

筆者の整理では、次のような分担がうまくいきます。地面、壁、木、岩、エフェクト、UI、効果音は手続き生成にし、主人公や敵のイラスト、BGM、ボイスは生成AIにする組み合わせです。手続き生成は、仮素材を素早く並べるプロトタイプ用としても使えます。

## テクスチャ

### ノイズから作る

ノイズを何段か重ねる（fBm と呼ばれる手法）と、自然な濃淡ができます。次の関数は、格子状の乱数を補間した value noise を使い、格子が周期的に繰り返すので、並べても継ぎ目が出ません。

```js
import * as THREE from 'three';

// 種つきの乱数（mulberry32）。同じ種なら毎回同じ結果になる
export function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 格子の乱数を補間する value noise。period ごとに繰り返すので、並べても継ぎ目が出ない
export function makeNoise(seed, period) {
  const r = rng(seed);
  const grid = Float32Array.from({ length: period * period }, r);
  const wrap = (i) => ((i % period) + period) % period;
  const at = (x, y) => grid[wrap(y) * period + wrap(x)];
  const smooth = (t) => t * t * (3 - 2 * t);
  return (x, y) => {
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const u = smooth(x - x0), v = smooth(y - y0);
    const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * u;
    const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * u;
    return top + (bottom - top) * v;
  };
}

// コンクリート風のテクスチャ：ノイズを5段重ねて濃淡を作る
export function concreteTexture(size = 256, seed = 1) {
  const octaves = [0, 1, 2, 3, 4].map((i) => makeNoise(seed + i, 4 << i));
  const grain = rng(seed + 99);
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let n = 0, amp = 0.5, total = 0;
      octaves.forEach((noise, i) => {
        const p = 4 << i; // 段ごとに格子を2倍に細かくする
        n += amp * noise((x / size) * p, (y / size) * p);
        total += amp;
        amp *= 0.5;
      });
      const g = 150 + (n / total - 0.5) * 160 + (grain() - 0.5) * 30; // 濃淡＋細かい粒
      const k = (y * size + x) * 4;
      data[k] = g; data[k + 1] = g; data[k + 2] = g * 0.96; data[k + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
```

`concreteTexture(256, 7)` を `MeshStandardMaterial` の `map` と `bumpMap` に渡すと、コンクリートの地面になります。`DataTexture` は、ピクセル配列から直接テクスチャを作るクラスです（[DataTexture](https://threejs.org/docs/pages/DataTexture.html)）。

### SVG から作る

SVG は、図形とフィルターを文字列で書ける画像形式です。ブラウザに `feTurbulence`（ノイズを生成するフィルター）があるので、汚れの表現も SVG だけで書けます（[feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence)）。エージェントにとっては、画像編集ソフトよりも SVG の方が「テキストで修正できる」形です。

```js
// SVG の文字列を画像にして、テクスチャにする（ブラウザ用）
export async function svgTexture(svgText, size = 256) {
  const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' }));
  const img = new Image();
  img.src = url;
  await img.decode();
  const canvas = Object.assign(document.createElement('canvas'), { width: size, height: size });
  canvas.getContext('2d').drawImage(img, 0, 0, size, size);
  URL.revokeObjectURL(url);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// レンガ壁。SVG のノイズフィルタ（feTurbulence）で汚れを付ける
export const brickSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
  <filter id="grime"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" seed="3"/>
    <feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.05  0 0 0 0 0.05  0 0 0 0.7 0"/></filter>
  <rect width="256" height="256" fill="#9a4f3c"/>
  <g stroke="#cfc8bb" stroke-width="5">
    <path d="M0 64H256M0 128H256M0 192H256M0 0H256"/>
    <path d="M64 0V64M192 0V64M0 64V128M128 64V128M256 64V128M64 128V192M192 128V192M0 192V256M128 192V256"/>
  </g>
  <rect width="256" height="256" filter="url(#grime)"/>
</svg>`;
```

## メッシュ

3Dモデルは、頂点の座標と面の並びをコードで作れば、外部のモデルファイルが要りません。既存の基本形（円柱、円錐、正二十面体）を変形して組み合わせるのが近道です。

```js
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
// makeNoise と rng は、上のノイズの例と同じもの

// 頂点ごとに色を付ける（テクスチャなしで色分けできる）
function paint(geo, color) {
  const c = new THREE.Color(color);
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) c.toArray(arr, i * 3);
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return geo;
}

// 低ポリの木：円柱と円錐を1つのメッシュに結合する
export function makeTree(seed = 1) {
  const r = rng(seed);
  const parts = [paint(new THREE.CylinderGeometry(0.15, 0.22, 1.6, 6).translate(0, 0.8, 0), 0x5a3b22)];
  for (let i = 0; i < 3; i++) {
    const cone = new THREE.ConeGeometry(1.1 - i * 0.25, 1.2, 7).translate(0, 1.7 + i * 0.75, 0);
    parts.push(paint(cone, new THREE.Color().setHSL(0.33, 0.45, 0.22 + r() * 0.08)));
  }
  return mergeGeometries(parts);
}

// 岩：正二十面体の頂点を、位置に応じたノイズで押し引きする
export function makeRock(seed = 1, radius = 1) {
  const noise = makeNoise(seed, 8);
  const geo = new THREE.IcosahedronGeometry(radius, 2);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const k = 0.75 + noise(v.x * 1.6 + v.z, v.y * 1.6 + v.z * 0.5) * 0.6;
    v.multiplyScalar(k);
    pos.setXYZ(i, v.x, v.y * 0.7, v.z); // 少し平たくする
  }
  geo.computeVertexNormals();
  return geo;
}
```

木は円柱と円錐を1つのメッシュに結合し、頂点ごとに色を持たせています。岩は正二十面体の頂点を、位置に応じたノイズで押し引きしています。使うときは次のようにします。

```js
const treeMat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true });
for (let i = 0; i < 4; i++) {
  const tree = new THREE.Mesh(makeTree(i + 1), treeMat); // 種を変えると別の木になる
  tree.position.set(i * 1.6, 0, 0);
  scene.add(tree);
}
const rock = new THREE.Mesh(makeRock(10, 0.8), new THREE.MeshStandardMaterial({ color: 0x8a8578, flatShading: true }));
```

## シェーダー

シェーダーは、GPUで動く小さなプログラムです。画素ごとに色を計算できるので、ノイズを画像にせず、毎フレーム計算して動く表面を作れます。溶岩やお水のような流れる質感に向きます（[ShaderMaterial](https://threejs.org/docs/pages/ShaderMaterial.html)）。

```js
// シェーダー：時間で流れる溶岩。ノイズはGLSLで計算するので、テクスチャ画像は要らない
export function lavaMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      varying vec2 vUv; uniform float uTime;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){
        vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
      }
      float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++){ s += a * noise(p); p *= 2.0; a *= 0.5; } return s; }
      void main(){
        vec2 p = vUv * 6.0;
        float n = fbm(p + fbm(p + uTime * 0.2));   // ノイズでノイズを歪ませる
        vec3 col = mix(vec3(0.1, 0.0, 0.0), vec3(1.0, 0.45, 0.05), smoothstep(0.35, 0.75, n));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
}
```

毎フレーム `material.uniforms.uTime.value = clock.getElapsedTime();` で時間を進めると、模様が流れます。

## 音を合成する

WebAudio は、ブラウザに組み込まれた音の合成・再生の仕組みです。発振器（オシレーター）、ノイズ、フィルター、音量の変化（エンベロープ）を組み合わせて、効果音とBGMをコードで作れます（[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)）。

### 効果音

銃声は、1つの音ではなく複数の層の組み合わせです。Claude of Duty のコードのコメントでは、瞬間的なクリック、胸に響く低音の「ボディ」、口径の性格を決める高音の「クラック」、空間に響く「テール」など、7つの層に分けて作られていると説明されています。次の例は、そのうち2層（ボディとクラック）だけの最小版です。

```js
function noiseBuffer(ctx, seconds = 1) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

// 銃声：下降するサイン波（ドスッ）と、バンドパスをかけたノイズ（パーン）を重ねる
export function playShot(ctx, t = ctx.currentTime, dest = ctx.destination) {
  const body = ctx.createOscillator();
  body.frequency.setValueAtTime(220, t);
  body.frequency.exponentialRampToValueAtTime(45, t + 0.12);
  const bodyGain = ctx.createGain();
  bodyGain.gain.setValueAtTime(0.6, t);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  body.connect(bodyGain).connect(dest);
  body.start(t); body.stop(t + 0.2);

  const crack = ctx.createBufferSource();
  crack.buffer = noiseBuffer(ctx, 0.4);
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass'; band.frequency.value = 2400; band.Q.value = 0.9;
  const crackGain = ctx.createGain();
  crackGain.gain.setValueAtTime(0.35, t);
  crackGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
  crack.connect(band).connect(crackGain).connect(dest);
  crack.start(t); crack.stop(t + 0.4);
}

// コイン音：短い2音（高い矩形波）
export function playCoin(ctx, t = ctx.currentTime, dest = ctx.destination) {
  [988, 1319].forEach((freq, i) => {
    const o = ctx.createOscillator();
    o.type = 'square'; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t + i * 0.08);
    g.gain.exponentialRampToValueAtTime(0.25, t + i * 0.08 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.08 + 0.25);
    o.connect(g).connect(dest);
    o.start(t + i * 0.08); o.stop(t + i * 0.08 + 0.3);
  });
}
```

### BGM

BGM は、音符を鳴らす時刻を先に予約する方式で作ります。`setTimeout` の呼び出しはメインスレッドの処理でずれるため、音の開始時刻は `AudioContext` の時計で指定します（[A Tale of Two Clocks](https://web.dev/articles/audio-scheduling)）。

```js
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

// BGM：1小節（4拍）ぶんの音を、時刻 t0 から予約する
export function scheduleBar(ctx, t0, bpm = 100, dest = ctx.destination) {
  const beat = 60 / bpm;
  const bass = [45, 45, 43, 40];               // A, A, G, E
  const arp = [69, 72, 76, 72, 69, 72, 76, 79]; // Am のアルペジオ
  const note = (midi, t, len, type, vol) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = hz(midi);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g).connect(dest);
    o.start(t); o.stop(t + len);
  };
  bass.forEach((m, i) => note(m, t0 + i * beat, beat * 0.9, 'triangle', 0.35));
  arp.forEach((m, i) => note(m, t0 + i * beat / 2, beat * 0.4, 'square', 0.08));
  return t0 + 4 * beat; // 次の小節の開始時刻
}

// 少し先まで予約しながらループする（setTimeout のずれに影響されない）
export function startMusic(ctx, bpm = 100) {
  let next = ctx.currentTime + 0.1;
  const timer = setInterval(() => {
    while (next < ctx.currentTime + 1.0) next = scheduleBar(ctx, next, bpm);
  }, 250);
  return () => clearInterval(timer);
}
```

ブラウザには自動再生の制限があり、`AudioContext` はユーザーの操作（クリックなど）のあとに開始する必要があります（[Web Audio API best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)）。

```js
const ctx = new AudioContext();
addEventListener('pointerdown', () => {
  ctx.resume();
  startMusic(ctx, 100);
  playShot(ctx);
}, { once: true });
```

音を実際に鳴らさずに確認したいときは、`OfflineAudioContext` が使えます。音をメモリ上に描画して、波形の大きさを数値で調べられるので、エージェントが「音が鳴っているか」「割れていないか」を確かめられます（[OfflineAudioContext](https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext)）。

```js
const off = new OfflineAudioContext(1, 44100 * 2, 44100); // 1ch、2秒、44.1kHz
playShot(off, 0);
const data = (await off.startRendering()).getChannelData(0);
const peak = data.reduce((m, v) => Math.max(m, Math.abs(v)), 0); // 1 を超えると音割れ
```

効果音の作り込みを短縮したい場合は、小さな効果音生成ライブラリ（たとえば [ZzFX](https://github.com/KilledByAPixel/ZzFX)）を使う方法もあります。

## 見た目と音の質を上げる工夫、その限界

### 質を上げる工夫

Claude of Duty の設計書には、品質の基準が書かれています。手続き生成で「安っぽさ」を消すための、参考になる観点です。

- 平らで無地の表面を作らない。色のばらつき、法線、粗さ、近くで見える細かい層を持たせる
- 完全に真っ直ぐ、きれい、同じ繰り返しになるものを避ける。端の摩耗、隙間の汚れ、わずかな歪み、配置ごとの回転と大きさの違いを付ける
- 音は同じ波形を繰り返さない。ラウンドロビン（複数の音色を順番に使う）と、毎回の音程・音量・長さのランダムな揺らぎを重ねる

自分のコードに取り込むなら、たとえば次のとおりです。

| 工夫 | 実装の例 |
|---|---|
| 個体差 | 木や岩の種（seed）を配置ごとに変え、大きさと向きもランダムにする |
| 汚れ | 下の方を暗くする頂点カラー、壁の下端に汚れのグラデーション |
| 統一感 | 全素材で同じ色のパレットを使い、ライティングと影で仕上げる |
| 音の揺らぎ | `playShot` の周波数と長さに、毎回±5%のランダムな値を足す |

### 限界

Claude of Duty の作者自身が、README で限界を具体的に挙げています。

- 手が、ブロック状の板のようで、武器を握っているように見えない
- 近くで見ると、表面は写真のような質感ではなく「手続き的なノイズ」に見える。作者は「コードでテクスチャを作ることの上限」と表現している
- 敵は、遠くではマネキンのように見える

つまり、写実的な質感や人型のキャラクターは、手続き生成では届きにくい領域です。筆者の推測では、上で作った低ポリの木や岩のように、様式化された見た目に寄せる方が、コードだけでも破綻しにくいと考えられます。根拠は、上の実行例が低ポリの範囲では十分に成立していることと、README が挙げる限界がすべて写実や人体に関するものであることです。

## エージェントへの頼み方

手続き生成の依頼は、「作るもの」と「確認の方法」をセットで書きます。次の例は、この記事のために書いた依頼文です。

```text
src/assets/ に、外部ファイルを使わずにコードで作る素材の関数を追加してください。
- 木、岩、レンガ壁を、それぞれ seed を受け取る関数にする（同じ seed なら同じ結果）
- 効果音は WebAudio で合成する: 銃声、コイン、爆発の3種
- 色は src/assets/palette.js のパレットだけを使う
- 完了の条件: npm run shot で、素材を並べた見本シーンのスクリーンショットが撮れること
- 撮れたら画像を見て、単調な面、真っ直ぐすぎる線、同じ形の繰り返しを3つ挙げ、直してください
```

スクリーンショットを撮って見返す仕組みは、[検証ループ](/agent-dev/verification-loop/) で説明しています。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Claude-of-Duty（GitHub）](https://github.com/mshumer/Claude-of-Duty) — README と `ARCHITECTURE.md`。素材をすべてコードで生成する構成
- [DataTexture（three.js docs）](https://threejs.org/docs/pages/DataTexture.html) — ピクセル配列からのテクスチャ
- [BufferGeometry（three.js docs）](https://threejs.org/docs/pages/BufferGeometry.html) — 頂点データからのメッシュ
- [ShaderMaterial（three.js docs）](https://threejs.org/docs/pages/ShaderMaterial.html) — 独自のシェーダー
- [feTurbulence（MDN）](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence) — SVGのノイズフィルター
- [Web Audio API（MDN）](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — 音の合成と再生
- [Web Audio API best practices（MDN）](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices) — 自動再生の制限
- [A Tale of Two Clocks（web.dev）](https://web.dev/articles/audio-scheduling) — 音の予約再生
- [OfflineAudioContext（MDN）](https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext) — 音をオフラインで描画して確認する方法
- [ZzFX（GitHub）](https://github.com/KilledByAPixel/ZzFX) — 小さな効果音生成ライブラリ
