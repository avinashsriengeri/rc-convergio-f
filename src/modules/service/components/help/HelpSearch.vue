<template>
  <div class="help-search">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        v-model="searchTerm"
        @input="handleSearch"
        @keyup.enter="handleSearch"
        type="text"
        :placeholder="placeholder"
        class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
      />
      <div v-if="searchTerm" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button
          @click="clearSearch"
          class="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Search suggestions -->
    <div v-if="showSuggestions && suggestions.length > 0" class="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      <div
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        @click="selectSuggestion(suggestion)"
        class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
      >
        <div class="font-medium text-gray-900">{{ suggestion.title }}</div>
        <div class="text-sm text-gray-500 mt-1">{{ suggestion.summary }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useHelpStore } from '../../store/helpStore'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search help articles...'
  },
  debounceMs: {
    type: Number,
    default: 300
  },
  showSuggestions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['search', 'clear'])

const helpStore = useHelpStore()
const searchTerm = ref('')
const suggestions = ref([])
const debounceTimer = ref(null)

const handleSearch = () => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  
  debounceTimer.value = setTimeout(() => {
    emit('search', searchTerm.value)
    
    // Show suggestions if there are articles and search term
    if (props.showSuggestions && searchTerm.value.length > 2) {
      showSearchSuggestions()
    } else {
      suggestions.value = []
    }
  }, props.debounceMs)
}

const clearSearch = () => {
  searchTerm.value = ''
  suggestions.value = []
  emit('clear')
  emit('search', '')
}

const showSearchSuggestions = () => {
  const query = searchTerm.value.toLowerCase()
  suggestions.value = helpStore.articles
    .filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query)
    )
    .slice(0, 5) // Limit to 5 suggestions
}

const selectSuggestion = (suggestion) => {
  searchTerm.value = suggestion.title
  suggestions.value = []
  emit('search', suggestion.title)
}

// Clear suggestions when clicking outside
const handleClickOutside = (event) => {
  try {
    if (event && event.target && !event.target.closest('.help-search')) {
      suggestions.value = []
    }
  } catch (error) {
    console.warn('Error in handleClickOutside:', error)
    suggestions.value = []
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})

// Watch for external search term changes
watch(() => helpStore.searchQuery, (newQuery) => {
  if (newQuery !== searchTerm.value) {
    searchTerm.value = newQuery
  }
})
</script>

<style scoped>
.help-search {
  @apply relative;
}
</style>
