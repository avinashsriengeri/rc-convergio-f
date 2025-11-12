<template>
  <div class="copilot-dashboard">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Maxi Copilot</h1>
          <p class="text-gray-600 mt-1">Your AI assistant for RC Convergio</p>
        </div>
        <div class="flex items-center space-x-4">
          <button
            @click="refreshStats"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="p-6 space-y-6">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Conversations</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total_conversations || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Your Conversations</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.user_conversations || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Popular Features</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.popular_features?.length || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Recent Activity</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.recent_activity?.length || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Quick Actions -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <button
                v-for="action in quickActions"
                :key="action.id"
                @click="handleQuickAction(action)"
                class="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors"
              >
                <div class="flex items-center">
                  <div class="p-2 bg-blue-100 rounded-lg mr-3">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ action.title }}</p>
                    <p class="text-sm text-gray-600">{{ action.description }}</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Conversations -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Recent Conversations</h3>
              <button
                @click="viewAllConversations"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            
            <div v-if="conversationHistory.length === 0" class="text-center py-8">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p class="text-gray-500">No conversations yet</p>
              <p class="text-sm text-gray-400">Start chatting with Copilot to see your history here</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="conversation in conversationHistory.slice(0, 5)"
                :key="conversation.id"
                class="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                @click="viewConversation(conversation)"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ conversation.query }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ formatTime(conversation.timestamp) }}</p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span
                      class="px-2 py-1 text-xs rounded-full"
                      :class="conversation.confidence > 0.8 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    >
                      {{ Math.round(conversation.confidence * 100) }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Features -->
      <div v-if="stats.popular_features?.length > 0" class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Popular Features</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="feature in stats.popular_features"
            :key="feature.name"
            class="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
            @click="exploreFeature(feature)"
          >
            <div class="flex items-center mb-2">
              <div class="p-2 bg-blue-100 rounded-lg mr-3">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 class="font-medium text-gray-900">{{ feature.name }}</h4>
            </div>
            <p class="text-sm text-gray-600">{{ feature.description }}</p>
            <div class="mt-2 flex items-center text-xs text-gray-500">
              <span>{{ feature.usage_count }} uses</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div v-if="stats.recent_activity?.length > 0" class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div class="space-y-3">
          <div
            v-for="activity in stats.recent_activity.slice(0, 10)"
            :key="activity.id"
            class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ activity.action }}</p>
              <p class="text-xs text-gray-500">{{ formatTime(activity.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCopilotStore } from '@/stores/copilotStore'
import { useCopilotService } from '@/services/copilotService'

const router = useRouter()
const copilotStore = useCopilotStore()
const copilotService = useCopilotService()

// Reactive state
const loading = ref(false)

// Computed properties
const stats = computed(() => copilotStore.stats)
const conversationHistory = computed(() => copilotStore.conversationHistory)

// Quick actions
const quickActions = ref([
  {
    id: 1,
    title: 'Start New Chat',
    description: 'Open the Copilot chat window',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    action: 'open_chat'
  },
  {
    id: 2,
    title: 'Get Help',
    description: 'Browse help articles and guides',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    action: 'browse_help'
  },
  {
    id: 3,
    title: 'Explore Features',
    description: 'Discover available features',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    action: 'explore_features'
  },
  {
    id: 4,
    title: 'View Analytics',
    description: 'See usage statistics and insights',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    action: 'view_analytics'
  }
])

// Methods
const refreshStats = async () => {
  loading.value = true
  try {
    await copilotStore.loadStats()
  } catch (error) {
    console.error('Failed to refresh stats:', error)
  } finally {
    loading.value = false
  }
}

const handleQuickAction = (action) => {
  switch (action.action) {
    case 'open_chat':
      copilotStore.toggleChat()
      break
    case 'browse_help':
      router.push('/copilot/help')
      break
    case 'explore_features':
      router.push('/copilot/features')
      break
    case 'view_analytics':
      router.push('/copilot/analytics')
      break
  }
}

const viewAllConversations = () => {
  router.push('/copilot/history')
}

const viewConversation = (conversation) => {
  router.push(`/copilot/history/${conversation.id}`)
}

const exploreFeature = (feature) => {
  router.push(`/copilot/features/${feature.id}`)
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

// Initialize
onMounted(async () => {
  await copilotStore.initialize()
})
</script>

<style scoped>
.copilot-dashboard {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>

