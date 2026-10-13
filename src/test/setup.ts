// jsdom does not implement matchMedia, and GSAP's ScrollTrigger calls it during
// registerPlugin — which runs at module scope in useParallax.ts. Without this,
// any test that imports the router fails at collection, because the router
// eagerly imports HomeView and therefore every section component.
//
// matches:false means both guards in the app read as "reduced motion off, no
// fine pointer", so motion is never exercised under jsdom. Component tests here
// cannot assert animation behaviour — only structure and content.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}
