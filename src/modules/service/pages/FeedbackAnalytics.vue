<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 class="text-xl font-semibold text-gray-900">Feedback Analytics</h1>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Refresh button -->
            <button
              @click="refreshData"
              class="p-2 text-gray-400 hover:text-gray-500 transition-colors"
              title="Refresh data"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            
            <!-- Date Range Selector -->
            <select
              v-model="selectedPeriod"
              @change="onPeriodChange"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Surveys -->
        <EnhancedAnalyticsCard
          title="Total Surveys"
          :value="feedbackStore.surveySummary.totalSurveys"
          icon="document"
          icon-color="blue"
          :trend="{ direction: 'up', percentage: 12 }"
          description="Active survey campaigns"
        />

        <!-- Response Rate -->
        <EnhancedAnalyticsCard
          title="Response Rate"
          :value="feedbackStore.surveySummary.responseRate"
          unit="%"
          :status="getResponseRateStatus(feedbackStore.surveySummary.responseRate)"
          icon="check-circle"
          :icon-color="getResponseRateColor(feedbackStore.surveySummary.responseRate)"
          :show-progress="true"
          :progress-percentage="Math.min(feedbackStore.surveySummary.responseRate, 100)"
          :progress-color="getResponseRateProgressColor(feedbackStore.surveySummary.responseRate)"
          :progress-label="`${feedbackStore.surveySummary.responseRate}% response rate`"
          :trend="{ direction: 'up', percentage: 8 }"
          description="Customer engagement level"
        />

        <!-- Average CSAT -->
        <EnhancedAnalyticsCard
          title="Average CSAT"
          :value="feedbackStore.surveySummary.averageCSAT.toFixed(1)"
          :status="getCSATCategory(feedbackStore.surveySummary.averageCSAT)"
          icon="star"
          :icon-color="getCSATColor(feedbackStore.surveySummary.averageCSAT)"
          :show-progress="true"
          :progress-percentage="(feedbackStore.surveySummary.averageCSAT / 5) * 100"
          :progress-color="getCSATProgressColor(feedbackStore.surveySummary.averageCSAT)"
          :progress-label="`${feedbackStore.surveySummary.averageCSAT.toFixed(1)}/5.0 rating`"
          :trend="{ direction: 'up', percentage: 5 }"
          description="Customer satisfaction score"
        />

        <!-- Total Responses -->
        <EnhancedAnalyticsCard
          title="Total Responses"
          :value="feedbackStore.surveySummary.totalResponses"
          icon="users"
          icon-color="emerald"
          :trend="{ direction: 'up', percentage: 15 }"
          description="Feedback submissions received"
        />
      </div>

      <!-- Charts and Analytics -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- CSAT Trends Chart -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">CSAT Trends</h3>
                <p class="text-sm text-gray-500">Customer satisfaction over time</p>
              </div>
            </div>
            <div class="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                v-for="period in ['7d', '30d', '90d']"
                :key="period"
                @click="selectedPeriod = period; onPeriodChange()"
                :class="[
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                  selectedPeriod === period
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                ]"
              >
                {{ period }}
              </button>
            </div>
          </div>
          
          <!-- Professional CSAT Trends Chart -->
          <CSATTrendsChart
            :data="feedbackStore.csatTrends.daily"
            :period="selectedPeriod"
          />
        </div>

        <!-- Agent Performance -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Top Performing Agents</h3>
                <p class="text-sm text-gray-500">CSAT performance ranking</p>
              </div>
            </div>
            <button
              @click="fetchAgentPerformance"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
            >
              View All
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-3">
            <div
              v-for="(agent, index) in feedbackStore.topAgents"
              :key="agent.id"
              class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 group"
            >
              <div class="flex items-center space-x-4">
                <div class="relative">
                  <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span class="text-sm font-bold text-white">{{ index + 1 }}</span>
                  </div>
                  <div v-if="index === 0" class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <svg class="w-2.5 h-2.5 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">{{ agent.name }}</p>
                  <p class="text-sm text-gray-500">{{ agent.tickets_count }} tickets • {{ agent.response_rate }}% response rate</p>
                </div>
              </div>
              <div class="text-right">
                <div class="flex items-center space-x-2">
                  <div class="flex">
                    <svg
                      v-for="star in 5"
                      :key="star"
                      :class="[
                        'w-4 h-4',
                        star <= Math.round(agent.averageCSAT)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="text-lg font-bold text-gray-900">{{ agent.averageCSAT.toFixed(1) }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">CSAT Score</p>
              </div>
            </div>
            
            <div v-if="feedbackStore.topAgents.length === 0 && !feedbackStore.agentPerformanceLoading" class="text-center py-8">
              <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p class="text-gray-500">No agent performance data available</p>
            </div>
            
            <div v-if="feedbackStore.agentPerformanceLoading" class="text-center py-8">
              <div class="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p class="text-gray-500 text-sm">Loading agent performance...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tickets with CSAT -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Recent Tickets with CSAT</h3>
                <p class="text-sm text-gray-500">Customer feedback analysis</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <label class="text-sm text-gray-600 font-medium">Filter:</label>
                <select
                  v-model="csatFilter"
                  @change="onCSATFilterChange"
                  class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <button
                @click="fetchTicketsWithCSAT"
                class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-1" :class="{ 'animate-spin': feedbackStore.ticketsWithCSATLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CSAT Rating
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feedback
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="ticket in feedbackStore.ticketsWithCSAT"
                :key="ticket.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">
                      #{{ ticket.id }}
                    </div>
                    <div class="ml-2 text-sm text-gray-500 max-w-xs truncate">
                      {{ ticket.subject }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ ticket.customer_name || 'Unassigned' }}</div>
                  <div class="text-sm text-gray-500">{{ ticket.customer_email || 'No email' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex">
                      <svg
                        v-for="star in 5"
                        :key="star"
                        :class="[
                          'w-4 h-4',
                          star <= ticket.csat_rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        ]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span class="ml-2 text-sm text-gray-600">{{ ticket.csat_rating }}/5</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs">
                    <div v-if="ticket.feedback_text" class="truncate" :title="ticket.feedback_text">
                      {{ ticket.feedback_text }}
                    </div>
                    <div v-else class="text-gray-500 italic">
                      No feedback provided
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(ticket.feedback_date) }}
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="feedbackStore.ticketsWithCSAT.length === 0 && !feedbackStore.ticketsWithCSATLoading" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No CSAT Data Available</h3>
            <p class="text-gray-500">No tickets with customer feedback found for the selected period.</p>
          </div>
          
          <div v-if="feedbackStore.ticketsWithCSATLoading" class="text-center py-12">
            <div class="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-500">Loading tickets with CSAT data...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFeedbackAnalyticsStore } from '../store/feedbackAnalytics'
