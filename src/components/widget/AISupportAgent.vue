<template>
  <div class="flex flex-col h-full bg-white">

    <!-- Professional Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 flex-shrink-0">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span class="text-blue-600 text-lg font-bold">🤖</span>
        </div>
        <div>
          <h3 class="text-white text-lg font-semibold">AI Support Assistant</h3>
          <p class="text-blue-100 text-sm">How can I help you today?</p>
        </div>
      </div>
      <button
        @click="clearChat"
        class="text-white hover:text-blue-200 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
        title="Clear chat"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- Chat Messages -->
    <div 
      ref="chatContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4"
      style="max-height: calc(100vh - 200px);"
    >

  <!-- Professional Welcome Message -->
  <div v-if="!aiStore.hasMessages" class="text-center py-8">
    <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
      <span class="text-white text-2xl">🤖</span>
    </div>
    <h4 class="text-gray-800 text-lg font-semibold mb-2">Welcome to AI Support</h4>
    <p class="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
      I'm here to help you with any questions or issues you might have. 
      Feel free to ask me anything!
    </p>
    <div class="mt-4 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
      <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
      Online & Ready to Help
    </div>
  </div>

  <!-- Messages -->
  <div
    v-for="message in aiStore.messages"
    :key="message.id"
    class="flex"
    :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
  >
    <div
      class="max-w-[85%] rounded-2xl px-4 py-3 shadow-md"
      :class="message.role === 'user' 
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
        : message.isError 
          ? 'bg-red-50 text-red-800 border border-red-200'
          : 'bg-gray-50 text-gray-800 border border-gray-200'"
    >
      <p class="text-sm leading-relaxed">{{ message.text }}</p>
      
      <!-- Professional Suggestions -->
      <div v-if="message.suggestions && message.suggestions.length > 0" class="mt-3 space-y-2">
        <div class="text-xs font-semibold text-gray-600 mb-2">📚 Suggested Articles:</div>
        <div class="space-y-2">
          <button
            v-for="suggestion in message.suggestions"
            :key="suggestion.title"
            @click="openArticle(suggestion)"
            :disabled="aiStore.loading"
            class="suggestion-button block w-full p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div class="font-medium text-sm text-gray-800">{{ suggestion.title }}</div>
            <div class="text-xs text-gray-600 mt-1 leading-relaxed">{{ suggestion.summary }}</div>
            <div class="text-xs text-blue-600 mt-2 flex items-center">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Click to get AI-powered solution
            </div>
          </button>
        </div>
      </div>

      <!-- Confidence Score -->
      <div v-if="message.confidence > 0 && !message.isError" class="mt-2 text-xs opacity-75">
        Confidence: {{ Math.round(message.confidence) }}%
      </div>

      <!-- Loading Message -->
      <div v-if="message.isLoading" class="mt-3">
        <div class="bg-blue-50 text-blue-800 rounded-lg px-3 py-2 border border-blue-200">
          <div class="flex items-center space-x-2">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <span class="text-sm">{{ message.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Typing Indicator -->
  <div v-if="aiStore.isTyping" class="flex justify-start">
    <div class="bg-indigo-100 text-gray-800 rounded-2xl px-4 py-2 shadow-sm">
      <div class="flex items-center space-x-1">
        <span class="text-sm">AI is typing</span>
        <div class="flex space-x-1">
          <div class="w-1 h-1 bg-gray-600 rounded-full animate-bounce"></div>
          <div class="w-1 h-1 bg-gray-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-1 h-1 bg-gray-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    </div>
  </div>
    </div>

    <!-- Professional Input Area - Enhanced Visibility -->
    <div class="border-t-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 flex-shrink-0 shadow-xl">
      <div class="text-sm font-semibold text-blue-800 mb-3 flex items-center">
        <span class="mr-2">💬</span>
        Send a message
      </div>
      <div class="flex items-center space-x-3">
        <!-- Text Input Field -->
        <div class="flex-1 relative">
          <input
            v-model="messageInput"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Ask me anything... Type your question here"
            class="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-lg transition-all duration-200 placeholder-gray-500"
            :disabled="aiStore.loading"
            style="min-height: 48px;"
            maxlength="500"
          />
          <!-- Character Counter -->
          <div class="absolute bottom-1 right-3 text-xs text-gray-400">
            {{ messageInput.length }}/500
          </div>
          <!-- Clear Button -->
          <button
            v-if="messageInput && !aiStore.loading"
            @click="messageInput = ''"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear message"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Loading Spinner -->
          <div v-if="aiStore.loading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div class="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        </div>
        
        <!-- Send Button -->
        <button
          @click="sendMessage"
          :disabled="!messageInput.trim() || aiStore.loading"
          class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
          style="min-height: 48px; min-width: 48px;"
          title="Send message"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      
      <!-- Quick Action Buttons -->
      <div class="mt-3">
        <div class="text-xs text-gray-600 mb-2">💡 Quick questions:</div>
        <div class="flex flex-wrap gap-2">
          <button
            @click="messageInput = 'How can I contact support?'"
            class="px-3 py-1 bg-white border border-blue-200 text-blue-700 text-xs rounded-full hover:bg-blue-50 transition-colors"
          >
            Contact Support
          </button>
          <button
            @click="messageInput = 'What are your business hours?'"
            class="px-3 py-1 bg-white border border-blue-200 text-blue-700 text-xs rounded-full hover:bg-blue-50 transition-colors"
          >
            Business Hours
          </button>
          <button
            @click="messageInput = 'How do I reset my password?'"
            class="px-3 py-1 bg-white border border-blue-200 text-blue-700 text-xs rounded-full hover:bg-blue-50 transition-colors"
          >
            Reset Password
          </button>
          <button
            @click="messageInput = 'What services do you offer?'"
            class="px-3 py-1 bg-white border border-blue-200 text-blue-700 text-xs rounded-full hover:bg-blue-50 transition-colors"
          >
            Services
          </button>
        </div>
      </div>
      
      <!-- Error Message -->
      <div v-if="aiStore.error" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center">
          <svg class="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm text-red-700">{{ aiStore.error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useAISupportAgentStore } from '@/stores/aiSupportAgent.js'
import api from '@/services/api.js'

// Store
const aiStore = useAISupportAgentStore()

// Reactive data
const messageInput = ref('')
const chatContainer = ref(null)
const tenantId = ref(null)
const authToken = ref(null)

// Secure communication setup
const setupSecureCommunication = () => {
  // Listen for messages from parent window
  window.addEventListener('message', (event) => {
    if (event.data.type === 'TENANT_ID_RESPONSE') {
      tenantId.value = event.data.tenantId
      console.log('AI Agent received tenant ID securely:', tenantId.value)
    }
    
    if (event.data.type === 'AUTH_TOKEN_RESPONSE') {
      authToken.value = event.data.token
      console.log('AI Agent received auth token securely')
    }
  })
}

// Methods
const sendMessage = async () => {
  if (!messageInput.value.trim() || aiStore.loading) return
  
  const message = messageInput.value
  messageInput.value = ''
  
  await aiStore.sendMessage(message)
  await scrollToBottom()
}

const clearChat = () => {
  aiStore.clearChat()
  aiStore.addWelcomeMessage()
}

const openArticle = async (suggestion) => {
  if (aiStore.loading) return
  
  // Add loading message
  aiStore.addMessage({
    id: Date.now(),
    role: 'bot',
    text: 'Let me get the detailed solution for you...',
    suggestions: [],
    confidence: 0,
    timestamp: new Date(),
    isLoading: true
  })
  
  await scrollToBottom()
  
  try {
    // Extract article slug from URL
    const urlParts = suggestion.url.split('/')
    const slug = urlParts[urlParts.length - 1].split('?')[0]
    
    console.log('Opening article:', slug)
    
    // Try the new AI article endpoint first
    try {
      const response = await api.post('/ai/support-agent/article', {
        article_slug: slug,
        tenant_id: tenantId.value || 42
      })
      
      console.log('Article AI response:', response.data)
      
      // Remove loading message
      aiStore.messages = aiStore.messages.filter(msg => !msg.isLoading)
      
      // Add AI response
      aiStore.addMessage({
        id: Date.now() + 1,
        role: 'bot',
        text: response.data.message || 'I found the solution for you!',
        suggestions: response.data.suggestions || [],
        confidence: response.data.confidence || 0,
        timestamp: new Date()
      })
      
    } catch (aiError) {
      console.log('AI article endpoint not available, using fallback')
      
      // Fallback: Get article content and generate intelligent response
      const tenantId = localStorage.getItem('tenant_id') || 42
      const articleResponse = await api.get(`/help/articles/${slug}`, {
        params: { tenant: tenantId }
      })
      
      const article = articleResponse.data.data
      
      // Remove loading message
      aiStore.messages = aiStore.messages.filter(msg => !msg.isLoading)
      
      // Generate intelligent response from article content
      let response = `I found the perfect solution for you!\n\n**${article.title}**\n\n`
      
      if (article.summary) {
        response += `${article.summary}\n\n`
      }
      
      // Extract steps from content
      const steps = aiStore.extractSteps(article.content)
      if (steps.length > 0) {
        response += `**Here's how to resolve this:**\n`
        steps.forEach((step, index) => {
          response += `${index + 1}. ${step}\n`
        })
        response += `\n`
      }
      
      response += `This should help you resolve the issue. If you need any clarification or if the problem persists, feel free to ask me more questions!`
      
      aiStore.addMessage({
        id: Date.now() + 1,
        role: 'bot',
        text: response,
        suggestions: [],
        confidence: 85,
        timestamp: new Date()
      })
    }
    
  } catch (error) {
    console.error('Error opening article:', error)
    
    // Remove loading message
    aiStore.messages = aiStore.messages.filter(msg => !msg.isLoading)
    
    // Add error message
    aiStore.addMessage({
      id: Date.now() + 1,
      role: 'bot',
      text: 'Sorry, I encountered an error while getting the article content. Please try again.',
      suggestions: [],
      confidence: 0,
      timestamp: new Date(),
      isError: true
    })
  }
  
  await scrollToBottom()
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// Lifecycle
onMounted(() => {
  setupSecureCommunication()
  aiStore.addWelcomeMessage()
  console.log('AI Support Agent mounted')
})

// Watch for new messages to auto-scroll
watch(() => aiStore.messages.length, () => {
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .flex-shrink-0 input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Enhanced input visibility */
input[type="text"] {
  font-size: 14px;
  line-height: 1.5;
}

input[type="text"]:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Article suggestion buttons */
.suggestion-button {
  transition: all 0.2s ease;
}

.suggestion-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.suggestion-button:active {
  transform: translateY(0);
}

/* Loading message styling */
.loading-message {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>