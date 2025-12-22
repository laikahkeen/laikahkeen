// Skill types
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface Skill {
  name: string
  level: SkillLevel
}

export interface SkillCategory {
  title: string
  skills: Skill[]
}

// Project types
export interface Project {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
}

// Journey types
export type MilestoneType = 'career' | 'education' | 'learning' | 'achievement'

export interface JourneyMilestone {
  id: number
  year: string
  title: string
  description: string
  type: MilestoneType
}

// Experience types
export interface Experience {
  id: number
  company: string
  role: string
  period: string
  location: string
  description: string
  responsibilities: string[]
  current: boolean
}

// GSAP Animation options
export interface ScrollTriggerOptions {
  trigger?: any
  start?: string
  end?: string
  scrub?: boolean
  toggleActions?: string
  [key: string]: any
}

export interface AnimationOptions {
  scrollTrigger?: ScrollTriggerOptions
  animation?: Record<string, any>
  stagger?: number
  [key: string]: any
}

export interface ParallaxOptions {
  speed?: number
  direction?: 'up' | 'down'
  trigger?: any
  scrollTrigger?: ScrollTriggerOptions
  animation?: Record<string, any>
  strength?: number
}
