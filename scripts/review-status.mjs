// レビュー（reviews/*.md）の対応状況を一覧する。
// 使い方: node scripts/review-status.mjs  （問題があれば exit code 1）
//
// 各レビューファイルの「## 対応状況」の表を正として、次を確認する。
// - 本文の見出し「## N. 件名」と、表の行が、過不足なく対応している
// - 状態が「未対応 / 対応済み / 一部対応 / 見送り」のどれか
// - 「対応済み」「一部対応」には対応コミット、「一部対応」「見送り」にはメモがある
// - 対応コミットが、このリポジトリに存在する

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'reviews';
const STATUSES = ['未対応', '対応済み', '一部対応', '見送り'];
const IGNORED = new Set(['README.md', 'TEMPLATE.md']);

const files = readdirSync(DIR)
	.filter((f) => f.endsWith('.md') && !IGNORED.has(f))
	.sort();

const commitExists = (hash) => {
	try {
		execFileSync('git', ['cat-file', '-e', `${hash}^{commit}`], { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
};

const errors = [];
const open = [];
let total = 0;
const totals = Object.fromEntries(STATUSES.map((s) => [s, 0]));

for (const name of files) {
	const path = join(DIR, name);
	const src = readFileSync(path, 'utf8');
	const title = src.match(/^# (.+)$/m)?.[1] ?? name;

	// 本文の見出し「## N. 件名」（対応状況の表より後ろ）
	const headings = new Map();
	for (const m of src.matchAll(/^## (\d+)\. (.+?)(?:（優先度: ([高中低])）)?\s*$/gm)) headings.set(Number(m[1]), m[2]);

	// 「## 対応状況」の表
	const section = src.match(/^## 対応状況\s*\n([\s\S]*?)(?=^## |\Z)/m)?.[1];
	if (!section) {
		errors.push(`${name}: 「## 対応状況」の表がありません`);
		continue;
	}
	const rows = section
		.split('\n')
		.filter((l) => /^\|\s*\d+\s*\|/.test(l))
		.map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));

	const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
	const seen = new Set();
	for (const [num, item, priority, status, commit, date, memo, ...rest] of rows) {
		const n = Number(num);
		const where = `${name} #${n}`;
		if (rest.length || memo === undefined) errors.push(`${where}: 表の列は7つ（# | 件名 | 優先度 | 状態 | 対応コミット | 対応日 | メモ）です`);
		if (seen.has(n)) errors.push(`${where}: 番号が重複しています`);
		seen.add(n);
		if (!headings.has(n)) errors.push(`${where}: 本文に「## ${n}. …」の見出しがありません`);
		if (!STATUSES.includes(status)) {
			errors.push(`${where}: 状態「${status}」は、${STATUSES.join(' / ')} のどれかにしてください`);
			continue;
		}
		counts[status]++;
		totals[status]++;
		total++;
		if ((status === '対応済み' || status === '一部対応') && !commit) errors.push(`${where}: ${status}には、対応コミットが必要です`);
		if ((status === '一部対応' || status === '見送り') && !memo) errors.push(`${where}: ${status}には、メモ（残りの内容、または理由）が必要です`);
		if (commit && !commitExists(commit)) errors.push(`${where}: 対応コミット ${commit} が、このリポジトリに見つかりません`);
		if (status === '未対応' || status === '一部対応') open.push({ file: name, num: n, item, priority, status });
	}
	for (const n of headings.keys()) if (!seen.has(n)) errors.push(`${name} #${n}: 本文にあるのに、「対応状況」の表にありません`);

	const summary = STATUSES.filter((s) => counts[s]).map((s) => `${s} ${counts[s]}`).join('、');
	console.log(`${name}  ${title}`);
	console.log(`  ${rows.length}件: ${summary || '（なし）'}`);
}

console.log('');
console.log(`合計 ${total}件: ${STATUSES.map((s) => `${s} ${totals[s]}`).join('、')}`);

if (open.length) {
	console.log('\n未対応・一部対応の項目:');
	for (const o of open) console.log(`  [${o.priority}] ${o.file} #${o.num} ${o.item}（${o.status}）`);
} else {
	console.log('未対応・一部対応の項目はありません。');
}

if (errors.length) {
	console.error(`\n✗ ${errors.length} 件の問題があります`);
	for (const e of errors) console.error(`  - ${e}`);
	process.exit(1);
}
