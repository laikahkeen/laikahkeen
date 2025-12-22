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
import { onMounted, onBeforeUnmount } from 'vue'
import Lenis from 'lenis'
import Navigation from './components/layout/Navigation.vue'
import Footer from './components/layout/Footer.vue'
import HeroSection from './components/sections/HeroSection.vue'
import AboutSection from './components/sections/AboutSection.vue'
import JourneySection from './components/sections/JourneySection.vue'
import SkillsetSection from './components/sections/SkillsetSection.vue'
import ProjectsSection from './components/sections/ProjectsSection.vue'
import ExperienceSection from './components/sections/ExperienceSection.vue'
import ContactSection from './components/sections/ContactSection.vue'

let lenis: Lenis | null = null
let rafId: number | null = null

onMounted(() => {
  // Initialize Lenis smooth scroll
  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
  } as any)

  function raf(time: number) {
    lenis!.raf(time)
    rafId = requestAnimationFrame(raf)
  }

  rafId = requestAnimationFrame(raf)
})

onBeforeUnmount(() => {
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
  if (lenis) {
    lenis.destroy()
  }
})
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
