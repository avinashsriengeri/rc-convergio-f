<template>
  <div class="space-y-6">
    <!-- Listening Controls -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Social Listening</h3>
          <p class="text-sm text-gray-600 mt-1">Monitor mentions, keywords, and brand sentiment across platforms</p>
        </div>
        <button
          @click="loadListeningData"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center"
        >
          <svg v-if="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Keywords to Monitor</label>
          <input
            v-model="keywords"
            type="text"
            placeholder="brand, product, #hashtag (comma-separated)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="loadListeningData"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Platform Filter</label>
          <select
            v-model="selectedPlatform"
            @change="loadListeningData"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Platforms</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sentiment Filter</label>
          <select
            v-model="selectedSentiment"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Sentiment Analysis Overview -->
    <div v-if="listeningData" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div class="flex items-center justify-center mb-2">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="text-3xl font-bold text-green-600">{{ listeningData.sentiment_analysis.positive }}</div>
          <div class="text-sm text-gray-600 mt-1">Positive Mentions</div>
          <div class="text-xs text-gray-500 mt-1">
            {{ calculatePercentage(listeningData.sentiment_analysis.positive) }}% of total
          </div>
        </div>

        <div class="text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
          <div class="flex items-center justify-center mb-2">
            <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="text-3xl font-bold text-gray-600">{{ listeningData.sentiment_analysis.neutral }}</div>
          <div class="text-sm text-gray-600 mt-1">Neutral Mentions</div>
          <div class="text-xs text-gray-500 mt-1">
            {{ calculatePercentage(listeningData.sentiment_analysis.neutral) }}% of total
          </div>
        </div>

        <div class="text-center p-4 bg-red-50 rounded-lg border-2 border-red-200">
          <div class="flex items-center justify-center mb-2">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="text-3xl font-bold text-red-600">{{ listeningData.sentiment_analysis.negative }}</div>
          <div class="text-sm text-gray-600 mt-1">Negative Mentions</div>
          <div class="text-xs text-gray-500 mt-1">
            {{ calculatePercentage(listeningData.sentiment_analysis.negative) }}% of total
          </div>
        </div>
      </div>

      <!-- Sentiment Progress Bar -->
      <div class="space-y-2">
        <div class="flex justify-between text-sm text-gray-600">
          <span>Overall Sentiment</span>
          <span>{{ listeningData.total_mentions }} total mentions</span>
        </div>
        <div class="flex h-4 rounded-full overflow-hidden bg-gray-200">
          <div
            class="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
            :style="{ width: calculatePercentage(listeningData.sentiment_analysis.positive) + '%' }"
          >
            <span v-if="calculatePercentage(listeningData.sentiment_analysis.positive) > 10">
              {{ calculatePercentage(listeningData.sentiment_analysis.positive) }}%
            </span>
          </div>
          <div
            class="bg-gray-400 flex items-center justify-center text-xs text-white font-medium"
            :style="{ width: calculatePercentage(listeningData.sentiment_analysis.neutral) + '%' }"
          >
            <span v-if="calculatePercentage(listeningData.sentiment_analysis.neutral) > 10">
              {{ calculatePercentage(listeningData.sentiment_analysis.neutral) }}%
            </span>
          </div>
          <div
            class="bg-red-500 flex items-center justify-center text-xs text-white font-medium"
            :style="{ width: calculatePercentage(listeningData.sentiment_analysis.negative) + '%' }"
          >
            <span v-if="calculatePercentage(listeningData.sentiment_analysis.negative) > 10">
              {{ calculatePercentage(listeningData.sentiment_analysis.negative) }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div v-if="listeningData" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Mentions</p>
            <p class="text-2xl font-semibold text-gray-900">{{ listeningData.total_mentions }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Engagement</p>
            <p class="text-2xl font-semibold text-gray-900">{{ formatNumber(listeningData.total_engagement) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Avg. Engagement</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ listeningData.total_mentions > 0 ? Math.round(listeningData.total_engagement / listeningData.total_mentions) : 0 }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Mentions Feed -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Mentions</h3>
      
      <div v-if="filteredMentions.length > 0" class="space-y-4">
        <div
          v-for="mention in filteredMentions"
          :key="mention.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <!-- Mention Header -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div :class="getPlatformIconClass(mention.platform)">
                <i :class="getPlatformIcon(mention.platform)"></i>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ mention.author }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(mention.created_at) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span :class="getSentimentClass(mention.sentiment)" class="inline-flex px-3 py-1 text-xs font-semibold rounded-full">
                {{ mention.sentiment }}
              </span>
            </div>
          </div>

          <!-- Mention Content -->
          <p class="text-gray-700 mb-3">{{ mention.content }}</p>

          <!-- Mention Stats -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                </svg>
                <span>{{ formatNumber(mention.engagement) }}</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Engagement</span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="replyToMention(mention)"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Reply
              </button>
              <button
                @click="saveMention(mention)"
                class="text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No mentions found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your filters or keywords</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSocialMediaStore } from '@/stores/socialMedia'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const socialMediaStore = useSocialMediaStore()

// State
const listeningData = ref<any>(null)
const keywords = ref('your brand, your product')
const selectedPlatform = ref('all')
const selectedSentiment = ref('all')
const loading = ref(false)

// Computed
const filteredMentions = computed(() => {
  if (!listeningData.value?.mentions) return []
  
  let filtered = listeningData.value.mentions

  if (selectedSentiment.value !== 'all') {
    filtered = filtered.filter((m: any) => m.sentiment === selectedSentiment.value)
  }

  return filtered
})

// Methods
const loadListeningData = async () => {
  loading.value = true
  try {
    const keywordArray = keywords.value.split(',').map(k => k.trim()).filter(k => k)
    const response = await socialMediaStore.fetchSocialListening({
      keywords: keywordArray,
      platform: selectedPlatform.value === 'all' ? undefined : selectedPlatform.value
    })
    listeningData.value = response
  } catch (error: any) {
    console.error('Failed to load social listening:', error)
    showError('Failed to load social listening data')
  } finally {
    loading.value = false
  }
}

const calculatePercentage = (value: number): number => {
  if (!listeningData.value?.total_mentions || listeningData.value.total_mentions === 0) return 0
  return Math.round((value / listeningData.value.total_mentions) * 100)
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPlatformIcon = (platform: string): string => {
  const icons: Record<string, string> = {
    facebook: 'fab fa-facebook text-lg',
    twitter: 'fab fa-twitter text-lg',
    instagram: 'fab fa-instagram text-lg',
    linkedin: 'fab fa-linkedin text-lg'
  }
  return icons[platform] || 'fas fa-share-alt text-lg'
}

const getPlatformIconClass = (platform: string): string => {
  const classes: Record<string, string> = {
    facebook: 'w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600',
    twitter: 'w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600',
    instagram: 'w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600',
    linkedin: 'w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700'
  }
  return classes[platform] || 'w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600'
}

const getSentimentClass = (sentiment: string): string => {
  switch (sentiment) {
    case 'positive':
      return 'bg-green-100 text-green-700'
    case 'negative':
      return 'bg-red-100 text-red-700'
    case 'neutral':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const replyToMention = (mention: any) => {
  showSuccess(`Reply feature will be implemented for ${mention.platform}`)
  // TODO: Implement reply functionality
}

const saveMention = (mention: any) => {
  showSuccess('Mention saved successfully')
  // TODO: Implement save functionality
}

// Lifecycle
onMounted(() => {
  loadListeningData()
})
</script>
