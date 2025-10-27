<template>
  <div class="public-help-center min-h-screen bg-gray-50">
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
            <HelpSearch
              @search="handleSearch"
              @clear="handleClearSearch"
              placeholder="Search for articles, guides, and solutions..."
            />
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
            <HierarchicalCategoryList
              :categories="categories"
              :loading="loading"
              @select="handleCategorySelect"
              @select-article="handleArticleSelect"
            />
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
              
              <!-- Sort Options -->
              <div class="flex items-center space-x-2">
                <label class="text-sm text-gray-600">Sort by:</label>
                <select
                  v-model="sortBy"
                  @change="handleSortChange"
                  class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="helpful">Most Helpful</option>
                  <option value="alphabetical">A-Z</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Articles List -->
          <ArticleList
            :articles="sortedArticles"
            :loading="loading"
            :pagination="pagination"
            :search-query="searchQuery"
            @page-change="handlePageChange"
          />

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

    <!-- Popular Articles Section -->
    <div v-if="!searchQuery && !selectedCategory && !loading" class="bg-white border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Popular Articles</h2>
          <p class="text-lg text-gray-600">Most viewed and helpful articles</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="article in popularArticles"
            :key="article.id"
            @click="navigateToArticle(article)"
            class="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors duration-200 cursor-pointer group"
          >
            <div class="mb-3">
              <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {{ article.title }}
              </h3>
            </div>
            <p class="text-gray-600 text-sm line-clamp-2">{{ article.summary }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useHelpStore } from '../../store/helpStore'
import { useContext } from '@/composables/useContext'
import { demoArticles, demoCategories } from '@/data/help-demo-data.js'
import HelpSearch from '../../components/help/HelpSearch.vue'
import HierarchicalCategoryList from '../../components/help/HierarchicalCategoryList.vue'
import ArticleList from '../../components/help/ArticleList.vue'

const router = useRouter()
const helpStore = useHelpStore()
const { getTenantId } = useContext()

// Reactive data
const searchQuery = ref('')
const sortBy = ref('recent')
const currentPage = ref(1)

// Computed properties
const categories = computed(() => helpStore.categories)
const articles = computed(() => helpStore.articles)
const loading = computed(() => helpStore.loading)
const error = computed(() => helpStore.error)
const pagination = computed(() => helpStore.pagination)
const selectedCategory = computed(() => helpStore.selectedCategory)

const sortedArticles = computed(() => {
  let sorted = [...articles.value]
  
  switch (sortBy.value) {
    case 'popular':
      sorted.sort((a, b) => (b.views || 0) - (a.views || 0))
      break
    case 'helpful':
      sorted.sort((a, b) => (b.helpful_count || 0) - (a.helpful_count || 0))
      break
    case 'alphabetical':
      sorted.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'recent':
    default:
      sorted.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      break
  }
  
  return sorted
})

const popularArticles = computed(() => {
  return sortedArticles.value
    .filter(article => article.status === 'published')
    .slice(0, 6)
})

// Methods
const handleSearch = async (query) => {
  searchQuery.value = query
  helpStore.setSearchQuery(query)
  currentPage.value = 1
  await loadArticles()
}

const handleClearSearch = async () => {
  searchQuery.value = ''
  helpStore.setSearchQuery('')
  currentPage.value = 1
  await loadArticles()
}

const handleCategorySelect = async (category) => {
  helpStore.setSelectedCategory(category)
  currentPage.value = 1
  await loadArticles()
}

const handleArticleSelect = (article) => {
  navigateToArticle(article)
}

const handleSortChange = () => {
  // Sorting is handled by computed property
}

const handlePageChange = async (page) => {
  currentPage.value = page
  await loadArticles()
}

const navigateToArticle = (article) => {
  router.push(`/service/help/article/${article.slug}`)
}

const retryLoad = async () => {
  helpStore.clearError()
  await loadArticles()
}

const loadArticles = async () => {
  try {
    const tenantId = getTenantId()
    if (!tenantId) {
      console.warn('No tenant ID available - articles will be empty')
      helpStore.articles = []
      helpStore.pagination = {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
      }
      return
    }
    
    await helpStore.fetchArticles(tenantId, searchQuery.value, currentPage.value, selectedCategory.value?.id)
  } catch (error) {
    console.error('Failed to load articles:', error)
    // Don't use demo data - let the UI handle empty state
    helpStore.articles = []
    helpStore.pagination = {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    }
  }
}

const loadCategories = async () => {
  try {
    const tenantId = getTenantId()
    if (!tenantId) {
      console.warn('No tenant ID available - categories will be empty')
      helpStore.categories = []
      return
    }
    
    await helpStore.fetchCategories(tenantId)
  } catch (error) {
    console.error('Failed to load categories:', error)
    // Don't use demo data - let the UI handle empty state
    helpStore.categories = []
  }
}

const getResultsTitle = () => {
  if (searchQuery.value) {
    return `Search Results for "${searchQuery.value}"`
  } else if (selectedCategory.value) {
    return selectedCategory.value.name
  } else {
    return 'All Articles'
  }
}

const getResultsDescription = () => {
  const count = articles.value.length
  if (searchQuery.value) {
    return `${count} article${count !== 1 ? 's' : ''} found`
  } else if (selectedCategory.value) {
    return `${count} article${count !== 1 ? 's' : ''} in this category`
  } else {
    return `${count} article${count !== 1 ? 's' : ''} available`
  }
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
onMounted(async () => {
  try {
    // Only load from API - no demo data
    const tenantId = getTenantId()
    if (tenantId) {
      await Promise.all([
        loadCategories(),
        loadArticles()
      ])
    } else {
      console.warn('No tenant ID available - help center will be empty')
    }
  } catch (error) {
    console.error('Error loading help center data:', error)
    // Don't load demo data - let the UI handle empty state
  }
})

// Watch for tenant changes
watch(() => getTenantId(), async (newTenantId) => {
  if (newTenantId) {
    try {
      await Promise.all([
        loadCategories(),
        loadArticles()
      ])
    } catch (error) {
      console.error('Error reloading data for new tenant:', error)
    }
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
