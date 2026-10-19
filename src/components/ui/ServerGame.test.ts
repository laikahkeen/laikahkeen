import { afterEach, describe, expect, it, vi } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import { serverGame } from '../../data/mcp';
import ServerGame from './ServerGame.vue';

const dialog = () => document.body.querySelector('[role="dialog"]');

enableAutoUnmount(afterEach);

describe('ServerGame', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('offers the door with copy from the data file', () => {
    const wrapper = mount(ServerGame);
    expect(wrapper.text()).toContain(serverGame.enter);
    expect(dialog()).toBeNull();
  });

  it('opens over the page and holds its scroll', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {}))
    );
    const wrapper = mount(ServerGame);
    await wrapper.find('button').trigger('click');

    expect(dialog()?.getAttribute('aria-label')).toBe(serverGame.enter);
    expect(document.documentElement.style.overflow).toBe('hidden');
  });

  // jsdom has no WebGL and cannot fetch the model, which is exactly the failure path.
  it('closes, releases the page and removes the door when the room cannot load', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Promise.reject(new Error('offline')))
    );
    const wrapper = mount(ServerGame);
    await wrapper.find('button').trigger('click');

    await vi.waitFor(() => expect(dialog()).toBeNull());
    expect(document.documentElement.style.overflow).toBe('');
    expect(wrapper.text()).not.toContain(serverGame.enter);
  });
});
