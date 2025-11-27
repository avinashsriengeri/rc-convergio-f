<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? $t('common.edit_deal') : $t('common.add_deal') }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Title -->
            <div class="md:col-span-2">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('common.title') }} *
              </label>
              <BaseInput
                id="title"
                v-model="form.title"
                :error="errors.title"
                :placeholder="$t('common.enter_title')"
                required
              />
            </div>

            <!-- Description -->
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('common.description') }}
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.description }"
                :placeholder="$t('common.enter_description')"
              ></textarea>
              <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
            </div>

            <!-- Value -->
            <div>
              <label for="value" class="block text-sm font-medium text-gray-700 mb-1">
                Deal Value *
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  {{ form.currency || 'USD' }}
                </span>
                <BaseInput
                  id="value"
                  v-model="form.value"
                  :error="errors.value"
                  type="number"
                  step="0.01"
                  min="0"
                  class="pl-12"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <!-- Currency -->
            <div>
              <label for="currency" class="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                v-model="form.currency"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.currency }"
              >
                <option value="">Select Currency</option>
                <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
                  {{ currency.code }} - {{ currency.name }}
                </option>
              </select>
              <p v-if="errors.currency" class="mt-1 text-sm text-red-600">{{ errors.currency }}</p>
            </div>

            <!-- Pipeline -->
            <div>
              <label for="pipeline_id" class="block text-sm font-medium text-gray-700 mb-1">
                Pipeline *
              </label>
              <select
                id="pipeline_id"
                v-model="form.pipeline_id"
                @change="onPipelineChange"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.pipeline_id }"
                required
              >
                <option value="">Select Pipeline</option>
                <option v-for="pipeline in pipelines" :key="pipeline.id" :value="pipeline.id">
                  {{ pipeline.name }}
                </option>
              </select>
              <p v-if="errors.pipeline_id" class="mt-1 text-sm text-red-600">{{ errors.pipeline_id }}</p>
            </div>

            <!-- Stage -->
            <div>
              <label for="stage_id" class="block text-sm font-medium text-gray-700 mb-1">
                Stage *
              </label>
              <select
                id="stage_id"
                v-model="form.stage_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.stage_id }"
                required
                :disabled="!form.pipeline_id"
              >
                <option value="">Select Stage</option>
                <option v-for="stage in availableStages" :key="stage.id" :value="stage.id">
                  {{ stage.name }}
                </option>
              </select>
              <p v-if="errors.stage_id" class="mt-1 text-sm text-red-600">{{ errors.stage_id }}</p>
            </div>

            <!-- Status -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                v-model="form.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.status }"
                required
              >
                <option value="">Select Status</option>
                <option v-for="status in dealStatuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
              <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
            </div>

            <!-- Probability -->
            <div>
              <label for="probability" class="block text-sm font-medium text-gray-700 mb-1">
                Probability (%) *
              </label>
              <BaseInput
                id="probability"
                v-model="form.probability"
                :error="errors.probability"
                type="number"
                min="0"
                max="100"
                placeholder="50"
                required
              />
            </div>

            <!-- Expected Close Date -->
            <div>
              <label for="expected_close_date" class="block text-sm font-medium text-gray-700 mb-1">
                Expected Close Date
              </label>
              <BaseInput
                id="expected_close_date"
                v-model="form.expected_close_date"
                :error="errors.expected_close_date"
                type="date"
              />
            </div>

            <!-- Owner -->
            <div>
              <label for="owner_id" class="block text-sm font-medium text-gray-700 mb-1">
                Owner *
              </label>
              <select
                id="owner_id"
                v-model="form.owner_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.owner_id }"
                required
              >
                <option value="">Select Owner</option>
                <option v-for="owner in ownersList" :key="owner.id" :value="owner.id">
                  {{ owner.name }}
                </option>
              </select>
              <p v-if="errors.owner_id" class="mt-1 text-sm text-red-600">{{ errors.owner_id }}</p>
            </div>

            <!-- Contact -->
            <div>
              <label for="contact_id" class="block text-sm font-medium text-gray-700 mb-1">
                Contact
              </label>
              <select
                id="contact_id"
                v-model="form.contact_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.contact_id }"
              >
                <option value="">Select Contact</option>
                <option v-for="contact in contacts" :key="contact.id" :value="contact.id">
                  {{ contact.first_name }} {{ contact.last_name }}
                </option>
              </select>
              <p v-if="errors.contact_id" class="mt-1 text-sm text-red-600">{{ errors.contact_id }}</p>
            </div>

            <!-- Company -->
            <div>
              <label for="company_id" class="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <select
                id="company_id"
                v-model="form.company_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.company_id }"
              >
                <option value="">Select Company</option>
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>
              <p v-if="errors.company_id" class="mt-1 text-sm text-red-600">{{ errors.company_id }}</p>
            </div>

            <!-- Tags -->
            <div class="md:col-span-2">
              <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <BaseInput
                id="tags"
                v-model="form.tags"
                :error="errors.tags"
                placeholder="Enter tags separated by commas"
              />
              <p class="mt-1 text-sm text-gray-500">Separate tags with commas (e.g., hot lead, enterprise, urgent)</p>
            </div>
          </div>

          <!-- Error Display -->
          <div v-if="submitError" class="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {{ submitError }}
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <BaseButton
              type="button"
              variant="secondary"
              @click="$emit('close')"
              :disabled="loading"
            >
              Cancel
            </BaseButton>
            <BaseButton
              type="submit"
              variant="primary"
              :loading="loading"
            >
              {{ isEditing ? 'Update Deal' : 'Create Deal' }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { dealsAPI, stagesAPI } from '@/services/api'
import { useAuth } from '@/composables/useAuth'
import { useDealsStore } from '@/stores/deals'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const props = defineProps({
  deal: {
    type: Object,
    default: null
  },
  pipelines: {
    type: Array,
    default: () => []
  },
  stages: {
    type: Array,
    default: () => []
  },
  contacts: {
    type: Array,
    default: () => []
  },
  companies: {
    type: Array,
    default: () => []
  },
  owners: {
    type: Array,
    default: () => []
  },
  dealStatuses: {
    type: Array,
    default: () => []
  },
  currencies: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'saved'])

// Auth composable
const { user: currentUser } = useAuth()

// Deals store
const dealsStore = useDealsStore()

// Reactive data
const loading = ref(false)
const submitError = ref('')
const errors = reactive({})
const availableStages = ref([])

const form = reactive({
  title: '',
  description: '',
  value: '',
  currency: 'USD',
  pipeline_id: '',
  stage_id: '',
  status: '',
  probability: 50,
  expected_close_date: '',
  owner_id: '',
  contact_id: '',
  company_id: '',
  tags: ''
})

// Computed
const isEditing = computed(() => !!props.deal)

// Owners list from backend API response
const ownersList = computed(() => {
  return props.owners || []
})


// Get current user as array for dropdown compatibility
const currentUserAsArray = computed(() => {
  if (currentUser.value && currentUser.value.id) {
    return [{
      id: currentUser.value.id,
      name: currentUser.value.name || 'Current User',
      email: currentUser.value.email || '',
      role: currentUser.value.role || 'user'
    }]
  }
  return []
})

// Watch for deal changes to populate form
watch(() => props.deal, (newDeal) => {
  if (newDeal) {
    form.title = newDeal.title || ''
    form.description = newDeal.description || ''
    form.value = newDeal.value || ''
    form.currency = newDeal.currency || 'USD'
    form.pipeline_id = newDeal.pipeline_id || ''
    form.stage_id = newDeal.stage_id || ''
    form.status = newDeal.status || ''
    form.probability = newDeal.probability || 50
    form.expected_close_date = newDeal.expected_close_date ? newDeal.expected_close_date.split('T')[0] : ''
    form.owner_id = newDeal.owner_id || ''
    form.contact_id = newDeal.contact_id || ''
    form.company_id = newDeal.company_id || ''
    form.tags = newDeal.tags || ''
    
    // Load stages for the selected pipeline
    if (form.pipeline_id) {
      loadStagesForPipeline(form.pipeline_id)
    }
  } else {
    // Reset form for new deal
    Object.keys(form).forEach(key => {
      if (key === 'currency') {
        form[key] = 'USD'
      } else if (key === 'probability') {
        form[key] = 50
      } else {
        form[key] = ''
      }
    })
    availableStages.value = []
    
    // Auto-select current user as owner for new deals
    if (currentUser.value && currentUser.value.id) {
      form.owner_id = currentUser.value.id
    }
  }
  // Clear errors
  Object.keys(errors).forEach(key => delete errors[key])
  submitError.value = ''
}, { immediate: true })

// Methods
const loadStagesForPipeline = async (pipelineId) => {
  try {
    const response = await stagesAPI.getStagesByPipeline(pipelineId)
    availableStages.value = response.data.data
  } catch (error) {
    console.error('Error loading stages:', error)
    availableStages.value = []
  }
}

const onPipelineChange = () => {
  form.stage_id = ''
  if (form.pipeline_id) {
    loadStagesForPipeline(form.pipeline_id)
  } else {
    availableStages.value = []
  }
}

const checkDuplicateDealName = (name, pipelineId, excludeId) => {
  const normalizedName = name.trim().toLowerCase()
  const duplicates = dealsStore.deals.filter(deal => {
    // Skip if it's the same deal being edited
    if (excludeId && deal.id === excludeId) return false
    // Only check within the same pipeline
    if (deal.pipeline_id !== parseInt(pipelineId)) return false
    return deal.title.toLowerCase() === normalizedName
  })
  
  return {
    isDuplicate: duplicates.length > 0,
    duplicates
  }
}

const validateForm = () => {
  const newErrors = {}
  
  if (!form.title.trim()) {
    newErrors.title = 'Deal title is required'
  }
  
  if (!form.value || form.value <= 0) {
    newErrors.value = 'Deal value must be greater than 0'
  }
  
  if (!form.pipeline_id) {
    newErrors.pipeline_id = 'Pipeline is required'
  }
  
  if (!form.stage_id) {
    newErrors.stage_id = 'Stage is required'
  }
  
  if (!form.status) {
    newErrors.status = 'Status is required'
  }
  
  if (!form.probability || form.probability < 0 || form.probability > 100) {
    newErrors.probability = 'Probability must be between 0 and 100'
  }
  
  if (!form.owner_id) {
    newErrors.owner_id = 'Owner is required'
  }
  
  if (form.expected_close_date && new Date(form.expected_close_date) < new Date()) {
    newErrors.expected_close_date = 'Expected close date cannot be in the past'
  }
  
  return newErrors
}

const handleSubmit = async () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])
  submitError.value = ''
  
  // Validate form
  const validationErrors = validateForm()
  if (Object.keys(validationErrors).length > 0) {
    Object.assign(errors, validationErrors)
    return
  }
  
  // Check for duplicates (within same pipeline only)
  const dealIdToExclude = isEditing.value ? props.deal?.id : undefined
  const duplicateCheck = checkDuplicateDealName(form.title, form.pipeline_id, dealIdToExclude)
  
  if (duplicateCheck.isDuplicate) {
    errors.title = 'A deal with this name already exists in this pipeline'
    return
  }
  
  loading.value = true
  
  try {
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      value: parseFloat(form.value),
      currency: form.currency,
      pipeline_id: parseInt(form.pipeline_id),
      stage_id: parseInt(form.stage_id),
      status: form.status,
      probability: parseInt(form.probability),
      expected_close_date: form.expected_close_date || null,
      owner_id: parseInt(form.owner_id),
      contact_id: form.contact_id ? parseInt(form.contact_id) : null,
      company_id: form.company_id ? parseInt(form.company_id) : null,
      tags: form.tags.trim() || null
    }
    
    if (isEditing.value) {
      await dealsAPI.updateDeal(props.deal.id, data)
    } else {
      await dealsAPI.createDeal(data)
    }
    
    emit('saved')
  } catch (error) {
    if (error.response?.status === 422) {
      // Validation errors from backend
      const validationErrors = error.response.data.errors
      Object.keys(validationErrors).forEach(key => {
        errors[key] = validationErrors[key][0]
      })
    } else {
      submitError.value = error.response?.data?.message || 'An error occurred while saving the deal'
    }
  } finally {
    loading.value = false
  }
}
</script>
