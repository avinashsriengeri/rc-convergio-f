<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="statusClasses"
  >
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusClasses = computed(() => {
  const classes = {
    'open': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-amber-100 text-amber-800',
    'resolved': 'bg-green-100 text-green-800',
    'closed': 'bg-gray-100 text-gray-800'
  }
  return classes[props.status] || 'bg-gray-100 text-gray-800'
})

const statusText = computed(() => {
  const texts = {
    'open': 'Open',
    'in_progress': 'In Progress',
    'resolved': 'Resolved',
    'closed': 'Closed'
  }
  return texts[props.status] || props.status
})
</script>

