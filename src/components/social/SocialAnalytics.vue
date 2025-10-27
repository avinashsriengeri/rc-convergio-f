    <template>
  <div class="space-y-6">
    <!-- Analytics Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Social Media Analytics</h3>
          <p class="text-sm text-gray-600 mt-1">Track your social media performance across platforms</p>
        </div>
        <div class="flex items-center space-x-3">
          <select
            v-model="selectedPeriod"
            @change="loadAnalytics"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            @click="loadAnalytics"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Summary Stats -->
      <div v-if="analytics" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <div class="text-3xl font-bold text-blue-600">{{ analytics.summary.total_posts }}</div>
          <div class="text-sm text-gray-600 mt-1">Total Posts</div>
          <div class="text-xs text-green-600 mt-1">↑ 12% vs last period</div>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <div class="text-3xl font-bold text-green-600">{{ analytics.summary.published_posts }}</div>
          <div class="text-sm text-gray-600 mt-1">Published</div>
          <div class="text-xs text-green-600 mt-1">↑ 8% vs last period</div>
        </div>
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <div class="text-3xl font-bold text-purple-600">{{ analytics.summary.scheduled_posts }}</div>
          <div class="text-sm text-gray-600 mt-1">Scheduled</div>
          <div class="text-xs text-gray-600 mt-1">Ready to publish</div>
        </div>
        <div class="text-center p-4 bg-amber-50 rounded-lg">
          <div class="text-3xl font-bold text-amber-600">{{ analytics.summary.engagement_rate }}%</div>
          <div class="text-sm text-gray-600 mt-1">Engagement Rate</div>
          <div class="text-xs text-green-600 mt-1">↑ 15% vs last period</div>
        </div>
      </div>
    </div>

    <!-- Platform Performance -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
      <div v-if="analytics && analytics.platform_stats" class="space-y-4">
        <div
          v-for="(stats, platform) in analytics.platform_stats"
          :key="platform"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div :class="getPlatformIconClass(platform)">
                <i :class="getPlatformIcon(platform)"></i>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 capitalize">{{ platform }}</h4>
                <p class="text-sm text-gray-500">{{ stats.total_posts }} posts</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">{{ formatNumber(stats.total_engagement) }}</div>
              <div class="text-sm text-gray-500">Total Engagement</div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mt-3">
            <div class="flex justify-between text-xs text-gray-600 mb-1">
              <span>Engagement Rate</span>
              <span>{{ calculateEngagementRate(stats) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                :class="getPlatformColorClass(platform)"
                class="h-2 rounded-full transition-all duration-500"
                :style="{ width: calculateEngagementRate(stats) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Metrics Grid -->
          <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div class="text-center">
              <div class="text-lg font-semibold text-gray-900">{{ stats.published }}</div>
              <div class="text-xs text-gray-500">Published</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-semibold text-gray-900">{{ formatNumber(stats.total_engagement / stats.published || 0) }}</div>
              <div class="text-xs text-gray-500">Avg Engagement</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-semibold text-gray-900">{{ Math.round(stats.total_engagement / stats.total_posts) }}</div>
              <div class="text-xs text-gray-500">Per Post</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="mt-2">No analytics data available</p>
      </div>
    </div>

    <!-- Engagement Chart -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Engagement Over Time</h3>
      <div class="h-64">
        <canvas ref="engagementChart"></canvas>
      </div>
    </div>

    <!-- Top Performing Posts -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h3>
      <div v-if="analytics && analytics.recent_posts" class="space-y-3">
        <div
          v-for="post in analytics.recent_posts"
          :key="post.id"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center space-x-3 flex-1">
            <div :class="getPlatformIconClass(post.platform)">
              <i :class="getPlatformIcon(post.platform)"></i>
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">{{ post.title }}</h4>
              <p class="text-sm text-gray-500 capitalize">{{ post.platform }} • {{ post.status }}</p>
            </div>
          </div>
          <div v-if="post.engagement_metrics" class="flex items-center space-x-6 text-sm">
            <div class="text-center">
              <div class="font-semibold text-gray-900">{{ formatNumber(post.engagement_metrics.likes || 0) }}</div>
              <div class="text-gray-500">Likes</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-gray-900">{{ formatNumber(post.engagement_metrics.shares || 0) }}</div>
              <div class="text-gray-500">Shares</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-gray-900">{{ formatNumber(post.engagement_metrics.comments || 0) }}</div>
              <div class="text-gray-500">Comments</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        <p>No posts available</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { socialMediaService } from '@/services/socialMedia'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// State
const analytics = ref<any>(null)
const selectedPeriod = ref('30d')
const engagementChart = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// Methods
const loadAnalytics = async () => {
  try {
    const response = await socialMediaService.getAnalytics({
      date_from: getDateFrom(selectedPeriod.value),
      date_to: new Date().toISOString()
    })
    analytics.value = response.data
    
    // Update chart after data loads
    await nextTick()
    initializeChart()
  } catch (error) {
    console.error('Failed to load analytics:', error)
  }
}

const getDateFrom = (period: string): string => {
  const now = new Date()
  switch (period) {
    case '7d':
      now.setDate(now.getDate() - 7)
      break
    case '30d':
      now.setDate(now.getDate() - 30)
      break
    case '90d':
      now.setDate(now.getDate() - 90)
      break
    case '1y':
      now.setFullYear(now.getFullYear() - 1)
      break
  }
  return now.toISOString()
}

const initializeChart = () => {
  if (!engagementChart.value) return

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = engagementChart.value.getContext('2d')
  if (!ctx) return

  // Generate sample data
  const labels = generateDateLabels(selectedPeriod.value)
  const data = generateSampleData(labels.length)

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Likes',
          data: data.likes,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'Comments',
          data: data.comments,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        },
        {
          label: 'Shares',
          data: data.shares,
          borderColor: 'rgb(251, 146, 60)',
          backgroundColor: 'rgba(251, 146, 60, 0.1)',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
}

const generateDateLabels = (period: string): string[] => {
  const labels: string[] = []
  const count = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 12 : 12
  const now = new Date()

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now)
    if (period === '7d' || period === '30d') {
      date.setDate(date.getDate() - i)
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    } else {
      date.setMonth(date.getMonth() - i)
      labels.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }))
    }
  }

  return labels
}

