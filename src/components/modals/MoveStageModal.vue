<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ targetStageId ? `Move Deal to ${getStageName(targetStageId)}` : 'Move to Stage' }}
          </h3>
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
          <!-- Current Stage Info (for drag-drop) -->
          <div v-if="showCurrentStage && currentStage" class="mb-4 p-3 bg-gray-50 rounded-md">
            <p class="text-xs text-gray-500 mb-1">Currently in:</p>
            <div class="flex items-center">
              <div
                class="w-3 h-3 rounded-full mr-2"
                :style="{ backgroundColor: currentStage.color || '#6B7280' }"
              ></div>
              <span class="text-sm font-medium text-gray-900">{{ currentStage.name }}</span>
            </div>
            <p v-if="targetStageId" class="text-xs text-gray-500 mt-2 mb-1">Moving to:</p>
            <div v-if="targetStageId" class="flex items-center">
              <div
                class="w-3 h-3 rounded-full mr-2"
                :style="{ backgroundColor: getTargetStageColor() || '#6B7280' }"
              ></div>
              <span class="text-sm font-medium text-gray-900">{{ getStageName(targetStageId) }}</span>
            </div>
          </div>

          <!-- Stage Selection -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Stage
            </label>
            <select
              v-model="selectedStageId"
              class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="reasonError ? 'border-red-300' : 'border-gray-300'"
              :disabled="loading || (targetStageId !== undefined && targetStageId !== null)"
            >
              <option value="">Select a stage...</option>
              <option
                v-for="stage in stages"
                :key="stage.id"
                :value="stage.id"
                :disabled="stage.id === currentStageId"
              >
                {{ stage.name }}
                <span v-if="stage.id === currentStageId">(Current)</span>
              </option>
            </select>
          </div>

          <!-- Reason Field -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Reason for Moving <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="reason"
              rows="4"
              class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
              :class="reasonError ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300 text-gray-900 placeholder-gray-400'"
              placeholder="Enter reason for moving this deal... (e.g., Customer approved budget and timeline)"
              :disabled="loading"
              @input="validateReason"
              @blur="validateReason"
            ></textarea>
            <!-- Character Counter -->
            <div class="flex justify-between items-center mt-1">
              <p v-if="reasonError" class="text-xs text-red-600">{{ reasonError }}</p>
              <p v-else class="text-xs text-gray-400"></p>
              <p 
                class="text-xs"
                :class="getCharacterCountColor()"
              >
                {{ reason.length }} / 1000
              </p>
            </div>
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
            :disabled="!isValid"
          >
            Move Deal
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { stagesAPI, dealsAPI } from '../../services/api'
import { success, error as showError } from '../../utils/notifications'
import BaseButton from '../ui/BaseButton.vue'

interface Props {
  dealId: number
  currentStageId: number
  pipelineId: number
  targetStageId?: number // For drag-drop: pre-select this stage
  showCurrentStage?: boolean // Show current stage info
}

const props = withDefaults(defineProps<Props>(), {
  targetStageId: undefined,
  showCurrentStage: false
})

const emit = defineEmits<{
  confirm: [stageId: number, reason: string]
  cancel: []
}>()

// Reactive data
const loading = ref(false)
const stages = ref<any[]>([])
const selectedStageId = ref<number | ''>('')
const reason = ref('')
const reasonError = ref('')

// Computed
const currentStage = computed(() => {
  return stages.value.find(s => s.id === props.currentStageId)
})

const isValid = computed(() => {
  const stageValid = selectedStageId.value && selectedStageId.value !== props.currentStageId
  const reasonValid = reason.value.trim().length >= 3 && reason.value.trim().length <= 1000
  return stageValid && reasonValid && !reasonError.value
})

// Methods
const loadStages = async () => {
  loading.value = true
  try {
    const response = await stagesAPI.getStagesByPipeline(props.pipelineId)
    stages.value = response.data.data || []
    
    // If targetStageId is provided (drag-drop), pre-select it
    if (props.targetStageId !== undefined && props.targetStageId !== null) {
      selectedStageId.value = props.targetStageId
    }
  } catch (err: any) {
    console.error('Error loading stages:', err)
    showError('Failed to load stages')
  } finally {
    loading.value = false
  }
}

const getStageName = (stageId: number): string => {
  const stage = stages.value.find(s => s.id === stageId)
  return stage?.name || 'Unknown Stage'
}

const getTargetStageColor = (): string => {
  if (props.targetStageId === undefined || props.targetStageId === null) return ''
  const stage = stages.value.find(s => s.id === props.targetStageId)
  return stage?.color || '#6B7280'
}

const validateReason = () => {
  reasonError.value = ''
  const trimmedReason = reason.value.trim()
  
  if (!trimmedReason) {
    reasonError.value = 'Reason is required'
    return false
  }
  
  if (trimmedReason.length < 3) {
    reasonError.value = 'Reason must be at least 3 characters'
    return false
  }
  
  if (trimmedReason.length > 1000) {
    reasonError.value = 'Reason may not be greater than 1000 characters'
    return false
  }
  
  return true
}

const getCharacterCountColor = (): string => {
  const length = reason.value.length
  if (length > 1000) return 'text-red-600'
  if (length >= 900) return 'text-orange-600'
  return 'text-gray-500'
}

const confirmMove = async () => {
  // Validate before submitting
  if (!validateReason()) {
    return
  }
  
  if (!selectedStageId.value || selectedStageId.value === props.currentStageId) {
    return
  }

  loading.value = true
  reasonError.value = ''
  
  try {
    const response = await dealsAPI.moveDeal(props.dealId, selectedStageId.value as number, reason.value.trim())
    
    // Get stage names for success message
    const fromStage = stages.value.find(s => s.id === props.currentStageId)
    const toStage = stages.value.find(s => s.id === selectedStageId.value)
    const fromName = fromStage?.name || 'Unknown'
    const toName = toStage?.name || 'Unknown'
    
    success(`Deal moved from "${fromName}" to "${toName}"`)
    emit('confirm', selectedStageId.value as number, reason.value.trim())
  } catch (err: any) {
    console.error('Error moving deal:', err)
    
    // Handle validation errors (422) - keep modal open
    if (err.response?.status === 422) {
      const errors = err.response?.data?.errors || {}
      if (errors.reason) {
        reasonError.value = Array.isArray(errors.reason) ? errors.reason[0] : errors.reason
      } else {
        reasonError.value = err.response?.data?.message || 'Validation failed'
      }
      // Don't close modal, show error inline
    } else {
      // Other errors - close modal and show toast
      showError(err.response?.data?.message || 'Failed to move deal')
      emit('cancel')
    }
  } finally {
    loading.value = false
  }
}

// Watch for targetStageId changes (for drag-drop)
watch(() => props.targetStageId, (newVal) => {
  if (newVal !== undefined && newVal !== null) {
    selectedStageId.value = newVal
  }
}, { immediate: true })

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
