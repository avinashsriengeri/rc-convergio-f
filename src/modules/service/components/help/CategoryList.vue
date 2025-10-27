<template>
  <div class="category-list">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
      
      <!-- All Categories Button -->
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
          <span class="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
            {{ totalArticles }}
          </span>
        </div>
      </button>
    </div>

    <!-- Category List -->
    <div class="space-y-2">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectCategory(category)"
        :class="[
          'w-full text-left px-4 py-3 rounded-lg transition-colors duration-200',
          selectedCategory && selectedCategory.id === category.id
            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: category.color || '#6B7280' }"></div>
            <span class="font-medium">{{ category.name }}</span>
          </div>
          <span class="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
            {{ category.articles_count || 0 }}
          </span>
        </div>
        
        <!-- Category Description -->
        <div v-if="category.description" class="text-sm text-gray-500 mt-1 ml-6">
          {{ category.description }}
        </div>
      </button>
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
import { computed } from 'vue'
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

const emit = defineEmits(['select'])

const helpStore = useHelpStore()

const selectedCategory = computed(() => helpStore.selectedCategory)
const totalArticles = computed(() => helpStore.articles.length)

const selectCategory = (category) => {
  helpStore.setSelectedCategory(category)
  emit('select', category)
}

</script>

<style scoped>
.category-list {
  @apply bg-white rounded-lg p-4 shadow-sm border border-gray-200;
}
</style>
