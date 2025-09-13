<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ mode === 'edit' ? $t('common.edit_contact') : $t('common.add_contact') }}
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

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- First Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('common.first_name') }} *
          </label>
          <BaseInput
            v-model="form.first_name"
            type="text"
            :placeholder="$t('common.enter_first_name')"
            :error="!!errors.first_name"
          />
          <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">{{ errors.first_name }}</p>
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('common.last_name') }} *
          </label>
          <BaseInput
            v-model="form.last_name"
            type="text"
            :placeholder="$t('common.enter_last_name')"
            :error="!!errors.last_name"
          />
          <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">{{ errors.last_name }}</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('common.email') }}
          </label>
          <BaseInput
            v-model="form.email"
            type="email"
            :placeholder="$t('common.enter_email')"
            :error="!!errors.email"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('common.phone') }}
          </label>
          <BaseInput
            v-model="form.phone"
            type="tel"
            :placeholder="$t('common.enter_phone')"
            :error="!!errors.phone"
          />
          <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
        </div>

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
            <option value="">{{ $t('common.select_status') }}</option>
            <option value="lead">{{ $t('common.lead') }}</option>
            <option value="prospect">{{ $t('common.prospect') }}</option>
            <option value="customer">{{ $t('common.customer') }}</option>
            <option value="inactive">{{ $t('common.inactive') }}</option>
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

        <!-- Tags -->
        <div>
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

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 pt-4">
          <BaseButton
            type="button"
            variant="outline"
            @click="$emit('close')"
          >
            {{ $t('common.cancel') }}
          </BaseButton>
          <BaseButton
            type="submit"
            variant="primary"
            :loading="loading"
          >
            {{ mode === 'edit' ? $t('common.save') : $t('common.create') }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { contactsAPI } from '@/services/api'
import { useAuth } from '@/composables/useAuth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  contact: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create',
    validator: (value) => ['create', 'edit'].includes(value)
  }
})

const emit = defineEmits(['close', 'saved'])

const { success, error } = useNotifications()
const { user, isAuthenticated } = useAuth()

const loading = ref(false)
const tagsInput = ref('')
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

const errors = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  lifecycle_stage: '',
  source: '',
  tags: ''
})

// Initialize form when contact prop changes
watch(() => props.contact, (newContact) => {
  if (newContact && props.mode === 'edit') {
    Object.assign(form, {
      first_name: newContact.first_name || '',
      last_name: newContact.last_name || '',
      email: newContact.email || '',
      phone: newContact.phone || '',
      lifecycle_stage: newContact.lifecycle_stage || '',
      source: newContact.source || '',
      tags: newContact.tags || [],
      owner_id: newContact.owner_id || user.value?.id || 1
    })
    // Update tags input
    tagsInput.value = Array.isArray(newContact.tags) ? newContact.tags.join(', ') : ''
  }
}, { immediate: true })

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
    
    console.log('Submitting contact form:', form)
    console.log('Current user:', user.value)
    console.log('User ID being used:', form.owner_id)
    console.log('Is authenticated:', isAuthenticated.value)
    
    if (props.mode === 'edit') {
      const response = await contactsAPI.updateContact(props.contact.id, form)
      console.log('Update response:', response.data)
    } else {
      const response = await contactsAPI.createContact(form)
      console.log('Create response:', response.data)
    }
    
    success(props.mode === 'edit' ? 'Contact updated successfully' : 'Contact created successfully')
    console.log('Emitting saved event')
    emit('saved')
  } catch (err) {
    console.error('Contact save error:', err)
    if (err.response?.data?.errors) {
      // Handle validation errors from backend
      const backendErrors = err.response.data.errors
      Object.keys(backendErrors).forEach(key => {
        if (errors.hasOwnProperty(key)) {
          errors[key] = backendErrors[key][0]
        }
      })
    } else {
      error('Failed to save contact')
    }
  } finally {
    loading.value = false
  }
}
</script>
