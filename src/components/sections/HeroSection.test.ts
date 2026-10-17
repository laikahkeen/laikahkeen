import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { scrollToSection } from '../../composables/useLenis';
import HeroSection from './HeroSection.vue';

vi.mock('../../composables/useLenis', () => ({ scrollToSection: vi.fn() }));

describe('HeroSection', () => {
  it('sends both calls to action through the shared scroller', async () => {
    const wrapper = mount(HeroSection);
    const button = (label: string) => wrapper.findAll('button').find((b) => b.text() === label)!;

    await button('View My Work').trigger('click');
    expect(scrollToSection).toHaveBeenLastCalledWith('projects');

    await button('Get In Touch').trigger('click');
    expect(scrollToSection).toHaveBeenLastCalledWith('contact');
  });
});
