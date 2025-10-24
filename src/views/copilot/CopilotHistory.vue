<template>
  <div class="copilot-history">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Conversation History</h1>
          <p class="text-gray-600 mt-1">View your past conversations with Copilot</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search conversations..."
              class="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg class="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            @click="clearHistory"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear History
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="p-6">
      <!-- Filters -->
      <div class="mb-6">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="filter in filters"
            :key="filter.id"
            @click="setFilter(filter.id)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeFilter === filter.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ filter.name }}
          </button>
        </div>
      </div>

      <!-- Conversations List -->
      <div v-if="filteredConversations.length === 0" class="text-center py-12">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
        <p class="text-gray-600">Start chatting with Copilot to see your history here</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="conversation in filteredConversations"
          :key="conversation.id"
          class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          @click="viewConversation(conversation)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900 mb-2">{{ conversation.query }}</h3>
              <p class="text-gray-600 text-sm">{{ conversation.response?.substring(0, 150) }}...</p>
            </div>
            <div class="flex items-center space-x-2 ml-4">
              <span
                class="px-2 py-1 text-xs rounded-full"
                :class="conversation.confidence > 0.8 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
              >
                {{ Math.round(conversation.confidence * 100) }}%
              </span>
              <span class="text-xs text-gray-500">{{ formatTime(conversation.timestamp) }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatDate(conversation.timestamp) }}
              </span>
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {{ conversation.feature || 'General' }}
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click.stop="copyConversation(conversation)"
                class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy conversation"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                @click.stop="deleteConversation(conversation.id)"
                class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete conversation"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center">
        <nav class="flex items-center space-x-2">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="px-3 py-2 text-sm text-gray-700">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCopilotStore } from '@/stores/copilotStore'

const router = useRouter()
const copilotStore = useCopilotStore()

// Reactive state
const searchQuery = ref('')
const activeFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10

// Filters
const filters = ref([
  { id: 'all', name: 'All' },
  { id: 'recent', name: 'Recent' },
  { id: 'high-confidence', name: 'High Confidence' },
  { id: 'low-confidence', name: 'Low Confidence' }
])

// Mock conversation data
const conversations = ref([
  {
    id: 1,
    query: 'How do I create a contact?',
    response: 'I\'ll help you create a new contact. Here\'s how to do it: 1. Go to the Contacts section in the main navigation menu 2. Click the "Add Contact" button 3. Fill in the contact details 4. Save the contact',
    timestamp: new Date(),
    confidence: 0.95,
    feature: 'Contacts',
    page: '/contacts'
  },
  {
    id: 2,
    query: 'How do I move a deal to the next stage?',
    response: 'To move a deal to the next stage, you can either drag and drop the deal in the pipeline view or click on the deal and use the stage selector. The deal will automatically update with the new stage.',
    timestamp: new Date(Date.now() - 86400000),
    confidence: 0.88,
    feature: 'Deals',
    page: '/deals'
  },
  {
    id: 3,
    query: 'What can I do here?',
    response: 'RC Convergio offers a comprehensive suite of tools for managing your business. You can manage contacts, track deals, create marketing campaigns, build websites, and much more. Would you like me to show you around?',
    timestamp: new Date(Date.now() - 172800000),
    confidence: 0.92,
    feature: 'General',
    page: '/dashboard'
  }
])

// Computed properties
const filteredConversations = computed(() => {
  let filtered = conversations.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(conv =>
      conv.query.toLowerCase().includes(query) ||
      conv.response.toLowerCase().includes(query)
    )
  }

  // Filter by active filter
  switch (activeFilter.value) {
    case 'recent':
      filtered = filtered.filter(conv => {
        const now = new Date()
        const convDate = new Date(conv.timestamp)
        return (now - convDate) < 7 * 24 * 60 * 60 * 1000 // Last 7 days
      })
      break
    case 'high-confidence':
      filtered = filtered.filter(conv => conv.confidence > 0.8)
      break
    case 'low-confidence':
      filtered = filtered.filter(conv => conv.confidence <= 0.8)
      break
  }

  // Sort by timestamp (newest first)
  filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(conversations.value.length / itemsPerPage)
})

// Methods
const setFilter = (filterId) => {
  activeFilter.value = filterId
  currentPage.value = 1
}

const viewConversation = (conversation) => {
  router.push(`/copilot/history/${conversation.id}`)
}

const copyConversation = (conversation) => {
  const text = `Query: ${conversation.query}\nResponse: ${conversation.response}`
  navigator.clipboard.writeText(text)
  // You could add a toast notification here
}

const deleteConversation = (conversationId) => {
  if (confirm('Are you sure you want to delete this conversation?')) {
    conversations.value = conversations.value.filter(conv => conv.id !== conversationId)
  }
}

const clearHistory = () => {
  if (confirm('Are you sure you want to clear all conversation history? This action cannot be undone.')) {
    conversations.value = []
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString()
}

// Initialize
onMounted(async () => {
  await copilotStore.initialize()
})
</script>

<style scoped>
.copilot-history {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>

