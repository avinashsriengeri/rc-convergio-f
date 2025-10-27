<template>
  <div class="hierarchical-category-list">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">Knowledge Base</h3>
      
      <!-- All Articles Button -->
      <button
        @click="selectCategory(null)"
        :class="[
          'w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors duration-200',
          !selectedCategory 
            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
        ]"
      >
        <div class="flex items-center justify-between">
          <span class="font-medium">All Articles</span>
        </div>
      </button>
    </div>

    <!-- Hierarchical Category List -->
    <div class="space-y-1">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-group"
      >
        <!-- Category Header -->
        <button
          @click="toggleCategory(category)"
          :class="[
            'w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-between',
            selectedCategory && selectedCategory.id === category.id
              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
          ]"
        >
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: category.color || '#6B7280' }"></div>
            <span class="font-medium">{{ category.name }}</span>
          </div>
          <div class="flex items-center">
            <svg 
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-90': expandedCategories.includes(category.id) }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
        
        <!-- Category Description -->
        <div v-if="category.description" class="text-sm text-gray-500 mt-1 ml-6 mb-2">
          {{ category.description }}
        </div>

        <!-- Articles under this category (when expanded) -->
        <div 
          v-if="expandedCategories.includes(category.id)"
          class="ml-6 space-y-1 mt-2"
        >
                <div
                  v-for="article in getCategoryArticles(category.id)"
                  :key="article.id"
                  @click="selectArticle(article)"
                  class="px-4 py-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900 mb-1">{{ article.title }}</h4>
                    <p class="text-xs text-gray-600 line-clamp-2">{{ article.summary }}</p>
                  </div>
                </div>
          
          <!-- No articles message -->
          <div v-if="getCategoryArticles(category.id).length === 0" class="px-4 py-2 text-sm text-gray-500 italic">
            No articles in this category
          </div>
        </div>
      </div>
    </div>

    <!-- No Categories Message -->
    <div v-if="categories.length === 0 && !loading" class="text-center py-8">
      <div class="text-gray-400 mb-2">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <p class="text-gray-500">No categories available</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-2">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="w-full h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHelpStore } from '../../store/helpStore'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'select-article'])

const helpStore = useHelpStore()

const selectedCategory = computed(() => helpStore.selectedCategory)
const totalArticles = computed(() => helpStore.articles.length)
const expandedCategories = ref([])

const selectCategory = (category) => {
  helpStore.setSelectedCategory(category)
  emit('select', category)
}

const selectArticle = (article) => {
  emit('select-article', article)
}

const toggleCategory = (category) => {
  const index = expandedCategories.value.indexOf(category.id)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(category.id)
  }
}

const getCategoryArticles = (categoryId) => {
  // Filter articles by category and deduplicate by ID
  const categoryArticles = helpStore.articles.filter(article => 
    article.category && article.category.id === categoryId
  )
  
  // Deduplicate by article ID to prevent duplicates
  const uniqueArticles = categoryArticles.filter((article, index, self) => 
    index === self.findIndex(a => a.id === article.id)
  )
  
  return uniqueArticles
}
</script>

<style scoped>
.hierarchical-category-list {
  @apply bg-white rounded-lg p-4 shadow-sm border border-gray-200;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
