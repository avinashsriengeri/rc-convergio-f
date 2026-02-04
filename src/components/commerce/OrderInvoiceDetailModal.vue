<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <!-- Header -->
        <div class="bg-white px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              Invoice - {{ invoice?.invoice_number || 'N/A' }}
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="bg-white px-6 py-6">
          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-8">
            <div class="flex items-center space-x-2">
              <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-sm text-gray-600">Loading invoice...</span>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="flex items-center justify-center py-8">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading invoice</h3>
              <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
            </div>
          </div>

          <!-- Invoice Details -->
          <div v-else-if="invoice" class="space-y-6">
            <!-- Invoice Header Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-lg font-medium text-gray-900 mb-4">Invoice Information</h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Invoice Number</label>
                    <p class="mt-1 text-sm text-gray-900">{{ invoice.invoice_number }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Invoice Date</label>
                    <p class="mt-1 text-sm text-gray-900">{{ formatDate(invoice.invoice_date) }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <span
                      :class="getStatusColor(invoice.status)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ invoice.status }}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-lg font-medium text-gray-900 mb-4">Customer Information</h4>
                <div class="space-y-3">
                  <div v-if="invoice.contact">
                    <label class="block text-sm font-medium text-gray-700">Customer Name</label>
                    <p class="mt-1 text-sm text-gray-900">{{ invoice.contact.name || 'N/A' }}</p>
                  </div>
                  <div v-if="invoice.contact">
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <p class="mt-1 text-sm text-gray-900">{{ invoice.contact.email || 'N/A' }}</p>
                  </div>
                  <div v-if="invoice.quote">
                    <label class="block text-sm font-medium text-gray-700">Quote Number</label>
                    <p class="mt-1 text-sm text-gray-900">{{ invoice.quote.quote_number || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Invoice Items -->
            <div class="mt-8">
              <h4 class="text-lg font-medium text-gray-900 mb-4">Invoice Items</h4>
              <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tax Rate
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-if="!invoice.items || invoice.items.length === 0">
                      <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                        No items found
                      </td>
                    </tr>
                    <tr v-else v-for="(item, index) in invoice.items" :key="index">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">{{ item.name || 'N/A' }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ item.quantity || 0 }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ getCurrencySymbol(invoice.currency) }}{{ formatCurrency(item.unit_price || 0) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ item.tax_rate || 0 }}%
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ getCurrencySymbol(invoice.currency) }}{{ formatCurrency(item.line_total || 0) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-gray-50">
                    <tr>
                      <td colspan="4" class="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Subtotal:
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ getCurrencySymbol(invoice.currency) }}{{ formatCurrency(invoice.subtotal || 0) }}
                      </td>
                    </tr>
                    <tr v-if="invoice.tax && parseFloat(invoice.tax) > 0">
                      <td colspan="4" class="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Tax:
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ getCurrencySymbol(invoice.currency) }}{{ formatCurrency(invoice.tax || 0) }}
                      </td>
                    </tr>
                    <tr v-if="invoice.discount && parseFloat(invoice.discount) > 0">
                      <td colspan="4" class="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Discount:
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        -{{ getCurrencySymbol(invoice.currency) }}{{ formatCurrency(invoice.discount || 0) }}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4" class="px-6 py-4 text-right text-sm font-bold text-gray-900">
                        Total:
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {{ getCurrencySymbol(invoice.currency) }}{{ formatCurrency(invoice.total || 0) }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button
              @click="downloadPDF"
              :disabled="downloading || !invoice"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="!downloading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ downloading ? 'Downloading...' : 'Download PDF' }}
            </button>
            <button
              @click="sendEmail"
              :disabled="sendingEmail || !invoice"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="!sendingEmail" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ sendingEmail ? 'Sending...' : 'Send Email' }}
            </button>
          </div>
          <button
            @click="$emit('close')"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { commerceAPI } from '@/services/api'

const props = defineProps({
  invoice: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const loading = ref(false)
const error = ref(null)
const downloading = ref(false)
const sendingEmail = ref(false)

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getCurrencySymbol = (currency) => {
  const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'CAD': 'C$',
    'AUD': 'A$',
    'ZAR': 'R'
  }
  const currencyUpper = (currency || 'USD').toUpperCase()
  return currencySymbols[currencyUpper] || currencyUpper
}

const getStatusColor = (status) => {
  const colors = {
    paid: 'bg-green-100 text-green-800',
    open: 'bg-yellow-100 text-yellow-800',
    void: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const downloadPDF = async () => {
  if (!props.invoice?.id) return
  
  downloading.value = true
  try {
    const response = await commerceAPI.downloadOrderInvoicePDF(props.invoice.id)
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${props.invoice.invoice_number || props.invoice.id}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Download Started',
        text: 'Invoice PDF is downloading',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } catch (err) {
    console.error('Error downloading PDF:', err)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: err.response?.data?.message || 'Failed to download invoice PDF',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } finally {
    downloading.value = false
  }
}

const sendEmail = async () => {
  if (!props.invoice?.id) return
  
  sendingEmail.value = true
  try {
    await commerceAPI.sendOrderInvoiceEmail(props.invoice.id)
    
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Email Sent!',
        text: 'Invoice email has been sent successfully',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } catch (err) {
    console.error('Error sending email:', err)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Email Failed',
        text: err.response?.data?.message || 'Failed to send invoice email',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } finally {
    sendingEmail.value = false
  }
}
</script>


