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
                <span class="ml-4 text-sm font-medium text-gray-900">{{ $t('marketing.email.title') }}</span>
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
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('marketing.email.title') }}</h1>
          <p class="mt-2 text-lg text-gray-600">{{ $t('marketing.email.subtitle') }}</p>
        </div>
        <button
          @click="createEmail"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          {{ $t('marketing.email.actions.create_email') }}
        </button>
      </div>

      <!-- Email Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Emails Sent -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.email.metrics.emails_sent') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatNumber(totalSent) }}</p>
              <p class="text-sm text-green-600">+8% from last month</p>
            </div>
          </div>
        </div>

        <!-- Open Rate -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.email.metrics.open_rate') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ averageOpenRate }}%</p>
              <p class="text-sm text-green-600">+2.1% from last month</p>
            </div>
          </div>
        </div>

        <!-- Click Rate -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.email.metrics.click_rate') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ averageClickRate }}%</p>
              <p class="text-sm text-green-600">+0.4% from last month</p>
            </div>
          </div>
        </div>

        <!-- Bounce Rate -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.email.metrics.bounce_rate') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ averageBounceRate }}%</p>
              <p class="text-sm text-red-600">+0.3% from last month</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              @click="activeTab = 'campaigns'"
              :class="[
                activeTab === 'campaigns'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ $t('marketing.email.title') }}
            </button>
            <button
              @click="activeTab = 'metrics'"
              :class="[
                activeTab === 'metrics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ $t('marketing.email.overall_metrics.title') }}
            </button>
            <button
              @click="activeTab = 'tracking'"
              :class="[
                activeTab === 'tracking'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ $t('marketing.email.tracking.title') }}
            </button>
            <button
              @click="activeTab = 'automations'"
              :class="[
                activeTab === 'automations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ $t('marketing.email.automations.title') }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'campaigns'">
        <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.email.filters.status') }}</label>
            <select
              v-model="filters.status"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{{ $t('marketing.email.filters.all_statuses') }}</option>
              <option value="draft">{{ $t('marketing.email.filters.draft') }}</option>
              <option value="scheduled">{{ $t('marketing.email.filters.scheduled') }}</option>
              <option value="sent">{{ $t('marketing.email.filters.sent') }}</option>
              <option value="completed">{{ $t('marketing.email.filters.completed') }}</option>
              <option value="paused">{{ $t('marketing.email.filters.paused') }}</option>
              <option value="cancelled">{{ $t('marketing.email.filters.cancelled') }}</option>
            </select>
          </div>

          <!-- Owner Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.email.filters.owner') }}</label>
            <select
              v-model="filters.owner"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{{ $t('marketing.email.filters.all_statuses') }}</option>
              <option v-for="owner in owners" :key="owner.id" :value="owner.id">{{ owner.name }}</option>
            </select>
          </div>

          <!-- Template Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.email.filters.template') }}</label>
            <select
              v-model="filters.template"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{{ $t('marketing.email.filters.all_statuses') }}</option>
              <option v-for="template in templates" :key="template.id" :value="template.id">{{ template.name }}</option>
            </select>
          </div>

          <!-- Date Range Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.email.filters.date_range') }}</label>
            <input
              v-model="filters.dateFrom"
              type="date"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Campaigns Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.email.title') }}</h3>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">{{ $t('marketing.email.loading') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-12 text-center">
          <div class="text-red-600 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.email.error') }}</h3>
          <button
            @click="loadCampaigns"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {{ $t('common.marketing_overview.retry_button') }}
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="campaigns.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.email.empty_state.title') }}</h3>
          <p class="text-gray-600 mb-6">{{ $t('marketing.email.empty_state.message') }}</p>
          <button
            @click="createEmail"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.email.empty_state.create_campaign') }}
          </button>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.email.table.campaign') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.email.table.sent') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.email.table.opens') }} %
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.email.table.clicks') }} %
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.email.table.bounces') }} %
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.email.table.status') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.email.table.created_at') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.email.table.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="campaign in campaigns"
                :key="campaign.id"
                @click="openCampaignDrawer(campaign)"
                class="hover:bg-gray-50 cursor-pointer"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ campaign.name }}</div>
                  <div class="text-sm text-gray-500">{{ campaign.subject }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatNumber(campaign.sent_count) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ calculateOpenRate(campaign) }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ calculateClickRate(campaign) }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ calculateBounceRate(campaign) }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeColor(campaign.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ $t(`marketing.email.filters.${campaign.status}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(campaign.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click.stop="openCampaignDrawer(campaign)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    {{ $t('marketing.email.actions.view_details') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="campaigns.length > 0" class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
            </div>
            <div class="flex space-x-2">
              <button
                @click="previousPage"
                :disabled="pagination.current_page === 1"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="pagination.current_page === pagination.last_page"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>

      <!-- Overall Metrics Tab -->
      <div v-if="activeTab === 'metrics'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">{{ $t('marketing.email.overall_metrics.title') }}</h3>
          
          <!-- Overall Metrics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-gray-900">{{ formatNumber(overallMetrics.total_campaigns) }}</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.email.overall_metrics.total_campaigns') }}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-gray-900">{{ formatNumber(overallMetrics.total_sent) }}</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.email.overall_metrics.total_sent') }}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-gray-900">{{ formatNumber(overallMetrics.total_opens) }}</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.email.overall_metrics.total_opens') }}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-gray-900">{{ formatNumber(overallMetrics.total_clicks) }}</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.email.overall_metrics.total_clicks') }}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-gray-900">{{ formatNumber(overallMetrics.total_bounces) }}</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.email.overall_metrics.total_bounces') }}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-gray-900">{{ formatNumber(overallMetrics.total_unsubscribes) }}</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.email.overall_metrics.total_unsubscribes') }}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-gray-900">{{ overallMetrics.avg_open_rate }}%</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.email.overall_metrics.avg_open_rate') }}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-gray-900">{{ overallMetrics.avg_click_rate }}%</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.email.overall_metrics.avg_click_rate') }}</div>
            </div>
          </div>

          <!-- Email Performance Trends Chart -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <div>
                <h4 class="text-xl font-semibold text-gray-900">Email Performance Trends</h4>
                <p class="text-sm text-gray-600 mt-1">Track your email campaign performance over time</p>
              </div>
              <div class="flex flex-col sm:flex-row gap-3">
                <!-- Range Filter -->
                <div class="flex flex-col">
                  <label class="text-xs font-medium text-gray-700 mb-1">Time Range</label>
                  <select 
                    v-model="trendsFilters.range" 
                    @change="onTrendsFilterChange"
                    class="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-colors"
                    aria-label="Select time range"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="14d">Last 14 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>
                <!-- Interval Filter -->
                <div class="flex flex-col">
                  <label class="text-xs font-medium text-gray-700 mb-1">Interval</label>
                  <select 
                    v-model="trendsFilters.interval" 
                    @change="onTrendsFilterChange"
                    class="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-colors"
                    aria-label="Select data interval"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Chart Content -->
            <div class="h-80">
              <!-- Loading State -->
              <div v-if="trendsLoading" class="h-full flex items-center justify-center">
                <div class="text-center">
                  <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">Loading Trends Data</h4>
                  <p class="text-gray-600">Fetching your email performance metrics...</p>
                </div>
              </div>

              <!-- Error State -->
              <div v-else-if="trendsError" class="h-full flex items-center justify-center">
                <div class="text-center max-w-md">
                  <div class="bg-red-50 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">Unable to Load Trends</h4>
                  <p class="text-gray-600 mb-6">{{ trendsError }}</p>
                  <button 
                    @click="loadEmailTrends"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Try Again
                  </button>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else-if="!trendsData || trendsData.length === 0" class="h-full flex items-center justify-center">
                <div class="text-center max-w-md">
                  <div class="bg-gray-50 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
                  </div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">No Trends Data Available</h4>
                  <p class="text-gray-600">No performance data found for the selected time period. Try adjusting your date range or check back later.</p>
                </div>
              </div>

              <!-- Chart Implementation -->
              <div v-else class="h-full">
                <!-- Professional Chart Legend -->
                <div v-if="chartData.series && chartData.series.length > 0" class="flex flex-wrap justify-center gap-6 mb-6 px-4">
                  <div v-for="series in chartData.series" :key="series.name" class="flex items-center">
                    <div class="w-4 h-4 rounded mr-3 shadow-sm" :style="{ backgroundColor: series.color }"></div>
                    <span class="text-sm font-medium text-gray-700">{{ series.name }}</span>
                  </div>
                </div>

                <!-- Professional Chart Visualization -->
                <div v-if="chartData.series && chartData.series.length > 0" class="relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <!-- Chart Container -->
                  <div class="relative h-80">
                    <!-- Y-axis Title -->
                    <div class="absolute left-0 top-1/2 transform -rotate-90 -translate-y-1/2 -translate-x-8">
                      <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Count</span>
                    </div>

                    <!-- Chart Area -->
                    <div class="ml-12 mr-4 mb-8 mt-4 h-64 relative">
                      <!-- Grid Lines -->
                      <div class="absolute inset-0">
                        <div class="h-full flex flex-col justify-between">
                          <div v-for="i in 5" :key="i" class="border-t border-gray-100"></div>
                        </div>
                      </div>

                      <!-- Y-axis Labels -->
                      <div class="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 font-medium">
                        <span>{{ Math.round(chartData.maxValue) }}</span>
                        <span>{{ Math.round(chartData.maxValue * 0.8) }}</span>
                        <span>{{ Math.round(chartData.maxValue * 0.6) }}</span>
                        <span>{{ Math.round(chartData.maxValue * 0.4) }}</span>
                        <span>{{ Math.round(chartData.maxValue * 0.2) }}</span>
                        <span>0</span>
                      </div>

                      <!-- Chart Bars -->
                      <div class="ml-8 h-full flex items-end justify-between">
                        <div 
                          v-for="(label, index) in chartData.labels" 
                          :key="label"
                          class="flex-1 flex flex-col items-center group relative"
                          :class="{ 'mr-2': index < chartData.labels.length - 1 }"
                        >
                          <!-- Grouped Bars Container -->
                          <div class="flex items-end space-x-1 mb-3">
                            <!-- Sent Bar -->
                            <div 
                              v-if="chartData.series[0] && chartData.series[0].data[index] > 0"
                              class="w-6 rounded-t-sm shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
                              :style="{ 
                                height: `${(chartData.series[0].data[index] / chartData.maxValue) * 240}px`,
                                backgroundColor: chartData.series[0].color
                              }"
                              :title="`Sent: ${chartData.series[0].data[index]}`"
                            ></div>
                            <!-- Delivered Bar -->
                            <div 
                              v-if="chartData.series[1] && chartData.series[1].data[index] > 0"
                              class="w-6 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
                              :style="{ 
                                height: `${(chartData.series[1].data[index] / chartData.maxValue) * 240}px`,
                                backgroundColor: chartData.series[1].color
                              }"
                              :title="`Delivered: ${chartData.series[1].data[index]}`"
                            ></div>
                            <!-- Opens Bar -->
                            <div 
                              v-if="chartData.series[2] && chartData.series[2].data[index] > 0"
                              class="w-6 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
                              :style="{ 
                                height: `${(chartData.series[2].data[index] / chartData.maxValue) * 240}px`,
                                backgroundColor: chartData.series[2].color
                              }"
                              :title="`Opens: ${chartData.series[2].data[index]}`"
                            ></div>
                            <!-- Clicks Bar -->
                            <div 
                              v-if="chartData.series[3] && chartData.series[3].data[index] > 0"
                              class="w-6 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
                              :style="{ 
                                height: `${(chartData.series[3].data[index] / chartData.maxValue) * 240}px`,
                                backgroundColor: chartData.series[3].color
                              }"
                              :title="`Clicks: ${chartData.series[3].data[index]}`"
                            ></div>
                            <!-- Bounces Bar -->
                            <div 
                              v-if="chartData.series[4] && chartData.series[4].data[index] > 0"
                              class="w-6 rounded-b-sm shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
                              :style="{ 
                                height: `${(chartData.series[4].data[index] / chartData.maxValue) * 240}px`,
                                backgroundColor: chartData.series[4].color
                              }"
                              :title="`Bounces: ${chartData.series[4].data[index]}`"
                            ></div>
                          </div>
                          
                          <!-- X-axis Label -->
                          <div class="text-xs font-medium text-gray-600 text-center">
                            {{ label }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- X-axis Title -->
                    <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6">
                      <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</span>
                    </div>
                  </div>
                </div>

                <!-- Professional Summary Statistics -->
                <div v-if="chartData.series && chartData.series.length > 0" class="mt-6">
                  <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div v-for="series in chartData.series" :key="series.name" class="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="text-2xl font-bold text-gray-900">
                            {{ series.data.reduce((a, b) => a + b, 0).toLocaleString() }}
                          </div>
                          <div class="text-sm font-medium text-gray-600 mt-1">{{ series.name }}</div>
                        </div>
                        <div class="w-4 h-4 rounded shadow-sm" :style="{ backgroundColor: series.color }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Email Tracking Tab -->
      <div v-if="activeTab === 'tracking'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.email.tracking.title') }}</h3>
            
            <!-- Campaign Selector -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Select Campaign:</label>
              <select
                v-model="selectedCampaignId"
                @change="onCampaignSelect"
                class="min-w-[200px] text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-colors"
                :disabled="loading"
              >
                <option value="">Choose a campaign...</option>
                <option 
                  v-for="campaign in campaigns" 
                  :key="campaign.id" 
                  :value="campaign.id"
                >
                  {{ campaign.name }} ({{ campaign.status }})
                </option>
              </select>
            </div>
            
            <!-- Selected Campaign Info -->
            <div v-if="selectedCampaignForTracking" class="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-medium">Tracking:</span>
              <span class="ml-1">{{ selectedCampaignForTracking.name }} ({{ selectedCampaignForTracking.status }})</span>
            </div>
            
            <div class="flex space-x-4">
              <button
                @click="loadEmailOpens"
                :class="trackingType === 'opens' ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'"
                class="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {{ $t('marketing.email.tracking.opens') }}
              </button>
              <button
                @click="loadEmailClicks"
                :class="trackingType === 'clicks' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'"
                class="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {{ $t('marketing.email.tracking.clicks') }}
              </button>
              <button
                @click="loadEmailBounces"
                :class="trackingType === 'bounces' ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'"
                class="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Email Bounces
              </button>
            </div>
          </div>

          <!-- Tracking Data Table -->
          <div v-if="trackingData.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient Email
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ trackingType === 'opens' ? 'Opened At' : trackingType === 'clicks' ? 'Clicked At' : 'Bounced At' }}
                  </th>
                  <th v-if="trackingType === 'clicks'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicked URL
                  </th>
                  <th v-if="trackingType === 'bounces'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Error Reason
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device Info
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in trackingData" :key="item.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ item.email || item.recipient?.email || item.recipient_email || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(trackingType === 'opens' ? item.opened_at : trackingType === 'clicks' ? item.clicked_at : item.bounced_at) }}
                  </td>
                  <td v-if="trackingType === 'clicks'" class="px-6 py-4 text-sm text-gray-900">
                    <div v-if="item.clicked_url" class="max-w-xs">
                      <a :href="item.clicked_url" target="_blank" 
                         class="text-blue-600 hover:text-blue-800 truncate block" 
                         :title="item.clicked_url">
                        {{ item.clicked_url.length > 40 ? item.clicked_url.substring(0, 40) + '...' : item.clicked_url }}
                      </a>
                    </div>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td v-if="trackingType === 'bounces'" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span v-if="item.error_reason" 
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                          :class="item.bounce_type === 'hard' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'"
                          :title="item.error_reason">
                      {{ item.error_reason }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.metadata?.ip || item.ip_address || '-' }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    <div v-if="item.metadata?.device" 
                         class="max-w-xs truncate" 
                         :title="item.metadata.device">
                      {{ item.metadata.device }}
                    </div>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    <div v-if="item.metadata?.location" 
                         class="max-w-xs truncate" 
                         :title="item.metadata.location">
                      {{ item.metadata.location }}
                    </div>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h4 class="text-lg font-medium text-gray-900 mb-2">
              {{ trackingType === 'opens' ? $t('marketing.email.tracking.no_opens') : trackingType === 'clicks' ? $t('marketing.email.tracking.no_clicks') : 'No bounces found' }}
            </h4>
            <p class="text-gray-600">No tracking data available yet</p>
          </div>
        </div>
      </div>

      <!-- Email Automations Tab -->
      <div v-if="activeTab === 'automations'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.email.automations.title') }}</h3>
              <p class="text-sm text-gray-600">{{ $t('marketing.email.automations.subtitle') }}</p>
            </div>
            
            <!-- Campaign Selector for Automations -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by Campaign:</label>
              <select
                v-model="selectedCampaignIdForAutomation"
                @change="onAutomationCampaignSelect"
                class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Show all automations</option>
                <option
                  v-for="campaign in campaigns"
                  :key="campaign.id"
                  :value="campaign.id"
                >
                  {{ campaign.name }} ({{ campaign.status }})
                </option>
              </select>
          </div>
            
            <!-- Filter Info -->
            <div class="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span v-if="selectedCampaignForAutomation">
                <span class="font-medium">Filtered by:</span> {{ selectedCampaignForAutomation.name }} ({{ selectedCampaignForAutomation.status }})
              </span>
              <span v-else>
                <span class="font-medium">Showing all automations</span> ({{ automations.length }} total)
              </span>
            </div>
          </div>

          <div class="flex justify-between items-center mb-6">
            <div></div>
            <button
              @click="openCreateAutomationModal"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {{ $t('marketing.email.automations.create_automation') }}
            </button>
          </div>

          <!-- Automations Table -->
          <div v-if="automations.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Automation Name
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trigger
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Steps
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="automation in automations" :key="automation.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                      </div>
                      <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ automation.name }}</div>
                        <div class="text-sm text-gray-500">{{ automation.description || 'No description' }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatTriggerName(automation.trigger_event || automation.trigger) }}</div>
                    <div class="text-sm text-gray-500">{{ automation.delay_minutes || 0 }}min delay</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatActionName(automation.action) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      @click="toggleAutomationStatus(automation)"
                      :class="[
                        automation.is_active ? 'bg-blue-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                      ]"
                    >
                      <span
                        :class="[
                          automation.is_active ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        ]"
                      />
                    </button>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ automation.steps || 1 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(automation.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button
                        @click="viewAutomationLogs(automation)"
                        class="text-blue-600 hover:text-blue-900"
                        title="View Logs"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        @click="editAutomation(automation)"
                        class="text-gray-600 hover:text-gray-900"
                        title="Edit"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    <button
                      @click="deleteAutomation(automation.id)"
                        class="text-red-600 hover:text-red-900"
                        title="Delete"
                    >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h4 class="text-lg font-medium text-gray-900 mb-2">
              {{ selectedCampaignForAutomation 
                ? `No automations found for ${selectedCampaignForAutomation.name}` 
                : 'No automations found' 
              }}
            </h4>
            <p class="text-gray-600">
              {{ selectedCampaignForAutomation 
                ? 'Create your first automation for this campaign to start engaging with your audience automatically.' 
                : 'Create your first email automation to start engaging with your audience automatically.'
              }}
            </p>
          </div>
        </div>
      </div>

    <!-- Campaign Details Drawer -->
    <div
      v-if="selectedCampaign"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeCampaignDrawer"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute right-0 top-0 h-full w-96 bg-white shadow-xl" @click.stop>
        <div class="flex flex-col h-full">
          <!-- Drawer Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">{{ selectedCampaign.name }}</h3>
              <button
                @click="closeCampaignDrawer"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Drawer Tabs -->
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8 px-6">
              <button
                v-for="tab in drawerTabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                {{ $t(`marketing.email.drawer.${tab.id}`) }}
              </button>
            </nav>
          </div>

          <!-- Drawer Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'">
              <div class="space-y-6">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-3">{{ $t('marketing.email.drawer.metrics') }}</h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                      <div class="text-2xl font-bold text-gray-900">{{ formatNumber(selectedCampaign.sent_count) }}</div>
                      <div class="text-sm text-gray-600">{{ $t('marketing.email.metrics.emails_sent') }}</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                      <div class="text-2xl font-bold text-gray-900">{{ calculateOpenRate(selectedCampaign) }}%</div>
                      <div class="text-sm text-gray-600">{{ $t('marketing.email.metrics.open_rate') }}</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                      <div class="text-2xl font-bold text-gray-900">{{ calculateClickRate(selectedCampaign) }}%</div>
                      <div class="text-sm text-gray-600">{{ $t('marketing.email.metrics.click_rate') }}</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                      <div class="text-2xl font-bold text-gray-900">{{ calculateBounceRate(selectedCampaign) }}%</div>
                      <div class="text-sm text-gray-600">{{ $t('marketing.email.metrics.bounce_rate') }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recipients Tab -->
            <div v-if="activeTab === 'recipients'">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h5 class="text-sm font-medium text-gray-900">Campaign Recipients</h5>
                  <button
                    @click="fetchCampaignRecipients(selectedCampaign.id)"
                    :disabled="loadingRecipients"
                    class="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    {{ loadingRecipients ? 'Loading...' : 'Refresh' }}
                  </button>
                </div>

                <!-- Loading State -->
                <div v-if="loadingRecipients" class="flex justify-center items-center py-8">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>

                <!-- Recipients Table -->
                <div v-else-if="campaignRecipients && campaignRecipients.length > 0" class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sent At
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Opened At
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Clicked At
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="recipient in campaignRecipients" :key="recipient.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {{ recipient.name || 'N/A' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ recipient.email }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="getRecipientStatusClass(recipient.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                            {{ recipient.status || 'pending' }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ recipient.sent_at ? formatDate(recipient.sent_at) : '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ recipient.opened_at ? formatDate(recipient.opened_at) : '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ recipient.clicked_at ? formatDate(recipient.clicked_at) : '-' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-8">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h4 class="mt-2 text-sm font-medium text-gray-900">No recipients found</h4>
                  <p class="mt-1 text-sm text-gray-500">This campaign has no recipients configured yet.</p>
                </div>

                <!-- Error State -->
                <div v-if="recipientsError" class="text-center py-8">
                  <div class="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                    {{ recipientsError }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Activity Log Tab -->
            <div v-if="activeTab === 'activity_log'">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h5 class="text-sm font-medium text-gray-900">Campaign Audit Logs</h5>
                  <button
                    @click="fetchCampaignAuditLogs(selectedCampaign.id)"
                    :disabled="loadingAuditLogs"
                    class="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    {{ loadingAuditLogs ? 'Loading...' : 'Refresh' }}
                  </button>
                </div>

                <!-- Loading State -->
                <div v-if="loadingAuditLogs" class="flex justify-center items-center py-8">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>

                <!-- Audit Logs Table -->
                <div v-else-if="campaignAuditLogs && campaignAuditLogs.length > 0" class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Metadata
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IP Address
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Agent
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="log in campaignAuditLogs" :key="log.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="getAuditLogActionClass(log.action)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                            {{ formatAuditLogAction(log.action) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ log.user?.name || 'System' }}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">
                          <button
                            v-if="log.metadata"
                            @click="toggleMetadata(log.id)"
                            class="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            {{ expandedMetadata[log.id] ? 'Hide' : 'Show' }} Details
                          </button>
                          <div v-if="expandedMetadata[log.id] && log.metadata" class="mt-2 p-2 bg-gray-50 rounded text-xs font-mono">
                            {{ JSON.stringify(log.metadata, null, 2) }}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ log.ip_address || '-' }}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" :title="log.user_agent">
                          {{ log.user_agent || '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ formatDate(log.created_at) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-8">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h4 class="mt-2 text-sm font-medium text-gray-900">No audit logs yet</h4>
                  <p class="mt-1 text-sm text-gray-500">Audit logs will appear when actions are performed on this campaign.</p>
                </div>

                <!-- Error State -->
                <div v-if="auditLogsError" class="text-center py-8">
                  <div class="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                    {{ auditLogsError }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Automation Modal -->
  <div
    v-if="showCreateAutomationModal"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="showCreateAutomationModal = false"
  >
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showCreateAutomationModal = false"></div>

      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6" @click.stop>
        <div>
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {{ editingAutomationId ? 'Edit Email Automation' : 'Create Email Automation' }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Create an automation for <strong>{{ selectedCampaignForAutomation?.name }}</strong>
              </p>
            </div>
          </div>
        </div>

        <form @submit.prevent="createAutomation" class="mt-5 sm:mt-6">
          <div class="space-y-4">
            <!-- Automation Name -->
            <div>
              <label for="automationName" class="block text-sm font-medium text-gray-700">Automation Name</label>
              <input
                id="automationName"
                v-model="newAutomation.name"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Welcome Sequence"
              />
            </div>

            <!-- Trigger Event -->
            <div>
              <label for="triggerEvent" class="block text-sm font-medium text-gray-700">Trigger Event</label>
              <div class="mt-1 relative">
                <select
                  id="triggerEvent"
                  v-model="newAutomation.trigger_event"
                  @change="onTriggerChange"
                  required
                  :disabled="loadingAutomationOptions"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {{ loadingAutomationOptions ? 'Loading triggers...' : (automationOptions.triggers && automationOptions.triggers.length === 0) ? 'No triggers found' : 'Select a trigger...' }}
                  </option>
                  <option
                    v-for="trigger in debugAutomationOptions.triggers"
                    :key="trigger.id"
                    :value="trigger.id"
                  >
                    {{ trigger.name }}
                  </option>
                </select>
                <!-- Loading spinner -->
                <div v-if="loadingAutomationOptions" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Campaign Selection (conditional) -->
            <div v-if="showCampaignSelection">
              <label for="campaignSelection" class="block text-sm font-medium text-gray-700">
                Campaign <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative">
                <select
                  id="campaignSelection"
                  v-model="newAutomation.campaign_id"
                  @change="onCampaignSelectionChange"
                  required
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a campaign...</option>
                  <option
                    v-for="campaign in campaigns"
                    :key="campaign.id"
                    :value="campaign.id"
                  >
                    {{ campaign.name }} ({{ campaign.status }})
                  </option>
                </select>
              </div>
            </div>

            <!-- Campaign Metrics (conditional) -->
            <div v-if="showCampaignMetrics && campaignMetrics" class="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 class="text-sm font-medium text-blue-900 mb-3">Campaign Metrics</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-blue-700">Emails Sent:</span>
                  <span class="ml-2 font-medium text-blue-900">{{ campaignMetrics.sent_count || 0 }}</span>
                </div>
                <div>
                  <span class="text-blue-700">Opened/Clicked:</span>
                  <span class="ml-2 font-medium text-blue-900">{{ getOpenedClickedCount() }}</span>
                </div>
                <div>
                  <span class="text-blue-700">Open/Click Rate:</span>
                  <span class="ml-2 font-medium text-blue-900">{{ getOpenClickRate() }}%</span>
                </div>
              </div>
              <div class="mt-3 text-sm text-blue-800">
                {{ getImpactMessage() }}
              </div>
            </div>

            <!-- Delay Minutes -->
            <div>
              <label for="delayMinutes" class="block text-sm font-medium text-gray-700">Delay (minutes)</label>
              <input
                id="delayMinutes"
                v-model.number="newAutomation.delay_minutes"
                type="number"
                min="0"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="0"
              />
            </div>

            <!-- Action -->
            <div>
              <label for="action" class="block text-sm font-medium text-gray-700">Action</label>
              <div class="mt-1 relative">
                <select
                  id="action"
                  v-model="newAutomation.action"
                  required
                  @change="onActionChange"
                  :disabled="loadingAutomationOptions"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {{ loadingAutomationOptions ? 'Loading actions...' : (automationOptions.actions && automationOptions.actions.length === 0) ? 'No actions found' : 'Select an action...' }}
                  </option>
                  <option
                    v-for="action in debugAutomationOptions.actions"
                    :key="action.id"
                    :value="action.id"
                  >
                    {{ action.name }}
                  </option>
                </select>
                <!-- Loading spinner -->
                <div v-if="loadingAutomationOptions" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Dynamic Action Fields -->
            <div v-if="newAutomation.action">
              <!-- Send Email Action -->
              <div v-if="newAutomation.action === 'send_email'" class="space-y-3">
                <div>
                  <label for="emailTemplate" class="block text-sm font-medium text-gray-700">
                    Email Template <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1 relative">
                    <select
                      id="emailTemplate"
                      v-model="newAutomation.email_template_id"
                      required
                      :disabled="loadingTemplates"
                      class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option :value="null">
                        {{ loadingTemplates ? 'Loading templates...' : emailTemplates.length === 0 ? 'No templates found' : 'Select a template...' }}
                      </option>
                      <option
                        v-for="template in emailTemplates"
                        :key="template.id"
                        :value="template.id"
                      >
                        {{ template.name }} - {{ template.subject }}
                      </option>
                    </select>
                    <!-- Loading spinner -->
                    <div v-if="loadingTemplates" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg class="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                  <!-- Help text -->
                  <p v-if="emailTemplates.length === 0 && !loadingTemplates" class="mt-1 text-xs text-gray-500">
                    No email templates found. Create templates in the Campaigns section first.
                  </p>
                </div>
              </div>

              <!-- Add Tag Action -->
              <div v-if="newAutomation.action === 'add_tag'" class="space-y-3">
                <div>
                  <label for="tagName" class="block text-sm font-medium text-gray-700">Tag Name</label>
                  <input
                    id="tagName"
                    v-model="newAutomation.tag_name"
                    type="text"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., welcome, vip, newsletter"
                  />
                </div>
              </div>

              <!-- Create Task Action -->
              <div v-if="newAutomation.action === 'create_task'" class="space-y-3">
                <div>
                  <label for="taskTitle" class="block text-sm font-medium text-gray-700">Task Title</label>
                  <input
                    id="taskTitle"
                    v-model="newAutomation.task_title"
                    type="text"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Follow up with new contact"
                  />
                </div>
                <div>
                  <label for="taskAssignee" class="block text-sm font-medium text-gray-700">Assign To</label>
                  <select
                    id="taskAssignee"
                    v-model="newAutomation.task_assignee"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select assignee...</option>
                    <option
                      v-for="owner in owners"
                      :key="owner.id"
                      :value="owner.id"
                    >
                      {{ owner.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Update Field Action -->
              <div v-if="newAutomation.action === 'update_field'" class="space-y-3">
                <div>
                  <label for="contactField" class="block text-sm font-medium text-gray-700">Contact Field</label>
                  <select
                    id="contactField"
                    v-model="newAutomation.contact_field"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select field...</option>
                    <option value="status">Status</option>
                    <option value="source">Source</option>
                    <option value="priority">Priority</option>
                    <option value="notes">Notes</option>
                  </select>
                </div>
                <div>
                  <label for="fieldValue" class="block text-sm font-medium text-gray-700">New Value</label>
                  <input
                    id="fieldValue"
                    v-model="newAutomation.field_value"
                    type="text"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter new value"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="submit"
              :disabled="creatingAutomation || !isFormValid"
              :title="!isFormValid ? 'Please fill all required fields' : ''"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ creatingAutomation ? (editingAutomationId ? 'Updating...' : 'Creating...') : (editingAutomationId ? 'Update Automation' : 'Create Automation') }}
            </button>
            <button
              type="button"
              @click="showCreateAutomationModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- View Automation Logs Modal -->
  <div
    v-if="showLogsModal"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="showLogsModal = false"
  >
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showLogsModal = false"></div>

      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6" @click.stop>
        <div>
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Automation Execution Logs
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Execution history for <strong>{{ selectedAutomationForLogs?.name }}</strong>
              </p>
            </div>
          </div>
        </div>

        <div class="mt-5">
          <!-- Loading State -->
          <div v-if="loadingLogs" class="text-center py-8">
            <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-600">Loading execution logs...</p>
          </div>

          <!-- Logs Table -->
          <div v-else-if="automationLogs.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Executed At
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Error Message
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="log in automationLogs" :key="log.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ log.contact?.name || 'Unknown' }}</div>
                    <div class="text-sm text-gray-500">{{ log.contact?.email || 'No email' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(log.executed_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ log.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    <span v-if="log.error_message" class="text-red-600">{{ log.error_message }}</span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 class="text-lg font-medium text-gray-900 mb-2">No execution logs found</h4>
            <p class="text-gray-600">This automation hasn't been executed yet</p>
          </div>
        </div>

        <div class="mt-5 sm:mt-6">
          <button
            type="button"
            @click="showLogsModal = false"
            class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { emailMarketingService, emailMarketingHelpers } from '@/services/emailMarketing'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// Reactive state
const loading = ref(false)
const error = ref(null)
const campaigns = ref([])
const owners = ref([])
const templates = ref([])
const selectedCampaign = ref(null)
const selectedCampaignId = ref('')
const selectedCampaignForTracking = ref(null) // Separate ref for tracking purposes
const activeTab = ref('campaigns')

// New reactive state for additional features
const overallMetrics = ref({
  total_campaigns: 0,
  total_sent: 0,
  total_opens: 0,
  total_clicks: 0,
  total_bounces: 0,
  total_unsubscribes: 0,
  avg_open_rate: 0,
  avg_click_rate: 0,
  avg_bounce_rate: 0,
  avg_unsubscribe_rate: 0
})

const trackingData = ref([])
const trackingType = ref('opens')
const automations = ref([])
const showCreateAutomationModal = ref(false)

// Automation campaign selection
const selectedCampaignIdForAutomation = ref('')
const selectedCampaignForAutomation = ref(null)

// New automation form data
const newAutomation = ref({
  name: '',
  trigger_event: '',
  campaign_id: null,
  delay_minutes: 0,
  action: '',
  content_type: 'template', // Default to template
  // Dynamic action fields
  email_template_id: null,
  tag_name: '',
  task_title: '',
  task_assignee: '',
  contact_field: '',
  field_value: ''
})

const creatingAutomation = ref(false)
const editingAutomationId = ref(null)

// Automation options and templates
const automationOptions = ref({
  triggers: [],
  actions: []
})

const emailTemplates = ref([])
const loadingTemplates = ref(false)
const loadingAutomationOptions = ref(false)

// Campaign metrics for automation form
const campaignMetrics = ref(null)
const loadingCampaignMetrics = ref(false)

// Logs modal
const showLogsModal = ref(false)
const selectedAutomationForLogs = ref(null)
const automationLogs = ref([])
const loadingLogs = ref(false)

// Trends data and filters
const trendsData = ref([])
const trendsLoading = ref(false)
const trendsError = ref(null)
const trendsFilters = ref({
  range: '30d',
  interval: 'daily'
})

// Recipients and audit logs data
const campaignRecipients = ref([])
const loadingRecipients = ref(false)
const recipientsError = ref('')
const campaignAuditLogs = ref([])
const loadingAuditLogs = ref(false)
const auditLogsError = ref('')
const expandedMetadata = ref({})

// Filters
const filters = ref({
  status: '',
  owner: '',
  template: '',
  dateFrom: ''
})

// Pagination
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0
})

// Drawer tabs
const drawerTabs = ref([
  { id: 'overview', label: 'Overview' },
  { id: 'recipients', label: 'Recipients' },
  { id: 'activity_log', label: 'Activity Log' }
])

// Computed properties
const totalSent = computed(() => {
  // Use metrics data if available, otherwise fall back to campaigns
  if (overallMetrics.value.total_sent) {
    return overallMetrics.value.total_sent
  }
  return campaigns.value.reduce((sum, campaign) => sum + (campaign.sent_count || 0), 0)
})

const averageOpenRate = computed(() => {
  // Use metrics data if available
  if (overallMetrics.value.avg_open_rate !== undefined) {
    return overallMetrics.value.avg_open_rate.toFixed(1)
  }
  // Fall back to campaign calculation
  if (campaigns.value.length === 0) return 0
  const totalRate = campaigns.value.reduce((sum, campaign) => {
    return sum + parseFloat(emailMarketingHelpers.calculateOpenRate(campaign))
  }, 0)
  return (totalRate / campaigns.value.length).toFixed(1)
})

const averageClickRate = computed(() => {
  // Use metrics data if available
  if (overallMetrics.value.avg_click_rate !== undefined) {
    return overallMetrics.value.avg_click_rate.toFixed(1)
  }
  // Fall back to campaign calculation
  if (campaigns.value.length === 0) return 0
  const totalRate = campaigns.value.reduce((sum, campaign) => {
    return sum + parseFloat(emailMarketingHelpers.calculateClickRate(campaign))
  }, 0)
  return (totalRate / campaigns.value.length).toFixed(1)
})

const averageBounceRate = computed(() => {
  // Use metrics data if available
  if (overallMetrics.value.avg_bounce_rate !== undefined) {
    return overallMetrics.value.avg_bounce_rate.toFixed(1)
  }
  // Fall back to campaign calculation
  if (campaigns.value.length === 0) return 0
  const totalRate = campaigns.value.reduce((sum, campaign) => {
    return sum + parseFloat(emailMarketingHelpers.calculateBounceRate(campaign))
  }, 0)
  return (totalRate / campaigns.value.length).toFixed(1)
})

// Methods
const loadCampaigns = async () => {
  loading.value = true
  error.value = null
  
  try {
    const params = {
      page: pagination.value.current_page,
      per_page: pagination.value.per_page,
      ...filters.value
    }
    
    const response = await emailMarketingService.getEmailCampaigns(params)
    campaigns.value = response.data || []
    pagination.value = response.meta || pagination.value
  } catch (err) {
    error.value = err.message || 'Failed to load campaigns'
    showError(error.value)
  } finally {
    loading.value = false
  }
}

// Handle campaign selection for tracking
const onCampaignSelect = () => {
  if (selectedCampaignId.value) {
    // Find the selected campaign from the campaigns list
    const campaign = campaigns.value.find(c => c.id === parseInt(selectedCampaignId.value))
    if (campaign) {
      selectedCampaignForTracking.value = campaign
      console.log('Selected campaign for tracking:', campaign.name)
    }
  } else {
    selectedCampaignForTracking.value = null
  }
  
  // Clear tracking data when campaign changes
  trackingData.value = []
}

// Handle campaign selection for automation
const onAutomationCampaignSelect = () => {
  if (selectedCampaignIdForAutomation.value) {
    // Find the selected campaign from the campaigns list
    const campaign = campaigns.value.find(c => c.id === parseInt(selectedCampaignIdForAutomation.value))
    if (campaign) {
      selectedCampaignForAutomation.value = campaign
      console.log('Selected campaign for automation:', campaign.name)
      // Load automations for this specific campaign
      loadAutomationsForCampaign(campaign.id)
    }
  } else {
    selectedCampaignForAutomation.value = null
    // When no campaign is selected, show all automations
    loadAllAutomations()
  }
}

const loadOwners = async () => {
  try {
    const response = await emailMarketingService.getOwners()
    owners.value = response.data || []
  } catch (err) {
    console.error('Failed to load owners:', err)
  }
}

const loadTemplates = async () => {
  try {
    const response = await emailMarketingService.getCampaignTemplates()
    templates.value = response.data || []
  } catch (err) {
    console.error('Failed to load templates:', err)
  }
}

const applyFilters = () => {
  pagination.value.current_page = 1
  updateURL()
  loadCampaigns()
}

const updateURL = () => {
  const query = { ...filters.value }
  Object.keys(query).forEach(key => {
    if (!query[key]) delete query[key]
  })
  router.replace({ query })
}

const loadFiltersFromURL = () => {
  const query = route.query
  filters.value = {
    status: query.status || '',
    owner: query.owner || '',
    template: query.template || '',
    dateFrom: query.dateFrom || ''
  }
}

const previousPage = () => {
  if (pagination.value.current_page > 1) {
    pagination.value.current_page--
    loadCampaigns()
  }
}

const nextPage = () => {
  if (pagination.value.current_page < pagination.value.last_page) {
    pagination.value.current_page++
    loadCampaigns()
  }
}

const openCampaignDrawer = (campaign) => {
  selectedCampaign.value = campaign
  activeTab.value = 'overview'
  
  // Reset data when opening drawer
  campaignRecipients.value = []
  campaignAuditLogs.value = []
  recipientsError.value = ''
  auditLogsError.value = ''
  expandedMetadata.value = {}
}

const closeCampaignDrawer = () => {
  selectedCampaign.value = null
}

const createEmail = () => {
  // Route to campaign creation page with email type pre-selected
  router.push({
    path: '/campaigns/create',
    query: { type: 'email' }
  })
}

// Helper methods
const calculateOpenRate = (campaign) => emailMarketingHelpers.calculateOpenRate(campaign)
const calculateClickRate = (campaign) => emailMarketingHelpers.calculateClickRate(campaign)
const calculateBounceRate = (campaign) => emailMarketingHelpers.calculateBounceRate(campaign)
const getStatusBadgeColor = (status) => emailMarketingHelpers.getStatusBadgeColor(status)
const formatDate = (dateString) => emailMarketingHelpers.formatDate(dateString)
const formatNumber = (num) => emailMarketingHelpers.formatNumber(num)

// Computed properties for trends chart
const chartData = computed(() => {
  // Safely check if trendsData is an array with data
  if (!trendsData.value || !Array.isArray(trendsData.value) || trendsData.value.length === 0) {
    return {
      labels: [],
      series: [],
      maxValue: 0
    }
  }
  
  try {
    const labels = trendsData.value.map(item => {
      const date = new Date(item.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })
    
    const maxValue = Math.max(...trendsData.value.map(item => 
      Math.max(item.sent || 0, item.delivered || 0, item.opens || 0, item.clicks || 0, item.bounces || 0)
    ))
    
    return {
      labels,
      series: [
        { name: 'Sent', data: trendsData.value.map(item => item.sent || 0), color: '#2563eb' },
        { name: 'Delivered', data: trendsData.value.map(item => item.delivered || 0), color: '#16a34a' },
        { name: 'Opens', data: trendsData.value.map(item => item.opens || 0), color: '#f59e0b' },
        { name: 'Clicks', data: trendsData.value.map(item => item.clicks || 0), color: '#9333ea' },
        { name: 'Bounces', data: trendsData.value.map(item => item.bounces || 0), color: '#dc2626' }
      ],
      maxValue: maxValue || 1 // Ensure maxValue is never 0 to prevent division by zero
    }
  } catch (error) {
    console.error('Error processing chart data:', error)
    return {
      labels: [],
      series: [],
      maxValue: 1
    }
  }
})

// Filter change handler
const onTrendsFilterChange = () => {
  loadEmailTrends()
}

// New methods for additional features
const loadOverallMetrics = async () => {
  try {
    const response = await emailMarketingService.getOverallMetrics()
    // Handle the actual API response structure: { success: true, data: { delivered: "114", opens: 0, clicks: 0, bounces: "4" } }
    const metricsData = response.data || response
    
    // Calculate rates from the raw data
    const delivered = parseInt(metricsData.delivered) || 0
    const opens = metricsData.opens || 0
    const clicks = metricsData.clicks || 0
    const bounces = parseInt(metricsData.bounces) || 0
    
    // Calculate percentages
    const openRate = delivered > 0 ? (opens / delivered) * 100 : 0
    const clickRate = delivered > 0 ? (clicks / delivered) * 100 : 0
    const bounceRate = delivered > 0 ? (bounces / delivered) * 100 : 0
    
    overallMetrics.value = {
      total_campaigns: metricsData.total_campaigns || 0,
      total_sent: delivered,
      total_opens: opens,
      total_clicks: clicks,
      total_bounces: bounces,
      total_unsubscribes: metricsData.total_unsubscribes || 0,
      avg_open_rate: openRate,
      avg_click_rate: clickRate,
      avg_bounce_rate: bounceRate,
      avg_unsubscribe_rate: metricsData.avg_unsubscribe_rate || 0
    }
  } catch (error) {
    console.error('Error loading overall metrics:', error)
  }
}

// Load email trends data
const loadEmailTrends = async () => {
  trendsLoading.value = true
  trendsError.value = null
  try {
    const response = await emailMarketingService.getEmailTrends(trendsFilters.value.range, trendsFilters.value.interval)
    
    // Handle different response structures
    let data = null
    if (response && response.data) {
      // If response has nested data structure
      data = Array.isArray(response.data) ? response.data : []
    } else if (Array.isArray(response)) {
      // If response is directly an array
      data = response
    } else {
      // Fallback to empty array
      data = []
    }
    
    // Ensure trendsData is always an array
    trendsData.value = Array.isArray(data) ? data : []
    
    console.log('Trends data loaded:', trendsData.value)
  } catch (error) {
    console.error('Error loading email trends:', error)
    trendsError.value = error.message || 'Failed to load trends data'
    trendsData.value = [] // Ensure it's always an array even on error
    showError(t('marketing.email.trends.error') || 'Failed to load trends data')
  } finally {
    trendsLoading.value = false
  }
}

const loadEmailOpens = async () => {
  try {
    trackingType.value = 'opens'
    
    // Check if a campaign is selected
    if (!selectedCampaignForTracking.value) {
      showError('Please select a campaign to view tracking data')
      return
    }
    
    console.log('Loading opens for campaign:', selectedCampaignForTracking.value.name)
    
    // Call new campaign-level tracking endpoint
    const response = await emailMarketingService.getOpensByCampaign(selectedCampaignForTracking.value.id)
    trackingData.value = response.data || []
    
    // If no data returned, use fallback data for demonstration
    if (!trackingData.value || trackingData.value.length === 0) {
      trackingData.value = [
        {
          id: 1,
          recipient: { email: 'user@example.com' },
          opened_at: '2024-01-15T14:30:00Z',
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0...',
          location: 'New York, USA'
        }
      ]
    }
  } catch (error) {
    console.error('Error loading email opens:', error)
    // Use fallback data on error
    trackingData.value = [
      {
        id: 1,
        recipient: { email: 'user@example.com' },
        opened_at: '2024-01-15T14:30:00Z',
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0...',
        location: 'New York, USA'
      }
    ]
    showError('Failed to load tracking data')
  }
}

// Track email open for a specific recipient
const trackRecipientOpen = async (recipientId, campaignId = null) => {
  try {
    await emailMarketingService.recordEmailOpen(recipientId, campaignId)
    // Optionally refresh the tracking data after recording an open
    if (trackingType.value === 'opens') {
      await loadEmailOpens()
    }
  } catch (error) {
    console.error('Error tracking recipient open:', error)
    showError('Failed to track email open')
  }
}

// Load tracking data for a specific recipient
const loadTrackingDataForRecipient = async (recipientId, type = 'opens') => {
  try {
    if (type === 'opens') {
      const response = await emailMarketingService.trackEmailOpens({ recipient_id: recipientId })
      return response.data || []
    } else if (type === 'clicks') {
      const response = await emailMarketingService.trackEmailClicks({ recipient_id: recipientId })
      return response.data || []
    }
  } catch (error) {
    console.error(`Error loading ${type} data for recipient:`, error)
    return []
  }
}

const loadEmailClicks = async () => {
  try {
    trackingType.value = 'clicks'
    
    // Check if a campaign is selected
    if (!selectedCampaignForTracking.value) {
      showError('Please select a campaign to view tracking data')
      return
    }
    
    console.log('Loading clicks for campaign:', selectedCampaignForTracking.value.name)
    
    // Call new campaign-level tracking endpoint
    const response = await emailMarketingService.getClicksByCampaign(selectedCampaignForTracking.value.id)
    trackingData.value = response.data || []
    
    // If no data returned, use fallback data for demonstration
    if (!trackingData.value || trackingData.value.length === 0) {
      trackingData.value = [
        {
          id: 1,
          recipient: { email: 'user@example.com' },
          clicked_url: 'https://example.com/product',
          clicked_at: '2024-01-15T14:35:00Z',
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0...'
        }
      ]
    }
  } catch (error) {
    console.error('Error loading email clicks:', error)
    // Use fallback data on error
    trackingData.value = [
      {
        id: 1,
        recipient: { email: 'user@example.com' },
        clicked_url: 'https://example.com/product',
        clicked_at: '2024-01-15T14:35:00Z',
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0...'
      }
    ]
    showError('Failed to load tracking data')
  }
}

// Track email click for a specific recipient
const trackRecipientClick = async (recipientId, clickedUrl, campaignId = null) => {
  try {
    await emailMarketingService.recordEmailClick(recipientId, clickedUrl, campaignId)
    // Optionally refresh the tracking data after recording a click
    if (trackingType.value === 'clicks') {
      await loadEmailClicks()
    }
  } catch (error) {
    console.error('Error tracking recipient click:', error)
    showError('Failed to track email click')
  }
}

// Load email bounces for the selected campaign
const loadEmailBounces = async () => {
  try {
    trackingType.value = 'bounces'
    
    // Check if a campaign is selected
    if (!selectedCampaignForTracking.value) {
      showError('Please select a campaign to view tracking data')
      return
    }
    
    console.log('Loading bounces for campaign:', selectedCampaignForTracking.value.name)
    
    // Call new campaign-level tracking endpoint
    const response = await emailMarketingService.getBouncesByCampaign(selectedCampaignForTracking.value.id)
    trackingData.value = response.data || []
    
    // If no data returned, use fallback data for demonstration
    if (!trackingData.value || trackingData.value.length === 0) {
      trackingData.value = [
        {
          id: 1,
          recipient: { email: 'bounced@example.com' },
          bounced_at: '2024-01-15T14:40:00Z',
          error_reason: 'Invalid email address',
          bounce_type: 'hard',
          ip_address: '192.168.1.1'
        }
      ]
    }
  } catch (error) {
    console.error('Error loading email bounces:', error)
    // Use fallback data on error
    trackingData.value = [
      {
        id: 1,
        recipient: { email: 'bounced@example.com' },
        bounced_at: '2024-01-15T14:40:00Z',
        error_reason: 'Invalid email address',
        bounce_type: 'hard',
        ip_address: '192.168.1.1'
      }
    ]
    showError('Failed to load tracking data')
  }
}

// Load automations for a specific campaign
const loadAutomationsForCampaign = async (campaignId) => {
  try {
    const response = await emailMarketingService.getAutomations(campaignId)
    automations.value = response.data || []
  } catch (error) {
    console.error('Error loading campaign automations:', error)
    // Use fallback data for demonstration
    automations.value = [
      {
        id: 1,
        name: 'Welcome Sequence',
        trigger: 'contact_created',
        status: 'active',
        steps: 3,
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        name: 'Follow-up',
        trigger: 'email_opened',
        status: 'draft',
        steps: 2,
        created_at: '2024-01-16T12:00:00Z'
      }
    ]
    showError('Failed to load automations')
  }
}

// Load all automations (when tab opens)
const loadAllAutomations = async () => {
  try {
    const response = await emailMarketingService.getAllAutomations()
    automations.value = response.data || []
    console.log('Loaded all automations:', automations.value)
  } catch (error) {
    console.error('Error loading all automations:', error)
    automations.value = []
    showError('Failed to load automations')
  }
}

const loadAutomations = async () => {
  // Load all automations by default when tab opens
  await loadAllAutomations()
}

const deleteAutomation = async (automationId) => {
  try {
    await emailMarketingService.deleteAutomation(automationId)
    automations.value = automations.value.filter(a => a.id !== automationId)
    showSuccess('Automation deleted successfully')
  } catch (error) {
    console.error('Error deleting automation:', error)
    showError('Failed to delete automation')
  }
}

// Create new automation
const createAutomation = async () => {
  // Validate required fields
  if (!newAutomation.value.name?.trim()) {
    showError('Please enter an automation name')
    return
  }

  if (!newAutomation.value.trigger_event) {
    showError('Please select a trigger event')
    return
  }

  if (!newAutomation.value.action) {
    showError('Please select an action')
    return
  }

  // Validate campaign requirement for email_opened and link_clicked triggers
  if (showCampaignSelection.value && !newAutomation.value.campaign_id) {
    showError('Please select a campaign for this trigger type')
    return
  }

  // Validate template requirement for send_email action
  if (newAutomation.value.action === 'send_email') {
    if (!newAutomation.value.email_template_id) {
      showError('Please select an email template')
      return
    }
    // Ensure template_id is a valid integer
    const templateId = parseInt(newAutomation.value.email_template_id)
    if (isNaN(templateId) || templateId <= 0) {
      showError('Please select a valid email template')
      return
    }
  }

  // Validate other action-specific required fields
  if (newAutomation.value.action === 'add_tag' && !newAutomation.value.tag_name?.trim()) {
    showError('Please enter a tag name')
    return
  }

  if (newAutomation.value.action === 'create_task' && !newAutomation.value.task_title?.trim()) {
    showError('Please enter a task title')
    return
  }

  if (newAutomation.value.action === 'update_field' && (!newAutomation.value.contact_field || !newAutomation.value.field_value?.trim())) {
    showError('Please select a contact field and enter a value')
    return
  }

  creatingAutomation.value = true
  
  try {
    // Validate template selection for send_email action
    if (newAutomation.value.action === 'send_email') {
      if (!newAutomation.value.email_template_id || newAutomation.value.email_template_id === null) {
        showError('Please select a valid email template')
        return
      }
    }

    // Build payload according to new backend requirements
    const templateId = newAutomation.value.action === 'send_email' ? newAutomation.value.email_template_id : null
    
    const payload = {
      trigger_event: newAutomation.value.trigger_event,
      campaign_id: showCampaignSelection.value ? newAutomation.value.campaign_id : null,
      template_id: templateId ? parseInt(templateId) : null,
      content_type: newAutomation.value.content_type || 'template',
      action: newAutomation.value.action,
      delay_minutes: newAutomation.value.delay_minutes || 0,
      name: newAutomation.value.name
    }

    // Add action-specific metadata
    if (newAutomation.value.action === 'add_tag') {
      payload.metadata = {
        tag_name: newAutomation.value.tag_name
      }
    } else if (newAutomation.value.action === 'create_task') {
      payload.metadata = {
        task_title: newAutomation.value.task_title,
        task_assignee: newAutomation.value.task_assignee
      }
    } else if (newAutomation.value.action === 'update_field') {
      payload.metadata = {
        contact_field: newAutomation.value.contact_field,
        field_value: newAutomation.value.field_value
      }
    }

    let response
    
    if (editingAutomationId.value) {
      // Update existing automation
      console.log('Updating automation:', editingAutomationId.value, payload)
      response = await emailMarketingService.updateAutomation(editingAutomationId.value, payload)
      
      // Update the automation in the list
      const index = automations.value.findIndex(a => a.id === editingAutomationId.value)
      if (index !== -1) {
        automations.value[index] = {
          ...automations.value[index],
          ...payload,
          updated_at: new Date().toISOString()
        }
      }
      
      showSuccess('Automation updated successfully')
    } else {
      // Create new automation
      if (!showCampaignSelection.value) {
        // For contact_created and form_submitted triggers, campaign_id is null
        // Use a default campaign ID for API call (backend requires campaign context), but payload has campaign_id: null
        const campaignId = selectedCampaignForAutomation.value?.id || (campaigns.value.length > 0 ? campaigns.value[0].id : 1)
        console.log('Creating automation for contact_created/form_submitted:', {
          trigger: newAutomation.value.trigger_event,
          campaignId: campaignId,
          payloadCampaignId: payload.campaign_id,
          availableCampaigns: campaigns.value.map(c => ({ id: c.id, name: c.name }))
        })
        response = await emailMarketingService.createCampaignAutomation(campaignId, payload)
      } else {
        // For email_opened and link_clicked triggers, campaign is required from form dropdown
        if (!newAutomation.value.campaign_id) {
          showError('Please select a campaign for this trigger type')
          return
        }
        console.log('Creating automation for email_opened/link_clicked:', {
          trigger: newAutomation.value.trigger_event,
          campaignId: newAutomation.value.campaign_id,
          payloadCampaignId: payload.campaign_id
        })
        response = await emailMarketingService.createCampaignAutomation(newAutomation.value.campaign_id, payload)
      }

      // Add the new automation to the list with Draft status
      const newAutomationData = {
        id: response.data?.id || Date.now(), // Use response ID or fallback
        name: payload.name,
        trigger_event: payload.trigger_event,
        action: payload.action,
        status: 'draft', // Always start as draft
        is_active: false, // Start as inactive
        steps: 1, // Default to 1 step
        created_at: new Date().toISOString()
      }

      automations.value.unshift(newAutomationData)
      showSuccess('Automation created successfully')
    }
    
    // Reset form and close modal
    resetAutomationForm()
    editingAutomationId.value = null
    showCreateAutomationModal.value = false
    
  } catch (error) {
    console.error('Error creating automation:', error)
    
    // More specific error handling
    if (error.response?.data?.message) {
      showError(`Failed to create automation: ${error.response.data.message}`)
    } else if (error.message) {
      showError(`Failed to create automation: ${error.message}`)
    } else {
      showError('Failed to create automation. Please try again.')
    }
  } finally {
    creatingAutomation.value = false
  }
}

const formatTriggerName = (trigger) => emailMarketingHelpers.formatTriggerName(trigger)
const getAutomationStatusColor = (status) => emailMarketingHelpers.getAutomationStatusColor(status)
const formatActionName = (action) => emailMarketingHelpers.formatActionName(action)

// Debug computed properties
const debugAutomationOptions = computed(() => {
  console.log('Debug - automationOptions:', automationOptions.value)
  console.log('Debug - triggers length:', (automationOptions.value.triggers && automationOptions.value.triggers.length) || 0)
  console.log('Debug - actions length:', (automationOptions.value.actions && automationOptions.value.actions.length) || 0)
  
  // Ensure we always return valid arrays
  return {
    triggers: Array.isArray(automationOptions.value.triggers) ? automationOptions.value.triggers : [],
    actions: Array.isArray(automationOptions.value.actions) ? automationOptions.value.actions : []
  }
})

// Computed properties for automation form logic
const showCampaignSelection = computed(() => {
  return newAutomation.value.trigger_event === 'email_opened' || newAutomation.value.trigger_event === 'link_clicked'
})

const showCampaignMetrics = computed(() => {
  return showCampaignSelection.value && newAutomation.value.campaign_id && campaignMetrics.value
})

// Form validation computed property
const isFormValid = computed(() => {
  const hasRequiredFields = newAutomation.value.name?.trim() && 
                           newAutomation.value.trigger_event && 
                           newAutomation.value.action
  
  // Template is required for send_email action
  const hasTemplate = newAutomation.value.action !== 'send_email' || 
                     (newAutomation.value.action === 'send_email' && newAutomation.value.email_template_id)
  
  // Campaign is required only for email_opened and link_clicked
  const hasCampaign = !showCampaignSelection.value || newAutomation.value.campaign_id
  
  return hasRequiredFields && hasTemplate && hasCampaign
})

// Load automation options
const loadAutomationOptions = async () => {
  loadingAutomationOptions.value = true
  try {
    const response = await emailMarketingService.getAutomationOptions()
    console.log('Raw API response:', response)
    console.log('Response data:', response.data)
    
    // Handle different response structures
    let optionsData = response.data
    if (optionsData && typeof optionsData === 'object') {
      // Ensure we have arrays for triggers and actions
      automationOptions.value = {
        triggers: Array.isArray(optionsData.triggers) ? optionsData.triggers : [],
        actions: Array.isArray(optionsData.actions) ? optionsData.actions : []
      }
    } else {
      // If response.data is not an object, initialize empty arrays
      automationOptions.value = { triggers: [], actions: [] }
    }
    
    console.log('Processed automation options:', automationOptions.value)
    
    // If we have empty arrays, use fallback data
    if (automationOptions.value.triggers.length === 0 || automationOptions.value.actions.length === 0) {
      console.log('Using fallback data due to empty arrays')
      automationOptions.value = {
        triggers: [
          { id: 'contact_created', name: 'Contact Created', description: 'When a new contact is added' },
          { id: 'email_opened', name: 'Email Opened', description: 'When recipient opens an email' },
          { id: 'link_clicked', name: 'Link Clicked', description: 'When recipient clicks a link' },
          { id: 'form_submitted', name: 'Form Submitted', description: 'When a form is submitted' }
        ],
        actions: [
          { id: 'send_email', name: 'Send Email', description: 'Send an email template' },
          { id: 'add_tag', name: 'Add Tag', description: 'Add a tag to contact' },
          { id: 'create_task', name: 'Create Task', description: 'Create a follow-up task' },
          { id: 'update_field', name: 'Update Field', description: 'Update a contact field' }
        ]
      }
      console.log('Fallback automation options applied:', automationOptions.value)
    }
    
  } catch (error) {
    console.error('Error loading automation options:', error)
    // Use fallback data on error
    automationOptions.value = {
      triggers: [
        { id: 'contact_created', name: 'Contact Created', description: 'When a new contact is added' },
        { id: 'email_opened', name: 'Email Opened', description: 'When recipient opens an email' },
        { id: 'link_clicked', name: 'Link Clicked', description: 'When recipient clicks a link' },
        { id: 'form_submitted', name: 'Form Submitted', description: 'When a form is submitted' }
      ],
      actions: [
        { id: 'send_email', name: 'Send Email', description: 'Send an email template' },
        { id: 'add_tag', name: 'Add Tag', description: 'Add a tag to contact' },
        { id: 'create_task', name: 'Create Task', description: 'Create a follow-up task' },
        { id: 'update_field', name: 'Update Field', description: 'Update a contact field' }
      ]
    }
    console.log('Error fallback automation options applied:', automationOptions.value)
  } finally {
    loadingAutomationOptions.value = false
  }
}

// Load email templates
const loadEmailTemplates = async () => {
  loadingTemplates.value = true
  try {
    const response = await emailMarketingService.getEmailTemplates()
    emailTemplates.value = response.data || []
  } catch (error) {
    console.error('Error loading email templates:', error)
    emailTemplates.value = []
    showError('Failed to load email templates')
  } finally {
    loadingTemplates.value = false
  }
}

// Open Create Automation modal and load templates
const openCreateAutomationModal = async () => {
  // Reset form first
  resetAutomationForm()
  
  showCreateAutomationModal.value = true
  // Load both templates and automation options when modal opens
  await Promise.all([
    loadEmailTemplates(),
    loadAutomationOptions()
  ])
}

// Reset automation form
const resetAutomationForm = () => {
  newAutomation.value = {
    name: 'Welcome',
    trigger_event: '',
    campaign_id: null,
    delay_minutes: 0,
    action: '',
    content_type: 'template',
    // Dynamic action fields
    email_template_id: null,
    tag_name: '',
    task_title: '',
    task_assignee: '',
    contact_field: '',
    field_value: ''
  }
  campaignMetrics.value = null
}

// Handle action change to clear dynamic fields
const onActionChange = () => {
  // Clear all dynamic action fields when action changes
  newAutomation.value.email_template_id = ''
  newAutomation.value.tag_name = ''
  newAutomation.value.task_title = ''
  newAutomation.value.task_assignee = ''
  newAutomation.value.contact_field = ''
  newAutomation.value.field_value = ''
}

// Handle trigger change to reset campaign selection and metrics
const onTriggerChange = () => {
  // Clear campaign selection and metrics when trigger changes
  newAutomation.value.campaign_id = null
  campaignMetrics.value = null
  
  // Set default action to send_email for new triggers
  if (newAutomation.value.trigger_event && !newAutomation.value.action) {
    newAutomation.value.action = 'send_email'
  }
  
  // Ensure campaign_id is null for contact_created and form_submitted triggers
  if (newAutomation.value.trigger_event === 'contact_created' || 
      newAutomation.value.trigger_event === 'form_submitted') {
    newAutomation.value.campaign_id = null
  }
}

// Handle campaign selection change to load metrics
const onCampaignSelectionChange = async () => {
  if (newAutomation.value.campaign_id && showCampaignSelection.value) {
    await loadCampaignMetrics(newAutomation.value.campaign_id)
  } else {
    campaignMetrics.value = null
  }
}

// Load campaign metrics for automation form
const loadCampaignMetrics = async (campaignId) => {
  if (!campaignId) return
  
  loadingCampaignMetrics.value = true
  try {
    const response = await emailMarketingService.getCampaignMetrics(campaignId)
    campaignMetrics.value = response.data
  } catch (error) {
    console.error('Error loading campaign metrics:', error)
    campaignMetrics.value = null
  } finally {
    loadingCampaignMetrics.value = false
  }
}

// Helper methods for campaign metrics display
const getOpenedClickedCount = () => {
  if (!campaignMetrics.value) return 0
  if (newAutomation.value.trigger_event === 'email_opened') {
    return campaignMetrics.value.opened_count || 0
  } else if (newAutomation.value.trigger_event === 'link_clicked') {
    return campaignMetrics.value.clicked_count || 0
  }
  return 0
}

const getOpenClickRate = () => {
  if (!campaignMetrics.value) return 0
  if (newAutomation.value.trigger_event === 'email_opened') {
    return ((campaignMetrics.value.opened_count || 0) / (campaignMetrics.value.sent_count || 1) * 100).toFixed(1)
  } else if (newAutomation.value.trigger_event === 'link_clicked') {
    return ((campaignMetrics.value.clicked_count || 0) / (campaignMetrics.value.sent_count || 1) * 100).toFixed(1)
  }
  return 0
}

const getImpactMessage = () => {
  if (!campaignMetrics.value) return ''
  
  const count = getOpenedClickedCount()
  const templateName = emailTemplates.value.find(t => t.id == newAutomation.value.email_template_id)?.name || 'the selected template'
  
  if (newAutomation.value.trigger_event === 'email_opened') {
    return `Automation will send "${templateName}" to ${count} people who opened this campaign`
  } else if (newAutomation.value.trigger_event === 'link_clicked') {
    return `Automation will send "${templateName}" to ${count} people who clicked links in this campaign`
  }
  return ''
}

// Toggle automation status
const toggleAutomationStatus = async (automation) => {
  try {
    const newStatus = !automation.is_active
    await emailMarketingService.updateAutomationStatus(automation.id, newStatus)
    
    // Update local state
    automation.is_active = newStatus
    automation.status = newStatus ? 'active' : 'paused'
    
    showSuccess(`Automation ${newStatus ? 'activated' : 'deactivated'} successfully`)
  } catch (error) {
    console.error('Error toggling automation status:', error)
    showError('Failed to update automation status')
    // Revert the toggle on error
    automation.is_active = !automation.is_active
  }
}

// View automation logs
const viewAutomationLogs = async (automation) => {
  try {
    selectedAutomationForLogs.value = automation
    showLogsModal.value = true
    loadingLogs.value = true
    
    // Load logs
    const response = await emailMarketingService.getAutomationLogs(automation.id)
    automationLogs.value = response.data || []
  } catch (error) {
    console.error('Error loading automation logs:', error)
    automationLogs.value = []
    showError('Failed to load automation logs')
  } finally {
    loadingLogs.value = false
  }
}

// Edit automation
const editAutomation = (automation) => {
  console.log('Edit automation:', automation)
  
  // Pre-fill the form with existing automation data
  newAutomation.value = {
    name: automation.name || '',
    trigger_event: automation.trigger_event || '',
    delay_minutes: automation.delay_minutes || 0,
    action: automation.action || '',
    // Dynamic action fields based on metadata
    email_template_id: automation.metadata?.email_template_id || '',
    tag_name: automation.metadata?.tag_name || '',
    task_title: automation.metadata?.task_title || '',
    task_assignee: automation.metadata?.task_assignee || '',
    contact_field: automation.metadata?.contact_field || '',
    field_value: automation.metadata?.field_value || ''
  }
  
  // Set the automation being edited
  editingAutomationId.value = automation.id
  
  // Open the modal
  showCreateAutomationModal.value = true
  
  // Load templates and options
  Promise.all([
    loadEmailTemplates(),
    loadAutomationOptions()
  ])
}

// Recipients methods
const fetchCampaignRecipients = async (campaignId) => {
  loadingRecipients.value = true
  recipientsError.value = ''
  
  try {
    const response = await emailMarketingService.getCampaignRecipients(campaignId)
    campaignRecipients.value = response.data || []
  } catch (err) {
    recipientsError.value = err.response?.data?.message || 'Failed to fetch recipients'
    campaignRecipients.value = []
  } finally {
    loadingRecipients.value = false
  }
}

const getRecipientStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'sent':
      return 'bg-green-100 text-green-800'
    case 'delivered':
      return 'bg-blue-100 text-blue-800'
    case 'opened':
      return 'bg-purple-100 text-purple-800'
    case 'clicked':
      return 'bg-yellow-100 text-yellow-800'
    case 'bounced':
      return 'bg-red-100 text-red-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Audit logs methods
const fetchCampaignAuditLogs = async (campaignId) => {
  loadingAuditLogs.value = true
  auditLogsError.value = ''
  
  try {
    const response = await emailMarketingService.getCampaignAuditLogs(campaignId)
    campaignAuditLogs.value = response.data || []
  } catch (err) {
    auditLogsError.value = err.response?.data?.message || 'Unable to load logs'
    campaignAuditLogs.value = []
  } finally {
    loadingAuditLogs.value = false
  }
}

const getAuditLogActionClass = (action) => {
  switch (action?.toLowerCase()) {
    case 'audience_frozen': return 'bg-blue-100 text-blue-800'
    case 'campaign_sent': return 'bg-green-100 text-green-800'
    case 'recipient_opened': return 'bg-yellow-100 text-yellow-800'
    case 'recipient_clicked': return 'bg-purple-100 text-purple-800'
    case 'recipient_unsubscribed': return 'bg-red-100 text-red-800'
    case 'campaign_created': return 'bg-indigo-100 text-indigo-800'
    case 'campaign_updated': return 'bg-orange-100 text-orange-800'
    case 'campaign_deleted': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatAuditLogAction = (action) => {
  return action?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || action
}

const toggleMetadata = (logId) => {
  expandedMetadata.value[logId] = !expandedMetadata.value[logId]
}

// Watch for route changes
watch(() => route.query, () => {
  loadFiltersFromURL()
  loadCampaigns()
}, { deep: true })

// Watch for tab changes to load data automatically
watch(activeTab, (newTab) => {
  if (selectedCampaign.value && newTab === 'recipients' && campaignRecipients.value.length === 0) {
    fetchCampaignRecipients(selectedCampaign.value.id)
  } else if (selectedCampaign.value && newTab === 'activity_log' && campaignAuditLogs.value.length === 0) {
    fetchCampaignAuditLogs(selectedCampaign.value.id)
  }
})

// Lifecycle
onMounted(async () => {
  loadFiltersFromURL()
  await Promise.all([
    loadCampaigns(),
    loadOwners(),
    loadTemplates(),
    loadOverallMetrics(),
    loadAutomations(),
    loadEmailTrends(),
    loadAutomationOptions()
  ])
})
</script>
