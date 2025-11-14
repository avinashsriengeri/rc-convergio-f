<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <div class="flex items-center space-x-3">
              <button
                @click="$router.back()"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <div class="flex items-center space-x-3">
                  <h1 class="text-2xl font-bold text-gray-900">
                    {{ deal?.title || 'Loading...' }}
                  </h1>
                  <span v-if="deal?.team" class="team-badge">
                    {{ deal.team.name }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mt-1">
                  Deal Details
                </p>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="outline"
              @click="$router.push('/deals')"
            >
              Back to Deals
            </BaseButton>
            <BaseButton
              v-if="canEdit(deal)"
              variant="secondary"
              @click="editDeal"
            >
              Edit Deal
            </BaseButton>
            <BaseButton
              v-if="canDelete(deal)"
              variant="danger"
              @click="deleteDeal"
            >
              Delete Deal
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading deal</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="loadDeal">
            Try Again
          </BaseButton>
        </div>
      </div>

      <!-- Deal Details -->
      <div v-else-if="deal" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Deal Overview -->
          <div class="bg-white shadow-sm rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Deal Overview</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Title</h3>
                <p class="text-sm text-gray-900">{{ deal.title }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Status</h3>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="STATUS_BADGE_COLORS[deal.status]"
                >
                  {{ deal.status }}
                </span>
              </div>
              <div v-if="deal.description">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p class="text-sm text-gray-900">{{ deal.description }}</p>
              </div>
              <div v-if="deal.value">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Value</h3>
                <p class="text-lg font-semibold" :class="getValueColor(deal.value)">
                  {{ formatCurrency(deal.value, deal.currency) }}
                </p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Probability</h3>
                <div class="flex items-center">
                  <div class="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      class="h-2 rounded-full"
                      :class="getProbabilityColor(deal.probability)"
                      :style="{ width: deal.probability + '%' }"
                    ></div>
                  </div>
                  <span class="text-sm" :class="getProbabilityColor(deal.probability)">
                    {{ deal.probability }}%
                  </span>
                </div>
              </div>
              <div v-if="deal.expected_close_date">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Expected Close Date</h3>
                <p class="text-sm text-gray-900" :class="isOverdue(deal.expected_close_date) ? 'text-red-600 font-medium' : ''">
                  {{ formatDate(deal.expected_close_date) }}
                  <span v-if="isOverdue(deal.expected_close_date)" class="ml-2 text-xs text-red-600">
                    (Overdue)
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Pipeline & Stage -->
          <div class="bg-white shadow-sm rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Pipeline & Stage</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Pipeline</h3>
                <p class="text-sm text-gray-900">{{ deal.pipeline?.name || 'Unknown Pipeline' }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Stage</h3>
                <div class="flex items-center">
                  <div
                    class="w-4 h-4 rounded-full mr-2"
                    :style="{ backgroundColor: deal.stage?.color || '#6B7280' }"
                  ></div>
                  <span class="text-sm text-gray-900">{{ deal.stage?.name || 'Unknown Stage' }}</span>
                </div>
              </div>
            </div>
            
            <!-- View Stage History Button - Professional placement below stage info -->
            <div v-if="deal?.id" class="mt-6 pt-6 border-t border-gray-200">
              <BaseButton
                variant="outline"
                size="sm"
                @click="openStageHistoryModal"
                class="w-full"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ stageHistory.length > 0 ? 'View Full Stage History' : 'View Stage History' }}
              </BaseButton>
            </div>
          </div>

          <!-- Recent Stage Movement -->
          <div v-if="latestMovement" class="bg-white shadow-sm rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Stage Movement</h2>
            <div class="space-y-3">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div class="ml-3 flex-1">
                  <p class="text-sm text-gray-900">
                    Moved from 
                    <span 
                      class="font-medium"
                      :style="{ color: latestMovement.from_stage?.color || '#6B7280' }"
                    >
                      "{{ latestMovement.from_stage?.name }}"
                    </span>
                    to 
                    <span 
                      class="font-medium"
                      :style="{ color: latestMovement.to_stage?.color || '#6B7280' }"
                    >
                      "{{ latestMovement.to_stage?.name }}"
                    </span>
                  </p>
                  <p class="text-sm text-gray-600 mt-1">
                    <strong>Reason:</strong> {{ latestMovement.reason }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    By {{ latestMovement.moved_by?.name || 'Unknown' }} • {{ formatRelativeTime(latestMovement.moved_at) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- People & Company -->
          <div class="bg-white shadow-sm rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">People & Company</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Owner</h3>
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    <span class="text-sm font-medium text-gray-700">
                      {{ getInitials(deal.owner?.name || 'Unknown') }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ deal.owner?.name || 'Unassigned' }}</p>
                    <p class="text-xs text-gray-500">{{ deal.owner?.email }}</p>
                  </div>
                </div>
              </div>
              <div v-if="deal.team">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Team</h3>
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ deal.team.name || '—' }}</p>
                    <p class="text-xs text-gray-500">Team</p>
                  </div>
                </div>
              </div>
              <div v-if="deal.contact">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Contact</h3>
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ deal.contact.name }}</p>
                    <p class="text-xs text-gray-500">{{ deal.contact.email }}</p>
                  </div>
                </div>
              </div>
              <div v-if="deal.company">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Company</h3>
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ deal.company.name }}</p>
                    <p v-if="deal.company.industry" class="text-xs text-gray-500">{{ deal.company.industry }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="deal.tags && deal.tags.length > 0" class="bg-white shadow-sm rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Tags</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in deal.tags"
                :key="tag"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Documents -->
          <div class="bg-white shadow-sm rounded-lg p-6">
            <DocumentsTab 
              relatedType="deal" 
              :relatedId="deal.id"
              :initialDocuments="dealDocuments"
              @document-linked="handleDocumentLinked"
              @document-updated="handleDocumentUpdated"
            />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white shadow-sm rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div class="space-y-3">
              <BaseButton
                variant="primary"
                fullWidth
                @click="editDeal"
              >
                Edit Deal
              </BaseButton>
              <BaseButton
                variant="outline"
                fullWidth
                @click="moveDeal"
              >
                Move to Stage
              </BaseButton>
              <BaseButton
                variant="outline"
                fullWidth
                @click="addActivity"
              >
                Add Activity
              </BaseButton>
              <BaseButton
                variant="outline"
                fullWidth
                @click="addTask"
              >
                Add Task
              </BaseButton>
            </div>
          </div>

          <!-- Deal Timeline -->
          <div class="bg-white shadow-sm rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
            <div class="space-y-4">
              <!-- Recent Stage Movements (show only last 3-5) -->
              <div v-if="stageHistory.length > 0">
                <div 
                  v-for="movement in stageHistory" 
                  :key="movement.id"
                  class="flex items-start"
                >
                  <div class="flex-shrink-0">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  </div>
                  <div class="ml-3 flex-1">
                    <p class="text-sm text-gray-900">
                      <span class="font-medium">Stage Movement:</span>
                      <span 
                        class="font-medium"
                        :style="{ color: movement.from_stage?.color || '#6B7280' }"
                      >
                        {{ movement.from_stage?.name }}
                      </span>
                      <span class="text-gray-400 mx-1">→</span>
                      <span 
                        class="font-medium"
                        :style="{ color: movement.to_stage?.color || '#6B7280' }"
                      >
                        {{ movement.to_stage?.name }}
                      </span>
                    </p>
                    <p class="text-sm text-gray-600 mt-1">
                      <strong>Reason:</strong> {{ movement.reason }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      By {{ movement.moved_by?.name || 'Unknown' }} • {{ formatRelativeTime(movement.moved_at) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Deal Events -->
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-gray-900">Deal created</p>
                  <p class="text-xs text-gray-500">{{ formatRelativeTime(deal.created_at) }}</p>
                </div>
              </div>
              <div v-if="deal.updated_at !== deal.created_at" class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-gray-900">Last updated</p>
                  <p class="text-xs text-gray-500">{{ formatRelativeTime(deal.updated_at) }}</p>
                </div>
              </div>
              <div v-if="deal.closed_at" class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-gray-900">Deal closed</p>
                  <p class="text-xs text-gray-500">{{ formatRelativeTime(deal.closed_at) }}</p>
                </div>
              </div>
              <div v-if="deal.won_at" class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-gray-900">Deal won</p>
                  <p class="text-xs text-gray-500">{{ formatRelativeTime(deal.won_at) }}</p>
                </div>
              </div>
              <div v-if="deal.lost_at" class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-gray-900">Deal lost</p>
                  <p class="text-xs text-gray-500">{{ formatRelativeTime(deal.lost_at) }}</p>
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
      :message="`Are you sure you want to delete the deal '${deal?.title}'? This action cannot be undone.`"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />

    <!-- Move Stage Modal -->
    <MoveStageModal
      v-if="showMoveStageModal"
      :deal-id="deal?.id || 0"
      :current-stage-id="deal?.stage_id || 0"
      :pipeline-id="deal?.pipeline_id || 0"
      @confirm="onStageMoved"
      @cancel="showMoveStageModal = false"
    />

    <!-- Add Activity Modal -->
    <AddActivityModal
      v-if="showAddActivityModal"
      :deal-id="deal?.id || 0"
      @confirm="onActivityAdded"
      @cancel="showAddActivityModal = false"
    />

    <!-- Add Task Modal -->
    <AddTaskModal
      v-if="showAddTaskModal"
      :deal-id="deal?.id || 0"
      @confirm="onTaskAdded"
      @cancel="showAddTaskModal = false"
    />

    <!-- Stage History Modal -->
    <StageHistoryModal
      v-if="showStageHistoryModal && deal?.id"
      :deal-id="deal.id"
      @close="showStageHistoryModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDealsStore } from '../../stores/deals'
import { useContext } from '../../composables/useContext'
import { usePermission } from '../../composables/usePermission'
import { success, error as showError } from '../../utils/notifications'
import { formatDate, formatCurrency, formatRelativeTime, getInitials, getValueColor, getProbabilityColor, isOverdue } from '../../utils/formatters'
import { STATUS_BADGE_COLORS } from '../../utils/constants'
import type { Deal } from '../../types'
import BaseButton from '../../components/ui/BaseButton.vue'
import ConfirmationModal from '../../components/modals/ConfirmationModal.vue'
import MoveStageModal from '../../components/modals/MoveStageModal.vue'
import StageHistoryModal from '../../components/modals/StageHistoryModal.vue'
import AddActivityModal from '../../components/activities/AddActivityModal.vue'
import AddTaskModal from '../../components/tasks/AddTaskModal.vue'
import DocumentsTab from '../../components/documents/DocumentsTab.vue'

const route = useRoute()
const router = useRouter()
const dealsStore = useDealsStore()
// Context and permissions
const { tenantId, teamId, isAdmin } = useContext()
const { canEdit, canDelete, canView } = usePermission()

// Reactive data
const loading = ref(false)
const error = ref<string | null>(null)
const deal = ref<Deal | null>(null)
const dealDocuments = ref([])
const showDeleteModal = ref(false)
const showMoveStageModal = ref(false)
const showAddActivityModal = ref(false)
const showAddTaskModal = ref(false)
const stageHistory = ref<any[]>([])
const loadingHistory = ref(false)
const latestMovement = ref<any>(null)
const showStageHistoryModal = ref(false)
const totalMovementsCount = ref(0)

// Methods
const loadDeal = async () => {
  if (!route.params.id) return
  
  loading.value = true
  error.value = null
  
  try {
    const dealData = await dealsStore.fetchDeal(parseInt(route.params.id as string))
    if (dealData) {
      deal.value = dealData
      
      // Extract documents from the deal data if available
      if (dealData.documents) {
        dealDocuments.value = dealData.documents
        console.log(`DealDetail: Loaded ${dealDocuments.value.length} documents for deal ${deal.value.id}`)
        console.log('DealDetail: Documents data:', dealDocuments.value)
      }
    } else {
      error.value = 'Deal not found. The deal may have been deleted or you may not have permission to view it.'
    }
  } catch (err: any) {
    console.error('Error loading deal:', err)
    error.value = err.response?.data?.message || 'Failed to load deal'
  } finally {
    loading.value = false
  }
}

const loadStageHistory = async () => {
  if (!deal.value?.id) return
  
  loadingHistory.value = true
  try {
    // Load only recent 5 movements for timeline (lightweight)
    const history = await dealsStore.fetchDealStageHistory(deal.value.id, { per_page: 5 })
    console.log('Stage history loaded:', history)
    stageHistory.value = history || []
    latestMovement.value = stageHistory.value.length > 0 ? stageHistory.value[0] : null
    console.log('Latest movement:', latestMovement.value)
    console.log('Stage history count:', stageHistory.value.length)
    
    // Get total count for button display (if available from API)
    // This is optional - if API doesn't return total, we'll show button anyway
    totalMovementsCount.value = history.length >= 5 ? 6 : history.length // Estimate if > 5
  } catch (err: any) {
    console.error('Error loading stage history:', err)
    stageHistory.value = []
    latestMovement.value = null
    totalMovementsCount.value = 0
  } finally {
    loadingHistory.value = false
  }
}

const openStageHistoryModal = () => {
  showStageHistoryModal.value = true
}

const editDeal = () => {
  if (deal.value) {
    router.push(`/deals/${deal.value.id}/edit`)
  }
}

const deleteDeal = () => {
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!deal.value) return
  
  try {
    await dealsStore.deleteDeal(deal.value.id)
    showDeleteModal.value = false
    success('Deal deleted successfully')
    router.push('/deals')
  } catch (err) {
    showError('Failed to delete deal')
  }
}

const moveDeal = () => {
  showMoveStageModal.value = true
}

const addActivity = () => {
  showAddActivityModal.value = true
}

const addTask = () => {
  showAddTaskModal.value = true
}

const onStageMoved = async (stageId: number, reason: string) => {
  showMoveStageModal.value = false
  // Reload the deal to get updated stage information
  await loadDeal()
  // Reload stage history to show the new movement
  await loadStageHistory()
}

const onActivityAdded = () => {
  showAddActivityModal.value = false
  // Optionally reload the deal or show a success message
  success('Activity added successfully')
}

const onTaskAdded = () => {
  showAddTaskModal.value = false
  // Optionally reload the deal or show a success message
  success('Task added successfully')
}

const handleDocumentLinked = (document: any) => {
  console.log('DealDetail: Document linked, adding to dealDocuments:', document)
  // Add the linked document to the dealDocuments array
  const existingIndex = dealDocuments.value.findIndex((doc: any) => doc.id === document.id)
  if (existingIndex === -1) {
    dealDocuments.value.push(document)
    console.log('DealDetail: Added document to dealDocuments array')
  } else {
    dealDocuments.value[existingIndex] = document
    console.log('DealDetail: Updated existing document in dealDocuments array')
  }
}

const handleDocumentUpdated = (updatedDocument: any) => {
  console.log('DealDetail: Document updated, refreshing dealDocuments:', updatedDocument)
  // Update the document in the dealDocuments array
  const index = dealDocuments.value.findIndex((doc: any) => doc.id === updatedDocument.id)
  if (index !== -1) {
    dealDocuments.value[index] = updatedDocument
    console.log('DealDetail: Updated document in dealDocuments array')
  }
}

// Lifecycle
onMounted(async () => {
  await loadDeal()
  if (deal.value?.id) {
    await loadStageHistory()
  }
})
</script>
