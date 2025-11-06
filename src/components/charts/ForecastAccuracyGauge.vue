<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div class="p-4">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-base font-semibold text-gray-900">Forecast Accuracy</h3>
          <p class="text-xs text-gray-500 mt-0.5">Overall Performance Metrics</p>
        </div>
        <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      
      <div class="flex items-center gap-6">
        <!-- Gauge Chart -->
        <div class="flex-shrink-0" style="width: 140px; height: 140px;">
          <div class="relative w-full h-full flex items-center justify-center">
            <canvas ref="canvasRef" class="max-w-full max-h-full"></canvas>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div :class="getAccuracyColor(data?.average_accuracy || 0)" class="text-2xl font-bold">
                  {{ formatPercentage(data?.average_accuracy || 0) }}
                </div>
                <div class="text-xs text-gray-500 mt-1">Average</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Legend & Info -->
        <div class="flex-1">
          <div class="space-y-3">
            <div class="flex items-center justify-between p-2 bg-green-50 rounded-lg">
              <div class="flex items-center">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span class="text-sm font-medium text-gray-700">Excellent</span>
              </div>
              <span class="text-sm text-gray-600">90%+</span>
            </div>
            <div class="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
              <div class="flex items-center">
                <div class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span class="text-sm font-medium text-gray-700">Good</span>
              </div>
              <span class="text-sm text-gray-600">80-89%</span>
            </div>
            <div class="flex items-center justify-between p-2 bg-red-50 rounded-lg">
              <div class="flex items-center">
                <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <span class="text-sm font-medium text-gray-700">Needs Improvement</span>
              </div>
              <span class="text-sm text-gray-600">&lt;80%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick, toRaw } from 'vue'
import { Chart, registerables } from 'chart.js'

// Register all Chart.js components
Chart.register(...registerables)

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const canvasRef = ref(null)
let gaugeInstance = null
let resizeHandler = null
let visibilityHandler = null

// ✅ Destroy chart safely
function destroyChart() {
  if (gaugeInstance) {
    try {
      gaugeInstance.destroy()
      gaugeInstance = null
    } catch (err) {
      console.warn('Chart destroy failed:', err)
    }
  }
}

// ✅ Wait until canvas has dimensions
async function waitForCanvasReady(canvas, retries = 15, delay = 80) {
  for (let i = 0; i < retries; i++) {
    await nextTick()
    await new Promise((r) => requestAnimationFrame(r))
    if (canvas && canvas.offsetWidth > 0 && canvas.offsetHeight > 0) return true
    await new Promise((r) => setTimeout(r, delay))
  }
  console.warn('Canvas not ready after retries')
  return false
}

// Helper methods
const formatPercentage = (value) => {
  if (typeof value !== 'number') return '0%'
  return `${value.toFixed(1)}%`
}

const getAccuracyColor = (accuracy) => {
  if (accuracy >= 90) return 'text-green-600'
  if (accuracy >= 80) return 'text-yellow-600'
  if (accuracy >= 70) return 'text-orange-600'
  return 'text-red-600'
}

const getGaugeColor = (accuracy) => {
  if (accuracy >= 90) return '#10B981' // Green
  if (accuracy >= 80) return '#EAB308' // Yellow
  if (accuracy >= 70) return '#F97316' // Orange
  return '#EF4444' // Red
}

// ✅ Build and render gauge
async function renderGauge() {
  const canvas = canvasRef.value
  if (!canvas) return console.warn('No canvas element found')
  const ready = await waitForCanvasReady(canvas)
  if (!ready) return

  const ctx = canvas.getContext('2d')
  const safeData = JSON.parse(JSON.stringify(toRaw(props.data || {})))
  
  // Allow rendering with 0% if no data
  const accuracy = Number(safeData?.average_accuracy) || 0
  const color = getGaugeColor(accuracy)
  console.log('ForecastAccuracyGauge: Creating gauge with accuracy:', accuracy)

  destroyChart()
  try {
  
  const config = {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [accuracy, 100 - accuracy],
        backgroundColor: [color, '#E5E7EB'],
        borderWidth: 0,
        cutout: '75%'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      },
      animation: {
        animateRotate: true,
        duration: 2000,
        easing: 'easeOutQuart'
      }
    }
  }
  
    gaugeInstance = new Chart(ctx, config)
    console.log('✅ ForecastAccuracyGauge rendered successfully:', accuracy)
  } catch (err) {
    console.error('Gauge render error:', err)
  }
}

// ✅ Watch data updates and re-render
watch(
  () => props.data,
  () => {
    renderGauge()
  },
  { deep: true, immediate: true }
)

// ✅ Mount lifecycle
onMounted(() => {
  renderGauge()

  // Handle window resize
  resizeHandler = () => {
    if (gaugeInstance) gaugeInstance.resize()
  }
  window.addEventListener('resize', resizeHandler)

  // Re-render when tab becomes visible again
  visibilityHandler = () => {
    if (document.visibilityState === 'visible') renderGauge()
  }
  document.addEventListener('visibilitychange', visibilityHandler)
})

// ✅ Cleanup on unmount
onBeforeUnmount(() => {
  destroyChart()
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler)
})

// Expose renderGauge function for external calls
defineExpose({
  renderGauge
})
</script>

<style scoped>
/* No additional styles needed */
</style>
