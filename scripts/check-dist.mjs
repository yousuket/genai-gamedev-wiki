// ビルド後チェック: 太字の記法（**）が変換されずにそのまま表示されていないかを確認する。
// 日本語では「（…）**が」のように閉じ括弧の直後に ** と文字が続くと太字にならないため。
// 使い方: npm run build の後に node scripts/check-dist.mjs  （問題があれば exit code 1）

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** @param {string} dir @returns {string[]} */
const walk = (dir) =>
	readdirSync(dir).flatMap((name) => {
		const p = join(dir, name);
		return statSync(p).isDirectory() ? walk(p) : name.endsWith('.html') ? [p] : [];
	});

const errors = [];
for (const file of walk('dist')) {
	const html = readFileSync(file, 'utf8')
		.replace(/<script[\s\S]*?<\/script>/g, '')
		.replace(/<style[\s\S]*?<\/style>/g, '')
		.replace(/<pre[\s\S]*?<\/pre>/g, '')
		.replace(/<code[\s\S]*?<\/code>/g, '')
		// タグは属性ごと取り除く（コードのコピー用の data-code 属性に ** や /** が入るため）
		.replace(/<\/?[a-zA-Z](?:"[^"]*"|'[^']*'|[^>"'])*>/g, '');
	for (const m of html.matchAll(/.{0,20}\*\*.{0,20}/g)) {
		errors.push(`${file}: 「${m[0]}」 — 太字にならず ** が表示されています。元の記事で <strong>…</strong> を使ってください`);
	}
}

if (errors.length) {
	console.error(`✗ ${errors.length} 件の問題があります`);
	for (const e of errors) console.error(`  - ${e}`);
	process.exit(1);
}
console.log('✓ ビルド結果に問題はありません。');
