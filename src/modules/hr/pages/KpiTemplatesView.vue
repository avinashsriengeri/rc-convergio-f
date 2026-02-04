<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">KPI Templates Management</h1>
        <p class="mt-2 text-lg text-gray-600">Manage and assign performance review templates</p>
      </div>
      <div class="flex items-center gap-3">
        <router-link
          :to="{ name: 'HrKpiAssign' }"
          class="inline-flex items-center px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Assign KPI
        </router-link>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create KPI Template
        </button>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Templates</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-green-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Published</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.published }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-yellow-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Draft</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.draft }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-purple-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Active</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.active }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search templates..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @input="handleSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <select
            v-model="filters.department_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="handleFilterChange"
          >
            <option :value="null">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Designation</label>
          <select
            v-model="filters.designation_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="handleFilterChange"
          >
            <option :value="null">All Designations</option>
            <option v-for="desg in designations" :key="desg.id" :value="desg.id">{{ desg.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Review Period</label>
          <select
            v-model="filters.review_period"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="handleFilterChange"
          >
            <option value="">All Periods</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
            <option value="once">Once</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="handleFilterChange"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Templates Table -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-900">KPI Templates</h2>
      </div>
      <div class="p-6">
        <div v-if="templatesStore.loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading templates...</p>
        </div>
        <div v-else-if="templatesStore.templates.length" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applies To</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Period</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total KPIs</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="template in templatesStore.templates" :key="template.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">{{ template.name }}</div>
                  <div v-if="template.description" class="text-xs text-gray-500 mt-1">{{ template.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    <span v-if="template.department">{{ template.department.name }}</span>
                    <span v-if="template.department && template.designation"> (</span>
                    <span v-if="template.designation">{{ template.designation.name }}</span>
                    <span v-if="template.department && template.designation">)</span>
                    <span v-if="!template.department && !template.designation" class="text-gray-400">All</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                    {{ template.review_period }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ template.items?.length || 0 }} Items
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <KpiStatusBadge :status="template.status" :show-dot="true" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-3">
                    <button
                      @click="viewTemplate(template)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      @click="editTemplate(template)"
                      class="text-primary-purple hover:text-primary-pink transition-colors"
                      title="Edit"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteTemplate(template)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-center py-12 text-sm text-gray-500">No templates found</p>
      </div>
    </div>

    <!-- Create/Edit Template Modal -->
    <KpiTemplateFormModal
      :show="showCreateModal || showEditModal"
      :template="editingTemplate"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHrKpiTemplatesStore } from '../store/hrKpiTemplates'
import { useHrDepartmentsStore } from '../store/hrDepartments'
import { useHrDesignationsStore } from '../store/hrDesignations'
import { success as showSuccess, error as showError } from '@/utils/notifications'
import KpiStatusBadge from '../components/KpiStatusBadge.vue'
import KpiTemplateFormModal from '../components/KpiTemplateFormModal.vue'

const templatesStore = useHrKpiTemplatesStore()
const departmentsStore = useHrDepartmentsStore()
const designationsStore = useHrDesignationsStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTemplate = ref(null)
const searchQuery = ref('')

const stats = computed(() => templatesStore.stats)
const filters = computed(() => templatesStore.filters)
const departments = computed(() => departmentsStore.activeDepartments)
const designations = computed(() => designationsStore.activeDesignations)

const handleSearch = () => {
  templatesStore.setFilters({ search: searchQuery.value, page: 1 })
  loadTemplates()
}

const handleFilterChange = () => {
  templatesStore.setFilters({ page: 1 })
  loadTemplates()
}

const loadTemplates = async () => {
  await templatesStore.fetchTemplates()
}

const viewTemplate = (template) => {
  editingTemplate.value = template
  showEditModal.value = true
}

const editTemplate = (template) => {
  editingTemplate.value = template
  showEditModal.value = true
}

const deleteTemplate = async (template) => {
  if (!confirm(`Are you sure you want to delete "${template.name}"?`)) {
    return
  }

  try {
    await templatesStore.deleteTemplate(template.id)
    showSuccess('Template deleted successfully')
    await loadTemplates()
  } catch (err) {
    showError(err.message || 'Failed to delete template')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTemplate.value = null
}

const handleSave = async () => {
  await loadTemplates()
  closeModal()
}

onMounted(async () => {
  await Promise.all([
    loadTemplates(),
    departmentsStore.fetchDepartments({ per_page: 100, is_active: true }),
    designationsStore.fetchDesignations({ per_page: 100, is_active: true })
  ])
})
</script>

