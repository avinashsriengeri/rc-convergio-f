<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ $t('deals.title') }}</h1>
            <p class="text-sm text-gray-600 mt-1">{{ $t('deals.subtitle') }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <!-- View Toggle -->
            <div class="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                @click="viewMode = 'list'"
                class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
                :class="viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                {{ $t('deals.list') }}
              </button>
              <button
                @click="viewMode = 'kanban'"
                class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
                :class="viewMode === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {{ $t('deals.kanban') }}
              </button>
            </div>
            <BaseButton
              variant="secondary"
              @click="refreshDeals"
              :loading="loading"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ $t('deals.refresh') }}
            </BaseButton>
            <BaseButton
              variant="outline"
              @click="exportDeals"
              :loading="exporting"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ $t('deals.export_csv') }}
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="openCreateModal"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {{ $t('deals.new_deal') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <BaseInput
              v-model="filters.search"
              :placeholder="$t('deals.search_placeholder')"
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
          
          <!-- Status Filter -->
          <div class="sm:w-48">
            <select
              v-model="filters.status"
              @change="loadDeals"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{{ $t('deals.all_status') }}</option>
              <option v-for="status in dealStatuses" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>
          
          <!-- Pipeline Filter -->
          <div class="sm:w-48">
            <select
              v-model="filters.pipeline"
              @change="loadDeals"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{{ $t('deals.all_pipelines') }}</option>
              <option v-for="pipeline in pipelines" :key="pipeline.id" :value="pipeline.id">
                {{ pipeline.name }}
              </option>
            </select>
          </div>
          
          <!-- Owner Filter -->
          <div class="sm:w-48">
            <select
              v-model="filters.owner"
              @change="loadDeals"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{{ $t('deals.all_owners') }}</option>
              <option v-for="owner in owners" :key="owner.id" :value="owner.id">
                {{ owner.name }}
              </option>
            </select>
          </div>
          
          <!-- Sort -->
          <div class="sm:w-48">
            <select
              v-model="filters.sort"
              @change="loadDeals"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="title_asc">Title A-Z</option>
              <option value="title_desc">Title Z-A</option>
              <option value="value_desc">Value High-Low</option>
              <option value="value_asc">Value Low-High</option>
              <option value="expected_close_date_asc">Close Date (Earliest)</option>
              <option value="expected_close_date_desc">Close Date (Latest)</option>
              <option value="created_at_desc">Newest First</option>
              <option value="created_at_asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading && !deals.length" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && !deals.length" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No deals found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first deal.</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="openCreateModal">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Deal
          </BaseButton>
        </div>
      </div>

      <!-- List View -->
      <div v-else-if="viewMode === 'list'" class="bg-white shadow-sm rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deal
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Close Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Probability
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="deal in deals" :key="deal.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span class="text-sm font-medium text-white">{{ getInitials(deal.title) }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ deal.title }}</div>
                      <div class="text-sm text-gray-500">{{ deal.description || 'No description' }}</div>
                      <div class="text-xs text-gray-400">
                        {{ deal.company?.name || 'No company' }} • {{ deal.contact?.name || 'No contact' }}
                      </div>
                      <div v-if="deal.owner" class="text-xs text-gray-400 mt-1">
                        <strong>Owner:</strong> {{ deal.owner.name || '—' }}
                      </div>
                      <div v-if="deal.team" class="text-xs text-gray-400">
                        <strong>Team:</strong> {{ deal.team.name || '—' }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ formatCurrency(deal.value) }}</div>
                  <div class="text-sm text-gray-500">{{ deal.currency || 'USD' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStageColor(deal.stage)">
                    {{ deal.stage?.name || deal.stage }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ deal.owner?.name || 'Unassigned' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ deal.expected_close_date ? formatDate(deal.expected_close_date) : 'Not set' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div class="bg-blue-600 h-2 rounded-full" :style="{ width: deal.probability + '%' }"></div>
                    </div>
                    <span class="text-sm text-gray-900">{{ deal.probability }}%</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewDeal(deal)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      v-if="canEdit(deal)"
                      @click="editDeal(deal)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      v-if="canDelete(deal)"
                      @click="deleteDeal(deal)"
                      class="text-red-600 hover:text-red-900"
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

      <!-- Kanban View -->
      <div v-else-if="viewMode === 'kanban'" class="space-y-6">
        <!-- Pipeline Selector -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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

        <!-- Kanban Board -->
        <div v-if="selectedPipeline" class="flex space-x-6 overflow-x-auto pb-4">
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
                <div class="space-y-3">
                  <div
                    v-for="deal in getDealsForStage(stage.id)"
                    :key="deal.id"
                    class="bg-gray-50 rounded-lg p-3 cursor-move hover:bg-gray-100 transition-colors"
                    draggable="true"
                    @dragstart="onDragStart($event, deal)"
                    @dragover.prevent
                    @drop="onDrop($event, stage.id)"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-medium text-gray-900 truncate">{{ deal.title }}</h4>
                        <p class="text-xs text-gray-500 mt-1">{{ formatCurrency(deal.value) }}</p>
                        <div class="flex items-center mt-2">
                          <div class="w-12 bg-gray-200 rounded-full h-1.5 mr-2">
                            <div class="bg-blue-600 h-1.5 rounded-full" :style="{ width: deal.probability + '%' }"></div>
                          </div>
                          <span class="text-xs text-gray-500">{{ deal.probability }}%</span>
                        </div>
                        <div class="flex items-center mt-2 space-x-2">
                          <span class="text-xs text-gray-400">{{ deal.owner?.name || 'Unassigned' }}</span>
                          <span v-if="deal.expected_close_date" class="text-xs text-gray-400">
                            {{ formatDate(deal.expected_close_date) }}
                          </span>
                        </div>
                      </div>
                      <div class="flex items-center space-x-1 ml-2">
                        <button
                          v-if="canEdit(deal)"
                          @click="editDeal(deal)"
                          class="text-gray-400 hover:text-gray-600"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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

        <!-- Empty Kanban State -->
        <div v-else class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Select a Pipeline</h3>
          <p class="mt-1 text-sm text-gray-500">Choose a pipeline to view its deals in Kanban format.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="viewMode === 'list' && pagination.last_page > 1" class="mt-8 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
        </div>
        <div class="flex items-center space-x-2">
          <BaseButton
            variant="secondary"
            :disabled="pagination.current_page === 1"
            @click="changePage(pagination.current_page - 1)"
            class="px-3 py-2"
          >
            Previous
          </BaseButton>
          <span class="text-sm text-gray-700">
            Page {{ pagination.current_page }} of {{ pagination.last_page }}
          </span>
          <BaseButton
            variant="secondary"
            :disabled="pagination.current_page === pagination.last_page"
            @click="changePage(pagination.current_page + 1)"
            class="px-3 py-2"
          >
            Next
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <DealModal
      v-if="showModal"
      :deal="editingDeal"
      :pipelines="pipelines"
      :stages="stages"
      :contacts="contacts"
      :companies="companies"
      :owners="owners"
      :dealStatuses="dealStatuses"
      :currencies="currencies"
      @close="closeModal"
      @saved="onDealSaved"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      :title="$t('common.actions.delete_deal')"
      :message="$t('common.actions.confirm_delete', { name: dealToDelete?.title })"
      :confirm-text="$t('common.delete')"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContext } from '@/composables/useContext'
import { usePermission } from '@/composables/usePermission'
import { dealsAPI, pipelinesAPI, stagesAPI, metadataAPI, contactsAPI, companiesAPI } from '@/services/api'
import { success, error } from '@/utils/notifications'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import DealModal from '@/components/modals/DealModal.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'
import { debounce } from 'lodash-es'

const router = useRouter()
const { tenantId, teamId, isAdmin } = useContext()
const { canEdit, canDelete, canView } = usePermission()

// Reactive data
const loading = ref(false)
const exporting = ref(false)
const deals = ref([])
const pipelines = ref([])
const stages = ref([])
const contacts = ref([])
const companies = ref([])
const owners = ref([])
const dealStatuses = ref([])
const currencies = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingDeal = ref(null)
const dealToDelete = ref(null)
const viewMode = ref('list')
const selectedPipeline = ref('')

const filters = reactive({
  search: '',
  status: '',
  pipeline: '',
  owner: '',
  sort: 'title_asc',
  page: 1
})

const pagination = reactive({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0
})

// Debounced search
const debouncedSearch = debounce(() => {
  filters.page = 1
  loadDeals()
}, 300)

// Methods
const loadDeals = async () => {
  loading.value = true
  try {
    const params = {
      page: filters.page,
      per_page: pagination.per_page,
      search: filters.search,
      status: filters.status,
      pipeline_id: filters.pipeline,
      owner_id: filters.owner,
      sort: filters.sort
    }
    
    if (viewMode.value === 'kanban' && selectedPipeline.value) {
      params.pipeline_id = selectedPipeline.value
    }
    
    const response = await dealsAPI.getDeals(params)
    deals.value = response.data.data || []
    Object.assign(pagination, response.data.meta || {})
  } catch (err) {
    console.error('Error loading deals:', err)
    // Set empty data instead of showing error
    deals.value = []
    Object.assign(pagination, {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    })
  } finally {
    loading.value = false
  }
}

const loadMetadata = async () => {
  try {
    const [pipelinesRes, statusesRes, currenciesRes, ownersRes, contactsRes, companiesRes] = await Promise.all([
      pipelinesAPI.getActivePipelines().catch(() => ({ data: { data: [] } })),
      metadataAPI.getDealStatuses().catch(() => ({ data: { data: ['Open', 'Won', 'Lost', 'Closed'] } })),
      metadataAPI.getCurrencies().catch(() => ({ data: { data: ['USD', 'EUR', 'GBP'] } })),
      metadataAPI.getOwners().catch(() => ({ data: { data: [] } })),
      contactsAPI.getContacts({ per_page: 100 }).catch(() => ({ data: { data: [] } })),
      companiesAPI.getCompanies({ per_page: 100 }).catch(() => ({ data: { data: [] } }))
    ])
    
    pipelines.value = pipelinesRes.data.data || []
    dealStatuses.value = statusesRes.data.data || ['Open', 'Won', 'Lost', 'Closed']
    currencies.value = currenciesRes.data.data || ['USD', 'EUR', 'GBP']
    // Handle the API response structure
    if (ownersRes.data && ownersRes.data.data && Array.isArray(ownersRes.data.data)) {
      owners.value = ownersRes.data.data
    } else if (ownersRes.data && Array.isArray(ownersRes.data)) {
      owners.value = ownersRes.data
    } else {
      owners.value = []
    }
    contacts.value = contactsRes.data.data || []
    companies.value = companiesRes.data.data || []
  } catch (err) {
    console.error('Error loading metadata:', err)
    // Set fallback data instead of showing error
    pipelines.value = []
    dealStatuses.value = ['Open', 'Won', 'Lost', 'Closed']
    currencies.value = ['USD', 'EUR', 'GBP']
    owners.value = []
    contacts.value = []
    companies.value = []
  }
}

const loadStages = async (pipelineId) => {
  if (!pipelineId) return
  
  try {
    const response = await stagesAPI.getStagesByPipeline(pipelineId)
    stages.value = response.data.data
  } catch (err) {
    console.error('Error loading stages:', err)
    error('Failed to load stages')
  }
}

const exportDeals = async () => {
  exporting.value = true
  try {
    const params = {
      search: filters.search,
      status: filters.status,
      pipeline_id: filters.pipeline,
      owner_id: filters.owner,
      sort: filters.sort
    }
    
    const response = await dealsAPI.exportDeals(params)
    
    // Create download link
    const blob = new Blob([response.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `deals-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    success($t('common.messages.export_done'))
  } catch (err) {
    console.error('Error exporting deals:', err)
    error($t('common.messages.failed'))
  } finally {
    exporting.value = false
  }
}

const refreshDeals = () => {
  if (viewMode.value === 'list') {
    loadDeals()
  } else if (viewMode.value === 'kanban' && selectedPipeline.value) {
    loadDeals()
  }
}

const openCreateModal = async () => {
  editingDeal.value = null
  showModal.value = true
  // Reload metadata when modal opens
  await loadMetadata()
}

const editDeal = (deal) => {
  editingDeal.value = { ...deal }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingDeal.value = null
}

const onDealSaved = () => {
  closeModal()
  refreshDeals()
  success('Deal saved successfully')
}

const onPipelineChange = () => {
  if (selectedPipeline.value) {
    loadStages(selectedPipeline.value)
    loadDeals()
  } else {
    stages.value = []
    deals.value = []
  }
}

const getDealsForStage = (stageId) => {
  return deals.value.filter(deal => deal.stage_id === stageId)
}

const onDragStart = (event, deal) => {
  event.dataTransfer.setData('text/plain', deal.id)
}

const onDrop = async (event, stageId) => {
  event.preventDefault()
  const dealId = event.dataTransfer.getData('text/plain')
  
  try {
    await dealsAPI.moveDeal(dealId, stageId)
    refreshDeals()
    success($t('common.messages.updated'))
  } catch (err) {
    console.error('Error moving deal:', err)
    error($t('common.messages.failed'))
  }
}

const viewDeal = (deal) => {
  router.push(`/deals/${deal.id}`)
}

const deleteDeal = (deal) => {
  dealToDelete.value = deal
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!dealToDelete.value) return
  
  try {
    await dealsAPI.deleteDeal(dealToDelete.value.id)
    showDeleteModal.value = false
    dealToDelete.value = null
    refreshDeals()
    success($t('common.messages.deleted'))
  } catch (err) {
    console.error('Error deleting deal:', err)
    error($t('common.messages.failed'))
  }
}

const changePage = (page) => {
  filters.page = page
  loadDeals()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0)
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
}

const getStageColor = (stage) => {
  const colors = {
    'Qualification': 'bg-blue-100 text-blue-800',
    'Proposal': 'bg-yellow-100 text-yellow-800',
    'Negotiation': 'bg-orange-100 text-orange-800',
    'Closed Won': 'bg-green-100 text-green-800',
    'Closed Lost': 'bg-red-100 text-red-800'
  }
  return colors[stage?.name || stage] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(() => {
  loadDeals()
  loadMetadata()
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
