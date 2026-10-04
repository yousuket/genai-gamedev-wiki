---
title: ゲームエンジンの比較
description: Godot・Unity・Unreal・Phaserなど主要ゲームエンジンを、料金・言語・得意ジャンル・AIコーディングとの相性で比較します。
sidebar:
  order: 1
lastUpdated: 2026-10-05
---

## 概要

ゲームエンジンは、描画・物理・入力・音・ビルドなど、ゲームに共通する機能をまとめた開発基盤です。
この記事では、個人開発でよく候補に上がるエンジンを「料金・ライセンス」「言語」「得意ジャンル」「AIコーディングとの相性」で比較します。
生成AIに多くのコードを書かせる場合は、**プロジェクトのファイルがテキストで読めるか**と<strong>エディタをAIから操作できるか（MCP連携）</strong>が、使い勝手を大きく左右します。

## 基本情報の比較

| エンジン | 最新版（2026年9月時点） | 料金・ライセンス | 主な言語 | 得意分野 |
|---|---|---|---|---|
| Godot | 4.7.2（2026年8月18日） | MIT License。無料・ロイヤリティなし | GDScript、C# | 2D全般、軽量な3D |
| Unity | Unity 6.3 LTS（最新のLTS） | Personalは無料（年間収益・調達額20万ドル以下）。Proは年額2,310ドル/席 | C# | 2D・3D、モバイル、幅広いジャンル |
| Unreal Engine | 5.8（2026年6月） | 生涯総収益100万ドルまで無料。超過分に5%のロイヤリティ | C++、ブループリント | 高品質な3D、アクション、オープンワールド |
| Phaser | 4.2.1（2026年7月9日） | MIT License。無料 | JavaScript、TypeScript | ブラウザ向け2D |
| GameMaker | — | 非商用は無料。商用はProfessional（買い切り99.99ドル）。コンソール出力はEnterprise | GML | 2Dアクション、ドット絵ゲーム |
| Defold | 1.13.1（2026年8月17日） | 独自のDefold License（Apache 2.0派生）。無料・ロイヤリティなし | Lua | 軽量な2D、モバイル、Web |
| Bevy | 0.19（2026年6月19日） | オープンソース（MIT / Apache 2.0） | Rust | コード中心の開発。公式エディタは開発中 |

補足:

- **Unity**: Pro と Enterprise は2026年1月12日から5%値上げされています。Unity 6 以降、Personal でもスプラッシュ画面（起動ロゴ）の表示は任意です（2026年9月時点）。
- **Unreal Engine**: Epic Games Store での売上はロイヤリティの対象外です。また、Epic Games Store で同時または先行発売する「Launch Everywhere with Epic」に登録すると、ロイヤリティ率が3.5%に下がります（2026年9月時点）。UE 5.8 は UE5 の最後のメジャーリリース予定とされ、Epic は UE6 の開発を進めています。
- **Godot**: 配布時に Godot の著作権表示とライセンス文を同梱する必要があります（クレジットに godotengine.org/license へのリンクを載せる方法でも可）。
- **Bevy**: 0.x 系で、リリースのたびに移行ガイドが出る大きめの変更が続いています。0.19 で新しいシーン記法 BSN が入りました。

ライセンスの読み方は [アセット・OSSのライセンス](/legal/licenses/) にまとめています。

## AIコーディングとの相性

AIエージェント（Claude Code など、ファイルを読み書きしコマンドを実行するAI）にとって扱いやすいかどうかを比較します。

| エンジン | シーン・データの形式 | エディタとAIの連携（2026年9月時点） | 注意点 |
|---|---|---|---|
| Godot | `.tscn` はテキスト形式。人が読め、差分管理しやすい | 公式MCPはなし。コミュニティ製のMCPサーバーが複数ある（例: Godot AI、MIT、Godot 4.7以降） | AIが旧版（Godot 3）の書き方を混ぜることがある。バージョンを指示ファイルに書く |
| Unity | シーンやプレハブはYAMLテキスト（新規プロジェクトの既定は Force Text） | 公式の Unity MCP（AI Assistant パッケージに同梱、オープンベータ）。Unity 6.0以降。AIツールβの試用かサブスクリプションが必要 | `.meta` ファイルを必ずコミットする。YAMLは長く、手で読むのは大変 |
| Unreal Engine | 多くのアセットはバイナリ。ブループリントはエディタで編集する前提 | UE 5.8 で実験的なMCPプラグインを搭載。ブループリント、アセット、レベルなどにアクセスできる | C++ のビルドが重い。AIだけで完結させにくい作業が多い |
| Phaser | すべてコード（JS/TS）。Webの知識がそのまま使える | 公式の Phaser Game Agent MCP（クラウド実行、従量課金）。ビジュアルエディタの Phaser Editor もある | ブラウザで動くので、Playwright などWeb向けのテスト手段が使える |
| GameMaker | プロジェクトはGameMaker独自の構成 | 公式のMCP連携は確認できず | GMLはGameMaker専用言語 |
| Defold | プロジェクトファイルはテキスト形式で、Gitで差分を見られる | 公式のMCP連携は確認できず | Lua自体はAIが得意 |
| Bevy | シーンもRustコードで書ける（BSN）。`.bsn` ファイル対応は今後 | 公式エディタ・公式MCPはなし | 変更が速く、AIの知識が古くなりやすい。コンパイラのエラーはAIの修正に役立つ |

