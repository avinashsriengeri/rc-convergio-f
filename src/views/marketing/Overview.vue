<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumbs -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex py-4" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <div class="flex items-center">
                <router-link to="/marketing" class="text-gray-400 hover:text-gray-500">
                  <svg class="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span class="sr-only">Home</span>
                </router-link>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-500">{{ $t('common.marketing') }}</span>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-900">{{ $t('marketing.overview.title') }}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('marketing.overview.title') }}</h1>
        <p class="mt-2 text-lg text-gray-600">Monitor your marketing performance and track key metrics</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">{{ $t('common.marketing_overview.loading') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div class="flex items-center">
          <svg class="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-red-800">Error loading marketing data</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
          <button
            @click="loadData"
            class="ml-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {{ $t('common.marketing_overview.retry_button') }}
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!hasData" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No marketing data yet</h3>
        <p class="text-gray-600 mb-6">{{ $t('common.marketing_overview.no_data_message') }}</p>
        <button
          @click="loadData"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          Connect Data Sources
        </button>
      </div>

      <!-- Data Content -->
      <div v-else class="space-y-6">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Active Campaigns -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('common.marketing_overview.active_campaigns') }}</p>
                <p class="text-3xl font-bold text-gray-900">{{ kpis.activeCampaigns }}</p>
              </div>
              <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Ad Spend -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('common.marketing_overview.ad_spend') }}</p>
                <p class="text-3xl font-bold text-gray-900">${{ formatNumber(kpis.adSpend) }}</p>
              </div>
              <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Upcoming Events -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('common.marketing_overview.upcoming_events') }}</p>
                <p class="text-3xl font-bold text-gray-900">{{ kpis.upcomingEvents }}</p>
              </div>
              <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Meetings Scheduled -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('common.marketing_overview.meetings_scheduled') }}</p>
                <p class="text-3xl font-bold text-gray-900">{{ kpis.meetingsScheduled }}</p>
              </div>
              <div class="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Pipeline Value -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('common.marketing_overview.pipeline_value') }}</p>
                <p class="text-3xl font-bold text-gray-900">${{ formatNumber(kpis.pipelineValue) }}</p>
              </div>
              <div class="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Qualified Leads -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('common.marketing_overview.qualified_leads') }}</p>
                <p class="text-3xl font-bold text-gray-900">{{ kpis.qualifiedLeads }}</p>
              </div>
              <div class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Marketing Performance Trend -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('common.marketing_overview.performance_trend') }}</h3>
            <div class="h-64 flex items-center justify-center">
              <div class="text-center">
                <div class="h-32 w-full bg-gray-100 rounded animate-pulse mb-4"></div>
                <p class="text-sm text-gray-500">Performance trend chart placeholder</p>
                <p class="text-xs text-gray-400 mt-2">
                  Sent: {{ performanceData[0]?.value || 0 }} | 
                  Opens: {{ performanceData[1]?.value || 0 }} | 
                  Clicks: {{ performanceData[2]?.value || 0 }}
                </p>
              </div>
            </div>
          </div>

          <!-- Channel Distribution -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('common.marketing_overview.channel_distribution') }}</h3>
            <div class="h-64 flex items-center justify-center">
              <div class="text-center">
                <div class="h-32 w-32 bg-gray-100 rounded-full animate-pulse mx-auto mb-4"></div>
                <p class="text-sm text-gray-500">Channel distribution chart placeholder</p>
                <div class="mt-4 space-y-2">
                  <div v-for="channel in channelData" :key="channel.name" class="flex items-center justify-between text-xs">
                    <div class="flex items-center">
                      <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: channel.color }"></div>
                      <span>{{ channel.name }}</span>
                    </div>
                    <span class="font-medium">{{ channel.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { marketingService, marketingHelpers } from '@/services/marketing'
import { error as showError } from '@/utils/notifications'

const { t } = useI18n()

// Reactive data
const loading = ref(true)
const error = ref(null)
const analyticsData = ref(null)
const campaigns = ref([])
const events = ref([])
const meetings = ref([])
const forecast = ref(null)

// Computed KPIs
const kpis = computed(() => {
  if (!analyticsData.value) {
    return {
      activeCampaigns: 0,
      adSpend: 0,
      upcomingEvents: 0,
      meetingsScheduled: 0,
      pipelineValue: 0,
      qualifiedLeads: 0
    }
  }

  return {
    activeCampaigns: marketingHelpers.getActiveCampaignsCount(campaigns.value),
    adSpend: marketingHelpers.getAdSpend(analyticsData.value),
    upcomingEvents: marketingHelpers.getUpcomingEventsCount(events.value),
    meetingsScheduled: marketingHelpers.getUpcomingMeetingsCount(meetings.value),
    pipelineValue: marketingHelpers.getPipelineValue(forecast.value),
    qualifiedLeads: marketingHelpers.getQualifiedLeadsCount(analyticsData.value)
  }
})

// Computed chart data
const performanceData = computed(() => {
  return marketingHelpers.preparePerformanceTrendData(analyticsData.value)
})

const channelData = computed(() => {
  return marketingHelpers.prepareChannelDistributionData(analyticsData.value, campaigns.value)
})

// Check if we have any data
const hasData = computed(() => {
  return analyticsData.value || campaigns.value.length > 0 || events.value.length > 0 || meetings.value.length > 0
})

// Helper function to format numbers
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Load all marketing data
const loadData = async () => {
  loading.value = true
  error.value = null

  try {
    // Load all data in parallel
    const [analytics, campaignsData, eventsData, meetingsData, forecastData] = await Promise.all([
      marketingService.getAnalyticsDashboard(),
      marketingService.getCampaigns(),
      marketingService.getUpcomingEvents(),
      marketingService.getUpcomingMeetings(),
      marketingService.getForecast()
    ])

    analyticsData.value = analytics
    campaigns.value = campaignsData.data || campaignsData
    events.value = eventsData.data || eventsData
    meetings.value = meetingsData.data || meetingsData
    forecast.value = forecastData

  } catch (err) {
    // Handle network errors or other unexpected issues
    console.error('Error loading marketing data:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load marketing data'
    showError(error.value)
  } finally {
    loading.value = false
  }
}

// Load data on component mount
onMounted(() => {
  loadData()
})
</script>