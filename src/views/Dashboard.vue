<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-sm text-gray-600">Welcome back, {{ userName }}</p>
          </div>
          <BaseButton
            variant="primary"
            @click="showQuickAddModal = true"
          >
            Quick Add
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2596be]"></div>
      </div>
      
      <div v-else class="space-y-8">
        <!-- Search Bar -->
        <div class="flex items-center space-x-4">
          <div class="flex-1 relative">
            <input
              type="text"
              placeholder="Search contacts, companies, deals..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be]"
            />
            <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-[#2596be] to-[#973894] rounded-full flex items-center justify-center">
              <span class="text-white font-medium text-sm">{{ userName.charAt(0) }}</span>
            </div>
            <span class="text-sm font-medium text-gray-700">{{ userName }}</span>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Open Deals -->
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Open</p>
                <p class="text-2xl font-bold text-gray-900">${{ formatCurrency(dashboardData?.open_deals || 0) }}</p>
                <p class="text-sm text-gray-500">Week: ${{ formatCurrency(dashboardData?.open_deals_week || 0) }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Won Deals -->
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Won</p>
                <p class="text-2xl font-bold text-gray-900">${{ formatCurrency(dashboardData?.won_deals || 0) }}</p>
                <p class="text-sm text-gray-500">Week: ${{ formatCurrency(dashboardData?.won_deals_week || 0) }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Lost Deals -->
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Lost</p>
                <p class="text-2xl font-bold text-gray-900">${{ formatCurrency(dashboardData?.lost_deals || 0) }}</p>
                <p class="text-sm text-gray-500">Week: ${{ formatCurrency(dashboardData?.lost_deals_week || 0) }}</p>
              </div>
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Follow Ups</h3>
              <div class="space-y-3">
                <div v-for="task in todayTasks" :key="task.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ task.title }}</p>
                    <p class="text-xs text-gray-500">{{ task.due_date }}</p>
                  </div>
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusClass(task.status)">
                    {{ task.status }}
                  </span>
                </div>
                <div v-if="todayTasks.length === 0" class="text-center py-4 text-gray-500">
                  No follow-ups for today
                </div>
              </div>
            </div>

            <!-- Last Campaign -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Last Campaign</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-900">{{ campaignMetrics?.sent || 0 }}</p>
                  <p class="text-sm text-gray-600">Sent</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-900">{{ campaignMetrics?.opens || 0 }}</p>
                  <p class="text-sm text-gray-600">Opens ({{ campaignMetrics?.open_rate || 0 }}%)</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-900">{{ campaignMetrics?.clicks || 0 }}</p>
                  <p class="text-sm text-gray-600">Clicks ({{ campaignMetrics?.click_rate || 0 }}%)</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-900">{{ campaignMetrics?.bounces || 0 }}</p>
                  <p class="text-sm text-gray-600">Bounces ({{ campaignMetrics?.bounce_rate || 0 }}%)</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Suggestions -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Suggestions</h3>
              <ul class="space-y-3 text-sm text-gray-700">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Try sequencing warm leads from last 7 days.
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Batch-complete admin tasks after 4 PM.
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Best send time for emails: 9-11 AM local.
                </li>
              </ul>
              <div class="mt-6 space-y-3">
                <BaseButton variant="primary" size="sm" full-width @click="$router.push('/contacts?action=create')">
                  New Deal
                </BaseButton>
                <BaseButton variant="secondary" size="sm" full-width @click="$router.push('/contacts?action=create')">
                  Add Contact
                </BaseButton>
                <BaseButton variant="outline" size="sm" full-width>
                  New Task
                </BaseButton>
              </div>
            </div>

            <!-- Recent Contacts -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Contacts</h3>
              <div class="space-y-3">
                <div v-for="contact in recentContacts" :key="contact.id" class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-gradient-to-r from-[#2596be] to-[#973894] rounded-full flex items-center justify-center">
                      <span class="text-white font-medium text-xs">{{ getInitials(contact) }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ getFullName(contact) }}</p>
                      <p class="text-xs text-gray-500">{{ contact.email || 'No email' }}</p>
                    </div>
                  </div>
                  <span class="text-xs text-gray-500">{{ formatDate(contact.created_at) }}</span>
                </div>
                <div v-if="recentContacts.length === 0" class="text-center py-4 text-gray-500">
                  No recent contacts
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'
import { dashboardAPI, tasksAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import QuickAddModal from '@/components/modals/QuickAddModal.vue'

const { userName } = useAuth()
const { success, error } = useNotifications()

const loading = ref(true)
const showQuickAddModal = ref(false)
const dashboardData = ref(null)
const todayTasks = ref([])
const recentContacts = ref([])
const campaignMetrics = ref(null)

const fetchDashboardData = async () => {
  try {
    loading.value = true
    
    // Fetch all dashboard data in parallel
    const [dashboardRes, tasksRes, contactsRes, campaignsRes] = await Promise.all([
      dashboardAPI.getDashboard(),
      tasksAPI.getTodayTasks(),
      dashboardAPI.getRecentContacts(5),
      dashboardAPI.getCampaignMetrics('14d')
    ])
    
    dashboardData.value = dashboardRes.data
    todayTasks.value = tasksRes.data || []
    recentContacts.value = contactsRes.data || []
    campaignMetrics.value = campaignsRes.data
    
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
