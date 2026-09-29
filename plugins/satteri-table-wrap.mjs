// すべての <table> を <div class="table-wrap"> で包む Sätteri の hast プラグイン。
//
// Starlight の既定は、表を display: block にして、表そのものを横スクロールさせる。
// この形だと、中の表が横幅いっぱいに広がらず、見出しの色や行の背景が、枠の端まで届かない。
// 表を枠で包み、枠に角丸・枠線・横スクロールを持たせ、表は通常の表（横幅いっぱい）に戻す。

/** @param {any} node */
const isWrapper = (node) => {
	if (node?.type !== 'element' || node.tagName !== 'div') return false;
	const cls = node.properties?.className ?? node.properties?.class;
	return Array.isArray(cls) ? cls.includes('table-wrap') : String(cls ?? '').split(/\s+/).includes('table-wrap');
};

export default function satteriTableWrap() {
	return {
		name: 'table-wrap',
		element: {
			filter: ['table'],
			/** @param {any} node @param {any} ctx */
			visit(node, ctx) {
				// すでに包まれている表は、もう一度包まない
				if (isWrapper(ctx.parent(node))) return;
				ctx.wrapNode(node, { raw: '<div class="table-wrap"></div>' });
			},
		},
	};
}
