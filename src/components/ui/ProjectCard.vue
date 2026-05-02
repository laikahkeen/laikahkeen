<template>
  <div
    class="group relative grid overflow-hidden border border-gray-800 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl lg:grid-cols-[0.9fr_1.1fr]"
  >
    <!-- Image -->
    <div class="relative min-h-72 overflow-hidden bg-gray-100">
      <img
        v-if="project.image"
        :src="project.image"
        :alt="project.title"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      ></div>

      <!-- Featured Badge -->
      <div
        v-if="project.featured"
        class="absolute left-4 top-4 bg-black px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white"
      >
        Featured
      </div>
      <div
        v-if="project.status === 'archived'"
        class="absolute left-4 top-4 border border-white/20 bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-gray-700"
      >
        Archived
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col p-6 md:p-8">
      <div class="mb-5 flex flex-wrap items-center gap-3">
        <p class="text-xs font-medium uppercase tracking-[0.25em] text-gray-500">
          {{ project.status === 'active' ? 'Current build' : 'Archived study' }}
        </p>
        <span class="h-px flex-1 bg-gray-200"></span>
      </div>

      <h3 class="mb-3 text-2xl font-semibold text-black transition-colors group-hover:text-gray-700 md:text-3xl">
        {{ project.title }}
      </h3>
      <p class="mb-6 text-sm leading-7 text-gray-600 md:text-base">
        {{ project.description }}
      </p>

      <dl class="mb-6 grid gap-4 border-y border-gray-200 py-5">
        <div>
          <dt class="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Problem</dt>
          <dd class="mt-2 text-sm leading-6 text-gray-700">{{ project.problem }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Approach</dt>
          <dd class="mt-2 text-sm leading-6 text-gray-700">{{ project.solution }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Signal</dt>
          <dd class="mt-2 text-sm leading-6 text-gray-700">{{ project.impact }}</dd>
        </div>
      </dl>

      <!-- Tags -->
      <div class="mb-4 flex flex-wrap gap-2">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-700"
        >
          {{ tag }}
        </span>
      </div>

      <p class="mb-5 text-xs uppercase tracking-[0.18em] text-gray-500">{{ project.role }}</p>

      <!-- Links -->
      <div class="mt-auto flex gap-4">
        <a
          v-if="project.liveUrl"
          :href="project.liveUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-sm font-medium text-gray-400 hover:underline"
        >
          Live Demo
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
        <a
          v-if="project.githubUrl"
          :href="project.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-sm font-medium text-gray-400 hover:underline"
        >
          GitHub
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
        </a>
      </div>

      <p v-if="project.status === 'archived'" class="mt-4 text-xs uppercase tracking-[0.2em] text-gray-400">
        No longer actively maintained
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '../../types';

interface Props {
  project: Project;
}

defineProps<Props>();
</script>
