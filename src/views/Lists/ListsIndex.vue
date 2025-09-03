<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Lists & Segments</h1>
            <p class="text-sm text-gray-600 mt-1">Organize and segment your contacts</p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="secondary"
              @click="refreshLists"
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
              @click="createList"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New List
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex flex-wrap gap-2">
            <BaseButton
              type="button"
              variant="outline"
              size="sm"
              @click="setTypeFilter('all')"
              :class="{ 'bg-blue-50 border-blue-200 text-blue-700': typeFilter === 'all' }"
            >
              All Lists
            </BaseButton>
            <BaseButton
              type="button"
              variant="outline"
              size="sm"
              @click="setTypeFilter('static')"
              :class="{ 'bg-green-50 border-green-200 text-green-700': typeFilter === 'static' }"
            >
              Static Lists
            </BaseButton>
            <BaseButton
              type="button"
              variant="outline"
              size="sm"
              @click="setTypeFilter('dynamic')"
              :class="{ 'bg-purple-50 border-purple-200 text-purple-700': typeFilter === 'dynamic' }"
            >
              Dynamic Segments
            </BaseButton>
          </div>
          
          <div class="flex items-center space-x-2">
            <BaseInput
              v-model="searchQuery"
              placeholder="Search lists..."
              @input="debouncedSearch"
              class="w-64"
            >
              <template #prefix>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </template>
            </BaseInput>
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
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading lists</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="refreshLists">
            Try Again
          </BaseButton>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && filteredLists.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          {{ searchQuery ? 'No lists found' : 'No lists created' }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchQuery ? 'Try adjusting your search criteria.' : 'Get started by creating your first contact list or segment.' }}
        </p>
        <div class="mt-6" v-if="!searchQuery">
          <BaseButton variant="primary" @click="createList">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New List
          </BaseButton>
        </div>
      </div>

      <!-- Lists Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="list in filteredLists"
          :key="list.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <!-- List Header -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-2">
                  <h3 class="text-lg font-medium text-gray-900 truncate">
                    {{ list.name }}
                  </h3>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    :class="getTypeBadgeClass(list.type)"
                  >
                    {{ list.type }}
                  </span>
                </div>
                <p class="text-sm text-gray-500">
                  {{ list.description || 'No description' }}
                </p>
              </div>
            </div>
          </div>

          <!-- List Stats -->
          <div class="px-6 py-4">
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span class="font-medium text-gray-900">{{ list.contacts_count || 0 }}</span>
                <div class="text-xs">Contacts</div>
              </div>
              <div>
                <span class="font-medium text-gray-900">{{ formatDate(list.created_at) }}</span>
                <div class="text-xs">Created</div>
              </div>
            </div>
            
            <!-- Dynamic Segment Info -->
            <div v-if="list.type === 'dynamic' && list.rules" class="mt-3 p-2 bg-purple-50 rounded-md">
              <div class="text-xs text-purple-700 font-medium mb-1">Rules:</div>
              <div class="text-xs text-purple-600">
                {{ formatRules(list.rules) }}
              </div>
            </div>
          </div>

          <!-- List Actions -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <BaseButton
                  variant="outline"
                  size="sm"
                  @click="viewList(list)"
                  class="flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </BaseButton>
                <BaseButton
                  variant="outline"
                  size="sm"
                  @click="editList(list)"
                  class="flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </BaseButton>
              </div>
              <div class="flex items-center space-x-1">
                <button
                  v-if="list.type === 'dynamic'"
                  @click="refreshSegment(list)"
                  class="text-gray-400 hover:text-purple-600 p-1 rounded"
                  title="Refresh segment"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  @click="deleteList(list)"
                  class="text-gray-400 hover:text-red-600 p-1 rounded"
                  title="Delete list"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      title="Delete List"
      :message="`Are you sure you want to delete the list '${listToDelete?.name}'? This action cannot be undone.`"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash-es'
import { useNotifications } from '@/composables/useNotifications'
import { listsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'

interface ListRule {
  field: string
  operator: string
  value: string
}

interface ContactList {
  id: number
  name: string
  description?: string
  type: 'static' | 'dynamic'
  contacts_count: number
  rules?: ListRule[]
  created_by: string
  created_at: string
  updated_at: string
}

const router = useRouter()
const { success, error: showError } = useNotifications()

// Reactive data
const loading = ref(false)
const error = ref<string | null>(null)
const lists = ref<ContactList[]>([])
const searchQuery = ref('')
const typeFilter = ref<'all' | 'static' | 'dynamic'>('all')
const showDeleteModal = ref(false)
const listToDelete = ref<ContactList | null>(null)

// Computed
const filteredLists = computed(() => {
  let filtered = lists.value

  // Filter by type
  if (typeFilter.value !== 'all') {
    filtered = filtered.filter(list => list.type === typeFilter.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(list => 
      list.name.toLowerCase().includes(query) ||
      list.description?.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Methods
const refreshLists = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await listsAPI.getLists()
    lists.value = response.data.data || response.data
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Failed to load lists'
    showError('Failed to load lists')
  } finally {
    loading.value = false
  }
}

const createList = () => {
  router.push('/lists/create')
}

const viewList = (list: ContactList) => {
  router.push(`/lists/${list.id}`)
}

const editList = (list: ContactList) => {
  router.push(`/lists/${list.id}/edit`)
}

const refreshSegment = async (list: ContactList) => {
  // Simulate refreshing dynamic segment
  console.log('Refreshing segment:', list.name)
  // You would call an API to recalculate the segment here
}

const deleteList = (list: ContactList) => {
  listToDelete.value = list
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!listToDelete.value) return
  
  try {
    await listsAPI.deleteList(listToDelete.value.id)
    
    // Remove from local array
    lists.value = lists.value.filter(l => l.id !== listToDelete.value!.id)
    
    showDeleteModal.value = false
    listToDelete.value = null
    success('List deleted successfully')
  } catch (err: any) {
    console.error('Failed to delete list:', err)
    showError('Failed to delete list')
  }
}

const setTypeFilter = (type: 'all' | 'static' | 'dynamic') => {
  typeFilter.value = type
}

const debouncedSearch = debounce(() => {
  // Search is handled by computed property
}, 300)

const getTypeBadgeClass = (type: string) => {
  const classes = {
    static: 'bg-green-100 text-green-800',
    dynamic: 'bg-purple-100 text-purple-800'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Invalid Date'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (err) {
    return 'Invalid Date'
  }
}

const formatRules = (rules: ListRule[]) => {
  if (!rules || rules.length === 0) return 'No rules'
  
  return rules.map(rule => 
    `${rule.field} ${rule.operator} "${rule.value}"`
  ).join(' AND ')
}

// Lifecycle
onMounted(() => {
  refreshLists()
})
</script>
