<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">💬 Live Chat Dashboard</h1>
              <p class="mt-1 text-sm text-gray-500">
                Manage real-time customer conversations and provide instant support
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <!-- Auto-refresh Indicator -->
              <div v-if="!isDevelopment" class="flex items-center space-x-2 text-sm text-gray-500">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Auto-refresh active</span>
              </div>
              
              <!-- Development Mode Indicator -->
              <div v-if="isDevelopment" class="flex items-center space-x-2 text-sm text-orange-600">
                <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Dev mode (manual refresh)</span>
              </div>
              
              <!-- New Messages Indicator -->
              <div v-if="hasNewMessages" class="flex items-center space-x-2 text-sm text-orange-600">
                <div class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span>New messages</span>
              </div>
              
              <!-- Toggle Auto-refresh Button (Development) -->
              <button
                v-if="isDevelopment"
                @click="toggleAutoRefresh"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {{ autoRefreshInterval ? 'Disable Auto-refresh' : 'Enable Auto-refresh' }}
              </button>
              
              <!-- Refresh Button -->
              <button
                @click="refreshData"
                :disabled="liveChatStore.loading.conversations"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': liveChatStore.loading.conversations }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Active Conversations</p>
              <p class="text-2xl font-semibold text-gray-900">{{ liveChatStore.activeConversations.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Avg Response Time</p>
              <p class="text-2xl font-semibold text-gray-900">{{ liveChatStore.stats.averageResponseTime }}m</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Unassigned</p>
              <p class="text-2xl font-semibold text-gray-900">{{ liveChatStore.unassignedConversations.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Customer Satisfaction</p>
              <p class="text-2xl font-semibold text-gray-900">{{ liveChatStore.stats.customerSatisfaction }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Conversations List -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Active Conversations</h2>
                <div class="flex items-center space-x-2">
                  <select
                    v-model="statusFilter"
                    @change="filterConversations"
                    class="text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="waiting">Waiting</option>
                    <option value="assigned">Assigned</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="divide-y divide-gray-200">
              <!-- Loading State -->
              <div v-if="liveChatStore.loading.conversations" class="p-6 text-center">
                <div class="w-6 h-6 border-2 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-gray-500">Loading conversations...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="liveChatStore.errors.conversations" class="p-6 text-center text-red-600">
                <p>{{ liveChatStore.errors.conversations }}</p>
                <button
                  @click="refreshData"
                  class="mt-2 text-sm text-green-600 hover:text-green-700"
                >
                  Try Again
                </button>
              </div>

              <!-- Empty State -->
              <div v-else-if="filteredConversations.length === 0" class="p-6 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No Conversations Found</h3>
                <p class="text-gray-500">No live chat conversations match your current filter.</p>
              </div>

              <!-- Conversations List -->
              <div v-else>
                <div
                  v-for="conversation in filteredConversations"
                  :key="conversation.id"
                  @click="selectConversation(conversation)"
                  class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  :class="{ 'bg-green-50 border-l-4 border-green-500': selectedConversation?.id === conversation.id }"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-2">
                          <p class="text-sm font-medium text-gray-900 truncate">
                            {{ conversation.customer_name || 'Anonymous Customer' }}
                          </p>
                          <span
                            :class="[
                              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                              getStatusBadgeClass(conversation.status)
                            ]"
                          >
                            {{ conversation.status }}
                          </span>
                        </div>
                        <p class="text-sm text-gray-500 truncate">
                          {{ conversation.last_message || 'No messages yet' }}
                        </p>
                        <p class="text-xs text-gray-400">
                          {{ formatTime(conversation.updated_at) }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div v-if="conversation.unread_count > 0" class="w-2 h-2 bg-green-500 rounded-full"></div>
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Panel -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
            <div v-if="!selectedConversation" class="p-6 text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Select a Conversation</h3>
              <p class="text-gray-500">Choose a conversation from the list to start chatting with the customer.</p>
            </div>

            <div v-else class="flex flex-col h-full">
              <!-- Chat Header -->
              <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">
                      {{ selectedConversation.customer_name || 'Anonymous Customer' }}
                    </h3>
                    <p class="text-sm text-gray-500">
                      {{ selectedConversation.customer_email || 'No email provided' }}
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span
                      :class="[
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        getStatusBadgeClass(selectedConversation.status)
                      ]"
                    >
                      {{ selectedConversation.status }}
                    </span>
                    <button
                      @click="closeConversation"
                      class="text-gray-400 hover:text-red-600 transition-colors"
                      title="Close Conversation"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Messages Area -->
              <div class="flex-1 p-4 overflow-y-auto" style="max-height: 400px;">
                <div v-if="liveChatStore.loading.messages" class="text-center py-4">
                  <div class="w-6 h-6 border-2 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-2"></div>
                  <p class="text-sm text-gray-500">Loading messages...</p>
                </div>
                <div v-else-if="liveChatStore.currentConversationMessages.length === 0" class="text-center py-8">
                  <p class="text-gray-500">No messages yet. Start the conversation!</p>
                </div>
                <div v-else class="space-y-4">
                  <div
                    v-for="message in liveChatStore.currentConversationMessages"
                    :key="message.id"
                    class="flex"
                    :class="message.sender_type === 'agent' ? 'justify-end' : 'justify-start'"
                  >
                    <div
                      class="max-w-xs px-4 py-2 rounded-lg"
                      :class="message.sender_type === 'agent' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-900'"
                    >
                      <p class="text-sm">{{ message.message }}</p>
                      <p class="text-xs mt-1 opacity-75">
                        {{ formatTime(message.created_at) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Message Input -->
              <div class="p-4 border-t border-gray-200">
                <div class="flex space-x-2">
                  <input
                    v-model="newMessage"
                    @keypress.enter="sendMessage"
                    type="text"
                    placeholder="Type your message..."
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                    :disabled="liveChatStore.loading.sending"
                  />
                  <button
                    @click="sendMessage"
                    :disabled="!newMessage.trim() || liveChatStore.loading.sending"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <svg v-if="liveChatStore.loading.sending" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
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
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useLiveChatStore } from '../store/liveChat'

// Store
const liveChatStore = useLiveChatStore()

// State
const selectedConversation = ref(null)
const newMessage = ref('')
const statusFilter = ref('')
const autoRefreshInterval = ref(null)
const isDevelopment = ref(true) // Set to false in production

// Computed
const filteredConversations = computed(() => {
  if (!statusFilter.value) {
    return liveChatStore.conversations
  }
  return liveChatStore.conversations.filter(conv => conv.status === statusFilter.value)
})

const hasNewMessages = computed(() => {
  return liveChatStore.conversations.some(conv => conv.unread_count > 0)
})

// Methods
const selectConversation = async (conversation) => {
  selectedConversation.value = conversation
  liveChatStore.setSelectedConversation(conversation)
  
  // Load conversation details and messages
  await liveChatStore.fetchConversationDetails(conversation.id)
  
  // Mark as read
  await liveChatStore.markAsRead(conversation.id)
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return
  
  const result = await liveChatStore.sendAgentMessage(selectedConversation.value.id, newMessage.value.trim())
  
  if (result.success) {
    newMessage.value = ''
    
    // Refresh conversation messages immediately after sending
    setTimeout(async () => {
      await liveChatStore.fetchConversationDetails(selectedConversation.value.id)
    }, 500)
  }
}

const closeConversation = async () => {
  if (!selectedConversation.value) return
  
  const result = await liveChatStore.closeConversation(selectedConversation.value.id)
  
  if (result.success) {
    selectedConversation.value = null
    liveChatStore.setSelectedConversation(null)
  }
}

const refreshData = async () => {
  await liveChatStore.refreshData()
}

const toggleAutoRefresh = () => {
  if (autoRefreshInterval.value) {
    stopAutoRefresh()
  } else {
    startAutoRefresh()
  }
}

const filterConversations = () => {
  // Filter is handled by computed property
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'waiting': 'bg-yellow-100 text-yellow-800',
    'assigned': 'bg-blue-100 text-blue-800',
    'closed': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return date.toLocaleDateString()
}

// Auto-refresh function
const startAutoRefresh = () => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value)
  }
  
  // Skip auto-refresh in development mode to reduce API calls
  if (isDevelopment.value) {
    console.log('Development mode: Auto-refresh disabled to reduce API calls')
    return
  }
  
  // Auto-refresh every 8 seconds (production mode)
  autoRefreshInterval.value = setInterval(async () => {
    await liveChatStore.fetchConversations()
    
    // If a conversation is selected, refresh its messages too
    if (selectedConversation.value) {
      await liveChatStore.fetchConversationDetails(selectedConversation.value.id)
    }
  }, 8000)
}

const stopAutoRefresh = () => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value)
    autoRefreshInterval.value = null
  }
}

// Lifecycle
onMounted(async () => {
  await liveChatStore.refreshData()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})

// Watch for conversation updates
watch(() => liveChatStore.conversations, (newConversations) => {
  // Update selected conversation if it exists
  if (selectedConversation.value) {
    const updatedConversation = newConversations.find(conv => conv.id === selectedConversation.value.id)
    if (updatedConversation) {
      selectedConversation.value = updatedConversation
    }
  }
}, { deep: true })
</script>
