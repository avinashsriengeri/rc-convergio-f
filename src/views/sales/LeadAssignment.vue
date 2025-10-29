<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Access Denied -->
    <AccessDenied v-if="!hasAccess" />
    
    <!-- Main Content -->
    <div v-else>
      <!-- Breadcrumbs -->
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="flex py-4" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-4">
              <li>
                <div class="flex items-center">
                  <router-link to="/sales" class="text-gray-400 hover:text-gray-500">
                    <svg class="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span class="sr-only">Home</span>
                  </router-link>
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="ml-4 text-sm font-medium text-gray-500">{{ $t('sales.overview.title') }}</span>
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="ml-4 text-sm font-medium text-gray-900">Lead Assignment</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-8 text-white">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold">Lead Assignment Engine</h1>
            <p class="mt-2 text-lg text-blue-100">Automate how leads and deals are assigned to your team members.</p>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Refresh Button -->
            <BaseButton
              @click="refreshData"
              :loading="loading"
              variant="outline"
              size="md"
              class="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <svg v-if="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5 mr-2" />
              {{ tab.name }}
              <span
                v-if="tab.badge"
                :class="[
                  'ml-2 py-0.5 px-2 rounded-full text-xs font-medium',
                  tab.badgeColor === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ tab.badge }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <!-- Rules Tab -->
        <div v-if="activeTab === 'rules'" class="p-6">
          <RulesTab
            :loading="loading"
            :error="error"
            @refresh="refreshData"
          />
        </div>

        <!-- Defaults Tab -->
        <div v-if="activeTab === 'defaults'" class="p-6">
          <DefaultsTab
            :loading="loading"
            :error="error"
            @refresh="refreshData"
          />
        </div>

        <!-- Audit Logs Tab -->
        <div v-if="activeTab === 'audit-logs'" class="p-6">
          <AuditLogsTab
            :loading="loading"
            :error="error"
            @refresh="refreshData"
          />
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue'
import { error as showError, success as showSuccess } from '@/utils/notifications'
import BaseButton from '@/components/ui/BaseButton.vue'

// Lazy load tab components
const RulesTab = defineAsyncComponent(() => import('./lead-assignment/RulesTab.vue'))
const DefaultsTab = defineAsyncComponent(() => import('./lead-assignment/DefaultsTab.vue'))
const AuditLogsTab = defineAsyncComponent(() => import('./lead-assignment/AuditLogsTab.vue'))
const AccessDenied = defineAsyncComponent(() => import('./lead-assignment/components/AccessDenied.vue'))

// Tab icons
const RulesIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

const DefaultsIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  `
}

const AuditLogsIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  `
}

// Reactive state
const loading = ref(false)
const error = ref(null)
const activeTab = ref('rules')
const userRole = ref(null)
const hasAccess = ref(false)

// Tab configuration
const tabs = ref([
  {
    id: 'rules',
    name: 'Rules',
    icon: RulesIcon,
    badge: null,
    badgeColor: 'blue'
  },
  {
    id: 'defaults',
    name: 'Defaults',
    icon: DefaultsIcon,
    badge: null,
    badgeColor: 'gray'
  },
  {
    id: 'audit-logs',
    name: 'Audit Logs',
    icon: AuditLogsIcon,
    badge: null,
    badgeColor: 'gray'
  }
])

// Computed
const canAccess = computed(() => {
  // Check if user has admin role or sales admin role
  return userRole.value === 'admin' || userRole.value === 'sales_admin'
})

// Methods
const checkUserAccess = () => {
  try {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    
    // Handle nested roles array from backend
    if (userData.roles && userData.roles.length > 0) {
      if (typeof userData.roles[0] === 'object' && userData.roles[0]?.name) {
        userRole.value = userData.roles[0].name
      } else if (typeof userData.roles[0] === 'string') {
        userRole.value = userData.roles[0]
      }
    }
    // Fallback to flat role property
    if (!userRole.value) {
      userRole.value = userData.role
    }
    
    hasAccess.value = canAccess.value
  } catch (error) {
    console.error('Error checking user access:', error)
    hasAccess.value = false
  }
}

const refreshData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Emit refresh event to active tab
    // The individual tab components will handle their own data loading
    showSuccess('Data refreshed successfully')
  } catch (err) {
    console.error('Error refreshing data:', err)
    showError('Failed to refresh data')
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  checkUserAccess()
})
</script>
