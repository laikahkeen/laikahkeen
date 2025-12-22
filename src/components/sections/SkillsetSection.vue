<template>
  <section id="skills" class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Section Header -->
      <div ref="header" class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold mb-4">Skills & Expertise</h2>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          A comprehensive toolkit for building modern web applications
        </p>
      </div>

      <!-- Skills Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="category in skillCategories"
          :key="category.title"
          ref="categoryRefs"
          class="bg-gray-50 p-6 border border-gray-200 hover:border-black transition-all duration-300"
        >
          <h3 class="text-xl font-semibold mb-4">{{ category.title }}</h3>
          <div class="space-y-2">
            <SkillTag
              v-for="skill in category.skills"
              :key="skill.name"
              :name="skill.name"
              :level="skill.level"
              class="mb-2"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SkillTag from '../ui/SkillTag.vue'
import { skillCategories } from '../../data/skills'
import { useScrollAnimation, useStaggerAnimation } from '../../composables/useScrollAnimation'

const header = ref<HTMLElement | null>(null)
const categoryRefs = ref<HTMLElement[]>([])

useScrollAnimation(header, {
  animation: { y: 50, opacity: 0 }
})

useStaggerAnimation(categoryRefs, {
  stagger: 0.15,
  animation: { y: 50, opacity: 0 }
})
</script>
