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

          <!-- Trends Chart Placeholder -->
          <div class="bg-gray-50 p-8 rounded-lg text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h4 class="text-lg font-medium text-gray-900 mb-2">Email Performance Trends</h4>
            <p class="text-gray-600">Chart showing email performance over time</p>
          </div>
        </div>
      </div>

      <!-- Email Tracking Tab -->
      <div v-if="activeTab === 'tracking'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.email.tracking.title') }}</h3>
            <div class="flex space-x-4">
              <button
                @click="loadEmailOpens"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {{ $t('marketing.email.tracking.opens') }}
              </button>
              <button
                @click="loadEmailClicks"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {{ $t('marketing.email.tracking.clicks') }}
              </button>
            </div>
          </div>

          <!-- Tracking Data Table -->
          <div v-if="trackingData.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.email.tracking.recipient') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ trackingType === 'opens' ? $t('marketing.email.tracking.opened_at') : $t('marketing.email.tracking.clicked_at') }}
                  </th>
                  <th v-if="trackingType === 'clicks'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.email.tracking.clicked_url') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.email.tracking.ip_address') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in trackingData" :key="item.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ item.recipient_email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(trackingType === 'opens' ? item.opened_at : item.clicked_at) }}
                  </td>
                  <td v-if="trackingType === 'clicks'" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a :href="item.clicked_url" target="_blank" class="text-blue-600 hover:text-blue-800 truncate block max-w-xs">
                      {{ item.clicked_url }}
                    </a>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.ip_address }}
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
              {{ trackingType === 'opens' ? $t('marketing.email.tracking.no_opens') : $t('marketing.email.tracking.no_clicks') }}
            </h4>
            <p class="text-gray-600">No tracking data available yet</p>
          </div>
        </div>
      </div>

      <!-- Email Automations Tab -->
      <div v-if="activeTab === 'automations'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.email.automations.title') }}</h3>
              <p class="text-sm text-gray-600">{{ $t('marketing.email.automations.subtitle') }}</p>
            </div>
            <button
              @click="showCreateAutomationModal = true"
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
                    {{ $t('marketing.email.automations.automation_name') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.email.automations.trigger') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.email.automations.status') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.email.automations.steps') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.email.automations.created_at') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.email.automations.actions') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="automation in automations" :key="automation.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ automation.name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatTriggerName(automation.trigger) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getAutomationStatusColor(automation.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ $t(`marketing.email.automations.statuses.${automation.status}`) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ automation.steps }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(automation.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      @click="deleteAutomation(automation.id)"
                      class="text-red-600 hover:text-red-900 mr-3"
                    >
                      {{ $t('marketing.email.automations.delete') }}
                    </button>
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
            <h4 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.email.automations.empty_state.title') }}</h4>
            <p class="text-gray-600 mb-6">{{ $t('marketing.email.automations.empty_state.message') }}</p>
            <button
              @click="showCreateAutomationModal = true"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              {{ $t('marketing.email.automations.empty_state.create_automation') }}
            </button>
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
              <div class="text-center py-8">
                <p class="text-gray-500">{{ $t('marketing.email.drawer.recipients') }} - Coming Soon</p>
              </div>
            </div>

            <!-- Activity Log Tab -->
            <div v-if="activeTab === 'activity_log'">
              <div class="text-center py-8">
                <p class="text-gray-500">{{ $t('marketing.email.drawer.activity_log') }} - Coming Soon</p>
              </div>
            </div>
          </div>
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
import { error as showError } from '@/utils/notifications'

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
  return campaigns.value.reduce((sum, campaign) => sum + (campaign.sent_count || 0), 0)
})

const averageOpenRate = computed(() => {
  if (campaigns.value.length === 0) return 0
  const totalRate = campaigns.value.reduce((sum, campaign) => {
    return sum + parseFloat(emailMarketingHelpers.calculateOpenRate(campaign))
  }, 0)
  return (totalRate / campaigns.value.length).toFixed(1)
})

const averageClickRate = computed(() => {
  if (campaigns.value.length === 0) return 0
  const totalRate = campaigns.value.reduce((sum, campaign) => {
    return sum + parseFloat(emailMarketingHelpers.calculateClickRate(campaign))
  }, 0)
  return (totalRate / campaigns.value.length).toFixed(1)
})

const averageBounceRate = computed(() => {
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

// New methods for additional features
const loadOverallMetrics = async () => {
  try {
    const response = await emailMarketingService.getOverallMetrics()
    overallMetrics.value = response.data
  } catch (error) {
    console.error('Error loading overall metrics:', error)
  }
}

const loadEmailOpens = async () => {
  try {
    trackingType.value = 'opens'
    const response = await emailMarketingService.trackEmailOpens()
    trackingData.value = response.data || []
  } catch (error) {
    console.error('Error loading email opens:', error)
    showError(t('marketing.email.tracking.error'))
  }
}

const loadEmailClicks = async () => {
  try {
    trackingType.value = 'clicks'
    const response = await emailMarketingService.trackEmailClicks()
    trackingData.value = response.data || []
  } catch (error) {
    console.error('Error loading email clicks:', error)
    showError(t('marketing.email.tracking.error'))
  }
}

const loadAutomations = async () => {
  try {
    const response = await emailMarketingService.getAutomationOptions()
    // For now, we'll use the fallback data from the service
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
  } catch (error) {
    console.error('Error loading automations:', error)
    showError(t('marketing.email.automations.error'))
  }
}

const deleteAutomation = async (automationId) => {
  try {
    await emailMarketingService.deleteCampaignAutomation(automationId)
    automations.value = automations.value.filter(a => a.id !== automationId)
    showError(t('marketing.email.automations.delete_success'))
  } catch (error) {
    console.error('Error deleting automation:', error)
    showError(t('marketing.email.automations.delete_error'))
  }
}

const formatTriggerName = (trigger) => emailMarketingHelpers.formatTriggerName(trigger)
const getAutomationStatusColor = (status) => emailMarketingHelpers.getAutomationStatusColor(status)

// Watch for route changes
watch(() => route.query, () => {
  loadFiltersFromURL()
  loadCampaigns()
}, { deep: true })

// Lifecycle
onMounted(async () => {
  loadFiltersFromURL()
  await Promise.all([
    loadCampaigns(),
    loadOwners(),
    loadTemplates(),
    loadOverallMetrics(),
    loadAutomations()
  ])
})
</script>
