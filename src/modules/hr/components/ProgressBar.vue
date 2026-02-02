<template>
  <div class="w-full">
    <div v-if="showLabel" class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-700">{{ label }}</span>
      <span class="text-sm font-semibold" :class="percentageTextClass">{{ percentage }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        :class="[
          'h-full rounded-full transition-all duration-1000 ease-out',
          progressColorClass
        ]"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
    <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  percentage: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  },
  label: {
    type: String,
    default: 'Progress'
  },
  subtitle: {
    type: String,
    default: ''
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: 'blue', // blue, green, yellow, red
    validator: (value) => ['blue', 'green', 'yellow', 'red', 'purple'].includes(value)
  }
})

const progressColorClass = computed(() => {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-500',
    red: 'bg-red-600',
    purple: 'bg-purple-600'
  }
  return colors[props.color] || 'bg-blue-600'
})

const percentageTextClass = computed(() => {
  const classes = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600'
  }
  return classes[props.color] || 'text-blue-600'
})
</script>

