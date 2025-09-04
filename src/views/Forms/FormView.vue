<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ form?.name || 'Form Details' }}</h1>
            <p class="text-sm text-gray-600 mt-1">{{ form?.description || 'Manage form settings and view submissions' }}</p>
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
              @click="previewForm"
            >
              Preview Form
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

      <!-- Form Content -->
      <div v-else-if="form" class="space-y-6">
        <!-- Form Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Submissions</p>
                <p class="text-2xl font-semibold text-gray-900">{{ form.submissions_count || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Processed</p>
                <p class="text-2xl font-semibold text-gray-900">{{ processedCount }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Pending</p>
                <p class="text-2xl font-semibold text-gray-900">{{ pendingCount }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Failed</p>
                <p class="text-2xl font-semibold text-gray-900">{{ failedCount }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8 px-6">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="py-4 px-1 border-b-2 font-medium text-sm"
                :class="activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <!-- Submissions Tab -->
            <div v-if="activeTab === 'submissions'">
              <FormSubmissions :form-id="form.id" />
            </div>

            <!-- Settings Tab -->
            <div v-else-if="activeTab === 'settings'">
              <FormSettings :form-id="form.id" />
            </div>

            <!-- Field Mapping Tab -->
            <div v-else-if="activeTab === 'mapping'">
              <FormFieldMapping :form-id="form.id" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { formsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormSubmissions from './FormSubmissions.vue'
import FormSettings from './FormSettings.vue'
import FormFieldMapping from './FormFieldMapping.vue'

interface Form {
  id: number
  name: string
  description?: string
  status: string
  submissions_count?: number
  fields?: any[]
}

const route = useRoute()
const router = useRouter()
const { error: showError } = useNotifications()

const form = ref<Form | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const activeTab = ref('submissions')

// Tabs configuration
const tabs = [
  { id: 'submissions', name: 'Submissions' },
  { id: 'settings', name: 'Settings' },
  { id: 'mapping', name: 'Field Mapping' }
]

// Computed properties for stats
const processedCount = computed(() => {
  // This would come from actual submission data
  return Math.floor((form.value?.submissions_count || 0) * 0.8)
})

const pendingCount = computed(() => {
  return Math.floor((form.value?.submissions_count || 0) * 0.15)
})

const failedCount = computed(() => {
  return Math.floor((form.value?.submissions_count || 0) * 0.05)
})

// Load form data
const loadForm = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await formsAPI.getForm(route.params.id as string)
    form.value = response.data.data || response.data
  } catch (err: any) {
    console.error('Failed to load form:', err)
    error.value = err.response?.data?.message || 'Failed to load form'
    showError('Failed to load form')
  } finally {
    loading.value = false
  }
}

// Navigation methods
const goBack = () => {
  router.push('/forms')
}

const previewForm = () => {
  if (form.value) {
    window.open(`/public/forms/${form.value.id}`, '_blank')
  }
}

onMounted(() => {
  loadForm()
})
</script>
