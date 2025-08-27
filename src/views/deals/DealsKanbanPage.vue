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
              @click="refreshDeals"
              :loading="dealsStore.loading"
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

    <!-- Filters -->
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
              <option value="">All Pipelines</option>
              <option
                v-for="pipeline in pipelinesStore.pipelines"
                :key="pipeline.id"
                :value="pipeline.id"
              >
                {{ pipeline.name }}
              </option>
            </select>
          </div>

          <!-- Owner Filter -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Owner</label>
            <select
              v-model="selectedOwnerId"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Owners</option>
              <option
                v-for="user in refsStore.users"
                :key="user.id"
                :value="user.id"
              >
                {{ user.name }}
              </option>
            </select>
          </div>

          <!-- Status Filter -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="selectedStatus"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option
                v-for="status in DEAL_STATUSES"
                :key="status.value"
                :value="status.value"
              >
                {{ status.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Kanban Board -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="dealsStore.loading && !dealsStore.deals.length" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="dealsStore.error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading deals</h3>
        <p class="mt-1 text-sm text-gray-500">{{ dealsStore.error }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="refreshDeals">
            Try Again
          </BaseButton>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!dealsStore.loading && !dealsStore.deals.length" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No deals found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first deal.</p>
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
            v-for="stage in stagesForKanban"
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
                      :style="{ backgroundColor: stage.color }"
                    ></div>
                    <h3 class="text-sm font-medium text-gray-900">{{ stage.name }}</h3>
                  </div>
                  <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {{ getDealsForStage(stage.id).length }}
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
                  <div
                    v-for="deal in getDealsForStage(stage.id)"
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

                    <!-- Deal Value -->
                    <div v-if="deal.value" class="mb-3">
                      <div class="text-lg font-semibold" :class="getValueColor(deal.value)">
                        {{ formatCurrency(deal.value, deal.currency) }}
                      </div>
                    </div>

                    <!-- Deal Details -->
                    <div class="space-y-2 text-sm text-gray-600">
                      <!-- Probability -->
                      <div class="flex items-center justify-between">
                        <span>Probability</span>
                        <div class="flex items-center">
                          <div class="w-12 bg-gray-200 rounded-full h-1 mr-2">
                            <div
                              class="h-1 rounded-full"
                              :class="getProbabilityColor(deal.probability)"
                              :style="{ width: deal.probability + '%' }"
                            ></div>
                          </div>
                          <span class="text-xs" :class="getProbabilityColor(deal.probability)">
                            {{ deal.probability }}%
                          </span>
                        </div>
                      </div>

                      <!-- Owner -->
                      <div v-if="deal.owner" class="flex items-center">
                        <div class="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                          <span class="text-xs font-medium text-gray-700">
                            {{ getInitials(deal.owner.name) }}
                          </span>
                        </div>
                        <span class="truncate">{{ deal.owner.name }}</span>
                      </div>

                      <!-- Expected Close Date -->
                      <div v-if="deal.expected_close_date" class="flex items-center">
                        <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span :class="isOverdue(deal.expected_close_date) ? 'text-red-600 font-medium' : ''">
                          {{ formatDate(deal.expected_close_date) }}
                        </span>
                        <span v-if="isOverdue(deal.expected_close_date)" class="ml-1 text-xs text-red-600">
                          Overdue
                        </span>
                      </div>

                      <!-- Contact/Company -->
                      <div v-if="deal.contact || deal.company" class="flex items-center">
                        <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span class="truncate">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDealsStore } from '../../stores/deals'
import { usePipelinesStore } from '../../stores/pipelines'
import { useStagesStore } from '../../stores/stages'
import { useRefsStore } from '../../stores/refs'
import { success, error } from '../../utils/notifications'
import { formatDate, formatCurrency, formatRelativeTime, getInitials, getValueColor, getProbabilityColor, isOverdue } from '../../utils/formatters'
import { DEAL_STATUSES, STATUS_BADGE_COLORS } from '../../utils/constants'
import type { Deal } from '../../types'
import BaseButton from '../../components/ui/BaseButton.vue'
import ConfirmationModal from '../../components/modals/ConfirmationModal.vue'

const router = useRouter()

// Stores
const dealsStore = useDealsStore()
const pipelinesStore = usePipelinesStore()
const stagesStore = useStagesStore()
const refsStore = useRefsStore()

// Reactive data
const showDeleteModal = ref(false)
const dealToDelete = ref<Deal | null>(null)
const selectedPipelineId = ref<number | string>('')
const selectedOwnerId = ref<number | string>('')
const selectedStatus = ref<string>('all')
const draggedDeal = ref<Deal | null>(null)

// Computed
const stagesForKanban = computed(() => {
  if (selectedPipelineId.value) {
    return stagesStore.stages.filter(stage => stage.pipeline_id === selectedPipelineId.value)
  }
  // If no pipeline selected, show all stages from all pipelines
  return stagesStore.stages
})

// Methods
const refreshDeals = () => {
  applyFilters()
}

const applyFilters = () => {
  const filters: any = {
    status: selectedStatus.value === 'all' ? undefined : selectedStatus.value,
    owner_id: selectedOwnerId.value || undefined,
    pipeline_id: selectedPipelineId.value || undefined
  }
  dealsStore.fetchDeals(filters)
}

const onPipelineChange = async () => {
  if (selectedPipelineId.value) {
    await stagesStore.fetchStagesByPipeline(selectedPipelineId.value as number)
  } else {
    // Load all stages if no pipeline selected
    await stagesStore.fetchStages()
  }
  applyFilters()
}

const getDealsForStage = (stageId: number) => {
  return dealsStore.deals.filter(deal => deal.stage_id === stageId)
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
    return
  }

  try {
    await dealsStore.moveDeal(draggedDeal.value.id, stageId)
    success('Deal moved successfully')
  } catch (err) {
    error('Failed to move deal')
  } finally {
    draggedDeal.value = null
  }
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
    await dealsStore.deleteDeal(dealToDelete.value.id)
    showDeleteModal.value = false
    dealToDelete.value = null
    success('Deal deleted successfully')
  } catch (err) {
    error('Failed to delete deal')
  }
}

// Lifecycle
onMounted(async () => {
  // Initialize data
  await Promise.all([
    dealsStore.fetchDeals(),
    pipelinesStore.fetchPipelines(),
    stagesStore.fetchStages(),
    refsStore.initializeData()
  ])
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
