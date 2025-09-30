<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Professional Header Section -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumbs -->
        <nav class="flex py-3" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <router-link to="/marketing" class="text-gray-400 hover:text-gray-500 text-sm">
                {{ $t('marketing.common.breadcrumbs.marketing') }}
              </router-link>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-900">{{ $t('marketing.lead_scoring.title') }}</span>
              </div>
            </li>
          </ol>
        </nav>

        <!-- Page Header -->
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-semibold text-gray-900">{{ $t('marketing.lead_scoring.title') }}</h1>
              <p class="mt-1 text-sm text-gray-500">{{ $t('marketing.lead_scoring.description') }}</p>
            </div>
            <div class="flex items-center space-x-3">
              <!-- Import/Export Actions -->
              <div class="relative">
                <button
                  @click="showImportExportDropdown = !showImportExportDropdown"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {{ $t('marketing.lead_scoring.import_export.title') }}
                  <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  v-if="showImportExportDropdown"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                >
                  <div class="py-1">
                    <button
                      @click="exportRules"
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <svg class="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {{ $t('marketing.lead_scoring.import_export.export') }}
                    </button>
                    <button
                      @click="exportContactsWithScores"
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <svg class="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Export Contacts with Scores
                    </button>
                    <button
                      @click="openImportModal"
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <svg class="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      {{ $t('marketing.lead_scoring.import_export.import') }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Recalculate Score -->
              <button
                @click="openRecalculateModal"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {{ $t('marketing.lead_scoring.recalculate.title') }}
              </button>

              <!-- Create Rule Primary Action -->
              <button
                @click="openCreateRuleModal"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {{ $t('marketing.lead_scoring.rules.create_rule') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      <!-- Lead Scoring Overview Section -->
      <div class="mb-8">
        <!-- Overview Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <!-- Total Contacts Scored -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">Total Contacts Scored</p>
                <p class="text-3xl font-bold">{{ formatNumber(stats?.total_contacts_scored || 0) }}</p>
                <p class="text-blue-100 text-xs mt-1">
                  <span class="inline-flex items-center">
                    <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    +{{ stats?.new_contacts_this_month || 0 }} this month
                  </span>
                </p>
              </div>
              <div class="p-3 bg-blue-400 bg-opacity-30 rounded-full">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Average Score -->
          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">Average Score</p>
                <p class="text-3xl font-bold">{{ Math.round(stats?.average_score || 0) }}</p>
                <p class="text-green-100 text-xs mt-1">
                  <span class="inline-flex items-center">
                    <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    {{ stats?.score_trend || '+5.2%' }} from last month
                  </span>
                </p>
              </div>
              <div class="p-3 bg-green-400 bg-opacity-30 rounded-full">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- High Score Contacts -->
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm font-medium">High Score Contacts</p>
                <p class="text-3xl font-bold">{{ stats?.high_score_contacts || 0 }}</p>
                <p class="text-purple-100 text-xs mt-1">
                  75+ points • Sales Ready
                </p>
              </div>
              <div class="p-3 bg-purple-400 bg-opacity-30 rounded-full">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Active Rules -->
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100 text-sm font-medium">Active Rules</p>
                <p class="text-3xl font-bold">{{ stats?.active_rules || 0 }}</p>
                <p class="text-orange-100 text-xs mt-1">
                  {{ stats?.inactive_rules || 0 }} inactive rules
                </p>
              </div>
              <div class="p-3 bg-orange-400 bg-opacity-30 rounded-full">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Score Distribution Chart -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Score Distribution</h3>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span>Total Points Awarded: {{ formatNumber(stats?.total_points_awarded || 0) }}</span>
              <span>Conversion Rate: {{ stats?.conversion_rate || 0 }}%</span>
            </div>
          </div>
          
          <!-- Score Range Bars -->
          <div class="space-y-3">
            <div class="flex items-center">
              <div class="w-20 text-sm font-medium text-gray-700">0-25</div>
              <div class="flex-1 mx-4">
                <div class="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div 
                    class="bg-red-400 h-full rounded-full transition-all duration-300"
                    :style="{ width: `${getScorePercentage(stats?.score_distribution?.['0-25'] || 0)}%` }"
                  ></div>
                  <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                    {{ stats?.score_distribution?.['0-25'] || 0 }} contacts
                  </div>
                </div>
              </div>
              <div class="w-16 text-sm text-gray-500 text-right">{{ getScorePercentage(stats?.score_distribution?.['0-25'] || 0) }}%</div>
            </div>
            
            <div class="flex items-center">
              <div class="w-20 text-sm font-medium text-gray-700">26-50</div>
              <div class="flex-1 mx-4">
                <div class="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div 
                    class="bg-yellow-400 h-full rounded-full transition-all duration-300"
                    :style="{ width: `${getScorePercentage(stats?.score_distribution?.['26-50'] || 0)}%` }"
                  ></div>
                  <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                    {{ stats?.score_distribution?.['26-50'] || 0 }} contacts
                  </div>
                </div>
              </div>
              <div class="w-16 text-sm text-gray-500 text-right">{{ getScorePercentage(stats?.score_distribution?.['26-50'] || 0) }}%</div>
            </div>
            
            <div class="flex items-center">
              <div class="w-20 text-sm font-medium text-gray-700">51-75</div>
              <div class="flex-1 mx-4">
                <div class="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div 
                    class="bg-blue-400 h-full rounded-full transition-all duration-300"
                    :style="{ width: `${getScorePercentage(stats?.score_distribution?.['51-75'] || 0)}%` }"
                  ></div>
                  <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                    {{ stats?.score_distribution?.['51-75'] || 0 }} contacts
                  </div>
                </div>
              </div>
              <div class="w-16 text-sm text-gray-500 text-right">{{ getScorePercentage(stats?.score_distribution?.['51-75'] || 0) }}%</div>
            </div>
            
            <div class="flex items-center">
              <div class="w-20 text-sm font-medium text-gray-700">76-100</div>
              <div class="flex-1 mx-4">
                <div class="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div 
                    class="bg-green-400 h-full rounded-full transition-all duration-300"
                    :style="{ width: `${getScorePercentage(stats?.score_distribution?.['76-100'] || 0)}%` }"
                  ></div>
                  <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                    {{ stats?.score_distribution?.['76-100'] || 0 }} contacts
                  </div>
                </div>
              </div>
              <div class="w-16 text-sm text-gray-500 text-right">{{ getScorePercentage(stats?.score_distribution?.['76-100'] || 0) }}%</div>
            </div>
            
            <div class="flex items-center">
              <div class="w-20 text-sm font-medium text-gray-700">100+</div>
              <div class="flex-1 mx-4">
                <div class="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div 
                    class="bg-purple-400 h-full rounded-full transition-all duration-300"
                    :style="{ width: `${getScorePercentage(stats?.score_distribution?.['100+'] || 0)}%` }"
                  ></div>
                  <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                    {{ stats?.score_distribution?.['100+'] || 0 }} contacts
                  </div>
                </div>
              </div>
              <div class="w-16 text-sm text-gray-500 text-right">{{ getScorePercentage(stats?.score_distribution?.['100+'] || 0) }}%</div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col xl:flex-row gap-6">
        
        <!-- Main Content - Rules Management -->
        <div class="flex-1 min-w-0">
          
          <!-- Bulk Actions Bar (appears when rules are selected) -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div v-if="selectedRules.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm font-medium text-blue-900">
                    {{ selectedRules.length }} {{ selectedRules.length > 1 ? 'rules' : 'rule' }} selected
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="bulkActivateRules"
                    :disabled="bulkActionsLoading"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {{ $t('marketing.lead_scoring.bulk_actions.activate') }}
                  </button>
                  <button
                    @click="bulkDeactivateRules"
                    :disabled="bulkActionsLoading"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {{ $t('marketing.lead_scoring.bulk_actions.deactivate') }}
                  </button>
                  <button
                    @click="openBulkRecalculateModal"
                    :disabled="bulkActionsLoading"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {{ $t('marketing.lead_scoring.bulk_actions.recalculate') }}
                  </button>
                  <button
                    @click="selectedRules = []"
                    class="inline-flex items-center px-2 py-1.5 text-gray-400 hover:text-gray-600"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Rules Table Card -->
          <div class="bg-white shadow-sm rounded-lg border border-gray-200">
            <!-- Table Header -->
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-medium text-gray-900">{{ $t('marketing.lead_scoring.rules.title') }}</h2>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-500">
                    {{ rules.length }} {{ rules.length !== 1 ? 'rules' : 'rule' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="px-6 py-12">
              <div class="text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p class="mt-4 text-sm text-gray-600">{{ $t('marketing.lead_scoring.loading') }}</p>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="px-6 py-12">
              <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 class="text-sm font-medium text-gray-900 mb-2">Failed to load rules</h3>
                <p class="text-sm text-gray-500 mb-4">{{ error }}</p>
                <button
                  @click="loadRules"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="rules.length === 0" class="px-6 py-12">
              <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No rules yet</h3>
                <p class="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                  Create your first rule to start scoring leads.
                </p>
                <button
                  @click="openCreateRuleModal"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your First Rule
                </button>
              </div>
            </div>

            <!-- Professional Rules Table -->
            <div v-else class="overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input
                        type="checkbox"
                        :checked="allRulesSelected"
                        @change="toggleAllRules"
                        class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                      />
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rule Details
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('marketing.lead_scoring.rules.points') }}
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('marketing.lead_scoring.rules.priority') }}
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('marketing.lead_scoring.rules.updated_at') }}
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">{{ $t('marketing.lead_scoring.rules.actions') }}</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="rule in rules"
                    :key="rule.id"
                    :class="['hover:bg-gray-50 transition-colors duration-150', selectedRules.includes(rule.id) ? 'bg-blue-50' : '']"
                  >
                    <td class="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input
                        type="checkbox"
                        :value="rule.id"
                        v-model="selectedRules"
                        class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                      />
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex flex-col">
                        <div class="text-sm font-medium text-gray-900">{{ rule.name }}</div>
                        <div class="text-sm text-gray-500 mt-1">{{ rule.description }}</div>
                        <div class="text-xs text-gray-400 mt-1">
                          {{ formatCondition(rule.condition) }}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          +{{ rule.points }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getPriorityBadgeClass(rule.priority)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {{ getPriorityName(rule.priority) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="rule.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                        <span :class="rule.is_active ? 'bg-green-400' : 'bg-gray-400'" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
                        {{ rule.is_active ? $t('marketing.lead_scoring.rules.active') : $t('marketing.lead_scoring.rules.inactive') }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(rule.updated_at) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-2">
                        <button
                          @click="editRule(rule)"
                          class="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          {{ $t('marketing.lead_scoring.rules.edit_rule') }}
                        </button>
                        <button
                          @click="deleteRule(rule)"
                          class="text-red-600 hover:text-red-900 text-sm"
                        >
                          {{ $t('marketing.lead_scoring.rules.delete_rule') }}
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Analytics Section -->
          <div v-if="rules.length > 0 && leadScoringAnalytics" class="mt-6 space-y-6">
            <!-- Score Distribution Chart -->
            <div class="bg-white shadow-sm rounded-lg border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">{{ $t('marketing.lead_scoring.analytics.score_distribution') }}</h3>
                <p class="text-sm text-gray-500">Distribution of lead scores across all contacts</p>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div v-for="(data, range) in leadScoringAnalytics.score_distribution" :key="range" class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-3 h-3 rounded-full" :class="getScoreRangeColor(range)"></div>
                      <span class="text-sm font-medium text-gray-900">{{ range }} points</span>
                    </div>
                    <div class="flex items-center space-x-4">
                      <div class="text-right">
                        <div class="text-sm font-semibold text-gray-900">{{ formatNumber(data.count) }}</div>
                        <div class="text-xs text-gray-500">{{ data.percentage }}%</div>
                      </div>
                      <div class="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          class="h-2 rounded-full transition-all duration-300" 
                          :class="getScoreRangeColor(range)"
                          :style="{ width: data.percentage + '%' }"
                        ></div>
                      </div>
                      <span :class="data.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'" class="text-xs font-medium w-12 text-right">
                        {{ data.trend }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rule Performance -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Top Performing Rules -->
              <div class="bg-white shadow-sm rounded-lg border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                  <h3 class="text-lg font-medium text-gray-900">{{ $t('marketing.lead_scoring.analytics.top_scoring_rules') }}</h3>
                  <p class="text-sm text-gray-500">Rules that contribute most to scoring</p>
                </div>
                <div class="p-6">
                  <div class="space-y-4">
                    <div v-for="rule in leadScoringAnalytics.top_scoring_rules?.slice(0, 5)" :key="rule.rule_name" class="flex items-center justify-between">
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-gray-900 truncate">{{ rule.rule_name }}</div>
                        <div class="text-xs text-gray-500">{{ rule.times_triggered }} triggers</div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-semibold text-gray-900">{{ formatNumber(rule.points_awarded) }}</div>
                        <div class="text-xs text-gray-500">points awarded</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Company Breakdown -->
              <div class="bg-white shadow-sm rounded-lg border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                  <h3 class="text-lg font-medium text-gray-900">{{ $t('marketing.lead_scoring.analytics.company_breakdown') }}</h3>
                  <p class="text-sm text-gray-500">Average scores by company</p>
                </div>
                <div class="p-6">
                  <div class="space-y-4">
                    <div v-for="company in leadScoringAnalytics.company_breakdown?.slice(0, 5)" :key="company.company" class="flex items-center justify-between">
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-gray-900 truncate">{{ company.company }}</div>
                        <div class="text-xs text-gray-500">{{ company.contacts }} contacts</div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-semibold text-gray-900">{{ Math.round(company.avg_score) }}</div>
                        <div class="text-xs text-gray-500">avg score</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="w-full xl:w-80 space-y-6">
          <!-- Scoring Stats -->
          <div class="bg-white shadow-sm rounded-lg border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">{{ $t('marketing.lead_scoring.stats.title') }}</h3>
            </div>
            <div class="p-6">
              <dl class="space-y-4">
                <div class="flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">{{ $t('marketing.lead_scoring.stats.total_contacts') }}</dt>
                  <dd class="text-sm font-semibold text-gray-900">{{ formatNumber(stats?.total_contacts_scored || 0) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">{{ $t('marketing.lead_scoring.stats.average_score') }}</dt>
                  <dd class="text-sm font-semibold text-gray-900">{{ Math.round(stats?.average_score || 0) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">{{ $t('marketing.lead_scoring.stats.high_score') }} (75+)</dt>
                  <dd class="text-sm font-semibold text-red-600">{{ stats?.high_score_contacts || 0 }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">{{ $t('marketing.lead_scoring.stats.medium_score') }} (50-74)</dt>
                  <dd class="text-sm font-semibold text-yellow-600">{{ stats?.medium_score_contacts || 0 }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">{{ $t('marketing.lead_scoring.stats.low_score') }} (0-49)</dt>
                  <dd class="text-sm font-semibold text-blue-600">{{ stats?.low_score_contacts || 0 }}</dd>
                </div>
                <div class="flex justify-between pt-4 border-t border-gray-200">
                  <dt class="text-sm font-medium text-gray-500">{{ $t('marketing.lead_scoring.stats.active_rules') }}</dt>
                  <dd class="text-sm font-semibold text-green-600">{{ stats?.active_rules || 0 }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Top Scoring Contacts -->
          <div class="bg-white shadow-sm rounded-lg border border-gray-200" data-section="top-contacts">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">{{ $t('marketing.lead_scoring.top_contacts.title') }}</h3>
                <div class="flex items-center space-x-2">
                  <button
                    @click="loadTopContacts"
                    class="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Refresh
                  </button>
                  <span class="text-xs text-gray-500">•</span>
                  <span class="text-xs text-gray-500">Showing top 10</span>
                </div>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="(contact, index) in topContacts.slice(0, 10)"
                  :key="contact.id"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
                  @click="viewContactDetails(contact)"
                >
                  <div class="flex items-center space-x-4 flex-1 min-w-0">
                    <!-- Rank Badge -->
                    <div class="flex-shrink-0">
                      <div :class="getRankBadgeClass(index + 1)" class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">
                        {{ index + 1 }}
                      </div>
                    </div>
                    
                    <!-- Contact Info -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-2">
                        <div class="text-sm font-medium text-gray-900 truncate">
                          {{ contact.name || `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 'Unknown Contact' }}
                        </div>
                        <div v-if="getScoreLevel(contact.score)" :class="getScoreLevelClass(contact.score)" class="px-2 py-0.5 rounded-full text-xs font-medium">
                          {{ getScoreLevel(contact.score) }}
                        </div>
                      </div>
                      <div class="text-xs text-gray-500 truncate">{{ contact.company || contact.email }}</div>
                      <div v-if="contact.last_updated" class="text-xs text-gray-400">
                        Last activity: {{ formatDate(contact.last_updated) }}
                      </div>
                    </div>
                    
                    <!-- Score Info -->
                    <div class="text-right flex-shrink-0">
                      <div class="flex items-center space-x-2">
                        <div>
                          <div :class="getScoreColor(contact.score)" class="text-lg font-bold">
                            {{ contact.score }}
                          </div>
                          <div class="text-xs text-gray-500">points</div>
                        </div>
                        <div v-if="contact.score_change" class="text-center">
                          <div :class="getScoreChangeColor(contact.score_change)" class="text-sm font-medium">
                            {{ contact.score_change }}
                          </div>
                          <div class="text-xs text-gray-400">change</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- View All Contacts Button -->
                <div class="pt-4 border-t border-gray-200">
                  <button 
                    @click="router.push('/contacts?filter=scored')"
                    class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    View All Scored Contacts ({{ formatNumber(stats?.total_contacts_scored || 0) }})
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white shadow-sm rounded-lg border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div class="p-6 space-y-3">
              <button
                @click="openRecalculateModal"
                class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {{ $t('marketing.lead_scoring.recalculate.title') }}
              </button>
              <button
                @click="openCreateRuleModal"
                class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Rule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Create/Edit Rule Modal -->
    <RuleModal
      v-if="showRuleModal"
      :is-editing="!!editingRule"
      :rule="editingRule"
      :event-types="eventTypes"
      :operators="operators"
      :time-window-options="timeWindowOptions"
      @close="closeRuleModal"
      @save="saveRule"
    />

    <!-- Recalculate Score Modal -->
    <RecalculateModal
      v-if="showRecalculateModal"
      ref="recalculateModalRef"
      @close="closeRecalculateModal"
      @recalculate="handleRecalculateScore"
    />

    <!-- Bulk Recalculate Modal -->
    <BulkRecalculateModal
      v-if="showBulkRecalculateModal"
      @close="closeBulkRecalculateModal"
      @recalculate="bulkRecalculateScores"
    />

    <!-- Import Modal -->
    <ImportModal
      v-if="showImportModal"
      @close="closeImportModal"
      @import="importRules"
    />

    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-if="showConfirmModal"
      :title="$t('marketing.lead_scoring.confirmations.delete_title')"
      :message="`Are you sure you want to delete '${ruleToDelete?.name}'? This action cannot be undone and will stop scoring based on this rule.`"
      @confirm="confirmDelete"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { leadScoringService, leadScoringHelpers } from '@/services/leadScoring'
import { contactsAPI } from '@/services/api'
import { error as showError, success as showSuccess } from '@/utils/notifications'
// import { useClickOutside } from '@/composables/useClickOutside'

// Import components (to be created)
import RuleModal from '@/components/modals/RuleModal.vue'
import RecalculateModal from '@/components/modals/RecalculateModal.vue'
import BulkRecalculateModal from '@/components/modals/BulkRecalculateModal.vue'
import ImportModal from '@/components/modals/ImportModal.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'

const { t } = useI18n()
const router = useRouter()

// Reactive state
const loading = ref(false)
const error = ref(null)
const rules = ref([])
const stats = ref(null)
const topContacts = ref([])
const leadScoringAnalytics = ref(null)
const bulkActionsLoading = ref(false)

// Form data - Initialize with fallback data immediately
const eventTypes = ref([
  { id: 'email_open', name: 'Email Open', description: 'Contact opened an email' },
  { id: 'email_click', name: 'Email Click', description: 'Contact clicked a link in an email' },
  { id: 'page_view', name: 'Page View', description: 'Contact viewed a page' },
  { id: 'form_submit', name: 'Form Submit', description: 'Contact submitted a form' },
  { id: 'download', name: 'Download', description: 'Contact downloaded a resource' },
  { id: 'demo_request', name: 'Demo Request', description: 'Contact requested a demo' },
  { id: 'pricing_view', name: 'Pricing View', description: 'Contact viewed pricing page' },
  { id: 'trial_signup', name: 'Trial Signup', description: 'Contact signed up for trial' },
  { id: 'webinar_attend', name: 'Webinar Attend', description: 'Contact attended a webinar' },
  { id: 'social_engagement', name: 'Social Engagement', description: 'Contact engaged on social media' }
])

const operators = ref([
  { id: 'equals', name: 'Equals', description: 'Value equals exactly' },
  { id: 'not_equals', name: 'Not Equals', description: 'Value does not equal' },
  { id: 'greater_than', name: 'Greater Than', description: 'Value is greater than' },
  { id: 'less_than', name: 'Less Than', description: 'Value is less than' },
  { id: 'greater_than_or_equal', name: 'Greater Than or Equal', description: 'Value is greater than or equal to' },
  { id: 'less_than_or_equal', name: 'Less Than or Equal', description: 'Value is less than or equal to' },
  { id: 'contains', name: 'Contains', description: 'Value contains text' },
  { id: 'not_contains', name: 'Not Contains', description: 'Value does not contain text' }
])

// Time window options
const timeWindowOptions = ref([
  { value: '7_days', label: '7 Days' },
  { value: '14_days', label: '14 Days' },
  { value: '30_days', label: '30 Days' },
  { value: '90_days', label: '90 Days' }
])

// Selection state
const selectedRules = ref([])
const showImportExportDropdown = ref(false)

// Modal states
const showRuleModal = ref(false)
const showRecalculateModal = ref(false)
const showConfirmModal = ref(false)
const showImportModal = ref(false)
const showBulkRecalculateModal = ref(false)
const editingRule = ref(null)
const ruleToDelete = ref(null)
const recalculateModalRef = ref(null)

// Computed properties
const allRulesSelected = computed(() => {
  return rules.value.length > 0 && selectedRules.value.length === rules.value.length
})

// Methods
const loadRules = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await leadScoringService.getScoringRules({ is_active: null })
    rules.value = response.data || []
  } catch (err) {
    error.value = err.message || 'Failed to load scoring rules'
    showError(error.value)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    // Try to load enhanced stats first, fallback to basic stats
    try {
      const response = await leadScoringService.getEnhancedScoringStats()
      stats.value = response.data
    } catch (enhancedError) {
      console.log('Enhanced stats not available, using basic stats')
      const response = await leadScoringService.getScoringStats()
      stats.value = response.data
    }
  } catch (err) {
    console.error('Failed to load stats:', err)
  }
}

const loadTopContacts = async () => {
  try {
    const response = await leadScoringService.getTopContacts(10)
    topContacts.value = response.data || []
  } catch (err) {
    console.error('Failed to load top contacts:', err)
  }
}

const loadLeadScoringAnalytics = async () => {
  try {
    const response = await leadScoringService.getLeadScoringAnalytics()
    leadScoringAnalytics.value = response.data
  } catch (err) {
    console.error('Failed to load lead scoring analytics:', err)
  }
}

const loadEventTypes = async () => {
  try {
    const response = await leadScoringService.getEventTypes()
    console.log('Event types API response:', response)
    
    if (response && response.data && response.data.length > 0) {
      eventTypes.value = response.data
      console.log('Loaded event types from API:', eventTypes.value)
    } else {
      console.log('Using fallback event types data')
    }
  } catch (err) {
    console.error('Failed to load event types from API, using fallback:', err)
  }
}

const loadOperators = async () => {
  try {
    const response = await leadScoringService.getOperators()
    console.log('Operators API response:', response)
    
    if (response && response.data && response.data.length > 0) {
      operators.value = response.data
      console.log('Loaded operators from API:', operators.value)
    } else {
      console.log('Using fallback operators data')
    }
  } catch (err) {
    console.error('Failed to load operators from API, using fallback:', err)
  }
}

const openCreateRuleModal = async () => {
  editingRule.value = null
  showRuleModal.value = true
}

const editRule = async (rule) => {
  editingRule.value = rule
  showRuleModal.value = true
}

const closeRuleModal = () => {
  showRuleModal.value = false
  editingRule.value = null
}

const saveRule = async (ruleData) => {
  try {
    if (editingRule.value) {
      await leadScoringService.updateScoringRule(editingRule.value.id, ruleData)
      showSuccess('Scoring rule updated successfully')
    } else {
      await leadScoringService.createScoringRule(ruleData)
      showSuccess('Scoring rule created successfully')
    }

    closeRuleModal()
    loadRules()
    loadStats()
  } catch (err) {
    showError(err.message || 'Failed to save scoring rule')
  }
}

const deleteRule = (rule) => {
  ruleToDelete.value = rule
  showConfirmModal.value = true
}

const confirmDelete = async () => {
  if (!ruleToDelete.value) return
  
  try {
    await leadScoringService.deleteScoringRule(ruleToDelete.value.id)
    showSuccess('Scoring rule deleted successfully')
    closeConfirmModal()
    loadRules()
    loadStats()
  } catch (err) {
    showError(err.message || 'Failed to delete scoring rule')
  }
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  ruleToDelete.value = null
}

const openRecalculateModal = () => {
  showRecalculateModal.value = true
}

const closeRecalculateModal = () => {
  showRecalculateModal.value = false
}

const handleRecalculateScore = async (contactIdentifier) => {
  try {
    let contactId = contactIdentifier
    let contactInfo = { name: '', email: '' }
    
    // Check if the identifier is a number (contact ID) or email
    if (isNaN(contactIdentifier)) {
      // It's an email, search for contact first
      const contactResponse = await contactsAPI.searchContacts(contactIdentifier, { limit: 1 })
      
      if (!contactResponse.data?.data || contactResponse.data.data.length === 0) {
        const errorMsg = `Contact not found with email: ${contactIdentifier}`
        showError(errorMsg)
        recalculateModalRef.value?.setError(errorMsg)
        return
      }
      
      const contact = contactResponse.data.data[0]
      contactId = contact.id
      contactInfo = { name: contact.name, email: contact.email }
    } else {
      // It's a contact ID, use it directly
      contactId = parseInt(contactIdentifier)
    }
    
    // Now recalculate using contact ID endpoint
    const result = await leadScoringService.recalculateScore(contactId)
    
    // Handle the backend response structure you provided
    const responseData = result.data || result
    
    const recalculationResult = {
      contact_name: responseData.contact_name || contactInfo.name || 'Unknown',
      email: responseData.email || contactInfo.email || 'Unknown',
      score: responseData.lead_score !== undefined ? responseData.lead_score : (responseData.score || 'Updated'),
      previous_score: responseData.previous_score || 'N/A',
      rules_applied: responseData.rules_applied || [],
      rules_count: responseData.rules_count || 0
    }
    
    // Show success message with detailed info
    const successMessage = `Score recalculated for ${recalculationResult.contact_name}: ${recalculationResult.score} points (${recalculationResult.rules_count} rules applied)`
    showSuccess(successMessage)
    
    // Set result in modal
    recalculateModalRef.value?.setResult(recalculationResult)
    
    // Reload data to reflect changes and highlight the updated contact
    loadTopContacts()
    loadStats()
    
    // Scroll to top contacts section to show the updated data
    setTimeout(() => {
      const topContactsSection = document.querySelector('[data-section="top-contacts"]')
      if (topContactsSection) {
        topContactsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }, 500)
    
    return recalculationResult
  } catch (err) {
    console.error('Recalculate error:', err)
    const errorMsg = err.response?.status === 404 
      ? `Contact not found with identifier: ${contactIdentifier}`
      : (err.message || 'Failed to recalculate score')
    
    showError(errorMsg)
    recalculateModalRef.value?.setError(errorMsg)
  }
}

// Keep the original function for backward compatibility with other components
const recalculateScore = handleRecalculateScore

// Selection methods
const toggleAllRules = () => {
  if (allRulesSelected.value) {
    selectedRules.value = []
  } else {
    selectedRules.value = rules.value.map(rule => rule.id)
  }
}

// Bulk action methods
const bulkActivateRules = async () => {
  if (selectedRules.value.length === 0) return
  
  bulkActionsLoading.value = true
  try {
    await leadScoringService.bulkActivateRules(selectedRules.value)
    showSuccess(`${selectedRules.value.length} rules activated successfully`)
    selectedRules.value = []
    loadRules()
    loadStats()
  } catch (err) {
    showError(err.message || 'Failed to activate rules')
  } finally {
    bulkActionsLoading.value = false
  }
}

const bulkDeactivateRules = async () => {
  if (selectedRules.value.length === 0) return
  
  bulkActionsLoading.value = true
  try {
    await leadScoringService.bulkDeactivateRules(selectedRules.value)
    showSuccess(`${selectedRules.value.length} rules deactivated successfully`)
    selectedRules.value = []
    loadRules()
    loadStats()
  } catch (err) {
    showError(err.message || 'Failed to deactivate rules')
  } finally {
    bulkActionsLoading.value = false
  }
}

const openBulkRecalculateModal = () => {
  showBulkRecalculateModal.value = true
}

const closeBulkRecalculateModal = () => {
  showBulkRecalculateModal.value = false
}

const bulkRecalculateScores = async (contactEmails) => {
  try {
    // Parse contact emails from textarea
    const emails = contactEmails
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email !== '' && email.includes('@'))
    
    if (emails.length === 0) {
      showError('Please enter at least one valid email address')
      return
    }
    
    // For each email, find contact and recalculate
    let processed = 0
    for (const email of emails) {
      try {
        const contactResponse = await contactsAPI.searchContacts(email, { limit: 1 })
        if (contactResponse.data?.data && contactResponse.data.data.length > 0) {
          const contact = contactResponse.data.data[0]
          await leadScoringService.recalculateScore(contact.id)
          processed++
        }
      } catch (err) {
        console.error(`Failed to recalculate for ${email}:`, err)
      }
    }
    
    showSuccess(`Scores recalculated for ${processed} out of ${emails.length} contacts`)
    closeBulkRecalculateModal()
    loadTopContacts()
  } catch (err) {
    showError(err.message || 'Failed to bulk recalculate scores')
  }
}

// Import/Export methods
const exportRules = async () => {
  try {
    const blob = await leadScoringService.exportRules()
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `lead-scoring-rules-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    showSuccess('Rules exported successfully')
    showImportExportDropdown.value = false
  } catch (err) {
    showError(err.message || 'Failed to export rules')
  }
}

const openImportModal = () => {
  showImportModal.value = true
  showImportExportDropdown.value = false
}

const closeImportModal = () => {
  showImportModal.value = false
}

const importRules = async (file) => {
  try {
    const result = await leadScoringService.importRules(file)
    showSuccess(`Successfully imported ${result.imported || 0} rules`)
    closeImportModal()
    loadRules()
    loadStats()
  } catch (err) {
    showError(err.message || 'Failed to import rules')
  }
}

const exportContactsWithScores = async () => {
  try {
    const blob = await leadScoringService.exportContactsWithScores()
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `contacts-with-scores-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    showSuccess('Contacts with scores exported successfully')
    showImportExportDropdown.value = false
  } catch (err) {
    showError(err.message || 'Failed to export contacts with scores')
  }
}

const viewContactDetails = (contact) => {
  router.push(`/contacts/${contact.id}`)
}

// Helper methods
const getPriorityName = (priority) => leadScoringHelpers.getPriorityName(priority)
const getPriorityBadgeClass = (priority) => {
  const classes = {
    1: 'bg-red-100 text-red-800',
    2: 'bg-orange-100 text-orange-800', 
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-blue-100 text-blue-800',
    5: 'bg-gray-100 text-gray-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const getScoreColor = (score) => leadScoringHelpers.getScoreColor(score)
const getScoreChangeColor = (change) => leadScoringHelpers.getScoreChangeColor(change)
const formatDate = (dateString) => leadScoringHelpers.formatDate(dateString)
const formatNumber = (num) => leadScoringHelpers.formatNumber(num)
const formatCondition = (condition) => leadScoringHelpers.formatCondition(condition)

const getScoreRangeColor = (range) => {
  const colors = {
    '0-25': 'bg-gray-400',
    '26-50': 'bg-blue-400',
    '51-75': 'bg-yellow-400',
    '76-100': 'bg-orange-400',
    '100+': 'bg-red-400'
  }
  return colors[range] || 'bg-gray-400'
}

const getScorePercentage = (count) => {
  const total = stats.value?.total_contacts_scored || 1
  return total > 0 ? Math.round((count / total) * 100) : 0
}

const getRankBadgeClass = (rank) => {
  if (rank <= 3) return 'bg-yellow-100 text-yellow-800'
  if (rank <= 5) return 'bg-blue-100 text-blue-800'
  return 'bg-gray-100 text-gray-800'
}

const getScoreLevel = (score) => {
  if (score >= 100) return 'Elite'
  if (score >= 75) return 'Hot'
  if (score >= 50) return 'Warm'
  if (score >= 25) return 'Cool'
  return 'Cold'
}

const getScoreLevelClass = (score) => {
  if (score >= 100) return 'bg-purple-100 text-purple-800'
  if (score >= 75) return 'bg-red-100 text-red-800'
  if (score >= 50) return 'bg-orange-100 text-orange-800'
  if (score >= 25) return 'bg-yellow-100 text-yellow-800'
  return 'bg-gray-100 text-gray-800'
}

// Handle click outside for dropdown
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showImportExportDropdown.value = false
  }
}

// Lifecycle
onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await Promise.all([
    loadRules(),
    loadStats(),
    loadTopContacts(),
    loadLeadScoringAnalytics(),
    loadEventTypes(),
    loadOperators()
  ])
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>