<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="$emit('close')"
  >
    <div
      class="relative top-10 mx-auto p-8 border w-full max-w-4xl shadow-xl rounded-xl bg-white mb-10"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Performance Review: {{ review?.employee?.full_name || 'N/A' }}</h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ review?.employee?.job_title || '' }} • {{ review?.review_period_value || '' }} Assessment
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
      
      <div v-if="!review || !review.template" class="text-center py-12">
        <p class="text-gray-600">Loading review details...</p>
      </div>
      
      <form v-else @submit.prevent="handleSubmit">
        <div class="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          <div
            v-for="(templateItem, index) in review.template.items"
            :key="templateItem.id"
            class="p-5 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div class="mb-4">
              <h4 class="text-lg font-semibold text-gray-900">{{ index + 1 }}. {{ templateItem.name }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ templateItem.description }}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-6 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Employee Score</label>
                <div class="text-2xl font-bold text-blue-600">
                  {{ getEmployeeScore(templateItem.id) }}/10
                </div>
                <p v-if="getEmployeeComments(templateItem.id)" class="text-xs text-gray-500 mt-1 italic">
                  "{{ getEmployeeComments(templateItem.id) }}"
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Manager Score</label>
                <KpiScoreSlider
                  v-model="managerScores[templateItem.id]"
                  :label="`Score (Weight: ${templateItem.weight}%)`"
                />
                <textarea
                  v-model="managerComments[templateItem.id]"
                  rows="2"
                  placeholder="Add your comments..."
                  class="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent text-sm"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Manager Remarks -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Manager Remarks</label>
          <textarea
            v-model="formData.comments"
            rows="4"
            placeholder="Add overall comments about this employee's performance..."
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          ></textarea>
        </div>
        
        <div class="flex justify-end gap-3 mt-8">
          <button
            type="button"
            @click="saveDraft"
            :disabled="submitting"
            class="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {{ submitting ? 'Submitting...' : 'Submit Review' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useManagerKpiReviewsStore } from '../store/managerKpiReviews'
import { success as showSuccess, error as showError } from '@/utils/notifications'
import KpiScoreSlider from './KpiScoreSlider.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  review: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const reviewsStore = useManagerKpiReviewsStore()

const submitting = ref(false)
const managerScores = ref({})
const managerComments = ref({})
const formData = ref({
  comments: ''
})

const getEmployeeScore = (templateItemId) => {
  if (!props.review?.self_review?.items) return '-'
  const item = props.review.self_review.items.find(i => i.kpi_template_item_id === templateItemId)
  return item ? parseFloat(item.score).toFixed(1) : '-'
}

const getEmployeeComments = (templateItemId) => {
  if (!props.review?.self_review?.items) return ''
  const item = props.review.self_review.items.find(i => i.kpi_template_item_id === templateItemId)
  return item?.comments || ''
}

const initializeScores = () => {
  if (!props.review?.template?.items) return
  
  props.review.template.items.forEach(item => {
    // Initialize with employee's score if available, otherwise 0
    const employeeScore = getEmployeeScore(item.id)
    managerScores.value[item.id] = employeeScore !== '-' ? parseFloat(employeeScore) : 0
    managerComments.value[item.id] = ''
  })
  
  // Load existing manager review if available
  if (props.review?.manager_review) {
    formData.value.comments = props.review.manager_review.comments || ''
    if (props.review.manager_review.items) {
      props.review.manager_review.items.forEach(item => {
        managerScores.value[item.kpi_template_item_id] = parseFloat(item.score)
        managerComments.value[item.kpi_template_item_id] = item.comments || ''
      })
    }
  }
}

watch(() => props.review, (newReview) => {
  if (newReview) {
    initializeScores()
  } else {
    managerScores.value = {}
    managerComments.value = {}
    formData.value.comments = ''
  }
}, { immediate: true })

watch(() => props.show, (newVal) => {
  if (newVal && props.review) {
    initializeScores()
  }
})

const saveDraft = async () => {
  // Draft functionality can be implemented later
  showSuccess('Draft saved (feature coming soon)')
}

const handleSubmit = async () => {
  if (!props.review) return

  submitting.value = true

  try {
    const items = props.review.template.items.map(templateItem => ({
      kpi_template_item_id: templateItem.id,
      score: managerScores.value[templateItem.id] || 0,
      comments: managerComments.value[templateItem.id] || ''
    }))

    const reviewData = {
      items,
      comments: formData.value.comments
    }

    await reviewsStore.submitManagerReview(props.review.id, reviewData)
    showSuccess('Manager review submitted successfully')
    emit('save')
  } catch (err) {
    showError(err.response?.data?.message || err.message || 'Failed to submit review')
  } finally {
    submitting.value = false
  }
}
</script>