import EnhancedAnalyticsCard from '../components/EnhancedAnalyticsCard.vue'
import CSATTrendsChart from '../components/CSATTrendsChart.vue'

// Store
const feedbackStore = useFeedbackAnalyticsStore()

// Local state
const selectedPeriod = ref('30d')
const csatFilter = ref('all')

// Methods
const refreshData = async () => {
  await feedbackStore.refreshAll()
}

const onPeriodChange = async () => {
  await feedbackStore.fetchCSATTrends(selectedPeriod.value)
}

const onCSATFilterChange = async () => {
  const params = csatFilter.value !== 'all' ? { rating: csatFilter.value } : {}
  await feedbackStore.fetchTicketsWithCSAT(params)
}

const fetchAgentPerformance = async () => {
  await feedbackStore.fetchAgentPerformance()
}

const fetchTicketsWithCSAT = async () => {
  const params = csatFilter.value !== 'all' ? { rating: csatFilter.value } : {}
  await feedbackStore.fetchTicketsWithCSAT(params)
}

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getCSATCategory = (rating) => {
  if (rating >= 4.5) return 'Excellent'
  if (rating >= 3.5) return 'Good'
  if (rating >= 2.5) return 'Average'
  return 'Poor'
}

const getCSATColor = (rating) => {
  if (rating >= 4.5) return 'green'
  if (rating >= 3.5) return 'blue'
  if (rating >= 2.5) return 'yellow'
  return 'red'
}

const getCSATProgressColor = (rating) => {
  if (rating >= 4.5) return 'bg-green-500'
  if (rating >= 3.5) return 'bg-blue-500'
  if (rating >= 2.5) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getResponseRateStatus = (rate) => {
  if (rate >= 80) return 'Excellent'
  if (rate >= 60) return 'Good'
  if (rate >= 40) return 'Average'
  return 'Poor'
}

const getResponseRateColor = (rate) => {
  if (rate >= 80) return 'green'
  if (rate >= 60) return 'blue'
  if (rate >= 40) return 'yellow'
  return 'red'
}

const getResponseRateProgressColor = (rate) => {
  if (rate >= 80) return 'bg-green-500'
  if (rate >= 60) return 'bg-blue-500'
  if (rate >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

// Lifecycle
onMounted(async () => {
  await refreshData()
})
</script>
