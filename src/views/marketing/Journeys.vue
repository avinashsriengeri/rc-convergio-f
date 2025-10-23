<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumbs -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex py-4" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <div class="flex items-center">
                <router-link to="/marketing" class="text-gray-400 hover:text-gray-500">
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
                <span class="ml-4 text-sm font-medium text-gray-500">{{ $t('common.marketing') }}</span>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-900">{{ $t('marketing.journeys.title') }}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('marketing.journeys.title') }}</h1>
          <p class="mt-2 text-lg text-gray-600">{{ $t('marketing.journeys.subtitle') }}</p>
        </div>
      </div>

      <!-- Customer Journey Search Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Customer Journey Search</h3>
          <p class="mt-1 text-sm text-gray-600">Search for a customer's complete journey by email address</p>
        </div>
        <div class="p-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <label for="customer-email" class="block text-sm font-medium text-gray-700 mb-2">
                Customer Email
              </label>
              <input
                id="customer-email"
                v-model="customerEmail"
                type="email"
                placeholder="Enter customer email address"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                @keyup.enter="searchCustomerJourney"
              />
            </div>
            <div class="flex items-end">
              <button
                @click="searchCustomerJourney"
                :disabled="!customerEmail || searchingJourney"
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center"
              >
                <svg v-if="searchingJourney" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ searchingJourney ? 'Searching...' : 'Search Journey' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Journey Error -->
      <div v-if="journeyError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error searching customer journey</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ journeyError }}</p>
            </div>
            <div class="mt-4">
              <button
                @click="journeyError = null"
                class="bg-red-100 px-2 py-1 rounded text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Journey Results -->
      <div v-if="customerJourney" class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Customer Journey</h3>
            <button
              @click="clearCustomerJourney"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6">
          <!-- Contact Info -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h4 class="text-lg font-medium text-gray-900">{{ customerJourney.contact.name }}</h4>
                <p class="text-sm text-gray-600">{{ customerJourney.contact.email }}</p>
                <p v-if="customerJourney.contact.company" class="text-sm text-gray-500">{{ customerJourney.contact.company }}</p>
                <p class="text-xs text-gray-400">Joined: {{ formatDate(customerJourney.contact.joined_date || customerJourney.contact.created_at) }}</p>
              </div>
            </div>
          </div>

          <!-- Journey Entries -->
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
              <h4 class="text-md font-medium text-gray-900">Journey Timeline</h4>
              <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <select
                  v-model="journeyFilter"
                  class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Actions</option>
                  <option value="contact_creation">Contact Creation</option>
                  <option value="welcome_email">Welcome Email</option>
                  <option value="email_opened">Email Opened</option>
                  <option value="company_creation">Company Creation</option>
                  <option value="deal_proposed">Deal Proposed</option>
                  <option value="engagement_email">Engagement Email</option>
                  <option value="deal_outcome">Deal Outcome</option>
                </select>
                <select
                  v-model="statusFilter"
                  class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            <div v-if="filteredJourneyEntries.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-gray-500">{{ (customerJourney.timeline || customerJourney.journey_entries || []).length === 0 ? 'No journey entries found for this customer' : 'No entries match the current filters' }}</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="(entry, index) in filteredJourneyEntries"
                :key="entry.id"
                class="flex items-start space-x-3 sm:space-x-4"
              >
                <!-- Timeline line -->
                <div class="flex flex-col items-center">
                  <div :class="getJourneyEntryColor(entry.type)" class="w-10 h-10 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getJourneyEntryIcon(entry.type)" />
                    </svg>
                  </div>
                  <div v-if="index < filteredJourneyEntries.length - 1" class="w-0.5 h-8 bg-gray-200 mt-2"></div>
                </div>

                <!-- Entry content -->
                <div class="flex-1 min-w-0">
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-1 sm:space-y-0">
                      <h5 class="text-sm font-medium text-gray-900">{{ entry.title }}</h5>
                      <span :class="getJourneyEntryStatusColor(entry.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit">
                        {{ entry.status === 'success' ? 'Success' : entry.status === 'pending' ? 'Pending' : 'Failed' }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">{{ entry.description }}</p>
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                      <span>{{ formatJourneyTimestamp(entry.date || entry.timestamp) }}</span>
                      <div v-if="entry.metadata" class="flex flex-wrap gap-2">
                        <span v-if="entry.metadata.deal_value" class="text-green-600 font-medium">
                          ${{ formatNumber(entry.metadata.deal_value) }}
                        </span>
                        <span v-if="entry.metadata.sales_rep" class="text-blue-600">
                          {{ entry.metadata.sales_rep }}
                        </span>
                        <span v-if="entry.metadata.device" class="text-gray-500">
                          {{ entry.metadata.device }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



    </div>


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { journeysService, journeysHelpers } from '@/services/journeys'
import { error as showError, success as showSuccess } from '@/utils/notifications'

const { t } = useI18n()

// Reactive state
const executions = ref([])

// Customer journey search state
const customerEmail = ref('')
const customerJourney = ref(null)
const searchingJourney = ref(false)
const journeyError = ref(null)
const journeyFilter = ref('')
const statusFilter = ref('')


// Computed properties
const filteredJourneyEntries = computed(() => {
  if (!customerJourney.value) return []
  
  // Handle both backend response formats: 'timeline' and 'journey_entries'
  let entries = customerJourney.value.timeline || customerJourney.value.journey_entries || []
  
  // Filter by action type
  if (journeyFilter.value) {
    entries = entries.filter(entry => entry.type === journeyFilter.value)
  }
  
  // Filter by status
  if (statusFilter.value) {
    entries = entries.filter(entry => entry.status === statusFilter.value)
  }
  
  return entries
})

// Methods

const loadExecutions = async (journeyId) => {
  try {
    const response = await journeysService.getJourneyExecutions(journeyId)
    executions.value = response.data || []
  } catch (err) {
    console.error('Failed to load executions:', err)
    executions.value = []
  }
}




// Customer journey search methods
const searchCustomerJourney = async () => {
  if (!customerEmail.value) return
  
  searchingJourney.value = true
  journeyError.value = null
  
  try {
    const response = await journeysService.getCustomerJourney(customerEmail.value)
    customerJourney.value = response.data
  } catch (err) {
    journeyError.value = err.message || 'Failed to fetch customer journey'
    showError(journeyError.value)
  } finally {
    searchingJourney.value = false
  }
}

const clearCustomerJourney = () => {
  customerJourney.value = null
  customerEmail.value = ''
  journeyError.value = null
  journeyFilter.value = ''
  statusFilter.value = ''
}

// Helper methods
const formatDate = (dateString) => journeysHelpers.formatDate(dateString)
const formatNumber = (num) => journeysHelpers.formatNumber(num)

// Customer journey helper methods
const getJourneyEntryIcon = (type) => journeysHelpers.getJourneyEntryIcon(type)
const getJourneyEntryColor = (type) => journeysHelpers.getJourneyEntryColor(type)
const getJourneyEntryStatusColor = (status) => journeysHelpers.getJourneyEntryStatusColor(status)
const formatJourneyTimestamp = (timestamp) => journeysHelpers.formatJourneyTimestamp(timestamp)

// Lifecycle
// No initial data loading needed since we only have customer journey search
</script>