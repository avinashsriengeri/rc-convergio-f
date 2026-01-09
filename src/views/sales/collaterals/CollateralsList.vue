<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Collateral</h1>
          <p class="text-gray-600">Manage your product collateral files</p>
        </div>
        <div class="flex items-center space-x-3">
          <BaseButton
            variant="outline"
            @click="exportCollaterals"
            :loading="exporting"
            v-if="collaterals && collaterals.length > 0"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </BaseButton>
          <BaseButton
            variant="primary"
            @click="createCollateral"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Collateral
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <label for="search-input" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search-input"
              v-model="searchQuery"
              type="text"
              placeholder="Search collaterals..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-purple focus:border-primary-purple text-sm"
              @input="debouncedSearch"
            />
          </div>
        </div>

        <!-- Product Filter -->
        <div>
          <label for="product-filter" class="block text-sm font-medium text-gray-700 mb-1">Product</label>
          <select
            id="product-filter"
            v-model="productFilter"
            @change="applyFilters"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-purple focus:border-primary-purple text-sm"
          >
            <option value="">All Products</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }}
            </option>
          </select>
        </div>

        <!-- Type Filter -->
        <div>
          <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            id="type-filter"
            v-model="typeFilter"
            @change="applyFilters"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-purple focus:border-primary-purple text-sm"
          >
            <option value="">All Types</option>
            <option v-for="type in types" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status-filter"
            v-model="statusFilter"
            @change="applyFilters"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-purple focus:border-primary-purple text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Clear Filters -->
      <div class="mt-4">
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          type="button"
          class="text-sm text-primary-purple hover:text-primary-purple"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="animate-pulse">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Collaterals Table -->
    <div v-else-if="collaterals && collaterals.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SINo#
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collateral Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(collateral, index) in collaterals"
              :key="collateral.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ index + 1 + (pagination.from - 1) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ collateral.product_name || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ collateral.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ collateral.collateral_type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(collateral.is_active)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ collateral.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="previewCollateral(collateral)"
                    class="text-blue-600 hover:text-blue-800"
                    :aria-label="`Preview ${collateral.name}`"
                    type="button"
                    title="Preview"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button
                    @click="downloadCollateral(collateral)"
                    class="text-green-600 hover:text-green-800"
                    :aria-label="`Download ${collateral.name}`"
                    type="button"
                    title="Download"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>

                  <button
                    @click="editCollateral(collateral)"
                    class="text-indigo-600 hover:text-indigo-800"
                    :aria-label="`Edit ${collateral.name}`"
                    type="button"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    @click="deleteCollateral(collateral)"
                    class="text-red-600 hover:text-red-800"
                    :aria-label="`Delete ${collateral.name}`"
                    type="button"
                    title="Delete"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <BaseButton
            variant="outline"
            :disabled="pagination.current_page === 1"
            @click="goToPage(pagination.current_page - 1)"
          >
            Previous
          </BaseButton>
          <BaseButton
            variant="outline"
            :disabled="pagination.current_page === pagination.last_page"
            @click="goToPage(pagination.current_page + 1)"
          >
            Next
          </BaseButton>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ pagination.from }}</span> to <span class="font-medium">{{ pagination.to }}</span> of <span class="font-medium">{{ pagination.total }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                type="button"
                :disabled="pagination.current_page === 1"
                @click="goToPage(pagination.current_page - 1)"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                type="button"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === pagination.current_page
                    ? 'z-10 bg-primary-purple border-primary-purple text-white'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  typeof page === 'string' ? 'cursor-default' : ''
                ]"
                :disabled="typeof page === 'string'"
                :aria-label="`Go to page ${page}`"
                :aria-current="page === pagination.current_page ? 'page' : undefined"
              >
                {{ page }}
              </button>
              <button
                type="button"
                :disabled="pagination.current_page === pagination.last_page"
                @click="goToPage(pagination.current_page + 1)"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No collaterals found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by uploading your first collateral.</p>
        <div class="mt-6">
          <BaseButton
            variant="primary"
            @click="createCollateral"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Collateral
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <CollateralUploadModal
      v-if="showUploadModal"
      :product-id="selectedProductId"
      @uploaded="handleUploaded"
      @close="showUploadModal = false"
    />

    <!-- Edit Modal -->
    <CollateralEditModal
      v-if="showEditModal"
      :collateral="selectedCollateral"
      @updated="handleUpdated"
      @close="showEditModal = false"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      title="Delete Collateral"
      :message="`Are you sure you want to delete ${collateralToDelete?.name}? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCollateralsStore } from '@/stores/collateralsStore'
import { useQuotesStore } from '@/stores/quotesStore'
import { debounce } from 'lodash-es'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'
import CollateralUploadModal from '@/components/modals/CollateralUploadModal.vue'
import CollateralEditModal from '@/components/modals/CollateralEditModal.vue'
import type { Collateral } from '@/types/collateral'
import { success, error } from '@/utils/notifications'

const collateralsStore = useCollateralsStore()
const quotesStore = useQuotesStore()

// Reactive data
const searchQuery = ref('')
const productFilter = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const exporting = ref(false)
const showUploadModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedCollateral = ref<Collateral | null>(null)
const selectedProductId = ref<number | null>(null)
const collateralToDelete = ref<Collateral | null>(null)

// Computed
const collaterals = computed(() => collateralsStore.collaterals)
const loading = computed(() => collateralsStore.loading)
const types = computed(() => collateralsStore.types)
const products = computed(() => quotesStore.products)
const pagination = computed(() => collateralsStore.pagination)

