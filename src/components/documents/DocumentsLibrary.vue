<template>
  <div class="documents-library bg-gray-50 min-h-screen">
    <!-- Clean Professional Header -->
    <div class="bg-white border-b border-gray-200 mb-6">
      <div class="px-6 py-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-gray-100 rounded-lg">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl font-semibold text-gray-900">Documents</h1>
                <p class="text-sm text-gray-500 mt-1">Manage and organize your documents</p>
              </div>
            </div>
            <div class="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span>{{ pagination.total }} documents</span>
              <span>•</span>
              <span>Last updated {{ helpers.formatDate(new Date()) }}</span>
            </div>
          </div>
          <BaseButton
            v-if="canUpload"
            @click="showUploadModal = true"
            :loading="uploading"
            class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Upload Document
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Clean Filters Section -->
    <div class="bg-white border border-gray-200 rounded-lg mb-6">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-sm font-medium text-gray-900">Filters</h2>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Search documents..."
                class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                @input="debouncedSearch"
              />
            </div>
          </div>

          <!-- File Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">File Type</label>
            <select
              v-model="filters.file_type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              @change="applyFilters"
            >
              <option value="">All Types</option>
              <option value="pdf">PDF</option>
              <option value="doc">Word</option>
              <option value="xls">Excel</option>
              <option value="ppt">PowerPoint</option>
              <option value="jpg">Image</option>
              <option value="zip">Archive</option>
            </select>
          </div>

          <!-- Visibility -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
            <select
              v-model="filters.visibility"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              @change="applyFilters"
            >
              <option value="">All Visibility</option>
              <option value="private">Private</option>
              <option value="team">Team</option>
              <option value="tenant">Tenant</option>
              <option value="public">Public</option>
            </select>
          </div>

          <!-- Team (if enabled) -->
          <div v-if="teamAccessEnabled">
            <label class="block text-sm font-medium text-gray-700 mb-1">Team</label>
            <select
              v-model="filters.team_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              @change="applyFilters"
            >
              <option value="">All Teams</option>
              <option v-for="team in teams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div class="flex items-center gap-4">
            <button
              @click="clearFilters"
              class="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear filters
            </button>
            <span class="text-sm text-gray-500">
              {{ pagination.total }} documents found
            </span>
          </div>
          
          <!-- Sort -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-700">Sort by:</label>
            <select
              v-model="filters.sort_by"
              class="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              @change="applyFilters"
            >
              <option value="created_at">Date Created</option>
              <option value="title">Title</option>
              <option value="file_size">File Size</option>
              <option value="view_count">Views</option>
            </select>
            <button
              @click="toggleSortOrder"
              class="p-1 hover:bg-gray-100 rounded"
              :title="filters.sort_order === 'asc' ? 'Sort Ascending' : 'Sort Descending'"
            >
              <svg class="w-4 h-4 text-gray-500" :class="{ 'rotate-180': filters.sort_order === 'desc' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Clean Documents Container -->
    <div class="bg-white border border-gray-200 rounded-lg">
      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-500 mt-2 text-sm">Loading documents...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="documents.length === 0" class="p-8 text-center">
        <div class="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
        <p class="text-gray-500 mb-6 text-sm max-w-sm mx-auto">Get started by uploading your first document to organize your files and collaborate with your team.</p>
        <BaseButton
          v-if="canUpload"
          @click="showUploadModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Upload Document
        </BaseButton>
      </div>

      <!-- Documents List -->
      <div v-else class="divide-y divide-gray-200">
        <!-- Desktop Table View -->
        <div class="hidden md:block">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th v-if="teamAccessEnabled" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visibility
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="document in documents" :key="document.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                        {{ helpers.getFileTypeIcon(document.file_type) }}
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ document.title || document.file_name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ document.description || 'No description' }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="helpers.getFileTypeColor(document.file_type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ document.file_type?.toUpperCase() || 'Unknown' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ helpers.formatFileSize(document.file_size) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span class="text-xs font-medium text-gray-600">
                        {{ document.owner?.name?.charAt(0) || '?' }}
                      </span>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">
                        {{ document.owner?.name || 'Unknown' }}
                      </div>
                    </div>
                  </div>
                </td>
                <td v-if="teamAccessEnabled" class="px-6 py-4 whitespace-nowrap">
                  <span v-if="document.team" :class="helpers.getTeamBadgeColor(document.team.id, document.team.name)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ document.team.name }}
                  </span>
                  <span v-else class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    No Team
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="helpers.getVisibilityColor(document.visibility)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ document.visibility || 'private' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ document.view_count || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ helpers.formatDate(document.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      v-if="helpers.isPreviewable(document.file_type)"
                      @click="previewDocument(document)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Preview"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      @click="downloadDocument(document)"
                      :disabled="downloading"
                      class="text-green-600 hover:text-green-900 disabled:opacity-50"
                      title="Download"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <button
                      v-if="canEditDocument(document)"
                      @click="editDocument(document)"
                      class="text-yellow-600 hover:text-yellow-900"
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      v-if="canDeleteDocument(document)"
                      @click="confirmDelete(document)"
                      class="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden">
          <div v-for="document in documents" :key="document.id" class="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                  {{ helpers.getFileTypeIcon(document.file_type) }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-sm font-medium text-gray-900 truncate">
                      {{ document.title || document.file_name }}
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">
                      {{ document.description || 'No description' }}
                    </p>
                  </div>
                  <div class="flex items-center space-x-2 ml-2">
                    <button
                      v-if="helpers.isPreviewable(document.file_type)"
                      @click="previewDocument(document)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      @click="downloadDocument(document)"
                      class="text-green-600 hover:text-green-900"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span :class="helpers.getFileTypeColor(document.file_type)" class="inline-flex px-2 py-1 font-semibold rounded-full">
                    {{ document.file_type?.toUpperCase() || 'Unknown' }}
                  </span>
                  <span>{{ helpers.formatFileSize(document.file_size) }}</span>
                  <span>{{ document.view_count || 0 }} views</span>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <div class="flex items-center space-x-2">
                    <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <span class="text-xs font-medium text-gray-600">
                        {{ document.owner?.name?.charAt(0) || '?' }}
                      </span>
                    </div>
                    <span class="text-xs text-gray-500">{{ document.owner?.name || 'Unknown' }}</span>
                  </div>
                  <span :class="helpers.getVisibilityColor(document.visibility)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ document.visibility || 'private' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Clean Pagination -->
      <div v-if="pagination.last_page > 1" class="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="goToPage(pagination.current_page - 1)"
            :disabled="pagination.current_page <= 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="goToPage(pagination.current_page + 1)"
            :disabled="pagination.current_page >= pagination.last_page"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ (pagination.current_page - 1) * pagination.per_page + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}</span>
              of
              <span class="font-medium">{{ pagination.total }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="goToPage(pagination.current_page - 1)"
                :disabled="pagination.current_page <= 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  page === pagination.current_page
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="goToPage(pagination.current_page + 1)"
                :disabled="pagination.current_page >= pagination.last_page"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Next</span>
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <DocumentUploadModal
      v-if="showUploadModal"
      @close="showUploadModal = false"
      @uploaded="handleDocumentUploaded"
    />

    <!-- Edit Modal -->
    <DocumentEditModal
      v-if="showEditModal && selectedDocument"
      :document="selectedDocument"
      @close="showEditModal = false"
      @updated="handleDocumentUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <DocumentDeleteModal
      v-if="showDeleteModal && selectedDocument"
      :document="selectedDocument"
      @close="showDeleteModal = false"
      @deleted="handleDocumentDeleted"
    />

    <!-- Preview Modal -->
    <DocumentPreviewModal
      v-if="showPreviewModal && selectedDocument"
      :document="selectedDocument"
      @close="showPreviewModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDocuments } from '@/composables/useDocuments'
import { fetchUsersForDropdown } from '@/helpers/fetchUsersForDropdown'
import BaseButton from '@/components/ui/BaseButton.vue'
import DocumentUploadModal from './DocumentUploadModal.vue'
import DocumentEditModal from './DocumentEditModal.vue'
import DocumentDeleteModal from './DocumentDeleteModal.vue'
import DocumentPreviewModal from './DocumentPreviewModal.vue'

// Composables
const {
  documents,
  loading,
  uploading,
  downloading,
  pagination,
  filters,
  canUpload,
  teamAccessEnabled,
  canEditDocument,
  canDeleteDocument,
  helpers,
  fetchDocuments,
  uploadDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
  clearFilters,
  resetPagination
} = useDocuments()

// State
const showUploadModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showPreviewModal = ref(false)
const selectedDocument = ref(null)
const teams = ref([])
const searchTimeout = ref(null)

// Computed
const visiblePages = computed(() => {
  const current = pagination.current_page
  const last = pagination.last_page
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (current + delta < last - 1) {
    rangeWithDots.push('...', last)
  } else if (last > 1) {
    rangeWithDots.push(last)
  }

  return rangeWithDots.filter((page, index, array) => array.indexOf(page) === index)
})

// Methods
const debouncedSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  searchTimeout.value = setTimeout(() => {
    applyFilters()
  }, 300)
}

