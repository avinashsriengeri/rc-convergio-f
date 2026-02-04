<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Assign KPI to Employees</h1>
        <p class="mt-2 text-lg text-gray-600">Distribute KPI templates to employees or departments</p>
      </div>
    </div>

    <!-- Assignment Form -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 p-8">
      <form @submit.prevent="handleSubmit">
        <!-- Step 1: Select KPI Template -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Step 1: Select KPI Template</h2>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Template *</label>
            <select
              v-model="formData.kpi_template_id"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              @change="onTemplateChange"
            >
              <option value="">Select KPI Template</option>
              <option v-for="template in templates" :key="template.id" :value="template.id">
                {{ template.name }}
                <span v-if="template.department"> - {{ template.department.name }}</span>
                <span v-if="template.designation"> ({{ template.designation.name }})</span>
              </option>
            </select>
          </div>

          <!-- Template Details Preview -->
          <div v-if="selectedTemplate" class="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-sm font-semibold text-gray-700 mb-2">Template Details:</h3>
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span class="font-medium">Review Period:</span>
                <span class="ml-2 capitalize">{{ selectedTemplate.review_period }}</span>
              </div>
              <div>
                <span class="font-medium">Total Items:</span>
                <span class="ml-2">{{ selectedTemplate.items?.length || 0 }} KPIs</span>
              </div>
              <div v-if="selectedTemplate.department" class="col-span-2">
                <span class="font-medium">Applies To:</span>
                <span class="ml-2">
                  {{ selectedTemplate.department.name }}
                  <span v-if="selectedTemplate.designation"> ({{ selectedTemplate.designation.name }})</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Select Target & Period -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Step 2: Select Target & Period</h2>
          
          <!-- Assign To -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-3">Assign To *</label>
            <div class="space-y-3">
              <label class="flex items-center">
                <input
                  v-model="assignToType"
                  type="radio"
                  value="all"
                  class="h-4 w-4 text-primary-purple focus:ring-primary-purple border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">All Employees</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="assignToType"
                  type="radio"
                  value="individual"
                  class="h-4 w-4 text-primary-purple focus:ring-primary-purple border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">Individual Employee</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="assignToType"
                  type="radio"
                  value="department"
                  class="h-4 w-4 text-primary-purple focus:ring-primary-purple border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">Department</span>
              </label>
            </div>

            <!-- Individual Employee Selector -->
            <div v-if="assignToType === 'individual'" class="mt-4">
              <select
                v-model="formData.employee_ids"
                multiple
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                size="5"
              >
                <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                  {{ emp.full_name }} ({{ emp.employee_id }})
                </option>
              </select>
              <p class="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple employees</p>
            </div>

            <!-- Department Selector -->
            <div v-if="assignToType === 'department'" class="mt-4">
              <select
                v-model="selectedDepartmentId"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                @change="onDepartmentChange"
              >
                <option value="">Select Department</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
              </select>
            </div>
          </div>

          <!-- Review Period -->
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Period Value *</label>
              <input
                v-model="formData.review_period_value"
                type="text"
                required
                placeholder="e.g. Q1 2026"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
              <input
                v-model="formData.review_period_start"
                type="date"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
              <input
                v-model="formData.review_period_end"
                type="date"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Target Audience Preview -->
        <div v-if="targetAudienceCount > 0" class="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 class="text-sm font-semibold text-blue-900 mb-2">
            Target Audience Preview ({{ targetAudienceCount }} Employee{{ targetAudienceCount !== 1 ? 's' : '' }})
          </h3>
          <p class="text-xs text-blue-700">
            The KPI template will be assigned to {{ targetAudienceCount }} employee(s) for the selected review period.
          </p>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="$router.push('/hr/kpi/templates')"
            class="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting || !canSubmit"
            class="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {{ submitting ? 'Assigning...' : 'Assign KPI' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showConfirmModal = false"
    >
      <div
        class="relative top-20 mx-auto p-8 border w-full max-w-md shadow-xl rounded-xl bg-white"
        @click.stop
      >
        <h3 class="text-xl font-bold text-gray-900 mb-4">Confirm Assignment</h3>
        <p class="text-sm text-gray-600 mb-6">
          Are you sure you want to assign the "{{ selectedTemplate?.name }}" KPI template to 
          {{ targetAudienceCount }} employee(s){{ selectedDepartmentId ? ` in the ${selectedDepartment?.name} department` : '' }} 
          for {{ formData.review_period_value }}?
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showConfirmModal = false"
            class="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmAssignment"
            :disabled="submitting"
            class="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          >
            Yes, Assign KPI
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHrKpiTemplatesStore } from '../store/hrKpiTemplates'
import { useHrEmployeesStore } from '../store/hrEmployees'
import { useHrDepartmentsStore } from '../store/hrDepartments'
import { success as showSuccess, error as showError } from '@/utils/notifications'
import { hrAPI } from '../api/hrAPI'

