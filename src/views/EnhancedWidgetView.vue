<template>
  <div class="h-full bg-gray-50 flex flex-col">
    <!-- Header with Tabs -->
    <div class="bg-white border-b border-gray-200">
      <div class="flex">
        <button
          v-if="modules.includes('faq')"
          @click="activeTab = 'faq'"
          :class="[
            'flex-1 px-4 py-3 text-sm font-medium text-center transition-colors',
            activeTab === 'faq' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          ]"
        >
          <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Help Center
        </button>
        
        <button
          v-if="modules.includes('ticket')"
          @click="activeTab = 'ticket'"
          :class="[
            'flex-1 px-4 py-3 text-sm font-medium text-center transition-colors',
            activeTab === 'ticket' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          ]"
        >
          <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Contact Us
        </button>

        <button
          v-if="modules.includes('ai')"
          @click="activeTab = 'ai'"
          :class="[
            'flex-1 px-4 py-3 text-sm font-medium text-center transition-colors',
            activeTab === 'ai' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          ]"
        >
          <span class="text-base mr-2">🤖</span>
          Maxi
        </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="flex-1 overflow-y-auto">
      <!-- Help Center Tab -->
      <div v-if="activeTab === 'faq'" class="h-full">
        <!-- Search Bar -->
        <div class="p-4 bg-white border-b border-gray-200">
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="searchArticles"
              type="text"
              placeholder="Search for help articles..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Hierarchical Categories -->
        <div v-if="!selectedArticle && !searchQuery" class="p-4">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Knowledge Base</h3>
          
          <!-- All Articles Button -->
          <button
            @click="clearSearchAndExpandAll()"
            class="w-full text-left p-3 bg-blue-50 border border-blue-200 rounded-lg mb-2 transition-colors"
          >
            <span class="font-medium text-sm text-blue-700">All Articles</span>
          </button>

          <!-- Category List -->
          <div class="space-y-1">
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-group"
            >
              <!-- Category Header -->
              <button
                @click="toggleCategory(category.id)"
                class="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div class="flex items-center">
                  <div class="w-2 h-2 rounded-full mr-2 bg-gray-400"></div>
                  <span class="font-medium text-sm text-gray-900">{{ category.name }}</span>
                </div>
                <div class="flex items-center">
                  <svg 
                    class="w-3 h-3 transition-transform duration-200"
                    :class="{ 'rotate-90': expandedCategories.includes(category.id) }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              <!-- Category Description -->
              <div v-if="category.description" class="text-xs text-gray-500 mt-1 ml-5 mb-2">
                {{ category.description }}
              </div>

              <!-- Articles under this category (when expanded) -->
              <div 
                v-if="expandedCategories.includes(category.id)"
                class="ml-5 space-y-1 mt-2"
              >
                <div
                  v-for="article in getCategoryArticles(category.id)"
                  :key="article.id"
                  @click="loadArticle(article.slug)"
                  class="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900 mb-1">{{ article.title }}</h4>
                    <p class="text-xs text-gray-600 line-clamp-2">{{ article.summary }}</p>
                  </div>
                </div>
                
                <!-- No articles message -->
                <div v-if="getCategoryArticles(category.id).length === 0" class="p-3 text-xs text-gray-500 italic bg-gray-50 rounded-lg">
                  No articles in this category
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Results Only (when searching) -->
        <div v-if="!selectedArticle && searchQuery && articles.length > 0" class="p-4">
          <div class="mb-3">
            <h3 class="text-sm font-medium text-gray-900">Search Results</h3>
            <p class="text-xs text-gray-500">{{ articles.length }} articles found</p>
          </div>
          
          <div class="space-y-3">
            <button
              v-for="article in articles"
              :key="article.id"
              @click="loadArticle(article.slug)"
              class="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="font-medium text-sm text-gray-900 mb-2">{{ article.title }}</div>
              <div class="text-xs text-gray-600 line-clamp-2">{{ article.summary }}</div>
            </button>
          </div>
        </div>

        <!-- Article Detail -->
        <div v-if="selectedArticle" class="h-full flex flex-col">
          <!-- Article Header -->
          <div class="p-4 bg-white border-b border-gray-200">
            <button
              @click="selectedArticle = null"
              class="flex items-center text-sm text-gray-600 hover:text-gray-800 mb-2"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to articles
            </button>
            <h2 class="text-lg font-semibold text-gray-900">{{ selectedArticle.title }}</h2>
          </div>

          <!-- Article Content -->
          <div class="flex-1 p-4 overflow-y-auto">
            <div class="prose prose-sm max-w-none">
              <div v-html="renderedContent"></div>
            </div>
            
            <!-- Article Attachments -->
            <div v-if="selectedArticle.attachments && selectedArticle.attachments.length > 0" class="mt-6">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Attachments</h4>
              <div class="space-y-2">
                <div 
                  v-for="attachment in selectedArticle.attachments" 
                  :key="attachment.id"
                  class="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <!-- Image Preview -->
                  <div v-if="attachment.mime_type && attachment.mime_type.startsWith('image/')" class="flex-shrink-0 mr-3">
                    <img 
                      :src="getAttachmentUrl(attachment.url)" 
                      :alt="attachment.filename"
                      class="w-12 h-12 object-cover rounded border border-gray-200"
                      @error="handleImageError"
                    />
                  </div>
                  
                  <!-- File Icon for non-images -->
                  <div v-else class="flex-shrink-0 mr-3">
                    <div class="w-12 h-12 bg-blue-100 rounded border border-blue-200 flex items-center justify-center">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  
                  <!-- File Info -->
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ attachment.filename }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(attachment.size) }}</p>
                  </div>
                  
                  <!-- Download Button -->
                  <button 
                    @click="downloadAttachment(attachment)"
                    class="ml-3 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    :title="`Download ${attachment.filename}`"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Article Feedback - DIRECTLY BELOW ARTICLE CONTENT -->
            <div style="margin-top: 20px; padding: 20px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px;">
              <div style="text-align: center; font-size: 16px; font-weight: bold; color: #374151; margin-bottom: 15px;">Was this article helpful?</div>
              
              <!-- Feedback Buttons - FORCE VISIBLE -->
              <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                <button
                  @click="submitFeedback(true)"
                  :disabled="submittingFeedback"
                  style="flex: 1; padding: 15px; background: #10b981; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: bold; cursor: pointer; min-height: 50px; display: block; visibility: visible; opacity: 1;"
                  onmouseover="this.style.background='#059669'"
                  onmouseout="this.style.background='#10b981'"
                >
                  👍 YES, IT HELPED
                </button>
                <button
                  @click="submitFeedback(false)"
                  :disabled="submittingFeedback"
                  style="flex: 1; padding: 15px; background: #ef4444; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: bold; cursor: pointer; min-height: 50px; display: block; visibility: visible; opacity: 1;"
                  onmouseover="this.style.background='#dc2626'"
                  onmouseout="this.style.background='#ef4444'"
                >
                  👎 NO, NOT HELPFUL
                </button>
              </div>
              
              <!-- Thank you message -->
              <div v-if="feedbackSubmitted" style="text-align: center; margin-top: 15px;">
                <div style="color: #059669; font-weight: bold; margin-bottom: 10px;">✅ Thank you for your feedback!</div>
                <button
                  v-if="!userFeedback && modules.includes('ticket')"
                  @click="switchToTicket"
                  style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer;"
                >
                  Still need help? Contact us
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p class="text-sm text-gray-500 mt-2">Loading...</p>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && articles.length === 0 && !selectedArticle" class="p-8 text-center">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-sm text-gray-500">No articles found</p>
        </div>
      </div>

      <!-- Contact Us Tab -->
      <div v-if="activeTab === 'ticket'" class="h-full">
        <div class="p-4">
          <div class="max-w-md mx-auto">
            <div class="mb-4">
              <h2 class="text-lg font-semibold text-gray-900 mb-1">Submit a Support Ticket</h2>
              <p class="text-xs text-gray-600">
                Describe your issue and we'll get back to you as soon as possible.
              </p>
            </div>

            <form @submit.prevent="submitTicket" class="space-y-3">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter your full name"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter your email address"
                />
              </div>

              <!-- Subject -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  v-model="form.subject"
                  type="text"
                  required
                  class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Brief description of your issue"
                />
              </div>

              <!-- Message -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  v-model="form.message"
                  required
                  rows="3"
                  class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  placeholder="Please provide detailed information about your issue..."
                ></textarea>
              </div>

              <!-- Priority -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  v-model="form.priority"
                  class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium" selected>Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="submitting"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>{{ submitting ? 'Submitting...' : 'Submit Ticket' }}</span>
              </button>
            </form>

            <!-- Success Message -->
            <div v-if="success" class="mt-3 bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-green-800 mb-1">Ticket Submitted Successfully!</h3>
                  <p class="text-sm text-green-700 mb-2">
                    Your ticket #{{ ticketId }} has been created. We'll get back to you soon.
                  </p>
                  <p class="text-xs text-green-600 mb-3">
                    You can submit another ticket below or browse our help center.
                  </p>
                  <button
                    @click="success = false"
                    class="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200 transition-colors"
                  >
                    Submit Another Ticket
                  </button>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 class="text-sm font-medium text-red-800">Submission Failed</h3>
                  <p class="text-sm text-red-700 mt-1">{{ error }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Support Agent Tab -->
      <div v-if="activeTab === 'ai'" class="h-full">
        <AISupportAgent />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import AISupportAgent from '@/components/widget/AISupportAgent.vue'

// Route
const route = useRoute()

// Configuration
const modules = computed(() => {
  const modulesParam = route.query.modules || 'ticket,faq'
  return modulesParam.split(',').map(m => m.trim())
})

// Secure tenant ID handling - not from URL parameters
const tenantId = ref(null)
const authToken = ref(null)

const apiBase = computed(() => {
  return route.query.apiBase || window.RCWidgetConfig?.apiBase || window.location.origin
})

const renderedContent = computed(() => {
  if (!selectedArticle.value?.content) return ''
  
  // Simple markdown-like rendering (you can replace with a proper markdown parser)
  return selectedArticle.value.content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
})

// State
const activeTab = ref(modules.value.includes('faq') ? 'faq' : modules.value.includes('ai') ? 'ai' : 'ticket')

// Secure communication setup
const setupSecureCommunication = () => {
  // Request tenant ID and auth token from parent window
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'REQUEST_TENANT_ID' }, '*')
    window.parent.postMessage({ type: 'REQUEST_AUTH_TOKEN' }, '*')
  }
  
  // Listen for responses
  window.addEventListener('message', (event) => {
    if (event.data.type === 'TENANT_ID_RESPONSE') {
      tenantId.value = event.data.tenantId
      console.log('Received tenant ID securely:', tenantId.value)
    }
    
    if (event.data.type === 'AUTH_TOKEN_RESPONSE') {
      authToken.value = event.data.token
      console.log('Received auth token securely')
    }
  })
}
const loading = ref(false)
const searchQuery = ref('')
const categories = ref([])
const articles = ref([])
const selectedArticle = ref(null)
const feedbackSubmitted = ref(false)
const userFeedback = ref(null)
const submittingFeedback = ref(false)
const expandedCategories = ref([])

