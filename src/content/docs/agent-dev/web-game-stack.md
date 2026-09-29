---
title: ブラウザゲームの技術選定：エージェントと相性のよい構成
description: Three.js、Babylon.js、PlayCanvas、Phaser、PixiJS、素のWebGL、GodotやUnityのWeb出力を、コーディングエージェントとの相性、TypeScriptとVite、公開先、性能の目安で比較します。
sidebar:
  order: 15
lastUpdated: 2026-09-29
---

## 概要

ブラウザゲームは、コーディングエージェントで作るのに向いた形式です。コードがすべてテキストで、ビルドが軽く、画面をスクリプトで撮って確かめられるからです。
この記事では、ブラウザ向けの主な選択肢（Three.js、Babylon.js、PlayCanvas、Phaser、PixiJS、素のCanvas／WebGL、Godot と Unity の Web 出力）を、エージェントとの相性で比べます。あわせて、TypeScript か JavaScript か、Vite によるビルド、公開先（itch.io、GitHub Pages、Cloudflare Pages）、性能の見方を説明します。
Claude of Duty は、Three.js r180 と WebGL2 を使い、実行時の依存は `three` だけ、ビルドは Vite、画面の確認は Playwright です（[GitHub](https://github.com/mshumer/Claude-of-Duty)）。この構成を、自分のゲームに合わせて選び直すための記事です。エンジン全般の比較は [ゲームエンジンの比較](/dev-env/engines/) を参照してください。

## 選択肢の比較

バージョンや状況は、2026年9月29日時点です。

| 選択肢 | 版 | ライセンス | 主な用途 | 特徴 |
|---|---|---|---|---|
| Three.js | 0.186.1（r186、2026年9月24日） | MIT | 3D | WebGL と WebGPU の両方のレンダラーを持つ。ゲームエンジンではなく3D描画のライブラリで、入力や物理は自分で組む |
| Babylon.js | 9.28.0（2026年9月24日） | Apache-2.0 | 3D | npm のパッケージが ES6 形式で、使う部分だけをビルドに含められる |
| PlayCanvas（エンジン） | 2.22.6（2026年9月28日） | MIT | 3D | WebGL2 と WebGPU 上に作られたオープンソースのエンジン。エディタは必須ではなく、`npm install playcanvas` で使える |
| Phaser | 4.2.1（2026年7月9日） | MIT | 2D | WebGL と Canvas の両方で描画。JavaScript と TypeScript に対応。公式のエージェント用MCPがある（[AIコーディングツール](/dev-env/ai-coding-tools/)） |
| PixiJS | 8.21.0（2026年9月17日） | MIT | 2D | 2D描画のライブラリ。WebGL と WebGPU に対応。ゲームの枠組み（シーン管理など）は自分で組む |
| 素の Canvas 2D / WebGL2 | ブラウザ標準 | — | 小さな2D、実験 | 依存なし。WebGL 2 は2021年9月から主要なブラウザで使える |
| Godot の Web 出力 | 4.7 | MIT | 2D、軽い3D | WebGL 2 のみ（Compatibility レンダラー）。Godot 4 の C# プロジェクトは Web に出力できない |
| Unity の Web 出力 | Unity 6.3 | Unity のライセンス | 2D、3D | C# のマルチスレッドが使えない。ネットワークは、ブラウザの制限でソケットを直接使えない |

出典: 各リポジトリと npm のページ（[three](https://www.npmjs.com/package/three)、[@babylonjs/core](https://www.npmjs.com/package/@babylonjs/core)、[playcanvas](https://www.npmjs.com/package/playcanvas)、[phaser](https://www.npmjs.com/package/phaser)、[pixi.js](https://www.npmjs.com/package/pixi.js)）、[Godot の Web 出力](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)、[Unity Web の技術的な制限](https://docs.unity3d.com/6000.3/Documentation/Manual/webgl-technical-overview.html)、[WebGL2RenderingContext（MDN）](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext)。

## エージェントとの相性

観点は、エージェントが作業を自分で回せるかどうかです。

| 観点 | Three.js など、コードだけの選択肢 | Godot、Unity の Web 出力 |
|---|---|---|
| テキストで完結するか | すべてがコード。エージェントが読み、書き、差分で確認できる | シーンはテキスト形式だが、エディタでの作業や、公式・コミュニティ製の連携（MCP）に頼る部分がある（[エンジンの比較](/dev-env/engines/)） |
| ビルドが軽いか | Vite の開発サーバーで、保存すると即座に反映される | 書き出しの工程が要る（筆者の推測。エンジンの書き出しを経由するため） |
| ドキュメントと学習データが多いか | 下の表のとおり、Three.js が突出して多い | エンジン固有の言語（GDScript など）が中心 |
| ヘッドレスで検証しやすいか | Playwright でブラウザを操作し、スクリーンショットとエラーを取れる | 最終の Web 出力を、同じようにブラウザで検証する |

ドキュメントと学習データの量は、直接は測れません。目安として、npm の1週間のダウンロード数（2026年9月21日〜27日）を並べます。

| パッケージ | 1週間のダウンロード数 |
|---|---|
| three | 約1,961万 |
| pixi.js | 約124万 |
| phaser | 約47万 |
| @babylonjs/core | 約42万 |
| playcanvas | 約12万 |

出典: [npm の公開API](https://api.npmjs.org/downloads/point/last-week/three)。ビルドの自動実行や、他のライブラリからの間接的な取得も含む数字です。ただ、Three.js が桁違いに多いことは、記事や質疑、サンプルが多く、エージェントの学習データにも多く含まれる可能性が高いことの根拠になります（推測）。

Vite には、エージェントとの相性を意識した機能があります。開発サーバーの `server.forwardConsole` は、AI のコーディングエージェントを検出すると、ブラウザの未処理の例外と `console.error`・`console.warn` を、自動で開発サーバーのログに転送します（[Server Options](https://vite.dev/config/server-options)）。ブラウザを開かなくても、エージェントが実行時のエラーを読めます。

## TypeScript か JavaScript か

| | JavaScript | TypeScript |
|---|---|---|
| 手軽さ | 設定が要らない。Claude of Duty は JavaScript（`.js`） | `tsconfig.json` と型の記述が要る |
| エージェントへの効果 | 実行するまで型の誤りが分からない | 型のエラーが、実行前にコンパイラから返る。修正の手がかりになる |

Claude Code の公式ドキュメントには、型のある言語の「コードインテリジェンス」のプラグインを入れると、編集のたびに型エラーが自動で報告され、コンパイラを実行せずに誤りを見つけられるという説明があります（[Manage costs effectively](https://code.claude.com/docs/en/costs)）。

筆者のおすすめは、新しく始めるなら TypeScript です。ただし、Vite は TypeScript を JavaScript に変換するだけで、型の検査はしません。検査は `tsc --noEmit` で別に行うと、公式のドキュメントにあります（[Features（Vite）](https://vite.dev/guide/features)）。このコマンドをビルドの前に入れておきます。

## Vite でのビルド

Vite の最新版は 8.3.1 で、Rolldown を使ってビルドします。Node.js は 20.19 以上、または 22.12 以上が必要です（[Getting Started](https://vite.dev/guide/)）。

```bash
npm create vite@latest my-game -- --template vanilla-ts
cd my-game
npm install three
npm install -D @types/three playwright
```

`package.json` の `scripts` には、エージェントが自分で確認できるコマンドを揃えます（この記事のために書いた例です）。

```json
{
  "scripts": {
    "dev": "vite",
    "typecheck": "tsc --noEmit",
    "build": "npm run typecheck && vite build",
    "preview": "vite preview",
    "test": "node --test",
    "shot": "node tools/capture.mjs"
  }
}
```

指示ファイルには、「変更後は `npm run build` と `npm test` を実行し、結果を報告する」と書きます（[プロジェクト指示ファイル](/agent-dev/project-instructions/)）。

itch.io は相対パスを要求し、GitHub Pages のプロジェクトサイトは `/リポジトリ名/` の下で配信されます。どちらでも動くように、`vite.config.ts` の `base` を相対にします。

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
});
```

### 画面を撮るスクリプト

エージェントが画面を確認する最小のスクリプトです。ゲーム側で、最初のフレームを描いたら `window.__READY__ = true` にし、乱数の種を URL の `?seed=` で固定しておきます。Claude of Duty の撮影ツールも、同じ方式（準備完了の目印を待ってから撮る）です。

```js
// tools/capture.mjs — 使い方: node tools/capture.mjs shots/latest.png
import { chromium } from 'playwright';

const out = process.argv[2] ?? 'shots/latest.png';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

await page.goto('http://127.0.0.1:5173/?seed=1&capture=1');
await page.waitForFunction('window.__READY__ === true', null, { timeout: 60_000 });
await page.screenshot({ path: out });
await browser.close();

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('saved', out);
```

Claude of Duty の撮影ツールは、GPU を使うヘッドレスの Chromium で撮っています。GPU のない環境では、ソフトウェアで描画されるので遅くなります（推測）。撮影の考え方は [検証ループ](/agent-dev/verification-loop/) を参照してください。

## 公開先

| 公開先 | 制限（2026年9月時点） | 向く用途 |
|---|---|---|
| itch.io の HTML5 | ZIP に `index.html` が必要。展開後に1,000ファイルまで、合計500MBまで、1ファイル200MBまで。相対パスが必須 | ゲームの公開、ゲームジャムの提出 |
| GitHub Pages | サイトは1GBまで。帯域は月100GBの目安（ソフトな制限）。オンラインで事業を営むための無料ホスティングとしての利用は認められていない | プロトタイプ、デモ、ポートフォリオ |
| Cloudflare Pages | 無料プランで1サイト20,000ファイルまで、1ファイル25MiBまで、ビルドは月500回まで | 自分のドメインでの公開 |

出典: [itch.io の HTML5 のドキュメント](https://itch.io/docs/creators/html5)、[GitHub Pages の制限](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)、[Cloudflare Pages の制限](https://developers.cloudflare.com/pages/platform/limits/)。Vite は、GitHub Pages と Cloudflare Pages への公開手順を用意しています（[Deploying a Static Site](https://vite.dev/guide/static-deploy)）。

Godot の Web 出力は、スレッドを有効にする場合、サーバーが `Cross-Origin-Opener-Policy: same-origin` と `Cross-Origin-Embedder-Policy: require-corp` のヘッダーを返す必要があります。ヘッダーを指定できない公開先では、Progressive Web App の設定（サービスワーカーによる回避策）を使う方法があります（[Godot の Web 出力](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)）。

公開先の選び方と収益化は [プラットフォームの選び方](/monetization/platforms/) を参照してください。

## 性能の目安

Claude of Duty の README には、実測が載っています（Apple silicon のノートPC、解像度 1512×982、DPR 2、最高品質、AI と射撃が動く実際のプレイ）。

| | 最適化の前 | 最適化の後 |
|---|---|---|
| fps（中央値） | 12〜17 | 28〜30 |
| fps（p99、最悪の1%） | 4〜9 | 14〜17 |
| 最悪のフレーム | 728〜1,236ミリ秒 | 66〜82ミリ秒 |
| プレイ中のシェーダーのコンパイル | 34〜35回 | 0回 |
| 起動時間 | 約9〜12秒 | 3.7〜4.6秒 |

これは「AAA 級を目指した重い3D」の例で、標準的なゲームの目標ではありません。ここから、目安にできる点を挙げます。

- **中央値ではなく p99 を測る**: 静止したカメラで94fps と出ても、実際は遊べない状態でした。測り方は [よくある失敗と対策](/agent-dev/failure-patterns/) にコードを載せています
- **実機に近い解像度で測る**: 高解像度のディスプレイ（DPR 2以上）では、内部の描画解像度が上がります。Three.js では `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` のように上限を決められます（[WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html)）
- **同じ形の物は `InstancedMesh` にまとめる**: 木や岩のように、同じメッシュを大量に置くときに使う（[InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html)）
- **シェーダーを先にコンパイルする**: 最初のフレームの前に、使う素材をすべて描画しておく
- **描画は WebGL に、WebGPU は選択肢の1つとして**: WebGPU は、MDN によれば、広く使われているブラウザのすべてで動くわけではない機能（Baseline ではない）で、HTTPS でのみ使えます。Three.js は両方のレンダラーを持つので、WebGL で始め、後から切り替えられます

性能の予算は、設計書に書いておきます。手順は [サブエージェントと並列開発](/agent-dev/parallel-agents/) を参照してください。

## 事例で使われた構成

ポン出しの事例では、Three.js が多く使われています。次は、Claude of Duty（リポジトリで確認できる内容）と、explainx.ai の一覧記事（二次情報）に基づく例です。

| 事例 | 構成 |
|---|---|
| Claude of Duty（Matt Shumer 氏） | Three.js r180、WebGL2、Vite、JavaScript |
| Homeworld 風のRTS（@mikeluan123） | Three.js（作者の説明。TypeScript との報告もある） |
| 砂漠の探索ゲーム | Babylon.js と WebGPU。約14時間、約500万トークンと報告されている |

出典: [Top 10 Claude Opus 5 Game Prompts（explainx.ai）](https://www.explainx.ai/blog/claude-opus-5-top-10-game-prompts-july-2026)。事例ごとの詳細は [Claude of Duty の事例](/cases/claude-of-duty/) と [モデル別のプロンプトと成果](/cases/prompts-by-model/) を参照してください。

## 選び方の目安

| 作りたいもの | 目安 |
|---|---|
| 一人称や三人称の3Dゲーム、ポン出しの実験 | Three.js。情報が多く、Claude of Duty も同じ。物理などは自分で足す |
| 3Dで、エディタとエンジンの機能もほしい | PlayCanvas か Babylon.js |
| 2Dアクション、パズル | Phaser（ゲームの枠組みつき）。描画だけでよければ PixiJS |
| 小さな2Dの実験、ゲームジャム | 素の Canvas 2D と Vite |
| 既存のエディタの作業を活かしたい | Godot か Unity。ただし Web 出力の制限を確認する |

ジャンルごとの向き不向きは [AIと相性のよいジャンル](/genres/ai-friendly/) を参照してください。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Claude-of-Duty（GitHub）](https://github.com/mshumer/Claude-of-Duty) — Three.js r180、WebGL2、Vite の構成と性能の実測
- [three.js（GitHub）](https://github.com/mrdoob/three.js) — WebGL と WebGPU のレンダラー
- [Babylon.js（GitHub）](https://github.com/BabylonJS/Babylon.js) — npm の ES6 パッケージ
- [PlayCanvas Engine（GitHub）](https://github.com/playcanvas/engine) — WebGL2 と WebGPU のオープンソースエンジン
- [Phaser（GitHub）](https://github.com/phaserjs/phaser) — 2Dのゲームフレームワーク
- [PixiJS（GitHub）](https://github.com/pixijs/pixijs) — 2D描画のライブラリ
- [three（npm）](https://www.npmjs.com/package/three) — 最新版とライセンス
- [Vite: Getting Started](https://vite.dev/guide/) — Vite 8.3.1、Node.js の要件、コマンド
- [Vite: Features](https://vite.dev/guide/features) — TypeScript は変換のみで、型検査は別に行う
- [Vite: Server Options](https://vite.dev/config/server-options) — `server.forwardConsole` と `strictPort`
- [Vite: Deploying a Static Site](https://vite.dev/guide/static-deploy) — GitHub Pages と Cloudflare Pages
- [Exporting for the Web（Godot Docs）](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html) — Godot の Web 出力の制限
- [Web technical overview（Unity Manual）](https://docs.unity3d.com/6000.3/Documentation/Manual/webgl-technical-overview.html) — Unity Web の制限
- [WebGPU API（MDN）](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) — WebGPU の対応状況
- [WebGL2RenderingContext（MDN）](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext) — WebGL 2 の対応状況
- [HTML5 games（itch.io）](https://itch.io/docs/creators/html5) — HTML5 ゲームのアップロード要件
- [GitHub Pages limits（GitHub Docs）](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) — サイトの容量、帯域、用途の制限
- [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/) — ファイル数、ファイルサイズ、ビルド回数
- [Playwright: Screenshots](https://playwright.dev/docs/screenshots) — スクリーンショットの取得
- [Top 10 Claude Opus 5 Game Prompts（explainx.ai）](https://www.explainx.ai/blog/claude-opus-5-top-10-game-prompts-july-2026) — ポン出しの事例の構成（二次情報）
