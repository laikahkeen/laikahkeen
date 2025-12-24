<template>
  <div class="group relative inline-block">
    <div :class="tagClasses">
      <span class="font-medium">{{ name }}</span>
    </div>

    <!-- Progress bar tooltip on hover -->
    <div class="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-48 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <div class="rounded-lg border border-gray-300 bg-white p-3 shadow-lg">
        <div class="mb-2 flex items-center justify-between text-xs">
          <span class="font-medium capitalize text-gray-700">{{ levelText }}</span>
          <span class="text-gray-500">{{ levelPercentage }}%</span>
        </div>
        <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            class="h-full bg-black transition-all duration-500"
            :style="{ width: levelPercentage + '%' }"
          ></div>
        </div>
      </div>
      <!-- Tooltip arrow -->
      <div class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        <div class="h-2 w-2 rotate-45 border-l border-t border-gray-300 bg-white"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SkillLevel } from '../../types';

interface Props {
  name: string;
  level?: SkillLevel;
}

const props = withDefaults(defineProps<Props>(), {
  level: 'intermediate',
});

const tagClasses = computed(() => {
  return [
    'inline-flex items-center px-4 py-2 rounded-full',
    'border border-gray-300 bg-white text-black',
    'transition-all duration-300',
    'group-hover:border-black group-hover:shadow-md group-hover:-translate-y-0.5',
    'text-sm',
  ].join(' ');
});

const levelPercentage = computed(() => {
  const percentages: Record<SkillLevel, number> = {
    beginner: 30,
    intermediate: 60,
    advanced: 90,
    expert: 100,
  };
  return percentages[props.level] || 60;
});

const levelText = computed(() => {
  return props.level;
});
</script>
