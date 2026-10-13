<template>
  <component
    :is="tag"
    :href="href"
    :to="to"
    :type="tag === 'button' ? type : undefined"
    :class="buttonClasses"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  variant?: Variant;
  size?: Size;
  href?: string;
  to?: string;
  type?: string;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  fullWidth: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const tag = computed(() => {
  if (props.href) return 'a';
  if (props.to) return 'router-link';
  return 'button';
});

const buttonClasses = computed(() => {
  const variants: Record<Variant, string> = {
    primary: 'bg-black text-white hover:bg-gray-800',
    secondary: 'bg-white text-black border-2 border-black hover:bg-gray-100',
    outline: 'bg-transparent text-black border border-gray-300 hover:border-black',
    ghost: 'bg-transparent text-black hover:bg-gray-100',
  };

  const sizes: Record<Size, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return [
    // `transition`, not `transition-all`: the latter fades the focus ring in from
    // currentColor, which on a primary button is white on white.
    'inline-flex items-center justify-center font-medium transition duration-300',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variants[props.variant],
    sizes[props.size],
    props.fullWidth ? 'w-full' : '',
  ].join(' ');
});

const handleClick = (e: MouseEvent) => {
  emit('click', e);
};
</script>
