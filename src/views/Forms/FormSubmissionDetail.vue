<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Submission Details</h1>
            <p class="text-sm text-gray-600 mt-1">View submission information</p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="outline"
              @click="goBack"
            >
              Back to Form
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
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading submission</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="loadSubmission">
            Try Again
          </BaseButton>
        </div>
      </div>

      <!-- Submission Details -->
      <div v-else-if="submission" class="space-y-6">
        <!-- Submission Info Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Submission #{{ submission.id }}</h2>
            <span class="text-sm text-gray-500">{{ formatDate(submission.created_at) }}</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt class="text-sm font-medium text-gray-500">Form ID</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ submission.form_id }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Contact ID</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ submission.contact_id || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">IP Address</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ submission.ip_address || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">User Agent</dt>
              <dd class="mt-1 text-sm text-gray-900 truncate" :title="submission.user_agent">
                {{ submission.user_agent || 'N/A' }}
              </dd>
            </div>
          </div>
        </div>

        <!-- Form Data Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Form Data</h3>
          
          <div v-if="!submission.payload || Object.keys(submission.payload).length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No form data</h3>
            <p class="mt-1 text-sm text-gray-500">This submission contains no form data.</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(value, key) in submission.payload"
              :key="key"
              class="flex items-start justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex-1">
                <dt class="text-sm font-medium text-gray-500 capitalize">{{ formatFieldName(key) }}</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <span v-if="typeof value === 'boolean'">
                    <span :class="value ? 'text-green-600' : 'text-red-600'">
                      {{ value ? 'Yes' : 'No' }}
                    </span>
                  </span>
                  <span v-else-if="value === null || value === undefined">
                    <span class="text-gray-400">Not provided</span>
                  </span>
                  <span v-else>{{ value }}</span>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <!-- Metadata Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Metadata</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt class="text-sm font-medium text-gray-500">Created At</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(submission.created_at) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Updated At</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(submission.updated_at) }}</dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { formsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'

interface FormSubmission {
  id: number
  form_id: number
  contact_id?: number
  payload: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
  updated_at: string
}

const route = useRoute()
const router = useRouter()
const { error: showError } = useNotifications()

// Reactive data
const loading = ref(true)
const error = ref<string | null>(null)
const submission = ref<FormSubmission | null>(null)

// Methods
const loadSubmission = async () => {
  loading.value = true
  error.value = null
  
  try {
    const formId = route.params.formId
    const submissionId = route.params.submissionId
    const response = await formsAPI.getFormSubmission(formId as string, submissionId as string)
    
    // Handle nested data structure: response.data.data
    submission.value = response.data.data || response.data
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Failed to load submission'
    showError('Failed to load submission')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push(`/forms/${route.params.formId}/submissions`)
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-'
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return '-'
  }
}

const formatFieldName = (fieldName: string) => {
  // Convert snake_case to Title Case
  return fieldName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Lifecycle
onMounted(() => {
  loadSubmission()
})
</script>
