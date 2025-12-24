<template>
  <section id="experience" class="bg-gray-50 py-24">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <!-- Section Header -->
      <div ref="header" class="mb-16 text-center">
        <h2 class="mb-4 text-4xl font-bold md:text-5xl">Work Experience</h2>
        <p class="mx-auto max-w-2xl text-lg text-gray-600">Professional experience and career progression</p>
      </div>

      <!-- Experience Items -->
      <div ref="experienceContainer" class="mx-auto max-w-4xl space-y-8">
        <div
          v-for="experience in experiences"
          :key="experience.id"
          class="border-l-4 border-black bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg"
        >
          <div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 class="text-2xl font-semibold">{{ experience.role }}</h3>
              <p class="text-lg font-medium text-gray-700">{{ experience.company }}</p>
            </div>
            <div class="mt-2 text-sm text-gray-500 md:mt-0 md:text-right">
              <p>{{ experience.period }}</p>
              <p>{{ experience.location }}</p>
              <span
                v-if="experience.current"
                class="mt-1 inline-block bg-black px-2 py-1 text-xs font-medium text-white"
              >
                Current
              </span>
            </div>
          </div>

          <p class="mb-4 text-gray-600">{{ experience.description }}</p>

          <ul class="space-y-2">
            <li
              v-for="(responsibility, index) in experience.responsibilities"
              :key="index"
              class="flex items-start gap-2 text-sm text-gray-600"
            >
              <span class="mt-1 text-black">▪</span>
              <span>{{ responsibility }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Download Resume -->
      <div ref="cta" class="mt-12 text-center">
        <a href="https://linkedin.com/in/lai-kah-keen" target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="lg"> Download Resume (PDF) </Button>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '../ui/Button.vue';
import { experiences } from '../../data/experience';
import { useScrollAnimation } from '../../composables/useScrollAnimation';

const header = ref<HTMLElement | null>(null);
const experienceContainer = ref<HTMLElement | null>(null);
const cta = ref<HTMLElement | null>(null);

useScrollAnimation(header, {
  animation: { y: 50, opacity: 0 },
});

useScrollAnimation(experienceContainer, {
  animation: { y: 50, opacity: 0 },
});

useScrollAnimation(cta, {
  animation: { y: 30, opacity: 0 },
});
</script>
