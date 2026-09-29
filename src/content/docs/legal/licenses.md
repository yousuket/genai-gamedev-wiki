---
title: アセット・OSSのライセンス
description: CC0やCC BYなどの素材ライセンス、MITやGPLなどのOSSライセンス、フォントのライセンスをゲームでどう扱うか、クレジット表記の書き方、AI生成コードの混入リスクをまとめます。
sidebar:
  order: 4
lastUpdated: 2026-09-29
---

## 概要

個人開発のゲームには、フリー素材、OSSのライブラリ、フォント、ゲームエンジンなど、他人が作ったものが多く入ります。どれもライセンス（利用許諾の条件）に従う必要があります。

- **素材**（画像・音・3Dモデル）: Creative Commons（CC）ライセンスがよく使われる
- **コード**: MIT、Apache 2.0、GPL などのOSSライセンス
- **フォント**: SIL Open Font License（OFL）や、各社の商用ライセンス
- **AIが生成したコード**: 既存のOSSのコードがそのまま混ざることがある

この記事では、それぞれの注意点とクレジット表記の書き方を説明します。

## Creative Commons（CC）ライセンス

CCライセンスは、いくつかの条件の組み合わせでできています。ゲームで使うときの目安は次のとおりです。

| 表記 | 意味 | 販売するゲームで使えるか |
|---|---|---|
| **CC0** | 権利を放棄してパブリックドメインにする宣言。CCによれば、ライセンスではない | 使える。表記の義務もない（書いておくと親切） |
| **BY**（表示） | 作者などのクレジット表記が必要 | 表記すれば使える |
| **SA**（継承） | 改変したものを同じライセンスで公開する必要がある | 使えるが、改変した素材はSAの条件で配布することになる |
| **NC**（非営利） | 商用利用を禁止 | **販売するゲームには原則使えない**。使いたい場合は作者の許可を得る |
| **ND**（改変禁止） | 改変を禁止 | 加工しないなら使える。切り抜き・色変え・リミックスなどは不可 |

補足:

