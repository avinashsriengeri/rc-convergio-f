<template>
  <span
    :class="categoryClasses"
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  >
    <component :is="categoryIcon" class="w-3 h-3 mr-1" />
    {{ categoryLabel }}
  </span>
</template>

<script setup>
import { computed, h } from 'vue'

const props = defineProps({
  category: {
    type: String,
    required: true,
    validator: (value) => ['general', 'policy', 'event', 'welcome', 'birthday'].includes(value)
  }
})

const categoryLabel = computed(() => {
  const labels = {
    general: 'General',
    policy: 'Policy',
    event: 'Event',
    welcome: 'Welcome',
    birthday: 'Birthday'
  }
  return labels[props.category] || props.category
})

const categoryClasses = computed(() => {
  const classes = {
    general: 'bg-gray-100 text-gray-800',
    policy: 'bg-blue-100 text-blue-800',
    event: 'bg-orange-100 text-orange-800',
    welcome: 'bg-green-100 text-green-800',
    birthday: 'bg-pink-100 text-pink-800'
  }
  return classes[props.category] || classes.general
})

const categoryIcon = computed(() => {
  const icons = {
    general: () => h('svg', {
      class: 'w-3 h-3',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ]),
    policy: () => h('svg', {
      class: 'w-3 h-3',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
      })
    ]),
    event: () => h('svg', {
      class: 'w-3 h-3',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
      })
    ]),
    welcome: () => h('svg', {
      class: 'w-3 h-3',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ]),
    birthday: () => h('svg', {
      class: 'w-3 h-3',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
      })
    ])
  }
  return icons[props.category] || icons.general
})
</script>