### 選び方の目安

- **初めての1本で、2Dの小規模ゲーム**: Godot か Phaser。テキスト中心でAIに任せやすく、費用もかかりません。
- **ブラウザで遊べる形で公開したい**: Phaser。itch.io などにそのまま置けます。
- **3Dやモバイルで、情報量の多さを重視**: Unity。公式MCPがあり、エディタ操作もAIに頼めます。
- **見た目の品質が重要な3D**: Unreal Engine。ただし個人・初心者にはビルドや容量の負担が大きめです。
- **Rustが好きで、コードだけで作りたい**: Bevy。エディタ前提のワークフローは期待しないでください。

規模の決め方は [スコープの決め方](/getting-started/scope/) を参照してください。

## AIの活用ポイント

- **エンジンとバージョンを最初に固定して、AIに伝える**: `CLAUDE.md` などの指示ファイルに「Godot 4.7、GDScript、静的型付け」のように書きます。書き方は [AI駆動の開発ワークフロー](/dev-env/ai-workflow/) を参照してください。
- **テキスト形式のシーンを活かす**: Godot の `.tscn` や Unity の YAML は、AIが直接読んで構造を把握できます。ただし手書きの編集は壊れやすいので、エディタかMCP経由で変更させる方が安全です。
- **MCPは「任せる範囲」を決めて使う**: エディタ操作をAIに任せると速い一方、意図しない変更も起きます。Git で小さくコミットしてから試してください。
- **エンジン選びそのものをAIに相談する**: 作りたいゲームの条件（2D/3D、対応プラットフォーム、予算）を渡して比較表を作らせると、検討が早く進みます。

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-10-02**: カプコンが、RE エンジンを段階的に次世代化する「REX」の基盤技術として、.NET 向けの構造化データエンジン「RE:Dox」を Apache-2.0 で公開。同社は RE Engine を長期的に「AI生成ゲームエンジン」へ進化させる方針も説明している（[出典](https://automaton-media.com/articles/newsjp/20261002-471537/)、[IGN](https://www.ign.com/articles/capcom-announces-plans-to-transform-the-re-engine-into-an-ai-generation-game-engine-our-goal-is-a-future-where-we-create-games-together-with-ai)）
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Godot download archive](https://godotengine.org/download/archive/) — Godot の各バージョンとリリース日
- [Godot License](https://godotengine.org/license/) — Godot の MIT License と表示義務
- [TSCN file format（Godot Docs）](https://docs.godotengine.org/en/stable/engine_details/file_formats/tscn.html) — テキスト形式シーンの仕様
- [Godot AI（GitHub）](https://github.com/hi-godot/godot-ai) — コミュニティ製の Godot 向けMCPサーバー
- [Unity Pricing Changes](https://unity.com/products/pricing-updates) — Unity の各プランと2026年の価格改定
- [Unity 6 Releases & Support](https://unity.com/releases/unity-6/support) — Unity 6 の LTS とサポート期間
- [Unity MCP Server: Connect Claude Code, Cursor, and other AI Agents](https://unity.com/blog/unity-ai-mcp-how-to-get-started) — 公式 Unity MCP の導入手順（2026年5月）
- [Unity AI](https://unity.com/features/ai) — Unity AI の機能と料金、利用条件
- [Unreal Engine ライセンス](https://www.unrealengine.com/license) — ロイヤリティの条件
- [リリース通知（Epic Developer Docs）](https://dev.epicgames.com/docs/dev-portal/unreal-engine/release-forms-and-royalties/release-notifications) — Launch Everywhere with Epic の登録方法
- [Unreal Engine 5.8 がリリースされました](https://www.unrealengine.com/news/unreal-engine-5-8-is-now-available) — UE 5.8 の新機能と実験的MCPプラグイン
- [Phaser 4 Downloads](https://phaser.io/download/phaser4) — Phaser 4 の最新版
- [Phaser Game Agent MCP setup](https://phaser.io/agent/mcp) — Phaser 公式のMCP接続手順
- [GameMaker 価格](https://gamemaker.io/en/get) — GameMaker の各ライセンス
- [The Defold License](https://defold.com/license/) — Defold のライセンス
- [Version control（Defold Manual）](https://defold.com/manuals/version-control/) — Defold のテキスト形式ファイルとGit運用
- [Defold Releases（GitHub）](https://github.com/defold/defold/releases) — Defold の最新版
- [Bevy 0.19](https://bevy.org/news/bevy-0-19/) — Bevy 0.19 のリリースノートと BSN
- [Bevy（GitHub）](https://github.com/bevyengine/bevy) — Bevy のリポジトリとライセンス
