// 英語版のサイドバーとページ送りから、まだ訳していないページ（日本語の代替表示）を外す。
// 訳した記事は src/content/docs/en/ に置く。置いた記事は自動で現れる。
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { getCollection } from 'astro:content';

type SidebarEntry = { type: 'link'; href: string } | { type: 'group'; entries: SidebarEntry[] };

export const onRequest = defineRouteMiddleware(async (context) => {
	const route = context.locals.starlightRoute;
	if (!route.lang.startsWith('en')) return;

	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	const translated = new Set(
		(await getCollection('docs', (e) => e.id === 'en' || e.id.startsWith('en/'))).map(
			(e) => `${base}/${e.id === 'en' ? 'en' : e.id.replace(/\/index$/, '')}/`,
		),
	);
	const isTranslated = (href: string) => translated.has(href.endsWith('/') ? href : `${href}/`);

	const filter = (entries: SidebarEntry[]): SidebarEntry[] =>
		entries.flatMap((entry) => {
			if (entry.type === 'link') return isTranslated(entry.href) ? [entry] : [];
			const kept = filter(entry.entries);
			return kept.length > 0 ? [{ ...entry, entries: kept }] : [];
		});

	route.sidebar = filter(route.sidebar as SidebarEntry[]) as typeof route.sidebar;
	if (route.pagination.prev && !isTranslated(route.pagination.prev.href)) route.pagination.prev = undefined;
	if (route.pagination.next && !isTranslated(route.pagination.next.href)) route.pagination.next = undefined;
});
