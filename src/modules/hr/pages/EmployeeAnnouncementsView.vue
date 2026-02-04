<template>
  <div class="space-y-6 pb-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-primary-purple to-primary-pink rounded-2xl shadow-lg p-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">Company Announcements</h1>
          <p class="text-purple-100 text-lg">Stay updated with the latest company news and updates</p>
        </div>
        <div class="hidden md:block">
          <div class="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex-1 w-full sm:w-auto">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Filter by Category</label>
          <select
            v-model="selectedCategory"
            @change="handleFilterChange"
            class="w-full sm:w-64 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all shadow-sm hover:shadow-md"
          >
            <option :value="null">All Categories</option>
            <option value="general">General</option>
            <option value="policy">Policy</option>
            <option value="event">Event</option>
            <option value="welcome">Welcome</option>
            <option value="birthday">Birthday</option>
          </select>
        </div>
        <div v-if="employeeAnnouncementsStore.announcements.length > 0" class="text-sm text-gray-600 font-medium">
          {{ employeeAnnouncementsStore.meta.total }} announcement{{ employeeAnnouncementsStore.meta.total !== 1 ? 's' : '' }} found
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="employeeAnnouncementsStore.loading" class="bg-white rounded-xl shadow-md border border-gray-200 p-16 text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary-purple border-t-transparent mx-auto"></div>
      <p class="mt-6 text-lg font-medium text-gray-600">Loading announcements...</p>
      <p class="mt-2 text-sm text-gray-500">Please wait while we fetch the latest updates</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="employeeAnnouncementsStore.announcements.length === 0" class="bg-white rounded-xl shadow-md border border-gray-200 p-16 text-center">
      <div class="max-w-md mx-auto">
        <div class="bg-gradient-to-br from-gray-100 to-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">No announcements found</h3>
        <p class="text-gray-600 mb-2">You're all caught up!</p>
        <p class="text-sm text-gray-500">New announcements will appear here when they're published.</p>
      </div>
    </div>

    <!-- Announcements Feed -->
    <div v-else class="space-y-5">
      <AnnouncementCard
        v-for="announcement in employeeAnnouncementsStore.announcements"
        :key="announcement.id"
        :announcement="announcement"
        :show-status="true"
        :show-engagement="true"
        @view="viewAnnouncement"
        @toggle-like="handleToggleLike"
        @acknowledge="handleAcknowledge"
      />
    </div>

    <!-- Pagination -->
    <div v-if="employeeAnnouncementsStore.meta.last_page > 1" class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-gray-600">
          Showing <span class="font-semibold text-gray-900">{{ (employeeAnnouncementsStore.meta.current_page - 1) * employeeAnnouncementsStore.meta.per_page + 1 }}</span> to 
          <span class="font-semibold text-gray-900">{{ Math.min(employeeAnnouncementsStore.meta.current_page * employeeAnnouncementsStore.meta.per_page, employeeAnnouncementsStore.meta.total) }}</span> of 
          <span class="font-semibold text-gray-900">{{ employeeAnnouncementsStore.meta.total }}</span> announcements
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="changePage(employeeAnnouncementsStore.meta.current_page - 1)"
            :disabled="employeeAnnouncementsStore.meta.current_page === 1"
            class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
          >
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </span>
          </button>
          <div class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg border border-gray-200">
            Page {{ employeeAnnouncementsStore.meta.current_page }} of {{ employeeAnnouncementsStore.meta.last_page }}
          </div>
          <button
            @click="changePage(employeeAnnouncementsStore.meta.current_page + 1)"
            :disabled="employeeAnnouncementsStore.meta.current_page === employeeAnnouncementsStore.meta.last_page"
            class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
          >
            <span class="flex items-center">
              Next
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <AnnouncementViewModal
      :show="showViewModal"
      :announcement="selectedAnnouncement"
      :is-employee-view="true"
      :submitting="submitting"
      :current-employee-id="currentEmployeeId"
      @close="showViewModal = false"
      @toggle-like="handleToggleLike"
      @acknowledge="handleAcknowledge"
      @add-comment="handleAddComment"
      @delete-comment="handleDeleteComment"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useEmployeeAnnouncementsStore } from '../store/employeeAnnouncements'
