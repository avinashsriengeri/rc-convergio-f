<template>
  <div v-if="ticket" class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-xl font-semibold text-gray-900">
              #{{ ticket.id }} - {{ ticket.subject }}
            </h1>
            <StatusBadge :status="ticket.status" />
            <PriorityBadge :priority="ticket.priority" />
            <SLABadge :status="ticket.sla_status" />
          </div>
          <div class="text-sm text-gray-500">
            Created {{ formatDate(ticket.created_at) }} by {{ ticket.contact?.name || 'Unknown' }}
            <span v-if="ticket.email_integration_id" class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              From Email
            </span>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <button
            v-if="ticket.status === 'open'"
            @click="handleStatusChange('in_progress')"
            class="px-3 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Mark In Progress
          </button>
          <button
            v-if="ticket.status !== 'closed'"
            @click="showCloseModal = true"
            class="px-3 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close Ticket
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Description -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">Description</h3>
            <div class="prose max-w-none">
              <p class="text-gray-700 whitespace-pre-wrap">{{ ticket.description }}</p>
            </div>
          </div>

          <!-- Messages -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">Messages</h3>
            <div class="space-y-4">
              <div
                v-for="message in ticket.messages"
                :key="message.id"
                class="border border-gray-200 rounded-lg p-4"
                :class="{ 'bg-blue-50 border-blue-200': message.is_internal }"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-700">
                        {{ getInitials(message.user?.name || 'System') }}
                      </span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ message.user?.name || 'System' }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ formatDateTime(message.created_at) }}
                      </div>
                    </div>
                  </div>
                  <span
                    v-if="message.is_internal"
                    class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    Internal
                  </span>
                </div>
                <div class="text-gray-700 whitespace-pre-wrap">{{ message.message }}</div>
              </div>
            </div>
          </div>

          <!-- Reply box -->
          <TicketReplyBox
            :ticket-id="ticket.id"
            @message-sent="handleMessageSent"
          />
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Ticket Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Ticket Information</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd class="mt-1">
                  <StatusBadge :status="ticket.status" />
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Priority</dt>
                <dd class="mt-1">
                  <PriorityBadge :priority="ticket.priority" />
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Category</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ ticket.category || 'Uncategorized' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">SLA Status</dt>
                <dd class="mt-1">
                  <SLABadge :status="ticket.sla_status" />
                </dd>
              </div>
              <div v-if="ticket.sla_due_at">
                <dt class="text-sm font-medium text-gray-500">SLA Due</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDateTime(ticket.sla_due_at) }}</dd>
              </div>
            </dl>
          </div>

          <!-- Contact Information -->
          <div v-if="ticket.contact" class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Name</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ ticket.contact.name }}</dd>
              </div>
              <div v-if="ticket.contact.email">
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <a :href="`mailto:${ticket.contact.email}`" class="text-blue-600 hover:text-blue-800">
                    {{ ticket.contact.email }}
                  </a>
                </dd>
              </div>
              <div v-if="ticket.contact.phone">
                <dt class="text-sm font-medium text-gray-500">Phone</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <a :href="`tel:${ticket.contact.phone}`" class="text-blue-600 hover:text-blue-800">
                    {{ ticket.contact.phone }}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <!-- Company Information -->
          <div v-if="ticket.company" class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Company Information</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Company</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ ticket.company.name }}</dd>
              </div>
              <div v-if="ticket.company.website">
                <dt class="text-sm font-medium text-gray-500">Website</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <a :href="ticket.company.website" target="_blank" class="text-blue-600 hover:text-blue-800">
                    {{ ticket.company.website }}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <!-- Assignee -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-medium text-gray-900">Assignee</h3>
              <div class="flex items-center gap-2">
                <button
                  v-if="ticket.assignee && !showAssignDropdown"
                  @click="handleUnassignTicket"
                  class="px-3 py-1 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Unassign
                </button>
                <button
                  v-if="!showAssignDropdown"
                  @click="toggleAssignDropdown"
                  class="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {{ ticket.assignee ? 'Change' : 'Assign' }}
                </button>
                <button
                  v-if="showAssignDropdown"
                  @click="showAssignDropdown = false"
                  class="px-3 py-1 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
            
            <!-- Current Assignee Display -->
            <div v-if="ticket.assignee && !showAssignDropdown" class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span class="text-sm font-medium text-gray-700">
                  {{ getInitials(ticket.assignee.name) }}
                </span>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ ticket.assignee.name }}</div>
                <div class="text-sm text-gray-500">{{ ticket.assignee.email }}</div>
                <div v-if="ticket.assignee.team" class="text-xs text-gray-400">
                  {{ ticket.assignee.team.name }}
                </div>
              </div>
            </div>
            
            <!-- Unassigned Display -->
            <div v-else-if="!ticket.assignee && !showAssignDropdown" class="text-sm text-gray-500">
              Unassigned
            </div>
            
            <!-- Assignment Dropdown -->
            <div v-if="showAssignDropdown" class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Select Agent
                </label>
                <select
                  v-model="selectedAssigneeId"
                  :disabled="loadingAgents"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {{ loadingAgents ? 'Loading agents...' : 'Select an agent...' }}
                  </option>
                  <option v-for="agent in availableAgents" :key="agent.id" :value="agent.id">
                    {{ agent.name }} ({{ agent.email }}){{ agent.team ? ` - ${agent.team.name}` : '' }}
                  </option>
                </select>
                <div v-if="!loadingAgents && availableAgents.length === 0" class="mt-2 text-sm text-gray-500">
                  No agents available for assignment
                </div>
              </div>
              
              <div class="flex justify-end gap-3">
                <button
                  @click="showAssignDropdown = false"
                  class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  @click="handleAssignTicket"
                  :disabled="!selectedAssigneeId || assigning || loadingAgents || availableAgents.length === 0"
                  class="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {{ assigning ? 'Assigning...' : 'Assign Ticket' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Close Ticket Modal -->
    <div
      v-if="showCloseModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showCloseModal = false"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Close Ticket</h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Reason for closing
            </label>
            <textarea
              v-model="closeReason"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional reason for closing this ticket..."
            ></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button
              @click="showCloseModal = false"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleCloseTicket"
              :disabled="closing"
              class="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {{ closing ? 'Closing...' : 'Close Ticket' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading state -->
  <div v-else-if="loading" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div class="text-center">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading ticket...
      </div>
    </div>
  </div>

  <!-- Error state -->
  <div v-else-if="error" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div class="text-center">
      <div class="text-red-600 mb-2">{{ error }}</div>
      <button
        @click="fetchTicket"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Retry
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useServiceTicketsStore } from '../store/serviceTickets'
import StatusBadge from './StatusBadge.vue'
import PriorityBadge from './PriorityBadge.vue'
import SLABadge from './SLABadge.vue'
import TicketReplyBox from './TicketReplyBox.vue'
import { usersAPI } from '@/services/api'

