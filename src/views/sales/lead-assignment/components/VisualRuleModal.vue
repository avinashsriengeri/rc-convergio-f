<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="close"
      ></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <form @submit.prevent="handleSubmit">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-medium text-white" id="modal-title">
                    {{ isEditing ? 'Edit Assignment Rule' : 'Create Assignment Rule' }}
                  </h3>
                  <p class="text-sm text-blue-100">
                    {{ isEditing ? 'Update the assignment rule configuration.' : 'Configure a new automatic assignment rule.' }}
                  </p>
                </div>
              </div>
              <button
                @click="close"
                class="text-white hover:text-blue-200 transition-colors"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Progress Steps -->
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div
                v-for="(step, index) in steps"
                :key="step.id"
                class="flex items-center"
              >
                <div
                  :class="[
                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                    currentStep >= index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  ]"
                >
                  {{ index + 1 }}
                </div>
                <span
                  :class="[
                    'ml-2 text-sm font-medium',
                    currentStep >= index + 1 ? 'text-blue-600' : 'text-gray-500'
                  ]"
                >
                  {{ step.name }}
                </span>
                <svg
                  v-if="index < steps.length - 1"
                  class="ml-4 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Form Content -->
          <div class="bg-white px-6 py-6">
            <!-- Step 1: Basic Info -->
            <div v-if="currentStep === 1" class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Rule Name *
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-300': errors.name }"
                  placeholder="Enter rule name"
                />
                <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  v-model="form.description"
                  rows="3"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-300': errors.description }"
                  placeholder="Describe what this rule does"
                ></textarea>
                <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
              </div>

              <div>
                <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <input
                  id="priority"
                  v-model.number="form.priority"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-300': errors.priority }"
                  placeholder="1"
                />
                <p class="mt-1 text-sm text-gray-500">Lower numbers have higher priority (1 = highest)</p>
                <p v-if="errors.priority" class="mt-1 text-sm text-red-600">{{ errors.priority }}</p>
              </div>
            </div>

            <!-- Step 2: Criteria Builder -->
            <div v-if="currentStep === 2" class="space-y-6">
              <div class="flex items-center justify-between">
                <h4 class="text-lg font-medium text-gray-900">Assignment Conditions</h4>
                <BaseButton
                  @click="addCondition"
                  variant="outline"
                  size="sm"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Condition
                </BaseButton>
              </div>

              <!-- Logic Toggle -->
              <div class="flex items-center space-x-4">
                <span class="text-sm font-medium text-gray-700">Match:</span>
                <div class="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    @click="form.criteria.logic = 'all'"
                    :class="[
                      'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                      form.criteria.logic === 'all'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    ]"
                  >
                    All Conditions
                  </button>
                  <button
                    type="button"
                    @click="form.criteria.logic = 'any'"
                    :class="[
                      'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                      form.criteria.logic === 'any'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    ]"
                  >
                    Any Condition
                  </button>
                </div>
              </div>

              <!-- Conditions List -->
              <div v-if="form.criteria.conditions.length === 0" class="text-center py-8 text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No conditions added yet. Click "Add Condition" to get started.</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="(condition, index) in form.criteria.conditions"
                  :key="index"
                  class="bg-gray-50 rounded-lg p-4"
                >
                  <div class="flex items-center space-x-4">
                    <!-- Field Selection -->
                    <div class="flex-1">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Field</label>
                      <BaseSelect
                        v-model="condition.field"
                        :options="fieldOptions"
                        placeholder="Select field"
                        :error="errors[`criteria.conditions.${index}.field`]"
                      />
                    </div>

                    <!-- Operator Selection -->
                    <div class="flex-1">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                      <BaseSelect
                        v-model="condition.operator"
                        :options="operatorOptions"
                        placeholder="Select operator"
                        :error="errors[`criteria.conditions.${index}.operator`]"
                      />
                    </div>

                    <!-- Value Input -->
                    <div class="flex-1" v-if="!['is_empty', 'is_not_empty'].includes(condition.operator)">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Value</label>
                      <BaseSelect
                        v-if="getFieldType(condition.field) === 'select'"
                        v-model="condition.value"
                        :options="getFieldOptions(condition.field)"
                        placeholder="Select value"
                        :error="errors[`criteria.conditions.${index}.value`]"
                      />
                      <input
                        v-else
                        v-model="condition.value"
                        :type="getFieldType(condition.field)"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        :class="{ 'border-red-300': errors[`criteria.conditions.${index}.value`] }"
                        placeholder="Enter value"
                      />
                    </div>

                    <!-- Remove Button -->
                    <div class="flex items-end">
                      <button
                        type="button"
                        @click="removeCondition(index)"
                        class="text-red-600 hover:text-red-800 p-2"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <p v-if="errors.criteria" class="text-sm text-red-600">{{ errors.criteria }}</p>
            </div>

            <!-- Step 3: Action Setup -->
            <div v-if="currentStep === 3" class="space-y-6">
              <h4 class="text-lg font-medium text-gray-900">Assignment Action</h4>

              <div>
                <label for="actionType" class="block text-sm font-medium text-gray-700 mb-2">
                  Action Type *
                </label>
                <BaseSelect
                  id="actionType"
                  v-model="form.actionType"
                  :options="actionTypeOptions"
                  placeholder="Select action type"
                  :error="errors.action"
                />
                <p v-if="errors.action" class="mt-1 text-sm text-red-600">{{ errors.action }}</p>
              </div>

              <!-- User Selection -->
              <div v-if="form.actionType === 'assign_user'">
                <label for="userId" class="block text-sm font-medium text-gray-700 mb-2">
                  Assign to User *
                </label>
                <BaseSelect
                  id="userId"
                  v-model="form.userId"
                  :options="userOptions"
                  placeholder="Select user"
                  :error="errors.action"
                />
              </div>

              <!-- Team Selection -->
              <div v-if="form.actionType === 'assign_team'">
                <label for="teamId" class="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Team *
                </label>
                <BaseSelect
                  id="teamId"
                  v-model="form.teamId"
                  :options="teamOptions"
                  placeholder="Select team"
                  :error="errors.action"
                />
              </div>

              <!-- Round Robin Info -->
              <div v-if="form.actionType === 'round_robin'" class="bg-blue-50 rounded-lg p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-blue-800">Round Robin Assignment</h3>
                    <div class="mt-2 text-sm text-blue-700">
                      <p>Leads will be distributed evenly among all active team members based on their current workload.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 4: Review Summary -->
            <div v-if="currentStep === 4" class="space-y-6">
              <h4 class="text-lg font-medium text-gray-900">Rule Summary</h4>

              <div class="bg-gray-50 rounded-lg p-6">
                <div class="space-y-4">
                  <div>
                    <h5 class="text-sm font-medium text-gray-700">Rule Name</h5>
                    <p class="text-lg font-semibold text-gray-900">{{ form.name }}</p>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-700">Description</h5>
                    <p class="text-gray-900">{{ form.description }}</p>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-700">Priority</h5>
                    <p class="text-gray-900">{{ form.priority }}</p>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-700">Conditions</h5>
                    <p class="text-gray-900">{{ generateRuleSummary() }}</p>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-700">Action</h5>
                    <p class="text-gray-900">{{ getActionSummary() }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div>
              <BaseButton
                v-if="currentStep > 1"
                type="button"
                variant="outline"
                @click="previousStep"
              >
                Previous
              </BaseButton>
            </div>
            <div class="flex space-x-3">
              <BaseButton
                type="button"
                variant="outline"
                @click="close"
              >
                Cancel
              </BaseButton>
              <BaseButton
                v-if="currentStep < 4"
                type="button"
                variant="primary"
                @click="nextStep"
              >
                Next
              </BaseButton>
              <BaseButton
                v-else
                type="submit"
                :loading="loading"
                variant="primary"
              >
                {{ isEditing ? 'Update Rule' : 'Create Rule' }}
              </BaseButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { leadAssignmentService } from '@/services/leadAssignment'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  rule: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'save'])

