<template>
  <div class="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-3 mb-2">
          <div :class="statusIconClass" class="flex-shrink-0">
            <component :is="statusIcon" class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <h4 class="text-base font-semibold text-gray-900">{{ item.title }}</h4>
            <p v-if="item.description" class="text-sm text-gray-600 mt-1 line-clamp-2">{{ item.description }}</p>
          </div>
        </div>
        
        <div class="flex flex-wrap items-center gap-3 mt-3 text-xs">
          <span :class="categoryBadgeClass" class="px-2 py-1 rounded-full font-medium">
            {{ categoryLabel }}
          </span>
          <span :class="typeBadgeClass" class="px-2 py-1 rounded-full font-medium">
            {{ typeLabel }}
          </span>
          <StatusBadge :status="item.status" />
          <span v-if="item.is_mandatory" class="px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium">
            Mandatory
          </span>
        </div>
        
        <div class="flex items-center space-x-4 mt-3 text-sm text-gray-600">
          <div v-if="item.estimated_time" class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ item.estimated_time }} mins
          </div>
          <div v-if="item.due_date" class="flex items-center" :class="dueDateClass">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Due: {{ formatDate(item.due_date) }}
          </div>
          <div v-if="item.completed_at" class="flex items-center text-green-600">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Completed: {{ formatDate(item.completed_at) }}
          </div>
        </div>
      </div>
      
      <div class="ml-4 flex-shrink-0">
        <slot name="actions">
          <button
            v-if="item.status === 'pending' || item.status === 'in_progress'"
            @click="$emit('view')"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-purple rounded-lg hover:bg-primary-pink transition-colors"
          >
            {{ item.status === 'pending' ? 'Start' : 'Continue' }}
          </button>
          <button
            v-else-if="item.status === 'completed'"
            @click="$emit('view')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            View Again
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

defineEmits(['view'])

const categoryLabel = computed(() => {
  const categories = {
    induction: 'Induction',
    policy: 'Policy',
    training: 'Training'
  }
  return categories[props.item.category] || props.item.category
})

const typeLabel = computed(() => {
  const types = {
    document: 'Document',
    video: 'Video',
    both: 'Document & Video'
  }
  return types[props.item.content_type] || props.item.content_type
})

const categoryBadgeClass = computed(() => {
  const classes = {
    induction: 'bg-blue-100 text-blue-800',
    policy: 'bg-purple-100 text-purple-800',
    training: 'bg-green-100 text-green-800'
  }
  return classes[props.item.category] || 'bg-gray-100 text-gray-800'
})

const typeBadgeClass = computed(() => {
  return 'bg-gray-100 text-gray-700'
})

const statusIconClass = computed(() => {
  const classes = {
    completed: 'text-green-600',
    pending: 'text-yellow-600',
    in_progress: 'text-blue-600',
    overdue: 'text-red-600'
  }
  return classes[props.item.status] || 'text-gray-400'
})

const statusIcon = computed(() => {
  if (props.item.status === 'completed') {
    return () => h('svg', {
      class: 'w-5 h-5',
      fill: 'currentColor',
      viewBox: '0 0 20 20'
    }, [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
        'clip-rule': 'evenodd'
      })
    ])
  } else if (props.item.status === 'pending') {
    return () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ])
  } else {
    return () => h('svg', {
      class: 'w-5 h-5',
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
  }
})

const dueDateClass = computed(() => {
  if (!props.item.due_date) return ''
  const dueDate = new Date(props.item.due_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)
  
  if (props.item.status === 'completed') return 'text-gray-500'
  if (dueDate < today) return 'text-red-600 font-medium'
  if (dueDate.getTime() === today.getTime()) return 'text-yellow-600 font-medium'
  return 'text-gray-600'
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

