<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Event Registration</h1>
            <p class="mt-1 text-sm text-gray-600">Join us for this exciting event</p>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">Powered by</span>
            <span class="font-semibold text-blue-600">ConvergIO</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading event details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Event Not Found</h3>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button
          @click="loadEvent"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- Event Details and Registration -->
      <div v-else-if="event" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Event Information -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h2 class="text-xl font-bold text-gray-900">{{ event.name }}</h2>
                <p class="text-sm text-gray-600 mt-1">{{ event.type }}</p>
              </div>
              <span :class="getEventTypeColor(event.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ event.type }}
              </span>
            </div>

            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ formatDateTime(event.scheduled_at) }}</div>
                  <div class="text-xs text-gray-500">Event Date & Time</div>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ formatDuration(event.duration) }}</div>
                  <div class="text-xs text-gray-500">Duration</div>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ getEventLocation(event) }}</div>
                  <div class="text-xs text-gray-500">Location</div>
                </div>
              </div>

              <!-- Zoom Meeting Button -->
              <div v-if="hasZoomMeeting(event)" class="pt-2">
                <button
                  @click="joinZoomMeeting(event)"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Join Zoom Meeting</span>
                </button>
              </div>
            </div>

            <div v-if="event.description" class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="text-sm font-medium text-gray-900 mb-2">About This Event</h3>
              <p class="text-sm text-gray-600">{{ event.description }}</p>
            </div>
          </div>

          <!-- Event Stats -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-sm font-medium text-gray-900 mb-4">Event Statistics</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ event.rsvp_going || 0 }}</div>
                <div class="text-xs text-gray-600">Going</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ event.rsvp_interested || 0 }}</div>
                <div class="text-xs text-gray-600">Interested</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Registration Form -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Register for Event</h3>

          <!-- Success State -->
          <div v-if="registrationSuccess" class="text-center py-8">
            <div class="text-green-600 mb-4">
              <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 class="text-lg font-medium text-gray-900 mb-2">Registration Successful!</h4>
            <p class="text-gray-600 mb-6">You have successfully registered for this event. We'll send you a confirmation email shortly.</p>
            <button
              @click="resetRegistration"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Register Another Person
            </button>
          </div>

          <!-- Registration Form -->
          <form v-else @submit.prevent="submitRegistration" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  v-model="registrationForm.first_name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  v-model="registrationForm.last_name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                v-model="registrationForm.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Company/Organization</label>
              <input
                v-model="registrationForm.company"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                v-model="registrationForm.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">RSVP Status *</label>
              <select
                v-model="registrationForm.rsvp_status"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your response</option>
                <option value="going">I will attend</option>
                <option value="interested">I'm interested</option>
                <option value="declined">I cannot attend</option>
                <option value="maybe">Maybe</option>
              </select>
            </div>

            <!-- Consent Checkbox -->
            <div class="pt-2">
              <label class="flex items-start space-x-3">
                <input
                  v-model="registrationForm.agreed_to_communications"
                  type="checkbox"
                  required
                  class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">
                  I agree to receive event updates and communications regarding this event. *
                </span>
              </label>
            </div>

            <div class="pt-4">
              <button
                type="submit"
                :disabled="submitting"
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {{ submitting ? 'Registering...' : 'Register for Event' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { eventsService, eventsHelpers } from '@/services/events'
import { error as showError, success as showSuccess } from '@/utils/notifications'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Configure dayjs plugins
dayjs.extend(utc)
dayjs.extend(timezone)

const route = useRoute()

// Reactive state
const loading = ref(true)
const error = ref(null)
const event = ref(null)
const submitting = ref(false)
const registrationSuccess = ref(false)

// Registration form
const registrationForm = ref({
  first_name: '',
  last_name: '',
  email: '',
  company: '',
  phone: '',
  rsvp_status: '',
  agreed_to_communications: false
})

// Methods
const loadEvent = async () => {
  loading.value = true
  error.value = null
  
  try {
    const eventId = route.params.id
    const response = await eventsService.getPublicEvent(eventId)
    event.value = response.data
  } catch (err) {
    console.error('Error loading public event:', err)
    
    if (err.response?.status === 404) {
      error.value = 'This event could not be found or is no longer available.'
    } else if (err.response?.status === 500) {
      error.value = 'Server error. Please try again later.'
    } else {
      error.value = err.message || 'Failed to load event details'
    }
  } finally {
    loading.value = false
  }
}

const submitRegistration = async () => {
  if (!event.value) return
  
  submitting.value = true
  
  try {
    await eventsService.publicRegister(event.value.id, registrationForm.value)
    showSuccess('Successfully registered for the event!')
    registrationSuccess.value = true
    
    // Update event stats
    if (registrationForm.value.rsvp_status === 'going') {
      event.value.rsvp_going = (event.value.rsvp_going || 0) + 1
    } else if (registrationForm.value.rsvp_status === 'interested') {
      event.value.rsvp_interested = (event.value.rsvp_interested || 0) + 1
    }
  } catch (err) {
    console.error('Error registering for event:', err)
    
    if (err.response?.status === 409) {
      showError('You are already registered for this event')
    } else if (err.response?.status === 422) {
      const errors = err.response.data?.errors
      if (errors) {
        const errorMessages = Object.values(errors).flat()
        showError('Please check required fields: ' + errorMessages.join(', '))
      } else {
        showError('Please check required fields and try again.')
      }
    } else if (err.response?.status === 500) {
      showError('Server error. Please try again later.')
    } else {
      showError(err.message || 'Failed to register for event')
    }
  } finally {
    submitting.value = false
  }
}

const resetRegistration = () => {
  registrationSuccess.value = false
  registrationForm.value = {
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    phone: '',
    rsvp_status: '',
    agreed_to_communications: false
  }
}

// Helper methods
const getEventTypeColor = (type) => eventsHelpers.getEventTypeColor(type)
const formatDuration = (minutes) => eventsHelpers.formatDuration(minutes)

// Enhanced time formatting with timezone conversion
const formatDateTime = (dateString) => {
  if (!dateString) return 'Not scheduled'
  
  try {
    const localTime = dayjs.utc(dateString).local()
    return localTime.format('MMM D, YYYY, h:mm A')
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

// Check if event has Zoom meeting
const hasZoomMeeting = (event) => {
  return event && 
         (event.zoom_join_url || event.location) && 
         (event.type === 'webinar' || event.type === 'meeting')
}

// Get event location display text
const getEventLocation = (event) => {
  if (!event) return 'Virtual'
  
  if (hasZoomMeeting(event)) {
    return 'Virtual'
  }
  
  return event.location || 'Virtual'
}

const joinZoomMeeting = (event) => {
  const zoomUrl = event.zoom_join_url || event.location
  
  if (zoomUrl && (zoomUrl.includes('zoom.us') || zoomUrl.includes('zoom.com'))) {
    window.open(zoomUrl, '_blank')
  } else {
    showError('Zoom meeting link not available')
  }
}

// Lifecycle
onMounted(() => {
  loadEvent()
})
</script>
