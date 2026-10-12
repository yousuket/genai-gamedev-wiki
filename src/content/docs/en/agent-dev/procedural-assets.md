---
title: "Creating Assets with Code: Procedural Generation"
description: Explains how to create images, 3D models, and sound using procedural generation without external files, with working JavaScript examples, and clarifies how to combine it with generative AI and its limitations.
sidebar:
  order: 12
lastUpdated: 2026-09-29
---

## Overview

Procedural generation is a method of creating images, 3D models, and sound using code instead of files. Because the program assembles materials from noise and formulas at runtime, neither image files nor audio files end up in the distribution. Claude of Duty uses this method extensively, generating all textures, meshes, animations, and sound from code at startup.

This article explains textures (noise, SVG), meshes, shaders, and sound effects and background music using WebAudio with short, working code. It also covers how to combine this with external generative AI and the visual quality limits of the approach.

The code examples were written for this article. Functionality has been verified with Three.js 0.186.1 and Chromium (headless) (as of September 2026).

## Why it works well with coding agents

Because all materials are text (code), agents can read, write, and verify them through diffs. When working with image and sound files, you need to operate generation tools or import files. Procedural generation offers these advantages:

- You can request changes like "make the rock a bit rougher" as parameter modifications
- If you fix the random seed, you get the same result every time and can compare via screenshots
- Distribution size is tiny, with no need to fetch from the network after loading

