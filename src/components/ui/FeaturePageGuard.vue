<template>
  <div>
    <!-- Loading state while features are being fetched -->
    <div v-if="!isReady" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading feature access...</p>
      </div>
    </div>

    <!-- Access denied state -->
    <div v-else-if="!hasAccess" class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center max-w-md mx-auto px-4">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p class="text-gray-600 mb-6">
          {{ accessDeniedMessage }}
        </p>
        
        <div class="space-y-3">
          <button
            @click="goBack"
            class="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
          <button
            @click="goToDashboard"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>

    <!-- Content when access is granted -->
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFeatures } from '@/composables/useFeatures'

interface Props {
  feature: string
  accessDeniedMessage?: string
  redirectTo?: string
}

const props = withDefaults(defineProps<Props>(), {
  accessDeniedMessage: 'You do not have permission to access this page.',
  redirectTo: '/dashboard'
})

const router = useRouter()
const { hasFeature, isReady } = useFeatures()

// Check if user has access to the required feature
const hasAccess = computed(() => {
  if (!isReady.value) {
    return false
  }
  return hasFeature(props.feature)
})

// Navigation methods
const goBack = () => {
  router.go(-1)
}

const goToDashboard = () => {
  router.push(props.redirectTo)
}
</script>
