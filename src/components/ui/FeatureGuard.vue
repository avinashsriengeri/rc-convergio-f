<template>
  <div v-if="shouldRender">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFeatures } from '@/composables/useFeatures'

interface Props {
  feature: string
  fallback?: boolean
  showWhenDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fallback: false,
  showWhenDisabled: false
})

const { hasFeature, isReady } = useFeatures()

// Determine if content should be rendered
const shouldRender = computed(() => {
  // If features aren't ready yet, use fallback behavior
  if (!isReady.value) {
    return props.fallback
  }
  
  // Check if user has the required feature
  const hasAccess = hasFeature(props.feature)
  
  // If showWhenDisabled is true, show content even when feature is disabled
  if (props.showWhenDisabled) {
    return true
  }
  
  return hasAccess
})
</script>
