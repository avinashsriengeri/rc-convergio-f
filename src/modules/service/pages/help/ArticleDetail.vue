<template>
  <div class="article-detail min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded mb-4"></div>
        <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded mb-8 w-1/2"></div>
        <div class="space-y-4">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center py-12">
        <div class="text-red-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Article not found</h3>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <button
          @click="$router.push('/service/help')"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Back to Help Center
        </button>
      </div>
    </div>

    <!-- Article Content -->
    <div v-else-if="article" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <router-link to="/service/help" class="hover:text-blue-600 transition-colors duration-200">
              Help Center
            </router-link>
          </li>
          <li>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </li>
          <li v-if="article.category">
            <span>{{ article.category.name }}</span>
          </li>
          <li v-if="article.category">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </li>
          <li class="text-gray-900 font-medium">{{ article.title }}</li>
        </ol>
      </nav>

      <!-- Article Header -->
      <header class="mb-8">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ article.title }}</h1>
            
            <!-- Category Badge -->
            <div v-if="article.category" class="flex items-center mb-4">
              <div 
                class="w-3 h-3 rounded-full mr-2" 
                :style="{ backgroundColor: article.category.color || '#6B7280' }"
              ></div>
              <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {{ article.category.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Article Meta -->
        <div class="flex items-center justify-between text-sm text-gray-500 border-b border-gray-200 pb-4">
          <div class="flex items-center space-x-6">
            <!-- Views -->
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ formatNumber(article.views || 0) }} views
            </div>

            <!-- Last Updated -->
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Updated {{ formatDate(article.updated_at) }}
            </div>
          </div>

          <!-- Share Button -->
          <button
            @click="shareArticle"
            class="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </header>

      <!-- Article Summary -->
      <div v-if="article.summary" class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
        <p class="text-blue-800 font-medium">{{ article.summary }}</p>
      </div>

      <!-- Article Content -->
      <div class="prose prose-lg max-w-none mb-8">
        <div v-html="renderedContent"></div>
      </div>

      <!-- Feedback Section -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Was this article helpful?</h3>
        
        <div v-if="!feedbackSubmitted" class="flex items-center space-x-4">
          <button
            @click="submitFeedback('helpful')"
            :disabled="submittingFeedback"
            class="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            Yes, helpful
          </button>
          
          <button
            @click="submitFeedback('not_helpful')"
            :disabled="submittingFeedback"
            class="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.834a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
            </svg>
            No, not helpful
          </button>
        </div>

        <!-- Feedback Submitted -->
        <div v-else class="text-center">
          <div class="text-green-600 mb-2">
            <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="text-gray-600 mb-4">Thank you for your feedback!</p>
          
          <!-- Raise Ticket Button for Not Helpful -->
          <button
            v-if="userFeedback === 'not_helpful'"
            @click="openTicketForm"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Raise a Support Ticket
          </button>
        </div>

        <!-- Feedback Stats -->
        <div v-if="article.helpful_count || article.not_helpful_count" class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              {{ formatNumber(article.helpful_count || 0) }} found helpful
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.834a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
              </svg>
              {{ formatNumber(article.not_helpful_count || 0) }} not helpful
            </div>
          </div>
        </div>
      </div>

      <!-- Related Articles -->
      <div v-if="relatedArticles.length > 0" class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
        <div class="space-y-3">
          <div
            v-for="relatedArticle in relatedArticles"
            :key="relatedArticle.id"
            @click="navigateToArticle(relatedArticle)"
            class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
          >
            <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div class="flex-1">
              <h4 class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {{ relatedArticle.title }}
              </h4>
              <p class="text-sm text-gray-500 mt-1">{{ relatedArticle.summary }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHelpStore } from '../../store/helpStore'
import { useContext } from '@/composables/useContext'
import { demoArticles } from '@/data/help-demo-data.js'

const route = useRoute()
const router = useRouter()
const helpStore = useHelpStore()
const { getTenantId } = useContext()

// Reactive data
const feedbackSubmitted = ref(false)
const userFeedback = ref(null)
const submittingFeedback = ref(false)

// Computed properties
const article = computed(() => helpStore.selectedArticle)
const loading = computed(() => helpStore.loading)
const error = computed(() => helpStore.error)

const renderedContent = computed(() => {
  if (!article.value?.content) return ''
  
  // Simple markdown-like rendering (you can replace with a proper markdown parser)
  return article.value.content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
})

const relatedArticles = computed(() => {
  if (!article.value) return []
  
  return helpStore.articles
    .filter(a => 
      a.id !== article.value.id && 
      a.status === 'published' &&
      (a.category_id === article.value.category_id || 
       a.title.toLowerCase().includes(article.value.title.toLowerCase().split(' ')[0]))
    )
    .slice(0, 3)
})

// Methods
const loadArticle = async () => {
  try {
    const slug = route.params.slug
    const tenantId = getTenantId()
    
    if (!slug) {
      console.error('No article slug provided')
      return
    }
    
    if (!tenantId) {
      console.warn('No tenant ID available - article will not be loaded')
      helpStore.error = 'No tenant ID available'
      return
    }
    
    await helpStore.fetchArticle(slug, tenantId)
  } catch (error) {
    console.error('Failed to load article:', error)
    helpStore.error = 'Failed to load article'
  }
}

const submitFeedback = async (feedback) => {
  if (!article.value || submittingFeedback.value) return
  
  submittingFeedback.value = true
  
  try {
    const tenantId = getTenantId()
    await helpStore.postFeedback(article.value.id, feedback, tenantId)
    
    userFeedback.value = feedback
    feedbackSubmitted.value = true
  } catch (error) {
    console.error('Failed to submit feedback:', error)
    // Show error message to user
  } finally {
    submittingFeedback.value = false
  }
}

const openTicketForm = () => {
  // Navigate to ticket form with article context
  router.push({
    path: '/tickets/public',
    query: {
      subject: `Help needed with: ${article.value.title}`,
      description: `I found the article "${article.value.title}" not helpful. Please provide additional assistance.`
    }
  })
}

const shareArticle = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: article.value.title,
        text: article.value.summary,
        url: window.location.href
      })
    } catch (error) {
      // User cancelled sharing
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href)
      // Show success message
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }
}

const navigateToArticle = (relatedArticle) => {
  router.push(`/service/help/article/${relatedArticle.slug}`)
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
    return 'yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString()
  }
}

// Lifecycle
onMounted(() => {
  try {
    loadArticle()
  } catch (error) {
    console.error('Error in ArticleDetail onMounted:', error)
  }
})

// Watch for route changes
watch(() => route.params.slug, () => {
  try {
    feedbackSubmitted.value = false
    userFeedback.value = null
    loadArticle()
  } catch (error) {
    console.error('Error in route change handler:', error)
  }
})

// Watch for tenant changes
watch(() => getTenantId(), () => {
  try {
    loadArticle()
  } catch (error) {
    console.error('Error in tenant change handler:', error)
  }
})
</script>

<style scoped>
.prose {
  @apply text-gray-700 leading-relaxed;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  @apply text-gray-900 font-semibold mt-6 mb-3;
}

.prose h1 { @apply text-2xl; }
.prose h2 { @apply text-xl; }
.prose h3 { @apply text-lg; }

.prose p {
  @apply mb-4;
}

.prose ul, .prose ol {
  @apply mb-4 pl-6;
}

.prose li {
  @apply mb-2;
}

.prose code {
  @apply bg-gray-100 px-1 py-0.5 rounded text-sm font-mono;
}

.prose pre {
  @apply bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4;
}

.prose blockquote {
  @apply border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4;
}
</style>
