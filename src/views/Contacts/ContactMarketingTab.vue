<template>
  <div class="space-y-6">
    <!-- Marketing Information -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Marketing Information</h3>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Source Information -->
          <div class="space-y-4">
            <h4 class="font-medium text-gray-700">Lead Source</h4>
            
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-500">Source</label>
                <div class="mt-1">
                  <span v-if="contact.source" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {{ contact.source }}
                  </span>
                  <span v-else class="text-sm text-gray-400">Not specified</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500">Campaign</label>
                <div class="mt-1">
                  <span v-if="contact.utm_campaign" class="text-sm text-gray-900">{{ contact.utm_campaign }}</span>
                  <span v-else class="text-sm text-gray-400">Not specified</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500">Medium</label>
                <div class="mt-1">
                  <span v-if="contact.utm_medium" class="text-sm text-gray-900">{{ contact.utm_medium }}</span>
                  <span v-else class="text-sm text-gray-400">Not specified</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- UTM Parameters -->
          <div class="space-y-4">
            <h4 class="font-medium text-gray-700">UTM Parameters</h4>
            
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-500">UTM Source</label>
                <div class="mt-1">
                  <span v-if="contact.utm_source" class="text-sm text-gray-900">{{ contact.utm_source }}</span>
                  <span v-else class="text-sm text-gray-400">Not specified</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500">UTM Term</label>
                <div class="mt-1">
                  <span v-if="contact.utm_term" class="text-sm text-gray-900">{{ contact.utm_term }}</span>
                  <span v-else class="text-sm text-gray-400">Not specified</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500">UTM Content</label>
                <div class="mt-1">
                  <span v-if="contact.utm_content" class="text-sm text-gray-900">{{ contact.utm_content }}</span>
                  <span v-else class="text-sm text-gray-400">Not specified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Additional Marketing Data -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500">Referrer URL</label>
              <div class="mt-1">
                <a v-if="contact.referrer_url" 
                   :href="contact.referrer_url" 
                   target="_blank" 
                   class="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block">
                  {{ contact.referrer_url }}
                </a>
                <span v-else class="text-sm text-gray-400">Not specified</span>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-500">Page URL</label>
              <div class="mt-1">
                <a v-if="contact.page_url" 
                   :href="contact.page_url" 
                   target="_blank" 
                   class="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block">
                  {{ contact.page_url }}
                </a>
                <span v-else class="text-sm text-gray-400">Not specified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Submissions Timeline -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Form Submissions</h3>
        <p class="text-sm text-gray-600 mt-1">Activity timeline from form submissions</p>
      </div>
      
      <div class="p-6">
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        
        <div v-else-if="submissions.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-sm text-gray-500">No form submissions found for this contact</p>
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="submission in submissions" :key="submission.id" class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h4 class="text-sm font-medium text-gray-900">
                    Form: {{ submission.form_name || `Form #${submission.form_id}` }}
                  </h4>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getStatusBadgeClass(submission)">
                    {{ getStatusText(submission) }}
                  </span>
                </div>
                
                <div class="text-sm text-gray-600 mb-3">
                  Submitted on {{ formatDate(submission.created_at) }}
                </div>
                
                <!-- Submission Data Preview -->
                <div class="bg-gray-50 rounded p-3">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div v-for="(value, key) in getSubmissionPreview(submission)" :key="key">
                      <span class="font-medium text-gray-700">{{ key }}:</span>
                      <span class="text-gray-900 ml-1">{{ value }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2 ml-4">
                <BaseButton
                  v-if="submission.status !== 'processed'"
                  variant="secondary"
                  size="sm"
                  @click="reprocessSubmission(submission.form_id, submission.id)"
                  :loading="reprocessingId === submission.id"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reprocess
                </BaseButton>
                
                <router-link
                  :to="`/forms/${submission.form_id}/submissions/${submission.id}`"
                  class="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                >
                  View Details
                </router-link>
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
import { useRoute } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { formsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'

interface Contact {
  id: number
  source?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referrer_url?: string
  page_url?: string
}

interface FormSubmission {
  id: number
  form_id: number
  form_name?: string
  payload: Record<string, any>
  status?: string
  processed_at?: string
  created_at: string
}

const route = useRoute()
const { success, error: showError } = useNotifications()

const contactId = computed(() => parseInt(route.params.id as string))
const loading = ref(false)
const submissions = ref<FormSubmission[]>([])
const reprocessingId = ref<number | null>(null)

// Contact data (passed from parent)
const contact = computed<Contact>(() => {
  // This would typically come from props or store
  // For now, using a mock contact object
  return {
    id: contactId.value,
    source: 'Request Demo Form',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'demo_request_2024',
    utm_term: 'business transformation',
    utm_content: 'demo_button',
    referrer_url: 'https://google.com/search?q=business+transformation',
    page_url: 'https://example.com/demo-request'
  }
})

// Load form submissions for this contact
const loadSubmissions = async () => {
  loading.value = true
  try {
    const response = await formsAPI.getContactFormSubmissions(contactId.value)
    submissions.value = response.data.data || response.data || []
  } catch (err) {
    console.error('Failed to load contact submissions:', err)
    showError('Failed to load form submissions')
    submissions.value = []
  } finally {
    loading.value = false
  }
}

// Reprocess submission
const reprocessSubmission = async (formId: number, submissionId: number) => {
  reprocessingId.value = submissionId
  try {
    await formsAPI.reprocessSubmission(formId, submissionId)
    success('Submission reprocessed successfully')
    await loadSubmissions() // Refresh the list
  } catch (err) {
    console.error('Failed to reprocess submission:', err)
    showError('Failed to reprocess submission')
  } finally {
    reprocessingId.value = null
  }
}

// Helper functions
const getStatusBadgeClass = (submission: FormSubmission): string => {
  if (submission.status === 'processed') return 'bg-green-100 text-green-800'
  if (submission.status === 'failed') return 'bg-red-100 text-red-800'
  if (submission.status === 'pending') return 'bg-yellow-100 text-yellow-800'
  if (submission.processed_at) return 'bg-green-100 text-green-800'
  return 'bg-yellow-100 text-yellow-800'
}

const getStatusText = (submission: FormSubmission): string => {
  if (submission.status === 'processed') return 'Processed'
  if (submission.status === 'failed') return 'Failed'
  if (submission.status === 'pending') return 'Pending'
  if (submission.processed_at) return 'Processed'
  return 'Pending'
}

const getSubmissionPreview = (submission: FormSubmission): Record<string, any> => {
  const preview: Record<string, any> = {}
  const payload = submission.payload || {}
  
  // Show first 4 fields as preview
  const keys = Object.keys(payload).slice(0, 4)
  keys.forEach(key => {
    preview[key] = payload[key]
  })
  
  return preview
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
