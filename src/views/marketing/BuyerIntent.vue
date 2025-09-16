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
                <span class="ml-4 text-sm font-medium text-gray-900">{{ $t('marketing.buyer_intent.title') }}</span>
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
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('marketing.buyer_intent.title') }}</h1>
          <p class="mt-2 text-lg text-gray-600">{{ $t('marketing.buyer_intent.subtitle') }}</p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="refreshData"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.buyer_intent.actions.refresh_data') }}
          </button>
          <button
            @click="openTestEventModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.buyer_intent.actions.log_test_event') }}
          </button>
        </div>
      </div>

      <!-- Intent Distribution Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- High Intent -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.high_intent') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ analyticsData?.overview?.high_intent_count || 0 }}</p>
              <p class="text-sm text-green-600">+23% from last month</p>
            </div>
          </div>
        </div>

        <!-- Medium Intent -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.medium_intent') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ analyticsData?.overview?.medium_intent_count || 0 }}</p>
              <p class="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </div>

        <!-- Low Intent -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.low_intent') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ analyticsData?.overview?.low_intent_count || 0 }}</p>
              <p class="text-sm text-green-600">+8% from last month</p>
            </div>
          </div>
        </div>

        <!-- Total Events -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.total_events') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ analyticsData?.overview?.total_events || 0 }}</p>
              <p class="text-sm text-green-600">+15% from last month</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Buyer Intent Tracking Interface -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- Left Panel: Intent Data Table -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <!-- Filters -->
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.buyer_intent.filters.company') }}</label>
                  <select v-model="filters.company_id" @change="applyFilters" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">{{ $t('marketing.buyer_intent.filters.all_companies') }}</option>
                    <option v-for="company in uniqueCompanies" :key="company.id" :value="company.id">{{ company.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.buyer_intent.filters.contact') }}</label>
                  <select v-model="filters.contact_id" @change="applyFilters" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">{{ $t('marketing.buyer_intent.filters.all_contacts') }}</option>
                    <option v-for="contact in uniqueContacts" :key="contact.id" :value="contact.id">{{ contact.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.buyer_intent.filters.action') }}</label>
                  <select v-model="filters.action" @change="applyFilters" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">{{ $t('marketing.buyer_intent.filters.all_actions') }}</option>
                    <option v-for="action in trackingActions" :key="action.id" :value="action.id">{{ action.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.buyer_intent.filters.intent_level') }}</label>
                  <select v-model="filters.intent_level" @change="applyFilters" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">{{ $t('marketing.buyer_intent.filters.all_levels') }}</option>
                    <option v-for="level in intentLevels" :key="level.id" :value="level.id">{{ level.name }}</option>
                  </select>
                </div>
              </div>
              <div class="mt-4 flex justify-between items-center">
                <button @click="clearFilters" class="text-sm text-gray-600 hover:text-gray-800">{{ $t('marketing.buyer_intent.filters.clear_filters') }}</button>
                <button @click="openTestEventModal" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  {{ $t('marketing.buyer_intent.actions.log_test_event') }}
                </button>
              </div>
            </div>

            <!-- Intent Data Table -->
            <div v-if="loading" class="p-12 text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p class="mt-4 text-gray-600">{{ $t('marketing.buyer_intent.loading') }}</p>
            </div>

            <div v-else-if="error" class="p-12 text-center">
              <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.buyer_intent.error') }}</h4>
              <p class="text-gray-600 mb-6">{{ error }}</p>
              <button @click="loadIntentData" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                {{ $t('marketing.buyer_intent.actions.retry') }}
              </button>
            </div>

            <div v-else-if="intentData.length === 0" class="p-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.buyer_intent.empty_state.title') }}</h4>
              <p class="text-gray-600 mb-6">{{ $t('marketing.buyer_intent.empty_state.message') }}</p>
              <button @click="openTestEventModal" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                {{ $t('marketing.buyer_intent.empty_state.log_test_event') }}
              </button>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.when') }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.contact') }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.company') }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.page') }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.action') }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.score') }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.intent_level') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="item in intentData" :key="item.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatTimestamp(item.timestamp) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.contact?.name || 'Unknown' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.company?.name || 'Unknown' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ getPageTitle(item.page_url) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ getActionName(item.action) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="getScoreColor(item.score)">{{ item.score }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getIntentLevelColor(item.intent_level)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{ item.intent_level }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Panel: Intent Analytics -->
        <div class="space-y-6">
          <!-- Overview Cards -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('marketing.buyer_intent.analytics.overview.title') }}</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.total_events') }}</span>
                <span class="text-sm font-medium">{{ formatNumber(analyticsData?.overview?.total_events || 0) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.unique_contacts') }}</span>
                <span class="text-sm font-medium">{{ formatNumber(analyticsData?.overview?.unique_contacts || 0) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.unique_companies') }}</span>
                <span class="text-sm font-medium">{{ formatNumber(analyticsData?.overview?.unique_companies || 0) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.average_score') }}</span>
                <span class="text-sm font-medium">{{ analyticsData?.overview?.average_score || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Action Breakdown -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('marketing.buyer_intent.analytics.action_breakdown') }}</h3>
            <div class="space-y-3">
              <div v-for="action in analyticsData?.action_breakdown || []" :key="action.action" class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ getActionName(action.action) }}</span>
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium">{{ formatNumber(action.count) }}</span>
                  <span class="text-xs text-gray-500">({{ action.percentage }}%)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Pages -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('marketing.buyer_intent.analytics.top_pages') }}</h3>
            <div class="space-y-3">
              <div v-for="page in analyticsData?.top_pages || []" :key="page.page" class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ getPageTitle(page.page) }}</span>
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium">{{ formatNumber(page.views) }}</span>
                  <span class="text-xs text-gray-500">({{ page.intent_score }})</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Visitor Intent Analytics -->
          <div v-if="visitorIntentAnalytics" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('marketing.buyer_intent.analytics.visitor_intent.title') }}</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.visitor_intent.total_visitors') }}</span>
                <span class="text-sm font-medium">{{ formatNumber(visitorIntentAnalytics.summary?.total_visitors || 0) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.visitor_intent.conversion_rate') }}</span>
                <span class="text-sm font-medium">{{ visitorIntentAnalytics.summary?.conversion_rate || 0 }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.visitor_intent.avg_intent_score') }}</span>
                <span class="text-sm font-medium">{{ visitorIntentAnalytics.summary?.avg_intent_score || 0 }}</span>
              </div>
            </div>
            
            <!-- Intent Distribution -->
            <div class="mt-6">
              <h4 class="text-sm font-medium text-gray-900 mb-3">{{ $t('marketing.buyer_intent.analytics.visitor_intent.intent_distribution') }}</h4>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.visitor_intent.high_intent') }}</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium">{{ formatNumber(visitorIntentAnalytics.intent_distribution?.high?.count || 0) }}</span>
                    <span class="text-xs text-green-600">{{ visitorIntentAnalytics.intent_distribution?.high?.trend || '' }}</span>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.visitor_intent.medium_intent') }}</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium">{{ formatNumber(visitorIntentAnalytics.intent_distribution?.medium?.count || 0) }}</span>
                    <span class="text-xs text-green-600">{{ visitorIntentAnalytics.intent_distribution?.medium?.trend || '' }}</span>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.visitor_intent.low_intent') }}</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium">{{ formatNumber(visitorIntentAnalytics.intent_distribution?.low?.count || 0) }}</span>
                    <span class="text-xs text-red-600">{{ visitorIntentAnalytics.intent_distribution?.low?.trend || '' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Test Event Modal -->
    <div
      v-if="showTestEventModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeTestEventModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.buyer_intent.test_event_modal.title') }}</h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="logTestEvent">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.buyer_intent.test_event_modal.contact_name') }}</label>
                  <input
                    v-model="testEventForm.contact_name"
                    type="text"
                    required
                    :placeholder="$t('marketing.buyer_intent.test_event_modal.enter_contact_name')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.buyer_intent.test_event_modal.contact_email') }}</label>
                  <input
                    v-model="testEventForm.contact_email"
                    type="email"
                    required
                    :placeholder="$t('marketing.buyer_intent.test_event_modal.enter_contact_email')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.buyer_intent.test_event_modal.company_name') }}</label>
                  <input
                    v-model="testEventForm.company_name"
                    type="text"
                    required
                    :placeholder="$t('marketing.buyer_intent.test_event_modal.enter_company_name')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.buyer_intent.test_event_modal.page_url') }}</label>
                  <input
                    v-model="testEventForm.page_url"
                    type="text"
                    required
                    :placeholder="$t('marketing.buyer_intent.test_event_modal.enter_page_url')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.buyer_intent.test_event_modal.action') }}</label>
                  <select
                    v-model="testEventForm.action"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{{ $t('marketing.buyer_intent.test_event_modal.select_action') }}</option>
                    <option v-for="action in trackingActions" :key="action.id" :value="action.id">
                      {{ action.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.buyer_intent.test_event_modal.score') }}</label>
                  <input
                    v-model="testEventForm.score"
                    type="number"
                    min="0"
                    max="100"
                    required
                    :placeholder="$t('marketing.buyer_intent.test_event_modal.enter_score')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  @click="closeTestEventModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {{ $t('marketing.buyer_intent.test_event_modal.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="loggingTestEvent"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
                >
                  {{ loggingTestEvent ? $t('marketing.buyer_intent.test_event_modal.logging') : $t('marketing.buyer_intent.test_event_modal.log_event') }}
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
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { buyerIntentService, buyerIntentHelpers } from '@/services/buyerIntent'
import { error as showError, success as showSuccess } from '@/utils/notifications'

const { t } = useI18n()

// Reactive state
const loading = ref(false)
const error = ref(null)
const intentData = ref([])
const analyticsData = ref(null)
const visitorIntentAnalytics = ref(null)
const trackingActions = ref([])
const intentLevels = ref([])

// Modal states
const showTestEventModal = ref(false)
const loggingTestEvent = ref(false)

// Filters
const filters = ref({
  company_id: '',
  contact_id: '',
  page_url: '',
  action: '',
  intent_level: '',
  min_score: '',
  max_score: '',
  date_from: '',
  date_to: ''
})

// Pagination
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 1,
  to: 15
})

// Test event form
const testEventForm = ref({
  contact_name: '',
  contact_email: '',
  company_name: '',
  page_url: '',
  action: '',
  score: ''
})

// Computed properties
const uniqueCompanies = computed(() => {
  const companies = new Map()
  intentData.value.forEach(item => {
    if (item.company && !companies.has(item.company.id)) {
      companies.set(item.company.id, item.company)
    }
  })
  return Array.from(companies.values())
})

const uniqueContacts = computed(() => {
  const contacts = new Map()
  intentData.value.forEach(item => {
    if (item.contact && !contacts.has(item.contact.id)) {
      contacts.set(item.contact.id, item.contact)
    }
  })
  return Array.from(contacts.values())
})

// Methods
const loadIntentData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const params = {
      page: pagination.value.current_page,
      per_page: pagination.value.per_page,
      sort_by: 'score',
      sort_order: 'desc',
      ...filters.value
    }
    
    // Remove empty filter values
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })
    
    const response = await buyerIntentService.getIntentTracking(params)
    intentData.value = response.data || []
    pagination.value = response.meta || pagination.value
  } catch (err) {
    error.value = err.message || 'Failed to load intent data'
    showError(error.value)
  } finally {
    loading.value = false
  }
}

const loadAnalytics = async () => {
  try {
    const params = {}
    if (filters.value.date_from) params.date_from = filters.value.date_from
    if (filters.value.date_to) params.date_to = filters.value.date_to
    
    const response = await buyerIntentService.getTrackingAnalytics(params)
    analyticsData.value = response.data
  } catch (err) {
    console.error('Failed to load analytics:', err)
  }
}

const loadVisitorIntentAnalytics = async () => {
  try {
    const params = {}
    if (filters.value.date_from) params.date_from = filters.value.date_from
    if (filters.value.date_to) params.date_to = filters.value.date_to
    
    const response = await buyerIntentService.getVisitorIntentAnalytics(params)
    visitorIntentAnalytics.value = response.data
  } catch (err) {
    console.error('Failed to load visitor intent analytics:', err)
  }
}

const loadTrackingActions = async () => {
  try {
    const response = await buyerIntentService.getTrackingActions()
    trackingActions.value = response.data || []
  } catch (err) {
    console.error('Failed to load tracking actions:', err)
  }
}

const loadIntentLevels = async () => {
  try {
    const response = await buyerIntentService.getIntentLevels()
    intentLevels.value = response.data || []
  } catch (err) {
    console.error('Failed to load intent levels:', err)
  }
}

const applyFilters = () => {
  pagination.value.current_page = 1
  loadIntentData()
  loadAnalytics()
  loadVisitorIntentAnalytics()
}

const clearFilters = () => {
  filters.value = {
    company_id: '',
    contact_id: '',
    page_url: '',
    action: '',
    intent_level: '',
    min_score: '',
    max_score: '',
    date_from: '',
    date_to: ''
  }
  applyFilters()
}

const refreshData = () => {
  loadIntentData()
  loadAnalytics()
  loadVisitorIntentAnalytics()
}

const openTestEventModal = () => {
  showTestEventModal.value = true
  testEventForm.value = {
    contact_name: '',
    contact_email: '',
    company_name: '',
    page_url: '',
    action: '',
    score: ''
  }
}

const closeTestEventModal = () => {
  showTestEventModal.value = false
  loggingTestEvent.value = false
}

const logTestEvent = async () => {
  loggingTestEvent.value = true
  
  try {
    await buyerIntentService.logTestEvent(testEventForm.value)
    showSuccess('Test event logged successfully')
    closeTestEventModal()
    refreshData()
  } catch (err) {
    showError(err.message || 'Failed to log test event')
  } finally {
    loggingTestEvent.value = false
  }
}

// Helper methods
const getIntentLevelColor = (level) => buyerIntentHelpers.getIntentLevelColor(level)
const getScoreColor = (score) => buyerIntentHelpers.getScoreColor(score)
const getActionIcon = (action) => buyerIntentHelpers.getActionIcon(action)
const formatTimestamp = (timestamp) => buyerIntentHelpers.formatTimestamp(timestamp)
const getPageTitle = (url) => buyerIntentHelpers.getPageTitle(url)
const formatNumber = (num) => buyerIntentHelpers.formatNumber(num)

const getActionName = (actionId) => {
  const action = trackingActions.value.find(a => a.id === actionId)
  return action ? action.name : actionId
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadIntentData(),
    loadAnalytics(),
    loadVisitorIntentAnalytics(),
    loadTrackingActions(),
    loadIntentLevels()
  ])
})
</script>
