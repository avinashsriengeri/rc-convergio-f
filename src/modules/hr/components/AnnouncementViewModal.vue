<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="$emit('close')"></div>
      
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary-purple/10 via-primary-pink/5 to-transparent px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <AnnouncementCategoryBadge :category="announcement?.category" />
                <AnnouncementStatusBadge
                  v-if="isEmployeeView"
                  :status="getStatus(announcement)"
                  :show-dot="true"
                />
                <AnnouncementPriorityBadge v-if="announcement?.priority" :priority="announcement.priority" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900">{{ announcement?.title }}</h3>
            </div>
            <button
              @click="$emit('close')"
              class="ml-4 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Info Bar -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Target Audience:</span>
              <p class="font-medium text-gray-900">{{ getTargetAudience(announcement) }}</p>
            </div>
            <div v-if="isHrView">
              <span class="text-gray-500">Status:</span>
              <p class="font-medium text-gray-900">
                <span v-if="announcement?.status === 'published'" class="text-green-600">Published</span>
                <span v-else-if="announcement?.status === 'draft'" class="text-yellow-600">Draft</span>
                <span v-else class="text-gray-600">Archived</span>
              </p>
            </div>
            <div v-if="isHrView && announcement?.published_by_user">
              <span class="text-gray-500">Published By:</span>
              <p class="font-medium text-gray-900">{{ announcement.published_by_user.name }}</p>
            </div>
            <div v-if="announcement?.priority">
              <span class="text-gray-500">Priority:</span>
              <p class="font-medium text-gray-900 capitalize">{{ announcement.priority }}</p>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-6 max-h-96 overflow-y-auto">
          <!-- Message -->
          <div class="prose max-w-none mb-6">
            <div v-html="announcement?.message || ''"></div>
          </div>

          <!-- Attachment -->
          <div v-if="announcement?.attachment_url" class="mb-6">
            <!-- Image Display -->
            <div v-if="isImageFile(announcement.attachment_url)" class="space-y-3">
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <img
                  v-if="imageBlobUrls[announcement?.id]"
                  :src="imageBlobUrls[announcement.id]"
                  :alt="getFileName(announcement.attachment_url)"
                  class="max-w-full max-h-96 mx-auto rounded-lg shadow-md border border-gray-200 object-contain"
                  @error="handleImageError"
                />
                <div v-else class="flex items-center justify-center h-64">
                  <div class="animate-spin rounded-full h-8 w-8 border-4 border-primary-purple border-t-transparent"></div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 text-sm text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="font-medium text-gray-900">{{ getFileName(announcement.attachment_url) }}</span>
                </div>
                <button
                  @click="downloadFile(announcement.attachment_url, getFileName(announcement.attachment_url))"
                  class="px-4 py-2 text-sm font-medium rounded-lg text-primary-purple bg-purple-50 hover:bg-purple-100 transition-colors flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download</span>
                </button>
              </div>
            </div>

            <!-- Non-Image File Display -->
            <div v-else class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p class="font-medium text-gray-900">{{ getFileName(announcement.attachment_url) }}</p>
                    <p class="text-sm text-gray-500">Click to download</p>
                  </div>
                </div>
                <button
                  @click="downloadFile(announcement.attachment_url, getFileName(announcement.attachment_url))"
                  class="px-4 py-2 text-sm font-medium rounded-lg text-primary-purple bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          </div>

          <!-- Stats (HR View) -->
          <div v-if="isHrView" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="text-center p-3 bg-blue-50 rounded-lg">
              <p class="text-2xl font-bold text-blue-600">{{ announcement?.views_count || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">Views</p>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <p class="text-2xl font-bold text-green-600">{{ announcement?.acknowledgments_count || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">Acknowledged</p>
            </div>
            <div class="text-center p-3 bg-pink-50 rounded-lg">
              <p class="text-2xl font-bold text-pink-600">{{ announcement?.likes_count || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">Likes</p>
            </div>
            <div class="text-center p-3 bg-purple-50 rounded-lg">
              <p class="text-2xl font-bold text-purple-600">{{ announcement?.comments_count || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">Comments</p>
            </div>
          </div>

          <!-- Comments Section (Employee View) -->
          <div v-if="isEmployeeView" class="mt-6 border-t border-gray-200 pt-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Comments</h4>
            
            <!-- Comments List -->
            <div v-if="announcement?.comments && announcement.comments.length > 0" class="space-y-4 mb-4">
              <div
                v-for="comment in announcement.comments"
                :key="comment.id"
                class="p-4 bg-gray-50 rounded-lg"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">
                      {{ comment.employee?.first_name }} {{ comment.employee?.last_name }}
                    </p>
                    <p class="text-sm text-gray-600 mt-1">{{ comment.comment }}</p>
                    <p class="text-xs text-gray-500 mt-2">{{ formatDate(comment.created_at) }}</p>
                  </div>
                  <button
                    v-if="canDeleteComment(comment)"
                    @click="$emit('delete-comment', comment.id)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500 text-center py-4">No comments yet</p>

            <!-- Add Comment -->
            <div class="mt-4">
              <textarea
                v-model="newComment"
                rows="3"
                placeholder="Add a comment..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              ></textarea>
              <button
                @click="handleAddComment"
                :disabled="!newComment.trim() || submitting"
                class="mt-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink transition-colors disabled:opacity-50"
              >
                {{ submitting ? 'Posting...' : 'Post Comment' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div v-if="isEmployeeView" class="flex items-center space-x-4">
              <button
                @click="$emit('toggle-like')"
                :class="announcement?.is_liked ? 'text-red-600' : 'text-gray-600'"
                class="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="announcement?.is_liked ? 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' : 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'"
                    :fill="announcement?.is_liked ? 'currentColor' : 'none'"
                  />
                </svg>
                <span>{{ announcement?.likes_count || 0 }}</span>
              </button>
              <button
                v-if="announcement?.is_mandatory && !announcement?.is_acknowledged"
                @click="$emit('acknowledge')"
                :disabled="submitting"
                class="px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Acknowledge Receipt</span>
              </button>
              <span
                v-else-if="announcement?.is_mandatory && announcement?.is_acknowledged"
                class="px-4 py-2 text-sm font-medium rounded-lg text-green-700 bg-green-50 flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Acknowledged</span>
              </span>
            </div>
            <div v-if="isHrView" class="flex items-center space-x-3">
              <button
                @click="$emit('edit')"
                class="px-4 py-2 text-sm font-medium rounded-lg text-primary-purple bg-purple-50 hover:bg-purple-100 transition-colors flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Announcement</span>
              </button>
              <button
                v-if="announcement?.status === 'published'"
                @click="$emit('archive')"
                class="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Archive
              </button>
              <button
                v-if="announcement?.is_mandatory"
                @click="$emit('send-reminders')"
                class="px-4 py-2 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                Send Reminders
              </button>
            </div>
            <button
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import AnnouncementCategoryBadge from './AnnouncementCategoryBadge.vue'
import AnnouncementStatusBadge from './AnnouncementStatusBadge.vue'
import AnnouncementPriorityBadge from './AnnouncementPriorityBadge.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  announcement: {
    type: Object,
    default: null
  },
  isHrView: {
    type: Boolean,
    default: false
  },
  isEmployeeView: {
    type: Boolean,
    default: false
  },
  submitting: {
    type: Boolean,
    default: false
  },
  currentEmployeeId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['close', 'edit', 'archive', 'send-reminders', 'toggle-like', 'acknowledge', 'add-comment', 'delete-comment'])

const newComment = ref('')

const getStatus = (announcement) => {
  if (!announcement) return 'new'
  if (announcement.is_acknowledged) return 'acknowledged'
  if (announcement.is_viewed) return 'viewed'
  return 'new'
}

const getTargetAudience = (announcement) => {
  if (!announcement) return 'N/A'
  if (announcement.target_audience_type === 'all_employees') return 'All Employees'
  if (announcement.target_audience_type === 'department_specific') {
    return `${announcement.target_departments?.length || 0} Department(s)`
  }
  if (announcement.target_audience_type === 'individual') {
    return `${announcement.target_employee_ids?.length || 0} Employee(s)`
  }
  return 'N/A'
}

const getFileName = (url) => {
  if (!url) return 'Attachment'
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname
    const parts = path.split('/')
    return parts[parts.length - 1]
  } catch (e) {
    // Fallback if URL is invalid - try to extract from path string
    const parts = url.split('/')
    return parts[parts.length - 1] || 'Attachment'
  }
}

// Check if file is an image based on extension
const isImageFile = (url) => {
  if (!url) return false
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp']
  const lowerUrl = url.toLowerCase()
  return imageExtensions.some(ext => lowerUrl.endsWith(ext))
}

// Get attachment URL - use API endpoint format
const getAttachmentUrl = (announcement) => {
  if (!announcement?.attachment_url || !announcement?.id) return ''
  
  const url = announcement.attachment_url
  
  // If it's already the correct API endpoint format, use it directly
  if (url.includes('/api/hr/announcements/') && url.includes('/attachment')) {
    return getFullApiUrl(url)
  }
  if (url.includes('/api/employee/announcements/') && url.includes('/attachment')) {
    return getFullApiUrl(url)
  }
  
  // If it's a storage path or old format, convert to API endpoint
  // Determine if HR or employee view
  const isHR = props.isHrView || !props.isEmployeeView
  const routePrefix = isHR ? '/api/hr' : '/api/employee'
  
  // Construct API endpoint: /api/hr/announcements/{id}/attachment
  const apiEndpoint = `${routePrefix}/announcements/${announcement.id}/attachment`
  return getFullApiUrl(apiEndpoint)
}

// Get full API URL with base URL
const getFullApiUrl = (path) => {
  if (!path) return ''
  
  // If already absolute, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // Get API base URL
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL || '/api'
  
  if (apiBaseURL.startsWith('http://') || apiBaseURL.startsWith('https://')) {
    // If path starts with /api, remove it to avoid duplication
    if (path.startsWith('/api/')) {
      return apiBaseURL.replace('/api', '') + path
    }
    return apiBaseURL + (path.startsWith('/') ? path : '/' + path)
  }
  
  // Relative API base URL
  if (path.startsWith('/api/')) {
    return path
  }
  return apiBaseURL + (path.startsWith('/') ? path : '/' + path)
}

// Load image as blob with authentication
const loadImageIfNeeded = async (announcement) => {
  if (!announcement?.attachment_url || !announcement?.id) return
  
  // If already loaded, skip
  if (imageBlobUrls.value[announcement.id]) return
  
  // Get the API endpoint URL
  const apiUrl = getAttachmentUrl(announcement)
  
  if (!apiUrl) return
  
  try {
    // Fetch image with authentication
    const token = localStorage.getItem('access_token')
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'image/*'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to load image')
    }
    
    // Create blob URL
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    
    // Cache the blob URL
    imageBlobUrls.value[announcement.id] = blobUrl
  } catch (error) {
    console.error('Error loading image:', error)
  }
}

// For non-image files, use direct API URL
const getFullImageUrl = (url) => {
  // This is now only used for non-image files in download
  return getAttachmentUrl(props.announcement)
}

// Handle image load errors
const handleImageError = (event) => {
  console.error('Failed to load image:', event.target.src)
  // Hide the image and show error message
  event.target.style.display = 'none'
  const parent = event.target.parentElement
  if (parent) {
    parent.innerHTML = '<p class="text-red-500 text-sm text-center py-4">Failed to load image</p>'
  }
}

// Download file function (downloads instead of opening in new tab)
const downloadFile = async (url, filename) => {
  if (!url || !props.announcement?.id) return
  
  try {
    // Get the API endpoint URL
    const apiUrl = getAttachmentUrl(props.announcement)
    
    if (!apiUrl) return
    
    // Fetch file with authentication
    const token = localStorage.getItem('access_token')
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to download file')
    }
    
    // Create blob and download
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename || getFileName(props.announcement.attachment_url) || 'attachment'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up blob URL
    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Error downloading file:', error)
    alert('Failed to download file. Please try again.')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const canDeleteComment = (comment) => {
  if (!props.currentEmployeeId || !comment.employee) return false
  return comment.employee.id === props.currentEmployeeId
}

const handleAddComment = () => {
  if (!newComment.value.trim()) return
  emit('add-comment', newComment.value.trim())
  newComment.value = ''
}

// Load image when announcement is loaded
watch(() => props.announcement, (newAnnouncement) => {
  if (newAnnouncement?.attachment_url && newAnnouncement?.id && isImageFile(newAnnouncement.attachment_url)) {
    loadImageIfNeeded(newAnnouncement)
  }
}, { immediate: true })

// Also load on mount if announcement is already available
onMounted(() => {
  if (props.announcement?.attachment_url && props.announcement?.id && isImageFile(props.announcement.attachment_url)) {
    loadImageIfNeeded(props.announcement)
  }
})

// Clean up blob URLs on unmount
onUnmounted(() => {
  Object.values(imageBlobUrls.value).forEach(url => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
  imageBlobUrls.value = {}
})
</script>

