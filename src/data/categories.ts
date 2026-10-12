// カテゴリごとの表示名・色・アイコン（Tabler Icons の outline 名）。
// サイドバーの色分け（src/styles/theme.css の nth-child）も、この並び順と一致させる。

export interface Category {
	id: string;
	label: string;
	description: string;
	/** 英語版の表示名と説明 */
	en: { label: string; description: string };
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
		en: { label: 'Getting Started', description: 'How to use this wiki, and the whole path from idea to release.' },
		label: 'はじめに',
		description: 'このWikiの歩き方と、企画からリリースまでの全体像。',
		icon: 'flag',
		color: '#ff8a3d',
		ink: '#ffffff',
		href: '/getting-started/about/',
	},
	{
		id: 'genres',
		en: { label: 'Game Genres', description: 'Genres suited to solo developers, and genres that pair well with AI.' },
		label: 'ゲームジャンル',
		description: '個人開発に向いたジャンル、AIと相性の良いジャンル。',
		icon: 'puzzle',
		color: '#ff5a5f',
		ink: '#ffffff',
		href: '/genres/overview/',
	},
	{
		id: 'design',
		en: { label: 'Game Design', description: 'Core loops, level design, balancing, and design documents.' },
		label: 'ゲームデザイン',
		description: 'コアループ、レベルデザイン、バランス調整、企画書。',
		icon: 'bulb',
		color: '#ffb400',
		ink: '#3d2a00',
		href: '/design/core-loop/',
	},
	{
		id: 'dev-env',
		en: { label: 'Dev Environment', description: 'Engine comparisons, AI coding tools, and asset generation.' },
		label: '開発環境',
		description: 'エンジン比較、AIコーディングツール、アセット生成。',
		icon: 'code',
		color: '#00a699',
		ink: '#ffffff',
		href: '/dev-env/engines/',
	},
	{
		id: 'agent-dev',
		en: { label: 'Agent Development', description: 'Building games with coding agents such as Claude Code, beyond one-shot prompts.' },
		label: 'エージェント開発',
		description: 'Claude Code などのコーディングエージェントでゲームを作る。ポン出しの先の進め方。',
		icon: 'robot',
		color: '#2e9e5b',
		ink: '#ffffff',
		href: '/agent-dev/overview/',
	},
	{
		id: 'claude-blog',
		en: { label: 'Claude Code Blog', description: 'Deep dives into the official Claude Code blog posts, with takeaways for game making.' },
		label: 'Claude Code ブログ',
		description: 'Claude Code 公式ブログの記事を1本ずつ掘り下げ。ゲーム制作での使いどころつき。',
		icon: 'book',
		color: '#b455d6',
		ink: '#ffffff',
		href: '/claude-blog/',
	},
	{
		id: 'cases',
		en: { label: 'Case Studies', description: 'Real games built with AI: which model, which prompts, and what came out.' },
		label: '事例・ポストモーテム',
		description: 'AIで作られたゲームの実例。どのモデルに、どんなプロンプトで、何ができたか。',
		icon: 'trophy',
		color: '#8bc34a',
		ink: '#1f3300',
		href: '/cases/',
	},
	{
		id: 'publish',
		en: { label: 'Publishing & Events', description: 'Where to publish: web game hosts, itch.io, game jams and contests.' },
		label: '公開・イベント',
		description: 'どこで公開するか。Webゲームの公開先、itch.io、ゲームジャムとコンテスト。',
		icon: 'rocket',
		color: '#1487ad',
		ink: '#ffffff',
		href: '/publish/overview/',
	},
	{
		id: 'trailer',
		en: { label: 'Trailers', description: 'Trailer structure, capture and editing, and Steam trailers.' },
		label: 'PV作成',
		description: 'PVの構成、キャプチャと編集、Steamトレーラー。',
		icon: 'movie',
		color: '#7b61ff',
		ink: '#ffffff',
		href: '/trailer/structure/',
	},
	{
		id: 'monetization',
		en: { label: 'Monetization', description: 'Sales platforms, pricing, and wishlists.' },
		label: 'マネタイズ',
		description: '販売プラットフォーム、価格設定、ウィッシュリスト。',
		icon: 'coin',
		color: '#3d9bff',
		ink: '#ffffff',
		href: '/monetization/platforms/',
	},
	{
		id: 'legal',
		en: { label: 'Rights & Terms', description: 'Copyright of AI assets, commercial-use terms of tools, and licenses.' },
		label: '権利・規約',
		description: 'AI素材の著作権、ツールの商用利用条件、ライセンス。',
		icon: 'scale',
		color: '#5c6bc0',
		ink: '#ffffff',
		href: '/legal/copyright/',
	},
	{
		id: 'news',
		en: { label: 'Latest News', description: 'Weekly roundups of AI x game development news.' },
		label: '最新動向',
		description: 'AI×ゲーム制作の最新ニュースを、毎週まとめています。',
		icon: 'sparkles',
		color: '#ff5fa2',
		ink: '#ffffff',
		href: '/news/',
	},
];

/** 記事IDの言語。英語版は `en/` 配下に置く */
export const langOf = (id: string): 'ja' | 'en' => (id === 'en' || id.startsWith('en/') ? 'en' : 'ja');

/** 記事IDから言語のプレフィックス（`en/`）を除く */
export const stripLang = (id: string) => id.replace(/^en(\/|$)/, '');

/** 記事ID（例: "dev-env/engines"、英語版は "en/dev-env/engines"）からカテゴリを引く */
export const categoryOf = (id: string) => {
	const bare = stripLang(id);
	return categories.find((c) => bare === c.id || bare.startsWith(`${c.id}/`));
};

/** カテゴリの表示名・説明を言語に合わせて返す */
export const catText = (c: Category, lang: 'ja' | 'en') =>
	lang === 'en' ? c.en : { label: c.label, description: c.description };

/** 言語に合わせたパス（英語版は /en/ を付ける） */
export const localePath = (path: string, lang: 'ja' | 'en') => (lang === 'en' ? `/en${path}` : path);

/** サイトルートからのパスに base を付ける */
export const withBase = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;

/** 日本語の本文を1分あたり500字、英語は1分あたり200語として読了時間（分）を見積もる */
export const readingMinutes = (body = '', lang: 'ja' | 'en' = 'ja') => {
	if (lang === 'en') {
		const words = body
			.replace(/```[\s\S]*?```/g, '')
			.replace(/<!--[\s\S]*?-->/g, '')
			.replace(/\]\([^)]*\)/g, ']')
			.split(/\s+/)
			.filter((w) => /[A-Za-z0-9]/.test(w)).length;
		return Math.max(1, Math.round(words / 200));
	}
	const text = body
		.replace(/```[\s\S]*?```/g, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\]\([^)]*\)/g, ']')
		.replace(/[#>*_`|:\-\[\]]/g, '')
		.replace(/\s+/g, '');
	return Math.max(1, Math.round(text.length / 500));
};
