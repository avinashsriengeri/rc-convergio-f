<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="$emit('close')"
  >
    <div
      class="relative top-10 mx-auto p-8 border w-full max-w-3xl shadow-xl rounded-xl bg-white mb-10"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">SELF REVIEW - {{ currentItem?.name || 'KPI Review' }}</h3>
          <p v-if="assignment?.template" class="text-sm text-gray-600 mt-1">
            {{ assignment.template.name }} • {{ assignment.review_period_value }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-500 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div v-if="!assignment || !assignment.template" class="text-center py-12">
        <p class="text-gray-600">Loading assignment details...</p>
      </div>
      
      <form v-else @submit.prevent="handleSubmit">
        <!-- Progress Indicator -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">
              Item {{ currentIndex + 1 }} of {{ assignment.template.items.length }}
            </span>
            <span class="text-sm text-gray-500">{{ Math.round(((currentIndex + 1) / assignment.template.items.length) * 100) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary-purple h-2 rounded-full transition-all duration-300"
              :style="{ width: `${((currentIndex + 1) / assignment.template.items.length) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Current KPI Item -->
        <div v-if="currentItem" class="space-y-6 mb-8">
          <div class="p-5 bg-gray-50 rounded-lg border border-gray-200">
            <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ currentItem.name }}</h4>
            <p class="text-sm text-gray-600">{{ currentItem.description }}</p>
            <p class="text-xs text-gray-500 mt-2">Weight: {{ currentItem.weight }}%</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">Your Rating</label>
            <KpiScoreSlider
              v-model="reviewItems[currentItem.id].score"
              label="Score"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">My Comments</label>
            <textarea
              v-model="reviewItems[currentItem.id].comments"
              rows="4"
              placeholder="Add your comments about this KPI..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            ></textarea>
          </div>
        </div>

        <!-- Overall Comments (shown on last item) -->
        <div v-if="currentIndex === assignment.template.items.length - 1" class="mb-8 pt-6 border-t border-gray-200">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Overall Comments</label>
          <textarea
            v-model="formData.comments"
            rows="4"
            placeholder="Add overall comments about your performance..."
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          ></textarea>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between gap-3">
          <button
            type="button"
            @click="previousItem"
            :disabled="currentIndex === 0"
            class="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div class="flex gap-3">
            <button
              type="button"
              @click="saveDraft"
              :disabled="submitting"
              class="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              v-if="currentIndex < assignment.template.items.length - 1"
              type="button"
              @click="nextItem"
              class="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md"
            >
              Next
            </button>
            <button
              v-else
              type="submit"
              :disabled="submitting"
              class="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {{ submitting ? 'Submitting...' : 'Submit Review' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useEmployeeKpiStore } from '../store/employeeKpi'
import { success as showSuccess, error as showError } from '@/utils/notifications'
import KpiScoreSlider from './KpiScoreSlider.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  assignment: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const employeeKpiStore = useEmployeeKpiStore()

const currentIndex = ref(0)
const submitting = ref(false)
const reviewItems = ref({})
const formData = ref({
  comments: ''
})

const currentItem = computed(() => {
  if (!props.assignment?.template?.items) return null
  return props.assignment.template.items[currentIndex.value]
})

const initializeReviewItems = () => {
  if (!props.assignment?.template?.items) return
  
  props.assignment.template.items.forEach(item => {
    reviewItems.value[item.id] = {
      kpi_template_item_id: item.id,
      score: 0,
      comments: ''
    }
  })
  
  // Load existing self review if available
  if (props.assignment?.self_review) {
    formData.value.comments = props.assignment.self_review.comments || ''
    if (props.assignment.self_review.items) {
      props.assignment.self_review.items.forEach(item => {
        if (reviewItems.value[item.kpi_template_item_id]) {
          reviewItems.value[item.kpi_template_item_id].score = parseFloat(item.score)
          reviewItems.value[item.kpi_template_item_id].comments = item.comments || ''
        }
      })
    }
  }
}

watch(() => props.assignment, (newAssignment) => {
  if (newAssignment) {
    currentIndex.value = 0
    initializeReviewItems()
  } else {
    reviewItems.value = {}
    formData.value.comments = ''
  }
}, { immediate: true })

watch(() => props.show, (newVal) => {
  if (newVal && props.assignment) {
    currentIndex.value = 0
    initializeReviewItems()
  }
})

const previousItem = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextItem = () => {
  if (props.assignment?.template?.items && currentIndex.value < props.assignment.template.items.length - 1) {
    currentIndex.value++
  }
}

const saveDraft = () => {
  // Draft functionality can be implemented later
  showSuccess('Draft saved (feature coming soon)')
}

const handleSubmit = async () => {
  if (!props.assignment) return

  submitting.value = true

  try {
    const items = Object.values(reviewItems.value).map(item => ({
      kpi_template_item_id: item.kpi_template_item_id,
      score: item.score,
      comments: item.comments
    }))

    const reviewData = {
      items,
      comments: formData.value.comments
    }

    await employeeKpiStore.submitSelfReview(props.assignment.id, reviewData)
    showSuccess('Self review submitted successfully')
    emit('save')
  } catch (err) {
    showError(err.response?.data?.message || err.message || 'Failed to submit self review')
  } finally {
    submitting.value = false
  }
}
</script>

