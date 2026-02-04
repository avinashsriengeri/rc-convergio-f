<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="$emit('close')"
  >
    <div
      class="relative top-10 mx-auto p-8 border w-full max-w-3xl shadow-xl rounded-xl bg-white mb-10"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-gray-900">
          {{ announcement ? 'Edit Announcement' : 'Create New Announcement' }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-500 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <!-- Title -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Title *
            </label>
            <input
              v-model="formData.title"
              type="text"
              required
              placeholder="e.g., Annual Company Retreat"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            />
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              v-model="formData.category"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            >
              <option value="">Select category...</option>
              <option value="general">General</option>
              <option value="policy">Policy Update</option>
              <option value="event">Event</option>
              <option value="welcome">Welcome</option>
              <option value="birthday">Birthday</option>
            </select>
          </div>

          <!-- Message -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Message *
            </label>
            <div class="border border-gray-300 rounded-lg">
              <!-- Simple Rich Text Toolbar -->
              <div class="flex items-center space-x-2 p-2 border-b border-gray-200 bg-gray-50">
                <button
                  type="button"
                  @click="formatText('bold')"
                  class="p-1.5 hover:bg-gray-200 rounded"
                  title="Bold"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
                  </svg>
                </button>
                <button
                  type="button"
                  @click="formatText('italic')"
                  class="p-1.5 hover:bg-gray-200 rounded"
                  title="Italic"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </button>
                <button
                  type="button"
                  @click="formatText('underline')"
                  class="p-1.5 hover:bg-gray-200 rounded"
                  title="Underline"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </button>
              </div>
              <textarea
                v-model="formData.message"
                required
                rows="8"
                placeholder="Type your announcement message here..."
                class="w-full px-4 py-3 border-0 focus:ring-0 resize-none"
              ></textarea>
            </div>
            <p class="mt-1 text-xs text-gray-500">HTML is supported. Use simple formatting for best results.</p>
          </div>

          <!-- Attachment -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Attachment
            </label>
            <div
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
              class="border-2 border-dashed border-primary-purple rounded-lg p-8 text-center cursor-pointer hover:bg-purple-50 transition-colors"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.svg"
                @change="handleFileSelect"
                class="hidden"
              />
              <svg class="w-12 h-12 mx-auto text-primary-purple mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="text-sm text-gray-600 mb-1">
                Click to upload or drag and drop
              </p>
              <p class="text-xs text-gray-500">
                SVG, PNG, JPG or PDF (max. 10MB)
              </p>
              <div v-if="selectedFile" class="mt-2 flex items-center justify-center space-x-2">
                <p class="text-sm text-primary-purple font-medium">
                  Selected: {{ selectedFile.name }}
                </p>
                <button
                  type="button"
                  @click.stop="removeFile"
                  class="text-red-500 hover:text-red-700 transition-colors"
                  title="Remove file"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div v-else-if="formData.attachment_url" class="mt-2 flex items-center justify-center space-x-2">
                <p class="text-sm text-gray-700 font-medium">
                  Existing: <a :href="formData.attachment_url" target="_blank" class="text-primary-purple hover:underline">{{ getFileName(formData.attachment_url) }}</a>
                </p>
                <button
                  type="button"
                  @click.stop="removeExistingAttachment"
                  class="text-red-500 hover:text-red-700 transition-colors"
                  title="Remove attachment"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Target Audience -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Target Audience *
            </label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="formData.target_audience_type"
                  type="radio"
                  value="all_employees"
                  required
                  class="mr-2"
                />
                <span>All Employees</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.target_audience_type"
                  type="radio"
                  value="department_specific"
                  required
                  class="mr-2"
                />
                <span>Department Specific</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.target_audience_type"
                  type="radio"
                  value="individual"
                  required
                  class="mr-2"
                />
                <span>Individual Employee</span>
              </label>
            </div>

            <!-- Department Selector -->
            <div v-if="formData.target_audience_type === 'department_specific'" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Select Departments</label>
              <select
                v-model="formData.target_departments"
                multiple
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              >
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
            </div>

            <!-- Employee Selector -->
            <div v-if="formData.target_audience_type === 'individual'" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Select Employees</label>
              <select
                v-model="formData.target_employee_ids"
                multiple
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              >
                <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                  {{ emp.full_name || `${emp.first_name} ${emp.last_name}` }}
                </option>
              </select>
            </div>
          </div>

          <!-- Priority & Mandatory -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
              <select
                v-model="formData.priority"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Mandatory Acknowledgment
              </label>
              <label class="flex items-center mt-2">
                <input
                  v-model="formData.is_mandatory"
                  type="checkbox"
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">Required</span>
              </label>
            </div>
          </div>

          <!-- Publish Options -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Publish Options
            </label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="publishOption"
                  type="radio"
                  value="now"
                  class="mr-2"
                />
                <span>Publish Now</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="publishOption"
                  type="radio"
                  value="later"
                  class="mr-2"
                />
                <span>Schedule for later</span>
              </label>
            </div>

            <!-- Scheduled Date/Time -->
            <div v-if="publishOption === 'later'" class="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  v-model="scheduledDate"
                  type="date"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  v-model="scheduledTime"
                  type="time"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2.5 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleSaveDraft"
            :disabled="submitting"
            class="px-6 py-2.5 text-sm font-medium rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {{ submitting ? 'Saving...' : 'Save Draft' }}
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-6 py-2.5 text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <svg v-if="!submitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>{{ submitting ? 'Publishing...' : 'Publish Announcement' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useHrAnnouncementsStore } from '../store/hrAnnouncements'

const hrAnnouncementsStore = useHrAnnouncementsStore()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  announcement: {
    type: Object,
    default: null
  },
  departments: {
    type: Array,
    default: () => []
  },
  employees: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'saved'])