// Reset feedback state when article changes
watch(selectedArticle, (newVal) => {
  if (newVal) {
    feedbackSubmitted.value = false
    userFeedback.value = null
    submittingFeedback.value = false
  }
})

// Ticket form state
const submitting = ref(false)
const success = ref(false)
const error = ref(null)
const ticketId = ref(null)

// Form data
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  priority: 'medium'
})

// Methods
const loadCategories = async () => {
  if (!tenantId.value) return
  
  try {
    loading.value = true
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    
    // Add auth token if available
    if (authToken.value) {
      headers['Authorization'] = `Bearer ${authToken.value}`
    }
    
    const response = await fetch(`${apiBase.value}/api/help/categories?tenant=${tenantId.value}`, {
      method: 'GET',
      headers: headers
    })
    const data = await response.json()
    categories.value = data.data || data || []
  } catch (err) {
    console.warn('Failed to load categories, using demo data:', err)
    // Use demo categories as fallback
    categories.value = [
      { id: 1, name: 'Getting Started', description: 'Learn the basics of using our platform' },
      { id: 2, name: 'Account Management', description: 'Manage your account settings and preferences' },
      { id: 3, name: 'Billing & Payments', description: 'Everything about billing, payments, and subscriptions' }
    ]
  } finally {
    loading.value = false
  }
}

