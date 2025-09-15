<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumbs -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex py-4" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <div class="flex items-center">
                <router-link to="/marketing" class="text-gray-400 hover:text-gray-500">
                  <svg class="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span class="sr-only">Home</span>
                </router-link>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-500">{{ $t('common.marketing') }}</span>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-900">{{ $t('marketing.events.title') }}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('marketing.events.title') }}</h1>
          <p class="mt-2 text-lg text-gray-600">{{ $t('marketing.events.subtitle') }}</p>
        </div>
        <button
          @click="openCreateModal"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          {{ $t('marketing.events.actions.create_event') }}
        </button>
      </div>

      <!-- Event Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Upcoming Events -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.events.stats.upcoming_events') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ upcomingEventsCount }}</p>
              <p class="text-sm text-green-600">+3 this week</p>
            </div>
          </div>
        </div>

        <!-- Total Attendees -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.events.stats.total_attendees') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalAttendeesCount }}</p>
              <p class="text-sm text-green-600">+15% from last month</p>
            </div>
          </div>
        </div>

        <!-- Event Utilization -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.events.stats.utilization_rate') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ averageUtilization }}%</p>
              <p class="text-sm text-green-600">+5% from last month</p>
            </div>
          </div>
        </div>

        <!-- Revenue Generated -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.events.stats.revenue_generated') }}</p>
              <p class="text-2xl font-bold text-gray-900">$45,600</p>
              <p class="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Events Management -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <!-- Tabs and Filters -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <!-- Tabs -->
            <div class="flex space-x-8">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id; loadEvents()"
                :class="[
                  'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                {{ $t(`marketing.events.tabs.${tab.id}`) }}
              </button>
            </div>

            <!-- Type Filter -->
            <div class="flex items-center space-x-4">
              <select
                v-model="selectedType"
                @change="loadEvents"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{{ $t('marketing.events.filters.all_types') }}</option>
                <option v-for="type in eventTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">{{ $t('marketing.events.loading') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-12 text-center">
          <div class="text-red-600 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.events.error') }}</h3>
          <button
            @click="loadEvents"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {{ $t('common.marketing_overview.retry_button') }}
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredEvents.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.events.empty_state.title') }}</h3>
          <p class="text-gray-600 mb-6">{{ $t('marketing.events.empty_state.message') }}</p>
          <button
            @click="openCreateModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.events.empty_state.create_event') }}
          </button>
        </div>

        <!-- Events Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.events.table.name') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.events.table.type') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.events.table.scheduled_at') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.events.table.rsvps') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.events.table.attended') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.events.table.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="event in filteredEvents"
                :key="event.id"
                @click="openEventDetails(event)"
                class="hover:bg-gray-50 cursor-pointer"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ event.name }}</div>
                  <div class="text-sm text-gray-500">{{ event.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getEventTypeColor(event.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ event.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDateTime(event.scheduled_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex space-x-2">
                    <span class="text-green-600">{{ event.rsvp_going }} {{ $t('marketing.events.details_drawer.going') }}</span>
                    <span class="text-yellow-600">{{ event.rsvp_interested }} {{ $t('marketing.events.details_drawer.interested') }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ event.attended || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click.stop="editEvent(event)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      {{ $t('marketing.events.actions.edit') }}
                    </button>
                    <button
                      @click.stop="deleteEvent(event)"
                      class="text-red-600 hover:text-red-900"
                    >
                      {{ $t('marketing.events.actions.delete') }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create Event Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeCreateModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.events.create_modal.title') }}</h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="createEvent">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.events.create_modal.name') }}</label>
                  <input
                    v-model="createForm.name"
                    type="text"
                    required
                    :placeholder="$t('marketing.events.create_modal.enter_name')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.events.create_modal.description') }}</label>
                  <textarea
                    v-model="createForm.description"
                    :placeholder="$t('marketing.events.create_modal.enter_description')"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.events.create_modal.type') }}</label>
                  <select
                    v-model="createForm.type"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{{ $t('marketing.events.create_modal.select_type') }}</option>
                    <option v-for="type in eventTypes" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.events.create_modal.duration') }}</label>
                  <input
                    v-model="createForm.duration"
                    type="number"
                    required
                    min="1"
                    :placeholder="$t('marketing.events.create_modal.enter_duration')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.events.create_modal.scheduled_at') }}</label>
                  <input
                    v-model="createForm.scheduled_at"
                    type="datetime-local"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.events.create_modal.location') }}</label>
                  <input
                    v-model="createForm.location"
                    type="text"
                    :placeholder="$t('marketing.events.create_modal.enter_location')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.events.create_modal.max_attendees') }}</label>
                  <input
                    v-model="createForm.max_attendees"
                    type="number"
                    min="1"
                    :placeholder="$t('marketing.events.create_modal.enter_max_attendees')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  @click="closeCreateModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {{ $t('marketing.events.create_modal.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="creating"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
                >
                  {{ creating ? $t('marketing.events.create_modal.creating') : $t('marketing.events.create_modal.create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Details Drawer -->
    <div
      v-if="selectedEvent"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeEventDetails"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute right-0 top-0 h-full w-96 bg-white shadow-xl" @click.stop>
        <div class="flex flex-col h-full">
          <!-- Drawer Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">{{ selectedEvent.name }}</h3>
              <button
                @click="closeEventDetails"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Event Info -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="space-y-3">
              <div>
                <span class="text-sm font-medium text-gray-500">Type:</span>
                <span :class="getEventTypeColor(selectedEvent.type)" class="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ selectedEvent.type }}
                </span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Scheduled:</span>
                <span class="ml-2 text-sm text-gray-900">{{ formatDateTime(selectedEvent.scheduled_at) }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Duration:</span>
                <span class="ml-2 text-sm text-gray-900">{{ formatDuration(selectedEvent.duration) }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Location:</span>
                <span class="ml-2 text-sm text-gray-900">{{ selectedEvent.location || 'Virtual' }}</span>
              </div>
            </div>
          </div>

          <!-- Attendees Section -->
          <div class="flex-1 overflow-y-auto">
            <div class="px-6 py-4 border-b border-gray-200">
              <h4 class="text-sm font-medium text-gray-900">{{ $t('marketing.events.details_drawer.attendees') }}</h4>
            </div>
            <div class="px-6 py-4">
              <!-- RSVP Filter -->
              <div class="mb-4">
                <select
                  v-model="attendeeFilter"
                  @change="loadEventAttendees"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{{ $t('marketing.events.details_drawer.all_rsvp') }}</option>
                  <option value="going">{{ $t('marketing.events.details_drawer.going') }}</option>
                  <option value="interested">{{ $t('marketing.events.details_drawer.interested') }}</option>
                  <option value="declined">{{ $t('marketing.events.details_drawer.declined') }}</option>
                </select>
              </div>

              <!-- Attendees List -->
              <div class="space-y-3">
                <div
                  v-for="attendee in eventAttendees"
                  :key="attendee.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">{{ attendee.name }}</div>
                    <div class="text-sm text-gray-500">{{ attendee.email }}</div>
                    <div class="text-sm text-gray-500">{{ attendee.company }}</div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span :class="getRsvpStatusColor(attendee.rsvp_status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ attendee.rsvp_status }}
                    </span>
                    <button
                      v-if="!attendee.attended && attendee.rsvp_status === 'going'"
                      @click="markAttended(attendee)"
                      class="text-green-600 hover:text-green-900 text-xs"
                    >
                      {{ $t('marketing.events.actions.mark_attended') }}
                    </button>
                    <span v-else-if="attendee.attended" class="text-green-600 text-xs">✓ Attended</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeConfirmModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.events.confirmations.delete_title') }}</h3>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-6">{{ $t('marketing.events.confirmations.delete_message') }}</p>
            <div class="flex justify-end space-x-3">
              <button
                @click="closeConfirmModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {{ $t('marketing.events.confirmations.cancel') }}
              </button>
              <button
                @click="confirmDelete"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                {{ $t('marketing.events.confirmations.confirm') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { eventsService, eventsHelpers } from '@/services/events'
import { error as showError, success as showSuccess } from '@/utils/notifications'

const { t } = useI18n()

// Reactive state
const loading = ref(false)
const error = ref(null)
const events = ref([])
const eventTypes = ref([])
const selectedEvent = ref(null)
const eventAttendees = ref([])
const attendeeFilter = ref('')

// Modal states
const showCreateModal = ref(false)
const showConfirmModal = ref(false)
const creating = ref(false)

// Filters and tabs
const activeTab = ref('upcoming')
const selectedType = ref('')
const tabs = ref([
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'all', label: 'All' }
])

// Forms
const createForm = ref({
  name: '',
  description: '',
  type: '',
  scheduled_at: '',
  duration: 60,
  location: '',
  max_attendees: 100
})

// Confirmation modal
const confirmModal = ref({
  event: null
})

// Computed properties
const filteredEvents = computed(() => {
  let filtered = events.value

  // Filter by tab
  if (activeTab.value === 'upcoming') {
    filtered = filtered.filter(event => eventsHelpers.isEventUpcoming(event))
  } else if (activeTab.value === 'completed') {
    filtered = filtered.filter(event => eventsHelpers.isEventCompleted(event))
  }
  // 'all' shows everything

  // Filter by type
  if (selectedType.value) {
    filtered = filtered.filter(event => event.type === selectedType.value)
  }

  return filtered
})

const upcomingEventsCount = computed(() => {
  return events.value.filter(event => eventsHelpers.isEventUpcoming(event)).length
})

const totalAttendeesCount = computed(() => {
  return events.value.reduce((sum, event) => sum + (event.rsvp_going || 0), 0)
})

const averageUtilization = computed(() => {
  if (events.value.length === 0) return 0
  const totalUtilization = events.value.reduce((sum, event) => {
    return sum + eventsHelpers.calculateUtilizationRate(event)
  }, 0)
  return Math.round(totalUtilization / events.value.length)
})

// Methods
const loadEvents = async () => {
  loading.value = true
  error.value = null
  
  try {
    const params = {}
    if (activeTab.value !== 'all') {
      params.status = activeTab.value
    }
    if (selectedType.value) {
      params.type = selectedType.value
    }
    
    const response = await eventsService.getEvents(params)
    events.value = response.data || []
  } catch (err) {
    error.value = err.message || 'Failed to load events'
    showError(error.value)
  } finally {
    loading.value = false
  }
}

const loadEventTypes = async () => {
  try {
    const response = await eventsService.getEventTypes()
    eventTypes.value = response.data || []
  } catch (err) {
    console.error('Failed to load event types:', err)
  }
}

const loadEventAttendees = async () => {
  if (!selectedEvent.value) return
  
  try {
    const params = {}
    if (attendeeFilter.value) {
      params.rsvp_status = attendeeFilter.value
    }
    
    const response = await eventsService.getEventAttendees(selectedEvent.value.id, params)
    eventAttendees.value = response.data || []
  } catch (err) {
    console.error('Failed to load event attendees:', err)
  }
}

const openCreateModal = () => {
  showCreateModal.value = true
  createForm.value = {
    name: '',
    description: '',
    type: '',
    scheduled_at: '',
    duration: 60,
    location: '',
    max_attendees: 100
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  creating.value = false
}

const createEvent = async () => {
  creating.value = true
  
  try {
    await eventsService.createEvent(createForm.value)
    showSuccess('Event created successfully')
    closeCreateModal()
    loadEvents()
  } catch (err) {
    showError(err.message || 'Failed to create event')
  } finally {
    creating.value = false
  }
}

const editEvent = (event) => {
  // For now, just show a simple edit modal
  showSuccess(`Edit functionality for ${event.name} - Coming soon`)
}

const deleteEvent = (event) => {
  confirmModal.value.event = event
  showConfirmModal.value = true
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  confirmModal.value.event = null
}

const confirmDelete = async () => {
  if (!confirmModal.value.event) return
  
  try {
    await eventsService.deleteEvent(confirmModal.value.event.id)
    showSuccess('Event deleted successfully')
    closeConfirmModal()
    loadEvents()
  } catch (err) {
    showError(err.message || 'Failed to delete event')
  }
}

const openEventDetails = async (event) => {
  selectedEvent.value = event
  attendeeFilter.value = ''
  await loadEventAttendees()
}

const closeEventDetails = () => {
  selectedEvent.value = null
  eventAttendees.value = []
}

const markAttended = async (attendee) => {
  try {
    await eventsService.markAttended(selectedEvent.value.id, attendee.id)
    showSuccess(`${attendee.name} marked as attended`)
    loadEventAttendees()
    loadEvents() // Refresh main events list to update counts
  } catch (err) {
    showError(err.message || 'Failed to mark attendee as attended')
  }
}

// Helper methods
const getEventTypeColor = (type) => eventsHelpers.getEventTypeColor(type)
const getRsvpStatusColor = (status) => eventsHelpers.getRsvpStatusColor(status)
const formatDateTime = (dateString) => eventsHelpers.formatDateTime(dateString)
const formatDuration = (minutes) => eventsHelpers.formatDuration(minutes)

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadEvents(),
    loadEventTypes()
  ])
})
</script>