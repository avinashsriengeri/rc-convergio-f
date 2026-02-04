<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Induction & Training Management</h1>
        <p class="mt-2 text-lg text-gray-600">Create and manage induction and training content for employees</p>
      </div>
      <div class="flex items-center space-x-3">
        <router-link
          :to="{ name: 'HrInductionTracking' }"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          View Tracking
        </router-link>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-colors shadow-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Content
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Content</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Published</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.published }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Draft</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.draft }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-purple-100 rounded-lg p-3">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Assigned</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.assigned }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search content..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @input="handleSearch"
          />
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="applyFilters"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            v-model="filters.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="applyFilters"
          >
            <option value="">All Categories</option>
            <option value="induction">Induction</option>
            <option value="policy">Policy</option>
            <option value="training">Training</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="inductionStore.loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading contents...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="inductionStore.error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-red-800">Error loading contents</h3>
          <p class="mt-1 text-sm text-red-700">{{ inductionStore.error }}</p>
        </div>
        <button
          @click="loadContents"
          class="ml-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="inductionStore.contents.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No content</h3>
      <p class="mt-2 text-sm text-gray-500">Get started by creating your first induction or training content.</p>
      <button
        @click="showCreateModal = true"
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink transition-colors"
      >
        Create Content
      </button>
    </div>

    <!-- Contents Table -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="content in inductionStore.contents" :key="content.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ content.title }}</div>
                  <div v-if="content.description" class="text-sm text-gray-500 truncate max-w-xs">{{ content.description }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getCategoryBadgeClass(content.category)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getCategoryLabel(content.category) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <ContentTypeBadge :type="content.content_type" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <StatusBadge :status="content.status" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ content.assigned_count || 0 }} employees
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="content.assigned_count > 0" class="flex items-center space-x-2">
                <div class="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                  <div
                    class="bg-primary-purple h-2 rounded-full transition-all"
                    :style="{ width: `${getCompletionPercentage(content)}%` }"
                  ></div>
                </div>
                <span class="text-xs text-gray-600">{{ getCompletionPercentage(content) }}%</span>
              </div>
              <span v-else class="text-sm text-gray-400">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click="editContent(content)"
                  class="text-primary-purple hover:text-primary-pink transition-colors"
                  title="Edit"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="content.status === 'draft'"
                  @click="publishContent(content.id)"
                  class="text-green-600 hover:text-green-700 transition-colors"
                  title="Publish"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </button>
                <button
                  @click="deleteContentConfirm(content)"
                  class="text-red-600 hover:text-red-700 transition-colors"
                  title="Delete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="inductionStore.meta.last_page > 1" class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ (inductionStore.meta.current_page - 1) * inductionStore.meta.per_page + 1 }} to
          {{ Math.min(inductionStore.meta.current_page * inductionStore.meta.per_page, inductionStore.meta.total) }} of
          {{ inductionStore.meta.total }} results
        </div>
        <div class="flex space-x-2">
          <button
            @click="changePage(inductionStore.meta.current_page - 1)"
            :disabled="inductionStore.meta.current_page === 1"
            class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            @click="changePage(inductionStore.meta.current_page + 1)"
            :disabled="inductionStore.meta.current_page === inductionStore.meta.last_page"
            class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closeModal"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeModal"></div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ showEditModal ? 'Edit Content' : 'Create New Content' }}
              </h3>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-500"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="space-y-4">
                <!-- Title -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Content Title *</label>
                  <input
                    v-model="formData.title"
                    type="text"
                    required
                    placeholder="e.g., Company Introduction & Values"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  />
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    v-model="formData.description"
                    rows="3"
                    placeholder="Describe the content..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  ></textarea>
                </div>

                <!-- Category & Content Type -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      v-model="formData.category"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="induction">Induction</option>
                      <option value="policy">Policy</option>
                      <option value="training">Training</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Content Type *</label>
                    <select
                      v-model="formData.content_type"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      <option value="document">Document</option>
                      <option value="video">Video</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                <!-- Video URL -->
                <div v-if="formData.content_type === 'video' || formData.content_type === 'both'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                  <input
                    v-model="formData.video_url"
                    type="url"
                    placeholder="https://vimeo.com/manage/videos/123456"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  />
                </div>

                <!-- File Upload -->
                <div v-if="formData.content_type === 'document' || formData.content_type === 'both'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Upload Document (PDF, DOCX)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    @change="handleFileSelect"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  />
                  <p v-if="formData.file_url" class="mt-1 text-sm text-gray-500">Current: {{ formData.file_url }}</p>
                </div>

                <!-- Target Audience -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Target Audience *</label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input
                        v-model="formData.target_audience_type"
                        type="radio"
                        value="all_employees"
                        class="mr-2 text-primary-purple focus:ring-primary-purple"
                      />
                      <span class="text-sm text-gray-700">All Employees</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="formData.target_audience_type"
                        type="radio"
                        value="onboarding_only"
                        class="mr-2 text-primary-purple focus:ring-primary-purple"
                      />
                      <span class="text-sm text-gray-700">Onboarding Only</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="formData.target_audience_type"
                        type="radio"
                        value="department_specific"
                        class="mr-2 text-primary-purple focus:ring-primary-purple"
                      />
                      <span class="text-sm text-gray-700">Department Specific</span>
                    </label>
                  </div>
                  <select
                    v-if="formData.target_audience_type === 'department_specific'"
                    v-model="formData.target_departments"
                    multiple
                    class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  >
                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                      {{ dept.name }}
                    </option>
                  </select>
                </div>

                <!-- Mandatory & Due Date -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="flex items-center">
                      <input
                        v-model="formData.is_mandatory"
                        type="checkbox"
                        class="mr-2 text-primary-purple focus:ring-primary-purple rounded"
                      />
                      <span class="text-sm font-medium text-gray-700">Mandatory - Employee must acknowledge</span>
                    </label>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      v-model="formData.due_date"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                    />
                  </div>
                </div>

                <!-- Estimated Time -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Estimated Time (minutes)</label>
                  <input
                    v-model.number="formData.estimated_time"
                    type="number"
                    min="1"
                    placeholder="15"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  />
                </div>
              </div>

              <div class="mt-6 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  v-if="showEditModal"
                  type="button"
                  @click="saveDraft"
                  :disabled="saving"
                  class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  {{ saving ? 'Saving...' : 'Save Draft' }}
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {{ saving ? 'Saving...' : (showEditModal ? 'Update' : 'Create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="showDeleteModal = false"
    >
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Delete Content</h3>
            <p class="text-sm text-gray-500">Are you sure you want to delete "{{ contentToDelete?.title }}"? This action cannot be undone.</p>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="confirmDelete"
              :disabled="deleting"
              class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
            <button
              @click="showDeleteModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useHrInductionStore } from '../store/hrInduction'
import { useHrDepartmentsStore } from '../store/hrDepartments'
import { useAuth } from '@/composables/useAuth'
import StatusBadge from '../components/StatusBadge.vue'
import ContentTypeBadge from '../components/ContentTypeBadge.vue'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const router = useRouter()
const { user } = useAuth()

// Check if user is HR Admin
const isHrAdmin = computed(() => {
  if (!user.value?.roles) return false
  const roles = Array.isArray(user.value.roles) ? user.value.roles : [user.value.roles]
  return roles.some(r => {
    const roleName = typeof r === 'object' ? r.name : r
    return roleName === 'hr_admin' || roleName === 'system_admin'
  })
})

// Redirect employees to their induction page
onMounted(() => {
  if (!isHrAdmin.value) {
    router.replace({ name: 'MyInduction' })
  }
})

const inductionStore = useHrInductionStore()
const departmentsStore = useHrDepartmentsStore()

const searchQuery = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const saving = ref(false)
const deleting = ref(false)
const contentToDelete = ref(null)

const filters = computed(() => inductionStore.filters)
const departments = computed(() => departmentsStore.activeDepartments)

const formData = ref({
  title: '',
  description: '',
  category: '',
  content_type: '',
  video_url: '',
  file_url: '',
  file: null,
  target_audience_type: 'onboarding_only',
  target_departments: [],
  is_mandatory: false,
  due_date: '',
  estimated_time: null,
  status: 'draft'
})

const stats = computed(() => {
  const contents = inductionStore.contents
  return {
    total: contents.length,
    published: contents.filter(c => c.status === 'published').length,
    draft: contents.filter(c => c.status === 'draft').length,
    assigned: contents.reduce((sum, c) => sum + (c.assigned_count || 0), 0)
  }
})

const loadContents = async () => {
  await inductionStore.fetchContents()
}

const loadDepartments = async () => {
  await departmentsStore.fetchDepartments({ per_page: 100, is_active: true })
}

const handleSearch = () => {
  inductionStore.setFilters({ search: searchQuery.value, page: 1 })
  loadContents()
}

const applyFilters = () => {
  inductionStore.setFilters({ ...filters.value, page: 1 })
  loadContents()
}

const changePage = (page) => {
  if (page >= 1 && page <= inductionStore.meta.last_page) {
    inductionStore.setFilters({ page })
    loadContents()
  }
}

const getCategoryLabel = (category) => {
  const labels = {
    induction: 'Induction',
    policy: 'Policy',
    training: 'Training'
  }
  return labels[category] || category
}

const getCategoryBadgeClass = (category) => {
  const classes = {
    induction: 'bg-blue-100 text-blue-800',
    policy: 'bg-purple-100 text-purple-800',
    training: 'bg-green-100 text-green-800'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}

const getCompletionPercentage = (content) => {
  if (!content.assigned_count || content.assigned_count === 0) return 0
  const completed = content.completed_count || 0
  return Math.round((completed / content.assigned_count) * 100)
}

const editContent = (content) => {
  formData.value = {
    title: content.title || '',
    description: content.description || '',
    category: content.category || '',
    content_type: content.content_type || '',
    video_url: content.video_url || '',
    file_url: content.file_url || '',
    file: null,
    target_audience_type: content.target_audience_type || 'onboarding_only',
    target_departments: content.target_departments || [],
    is_mandatory: content.is_mandatory || false,
    due_date: content.due_date ? content.due_date.split('T')[0] : '',
    estimated_time: content.estimated_time || null,
    status: content.status || 'draft'
  }
  showEditModal.value = true
  showCreateModal.value = false
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.file = file
    formData.value.file_url = file.name
  }
}

const saveDraft = async () => {
  await handleSubmit(true)
}

const handleSubmit = async (isDraft = false) => {
  saving.value = true
  try {
    const data = {
      title: formData.value.title,
      description: formData.value.description,
      category: formData.value.category,
      content_type: formData.value.content_type,
      video_url: formData.value.video_url || null,
      file_url: formData.value.file_url || null,
      target_audience_type: formData.value.target_audience_type,
      target_departments: formData.value.target_audience_type === 'department_specific' ? formData.value.target_departments : null,
      is_mandatory: formData.value.is_mandatory,
      due_date: formData.value.due_date || null,
      estimated_time: formData.value.estimated_time || null,
      status: isDraft ? 'draft' : 'draft'
    }

    if (showEditModal.value && inductionStore.selectedContent) {
      await inductionStore.updateContent(inductionStore.selectedContent.id, data)
      showSuccess('Content updated successfully')
    } else {
      await inductionStore.createContent(data)
      showSuccess('Content created successfully')
    }
    
    closeModal()
    await loadContents()
  } catch (err) {
    showError(err.message || 'Failed to save content')
  } finally {
    saving.value = false
  }
}

const publishContent = async (id) => {
  try {
    const result = await inductionStore.publishContent(id)
    showSuccess(`Content published successfully. Assigned to ${result.assignedCount} employees.`)
    await loadContents()
  } catch (err) {
    showError(err.message || 'Failed to publish content')
  }
}

const deleteContentConfirm = (content) => {
  contentToDelete.value = content
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!contentToDelete.value) return
  deleting.value = true
  try {
    await inductionStore.deleteContent(contentToDelete.value.id)
    showSuccess('Content deleted successfully')
    showDeleteModal.value = false
    contentToDelete.value = null
    await loadContents()
  } catch (err) {
    showError(err.message || 'Failed to delete content')
  } finally {
    deleting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  formData.value = {
    title: '',
    description: '',
    category: '',
    content_type: '',
    video_url: '',
    file_url: '',
    file: null,
    target_audience_type: 'onboarding_only',
    target_departments: [],
    is_mandatory: false,
    due_date: '',
    estimated_time: null,
    status: 'draft'
  }
  inductionStore.clearSelectedContent()
}

watch(showCreateModal, (val) => {
  if (val) {
    showEditModal.value = false
  }
})

watch(showEditModal, (val) => {
  if (val) {
    showCreateModal.value = false
  }
})

onMounted(async () => {
  await Promise.all([
    loadContents(),
    loadDepartments()
  ])
})
</script>

