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
        <h3 class="text-2xl font-bold text-gray-900">
          {{ template ? 'Edit KPI Template' : 'Create KPI Template' }}
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
      
      <form @submit.prevent="handleSubmit(false)">
        <div class="space-y-6">
          <!-- Template Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Template Name *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              placeholder="e.g. Sales Executive Q1 Targets"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            />
          </div>

          <!-- Department & Designation -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Department</label>
              <select
                v-model="formData.department_id"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              >
                <option :value="null">Select Department (Optional)</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
              <select
                v-model="formData.designation_id"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              >
                <option :value="null">Select Designation (Optional)</option>
                <option v-for="desg in designations" :key="desg.id" :value="desg.id">{{ desg.name }}</option>
              </select>
            </div>
          </div>

          <!-- Review Period -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Review Period *
            </label>
            <select
              v-model="formData.review_period"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            >
              <option value="">Select Review Period</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="once">Once</option>
            </select>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Brief description of this template"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            ></textarea>
          </div>

          <!-- KPI Items -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <label class="block text-sm font-semibold text-gray-700">KPI Items *</label>
              <button
                type="button"
                @click="addKpiItem"
                class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-primary-purple bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add KPI
              </button>
            </div>

            <div class="space-y-3">
              <div class="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-500 uppercase">
                <div class="col-span-5">KPI NAME</div>
                <div class="col-span-2">WEIGHT (%)</div>
                <div class="col-span-4">DESCRIPTION / TARGET</div>
                <div class="col-span-1"></div>
              </div>

              <KpiItemRow
                v-for="(item, index) in formData.items"
                :key="index"
                :item="item"
                @update:item="updateKpiItem(index, $event)"
                @remove="removeKpiItem(index)"
              />
            </div>

            <!-- Weight Progress Bar -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
              <KpiWeightProgressBar :total-weight="totalWeight" />
            </div>
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
            type="button"
            @click="saveDraft"
            :disabled="totalWeight !== 100 || submitting"
            class="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            @click="handleSubmit(false)"
            :disabled="totalWeight !== 100 || submitting"
            class="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {{ submitting ? 'Saving...' : 'Publish Template' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useHrKpiTemplatesStore } from '../store/hrKpiTemplates'
import { useHrDepartmentsStore } from '../store/hrDepartments'
import { useHrDesignationsStore } from '../store/hrDesignations'
import { success as showSuccess, error as showError } from '@/utils/notifications'
import KpiItemRow from './KpiItemRow.vue'
import KpiWeightProgressBar from './KpiWeightProgressBar.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  template: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const templatesStore = useHrKpiTemplatesStore()
const departmentsStore = useHrDepartmentsStore()
const designationsStore = useHrDesignationsStore()

const submitting = ref(false)

const departments = computed(() => departmentsStore.activeDepartments)
const designations = computed(() => designationsStore.activeDesignations)

const formData = ref({
  name: '',
  department_id: null,
  designation_id: null,
  review_period: '',
  description: '',
  status: 'draft',
  items: [
    {
      name: '',
      weight: 0,
      description: ''
    }
  ]
})

const totalWeight = computed(() => {
  return formData.value.items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0)
})

const resetForm = () => {
  formData.value = {
    name: '',
    department_id: null,
    designation_id: null,
    review_period: '',
    description: '',
    status: 'draft',
    items: [
      {
        name: '',
        weight: 0,
        description: ''
      }
    ]
  }
}

watch(() => props.template, (newTemplate) => {
  if (newTemplate) {
    formData.value = {
      name: newTemplate.name || '',
      department_id: newTemplate.department_id || null,
      designation_id: newTemplate.designation_id || null,
      review_period: newTemplate.review_period || '',
      description: newTemplate.description || '',
      status: newTemplate.status || 'draft',
      items: newTemplate.items?.map(item => ({
        name: item.name || '',
        weight: parseFloat(item.weight) || 0,
        description: item.description || ''
      })) || [{ name: '', weight: 0, description: '' }]
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

const addKpiItem = () => {
  formData.value.items.push({
    name: '',
    weight: 0,
    description: ''
  })
}

const updateKpiItem = (index, updatedItem) => {
  formData.value.items[index] = { ...updatedItem }
}

const removeKpiItem = (index) => {
  if (formData.value.items.length > 1) {
    formData.value.items.splice(index, 1)
  }
}

const saveDraft = async () => {
  await handleSubmit(true)
}

const handleSubmit = async (isDraft = false) => {
  if (totalWeight.value !== 100) {
    showError(`Total weight must equal exactly 100%. Current total: ${totalWeight.value.toFixed(1)}%`)
    return
  }

  submitting.value = true

  try {
    const templateData = {
      name: formData.value.name,
      department_id: formData.value.department_id,
      designation_id: formData.value.designation_id,
      review_period: formData.value.review_period,
      description: formData.value.description,
      status: isDraft ? 'draft' : 'published',
      items: formData.value.items.map(item => ({
        name: item.name,
        weight: parseFloat(item.weight),
        description: item.description
      }))
    }

    if (props.template) {
      await templatesStore.updateTemplate(props.template.id, templateData)
      showSuccess('Template updated successfully')
    } else {
      await templatesStore.createTemplate(templateData)
      showSuccess('Template created successfully')
    }

    emit('save')
  } catch (err) {
    showError(err.message || 'Failed to save template')
  } finally {
    submitting.value = false
  }
}
</script>

