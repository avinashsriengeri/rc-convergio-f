<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <!-- Score Header -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">Lead Score</h3>
        <div class="flex items-center space-x-2">
          <button 
            @click="recalculateScore"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="isRecalculating"
          >
            <svg v-if="isRecalculating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ isRecalculating ? 'Recalculating...' : 'Recalculate' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Score Display -->
    <div class="px-6 py-5">
      <!-- Score Circle -->
      <div class="flex flex-col items-center justify-center mb-4">
        <div 
          class="relative w-32 h-32 rounded-full flex items-center justify-center mb-4"
          :class="scoreCircleClass"
        >
          <div class="absolute inset-0 rounded-full border-8 opacity-20" :class="scoreBorderClass"></div>
          <div class="text-center">
            <div class="text-3xl font-bold">{{ score || 0 }}</div>
            <div class="text-sm text-gray-500">out of 100</div>
          </div>
        </div>
        
        <div class="text-center">
          <span class="px-3 py-1 rounded-full text-sm font-medium" :class="scoreLevelClass">
            {{ scoreLevel }}
          </span>
          <p v-if="lastCalculated" class="text-xs text-gray-500 mt-1">
            Last updated {{ formatDate(lastCalculated) }}
          </p>
        </div>
      </div>

      <!-- Score Breakdown -->
      <div v-if="scoreBreakdown && scoreBreakdown.length > 0" class="mt-6">
        <h4 class="text-sm font-medium text-gray-700 mb-3">Score Breakdown</h4>
        <div class="space-y-3">
          <div v-for="(item, index) in scoreBreakdown" :key="index" class="flex items-center">
            <div class="flex-1">
              <div class="flex justify-between text-sm mb-1">
                <span class="font-medium text-gray-700">{{ item.category }}</span>
                <span class="font-medium">{{ item.points > 0 ? '+' : '' }}{{ item.points }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full" 
                  :class="getScoreRangeClass(item.points)"
                  :style="{ width: Math.min(Math.abs(item.points), 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div v-if="recentActivities && recentActivities.length > 0" class="mt-6">
        <h4 class="text-sm font-medium text-gray-700 mb-3">Recent Activities</h4>
        <div class="space-y-3">
          <div v-for="(activity, index) in recentActivities" :key="index" class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="activity.points > 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ activity.description }}</p>
              <p class="text-xs text-gray-500">
                {{ formatDate(activity.timestamp) }}
                <span class="mx-1">•</span>
                <span :class="activity.points > 0 ? 'text-green-600' : 'text-red-600'">
                  {{ activity.points > 0 ? '+' : '' }}{{ activity.points }} points
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!recentActivities || recentActivities.length === 0" class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No activities yet</h3>
        <p class="mt-1 text-sm text-gray-500">Activities will appear here when the contact interacts with your content.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { leadScoringService } from '@/services/leadScoring'

const props = defineProps({
  contactId: {
    type: [String, Number],
    required: true
  },
  contactEmail: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['score-updated'])

const score = ref(0)
const scoreLevel = ref('Neutral')
const lastCalculated = ref(null)
const scoreBreakdown = ref([])
const recentActivities = ref([])
const isLoading = ref(true)
const isRecalculating = ref(false)
const error = ref(null)

// Computed properties
const scoreCircleClass = computed(() => {
  if (!score.value) return 'bg-gray-100 text-gray-700'
  if (score.value >= 80) return 'bg-red-50 text-red-700'
  if (score.value >= 60) return 'bg-orange-50 text-orange-700'
  if (score.value >= 40) return 'bg-yellow-50 text-yellow-700'
  return 'bg-green-50 text-green-700'
})

const scoreBorderClass = computed(() => {
  if (!score.value) return 'border-gray-300'
  if (score.value >= 80) return 'border-red-300'
  if (score.value >= 60) return 'border-orange-300'
  if (score.value >= 40) return 'border-yellow-300'
  return 'border-green-300'
})

const scoreLevelClass = computed(() => {
  if (!score.value) return 'bg-gray-100 text-gray-800'
  if (score.value >= 80) return 'bg-red-100 text-red-800'
  if (score.value >= 60) return 'bg-orange-100 text-orange-800'
  if (score.value >= 40) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
})

// Methods
const loadScore = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    let response
    if (props.contactId) {
      response = await leadScoringService.getContactScoringDetails(props.contactId)
    } else if (props.contactEmail) {
      response = await leadScoringService.getContactScoreByEmail(props.contactEmail)
    } else {
      throw new Error('Either contactId or contactEmail is required')
    }
    
    updateScoreData(response)
  } catch (err) {
    console.error('Error loading score:', err)
    error.value = 'Failed to load score. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const recalculateScore = async () => {
  try {
    isRecalculating.value = true
    error.value = null
    
    let response
    if (props.contactId) {
      response = await leadScoringService.recalculateContactScore(props.contactId)
    } else if (props.contactEmail) {
      response = await leadScoringService.recalculateScoreByEmail(props.contactEmail)
    } else {
      throw new Error('Either contactId or contactEmail is required')
    }
    
    updateScoreData(response)
    emit('score-updated', response)
  } catch (err) {
    console.error('Error recalculating score:', err)
    error.value = 'Failed to recalculate score. Please try again.'
  } finally {
    isRecalculating.value = false
  }
}

const updateScoreData = (data) => {
  score.value = data.score || 0
  scoreLevel.value = getScoreLevel(data.score)
  lastCalculated.value = data.last_calculated || data.updated_at
  scoreBreakdown.value = data.score_breakdown || []
  recentActivities.value = data.recent_activities || []
}

const getScoreLevel = (score) => {
  if (!score && score !== 0) return 'N/A'
  if (score >= 80) return 'Hot Lead'
  if (score >= 60) return 'Warm Lead'
  if (score >= 40) return 'Engaged'
  if (score > 0) return 'New Lead'
  return 'Neutral'
}

const getScoreRangeClass = (points) => {
  if (points > 0) {
    if (points >= 20) return 'bg-green-500'
    if (points >= 10) return 'bg-blue-500'
    return 'bg-green-300'
  } else {
    if (points <= -20) return 'bg-red-500'
    if (points <= -10) return 'bg-orange-500'
    return 'bg-red-300'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle hooks
onMounted(() => {
  loadScore()
})

// Watch for prop changes
const propsRef = { ...props }
watch(() => [propsRef.contactId, propsRef.contactEmail], () => {
  loadScore()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
