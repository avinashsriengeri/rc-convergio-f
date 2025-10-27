<template>
  <div class="analytics-view">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Help Center Analytics</h1>
              <p class="text-gray-600 mt-1">Track performance and user engagement</p>
            </div>
            <div class="flex items-center space-x-4">
              <!-- Advanced Search Button -->
              <button
                @click="showAdvancedSearch = !showAdvancedSearch"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                {{ showAdvancedSearch ? 'Hide' : 'Show' }} Advanced Search
              </button>
              
              <select
                v-model="selectedPeriod"
                @change="loadAnalytics"
                class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button
                @click="refreshData"
                :disabled="loading"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Search Panel -->
    <div v-if="showAdvancedSearch" class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Article Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Articles</label>
            <input
              v-model="searchFilters.articleQuery"
              type="text"
              placeholder="Search by article title..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Category Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              v-model="searchFilters.category"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              v-model="searchFilters.dateRange"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <!-- Sort By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              v-model="searchFilters.sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="views">Views</option>
              <option value="helpfulness">Helpfulness</option>
              <option value="date">Date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        <!-- Search Actions -->
        <div class="flex items-center justify-between mt-6">
          <div class="flex items-center space-x-4">
            <button
              @click="applyAdvancedSearch"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
              <span v-else>Search Analytics</span>
            </button>
            <button
              @click="clearAdvancedSearch"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Clear Filters
            </button>
          </div>
          <div class="text-sm text-gray-500">
            {{ filteredResultsCount }} results found
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-500">Loading analytics data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Failed to load analytics</h3>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <button
          @click="loadAnalytics"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>

      <!-- Analytics Content -->
      <div v-else-if="analytics" class="space-y-8">
        <!-- Overview Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Articles</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ analytics.total_articles_published || 0 }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ formatNumber(analytics.total_views || 0) }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Helpful Votes</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ formatNumber(analytics.total_feedback || 0) }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Satisfaction Rate</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ formatPercentage(analytics.average_helpful_percentage || 0) }}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Key Insights Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Performance Score -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">Performance Score</p>
                <p class="text-3xl font-bold">{{ analytics.helpfulness_summary?.overall_helpful_percentage || 0 }}%</p>
                <p class="text-blue-100 text-xs mt-1">Overall satisfaction</p>
              </div>
              <div class="bg-blue-400 bg-opacity-30 rounded-full p-3">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Feedback Distribution -->
          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">Feedback Quality</p>
                <p class="text-3xl font-bold">{{ analytics.helpfulness_summary?.feedback_distribution?.excellent || 0 }}</p>
                <p class="text-green-100 text-xs mt-1">Excellent ratings</p>
              </div>
              <div class="bg-green-400 bg-opacity-30 rounded-full p-3">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Engagement Rate -->
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm font-medium">Engagement Rate</p>
                <p class="text-3xl font-bold">{{ analytics.helpfulness_summary?.average_feedback_per_article || 0 }}</p>
                <p class="text-purple-100 text-xs mt-1">Avg feedback per article</p>
              </div>
              <div class="bg-purple-400 bg-opacity-30 rounded-full p-3">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Top Articles Chart -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Most Viewed Articles</h3>
            <div class="h-80">
              <canvas ref="topArticlesChart" v-if="analytics.top_10_viewed_articles && analytics.top_10_viewed_articles.length > 0"></canvas>
              <div v-else class="h-full flex items-center justify-center text-gray-500">
                <div class="text-center">
                  <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p class="text-sm">No article view data available</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Helpfulness Chart -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Article Helpfulness</h3>
            <div class="h-80">
              <canvas ref="helpfulnessChart" v-if="analytics.top_helpful_articles && analytics.top_helpful_articles.length > 0"></canvas>
              <div v-else class="h-full flex items-center justify-center text-gray-500">
                <div class="text-center">
                  <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p class="text-sm">No feedback data available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Tables -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Top Articles Table -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Top 10 Articles</h3>
            </div>
            <div class="overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Helpful</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="article in analytics.top_10_viewed_articles" :key="article.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ article.title }}</div>
                      <div class="text-sm text-gray-500">{{ article.category?.name || 'Uncategorized' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatNumber(article.views || 0) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatNumber(article.helpful_count || 0) }}
                    </td>
                  </tr>
                  <tr v-if="!analytics.top_10_viewed_articles || analytics.top_10_viewed_articles.length === 0">
                    <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">
                      No articles data available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Category Performance -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Category Performance</h3>
            </div>
            <div class="overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articles</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="category in analytics.category_performance" :key="category.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div
                          class="w-3 h-3 rounded-full mr-3"
                          :style="{ backgroundColor: category.color || '#6B7280' }"
                        ></div>
                        <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ category.articles_count || 0 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatNumber(category.total_views || 0) }}
                    </td>
                  </tr>
                  <tr v-if="!analytics.category_performance || analytics.category_performance.length === 0">
                    <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">
                      No category performance data available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Top Helpful Articles</h3>
          </div>
          <div class="overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Helpful</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Not Helpful</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="article in analytics.top_helpful_articles" :key="article.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ article.title }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ article.helpful_count || 0 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ article.not_helpful_count || 0 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {{ formatPercentage(article.helpful_percentage || 0) }}%
                    </span>
                  </td>
                </tr>
                <tr v-if="!analytics.top_helpful_articles || analytics.top_helpful_articles.length === 0">
                  <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                    No helpful articles data available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useHelpStore } from '../../store/helpStore'
