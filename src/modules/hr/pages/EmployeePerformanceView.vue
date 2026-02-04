<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">My KPI Performance</h1>
        <p class="mt-2 text-lg text-gray-600">Track and review your performance</p>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Active Reviews</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.active }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-yellow-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Pending Reviews</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pending }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-green-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Completed Reviews</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.completed }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Reviews -->
    <div v-if="activeAssignments.length > 0" class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Active Reviews ({{ activeAssignments.length }})</h2>
      <div class="space-y-4">
        <div
          v-for="assignment in activeAssignments"
          :key="assignment.id"
          class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ assignment.template?.name || 'N/A' }}</h3>
              <p class="text-sm text-gray-600 mt-1">
                Review Period: {{ formatDate(assignment.review_period_start) }} - {{ formatDate(assignment.review_period_end) }}
              </p>
              <p class="text-sm text-gray-600">{{ assignment.review_period_value }}</p>
            </div>
            <KpiStatusBadge :status="assignment.status" :show-dot="true" />
          </div>
          
          <div v-if="assignment.self_review" class="mb-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-700">
              <span class="font-medium">Your Self Score:</span>
              <span class="ml-2 text-lg font-bold text-primary-purple">{{ assignment.self_review.final_score }}/10</span>
              <span class="ml-2 text-sm">(Grade: {{ assignment.self_review.grade }})</span>
            </p>
          </div>
          
          <button
            v-if="assignment.status === 'self_review_pending'"
            @click="startSelfReview(assignment)"
            class="w-full px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink transition-colors"
          >
            Start Self Review
          </button>
          <button
            v-else
            @click="viewAssignment(assignment)"
            class="w-full px-4 py-2 text-sm font-medium rounded-lg text-primary-purple bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>

    <!-- Completed Reviews -->
    <div v-if="completedAssignments.length > 0" class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Completed Reviews ({{ completedAssignments.length }})</h2>
      <div class="space-y-4">
        <div
          v-for="assignment in completedAssignments"
          :key="assignment.id"
          class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ assignment.template?.name || 'N/A' }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ assignment.review_period_value }}</p>
            </div>
            <KpiStatusBadge :status="assignment.status" :show-dot="true" />
          </div>
          
          <div v-if="assignment.manager_review" class="p-4 bg-green-50 rounded-lg mb-4">
            <p class="text-sm text-gray-700 mb-2">
              <span class="font-medium">Final Score:</span>
              <span class="ml-2 text-xl font-bold text-green-600">{{ assignment.manager_review.final_score }}/10</span>
              <span class="ml-2 text-sm">(Grade: {{ assignment.manager_review.grade }})</span>
            </p>
            <p v-if="assignment.manager_review.comments" class="text-sm text-gray-600 mt-2 italic">
              "{{ assignment.manager_review.comments }}"
            </p>
          </div>
          
          <button
            @click="viewAssignment(assignment)"
            class="w-full px-4 py-2 text-sm font-medium rounded-lg text-primary-purple bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!employeeKpiStore.loading && employeeKpiStore.assignments.length === 0" class="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
      <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-6 text-lg font-semibold text-gray-900">No KPI assignments found</h3>
      <p class="mt-2 text-sm text-gray-500">Your KPI assignments will appear here once assigned by HR.</p>
    </div>

    <!-- Loading State -->
    <div v-if="employeeKpiStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading your performance reviews...</p>
    </div>

    <!-- Self Review Modal -->
    <EmployeeSelfReviewModal
      :show="showSelfReviewModal"
      :assignment="selectedAssignment"
      @close="closeSelfReviewModal"
      @save="handleSelfReviewSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEmployeeKpiStore } from '../store/employeeKpi'
import { success as showSuccess, error as showError } from '@/utils/notifications'
import KpiStatusBadge from '../components/KpiStatusBadge.vue'
import EmployeeSelfReviewModal from '../components/EmployeeSelfReviewModal.vue'

const employeeKpiStore = useEmployeeKpiStore()

const showSelfReviewModal = ref(false)
const selectedAssignment = ref(null)

const stats = computed(() => employeeKpiStore.stats)

const activeAssignments = computed(() => {
  return employeeKpiStore.assignments.filter(a => 
    a.status === 'self_review_pending' || a.status === 'self_review_submitted' || a.status === 'manager_review_pending'
  )
})

const completedAssignments = computed(() => {
  return employeeKpiStore.assignments.filter(a => a.status === 'completed')
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const loadAssignments = async () => {
  try {
    await employeeKpiStore.fetchMyAssignments()
  } catch (err) {
    showError(err.message || 'Failed to load assignments')
  }
}

const startSelfReview = async (assignment) => {
  try {
    await employeeKpiStore.fetchAssignment(assignment.id)
    selectedAssignment.value = employeeKpiStore.selectedAssignment
    showSelfReviewModal.value = true
  } catch (err) {
    showError(err.message || 'Failed to load assignment details')
  }
}

const viewAssignment = async (assignment) => {
  try {
    await employeeKpiStore.fetchAssignment(assignment.id)
    selectedAssignment.value = employeeKpiStore.selectedAssignment
    showSelfReviewModal.value = true
  } catch (err) {
    showError(err.message || 'Failed to load assignment details')
  }
}

const closeSelfReviewModal = () => {
  showSelfReviewModal.value = false
  selectedAssignment.value = null
}

const handleSelfReviewSave = async () => {
  await loadAssignments()
  closeSelfReviewModal()
  showSuccess('Self review submitted successfully')
}

onMounted(() => {
  loadAssignments()
})
</script>

