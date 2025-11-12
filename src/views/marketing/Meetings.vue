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
                <span class="ml-4 text-sm font-medium text-gray-900">{{ $t('marketing.meetings.title') }}</span>
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
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('marketing.meetings.title') }}</h1>
          <p class="mt-2 text-lg text-gray-600">{{ $t('marketing.meetings.subtitle') }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <!-- Sync Buttons -->
          <button
            @click="syncGoogleCalendar"
            :disabled="syncingGoogle"
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {{ syncingGoogle ? $t('marketing.meetings.sync.syncing_google') : $t('marketing.meetings.sync.sync_google') }}
          </button>
          <button
            @click="syncOutlookCalendar"
            :disabled="syncingOutlook"
            class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {{ syncingOutlook ? $t('marketing.meetings.sync.syncing_outlook') : $t('marketing.meetings.sync.sync_outlook') }}
          </button>
          <!-- Create Meeting Button -->
          <button
            @click="openCreateModal"
            class="bg-blue-900 hover:bg-blue-900 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.meetings.create_modal.title') }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">{{ $t('marketing.meetings.loading') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.meetings.error') }}</h3>
        <button
          @click="loadMeetings"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {{ $t('common.marketing_overview.retry_button') }}
        </button>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- Meeting Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Scheduled -->
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
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.meetings.stats.scheduled') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ scheduledCount }}</p>
                <p class="text-sm text-green-600">+8 this week</p>
              </div>
            </div>
          </div>

          <!-- Completed -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.meetings.stats.completed') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ completedCount }}</p>
                <p class="text-sm text-green-600">+15 this week</p>
              </div>
            </div>
          </div>

          <!-- Cancelled -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.meetings.stats.cancelled') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ cancelledCount }}</p>
                <p class="text-sm text-red-600">+3 this week</p>
              </div>
            </div>
          </div>

          <!-- No Shows -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">{{ $t('marketing.meetings.stats.no_shows') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ noShowCount }}</p>
                <p class="text-sm text-red-600">+2 this week</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters Row -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.meetings.filters.status') }}</label>
              <select
                v-model="filters.status"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{{ $t('marketing.meetings.filters.select_status') }}</option>
                <option v-for="status in meetingStatuses" :key="status.id" :value="status.id">
                  {{ status.name }}
                </option>
              </select>
            </div>

            <!-- Provider Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.meetings.filters.provider') }}</label>
              <select
                v-model="filters.provider"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{{ $t('marketing.meetings.filters.select_provider') }}</option>
                <option v-for="provider in meetingProviders" :key="provider.id" :value="provider.id">
                  {{ provider.name }}
                </option>
              </select>
            </div>

            <!-- Date Range Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.meetings.filters.date_range') }}</label>
              <select
                v-model="filters.dateRange"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{{ $t('marketing.meetings.filters.all_meetings') }}</option>
                <option value="upcoming">{{ $t('marketing.meetings.filters.upcoming') }}</option>
                <option value="today">{{ $t('marketing.meetings.filters.today') }}</option>
                <option value="this_week">{{ $t('marketing.meetings.filters.this_week') }}</option>
                <option value="this_month">{{ $t('marketing.meetings.filters.this_month') }}</option>
              </select>
            </div>

            <!-- My Meetings Toggle -->
            <div class="flex items-center">
              <label class="flex items-center">
                <input
                  v-model="filters.myMeetings"
                  @change="applyFilters"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm font-medium text-gray-700">{{ $t('marketing.meetings.filters.my_meetings') }}</span>
              </label>
            </div>

            <!-- Clear Filters -->
            <div class="flex items-end">
              <button
                @click="clearFilters"
                class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Meetings Table -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Meetings</h3>
          </div>

          <!-- Empty State -->
          <div v-if="filteredMeetings.length === 0" class="p-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.meetings.empty_state.title') }}</h3>
            <p class="text-gray-600 mb-6">{{ $t('marketing.meetings.empty_state.message') }}</p>
            <button
              @click="openCreateModal"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              {{ $t('marketing.meetings.empty_state.create_meeting') }}
            </button>
          </div>

          <!-- Meetings Table -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.meetings.table.title') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.meetings.table.contact') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.meetings.table.when') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.meetings.table.duration') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.meetings.table.status') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.meetings.table.provider') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('marketing.meetings.table.actions') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="meeting in filteredMeetings"
                  :key="meeting.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ meeting.title || 'Untitled Meeting' }}</div>
                    <div class="text-sm text-gray-500">{{ meeting.description || 'No description' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ meeting.contact?.full_name || meeting.contact?.name || 'Unknown Contact' }}</div>
                    <div class="text-sm text-gray-500">{{ meeting.contact?.email || 'No email' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ formatDateTime(meeting.scheduled_at || meeting.start_time) }}</div>
                    <div class="text-sm text-gray-500">{{ getRelativeTime(meeting.scheduled_at || meeting.start_time) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ calculateDuration(meeting.scheduled_at || meeting.start_time, meeting.end_time) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusColor(meeting.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ meeting.status || 'Unknown' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div :class="getProviderColor(meeting.integration_provider || meeting.provider)" class="w-3 h-3 rounded-full mr-2"></div>
                      <span class="text-sm text-gray-900">{{ getProviderName(meeting.integration_provider || meeting.provider) }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex gap-x-2">
                      <button
                        v-if="meeting.meeting_link || meeting.integration_data?.join_url"
                        @click="openMeetingLink(meeting.meeting_link || meeting.integration_data?.join_url)"
                        class="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                      >
                        Join
                      </button>
                      <button
                        @click="viewMeeting(meeting)"
                        class="px-3 py-1 text-xs font-medium text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                      >
                        View
                      </button>
                      <button
                        @click="editMeeting(meeting)"
                        class="px-3 py-1 text-xs font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        @click="deleteMeeting(meeting)"
                        class="px-3 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Meeting Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeCreateModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.meetings.create_modal.title') }}</h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="createMeeting">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.meetings.create_modal.meeting_title') }}</label>
                  <input
                    v-model="meetingForm.title"
                    type="text"
                    required
                    :placeholder="$t('marketing.meetings.create_modal.enter_title')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.meetings.create_modal.description') }}</label>
                  <textarea
                    v-model="meetingForm.description"
                    :placeholder="$t('marketing.meetings.create_modal.enter_description')"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.meetings.create_modal.start_time') }}</label>
                    <input
                      v-model="meetingForm.start_time"
                      type="datetime-local"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.meetings.create_modal.end_time') }}</label>
                    <input
                      v-model="meetingForm.end_time"
                      type="datetime-local"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.meetings.create_modal.contact') }}</label>
                    <div class="relative">
                      <div class="relative">
                        <input
                          v-model="contactSearchQuery"
                          type="text"
                          placeholder="Search contacts..."
                          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          @input="searchContacts"
                        />
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div v-if="contactsLoading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        </div>
                      </div>
                      <div v-if="contactSearchQuery && filteredContacts.length === 0 && !contactsLoading" class="mt-2 text-sm text-gray-500">
                        No contacts found matching "{{ contactSearchQuery }}"
                      </div>
                    </div>
                    <select
                      v-model="meetingForm.contact_id"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                    >
                      <option value="">{{ $t('marketing.meetings.create_modal.select_contact') }}</option>
                      <option v-for="contact in filteredContacts" :key="contact.id" :value="contact.id">
                        {{ contact.name }} ({{ contact.email }})
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.meetings.create_modal.provider') }}</label>
                    <select
                      v-model="meetingForm.provider"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{{ $t('marketing.meetings.create_modal.select_provider') }}</option>
                      <option v-for="(provider, index) in meetingProviders" :key="provider?.id || index" :value="provider?.id">
                        {{ provider?.name || 'Unknown Provider' }}
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.meetings.create_modal.meeting_link') }}</label>
                  <input
                    v-model="meetingForm.meeting_link"
                    type="url"
                    :placeholder="$t('marketing.meetings.create_modal.enter_link')"
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
                  {{ $t('marketing.meetings.create_modal.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="creatingMeeting"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
                >
                  {{ creatingMeeting ? $t('marketing.meetings.create_modal.creating') : $t('marketing.meetings.create_modal.create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- View Meeting Modal -->
    <div
      v-if="showViewModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeViewModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Meeting Details</h3>
          </div>
          <div class="p-6" v-if="selectedMeetingDetails">
            <div v-if="loadingMeetingDetails" class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <div v-else class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p class="text-sm text-gray-900">{{ selectedMeetingDetails.title || 'Untitled Meeting' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p class="text-sm text-gray-900">{{ selectedMeetingDetails.description || 'No description' }}</p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <p class="text-sm text-gray-900">{{ formatDateTime(selectedMeetingDetails.scheduled_at || selectedMeetingDetails.start_time) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <p class="text-sm text-gray-900">{{ formatDateTime(selectedMeetingDetails.end_time) }}</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <p class="text-sm text-gray-900">{{ selectedMeetingDetails.contact?.full_name || selectedMeetingDetails.contact?.name || selectedMeetingDetails.contact?.email || 'Unknown Contact' }}</p>
                  <p class="text-xs text-gray-500">{{ selectedMeetingDetails.contact?.email || '' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <p class="text-sm text-gray-900">{{ getProviderName(selectedMeetingDetails.integration_provider || selectedMeetingDetails.provider) }}</p>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <p class="text-sm text-gray-900">{{ calculateDuration(selectedMeetingDetails.scheduled_at || selectedMeetingDetails.start_time, selectedMeetingDetails.end_time) }}</p>
              </div>
              <div v-if="selectedMeetingDetails.meeting_link || selectedMeetingDetails.integration_data?.join_url">
                <label class="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
                <a :href="selectedMeetingDetails.meeting_link || selectedMeetingDetails.integration_data?.join_url" target="_blank" class="text-sm text-blue-600 hover:text-blue-800 break-all">
                  {{ selectedMeetingDetails.meeting_link || selectedMeetingDetails.integration_data?.join_url }}
                </a>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span :class="getStatusColor(selectedMeetingDetails.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ selectedMeetingDetails.status || 'Unknown' }}
                </span>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button
                @click="closeViewModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Close
              </button>
              <button
                v-if="selectedMeetingDetails.meeting_link || selectedMeetingDetails.integration_data?.join_url"
                @click="openMeetingLink(selectedMeetingDetails.meeting_link || selectedMeetingDetails.integration_data?.join_url)"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Join Meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Meeting Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeEditModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Edit Meeting</h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="updateMeeting">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Meeting Title</label>
                  <input
                    v-model="editMeetingForm.title"
                    type="text"
                    required
                    placeholder="Enter meeting title"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    v-model="editMeetingForm.description"
                    placeholder="Enter meeting description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      v-model="editMeetingForm.start_time"
                      type="datetime-local"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      v-model="editMeetingForm.end_time"
                      type="datetime-local"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                    <select
                      v-model="editMeetingForm.contact_id"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Contact</option>
                      <option v-for="contact in contacts" :key="contact.id" :value="contact.id">
                        {{ contact.name }} ({{ contact.email }})
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                    <select
                      v-model="editMeetingForm.provider"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Provider</option>
                      <option v-for="provider in meetingProviders" :key="provider.id" :value="provider.id">
                        {{ provider.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Meeting Link</label>
                  <input
                    v-model="editMeetingForm.meeting_link"
                    type="url"
                    placeholder="Enter meeting link"
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
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="editingMeeting"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
                >
                  {{ editingMeeting ? 'Updating...' : 'Update Meeting' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Sync Results Modal -->
    <div
      v-if="showSyncResults"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeSyncResults"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Sync Results</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm text-gray-900">{{ $t('marketing.meetings.sync.synced_count', { count: syncResults.synced_count }) }}</span>
              </div>
              <div v-if="syncResults.error_count > 0" class="flex items-center">
                <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm text-gray-900">{{ $t('marketing.meetings.sync.error_count', { count: syncResults.error_count }) }}</span>
              </div>
              <div v-if="syncResults.errors && syncResults.errors.length > 0" class="mt-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Errors:</h4>
                <div class="space-y-2">
                  <div v-for="error in syncResults.errors" :key="error.meeting_id" class="text-sm text-red-600">
                    {{ error.meeting_id }}: {{ error.error }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-end mt-6">
              <button
                @click="closeSyncResults"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { meetingsService, meetingsHelpers } from '@/services/meetings'
import { contactsAPI } from '@/services/api'
import { error as showError, success as showSuccess } from '@/utils/notifications'

const { t } = useI18n()

// Reactive state
const loading = ref(false)
const error = ref(null)
const meetings = ref([])
const meetingStatuses = ref([])
const meetingProviders = ref([])
const contacts = ref([])
const contactsLoading = ref(false)
const contactSearchQuery = ref('')

// Computed property for filtered contacts
const filteredContacts = computed(() => {
  if (!contactSearchQuery.value) {
    return contacts.value
  }
  const query = contactSearchQuery.value.toLowerCase()
  return contacts.value.filter(contact => 
    contact.name?.toLowerCase().includes(query) || 
    contact.email?.toLowerCase().includes(query)
  )
})
const filters = ref({
  status: '',
  provider: '',
  dateRange: '',
  myMeetings: false
})
const showCreateModal = ref(false)
const showSyncResults = ref(false)
const showViewModal = ref(false)
const showEditModal = ref(false)
const selectedMeeting = ref(null)
const selectedMeetingDetails = ref(null)
const loadingMeetingDetails = ref(false)
const editingMeeting = ref(false)
const deletingMeeting = ref(false)
const creatingMeeting = ref(false)
const syncingGoogle = ref(false)
const syncingOutlook = ref(false)
const syncResults = ref({})

// Meeting form
const meetingForm = ref({
  title: '',
  description: '',
  start_time: '',
  end_time: '',
  contact_id: '',
  provider: 'google',
  meeting_link: ''
})

// Edit meeting form
const editMeetingForm = ref({
  id: '',
  title: '',
  description: '',
  start_time: '',
  end_time: '',
  contact_id: '',
  provider: '',
  meeting_link: ''
})

// Computed properties
const scheduledCount = computed(() => {
  return meetings.value.filter(m => m.status === 'scheduled').length
})

const completedCount = computed(() => {
  return meetings.value.filter(m => m.status === 'completed').length
})

const cancelledCount = computed(() => {
  return meetings.value.filter(m => m.status === 'cancelled').length
})

const noShowCount = computed(() => {
  return meetings.value.filter(m => m.status === 'no_show').length
})

const filteredMeetings = computed(() => {
  let filtered = meetings.value

  if (filters.value.status) {
    filtered = filtered.filter(m => m.status === filters.value.status)
  }

  if (filters.value.provider) {
    filtered = filtered.filter(m => m.provider === filters.value.provider)
  }

  if (filters.value.dateRange) {
    const now = new Date()
    filtered = filtered.filter(m => {
      const meetingDate = new Date(m.start_time)
      switch (filters.value.dateRange) {
        case 'upcoming':
          return meetingDate > now
        case 'today':
          return meetingDate.toDateString() === now.toDateString()
        case 'this_week':
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
          const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
          return meetingDate >= weekStart && meetingDate < weekEnd
        case 'this_month':
          return meetingDate.getMonth() === now.getMonth() && meetingDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }

  if (filters.value.myMeetings) {
    // Filter by current user (you would get this from auth store)
    filtered = filtered.filter(m => m.created_by.id === 1) // Placeholder for current user ID
  }

  return filtered
})

// Methods
const loadMeetings = async () => {
  loading.value = true
  error.value = null
  
  try {
    const [meetingsResponse, statusesResponse, providersResponse] = await Promise.all([
      meetingsService.getMeetings().catch(() => ({ data: [] })),
      meetingsService.getMeetingStatuses().catch(() => ({ data: [] })),
      meetingsService.getMeetingProviders().catch(() => ({ data: {} }))
    ])

    meetings.value = meetingsResponse.data || []
    meetingStatuses.value = statusesResponse.data || []
    
    // Convert providers object to array format
    const providersData = providersResponse.data || {}
    if (typeof providersData === 'object' && !Array.isArray(providersData)) {
      meetingProviders.value = Object.entries(providersData).map(([id, name]) => ({
        id,
        name
      }))
    } else {
      meetingProviders.value = providersData
    }
    
    console.log('Meeting providers loaded:', meetingProviders.value)

    // Load contacts from API
    await loadContacts()

  } catch (err) {
    console.error('Unexpected error in loadMeetings:', err)
    error.value = 'Failed to load meetings'
    showError(error.value)
  } finally {
    loading.value = false
  }
}


const loadContacts = async (searchQuery = '') => {
  contactsLoading.value = true
  try {
    const params = {
      per_page: 100,
      ...(searchQuery && { search: searchQuery })
    }
    const response = await contactsAPI.getContacts(params)
    contacts.value = response.data.data || response.data || []
  } catch (err) {
    console.error('Failed to load contacts:', err)
    showError('Failed to load contacts')
    // Fallback to empty array
    contacts.value = []
  } finally {
    contactsLoading.value = false
  }
}

const applyFilters = () => {
  // Filters are automatically applied through computed property
}

const clearFilters = () => {
  filters.value = {
    status: '',
    provider: '',
    dateRange: '',
    myMeetings: false
  }
}

const openCreateModal = () => {
  meetingForm.value = {
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    contact_id: '',
    provider: '',
    meeting_link: ''
  }
  contactSearchQuery.value = ''
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const createMeeting = async () => {
  creatingMeeting.value = true
  
  try {
    const validationErrors = meetingsHelpers.validateMeetingData(meetingForm.value)
    if (validationErrors.length > 0) {
      showError(validationErrors.join(', '))
      return
    }

    const meetingData = meetingsHelpers.prepareMeetingData(meetingForm.value)
    const response = await meetingsService.createMeeting(meetingData)
    
    // Add the new meeting to the list
    meetings.value.unshift(response.data)
    
    showSuccess('Meeting created successfully')
    closeCreateModal()
    
  } catch (err) {
    showError(err.message || 'Failed to create meeting')
  } finally {
    creatingMeeting.value = false
  }
}

const syncGoogleCalendar = async () => {
  syncingGoogle.value = true
  
  try {
    const response = await meetingsService.syncGoogleCalendar()
    syncResults.value = response.data
    showSyncResults.value = true
    showSuccess('Google Calendar synced successfully')
    
    // Reload meetings to show new synced data
    await loadMeetings()
    
  } catch (err) {
    showError(err.message || 'Failed to sync Google Calendar')
  } finally {
    syncingGoogle.value = false
  }
}

const syncOutlookCalendar = async () => {
  syncingOutlook.value = true
  
  try {
    const response = await meetingsService.syncOutlookCalendar()
    syncResults.value = response.data
    showSyncResults.value = true
    showSuccess('Outlook Calendar synced successfully')
    
    // Reload meetings to show new synced data
    await loadMeetings()
    
  } catch (err) {
    showError(err.message || 'Failed to sync Outlook Calendar')
  } finally {
    syncingOutlook.value = false
  }
}

const closeSyncResults = () => {
  showSyncResults.value = false
  syncResults.value = {}
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedMeeting.value = null
  selectedMeetingDetails.value = null
}

const getProviderName = (provider) => {
  const providerNames = {
    'google': 'Google Meet',
    'teams': 'Microsoft Teams',
    'zoom': 'Zoom',
    'webex': 'Webex',
    'phone': 'Phone Call',
    'in_person': 'In Person'
  }
  return providerNames[provider] || provider || 'Custom'
}

const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '0 min'
  
  const start = new Date(startTime)
  const end = new Date(endTime)
  const diffInMinutes = Math.floor((end - start) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min`
  }
  
  const hours = Math.floor(diffInMinutes / 60)
  const minutes = diffInMinutes % 60
  
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
}

const editMeeting = (meeting) => {
  selectedMeeting.value = meeting
  editMeetingForm.value = {
    id: meeting.id,
    title: meeting.title || '',
    description: meeting.description || '',
    start_time: meeting.scheduled_at ? new Date(meeting.scheduled_at).toISOString().slice(0, 16) : '',
    end_time: meeting.scheduled_at && meeting.duration_minutes ? 
      new Date(new Date(meeting.scheduled_at).getTime() + meeting.duration_minutes * 60000).toISOString().slice(0, 16) : '',
    contact_id: meeting.contact_id || '',
    provider: meeting.integration_provider || meeting.provider || '',
    meeting_link: meeting.meeting_link || ''
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedMeeting.value = null
  editMeetingForm.value = {
    id: '',
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    contact_id: '',
    provider: '',
    meeting_link: ''
  }
}

const updateMeeting = async () => {
  editingMeeting.value = true
  
  try {
    const response = await meetingsService.updateMeeting(editMeetingForm.value.id, editMeetingForm.value)
    
    // Update the meeting in the list
    const index = meetings.value.findIndex(m => m.id === editMeetingForm.value.id)
    if (index !== -1) {
      meetings.value[index] = response.data
    }
    
    showSuccess('Meeting updated successfully')
    closeEditModal()
    
  } catch (err) {
    showError(err.message || 'Failed to update meeting')
  } finally {
    editingMeeting.value = false
  }
}

const deleteMeeting = async (meeting) => {
  if (!confirm(`Are you sure you want to delete "${meeting.title}"? This action cannot be undone.`)) {
    return
  }
  
  deletingMeeting.value = true
  
  try {
    await meetingsService.deleteMeeting(meeting.id)
    
    // Remove the meeting from the list
    meetings.value = meetings.value.filter(m => m.id !== meeting.id)
    
    showSuccess('Meeting deleted successfully')
    
  } catch (err) {
    showError(err.message || 'Failed to delete meeting')
  } finally {
    deletingMeeting.value = false
  }
}

const searchContacts = async () => {
  // Debounce search to avoid too many API calls
  clearTimeout(searchContacts.timeoutId)
  searchContacts.timeoutId = setTimeout(async () => {
    if (contactSearchQuery.value.length > 2) {
      await loadContacts(contactSearchQuery.value)
    } else if (contactSearchQuery.value.length === 0) {
      await loadContacts()
    }
  }, 300)
}

const viewMeeting = async (meeting) => {
  selectedMeeting.value = meeting
  loadingMeetingDetails.value = true
  showViewModal.value = true
  
  try {
    const response = await meetingsService.getMeetingDetails(meeting.id)
    selectedMeetingDetails.value = response.data
  } catch (err) {
    console.error('Failed to load meeting details:', err)
    showError('Failed to load meeting details')
    // Fallback to basic meeting data
    selectedMeetingDetails.value = meeting
  } finally {
    loadingMeetingDetails.value = false
  }
}

const openMeetingLink = (link) => {
  window.open(link, '_blank')
}

// Helper methods
const formatDateTime = (dateString) => meetingsHelpers.formatDateTime(dateString)
const formatDuration = (minutes) => meetingsHelpers.formatDuration(minutes)
const formatNumber = (num) => meetingsHelpers.formatNumber(num)
const getStatusColor = (status) => meetingsHelpers.getStatusColor(status)
const getProviderColor = (provider) => meetingsHelpers.getProviderColor(provider)
const getRelativeTime = (dateString) => meetingsHelpers.getRelativeTime(dateString)

// Lifecycle
onMounted(async () => {
  await loadMeetings()
})
</script>
