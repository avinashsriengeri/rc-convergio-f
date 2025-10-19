<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Compare Versions</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-8">
          <div class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading comparison...
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <div class="text-red-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Failed to load comparison</h3>
          <p class="text-gray-500 mb-4">{{ error }}</p>
        </div>

        <!-- Comparison Content -->
        <div v-if="comparison && !loading && !error" class="space-y-6">
          <!-- Version Headers -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-2">
                Version {{ comparison.version1?.version_number }}
                <span v-if="comparison.version1?.is_current" class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Current
                </span>
              </h4>
              <p class="text-xs text-gray-500">
                {{ formatDate(comparison.version1?.created_at) }} • {{ comparison.version1?.created_by || 'Unknown' }}
              </p>
            </div>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-2">
                Version {{ comparison.version2?.version_number }}
                <span v-if="comparison.version2?.is_current" class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Current
                </span>
              </h4>
              <p class="text-xs text-gray-500">
                {{ formatDate(comparison.version2?.created_at) }} • {{ comparison.version2?.created_by || 'Unknown' }}
              </p>
            </div>
          </div>

          <!-- Title Comparison -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <h5 class="text-sm font-medium text-gray-900 mb-2">Title</h5>
              <div class="p-3 bg-white border border-gray-200 rounded-lg">
                <p class="text-sm text-gray-900">{{ comparison.version1?.title || 'No title' }}</p>
              </div>
            </div>
            <div>
              <h5 class="text-sm font-medium text-gray-900 mb-2">Title</h5>
              <div class="p-3 bg-white border border-gray-200 rounded-lg">
                <p class="text-sm text-gray-900">{{ comparison.version2?.title || 'No title' }}</p>
              </div>
            </div>
          </div>

          <!-- Summary Comparison -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <h5 class="text-sm font-medium text-gray-900 mb-2">Summary</h5>
              <div class="p-3 bg-white border border-gray-200 rounded-lg">
                <p class="text-sm text-gray-900">{{ comparison.version1?.summary || 'No summary' }}</p>
              </div>
            </div>
            <div>
              <h5 class="text-sm font-medium text-gray-900 mb-2">Summary</h5>
              <div class="p-3 bg-white border border-gray-200 rounded-lg">
                <p class="text-sm text-gray-900">{{ comparison.version2?.summary || 'No summary' }}</p>
              </div>
            </div>
          </div>

          <!-- Content Comparison -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <h5 class="text-sm font-medium text-gray-900 mb-2">Content</h5>
              <div class="p-3 bg-white border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                <div 
                  class="prose prose-sm max-w-none text-gray-900"
                  v-html="renderedContent1"
                ></div>
              </div>
            </div>
            <div>
              <h5 class="text-sm font-medium text-gray-900 mb-2">Content</h5>
              <div class="p-3 bg-white border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                <div 
                  class="prose prose-sm max-w-none text-gray-900"
                  v-html="renderedContent2"
                ></div>
              </div>
            </div>
          </div>

          <!-- Changes Summary -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 class="text-sm font-medium text-blue-900 mb-2">Changes Summary</h5>
            <div v-if="comparison.changes && Object.keys(comparison.changes).length > 0" class="space-y-4">
              <div v-for="(change, field) in comparison.changes" :key="field" class="border border-blue-200 rounded-lg p-3 bg-white">
                <h6 class="text-sm font-medium text-blue-900 mb-2 capitalize">{{ field }} Changes</h6>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs font-medium text-gray-600 mb-1">From (Version {{ comparison.version1?.version_number }}):</p>
                    <div class="p-2 bg-red-50 border border-red-200 rounded text-sm text-gray-800">
                      {{ change.from || 'No content' }}
                    </div>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-gray-600 mb-1">To (Version {{ comparison.version2?.version_number }}):</p>
                    <div class="p-2 bg-green-50 border border-green-200 rounded text-sm text-gray-800">
                      {{ change.to || 'No content' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4">
              <div class="text-gray-500 text-sm">
                <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No changes detected between these versions
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  articleId: {
    type: [String, Number],
    required: true
  },
  version1: {
    type: Object,
    required: true
  },
  version2: {
    type: Object,
    required: true
  },
  comparisonData: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close'])

// Composables - removed useArticles since modal no longer makes API calls

// State
const comparison = ref(null)
const loading = ref(false)
const error = ref(null)

// Computed
const renderedContent1 = computed(() => {
  if (!comparison.value?.version1?.content) return '<p class="text-gray-500 italic">No content</p>'
  
  return comparison.value.version1.content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
})

const renderedContent2 = computed(() => {
  if (!comparison.value?.version2?.content) return '<p class="text-gray-500 italic">No content</p>'
  
  return comparison.value.version2.content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
})

// Methods - removed loadComparison to prevent duplicate API calls
// Modal now only displays data passed from parent component

const getChangeColor = (type) => {
  const colors = {
    added: 'bg-green-500',
    removed: 'bg-red-500',
    modified: 'bg-yellow-500',
    unchanged: 'bg-gray-500'
  }
  return colors[type] || 'bg-gray-500'
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

// Watchers
watch(() => props.comparisonData, (newData) => {
  if (newData) {
    console.log('Comparison data prop changed, updating comparison:', newData)
    console.log('Version 1 data:', newData.version1)
    console.log('Version 2 data:', newData.version2)
    console.log('Changes data:', newData.changes)
    
    // Check if the data contains an error
    if (newData.error) {
      error.value = newData.error
      comparison.value = null
      loading.value = false
    } else {
      comparison.value = newData
      error.value = null
      loading.value = false
    }
  } else {
    console.log('No comparison data available yet')
    loading.value = true
    error.value = null
    comparison.value = null
  }
}, { immediate: true })

// Lifecycle - removed onMounted to prevent duplicate API calls
// The modal will only display data when comparisonData prop is provided by parent
</script>
