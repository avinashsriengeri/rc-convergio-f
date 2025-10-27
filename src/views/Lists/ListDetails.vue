<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <div class="flex items-center space-x-3">
              <button
                @click="goBack"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ list?.name }}</h1>
                <div class="flex items-center space-x-3 mt-1">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    :class="getTypeBadgeClass(list?.type)"
                  >
                    {{ list?.type }}
                  </span>
                  <p class="text-sm text-gray-600">
                    {{ list?.description || 'No description' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              v-if="list?.type === 'dynamic'"
              variant="secondary"
              @click="refreshSegment"
              :loading="refreshing"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Segment
            </BaseButton>
            <BaseButton
              variant="outline"
              @click="exportList"
              :loading="exporting"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="editList"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit List
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
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading list</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="loadList">
            Try Again
          </BaseButton>
        </div>
      </div>

      <!-- List Details -->
      <div v-else-if="list" class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Contacts</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ list.contacts_count || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Active Contacts</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ Math.floor((list.contacts_count || 0) * 0.85) }}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Created By</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ list.created_by?.name || 'Unknown' }}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Created</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ formatDate(list.created_at) }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Dynamic Segment Rules -->
        <div v-if="list.type === 'dynamic' && list.rules" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Segment Rules</h3>
          <div class="space-y-3">
            <div
              v-for="(rule, index) in list.rules"
              :key="index"
              class="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg"
            >
              <span v-if="index > 0" class="text-purple-600 font-medium text-sm">AND</span>
              <div class="flex items-center space-x-2 text-sm">
                <span class="font-medium text-purple-900">{{ rule.field }}</span>
                <span class="text-purple-700">{{ rule.operator.replace('_', ' ') }}</span>
                <span v-if="rule.value" class="font-medium text-purple-900">"{{ rule.value }}"</span>
              </div>
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-600">
            <p>
              <svg class="w-4 h-4 inline mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              This segment automatically updates when contacts match these rules.
            </p>
          </div>
        </div>

        <!-- Contacts Table (Both Static and Dynamic Lists) -->
        <div v-if="list.contacts && list.contacts.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">
                {{ list.type === 'dynamic' ? 'Segment Members' : 'List Members' }}
              </h3>
              <div class="flex items-center space-x-3">
                <BaseInput
                  v-model="searchQuery"
                  placeholder="Search contacts..."
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

          <!-- Contacts List -->
          <div class="overflow-hidden">
            <div v-if="filteredContacts.length === 0" class="p-8 text-center text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p class="mt-2 text-sm">
                {{ searchQuery ? 'No contacts match your search' : 'No contacts in this list' }}
              </p>
            </div>
            <div v-else class="divide-y divide-gray-200">
              <div
                v-for="contact in filteredContacts"
                :key="contact.id"
                class="px-6 py-4 hover:bg-gray-50"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">
                          {{ getContactInitials(contact) }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ getContactFullName(contact) }}</div>
                      <div class="text-sm text-gray-500">{{ contact.email }}</div>
                    </div>
                    <div v-if="contact.company?.name" class="text-sm text-gray-500">
                      {{ contact.company.name }}
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <BaseButton
                      variant="outline"
                      size="sm"
                      @click="viewContact(contact)"
                      class="flex items-center"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </BaseButton>
                    <!-- Only show remove button for static lists -->
                    <button
                      v-if="list.type === 'static'"
                      @click="removeFromList(contact)"
                      class="text-gray-400 hover:text-red-600 p-1 rounded"
                      title="Remove from list"
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
      </div>
    </div>

    <!-- Remove Contact Modal -->
    <ConfirmationModal
      v-if="showRemoveModal"
      title="Remove Contact"
      :message="`Are you sure you want to remove '${contactToRemove ? getContactFullName(contactToRemove) : 'this contact'}' from the list?`"
      confirm-text="Remove"
      confirm-variant="danger"
      @confirm="confirmRemove"
      @cancel="showRemoveModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { listsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'

interface Contact {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  company?: {
    id: number
    name: string
    size: number
  }
  owner?: {
    id: number
    name: string
  }
  created_at: string
}

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
  contacts?: Contact[]
  rules?: ListRule[]
  created_by: {
    id: number
    name: string
    email: string
  }
  created_at: string
  updated_at: string
}

