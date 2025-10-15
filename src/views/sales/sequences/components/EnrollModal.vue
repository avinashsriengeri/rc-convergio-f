<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Enroll Target</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="enrollTarget" class="space-y-4">
          <!-- Target Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Target Type *</label>
            <select
              v-model="form.target_type"
              @change="onTargetTypeChange"
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

          <!-- Target Selection -->
          <div v-if="form.target_type">
            <label class="block text-sm font-medium text-gray-700 mb-1">Select {{ form.target_type }} *</label>
            <select
              v-model="form.target_id"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              :class="{ 'border-red-300': errors.target_id }"
            >
              <option value="">Select {{ form.target_type }}</option>
              <option v-for="item in availableTargets" :key="item.id" :value="item.id">
                {{ item.name || item.title || `${item.first_name} ${item.last_name}` }}
              </option>
            </select>
            <p v-if="errors.target_id" class="mt-1 text-sm text-red-600">{{ errors.target_id }}</p>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Optional notes about this enrollment"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            ></textarea>
          </div>

          <!-- Sequence Info -->
          <div v-if="sequence" class="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-blue-700">
                  <strong>{{ sequence.name }}</strong> has {{ sequence.steps?.length || 0 }} steps and targets {{ sequence.target_type }}s.
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-3 pt-4">
            <BaseButton
              type="button"
              variant="outline"
              @click="$emit('close')"
            >
              Cancel
            </BaseButton>
            <BaseButton
              type="submit"
              variant="primary"
              :loading="loading"
            >
              Enroll Target
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { contactsAPI, dealsAPI, companiesAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  sequence: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['save', 'close'])

// Reactive data
const form = ref({
  target_type: '',
  target_id: '',
  notes: ''
})

const errors = ref({})
const loading = ref(false)
const availableTargets = ref([])

// Computed
const targetTypeLabel = computed(() => {
  const labels = {
    contact: 'Contact',
    deal: 'Deal',
    company: 'Company'
  }
  return labels[form.value.target_type] || form.value.target_type
})

// Methods
const onTargetTypeChange = () => {
  form.value.target_id = ''
  availableTargets.value = []
  loadTargets()
}

const loadTargets = async () => {
  if (!form.value.target_type) return
  
  loading.value = true
  
  try {
    let response
    switch (form.value.target_type) {
      case 'contact':
        response = await contactsAPI.getContacts({ per_page: 100 })
        break
      case 'deal':
        response = await dealsAPI.getDeals({ per_page: 100 })
        break
      case 'company':
        response = await companiesAPI.getCompanies({ per_page: 100 })
        break
    }
    
    availableTargets.value = response.data.data || []
  } catch (error) {
    console.error('Error loading targets:', error)
    availableTargets.value = []
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.target_type) {
    errors.value.target_type = 'Target type is required'
  }
  
  if (!form.value.target_id) {
    errors.value.target_id = `Please select a ${form.value.target_type}`
  }
  
  return Object.keys(errors.value).length === 0
}

const enrollTarget = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    const selectedTarget = availableTargets.value.find(t => t.id == form.value.target_id)
    
    const enrollmentData = {
      target_type: form.value.target_type,
      target_id: form.value.target_id,
      target_name: selectedTarget?.name || selectedTarget?.title || `${selectedTarget?.first_name} ${selectedTarget?.last_name}`,
      notes: form.value.notes
    }
    
    emit('save', enrollmentData)
  } catch (error) {
    console.error('Error enrolling target:', error)
  } finally {
    loading.value = false
  }
}

// Watch for target type changes
watch(() => form.value.target_type, () => {
  onTargetTypeChange()
})

// Lifecycle
onMounted(() => {
  // Set initial target type based on sequence
  if (props.sequence?.target_type) {
    form.value.target_type = props.sequence.target_type
    loadTargets()
  }
})
</script>
