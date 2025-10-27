<template>
  <div>
    <!-- Header with Export Button -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Audit Logs</h2>
        <p class="mt-1 text-sm text-gray-600">View and export assignment history and logs</p>
      </div>
      <BaseButton
        @click="exportLogs"
        :loading="exportLoading"
        variant="primary"
        size="md"
      >
        <svg v-if="!exportLoading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export CSV
      </BaseButton>
    </div>

    <!-- Filters -->
    <div class="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-6 mb-6">
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        <h3 class="ml-3 text-lg font-medium text-gray-900">Filters</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Record Type Filter -->
        <div>
          <label for="record_type" class="block text-sm font-medium text-gray-700 mb-1">
            Record Type
          </label>
          <BaseSelect
            id="record_type"
            v-model="filters.record_type"
            :options="recordTypeOptions"
            placeholder="All types"
          />
        </div>

        <!-- Assigned To Filter -->
        <div>
          <label for="assigned_to" class="block text-sm font-medium text-gray-700 mb-1">
            Assigned To
          </label>
          <BaseSelect
            id="assigned_to"
            v-model="filters.assigned_to"
            :options="userOptions"
            placeholder="All users"
          />
        </div>

        <!-- Rule Filter -->
        <div>
          <label for="rule_id" class="block text-sm font-medium text-gray-700 mb-1">
            Rule
          </label>
          <BaseSelect
            id="rule_id"
            v-model="filters.rule_id"
            :options="ruleOptions"
            placeholder="All rules"
          />
        </div>

        <!-- Date Range Filter -->
        <div>
          <label for="date_range" class="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <BaseSelect
            id="date_range"
            v-model="filters.date_range"
            :options="dateRangeOptions"
            placeholder="All time"
          />
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div class="flex items-center space-x-2">
          <BaseButton
            @click="applyFilters"
            :loading="loading"
            variant="primary"
            size="sm"
          >
            Apply Filters
          </BaseButton>
          <BaseButton
            @click="clearFilters"
            variant="outline"
            size="sm"
          >
            Clear
          </BaseButton>
        </div>
        <div class="text-sm text-gray-500">
          {{ pagination.total || 0 }} total records
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading audit logs...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Audit Logs</h3>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <BaseButton @click="loadAuditLogs" variant="primary">
        Try Again
      </BaseButton>
    </div>

    <!-- Audit Logs Table -->
    <div v-else-if="auditLogs.length > 0" class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Record Type
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Record ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assigned To
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rule Used
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="log in formattedAuditLogs" :key="log.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  log.record_type === 'contact' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                ]"
              >
                {{ log.record_type === 'contact' ? 'Contact' : 'Deal' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ log.record_id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ log.assigned_to_name }}
              </div>
              <div v-if="log.assigned_user" class="text-sm text-gray-500">
                {{ log.assigned_user.email }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ log.rule_name }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  log.assignment_type === 'automatic' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                ]"
              >
                {{ log.assignment_type_badge }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ log.created_at_formatted }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <BaseButton
            @click="previousPage"
            :disabled="!pagination.prev_page_url"
            variant="outline"
            size="sm"
          >
            Previous
          </BaseButton>
          <BaseButton
            @click="nextPage"
            :disabled="!pagination.next_page_url"
            variant="outline"
            size="sm"
          >
            Next
          </BaseButton>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ pagination.from || 0 }}</span>
              to
              <span class="font-medium">{{ pagination.to || 0 }}</span>
              of
              <span class="font-medium">{{ pagination.total || 0 }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <BaseButton
                @click="previousPage"
                :disabled="!pagination.prev_page_url"
                variant="outline"
                size="sm"
                class="rounded-l-md"
              >
                Previous
              </BaseButton>
              <BaseButton
                @click="nextPage"
                :disabled="!pagination.next_page_url"
                variant="outline"
                size="sm"
                class="rounded-r-md"
              >
                Next
              </BaseButton>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No Audit Logs Found</h3>
      <p class="text-gray-600 mb-6">No assignment logs match your current filters.</p>
      <BaseButton @click="clearFilters" variant="primary">
        Clear Filters
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { leadAssignmentService } from '@/services/leadAssignment'
import { error as showError, success as showSuccess } from '@/utils/notifications'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

// Props
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

// Emits
const emit = defineEmits(['refresh'])

// Reactive state
const auditLogs = ref([])
const users = ref([])
const rules = ref([])
const loading = ref(false)
const error = ref(null)
const exportLoading = ref(false)
const pagination = ref({})

const filters = ref({
  record_type: '',
  assigned_to: '',
  rule_id: '',
  date_range: ''
})

// Computed
const formattedAuditLogs = computed(() => {
  return auditLogs.value.map(log => leadAssignmentService.formatAuditLogForDisplay(log))
})

const recordTypeOptions = computed(() => [
  { value: '', label: 'All types' },
  { value: 'contact', label: 'Contact' },
  { value: 'deal', label: 'Deal' }
])

const userOptions = computed(() => [
  { value: '', label: 'All users' },
  ...users.value.map(user => ({
    value: user.id,
    label: user.name
  }))
])

const ruleOptions = computed(() => [
  { value: '', label: 'All rules' },
  { value: 'default', label: 'Default Assignment' },
  ...rules.value.map(rule => ({
    value: rule.id,
    label: rule.name
  }))
])

const dateRangeOptions = computed(() => [
  { value: '', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: 'Last 7 days' },
  { value: 'last_30_days', label: 'Last 30 days' },
  { value: 'last_90_days', label: 'Last 90 days' }
])

// Methods
const loadAuditLogs = async (page = 1) => {
  loading.value = true
  error.value = null
  
  try {
    const params = {
      page,
      per_page: 20,
      ...filters.value
    }
    
    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (params[key] === '') {
        delete params[key]
      }
    })
    
    const data = await leadAssignmentService.loadAuditLogs(params)
    auditLogs.value = data.data || data
    pagination.value = data.meta || data.pagination || {}
  } catch (err) {
    console.error('Error loading audit logs:', err)
    error.value = err.response?.data?.message || 'Failed to load audit logs'
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    const data = await leadAssignmentService.loadUsers()
    users.value = data
  } catch (err) {
    console.error('Error loading users:', err)
  }
}

const loadRules = async () => {
  try {
    const data = await leadAssignmentService.loadRules()
    rules.value = data.data || data
  } catch (err) {
    console.error('Error loading rules:', err)
  }
}

const applyFilters = () => {
  loadAuditLogs(1)
}

const clearFilters = () => {
  filters.value = {
    record_type: '',
    assigned_to: '',
    rule_id: '',
    date_range: ''
  }
  loadAuditLogs(1)
}

const previousPage = () => {
  if (pagination.value.prev_page_url) {
    loadAuditLogs(pagination.value.current_page - 1)
  }
}

const nextPage = () => {
  if (pagination.value.next_page_url) {
    loadAuditLogs(pagination.value.current_page + 1)
  }
}

const exportLogs = async () => {
  exportLoading.value = true
  
  try {
    const params = { ...filters.value }
    
    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (params[key] === '') {
        delete params[key]
      }
    })
    
    const response = await leadAssignmentService.exportAuditLogs(params)
    
    // Create download link
    const blob = new Blob([response.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `assignment-audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    showSuccess('Audit logs exported successfully')
  } catch (err) {
    console.error('Error exporting audit logs:', err)
    showError(err.response?.data?.message || 'Failed to export audit logs')
  } finally {
    exportLoading.value = false
  }
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString()
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadAuditLogs(),
    loadUsers(),
    loadRules()
  ])
})
</script>
