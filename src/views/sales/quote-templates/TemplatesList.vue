<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('sales.templates.title') }}</h1>
          <p class="text-gray-600">{{ $t('sales.templates.subtitle') }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <BaseButton
            variant="outline"
            @click="exportTemplates"
            :loading="exporting"
            v-if="templates && templates.length > 0"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            {{ $t('common.export') }}
          </BaseButton>
          <BaseButton
            variant="primary"
            @click="createTemplate"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {{ $t('sales.templates.create_template') }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search templates..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              @input="debouncedSearch"
            />
          </div>
        </div>

        <!-- Layout Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Layout</label>
          <select
            v-model="layoutFilter"
            @change="applyFilters"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Layouts</option>
            <option value="default">Default</option>
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>

        <!-- Clear Filters -->
        <div class="flex items-end">
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="animate-pulse">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Templates Table -->
    <div v-else-if="templates && templates.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Layout
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Default
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="template in templates"
              :key="template.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ template.name }}</div>
                    <div v-if="template.description" class="text-sm text-gray-500">{{ template.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getLayoutBadgeClass(template.layout)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ template.layout }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="template.is_default" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Default
                </span>
                <span v-else class="text-sm text-gray-500">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(template.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="previewTemplatePdf(template)"
                    :disabled="previewLoading"
                    class="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Preview Template PDF"
                  >
                    <svg v-if="!previewLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </button>

                  <button
                    @click="editTemplate(template)"
                    class="text-indigo-600 hover:text-indigo-800"
                    title="Edit Template"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>

                  <button
                    v-if="!template.is_default"
                    @click="setAsDefault(template)"
                    class="text-green-600 hover:text-green-800"
                    title="Set as Default"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>

                  <button
                    @click="deleteTemplate(template)"
                    class="text-red-600 hover:text-red-800"
                    title="Delete Template"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first quote template.</p>
        <div class="mt-6">
          <BaseButton
            variant="primary"
            @click="createTemplate"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {{ $t('sales.templates.create_template') }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Template Modal -->
    <TemplateModal
      v-if="showTemplateModal"
      :template="selectedTemplate"
      :is-edit="isEdit"
      @save="handleSaveTemplate"
      @close="showTemplateModal = false"
    />

    <!-- Preview Modal -->
    <PreviewModal
      v-if="showPreviewModal"
      :template="previewTemplate"
      @close="showPreviewModal = false"
    />

    <!-- Template Preview Modal -->
    <TemplatePreviewModal
      v-if="showTemplatePreview"
      :visible="showTemplatePreview"
      :pdfUrl="previewPdfUrl"
      :templateName="previewTemplateName"
      @close="closePreviewModal"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      title="Delete Template"
      :message="`Are you sure you want to delete ${templateToDelete?.name}? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuotesStore } from '@/stores/quotesStore'
import { debounce } from 'lodash-es'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'
import TemplateModal from '@/components/modals/TemplateModal.vue'
import PreviewModal from '@/components/modals/PreviewModal.vue'
import TemplatePreviewModal from '@/components/modals/TemplatePreviewModal.vue'

const quotesStore = useQuotesStore()

// Reactive data
const searchQuery = ref('')
const layoutFilter = ref('')
const exporting = ref(false)
const showTemplateModal = ref(false)
const showPreviewModal = ref(false)
const showDeleteModal = ref(false)
const selectedTemplate = ref(null)
const previewTemplate = ref(null)
const isEdit = ref(false)
const templateToDelete = ref(null)

// Preview modal state
const showTemplatePreview = ref(false)
const previewPdfUrl = ref('')
const previewTemplateName = ref('')
const previewLoading = ref(false)

// Computed
const templates = computed(() => quotesStore.templates)
const loading = computed(() => quotesStore.loading)

const hasActiveFilters = computed(() => {
  return searchQuery.value || layoutFilter.value
})

// Methods
const loadTemplates = async () => {
  const params = {
    q: searchQuery.value,
    layout: layoutFilter.value
  }
  
  await quotesStore.fetchTemplates(params)
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 300)

const applyFilters = () => {
  quotesStore.setFilters({
    q: searchQuery.value,
    layout: layoutFilter.value
  })
  loadTemplates()
}

const clearFilters = () => {
  searchQuery.value = ''
  layoutFilter.value = ''
  loadTemplates()
}

const createTemplate = () => {
  selectedTemplate.value = null
  isEdit.value = false
  showTemplateModal.value = true
}

const editTemplate = (template) => {
  selectedTemplate.value = template
  isEdit.value = true
  showTemplateModal.value = true
}

const previewTemplateAction = (template) => {
  previewTemplate.value = template
  showPreviewModal.value = true
}

const previewTemplatePdf = async (template) => {
  try {
    previewLoading.value = true
    previewTemplateName.value = template.name
    
    // Call the API to get the PDF blob
    const response = await quotesStore.previewTemplate(template.id)
    
    // Create blob URL
    const blob = new Blob([response.data], { type: 'application/pdf' })
    previewPdfUrl.value = URL.createObjectURL(blob)
    
    // Show the preview modal
    showTemplatePreview.value = true
  } catch (error) {
    console.error('Error previewing template:', error)
    // Show error toast using existing notification system
    if (window.$toast) {
      window.$toast.error('Unable to load template preview')
    }
  } finally {
    previewLoading.value = false
  }
}

const closePreviewModal = () => {
  // Clean up blob URL to prevent memory leaks
  if (previewPdfUrl.value) {
    URL.revokeObjectURL(previewPdfUrl.value)
    previewPdfUrl.value = ''
  }
  showTemplatePreview.value = false
  previewTemplateName.value = ''
}

const handleSaveTemplate = async (templateData) => {
  try {
    if (isEdit.value) {
      await quotesStore.updateTemplate(selectedTemplate.value.id, templateData)
    } else {
      await quotesStore.createTemplate(templateData)
    }
    showTemplateModal.value = false
    loadTemplates()
  } catch (error) {
    console.error('Error saving template:', error)
  }
}

const setAsDefault = async (template) => {
  try {
    await quotesStore.updateTemplate(template.id, { ...template, is_default: true })
    loadTemplates()
  } catch (error) {
    console.error('Error setting template as default:', error)
  }
}

const deleteTemplate = (template) => {
  templateToDelete.value = template
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (templateToDelete.value) {
    try {
      await quotesStore.deleteTemplate(templateToDelete.value.id)
      showDeleteModal.value = false
      templateToDelete.value = null
      loadTemplates()
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }
}

const exportTemplates = async () => {
  exporting.value = true
  try {
    // TODO: Implement export functionality
    console.log('Export templates functionality to be implemented')
  } catch (error) {
    console.error('Error exporting templates:', error)
  } finally {
    exporting.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const getLayoutBadgeClass = (layout) => {
  const classes = {
    default: 'bg-gray-100 text-gray-800',
    classic: 'bg-blue-100 text-blue-800',
    modern: 'bg-green-100 text-green-800',
    minimal: 'bg-purple-100 text-purple-800'
  }
  return classes[layout] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(() => {
  loadTemplates()
})
</script>
