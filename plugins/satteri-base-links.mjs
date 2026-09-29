// 記事中の `/genres/overview/` のようなサイトルートからのリンクに base を付ける Sätteri の hast プラグイン。
// GitHub Pages のプロジェクトサイト（/<repo>/ 配下）で公開してもリンクが切れないようにするため。

/** @param {string} base */
export default function satteriBaseLinks(base) {
	const prefix = base.replace(/\/$/, '');
	return {
		name: 'base-links',
		element: {
			filter: ['a'],
			/** @param {any} node @param {any} ctx */
			visit(node, ctx) {
				const href = node.properties?.href;
				if (
					prefix &&
					typeof href === 'string' &&
					href.startsWith('/') &&
					!href.startsWith('//') &&
					!href.startsWith(prefix + '/')
				) {
					ctx.setProperty(node, 'href', prefix + href);
				}
			},
		},
	};
}
