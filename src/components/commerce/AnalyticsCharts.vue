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
        <div class="text-sm text-gray-500">
          {{ conversionRate }}% this month
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
        <div class="text-sm text-gray-500">
          Last 30 days
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
import { Chart as ChartJS, registerables } from 'chart.js'

// Register Chart.js components
ChartJS.register(...registerables)

// Make ChartJS available globally for vue-chartjs
if (typeof window !== 'undefined') {
  window.Chart = ChartJS
}

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
  const labels = revenueData.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
  const values = revenueData.map(item => item.amount)

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
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = conversionChart.value?.getContext('2d')
  if (!ctx) return

  const conversionData = props.data.conversion || []
  const labels = conversionData.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
  const values = conversionData.map(item => item.rate)

  // Calculate average conversion rate
  conversionRate.value = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 0

  chartInstance = new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Conversion Rate (%)',
        data: values,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
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
}

const createTransactionsChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = transactionsChart.value?.getContext('2d')
  if (!ctx) return

  const transactionData = props.data.transactions || []
  const labels = transactionData.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
  const values = transactionData.map(item => item.count)

  chartInstance = new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Transactions',
        data: values,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3B82F6',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: chartOptions
  })
}

const createPaymentLinksChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = paymentLinksChart.value?.getContext('2d')
  if (!ctx) return

  const paymentLinksData = props.data.paymentLinks || []
  const labels = paymentLinksData.map(item => item.name)
  const views = paymentLinksData.map(item => item.views)
  const conversions = paymentLinksData.map(item => item.conversions)

  chartInstance = new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Views',
          data: views,
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderColor: '#8B5CF6',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: 'Conversions',
          data: conversions,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
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
}

const updateChart = () => {
  emit('period-change', selectedPeriod.value)
}

const createChart = () => {
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
  }
}

// Watch for data changes
watch(() => props.data, () => {
  if (!props.loading) {
    createChart()
  }
}, { deep: true })

onMounted(() => {
  if (!props.loading) {
    createChart()
  }
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
