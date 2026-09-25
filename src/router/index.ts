import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

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
];
