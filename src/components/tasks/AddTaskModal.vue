<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Add Task</h3>
          <button
            @click="$emit('cancel')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <BaseInput
              v-model="form.title"
              type="text"
              placeholder="Enter task title"
              :error="errors.title"
              required
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter task description"
            ></textarea>
          </div>

          <!-- Priority -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Priority *
            </label>
            <select
              v-model="form.priority"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300': errors.priority }"
              required
            >
              <option value="">Select priority...</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <p v-if="errors.priority" class="mt-1 text-sm text-red-600">{{ errors.priority }}</p>
          </div>

          <!-- Assignee -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Assignee
            </label>
            <select
              v-model="form.assignee_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select assignee...</option>
              <option
                v-for="user in users"
                :key="user.id"
                :value="user.id"
              >
                {{ user.name }}
              </option>
            </select>
          </div>

          <!-- Due Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <BaseInput
              v-model="form.due_date"
              type="date"
              :error="errors.due_date"
              required
            />
            <p v-if="errors.due_date" class="mt-1 text-sm text-red-600">{{ errors.due_date }}</p>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional notes..."
            ></textarea>
          </div>
        </form>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 mt-6">
          <BaseButton
            type="button"
            variant="outline"
            @click="$emit('cancel')"
            :disabled="loading"
          >
            Cancel
          </BaseButton>
          <BaseButton
            type="button"
            variant="primary"
            @click="submitForm"
            :loading="loading"
          >
            Create Task
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { tasksAPI } from '../../services/api'
import { success, error as showError } from '../../utils/notifications'
import { fetchUsersForDropdown } from '../../helpers/fetchUsersForDropdown'
import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'

interface Props {
  dealId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

// Reactive data
const loading = ref(false)
const users = ref<any[]>([])
const errors = reactive<Record<string, string>>({})

const form = reactive({
  title: '',
  description: '',
  priority: '',
  assignee_id: undefined as number | undefined,
  due_date: '',
  status: 'pending',
  notes: '',
  related_type: 'deal',
  related_id: props.dealId
})

// Methods
const loadUsers = async () => {
  try {
    // Use team-aware helper to fetch users filtered by tenant/team
    users.value = await fetchUsersForDropdown()
  } catch (err) {
    console.error('Error loading users:', err)
    // Fallback to empty array
    users.value = []
  }
}

const validateForm = () => {
  errors.title = ''
  errors.priority = ''
  errors.due_date = ''

  if (!form.title.trim()) {
    errors.title = 'Title is required'
  }

  if (!form.priority) {
    errors.priority = 'Priority is required'
  }

  if (!form.due_date) {
    errors.due_date = 'Due date is required'
  }

  return Object.keys(errors).length === 0 || Object.values(errors).every(error => !error)
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  
  try {
    const taskData = {
      title: form.title,
      description: form.description || undefined,
      priority: form.priority,
      assignee_id: form.assignee_id || undefined,
      due_date: form.due_date,
      status: form.status,
      notes: form.notes || undefined,
      related_type: 'App\\Models\\Deal', // Use the correct Laravel model class name with escaped backslashes
      related_id: props.dealId
    }

    await tasksAPI.createTask(taskData)
    success('Task created successfully')
    emit('confirm')
  } catch (err: any) {
    console.error('Error creating task:', err)
    
    // Handle validation errors
    if (err.response?.data?.errors) {
      Object.keys(err.response.data.errors).forEach(key => {
        errors[key] = err.response.data.errors[key][0]
      })
    } else {
      showError(err.response?.data?.message || 'Failed to create task')
    }
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>

<script lang="ts">
export default {
  name: 'AddTaskModal'
}
</script>
