<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Profile & Preferences</h1>
            <p class="text-sm text-gray-600 mt-1">Manage your account information and settings</p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="secondary"
              @click="resetForm"
              :disabled="!hasChanges"
            >
              Reset Changes
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="saveProfile"
              :loading="saving"
              :disabled="!hasChanges || !isFormValid"
            >
              Save Changes
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2596be] mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
      
      <!-- Profile Content -->
      <div v-else class="space-y-6">
        <!-- Profile Information Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center space-x-6 mb-6">
            <div class="flex-shrink-0">
              <div class="h-20 w-20 rounded-full bg-gradient-to-r from-[#2596be] to-[#973894] flex items-center justify-center">
                <span class="text-2xl font-medium text-white">
                  {{ originalData.name ? originalData.name.charAt(0).toUpperCase() : 'U' }}
                </span>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-900">{{ originalData.name || 'Loading...' }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ originalData.email || 'Loading...' }}</p>
              <div class="mt-3 flex items-center space-x-4">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="getRoleBadgeClass(originalData.role)"
                >
                  {{ originalData.role ? originalData.role.charAt(0).toUpperCase() + originalData.role.slice(1) : 'User' }}
                </span>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="getStatusBadgeClass(originalData.status)"
                >
                  {{ originalData.status ? originalData.status.charAt(0).toUpperCase() + originalData.status.slice(1) : 'Active' }}
                </span>
              </div>
            </div>
          </div>

          <form @submit.prevent="saveProfile" class="space-y-6">
            <!-- Basic Information -->
            <div>
              <h4 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Full Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span class="text-red-500">*</span>
                  </label>
                  <BaseInput
                    v-model="form.name"
                    placeholder="Enter your full name"
                    :error="errors.name"
                    @blur="validateField('name')"
                    class="w-full"
                  />
                  <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name }}</p>
                </div>

                <!-- Email Address -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span class="text-red-500">*</span>
                  </label>
                  <BaseInput
                    v-model="form.email"
                    type="email"
                    placeholder="Enter your email address"
                    :error="errors.email"
                    @blur="validateField('email')"
                    class="w-full"
                  />
                  <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
                </div>
              </div>
            </div>

            <!-- Password Change -->
            <div class="border-t border-gray-200 pt-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-md font-medium text-gray-900">Password</h4>
                <button
                  type="button"
                  @click="showPasswordSection = !showPasswordSection"
                  class="text-sm text-blue-600 hover:text-blue-500"
                >
                  {{ showPasswordSection ? 'Cancel Password Change' : 'Change Password' }}
                </button>
              </div>

              <div v-if="showPasswordSection" class="space-y-4">
                <!-- Current Password -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Current Password <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <BaseInput
                      v-model="form.current_password"
                      :type="showCurrentPassword ? 'text' : 'password'"
                      placeholder="Enter your current password"
                      :error="errors.current_password"
                      @blur="validateField('current_password')"
                    />
                    <button
                      type="button"
                      @click="showCurrentPassword = !showCurrentPassword"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg v-if="showCurrentPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                      <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                  <p v-if="errors.current_password" class="mt-1 text-sm text-red-600">{{ errors.current_password }}</p>
                </div>

                <!-- New Password -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    New Password <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <BaseInput
                      v-model="form.new_password"
                      :type="showNewPassword ? 'text' : 'password'"
                      placeholder="Enter your new password"
                      :error="errors.new_password"
                      @blur="validateField('new_password')"
                    />
                    <button
                      type="button"
                      @click="showNewPassword = !showNewPassword"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg v-if="showNewPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                      <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                  <p v-if="errors.new_password" class="mt-1 text-sm text-red-600">{{ errors.new_password }}</p>
                  <p class="mt-1 text-sm text-gray-500">
                    Password must be at least 8 characters long and include uppercase, lowercase, and numbers.
                  </p>
                </div>

                <!-- Confirm New Password -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password <span class="text-red-500">*</span>
                  </label>
                  <BaseInput
                    v-model="form.new_password_confirmation"
                    type="password"
                    placeholder="Confirm your new password"
                    :error="errors.new_password_confirmation"
                    @blur="validateField('new_password_confirmation')"
                  />
                  <p v-if="errors.new_password_confirmation" class="mt-1 text-sm text-red-600">{{ errors.new_password_confirmation }}</p>
                </div>
              </div>
            </div>

            <!-- Account Information -->
            <div class="border-t border-gray-200 pt-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4">Account Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 rounded-lg p-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div class="flex items-center space-x-2">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      :class="getRoleBadgeClass(originalData.role)"
                    >
                      {{ originalData.role ? originalData.role.charAt(0).toUpperCase() + originalData.role.slice(1) : 'User' }}
                    </span>
                  </div>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                  <div class="flex items-center space-x-2">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      :class="getStatusBadgeClass(originalData.status)"
                    >
                      {{ originalData.status ? originalData.status.charAt(0).toUpperCase() + originalData.status.slice(1) : 'Active' }}
                    </span>
                  </div>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <p class="text-sm text-gray-900 font-medium">
                    {{ originalData.created_at ? formatDate(originalData.created_at) : 'Loading...' }}
                  </p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                  <p class="text-sm text-gray-900 font-medium">
                                         {{ originalData.last_login ? formatDate(originalData.last_login) : 'Never' }}
                   </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Preferences -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
          
          <!-- Notification Settings -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900">Email Notifications</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <label class="text-sm font-medium text-gray-900">Deal Updates</label>
                  <p class="text-sm text-gray-500">Receive notifications when deals are updated</p>
                </div>
                <input
                  type="checkbox"
                  v-model="preferences.deal_notifications"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <label class="text-sm font-medium text-gray-900">Task Reminders</label>
                  <p class="text-sm text-gray-500">Get reminded about upcoming tasks and deadlines</p>
                </div>
                <input
                  type="checkbox"
                  v-model="preferences.task_notifications"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <label class="text-sm font-medium text-gray-900">Weekly Reports</label>
                  <p class="text-sm text-gray-500">Receive weekly performance reports</p>
                </div>
                <input
                  type="checkbox"
                  v-model="preferences.weekly_reports"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          <!-- Display Settings -->
          <div class="border-t border-gray-200 pt-6 mt-6">
            <h4 class="text-md font-medium text-gray-900 mb-4">Display Settings</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                <select
                  v-model="preferences.timezone"
                  class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York">Eastern Time (EST/EDT)</option>
                  <option value="America/Chicago">Central Time (CST/CDT)</option>
                  <option value="America/Denver">Mountain Time (MST/MDT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
                  <option value="Europe/London">London (GMT/BST)</option>
                  <option value="Europe/Paris">Central European Time (CET/CEST)</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select
                  v-model="preferences.date_format"
                  class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (European Format)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <h3 class="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <h4 class="text-sm font-medium text-red-900">Delete Account</h4>
                <p class="text-sm text-red-700 mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <BaseButton
                variant="danger"
                size="sm"
                @click="showDeleteModal = true"
              >
                Delete Account
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      title="Delete Account"
      message="Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data."
      confirm-text="Delete My Account"
      confirm-variant="danger"
      @confirm="deleteAccount"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { usersAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'

interface UserProfile {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager' | 'user'
  status: 'active' | 'inactive'
  last_login?: string
  created_at: string
}

interface UserRole {
  id: number
  name: string
  display_name?: string | null
}

interface ProfileForm {
  name: string
  email: string
  current_password: string
  new_password: string
  new_password_confirmation: string
}

interface UserPreferences {
  deal_notifications: boolean
  task_notifications: boolean
  weekly_reports: boolean
  timezone: string
  date_format: string
}

const { success, error: showError } = useNotifications()

// Reactive data
const saving = ref(false)
const loading = ref(true)
const showPasswordSection = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showDeleteModal = ref(false)

// Original data (will be populated from API)
const originalData = reactive<UserProfile>({
  id: 0,
  name: '',
  email: '',
  role: 'user',
  status: 'active',
  last_login: '',
  created_at: ''
})

const form = reactive<ProfileForm>({
  name: '',
  email: '',
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const preferences = reactive<UserPreferences>({
  deal_notifications: true,
  task_notifications: true,
  weekly_reports: false,
  timezone: 'America/New_York',
  date_format: 'MM/DD/YYYY'
})

const errors = reactive({
  name: '',
  email: '',
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

// Computed
const hasChanges = computed(() => {
  const basicInfoChanged = form.name !== originalData.name || form.email !== originalData.email
  const passwordChanged = showPasswordSection.value && (form.current_password || form.new_password)
  return basicInfoChanged || passwordChanged
})

const isFormValid = computed(() => {
  // Basic validation
  if (!form.name.trim() || !form.email.trim()) {
    return false
  }

  // Password validation if changing password
  if (showPasswordSection.value) {
    if (!form.current_password || !form.new_password || !form.new_password_confirmation) {
      return false
    }
    if (form.new_password !== form.new_password_confirmation) {
      return false
    }
  }

  // Check for any errors
  return !Object.values(errors).some(error => error)
})

// Methods
const validateField = (field: keyof typeof errors) => {
  errors[field] = ''

  switch (field) {
    case 'name':
      if (!form.name.trim()) {
        errors.name = 'Full name is required'
      }
      break

    case 'email':
      if (!form.email.trim()) {
        errors.email = 'Email address is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email address'
      }
      break

    case 'current_password':
      if (showPasswordSection.value && !form.current_password) {
        errors.current_password = 'Current password is required'
      }
      break

    case 'new_password':
      if (showPasswordSection.value) {
        if (!form.new_password) {
          errors.new_password = 'New password is required'
        } else if (form.new_password.length < 8) {
          errors.new_password = 'Password must be at least 8 characters long'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.new_password)) {
          errors.new_password = 'Password must include uppercase, lowercase, and numbers'
        }
      }
      break

    case 'new_password_confirmation':
      if (showPasswordSection.value) {
        if (!form.new_password_confirmation) {
          errors.new_password_confirmation = 'Please confirm your new password'
        } else if (form.new_password !== form.new_password_confirmation) {
          errors.new_password_confirmation = 'Passwords do not match'
        }
      }
      break
  }
}

const saveProfile = async () => {
  // Validate all fields
  Object.keys(errors).forEach(field => {
    validateField(field as keyof typeof errors)
  })

  if (!isFormValid.value) {
    return
  }

  saving.value = true

  try {
    const updateData = {
      name: form.name,
      email: form.email,
      preferences: preferences,
      ...(showPasswordSection.value && {
        current_password: form.current_password,
        new_password: form.new_password
      })
    }

    await usersAPI.updateUser(originalData.id, updateData)

    // Update original data
    originalData.name = form.name
    originalData.email = form.email

    // Reset password fields
    if (showPasswordSection.value) {
      form.current_password = ''
      form.new_password = ''
      form.new_password_confirmation = ''
      showPasswordSection.value = false
    }

    success('Profile updated successfully!')
  } catch (err: any) {
    console.error('Failed to save profile:', err)
    showError(err.response?.data?.message || 'Failed to save profile')
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  form.name = originalData.name
  form.email = originalData.email
  form.current_password = ''
  form.new_password = ''
  form.new_password_confirmation = ''
  showPasswordSection.value = false
  
  // Clear errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

const deleteAccount = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Deleting account...')
    
    // In a real app, this would log the user out and redirect to login
    alert('Account deletion initiated. You will be logged out.')
    showDeleteModal.value = false
  } catch (err) {
    console.error('Failed to delete account:', err)
    alert('Failed to delete account. Please try again.')
  }
}

const getRoleBadgeClass = (role: string) => {
  const classes = {
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-purple-100 text-purple-800',
    user: 'bg-green-100 text-green-800'
  }
  return classes[role as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Methods
const loadProfile = async () => {
  loading.value = true
  try {
    const response = await usersAPI.getCurrentUser()
    const userData = response.data.data || response.data
    
    // Extract role from nested roles array (backend structure)
    const userRole = userData.roles && userData.roles.length > 0 
      ? userData.roles[0].name 
      : userData.role || 'user'
    
    // Update original data
    Object.assign(originalData, {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userRole,
      status: userData.status || 'active',
      last_login: userData.last_login,
      created_at: userData.created_at
    })
    
    // Initialize form with current data
    form.name = originalData.name
    form.email = originalData.email
    
    console.log('Profile loaded:', originalData)
    console.log('User roles from backend:', userData.roles)
    console.log('Extracted role:', userRole)
  } catch (err: any) {
    console.error('Failed to load profile:', err)
    showError('Failed to load profile')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadProfile()
})
</script>
