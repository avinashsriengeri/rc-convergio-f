<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="close"
      ></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <form @submit.prevent="handleSubmit">
          <!-- Header -->
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ isEditing ? 'Edit Assignment Rule' : 'Create Assignment Rule' }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ isEditing ? 'Update the assignment rule configuration.' : 'Configure a new automatic assignment rule.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Content -->
          <div class="bg-white px-4 pb-4 sm:p-6 sm:pt-0">
            <div class="space-y-6">
              <!-- Rule Name -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">
                  Rule Name *
                </label>
                <div class="mt-1">
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    :class="{ 'border-red-300': errors.name }"
                    placeholder="Enter rule name"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <div class="mt-1">
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="3"
                    required
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    :class="{ 'border-red-300': errors.description }"
                    placeholder="Describe what this rule does"
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
                </div>
              </div>

              <!-- Priority -->
              <div>
                <label for="priority" class="block text-sm font-medium text-gray-700">
                  Priority *
                </label>
                <div class="mt-1">
                  <input
                    id="priority"
                    v-model.number="form.priority"
                    type="number"
                    min="1"
                    required
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    :class="{ 'border-red-300': errors.priority }"
                    placeholder="1"
                  />
                  <p class="mt-1 text-sm text-gray-500">Lower numbers have higher priority (1 = highest)</p>
                  <p v-if="errors.priority" class="mt-1 text-sm text-red-600">{{ errors.priority }}</p>
                </div>
              </div>

              <!-- Criteria JSON -->
              <div>
                <label for="criteria" class="block text-sm font-medium text-gray-700">
                  Criteria (JSON) *
                </label>
                <div class="mt-1">
                  <textarea
                    id="criteria"
                    v-model="criteriaText"
                    rows="6"
                    required
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono text-sm"
                    :class="{ 'border-red-300': errors.criteria }"
                    placeholder='{"field": "source", "operator": "equals", "value": "website"}'
                  ></textarea>
                  <p class="mt-1 text-sm text-gray-500">Define the conditions for this rule in JSON format</p>
                  <p v-if="errors.criteria" class="mt-1 text-sm text-red-600">{{ errors.criteria }}</p>
                </div>
              </div>

              <!-- Action JSON -->
              <div>
                <label for="action" class="block text-sm font-medium text-gray-700">
                  Action (JSON) *
                </label>
                <div class="mt-1">
                  <textarea
                    id="action"
                    v-model="actionText"
                    rows="6"
                    required
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono text-sm"
                    :class="{ 'border-red-300': errors.action }"
                    placeholder='{"type": "assign_to_user", "user_id": 123}'
                  ></textarea>
                  <p class="mt-1 text-sm text-gray-500">Define the assignment action in JSON format</p>
                  <p v-if="errors.action" class="mt-1 text-sm text-red-600">{{ errors.action }}</p>
                </div>
              </div>

              <!-- Active Toggle -->
              <div class="flex items-center">
                <input
                  id="is_active"
                  v-model="form.is_active"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="is_active" class="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <BaseButton
              type="submit"
              :loading="loading"
              variant="primary"
              class="w-full sm:w-auto sm:ml-3"
            >
              {{ isEditing ? 'Update Rule' : 'Create Rule' }}
            </BaseButton>
            <BaseButton
              type="button"
              variant="outline"
              class="mt-3 w-full sm:mt-0 sm:w-auto"
              @click="close"
            >
              Cancel
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import { leadAssignmentService } from '@/services/leadAssignment'
import BaseButton from '@/components/ui/BaseButton.vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  rule: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'save'])

// Reactive state
const form = ref({
  name: '',
  description: '',
  priority: 1,
  criteria: {},
  action: {},
  is_active: true
})

const criteriaText = ref('')
const actionText = ref('')
const errors = ref({})

// Computed
const isEditing = computed(() => !!props.rule?.id)

// Methods
const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    priority: 1,
    criteria: {},
    action: {},
    is_active: true
  }
  criteriaText.value = ''
  actionText.value = ''
  errors.value = {}
}

const parseJsonField = (text, fieldName) => {
  try {
    if (!text.trim()) {
      return {}
    }
    return JSON.parse(text)
  } catch (error) {
    errors.value[fieldName] = 'Invalid JSON format'
    return {}
  }
}

const validateForm = () => {
  errors.value = {}
  
  // Validate JSON fields
  form.value.criteria = parseJsonField(criteriaText.value, 'criteria')
  form.value.action = parseJsonField(actionText.value, 'action')
  
  // Validate other fields
  if (!form.value.name.trim()) {
    errors.value.name = 'Rule name is required'
  }
  
  if (!form.value.description.trim()) {
    errors.value.description = 'Description is required'
  }
  
  if (!form.value.priority || form.value.priority < 1) {
    errors.value.priority = 'Priority must be a positive number'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('save', { ...form.value })
  }
}

const close = () => {
  emit('close')
}

// Watch for rule changes
watch(() => props.rule, (newRule) => {
  if (newRule) {
    form.value = {
      name: newRule.name || '',
      description: newRule.description || '',
      priority: newRule.priority || 1,
      criteria: newRule.criteria || {},
      action: newRule.action || {},
      is_active: newRule.is_active !== false
    }
    criteriaText.value = newRule.criteria ? JSON.stringify(newRule.criteria, null, 2) : ''
    actionText.value = newRule.action ? JSON.stringify(newRule.action, null, 2) : ''
  } else {
    resetForm()
  }
}, { immediate: true })

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})
</script>
