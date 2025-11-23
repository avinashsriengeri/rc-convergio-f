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
        <!-- Step 1: Customer Selection (Required) -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Customer Selection</h3>
          
          <div class="space-y-4">
            <!-- Contact Search and Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Customer <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="contactSearchQuery"
                  type="text"
                  placeholder="Search for a customer..."
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  :class="{ 'border-red-300': errors.contact_id }"
                  @input="searchContacts"
                  @focus="showContactDropdown = true"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg v-if="!contactsLoading" class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
                
                <!-- Contact Dropdown -->
                <div
                  v-if="showContactDropdown && (availableContacts.length > 0 || contactSearchQuery.trim())"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  <div
                    v-for="contact in availableContacts"
                    :key="contact.id"
                    @click="selectContact(contact)"
                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div class="font-medium text-gray-900">
                      {{ contact.first_name }} {{ contact.last_name }}
                    </div>
                    <div class="text-sm text-gray-500">{{ contact.email }}</div>
                  </div>
                  <div v-if="availableContacts.length === 0 && contactSearchQuery.trim() && !contactsLoading" class="px-4 py-2 text-sm text-gray-500">
                    No contacts found
                  </div>
                </div>
              </div>
              <p v-if="errors.contact_id" class="mt-1 text-sm text-red-600">{{ errors.contact_id }}</p>
              <p v-if="selectedContact" class="mt-1 text-sm text-gray-600">
                Selected: <span class="font-medium">{{ selectedContact.first_name }} {{ selectedContact.last_name }}</span>
                <button
                  type="button"
                  @click="clearContact"
                  class="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                >
                  Change
                </button>
              </p>
            </div>
          </div>
        </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Basic Information -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Basic Information -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            
            <div class="space-y-4">
              <!-- Deal (Optional) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Deal (Optional)
                </label>
                <div class="relative">
                  <select
                    v-model="form.deal_id"
                    @change="onDealChange"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    :class="{ 'border-red-300': errors.deal_id }"
                    :disabled="dealsLoading || !form.contact_id"
                  >
                    <option value="">{{ dealsLoading ? 'Loading deals...' : form.contact_id ? 'Select a deal (Optional)' : 'Select customer first' }}</option>
                    <option
                      v-for="deal in contactDeals"
                      :key="deal.id"
                      :value="deal.id"
                    >
                      {{ deal.title }} - {{ formatCurrency(deal.value, deal.currency) }}
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
                  :disabled="form.deal_id && selectedDeal"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  :class="{ 'bg-gray-100': form.deal_id && selectedDeal }"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                  <option value="ZAR">ZAR</option>
                </select>
                <p v-if="form.deal_id && selectedDeal" class="mt-1 text-xs text-gray-500">
                  Currency set from deal: {{ selectedDeal.currency }}
                </p>
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
                        :disabled="!!item.product_id"
                        @input="onItemChange(item, index)"
                      />
                      <div v-if="item.product_id" class="text-xs text-gray-500 mt-1">
                        From Product Library
                      </div>
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
                        @input="onItemChange(item, index)"
                      />
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-right">
                      <div class="flex flex-col">
                        <input
                          v-model.number="item.unit_price"
                          type="number"
                          min="0"
                          step="0.01"
                          class="block w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          @input="onItemChange(item, index)"
                        />
                        <div v-if="item.preview_data" class="text-xs text-gray-500 mt-1">
                          <div v-if="item.preview_data.product_currency !== form.currency" class="flex items-center gap-1">
                            <span>
                              {{ formatCurrency(item.preview_data.original_unit_price, item.preview_data.product_currency) }}
                              <span class="text-gray-400">→</span>
                              {{ formatCurrency(item.preview_data.converted_unit_price, form.currency) }}
                            </span>
                            <span v-if="item.preview_data.exchange_rate" class="text-gray-400">
                              (Rate: {{ formatExchangeRate(item.preview_data.exchange_rate) }})
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-center">
                      <input
                        v-model.number="item.discount"
                        type="number"
                        min="0"
                        step="0.01"
                        class="block w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        @input="onItemChange(item, index)"
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
                        @input="onItemChange(item, index)"
                      />
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {{ formatCurrency(item.line_total || item.preview_data?.total || 0, form.currency) }}
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
                      <span class="font-medium text-gray-900">{{ formatCurrency(previewSummary?.subtotal || totals.subtotal, form.currency) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Discount:</span>
                      <span class="font-medium text-red-600">-{{ formatCurrency(previewSummary?.discount || totals.discount, form.currency) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Tax ({{ totals.tax_rate }}%):</span>
                      <span class="font-medium text-gray-900">{{ formatCurrency(previewSummary?.tax || totals.tax, form.currency) }}</span>
                    </div>
                    <div class="flex justify-between text-lg font-bold border-t border-gray-300 pt-3 mt-3">
                      <span class="text-gray-900">Total:</span>
                      <span class="text-blue-600">{{ formatCurrency(previewSummary?.total || totals.grand_total, form.currency) }}</span>
                    </div>
                    <div v-if="previewLoading" class="text-xs text-gray-500 text-center">
                      <div class="inline-flex items-center">
                        <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                        Calculating prices...
                      </div>
                    </div>
                    <!-- Refresh Exchange Rate Button -->
                    <div v-if="currentRateInfo && !previewLoading" class="mt-3 pt-3 border-t border-gray-200">
                      <div class="flex items-center justify-between text-xs">
                        <div class="text-gray-600">
                          <span>Rate: {{ formatExchangeRate(currentRateInfo.rate) }}</span>
                          <span class="text-gray-400 ml-2">
                            ({{ currentRateInfo.from_currency }} → {{ currentRateInfo.to_currency }})
                          </span>
                        </div>
                        <button
                          type="button"
                          @click="refreshExchangeRate"
                          :disabled="refreshingRate"
                          class="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1"
                        >
                          <svg
                            v-if="!refreshingRate"
                            class="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <div v-else class="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                          Refresh Rate
                        </button>
                      </div>
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuotesStore } from '@/stores/quotesStore'
import { contactsAPI, quotesAPI, exchangeRatesAPI } from '@/services/api'
import { success, error } from '@/utils/notifications'
import BaseButton from '@/components/ui/BaseButton.vue'
import { debounce } from 'lodash-es'

const router = useRouter()
const route = useRoute()
const quotesStore = useQuotesStore()

// Reactive data
const loading = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const quoteId = ref(null)
const errors = ref({})
const selectedProductId = ref('')
const productsLoading = ref(false)
const templatesLoading = ref(false)

// Contact selection
const contactSearchQuery = ref('')
const availableContacts = ref([])
const selectedContact = ref(null)
const contactsLoading = ref(false)
const showContactDropdown = ref(false)

// Deal selection for contact
const contactDeals = ref([])
const dealsLoading = ref(false)
const selectedDeal = computed(() => {
  if (!form.deal_id) return null
  return contactDeals.value.find(d => d.id == form.deal_id)
})

// Preview prices
const previewLoading = ref(false)
const previewSummary = ref(null)
let previewDebounceTimer = null

// Exchange rates
const exchangeRates = ref({}) // Store rates by currency pair key (e.g., "USD-ZAR")
const refreshingRate = ref(false)
const currentRateInfo = ref(null) // { from_currency, to_currency, rate, last_updated }

const form = reactive({
  contact_id: '', // Required - added
  deal_id: '', // Optional
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

// Contact search and selection
const searchContacts = debounce(async () => {
  if (!contactSearchQuery.value.trim()) {
    availableContacts.value = []
    return
  }
  
  contactsLoading.value = true
  try {
    const response = await contactsAPI.getContacts({
      search: contactSearchQuery.value.trim(),
      per_page: 20
    })
    availableContacts.value = response.data.data || []
  } catch (err) {
    console.error('Failed to search contacts:', err)
    availableContacts.value = []
  } finally {
    contactsLoading.value = false
  }
}, 300)

const selectContact = async (contact) => {
  selectedContact.value = contact
  form.contact_id = contact.id
  form.contact_name = `${contact.first_name} ${contact.last_name}`.trim()
  form.contact_email = contact.email || ''
  form.company_name = contact.company?.name || ''
  contactSearchQuery.value = ''
  showContactDropdown.value = false
  availableContacts.value = []
  
  // Load deals for this contact
  await loadContactDeals(contact.id)
  
  // Clear deal selection when contact changes
  form.deal_id = ''
}

const clearContact = () => {
  selectedContact.value = null
  form.contact_id = ''
  form.contact_name = ''
  form.contact_email = ''
  form.company_name = ''
  form.deal_id = ''
  contactDeals.value = []
  contactSearchQuery.value = ''
}

// Load deals for selected contact
const loadContactDeals = async (contactId) => {
  if (!contactId) {
    contactDeals.value = []
    return
  }
  
  dealsLoading.value = true
  try {
    const response = await contactsAPI.getContactDeals(contactId, {
      per_page: 100,
      status: 'open'
    })
    contactDeals.value = response.data.data || []
  } catch (err) {
    console.error('Error loading contact deals:', err)
    contactDeals.value = []
  } finally {
    dealsLoading.value = false
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
      contact_id: quote.contact_id || '', // New required field
      deal_id: quote.deal_id || '',
      currency: quote.currency || 'USD',
      quote_type: quote.quote_type || 'primary', // Default to primary if not set
      template_id: quote.template_id || '', // Add template_id
      valid_until: formattedValidUntil,
      status: quote.status || 'draft',
      // Extract contact and company info from quote or deal
      contact_name: quote.contact?.first_name && quote.contact?.last_name 
        ? `${quote.contact.first_name} ${quote.contact.last_name}`.trim()
        : quote.deal?.contact?.name || quote.contact?.name || '',
      contact_email: quote.contact?.email || quote.deal?.contact?.email || '',
      company_name: quote.contact?.company?.name || quote.deal?.company?.name || '',
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
      // If item has product_id, preserve it
      if (item.product_id) {
        // Keep product_id for preview
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
  
  // Contact is now required
  if (!form.contact_id) {
    errors.value.contact_id = 'Please select a customer'
  }
  
  if (form.items.length === 0) {
    errors.value.items = 'Please add at least one line item'
  }
  
  // Validate line items
  form.items.forEach((item, index) => {
    if (!item.name && !item.product_id) {
      errors.value[`item_${index}_name`] = 'Item name is required'
    }
    if (!item.quantity || item.quantity < 1) {
      errors.value[`item_${index}_quantity`] = 'Quantity must be at least 1'
    }
    if (item.unit_price === undefined || item.unit_price < 0) {
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
      contact_id: form.contact_id, // Required
      deal_id: form.deal_id || null, // Optional
      currency: form.currency,
      quote_type: form.quote_type,
      template_id: form.template_id || null,
      valid_until: form.valid_until,
      status: 'draft',
      terms: form.terms,
      notes: form.notes,
      // Format items for API - use product_id if available
      items: form.items.map((item, index) => {
        const itemPayload = {
          sort_order: index + 1,
          quantity: item.quantity || 1,
          discount: item.discount || 0
        }
        
        // If product_id exists, use it; otherwise use manual entry
        if (item.product_id) {
          itemPayload.product_id = item.product_id
        } else {
          itemPayload.name = item.name
          itemPayload.description = item.description || ''
          itemPayload.unit_price = item.unit_price || 0
          itemPayload.tax_rate = item.tax_rate || 0
        }
        
        return itemPayload
      })
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
      contact_id: form.contact_id, // Required
      deal_id: form.deal_id || null, // Optional
      currency: form.currency,
      quote_type: form.quote_type,
      template_id: form.template_id || null,
      valid_until: form.valid_until,
      status: 'sent',
      terms: form.terms,
      notes: form.notes,
      // Format items for API - use product_id if available
      items: form.items.map((item, index) => {
        const itemPayload = {
          sort_order: index + 1,
          quantity: item.quantity || 1,
          discount: item.discount || 0
        }
        
        // If product_id exists, use it; otherwise use manual entry
        if (item.product_id) {
          itemPayload.product_id = item.product_id
        } else {
          itemPayload.name = item.name
          itemPayload.description = item.description || ''
          itemPayload.unit_price = item.unit_price || 0
          itemPayload.tax_rate = item.tax_rate || 0
        }
        
        return itemPayload
      })
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
  const deal = selectedDeal.value
  if (deal) {
    // Auto-set currency from deal
    if (deal.currency) {
      form.currency = deal.currency
    }
    
    // Trigger preview update if items exist
    if (form.items.length > 0) {
      previewPrices()
    }
  } else {
    // Reset currency to default if no deal
    form.currency = 'USD'
  }
}

// Watch currency changes to trigger preview
watch(() => form.currency, () => {
  if (form.items.length > 0 && form.items.some(item => item.product_id)) {
    previewPrices()
  }
})

const cancel = () => {
  router.push('/sales/quotes')
}

const formatCurrency = (amount, currency = 'USD') => {
  if (!amount && amount !== 0) return '0.00'
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    ZAR: 'R'
  }
  const symbol = currencySymbols[currency] || currency
  return `${symbol}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)}`
}

const formatExchangeRate = (rate) => {
  if (!rate) return 'N/A'
  // Format to 4 decimal places for exchange rates
  return parseFloat(rate).toFixed(4)
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
        product_id: product.id, // Add product_id for API
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
      
      // Trigger preview prices if currency is set
      if (form.currency) {
        previewPrices()
      }
    }
  } catch (err) {
    console.error('Error adding product:', err)
    error('Failed to add product')
  }
}

// Get exchange rate for currency conversion
const getExchangeRate = async (fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return null // No conversion needed
  }
  
  const rateKey = `${fromCurrency}-${toCurrency}`
  
  // Check if we already have a cached rate
  if (exchangeRates.value[rateKey]) {
    return exchangeRates.value[rateKey]
  }
  
  try {
    const response = await exchangeRatesAPI.getRate(fromCurrency, toCurrency)
    const rateData = response.data.data || response.data
    
    if (rateData && rateData.rate) {
      exchangeRates.value[rateKey] = rateData
      return rateData
    }
  } catch (err) {
    console.error('Error fetching exchange rate:', err)
    // Don't block preview if rate fetch fails - backend will handle it
  }
  
  return null
}

// Get current exchange rate info for display
const getCurrentRateInfo = () => {
  // Find first product that needs conversion
  const itemWithConversion = form.items.find(item => 
    item.product_id && 
    item.preview_data && 
    item.preview_data.product_currency !== form.currency
  )
  
  if (itemWithConversion && itemWithConversion.preview_data) {
    return {
      from_currency: itemWithConversion.preview_data.product_currency,
      to_currency: form.currency,
      rate: itemWithConversion.preview_data.exchange_rate
    }
  }
  
  return null
}

// Preview prices API call
const previewPrices = async () => {
  // Clear existing timer
  if (previewDebounceTimer) {
    clearTimeout(previewDebounceTimer)
  }
  
  // Debounce the API call
  previewDebounceTimer = setTimeout(async () => {
    if (!form.currency || form.items.length === 0) {
      previewSummary.value = null
      currentRateInfo.value = null
      return
    }
    
    // Only preview items with product_id
    const itemsWithProducts = form.items.filter(item => item.product_id)
    if (itemsWithProducts.length === 0) {
      previewSummary.value = null
      currentRateInfo.value = null
      return
    }
    
    // Reset current rate info - will be set after preview
    currentRateInfo.value = null
    
    // Check if we need to get exchange rates first
    // Get unique product currencies that differ from quote currency
    const products = quotesStore.products || []
    const productCurrencies = new Set()
    
    itemsWithProducts.forEach(item => {
      const product = products.find(p => p.id === item.product_id)
      if (product && product.currency && product.currency !== form.currency) {
        productCurrencies.add(product.currency)
      }
    })
    
    // Fetch exchange rates if needed (optional - backend will also fetch)
    if (productCurrencies.size > 0) {
      const ratePromises = Array.from(productCurrencies).map(productCurrency => 
        getExchangeRate(productCurrency, form.currency)
      )
      await Promise.all(ratePromises)
    }
    
    previewLoading.value = true
    try {
      const response = await quotesAPI.previewPrices({
        products: itemsWithProducts.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity || 1,
          discount: item.discount || 0
        })),
        target_currency: form.currency,
        deal_id: form.deal_id || null
      })
      
      const previewData = response.data.data
      
      // Update items with preview data
      form.items.forEach((item, index) => {
        if (item.product_id) {
          const previewItem = previewData.items.find(pi => pi.product_id === item.product_id)
          if (previewItem) {
            item.preview_data = previewItem
            item.unit_price = previewItem.converted_unit_price
            item.line_total = previewItem.total
            
            // Cache exchange rate if available
            if (previewItem.exchange_rate && previewItem.product_currency !== form.currency) {
              const rateKey = `${previewItem.product_currency}-${form.currency}`
              exchangeRates.value[rateKey] = {
                from_currency: previewItem.product_currency,
                to_currency: form.currency,
                rate: previewItem.exchange_rate
              }
            }
          }
        }
      })
      
      // Update summary
      previewSummary.value = previewData.summary
      
      // Update current rate info for display
      currentRateInfo.value = getCurrentRateInfo()
    } catch (err) {
      console.error('Error previewing prices:', err)
      // Don't show error toast, just log it
      previewSummary.value = null
      currentRateInfo.value = null
    } finally {
      previewLoading.value = false
    }
  }, 300)
}

// Refresh exchange rate and update preview
const refreshExchangeRate = async () => {
  if (!currentRateInfo.value) {
    return
  }
  
  const { from_currency, to_currency } = currentRateInfo.value
  
  refreshingRate.value = true
  try {
    // Call refresh API
    await exchangeRatesAPI.refreshRate(from_currency, to_currency)
    
    // Clear cached rate to force fresh fetch
    const rateKey = `${from_currency}-${to_currency}`
    delete exchangeRates.value[rateKey]
    
    // Get fresh rate
    await getExchangeRate(from_currency, to_currency)
    
    // Clear debounce timer and call preview prices immediately
    if (previewDebounceTimer) {
      clearTimeout(previewDebounceTimer)
      previewDebounceTimer = null
    }
    
    // Call preview prices directly (bypass debounce for refresh)
    if (form.currency && form.items.length > 0) {
      const itemsWithProducts = form.items.filter(item => item.product_id)
      if (itemsWithProducts.length > 0) {
        previewLoading.value = true
        try {
          const response = await quotesAPI.previewPrices({
            products: itemsWithProducts.map(item => ({
              product_id: item.product_id,
              quantity: item.quantity || 1,
              discount: item.discount || 0
            })),
            target_currency: form.currency,
            deal_id: form.deal_id || null
          })
          
          const previewData = response.data.data
          
          // Update items with preview data
          form.items.forEach((item, index) => {
            if (item.product_id) {
              const previewItem = previewData.items.find(pi => pi.product_id === item.product_id)
              if (previewItem) {
                item.preview_data = previewItem
                item.unit_price = previewItem.converted_unit_price
                item.line_total = previewItem.total
                
                // Cache exchange rate if available
                if (previewItem.exchange_rate && previewItem.product_currency !== form.currency) {
                  const rateKey = `${previewItem.product_currency}-${form.currency}`
                  exchangeRates.value[rateKey] = {
                    from_currency: previewItem.product_currency,
                    to_currency: form.currency,
                    rate: previewItem.exchange_rate
                  }
                }
              }
            }
          })
          
          // Update summary
          previewSummary.value = previewData.summary
          
          // Update current rate info for display
          currentRateInfo.value = getCurrentRateInfo()
        } catch (err) {
          console.error('Error previewing prices after refresh:', err)
        } finally {
          previewLoading.value = false
        }
      }
    }
    
    success('Exchange rate refreshed successfully')
  } catch (err) {
    console.error('Error refreshing exchange rate:', err)
    error('Failed to refresh exchange rate')
  } finally {
    refreshingRate.value = false
  }
}

// Handle item changes (quantity, discount, etc.)
const onItemChange = (item, index) => {
  // Calculate local total first (for manual items or fallback)
  calculateLineTotal(item, index)
  
  // If item has product_id, trigger preview prices API
  if (item.product_id && form.currency) {
    previewPrices()
  }
}

// Remove line item and trigger preview if needed
const removeLineItem = (index) => {
  const item = form.items[index]
  form.items.splice(index, 1)
  // Update sort_order for remaining items
  form.items.forEach((item, idx) => {
    item.sort_order = idx + 1
  })
  
  // Trigger preview if there are still product items
  if (form.items.some(i => i.product_id) && form.currency) {
    previewPrices()
  }
}

const onTemplateChange = () => {
  // Template change logic can be added here if needed
  console.log('Template changed to:', form.template_id)
}

// Lifecycle
onMounted(async () => {
  await loadProducts()
  await loadTemplates()
  
  // Check if editing
  quoteId.value = route.params.id
  if (quoteId.value) {
    isEdit.value = true
    await loadQuote(quoteId.value)
    
    // If editing and quote has contact_id, load contact and deals
    if (form.contact_id) {
      try {
        const contactResponse = await contactsAPI.getContact(form.contact_id)
        const contact = contactResponse.data.data
        selectedContact.value = contact
        await loadContactDeals(form.contact_id)
      } catch (err) {
        console.error('Error loading contact:', err)
      }
    }
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
  
  // Handle contact_id or deal_id from query params
  if (route.query.contact_id) {
    try {
      const contactResponse = await contactsAPI.getContact(route.query.contact_id)
      const contact = contactResponse.data.data
      await selectContact(contact)
    } catch (err) {
      console.error('Error loading contact from query:', err)
    }
  } else if (route.query.deal_id) {
    // Legacy support - if deal_id is provided, try to get contact from deal
    form.deal_id = route.query.deal_id
    // Note: This will be handled when contact is selected
  }
  
  // Close contact dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showContactDropdown.value = false
    }
  })
})
</script>
