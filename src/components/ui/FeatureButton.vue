<template>
  <button
    v-if="shouldRender"
    :disabled="isDisabled"
    :class="buttonClasses"
    @click="handleClick"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFeatures } from '@/composables/useFeatures'

interface Props {
  feature: string
  variant?: 'hide' | 'disable' | 'fallback'
  fallback?: boolean
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'hide',
  fallback: false,
  disabled: false,
  class: ''
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const { hasFeature, isReady } = useFeatures()

// Determine if button should be rendered
const shouldRender = computed(() => {
  // If features aren't ready yet, use fallback behavior
  if (!isReady.value) {
    return props.fallback
  }
  
  // If variant is 'hide', don't render when feature is disabled
  if (props.variant === 'hide') {
    return hasFeature(props.feature)
  }
  
  // For 'disable' and 'fallback', always render
  return true
})

// Determine if button should be disabled
const isDisabled = computed(() => {
  // If features aren't ready yet, use fallback behavior
  if (!isReady.value) {
    return props.disabled
  }
  
  // If variant is 'disable', disable when feature is disabled
  if (props.variant === 'disable') {
    return !hasFeature(props.feature) || props.disabled
  }
  
  // For 'hide' and 'fallback', use original disabled state
  return props.disabled
})

// Button classes
const buttonClasses = computed(() => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  if (isDisabled.value) {
    return `${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed ${props.class}`
  }
  
  return `${baseClasses} ${props.class}`
})

// Handle click events
const handleClick = (event: MouseEvent) => {
  if (!isDisabled.value) {
    emit('click', event)
  }
}
</script>
