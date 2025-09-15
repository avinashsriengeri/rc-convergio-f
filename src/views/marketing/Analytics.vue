<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumbs -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4 py-4">
            <li>
              <div class="flex items-center">
                <router-link to="/" class="text-gray-400 hover:text-gray-500">
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
                <span class="ml-4 text-sm font-medium text-gray-900">{{ $t('marketing.analytics.title') }}</span>
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
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('marketing.analytics.title') }}</h1>
        <p class="mt-2 text-lg text-gray-600">{{ $t('marketing.analytics.subtitle') }}</p>
        <p class="mt-1 text-sm text-gray-500">{{ $t('marketing.analytics.description') }}</p>
      </div>

      <!-- Period Switcher -->
      <div class="mb-8">
        <div class="flex items-center space-x-4">
          <span class="text-sm font-medium text-gray-700">Period:</span>
          <div class="flex space-x-2">
            <button
              v-for="period in periods"
              :key="period.id"
              @click="changePeriod(period.id)"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                selectedPeriod === period.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ $t(`marketing.analytics.period_switcher.${period.id}`) }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 12" :key="i" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div class="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-center">
          <svg class="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div>
            <h3 class="text-sm font-medium text-red-800">{{ $t('marketing.analytics.error') }}</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="loadData"
            class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- Summary Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <!-- Contacts -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.analytics.summary_grid.contacts.title') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ analyticsHelpers.formatNumber(dashboardData.contacts?.total || 0) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ $t('marketing.analytics.summary_grid.contacts.new') }}: {{ dashboardData.contacts?.new || 0 }}</p>
                <p :class="['text-sm font-medium', analyticsHelpers.getTrendColor(dashboardData.contacts?.trend || 'up')]">
                  {{ analyticsHelpers.getTrendIcon(dashboardData.contacts?.trend || 'up') }} {{ dashboardData.contacts?.growth || 0 }}%
                </p>
              </div>
            </div>
          </div>

          <!-- Deals -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.analytics.summary_grid.deals.title') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ analyticsHelpers.formatNumber(dashboardData.deals?.total || 0) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ $t('marketing.analytics.summary_grid.deals.value') }}: {{ analyticsHelpers.formatCurrency(dashboardData.deals?.value || 0) }}</p>
                <p :class="['text-sm font-medium', analyticsHelpers.getTrendColor(dashboardData.deals?.trend || 'up')]">
                  {{ analyticsHelpers.getTrendIcon(dashboardData.deals?.trend || 'up') }} {{ dashboardData.deals?.growth || 0 }}%
                </p>
              </div>
            </div>
          </div>

          <!-- Campaigns -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.analytics.summary_grid.campaigns.title') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ analyticsHelpers.formatNumber(dashboardData.campaigns?.total || 0) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ $t('marketing.analytics.summary_grid.campaigns.active') }}: {{ dashboardData.campaigns?.active || 0 }}</p>
                <p :class="['text-sm font-medium', analyticsHelpers.getTrendColor(dashboardData.campaigns?.trend || 'up')]">
                  {{ analyticsHelpers.getTrendIcon(dashboardData.campaigns?.trend || 'up') }} {{ dashboardData.campaigns?.growth || 0 }}%
                </p>
              </div>
            </div>
          </div>

          <!-- Ads -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.analytics.summary_grid.ads.title') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ analyticsHelpers.formatNumber(dashboardData.ads?.total || 0) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ $t('marketing.analytics.summary_grid.ads.spend') }}: {{ analyticsHelpers.formatCurrency(dashboardData.ads?.spend || 0) }}</p>
                <p :class="['text-sm font-medium', analyticsHelpers.getTrendColor(dashboardData.ads?.trend || 'up')]">
                  {{ analyticsHelpers.getTrendIcon(dashboardData.ads?.trend || 'up') }} {{ dashboardData.ads?.growth || 0 }}%
                </p>
              </div>
            </div>
          </div>

          <!-- Events -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.analytics.summary_grid.events.title') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ analyticsHelpers.formatNumber(dashboardData.events?.total || 0) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ $t('marketing.analytics.summary_grid.events.attendees') }}: {{ dashboardData.events?.attendees || 0 }}</p>
                <p :class="['text-sm font-medium', analyticsHelpers.getTrendColor(dashboardData.events?.trend || 'up')]">
                  {{ analyticsHelpers.getTrendIcon(dashboardData.events?.trend || 'up') }} {{ dashboardData.events?.growth || 0 }}%
                </p>
              </div>
            </div>
          </div>

          <!-- Meetings -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.analytics.summary_grid.meetings.title') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ analyticsHelpers.formatNumber(dashboardData.meetings?.total || 0) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ $t('marketing.analytics.summary_grid.meetings.scheduled') }}: {{ dashboardData.meetings?.scheduled || 0 }}</p>
                <p :class="['text-sm font-medium', analyticsHelpers.getTrendColor(dashboardData.meetings?.trend || 'up')]">
                  {{ analyticsHelpers.getTrendIcon(dashboardData.meetings?.trend || 'up') }} {{ dashboardData.meetings?.growth || 0 }}%
                </p>
              </div>
            </div>
          </div>

          <!-- Tasks -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.analytics.summary_grid.tasks.title') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ analyticsHelpers.formatNumber(dashboardData.tasks?.total || 0) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ $t('marketing.analytics.summary_grid.tasks.completed') }}: {{ dashboardData.tasks?.completed || 0 }}</p>
                <p :class="['text-sm font-medium', analyticsHelpers.getTrendColor(dashboardData.tasks?.trend || 'up')]">
                  {{ analyticsHelpers.getTrendIcon(dashboardData.tasks?.trend || 'up') }} {{ dashboardData.tasks?.growth || 0 }}%
                </p>
              </div>
            </div>
          </div>

          <!-- Companies -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.analytics.summary_grid.companies.title') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ analyticsHelpers.formatNumber(dashboardData.companies?.total || 0) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ $t('marketing.analytics.summary_grid.companies.new') }}: {{ dashboardData.companies?.new || 0 }}</p>
                <p :class="['text-sm font-medium', analyticsHelpers.getTrendColor(dashboardData.companies?.trend || 'up')]">
                  {{ analyticsHelpers.getTrendIcon(dashboardData.companies?.trend || 'up') }} {{ dashboardData.companies?.growth || 0 }}%
                </p>
              </div>
            </div>
          </div>

          <!-- Forecast -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.analytics.summary_grid.forecast.title') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ analyticsHelpers.formatCurrency(dashboardData.forecast?.projected || 0) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ $t('marketing.analytics.summary_grid.forecast.accuracy') }}: {{ dashboardData.forecast?.accuracy || 0 }}%</p>
                <p :class="['text-sm font-medium', analyticsHelpers.getTrendColor(dashboardData.forecast?.trend || 'up')]">
                  {{ analyticsHelpers.getTrendIcon(dashboardData.forecast?.trend || 'up') }} {{ dashboardData.forecast?.growth || 0 }}%
                </p>
              </div>
            </div>
          </div>

          <!-- Lead Scoring -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.analytics.summary_grid.lead_scoring.title') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ analyticsHelpers.formatNumber(dashboardData.lead_scoring?.total_leads || 0) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ $t('marketing.analytics.summary_grid.lead_scoring.qualified') }}: {{ dashboardData.lead_scoring?.qualified || 0 }}</p>
                <p :class="['text-sm font-medium', analyticsHelpers.getTrendColor(dashboardData.lead_scoring?.trend || 'up')]">
                  {{ analyticsHelpers.getTrendIcon(dashboardData.lead_scoring?.trend || 'up') }} {{ dashboardData.lead_scoring?.growth || 0 }}%
                </p>
              </div>
            </div>
          </div>

          <!-- Journeys -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.analytics.summary_grid.journeys.title') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ analyticsHelpers.formatNumber(dashboardData.journeys?.total || 0) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ $t('marketing.analytics.summary_grid.journeys.participants') }}: {{ dashboardData.journeys?.participants || 0 }}</p>
                <p :class="['text-sm font-medium', analyticsHelpers.getTrendColor(dashboardData.journeys?.trend || 'up')]">
                  {{ analyticsHelpers.getTrendIcon(dashboardData.journeys?.trend || 'up') }} {{ dashboardData.journeys?.growth || 0 }}%
                </p>
              </div>
            </div>
          </div>

          <!-- Visitor Intent -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.analytics.summary_grid.visitor_intent.title') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ analyticsHelpers.formatNumber(dashboardData.visitor_intent?.total_visitors || 0) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ $t('marketing.analytics.summary_grid.visitor_intent.high_intent') }}: {{ dashboardData.visitor_intent?.high_intent || 0 }}</p>
                <p :class="['text-sm font-medium', analyticsHelpers.getTrendColor(dashboardData.visitor_intent?.trend || 'up')]">
                  {{ analyticsHelpers.getTrendIcon(dashboardData.visitor_intent?.trend || 'up') }} {{ dashboardData.visitor_intent?.growth || 0 }}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Module Tabs -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                v-for="module in modules"
                :key="module.id"
                @click="selectModule(module.id)"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  selectedModule === module.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                {{ $t(`marketing.analytics.module_tabs.${module.id}`) }}
              </button>
            </nav>
          </div>

          <!-- Module Content -->
          <div class="p-6">
            <div v-if="moduleLoading" class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span class="ml-3 text-gray-600">{{ $t('marketing.analytics.chart.loading') }}</span>
            </div>

            <div v-else-if="moduleError" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('marketing.analytics.error') }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ moduleError }}</p>
            </div>

            <div v-else-if="moduleData" class="space-y-6">
              <!-- Module Summary -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm font-medium text-gray-600">{{ $t('marketing.analytics.summary_grid.contacts.total') }}</p>
                  <p class="text-2xl font-bold text-gray-900">{{ analyticsHelpers.formatNumber(moduleData.summary?.total || 0) }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm font-medium text-gray-600">{{ $t('marketing.analytics.summary_grid.contacts.growth') }}</p>
                  <p :class="['text-2xl font-bold', analyticsHelpers.getTrendColor(moduleData.summary?.trend || 'up')]">
                    {{ analyticsHelpers.getTrendIcon(moduleData.summary?.trend || 'up') }} {{ moduleData.summary?.growth || 0 }}%
                  </p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm font-medium text-gray-600">Period</p>
                  <p class="text-2xl font-bold text-gray-900">{{ $t(`marketing.analytics.period_switcher.${selectedPeriod}`) }}</p>
                </div>
              </div>

              <!-- Chart Placeholder -->
              <div class="bg-gray-50 rounded-lg p-8 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('marketing.analytics.chart.placeholder') }}</h3>
                <p class="mt-1 text-sm text-gray-500">{{ $t('marketing.analytics.chart.no_data') }}</p>
              </div>

              <!-- Module Metrics -->
              <div v-if="moduleData.metrics" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="(value, key) in moduleData.metrics"
                  :key="key"
                  class="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <p class="text-sm font-medium text-gray-600">{{ $t(`marketing.analytics.metrics.${key}`) }}</p>
                  <p class="text-lg font-bold text-gray-900">
                    {{ typeof value === 'number' ? (value >= 1000 ? analyticsHelpers.formatNumber(value) : value) : value }}
                  </p>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('marketing.analytics.empty_state.title') }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ $t('marketing.analytics.empty_state.description') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { analyticsService, analyticsHelpers } from '@/services/analytics'
