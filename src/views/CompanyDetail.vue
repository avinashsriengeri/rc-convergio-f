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
              <h1 class="text-2xl font-bold text-gray-900">{{ $t('companies.company_details.title') }}</h1>
              <p class="text-sm text-gray-600">{{ $t('companies.company_details.subtitle') }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              v-if="canEdit(company)"
              variant="primary"
              size="sm"
              icon="edit"
              @click="editCompany"
            >
              {{ $t('companies.company_details.edit') }}
            </BaseButton>
            <BaseButton
              v-if="canDelete(company)"
              variant="danger"
              size="sm"
              icon="trash"
              @click="deleteCompany"
            >
              {{ $t('companies.company_details.delete') }}
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
              <div class="w-16 h-16 bg-gradient-to-r from-[#2596be] to-[#973894] rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-2xl">
                  {{ company.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ company.name }}</h2>
                <p class="text-gray-600">{{ company.industry || $t('companies.no_industry') }}</p>
                <div class="flex items-center space-x-2 mt-2">
                  <span
                    class="inline-block px-3 py-1 text-sm rounded-full"
                    :class="getStatusClass(company.status)"
                  >
                    {{ company.status }}
                  </span>
                  <span v-if="company.team" class="team-badge">
                    {{ company.team.name }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Company Details -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('companies.company_details.company_details') }}</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class='text-sm font-medium text-gray-500'>{{ $t('companies.company_details.company_name') }}</label>
                  <p class="text-sm text-gray-900">{{ company.name }}</p>
                </div>
                <div>
                  <label class='text-sm font-medium text-gray-500'>{{ $t('companies.company_details.domain') }}</label>
                  <p class="text-sm text-gray-900">{{ company.domain || $t('companies.company_details.not_specified') }}</p>
                </div>
                <div>
                  <label class='text-sm font-medium text-gray-500'>{{ $t('companies.company_details.website') }}</label>
                  <p class="text-sm text-gray-900">
                    <a v-if="company.website" :href="company.website" target="_blank" class="text-[#2596be] hover:underline">
                      {{ company.website }}
                    </a>
                    <span v-else class="text-gray-500">{{ $t('companies.company_details.not_specified') }}</span>
                  </p>
                </div>
                <div>
                  <label class='text-sm font-medium text-gray-500'>{{ $t('companies.company_details.industry') }}</label>
                  <p class="text-sm text-gray-900">{{ company.industry || $t('companies.company_details.not_specified') }}</p>
                </div>
                <div>
                  <label class='text-sm font-medium text-gray-500'>{{ $t('companies.company_details.company_type') }}</label>
                  <p class="text-sm text-gray-900">{{ company.type || $t('companies.company_details.not_specified') }}</p>
                </div>
                <div>
                  <label class='text-sm font-medium text-gray-500'>{{ $t('companies.company_details.company_size') }}</label>
                  <p class="text-sm text-gray-900">{{ company.size ? `${company.size} ${$t('companies.company_details.employees')}` : $t('companies.company_details.not_specified') }}</p>
                </div>
                <div>
                  <label class='text-sm font-medium text-gray-500'>{{ $t('companies.company_details.annual_revenue') }}</label>
                  <p class="text-sm text-gray-900">{{ company.annual_revenue ? `$${company.annual_revenue.toLocaleString()}` : $t('companies.company_details.not_specified') }}</p>
                </div>
                <div>
                  <label class='text-sm font-medium text-gray-500'>{{ $t('companies.company_details.timezone') }}</label>
                  <p class="text-sm text-gray-900">{{ company.timezone || $t('companies.company_details.not_specified') }}</p>
                </div>
                <div>
                  <label class='text-sm font-medium text-gray-500'>{{ $t('companies.company_details.linkedin_page') }}</label>
                  <p class="text-sm text-gray-900">
                    <a v-if="company.linkedin_page" :href="company.linkedin_page" target="_blank" class="text-[#2596be] hover:underline truncate block">
                      {{ company.linkedin_page.length > 40 ? company.linkedin_page.substring(0, 40) + '...' : company.linkedin_page }}
                    </a>
                    <span v-else class="text-gray-500">{{ $t('companies.company_details.not_specified') }}</span>
                  </p>
                </div>
                <div>
                  <label class='text-sm font-medium text-gray-500'>{{ $t('companies.company_details.phone') }}</label>
                  <p class="text-sm text-gray-900">{{ company.phone || $t('companies.company_details.not_specified') }}</p>
                </div>
                <div>
                  <label class='text-sm font-medium text-gray-500'>{{ $t('companies.company_details.email') }}</label>
                  <p class="text-sm text-gray-900">
                    <a v-if="company.email" :href="`mailto:${company.email}`" class="text-[#2596be] hover:underline">
                      {{ company.email }}
                    </a>
                    <span v-else class="text-gray-500">{{ $t('companies.company_details.not_specified') }}</span>
                  </p>
                </div>
                <div>
                  <label class='text-sm font-medium text-gray-500'>{{ $t('companies.company_details.status') }}</label>
                  <span
                    class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(company.status)"
                  >
                    {{ company.status }}
                  </span>
                </div>
                <div v-if="company.owner">
                  <label class='text-sm font-medium text-gray-500'>Owner</label>
                  <p class="text-sm text-gray-900">{{ company.owner.name || '—' }}</p>
                </div>
                <div v-if="company.team">
                  <label class='text-sm font-medium text-gray-500'>Team</label>
                  <p class="text-sm text-gray-900">{{ company.team.name || '—' }}</p>
                </div>
                <div class="md:col-span-2">
                  <label class='text-sm font-medium text-gray-500'>{{ $t('companies.company_details.address') }}</label>
                  <p class="text-sm text-gray-900">{{ formatAddress(company.address) || $t('companies.company_details.not_specified') }}</p>
                </div>
                <div class="md:col-span-2" v-if="company.description">
                  <label class='text-sm font-medium text-gray-500'>{{ $t('companies.company_details.description') }}</label>
                  <p class="text-sm text-gray-900">{{ company.description }}</p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div v-if="company.description" class="mt-6">
              <h3 class='text-lg font-semibold text-gray-900 mb-4'>{{ $t('companies.company_details.description') }}</h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-gray-700">{{ company.description }}</p>
              </div>
            </div>

            <!-- Deals Section -->
            <div class="mt-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class='text-lg font-semibold text-gray-900'>{{ $t('companies.company_details.deals') }}</h3>
                <div class="flex items-center space-x-2">
                  <BaseButton
                    variant="outline"
                    size="sm"
                    @click="createDeal"
                  >
                    {{ $t('companies.company_details.create_deal') }}
                  </BaseButton>
                  <BaseButton
                    v-if="companyDeals.length > 0"
                    variant="outline"
                    size="sm"
                    @click="viewAllDeals"
                  >
                    {{ $t('companies.company_details.view_all') }}
                  </BaseButton>
                </div>
              </div>
              
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div v-if="dealsLoading" class="flex justify-center py-4">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2596be]"></div>
                </div>
                
                <div v-else-if="companyDeals.length > 0" class="space-y-3">
                  <div
                    v-for="deal in companyDeals.slice(0, 5)"
                    :key="deal.id"
                    class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    @click="viewDeal(deal)"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-medium text-gray-900">{{ deal.title }}</h4>
                        <div class="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span v-if="deal.value" class="font-medium">${{ formatCurrency(deal.value) }}</span>
                          <span>{{ deal.stage?.name || $t('companies.company_details.no_stage') }}</span>
                        </div>
                      </div>
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getDealStatusClass(deal.status)"
                      >
                        {{ deal.status }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-center py-8 text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <p class="text-sm">{{ $t('companies.company_details.no_deals_yet') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div class="bg-white shadow-sm rounded-lg p-6">
            <DocumentsTab 
              v-if="company && company.id"
              relatedType="company" 
              :relatedId="company.id"
              :initialDocuments="companyDocuments"
              @document-linked="handleDocumentLinked"
              @document-updated="handleDocumentUpdated"
            />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick actions -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class='text-lg font-semibold text-gray-900 mb-4'>{{ $t('companies.company_details.quick_actions') }}</h3>
            <div class="space-y-3">
              <BaseButton
                variant="primary"
                size="sm"
                full-width
                @click="addContact"
              >
                {{ $t('companies.company_details.add_contact') }}
              </BaseButton>
              <BaseButton
                variant="secondary"
                size="sm"
                full-width
                @click="createDeal"
              >
                {{ $t('companies.company_details.create_deal') }}
              </BaseButton>
              <BaseButton
                variant="outline"
                size="sm"
                full-width
                @click="viewWebsite"
              >
                {{ $t('companies.company_details.visit_website') }}
              </BaseButton>
            </div>
          </div>

          <!-- Company contacts -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class='text-lg font-semibold text-gray-900'>{{ $t('companies.company_details.company_contacts') }}</h3>
              <BaseButton
                variant="primary"
                size="sm"
                @click="showAttachContactModal = true"
              >
                {{ $t('companies.company_details.attach_contact') }}
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
                  :title="$t('companies.company_details.detach_contact')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Empty state -->
            <div v-else class="text-center py-8 text-gray-500">
              <p>{{ $t('companies.company_details.no_contacts_associated') }}</p>
            </div>
          </div>

          <!-- Activity -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class='text-lg font-semibold text-gray-900 mb-4'>{{ $t('companies.company_details.recent_activity') }}</h3>
            <div class="text-center py-8 text-gray-500">
              <p>{{ $t('companies.company_details.no_recent_activity') }}</p>
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
        <h3 class='text-lg font-medium text-gray-900 mb-2'>{{ $t('companies.company_details.company_not_found') }}</h3>
        <p class="text-gray-500 mb-6">{{ $t('companies.company_details.company_not_found_message') }}</p>
        <router-link
          to="/companies"
          class="text-[#2596be] hover:text-[#973894] transition-colors"
        >
          {{ $t('companies.company_details.back_to_companies') }}
        </router-link>
      </div>
    </div>

    <!-- Modals -->
    <AttachContactModal
      v-if="showAttachContactModal && company && company.id"
      :company-id="company.id"
      :company-name="company.name"
      @close="showAttachContactModal = false"
      @attached="handleContactAttached"
    />
    
    <CompanyModal
      v-if="showEditModal && company"
      :company="company"
      mode="edit"
      @close="showEditModal = false"
      @saved="handleCompanySaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { useContext } from '@/composables/useContext'
import { usePermission } from '@/composables/usePermission'
import { companiesAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import AttachContactModal from '@/components/modals/AttachContactModal.vue'
import CompanyModal from '@/components/modals/CompanyModal.vue'
import DocumentsTab from '@/components/documents/DocumentsTab.vue'

const route = useRoute()
const router = useRouter()
const { success, error } = useNotifications()
const { tenantId, teamId, isAdmin } = useContext()
const { canEdit, canDelete, canView } = usePermission()

const loading = ref(true)
const loadingContacts = ref(false)
const dealsLoading = ref(false)
const company = ref(null)
const companyContacts = ref([])
const companyDeals = ref([])
const companyDocuments = ref([])
const showAttachContactModal = ref(false)
const showEditModal = ref(false)

onMounted(async () => {
  try {
    const response = await companiesAPI.getCompany(route.params.id)
    console.log('Company API response:', response)
    
    // Safely extract company data with proper null checks
    const companyData = response.data?.data?.company || response.data?.data || response.data
    if (!companyData) {
      throw new Error('Company data not found in API response')
    }
    
    company.value = companyData
    
    // Extract documents from the API response with safe access
    // Documents are at the top level of the response (response.data.documents)
    companyDocuments.value = response.data?.documents || []
    
    // Only log company.id if company.value exists
    if (company.value && company.value.id) {
      console.log(`CompanyDetail: Loaded ${companyDocuments.value.length} documents for company ${company.value.id}`)
    }
    console.log('CompanyDetail: Documents data:', companyDocuments.value)
    
    console.log('Company data:', company.value)
    if (company.value) {
      console.log('Phone:', company.value.phone)
      console.log('Email:', company.value.email)
      console.log('Status:', company.value.status)
    }
    
    // Only load related data if company exists
    if (company.value && company.value.id) {
      await Promise.all([
        loadCompanyContacts(),
        loadCompanyDeals()
      ])
    }
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
    console.log('Contacts API response:', response)
    companyContacts.value = response.data.data || response.data
  } catch (err) {
    console.error('Error loading company contacts:', err)
  } finally {
    loadingContacts.value = false
  }
}

const handleDocumentLinked = (document) => {
  console.log('CompanyDetail: Document linked, adding to companyDocuments:', document)
  // Add the linked document to the companyDocuments array
  const existingIndex = companyDocuments.value.findIndex(doc => doc.id === document.id)
  if (existingIndex === -1) {
    companyDocuments.value.push(document)
    console.log('CompanyDetail: Added document to companyDocuments array')
  } else {
    companyDocuments.value[existingIndex] = document
    console.log('CompanyDetail: Updated existing document in companyDocuments array')
  }
}

const handleDocumentUpdated = (updatedDocument) => {
  console.log('CompanyDetail: Document updated, refreshing companyDocuments:', updatedDocument)
  // Update the document in the companyDocuments array
  const index = companyDocuments.value.findIndex(doc => doc.id === updatedDocument.id)
  if (index !== -1) {
    companyDocuments.value[index] = updatedDocument
    console.log('CompanyDetail: Updated document in companyDocuments array')
  }
}

// Load company deals
const loadCompanyDeals = async () => {
  if (!company.value) return
  
  dealsLoading.value = true
  try {
    const response = await companiesAPI.getCompanyDeals(company.value.id, { limit: 10 })
    console.log('Deals API response:', response)
    companyDeals.value = response.data.data || []
  } catch (err) {
    console.error('Error loading company deals:', err)
    companyDeals.value = []
  } finally {
    dealsLoading.value = false
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

const getDealStatusClass = (status) => {
  const classes = {
    open: 'bg-blue-100 text-blue-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatCurrency = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('en-US').format(value)
}



const editCompany = () => {
  showEditModal.value = true
}

const deleteCompany = async () => {
  if (!confirm('Are you sure you want to delete this company?')) return

  if (!company.value || !company.value.id) {
    error('Company information not available')
    return
  }

  try {
    await companiesAPI.deleteCompany(company.value.id)
    success('Company deleted successfully')
    router.push('/companies')
  } catch (err) {
    error('Failed to delete company')
  }
}

const addContact = () => {
  // Open the attach contact modal to add a contact to this company
  showAttachContactModal.value = true
}

const createDeal = () => {
  // Navigate to create deal page with company pre-filled
  if (company.value && company.value.id) {
    router.push({
      path: '/deals/new',
      query: {
        company_id: company.value.id,
        company_name: company.value.name
      }
    })
  }
}

const viewWebsite = () => {
  if (company.value.website) {
    window.open(company.value.website, '_blank')
  }
}

const viewDeal = (deal) => {
  router.push(`/deals/${deal.id}`)
}

const viewAllDeals = () => {
  if (company.value && company.value.id) {
    router.push(`/deals?company_id=${company.value.id}`)
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

  if (!company.value || !company.value.id) {
    error('Company information not available')
    return
  }

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

// Handle company saved (create or edit)
const handleCompanySaved = async () => {
  showEditModal.value = false
  // Reload company data to reflect changes
  try {
    const response = await companiesAPI.getCompany(route.params.id)
    company.value = response.data.data
    // Reload related data
    await Promise.all([
      loadCompanyContacts(),
      loadCompanyDeals()
    ])
  } catch (err) {
    console.error('Error reloading company:', err)
  }
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
