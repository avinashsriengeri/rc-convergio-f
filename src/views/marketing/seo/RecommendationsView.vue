<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">SEO Recommendations</h2>
        <p class="mt-1 text-sm text-gray-500">
          <span v-if="recommendationsStore.openCount > 0" class="text-red-600 font-semibold">
            {{ recommendationsStore.openCount }} open
          </span>
          <span v-else class="text-green-600 font-semibold">All recommendations resolved</span>
          <span v-if="recommendationsStore.criticalCount > 0" class="ml-2 text-red-600">
            • {{ recommendationsStore.criticalCount }} critical
          </span>
        </p>
      </div>
      <button
        v-if="recommendationsStore.selectedIds.size > 0"
        @click="bulkResolve"
        :disabled="recommendationsStore.loading"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Resolve Selected ({{ recommendationsStore.selectedIds.size }})
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white shadow rounded-lg p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Severity Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Severity</label>
          <select
            v-model="recommendationsStore.severityFilter"
            class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="recommendationsStore.statusFilter"
            class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
            <option value="ignored">Ignored</option>
          </select>
        </div>

        <!-- Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            v-model="recommendationsStore.typeFilter"
            class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Types</option>
            <option value="meta">Meta Tags</option>
            <option value="title">Title</option>
            <option value="alt">Alt Text</option>
            <option value="heading">Headings</option>
            <option value="content">Content</option>
            <option value="technical">Technical</option>
            <option value="performance">Performance</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex items-end">
          <button
            @click="refreshRecommendations"
            :disabled="recommendationsStore.loading"
            class="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg v-if="!recommendationsStore.loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Selection Bar -->
    <div v-if="openRecommendations.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="allSelected"
              @change="toggleSelectAll"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700">
              Select all open recommendations
            </span>
          </label>
        </div>
        <button
          v-if="recommendationsStore.selectedIds.size > 0"
          @click="recommendationsStore.clearSelection()"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear Selection
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="recommendationsStore.loading && recommendationsStore.recommendations.length === 0" class="bg-white shadow rounded-lg p-12">
      <div class="flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-500">Loading recommendations...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!recommendationsStore.loading && recommendationsStore.filteredRecommendations.length === 0" class="bg-white shadow rounded-lg p-12">
      <div class="text-center">
        <svg class="mx-auto h-16 w-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No recommendations found</h3>
        <p class="mt-2 text-sm text-gray-500">
          {{ recommendationsStore.recommendations.length === 0 
            ? 'Your site is in great shape! Check back later for new recommendations.' 
            : 'Try adjusting your filters to see more recommendations.' 
          }}
        </p>
      </div>
    </div>

    <!-- Recommendations List -->
    <div v-else class="space-y-4">
      <div
        v-for="recommendation in recommendationsStore.filteredRecommendations"
        :key="recommendation.id"
        class="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-start space-x-4">
            <!-- Checkbox -->
            <div v-if="recommendation.status === 'open'" class="pt-1">
              <input
                type="checkbox"
                :checked="recommendationsStore.selectedIds.has(recommendation.id)"
                @change="recommendationsStore.toggleSelection(recommendation.id)"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <!-- Icon -->
            <div class="flex-shrink-0 pt-1">
              <svg v-if="recommendation.severity === 'critical'" class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <svg v-else-if="recommendation.severity === 'high'" class="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <svg v-else-if="recommendation.severity === 'medium'" class="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <!-- Badges -->
              <div class="flex flex-wrap items-center gap-2 mb-3">
                <span :class="getSeverityBadgeClass(recommendation.severity)" class="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full">
                  {{ recommendation.severity.toUpperCase() }}
                </span>
                <span class="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {{ formatType(recommendation.type) }}
                </span>
                <span :class="getStatusBadgeClass(recommendation.status)" class="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full">
                  {{ recommendation.status.toUpperCase() }}
                </span>
              </div>

              <!-- Title & Description -->
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ recommendation.title }}</h3>
              <p class="text-sm text-gray-600 mb-3">{{ recommendation.description }}</p>

              <!-- Page URL -->
              <div class="flex items-center space-x-2 mb-3">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <a :href="recommendation.pageUrl" target="_blank" class="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all">
                  {{ recommendation.pageUrl }}
                </a>
              </div>

              <!-- Expandable Details -->
              <div v-if="expandedId === recommendation.id" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div class="space-y-3">
                  <div>
                    <h4 class="text-sm font-semibold text-gray-900 mb-1">Impact:</h4>
                    <p class="text-sm text-gray-600">{{ recommendation.impact }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-semibold text-gray-900 mb-1">How to Fix:</h4>
                    <p class="text-sm text-gray-600">{{ recommendation.howToFix }}</p>
                  </div>
                  <div class="text-xs text-gray-500">
                    Created: {{ formatDate(recommendation.createdAt) }}
                    <span v-if="recommendation.resolvedAt" class="ml-2">
                      • Resolved: {{ formatDate(recommendation.resolvedAt) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-4 mt-4">
                <button
                  @click="toggleExpand(recommendation.id)"
                  class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {{ expandedId === recommendation.id ? 'Hide Details' : 'View Details' }}
                </button>
                <button
                  v-if="recommendation.status === 'open'"
                  @click="resolveRecommendation(recommendation.id)"
                  :disabled="recommendationsStore.loading"
                  class="text-sm text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                >
                  Mark as Resolved
                </button>
                <router-link
                  :to="`/marketing/seo/pages/${recommendation.pageId}`"
                  class="text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  View Page
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Count -->
    <div v-if="recommendationsStore.filteredRecommendations.length > 0" class="text-sm text-gray-500 text-center">
      Showing {{ recommendationsStore.filteredRecommendations.length }} recommendation{{ recommendationsStore.filteredRecommendations.length !== 1 ? 's' : '' }}
      <span v-if="recommendationsStore.recommendations.length !== recommendationsStore.filteredRecommendations.length">
        of {{ recommendationsStore.recommendations.length }} total
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSeoRecommendationsStore } from '@/stores/seoRecommendations'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const recommendationsStore = useSeoRecommendationsStore()
const expandedId = ref<number | null>(null)

const openRecommendations = computed(() => {
  return recommendationsStore.filteredRecommendations.filter(r => r.status === 'open')
})

const allSelected = computed(() => {
  if (openRecommendations.value.length === 0) return false
  return openRecommendations.value.every(r => recommendationsStore.selectedIds.has(r.id))
})

const getSeverityBadgeClass = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800'
    case 'high': return 'bg-orange-100 text-orange-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'open': return 'bg-red-100 text-red-800'
    case 'resolved': return 'bg-green-100 text-green-800'
    case 'ignored': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatType = (type: string) => {
  return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const toggleExpand = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    recommendationsStore.clearSelection()
  } else {
    recommendationsStore.selectAll()
  }
}

const resolveRecommendation = async (id: number) => {
  try {
    await recommendationsStore.resolveRecommendation(id)
    showSuccess('Recommendation resolved successfully')
  } catch (error) {
    showError('Failed to resolve recommendation')
  }
}

const bulkResolve = async () => {
  if (recommendationsStore.selectedIds.size === 0) return

  const count = recommendationsStore.selectedIds.size
  try {
    await recommendationsStore.bulkResolve()
    showSuccess(`${count} recommendation${count > 1 ? 's' : ''} resolved successfully`)
  } catch (error) {
    showError('Failed to resolve recommendations')
  }
}

const refreshRecommendations = async () => {
  try {
    await recommendationsStore.fetchRecommendations()
    showSuccess('Recommendations refreshed')
  } catch (error) {
    showError('Failed to refresh recommendations')
  }
}

onMounted(async () => {
  try {
    await recommendationsStore.fetchRecommendations()
  } catch (error) {
    console.error('Failed to load recommendations:', error)
    showError('Failed to load recommendations')
  }
})
</script>








