<template>
  <div class="admin-knowledge-base">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Knowledge Base</h1>
              <p class="text-gray-600 mt-1">Manage your help articles and categories</p>
            </div>
            <div class="flex items-center space-x-4">
              <router-link
                to="/service/help/admin/analytics"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </router-link>
              <button
                @click="showCreateForm"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Article
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Global Notifications -->
    <div v-if="error || success" class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <!-- Error Notification -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
            <div class="ml-auto pl-3">
              <button @click="helpStore.error = null" class="text-red-400 hover:text-red-600">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Success Notification -->
        <div v-if="success" class="bg-green-50 border border-green-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-800">{{ success }}</p>
            </div>
            <div class="ml-auto pl-3">
              <button @click="helpStore.success = null" class="text-green-400 hover:text-green-600">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-8">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'articles'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'articles'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Articles
          </button>
          <button
            @click="activeTab = 'categories'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Categories
          </button>
        </nav>
      </div>

      <!-- Articles Tab -->
      <div v-if="activeTab === 'articles'">
        <!-- Search and Filters -->
        <div class="mb-6 flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Search articles..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <select
              v-model="statusFilter"
              @change="handleFilterChange"
              class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <select
              v-model="categoryFilter"
              @change="handleFilterChange"
              class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Articles Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div v-if="loading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-gray-500">Loading articles...</p>
          </div>

          <div v-else-if="filteredArticles.length === 0" class="p-8 text-center">
            <div class="text-gray-400 mb-4">
              <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p class="text-gray-500 mb-4">Get started by creating your first article.</p>
            <button
              @click="showCreateForm"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Create Article
            </button>
          </div>

          <ul v-else class="divide-y divide-gray-200">
            <li v-for="article in filteredArticles" :key="article.id" class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3">
                    <h3 class="text-lg font-medium text-gray-900 truncate">
                      {{ article.title }}
                    </h3>
                    <span
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        article.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      ]"
                    >
                      {{ article.status }}
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ article.summary }}</p>
                  <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span v-if="article.category">{{ article.category.name }}</span>
                    <span>{{ formatDate(article.updated_at) }}</span>
                    <span>{{ formatNumber(article.views || 0) }} views</span>
                    <span v-if="article.helpful_count">{{ formatNumber(article.helpful_count) }} helpful</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewArticle(article)"
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View
                  </button>
                  <button
                    @click="editArticle(article)"
                    class="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteArticle(article)"
                    class="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Categories Tab -->
      <div v-if="activeTab === 'categories'">
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Categories</h3>
              <button
                @click="showCreateCategoryForm"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Category
              </button>
            </div>
          </div>
          
          <ul class="divide-y divide-gray-200">
            <li v-for="category in categories" :key="category.id" class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-4 h-4 rounded-full"
                    :style="{ backgroundColor: category.color || '#6B7280' }"
                  ></div>
                  <div>
                    <h4 class="text-lg font-medium text-gray-900">{{ category.name }}</h4>
                    <p v-if="category.description" class="text-sm text-gray-500">{{ category.description }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-500">
                    {{ category.articles_count || 0 }} articles
                  </span>
                  <button
                    @click="editCategory(category)"
                    class="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteCategory(category)"
                    class="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Article Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ editingArticle ? 'Edit Article' : 'Create New Article' }}
            </h3>
            <button
              @click="hideForm"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <AdminArticleForm
            :article="editingArticle"
            :categories="categories"
            @submit="handleFormSubmit"
            @cancel="hideForm"
            @create-category="handleCreateCategoryFromArticleForm"
          />
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-4">Delete {{ deleteItemType }}</h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete "{{ deleteItem?.title || deleteItem?.name }}"? This action cannot be undone.
            </p>
            
            <!-- Error Message -->
            <div v-if="error" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-800">{{ error }}</p>
                </div>
              </div>
            </div>
            
            <!-- Success Message -->
            <div v-if="success" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-green-800">{{ success }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center space-x-4 mt-6">
            <button
              @click="hideDeleteModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              @click="confirmDelete"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </span>
              <span v-else>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Form Modal -->
    <div v-if="showCategoryForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ editingCategory ? 'Edit Category' : 'Create New Category' }}
            </h3>
            <button
              @click="hideCategoryForm"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <CategoryForm
            :category="editingCategory"
            @submit="handleCategoryFormSubmit"
            @cancel="hideCategoryForm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHelpStore } from '../../store/helpStore'
import { useContext } from '@/composables/useContext'
import AdminArticleForm from '../../components/help/AdminArticleForm.vue'
import CategoryForm from '../../components/help/CategoryForm.vue'

const router = useRouter()
const route = useRoute()
const helpStore = useHelpStore()
const { getTenantId } = useContext()

// Reactive data
const activeTab = ref('articles')
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const showForm = ref(false)
const editingArticle = ref(null)
const showDeleteModal = ref(false)
const deleteItem = ref(null)
const deleteItemType = ref('')
const showCategoryForm = ref(false)
const editingCategory = ref(null)

// Computed properties
const articles = computed(() => helpStore.articles)
const categories = computed(() => helpStore.categories)
const loading = computed(() => helpStore.loading)
const error = computed(() => helpStore.error)
const success = computed(() => helpStore.success)

const filteredArticles = computed(() => {
  let filtered = [...articles.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(article => article.status === statusFilter.value)
  }

  // Category filter
  if (categoryFilter.value) {
    filtered = filtered.filter(article => article.category_id === parseInt(categoryFilter.value))
  }

  return filtered
})

// Methods
const loadData = async () => {
  const tenantId = getTenantId()
  console.log('AdminKnowledgeBase loadData - tenantId:', tenantId)
  
  // Always try to load admin articles (no tenant ID needed for admin endpoint)
  // Only load categories if we have tenant ID
  try {
    console.log('Loading admin data...')
    
    const promises = [
      helpStore.fetchAdminArticles() // Admin endpoint doesn't need tenant ID
    ]
    
    if (tenantId) {
      promises.push(helpStore.fetchCategories(tenantId))
    } else {
      console.warn('No tenant ID available - skipping categories load')
    }
    
    await Promise.all(promises)
    console.log('Admin data loaded successfully')
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

const handleSearch = () => {
  // Search is handled by computed property
}

const handleFilterChange = () => {
  // Filtering is handled by computed property
}

const showCreateForm = async () => {
  editingArticle.value = null
  showForm.value = true
  
  // Always try to load fresh categories from API when form is shown
  const tenantId = getTenantId()
  if (tenantId) {
    try {
      console.log('Loading categories from API for create form...')
      await helpStore.refreshCategories(tenantId)
    } catch (error) {
      console.warn('Failed to load categories for form:', error)
    }
  }
}

const editArticle = async (article) => {
  editingArticle.value = article
  showForm.value = true
  
  // Always try to load fresh categories from API when form is shown
  const tenantId = getTenantId()
  if (tenantId) {
    try {
      console.log('Loading categories from API for edit form...')
      await helpStore.refreshCategories(tenantId)
    } catch (error) {
      console.warn('Failed to load categories for form:', error)
    }
  }
}

const hideForm = () => {
  showForm.value = false
  editingArticle.value = null
}

const handleFormSubmit = () => {
  hideForm()
  loadData() // Reload data to show changes
}

const viewArticle = (article) => {
  router.push(`/service/help/admin/articles/${article.id}`)
}

const deleteArticle = (article) => {
  deleteItem.value = article
  deleteItemType.value = 'article'
  helpStore.error = null // Clear any previous errors
  helpStore.success = null // Clear any previous success messages
  showDeleteModal.value = true
}

const deleteCategory = (category) => {
  deleteItem.value = category
  deleteItemType.value = 'category'
  helpStore.error = null // Clear any previous errors
  helpStore.success = null // Clear any previous success messages
  showDeleteModal.value = true
}

const hideDeleteModal = () => {
  showDeleteModal.value = false
  deleteItem.value = null
  deleteItemType.value = ''
  helpStore.error = null // Clear error when modal is closed
  helpStore.success = null // Clear success message when modal is closed
}

const confirmDelete = async () => {
  if (!deleteItem.value) return

  try {
    if (deleteItemType.value === 'article') {
      await helpStore.deleteArticle(deleteItem.value.id)
      hideDeleteModal()
      loadData() // Reload data to show changes
    } else if (deleteItemType.value === 'category') {
      await helpStore.deleteCategory(deleteItem.value.id)
      hideDeleteModal()
      loadData() // Reload data to show changes
    }
  } catch (error) {
    console.error('Failed to delete item:', error)
    // Don't hide modal on error - let user see the error message
    // The error will be displayed in the UI via helpStore.error
  }
}

const showCreateCategoryForm = () => {
  editingCategory.value = null
  showCategoryForm.value = true
}

const editCategory = (category) => {
  editingCategory.value = category
  showCategoryForm.value = true
}

const hideCategoryForm = () => {
  showCategoryForm.value = false
  editingCategory.value = null
}

const handleCategoryFormSubmit = async (categoryData) => {
  try {
    const tenantId = getTenantId()
    if (!tenantId) {
      console.error('No tenant ID available')
      return
    }

    if (editingCategory.value) {
      // Update existing category
      await helpStore.updateCategory(editingCategory.value.id, categoryData)
    } else {
      // Create new category
      await helpStore.createCategory(categoryData)
    }

    hideCategoryForm()
    // Reload data to show changes
    await loadData()
  } catch (error) {
    console.error('Failed to save category:', error)
  }
}

const handleCreateCategoryFromArticleForm = () => {
  showCreateCategoryForm()
}


const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Lifecycle
onMounted(() => {
  loadData()
})

// Watch for tenant changes
watch(() => getTenantId(), () => {
  loadData()
})

// Watch for edit query parameter
watch(() => route.query.edit, async (articleId) => {
  if (articleId) {
    // If articles are not loaded yet, wait for them
    if (!helpStore.adminArticles || helpStore.adminArticles.length === 0) {
      await loadData()
    }
    
    // Try to find the article
    const article = helpStore.adminArticles?.find(a => a.id == articleId)
    if (article) {
      editArticle(article)
    } else {
      console.warn('Article not found for edit:', articleId)
    }
  }
}, { immediate: true })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
