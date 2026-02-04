<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="badgeClass"
  >
    <component :is="icon" class="w-3 h-3 mr-1.5" />
    {{ label }}
  </span>
</template>

<script setup>
import { computed, h } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['document', 'video', 'both'].includes(value)
  }
})

const label = computed(() => {
  const labels = {
    document: 'Document',
    video: 'Video',
    both: 'Document & Video'
  }
  return labels[props.type] || props.type
})

const badgeClass = computed(() => {
  const classes = {
    document: 'bg-blue-100 text-blue-800',
    video: 'bg-purple-100 text-purple-800',
    both: 'bg-indigo-100 text-indigo-800'
  }
  return classes[props.type] || 'bg-gray-100 text-gray-800'
})

const icon = computed(() => {
  if (props.type === 'document') {
    return () => h('svg', {
      class: 'w-3 h-3',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
      })
    ])
  } else if (props.type === 'video') {
    return () => h('svg', {
      class: 'w-3 h-3',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
      }),
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ])
  } else {
    return () => h('svg', {
      class: 'w-3 h-3',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
      }),
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
      })
    ])
  }
})
</script>

