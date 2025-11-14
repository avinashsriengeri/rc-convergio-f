<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white my-8">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Stage Movement History</h3>
            <p class="text-sm text-gray-500 mt-1">Complete history of all stage movements for this deal</p>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading history</h3>
          <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
          <div class="mt-6">
            <BaseButton variant="primary" @click="loadHistory">
              Try Again
            </BaseButton>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading && movements.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No stage movements</h3>
          <p class="mt-1 text-sm text-gray-500">This deal has not been moved between stages yet.</p>
        </div>

        <!-- Movements List -->
        <div v-else class="space-y-4 max-h-[60vh] overflow-y-auto">
          <div
            v-for="movement in movements"
            :key="movement.id"
            class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-2">
                  <span
                    class="text-sm font-medium px-2 py-1 rounded"
                    :style="{
                      backgroundColor: movement.from_stage?.color ? `${movement.from_stage.color}20` : '#F3F4F6',
                      color: movement.from_stage?.color || '#6B7280'
                    }"
                  >
                    {{ movement.from_stage?.name || 'Unknown' }}
                  </span>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span
                    class="text-sm font-medium px-2 py-1 rounded"
                    :style="{
                      backgroundColor: movement.to_stage?.color ? `${movement.to_stage.color}20` : '#F3F4F6',
                      color: movement.to_stage?.color || '#6B7280'
                    }"
                  >
                    {{ movement.to_stage?.name || 'Unknown' }}
                  </span>
                </div>
                <p class="text-sm text-gray-900 mt-2">
                  <span class="font-medium">Reason:</span> {{ movement.reason }}
                </p>
                <div class="flex items-center mt-3 text-xs text-gray-500">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{{ movement.moved_by?.name || 'Unknown' }}</span>
                  <span class="mx-2">•</span>
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ formatRelativeTime(movement.moved_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && !error && movements.length > 0 && pagination.last_page > 1" class="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} movements
          </div>
          <div class="flex items-center space-x-2">
            <BaseButton
              variant="outline"
              size="sm"
              :disabled="pagination.current_page === 1 || loading"
              @click="loadPage(pagination.current_page - 1)"
            >
              Previous
            </BaseButton>
            <span class="text-sm text-gray-700 px-3">
              Page {{ pagination.current_page }} of {{ pagination.last_page }}
            </span>
            <BaseButton
              variant="outline"
              size="sm"
              :disabled="pagination.current_page === pagination.last_page || loading"
              @click="loadPage(pagination.current_page + 1)"
            >
              Next
            </BaseButton>
          </div>
        </div>

        <!-- Footer Actions -->
        <div v-if="!loading && !error" class="mt-6 pt-6 border-t border-gray-200 flex items-center justify-end">
          <BaseButton
            variant="primary"
            @click="$emit('close')"
          >
            Close
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { dealsAPI } from '../../services/api'
import { formatRelativeTime } from '../../utils/formatters'
import BaseButton from '../ui/BaseButton.vue'

interface Props {
  dealId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

// Reactive data
const loading = ref(false)
const error = ref<string | null>(null)
const movements = ref<any[]>([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0,
  from: 0,
  to: 0
})

// Methods
const loadHistory = async (page = 1) => {
  loading.value = true
  error.value = null

  try {
    const response = await dealsAPI.getDealStageHistory(props.dealId, {
      per_page: 20,
      page: page
    })
    
    movements.value = response.data.data || []
    
    // Handle pagination - support both nested and flat response structures
    const paginationData = response.data.pagination || response.data.meta || {}
    pagination.value = {
      current_page: paginationData.current_page || paginationData.page || page,
      last_page: paginationData.last_page || paginationData.total_pages || 1,
      per_page: paginationData.per_page || paginationData.perPage || 20,
      total: paginationData.total || movements.value.length,
      from: paginationData.from || ((page - 1) * 20 + 1),
      to: paginationData.to || (page * 20)
    }
  } catch (err: any) {
    console.error('Error loading stage history:', err)
    error.value = err.response?.data?.message || 'Failed to load stage history'
    movements.value = []
  } finally {
    loading.value = false
  }
}

const loadPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    loadHistory(page)
    // Scroll to top of modal content
    const modalContent = document.querySelector('.max-h-\\[60vh\\]')
    if (modalContent) {
      modalContent.scrollTop = 0
    }
  }
}

// Lifecycle
onMounted(() => {
  loadHistory()
})
</script>

<script lang="ts">
export default {
  name: 'StageHistoryModal'
}
</script>

