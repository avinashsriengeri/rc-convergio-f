<template>
  <div class="analytics-charts">
    <!-- Revenue Trend Chart -->
    <div v-if="type === 'revenue'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Revenue Trend</h3>
        <div class="flex items-center space-x-2">
          <select 
            v-model="selectedPeriod" 
            @change="updateChart"
            class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-purple"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>
      <div class="h-64">
        <canvas ref="revenueChart" v-if="!loading"></canvas>
        <div v-else class="flex items-center justify-center h-full">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-purple"></div>
        </div>
      </div>
    </div>

    <!-- Conversion Rate Chart -->
    <div v-if="type === 'conversion'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Conversion Rate</h3>
        <div class="flex items-center space-x-2">
          <div class="text-sm text-gray-500">
            {{ conversionRate }}% this month
          </div>
          <div v-if="!data.conversion || data.conversion.length === 0" class="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
            Sample Data
          </div>
        </div>
      </div>
      <div class="h-64">
        <canvas ref="conversionChart" v-if="!loading"></canvas>
        <div v-else class="flex items-center justify-center h-full">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-purple"></div>
        </div>
      </div>
    </div>

    <!-- Transactions Chart -->
    <div v-if="type === 'transactions'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Transaction Volume</h3>
        <div class="flex items-center space-x-2">
          <select 
            v-model="selectedPeriod" 
            @change="updateChart"
            class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-purple"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <div v-if="!data.transactions || data.transactions.length === 0" class="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
            Sample Data
          </div>
        </div>
      </div>
      <div class="h-64">
        <canvas ref="transactionsChart" v-if="!loading"></canvas>
        <div v-else class="flex items-center justify-center h-full">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-purple"></div>
        </div>
      </div>
    </div>

    <!-- Payment Links Analytics -->
    <div v-if="type === 'payment-links'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Payment Link Performance</h3>
        <div class="flex items-center space-x-2">
          <div class="text-sm text-gray-500">
            Last 30 days
          </div>
          <div v-if="!data.paymentLinks || data.paymentLinks.length === 0" class="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
            Sample Data
          </div>
        </div>
      </div>
      <div class="h-64">
        <canvas ref="paymentLinksChart" v-if="!loading"></canvas>
        <div v-else class="flex items-center justify-center h-full">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-purple"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import ChartJS from 'chart.js/auto'

// Test Chart.js import
console.log('Chart.js imported successfully:', ChartJS)

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['revenue', 'conversion', 'transactions', 'payment-links'].includes(value)
  },
  data: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['period-change'])

const revenueChart = ref(null)
const conversionChart = ref(null)
const transactionsChart = ref(null)
const paymentLinksChart = ref(null)
const selectedPeriod = ref('30d')
const conversionRate = ref(0)

let chartInstance = null

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: '#8B5CF6',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#6B7280'
      }
    },
    y: {
      grid: {
        color: '#F3F4F6'
      },
      ticks: {
        color: '#6B7280'
      }
    }
  }
}

const createRevenueChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = revenueChart.value?.getContext('2d')
  if (!ctx) return

  const revenueData = props.data.revenue || []
  console.log('Creating revenue chart with data:', revenueData)
  
  // Handle different date formats from API
  const labels = revenueData.map(item => {
    // If date is already a formatted string like "Sep 2025", use it directly
    if (typeof item.date === 'string' && item.date.includes(' ')) {
      return item.date
    }
    // Otherwise, try to parse as Date
    try {
      return new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch (e) {
      return item.date // Fallback to original value
    }
  })
  const values = revenueData.map(item => item.amount || 0)

  console.log('Chart labels:', labels)
  console.log('Chart values:', values)

  chartInstance = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Revenue',
        data: values,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      ...chartOptions,
      scales: {
        ...chartOptions.scales,
        y: {
          ...chartOptions.scales.y,
          ticks: {
            ...chartOptions.scales.y.ticks,
            callback: function(value) {
              return '$' + value.toLocaleString()
            }
          }
        }
      }
    }
  })
}

const createConversionChart = () => {
  console.log('Creating conversion chart...')
  
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const ctx = conversionChart.value?.getContext('2d')
  if (!ctx) {
    console.error('Conversion chart canvas context not found')
    return
  }

  const conversionData = props.data.conversion || []
  console.log('Conversion data length:', conversionData.length)
  
  // Always create a chart - use sample data if no real data
  let chartData, labels, values
  
  if (conversionData.length === 0) {
    console.log('No conversion data, using sample data')
    chartData = [
      { date: '2025-10-01', rate: 12.5 },
      { date: '2025-10-02', rate: 15.2 },
      { date: '2025-10-03', rate: 11.8 },
      { date: '2025-10-04', rate: 18.3 },
      { date: '2025-10-05', rate: 14.7 }
    ]
  } else {
    chartData = conversionData
  }
  
  labels = chartData.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
  values = chartData.map(item => item.rate)

  // Calculate average conversion rate
  conversionRate.value = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 0

  console.log('Conversion chart labels:', labels)
  console.log('Conversion chart values:', values)

  chartInstance = new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Conversion Rate (%)',
        data: values,
        backgroundColor: conversionData.length === 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.8)',
        borderColor: '#22C55E',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      ...chartOptions,
      scales: {
        ...chartOptions.scales,
        y: {
          ...chartOptions.scales.y,
          ticks: {
            ...chartOptions.scales.y.ticks,
            callback: function(value) {
              return value + '%'
            }
          }
        }
      }
    }
  })
  
  console.log('Conversion chart created successfully')
}

