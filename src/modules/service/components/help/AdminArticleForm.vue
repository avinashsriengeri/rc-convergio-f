<template>
  <div class="admin-article-form">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Title Field -->
      <div class="form-group">
        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
          Article Title *
        </label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          :class="[
            'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.title ? 'border-red-300' : 'border-gray-300'
          ]"
          placeholder="Enter article title..."
        />
        <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
      </div>

      <!-- Summary Field -->
      <div class="form-group">
        <label for="summary" class="block text-sm font-medium text-gray-700 mb-2">
          Summary *
        </label>
        <textarea
          id="summary"
          v-model="formData.summary"
          rows="3"
          :class="[
            'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.summary ? 'border-red-300' : 'border-gray-300'
          ]"
          placeholder="Brief summary of the article..."
        ></textarea>
        <p v-if="errors.summary" class="mt-1 text-sm text-red-600">{{ errors.summary }}</p>
        <p class="mt-1 text-sm text-gray-500">{{ formData.summary.length }}/200 characters</p>
      </div>

      <!-- Category Field -->
      <div class="form-group">
        <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <div v-if="availableCategories.length > 0" class="flex space-x-2">
          <select
            id="category"
            v-model="formData.category_id"
            :class="[
              'flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              errors.category_id ? 'border-red-300' : 'border-gray-300'
            ]"
          >
            <option value="">Select a category</option>
            <option
              v-for="category in availableCategories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
          <button
            type="button"
            @click="showCreateCategoryForm"
            class="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            title="Create new category"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        <!-- No categories available - show create button prominently -->
        <div v-else class="space-y-3">
          <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p class="text-sm text-yellow-800">No categories available. Create a category first.</p>
            </div>
          </div>
          <button
            type="button"
            @click="showCreateCategoryForm"
            class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create First Category
          </button>
        </div>
        <p v-if="errors.category_id" class="mt-1 text-sm text-red-600">{{ errors.category_id }}</p>
      </div>

      <!-- Status Field -->
      <div class="form-group">
        <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
          Status *
        </label>
        <select
          id="status"
          v-model="formData.status"
          :class="[
            'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.status ? 'border-red-300' : 'border-gray-300'
          ]"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
      </div>

      <!-- Content Field -->
      <div class="form-group">
        <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <div class="border border-gray-300 rounded-md">
          <!-- Toolbar -->
          <div class="border-b border-gray-300 p-2 bg-gray-50 flex items-center space-x-2">
            <button
              type="button"
              @click="formatText('bold')"
              class="p-2 hover:bg-gray-200 rounded"
              title="Bold"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a1 1 0 011-1h5.5a2.5 2.5 0 010 5H6v2h4.5a2.5 2.5 0 010 5H6a1 1 0 01-1-1V4z"/>
              </svg>
            </button>
            <button
              type="button"
              @click="formatText('italic')"
              class="p-2 hover:bg-gray-200 rounded"
              title="Italic"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 000 2h1.5a1.5 1.5 0 010 3H8v2h2.5a1.5 1.5 0 010 3H8a1 1 0 000 2h4a1 1 0 100-2h-1.5a1.5 1.5 0 010-3H12V8h-1.5a1.5 1.5 0 010-3H12a1 1 0 100-2H8z"/>
              </svg>
            </button>
            <button
              type="button"
              @click="formatText('code')"
              class="p-2 hover:bg-gray-200 rounded"
              title="Code"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
            <div class="border-l border-gray-300 h-6 mx-2"></div>
            <button
              type="button"
              @click="insertList('ul')"
              class="p-2 hover:bg-gray-200 rounded"
              title="Bullet List"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
            </button>
            <button
              type="button"
              @click="insertList('ol')"
              class="p-2 hover:bg-gray-200 rounded"
              title="Numbered List"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 000 2h.01a1 1 0 000-2H3zm0 4a1 1 0 000 2h.01a1 1 0 000-2H3zm0 4a1 1 0 000 2h.01a1 1 0 000-2H3zm0 4a1 1 0 000 2h.01a1 1 0 000-2H3zm4-8a1 1 0 000 2h.01a1 1 0 000-2H7zm0 4a1 1 0 000 2h.01a1 1 0 000-2H7zm0 4a1 1 0 000 2h.01a1 1 0 000-2H7zm0 4a1 1 0 000 2h.01a1 1 0 000-2H7zm4-8a1 1 0 000 2h.01a1 1 0 000-2h-1zm0 4a1 1 0 000 2h.01a1 1 0 000-2h-1zm0 4a1 1 0 000 2h.01a1 1 0 000-2h-1zm0 4a1 1 0 000 2h.01a1 1 0 000-2h-1z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
          
          <!-- Content Editor -->
          <textarea
            ref="contentEditor"
            v-model="formData.content"
            rows="15"
            :class="[
              'w-full px-3 py-2 border-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none',
              errors.content ? 'ring-red-500' : ''
            ]"
            placeholder="Write your article content here..."
            @input="handleContentChange"
          ></textarea>
        </div>
        <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
        <p class="mt-1 text-sm text-gray-500">{{ formData.content.length }} characters</p>
      </div>

      <!-- Tags Field -->
      <div class="form-group">
        <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          id="tags"
          v-model="tagsInput"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter tags separated by commas..."
          @keyup.enter="addTag"
        />
        <div v-if="formData.tags && formData.tags.length > 0" class="mt-2 flex flex-wrap gap-2">
          <span
            v-for="(tag, index) in formData.tags"
            :key="index"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ tag }}
            <button
              type="button"
              @click="removeTag(index)"
              class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-500">Press Enter to add tags</p>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isEditing ? 'Updating...' : 'Creating...' }}
          </span>
          <span v-else>{{ isEditing ? 'Update Article' : 'Create Article' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useHelpStore } from '../../store/helpStore'
import { useContext } from '@/composables/useContext'

const props = defineProps({
  article: {
    type: Object,
    default: null
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['submit', 'cancel', 'create-category'])

const helpStore = useHelpStore()
const { getTenantId } = useContext()

// Reactive data
const isSubmitting = ref(false)
const tagsInput = ref('')
const contentEditor = ref(null)

const formData = reactive({
  title: '',
  summary: '',
  category_id: '',
  status: 'draft',
  content: '',
  tags: []
})

const errors = reactive({
  title: '',
  summary: '',
  category_id: '',
  status: '',
  content: ''
})

// Computed properties
const isEditing = computed(() => !!props.article)

// Only use categories from API, no fallback demo data
const availableCategories = computed(() => {
  return props.categories || []
})

// Methods
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  // Title validation
  if (!formData.title.trim()) {
    errors.title = 'Title is required'
    isValid = false
  } else if (formData.title.length < 5) {
    errors.title = 'Title must be at least 5 characters'
    isValid = false
  }

  // Summary validation
  if (!formData.summary.trim()) {
    errors.summary = 'Summary is required'
    isValid = false
  } else if (formData.summary.length < 10) {
    errors.summary = 'Summary must be at least 10 characters'
    isValid = false
  } else if (formData.summary.length > 200) {
    errors.summary = 'Summary must be less than 200 characters'
    isValid = false
  }

  // Category validation
  if (!formData.category_id) {
    errors.category_id = 'Category is required'
    isValid = false
  }

  // Status validation
  if (!formData.status) {
    errors.status = 'Status is required'
    isValid = false
  }

  // Content validation
  if (!formData.content.trim()) {
    errors.content = 'Content is required'
    isValid = false
  } else if (formData.content.length < 50) {
    errors.content = 'Content must be at least 50 characters'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const tenantId = getTenantId()
    console.log('Creating article with tenant ID:', tenantId)
    
    const articleData = {
      ...formData
      // tenant_id is automatically set by the backend from the authenticated user
    }
    
    console.log('Article data being sent:', articleData)

    if (isEditing.value) {
      await helpStore.updateArticle(props.article.id, articleData)
    } else {
      await helpStore.createArticle(articleData)
    }

    emit('submit', articleData)
  } catch (error) {
    console.error('Failed to save article:', error)
    // Handle error (show notification, etc.)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

const showCreateCategoryForm = () => {
  emit('create-category')
}

const addTag = () => {
  const tag = tagsInput.value.trim()
  if (tag && !formData.tags.includes(tag)) {
    formData.tags.push(tag)
    tagsInput.value = ''
  }
}

const removeTag = (index) => {
  formData.tags.splice(index, 1)
}

const formatText = (format) => {
  const textarea = contentEditor.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = formData.content.substring(start, end)
  
  let formattedText = ''
  
  switch (format) {
    case 'bold':
      formattedText = `**${selectedText}**`
      break
    case 'italic':
      formattedText = `*${selectedText}*`
      break
    case 'code':
      formattedText = `\`${selectedText}\``
      break
  }
  
  formData.content = formData.content.substring(0, start) + formattedText + formData.content.substring(end)
  
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + 2, end + 2)
  })
}

const insertList = (type) => {
  const textarea = contentEditor.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = formData.content.substring(start, end)
  
  let listText = ''
  if (selectedText) {
    const lines = selectedText.split('\n')
    listText = lines.map((line, index) => {
      if (type === 'ul') {
        return `- ${line.trim()}`
      } else {
        return `${index + 1}. ${line.trim()}`
      }
    }).join('\n')
  } else {
    listText = type === 'ul' ? '- ' : '1. '
  }
  
  formData.content = formData.content.substring(0, start) + listText + formData.content.substring(end)
  
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + listText.length, start + listText.length)
  })
}

const handleContentChange = () => {
  // Auto-save functionality could be added here
}

// Initialize form data
const initializeForm = () => {
  if (props.article) {
    formData.title = props.article.title || ''
    formData.summary = props.article.summary || ''
    formData.category_id = props.article.category_id || ''
    formData.status = props.article.status || 'draft'
    formData.content = props.article.content || ''
    formData.tags = props.article.tags ? [...props.article.tags] : []
  } else {
    // Reset form for new article
    formData.title = ''
    formData.summary = ''
    formData.category_id = ''
    formData.status = 'draft'
    formData.content = ''
    formData.tags = []
  }
}

// Watch for article changes
watch(() => props.article, () => {
  initializeForm()
}, { immediate: true })
</script>

<style scoped>
.form-group {
  @apply space-y-1;
}
</style>
