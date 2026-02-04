<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Announcement Management</h1>
        <p class="mt-2 text-lg text-gray-600">Create and manage company announcements</p>
      </div>
      <div class="flex items-center gap-3">
        <router-link
          :to="{ name: 'HrAnnouncementAnalytics' }"
          class="inline-flex items-center px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          Analytics
        </router-link>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Announcement
        </button>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Announcements</p>
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
            <p class="text-xs text-gray-500 mt-1">{{ stats.publishedThisMonth }} this month</p>
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
            <p class="text-sm font-medium text-gray-500">Drafts</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.drafts }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-purple-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Acknowledgment Rate</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.acknowledgmentRate }}%</p>
            <p class="text-xs text-gray-500 mt-1">{{ stats.acknowledgmentChange >= 0 ? '+' : '' }}{{ stats.acknowledgmentChange }}% vs avg</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search announcements..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @input="handleSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            v-model="filters.category"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="handleFilterChange"
          >
            <option :value="null">All Categories</option>
            <option value="general">General</option>
            <option value="policy">Policy</option>
            <option value="event">Event</option>
            <option value="welcome">Welcome</option>
            <option value="birthday">Birthday</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="handleFilterChange"
          >
            <option :value="null">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="hrAnnouncementsStore.error && !hrAnnouncementsStore.loading" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-800">{{ hrAnnouncementsStore.error }}</p>
      </div>
      <button
        @click="hrAnnouncementsStore.fetchAnnouncements()"
        class="mt-4 px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- Announcements Table -->
    <div v-else class="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
      <div v-if="hrAnnouncementsStore.loading" class="p-12 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading announcements...</p>
      </div>

      <div v-else-if="hrAnnouncementsStore.announcements.length === 0" class="p-12 text-center">
        <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <h3 class="mt-6 text-lg font-semibold text-gray-900">No announcements found</h3>
        <p class="mt-2 text-sm text-gray-500">Get started by creating your first announcement.</p>
        <button
          @click="showCreateModal = true"
          class="mt-4 px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink transition-colors"
        >
          Create Announcement
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Audience</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published Date</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider pr-8">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="announcement in hrAnnouncementsStore.announcements"
              :key="announcement.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 cursor-pointer" @click="viewAnnouncement(announcement)">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ announcement.title }}</div>
                  <div class="text-sm text-gray-500 line-clamp-1 mt-1">{{ stripHtml(announcement.message) }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="viewAnnouncement(announcement)">
                <AnnouncementCategoryBadge :category="announcement.category" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer" @click="viewAnnouncement(announcement)">
                {{ getTargetAudience(announcement) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="viewAnnouncement(announcement)">
                <StatusBadge :status="announcement.status" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer" @click="viewAnnouncement(announcement)">
                {{ formatDate(announcement.published_at || announcement.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium pr-8">
                <div class="flex items-center justify-end space-x-3">
                  <button
                    @click.stop="viewAnnouncement(announcement)"
                    class="p-2 text-primary-purple hover:text-white hover:bg-primary-purple rounded-lg transition-all duration-200"
                    title="View"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click.stop="handleEdit(announcement)"
                    class="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click.stop="handleDelete(announcement)"
                    class="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200"
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

      <!-- Pagination -->
      <div v-if="hrAnnouncementsStore.meta.last_page > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ (hrAnnouncementsStore.meta.current_page - 1) * hrAnnouncementsStore.meta.per_page + 1 }} to
          {{ Math.min(hrAnnouncementsStore.meta.current_page * hrAnnouncementsStore.meta.per_page, hrAnnouncementsStore.meta.total) }} of
          {{ hrAnnouncementsStore.meta.total }} results
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="changePage(hrAnnouncementsStore.meta.current_page - 1)"
            :disabled="hrAnnouncementsStore.meta.current_page === 1"
            class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="changePage(hrAnnouncementsStore.meta.current_page + 1)"
            :disabled="hrAnnouncementsStore.meta.current_page === hrAnnouncementsStore.meta.last_page"
            class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <AnnouncementFormModal
      :show="showCreateModal || showEditModal"
      :announcement="selectedAnnouncement"
      :departments="departments"
      :employees="employees"
      @close="closeModal"
      @saved="handleSaved"
    />

    <!-- View Modal -->
    <AnnouncementViewModal
      :show="showViewModal"
      :announcement="selectedAnnouncement"
      :is-hr-view="true"
      @close="showViewModal = false"
      @edit="handleEdit"
      @archive="handleArchive"
      @send-reminders="handleSendReminders"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHrAnnouncementsStore } from '../store/hrAnnouncements'
import { hrAPI } from '../api/hrAPI'
import AnnouncementFormModal from '../components/AnnouncementFormModal.vue'
import AnnouncementViewModal from '../components/AnnouncementViewModal.vue'
import AnnouncementCategoryBadge from '../components/AnnouncementCategoryBadge.vue'
import StatusBadge from '../components/StatusBadge.vue'

const hrAnnouncementsStore = useHrAnnouncementsStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedAnnouncement = ref(null)
const searchQuery = ref('')
const departments = ref([])
const employees = ref([])

const filters = computed(() => hrAnnouncementsStore.filters)

const stats = computed(() => {
  const announcements = hrAnnouncementsStore.announcements
  const published = announcements.filter(a => a.status === 'published')
  const drafts = announcements.filter(a => a.status === 'draft')
  const now = new Date()
  const thisMonth = published.filter(a => {
    const date = new Date(a.published_at || a.created_at)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length
  
  // Calculate acknowledgment rate (simplified)
  const totalViews = published.reduce((sum, a) => sum + (a.views_count || 0), 0)
  const totalAcks = published.reduce((sum, a) => sum + (a.acknowledgments_count || 0), 0)
  const rate = totalViews > 0 ? Math.round((totalAcks / totalViews) * 100) : 0
  
  return {
    total: hrAnnouncementsStore.meta.total,
    published: published.length,
    publishedThisMonth: thisMonth,
    drafts: drafts.length,
    acknowledgmentRate: rate,
    acknowledgmentChange: 2.1 // This would come from analytics API
  }
})

const handleSearch = () => {
  hrAnnouncementsStore.fetchAnnouncements({ search: searchQuery.value, page: 1 })
}

const handleFilterChange = () => {
  hrAnnouncementsStore.fetchAnnouncements({ ...filters.value, page: 1 })
}

const resetFilters = () => {
  searchQuery.value = ''
  hrAnnouncementsStore.fetchAnnouncements({ status: null, category: null, search: '', page: 1 })
}

const changePage = (page) => {
  hrAnnouncementsStore.fetchAnnouncements({ ...filters.value, page })
}

const viewAnnouncement = async (announcement) => {
  try {
    await hrAnnouncementsStore.fetchAnnouncement(announcement.id)
    selectedAnnouncement.value = hrAnnouncementsStore.selectedAnnouncement
    showViewModal.value = true
  } catch (err) {
    console.error('Error fetching announcement:', err)
  }
}

const handleEdit = async (announcement) => {
  try {
    // Close view modal if open first
    showViewModal.value = false
    
    // If announcement is passed (from table), fetch full details
    if (announcement && announcement.id) {
      await hrAnnouncementsStore.fetchAnnouncement(announcement.id)
      selectedAnnouncement.value = hrAnnouncementsStore.selectedAnnouncement
    } else if (!selectedAnnouncement.value) {
      // If no announcement passed and no selectedAnnouncement, we can't edit
      console.error('No announcement provided for editing')
      return
    }
    // If called from view modal, selectedAnnouncement should already be set
    
    // Small delay to ensure data is set before opening modal
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // Open edit modal
    showEditModal.value = true
  } catch (err) {
    console.error('Error loading announcement for editing:', err)
    alert(err.response?.data?.message || 'Failed to load announcement for editing')
  }
}

const handleArchive = async () => {
  if (!selectedAnnouncement.value) return
  if (!confirm('Are you sure you want to archive this announcement?')) return
  
  try {
    await hrAnnouncementsStore.archiveAnnouncement(selectedAnnouncement.value.id)
    showViewModal.value = false
    await hrAnnouncementsStore.fetchAnnouncements()
  } catch (err) {
    console.error('Error archiving announcement:', err)
    alert(err.response?.data?.message || 'Failed to archive announcement')
  }
}

const handleDelete = async (announcement) => {
  if (!confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) return
  
  try {
    await hrAnnouncementsStore.deleteAnnouncement(announcement.id)
    await hrAnnouncementsStore.fetchAnnouncements()
  } catch (err) {
    console.error('Error deleting announcement:', err)
    alert(err.response?.data?.message || 'Failed to delete announcement')
  }
}

const handleSendReminders = async () => {
  if (!selectedAnnouncement.value) return
  
  try {
    await hrAnnouncementsStore.sendReminders(selectedAnnouncement.value.id)
    alert('Reminders sent successfully')
  } catch (err) {
    console.error('Error sending reminders:', err)
    alert(err.response?.data?.message || 'Failed to send reminders')
  }
}

const handleSaved = () => {
  hrAnnouncementsStore.fetchAnnouncements()
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedAnnouncement.value = null
}

const getTargetAudience = (announcement) => {
  if (announcement.target_audience_type === 'all_employees') return 'All Employees'
  if (announcement.target_audience_type === 'department_specific') {
    return `${announcement.target_departments?.length || 0} Department(s)`
  }
  if (announcement.target_audience_type === 'individual') {
    return `${announcement.target_employee_ids?.length || 0} Employee(s)`
  }
  return 'N/A'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const stripHtml = (html) => {
  if (!html) return ''
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

// Load departments and employees for form
const loadFormData = async () => {
  try {
    const [deptResponse, empResponse] = await Promise.all([
      hrAPI.getDepartments({ per_page: 100 }),
      hrAPI.getEmployees({ per_page: 100 })
    ])
    if (deptResponse.data.success) {
      departments.value = deptResponse.data.data || []
    }
    if (empResponse.data.success) {
      employees.value = empResponse.data.data || []
    }
  } catch (err) {
    console.error('Error loading form data:', err)
  }
}

onMounted(async () => {
  await loadFormData()
  await hrAnnouncementsStore.fetchAnnouncements()
})
</script>