const hasActiveFilters = computed(() => {
  return searchQuery.value || productFilter.value || typeFilter.value || statusFilter.value
})

const visiblePages = computed(() => {
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const delta = 2
  const range: (number | string)[] = []
  const rangeWithDots: (number | string)[] = []

  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i += 1) {
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
const loadCollaterals = async () => {
  const params: Record<string, unknown> = {
    search: searchQuery.value || undefined,
    product_id: productFilter.value || undefined,
    collateral_type: typeFilter.value || undefined,
    is_active: statusFilter.value ? statusFilter.value === 'true' : undefined,
    per_page: pagination.value.per_page,
    page: pagination.value.current_page
  }

  // Remove undefined values
  Object.keys(params).forEach((key) => {
    if (params[key] === undefined) {
      delete params[key]
    }
  })

  try {
    await collateralsStore.fetchCollaterals(params)
  } catch (err) {
    console.error('Error loading collaterals:', err)
  }
}

const debouncedSearch = debounce(() => {
  pagination.value.current_page = 1
  applyFilters()
}, 300)

const applyFilters = () => {
  pagination.value.current_page = 1
  loadCollaterals()
}

const clearFilters = () => {
  searchQuery.value = ''
  productFilter.value = ''
  typeFilter.value = ''
  statusFilter.value = ''
  pagination.value.current_page = 1
  loadCollaterals()
}

const createCollateral = () => {
  selectedProductId.value = null
  showUploadModal.value = true
}

// Helper function to get MIME type from extension
const getMimeTypeFromExtension = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  }
  return mimeTypes[extension?.toLowerCase() || ''] || 'application/octet-stream'
}

const previewCollateral = async (collateral: Collateral) => {
  try {
    const response = await collateralsStore.previewCollateral(collateral.id)
    
    // Get MIME type from response headers (axios normalizes headers to lowercase)
    // Check both lowercase and original case for compatibility
    const contentType = response.headers?.['content-type'] || 
      response.headers?.['Content-Type'] ||
      (collateral.file_type || getMimeTypeFromExtension(collateral.file_extension || ''))
    
    // Create blob with proper MIME type so browser can render it correctly
    const blob = new Blob([response.data], { type: contentType })
    const url = window.URL.createObjectURL(blob)
    
    // Determine file type
    const fileExtension = collateral.file_extension?.toLowerCase() || ''
    const isPowerPoint = fileExtension === 'ppt' || fileExtension === 'pptx'
    const isPdf = fileExtension === 'pdf'
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)
    
    if (isPowerPoint) {
      // PowerPoint: Trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = `${collateral.name}.${fileExtension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      success('PowerPoint file download started')
    } else if (isPdf || isImage) {
      // PDF/Images: Open in new tab with proper MIME type
      const newWindow = window.open(url, '_blank')
      if (newWindow) {
        // URL will be revoked when the tab is closed
        newWindow.addEventListener('beforeunload', () => {
          window.URL.revokeObjectURL(url)
        })
      } else {
        // If popup blocked, fallback to download
        const link = document.createElement('a')
        link.href = url
        link.download = `${collateral.name}.${fileExtension}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        success('File download started')
      }
    } else {
      // Other types: Trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = `${collateral.name}.${fileExtension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      success('File download started')
    }
  } catch (err) {
    console.error('Error previewing collateral:', err)
    const errorMessage = err && typeof err === 'object' && 'response' in err
      ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to preview collateral'
      : 'Failed to preview collateral'
    error(errorMessage)
  }
}

const downloadCollateral = async (collateral: Collateral) => {
  try {
    const response = await collateralsStore.downloadCollateral(collateral.id)
    
    // Get MIME type from response headers (axios normalizes headers to lowercase)
    // Check both lowercase and original case for compatibility
    const contentType = response.headers?.['content-type'] || 
      response.headers?.['Content-Type'] ||
      getMimeTypeFromExtension(collateral.file_extension || '')
    
    const blob = new Blob([response.data], { type: contentType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${collateral.name}.${collateral.file_extension || 'file'}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    success(`${collateral.name} downloaded successfully`)
  } catch (err) {
    console.error('Error downloading collateral:', err)
    const errorMessage = err && typeof err === 'object' && 'response' in err
      ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to download collateral'
      : 'Failed to download collateral'
    error(errorMessage)
  }
}

const editCollateral = (collateral: Collateral) => {
  selectedCollateral.value = collateral
  showEditModal.value = true
}

const handleUploaded = () => {
  loadCollaterals()
}

const handleUpdated = () => {
  loadCollaterals()
}

const deleteCollateral = (collateral: Collateral) => {
  collateralToDelete.value = collateral
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (collateralToDelete.value) {
    try {
      await collateralsStore.deleteCollateral(collateralToDelete.value.id)
      showDeleteModal.value = false
      collateralToDelete.value = null
      loadCollaterals()
    } catch (err) {
      console.error('Error deleting collateral:', err)
    }
  }
}

const exportCollaterals = async () => {
  exporting.value = true
  try {
    // TODO: Implement export functionality
    // Export functionality to be implemented
  } catch (err) {
    console.error('Error exporting collaterals:', err)
  } finally {
    exporting.value = false
  }
}

const goToPage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page
    loadCollaterals()
  }
}

const getStatusBadgeClass = (isActive: boolean) => {
  return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    collateralsStore.fetchTypes(),
    quotesStore.fetchProducts({})
  ])
  await loadCollaterals()
})
</script>

