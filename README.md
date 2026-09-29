# GenAI GameDev Wiki

生成AIを使う個人ゲーム制作者のためのWiki。ゲームジャンル、ゲームデザイン、開発環境、PV作成、マネタイズ、権利・規約の情報をまとめています。LLMを使ったゲーム制作の最新動向は、エージェントが毎日集め、毎週自動で更新しています。

## 開発

```bash
npm install
npm run dev
```

## 構成

| パス | 内容 |
|---|---|
| `src/content/docs/` | 公開する記事 |
| `research/daily/` | 日次収集エージェントの収集ログ（サイトには載らない） |
| `agents/` | 記事スタイルガイドとエージェントの指示書 |
| `scripts/check-content.mjs` | 公開前チェック（リンク切れ・自動更新マーカー） |
| `.github/workflows/deploy.yml` | main への push で GitHub Pages にデプロイ |

## 自動更新

| ジョブ | 時刻 | 指示書 |
|---|---|---|
| 日次収集 | 毎日 06:07 JST | `agents/daily-collect.md` |
| 週次更新 | 毎週月曜 07:07 JST | `agents/weekly-update.md` |

どちらも Claude Code のクラウド定期実行で動きます。週次更新の結果は `weekly-update` ラベルの Issue で報告されます。

## アクセス解析

リポジトリの Settings → Secrets and variables → Actions → Variables に `CF_ANALYTICS_TOKEN`（Cloudflare Web Analytics のトークン）を設定すると、計測用スクリプトが埋め込まれます。
