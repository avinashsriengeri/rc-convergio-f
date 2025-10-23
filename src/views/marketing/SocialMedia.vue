<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumbs -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex py-4" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <div class="flex items-center">
                <router-link to="/marketing" class="text-gray-400 hover:text-gray-500">
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
                <span class="ml-4 text-sm font-medium text-gray-500">{{ $t('common.marketing') }}</span>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-900">Social Media</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:justify-between md:items-center">
          <div class="mb-4 md:mb-0">
            <h1 class="text-3xl font-bold text-gray-900">Social Media Management</h1>
            <p class="mt-2 text-lg text-gray-600">Manage your social media presence with scheduling, analytics, and listening tools</p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="showPostComposer = true"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center shadow-sm"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Post
            </button>
          </div>
        </div>
      </div>

      <!-- Dashboard Stats -->
      <div v-if="dashboard" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Posts</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ dashboard.stats.total_posts }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Published Today</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ dashboard.stats.published_today }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Scheduled Posts</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ dashboard.stats.scheduled_posts }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Connected Platforms</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ Object.keys(dashboard.stats.platform_distribution || {}).length }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="mb-8">
        <div class="border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
          <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              @click="activeTab = 'overview'"
              :class="[
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center'
              ]"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Overview
            </button>
            <button
              @click="activeTab = 'accounts'"
              :class="[
                activeTab === 'accounts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center'
              ]"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Connected Accounts
            </button>
            <button
              @click="activeTab = 'posts'"
              :class="[
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center'
              ]"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Posts
            </button>
            <button
              @click="activeTab = 'analytics'"
              :class="[
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center'
              ]"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </button>
            <button
              @click="activeTab = 'listening'"
              :class="[
                activeTab === 'listening'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center'
              ]"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Social Listening
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Recent Posts -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
              <div v-if="dashboard && dashboard.recent_posts" class="space-y-3">
                <div
                  v-for="post in dashboard.recent_posts.slice(0, 5)"
                  :key="post.id"
                  class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  @click="viewPost(post)"
                >
                  <div class="flex items-center space-x-3 flex-1">
                    <div :class="getPlatformIconClass(post.platform)">
                      <i :class="socialMediaHelpers.getPlatformIcon(post.platform)"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-medium text-gray-900 truncate">{{ post.title }}</h4>
                      <p class="text-sm text-gray-500 capitalize">{{ post.platform }}</p>
                    </div>
                  </div>
                  <span :class="socialMediaHelpers.getStatusColor(post.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ post.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Upcoming Scheduled -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Upcoming Scheduled Posts</h3>
              <div v-if="dashboard && dashboard.upcoming_scheduled" class="space-y-3">
                <div
                  v-for="post in dashboard.upcoming_scheduled.slice(0, 5)"
                  :key="post.id"
                  class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-center space-x-3 flex-1">
                    <div :class="getPlatformIconClass(post.platform)">
                      <i :class="socialMediaHelpers.getPlatformIcon(post.platform)"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-medium text-gray-900 truncate">{{ post.title }}</h4>
                      <p class="text-sm text-gray-500">{{ socialMediaHelpers.formatDate(post.scheduled_at) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                <p class="text-sm">No scheduled posts</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Connected Accounts Tab -->
        <div v-if="activeTab === 'accounts'">
          <AccountsManager />
        </div>

        <!-- Posts Tab -->
        <div v-if="activeTab === 'posts'" class="space-y-6">
          <!-- Posts Filters -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Search Posts</label>
                <input
                  v-model="postFilters.search"
                  type="text"
                  placeholder="Search posts..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="loadPosts"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select
                  v-model="postFilters.platform"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @change="loadPosts"
                >
                  <option value="">All Platforms</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  v-model="postFilters.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @change="loadPosts"
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                <input
                  v-model="postFilters.date_from"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @change="loadPosts"
                />
              </div>
            </div>
          </div>

          <!-- Posts Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="post in posts"
              :key="post.id"
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2">
                  <i :class="socialMediaHelpers.getPlatformIcon(post.platform)" class="text-xl"></i>
                  <span class="text-sm font-medium text-gray-900 capitalize">{{ post.platform }}</span>
                </div>
                <span :class="socialMediaHelpers.getStatusColor(post.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ post.status }}
                </span>
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ post.title }}</h3>
              <p class="text-sm text-gray-600 mb-4">{{ socialMediaHelpers.truncateContent(post.content, 100) }}</p>
              
              <div v-if="post.hashtags && post.hashtags.length" class="mb-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="hashtag in post.hashtags.slice(0, 3)"
                    :key="hashtag"
                    class="inline-flex px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full"
                  >
                    #{{ hashtag }}
                  </span>
                  <span v-if="post.hashtags.length > 3" class="text-xs text-gray-500">
                    +{{ post.hashtags.length - 3 }}
                  </span>
                </div>
              </div>

              <div v-if="post.engagement_metrics" class="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ socialMediaHelpers.formatNumber(post.engagement_metrics.likes || 0) }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{{ socialMediaHelpers.formatNumber(post.engagement_metrics.comments || 0) }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{{ socialMediaHelpers.formatDate(post.created_at) }}</span>
                <span v-if="post.scheduled_at">📅 {{ socialMediaHelpers.formatDate(post.scheduled_at) }}</span>
              </div>

              <div class="flex justify-end space-x-2">
                <button
                  @click="editPost(post)"
                  class="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  v-if="post.status === 'draft'"
                  @click="publishPost(post.id)"
                  class="text-green-600 hover:text-green-900 text-sm font-medium"
                >
                  Publish
                </button>
                <button
                  @click="deletePost(post.id)"
                  class="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div v-if="posts.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
            <div class="mt-6">
              <button
                @click="showPostComposer = true"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Post
              </button>
            </div>
          </div>
        </div>

        <!-- Analytics Tab -->
        <div v-if="activeTab === 'analytics'">
          <SocialAnalytics />
        </div>

        <!-- Social Listening Tab -->
        <div v-if="activeTab === 'listening'">
          <SocialListening />
        </div>
      </div>
    </div>

    <!-- Post Composer Modal -->
    <PostComposer
      :show="showPostComposer"
      :post="editingPost"
      @close="closePostComposer"
      @saved="handlePostSaved"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSocialMediaStore } from '@/stores/socialMedia'
