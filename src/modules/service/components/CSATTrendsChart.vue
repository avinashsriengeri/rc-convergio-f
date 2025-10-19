<template>
  <div class="h-64 w-full">
    <!-- Chart Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
        <span class="text-sm font-medium text-gray-600">CSAT Score</span>
      </div>
      <div class="flex items-center space-x-4 text-sm text-gray-500">
        <div class="flex items-center space-x-1">
          <div class="w-3 h-3 bg-purple-100 rounded"></div>
          <span>Current: {{ currentCSAT.toFixed(1) }}</span>
        </div>
        <div class="flex items-center space-x-1">
          <div class="w-3 h-3 bg-gray-200 rounded"></div>
          <span>Target: 4.0</span>
        </div>
      </div>
    </div>

    <!-- Chart Area -->
    <div class="relative h-48 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-100 overflow-hidden">
      <!-- Grid Lines -->
      <div class="absolute inset-0 opacity-20">
        <div class="h-full w-full" style="background-image: linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px); background-size: 20px 20px;"></div>
      </div>

      <!-- Chart Content -->
      <div class="relative h-full p-4">
        <!-- Y-Axis Labels -->
        <div class="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-4">
          <span>5.0</span>
          <span>4.0</span>
          <span>3.0</span>
          <span>2.0</span>
          <span>1.0</span>
        </div>

        <!-- Chart Data Area -->
        <div class="ml-8 h-full flex items-end justify-between">
          <!-- Sample Data Points (you can replace with real data) -->
          <div
            v-for="(point, index) in chartData"
            :key="index"
            class="flex flex-col items-center group cursor-pointer"
            :style="{ width: `${100 / chartData.length}%` }"
          >
            <!-- Data Point -->
            <div
              class="w-3 h-3 bg-purple-500 rounded-full border-2 border-white shadow-lg transform transition-all duration-200 group-hover:scale-125 group-hover:bg-purple-600"
              :style="{ marginBottom: `${(point.value / 5) * 100}%` }"
            ></div>
            
            <!-- Value Label -->
            <div class="text-xs font-medium text-gray-700 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {{ point.value.toFixed(1) }}
            </div>
            
            <!-- Date Label -->
            <div class="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
              {{ point.date }}
            </div>
          </div>
        </div>

        <!-- Trend Line -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none" style="margin-left: 32px;">
          <polyline
            :points="trendLinePoints"
            fill="none"
            stroke="#8b5cf6"
            stroke-width="2"
            stroke-dasharray="5,5"
            opacity="0.7"
          />
        </svg>

        <!-- Average Line -->
        <div
          class="absolute left-8 right-4 border-t-2 border-dashed border-gray-300 opacity-60"
          :style="{ bottom: `${(averageCSAT / 5) * 100}%` }"
        >
          <div class="absolute -top-2 -left-8 text-xs text-gray-500 bg-white px-1">
            Avg: {{ averageCSAT.toFixed(1) }}
          </div>
        </div>
      </div>

      <!-- Chart Legend -->
      <div class="absolute bottom-2 right-4 flex items-center space-x-4 text-xs text-gray-500">
        <div class="flex items-center space-x-1">
          <div class="w-3 h-0.5 bg-purple-500"></div>
          <span>Trend</span>
        </div>
        <div class="flex items-center space-x-1">
          <div class="w-3 h-0.5 bg-gray-300 border-dashed border-t"></div>
          <span>Average</span>
        </div>
      </div>
    </div>

    <!-- Chart Footer -->
    <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
      <div class="flex items-center space-x-4">
        <span>Period: {{ period }}</span>
        <span>Data Points: {{ chartData.length }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <span>Trend:</span>
        <span :class="trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-gray-600'">
          {{ trendDirection === 'up' ? '↗' : trendDirection === 'down' ? '↘' : '→' }}
          {{ trendPercentage }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  period: {
    type: String,
    default: '30d'
  }
})

// Computed properties
const chartData = computed(() => {
  if (props.data && props.data.length > 0) {
    return props.data
  }
  
  // Sample data for demonstration
  return [
    { date: '10/1', value: 3.2 },
    { date: '10/5', value: 3.5 },
    { date: '10/10', value: 3.8 },
    { date: '10/15', value: 4.1 },
    { date: '10/18', value: 3.5 }
  ]
})

const currentCSAT = computed(() => {
  return chartData.value.length > 0 ? chartData.value[chartData.value.length - 1].value : 0
})

const averageCSAT = computed(() => {
  if (chartData.value.length === 0) return 0
  const sum = chartData.value.reduce((acc, point) => acc + point.value, 0)
  return sum / chartData.value.length
})

const trendLinePoints = computed(() => {
  if (chartData.value.length < 2) return ''
  
  const points = chartData.value.map((point, index) => {
    const x = (index / (chartData.value.length - 1)) * 100
    const y = 100 - (point.value / 5) * 100
    return `${x}%,${y}%`
  })
  
  return points.join(' ')
})

const trendDirection = computed(() => {
  if (chartData.value.length < 2) return 'stable'
  const first = chartData.value[0].value
  const last = chartData.value[chartData.value.length - 1].value
  
  if (last > first) return 'up'
  if (last < first) return 'down'
  return 'stable'
})

const trendPercentage = computed(() => {
  if (chartData.value.length < 2) return 0
  const first = chartData.value[0].value
  const last = chartData.value[chartData.value.length - 1].value
  
  return Math.abs(((last - first) / first) * 100).toFixed(1)
})
</script>
