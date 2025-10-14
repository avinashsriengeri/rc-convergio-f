<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Loading quote...</span>
    </div>

    <!-- Quote Content -->
    <div v-else-if="quote" class="space-y-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-4 mb-2">
              <h1 class="text-2xl font-bold text-gray-900">Quote #{{ quote.quote_number }}</h1>
              <span :class="getStatusBadgeClass(quote.status)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                {{ quote.status }}
              </span>
              <span :class="getQuoteTypeBadgeClass(quote.quote_type)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                {{ getQuoteTypeDisplay(quote.quote_type) }}
              </span>
              <span v-if="quote.is_primary" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Primary Quote
              </span>
            </div>
            <div class="flex items-center space-x-6 text-sm text-gray-600">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                {{ quote.creator?.name || 'Unknown Owner' }}
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Created {{ formatDate(quote.created_at) }}
              </div>
              <div v-if="quote.valid_until" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Valid until {{ formatDate(quote.valid_until) }}
              </div>
              <div v-if="quote.template" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Layout: {{ quote.template.name }}
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <BaseButton
              v-if="quote.status === 'draft'"
              variant="outline"
              @click="editQuote"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit
            </BaseButton>

            <BaseButton
              v-if="quote.status === 'draft'"
              variant="outline"
              @click="changeTemplate"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Change Template
            </BaseButton>

            <BaseButton
              v-if="canSendQuote(quote.status)"
              variant="secondary"
              @click="sendQuote"
              :loading="actionLoading"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              Send Quote
            </BaseButton>

            <BaseButton
              v-if="quote.status === 'sent'"
              variant="primary"
              @click="acceptQuote"
              :loading="actionLoading"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Accept
            </BaseButton>

            <BaseButton
              v-if="quote.status === 'sent'"
              variant="danger"
              @click="rejectQuote"
              :loading="actionLoading"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Reject
            </BaseButton>

            <BaseButton
              variant="outline"
              @click="downloadPdf"
              :loading="actionLoading"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Download PDF
            </BaseButton>

            <BaseButton
              variant="outline"
              @click="printQuote"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              Print
            </BaseButton>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Client Information -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                <p class="text-sm text-gray-900">{{ quote.deal?.contact?.name || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <p class="text-sm text-gray-900">{{ quote.deal?.contact?.email || '-' }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <p class="text-sm text-gray-900">{{ quote.deal?.company?.name || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Deal Information -->
          <div v-if="quote.deal" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Related Deal</h3>
              <router-link
                :to="`/deals/${quote.deal.id}`"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Deal
              </router-link>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Deal Title</label>
                <p class="text-sm text-gray-900">{{ quote.deal.title }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Deal Value</label>
                <p class="text-sm text-gray-900">${{ formatCurrency(quote.deal.value) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <p class="text-sm text-gray-900">{{ quote.deal.stage?.name || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Pipeline</label>
                <p class="text-sm text-gray-900">{{ quote.deal.pipeline?.name || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Line Items -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Line Items</h3>
            
            <div v-if="quote.items && quote.items.length > 0" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tax
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in quote.items" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ item.name }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                      {{ item.description || '-' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.quantity }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${{ formatCurrency(item.unit_price) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${{ formatCurrency(item.discount) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.tax_rate }}%
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${{ formatCurrency(item.total) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-else class="text-center py-8 text-gray-500">
              <p>No line items found</p>
            </div>

            <!-- Totals -->
            <div class="mt-6 border-t border-gray-200 pt-6">
              <div class="flex justify-end">
                <div class="w-64 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Subtotal:</span>
                    <span class="font-medium">${{ formatCurrency(quote.subtotal) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Discount:</span>
                    <span class="font-medium text-red-600">-${{ formatCurrency(quote.discount) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Tax:</span>
                    <span class="font-medium">${{ formatCurrency(quote.tax) }}</span>
                  </div>
                  <div class="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>${{ formatCurrency(quote.total) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Terms & Notes -->
          <div v-if="quote.terms || quote.notes" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Terms & Notes</h3>
            <div class="space-y-4">
              <div v-if="quote.terms">
                <label class="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                <div class="text-sm text-gray-900 whitespace-pre-wrap">{{ quote.terms }}</div>
              </div>
              <div v-if="quote.notes && quote.status === 'draft'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                <div class="text-sm text-gray-900 whitespace-pre-wrap">{{ quote.notes }}</div>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <DocumentsTab 
              relatedType="quote" 
              :relatedId="quote.id"
              :initialDocuments="quote.documents || []"
              @document-linked="handleDocumentLinked"
              @document-updated="handleDocumentUpdated"
            />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quote Summary -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Quote Summary</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Quote Number</dt>
                <dd class="text-sm text-gray-900">#{{ quote.quote_number }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd>
                  <span :class="getStatusBadgeClass(quote.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ quote.status }}
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Quote Type</dt>
                <dd>
                  <span :class="getQuoteTypeBadgeClass(quote.quote_type)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getQuoteTypeDisplay(quote.quote_type) }}
                  </span>
                </dd>
              </div>
              <div v-if="quote.is_primary">
                <dt class="text-sm font-medium text-gray-500">Primary Quote</dt>
                <dd class="text-sm text-blue-600 font-medium">Yes</dd>
              </div>
              <div v-if="quote.template">
                <dt class="text-sm font-medium text-gray-500">Template</dt>
                <dd class="text-sm text-gray-900">{{ quote.template.name }} ({{ quote.template.layout }})</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Currency</dt>
                <dd class="text-sm text-gray-900">{{ quote.currency || 'USD' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Total Amount</dt>
                <dd class="text-lg font-semibold text-gray-900">${{ formatCurrency(quote.total) }}</dd>
              </div>
              <div v-if="quote.deal?.total_accepted_revenue">
                <dt class="text-sm font-medium text-gray-500">Total Deal Revenue</dt>
                <dd class="text-lg font-semibold text-green-600">${{ formatCurrency(quote.deal.total_accepted_revenue) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Created</dt>
                <dd class="text-sm text-gray-900">{{ formatDate(quote.created_at) }}</dd>
              </div>
              <div v-if="quote.valid_until">
                <dt class="text-sm font-medium text-gray-500">Valid Until</dt>
                <dd class="text-sm text-gray-900">{{ formatDate(quote.valid_until) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Owner</dt>
                <dd class="text-sm text-gray-900">{{ quote.creator?.name || 'Unknown' }}</dd>
              </div>
            </dl>
          </div>

          <!-- Activity Timeline Placeholder -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Activity</h3>
            <div class="text-center py-8 text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="mt-2 text-sm">Activity timeline coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Quote not found</h3>
        <p class="mt-1 text-sm text-gray-500">The quote you're looking for doesn't exist or you don't have access to it.</p>
        <div class="mt-6">
          <BaseButton
            variant="primary"
            @click="router.push('/sales/quotes')"
          >
            Back to Quotes
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Accept Quote Modal -->
    <ConfirmationModal
      v-if="showAcceptModal"
      title="Accept Quote"
      message="Are you sure you want to accept this quote? This action cannot be undone."
      confirm-text="Accept"
      cancel-text="Cancel"
      confirm-variant="primary"
      @confirm="confirmAccept"
      @cancel="showAcceptModal = false"
    />

    <!-- Reject Quote Modal -->
    <ConfirmationModal
      v-if="showRejectModal"
      title="Reject Quote"
      message="Are you sure you want to reject this quote? This action cannot be undone."
      confirm-text="Reject"
      cancel-text="Cancel"
      confirm-variant="danger"
      @confirm="confirmReject"
      @cancel="showRejectModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuotesStore } from '@/stores/quotesStore'
import { success, error } from '@/utils/notifications'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'
import DocumentsTab from '@/components/documents/DocumentsTab.vue'

const router = useRouter()
const route = useRoute()
const quotesStore = useQuotesStore()

// Reactive data
const loading = ref(true)
const actionLoading = ref(false)
const quote = ref(null)
const showAcceptModal = ref(false)
const showRejectModal = ref(false)

// Methods
const loadQuote = async () => {
  loading.value = true
  try {
    quote.value = await quotesStore.getQuote(route.params.id)
  } catch (err) {
    console.error('Error loading quote:', err)
    error('Failed to load quote')
  } finally {
    loading.value = false
  }
}

const editQuote = () => {
  router.push(`/sales/quotes/${quote.value.id}/edit`)
}

const sendQuote = async () => {
  actionLoading.value = true
  try {
    await quotesStore.sendQuote(quote.value.id)
    success('Quote sent successfully')
    await loadQuote() // Reload to get updated status
  } catch (err) {
    console.error('Error sending quote:', err)
    error('Failed to send quote')
  } finally {
    actionLoading.value = false
  }
}

const acceptQuote = () => {
  showAcceptModal.value = true
}

const confirmAccept = async () => {
  actionLoading.value = true
  showAcceptModal.value = false
  try {
    await quotesStore.acceptQuote(quote.value.id)
    success('Quote accepted successfully')
    await loadQuote() // Reload to get updated status
  } catch (err) {
    console.error('Error accepting quote:', err)
    error('Failed to accept quote')
  } finally {
    actionLoading.value = false
  }
}

const rejectQuote = () => {
  showRejectModal.value = true
}

const confirmReject = async () => {
  actionLoading.value = true
  showRejectModal.value = false
  try {
    await quotesStore.rejectQuote(quote.value.id)
    success('Quote rejected successfully')
    await loadQuote() // Reload to get updated status
  } catch (err) {
    console.error('Error rejecting quote:', err)
    error('Failed to reject quote')
  } finally {
    actionLoading.value = false
  }
}

const downloadPdf = async () => {
  actionLoading.value = true
  try {
    await quotesStore.downloadPdf(quote.value.id)
    success('PDF downloaded successfully')
  } catch (err) {
    console.error('Error downloading PDF:', err)
    error('Failed to download PDF')
  } finally {
    actionLoading.value = false
  }
}

const printQuote = () => {
  // Open PDF in new window for printing
  const pdfUrl = `/api/quotes/${quote.value.id}/pdf`
  window.open(pdfUrl, '_blank')
}

const formatCurrency = (amount) => {
  if (!amount) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const getStatusBadgeClass = (status) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const canSendQuote = (status) => {
  return ['draft', 'sent'].includes(status)
}

const getQuoteTypeDisplay = (quoteType) => {
  const types = {
    primary: 'Primary',
    follow_up: 'Follow-up',
    renewal: 'Renewal',
    amendment: 'Amendment',
    alternative: 'Alternative'
  }
  return types[quoteType] || 'Primary'
}

const getQuoteTypeBadgeClass = (quoteType) => {
  const classes = {
    primary: 'bg-blue-100 text-blue-800',
    follow_up: 'bg-green-100 text-green-800',
    renewal: 'bg-purple-100 text-purple-800',
    amendment: 'bg-orange-100 text-orange-800',
    alternative: 'bg-gray-100 text-gray-800'
  }
  return classes[quoteType] || 'bg-blue-100 text-blue-800'
}

const changeTemplate = () => {
  // Navigate to edit page to change template
  router.push(`/sales/quotes/${quote.value.id}/edit`)
}

const handleDocumentLinked = (document) => {
  console.log('QuoteView: Document linked, adding to quote documents:', document)
  // Add the linked document to the quote documents array
  if (!quote.value.documents) {
    quote.value.documents = []
  }
  const existingIndex = quote.value.documents.findIndex(doc => doc.id === document.id)
  if (existingIndex === -1) {
    quote.value.documents.push(document)
    console.log('QuoteView: Added document to quote documents array')
  } else {
    quote.value.documents[existingIndex] = document
    console.log('QuoteView: Updated existing document in quote documents array')
  }
}

const handleDocumentUpdated = (updatedDocument) => {
  console.log('QuoteView: Document updated, refreshing quote documents:', updatedDocument)
  // Update the document in the quote documents array
  if (quote.value.documents) {
    const index = quote.value.documents.findIndex(doc => doc.id === updatedDocument.id)
    if (index !== -1) {
      quote.value.documents[index] = updatedDocument
      console.log('QuoteView: Updated document in quote documents array')
    }
  }
}

// Lifecycle
onMounted(() => {
  loadQuote()
})
</script>
