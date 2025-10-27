<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header with filters and actions -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <h2 class="text-lg font-semibold text-gray-900">Service Tickets</h2>
          <div class="text-sm text-gray-500">
            {{ meta.total }} total tickets
          </div>
          <!-- Status Filter Indicator -->
          <div v-if="getStatusFromRoute() !== 'all'" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {{ getStatusFromRoute().replace('_', ' ').toUpperCase() }}
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <!-- Search -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search tickets..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="handleSearch"
            />
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <!-- Filters -->
          <select
            v-model="statusFilter"
            :disabled="getStatusFromRoute() !== 'all'"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            @change="handleFilterChange"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          
          <select
            v-model="priorityFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="handleFilterChange"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="p-8 text-center">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading tickets...
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-8 text-center">
      <div class="text-red-600 mb-2">{{ error }}</div>
      <button
        @click="fetchTickets"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="tickets.length === 0" class="p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ getStatusFromRoute() !== 'all' ? `No ${getStatusFromRoute().replace('_', ' ')} tickets found` : 'No tickets found' }}
      </h3>
      <p class="text-gray-500 mb-4">
        {{ getStatusFromRoute() !== 'all' ? `There are currently no ${getStatusFromRoute().replace('_', ' ')} tickets.` : 'Get started by creating your first service ticket.' }}
      </p>
      <button
        v-if="getStatusFromRoute() === 'all'"
        @click="$emit('create-ticket')"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Create Ticket
      </button>
    </div>

    <!-- Tickets table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ticket
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assignee
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SLA
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="ticket in tickets"
            :key="ticket.id"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
            @click="handleTicketClick(ticket)"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <div class="text-sm font-medium text-gray-900">
                    #{{ ticket.id }}
                  </div>
                  <span v-if="ticket.email_integration_id" class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </span>
                </div>
                <div class="text-sm text-gray-500 truncate max-w-xs">
                  {{ ticket.subject }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <StatusBadge :status="ticket.status" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <PriorityBadge :priority="ticket.priority" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="ticket.assignee" class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-700">
                    {{ getInitials(ticket.assignee.name) }}
                  </span>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">
                    {{ ticket.assignee.name }}
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500">
                Unassigned
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <SLABadge :status="ticket.sla_status" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(ticket.created_at) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="meta.last_page > 1" class="px-6 py-4 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ meta.from }} to {{ meta.to }} of {{ meta.total }} results
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="handlePageChange(meta.current_page - 1)"
            :disabled="meta.current_page <= 1"
            class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="px-3 py-2 text-sm text-gray-700">
            Page {{ meta.current_page }} of {{ meta.last_page }}
          </span>
          <button
            @click="handlePageChange(meta.current_page + 1)"
            :disabled="meta.current_page >= meta.last_page"
            class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useServiceTicketsStore } from '../store/serviceTickets'
import StatusBadge from './StatusBadge.vue'
import PriorityBadge from './PriorityBadge.vue'
import SLABadge from './SLABadge.vue'

// Props
const props = defineProps({
  autoLoad: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['ticket-selected', 'create-ticket'])

// Router
const router = useRouter()

// Store
const ticketsStore = useServiceTicketsStore()

// Local state
const searchQuery = ref('')
const statusFilter = ref('all')
const priorityFilter = ref('all')

// Route-based status detection
const getStatusFromRoute = () => {
  const path = router.currentRoute.value.path
  if (path.includes('/service/open')) return 'open'
  if (path.includes('/service/in-progress')) return 'in_progress'
  if (path.includes('/service/resolved')) return 'resolved'
  if (path.includes('/service/closed')) return 'closed'
  return 'all'
}

// Computed
const tickets = computed(() => ticketsStore.tickets)
const loading = computed(() => ticketsStore.loading)
const error = computed(() => ticketsStore.error)
const meta = computed(() => ticketsStore.meta)

// Methods
const fetchTickets = () => {
  // Get status from route or filter
  const routeStatus = getStatusFromRoute()
  const finalStatus = routeStatus !== 'all' ? routeStatus : (statusFilter.value !== 'all' ? statusFilter.value : undefined)
  
  const filters = {
    search: searchQuery.value,
    status: finalStatus,
    priority: priorityFilter.value !== 'all' ? priorityFilter.value : undefined
  }
  ticketsStore.fetchTickets(filters)
}

const handleSearch = () => {
  fetchTickets()
}

const handleFilterChange = () => {
  fetchTickets()
}

const handleTicketClick = (ticket) => {
  emit('ticket-selected', ticket)
  router.push(`/service/${ticket.id}`)
}

const handlePageChange = (page) => {
  ticketsStore.fetchTickets({ page })
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
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  if (props.autoLoad) {
    // Set initial status filter based on route
    statusFilter.value = getStatusFromRoute()
    fetchTickets()
  }
})

// Watch for route changes to refresh data
watch(() => router.currentRoute.value.path, (newPath) => {
  if (newPath.startsWith('/service')) {
    // Update status filter based on new route
    statusFilter.value = getStatusFromRoute()
    fetchTickets()
  }
})
</script>

