<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <router-link
              :to="`/contacts/${contactId}`"
              class="text-[#2596be] hover:text-[#973894] transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </router-link>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Edit Contact</h1>
              <p class="text-sm text-gray-600">Update contact information and details</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="outline"
              @click="goBack"
            >
              Cancel
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="handleSubmit"
              :loading="loading"
            >
              Update Contact
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading && !contact" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="ml-3 text-gray-600">Loading contact...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading contact</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="loadContact">
            Try Again
          </BaseButton>
        </div>
      </div>

      <!-- Contact not found -->
      <div v-else-if="!contact && !loading" class="text-center py-12">
        <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Contact not found</h3>
        <p class="text-gray-500 mb-6">The contact you're trying to edit doesn't exist or has been deleted.</p>
        <router-link
          to="/contacts"
          class="text-[#2596be] hover:text-[#973894] transition-colors"
        >
          Back to contacts
        </router-link>
      </div>

      <!-- Edit Form -->
      <div v-else-if="contact" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Basic Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- First Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <BaseInput
                  v-model="form.first_name"
                  type="text"
                  placeholder="Enter first name"
                  :error="!!errors.first_name"
                />
                <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">{{ errors.first_name }}</p>
              </div>

              <!-- Last Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <BaseInput
                  v-model="form.last_name"
                  type="text"
                  placeholder="Enter last name"
                  :error="!!errors.last_name"
                />
                <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">{{ errors.last_name }}</p>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <BaseInput
                  v-model="form.email"
                  type="email"
                  placeholder="Enter email address"
                  :error="!!errors.email"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <BaseInput
                  v-model="form.phone"
                  type="tel"
                  placeholder="Enter phone number"
                  :error="!!errors.phone"
                />
                <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Lifecycle Stage -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Lifecycle Stage
                </label>
                <select
                  v-model="form.lifecycle_stage"
                  :class="[
                    'block w-full rounded-lg shadow-sm focus:border-[#2596be] focus:ring-[#2596be]',
                    errors.lifecycle_stage ? 'border-red-300' : 'border-gray-300'
                  ]"
                >
                  <option value="">Select stage</option>
                  <option value="lead">Lead</option>
                  <option value="prospect">Prospect</option>
                  <option value="customer">Customer</option>
                  <option value="inactive">Inactive</option>
                </select>
                <p v-if="errors.lifecycle_stage" class="mt-1 text-sm text-red-600">
                  {{ errors.lifecycle_stage }}
                </p>
              </div>

              <!-- Source -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <BaseInput
                  v-model="form.source"
                  type="text"
                  placeholder="How did you find this contact?"
                  :error="!!errors.source"
                />
                <p v-if="errors.source" class="mt-1 text-sm text-red-600">{{ errors.source }}</p>
              </div>
            </div>

            <!-- Tags -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                v-model="tagsInput"
                type="text"
                placeholder="Enter tags separated by commas"
                :class="[
                  'block w-full rounded-lg shadow-sm focus:border-[#2596be] focus:ring-[#2596be]',
                  errors.tags ? 'border-red-300' : 'border-gray-300'
                ]"
                @input="updateTags"
              />
              <p v-if="errors.tags" class="mt-1 text-sm text-red-600">
                {{ errors.tags }}
              </p>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="border-t border-gray-200 pt-6 flex items-center justify-end space-x-3">
            <BaseButton
              type="button"
              variant="outline"
              @click="goBack"
            >
              Cancel
            </BaseButton>
            <BaseButton
              type="submit"
              variant="primary"
              :loading="loading"
            >
              Update Contact
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { contactsAPI } from '@/services/api'
import { useAuth } from '@/composables/useAuth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const { success, error: showError } = useNotifications()
const { user } = useAuth()

// Reactive data
const loading = ref(false)
const contact = ref(null)
const error = ref(null)
const tagsInput = ref('')

// Form data
const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  lifecycle_stage: '',
  source: '',
  tags: [],
  owner_id: user.value?.id || 1
})

// Validation errors
const errors = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  lifecycle_stage: '',
  source: '',
  tags: ''
})

// Computed
const contactId = computed(() => route.params.id)

// Lifecycle
onMounted(() => {
  loadContact()
})

// Methods
const loadContact = async () => {
  if (!contactId.value) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await contactsAPI.getContact(contactId.value)
    const contactData = response.data.data.contact || response.data.data
    
    if (!contactData) {
      error.value = 'Contact not found'
      return
    }
    
    // Update contact reference
    contact.value = contactData
    
    // Populate form
    Object.assign(form, {
      first_name: contactData.first_name || '',
      last_name: contactData.last_name || '',
      email: contactData.email || '',
      phone: contactData.phone || '',
      lifecycle_stage: contactData.lifecycle_stage || '',
      source: contactData.source || '',
      tags: contactData.tags || [],
      owner_id: contactData.owner_id || user.value?.id || 1
    })
    
    // Update tags input
    tagsInput.value = Array.isArray(contactData.tags) ? contactData.tags.join(', ') : ''
    
  } catch (err) {
    console.error('Failed to load contact:', err)
    error.value = err.response?.data?.message || 'Failed to load contact'
    showError('Failed to load contact')
  } finally {
    loading.value = false
  }
}

const updateTags = () => {
  if (tagsInput.value.trim()) {
    form.tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
  } else {
    form.tags = []
  }
}

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  let isValid = true
  
  if (!form.first_name) {
    errors.first_name = 'First name is required'
    isValid = false
  }
  
  if (!form.last_name) {
    errors.last_name = 'Last name is required'
    isValid = false
  }
  
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  if (form.phone && !/^\+?[1-9]\d{1,14}$/.test(form.phone.replace(/\s/g, ''))) {
    errors.phone = 'Please enter a valid phone number'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // Ensure owner_id is set
    form.owner_id = user.value?.id || 1
    
    console.log('Updating contact:', form)
    
    const response = await contactsAPI.updateContact(contactId.value, form)
    console.log('Update response:', response.data)
    
    success('Contact updated successfully')
    
    // Navigate back to contact detail
    // TODO: Temporary suppression of recent contacts API during contact detail navigation
    if (typeof window !== 'undefined') {
      window.__RC_SUPPRESS_RECENT_CONTACTS__ = true
    }
    router.push(`/contacts/${contactId.value}`)
    
  } catch (err) {
    console.error('Failed to update contact:', err)
    
    if (err.response?.data?.errors) {
      // Handle validation errors from backend
      const backendErrors = err.response.data.errors
      Object.keys(backendErrors).forEach(key => {
        if (errors.hasOwnProperty(key)) {
          errors[key] = backendErrors[key][0]
        }
      })
    } else {
      showError('Failed to update contact')
    }
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  // TODO: Temporary suppression of recent contacts API during contact detail navigation
  if (typeof window !== 'undefined') {
    window.__RC_SUPPRESS_RECENT_CONTACTS__ = true
  }
  router.push(`/contacts/${contactId.value}`)
}
</script>