// Reactive state
const currentStep = ref(1)
const users = ref([])
const teams = ref([])
const errors = ref({})

const form = ref({
  name: '',
  description: '',
  priority: 1,
  criteria: {
    logic: 'all',
    conditions: []
  },
  actionType: '',
  userId: '',
  teamId: ''
})

// Steps configuration
const steps = ref([
  { id: 'basic', name: 'Basic Info' },
  { id: 'criteria', name: 'Conditions' },
  { id: 'action', name: 'Action' },
  { id: 'review', name: 'Review' }
])

// Computed
const isEditing = computed(() => !!props.rule?.id)

const fieldOptions = computed(() => {
  const fields = leadAssignmentService.getAvailableFields()
  return [
    { value: '', label: 'Select field...' },
    ...fields.map(field => ({ value: field.value, label: field.label }))
  ]
})

const operatorOptions = computed(() => {
  const operators = leadAssignmentService.getAvailableOperators()
  return [
    { value: '', label: 'Select operator...' },
    ...operators.map(op => ({ value: op.value, label: op.label }))
  ]
})

const actionTypeOptions = computed(() => {
  const actions = leadAssignmentService.getActionTypes()
  return [
    { value: '', label: 'Select action...' },
    ...actions.map(action => ({ value: action.value, label: action.label }))
  ]
})

