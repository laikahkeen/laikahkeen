<template>
  <div class="group relative flex gap-6">
    <!-- Timeline Line & Dot -->
    <div class="flex flex-col items-center">
      <!-- Year Badge -->
      <div
        class="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-white font-mono text-sm font-bold transition-all duration-300 group-hover:bg-black group-hover:text-white"
      >
        {{ year }}
      </div>

      <!-- Vertical Line (only if not last item) -->
      <div
        v-if="!isLast"
        class="min-h-[80px] w-0.5 flex-1 bg-gray-300 transition-colors duration-300 group-hover:bg-black"
      ></div>
    </div>

    <!-- Content -->
    <div class="flex-1 pb-12">
      <div
        class="border border-gray-200 bg-white p-6 transition-all duration-300 group-hover:border-black group-hover:shadow-lg"
      >
        <!-- Type Badge -->
        <div class="mb-3 inline-block border border-gray-300 px-3 py-1 text-xs font-medium" :class="typeBadgeClass">
          {{ typeLabel }}
        </div>

        <h3 class="mb-2 text-xl font-semibold">{{ title }}</h3>
        <p class="text-sm leading-relaxed text-gray-600">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MilestoneType } from '../../types';

interface Props {
  year: string;
  title: string;
  description: string;
  type?: MilestoneType;
  isLast?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'career',
  isLast: false,
});

const typeLabel = computed(() => {
  const labels: Record<MilestoneType, string> = {
    career: 'Career',
    education: 'Education',
    learning: 'Learning',
    achievement: 'Achievement',
  };
  return labels[props.type] || 'Milestone';
});

const typeBadgeClass = computed(() => {
  return 'bg-white text-black';
});
</script>
