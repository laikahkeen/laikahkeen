<template>
  <div :class="tagClasses">
    <span class="font-medium">{{ name }}</span>
    <span v-if="showLevel" class="ml-2 text-xs opacity-70">
      {{ levelLabel }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SkillLevel } from '../../types';

interface Props {
  name: string;
  level?: SkillLevel;
  showLevel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  level: 'intermediate',
  showLevel: false,
});

const tagClasses = computed(() => {
  return [
    'inline-flex items-center px-4 py-2 rounded-full',
    'border border-gray-300 bg-white text-black',
    'transition-all duration-300',
    'hover:border-black hover:shadow-md hover:-translate-y-0.5',
    'text-sm',
  ].join(' ');
});

const levelLabel = computed(() => {
  const levels: Record<SkillLevel, string> = {
    beginner: '⭐',
    intermediate: '⭐⭐',
    advanced: '⭐⭐⭐',
    expert: '⭐⭐⭐⭐',
  };
  return levels[props.level] || '';
});
</script>
