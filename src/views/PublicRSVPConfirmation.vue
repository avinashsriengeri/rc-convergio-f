<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl shadow-lg p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Processing your RSVP...</h2>
        <p class="text-gray-600">Please wait while we confirm your response.</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-xl shadow-lg p-8 text-center">
        <div class="text-red-500 mb-4">
          <svg class="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">RSVP Failed</h2>
        <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
        <div class="space-y-3">
          <button
            @click="retryRSVP"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
          <button
            @click="goToEventPage"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View Event Details
          </button>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Success Header -->
        <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-center">
          <div class="text-white mb-2">
            <svg class="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">RSVP Confirmed!</h1>
          <p class="text-green-100">Your response has been recorded successfully</p>
        </div>

        <!-- Event Details -->
        <div class="p-8">
          <div class="text-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ eventData.name }}</h2>
            <p class="text-gray-600">{{ formatDateTime(eventData.scheduled_at) }}</p>
          </div>

          <!-- RSVP Status -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="flex items-center justify-center space-x-3">
              <span :class="getRsvpStatusBadgeClass(rsvpStatus)" class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                {{ getRsvpStatusText(rsvpStatus) }}
              </span>
            </div>
          </div>

          <!-- Event Information -->
          <div class="space-y-4 mb-6">
            <div v-if="eventData.description" class="text-center">
              <p class="text-gray-700">{{ eventData.description }}</p>
            </div>
            
            <div v-if="eventData.location" class="flex items-center justify-center space-x-2 text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ eventData.location }}</span>
            </div>

            <!-- Zoom Meeting Button -->
            <div v-if="hasZoomMeeting" class="text-center">
              <button
                @click="joinZoomMeeting"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Join Zoom Meeting</span>
              </button>
            </div>
          </div>

          <!-- Next Steps -->
          <div class="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 class="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Add this event to your calendar</li>
              <li>• Check your email for any updates</li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <button
              @click="addToCalendar"
              class="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Add to Calendar</span>
            </button>
            
            <button
              @click="goToEventPage"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Full Event Details
            </button>
          </div>
        </div>
      </div>

      <!-- Processing State (when RSVP is being submitted) -->
      <div v-else class="bg-white rounded-xl shadow-lg p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Processing RSVP...</h2>
        <p class="text-gray-600">Please wait while we process your response.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { eventsService } from '@/services/events'
import { success as showSuccess, error as showError } from '@/utils/notifications'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Configure dayjs plugins
dayjs.extend(utc)
dayjs.extend(timezone)

const route = useRoute()
const router = useRouter()

// Reactive state
const loading = ref(true)
const error = ref(false)
const success = ref(false)
const processing = ref(false)
const eventData = ref(null)
const rsvpStatus = ref('')
const errorMessage = ref('')

// Computed properties
const hasZoomMeeting = computed(() => {
  return eventData.value && 
         (eventData.value.zoom_join_url || eventData.value.location) && 
         (eventData.value.type === 'webinar' || eventData.value.type === 'meeting')
})

// Methods
const processRSVP = async () => {
  try {
    const { eventId, status, contactId } = route.query
    
    if (!eventId || !status || !contactId) {
      throw new Error('Missing required parameters')
    }

    // First, fetch event details
    const eventResponse = await eventsService.getPublicEvent(eventId)
    eventData.value = eventResponse.data

    // Process the RSVP
    processing.value = true
    const rsvpResponse = await eventsService.processRSVP(eventId, {
      status: status,
      contact_id: contactId
    })

    rsvpStatus.value = status
    success.value = true
    showSuccess('RSVP confirmed successfully!')
    
  } catch (err) {
    console.error('Error processing RSVP:', err)
    error.value = true
    
    if (err.response?.status === 404) {
      errorMessage.value = 'Event not found or no longer available.'
    } else if (err.response?.status === 422) {
      errorMessage.value = 'Invalid RSVP data. Please try again.'
    } else if (err.response?.status === 409) {
      errorMessage.value = 'You have already responded to this event.'
    } else {
      errorMessage.value = err.message || 'Failed to process RSVP. Please try again.'
    }
    
    showError(errorMessage.value)
  } finally {
    loading.value = false
    processing.value = false
  }
}

const retryRSVP = () => {
  error.value = false
  loading.value = true
  processRSVP()
}

const joinZoomMeeting = () => {
  if (eventData.value) {
    const zoomUrl = eventData.value.zoom_join_url || eventData.value.location
    if (zoomUrl && (zoomUrl.includes('zoom.us') || zoomUrl.includes('zoom.com'))) {
      window.open(zoomUrl, '_blank')
    } else {
      showError('Zoom meeting link not available')
    }
  }
}

const addToCalendar = async () => {
  if (!eventData.value) return
  
  try {
    const response = await eventsService.getEventCalendarLinks(eventData.value.id)
    const calendarData = response.data
    
    if (calendarData?.google_calendar_url) {
      window.open(calendarData.google_calendar_url, '_blank')
    } else {
      showError('Calendar link not available')
    }
  } catch (err) {
    console.error('Error getting calendar link:', err)
    showError('Failed to open calendar')
  }
}

const goToEventPage = () => {
  if (eventData.value) {
    router.push(`/public/events/${eventData.value.id}`)
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'Date TBD'
  
  try {
    const localTime = dayjs.utc(dateString).local()
    return localTime.format('MMMM D, YYYY [at] h:mm A')
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

const getRsvpStatusBadgeClass = (status) => {
  const classes = {
    going: 'bg-green-100 text-green-800',
    interested: 'bg-yellow-100 text-yellow-800',
    declined: 'bg-red-100 text-red-800',
    maybe: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getRsvpStatusText = (status) => {
  const texts = {
    going: 'Going',
    interested: 'Interested',
    declined: 'Declined',
    maybe: 'Maybe'
  }
  return texts[status] || 'Unknown'
}

// Lifecycle
onMounted(() => {
  processRSVP()
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

/* Gradient text effect */
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
