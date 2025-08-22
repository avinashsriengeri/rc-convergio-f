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
              <h1 class="text-2xl font-bold text-gray-900">Contact Details</h1>
              <p class="text-sm text-gray-600">View and manage contact information</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="outline"
              size="sm"
              icon="edit"
              @click="editContact"
            >
              Edit
            </BaseButton>
            <BaseButton
              variant="danger"
              size="sm"
              icon="trash"
              @click="deleteContact"
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

      <!-- Contact details -->
      <div v-else-if="contact" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main info -->
        <div class="lg:col-span-2">
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
                <span
                  class="inline-block px-3 py-1 text-sm rounded-full mt-2"
                  :class="getStatusClass(contact.lifecycle_stage)"
                >
                  {{ contact.lifecycle_stage || 'No Stage' }}
                </span>
              </div>
            </div>

            <!-- Contact information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
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

              <div v-if="contact.company_id || contact.source">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div class="space-y-3">
                  <div v-if="contact.source" class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h12v8H6V6z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-700">Source: {{ contact.source }}</span>
                  </div>
                  <div v-if="contact.owner_id" class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-700">Owner ID: {{ contact.owner_id }}</span>
                  </div>
                </div>
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
                @click="createTask"
              >
                Create Task
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
                @click="sendEmail"
              >
                Send Email
              </BaseButton>
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
        <h3 class="text-lg font-medium text-gray-900 mb-2">Contact not found</h3>
        <p class="text-gray-500 mb-6">The contact you're looking for doesn't exist or has been deleted.</p>
        <router-link
          to="/contacts"
          class="text-[#2596be] hover:text-[#973894] transition-colors"
        >
          Back to contacts
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { contactsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const { success, error } = useNotifications()

const loading = ref(true)
const contact = ref(null)

onMounted(async () => {
  try {
    const response = await contactsAPI.getContact(route.params.id)
    console.log('Contact detail response:', response.data)
    // The API returns { data: { contact: {...} } }
    contact.value = response.data.data.contact
    console.log('Contact data:', contact.value)
  } catch (err) {
    error('Failed to load contact')
    console.error('Contact detail error:', err)
  } finally {
    loading.value = false
  }
})

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

const editContact = () => {
  router.push(`/contacts/${contact.value.id}?action=edit`)
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

const createTask = () => {
  // Implement task creation
  console.log('Create task for contact:', contact.value.id)
}

const createDeal = () => {
  // Implement deal creation
  console.log('Create deal for contact:', contact.value.id)
}

const sendEmail = () => {
  // Implement email sending
  console.log('Send email to:', contact.value.email)
}
</script>

