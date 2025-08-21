<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <router-link
              to="/companies"
              class="text-[#2596be] hover:text-[#973894] transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </router-link>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Company Details</h1>
              <p class="text-sm text-gray-600">View and manage company information</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="outline"
              size="sm"
              icon="edit"
              @click="editCompany"
            >
              Edit
            </BaseButton>
            <BaseButton
              variant="danger"
              size="sm"
              icon="trash"
              @click="deleteCompany"
            >
              Delete
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2596be]"></div>
      </div>

      <!-- Company details -->
      <div v-else-if="company" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main info -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center space-x-4 mb-6">
              <div class="w-16 h-16 bg-gradient-to-r from-[#655997] to-[#cc3266] rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-2xl">
                  {{ company.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ company.name }}</h2>
                <p class="text-gray-600">{{ company.industry || 'No industry' }}</p>
                <span
                  class="inline-block px-3 py-1 text-sm rounded-full mt-2"
                  :class="getStatusClass(company.status)"
                >
                  {{ company.status }}
                </span>
              </div>
            </div>

            <!-- Company Details -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">Company Name</label>
                  <p class="text-sm text-gray-900">{{ company.name }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Domain</label>
                  <p class="text-sm text-gray-900">{{ company.domain || 'Not specified' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Website</label>
                  <p class="text-sm text-gray-900">
                    <a v-if="company.website" :href="company.website" target="_blank" class="text-[#2596be] hover:underline">
                      {{ company.website }}
                    </a>
                    <span v-else class="text-gray-500">Not specified</span>
                  </p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Industry</label>
                  <p class="text-sm text-gray-900">{{ company.industry || 'Not specified' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Company Type</label>
                  <p class="text-sm text-gray-900">{{ company.type || 'Not specified' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Company Size</label>
                  <p class="text-sm text-gray-900">{{ company.size ? `${company.size} employees` : 'Not specified' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Annual Revenue</label>
                  <p class="text-sm text-gray-900">{{ company.annual_revenue ? `$${company.annual_revenue.toLocaleString()}` : 'Not specified' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Timezone</label>
                  <p class="text-sm text-gray-900">{{ company.timezone || 'Not specified' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">LinkedIn Page</label>
                  <p class="text-sm text-gray-900">
                    <a v-if="company.linkedin_page" :href="company.linkedin_page" target="_blank" class="text-[#2596be] hover:underline">
                      {{ company.linkedin_page }}
                    </a>
                    <span v-else class="text-gray-500">Not specified</span>
                  </p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Phone</label>
                  <p class="text-sm text-gray-900">{{ company.phone || 'Not specified' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Email</label>
                  <p class="text-sm text-gray-900">
                    <a v-if="company.email" :href="`mailto:${company.email}`" class="text-[#2596be] hover:underline">
                      {{ company.email }}
                    </a>
                    <span v-else class="text-gray-500">Not specified</span>
                  </p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Status</label>
                  <span
                    class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(company.status)"
                  >
                    {{ company.status }}
                  </span>
                </div>
                <div class="md:col-span-2">
                  <label class="text-sm font-medium text-gray-500">Address</label>
                  <p class="text-sm text-gray-900">{{ formatAddress(company.address) }}</p>
                </div>
                <div class="md:col-span-2" v-if="company.description">
                  <label class="text-sm font-medium text-gray-500">Description</label>
                  <p class="text-sm text-gray-900">{{ company.description }}</p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div v-if="company.description" class="mt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-gray-700">{{ company.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick actions -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <BaseButton
                variant="primary"
                size="sm"
                full-width
                @click="addContact"
              >
                Add Contact
              </BaseButton>
              <BaseButton
                variant="secondary"
                size="sm"
                full-width
                @click="createDeal"
              >
                Create Deal
              </BaseButton>
              <BaseButton
                variant="outline"
                size="sm"
                full-width
                @click="viewWebsite"
              >
                Visit Website
              </BaseButton>
            </div>
          </div>

          <!-- Company contacts -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Company Contacts</h3>
              <BaseButton
                variant="primary"
                size="sm"
                @click="showAttachContactModal = true"
              >
                Attach Contact
              </BaseButton>
            </div>
            
            <!-- Loading contacts -->
            <div v-if="loadingContacts" class="flex items-center justify-center py-4">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2596be]"></div>
            </div>
            
            <!-- Contacts list -->
            <div v-else-if="companyContacts.length > 0" class="space-y-3">
              <div
                v-for="contact in companyContacts"
                :key="contact.id"
                class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-r from-[#2596be] to-[#973894] rounded-full flex items-center justify-center">
                    <span class="text-white font-medium text-xs">
                      {{ getContactInitials(contact) }}
                    </span>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ getContactFullName(contact) }}</h4>
                    <p class="text-sm text-gray-500">{{ contact.email }}</p>
                  </div>
                </div>
                <button
                  @click="detachContact(contact.id)"
                  class="text-red-500 hover:text-red-700 transition-colors"
                  title="Detach contact"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Empty state -->
            <div v-else class="text-center py-8 text-gray-500">
              <p>No contacts associated</p>
            </div>
          </div>

          <!-- Activity -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div class="text-center py-8 text-gray-500">
              <p>No recent activity</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Not found -->
      <div v-else class="text-center py-12">
        <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Company not found</h3>
        <p class="text-gray-500 mb-6">The company you're looking for doesn't exist or has been deleted.</p>
        <router-link
          to="/companies"
          class="text-[#2596be] hover:text-[#973894] transition-colors"
        >
          Back to companies
        </router-link>
      </div>
    </div>

    <!-- Modals -->
    <AttachContactModal
      v-if="showAttachContactModal"
      :company-id="company.id"
      :company-name="company.name"
      @close="showAttachContactModal = false"
      @attached="handleContactAttached"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { companiesAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import AttachContactModal from '@/components/modals/AttachContactModal.vue'

const route = useRoute()
const router = useRouter()
const { success, error } = useNotifications()

const loading = ref(true)
const loadingContacts = ref(false)
const company = ref(null)
const companyContacts = ref([])
const showAttachContactModal = ref(false)

onMounted(async () => {
  try {
    const response = await companiesAPI.getCompany(route.params.id)
    company.value = response.data
    await loadCompanyContacts()
  } catch (err) {
    error('Failed to load company')
    console.error('Company detail error:', err)
  } finally {
    loading.value = false
  }
})

// Load company contacts
const loadCompanyContacts = async () => {
  if (!company.value) return
  
  loadingContacts.value = true
  try {
    const response = await companiesAPI.getCompanyContacts(company.value.id)
    companyContacts.value = response.data
  } catch (err) {
    console.error('Error loading company contacts:', err)
  } finally {
    loadingContacts.value = false
  }
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    prospect: 'bg-blue-100 text-blue-800',
    customer: 'bg-purple-100 text-purple-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const editCompany = () => {
  router.push(`/companies/${company.value.id}?action=edit`)
}

const deleteCompany = async () => {
  if (!confirm('Are you sure you want to delete this company?')) return

  try {
    await companiesAPI.deleteCompany(company.value.id)
    success('Company deleted successfully')
    router.push('/companies')
  } catch (err) {
    error('Failed to delete company')
  }
}

const addContact = () => {
  // Implement contact creation for this company
  console.log('Add contact for company:', company.value.id)
}

const createDeal = () => {
  // Implement deal creation for this company
  console.log('Create deal for company:', company.value.id)
}

const viewWebsite = () => {
  if (company.value.website) {
    window.open(company.value.website, '_blank')
  }
}

// Contact utility functions
const getContactInitials = (contact) => {
  const firstName = contact.first_name || ''
  const lastName = contact.last_name || ''
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
}

const getContactFullName = (contact) => {
  const firstName = contact.first_name || ''
  const lastName = contact.last_name || ''
  return `${firstName} ${lastName}`.trim() || 'Unnamed Contact'
}

// Detach contact from company
const detachContact = async (contactId) => {
  if (!confirm('Are you sure you want to detach this contact from the company?')) return

  try {
    await companiesAPI.detachContact(company.value.id, contactId)
    success('Contact detached successfully')
    await loadCompanyContacts()
  } catch (err) {
    error('Failed to detach contact')
  }
}

// Handle contact attached
const handleContactAttached = () => {
  loadCompanyContacts()
}

// Format address for display
const formatAddress = (address) => {
  if (!address) return 'Not specified'
  const parts = [
    address.street,
    address.city,
    address.state,
    address.postal_code,
    address.country
  ].filter(Boolean)
  return parts.join(', ')
}
</script>
