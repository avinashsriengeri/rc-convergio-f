<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="$emit('close')"
  >
    <div
      class="relative top-20 mx-auto p-8 border w-full max-w-3xl shadow-xl rounded-xl bg-white"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-gray-900">
          {{ documentType ? 'Edit Document Type' : 'Create Document Type' }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-500 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Document Type Name *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              placeholder="e.g. Offer Letter, ID Proof"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            />
          </div>

          <!-- Code -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Code (Optional)
            </label>
            <input
              v-model="formData.code"
              type="text"
              placeholder="e.g. OFFER_LETTER, ID_PROOF"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            />
            <p class="mt-1 text-xs text-gray-500">Unique identifier for this document type</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Enter a brief description of this document type..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            ></textarea>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              v-model="formData.category"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            >
              <option value="">Select Category</option>
              <option value="contract">Contract</option>
              <option value="id_document">ID Document</option>
              <option value="qualification">Qualification</option>
              <option value="performance">Performance</option>
              <option value="disciplinary">Disciplinary</option>
              <option value="onboarding">Onboarding</option>
              <option value="profile_picture">Profile Picture</option>
              <option value="payslip">Payslip</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Checkboxes Row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex items-center">
              <input
                v-model="formData.is_mandatory"
                type="checkbox"
                class="h-4 w-4 text-primary-purple focus:ring-primary-purple border-gray-300 rounded"
              />
              <label class="ml-2 text-sm font-medium text-gray-700">
                Mandatory Document
              </label>
            </div>
            <div class="flex items-center">
              <input
                v-model="formData.employee_can_upload"
                type="checkbox"
                class="h-4 w-4 text-primary-purple focus:ring-primary-purple border-gray-300 rounded"
              />
              <label class="ml-2 text-sm font-medium text-gray-700">
                Employee Can Upload
              </label>
            </div>
            <div class="flex items-center">
              <input
                v-model="formData.is_hr_only"
                type="checkbox"
                class="h-4 w-4 text-primary-purple focus:ring-primary-purple border-gray-300 rounded"
              />
              <label class="ml-2 text-sm font-medium text-gray-700">
                HR Only
              </label>
            </div>
          </div>

          <!-- Allowed File Types -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Allowed File Types
            </label>
            <div class="flex flex-wrap gap-3">
              <label
                v-for="fileType in availableFileTypes"
                :key="fileType"
                class="flex items-center"
              >
                <input
                  v-model="formData.allowed_file_types"
                  type="checkbox"
                  :value="fileType"
                  class="h-4 w-4 text-primary-purple focus:ring-primary-purple border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">{{ fileType.toUpperCase() }}</span>
              </label>
            </div>
            <p class="mt-2 text-xs text-gray-500">Leave empty to allow all file types</p>
          </div>

          <!-- Max File Size -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Maximum File Size (MB)
            </label>
            <input
              v-model.number="formData.max_file_size_mb"
              type="number"
              min="1"
              max="100"
              placeholder="10"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            />
            <p class="mt-1 text-xs text-gray-500">Default: 10 MB</p>
          </div>

          <!-- Target Departments -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Target Departments (Optional)
            </label>
            <select
              v-model="formData.target_departments"
              multiple
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent h-32"
            >
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
            <p class="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple. Leave empty for all departments.</p>
          </div>

          <!-- Target Designations -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Target Designations (Optional)
            </label>
            <select
              v-model="formData.target_designations"
              multiple
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent h-32"
            >
              <option v-for="des in designations" :key="des.id" :value="des.id">
                {{ des.name }}
              </option>
            </select>
            <p class="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple. Leave empty for all designations.</p>
          </div>

          <!-- Is Active -->
          <div class="flex items-center">
            <input
              v-model="formData.is_active"
              type="checkbox"
              class="h-4 w-4 text-primary-purple focus:ring-primary-purple border-gray-300 rounded"
            />
            <label class="ml-2 text-sm font-medium text-gray-700">
              Active
            </label>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-8">
          <button
            type="button"
            @click="$emit('close')"
            class="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : (documentType ? 'Update Document Type' : 'Create Document Type') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useHrDocumentTypesStore } from '../store/hrDocumentTypes'
import { useHrDepartmentsStore } from '../store/hrDepartments'
import { useHrDesignationsStore } from '../store/hrDesignations'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  documentType: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const documentTypesStore = useHrDocumentTypesStore()
const departmentsStore = useHrDepartmentsStore()
const designationsStore = useHrDesignationsStore()

const saving = ref(false)
const availableFileTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'xls', 'xlsx', 'txt']

const formData = ref({
  name: '',
  code: '',
  description: '',
  category: '',
  is_mandatory: false,
  employee_can_upload: true,
  is_hr_only: false,
  allowed_file_types: [],
  max_file_size_mb: 10,
  target_departments: [],
  target_designations: [],
  is_active: true
})

const departments = computed(() => departmentsStore.activeDepartments)
const designations = computed(() => designationsStore.activeDesignations)

// Define resetForm BEFORE watch to avoid hoisting issues
const resetForm = () => {
  formData.value = {
    name: '',
    code: '',
    description: '',
    category: '',
    is_mandatory: false,
    employee_can_upload: true,
    is_hr_only: false,
    allowed_file_types: [],
    max_file_size_mb: 10,
    target_departments: [],
    target_designations: [],
    is_active: true
  }
}

watch(() => props.documentType, (newVal) => {
  if (newVal) {
    formData.value = {
      name: newVal.name || '',
      code: newVal.code || '',
      description: newVal.description || '',
      category: newVal.category || '',
      is_mandatory: newVal.is_mandatory || false,
      employee_can_upload: newVal.employee_can_upload !== undefined ? newVal.employee_can_upload : true,
      is_hr_only: newVal.is_hr_only || false,
      allowed_file_types: newVal.allowed_file_types || [],
      max_file_size_mb: newVal.max_file_size_mb || 10,
      target_departments: newVal.target_departments || [],
      target_designations: newVal.target_designations || [],
      is_active: newVal.is_active !== undefined ? newVal.is_active : true
    }
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.show, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

const handleSubmit = async () => {
  saving.value = true
  
  try {
    const data = {
      ...formData.value,
      allowed_file_types: formData.value.allowed_file_types.length > 0 ? formData.value.allowed_file_types : null,
      target_departments: formData.value.target_departments.length > 0 ? formData.value.target_departments : null,
      target_designations: formData.value.target_designations.length > 0 ? formData.value.target_designations : null
    }

    if (props.documentType) {
      await documentTypesStore.updateDocumentType(props.documentType.id, data)
      showSuccess('Document type updated successfully')
    } else {
      await documentTypesStore.createDocumentType(data)
      showSuccess('Document type created successfully')
    }
    
    emit('save')
  } catch (err) {
    showError(err.message || 'Failed to save document type')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    departmentsStore.fetchDepartments({ per_page: 100, is_active: true }),
    designationsStore.fetchDesignations({ per_page: 100, is_active: true })
  ])
})
</script>

