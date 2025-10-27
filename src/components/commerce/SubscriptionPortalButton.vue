<template>
  <button
    @click="openPortal"
    :disabled="loading"
    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
    :title="`Open billing portal for ${subscriptionId}`"
  >
    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
    {{ loading ? 'Opening...' : 'Portal' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  subscriptionId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['open-portal'])

const loading = ref(false)

const openPortal = async () => {
  loading.value = true
  try {
    emit('open-portal', props.subscriptionId)
  } finally {
    // Reset loading state after a short delay
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
}
</script>
