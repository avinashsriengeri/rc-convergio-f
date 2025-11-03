<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold text-gray-900">Payment Links</h1>
              <p class="text-sm text-gray-600">Create and manage payment links for your quotes</p>
            </div>
            <div class="flex items-center space-x-3">
              <button
                @click="showBulkEmailModal = true"
                :disabled="loading || selectedLinks.length === 0"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Bulk Email
                <span v-if="selectedLinks.length > 0" class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ selectedLinks.length }}
                </span>
              </button>
              <button
                @click="showCreateModal = true"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Create Payment Link
              </button>
              <button
                @click="refreshLinks"
                :disabled="loading"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Cards -->
    <div class="bg-gray-50 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- Total Views -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Views</p>
                <p class="text-xl font-bold text-gray-900">{{ analyticsData.totalViews || 0 }}</p>
              </div>
            </div>
          </div>

          <!-- Total Clicks -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Clicks</p>
                <p class="text-xl font-bold text-gray-900">{{ analyticsData.totalClicks || 0 }}</p>
              </div>
            </div>
          </div>

          <!-- Conversions -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</p>
                <p class="text-xl font-bold text-gray-900">{{ analyticsData.totalConversions || 0 }}</p>
              </div>
            </div>
          </div>

          <!-- Conversion Rate -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</p>
                <p class="text-xl font-bold text-gray-900">{{ analyticsData.conversionRate || 0 }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search payment links..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div class="sm:w-48">
            <select
              v-model="statusFilter"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Payment Links Grid -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow p-6 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div class="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div v-else-if="filteredLinks.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No payment links found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first payment link.</p>
        <div class="mt-6">
          <BaseButton
            variant="primary"
            size="md"
            @click="showCreateModal = true"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Payment Link
          </BaseButton>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PaymentLinkCard
          v-for="link in filteredLinks"
          :key="link.id"
          :link="link"
          @activate="activateLink"
          @deactivate="deactivateLink"
          @edit="editLink"
          @delete="deleteLink"
          @send-email="sendSingleEmail"
        />
      </div>

      <!-- Pagination -->
      <div v-if="filteredLinks.length > itemsPerPage" class="mt-8">
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                to
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredLinks.length) }}</span>
                of
                <span class="font-medium">{{ filteredLinks.length }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    page === currentPage
                      ? 'z-10 bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Payment Link Modal -->
    <CreatePaymentLinkModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleLinkCreated"
    />

    <!-- Bulk Email Modal -->
    <div v-if="showBulkEmailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Send Bulk Email</h3>
            <button @click="showBulkEmailModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">Selected payment links ({{ selectedLinks.length }}):</p>
            <div class="max-h-32 overflow-y-auto border rounded-md p-2 bg-gray-50">
              <div v-for="link in selectedLinks" :key="link.id" class="text-sm text-gray-700 py-1">
                {{ link.quote?.quote_number || `Link #${link.id}` }}
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Subject</label>
            <input
              v-model="bulkEmailSubject"
              type="text"
              placeholder="Payment link for your quote"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Message</label>
            <textarea
              v-model="bulkEmailMessage"
              rows="4"
              placeholder="Please find your payment link below..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <BaseButton
              variant="secondary"
              size="md"
              @click="showBulkEmailModal = false"
            >
              Cancel
            </BaseButton>
            <BaseButton
              variant="primary"
              size="md"
              @click="sendBulkEmail"
              :disabled="bulkEmailLoading"
              :loading="bulkEmailLoading"
              loadingText="Sending..."
            >
              Send Emails
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCommerceLinksStore } from '@/stores/useCommerceLinksStore'
import CreatePaymentLinkModal from '@/components/commerce/CreatePaymentLinkModal.vue'
import PaymentLinkCard from '@/components/commerce/PaymentLinkCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const linksStore = useCommerceLinksStore()

const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const showCreateModal = ref(false)
const showBulkEmailModal = ref(false)
const bulkEmailLoading = ref(false)
const bulkEmailSubject = ref('Payment link for your quote')
const bulkEmailMessage = ref('Please find your payment link below. Click the link to complete your payment.')
const selectedLinks = ref([])
const analyticsData = ref({
  totalViews: 0,
  totalClicks: 0,
  totalConversions: 0,
  conversionRate: 0
})

