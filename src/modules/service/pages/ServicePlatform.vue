<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with Breadcrumbs and Actions -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Breadcrumb Navigation -->
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-4">
              <li>
                <div class="flex items-center">
                  <router-link to="/dashboard" class="text-gray-400 hover:text-gray-500">
                    <svg class="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span class="sr-only">Home</span>
                  </router-link>
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                  <router-link to="/service" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">Service</router-link>
                </div>
              </li>
              <li v-if="currentPageName">
                <div class="flex items-center">
                  <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="ml-4 text-sm font-medium text-gray-900">{{ currentPageName }}</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <!-- Action Buttons -->
          <div class="flex items-center space-x-4">
            <!-- Integration Widget Button -->
            <router-link
              to="/service/integration"
              class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              title="Widget Integration"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Widget
            </router-link>
            
            <!-- Copy Contact Link Button -->
            <button
              @click="copyContactLink"
              class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              title="Copy public contact form link"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </button>
            
            <!-- Refresh button -->
            <button
              @click="refreshData"
              class="p-2 text-gray-400 hover:text-gray-500 transition-colors"
              title="Refresh data"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            
            <!-- Create ticket button -->
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Ticket
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </div>

    <!-- Create Ticket Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showCreateModal = false"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Create New Ticket</h3>
            <button
              @click="showCreateModal = false"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleCreateTicket">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  v-model="newTicket.subject"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the issue"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  v-model="newTicket.description"
                  rows="4"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed description of the issue"
                ></textarea>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    v-model="newTicket.priority"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    v-model="newTicket.category"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Technical, Billing, General"
                  />
                </div>
              </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="showCreateModal = false"
                class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {{ creating ? 'Creating...' : 'Create Ticket' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useServiceTicketsStore } from '../store/serviceTickets'
import { useContext } from '@/composables/useContext'
import { useAuth } from '@/composables/useAuth'
import api from '@/services/api'

// Router
const router = useRouter()
const route = useRoute()

// Computed - Current page name for breadcrumb
const currentPageName = computed(() => {
  const path = route.path
  
  // Check for specific paths first (more specific to less specific)
  if (path.match(/\/service\/tickets\/\d+/)) {
    // Ticket detail page - show ticket ID or "Ticket Details"
    const ticketId = route.params.id || path.split('/').pop()
    return `Ticket #${ticketId}`
  }
  if (path === '/service/tickets' || path === '/service/tickets/') {
    return 'Tickets'
  }
  if (path === '/service/integration' || path === '/service/integration/') {
    return 'Integration'
  }
  if (path === '/service/settings' || path === '/service/settings/') {
    return 'Settings'
  }
  if (path === '/service' || path === '/service/') {
    return 'Overview'
  }
  
  // Fallback for any other service sub-paths
  if (path.startsWith('/service/')) {
    const parts = path.split('/').filter(Boolean)
    if (parts.length > 1) {
      const pageName = parts[parts.length - 1]
      return pageName.charAt(0).toUpperCase() + pageName.slice(1)
    }
  }
  
  return null
})

// Store
const ticketsStore = useServiceTicketsStore()

// Context
const { tenantId } = useContext()
const { user } = useAuth()

// Local state
const showCreateModal = ref(false)
const creating = ref(false)
const newTicket = ref({
  subject: '',
  description: '',
  priority: 'medium',
  category: ''
})

// Methods
const getCurrentTenantId = async () => {
  // If we have tenant ID from context, use it
  if (tenantId.value && tenantId.value !== 1) {
    return tenantId.value
  }
  
  // If user data has tenant_id or id, use it
  if (user.value?.tenant_id) {
    return user.value.tenant_id
  }
  
  if (user.value?.id) {
    return user.value.id
  }
  
  // Fallback to default valid tenant ID
  return 44
}

const copyContactLink = async () => {
  try {
    const currentTenantId = await getCurrentTenantId()
    
    // Debug logging
    console.log('Current tenant ID from context:', tenantId.value)
    console.log('Current user data:', user.value)
    console.log('Using tenant ID:', currentTenantId)
    
    // Show loading state
    const button = event.target.closest('button')
    const originalText = button.innerHTML
    button.innerHTML = `
      <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Generating...
    `
    button.disabled = true
    
    try {
      // Call the new API to get tenant-specific form URL
      const response = await api.get(`/public/tickets/form-url/${currentTenantId}`)
      const contactUrl = response.data.data?.form_url || response.data.form_url
      
      console.log('Generated form URL from API:', contactUrl)
      
      await navigator.clipboard.writeText(contactUrl)
      
      // Show success feedback
      button.innerHTML = `
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Copied!
      `
      button.classList.add('bg-green-50', 'text-green-700', 'border-green-300')
      
    } catch (apiError) {
      console.warn('API call failed, using fallback URL:', apiError)
      
      // Fallback to manual URL construction
      const baseUrl = window.location.origin
      const contactUrl = `${baseUrl}/contact?tenant=${currentTenantId}`
      
      await navigator.clipboard.writeText(contactUrl)
      
      // Show success feedback
      button.innerHTML = `
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Copied!
      `
      button.classList.add('bg-green-50', 'text-green-700', 'border-green-300')
    }
    
    // Reset after 2 seconds
    setTimeout(() => {
      button.innerHTML = originalText
      button.classList.remove('bg-green-50', 'text-green-700', 'border-green-300')
      button.disabled = false
    }, 2000)
    
  } catch (err) {
    console.error('Failed to copy link:', err)
    
    // Fallback for older browsers
    const fallbackTenantId = await getCurrentTenantId()
    const textArea = document.createElement('textarea')
    textArea.value = `${window.location.origin}/contact?tenant=${fallbackTenantId}`
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    alert('Contact link copied to clipboard!')
  }
}

const refreshData = () => {
  // Refresh stats
  ticketsStore.fetchStats()
  
  // If we're on a specific route, refresh the appropriate data
  if (router.currentRoute.value.path === '/service') {
    ticketsStore.fetchTickets()
  }
}

const handleCreateTicket = async () => {
  creating.value = true
  
  try {
    await ticketsStore.createTicket(newTicket.value)
    
    // Reset form
    newTicket.value = {
      subject: '',
      description: '',
      priority: 'medium',
      category: ''
    }
    
    showCreateModal.value = false
    
    // Refresh the tickets list
    ticketsStore.fetchTickets()
  } catch (err) {
    console.error('Error creating ticket:', err)
  } finally {
    creating.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Load initial stats
  ticketsStore.fetchStats()
})
</script>
