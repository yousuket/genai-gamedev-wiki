// カテゴリごとの表示名・色・アイコン（Tabler Icons の outline 名）。
// サイドバーの色分け（src/styles/theme.css の nth-child）も、この並び順と一致させる。

export interface Category {
	id: string;
	label: string;
	description: string;
	icon: string;
	/** カテゴリの色 */
	color: string;
	/** color の上に載せる文字色 */
	ink: string;
	/** カテゴリのトップとして案内する記事 */
	href: string;
}

export const categories: Category[] = [
	{
		id: 'getting-started',
		label: 'はじめに',
		description: 'このWikiの歩き方と、企画からリリースまでの全体像。',
		icon: 'flag',
		color: '#ff8a3d',
		ink: '#ffffff',
		href: '/getting-started/about/',
	},
	{
		id: 'genres',
		label: 'ゲームジャンル',
		description: '個人開発に向いたジャンル、AIと相性の良いジャンル。',
		icon: 'puzzle',
		color: '#ff5a5f',
		ink: '#ffffff',
		href: '/genres/overview/',
	},
	{
		id: 'design',
		label: 'ゲームデザイン',
		description: 'コアループ、レベルデザイン、バランス調整、企画書。',
		icon: 'bulb',
		color: '#ffb400',
		ink: '#3d2a00',
		href: '/design/core-loop/',
	},
	{
		id: 'dev-env',
		label: '開発環境',
		description: 'エンジン比較、AIコーディングツール、アセット生成。',
		icon: 'code',
		color: '#00a699',
		ink: '#ffffff',
		href: '/dev-env/engines/',
	},
	{
		id: 'agent-dev',
		label: 'エージェント開発',
		description: 'Claude Code などのコーディングエージェントでゲームを作る。ポン出しの先の進め方。',
		icon: 'robot',
		color: '#2e9e5b',
		ink: '#ffffff',
		href: '/agent-dev/overview/',
	},
	{
		id: 'cases',
		label: '事例・ポストモーテム',
		description: 'AIで作られたゲームの実例。どのモデルに、どんなプロンプトで、何ができたか。',
		icon: 'trophy',
		color: '#8bc34a',
		ink: '#1f3300',
		href: '/cases/',
	},
	{
		id: 'trailer',
		label: 'PV作成',
		description: 'PVの構成、キャプチャと編集、Steamトレーラー。',
		icon: 'movie',
		color: '#7b61ff',
		ink: '#ffffff',
		href: '/trailer/structure/',
	},
	{
		id: 'monetization',
		label: 'マネタイズ',
		description: '販売プラットフォーム、価格設定、ウィッシュリスト。',
		icon: 'coin',
		color: '#3d9bff',
		ink: '#ffffff',
		href: '/monetization/platforms/',
	},
	{
		id: 'legal',
		label: '権利・規約',
		description: 'AI素材の著作権、ツールの商用利用条件、ライセンス。',
		icon: 'scale',
		color: '#5c6bc0',
		ink: '#ffffff',
		href: '/legal/copyright/',
	},
	{
		id: 'news',
		label: '最新動向',
		description: 'エージェントが毎週まとめる、AI×ゲーム制作のニュース。',
		icon: 'sparkles',
		color: '#ff5fa2',
		ink: '#ffffff',
		href: '/news/',
	},
];

/** 記事ID（例: "dev-env/engines"）からカテゴリを引く */
export const categoryOf = (id: string) => categories.find((c) => id === c.id || id.startsWith(`${c.id}/`));

/** サイトルートからのパスに base を付ける */
export const withBase = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;

/** 日本語の本文を1分あたり500字として読了時間（分）を見積もる */
export const readingMinutes = (body = '') => {
	const text = body
		.replace(/```[\s\S]*?```/g, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\]\([^)]*\)/g, ']')
		.replace(/[#>*_`|:\-\[\]]/g, '')
		.replace(/\s+/g, '');
	return Math.max(1, Math.round(text.length / 500));
};
