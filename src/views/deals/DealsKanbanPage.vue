<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Deals Kanban</h1>
            <p class="text-sm text-gray-600 mt-1">Drag and drop deals between stages</p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="secondary"
              @click="loadKanbanData"
              :loading="loading"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </BaseButton>
            <BaseButton
              variant="secondary"
              @click="$router.push('/deals')"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              List View
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="$router.push('/deals/new')"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Deal
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Pipeline Filter -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Pipeline Filter -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Pipeline</label>
            <select
              v-model="selectedPipelineId"
              @change="onPipelineChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option :value="undefined">Select Pipeline</option>
              <option
                v-for="pipeline in pipelinesStore.pipelines"
                :key="pipeline.id"
                :value="pipeline.id"
              >
                {{ pipeline.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Kanban Board -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading && !kanbanData.length" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading kanban data</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="loadKanbanData">
            Try Again
          </BaseButton>
        </div>
      </div>

      <!-- Empty State - No Pipeline Selected -->
      <div v-else-if="!selectedPipelineId" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Select a Pipeline</h3>
        <p class="mt-1 text-sm text-gray-500">Choose a pipeline from the dropdown above to view the kanban board.</p>
      </div>

      <!-- Empty State - No Stages or Deals -->
      <div v-else-if="!loading && kanbanData.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No stages or deals available</h3>
        <p class="mt-1 text-sm text-gray-500">No stages or deals available for this pipeline.</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="$router.push('/deals/new')">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Deal
          </BaseButton>
        </div>
      </div>

      <!-- Kanban Board -->
      <div v-else class="overflow-x-auto">
        <div class="flex space-x-6 min-w-max">
          <div
            v-for="stage in kanbanData"
            :key="stage.id"
            class="flex-shrink-0 w-80"
          >
            <!-- Stage Header -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="px-4 py-3 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div
                      class="w-3 h-3 rounded-full mr-2"
                      :style="{ backgroundColor: stage.color || '#6B7280' }"
                    ></div>
                    <h3 class="text-sm font-medium text-gray-900">{{ stage.name }}</h3>
                  </div>
                  <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {{ stage.deals ? stage.deals.length : 0 }}
                  </span>
                </div>
              </div>

              <!-- Stage Content -->
              <div class="p-4">
                <div
                  class="space-y-3"
                  @drop="onDrop($event, stage.id)"
                  @dragover.prevent
                  @dragenter.prevent
                >
                  <!-- No deals in this stage -->
                  <div v-if="!stage.deals || stage.deals.length === 0" class="text-center py-8 text-gray-500">
                    <p class="text-sm">No deals in this stage</p>
                  </div>

                  <!-- Deals -->
                  <div
                    v-for="deal in stage.deals"
                    :key="deal.id"
                    class="bg-white border border-gray-200 rounded-lg p-4 cursor-move hover:shadow-md transition-shadow"
                    draggable="true"
                    @dragstart="onDragStart($event, deal)"
                    @click="viewDeal(deal)"
                  >
                    <!-- Deal Header -->
                    <div class="flex items-start justify-between mb-3">
                      <h4 class="text-sm font-medium text-gray-900 line-clamp-2">
                        {{ deal.title }}
                      </h4>
                      <div class="flex items-center space-x-1">
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          :class="STATUS_BADGE_COLORS[deal.status]"
                        >
                          {{ deal.status }}
                        </span>
                      </div>
                    </div>

                    <!-- Deal Details -->
                    <div class="space-y-2">
                      <!-- Value -->
                      <div v-if="deal.value" class="flex items-center">
                        <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span class="text-sm text-gray-600">{{ formatCurrency(deal.value, deal.currency) }}</span>
                      </div>

                      <!-- Owner -->
                      <div v-if="deal.owner" class="flex items-center">
                        <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span class="text-sm text-gray-600">{{ deal.owner.name }}</span>
                      </div>

                      <!-- Expected Close Date -->
                      <div v-if="deal.expected_close_date" class="flex items-center">
                        <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span class="text-sm text-gray-600">{{ formatDate(deal.expected_close_date) }}</span>
                        <span v-if="isOverdue(deal.expected_close_date)" class="ml-1 text-xs text-red-600">
                          Overdue
                        </span>
                      </div>

                      <!-- Contact/Company -->
                      <div v-if="deal.contact || deal.company" class="flex items-center">
                        <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span class="truncate text-sm text-gray-600">
                          {{ deal.contact?.name || deal.company?.name || 'No contact' }}
                        </span>
                      </div>
                    </div>

                    <!-- Deal Actions -->
                    <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div class="text-xs text-gray-500">
                        {{ formatRelativeTime(deal.updated_at) }}
                      </div>
                      <div class="flex items-center space-x-1">
                        <button
                          @click.stop="editDeal(deal)"
                          class="text-gray-400 hover:text-gray-600 p-1"
                          title="Edit deal"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click.stop="deleteDeal(deal)"
                          class="text-gray-400 hover:text-red-600 p-1"
                          title="Delete deal"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
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

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      title="Delete Deal"
      :message="`Are you sure you want to delete the deal '${dealToDelete?.title}'? This action cannot be undone.`"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />

    <!-- Move Stage Modal (for drag-drop) -->
    <MoveStageModal
      v-if="showMoveModal && pendingMove.deal"
      :deal-id="pendingMove.deal.id"
      :current-stage-id="pendingMove.fromStageId || 0"
      :pipeline-id="selectedPipelineId as number"
      :target-stage-id="pendingMove.toStageId || undefined"
      :show-current-stage="true"
      @confirm="onMoveConfirmed"
      @cancel="onMoveCancelled"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePipelinesStore } from '../../stores/pipelines'
import { useRefsStore } from '../../stores/refs'
import { pipelinesAPI, dealsAPI } from '../../services/api'
import { success, error as showError } from '../../utils/notifications'
import { formatDate, formatCurrency, formatRelativeTime, isOverdue } from '../../utils/formatters'
import { STATUS_BADGE_COLORS } from '../../utils/constants'
import type { Deal } from '../../types'
import BaseButton from '../../components/ui/BaseButton.vue'
import ConfirmationModal from '../../components/modals/ConfirmationModal.vue'
import MoveStageModal from '../../components/modals/MoveStageModal.vue'

const router = useRouter()

// Stores
const pipelinesStore = usePipelinesStore()
const refsStore = useRefsStore()

// Reactive data
const loading = ref(false)
const error = ref<string | null>(null)
const kanbanData = ref<any[]>([])
const showDeleteModal = ref(false)
const dealToDelete = ref<Deal | null>(null)
const selectedPipelineId = ref<number | undefined>(undefined)
const draggedDeal = ref<Deal | null>(null)
const showMoveModal = ref(false)
const pendingMove = ref<{
  deal: Deal | null
  fromStageId: number | null
  toStageId: number | null
}>({
  deal: null,
  fromStageId: null,
  toStageId: null
})

// Methods
const loadKanbanData = async () => {
  if (!selectedPipelineId.value) {
    kanbanData.value = []
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await pipelinesAPI.getKanban(selectedPipelineId.value as number)
    kanbanData.value = response.data.stages || []
  } catch (err: any) {
    console.error('Error loading kanban data:', err)
    error.value = err.response?.data?.message || 'Failed to load kanban data'
    kanbanData.value = []
  } finally {
    loading.value = false
  }
}

const onPipelineChange = async () => {
  await loadKanbanData()
}

const onDragStart = (event: DragEvent, deal: Deal) => {
  draggedDeal.value = deal
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

const onDrop = async (event: DragEvent, stageId: number) => {
  event.preventDefault()
  
  if (!draggedDeal.value || draggedDeal.value.stage_id === stageId) {
    draggedDeal.value = null
    return
  }

  // Store pending move info and show modal instead of calling API immediately
  pendingMove.value = {
    deal: draggedDeal.value,
    fromStageId: draggedDeal.value.stage_id,
    toStageId: stageId
  }
  showMoveModal.value = true
  draggedDeal.value = null
}

const onMoveConfirmed = async (stageId: number, reason: string) => {
  if (!pendingMove.value.deal) return

  try {
    await dealsAPI.moveDeal(pendingMove.value.deal.id, stageId, reason)
    
    // Get stage names for success message
    const fromStage = kanbanData.value.find(s => s.id === pendingMove.value.fromStageId)
    const toStage = kanbanData.value.find(s => s.id === stageId)
    const fromName = fromStage?.name || 'Unknown'
    const toName = toStage?.name || 'Unknown'
    
    success(`Deal moved from "${fromName}" to "${toName}"`)
    
    // Close modal and refresh kanban
    showMoveModal.value = false
    pendingMove.value = { deal: null, fromStageId: null, toStageId: null }
    await loadKanbanData()
  } catch (err: any) {
    console.error('Error moving deal:', err)
    // Error handling is done in modal, but we still need to refresh on error
    showMoveModal.value = false
    pendingMove.value = { deal: null, fromStageId: null, toStageId: null }
    showError(err.response?.data?.message || 'Failed to move deal')
    await loadKanbanData() // Refresh to revert visual state
  }
}

const onMoveCancelled = () => {
  showMoveModal.value = false
  pendingMove.value = { deal: null, fromStageId: null, toStageId: null }
  // Refresh kanban to ensure card is back in original position
  loadKanbanData()
}

const viewDeal = (deal: Deal) => {
  router.push(`/deals/${deal.id}`)
}

const editDeal = (deal: Deal) => {
  router.push(`/deals/${deal.id}/edit`)
}

const deleteDeal = (deal: Deal) => {
  dealToDelete.value = deal
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!dealToDelete.value) return
  
  try {
    await dealsAPI.deleteDeal(dealToDelete.value.id)
    showDeleteModal.value = false
    dealToDelete.value = null
    success('Deal deleted successfully')
    
    // Refresh the kanban data
    await loadKanbanData()
  } catch (err: any) {
    console.error('Error deleting deal:', err)
    showError(err.response?.data?.message || 'Failed to delete deal')
  }
}

// Lifecycle
onMounted(async () => {
  // Initialize data
  await Promise.all([
    pipelinesStore.fetchPipelines(),
    refsStore.initializeData()
  ])

  // Set default pipeline to first available
  if (pipelinesStore.pipelines.length > 0 && !selectedPipelineId.value) {
    selectedPipelineId.value = pipelinesStore.pipelines[0].id
    await loadKanbanData()
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
