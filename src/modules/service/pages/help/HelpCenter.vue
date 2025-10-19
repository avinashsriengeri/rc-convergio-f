<template>
  <div class="help-center min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-8">
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to your questions and get the support you need
            </p>
          </div>
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search for articles, guides, and solutions..."
                class="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="handleSearch"
                @keyup.enter="performSearch"
              />
              <svg class="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Advanced Search Toggle -->
          <div class="max-w-2xl mx-auto mt-4">
            <button
              @click="showAdvancedSearch = !showAdvancedSearch"
              class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              {{ showAdvancedSearch ? 'Hide' : 'Show' }} Advanced Search
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Search Panel -->
    <div v-if="showAdvancedSearch" class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Category Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              v-model="filters.category"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              v-model="filters.dateRange"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <!-- Author Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Author</label>
            <input
              v-model="filters.author"
              type="text"
              placeholder="Search by author..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Sort By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              v-model="filters.sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="views">Views</option>
              <option value="helpfulness">Helpfulness</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        <!-- Advanced Search Actions -->
        <div class="flex items-center justify-between mt-6">
          <div class="flex items-center space-x-4">
            <button
              @click="applyFilters"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
              <span v-else>Search</span>
            </button>
            <button
              @click="clearFilters"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Clear Filters
            </button>
          </div>
          <div class="text-sm text-gray-500">
            {{ totalResults }} results found
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar - Categories -->
        <div class="lg:w-1/4">
          <div class="sticky top-8">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div class="space-y-2">
                <button
                  v-for="category in categories"
                  :key="category.id"
                  @click="selectCategory(category.id)"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  {{ category.name }}
                  <span class="ml-2 text-xs text-gray-500">({{ category.articles_count || 0 }})</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content - Articles -->
        <div class="lg:w-3/4">
          <!-- Results Header -->
          <div v-if="!loading" class="mb-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-semibold text-gray-900">
                  {{ getResultsTitle() }}
                </h2>
                <p class="text-gray-600 mt-1">
                  {{ getResultsDescription() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="space-y-4">
            <div v-for="i in 3" :key="i" class="animate-pulse">
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div class="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div class="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>

          <!-- Articles List -->
          <div v-else-if="articles.length > 0" class="space-y-4">
            <div
              v-for="article in articles"
              :key="article.id"
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              @click="viewArticle(article)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ article.title }}</h3>
                  <p class="text-gray-600 mb-3 line-clamp-2">{{ article.summary }}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span v-if="article.category" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ article.category.name }}
                    </span>
                    <span v-if="article.author">
                      By {{ article.author.name }}
                    </span>
                    <span v-if="article.updated_at">
                      {{ formatDate(article.updated_at) }}
                    </span>
                    <span v-if="article.views">
                      {{ formatNumber(article.views) }} views
                    </span>
                    <span v-if="article.helpful_percentage">
                      {{ article.helpful_percentage }}% helpful
                    </span>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p class="text-gray-500 mb-4">Try adjusting your search criteria or browse by category.</p>
            <button
              @click="clearFilters"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>

          <!-- Error State -->
          <div v-if="error && !loading" class="text-center py-12">
            <div class="text-red-400 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
            <p class="text-gray-500 mb-4">{{ error }}</p>
            <button
              @click="retryLoad"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useArticles } from '@/composables/useArticles.js'
import { useHelpStore } from '@/modules/service/store/helpStore.js'
import { useContext } from '@/composables/useContext.js'

// Router
const router = useRouter()

// Composables
const { searchArticles, loading, error } = useArticles()
const helpStore = useHelpStore()
const { getTenantId } = useContext()

// State
const searchQuery = ref('')
const showAdvancedSearch = ref(false)
const selectedCategory = ref(null)
const totalResults = ref(0)

const filters = reactive({
  category: '',
  dateRange: '',
  author: '',
  sortBy: 'relevance'
})

const articles = ref([])
const categories = ref([])

// Computed
const hasActiveFilters = computed(() => {
  return filters.category || filters.dateRange || filters.author || filters.sortBy !== 'relevance'
})

// Methods
const loadCategories = async () => {
  try {
    const tenantId = getTenantId()
    if (tenantId) {
      await helpStore.fetchCategories(tenantId)
      categories.value = helpStore.categories
    }
  } catch (err) {
    console.error('Failed to load categories:', err)
  }
}

const performSearch = async () => {
  if (!searchQuery.value.trim() && !hasActiveFilters.value) {
    return
  }

  try {
    const searchFilters = {
      query: searchQuery.value.trim(),
      ...filters
    }

    // Remove empty filters
    Object.keys(searchFilters).forEach(key => {
      if (!searchFilters[key]) {
        delete searchFilters[key]
      }
    })

    const response = await searchArticles(searchFilters)
    articles.value = response.data || response.articles || []
    totalResults.value = response.total || articles.value.length
  } catch (err) {
    console.error('Search failed:', err)
  }
}

const applyFilters = () => {
  performSearch()
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.category = ''
  filters.dateRange = ''
  filters.author = ''
  filters.sortBy = 'relevance'
  selectedCategory.value = null
  articles.value = []
  totalResults.value = 0
}

const clearSearch = () => {
  searchQuery.value = ''
  performSearch()
}

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  filters.category = categoryId
  performSearch()
}

const viewArticle = (article) => {
  router.push(`/help/article/${article.slug}`)
}

const getResultsTitle = () => {
  if (searchQuery.value) {
    return `Search Results for "${searchQuery.value}"`
  } else if (selectedCategory.value) {
    const category = categories.value.find(c => c.id === selectedCategory.value)
    return category ? category.name : 'Category Articles'
  } else if (hasActiveFilters.value) {
    return 'Filtered Results'
  } else {
    return 'All Articles'
  }
}

const getResultsDescription = () => {
  if (articles.value.length === 0) {
    return 'No articles found matching your criteria.'
  } else if (searchQuery.value) {
    return `Found ${totalResults.value} articles matching your search.`
  } else {
    return `Showing ${totalResults.value} articles.`
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatNumber = (num) => {
  if (!num) return '0'
  return num.toLocaleString()
}

const retryLoad = () => {
  performSearch()
}

// Watchers
watch(filters, () => {
  // Auto-search when filters change (debounced)
  clearTimeout(window.filterTimeout)
  window.filterTimeout = setTimeout(() => {
    if (hasActiveFilters.value) {
      performSearch()
    }
  }, 500)
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadCategories()
})
</script>