const loadArticles = async (categoryId = null) => {
  if (!tenantId.value) return
  
  try {
    loading.value = true
    let url = `${apiBase.value}/api/help/articles`
    const params = new URLSearchParams()
    
    // Add tenant ID first (required by backend)
    params.append('tenant', tenantId.value)
    
    if (searchQuery.value) {
      params.append('query', searchQuery.value)
    }
    if (categoryId) {
      params.append('category_id', categoryId)
    }
    
    url += `?${params.toString()}`
    
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    
    // Add auth token if available
    if (authToken.value) {
      headers['Authorization'] = `Bearer ${authToken.value}`
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    })
    const data = await response.json()
    const rawArticles = data.data || data || []
    
    // Deduplicate articles by ID to prevent duplicates
    articles.value = rawArticles.filter((article, index, self) => 
      index === self.findIndex(a => a.id === article.id)
    )
  } catch (err) {
    console.warn('Failed to load articles, using demo data:', err)
    // Use demo articles as fallback
    articles.value = [
      {
        id: 1,
        title: 'Welcome to RC Convergio',
        slug: 'welcome-to-rc-convergio',
        summary: 'Get started with RC Convergio CRM and learn the basics of managing your business relationships.',
        content: '<p>Welcome to RC Convergio! This guide will help you get started with our CRM platform.</p><p>Here are the key features you can use:</p><ul><li>Contact Management</li><li>Deal Tracking</li><li>Task Management</li><li>Reporting</li></ul>',
        views: 1300,
        helpful_count: 45,
        category_id: 1
      },
      {
        id: 2,
        title: 'How to Create and Manage Contacts',
        slug: 'how-to-create-and-manage-contacts',
        summary: 'Learn how to add new contacts, organize them, and keep your contact database up to date.',
        content: '<p>Creating and managing contacts is easy with RC Convergio.</p><p>Follow these steps:</p><ol><li>Click on Contacts in the sidebar</li><li>Click the "Add Contact" button</li><li>Fill in the contact information</li><li>Save the contact</li></ol>',
        views: 890,
        helpful_count: 32,
        category_id: 1
      }
    ]
  } finally {
    loading.value = false
  }
}