const fileInput = ref(null)
const selectedFile = ref(null)
const fileRemoved = ref(false)
const submitting = ref(false)
const publishOption = ref('now')
const scheduledDate = ref('')
const scheduledTime = ref('')

const formData = ref({
  title: '',
  category: '',
  message: '',
  attachment_url: null,
  target_audience_type: 'all_employees',
  target_departments: [],
  target_employee_ids: [],
  is_mandatory: false,
  priority: 'medium',
  status: 'draft',
  scheduled_publish_at: null
})

// Define resetForm before using it in watch
const resetForm = () => {
  formData.value = {
    title: '',
    category: '',
    message: '',
    attachment_url: null,
    target_audience_type: 'all_employees',
    target_departments: [],
    target_employee_ids: [],
    is_mandatory: false,
    priority: 'medium',
    status: 'draft',
    scheduled_publish_at: null
  }
  selectedFile.value = null
  fileRemoved.value = false
  publishOption.value = 'now'
  scheduledDate.value = ''
  scheduledTime.value = ''
}

// Load announcement data if editing
const loadAnnouncementData = (announcement) => {
  if (announcement) {
    formData.value = {
      title: announcement.title || '',
      category: announcement.category || '',
      message: convertHtmlToPlainText(announcement.message || ''), // Convert HTML back to plain text for editing
      attachment_url: announcement.attachment_url || null,
      target_audience_type: announcement.target_audience_type || 'all_employees',
      target_departments: announcement.target_departments || [],
      target_employee_ids: announcement.target_employee_ids || [],
      is_mandatory: announcement.is_mandatory || false,
      priority: announcement.priority || 'medium',
      status: announcement.status || 'draft',
      scheduled_publish_at: announcement.scheduled_publish_at || null
    }
    if (announcement.scheduled_publish_at) {
      publishOption.value = 'later'
      const date = new Date(announcement.scheduled_publish_at)
      scheduledDate.value = date.toISOString().split('T')[0]
      scheduledTime.value = date.toTimeString().slice(0, 5)
    } else {
      publishOption.value = 'now'
      scheduledDate.value = ''
      scheduledTime.value = ''
    }
    selectedFile.value = null
    fileRemoved.value = false
  } else {
    resetForm()
  }
}

// Watch for announcement prop changes
watch(() => props.announcement, (newVal) => {
  if (props.show) {
    loadAnnouncementData(newVal)
  }
}, { immediate: true })

// Watch for modal show/hide to load data when opening
watch(() => props.show, (isVisible) => {
  if (isVisible) {
    // When modal opens, load announcement data if available
    if (props.announcement) {
      loadAnnouncementData(props.announcement)
    } else {
      resetForm()
    }
  } else {
    // When modal closes, reset form after a delay
    setTimeout(() => {
      resetForm()
    }, 300)
  }
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }
    selectedFile.value = file
    fileRemoved.value = false // Reset removal flag when new file is selected
  }
}

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }
    selectedFile.value = file
    fileRemoved.value = false // Reset removal flag when new file is selected
  }
}