// Props
const props = defineProps({
  ticketId: {
    type: [String, Number],
    required: true
  }
})

// Emits
const emit = defineEmits(['ticket-updated'])

// Store
const ticketsStore = useServiceTicketsStore()

// Local state
const showCloseModal = ref(false)
const closeReason = ref('')
const closing = ref(false)
const showAssignDropdown = ref(false)
const selectedAssigneeId = ref('')
const assigning = ref(false)
const availableAgents = ref([])
const loadingAgents = ref(false)

// Computed
const ticket = computed(() => ticketsStore.selectedTicket)
const loading = computed(() => ticketsStore.loading)
const error = computed(() => ticketsStore.error)

// Methods
const fetchTicket = () => {
  ticketsStore.fetchTicket(props.ticketId)
}

const handleStatusChange = async (status) => {
  try {
    await ticketsStore.updateStatus(props.ticketId, status)
    emit('ticket-updated')
  } catch (err) {
    console.error('Error updating status:', err)
  }
}

const handleCloseTicket = async () => {
  closing.value = true
  try {
    await ticketsStore.closeTicket(props.ticketId, closeReason.value)
    showCloseModal.value = false
    closeReason.value = ''
    emit('ticket-updated')
  } catch (err) {
    console.error('Error closing ticket:', err)
  } finally {
    closing.value = false
  }
}

const handleMessageSent = () => {
  // Refresh ticket data to get the new message
  fetchTicket()
}

const handleAssignTicket = async () => {
  if (!selectedAssigneeId.value) return
  
  assigning.value = true
  try {
    await ticketsStore.assignTicket(props.ticketId, selectedAssigneeId.value)
    showAssignDropdown.value = false
    selectedAssigneeId.value = ''
    emit('ticket-updated')
  } catch (err) {
    console.error('Error assigning ticket:', err)
  } finally {
    assigning.value = false
  }
}

const handleUnassignTicket = async () => {
  if (!confirm('Are you sure you want to unassign this ticket?')) return
  
  assigning.value = true
  try {
    await ticketsStore.assignTicket(props.ticketId, null)
    emit('ticket-updated')
  } catch (err) {
    console.error('Error unassigning ticket:', err)
  } finally {
    assigning.value = false
  }
}

const toggleAssignDropdown = async () => {
  showAssignDropdown.value = true
  selectedAssigneeId.value = ''
  // Refresh agents list when opening dropdown
  await loadAvailableAgents()
}

const loadAvailableAgents = async () => {
  loadingAgents.value = true
  try {
    console.log('Loading available agents for assignment...')
    
    // Fetch users for assignment from backend API using existing endpoint
    const response = await usersAPI.getUsersForAssignment()
    const users = response.data.data || response.data || []
    
    console.log('Available agents loaded:', users)
    availableAgents.value = users
  } catch (err) {
    console.error('Error loading agents:', err)
    
    // Fallback to empty array if API fails
    availableAgents.value = []
    
    // Show user-friendly error message
    alert('Failed to load available agents. Please try again.')
  } finally {
    loadingAgents.value = false
  }
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  fetchTicket()
  loadAvailableAgents()
})
</script>
