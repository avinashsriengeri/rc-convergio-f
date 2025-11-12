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
                    <!-- Zoom Join Button for webinar/meeting types -->
                    <button
                      v-if="hasZoomMeeting(event)"
                      @click.stop="joinZoomMeeting(event)"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Join Zoom</span>
                    </button>
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

    <!-- Events Analytics Section -->
    <div v-if="activeTab === 'analytics'" class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.events.analytics.title') }}</h3>
          <button
            @click="loadEventsAnalytics"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {{ $t('marketing.events.analytics.refresh') }}
          </button>
        </div>
      </div>

      <div v-if="analyticsLoading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">{{ $t('marketing.events.analytics.loading') }}</p>
      </div>

      <div v-else-if="eventsAnalytics" class="p-6">
        <!-- Overall Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-3xl font-bold text-blue-900">{{ eventsAnalytics.overview?.total_events || 0 }}</div>
                <div class="text-sm text-blue-700 font-medium">{{ $t('marketing.events.analytics.total_events') }}</div>
              </div>
              <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-3xl font-bold text-green-900">{{ eventsAnalytics.overview?.upcoming_events || 0 }}</div>
                <div class="text-sm text-green-700 font-medium">{{ $t('marketing.events.analytics.upcoming_events') }}</div>
              </div>
              <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-3xl font-bold text-gray-900">{{ eventsAnalytics.overview?.past_events || 0 }}</div>
                <div class="text-sm text-gray-700 font-medium">{{ $t('marketing.events.analytics.completed_events') }}</div>
              </div>
              <div class="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-3xl font-bold text-purple-900">{{ formatNumber(eventsAnalytics.rsvp_stats?.total_attendees || 0) }}</div>
                <div class="text-sm text-purple-700 font-medium">{{ $t('marketing.events.analytics.total_attendees') }}</div>
              </div>
              <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-3xl font-bold text-orange-900">{{ formatNumber((eventsAnalytics.rsvp_stats?.going || 0) + (eventsAnalytics.rsvp_stats?.interested || 0)) }}</div>
                <div class="text-sm text-orange-700 font-medium">{{ $t('marketing.events.analytics.total_rsvps') }}</div>
              </div>
              <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-3xl font-bold text-indigo-900">{{ eventsAnalytics.rsvp_stats?.attendance_rate || 0 }}%</div>
                <div class="text-sm text-indigo-700 font-medium">{{ $t('marketing.events.analytics.avg_attendance_rate') }}</div>
              </div>
              <div class="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-3xl font-bold text-teal-900">{{ eventsAnalytics.overview?.active_events || 0 }}</div>
                <div class="text-sm text-teal-700 font-medium">Active Events</div>
              </div>
              <div class="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Events by Type -->
        <div class="mb-8">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('marketing.events.analytics.events_by_type') }}</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="(count, type) in eventsAnalytics.event_types"
              :key="type"
              class="border border-gray-200 rounded-lg p-6"
            >
              <div class="flex items-center mb-4">
                <span :class="getEventTypeColor(type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ type }}
                </span>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ $t('marketing.events.analytics.events_count') }}:</span>
                  <span class="text-sm font-medium">{{ count }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Type:</span>
                  <span class="text-sm font-medium capitalize">{{ type }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Performing Events -->
        <div class="mb-8">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('marketing.events.analytics.top_performing_events') }}</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.events.analytics.event_name') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.events.analytics.type') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.events.analytics.total_attendees') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.events.analytics.attendance_rate') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.events.analytics.scheduled_at') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="event in Object.values(eventsAnalytics.top_events || {})" :key="event.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ event.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getEventTypeColor(event.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ event.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatNumber(event.total_attendees) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ event.attendance_rate }}%
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDateTime(event.scheduled_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- RSVP Breakdown Chart -->
        <div class="mb-8">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">RSVP Breakdown</h4>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Pie Chart -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <div class="flex items-center justify-center mb-4">
                <div class="relative w-48 h-48">
                  <!-- Pie Chart SVG -->
                  <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <!-- Going (Green) -->
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#10b981"
                      stroke-width="8"
                      :stroke-dasharray="getRsvpPieChartData('going')"
                      stroke-dashoffset="0"
                      class="transition-all duration-500"
                    />
                    <!-- Interested (Yellow) -->
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f59e0b"
                      stroke-width="8"
                      :stroke-dasharray="getRsvpPieChartData('interested')"
                      :stroke-dashoffset="getRsvpPieChartOffset('interested')"
                      class="transition-all duration-500"
                    />
                    <!-- Declined (Red) -->
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ef4444"
                      stroke-width="8"
                      :stroke-dasharray="getRsvpPieChartData('declined')"
                      :stroke-dashoffset="getRsvpPieChartOffset('declined')"
                      class="transition-all duration-500"
                    />
                  </svg>
                  <!-- Center Text -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-gray-900">{{ getTotalRsvps() }}</div>
                      <div class="text-sm text-gray-600">Total RSVPs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Legend -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h5 class="text-sm font-medium text-gray-900 mb-4">RSVP Status</h5>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span class="text-sm text-gray-700">Going</span>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ eventsAnalytics.rsvp_stats?.going || 0 }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span class="text-sm text-gray-700">Interested</span>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ eventsAnalytics.rsvp_stats?.interested || 0 }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span class="text-sm text-gray-700">Declined</span>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ eventsAnalytics.rsvp_stats?.declined || 0 }}</span>
                </div>
                <div class="border-t border-gray-200 pt-3 mt-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">Attended</span>
                    </div>
                    <span class="text-sm font-medium text-gray-900">{{ eventsAnalytics.rsvp_stats?.attended || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Trends Chart -->
        <div class="mb-8">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('marketing.events.analytics.monthly_trends') }}</h4>
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <!-- Chart Header -->
            <div class="flex justify-between items-center mb-6">
              <div>
                <h5 class="text-sm font-medium text-gray-700">Event Creation Trends</h5>
                <p class="text-xs text-gray-500">Last 6 months overview</p>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span class="text-xs text-gray-600">Events Created</span>
                </div>
                <div class="text-right">
                  <div class="text-sm font-semibold text-gray-900">{{ getTotalEventsInTrends() }}</div>
                  <div class="text-xs text-gray-500">Total Events</div>
                </div>
              </div>
            </div>
            
            <!-- Chart Container -->
            <div class="relative">
              <!-- Y-axis labels -->
              <div class="absolute left-0 top-0 h-64 w-8 flex flex-col justify-between text-xs text-gray-500">
                <div>{{ getMaxTrendValue() }}</div>
                <div>{{ Math.round(getMaxTrendValue() * 0.75) }}</div>
                <div>{{ Math.round(getMaxTrendValue() * 0.5) }}</div>
                <div>{{ Math.round(getMaxTrendValue() * 0.25) }}</div>
                <div>0</div>
              </div>
              
              <!-- Chart Area -->
              <div class="ml-12 h-64 flex items-end justify-between space-x-2">
                <!-- Chart Bars with enhanced styling -->
                <div v-for="(count, month) in getEnhancedTrendsData()" :key="month" class="flex flex-col items-center flex-1">
                  <div class="relative w-full max-w-16">
                    <!-- Bar with gradient and shadow -->
                    <div 
                      class="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out shadow-lg hover:shadow-xl cursor-pointer group"
                      :style="{ height: getBarHeight(count) + 'px' }"
                      :title="`${formatMonthLabel(month)}: ${count} events`"
                    >
                      <!-- Hover effect overlay -->
                      <div class="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-20 rounded-t-lg transition-all duration-200"></div>
                    </div>
                    
                    <!-- Value Label with better positioning -->
                    <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-800 bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {{ count }}
                    </div>
                  </div>
                  
                  <!-- Month Label with better styling -->
                  <div class="mt-3 text-xs font-medium text-gray-600 text-center">
                    {{ formatMonthLabel(month) }}
                  </div>
                </div>
              </div>
              
              <!-- Grid lines -->
              <div class="absolute inset-0 ml-12 pointer-events-none">
                <div class="h-full flex flex-col justify-between">
                  <div class="border-t border-gray-100"></div>
                  <div class="border-t border-gray-100"></div>
                  <div class="border-t border-gray-100"></div>
                  <div class="border-t border-gray-100"></div>
                </div>
              </div>
            </div>
            
            <!-- Chart Footer -->
            <div class="mt-6 pt-4 border-t border-gray-100">
              <div class="flex justify-between items-center text-xs text-gray-500">
                <div class="flex items-center space-x-4">
                  <span>Average: {{ getAverageTrendValue() }} events/month</span>
                  <span>Peak: {{ getMaxTrendValue() }} events</span>
                </div>
                <div class="text-right">
                  <span>Growth: {{ getTrendGrowth() }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h4 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.events.analytics.no_data') }}</h4>
        <p class="text-gray-600 mb-6">{{ $t('marketing.events.analytics.no_data_description') }}</p>
        <button
          @click="loadEventsAnalytics"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          {{ $t('marketing.events.analytics.load_data') }}
        </button>
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

    <!-- Edit Event Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeEditModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.events.edit_modal.title') }}</h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="updateEvent">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.events.create_modal.name') }}</label>
                  <input
                    v-model="editForm.name"
                    type="text"
                    required
                    :placeholder="$t('marketing.events.create_modal.enter_name')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.events.create_modal.description') }}</label>
                  <textarea
                    v-model="editForm.description"
                    :placeholder="$t('marketing.events.create_modal.enter_description')"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.events.create_modal.type') }}</label>
                  <select
                    v-model="editForm.type"
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
                    v-model="editForm.duration"
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
                    v-model="editForm.scheduled_at"
                    type="datetime-local"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.events.create_modal.location') }}</label>
                  <input
                    v-model="editForm.location"
                    type="text"
                    :placeholder="$t('marketing.events.create_modal.enter_location')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.events.create_modal.max_attendees') }}</label>
                  <input
                    v-model="editForm.max_attendees"
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
                  @click="closeEditModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {{ $t('marketing.events.create_modal.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="updating"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
                >
                  {{ updating ? 'Updating...' : 'Update Event' }}
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
      <div class="absolute right-0 top-0 bottom-0 w-96 max-w-full bg-white shadow-xl overflow-y-auto" @click.stop style="scrollbar-width: thin; scrollbar-color: #d1d5db #f3f4f6;">
        <!-- Drawer Header (Sticky) -->
        <div class="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
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
                <span class="ml-2 text-sm text-gray-900">{{ getEventLocation(selectedEvent) }}</span>
              </div>
              <!-- Zoom Meeting Info -->
              <div v-if="hasZoomMeeting(selectedEvent)">
                <span class="text-sm font-medium text-gray-500">Meeting Access:</span>
                <div class="ml-2 mt-1">
                  <button
                    @click="joinZoomMeeting(selectedEvent)"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Join Zoom Meeting</span>
                  </button>
                  <div v-if="selectedEvent.recording_enabled" class="mt-2">
                    <span class="text-xs text-green-600 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      Recording enabled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Event Actions Section -->
          <div class="px-6 py-4 border-b border-gray-200">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Event Actions</h4>
            <div class="grid grid-cols-2 gap-3">
              <!-- Copy Public Link -->
              <div class="flex flex-col space-y-1">
                <button
                  @click="copyPublicLink"
                  class="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy Link</span>
                </button>
                <button
                  @click="openPublicLink"
                  class="flex items-center justify-center space-x-2 px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md text-xs font-medium transition-colors"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>Open</span>
                </button>
              </div>

              <!-- Show QR Code -->
              <button
                @click="showQRCode"
                class="flex items-center justify-center space-x-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-md text-sm font-medium transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span>QR Code</span>
              </button>

              <!-- Add to Calendar -->
              <button
                @click="showCalendarOptions"
                class="flex items-center justify-center space-x-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md text-sm font-medium transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Calendar</span>
              </button>

              <!-- Send Invitations -->
              <button
                @click="openInvitationModal"
                class="flex items-center justify-center space-x-2 px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-md text-sm font-medium transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Invite</span>
              </button>
            </div>
          </div>

          <!-- Event Analytics Section -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-sm font-medium text-gray-900">Analytics</h4>
              <button
                @click="toggleAnalyticsView"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {{ showDetailedAnalytics ? 'Hide Details' : 'View Details' }}
              </button>
            </div>
            
            <!-- Quick Stats -->
            <div v-if="eventAnalytics" class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ eventAnalytics.total_rsvps || 0 }}</div>
                <div class="text-xs text-gray-600">Total RSVPs</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ eventAnalytics.attendance_rate || 0 }}%</div>
                <div class="text-xs text-gray-600">Attendance Rate</div>
              </div>
            </div>
            <div v-else class="text-center py-4">
              <div class="text-sm text-gray-500">Loading analytics...</div>
            </div>

            <!-- Detailed Analytics -->
            <div v-if="showDetailedAnalytics && eventAnalytics" class="mt-4 pt-4 border-t border-gray-200">
              <div class="space-y-4">
                <!-- RSVP Breakdown -->
                <div>
                  <h5 class="text-xs font-medium text-gray-700 mb-2">RSVP Breakdown</h5>
                  <div class="space-y-2">
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-gray-600">Going</span>
                      <div class="flex items-center space-x-2">
                        <div class="w-16 bg-gray-200 rounded-full h-2">
                          <div class="bg-green-600 h-2 rounded-full" :style="{ width: getRsvpPercentage('going') + '%' }"></div>
                        </div>
                        <span class="text-xs font-medium text-gray-900">{{ eventAnalytics.rsvp_going || 0 }}</span>
                      </div>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-gray-600">Interested</span>
                      <div class="flex items-center space-x-2">
                        <div class="w-16 bg-gray-200 rounded-full h-2">
                          <div class="bg-yellow-600 h-2 rounded-full" :style="{ width: getRsvpPercentage('interested') + '%' }"></div>
                        </div>
                        <span class="text-xs font-medium text-gray-900">{{ eventAnalytics.rsvp_interested || 0 }}</span>
                      </div>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-gray-600">Declined</span>
                      <div class="flex items-center space-x-2">
                        <div class="w-16 bg-gray-200 rounded-full h-2">
                          <div class="bg-red-600 h-2 rounded-full" :style="{ width: getRsvpPercentage('declined') + '%' }"></div>
                        </div>
                        <span class="text-xs font-medium text-gray-900">{{ eventAnalytics.rsvp_declined || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Registration Trends -->
                <div v-if="eventAnalytics.registration_trends">
                  <h5 class="text-xs font-medium text-gray-700 mb-2">Registration Trends</h5>
                  <div class="text-xs text-gray-600">
                    <div class="flex justify-between">
                      <span>Last 7 days: {{ eventAnalytics.registration_trends.last_7_days || 0 }}</span>
                      <span>Last 30 days: {{ eventAnalytics.registration_trends.last_30_days || 0 }}</span>
                    </div>
                  </div>
                </div>

                <!-- Source Analysis -->
                <div v-if="eventAnalytics.source_analysis">
                  <h5 class="text-xs font-medium text-gray-700 mb-2">Registration Sources</h5>
                  <div class="space-y-1">
                    <div v-for="source in eventAnalytics.source_analysis" :key="source.source" class="flex justify-between items-center">
                      <span class="text-xs text-gray-600">{{ source.source }}</span>
                      <span class="text-xs font-medium text-gray-900">{{ source.count }}</span>
                    </div>
                  </div>
                </div>

                <!-- Top Attendees -->
                <div v-if="eventAnalytics.top_attendees && eventAnalytics.top_attendees.length > 0">
                  <h5 class="text-xs font-medium text-gray-700 mb-2">Top Attendees</h5>
                  <div class="space-y-1">
                    <div v-for="attendee in eventAnalytics.top_attendees.slice(0, 3)" :key="attendee.id" class="flex justify-between items-center">
                      <span class="text-xs text-gray-600">{{ attendee.name }}</span>
                      <span class="text-xs font-medium text-gray-900">{{ attendee.company || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <!-- Attendees Section -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-sm font-medium text-gray-900">{{ $t('marketing.events.details_drawer.attendees') }}</h4>
            <button
              @click="openRegistrationModal(selectedEvent)"
              class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
            >
              Register Attendee
            </button>
          </div>
          
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

          <!-- Loading State -->
          <div v-if="attendeesLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-sm text-gray-600">Loading attendees...</p>
          </div>

          <!-- Attendees List -->
          <div v-else-if="eventAttendees.length > 0" class="space-y-3">
            <div
              v-for="attendee in eventAttendees"
              :key="attendee.id"
              class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-gray-900 truncate">{{ attendee.name }}</div>
                <div class="text-sm text-gray-600 truncate">{{ attendee.email }}</div>
                <div class="text-xs text-gray-500 truncate">{{ attendee.company }}</div>
                <div v-if="attendee.rsvp_at" class="text-xs text-gray-400 mt-1">
                  Registered: {{ formatDateTime(attendee.rsvp_at) }}
                </div>
              </div>
              <div class="flex items-center space-x-2 ml-3">
                <span :class="getRsvpStatusColor(attendee.rsvp_status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap">
                  {{ attendee.rsvp_status }}
                </span>
                <button
                  v-if="!attendee.attended && attendee.rsvp_status === 'going'"
                  @click="markAttended(attendee)"
                  class="text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 rounded hover:bg-green-50 transition-colors"
                >
                  Mark Attended
                </button>
                <span v-else-if="attendee.attended" class="text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded">
                  ✓ Attended
                </span>
              </div>
            </div>
          </div>
          
          <!-- No Attendees State -->
          <div v-else class="text-center py-8">
            <div class="text-gray-400 mb-2">
              <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p class="text-sm text-gray-500">No attendees found</p>
            <p class="text-xs text-gray-400 mt-1">
              {{ attendeeFilter ? `No ${attendeeFilter} RSVPs` : 'No one has registered yet' }}
            </p>
          </div>
        </div>

        <!-- Bottom Padding -->
        <div class="pb-6"></div>
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

    <!-- Public Registration Modal -->
    <div
      v-if="showRegistrationModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeRegistrationModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Register for Event</h3>
          </div>
          <div class="p-6">
            <div v-if="selectedEvent" class="mb-4">
              <h4 class="font-medium text-gray-900">{{ selectedEvent.name }}</h4>
              <p class="text-sm text-gray-600">{{ formatDateTime(selectedEvent.scheduled_at) }}</p>
            </div>
            <form @submit.prevent="registerForEvent">
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      v-model="registrationForm.first_name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      v-model="registrationForm.last_name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    v-model="registrationForm.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    v-model="registrationForm.company"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    v-model="registrationForm.phone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">RSVP Status *</label>
                  <select
                    v-model="registrationForm.rsvp_status"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select status</option>
                    <option value="going">Going</option>
                    <option value="interested">Interested</option>
                    <option value="declined">Declined</option>
                    <option value="maybe">Maybe</option>
                  </select>
                </div>
                
                <!-- Consent Checkbox -->
                <div>
                  <label class="flex items-start space-x-3">
                    <input
                      v-model="registrationForm.agreed_to_communications"
                      type="checkbox"
                      required
                      class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="text-sm text-gray-700">
                      I agree to receive event updates and communications. *
                    </span>
                  </label>
                </div>
              </div>
              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  @click="closeRegistrationModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="registering"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
                >
                  {{ registering ? 'Registering...' : 'Register' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- QR Code Modal -->
    <div
      v-if="showQRModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeQRModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Event QR Code</h3>
              <button
                @click="closeQRModal"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6 text-center">
            <!-- Loading State -->
            <div v-if="qrCodeLoading" class="py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p class="mt-4 text-gray-600">Generating QR Code...</p>
            </div>
            
            <!-- Error State -->
            <div v-else-if="qrCodeError" class="py-8">
              <div class="text-red-600 mb-4">
                <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Failed to Generate QR Code</h3>
              <p class="text-gray-600 mb-4">Unable to generate QR code. Please try again.</p>
              <button
                @click="showQRCode"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
            
            <!-- QR Code Display -->
            <div v-else-if="qrCodeUrl && qrPublicUrl" class="py-4">
              <!-- QR Code Image -->
              <div class="relative">
                <img 
                  :src="qrCodeUrl" 
                  alt="Event QR Code" 
                  class="mx-auto max-w-full h-auto border border-gray-200 rounded-lg"
                  @error="handleQRCodeImageError"
                />
                <!-- Fallback indicator -->
                <div v-if="qrCodeFallback" class="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Fallback
                </div>
              </div>
              
              <!-- Instructions -->
              <p class="mt-4 text-sm text-gray-600">Scan this QR code to register for the event</p>
              
              <!-- Public URL Display -->
              <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-medium text-gray-500 mb-1">Public URL:</p>
                    <p class="text-sm text-gray-900 truncate">{{ qrPublicUrl }}</p>
                  </div>
                  <button
                    @click="copyPublicUrlToClipboard"
                    class="ml-3 flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                    title="Copy URL to clipboard"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Download Button -->
              <button
                @click="downloadQRCode"
                class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Download QR Code
              </button>
            </div>
            
            <!-- No Data State -->
            <div v-else class="py-8">
              <div class="text-gray-400 mb-4">
                <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <p class="text-gray-600">No QR code data available</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Options Modal -->
    <div
      v-if="showCalendarModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeCalendarModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Add to Calendar</h3>
              <button
                @click="closeCalendarModal"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6">
            <div v-if="calendarLinksLoading" class="py-8 text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p class="mt-4 text-gray-600">Loading calendar options...</p>
            </div>
            <div v-else-if="calendarLinks" class="space-y-3">
              <!-- Google Calendar -->
              <button
                v-if="calendarLinks.google"
                @click="openCalendarLink(calendarLinks.google)"
                class="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-md font-medium transition-colors"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Add to Google Calendar</span>
              </button>
              
              <!-- Outlook Calendar -->
              <button
                v-if="calendarLinks.outlook"
                @click="openCalendarLink(calendarLinks.outlook)"
                class="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-medium transition-colors"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7.5 21H4.5C3.67 21 3 20.33 3 19.5V4.5C3 3.67 3.67 3 4.5 3H7.5C8.33 3 9 3.67 9 4.5V19.5C9 20.33 8.33 21 7.5 21ZM19.5 21H16.5C15.67 21 15 20.33 15 19.5V4.5C15 3.67 15.67 3 16.5 3H19.5C20.33 3 21 3.67 21 4.5V19.5C21 20.33 20.33 21 19.5 21Z"/>
                </svg>
                <span>Add to Outlook</span>
              </button>
              
              <!-- iCal Download -->
              <button
                v-if="calendarLinks.ical"
                @click="downloadICalFile"
                class="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md font-medium transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Download iCal File</span>
              </button>
            </div>
            <div v-else class="py-8 text-center">
              <p class="text-gray-600">Failed to load calendar options</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Send Invitations Modal -->
    <div
      v-if="showInvitationModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeInvitationModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Send Event Invitations</h3>
              <button
                @click="closeInvitationModal"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6">
            <form @submit.prevent="sendInvitations">
              <div class="space-y-4">
                <!-- Email Template -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email Template</label>
                  <select
                    v-model="invitationForm.template_id"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select template</option>
                    <option v-for="template in emailTemplates" :key="template.id" :value="template.id">
                      {{ template.name || template.title || `Template ${template.id}` }}
                    </option>
                  </select>
                  <p v-if="emailTemplates.length === 0" class="mt-1 text-xs text-gray-500">
                    No templates available. Please create templates first.
                  </p>
                </div>

                <!-- Recipients -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                  <div class="border border-gray-300 rounded-md p-3 min-h-[100px] max-h-[200px] overflow-y-auto">
                    <div v-if="selectedContacts.length === 0" class="text-gray-500 text-sm">
                      No contacts selected. Click "Add Contacts" to select recipients.
                    </div>
                    <div v-else class="space-y-2">
                      <div
                        v-for="contact in selectedContacts"
                        :key="contact.id"
                        class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                      >
                        <div>
                          <div class="text-sm font-medium">
                            {{ contact.name || contact.first_name + ' ' + contact.last_name || 'Unknown Contact' }}
                          </div>
                          <div class="text-xs text-gray-500">
                            {{ contact.email || 'No email provided' }}
                          </div>
                        </div>
                        <button
                          @click="removeContact(contact.id)"
                          class="text-red-600 hover:text-red-800"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="openContactSelector"
                    class="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + Add Contacts
                  </button>
                </div>

                <!-- Custom Message -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Custom Message (Optional)</label>
                  <textarea
                    v-model="invitationForm.custom_message"
                    rows="3"
                    placeholder="Add a personal message to your invitation..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>

              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  @click="closeInvitationModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="sendingInvitations"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
                >
                  {{ sendingInvitations ? 'Sending...' : 'Send Invitations' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Selector Modal -->
    <div
      v-if="showContactSelector"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeContactSelector"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Select Contacts</h3>
              <button
                @click="closeContactSelector"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6">
            <div v-if="contactsLoading" class="py-8 text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p class="mt-4 text-gray-600">Loading contacts...</p>
            </div>
            <div v-else class="space-y-2 max-h-[400px] overflow-y-auto">
              <div v-if="availableContacts.length === 0" class="text-center py-8">
                <div class="text-gray-400 mb-2">
                  <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p class="text-sm text-gray-500">No contacts available</p>
                <p class="text-xs text-gray-400 mt-1">Please add contacts to your CRM first</p>
              </div>
              <div
                v-for="contact in availableContacts"
                :key="contact.id"
                class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div class="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    :checked="isContactSelected(contact.id)"
                    @change="toggleContact(contact)"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div class="text-sm font-medium">
                      {{ contact.name || contact.first_name + ' ' + contact.last_name || 'Unknown Contact' }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ contact.email || 'No email provided' }}
                    </div>
                    <div v-if="contact.company" class="text-xs text-gray-400">
                      {{ contact.company }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button
                @click="closeContactSelector"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                @click="confirmContactSelection"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Add Selected ({{ tempSelectedContacts.length }})
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
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Configure dayjs plugins
dayjs.extend(utc)
dayjs.extend(timezone)

const { t } = useI18n()

// Reactive state
const loading = ref(false)
const error = ref(null)
const events = ref([])
const eventTypes = ref([])
const selectedEvent = ref(null)
const eventAttendees = ref([])
const attendeeFilter = ref('')
const attendeesLoading = ref(false)
const eventsAnalytics = ref(null)
const analyticsLoading = ref(false)

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showConfirmModal = ref(false)
const showRegistrationModal = ref(false)
const showQRModal = ref(false)
const showCalendarModal = ref(false)
const showInvitationModal = ref(false)
const showContactSelector = ref(false)
const creating = ref(false)
const updating = ref(false)
const registering = ref(false)
const sendingInvitations = ref(false)
const calendarLinksLoading = ref(false)
const contactsLoading = ref(false)
const showDetailedAnalytics = ref(false)

// Filters and tabs
const activeTab = ref('upcoming')
const selectedType = ref('')
const tabs = ref([
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'all', label: 'All' },
  { id: 'analytics', label: 'Analytics' }
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

const editForm = ref({
  id: null,
  name: '',
  description: '',
  type: '',
  scheduled_at: '',
  duration: 60,
  location: '',
  max_attendees: 100
})

const registrationForm = ref({
  first_name: '',
  last_name: '',
  email: '',
  company: '',
  phone: '',
  rsvp_status: '',
  agreed_to_communications: false
})

// New form states
const invitationForm = ref({
  template_id: '',
  custom_message: ''
})

// New data states
const eventAnalytics = ref(null)
const qrCodeUrl = ref(null)
const qrPublicUrl = ref(null) // Store the public URL from backend response
const qrCodeLoading = ref(false)
const qrCodeError = ref(false)
const qrCodeFallback = ref(false) // Track if we're using fallback QR generation
const calendarLinks = ref(null)
const emailTemplates = ref([])
const availableContacts = ref([])
const selectedContacts = ref([])
const tempSelectedContacts = ref([])

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
  if (activeTab.value === 'analytics') {
    await loadEventsAnalytics()
    return
  }
  
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
    console.error('Error loading events:', err)
    
    // Handle different error types
    if (err.response?.status === 401) {
      error.value = 'Session expired. Please log in again.'
      showError('Session expired. Please log in again.')
    } else if (err.response?.status === 422) {
      error.value = 'Invalid request parameters. Please check your filters.'
      showError('Invalid request parameters. Please check your filters.')
    } else if (err.response?.status === 500) {
      error.value = 'Server error. Please try again later.'
      showError('Server error. Please try again later.')
    } else {
    error.value = err.message || 'Failed to load events'
    showError(error.value)
    }
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
    // Use fallback event types if API fails
    eventTypes.value = [
      { id: 'webinar', name: 'Webinar', description: 'Online presentation or training session' },
      { id: 'conference', name: 'Conference', description: 'Large-scale professional gathering' },
      { id: 'workshop', name: 'Workshop', description: 'Interactive training or learning session' },
      { id: 'demo', name: 'Demo', description: 'Product demonstration or showcase' },
      { id: 'meeting', name: 'Meeting', description: 'Business or team meeting' },
      { id: 'networking', name: 'Networking', description: 'Professional networking event' },
      { id: 'training', name: 'Training', description: 'Educational or skill development session' }
    ]
  }
}

const loadEventAttendees = async () => {
  if (!selectedEvent.value) return
  
  attendeesLoading.value = true
  try {
    const params = {}
    if (attendeeFilter.value) {
      params.rsvp_status = attendeeFilter.value
    }
    
    const response = await eventsService.getEventAttendees(selectedEvent.value.id, params)
    const attendees = response.data || []
    
    // Process attendee data to handle backend structure
    eventAttendees.value = attendees.map(attendee => {
      // Extract contact information from the contact object if available
      const contact = attendee.contact
      let name = 'Unknown'
      let email = 'No email provided'
      let company = 'No company provided'
      
      if (contact) {
        // Use contact object data
        name = contact.first_name && contact.last_name 
          ? `${contact.first_name} ${contact.last_name}`.trim()
          : contact.first_name || contact.last_name || 'Unknown'
        email = contact.email || 'No email provided'
        company = contact.company || 'No company provided'
      } else {
        // Fallback to direct fields or contact_id
        name = attendee.name || 
               (attendee.first_name && attendee.last_name ? `${attendee.first_name} ${attendee.last_name}`.trim() : null) ||
               `Contact ${attendee.contact_id}`
        email = attendee.email || 'No email provided'
        company = attendee.company || 'No company provided'
      }
      
      return {
        id: attendee.id,
        name: name,
        email: email,
        company: company,
        rsvp_status: attendee.rsvp_status,
        attended: attendee.attended || false,
        rsvp_at: attendee.rsvp_at,
        attended_at: attendee.attended_at,
        contact_id: attendee.contact_id,
        metadata: attendee.metadata,
        contact: contact
      }
    })
  } catch (err) {
    console.error('Failed to load event attendees:', err)
    eventAttendees.value = []
  } finally {
    attendeesLoading.value = false
  }
}

const loadEventsAnalytics = async () => {
  analyticsLoading.value = true
  eventsAnalytics.value = null
  
  try {
    const response = await eventsService.getEventsAnalytics()
    eventsAnalytics.value = response.data
  } catch (err) {
    console.error('Error loading events analytics:', err)
    
    if (err.response?.status === 401) {
      showError('Session expired. Please log in again.')
    } else if (err.response?.status === 500) {
      showError('Server error. Please try again later.')
    } else {
    showError(err.message || 'Failed to fetch events analytics')
    }
  } finally {
    analyticsLoading.value = false
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
    // Convert datetime-local to UTC ISO string
    let scheduledAt = createForm.value.scheduled_at
    if (scheduledAt) {
      // datetime-local gives us YYYY-MM-DDTHH:mm format
      // We need to convert it to UTC ISO string
      const localDateTime = dayjs(scheduledAt)
      scheduledAt = localDateTime.utc().toISOString()
    }
    
    // Prepare the event data with settings
    const eventData = {
      name: createForm.value.name,
      description: createForm.value.description,
      type: createForm.value.type,
      scheduled_at: scheduledAt,
      duration: parseInt(createForm.value.duration),
      location: createForm.value.location,
      settings: {
        max_attendees: parseInt(createForm.value.max_attendees),
        recording_enabled: false,
        auto_reminder: true,
        waiting_room: false
      }
    }
    
    const response = await eventsService.createEvent(eventData)
    showSuccess('Event created successfully')
    closeCreateModal()
    loadEvents()
  } catch (err) {
    console.error('Error creating event:', err)
    
    if (err.response?.status === 401) {
      showError('Session expired. Please log in again.')
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
    showError(err.message || 'Failed to create event')
    }
  } finally {
    creating.value = false
  }
}

const editEvent = (event) => {
  // Populate edit form with event data
  editForm.value = {
    id: event.id,
    name: event.name,
    description: event.description,
    type: event.type,
    scheduled_at: event.scheduled_at ? dayjs.utc(event.scheduled_at).local().format('YYYY-MM-DDTHH:mm') : '',
    duration: event.duration || 60,
    location: event.location || '',
    max_attendees: event.settings?.max_attendees || 100
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  updating.value = false
  editForm.value = {
    id: null,
    name: '',
    description: '',
    type: '',
    scheduled_at: '',
    duration: 60,
    location: '',
    max_attendees: 100
  }
}

const updateEvent = async () => {
  updating.value = true
  
  try {
    // Convert datetime-local to UTC ISO string
    let scheduledAt = editForm.value.scheduled_at
    if (scheduledAt) {
      // datetime-local gives us YYYY-MM-DDTHH:mm format
      // We need to convert it to UTC ISO string
      const localDateTime = dayjs(scheduledAt)
      scheduledAt = localDateTime.utc().toISOString()
    }
    
    // Prepare the event data with settings
    const eventData = {
      name: editForm.value.name,
      description: editForm.value.description,
      type: editForm.value.type,
      scheduled_at: scheduledAt,
      duration: parseInt(editForm.value.duration),
      location: editForm.value.location,
      settings: {
        max_attendees: parseInt(editForm.value.max_attendees),
        recording_enabled: false,
        auto_reminder: true,
        waiting_room: false
      }
    }
    
    await eventsService.updateEvent(editForm.value.id, eventData)
    showSuccess('Event updated successfully')
    closeEditModal()
    loadEvents()
  } catch (err) {
    console.error('Error updating event:', err)
    
    if (err.response?.status === 401) {
      showError('Session expired. Please log in again.')
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
      showError(err.message || 'Failed to update event')
    }
  } finally {
    updating.value = false
  }
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
  eventAnalytics.value = null
  await Promise.all([
    loadEventAttendees(),
    loadEventAnalytics()
  ])
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

const joinZoomMeeting = (event) => {
  // Try zoom_join_url first, then fall back to location
  const zoomUrl = event.zoom_join_url || event.location
  
  if (zoomUrl && (zoomUrl.includes('zoom.us') || zoomUrl.includes('zoom.com'))) {
    window.open(zoomUrl, '_blank')
  } else {
    showError('Zoom meeting link not available')
  }
}

const openRegistrationModal = (event) => {
  selectedEvent.value = event
  showRegistrationModal.value = true
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

const closeRegistrationModal = () => {
  showRegistrationModal.value = false
  registering.value = false
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

const registerForEvent = async () => {
  if (!selectedEvent.value) return
  
  registering.value = true
  
  try {
    await eventsService.publicRegister(selectedEvent.value.id, registrationForm.value)
    showSuccess('Successfully registered for the event!')
    closeRegistrationModal()
    // Refresh event attendees if the details drawer is open
    if (selectedEvent.value) {
      await loadEventAttendees()
    }
    // Refresh main events list to update counts
    loadEvents()
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
    registering.value = false
  }
}

// New methods for enhanced features
const copyPublicLink = async () => {
  if (!selectedEvent.value) return
  
  try {
    // Get the backend public URL to extract the event ID
    const response = await eventsService.getEventShareLink(selectedEvent.value.id)
    const backendPublicUrl = response.data.public_url // e.g., http://127.0.0.1:8000/api/public/events/7

    // Extract the event ID from the backend public URL
    const eventIdMatch = backendPublicUrl.match(/\/public\/events\/(\d+)/)
    if (!eventIdMatch || !eventIdMatch[1]) {
      showError('Could not extract event ID from public URL.')
      return
    }
    const eventId = eventIdMatch[1]

    // Construct the frontend public event page URL
    const frontendBaseUrl = window.location.origin // e.g., http://localhost:5173
    const frontendPublicEventUrl = `${frontendBaseUrl}/public/events/${eventId}`
    
    // Copy to clipboard
    await navigator.clipboard.writeText(frontendPublicEventUrl)
    showSuccess('Public link copied to clipboard!')
  } catch (err) {
    console.error('Error copying public link:', err)
    showError('Failed to copy public link')
  }
}

const openPublicLink = async () => {
  if (!selectedEvent.value) return
  
  try {
    // Get the backend public URL to extract the event ID
    const response = await eventsService.getEventShareLink(selectedEvent.value.id)
    const backendPublicUrl = response.data.public_url

    // Extract the event ID from the backend public URL
    const eventIdMatch = backendPublicUrl.match(/\/public\/events\/(\d+)/)
    if (!eventIdMatch || !eventIdMatch[1]) {
      showError('Could not extract event ID from public URL.')
      return
    }
    const eventId = eventIdMatch[1]

    // Construct the frontend public event page URL
    const frontendBaseUrl = window.location.origin
    const frontendPublicEventUrl = `${frontendBaseUrl}/public/events/${eventId}`
    
    // Open in new tab
    window.open(frontendPublicEventUrl, '_blank')
  } catch (err) {
    console.error('Error opening public link:', err)
    showError('Failed to open public link')
  }
}

const showQRCode = async () => {
  if (!selectedEvent.value) return
  
  showQRModal.value = true
  qrCodeLoading.value = true
  qrCodeError.value = false
  qrCodeFallback.value = false
  qrCodeUrl.value = null
  qrPublicUrl.value = null
  
  try {
    const response = await eventsService.getEventQRCode(selectedEvent.value.id)
    
    // Use the exact URLs from backend response - NO URL construction!
    if (response.data) {
      // Use backend public URL directly, but clean it first
      if (response.data.public_url) {
        const cleanUrl = cleanAndValidateUrl(response.data.public_url)
        if (cleanUrl) {
          qrPublicUrl.value = cleanUrl
        } else {
          qrCodeError.value = true
          showError('Invalid public URL received from server. Please reload and try again.')
          return
        }
      } else {
        qrCodeError.value = true
        showError('Public URL not found. Please reload and try again.')
        return
      }
      
      // Use backend QR code URL directly
      if (response.data.qr_code && response.data.qr_code.url) {
        qrCodeUrl.value = response.data.qr_code.url
      } else {
        // Fallback: generate QR code locally if backend doesn't provide URL
        await generateFallbackQRCode()
      }
    } else {
      throw new Error('Invalid QR code response format')
    }
  } catch (err) {
    console.error('Error fetching QR code:', err)
    qrCodeError.value = true
    showError('Failed to generate QR code')
  } finally {
    qrCodeLoading.value = false
  }
}

const closeQRModal = () => {
  showQRModal.value = false
  qrCodeUrl.value = null
  qrPublicUrl.value = null
  qrCodeError.value = false
  qrCodeFallback.value = false
}

// Clean and validate URL
const cleanAndValidateUrl = (url) => {
  if (!url) return null
  
  try {
    // Remove any invalid characters that might cause URL issues
    let cleanUrl = url.trim()
    
    // Fix common URL issues
    cleanUrl = cleanUrl.replace(/localhost:(\d+)[A-Za-z]/g, 'localhost:$1') // Remove extra letters after port
    cleanUrl = cleanUrl.replace(/127\.0\.0\.1:(\d+)[A-Za-z]/g, '127.0.0.1:$1') // Remove extra letters after port
    
    // Validate the URL
    new URL(cleanUrl)
    return cleanUrl
  } catch (err) {
    console.warn('Invalid URL detected, attempting to fix:', url)
    
    // Try to fix common issues
    try {
      // Extract port and fix common patterns
      const portMatch = url.match(/(localhost|127\.0\.0\.1):(\d+)[A-Za-z]?/)
      if (portMatch) {
        const fixedUrl = url.replace(portMatch[0], `${portMatch[1]}:${portMatch[2]}`)
        new URL(fixedUrl)
        return fixedUrl
      }
    } catch (fixErr) {
      console.error('Could not fix URL:', url)
    }
    
    return null
  }
}

// Generate fallback QR code using Google Charts API directly
const generateFallbackQRCode = async () => {
  if (!qrPublicUrl.value) return
  
  try {
    // Clean and validate the URL first
    const cleanUrl = cleanAndValidateUrl(qrPublicUrl.value)
    if (!cleanUrl) {
      console.error('Invalid public URL, cannot generate QR code:', qrPublicUrl.value)
      qrCodeError.value = true
      return
    }
    
    // Use Google Charts API directly as fallback
    const fallbackQrUrl = `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(cleanUrl)}`
    qrCodeUrl.value = fallbackQrUrl
    qrCodeFallback.value = true
  } catch (err) {
    console.error('Error generating fallback QR code:', err)
    qrCodeError.value = true
  }
}

// Handle QR code image load error
const handleQRCodeImageError = async () => {
  console.warn('QR code image failed to load, generating fallback...')
  qrCodeFallback.value = true
  await generateFallbackQRCode()
}

// Copy public URL to clipboard
const copyPublicUrlToClipboard = async () => {
  if (!qrPublicUrl.value) {
    showError('No public URL available to copy')
    return
  }
  
  try {
    // Use the cleaned URL for copying
    const cleanUrl = cleanAndValidateUrl(qrPublicUrl.value)
    if (!cleanUrl) {
      showError('Invalid URL cannot be copied')
      return
    }
    
    await navigator.clipboard.writeText(cleanUrl)
    showSuccess('Public URL copied to clipboard!')
  } catch (err) {
    console.error('Error copying to clipboard:', err)
    showError('Failed to copy URL to clipboard')
  }
}

const downloadQRCode = () => {
  if (qrCodeUrl.value) {
    const link = document.createElement('a')
    link.href = qrCodeUrl.value
    link.download = `event-${selectedEvent.value.id}-qr-code.png`
    link.click()
  }
}

const showCalendarOptions = async () => {
  if (!selectedEvent.value) return
  
  showCalendarModal.value = true
  calendarLinksLoading.value = true
  calendarLinks.value = null
  
  try {
    const response = await eventsService.getEventCalendarLinks(selectedEvent.value.id)
    const backendData = response.data
    
    // Process the backend response to extract calendar URLs
    if (backendData) {
      calendarLinks.value = {
        google: backendData.google_calendar_url || backendData.calendar_data?.google_url,
        outlook: backendData.outlook_calendar_url || backendData.calendar_data?.outlook_url,
        ical: backendData.ical_download_url || backendData.calendar_data?.ical_data
      }
      
      // Log for debugging
      console.log('Calendar links loaded:', calendarLinks.value)
    } else {
      throw new Error('No calendar data received from backend')
    }
  } catch (err) {
    console.error('Error fetching calendar links:', err)
    showError('Failed to load calendar options')
  } finally {
    calendarLinksLoading.value = false
  }
}

const closeCalendarModal = () => {
  showCalendarModal.value = false
  calendarLinks.value = null
}

const openCalendarLink = (url) => {
  if (url) {
    window.open(url, '_blank')
    closeCalendarModal()
  } else {
    showError('Calendar link not available')
  }
}

// Download iCal file
const downloadICalFile = () => {
  if (!calendarLinks.value?.ical) {
    showError('iCal file not available')
    return
  }
  
  try {
    // If it's a URL, open it directly
    if (calendarLinks.value.ical.startsWith('http')) {
      window.open(calendarLinks.value.ical, '_blank')
    } else {
      // If it's iCal data, create a blob and download
      const blob = new Blob([calendarLinks.value.ical], { type: 'text/calendar' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `event-${selectedEvent.value?.id || 'calendar'}.ics`
      link.click()
      URL.revokeObjectURL(url)
    }
    closeCalendarModal()
  } catch (err) {
    console.error('Error downloading iCal file:', err)
    showError('Failed to download iCal file')
  }
}

const openInvitationModal = async () => {
  if (!selectedEvent.value) return
  
  showInvitationModal.value = true
  invitationForm.value = {
    template_id: '',
    custom_message: ''
  }
  selectedContacts.value = []
  
  // Load email templates from API
  await loadEmailTemplates()
}

const closeInvitationModal = () => {
  showInvitationModal.value = false
  invitationForm.value = {
    template_id: '',
    custom_message: ''
  }
  selectedContacts.value = []
}

// Load email templates from API
const loadEmailTemplates = async () => {
  try {
    const response = await eventsService.getEmailTemplates()
    emailTemplates.value = response.data || []
  } catch (err) {
    console.error('Error loading email templates:', err)
    showError('Failed to load email templates')
    // Fallback to empty array
    emailTemplates.value = []
  }
}

const openContactSelector = async () => {
  showContactSelector.value = true
  tempSelectedContacts.value = [...selectedContacts.value]
  contactsLoading.value = true
  
  try {
    // Load contacts from API
    const response = await eventsService.getContacts()
    availableContacts.value = response.data || []
  } catch (err) {
    console.error('Error loading contacts:', err)
    showError('Failed to load contacts')
    // Fallback to empty array
    availableContacts.value = []
  } finally {
    contactsLoading.value = false
  }
}

const closeContactSelector = () => {
  showContactSelector.value = false
  tempSelectedContacts.value = []
}

const isContactSelected = (contactId) => {
  return tempSelectedContacts.value.some(contact => contact.id === contactId)
}

const toggleContact = (contact) => {
  const index = tempSelectedContacts.value.findIndex(c => c.id === contact.id)
  if (index > -1) {
    tempSelectedContacts.value.splice(index, 1)
  } else {
    tempSelectedContacts.value.push(contact)
  }
}

const confirmContactSelection = () => {
  selectedContacts.value = [...tempSelectedContacts.value]
  closeContactSelector()
}

const removeContact = (contactId) => {
  selectedContacts.value = selectedContacts.value.filter(c => c.id !== contactId)
}

const sendInvitations = async () => {
  if (!selectedEvent.value || selectedContacts.value.length === 0) {
    showError('Please select at least one contact')
    return
  }
  
  sendingInvitations.value = true
  
  try {
    const invitationData = {
      template_id: invitationForm.value.template_id,
      custom_message: invitationForm.value.custom_message,
      contact_ids: selectedContacts.value.map(c => c.id) // Changed from 'contacts' to 'contact_ids'
    }
    
    await eventsService.sendEventInvitations(selectedEvent.value.id, invitationData)
    showSuccess(`Invitations sent to ${selectedContacts.value.length} contacts!`)
    closeInvitationModal()
  } catch (err) {
    console.error('Error sending invitations:', err)
    
    if (err.response?.status === 401) {
      showError('Session expired. Please log in again.')
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
      showError(err.message || 'Failed to send invitations')
    }
  } finally {
    sendingInvitations.value = false
  }
}

const loadEventAnalytics = async () => {
  if (!selectedEvent.value) return
  
  try {
    const response = await eventsService.getEventAnalytics(selectedEvent.value.id)
    eventAnalytics.value = response.data
  } catch (err) {
    console.error('Error loading event analytics:', err)
    showError('Failed to load event analytics')
  }
}

const toggleAnalyticsView = () => {
  showDetailedAnalytics.value = !showDetailedAnalytics.value
}

const getRsvpPercentage = (status) => {
  if (!eventAnalytics.value) return 0
  
  const total = (eventAnalytics.value.rsvp_going || 0) + 
                (eventAnalytics.value.rsvp_interested || 0) + 
                (eventAnalytics.value.rsvp_declined || 0)
  
  if (total === 0) return 0
  
  const count = eventAnalytics.value[`rsvp_${status}`] || 0
  return Math.round((count / total) * 100)
}

const getPublicEventUrl = () => {
  // Use the public URL from backend response
  return qrPublicUrl.value || ''
}

// Generate frontend RSVP URL for email templates
const generateRSVPUrl = (eventId, status, contactId) => {
  const frontendBaseUrl = window.location.origin
  return `${frontendBaseUrl}/events/${eventId}/rsvp?status=${status}&contact_id=${contactId}`
}

// Get RSVP URLs for email templates (can be called from other components)
const getEventRSVPUrls = async (eventId) => {
  try {
    const frontendBaseUrl = window.location.origin
    return {
      going: `${frontendBaseUrl}/events/${eventId}/rsvp?status=going&contact_id={{contact_id}}`,
      interested: `${frontendBaseUrl}/events/${eventId}/rsvp?status=interested&contact_id={{contact_id}}`,
      declined: `${frontendBaseUrl}/events/${eventId}/rsvp?status=declined&contact_id={{contact_id}}`,
      maybe: `${frontendBaseUrl}/events/${eventId}/rsvp?status=maybe&contact_id={{contact_id}}`
    }
  } catch (err) {
    console.error('Error generating RSVP URLs:', err)
    return null
  }
}

// Helper methods
const getEventTypeColor = (type) => eventsHelpers.getEventTypeColor(type)
const getRsvpStatusColor = (status) => eventsHelpers.getRsvpStatusColor(status)
const formatDuration = (minutes) => eventsHelpers.formatDuration(minutes)

// Format numbers with commas for better readability
const formatNumber = (number) => {
  if (number === null || number === undefined) return '0'
  return Number(number).toLocaleString()
}

// Chart helper functions
const getTotalRsvps = () => {
  if (!eventsAnalytics.value?.rsvp_stats) return 0
  const stats = eventsAnalytics.value.rsvp_stats
  return (stats.going || 0) + (stats.interested || 0) + (stats.declined || 0)
}

const getRsvpPieChartData = (status) => {
  if (!eventsAnalytics.value?.rsvp_stats) return '0 251.2'
  const total = getTotalRsvps()
  if (total === 0) return '0 251.2'
  
  const value = eventsAnalytics.value.rsvp_stats[status] || 0
  const percentage = (value / total) * 100
  const circumference = 2 * Math.PI * 40 // radius = 40
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
  return strokeDasharray
}

const getRsvpPieChartOffset = (status) => {
  if (!eventsAnalytics.value?.rsvp_stats) return 0
  const total = getTotalRsvps()
  if (total === 0) return 0
  
  const stats = eventsAnalytics.value.rsvp_stats
  let offset = 0
  
  // Calculate offset based on previous segments
  if (status === 'interested') {
    const goingPercentage = ((stats.going || 0) / total) * 100
    const circumference = 2 * Math.PI * 40
    offset = -((goingPercentage / 100) * circumference)
  } else if (status === 'declined') {
    const goingPercentage = ((stats.going || 0) / total) * 100
    const interestedPercentage = ((stats.interested || 0) / total) * 100
    const circumference = 2 * Math.PI * 40
    offset = -(((goingPercentage + interestedPercentage) / 100) * circumference)
  }
  
  return offset
}

const getBarHeight = (count) => {
  const trends = getEnhancedTrendsData()
  const maxCount = Math.max(...Object.values(trends))
  if (maxCount === 0) return 0
  return Math.max((count / maxCount) * 200, 20) // Min height of 20px, max 200px
}

const formatMonthLabel = (monthString) => {
  if (!monthString) return ''
  const [year, month] = monthString.split('-')
  const date = new Date(year, month - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

// Enhanced chart helper functions
const getEnhancedTrendsData = () => {
  if (!eventsAnalytics.value?.monthly_trends) {
    // Generate realistic sample data for demonstration
    const currentDate = new Date()
    const trends = {}
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      // Generate realistic event counts (3-15 events per month)
      trends[monthKey] = Math.floor(Math.random() * 13) + 3
    }
    
    return trends
  }
  
  return eventsAnalytics.value.monthly_trends
}

const getTotalEventsInTrends = () => {
  const trends = getEnhancedTrendsData()
  return Object.values(trends).reduce((sum, count) => sum + count, 0)
}

const getMaxTrendValue = () => {
  const trends = getEnhancedTrendsData()
  const values = Object.values(trends)
  return values.length > 0 ? Math.max(...values) : 0
}

const getAverageTrendValue = () => {
  const trends = getEnhancedTrendsData()
  const values = Object.values(trends)
  if (values.length === 0) return 0
  const sum = values.reduce((sum, count) => sum + count, 0)
  return Math.round(sum / values.length)
}

const getTrendGrowth = () => {
  const trends = getEnhancedTrendsData()
  const values = Object.values(trends)
  if (values.length < 2) return 0
  
  const firstValue = values[0]
  const lastValue = values[values.length - 1]
  
  if (firstValue === 0) return lastValue > 0 ? 100 : 0
  
  return Math.round(((lastValue - firstValue) / firstValue) * 100)
}

// Enhanced time formatting with timezone conversion
const formatDateTime = (dateString) => {
  if (!dateString) return 'Not scheduled'
  
  try {
    // Parse the UTC datetime and convert to user's local timezone
    const localTime = dayjs.utc(dateString).local()
    
    // Format in a user-friendly way
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
  
  // If it's a Zoom meeting, show "Virtual" instead of the raw URL
  if (hasZoomMeeting(event)) {
    return 'Virtual'
  }
  
  // For other events, show the location or default to "Virtual"
  return event.location || 'Virtual'
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadEvents(),
    loadEventTypes(),
    loadEventsAnalytics()
  ])
})
</script>

<style scoped>
/* Smooth scrolling for all elements */
* {
  scroll-behavior: smooth;
}
</style>