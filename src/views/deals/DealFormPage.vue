<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Deal' : 'New Deal' }}
            </h1>
            <p class="text-sm text-gray-600 mt-1">
              {{ isEditing ? 'Update deal information' : 'Create a new deal' }}
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="outline"
              @click="$router.back()"
            >
              Cancel
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="saveDeal"
              :loading="saving"
              :disabled="!isFormValid"
            >
              {{ isEditing ? 'Update Deal' : 'Create Deal' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white shadow-sm rounded-lg p-6">
        <form @submit.prevent="saveDeal" class="space-y-6">
          <!-- Basic Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Title -->
              <div class="md:col-span-2">
                <div class="flex items-center space-x-2 mb-1">
                  <label class="block text-sm font-medium text-gray-700">
                    Title <span class="text-red-500">*</span>
                  </label>
                  <div class="flex items-center space-x-1.5">
                    <svg class="w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                    </svg>
                    <p class="text-xs text-gray-600">
                      Each pipeline should have its own unique deal name.
                    </p>
                  </div>
                </div>
                <BaseInput
                  v-model="form.title"
                  placeholder="Enter deal title"
                  :error="errors.title"
                  required
                />
                <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
              </div>

              <!-- Description -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter deal description"
                ></textarea>
                <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
              </div>

              <!-- Currency + Deal Value -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Currency <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <select
                    v-model="form.currency"
                    @change="onCurrencyChange"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Currency</option>
                    <option
                      v-for="currency in allCurrencies"
                      :key="currency.code"
                      :value="currency.code"
                    >
                      {{ currency.code }} - {{ currency.name }}
                    </option>
                    <option value="add_custom" class="text-blue-600 font-medium">
                      ➕ Add Custom Currency
                    </option>
                  </select>
                </div>
                <p v-if="errors.currency" class="mt-1 text-sm text-red-600">{{ errors.currency }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Deal Value
                </label>
                <BaseInput
                  v-model="form.value"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  :disabled="!form.currency"
                  :error="errors.value"
                />
                <p v-if="errors.value" class="mt-1 text-sm text-red-600">{{ errors.value }}</p>
              </div>
            </div>
          </div>

          <!-- Pipeline & Stage -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Pipeline & Stage</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Pipeline -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Pipeline <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <select
                    v-model="selectedPipelineId"
                    @change="onPipelineChange"
                    class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Pipeline</option>
                    <option
                      v-for="pipeline in pipelinesStore.pipelines"
                      :key="pipeline.id"
                      :value="pipeline.id"
                    >
                      {{ pipeline.name }}
                    </option>
                    <option value="create_new" class="text-blue-600 font-medium">
                      ➕ Create Pipeline
                    </option>
                  </select>
                  <button
                    v-if="selectedPipelineId && selectedPipelineId !== 'create_new'"
                    type="button"
                    @click="editPipeline"
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Edit Pipeline"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                <p v-if="errors.pipeline_id" class="mt-1 text-sm text-red-600">{{ errors.pipeline_id }}</p>
              </div>

              <!-- Stage -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Stage <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <select
                    v-model="selectedStageId"
                    :disabled="!selectedPipelineId || selectedPipelineId === 'create_new'"
                    class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">
                      {{ selectedPipelineId && selectedPipelineId !== 'create_new' ? 'Select Stage' : 'Select pipeline first' }}
                    </option>
                    <option
                      v-for="stage in stagesForPipeline"
                      :key="stage.id"
                      :value="stage.id"
                    >
                      {{ stage.name }}
                    </option>
                    <option 
                      v-if="selectedPipelineId && selectedPipelineId !== 'create_new'"
                      value="create_new" 
                      class="text-blue-600 font-medium"
                    >
                      ➕ Create Stage
                    </option>
                  </select>
                  <button
                    v-if="selectedStageId && selectedStageId !== 'create_new'"
                    type="button"
                    @click="editStage"
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Edit Stage"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                <p v-if="errors.stage_id" class="mt-1 text-sm text-red-600">{{ errors.stage_id }}</p>
              </div>
            </div>
          </div>

          <!-- Deal Details -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Deal Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Status <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Status</option>
                  <option
                    v-for="status in DEAL_STATUSES"
                    :key="status.value"
                    :value="status.value"
                  >
                    {{ status.label }}
                  </option>
                </select>
                <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
              </div>

              <!-- Owner -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Owner <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.owner_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :disabled="isEditing || usersLoading"
                  :required="!isEditing"
                >
                  <option value="">
                    {{ usersLoading ? 'Loading users...' : 'Select Owner' }}
                  </option>
                  <option
                    v-for="user in availableUsers"
                    :key="user.id"
                    :value="user.id"
                  >
                    {{ user.name }}
                  </option>
                </select>
                <p v-if="isEditing" class="mt-1 text-sm text-gray-500">Owner cannot be changed after creation</p>
                <p v-if="errors.owner_id" class="mt-1 text-sm text-red-600">{{ errors.owner_id }}</p>
              </div>

                                                          <!-- Contact -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <select
                    v-model="form.contact_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :disabled="refsStore.contactsLoading"
                  >
                    <option value="">
                      {{ refsStore.contactsLoading ? 'Loading contacts...' : 'Select Contact' }}
                    </option>
                                         <option
                       v-for="contact in contacts"
                       :key="contact.id"
                       :value="contact.id"
                     >
                       {{ contact.first_name }} {{ contact.last_name }}
                     </option>
                  </select>
                <p v-if="errors.contact_id" class="mt-1 text-sm text-red-600">{{ errors.contact_id }}</p>
              </div>

              <!-- Company -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <select
                  v-model="form.company_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Company</option>
                  <option
                    v-for="company in refsStore.companies"
                    :key="company.id"
                    :value="company.id"
                  >
                    {{ company.name }}
                  </option>
                </select>
                <p v-if="errors.company_id" class="mt-1 text-sm text-red-600">{{ errors.company_id }}</p>
                <p v-if="route.query.company_name && form.company_id" class="mt-1 text-sm text-green-600">
                  ✓ Pre-filled from company details
                </p>
              </div>

              <!-- Expected Close Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Expected Close Date
                </label>
                <BaseInput
                  v-model="form.expected_close_date"
                  type="date"
                  :error="errors.expected_close_date"
                />
                <p v-if="errors.expected_close_date" class="mt-1 text-sm text-red-600">{{ errors.expected_close_date }}</p>
              </div>

              <!-- Probability -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Probability (%) <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  v-model="form.probability"
                  type="number"
                  placeholder="50"
                  min="0"
                  max="100"
                  :error="errors.probability"
                  required
                />
                <p v-if="errors.probability" class="mt-1 text-sm text-red-600">{{ errors.probability }}</p>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <BaseInput
              v-model="tagsInput"
              placeholder="Enter tags separated by commas"
              @input="updateTags"
            />
            <p class="mt-1 text-sm text-gray-500">Separate tags with commas</p>
            <p v-if="errors.tags" class="mt-1 text-sm text-red-600">{{ errors.tags }}</p>
          </div>
        </form>
      </div>
    </div>

    <!-- Pipeline Create/Edit Modal -->
    <div v-if="showPipelineModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingPipeline ? 'Edit Pipeline' : 'Create Pipeline' }}
          </h3>
          <form @submit.prevent="savePipeline">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Name <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  v-model="pipelineForm.name"
                  placeholder="Enter pipeline name"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  v-model="pipelineForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter pipeline description"
                ></textarea>
              </div>
            </div>
            <div class="flex items-center justify-end space-x-3 mt-6">
              <BaseButton
                type="button"
                variant="outline"
                @click="closePipelineModal"
              >
                Cancel
              </BaseButton>
              <BaseButton
                type="submit"
                variant="primary"
                :loading="savingPipeline"
              >
                {{ editingPipeline ? 'Update' : 'Create' }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Stage Create/Edit Modal -->
    <div v-if="showStageModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingStage ? 'Edit Stage' : 'Create Stage' }}
          </h3>
          <form @submit.prevent="saveStage">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Name <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  v-model="stageForm.name"
                  placeholder="Enter stage name"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  v-model="stageForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter stage description"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Order <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  v-model="stageForm.order"
                  type="number"
                  placeholder="1"
                  min="1"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Color <span class="text-red-500">*</span>
                </label>
                <div class="flex items-center space-x-2">
                  <input
                    v-model="stageForm.color"
                    type="color"
                    class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <BaseInput
                    v-model="stageForm.color"
                    placeholder="#3B82F6"
                    class="flex-1"
                  />
                </div>
              </div>
            </div>
            <div class="flex items-center justify-end space-x-3 mt-6">
              <BaseButton
                type="button"
                variant="outline"
                @click="closeStageModal"
              >
                Cancel
              </BaseButton>
              <BaseButton
                type="submit"
                variant="primary"
                :loading="savingStage"
              >
                {{ editingStage ? 'Update' : 'Create' }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Custom Currency Modal -->
    <div v-if="showCustomCurrencyModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Add Custom Currency
          </h3>
          <form @submit.prevent="saveCustomCurrency">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Currency Code <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  v-model="customCurrencyForm.code"
                  placeholder="e.g., BTC, ETH, CUSTOM"
                  maxlength="10"
                  required
                />
                <p class="mt-1 text-sm text-gray-500">Enter a unique 3-10 character code</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Currency Name <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  v-model="customCurrencyForm.name"
                  placeholder="e.g., Bitcoin, Ethereum, Custom Currency"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Symbol (Optional)
                </label>
                <BaseInput
                  v-model="customCurrencyForm.symbol"
                  placeholder="e.g., ₿, Ξ, $"
                  maxlength="5"
                />
              </div>
              <div class="flex justify-end space-x-3 pt-4">
                <BaseButton
                  type="button"
                  variant="outline"
                  @click="cancelCustomCurrency"
                >
                  Cancel
                </BaseButton>
                <BaseButton
                  type="submit"
                  variant="primary"
                  :disabled="!customCurrencyForm.code || !customCurrencyForm.name"
                >
                  Add Currency
                </BaseButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDealsStore } from '../../stores/deals'
import { usePipelinesStore } from '../../stores/pipelines'
import { useStagesStore } from '../../stores/stages'
import { useRefsStore } from '../../stores/refs'
import { useAuth } from '../../composables/useAuth'
import { success, error } from '../../utils/notifications'
import { CURRENCIES, DEAL_STATUSES } from '../../utils/constants'
import { dealFormSchema } from '../../utils/validation'
import { fetchUsersForDropdown } from '../../helpers/fetchUsersForDropdown'
import type { DealFormData, PipelineFormData, StageFormData, Contact } from '../../types'
import BaseButton from '../../components/ui/BaseButton.vue'
import BaseInput from '../../components/ui/BaseInput.vue'

const route = useRoute()
const router = useRouter()

// Stores
const dealsStore = useDealsStore()
const pipelinesStore = usePipelinesStore()
const stagesStore = useStagesStore()
const refsStore = useRefsStore()

// Auth composable
const { user: currentUser } = useAuth()

// Reactive data
const saving = ref(false)
const savingPipeline = ref(false)
const savingStage = ref(false)
const showPipelineModal = ref(false)
const showStageModal = ref(false)
const editingPipeline = ref(false)
const editingStage = ref(false)
const errors = reactive<Record<string, string>>({})

// Users data
const users = ref<Array<{id: number, name: string, email: string, role: string}>>([])
const usersLoading = ref(false)

// Form data
const form = reactive<DealFormData>({
  title: '',
  description: '',
  value: undefined,
  currency: '',
  status: 'open',
  pipeline_id: 0,
  stage_id: 0,
  owner_id: 0,
  contact_id: undefined,
  company_id: undefined,
  expected_close_date: '',
  probability: 50,
  tags: []
})

// Form state for create new options
const selectedPipelineId = ref<number | string>('')
const selectedStageId = ref<number | string>('')

// Pipeline form
const pipelineForm = reactive<PipelineFormData>({
  name: '',
  description: '',
  is_active: true
})

// Stage form
const stageForm = reactive<StageFormData>({
  name: '',
  description: '',
  pipeline_id: 0,
  order: 1,
  color: '#3B82F6',
  is_active: true
})

// Tags input
const tagsInput = ref('')

// Custom currency functionality
const showCustomCurrencyModal = ref(false)
const customCurrencies = ref<Array<{code: string, name: string, symbol: string}>>([])
const customCurrencyForm = reactive({
  code: '',
  name: '',
  symbol: ''
})

// Computed
const isEditing = computed(() => {
  return route.name === 'DealEdit'
})

const currencies = computed(() => CURRENCIES)

// Combined currencies (default + custom)
const allCurrencies = computed(() => {
  return [...CURRENCIES, ...customCurrencies.value]
})

const stagesForPipeline = computed(() => {
  if (!selectedPipelineId.value || selectedPipelineId.value === 'create_new') return []
  return stagesStore.stages.filter(stage => stage.pipeline_id === selectedPipelineId.value)
})

// Get users for dropdown
const availableUsers = computed(() => {
  return users.value
})

const isFormValid = computed(() => {
  return form.title && 
         form.currency && 
         selectedPipelineId.value && 
         selectedPipelineId.value !== 'create_new' &&
         selectedStageId.value && 
         selectedStageId.value !== 'create_new' &&
         (isEditing.value ? true : form.owner_id) // owner_id only required for new deals
})

// Force reactivity for contacts
const contacts = ref<Contact[]>([])

// Watch for contacts changes
watch(() => refsStore.contacts, (newContacts) => {
  contacts.value = [...newContacts]
}, { immediate: true, deep: true })

// Methods
const fetchUsers = async () => {
  usersLoading.value = true
  try {
    const fetchedUsers = await fetchUsersForDropdown()
    users.value = fetchedUsers
  } catch (err: any) {
    console.error('Failed to fetch users:', err)
    // Fallback to current user if API fails
    if (currentUser.value && currentUser.value.id) {
      users.value = [{
        id: currentUser.value.id,
        name: currentUser.value.name || 'Current User',
        email: currentUser.value.email || '',
        role: currentUser.value.role || 'user'
      }]
    }
  } finally {
    usersLoading.value = false
  }
}

const checkDuplicateDealName = (name: string, pipelineId: number, excludeId?: number): { isDuplicate: boolean, duplicates: any[] } => {
  const normalizedName = name.trim().toLowerCase()
  const duplicates = dealsStore.deals.filter(deal => {
    // Skip if it's the same deal being edited
    if (excludeId && deal.id === excludeId) return false
    // Only check within the same pipeline
    if (deal.pipeline_id !== pipelineId) return false
    return deal.title.toLowerCase() === normalizedName
  })
  
  return {
    isDuplicate: duplicates.length > 0,
    duplicates
  }
}

const validateForm = async () => {
  try {
    await dealFormSchema.validate(form, { abortEarly: false })
    Object.keys(errors).forEach(key => delete errors[key])
    return true
  } catch (validationError: any) {
    Object.keys(errors).forEach(key => delete errors[key])
    if (validationError.inner && Array.isArray(validationError.inner)) {
      validationError.inner.forEach((err: any) => {
        errors[err.path] = err.message
      })
    } else if (validationError.message) {
      // Handle single validation error
      errors.general = validationError.message
    }
    return false
  }
}

const saveDeal = async () => {
  if (!isFormValid.value) {
    error('Please fill in all required fields')
    return
  }

  // Update form with selected values
  if (selectedPipelineId.value && selectedPipelineId.value !== 'create_new') {
    form.pipeline_id = selectedPipelineId.value as number
  }
  if (selectedStageId.value && selectedStageId.value !== 'create_new') {
    form.stage_id = selectedStageId.value as number
  }

  const isValid = await validateForm()
  if (!isValid) {
    error('Please fix the validation errors')
    return
  }

  // Check for duplicates before saving (within same pipeline only)
  const dealIdToExclude = isEditing.value ? parseInt(route.params.id as string) : undefined
  const pipelineIdToCheck = form.pipeline_id as number
  const duplicateCheck = checkDuplicateDealName(form.title, pipelineIdToCheck, dealIdToExclude)
  
  if (duplicateCheck.isDuplicate) {
    errors.title = 'A deal with this name already exists in this pipeline'
    return
  }

  saving.value = true
  try {
    if (isEditing.value) {
      // Remove owner_id from update payload since it's prohibited by backend
      const updateData = { ...form }
      delete updateData.owner_id
      
      await dealsStore.updateDeal(parseInt(route.params.id as string), updateData)
      success('Deal updated successfully')
      // Navigate back to deals list without causing a full reload
      router.push({ name: 'DealsList', replace: true })
    } else {
      const newDeal = await dealsStore.createDeal(form)
      success('Deal created successfully')
      // Navigate back to deals list without causing a full reload
      router.push({ name: 'DealsList', replace: true })
    }
  } catch (err: any) {
    if (err.response?.status === 422) {
      // Handle validation errors from backend
      const backendErrors = err.response.data.errors
      Object.keys(backendErrors).forEach(key => {
        errors[key] = backendErrors[key][0]
      })
      error('Please fix the validation errors')
    } else {
      error('Failed to save deal')
    }
  } finally {
    saving.value = false
  }
}

const onCurrencyChange = () => {
  if (form.currency === 'add_custom') {
    // Open custom currency modal
    showCustomCurrencyModal.value = true
    form.currency = '' // Reset selection
  } else if (!form.currency) {
    form.value = undefined
  }
}

const onPipelineChange = async () => {
  selectedStageId.value = ''
  form.stage_id = 0
  
  if (selectedPipelineId.value === 'create_new') {
    showPipelineModal.value = true
    editingPipeline.value = false
    pipelineForm.name = ''
    pipelineForm.description = ''
    return
  }
  
  if (selectedPipelineId.value && selectedPipelineId.value !== 'create_new') {
    form.pipeline_id = selectedPipelineId.value as number
    await stagesStore.fetchStagesByPipeline(form.pipeline_id)
  }
}

const editPipeline = () => {
  const pipeline = pipelinesStore.pipelines.find(p => p.id === selectedPipelineId.value)
  if (pipeline) {
    editingPipeline.value = true
    pipelineForm.name = pipeline.name
    pipelineForm.description = pipeline.description || ''
    showPipelineModal.value = true
  }
}

const savePipeline = async () => {
  if (!pipelineForm.name) {
    error('Pipeline name is required')
    return
  }

  savingPipeline.value = true
  try {
    if (editingPipeline.value) {
      const pipeline = pipelinesStore.pipelines.find(p => p.id === selectedPipelineId.value)
      if (pipeline) {
        await pipelinesStore.updatePipeline(pipeline.id, pipelineForm)
        success('Pipeline updated successfully')
      }
    } else {
      const newPipeline = await pipelinesStore.createPipeline(pipelineForm)
      selectedPipelineId.value = newPipeline.id
      form.pipeline_id = newPipeline.id
      await stagesStore.fetchStagesByPipeline(newPipeline.id)
      success('Pipeline created successfully')
    }
    closePipelineModal()
  } catch (err) {
    error('Failed to save pipeline')
  } finally {
    savingPipeline.value = false
  }
}

const closePipelineModal = () => {
  showPipelineModal.value = false
  editingPipeline.value = false
  pipelineForm.name = ''
  pipelineForm.description = ''
}

const editStage = () => {
  const stage = stagesStore.stages.find(s => s.id === selectedStageId.value)
  if (stage) {
    editingStage.value = true
    stageForm.name = stage.name
    stageForm.description = stage.description || ''
    stageForm.order = stage.order
    stageForm.color = stage.color
    showStageModal.value = true
  }
}

const saveStage = async () => {
  if (!stageForm.name || !stageForm.order || !stageForm.color) {
    error('Please fill in all required fields')
    return
  }

  savingStage.value = true
  try {
    stageForm.pipeline_id = form.pipeline_id as number
    
    if (editingStage.value) {
      const stage = stagesStore.stages.find(s => s.id === selectedStageId.value)
      if (stage) {
        await stagesStore.updateStage(stage.id, stageForm)
        success('Stage updated successfully')
      }
    } else {
      const newStage = await stagesStore.createStage(stageForm)
      selectedStageId.value = newStage.id
      form.stage_id = newStage.id
      success('Stage created successfully')
    }
    closeStageModal()
  } catch (err) {
    error('Failed to save stage')
  } finally {
    savingStage.value = false
  }
}

const closeStageModal = () => {
  showStageModal.value = false
  editingStage.value = false
  stageForm.name = ''
  stageForm.description = ''
  stageForm.order = 1
  stageForm.color = '#3B82F6'
}

const updateTags = () => {
  if (!tagsInput.value) {
    form.tags = []
    return
  }
  
  form.tags = tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
}

// Lifecycle
onMounted(async () => {
  // Initialize data
  await Promise.all([
    pipelinesStore.fetchPipelines(),
    refsStore.initializeData(),
    fetchUsers()
  ])
  
  // Force a reactivity update
  await nextTick()
  
  // Force contacts to be reactive
  contacts.value = [...refsStore.contacts]

  // Auto-select current user as owner for new deals
  if (!isEditing.value && currentUser.value && currentUser.value.id) {
    // Check if current user is in the available users list
    const currentUserInList = users.value.find((user: any) => user.id === currentUser.value.id)
    if (currentUserInList) {
      form.owner_id = currentUser.value.id
    }
  }

  // Check for company pre-fill from query parameters
  if (route.query.company_id && route.query.company_name) {
    const companyId = parseInt(route.query.company_id as string)
    if (!isNaN(companyId)) {
      form.company_id = companyId
    }
  }

  // Check for contact pre-fill from query parameters
  if (route.query.contact_id) {
    const contactId = parseInt(route.query.contact_id as string)
    if (!isNaN(contactId)) {
      form.contact_id = contactId
    }
  }

  if (isEditing.value && route.params.id) {
    // Load deal data for editing
    const deal = await dealsStore.fetchDeal(parseInt(route.params.id as string))
    if (deal) {
      Object.assign(form, {
        title: deal.title,
        description: deal.description || '',
        value: deal.value,
        currency: deal.currency || '',
        status: deal.status,
        pipeline_id: deal.pipeline_id,
        stage_id: deal.stage_id,
        owner_id: deal.owner_id,
        contact_id: deal.contact_id,
        company_id: deal.company_id,
        expected_close_date: deal.expected_close_date || '',
        probability: deal.probability,
        tags: deal.tags || []
      })
      
      // Set selected pipeline and stage
      selectedPipelineId.value = deal.pipeline_id
      selectedStageId.value = deal.stage_id
      
      // Load stages for the pipeline
      if (deal.pipeline_id) {
        await stagesStore.fetchStagesByPipeline(deal.pipeline_id)
      }
      
      // Set tags input
      tagsInput.value = (deal.tags || []).join(', ')
    }
  }
})

// Watch for stage creation/update
watch(() => selectedStageId.value, (newStageId) => {
  if (newStageId === 'create_new') {
    showStageModal.value = true
    editingStage.value = false
    stageForm.name = ''
    stageForm.description = ''
    stageForm.order = stagesForPipeline.value.length + 1
    stageForm.color = '#3B82F6'
  }
})

// Watch for contacts loading
watch(() => refsStore.contactsLoading, (loading) => {
  if (!loading && refsStore.contacts.length > 0) {
    // Force reactivity update
    nextTick(() => {
      // Contacts should now be visible
    })
  }
})

// Custom currency methods
const saveCustomCurrency = () => {
  // Validate form
  if (!customCurrencyForm.code || !customCurrencyForm.name) {
    return
  }

  // Check if currency code already exists
  const existingCurrency = allCurrencies.value.find(
    currency => currency.code.toUpperCase() === customCurrencyForm.code.toUpperCase()
  )
  
  if (existingCurrency) {
    error('Currency code already exists. Please choose a different code.')
    return
  }

  // Add custom currency
  const newCurrency = {
    code: customCurrencyForm.code.toUpperCase(),
    name: customCurrencyForm.name,
    symbol: customCurrencyForm.symbol || customCurrencyForm.code.toUpperCase()
  }
  
  customCurrencies.value.push(newCurrency)
  
  // Select the new currency
  form.currency = newCurrency.code
  
  // Close modal and reset form
  showCustomCurrencyModal.value = false
  customCurrencyForm.code = ''
  customCurrencyForm.name = ''
  customCurrencyForm.symbol = ''
  
  success('Custom currency added successfully!')
}

const cancelCustomCurrency = () => {
  showCustomCurrencyModal.value = false
  customCurrencyForm.code = ''
  customCurrencyForm.name = ''
  customCurrencyForm.symbol = ''
}
</script>
