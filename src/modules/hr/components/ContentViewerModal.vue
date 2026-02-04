<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="$emit('close')"></div>
      
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary-purple/10 via-primary-pink/5 to-transparent px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900">{{ content?.title || 'View Content' }}</h3>
              <p v-if="content?.description" class="mt-1 text-sm text-gray-600">{{ content.description }}</p>
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
        </div>

        <!-- Content -->
        <div class="px-6 py-4">
          <!-- Video Content -->
          <div v-if="content?.content_type === 'video' && content?.video_url" class="mb-4">
            <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                v-if="isVimeoUrl(content.video_url)"
                :src="getVimeoEmbedUrl(content.video_url)"
                class="w-full h-full"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen
              ></iframe>
              <video
                v-else
                :src="content.video_url"
                controls
                class="w-full h-full"
              ></video>
            </div>
          </div>

          <!-- Document Content -->
          <div v-if="content?.content_type === 'document' && content?.file_url" class="mb-4">
            <div class="border border-gray-200 rounded-lg overflow-hidden" style="height: 600px;">
              <iframe
                :src="content.file_url"
                class="w-full h-full"
                frameborder="0"
              ></iframe>
            </div>
          </div>

          <!-- Both Type -->
          <div v-if="content?.content_type === 'both'">
            <div v-if="content?.video_url" class="mb-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Video Content</h4>
              <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  v-if="isVimeoUrl(content.video_url)"
                  :src="getVimeoEmbedUrl(content.video_url)"
                  class="w-full h-full"
                  frameborder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowfullscreen
                ></iframe>
                <video
                  v-else
                  :src="content.video_url"
                  controls
                  class="w-full h-full"
                ></video>
              </div>
            </div>
            <div v-if="content?.file_url" class="mb-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Document</h4>
              <div class="border border-gray-200 rounded-lg overflow-hidden" style="height: 400px;">
                <iframe
                  :src="content.file_url"
                  class="w-full h-full"
                  frameborder="0"
                ></iframe>
              </div>
            </div>
          </div>

          <!-- Support Documents -->
          <div v-if="content?.support_documents && content.support_documents.length > 0" class="mt-4 pt-4 border-t border-gray-200">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Support Documents</h4>
            <div class="space-y-2">
              <div
                v-for="doc in content.support_documents"
                :key="doc.id || doc"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span class="text-sm text-gray-900">{{ doc.name || doc.title || 'Document' }}</span>
                </div>
                <a
                  :href="doc.url || doc.file_url"
                  target="_blank"
                  class="text-sm text-primary-purple hover:text-primary-pink transition-colors"
                >
                  Download
                </a>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div v-if="content?.estimated_time">
                <span class="text-gray-500">Estimated Time:</span>
                <span class="ml-2 font-medium text-gray-900">{{ content.estimated_time }} minutes</span>
              </div>
              <div v-if="assignment?.due_date">
                <span class="text-gray-500">Due Date:</span>
                <span class="ml-2 font-medium text-gray-900">{{ formatDate(assignment.due_date) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div v-if="assignment?.is_mandatory" class="flex items-center text-sm text-red-600">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            This is mandatory content
          </div>
          <div class="flex space-x-3">
            <button
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              v-if="assignment?.status !== 'completed'"
              @click="$emit('acknowledge')"
              :disabled="acknowledging"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-purple rounded-lg hover:bg-primary-pink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ acknowledging ? 'Acknowledging...' : '✅ I Acknowledge' }}
            </button>
            <div
              v-else
              class="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg"
            >
              ✅ Acknowledged
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  content: {
    type: Object,
    default: null
  },
  assignment: {
    type: Object,
    default: null
  },
  acknowledging: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'acknowledge'])

const isVimeoUrl = (url) => {
  if (!url) return false
  return url.includes('vimeo.com')
}

const getVimeoEmbedUrl = (url) => {
  if (!url) return ''
  // Extract video ID from various Vimeo URL formats
  const match = url.match(/(?:vimeo\.com\/|video\/)(\d+)/)
  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}`
  }
  return url
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