import { error as showError, success as showSuccess } from '@/utils/notifications'

const { t } = useI18n()

// Reactive state
const loading = ref(true)
const error = ref(null)
const dashboardData = ref({})
const modules = ref([])
const periods = ref([])
const selectedPeriod = ref('month')
const selectedModule = ref('contacts')
const moduleLoading = ref(false)
const moduleError = ref(null)
const moduleData = ref(null)

// Methods
const loadData = async () => {
  try {
    loading.value = true
    error.value = null

    // Load modules and periods in parallel
    const [modulesResponse, periodsResponse, dashboardResponse] = await Promise.all([
      analyticsService.getModules(),
      analyticsService.getPeriods(),
      analyticsService.getDashboard(selectedPeriod.value)
    ])

    modules.value = modulesResponse.data || []
    periods.value = periodsResponse.data || []
    dashboardData.value = dashboardResponse.data || {}

    // Load initial module data
    await loadModuleData()
  } catch (err) {
    console.error('Error loading analytics data:', err)
    error.value = err.message || 'Failed to load analytics data'
    // Don't show error toast for expected API failures - fallback data will be used
    if (!err.message?.includes('500')) {
      showError(t('marketing.analytics.error'))
    }
  } finally {
    loading.value = false
  }
}

const loadModuleData = async () => {
  if (!selectedModule.value) return

  try {
    moduleLoading.value = true
    moduleError.value = null

    const response = await analyticsService.getModuleData(selectedModule.value, selectedPeriod.value)
    moduleData.value = response.data || null
  } catch (err) {
    console.error(`Error loading module data for ${selectedModule.value}:`, err)
    moduleError.value = err.message || 'Failed to load module data'
    // Don't show error for expected API failures - fallback data will be used
    if (!err.message?.includes('500')) {
      showError(t('marketing.analytics.error'))
    }
  } finally {
    moduleLoading.value = false
  }
}

const changePeriod = async (period) => {
  if (period === selectedPeriod.value) return

  selectedPeriod.value = period
  await loadData()
}

const selectModule = async (moduleId) => {
  if (moduleId === selectedModule.value) return

  selectedModule.value = moduleId
  await loadModuleData()
}

// Watchers
watch(selectedPeriod, () => {
  loadModuleData()
})

// Lifecycle
onMounted(() => {
  loadData()
})
</script>