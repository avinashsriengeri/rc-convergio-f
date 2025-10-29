  <template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ $t('contacts.title') }}</h1>
            <p class="text-sm text-gray-600">{{ $t('contacts.subtitle') }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="outline"
              size="sm"
              icon="upload"
              @click="showImportModal = true"
            >
              {{ $t('contacts.import_csv') }}
            </BaseButton>
            <BaseButton
              variant="primary"
              size="sm"
              icon="plus"
              @click="showCreateModal = true"
            >
              {{ $t('contacts.add_contact') }}
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
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('contacts.search_placeholder')"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be]"
                @input="debouncedSearch"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="flex items-center space-x-3">
            <select
              v-model="filters.status"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be]"
            >
              <option value="">{{ $t('contacts.all_stages') }}</option>
              <option value="lead">{{ $t('contacts.lead') }}</option>
              <option value="prospect">{{ $t('contacts.prospect') }}</option>
              <option value="customer">{{ $t('contacts.customer') }}</option>
              <option value="inactive">{{ $t('contacts.inactive') }}</option>
            </select>
            
            <select
              v-model="filters.sort"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be]"
            >
              <option value="-created_at">{{ $t('contacts.newest_first') }}</option>
              <option value="created_at">{{ $t('contacts.oldest_first') }}</option>
              <option value="first_name">{{ $t('contacts.name_az') }}</option>
              <option value="-first_name">{{ $t('contacts.name_za') }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2596be]"></div>
      </div>

      <!-- Contacts list -->
      <div v-else>
        <!-- Empty state -->
        <div v-if="contacts.length === 0" class="text-center py-12">
          <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('contacts.no_contacts_found') }}</h3>
          <p class="text-gray-500 mb-6">{{ $t('contacts.get_started_message') }}</p>
          <BaseButton
            variant="primary"
            icon="plus"
            @click="showCreateModal = true"
          >
            {{ $t('contacts.add_contact') }}
          </BaseButton>
        </div>

        <!-- Contacts grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="contact in contacts"
            :key="contact.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div class="p-6">
              <!-- Contact header -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3 flex-1 min-w-0">
                  <div class="w-12 h-12 bg-gradient-to-r from-[#2596be] to-[#973894] rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-white font-medium text-lg">
                      {{ getInitials(contact) }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-gray-900 truncate">{{ getFullName(contact) }}</h3>
                    <p class="text-sm text-gray-500 truncate">{{ contact.email }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-1 ml-2 flex-shrink-0">
                  <button
                    @click.stop="viewContact(contact.id)"
                    class="p-1.5 text-gray-400 hover:text-[#2596be] hover:bg-gray-100 rounded-lg transition-colors"
                    :title="$t('contacts.view_contact')"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button
                    v-if="canEdit(contact)"
                    @click.stop="editContact(contact)"
                    class="p-1.5 text-gray-400 hover:text-[#2596be] hover:bg-gray-100 rounded-lg transition-colors"
                    :title="$t('contacts.edit_contact')"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button
                    v-if="canDelete(contact)"
                    @click.stop="deleteContact(contact.id)"
                    class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    :title="$t('contacts.delete_contact')"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Contact details -->
              <div class="space-y-2">
                <div v-if="contact.phone" class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.493 1.498a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {{ contact.phone }}
                </div>
                
                <div v-if="contact.email" class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {{ contact.email }}
                </div>

                <div v-if="contact.lifecycle_stage" class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ contact.lifecycle_stage }}
                </div>
                
                <div v-if="contact.owner" class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                  <strong>Owner:</strong> {{ contact.owner.name || '—' }}
                </div>
                
                <div v-if="contact.team" class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                  </svg>
                  <strong>Team:</strong> {{ contact.team.name || '—' }}
                </div>
              </div>

              <!-- Status and date -->
              <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getStatusClass(contact.lifecycle_stage)"
                >
                  {{ contact.lifecycle_stage ? $t(`contacts.${contact.lifecycle_stage}`) : $t('contacts.no_stage') }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ formatDate(contact.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.total > pagination.per_page" class="mt-8 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
          </div>
          <div class="flex items-center space-x-2">
            <BaseButton
              variant="outline"
              size="sm"
              :disabled="pagination.current_page === 1"
              @click="changePage(pagination.current_page - 1)"
            >
              Previous
            </BaseButton>
            <span class="px-3 py-2 text-sm text-gray-700">
              Page {{ pagination.current_page }} of {{ pagination.last_page }}
            </span>
            <BaseButton
              variant="outline"
              size="sm"
              :disabled="pagination.current_page === pagination.last_page"
              @click="changePage(pagination.current_page + 1)"
            >
              Next
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ContactModal
      v-if="showCreateModal || showEditModal"
      :contact="editingContact"
      :mode="showEditModal ? 'edit' : 'create'"
      @close="closeModal"
      @saved="handleContactSaved"
    />

    <ImportModal
      v-if="showImportModal"
      @close="showImportModal = false"
      @imported="handleImportComplete"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useNotifications } from '@/composables/useNotifications'
import { useContext } from '@/composables/useContext'
import { usePermission } from '@/composables/usePermission'
import { contactsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import ContactModal from '@/components/modals/ContactModal.vue'
import ImportModal from '@/components/modals/ImportModal.vue'

const router = useRouter()
const { t } = useI18n()
const { success, error, warning } = useNotifications()
const { tenantId, teamId, isAdmin } = useContext()
const { canEdit, canDelete, canView } = usePermission()

// Reactive data
const loading = ref(false)
const contacts = ref([])
const pagination = ref(null)
const searchQuery = ref('')
const filters = reactive({
  status: '',
  sort: '-created_at'
})

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showImportModal = ref(false)
const editingContact = ref(null)

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchContacts(1)
  }, 300)
}

