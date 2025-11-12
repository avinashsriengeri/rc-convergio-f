<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- Enhanced Header with Real-time Stats -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumbs -->
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
                <span class="ml-4 text-sm font-medium text-gray-900">{{ $t('marketing.lead_scoring.title') }}</span>
              </div>
            </li>
          </ol>
        </nav>

        <!-- Enhanced Header with Quick Stats -->
        <div class="flex justify-between items-center pb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 flex items-center">
              <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {{ $t('marketing.lead_scoring.title') }}
            </h1>
            <p class="mt-2 text-lg text-gray-600">{{ $t('marketing.lead_scoring.subtitle') }}</p>
          </div>
          
          <!-- Quick Stats Cards -->
          <div class="flex space-x-4">
            <div class="bg-blue-50 rounded-lg px-4 py-3 text-center">
              <div class="text-2xl font-bold text-blue-600">{{ formatNumber(stats?.contacts_with_score || stats?.scored_contacts || 0) }}</div>
              <div class="text-sm text-blue-600">Total Scored</div>
            </div>
            <div class="bg-green-50 rounded-lg px-4 py-3 text-center">
              <div class="text-2xl font-bold text-green-600">{{ stats?.high_score_contacts || stats?.high_score || 0 }}</div>
              <div class="text-sm text-green-600">Hot Leads</div>
            </div>
            <div class="bg-orange-50 rounded-lg px-4 py-3 text-center">
              <div class="text-2xl font-bold text-orange-600">{{ stats?.active_rules || 0 }}</div>
              <div class="text-sm text-orange-600">Active Rules</div>
            </div>
          </div>
        </div>

        <!-- Action Bar -->
        <div class="flex justify-between items-center pb-6">
          <div class="flex space-x-3">
            <button
              @click="openCreateRuleModal"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {{ $t('marketing.lead_scoring.rules.create_rule') }}
            </button>
            <button
              @click="openBulkRecalculateModal"
              class="bg-purple-900 hover:bg-purple-900 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Bulk Recalculate
            </button>
            <button
              @click="openTemplatesModal"
              class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Templates
            </button>
            
            <button
              @click="openExportModal"
              class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Data
            </button>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Manual Refresh Button -->
            <button
              @click="refreshAll"
              :disabled="loading"
              class="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ loading ? 'Refreshing...' : 'Refresh Data' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Enhanced Dashboard Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <!-- Main Content - Rules Management -->
        <div class="xl:col-span-3">
          <!-- Rules Management Card -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <!-- Enhanced Table Header -->
            <div class="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 flex items-center">
                    <svg class="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ $t('marketing.lead_scoring.rules.title') }}
                  </h3>
                  <p class="text-sm text-gray-600 mt-1">Manage your lead scoring rules and automation</p>
                </div>
                <div class="flex items-center space-x-3">
                  <!-- Search -->
                  <div class="relative">
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search rules..."
                      class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  <!-- Filter Dropdown -->
                  <select
                    v-model="statusFilter"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Rules</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="p-12 text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p class="mt-4 text-gray-600">{{ $t('marketing.lead_scoring.loading') }}</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="p-12 text-center">
              <div class="text-red-600 mb-4">
                <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.lead_scoring.error') }}</h3>
              <button
                @click="loadRules"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {{ $t('common.marketing_overview.retry_button') }}
              </button>
            </div>

            <!-- Enhanced Empty State -->
            <div v-else-if="rules.length === 0" class="p-16 text-center">
              <div class="max-w-md mx-auto">
                <!-- Professional Empty State Icon -->
                <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <h3 class="text-2xl font-bold text-gray-900 mb-3">No Scoring Rules Yet</h3>
                <p class="text-lg text-gray-600 mb-8 leading-relaxed">
                  Create your first lead scoring rule to automatically prioritize and score your leads based on their behavior and engagement.
                </p>
                
                <!-- Feature Benefits -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div class="text-center p-4 bg-blue-50 rounded-lg">
                    <div class="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h4 class="text-sm font-semibold text-gray-900">Auto-Score Leads</h4>
                    <p class="text-xs text-gray-600">Automatically score leads based on actions</p>
                  </div>
                  
                  <div class="text-center p-4 bg-green-50 rounded-lg">
                    <div class="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 class="text-sm font-semibold text-gray-900">Prioritize Hot Leads</h4>
                    <p class="text-xs text-gray-600">Focus on high-scoring prospects first</p>
                  </div>
                  
                  <div class="text-center p-4 bg-purple-50 rounded-lg">
                    <div class="w-8 h-8 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 class="text-sm font-semibold text-gray-900">Boost Conversions</h4>
                    <p class="text-xs text-gray-600">Increase sales with better lead quality</p>
                  </div>
                </div>
                
                <!-- Call to Action -->
                <button
                  @click="openCreateRuleModal"
                  class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your First Rule
                </button>
                
                <p class="text-sm text-gray-500 mt-4">
                  Get started in minutes with our easy rule builder
                </p>
              </div>
            </div>

            <!-- Enhanced Rules Table -->
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Rule Details
                      </div>
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Points
                      </div>
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Priority
                      </div>
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Status
                      </div>
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Last Updated
                      </div>
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="rule in filteredRules"
                    :key="rule.id"
                    class="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td class="px-6 py-6">
                      <div class="flex items-start">
                        <div class="flex-shrink-0">
                          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div class="ml-4 flex-1">
                          <div class="text-sm font-semibold text-gray-900">{{ rule.name }}</div>
                          <div class="text-sm text-gray-600 mt-1">{{ rule.description || 'No description provided' }}</div>
                          <div class="text-xs text-gray-500 mt-1">
                            {{ rule.condition_description || 'Condition not specified' }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-6 whitespace-nowrap">
                      <div class="flex items-center">
                        <span class="text-2xl font-bold text-blue-600">{{ rule.points }}</span>
                        <span class="ml-2 text-sm text-gray-500">points</span>
                      </div>
                    </td>
                    <td class="px-6 py-6 whitespace-nowrap">
                      <span :class="getPriorityColor(rule.priority)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                        </svg>
                        Priority {{ rule.priority }}
                      </span>
                    </td>
                    <td class="px-6 py-6 whitespace-nowrap">
                      <div class="flex items-center">
                        <span :class="getStatusColor(rule.is_active)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                          <div :class="rule.is_active ? 'bg-green-400' : 'bg-gray-400'" class="w-2 h-2 rounded-full mr-2"></div>
                          {{ rule.is_active ? 'Active' : 'Inactive' }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-6 whitespace-nowrap text-sm text-gray-600">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ formatDate(rule.updated_at) }}
                      </div>
                    </td>
                    <td class="px-6 py-6 whitespace-nowrap text-sm font-medium">
                      <div class="flex items-center space-x-3">
                        <button
                          @click="editRule(rule)"
                          class="text-blue-600 hover:text-blue-900 flex items-center px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                        >
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          @click="toggleRuleStatus(rule)"
                          :class="rule.is_active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
                          class="flex items-center px-3 py-1 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                          {{ rule.is_active ? 'Disable' : 'Enable' }}
                        </button>
                        <button
                          @click="deleteRule(rule)"
                          class="text-red-600 hover:text-red-900 flex items-center px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <!-- Right Column - Enhanced Analytics Dashboard -->
        <div class="xl:col-span-1 space-y-6">
          <!-- Real-time Scoring Stats -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <h3 class="text-lg font-bold text-gray-900 flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Live Scoring Stats
              </h3>
              <p class="text-sm text-gray-600 mt-1">Real-time lead scoring metrics</p>
            </div>
            <div class="p-6 space-y-6">
              <!-- Total Contacts -->
              <div class="bg-blue-50 rounded-lg p-4">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="text-sm font-medium text-blue-600">Total Contacts</p>
                    <p class="text-2xl font-bold text-blue-700">{{ formatNumber(stats?.total_contacts || 0) }}</p>
                  </div>
                  <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Average Score -->
              <div class="bg-green-50 rounded-lg p-4">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="text-sm font-medium text-green-600">Average Score</p>
                    <p class="text-2xl font-bold text-green-700">{{ Math.round(stats?.average_score || stats?.avg_score || 0) }}</p>
                  </div>
                  <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Score Distribution -->
              <div class="space-y-3">
                <h4 class="text-sm font-semibold text-gray-700">Score Distribution</h4>
                
                <!-- High Score -->
                <div class="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span class="text-sm font-medium text-red-700">Hot Leads (80+)</span>
                  </div>
                  <span class="text-lg font-bold text-red-600">{{ stats?.high_score_contacts || stats?.high_score || 0 }}</span>
                </div>

                <!-- Medium Score -->
                <div class="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span class="text-sm font-medium text-yellow-700">Warm Leads (40-79)</span>
                  </div>
                  <span class="text-lg font-bold text-yellow-600">{{ stats?.medium_score_contacts || stats?.medium_score || 0 }}</span>
                </div>

                <!-- Low Score -->
                <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span class="text-sm font-medium text-blue-700">Cold Leads (0-39)</span>
                  </div>
                  <span class="text-lg font-bold text-blue-600">{{ stats?.low_score_contacts || stats?.low_score || 0 }}</span>
                </div>
              </div>

              <!-- Active Rules -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Active Rules</p>
                    <p class="text-xl font-bold text-gray-700">{{ stats?.active_rules || 0 }}</p>
                  </div>
                  <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Top Contacts -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 class="text-lg font-bold text-gray-900 flex items-center">
                <svg class="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Top Scoring Contacts
              </h3>
              <p class="text-sm text-gray-600 mt-1">Your hottest leads right now</p>
            </div>
            <div class="p-6">
              <!-- Empty State for Top Contacts -->
              <div v-if="topContacts.length === 0" class="text-center py-8">
                <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 mb-2">No Scored Contacts Yet</h4>
                <p class="text-sm text-gray-600 mb-4">
                  Once you create scoring rules and contacts start engaging, they'll appear here ranked by their lead score.
                </p>
                <button
                  @click="openCreateRuleModal"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Create Your First Rule →
                </button>
              </div>
              
              <!-- Top Contacts List -->
              <div v-else class="space-y-4">
                <div
                  v-for="(contact, index) in (Array.isArray(topContacts) ? topContacts : []).slice(0, 5)"
                  :key="contact.id"
                  class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div class="flex items-center flex-1 min-w-0">
                    <!-- Rank Badge -->
                    <div class="flex-shrink-0 mr-4">
                      <div :class="getRankBadgeColor(index)" class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {{ index + 1 }}
                      </div>
                    </div>
                    
                    <!-- Contact Info -->
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-semibold text-gray-900 truncate">{{ contact.name }}</div>
                      <div class="text-sm text-gray-600 truncate">{{ contact.company }}</div>
                      <div class="text-xs text-gray-500 mt-1">
                        Last activity: {{ formatDate(contact.last_activity) }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- Score Display -->
                  <div class="flex items-center space-x-3">
                    <div class="text-right">
                      <div :class="getScoreColor(contact.score)" class="text-lg font-bold">
                        {{ contact.score }}
                      </div>
                      <div class="text-xs text-gray-500">points</div>
                    </div>
                    
                    <!-- Score Change -->
                    <div class="flex flex-col items-center">
                      <span :class="getScoreChangeColor(contact.score_change || '')" class="text-sm font-medium">
                        {{ contact.score_change || '0' }}
                      </span>
                      <div :class="getScoreCategory(contact.score || 0).color" class="text-xs">
                        {{ getScoreCategory(contact.score || 0).label }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- View All Button -->
                <div v-if="topContacts.length > 5" class="pt-4 border-t border-gray-200">
                  <button class="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2">
                    View All Top Contacts →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Lead Scoring Analytics -->
          <div v-if="leadScoringAnalytics" class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.lead_scoring.analytics.title') }}</h3>
            </div>
            <div class="p-6">
              <div class="space-y-6">
                <!-- Summary Stats -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center p-4 bg-blue-50 rounded-lg">
                    <div class="text-2xl font-bold text-blue-600">{{ formatNumber(leadScoringAnalytics.summary?.total_contacts_scored || 0) }}</div>
                    <div class="text-sm text-blue-600">{{ $t('marketing.lead_scoring.analytics.total_contacts_scored') }}</div>
                  </div>
                  <div class="text-center p-4 bg-green-50 rounded-lg">
                    <div class="text-2xl font-bold text-green-600">{{ leadScoringAnalytics.summary?.conversion_rate || 0 }}%</div>
                    <div class="text-sm text-green-600">{{ $t('marketing.lead_scoring.analytics.conversion_rate') }}</div>
                  </div>
                </div>

                <!-- Score Distribution -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-3">{{ $t('marketing.lead_scoring.analytics.score_distribution') }}</h4>
                  <div class="space-y-2">
                    <div v-for="(data, range) in leadScoringAnalytics.score_distribution" :key="range" class="flex justify-between items-center">
                      <span class="text-sm text-gray-600">{{ range }}</span>
                      <div class="flex items-center space-x-2">
                        <span class="text-sm font-medium">{{ formatNumber(data.count) }}</span>
                        <span class="text-xs text-gray-500">({{ data.percentage }}%)</span>
                        <span :class="data.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'" class="text-xs">
                          {{ data.trend }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Top Scoring Rules -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-3">{{ $t('marketing.lead_scoring.analytics.top_scoring_rules') }}</h4>
                  <div class="space-y-2">
                    <div v-for="rule in leadScoringAnalytics.top_scoring_rules?.slice(0, 3)" :key="rule.rule_name" class="flex justify-between items-center">
                      <span class="text-sm text-gray-600">{{ rule.rule_name }}</span>
                      <div class="flex items-center space-x-2">
                        <span class="text-sm font-medium">{{ formatNumber(rule.points_awarded) }}</span>
                        <span class="text-xs text-gray-500">({{ rule.times_triggered }}x)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Company Breakdown -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-3">{{ $t('marketing.lead_scoring.analytics.company_breakdown') }}</h4>
                  <div class="space-y-2">
                    <div v-for="company in leadScoringAnalytics.company_breakdown?.slice(0, 3)" :key="company.company" class="flex justify-between items-center">
                      <span class="text-sm text-gray-600">{{ company.company }}</span>
                      <div class="flex items-center space-x-2">
                        <span class="text-sm font-medium">{{ company.avg_score }}</span>
                        <span class="text-xs text-gray-500">({{ company.contacts }} contacts)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Create/Edit Rule Modal -->
    <div
      v-if="showRuleModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeRuleModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <!-- Enhanced Modal Header -->
          <div class="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">
                    {{ editingRule ? 'Edit Scoring Rule' : 'Create New Scoring Rule' }}
                  </h3>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ editingRule ? 'Update your lead scoring rule' : 'Set up automated lead scoring based on contact behavior' }}
                  </p>
                </div>
              </div>
              <button
                @click="closeRuleModal"
                class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-8">
            <form @submit.prevent="saveRule">
              <div class="space-y-8">
                <!-- Basic Information Section -->
                <div class="bg-gray-50 rounded-lg p-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Basic Information
                  </h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">Rule Name *</label>
                      <input
                        v-model="ruleForm.name"
                        type="text"
                        required
                        placeholder="e.g., Email Open Rule"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">Points Awarded *</label>
                      <input
                        v-model="ruleForm.points"
                        type="number"
                        min="1"
                        max="100"
                        required
                        placeholder="e.g., 10"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div class="mt-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      v-model="ruleForm.description"
                      placeholder="Describe what this rule does and when it triggers..."
                      rows="3"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    ></textarea>
                  </div>
                </div>

                <!-- Rule Configuration Section -->
                <div class="bg-blue-50 rounded-lg p-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Rule Configuration
                  </h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">Priority Level *</label>
                      <select
                        v-model="ruleForm.priority"
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Select Priority</option>
                        <option value="1">Critical (1) - Highest Priority</option>
                        <option value="2">High (2) - Very Important</option>
                        <option value="3">Medium (3) - Standard</option>
                        <option value="4">Low (4) - Less Important</option>
                        <option value="5">Minimal (5) - Lowest Priority</option>
                      </select>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">Rule Status</label>
                      <div class="flex items-center space-x-4">
                        <label class="flex items-center">
                          <input
                            v-model="ruleForm.is_active"
                            type="checkbox"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span class="ml-2 text-sm text-gray-700">Active Rule</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Professional Rule Builder -->
                <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Visual Rule Builder
                  </h4>
                  
                  <!-- Rule Builder Component -->
                  <RuleBuilder 
                    :rule-data="ruleForm" 
                    @update:rule-data="updateRuleData"
                    @preview="previewRule"
                    @test="testRule"
                  />
                </div>
              </div>
              
              <!-- Enhanced Action Buttons -->
              <div class="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  @click="closeRuleModal"
                  class="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="savingRule"
                  class="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg v-if="savingRule" class="w-4 h-4 inline-block mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {{ savingRule 
                    ? (editingRule ? 'Updating Rule...' : 'Creating Rule...')
                    : (editingRule ? 'Update Rule' : 'Create Rule')
                  }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Recalculate Score Modal -->
    <div
      v-if="showRecalculateModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeRecalculateModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.lead_scoring.recalculate.title') }}</h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="recalculateScore">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.lead_scoring.recalculate.contact_id') }}</label>
                  <input
                    v-model="recalculateForm.contact_id"
                    type="text"
                    required
                    :placeholder="$t('marketing.lead_scoring.recalculate.enter_contact_id')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  @click="closeRecalculateModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {{ $t('marketing.lead_scoring.rule_modal.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="recalculating"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
                >
                  {{ recalculating ? $t('marketing.lead_scoring.recalculate.recalculating') : $t('marketing.lead_scoring.recalculate.recalculate') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Recalculate Modal -->
    <div
      v-if="showBulkRecalculateModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeBulkRecalculateModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Bulk Recalculate Scores</h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="bulkRecalculate">
              <div class="space-y-4">
                <div>
                  <label class="flex items-center">
                    <input
                      v-model="bulkRecalculateForm.all_contacts"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">Recalculate all contacts</span>
                  </label>
                </div>
                
                <div v-if="!bulkRecalculateForm.all_contacts">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Select Contacts</label>
                  
                  <!-- Loading State -->
                  <div v-if="loadingContacts" class="text-center py-4">
                    <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <p class="mt-2 text-sm text-gray-600">Loading contacts...</p>
                  </div>
                  
                  <!-- Contact Selection -->
                  <div v-else class="space-y-3">
                    <!-- Search Contacts -->
                    <div class="relative">
                      <input
                        type="text"
                        placeholder="Search contacts..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <svg class="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    <!-- Available Contacts List -->
                    <div class="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                      <div
                        v-for="contact in availableContacts"
                        :key="contact.id"
                        class="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          :id="`contact-${contact.id}`"
                          v-model="selectedContacts"
                          :value="contact"
                          type="checkbox"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label :for="`contact-${contact.id}`" class="ml-3 flex-1 cursor-pointer">
                          <div class="flex items-center justify-between">
                            <div>
                              <p class="text-sm font-medium text-gray-900">{{ contact.name }}</p>
                              <p class="text-xs text-gray-500">{{ contact.company || 'No company' }}</p>
                            </div>
                            <div class="text-right">
                              <p class="text-sm font-medium text-blue-600">{{ contact.score || 0 }} pts</p>
                              <p class="text-xs text-gray-500">{{ contact.email }}</p>
                            </div>
                          </div>
                        </label>
                      </div>
                      
                      <!-- Empty State -->
                      <div v-if="availableContacts.length === 0" class="p-6 text-center text-gray-500">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p class="mt-2 text-sm">No contacts available</p>
                      </div>
                    </div>
                    
                    <!-- Selected Contacts Summary -->
                    <div v-if="selectedContacts.length > 0" class="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <p class="text-sm font-medium text-blue-900">
                        {{ selectedContacts.length }} contact{{ selectedContacts.length === 1 ? '' : 's' }} selected
                      </p>
                      <div class="mt-2 flex flex-wrap gap-1">
                        <span
                          v-for="contact in selectedContacts"
                          :key="contact.id"
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {{ contact.name }}
                          <button
                            @click="selectedContacts = selectedContacts.filter(c => c.id !== contact.id)"
                            class="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Rule IDs (optional, comma-separated)</label>
                  <input
                    v-model="bulkRecalculateForm.rule_ids"
                    type="text"
                    placeholder="1,2,3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  @click="closeBulkRecalculateModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="bulkRecalculating"
                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 rounded-md transition-colors"
                >
                  {{ bulkRecalculating ? 'Recalculating...' : 'Start Recalculation' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Modal -->
    <div
      v-if="showExportModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeExportModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Export Lead Scoring Data</h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="exportData">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                  <select
                    v-model="exportForm.format"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="csv">CSV</option>
                    <option value="xlsx">Excel (XLSX)</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
                
                <div>
                  <label class="flex items-center">
                    <input
                      v-model="exportForm.include_scores"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">Include contact scores</span>
                  </label>
                </div>
                
                <div>
                  <label class="flex items-center">
                    <input
                      v-model="exportForm.include_rules"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">Include scoring rules</span>
                  </label>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      v-model="exportForm.date_range.start"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      v-model="exportForm.date_range.end"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  @click="closeExportModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Export Data
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
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.lead_scoring.confirmations.delete_title') }}</h3>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-6">{{ $t('marketing.lead_scoring.confirmations.delete_message') }}</p>
            <div class="flex justify-end space-x-3">
              <button
                @click="closeConfirmModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {{ $t('marketing.lead_scoring.confirmations.cancel') }}
              </button>
              <button
                @click="confirmDelete"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                {{ $t('marketing.lead_scoring.confirmations.confirm') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Templates Modal -->
    <div
      v-if="showTemplatesModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeTemplatesModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <h3 class="text-xl font-bold text-gray-900 flex items-center">
              <svg class="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Lead Scoring Templates
            </h3>
            <p class="text-sm text-gray-600 mt-1">Choose from industry-standard templates to get started quickly</p>
          </div>
          
          <div class="p-6 overflow-y-auto max-h-[70vh]">
            <!-- Loading State -->
            <div v-if="loadingTemplates" class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p class="mt-4 text-gray-600">Loading templates...</p>
            </div>
            
            <!-- Templates Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="template in templates"
                :key="template.key"
                class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200"
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900">{{ template.name }}</h4>
                      <p class="text-sm text-gray-500">{{ template.category }}</p>
                    </div>
                  </div>
                </div>
                
                <p class="text-gray-600 text-sm mb-4">{{ template.description }}</p>
                
                <div class="space-y-2 mb-4">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">Rules:</span>
                    <span class="font-medium">{{ template.rules_count }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">Points Range:</span>
                    <span class="font-medium">{{ template.points_range }}</span>
                  </div>
                </div>
                
                <button
                  @click="activateTemplate(template.key)"
                  class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Activate Template
                </button>
              </div>
            </div>
          </div>
          
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div class="flex justify-end">
              <button
                @click="closeTemplatesModal"
                class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { leadScoringService, leadScoringHelpers } from '@/services/leadScoring'
import { error as showError, success as showSuccess } from '@/utils/notifications'
import RuleBuilder from '@/components/leadScoring/RuleBuilder.vue'

const { t } = useI18n()

// Reactive state
const loading = ref(false)
const error = ref(null)
const rules = ref([])
const stats = ref(null)
const topContacts = ref([])
const leadScoringAnalytics = ref(null)
const eventTypes = ref([])
const operators = ref([])

// Ensure all array variables are properly initialized
// This will be handled in the main onMounted hook

// Search and filter state
const searchQuery = ref('')
const statusFilter = ref('')

// Available contacts for bulk operations
const availableContacts = ref([])
const selectedContacts = ref([])
const loadingContacts = ref(false)

// Templates and Smart Features
const templates = ref([])
const templateCategories = ref([])
const loadingTemplates = ref(false)

// Modal states
const showRuleModal = ref(false)
const showRecalculateModal = ref(false)
const showBulkRecalculateModal = ref(false)
const showExportModal = ref(false)
const showConfirmModal = ref(false)
const showTemplatesModal = ref(false)
const savingRule = ref(false)
const recalculating = ref(false)
const bulkRecalculating = ref(false)
const editingRule = ref(null)
const ruleToDelete = ref(null)

// Forms
const ruleForm = ref({
  name: '',
  description: '',
  points: '',
  priority: '',
  is_active: true,
  condition: '',
  event_type: '',
  operator: '',
  value: '',
  time_window: ''
})

const recalculateForm = ref({
  contact_id: ''
})

const bulkRecalculateForm = ref({
  contact_ids: [],
  rule_ids: [],
  all_contacts: false
})

const exportForm = ref({
  format: 'csv',
  include_scores: true,
  include_rules: false,
  date_range: {
    start: '',
    end: ''
  }
})

// Computed properties
const filteredRules = computed(() => {
  let filtered = rules.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(rule => 
      rule.name.toLowerCase().includes(query) ||
      rule.description?.toLowerCase().includes(query) ||
      rule.condition_description?.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(rule => rule.is_active)
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(rule => !rule.is_active)
  }

  return filtered
})

// Enhanced Methods
const loadRules = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await leadScoringService.getScoringRules({ is_active: null })
    
    // Clear any existing rules first
    rules.value = []
    
    // Handle the API response structure properly
    if (response && response.data) {
      if (Array.isArray(response.data)) {
        rules.value = response.data
      } else if (response.data.data && Array.isArray(response.data.data)) {
        rules.value = response.data.data
      }
    }
    
    // Ensure rules is always an array
    if (!Array.isArray(rules.value)) {
      rules.value = []
    }
    
  } catch (err) {
    error.value = err.message || 'Failed to load scoring rules'
    showError(error.value)
    rules.value = [] // Ensure empty array on error
  } finally {
    loading.value = false
  }
}

const loadEventTypes = async () => {
  try {
    const response = await leadScoringService.getEventTypes()
    eventTypes.value = response.data || []
  } catch (err) {
    console.error('Failed to load event types:', err)
    eventTypes.value = [] // Ensure it's always an array
  }
}

const loadOperators = async () => {
  try {
    const response = await leadScoringService.getOperators()
    operators.value = response.data || []
  } catch (err) {
    console.error('Failed to load operators:', err)
    operators.value = [] // Ensure it's always an array
  }
}

const refreshAll = async () => {
  await Promise.all([
    loadRules(),
    loadStats(),
    loadTopContacts(),
    loadLeadScoringAnalytics()
  ])
}

const loadStats = async () => {
  try {
    console.log('Loading lead scoring stats...')
    const response = await fetch('/api/lead-scoring/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('Stats API response:', data)
    stats.value = data.data
  } catch (err) {
    console.error('Failed to load stats:', err)
    stats.value = null
  }
}

const loadTopContacts = async () => {
  try {
    console.log('Loading top contacts...')
    const response = await fetch('/api/lead-scoring/top-contacts?limit=10', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('Top contacts API response:', data)
    topContacts.value = data.data || []
  } catch (err) {
    console.error('Failed to load top contacts:', err)
    topContacts.value = [] // Ensure it's always an array
  }
}

const loadLeadScoringAnalytics = async () => {
  try {
    console.log('Loading lead scoring analytics...')
    const response = await fetch('/api/analytics/lead-scoring', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('Analytics API response:', data)
    leadScoringAnalytics.value = data.data
  } catch (err) {
    console.error('Failed to load lead scoring analytics:', err)
    leadScoringAnalytics.value = null // Ensure it's always null on error
  }
}

const loadAvailableContacts = async () => {
  loadingContacts.value = true
  try {
    // This would be a new API endpoint to get available contacts
    // For now, we'll use the existing topContacts or create a mock
    const response = await leadScoringService.getTopContacts(100) // Get more contacts
    availableContacts.value = response.data || []
  } catch (err) {
    console.error('Failed to load available contacts:', err)
    availableContacts.value = []
  } finally {
    loadingContacts.value = false
  }
}

// Templates and Smart Features
const loadTemplates = async () => {
  loadingTemplates.value = true
  try {
    const response = await leadScoringService.getTemplates()
    console.log('Templates API Response:', response)
    templates.value = response.data || []
    
    // If no templates returned, provide mock data for development
    if (templates.value.length === 0) {
      console.log('No templates from API, using mock data for development')
      templates.value = [
        {
          key: 'marketing_engagement',
          name: 'Marketing Engagement',
          category: 'Marketing',
          description: 'Standard marketing scoring based on email engagement and website activity',
          rules_count: 6,
          points_range: '5-20 points'
        },
        {
          key: 'sales_activity',
          name: 'Sales Activity',
          category: 'Sales',
          description: 'Sales-focused scoring based on deal progression and meeting attendance',
          rules_count: 8,
          points_range: '10-50 points'
        },
        {
          key: 'website_behavior',
          name: 'Website Behavior',
          category: 'Marketing',
          description: 'Website visitor scoring based on page views and downloads',
          rules_count: 4,
          points_range: '5-15 points'
        },
        {
          key: 'email_engagement',
          name: 'Email Engagement',
          category: 'Marketing',
          description: 'Email interaction scoring for opens, clicks, and responses',
          rules_count: 5,
          points_range: '3-25 points'
        },
        {
          key: 'event_attendance',
          name: 'Event Attendance',
          category: 'Events',
          description: 'Event-based scoring for webinars, meetings, and conferences',
          rules_count: 3,
          points_range: '15-30 points'
        }
      ]
    }
  } catch (err) {
    console.error('Failed to load templates:', err)
    // Provide mock data on error for development
    templates.value = [
      {
        key: 'marketing_engagement',
        name: 'Marketing Engagement',
        category: 'Marketing',
        description: 'Standard marketing scoring based on email engagement and website activity',
        rules_count: 6,
        points_range: '5-20 points'
      },
      {
        key: 'sales_activity',
        name: 'Sales Activity',
        category: 'Sales',
        description: 'Sales-focused scoring based on deal progression and meeting attendance',
        rules_count: 8,
        points_range: '10-50 points'
      },
      {
        key: 'website_behavior',
        name: 'Website Behavior',
        category: 'Marketing',
        description: 'Website visitor scoring based on page views and downloads',
        rules_count: 4,
        points_range: '5-15 points'
      }
    ]
  } finally {
    loadingTemplates.value = false
  }
}

const loadTemplateCategories = async () => {
  try {
    const response = await leadScoringService.getTemplateCategories()
    templateCategories.value = response.data || []
  } catch (err) {
    console.error('Failed to load template categories:', err)
    templateCategories.value = []
  }
}


// Enhanced Modal Methods
const openCreateRuleModal = () => {
  editingRule.value = null
  ruleForm.value = {
    name: '',
    description: '',
    points: '',
    priority: '',
    is_active: true,
    condition: null // Start with null, will be set by RuleBuilder
  }
  showRuleModal.value = true
}

const openBulkRecalculateModal = () => {
  bulkRecalculateForm.value = {
    contact_ids: [],
    rule_ids: [],
    all_contacts: false
  }
  selectedContacts.value = []
  showBulkRecalculateModal.value = true
  loadAvailableContacts() // Load available contacts when modal opens
}

const openExportModal = () => {
  exportForm.value = {
    format: 'csv',
    include_scores: true,
    include_rules: false,
    date_range: {
      start: '',
      end: ''
    }
  }
  showExportModal.value = true
}

// New Modal Methods
const openTemplatesModal = () => {
  console.log('Opening templates modal...')
  showTemplatesModal.value = true
  loadTemplates()
  loadTemplateCategories()
}


// Template and Smart Feature Actions
const activateTemplate = async (templateKey) => {
  try {
    console.log('Activating template:', templateKey)
    console.log('Making API call to:', `/api/lead-scoring/templates/${templateKey}/activate`)
    
    // Direct API call instead of using service
    const response = await fetch(`/api/lead-scoring/templates/${templateKey}/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('Template activation response:', data)
    
    showSuccess('Template activated successfully!')
    closeTemplatesModal()
    loadRules()
    loadStats()
  } catch (err) {
    console.error('Template activation error:', err)
    console.error('Error details:', err.message)
    
    // Check if it's a 404 (endpoint doesn't exist) or other error
    if (err.message.includes('404') || err.message.includes('Not Found')) {
      console.log('API endpoint not found, creating rules manually...')
      await createTemplateRulesManually(templateKey)
      showSuccess(`Template "${templateKey}" activated successfully! (Rules created manually)`)
    } else {
      showError(`Failed to activate template: ${err.message || 'Unknown error'}`)
      return // Don't close modal or refresh on error
    }
    
    closeTemplatesModal()
    loadRules()
    loadStats()
  }
}




// Manual template rule creation when API endpoint is not available
const createTemplateRulesManually = async (templateKey) => {
  console.log('Creating rules manually for template:', templateKey)
  
  const templateRules = {
    marketing_engagement: [
      {
        name: 'Email Open',
        description: 'Contact opened an email',
        points: 5,
        priority: 1,
        is_active: true,
        condition: { event: 'email_open' }
      },
      {
        name: 'Email Click',
        description: 'Contact clicked a link in an email',
        points: 10,
        priority: 1,
        is_active: true,
        condition: { event: 'email_click' }
      },
      {
        name: 'Website Visit',
        description: 'Contact visited the website',
        points: 3,
        priority: 2,
        is_active: true,
        condition: { event: 'page_visit' }
      },
      {
        name: 'Form Submission',
        description: 'Contact submitted a form',
        points: 15,
        priority: 1,
        is_active: true,
        condition: { event: 'form_submission' }
      },
      {
        name: 'Download',
        description: 'Contact downloaded a resource',
        points: 8,
        priority: 2,
        is_active: true,
        condition: { event: 'download' }
      },
      {
        name: 'Email Reply',
        description: 'Contact replied to an email',
        points: 20,
        priority: 1,
        is_active: true,
        condition: { event: 'email_reply' }
      }
    ],
    sales_activity: [
      {
        name: 'Deal Created',
        description: 'A new deal was created',
        points: 10,
        priority: 1,
        is_active: true,
        condition: { event: 'deal_created' }
      },
      {
        name: 'Meeting Scheduled',
        description: 'A meeting was scheduled',
        points: 15,
        priority: 1,
        is_active: true,
        condition: { event: 'meeting_scheduled' }
      },
      {
        name: 'Deal Updated',
        description: 'Deal value or stage was updated',
        points: 5,
        priority: 2,
        is_active: true,
        condition: { event: 'deal_updated' }
      }
    ],
    website_behavior: [
      {
        name: 'Homepage Visit',
        description: 'Contact visited the homepage',
        points: 2,
        priority: 3,
        is_active: true,
        condition: { event: 'page_visit', page: 'homepage' }
      },
      {
        name: 'Pricing Page Visit',
        description: 'Contact visited pricing page',
        points: 8,
        priority: 2,
        is_active: true,
        condition: { event: 'page_visit', page: 'pricing' }
      },
      {
        name: 'Product Page Visit',
        description: 'Contact visited product pages',
        points: 5,
        priority: 2,
        is_active: true,
        condition: { event: 'page_visit', page: 'products' }
      }
    ]
  }
  
  const rules = templateRules[templateKey] || []
  
  if (rules.length === 0) {
    console.log('No rules defined for template:', templateKey)
    return
  }
  
  console.log(`Creating ${rules.length} rules for template ${templateKey}`)
  
  // Create each rule using the existing createScoringRule API
  for (const rule of rules) {
    try {
      await leadScoringService.createScoringRule(rule)
      console.log('Created rule:', rule.name)
    } catch (err) {
      console.error('Failed to create rule:', rule.name, err)
    }
  }
}

const toggleRuleStatus = async (rule) => {
  try {
    await leadScoringService.updateScoringRule(rule.id, {
      is_active: !rule.is_active
    })
    showSuccess(`Rule ${rule.is_active ? 'disabled' : 'enabled'} successfully`)
    loadRules()
    loadStats()
  } catch (err) {
    showError(err.message || 'Failed to update rule status')
  }
}

const bulkRecalculate = async () => {
  bulkRecalculating.value = true
  
  try {
    // Prepare the data for the API call
    const data = {
      all_contacts: bulkRecalculateForm.value.all_contacts,
      contact_ids: bulkRecalculateForm.value.all_contacts ? [] : selectedContacts.value.map(c => c.id),
      rule_ids: bulkRecalculateForm.value.rule_ids
    }
    
    await leadScoringService.bulkRecalculate(data)
    showSuccess('Bulk recalculation completed successfully')
    closeBulkRecalculateModal()
    refreshAll()
  } catch (err) {
    showError(err.message || 'Failed to perform bulk recalculation')
  } finally {
    bulkRecalculating.value = false
  }
}

const exportData = async () => {
  try {
    const response = await leadScoringService.exportContacts(exportForm.value)
    
    // Create download link
    const blob = new Blob([response.data], { type: 'application/octet-stream' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `lead-scoring-export-${new Date().toISOString().split('T')[0]}.${exportForm.value.format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    showSuccess('Data exported successfully')
    closeExportModal()
  } catch (err) {
    showError(err.message || 'Failed to export data')
  }
}

const closeBulkRecalculateModal = () => {
  showBulkRecalculateModal.value = false
  bulkRecalculating.value = false
}

const closeTemplatesModal = () => {
  showTemplatesModal.value = false
}

const closeExportModal = () => {
  showExportModal.value = false
}

// Enhanced Helper Methods
const getRankBadgeColor = (index) => {
  const colors = [
    'bg-yellow-500', // 1st place
    'bg-gray-400',   // 2nd place
    'bg-orange-500', // 3rd place
    'bg-blue-500',   // 4th place
    'bg-green-500'   // 5th place
  ]
  return colors[index] || 'bg-gray-300'
}

// Rule Builder Methods
const updateRuleData = (newRuleData) => {
  ruleForm.value = { ...ruleForm.value, ...newRuleData }
}

const previewRule = async (ruleData) => {
  try {
    const response = await leadScoringService.validateRuleCondition(ruleData.condition)
    showSuccess('Rule condition is valid!')
    console.log('Rule preview:', response.data)
  } catch (error) {
    showError('Invalid rule condition: ' + (error.message || 'Please check your rule configuration'))
  }
}

const testRule = async (ruleData) => {
  try {
    const response = await leadScoringService.testRule(ruleData)
    showSuccess('Rule test completed successfully!')
    console.log('Rule test results:', response.data)
  } catch (error) {
    showError('Rule test failed: ' + (error.message || 'Please check your rule configuration'))
  }
}

const editRule = (rule) => {
  editingRule.value = rule
  ruleForm.value = {
    name: rule.name,
    description: rule.description || '',
    points: rule.points.toString(),
    priority: rule.priority.toString(),
    is_active: rule.is_active,
    condition: rule.condition || null // Pass the condition object directly
  }
  showRuleModal.value = true
}

const closeRuleModal = () => {
  showRuleModal.value = false
  editingRule.value = null
  savingRule.value = false
  
  // Reset form to prevent any state issues
  ruleForm.value = {
    name: '',
    description: '',
    points: '',
    priority: '',
    is_active: true,
    condition: null
  }
}

const saveRule = async () => {
  savingRule.value = true
  
  try {
    // Validate required fields
    if (!ruleForm.value.name || !ruleForm.value.points || !ruleForm.value.priority) {
      showError('Please fill in all required fields')
      return
    }

    // Check if condition is properly set (either from RuleBuilder or manual JSON)
    let condition = ruleForm.value.condition
    
    // If condition is a string, try to parse it as JSON
    if (typeof condition === 'string') {
      try {
        condition = JSON.parse(condition)
      } catch (error) {
        showError('Invalid JSON condition format. Please use the visual rule builder or provide valid JSON.')
        return
      }
    }
    
    // If no condition is set, show error
    if (!condition || Object.keys(condition).length === 0) {
      showError('Please set up a rule condition using the visual rule builder')
      return
    }

    const data = {
      name: ruleForm.value.name,
      description: ruleForm.value.description,
      points: parseInt(ruleForm.value.points),
      priority: parseInt(ruleForm.value.priority),
      is_active: ruleForm.value.is_active,
      condition: condition
    }

    if (editingRule.value) {
      await leadScoringService.updateScoringRule(editingRule.value.id, data)
      showSuccess('Scoring rule updated successfully')
    } else {
      await leadScoringService.createScoringRule(data)
      showSuccess('Scoring rule created successfully')
    }

    // Close modal and refresh data
    closeRuleModal()
    
    // Refresh data in parallel
    await Promise.all([
      loadRules(),
      loadStats(),
      loadTopContacts()
    ])
  } catch (err) {
    showError(err.message || 'Failed to save scoring rule')
  } finally {
    savingRule.value = false
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
  recalculateForm.value = { contact_id: '' }
  showRecalculateModal.value = true
}

const closeRecalculateModal = () => {
  showRecalculateModal.value = false
  recalculating.value = false
}

const recalculateScore = async () => {
  recalculating.value = true
  
  try {
    const result = await leadScoringService.recalculateScore(recalculateForm.value.contact_id)
    showSuccess(`${t('marketing.lead_scoring.recalculate.success')}: ${JSON.stringify(result)}`)
    closeRecalculateModal()
    loadTopContacts()
  } catch (err) {
    showError(err.message || 'Failed to recalculate score')
  } finally {
    recalculating.value = false
  }
}

// Helper methods
const getPriorityColor = (priority) => leadScoringHelpers.getPriorityColor(priority)
const getStatusColor = (isActive) => leadScoringHelpers.getStatusColor(isActive)
const getScoreColor = (score) => leadScoringHelpers.getScoreColor(score)
const getScoreChangeColor = (change) => leadScoringHelpers.getScoreChangeColor(change)
const getScoreCategory = (score) => leadScoringHelpers.getScoreCategory(score)
const formatDate = (dateString) => leadScoringHelpers.formatDate(dateString)
const formatNumber = (num) => leadScoringHelpers.formatNumber(num)

// Enhanced Lifecycle
onMounted(async () => {
  // Force initialize all arrays to prevent undefined errors
  if (!Array.isArray(rules.value)) rules.value = []
  if (!Array.isArray(topContacts.value)) topContacts.value = []
  if (!Array.isArray(eventTypes.value)) eventTypes.value = []
  if (!Array.isArray(operators.value)) operators.value = []
  
  await Promise.all([
    loadRules(),
    loadStats(),
    loadTopContacts(),
    loadLeadScoringAnalytics(),
    loadEventTypes(),
    loadOperators()
    // Removed loadAdvancedAnalytics() and loadScoringTrends() to reduce load
  ])
  
  // Real-time updates disabled for development
  // setupRealTimeUpdates() // Commented out to prevent auto-refresh
})

// Real-time updates setup (DISABLED FOR DEVELOPMENT)
const setupRealTimeUpdates = () => {
  // Auto-refresh disabled during development to prevent heavy load
  // Will be enabled later in production
  console.log('Real-time updates disabled for development')
}

// Real-time score notifications (DISABLED FOR DEVELOPMENT)
const setupScoreNotifications = () => {
  // Auto-notifications disabled during development to prevent heavy load
  // Will be enabled later in production
  console.log('Real-time notifications disabled for development')
}

// Advanced Analytics Integration
const loadAdvancedAnalytics = async () => {
  try {
    const [trendsResponse, performanceResponse] = await Promise.all([
      leadScoringService.getScoringTrends(),
      leadScoringService.getRulePerformance(1) // Get performance for first rule
    ])
    
    // Process trends data
    if (trendsResponse.data) {
      console.log('Scoring trends:', trendsResponse.data)
    }
    
    // Process performance data
    if (performanceResponse.data) {
      console.log('Rule performance:', performanceResponse.data)
    }
  } catch (error) {
    console.error('Failed to load advanced analytics:', error)
  }
}

// Bulk Operations
const bulkActivateRules = async (ruleIds) => {
  try {
    await leadScoringService.bulkActivateRules(ruleIds)
    showSuccess(`${ruleIds.length} rules activated successfully`)
    loadRules()
    loadStats()
  } catch (error) {
    showError('Failed to activate rules: ' + error.message)
  }
}

const bulkDeactivateRules = async (ruleIds) => {
  try {
    await leadScoringService.bulkDeactivateRules(ruleIds)
    showSuccess(`${ruleIds.length} rules deactivated successfully`)
    loadRules()
    loadStats()
  } catch (error) {
    showError('Failed to deactivate rules: ' + error.message)
  }
}

// Import/Export Operations
const importRules = async (file) => {
  try {
    const response = await leadScoringService.importRules(file)
    showSuccess(`Successfully imported ${response.data.success_count} rules`)
    loadRules()
  } catch (error) {
    showError('Failed to import rules: ' + error.message)
  }
}

// Enhanced Analytics
const loadScoringTrends = async () => {
  try {
    const response = await leadScoringService.getScoringTrends()
    console.log('Scoring trends:', response.data)
  } catch (error) {
    console.error('Failed to load scoring trends:', error)
  }
}
</script>
