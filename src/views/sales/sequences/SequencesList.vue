<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Sequences</h1>
          <p class="text-gray-600">Manage your automated outreach sequences</p>
        </div>
        <div class="flex items-center space-x-3">
          <BaseButton
            variant="outline"
            @click="exportSequences"
            :loading="exporting"
            v-if="sequences && sequences.length > 0"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export
          </BaseButton>
          <BaseButton
            variant="primary"
            @click="createSequence"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create Sequence
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search sequences..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              @input="debouncedSearch"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="statusFilter"
            @change="applyFilters"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- Clear Filters -->
        <div class="flex items-end">
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="animate-pulse">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sequences Table -->
    <div v-else-if="sequences && sequences.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Steps Count
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="sequence in sequences"
              :key="sequence.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ sequence.name }}</div>
                    <div v-if="sequence.description" class="text-sm text-gray-500">{{ sequence.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ sequence.target_type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ sequence.steps_count || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(sequence.is_active ? 'active' : 'inactive')" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ sequence.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(sequence.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewSequence(sequence)"
                    class="text-blue-600 hover:text-blue-800"
                    title="View Sequence"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>

                  <button
                    @click="editSequence(sequence)"
                    class="text-indigo-600 hover:text-indigo-800"
                    title="Edit Sequence"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>

                  <button
                    @click="toggleStatus(sequence)"
                    :class="sequence.is_active ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'"
                    :title="sequence.is_active ? 'Deactivate' : 'Activate'"
                  >
                    <svg v-if="sequence.is_active" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>

                  <button
                    @click="deleteSequence(sequence)"
                    class="text-red-600 hover:text-red-800"
                    title="Delete Sequence"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No sequences found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first sequence.</p>
        <div class="mt-6">
          <BaseButton
            variant="primary"
            @click="createSequence"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create Sequence
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      title="Delete Sequence"
      :message="`Are you sure you want to delete ${sequenceToDelete?.name}? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSequencesStore } from '@/stores/sequencesStore'
import { debounce } from 'lodash-es'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'

const router = useRouter()
const sequencesStore = useSequencesStore()

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('all')
const exporting = ref(false)
const showDeleteModal = ref(false)
const sequenceToDelete = ref(null)

// Computed
const sequences = computed(() => sequencesStore.sequences)
const loading = computed(() => sequencesStore.loading)

const hasActiveFilters = computed(() => {
  return searchQuery.value || statusFilter.value !== 'all'
})

// Methods
const loadSequences = async () => {
  const params = {
    q: searchQuery.value
  }
  
  // Add is_active filter based on status selection
  if (statusFilter.value === 'active') {
    params.is_active = 1
  } else if (statusFilter.value === 'inactive') {
    params.is_active = 0
  }
  // If 'all', don't add is_active param
  
  try {
    await sequencesStore.fetchSequences(params)
  } catch (error) {
    console.error('Error loading sequences:', error)
  }
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 300)

const applyFilters = () => {
  const filters = {
    search: searchQuery.value
  }
  
  // Add is_active filter based on status selection
  if (statusFilter.value === 'active') {
    filters.is_active = 1
  } else if (statusFilter.value === 'inactive') {
    filters.is_active = 0
  }
  // If 'all', don't add is_active filter
  
  sequencesStore.setFilters(filters)
  loadSequences()
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  loadSequences()
}

const createSequence = () => {
  router.push('/sales/sequences/create')
}

const viewSequence = (sequence) => {
  router.push(`/sales/sequences/${sequence.id}/view`)
}

const editSequence = (sequence) => {
  router.push(`/sales/sequences/${sequence.id}/edit`)
}

const toggleStatus = async (sequence) => {
  try {
    const newStatus = !sequence.is_active
    await sequencesStore.updateSequence(sequence.id, { ...sequence, is_active: newStatus })
    loadSequences()
  } catch (error) {
    console.error('Error updating sequence status:', error)
  }
}

const deleteSequence = (sequence) => {
  sequenceToDelete.value = sequence
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (sequenceToDelete.value) {
    try {
      await sequencesStore.deleteSequence(sequenceToDelete.value.id)
      showDeleteModal.value = false
      sequenceToDelete.value = null
      loadSequences()
    } catch (error) {
      console.error('Error deleting sequence:', error)
    }
  }
}

const exportSequences = async () => {
  exporting.value = true
  try {
    // TODO: Implement export functionality
    console.log('Export sequences functionality to be implemented')
  } catch (error) {
    console.error('Error exporting sequences:', error)
  } finally {
    exporting.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(() => {
  loadSequences()
})
</script>
