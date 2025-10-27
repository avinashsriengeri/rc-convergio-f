<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Assignment Defaults</h2>
      <p class="mt-1 text-sm text-gray-600">Configure fallback assignment settings and default team/user assignments</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading defaults...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Defaults</h3>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <BaseButton @click="loadDefaults" variant="primary">
        Try Again
      </BaseButton>
    </div>

    <!-- Defaults Configuration -->
    <div v-else class="space-y-6">
      <!-- Current Defaults Display -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="ml-3 text-lg font-medium text-gray-900">Current Configuration</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <label class="block text-sm font-medium text-gray-700 mb-2">Default User</label>
            <div class="text-sm text-gray-900">
              {{ defaults.default_user ? `${defaults.default_user.name} (${defaults.default_user.email})` : 'Not set' }}
            </div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <label class="block text-sm font-medium text-gray-700 mb-2">Default Team</label>
            <div class="text-sm text-gray-900">
              {{ defaults.default_team ? defaults.default_team.name : 'Not set' }}
            </div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <label class="block text-sm font-medium text-gray-700 mb-2">Round Robin</label>
            <div class="text-sm text-gray-900">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  defaults.round_robin_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ defaults.round_robin_enabled ? 'Enabled' : 'Disabled' }}
              </span>
            </div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <label class="block text-sm font-medium text-gray-700 mb-2">Automatic Assignment</label>
            <div class="text-sm text-gray-900">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  defaults.enable_automatic_assignment ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ defaults.enable_automatic_assignment ? 'Enabled' : 'Disabled' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuration Form -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Update Configuration</h3>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Default User Selection -->
          <div>
            <label for="default_user_id" class="block text-sm font-medium text-gray-700 mb-2">
              Default User
            </label>
            <BaseSelect
              id="default_user_id"
              v-model="form.default_user_id"
              :options="userOptions"
              placeholder="Select default user"
              :error="errors.default_user_id"
            />
            <p class="mt-1 text-sm text-gray-500">User to assign leads/deals to when no rules match</p>
            <p v-if="errors.default_user_id" class="mt-1 text-sm text-red-600">{{ errors.default_user_id }}</p>
          </div>

          <!-- Default Team Selection -->
          <div>
            <label for="default_team_id" class="block text-sm font-medium text-gray-700 mb-2">
              Default Team
            </label>
            <BaseSelect
              id="default_team_id"
              v-model="form.default_team_id"
              :options="teamOptions"
              placeholder="Select default team"
              :error="errors.default_team_id"
            />
            <p class="mt-1 text-sm text-gray-500">Team to assign leads/deals to when no rules match</p>
            <p v-if="errors.default_team_id" class="mt-1 text-sm text-red-600">{{ errors.default_team_id }}</p>
          </div>

          <!-- Round Robin Toggle -->
          <div class="flex items-center justify-between">
            <div>
              <label for="round_robin_enabled" class="text-sm font-medium text-gray-700">
                Enable Round Robin
              </label>
              <p class="text-sm text-gray-500">Distribute assignments evenly among team members</p>
            </div>
            <div class="flex items-center">
              <input
                id="round_robin_enabled"
                v-model="form.round_robin_enabled"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>

          <!-- Automatic Assignment Toggle -->
          <div class="flex items-center justify-between">
            <div>
              <label for="enable_automatic_assignment" class="text-sm font-medium text-gray-700">
                Enable Automatic Assignment
              </label>
              <p class="text-sm text-gray-500">Automatically assign leads and deals based on rules</p>
            </div>
            <div class="flex items-center">
              <input
                id="enable_automatic_assignment"
                v-model="form.enable_automatic_assignment"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-4 pt-6 border-t border-gray-200">
            <BaseButton
              type="submit"
              :loading="saveLoading"
              variant="primary"
            >
              Save Changes
            </BaseButton>
            <BaseButton
              type="button"
              @click="resetCounters"
              :loading="resetLoading"
              variant="outline"
            >
              Reset Counters
            </BaseButton>
            <BaseButton
              type="button"
              @click="toggleAutomatic"
              :loading="toggleLoading"
              variant="secondary"
            >
              {{ defaults.enable_automatic_assignment ? 'Disable' : 'Enable' }} Automatic Assignment
            </BaseButton>
          </div>
        </form>
      </div>

      <!-- Statistics -->
      <div v-if="defaults.statistics" class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="ml-3 text-lg font-medium text-gray-900">Assignment Statistics</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg p-4 text-center shadow-sm">
            <div class="text-2xl font-bold text-blue-600">{{ defaults.statistics.total_assignments || 0 }}</div>
            <div class="text-sm text-gray-600">Total Assignments</div>
          </div>
          <div class="bg-white rounded-lg p-4 text-center shadow-sm">
            <div class="text-2xl font-bold text-green-600">{{ defaults.statistics.successful_assignments || 0 }}</div>
            <div class="text-sm text-gray-600">Successful</div>
          </div>
          <div class="bg-white rounded-lg p-4 text-center shadow-sm">
            <div class="text-2xl font-bold text-orange-600">{{ defaults.statistics.failed_assignments || 0 }}</div>
            <div class="text-sm text-gray-600">Failed</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { leadAssignmentService } from '@/services/leadAssignment'
