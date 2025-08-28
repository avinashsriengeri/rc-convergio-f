<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Move to Stage</h3>
          <button
            @click="$emit('cancel')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="mb-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Stage
            </label>
            <select
              v-model="selectedStageId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :disabled="loading"
            >
              <option value="">Select a stage...</option>
              <option
                v-for="stage in stages"
                :key="stage.id"
                :value="stage.id"
                :disabled="stage.id === currentStageId"
              >
                <div class="flex items-center">
                  <div
                    class="w-3 h-3 rounded-full mr-2"
                    :style="{ backgroundColor: stage.color || '#6B7280' }"
                  ></div>
                  {{ stage.name }}
                  <span v-if="stage.id === currentStageId" class="text-gray-400 ml-2">(Current)</span>
                </div>
              </option>
            </select>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3">
          <BaseButton
            type="button"
            variant="outline"
            @click="$emit('cancel')"
            :disabled="loading"
          >
            Cancel
          </BaseButton>
          <BaseButton
            type="button"
            variant="primary"
            @click="confirmMove"
            :loading="loading"
            :disabled="!selectedStageId || selectedStageId === currentStageId"
          >
            Move Deal
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { stagesAPI, dealsAPI } from '../../services/api'
import { success, error as showError } from '../../utils/notifications'
import BaseButton from '../ui/BaseButton.vue'

interface Props {
  dealId: number
  currentStageId: number
  pipelineId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  confirm: [stageId: number]
  cancel: []
}>()

// Reactive data
const loading = ref(false)
const stages = ref<any[]>([])
const selectedStageId = ref<number | ''>('')

// Methods
const loadStages = async () => {
  loading.value = true
  try {
    const response = await stagesAPI.getStagesByPipeline(props.pipelineId)
    stages.value = response.data.data || []
  } catch (err: any) {
    console.error('Error loading stages:', err)
    showError('Failed to load stages')
  } finally {
    loading.value = false
  }
}

const confirmMove = async () => {
  if (!selectedStageId.value || selectedStageId.value === props.currentStageId) {
    return
  }

  loading.value = true
  try {
    await dealsAPI.moveDeal(props.dealId, selectedStageId.value)
    success('Deal moved successfully')
    emit('confirm', selectedStageId.value)
  } catch (err: any) {
    console.error('Error moving deal:', err)
    showError(err.response?.data?.message || 'Failed to move deal')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadStages()
})
</script>

<script lang="ts">
export default {
  name: 'MoveStageModal'
}
</script>
