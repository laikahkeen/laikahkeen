// vitest/config re-exports Vite's defineConfig and widens the type with `test`.
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
// Explicit .ts extension: Vite 8 loads this config with a native loader that does
// not resolve extensionless paths. allowImportingTsExtensions in tsconfig permits it.
import { projects } from "./src/data/projects.ts";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [vue()],
  // GitHub Pages has no SPA fallback, so a direct hit on /work/<slug> would
  // return GitHub's 404 rather than the app. Prerendering emits a real
  // dist/work/<slug>/index.html per route, which is also what makes those pages
  // indexable — an SPA shell is not.
  ssgOptions: {
    // 'nested' emits dist/work/<slug>/index.html rather than <slug>.html, so a
    // shared link resolves on any static host without depending on the host
    // mapping extensionless URLs to .html.
    dirStyle: "nested",
    includedRoutes: (paths: string[]) => [
      ...paths.filter((p) => !p.includes(":")),
      ...projects.map((p) => `/work/${p.slug}`),
    ],
  },
  build: {
    // Two constraints stacked here, both learned the hard way:
    //
    // 1. manualChunks must stay off the SSR pass. There gsap and vue resolve as
    //    external, and naming an external in manualChunks is a hard bundler error.
    // 2. It must be a FUNCTION, not an object map. Vite 8 bundles with Rolldown,
    //    which rejects the `{name: [modules]}` form outright ("manualChunks is not
    //    a function"). That form worked through Vite 5.
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks(id: string) {
              if (id.includes("node_modules/gsap")) return "gsap";
              if (id.includes("node_modules/vue/") || id.includes("node_modules/@vue/")) return "vendor";
              return undefined;
            },
          },
        },
    chunkSizeWarningLimit: 1000,
  },
  base: "/",
  test: {
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
    // No globals: tests import from 'vitest' explicitly, so nothing leaks into
    // the app's type surface.
    globals: false,
    include: ["src/**/*.test.ts"],
  },
}));
