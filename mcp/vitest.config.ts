import { defineConfig } from 'vitest/config';

// This file must exist. Without it, Vitest walks up and picks up the site's
// ../vite.config.ts — inheriting its jsdom environment and its setupFiles path,
// resolved against this directory, which fails at load with a missing module.
export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['src/**/*.test.ts'],
  },
});
