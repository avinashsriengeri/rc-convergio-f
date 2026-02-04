<template>
  <span
    :class="statusClasses"
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  >
    <span v-if="showDot" :class="dotClasses" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
    {{ statusLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['new', 'viewed', 'acknowledged', 'published', 'draft', 'archived'].includes(value)
  },
  showDot: {
    type: Boolean,
    default: false
  }
})

const statusLabel = computed(() => {
  const labels = {
    new: 'NEW',
    viewed: 'VIEWED',
    acknowledged: 'ACKNOWLEDGED',
    published: 'Published',
    draft: 'Draft',
    archived: 'Archived'
  }
  return labels[props.status] || props.status
})

const statusClasses = computed(() => {
  const classes = {
    new: 'bg-blue-100 text-blue-800',
    viewed: 'bg-gray-100 text-gray-800',
    acknowledged: 'bg-green-100 text-green-800',
    published: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800'
  }
  return classes[props.status] || classes.new
})

const dotClasses = computed(() => {
  const classes = {
    new: 'bg-blue-500',
    viewed: 'bg-gray-500',
    acknowledged: 'bg-green-500',
    published: 'bg-green-500',
    draft: 'bg-yellow-500',
    archived: 'bg-gray-500'
  }
  return classes[props.status] || classes.new
})
</script>

