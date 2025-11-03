<template>
  <div class="min-h-screen bg-gray-50" v-if="!hasError">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-900">Subscriptions Dashboard</h1>
            <p class="text-sm text-gray-600">Monitor and manage customer subscriptions</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="refreshData"
              :disabled="subscriptionsStore.subscriptionsLoading"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Refresh Data
            </button>
            <router-link to="/commerce/subscription-plans">
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Manage Plans
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Active Subscriptions -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Subscriptions</p>
                <p class="text-xl font-bold text-gray-900">{{ subscriptionsStore.analytics?.activeSubscriptions || activeSubscriptionsCount }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- MRR -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Recurring Revenue</p>
                <p class="text-xl font-bold text-gray-900">${{ formatCurrency(subscriptionsStore.analytics?.monthlyRecurringRevenue) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Churn Rate -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg class="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Churn Rate</p>
                <p class="text-xl font-bold text-gray-900">{{ subscriptionsStore.analytics?.churnRate || '0.0' }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue This Month -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue This Month</p>
                <p class="text-xl font-bold text-gray-900">${{ formatCurrency(subscriptionsStore.analytics?.revenueThisMonth) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue Analytics -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Revenue Trend Chart -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="px-6 py-5 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                  Last 30 days
                </span>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div v-if="analyticsLoading" class="h-64 flex items-center justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <div v-else class="h-64">
              <canvas ref="revenueChart" width="400" height="200" v-if="chartData.labels && chartData.labels.length > 0"></canvas>
              <div v-else class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p class="mt-2 text-sm text-gray-500">No revenue data available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Summary -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="px-6 py-5 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Revenue Summary</h3>
          </div>
          <div class="p-8">
            <div class="space-y-8">
              <!-- Total MRR -->
              <div>
                <div class="flex items-baseline justify-between mb-2">
                  <span class="text-sm font-medium text-gray-600">Total MRR</span>
                  <span class="text-2xl font-semibold text-gray-900">${{ formatCurrency(subscriptionsStore.analytics?.monthlyRecurringRevenue) }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 75%"></div>
                </div>
              </div>
              
              <!-- This Month -->
              <div>
                <div class="flex items-baseline justify-between mb-2">
                  <span class="text-sm font-medium text-gray-600">This Month</span>
                  <span class="text-2xl font-semibold text-gray-900">${{ formatCurrency(subscriptionsStore.analytics?.revenueThisMonth) }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 60%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscriptions Table -->
      <SubscriptionListTable
        :subscriptions="subscriptionsStore.subscriptions"
        :available-plans="subscriptionsStore.plans"
        @view-details="viewSubscriptionDetails"
        @change-plan="changePlan"
        @cancel="cancelSubscription"
        @open-portal="openPortal"
      />
    </div>

    <!-- Subscription Detail Modal -->
    <SubscriptionDetailModal
      :show="showDetailModal"
      :subscription="selectedSubscription"
      @close="closeDetailModal"
      @cancel="cancelSubscription"
      @open-portal="openPortal"
    />
  </div>
  
  <!-- Error State -->
  <div v-else class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
      <p class="text-gray-600 mb-6">There was an error loading the subscriptions dashboard.</p>
      <BaseButton variant="primary" size="md" @click="retryLoad">
        Try Again
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, onErrorCaptured } from 'vue'
import { useCommerceSubscriptionsStore } from '@/stores/useCommerceSubscriptionsStore'
import SubscriptionListTable from '@/components/commerce/SubscriptionListTable.vue'
import SubscriptionDetailModal from '@/components/commerce/SubscriptionDetailModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const subscriptionsStore = useCommerceSubscriptionsStore()

const showDetailModal = ref(false)
const selectedSubscription = ref(null)
const revenueChart = ref(null)
const hasError = ref(false)
const analyticsLoading = ref(false)
let chartInstance = null

const formatCurrency = (amount) => {
  if (!amount) return '0.00'
  return parseFloat(amount).toFixed(2)
}

// Computed properties to calculate analytics from actual subscription data
const activeSubscriptionsCount = computed(() => {
  return subscriptionsStore.subscriptions.filter(sub => sub.status === 'active').length
})

// Chart data computed property
const chartData = computed(() => {
  if (!subscriptionsStore.analytics?.mrrTrend || subscriptionsStore.analytics.mrrTrend.length === 0) {
    return { labels: [], datasets: [] }
  }

  const mrrData = subscriptionsStore.analytics.mrrTrend
  const labels = mrrData.map(item => item.month)
  const data = mrrData.map(item => item.mrr)

  return {
    labels: labels,
    datasets: [{
      label: 'Daily Revenue',
      data: data,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  }
})

const refreshData = async () => {
  try {
    analyticsLoading.value = true
    await Promise.all([
      subscriptionsStore.fetchSubscriptions(),
      subscriptionsStore.fetchPlans(),
      fetchAnalytics()
    ])
  } catch (error) {
    console.error('Error refreshing data:', error)
  } finally {
    analyticsLoading.value = false
  }
}

const fetchAnalytics = async () => {
  try {
    // Use the existing store method which handles authentication properly
    await subscriptionsStore.fetchAnalytics()
    console.log('Analytics data loaded from store:', subscriptionsStore.analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
  }
}

const viewSubscriptionDetails = async (subscription) => {
  try {
    // Fetch detailed subscription data including invoices
    await subscriptionsStore.getSubscription(subscription.id)
    selectedSubscription.value = subscriptionsStore.selectedSubscription
    showDetailModal.value = true
  } catch (error) {
    console.error('Error fetching subscription details:', error)
    // Fallback to basic subscription data if API fails
    selectedSubscription.value = subscription
    showDetailModal.value = true
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedSubscription.value = null
}

const changePlan = async (subscriptionId, newPlanId) => {
  try {
    await subscriptionsStore.changePlan(subscriptionId, newPlanId)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Plan Changed!',
        text: 'Subscription plan has been changed successfully',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } catch (error) {
    console.error('Error changing plan:', error)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to change plan',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  }
}

const cancelSubscription = async (subscriptionId) => {
  try {
    await subscriptionsStore.cancelSubscription(subscriptionId, true)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Subscription Cancelled!',
        text: 'Subscription will be cancelled at the end of the current period',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to cancel subscription',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  }
}

const openPortal = async (subscriptionId) => {
  try {
    await subscriptionsStore.openPortal(subscriptionId)
  } catch (error) {
    console.error('Error opening portal:', error)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to open billing portal',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  }
}

const createRevenueChart = () => {
  try {
    if (!revenueChart.value || !chartData.value.labels || chartData.value.labels.length === 0) return

    const ctx = revenueChart.value.getContext('2d')
    if (!ctx) return
    
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: chartData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'Revenue: $' + context.parsed.y.toLocaleString()
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString()
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        elements: {
          point: {
            radius: 4,
            hoverRadius: 6
          }
        }
      }
    })
  } catch (error) {
    console.error('Error creating revenue chart:', error)
  }
}

const retryLoad = async () => {
  hasError.value = false
  await initializeDashboard()
}

const initializeDashboard = async () => {
  try {
    hasError.value = false
    analyticsLoading.value = true
    
    await Promise.all([
      subscriptionsStore.fetchSubscriptions(),
      subscriptionsStore.fetchPlans(),
      fetchAnalytics()
    ])
    
    console.log('Subscriptions after fetch:', subscriptionsStore.subscriptions)
    console.log('Analytics data from store:', subscriptionsStore.analytics)
    console.log('Chart data:', chartData.value)
    
    await nextTick()
    // Add a small delay to ensure DOM is fully rendered
    setTimeout(() => {
      createRevenueChart()
    }, 100)
  } catch (error) {
    console.error('Error initializing subscriptions dashboard:', error)
    hasError.value = true
  } finally {
    analyticsLoading.value = false
  }
}

onMounted(async () => {
  await initializeDashboard()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

// Global error handler for this component
onErrorCaptured((error, instance, info) => {
  console.error('Component error captured:', error, info)
  hasError.value = true
  return false // Prevent error from propagating
})
</script>
