<template>
  <div class="forecast-trends-chart">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-80 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
        <p class="text-green-700 font-medium">Loading trends data...</p>
      </div>
    </div>
    
    <!-- No Data State -->
    <div v-else-if="!data || data.length === 0" class="flex items-center justify-center h-80 bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl">
      <div class="text-center">
        <svg class="mx-auto h-20 w-20 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="text-xl font-bold text-gray-800 mb-2">No Trends Data</h3>
        <p class="text-gray-600">No forecast trends data available</p>
      </div>
    </div>
    
    <!-- Chart Container -->
    <div v-else class="chart-container bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div class="chart-header bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-white">Forecast Trends</h3>
            <p class="text-blue-100 text-sm">Projected vs Probability-Weighted Values</p>
          </div>
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-400 rounded-full"></div>
              <span class="text-white text-xs font-medium">Projected</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-blue-300 rounded-full"></div>
              <span class="text-white text-xs font-medium">Weighted</span>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-content p-6">
        <canvas ref="canvasRef"></canvas>
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
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const canvasRef = ref(null)
let chartInstance = null
let resizeHandler = null
let visibilityHandler = null

// ✅ Destroy chart safely
function destroyChart() {
  if (chartInstance) {
    try {
      chartInstance.destroy()
      chartInstance = null
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

// Process data for chart
const processChartData = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) return { labels: [], datasets: [] }
  
  // Convert reactive proxy to raw data using toRaw
  const rawData = toRaw(data)
  
  const labels = rawData.map(item => item.month_name || item.month || item.date || 'Unknown')
  
  // Extract projected value trend data
  const projectedValues = rawData.map(item => Number(item.projected_value) || 0)
  
  // Extract probability weighted trend data
  const probabilityWeightedValues = rawData.map(item => Number(item.probability_weighted) || 0)
  
  return {
    labels,
    datasets: [
      {
        label: 'Projected Value',
        data: projectedValues,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 4,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#10B981',
        pointBorderWidth: 4,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: '#10B981',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
        shadowOffsetX: 0,
        shadowOffsetY: 6,
        shadowBlur: 12,
        shadowColor: 'rgba(16, 185, 129, 0.4)'
      },
      {
        label: 'Probability Weighted',
        data: probabilityWeightedValues,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 4,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3B82F6',
        pointBorderWidth: 4,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: '#3B82F6',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
        shadowOffsetX: 0,
        shadowOffsetY: 6,
        shadowBlur: 12,
        shadowColor: 'rgba(59, 130, 246, 0.4)'
      }
    ]
  }
}

// ✅ Build and render chart
async function renderChart() {
  const canvas = canvasRef.value
  if (!canvas) return console.warn('No canvas element found')
  const ready = await waitForCanvasReady(canvas)
  if (!ready) return

  const ctx = canvas.getContext('2d')
  const safeData = JSON.parse(JSON.stringify(toRaw(props.data || [])))
  const chartData = processChartData(safeData)

  destroyChart()
  try {
  
  const config = {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: false
        },
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            font: {
              size: 13,
              weight: '500'
            },
            color: '#64748b'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#e2e8f0',
          borderColor: '#10B981',
          borderWidth: 2,
          cornerRadius: 16,
          displayColors: true,
          titleFont: {
            size: 15,
            weight: 'bold'
          },
          bodyFont: {
            size: 14,
            weight: '500'
          },
          padding: 16,
          callbacks: {
            title: (context) => {
              return context[0].label
            },
            label: (context) => {
              const value = context.parsed.y
              return `${context.dataset.label}: $${value.toLocaleString()}`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 13,
              weight: '500'
            },
            padding: 8
          }
        },
        y: {
          grid: {
            color: '#f1f5f9',
            drawBorder: false,
            lineWidth: 1
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 13,
              weight: '500'
            },
            padding: 8,
            callback: function(value) {
              return '$' + value.toLocaleString()
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart',
        delay: (context) => {
          return context.dataIndex * 100
        }
      },
      transitions: {
        show: {
          animations: {
            x: {
              from: 0
            },
            y: {
              from: 0
            }
          }
        },
        hide: {
          animations: {
            x: {
              to: 0
            },
            y: {
              to: 0
            }
          }
        }
      }
    }
  }
  
    chartInstance = new Chart(ctx, config)
    console.log('✅ ForecastTrendsChart rendered successfully:', chartData)
  } catch (err) {
    console.error('Chart render error:', err)
  }
}

// ✅ Watch data updates and re-render
watch(
  () => props.data,
  (newVal) => {
    if (!newVal) return
    renderChart()
  },
  { deep: true, immediate: true }
)

// ✅ Mount lifecycle
onMounted(() => {
  renderChart()

  // Handle window resize
  resizeHandler = () => {
    if (chartInstance) chartInstance.resize()
  }
  window.addEventListener('resize', resizeHandler)

  // Re-render when tab becomes visible again
  visibilityHandler = () => {
    if (document.visibilityState === 'visible') renderChart()
  }
  document.addEventListener('visibilitychange', visibilityHandler)
})

// ✅ Cleanup on unmount
onBeforeUnmount(() => {
  destroyChart()
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler)
})

// Expose renderChart function for external calls
defineExpose({
  renderChart
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}

.chart-content {
  height: 400px;
  position: relative;
}

.forecast-trends-chart {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
</style>
