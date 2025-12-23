<template>
  <section id="journey" class="bg-white py-24">
    <div class="mx-auto max-w-5xl px-6 lg:px-8">
      <!-- Section Header -->
      <div ref="header" class="mb-16 text-center">
        <h2 class="mb-4 text-4xl font-bold md:text-5xl">My Journey</h2>
        <p class="mx-auto max-w-2xl text-lg text-gray-600">Key milestones in my professional and educational path</p>
      </div>

      <!-- Timeline -->
      <div class="relative">
        <TimelineItem
          v-for="(milestone, index) in journeyMilestones"
          :key="milestone.id"
          :ref="
            (el) => {
              if (el) timelineRefs[index] = el;
            }
          "
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
import { ref, onMounted } from 'vue';
import TimelineItem from '../ui/TimelineItem.vue';
import { journeyMilestones } from '../../data/journey';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const header = ref<HTMLElement | null>(null);
const timelineRefs = ref<any[]>([]);

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
    ease: 'power3.out',
  });

  // Stagger timeline items
  if (timelineRefs.value.length > 0) {
    gsap.from(
      timelineRefs.value.map((ref) => ref.$el),
      {
        scrollTrigger: {
          trigger: timelineRefs.value[0].$el,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      }
    );
  }
});
</script>
