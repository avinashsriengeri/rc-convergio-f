<template>
  <div class="analytics-chart">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p class="text-blue-700 font-medium">Loading analytics...</p>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center h-80 bg-gradient-to-br from-red-50 to-pink-100 rounded-xl">
      <div class="text-center">
        <svg class="mx-auto h-16 w-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="text-lg font-semibold text-red-800 mb-2">Chart Error</h3>
        <p class="text-red-600">{{ error }}</p>
      </div>
    </div>
    
    <!-- No Data State -->
    <div v-else-if="!chartData || chartData.length === 0" class="flex items-center justify-center h-80 bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl">
      <div class="text-center">
        <div class="relative">
          <svg class="mx-auto h-20 w-20 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <div class="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">No Data Available</h3>
        <p class="text-gray-600 mb-4">No analytics data for this period</p>
        <div class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Try selecting a different period
        </div>
      </div>
    </div>
    
    <!-- Chart Container -->
    <div v-else class="chart-container bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div class="chart-header bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-white">{{ getChartTitle() }}</h3>
            <p class="text-blue-100 text-sm">{{ getChartSubtitle() }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-white rounded-full"></div>
            <div class="w-3 h-3 bg-blue-300 rounded-full"></div>
            <div class="w-3 h-3 bg-blue-200 rounded-full"></div>
          </div>
        </div>
      </div>
      <div class="chart-content p-6">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    default: 'line' // 'line', 'bar', 'area'
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

const chartCanvas = ref(null)
const chartInstance = ref(null)

const chartData = ref([])

// Chart title and subtitle methods
const getChartTitle = () => {
  if (!props.data || !props.data.module) return 'Analytics Chart'
  const moduleNames = {
    'contacts': 'Contact Analytics',
    'deals': 'Deal Performance', 
    'campaigns': 'Campaign Metrics',
    'ads': 'Ad Performance',
    'events': 'Event Analytics',
    'meetings': 'Meeting Insights',
    'tasks': 'Task Progress',
    'companies': 'Company Growth',
    'forecast': 'Revenue Forecast',
    'lead_scoring': 'Lead Scoring',
    'lead-scoring': 'Lead Scoring',
    'journeys': 'Customer Journeys',
    'visitor_intent': 'Visitor Intent',
    'visitor-intent': 'Visitor Intent'
  }
  return moduleNames[props.data.module] || `${props.data.module.charAt(0).toUpperCase() + props.data.module.slice(1)} Analytics`
}

const getChartSubtitle = () => {
  if (!props.data) return 'Analytics Overview'
  const total = props.data.total || 0
  const growth = props.data.growth_rate || 0
  return `Total: ${total.toLocaleString()} • Growth: ${growth >= 0 ? '+' : ''}${growth}%`
}

// Process data for chart
const processChartData = (data) => {
  if (!data) return []
  
  // Handle different API response structures
  if (data.chart_data && Array.isArray(data.chart_data)) {
    return data.chart_data.map(item => ({
      x: item.date || item.label || item.name,
      y: item.value || item.count || item.total || 0
    }))
  }
  
  // If no chart_data, create sample data from available metrics
  if (data.total !== undefined) {
    const sampleData = []
    const currentValue = data.total || 0
    const growthRate = data.growth_rate || 0
    
    // Create 7 days of sample data based on current values
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayValue = Math.max(0, currentValue + (Math.random() - 0.5) * currentValue * 0.2)
      sampleData.push({
        x: date.toISOString().split('T')[0],
        y: Math.round(dayValue)
      })
    }
    return sampleData
  }
  
  return []
}

// Create chart
const createChart = () => {
  if (!chartCanvas.value || chartData.value.length === 0) return
  
  const ctx = chartCanvas.value.getContext('2d')
  
  // Destroy existing chart instance
  if (chartInstance.value) {
    try {
      chartInstance.value.destroy()
      chartInstance.value = null
    } catch (err) {
      console.warn('Error destroying chart instance:', err)
    }
  }
  
  // Check if canvas already has a chart and destroy it
  const existingChart = ChartJS.getChart(ctx)
  if (existingChart) {
    try {
      existingChart.destroy()
    } catch (err) {
      console.warn('Error destroying existing chart:', err)
    }
  }
  
  const config = {
    type: props.type === 'area' ? 'line' : props.type,
    data: {
      labels: chartData.value.map(item => item.x),
      datasets: [{
        label: 'Value',
        data: chartData.value.map(item => item.y),
        borderColor: '#3B82F6',
        backgroundColor: props.type === 'area' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.9)',
        borderWidth: 3,
        fill: props.type === 'area',
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3B82F6',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#1D4ED8',
        pointHoverBorderWidth: 4,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowBlur: 8,
        shadowColor: 'rgba(59, 130, 246, 0.3)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: false
        },
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#e2e8f0',
          borderColor: '#3B82F6',
          borderWidth: 2,
          cornerRadius: 16,
          displayColors: false,
          titleFont: {
            size: 15,
            weight: 'bold'
          },
          bodyFont: {
            size: 14,
            weight: '500'
          },
          padding: 16,
          titleSpacing: 6,
          bodySpacing: 6,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
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
            padding: 8
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  }
  
  chartInstance.value = new ChartJS(ctx, config)
}

// Watch for data changes
watch(() => props.data, (newData) => {
  chartData.value = processChartData(newData)
  nextTick(() => {
    createChart()
  })
}, { deep: true, immediate: true })

// Watch for type changes
watch(() => props.type, () => {
  nextTick(() => {
    createChart()
  })
})

onMounted(() => {
  chartData.value = processChartData(props.data)
  nextTick(() => {
    createChart()
  })
})

// Cleanup on unmount
onUnmounted(() => {
  if (chartInstance.value) {
    try {
      chartInstance.value.destroy()
      chartInstance.value = null
    } catch (err) {
      console.warn('Error destroying chart on unmount:', err)
    }
  }
  
  // Also check canvas for any existing chart
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d')
    const existingChart = ChartJS.getChart(ctx)
    if (existingChart) {
      try {
        existingChart.destroy()
      } catch (err) {
        console.warn('Error destroying existing chart on unmount:', err)
      }
    }
  }
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

.analytics-chart {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
</style>
