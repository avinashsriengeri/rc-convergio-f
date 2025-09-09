<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? 'Edit Campaign' : 'Create Campaign' }}
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
            <!-- Name -->
            <div class="md:col-span-2">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name *
              </label>
              <BaseInput
                id="name"
                v-model="form.name"
                :error="errors.name"
                placeholder="Enter campaign name"
                required
              />
            </div>

            <!-- Description -->
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.description }"
                placeholder="Enter campaign description"
              ></textarea>
              <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
            </div>

            <!-- Type -->
            <div>
              <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
                Campaign Type *
              </label>
              <select
                id="type"
                v-model="form.type"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.type }"
                required
              >
                <option value="">Select Type</option>
                <option v-for="type in campaignTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
              <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
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
                <option v-for="status in campaignStatuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
              <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
            </div>

            <!-- Subject -->
            <div class="md:col-span-2">
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">
                Email Subject *
              </label>
              <BaseInput
                id="subject"
                v-model="form.subject"
                :error="errors.subject"
                placeholder="Enter email subject line"
                required
              />
            </div>

            <!-- Scheduled At -->
            <div>
              <label for="scheduled_at" class="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Date & Time
              </label>
              <BaseInput
                id="scheduled_at"
                v-model="form.scheduled_at"
                :error="errors.scheduled_at"
                type="datetime-local"
              />
            </div>

            <!-- Recipients (Design only) -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Recipients (Design)</label>
              <div class="space-y-4">
                <div class="flex items-center space-x-4">
                  <label class="inline-flex items-center space-x-2">
                    <input type="radio" class="text-blue-600" value="manual" v-model="form.recipient_mode" />
                    <span class="text-sm text-gray-700">Static Contacts</span>
                  </label>
                  <label class="inline-flex items-center space-x-2">
                    <input type="radio" class="text-blue-600" value="segment" v-model="form.recipient_mode" />
                    <span class="text-sm text-gray-700">Dynamic List (Segment)</span>
                  </label>
                </div>

                <div v-if="form.recipient_mode === 'segment'">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Select Segment</label>
                  <select
                    v-model="form.segment_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a segment</option>
                    <option value="finance">Finance Leads</option>
                    <option value="it_directors">IT Directors</option>
                    <option value="newsletter">Newsletter Subscribers</option>
                  </select>
                </div>

                <div v-if="form.recipient_mode === 'manual'">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Select Contacts</label>
                  <div class="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <label class="inline-flex items-center space-x-2">
                        <input type="checkbox" class="rounded" :value="201" v-model="form.recipient_contact_ids" />
                        <span>John Doe (john@example.com)</span>
                      </label>
                      <label class="inline-flex items-center space-x-2">
                        <input type="checkbox" class="rounded" :value="202" v-model="form.recipient_contact_ids" />
                        <span>Alice Smith (alice@example.com)</span>
                      </label>
                      <label class="inline-flex items-center space-x-2">
                        <input type="checkbox" class="rounded" :value="203" v-model="form.recipient_contact_ids" />
                        <span>Michael Brown (michael@example.com)</span>
                      </label>
                      <label class="inline-flex items-center space-x-2">
                        <input type="checkbox" class="rounded" :value="204" v-model="form.recipient_contact_ids" />
                        <span>Emily Davis (emily@example.com)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-1">Design only. API wiring will be added later.</p>
            </div>

            <!-- Settings -->
            <div>
              <label for="settings" class="block text-sm font-medium text-gray-700 mb-1">
                Campaign Settings
              </label>
              <textarea
                id="settings"
                v-model="form.settings"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.settings }"
                placeholder="Enter campaign settings (JSON format)"
              ></textarea>
              <p v-if="errors.settings" class="mt-1 text-sm text-red-600">{{ errors.settings }}</p>
              <p class="mt-1 text-sm text-gray-500">Optional: JSON settings for campaign configuration</p>
            </div>
          </div>

          <!-- Content Editor -->
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 mb-1">
              Email Content *
            </label>
            <div class="border border-gray-300 rounded-md">
              <div class="bg-gray-50 px-3 py-2 border-b border-gray-300">
                <div class="flex items-center space-x-2">
                  <button
                    type="button"
                    @click="insertTag('{{name}}')"
                    class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Insert Name
                  </button>
                  <button
                    type="button"
                    @click="insertTag('{{email}}')"
                    class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Insert Email
                  </button>
                  <button
                    type="button"
                    @click="insertTag('{{company}}')"
                    class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Insert Company
                  </button>
                </div>
              </div>
              <textarea
                id="content"
                v-model="form.content"
                rows="12"
                class="w-full px-3 py-2 border-0 focus:outline-none focus:ring-0 resize-none"
                :class="{ 'border-red-500': errors.content }"
                placeholder="Enter your email content here. You can use HTML tags and merge fields like {{name}}, {{email}}, {{company}}"
                required
              ></textarea>
            </div>
            <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
            <p class="mt-1 text-sm text-gray-500">You can use HTML tags and merge fields for personalization</p>
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
              type="button"
              variant="outline"
              @click="saveAsTemplate"
              :disabled="loading"
            >
              Save as Template
            </BaseButton>
            <BaseButton
              type="submit"
              variant="primary"
              :loading="loading"
            >
              {{ isEditing ? 'Update Campaign' : 'Create Campaign' }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { success, error as showError } from '@/utils/notifications'
import { useCampaignsStore } from '@/stores/campaigns'
import { campaignsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const props = defineProps({
  campaign: {
    type: Object,
    default: null
  },
  campaignTypes: {
    type: Array,
    default: () => []
  },
  campaignStatuses: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'saved'])
const campaignsStore = useCampaignsStore?.() || null

// Reactive data
const loading = ref(false)
const submitError = ref('')
const errors = reactive({})

const form = reactive({
  name: '',
  description: '',
  type: '',
  status: 'Draft',
  subject: '',
  content: '',
  scheduled_at: '',
  settings: '',
  // Design-only fields (no API calls yet)
  is_template: false,
  recipient_mode: '', // 'contacts' | 'segment'
  recipient_contact_ids: [], // selected contact IDs (static recipients)
  segment_id: '' // selected dynamic segment ID
})

// Computed
const isEditing = computed(() => !!props.campaign)

// Watch for campaign changes to populate form
watch(() => props.campaign, (newCampaign) => {
  if (newCampaign) {
    form.name = newCampaign.name || ''
    form.description = newCampaign.description || ''
    form.type = newCampaign.type || ''
    form.status = newCampaign.status || 'Draft'
    form.subject = newCampaign.subject || ''
    form.content = newCampaign.content || ''
    form.scheduled_at = newCampaign.scheduled_at ? newCampaign.scheduled_at.replace('Z', '') : ''
    form.settings = newCampaign.settings ? JSON.stringify(newCampaign.settings, null, 2) : ''
    // Reset design-only flags for clarity
    form.is_template = false
    form.recipient_mode = ''
    form.recipient_contact_ids = []
    form.segment_id = ''
  } else {
    // Reset form for new campaign
    Object.keys(form).forEach(key => {
      if (key === 'status') {
        form[key] = 'Draft'
      } else {
        form[key] = ''
      }
    })
    form.is_template = false
    form.recipient_mode = ''
    form.recipient_contact_ids = []
    form.segment_id = ''
  }
  // Clear errors
  Object.keys(errors).forEach(key => delete errors[key])
  submitError.value = ''
}, { immediate: true })

// Methods
const insertTag = (tag) => {
  const textarea = document.getElementById('content')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = form.content
  const before = text.substring(0, start)
  const after = text.substring(end, text.length)
  
  form.content = before + tag + after
  
  // Set cursor position after the inserted tag
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + tag.length, start + tag.length)
  })
}