const loadArticle = async (slug) => {
  if (!tenantId.value) return
  
  try {
    loading.value = true
    
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    
    // Add auth token if available
    if (authToken.value) {
      headers['Authorization'] = `Bearer ${authToken.value}`
    }
    
    const response = await fetch(`${apiBase.value}/api/help/articles/${slug}?tenant=${tenantId.value}`, {
      method: 'GET',
      headers: headers
    })
    const data = await response.json()
    selectedArticle.value = data.data || data
    // Reset feedback state when loading new article
    feedbackSubmitted.value = false
    userFeedback.value = null
    submittingFeedback.value = false
  } catch (err) {
    console.warn('Failed to load article, using demo data:', err)
    // Use demo article as fallback
    selectedArticle.value = {
      id: 1,
      title: 'Welcome to RC Convergio',
      slug: 'welcome-to-rc-convergio',
      content: '<p>Welcome to RC Convergio! This guide will help you get started with our CRM platform.</p><p>Here are the key features you can use:</p><ul><li>Contact Management</li><li>Deal Tracking</li><li>Task Management</li><li>Reporting</li></ul>',
      views: 1300,
      helpful_count: 45
    }
    // Reset feedback state for demo article too
    feedbackSubmitted.value = false
    userFeedback.value = null
    submittingFeedback.value = false
  } finally {
    loading.value = false
  }
}

const searchArticles = async () => {
  if (searchQuery.value.trim()) {
    await loadArticles()
  } else {
    articles.value = []
  }
}

const loadArticlesByCategory = async (categoryId) => {
  searchQuery.value = ''
  await loadArticles(categoryId)
}

const clearSearchAndExpandAll = () => {
  // Clear search query
  searchQuery.value = ''
  // Clear articles list (no redundant list below categories)
  articles.value = []
  // Expand all categories to show all articles
  expandedCategories.value = categories.value.map(cat => cat.id)
}

const toggleCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

const getCategoryArticles = (categoryId) => {
  // Filter articles by category and deduplicate by ID
  const categoryArticles = articles.value.filter(article => 
    article.category && article.category.id === categoryId
  )
  
  // Deduplicate by article ID to prevent duplicates
  const uniqueArticles = categoryArticles.filter((article, index, self) => 
    index === self.findIndex(a => a.id === article.id)
  )
  
  return uniqueArticles
}