import { error as showError, success as showSuccess } from '@/utils/notifications'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

// Props
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

// Emits
const emit = defineEmits(['refresh'])

// Reactive state
const defaults = ref({})
const users = ref([])
const teams = ref([])
const loading = ref(false)
const error = ref(null)
const saveLoading = ref(false)
const resetLoading = ref(false)
const toggleLoading = ref(false)
const errors = ref({})

const form = ref({
  default_user_id: '',
  default_team_id: '',
  round_robin_enabled: false,
  enable_automatic_assignment: false
})

// Computed
const userOptions = computed(() => [
  { value: '', label: 'Select user...' },
  ...users.value.map(user => ({
    value: user.id,
    label: `${user.name} (${user.email})`
  }))
])

const teamOptions = computed(() => [
  { value: '', label: 'Select team...' },
  ...teams.value.map(team => ({
    value: team.id,
    label: team.name
  }))
])

// Methods
const loadDefaults = async () => {
  loading.value = true
  error.value = null
  
  try {
    const data = await leadAssignmentService.loadDefaults()
    defaults.value = data
    
    // Update form with current values
    form.value = {
      default_user_id: data.default_user_id || '',
      default_team_id: data.default_team_id || '',
      round_robin_enabled: data.round_robin_enabled || false,
      enable_automatic_assignment: data.enable_automatic_assignment || false
    }
  } catch (err) {
    console.error('Error loading defaults:', err)
    error.value = err.response?.data?.message || 'Failed to load defaults'
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    const data = await leadAssignmentService.loadUsers()
    users.value = data
  } catch (err) {
    console.error('Error loading users:', err)
  }
}

const loadTeams = async () => {
  try {
    const data = await leadAssignmentService.loadTeams()
    teams.value = data
  } catch (err) {
    console.error('Error loading teams:', err)
  }
}

const handleSubmit = async () => {
  saveLoading.value = true
  errors.value = {}
  
  try {
    await leadAssignmentService.updateDefaults(form.value)
    showSuccess('Defaults updated successfully')
    await loadDefaults()
    emit('refresh')
  } catch (err) {
    console.error('Error updating defaults:', err)
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else {
      showError(err.response?.data?.message || 'Failed to update defaults')
    }
  } finally {
    saveLoading.value = false
  }
}

const resetCounters = async () => {
  if (!confirm('Are you sure you want to reset all assignment counters? This will reset round-robin counters.')) {
    return
  }
  
  resetLoading.value = true
  
  try {
    await leadAssignmentService.resetCounters()
    showSuccess('Counters reset successfully')
    await loadDefaults()
    emit('refresh')
  } catch (err) {
    console.error('Error resetting counters:', err)
    showError(err.response?.data?.message || 'Failed to reset counters')
  } finally {
    resetLoading.value = false
  }
}

const toggleAutomatic = async () => {
  toggleLoading.value = true
  
  try {
    await leadAssignmentService.toggleAutomatic()
    showSuccess(`Automatic assignment ${defaults.value.enable_automatic_assignment ? 'disabled' : 'enabled'} successfully`)
    await loadDefaults()
    emit('refresh')
  } catch (err) {
    console.error('Error toggling automatic assignment:', err)
    showError(err.response?.data?.message || 'Failed to toggle automatic assignment')
  } finally {
    toggleLoading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadDefaults(),
    loadUsers(),
    loadTeams()
  ])
})
</script>
