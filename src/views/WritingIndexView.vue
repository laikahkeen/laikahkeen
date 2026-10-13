<template>
  <section class="bg-white pb-24 pt-32 text-black">
    <div class="mx-auto max-w-3xl px-6 lg:px-8">
      <h1 class="border-b border-gray-200 pb-10 text-4xl font-bold tracking-tight md:text-5xl">Writing</h1>

      <ol v-if="posts.length" class="divide-y divide-gray-200">
        <li v-for="post in posts" :key="post.slug" class="py-10">
          <time :datetime="post.date" class="text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
            {{ formatDate(post.date) }}
          </time>
          <h2 class="mt-3 text-2xl font-bold tracking-tight">
            <RouterLink :to="`/writing/${post.slug}`" class="underline-offset-4 hover:underline">
              {{ post.title }}
            </RouterLink>
          </h2>
          <p class="mt-4 text-base leading-8 text-gray-700">{{ post.summary }}</p>
        </li>
      </ol>

      <!-- Not prerendered while empty (see writingRoutes), so this only shows in dev. -->
      <p v-else class="mt-10 text-gray-600">Nothing is published here yet.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { posts } from 'virtual:writing';
import { formatDate } from '../writing/date';
import { usePageMeta } from '../composables/usePageMeta';

usePageMeta({
  title: 'Writing - Lai Kah Keen',
  description: 'Writing by Lai Kah Keen.',
  path: '/writing',
});
</script>
