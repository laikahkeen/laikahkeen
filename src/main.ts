import { ViteSSG } from 'vite-ssg';
import './assets/styles/main.css';
import App from './App.vue';
import { routes } from './router';

// The prerender build runs this module in Node, where `document` does not
// exist — hence the isClient gate rather than PROD alone.
function loadPlausible(): void {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://plausible.laikahkeen.com/js/pa-CXXt-fiIsovNAv9vxckaf.js';
  document.head.appendChild(script);
  window.plausible =
    window.plausible ||
    function (...args) {
      (window.plausible.q = window.plausible.q || []).push(args);
    };
  window.plausible.init =
    window.plausible.init ||
    function (i?: object) {
      window.plausible.o = i || {};
    };
  window.plausible.init();
}

export const createApp = ViteSSG(
  App,
  {
    routes,
    // Native scrolling for route changes and hash targets. Unifying this with
    // Lenis is issue #4, which lands with the motion rework — doing it here
    // first would only be churned by that work.
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition;
      if (to.hash) return { el: to.hash, behavior: 'smooth' };
      return { top: 0 };
    },
  },
  ({ isClient }) => {
    if (isClient && import.meta.env.PROD) loadPlausible();
  },
);