const removeFile = () => {
  selectedFile.value = null
  fileRemoved.value = true
  if (fileInput.value) {
    fileInput.value.value = '' // Clear the file input
  }
}

const removeExistingAttachment = () => {
  formData.value.attachment_url = null
  fileRemoved.value = true
}

const getFileName = (url) => {
  if (!url) return 'Attachment'
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname
    const parts = path.split('/')
    return parts[parts.length - 1]
  } catch (e) {
    // If URL parsing fails, try to extract filename from path
    const parts = url.split('/')
    return parts[parts.length - 1] || 'Attachment'
  }
}

const formatText = (format) => {
  // Simple text formatting - in production, use a proper rich text editor
  const textarea = document.querySelector('textarea')
  if (!textarea) return
  
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)
  
  let formattedText = ''
  if (format === 'bold') {
    formattedText = `<strong>${selectedText}</strong>`
  } else if (format === 'italic') {
    formattedText = `<em>${selectedText}</em>`
  } else if (format === 'underline') {
    formattedText = `<u>${selectedText}</u>`
  }
  
  formData.value.message = 
    formData.value.message.substring(0, start) +
    formattedText +
    formData.value.message.substring(end)
}

// Convert plain text line breaks to HTML format
const convertLineBreaksToHtml = (text) => {
  if (!text) return ''
  
  // If text already contains HTML tags, return as-is (don't double-convert)
  if (text.includes('<p>') || text.includes('<br>') || text.includes('<div>')) {
    return text
  }
  
  // Convert line breaks to HTML
  // Double line breaks (\n\n) = new paragraph
  // Single line breaks (\n) = <br>
  let html = text
    .replace(/\r\n/g, '\n')  // Normalize Windows line breaks
    .replace(/\r/g, '\n')     // Normalize Mac line breaks
    .replace(/\n\n+/g, '</p><p>')  // Multiple line breaks = paragraph break
    .replace(/\n/g, '<br>')        // Single line break = <br>
  
  // Wrap in <p> tags if not already wrapped
  if (!html.trim().startsWith('<p>')) {
    html = '<p>' + html
  }
  if (!html.trim().endsWith('</p>')) {
    html = html + '</p>'
  }
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '')
  html = html.replace(/<p>\s*<\/p>/g, '')
  
  return html
}

// Convert HTML back to plain text for editing in textarea
const convertHtmlToPlainText = (html) => {
  if (!html) return ''
  
  // If it doesn't contain HTML tags, return as-is
  if (!html.includes('<p>') && !html.includes('<br>') && !html.includes('<div>')) {
    return html
  }
  
  // Create a temporary div to parse HTML
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  
  // Get text content and preserve line breaks
  let text = tmp.textContent || tmp.innerText || ''
  
  // Convert <br> and </p><p> back to line breaks
  // First handle paragraph breaks
  text = html
    .replace(/<\/p>\s*<p>/gi, '\n\n')  // Paragraph breaks = double line break
    .replace(/<br\s*\/?>/gi, '\n')     // <br> = single line break
    .replace(/<\/?p>/gi, '')            // Remove <p> tags
    .replace(/<\/?div>/gi, '')         // Remove <div> tags
    .replace(/<\/?strong>/gi, '')      // Remove <strong> tags (keep text)
    .replace(/<\/?em>/gi, '')          // Remove <em> tags (keep text)
    .replace(/<\/?u>/gi, '')           // Remove <u> tags (keep text)
    .replace(/<\/?b>/gi, '')           // Remove <b> tags (keep text)
    .replace(/<\/?i>/gi, '')           // Remove <i> tags (keep text)
  
  // Get the actual text content
  tmp.innerHTML = html
  text = tmp.textContent || tmp.innerText || ''
  
  // Normalize line breaks
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  
  return text.trim()
}

