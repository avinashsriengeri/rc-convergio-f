<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Forms</h1>
            <p class="text-sm text-gray-600 mt-1">Create and manage lead capture forms</p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="secondary"
              @click="refreshForms"
              :loading="loading"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="createForm"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Form
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
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading forms</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="refreshForms">
            Try Again
          </BaseButton>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && forms.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No forms found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first lead capture form.</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="createForm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Form
          </BaseButton>
        </div>
      </div>

      <!-- Forms Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="form in forms"
          :key="form.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
        >
          <!-- Form Header -->
          <div class="p-4 border-b border-gray-200 flex-shrink-0">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <h3 class="text-base font-semibold text-gray-900 leading-tight mb-2 break-words">
                  {{ form.name }}
                </h3>
                <p class="text-xs text-gray-500 leading-relaxed">
                  {{ form.fields?.length || 0 }} fields • {{ getFieldTypesSummary(form.fields) }}
                </p>
              </div>
              <div class="flex-shrink-0">
                <span
                  v-if="form.status"
                  :class="{
                    'bg-green-50 text-green-700 border-green-200': form.status === 'active',
                    'bg-yellow-50 text-yellow-700 border-yellow-200': form.status === 'draft',
                    'bg-gray-50 text-gray-700 border-gray-200': form.status === 'inactive'
                  }"
                  class="px-2 py-1 text-xs font-medium rounded-full border"
                >
                  {{ form.status.charAt(0).toUpperCase() + form.status.slice(1) }}
                </span>
                <span v-else class="px-2 py-1 text-xs font-medium rounded-full bg-gray-50 text-gray-700 border border-gray-200">
                  Draft
                </span>
              </div>
            </div>
          </div>

          <!-- Form Stats -->
          <div class="px-4 py-3 flex-1">
            <div class="grid grid-cols-3 gap-3 text-sm text-gray-600">
              <div class="text-center">
                <div class="font-semibold text-gray-900 text-lg">{{ form.submissions_count || form.submissions || 0 }}</div>
                <div class="text-xs text-gray-500">Submissions</div>
              </div>
              <div class="text-center">
                <div class="font-semibold text-gray-900 text-lg">{{ form.fields?.length || 0 }}</div>
                <div class="text-xs text-gray-500">Fields</div>
              </div>
              <div class="text-center">
                <div class="font-semibold text-gray-900 text-sm">{{ formatDate(form.created_at) }}</div>
                <div class="text-xs text-gray-500">Created</div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg flex-shrink-0">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center space-x-1 flex-wrap">
                <BaseButton
                  variant="outline"
                  size="sm"
                  @click="viewForm(form)"
                  class="flex items-center text-xs px-2 py-1"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </BaseButton>
                <BaseButton
                  variant="outline"
                  size="sm"
                  @click="editForm(form)"
                  class="flex items-center text-xs px-2 py-1"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </BaseButton>
                <BaseButton
                  v-if="(form.submissions_count || form.submissions) > 0"
                  variant="outline"
                  size="sm"
                  @click="viewSubmissions(form)"
                  class="flex items-center text-xs px-2 py-1"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Submissions
                </BaseButton>
              </div>
              <div class="flex items-center space-x-1 flex-shrink-0">
                <button
                  @click="copyPublicLink(form)"
                  class="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors"
                  title="Copy public link"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
                <button
                  @click="deleteForm(form)"
                  class="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                  title="Delete form"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      title="Delete Form"
      :message="`Are you sure you want to delete the form '${formToDelete?.name}'? This action cannot be undone and will also delete all submissions.`"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { formsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'

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
  status?: 'active' | 'inactive' | 'draft'
  fields: FormField[]
  consent_required: boolean
  submissions_count?: number
  submissions?: number
  created_at: string
  updated_at: string
}

const router = useRouter()
const { success, error: showError } = useNotifications()

// Reactive data
const loading = ref(false)
const error = ref<string | null>(null)
const forms = ref<Form[]>([])
const showDeleteModal = ref(false)
const formToDelete = ref<Form | null>(null)

// Methods
const refreshForms = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await formsAPI.getForms()
    forms.value = response.data.data || response.data
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Failed to load forms'
    showError('Failed to load forms')
  } finally {
    loading.value = false
  }
}

const createForm = () => {
  router.push('/forms/create')
}

const viewForm = (form: Form) => {
  router.push(`/forms/${form.id}`)
}

const editForm = (form: Form) => {
  router.push(`/forms/${form.id}/edit`)
}

const viewSubmissions = (form: Form) => {
  router.push(`/forms/${form.id}/submissions`)
}

const copyPublicLink = async (form: Form) => {
  const publicUrl = `${window.location.origin}/public/forms/${form.id}`
  try {
    await navigator.clipboard.writeText(publicUrl)
    success('Public link copied!')
  } catch (err) {
    showError('Failed to copy link')
  }
}

const deleteForm = (form: Form) => {
  formToDelete.value = form
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!formToDelete.value) return
  
  try {
    await formsAPI.deleteForm(formToDelete.value.id)
    
    // Remove from local array
    forms.value = forms.value.filter(f => f.id !== formToDelete.value!.id)
    
    showDeleteModal.value = false
    formToDelete.value = null
    success('Form deleted successfully')
  } catch (err: any) {
    console.error('Failed to delete form:', err)
    showError('Failed to delete form')
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Invalid Date'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (err) {
    return 'Invalid Date'
  }
}

// Get summary of field types
const getFieldTypesSummary = (fields: FormField[]): string => {
  if (!fields || fields.length === 0) return 'No fields'
  
  const typeCounts: Record<string, number> = {}
  fields.forEach(field => {
    typeCounts[field.type] = (typeCounts[field.type] || 0) + 1
  })
  
  const types = Object.entries(typeCounts)
    .map(([type, count]) => `${count} ${type}`)
    .slice(0, 2) // Show max 2 types
  
  return types.join(', ')
}

// Lifecycle
onMounted(() => {
  refreshForms()
})
</script>
