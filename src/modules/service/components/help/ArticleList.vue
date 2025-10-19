<template>
  <div class="article-list">
    <!-- Articles Grid -->
    <div v-if="articles.length > 0" class="space-y-6">
      <article
        v-for="article in articles"
        :key="article.id"
        @click="navigateToArticle(article)"
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
      >
        <div class="p-6">
          <!-- Article Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                {{ article.title }}
              </h3>
              
              <!-- Category Badge -->
              <div v-if="article.category" class="flex items-center mb-3">
                <div 
                  class="w-2 h-2 rounded-full mr-2" 
                  :style="{ backgroundColor: article.category.color || '#6B7280' }"
                ></div>
                <span class="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  {{ article.category.name }}
                </span>
              </div>
            </div>
            
            <!-- Status Badge -->
            <div v-if="showStatus" class="ml-4">
              <span 
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  article.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                ]"
              >
                {{ article.status }}
              </span>
            </div>
          </div>

          <!-- Article Summary -->
          <p class="text-gray-600 mb-4 line-clamp-3">
            {{ article.summary }}
          </p>

          <!-- Article Footer -->
          <div class="flex items-center justify-between text-sm text-gray-500">
            <!-- Last Updated -->
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ formatDate(article.updated_at) }}
            </div>

            <!-- Read More Arrow -->
            <div class="flex items-center text-blue-600 group-hover:text-blue-700">
              <span class="mr-1">Read more</span>
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- No Articles Message -->
    <div v-else-if="!loading" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
      <p class="text-gray-500">
        {{ searchQuery ? 'Try adjusting your search terms' : 'No articles are available at the moment' }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="h-6 bg-gray-200 rounded mb-3"></div>
          <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
          <div class="flex justify-between">
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.last_page > 1" class="mt-8 flex justify-center">
      <nav class="flex items-center space-x-2">
        <!-- Previous Button -->
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page <= 1"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
            pagination.current_page <= 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          Previous
        </button>

        <!-- Page Numbers -->
        <template v-for="page in getPageNumbers()" :key="page">
          <button
            v-if="page !== '...'"
            @click="changePage(page)"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
              page === pagination.current_page
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            {{ page }}
          </button>
          <span v-else class="px-3 py-2 text-sm text-gray-500">...</span>
        </template>

        <!-- Next Button -->
        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page >= pagination.last_page"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
            pagination.current_page >= pagination.last_page
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useHelpStore } from '../../store/helpStore'

const props = defineProps({
  articles: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: null
  },
  searchQuery: {
    type: String,
    default: ''
  },
  showStatus: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['page-change'])

const router = useRouter()
const helpStore = useHelpStore()

const navigateToArticle = (article) => {
  router.push(`/help/article/${article.slug}`)
}

const changePage = (page) => {
  if (page >= 1 && page <= props.pagination.last_page) {
    emit('page-change', page)
  }
}

const getPageNumbers = () => {
  if (!props.pagination) return []
  
  const current = props.pagination.current_page
  const last = props.pagination.last_page
  const pages = []
  
  if (last <= 7) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(last)
    } else if (current >= last - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = last - 4; i <= last; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(last)
    }
  }
  
  return pages
}

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString()
  }
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
