/// <reference types="vite/client" />

interface Window {
  plausible: ((...args: unknown[]) => void) & {
    q?: unknown[][];
    init: (options?: object) => void;
    o?: object;
  };
}

interface ImportMetaEnv {
  readonly VITE_WEB3FORMS_ACCESS_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