The Claude of Duty README describes how materials are created ([GitHub](https://github.com/mshumer/Claude-of-Duty)):

| Material | Generation method (summarized from README) |
|---|---|
| Surface textures | Generate 19 types of surfaces (concrete, brick, rusted metal, wood, fabric, glass, etc.) on GPU. Repeating noise tiles seamlessly. Normals derived from height for parallax effect |
| Weapon and enemy models | Shape assembled entirely through code |
| Sky | Computed atmospheric scattering and time-of-day changes |
| Sound | Synthesized with WebAudio, no audio files used. Gun shots are multiple layers, pitch and length shift slightly with each shot |

## Comparing procedural generation with generative AI

The generative AI tools covered in [Asset generation](/en/dev-env/asset-generation/) and procedural generation excel in different areas.

| Perspective | Procedural generation (code) | Generative AI tools |
|---|---|---|
| Strong at | Geometric forms, repetition, noisy texture, low poly, flat color planes, electronic sound effects | Hand-drawn illustration style, photorealistic texture, characters, human voice, orchestral-style BGM |
| Ease of revision | Change parameters or formulas only. Regenerating produces the same result | Changes every time you regenerate, requires techniques to keep art style consistent |
| File size | Essentially zero | Image, 3D, and audio files increase the size |
| Quality ceiling | Photography and characters are difficult (see below) | Depends on the tool |
| Compatibility with agents | Complete using only code | Tool operation (MCP, etc.) and file import needed |

From the author's experience, this division of labor works well: ground, walls, trees, rocks, effects, UI, and sound effects through procedural generation, with main character and enemy illustrations, BGM, and voiceover from generative AI. Procedural generation can also serve as a quick way to lay down placeholder assets for prototyping.

## Textures

### Creating from noise

Layering noise (a technique called fBm) produces natural tonal variation. The following function uses value noise interpolated from a grid of random numbers. Because the grid repeats periodically, it tiles seamlessly.

```js
import * as THREE from 'three';

// Seeded random number (mulberry32). Same seed produces same result every time
export function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Value noise interpolating grid random numbers. Repeats every period, so tiling is seamless
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

// Concrete-like texture: stack 5 layers of noise to create tonal variation
export function concreteTexture(size = 256, seed = 1) {
  const octaves = [0, 1, 2, 3, 4].map((i) => makeNoise(seed + i, 4 << i));
  const grain = rng(seed + 99);
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let n = 0, amp = 0.5, total = 0;
      octaves.forEach((noise, i) => {
        const p = 4 << i; // Double grid resolution for each octave
        n += amp * noise((x / size) * p, (y / size) * p);
        total += amp;
        amp *= 0.5;
      });
      const g = 150 + (n / total - 0.5) * 160 + (grain() - 0.5) * 30; // Tonal variation + fine grain
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

Passing `concreteTexture(256, 7)` to `MeshStandardMaterial`'s `map` and `bumpMap` creates a concrete ground. `DataTexture` is a class that creates textures directly from pixel arrays ([DataTexture](https://threejs.org/docs/pages/DataTexture.html)).

### Creating from SVG

SVG is an image format where you can write shapes and filters as strings. Browsers have `feTurbulence` (a filter that generates noise), so you can express dirt entirely in SVG ([feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence)). For agents, SVG is more "editable as text" than image editing software.

```js
// Convert SVG string to image and make it a texture (browser)
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

// Brick wall. SVG noise filter (feTurbulence) for dirt
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

## Meshes

3D models can be created entirely through code by specifying vertex coordinates and face order. A shortcut is to deform and combine existing primitives (cylinders, cones, icosahedrons).

```js
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
// makeNoise and rng are the same as the noise example above

// Color each vertex (color separation without texture)
function paint(geo, color) {
  const c = new THREE.Color(color);
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) c.toArray(arr, i * 3);
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return geo;
}

// Low-poly tree: merge cylinder and cone into one mesh
export function makeTree(seed = 1) {
  const r = rng(seed);
  const parts = [paint(new THREE.CylinderGeometry(0.15, 0.22, 1.6, 6).translate(0, 0.8, 0), 0x5a3b22)];
  for (let i = 0; i < 3; i++) {
    const cone = new THREE.ConeGeometry(1.1 - i * 0.25, 1.2, 7).translate(0, 1.7 + i * 0.75, 0);
    parts.push(paint(cone, new THREE.Color().setHSL(0.33, 0.45, 0.22 + r() * 0.08)));
  }
  return mergeGeometries(parts);
}

// Rock: push and pull vertices of an icosahedron by noise based on position
export function makeRock(seed = 1, radius = 1) {
  const noise = makeNoise(seed, 8);
  const geo = new THREE.IcosahedronGeometry(radius, 2);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const k = 0.75 + noise(v.x * 1.6 + v.z, v.y * 1.6 + v.z * 0.5) * 0.6;
    v.multiplyScalar(k);
    pos.setXYZ(i, v.x, v.y * 0.7, v.z); // Flatten slightly
  }
  geo.computeVertexNormals();
  return geo;
}
```

The tree merges a cylinder and cone into one mesh, with colors per vertex. The rock uses noise to push and pull icosahedron vertices. Use them like this:

```js
const treeMat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true });
for (let i = 0; i < 4; i++) {
  const tree = new THREE.Mesh(makeTree(i + 1), treeMat); // Different seed = different tree
  tree.position.set(i * 1.6, 0, 0);
  scene.add(tree);
}
const rock = new THREE.Mesh(makeRock(10, 0.8), new THREE.MeshStandardMaterial({ color: 0x8a8578, flatShading: true }));
```

## Shaders

Shaders are small programs that run on the GPU. They can compute color per pixel, so you can create flowing surfaces by calculating noise every frame instead of turning it into an image. They work well for effects like lava or flowing water ([ShaderMaterial](https://threejs.org/docs/pages/ShaderMaterial.html)).

```js
// Shader: lava flowing over time. Noise is computed in GLSL, no texture image needed
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
        float n = fbm(p + fbm(p + uTime * 0.2));   // Distort noise with noise
        vec3 col = mix(vec3(0.1, 0.0, 0.0), vec3(1.0, 0.45, 0.05), smoothstep(0.35, 0.75, n));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
}
```

Advance time each frame with `material.uniforms.uTime.value = clock.getElapsedTime();` and the pattern flows.

## Synthesizing sound

Web Audio is the browser's built-in mechanism for sound synthesis and playback. Combine oscillators, noise, filters, and volume envelopes (amplitude shaping) to create sound effects and background music from code ([Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)).

### Sound effects

A gunshot is not a single sound but a combination of multiple layers. Claude of Duty's code comments explain that it is made from 7 layers—an instantaneous click, a low "body" hitting the chest, a high "crack" defining caliber character, and a "tail" echoing in space. The following example is a minimal version with just 2 layers (body and crack).

```js
function noiseBuffer(ctx, seconds = 1) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

// Gunshot: descending sine wave (thump) layered with bandpass-filtered noise (crack)
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

// Coin sound: two quick high square waves
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

### Background music

Background music is created by pre-scheduling when notes should play. Calling `setTimeout` drifts due to main thread processing, so use the `AudioContext` clock to specify start times ([A Tale of Two Clocks](https://web.dev/articles/audio-scheduling)).

```js
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

// Background music: schedule one measure (4 beats) of notes starting at time t0
export function scheduleBar(ctx, t0, bpm = 100, dest = ctx.destination) {
  const beat = 60 / bpm;
  const bass = [45, 45, 43, 40];               // A, A, G, E
  const arp = [69, 72, 76, 72, 69, 72, 76, 79]; // Am arpeggio
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
  return t0 + 4 * beat; // Start time of next measure
}

// Loop by scheduling ahead to avoid setTimeout drift
export function startMusic(ctx, bpm = 100) {
  let next = ctx.currentTime + 0.1;
  const timer = setInterval(() => {
    while (next < ctx.currentTime + 1.0) next = scheduleBar(ctx, next, bpm);
  }, 250);
  return () => clearInterval(timer);
}
```

Browsers restrict autoplay, and `AudioContext` must start after user interaction (like a click) ([Web Audio API best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)).

```js
const ctx = new AudioContext();
addEventListener('pointerdown', () => {
  ctx.resume();
  startMusic(ctx, 100);
  playShot(ctx);
}, { once: true });
```

To verify sound without actually playing it, use `OfflineAudioContext`. It renders audio to memory so you can examine waveform amplitude numerically, letting agents verify "is sound playing" and "is it distorting" ([OfflineAudioContext](https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext)).

```js
const off = new OfflineAudioContext(1, 44100 * 2, 44100); // 1ch, 2 seconds, 44.1kHz
playShot(off, 0);
const data = (await off.startRendering()).getChannelData(0);
const peak = data.reduce((m, v) => Math.max(m, Math.abs(v)), 0); // Over 1 = distortion
```

To shorten sound design, you can use small sound effect libraries like [ZzFX](https://github.com/KilledByAPixel/ZzFX).

## Techniques for improving visual and sound quality, and their limits

### Raising quality

The Claude of Duty design document lists quality standards—a helpful reference for eliminating "cheap" appearance in procedural generation.

- Do not create flat, plain surfaces. Add color variation, normals, roughness, and fine layering visible up close
- Avoid perfectly straight, clean, identical repetition. Add worn edges, grime in cracks, slight distortion, and vary rotation and scale by placement
- Do not repeat the same waveform. Layer round-robin (cycling through different timbres) with random variation in pitch, volume, and length per playback

Incorporating into your own code might look like:

| Technique | Implementation example |
|---|---|
| Individual variation | Vary tree and rock seed by placement, randomize size and rotation |
| Grime | Vertex color darker below, dirt gradient at wall base |
| Cohesion | Use the same color palette across all assets, finish with lighting and shadows |
| Sound variation | Add ±5% random values to gunshot frequency and length each time |

### Limits

The author of Claude of Duty specifically lists limits in the README.

- Hands look like blocky flat boards and do not look like they are gripping a weapon
- Up close, surfaces do not have photorealistic texture but look like "procedural noise." The author calls this "the ceiling of making textures from code"
- Enemies look like mannequins from a distance

In other words, photorealistic texture and human characters are difficult to reach with procedural generation. The author's hypothesis is that styling toward established aesthetics—like the low-poly trees and rocks made above—breaks down less when using code alone. The reasoning is that the working examples stay adequate within the low-poly range, and the README's limits all relate to photorealism and the human form.

## Requesting from agents

Requests for procedural generation pair "what to make" with "how to verify." The following example is a request written for this article.

```text
Add functions in src/assets/ to create materials entirely through code without external files.
- Trees, rocks, and brick walls each as functions taking a seed (same seed = same result)
- Sound effects synthesized with WebAudio: gunshot, coin, explosion—three types
- Colors only from src/assets/palette.js
- Completion condition: npm run shot to screenshot a sample scene with materials arranged
- Once the screenshot is captured, review the image, identify 3 instances of monotone surfaces, straight lines, or repeated shapes, and fix them
```

The system for taking and reviewing screenshots is covered in [Verification loop](/en/agent-dev/verification-loop/).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: First version created.
<!-- AUTO-UPDATE:END -->

## References

- [Claude-of-Duty (GitHub)](https://github.com/mshumer/Claude-of-Duty) — README and `ARCHITECTURE.md`. Architecture where all assets are generated from code
- [DataTexture (three.js docs)](https://threejs.org/docs/pages/DataTexture.html) — Texture from pixel arrays
- [BufferGeometry (three.js docs)](https://threejs.org/docs/pages/BufferGeometry.html) — Mesh from vertex data
- [ShaderMaterial (three.js docs)](https://threejs.org/docs/pages/ShaderMaterial.html) — Custom shaders
- [feTurbulence (MDN)](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence) — SVG noise filter
- [Web Audio API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — Sound synthesis and playback
- [Web Audio API best practices (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices) — Autoplay restrictions
- [A Tale of Two Clocks (web.dev)](https://web.dev/articles/audio-scheduling) — Scheduling sound playback
- [OfflineAudioContext (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext) — Render audio offline for verification
- [ZzFX (GitHub)](https://github.com/KilledByAPixel/ZzFX) — Small sound effect synthesis library
