<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <router-link
              to="/contacts"
              class="text-[#2596be] hover:text-[#973894] transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </router-link>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ $t('contacts.contact_details.title') }}</h1>
              <p class="text-sm text-gray-600">{{ $t('contacts.contact_details.subtitle') }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              v-if="canEdit(contact)"
              variant="outline"
              size="sm"
              @click="editContact"
            >
              {{ $t('contacts.contact_details.edit_contact') }}
            </BaseButton>
            <BaseButton
              v-if="canDelete(contact)"
              variant="danger"
              size="sm"
              icon="trash"
              @click="deleteContact"
            >
              {{ $t('contacts.contact_details.delete') }}
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

      <!-- Contact details -->
      <div v-else-if="contact" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Contact Header Card -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center space-x-4 mb-6">
              <div class="w-16 h-16 bg-gradient-to-r from-[#2596be] to-[#973894] rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-2xl">
                  {{ getInitials(contact) }}
                </span>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ getFullName(contact) }}</h2>
                <p class="text-gray-600">{{ contact.email }}</p>
                <div class="flex items-center space-x-2 mt-2">
                  <span
                    class="inline-block px-3 py-1 text-sm rounded-full"
                    :class="getStatusClass(contact.lifecycle_stage)"
                  >
                    {{ contact.lifecycle_stage || $t('contacts.contact_details.no_stage') }}
                  </span>
                  <span v-if="contact.team" class="team-badge">
                    {{ contact.team.name }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Contact information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('contacts.contact_details.contact_information') }}</h3>
                <div class="space-y-3">
                  <div v-if="contact.phone" class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span class="text-gray-700">{{ contact.phone }}</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    </svg>
                    <span class="text-gray-700">{{ contact.email }}</span>
                  </div>
                </div>
              </div>

              <div v-if="contact.source || contact.owner_id">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('contacts.contact_details.additional_information') }}</h3>
                <div class="space-y-3">
                  <div v-if="contact.source" class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h12v8H6V6z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-700">{{ $t('contacts.contact_details.source') }}: {{ contact.source }}</span>
                  </div>
                  <div v-if="contact.owner_id" class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-700">
                      <strong>Owner:</strong> {{ contact.owner?.name || `User ID: ${contact.owner_id}` }}
                    </span>
                  </div>
                  <div v-if="contact.team" class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-700"><strong>Team:</strong> {{ contact.team.name || '—' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Associated Company Card -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('contacts.contact_details.associated_company') }}</h3>
              <BaseButton
                v-if="!contactCompany"
                variant="outline"
                size="sm"
                @click="createCompany"
              >
                {{ $t('contacts.contact_details.create_company') }}
              </BaseButton>
            </div>
            
            <div v-if="contactCompany" class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer" @click="viewCompany">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900">{{ contactCompany.name }}</h4>
                  <div class="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span v-if="contactCompany.industry">{{ contactCompany.industry }}</span>
                    <span v-if="contactCompany.email">{{ contactCompany.email }}</span>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p class="text-sm">{{ $t('contacts.contact_details.no_company_linked') }}</p>
            </div>
          </div>

          <!-- Deals Section -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('contacts.contact_details.deals') }}</h3>
              <div class="flex items-center space-x-2">
                <BaseButton
                  variant="outline"
                  size="sm"
                  @click="createDeal"
                >
                  {{ $t('contacts.contact_details.create_deal') }}
                </BaseButton>
                <BaseButton
                  v-if="deals.length > 0"
                  variant="outline"
                  size="sm"
                  @click="viewAllDeals"
                >
                  {{ $t('contacts.contact_details.view_all') }}
                </BaseButton>
              </div>
            </div>
            
            <div v-if="dealsLoading" class="flex justify-center py-4">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2596be]"></div>
            </div>
            
            <div v-else-if="deals.length > 0" class="space-y-3">
              <div
                v-for="deal in deals.slice(0, 5)"
                :key="deal.id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                @click="viewDeal(deal)"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-gray-900">{{ deal.title }}</h4>
                        <div class="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span v-if="deal.value" class="font-medium">${{ formatCurrency(deal.value) }}</span>
                          <span>{{ deal.stage?.name || $t('contacts.contact_details.no_stage') }}</span>
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
              <p class="text-sm">{{ $t('contacts.contact_details.no_deals_yet') }}</p>
            </div>
          </div>

          <!-- Recent Activities Section -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('contacts.contact_details.recent_activities') }}</h3>
              <div class="flex items-center space-x-2">
                <BaseButton
                  variant="outline"
                  size="sm"
                  @click="logActivity"
                >
                  {{ $t('contacts.contact_details.log_activity') }}
                </BaseButton>
                <BaseButton
                  v-if="activities.length > 0"
                  variant="outline"
                  size="sm"
                  @click="viewAllActivities"
                >
                  {{ $t('contacts.contact_details.view_all') }}
                </BaseButton>
              </div>
            </div>
            
            <div v-if="activitiesLoading" class="flex justify-center py-4">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2596be]"></div>
            </div>
            
            <div v-else-if="activities.length > 0" class="space-y-4">
              <div
                v-for="activity in activities.slice(0, 5)"
                :key="activity.id"
                class="flex items-start space-x-3"
              >
                <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" :class="getActivityTypeClass(activity.type)">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="activity.type === 'call'" d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    <path v-else-if="activity.type === 'email'" d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path v-else-if="activity.type === 'meeting'" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    <path v-else d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                                 <div class="flex-1 min-w-0">
                   <p class="text-sm font-medium text-gray-900">{{ capitalize(activity.type) }}</p>
                   <p class="text-sm text-gray-600">{{ activity.summary }}</p>
                   <p class="text-xs text-gray-500 mt-1">{{ formatDate(activity.created_at) }}</p>
                 </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm">{{ $t('contacts.contact_details.no_recent_activities') }}</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick actions -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('contacts.contact_details.quick_actions') }}</h3>
            <div class="space-y-3">
              <BaseButton
                variant="primary"
                size="sm"
                full-width
                @click="createCompany"
              >
                {{ $t('contacts.contact_details.create_company') }}
              </BaseButton>
              <BaseButton
                variant="secondary"
                size="sm"
                full-width
                @click="createDeal"
              >
                {{ $t('contacts.contact_details.create_deal') }}
              </BaseButton>
              <BaseButton
                variant="outline"
                size="sm"
                full-width
                @click="logActivity"
              >
                {{ $t('contacts.contact_details.log_activity') }}
              </BaseButton>
              <BaseButton
                variant="outline"
                size="sm"
                full-width
                @click="sendEmail"
              >
                {{ $t('contacts.contact_details.send_email') }}
              </BaseButton>
            </div>
          </div>

          <!-- Contact Stats -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('contacts.contact_details.contact_stats') }}</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ $t('contacts.contact_details.total_deals') }}</span>
                <span class="text-sm font-medium text-gray-900">{{ deals.length }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ $t('contacts.contact_details.total_activities') }}</span>
                <span class="text-sm font-medium text-gray-900">{{ activities.length }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ $t('contacts.contact_details.deal_value') }}</span>
                <span class="text-sm font-medium text-gray-900">${{ formatCurrency(totalDealValue) }}</span>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <DocumentsTab 
              relatedType="contact" 
              :relatedId="contact.id"
              :initialDocuments="contactDocuments"
              @document-linked="handleDocumentLinked"
            />
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
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('contacts.contact_details.contact_not_found') }}</h3>
        <p class="text-gray-500 mb-6">{{ $t('contacts.contact_details.contact_not_found_message') }}</p>
        <router-link
          to="/contacts"
          class="text-[#2596be] hover:text-[#973894] transition-colors"
        >
          {{ $t('contacts.contact_details.back_to_contacts') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { useContext } from '@/composables/useContext'
import { usePermission } from '@/composables/usePermission'
import api, { contactsAPI, usersAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import DocumentsTab from '@/components/documents/DocumentsTab.vue'

const route = useRoute()
const router = useRouter()
const { success, error } = useNotifications()
const { tenantId, teamId, isAdmin } = useContext()
const { canEdit, canDelete, canView } = usePermission()

const loading = ref(true)
const contact = ref(null)
const contactCompany = ref(null)
const deals = ref([])
const activities = ref([])
const contactDocuments = ref([])
const dealsLoading = ref(false)
const activitiesLoading = ref(false)

// Computed properties
const totalDealValue = computed(() => {
  return deals.value.reduce((total, deal) => total + (deal.value || 0), 0)
})

onMounted(async () => {
  // Clear suppression so other pages can fetch recent contacts normally
  if (typeof window !== 'undefined') {
    delete window.__RC_SUPPRESS_RECENT_CONTACTS__
  }
  await loadContactData()
})

onUnmounted(() => {
  // Ensure flag is cleared when leaving detail as well
  if (typeof window !== 'undefined') {
    delete window.__RC_SUPPRESS_RECENT_CONTACTS__
  }
})

const loadContactData = async () => {
  try {
    loading.value = true
    
    // Load contact details
    const contactResponse = await contactsAPI.getContact(route.params.id)
    contact.value = contactResponse.data.data.contact
    
    // Extract documents from the API response
    contactDocuments.value = contactResponse.data.data.documents || []
    console.log(`ContactDetail: Loaded ${contactDocuments.value.length} documents for contact ${contact.value.id}`)
    console.log('ContactDetail: Documents data:', contactDocuments.value)
    
    // Load related data
    await Promise.all([
      loadContactCompany(),
      loadContactDeals(),
      loadContactActivities(),
      loadOwnerInfo(),
      loadTeamInfo()
    ])
  } catch (err) {
    error('Failed to load contact')
    console.error('Contact detail error:', err)
  } finally {
    loading.value = false
  }
}

const handleDocumentLinked = (document) => {
  console.log('ContactDetail: Document linked, adding to contactDocuments:', document)
  // Add the linked document to the contactDocuments array
  const existingIndex = contactDocuments.value.findIndex(doc => doc.id === document.id)
  if (existingIndex === -1) {
    contactDocuments.value.push(document)
    console.log('ContactDetail: Added document to contactDocuments array')
  } else {
    contactDocuments.value[existingIndex] = document
    console.log('ContactDetail: Updated existing document in contactDocuments array')
  }
}


const loadContactCompany = async () => {
  try {
    const response = await contactsAPI.getContactCompany(route.params.id)
    contactCompany.value = response.data.data
  } catch (err) {
    console.error('Failed to load contact company:', err)
    contactCompany.value = null
  }
}

const loadContactDeals = async () => {
  try {
    dealsLoading.value = true
    const response = await contactsAPI.getContactDeals(route.params.id, { limit: 10 })
    deals.value = response.data.data || []
  } catch (err) {
    console.error('Failed to load contact deals:', err)
    deals.value = []
  } finally {
    dealsLoading.value = false
  }
}

const loadContactActivities = async () => {
  try {
    activitiesLoading.value = true
    const response = await contactsAPI.getContactActivities(route.params.id, { limit: 10 })
    activities.value = response.data.data || []
  } catch (err) {
    console.error('Failed to load contact activities:', err)
    activities.value = []
  } finally {
    activitiesLoading.value = false
  }
}

const loadOwnerInfo = async () => {
  try {
    if (contact.value?.owner_id) {
      const response = await usersAPI.getUser(contact.value.owner_id)
      if (response.data.data) {
        contact.value.owner = response.data.data
      }
    }
  } catch (err) {
    console.error('Failed to load owner info:', err)
  }
}

const loadTeamInfo = async () => {
  try {
    if (contact.value?.team_id) {
      // Since there's no teamsAPI yet, we'll use a direct API call
      const response = await api.get(`/teams/${contact.value.team_id}`)
      if (response.data.data) {
        contact.value.team = response.data.data
      }
    }
  } catch (err) {
    console.error('Failed to load team info:', err)
  }
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    lead: 'bg-blue-100 text-blue-800',
    customer: 'bg-green-100 text-green-800',
    prospect: 'bg-yellow-100 text-yellow-800'
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

const getActivityTypeClass = (type) => {
  const classes = {
    call: 'bg-blue-500',
    email: 'bg-green-500',
    meeting: 'bg-purple-500',
    task: 'bg-orange-500'
  }
  return classes[type] || 'bg-gray-500'
}

const getInitials = (contact) => {
  if (!contact || !contact.first_name || !contact.last_name) {
    return 'N/A'
  }
  return `${contact.first_name.charAt(0).toUpperCase()}${contact.last_name.charAt(0).toUpperCase()}`
}

const getFullName = (contact) => {
  if (!contact || !contact.first_name || !contact.last_name) {
    return 'N/A'
  }
  return `${contact.first_name} ${contact.last_name}`
}

const formatCurrency = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('en-US').format(value)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const deleteContact = async () => {
  if (!confirm('Are you sure you want to delete this contact?')) return

  try {
    await contactsAPI.deleteContact(contact.value.id)
    success('Contact deleted successfully')
    router.push('/contacts')
  } catch (err) {
    error('Failed to delete contact')
  }
}

const editContact = () => {
  router.push(`/contacts/${contact.value.id}/edit`)
}

const createCompany = () => {
  // Navigate to company creation with contact pre-filled
  router.push(`/companies/create?contact_id=${contact.value.id}`)
}

const createDeal = () => {
  // Navigate to deal creation with contact pre-filled
  router.push(`/deals/new?contact_id=${contact.value.id}`)
}

const logActivity = () => {
  // Navigate to activity creation with contact pre-filled
  router.push(`/activities/create?contact_id=${contact.value.id}`)
}

const sendEmail = () => {
  // Implement email sending
  console.log('Send email to:', contact.value.email)
}

const viewCompany = () => {
  if (contactCompany.value) {
    router.push(`/companies/${contactCompany.value.id}`)
  }
}

const viewDeal = (deal) => {
  router.push(`/deals/${deal.id}`)
}

const viewAllDeals = () => {
  router.push(`/deals?contact_id=${contact.value.id}`)
}

const viewAllActivities = () => {
  router.push(`/activities?contact_id=${contact.value.id}`)
}
</script>

<style scoped>
/* Add any custom styles here */
</style>

