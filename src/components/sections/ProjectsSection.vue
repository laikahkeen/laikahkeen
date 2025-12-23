<template>
  <section id="projects" class="bg-black py-24 text-white">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <!-- Section Header -->
      <div ref="header" class="mb-16 text-center">
        <h2 class="mb-4 text-4xl font-bold md:text-5xl">Featured Projects</h2>
        <p class="mx-auto max-w-2xl text-lg text-gray-400">A selection of my recent work and side projects</p>
      </div>

      <!-- Projects Grid -->
      <div ref="projectRefs" class="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
      </div>

      <!-- View All Link -->
      <div ref="cta" class="mt-12 text-center">
        <Button variant="secondary" size="lg" href="https://github.com/laikahkeen" target="_blank">
          View All Projects on GitHub
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ProjectCard from '../ui/ProjectCard.vue';
import Button from '../ui/Button.vue';
import { projects } from '../../data/projects';
import { useScrollAnimation } from '../../composables/useScrollAnimation';

const header = ref<HTMLElement | null>(null);
const projectRefs = ref<HTMLElement | null>(null);
const cta = ref<HTMLElement | null>(null);

useScrollAnimation(header, {
  animation: { y: 50, opacity: 0 },
});

useScrollAnimation(projectRefs, {
  animation: { y: 50, opacity: 0 },
});

useScrollAnimation(cta, {
  animation: { y: 30, opacity: 0 },
});
</script>
