<template>
  <div class="space-y-8">
    <!-- Stats Cards -->
    <TicketStatsCard />
    
    <!-- Tickets Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Section Header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Service Tickets</h2>
            <p class="text-sm text-gray-500 mt-1">Manage and track all support requests</p>
          </div>
          <div class="flex items-center space-x-3">
            <div class="text-sm text-gray-500">
              {{ ticketsStore.tickets?.length || 0 }} total tickets
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tickets List -->
      <div class="p-6">
        <TicketList
          :auto-load="true"
          @ticket-selected="handleTicketSelected"
          @create-ticket="handleCreateTicket"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useServiceTicketsStore } from '../store/serviceTickets'
import TicketStatsCard from '../components/TicketStatsCard.vue'
import TicketList from '../components/TicketList.vue'

// Store
const ticketsStore = useServiceTicketsStore()

// Router
const router = useRouter()

// Methods
const handleTicketSelected = (ticket) => {
  router.push(`/service/${ticket.id}`)
}

const handleCreateTicket = () => {
  // Ticket creation is handled by the widget footer bar
  // This is just for compatibility with existing TicketList component
  console.log('Ticket creation should be done via widget footer bar')
}
</script>
