<template>
  <section id="skills" class="bg-white py-24">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <!-- Section Header -->
      <div ref="header" class="mb-16 text-center">
        <h2 class="mb-4 text-4xl font-bold md:text-5xl">Skills & Expertise</h2>
        <p class="mx-auto max-w-2xl text-lg text-gray-600">
          A comprehensive toolkit for building modern web applications
        </p>
      </div>

      <!-- Skills Grid -->
      <div ref="skillsGrid" class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="category in skillCategories"
          :key="category.title"
          class="border border-gray-200 bg-gray-50 p-6 transition-all duration-300 hover:border-black"
        >
          <h3 class="mb-4 text-xl font-semibold">{{ category.title }}</h3>
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
import { ref } from 'vue';
import SkillTag from '../ui/SkillTag.vue';
import { skillCategories } from '../../data/skills';
import { useScrollAnimation } from '../../composables/useScrollAnimation';

const header = ref<HTMLElement | null>(null);
const skillsGrid = ref<HTMLElement | null>(null);

useScrollAnimation(header, {
  animation: { y: 50, opacity: 0 },
});

useScrollAnimation(skillsGrid, {
  animation: { y: 50, opacity: 0 },
});
</script>
