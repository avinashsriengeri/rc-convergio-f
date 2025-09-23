<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Loading State -->
      <div class="bg-white rounded-xl shadow-lg p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Redirecting to Professional RSVP...</h2>
        <p class="text-gray-600">Please wait while we redirect you to the confirmation page.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  // Extract parameters from the backend URL
  const eventId = route.params.id
  const queryParams = route.query
  
  // Extract RSVP status and contact ID from query parameters
  const status = queryParams.status || 'going'
  const contactId = queryParams.contact_id || 'unknown'
  
  // Redirect to our professional frontend RSVP confirmation page
  const frontendUrl = `/events/${eventId}/rsvp?status=${status}&contact_id=${contactId}`
  
  // Small delay to show the loading state, then redirect
  setTimeout(() => {
    router.replace(frontendUrl)
  }, 1000)
})
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.bg-white {
  animation: fadeIn 0.5s ease-out;
}
</style>