const validateForm = () => {
  const newErrors = {}
  
  if (!form.name.trim()) {
    newErrors.name = 'Campaign name is required'
  }
  
  if (!form.type) {
    newErrors.type = 'Campaign type is required'
  }
  
  if (!form.status) {
    newErrors.status = 'Status is required'
  }
  
  if (!form.subject.trim()) {
    newErrors.subject = 'Email subject is required'
  }
  
  if (!form.content.trim()) {
    newErrors.content = 'Email content is required'
  }
  
  if (form.scheduled_at && new Date(form.scheduled_at) < new Date()) {
    newErrors.scheduled_at = 'Scheduled date cannot be in the past'
  }
  
  if (form.settings) {
    try {
      JSON.parse(form.settings)
    } catch (e) {
      newErrors.settings = 'Settings must be valid JSON'
    }
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
      name: form.name.trim(),
      description: form.description.trim(),
      type: form.type,
      status: form.status,
      subject: form.subject.trim(),
      content: form.content.trim(),
      scheduled_at: form.scheduled_at || null,
      settings: form.settings ? JSON.parse(form.settings) : null,
      // Include recipients and template flags in payload if provided
      ...(form.is_template ? { is_template: true } : {}),
      ...(form.recipient_mode ? { recipient_mode: form.recipient_mode } : {}),
      ...(Array.isArray(form.recipient_contact_ids) && form.recipient_contact_ids.length > 0
        ? { recipient_contact_ids: form.recipient_contact_ids.map(id => Number(id)) }
        : {}),
      ...(form.segment_id ? { segment_id: form.segment_id } : {})
    }
    
    if (isEditing.value) {
      await campaignsAPI.updateCampaign(props.campaign.id, data)
    } else {
      await campaignsAPI.createCampaign(data)
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
      submitError.value = error.response?.data?.message || 'An error occurred while saving the campaign'
    }
  } finally {
    loading.value = false
  }
}

// Design-only handler for Save as Template
const saveAsTemplate = async () => {
  try {
    form.is_template = true
    // If editing existing campaign, persist via store
    if (campaignsStore && props.campaign?.id) {
      await campaignsStore.saveAsTemplate(props.campaign.id)
    }
    success('Template saved')
  } catch (e) {
    showError('Failed to save template')
  }
}
</script>
