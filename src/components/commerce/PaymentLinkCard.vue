<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-in-out min-h-[260px] h-full flex flex-col">
    <!-- Light gradient header -->
    <div class="bg-gradient-to-b from-gray-50 to-white rounded-t-xl">
      <!-- Edit Modal -->
      <EditPaymentLinkModal
        v-if="showEditModal"
        :link="link"
        @close="showEditModal = false"
        @updated="handleLinkUpdated"
      />
      
      <!-- Header Section -->
      <div class="p-5 pb-3">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              {{ getLinkTitle() }}
            </h3>
            <span :class="getStatusBadgeClass(link.status)" class="inline-flex items-center px-2 py-0.5 text-xs rounded-md font-medium">
              {{ link.status }}
            </span>
          </div>
        </div>
        
        <!-- Subtext -->
        <div class="text-sm text-gray-600 mb-4">
          <div v-if="link.quote" class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-primary-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="font-medium">{{ link.quote.quote_number }}</span>
            <span v-if="getAmount() !== null" class="ml-2 text-gray-500">• ${{ formatCurrency(getAmount()) }} {{ getCurrency() }}</span>
          </div>
          <div v-else class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span class="text-gray-500">Standalone Payment Link</span>
            <span v-if="getAmount() !== null" class="ml-2 text-gray-500">• ${{ formatCurrency(getAmount()) }} {{ getCurrency() }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Body Section -->
    <div class="px-5 pb-3 flex-1">
      <div class="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span class="text-xs text-gray-500">ID: {{ link.id }}</span>
        </div>
        
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-xs text-gray-500">{{ formatDate(link.created_at) }}</span>
        </div>
        
        <div v-if="link.expires_at" class="flex items-center">
          <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs text-gray-500">Expires: {{ formatDate(link.expires_at) }}</span>
        </div>
        
        <div v-if="link.public_url" class="flex items-center">
          <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span class="text-xs text-blue-600">URL Available</span>
        </div>
      </div>
    </div>
    
    <!-- Footer Section with Action Buttons -->
    <div class="mt-4 border-t border-gray-100 pt-4 px-5 pb-5">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <!-- Primary Actions -->
        <div class="flex items-center gap-2">
          <button
            @click="copyLink"
            class="inline-flex items-center h-9 px-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all duration-200"
            title="Copy payment link to clipboard"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Link
          </button>
          
          <button
            @click="sendEmail"
            :disabled="emailLoading"
            class="inline-flex items-center h-9 px-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send payment link via email"
          >
            <svg v-if="!emailLoading" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <svg v-else class="animate-spin w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ emailLoading ? 'Sending...' : 'Send Email' }}
          </button>
        </div>
        
        <!-- Secondary Actions -->
        <div class="flex items-center gap-1">
          <!-- Status Toggle Button -->
          <button
            v-if="link.status === 'active'"
            @click="$emit('deactivate', link.id)"
            class="inline-flex items-center h-9 px-2.5 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md hover:bg-yellow-100 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200"
            title="Deactivate payment link"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
            Deactivate
          </button>
          
          <button
            v-else-if="link.status === 'inactive' || link.status === 'draft'"
            @click="$emit('activate', link.id)"
            class="inline-flex items-center h-9 px-2.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            title="Activate payment link"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Activate
          </button>
          
          <!-- Edit Button -->
          <button
            @click="openEditModal"
            class="inline-flex items-center h-9 px-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all duration-200"
            title="Edit payment link"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          
          <!-- Delete Button -->
          <button
            @click="$emit('delete', link.id)"
            class="inline-flex items-center h-9 px-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
            title="Delete payment link"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import EditPaymentLinkModal from './EditPaymentLinkModal.vue'

const props = defineProps({
  link: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['activate', 'deactivate', 'edit', 'delete', 'send-email'])

const showEditModal = ref(false)
const emailLoading = ref(false)

const getLinkTitle = () => {
  if (props.link.quote) {
    return `Payment Link for ${props.link.quote.quote_number}`
  }
  return `Payment Link #${props.link.id}`
}

const getAmount = () => {
  if (props.link.quote) {
    return parseFloat(props.link.quote.total)
  }
  // For standalone payment links, check if there's a direct amount field
  // or use a default amount from metadata if available
  if (props.link.metadata && props.link.metadata.amount) {
    return parseFloat(props.link.metadata.amount)
  }
  // If no amount is specified, return null to hide the amount display
  return null
}

const getCurrency = () => {
  if (props.link.quote) {
    return props.link.quote.currency
  }
  return 'USD'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'bg-green-50 text-green-700',
    completed: 'bg-blue-50 text-blue-700',
    expired: 'bg-red-50 text-red-700',
    inactive: 'bg-yellow-50 text-yellow-700',
    draft: 'bg-gray-50 text-gray-600'
  }
  return classes[status] || 'bg-gray-50 text-gray-600'
}

const copyLink = async () => {
  try {
    // Use public_url if available, otherwise construct checkout URL
    const linkUrl = props.link.public_url || `${window.location.origin}/commerce/checkout/${props.link.id}`
    await navigator.clipboard.writeText(linkUrl)
    
    // Show success toast notification
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Link Copied!',
        text: 'Payment link has been copied to clipboard',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    } else {
      // Fallback to alert if SweetAlert2 is not available
      alert('Link copied to clipboard!')
    }
  } catch (err) {
    console.error('Failed to copy link:', err)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Copy Failed',
        text: 'Failed to copy link to clipboard',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  }
}

const sendEmail = async () => {
  emailLoading.value = true
  try {
    // Get customer email from user
    let customerEmail = ''
    
    // Try to get email from quote if available
    if (props.link.quote && props.link.quote.customer_email) {
      customerEmail = props.link.quote.customer_email
    }
    
    // If no email from quote, prompt user for email
    if (!customerEmail) {
      if (window.Swal) {
        const { value: email } = await window.Swal.fire({
          title: 'Enter Customer Email',
          input: 'email',
          inputLabel: 'Customer Email Address',
          inputPlaceholder: 'customer@example.com',
          inputValidator: (value) => {
            if (!value) {
              return 'Email address is required!'
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              return 'Please enter a valid email address!'
            }
          },
          showCancelButton: true,
          confirmButtonText: 'Send Email',
          cancelButtonText: 'Cancel',
          inputValue: customerEmail
        })
        
        if (email) {
          customerEmail = email
        } else {
          emailLoading.value = false
          return
        }
      } else {
        // Fallback to prompt if SweetAlert2 is not available
        customerEmail = prompt('Enter customer email address:')
        if (!customerEmail) {
          emailLoading.value = false
          return
        }
      }
    }
    
    // Emit the send-email event to parent component with customer email
    emit('send-email', props.link.id, customerEmail)
  } catch (error) {
    console.error('Error sending email:', error)
  } finally {
    emailLoading.value = false
  }
}

const openEditModal = () => {
  showEditModal.value = true
}

const handleLinkUpdated = (updatedLink) => {
  // Emit the updated link to parent component
  emit('edit', updatedLink)
  showEditModal.value = false
}
</script>
