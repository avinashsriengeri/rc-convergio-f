<template>
  <div class="copilot-container">
    <!-- Floating Chat Button -->
    <div 
      v-if="!isOpen"
      class="fixed bottom-6 right-6 z-50"
    >
      <button
        @click="toggleChat"
        class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
        :class="{ 'animate-pulse': hasUnreadMessages }"
      >
        <svg v-if="!isTyping" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <div v-else class="w-6 h-6 flex items-center justify-center">
          <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        </div>
        <!-- Unread indicator -->
        <div v-if="hasUnreadMessages" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {{ unreadCount }}
        </div>
      </button>
    </div>

    <!-- Chat Window -->
    <div 
      v-if="isOpen"
      class="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-sm">Chat To Maxi</h3>
          </div>
        </div>
        <button
          @click="toggleChat"
          class="text-white hover:text-gray-200 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Hi! I'm your AI assistant</h3>
          <p class="text-sm text-gray-600 mb-4">Ask me anything about RC Convergio!</p>
          
          <!-- Quick Start Suggestions -->
          <div class="space-y-2">
            <button
              v-for="suggestion in quickStartSuggestions"
              :key="suggestion.id"
              @click="sendQuickMessage(suggestion.text)"
              class="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
            >
              <div class="font-medium text-gray-800">{{ suggestion.title }}</div>
              <div class="text-gray-600">{{ suggestion.description }}</div>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div v-for="message in messages" :key="message.id" class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
          <div 
            class="max-w-[80%] p-3 rounded-lg"
            :class="message.role === 'user' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-gray-200'"
          >
            <div class="text-sm" v-html="formatMessage(message.content)"></div>
            
            <!-- Steps for assistant messages -->
            <div v-if="message.role === 'assistant' && message.steps && message.steps.length > 0" class="mt-3">
              <div class="text-xs font-semibold text-gray-600 mb-2">Steps:</div>
              <ol class="space-y-1">
                <li v-for="(step, index) in message.steps" :key="index" class="text-xs text-gray-700 flex items-start">
                  <span class="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mr-2 mt-0.5 flex-shrink-0">{{ index + 1 }}</span>
                  <span>{{ step }}</span>
                </li>
              </ol>
            </div>
            
            <!-- Suggestions for assistant messages -->
            <div v-if="message.role === 'assistant' && message.suggestions && message.suggestions.length > 0" class="mt-3">
              <div class="text-xs font-semibold text-gray-600 mb-2">Suggestions:</div>
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="suggestion in message.suggestions"
                  :key="suggestion"
                  @click="sendQuickMessage(suggestion)"
                  class="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200 hover:border-blue-300 transition-colors"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>
            
            <!-- Quick Actions for assistant messages -->
            <div v-if="message.role === 'assistant' && message.quick_actions && message.quick_actions.length > 0" class="mt-3">
              <div class="text-xs font-semibold text-gray-600 mb-2">Quick Actions:</div>
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="action in message.quick_actions"
                  :key="action"
                  @click="sendQuickMessage(action)"
                  class="text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded border border-green-200 hover:border-green-300 transition-colors"
                >
                  {{ action }}
                </button>
              </div>
            </div>
            
            <div class="text-xs mt-1 opacity-70">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex justify-start">
          <div class="bg-white border border-gray-200 p-3 rounded-lg">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-4 bg-white border-t border-gray-200">
        <div class="flex space-x-2">
          <input
            v-model="inputMessage"
            @keydown.enter="sendMessage"
            :disabled="isTyping"
            placeholder="Ask me anything about RC Convergio..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
          <button
            @click="sendMessage"
            :disabled="!inputMessage.trim() || isTyping"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        <!-- Feature Cards -->
        <div v-if="showFeatureCards" class="mt-3 grid grid-cols-2 gap-2">
          <button
            v-for="feature in availableFeatures"
            :key="feature.id"
            @click="sendQuickMessage(feature.query)"
            class="p-2 text-xs bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded transition-colors"
          >
            {{ feature.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCopilotStore } from '@/stores/copilotStore'
import { useCopilotService } from '@/services/copilotService'

const router = useRouter()
const copilotStore = useCopilotStore()
const copilotService = useCopilotService()

// Reactive state
const isOpen = ref(false)
const inputMessage = ref('')
const isTyping = ref(false)

// Computed properties
const messages = computed(() => copilotStore.messages)
const hasUnreadMessages = computed(() => copilotStore.unreadCount > 0)
const unreadCount = computed(() => copilotStore.unreadCount)
const showFeatureCards = computed(() => copilotStore.showFeatureCards)
const availableFeatures = computed(() => copilotStore.availableFeatures)

// Quick start suggestions
const quickStartSuggestions = ref([
  {
    id: 1,
    title: "How do I create a contact?",
    text: "How do I create a contact?",
    description: "Step-by-step guide to adding contacts"
  },
  {
    id: 2,
    title: "How do I create a deal?",
    text: "How do I create a deal?",
    description: "Learn to manage your sales pipeline"
  },
  {
    id: 3,
    title: "How do I send an email campaign?",
    text: "How do I create an email campaign?",
    description: "Marketing automation made easy"
  },
  {
    id: 4,
    title: "What can I do here?",
    text: "What can I do here?",
    description: "Explore RC Convergio features"
  }
])

// Methods
const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    copilotStore.markAsRead()
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return

  const message = inputMessage.value.trim()
  inputMessage.value = ''
  
  // Add user message
  copilotStore.addMessage({
    role: 'user',
    content: message,
    timestamp: new Date()
  })

  isTyping.value = true
  scrollToBottom()

  try {
    const response = await copilotService.askQuestion({
      query: message,
      current_page: router.currentRoute.value.path
    })

    // Add assistant response with enhanced format
    copilotStore.addMessage({
      role: 'assistant',
      content: response.data.message,
      timestamp: new Date(),
      type: response.data.type,
      steps: response.data.steps,
      suggestions: response.data.suggestions,
      quick_actions: response.data.quick_actions,
      feature: response.data.feature,
      action: response.data.action,
      navigation: response.data.navigation
    })

    // Handle navigation if provided
    if (response.data.navigation) {
      handleNavigation(response.data.navigation)
    }

  } catch (error) {
    console.error('Copilot error:', error)
    copilotStore.addMessage({
      role: 'assistant',
      content: 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date()
    })
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}

const sendQuickMessage = (message) => {
  inputMessage.value = message
  sendMessage()
}

const handleNavigation = (navigation) => {
  if (navigation && navigation.path) {
    router.push(navigation.path)
  }
}

const formatMessage = (content) => {
  // Convert markdown-like formatting to HTML
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const scrollToBottom = () => {
  const messagesArea = document.querySelector('.copilot-container .overflow-y-auto')
  if (messagesArea) {
    messagesArea.scrollTop = messagesArea.scrollHeight
  }
}

// Initialize copilot
onMounted(async () => {
  await copilotStore.initialize()
  
  // Auto-send greeting when chat opens for first time
  if (messages.value.length === 0) {
    setTimeout(() => {
      sendQuickMessage("Hi")
    }, 500)
  }
})

// Handle keyboard shortcuts
const handleKeydown = (event) => {
  if (event.ctrlKey && event.key === '/') {
    event.preventDefault()
    toggleChat()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.copilot-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Custom scrollbar for messages area */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animation for new messages */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.space-y-4 > * {
  animation: slideIn 0.3s ease-out;
}
</style>
