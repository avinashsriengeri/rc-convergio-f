<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit List' : 'Create List' }}
            </h1>
            <p class="text-sm text-gray-600 mt-1">
              {{ isEditing ? 'Update your contact list or segment' : 'Create a new contact list or dynamic segment' }}
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="secondary"
              @click="goBack"
            >
              Cancel
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="saveList"
              :loading="saving"
              :disabled="!isFormValid"
            >
              {{ isEditing ? 'Update List' : 'Create List' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-6">
        <!-- Basic Settings -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">List Settings</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- List Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                List Name <span class="text-red-500">*</span>
              </label>
              <BaseInput
                v-model="form.name"
                placeholder="Enter list name"
                :error="errors.name"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <BaseInput
                v-model="form.description"
                placeholder="Enter description"
              />
            </div>

            <!-- List Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                List Type <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.type"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.type }"
              >
                <option value="">Select list type</option>
                <option value="static">Static List (Manual)</option>
                <option value="dynamic">Dynamic Segment (Auto)</option>
              </select>
              <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
            </div>
          </div>
        </div>

        <!-- Static List Configuration -->
        <div v-if="form.type === 'static'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Contact Selection</h3>
          <p class="text-sm text-gray-600 mb-4">Contacts are optional. You can create an empty list and add contacts later.</p>
          
          <!-- Contact Search -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Search Contacts</label>
              <div class="flex space-x-2">
                <BaseInput
                  v-model="contactSearch"
                  placeholder="Search by name or email"
                  @input="debouncedContactSearch"
                  class="flex-1"
                />
                <BaseButton
                  variant="outline"
                  @click="showAllContacts"
                >
                  Show All
                </BaseButton>
              </div>
            </div>

            <!-- Available Contacts -->
            <div class="border border-gray-200 rounded-lg">
              <div class="bg-blue-50 px-4 py-2 border-b border-gray-200">
                <h4 class="text-sm font-medium text-gray-900">
                  Available Contacts ({{ availableContacts.length }})
                </h4>
              </div>
              <div v-if="loadingContacts" class="p-8 text-center text-gray-500">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p class="text-sm">Loading contacts...</p>
              </div>
              <div v-else-if="availableContacts.length === 0" class="p-8 text-center text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p class="mt-2 text-sm">No contacts available</p>
                <p class="text-xs text-gray-400 mt-1">Search for contacts to add to this list</p>
              </div>
              <div v-else class="max-h-64 overflow-y-auto">
                <div
                  v-for="contact in availableContacts"
                  :key="contact.id"
                  class="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0"
                >
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span class="text-xs font-medium text-gray-700">
                          {{ getContactInitials(contact) }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ getContactFullName(contact) }}</p>
                      <p class="text-sm text-gray-500">{{ contact.email || 'No email' }}</p>
                    </div>
                  </div>
                  <BaseButton
                    variant="outline"
                    size="sm"
                    @click="addContact(contact)"
                    class="flex items-center"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add
                  </BaseButton>
                </div>
              </div>
            </div>

            <!-- Selected Contacts -->
            <div class="border border-gray-200 rounded-lg">
              <div class="bg-green-50 px-4 py-2 border-b border-gray-200">
                <h4 class="text-sm font-medium text-gray-900">
                  Selected Contacts ({{ form.contacts.length }})
                </h4>
              </div>
              <div v-if="form.contacts.length === 0" class="p-8 text-center text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p class="mt-2 text-sm">No contacts selected</p>
                <p class="text-xs text-gray-400 mt-1">This list will be created empty. You can add contacts later.</p>
              </div>
              <div v-else class="max-h-64 overflow-y-auto">
                <div
                  v-for="contact in form.contacts"
                  :key="contact.id"
                  class="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0"
                >
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span class="text-xs font-medium text-green-700">
                          {{ getContactInitials(contact) }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ getContactFullName(contact) }}</p>
                      <p class="text-sm text-gray-500">{{ contact.email || 'No email' }}</p>
                    </div>
                  </div>
                  <button
                    @click="removeContact(contact)"
                    class="text-gray-400 hover:text-red-600 p-1 rounded"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dynamic Segment Configuration -->
        <div v-if="form.type === 'dynamic'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Segment Conditions</h3>
          
          <!-- Conditions Builder -->
          <div class="space-y-4">
            <div
              v-for="(rule, index) in form.rules"
              :key="index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-medium text-gray-700">
                  Rule {{ index + 1 }}
                </span>
                <button
                  v-if="form.rules.length > 1"
                  @click="removeRule(index)"
                  class="text-gray-400 hover:text-red-600"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Field -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Field</label>
                  <select
                    v-model="rule.field"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select field</option>
                    <option
                      v-for="field in fieldOptions"
                      :key="field.value"
                      :value="field.value"
                    >
                      {{ field.label }}
                    </option>
                  </select>
                </div>

                <!-- Operator -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                  <select
                    v-model="rule.operator"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select operator</option>
                    <option
                      v-for="(label, value) in operatorMapping"
                      :key="value"
                      :value="value"
                    >
                      {{ label }}
                    </option>
                  </select>
                </div>

                <!-- Value -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <BaseInput
                    v-model="rule.value"
                    placeholder="Enter value"
                  />
                </div>
              </div>
            </div>

            <!-- Add Rule Button -->
            <BaseButton
              variant="outline"
              @click="addRule"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Rule
            </BaseButton>
          </div>

          <!-- Rules Preview -->
          <div v-if="form.rules.length > 0" class="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Rules Preview</h4>
            <div class="space-y-2 text-sm text-gray-600">
              <div v-for="(rule, index) in form.rules" :key="index">
                <span v-if="rule.field && rule.operator && rule.value">
                  {{ getFieldLabel(rule.field) }} {{ operatorMapping[rule.operator] }} "{{ rule.value }}"
                </span>
                <span v-else class="text-gray-400">
                  Rule {{ index + 1 }}: Incomplete
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { listsAPI, contactsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { debounce } from 'lodash-es'

interface Contact {
  id: number
  first_name: string
  last_name: string
  email: string
}

interface ListRule {
  field: string
  operator: string
  value: string
}

interface Form {
  name: string
  description: string
  type: 'static' | 'dynamic' | ''
  contacts: Contact[]
  rules: ListRule[]
}

const route = useRoute()
const router = useRouter()
const { success, error: showError } = useNotifications()

// Reactive data
const saving = ref(false)
const errors = ref<Record<string, string>>({})
const contactSearch = ref('')
const availableContacts = ref<Contact[]>([])
const loadingContacts = ref(false)

// Form data
const form = ref<Form>({
  name: '',
  description: '',
  type: '',
  contacts: [],
  rules: [{ field: '', operator: '', value: '' }]
})

// Computed
const isEditing = computed(() => route.path.includes('/edit'))

const isFormValid = computed(() => {
  // Check if form name exists and is not empty
  if (!form.value.name || !form.value.name.trim()) {
    return false
  }
  
  // Check if type is selected
  if (!form.value.type) {
    return false
  }
  
  // For static lists, contacts are optional (can be empty)
  // Backend allows creating static lists with 0 contacts
  
  // For dynamic lists, at least one complete rule is required
  if (form.value.type === 'dynamic') {
    const hasCompleteRule = form.value.rules.some(rule => 
      rule.field && rule.operator && rule.value
    )
    if (!hasCompleteRule) {
      return false
    }
  }
  
  return true
})

// Field options for dynamic segments
const fieldOptions = [
  { value: 'company_size', label: 'Company Size' },
  { value: 'job_title', label: 'Job Title' },
  { value: 'industry', label: 'Industry' },
  { value: 'location', label: 'Location' },
  { value: 'lead_source', label: 'Lead Source' },
  { value: 'lifecycle_stage', label: 'Lifecycle Stage' },
  { value: 'email', label: 'Email Domain' },
  { value: 'created_at', label: 'Created Date' },
  { value: 'last_activity', label: 'Last Activity' }
]

// Operator mapping for user-friendly display
const operatorMapping = {
  equals: 'is equal to',
  not_equals: 'is not equal to',
  contains: 'contains',
  starts_with: 'starts with',
  ends_with: 'ends with',
  greater_than: 'greater than',
  less_than: 'less than'
}

// Methods
const validateForm = (): boolean => {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = 'List name is required'
    return false
  }
  
  if (!form.value.type) {
    errors.value.type = 'Please select a list type'
    return false
  }
  
  // For static lists, contacts are optional (can be empty)
  // Backend allows creating static lists with 0 contacts
  
  if (form.value.type === 'dynamic') {
    const hasCompleteRule = form.value.rules.some(rule => 
      rule.field && rule.operator && rule.value
    )
    if (!hasCompleteRule) {
      errors.value.rules = 'At least one complete rule is required for dynamic segments'
      return false
    }
  }
  
  return true
}

