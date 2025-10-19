<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded mb-4"></div>
        <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded mb-8 w-1/2"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center py-12">
        <div class="text-red-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Article not found</h3>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <button
          @click="$router.push('/service/help/admin')"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Back to Admin
        </button>
      </div>
    </div>

    <!-- Article Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Show content only when article is loaded -->
      <div v-if="article">
        <!-- Breadcrumb -->
        <nav class="mb-8">
          <ol class="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <router-link to="/service/help/admin" class="hover:text-blue-600 transition-colors duration-200">
                Admin
              </router-link>
            </li>
            <li>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </li>
            <li class="text-gray-900 font-medium">{{ article.title }}</li>
          </ol>
        </nav>

      <!-- Article Header -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ article.title }}</h1>
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span v-if="article.category" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ article.category.name }}
                </span>
                <span v-if="article.status" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusClass(article.status)">
                  {{ article.status }}
                </span>
                <span v-if="article.updated_at">
                  Updated {{ formatDate(article.updated_at) }}
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <button
                @click="notifySubscribers"
                :disabled="notifying"
                class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="notifying" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Notifying...
                </span>
                <span v-else>Notify Subscribers</span>
              </button>
              <button
                @click="editArticle"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Edit Article
              </button>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Content Tab -->
          <div v-if="activeTab === 'content'" class="space-y-6">
            <!-- Summary -->
            <div v-if="article.summary">
              <h3 class="text-sm font-medium text-gray-900 mb-2">Summary</h3>
              <p class="text-gray-700">{{ article.summary }}</p>
            </div>

            <!-- Content -->
            <div>
              <h3 class="text-sm font-medium text-gray-900 mb-3">Content</h3>
              <!-- Debug info -->
              <div v-if="!article.content" class="text-red-500 text-sm mb-2">
                Debug: No content found. Article: {{ JSON.stringify(article) }}
              </div>
              <div 
                class="prose max-w-none text-gray-700 leading-relaxed"
                v-html="renderedContent"
              ></div>
            </div>
          </div>

          <!-- Attachments Tab -->
          <div v-if="activeTab === 'attachments'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-gray-900">Attachments</h3>
              <button
                @click="showUploadModal = true"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Upload File
              </button>
            </div>

            <!-- Attachments List -->
            <div v-if="attachments.length > 0" class="space-y-3">
              <div
                v-for="attachment in attachments"
                :key="attachment.id"
                class="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ attachment.file_name || attachment.name }}</p>
                    <p class="text-xs text-gray-500">
                      {{ formatFileSize(attachment.file_size || attachment.size) }} • {{ formatDate(attachment.created_at || attachment.uploaded_at) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="downloadAttachment(attachment)"
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Download
                  </button>
                  <button
                    @click="deleteAttachment(attachment.id)"
                    :disabled="deletingAttachment === attachment.id"
                    class="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                  >
                    <span v-if="deletingAttachment === attachment.id">Deleting...</span>
                    <span v-else>Delete</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="text-sm font-medium text-gray-900 mb-2">No attachments</h3>
              <p class="text-sm text-gray-500 mb-4">Upload files to provide additional resources for this article.</p>
            </div>
          </div>

          <!-- Versions Tab -->
          <div v-if="activeTab === 'versions'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-gray-900">Article Versions</h3>
            </div>

            <!-- Versions List -->
            <div v-if="versions.length > 0" class="space-y-3">
              <div
                v-for="version in versions"
                :key="version.id"
                class="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span class="text-xs font-medium text-blue-600">v{{ version.version_number }}</span>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      Version {{ version.version_number }}
                      <span v-if="version.is_current" class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Current
                      </span>
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ formatDate(version.created_at) }} • {{ version.author?.name || 'Unknown' }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="compareVersions(version)"
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Compare
                  </button>
                  <button
                    v-if="!version.is_current"
                    @click="restoreVersion(version.id || version.version_id || version.version_number)"
                    :disabled="restoringVersion === (version.id || version.version_id || version.version_number)"
                    class="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                  >
                    <span v-if="restoringVersion === (version.id || version.version_id || version.version_number)">Restoring...</span>
                    <span v-else>Restore</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="text-sm font-medium text-gray-900 mb-2">No versions</h3>
              <p class="text-sm text-gray-500">Article versions will appear here as you make changes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <UploadModal
      v-if="showUploadModal"
      :article-id="article?.id"
      @close="showUploadModal = false"
      @uploaded="handleFileUploaded"
    />

    <!-- Version Compare Modal -->
    <VersionCompareModal
      v-if="showCompareModal"
      :article-id="article?.id"
      :version1="selectedVersion1"
      :version2="selectedVersion2"
      :comparison-data="comparisonData"
      @close="showCompareModal = false"
    />
      </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticles } from '@/composables/useArticles.js'
import { helpAPI } from '../../../api/helpAPI.js'
import UploadModal from '../../../components/UploadModal.vue'
import VersionCompareModal from '../../../components/VersionCompareModal.vue'

// Route
const route = useRoute()
const router = useRouter()

