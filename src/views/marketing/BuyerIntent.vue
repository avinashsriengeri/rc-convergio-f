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
          <div class="flex items-center space-x-3">
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('marketing.buyer_intent.title') }}</h1>
            <!-- Live Indicator -->
            <div 
              v-if="isLive" 
              class="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium animate-pulse"
            >
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Live</span>
            </div>
          </div>
          <p class="mt-2 text-lg text-gray-600">{{ $t('marketing.buyer_intent.subtitle') }}</p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="openTrackingScriptModal"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.buyer_intent.actions.get_tracking_code') }}
          </button>
          <button
            @click="refreshData(true)"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.buyer_intent.actions.refresh_data') }}
          </button>
          <button
            @click="exportData"
            class="bg-blue-900 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.buyer_intent.actions.export_data') }}
          </button>
          <button
            @click="generateReport('summary')"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.buyer_intent.actions.generate_report') }}
          </button>
          <button
            @click="openTestEventModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.buyer_intent.actions.log_test_event') }}
          </button>
          <button
            @click="openScoringConfigModal"
            class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.buyer_intent.actions.scoring_config') }}
          </button>
        </div>
      </div>

      <!-- Professional Metric Cards - HubSpot Style -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Events Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.total_events') }}</p>
                <p class="text-3xl font-bold text-gray-900">{{ analyticsData?.overview?.total_events || intentData.length || 0 }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="flex items-center text-green-600 text-sm font-medium">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                +15%
              </div>
              <p class="text-xs text-gray-500">vs last month</p>
            </div>
          </div>
        </div>

        <!-- High Intent Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center justify-between">
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
                <p class="text-3xl font-bold text-gray-900">{{ analyticsData?.overview?.high_intent_events || analyticsData?.overview?.high_intent_count || 0 }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="flex items-center text-green-600 text-sm font-medium">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                +23%
              </div>
              <p class="text-xs text-gray-500">vs last month</p>
            </div>
          </div>
        </div>

        <!-- Conversion Rate Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p class="text-3xl font-bold text-gray-900">{{ visitorIntentAnalytics?.summary?.conversion_rate || 0 }}%</p>
              </div>
            </div>
            <div class="text-right">
              <div class="flex items-center text-green-600 text-sm font-medium">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                +8%
              </div>
              <p class="text-xs text-gray-500">vs last month</p>
            </div>
          </div>
        </div>

        <!-- Unique Contacts Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Unique Contacts</p>
                <p class="text-3xl font-bold text-gray-900">{{ analyticsData?.overview?.unique_contacts || uniqueContacts.length || 0 }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="flex items-center text-green-600 text-sm font-medium">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                +12%
              </div>
              <p class="text-xs text-gray-500">vs last month</p>
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
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.buyer_intent.filters.campaign') }}</label>
                  <select v-model="filters.campaign_id" @change="applyFilters" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">{{ $t('marketing.buyer_intent.filters.all_campaigns') }}</option>
                    <option v-for="campaign in uniqueCampaigns" :key="campaign.id" :value="campaign.id">{{ campaign.name }}</option>
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
              <table class="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
                <thead class="bg-gray-50 rounded-t-lg">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.when') }}</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.contact') }}</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.company') }}</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.campaign') }}</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.page') }}</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.action') }}</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.score') }}</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.intent_level') }}</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ $t('marketing.buyer_intent.table.actions') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr v-for="item in intentData" :key="item.id" class="hover:bg-gray-50 transition-colors duration-150">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div class="flex flex-col">
                        <span class="font-medium">{{ formatTimestamp(item.timestamp || item.created_at) }}</span>
                        <span class="text-xs text-gray-500">{{ new Date(item.timestamp || item.created_at).toLocaleDateString() }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div v-if="item.contact?.id" class="flex items-center">
                        <div class="flex-shrink-0 h-8 w-8">
                          <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span class="text-sm font-medium text-indigo-600">
                              {{ (item.contact?.name || `${item.contact?.first_name || ''} ${item.contact?.last_name || ''}`.trim() || 'U').charAt(0).toUpperCase() }}
                            </span>
                          </div>
                        </div>
                        <div class="ml-3">
                          <button 
                            @click="openContactIntentModal(item.contact.id)"
                            class="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                          >
                            {{ item.contact?.name || `${item.contact?.first_name || ''} ${item.contact?.last_name || ''}`.trim() || 'Unknown' }}
                          </button>
                          <p class="text-xs text-gray-500">{{ item.contact?.email || 'No email' }}</p>
                        </div>
                      </div>
                      <div v-else class="flex items-center">
                        <div class="flex-shrink-0 h-8 w-8">
                          <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span class="text-sm font-medium text-gray-400">?</span>
                          </div>
                        </div>
                        <div class="ml-3">
                          <span class="text-sm font-medium text-gray-500">Unknown</span>
                          <p class="text-xs text-gray-400">No contact data</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button 
                        v-if="item.company?.id" 
                        @click="openCompanyIntentModal(item.company.id)"
                        class="text-sm font-medium text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        {{ item.company?.name || 'Unknown' }}
                      </button>
                      <span v-else class="text-sm text-gray-500">Unknown</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button 
                        v-if="item.metadata?.campaign_id" 
                        @click="openCampaignIntentModal(item.metadata.campaign_id)"
                        class="text-sm font-medium text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        {{ item.metadata?.campaign_name || `Campaign #${item.metadata.campaign_id}` }}
                      </button>
                      <span v-else class="text-sm text-gray-500">N/A</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="max-w-xs">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ getPageTitle(item.page_url) }}</p>
                        <p class="text-xs text-gray-500 truncate">{{ item.page_url }}</p>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ getActionName(item.action) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <span class="text-2xl font-bold" :class="getScoreColor(item.score)">{{ item.score }}</span>
                        <span class="ml-1 text-xs text-gray-500">/100</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getIntentLevelColor(item.intent_level)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold">
                        {{ item.intent_level }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex space-x-2">
                        <button
                          @click="openEventIntentModal(item.id)"
                          class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200"
                          :title="$t('marketing.buyer_intent.actions.view_details')"
                        >
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        <button
                          @click="deleteEvent(item.id)"
                          class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 transition-colors duration-200"
                          :title="$t('marketing.buyer_intent.actions.delete_event')"
                        >
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Panel: Professional Analytics Sidebar -->
        <div class="space-y-6">
          <!-- Overview Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.buyer_intent.analytics.overview.title') }}</h3>
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div v-if="analyticsData" class="space-y-4">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.total_events') }}</span>
                <span class="text-lg font-bold text-gray-900">{{ formatNumber(analyticsData.overview?.total_events || 0) }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.unique_contacts') }}</span>
                <span class="text-lg font-bold text-gray-900">{{ formatNumber(analyticsData.overview?.unique_contacts || 0) }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.unique_companies') }}</span>
                <span class="text-lg font-bold text-gray-900">{{ formatNumber(analyticsData.overview?.unique_companies || 0) }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.average_score') }}</span>
                <span class="text-lg font-bold text-indigo-600">{{ analyticsData.overview?.average_score || 0 }}</span>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p class="text-sm text-gray-500">No analytics data available</p>
              <p class="text-xs text-gray-400 mt-1">API not connected</p>
            </div>
          </div>

          <!-- Action Breakdown -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.buyer_intent.analytics.action_breakdown') }}</h3>
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div v-if="analyticsData?.action_breakdown?.length" class="space-y-3">
              <div v-for="action in analyticsData.action_breakdown" :key="action.action" class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div class="flex items-center">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-3">
                    {{ getActionName(action.action) }}
                  </span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-bold text-gray-900">{{ formatNumber(action.count) }}</span>
                  <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{ action.percentage }}%</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p class="text-sm text-gray-500">No action data available</p>
              <p class="text-xs text-gray-400 mt-1">API not connected</p>
            </div>
          </div>

          <!-- Top Pages -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.buyer_intent.analytics.top_pages') }}</h3>
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div v-if="analyticsData?.top_pages?.length" class="space-y-3">
              <div v-for="page in analyticsData.top_pages" :key="page.page" class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ getPageTitle(page.page) }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ page.page }}</p>
                </div>
                <div class="flex items-center space-x-3 ml-3">
                  <div class="text-right">
                    <span class="text-sm font-bold text-gray-900">{{ formatNumber(page.views) }}</span>
                    <p class="text-xs text-gray-500">views</p>
                  </div>
                  <div class="text-right">
                    <span class="text-sm font-bold text-indigo-600">{{ page.intent_score }}</span>
                    <p class="text-xs text-gray-500">score</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p class="text-sm text-gray-500">No page data available</p>
              <p class="text-xs text-gray-400 mt-1">API not connected</p>
            </div>
          </div>

          <!-- Visitor Intent Analytics -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('marketing.buyer_intent.analytics.visitor_intent.title') }}</h3>
            <div v-if="visitorIntentAnalytics" class="space-y-4">
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
            <div v-else class="text-center py-8">
              <p class="text-sm text-gray-500">No visitor analytics available</p>
              <p class="text-xs text-gray-400 mt-1">API not connected</p>
            </div>
          </div>

          <!-- Campaign Performance Analytics -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('marketing.buyer_intent.analytics.campaign_performance.title') }}</h3>
            <div v-if="campaignStats" class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.campaign_performance.total_campaigns') }}</span>
                <span class="text-sm font-medium">{{ formatNumber(campaignStats.summary?.total_campaigns || 0) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.campaign_performance.total_clicks') }}</span>
                <span class="text-sm font-medium">{{ formatNumber(campaignStats.summary?.total_clicks || 0) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.campaign_performance.unique_contacts') }}</span>
                <span class="text-sm font-medium">{{ formatNumber(campaignStats.summary?.unique_contacts || 0) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.campaign_performance.avg_score') }}</span>
                <span class="text-sm font-medium">{{ campaignStats.summary?.avg_score || 0 }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.campaign_performance.conversion_rate') }}</span>
                <span class="text-sm font-medium">{{ campaignStats.summary?.conversion_rate || 0 }}%</span>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-sm text-gray-500">No campaign analytics available</p>
              <p class="text-xs text-gray-400 mt-1">API not connected</p>
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.buyer_intent.test_event_modal.contact') }}</label>
                  <select
                    v-model="testEventForm.contact_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{{ $t('marketing.buyer_intent.test_event_modal.select_contact') }}</option>
                    <option v-for="contact in contacts" :key="contact.id" :value="contact.id">
                      {{ contact.first_name }} {{ contact.last_name }} ({{ contact.email }})
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.buyer_intent.test_event_modal.company') }}</label>
                  <select
                    v-model="testEventForm.company_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{{ $t('marketing.buyer_intent.test_event_modal.select_company') }}</option>
                    <option v-for="company in companies" :key="company.id" :value="company.id">
                      {{ company.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.buyer_intent.test_event_modal.campaign') }}</label>
                  <select
                    v-model="testEventForm.campaign_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{{ $t('marketing.buyer_intent.test_event_modal.select_campaign') }}</option>
                    <option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">
                      {{ campaign.name }}
                    </option>
                  </select>
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

    <!-- Export Status Modal -->
    <div
      v-if="showExportModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="showExportModal = false"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.buyer_intent.export_modal.title') }}</h3>
          </div>
          <div class="p-6">
            <div v-if="exportJobStatus" class="text-center">
              <div v-if="exportJobStatus.status === 'processing'" class="mb-4">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p class="mt-2 text-gray-600">{{ $t('marketing.buyer_intent.export_modal.processing') }}</p>
              </div>
              <div v-else-if="exportJobStatus.status === 'completed'" class="mb-4">
                <svg class="mx-auto h-12 w-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-green-600 font-medium">{{ $t('marketing.buyer_intent.export_modal.completed') }}</p>
              </div>
              <div v-else-if="exportJobStatus.status === 'failed'" class="mb-4">
                <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-red-600 font-medium">{{ $t('marketing.buyer_intent.export_modal.failed') }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ exportJobStatus.error }}</p>
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  @click="showExportModal = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {{ $t('marketing.buyer_intent.export_modal.close') }}
                </button>
                <button
                  v-if="exportJobStatus.status === 'completed' && exportJobStatus.download_url"
                  @click="window.open(exportJobStatus.download_url, '_blank')"
                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                >
                  {{ $t('marketing.buyer_intent.export_modal.download') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Status Modal -->
    <div
      v-if="showReportModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="showReportModal = false"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.buyer_intent.report_modal.title') }}</h3>
          </div>
          <div class="p-6">
            <div v-if="reportJobStatus" class="text-center">
              <div v-if="reportJobStatus.status === 'processing'" class="mb-4">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p class="mt-2 text-gray-600">{{ $t('marketing.buyer_intent.report_modal.processing') }}</p>
              </div>
              <div v-else-if="reportJobStatus.status === 'completed'" class="mb-4">
                <svg class="mx-auto h-12 w-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-green-600 font-medium">{{ $t('marketing.buyer_intent.report_modal.completed') }}</p>
              </div>
              <div v-else-if="reportJobStatus.status === 'failed'" class="mb-4">
                <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-red-600 font-medium">{{ $t('marketing.buyer_intent.report_modal.failed') }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ reportJobStatus.error }}</p>
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  @click="showReportModal = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {{ $t('marketing.buyer_intent.report_modal.close') }}
                </button>
                <button
                  v-if="reportJobStatus.status === 'completed' && reportJobStatus.download_url"
                  @click="window.open(reportJobStatus.download_url, '_blank')"
                  class="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
                >
                  {{ $t('marketing.buyer_intent.report_modal.download') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Scoring Configuration Modal -->
    <div
      v-if="showScoringConfigModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="showScoringConfigModal = false"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.buyer_intent.scoring_config_modal.title') }}</h3>
              <p class="text-sm text-gray-600 mt-1">Configure default scores for different actions</p>
            </div>
            <button
              @click="showScoringConfigModal = false"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <!-- Loading State -->
            <div v-if="!scoringConfig" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p class="mt-4 text-gray-600">Loading scoring configuration...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="!scoringConfig?.data" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 class="text-lg font-medium text-gray-900 mb-2">Failed to Load Configuration</h4>
              <p class="text-gray-600 mb-6">Unable to load scoring configuration from the server.</p>
              <button @click="loadScoringConfig" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                Retry
              </button>
            </div>

            <!-- Success State - Dynamic Table -->
            <div v-else class="space-y-6">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-blue-800">Configuration Info</h3>
                    <div class="mt-2 text-sm text-blue-700">
                      <p>Configure default intent scores for different user actions. Higher scores indicate stronger buying intent.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
                  <thead class="bg-gray-50 rounded-t-lg">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Default Score</th>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-100">
                    <tr v-for="(config, action) in scoringConfig.data" :key="action" class="hover:bg-gray-50 transition-colors duration-150">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-8 w-8">
                            <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                              <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </div>
                          </div>
                          <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900">{{ formatActionName(action) }}</div>
                            <div class="text-xs text-gray-500">{{ action }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div v-if="editingAction === action" class="flex items-center space-x-2">
                          <input
                            v-model="editingScore"
                            type="number"
                            min="0"
                            max="100"
                            class="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            @keyup.enter="saveScore(action)"
                            @keyup.escape="cancelEditing"
                          />
                          <span class="text-xs text-gray-500">/100</span>
                        </div>
                        <div v-else class="flex items-center">
                          <span class="text-2xl font-bold text-indigo-600">{{ config.default }}</span>
                          <span class="ml-1 text-xs text-gray-500">/100</span>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex space-x-2">
                          <!-- Edit Button -->
                          <button
                            v-if="editingAction !== action"
                            @click="startEditing(action, config.default)"
                            class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200"
                          >
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>

                          <!-- Save Button -->
                          <button
                            v-if="editingAction === action"
                            @click="saveScore(action)"
                            :disabled="isUpdatingScore"
                            class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            <svg v-if="isUpdatingScore" class="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <svg v-else class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {{ isUpdatingScore ? 'Saving...' : 'Save' }}
                          </button>

                          <!-- Cancel Button -->
                          <button
                            v-if="editingAction === action"
                            @click="cancelEditing"
                            class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                          >
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Configuration Summary -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Configuration Summary</h4>
                    <p class="text-xs text-gray-500 mt-1">{{ Object.keys(scoringConfig?.data || {}).length }} actions configured</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-500">Average Score</p>
                    <p class="text-lg font-bold text-indigo-600">
                      {{ Math.round(Object.values(scoringConfig?.data || {}).reduce((sum, config) => sum + config.default, 0) / Object.keys(scoringConfig?.data || {}).length) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              @click="showScoringConfigModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Drilldown Modals -->
    <ContactIntentModal 
      :show="showContactIntentModal" 
      :contact-id="selectedContactId"
      @close="showContactIntentModal = false"
    />
    
    <CompanyIntentModal 
      :show="showCompanyIntentModal" 
      :company-id="selectedCompanyId"
      @close="showCompanyIntentModal = false"
    />
    
    <CampaignIntentModal 
      :show="showCampaignIntentModal" 
      :campaign-id="selectedCampaignId"
      @close="showCampaignIntentModal = false"
    />
    
    <EventIntentModal 
      :show="showEventIntentModal" 
      :event-id="selectedEventId"
      :event-data="selectedEventData"
      @close="showEventIntentModal = false"
    />

    <!-- Tracking Script Modal -->
    <div
      v-if="showTrackingScriptModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeTrackingScriptModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.buyer_intent.tracking_script_modal.title') }}</h3>
            <button
              @click="closeTrackingScriptModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div v-if="trackingScriptLoading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p class="mt-4 text-gray-600">{{ $t('marketing.buyer_intent.tracking_script_modal.loading') }}</p>
            </div>
            
            <div v-else-if="trackingScriptError" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.buyer_intent.tracking_script_modal.error_title') }}</h4>
              <p class="text-gray-600 mb-6">{{ trackingScriptError }}</p>
              <button @click="loadTrackingScript" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                {{ $t('marketing.buyer_intent.tracking_script_modal.retry') }}
              </button>
            </div>
            
            <div v-else-if="trackingScriptData" class="space-y-6">
              <!-- Installation Instructions -->
              <div v-if="trackingScriptData.instructions" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="text-sm font-medium text-blue-900 mb-2">{{ $t('marketing.buyer_intent.tracking_script_modal.instructions_title') }}</h4>
                <div class="text-sm text-blue-800 whitespace-pre-line">{{ trackingScriptData.instructions }}</div>
              </div>
              
              <!-- Tracking Script Code -->
              <div>
                <div class="flex justify-between items-center mb-3">
                  <h4 class="text-sm font-medium text-gray-900">{{ $t('marketing.buyer_intent.tracking_script_modal.script_title') }}</h4>
                  <button
                    @click="copyTrackingScript"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {{ copiedToClipboard ? $t('marketing.buyer_intent.tracking_script_modal.copied') : $t('marketing.buyer_intent.tracking_script_modal.copy') }}
                  </button>
                </div>
                <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre class="text-green-400 text-sm font-mono whitespace-pre-wrap">{{ trackingScriptData.script }}</pre>
                </div>
              </div>
              
              <!-- Additional Information -->
              <div v-if="trackingScriptData.additional_info" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">{{ $t('marketing.buyer_intent.tracking_script_modal.additional_info_title') }}</h4>
                <div class="text-sm text-gray-700 whitespace-pre-line">{{ trackingScriptData.additional_info }}</div>
              </div>
            </div>
            
            <div v-else class="text-center py-8">
              <p class="text-sm text-gray-500">{{ $t('marketing.buyer_intent.tracking_script_modal.no_data') }}</p>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              @click="closeTrackingScriptModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {{ $t('marketing.buyer_intent.tracking_script_modal.close') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Health Check Component -->
    <HealthCheck />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { buyerIntentService, buyerIntentHelpers } from '@/services/buyerIntent'
import { contactsAPI, companiesAPI, campaignsAPI } from '@/services/api'
import { error as showError, success as showSuccess } from '@/utils/notifications'
import HealthCheck from '@/components/HealthCheck.vue'
import ContactIntentModal from '@/components/modals/ContactIntentModal.vue'
import CompanyIntentModal from '@/components/modals/CompanyIntentModal.vue'
import CampaignIntentModal from '@/components/modals/CampaignIntentModal.vue'
import EventIntentModal from '@/components/modals/EventIntentModal.vue'

const { t } = useI18n()

// Reactive state
const loading = ref(false)
const error = ref(null)
const intentData = ref([])
const analyticsData = ref(null)
const visitorIntentAnalytics = ref(null)
const trackingActions = ref([])
const intentLevels = ref([])
const contacts = ref([])
const companies = ref([])
const campaigns = ref([])
const campaignStats = ref(null)
const scoringConfig = ref(null)
const exportJobs = ref([])
const reportJobs = ref([])

// Realtime polling state
const isLive = ref(false)
const lastDataHash = ref('')
const pollInterval = ref(null)
const pollingActive = ref(true)
const noChangesCount = ref(0)
const refreshClickCount = ref(0)
const lastRefreshTime = ref(0)

// Modal states
const showTestEventModal = ref(false)
const loggingTestEvent = ref(false)
const showTrackingScriptModal = ref(false)
const trackingScriptLoading = ref(false)
const trackingScriptError = ref(null)
const trackingScriptData = ref(null)
const copiedToClipboard = ref(false)

// Filters
const filters = ref({
  company_id: '',
  contact_id: '',
  campaign_id: '',
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
  contact_id: '',
  company_id: '',
  campaign_id: '',
  page_url: '',
  action: '',
  score: ''
})

// Export/Report job states
const exportJobStatus = ref(null)
const reportJobStatus = ref(null)
const showExportModal = ref(false)
const showReportModal = ref(false)
const showScoringConfigModal = ref(false)

// Scoring config editing states
const editingAction = ref(null)
const editingScore = ref('')
const isUpdatingScore = ref(false)

// Drilldown modal states
const showContactIntentModal = ref(false)
const showCompanyIntentModal = ref(false)
const showCampaignIntentModal = ref(false)
const showEventIntentModal = ref(false)
const selectedContactId = ref(null)
const selectedCompanyId = ref(null)
const selectedCampaignId = ref(null)
const selectedEventId = ref(null)
const selectedEventData = ref(null)

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

const uniqueCampaigns = computed(() => {
  const campaigns = new Map()
  intentData.value.forEach(item => {
    if (item.metadata?.campaign_id && !campaigns.has(item.metadata.campaign_id)) {
      campaigns.set(item.metadata.campaign_id, {
        id: item.metadata.campaign_id,
        name: item.metadata.campaign_name || `Campaign #${item.metadata.campaign_id}`
      })
    }
  })
  return Array.from(campaigns.values())
})

// Rate limiting for API calls
const apiCallLimiter = {
  calls: new Map(),
  
  canMakeCall: function(endpoint) {
    const now = Date.now()
    const key = endpoint
    const calls = this.calls.get(key) || []
    
    // Remove calls older than 1 minute
    const recentCalls = calls.filter(time => now - time < 60000)
    
    // Allow max 10 calls per minute per endpoint
    if (recentCalls.length >= 10) {
      return false
    }
    
    recentCalls.push(now)
    this.calls.set(key, recentCalls)
    return true
  }
}

// Methods
const loadIntentData = async () => {
  // Rate limiting check
  if (!apiCallLimiter.canMakeCall('/api/tracking/intent')) {
    console.warn('⏸️ Rate limit exceeded for intent data API')
    return
  }

  loading.value = true
  error.value = null
  
  try {
    const params = {
      page: pagination.value.current_page,
      per_page: pagination.value.per_page,
      sort_by: 'intent_score',
      sort_order: 'desc',
      ...filters.value
    }
    
    // Remove empty filter values
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })
    
    console.log('📋 Loading intent data with params:', params)
    const response = await buyerIntentService.getIntent(params)
    console.log('📋 Intent data response:', response.data)
    intentData.value = response.data || []
    pagination.value = response.meta || pagination.value
  } catch (err) {
    console.log('❌ Intent data API failed:', err.response?.status || err.message)
    // Don't show error to user, just use empty state
    intentData.value = []
    pagination.value = { current_page: 1, last_page: 1, per_page: 15, total: 0 }
  } finally {
    loading.value = false
  }
}

const loadAnalytics = async () => {
  // Rate limiting check
  if (!apiCallLimiter.canMakeCall('/api/tracking/analytics')) {
    console.warn('⏸️ Rate limit exceeded for analytics API')
    return
  }

  try {
    const params = {}
    if (filters.value.date_from) params.date_from = filters.value.date_from
    if (filters.value.date_to) params.date_to = filters.value.date_to
    
    console.log('📊 Loading analytics...')
    const response = await buyerIntentService.getAnalytics(params)
    console.log('📊 Analytics response:', response.data)
    analyticsData.value = response.data
  } catch (err) {
    handleError(err, 'Loading Analytics')
    // Reset to empty state - no fallback data
    analyticsData.value = null
  }
}

const loadVisitorIntentAnalytics = async () => {
  try {
    const params = {}
    if (filters.value.date_from) params.date_from = filters.value.date_from
    if (filters.value.date_to) params.date_to = filters.value.date_to
    
    console.log('👥 Loading visitor analytics...')
    const response = await buyerIntentService.getVisitorAnalytics(params)
    console.log('👥 Visitor analytics response:', response.data)
    visitorIntentAnalytics.value = response.data
  } catch (err) {
    console.log('❌ Visitor analytics API failed:', err.response?.status || err.message)
    console.log('❌ Error details:', err.response?.data)
    // Handle the specific 500 error gracefully
    if (err.response?.status === 500) {
      console.log('⚠️ Visitor analytics API has backend issues - continuing without this data')
    }
    // Reset to empty state - no fallback data
    visitorIntentAnalytics.value = null
  }
}

const loadTrackingActions = async () => {
  try {
    const response = await buyerIntentService.getActions()
    // Convert object to array format for compatibility
    if (response.data && typeof response.data === 'object') {
      trackingActions.value = Object.entries(response.data).map(([id, name]) => ({ id, name }))
    } else {
    trackingActions.value = response.data || []
    }
  } catch (err) {
    console.log('Tracking actions API failed:', err.response?.status || err.message)
    // Reset to empty state - no fallback data
    trackingActions.value = []
  }
}

const loadIntentLevels = async () => {
  try {
    const response = await buyerIntentService.getIntentLevels()
    // Convert object to array format for compatibility
    if (response.data && typeof response.data === 'object') {
      intentLevels.value = Object.entries(response.data).map(([id, data]) => ({ 
        id, 
        name: data.label, 
        min_score: data.min_score, 
        max_score: data.max_score 
      }))
    } else {
    intentLevels.value = response.data || []
    }
  } catch (err) {
    console.log('Intent levels API failed:', err.response?.status || err.message)
    // Reset to empty state - no fallback data
    intentLevels.value = []
  }
}

const loadContacts = async () => {
  try {
    const response = await contactsAPI.getContacts({ per_page: 100 })
    contacts.value = response.data.data || []
  } catch (err) {
    console.log('Contacts API failed:', err.response?.status || err.message)
    contacts.value = []
  }
}

const loadCompanies = async () => {
  try {
    const response = await companiesAPI.getCompanies({ per_page: 100 })
    companies.value = response.data.data || []
  } catch (err) {
    console.log('Companies API failed:', err.response?.status || err.message)
    companies.value = []
  }
}

const loadCampaigns = async () => {
  try {
    const response = await campaignsAPI.getCampaigns({ per_page: 100 })
    campaigns.value = response.data.data || []
  } catch (err) {
    console.log('Campaigns API failed:', err.response?.status || err.message)
    campaigns.value = []
  }
}

const loadCampaignStats = async () => {
  try {
    const response = await buyerIntentService.getCampaignStats()
    campaignStats.value = response.data
  } catch (err) {
    console.log('Campaign stats API failed:', err.response?.status || err.message)
    campaignStats.value = null
  }
}

const loadScoringConfig = async () => {
  try {
    console.log('🔄 Loading scoring configuration...')
    const response = await buyerIntentService.getScoringConfig()
    console.log('✅ Scoring config loaded successfully:', response)
    scoringConfig.value = response
  } catch (err) {
    console.error('❌ Scoring config API failed:', err.response?.status || err.message)
    console.error('❌ Full error details:', err)
    scoringConfig.value = null
  }
}

const loadExportJobs = async () => {
  try {
    const response = await buyerIntentService.listExports()
    exportJobs.value = response.data || []
  } catch (err) {
    console.log('Export jobs API failed:', err.response?.status || err.message)
    exportJobs.value = []
  }
}

const loadReportJobs = async () => {
  try {
    const response = await buyerIntentService.listReports()
    reportJobs.value = response.data || []
  } catch (err) {
    console.log('Report jobs API failed:', err.response?.status || err.message)
    reportJobs.value = []
  }
}

const applyFilters = () => {
  pagination.value.current_page = 1
  loadIntentData()
  loadAnalytics()
  loadVisitorIntentAnalytics()
  loadCampaignStats()
}

const clearFilters = () => {
  filters.value = {
    company_id: '',
    contact_id: '',
    campaign_id: '',
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

// Generate data hash for change detection
const generateDataHash = (data) => {
  if (!data) return ''
  return JSON.stringify(data).slice(0, 100) // First 100 chars for quick comparison
}

// Check if data has changed
const hasDataChanged = (newData) => {
  const newHash = generateDataHash(newData)
  const changed = newHash !== lastDataHash.value
  if (changed) {
    lastDataHash.value = newHash
    noChangesCount.value = 0
    isLive.value = true
    // Hide live indicator after 3 seconds
    setTimeout(() => { isLive.value = false }, 3000)
  } else {
    noChangesCount.value++
  }
  return changed
}

// Rate limiting for manual refresh
const canRefresh = () => {
  const now = Date.now()
  if (now - lastRefreshTime.value < 10000) { // 10 seconds
    refreshClickCount.value++
    if (refreshClickCount.value > 5) {
      showError('Too many refresh requests. Please wait 10 seconds.')
      return false
    }
  } else {
    refreshClickCount.value = 1
    lastRefreshTime.value = now
  }
  return true
}

const refreshData = async (isManual = false) => {
  // Only allow manual refreshes to prevent automatic API calls
  if (!isManual) {
    console.log('⏸️ Automatic refresh disabled - use Refresh Data button')
    return
  }
  
  if (isManual && !canRefresh()) {
    return
  }

  console.log('🔄 Refreshing data... (manual only)')
  
  try {
    await Promise.all([
      loadIntentData(),
      loadAnalytics(),
      loadVisitorIntentAnalytics()
    ])
    
    // Check for changes
    hasDataChanged({
      intent: intentData.value,
      analytics: analyticsData.value,
      visitor: visitorIntentAnalytics.value
    })
    
    console.log('✅ Data refresh completed')
  } catch (error) {
    console.error('❌ Data refresh failed:', error)
    if (isManual) {
      showError('Failed to refresh data. Please try again.')
    }
  }
}

// Realtime polling functions - DISABLED to prevent heavy load
const startPolling = () => {
  // Polling disabled to prevent heavy API load
  console.log('⏸️ Polling disabled to prevent heavy API load')
  return
  
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }

  const getPollingInterval = () => {
    // Backoff to 30s if no changes after 3 polls
    if (noChangesCount.value >= 3) {
      return 30000 // 30 seconds
    }
    return 10000 // 10 seconds
  }

  const poll = async () => {
    if (!pollingActive.value || document.hidden) {
      return
    }

    try {
      await refreshData(false)
    } catch (error) {
      console.error('❌ Polling error:', error)
    }
  }

  // Start polling
  pollInterval.value = setInterval(poll, getPollingInterval())
  console.log('🔄 Started realtime polling')
}

const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
    pollInterval.value = null
    console.log('⏸️ Stopped realtime polling')
  }
}

// Handle visibility changes - DISABLED to prevent automatic API calls
const handleVisibilityChange = () => {
  // Visibility change handling disabled to prevent automatic API calls
  console.log('👁️ Tab visibility changed - automatic refresh disabled')
  return
  
  if (document.hidden) {
    pollingActive.value = false
    console.log('👁️ Tab hidden - pausing polling')
  } else {
    pollingActive.value = true
    console.log('👁️ Tab visible - resuming polling')
    // Refresh immediately when tab becomes visible
    refreshData(false)
  }
}

const openTestEventModal = () => {
  showTestEventModal.value = true
  testEventForm.value = {
    contact_id: '',
    company_id: '',
    campaign_id: '',
    page_url: '',
    action: '',
    score: ''
  }
}

const openScoringConfigModal = () => {
  showScoringConfigModal.value = true
  loadScoringConfig()
}

const openTrackingScriptModal = () => {
  showTrackingScriptModal.value = true
  loadTrackingScript()
}

const closeTrackingScriptModal = () => {
  showTrackingScriptModal.value = false
  trackingScriptError.value = null
  trackingScriptData.value = null
  copiedToClipboard.value = false
}

const loadTrackingScript = async () => {
  trackingScriptLoading.value = true
  trackingScriptError.value = null
  
  try {
    const response = await buyerIntentService.getTrackingScript()
    trackingScriptData.value = response.data
    console.log('📜 Tracking script loaded:', response.data)
  } catch (err) {
    console.error('❌ Failed to load tracking script:', err)
    trackingScriptError.value = err.message || 'Failed to load tracking script'
  } finally {
    trackingScriptLoading.value = false
  }
}

const copyTrackingScript = async () => {
  if (!trackingScriptData.value?.script) {
    showError('No script available to copy')
    return
  }
  
  try {
    await navigator.clipboard.writeText(trackingScriptData.value.script)
    copiedToClipboard.value = true
    showSuccess('Tracking script copied to clipboard')
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      copiedToClipboard.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    showError('Failed to copy script to clipboard')
  }
}

const updateScoringConfig = async (configData) => {
  try {
    const response = await buyerIntentService.updateScoringConfig(configData)
    showSuccess('Scoring configuration updated successfully')
    loadScoringConfig()
    return response.data
  } catch (err) {
    showError(err.message || 'Failed to update scoring configuration')
  }
}

const testScoring = async (testData) => {
  try {
    const response = await buyerIntentService.testScoring(testData)
    showSuccess('Scoring test completed successfully')
    return response.data
  } catch (err) {
    showError(err.message || 'Failed to test scoring')
  }
}

// Scoring config edit functionality
const startEditing = (action, currentScore) => {
  editingAction.value = action
  editingScore.value = currentScore.toString()
}

const cancelEditing = () => {
  editingAction.value = null
  editingScore.value = ''
}

const saveScore = async (action) => {
  if (!editingScore.value || isNaN(editingScore.value)) {
    showError('Please enter a valid score')
    return
  }

  const score = parseInt(editingScore.value)
  if (score < 0 || score > 100) {
    showError('Score must be between 0 and 100')
    return
  }

  isUpdatingScore.value = true
  
  try {
    const updateData = {
      action: action,
      default_score: score
    }
    
    await buyerIntentService.updateScoringConfig(updateData)
    showSuccess('Scoring configuration updated successfully')
    
    // Refresh the config
    await loadScoringConfig()
    
    // Reset editing state
    cancelEditing()
  } catch (err) {
    showError(err.message || 'Failed to update scoring configuration')
  } finally {
    isUpdatingScore.value = false
  }
}

// Drilldown modal methods
const openContactIntentModal = (contactId) => {
  selectedContactId.value = contactId
  showContactIntentModal.value = true
}

const openCompanyIntentModal = (companyId) => {
  selectedCompanyId.value = companyId
  showCompanyIntentModal.value = true
}

const openCampaignIntentModal = (campaignId) => {
  selectedCampaignId.value = campaignId
  showCampaignIntentModal.value = true
}

const openEventIntentModal = (eventId) => {
  selectedEventId.value = eventId
  
  // Find the event data from intentData
  const eventData = intentData.value.find(item => item.id == eventId)
  selectedEventData.value = eventData || null
  
  showEventIntentModal.value = true
}

const closeTestEventModal = () => {
  showTestEventModal.value = false
  loggingTestEvent.value = false
}

const logTestEvent = async () => {
  loggingTestEvent.value = true
  
  try {
    // Get selected contact, company, and campaign data
    const selectedContact = contacts.value.find(c => c.id == testEventForm.value.contact_id)
    const selectedCompany = companies.value.find(c => c.id == testEventForm.value.company_id)
    const selectedCampaign = campaigns.value.find(c => c.id == testEventForm.value.campaign_id)
    
    // Prepare event data according to API specification
    const eventData = {
      page_url: testEventForm.value.page_url,
      action: testEventForm.value.action,
      score: parseInt(testEventForm.value.score),
      contact_id: testEventForm.value.contact_id,
      company_id: testEventForm.value.company_id,
      metadata: {
        source: 'test_event',
        test_mode: true,
        contact_name: selectedContact ? `${selectedContact.first_name} ${selectedContact.last_name}` : '',
        contact_email: selectedContact ? selectedContact.email : '',
        company_name: selectedCompany ? selectedCompany.name : '',
        campaign_id: testEventForm.value.campaign_id,
        campaign_name: selectedCampaign ? selectedCampaign.name : ''
      }
    }
    
    console.log('📝 Logging event with data:', eventData)
    console.log('📝 Page URL being sent:', eventData.page_url)
    
    await buyerIntentService.postEvent(eventData)
    showSuccess('Test event logged successfully')
    closeTestEventModal()
    refreshData()
  } catch (err) {
    showError(err.message || 'Failed to log test event')
  } finally {
    loggingTestEvent.value = false
  }
}

// Additional API methods for new functionality
const exportData = async () => {
  try {
    const exportData = {
      format: 'json',
      date_from: filters.value.date_from || '',
      date_to: filters.value.date_to || '',
      filters: filters.value
    }
    
    const response = await buyerIntentService.createExport(exportData)
    
    if (response.data && response.data.job_id) {
      showSuccess('Export job created successfully')
      exportJobStatus.value = response.data
      showExportModal.value = true
      // Start polling for export status
      pollExportStatus(response.data.job_id)
    } else {
      showError('Export failed: No job ID provided')
    }
  } catch (err) {
    showError(err.message || 'Failed to create export job')
  }
}

const pollExportStatus = async (jobId) => {
  try {
    const response = await buyerIntentService.getExportStatus(jobId)
    exportJobStatus.value = response.data
    
    if (response.data.status === 'completed') {
      showSuccess('Export completed successfully')
      // Auto-download when ready
      if (response.data.download_url) {
        window.open(response.data.download_url, '_blank')
      }
    } else if (response.data.status === 'failed') {
      showError('Export failed: ' + (response.data.error || 'Unknown error'))
    } else if (response.data.status === 'processing') {
      // Continue polling
      setTimeout(() => pollExportStatus(jobId), 5000)
    }
  } catch (err) {
    console.error('Error polling export status:', err)
  }
}

const bulkDeleteEvents = async (eventIds) => {
  try {
    const deleteData = {
      event_ids: eventIds,
      delete_visitor_intents: true
    }
    
    const response = await buyerIntentService.bulkDeleteEvents(deleteData)
    showSuccess(`Successfully deleted ${response.data.success_count} events`)
    refreshData()
  } catch (err) {
    showError(err.message || 'Failed to delete events')
  }
}

const generateReport = async (reportType = 'summary') => {
  try {
    const reportData = {
      type: reportType,
      date_from: filters.value.date_from || '',
      date_to: filters.value.date_to || '',
      filters: filters.value
    }
    
    const response = await buyerIntentService.createReport(reportData)
    
    if (response.data && response.data.job_id) {
      showSuccess('Report job created successfully')
      reportJobStatus.value = response.data
      showReportModal.value = true
      // Start polling for report status
      pollReportStatus(response.data.job_id)
    } else {
      showError('Report failed: No job ID provided')
    }
    
    return response.data
  } catch (err) {
    showError(err.message || 'Failed to create report job')
  }
}

const pollReportStatus = async (jobId) => {
  try {
    const response = await buyerIntentService.getReportStatus(jobId)
    reportJobStatus.value = response.data
    
    if (response.data.status === 'completed') {
      showSuccess('Report completed successfully')
      // Auto-download when ready
      if (response.data.download_url) {
        window.open(response.data.download_url, '_blank')
      }
    } else if (response.data.status === 'failed') {
      showError('Report failed: ' + (response.data.error || 'Unknown error'))
    } else if (response.data.status === 'processing') {
      // Continue polling
      setTimeout(() => pollReportStatus(jobId), 5000)
    }
  } catch (err) {
    console.error('Error polling report status:', err)
  }
}

const updateTrackingSettings = async (settings) => {
  try {
    const response = await buyerIntentService.updateTrackingSettings(settings)
    showSuccess('Settings updated successfully')
    return response.data
  } catch (err) {
    showError(err.message || 'Failed to update settings')
  }
}

// Enhanced event management methods
const viewEventDetails = async (eventId) => {
  try {
    const response = await buyerIntentService.getEvent(eventId)
    // Display event details in a modal or navigate to details page
    console.log('Event details:', response.data)
    return response.data
  } catch (err) {
    showError(err.message || 'Failed to load event details')
  }
}

const updateEventScore = async (eventId, newScore, notes) => {
  try {
    const updateData = {
      intent_score: newScore,
      metadata: {
        updated_reason: 'Manual update',
        sales_notes: notes
      }
    }
    
    const response = await buyerIntentService.updateEvent(eventId, updateData)
    showSuccess('Event updated successfully')
    refreshData()
    return response.data
  } catch (err) {
    showError(err.message || 'Failed to update event')
  }
}

const deleteEvent = async (eventId) => {
  try {
    await buyerIntentService.deleteEvent(eventId)
    showSuccess('Event deleted successfully')
    refreshData()
  } catch (err) {
    showError(err.message || 'Failed to delete event')
  }
}

// Module integration methods
const loadContactIntent = async (contactId) => {
  try {
    const response = await buyerIntentService.getContactIntent(contactId)
    return response.data
  } catch (err) {
    console.error('Failed to load contact intent:', err)
    throw err
  }
}

const loadCompanyIntent = async (companyId) => {
  try {
    const response = await buyerIntentService.getCompanyIntent(companyId)
    return response.data
  } catch (err) {
    console.error('Failed to load company intent:', err)
    throw err
  }
}

const loadCampaignIntent = async (campaignId) => {
  try {
    const response = await buyerIntentService.getCampaignIntent(campaignId)
    return response.data
  } catch (err) {
    console.error('Failed to load campaign intent:', err)
    throw err
  }
}

// Helper methods with timezone conversion
const getIntentLevelColor = (level) => buyerIntentHelpers.getIntentLevelColor(level)
const getScoreColor = (score) => buyerIntentHelpers.getScoreColor(score)
const getActionIcon = (action) => buyerIntentHelpers.getActionIcon(action)
const getPageTitle = (url) => buyerIntentHelpers.getPageTitle(url)
const formatNumber = (num) => buyerIntentHelpers.formatNumber(num)

// Enhanced timestamp formatting with timezone conversion
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A'
  
  try {
    // Convert UTC timestamp to local browser timezone
    const date = new Date(timestamp)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }
    
    // Format to local timezone
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  } catch (error) {
    console.error('Error formatting timestamp:', error)
    return 'Invalid Date'
  }
}

// Enhanced error handling
const handleError = (error, context = 'Unknown') => {
  console.error(`❌ Error in ${context}:`, error)
  
  // Send error to console with context
  console.group(`🚨 Error Context: ${context}`)
  console.error('Error details:', error)
  console.error('Stack trace:', error.stack)
  console.groupEnd()
  
  // Show non-blocking toast notification
  if (error.message) {
    showError(`Error in ${context}: ${error.message}`)
  } else {
    showError(`An error occurred in ${context}. Check console for details.`)
  }
}

// Security: Validate origin for tracking
const isValidOrigin = (url) => {
  try {
    const urlObj = new URL(url)
    const allowedOrigins = [
      window.location.origin,
      'http://localhost:5173',
      'http://localhost:8000',
      'https://yourdomain.com' // Add your production domain
    ]
    
    return allowedOrigins.includes(urlObj.origin)
  } catch (error) {
    return false
  }
}

const getActionName = (actionId) => {
  const action = trackingActions.value.find(a => a.id === actionId)
  return action ? action.name : actionId
}

// Format action names for scoring config
const formatActionName = (actionKey) => {
  const actionNameMap = {
    'form_submit': 'Form Submission',
    'form_fill': 'Form Fill',
    'page_view': 'Page View',
    'visit': 'Visit',
    'demo_request': 'Demo Request',
    'pricing_view': 'Pricing View',
    'contact_view': 'Contact View',
    'product_view': 'Product View',
    'download': 'Download',
    'click': 'Click',
    'scroll': 'Scroll',
    'time_on_page': 'Time on Page',
    'bounce': 'Bounce',
    'conversion': 'Conversion',
    'email_open': 'Email Open',
    'email_click': 'Email Click',
    'blog_read': 'Blog Read',
    'trial_signup': 'Trial Signup',
    'contact_form': 'Contact Form',
    'campaign_view': 'Campaign View',
    'video_watch': 'Video Watch',
    'whitepaper_download': 'Whitepaper Download',
    'case_study_view': 'Case Study View',
    'product_tour': 'Product Tour',
    'purchase_intent': 'Purchase Intent',
    'chat_start': 'Chat Start',
    'webinar_register': 'Webinar Register',
    'newsletter_signup': 'Newsletter Signup',
    'social_share': 'Social Share',
    'search': 'Search',
    'cart_add': 'Add to Cart',
    'checkout_start': 'Checkout Start',
    'purchase': 'Purchase'
  }
  
  return actionNameMap[actionKey] || actionKey
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Test API availability
const testAPIEndpoints = async () => {
  console.log('Testing API endpoints availability...')
  
  const endpoints = [
    { name: 'Intent Signals', method: 'getIntent', params: {} },
    { name: 'Intent Analytics', method: 'getAnalytics', params: {} },
    { name: 'Available Actions', method: 'getActions', params: {} },
    { name: 'Intent Levels', method: 'getIntentLevels', params: {} },
    { name: 'Visitor Analytics', method: 'getVisitorAnalytics', params: {} }
  ]
  
  for (const endpoint of endpoints) {
    try {
      const result = await buyerIntentService[endpoint.method](endpoint.params)
      console.log(`✅ ${endpoint.name}: API working`, result)
    } catch (error) {
      console.log(`❌ ${endpoint.name}: API failed`, error.response?.status || error.message)
    }
  }
}

// Lifecycle
onMounted(async () => {
  // Test API endpoints first
  await testAPIEndpoints()
  
  // Then load data
  await Promise.all([
    loadIntentData(),
    loadAnalytics(),
    loadVisitorIntentAnalytics(),
    loadTrackingActions(),
    loadIntentLevels(),
    loadContacts(),
    loadCompanies(),
    loadCampaigns(),
    loadCampaignStats(),
    loadScoringConfig(),
    loadExportJobs(),
    loadReportJobs()
  ])
  
  // Polling disabled to prevent heavy API load
  console.log('⏸️ Automatic polling disabled - use Refresh Data button for updates')
  
  // Set up visibility change listener (disabled)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  // Clean up polling
  stopPolling()
  
  // Remove event listeners
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>
