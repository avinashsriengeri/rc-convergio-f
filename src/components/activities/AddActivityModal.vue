<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Add Activity</h3>
          <button
            @click="$emit('cancel')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <BaseInput
              v-model="form.title"
              type="text"
              placeholder="Enter activity title"
              :error="errors.title"
              required
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter activity description"
            ></textarea>
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              v-model="form.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300': errors.type }"
              required
            >
              <option value="">Select activity type...</option>
              <option value="call">Phone Call</option>
              <option value="meeting">Meeting</option>
              <option value="email">Email</option>
              <option value="task">Task</option>
              <option value="note">Note</option>
              <option value="other">Other</option>
            </select>
            <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
          </div>

          <!-- Scheduled Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Scheduled Date *
            </label>
            <BaseInput
              v-model="form.scheduled_date"
              type="date"
              :error="errors.scheduled_date"
              required
            />
            <p v-if="errors.scheduled_date" class="mt-1 text-sm text-red-600">{{ errors.scheduled_date }}</p>
          </div>

          <!-- Scheduled Time -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Scheduled Time *
            </label>
            <BaseInput
              v-model="form.scheduled_time"
              type="time"
              :error="errors.scheduled_time"
              required
            />
            <p v-if="errors.scheduled_time" class="mt-1 text-sm text-red-600">{{ errors.scheduled_time }}</p>
          </div>

          <!-- Duration -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <BaseInput
              v-model="form.duration"
              type="number"
              placeholder="30"
              min="1"
              max="480"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional notes..."
            ></textarea>
          </div>
        </form>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 mt-6">
          <BaseButton
            type="button"
            variant="outline"
            @click="$emit('cancel')"
            :disabled="loading"
          >
            Cancel
          </BaseButton>
          <BaseButton
            type="button"
            variant="primary"
            @click="submitForm"
            :loading="loading"
          >
            Create Activity
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { activitiesAPI } from '../../services/api'
import { success, error as showError } from '../../utils/notifications'
import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'

interface Props {
  dealId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

// Reactive data
const loading = ref(false)
const errors = reactive<Record<string, string>>({})

const form = reactive({
  title: '',
  description: '',
  type: '',
  scheduled_date: '',
  scheduled_time: '',
  duration: undefined as number | undefined,
  status: 'scheduled',
  notes: '',
  deal_id: props.dealId
})

// Methods
const validateForm = () => {
  errors.title = ''
  errors.type = ''
  errors.scheduled_date = ''
  errors.scheduled_time = ''

  if (!form.title.trim()) {
    errors.title = 'Title is required'
  }

  if (!form.type) {
    errors.type = 'Type is required'
  }

  if (!form.scheduled_date) {
    errors.scheduled_date = 'Scheduled date is required'
  }

  if (!form.scheduled_time) {
    errors.scheduled_time = 'Scheduled time is required'
  }

  return Object.keys(errors).length === 0 || Object.values(errors).every(error => !error)
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  
  try {
    // Combine date and time into scheduled_at
    const scheduledAt = `${form.scheduled_date}T${form.scheduled_time}:00`
    
    const activityData = {
      subject: form.title, // Map title to subject for backend
      description: form.description || undefined,
      type: form.type,
      scheduled_at: scheduledAt,
      duration: form.duration || undefined,
      status: form.status,
      notes: form.notes || undefined,
      deal_id: props.dealId
    }

    await activitiesAPI.createActivity(activityData)
    success('Activity created successfully')
    emit('confirm')
  } catch (err: any) {
    console.error('Error creating activity:', err)
    
    // Handle validation errors
    if (err.response?.data?.errors) {
      Object.keys(err.response.data.errors).forEach(key => {
        errors[key] = err.response.data.errors[key][0]
      })
    } else {
      showError(err.response?.data?.message || 'Failed to create activity')
    }
  } finally {
    loading.value = false
  }
}
</script>

<script lang="ts">
export default {
  name: 'AddActivityModal'
}
</script>