import { useContext } from '@/composables/useContext'
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)

const helpStore = useHelpStore()
const { getTenantId } = useContext()

// Reactive data
const loading = ref(false)
const selectedPeriod = ref('30')
const topArticlesChart = ref(null)
const helpfulnessChart = ref(null)
const chartInstances = ref([])

// Advanced search
const showAdvancedSearch = ref(false)
const searchFilters = ref({
  articleQuery: '',
  category: '',
  dateRange: '',
  sortBy: 'views'
})
const categories = ref([])
const filteredResultsCount = ref(0)

// Computed properties
const analytics = computed(() => helpStore.analytics)
const error = computed(() => helpStore.error)

// Methods
const loadAnalytics = async () => {
  loading.value = true
  
  try {
    await helpStore.fetchAnalytics()
    await nextTick()
    // Small delay to ensure DOM is fully ready
    setTimeout(() => {
      createCharts()
    }, 100)
  } catch (error) {
    console.error('Failed to load analytics:', error)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadAnalytics()
}

// Advanced search methods
const loadCategories = async () => {
  try {
    const tenantId = getTenantId()
    if (tenantId) {
      await helpStore.fetchCategories(tenantId)
      categories.value = helpStore.categories
    }
  } catch (err) {
    console.error('Failed to load categories:', err)
  }
}

const applyAdvancedSearch = async () => {
  try {
    loading.value = true
    
    // Apply filters to analytics data
    const filters = {
      query: searchFilters.value.articleQuery,
      category: searchFilters.value.category,
      date_range: searchFilters.value.dateRange,
      sort_by: searchFilters.value.sortBy
    }
    
    // Call advanced search API
    const response = await helpStore.searchArticlesAdvanced(filters)
    filteredResultsCount.value = response.total || 0
    
    // Update analytics with filtered data
    if (response.data) {
      helpStore.analytics = response.data
    }
    
  } catch (err) {
    console.error('Advanced search failed:', err)
  } finally {
    loading.value = false
  }
}

const clearAdvancedSearch = () => {
  searchFilters.value = {
    articleQuery: '',
    category: '',
    dateRange: '',
    sortBy: 'views'
  }
  filteredResultsCount.value = 0
  loadAnalytics() // Reload original analytics
}

const createCharts = () => {
  // Destroy existing charts
  destroyCharts()
  
  if (!analytics.value) {
    console.log('No analytics data available for charts')
    return
  }
  
  console.log('Creating charts with data:', analytics.value)
  console.log('Top articles chart canvas:', topArticlesChart.value)
  console.log('Helpfulness chart canvas:', helpfulnessChart.value)
  
  // Create Top Articles Chart
  if (topArticlesChart.value && analytics.value.top_10_viewed_articles && analytics.value.top_10_viewed_articles.length > 0) {
    console.log('Creating top articles chart with data:', analytics.value.top_10_viewed_articles)
    const ctx = topArticlesChart.value.getContext('2d')
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: analytics.value.top_10_viewed_articles.slice(0, 10).map(article => 
          article.title.length > 25 ? article.title.substring(0, 25) + '...' : article.title
        ),
        datasets: [{
          label: 'Views',
          data: analytics.value.top_10_viewed_articles.slice(0, 10).map(article => article.views || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: function(context) {
                return analytics.value.top_10_viewed_articles[context[0].dataIndex].title
              },
              label: function(context) {
                return `${context.parsed.y} views`
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              color: '#6B7280'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6B7280',
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    })
    chartInstances.value.push(chart)
  } else {
    console.log('Top articles chart not created - canvas:', !!topArticlesChart.value, 'data:', !!analytics.value.top_10_viewed_articles, 'length:', analytics.value.top_10_viewed_articles?.length)
  }
  
  // Create Helpfulness Chart
  if (helpfulnessChart.value && analytics.value.top_helpful_articles) {
    console.log('Creating helpfulness chart with data:', analytics.value.top_helpful_articles)
    const ctx = helpfulnessChart.value.getContext('2d')
    
    // Calculate total helpful and not helpful from top_helpful_articles
    const totalHelpful = analytics.value.top_helpful_articles.reduce((sum, article) => sum + (article.helpful_count || 0), 0)
    const totalNotHelpful = analytics.value.top_helpful_articles.reduce((sum, article) => sum + (article.not_helpful_count || 0), 0)
    
    console.log('Helpfulness chart data - Helpful:', totalHelpful, 'Not Helpful:', totalNotHelpful)
    
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Helpful', 'Not Helpful'],
        datasets: [{
          data: [totalHelpful, totalNotHelpful],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(239, 68, 68, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? Math.round((context.parsed / total) * 100) : 0
                return `${context.label}: ${context.parsed} (${percentage}%)`
              }
            }
          }
        }
      }
    })
    chartInstances.value.push(chart)
  } else {
    console.log('Helpfulness chart not created - canvas:', !!helpfulnessChart.value, 'data:', !!analytics.value.top_helpful_articles, 'length:', analytics.value.top_helpful_articles?.length)
  }
}

const destroyCharts = () => {
  chartInstances.value.forEach(chart => {
    if (chart) {
      chart.destroy()
    }
  })
  chartInstances.value = []
}

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatPercentage = (num) => {
  return Math.round(num * 100) / 100
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  loadAnalytics()
  loadCategories()
})

onUnmounted(() => {
  destroyCharts()
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