const saveList = async () => {
  if (!validateForm()) {
    return
  }
  
  saving.value = true
  
  try {
    // Frontend duplicate check - Check for duplicate name with same type before saving
    // This requires fetching existing lists first
    const existingListsResponse = await listsAPI.getLists()
    const existingLists = existingListsResponse.data.data || existingListsResponse.data || []
    
    // Check for duplicates (same name AND same type)
    const normalizedName = form.value.name.trim().toLowerCase()
    const duplicate = existingLists.find((list: any) => {
      // Skip if it's the same list being edited
      if (isEditing.value && list.id === parseInt(route.params.id as string)) {
        return false
      }
      // Check if same name AND same type
      return list.name.toLowerCase() === normalizedName && list.type === form.value.type
    })
    
    if (duplicate) {
      showError(`A ${form.value.type} list with this name already exists`)
      saving.value = false
      return false
    }
    
    const listData = {
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      type: form.value.type,
      // For static lists, send contact IDs if available, otherwise empty array
      contacts: form.value.type === 'static' ? form.value.contacts.map(c => c.id) : [],
      // For dynamic lists, send rules if available, otherwise empty array
      // Backend expects 'rule' (singular), not 'rules' (plural)
      rule: form.value.type === 'dynamic' ? form.value.rules.filter(r => r.field && r.operator && r.value) : null
    }
    
    // Debug: Log the payload to confirm structure
    console.log('Sending list data:', listData)
    console.log('Rule field:', listData.rule)
    console.log('Rule type:', typeof listData.rule)
    
    if (isEditing.value) {
      await listsAPI.updateList(route.params.id as string, listData)
      success('List updated successfully')
    } else {
      await listsAPI.createList(listData)
      success('List created successfully')
    }
    
    // Navigate back to lists
    router.push('/lists')
  } catch (err: any) {
    console.error('Failed to save list:', err)
    showError(err.response?.data?.message || 'Failed to save list')
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push('/lists')
}

// Static list methods - Now using real CRM contacts
const debouncedContactSearch = debounce(() => {
  searchContacts()
}, 300)

const searchContacts = async () => {
  if (!contactSearch.value.trim()) {
    availableContacts.value = []
    return
  }
  
  loadingContacts.value = true
  try {
    const response = await contactsAPI.searchContacts(contactSearch.value.trim(), {
      per_page: 20,
      exclude_ids: form.value.contacts.map(c => c.id)
    })
    availableContacts.value = response.data.data || []
  } catch (err) {
    console.error('Failed to search contacts:', err)
    availableContacts.value = []
  } finally {
    loadingContacts.value = false
  }
}

const showAllContacts = async () => {
  loadingContacts.value = true
  try {
    const response = await contactsAPI.getContacts({
      per_page: 50,
      exclude_ids: form.value.contacts.map(c => c.id)
    })
    availableContacts.value = response.data.data || []
  } catch (err) {
    console.error('Failed to load contacts:', err)
    availableContacts.value = []
  } finally {
    loadingContacts.value = false
  }
}

const addContact = (contact: Contact) => {
  form.value.contacts.push(contact)
  availableContacts.value = availableContacts.value.filter(c => c.id !== contact.id)
}

const removeContact = (contact: Contact) => {
  form.value.contacts = form.value.contacts.filter(c => c.id !== contact.id)
  // Re-search to potentially add back to available
  if (contactSearch.value.trim()) {
    searchContacts()
  }
}

// Dynamic segment methods
const addRule = () => {
  form.value.rules.push({ field: '', operator: '', value: '' })
}

const removeRule = (index: number) => {
  form.value.rules.splice(index, 1)
}

// Helper function to get field label
const getFieldLabel = (fieldValue: string) => {
  const field = fieldOptions.find(f => f.value === fieldValue)
  return field ? field.label : fieldValue
}

// Helper functions for contact display
const getContactInitials = (contact: Contact) => {
  if (!contact.first_name && !contact.last_name) {
    return 'N/A'
  }
  const first = contact.first_name ? contact.first_name.charAt(0).toUpperCase() : ''
  const last = contact.last_name ? contact.last_name.charAt(0).toUpperCase() : ''
  return first + last
}

const getContactFullName = (contact: Contact) => {
  if (!contact.first_name && !contact.last_name) {
    return 'Unnamed Contact'
  }
  return `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
}

const loadList = async () => {
  if (isEditing.value) {
    const listId = route.params.id
    
    try {
      const response = await listsAPI.getList(listId as string)
      const listData = response.data.data || response.data
      
      // Clear existing form data
      form.value.name = ''
      form.value.description = ''
      form.value.type = ''
      form.value.contacts = []
      form.value.rules = [{ field: '', operator: '', value: '' }]
      
      // Assign basic form data
      Object.assign(form.value, {
        name: listData.name || '',
        description: listData.description || '',
        type: listData.type || '',
        rules: listData.rule && listData.rule.length > 0 ? listData.rule : [{ field: '', operator: '', value: '' }]
      })
      
      // Debug: Log the loaded data to verify rules are being loaded
      console.log('Loaded list data:', listData)
      console.log('Backend rule field:', listData.rule)
      console.log('Form rules after assignment:', form.value.rules)
      
      // For static lists, fetch existing contacts to populate the "Selected Contacts" box
      if (listData.type === 'static') {
        try {
          const membersResponse = await listsAPI.getListMembers(listId as string)
          const existingContacts = membersResponse.data.data || membersResponse.data || []
          
          // Map the contact data to match our Contact interface
          form.value.contacts = existingContacts.map((contact: any) => ({
            id: contact.id,
            first_name: contact.first_name || contact.name?.split(' ')[0] || '',
            last_name: contact.last_name || contact.name?.split(' ').slice(1).join(' ') || '',
            email: contact.email || ''
          }))
          
          console.log('Loaded existing contacts for static list:', form.value.contacts)
        } catch (contactErr) {
          console.error('Failed to load existing contacts:', contactErr)
          // Don't show error toast for contacts, just log it
          // The list can still be edited without contacts
        }
      }
    } catch (err: any) {
      console.error('Failed to load list:', err)
      showError('Failed to load list')
    }
  }
}

// Lifecycle
onMounted(() => {
  if (isEditing.value) {
    loadList()
  }
})
</script>
