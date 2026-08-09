<template>
  <div id="app" class="bg-white text-black">
    <Navigation />
    <main>
      <HeroSection id="hero" />
      <AboutSection id="about" />
      <JourneySection id="journey" />
      <SkillsetSection id="skills" />
      <ProjectsSection id="projects" />
      <ExperienceSection id="experience" />
      <ContactSection id="contact" />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Navigation from './components/layout/Navigation.vue';
import Footer from './components/layout/Footer.vue';
import HeroSection from './components/sections/HeroSection.vue';
import AboutSection from './components/sections/AboutSection.vue';
import JourneySection from './components/sections/JourneySection.vue';
import SkillsetSection from './components/sections/SkillsetSection.vue';
import ProjectsSection from './components/sections/ProjectsSection.vue';
import ExperienceSection from './components/sections/ExperienceSection.vue';
import ContactSection from './components/sections/ContactSection.vue';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

onMounted(() => {
  // Anyone who has asked the OS for less motion gets native scrolling.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  lenis = new Lenis({
    // Frame-rate independent smoothing. This replaced `duration: 1.2` plus a
    // custom easing, which was what made the page feel sluggish — it was never
    // dropped frames (the page holds ~110fps with one long frame across a
    // full-page scroll).
    //
    // Higher lerp = snappier. Time to cover 90% of a scroll distance is
    // roughly `ln(0.1) / ln(1 - lerp)` frames at 60fps, so:
    //
    //   lerp 0.10 -> ~365ms   (measured 385ms — still draggy)
    //   lerp 0.15 -> ~235ms
    //   lerp 0.20 -> ~170ms   (current: responsive, still smooth)
    //
    // If scrolling ever feels heavy again, this number is the first thing to
    // look at, not the animations. Do not reintroduce `duration`; it is
    // frame-rate dependent and mutually exclusive with lerp.
    lerp: 0.2,
    smoothWheel: true,
  });

  // Keep ScrollTrigger in step with Lenis, and drive Lenis from GSAP's ticker
  // instead of a second requestAnimationFrame loop of our own. lagSmoothing(0)
  // stops GSAP from trying to compensate for frame gaps, which fights Lenis.
  lenis.on('scroll', ScrollTrigger.update);
  tick = (time: number) => lenis?.raf(time * 1000); // ticker gives seconds, Lenis wants ms
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
});

onBeforeUnmount(() => {
  if (tick) gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
});
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
