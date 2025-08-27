<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Deals Pipeline</h1>
            <p class="text-sm text-gray-600 mt-1">Drag and drop deals to move them between stages</p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="secondary"
              @click="refreshDeals"
              :loading="loading"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="openCreateModal"
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

    <!-- Pipeline Selector -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center space-x-4">
          <label for="pipeline" class="text-sm font-medium text-gray-700">Pipeline:</label>
          <select
            id="pipeline"
            v-model="selectedPipeline"
            @change="onPipelineChange"
            class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Pipeline</option>
            <option v-for="pipeline in pipelines" :key="pipeline.id" :value="pipeline.id">
              {{ pipeline.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Kanban Board -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading pipeline...
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!selectedPipeline" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Select a Pipeline</h3>
        <p class="mt-1 text-sm text-gray-500">Choose a pipeline to view its deals in Kanban format.</p>
      </div>

      <!-- Kanban Columns -->
      <div v-else class="flex space-x-6 overflow-x-auto pb-4">
        <div
          v-for="stage in stages"
          :key="stage.id"
          class="flex-shrink-0 w-80"
        >
          <!-- Stage Header -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-4 py-3 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: stage.color || '#6B7280' }"></div>
                  <h3 class="text-sm font-medium text-gray-900">{{ stage.name }}</h3>
                </div>
                <span class="text-xs text-gray-500">{{ getDealsForStage(stage.id).length }} deals</span>
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
                <!-- Deal Cards -->
                <div
                  v-for="deal in getDealsForStage(stage.id)"
                  :key="deal.id"
                  draggable="true"
                  @dragstart="onDragStart($event, deal)"
                  class="bg-white border border-gray-200 rounded-lg p-4 cursor-move hover:shadow-md transition-shadow"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                      <h4 class="text-sm font-medium text-gray-900 truncate">{{ deal.title }}</h4>
                      <p class="text-xs text-gray-500 mt-1">{{ deal.company?.name || 'No Company' }}</p>
                      <div class="flex items-center mt-2 space-x-2">
                        <span class="text-sm font-medium text-gray-900">{{ formatCurrency(deal.value, deal.currency) }}</span>
                        <span class="text-xs text-gray-500">{{ deal.probability }}%</span>
                      </div>
                      <div class="flex items-center mt-2 text-xs text-gray-500">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatDate(deal.expected_close_date) }}
                      </div>
                    </div>
                    <div class="flex items-center space-x-1 ml-2">
                      <BaseButton
                        variant="ghost"
                        size="sm"
                        @click="viewDeal(deal)"
                        class="text-gray-400 hover:text-gray-600"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </BaseButton>
                      <BaseButton
                        variant="ghost"
                        size="sm"
                        @click="editDeal(deal)"
                        class="text-gray-400 hover:text-gray-600"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </BaseButton>
                    </div>
                  </div>
                </div>

                <!-- Empty State for Stage -->
                <div
                  v-if="getDealsForStage(stage.id).length === 0"
                  class="text-center py-8 text-gray-400"
                >
                  <svg class="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <p class="text-xs">No deals in this stage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Deal Modal -->
    <DealModal
      v-if="showModal"
      :deal="selectedDeal"
      @close="closeModal"
      @saved="onDealSaved"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { dealsAPI, pipelinesAPI, stagesAPI } from '@/services/api'
import { success, error } from '@/utils/notifications'
import BaseButton from '@/components/ui/BaseButton.vue'
import DealModal from '@/components/modals/DealModal.vue'

// Props
const props = defineProps({
  pipelineId: {
    type: [String, Number],
    default: null
  }
})

// Emits
const emit = defineEmits(['deal-moved', 'deal-created', 'deal-updated'])

// Reactive data
const loading = ref(false)
const deals = ref([])
const pipelines = ref([])
const stages = ref([])
const selectedPipeline = ref(props.pipelineId || '')
const showModal = ref(false)
const selectedDeal = ref(null)
const draggedDeal = ref(null)

// Load pipelines
const loadPipelines = async () => {
  try {
    const response = await pipelinesAPI.getActivePipelines()
    pipelines.value = response.data.data || []
    
    // Auto-select first pipeline if none selected
    if (!selectedPipeline.value && pipelines.value.length > 0) {
      selectedPipeline.value = pipelines.value[0].id
      await loadStagesAndDeals()
    }
  } catch (err) {
    console.error('Load pipelines error:', err)
  }
}

// Load stages for selected pipeline
const loadStages = async () => {
  if (!selectedPipeline.value) return
  
  try {
    const response = await stagesAPI.getStagesByPipeline(selectedPipeline.value)
    stages.value = response.data.data || []
  } catch (err) {
    console.error('Load stages error:', err)
  }
}

// Load deals for selected pipeline
const loadDeals = async () => {
  if (!selectedPipeline.value) return
  
  loading.value = true
  try {
    const response = await dealsAPI.getDealsByPipeline(selectedPipeline.value)
    deals.value = response.data.data || []
  } catch (err) {
    error('Failed to load deals')
    console.error('Load deals error:', err)
  } finally {
    loading.value = false
  }
}

// Load stages and deals together
const loadStagesAndDeals = async () => {
  await Promise.all([loadStages(), loadDeals()])
}

// Pipeline change handler
const onPipelineChange = () => {
  loadStagesAndDeals()
}

// Get deals for a specific stage
const getDealsForStage = (stageId) => {
  return deals.value.filter(deal => deal.stage_id === stageId)
}

// Drag and drop handlers
const onDragStart = (event, deal) => {
  draggedDeal.value = deal
  event.dataTransfer.effectAllowed = 'move'
}

const onDrop = async (event, stageId) => {
  event.preventDefault()
  
  if (!draggedDeal.value || draggedDeal.value.stage_id === stageId) {
    draggedDeal.value = null
    return
  }

  try {
    await dealsAPI.moveDeal(draggedDeal.value.id, stageId)
    
    // Update local state
    const dealIndex = deals.value.findIndex(d => d.id === draggedDeal.value.id)
    if (dealIndex !== -1) {
      deals.value[dealIndex].stage_id = stageId
    }
    
    success('Deal moved successfully')
    emit('deal-moved', { deal: draggedDeal.value, newStageId: stageId })
  } catch (err) {
    error('Failed to move deal')
    console.error('Move deal error:', err)
  } finally {
    draggedDeal.value = null
  }
}

// Modal handlers
const openCreateModal = () => {
  selectedDeal.value = null
  showModal.value = true
}

const editDeal = (deal) => {
  selectedDeal.value = deal
  showModal.value = true
}

const viewDeal = (deal) => {
  // For now, just edit the deal
  editDeal(deal)
}

const closeModal = () => {
  showModal.value = false
  selectedDeal.value = null
}

const onDealSaved = (deal) => {
  closeModal()
  loadDeals()
  
  if (deal.id) {
    emit('deal-updated', deal)
  } else {
    emit('deal-created', deal)
  }
}

// Refresh
const refreshDeals = () => {
  loadStagesAndDeals()
}

// Utility functions
const formatCurrency = (value, currency = 'USD') => {
  if (!value) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const formatDate = (date) => {
  if (!date) return 'No date'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Initialize
onMounted(() => {
  loadPipelines()
})
</script>
