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
                <span class="ml-4 text-sm font-medium text-gray-900">{{ $t('marketing.forecasting.title') }}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('marketing.forecasting.title') }}</h1>
          <p class="mt-2 text-lg text-gray-600">{{ $t('marketing.forecasting.subtitle') }}</p>
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
          <!-- Refresh Button -->
          <button
            @click="refreshData"
            :disabled="loading"
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.forecasting.refresh') }}
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
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {{ $t('common.marketing_overview.retry_button') }}
        </button>
      </div>

      <!-- Main Content -->
      <div v-else-if="forecastData">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Projected Value -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.forecasting.kpis.projected_value') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(forecastData.projected_value) }}</p>
                <p :class="getTrendColor(forecastData.trends.projected_value_trend)" class="text-sm">
                  {{ forecastData.trends.projected_value_trend }} from last {{ selectedTimeframe === 'monthly' ? 'month' : 'quarter' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Probability-Weighted -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.forecasting.kpis.probability_weighted') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(forecastData.probability_weighted) }}</p>
                <p :class="getTrendColor(forecastData.trends.probability_weighted_trend)" class="text-sm">
                  {{ forecastData.trends.probability_weighted_trend }} from last {{ selectedTimeframe === 'monthly' ? 'month' : 'quarter' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Forecast Accuracy -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.forecasting.kpis.forecast_accuracy') }}</p>
                <p :class="getAccuracyColor(forecastData.forecast_accuracy)" class="text-2xl font-bold">
                  {{ formatPercentage(forecastData.forecast_accuracy) }}
                </p>
                <p :class="getTrendColor(forecastData.trends.accuracy_trend)" class="text-sm">
                  {{ forecastData.trends.accuracy_trend }} from last month
                </p>
              </div>
            </div>
          </div>

          <!-- Active Deals -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.forecasting.kpis.active_deals') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatNumber(forecastData.active_deals) }}</p>
                <p :class="getTrendColor(forecastData.trends.active_deals_trend)" class="text-sm">
                  {{ forecastData.trends.active_deals_trend }} from last month
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Pipeline Breakdown Chart -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('marketing.forecasting.charts.pipeline_breakdown') }}</h3>
            <div class="h-80">
              <div v-if="pipelineData && pipelineData.length > 0" class="space-y-4">
                <div
                  v-for="item in pipelineData"
                  :key="item.stage"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      :class="getStageColor(item.stage)"
                      class="w-4 h-4 rounded-full"
                    ></div>
                    <span class="text-sm font-medium text-gray-900">{{ item.stage }}</span>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-semibold text-gray-900">{{ formatCurrency(item.value) }}</div>
                    <div class="text-xs text-gray-500">{{ item.count }} deals</div>
                  </div>
                </div>
                <!-- Simple Bar Chart Visualization -->
                <div class="mt-6">
                  <div class="space-y-2">
                    <div
                      v-for="item in pipelineData"
                      :key="item.stage"
                      class="flex items-center"
                    >
                      <div class="w-20 text-xs text-gray-600 truncate">{{ item.stage }}</div>
                      <div class="flex-1 mx-2">
                        <div class="bg-gray-200 rounded-full h-4">
                          <div
                            :class="getStageColor(item.stage)"
                            class="h-4 rounded-full flex items-center justify-end pr-2"
                            :style="{ width: `${(item.value / Math.max(...pipelineData.map(d => d.value))) * 100}%` }"
                          >
                            <span class="text-xs text-white font-medium">{{ formatPercentage(item.percentage) }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="w-20 text-xs text-gray-900 text-right">{{ formatCurrency(item.value) }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <div class="text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p class="text-gray-600">{{ $t('marketing.forecasting.no_data') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Accuracy Trends Chart -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('marketing.forecasting.charts.accuracy_trends') }}</h3>
            <div class="h-80">
              <div v-if="accuracyTrends && accuracyTrends.length > 0" class="space-y-4">
                <!-- Simple Line Chart Visualization -->
                <div class="h-48 relative">
                  <div class="absolute inset-0 flex items-end justify-between px-4 pb-4">
                    <div
                      v-for="item in accuracyTrends"
                      :key="item.month"
                      class="flex flex-col items-center space-y-2"
                    >
                      <div
                        class="bg-blue-600 rounded-full w-3 h-3"
                        :style="{ height: `${(item.accuracy / 100) * 180}px` }"
                      ></div>
                      <div class="text-xs text-gray-600">{{ item.month }}</div>
                    </div>
                  </div>
                  <!-- Y-axis labels -->
                  <div class="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>
                </div>
                <!-- Data Points -->
                <div class="space-y-2">
                  <div
                    v-for="item in accuracyTrends"
                    :key="item.month"
                    class="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span class="text-sm font-medium">{{ item.month }}</span>
                    <span :class="getAccuracyColor(item.accuracy)" class="text-sm font-semibold">
                      {{ formatPercentage(item.accuracy) }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <div class="text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p class="text-gray-600">{{ $t('marketing.forecasting.no_data') }}</p>
                </div>
              </div>
            </div>
          </div>
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
                  <span class="text-sm font-semibold">{{ formatCurrency(multiTimeframeData.monthly.projected_value) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.probability_weighted') }}:</span>
                  <span class="text-sm font-semibold">{{ formatCurrency(multiTimeframeData.monthly.probability_weighted) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.forecast_accuracy') }}:</span>
                  <span :class="getAccuracyColor(multiTimeframeData.monthly.forecast_accuracy)" class="text-sm font-semibold">
                    {{ formatPercentage(multiTimeframeData.monthly.forecast_accuracy) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.active_deals') }}:</span>
                  <span class="text-sm font-semibold">{{ formatNumber(multiTimeframeData.monthly.active_deals) }}</span>
                </div>
              </div>
            </div>

            <!-- Quarterly Forecast -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">{{ $t('marketing.forecasting.timeframes.quarterly') }}</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.projected_value') }}:</span>
                  <span class="text-sm font-semibold">{{ formatCurrency(multiTimeframeData.quarterly.projected_value) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.probability_weighted') }}:</span>
                  <span class="text-sm font-semibold">{{ formatCurrency(multiTimeframeData.quarterly.probability_weighted) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.forecast_accuracy') }}:</span>
                  <span :class="getAccuracyColor(multiTimeframeData.quarterly.forecast_accuracy)" class="text-sm font-semibold">
                    {{ formatPercentage(multiTimeframeData.quarterly.forecast_accuracy) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.active_deals') }}:</span>
                  <span class="text-sm font-semibold">{{ formatNumber(multiTimeframeData.quarterly.active_deals) }}</span>
                </div>
              </div>
            </div>

            <!-- Yearly Forecast -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">{{ $t('marketing.forecasting.timeframes.yearly') }}</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.projected_value') }}:</span>
                  <span class="text-sm font-semibold">{{ formatCurrency(multiTimeframeData.yearly.projected_value) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.probability_weighted') }}:</span>
                  <span class="text-sm font-semibold">{{ formatCurrency(multiTimeframeData.yearly.probability_weighted) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.forecast_accuracy') }}:</span>
                  <span :class="getAccuracyColor(multiTimeframeData.yearly.forecast_accuracy)" class="text-sm font-semibold">
                    {{ formatPercentage(multiTimeframeData.yearly.forecast_accuracy) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.forecasting.kpis.active_deals') }}:</span>
                  <span class="text-sm font-semibold">{{ formatNumber(multiTimeframeData.yearly.active_deals) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Trends Summary -->
          <div v-if="multiTimeframeData.trends" class="mt-6 pt-6 border-t border-gray-200">
            <h4 class="text-sm font-medium text-gray-900 mb-4">{{ $t('marketing.forecasting.multi_timeframe.trends_summary') }}</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center p-3 bg-blue-50 rounded-lg">
                <div class="text-lg font-semibold text-blue-600">{{ multiTimeframeData.trends.monthly_trend }}</div>
                <div class="text-sm text-blue-600">{{ $t('marketing.forecasting.timeframes.monthly') }} {{ $t('marketing.forecasting.multi_timeframe.trend') }}</div>
              </div>
              <div class="text-center p-3 bg-purple-50 rounded-lg">
                <div class="text-lg font-semibold text-purple-600">{{ multiTimeframeData.trends.quarterly_trend }}</div>
                <div class="text-sm text-purple-600">{{ $t('marketing.forecasting.timeframes.quarterly') }} {{ $t('marketing.forecasting.multi_timeframe.trend') }}</div>
              </div>
              <div class="text-center p-3 bg-green-50 rounded-lg">
                <div class="text-lg font-semibold text-green-600">{{ multiTimeframeData.trends.yearly_trend }}</div>
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
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          {{ $t('marketing.forecasting.refresh') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { forecastingService, forecastingHelpers } from '@/services/forecasting'
import { error as showError, success as showSuccess } from '@/utils/notifications'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// Reactive state
const loading = ref(false)
const error = ref(null)
const forecastData = ref(null)
const pipelineData = ref([])
const accuracyTrends = ref([])
const selectedTimeframe = ref('monthly')
const multiTimeframeData = ref(null)
const availableTimeframes = ref([])

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

    const [forecastResponse, trendsResponse, pipelineResponse, accuracyResponse] = await Promise.all([
      forecastingService.getForecast(params),
      forecastingService.getForecastTrends({ months: 6 }),
      forecastingService.getPipelineBreakdown({ timeframe: selectedTimeframe.value }),
      forecastingService.getForecastAccuracy({ months: 3 })
    ])

    forecastData.value = forecastResponse.data
    accuracyTrends.value = trendsResponse.data.accuracy_trend || []
    pipelineData.value = pipelineResponse.data.breakdown || []

    // Update URL with timeframe
    forecastingHelpers.updateURLTimeframe(selectedTimeframe.value)

  } catch (err) {
    error.value = err.message || 'Failed to load forecast data'
    showError(error.value)
  } finally {
    loading.value = false
  }
}

const loadMultiTimeframeData = async () => {
  try {
    const response = await forecastingService.getMultiTimeframeForecast()
    multiTimeframeData.value = response.data
  } catch (err) {
    console.error('Failed to load multi-timeframe data:', err)
  }
}

const loadAvailableTimeframes = async () => {
  try {
    const response = await forecastingService.getTimeframes()
    availableTimeframes.value = response.data || []
  } catch (err) {
    console.error('Failed to load timeframes:', err)
  }
}

const refreshData = async () => {
  await loadForecastData()
  showSuccess('Forecast data refreshed successfully')
}

const handleTimeframeChange = async () => {
  await loadForecastData()
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
