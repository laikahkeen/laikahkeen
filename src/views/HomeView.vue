<template>
  <!-- tabindex -1: scrollToSection moves focus here, as a native anchor would. -->
  <HeroSection id="hero" tabindex="-1" />
  <AboutSection id="about" tabindex="-1" />
  <JourneySection id="journey" tabindex="-1" />
  <SkillsetSection id="skills" tabindex="-1" />
  <ProjectsSection id="projects" tabindex="-1" />
  <McpSection id="mcp" tabindex="-1" />
  <ExperienceSection id="experience" tabindex="-1" />
  <ContactSection id="contact" tabindex="-1" />
</template>

<script setup lang="ts">
import HeroSection from '../components/sections/HeroSection.vue';
import AboutSection from '../components/sections/AboutSection.vue';
import JourneySection from '../components/sections/JourneySection.vue';
import SkillsetSection from '../components/sections/SkillsetSection.vue';
import ProjectsSection from '../components/sections/ProjectsSection.vue';
import McpSection from '../components/sections/McpSection.vue';
import ExperienceSection from '../components/sections/ExperienceSection.vue';
import ContactSection from '../components/sections/ContactSection.vue';
</script>