import { useAuth } from '@/composables/useAuth'
import AnnouncementCard from '../components/AnnouncementCard.vue'
import AnnouncementViewModal from '../components/AnnouncementViewModal.vue'

const employeeAnnouncementsStore = useEmployeeAnnouncementsStore()
const { user } = useAuth()

const showViewModal = ref(false)
const selectedAnnouncement = ref(null)
const selectedCategory = ref(null)
const submitting = ref(false)
const currentEmployeeId = ref(null)

const handleFilterChange = () => {
  employeeAnnouncementsStore.fetchAnnouncements({ category: selectedCategory.value, page: 1 })
}

const changePage = (page) => {
  employeeAnnouncementsStore.fetchAnnouncements({ ...employeeAnnouncementsStore.filters, page })
}

const viewAnnouncement = async (announcement) => {
  try {
    await employeeAnnouncementsStore.fetchAnnouncement(announcement.id)
    selectedAnnouncement.value = employeeAnnouncementsStore.selectedAnnouncement
    showViewModal.value = true
  } catch (err) {
    console.error('Error fetching announcement:', err)
  }
}

const handleToggleLike = async () => {
  if (!selectedAnnouncement.value) return
  submitting.value = true
  try {
    await employeeAnnouncementsStore.toggleLike(selectedAnnouncement.value.id)
    // Update selected announcement
    selectedAnnouncement.value = { ...selectedAnnouncement.value, ...employeeAnnouncementsStore.selectedAnnouncement }
  } catch (err) {
    console.error('Error toggling like:', err)
    alert(err.response?.data?.message || 'Failed to toggle like')
  } finally {
    submitting.value = false
  }
}

const handleAcknowledge = async () => {
  if (!selectedAnnouncement.value) return
  submitting.value = true
  try {
    await employeeAnnouncementsStore.acknowledgeAnnouncement(selectedAnnouncement.value.id)
    // Update selected announcement
    selectedAnnouncement.value = { ...selectedAnnouncement.value, is_acknowledged: true }
    alert('Announcement acknowledged successfully')
  } catch (err) {
    console.error('Error acknowledging announcement:', err)
    alert(err.response?.data?.message || 'Failed to acknowledge announcement')
  } finally {
    submitting.value = false
  }
}

const handleAddComment = async (comment) => {
  if (!selectedAnnouncement.value || !comment) return
  submitting.value = true
  try {
    await employeeAnnouncementsStore.addComment(selectedAnnouncement.value.id, comment)
    // Refresh announcement to get updated comments
    await employeeAnnouncementsStore.fetchAnnouncement(selectedAnnouncement.value.id)
    selectedAnnouncement.value = employeeAnnouncementsStore.selectedAnnouncement
  } catch (err) {
    console.error('Error adding comment:', err)
    alert(err.response?.data?.message || 'Failed to add comment')
  } finally {
    submitting.value = false
  }
}

const handleDeleteComment = async (commentId) => {
  if (!selectedAnnouncement.value || !commentId) return
  submitting.value = true
  try {
    await employeeAnnouncementsStore.deleteComment(selectedAnnouncement.value.id, commentId)
    // Refresh announcement to get updated comments
    await employeeAnnouncementsStore.fetchAnnouncement(selectedAnnouncement.value.id)
    selectedAnnouncement.value = employeeAnnouncementsStore.selectedAnnouncement
  } catch (err) {
    console.error('Error deleting comment:', err)
    alert(err.response?.data?.message || 'Failed to delete comment')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  // Get current employee ID from auth
  if (user.value?.employee_id) {
    currentEmployeeId.value = user.value.employee_id
  }
  await employeeAnnouncementsStore.fetchAnnouncements()
})
</script>