const generateSampleData = (count: number) => {
  return {
    likes: Array.from({ length: count }, () => Math.floor(Math.random() * 100) + 20),
    comments: Array.from({ length: count }, () => Math.floor(Math.random() * 50) + 10),
    shares: Array.from({ length: count }, () => Math.floor(Math.random() * 30) + 5)
  }
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return Math.round(num).toString()
}

const calculateEngagementRate = (stats: any): number => {
  if (!stats.published || stats.published === 0) return 0
  return Math.min(Math.round((stats.total_engagement / (stats.published * 100)) * 100), 100)
}

const getPlatformIcon = (platform: string): string => {
  const icons: Record<string, string> = {
    facebook: 'fab fa-facebook text-xl',
    twitter: 'fab fa-twitter text-xl',
    instagram: 'fab fa-instagram text-xl',
    linkedin: 'fab fa-linkedin text-xl'
  }
  return icons[platform] || 'fas fa-share-alt text-xl'
}

const getPlatformIconClass = (platform: string): string => {
  const classes: Record<string, string> = {
    facebook: 'w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600',
    twitter: 'w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600',
    instagram: 'w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600',
    linkedin: 'w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700'
  }
  return classes[platform] || 'w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600'
}

const getPlatformColorClass = (platform: string): string => {
  const colors: Record<string, string> = {
    facebook: 'bg-blue-600',
    twitter: 'bg-sky-600',
    instagram: 'bg-pink-600',
    linkedin: 'bg-blue-700'
  }
  return colors[platform] || 'bg-gray-600'
}

// Lifecycle
onMounted(() => {
  loadAnalytics()
})
</script>
    