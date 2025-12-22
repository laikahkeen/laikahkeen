<template>
  <section id="about" class="py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <!-- Profile Photo -->
        <div ref="imageContainer" class="flex justify-center md:justify-end order-2 md:order-1">
          <div class="relative w-80 h-80 group">
            <div class="absolute inset-0 border-2 border-black translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-300"></div>
            <div class="relative w-full h-full bg-gray-300 overflow-hidden">
              <img
                src="/images/profile.jpg"
                alt="Lai Kah Keen"
                class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <!-- About Content -->
        <div ref="content" class="order-1 md:order-2">
          <h2 class="text-4xl md:text-5xl font-bold mb-6">About Me</h2>
          <div class="space-y-4 text-gray-600 leading-relaxed">
            <p ref="p1">
              I'm a passionate full-stack developer with a keen eye for creating elegant,
              user-centric web applications. With expertise in modern JavaScript frameworks
              and a solid foundation in both frontend and backend technologies, I bring ideas to life
              through clean, efficient code.
            </p>
            <p ref="p2">
              My journey in web development started with a curiosity for how things work on the internet,
              and has evolved into a deep commitment to crafting exceptional digital experiences.
              I believe in writing code that is not only functional but also maintainable and scalable.
            </p>
            <p ref="p3">
              When I'm not coding, you'll find me exploring new technologies, contributing to
              open-source projects, or sharing knowledge with the developer community. I'm always
              eager to take on new challenges and collaborate on innovative projects.
            </p>
          </div>
          <div ref="stats" class="mt-8 grid grid-cols-3 gap-6">
            <div>
              <div class="text-3xl font-bold">5+</div>
              <div class="text-sm text-gray-500">Years Experience</div>
            </div>
            <div>
              <div class="text-3xl font-bold">50+</div>
              <div class="text-sm text-gray-500">Projects Completed</div>
            </div>
            <div>
              <div class="text-3xl font-bold">20+</div>
              <div class="text-sm text-gray-500">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScrollAnimation } from '../../composables/useScrollAnimation'

const imageContainer = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)

useScrollAnimation(imageContainer, {
  animation: { x: -50, opacity: 0, duration: 1 }
})

useScrollAnimation(content, {
  animation: { x: 50, opacity: 0, duration: 1 }
})
</script>
