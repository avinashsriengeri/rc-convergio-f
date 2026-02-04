<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-start space-x-3">
          <!-- Task Type Icon -->
          <div :class="taskTypeIconClass" class="flex-shrink-0 p-2 rounded-lg">
            <component :is="taskTypeIcon" class="w-5 h-5" />
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <h4 class="text-sm font-semibold text-gray-900">{{ task.title }}</h4>
              <PriorityBadge v-if="task.priority" :priority="task.priority" />
            </div>
            
            <p v-if="task.description" class="text-sm text-gray-600 mt-1 line-clamp-2">{{ task.description }}</p>
            
            <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <div v-if="task.assigned_to" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ task.assigned_to.name || 'Unassigned' }}
              </div>
              
              <div v-if="task.due_date" class="flex items-center" :class="dueDateClass">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDueDate(task.due_date) }}
              </div>
              
              <StatusBadge :status="task.status" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Actions -->
    <div v-if="showActions" class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end space-x-2">
      <button
        v-if="task.status === 'pending'"
        @click="$emit('start-task')"
        class="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
      >
        Start Task
      </button>
      <button
        v-if="task.status === 'in_progress'"
        @click="$emit('complete-task')"
        class="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
      >
        Complete Task
      </button>
      <button
        v-if="showViewEmployee && task.employee"
        @click="$emit('view-employee')"
        class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        View Employee
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import StatusBadge from './StatusBadge.vue'
import PriorityBadge from './PriorityBadge.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showViewEmployee: {
    type: Boolean,
    default: false
  }
})

defineEmits(['start-task', 'complete-task', 'view-employee'])

const taskTypeIcon = computed(() => {
  const icons = {
    hr: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      })
    ]),
    it: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
      })
    ]),
    finance: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ]),
    manager: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
      })
    ])
  }
  
  const type = props.task.task_type?.toLowerCase() || 'hr'
  return icons[type] || icons.hr
})

const taskTypeIconClass = computed(() => {
  const classes = {
    hr: 'bg-blue-100 text-blue-600',
    it: 'bg-purple-100 text-purple-600',
    finance: 'bg-green-100 text-green-600',
    manager: 'bg-orange-100 text-orange-600'
  }
  const type = props.task.task_type?.toLowerCase() || 'hr'
  return classes[type] || classes.hr
})

const formatDueDate = (dateString) => {
  if (!dateString) return 'No due date'
  
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(date)
  dueDate.setHours(0, 0, 0, 0)
  
  const diffTime = dueDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  if (diffDays === -1) return 'Overdue by 1 day'
  if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`
  return `${diffDays} days left`
}

const dueDateClass = computed(() => {
  if (!props.task.due_date) return ''
  
  const date = new Date(props.task.due_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(date)
  dueDate.setHours(0, 0, 0, 0)
  
  const diffTime = dueDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'text-red-600 font-medium'
  if (diffDays === 0) return 'text-yellow-600 font-medium'
  if (diffDays <= 3) return 'text-yellow-600'
  return ''
})
</script>


