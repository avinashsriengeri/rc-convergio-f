<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Email Integration</h1>
              <p class="text-gray-600 mt-1">Connect your email accounts to automatically create tickets from customer emails</p>
            </div>
          </div>
          <button
            @click="emailStore.toggleCreateModal(true)"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Email Integration
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Integrations -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Integrations</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ emailStore.totalIntegrations }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Active Integrations -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Integrations</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ emailStore.activeIntegrations.length }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Connected Accounts -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Connected Accounts</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ emailStore.connectedIntegrations.length }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Tickets from Email -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Tickets from Email</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ emailStore.totalTicketsFromEmail }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Email Integrations List -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Email Integrations</h2>
                <p class="text-sm text-gray-500">Manage your email-to-ticket integrations</p>
              </div>
            </div>
            <button
              @click="refreshData"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-1" :class="{ 'animate-spin': emailStore.loading.integrations }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="emailStore.loading.integrations" class="p-8 text-center">
          <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-500">Loading email integrations...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="emailStore.errors.integrations" class="p-8 text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Failed to Load Integrations</h3>
          <p class="text-gray-500 mb-4">{{ emailStore.errors.integrations }}</p>
          <button
            @click="refreshData"
            class="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="emailStore.integrations.length === 0" class="p-8 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Email Integrations</h3>
          <p class="text-gray-500 mb-6">Get started by connecting your first email account to automatically create tickets from customer emails.</p>
          <button
            @click="emailStore.toggleCreateModal(true)"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Your First Integration
          </button>
        </div>

        <!-- Integrations List -->
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="integration in emailStore.integrations"
            :key="integration.id"
            class="p-6 hover:bg-gray-50 transition-colors duration-200"
          >
            <EmailIntegrationCard
              :integration="integration"
              @edit="editIntegration"
              @test="testIntegration"
              @connect="connectIntegration"
              @disconnect="disconnectIntegration"
              @delete="deleteIntegration"
              @sync="syncEmails"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Create Integration Modal -->
    <EmailIntegrationForm
      v-if="emailStore.showCreateModal"
      @close="emailStore.toggleCreateModal(false)"
      @created="onIntegrationCreated"
    />

    <!-- Test Integration Modal -->
    <EmailIntegrationTest
      v-if="emailStore.showTestModal && emailStore.selectedIntegration"
      :integration="emailStore.selectedIntegration"
      @close="emailStore.toggleTestModal(false)"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useEmailIntegrationStore } from '../store/emailIntegration'
import EmailIntegrationCard from '../components/EmailIntegrationCard.vue'
import EmailIntegrationForm from '../components/EmailIntegrationForm.vue'
import EmailIntegrationTest from '../components/EmailIntegrationTest.vue'

// Store
const emailStore = useEmailIntegrationStore()

// Methods
const refreshData = async () => {
  await emailStore.refreshData()
}

const editIntegration = (integration) => {
  emailStore.setSelectedIntegration(integration)
  // You can implement edit functionality here
  console.log('Edit integration:', integration)
}

const testIntegration = async (integration) => {
  emailStore.setSelectedIntegration(integration)
  emailStore.toggleTestModal(true)
}

const connectIntegration = async (integration) => {
  const result = await emailStore.connectGmail(integration.id)
  if (result.success && result.redirect) {
    // OAuth redirect will happen automatically
  } else if (result.success) {
    // Show success message
    console.log('Gmail connected successfully')
  } else {
    // Show error message
    console.error('Failed to connect Gmail:', result.error)
  }
}

const disconnectIntegration = async (integration) => {
  if (confirm('Are you sure you want to disconnect this integration?')) {
    const result = await emailStore.disconnectIntegration(integration.id)
    if (result.success) {
      console.log('Integration disconnected successfully')
    } else {
      console.error('Failed to disconnect integration:', result.error)
    }
  }
}

const deleteIntegration = async (integration) => {
  if (confirm('Are you sure you want to delete this integration? This action cannot be undone.')) {
    const result = await emailStore.deleteIntegration(integration.id)
    if (result.success) {
      console.log('Integration deleted successfully')
    } else {
      console.error('Failed to delete integration:', result.error)
    }
  }
}

const syncEmails = async (integration) => {
  const result = await emailStore.syncEmails(integration.id)
  if (result.success) {
    console.log('Emails synced successfully:', result.data)
  } else {
    console.error('Failed to sync emails:', result.error)
  }
}

const onIntegrationCreated = (integration) => {
  emailStore.toggleCreateModal(false)
  console.log('New integration created:', integration)
}

// Lifecycle
onMounted(async () => {
  await refreshData()
})
</script>
