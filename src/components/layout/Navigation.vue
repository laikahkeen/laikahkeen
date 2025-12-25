<template>
  <nav
    :class="[
      'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white/90 shadow-sm backdrop-blur-md' : 'bg-transparent',
    ]"
  >
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <!-- Logo -->
        <a
          href="#hero"
          @click.prevent="scrollToSection('hero')"
          class="text-xl font-semibold transition-colors hover:text-gray-600"
        >
          LKK
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden items-center space-x-8 md:flex">
          <a
            v-for="link in navLinks"
            :key="link.id"
            :href="`#${link.id}`"
            @click.prevent="scrollToSection(link.id)"
            :class="[
              'text-sm font-medium transition-colors hover:text-gray-600',
              activeSection === link.id ? 'text-black' : 'text-gray-500',
            ]"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!mobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="mobileMenuOpen" class="border-t border-gray-200 bg-white md:hidden">
        <div class="space-y-3 px-6 py-4">
          <a
            v-for="link in navLinks"
            :key="link.id"
            :href="`#${link.id}`"
            @click.prevent="
              scrollToSection(link.id);
              mobileMenuOpen = false;
            "
            :class="[
              'block py-2 text-sm font-medium transition-colors hover:text-gray-600',
              activeSection === link.id ? 'text-black' : 'text-gray-500',
            ]"
          >
            {{ link.label }}
          </a>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface NavLink {
  id: string;
  label: string;
}

const navLinks: NavLink[] = [
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

const isScrolled = ref<boolean>(false);
const activeSection = ref<string>('hero');
const mobileMenuOpen = ref<boolean>(false);

const scrollToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const handleScroll = (): void => {
  isScrolled.value = window.scrollY > 50;

  // Detect active section
  const sections = navLinks.map((link) => link.id);
  sections.unshift('hero');

  for (const sectionId of sections) {
    const element = document.getElementById(sectionId);
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        activeSection.value = sectionId;
        break;
      }
    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
