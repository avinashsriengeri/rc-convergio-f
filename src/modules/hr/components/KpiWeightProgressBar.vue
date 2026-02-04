<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-700">Total Weight Distribution</span>
      <span 
        class="text-sm font-bold"
        :class="totalWeight === 100 ? 'text-green-600' : totalWeight > 100 ? 'text-red-600' : 'text-yellow-600'"
      >
        {{ totalWeight.toFixed(1) }}%
      </span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        class="h-full transition-all duration-300 rounded-full"
        :class="progressBarClass"
        :style="{ width: `${Math.min(totalWeight, 100)}%` }"
      ></div>
    </div>
    <p v-if="totalWeight !== 100" class="mt-2 text-xs" :class="totalWeight > 100 ? 'text-red-600' : 'text-yellow-600'">
      <span v-if="totalWeight < 100">⚠️ Total must equal 100%. Add {{ (100 - totalWeight).toFixed(1) }}% more.</span>
      <span v-else-if="totalWeight > 100">⚠️ Total exceeds 100%. Reduce by {{ (totalWeight - 100).toFixed(1) }}%.</span>
    </p>
    <p v-else class="mt-2 text-xs text-green-600">✅ Weight distribution is valid</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalWeight: {
    type: Number,
    required: true,
    default: 0
  }
})

const progressBarClass = computed(() => {
  if (props.totalWeight === 100) {
    return 'bg-green-500'
  } else if (props.totalWeight > 100) {
    return 'bg-red-500'
  } else {
    return 'bg-yellow-500'
  }
})
</script>

