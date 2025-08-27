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
                <h1 class="text-2xl font-bold text-gray-900">
                  {{ deal?.title || 'Loading...' }}
                </h1>
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
              variant="secondary"
              @click="editDeal"
            >
              Edit Deal
            </BaseButton>
            <BaseButton
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDealsStore } from '../../stores/deals'
import { success, error as showError } from '../../utils/notifications'
import { formatDate, formatCurrency, formatRelativeTime, getInitials, getValueColor, getProbabilityColor, isOverdue } from '../../utils/formatters'
import { STATUS_BADGE_COLORS } from '../../utils/constants'
import type { Deal } from '../../types'
import BaseButton from '../../components/ui/BaseButton.vue'
import ConfirmationModal from '../../components/modals/ConfirmationModal.vue'

const route = useRoute()
const router = useRouter()
const dealsStore = useDealsStore()

// Reactive data
const loading = ref(false)
const error = ref<string | null>(null)
const deal = ref<Deal | null>(null)
const showDeleteModal = ref(false)

// Methods
const loadDeal = async () => {
  if (!route.params.id) return
  
  loading.value = true
  error.value = null
  
  try {
    const dealData = await dealsStore.fetchDeal(parseInt(route.params.id as string))
    if (dealData) {
      deal.value = dealData
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
  // TODO: Implement move deal functionality
  success('Move deal functionality coming soon')
}

const addActivity = () => {
  // TODO: Implement add activity functionality
  success('Add activity functionality coming soon')
}

const addTask = () => {
  // TODO: Implement add task functionality
  success('Add task functionality coming soon')
}

// Lifecycle
onMounted(() => {
  loadDeal()
})
</script>