const createTransactionsChart = () => {
  console.log('Creating transactions chart...')
  
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const ctx = transactionsChart.value?.getContext('2d')
  if (!ctx) {
    console.error('Transactions chart canvas context not found')
    return
  }

  const transactionData = props.data.transactions || []
  console.log('Transaction data length:', transactionData.length)
  
  // Always create a chart - use sample data if no real data
  let chartData, labels, values
  
  if (transactionData.length === 0) {
    console.log('No transaction data, using sample data')
    chartData = [
      { date: '2025-10-01', count: 25 },
      { date: '2025-10-02', count: 32 },
      { date: '2025-10-03', count: 18 },
      { date: '2025-10-04', count: 41 },
      { date: '2025-10-05', count: 28 }
    ]
  } else {
    chartData = transactionData
  }
  
  labels = chartData.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
  values = chartData.map(item => item.count)

  console.log('Transactions chart labels:', labels)
  console.log('Transactions chart values:', values)

  chartInstance = new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Transactions',
        data: values,
        backgroundColor: transactionData.length === 0 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3B82F6',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: chartOptions
  })
  
  console.log('Transactions chart created successfully')
}

const createPaymentLinksChart = () => {
  console.log('Creating payment links chart...')
  
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const ctx = paymentLinksChart.value?.getContext('2d')
  if (!ctx) {
    console.error('Payment links chart canvas context not found')
    return
  }

  const paymentLinksData = props.data.paymentLinks || []
  console.log('Payment links data length:', paymentLinksData.length)
  
  // Always create a chart - use sample data if no real data
  let chartData, labels, views, conversions
  
  if (paymentLinksData.length === 0) {
    console.log('No payment links data, using sample data')
    chartData = [
      { name: 'Website Development', views: 245, conversions: 12 },
      { name: 'Mobile App', views: 189, conversions: 8 },
      { name: 'E-commerce Platform', views: 156, conversions: 6 },
      { name: 'Consulting Service', views: 98, conversions: 4 }
    ]
  } else {
    chartData = paymentLinksData
  }
  
  labels = chartData.map(item => item.name)
  views = chartData.map(item => item.views)
  conversions = chartData.map(item => item.conversions)

  console.log('Payment links chart labels:', labels)
  console.log('Payment links chart views:', views)
  console.log('Payment links chart conversions:', conversions)

  chartInstance = new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Views',
          data: views,
          backgroundColor: paymentLinksData.length === 0 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.8)',
          borderColor: '#8B5CF6',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: 'Conversions',
          data: conversions,
          backgroundColor: paymentLinksData.length === 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.8)',
          borderColor: '#22C55E',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        legend: {
          display: true,
          position: 'top'
        }
      }
    }
  })
  
  console.log('Payment links chart created successfully')
}

const updateChart = () => {
  emit('period-change', selectedPeriod.value)
}

const createChart = () => {
  console.log('Creating chart for type:', props.type)
  console.log('Chart data:', props.data)
  console.log('Loading state:', props.loading)
  
  // Add a small delay to ensure DOM is ready
  setTimeout(() => {
    try {
      switch (props.type) {
        case 'revenue':
          createRevenueChart()
          break
        case 'conversion':
          createConversionChart()
          break
        case 'transactions':
          createTransactionsChart()
          break
        case 'payment-links':
          createPaymentLinksChart()
          break
        default:
          console.warn('Unknown chart type:', props.type)
          // Create a fallback chart for unknown types
          createFallbackChart()
      }
    } catch (error) {
      console.error('Error creating chart:', error)
      // Try to create a fallback chart
      createFallbackChart()
    }
  }, 100)
}

const createFallbackChart = () => {
  console.log('Creating fallback chart...')
  
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  // Try to find any available canvas
  const canvas = conversionChart.value || transactionsChart.value || paymentLinksChart.value || revenueChart.value
  if (!canvas) {
    console.error('No canvas element found for fallback chart')
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.error('Canvas context not found for fallback chart')
    return
  }

  // Create a simple fallback chart
  chartInstance = new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels: ['Sample Data'],
      datasets: [{
        label: 'Sample',
        data: [100],
        backgroundColor: 'rgba(156, 163, 175, 0.3)',
        borderColor: '#9CA3AF',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })
  
  console.log('Fallback chart created successfully')
}

// Watch for data changes
watch(() => props.data, () => {
  if (!props.loading) {
    createChart()
  }
}, { deep: true })

onMounted(() => {
  console.log('AnalyticsCharts component mounted')
  console.log('Props on mount:', { type: props.type, data: props.data, loading: props.loading })
  
  // Wait a bit longer to ensure DOM is fully ready
  setTimeout(() => {
    if (!props.loading) {
      console.log('Creating chart on mount...')
      createChart()
    }
  }, 200)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.analytics-charts {
  width: 100%;
}
</style>
