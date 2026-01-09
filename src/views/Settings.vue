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

          <!-- Email Settings -->
          <div v-if="activeTab === 'email'" class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Email Settings</h3>
              <p class="text-sm text-gray-600 mt-1">Configure your email sending settings for tenant emails.</p>
            </div>
            <div class="px-6 py-6">
              <form @submit.prevent="saveEmailSettings" class="space-y-6">
                <!-- Provider Selection -->
                <div>
                  <label for="email_setting" class="block text-sm font-medium text-gray-700 mb-2">
                    Email Provider
                  </label>
                  <select
                    id="email_setting"
                    v-model="emailForm.email_setting"
                    @change="onProviderChange"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :disabled="emailLoading"
                  >
                    <option value="">Select a provider...</option>
                    <option v-for="(label, key) in emailProviders" :key="key" :value="key">
                      {{ label }}
                    </option>
                  </select>
                  <p v-if="!emailForm.email_setting" class="mt-1 text-sm text-gray-500">
                    Select an email provider to configure your SMTP settings
                  </p>
                </div>

                <!-- Form Fields -->
                <div v-if="emailForm.email_setting" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Left Column -->
                  <div class="space-y-6">
                    <div>
                      <label for="mail_driver" class="block text-sm font-medium text-gray-700 mb-2">
                        Mail Driver
                      </label>
                      <BaseInput
                        id="mail_driver"
                        v-model="emailForm.mail_driver"
                        readonly
                        :error="emailErrors.mail_driver"
                      />
                    </div>
                    <div>
                      <label for="mail_username" class="block text-sm font-medium text-gray-700 mb-2">
                        <span v-if="emailForm.email_setting === 'gmail'">Your Gmail email address</span>
                        <span v-else-if="emailForm.email_setting === 'outlook'">Your Outlook/Office 365 email address</span>
                        <span v-else-if="emailForm.email_setting === 'yahoo'">Your Yahoo email address</span>
                        <span v-else-if="emailForm.email_setting === 'zohomail'">Your Zoho Mail email address</span>
                        <span v-else-if="emailForm.email_setting === 'sendgrid'">Your SendGrid API key</span>
                        <span v-else-if="emailForm.email_setting === 'amazon'">Your AWS IAM username or access key ID</span>
                        <span v-else-if="emailForm.email_setting === 'mailgun'">Your Mailgun SMTP username</span>
                        <span v-else-if="emailForm.email_setting === 'mandrill'">Your Mandrill API key</span>
                        <span v-else-if="emailForm.email_setting === 'sparkpost'">Your SparkPost SMTP username</span>
                        <span v-else>Mail Username</span>
                      </label>
                      <BaseInput
                        id="mail_username"
                        v-model="emailForm.mail_username"
                        type="email"
                        placeholder="Enter email address or username"
                        :readonly="emailLoading"
                        :error="emailErrors.mail_username"
                      />
                    </div>
                    <div>
                      <label for="mail_from_address" class="block text-sm font-medium text-gray-700 mb-2">
                        Mail From Address
                      </label>
                      <BaseInput
                        id="mail_from_address"
                        v-model="emailForm.mail_from_address"
                        type="email"
                        placeholder="sender@example.com"
                        :readonly="emailLoading"
                        :error="emailErrors.mail_from_address"
                      />
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="space-y-6">
                    <div>
                      <label for="mail_host" class="block text-sm font-medium text-gray-700 mb-2">
                        Mail Host
                      </label>
                      <BaseInput
                        id="mail_host"
                        v-model="emailForm.mail_host"
                        placeholder="smtp.example.com"
                        :readonly="isFieldReadonly('mail_host') || emailLoading"
                        :error="emailErrors.mail_host"
                      />
                    </div>
                    <div>
                      <label for="mail_password" class="block text-sm font-medium text-gray-700 mb-2">
                        Mail Password
                      </label>
                      <div class="relative">
                        <BaseInput
                          id="mail_password"
                          v-model="emailForm.mail_password"
                          :type="showPassword ? 'text' : 'password'"
                          placeholder="Enter password or app password"
                          :readonly="emailLoading"
                          :error="emailErrors.mail_password"
                        />
                        <button
                          type="button"
                          @click="showPassword = !showPassword"
                          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label for="mail_port" class="block text-sm font-medium text-gray-700 mb-2">
                        Mail Port
                      </label>
                      <BaseInput
                        id="mail_port"
                        v-model="emailForm.mail_port"
                        placeholder="587"
                        :readonly="isFieldReadonly('mail_port') || emailLoading"
                        :error="emailErrors.mail_port"
                      />
                    </div>
                    <div>
                      <label for="mail_encryption" class="block text-sm font-medium text-gray-700 mb-2">
                        Mail Encryption
                      </label>
                      <BaseInput
                        id="mail_encryption"
                        v-model="emailForm.mail_encryption"
                        placeholder="TLS"
                        :readonly="isFieldReadonly('mail_encryption') || emailLoading"
                        :error="emailErrors.mail_encryption"
                      />
                    </div>
                    <div>
                      <label for="mail_from_name" class="block text-sm font-medium text-gray-700 mb-2">
                        Mail From Name
                      </label>
                      <BaseInput
                        id="mail_from_name"
                        v-model="emailForm.mail_from_name"
                        placeholder="Company Name"
                        :readonly="emailLoading"
                        :error="emailErrors.mail_from_name"
                      />
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div v-if="emailForm.email_setting" class="flex items-center justify-between pt-4 border-t border-gray-200">
                  <BaseButton
                    type="button"
                    variant="secondary"
                    @click="sendTestEmail"
                    :loading="testEmailLoading"
                    :disabled="emailLoading || !isEmailFormValid"
                  >
                    Send Test Mail
                  </BaseButton>
                  <BaseButton
                    type="submit"
                    variant="primary"
                    :loading="emailLoading"
                    :disabled="!isEmailFormValid"
                  >
                    Save Changes
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
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { success, error } from '@/utils/notifications'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { emailSettingsAPI } from '@/services/api'

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

const MailIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>`
}

// Tabs
const tabs = [
  { id: 'profile', name: 'Profile', icon: UserIcon },
  { id: 'security', name: 'Security', icon: ShieldIcon },
  { id: 'preferences', name: 'Preferences', icon: CogIcon },
  { id: 'email', name: 'Email Settings', icon: MailIcon },
  { id: 'api', name: 'API', icon: KeyIcon }
]

// Reactive data
const activeTab = ref('profile')
const profileLoading = ref(false)
const passwordLoading = ref(false)
const preferencesLoading = ref(false)
const errors = reactive({})

// Email Settings
const emailProviders = ref({})
const emailLoading = ref(false)
const testEmailLoading = ref(false)
const showPassword = ref(false)
const readonlyFields = ref([])
const emailForm = reactive({
  email_setting: '',
  mail_driver: 'SMTP',
  mail_host: '',
  mail_port: '',
  mail_username: '',
  mail_password: '',
  mail_encryption: '',
  mail_from_address: '',
  mail_from_name: ''
})
const emailErrors = reactive({})

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

// Email Settings Functions
const loadEmailProviders = async () => {
  try {
    const response = await emailSettingsAPI.getProviders()
    if (response.data.success) {
      emailProviders.value = response.data.data
    }
  } catch (err) {
    console.error('Error loading email providers:', err)
  }
}

const loadEmailSettings = async () => {
  try {
    const response = await emailSettingsAPI.getSettings()
    if (response.data.success && response.data.data) {
      const data = response.data.data
      emailForm.email_setting = data.email_setting || ''
      emailForm.mail_driver = data.mail_driver || 'SMTP'
      emailForm.mail_host = data.mail_host || ''
      emailForm.mail_port = data.mail_port || ''
      emailForm.mail_username = data.mail_username || ''
      emailForm.mail_password = '' // Don't show saved password
      emailForm.mail_encryption = data.mail_encryption || ''
      emailForm.mail_from_address = data.mail_from_address || ''
      emailForm.mail_from_name = data.mail_from_name || ''
      
      // Load readonly fields for current provider
      if (emailForm.email_setting) {
        await loadProviderFields(emailForm.email_setting)
      }
    }
  } catch (err) {
    // 404 or no settings is fine, just means no settings saved yet
    if (err.response?.status !== 404) {
      console.error('Error loading email settings:', err)
    }
  }
}

const loadProviderFields = async (provider) => {
  if (!provider) return
  
  try {
    const response = await emailSettingsAPI.getFields(provider)
    if (response.data.success) {
      const data = response.data.data
      
      // Update readonly fields
      readonlyFields.value = data.readonly_fields || []
      
      // Auto-fill fields from provider config
      if (data.fields) {
        if (data.fields.mail_host) emailForm.mail_host = data.fields.mail_host
        if (data.fields.mail_port) emailForm.mail_port = data.fields.mail_port
        if (data.fields.mail_encryption) emailForm.mail_encryption = data.fields.mail_encryption
        if (data.fields.mail_driver) emailForm.mail_driver = data.fields.mail_driver
      }
      
      // Clear editable fields (user needs to fill these)
      if (!data.readonly_fields || data.readonly_fields.length === 0) {
        // Custom/SMTP - keep existing values if any
      } else {
        // Pre-configured provider - clear username/password if switching providers
        if (emailForm.email_setting !== provider) {
          emailForm.mail_username = ''
          emailForm.mail_password = ''
        }
      }
    }
  } catch (err) {
    console.error('Error loading provider fields:', err)
    error('Failed to load provider configuration')
  }
}

const onProviderChange = async () => {
  // Clear errors
  Object.keys(emailErrors).forEach(key => delete emailErrors[key])
  
  if (emailForm.email_setting) {
    await loadProviderFields(emailForm.email_setting)
  } else {
    readonlyFields.value = []
    // Reset form
    emailForm.mail_host = ''
    emailForm.mail_port = ''
    emailForm.mail_encryption = ''
    emailForm.mail_username = ''
    emailForm.mail_password = ''
  }
}

const isFieldReadonly = (fieldName) => {
  return readonlyFields.value.includes(fieldName)
}

const isEmailFormValid = computed(() => {
  return emailForm.email_setting &&
         emailForm.mail_driver &&
         emailForm.mail_host &&
         emailForm.mail_port &&
         emailForm.mail_username &&
         emailForm.mail_password &&
         emailForm.mail_encryption &&
         emailForm.mail_from_address &&
         emailForm.mail_from_name
})

const sendTestEmail = async () => {
  if (!isEmailFormValid.value) {
    error('Please fill in all required fields before sending a test email')
    return
  }

  // Use SweetAlert2 if available, otherwise prompt
  if (window.Swal) {
    const { value: formValues } = await window.Swal.fire({
      title: 'Send Test Email',
      html: `
        <div class="text-left">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
            <input id="test_email" class="swal2-input" type="email" placeholder="test@example.com" value="">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Send Test Email',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const email = document.getElementById('test_email').value
        
        if (!email.trim()) {
          window.Swal.showValidationMessage('Email address is required')
          return false
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          window.Swal.showValidationMessage('Please enter a valid email address')
          return false
        }
        
        return { email: email }
      }
    })

    if (formValues) {
      testEmailLoading.value = true
      try {
        const testData = {
          email: formValues.email,
          mail_driver: emailForm.mail_driver,
          mail_host: emailForm.mail_host,
          mail_port: emailForm.mail_port,
          mail_username: emailForm.mail_username,
          mail_password: emailForm.mail_password,
          mail_encryption: emailForm.mail_encryption,
          mail_from_address: emailForm.mail_from_address,
          mail_from_name: emailForm.mail_from_name
        }
        
        const response = await emailSettingsAPI.sendTestEmail(testData)
        if (response.data.success) {
          success('Test email sent successfully!')
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to send test email'
        error(errorMsg)
      } finally {
        testEmailLoading.value = false
      }
    }
  } else {
    // Fallback to simple prompt
    const email = prompt('Enter recipient email address:', 'test@example.com')
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      testEmailLoading.value = true
      try {
        const testData = {
          email: email,
          mail_driver: emailForm.mail_driver,
          mail_host: emailForm.mail_host,
          mail_port: emailForm.mail_port,
          mail_username: emailForm.mail_username,
          mail_password: emailForm.mail_password,
          mail_encryption: emailForm.mail_encryption,
          mail_from_address: emailForm.mail_from_address,
          mail_from_name: emailForm.mail_from_name
        }
        
        const response = await emailSettingsAPI.sendTestEmail(testData)
        if (response.data.success) {
          success('Test email sent successfully!')
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to send test email'
        error(errorMsg)
      } finally {
        testEmailLoading.value = false
      }
    }
  }
}

