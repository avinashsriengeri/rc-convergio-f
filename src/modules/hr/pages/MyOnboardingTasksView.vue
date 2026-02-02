<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">My Onboarding Tasks</h1>
        <p class="mt-2 text-lg text-gray-600">Tasks assigned to you for employee onboarding</p>
      </div>
      <router-link
        to="/hr/onboarding"
        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="onboardingStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div class="h-2 bg-gray-200 rounded w-full"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="onboardingStore.error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-red-800">Error loading tasks</h3>
          <p class="mt-1 text-sm text-red-700">{{ onboardingStore.error }}</p>
        </div>
        <button
          @click="loadMyTasks"
          class="ml-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="groupedTasks.pending.length === 0 && groupedTasks.in_progress.length === 0 && groupedTasks.completed.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No tasks assigned</h3>
      <p class="mt-2 text-sm text-gray-500">You don't have any onboarding tasks assigned to you.</p>
    </div>

    <!-- Tasks by Status -->
    <div v-else class="space-y-8">
      <!-- Pending Tasks -->
      <div v-if="groupedTasks.pending.length > 0">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Pending</h2>
          <span class="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
            {{ groupedTasks.pending.length }}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TaskCard
            v-for="task in groupedTasks.pending"
            :key="task.id"
            :task="task"
            :show-view-employee="true"
            @start-task="startTask(task)"
            @view-employee="viewEmployee(task.employee_id)"
          />
        </div>
      </div>

      <!-- In Progress Tasks -->
      <div v-if="groupedTasks.in_progress.length > 0">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">In Progress</h2>
          <span class="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
            {{ groupedTasks.in_progress.length }}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TaskCard
            v-for="task in groupedTasks.in_progress"
            :key="task.id"
            :task="task"
            :show-view-employee="true"
            @complete-task="completeTask(task)"
            @view-employee="viewEmployee(task.employee_id)"
          />
        </div>
      </div>

      <!-- Completed Tasks -->
      <div v-if="groupedTasks.completed.length > 0">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Completed</h2>
          <span class="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
            {{ groupedTasks.completed.length }}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TaskCard
            v-for="task in groupedTasks.completed"
            :key="task.id"
            :task="task"
            :show-actions="false"
            :show-view-employee="true"
            @view-employee="viewEmployee(task.employee_id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHrOnboardingStore } from '../store/hrOnboarding'
import TaskCard from '../components/TaskCard.vue'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const router = useRouter()
const onboardingStore = useHrOnboardingStore()

// Computed
const groupedTasks = computed(() => {
  const tasks = onboardingStore.myTasks || []
  return {
    pending: tasks.filter(t => t.status === 'pending'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed')
  }
})

// Methods
const loadMyTasks = async () => {
  try {
    await onboardingStore.fetchMyOnboardingTasks()
  } catch (err) {
    showError(err.message || 'Failed to load tasks')
  }
}

const startTask = async (task) => {
  try {
    await onboardingStore.updateOnboardingTask(task.employee_id, task.id, {
      status: 'in_progress'
    })
    showSuccess('Task started successfully')
    await loadMyTasks()
  } catch (err) {
    showError(err.message || 'Failed to start task')
  }
}

const completeTask = async (task) => {
  try {
    await onboardingStore.updateOnboardingTask(task.employee_id, task.id, {
      status: 'completed'
    })
    showSuccess('Task completed successfully')
    await loadMyTasks()
  } catch (err) {
    showError(err.message || 'Failed to complete task')
  }
}

const viewEmployee = (employeeId) => {
  router.push(`/hr/employees/${employeeId}/onboarding`)
}

// Lifecycle
onMounted(() => {
  loadMyTasks()
})
</script>

