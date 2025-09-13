<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? $t('common.edit_task') : $t('common.add_task') }}
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
                <option v-for="status in taskStatuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
              <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
            </div>

            <!-- Priority -->
            <div>
              <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">
                Priority *
              </label>
              <select
                id="priority"
                v-model="form.priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.priority }"
                required
              >
                <option value="">Select Priority</option>
                <option v-for="priority in taskPriorities" :key="priority" :value="priority">
                  {{ priority }}
                </option>
              </select>
              <p v-if="errors.priority" class="mt-1 text-sm text-red-600">{{ errors.priority }}</p>
            </div>

            <!-- Due Date -->
            <div>
              <label for="due_date" class="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <BaseInput
                id="due_date"
                v-model="form.due_date"
                :error="errors.due_date"
                type="datetime-local"
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
                <option v-for="owner in owners" :key="owner.id" :value="owner.id">
                  {{ owner.name }}
                </option>
              </select>
              <p v-if="errors.owner_id" class="mt-1 text-sm text-red-600">{{ errors.owner_id }}</p>
            </div>

            <!-- Assigned To -->
            <div>
              <label for="assigned_to" class="block text-sm font-medium text-gray-700 mb-1">
                Assigned To
              </label>
              <select
                id="assigned_to"
                v-model="form.assigned_to"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.assigned_to }"
              >
                <option value="">Select Assignee</option>
                <option v-for="owner in owners" :key="owner.id" :value="owner.id">
                  {{ owner.name }}
                </option>
              </select>
              <p v-if="errors.assigned_to" class="mt-1 text-sm text-red-600">{{ errors.assigned_to }}</p>
            </div>

            <!-- Related Type -->
            <div>
              <label for="related_type" class="block text-sm font-medium text-gray-700 mb-1">
                Related Type
              </label>
              <select
                id="related_type"
                v-model="form.related_type"
                @change="onRelatedTypeChange"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.related_type }"
              >
                <option value="">Select Related Type</option>
                <option value="contact">Contact</option>
                <option value="company">Company</option>
                <option value="deal">Deal</option>
              </select>
              <p v-if="errors.related_type" class="mt-1 text-sm text-red-600">{{ errors.related_type }}</p>
            </div>

            <!-- Related ID -->
            <div>
              <label for="related_id" class="block text-sm font-medium text-gray-700 mb-1">
                Related Item
              </label>
              <select
                id="related_id"
                v-model="form.related_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.related_id }"
                :disabled="!form.related_type"
              >
                <option value="">Select Related Item</option>
                <option v-for="item in relatedItems" :key="item.id" :value="item.id">
                  {{ getRelatedItemLabel(item) }}
                </option>
              </select>
              <p v-if="errors.related_id" class="mt-1 text-sm text-red-600">{{ errors.related_id }}</p>
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
              <p class="mt-1 text-sm text-gray-500">Separate tags with commas (e.g., urgent, follow-up, meeting)</p>
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
              {{ isEditing ? 'Update Task' : 'Create Task' }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { tasksAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const props = defineProps({
  task: {
    type: Object,
    default: null
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
  taskStatuses: {
    type: Array,
    default: () => []
  },
  taskPriorities: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'saved'])

// Reactive data
const loading = ref(false)
const submitError = ref('')
const errors = reactive({})
const relatedItems = ref([])

const form = reactive({
  title: '',
  description: '',
  status: '',
  priority: '',
  due_date: '',
  owner_id: '',
  assigned_to: '',
  related_type: '',
  related_id: '',
  tags: ''
})

// Computed
const isEditing = computed(() => !!props.task)

// Watch for task changes to populate form
watch(() => props.task, (newTask) => {
  if (newTask) {
    form.title = newTask.title || ''
    form.description = newTask.description || ''
    form.status = newTask.status || ''
    form.priority = newTask.priority || ''
    form.due_date = newTask.due_date ? newTask.due_date.replace('Z', '') : ''
    form.owner_id = newTask.owner_id || ''
    form.assigned_to = newTask.assigned_to || ''
    form.related_type = newTask.related_type || ''
    form.related_id = newTask.related_id || ''
    form.tags = newTask.tags || ''
    
    // Load related items if related_type is set
    if (form.related_type) {
      loadRelatedItems(form.related_type)
    }
  } else {
    // Reset form for new task
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
    relatedItems.value = []
  }
  // Clear errors
  Object.keys(errors).forEach(key => delete errors[key])
  submitError.value = ''
}, { immediate: true })

// Methods
const loadRelatedItems = (type) => {
  switch (type) {
    case 'contact':
      relatedItems.value = props.contacts
      break
    case 'company':
      relatedItems.value = props.companies
      break
    case 'deal':
      // You might need to load deals from API
      relatedItems.value = []
      break
    default:
      relatedItems.value = []
  }
}

const onRelatedTypeChange = () => {
  form.related_id = ''
  if (form.related_type) {
    loadRelatedItems(form.related_type)
  } else {
    relatedItems.value = []
  }
}

const getRelatedItemLabel = (item) => {
  if (form.related_type === 'contact') {
    return `${item.first_name} ${item.last_name}`
  } else if (form.related_type === 'company') {
    return item.name
  } else if (form.related_type === 'deal') {
    return item.title
  }
  return item.name || item.title || 'Unknown'
}

const validateForm = () => {
  const newErrors = {}
  
  if (!form.title.trim()) {
    newErrors.title = 'Task title is required'
  }
  
  if (!form.status) {
    newErrors.status = 'Status is required'
  }
  
  if (!form.priority) {
    newErrors.priority = 'Priority is required'
  }
  
  if (!form.owner_id) {
    newErrors.owner_id = 'Owner is required'
  }
  
  if (form.due_date && new Date(form.due_date) < new Date()) {
    newErrors.due_date = 'Due date cannot be in the past'
  }
  
  if (form.related_type && !form.related_id) {
    newErrors.related_id = 'Related item is required when type is selected'
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
  
  loading.value = true
  
  try {
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      due_date: form.due_date || null,
      owner_id: parseInt(form.owner_id),
      assigned_to: form.assigned_to ? parseInt(form.assigned_to) : null,
      related_type: form.related_type || null,
      related_id: form.related_id ? parseInt(form.related_id) : null,
      tags: form.tags.trim() || null
    }
    
    if (isEditing.value) {
      await tasksAPI.updateTask(props.task.id, data)
    } else {
      await tasksAPI.createTask(data)
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
      submitError.value = error.response?.data?.message || 'An error occurred while saving the task'
    }
  } finally {
    loading.value = false
  }
}
</script>