const route = useRoute()
const router = useRouter()
const { success, error: showError } = useNotifications()

// Reactive data
const loading = ref(false)
const error = ref<string | null>(null)
const list = ref<ContactList | null>(null)
const searchQuery = ref('')
const refreshing = ref(false)
const exporting = ref(false)
const showRemoveModal = ref(false)
const contactToRemove = ref<Contact | null>(null)

// Computed
const filteredContacts = computed(() => {
  if (!list.value?.contacts) return []
  
  if (!searchQuery.value.trim()) {
    return list.value.contacts
  }
  
  const query = searchQuery.value.toLowerCase()
  return list.value.contacts.filter(contact => {
    const fullName = getContactFullName(contact).toLowerCase()
    const companyName = contact.company?.name?.toLowerCase() || ''
    return fullName.includes(query) ||
           contact.email.toLowerCase().includes(query) ||
           companyName.includes(query)
  })
})

// Methods
const loadList = async () => {
  loading.value = true
  error.value = null
  
  try {
    const listId = route.params.id
    
    // Load list details
    const listResponse = await listsAPI.getList(listId as string)
    list.value = listResponse.data.data || listResponse.data
    
    // Load members for static lists (but don't overwrite contacts_count from backend)
    if (list.value?.type === 'static') {
      const membersResponse = await listsAPI.getListMembers(listId as string)
      list.value.contacts = membersResponse.data.data || membersResponse.data
      // Keep the backend's contacts_count, don't overwrite it
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load list'
    showError('Failed to load list')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/lists')
}

const editList = () => {
  router.push(`/lists/${list.value?.id}/edit`)
}

const refreshSegment = async () => {
  if (list.value?.type !== 'dynamic') return
  
  refreshing.value = true
  
  try {
    // Simulate API call to refresh segment
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock updated count
    if (list.value) {
      list.value.contacts_count = Math.floor(Math.random() * 200) + 50
    }
  } catch (err) {
    console.error('Failed to refresh segment:', err)
  } finally {
    refreshing.value = false
  }
}

const exportList = async () => {
  exporting.value = true
  
  try {
    // Simulate API call to export
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock CSV download
    const csvContent = "data:text/csv;charset=utf-8,Name,Email,Company\n" +
      (list.value?.contacts || []).map(contact => 
        `${getContactFullName(contact)},${contact.email},${contact.company?.name || ''}`
      ).join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${list.value?.name || 'list'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    console.error('Failed to export list:', err)
  } finally {
    exporting.value = false
  }
}

const viewContact = (contact: Contact) => {
  // TODO: Temporary suppression of recent contacts API during contact detail navigation
  if (typeof window !== 'undefined') {
    ;(window as any).__RC_SUPPRESS_RECENT_CONTACTS__ = true
  }
  router.push(`/contacts/${contact.id}`)
}

const removeFromList = (contact: Contact) => {
  contactToRemove.value = contact
  showRemoveModal.value = true
}

const confirmRemove = async () => {
  if (!contactToRemove.value || !list.value) return
  
  try {
    await listsAPI.removeListMember(list.value.id, contactToRemove.value.id)
    
    // Remove from local data
    if (list.value.contacts) {
      list.value.contacts = list.value.contacts.filter(c => c.id !== contactToRemove.value!.id)
      // Don't overwrite the backend's contacts_count
    }
    
    success('Contact removed from list')
    showRemoveModal.value = false
    contactToRemove.value = null
  } catch (err) {
    console.error('Failed to remove contact:', err)
    showError('Failed to remove contact from list')
  }
}

const getTypeBadgeClass = (type?: string) => {
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

// Helper functions for contact display
const getContactInitials = (contact: Contact) => {
  if (!contact.first_name && !contact.last_name) return 'N/A'
  const firstInitial = contact.first_name ? contact.first_name.charAt(0).toUpperCase() : ''
  const lastInitial = contact.last_name ? contact.last_name.charAt(0).toUpperCase() : ''
  return firstInitial + lastInitial
}

const getContactFullName = (contact: Contact) => {
  if (!contact.first_name && !contact.last_name) return 'Unnamed Contact'
  return `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
}

// Lifecycle
onMounted(() => {
  loadList()
})
</script>
