<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ $t('activities.title') }}</h1>
            <p class="text-sm text-gray-600 mt-1">{{ $t('activities.subtitle') }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="secondary"
              @click="refreshActivities"
              :loading="loading"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ $t('activities.refresh') }}
            </BaseButton>
            <BaseButton
              variant="outline"
              @click="exportActivities"
              :loading="exporting"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ $t('activities.export_csv') }}
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="showCreateModal = true"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {{ $t('activities.new_activity') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form @submit.prevent="applyFilters" class="space-y-4">
          <!-- Search and Quick Filters -->
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <BaseInput
                v-model="filters.search"
                :placeholder="$t('activities.search_placeholder')"
                @input="debouncedSearch"
                class="w-full"
              >
                <template #prefix>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </template>
              </BaseInput>
            </div>
            
            <div class="flex flex-wrap gap-2">
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="setTypeFilter('all')"
                :class="{ 'bg-blue-50 border-blue-200 text-blue-700': filters.type === 'all' }"
              >
                {{ $t('activities.all') }}
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="setTypeFilter('call')"
                :class="{ 'bg-green-50 border-green-200 text-green-700': filters.type === 'call' }"
              >
                {{ $t('activities.calls') }}
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="setTypeFilter('meeting')"
                :class="{ 'bg-purple-50 border-purple-200 text-purple-700': filters.type === 'meeting' }"
              >
                {{ $t('activities.meetings') }}
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="setTypeFilter('email')"
                :class="{ 'bg-yellow-50 border-yellow-200 text-yellow-700': filters.type === 'email' }"
              >
                {{ $t('activities.emails') }}
              </BaseButton>
            </div>
          </div>

          <!-- Advanced Filters -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Type Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('activities.type') }}</label>
              <select
                v-model="filters.type"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{{ $t('activities.all_types') }}</option>
                <option
                  v-for="type in ACTIVITY_TYPES"
                  :key="type.value"
                  :value="type.value"
                >
                  {{ type.label }}
                </option>
              </select>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('activities.status') }}</label>
              <select
                v-model="filters.status"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{{ $t('activities.all_statuses') }}</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('activities.sort') }}</label>
                             <select
                 v-model="filters.sort"
                 @change="applyFilters"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               >
                 <option value="created_at_desc">Created (Newest)</option>
                 <option value="created_at_asc">Created (Oldest)</option>
                 <option value="scheduled_at_desc">Scheduled (Latest)</option>
                 <option value="scheduled_at_asc">Scheduled (Earliest)</option>
                 <option value="title_asc">Title A-Z</option>
                 <option value="title_desc">Title Z-A</option>
               </select>
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <BaseButton
                type="submit"
                variant="primary"
                size="sm"
                :loading="loading"
              >
                {{ $t('activities.apply_filters') }}
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="clearFilters"
              >
                {{ $t('activities.clear') }}
              </BaseButton>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-8">
          <button
            @click="handleTabChange('all')"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ $t('activities.all_activities') }}
          </button>
          <button
            @click="handleTabChange('timeline')"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === 'timeline' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ $t('activities.timeline') }}
          </button>
          <button
            @click="handleTabChange('upcoming')"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === 'upcoming' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ $t('activities.upcoming') }}
          </button>
          <button
            v-if="entityType && entityId"
            @click="handleTabChange('entity')"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === 'entity' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ entityType }} Activities
          </button>
        </nav>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading && !activities.length" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading activities</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="refreshActivities">
            Try Again
          </BaseButton>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && !activities.length" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first activity.</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="showCreateModal = true">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Activity
          </BaseButton>
        </div>
      </div>

      <!-- Bulk Operations -->
      <div v-if="activities.length > 0" class="mb-6 bg-white shadow-sm rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleSelectAll"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm font-medium text-gray-700">Select All</span>
            </label>
            <span v-if="selectedActivities.length > 0" class="text-sm text-gray-500">
              {{ selectedActivities.length }} selected
            </span>
          </div>
          <div v-if="selectedActivities.length > 0" class="flex items-center space-x-2">
            <BaseButton
              variant="outline"
              size="sm"
              @click="bulkComplete"
              :loading="bulkLoading"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Mark Complete
            </BaseButton>
            <BaseButton
              variant="outline"
              size="sm"
              @click="bulkUpdate"
              :loading="bulkLoading"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Bulk Update
            </BaseButton>
            <BaseButton
              variant="danger"
              size="sm"
              @click="bulkDelete"
              :loading="bulkLoading"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Selected
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Activities Timeline -->
      <div v-if="!loading && !error && activities.length > 0" class="space-y-6">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="bg-white shadow-sm rounded-lg p-6"
        >
          <div class="flex items-start space-x-4">
            <!-- Checkbox -->
            <div class="flex-shrink-0">
              <input
                type="checkbox"
                :value="activity.id"
                v-model="selectedActivities"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <!-- Activity Icon -->
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="getActivityIconClass(activity.type)">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="activity.type === 'call'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  <path v-else-if="activity.type === 'meeting'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path v-else-if="activity.type === 'email'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>

            <!-- Activity Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{ activity.title || 'Untitled Activity' }}</h3>
                  <p class="text-sm text-gray-500">{{ activity.description || '-' }}</p>
                  <div v-if="activity.owner" class="text-xs text-gray-500 mt-1">
                    <strong>Owner:</strong> {{ activity.owner.name || '—' }}
                  </div>
                  <div v-if="activity.team" class="text-xs text-gray-500">
                    <strong>Team:</strong> {{ activity.team.name || '—' }}
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusBadgeClass(activity.status)"
                  >
                    {{ activity.status }}
                  </span>
                                     <div class="flex items-center space-x-1">
                     <button
                       @click="viewActivity(activity)"
                       class="text-gray-400 hover:text-blue-600 p-1"
                       title="View activity"
                     >
                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                       </svg>
                     </button>
                     <button
                       v-if="canEdit(activity)"
                       @click="editActivity(activity)"
                       class="text-gray-400 hover:text-gray-600 p-1"
                       title="Edit activity"
                     >
                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                       </svg>
                     </button>
                     <button
                       v-if="activity.status !== 'completed'"
                       @click="markComplete(activity)"
                       class="text-gray-400 hover:text-green-600 p-1"
                       title="Mark complete"
                     >
                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                       </svg>
                     </button>
                     <button
                       v-if="canDelete(activity)"
                       @click="deleteActivity(activity)"
                       class="text-gray-400 hover:text-red-600 p-1"
                       title="Delete activity"
                     >
                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                       </svg>
                     </button>
                   </div>
                </div>
              </div>

              <!-- Activity Details -->
              <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ activity.scheduled_at ? formatDate(activity.scheduled_at) : '-' }}</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ activity.scheduled_at ? formatTime(activity.scheduled_at) : '-' }}</span>
                </div>
                <div v-if="activity.duration" class="flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ activity.duration }} minutes</span>
                </div>
              </div>

              <!-- Related Entity -->
              <div v-if="activity.related_entity" class="mt-4 p-3 bg-gray-50 rounded-md">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span class="text-sm text-gray-600">
                    Related to: {{ activity.related_entity?.type || 'Unknown' }} - {{ activity.related_entity?.name || 'Unknown' }}
                  </span>
                </div>
              </div>

              <!-- Activity Notes -->
              <div v-if="activity.notes" class="mt-4 p-3 bg-blue-50 rounded-md">
                <h4 class="text-sm font-medium text-blue-900 mb-1">Notes</h4>
                <p class="text-sm text-blue-800">{{ activity.notes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="mt-8 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ meta.from }} to {{ meta.to }} of {{ meta.total }} results
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-700">Per page:</label>
            <select
              v-model="filters.per_page"
              @change="onPerPageChange"
              class="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option
                v-for="option in PER_PAGE_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <BaseButton
              variant="secondary"
              :disabled="meta.current_page === 1"
              @click="changePage(meta.current_page - 1)"
              class="px-3 py-2"
            >
              Previous
            </BaseButton>
            <span class="text-sm text-gray-700">
              Page {{ meta.current_page }} of {{ meta.last_page }}
            </span>
            <BaseButton
              variant="secondary"
              :disabled="meta.current_page === meta.last_page"
              @click="changePage(meta.current_page + 1)"
              class="px-3 py-2"
            >
              Next
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Form Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Edit Activity' : 'New Activity' }}
          </h3>
          <form @submit.prevent="saveActivity">
            <div class="space-y-4">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Title <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  v-model="activityForm.title"
                  placeholder="Enter activity title"
                  required
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  v-model="activityForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter activity description"
                ></textarea>
              </div>

              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Type <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="activityForm.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Type</option>
                  <option
                    v-for="type in ACTIVITY_TYPES"
                    :key="type.value"
                    :value="type.value"
                  >
                    {{ type.label }}
                  </option>
                </select>
              </div>

              <!-- Scheduled Date & Time -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Date <span class="text-red-500">*</span>
                  </label>
                  <BaseInput
                    v-model="activityForm.scheduled_date"
                    type="date"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Time <span class="text-red-500">*</span>
                  </label>
                  <BaseInput
                    v-model="activityForm.scheduled_time"
                    type="time"
                    required
                  />
                </div>
              </div>

              <!-- Duration -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <BaseInput
                  v-model="activityForm.duration"
                  type="number"
                  placeholder="60"
                  min="1"
                />
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  v-model="activityForm.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  v-model="activityForm.notes"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter activity notes"
                ></textarea>
              </div>
            </div>
            <div class="flex items-center justify-end space-x-3 mt-6">
              <BaseButton
                type="button"
                variant="outline"
                @click="closeModal"
              >
                Cancel
              </BaseButton>
              <BaseButton
                type="submit"
                variant="primary"
                :loading="saving"
              >
                {{ showEditModal ? 'Update' : 'Create' }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      :title="$t('common.actions.delete_activity')"
      :message="$t('common.actions.confirm_delete', { name: activityToDelete?.title })"
      :confirm-text="$t('common.delete')"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />

    <!-- Bulk Update Modal -->
    <div v-if="showBulkUpdateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Bulk Update Activities ({{ selectedActivities.length }} selected)
          </h3>
          <form @submit.prevent="saveBulkUpdate">
            <div class="space-y-4">
              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  v-model="bulkUpdateForm.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No change</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <!-- Scheduled Date & Time -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <BaseInput
                    v-model="bulkUpdateForm.scheduled_date"
                    type="date"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <BaseInput
                    v-model="bulkUpdateForm.scheduled_time"
                    type="time"
                  />
                </div>
              </div>

              <!-- Duration -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <BaseInput
                  v-model="bulkUpdateForm.duration"
                  type="number"
                  placeholder="60"
                  min="1"
                />
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  v-model="bulkUpdateForm.notes"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter notes for all selected activities"
                ></textarea>
              </div>
            </div>
            <div class="flex items-center justify-end space-x-3 mt-6">
              <BaseButton
                type="button"
                variant="outline"
                @click="closeBulkUpdateModal"
              >
                Cancel
              </BaseButton>
              <BaseButton
                type="submit"
                variant="primary"
                :loading="bulkLoading"
              >
                Update {{ selectedActivities.length }} Activities
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { debounce } from 'lodash-es'
import { useActivitiesStore } from '@/stores/activities'
import { useRefsStore } from '@/stores/refs'
import { useContext } from '@/composables/useContext'
import { usePermission } from '@/composables/usePermission'
import { success, error as showError } from '@/utils/notifications'
import { formatDate, formatTime } from '@/utils/formatters'
import { PER_PAGE_OPTIONS } from '@/utils/constants'
import type { Activity, ActivityFormData, PaginationMeta } from '@/types'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'

// Router
const router = useRouter()
const route = useRoute()

// Stores
const activitiesStore = useActivitiesStore()
const refsStore = useRefsStore()
// Context and permissions (unused in this component but available for future use)
// const { tenantId, teamId, isAdmin } = useContext()
const { canEdit, canDelete, canView } = usePermission()

// Activity types
const ACTIVITY_TYPES = [
  { value: 'call', label: 'Phone Call' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'email', label: 'Email' },
  { value: 'task', label: 'Task' },
  { value: 'note', label: 'Note' }
]

// Reactive data
const saving = ref(false)
const exporting = ref(false)
const bulkLoading = ref(false)
const activeTab = ref('all')
const entityType = ref('')
const entityId = ref('')
const selectedActivities = ref<number[]>([])
const selectAll = ref(false)
const loading = computed(() => activitiesStore.loading)
const error = computed(() => activitiesStore.error)
const activities = computed(() => activitiesStore.activities)
const meta = computed(() => activitiesStore.meta)

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showBulkUpdateModal = ref(false)
const activityToDelete = ref<Activity | null>(null)

// Filters
const filters = reactive({
  search: '',
  type: 'all',
  status: 'all',
  sort: 'created_at_desc',
  page: 1,
  per_page: 15
})

// Activity form
const activityForm = reactive({
  title: '',
  description: '',
  type: '',
  scheduled_date: '',
  scheduled_time: '',
  duration: undefined,
  status: 'scheduled',
  notes: '',
  related_entity_type: undefined,
  related_entity_id: undefined
})

// Bulk update form
const bulkUpdateForm = reactive({
  status: '',
  scheduled_date: '',
  scheduled_time: '',
  duration: undefined,
  notes: ''
})

// Computed
const isFormValid = computed(() => {
  return activityForm.title && 
         activityForm.type && 
         activityForm.scheduled_date && 
         activityForm.scheduled_time
})

// Methods
const refreshActivities = () => {
  fetchActivities()
}

// Build normalized parameters for API calls
const buildParams = (filters: any) => {
  const params: Record<string, any> = {}
  
  // Only include non-empty, non-'all' values
  if (filters.search && filters.search.trim()) {
    params.search = filters.search.trim()
  }
  
  if (filters.type && filters.type !== 'all') {
    params.type = filters.type
  }
  
  if (filters.status && filters.status !== 'all') {
    params.status = filters.status
  }
  
  if (filters.scheduled_from) {
    params.scheduled_from = filters.scheduled_from
  }
  
  if (filters.scheduled_to) {
    params.scheduled_to = filters.scheduled_to
  }
  
  if (filters.sort) {
    params.sort = filters.sort
  }
  
  if (filters.page) {
    params.page = filters.page
  }
  
  if (filters.per_page) {
    params.per_page = filters.per_page
  }
  
  return params
}

const fetchActivities = async () => {
  const params = buildParams(filters)
  console.log('Fetching activities with normalized params:', params)
  
  await activitiesStore.fetchActivities(params)
}

const applyFilters = () => {
  filters.page = 1
  fetchActivities()
}

const clearFilters = () => {
  Object.assign(filters, {
    search: '',
    type: 'all',
    status: 'all',
    sort: 'created_at_desc',
    page: 1,
    per_page: 15
  })
  applyFilters()
}

const setTypeFilter = (type: string) => {
  filters.type = type
  filters.page = 1
  applyFilters()
}

const onPerPageChange = () => {
  filters.page = 1
  applyFilters()
}

const changePage = (page: number) => {
  filters.page = page
  fetchActivities()
}

const debouncedSearch = debounce(() => {
  filters.page = 1
  applyFilters()
}, 300)

// Tab handling
const handleTabChange = async (tab: string) => {
  activeTab.value = tab
  filters.page = 1
  
  switch (tab) {
    case 'timeline':
      await fetchTimeline()
      break
    case 'upcoming':
      await fetchUpcoming()
      break
    case 'entity':
      if (entityType.value && entityId.value) {
        await fetchEntityActivities()
      }
      break
    default:
      await fetchActivities()
      break
  }
}

// Fetch timeline activities
const fetchTimeline = async () => {
  try {
    await activitiesStore.fetchTimeline()
  } catch (err) {
    console.error('Error fetching timeline:', err)
    showError('Failed to load timeline')
  }
}

// Fetch upcoming activities
const fetchUpcoming = async () => {
  try {
    await activitiesStore.fetchUpcoming()
  } catch (err) {
    console.error('Error fetching upcoming:', err)
    showError('Failed to load upcoming activities')
  }
}

// Fetch entity-specific activities
const fetchEntityActivities = async () => {
  if (!entityType.value || !entityId.value) return
  
  try {
    await activitiesStore.fetchEntityActivities(entityType.value, entityId.value)
  } catch (err) {
    console.error('Error fetching entity activities:', err)
    showError('Failed to load entity activities')
  }
}

// Export activities
const exportActivities = async () => {
  exporting.value = true
  try {
    const params = buildParams(filters)
    const response = await activitiesStore.exportActivities(params)
    
    // Create download link
    const blob = new Blob([response.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `activities-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    success('Activities exported successfully')
  } catch (err) {
    console.error('Error exporting activities:', err)
    showError('Failed to export activities')
  } finally {
    exporting.value = false
  }
}

// Bulk operations
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedActivities.value = activities.value.map(activity => activity.id)
  } else {
    selectedActivities.value = []
  }
}

const markComplete = async (activity: Activity) => {
  try {
    await activitiesStore.completeActivity(activity.id)
    success('Activity marked as complete')
    await fetchActivities()
  } catch (err) {
    console.error('Error marking activity complete:', err)
    showError('Failed to mark activity as complete')
  }
}

const bulkComplete = async () => {
  if (selectedActivities.value.length === 0) return
  
  bulkLoading.value = true
  try {
    await activitiesStore.bulkComplete(selectedActivities.value)
    success(`${selectedActivities.value.length} activities marked as complete`)
    selectedActivities.value = []
    selectAll.value = false
    await fetchActivities()
  } catch (err) {
    console.error('Error bulk completing activities:', err)
    showError('Failed to mark activities as complete')
  } finally {
    bulkLoading.value = false
  }
}

const bulkUpdate = async () => {
  if (selectedActivities.value.length === 0) return
  
  // Show bulk update modal
  showBulkUpdateModal.value = true
}

const bulkDelete = async () => {
  if (selectedActivities.value.length === 0) return
  
  if (!confirm($t('common.actions.confirm_delete_multiple', { count: selectedActivities.value.length }))) {
    return
  }
  
  bulkLoading.value = true
  try {
    await activitiesStore.bulkDelete(selectedActivities.value)
    success(`${selectedActivities.value.length} activities deleted`)
    selectedActivities.value = []
    selectAll.value = false
    await fetchActivities()
  } catch (err) {
    console.error('Error bulk deleting activities:', err)
    showError('Failed to delete activities')
  } finally {
    bulkLoading.value = false
  }
}

const saveActivity = async () => {
  if (!isFormValid.value) {
    showError('Please fill in all required fields')
    return
  }

  // Combine date and time into MySQL datetime format (YYYY-MM-DD HH:mm:ss)
  const scheduledAt = `${activityForm.scheduled_date} ${activityForm.scheduled_time}:00`

  saving.value = true
  try {
    const data = {
      ...activityForm,
      scheduled_at: scheduledAt
    }

    if (showEditModal.value && activityToDelete.value) {
      await activitiesStore.updateActivity(activityToDelete.value.id, data)
      success('Activity updated successfully')
    } else {
      await activitiesStore.createActivity(data)
      success('Activity created successfully')
    }

    closeModal()
    
    // Refresh with current filters, but if no results, try without filters
    await fetchActivities()
    
    // If no activities found after refresh, try without filters to ensure visibility
    if (activities.value.length === 0) {
      console.log('No activities found after refresh, trying without filters...')
      await activitiesStore.fetchActivities({})
    }
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to save activity')
  } finally {
    saving.value = false
  }
}

const viewActivity = (activity: Activity) => {
  router.push({ name: 'activities.show', params: { id: activity.id } })
}

const editActivity = (activity: Activity) => {
  activityToDelete.value = activity
  Object.assign(activityForm, {
    title: activity.title,
    description: activity.description || '',
    type: activity.type,
    scheduled_date: activity.scheduled_at.split('T')[0],
    scheduled_time: activity.scheduled_at.split('T')[1]?.substring(0, 5) || '',
    duration: activity.duration,
    status: activity.status,
    notes: activity.notes || '',
    related_entity_type: activity.related_entity_type,
    related_entity_id: activity.related_entity_id
  })
  showEditModal.value = true
}

const deleteActivity = (activity: Activity) => {
  activityToDelete.value = activity
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!activityToDelete.value) return

  try {
    await activitiesStore.deleteActivity(activityToDelete.value.id)
    showDeleteModal.value = false
    activityToDelete.value = null
    success('Activity deleted successfully')
    fetchActivities()
  } catch (err) {
    showError('Failed to delete activity')
  }
}

const saveBulkUpdate = async () => {
  // Check if at least one field is filled
  const hasChanges = bulkUpdateForm.status || 
                    bulkUpdateForm.scheduled_date || 
                    bulkUpdateForm.scheduled_time || 
                    bulkUpdateForm.duration || 
                    bulkUpdateForm.notes
  
  if (!hasChanges) {
    showError('Please fill in at least one field to update')
    return
  }
  
  bulkLoading.value = true
  try {
    const updateData: any = {
      ids: selectedActivities.value
    }
    
    if (bulkUpdateForm.status) {
      updateData.status = bulkUpdateForm.status
    }
    
    if (bulkUpdateForm.scheduled_date && bulkUpdateForm.scheduled_time) {
      updateData.scheduled_at = `${bulkUpdateForm.scheduled_date} ${bulkUpdateForm.scheduled_time}:00`
    }
    
    if (bulkUpdateForm.duration) {
      updateData.duration = bulkUpdateForm.duration
    }
    
    if (bulkUpdateForm.notes) {
      updateData.notes = bulkUpdateForm.notes
    }
    
    await activitiesStore.bulkUpdate(updateData)
    success(`${selectedActivities.value.length} activities updated successfully`)
    selectedActivities.value = []
    selectAll.value = false
    closeBulkUpdateModal()
    await fetchActivities()
  } catch (err) {
    console.error('Error bulk updating activities:', err)
    showError('Failed to update activities')
  } finally {
    bulkLoading.value = false
  }
}

const closeBulkUpdateModal = () => {
  showBulkUpdateModal.value = false
  Object.assign(bulkUpdateForm, {
    status: '',
    scheduled_date: '',
    scheduled_time: '',
    duration: undefined,
    notes: ''
  })
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  activityToDelete.value = null
  // If we're on the create route, navigate back to activities list
  if (route.path === '/activities/create') {
    router.push('/activities')
  }
  Object.assign(activityForm, {
    title: '',
    description: '',
    type: '',
    scheduled_date: '',
    scheduled_time: '',
    duration: undefined,
    status: 'scheduled',
    notes: '',
    related_entity_type: undefined,
    related_entity_id: undefined
  })
}

const getActivityIconClass = (type: string) => {
  const classes = {
    call: 'bg-green-500',
    meeting: 'bg-purple-500',
    email: 'bg-yellow-500',
    task: 'bg-blue-500',
    note: 'bg-gray-500'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-500'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(async () => {
  try {
    // Fetch users first to populate owner dropdown
    await refsStore.fetchUsers()
    // Then fetch activities
    await fetchActivities()
    
    // Check if we're on the create route - open modal automatically
    if (route.path === '/activities/create') {
      showCreateModal.value = true
    }
  } catch (err: any) {
    console.error('Error in onMounted:', err)
    showError('Failed to initialize activities page')
  }
})
</script>
