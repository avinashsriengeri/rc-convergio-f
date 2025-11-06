<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumbs -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex py-4" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <div class="flex items-center">
                <router-link to="/sales" class="text-gray-400 hover:text-gray-500">
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
                <span class="ml-4 text-sm font-medium text-gray-500">{{ $t('sales.overview.title') }}</span>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-900">{{ $t('marketing.forecasting.title') }}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 py-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ $t('marketing.forecasting.title') }}</h1>
          <p class="mt-0 text-lg text-gray-600">{{ $t('marketing.forecasting.subtitle') }}</p>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Timeframe Switcher -->
          <select
            v-model="selectedTimeframe"
            @change="handleTimeframeChange"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="timeframe in availableTimeframes" :key="timeframe.id" :value="timeframe.id">
              {{ timeframe.name }}
            </option>
          </select>
          <!-- Report Type Dropdown -->
          <select
            v-model="selectedReportType"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="summary">Summary Report</option>
            <option value="detailed">Detailed Report</option>
            <option value="accuracy">Accuracy Report</option>
            <option value="trends">Trends Report</option>
          </select>
          
          <!-- Export Summary Button -->
          <button
            @click="exportSummary"
            :disabled="exportLoading"
            class="bg-indigo-600 hover:bg-indigo-600 disabled:bg-indigo-300 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center"
          >
            <svg v-if="!exportLoading" class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div v-else class="w-3.5 h-3.5 mr-1.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            {{ exportLoading ? 'Exporting...' : 'Export summary' }}
          </button>
          <!-- Refresh Button -->
          <button
            @click="refreshData"
            :disabled="loading"
            class="bg-blue-800 hover:bg-blue-600 disabled:bg-gray-300 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            {{ $t('marketing.forecasting.refresh') }}
          </button>
          <!-- Force Chart Render Button -->
          <button
            @click="forceChartRender"
            class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            Force Render Charts
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">{{ $t('marketing.forecasting.loading') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.forecasting.error') }}</h3>
        <button
          @click="loadForecastData"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {{ $t('common.marketing_overview.retry_button') }}
        </button>
      </div>

      <!-- Main Content -->
      <div v-else-if="forecastData" class="transition-all duration-500 ease-in-out">
        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <!-- Projected Value -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-500 mb-1.5 truncate">{{ $t('marketing.forecasting.kpis.projected_value') }}</p>
                <p class="text-xl font-bold text-gray-900 mb-1 truncate">{{ formatCurrency(forecastData.projected_value) }}</p>
                <p class="text-xs text-gray-400 truncate">from last {{ selectedTimeframe === 'monthly' ? 'month' : 'quarter' }}</p>
              </div>
            </div>
          </div>

          <!-- Probability-Weighted -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-500 mb-1.5 truncate">{{ $t('marketing.forecasting.kpis.probability_weighted') }}</p>
                <p class="text-xl font-bold text-gray-900 mb-1 truncate">{{ formatCurrency(forecastData.probability_weighted) }}</p>
                <p class="text-xs text-gray-400 truncate">from last {{ selectedTimeframe === 'monthly' ? 'month' : 'quarter' }}</p>
              </div>
            </div>
          </div>

          <!-- Forecast Accuracy -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-500 mb-1.5 truncate">{{ $t('marketing.forecasting.kpis.forecast_accuracy') }}</p>
                <p :class="getAccuracyColor(forecastData.average_probability)" class="text-xl font-bold mb-1 truncate">
                  {{ formatPercentage(forecastData.average_probability) }}
                </p>
                <p class="text-xs text-gray-400 truncate">from last month</p>
              </div>
            </div>
          </div>

          <!-- Active Deals -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-500 mb-1.5 truncate">{{ $t('marketing.forecasting.kpis.active_deals') }}</p>
                <p class="text-xl font-bold text-gray-900 mb-1 truncate">{{ formatNumber(forecastData.total_deals) }}</p>
                <p class="text-xs text-gray-400 truncate">from last month</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Pipeline Breakdown Chart -->
          <PipelineBreakdownChart 
            :data="pipelineData" 
            :loading="loading"
            @stage-click="openDrilldownModal"
          />

          <!-- Accuracy Trends Chart -->
          <ForecastAccuracyChart 
            :data="accuracyTrends" 
            :loading="loading"
          />
        </div>

        <!-- Forecast Trends Chart (Full Width) -->
        <div class="mt-8">
          <ForecastTrendsChart 
            :data="trendsData" 
            :loading="loading"
          />
        </div>

        <!-- Multi-Timeframe Comparison -->
        <div v-if="multiTimeframeData" class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">{{ $t('marketing.forecasting.multi_timeframe.title') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Monthly Forecast -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">{{ $t('marketing.forecasting.timeframes.monthly') }}</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.projected_value') }}:</span>
                  <span class="text-sm font-semibold">{{ formatCurrency(multiTimeframeData.monthly?.projected_value || 0) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.probability_weighted') }}:</span>
                  <span class="text-sm font-semibold">{{ formatCurrency(multiTimeframeData.monthly?.probability_weighted || 0) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.forecast_accuracy') }}:</span>
                  <span :class="getAccuracyColor(multiTimeframeData.monthly?.forecast_accuracy || 0)" class="text-sm font-semibold">
                    {{ formatPercentage(multiTimeframeData.monthly?.forecast_accuracy || 0) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.active_deals') }}:</span>
                  <span class="text-sm font-semibold">{{ formatNumber(multiTimeframeData.monthly?.active_deals || 0) }}</span>
                </div>
              </div>
            </div>

            <!-- Quarterly Forecast -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">{{ $t('marketing.forecasting.timeframes.quarterly') }}</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.projected_value') }}:</span>
                  <span class="text-sm font-semibold">{{ formatCurrency(multiTimeframeData.quarterly?.projected_value || 0) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.probability_weighted') }}:</span>
                  <span class="text-sm font-semibold">{{ formatCurrency(multiTimeframeData.quarterly?.probability_weighted || 0) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.forecast_accuracy') }}:</span>
                  <span :class="getAccuracyColor(multiTimeframeData.quarterly?.forecast_accuracy || 0)" class="text-sm font-semibold">
                    {{ formatPercentage(multiTimeframeData.quarterly?.forecast_accuracy || 0) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.active_deals') }}:</span>
                  <span class="text-sm font-semibold">{{ formatNumber(multiTimeframeData.quarterly?.active_deals || 0) }}</span>
                </div>
              </div>
            </div>

            <!-- Yearly Forecast -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">{{ $t('marketing.forecasting.timeframes.yearly') }}</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.projected_value') }}:</span>
                  <span class="text-sm font-semibold">{{ formatCurrency(multiTimeframeData.yearly?.projected_value || 0) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.probability_weighted') }}:</span>
                  <span class="text-sm font-semibold">{{ formatCurrency(multiTimeframeData.yearly?.probability_weighted || 0) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.forecast_accuracy') }}:</span>
                  <span :class="getAccuracyColor(multiTimeframeData.yearly?.forecast_accuracy || 0)" class="text-sm font-semibold">
                    {{ formatPercentage(multiTimeframeData.yearly?.forecast_accuracy || 0) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.active_deals') }}:</span>
                  <span class="text-sm font-semibold">{{ formatNumber(multiTimeframeData.yearly?.active_deals || 0) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Trends Summary -->
          <div v-if="multiTimeframeData.trends" class="mt-6 pt-6 border-t border-gray-200">
            <h4 class="text-sm font-medium text-gray-900 mb-4">{{ $t('marketing.forecasting.multi_timeframe.trends_summary') }}</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center p-3 bg-blue-50 rounded-lg">
                <div class="text-lg font-semibold text-blue-600">{{ multiTimeframeData.trends?.monthly_trend || '+0%' }}</div>
                <div class="text-sm text-blue-600">{{ $t('marketing.forecasting.timeframes.monthly') }} {{ $t('marketing.forecasting.multi_timeframe.trend') }}</div>
              </div>
              <div class="text-center p-3 bg-purple-50 rounded-lg">
                <div class="text-lg font-semibold text-purple-600">{{ multiTimeframeData.trends?.quarterly_trend || '+0%' }}</div>
                <div class="text-sm text-purple-600">{{ $t('marketing.forecasting.timeframes.quarterly') }} {{ $t('marketing.forecasting.multi_timeframe.trend') }}</div>
              </div>
              <div class="text-center p-3 bg-green-50 rounded-lg">
                <div class="text-lg font-semibold text-green-600">{{ multiTimeframeData.trends?.yearly_trend || '+0%' }}</div>
                <div class="text-sm text-green-600">{{ $t('marketing.forecasting.timeframes.yearly') }} {{ $t('marketing.forecasting.multi_timeframe.trend') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Data State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.forecasting.no_data') }}</h3>
        <p class="text-gray-600 mb-6">No forecast data available for the selected timeframe</p>
        <button
          @click="loadForecastData"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          {{ $t('marketing.forecasting.refresh') }}
        </button>
      </div>
    </div>

    <!-- Drill-Down Modal -->
    <ForecastDrilldownModal
      :is-open="showDrilldownModal"
      :selected-stage="selectedStage"
      :timeframe="selectedTimeframe"
      @close="closeDrilldownModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { forecastingService, forecastingHelpers } from '@/services/forecasting'
import { error as showError, success as showSuccess } from '@/utils/notifications'
import PipelineBreakdownChart from '@/components/charts/PipelineBreakdownChart.vue'
import ForecastAccuracyChart from '@/components/charts/ForecastAccuracyChart.vue'
import ForecastTrendsChart from '@/components/charts/ForecastTrendsChart.vue'
import ForecastAccuracyGauge from '@/components/charts/ForecastAccuracyGauge.vue'
import ForecastDrilldownModal from '@/components/modals/ForecastDrilldownModal.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// Reactive state
const loading = ref(false)
const error = ref(null)
const exportLoading = ref(false)
const forecastData = ref(null)
const pipelineData = ref([])
const accuracyTrends = ref([])
const trendsData = ref([])
const accuracyData = ref({})
const selectedTimeframe = ref('monthly')
const selectedReportType = ref('summary')
const multiTimeframeData = ref(null)
const availableTimeframes = ref([])
const showDrilldownModal = ref(false)
const selectedStage = ref(null)

// Computed properties
const hasData = computed(() => {
  return forecastData.value && (
    forecastData.value.projected_value > 0 ||
    forecastData.value.probability_weighted > 0 ||
    forecastData.value.active_deals > 0
  )
})

// Methods
const loadForecastData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const params = {
      timeframe: selectedTimeframe.value,
      include_trends: true,
      include_pipeline_breakdown: true,
      include_accuracy: true
    }

    // Load data individually to handle timeouts gracefully
    const forecastResponse = await forecastingService.getForecast(params)
    forecastData.value = forecastResponse.data

    const trendsResponse = await forecastingService.getForecastTrends({ months: 6 })
    // Map trends data to ensure proper format for the chart
    const trends = trendsResponse.data.trends || []
    trendsData.value = trends.map(trend => ({
      month: trend.month,
      month_name: trend.month_name,
      projected_value: trend.projected_value || 0,
      probability_weighted: trend.probability_weighted || 0,
      total_deals: trend.total_deals || 0
    }))

    const pipelineResponse = await forecastingService.getPipelineBreakdown({ timeframe: selectedTimeframe.value })
    // Convert pipeline breakdown object to array format expected by chart
    const pipelineBreakdown = pipelineResponse.data.pipeline_breakdown || {}
    pipelineData.value = Object.values(pipelineBreakdown).map(pipeline => ({
      pipeline_id: pipeline.pipeline_id,
      pipeline_name: pipeline.pipeline_name,
      count: pipeline.count,
      total_value: pipeline.total_value,
      probability_weighted: pipeline.probability_weighted,
      average_probability: pipeline.average_probability
    }))

    const accuracyResponse = await forecastingService.getForecastAccuracy({ months: 3 })
    // Map accuracy metrics to the format expected by the chart
    const accuracyMetrics = accuracyResponse.data.accuracy_metrics || []
    accuracyTrends.value = accuracyMetrics.map(metric => ({
      month: metric.month,
      month_name: metric.month_name,
      accuracy_percentage: metric.accuracy_percentage,
      expected_deals: metric.expected_deals,
      actual_closed: metric.actual_closed,
      expected_value: metric.expected_value,
      actual_value: metric.actual_value
    }))
    accuracyData.value = {
      average_accuracy: accuracyResponse.data.average_accuracy || 0,
      accuracy_metrics: accuracyTrends.value
    }

    // Update URL with timeframe
    forecastingHelpers.updateURLTimeframe(selectedTimeframe.value)
    
    // Data loaded successfully - charts will render automatically
    
    // Force chart re-rendering after data is loaded
    await renderAllCharts()

  } catch (err) {
    console.error('Error loading forecast data:', err)
    // Don't set error state since fallback data should be available
  } finally {
    loading.value = false
  }
}

const loadMultiTimeframeData = async () => {
  try {
    const response = await forecastingService.getMultiTimeframeForecast()
    const forecasts = response.data.forecasts || {}
    
    // Map the multi-timeframe data to the expected structure
    const monthlyData = forecasts.monthly || {}
    const quarterlyData = forecasts.quarterly || {}
    const yearlyData = forecasts.yearly || {}
    
    multiTimeframeData.value = {
      monthly: {
        projected_value: monthlyData.projected_value || 0,
        probability_weighted: monthlyData.probability_weighted || 0,
        forecast_accuracy: monthlyData.average_probability || 0,
        active_deals: monthlyData.total_deals || 0
      },
      quarterly: {
        projected_value: quarterlyData.projected_value || 0,
        probability_weighted: quarterlyData.probability_weighted || 0,
        forecast_accuracy: quarterlyData.average_probability || 0,
        active_deals: quarterlyData.total_deals || 0
      },
      yearly: {
        projected_value: yearlyData.projected_value || 0,
        probability_weighted: yearlyData.probability_weighted || 0,
        forecast_accuracy: yearlyData.average_probability || 0,
        active_deals: yearlyData.total_deals || 0
      },
      trends: {
        monthly_trend: calculateTrendPercentage(monthlyData.projected_value, monthlyData.probability_weighted),
        quarterly_trend: calculateTrendPercentage(quarterlyData.projected_value, quarterlyData.probability_weighted),
        yearly_trend: calculateTrendPercentage(yearlyData.projected_value, yearlyData.probability_weighted)
      }
    }
    
    // Multi-timeframe data loaded successfully
    console.log('Multi-timeframe data loaded:', multiTimeframeData.value)
    
    // Force chart re-rendering after multi-timeframe data is loaded
    await renderAllCharts()
  } catch (err) {
    console.error('Failed to load multi-timeframe data:', err)
    // Set fallback data
    multiTimeframeData.value = {
      monthly: { projected_value: 0, probability_weighted: 0, forecast_accuracy: 0, active_deals: 0 },
      quarterly: { projected_value: 0, probability_weighted: 0, forecast_accuracy: 0, active_deals: 0 },
      yearly: { projected_value: 0, probability_weighted: 0, forecast_accuracy: 0, active_deals: 0 },
      trends: { monthly_trend: '+0%', quarterly_trend: '+0%', yearly_trend: '+0%' }
    }
  }
}

const loadAvailableTimeframes = async () => {
  try {
    const response = await forecastingService.getTimeframes()
    const timeframesData = response.data || {}
    
    // Convert timeframes object to array format expected by the select
    availableTimeframes.value = Object.entries(timeframesData).map(([id, name]) => ({
      id,
      name
    }))
  } catch (err) {
    console.error('Failed to load timeframes:', err)
    // Set fallback timeframes
    availableTimeframes.value = [
      { id: 'monthly', name: 'Monthly' },
      { id: 'quarterly', name: 'Quarterly' },
      { id: 'yearly', name: 'Yearly' }
    ]
  }
}

const refreshData = async () => {
  await loadForecastData()
  showSuccess('Forecast data refreshed successfully')
}

const forceChartRender = () => {
  console.log('Force rendering all charts...')
  renderAllCharts()
  showSuccess('Charts force rendered')
}

// Calculate trend percentage between projected and probability-weighted values
const calculateTrendPercentage = (projected, weighted) => {
  if (!projected || projected === 0) return '+0%'
  const percentage = ((weighted - projected) / projected) * 100
  const sign = percentage >= 0 ? '+' : ''
  return `${sign}${percentage.toFixed(1)}%`
}

// Central function to render all charts
const renderAllCharts = async () => {
  await nextTick()
  
  // Add a small delay to ensure DOM is fully ready
  setTimeout(() => {
    // Dispatch event to trigger all chart components to re-render
    const event = new CustomEvent('chart-data-updated')
    window.dispatchEvent(event)
    
    console.log('All charts rendering triggered')
  }, 100)
}

const handleTimeframeChange = async () => {
  // Add a subtle loading effect during timeframe change
  const mainContent = document.querySelector('.transition-all')
  if (mainContent) {
    mainContent.style.opacity = '0.7'
  }
  
  await loadForecastData()
  
  // Restore opacity after data loads
  if (mainContent) {
    mainContent.style.opacity = '1'
  }
  
  // Ensure charts are rendered after timeframe change
  await renderAllCharts()
}

const exportReport = async () => {
  try {
    const response = await forecastingService.exportReport('csv', {
      type: selectedReportType.value,
      timeframe: selectedTimeframe.value
    })
    
    // Create download link
    const blob = new Blob([response.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `forecast-${selectedReportType.value}-${selectedTimeframe.value}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    showSuccess(`${selectedReportType.value} report exported successfully`)
  } catch (err) {
    console.error('Error exporting report:', err)
    showError('Failed to export forecast report')
  }
}

const exportSummary = async () => {
  try {
    console.log('Export Summary button clicked!')
    console.log('Current timeframe:', selectedTimeframe.value)
    exportLoading.value = true
    
    console.log('Calling forecastingService.exportSummaryNew...')
    const success = await forecastingService.exportSummaryNew(selectedTimeframe.value, 'excel')
    console.log('Export result:', success)
    
    if (success) {
      showSuccess('Export summary completed successfully!')
    } else {
      throw new Error('Export failed')
    }
    
  } catch (err) {
    console.error('Error exporting summary:', err)
    showError('Failed to export forecast summary')
  } finally {
    exportLoading.value = false
  }
}

const openDrilldownModal = (stage) => {
  selectedStage.value = stage
  showDrilldownModal.value = true
}

const closeDrilldownModal = () => {
  showDrilldownModal.value = false
  selectedStage.value = null
}

const initializeFromURL = () => {
  const timeframe = forecastingHelpers.getDefaultTimeframe()
  selectedTimeframe.value = timeframe
}

// Helper methods
const formatCurrency = (amount) => forecastingHelpers.formatCurrency(amount)
const formatPercentage = (value) => forecastingHelpers.formatPercentage(value)
const formatNumber = (num) => forecastingHelpers.formatNumber(num)
const getTrendColor = (trend) => forecastingHelpers.getTrendColor(trend)
const getAccuracyColor = (accuracy) => forecastingHelpers.getAccuracyColor(accuracy)
const getStageColor = (stage) => forecastingHelpers.getStageColor(stage)

// Watch for URL changes
watch(() => route.query.timeframe, (newTimeframe) => {
  if (newTimeframe && newTimeframe !== selectedTimeframe.value) {
    selectedTimeframe.value = newTimeframe
    loadForecastData()
  }
})

// Lifecycle
onMounted(async () => {
  initializeFromURL()
  await Promise.all([
    loadForecastData(),
    loadMultiTimeframeData(),
    loadAvailableTimeframes()
  ])
})
</script>
