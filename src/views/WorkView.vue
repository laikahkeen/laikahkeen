<template>
  <article v-if="project" class="bg-white pb-24 pt-32 text-black">
    <div class="mx-auto max-w-3xl px-6 lg:px-8">
      <RouterLink to="/#projects" class="text-sm text-gray-500 underline-offset-4 hover:text-black hover:underline">
        ← All work
      </RouterLink>

      <header class="mt-8 border-b border-gray-200 pb-10">
        <p class="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
          {{ project.status === 'active' ? 'Current build' : 'Archived' }}
        </p>
        <h1 class="text-4xl font-bold tracking-tight md:text-5xl">{{ project.title }}</h1>
        <p class="mt-6 text-lg leading-8 text-gray-600">{{ project.description }}</p>

        <ul class="mt-8 flex flex-wrap gap-2">
          <li
            v-for="tag in project.tags"
            :key="tag"
            class="border border-gray-300 px-3 py-1 text-xs font-medium tracking-wide text-gray-600"
          >
            {{ tag }}
          </li>
        </ul>

        <div v-if="project.liveUrl || project.githubUrl" class="mt-8 flex flex-wrap gap-6 text-sm">
          <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noopener" class="underline">
            Live site
          </a>
          <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" rel="noopener" class="underline">
            Source
          </a>
        </div>
      </header>

      <!-- Content comes from src/data/projects.ts, so this page and the card on
           the home page cannot disagree. Longer prose per project lands here in
           week 4 (PLAN.md); until then this renders what is actually known. -->
      <dl class="mt-12 space-y-10">
        <div v-for="row in rows" :key="row.term">
          <dt class="text-xs font-medium uppercase tracking-[0.3em] text-gray-500">{{ row.term }}</dt>
          <dd class="mt-3 text-base leading-8 text-gray-700">{{ row.value }}</dd>
        </div>
      </dl>
    </div>
  </article>

  <section v-else class="bg-white pb-24 pt-32 text-black">
    <div class="mx-auto max-w-3xl px-6 lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight">No such project</h1>
      <p class="mt-4 text-gray-600">Nothing is published at this address.</p>
      <RouterLink to="/#projects" class="mt-8 inline-block underline">See the work that is →</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { projects } from '../data/projects';

const route = useRoute();

const project = computed(() => projects.find((p) => p.slug === route.params.slug));

const rows = computed(() =>
  project.value
    ? [
        { term: 'Problem', value: project.value.problem },
        { term: 'Approach', value: project.value.solution },
        { term: 'Signal', value: project.value.impact },
        { term: 'Role', value: project.value.role },
      ]
    : [],
);
</script>
