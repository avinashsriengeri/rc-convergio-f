<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-medium text-gray-900">
          {{ isEditing ? 'Edit Activity' : 'New Activity' }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Subject -->
        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <BaseInput
            id="subject"
            v-model="form.subject"
            placeholder="Enter activity subject"
            :error="errors.subject"
            required
          />
        </div>

        <!-- Type -->
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
            Type *
          </label>
          <select
            id="type"
            v-model="form.type"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.type }"
            required
          >
            <option value="">Select activity type</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="task">Task</option>
            <option value="note">Note</option>
          </select>
          <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.description }"
            placeholder="Enter activity description"
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
        </div>

        <!-- Scheduled Date & Time -->
        <div>
          <label for="scheduled_at" class="block text-sm font-medium text-gray-700 mb-2">
            Scheduled Date & Time
          </label>
          <input
            id="scheduled_at"
            v-model="form.scheduled_at"
            type="datetime-local"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.scheduled_at }"
          />
          <p v-if="errors.scheduled_at" class="mt-1 text-sm text-red-600">{{ errors.scheduled_at }}</p>
        </div>

        <!-- Status -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            id="status"
            v-model="form.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.status }"
            required
          >
            <option value="">Select status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
        </div>

        <!-- Owner -->
        <div>
          <label for="owner_id" class="block text-sm font-medium text-gray-700 mb-2">
            Owner
          </label>
          <select
            id="owner_id"
            v-model="form.owner_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.owner_id }"
          >
            <option value="">Select owner</option>
            <option v-for="owner in owners" :key="owner.id" :value="owner.id">
              {{ owner.name }}
            </option>
          </select>
          <p v-if="errors.owner_id" class="mt-1 text-sm text-red-600">{{ errors.owner_id }}</p>
        </div>

        <!-- Related Type -->
        <div>
          <label for="related_type" class="block text-sm font-medium text-gray-700 mb-2">
            Related To
          </label>
          <select
            id="related_type"
            v-model="form.related_type"
            @change="onRelatedTypeChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.related_type }"
          >
            <option value="">Select related type</option>
            <option value="contact">Contact</option>
            <option value="company">Company</option>
            <option value="deal">Deal</option>
          </select>
          <p v-if="errors.related_type" class="mt-1 text-sm text-red-600">{{ errors.related_type }}</p>
        </div>

        <!-- Related Item -->
        <div v-if="form.related_type">
          <label for="related_id" class="block text-sm font-medium text-gray-700 mb-2">
            {{ getRelatedItemLabel() }}
          </label>
          <select
            id="related_id"
            v-model="form.related_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.related_id }"
          >
            <option value="">Select {{ form.related_type }}</option>
            <option v-for="item in relatedItems" :key="item.id" :value="item.id">
              {{ getRelatedItemDisplayName(item) }}
            </option>
          </select>
          <p v-if="errors.related_id" class="mt-1 text-sm text-red-600">{{ errors.related_id }}</p>
        </div>

        <!-- Metadata -->
        <div>
          <label for="metadata" class="block text-sm font-medium text-gray-700 mb-2">
            Additional Data (JSON)
          </label>
          <textarea
            id="metadata"
            v-model="form.metadata"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.metadata }"
            placeholder='{"key": "value"}'
          ></textarea>
          <p v-if="errors.metadata" class="mt-1 text-sm text-red-600">{{ errors.metadata }}</p>
          <p class="mt-1 text-sm text-gray-500">Optional JSON data for additional activity information</p>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <BaseButton
            type="button"
            variant="secondary"
            @click="$emit('close')"
          >
            Cancel
          </BaseButton>
          <BaseButton
            type="submit"
            variant="primary"
            :loading="loading"
          >
            {{ isEditing ? 'Update Activity' : 'Create Activity' }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { activitiesAPI, metadataAPI, contactsAPI, companiesAPI, dealsAPI } from '@/services/api'
import { success, error } from '@/utils/notifications'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

// Props
const props = defineProps({
  activity: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'saved'])

// Reactive data
const loading = ref(false)
const owners = ref([])
const relatedItems = ref([])
const errors = reactive({})

// Form data
const form = reactive({
  subject: '',
  type: '',
  description: '',
  scheduled_at: '',
  status: 'scheduled',
  owner_id: '',
  related_type: '',
  related_id: '',
  metadata: ''
})

// Computed
const isEditing = computed(() => !!props.activity)

// Watch for activity prop changes
watch(() => props.activity, (newActivity) => {
  if (newActivity) {
    // Populate form with activity data
    Object.assign(form, {
      subject: newActivity.subject || '',
      type: newActivity.type || '',
      description: newActivity.description || '',
      scheduled_at: newActivity.scheduled_at ? newActivity.scheduled_at.slice(0, 16) : '',
      status: newActivity.status || 'scheduled',
      owner_id: newActivity.owner_id || '',
      related_type: newActivity.related_type || '',
      related_id: newActivity.related_id || '',
      metadata: newActivity.metadata ? JSON.stringify(newActivity.metadata, null, 2) : ''
    })
  } else {
    // Reset form
    Object.assign(form, {
      subject: '',
      type: '',
      description: '',
      scheduled_at: '',
      status: 'scheduled',
      owner_id: '',
      related_type: '',
      related_id: '',
      metadata: ''
    })
  }
  // Clear errors
  Object.keys(errors).forEach(key => delete errors[key])
}, { immediate: true })

// Load metadata
const loadMetadata = async () => {
  try {
    const response = await metadataAPI.getOwners()
    owners.value = response.data.data || []
  } catch (err) {
    console.error('Load metadata error:', err)
  }
}

// Load related items
const loadRelatedItems = async (type) => {
  if (!type) {
    relatedItems.value = []
    return
  }

  try {
    let response
    switch (type) {
      case 'contact':
        response = await contactsAPI.getContacts({ limit: 100 })
        break
      case 'company':
        response = await companiesAPI.getCompanies({ limit: 100 })
        break
      case 'deal':
        response = await dealsAPI.getDeals({ limit: 100 })
        break
      default:
        relatedItems.value = []
        return
    }
    relatedItems.value = response.data.data || []
  } catch (err) {
    console.error('Load related items error:', err)
    relatedItems.value = []
  }
}

// Related type change handler
const onRelatedTypeChange = () => {
  form.related_id = ''
  loadRelatedItems(form.related_type)
}

// Get related item label
const getRelatedItemLabel = () => {
  const labels = {
    contact: 'Contact',
    company: 'Company',
    deal: 'Deal'
  }
  return labels[form.related_type] || 'Item'
}

// Get related item display name
const getRelatedItemDisplayName = (item) => {
  switch (form.related_type) {
    case 'contact':
      return `${item.first_name} ${item.last_name}`
    case 'company':
      return item.name
    case 'deal':
      return item.title
    default:
      return item.name || item.title || 'Unknown'
  }
}

// Validate form
const validateForm = () => {
  const newErrors = {}

  if (!form.subject?.trim()) {
    newErrors.subject = 'Subject is required'
  }

  if (!form.type) {
    newErrors.type = 'Type is required'
  }

  if (!form.status) {
    newErrors.status = 'Status is required'
  }

  if (form.metadata && form.metadata.trim()) {
    try {
      JSON.parse(form.metadata)
    } catch (e) {
      newErrors.metadata = 'Invalid JSON format'
    }
  }

  // Clear previous errors and set new ones
  Object.keys(errors).forEach(key => delete errors[key])
  Object.assign(errors, newErrors)

  return Object.keys(newErrors).length === 0
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    const formData = {
      ...form,
      metadata: form.metadata ? JSON.parse(form.metadata) : null
    }

    if (isEditing.value) {
      await activitiesAPI.updateActivity(props.activity.id, formData)
      success('Activity updated successfully')
    } else {
      await activitiesAPI.createActivity(formData)
      success('Activity created successfully')
    }

    emit('saved')
  } catch (err) {
    if (err.response?.status === 422) {
      // Validation errors
      const validationErrors = err.response.data.errors
      Object.keys(validationErrors).forEach(key => {
        errors[key] = validationErrors[key][0]
      })
    } else {
      error(isEditing.value ? 'Failed to update activity' : 'Failed to create activity')
    }
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  loadMetadata()
})
</script>
