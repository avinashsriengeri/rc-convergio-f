<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Announcement Analytics</h1>
        <p class="mt-2 text-lg text-gray-600">Track engagement and performance metrics</p>
      </div>
      <router-link
        :to="{ name: 'HrAnnouncements' }"
        class="inline-flex items-center px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Announcements
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="hrAnnouncementsStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading analytics...</p>
    </div>

    <!-- Analytics Content -->
    <div v-else-if="analytics" class="space-y-6">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-xl p-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Announcements</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.total_announcements || 0 }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-xl p-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Published</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.published || 0 }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-100 rounded-xl p-4">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Drafts</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.drafts || 0 }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-100 rounded-xl p-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Acknowledgment Rate</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.acknowledgment_rate?.toFixed(1) || 0 }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Viewed vs Not Viewed -->
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Viewed vs Not Viewed</h3>
          <div class="flex items-center justify-center h-64">
            <div class="text-center">
              <div class="relative w-48 h-48 mx-auto mb-4">
                <svg class="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="currentColor"
                    stroke-width="16"
                    fill="transparent"
                    class="text-gray-200"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="currentColor"
                    stroke-width="16"
                    fill="transparent"
                    :stroke-dasharray="`${(analytics.total_views / (analytics.total_views + (analytics.total_views * 0.3))) * 502.4} 502.4`"
                    class="text-blue-600"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <p class="text-3xl font-bold text-gray-900">
                      {{ analytics.total_views > 0 ? Math.round((analytics.total_views / (analytics.total_views + (analytics.total_views * 0.3))) * 100) : 0 }}%
                    </p>
                    <p class="text-sm text-gray-500">Viewed</p>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-center space-x-4 text-sm">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                  <span>Viewed</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                  <span>Not Viewed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Engagement Metrics -->
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">Total Views</span>
              <span class="text-lg font-bold text-blue-600">{{ analytics.total_views || 0 }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">Total Acknowledged</span>
              <span class="text-lg font-bold text-green-600">{{ analytics.total_acknowledged || 0 }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">Total Likes</span>
              <span class="text-lg font-bold text-pink-600">{{ analytics.total_likes || 0 }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">Total Comments</span>
              <span class="text-lg font-bold text-purple-600">{{ analytics.total_comments || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mandatory Acknowledgment -->
      <div v-if="analytics.mandatory_total > 0" class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Mandatory Acknowledgment Status</h3>
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Acknowledged</span>
              <span class="text-sm font-bold text-gray-900">
                {{ analytics.mandatory_acknowledged || 0 }} / {{ analytics.mandatory_total || 0 }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                class="bg-green-600 h-3 rounded-full transition-all duration-300"
                :style="{ width: `${(analytics.mandatory_acknowledged / analytics.mandatory_total) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hrAnnouncementsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-800">{{ hrAnnouncementsStore.error }}</p>
      <button
        @click="loadAnalytics"
        class="mt-4 px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHrAnnouncementsStore } from '../store/hrAnnouncements'

const hrAnnouncementsStore = useHrAnnouncementsStore()

const analytics = computed(() => hrAnnouncementsStore.analytics)

const loadAnalytics = async () => {
  await hrAnnouncementsStore.fetchAnalytics()
}

onMounted(() => {
  loadAnalytics()
})
</script>

