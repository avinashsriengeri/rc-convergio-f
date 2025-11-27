<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Deals</h1>
            <p class="text-sm text-gray-600 mt-1">Manage your sales pipeline and track deal progress</p>
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
              @click="$router.push('/deals/kanban')"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Kanban
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
        <form @submit.prevent="applyFilters" class="space-y-4">
          <!-- Search and Quick Filters -->
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <BaseInput
                v-model="filters.search"
                placeholder="Search deals by title or description..."
                @input="debouncedSearch"
                class="w-full"
              >
                <template #prefix>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </template>
              </BaseInput>
            </div>
            
            <div class="flex flex-wrap gap-2">
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="setStatusFilter('all')"
                :class="{ 'bg-blue-50 border-blue-200 text-blue-700': filters.status === 'all' }"
              >
                All
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="setStatusFilter('open')"
                :class="{ 'bg-gray-50 border-gray-200 text-gray-700': filters.status === 'open' }"
              >
                Open
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="setStatusFilter('won')"
                :class="{ 'bg-green-50 border-green-200 text-green-700': filters.status === 'won' }"
              >
                Won
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="setStatusFilter('lost')"
                :class="{ 'bg-red-50 border-red-200 text-red-700': filters.status === 'lost' }"
              >
                Lost
              </BaseButton>
            </div>
          </div>

          <!-- Advanced Filters -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Pipeline Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pipeline</label>
              <select
                v-model="filters.pipeline_id"
                @change="onPipelineChange"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option :value="undefined">All Pipelines</option>
                <option
                  v-for="pipeline in pipelinesStore.pipelines"
                  :key="pipeline.id"
                  :value="pipeline.id"
                >
                  {{ pipeline.name }}
                </option>
              </select>
            </div>

            <!-- Stage Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stage</label>
              <select
                v-model="filters.stage_id"
                @change="applyFilters"
                :disabled="!filters.pipeline_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option :value="undefined">
                  {{ filters.pipeline_id ? 'All Stages' : 'Select pipeline first' }}
                </option>
                <option
                  v-for="stage in stagesForPipeline"
                  :key="stage.id"
                  :value="stage.id"
                >
                  {{ stage.name }}
                </option>
              </select>
            </div>

            <!-- Owner Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Owner</label>
              <select
                v-model="filters.owner_id"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option :value="undefined">All Owners</option>
                <option
                  v-for="user in refsStore.users"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }}
                </option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sort</label>
              <select
                v-model="filters.sort"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option
                  v-for="option in DEAL_SORT_OPTIONS"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Value Range and Date Filters -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
              <BaseInput
                v-model="filters.value_min"
                type="number"
                placeholder="0"
                min="0"
                @input="debouncedFilter"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
              <BaseInput
                v-model="filters.value_max"
                type="number"
                placeholder="1000000"
                min="0"
                @input="debouncedFilter"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <BaseInput
                v-model="filters.date_from"
                type="date"
                @change="applyFilters"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <BaseInput
                v-model="filters.date_to"
                type="date"
                @change="applyFilters"
                class="w-full"
              />
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <BaseButton
                type="submit"
                variant="primary"
                size="sm"
                :loading="dealsStore.loading"
              >
                Apply Filters
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="clearFilters"
              >
                Clear
              </BaseButton>
            </div>
            <div class="flex items-center space-x-2">
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="exportDeals"
                :loading="exporting"
              >
                Export
              </BaseButton>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="dealsStore.loading" class="flex justify-center items-center py-12">
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
      <div v-else-if="!dealsStore.loading && dealsStore.deals.length === 0" class="text-center py-12">
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

      <!-- Deals Table -->
      <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deal
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pipeline & Stage
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Probability
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected Close
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="deal in dealsStore.deals" :key="deal.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ deal.title }}</div>
                      <div class="text-sm text-gray-500">{{ deal.description || 'No description' }}</div>
                      <div class="text-xs text-gray-400">
                        Created {{ formatDate(deal.created_at) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ deal.pipeline?.name || 'Unknown Pipeline' }}</div>
                  <div class="flex items-center mt-1">
                    <div
                      class="w-3 h-3 rounded-full mr-2"
                      :style="{ backgroundColor: deal.stage?.color || '#6B7280' }"
                    ></div>
                    <span class="text-sm text-gray-500">{{ deal.stage?.name || 'Unknown Stage' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">
                          {{ getInitials(deal.owner?.name || 'Unknown') }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ deal.owner?.name || 'Unassigned' }}</div>
                      <div class="text-sm text-gray-500">{{ deal.owner?.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium" :class="getValueColor(deal.value)">
                    {{ formatCurrency(deal.value, deal.currency) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-12 bg-gray-200 rounded-full h-1.5 mr-2">
                      <div
                        class="h-1.5 rounded-full"
                        :class="getProbabilityColor(deal.probability)"
                        :style="{ width: deal.probability + '%' }"
                      ></div>
                    </div>
                    <span class="text-sm" :class="getProbabilityColor(deal.probability)">
                      {{ formatPercentage(deal.probability) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="STATUS_BADGE_COLORS[deal.status]"
                  >
                    {{ deal.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex items-center">
                    <span :class="isOverdue(deal.expected_close_date) ? 'text-red-600 font-medium' : ''">
                      {{ formatDate(deal.expected_close_date) }}
                    </span>
                    <span v-if="isOverdue(deal.expected_close_date)" class="ml-2 text-xs text-red-600">
                      Overdue
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatRelativeTime(deal.updated_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewDeal(deal)"
                      class="text-blue-600 hover:text-blue-900"
                      title="View details"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      @click="editDeal(deal)"
                      class="text-indigo-600 hover:text-indigo-900"
                      title="Edit deal"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteDeal(deal)"
                      class="text-red-600 hover:text-red-900"
                      title="Delete deal"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="dealsStore.meta.last_page > 1" class="mt-8 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ dealsStore.meta.from }} to {{ dealsStore.meta.to }} of {{ dealsStore.meta.total }} results
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-700">Per page:</label>
            <select
              v-model="filters.per_page"
              @change="onPerPageChange"
              class="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option
                v-for="option in PER_PAGE_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <BaseButton
              variant="secondary"
              :disabled="dealsStore.meta.current_page === 1"
              @click="changePage(dealsStore.meta.current_page - 1)"
              class="px-3 py-2"
            >
              Previous
            </BaseButton>
            <span class="text-sm text-gray-700">
              Page {{ dealsStore.meta.current_page }} of {{ dealsStore.meta.last_page }}
            </span>
            <BaseButton
              variant="secondary"
              :disabled="dealsStore.meta.current_page === dealsStore.meta.last_page"
              @click="changePage(dealsStore.meta.current_page + 1)"
              class="px-3 py-2"
            >
              Next
            </BaseButton>
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { debounce } from 'lodash-es'
import { useDealsStore } from '../../stores/deals'
import { usePipelinesStore } from '../../stores/pipelines'
import { useStagesStore } from '../../stores/stages'
import { useRefsStore } from '../../stores/refs'
import { success, error } from '../../utils/notifications'
import { formatDate, formatCurrency, formatPercentage, formatRelativeTime, getInitials, getValueColor, getProbabilityColor, isOverdue } from '../../utils/formatters'
import { DEAL_SORT_OPTIONS, PER_PAGE_OPTIONS, STATUS_BADGE_COLORS } from '../../utils/constants'
import type { Deal, DealFilters } from '../../types'
import BaseButton from '../../components/ui/BaseButton.vue'
import BaseInput from '../../components/ui/BaseInput.vue'
import ConfirmationModal from '../../components/modals/ConfirmationModal.vue'

const router = useRouter()
const route = useRoute()

// Stores
const dealsStore = useDealsStore()
const pipelinesStore = usePipelinesStore()
const stagesStore = useStagesStore()
const refsStore = useRefsStore()

// Reactive data
const showDeleteModal = ref(false)
const dealToDelete = ref<Deal | null>(null)
const exporting = ref(false)

// Filters
const filters = reactive<DealFilters>({
  search: '',
  status: 'all',
  pipeline_id: undefined,
  stage_id: undefined,
  owner_id: undefined,
  value_min: undefined,
  value_max: undefined,
  date_from: undefined,
  date_to: undefined,
  sort: '-created_at',
  page: 1,
  per_page: 15
})

// Computed
const stagesForPipeline = computed(() => {
  if (!filters.pipeline_id) return []
  return stagesStore.stages.filter(stage => stage.pipeline_id === filters.pipeline_id)
})

// Debounced search
const debouncedSearch = debounce(() => {
  filters.page = 1
  applyFilters()
}, 300)

// Debounced filter for value and date inputs
const debouncedFilter = debounce(() => {
  filters.page = 1
  applyFilters()
}, 500)

// Methods
const refreshDeals = () => {
  dealsStore.fetchDeals(filters)
}

const applyFilters = () => {
  dealsStore.fetchDeals(filters)
}

const clearFilters = () => {
  Object.assign(filters, {
    search: '',
    status: 'all',
    pipeline_id: undefined,
    stage_id: undefined,
    owner_id: undefined,
    value_min: undefined,
    value_max: undefined,
    date_from: undefined,
    date_to: undefined,
    sort: '-created_at',
    page: 1,
    per_page: 15
  })
  applyFilters()
}

const setStatusFilter = (status: string) => {
  filters.status = status as any
  filters.page = 1
  applyFilters()
}

const onPipelineChange = async () => {
  filters.stage_id = undefined
  
  // Fetch stages for the selected pipeline
  if (filters.pipeline_id) {
    try {
      await stagesStore.fetchStagesByPipeline(filters.pipeline_id)
    } catch (err) {
      console.error('Failed to load stages:', err)
    }
  } else {
    // Clear stages when no pipeline is selected
    stagesStore.reset()
  }
  
  applyFilters()
}

const onPerPageChange = () => {
  filters.page = 1
  applyFilters()
}

const changePage = (page: number) => {
  filters.page = page
  applyFilters()
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

const exportDeals = async () => {
  exporting.value = true
  try {
    await dealsStore.exportDeals(filters)
    success('Deals exported successfully')
  } catch (err) {
    error('Failed to export deals')
  } finally {
    exporting.value = false
  }
}

// Sync filters with URL query params
const syncFiltersWithURL = () => {
  const query = route.query
  
  if (query.search) filters.search = query.search as string
  if (query.status) filters.status = query.status as any
  if (query.pipeline_id) {
    const pipelineId = parseInt(query.pipeline_id as string)
    filters.pipeline_id = isNaN(pipelineId) ? undefined : pipelineId
  }
  if (query.stage_id) {
    const stageId = parseInt(query.stage_id as string)
    filters.stage_id = isNaN(stageId) ? undefined : stageId
  }
  if (query.owner_id) {
    const ownerId = parseInt(query.owner_id as string)
    filters.owner_id = isNaN(ownerId) ? undefined : ownerId
  }
  if (query.value_min) {
    const valueMin = parseFloat(query.value_min as string)
    filters.value_min = isNaN(valueMin) ? undefined : valueMin
  }
  if (query.value_max) {
    const valueMax = parseFloat(query.value_max as string)
    filters.value_max = isNaN(valueMax) ? undefined : valueMax
  }
  if (query.date_from) filters.date_from = query.date_from as string
  if (query.date_to) filters.date_to = query.date_to as string
  if (query.sort) filters.sort = query.sort as string
  if (query.page) {
    const page = parseInt(query.page as string)
    filters.page = isNaN(page) ? 1 : page
  }
  if (query.per_page) {
    const perPage = parseInt(query.per_page as string)
    filters.per_page = isNaN(perPage) ? 15 : perPage
  }
}

const updateURL = () => {
  const query: Record<string, string> = {}
  
  if (filters.search) query.search = filters.search
  if (filters.status !== 'all') query.status = filters.status
  if (filters.pipeline_id) query.pipeline_id = filters.pipeline_id.toString()
  if (filters.stage_id) query.stage_id = filters.stage_id.toString()
  if (filters.owner_id) query.owner_id = filters.owner_id.toString()
  if (filters.value_min) query.value_min = filters.value_min.toString()
  if (filters.value_max) query.value_max = filters.value_max.toString()
  if (filters.date_from) query.date_from = filters.date_from
  if (filters.date_to) query.date_to = filters.date_to
  if (filters.sort !== '-created_at') query.sort = filters.sort
  if (filters.page > 1) query.page = filters.page.toString()
  if (filters.per_page !== 15) query.per_page = filters.per_page.toString()
  
  router.replace({ query })
}

// Watch for filter changes and update URL
watch(filters, updateURL, { deep: true })

// Lifecycle
onMounted(async () => {
  console.log('DealsListPage onMounted - starting')
  
  // Sync filters with URL
  syncFiltersWithURL()
  
  try {
    // Initialize data
    console.log('Fetching deals with filters:', filters)
    await Promise.all([
      dealsStore.fetchDeals(filters),
      pipelinesStore.fetchPipelines(),
      refsStore.initializeData(),
      // Load all stages so they're available for filtering
      stagesStore.fetchStages()
    ])
    
    console.log('After fetching deals - dealsStore.deals:', dealsStore.deals)
    console.log('After fetching deals - dealsStore.deals.length:', dealsStore.deals.length)
    
    // Load stages if pipeline is selected from URL
    if (filters.pipeline_id) {
      await stagesStore.fetchStagesByPipeline(filters.pipeline_id)
    }
  } catch (error) {
    console.error('Failed to load initial data:', error)
    // If API fails, we'll show empty state which is already handled
  }
  
  console.log('DealsListPage onMounted - completed')
})
</script>
