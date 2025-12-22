<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
    <!-- Parallax Background Shapes -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        ref="shape1"
        class="absolute top-20 left-10 w-64 h-64 border border-gray-200 rotate-12"
      ></div>
      <div
        ref="shape2"
        class="absolute bottom-20 right-10 w-80 h-80 border border-gray-200 -rotate-12"
      ></div>
      <div
        ref="shape3"
        class="absolute top-1/2 left-1/4 w-32 h-32 border border-gray-300 rotate-45"
      ></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
      <div ref="content">
        <!-- Animated Name -->
        <div class="overflow-hidden mb-6">
          <h1 ref="name" class="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight">
            Lai Kah Keen
          </h1>
        </div>

        <!-- Tagline -->
        <div class="overflow-hidden mb-8">
          <p ref="tagline" class="text-xl md:text-2xl lg:text-3xl text-gray-600 font-light">
            Full Stack Developer
          </p>
        </div>

        <!-- Description -->
        <div class="overflow-hidden mb-12">
          <p ref="description" class="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            Crafting elegant digital experiences with modern web technologies
          </p>
        </div>

        <!-- CTA Buttons -->
        <div ref="cta" class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="primary" size="lg" @click="scrollToProjects">
            View My Work
          </Button>
          <Button variant="secondary" size="lg" @click="scrollToContact">
            Get In Touch
          </Button>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div ref="scrollIndicator" class="absolute bottom-8 left-1/2 -translate-x-1/2">
      <div class="w-6 h-10 border-2 border-black rounded-full flex justify-center p-2 animate-bounce">
        <div class="w-1 h-3 bg-black rounded-full"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import Button from '../ui/Button.vue'
import { useMouseParallax } from '../../composables/useParallax'

const name = ref<HTMLElement | null>(null)
const tagline = ref<HTMLElement | null>(null)
const description = ref<HTMLElement | null>(null)
const cta = ref<HTMLElement | null>(null)
const scrollIndicator = ref<HTMLElement | null>(null)
const shape1 = ref<HTMLElement | null>(null)
const shape2 = ref<HTMLElement | null>(null)
const shape3 = ref<HTMLElement | null>(null)

// Mouse parallax for shapes
useMouseParallax(shape1, { strength: 15 })
useMouseParallax(shape2, { strength: -20 })
useMouseParallax(shape3, { strength: 10 })

const scrollToProjects = () => {
  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToContact = () => {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  // Hero entrance animation
  const tl = gsap.timeline()

  tl.from(name.value, {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
  })
  .from(tagline.value, {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.5')
  .from(description.value, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.4')
  .from(cta.value, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.4')
  .from(scrollIndicator.value, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.4')

  // Parallax shapes on scroll
  gsap.to(shape1.value, {
    scrollTrigger: {
      trigger: name.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: 200,
    rotation: 45,
    ease: 'none'
  })

  gsap.to(shape2.value, {
    scrollTrigger: {
      trigger: name.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: -150,
    rotation: -45,
    ease: 'none'
  })

  gsap.to(shape3.value, {
    scrollTrigger: {
      trigger: name.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: 100,
    rotation: 90,
    ease: 'none'
  })
})
</script>
