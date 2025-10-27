<template>
  <div class="forecast-accuracy-gauge">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-48 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent mx-auto mb-2"></div>
        <p class="text-purple-700 font-medium text-sm">Loading accuracy...</p>
      </div>
    </div>
    
    <!-- No Data State -->
    <div v-else-if="!data || data.average_accuracy === undefined" class="flex items-center justify-center h-48 bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="text-lg font-bold text-gray-800 mb-1">No Accuracy Data</h3>
        <p class="text-gray-600 text-sm">Accuracy data not available</p>
      </div>
    </div>
    
    <!-- Gauge Container -->
    <div v-else class="gauge-container bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div class="gauge-header bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-3">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-white">Forecast Accuracy</h3>
            <p class="text-purple-100 text-xs">Overall Performance</p>
          </div>
          <div class="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <div class="gauge-content p-4">
        <div class="relative w-full h-32 flex items-center justify-center">
          <canvas ref="canvasRef" class="max-w-full max-h-full"></canvas>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div :class="getAccuracyColor(data.average_accuracy)" class="text-2xl font-bold">
                {{ formatPercentage(data.average_accuracy) }}
              </div>
              <div class="text-xs text-gray-500 mt-1">Average</div>
            </div>
          </div>
        </div>
        <div class="mt-3 text-center">
          <div class="flex items-center justify-center space-x-4 text-xs">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              <span class="text-gray-600">Excellent (90%+)</span>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
              <span class="text-gray-600">Good (80-89%)</span>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
              <span class="text-gray-600">Needs Improvement (&lt;80%)</span>
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
  
  if (!safeData || safeData.average_accuracy === undefined) {
    console.warn('ForecastAccuracyGauge: Missing data')
    return
  }

  const accuracy = Number(safeData.average_accuracy) || 0
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
  (newVal) => {
    if (!newVal) return
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
.gauge-container {
  position: relative;
  height: 200px;
  width: 100%;
}

.gauge-content {
  height: 200px;
  position: relative;
}

.forecast-accuracy-gauge {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
</style>
