<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">Form Submissions</h3>
        <div class="flex items-center space-x-3">
          <BaseButton
            variant="secondary"
            size="sm"
            @click="refreshSubmissions"
            :loading="loading"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Submissions Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submission ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Owner
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading" class="animate-pulse">
            <td colspan="7" class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-gray-200 rounded"></div>
                <div class="w-24 h-4 bg-gray-200 rounded"></div>
                <div class="w-32 h-4 bg-gray-200 rounded"></div>
                <div class="w-20 h-4 bg-gray-200 rounded"></div>
                <div class="w-24 h-4 bg-gray-200 rounded"></div>
                <div class="w-32 h-4 bg-gray-200 rounded"></div>
                <div class="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            </td>
          </tr>
          
          <tr v-else-if="submissions.length === 0" class="text-center">
            <td colspan="7" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <svg class="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p class="text-lg font-medium">No submissions yet</p>
                <p class="text-sm">When users submit this form, their responses will appear here.</p>
              </div>
            </td>
          </tr>
          
          <tr v-else v-for="submission in submissions" :key="submission.id" class="hover:bg-gray-50">
            <!-- Submission ID -->
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              #{{ submission.id }}
            </td>
            
            <!-- Contact -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="submission.contact_id" class="flex items-center space-x-2">
                <router-link
                  :to="`/contacts/${submission.contact_id}`"
                  class="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  {{ getContactDisplay(submission) }}
                </router-link>
              </div>
              <span v-else class="text-sm text-gray-400">-</span>
            </td>
            
            <!-- Company -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="submission.company_id" class="flex items-center space-x-2">
                <router-link
                  :to="`/companies/${submission.company_id}`"
                  class="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  {{ getCompanyDisplay(submission) }}
                </router-link>
              </div>
              <span v-else class="text-sm text-gray-400">-</span>
            </td>
            
            <!-- Status -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getStatusBadgeClass(submission)"
              >
                {{ getStatusText(submission) }}
              </span>
            </td>
            
            <!-- Owner -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="submission.owner_id" class="text-sm text-gray-900">
                {{ submission.owner_id }}
              </span>
              <span v-else class="text-sm text-gray-400">-</span>
            </td>
            
            <!-- Submitted -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(submission.created_at) }}
            </td>
            
            <!-- Actions -->
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center space-x-2">
                <BaseButton
                  v-if="submission.status !== 'processed'"
                  variant="secondary"
                  size="sm"
                  @click="reprocessSubmission(submission.id)"
                  :loading="reprocessingId === submission.id"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reprocess
                </BaseButton>
                <router-link
                  :to="`/forms/${formId}/submissions/${submission.id}`"
                  class="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View Details
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { formsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'

interface Submission {
  id: number
  payload: Record<string, any>
  contact_id?: number
  company_id?: number
  owner_id?: number
  processed_at?: string
  status?: string
  created_at: string
  updated_at: string
}

const route = useRoute()
const { success, error: showError } = useNotifications()

const formId = computed(() => parseInt(route.params.id as string))
const submissions = ref<Submission[]>([])
const loading = ref(false)
const reprocessingId = ref<number | null>(null)

// Load submissions
const loadSubmissions = async () => {
  loading.value = true
  try {
    const response = await formsAPI.getFormSubmissions(formId.value)
    submissions.value = response.data.data || response.data || []
  } catch (err) {
    console.error('Failed to load submissions:', err)
    showError('Failed to load form submissions')
    submissions.value = []
  } finally {
    loading.value = false
  }
}

// Refresh submissions
const refreshSubmissions = () => {
  loadSubmissions()
}

// Reprocess submission
const reprocessSubmission = async (submissionId: number) => {
  reprocessingId.value = submissionId
  try {
    const response = await formsAPI.reprocessSubmission(formId.value, submissionId)
    success('Submission reprocessed successfully')
    
    // Attempt to extract contact id from various response shapes
    const respData: any = (response && response.data && response.data.data) ? response.data.data : (response && response.data) ? response.data : {}
    const contactIdFromResponse: number | null = respData.contact_id || (respData.contact && respData.contact.id) || null

    // Update the matching submission locally if found
    const submission = submissions.value.find(s => s.id === submissionId)
    if (submission) {
      if (contactIdFromResponse && !submission.contact_id) {
        submission.contact_id = contactIdFromResponse
      }
      if (respData.status) {
        submission.status = respData.status
      } else if (contactIdFromResponse) {
        submission.status = 'processed'
      }
    }

    // If a contact was created/attached, notify Contacts page to refresh
    if (contactIdFromResponse) {
      // Dispatch both events for compatibility
      window.dispatchEvent(new CustomEvent('contact-created', {
        detail: {
          contact_id: contactIdFromResponse,
          submission_id: submissionId,
          form_id: formId.value
        }
      }))
      window.dispatchEvent(new CustomEvent('contacts-list-update', {
        detail: {
          action: 'contact-created',
          contact_id: contactIdFromResponse,
          submission_id: submissionId,
          form_id: formId.value
        }
      }))
    }
    
    // Refresh the submissions list to show updated status
    await loadSubmissions()
  } catch (err) {
    console.error('Failed to reprocess submission:', err)
    showError('Failed to reprocess submission')
  } finally {
    reprocessingId.value = null
  }
}

// Helper functions
const getContactDisplay = (submission: Submission): string => {
  if (submission.payload.first_name || submission.payload.last_name) {
    return `${submission.payload.first_name || ''} ${submission.payload.last_name || ''}`.trim()
  }
  if (submission.payload.email) {
    return submission.payload.email
  }
  return `Contact #${submission.contact_id}`
}

const getCompanyDisplay = (submission: Submission): string => {
  if (submission.payload.company_name) {
    return submission.payload.company_name
  }
  if (submission.payload.domain) {
    return submission.payload.domain
  }
  return `Company #${submission.company_id}`
}

const getStatusBadgeClass = (submission: Submission): string => {
  if (submission.status === 'processed') return 'bg-green-100 text-green-800'
  if (submission.status === 'failed') return 'bg-red-100 text-red-800'
  if (submission.status === 'pending') return 'bg-yellow-100 text-yellow-800'
  // If no status but has processed_at, treat as processed
  if (submission.processed_at) return 'bg-green-100 text-green-800'
  // Default to pending if no status and no processed_at
  return 'bg-yellow-100 text-yellow-800'
}

const getStatusText = (submission: Submission): string => {
  if (submission.status === 'processed') return 'Processed'
  if (submission.status === 'failed') return 'Failed'
  if (submission.status === 'pending') return 'Pending'
  // If no status but has processed_at, treat as processed
  if (submission.processed_at) return 'Processed'
  // Default to pending if no status and no processed_at
  return 'Pending'
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

onMounted(() => {
  loadSubmissions()
})
</script>