const templatesStore = useHrKpiTemplatesStore()
const employeesStore = useHrEmployeesStore()
const departmentsStore = useHrDepartmentsStore()

const assignToType = ref('all')
const selectedDepartmentId = ref(null)
const showConfirmModal = ref(false)
const submitting = ref(false)

const formData = ref({
  kpi_template_id: null,
  employee_ids: [],
  review_period_value: '',
  review_period_start: '',
  review_period_end: ''
})

const templates = computed(() => templatesStore.templates.filter(t => t.status === 'published'))
const employees = computed(() => employeesStore.employees)
const departments = computed(() => departmentsStore.activeDepartments)
const selectedTemplate = computed(() => {
  if (!formData.value.kpi_template_id) return null
  return templates.value.find(t => t.id === formData.value.kpi_template_id)
})
const selectedDepartment = computed(() => {
  if (!selectedDepartmentId.value) return null
  return departments.value.find(d => d.id === selectedDepartmentId.value)
})

const targetAudienceCount = computed(() => {
  if (assignToType.value === 'individual') {
    return formData.value.employee_ids.length
  } else if (assignToType.value === 'department' && selectedDepartmentId.value) {
    return employees.value.filter(e => e.department_id === selectedDepartmentId.value).length
  } else if (assignToType.value === 'all') {
    return employees.value.length
  }
  return 0
})

const canSubmit = computed(() => {
  return formData.value.kpi_template_id &&
    formData.value.review_period_value &&
    formData.value.review_period_start &&
    formData.value.review_period_end &&
    (assignToType.value === 'all' || 
     (assignToType.value === 'individual' && formData.value.employee_ids.length > 0) ||
     (assignToType.value === 'department' && selectedDepartmentId.value))
})

const onTemplateChange = () => {
  // Template changed
}

const onDepartmentChange = () => {
  if (selectedDepartmentId.value) {
    // Get employees for this department
    const deptEmployees = employees.value.filter(e => e.department_id === selectedDepartmentId.value)
    formData.value.employee_ids = deptEmployees.map(e => e.id)
  } else {
    formData.value.employee_ids = []
  }
}

const handleSubmit = () => {
  if (!canSubmit.value) {
    showError('Please fill in all required fields')
    return
  }
  showConfirmModal.value = true
}

const confirmAssignment = async () => {
  submitting.value = true

  try {
    // Get employee IDs based on assignment type
    let employeeIds = []
    if (assignToType.value === 'all') {
      employeeIds = employees.value.map(e => e.id)
    } else if (assignToType.value === 'department' && selectedDepartmentId.value) {
      employeeIds = employees.value.filter(e => e.department_id === selectedDepartmentId.value).map(e => e.id)
    } else if (assignToType.value === 'individual') {
      employeeIds = formData.value.employee_ids
    }

    if (employeeIds.length === 0) {
      throw new Error('No employees selected for assignment')
    }

    const assignmentData = {
      kpi_template_id: formData.value.kpi_template_id,
      employee_ids: employeeIds,
      review_period_value: formData.value.review_period_value,
      review_period_start: formData.value.review_period_start,
      review_period_end: formData.value.review_period_end
    }

    const response = await hrAPI.assignKpiTemplate(assignmentData)

    if (response.data.success) {
      showSuccess(`KPI template assigned to ${response.data.data.length} employee(s) successfully`)
      showConfirmModal.value = false
      // Reset form
      formData.value = {
        kpi_template_id: null,
        employee_ids: [],
        review_period_value: '',
        review_period_start: '',
        review_period_end: ''
      }
      assignToType.value = 'all'
      selectedDepartmentId.value = null
    } else {
      throw new Error(response.data.message || 'Failed to assign template')
    }
  } catch (err) {
    showError(err.response?.data?.message || err.message || 'Failed to assign KPI template')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    templatesStore.fetchTemplates({ status: 'published', per_page: 100 }),
    employeesStore.fetchEmployees({ per_page: 100 }),
    departmentsStore.fetchDepartments({ per_page: 100, is_active: true })
  ])
})
</script>