- CCライセンスは**撤回できません**。一度CCで公開されたものは、後から作者が取り下げても、ライセンスの条件どおりに使い続けられます（[CC FAQ](https://creativecommons.org/faq/)）。
- CCは、**ソフトウェアのライセンスとしては推奨されていません**。コードにはOSSライセンスを使います（[CC FAQ](https://creativecommons.org/faq/)）。
- CC-BY-ND の音楽をPVのBGMに使うのは、映像と音楽を組み合わせる「改変」に当たるとCCは説明しています。そのため、NDの曲は使えません（[CC推奨の表記方法](https://wiki.creativecommons.org/wiki/Recommended_practices_for_attribution)）。PVについては[AI動画生成の使いどころ](/trailer/ai-video/)も参照してください。
- AIツールの無料プランの出力に、CCライセンスが付く場合があります。たとえば、Meshyの無料プランの出力は CC BY 4.0 です（[AIツールの商用利用条件](/legal/tool-terms/)）。

## OSSライセンス

| ライセンス | 種類 | ゲームで配布するときに必要なこと |
|---|---|---|
| **MIT** / BSD | 寛容型 | 著作権表示とライセンス文をゲームに含める |
| **Apache 2.0** | 寛容型 | ライセンス文を含める。NOTICEファイルがあれば、その内容も含める。変更したファイルには変更した旨を記す |
| **GPL** | コピーレフト型 | ゲームと一体になったプログラム全体をGPLで提供し、ソースコードを入手できるようにする |
| **LGPL** | 弱いコピーレフト型 | ライブラリ部分の条件を守れば、ゲーム本体を別のライセンスにできる場合がある |

各ライセンスの本文: [MIT](https://opensource.org/license/mit)、[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)、[GPL](https://www.gnu.org/licenses/gpl-3.0.html)

### GPLの注意点

[GPL FAQ](https://www.gnu.org/licenses/gpl-faq.html)では、次のように説明されています。

- GPL（LGPLではない）のライブラリにリンクすると、組み合わせた全体にGPLの条件が及ぶ（FAQ「IfLibraryIsGPL」）
- GPLのソフトウェアの複製を販売することは認められている（FAQ「DoesTheGPLAllowMoney」）
- ビデオゲームでは、アートや音声がGPLのコードとは別のライセンスになっている場合がある（FAQ「WhatCaseIsOutputGPL」）

ソースを公開したくない商用ゲームでは、GPLのコードを組み込まないのが基本です。依存ライブラリのライセンスは、パッケージマネージャーの情報やリポジトリのLICENSEファイルで確認します。

### ゲームエンジンのライセンス

エンジン自体にもライセンスがあります。たとえばGodotはMITライセンスです。公式ドキュメントでは、ゲームにGodotのライセンス文を含める方法として、クレジット画面、ライセンス一覧のメニュー、同梱ファイルなどが挙げられています。エンジンに含まれるサードパーティ部品の表示（`COPYRIGHT.txt`）についても説明があります（[Godot: Complying with licenses](https://docs.godotengine.org/en/stable/about/complying_with_licenses.html)）。Unity や Unreal Engine は、それぞれ独自の利用規約に従います。

## フォントのライセンス

### SIL Open Font License（OFL）

Google Fonts の多くのフォントを含め、OFLで公開されたフォントがあります。[OFL FAQ](https://openfontlicense.org/ofl-faq/)の要点は次のとおりです。

- ゲームやモバイルアプリに同梱できる。商用でもよい
- 同梱するときは、著作権表示とライセンス文を含める
- **フォント単体で販売することはできない**
- 改変する場合、作者が「予約フォント名（Reserved Font Name）」を宣言していれば、改変版には別の名前を付ける

### 商用フォント

商用フォントは、「画像にして使う」と「フォントデータをゲームに組み込む」とで条件が違うことがあります。

たとえばモリサワの場合、タイトルロゴやメニューなどを画像にしてゲームに使うことは、追加料金なしで認められています。一方、フォントの代わりとして働くデータ（ビットマップ化したデータなど）をゲームに搭載するには、別の契約が必要です（[モリサワ 商業利用について](https://www.morisawa.co.jp/products/fonts/commercial-use/)、2026年9月時点）。ゲームへの組み込み向けには、専用のライセンスが用意されています（[アプリ・ゲーム組込み](https://www.morisawa.co.jp/products/fonts/embedding/mat/)）。

フリーフォントも、組み込みを禁止していたり、クレジット表記を求めたりするものがあります。条件は配布ページの利用規約に書かれています。

## クレジット表記の書き方

CCの素材には、**TASL**という表記方法が推奨されています（[CC推奨の表記方法](https://wiki.creativecommons.org/wiki/Recommended_practices_for_attribution)）。

- **T**itle（作品名）: CC 4.0 では省略できる
- **A**uthor（作者）: 作者が希望する名前
- **S**ource（出典）: 元の作品のURL
- **L**icense（ライセンス）: ライセンス名と、その説明ページへのリンク

ゲーム内のクレジット画面やREADMEの例:

```text
■ グラフィック
"Forest Tileset" by Taro Yamada (https://example.com/forest)
  is licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)

■ フォント
（フォント名） — Copyright（フォントに記載の著作権者） — SIL Open Font License 1.1
（ライセンス全文: licenses/OFL.txt）

■ ソフトウェア
This game uses Godot Engine, available under the MIT license.
（ライセンス全文: licenses/ 以下を参照）

■ AI生成素材
一部の3Dモデルは Meshy（無料プラン）で生成し、CC BY 4.0 に従って表示しています。
```

実務のコツ:

- 素材を入れた時点で、台帳（素材名・作者・URL・ライセンス・改変の有無）に記録する
- ライセンス全文は `licenses/` フォルダにまとめて同梱し、クレジット画面からも見られるようにする
- ストアページの説明文にも主なクレジットを書いておくと、問い合わせが減る

## AIが生成したコードに既存コードが混ざるリスク

AIコーディングツールは、学習したOSSのコードとほぼ同じコードを出力することがあります。そのコードがGPLなどのライセンスだった場合、ライセンス表示が付かないまま自分のゲームに入ってしまいます。

- GitHub Copilot には、提案と公開コードの一致を調べる「コード参照（code referencing）」機能があります。提案と周辺の約150文字を、GitHubの公開リポジトリと比較します。一致すると、元のファイルのURLとライセンス名が表示されます。GitHubによると、一致は提案の1％未満です（[GitHub Docs](https://docs.github.com/en/copilot/concepts/completions/code-referencing)）。
- 個人の設定で「Suggestions matching public code」を **Block** にすると、公開コードと一致する提案を表示しないようにできます（[GitHub Docs](https://docs.github.com/copilot/how-tos/manage-your-account/managing-copilot-policies-as-an-individual-subscriber)）。
- Copilot をめぐる Doe v. GitHub 事件で、米連邦第9巡回区控訴裁判所は2026年9月16日、DMCA 1202条（著作権管理情報の除去）に基づく請求の棄却を支持しました。ただし、OSSライセンス違反を理由とする契約上の請求は、地裁でまだ審理中です（[Authors Alliance](https://www.authorsalliance.org/2026/09/23/resolving-an-interlocutory-appeal-ninth-circuit-affirms-dismissal-of-section-1202-dmca-claims-in-ongoing-doe-v-github-litigation/)）。この判決は、**ライセンスに違反してコードを使ってもよいという意味ではありません**。

対策:

- [ ] 公開コードとの一致をブロック・表示する設定を有効にする
- [ ] 「○○ライブラリの実装をそのまま書いて」のような指示を避ける。ライブラリが必要なら、依存関係として正式に追加する
- [ ] 長くまとまったアルゴリズムが出力されたら、コードの一部で検索し、既存のコードと一致しないか確認する
- [ ] 依存ライブラリのライセンスを一覧にするツールを、ビルドの工程に入れる

ツールごとの規約は[AIツールの商用利用条件](/legal/tool-terms/)、ツールの選び方は[AIコーディングツール](/dev-env/ai-coding-tools/)を参照してください。

## AIの活用ポイント

- **ライセンス台帳とクレジットの自動生成**: `package.json` やアセットフォルダのメタデータから、ライセンス一覧とクレジット画面用のテキストを作るスクリプトを、AIに書かせると便利です。
- **ライセンス本文の読み解き**: LLMに「このライセンスで販売するゲームに使えるか」を聞くと、たたき台になります。
- **AI生成の素材にもライセンスがある**: 無料プランの出力にCCライセンスが付くツールや、表示義務のあるツールがあります。素材台帳に「生成ツールとプラン」の欄を設けておきます。関連: [アセット生成](/dev-env/asset-generation/)

## 最新情報

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: 初版作成。
<!-- AUTO-UPDATE:END -->

## 参考リンク

- [Creative Commons FAQ](https://creativecommons.org/faq/) — CCライセンスとCC0の基本
- [Recommended practices for attribution（CC）](https://wiki.creativecommons.org/wiki/Recommended_practices_for_attribution) — TASLによるクレジット表記
- [GPL FAQ（GNU）](https://www.gnu.org/licenses/gpl-faq.html) — GPLの適用範囲、販売、ゲームのアートの扱い
- [MIT License（OSI）](https://opensource.org/license/mit) — ライセンス本文
- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) — ライセンス本文
- [Godot: Complying with licenses](https://docs.godotengine.org/en/stable/about/complying_with_licenses.html) — エンジンのライセンス表示の方法
- [OFL FAQ](https://openfontlicense.org/ofl-faq/) — OFLフォントの同梱と改変
- [モリサワ 商業利用について](https://www.morisawa.co.jp/products/fonts/commercial-use/) — ゲームでの商用フォントの扱いの例
- [GitHub Copilot code referencing](https://docs.github.com/en/copilot/concepts/completions/code-referencing) — 公開コードとの一致の確認
