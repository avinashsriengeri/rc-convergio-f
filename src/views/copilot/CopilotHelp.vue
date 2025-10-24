<template>
  <div class="copilot-help">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Help Center</h1>
          <p class="text-gray-600 mt-1">Find answers and learn how to use RC Convergio</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="searchHelp"
              type="text"
              placeholder="Search help articles..."
              class="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg class="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="p-6">
      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Search Results</h2>
        <div class="space-y-4">
          <div
            v-for="result in searchResults"
            :key="result.id"
            class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            @click="viewArticle(result)"
          >
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ result.title }}</h3>
            <p class="text-gray-600 mb-3">{{ result.excerpt }}</p>
            <div class="flex items-center text-sm text-gray-500">
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-3">{{ result.category }}</span>
              <span>{{ formatTime(result.updated_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div v-if="searchResults.length === 0">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Browse by Category</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="category in categories"
            :key="category.id"
            class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            @click="browseCategory(category)"
          >
            <div class="flex items-center mb-4">
              <div class="p-3 bg-blue-100 rounded-lg mr-4">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="category.icon" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
                <p class="text-sm text-gray-600">{{ category.article_count }} articles</p>
              </div>
            </div>
            <p class="text-gray-600">{{ category.description }}</p>
          </div>
        </div>

        <!-- Popular Articles -->
        <div class="mt-12">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Popular Articles</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="article in popularArticles"
              :key="article.id"
              class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              @click="viewArticle(article)"
            >
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-lg font-medium text-gray-900">{{ article.title }}</h3>
                <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Popular</span>
              </div>
              <p class="text-gray-600 mb-3">{{ article.excerpt }}</p>
              <div class="flex items-center text-sm text-gray-500">
                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-3">{{ article.category }}</span>
                <span>{{ article.views }} views</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Start Guide -->
        <div class="mt-12">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Quick Start Guide</h2>
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <div class="flex items-start">
              <div class="p-3 bg-blue-100 rounded-lg mr-4">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">New to RC Convergio?</h3>
                <p class="text-gray-600 mb-4">Get started with our comprehensive guide covering all the essential features.</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="guide in quickStartGuides"
                    :key="guide.id"
                    @click="startGuide(guide)"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    {{ guide.title }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCopilotStore } from '@/stores/copilotStore'

const router = useRouter()
const copilotStore = useCopilotStore()

// Reactive state
const searchQuery = ref('')
const searchResults = ref([])
const loading = ref(false)

// Categories
const categories = ref([
  {
    id: 1,
    name: 'Getting Started',
    description: 'Learn the basics of RC Convergio',
    article_count: 12,
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    id: 2,
    name: 'Contacts & CRM',
    description: 'Manage your contacts and customer relationships',
    article_count: 18,
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  },
  {
    id: 3,
    name: 'Sales & Deals',
    description: 'Track deals and manage your sales pipeline',
    article_count: 15,
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
  },
  {
    id: 4,
    name: 'Marketing',
    description: 'Create campaigns and track marketing performance',
    article_count: 22,
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    id: 5,
    name: 'CMS & Content',
    description: 'Build and manage your website content',
    article_count: 16,
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
  },
  {
    id: 6,
    name: 'Analytics & Reports',
    description: 'Understand your data and performance',
    article_count: 14,
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  }
])

// Popular articles
const popularArticles = ref([
  {
    id: 1,
    title: 'How to create your first contact',
    excerpt: 'Learn how to add and manage contacts in RC Convergio',
    category: 'Getting Started',
    views: 1250,
    updated_at: new Date()
  },
  {
    id: 2,
    title: 'Setting up your sales pipeline',
    excerpt: 'Configure your deal stages and pipeline for optimal sales tracking',
    category: 'Sales & Deals',
    views: 980,
    updated_at: new Date()
  },
  {
    id: 3,
    title: 'Creating email campaigns',
    excerpt: 'Step-by-step guide to creating and sending email campaigns',
    category: 'Marketing',
    views: 856,
    updated_at: new Date()
  },
  {
    id: 4,
    title: 'Building your first website page',
    excerpt: 'Use the CMS to create and publish web pages',
    category: 'CMS & Content',
    views: 742,
    updated_at: new Date()
  }
])

// Quick start guides
const quickStartGuides = ref([
  { id: 1, title: 'Complete Setup Guide', path: '/help/guides/setup' },
  { id: 2, title: 'First Contact', path: '/help/guides/first-contact' },
  { id: 3, title: 'First Deal', path: '/help/guides/first-deal' },
  { id: 4, title: 'First Campaign', path: '/help/guides/first-campaign' }
])

// Methods
const searchHelp = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  loading.value = true
  try {
    const results = await copilotStore.searchHelp(searchQuery.value)
    searchResults.value = results
  } catch (error) {
    console.error('Search failed:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

const browseCategory = (category) => {
  router.push(`/copilot/help/category/${category.id}`)
}

const viewArticle = (article) => {
  router.push(`/copilot/help/article/${article.id}`)
}

const startGuide = (guide) => {
  router.push(guide.path)
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleDateString()
}

// Initialize
onMounted(async () => {
  await copilotStore.initialize()
})
</script>

<style scoped>
.copilot-help {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>

