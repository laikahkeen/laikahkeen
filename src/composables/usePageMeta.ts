import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { useHead } from '@unhead/vue';
import { SITE_URL } from '../data/site';

export interface PageMeta {
  title: string;
  description: string;
  // Site-relative with the trailing slash, e.g. /writing/<slug>/ — Pages 301s the
  // slashless form to it, and a canonical should not point at a redirect.
  path: string;
  // YYYY-MM-DD; marks the page as an article.
  published?: string;
}

// Overrides the site-wide tags in index.html. vite-ssg's head renderer replaces
// tags with the same name/property rather than appending, so each page has one
// og:title — which is why twitter:* keeps index.html's `property` attribute.
export function usePageMeta(source: MaybeRefOrGetter<PageMeta | undefined>): void {
  useHead(
    computed(() => {
      const m = toValue(source);
      if (!m) return {};
      const url = `${SITE_URL}${m.path}`;
      return {
        title: m.title,
        link: [{ rel: 'canonical', href: url }],
        meta: [
          { name: 'title', content: m.title },
          { name: 'description', content: m.description },
          { property: 'og:type', content: m.published ? 'article' : 'website' },
          { property: 'og:url', content: url },
          { property: 'og:title', content: m.title },
          { property: 'og:description', content: m.description },
          ...(m.published ? [{ property: 'article:published_time', content: m.published }] : []),
          { property: 'twitter:url', content: url },
          { property: 'twitter:title', content: m.title },
          { property: 'twitter:description', content: m.description },
        ],
      };
    })
  );
}
