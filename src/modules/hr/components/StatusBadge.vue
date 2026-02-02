<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="statusClasses"
  >
    <span v-if="showDot" :class="dotClasses" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
    <slot>{{ statusText }}</slot>
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
    default: true
  }
})

const statusClasses = computed(() => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'onboarding': 'bg-blue-100 text-blue-800',
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'suspended': 'bg-red-100 text-red-800',
    'on_leave': 'bg-blue-100 text-blue-800',
    'offboarded': 'bg-gray-100 text-gray-800',
    // Document verification statuses
    'verified': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800'
  }
  return classes[props.status] || 'bg-gray-100 text-gray-800'
})

const dotClasses = computed(() => {
  const classes = {
    'pending': 'bg-yellow-500',
    'in_progress': 'bg-blue-500',
    'completed': 'bg-green-500',
    'onboarding': 'bg-blue-500',
    'active': 'bg-green-500',
    'inactive': 'bg-gray-500',
    'suspended': 'bg-red-500',
    'on_leave': 'bg-blue-500',
    'offboarded': 'bg-gray-500',
    // Document verification statuses
    'verified': 'bg-green-500',
    'rejected': 'bg-red-500'
  }
  return classes[props.status] || 'bg-gray-500'
})

const statusText = computed(() => {
  const texts = {
    'pending': 'Pending',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'onboarding': 'Onboarding',
    'active': 'Active',
    'inactive': 'Inactive',
    'suspended': 'Suspended',
    'on_leave': 'On Leave',
    'offboarded': 'Offboarded',
    // Document verification statuses
    'verified': 'Verified',
    'rejected': 'Rejected'
  }
  return texts[props.status] || props.status
})
</script>

