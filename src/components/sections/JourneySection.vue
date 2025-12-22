<template>
  <section id="journey" class="py-24 bg-white">
    <div class="max-w-5xl mx-auto px-6 lg:px-8">
      <!-- Section Header -->
      <div ref="header" class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold mb-4">My Journey</h2>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          Key milestones in my professional and educational path
        </p>
      </div>

      <!-- Timeline -->
      <div class="relative">
        <TimelineItem
          v-for="(milestone, index) in journeyMilestones"
          :key="milestone.id"
          :ref="el => { if (el) timelineRefs[index] = el }"
          :year="milestone.year"
          :title="milestone.title"
          :description="milestone.description"
          :type="milestone.type"
          :isLast="index === journeyMilestones.length - 1"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TimelineItem from '../ui/TimelineItem.vue'
import { journeyMilestones } from '../../data/journey'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const header = ref<HTMLElement | null>(null)
const timelineRefs = ref<any[]>([])

onMounted(() => {
  // Header animation
  gsap.from(header.value, {
    scrollTrigger: {
      trigger: header.value,
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })

  // Stagger timeline items
  if (timelineRefs.value.length > 0) {
    gsap.from(timelineRefs.value.map(ref => ref.$el), {
      scrollTrigger: {
        trigger: timelineRefs.value[0].$el,
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    })
  }
})
</script>
