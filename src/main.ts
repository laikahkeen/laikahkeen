import { ViteSSG } from 'vite-ssg';
import './assets/styles/main.css';
import App from './App.vue';
import { routes, scrollBehavior } from './router';

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
    scrollBehavior,
  },
  ({ isClient }) => {
    if (isClient && import.meta.env.PROD) loadPlausible();
  },
);
