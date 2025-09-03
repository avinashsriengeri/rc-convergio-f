<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Form Details</h1>
            <p class="text-sm text-gray-600 mt-1">View form information and submissions</p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="outline"
              @click="goBack"
            >
              Back to Forms
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="editForm"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Form
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
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading form</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="loadForm">
            Try Again
          </BaseButton>
        </div>
      </div>

      <!-- Form Details -->
      <div v-else-if="form" class="space-y-6">
        <!-- Form Info Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">{{ form.name }}</h2>
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusBadgeClass(form.status)"
            >
              {{ form.status }}
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <dt class="text-sm font-medium text-gray-500">Created</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(form.created_at) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(form.updated_at) }}</dd>
            </div>
                               <div>
                     <dt class="text-sm font-medium text-gray-500">Submissions</dt>
                     <dd class="mt-1 text-sm text-gray-900">{{ form.submissions_count || form.submissions || 0 }}</dd>
                   </div>
          </div>

          <div v-if="form.consent_required" class="mt-4">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Consent Required
            </span>
          </div>
        </div>

        <!-- Form Fields Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Form Fields</h3>
            <span class="text-sm text-gray-500">{{ form.fields?.length || 0 }} fields</span>
          </div>

          <div v-if="!form.fields || form.fields.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No fields</h3>
            <p class="mt-1 text-sm text-gray-500">This form has no fields defined.</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(field, index) in form.fields"
              :key="field.id || index"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-medium text-gray-900">{{ field.label }}</span>
                  <span
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {{ field.type }}
                  </span>
                  <span v-if="field.required" class="text-red-500 text-xs">Required</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">Field name: {{ field.name }}</p>
                <div v-if="field.options && field.options.length > 0" class="mt-2">
                  <p class="text-xs text-gray-500">Options:</p>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <span
                      v-for="option in field.options"
                      :key="option"
                      class="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                    >
                      {{ option }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Submissions Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Form Submissions</h3>
            <span class="text-sm text-gray-500">{{ submissions.length }} submissions</span>
          </div>

          <!-- Loading Submissions -->
          <div v-if="loadingSubmissions" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>

          <!-- Empty State -->
          <div v-else-if="submissions.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
            <p class="mt-1 text-sm text-gray-500">When people submit this form, their responses will appear here.</p>
          </div>

          <!-- Submissions Table -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submission ID
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="submission in submissions" :key="submission.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{{ submission.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ submission.payload?.first_name || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ submission.payload?.last_name || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ submission.payload?.email || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ submission.payload?.phone || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(submission.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                      View
                    </BaseButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Actions Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Actions</h3>
          <div class="flex flex-wrap gap-3">
            <BaseButton
              variant="outline"
              @click="copyPublicLink"
              :disabled="form?.status === 'draft'"
              class="flex items-center"
              :title="form?.status === 'draft' ? 'Form is in draft mode and cannot be shared' : 'Copy public link'"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Copy Public Link
            </BaseButton>
            <BaseButton
              variant="outline"
              @click="previewForm"
              :disabled="form?.status === 'draft'"
              class="flex items-center"
              :title="form?.status === 'draft' ? 'Form is in draft mode and cannot be previewed' : 'Preview form'"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview Form
            </BaseButton>
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

interface FormField {
  id: string
  name: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio'
  label: string
  required: boolean
  options?: string[]
}

interface Form {
  id: number
  name: string
  status: 'active' | 'inactive' | 'draft'
  fields: FormField[]
  consent_required: boolean
  submissions_count?: number
  submissions?: number
  created_at: string
  updated_at: string
}

interface FormSubmission {
  id: number
  form_id: number
  payload: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
  updated_at: string
}

const route = useRoute()
const router = useRouter()
const { success, error: showError } = useNotifications()

// Reactive data
const loading = ref(true)
const loadingSubmissions = ref(false)
const error = ref<string | null>(null)
const form = ref<Form | null>(null)
const submissions = ref<FormSubmission[]>([])

// Methods
const loadForm = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await formsAPI.getForm(route.params.id as string)
    // Handle nested data structure: response.data.data
    form.value = response.data.data || response.data
    
    // Load submissions after form is loaded
    await loadSubmissions()
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Failed to load form'
    showError('Failed to load form')
  } finally {
    loading.value = false
  }
}

const loadSubmissions = async () => {
  if (!form.value?.id) return
  
  loadingSubmissions.value = true
  
  try {
    const response = await formsAPI.getFormSubmissions(form.value.id.toString())
    // Handle nested data structure: response.data.data
    const submissionsData = response.data.data || response.data
    submissions.value = Array.isArray(submissionsData) ? submissionsData : []
  } catch (err: any) {
    console.error('Failed to load submissions:', err)
    // Don't show error toast for submissions, just log it
    submissions.value = []
  } finally {
    loadingSubmissions.value = false
  }
}

const goBack = () => {
  router.push('/forms')
}

const editForm = () => {
  router.push(`/forms/${route.params.id}/edit`)
}

const viewSubmission = (submissionId: number) => {
  router.push(`/forms/${route.params.id}/submissions/${submissionId}`)
}

const copyPublicLink = async () => {
  const publicUrl = `${window.location.origin}/public/forms/${route.params.id}`
  try {
    await navigator.clipboard.writeText(publicUrl)
    success('Public link copied!')
  } catch (err) {
    showError('Failed to copy link')
  }
}

const previewForm = () => {
  if (form.value?.status === 'draft') {
    showError('Form is in draft mode and cannot be previewed')
    return
  }
  
  const publicUrl = `${window.location.origin}/public/forms/${route.params.id}`
  window.open(publicUrl, '_blank')
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    draft: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
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

// Lifecycle
onMounted(() => {
  loadForm()
})
</script>
