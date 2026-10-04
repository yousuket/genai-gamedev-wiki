// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import satteriBaseLinks from './plugins/satteri-base-links.mjs';
import satteriTableWrap from './plugins/satteri-table-wrap.mjs';

// GitHub Actions のデプロイ時に actions/configure-pages の出力から渡される
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';
const repoUrl = process.env.REPO_URL || 'https://github.com/';
const cfAnalyticsToken = process.env.CF_ANALYTICS_TOKEN;

/** @type {import('@astrojs/starlight/types').StarlightUserConfig['head']} */
const head = [];
if (cfAnalyticsToken) {
	head.push({
		tag: 'script',
		attrs: {
			type: 'module',
			src: 'https://static.cloudflareinsights.com/beacon.min.js',
			'data-cf-beacon': JSON.stringify({ token: cfAnalyticsToken }),
		},
	});
}

// https://astro.build/config
export default defineConfig({
	site,
	base,
	// 旧URL（まとめ記事を新カテゴリへ移した）
	redirects: { '/agent-dev/claude-code-blog': '/claude-blog/' },
	markdown: {
		processor: satteri({ hastPlugins: [satteriBaseLinks(base), satteriTableWrap()] }),
	},
	integrations: [
		starlight({
			title: 'GenAI GameDev Wiki',
			description: '生成AIを使う個人ゲーム制作者のためのWiki',
			defaultLocale: 'root',
			locales: {
				root: { label: '日本語', lang: 'ja' },
			},
			social: [{ icon: 'github', label: 'GitHub', href: repoUrl }],
			lastUpdated: true,
			head,
			customCss: [
				'@fontsource/biz-udpgothic/400.css',
				'@fontsource/biz-udpgothic/700.css',
				'./src/styles/theme.css',
			],
			components: {
				PageTitle: './src/components/PageTitle.astro',
				Footer: './src/components/Footer.astro',
			},
			expressiveCode: {
				styleOverrides: { borderRadius: '12px' },
			},
			sidebar: [
				{ label: 'はじめに', items: [{ autogenerate: { directory: 'getting-started' } }] },
				{ label: 'ゲームジャンル', items: [{ autogenerate: { directory: 'genres' } }] },
				{ label: 'ゲームデザイン', items: [{ autogenerate: { directory: 'design' } }] },
				{ label: '開発環境', items: [{ autogenerate: { directory: 'dev-env' } }] },
				{ label: 'エージェント開発', items: [{ autogenerate: { directory: 'agent-dev' } }] },
				{ label: 'Claude Code ブログ', items: [{ autogenerate: { directory: 'claude-blog' } }] },
				{ label: '事例・ポストモーテム', items: [{ autogenerate: { directory: 'cases' } }] },
				{ label: '公開・イベント', items: [{ autogenerate: { directory: 'publish' } }] },
				{ label: 'PV作成', items: [{ autogenerate: { directory: 'trailer' } }] },
				{ label: 'マネタイズ', items: [{ autogenerate: { directory: 'monetization' } }] },
				{ label: '権利・規約', items: [{ autogenerate: { directory: 'legal' } }] },
				{ label: '最新動向', items: [{ autogenerate: { directory: 'news' } }] },
			],
		}),
	],
});
