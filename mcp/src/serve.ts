import { serve } from '@hono/node-server';
import { handleMcpRequest } from './index.ts';

const port = Number(process.env.PORT ?? 8787);

serve({ fetch: handleMcpRequest, port }, (info) => {
  console.log(`laikahkeen-mcp listening on :${info.port}`);
});
