<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 mb-1">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900 mb-2">{{ value }}</p>
        
        <!-- Change indicator -->
        <div class="flex items-center space-x-1">
          <svg
            v-if="change !== 0"
            class="w-4 h-4"
            :class="change > 0 ? 'text-green-500' : 'text-red-500'"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              v-if="change > 0"
              fill-rule="evenodd"
              d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L12 7z"
              clip-rule="evenodd"
            />
            <path
              v-else
              fill-rule="evenodd"
              d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L12 13z"
              clip-rule="evenodd"
            />
          </svg>
          <span
            class="text-sm font-medium"
            :class="change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'"
          >
            {{ formatChange(change) }}
          </span>
          <span class="text-sm text-gray-500">vs last period</span>
        </div>
      </div>
      
      <!-- Icon -->
      <div class="flex-shrink-0">
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center"
          :class="iconBgClass"
        >
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <!-- Currency Dollar -->
            <path
              v-if="icon === 'currency-dollar'"
              fill-rule="evenodd"
              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
              clip-rule="evenodd"
            />
            <!-- Briefcase -->
            <path
              v-else-if="icon === 'briefcase'"
              fill-rule="evenodd"
              d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
            <!-- Users -->
            <path
              v-else-if="icon === 'users'"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <!-- Chart Bar -->
            <path
              v-else-if="icon === 'chart-bar'"
              d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"
            />
            <!-- Default icon -->
            <path
              v-else
              fill-rule="evenodd"
              d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  change: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: 'chart-bar'
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'purple', 'orange', 'red', 'yellow'].includes(value)
  }
})

const iconBgClass = computed(() => {
  const classes = {
    blue: 'bg-gradient-to-r from-primary-purple to-primary-pink',
    green: 'bg-gradient-to-r from-icon-total-income to-green-600',
    purple: 'bg-gradient-to-r from-icon-orders to-purple-600',
    orange: 'bg-gradient-to-r from-icon-total-expense to-orange-600',
    red: 'bg-gradient-to-r from-red-500 to-pink-600',
    yellow: 'bg-gradient-to-r from-yellow-500 to-orange-600'
  }
  return classes[props.color] || classes.blue
})

const formatChange = (change) => {
  if (change === 0) return '0%'
  const sign = change > 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}%`
}
</script>

