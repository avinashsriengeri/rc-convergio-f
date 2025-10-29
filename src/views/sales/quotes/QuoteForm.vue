<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ isEdit ? $t('sales.quotes.edit_quote') : $t('sales.quotes.create_quote') }}
            </h1>
            <p class="text-gray-600">
              {{ isEdit ? $t('sales.quotes.edit_description') : $t('sales.quotes.create_description') }}
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="outline"
              @click="cancel"
              class="px-4 py-2"
            >
              {{ $t('common.cancel') }}
            </BaseButton>
            <BaseButton
              variant="secondary"
              @click="saveDraft"
              :loading="saving"
              class="px-4 py-2"
            >
              {{ $t('sales.quotes.save_draft') }}
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="saveAndSend"
              :loading="saving"
              class="px-4 py-2"
            >
              {{ $t('sales.quotes.save_and_send') }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">{{ $t('sales.quotes.loading') }}</span>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Basic Information -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Deal Selection -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            
            <div class="space-y-4">
              <!-- Deal -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Deal <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <select
                    v-model="form.deal_id"
                    @change="onDealChange"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    :class="{ 'border-red-300': errors.deal_id }"
                    :disabled="dealsLoading"
                    required
                  >
                    <option value="">{{ dealsLoading ? 'Loading deals...' : 'Select a deal' }}</option>
                    <option
                      v-for="deal in deals"
                      :key="deal.id"
                      :value="deal.id"
                    >
                      {{ deal.title }} - {{ deal.contact?.name || 'No Contact' }}
                    </option>
                  </select>
                  <div v-if="dealsLoading" class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                </div>
                <p v-if="errors.deal_id" class="mt-1 text-sm text-red-600">{{ errors.deal_id }}</p>
              </div>

              <!-- Currency -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  v-model="form.currency"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                </select>
              </div>

              <!-- Quote Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Quote Type
                </label>
                <select
                  v-model="form.quote_type"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="primary">Primary</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="renewal">Renewal</option>
                  <option value="amendment">Amendment</option>
                  <option value="alternative">Alternative</option>
                </select>
              </div>

              <!-- Template Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Quote Template
                </label>
                <div class="relative">
                  <select
                    v-model="form.template_id"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    @change="onTemplateChange"
                  >
                    <option value="">Select Template (Optional)</option>
                    <option v-for="template in (templates || [])" :key="template.id" :value="template.id">
                      {{ template.name }} ({{ template.layout }})
                    </option>
                  </select>
                  <div v-if="templatesLoading" class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                </div>
              </div>

              <!-- Valid Until -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Valid Until
                </label>
                <input
                  v-model="form.valid_until"
                  type="date"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <!-- Status -->
              <div v-if="isEdit">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  v-model="form.status"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  :disabled="form.status !== 'draft'"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Client Information -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
            
            <div class="space-y-4">
              <!-- Contact Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <input
                  v-model="form.contact_name"
                  type="text"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contact person name"
                />
              </div>

              <!-- Contact Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  v-model="form.contact_email"
                  type="email"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="contact@example.com"
                />
              </div>

              <!-- Company -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  v-model="form.company_name"
                  type="text"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Company name"
                />
              </div>
            </div>
          </div>

          <!-- Terms & Notes -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Terms & Notes</h3>
            
            <div class="space-y-4">
              <!-- Terms -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Terms & Conditions
                </label>
                <textarea
                  v-model="form.terms"
                  rows="4"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter terms and conditions..."
                ></textarea>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Internal Notes
                </label>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Internal notes (not visible to client)..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Line Items -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-gray-900">Line Items</h3>
              <div class="flex items-center space-x-3">
                <!-- Add Product Dropdown -->
                <div class="relative">
                  <select
                    v-model="selectedProductId"
                    @change="addProduct"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    :disabled="!products || products.length === 0"
                  >
                    <option value="">Add from Product Library</option>
                    <option v-for="product in (products || [])" :key="product.id" :value="product.id">
                      {{ product.name }} - ${{ formatCurrency(product.unit_price) }}
                    </option>
                  </select>
                  <div v-if="productsLoading" class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                </div>
                
                <BaseButton
                  type="button"
                  variant="outline"
                  @click="addLineItem"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Item
                </BaseButton>
              </div>
            </div>

            <!-- Line Items Table -->
            <div v-if="form.items.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No line items</h3>
              <p class="mt-1 text-sm text-gray-500">Add your first line item to get started.</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tax Rate
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(item, index) in form.items"
                    :key="index"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-4 py-4 whitespace-nowrap">
                      <input
                        v-model="item.name"
                        type="text"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Item name"
                        @input="calculateLineTotal(item, index)"
                      />
                    </td>
                    <td class="px-4 py-4">
                      <textarea
                        v-model="item.description"
                        rows="2"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Description"
                      ></textarea>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-center">
                      <input
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        class="block w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        @input="calculateLineTotal(item, index)"
                      />
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-right">
                      <input
                        v-model.number="item.unit_price"
                        type="number"
                        min="0"
                        step="0.01"
                        class="block w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        @input="calculateLineTotal(item, index)"
                      />
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-center">
                      <input
                        v-model.number="item.discount"
                        type="number"
                        min="0"
                        step="0.01"
                        class="block w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        @input="calculateLineTotal(item, index)"
                      />
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-center">
                      <input
                        v-model.number="item.tax_rate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        class="block w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        @input="calculateLineTotal(item, index)"
                      />
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      ${{ formatCurrency(item.line_total) }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-center">
                      <button
                        type="button"
                        @click="removeLineItem(index)"
                        class="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                        title="Remove item"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Totals Summary -->
            <div class="mt-8 border-t border-gray-200 pt-6">
              <div class="flex justify-end">
                <div class="w-80 bg-gray-50 rounded-lg p-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Quote Summary</h4>
                  <div class="space-y-3">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Subtotal:</span>
                      <span class="font-medium text-gray-900">${{ formatCurrency(totals.subtotal) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Discount:</span>
                      <span class="font-medium text-red-600">-${{ formatCurrency(totals.discount) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Tax ({{ totals.tax_rate }}%):</span>
                      <span class="font-medium text-gray-900">${{ formatCurrency(totals.tax) }}</span>
                    </div>
                    <div class="flex justify-between text-lg font-bold border-t border-gray-300 pt-3 mt-3">
                      <span class="text-gray-900">Total:</span>
                      <span class="text-blue-600">${{ formatCurrency(totals.grand_total) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuotesStore } from '@/stores/quotesStore'
import { useDealsStore } from '@/stores/deals'
import { success, error } from '@/utils/notifications'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const route = useRoute()
const quotesStore = useQuotesStore()
const dealsStore = useDealsStore()

// Reactive data
const loading = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const quoteId = ref(null)
const errors = ref({})
const selectedProductId = ref('')
const productsLoading = ref(false)
const templatesLoading = ref(false)

const form = reactive({
  deal_id: '',
  currency: 'USD',
  quote_type: 'primary', // Default to primary
  template_id: '', // Add template selection
  valid_until: '',
  status: 'draft',
  contact_name: '',
  contact_email: '',
  company_name: '',
  terms: '',
  notes: '',
  items: [] // Changed from line_items to items to match backend API
})

// Computed
const products = computed(() => quotesStore.products)
const templates = computed(() => quotesStore.templates)

const totals = computed(() => {
  let subtotal = 0
  let totalDiscount = 0
  let totalTax = 0
  let totalTaxRate = 0

  form.items.forEach(item => {
    const itemTotal = (item.quantity || 0) * (item.unit_price || 0)
    const discount = item.discount || 0
    const afterDiscount = itemTotal - discount
    const tax = afterDiscount * ((item.tax_rate || 0) / 100)
    
    subtotal += itemTotal
    totalDiscount += discount
    totalTax += tax
  })

  const grandTotal = subtotal - totalDiscount + totalTax
  
  // Calculate average tax rate
  if (form.items.length > 0) {
    totalTaxRate = form.items.reduce((sum, item) => sum + (item.tax_rate || 0), 0) / form.items.length
  }

  return {
    subtotal,
    discount: totalDiscount,
    tax: totalTax,
    tax_rate: totalTaxRate.toFixed(2),
    grand_total: grandTotal
  }
})

// Computed
const deals = computed(() => dealsStore.deals)
const dealsLoading = computed(() => dealsStore.loading)

// Methods
const loadDeals = async () => {
  try {
    await dealsStore.fetchDeals({ per_page: 1000, sort: 'title' })
  } catch (err) {
    console.error('Error loading deals:', err)
    error('Failed to load deals')
  }
}

const loadQuote = async (id) => {
  loading.value = true
  try {
    const quote = await quotesStore.getQuote(id)
    
    // Format valid_until date for HTML date input (YYYY-MM-DD format)
    let formattedValidUntil = ''
    if (quote.valid_until) {
      const date = new Date(quote.valid_until)
      formattedValidUntil = date.toISOString().split('T')[0]
    }
    
    // Populate form with quote data
    Object.assign(form, {
      deal_id: quote.deal_id || '',
      currency: quote.currency || 'USD',
      quote_type: quote.quote_type || 'primary', // Default to primary if not set
      template_id: quote.template_id || '', // Add template_id
      valid_until: formattedValidUntil,
      status: quote.status || 'draft',
      // Extract contact and company info from nested deal object
      contact_name: quote.deal?.contact?.name || '',
      contact_email: quote.deal?.contact?.email || '',
      company_name: quote.deal?.company?.name || '',
      terms: quote.terms || '',
      notes: quote.notes || '',
      items: quote.items || quote.line_items || [] // Handle both new and old field names
    })
    
    // Recalculate line totals for each item to ensure correct display
    form.items.forEach((item, index) => {
      // Map API total field to line_total for display
      if (item.total && !item.line_total) {
        item.line_total = parseFloat(item.total)
      }
      calculateLineTotal(item, index)
    })
  } catch (err) {
    console.error('Error loading quote:', err)
    error('Failed to load quote')
  } finally {
    loading.value = false
  }
}

const addLineItem = () => {
  form.items.push({
    name: '',
    description: '',
    quantity: 1,
    unit_price: 0,
    discount: 0,
    tax_rate: 0,
    sort_order: form.items.length + 1, // Add sort_order field required by backend
    line_total: 0
  })
}

const removeLineItem = (index) => {
  form.items.splice(index, 1)
  // Update sort_order for remaining items
  form.items.forEach((item, idx) => {
    item.sort_order = idx + 1
  })
}

const calculateLineTotal = (item, index) => {
  const quantity = item.quantity || 0
  const unitPrice = item.unit_price || 0
  const discount = item.discount || 0
  const taxRate = item.tax_rate || 0
  
  const subtotal = quantity * unitPrice
  const afterDiscount = subtotal - discount
  const tax = afterDiscount * (taxRate / 100)
  const total = afterDiscount + tax
  
  item.line_total = total
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.deal_id) {
    errors.value.deal_id = 'Please select a deal'
  }
  
  if (form.items.length === 0) {
    errors.value.items = 'Please add at least one line item'
  }
  
  // Validate line items
  form.items.forEach((item, index) => {
    if (!item.name) {
      errors.value[`item_${index}_name`] = 'Item name is required'
    }
    if (!item.quantity || item.quantity < 1) {
      errors.value[`item_${index}_quantity`] = 'Quantity must be at least 1'
    }
    if (!item.unit_price || item.unit_price < 0) {
      errors.value[`item_${index}_unit_price`] = 'Unit price must be 0 or greater'
    }
  })
  
  return Object.keys(errors.value).length === 0
}

const saveDraft = async () => {
  if (!validateForm()) {
    error('Please fix the errors before saving')
    return
  }
  
  saving.value = true
  try {
    const payload = {
      ...form,
      status: 'draft',
      total_amount: totals.value.grand_total,
      // Ensure items have proper sort_order
      items: form.items.map((item, index) => ({
        ...item,
        sort_order: index + 1
      }))
    }
    
    if (isEdit.value) {
      await quotesStore.updateQuote(quoteId.value, payload)
      success('Quote saved as draft successfully')
      // Redirect to quotes list after successful update
      router.push('/sales/quotes')
    } else {
      const newQuote = await quotesStore.createQuote(payload)
      success('Quote saved as draft successfully')
      router.push(`/sales/quotes/${newQuote.id}`)
    }
  } catch (err) {
    console.error('Error saving quote:', err)
    error('Failed to save quote')
  } finally {
    saving.value = false
  }
}

const saveAndSend = async () => {
  if (!validateForm()) {
    error('Please fix the errors before sending')
    return
  }
  
  saving.value = true
  try {
    const payload = {
      ...form,
      status: 'sent',
      total_amount: totals.value.grand_total,
      // Ensure items have proper sort_order
      items: form.items.map((item, index) => ({
        ...item,
        sort_order: index + 1
      }))
    }
    
    let savedQuote
    if (isEdit.value) {
      savedQuote = await quotesStore.updateQuote(quoteId.value, payload)
    } else {
      savedQuote = await quotesStore.createQuote(payload)
    }
    
    // Send the quote
    await quotesStore.sendQuote(savedQuote.id)
    
    if (isEdit.value) {
      success('Quote updated and sent successfully')
      // Redirect to quotes list after successful update and send
      router.push('/sales/quotes')
    } else {
      success('Quote created and sent successfully')
      router.push(`/sales/quotes/${savedQuote.id}`)
    }
  } catch (err) {
    console.error('Error saving and sending quote:', err)
    error('Failed to save and send quote')
  } finally {
    saving.value = false
  }
}

const handleSubmit = () => {
  saveDraft()
}

const onDealChange = () => {
  const selectedDeal = deals.value.find(deal => deal.id == form.deal_id)
  if (selectedDeal) {
    // Populate contact name from name field (or first_name + last_name if available)
    if (selectedDeal.contact) {
      if (selectedDeal.contact.name) {
        form.contact_name = selectedDeal.contact.name
      } else {
        // Fallback to first_name + last_name if name is not available
        const firstName = selectedDeal.contact.first_name || ''
        const lastName = selectedDeal.contact.last_name || ''
        form.contact_name = `${firstName} ${lastName}`.trim()
      }
      form.contact_email = selectedDeal.contact.email || ''
    } else {
      form.contact_name = ''
      form.contact_email = ''
    }
    
    // Populate company name
    form.company_name = selectedDeal.company?.name || ''
  } else {
    // Clear fields if no deal selected
    form.contact_name = ''
    form.contact_email = ''
    form.company_name = ''
  }
}

const cancel = () => {
  router.push('/sales/quotes')
}

const formatCurrency = (amount) => {
  if (!amount) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// New methods for products and templates
const loadProducts = async () => {
  productsLoading.value = true
  try {
    await quotesStore.fetchProducts({ status: 'active' })
  } catch (err) {
    console.error('Error loading products:', err)
    // Don't show error toast for initial load failures
    console.log('Products will be loaded when available')
  } finally {
    productsLoading.value = false
  }
}

const loadTemplates = async () => {
  templatesLoading.value = true
  try {
    await quotesStore.fetchTemplates()
  } catch (err) {
    console.error('Error loading templates:', err)
    // Don't show error toast for initial load failures
    console.log('Templates will be loaded when available')
  } finally {
    templatesLoading.value = false
  }
}

const addProduct = async () => {
  if (!selectedProductId.value || !products.value) return
  
  try {
    const product = products.value.find(p => p.id == selectedProductId.value)
    if (product) {
      const newItem = {
        name: product.name,
        description: product.description || '',
        quantity: 1,
        unit_price: parseFloat(product.unit_price),
        discount: 0,
        tax_rate: parseFloat(product.tax_rate) || 0,
        line_total: parseFloat(product.unit_price),
        sort_order: form.items.length + 1
      }
      
      form.items.push(newItem)
      selectedProductId.value = '' // Reset selection
    }
  } catch (err) {
    console.error('Error adding product:', err)
    error('Failed to add product')
  }
}

const onTemplateChange = () => {
  // Template change logic can be added here if needed
  console.log('Template changed to:', form.template_id)
}

// Lifecycle
onMounted(async () => {
  await loadDeals()
  await loadProducts()
  await loadTemplates()
  
  // Check if editing
  quoteId.value = route.params.id
  if (quoteId.value) {
    isEdit.value = true
    await loadQuote(quoteId.value)
  } else {
    // Add initial line item for new quotes
    addLineItem()
  }
  
  // Set default valid until date (30 days from now)
  if (!form.valid_until) {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    form.valid_until = futureDate.toISOString().split('T')[0]
  }
  
  // Handle deal_id from query params
  if (route.query.deal_id) {
    form.deal_id = route.query.deal_id
    onDealChange()
  }
})
</script>
