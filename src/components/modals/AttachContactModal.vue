<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            Attach Contacts to {{ companyName }}
          </h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="p-6 border-b border-gray-200">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search contacts..."
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

      <!-- Content -->
      <div class="p-6">
        <!-- Loading state -->
        <div v-if="loading" class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2596be]"></div>
        </div>

        <!-- Contacts list -->
        <div v-else>
          <!-- Empty state -->
          <div v-if="contacts.length === 0" class="text-center py-8">
            <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p class="text-gray-500">No contacts available to attach to this company.</p>
          </div>

          <!-- Contacts grid -->
          <div v-else class="space-y-3">
            <div
              v-for="contact in contacts"
              :key="contact.id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-r from-[#2596be] to-[#973894] rounded-full flex items-center justify-center">
                  <span class="text-white font-medium text-sm">
                    {{ getInitials(contact) }}
                  </span>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">{{ getFullName(contact) }}</h4>
                  <p class="text-sm text-gray-500">{{ contact.email }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span
                  v-if="contact.is_attached"
                  class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                >
                  Attached
                </span>
                <BaseButton
                  v-else
                  variant="primary"
                  size="sm"
                  @click="attachContact(contact.id)"
                  :loading="attachingContact === contact.id"
                >
                  Attach
                </BaseButton>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="pagination && pagination.total > pagination.per_page" class="mt-6 flex items-center justify-between">
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

      <!-- Actions -->
      <div class="p-6 border-t border-gray-200">
        <div class="flex items-center justify-end space-x-3">
          <BaseButton
            variant="outline"
            @click="$emit('close')"
          >
            Close
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { contactsAPI, companiesAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  companyId: {
    type: [String, Number],
    required: true
  },
  companyName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'attached'])

const { success, error } = useNotifications()

// Reactive data
const loading = ref(false)
const contacts = ref([])
const pagination = ref(null)
const searchQuery = ref('')
const attachingContact = ref(null)

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchContacts()
  }, 300)
}

// Fetch contacts
const fetchContacts = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      per_page: 10,
      ...(searchQuery.value && { q: searchQuery.value })
    }

    const response = await contactsAPI.getContacts(params)
    contacts.value = response.data.data
    pagination.value = response.data.meta

    // Check which contacts are already attached
    await checkAttachedContacts()
  } catch (err) {
    error('Failed to load contacts')
    console.error('Contacts error:', err)
  } finally {
    loading.value = false
  }
}

// Check which contacts are already attached to this company
const checkAttachedContacts = async () => {
  try {
    const response = await companiesAPI.getCompanyContacts(props.companyId)
    const attachedContactIds = response.data.map(contact => contact.id)
    
    contacts.value = contacts.value.map(contact => ({
      ...contact,
      is_attached: attachedContactIds.includes(contact.id)
    }))
  } catch (err) {
    console.error('Error checking attached contacts:', err)
  }
}

// Attach contact to company
const attachContact = async (contactId) => {
  attachingContact.value = contactId
  
  try {
    await companiesAPI.attachContact(props.companyId, contactId)
    success('Contact attached successfully')
    
    // Update the contact's attached status
    const contact = contacts.value.find(c => c.id === contactId)
    if (contact) {
      contact.is_attached = true
    }
    
    emit('attached')
  } catch (err) {
    error('Failed to attach contact')
    console.error('Attach contact error:', err)
  } finally {
    attachingContact.value = null
  }
}

// Pagination
const changePage = (page) => {
  fetchContacts(page)
}

// Utility functions
const getInitials = (contact) => {
  const firstName = contact.first_name || ''
  const lastName = contact.last_name || ''
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
}

const getFullName = (contact) => {
  const firstName = contact.first_name || ''
  const lastName = contact.last_name || ''
  return `${firstName} ${lastName}`.trim() || 'Unnamed Contact'
}

// Initialize
onMounted(() => {
  fetchContacts()
})
</script>

