<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Onboarding Templates</h1>
        <p class="mt-2 text-lg text-gray-600">Manage checklist item templates for employee onboarding</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Template
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search templates..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="handleSearch"
          />
        </div>

        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            v-model="filters.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option value="">All Categories</option>
            <option value="hr">HR</option>
            <option value="it">IT</option>
            <option value="finance">Finance</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.is_active"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
            <option value="">All</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="templatesStore.loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading templates...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="templatesStore.error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-red-800">Error loading templates</h3>
          <p class="mt-1 text-sm text-red-700">{{ templatesStore.error }}</p>
        </div>
        <button
          @click="loadTemplates"
          class="ml-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="templatesStore.templates.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No templates</h3>
      <p class="mt-2 text-sm text-gray-500">Get started by creating your first onboarding template.</p>
      <button
        @click="showCreateModal = true"
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Create Template
      </button>
    </div>

    <!-- Templates Table -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Days</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="template in templatesStore.templates"
              :key="template.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ template.name }}</div>
                  <div v-if="template.description" class="text-sm text-gray-500 mt-1">{{ template.description }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="categoryBadgeClass(template.category)" class="px-2 py-1 text-xs font-medium rounded">
                  {{ template.category || 'HR' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ template.assigned_role || 'HR' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="template.is_required" class="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                  Required
                </span>
                <span v-else class="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                  Optional
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ template.due_days || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <StatusBadge :status="template.is_active ? 'active' : 'inactive'" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editTemplate(template)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="deleteTemplate(template.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeModal"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ showEditModal ? 'Edit Template' : 'Create Template' }}
            </h3>
            
            <form @submit.prevent="handleSubmit">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Documents Upload"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    v-model="formData.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what this checklist item requires..."
                  ></textarea>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      v-model="formData.category"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="hr">HR</option>
                      <option value="it">IT</option>
                      <option value="finance">Finance</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Assigned Role *</label>
                    <select
                      v-model="formData.assigned_role"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="hr">HR</option>
                      <option value="it">IT</option>
                      <option value="finance">Finance</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Due Days</label>
                    <input
                      v-model.number="formData.due_days"
                      type="number"
                      min="0"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Days from start date"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      v-model="formData.is_active"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option :value="true">Active</option>
                      <option :value="false">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label class="flex items-center">
                    <input
                      v-model="formData.is_required"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Required (must be completed before onboarding completion)</span>
                  </label>
                </div>
              </div>
              
              <div class="mt-6 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ saving ? 'Saving...' : (showEditModal ? 'Update' : 'Create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHrOnboardingTemplatesStore } from '../store/hrOnboardingTemplates'
import StatusBadge from '../components/StatusBadge.vue'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const templatesStore = useHrOnboardingTemplatesStore()

// Local state
const searchQuery = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const saving = ref(false)
const editingTemplate = ref(null)

const formData = ref({
  name: '',
  description: '',
  category: 'hr',
  assigned_role: 'hr',
  due_days: null,
  is_required: true,
  is_active: true
})

// Filters
const filters = computed(() => templatesStore.filters)

// Methods
const loadTemplates = async () => {
  await templatesStore.fetchTemplates()
}

const handleSearch = () => {
  templatesStore.setFilters({ search: searchQuery.value, page: 1 })
  loadTemplates()
}

const applyFilters = () => {
  templatesStore.setFilters({ ...filters.value, page: 1 })
  loadTemplates()
}

const editTemplate = (template) => {
  editingTemplate.value = template
  formData.value = {
    name: template.name,
    description: template.description || '',
    category: template.category || 'hr',
    assigned_role: template.assigned_role || 'hr',
    due_days: template.due_days || null,
    is_required: template.is_required !== false,
    is_active: template.is_active !== false
  }
  showEditModal.value = true
}

const deleteTemplate = async (id) => {
  if (!confirm('Are you sure you want to delete this template? This will not affect existing onboarding checklists.')) {
    return
  }
  
  try {
    await templatesStore.deleteTemplate(id)
    showSuccess('Template deleted successfully')
    await loadTemplates()
  } catch (err) {
    showError(err.message || 'Failed to delete template')
  }
}

const handleSubmit = async () => {
  saving.value = true
  try {
    if (showEditModal.value && editingTemplate.value) {
      await templatesStore.updateTemplate(editingTemplate.value.id, formData.value)
      showSuccess('Template updated successfully')
    } else {
      await templatesStore.createTemplate(formData.value)
      showSuccess('Template created successfully')
    }
    closeModal()
    await loadTemplates()
  } catch (err) {
    showError(err.message || 'Failed to save template')
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTemplate.value = null
  formData.value = {
    name: '',
    description: '',
    category: 'hr',
    assigned_role: 'hr',
    due_days: null,
    is_required: true,
    is_active: true
  }
}

const categoryBadgeClass = (category) => {
  const classes = {
    hr: 'bg-blue-100 text-blue-800',
    it: 'bg-purple-100 text-purple-800',
    finance: 'bg-green-100 text-green-800',
    manager: 'bg-orange-100 text-orange-800'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(() => {
  loadTemplates()
})
</script>

