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
                  <span class="font-medium">Currency:</span> {{ account.settings?.currency || 'USD' }}
                </p>
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Timezone:</span> {{ account.settings?.timezone || 'UTC' }}
                </p>
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Connected:</span> {{ formatDate(account.created_at) }}
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

      <!-- Create Ad Campaign -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.ads.create_campaign.title') }}</h3>
            <button
              @click="openCreateCampaignModal"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {{ $t('marketing.ads.create_campaign.create_campaign') }}
            </button>
          </div>
        </div>
        <div class="p-6">
          <p class="text-gray-600">{{ $t('marketing.ads.create_campaign.description') }}</p>
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
            <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(adsAnalytics.spent || 0) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.total_spend') }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatNumber(adsAnalytics.impressions || 0) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.total_impressions') }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatNumber(adsAnalytics.clicks || 0) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.total_clicks') }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatNumber(adsAnalytics.conversions || 0) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.total_conversions') }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatPercentage(adsAnalytics.ctr || 0) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.avg_ctr') }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(adsAnalytics.cpc || 0) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.avg_cpc') }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatPercentage(adsAnalytics.conversion_rate || 0) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.avg_conversion_rate') }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(adsAnalytics.cpa || 0) }}</div>
            <div class="text-sm text-gray-600">{{ $t('marketing.ads.analytics.avg_cpa') }}</div>
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
                    <option v-for="provider in availableProviders" :key="provider.id" :value="provider.id">
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
                    :placeholder="$t('marketing.ads.connect_modal.enter_account_id')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <!-- Credentials Section -->
                <div class="border-t pt-4">
                  <h4 class="text-sm font-medium text-gray-900 mb-3">{{ $t('marketing.ads.connect_modal.credentials') }}</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('marketing.ads.connect_modal.api_key') }}</label>
                      <input
                        v-model="connectForm.credentials.api_key"
                        type="text"
                        :placeholder="$t('marketing.ads.connect_modal.enter_api_key')"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('marketing.ads.connect_modal.client_id') }}</label>
                      <input
                        v-model="connectForm.credentials.client_id"
                        type="text"
                        :placeholder="$t('marketing.ads.connect_modal.enter_client_id')"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('marketing.ads.connect_modal.refresh_token') }}</label>
                      <input
                        v-model="connectForm.credentials.refresh_token"
                        type="text"
                        :placeholder="$t('marketing.ads.connect_modal.enter_refresh_token')"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('marketing.ads.connect_modal.client_secret') }}</label>
                      <input
                        v-model="connectForm.credentials.client_secret"
                        type="password"
                        :placeholder="$t('marketing.ads.connect_modal.enter_client_secret')"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <!-- Settings Section -->
                <div class="border-t pt-4">
                  <h4 class="text-sm font-medium text-gray-900 mb-3">{{ $t('marketing.ads.connect_modal.settings') }}</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('marketing.ads.connect_modal.timezone') }}</label>
                      <select
                        v-model="connectForm.settings.timezone"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="America/New_York">America/New_York</option>
                        <option value="America/Los_Angeles">America/Los_Angeles</option>
                        <option value="America/Chicago">America/Chicago</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="Europe/Paris">Europe/Paris</option>
                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('marketing.ads.connect_modal.currency') }}</label>
                      <select
                        v-model="connectForm.settings.currency"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                        <option value="JPY">JPY</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('marketing.ads.connect_modal.language') }}</label>
                      <select
                        v-model="connectForm.settings.language"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                        <option value="pt">Portuguese</option>
                      </select>
                    </div>
                  </div>
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

    <!-- OAuth Connect Account Modal -->
    <div
      v-if="showOAuthConnectModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeOAuthConnectModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.ads.oauth.title') }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ $t('marketing.ads.oauth.select_provider') }}</p>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- Facebook Ads Provider -->
              <div class="border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-blue-300 hover:scale-[1.02] shadow-sm">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-4 shadow-lg">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">{{ $t('marketing.ads.oauth.facebook.name') }}</h4>
                    <p class="text-sm text-gray-600">OAuth Integration</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mb-6">{{ $t('marketing.ads.oauth.facebook.description') }}</p>
                <button
                  @click="connectAdAccount('facebook')"
                  :disabled="oauthConnecting"
                  class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] disabled:transform-none"
                >
                  <svg v-if="oauthConnecting && selectedProvider === 'facebook'" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-if="!oauthConnecting || selectedProvider !== 'facebook'" class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    {{ $t('marketing.ads.oauth.facebook.connect_button') }}
                  </span>
                  <span v-else class="flex items-center">
                    {{ $t('marketing.ads.oauth.facebook.connecting') }}
                  </span>
                </button>
              </div>

              <!-- Google Ads Provider -->
              <div class="border-2 border-red-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-red-50 to-orange-50 hover:border-red-300 hover:scale-[1.02] shadow-sm">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center mr-4 shadow-lg">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">{{ $t('marketing.ads.oauth.google.name') }}</h4>
                    <p class="text-sm text-gray-600">OAuth Integration</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mb-6">{{ $t('marketing.ads.oauth.google.description') }}</p>
                <button
                  @click="connectAdAccount('google')"
                  :disabled="oauthConnecting"
                  class="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] disabled:transform-none"
                >
                  <svg v-if="oauthConnecting && selectedProvider === 'google'" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-if="!oauthConnecting || selectedProvider !== 'google'" class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    {{ $t('marketing.ads.oauth.google.connect_button') }}
                  </span>
                  <span v-else class="flex items-center">
                    {{ $t('marketing.ads.oauth.google.connecting') }}
                  </span>
                </button>
              </div>

              <!-- LinkedIn Ads Provider -->
              <div class="border border-gray-200 rounded-lg p-6 opacity-60">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ $t('marketing.ads.oauth.linkedin.name') }}</h4>
                    <p class="text-sm text-gray-500">OAuth Integration</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mb-4">{{ $t('marketing.ads.oauth.linkedin.description') }}</p>
                <button
                  disabled
                  class="w-full bg-gray-300 text-gray-500 px-4 py-2 rounded-md font-medium cursor-not-allowed"
                >
                  {{ $t('marketing.ads.oauth.linkedin.disabled_message') }}
                </button>
              </div>

              <!-- Instagram Ads Provider -->
              <div class="border border-gray-200 rounded-lg p-6 opacity-60">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ $t('marketing.ads.oauth.instagram.name') }}</h4>
                    <p class="text-sm text-gray-500">OAuth Integration</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mb-4">{{ $t('marketing.ads.oauth.instagram.description') }}</p>
                <button
                  disabled
                  class="w-full bg-gray-300 text-gray-500 px-4 py-2 rounded-md font-medium cursor-not-allowed"
                >
                  {{ $t('marketing.ads.oauth.instagram.disabled_message') }}
                </button>
              </div>
            </div>

            <!-- Alternative Connection Method -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="text-center">
                <p class="text-sm text-gray-600 mb-3">Need to connect with API credentials instead?</p>
                <button
                  @click="openCredentialsConnectModal"
                  class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Use Manual Credentials
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-3 mt-6">
              <button
                @click="closeOAuthConnectModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {{ $t('marketing.ads.oauth.oauth_flow.close') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Campaign Modal -->
    <div
      v-if="showCreateCampaignModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeCreateCampaignModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.ads.create_campaign.title') }}</h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="createCampaign">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.ads.create_campaign.campaign_id') }}</label>
                  <input
                    v-model="createCampaignForm.campaign_id"
                    type="text"
                    required
                    placeholder="Enter campaign ID"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.ads.create_campaign.ad_account') }}</label>
                  <select
                    v-model="createCampaignForm.ad_account_id"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{{ $t('marketing.ads.create_campaign.select_account') }}</option>
                    <option v-for="account in adAccounts" :key="account.id" :value="account.id">
                      {{ account.account_name }} ({{ account.provider }})
                    </option>
                    <option v-if="adAccounts.length === 0" value="" disabled>
                      No connected accounts. Please connect an ad account first.
                    </option>
                  </select>
                </div>
                
                <!-- Ad Settings Section -->
                <div class="border-t pt-4">
                  <h4 class="text-sm font-medium text-gray-900 mb-3">{{ $t('marketing.ads.create_campaign.ad_settings') }}</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('marketing.ads.create_campaign.budget') }}</label>
                      <input
                        v-model="createCampaignForm.ad_settings.budget"
                        type="number"
                        required
                        min="1"
                        placeholder="Enter budget amount"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('marketing.ads.create_campaign.duration_days') }}</label>
                      <input
                        v-model="createCampaignForm.ad_settings.duration_days"
                        type="number"
                        required
                        min="1"
                        max="365"
                        placeholder="Enter duration in days"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <!-- Targeting Section -->
                <div class="border-t pt-4">
                  <h4 class="text-sm font-medium text-gray-900 mb-3">{{ $t('marketing.ads.create_campaign.targeting') }}</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('marketing.ads.create_campaign.age_range') }}</label>
                      <select
                        v-model="createCampaignForm.ad_settings.targeting.age_range"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select age range</option>
                        <option value="18-24">18-24</option>
                        <option value="25-34">25-34</option>
                        <option value="35-44">35-44</option>
                        <option value="45-54">45-54</option>
                        <option value="55-64">55-64</option>
                        <option value="65+">65+</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('marketing.ads.create_campaign.location') }}</label>
                      <input
                        v-model="createCampaignForm.ad_settings.targeting.location"
                        type="text"
                        placeholder="Enter location"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('marketing.ads.create_campaign.gender') }}</label>
                      <select
                        v-model="createCampaignForm.ad_settings.targeting.demographics.gender"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  @click="closeCreateCampaignModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {{ $t('marketing.ads.create_campaign.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="creatingCampaign"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
                >
                  {{ creatingCampaign ? $t('marketing.ads.create_campaign.creating') : $t('marketing.ads.create_campaign.create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { adsService, adsHelpers } from '@/services/ads'
import { error as showError, success as showSuccess } from '@/utils/notifications'

const { t } = useI18n()

// Fallback providers
const fallbackProviders = [
  {
    id: 'google',
    name: 'Google Ads',
    icon: 'google'
  },
  {
    id: 'facebook',
    name: 'Facebook Ads',
    icon: 'facebook'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Ads',
    icon: 'linkedin'
  },
  {
    id: 'twitter',
    name: 'Twitter Ads',
    icon: 'twitter'
  },
  {
    id: 'instagram',
    name: 'Instagram Ads',
    icon: 'instagram'
  }
]

// Reactive state
const loading = ref(false)
const error = ref(null)
const adAccounts = ref([])
const providers = ref([])

// Computed property to ensure providers are always available
const availableProviders = computed(() => {
  return providers.value.length > 0 ? providers.value : fallbackProviders
})
const campaignId = ref('')
const campaignMetrics = ref(null)
const metricsLoading = ref(false)
const adsAnalytics = ref(null)
const analyticsLoading = ref(false)

// Modal states
const showConnectModal = ref(false)
const showOAuthConnectModal = ref(false)
const showConfirmModal = ref(false)
const showCreateCampaignModal = ref(false)
const connecting = ref(false)
const creatingCampaign = ref(false)
const oauthConnecting = ref(false)
const selectedProvider = ref('')

// Forms
const connectForm = ref({
  provider: '',
  account_name: '',
  account_id: '',
  credentials: {
    api_key: '',
    client_id: '',
    refresh_token: '',
    client_secret: ''
  },
  settings: {
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en'
  }
})

// Create Campaign Form
const createCampaignForm = ref({
  campaign_id: '',
  ad_account_id: '',
  ad_settings: {
    budget: '',
    duration_days: 30,
    targeting: {
      age_range: '',
      interests: [],
      location: '',
      demographics: {
        gender: 'all',
        income: ''
      },
      devices: ['mobile', 'desktop']
    }
  }
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
    console.log('Loaded providers:', providers.value) // Debug log
  } catch (err) {
    console.error('Failed to load providers:', err)
    // Providers will fall back to fallbackProviders via computed property
    providers.value = []
  }
}

const openConnectModal = () => {
  // Show OAuth modal first for Facebook, fallback to credentials for others
  showOAuthConnectModal.value = true
}

const openOAuthConnectModal = () => {
  showOAuthConnectModal.value = true
  selectedProvider.value = ''
}

const closeOAuthConnectModal = () => {
  showOAuthConnectModal.value = false
  selectedProvider.value = ''
  oauthConnecting.value = false
}

const openCredentialsConnectModal = () => {
  showConnectModal.value = true
  connectForm.value = {
    provider: '',
    account_name: '',
    account_id: '',
    credentials: {
      api_key: '',
      client_id: '',
      refresh_token: '',
      client_secret: ''
    },
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      language: 'en'
    }
  }
}

const closeConnectModal = () => {
  showConnectModal.value = false
  connecting.value = false
}

const openCreateCampaignModal = () => {
  showCreateCampaignModal.value = true
  createCampaignForm.value = {
    campaign_id: '',
    ad_account_id: '',
    ad_settings: {
      budget: '',
      duration_days: 30,
      targeting: {
        age_range: '',
        interests: [],
        location: '',
        demographics: {
          gender: 'all',
          income: ''
        },
        devices: ['mobile', 'desktop']
      }
    }
  }
}

const closeCreateCampaignModal = () => {
  showCreateCampaignModal.value = false
  creatingCampaign.value = false
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

const createCampaign = async () => {
  creatingCampaign.value = true
  
  try {
    await adsService.createAdCampaignSettings(createCampaignForm.value.campaign_id, createCampaignForm.value)
    showSuccess('Ad campaign created successfully')
    closeCreateCampaignModal()
    loadAdsAnalytics()
  } catch (err) {
    showError(err.message || 'Failed to create ad campaign')
  } finally {
    creatingCampaign.value = false
  }
}

const connectAdAccount = async (provider) => {
  selectedProvider.value = provider
  
  if (provider === 'facebook') {
    try {
      await connectFacebookAccount()
    } catch (error) {
      console.error('Failed to connect Facebook account:', error)
      // Error handling is done in connectFacebookAccount
    }
  } else if (provider === 'google') {
    try {
      await connectGoogleAccount()
    } catch (error) {
      console.error('Failed to connect Google account:', error)
      // Error handling is done in connectGoogleAccount
    }
  } else {
    // For other providers, show coming soon message
    showError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} Ads integration is coming soon!`)
  }
}

const connectFacebookAccount = async () => {
  oauthConnecting.value = true
  
  try {
    // Show redirecting toast immediately
    showSuccess(t('marketing.ads.oauth.facebook.redirecting_toast'))
    
    // Use the existing API service which handles authentication properly
    const response = await adsService.getFacebookOAuthRedirect()
    
    console.log('Facebook OAuth response:', response)
    
    // Check if we have a valid auth_url
    if (response.auth_url) {
      // Check if the URL appears to be truncated (common issue with backend responses)
      if (response.auth_url.length < 50 || !response.auth_url.startsWith('http')) {
        throw new Error('Facebook login failed. Please try again.')
      }
      
      // Validate that the auth_url looks like a proper Facebook URL
      if (response.auth_url.includes('facebook.com') || response.auth_url.includes('fb.com')) {
        // Small delay to show the toast before redirect
        setTimeout(() => {
          window.location.href = response.auth_url
        }, 1000)
        return // Don't set oauthConnecting to false since we're redirecting
      } else {
        throw new Error('Facebook login failed. Please try again.')
      }
    } else {
      // No auth_url provided
      throw new Error('Facebook login failed. Please try again.')
    }
  } catch (err) {
    console.error('Facebook OAuth error:', err)
    
    // Show user-friendly error message
    let errorMessage = 'Facebook login failed. Please try again.'
    
    // Provide more specific error messages based on error type
    if (err.response?.status === 401) {
      errorMessage = 'Authentication failed. Please check your permissions.'
    } else if (err.response?.status === 403) {
      errorMessage = 'Access denied. Please check your Facebook Ads permissions.'
    } else if (err.response?.status >= 500) {
      errorMessage = 'Server error. Please try again later.'
    } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      errorMessage = 'Connection timeout. Please check your internet connection and try again.'
    }
    
    showError(errorMessage)
    oauthConnecting.value = false
  }
}

const connectGoogleAccount = async () => {
  oauthConnecting.value = true
  
  try {
    // Show redirecting toast immediately
    showSuccess(t('marketing.ads.oauth.google.redirecting_toast'))
    
    // Use the existing API service which handles authentication properly
    const response = await adsService.getGoogleOAuthRedirect()
    
    console.log('Google OAuth response:', response)
    
    if (response && response.auth_url) {
      // Validate the URL before redirecting
      if (response.auth_url.includes('google.com') || response.auth_url.includes('accounts.google.com')) {
        window.location.href = response.auth_url
      } else {
        throw new Error('Invalid Google OAuth URL received')
      }
    } else {
      throw new Error('No redirect URL received from server')
    }
    
    return // Don't set oauthConnecting to false since we're redirecting
    
  } catch (err) {
    console.error('Google OAuth error:', err)
    showError('Google login failed. Please try again.')
    oauthConnecting.value = false
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

// Handle OAuth success (called from callback or after successful connection)
const handleOAuthSuccess = async () => {
  try {
    // Refresh the accounts list
    await loadAdAccounts()
    // Refresh analytics
    await loadAdsAnalytics()
    showSuccess('Account connected successfully!')
  } catch (err) {
    console.error('Error refreshing data after OAuth:', err)
  }
}

// Handle OAuth success/error from URL parameters
const handleOAuthResult = () => {
  const urlParams = new URLSearchParams(window.location.search)
  
  // Check for Google OAuth result
  const googleOAuthStatus = urlParams.get('google_oauth')
  if (googleOAuthStatus) {
    const userName = urlParams.get('user_name')
    const accountsCount = urlParams.get('accounts_count')
    
    if (googleOAuthStatus === 'success') {
      showSuccess(`✅ Google Ads connected for ${userName || 'your account'} with ${accountsCount || '0'} accounts.`)
      // Refresh the accounts list
      loadAdAccounts()
      loadAdsAnalytics()
    } else if (googleOAuthStatus === 'error') {
      showError('❌ Google Ads connection failed. Please try again.')
    }
    
    // Clean up URL parameters
    const newUrl = window.location.pathname
    window.history.replaceState({}, document.title, newUrl)
  }
  
  // Check for Facebook OAuth result (existing functionality)
  const facebookOAuthStatus = urlParams.get('facebook_oauth')
  if (facebookOAuthStatus) {
    const userName = urlParams.get('user_name')
    const accountsCount = urlParams.get('accounts_count')
    
    if (facebookOAuthStatus === 'success') {
      showSuccess(`✅ Facebook Ads connected for ${userName || 'your account'} with ${accountsCount || '0'} accounts.`)
      // Refresh the accounts list
      loadAdAccounts()
      loadAdsAnalytics()
    } else if (facebookOAuthStatus === 'error') {
      showError('❌ Facebook Ads connection failed. Please try again.')
    }
    
    // Clean up URL parameters
    const newUrl = window.location.pathname
    window.history.replaceState({}, document.title, newUrl)
  }
}

// Lifecycle
onMounted(async () => {
  // Handle OAuth results first
  handleOAuthResult()
  
  await Promise.all([
    loadAdAccounts(),
    loadProviders(),
    loadAdsAnalytics()
  ])
})
</script>
