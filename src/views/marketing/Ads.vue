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
                <span class="ml-4 text-sm font-medium text-gray-900">{{ $t('marketing.ads.title') }}</span>
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
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('marketing.ads.title') }}</h1>
          <p class="mt-2 text-lg text-gray-600">{{ $t('marketing.ads.subtitle') }}</p>
        </div>
        <button
          @click="openConnectModal"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          {{ $t('marketing.ads.connected_accounts.connect_account') }}
        </button>
      </div>

      <!-- Connected Ad Accounts -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.ads.connected_accounts.title') }}</h3>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">{{ $t('marketing.ads.loading') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-12 text-center">
          <div class="text-red-600 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.ads.error') }}</h3>
          <button
            @click="loadAdAccounts"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {{ $t('common.marketing_overview.retry_button') }}
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="adAccounts.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.ads.connected_accounts.no_accounts') }}</h3>
          <p class="text-gray-600 mb-6">{{ $t('marketing.ads.connected_accounts.connect_first') }}</p>
          <button
            @click="openConnectModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.ads.connected_accounts.connect_account') }}
          </button>
        </div>

        <!-- Ad Accounts Grid -->
        <div v-else class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="account in adAccounts"
              :key="account.id"
              class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="getProviderIcon(account.provider)" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ account.provider_info?.name || account.provider }}</h4>
                    <p class="text-sm text-gray-500">{{ account.account_name }}</p>
                  </div>
                </div>
                <span :class="getStatusBadgeColor(account.is_active)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ $t(`marketing.ads.status.${account.is_active ? 'active' : 'inactive'}`) }}
                </span>
              </div>
              
              <div class="space-y-2 mb-4">
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Account ID:</span> {{ account.account_id }}
                </p>
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Budget:</span> {{ formatCurrency(account.budget, account.currency) }}/month
                </p>
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Connected:</span> {{ formatDate(account.connected_at) }}
                </p>
              </div>

              <!-- Actions -->
              <div class="flex space-x-2">
                <button
                  @click="editAccount(account)"
                  class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {{ $t('marketing.ads.account_actions.edit') }}
                </button>
                <button
                  @click="toggleAccountStatus(account)"
                  :class="account.is_active ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' : 'bg-green-100 hover:bg-green-200 text-green-700'"
                  class="flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {{ $t(`marketing.ads.account_actions.${account.is_active ? 'deactivate' : 'activate'}`) }}
                </button>
                <button
                  @click="deleteAccount(account)"
                  class="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {{ $t('marketing.ads.account_actions.delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ad Campaign Metrics -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.ads.metrics.title') }}</h3>
        </div>
        <div class="p-6">
          <!-- Campaign ID Input -->
          <div class="mb-6">
            <div class="flex space-x-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.ads.metrics.campaign_id') }}</label>
                <input
                  v-model="campaignId"
                  type="text"
                  :placeholder="$t('marketing.ads.metrics.enter_campaign_id')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="flex items-end">
                <button
                  @click="fetchMetrics"
                  :disabled="!campaignId || metricsLoading"
                  class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  {{ metricsLoading ? $t('marketing.ads.metrics.fetch_metrics') + '...' : $t('marketing.ads.metrics.fetch_metrics') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Metrics Display -->
          <div v-if="campaignMetrics" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-2xl font-bold text-gray-900">{{ formatNumber(campaignMetrics.impressions) }}</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.ads.metrics.impressions') }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-2xl font-bold text-gray-900">{{ formatNumber(campaignMetrics.clicks) }}</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.ads.metrics.clicks') }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-2xl font-bold text-gray-900">{{ formatPercentage(campaignMetrics.ctr) }}</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.ads.metrics.ctr') }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(campaignMetrics.cpc) }}</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.ads.metrics.cpc') }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(campaignMetrics.spend) }}</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.ads.metrics.spend') }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-2xl font-bold text-gray-900">{{ formatNumber(campaignMetrics.conversions) }}</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.ads.metrics.conversions') }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-2xl font-bold text-gray-900">{{ formatPercentage(campaignMetrics.conversion_rate) }}</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.ads.metrics.conversion_rate') }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-2xl font-bold text-gray-900">{{ campaignMetrics.roi }}x</div>
              <div class="text-sm text-gray-600">{{ $t('marketing.ads.metrics.roi') }}</div>
            </div>
          </div>

          <!-- No Metrics State -->
          <div v-else-if="!metricsLoading" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="text-gray-500">{{ $t('marketing.ads.metrics.no_metrics') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Ads Analytics Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.ads.analytics.title') }}</h3>
          <button
            @click="loadAdsAnalytics"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {{ $t('marketing.ads.analytics.refresh') }}
          </button>
        </div>
      </div>

      <div v-if="analyticsLoading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">{{ $t('marketing.ads.analytics.loading') }}</p>
      </div>

      <div v-else-if="adsAnalytics" class="p-6">
        <!-- Overall Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(adsAnalytics.total_spend) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.total_spend') }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatNumber(adsAnalytics.total_impressions) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.total_impressions') }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatNumber(adsAnalytics.total_clicks) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.total_clicks') }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatNumber(adsAnalytics.total_conversions) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.total_conversions') }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatPercentage(adsAnalytics.avg_ctr) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.avg_ctr') }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(adsAnalytics.avg_cpc) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.avg_cpc') }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatPercentage(adsAnalytics.avg_conversion_rate) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.avg_conversion_rate') }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatPercentage(adsAnalytics.avg_roi) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.avg_roi') }}</div>
          </div>
        </div>

        <!-- Top Performing Campaigns -->
        <div class="mb-8">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('marketing.ads.analytics.top_campaigns') }}</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.ads.analytics.campaign_name') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.ads.analytics.spend') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.ads.analytics.impressions') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.ads.analytics.clicks') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.ads.analytics.conversions') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.ads.analytics.ctr') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.ads.analytics.roi') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="campaign in adsAnalytics.top_performing_campaigns" :key="campaign.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ campaign.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatCurrency(campaign.spend) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatNumber(campaign.impressions) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatNumber(campaign.clicks) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatNumber(campaign.conversions) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatPercentage(campaign.ctr) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatPercentage(campaign.roi) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Performance by Provider -->
        <div class="mb-8">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('marketing.ads.analytics.performance_by_provider') }}</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="provider in adsAnalytics.performance_by_provider"
              :key="provider.provider"
              class="border border-gray-200 rounded-lg p-6"
            >
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="getProviderIcon(provider.provider)" />
                  </svg>
                </div>
                <h5 class="font-medium text-gray-900">{{ $t(`marketing.ads.providers.${provider.provider}`) }}</h5>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.spend') }}:</span>
                  <span class="text-sm font-medium">{{ formatCurrency(provider.spend) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.impressions') }}:</span>
                  <span class="text-sm font-medium">{{ formatNumber(provider.impressions) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.clicks') }}:</span>
                  <span class="text-sm font-medium">{{ formatNumber(provider.clicks) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.conversions') }}:</span>
                  <span class="text-sm font-medium">{{ formatNumber(provider.conversions) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.ctr') }}:</span>
                  <span class="text-sm font-medium">{{ formatPercentage(provider.ctr) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.roi') }}:</span>
                  <span class="text-sm font-medium">{{ formatPercentage(provider.roi) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Trends Chart Placeholder -->
        <div class="bg-gray-50 p-8 rounded-lg text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h4 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.ads.analytics.trends_chart') }}</h4>
          <p class="text-gray-600">{{ $t('marketing.ads.analytics.trends_description') }}</p>
        </div>
      </div>

      <div v-else class="p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h4 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.ads.analytics.no_data') }}</h4>
        <p class="text-gray-600 mb-6">{{ $t('marketing.ads.analytics.no_data_description') }}</p>
        <button
          @click="loadAdsAnalytics"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          {{ $t('marketing.ads.analytics.load_data') }}
        </button>
      </div>
    </div>

    <!-- Connect Account Modal -->
    <div
      v-if="showConnectModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeConnectModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.ads.connect_modal.title') }}</h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="connectAccount">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.ads.connect_modal.provider') }}</label>
                  <select
                    v-model="connectForm.provider"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{{ $t('marketing.ads.connect_modal.select_provider') }}</option>
                    <option v-for="provider in providers" :key="provider.id" :value="provider.id">
                      {{ provider.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.ads.connect_modal.account_name') }}</label>
                  <input
                    v-model="connectForm.account_name"
                    type="text"
                    required
                    :placeholder="$t('marketing.ads.connect_modal.enter_account_name')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.ads.connect_modal.account_id') }}</label>
                  <input
                    v-model="connectForm.account_id"
                    type="text"
                    required
                    :placeholder="$t('marketing.ads.connect_modal.enter_account_id')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.ads.connect_modal.budget') }}</label>
                  <input
                    v-model="connectForm.budget"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    :placeholder="$t('marketing.ads.connect_modal.enter_budget')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.ads.connect_modal.currency') }}</label>
                  <select
                    v-model="connectForm.currency"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>
              </div>
              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  @click="closeConnectModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {{ $t('marketing.ads.connect_modal.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="connecting"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
                >
                  {{ connecting ? $t('marketing.ads.connect_modal.connecting') : $t('marketing.ads.connect_modal.connect') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeConfirmModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ confirmModal.title }}</h3>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-6">{{ confirmModal.message }}</p>
            <div class="flex justify-end space-x-3">
              <button
                @click="closeConfirmModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {{ $t('marketing.ads.confirmations.cancel') }}
              </button>
              <button
                @click="confirmAction"
                :class="confirmModal.action === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'"
                class="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
              >
                {{ $t('marketing.ads.confirmations.confirm') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { adsService, adsHelpers } from '@/services/ads'
import { error as showError, success as showSuccess } from '@/utils/notifications'

const { t } = useI18n()

// Reactive state
const loading = ref(false)
const error = ref(null)
const adAccounts = ref([])
const providers = ref([])
const campaignId = ref('')
const campaignMetrics = ref(null)
const metricsLoading = ref(false)
const adsAnalytics = ref(null)
const analyticsLoading = ref(false)

// Modal states
const showConnectModal = ref(false)
const showConfirmModal = ref(false)
const connecting = ref(false)

// Forms
const connectForm = ref({
  provider: '',
  account_name: '',
  account_id: '',
  budget: '',
  currency: 'USD'
})

// Confirmation modal
const confirmModal = ref({
  title: '',
  message: '',
  action: '',
  account: null
})

// Methods
const loadAdAccounts = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await adsService.getAdAccounts()
    adAccounts.value = response.data || []
  } catch (err) {
    error.value = err.message || 'Failed to load ad accounts'
    showError(error.value)
  } finally {
    loading.value = false
  }
}

const loadProviders = async () => {
  try {
    const response = await adsService.getAdAccountProviders()
    providers.value = response.data || []
  } catch (err) {
    console.error('Failed to load providers:', err)
  }
}

const openConnectModal = () => {
  showConnectModal.value = true
  connectForm.value = {
    provider: '',
    account_name: '',
    account_id: '',
    budget: '',
    currency: 'USD'
  }
}

const closeConnectModal = () => {
  showConnectModal.value = false
  connecting.value = false
}

const connectAccount = async () => {
  connecting.value = true
  
  try {
    await adsService.createAdAccount(connectForm.value)
    showSuccess('Ad account connected successfully')
    closeConnectModal()
    loadAdAccounts()
  } catch (err) {
    showError(err.message || 'Failed to connect ad account')
  } finally {
    connecting.value = false
  }
}

const editAccount = (account) => {
  // For now, just show a simple edit modal
  // In a real implementation, you'd have a proper edit form
  showSuccess(`Edit functionality for ${account.account_name} - Coming soon`)
}

const toggleAccountStatus = (account) => {
  confirmModal.value = {
    title: account.is_active ? t('marketing.ads.confirmations.deactivate_title') : 'Activate Account',
    message: account.is_active 
      ? t('marketing.ads.confirmations.deactivate_message')
      : 'Are you sure you want to activate this ad account?',
    action: account.is_active ? 'deactivate' : 'activate',
    account: account
  }
  showConfirmModal.value = true
}

const deleteAccount = (account) => {
  confirmModal.value = {
    title: t('marketing.ads.confirmations.delete_title'),
    message: t('marketing.ads.confirmations.delete_message'),
    action: 'delete',
    account: account
  }
  showConfirmModal.value = true
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  confirmModal.value = {
    title: '',
    message: '',
    action: '',
    account: null
  }
}

const confirmAction = async () => {
  const { action, account } = confirmModal.value
  
  try {
    if (action === 'delete') {
      await adsService.deleteAdAccount(account.id)
      showSuccess('Ad account deleted successfully')
    } else if (action === 'deactivate') {
      await adsService.updateAdAccount(account.id, { is_active: false })
      showSuccess('Ad account deactivated successfully')
    } else if (action === 'activate') {
      await adsService.updateAdAccount(account.id, { is_active: true })
      showSuccess('Ad account activated successfully')
    }
    
    closeConfirmModal()
    loadAdAccounts()
  } catch (err) {
    showError(err.message || `Failed to ${action} ad account`)
  }
}

const fetchMetrics = async () => {
  if (!campaignId.value) return
  
  metricsLoading.value = true
  campaignMetrics.value = null
  
  try {
    const response = await adsService.getAdCampaignMetrics(campaignId.value)
    campaignMetrics.value = response.data
  } catch (err) {
    showError(err.message || 'Failed to fetch campaign metrics')
  } finally {
    metricsLoading.value = false
  }
}

const loadAdsAnalytics = async () => {
  analyticsLoading.value = true
  adsAnalytics.value = null
  
  try {
    const response = await adsService.getAdsAnalytics()
    adsAnalytics.value = response.data
  } catch (err) {
    showError(err.message || 'Failed to fetch ads analytics')
  } finally {
    analyticsLoading.value = false
  }
}

// Helper methods
const getProviderIcon = (providerId) => adsHelpers.getProviderIcon(providerId)
const getStatusBadgeColor = (isActive) => adsHelpers.getStatusBadgeColor(isActive)
const formatCurrency = (amount, currency) => adsHelpers.formatCurrency(amount, currency)
const formatNumber = (num) => adsHelpers.formatNumber(num)
const formatPercentage = (num) => adsHelpers.formatPercentage(num)
const formatDate = (dateString) => adsHelpers.formatDate(dateString)

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadAdAccounts(),
    loadProviders(),
    loadAdsAnalytics()
  ])
})
</script>
