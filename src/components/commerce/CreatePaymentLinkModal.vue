<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <!-- Header -->
        <div class="bg-white px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              Create Payment Link
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
        <form @submit.prevent="createPaymentLink">
          <div class="bg-white px-6 py-6">
            <div class="space-y-6">
              <!-- Quote Selection -->
              <div>
                <label for="quote_id" class="block text-sm font-medium text-gray-700">
                  Quote (Optional)
                </label>
                <select
                  id="quote_id"
                  v-model="formData.quote_id"
                  :disabled="quotesLoading"
                  @change="handleQuoteSelection"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-purple focus:border-primary-purple sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {{ quotesLoading ? 'Loading quotes...' : 'Select a quote...' }}
                  </option>
                  <option v-for="quote in quotes" :key="quote.id" :value="quote.id">
                    {{ quote.quote_number || quote.title }} - ${{ formatCurrency(quote.total) }}
                  </option>
                </select>
                <p class="mt-2 text-sm text-gray-500">
                  Link this payment to an existing quote
                </p>
              </div>

              <!-- Link Title -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700">
                  Link Title
                </label>
                <input
                  id="title"
                  v-model="formData.title"
                  type="text"
                  required
                  placeholder="Enter a title for this payment link"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-purple focus:border-primary-purple sm:text-sm"
                />
              </div>

              <!-- Amount -->
              <div>
                <label for="amount" class="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    id="amount"
                    v-model="formData.amount"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    class="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-purple focus:border-primary-purple sm:text-sm"
                  />
                </div>
              </div>

              <!-- Currency -->
              <div>
                <label for="currency" class="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  id="currency"
                  v-model="formData.currency"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-purple focus:border-primary-purple sm:text-sm"
                >
                  <option value="usd">USD - US Dollar</option>
                  <option value="eur">EUR - Euro</option>
                  <option value="gbp">GBP - British Pound</option>
                  <option value="cad">CAD - Canadian Dollar</option>
                  <option value="aud">AUD - Australian Dollar</option>
                </select>
              </div>

              <!-- Description -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  rows="3"
                  placeholder="Enter a description for this payment link"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-purple focus:border-primary-purple sm:text-sm"
                ></textarea>
              </div>

              <!-- Expiration -->
              <div>
                <label for="expires_at" class="block text-sm font-medium text-gray-700">
                  Expiration Date (Optional)
                </label>
                <input
                  id="expires_at"
                  v-model="formData.expires_at"
                  type="datetime-local"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-purple focus:border-primary-purple sm:text-sm"
                />
                <p class="mt-2 text-sm text-gray-500">
                  Leave empty for no expiration
                </p>
              </div>

              <!-- Metadata -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Additional Options
                </label>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <input
                      id="collect_customer_info"
                      v-model="formData.collect_customer_info"
                      type="checkbox"
                      class="focus:ring-primary-purple h-4 w-4 text-primary-purple border-gray-300 rounded"
                    />
                    <label for="collect_customer_info" class="ml-3 block text-sm font-medium text-gray-700">
                      Collect customer information
                    </label>
                  </div>
                  
                  <div class="flex items-center">
                    <input
                      id="allow_promotion_codes"
                      v-model="formData.allow_promotion_codes"
                      type="checkbox"
                      class="focus:ring-primary-purple h-4 w-4 text-primary-purple border-gray-300 rounded"
                    />
                    <label for="allow_promotion_codes" class="ml-3 block text-sm font-medium text-gray-700">
                      Allow promotion codes
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-purple hover:bg-primary-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple disabled:opacity-50"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Create Payment Link
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineEmits } from 'vue'
import { useCommerceLinksStore } from '@/stores/useCommerceLinksStore'
import { quotesAPI } from '@/services/api.js'

const linksStore = useCommerceLinksStore()

const loading = ref(false)
const quotesLoading = ref(false)
const quotes = ref([])

const formData = ref({
  quote_id: '',
  title: '',
  amount: '',
  currency: 'usd',
  description: '',
  expires_at: '',
  collect_customer_info: true,
  allow_promotion_codes: false
})

const isFormValid = computed(() => {
  return formData.value.title && 
         formData.value.amount && 
         parseFloat(formData.value.amount) > 0
})

// Watch for quote selection to auto-populate form
const selectedQuote = computed(() => {
  return quotes.value.find((quote: any) => quote.id == formData.value.quote_id)
})

// Auto-populate form when quote is selected
const handleQuoteSelection = () => {
  if (selectedQuote.value) {
    const quoteTitle = selectedQuote.value.quote_number || selectedQuote.value.title
    formData.value.title = quoteTitle
    formData.value.amount = selectedQuote.value.total.toString()
    formData.value.description = `Payment for ${quoteTitle}`
  }
}

const createPaymentLink = async () => {
  loading.value = true
  try {
    const payload = {
      ...formData.value,
      amount: parseFloat(formData.value.amount) * 100, // Convert to cents
      expires_at: formData.value.expires_at || null
    }
    
    await linksStore.createPaymentLink(payload)
    emit('created')
  } catch (error) {
    console.error('Error creating payment link:', error)
  } finally {
    loading.value = false
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const fetchQuotes = async () => {
  quotesLoading.value = true
  try {
    // Fetch all quotes without status filter (backend has issue with comma-separated status values)
    const response = await quotesAPI.getQuotes({ 
      limit: 100 
    })
    
    // Filter quotes on frontend to only show those that can be paid (professional approach)
    const allQuotes = response.data.data || []
    quotes.value = allQuotes.filter((quote: any) => 
      quote.status === 'sent' || quote.status === 'pending'
    )
  } catch (error: any) {
    console.error('Error fetching quotes:', error)
    // For development, add some mock quotes if API fails
    quotes.value = [
      {
        id: 1,
        title: 'Website Development Quote',
        total: 2999.99,
        status: 'sent'
      },
      {
        id: 2,
        title: 'Mobile App Development',
        total: 4999.99,
        status: 'pending'
      }
    ]
  } finally {
    quotesLoading.value = false
  }
}

const emit = defineEmits<{
  close: []
  created: []
}>()

onMounted(() => {
  fetchQuotes()
})
</script>
