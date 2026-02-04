<template>
  <div v-if="showField" class="flex flex-col">
    <dt class="text-xs font-medium text-gray-500 mb-1">{{ label }}</dt>
    <dd class="text-sm text-gray-900">
      <slot>
        <span v-if="formattedValue !== null && formattedValue !== undefined && formattedValue !== ''">
          {{ formattedValue }}
        </span>
        <span v-else class="text-gray-400 italic">N/A</span>
      </slot>
    </dd>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number, Boolean, Object],
    default: null
  },
  format: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'capitalize', 'uppercase', 'lowercase', 'phone', 'email'].includes(value)
  },
  type: {
    type: String,
    default: 'text'
  },
  showIfEmpty: {
    type: Boolean,
    default: false
  }
})

const showField = computed(() => {
  if (props.showIfEmpty) return true
  return props.value !== null && props.value !== undefined && props.value !== ''
})

const formattedValue = computed(() => {
  if (props.value === null || props.value === undefined || props.value === '') {
    return null
  }

  let val = String(props.value)

  switch (props.format) {
    case 'capitalize':
      return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    case 'uppercase':
      return val.toUpperCase()
    case 'lowercase':
      return val.toLowerCase()
    case 'phone':
      // Basic phone formatting
      if (val.length === 10) {
        return `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6)}`
      }
      return val
    case 'email':
      return val
    default:
      return val
  }
})
</script>

