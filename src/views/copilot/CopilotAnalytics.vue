<template>
  <div class="copilot-analytics">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Maxi Analytics</h1>
          <p class="text-gray-600 mt-1">Insights and usage statistics for your AI assistant</p>
        </div>
        <div class="flex items-center space-x-4">
          <select
            v-model="selectedPeriod"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            @click="refreshAnalytics"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="p-6 space-y-6">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Conversations</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.totalConversations }}</p>
              <p class="text-sm text-green-600">+{{ analytics.conversationGrowth }}% from last period</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Success Rate</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.successRate }}%</p>
              <p class="text-sm text-green-600">+{{ analytics.successRateGrowth }}% from last period</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.avgResponseTime }}s</p>
              <p class="text-sm text-green-600">-{{ analytics.responseTimeImprovement }}% from last period</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">User Satisfaction</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.userSatisfaction }}%</p>
              <p class="text-sm text-green-600">+{{ analytics.satisfactionGrowth }}% from last period</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Usage Over Time -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Usage Over Time</h3>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p class="text-gray-500">Chart would be rendered here</p>
            </div>
          </div>
        </div>

        <!-- Feature Usage -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Feature Usage</h3>
          <div class="space-y-4">
            <div
              v-for="feature in analytics.featureUsage"
              :key="feature.name"
              class="flex items-center justify-between"
            >
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span class="text-sm font-medium text-gray-900">{{ feature.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-blue-500 h-2 rounded-full"
                    :style="{ width: `${(feature.usage / analytics.maxFeatureUsage) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm text-gray-600 w-12 text-right">{{ feature.usage }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Queries -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Popular Queries</h3>
        <div class="space-y-3">
          <div
            v-for="(query, index) in analytics.popularQueries"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center">
              <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                {{ index + 1 }}
              </span>
              <span class="text-sm font-medium text-gray-900">{{ query.text }}</span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500">{{ query.count }} times</span>
              <span
                class="px-2 py-1 text-xs rounded-full"
                :class="query.confidence > 0.8 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
              >
                {{ Math.round(query.confidence * 100) }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Response Quality -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Response Quality</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">High Confidence</span>
              <div class="flex items-center space-x-2">
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 75%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">75%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Medium Confidence</span>
              <div class="flex items-center space-x-2">
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div class="bg-yellow-500 h-2 rounded-full" style="width: 20%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">20%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Low Confidence</span>
              <div class="flex items-center space-x-2">
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div class="bg-red-500 h-2 rounded-full" style="width: 5%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">5%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">User Feedback</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Helpful</span>
              <div class="flex items-center space-x-2">
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 85%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">85%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Neutral</span>
              <div class="flex items-center space-x-2">
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div class="bg-yellow-500 h-2 rounded-full" style="width: 10%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">10%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Not Helpful</span>
              <div class="flex items-center space-x-2">
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div class="bg-red-500 h-2 rounded-full" style="width: 5%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCopilotStore } from '@/stores/copilotStore'

const copilotStore = useCopilotStore()

// Reactive state
const loading = ref(false)
const selectedPeriod = ref('30')

// Analytics data
const analytics = ref({
  totalConversations: 1247,
  conversationGrowth: 23,
  successRate: 94,
  successRateGrowth: 5,
  avgResponseTime: 1.2,
  responseTimeImprovement: 15,
  userSatisfaction: 89,
  satisfactionGrowth: 8,
  featureUsage: [
    { name: 'Contact Management', usage: 156, maxUsage: 200 },
    { name: 'Deal Pipeline', usage: 134, maxUsage: 200 },
    { name: 'Email Campaigns', usage: 98, maxUsage: 200 },
    { name: 'Website Builder', usage: 87, maxUsage: 200 },
    { name: 'Analytics', usage: 76, maxUsage: 200 }
  ],
  popularQueries: [
    { text: 'How do I create a contact?', count: 45, confidence: 0.95 },
    { text: 'How do I move a deal to the next stage?', count: 38, confidence: 0.88 },
    { text: 'How do I create an email campaign?', count: 32, confidence: 0.92 },
    { text: 'What can I do here?', count: 28, confidence: 0.85 },
    { text: 'How do I build a website page?', count: 24, confidence: 0.90 }
  ]
})

// Methods
const refreshAnalytics = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // In a real app, you would fetch fresh data here
  } catch (error) {
    console.error('Failed to refresh analytics:', error)
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(async () => {
  await copilotStore.initialize()
})
</script>

<style scoped>
.copilot-analytics {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>