// Prepare form data - returns FormData if file is present, otherwise JSON object
const prepareFormData = () => {
  const hasFile = selectedFile.value !== null
  const hasExistingFile = props.announcement?.attachment_url
  const isFileRemoved = hasExistingFile && !selectedFile.value && fileRemoved.value
  
  // If file is being removed, use JSON with attachment_url: null
  if (isFileRemoved) {
    return {
      ...formData.value,
      message: convertLineBreaksToHtml(formData.value.message),
      attachment_url: null
    }
  }
  
  if (hasFile) {
    // Use FormData for file upload
    const formDataObj = new FormData()
    
    // Append all form fields
    formDataObj.append('title', formData.value.title)
    formDataObj.append('category', formData.value.category)
    formDataObj.append('message', convertLineBreaksToHtml(formData.value.message))
    formDataObj.append('target_audience_type', formData.value.target_audience_type)
    formDataObj.append('is_mandatory', formData.value.is_mandatory ? '1' : '0')
    formDataObj.append('priority', formData.value.priority || 'medium')
    formDataObj.append('status', formData.value.status || 'draft')
    
    // Append file
    formDataObj.append('attachment', selectedFile.value)
    
    // Handle arrays - Laravel accepts both formats
    if (formData.value.target_departments?.length > 0) {
      formData.value.target_departments.forEach(deptId => {
        formDataObj.append('target_departments[]', deptId.toString())
      })
    }
    
    if (formData.value.target_employee_ids?.length > 0) {
      formData.value.target_employee_ids.forEach(empId => {
        formDataObj.append('target_employee_ids[]', empId.toString())
      })
    }
    
    // Handle scheduled publish
    if (formData.value.scheduled_publish_at) {
      formDataObj.append('scheduled_publish_at', formData.value.scheduled_publish_at)
    }
    
    return formDataObj
  } else {
    // Use JSON (no file)
    const jsonData = {
      ...formData.value,
      message: convertLineBreaksToHtml(formData.value.message)
    }
    
    // Only include attachment_url if it exists (don't send null unnecessarily)
    if (formData.value.attachment_url) {
      jsonData.attachment_url = formData.value.attachment_url
    }
    
    return jsonData
  }
}

const handleSaveDraft = async () => {
  submitting.value = true
  try {
    const payload = prepareFormData()
    
    // Set status to draft
    if (payload instanceof FormData) {
      payload.set('status', 'draft')
    } else {
      payload.status = 'draft'
    }
    
    if (props.announcement) {
      await hrAnnouncementsStore.updateAnnouncement(props.announcement.id, payload)
    } else {
      await hrAnnouncementsStore.createAnnouncement(payload)
    }
    
    emit('saved')
    emit('close')
  } catch (err) {
    console.error('Error saving draft:', err)
    alert(err.response?.data?.message || 'Failed to save draft')
  } finally {
    submitting.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    const payload = prepareFormData()
    const shouldPublish = publishOption.value === 'now'
    
    // Set status
    if (payload instanceof FormData) {
      payload.set('status', shouldPublish ? 'published' : 'draft')
      
      if (publishOption.value === 'later' && scheduledDate.value && scheduledTime.value) {
        const scheduledDateTime = new Date(`${scheduledDate.value}T${scheduledTime.value}`).toISOString()
        payload.set('scheduled_publish_at', scheduledDateTime)
      }
    } else {
      payload.status = shouldPublish ? 'published' : 'draft'
      
      if (publishOption.value === 'later' && scheduledDate.value && scheduledTime.value) {
        payload.scheduled_publish_at = new Date(`${scheduledDate.value}T${scheduledTime.value}`).toISOString()
      }
    }
    
    if (props.announcement) {
      await hrAnnouncementsStore.updateAnnouncement(props.announcement.id, payload)
      
      // If publishing now, call publish endpoint
      if (shouldPublish && payload.status === 'published') {
        await hrAnnouncementsStore.publishAnnouncement(props.announcement.id)
      }
    } else {
      const created = await hrAnnouncementsStore.createAnnouncement(payload)
      
      // If publishing now, call publish endpoint
      if (shouldPublish && created?.id) {
        await hrAnnouncementsStore.publishAnnouncement(created.id)
      }
    }
    
    emit('saved')
    emit('close')
  } catch (err) {
    console.error('Error publishing announcement:', err)
    alert(err.response?.data?.message || 'Failed to publish announcement')
  } finally {
    submitting.value = false
  }
}
</script>

