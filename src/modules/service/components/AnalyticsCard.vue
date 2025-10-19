<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-medium text-gray-600">{{ title }}</p>
          <div v-if="trend" class="flex items-center">
            <svg
              :class="[
                'w-4 h-4 mr-1',
                trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="trend.direction === 'up'"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 17l9.2-9.2M17 17V7H7"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 7l-9.2 9.2M7 7v10h10"
              />
            </svg>
            <span
              :class="[
                'text-sm font-medium',
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              ]"
            >
              {{ trend.percentage }}%
            </span>
          </div>
        </div>
        
        <div class="flex items-baseline">
          <p class="text-3xl font-bold text-gray-900">{{ formattedValue }}</p>
          <p v-if="subtitle" class="ml-2 text-sm text-gray-500">{{ subtitle }}</p>
        </div>
        
        <div v-if="description" class="mt-2">
          <p class="text-sm text-gray-500">{{ description }}</p>
        </div>
        
        <!-- Progress Bar (if applicable) -->
        <div v-if="showProgress" class="mt-3">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              :class="[
                'h-2 rounded-full transition-all duration-300',
                progressColor
              ]"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
          <p class="text-xs text-gray-500 mt-1">{{ progressLabel }}</p>
        </div>
      </div>
      
      <!-- Icon -->
      <div :class="[iconBgClass, 'w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200']">
        <svg :class="[iconClass, 'w-6 h-6']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
        </svg>
      </div>
    </div>
    
    <!-- Action Button (if provided) -->
    <div v-if="actionText" class="mt-4 pt-4 border-t border-gray-100">
      <button
        @click="$emit('action')"
        class="w-full text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        {{ actionText }}
        <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    default: 'blue'
  },
  trend: {
    type: Object,
    default: null
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  progressPercentage: {
    type: Number,
    default: 0
  },
  progressColor: {
    type: String,
    default: 'bg-blue-500'
  },
  progressLabel: {
    type: String,
    default: ''
  },
  actionText: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['action'])

// Computed
const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    if (props.value >= 1000000) {
      return (props.value / 1000000).toFixed(1) + 'M'
    } else if (props.value >= 1000) {
      return (props.value / 1000).toFixed(1) + 'K'
    }
    return props.value.toLocaleString()
  }
  return props.value
})

const iconBgClass = computed(() => {
  const colorMap = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
    indigo: 'bg-indigo-100',
    pink: 'bg-pink-100'
  }
  return colorMap[props.iconColor] || 'bg-gray-100'
})

const iconClass = computed(() => {
  const colorMap = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    indigo: 'text-indigo-600',
    pink: 'text-pink-600'
  }
  return colorMap[props.iconColor] || 'text-gray-600'
})

const iconPath = computed(() => {
  const iconMap = {
    'chart-bar': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    'star': 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    'check-circle': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    'clock': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    'document': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'ticket': 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'
  }
  return iconMap[props.icon] || iconMap['chart-bar']
})
</script>
