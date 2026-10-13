import type { Plugin } from 'vite';
import { loadPosts } from './content.ts';

// Metadata and bodies are separate modules so the nav and the index never carry
// post HTML. Bodies load with the post view's lazy chunk — all posts in one
// module, which is fine at a handful of posts and worth splitting per post later.
const META = 'virtual:writing';
const BODIES = 'virtual:writing/bodies';

export function writing(dir: string): Plugin {
  return {
    name: 'writing',
    resolveId(id) {
      if (id === META || id === BODIES) return `\0${id}`;
    },
    load(id) {
      if (id === `\0${META}`) {
        const meta = loadPosts(dir).map(({ html: _html, ...rest }) => rest);
        return `export const posts = ${JSON.stringify(meta)};`;
      }
      if (id === `\0${BODIES}`) {
        const bodies = Object.fromEntries(loadPosts(dir).map((p) => [p.slug, p.html]));
        return `export const bodies = ${JSON.stringify(bodies)};`;
      }
    },
    configureServer(server) {
      server.watcher.add(dir);
      const onChange = (file: string) => {
        if (!file.startsWith(dir) || !file.endsWith('.md')) return;
        for (const id of [META, BODIES]) {
          const mod = server.moduleGraph.getModuleById(`\0${id}`);
          if (mod) server.moduleGraph.invalidateModule(mod);
        }
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', onChange).on('change', onChange).on('unlink', onChange);
    },
  };
}
