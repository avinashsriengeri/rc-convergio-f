<template>
  <div class="category-form">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Category Name Field -->
      <div class="form-group">
        <label for="categoryName" class="block text-sm font-medium text-gray-700 mb-2">
          Category Name *
        </label>
        <input
          id="categoryName"
          v-model="formData.name"
          type="text"
          :class="[
            'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.name ? 'border-red-300' : 'border-gray-300'
          ]"
          placeholder="Enter category name..."
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
      </div>

      <!-- Category Description Field -->
      <div class="form-group">
        <label for="categoryDescription" class="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="categoryDescription"
          v-model="formData.description"
          rows="3"
          :class="[
            'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.description ? 'border-red-300' : 'border-gray-300'
          ]"
          placeholder="Enter category description..."
        ></textarea>
        <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
      </div>

      <!-- Category Color Field -->
      <div class="form-group">
        <label for="categoryColor" class="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div class="flex items-center space-x-3">
          <input
            id="categoryColor"
            v-model="formData.color"
            type="color"
            class="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
          />
          <input
            v-model="formData.color"
            type="text"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="#3B82F6"
          />
        </div>
        <p v-if="errors.color" class="mt-1 text-sm text-red-600">{{ errors.color }}</p>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isEditing ? 'Updating...' : 'Creating...' }}
          </span>
          <span v-else>
            {{ isEditing ? 'Update Category' : 'Create Category' }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  category: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

// Form data
const formData = ref({
  name: '',
  description: '',
  color: '#3B82F6'
})

// Form state
const errors = ref({})
const isSubmitting = ref(false)

// Computed properties
const isEditing = computed(() => !!props.category)

// Watch for category changes (for editing)
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    formData.value = {
      name: newCategory.name || '',
      description: newCategory.description || '',
      color: newCategory.color || '#3B82F6'
    }
  } else {
    // Reset form for new category
    formData.value = {
      name: '',
      description: '',
      color: '#3B82F6'
    }
  }
  errors.value = {}
}, { immediate: true })

// Methods
const validateForm = () => {
  errors.value = {}
  let isValid = true

  // Validate name
  if (!formData.value.name.trim()) {
    errors.value.name = 'Category name is required'
    isValid = false
  } else if (formData.value.name.trim().length < 2) {
    errors.value.name = 'Category name must be at least 2 characters'
    isValid = false
  }

  // Validate color
  if (!formData.value.color) {
    errors.value.color = 'Category color is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const categoryData = {
      name: formData.value.name.trim(),
      description: formData.value.description.trim(),
      color: formData.value.color
    }

    emit('submit', categoryData)
  } catch (error) {
    console.error('Failed to save category:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.category-form {
  @apply bg-white p-6 rounded-lg shadow-sm border border-gray-200;
}

.form-group {
  @apply space-y-1;
}
</style>
