// Starts the server the way the Dockerfile does (`node src/serve.ts`) and lists its tools.
// Catches what tsc and vitest cannot: a module that fails to load under Node's type stripping.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const TIMEOUT_MS = 10_000;
const cwd = fileURLToPath(new URL('..', import.meta.url));

const server = spawn(process.execPath, ['src/serve.ts'], {
  cwd,
  env: { ...process.env, PORT: '0' },
  stdio: ['ignore', 'pipe', 'pipe'],
});

function fail(message) {
  console.error(`smoke: ${message}`);
  server.kill();
  process.exit(1);
}

let output = '';
const port = await new Promise((resolve) => {
  const timer = setTimeout(() => fail(`not listening after ${TIMEOUT_MS}ms\n${output}`), TIMEOUT_MS);
  const onData = (chunk) => {
    output += chunk;
    const match = output.match(/listening on :(\d+)/);
    if (match) {
      clearTimeout(timer);
      resolve(Number(match[1]));
    }
  };
  server.stdout.on('data', onData);
  server.stderr.on('data', onData);
  server.on('exit', (code) => fail(`server exited with code ${code} before listening\n${output}`));
});

const res = await fetch(`http://127.0.0.1:${port}/mcp`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    accept: 'application/json, text/event-stream',
    'x-real-ip': '192.0.2.1',
  },
  body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
});
const text = await res.text();
if (res.status !== 200) fail(`tools/list returned ${res.status}: ${text}`);

let names = [];
try {
  names = (JSON.parse(text).result?.tools ?? []).map((t) => t.name).sort();
} catch {
  fail(`tools/list body is not JSON: ${text}`);
}
if (names.length !== 3) fail(`expected three tools, got ${JSON.stringify(names)}`);

server.removeAllListeners('exit');
server.kill();
console.log(`smoke: ok on Node ${process.version}, tools ${names.join(', ')}`);
