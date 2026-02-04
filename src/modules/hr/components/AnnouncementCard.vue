<template>
  <div
    class="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
    @click="$emit('view', announcement)"
  >
    <div class="p-6">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center space-x-3 flex-1">
          <div :class="categoryIconBg" class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
            <component :is="categoryIcon" class="w-6 h-6" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-bold text-gray-900 group-hover:text-primary-purple transition-colors">{{ announcement.title }}</h3>
            <p class="text-sm text-gray-500 mt-1">
              Posted by <span class="font-medium text-gray-700">{{ announcement.creator?.name || 'HR Team' }}</span>
              <span class="mx-1">•</span>
              <span>{{ formatTimeAgo(announcement.published_at || announcement.created_at) }}</span>
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2 ml-4 flex-shrink-0">
          <AnnouncementCategoryBadge :category="announcement.category" />
          <AnnouncementStatusBadge
            v-if="showStatus"
            :status="getStatus(announcement)"
            :show-dot="true"
          />
        </div>
      </div>

      <div class="mb-4">
        <p class="text-gray-700 line-clamp-3 leading-relaxed" v-html="announcement.message"></p>
      </div>

    <div v-if="announcement.attachment_url" class="mb-4">
      <!-- Image Preview -->
      <div v-if="isImageFile(announcement.attachment_url)" class="rounded-lg overflow-hidden border border-gray-200">
        <img
          v-if="imageBlobUrls[announcement.id]"
          :src="imageBlobUrls[announcement.id]"
          :alt="getFileName(announcement.attachment_url)"
          class="w-full h-32 object-cover"
          @error="handleImageError"
        />
        <div v-else class="w-full h-32 bg-gray-100 flex items-center justify-center">
          <div class="animate-spin rounded-full h-6 w-6 border-2 border-primary-purple border-t-transparent"></div>
        </div>
      </div>
      <!-- Non-Image File -->
      <div v-else class="flex items-center space-x-2 text-sm text-gray-600">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span>Attachment available</span>
      </div>
    </div>

      <div class="flex items-center justify-between pt-4 border-t border-gray-200">
        <div class="flex items-center flex-wrap gap-4 text-sm text-gray-600">
          <button
            v-if="showEngagement"
            @click.stop="$emit('toggle-like')"
            class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-gray-100"
            :class="announcement.is_liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="font-medium">{{ announcement.likes_count || 0 }}</span>
          </button>
          <button
            @click.stop="$emit('view', announcement)"
            class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-gray-100 text-gray-600 hover:text-primary-purple"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span class="font-medium">{{ announcement.comments_count || 0 }}</span>
          </button>
          <div v-if="announcement.is_mandatory && !announcement.is_acknowledged" class="flex items-center space-x-1.5">
            <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span class="text-amber-600 font-medium text-xs">Mandatory</span>
          </div>
          <div v-else-if="announcement.is_acknowledged" class="flex items-center space-x-1.5">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-green-600 font-medium text-xs">Acknowledged</span>
          </div>
        </div>
        <button
          v-if="announcement.is_mandatory && !announcement.is_acknowledged"
          @click.stop="$emit('acknowledge')"
          class="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-primary-purple hover:bg-primary-pink transition-all shadow-sm hover:shadow-md"
        >
          Acknowledge
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import AnnouncementCategoryBadge from './AnnouncementCategoryBadge.vue'
import AnnouncementStatusBadge from './AnnouncementStatusBadge.vue'

const props = defineProps({
  announcement: {
    type: Object,
    required: true
  },
  showStatus: {
    type: Boolean,
    default: true
  },
  showEngagement: {
    type: Boolean,
    default: true
  },
  showViewButton: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click', 'view', 'toggle-like', 'acknowledge'])

const categoryIconBg = computed(() => {
  const classes = {
    general: 'bg-gray-100 text-gray-600',
    policy: 'bg-blue-100 text-blue-600',
    event: 'bg-orange-100 text-orange-600',
    welcome: 'bg-green-100 text-green-600',
    birthday: 'bg-pink-100 text-pink-600'
  }
  return classes[props.announcement.category] || classes.general
})

const categoryIcon = computed(() => {
  const icons = {
    general: () => h('svg', {
      class: 'w-6 h-6',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z'
      })
    ]),
    policy: () => h('svg', {
      class: 'w-6 h-6',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
      })
    ]),
    event: () => h('svg', {
      class: 'w-6 h-6',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
      })
    ]),
    welcome: () => h('svg', {
      class: 'w-6 h-6',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ]),
    birthday: () => h('svg', {
      class: 'w-6 h-6',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
      })
    ])
  }
  return icons[props.announcement.category] || icons.general
})

const getStatus = (announcement) => {
  if (announcement.is_acknowledged) return 'acknowledged'
  if (announcement.is_viewed) return 'viewed'
  if (!announcement.is_viewed) return 'new'
  return announcement.status || 'published'
}

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Recently'
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
}

const stripHtml = (html) => {
  if (!html) return ''
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

// Check if file is an image based on extension
const isImageFile = (url) => {
  if (!url) return false
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp']
  const lowerUrl = url.toLowerCase()
  return imageExtensions.some(ext => lowerUrl.endsWith(ext))
}

const imageBlobUrls = ref({}) // Cache for blob URLs

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
  // Default to employee endpoint for card view (can be adjusted based on route)
  const routePrefix = '/api/employee' // Cards are typically in employee feed
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

// Load image when announcement is available
watch(() => props.announcement, (newAnnouncement) => {
  if (newAnnouncement?.attachment_url && newAnnouncement?.id && isImageFile(newAnnouncement.attachment_url)) {
    loadImageIfNeeded(newAnnouncement)
  }
}, { immediate: true })

onMounted(() => {
  if (props.announcement?.attachment_url && props.announcement?.id && isImageFile(props.announcement.attachment_url)) {
    loadImageIfNeeded(props.announcement)
  }
})

// Get file name from URL
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

// Handle image load errors
const handleImageError = (event) => {
  console.error('Failed to load image:', event.target.src)
  // Hide the image and show placeholder
  event.target.style.display = 'none'
  const parent = event.target.parentElement
  if (parent) {
    parent.innerHTML = '<div class="w-full h-32 bg-gray-100 flex items-center justify-center"><span class="text-gray-400 text-sm">Image unavailable</span></div>'
  }
}

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

