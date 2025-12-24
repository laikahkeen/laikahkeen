<template>
  <section id="about" class="bg-gray-50 py-24">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="grid items-center gap-12 md:grid-cols-2">
        <!-- Profile Photo -->
        <div ref="imageContainer" class="order-2 flex justify-center md:order-1 md:justify-end">
          <div class="group relative h-80 w-80">
            <div
              class="absolute inset-0 translate-x-4 translate-y-4 border-2 border-black transition-transform duration-300 group-hover:translate-x-6 group-hover:translate-y-6"
            ></div>
            <div class="relative h-full w-full overflow-hidden bg-gray-300">
              <img
                src="/images/profile.jpeg"
                alt="Lai Kah Keen"
                class="h-full w-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <!-- About Content -->
        <div ref="content" class="order-1 md:order-2">
          <h2 class="mb-6 text-4xl font-bold md:text-5xl">About Me</h2>
          <div class="space-y-4 leading-relaxed text-gray-600">
            <p ref="p1">
              I'm a software engineer who builds things with intention. Professionally, I work as a full stack
              developer, often in fast-moving environments where clarity matters more than complexity. I enjoy turning
              messy requirements into calm, usable systems — whether that's a UI flow, a form that actually makes sense,
              or an interface that doesn't fight the user. I value maintainability, good structure, and decisions that
              age well. I'm comfortable working independently, adapting quickly, and taking ownership from idea to
              execution.
            </p>
            <p ref="p2">
              Personally, I'm driven by curiosity and a need to understand how things really work — systems, people, and
              myself included. I care about living well, not just being productive. I enjoy cooking, reading books,
              spending time in nature, and traveling slowly enough to notice details. I'm experimenting with a more
              flexible, location-independent lifestyle, balancing focused work with meaningful experiences.
            </p>
            <p ref="p3">
              I'm not chasing noise or titles. I'm interested in building useful products, improving my craft over time,
              and designing a life that feels aligned — thoughtful work, deliberate growth, and space to explore.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useScrollAnimation } from '../../composables/useScrollAnimation';

const imageContainer = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);

useScrollAnimation(imageContainer, {
  animation: { x: -50, opacity: 0, duration: 1 },
});

useScrollAnimation(content, {
  animation: { x: 50, opacity: 0, duration: 1 },
});
</script>
