<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold text-gray-900">Commerce Overview</h1>
              <p class="text-sm text-gray-600">Monitor your commerce platform performance and key metrics</p>
            </div>
            <div class="flex items-center space-x-3">
              <button
                @click="exportAnalytics"
                :disabled="analyticsLoading"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export Analytics
              </button>
              <button
                @click="refreshData"
                :disabled="loading || analyticsLoading"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Commerce Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Orders -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</p>
              <p class="text-xl font-bold text-gray-900">{{ analyticsOverview?.total_orders || stats.total_orders || 0 }}</p>
              <p v-if="analyticsOverview?.orders_growth" :class="analyticsOverview?.orders_growth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs">
                {{ analyticsOverview?.orders_growth >= 0 ? '+' : '' }}{{ analyticsOverview?.orders_growth }}%
              </p>
            </div>
          </div>
        </div>

        <!-- Total Revenue -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</p>
              <p class="text-xl font-bold text-gray-900">${{ formatCurrency(analyticsOverview?.total_revenue || stats.total_revenue || 0) }}</p>
              <p v-if="analyticsOverview?.revenue_growth" :class="analyticsOverview?.revenue_growth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs">
                {{ analyticsOverview?.revenue_growth >= 0 ? '+' : '' }}{{ analyticsOverview?.revenue_growth }}%
              </p>
            </div>
          </div>
        </div>

        <!-- Conversion Rate -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</p>
              <p class="text-xl font-bold text-gray-900">{{ analyticsOverview?.conversion_rate || 0 }}%</p>
              <p v-if="analyticsOverview?.conversion_growth" :class="analyticsOverview?.conversion_growth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs">
                {{ analyticsOverview?.conversion_growth >= 0 ? '+' : '' }}{{ analyticsOverview?.conversion_growth }}%
              </p>
            </div>
          </div>
        </div>

        <!-- Average Order Value -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order Value</p>
              <p class="text-xl font-bold text-gray-900">${{ formatCurrency(analyticsOverview?.average_order_value || stats.average_order_value || 0) }}</p>
              <p v-if="analyticsOverview?.aov_growth" :class="analyticsOverview?.aov_growth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs">
                {{ analyticsOverview?.aov_growth >= 0 ? '+' : '' }}{{ analyticsOverview?.aov_growth }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscription Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Active Subscriptions -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Subscriptions</p>
              <p class="text-xl font-bold text-gray-900">{{ subscriptionsStore.analytics.activeSubscriptions }}</p>
              <p v-if="subscriptionsStore.analytics.subscription_growth" :class="subscriptionsStore.analytics.subscription_growth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs">
                {{ subscriptionsStore.analytics.subscription_growth >= 0 ? '+' : '' }}{{ subscriptionsStore.analytics.subscription_growth }}%
              </p>
            </div>
          </div>
        </div>

        <!-- Monthly Recurring Revenue -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Recurring Revenue</p>
              <p class="text-xl font-bold text-gray-900">${{ formatCurrency(subscriptionsStore.analytics.monthlyRecurringRevenue) }}</p>
              <p v-if="subscriptionsStore.analytics.mrr_growth" :class="subscriptionsStore.analytics.mrr_growth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs">
                {{ subscriptionsStore.analytics.mrr_growth >= 0 ? '+' : '' }}{{ subscriptionsStore.analytics.mrr_growth }}%
              </p>
            </div>
          </div>
        </div>

        <!-- Churn Rate -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Churn Rate</p>
              <p class="text-xl font-bold text-gray-900">{{ subscriptionsStore.analytics.churnRate }}%</p>
              <p v-if="subscriptionsStore.analytics.churn_growth" :class="subscriptionsStore.analytics.churn_growth <= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs">
                {{ subscriptionsStore.analytics.churn_growth <= 0 ? '' : '+' }}{{ subscriptionsStore.analytics.churn_growth }}%
              </p>
            </div>
          </div>
        </div>

        <!-- Revenue This Month -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue This Month</p>
              <p class="text-xl font-bold text-gray-900">${{ formatCurrency(subscriptionsStore.analytics.revenueThisMonth) }}</p>
              <p v-if="subscriptionsStore.analytics.monthly_revenue_growth" :class="subscriptionsStore.analytics.monthly_revenue_growth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs">
                {{ subscriptionsStore.analytics.monthly_revenue_growth >= 0 ? '+' : '' }}{{ subscriptionsStore.analytics.monthly_revenue_growth }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Enhanced Revenue Chart -->
        <AnalyticsCharts
          type="revenue"
          :data="{ revenue: revenueData }"
          :loading="analyticsLoading"
          @period-change="handlePeriodChange"
        />

        <!-- Recent Transactions -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="px-6 py-5 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <router-link
                to="/commerce/orders"
                class="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all
              </router-link>
            </div>
          </div>
          <div class="p-6">
            <div v-if="analyticsLoading" class="space-y-4">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div class="ml-4">
                      <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div class="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="recentTransactions.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p class="mt-2 text-gray-500">No recent transactions</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="transaction in recentTransactions"
                :key="transaction.id"
                class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-900">{{ transaction.customer_name }}</p>
                    <p class="text-sm text-gray-500">{{ transaction.order_number }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">${{ formatCurrency(transaction.amount) }}</p>
                  <div class="flex items-center">
                    <span
                      :class="getStatusColor(transaction.status)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2"
                    >
                      {{ transaction.status }}
                    </span>
                    <span class="text-xs text-gray-500">{{ transaction.payment_provider }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-8">
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div class="px-6 py-5 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <router-link
                to="/commerce/orders"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md hover:bg-blue-50 transition-all duration-200"
              >
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">View Orders</h4>
                  <p class="text-sm text-gray-500">Manage all orders</p>
                </div>
              </router-link>

              <router-link
                to="/commerce/payment-links"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md hover:bg-green-50 transition-all duration-200"
              >
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">Payment Links</h4>
                  <p class="text-sm text-gray-500">Create and manage links</p>
                </div>
              </router-link>

              <router-link
                to="/commerce/settings"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md hover:bg-purple-50 transition-all duration-200"
              >
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">Settings</h4>
                  <p class="text-sm text-gray-500">Configure Stripe</p>
                </div>
              </router-link>

              <router-link
                to="/commerce/subscription-plans"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md hover:bg-orange-50 transition-all duration-200"
              >
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">Subscription Plans</h4>
                  <p class="text-sm text-gray-500">Manage plans</p>
                </div>
              </router-link>

              <router-link
                to="/commerce/subscriptions"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md hover:bg-indigo-50 transition-all duration-200"
              >
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">Subscriptions</h4>
                  <p class="text-sm text-gray-500">View all subscriptions</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Analytics Charts -->
      <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Conversion Rate Chart -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
          <AnalyticsCharts
            type="conversion"
            :data="{ conversion: conversionData }"
            :loading="analyticsLoading"
          />
        </div>

        <!-- Transaction Volume Chart -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
          <AnalyticsCharts
            type="transactions"
            :data="{ transactions: transactionData }"
            :loading="analyticsLoading"
            @period-change="handlePeriodChange"
          />
        </div>
      </div>

      <!-- Payment Links Performance -->
      <div class="mt-8">
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
          <AnalyticsCharts
            type="payment-links"
            :data="{ paymentLinks: paymentLinkAnalytics }"
            :loading="analyticsLoading"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCommerceOrdersStore } from '@/stores/useCommerceOrdersStore'
import { useCommerceLinksStore } from '@/stores/useCommerceLinksStore'
import { useCommerceAnalyticsStore } from '@/stores/useCommerceAnalyticsStore'
import { useCommerceSubscriptionsStore } from '@/stores/useCommerceSubscriptionsStore'
import StatsCard from '@/components/commerce/StatsCard.vue'
import AnalyticsCharts from '@/components/commerce/AnalyticsCharts.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { commerceAPI } from '@/services/api.js'

// Icon components
const OrdersIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  `
}

const RevenueIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  `
}

const LinksIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  `
}

const AverageIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  `
}

const SubscriptionIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  `
}

const MRRIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  `
}

const ChurnIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  `
}

const ordersStore = useCommerceOrdersStore()
const linksStore = useCommerceLinksStore()
const analyticsStore = useCommerceAnalyticsStore()
const subscriptionsStore = useCommerceSubscriptionsStore()

const loading = ref(false)
const analyticsLoading = ref(false)
const selectedPeriod = ref('30d')

const stats = computed(() => ordersStore.stats)
const recentOrders = computed(() => ordersStore.orders.slice(0, 5))
const activeLinksCount = computed(() => linksStore.totalActiveLinks)

// Analytics data
const analyticsOverview = computed(() => analyticsStore.overview)
const revenueData = computed(() => analyticsStore.revenueData)
const conversionData = computed(() => analyticsStore.conversionData)
const transactionData = computed(() => analyticsStore.transactionData)
const paymentLinkAnalytics = computed(() => analyticsStore.paymentLinkAnalytics)
const recentTransactions = computed(() => analyticsStore.recentTransactions)

const refreshData = async () => {
  loading.value = true
  analyticsLoading.value = true
  try {
    await Promise.all([
      ordersStore.fetchStats(),
      ordersStore.fetchOrders({ limit: 5 }),
      linksStore.fetchPaymentLinks(),
      analyticsStore.fetchOverview(),
      analyticsStore.fetchRevenueData(selectedPeriod.value),
      analyticsStore.fetchConversionData(selectedPeriod.value),
      analyticsStore.fetchTransactionData(selectedPeriod.value),
      analyticsStore.fetchPaymentLinkAnalytics(),
      analyticsStore.fetchRecentTransactions(),
      subscriptionsStore.fetchAnalytics()
    ])
  } catch (error) {
    console.error('Error refreshing data:', error)
  } finally {
    loading.value = false
    analyticsLoading.value = false
  }
}

const handlePeriodChange = async (period) => {
  selectedPeriod.value = period
  analyticsLoading.value = true
  try {
    await Promise.all([
      analyticsStore.fetchRevenueData(period),
      analyticsStore.fetchConversionData(period),
      analyticsStore.fetchTransactionData(period)
    ])
  } catch (error) {
    console.error('Error updating period data:', error)
  } finally {
    analyticsLoading.value = false
  }
}

const exportAnalytics = async () => {
  try {
    await analyticsStore.exportAnalytics('csv', selectedPeriod.value)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Export Successful!',
        text: 'Analytics data has been exported successfully',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } catch (error) {
    console.error('Error exporting analytics:', error)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Failed to export analytics data',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  }
}


const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const getStatusColor = (status) => {
  const colors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
    processing: 'bg-blue-100 text-blue-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}


onMounted(() => {
  refreshData()
})
</script>
