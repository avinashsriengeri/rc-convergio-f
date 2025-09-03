<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Form Submissions</h1>
            <p class="text-sm text-gray-600 mt-1">View submissions for {{ form?.name || 'this form' }}</p>
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
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading submissions</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="loadSubmissions">
            Try Again
          </BaseButton>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && submissions.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
        <p class="mt-1 text-sm text-gray-500">This form hasn't received any submissions yet.</p>
      </div>

      <!-- Submissions List -->
      <div v-else class="space-y-4">
        <div
          v-for="submission in submissions"
          :key="submission.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Submission #{{ submission.id }}</h3>
              <p class="text-sm text-gray-500">{{ formatDate(submission.created_at) }}</p>
            </div>
            <div class="text-sm text-gray-500">
              IP: {{ submission.ip_address }}
            </div>
          </div>

          <!-- Submission Data -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Form Data</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="(value, key) in submission.payload"
                :key="key"
                class="flex flex-col"
              >
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ key }}</span>
                <span class="text-sm text-gray-900 mt-1">{{ value }}</span>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <BaseButton
                variant="outline"
                size="sm"
                @click="viewSubmission(submission.id)"
                class="flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </BaseButton>
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
  ip_address: string
  user_agent: string
  created_at: string
  updated_at: string
}

interface Form {
  id: number
  name: string
  status: string
}

const route = useRoute()
const router = useRouter()
const { error: showError } = useNotifications()

// Reactive data
const loading = ref(true)
const error = ref<string | null>(null)
const form = ref<Form | null>(null)
const submissions = ref<FormSubmission[]>([])

// Methods
const loadSubmissions = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Load form details
    const formResponse = await formsAPI.getForm(route.params.id as string)
    form.value = formResponse.data.data || formResponse.data
    
    // Load submissions
    const submissionsResponse = await formsAPI.getFormSubmissions(route.params.id as string)
    submissions.value = submissionsResponse.data.data || submissionsResponse.data || []
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Failed to load submissions'
    showError('Failed to load submissions')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push(`/forms/${route.params.id}`)
}

const viewSubmission = (submissionId: number) => {
  router.push(`/forms/${route.params.id}/submissions/${submissionId}`)
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Invalid Date'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (err) {
    return 'Invalid Date'
  }
}

// Lifecycle
onMounted(() => {
  loadSubmissions()
})
</script>
