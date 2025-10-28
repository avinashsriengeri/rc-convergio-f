<template>
  <VerificationPageGuard>
    <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 font-inter">{{ $t('dashboard.title') }}</h1>
            <p class="text-sm text-gray-600 font-inter">{{ $t('dashboard.welcome', { name: userName }) }}</p>
          </div>
          <BaseButton
            variant="primary"
            @click="showQuickAddModal = true"
          >
            {{ $t('common.quick_add') }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-purple"></div>
      </div>
      
      <div v-else class="space-y-8">
        <!-- Search Bar -->
        <div class="flex items-center space-x-4">
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('common.search')"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-primary-purple"
              @input="handleSearch"
              @focus="showSearchResults = true"
            />
            <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            
            <!-- Search Results Dropdown -->
            <div v-if="showSearchResults && searchResults.length > 0" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <div class="p-2">
                <div v-for="(group, groupType) in groupedResults" :key="groupType" class="mb-4">
                  <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 px-2">{{ groupType }}</h4>
                  <div class="space-y-1">
                    <div
                      v-for="result in group"
                      :key="`${result.type}-${result.id}`"
                      @click="navigateToResult(result)"
                      class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <div class="flex-shrink-0">
                        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path v-if="result.type === 'contact'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            <path v-else-if="result.type === 'company'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            <path v-else-if="result.type === 'deal'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ result.name }}</p>
                        <p class="text-xs text-gray-500 truncate">{{ result.email || result.company || result.value }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- No Results -->
            <div v-if="showSearchResults && searchQuery && !searching && searchResults.length === 0" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div class="p-4 text-center">
                <p class="text-sm text-gray-500">{{ $t('dashboard.no_results', { query: searchQuery }) }}</p>
              </div>
            </div>
            
            <!-- Loading -->
            <div v-if="searching" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div class="p-4 text-center">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-purple mx-auto"></div>
                <p class="text-sm text-gray-500 mt-2">{{ $t('dashboard.searching') }}</p>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-primary-purple to-primary-pink rounded-full flex items-center justify-center">
              <span class="text-white font-medium text-sm">{{ userName.charAt(0) }}</span>
            </div>
            <span class="text-sm font-medium text-gray-700">{{ userName }}</span>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Open Deals -->
          <div class="bg-card-gross-sales rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105" @click="$router.push('/deals')">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1 font-inter">{{ $t('dashboard.open') }}</p>
                <p class="text-2xl font-semibold text-gray-900 font-inter">${{ formatCurrency(dashboardData?.open_value || 0) }}</p>
                <p class="text-sm text-gray-500 font-inter">{{ $t('dashboard.today_won', { count: dashboardData?.won_today || 0 }) }}</p>
              </div>
              <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <svg class="w-6 h-6 text-icon-gross-sales" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Won Deals -->
          <div class="bg-card-total-income rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105" @click="$router.push('/deals')">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1 font-inter">{{ $t('dashboard.won') }}</p>
                <p class="text-2xl font-semibold text-gray-900 font-inter">{{ dashboardData?.won_today || 0 }}</p>
                <p class="text-sm text-gray-500 font-inter">{{ $t('dashboard.week_won', { count: dashboardData?.won_week || 0 }) }}</p>
              </div>
              <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <svg class="w-6 h-6 text-icon-total-income" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Lost Deals -->
          <div class="bg-card-total-expense rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105" @click="$router.push('/deals')">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1 font-inter">{{ $t('dashboard.lost') }}</p>
                <p class="text-2xl font-semibold text-gray-900 font-inter">{{ dashboardData?.lost_today || 0 }}</p>
                <p class="text-sm text-gray-500 font-inter">{{ $t('dashboard.week_lost', { count: dashboardData?.lost_week || 0 }) }}</p>
              </div>
              <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <svg class="w-6 h-6 text-icon-total-expense" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Follow Ups -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105" @click="$router.push('/tasks')">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 font-inter">{{ $t('dashboard.follow_ups') }}</h3>
              <div class="space-y-3">
                <div v-for="task in todayTasks" :key="task.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ task.title || $t('dashboard.task_default', { id: task.id }) }}</p>
                    <p class="text-xs text-gray-500">{{ task.due_date || task.created_at }}</p>
                  </div>
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusClass(task.status)">
                    {{ task.status || $t('dashboard.pending') }}
                  </span>
                </div>
                <div v-if="todayTasks.length === 0" class="text-center py-4 text-gray-500">
                  {{ $t('dashboard.no_follow_ups') }}
                </div>
              </div>
            </div>

            <!-- Campaign Metrics -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 font-inter">{{ $t('dashboard.last_campaign') }}</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-blue-50 rounded-lg">
                  <p class="text-2xl font-bold text-blue-600">{{ campaignMetrics?.sent || 0 }}</p>
                  <p class="text-sm text-gray-600">{{ $t('dashboard.sent') }}</p>
                </div>
                <div class="text-center p-3 bg-green-50 rounded-lg">
                  <p class="text-2xl font-bold text-green-600">{{ campaignMetrics?.opens || 0 }}</p>
                  <p class="text-sm text-gray-600">{{ $t('dashboard.opens') }}</p>
                </div>
                <div class="text-center p-3 bg-purple-50 rounded-lg">
                  <p class="text-2xl font-bold text-purple-600">{{ campaignMetrics?.clicks || 0 }}</p>
                  <p class="text-sm text-gray-600">{{ $t('dashboard.clicks') }}</p>
                </div>
                <div class="text-center p-3 bg-red-50 rounded-lg">
                  <p class="text-2xl font-bold text-red-600">{{ campaignMetrics?.bounces || 0 }}</p>
                  <p class="text-sm text-gray-600">{{ $t('dashboard.bounces') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Suggestions -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 font-inter">{{ $t('dashboard.suggestions') }}</h3>
              <ul class="space-y-3 text-sm text-gray-700">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {{ $t('dashboard.suggestion_1') }}
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {{ $t('dashboard.suggestion_2') }}
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {{ $t('dashboard.suggestion_3') }}
                </li>
              </ul>
              <div class="mt-6 space-y-3">
                <BaseButton variant="primary" size="sm" full-width @click="$router.push('/deals')">
                  {{ $t('dashboard.view_deals') }}
                </BaseButton>
                <BaseButton variant="secondary" size="sm" full-width @click="$router.push('/contacts')">
                  {{ $t('dashboard.view_contacts') }}
                </BaseButton>
                <BaseButton variant="outline" size="sm" full-width @click="$router.push('/tasks')">
                  {{ $t('dashboard.view_tasks') }}
                </BaseButton>
              </div>
            </div>

            <!-- Recent Contacts -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 font-inter">{{ $t('dashboard.recent_contacts') }}</h3>
              <div class="space-y-3">
                <div v-for="contact in recentContacts" :key="contact.id" class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-gradient-to-r from-primary-purple to-primary-pink rounded-full flex items-center justify-center">
                      <span class="text-white font-medium text-xs">{{ getInitials(contact) }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ getFullName(contact) }}</p>
                      <p class="text-xs text-gray-500">{{ contact.email || $t('dashboard.no_email') }}</p>
                    </div>
                  </div>
                  <span class="text-xs text-gray-500">{{ formatDate(contact.created_at) }}</span>
                </div>
                <div v-if="recentContacts.length === 0" class="text-center py-4 text-gray-500">
                  {{ $t('dashboard.no_recent_contacts') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Add Modal -->
    <QuickAddModal v-if="showQuickAddModal" @close="showQuickAddModal = false" @created="handleQuickAddCreated" />
  </div>
  </VerificationPageGuard>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'
import { dashboardAPI, tasksAPI, searchAPI } from '@/services/api'
import { debounce } from 'lodash-es'
import BaseButton from '@/components/ui/BaseButton.vue'
import QuickAddModal from '@/components/modals/QuickAddModal.vue'
import VerificationPageGuard from '@/components/ui/VerificationPageGuard.vue'

const router = useRouter()

const { userName } = useAuth()
const { success, error } = useNotifications()

const loading = ref(true)
const showQuickAddModal = ref(false)
const dashboardData = ref(null)
const todayTasks = ref([])
const recentContacts = ref([])
const campaignMetrics = ref(null)

// Search functionality
const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const showSearchResults = ref(false)

const fetchDashboardData = async () => {
  try {
    loading.value = true
    
    // Fetch dashboard data - it contains all the data we need
    const dashboardRes = await dashboardAPI.getDashboard()
    
    // The backend returns: { success: true, data: { pipeline: {...}, tasks: {...}, contacts: {...}, campaigns: {...} } }
    dashboardData.value = dashboardRes.data.data.pipeline || {}
    
    // Map tasks data properly - API returns {today: 0, overdue: 2, can_quick_complete: true}
    const tasksData = dashboardRes.data.data.tasks || {}
    todayTasks.value = [
      ...Array(tasksData.today || 0).fill().map((_, i) => ({
        id: `today-${i}`,
        title: 'Task',
        status: 'today',
        due_date: 'Today'
      })),
      ...Array(tasksData.overdue || 0).fill().map((_, i) => ({
        id: `overdue-${i}`,
        title: 'Overdue Task',
        status: 'due',
        due_date: 'Overdue'
      }))
    ]
    
    // Map contacts data properly
    recentContacts.value = dashboardRes.data.data.contacts || []
    
    // Map campaign data properly - API returns {delivered: "1", opens: 0, clicks: 0, bounces: 0}
    const campaignsData = dashboardRes.data.data.campaigns || {}
    campaignMetrics.value = {
      sent: parseInt(campaignsData.delivered) || 0,
      opens: campaignsData.opens || 0,
      clicks: campaignsData.clicks || 0,
      bounces: campaignsData.bounces || 0
    }
    
  } catch (err) {
    console.error('Failed to fetch dashboard data:', err)
    error('Failed to load dashboard data')
  } finally {
    loading.value = false
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Search functionality
const handleSearch = debounce(async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    showSearchResults.value = false
    return
  }
  
  try {
    searching.value = true
    const response = await searchAPI.globalSearch(searchQuery.value)
    searchResults.value = response.data.data || response.data || []
  } catch (err) {
    console.error('Search failed:', err)
    searchResults.value = []
  } finally {
    searching.value = false
  }
}, 500)

const groupedResults = computed(() => {
  const groups = {}
  searchResults.value.forEach(result => {
    const type = result.type || 'other'
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(result)
  })
  return groups
})

const navigateToResult = (result) => {
  showSearchResults.value = false
  searchQuery.value = ''
  
  switch (result.type) {
    case 'contact':
      // TODO: Temporary suppression of recent contacts API during contact detail navigation
      if (typeof window !== 'undefined') {
        window.__RC_SUPPRESS_RECENT_CONTACTS__ = true
      }
      router.push(`/contacts/${result.id}`)
      break
    case 'company':
      router.push(`/companies/${result.id}`)
      break
    case 'deal':
      router.push(`/deals/${result.id}`)
      break
    default:
      console.warn('Unknown result type:', result.type)
  }
}

// Close search results when clicking outside
const closeSearchResults = () => {
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

const getInitials = (contact) => {
  if (!contact) return '?'
  if (contact.first_name && contact.last_name) {
    return `${contact.first_name[0]}${contact.last_name[0]}`.toUpperCase()
  } else if (contact.first_name) {
    return contact.first_name[0].toUpperCase()
  } else if (contact.last_name) {
    return contact.last_name[0].toUpperCase()
  }
  return '?'
}

const getFullName = (contact) => {
  if (!contact) return 'N/A'
  if (contact.first_name && contact.last_name) {
    return `${contact.first_name} ${contact.last_name}`
  } else if (contact.first_name) {
    return contact.first_name
  } else if (contact.last_name) {
    return contact.last_name
  }
  return 'N/A'
}

const getStatusClass = (status) => {
  const classes = {
    'today': 'bg-blue-100 text-blue-800',
    'due': 'bg-red-100 text-red-800',
    'queued': 'bg-gray-100 text-gray-800',
    'completed': 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const handleQuickAddCreated = (data) => {
  success(`${data.type} created successfully`)
  showQuickAddModal.value = false
  // Refresh dashboard data
  fetchDashboardData()
}

onMounted(() => {
  fetchDashboardData()
})
</script>