const applyFilters = () => {
  resetPagination()
  fetchDocuments()
}

const toggleSortOrder = () => {
  filters.sort_order = filters.sort_order === 'asc' ? 'desc' : 'asc'
  applyFilters()
}

const goToPage = (page) => {
  if (page >= 1 && page <= pagination.last_page) {
    pagination.current_page = page
    fetchDocuments()
  }
}

const previewDocument = (document) => {
  // Validate document and ID before opening preview
  if (!document || !document.id) {
    console.error('Invalid document for preview:', document)
    return
  }
  
  selectedDocument.value = document
  showPreviewModal.value = true
}

const editDocument = (document) => {
  selectedDocument.value = document
  showEditModal.value = true
}

const confirmDelete = (document) => {
  selectedDocument.value = document
  showDeleteModal.value = true
}

const handleDocumentUploaded = (document) => {
  showUploadModal.value = false
  // Document is already added to the list by uploadDocument function
  // No need to fetch again as it might cause race conditions
}

const handleDocumentUpdated = (document) => {
  showEditModal.value = false
  selectedDocument.value = null
  fetchDocuments()
}

const handleDocumentDeleted = () => {
  showDeleteModal.value = false
  selectedDocument.value = null
  fetchDocuments()
}

const loadTeams = async () => {
  if (teamAccessEnabled.value) {
    try {
      teams.value = await fetchUsersForDropdown({ type: 'teams' })
    } catch (error) {
      console.error('Error loading teams:', error)
    }
  }
}

// Lifecycle
onMounted(() => {
  fetchDocuments()
  loadTeams()
})

// Watchers
watch(() => filters, () => {
  applyFilters()
}, { deep: true })
</script>

<script>
export default {
  name: 'DocumentsLibrary'
}
</script>
