<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Manager KPI Review</h1>
        <p class="mt-2 text-lg text-gray-600">Review and evaluate your team's performance</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="handleFilterChange"
          >
            <option value="">All Status</option>
            <option value="self_review_submitted">Awaiting Review</option>
            <option value="manager_review_pending">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            v-model="filters.sortBy"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="handleFilterChange"
          >
            <option value="created_at">Date Created</option>
            <option value="review_period_value">Review Period</option>
            <option value="employee_id">Employee</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Order</label>
          <select
            v-model="filters.sortOrder"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="handleFilterChange"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Team Performance Reviews -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">My Team Performance Reviews</h2>
      
      <div v-if="reviewsStore.loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading reviews...</p>
      </div>
      
      <div v-else-if="reviewsStore.reviews.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="review in reviewsStore.reviews"
          :key="review.id"
          class="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-300 cursor-pointer"
          @click="openReviewModal(review)"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ review.employee?.full_name || 'N/A' }}</h3>
              <p class="text-sm text-gray-500">{{ review.employee?.job_title || '' }}</p>
            </div>
            <div class="flex-shrink-0">
              <KpiStatusBadge :status="review.status" :show-dot="true" />
            </div>
          </div>
          
          <div class="space-y-2 mb-4">
            <div class="text-sm text-gray-600">
              <span class="font-medium">Template:</span>
              <span class="ml-2">{{ review.template?.name || 'N/A' }}</span>
            </div>
            <div class="text-sm text-gray-600">
              <span class="font-medium">Period:</span>
              <span class="ml-2">{{ review.review_period_value || 'N/A' }}</span>
            </div>
            <div v-if="review.self_review" class="text-sm text-gray-600">
              <span class="font-medium">Self Score:</span>
              <span class="ml-2 font-semibold text-primary-purple">{{ review.self_review.final_score }}/10</span>
            </div>
            <div v-if="review.manager_review" class="text-sm text-gray-600">
              <span class="font-medium">Final Score:</span>
              <span class="ml-2 font-semibold text-green-600">{{ review.manager_review.final_score }}/10 ({{ review.manager_review.grade }})</span>
            </div>
          </div>
          
          <button
            class="w-full px-4 py-2 text-sm font-medium rounded-lg text-primary-purple bg-purple-50 hover:bg-purple-100 transition-colors"
            @click.stop="openReviewModal(review)"
          >
            {{ review.status === 'completed' ? 'View Review' : 'Review Now' }}
          </button>
        </div>
      </div>
      
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-6 text-lg font-semibold text-gray-900">No reviews found</h3>
        <p class="mt-2 text-sm text-gray-500">No team member reviews are available at this time.</p>
      </div>
    </div>

    <!-- Review Modal -->
    <ManagerReviewModal
      :show="showReviewModal"
      :review="selectedReview"
      @close="closeReviewModal"
      @save="handleReviewSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useManagerKpiReviewsStore } from '../store/managerKpiReviews'
import { success as showSuccess, error as showError } from '@/utils/notifications'
import KpiStatusBadge from '../components/KpiStatusBadge.vue'
import ManagerReviewModal from '../components/ManagerReviewModal.vue'

const reviewsStore = useManagerKpiReviewsStore()

const showReviewModal = ref(false)
const selectedReview = ref(null)

const filters = computed(() => reviewsStore.filters)

const handleFilterChange = () => {
  reviewsStore.setFilters({ page: 1 })
  loadReviews()
}

const loadReviews = async () => {
  try {
    await reviewsStore.fetchMyTeamReviews()
  } catch (err) {
    showError(err.message || 'Failed to load reviews')
  }
}

const openReviewModal = async (review) => {
  try {
    await reviewsStore.fetchReview(review.id)
    selectedReview.value = reviewsStore.selectedReview
    showReviewModal.value = true
  } catch (err) {
    showError(err.message || 'Failed to load review details')
  }
}

const closeReviewModal = () => {
  showReviewModal.value = false
  selectedReview.value = null
}

const handleReviewSave = async () => {
  await loadReviews()
  closeReviewModal()
  showSuccess('Review submitted successfully')
}

onMounted(() => {
  loadReviews()
})
</script>

