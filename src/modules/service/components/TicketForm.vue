<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Create New Ticket</h3>
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

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Subject -->
        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            id="subject"
            v-model="form.subject"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of the issue"
            @input="handleInputChange"
          />
        </div>

        <!-- Priority -->
        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
            Priority *
          </label>
          <select
            id="priority"
            v-model="form.priority"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            v-model="form.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="general">General</option>
            <option value="feature-request">Feature Request</option>
          </select>
        </div>

        <!-- Message -->
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            v-model="form.message"
            required
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your issue in detail..."
            @input="handleInputChange"
          ></textarea>
        </div>

        <!-- Article Suggestions -->
        <div v-if="suggestions.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 class="text-sm font-medium text-blue-900 mb-3">Suggested Articles</h4>
          <div class="space-y-2">
            <div
              v-for="suggestion in suggestions"
              :key="suggestion.id"
              class="bg-white border border-blue-200 rounded-lg p-3 cursor-pointer hover:bg-blue-50 transition-colors"
              @click="openArticleModal(suggestion)"
            >
              <h5 class="text-sm font-medium text-gray-900 mb-1">{{ suggestion.title }}</h5>
              <p class="text-xs text-gray-600 line-clamp-2">{{ suggestion.summary }}</p>
            </div>
          </div>
        </div>

        <!-- Loading state for suggestions -->
        <div v-if="loadingSuggestions" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm text-gray-600">Finding relevant articles...</span>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
            <span v-else>Create Ticket</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Article Modal -->
    <ArticleModal
      v-if="selectedArticle"
      :article="selectedArticle"
      @close="selectedArticle = null"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useTickets } from '@/composables/useTickets.js'
import ArticleModal from './ArticleModal.vue'

// Props
const props = defineProps({
  ticketId: {
    type: [String, Number],
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'created'])

// Composables
const { getArticleSuggestions, createTicket, loading, error } = useTickets()

// State
const form = reactive({
  subject: '',
  priority: '',
  category: '',
  message: ''
})

const suggestions = ref([])
const loadingSuggestions = ref(false)
const selectedArticle = ref(null)

// Debounced search for suggestions
let searchTimeout = null

// Methods
const handleInputChange = () => {
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // Set new timeout for debounced search
  searchTimeout = setTimeout(() => {
    fetchSuggestions()
  }, 500)
}

const fetchSuggestions = async () => {
  const query = `${form.subject} ${form.message}`.trim()
  
  if (query.length < 3) {
    suggestions.value = []
    return
  }

  try {
    loadingSuggestions.value = true
    
    // For new tickets, we'll use a temporary ID or skip the ticket ID
    const response = await getArticleSuggestions(props.ticketId || 'new', query)
    suggestions.value = response.data || response.suggestions || []
  } catch (err) {
    console.error('Failed to fetch suggestions:', err)
    suggestions.value = []
  } finally {
    loadingSuggestions.value = false
  }
}

const openArticleModal = (article) => {
  selectedArticle.value = article
}

const handleSubmit = async () => {
  try {
    const ticketData = {
      subject: form.subject,
      priority: form.priority,
      category: form.category,
      message: form.message
    }

    const response = await createTicket(ticketData)
    
    // Emit success event
    emit('created', response.data)
    
    // Close modal
    emit('close')
  } catch (err) {
    console.error('Failed to create ticket:', err)
  }
}

// Watch for form changes to trigger suggestions
watch(() => [form.subject, form.message], () => {
  handleInputChange()
}, { deep: true })
</script>
