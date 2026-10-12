// 英語版が日本語版と同じ構造かを確認する（訳し漏れ・出典URLの欠落・表の崩れの検出）。
// 使い方: node scripts/check-en.mjs [slug ...]   例: node scripts/check-en.mjs genres/overview
// slug を省くと、英語版がある記事すべてを確認する。問題があれば exit code 1。

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DOCS = 'src/content/docs';

/** @param {string} dir @returns {string[]} */
const walk = (dir) =>
	readdirSync(dir).flatMap((name) => {
		const p = join(dir, name);
		return statSync(p).isDirectory() ? walk(p) : /\.mdx?$/.test(name) ? [p] : [];
	});

const slugs = process.argv.length > 2
	? process.argv.slice(2)
	: walk(join(DOCS, 'en')).map((f) => relative(join(DOCS, 'en'), f).replace(/\.mdx?$/, ''));

const frontmatter = (src, key) => src.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1]?.trim();
const withoutCode = (src) => src.replace(/```[\s\S]*?```/g, '');
const externalUrls = (src) =>
	[...new Set([...src.matchAll(/https?:\/\/[^\s)"'<>\]*\u0080-\uffff]+/g)].map((m) => m[0].replace(/[.,;:]+$/, '')))].sort();
const count = (src, re) => (src.match(re) ?? []).length;

// 英語版で意図的に日本語版と違える箇所（トップページは未訳のセクションを外す。about は Starlight の英語版URLにする）
const KNOWN = { index: ['## 見出し'], 'getting-started/about': ['url'] };

const errors = [];
for (const slug of slugs) {
	const jaFile = ['.md', '.mdx'].map((e) => join(DOCS, slug + e)).find(existsSync);
	const enFile = ['.md', '.mdx'].map((e) => join(DOCS, 'en', slug + e)).find(existsSync);
	if (!enFile) { errors.push(`${slug}: 英語版がありません`); continue; }
	if (!jaFile) { errors.push(`${slug}: 日本語版がありません`); continue; }
	const ja = readFileSync(jaFile, 'utf8');
	const en = readFileSync(enFile, 'utf8');
	const err = (m) => errors.push(`${slug}: ${m}`);
	const known = KNOWN[slug] ?? [];

	for (const key of ['sidebar', 'lastUpdated', 'template'])
		if (/^---\n[\s\S]*?\n---/.test(ja) && ja.includes(`\n${key}:`) !== en.includes(`\n${key}:`)) err(`frontmatter の ${key} が日本語版と違います`);
	if (frontmatter(ja, 'lastUpdated') !== frontmatter(en, 'lastUpdated')) err('lastUpdated が日本語版と違います');
	const order = (s) => s.match(/^\s+order:\s*(\d+)/m)?.[1];
	if (order(ja) !== order(en)) err('sidebar.order が日本語版と違います');
	if (!frontmatter(en, 'title') || !frontmatter(en, 'description')) err('title / description がありません');
	for (const key of ['title', 'description']) {
		const v = frontmatter(en, key) ?? '';
		const quoted = /^(".*"|'.*')$/.test(v);
		if (!quoted && (/: |^[\[\]{}>|&*!%@`#-]| #|:$/.test(v))) err(`${key} に YAML で解釈できない文字があります（ダブルクォートで囲む）`);
	}

	const jaBody = withoutCode(ja);
	const enBody = withoutCode(en);
	if (/[぀-ヿ一-鿿]/.test(enBody.replace(/\([^)]*\)|「[^」]*」|`[^`]*`|\[[^\]]*\]/g, (m) => /[぀-ヿ一-鿿]/.test(m) ? '' : m).replace(/\(in Japanese\)/g, ''))) {
		const lines = enBody.split('\n').filter((l) => /[぀-ヿ一-鿿]/.test(l));
		err(`日本語が残っています（${lines.length} 行。例: ${lines[0].slice(0, 60)}）`);
	}

	const jaUrls = externalUrls(ja);
	const enUrls = externalUrls(en);
	const missing = jaUrls.filter((u) => !enUrls.includes(u));
	const extra = enUrls.filter((u) => !jaUrls.includes(u));
	if (missing.length && !known.includes('url')) err(`日本語版にあって英語版にない URL: ${missing.slice(0, 3).join(' ')}${missing.length > 3 ? ` ほか${missing.length - 3}件` : ''}`);
	if (extra.length && !known.includes('url')) err(`英語版にだけある URL: ${extra.slice(0, 3).join(' ')}`);

	const checks = [
		['## 見出し', /^## /gm],
		['### 見出し', /^### /gm],
		['表の行', /^\|.*\|\s*$/gm],
		['コードブロック', /^```/gm],
		['aside（:::）', /^:::/gm],
		['AUTO-UPDATE マーカー', /AUTO-UPDATE:(START|END)/g],
		['箇条書き', /^[-*] /gm],
	];
	for (const [label, re] of checks) {
		const a = count(label === 'コードブロック' || label === 'aside（:::）' ? ja : jaBody, re);
		const b = count(label === 'コードブロック' || label === 'aside（:::）' ? en : enBody, re);
		const tolerance = label === '箇条書き' ? Math.ceil(a * 0.1) : 0;
		if (Math.abs(a - b) > tolerance && !known.includes(label)) err(`${label}の数が違います（日本語版 ${a}、英語版 ${b}）`);
	}

	const jaInternal = count(jaBody, /\]\(\/[^)]*\)/g);
	const enInternal = count(enBody, /\]\(\/[^)]*\)/g);
	if (jaInternal !== enInternal) err(`Wiki内リンクの数が違います（日本語版 ${jaInternal}、英語版 ${enInternal}）`);
	for (const m of enBody.matchAll(/\]\((\/[^)\s#]*)/g))
		if (!m[1].startsWith('/en/')) err(`Wiki内リンクに /en/ が付いていません: ${m[1]}`);
	if (/\*\*[^*]*[)）]\*\*[^\s*\p{P}]/u.test(en)) err('閉じ括弧の直後に文字が続く太字があります（<strong> を使う）');
}

if (errors.length) {
	console.error(`✗ ${errors.length} 件の問題があります`);
	for (const e of errors) console.error(`  - ${e}`);
	process.exit(1);
}
console.log(`✓ 英語版 ${slugs.length} 本は、日本語版と同じ構造です。`);
