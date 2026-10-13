import { describe, expect, it } from 'vitest';
import { caseStudies, caseStudyFor } from './caseStudies';
import { projects } from './projects';

describe('case studies', () => {
  it('attaches every case study to a real project', () => {
    // A typo here would render nothing at all, silently.
    const slugs = new Set(projects.map((p) => p.slug));
    for (const study of caseStudies) {
      expect(slugs.has(study.slug), `no project for case study "${study.slug}"`).toBe(true);
    }
  });

  it('keeps one case study per slug', () => {
    const slugs = caseStudies.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has a standfirst and non-empty sections', () => {
    for (const study of caseStudies) {
      expect(study.standfirst.trim()).toBeTruthy();
      expect(study.sections.length).toBeGreaterThan(0);
      for (const section of study.sections) {
        expect(section.heading.trim(), `${study.slug} has an unheaded section`).toBeTruthy();
        expect(section.body.length, `${study.slug}/${section.heading} has no body`).toBeGreaterThan(0);
        for (const para of section.body) expect(para.trim()).toBeTruthy();
      }
    }
  });

  it('captions any diagram it declares', () => {
    for (const study of caseStudies) {
      if (!study.diagram) continue;
      expect(study.diagramCaption?.trim(), `${study.slug} declares a diagram with no caption`).toBeTruthy();
    }
  });

  it('keeps the keen-ops write-up honest about what broke', () => {
    // The whole reason this case study exists in its current form (issue #17) is
    // that the card copy claimed more than the code supported. If the incident
    // section is ever dropped, the page has drifted back to the flattering version.
    const study = caseStudyFor('keen-ops');
    expect(study).toBeDefined();
    const all = study!.sections.flatMap((s) => [s.heading, ...s.body]).join(' ');
    expect(all).toContain('22 April 2026');
    expect(all.toLowerCase()).toContain('no inverse');
  });
});
