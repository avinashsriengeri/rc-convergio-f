<template>
  <span
    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
    :class="badgeClass"
  >
    <span v-if="showDot" class="w-1.5 h-1.5 rounded-full mr-1.5" :class="dotClass"></span>
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  showDot: {
    type: Boolean,
    default: false
  }
})

const statusText = computed(() => {
  const statusMap = {
    'self_review_pending': 'Self Review Pending',
    'self_review_submitted': 'Awaiting Manager Review',
    'manager_review_pending': 'Manager Review Pending',
    'completed': 'Completed',
    'overdue': 'Overdue',
    'draft': 'Draft',
    'published': 'Published',
    'archived': 'Archived'
  }
  return statusMap[props.status] || props.status
})

const badgeClass = computed(() => {
  const classes = {
    'self_review_pending': 'bg-yellow-100 text-yellow-800',
    'self_review_submitted': 'bg-blue-100 text-blue-800',
    'manager_review_pending': 'bg-orange-100 text-orange-800',
    'completed': 'bg-green-100 text-green-800',
    'overdue': 'bg-red-100 text-red-800',
    'draft': 'bg-gray-100 text-gray-800',
    'published': 'bg-green-100 text-green-800',
    'archived': 'bg-gray-100 text-gray-800'
  }
  return classes[props.status] || 'bg-gray-100 text-gray-800'
})

const dotClass = computed(() => {
  const classes = {
    'self_review_pending': 'bg-yellow-600',
    'self_review_submitted': 'bg-blue-600',
    'manager_review_pending': 'bg-orange-600',
    'completed': 'bg-green-600',
    'overdue': 'bg-red-600',
    'draft': 'bg-gray-600',
    'published': 'bg-green-600',
    'archived': 'bg-gray-600'
  }
  return classes[props.status] || 'bg-gray-600'
})
</script>

