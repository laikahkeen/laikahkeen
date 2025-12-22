<template>
  <section id="experience" class="py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Section Header -->
      <div ref="header" class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold mb-4">Work Experience</h2>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          Professional experience and career progression
        </p>
      </div>

      <!-- Experience Items -->
      <div class="max-w-4xl mx-auto space-y-8">
        <div
          v-for="experience in experiences"
          :key="experience.id"
          ref="experienceRefs"
          class="bg-white border-l-4 border-black p-8 shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h3 class="text-2xl font-semibold">{{ experience.role }}</h3>
              <p class="text-lg text-gray-700 font-medium">{{ experience.company }}</p>
            </div>
            <div class="text-gray-500 text-sm mt-2 md:mt-0 md:text-right">
              <p>{{ experience.period }}</p>
              <p>{{ experience.location }}</p>
              <span v-if="experience.current" class="inline-block px-2 py-1 bg-black text-white text-xs font-medium mt-1">
                Current
              </span>
            </div>
          </div>

          <p class="text-gray-600 mb-4">{{ experience.description }}</p>

          <ul class="space-y-2">
            <li
              v-for="(responsibility, index) in experience.responsibilities"
              :key="index"
              class="flex items-start gap-2 text-sm text-gray-600"
            >
              <span class="text-black mt-1">▪</span>
              <span>{{ responsibility }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Download Resume -->
      <div ref="cta" class="text-center mt-12">
        <Button variant="primary" size="lg">
          Download Resume (PDF)
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '../ui/Button.vue'
import { experiences } from '../../data/experience'
import { useScrollAnimation, useStaggerAnimation } from '../../composables/useScrollAnimation'

const header = ref<HTMLElement | null>(null)
const experienceRefs = ref<HTMLElement[]>([])
const cta = ref<HTMLElement | null>(null)

useScrollAnimation(header, {
  animation: { y: 50, opacity: 0 }
})

useStaggerAnimation(experienceRefs, {
  stagger: 0.15,
  animation: { y: 50, opacity: 0 }
})

useScrollAnimation(cta, {
  animation: { y: 30, opacity: 0 }
})
</script>
