import { createApp } from 'vue';
import './assets/styles/main.css';
import App from './App.vue';

if (import.meta.env.PROD) {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://plausible.laikahkeen.com/js/pa-CXXt-fiIsovNAv9vxckaf.js';
  document.head.appendChild(script);
  window.plausible = window.plausible || function (...args) { (window.plausible.q = window.plausible.q || []).push(args); };
  window.plausible.init = window.plausible.init || function (i?: object) { window.plausible.o = i || {}; };
  window.plausible.init();
}

createApp(App).mount('#app');
