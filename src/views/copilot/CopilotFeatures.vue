<template>
  <div class="copilot-features">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Available Features</h1>
          <p class="text-gray-600 mt-1">Explore all the features you can use with Copilot</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search features..."
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
      <!-- Feature Categories -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Feature Categories</h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in featureCategories"
            :key="category.id"
            @click="filterByCategory(category.id)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="feature in filteredFeatures"
          :key="feature.id"
          class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-lg mr-4">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.icon" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ feature.name }}</h3>
                <p class="text-sm text-gray-600">{{ feature.category }}</p>
              </div>
            </div>
            <span
              class="px-2 py-1 text-xs rounded-full"
              :class="feature.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ feature.available ? 'Available' : 'Coming Soon' }}
            </span>
          </div>

          <p class="text-gray-600 mb-4">{{ feature.description }}</p>

          <div class="space-y-2 mb-4">
            <h4 class="text-sm font-medium text-gray-900">What you can do:</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li v-for="action in feature.actions" :key="action" class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ action }}
              </li>
            </ul>
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              <span v-if="feature.usage_count">{{ feature.usage_count }} uses</span>
              <span v-else>Not used yet</span>
            </div>
            <div class="flex space-x-2">
              <button
                v-if="feature.available"
                @click="tryFeature(feature)"
                class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Try It
              </button>
              <button
                @click="learnMore(feature)"
                class="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="filteredFeatures.length === 0" class="text-center py-12">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No features found</h3>
        <p class="text-gray-600">Try adjusting your search or filter criteria</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCopilotStore } from '@/stores/copilotStore'

const router = useRouter()
const copilotStore = useCopilotStore()

// Reactive state
const searchQuery = ref('')
const selectedCategory = ref('all')

// Feature categories
const featureCategories = ref([
  { id: 'all', name: 'All Features' },
  { id: 'crm', name: 'CRM & Contacts' },
  { id: 'sales', name: 'Sales & Deals' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'cms', name: 'CMS & Content' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'automation', name: 'Automation' }
])

// Available features (this would come from the API)
const features = ref([
  {
    id: 1,
    name: 'Contact Management',
    description: 'Create, edit, and manage your contacts with AI assistance',
    category: 'crm',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    available: true,
    usage_count: 45,
    actions: [
      'Create new contacts',
      'Update contact information',
      'Search and filter contacts',
      'Import contact data'
    ]
  },
  {
    id: 2,
    name: 'Deal Pipeline',
    description: 'Manage your sales deals and track progress through the pipeline',
    category: 'sales',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
    available: true,
    usage_count: 32,
    actions: [
      'Create new deals',
      'Move deals between stages',
      'Track deal progress',
      'Generate deal reports'
    ]
  },
  {
    id: 3,
    name: 'Email Campaigns',
    description: 'Create and send targeted email campaigns to your contacts',
    category: 'marketing',
    icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    available: true,
    usage_count: 28,
    actions: [
      'Design email templates',
      'Segment your audience',
      'Schedule campaigns',
      'Track email performance'
    ]
  },
  {
    id: 4,
    name: 'Website Builder',
    description: 'Build and customize your website with drag-and-drop tools',
    category: 'cms',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    available: true,
    usage_count: 19,
    actions: [
      'Create new pages',
      'Customize layouts',
      'Add content blocks',
      'Optimize for SEO'
    ]
  },
  {
    id: 5,
    name: 'Analytics Dashboard',
    description: 'View comprehensive analytics and insights about your business',
    category: 'analytics',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    available: true,
    usage_count: 67,
    actions: [
      'View performance metrics',
      'Generate custom reports',
      'Track user behavior',
      'Export data'
    ]
  },
  {
    id: 6,
    name: 'Lead Scoring',
    description: 'Automatically score and prioritize your leads based on behavior',
    category: 'automation',
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    available: false,
    usage_count: 0,
    actions: [
      'Set up scoring rules',
      'Track lead behavior',
      'Automatically update scores',
      'Segment high-value leads'
    ]
  }
])

// Computed properties
const filteredFeatures = computed(() => {
  let filtered = features.value

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(feature => feature.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(feature =>
      feature.name.toLowerCase().includes(query) ||
      feature.description.toLowerCase().includes(query) ||
      feature.actions.some(action => action.toLowerCase().includes(query))
    )
  }

  return filtered
})

// Methods
const filterByCategory = (categoryId) => {
  selectedCategory.value = categoryId
}

const tryFeature = (feature) => {
  // Open copilot chat with feature-specific query
  copilotStore.toggleChat()
  // You could also navigate to the specific feature page
  router.push(`/copilot/features/${feature.id}`)
}

const learnMore = (feature) => {
  router.push(`/copilot/features/${feature.id}`)
}

// Initialize
onMounted(async () => {
  await copilotStore.initialize()
})
</script>

<style scoped>
.copilot-features {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>

