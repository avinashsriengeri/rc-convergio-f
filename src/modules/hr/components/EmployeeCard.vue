<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
    <div class="flex items-start justify-between">
      <div class="flex items-start space-x-4 flex-1">
        <!-- Avatar -->
        <div class="flex-shrink-0">
          <div v-if="employee.profile_picture" class="h-12 w-12 rounded-full overflow-hidden">
            <img
              :src="employee.profile_picture.url"
              :alt="employee.full_name"
              class="h-full w-full object-cover"
            />
          </div>
          <div v-else class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <span class="text-white font-semibold text-lg">
              {{ employee.first_name?.[0] }}{{ employee.last_name?.[0] }}
            </span>
          </div>
        </div>
        
        <!-- Employee Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2">
            <h3 class="text-lg font-semibold text-gray-900 truncate">{{ employeeFullName }}</h3>
            <StatusBadge :status="employee.employment_status || 'onboarding'" />
          </div>
          <p class="text-sm text-gray-500 mt-1">{{ employee.employee_id }}</p>
          
          <div class="mt-3 space-y-1">
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{{ departmentName }}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{{ designationName }}</span>
            </div>
            <div v-if="employee.manager" class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Manager: {{ managerName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Progress Bar -->
    <div v-if="showProgress && progressPercentage !== undefined" class="mt-4">
      <ProgressBar
        :percentage="progressPercentage"
        :subtitle="progressSubtitle"
        :color="progressColor"
        :show-label="true"
        label="Onboarding Progress"
      />
    </div>
    
    <!-- Actions -->
    <div class="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
      <button
        @click="$emit('view-details')"
        class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        View Details →
      </button>
      <button
        v-if="showReminder"
        @click="$emit('send-reminder')"
        class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Send Reminder
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'
import ProgressBar from './ProgressBar.vue'

const props = defineProps({
  employee: {
    type: Object,
    required: true
  },
  showProgress: {
    type: Boolean,
    default: true
  },
  progressPercentage: {
    type: Number,
    default: undefined
  },
  progressSubtitle: {
    type: String,
    default: ''
  },
  progressColor: {
    type: String,
    default: 'blue'
  },
  showReminder: {
    type: Boolean,
    default: true
  }
})

defineEmits(['view-details', 'send-reminder'])

// Computed properties to handle different API response structures
const employeeFullName = computed(() => {
  if (props.employee.full_name) {
    return props.employee.full_name
  }
  if (props.employee.first_name || props.employee.last_name) {
    return `${props.employee.first_name || ''} ${props.employee.last_name || ''}`.trim()
  }
  return 'N/A'
})

const departmentName = computed(() => {
  // Handle different API response structures
  if (props.employee.department_detail?.name) {
    return props.employee.department_detail.name
  }
  if (props.employee.department?.name) {
    return props.employee.department.name
  }
  if (typeof props.employee.department === 'string') {
    return props.employee.department
  }
  return 'N/A'
})

const designationName = computed(() => {
  // Handle different API response structures
  if (props.employee.designation_detail?.name) {
    return props.employee.designation_detail.name
  }
  if (props.employee.designation?.name) {
    return props.employee.designation.name
  }
  if (props.employee.job_title) {
    return props.employee.job_title
  }
  return 'N/A'
})

const managerName = computed(() => {
  if (!props.employee.manager) return 'N/A'
  if (props.employee.manager.full_name) {
    return props.employee.manager.full_name
  }
  if (props.employee.manager.first_name || props.employee.manager.last_name) {
    return `${props.employee.manager.first_name || ''} ${props.employee.manager.last_name || ''}`.trim()
  }
  return 'N/A'
})
</script>

