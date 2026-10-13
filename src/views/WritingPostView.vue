<template>
  <article v-if="post" class="bg-white pb-24 pt-32 text-black">
    <div class="mx-auto max-w-3xl px-6 lg:px-8">
      <RouterLink to="/writing" class="text-sm text-gray-500 underline-offset-4 hover:text-black hover:underline">
        {{ writingPost.backLink }}
      </RouterLink>

      <header class="mt-8 border-b border-gray-200 pb-10">
        <time :datetime="post.date" class="text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
          {{ formatDate(post.date) }}
        </time>
        <h1 class="mt-4 text-4xl font-bold tracking-tight md:text-5xl">{{ post.title }}</h1>
      </header>

      <!-- Rendered at build time by markdown-it with raw HTML disabled. -->
      <div class="post-body mt-12" v-html="post.html" />
    </div>
  </article>

  <section v-else class="bg-white pb-24 pt-32 text-black">
    <div class="mx-auto max-w-3xl px-6 lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight">{{ writingPost.notFoundHeading }}</h1>
      <p class="mt-4 text-gray-600">{{ writingPost.notFoundBody }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { posts } from 'virtual:writing';
import { bodies } from 'virtual:writing/bodies';
import { formatDate } from '../writing/date';
import { usePageMeta } from '../composables/usePageMeta';
import { writingPost } from '../data/writingPages';

const route = useRoute();

const post = computed(() => {
  const meta = posts.find((p) => p.slug === route.params.slug);
  return meta && { ...meta, html: bodies[meta.slug] };
});

usePageMeta(() =>
  post.value
    ? {
        title: `${post.value.title}${writingPost.titleSuffix}`,
        description: post.value.summary,
        path: `/writing/${post.value.slug}/`,
        published: post.value.date,
      }
    : undefined
);
</script>

<style scoped>
/* Markdown output cannot carry utility classes, so the long-form rhythm is set
   here. Scoped to this view so it ships in its lazy chunk, not on the home page. */
.post-body :deep(> * + *) {
  @apply mt-6;
}
.post-body :deep(p),
.post-body :deep(li) {
  @apply text-base leading-8 text-gray-700;
}
.post-body :deep(h2) {
  @apply mt-12 text-2xl font-bold tracking-tight text-black;
}
.post-body :deep(h3) {
  @apply mt-10 text-xl font-bold tracking-tight text-black;
}
.post-body :deep(h4) {
  @apply mt-8 font-bold text-black;
}
.post-body :deep(a) {
  @apply text-black underline underline-offset-4 hover:text-gray-600;
}
.post-body :deep(strong) {
  @apply font-semibold text-black;
}
.post-body :deep(ul) {
  @apply list-disc space-y-2 pl-6;
}
.post-body :deep(ol) {
  @apply list-decimal space-y-2 pl-6;
}
.post-body :deep(blockquote) {
  @apply border-l-2 border-gray-300 pl-6 text-gray-600;
}
.post-body :deep(code) {
  @apply bg-gray-100 px-1 py-0.5 font-mono text-[0.875em] text-black;
}
.post-body :deep(pre) {
  @apply overflow-x-auto bg-gray-100 p-4 text-sm leading-6;
}
.post-body :deep(pre code) {
  @apply bg-transparent p-0;
}
.post-body :deep(hr) {
  @apply my-12 border-gray-200;
}
.post-body :deep(img) {
  @apply h-auto max-w-full;
}
.post-body :deep(table) {
  @apply block w-full overflow-x-auto text-left text-sm;
}
.post-body :deep(th),
.post-body :deep(td) {
  @apply border-b border-gray-200 py-2 pr-6;
}
</style>