const saveEmailSettings = async () => {
  // Clear previous errors
  Object.keys(emailErrors).forEach(key => delete emailErrors[key])
  
  if (!isEmailFormValid.value) {
    error('Please fill in all required fields')
    return
  }

  emailLoading.value = true
  try {
    const settingsData = {
      email_setting: emailForm.email_setting,
      mail_driver: emailForm.mail_driver,
      mail_host: emailForm.mail_host,
      mail_port: emailForm.mail_port,
      mail_username: emailForm.mail_username,
      mail_password: emailForm.mail_password,
      mail_encryption: emailForm.mail_encryption,
      mail_from_address: emailForm.mail_from_address,
      mail_from_name: emailForm.mail_from_name
    }
    
    const response = await emailSettingsAPI.saveSettings(settingsData)
    if (response.data.success) {
      success('Email settings saved successfully!')
    }
  } catch (err) {
    if (err.response?.status === 422) {
      // Validation errors
      const errors = err.response.data.errors || {}
      Object.keys(errors).forEach(key => {
        emailErrors[key] = Array.isArray(errors[key]) ? errors[key][0] : errors[key]
      })
      error('Please fix the validation errors')
    } else if (err.response?.status === 403) {
      error('Permission denied. Only Tenant Admin or Super Admin can configure email settings.')
    } else {
      const errorMsg = err.response?.data?.message || 'Failed to save email settings'
      error(errorMsg)
    }
  } finally {
    emailLoading.value = false
  }
}

// Watch for tab changes to load email settings when needed
watch(activeTab, (newTab) => {
  if (newTab === 'email' && Object.keys(emailProviders.value).length === 0) {
    loadEmailProviders()
    loadEmailSettings()
  }
})

// Initialize
onMounted(() => {
  loadUserData()
  if (activeTab.value === 'email') {
    loadEmailProviders()
    loadEmailSettings()
  }
})
</script>
