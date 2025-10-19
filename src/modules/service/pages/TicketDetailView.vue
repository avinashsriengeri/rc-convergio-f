<template>
  <div class="space-y-6">
    <!-- Back button -->
    <div class="flex items-center">
      <button
        @click="goBack"
        class="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Tickets
      </button>
    </div>
    
    <!-- Ticket Detail -->
    <TicketDetail
      :ticket-id="ticketId"
      @ticket-updated="handleTicketUpdated"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TicketDetail from '../components/TicketDetail.vue'

// Router
const router = useRouter()
const route = useRoute()

// Computed
const ticketId = computed(() => route.params.id)

// Methods
const goBack = () => {
  router.push('/service')
}

const handleTicketUpdated = () => {
  // Optionally refresh data or show notification
  console.log('Ticket updated')
}
</script>