const paymentLinks = computed(() => linksStore.paymentLinks)

const filteredLinks = computed(() => {
  let filtered = paymentLinks.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(link =>
      link.id.toString().includes(query) ||
      (link.quote && link.quote.quote_number.toLowerCase().includes(query))
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(link => link.status === statusFilter.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredLinks.value.length / itemsPerPage.value))

const paginatedLinks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLinks.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const refreshLinks = async () => {
  loading.value = true
  try {
    await Promise.all([
      linksStore.fetchPaymentLinks(),
      fetchAnalyticsData()
    ])
  } catch (error) {
    console.error('Error refreshing payment links:', error)
  } finally {
    loading.value = false
  }
}

const fetchAnalyticsData = async () => {
  try {
    // Mock analytics data for now - replace with actual API call
    analyticsData.value = {
      totalViews: 1247,
      totalClicks: 389,
      totalConversions: 47,
      conversionRate: 12.1
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error)
  }
}

const sendBulkEmail = async () => {
  if (selectedLinks.value.length === 0) {
    if (window.Swal) {
      window.Swal.fire({
        icon: 'warning',
        title: 'No Links Selected',
        text: 'Please select payment links to send emails',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
    return
  }

  bulkEmailLoading.value = true
  try {
    // Call bulk email API
    const response = await linksStore.sendBulkEmail({
      linkIds: selectedLinks.value.map(link => link.id),
      subject: bulkEmailSubject.value,
      message: bulkEmailMessage.value
    })

    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Emails Sent!',
        text: `Successfully sent ${selectedLinks.value.length} payment link emails`,
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }

    // Clear selection and close modal
    selectedLinks.value = []
    showBulkEmailModal.value = false
  } catch (error) {
    console.error('Error sending bulk emails:', error)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Email Failed',
        text: error.response?.data?.message || 'Failed to send bulk emails',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } finally {
    bulkEmailLoading.value = false
  }
}

const sendSingleEmail = async (linkId, customerEmail) => {
  try {
    await linksStore.sendEmail(linkId, customerEmail)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Email Sent!',
        text: `Payment link email has been sent to ${customerEmail}`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } catch (error) {
    console.error('Error sending email:', error)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Email Failed',
        text: error.response?.data?.message || 'Failed to send email',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  }
}

const activateLink = async (linkId) => {
  try {
    await linksStore.activatePaymentLink(linkId)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Activated!',
        text: 'Payment link has been activated successfully',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
    refreshLinks()
  } catch (error) {
    console.error('Error activating link:', error)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Activation Failed',
        text: error.response?.data?.message || 'Failed to activate payment link',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  }
}

const deactivateLink = async (linkId) => {
  try {
    await linksStore.deactivatePaymentLink(linkId)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Deactivated!',
        text: 'Payment link has been deactivated successfully',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
    refreshLinks()
  } catch (error) {
    console.error('Error deactivating link:', error)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Deactivation Failed',
        text: error.response?.data?.message || 'Failed to deactivate payment link',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  }
}

const editLink = (link) => {
  // The edit functionality is handled by the PaymentLinkCard component
  // This function is called when the edit modal is closed with updated data
  console.log('Link updated:', link)
  // Refresh the links list to show updated data
  refreshLinks()
}

const deleteLink = async (linkId) => {
  // Use SweetAlert2 for better confirmation dialog
  if (window.Swal) {
    const result = await window.Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await linksStore.deletePaymentLink(linkId)
        window.Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Payment link has been deleted successfully',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
        // Refresh the links list
        refreshLinks()
      } catch (error) {
        console.error('Error deleting link:', error)
        window.Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: error.response?.data?.message || 'Failed to delete payment link',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
      }
    }
  } else {
    // Fallback to confirm dialog
    if (confirm(`Are you sure you want to delete this payment link?`)) {
      try {
        await linksStore.deletePaymentLink(linkId)
        console.log('Link deleted successfully')
        refreshLinks()
      } catch (error) {
        console.error('Error deleting link:', error)
      }
    }
  }
}

const handleLinkCreated = () => {
  showCreateModal.value = false
  refreshLinks()
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

const goToPage = (page) => {
  currentPage.value = page
}

// Reset to first page when filters change
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})

onMounted(() => {
  refreshLinks()
})
</script>
