<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute top-0 right-0 w-32 h-32 opacity-5 transform translate-x-8 -translate-y-8">
      <div class="w-full h-full rounded-full" :class="patternClass"></div>
    </div>
    
    <!-- Card Content -->
    <div class="relative z-10">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <div :class="[iconBgClass, 'w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300']">
            <svg :class="[iconClass, 'w-6 h-6']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wide">{{ title }}</h3>
            <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
          </div>
        </div>
        
        <!-- Trend Indicator -->
        <div v-if="trend" class="flex items-center space-x-1">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center',
            trend.direction === 'up' ? 'bg-green-100' : 'bg-red-100'
          ]">
            <svg
              :class="[
                'w-4 h-4',
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
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
          </div>
          <span :class="[
            'text-sm font-bold',
            trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
          ]">
            {{ trend.percentage }}%
          </span>
        </div>
      </div>

      <!-- Main Value -->
      <div class="mb-4">
        <div class="flex items-baseline space-x-2">
          <span class="text-4xl font-bold text-gray-900">{{ formattedValue }}</span>
          <span v-if="unit" class="text-lg text-gray-500">{{ unit }}</span>
        </div>
        <p v-if="description" class="text-sm text-gray-600 mt-2">{{ description }}</p>
      </div>

      <!-- Progress Bar -->
      <div v-if="showProgress" class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-gray-600">Progress</span>
          <span class="text-xs font-bold text-gray-900">{{ progressPercentage }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            :class="[
              'h-full rounded-full transition-all duration-1000 ease-out',
              progressColor
            ]"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
        <p v-if="progressLabel" class="text-xs text-gray-500 mt-1">{{ progressLabel }}</p>
      </div>

      <!-- Status Badge -->
      <div v-if="status" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" :class="statusClass">
        <div :class="[statusDotClass, 'w-2 h-2 rounded-full mr-2']"></div>
        {{ status }}
      </div>

      <!-- Action Button -->
      <div v-if="actionText" class="mt-4 pt-4 border-t border-gray-100">
        <button
          @click="$emit('action')"
          class="w-full text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center justify-center space-x-2 group/btn"
        >
          <span>{{ actionText }}</span>
          <svg class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
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
  unit: {
    type: String,
    default: ''
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
  status: {
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
    pink: 'bg-pink-100',
    emerald: 'bg-emerald-100',
    cyan: 'bg-cyan-100'
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
    pink: 'text-pink-600',
    emerald: 'text-emerald-600',
    cyan: 'text-cyan-600'
  }
  return colorMap[props.iconColor] || 'text-gray-600'
})

const patternClass = computed(() => {
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
    emerald: 'bg-emerald-500',
    cyan: 'bg-cyan-500'
  }
  return colorMap[props.iconColor] || 'bg-gray-500'
})

const statusClass = computed(() => {
  if (!props.status) return ''
  
  const statusLower = props.status.toLowerCase()
  if (statusLower.includes('excellent') || statusLower.includes('good')) {
    return 'bg-green-100 text-green-800'
  } else if (statusLower.includes('average')) {
    return 'bg-yellow-100 text-yellow-800'
  } else if (statusLower.includes('poor') || statusLower.includes('bad')) {
    return 'bg-red-100 text-red-800'
  }
  return 'bg-gray-100 text-gray-800'
})

const statusDotClass = computed(() => {
  if (!props.status) return ''
  
  const statusLower = props.status.toLowerCase()
  if (statusLower.includes('excellent') || statusLower.includes('good')) {
    return 'bg-green-500'
  } else if (statusLower.includes('average')) {
    return 'bg-yellow-500'
  } else if (statusLower.includes('poor') || statusLower.includes('bad')) {
    return 'bg-red-500'
  }
  return 'bg-gray-500'
})

const iconPath = computed(() => {
  const iconMap = {
    'chart-bar': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    'star': 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    'check-circle': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    'clock': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    'document': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'ticket': 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
    'chart-line': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  }
  return iconMap[props.icon] || iconMap['chart-bar']
})
</script>
