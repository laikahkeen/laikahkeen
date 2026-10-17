import type { Plugin } from 'vite';
import { loadPosts } from './content.ts';
import { FEED_PATH, FEED_TITLE, renderFeed } from './feed.ts';

// Metadata and bodies are separate modules so the nav and the index never carry
// post HTML. Bodies load with the post view's lazy chunk — all posts in one
// module, which is fine at a handful of posts and worth splitting per post later.
const META = 'virtual:writing';
const BODIES = 'virtual:writing/bodies';

// No posts, no feed and no <link rel="alternate">: an empty feed would advertise a
// subscription to nothing, the same reason /writing is not prerendered while empty.
export function writing(dir: string): Plugin {
  let ssr = false;
  return {
    name: 'writing',
    configResolved(config) {
      ssr = Boolean(config.build.ssr);
    },
    resolveId(id) {
      if (id === META || id === BODIES) return `\0${id}`;
    },
    load(id) {
      if (id === `\0${META}`) {
        const meta = loadPosts(dir).map(({ html, ...rest }) => rest);
        return `export const posts = ${JSON.stringify(meta)};`;
      }
      if (id === `\0${BODIES}`) {
        const bodies = Object.fromEntries(loadPosts(dir).map((p) => [p.slug, p.html]));
        return `export const bodies = ${JSON.stringify(bodies)};`;
      }
    },
    transformIndexHtml() {
      if (!loadPosts(dir).length) return;
      return [
        {
          tag: 'link',
          attrs: { rel: 'alternate', type: 'application/rss+xml', title: FEED_TITLE, href: FEED_PATH },
          injectTo: 'head',
        },
      ];
    },
    generateBundle() {
      // vite-ssg builds twice; the feed belongs to the client output in dist/.
      const posts = loadPosts(dir);
      if (ssr || !posts.length) return;
      this.emitFile({ type: 'asset', fileName: FEED_PATH.slice(1), source: renderFeed(posts) });
    },
    configureServer(server) {
      server.middlewares.use(FEED_PATH, (_req, res, next) => {
        const posts = loadPosts(dir);
        if (!posts.length) return next();
        res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
        res.end(renderFeed(posts));
      });
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
