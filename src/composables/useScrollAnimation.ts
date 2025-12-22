import { onMounted, onBeforeUnmount, type Ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import type { AnimationOptions } from '../types'

gsap.registerPlugin(ScrollTrigger)

export function useScrollAnimation(target: Ref<HTMLElement | null>, options: AnimationOptions = {}) {
  let ctx: gsap.Context | undefined

  onMounted(() => {
    if (!target.value) return

    ctx = gsap.context(() => {
      gsap.from(target.value!, {
        scrollTrigger: {
          trigger: target.value,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
          ...options.scrollTrigger
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        ...options.animation
      })
    })
  })

  onBeforeUnmount(() => {
    if (ctx) ctx.revert()
  })

  return { ctx }
}

export function useStaggerAnimation(targets: Ref<HTMLElement[] | null>, options: AnimationOptions = {}) {
  let ctx: gsap.Context | undefined

  onMounted(() => {
    if (!targets.value || !targets.value.length) return

    ctx = gsap.context(() => {
      gsap.from(targets.value!, {
        scrollTrigger: {
          trigger: targets.value![0],
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
          ...options.scrollTrigger
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: options.stagger || 0.1,
        ease: 'power3.out',
        ...options.animation
      })
    })
  })

  onBeforeUnmount(() => {
    if (ctx) ctx.revert()
  })

  return { ctx }
}
