<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEdit ? 'Edit Template' : 'Add Template' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="px-6 py-4">
        <div class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Template Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              :class="{ 'border-red-300': errors.name }"
              placeholder="Enter template name"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter template description"
            ></textarea>
          </div>

          <!-- Layout -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Layout <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.layout"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              :class="{ 'border-red-300': errors.layout }"
            >
              <option value="">Select Layout</option>
              <option value="default">Default</option>
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
            </select>
            <p v-if="errors.layout" class="mt-1 text-sm text-red-600">{{ errors.layout }}</p>
          </div>

          <!-- Is Default -->
          <div class="flex items-center">
            <input
              v-model="form.is_default"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">
              Set as default template
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
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
            :loading="saving"
          >
            {{ isEdit ? 'Update Template' : 'Create Template' }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  template: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'close'])

// Reactive data
const saving = ref(false)
const errors = ref({})

const form = reactive({
  name: '',
  description: '',
  layout: '',
  is_default: false
})

// Methods
const validateForm = () => {
  errors.value = {}
  
  if (!form.name.trim()) {
    errors.value.name = 'Template name is required'
  }
  
  if (!form.layout) {
    errors.value.layout = 'Layout is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  saving.value = true
  try {
    emit('save', { ...form })
  } catch (error) {
    console.error('Error saving template:', error)
  } finally {
    saving.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (props.template && props.isEdit) {
    Object.assign(form, {
      name: props.template.name || '',
      description: props.template.description || '',
      layout: props.template.layout || '',
      is_default: props.template.is_default || false
    })
  }
})
</script>





