<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          🔗 RC Convergio Widget Integration
        </h1>
        <p class="text-lg text-gray-600">
          Embed our support and live chat widgets on your website
        </p>
      </div>

      <!-- Widget Selection Tabs -->
      <div class="mb-6">
        <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            @click="activeTab = 'support'"
            :class="[
              'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
              activeTab === 'support'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Support Widget</span>
            </div>
          </button>
          <button
            @click="activeTab = 'livechat'"
            :class="[
              'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
              activeTab === 'livechat'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Live Chat Widget</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Support Widget Tab -->
      <div v-if="activeTab === 'support'" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Card Header -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 class="text-xl font-semibold text-gray-900">💬 Support Widget Integration</h2>
          <p class="text-sm text-gray-500 mt-1">
            Embed our unified support widget (Tickets + Knowledge Base) on your website
          </p>
        </div>

        <!-- Card Content -->
        <div class="p-6">
          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="flex items-center space-x-3">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span class="text-gray-600">Loading integration snippet...</span>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 class="text-sm font-medium text-red-800">Failed to load snippet</h3>
                <p class="text-sm text-red-700 mt-1">{{ error }}</p>
              </div>
            </div>
            <button
              @click="loadSnippet"
              class="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>

          <!-- Success State -->
          <div v-else-if="snippet" class="space-y-6">
            <!-- Instructions -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 class="text-sm font-medium text-blue-800 mb-2">📋 Integration Instructions</h3>
              <ol class="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Copy the snippet below</li>
                <li>Paste it before the closing <code class="bg-blue-100 px-1 rounded">&lt;/body&gt;</code> tag of your website</li>
                <li>The widget will automatically appear as a floating button</li>
                <li>Users can click it to access support tickets and knowledge base</li>
              </ol>
            </div>

            <!-- Snippet Display -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Integration Snippet
              </label>
              <div class="relative">
                <textarea
                  ref="snippetTextarea"
                  v-model="snippet"
                  readonly
                  class="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Loading snippet..."
                ></textarea>
                <button
                  @click="copySnippet"
                  :disabled="copying"
                  class="absolute top-3 right-3 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <svg v-if="!copying" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{{ copying ? 'Copying...' : '📋 Copy Snippet' }}</span>
                </button>
              </div>
            </div>

            <!-- Copy Success Message -->
            <div v-if="copySuccess" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm font-medium text-green-800">Snippet copied to clipboard!</span>
              </div>
            </div>

            <!-- Widget Preview -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-700 mb-3">🎯 Widget Preview</h3>
              <div class="bg-white border border-gray-200 rounded-lg p-4 relative" style="height: 200px;">
                <div class="text-xs text-gray-500 mb-2">Your website will show:</div>
                <!-- Floating Button Preview -->
                <div class="absolute bottom-4 right-4">
                  <div class="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 text-sm">
                    <span>💬</span>
                    <span>Help & Support</span>
                  </div>
                </div>
                <div class="text-xs text-gray-500 mt-16">
                  • Floating support button (bottom-right)<br>
                  • Opens ticket creation form<br>
                  • Access to knowledge base<br>
                  • Mobile-friendly design
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div v-if="snippet && !loading" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              <span class="font-medium">Tenant ID:</span> {{ tenantId || 'N/A' }}
              <span class="mx-2">•</span>
              <span class="font-medium">Environment:</span> 
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="env === 'production' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                {{ env || 'development' }}
              </span>
            </div>
            <div class="text-xs text-gray-400">
              Last updated: {{ new Date().toLocaleTimeString() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Live Chat Widget Tab -->
      <div v-if="activeTab === 'livechat'" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Card Header -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 class="text-xl font-semibold text-gray-900">💬 Live Chat Widget Integration</h2>
          <p class="text-sm text-gray-500 mt-1">
            Embed our live chat widget for real-time customer support on your website
          </p>
        </div>

        <!-- Card Content -->
        <div class="p-6">
          <!-- Loading State -->
          <div v-if="liveChatLoading" class="flex items-center justify-center py-12">
            <div class="flex items-center space-x-3">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
              <span class="text-gray-600">Loading live chat snippet...</span>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="liveChatError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 class="text-sm font-medium text-red-800">Failed to load live chat snippet</h3>
                <p class="text-sm text-red-700 mt-1">{{ liveChatError }}</p>
              </div>
            </div>
            <button
              @click="loadLiveChatSnippet"
              class="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>

          <!-- Success State -->
          <div v-else-if="liveChatSnippet" class="space-y-6">
            <!-- Instructions -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-green-800">📋 Live Chat Integration Instructions</h3>
              </div>
              <ol class="text-sm text-green-700 space-y-2 list-decimal list-inside">
                <li class="flex items-start">
                  <span class="font-medium">Copy the live chat snippet below</span>
                </li>
                <li class="flex items-start">
                  <span>Paste it before the closing <code class="bg-green-100 px-2 py-1 rounded text-xs font-mono">&lt;/body&gt;</code> tag of your website</span>
                </li>
                <li class="flex items-start">
                  <span>The live chat widget will appear as a <strong>green floating button (bottom-left)</strong></span>
                </li>
                <li class="flex items-start">
                  <span>Customers can click it to start <strong>real-time conversations</strong> with your agents</span>
                </li>
                <li class="flex items-start">
                  <span>Agents can respond from your <strong>RC Convergio dashboard</strong> at <code class="bg-green-100 px-2 py-1 rounded text-xs font-mono">/service/live-chat</code></span>
                </li>
              </ol>
            </div>

            <!-- Snippet Display -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Live Chat Integration Snippet
              </label>
              <div class="relative">
                <textarea
                  ref="liveChatSnippetTextarea"
                  v-model="liveChatSnippet"
                  readonly
                  class="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Loading live chat snippet..."
                ></textarea>
                <button
                  @click="copyLiveChatSnippet"
                  :disabled="liveChatCopying"
                  class="absolute top-3 right-3 px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <svg v-if="!liveChatCopying" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{{ liveChatCopying ? 'Copying...' : '📋 Copy Snippet' }}</span>
                </button>
              </div>
            </div>

            <!-- Copy Success Message -->
            <div v-if="liveChatCopySuccess" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm font-medium text-green-800">Live chat snippet copied to clipboard!</span>
              </div>
            </div>

            <!-- Widget Preview -->
            <div class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-200 rounded-xl p-6 shadow-sm">
              <div class="flex items-center mb-6">
                <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-800">Live Chat Widget Preview</h3>
                  <p class="text-sm text-gray-600">See how it appears on your website</p>
                </div>
              </div>
              <div class="bg-white border-2 border-green-200 rounded-xl p-8 relative overflow-hidden" style="height: 280px; background-image: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);">
                <!-- Floating Button Preview -->
                <div class="absolute bottom-8 left-8">
                  <div class="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-full shadow-2xl flex items-center space-x-3 text-base font-semibold hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Live Chat</span>
                    <div class="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <!-- Feature List -->
                <div class="absolute top-8 right-8 space-y-3">
                  <div class="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                    <div class="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    <span class="text-sm font-medium text-gray-700">Floating chat button</span>
                  </div>
                  <div class="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                    <div class="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse" style="animation-delay: 0.5s;"></div>
                    <span class="text-sm font-medium text-gray-700">Real-time messaging</span>
                  </div>
                  <div class="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                    <div class="w-3 h-3 bg-teal-500 rounded-full mr-3 animate-pulse" style="animation-delay: 1s;"></div>
                    <span class="text-sm font-medium text-gray-700">Mobile responsive</span>
                  </div>
                </div>
                
                <!-- Status Indicator -->
                <div class="absolute top-4 left-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Online
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div v-if="liveChatSnippet && !liveChatLoading" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              <span class="font-medium">Tenant ID:</span> {{ tenantId || 'N/A' }}
              <span class="mx-2">•</span>
              <span class="font-medium">Environment:</span> 
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="env === 'production' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                {{ env || 'development' }}
              </span>
            </div>
            <div class="text-xs text-gray-400">
              Last updated: {{ new Date().toLocaleTimeString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'
import { useLiveChatStore } from '@/modules/service/store/liveChat'

// Live Chat Store
const liveChatStore = useLiveChatStore()

// Tab State
const activeTab = ref('support')

// Support Widget State
const loading = ref(true)
const error = ref(null)
const snippet = ref('')
const tenantId = ref(null)
const env = ref('development')
const copying = ref(false)
const copySuccess = ref(false)
const snippetTextarea = ref(null)

// Live Chat Widget State
const liveChatLoading = ref(false)
const liveChatError = ref(null)
const liveChatSnippet = ref('')
const liveChatCopying = ref(false)
const liveChatCopySuccess = ref(false)
const liveChatSnippetTextarea = ref(null)

// Methods
const loadSnippet = async () => {
  loading.value = true
  error.value = null
  
  try {
    console.log('Loading integration snippet...')
    const response = await api.get('/integration/snippet')
    
    if (response.data.success) {
      snippet.value = response.data.snippet
      tenantId.value = response.data.tenant_id
      env.value = response.data.env || 'development'
      console.log('Snippet loaded successfully:', response.data)
    } else {
      throw new Error(response.data.message || 'Failed to load snippet')
    }
  } catch (err) {
    console.error('Error loading snippet:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load integration snippet'
  } finally {
    loading.value = false
  }
}

const copySnippet = async () => {
  if (!snippet.value) return
  
  copying.value = true
  copySuccess.value = false
  
  try {
    await navigator.clipboard.writeText(snippet.value)
    copySuccess.value = true
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      copySuccess.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to copy snippet:', err)
    
    // Fallback for older browsers
    snippetTextarea.value?.select()
    document.execCommand('copy')
    copySuccess.value = true
    
    setTimeout(() => {
      copySuccess.value = false
    }, 3000)
  } finally {
    copying.value = false
  }
}

// Live Chat Methods
const loadLiveChatSnippet = async () => {
  liveChatLoading.value = true
  liveChatError.value = null
  
  try {
    console.log('Loading live chat snippet...')
    const response = await api.get('/integration/livechat-snippet')
    
    if (response.data.success) {
      liveChatSnippet.value = response.data.snippet
      tenantId.value = response.data.tenant_id
      env.value = response.data.env || 'development'
      console.log('Live chat snippet loaded successfully:', response.data)
    } else {
      throw new Error(response.data.message || 'Failed to load live chat snippet')
    }
  } catch (err) {
    console.error('Error loading live chat snippet:', err)
    liveChatError.value = err.response?.data?.message || err.message || 'Failed to load live chat snippet'
  } finally {
    liveChatLoading.value = false
  }
}

const copyLiveChatSnippet = async () => {
  if (!liveChatSnippet.value) return
  
  liveChatCopying.value = true
  liveChatCopySuccess.value = false
  
  try {
    await navigator.clipboard.writeText(liveChatSnippet.value)
    liveChatCopySuccess.value = true
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      liveChatCopySuccess.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to copy live chat snippet:', err)
    
    // Fallback for older browsers
    liveChatSnippetTextarea.value?.select()
    document.execCommand('copy')
    liveChatCopySuccess.value = true
    
    setTimeout(() => {
      liveChatCopySuccess.value = false
    }, 3000)
  } finally {
    liveChatCopying.value = false
  }
}

// Watch for tab changes
watch(activeTab, (newTab) => {
  if (newTab === 'livechat') {
    loadLiveChatSnippet()
  }
})

// Lifecycle
onMounted(() => {
  loadSnippet()
})
</script>

