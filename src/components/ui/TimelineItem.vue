<template>
  <div class="relative flex gap-6 group">
    <!-- Timeline Line & Dot -->
    <div class="flex flex-col items-center">
      <!-- Year Badge -->
      <div class="w-16 h-16 rounded-full border-2 border-black bg-white flex items-center justify-center font-mono font-bold text-sm mb-4 group-hover:bg-black group-hover:text-white transition-all duration-300">
        {{ year }}
      </div>

      <!-- Vertical Line (only if not last item) -->
      <div v-if="!isLast" class="w-0.5 bg-gray-300 flex-1 min-h-[80px] group-hover:bg-black transition-colors duration-300"></div>
    </div>

    <!-- Content -->
    <div class="flex-1 pb-12">
      <div class="bg-white border border-gray-200 p-6 group-hover:border-black group-hover:shadow-lg transition-all duration-300">
        <!-- Type Badge -->
        <div class="inline-block px-3 py-1 text-xs font-medium border border-gray-300 mb-3" :class="typeBadgeClass">
          {{ typeLabel }}
        </div>

        <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
        <p class="text-gray-600 text-sm leading-relaxed">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MilestoneType } from '../../types'

interface Props {
  year: string
  title: string
  description: string
  type?: MilestoneType
  isLast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'career',
  isLast: false
})

const typeLabel = computed(() => {
  const labels: Record<MilestoneType, string> = {
    career: 'Career',
    education: 'Education',
    learning: 'Learning',
    achievement: 'Achievement'
  }
  return labels[props.type] || 'Milestone'
})

const typeBadgeClass = computed(() => {
  return 'bg-white text-black'
})
</script>