// Composables
const { 
  getArticleAttachments, 
  uploadAttachment, 
  deleteAttachment: deleteAttachmentAPI,
  notifySubscribers: notifySubscribersAPI,
  getArticleVersions,
  compareVersions: compareVersionsAPI,
  restoreVersion: restoreVersionAPI,
  loading, 
  error 
} = useArticles()

// State
const article = ref(null)
const attachments = ref([])
const versions = ref([])
const activeTab = ref('content')
const showUploadModal = ref(false)
const showCompareModal = ref(false)
const selectedVersion1 = ref(null)
const selectedVersion2 = ref(null)
const comparisonData = ref(null)
const notifying = ref(false)
const deletingAttachment = ref(null)
const restoringVersion = ref(null)

// Tabs configuration
const tabs = [
  { id: 'content', name: 'Content' },
  { id: 'attachments', name: 'Attachments' },
  { id: 'versions', name: 'Versions' }
]

// Computed
const renderedContent = computed(() => {
  console.log('renderedContent computed - article.value:', article.value)
  console.log('renderedContent computed - article.value?.content:', article.value?.content)
  
  if (!article.value?.content) {
    console.log('No content found, returning empty string')
    return ''
  }
  
  // Simple markdown-like rendering
  const rendered = article.value.content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
  
  console.log('Rendered content:', rendered)
  return rendered
})

// Methods
const loadArticle = async () => {
  const articleId = route.params.id
  console.log('Loading article with ID:', articleId)
  if (!articleId) return

  try {
    loading.value = true
    error.value = null
    
    // Load article details from API
    const response = await helpAPI.getArticleDetails(articleId)
    console.log('Article API response:', response)
    
    if (response.data && response.data.data) {
      article.value = response.data.data
      console.log('Article data set:', article.value)
    } else if (response.data) {
      article.value = response.data
      console.log('Article response set:', article.value)
    } else {
      article.value = response
      console.log('Article fallback set:', article.value)
    }
  } catch (err) {
    console.error('Failed to load article:', err)
    error.value = err.response?.data?.message || 'Failed to load article'
    // Fallback to mock data if API fails
    article.value = {
      id: articleId,
      title: 'Sample Article',
      content: 'This is sample content for the article.',
      summary: 'This is a sample summary.',
      status: 'published',
      category: { name: 'General' },
      updated_at: new Date().toISOString()
    }
    console.log('Fallback article data set:', article.value)
  } finally {
    loading.value = false
  }
}

const loadAttachments = async () => {
  if (!article.value?.id) return

  try {
    const response = await getArticleAttachments(article.value.id)
    console.log('Attachments API response:', response)
    // Handle different response structures
    if (response.data) {
      attachments.value = Array.isArray(response.data) ? response.data : response.data.attachments || []
    } else if (response.attachments) {
      attachments.value = response.attachments
    } else if (Array.isArray(response)) {
      attachments.value = response
    } else {
      attachments.value = []
    }
    console.log('Processed attachments:', attachments.value)
  } catch (err) {
    console.error('Failed to load attachments:', err)
    attachments.value = []
  }
}

const loadVersions = async () => {
  if (!article.value?.id) {
    console.log('No article ID available for loading versions')
    return
  }

  try {
    console.log('Loading versions for article ID:', article.value.id)
    const response = await getArticleVersions(article.value.id)
    console.log('Versions API response:', response)
    
    // Handle different response structures
    let fetchedVersions = []
    if (response.data) {
      fetchedVersions = Array.isArray(response.data) ? response.data : response.data.versions || []
    } else if (response.versions) {
      fetchedVersions = response.versions
    } else if (Array.isArray(response)) {
      fetchedVersions = response
    } else {
      fetchedVersions = []
    }
    
    // Sort versions by version_number descending (latest first) for consistent comparison
    versions.value = fetchedVersions.sort((a, b) => {
      const aNum = a.version_number || a.id || 0
      const bNum = b.version_number || b.id || 0
      return bNum - aNum // Descending order
    })
    
    console.log('Processed and sorted versions:', versions.value)
    
    // Log the structure of the first version object for debugging
    if (versions.value.length > 0) {
      console.log('First version object structure:', versions.value[0])
      console.log('Available fields:', Object.keys(versions.value[0]))
    }
  } catch (err) {
    console.error('Failed to load versions:', err)
    versions.value = []
  }
}

const notifySubscribers = async () => {
  if (!article.value?.id) return

  try {
    notifying.value = true
    await notifySubscribersAPI(article.value.id)
    // Show success message
    alert('Subscribers notified successfully!')
  } catch (err) {
    console.error('Failed to notify subscribers:', err)
    alert('Failed to notify subscribers')
  } finally {
    notifying.value = false
  }
}

const deleteAttachment = async (attachmentId) => {
  if (!article.value?.id) return

  try {
    deletingAttachment.value = attachmentId
    await deleteAttachmentAPI(article.value.id, attachmentId)
    // Reload attachments
    await loadAttachments()
  } catch (err) {
    console.error('Failed to delete attachment:', err)
    alert('Failed to delete attachment')
  } finally {
    deletingAttachment.value = null
  }
}

