<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">Form Settings</h3>
        <div class="flex items-center space-x-3">
          <BaseButton
            variant="secondary"
            size="sm"
            @click="resetForm"
            :disabled="!hasChanges"
          >
            Reset
          </BaseButton>
          <BaseButton
            variant="primary"
            size="sm"
            @click="saveSettings"
            :loading="saving"
            :disabled="!hasChanges"
          >
            Save Settings
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Settings Form -->
    <div class="p-6 space-y-8">
      <!-- Company Creation Settings -->
      <div class="space-y-4">
        <h4 class="text-lg font-medium text-gray-900">Company Creation</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Create Company from Domain
            </label>
            <BaseCheckbox
              v-model="settings.create_company_from_domain"
              label="Automatically create company from email domain"
            />
            <p class="mt-1 text-sm text-gray-500">
              When enabled, a new company will be created based on the submitter's email domain
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Company Name Strategy
            </label>
            <BaseSelect
              v-model="settings.company_name_strategy"
              :options="companyNameStrategies"
              placeholder="Select strategy"
            />
            <p class="mt-1 text-sm text-gray-500">
              How to determine the company name when creating from domain
            </p>
          </div>
        </div>
      </div>

      <!-- Deduplication Strategy -->
      <div class="space-y-4">
        <h4 class="text-lg font-medium text-gray-900">Contact Deduplication</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Dedupe Strategy
            </label>
            <BaseSelect
              v-model="settings.dedupe_strategy"
              :options="dedupeStrategies"
              placeholder="Select strategy"
            />
            <p class="mt-1 text-sm text-gray-500">
              How to handle duplicate contacts (by email, phone, or both)
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Update Existing
            </label>
            <BaseCheckbox
              v-model="settings.update_existing_contact"
              label="Update existing contact with new information"
            />
            <p class="mt-1 text-sm text-gray-500">
              When a duplicate is found, update the existing contact with new form data
            </p>
          </div>
        </div>
      </div>

      <!-- Default Values -->
      <div class="space-y-4">
        <h4 class="text-lg font-medium text-gray-900">Default Values</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Default Lifecycle Stage
            </label>
            <BaseSelect
              v-model="settings.default_lifecycle_stage"
              :options="lifecycleStages"
              placeholder="Select lifecycle stage"
            />
            <p class="mt-1 text-sm text-gray-500">
              Default lifecycle stage for new contacts created from this form
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Default Tags
            </label>
            <BaseMultiSelect
              v-model="settings.default_tags"
              :options="availableTags"
              placeholder="Select tags"
              :searchable="true"
            />
            <p class="mt-1 text-sm text-gray-500">
              Tags to automatically apply to new contacts from this form
            </p>
          </div>
        </div>
      </div>

      <!-- Assignment Rules -->
      <div class="space-y-4">
        <h4 class="text-lg font-medium text-gray-900">Contact Assignment</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Assignment Rule
            </label>
            <BaseSelect
              v-model="settings.assignment_rule"
              :options="assignmentRules"
              placeholder="Select assignment rule"
            />
            <p class="mt-1 text-sm text-gray-500">
              How to assign new contacts to team members
            </p>
          </div>
          
          <div v-if="settings.assignment_rule === 'static'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Assigned Owner
            </label>
            <BaseSelect
              v-model="settings.assigned_owner_id"
              :options="availableOwners"
              placeholder="Select owner"
            />
            <p class="mt-1 text-sm text-gray-500">
              Specific team member to assign all contacts from this form
            </p>
          </div>
        </div>
      </div>

      <!-- Spam Protection -->
      <div class="space-y-4">
        <h4 class="text-lg font-medium text-gray-900">Spam Protection</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Rate Limiting
            </label>
            <BaseInput
              v-model="settings.rate_limit"
              type="number"
              placeholder="Submissions per hour"
              min="1"
              max="100"
            />
            <p class="mt-1 text-sm text-gray-500">
              Maximum submissions allowed per IP address per hour
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              CAPTCHA Protection
            </label>
            <BaseCheckbox
              v-model="settings.enable_captcha"
              label="Enable CAPTCHA verification"
            />
            <p class="mt-1 text-sm text-gray-500">
              Require CAPTCHA completion for form submission
            </p>
          </div>
        </div>
      </div>

      <!-- UTM Tracking -->
      <div class="space-y-4">
        <h4 class="text-lg font-medium text-gray-900">UTM Tracking</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Track UTM Parameters
            </label>
            <BaseCheckbox
              v-model="settings.track_utm"
              label="Automatically capture UTM parameters from URL"
            />
            <p class="mt-1 text-sm text-gray-500">
              Capture utm_source, utm_medium, utm_campaign from the form URL
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Referrer Tracking
            </label>
            <BaseCheckbox
              v-model="settings.track_referrer"
              label="Track referrer URL and page URL"
            />
            <p class="mt-1 text-sm text-gray-500">
              Capture where the user came from and which page they submitted from
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { formsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import BaseMultiSelect from '@/components/ui/BaseMultiSelect.vue'

interface FormSettings {
  create_company_from_domain: boolean
  company_name_strategy: string
  dedupe_strategy: string
  update_existing_contact: boolean
  default_lifecycle_stage: string
  default_tags: string[]
  assignment_rule: string
  assigned_owner_id?: number
  rate_limit: number
  enable_captcha: boolean
  track_utm: boolean
  track_referrer: boolean
}

const route = useRoute()
const { success, error: showError } = useNotifications()

const formId = computed(() => parseInt(route.params.id as string))
const saving = ref(false)
const loading = ref(false)

// Default settings
const defaultSettings: FormSettings = {
  create_company_from_domain: false,
  company_name_strategy: 'domain_only',
  dedupe_strategy: 'email',
  update_existing_contact: true,
  default_lifecycle_stage: 'lead',
  default_tags: [],
  assignment_rule: 'round_robin',
  assigned_owner_id: undefined,
  rate_limit: 10,
  enable_captcha: false,
  track_utm: true,
  track_referrer: true
}

const settings = ref<FormSettings>({ ...defaultSettings })
const originalSettings = ref<FormSettings>({ ...defaultSettings })

// Options for select fields
const companyNameStrategies = [
  { value: 'domain_only', label: 'Domain Only (e.g., "company.com")' },
  { value: 'domain_clean', label: 'Clean Domain (e.g., "Company")' },
  { value: 'custom_field', label: 'Use Custom Company Name Field' }
]

const dedupeStrategies = [
  { value: 'email', label: 'By Email Address' },
  { value: 'phone', label: 'By Phone Number' },
  { value: 'both', label: 'By Email and Phone' },
  { value: 'none', label: 'No Deduplication' }
]

const lifecycleStages = [
  { value: 'lead', label: 'Lead' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'qualified', label: 'Qualified Lead' },
  { value: 'customer', label: 'Customer' }
]

const assignmentRules = [
  { value: 'round_robin', label: 'Round Robin' },
  { value: 'static', label: 'Static Assignment' },
  { value: 'least_assigned', label: 'Least Assigned' },
  { value: 'random', label: 'Random Assignment' }
]

const availableTags = [
  { value: 'website_lead', label: 'Website Lead' },
  { value: 'demo_request', label: 'Demo Request' },
  { value: 'contact_form', label: 'Contact Form' },
  { value: 'newsletter', label: 'Newsletter Signup' }
]

const availableOwners = [
  { value: 1, label: 'John Doe' },
  { value: 2, label: 'Jane Smith' },
  { value: 3, label: 'Mike Johnson' }
]

// Computed properties
const hasChanges = computed(() => {
  return JSON.stringify(settings.value) !== JSON.stringify(originalSettings.value)
})

// Load settings - FIXED: Handle backend nested settings structure
const loadSettings = async () => {
  loading.value = true
  try {
    console.log('Loading form settings for form:', formId.value)
    const response = await formsAPI.getFormSettings(formId.value)
    console.log('API Response:', response)
    
    // Handle different response structures
    let loadedSettings = {}
    if (response.data && response.data.data) {
      loadedSettings = response.data.data
    } else if (response.data) {
      loadedSettings = response.data
    } else {
      loadedSettings = response
    }
    
    console.log('Extracted settings:', loadedSettings)
    
    // If the response has a 'settings' key, extract it
    if (loadedSettings.settings) {
      loadedSettings = loadedSettings.settings
    }
    
    console.log('Final loaded settings:', loadedSettings)
    
    // Merge with defaults - ensure all fields are properly mapped
    const mergedSettings = { ...defaultSettings }
    
    // Map backend fields to frontend settings
    if (loadedSettings.create_company_from_domain !== undefined) {
      mergedSettings.create_company_from_domain = Boolean(loadedSettings.create_company_from_domain)
    }
    if (loadedSettings.company_name_strategy) {
      mergedSettings.company_name_strategy = loadedSettings.company_name_strategy
    }
    if (loadedSettings.dedupe_strategy) {
      mergedSettings.dedupe_strategy = loadedSettings.dedupe_strategy
    }
    if (loadedSettings.update_existing_contact !== undefined) {
      mergedSettings.update_existing_contact = Boolean(loadedSettings.update_existing_contact)
    }
    if (loadedSettings.default_lifecycle_stage) {
      mergedSettings.default_lifecycle_stage = loadedSettings.default_lifecycle_stage
    }
    if (loadedSettings.default_tags && Array.isArray(loadedSettings.default_tags)) {
      mergedSettings.default_tags = [...loadedSettings.default_tags]
    }
    if (loadedSettings.assignment_rule) {
      mergedSettings.assignment_rule = loadedSettings.assignment_rule
    }
    if (loadedSettings.assigned_owner_id) {
      mergedSettings.assigned_owner_id = loadedSettings.assigned_owner_id
    }
    if (loadedSettings.rate_limit !== undefined) {
      mergedSettings.rate_limit = Number(loadedSettings.rate_limit)
    }
    if (loadedSettings.enable_captcha !== undefined) {
      mergedSettings.enable_captcha = Boolean(loadedSettings.enable_captcha)
    }
    if (loadedSettings.track_utm !== undefined) {
      mergedSettings.track_utm = Boolean(loadedSettings.track_utm)
    }
    if (loadedSettings.track_referrer !== undefined) {
      mergedSettings.track_referrer = Boolean(loadedSettings.track_referrer)
    }
    
    console.log('Merged settings:', mergedSettings)
    
    // Update reactive state
    settings.value = mergedSettings
    originalSettings.value = JSON.parse(JSON.stringify(mergedSettings))
    
    console.log('Settings loaded and state updated')
  } catch (err) {
    console.error('Failed to load form settings:', err)
    // Use defaults if loading fails
    settings.value = { ...defaultSettings }
    originalSettings.value = JSON.parse(JSON.stringify(defaultSettings))
  } finally {
    loading.value = false
  }
}

// Save settings - FIXED: Wrap settings in correct format
const saveSettings = async () => {
  saving.value = true
  try {
    // Wrap settings in the correct format expected by backend
    const payload = {
      settings: { ...settings.value }
    }
    
    console.log('Sending payload to API:', payload)
    
    const response = await formsAPI.updateFormSettings(formId.value, payload)
    
    // Check if the response is successful
    if (response && response.status >= 200 && response.status < 300) {
      success('Form settings saved successfully!')
      originalSettings.value = JSON.parse(JSON.stringify(settings.value))
      console.log('Settings saved successfully:', response.data)
    } else {
      throw new Error(`Unexpected response status: ${response?.status}`)
    }
  } catch (err) {
    console.error('Failed to save form settings:', err)
    showError('Failed to save form settings')
  } finally {
    saving.value = false
  }
}

// Reset form
const resetForm = () => {
  settings.value = JSON.parse(JSON.stringify(originalSettings.value))
}

// Watch for assignment rule changes
watch(() => settings.value.assignment_rule, (newRule) => {
  if (newRule !== 'static') {
    settings.value.assigned_owner_id = undefined
  }
})

onMounted(() => {
  loadSettings()
})
</script>
