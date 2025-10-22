<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-4">
            <button
              @click="goBack"
              class="text-gray-400 hover:text-gray-600 p-2"
              title="Back to activities"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Activity Details</h1>
              <p class="text-sm text-gray-600 mt-1">View activity information</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              v-if="canEdit(activity)"
              variant="secondary"
              @click="editActivity"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </BaseButton>
            <BaseButton
              v-if="canDelete(activity)"
              variant="danger"
              @click="deleteActivity"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading activity</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="loadActivity">
            Try Again
          </BaseButton>
        </div>
      </div>

      <!-- Activity Details -->
      <div v-else-if="activity" class="bg-white shadow-sm rounded-lg">
        <!-- Activity Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <!-- Activity Icon -->
              <div class="w-12 h-12 rounded-full flex items-center justify-center" :class="getActivityIconClass(activity.type)">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="activity.type === 'call'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  <path v-else-if="activity.type === 'meeting'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path v-else-if="activity.type === 'email'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <div class="flex items-center space-x-3">
                  <h2 class="text-xl font-semibold text-gray-900">{{ activity.title }}</h2>
                  <span v-if="activity.team" class="team-badge">
                    {{ activity.team.name }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 capitalize">{{ activity.type }} • {{ activity.status }}</p>
              </div>
            </div>
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusBadgeClass(activity.status)"
            >
              {{ activity.status }}
            </span>
          </div>
        </div>

        <!-- Activity Content -->
        <div class="px-6 py-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column -->
            <div class="space-y-6">
              <!-- Description -->
              <div v-if="activity.description">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p class="text-gray-700 whitespace-pre-wrap">{{ activity.description }}</p>
              </div>

              <!-- Scheduled Date & Time -->
              <div v-if="activity.scheduled_at">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Scheduled</h3>
                <div class="flex items-center space-x-4 text-gray-700">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ formatDate(activity.scheduled_at) }}</span>
                  </div>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ formatTime(activity.scheduled_at) }}</span>
                  </div>
                </div>
              </div>

              <!-- Duration -->
              <div v-if="activity.duration">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Duration</h3>
                <div class="flex items-center text-gray-700">
                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ activity.duration }} minutes</span>
                </div>
              </div>

              <!-- Notes -->
              <div v-if="activity.notes">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Notes</h3>
                <div class="bg-blue-50 rounded-md p-4">
                  <p class="text-blue-800 whitespace-pre-wrap">{{ activity.notes }}</p>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <!-- Related Entity -->
              <div v-if="activity.related_entity">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Related To</h3>
                <div class="bg-gray-50 rounded-md p-4">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span class="text-gray-700">
                      {{ activity.related_entity.type }} - {{ activity.related_entity.name }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Owner -->
              <div v-if="activity.owner">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Owner</h3>
                <div class="flex items-center text-gray-700">
                  <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    <span class="text-sm font-medium text-gray-700">
                      {{ activity.owner.name?.charAt(0) || 'U' }}
                    </span>
                  </div>
                  <span>{{ activity.owner.name || activity.owner.email }}</span>
                </div>
              </div>
              
              <!-- Team -->
              <div v-if="activity.team">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Team</h3>
                <div class="flex items-center text-gray-700">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span>{{ activity.team.name || '—' }}</span>
                </div>
              </div>

              <!-- Timestamps -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Timestamps</h3>
                <div class="space-y-2 text-sm text-gray-600">
                  <div class="flex justify-between">
                    <span>Created:</span>
                    <span>{{ formatRelativeTime(activity.created_at) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Updated:</span>
                    <span>{{ formatRelativeTime(activity.updated_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      title="Delete Activity"
      :message="`Are you sure you want to delete the activity '${activity?.title}'? This action cannot be undone.`"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useActivitiesStore } from '@/stores/activities'
import { useContext } from '@/composables/useContext'
import { usePermission } from '@/composables/usePermission'
import { success, error as showError } from '@/utils/notifications'
import { formatDate, formatTime, formatRelativeTime } from '@/utils/formatters'
import type { Activity } from '@/types'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'

// Router
const route = useRoute()
const router = useRouter()

// Store
const activitiesStore = useActivitiesStore()
// Context and permissions (unused in this component but available for future use)
// const { tenantId, teamId, isAdmin } = useContext()
const { canEdit, canDelete, canView } = usePermission()

// Reactive data
const loading = ref(false)
const error = ref<string | null>(null)
const showDeleteModal = ref(false)

// Computed
const activity = computed(() => activitiesStore.selectedActivity)

// Methods
const loadActivity = async () => {
  const activityId = parseInt(route.params.id as string)
  if (!activityId) {
    error.value = 'Invalid activity ID'
    return
  }

  loading.value = true
  error.value = null

  try {
    await activitiesStore.fetchActivityById(activityId)
    if (!activitiesStore.selectedActivity) {
      error.value = 'Activity not found'
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load activity'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  // Check if there's history to go back to, otherwise navigate to activities list
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'activities' })
  }
}

const editActivity = () => {
  if (activity.value) {
    router.push({ name: 'activities.edit', params: { id: activity.value.id } })
  }
}

const deleteActivity = () => {
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!activity.value) return

  try {
    await activitiesStore.deleteActivity(activity.value.id)
    showDeleteModal.value = false
    success('Activity deleted successfully')
    goBack()
  } catch (err) {
    showError('Failed to delete activity')
  }
}

const getActivityIconClass = (type: string) => {
  const classes = {
    call: 'bg-green-500',
    meeting: 'bg-purple-500',
    email: 'bg-yellow-500',
    task: 'bg-blue-500',
    note: 'bg-gray-500'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-500'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(() => {
  loadActivity()
})
</script>
