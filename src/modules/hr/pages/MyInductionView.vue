<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">My Induction & Training</h1>
      <p class="mt-2 text-lg text-gray-600">Complete your assigned induction and training content</p>
    </div>

    <!-- Progress Overview -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Onboarding Progress</h2>
        <div class="text-right">
          <div class="text-3xl font-bold text-primary-purple">{{ progress.percentage }}%</div>
          <div class="text-sm text-gray-500">{{ progress.completed }} of {{ progress.total }} completed</div>
        </div>
      </div>
      <ProgressBar
        :percentage="progress.percentage"
        :subtitle="`${progress.completed} of ${progress.total} items completed`"
        :color="getProgressColor(progress.percentage)"
      />
      <div v-if="progress.mandatory && progress.mandatory.total > 0" class="mt-4 pt-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" :class="progress.mandatory.all_completed ? 'text-green-600' : 'text-red-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="text-sm font-medium" :class="progress.mandatory.all_completed ? 'text-green-700' : 'text-red-700'">
              Mandatory: {{ progress.mandatory.completed }} of {{ progress.mandatory.total }} completed
            </span>
          </div>
          <span v-if="!progress.mandatory.all_completed" class="text-xs text-red-600 font-medium">
            Must complete all mandatory items
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="employeeInductionStore.loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading your induction items...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="employeeInductionStore.error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-red-800">Error loading induction items</h3>
          <p class="mt-1 text-sm text-red-700">{{ employeeInductionStore.error }}</p>
        </div>
        <button
          @click="loadMyInduction"
          class="ml-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No induction items</h3>
      <p class="mt-2 text-sm text-gray-500">You don't have any assigned induction or training content yet.</p>
    </div>

    <!-- Induction Items -->
    <div v-else class="space-y-4">
      <InductionCard
        v-for="item in items"
        :key="item.assignment_id || item.id"
        :item="item"
        @view="viewContent(item)"
      />
    </div>

    <!-- Content Viewer Modal -->
    <ContentViewerModal
      :show="showViewerModal"
      :content="viewingContent"
      :assignment="viewingAssignment"
      :acknowledging="acknowledging"
      @close="closeViewer"
      @acknowledge="handleAcknowledge"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHrEmployeeInductionStore } from '../store/hrEmployeeInduction'
import ProgressBar from '../components/ProgressBar.vue'
import InductionCard from '../components/InductionCard.vue'
import ContentViewerModal from '../components/ContentViewerModal.vue'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const employeeInductionStore = useHrEmployeeInductionStore()

const showViewerModal = ref(false)
const acknowledging = ref(false)

const progress = computed(() => employeeInductionStore.progress)
const items = computed(() => employeeInductionStore.items)
const viewingContent = computed(() => employeeInductionStore.viewingAssignment?.content)
const viewingAssignment = computed(() => employeeInductionStore.viewingAssignment)

const loadMyInduction = async () => {
  try {
    await employeeInductionStore.fetchMyInduction()
  } catch (err) {
    // Error already handled in store
  }
}

const viewContent = async (item) => {
  try {
    await employeeInductionStore.viewContent(item.assignment_id || item.id)
    showViewerModal.value = true
  } catch (err) {
    showError(err.message || 'Failed to load content')
  }
}

const handleAcknowledge = async () => {
  if (!viewingAssignment.value) return
  
  acknowledging.value = true
  try {
    await employeeInductionStore.acknowledgeContent(
      viewingAssignment.value.assignment_id,
      'I have read and understood this content'
    )
    showSuccess('Content acknowledged successfully')
    closeViewer()
    await loadMyInduction()
  } catch (err) {
    showError(err.message || 'Failed to acknowledge content')
  } finally {
    acknowledging.value = false
  }
}

const closeViewer = () => {
  showViewerModal.value = false
  employeeInductionStore.clearViewingAssignment()
}

const getProgressColor = (percentage) => {
  if (percentage >= 80) return 'green'
  if (percentage >= 50) return 'blue'
  if (percentage >= 25) return 'yellow'
  return 'red'
}

onMounted(() => {
  loadMyInduction()
})
</script>

