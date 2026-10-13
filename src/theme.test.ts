import { describe, expect, it } from 'vitest';
import config from '../tailwind.config';

/**
 * The accent is the one non-neutral in the palette and the theme decision rests on
 * its contrast, so the number is asserted rather than trusted to a comment. If
 * someone swaps the hex, this is what stops it silently shipping an illegible
 * accent — or an accent that would have allowed a light theme after all, which is
 * a decision to revisit rather than absorb.
 */

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const channels = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const linear = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const [r, g, b] = linear as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const colors = (config as { theme: { colors: Record<string, unknown> } }).theme.colors;
const accent = (colors.accent as { DEFAULT: string; hover: string }).DEFAULT;
const accentHover = (colors.accent as { DEFAULT: string; hover: string }).hover;

describe('accent contrast', () => {
  it('sanity-checks the contrast maths against known pairs', () => {
    // Black on white is the documented maximum, 21:1.
    expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrast('#000000', '#000000')).toBeCloseTo(1, 5);
  });

  it('clears WCAG AA for text on the dark surface', () => {
    expect(contrast(accent, '#000000')).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the hover variant legible too', () => {
    expect(contrast(accentHover, '#000000')).toBeGreaterThanOrEqual(4.5);
  });

  it('records why there is no light theme', () => {
    // Not a requirement being enforced — a measurement being pinned. This accent
    // fails AA on white, which is the whole reason the theme is dark-only. If this
    // ever passes, the dark-only decision was made on a premise that no longer
    // holds and should be reopened rather than quietly kept.
    expect(contrast(accent, '#FFFFFF')).toBeLessThan(4.5);
  });

  it('keeps the palette otherwise monochrome', () => {
    // theme.colors replaces rather than extends, so this list is the whole palette.
    const nonNeutral = Object.keys(colors).filter(
      (k) => !['black', 'white', 'gray', 'transparent', 'current'].includes(k),
    );
    expect(nonNeutral).toEqual(['accent']);
  });
});
