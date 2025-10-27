<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? 'Edit Team' : 'Create New Team' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="saveTeam" class="space-y-4">
          <!-- Team Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Team Name <span class="text-red-500">*</span>
            </label>
            <BaseInput
              v-model="form.name"
              placeholder="Enter team name"
              :error="!!errors.name"
              @blur="validateField('name')"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              v-model="form.description"
              placeholder="Enter team description (optional)"
              rows="3"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.description }"
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
          </div>

          <!-- Form Actions -->
          <div class="flex items-center justify-end space-x-3 pt-4">
            <BaseButton
              type="button"
              variant="secondary"
              @click="$emit('close')"
            >
              Cancel
            </BaseButton>
            <BaseButton
              type="submit"
              variant="primary"
              :loading="saving"
              :disabled="!isFormValid"
            >
              {{ isEditing ? 'Update Team' : 'Create Team' }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { teamsAPI, type Team, type CreateTeamData, type UpdateTeamData } from '@/services/teams'
import { useNotifications } from '@/composables/useNotifications'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

interface Props {
  team?: Team | null
}

interface Emits {
  (e: 'close'): void
  (e: 'saved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { success, error: showError } = useNotifications()

// Reactive data
const saving = ref(false)
const isEditing = computed(() => !!props.team)

const form = reactive({
  name: '',
  description: ''
})

const errors = reactive({
  name: '',
  description: ''
})

// Computed
const isFormValid = computed(() => {
  return form.name.trim().length >= 3 && !Object.values(errors).some(error => error)
})

// Methods
const validateField = (field: keyof typeof errors) => {
  errors[field] = ''

  switch (field) {
    case 'name':
      if (!form.name.trim()) {
        errors.name = 'Team name is required'
      } else if (form.name.trim().length < 3) {
        errors.name = 'Team name must be at least 3 characters long'
      }
      break

    case 'description':
      // Description is optional, no validation needed
      break
  }
}

const validateForm = () => {
  // Validate all fields
  Object.keys(errors).forEach(field => {
    validateField(field as keyof typeof errors)
  })

  return !Object.values(errors).some(error => error)
}

const saveTeam = async () => {
  if (!validateForm()) {
    return
  }

  saving.value = true

  try {
    const teamData = {
      name: form.name.trim(),
      description: form.description.trim() || undefined
    }

    if (isEditing.value && props.team) {
      await teamsAPI.updateTeam(props.team.id, teamData as UpdateTeamData)
    } else {
      await teamsAPI.createTeam(teamData as CreateTeamData)
    }

    emit('saved')
  } catch (err: any) {
    console.error('Failed to save team:', err)
    
    // Handle validation errors from backend
    if (err.response?.status === 422 && err.response?.data?.errors) {
      const backendErrors = err.response.data.errors
      
      // Map backend errors to form fields
      if (backendErrors.name) {
        errors.name = Array.isArray(backendErrors.name) ? backendErrors.name[0] : backendErrors.name
      }
      if (backendErrors.description) {
        errors.description = Array.isArray(backendErrors.description) ? backendErrors.description[0] : backendErrors.description
      }
    } else {
      showError('Failed to save team')
    }
  } finally {
    saving.value = false
  }
}

// Initialize form when team prop changes
const initializeForm = () => {
  if (props.team) {
    form.name = props.team.name
    form.description = props.team.description || ''
  } else {
    form.name = ''
    form.description = ''
  }
  
  // Clear errors
  errors.name = ''
  errors.description = ''
}

// Watch for team prop changes
watch(() => props.team, initializeForm, { immediate: true })
</script>
