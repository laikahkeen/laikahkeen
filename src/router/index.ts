import type { RouteRecordRaw, RouterScrollBehavior } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { scrollToSection } from '../composables/useLenis';

// Home stays a single scroll-driven page. Only depth gets its own URL, because
// the reason routing exists here is that a peer can share one case study —
// see "Reversed 2026-09-25" in CLAUDE.md.
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    // Eager, not lazy: this route is needed on every first paint of '/', so a
    // dynamic import only adds a request to the critical path. WorkView stays
    // lazy — it is reached by a click or a deep link.
    component: HomeView,
  },
  {
    path: '/work/:slug',
    name: 'work',
    component: () => import('../views/WorkView.vue'),
  },
  // Always routed, but prerendered only once a post is published — see
  // writingRoutes in src/writing/content.ts.
  {
    path: '/writing',
    name: 'writing',
    component: () => import('../views/WritingIndexView.vue'),
  },
  {
    path: '/writing/:slug',
    name: 'post',
    component: () => import('../views/WritingPostView.vue'),
  },
];

// Only the hash case animates, so only it goes through Lenis. Page changes and
// back/forward stay native and instant; Lenis follows native scrolls.
export const scrollBehavior: RouterScrollBehavior = (to, _from, savedPosition) => {
  if (savedPosition) return savedPosition;
  if (to.hash) {
    scrollToSection(decodeURIComponent(to.hash.slice(1)));
    return false;
  }
  return { top: 0 };
};
