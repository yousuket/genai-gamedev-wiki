// 公開前チェック: Wiki内リンクのリンク切れと、自動更新マーカーの有無を確認する。
// 使い方: node scripts/check-content.mjs  （問題があれば exit code 1）

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DOCS = 'src/content/docs';
// 自動更新欄を持たないページ
const NO_MARKER = new Set(['index.mdx', 'getting-started/about.md']);

/** @param {string} dir @returns {string[]} */
const walk = (dir) =>
	readdirSync(dir).flatMap((name) => {
		const p = join(dir, name);
		return statSync(p).isDirectory() ? walk(p) : /\.mdx?$/.test(name) ? [p] : [];
	});

const files = walk(DOCS);
const routes = new Set(
	files.map((f) => {
		const r = relative(DOCS, f).replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');
		return r ? `/${r}/` : '/';
	}),
);

const errors = [];
for (const file of files) {
	const rel = relative(DOCS, file);
	const src = readFileSync(file, 'utf8');

	if (!/^---\n(?:[\s\S]*?\n)?title:/.test(src)) errors.push(`${rel}: frontmatter に title がありません`);

	if (!NO_MARKER.has(rel)) {
		const start = src.split('<!-- AUTO-UPDATE:START -->').length - 1;
		const end = src.split('<!-- AUTO-UPDATE:END -->').length - 1;
		if (start !== 1 || end !== 1 || src.indexOf('AUTO-UPDATE:START') > src.indexOf('AUTO-UPDATE:END'))
			errors.push(`${rel}: AUTO-UPDATE マーカーが正しくありません（START/END が1組必要）`);
	}

	// コードブロック内のリンクは対象外
	const body = src.replace(/```[\s\S]*?```/g, '');
	for (const [, mdHref, attrHref] of body.matchAll(/\]\((\/[^)\s#]*)(?:#[^)\s]*)?\)|href="(\/[^"#]*)/g)) {
		const href = mdHref ?? attrHref;
		if (!href || href.startsWith('//')) continue;
		const path = href.endsWith('/') ? href : `${href}/`;
		if (!routes.has(path)) errors.push(`${rel}: リンク切れ ${href}`);
	}
}

if (errors.length) {
	console.error(`✗ ${errors.length} 件の問題があります`);
	for (const e of errors) console.error(`  - ${e}`);
	process.exit(1);
}
console.log(`✓ ${files.length} ページをチェックしました。問題はありません。`);