import { socialMediaHelpers } from '@/services/socialMedia'
import { success as showSuccess, error as showError } from '@/utils/notifications'

// Components
import AccountsManager from '@/components/social/AccountsManager.vue'
import PostComposer from '@/components/social/PostComposer.vue'
import SocialAnalytics from '@/components/social/SocialAnalytics.vue'
import SocialListening from '@/components/social/SocialListening.vue'

const { t } = useI18n()
const socialMediaStore = useSocialMediaStore()

// Reactive state
const activeTab = ref('overview')
const dashboard = ref(null)
const posts = ref([])
const showPostComposer = ref(false)
const editingPost = ref(null)

// Filters
const postFilters = reactive({
  search: '',
  platform: '',
  status: '',
  date_from: ''
})

// Methods
const loadDashboard = async () => {
  try {
    const response = await socialMediaStore.fetchDashboard()
    dashboard.value = response
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  }
}

const loadPosts = async () => {
  try {
    const response = await socialMediaStore.fetchPosts(postFilters)
    posts.value = response
  } catch (error) {
    console.error('Failed to load posts:', error)
  }
}

const editPost = (post) => {
  editingPost.value = post
  showPostComposer.value = true
}

const viewPost = (post) => {
  // Navigate to post detail or show detail modal
  console.log('View post:', post)
}

const publishPost = async (id) => {
  if (!confirm('Are you sure you want to publish this post now?')) return
  
  try {
    await socialMediaStore.publishPost(id)
    showSuccess('Post published successfully!')
    loadPosts()
    loadDashboard()
  } catch (error) {
    console.error('Failed to publish post:', error)
    showError('Failed to publish post')
  }
}

const deletePost = async (id) => {
  if (!confirm('Are you sure you want to delete this post?')) return
  
  try {
    await socialMediaStore.deletePost(id)
    showSuccess('Post deleted successfully')
    loadPosts()
    loadDashboard()
  } catch (error) {
    console.error('Failed to delete post:', error)
    showError('Failed to delete post')
  }
}

const closePostComposer = () => {
  showPostComposer.value = false
  editingPost.value = null
}

const handlePostSaved = () => {
  loadPosts()
  loadDashboard()
}

const getPlatformIconClass = (platform) => {
  const classes = {
    facebook: 'w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600',
    twitter: 'w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600',
    instagram: 'w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600',
    linkedin: 'w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700'
  }
  return classes[platform] || 'w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600'
}

// Lifecycle
onMounted(() => {
  loadDashboard()
  loadPosts()
})
</script>