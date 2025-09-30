<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled || isLoading"
        :class="[
          'block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md',
          { 'bg-gray-100': disabled || isLoading }
        ]"
      >
        <option v-if="!hideDefaultOption" value="">{{ placeholder || 'Select a time window' }}</option>
        <option 
          v-for="window in timeWindows" 
          :key="window.value" 
          :value="window.value"
        >
          {{ window.label }}
        </option>
      </select>
      
      <div v-if="isLoading" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg class="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    
    <p v-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { leadScoringService } from '@/services/leadScoring'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Time Window'
  },
  placeholder: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: 'Select the time period for this rule to be active.'
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hideDefaultOption: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const timeWindows = ref([
  { value: '1h', label: '1 Hour' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: 'lifetime', label: 'Lifetime' }
])

const isLoading = ref(false)

// Fetch time windows from API on component mount
onMounted(async () => {
  try {
    isLoading.value = true
    const apiWindows = await leadScoringService.getTimeWindows()
    if (apiWindows && apiWindows.length > 0) {
      timeWindows.value = apiWindows
    }
  } catch (error) {
    console.error('Error loading time windows:', error)
    // Fallback to default time windows defined above
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