const compareVersions = async (version) => {
  if (!article.value?.id) return

  try {
    selectedVersion1.value = version
    
    // Sort versions by version_number descending (latest first) for consistent comparison
    const sortedVersions = [...versions.value].sort((a, b) => {
      const aNum = a.version_number || a.id || 0
      const bNum = b.version_number || b.id || 0
      return bNum - aNum // Descending order
    })
    
    // Find the index of the clicked version in the sorted array
    const clickedVersionIndex = sortedVersions.findIndex(v => {
      const vId = v.id || v.version_id || v.version_number
      const clickedId = version.id || version.version_id || version.version_number
      return vId === clickedId
    })
    
    // Select a different version for comparison
    let selectedVersion2 = null
    
    if (clickedVersionIndex !== -1) {
      // If there's a version immediately older (next in array), use that
      if (clickedVersionIndex + 1 < sortedVersions.length) {
        selectedVersion2 = sortedVersions[clickedVersionIndex + 1]
      }
      // If this is the oldest version, compare with the newest version
      else if (clickedVersionIndex > 0) {
        selectedVersion2 = sortedVersions[0] // Newest version
      }
      // If only one version exists, show error
      else {
        alert('Cannot compare: Only one version exists. Create more versions to compare.')
        return
      }
    }
    
    // Fallback: if we couldn't find a different version, use current version
    if (!selectedVersion2) {
      selectedVersion2 = versions.value.find(v => v.is_current) || versions.value[0]
    }
    
    selectedVersion2.value = selectedVersion2
    
    if (selectedVersion1.value && selectedVersion2.value) {
      console.log('Version 1 object:', selectedVersion1.value)
      console.log('Version 2 object:', selectedVersion2.value)
      console.log('Comparing versions:', selectedVersion1.value.id, 'vs', selectedVersion2.value.id)
      
      // Ensure we have valid version IDs - try multiple possible field names
      const version1Id = selectedVersion1.value.id || selectedVersion1.value.version_id || selectedVersion1.value.version_number
      const version2Id = selectedVersion2.value.id || selectedVersion2.value.version_id || selectedVersion2.value.version_number
      
      // Check if we're comparing the same version
      if (version1Id === version2Id) {
        alert('Cannot compare: Both versions are the same. Please select different versions.')
        return
      }
      
      if (!version1Id || !version2Id) {
        console.error('Missing version IDs:', { 
          version1Id, 
          version2Id,
          version1Object: selectedVersion1.value,
          version2Object: selectedVersion2.value
        })
        alert('Unable to compare versions: missing version IDs')
        return
      }
      
      // Call the compare API to get the comparison data
      const response = await compareVersionsAPI(
        article.value.id, 
        version1Id, 
        version2Id
      )
      console.log('Version comparison response:', response)
      
      // Store the comparison data to pass to the modal
      console.log('Full API response:', response)
      console.log('Response data:', response.data)
      comparisonData.value = response.data?.comparison || response.comparison || response.data || response
      showCompareModal.value = true
    }
  } catch (err) {
    console.error('Failed to compare versions:', err)
    // Set error state for the modal
    comparisonData.value = { error: err.response?.data?.message || 'Failed to compare versions' }
    showCompareModal.value = true
  }
}

const restoreVersion = async (versionId) => {
  if (!article.value?.id) return

  if (!confirm('Are you sure you want to restore this version? This will overwrite the current content.')) {
    return
  }

  try {
    restoringVersion.value = versionId
    console.log('Restoring version:', versionId, 'for article:', article.value.id)
    await restoreVersionAPI(article.value.id, versionId)
    console.log('Version restored successfully, reloading data...')
    // Reload article and versions
    await loadArticle()
    await loadVersions()
    alert('Version restored successfully!')
  } catch (err) {
    console.error('Failed to restore version:', err)
    alert('Failed to restore version')
  } finally {
    restoringVersion.value = null
  }
}

const handleFileUploaded = () => {
  loadAttachments()
  showUploadModal.value = false
}

const downloadAttachment = async (attachment) => {
  try {
    // Try different possible URL formats
    const downloadUrl = attachment.file_url || 
                       attachment.url || 
                       `/api/admin/help/articles/${article.value.id}/attachments/${attachment.id}/download`
    
    // Create a temporary link and trigger download
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = attachment.file_name || attachment.name || 'attachment'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    console.error('Failed to download attachment:', err)
    alert('Failed to download attachment')
  }
}

const editArticle = () => {
  // Navigate to the admin knowledge base with edit mode
  // We'll pass the article ID as a query parameter to indicate edit mode
  router.push({
    path: '/service/help/admin',
    query: { edit: article.value.id }
  })
}

const getStatusClass = (status) => {
  const classes = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

// Watchers
watch(activeTab, (newTab) => {
  if (newTab === 'versions' && article.value?.id) {
    console.log('Versions tab activated, loading versions for article:', article.value.id)
    loadVersions()
  }
  if (newTab === 'attachments' && article.value?.id) {
    console.log('Attachments tab activated, loading attachments for article:', article.value.id)
    loadAttachments()
  }
})

// Lifecycle
onMounted(() => {
  loadArticle()
  loadAttachments()
  loadVersions()
})
</script>
