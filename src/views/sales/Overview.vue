<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Sales Overview</h1>
      <p class="text-gray-600">Monitor your sales performance and track key metrics</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Loading sales data...</span>
    </div>

    <!-- KPIs Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <!-- Total Quotes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Quotes</dt>
              <dd class="text-2xl font-semibold text-gray-900">{{ stats.totalQuotes || 0 }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Sent Quotes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Sent Quotes</dt>
              <dd class="text-2xl font-semibold text-gray-900">{{ stats.sentQuotes || 0 }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Accepted Quotes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Accepted</dt>
              <dd class="text-2xl font-semibold text-gray-900">{{ stats.acceptedQuotes || 0 }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Total Value -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Value</dt>
              <dd class="text-2xl font-semibold text-gray-900">${{ formatCurrency(stats.totalValue) }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Total Deal Revenue -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Deal Revenue</dt>
              <dd class="text-2xl font-semibold text-green-600">${{ formatCurrency(stats.totalDealRevenue) }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Recent Quotes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Recent Quotes</h3>
        </div>
        <div class="p-6">
          <div v-if="recentQuotes.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No quotes yet</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating your first quote.</p>
            <div class="mt-6">
              <router-link
                to="/sales/quotes/create"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Quote
              </router-link>
            </div>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="quote in recentQuotes"
              :key="quote.id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900">Quote #{{ quote.quote_number }}</h4>
                <p class="text-sm text-gray-500">{{ quote.deal?.title || 'No Deal' }}</p>
              </div>
              <div class="flex items-center space-x-3">
                <span :class="getStatusBadgeClass(quote.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ quote.status }}
                </span>
                <span class="text-sm font-medium text-gray-900">${{ formatCurrency(quote.total_amount) }}</span>
                <router-link
                  :to="`/sales/quotes/${quote.id}`"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <router-link
              to="/sales/quotes"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-medium text-gray-900">Manage Quotes</h4>
                <p class="text-sm text-gray-500">View and manage all your quotes</p>
              </div>
            </router-link>

            <router-link
              to="/sales/quotes/create"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-medium text-gray-900">Create New Quote</h4>
                <p class="text-sm text-gray-500">Generate a new quote for your client</p>
              </div>
            </router-link>

            <router-link
              to="/deals"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-medium text-gray-900">View Deals</h4>
                <p class="text-sm text-gray-500">Manage your sales pipeline</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Quote Breakdown -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Quote Breakdown</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ stats.totalQuotes || 0 }}</div>
            <div class="text-sm text-gray-500">Total Quotes</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ stats.acceptedQuotes || 0 }}</div>
            <div class="text-sm text-gray-500">Accepted</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ stats.followUpQuotes || 0 }}</div>
            <div class="text-sm text-gray-500">Follow-up</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ stats.renewalQuotes || 0 }}</div>
            <div class="text-sm text-gray-500">Renewals</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Chart Placeholder -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Sales Performance</h3>
      </div>
      <div class="p-6">
        <div class="h-64 flex items-center justify-center text-gray-500">
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Chart Coming Soon</h3>
            <p class="mt-1 text-sm text-gray-500">Sales performance charts will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuotesStore } from '@/stores/quotesStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const quotesStore = useQuotesStore()

// Reactive data
const loading = ref(true)
const stats = ref({
  totalQuotes: 0,
  sentQuotes: 0,
  acceptedQuotes: 0,
  totalValue: 0,
  totalDealRevenue: 0,
  followUpQuotes: 0,
  renewalQuotes: 0
})
const recentQuotes = ref([])

// Methods
const loadOverviewData = async () => {
  loading.value = true
  try {
    // Fetch quotes with basic stats
    await quotesStore.fetchQuotes({ per_page: 5, sort: '-created_at' })
    
    // Calculate stats from quotes
    const allQuotes = await quotesStore.fetchQuotes({ per_page: 1000 })
    
    stats.value = {
      totalQuotes: quotesStore.quotes.length,
      sentQuotes: quotesStore.quotes.filter(q => q.status === 'sent').length,
      acceptedQuotes: quotesStore.quotes.filter(q => q.status === 'accepted').length,
      totalValue: quotesStore.quotes.reduce((sum, q) => sum + (q.total_amount || 0), 0)
    }
    
    // Get recent quotes
    recentQuotes.value = quotesStore.quotes.slice(0, 5)
  } catch (error) {
    console.error('Error loading overview data:', error)
  } finally {
    loading.value = false
  }
}

const formatCurrency = (amount) => {
  if (!amount) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const getStatusBadgeClass = (status) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(() => {
  loadOverviewData()
})
</script>
