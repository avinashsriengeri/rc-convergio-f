<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ $t('tasks.title') }}</h1>
            <p class="text-sm text-gray-600 mt-1">{{ $t('tasks.subtitle') }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="secondary"
              @click="refreshTasks"
              :loading="loading"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ $t('tasks.refresh') }}
            </BaseButton>
            <BaseButton
              variant="outline"
              @click="exportTasks"
              :loading="exporting"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ $t('tasks.export_csv') }}
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="showCreateModal = true"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {{ $t('tasks.new_task') }}
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
                :placeholder="$t('tasks.search_placeholder')"
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
                @click="setStatusFilter('all')"
                :class="{ 'bg-blue-50 border-blue-200 text-blue-700': filters.status === 'all' }"
              >
                {{ $t('tasks.all') }}
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="setStatusFilter('pending')"
                :class="{ 'bg-yellow-50 border-yellow-200 text-yellow-700': filters.status === 'pending' }"
              >
                {{ $t('tasks.pending') }}
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="setStatusFilter('completed')"
                :class="{ 'bg-green-50 border-green-200 text-green-700': filters.status === 'completed' }"
              >
                {{ $t('tasks.completed') }}
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="setStatusFilter('overdue')"
                :class="{ 'bg-red-50 border-red-200 text-red-700': filters.status === 'overdue' }"
              >
                {{ $t('tasks.overdue') }}
              </BaseButton>
            </div>
          </div>

          <!-- Advanced Filters -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Priority Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('tasks.priority') }}</label>
                             <select
                 v-model="filters.priority"
                 @change="applyFilters"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               >
                 <option value="all">{{ $t('tasks.any_priority') }}</option>
                 <option value="low">{{ $t('tasks.low') }}</option>
                 <option value="medium">{{ $t('tasks.medium') }}</option>
                 <option value="high">{{ $t('tasks.high') }}</option>
                 <option value="urgent">{{ $t('tasks.urgent') }}</option>
               </select>
            </div>

            <!-- Assignee Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('tasks.assignee') }}</label>
                             <select
                 v-model="filters.assignee_id"
                 @change="applyFilters"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               >
                 <option value="">{{ $t('tasks.any_assignee') }}</option>
                 <template v-if="refsStore.users && refsStore.users.length > 0">
                   <option
                     v-for="user in refsStore.users"
                     :key="user.id"
                     :value="user.id"
                   >
                     {{ user.name }}
                   </option>
                 </template>
               </select>
            </div>

            <!-- Due Date Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('tasks.due_date') }}</label>
                             <select
                 v-model="filters.due_date_filter"
                 @change="applyFilters"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               >
                 <option value="all">{{ $t('tasks.any_time') }}</option>
                 <option value="today">{{ $t('tasks.today') }}</option>
                 <option value="tomorrow">{{ $t('tasks.tomorrow') }}</option>
                 <option value="this_week">{{ $t('tasks.this_week') }}</option>
                 <option value="next_week">{{ $t('tasks.next_week') }}</option>
               </select>
            </div>

            <!-- Sort -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('tasks.sort') }}</label>
                             <select
                 v-model="filters.sort"
                 @change="applyFilters"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               >
                 <option value="due_date">{{ $t('tasks.due_date_newest') }}</option>
                 <option value="due_date_oldest">{{ $t('tasks.due_date_oldest') }}</option>
                 <option value="priority_low_high">{{ $t('tasks.priority_low_high') }}</option>
                 <option value="priority_high_low">{{ $t('tasks.priority_high_low') }}</option>
                 <option value="created_newest">{{ $t('tasks.created_newest') }}</option>
                 <option value="created_oldest">{{ $t('tasks.created_oldest') }}</option>
                 <option value="title_az">{{ $t('tasks.title_az') }}</option>
                 <option value="title_za">{{ $t('tasks.title_za') }}</option>
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
                 :disabled="loading"
               >
                 {{ $t('tasks.apply_filters') }}
               </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="clearFilters"
              >
                {{ $t('tasks.clear') }}
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
            {{ $t('tasks.all_tasks') }}
          </button>
          <button
            @click="handleTabChange('overdue')"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === 'overdue' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ $t('tasks.overdue') }}
          </button>
          <button
            @click="handleTabChange('upcoming')"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === 'upcoming' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ $t('tasks.upcoming') }}
          </button>
          <button
            v-if="assigneeId"
            @click="handleTabChange('assignee')"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === 'assignee' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ $t('tasks.my_tasks') }}
          </button>
          <button
            v-if="ownerId"
            @click="handleTabChange('owner')"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === 'owner' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ $t('tasks.created_by_me') }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">




      <!-- Loading State -->
      <div v-if="loading && (!tasks || tasks.length === 0)" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('tasks.error_loading') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="refreshTasks">
            {{ $t('tasks.try_again') }}
          </BaseButton>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && (!tasks || tasks.length === 0)" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('tasks.no_tasks_found') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ $t('tasks.get_started_message') }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="showCreateModal = true">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {{ $t('tasks.new_task') }}
          </BaseButton>
        </div>
      </div>

      <!-- Bulk Operations -->
      <div v-if="tasks && tasks.length > 0" class="mb-6 bg-white shadow-sm rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleSelectAll"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm font-medium text-gray-700">{{ $t('tasks.select_all') }}</span>
            </label>
            <span v-if="selectedTasks.length > 0" class="text-sm text-gray-500">
              {{ selectedTasks.length }} {{ $t('tasks.selected') }}
            </span>
          </div>
          <div v-if="selectedTasks.length > 0" class="flex items-center space-x-2">
            <BaseButton
              variant="outline"
              size="sm"
              @click="bulkComplete"
              :loading="bulkLoading"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ $t('tasks.mark_complete') }}
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
              {{ $t('tasks.bulk_update') }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Tasks List -->
      <div v-if="!loading && tasks && tasks.length > 0" class="space-y-4">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="bg-white shadow-sm rounded-lg p-6 border-l-4"
          :class="getTaskBorderClass(task)"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4 flex-1">
              <!-- Bulk Selection Checkbox -->
              <div class="flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  :value="task.id"
                  v-model="selectedTasks"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <!-- Task Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900" :class="{ 'line-through text-gray-500': task.status === 'completed' }">
                      {{ task.title }}
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
                    <div v-if="task.owner" class="text-xs text-gray-500 mt-1">
                      <strong>Owner:</strong> {{ task.owner.name || '—' }}
                    </div>
                    <div v-if="task.team" class="text-xs text-gray-500">
                      <strong>Team:</strong> {{ task.team.name || '—' }}
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getPriorityBadgeClass(task.priority)"
                    >
                      {{ task.priority }}
                    </span>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusBadgeClass(task.status)"
                    >
                      {{ task.status }}
                    </span>
                  </div>
                </div>

                <!-- Task Details -->
                <div class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{{ task.assignee?.name || 'Unassigned' }}</span>
                  </div>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span :class="isOverdue(task.due_date) ? 'text-red-600 font-medium' : ''">
                      {{ formatDate(task.due_date) }}
                    </span>
                    <span v-if="isOverdue(task.due_date)" class="ml-1 text-xs text-red-600">
                      ({{ $t('tasks.overdue') }})
                    </span>
                  </div>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ formatRelativeTime(task.created_at) }}</span>
                  </div>
                  <div v-if="task.related_entity" class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>{{ task.related_entity.type }} - {{ task.related_entity.name }}</span>
                  </div>
                </div>

                <!-- Task Notes -->
                <div v-if="task.notes" class="mt-4 p-3 bg-blue-50 rounded-md">
                  <h4 class="text-sm font-medium text-blue-900 mb-1">Notes</h4>
                  <p class="text-sm text-blue-800">{{ task.notes }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-1 ml-4">
              <button
                @click="viewTask(task)"
                class="text-gray-400 hover:text-gray-600 p-1"
                title="View details"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                v-if="canEdit(task)"
                @click="editTask(task)"
                class="text-gray-400 hover:text-gray-600 p-1"
                title="Edit task"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                v-if="canDelete(task)"
                @click="deleteTask(task)"
                class="text-gray-400 hover:text-red-600 p-1"
                title="Delete task"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="meta && meta.last_page > 1" class="mt-8 flex items-center justify-between">
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

    <!-- Task Form Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Edit Task' : 'New Task' }}
          </h3>
          <form @submit.prevent="saveTask">
            <div class="space-y-4">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Title <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  v-model="taskForm.title"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  v-model="taskForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task description"
                ></textarea>
              </div>

              <!-- Priority -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Priority <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="taskForm.priority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <!-- Assignee -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Assignee <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="taskForm.assignee_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Assignee</option>
                  <template v-if="refsStore.users && refsStore.users.length > 0">
                    <option
                      v-for="user in refsStore.users"
                      :key="user.id"
                      :value="user.id"
                    >
                      {{ user.name }}
                    </option>
                  </template>
                </select>
              </div>

              <!-- Customer (Contact) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Customer <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="taskForm.contact_id"
                  @change="onContactChange"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-300': !taskForm.contact_id && formSubmitted }"
                  required
                >
                  <option value="">Select Customer</option>
                  <template v-if="refsStore.contacts && refsStore.contacts.length > 0">
                    <option
                      v-for="contact in refsStore.contacts"
                      :key="contact.id"
                      :value="contact.id"
                    >
                      {{ contact.name || contact.email }}
                    </option>
                  </template>
                </select>
                <p v-if="loadingDealsOrQuotes" class="mt-1 text-xs text-gray-500">Loading deals and quotes...</p>
              </div>

              <!-- Related Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Related Type
                </label>
                <select
                  v-model="taskForm.related_entity_type"
                  @change="onRelatedTypeChange"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Other</option>
                  <option value="deal">Deal</option>
                  <option value="quote">Quote</option>
                </select>
              </div>

              <!-- Related Entity (Deal) -->
              <div v-if="taskForm.related_entity_type === 'deal'">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Deal <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="taskForm.related_entity_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-300': taskForm.related_entity_type === 'deal' && !taskForm.related_entity_id && formSubmitted }"
                  :required="taskForm.related_entity_type === 'deal'"
                >
                  <option value="">Select Deal</option>
                  <option
                    v-for="deal in availableDeals"
                    :key="deal.id"
                    :value="deal.id"
                  >
                    {{ deal.title || deal.name || `Deal #${deal.id}` }}
                  </option>
                </select>
                <p v-if="availableDeals.length === 0 && taskForm.contact_id && !loadingDealsOrQuotes" class="mt-1 text-xs text-gray-500">
                  No deals found for this customer
                </p>
              </div>

              <!-- Related Entity (Quote) -->
              <div v-if="taskForm.related_entity_type === 'quote'">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Quote <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="taskForm.related_entity_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-300': taskForm.related_entity_type === 'quote' && !taskForm.related_entity_id && formSubmitted }"
                  :required="taskForm.related_entity_type === 'quote'"
                >
                  <option value="">Select Quote</option>
                  <option
                    v-for="quote in availableQuotes"
                    :key="quote.id"
                    :value="quote.id"
                  >
                    {{ quote.title || quote.name || `Quote #${quote.id}` }}
                  </option>
                </select>
                <p v-if="availableQuotes.length === 0 && taskForm.contact_id && !loadingDealsOrQuotes" class="mt-1 text-xs text-gray-500">
                  No quotes found for this customer
                </p>
              </div>

              <!-- Due Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Due Date <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  v-model="taskForm.due_date"
                  type="date"
                  required
                />
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  v-model="taskForm.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
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
                  v-model="taskForm.notes"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task notes"
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

    <!-- Task Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Task Details</h3>
            <button
              @click="showDetailModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div v-if="selectedTask" class="space-y-4">
            <div>
              <h4 class="text-lg font-medium text-gray-900">{{ selectedTask.title }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ selectedTask.description }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-700">Priority:</span>
                <span class="ml-2" :class="getPriorityTextClass(selectedTask.priority)">
                  {{ selectedTask.priority }}
                </span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Status:</span>
                <span class="ml-2" :class="getStatusTextClass(selectedTask.status)">
                  {{ selectedTask.status }}
                </span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Assignee:</span>
                <span class="ml-2">{{ selectedTask.assignee?.name || 'Unassigned' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Due Date:</span>
                <span class="ml-2" :class="isOverdue(selectedTask.due_date) ? 'text-red-600 font-medium' : ''">
                  {{ formatDate(selectedTask.due_date) }}
                </span>
              </div>
            </div>

            <div v-if="selectedTask.notes" class="p-3 bg-blue-50 rounded-md">
              <h5 class="text-sm font-medium text-blue-900 mb-1">Notes</h5>
              <p class="text-sm text-blue-800">{{ selectedTask.notes }}</p>
            </div>

            <div class="flex items-center justify-end space-x-3 pt-4 border-t">
              <BaseButton
                variant="outline"
                @click="showDetailModal = false"
              >
                Close
              </BaseButton>
              <BaseButton
                variant="primary"
                @click="editTask(selectedTask)"
              >
                Edit Task
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      :title="$t('common.actions.delete_task')"
      :message="$t('common.actions.confirm_delete', { name: taskToDelete?.title })"
      :confirm-text="$t('common.delete')"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />

    <!-- Bulk Update Modal -->
    <div v-if="showBulkUpdateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Bulk Update Tasks</h3>
            <button
              @click="closeBulkUpdateModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mb-4 p-3 bg-blue-50 rounded-md">
            <p class="text-sm text-blue-800">
              <strong>{{ selectedTasks.length }}</strong> tasks selected for bulk update.
            </p>
          </div>

          <form @submit.prevent="saveBulkUpdate" class="space-y-4">
            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                v-model="bulkUpdateForm.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Keep current status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <!-- Priority -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                v-model="bulkUpdateForm.priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Keep current priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <!-- Assignee -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <select
                v-model="bulkUpdateForm.assignee_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Keep current assignee</option>
                <template v-if="refsStore.users && refsStore.users.length > 0">
                  <option
                    v-for="user in refsStore.users"
                    :key="user.id"
                    :value="user.id"
                  >
                    {{ user.name }}
                  </option>
                </template>
              </select>
            </div>

            <!-- Due Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <BaseInput
                v-model="bulkUpdateForm.due_date"
                type="date"
                placeholder="Keep current due date"
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
                placeholder="Add notes (optional)"
              ></textarea>
            </div>

            <div class="flex items-center justify-end space-x-3 pt-4 border-t">
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
                Update {{ selectedTasks.length }} Tasks
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
import { debounce } from 'lodash-es'
import { useTasksStore } from '@/stores/tasks'
import { useRefsStore } from '@/stores/refs'
import { useContext } from '@/composables/useContext'
import { usePermission } from '@/composables/usePermission'
import { success, error as showError } from '@/utils/notifications'
import { formatDate, formatRelativeTime, isOverdue } from '@/utils/formatters'
import { PER_PAGE_OPTIONS } from '@/utils/constants'
import type { Task, TaskFormData, PaginationMeta, TaskFilters, TaskStatus } from '@/types'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'
import { tasksAPI } from '@/services/api'

// Stores
const tasksStore = useTasksStore()
const refsStore = useRefsStore()
// Context and permissions
const { tenantId, teamId, isAdmin, userId } = useContext()
const { canEdit, canDelete, canView } = usePermission()

// User context variables for conditional tabs
const assigneeId = computed(() => userId.value)
const ownerId = computed(() => userId.value)

// Reactive data
const saving = ref(false)
const loading = computed(() => tasksStore.loading)
const error = computed(() => tasksStore.error)
const tasks = computed(() => tasksStore.tasks)
const meta = computed(() => tasksStore.meta)

// Missing reactive state variables
const exporting = ref(false)
const bulkLoading = ref(false)
const selectedTasks = ref<number[]>([])
const selectAll = ref(false)
const activeTab = ref('all')
const formSubmitted = ref(false)

// Deals and Quotes state
const availableDeals = ref<any[]>([])
const availableQuotes = ref<any[]>([])
const loadingDealsOrQuotes = ref(false)

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const showDeleteModal = ref(false)
const showBulkUpdateModal = ref(false)
const taskToDelete = ref<Task | null>(null)
const selectedTask = ref<Task | null>(null)

// Filters
const filters = reactive<TaskFilters>({
  search: '',
  status: 'all',
  priority: 'all',
  assignee_id: undefined,
  due_date_from: undefined,
  due_date_to: undefined,
  sort: 'due_date',
  page: 1,
  per_page: 15
})

// Task form
const taskForm = reactive<TaskFormData>({
  title: '',
  description: '',
  priority: 'medium',
  assignee_id: undefined,
  contact_id: undefined,
  due_date: '',
  status: 'pending',
  notes: '',
  related_entity_type: undefined,
  related_entity_id: undefined
})

// Bulk update form
const bulkUpdateForm = reactive({
  status: '',
  priority: '',
  assignee_id: undefined,
  due_date: '',
  notes: ''
})

// Computed
const isFormValid = computed(() => {
  const basicValid = taskForm.title && 
                     taskForm.priority && 
                     taskForm.due_date &&
                     taskForm.assignee_id &&
                     taskForm.contact_id
  
  // If related_entity_type is 'deal' or 'quote', related_entity_id is required
  if (taskForm.related_entity_type === 'deal' || taskForm.related_entity_type === 'quote') {
    return basicValid && taskForm.related_entity_id !== undefined && taskForm.related_entity_id !== null
  }
  
  // If related_entity_type is 'other' or empty, related_entity_id should be null/undefined
  if (taskForm.related_entity_type === '' || !taskForm.related_entity_type) {
    return basicValid && (taskForm.related_entity_id === undefined || taskForm.related_entity_id === null)
  }
  
  return basicValid
})

// Methods
const refreshTasks = () => {
  fetchTasks()
}

// Helper functions for date ranges
const getStartOfDay = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const getEndOfDay = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const getStartOfWeek = (date: Date): string => {
  const start = new Date(date)
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  start.setDate(diff)
  return getStartOfDay(start)
}

const getEndOfWeek = (date: Date): string => {
  const end = new Date(date)
  const day = end.getDay()
  const diff = end.getDate() - day + (day === 0 ? 0 : 7) // Adjust when day is Sunday
  end.setDate(diff)
  return getEndOfDay(end)
}

const getStartOfNextWeek = (): string => {
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  return getStartOfWeek(nextWeek)
}

const getEndOfNextWeek = (): string => {
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  return getEndOfWeek(nextWeek)
}

const buildParams = (filters: any) => {
  const params: any = {}
  
  // Search - trim and only include if not empty
  if (filters.search && filters.search.trim()) {
    params.search = filters.search.trim()
  }
  
  // Status filter - never send 'all'
  if (filters.status && filters.status !== 'all') {
    params.status = filters.status
  }
  
  // Priority filter - never send 'all'
  if (filters.priority && filters.priority !== 'all') {
    params.priority = filters.priority
  }
  
  // Assignee filter - only send if a user is selected
  if (filters.assignee_id && filters.assignee_id !== '' && filters.assignee_id !== undefined) {
    params.assigned_to = filters.assignee_id
  }
  
  // Due date filter - handle presets and ranges
  if (filters.due_date_filter && filters.due_date_filter !== 'all') {
    const today = new Date()
    
    switch (filters.due_date_filter) {
      case 'today':
        params.due_from = getStartOfDay(today)
        params.due_to = getEndOfDay(today)
        break
      case 'tomorrow':
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        params.due_from = getStartOfDay(tomorrow)
        params.due_to = getEndOfDay(tomorrow)
        break
      case 'this_week':
        params.due_from = getStartOfWeek(today)
        params.due_to = getEndOfWeek(today)
        break
      case 'next_week':
        params.due_from = getStartOfNextWeek()
        params.due_to = getEndOfNextWeek()
        break
      case 'overdue':
        // Overdue is handled by status filter, not date range
        break
    }
  }
  
  // Manual date range filters (if not using presets)
  if (!filters.due_date_filter || filters.due_date_filter === 'all') {
    if (filters.due_date_from) {
      params.due_from = filters.due_date_from
    }
    if (filters.due_date_to) {
      params.due_to = filters.due_date_to
    }
  }
  
  // Sort mapping - comprehensive mapping with fallback
  if (filters.sort) {
    const sortMapping: Record<string, string> = {
      'due_date': '-due_date',           // Due Date (newest first)
      '-due_date': '-due_date',          // Due Date (newest first)
      'due_date_oldest': 'due_date',     // Due Date (oldest first)
      'priority': 'priority',            // Priority (low to high)
      '-priority': '-priority',          // Priority (high to low)
      'priority_high_low': '-priority',  // Priority (high to low)
      'priority_low_high': 'priority',   // Priority (low to high)
      '-created_at': '-created_at',      // Created (newest)
      'created_at': 'created_at',        // Created (oldest)
      'created_newest': '-created_at',   // Created (newest)
      'created_oldest': 'created_at',    // Created (oldest)
      'title': 'title',                  // Title A-Z
      '-title': '-title',                // Title Z-A
      'title_az': 'title',               // Title A-Z
      'title_za': '-title'               // Title Z-A
    }
    params.sort = sortMapping[filters.sort] || '-due_date'
  } else {
    // Default sort
    params.sort = '-due_date'
  }
  
  // Pagination - only include if not default
  if (filters.page && filters.page > 1) {
    params.page = filters.page
  }
  
  if (filters.per_page && filters.per_page !== 15) {
    params.per_page = filters.per_page
  }
  
  console.log('Tasks buildParams - normalized filters:', params)
  return params
}

const fetchTasks = async () => {
  try {
    // When in "All Tasks" tab, ignore filters unless explicitly applied
    let params;
    if (activeTab.value === 'all' && !filters.search && filters.status === 'all' && 
        filters.priority === 'all' && !filters.assignee_id && 
        !filters.due_date_from && !filters.due_date_to) {
      // No filters applied, show all tasks
      params = { page: filters.page, per_page: filters.per_page, sort: filters.sort || '-due_date' }
    } else {
      // Filters applied or other tab, use normal filtering
      params = buildParams(filters)
    }
    
    await tasksStore.fetchTasks(params)

    // Safety fallback: if params are non-empty and result is empty, try unfiltered
    if (Object.keys(params).length > 2 && tasks.value.length === 0) {
      await tasksStore.fetchTasks({ page: 1, per_page: filters.per_page })
    }
  } catch (err: any) {
    console.error('Error fetching tasks:', err)
    showError('Failed to fetch tasks')
  }
}

const applyFilters = () => {
  filters.page = 1
  fetchTasks()
}

const clearFilters = () => {
  Object.assign(filters, {
    search: '',
    status: 'all',
    priority: 'all',
    assignee_id: undefined,
    due_date_filter: 'all',
    due_date_from: undefined,
    due_date_to: undefined,
    sort: 'due_date',
    page: 1,
    per_page: 15
  })
  applyFilters()
}

const setStatusFilter = (status: TaskStatus | 'all') => {
  filters.status = status
  filters.page = 1
  applyFilters()
}

const onPerPageChange = () => {
  filters.page = 1
  applyFilters()
}

const changePage = (page: number) => {
  filters.page = page
  fetchTasks()
}

const debouncedSearch = debounce(() => {
  filters.page = 1
  applyFilters()
}, 300)

// Fetch deals and quotes for selected contact
const fetchDealsAndQuotes = async (contactId: number) => {
  if (!contactId) {
    availableDeals.value = []
    availableQuotes.value = []
    return
  }

  loadingDealsOrQuotes.value = true
  try {
    // Fetch deals and quotes in parallel
    const [dealsResponse, quotesResponse] = await Promise.all([
      tasksAPI.getDealsByContact(contactId).catch(() => ({ data: { data: [] } })),
      tasksAPI.getQuotesByContact(contactId).catch(() => ({ data: { data: [] } }))
    ])

    availableDeals.value = dealsResponse.data?.data || []
    availableQuotes.value = quotesResponse.data?.data || []
  } catch (err) {
    console.error('Error fetching deals/quotes:', err)
    availableDeals.value = []
    availableQuotes.value = []
  } finally {
    loadingDealsOrQuotes.value = false
  }
}

// Handle contact change
const onContactChange = async () => {
  // Reset related entity when contact changes
  taskForm.related_entity_type = ''
  taskForm.related_entity_id = undefined
  availableDeals.value = []
  availableQuotes.value = []

  if (taskForm.contact_id) {
    await fetchDealsAndQuotes(taskForm.contact_id)
  }
}

// Handle related type change
const onRelatedTypeChange = () => {
  // Reset related_entity_id when type changes
  taskForm.related_entity_id = undefined
}

// Tab handling
const handleTabChange = async (tab: string) => {
  activeTab.value = tab
  filters.page = 1
  
  // Clear filters when switching tabs
  filters.search = ''
  filters.status = 'all'
  filters.priority = 'all'
  filters.assignee_id = undefined
  filters.due_date_from = undefined
  filters.due_date_to = undefined
  
  switch (tab) {
    case 'all':
      // For "All Tasks", just fetch with cleared filters
      await fetchTasks()
      break
    case 'overdue':
      await fetchOverdueTasks()
      break
    case 'upcoming':
      await fetchUpcomingTasks()
      break
    case 'assignee':
      // Show tasks assigned to current user
      if (assigneeId.value) {
        filters.assignee_id = assigneeId.value
      }
      await fetchTasks()
      break
    case 'owner':
      // Show tasks created by current user
      // Note: This would need backend support for owner_id filter
      if (ownerId.value) {
        // If backend supports owner filter, add it here
        filters.assignee_id = undefined
      }
      await fetchTasks()
      break
    default:
      await fetchTasks()
      break
  }
}

// Fetch overdue tasks
const fetchOverdueTasks = async () => {
  try {
    await tasksStore.fetchOverdueTasks()
  } catch (err) {
    console.error('Error fetching overdue tasks:', err)
    showError('Failed to load overdue tasks')
  }
}

// Fetch upcoming tasks
const fetchUpcomingTasks = async () => {
  try {
    await tasksStore.fetchUpcomingTasks(7) // Default to 7 days
  } catch (err) {
    console.error('Error fetching upcoming tasks:', err)
    showError('Failed to load upcoming tasks')
  }
}

const saveTask = async () => {
  formSubmitted.value = true
  
  if (!isFormValid.value) {
    showError('Please fill in all required fields')
    return
  }

  saving.value = true
  try {
    // Prepare task data according to backend requirements
    const taskData: any = {
      title: taskForm.title.trim(),
      description: taskForm.description?.trim() || '',
      priority: taskForm.priority,
      assignee_id: taskForm.assignee_id,
      contact_id: taskForm.contact_id,
      due_date: taskForm.due_date,
      status: taskForm.status,
      notes: taskForm.notes?.trim() || ''
    }

    // Handle related entity
    if (taskForm.related_entity_type === 'deal' || taskForm.related_entity_type === 'quote') {
      taskData.related_entity_type = taskForm.related_entity_type
      taskData.related_entity_id = taskForm.related_entity_id
    } else {
      // For 'other' or empty, set related_entity_id to null
      taskData.related_entity_type = taskForm.related_entity_type || null
      taskData.related_entity_id = null
    }

    if (showEditModal.value && taskToDelete.value) {
      await tasksStore.updateTask(taskToDelete.value.id, taskData)
      success('Task updated successfully')
    } else {
      await tasksStore.createTask(taskData)
      success('Task created successfully')
    }

    closeModal()
    // Refresh with current filters preserved
    await fetchTasks()
  } catch (err: any) {
    console.error('Error saving task:', err)
    const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to save task'
    showError(errorMessage)
  } finally {
    saving.value = false
  }
}

const toggleTaskStatus = async (task: Task) => {
  try {
    if (task.status === 'completed') {
      await tasksStore.updateTask(task.id, { status: 'pending' })
      success('Task marked as pending')
    } else {
      await tasksStore.completeTask(task.id)
      success('Task marked as completed')
    }
    // Refresh with current filters preserved
    await fetchTasks()
  } catch (err: any) {
    console.error('Error toggling task status:', err)
    showError('Failed to update task status')
  }
}

const viewTask = (task: Task) => {
  selectedTask.value = task
  showDetailModal.value = true
}

const editTask = async (task: Task) => {
  taskToDelete.value = task
  Object.assign(taskForm, {
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    assignee_id: task.assignee_id,
    contact_id: (task as any).contact_id || undefined,
    due_date: task.due_date,
    status: task.status,
    notes: task.notes || '',
    related_entity_type: task.related_entity_type || '',
    related_entity_id: task.related_entity_id
  })
  
  // Fetch deals and quotes if contact_id exists
  if (taskForm.contact_id) {
    await fetchDealsAndQuotes(taskForm.contact_id)
  }
  
  showEditModal.value = true
  showDetailModal.value = false
}

const deleteTask = (task: Task) => {
  taskToDelete.value = task
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!taskToDelete.value) return

  try {
    await tasksStore.deleteTask(taskToDelete.value.id)
    showDeleteModal.value = false
    taskToDelete.value = null
    success('Task deleted successfully')
    // Refresh with current filters preserved
    await fetchTasks()
  } catch (err: any) {
    console.error('Error deleting task:', err)
    showError('Failed to delete task')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showDetailModal.value = false
  taskToDelete.value = null
  selectedTask.value = null
  formSubmitted.value = false
  Object.assign(taskForm, {
    title: '',
    description: '',
    priority: 'medium',
    assignee_id: undefined,
    contact_id: undefined,
    due_date: '',
    status: 'pending',
    notes: '',
    related_entity_type: undefined,
    related_entity_id: undefined
  })
  // Reset deals and quotes
  availableDeals.value = []
  availableQuotes.value = []
}

const closeBulkUpdateModal = () => {
  showBulkUpdateModal.value = false
  Object.assign(bulkUpdateForm, {
    status: '',
    priority: '',
    assignee_id: undefined,
    due_date: '',
    notes: ''
  })
}

const saveBulkUpdate = async () => {
  // Check if at least one field is filled
  const hasChanges = bulkUpdateForm.status || 
                    bulkUpdateForm.priority || 
                    bulkUpdateForm.assignee_id || 
                    bulkUpdateForm.due_date || 
                    bulkUpdateForm.notes
  
  if (!hasChanges) {
    showError('Please fill in at least one field to update')
    return
  }
  
  bulkLoading.value = true
  try {
    const updateData: any = {
      ids: selectedTasks.value
    }
    
    if (bulkUpdateForm.status) updateData.status = bulkUpdateForm.status
    if (bulkUpdateForm.priority) updateData.priority = bulkUpdateForm.priority
    if (bulkUpdateForm.assignee_id) updateData.assignee_id = bulkUpdateForm.assignee_id
    if (bulkUpdateForm.due_date) updateData.due_date = bulkUpdateForm.due_date
    if (bulkUpdateForm.notes) updateData.notes = bulkUpdateForm.notes
    
    await tasksStore.bulkUpdate(selectedTasks.value, updateData)
    success(`${selectedTasks.value.length} tasks updated successfully`)
    selectedTasks.value = []
    selectAll.value = false
    closeBulkUpdateModal()
    await fetchTasks()
  } catch (err) {
    console.error('Error bulk updating tasks:', err)
    showError('Failed to update tasks')
  } finally {
    bulkLoading.value = false
  }
}

const getTaskBorderClass = (task: Task) => {
  if (task.status === 'completed') return 'border-green-500'
  if (isOverdue(task.due_date)) return 'border-red-500'
  if (task.priority === 'urgent') return 'border-red-400'
  if (task.priority === 'high') return 'border-orange-400'
  if (task.priority === 'medium') return 'border-yellow-400'
  return 'border-gray-300'
}

const getPriorityBadgeClass = (priority: string) => {
  const classes = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }
  return classes[priority as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getPriorityTextClass = (priority: string) => {
  const classes = {
    low: 'text-gray-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    urgent: 'text-red-600'
  }
  return classes[priority as keyof typeof classes] || 'text-gray-600'
}

const getStatusTextClass = (status: string) => {
  const classes = {
    pending: 'text-yellow-600',
    in_progress: 'text-blue-600',
    completed: 'text-green-600',
    cancelled: 'text-red-600'
  }
  return classes[status as keyof typeof classes] || 'text-gray-600'
}

// Bulk operations
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedTasks.value = tasks.value.map(task => task.id)
  } else {
    selectedTasks.value = []
  }
}

const bulkComplete = async () => {
  if (selectedTasks.value.length === 0) return
  
  bulkLoading.value = true
  try {
    await tasksStore.bulkComplete(selectedTasks.value)
    success(`${selectedTasks.value.length} tasks marked as complete`)
    selectedTasks.value = []
    selectAll.value = false
    await fetchTasks()
  } catch (err) {
    console.error('Error bulk completing tasks:', err)
    showError('Failed to mark tasks as complete')
  } finally {
    bulkLoading.value = false
  }
}

const bulkUpdate = async () => {
  if (selectedTasks.value.length === 0) return
  
  // Show bulk update modal
  showBulkUpdateModal.value = true
}

const exportTasks = async () => {
  exporting.value = true
  try {
    const params = buildParams(filters)
    const response = await tasksStore.exportTasks(params)
    
    // Create download link
    const blob = new Blob([response.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tasks-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    success('Tasks exported successfully')
  } catch (err) {
    console.error('Error exporting tasks:', err)
    showError('Failed to export tasks')
  } finally {
    exporting.value = false
  }
}



// Lifecycle
onMounted(async () => {
  try {
    // Fetch users and contacts first to populate dropdowns
    await Promise.all([
      refsStore.fetchUsers(),
      refsStore.fetchContacts({ per_page: 1000 }) // Fetch all contacts for dropdown
    ])
    // Then fetch tasks - default to "All Tasks" tab
    await fetchTasks()
    
    // Check if we should open create modal from URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('create') === 'true') {
      showCreateModal.value = true
      // Clean up URL parameter
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    }
  } catch (err: any) {
    console.error('Error in onMounted:', err)
    showError('Failed to initialize tasks page')
  }
})
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>
