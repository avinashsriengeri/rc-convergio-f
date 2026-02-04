import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

// Payslip interface
const createPayslip = (data = {}) => ({
  id: null,
  payslip_number: null,
  employee_id: null,
  employee: null,
  pay_period_start: null,
  pay_period_end: null,
  uploaded_by: null,
  uploaded_at: null,
  document_id: null,
  created_at: null,
  updated_at: null,
  ...data
})

// Filters interface
const createFilters = (data = {}) => ({
  employee_id: null,
  year: null,
  month: null,
  sortBy: 'pay_period_start',
  sortOrder: 'desc',
  page: 1,
  per_page: 15,
  ...data
})

export const useHrPayslipsStore = defineStore('hrPayslips', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    payslips: [],
    selectedPayslip: null,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },
    filters: createFilters()
  })

  // Getters
  const payslips = computed(() => state.value.payslips)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const selectedPayslip = computed(() => state.value.selectedPayslip)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)

  const payslipsByYear = computed(() => {
    const grouped = {}
    state.value.payslips.forEach(payslip => {
      const year = new Date(payslip.pay_period_start).getFullYear()
      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(payslip)
    })
    return grouped
  })

  // Actions
  const fetchPayslips = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      state.value.filters = mergedFilters
      
      const response = await hrAPI.getPayslips(mergedFilters)
      
      if (response.data.success) {
        state.value.payslips = response.data.data || []
        state.value.meta = response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch payslips')
      }
    } catch (err) {
      console.error('Error fetching payslips:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch payslips'
      state.value.payslips = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchPayslip = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getPayslip(id)
      
      if (response.data.success) {
        state.value.selectedPayslip = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Payslip not found')
      }
    } catch (err) {
      console.error('Error fetching payslip:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch payslip'
      state.value.selectedPayslip = null
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const uploadPayslip = async (payslipData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.uploadPayslip(payslipData)
      
      if (response.data.success) {
        const newPayslip = response.data.data
        state.value.payslips.unshift(newPayslip)
        return newPayslip
      } else {
        throw new Error(response.data.message || 'Failed to upload payslip')
      }
    } catch (err) {
      console.error('Error uploading payslip:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to upload payslip'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const downloadPayslip = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.downloadPayslip(id)
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition']
      let filename = 'payslip.pdf'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }
      
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return true
    } catch (err) {
      console.error('Error downloading payslip:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to download payslip'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deletePayslip = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.deletePayslip(id)
      
      if (response.data.success) {
        const index = state.value.payslips.findIndex(p => p.id === id)
        if (index !== -1) {
          state.value.payslips.splice(index, 1)
        }
        if (state.value.selectedPayslip?.id === id) {
          state.value.selectedPayslip = null
        }
        return true
      } else {
        throw new Error(response.data.message || 'Failed to delete payslip')
      }
    } catch (err) {
      console.error('Error deleting payslip:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to delete payslip'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const fetchEmployeePayslips = async (employeeId, params = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getEmployeePayslips(employeeId, params)
      
      if (response.data.success) {
        state.value.payslips = response.data.data || []
        state.value.meta = response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch employee payslips')
      }
    } catch (err) {
      console.error('Error fetching employee payslips:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch employee payslips'
      state.value.payslips = []
    } finally {
      state.value.loading = false
    }
  }

  const setFilters = (newFilters) => {
    state.value.filters = { ...state.value.filters, ...newFilters }
  }

  const resetFilters = () => {
    state.value.filters = createFilters()
  }

  const clearSelectedPayslip = () => {
    state.value.selectedPayslip = null
  }

  return {
    // State
    payslips,
    loading,
    error,
    selectedPayslip,
    meta,
    filters,
    // Getters
    payslipsByYear,
    // Actions
    fetchPayslips,
    fetchPayslip,
    uploadPayslip,
    downloadPayslip,
    deletePayslip,
    fetchEmployeePayslips,
    setFilters,
    resetFilters,
    clearSelectedPayslip
  }
})