// NOTE: The Contacts list no longer pulls from /contacts/recent. It relies solely on /contacts pagination.

// Fetch contacts
const fetchContacts = async (page = 1) => {
  console.log('Fetching contacts for page:', page)
  loading.value = true
  try {
    let response
    
    if (searchQuery.value.trim()) {
      // Primary: use /contacts?search= to search across all pages
      const params = {
        page,
        per_page: 12,
        sort: filters.sort,
        ...(filters.status && { stage: filters.status }),
        search: searchQuery.value.trim(),
        t: Date.now(), // cache-busting
      }
      console.log('Contacts search params:', params)
      try {
        response = await contactsAPI.getContacts(params)
      } catch (e) {
        console.warn('Fallback to /contacts/search due to getContacts search error:', e?.message)
        response = await contactsAPI.searchContacts(searchQuery.value.trim(), params)
      }
    } else {
      const params = {
        page,
        per_page: 12,
        sort: filters.sort,
        ...(filters.status && { stage: filters.status }),
        t: Date.now(), // cache-busting
      }
      console.log('Contacts API params:', params)
      response = await contactsAPI.getContacts(params)
    }
    
    console.log('API response:', response.data)
    contacts.value = response.data.data
    pagination.value = response.data.meta
    console.log('Updated contacts array length:', contacts.value?.length)
    console.log('First page contact IDs:', Array.isArray(contacts.value) ? contacts.value.map(c => c.id).join(',') : 'N/A')
    console.log('Pagination:', pagination.value)
  } catch (err) {
    error('Failed to load contacts')
    console.error('Contacts error:', err)
  } finally {
    loading.value = false
  }
}

// Pagination
const changePage = (page) => {
  fetchContacts(page)
}

// Contact actions
const viewContact = (contactId) => {
  // Set flag to suppress recent contacts API during navigation to contact detail
  if (typeof window !== 'undefined') {
    window.__RC_SUPPRESS_RECENT_CONTACTS__ = true
  }
  router.push(`/contacts/${contactId}`)
}

const editContact = (contact) => {
  console.log('Editing contact:', contact)
  editingContact.value = contact
  showEditModal.value = true
}

const deleteContact = async (contactId) => {
  if (!confirm(t('common.actions.confirm_delete', { name: 'this contact' }))) return

  try {
    console.log('Deleting contact with ID:', contactId)
    const response = await contactsAPI.deleteContact(contactId)
    console.log('Delete response:', response)
    success('Contact deleted successfully')
    fetchContacts(pagination.value?.current_page || 1)
  } catch (err) {
    console.error('Delete contact error:', err)
    console.error('Error response:', err.response?.data)
    error('Failed to delete contact')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingContact.value = null
}

const handleContactSaved = async () => {
  console.log('Contact saved, refreshing contacts list...')
  closeModal()
  // Always refresh to page 1 to see the newly created contact
  await fetchContacts(1)
  success('Contact saved successfully')
}

const handleImportComplete = async () => {
  showImportModal.value = false
  console.log('Import completed, refreshing contacts list...')
  await fetchContacts(1)
}

// Utility functions
const getStatusClass = (status) => {
  const classes = {
    lead: 'bg-blue-100 text-blue-800',
    prospect: 'bg-yellow-100 text-yellow-800',
    customer: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800'
  }
  // Fallback: if unknown status value present, show neutral badge instead of "No Stage"
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const getInitials = (contact) => {
  if (!contact || !contact.first_name || !contact.last_name) {
    return 'N/A'
  }
  return `${contact.first_name.charAt(0).toUpperCase()}${contact.last_name.charAt(0).toUpperCase()}`
}

const getFullName = (contact) => {
  if (!contact || !contact.first_name || !contact.last_name) {
    return 'N/A'
  }
  return `${contact.first_name} ${contact.last_name}`
}

// Watch for filter changes
watch(filters, () => {
  fetchContacts(1)
}, { deep: true })

// Handle real-time contact creation events
const handleContactsListUpdate = async (event) => {
  const { action, contact_id, submission_id, form_id } = event.detail || {}
  if (action === 'contact-created' || typeof contact_id !== 'undefined') {
    console.log('Real-time contact creation detected:', { contact_id, submission_id, form_id })
    await fetchContacts(1)
  }
}

// Initialize
onMounted(async () => {
  await fetchContacts(1)
  
  // Check if we should open create modal from URL parameter
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('create') === 'true') {
    showCreateModal.value = true
    // Clean up URL parameter
    const newUrl = window.location.pathname
    window.history.replaceState({}, document.title, newUrl)
  }
  
  // Listen for real-time contact creation events from both channels
  window.addEventListener('contacts-list-update', handleContactsListUpdate)
  window.addEventListener('contact-created', handleContactsListUpdate)
})

// Cleanup
onUnmounted(() => {
  window.removeEventListener('contacts-list-update', handleContactsListUpdate)
  window.removeEventListener('contact-created', handleContactsListUpdate)
})
</script>