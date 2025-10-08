<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ isEdit ? 'Edit Sequence' : 'Create Sequence' }}
          </h1>
          <p class="text-gray-600">
            {{ isEdit ? 'Update your sequence settings and steps' : 'Set up a new automated outreach sequence' }}
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <BaseButton
            variant="outline"
            @click="cancel"
          >
            Cancel
          </BaseButton>
          <BaseButton
            variant="primary"
            @click="saveSequence"
            :loading="loading"
          >
            {{ isEdit ? 'Update Sequence' : 'Create Sequence' }}
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Form -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Sequence Details</h3>
          
          <div class="space-y-6">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Enter sequence name"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                :class="{ 'border-red-300': errors.name }"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Enter sequence description"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              ></textarea>
            </div>

            <!-- Target Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Target Type *</label>
              <select
                v-model="form.target_type"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                :class="{ 'border-red-300': errors.target_type }"
              >
                <option value="">Select target type</option>
                <option value="contact">Contact</option>
                <option value="deal">Deal</option>
                <option value="company">Company</option>
              </select>
              <p v-if="errors.target_type" class="mt-1 text-sm text-red-600">{{ errors.target_type }}</p>
            </div>

            <!-- Is Active Toggle -->
            <div class="flex items-center">
              <input
                v-model="form.is_active"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">
                Active sequence
              </label>
            </div>
          </div>
        </div>

        <!-- Steps Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Sequence Steps</h3>
            <BaseButton
              variant="primary"
              size="sm"
              @click="addStep"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Step
            </BaseButton>
          </div>

          <!-- Steps List -->
          <div v-if="form.steps && form.steps.length > 0" class="space-y-4">
            <div
              v-for="(step, index) in form.steps"
              :key="step.id || index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <span class="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {{ index + 1 }}
                  </span>
                  <span class="text-sm font-medium text-gray-900">{{ getStepTypeLabel(step.action_type) }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="editStep(step, index)"
                    class="text-indigo-600 hover:text-indigo-800"
                    title="Edit Step"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="removeStep(index)"
                    class="text-red-600 hover:text-red-800"
                    title="Remove Step"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">Delay:</span>
                  <span class="ml-1 font-medium">{{ formatDelayDisplay(step.delay_hours) }}</span>
                </div>
                <div v-if="step.action_type === 'email'">
                  <span class="text-gray-500">Template:</span>
                  <span class="ml-1 font-medium">{{ getTemplateName(step.email_template_id) }}</span>
                </div>
                <div v-if="step.action_type === 'task'">
                  <span class="text-gray-500">Task:</span>
                  <span class="ml-1 font-medium">{{ step.task_title || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty Steps State -->
          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No steps added</h3>
            <p class="mt-1 text-sm text-gray-500">Add steps to create your sequence.</p>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Sequence Info</h3>
          
          <div class="space-y-4 text-sm">
            <div>
              <span class="text-gray-500">Steps:</span>
              <span class="ml-2 font-medium">{{ form.steps?.length || 0 }}</span>
            </div>
            <div>
              <span class="text-gray-500">Status:</span>
              <span class="ml-2 font-medium" :class="form.is_active ? 'text-green-600' : 'text-gray-600'">
                {{ form.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div v-if="isEdit">
              <span class="text-gray-500">Created:</span>
              <span class="ml-2 font-medium">{{ formatDate(sequence?.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step Modal -->
    <StepModal
      v-if="showStepModal"
      :step="selectedStep"
      :is-edit="isEditStep"
      @save="handleSaveStep"
      @close="showStepModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSequencesStore } from '@/stores/sequencesStore'
import { campaignsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import StepModal from './components/StepModal.vue'

const router = useRouter()
const route = useRoute()
const sequencesStore = useSequencesStore()

// Reactive data
const form = ref({
  name: '',
  description: '',
  target_type: '',
  is_active: true,
  steps: []
})

const templatesCache = ref([])

const errors = ref({})
const loading = ref(false)
const showStepModal = ref(false)
const selectedStep = ref(null)
const isEditStep = ref(false)
const stepIndex = ref(-1)

// Computed
const isEdit = computed(() => !!route.params.id)
const sequence = computed(() => sequencesStore.selectedSequence)

// Methods
const loadSequence = async () => {
  if (isEdit.value) {
    try {
      await sequencesStore.getSequence(route.params.id)
      if (sequence.value) {
        form.value = {
          name: sequence.value.name || '',
          description: sequence.value.description || '',
          target_type: sequence.value.target_type || '',
          is_active: sequence.value.is_active ?? true,
          steps: sequence.value.steps || []
        }
      }
    } catch (error) {
      console.error('Error loading sequence:', error)
      router.push('/sales/sequences')
    }
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required'
  }
  
  if (!form.value.target_type) {
    errors.value.target_type = 'Target type is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const saveSequence = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    if (isEdit.value) {
      await sequencesStore.updateSequence(route.params.id, form.value)
    } else {
      await sequencesStore.createSequence(form.value)
    }
    
    router.push('/sales/sequences')
  } catch (error) {
    console.error('Error saving sequence:', error)
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  router.push('/sales/sequences')
}

const addStep = () => {
  selectedStep.value = null
  isEditStep.value = false
  stepIndex.value = -1
  showStepModal.value = true
}

const editStep = (step, index) => {
  selectedStep.value = { ...step }
  isEditStep.value = true
  stepIndex.value = index
  showStepModal.value = true
}

const removeStep = (index) => {
  form.value.steps.splice(index, 1)
}

const handleSaveStep = (stepData) => {
  if (isEditStep.value && stepIndex.value >= 0) {
    // Update existing step
    form.value.steps[stepIndex.value] = { ...stepData }
  } else {
    // Add new step
    form.value.steps.push({ ...stepData })
  }
  
  showStepModal.value = false
}

const getStepTypeLabel = (actionType) => {
  const labels = {
    email: 'Email',
    task: 'Task',
    wait: 'Wait'
  }
  return labels[actionType] || actionType
}

const formatDelayDisplay = (delayHours) => {
  if (!delayHours || delayHours === 0) return '0 hours'
  
  const days = Math.floor(delayHours / 24)
  const hours = Math.floor(delayHours % 24)
  const minutes = Math.round((delayHours % 1) * 60)
  
  let result = []
  if (days > 0) result.push(`${days} day${days > 1 ? 's' : ''}`)
  if (hours > 0) result.push(`${hours} hour${hours > 1 ? 's' : ''}`)
  if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
  
  return result.join(', ') || '0 hours'
}

const getTemplateName = (templateId) => {
  if (!templateId) return 'N/A'
  
  const template = templatesCache.value.find(t => t.id === templateId)
  return template?.name || `Template #${templateId}`
}

const loadTemplates = async () => {
  if (templatesCache.value.length > 0) return // Already loaded
  
  try {
    const response = await campaignsAPI.getTemplates()
    templatesCache.value = response.data.data || response.data || []
  } catch (error) {
    console.error('Error loading templates:', error)
    templatesCache.value = []
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

// Lifecycle
onMounted(async () => {
  // Load templates first
  await loadTemplates()
  
  loadSequence()
})
</script>
