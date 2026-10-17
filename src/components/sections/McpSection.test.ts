import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import McpSection from './McpSection.vue';
import { mcpPanel } from '../../data/mcp';

// Names that exist nowhere in the codebase, so a pass proves the list came from
// the response rather than from the component.
const SERVED = [
  { name: 'probe_alpha', description: 'First tool, as the endpoint describes it.' },
  { name: 'probe_beta', description: 'Second tool, as the endpoint describes it.' },
];

const ACCENT = /\b(?:text|bg|border)-accent\b/;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

function liveServer() {
  return vi.fn(async (_url: string, init: RequestInit) => {
    const req = JSON.parse(init.body as string);
    if (req.method === 'initialize') {
      return jsonResponse({ jsonrpc: '2.0', id: req.id, result: { protocolVersion: '2025-06-18', capabilities: {} } });
    }
    return jsonResponse({ jsonrpc: '2.0', id: req.id, result: { tools: SERVED } });
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('McpSection', () => {
  it('prerenders a neutral checking state with the endpoint and no fetch', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const html = await renderToString(createSSRApp(McpSection));

    expect(html).toContain(mcpPanel.endpoint);
    expect(html).toContain(mcpPanel.status.checking);
    expect(html).not.toMatch(ACCENT);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('shows the checking state while the request is in flight', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {}))
    );
    const wrapper = mount(McpSection);

    expect(wrapper.find('[data-state]').attributes('data-state')).toBe('checking');
    expect(wrapper.text()).toContain(mcpPanel.status.checking);
    expect(wrapper.html()).not.toMatch(ACCENT);
  });

  it('renders the tool list the endpoint returns, in the accent, once live', async () => {
    const fetchSpy = liveServer();
    vi.stubGlobal('fetch', fetchSpy);
    const wrapper = mount(McpSection);
    await flushPromises();

    expect(wrapper.find('[data-state]').attributes('data-state')).toBe('live');
    expect(wrapper.text()).toContain(mcpPanel.status.live);
    for (const tool of SERVED) {
      expect(wrapper.text()).toContain(tool.name);
      expect(wrapper.text()).toContain(tool.description);
    }
    expect(wrapper.html()).toMatch(ACCENT);

    const [first, second] = fetchSpy.mock.calls.map(([url, init]) => ({ url, init }));
    expect(first!.url).toBe(mcpPanel.endpoint);
    expect(JSON.parse(first!.init.body as string).method).toBe('initialize');
    expect(JSON.parse(second!.init.body as string).method).toBe('tools/list');
    expect((second!.init.headers as Record<string, string>)['mcp-protocol-version']).toBe('2025-06-18');
  });

  it('re-measures scroll triggers once the tool list has rendered, and only then', async () => {
    let toolsInDomAtRefresh = -1;
    const refresh = vi.spyOn(ScrollTrigger, 'refresh').mockImplementation(() => {
      toolsInDomAtRefresh = wrapper.findAll('li').length;
    });
    vi.stubGlobal('fetch', liveServer());
    const wrapper = mount(McpSection);
    await flushPromises();
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(toolsInDomAtRefresh).toBe(SERVED.length);

    refresh.mockClear();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    mount(McpSection);
    await flushPromises();
    expect(refresh).not.toHaveBeenCalled();
  });

  it('falls back to a neutral unreachable state when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const wrapper = mount(McpSection);
    await flushPromises();

    expect(wrapper.find('[data-state]').attributes('data-state')).toBe('unreachable');
    expect(wrapper.text()).toContain(mcpPanel.status.unreachable);
    expect(wrapper.text()).toContain(mcpPanel.endpoint);
    expect(wrapper.text()).not.toContain(mcpPanel.status.live);
    expect(wrapper.html()).not.toMatch(ACCENT);
  });

  it('treats a rate-limited or erroring endpoint as unreachable, not live', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ jsonrpc: '2.0', id: null, error: { code: -32029, message: 'slow down' } }, 429))
    );
    const wrapper = mount(McpSection);
    await flushPromises();

    expect(wrapper.find('[data-state]').attributes('data-state')).toBe('unreachable');
    expect(wrapper.html()).not.toMatch(ACCENT);
  });

  it('gives up after the timeout rather than checking forever', async () => {
    vi.useFakeTimers();
    try {
      vi.stubGlobal(
        'fetch',
        vi.fn(
          (_url: string, init: RequestInit) =>
            new Promise((_, reject) => init.signal!.addEventListener('abort', () => reject(new Error('aborted'))))
        )
      );
      const wrapper = mount(McpSection);
      await vi.advanceTimersByTimeAsync(10_000);
      expect(wrapper.find('[data-state]').attributes('data-state')).toBe('unreachable');
    } finally {
      vi.useRealTimers();
    }
  });
});
