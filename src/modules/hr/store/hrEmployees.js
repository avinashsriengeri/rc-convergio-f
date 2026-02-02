import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

// Employment Status Constants
const EmploymentStatus = {
  ONBOARDING: 'onboarding',
  ACTIVE: 'active',
  ON_LEAVE: 'on_leave',
  SUSPENDED: 'suspended',
  OFFBOARDED: 'offboarded'
}

// Employment Type Constants
const EmploymentType = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  INTERN: 'intern'
}

// Employee interface
const createEmployee = (data = {}) => ({
  id: null,
  employee_id: null,
  first_name: '',
  last_name: '',
  full_name: '',
  work_email: '',
  personal_email: null,
  phone_number: '',
  job_title: '',
  department: '',
  employment_type: EmploymentType.FULL_TIME,
  employment_status: EmploymentStatus.ONBOARDING,
  start_date: null,
  end_date: null,
  manager_id: null,
  manager: null,
  team_id: null,
  team: null,
  user_id: null,
  user: null,
  archived_at: null,
  created_at: null,
  updated_at: null,
  ...data
})

// Filters interface
const createFilters = (data = {}) => ({
  search: '',
  department: '',
  employment_status: 'all',
  employment_type: 'all',
  include_archived: false,
  sortBy: 'created_at',
  sortOrder: 'desc',
  page: 1,
  per_page: 15,
  ...data
})

export const useHrEmployeesStore = defineStore('hrEmployees', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    employees: [],
    selectedEmployee: null,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },
    filters: createFilters()
  })

  // Getters
  const employees = computed(() => state.value.employees)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const selectedEmployee = computed(() => state.value.selectedEmployee)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)

  const activeEmployees = computed(() =>
    state.value.employees.filter(emp => emp.employment_status === EmploymentStatus.ACTIVE)
  )

  const employeesByDepartment = computed(() => {
    const grouped = {}
    state.value.employees.forEach(emp => {
      const dept = emp.department || 'Unassigned'
      if (!grouped[dept]) {
        grouped[dept] = []
      }
      grouped[dept].push(emp)
    })
    return grouped
  })

  // Actions
  const fetchEmployees = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      state.value.filters = mergedFilters
      
      const response = await hrAPI.getEmployees(mergedFilters)
      
      if (response.data.success) {
        state.value.employees = response.data.data || []
        state.value.meta = response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch employees')
      }
    } catch (err) {
      console.error('Error fetching employees:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch employees'
      state.value.employees = []
    } finally {
      state.value.loading = false
    }
  }

  const searchEmployees = async (query) => {
    if (!query || query.trim() === '') {
      await fetchEmployees()
      return
    }

    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.searchEmployees(query)
      
      if (response.data.success) {
        state.value.employees = response.data.data || []
      } else {
        throw new Error(response.data.message || 'Failed to search employees')
      }
    } catch (err) {
      console.error('Error searching employees:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to search employees'
      state.value.employees = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchEmployee = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getEmployee(id)
      
      if (response.data.success) {
        state.value.selectedEmployee = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Employee not found')
      }
    } catch (err) {
      console.error('Error fetching employee:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch employee'
      state.value.selectedEmployee = null
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const createEmployee = async (employeeData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      // hrAPI.createEmployee handles FormData conversion automatically
      const response = await hrAPI.createEmployee(employeeData)
      
      if (response.data.success) {
        const newEmployee = response.data.data
        state.value.employees.unshift(newEmployee)
        return newEmployee
      } else {
        throw new Error(response.data.message || 'Failed to create employee')
      }
    } catch (err) {
      console.error('Error creating employee:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to create employee'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateEmployee = async (id, employeeData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.updateEmployee(id, employeeData)
      
      if (response.data.success) {
        const updatedEmployee = response.data.data
        const index = state.value.employees.findIndex(emp => emp.id === id)
        if (index !== -1) {
          state.value.employees[index] = updatedEmployee
        }
        if (state.value.selectedEmployee?.id === id) {
          state.value.selectedEmployee = updatedEmployee
        }
        return updatedEmployee
      } else {
        throw new Error(response.data.message || 'Failed to update employee')
      }
    } catch (err) {
      console.error('Error updating employee:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to update employee'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const activateEmployee = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.activateEmployee(id)
      
      if (response.data.success) {
        const updatedEmployee = response.data.data
        const index = state.value.employees.findIndex(emp => emp.id === id)
        if (index !== -1) {
          state.value.employees[index] = { ...state.value.employees[index], ...updatedEmployee }
        }
        if (state.value.selectedEmployee?.id === id) {
          state.value.selectedEmployee = { ...state.value.selectedEmployee, ...updatedEmployee }
        }
        return updatedEmployee
      } else {
        throw new Error(response.data.message || 'Failed to activate employee')
      }
    } catch (err) {
      console.error('Error activating employee:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to activate employee'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const archiveEmployee = async (id, archiveData = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.archiveEmployee(id, archiveData)
      
      if (response.data.success) {
        // Remove from list or mark as archived
        const index = state.value.employees.findIndex(emp => emp.id === id)
        if (index !== -1) {
          if (state.value.filters.include_archived) {
            state.value.employees[index] = { ...state.value.employees[index], archived_at: new Date().toISOString() }
          } else {
            state.value.employees.splice(index, 1)
          }
        }
        if (state.value.selectedEmployee?.id === id) {
          state.value.selectedEmployee = null
        }
        return true
      } else {
        throw new Error(response.data.message || 'Failed to archive employee')
      }
    } catch (err) {
      console.error('Error archiving employee:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to archive employee'
      throw err
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

  const clearSelectedEmployee = () => {
    state.value.selectedEmployee = null
  }

  return {
    // State
    employees,
    loading,
    error,
    selectedEmployee,
    meta,
    filters,
    // Getters
    activeEmployees,
    employeesByDepartment,
    // Actions
    fetchEmployees,
    searchEmployees,
    fetchEmployee,
    createEmployee,
    updateEmployee,
    activateEmployee,
    archiveEmployee,
    setFilters,
    resetFilters,
    clearSelectedEmployee
  }
})

