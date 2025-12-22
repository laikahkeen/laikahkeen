<template>
  <section id="projects" class="py-24 bg-black text-white">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Section Header -->
      <div ref="header" class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          A selection of my recent work and side projects
        </p>
      </div>

      <!-- Projects Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        <div
          v-for="project in projects"
          :key="project.id"
          ref="projectRefs"
        >
          <ProjectCard :project="project" />
        </div>
      </div>

      <!-- View All Link -->
      <div ref="cta" class="text-center mt-12">
        <Button variant="secondary" size="lg" href="https://github.com/laikahkeen" target="_blank">
          View All Projects on GitHub
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectCard from '../ui/ProjectCard.vue'
import Button from '../ui/Button.vue'
import { projects } from '../../data/projects'
import { useScrollAnimation, useStaggerAnimation } from '../../composables/useScrollAnimation'

const header = ref<HTMLElement | null>(null)
const projectRefs = ref<HTMLElement[]>([])
const cta = ref<HTMLElement | null>(null)

useScrollAnimation(header, {
  animation: { y: 50, opacity: 0 }
})

useStaggerAnimation(projectRefs, {
  stagger: 0.2,
  animation: { y: 50, opacity: 0, scale: 0.95 }
})

useScrollAnimation(cta, {
  animation: { y: 30, opacity: 0 }
})
</script>
