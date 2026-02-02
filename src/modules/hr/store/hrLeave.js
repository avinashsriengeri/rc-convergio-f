import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

// Leave Request Status Constants
const LeaveStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
}

// Leave Balance interface
const createLeaveBalance = (data = {}) => ({
  id: null,
  employee_id: null,
  leave_type_id: null,
  balance: 0,
  accrued_this_year: 0,
  used_this_year: 0,
  last_accrual_date: null,
  employee: null,
  leave_type: null,
  ...data
})

// Leave Request interface
const createLeaveRequest = (data = {}) => ({
  id: null,
  employee_id: null,
  employee: null,
  leave_type_id: null,
  leave_type: null,
  start_date: null,
  end_date: null,
  days_requested: 0,
  reason: '',
  status: LeaveStatus.PENDING,
  approved_by: null,
  approved_at: null,
  created_at: null,
  updated_at: null,
  ...data
})

// Filters interface
const createFilters = (data = {}) => ({
  employee_id: null,
  leave_type_id: null,
  status: 'all',
  start_date: null,
  end_date: null,
  sortBy: 'created_at',
  sortOrder: 'desc',
  page: 1,
  per_page: 15,
  ...data
})

export const useHrLeaveStore = defineStore('hrLeave', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    leaveBalances: [],
    leaveRequests: [],
    leaveTypes: [],
    leaveCalendar: [],
    selectedLeaveRequest: null,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },
    filters: createFilters()
  })

  // Getters
  const leaveBalances = computed(() => state.value.leaveBalances)
  const leaveRequests = computed(() => state.value.leaveRequests)
  const leaveTypes = computed(() => state.value.leaveTypes)
  const leaveCalendar = computed(() => state.value.leaveCalendar)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const selectedLeaveRequest = computed(() => state.value.selectedLeaveRequest)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)

  const approvedRequests = computed(() =>
    state.value.leaveRequests.filter(req => req.status === LeaveStatus.APPROVED)
  )

  const pendingRequests = computed(() =>
    state.value.leaveRequests.filter(req => req.status === LeaveStatus.PENDING)
  )

  // Actions
  const fetchLeaveBalances = async (params = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getLeaveBalances(params)
      
      if (response.data.success) {
        state.value.leaveBalances = response.data.data || []
      } else {
        throw new Error(response.data.message || 'Failed to fetch leave balances')
      }
    } catch (err) {
      console.error('Error fetching leave balances:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch leave balances'
      state.value.leaveBalances = []
    } finally {
      state.value.loading = false
    }
  }

  const adjustLeaveBalance = async (adjustmentData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.adjustLeaveBalance(adjustmentData)
      
      if (response.data.success) {
        // Refresh balances after adjustment
        await fetchLeaveBalances({ employee_id: adjustmentData.employee_id })
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to adjust leave balance')
      }
    } catch (err) {
      console.error('Error adjusting leave balance:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to adjust leave balance'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const fetchLeaveRequests = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      state.value.filters = mergedFilters
      
      const response = await hrAPI.getLeaveRequests(mergedFilters)
      
      if (response.data.success) {
        state.value.leaveRequests = response.data.data || []
        state.value.meta = response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch leave requests')
      }
    } catch (err) {
      console.error('Error fetching leave requests:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch leave requests'
      state.value.leaveRequests = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchLeaveRequest = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getLeaveRequest(id)
      
      if (response.data.success) {
        state.value.selectedLeaveRequest = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Leave request not found')
      }
    } catch (err) {
      console.error('Error fetching leave request:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch leave request'
      state.value.selectedLeaveRequest = null
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const createLeaveRequest = async (requestData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.createLeaveRequest(requestData)
      
      if (response.data.success) {
        const newRequest = response.data.data
        state.value.leaveRequests.unshift(newRequest)
        // Refresh balances after creating request
        await fetchLeaveBalances({ employee_id: requestData.employee_id })
        return newRequest
      } else {
        throw new Error(response.data.message || 'Failed to create leave request')
      }
    } catch (err) {
      console.error('Error creating leave request:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to create leave request'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const cancelLeaveRequest = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.cancelLeaveRequest(id)
      
      if (response.data.success) {
        const index = state.value.leaveRequests.findIndex(req => req.id === id)
        if (index !== -1) {
          state.value.leaveRequests[index] = { ...state.value.leaveRequests[index], status: LeaveStatus.CANCELLED }
        }
        // Refresh balances after cancellation
        if (state.value.selectedLeaveRequest?.id === id) {
          await fetchLeaveBalances({ employee_id: state.value.selectedLeaveRequest.employee_id })
        }
        return true
      } else {
        throw new Error(response.data.message || 'Failed to cancel leave request')
      }
    } catch (err) {
      console.error('Error cancelling leave request:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to cancel leave request'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const fetchLeaveCalendar = async (params = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getLeaveCalendar(params)
      
      if (response.data.success) {
        state.value.leaveCalendar = response.data.data || []
      } else {
        throw new Error(response.data.message || 'Failed to fetch leave calendar')
      }
    } catch (err) {
      console.error('Error fetching leave calendar:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch leave calendar'
      state.value.leaveCalendar = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchLeaveTypes = async () => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getLeaveTypes()
      
      if (response.data.success) {
        state.value.leaveTypes = response.data.data || []
      } else {
        throw new Error(response.data.message || 'Failed to fetch leave types')
      }
    } catch (err) {
      console.error('Error fetching leave types:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch leave types'
      state.value.leaveTypes = []
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

  const clearSelectedLeaveRequest = () => {
    state.value.selectedLeaveRequest = null
  }

  return {
    // State
    leaveBalances,
    leaveRequests,
    leaveTypes,
    leaveCalendar,
    loading,
    error,
    selectedLeaveRequest,
    meta,
    filters,
    // Getters
    approvedRequests,
    pendingRequests,
    // Actions
    fetchLeaveBalances,
    adjustLeaveBalance,
    fetchLeaveRequests,
    fetchLeaveRequest,
    createLeaveRequest,
    cancelLeaveRequest,
    fetchLeaveCalendar,
    fetchLeaveTypes,
    setFilters,
    resetFilters,
    clearSelectedLeaveRequest
  }
})

