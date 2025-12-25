<template>
  <section class="relative flex min-h-screen items-center justify-center overflow-hidden bg-white">
    <!-- Parallax Background Shapes -->
    <div class="absolute inset-0 overflow-hidden">
      <div ref="shape1" class="absolute left-10 top-20 h-64 w-64 rotate-12 border border-gray-200"></div>
      <div ref="shape2" class="absolute bottom-20 right-10 h-80 w-80 -rotate-12 border border-gray-200"></div>
      <div ref="shape3" class="absolute left-1/4 top-1/2 h-32 w-32 rotate-45 border border-gray-300"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-8">
      <div ref="content">
        <!-- Animated Name -->
        <div class="mb-6 overflow-hidden">
          <h1 ref="name" class="text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl">Lai Kah Keen</h1>
        </div>

        <!-- Tagline -->
        <div class="mb-8 overflow-hidden">
          <p ref="tagline" class="text-xl font-light text-gray-600 md:text-2xl lg:text-3xl">Full Stack Developer</p>
        </div>

        <!-- Description -->
        <div class="mb-12 overflow-hidden">
          <p ref="description" class="mx-auto max-w-2xl text-base text-gray-500 md:text-lg">
            Crafting elegant digital experiences with modern web technologies.
          </p>
        </div>

        <!-- CTA Buttons -->
        <div ref="cta" class="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="primary" size="lg" @click="scrollToProjects"> View My Work </Button>
          <Button variant="secondary" size="lg" @click="scrollToContact"> Get In Touch </Button>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div ref="scrollIndicator" class="absolute bottom-8 left-1/2 -translate-x-1/2">
      <div class="flex h-10 w-6 animate-bounce justify-center rounded-full border-2 border-black p-2">
        <div class="h-3 w-1 rounded-full bg-black"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import Button from '../ui/Button.vue';
import { useMouseParallax } from '../../composables/useParallax';

const name = ref<HTMLElement | null>(null);
const tagline = ref<HTMLElement | null>(null);
const description = ref<HTMLElement | null>(null);
const cta = ref<HTMLElement | null>(null);
const scrollIndicator = ref<HTMLElement | null>(null);
const shape1 = ref<HTMLElement | null>(null);
const shape2 = ref<HTMLElement | null>(null);
const shape3 = ref<HTMLElement | null>(null);

// Mouse parallax for shapes
useMouseParallax(shape1, { strength: 150 });
useMouseParallax(shape2, { strength: -200 });
useMouseParallax(shape3, { strength: 100 });

const scrollToProjects = () => {
  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
};

const scrollToContact = () => {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
  // Hero entrance animation
  const tl = gsap.timeline();

  tl.from(name.value, {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out',
  })
    .from(
      tagline.value,
      {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.5'
    )
    .from(
      description.value,
      {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.4'
    )
    .from(
      cta.value,
      {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.4'
    )
    .from(
      scrollIndicator.value,
      {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.4'
    );

  // Parallax shapes on scroll
  gsap.to(shape1.value, {
    scrollTrigger: {
      trigger: name.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    y: 200,
    rotation: 45,
    ease: 'none',
  });

  gsap.to(shape2.value, {
    scrollTrigger: {
      trigger: name.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    y: -150,
    rotation: -45,
    ease: 'none',
  });

  gsap.to(shape3.value, {
    scrollTrigger: {
      trigger: name.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    y: 100,
    rotation: 90,
    ease: 'none',
  });
});
</script>
