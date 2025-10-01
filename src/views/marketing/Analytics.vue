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
              v-for="period in periods.filter(p => p && p.id)"
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
                <p class="text-2xl font-bold text-gray-900">{{ analyticsHelpers.formatNumber(dashboardData.intent?.total || 0) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ $t('marketing.analytics.summary_grid.visitor_intent.high_intent') }}: {{ dashboardData.intent?.high_intent || 0 }}</p>
                <p :class="['text-sm font-medium', analyticsHelpers.getTrendColor(dashboardData.intent?.trend || 'up')]">
                  {{ analyticsHelpers.getTrendIcon(dashboardData.intent?.trend || 'up') }} {{ dashboardData.intent?.growth || 0 }}%
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
                v-for="module in modules.filter(m => m && m.id)"
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
                <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-semibold text-blue-700 uppercase tracking-wide">{{ $t('marketing.analytics.summary_grid.contacts.total') }}</p>
                    <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  <p class="text-3xl font-bold text-blue-900">{{ analyticsHelpers.formatNumber(moduleData?.total || 0) }}</p>
                </div>
                <div class="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-semibold text-green-700 uppercase tracking-wide">{{ $t('marketing.analytics.summary_grid.contacts.growth') }}</p>
                    <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <p :class="['text-3xl font-bold', moduleData?.growth_rate >= 0 ? 'text-green-700' : 'text-red-600']">
                    {{ moduleData?.growth_rate >= 0 ? '↗' : '↘' }} {{ Math.abs(moduleData?.growth_rate || 0) }}%
                  </p>
                </div>
                <div class="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6 border border-purple-200">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-semibold text-purple-700 uppercase tracking-wide">Period</p>
                    <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <p class="text-3xl font-bold text-purple-900">{{ $t(`marketing.analytics.period_switcher.${selectedPeriod}`) }}</p>
                </div>
              </div>

              <!-- Professional Chart -->
              <AnalyticsChart
                :data="moduleData"
                :type="getChartType(selectedModule)"
                :loading="moduleLoading"
                :error="moduleError"
              />

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
import AnalyticsChart from '@/components/charts/AnalyticsChart.vue'

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

// Initialize with fallback data immediately to prevent undefined keys
const initializeFallbackData = () => {
  const fallbackModules = analyticsService.getFallbackModulesData()
  const fallbackPeriods = analyticsService.getFallbackPeriodsData()
  modules.value = fallbackModules.data || []
  periods.value = fallbackPeriods.data || []
  console.log('Fallback initialized - Modules:', modules.value.length, 'Periods:', periods.value.length)
}
// Call immediately
initializeFallbackData()

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

    // Debug API responses
    console.log('API Responses:', { modulesResponse, periodsResponse, dashboardResponse })
    
    modules.value = modulesResponse.data || []
    periods.value = periodsResponse.data || []
    dashboardData.value = dashboardResponse.data || {}
    
    // Debug logging
    console.log('Modules loaded:', modules.value)
    console.log('Periods loaded:', periods.value)
    console.log('Dashboard loaded:', Object.keys(dashboardData.value))
    
    // If still empty, keep fallback data
    if (modules.value.length === 0) {
      console.warn('Modules empty after API call - keeping fallback data')
      const fallbackModules = analyticsService.getFallbackModulesData()
      modules.value = fallbackModules.data || []
    }
    if (periods.value.length === 0) {
      console.warn('Periods empty after API call - keeping fallback data')
      const fallbackPeriods = analyticsService.getFallbackPeriodsData()
      periods.value = fallbackPeriods.data || []
    }
    
    // Force update dashboard data with real API data
    console.log('✅ Using REAL API data for dashboard:', dashboardData.value)
    
    // Debug: Check if we have real data
    if (dashboardData.value && Object.keys(dashboardData.value).length > 0) {
      console.log('📊 Dashboard data structure:', {
        contacts: dashboardData.value.contacts,
        deals: dashboardData.value.deals,
        campaigns: dashboardData.value.campaigns
      })
    }
    console.log('📊 Dashboard contacts data:', dashboardData.value.contacts)
    console.log('📊 Dashboard deals data:', dashboardData.value.deals)
    
    // Force update with real data if available
    if (dashboardData.value && Object.keys(dashboardData.value).length > 0) {
      console.log('✅ Dashboard has real data - using it!')
    } else {
      console.log('⚠️ Dashboard has no real data - using fallback')
    }

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

    // Use specific endpoint methods for better error handling and type safety
    let response
    switch (selectedModule.value) {
      case 'contacts':
        response = await analyticsService.getContactsAnalytics(selectedPeriod.value)
        break
      case 'companies':
        response = await analyticsService.getCompaniesAnalytics(selectedPeriod.value)
        break
      case 'deals':
        response = await analyticsService.getDealsAnalytics(selectedPeriod.value)
        break
      case 'campaigns':
        response = await analyticsService.getCampaignsAnalytics(selectedPeriod.value)
        break
      case 'ads':
        response = await analyticsService.getAdsAnalytics(selectedPeriod.value)
        break
      case 'events':
        response = await analyticsService.getEventsAnalytics(selectedPeriod.value)
        break
      case 'meetings':
        response = await analyticsService.getMeetingsAnalytics(selectedPeriod.value)
        break
      case 'tasks':
        response = await analyticsService.getTasksAnalytics(selectedPeriod.value)
        break
      case 'forecast':
        response = await analyticsService.getForecastAnalytics(selectedPeriod.value)
        break
      case 'lead_scoring':
        response = await analyticsService.getLeadScoringAnalytics(selectedPeriod.value)
        break
      case 'journeys':
        response = await analyticsService.getJourneysAnalytics(selectedPeriod.value)
        break
      case 'visitor_intent':
        response = await analyticsService.getVisitorIntentAnalytics(selectedPeriod.value)
        break
      default:
        // Fallback to generic endpoint for any other modules
        response = await analyticsService.getModuleData(selectedModule.value, selectedPeriod.value)
    }

    moduleData.value = response.data || null
    console.log(`✅ Using REAL API data for ${selectedModule.value}:`, moduleData.value)
    
    // Debug: Show the actual values that should display
    if (moduleData.value) {
      console.log(`📊 ${selectedModule.value} - Total:`, moduleData.value.total)
      console.log(`📊 ${selectedModule.value} - Growth Rate:`, moduleData.value.growth_rate)
      console.log(`📊 ${selectedModule.value} - This Month:`, moduleData.value.this_month)
    }
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

const getChartType = (moduleId) => {
  // Different chart types for different modules
  const chartTypes = {
    'contacts': 'line',
    'deals': 'bar',
    'campaigns': 'area',
    'ads': 'line',
    'events': 'bar',
    'meetings': 'line',
    'tasks': 'bar',
    'companies': 'line',
    'forecast': 'area',
    'lead_scoring': 'line',
    'journeys': 'area',
    'visitor_intent': 'line'
  }
  return chartTypes[moduleId] || 'line'
}

// Watchers
watch(selectedPeriod, () => {
  loadModuleData()
})

// Lifecycle
onMounted(async () => {
  console.log('Analytics component mounted - starting data load...')
  await loadData()
  console.log('Data load complete. Modules:', modules.value.length, 'Periods:', periods.value.length)
})
</script>