const userOptions = computed(() => [
  { value: '', label: 'Select user...' },
  ...users.value.map(user => ({ value: user.id, label: `${user.name} (${user.email})` }))
])

const teamOptions = computed(() => [
  { value: '', label: 'Select team...' },
  ...teams.value.map(team => ({ value: team.id, label: team.name }))
])

// Methods
const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    priority: 1,
    criteria: {
      logic: 'all',
      conditions: []
    },
    actionType: '',
    userId: '',
    teamId: ''
  }
  currentStep.value = 1
  errors.value = {}
}

const addCondition = () => {
  form.value.criteria.conditions.push({
    field: '',
    operator: '',
    value: ''
  })
}

const removeCondition = (index) => {
  form.value.criteria.conditions.splice(index, 1)
}

const getFieldType = (fieldValue) => {
  const field = leadAssignmentService.getAvailableFields().find(f => f.value === fieldValue)
  return field ? field.type : 'text'
}

const getFieldOptions = (fieldValue) => {
  const field = leadAssignmentService.getAvailableFields().find(f => f.value === fieldValue)
  if (field && field.options) {
    return [
      { value: '', label: 'Select value...' },
      ...field.options.map(opt => ({ value: opt.value, label: opt.label }))
    ]
  }
  return []
}

const nextStep = () => {
  if (validateCurrentStep()) {
    currentStep.value++
  }
}

const previousStep = () => {
  currentStep.value--
}

const validateCurrentStep = () => {
  errors.value = {}
  
  if (currentStep.value === 1) {
    if (!form.value.name.trim()) {
      errors.value.name = 'Rule name is required'
    }
    if (!form.value.description.trim()) {
      errors.value.description = 'Description is required'
    }
    if (!form.value.priority || form.value.priority < 1) {
      errors.value.priority = 'Priority must be a positive number'
    }
  } else if (currentStep.value === 2) {
    if (form.value.criteria.conditions.length === 0) {
      errors.value.criteria = 'At least one condition is required'
    }
  } else if (currentStep.value === 3) {
    if (!form.value.actionType) {
      errors.value.action = 'Action type is required'
    } else if (form.value.actionType === 'assign_user' && !form.value.userId) {
      errors.value.action = 'User must be selected'
    } else if (form.value.actionType === 'assign_team' && !form.value.teamId) {
      errors.value.action = 'Team must be selected'
    }
  }
  
  return Object.keys(errors.value).length === 0
}

const generateRuleSummary = () => {
  const rule = {
    criteria: form.value.criteria,
    action: { type: form.value.actionType }
  }
  return leadAssignmentService.generateRuleSummary(rule)
}

const getActionSummary = () => {
  const action = {
    type: form.value.actionType,
    user_id: form.value.userId,
    team_id: form.value.teamId
  }
  return leadAssignmentService.getActionSummary(action)
}

const handleSubmit = () => {
  if (!validateCurrentStep()) return
  
  // Use the new buildRulePayload function that handles all field mappings
  const formData = {
    name: form.value.name,
    description: form.value.description,
    priority: form.value.priority,
    is_active: true,
    logic: form.value.criteria.logic,
    conditions: form.value.criteria.conditions,
    actionType: form.value.actionType,
    userId: form.value.userId,
    teamId: form.value.teamId
  }
  
  // Debug: Log the form data to see what we're sending
  console.log('Form data being sent:', formData)
  console.log('Form conditions:', form.value.criteria.conditions)
  
  const ruleData = leadAssignmentService.buildRulePayload(formData)
  console.log('Built rule data:', ruleData)
  console.log('Built rule data criteria:', ruleData.criteria)
  console.log('Built rule data conditions:', ruleData.criteria.conditions)
  console.log('About to emit save with:', ruleData)
  emit('save', ruleData)
}

const close = () => {
  emit('close')
}

const loadUsers = async () => {
  try {
    users.value = await leadAssignmentService.loadUsers()
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

const loadTeams = async () => {
  try {
    teams.value = await leadAssignmentService.loadTeams()
  } catch (error) {
    console.error('Error loading teams:', error)
  }
}

// Watch for rule changes
watch(() => props.rule, (newRule) => {
  if (newRule) {
    form.value = {
      name: newRule.name || '',
      description: newRule.description || '',
      priority: newRule.priority || 1,
      criteria: leadAssignmentService.parseCriteriaToForm(newRule.criteria),
      ...leadAssignmentService.parseActionToForm(newRule.action)
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    resetForm()
  } else {
    loadUsers()
    loadTeams()
  }
})

// Lifecycle
onMounted(() => {
  if (props.isOpen) {
    loadUsers()
    loadTeams()
  }
})
</script>