const submitFeedback = async (helpful) => {
  if (!selectedArticle.value || !tenantId.value) return
  
  try {
    submittingFeedback.value = true
    userFeedback.value = helpful
    
    const headers = {
      'Content-Type': 'application/json'
    }
    
    // Add auth token if available
    if (authToken.value) {
      headers['Authorization'] = `Bearer ${authToken.value}`
    }
    
    await fetch(`${apiBase.value}/api/help/articles/${selectedArticle.value.id}/feedback?tenant=${tenantId.value}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        feedback: helpful ? "helpful" : "not_helpful"
      })
    })
    
    feedbackSubmitted.value = true
    
    // If not helpful, suggest switching to ticket tab
    if (!helpful && modules.value.includes('ticket')) {
      setTimeout(() => {
        switchToTicket()
      }, 2000)
    }
  } catch (err) {
    console.warn('Failed to submit feedback:', err)
    // Still mark as submitted for UX
    feedbackSubmitted.value = true
    userFeedback.value = helpful
  } finally {
    submittingFeedback.value = false
  }
}

const switchToTicket = () => {
  activeTab.value = 'ticket'
}

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const submitTicket = async () => {
  submitting.value = true
  error.value = null
  success.value = false

  try {
    const ticketData = {
      contact_name: form.value.name,
      contact_email: form.value.email,
      subject: form.value.subject,
      description: form.value.message,
      priority: form.value.priority,
      tenant_id: tenantId.value
    }

    console.log('Submitting ticket:', ticketData)
    const response = await api.post('/public/tickets', ticketData)
    console.log('Ticket response:', response)

    // Handle different response structures
    if (response.data && (response.data.data || response.data.ticket)) {
      const ticket = response.data.data || response.data.ticket
      ticketId.value = ticket.id
      success.value = true
      
      // Reset form immediately after success
      form.value = {
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'medium'
      }

      console.log('Ticket created successfully:', ticketId.value)

      // Keep success message visible longer and don't auto-switch tabs
      setTimeout(() => {
        success.value = false
        // Only switch to FAQ if user doesn't interact with the form
        if (modules.value.includes('faq')) {
          activeTab.value = 'faq'
        }
      }, 5000) // Increased from 3 seconds to 5 seconds
    } else if (response.status === 201 || response.status === 200) {
      // Fallback: if we get a successful status but unexpected structure
      console.log('Success response with unexpected structure, treating as success')
      ticketId.value = response.data.id || 'Unknown'
      success.value = true
      
      // Reset form immediately after success
      form.value = {
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'medium'
      }

      console.log('Ticket created successfully (fallback):', ticketId.value)

      // Keep success message visible longer and don't auto-switch tabs
      setTimeout(() => {
        success.value = false
        // Only switch to FAQ if user doesn't interact with the form
        if (modules.value.includes('faq')) {
          activeTab.value = 'faq'
        }
      }, 5000)
    } else {
      console.error('Unexpected response structure:', response.data)
      throw new Error('Invalid response format')
    }
  } catch (err) {
    console.error('Error submitting ticket:', err)
    error.value = err.response?.data?.message || 'Failed to submit ticket. Please try again.'
  } finally {
    submitting.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Set up secure communication first
  setupSecureCommunication()
  
  // Wait a bit for secure communication to establish
  setTimeout(async () => {
    if (modules.value.includes('faq')) {
      await loadCategories()
      await loadArticles()
    }
    
    console.log('✅ Enhanced Widget loaded with modules:', modules.value)
  }, 100)
})

// Attachment helper methods
const getAttachmentUrl = (url) => {
  if (!url) return ''
  
  // If it's already a full URL, return as is
  if (url.startsWith('http')) {
    return url
  }
  
  // If it's a relative path, prepend the API base URL
  if (url.startsWith('/')) {
    return `${apiBase.value}${url}`
  }
  
  // Otherwise, assume it's a relative path and prepend API base
  return `${apiBase.value}/${url}`
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const downloadAttachment = (attachment) => {
  const url = getAttachmentUrl(attachment.url)
  const link = document.createElement('a')
  link.href = url
  link.download = attachment.filename
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleImageError = (event) => {
  // Hide the image if it fails to load
  event.target.style.display = 'none'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose {
  @apply text-gray-700 leading-relaxed;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  @apply text-gray-900 font-semibold;
}

.prose p {
  @apply mb-3;
}

.prose ul, .prose ol {
  @apply mb-3 pl-6;
}

.prose li {
  @apply mb-1;
}

/* Ensure proper iframe sizing */
:deep(body) {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.h-full {
  height: 100vh;
  max-height: 100vh;
}
</style>
