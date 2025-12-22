<template>
  <section id="contact" class="py-24 bg-white">
    <div class="max-w-4xl mx-auto px-6 lg:px-8">
      <!-- Section Header -->
      <div ref="header" class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          Have a project in mind or just want to chat? I'd love to hear from you.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <div ref="form">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium mb-2">Name</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium mb-2">Email</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-medium mb-2">Message</label>
              <textarea
                id="message"
                v-model="formData.message"
                required
                rows="5"
                class="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors resize-none"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              :fullWidth="true"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </Button>

            <p v-if="submitMessage" :class="submitMessage.type === 'success' ? 'text-green-600' : 'text-red-600'" class="text-sm text-center">
              {{ submitMessage.text }}
            </p>
          </form>
        </div>

        <!-- Contact Info -->
        <div ref="info" class="space-y-8">
          <div>
            <h3 class="text-xl font-semibold mb-4">Contact Information</h3>
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium">Email</p>
                  <a href="mailto:hello@laikahkeen.com" class="text-gray-600 hover:text-black transition-colors">
                    hello@laikahkeen.com
                  </a>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium">GitHub</p>
                  <a href="https://github.com/laikahkeen" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black transition-colors">
                    github.com/laikahkeen
                  </a>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium">LinkedIn</p>
                  <a href="https://linkedin.com/in/laikahkeen" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black transition-colors">
                    linkedin.com/in/laikahkeen
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-4">Let's Work Together</h3>
            <p class="text-gray-600">
              I'm currently available for freelance projects and full-time opportunities.
              Feel free to reach out if you'd like to collaborate or just have a chat about technology.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Button from '../ui/Button.vue'
import { useScrollAnimation } from '../../composables/useScrollAnimation'

interface SubmitMessage {
  type: 'success' | 'error'
  text: string
}

const header = ref<HTMLElement | null>(null)
const form = ref<HTMLElement | null>(null)
const info = ref<HTMLElement | null>(null)

const formData = reactive({
  name: '',
  email: '',
  message: ''
})

const isSubmitting = ref<boolean>(false)
const submitMessage = ref<SubmitMessage | null>(null)

const handleSubmit = async () => {
  isSubmitting.value = true
  submitMessage.value = null

  try {
    // TODO: Replace with actual form submission endpoint (Formspree, EmailJS, etc.)
    // For now, just simulate a submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    submitMessage.value = {
      type: 'success',
      text: 'Thank you for your message! I\'ll get back to you soon.'
    }

    // Reset form
    formData.name = ''
    formData.email = ''
    formData.message = ''
  } catch (error) {
    submitMessage.value = {
      type: 'error',
      text: 'Something went wrong. Please try again or email me directly.'
    }
  } finally {
    isSubmitting.value = false
  }
}

useScrollAnimation(header, {
  animation: { y: 50, opacity: 0 }
})

useScrollAnimation(form, {
  animation: { x: -50, opacity: 0 }
})

useScrollAnimation(info, {
  animation: { x: 50, opacity: 0 }
})
</script>
