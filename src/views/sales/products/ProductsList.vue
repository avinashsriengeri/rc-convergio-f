<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('sales.products.title') }}</h1>
          <p class="text-gray-600">{{ $t('sales.products.subtitle') }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <BaseButton
            variant="outline"
            @click="exportProducts"
            :loading="exporting"
            v-if="products && products.length > 0"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            {{ $t('common.export') }}
          </BaseButton>
          <BaseButton
            variant="primary"
            @click="createProduct"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {{ $t('sales.products.create_product') }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              @input="debouncedSearch"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="statusFilter"
            @change="applyFilters"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- Clear Filters -->
        <div class="flex items-end">
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear filters
          </button>
        </div>
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

    <!-- Products Table -->
    <div v-else-if="products && products.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tax Rate
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
            <tr
              v-for="product in products"
              :key="product.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div v-if="product.description" class="text-sm text-gray-500">{{ product.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ product.sku || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${{ formatCurrency(product.unit_price) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ product.tax_rate }}%
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(product.is_active ? 'active' : 'inactive')" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ product.is_active ? 'active' : 'inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(product.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewProduct(product)"
                    class="text-blue-600 hover:text-blue-800"
                    title="View Product"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>

                  <button
                    @click="editProduct(product)"
                    class="text-indigo-600 hover:text-indigo-800"
                    title="Edit Product"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>

                  <button
                    @click="toggleStatus(product)"
                    :class="product.is_active ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'"
                    :title="product.is_active ? 'Deactivate' : 'Activate'"
                  >
                    <svg v-if="product.is_active" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>

                  <button
                    @click="deleteProduct(product)"
                    class="text-red-600 hover:text-red-800"
                    title="Delete Product"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first product.</p>
        <div class="mt-6">
          <BaseButton
            variant="primary"
            @click="createProduct"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {{ $t('sales.products.create_product') }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Product Modal -->
    <ProductModal
      v-if="showProductModal"
      :product="selectedProduct"
      :is-edit="isEdit"
      @save="handleSaveProduct"
      @close="showProductModal = false"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      title="Delete Product"
      :message="`Are you sure you want to delete ${productToDelete?.name}? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuotesStore } from '@/stores/quotesStore'
import { debounce } from 'lodash-es'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'
import ProductModal from '@/components/modals/ProductModal.vue'

const quotesStore = useQuotesStore()

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const exporting = ref(false)
const showProductModal = ref(false)
const showDeleteModal = ref(false)
const selectedProduct = ref(null)
const isEdit = ref(false)
const productToDelete = ref(null)

// Computed
const products = computed(() => quotesStore.products)
const loading = computed(() => quotesStore.loading)

const hasActiveFilters = computed(() => {
  return searchQuery.value || statusFilter.value
})

// Methods
const loadProducts = async () => {
  const params = {
    q: searchQuery.value,
    status: statusFilter.value
  }
  
  try {
    await quotesStore.fetchProducts(params)
  } catch (error) {
    console.error('Error loading products:', error)
  }
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 300)

const applyFilters = () => {
  quotesStore.setFilters({
    q: searchQuery.value,
    status: statusFilter.value
  })
  loadProducts()
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  loadProducts()
}

const createProduct = () => {
  selectedProduct.value = null
  isEdit.value = false
  showProductModal.value = true
}

const viewProduct = (product) => {
  selectedProduct.value = product
  isEdit.value = false
  showProductModal.value = true
}

const editProduct = (product) => {
  selectedProduct.value = product
  isEdit.value = true
  showProductModal.value = true
}

const handleSaveProduct = async (productData) => {
  try {
    if (isEdit.value) {
      await quotesStore.updateProduct(selectedProduct.value.id, productData)
    } else {
      await quotesStore.createProduct(productData)
    }
    showProductModal.value = false
    loadProducts()
  } catch (error) {
    console.error('Error saving product:', error)
  }
}

const toggleStatus = async (product) => {
  try {
    const newStatus = !product.is_active
    await quotesStore.updateProduct(product.id, { ...product, is_active: newStatus })
    loadProducts()
  } catch (error) {
    console.error('Error updating product status:', error)
  }
}

const deleteProduct = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (productToDelete.value) {
    try {
      await quotesStore.deleteProduct(productToDelete.value.id)
      showDeleteModal.value = false
      productToDelete.value = null
      loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }
}

const exportProducts = async () => {
  exporting.value = true
  try {
    // TODO: Implement export functionality
    console.log('Export products functionality to be implemented')
  } catch (error) {
    console.error('Error exporting products:', error)
  } finally {
    exporting.value = false
  }
}

const formatCurrency = (amount) => {
  if (!amount) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(() => {
  loadProducts()
})
</script>
