<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <h1 class="text-2xl font-bold text-gray-900">{{ $t('settings.title') }}</h1>
          <p class="text-sm text-gray-600 mt-1">{{ $t('settings.subtitle') }}</p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Navigation -->
        <div class="lg:col-span-1">
          <nav class="space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              <component :is="tab.icon" class="w-5 h-5 mr-3" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Content -->
        <div class="lg:col-span-2">
          <!-- Profile Settings -->
          <div v-if="activeTab === 'profile'" class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">{{ $t('settings.profile_information') }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ $t('settings.profile_subtitle') }}</p>
            </div>
            <div class="px-6 py-4">
              <form @submit.prevent="updateProfile" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="first_name" class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('settings.first_name') }}
                    </label>
                    <BaseInput
                      id="first_name"
                      v-model="profileForm.first_name"
                      :placeholder="$t('settings.enter_first_name')"
                      :error="errors.first_name"
                    />
                  </div>
                  <div>
                    <label for="last_name" class="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <BaseInput
                      id="last_name"
                      v-model="profileForm.last_name"
                      placeholder="Enter your last name"
                      :error="errors.last_name"
                    />
                  </div>
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <BaseInput
                    id="email"
                    v-model="profileForm.email"
                    type="email"
                    placeholder="Enter your email address"
                    :error="errors.email"
                  />
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <BaseInput
                    id="phone"
                    v-model="profileForm.phone"
                    placeholder="Enter your phone number"
                    :error="errors.phone"
                  />
                </div>
                <div class="flex justify-end">
                  <BaseButton
                    type="submit"
                    variant="primary"
                    :loading="profileLoading"
                  >
                    Update Profile
                  </BaseButton>
                </div>
              </form>
            </div>
          </div>

          <!-- Security Settings -->
          <div v-if="activeTab === 'security'" class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Security Settings</h3>
              <p class="text-sm text-gray-600 mt-1">Manage your password and security preferences.</p>
            </div>
            <div class="px-6 py-4">
              <form @submit.prevent="updatePassword" class="space-y-6">
                <div>
                  <label for="current_password" class="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <BaseInput
                    id="current_password"
                    v-model="passwordForm.current_password"
                    type="password"
                    placeholder="Enter your current password"
                    :error="errors.current_password"
                  />
                </div>
                <div>
                  <label for="new_password" class="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <BaseInput
                    id="new_password"
                    v-model="passwordForm.new_password"
                    type="password"
                    placeholder="Enter your new password"
                    :error="errors.new_password"
                  />
                </div>
                <div>
                  <label for="new_password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <BaseInput
                    id="new_password_confirmation"
                    v-model="passwordForm.new_password_confirmation"
                    type="password"
                    placeholder="Confirm your new password"
                    :error="errors.new_password_confirmation"
                  />
                </div>
                <div class="flex justify-end">
                  <BaseButton
                    type="submit"
                    variant="primary"
                    :loading="passwordLoading"
                  >
                    Update Password
                  </BaseButton>
                </div>
              </form>
            </div>
          </div>

          <!-- Preferences -->
          <div v-if="activeTab === 'preferences'" class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Preferences</h3>
              <p class="text-sm text-gray-600 mt-1">Customize your application experience.</p>
            </div>
            <div class="px-6 py-4">
              <form @submit.prevent="updatePreferences" class="space-y-6">
                <div>
                  <label for="timezone" class="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    v-model="preferencesForm.timezone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
                <div>
                  <label for="date_format" class="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select
                    id="date_format"
                    v-model="preferencesForm.date_format"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label for="currency" class="block text-sm font-medium text-gray-700 mb-2">
                    Default Currency
                  </label>
                  <select
                    id="currency"
                    v-model="preferencesForm.currency"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
                <div class="flex items-center">
                  <input
                    id="email_notifications"
                    v-model="preferencesForm.email_notifications"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="email_notifications" class="ml-2 block text-sm text-gray-900">
                    Enable email notifications
                  </label>
                </div>
                <div class="flex justify-end">
                  <BaseButton
                    type="submit"
                    variant="primary"
                    :loading="preferencesLoading"
                  >
                    Save Preferences
                  </BaseButton>
                </div>
              </form>
            </div>
          </div>

          <!-- API Keys -->
          <div v-if="activeTab === 'api'" class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">API Configuration</h3>
              <p class="text-sm text-gray-600 mt-1">Manage your API keys and integrations.</p>
            </div>
            <div class="px-6 py-4">
              <div class="space-y-6">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-2">API Base URL</h4>
                  <div class="flex items-center space-x-2">
                    <BaseInput
                      :value="apiConfig.baseURL"
                      readonly
                      class="flex-1"
                    />
                    <BaseButton
                      variant="secondary"
                      @click="copyToClipboard(apiConfig.baseURL)"
                    >
                      Copy
                    </BaseButton>
                  </div>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Authentication</h4>
                  <p class="text-sm text-gray-600">
                    Use Bearer token authentication with your API requests. Include the following header:
                  </p>
                  <div class="mt-2 p-3 bg-gray-50 rounded-md">
                    <code class="text-sm">Authorization: Bearer YOUR_TOKEN</code>
                  </div>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Tenant ID</h4>
                  <p class="text-sm text-gray-600">
                    Include your tenant ID in the X-Tenant-ID header for multi-tenant operations:
                  </p>
                  <div class="mt-2 p-3 bg-gray-50 rounded-md">
                    <code class="text-sm">X-Tenant-ID: YOUR_TENANT_ID</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { success, error } from '@/utils/notifications'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

// Icons
const UserIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>`
}

const ShieldIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>`
}

const CogIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
  </svg>`
}

const KeyIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>`
}

// Tabs
const tabs = [
  { id: 'profile', name: 'Profile', icon: UserIcon },
  { id: 'security', name: 'Security', icon: ShieldIcon },
  { id: 'preferences', name: 'Preferences', icon: CogIcon },
  { id: 'api', name: 'API', icon: KeyIcon }
]

// Reactive data
const activeTab = ref('profile')
const profileLoading = ref(false)
const passwordLoading = ref(false)
const preferencesLoading = ref(false)
const errors = reactive({})

// Forms
const profileForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: ''
})

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const preferencesForm = reactive({
  timezone: 'UTC',
  date_format: 'MM/DD/YYYY',
  currency: 'USD',
  email_notifications: true
})

const apiConfig = reactive({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/'
})

// Load user data
const loadUserData = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  Object.assign(profileForm, {
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || ''
  })
}

// Update profile
const updateProfile = async () => {
  profileLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    success($t('common.messages.updated'))
  } catch (err) {
    error($t('common.messages.failed'))
  } finally {
    profileLoading.value = false
  }
}

// Update password
const updatePassword = async () => {
  if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
    error($t('common.validation.password_mismatch'))
    return
  }
  
  passwordLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    success('Password updated successfully')
    Object.assign(passwordForm, {
      current_password: '',
      new_password: '',
      new_password_confirmation: ''
    })
  } catch (err) {
    error($t('common.messages.failed'))
  } finally {
    passwordLoading.value = false
  }
}

// Update preferences
const updatePreferences = async () => {
  preferencesLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    success($t('common.messages.saved'))
  } catch (err) {
    error($t('common.messages.failed'))
  } finally {
    preferencesLoading.value = false
  }
}

// Copy to clipboard
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    success($t('common.messages.copied'))
  } catch (err) {
    error($t('common.messages.failed'))
  }
}

// Initialize
onMounted(() => {
  loadUserData()
})
</script>
