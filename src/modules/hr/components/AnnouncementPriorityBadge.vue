<template>
  <span
    :class="priorityClasses"
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  >
    {{ priorityLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  priority: {
    type: String,
    required: true,
    validator: (value) => ['low', 'medium', 'high'].includes(value)
  }
})

const priorityLabel = computed(() => {
  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High'
  }
  return labels[props.priority] || props.priority
})

const priorityClasses = computed(() => {
  const classes = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }
  return classes[props.priority] || classes.medium
})
</script>

