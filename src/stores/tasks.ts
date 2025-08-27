import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tasksAPI } from '../services/api'
import type { Task, TaskFilters, TasksSummary, PaginationMeta, LoadingState, TaskFormData } from '../types'

// API Response interfaces
interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  message?: string
}

interface TasksApiResponse extends ApiResponse<Task[]> {}
interface TaskApiResponse extends ApiResponse<Task> {}
interface SummaryApiResponse extends ApiResponse<TasksSummary> {}

interface TasksState extends LoadingState {
  tasks: Task[]
  meta: PaginationMeta
  filters: TaskFilters
  summary: TasksSummary | null
  selectedTask: Task | null
}

// Environment variable type declaration
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_BASE_URL?: string
    }
  }
}

export const useTasksStore = defineStore('tasks', () => {
  // State
  const state = ref<TasksState>({
    loading: false,
    error: null,
    tasks: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    },
    filters: {
      search: '',
      status: 'all',
      priority: 'all',
      assignee_id: undefined,
      owner_id: undefined,
      due_date_from: undefined,
      due_date_to: undefined,
      sort: '-created_at',
      page: 1,
      per_page: 15
    },
    summary: null,
    selectedTask: null
  })

  // Getters
  const tasks = computed(() => state.value.tasks)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)
  const summary = computed(() => state.value.summary)
  const selectedTask = computed(() => state.value.selectedTask)

  const pendingTasks = computed(() => 
    state.value.tasks.filter(task => task.status === 'pending')
  )

  const completedTasks = computed(() => 
    state.value.tasks.filter(task => task.status === 'completed')
  )

  const overdueTasks = computed(() => 
    state.value.tasks.filter(task => {
      if (task.status === 'completed') return false
      if (!task.due_date) return false
      return new Date(task.due_date) < new Date()
    })
  )

  const todayTasks = computed(() => 
    state.value.tasks.filter(task => {
      if (!task.due_date) return false
      const today = new Date().toISOString().split('T')[0]
      return task.due_date === today
    })
  )

  const upcomingTasks = computed(() => 
    state.value.tasks.filter(task => {
      if (task.status === 'completed') return false
      if (!task.due_date) return false
      const today = new Date()
      const dueDate = new Date(task.due_date)
      return dueDate > today && dueDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    })
  )

  const tasksByPriority = computed(() => {
    const grouped: Record<string, Task[]> = {
      high: [],
      medium: [],
      low: []
    }
    state.value.tasks.forEach(task => {
      if (grouped[task.priority]) {
        grouped[task.priority].push(task)
      }
    })
    return grouped
  })

  const tasksByAssignee = computed(() => {
    const grouped: Record<number, Task[]> = {}
    state.value.tasks.forEach(task => {
      if (task.assignee_id) {
        if (!grouped[task.assignee_id]) {
          grouped[task.assignee_id] = []
        }
        grouped[task.assignee_id].push(task)
      }
    })
    return grouped
  })

  const tasksByOwner = computed(() => {
    const grouped: Record<number, Task[]> = {}
    state.value.tasks.forEach(task => {
      if (!grouped[task.owner_id]) {
        grouped[task.owner_id] = []
      }
      grouped[task.owner_id].push(task)
    })
    return grouped
  })

  // Actions
  const fetchTasks = async (newFilters?: Partial<TaskFilters>): Promise<void> => {
    // If newFilters provided, use them directly (already normalized by view)
    // Otherwise, use current state filters
    const filtersToUse = newFilters || state.value.filters
    
    // Update state filters if new ones provided
    if (newFilters) {
      state.value.filters = { ...state.value.filters, ...newFilters }
    }

    state.value.loading = true
    state.value.error = null

    try {
      console.log('Fetching tasks with filters:', filtersToUse)
      const response = await tasksAPI.getTasks(filtersToUse)
      console.log('Tasks API response:', response)
      
      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        // Direct array response
        state.value.tasks = response.data
        console.log('Using direct array response')
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Nested data structure
        state.value.tasks = response.data.data
        state.value.meta = response.data.meta || state.value.meta
        console.log('Using nested data structure')
      } else {
        // Empty or unexpected structure
        state.value.tasks = []
        console.log('Empty or unexpected response structure')
      }
      
      console.log('Tasks loaded:', state.value.tasks.length)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }, status?: number }, config?: any }
      state.value.error = error.response?.data?.message || 'Failed to fetch tasks'
      console.error('Error fetching tasks:', err)
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
      
      // Keep tasks empty when API fails
      state.value.tasks = []
      state.value.meta.total = 0
    } finally {
      state.value.loading = false
    }
  }

  const fetchTask = async (id: number): Promise<Task | null> => {
    try {
      console.log('Fetching task from API:', id)
      const response = await tasksAPI.getTask(id)
      const task = response.data.data
      state.value.selectedTask = task
      console.log('Task fetched from API:', task)
      return task
    } catch (err: unknown) {
      console.error('Error fetching task from API:', err)
      return null
    }
  }

  const createTask = async (data: TaskFormData): Promise<Task> => {
    state.value.loading = true
    state.value.error = null

    try {
      console.log('Creating task with data:', data)
      
      // Prepare payload - only include owner_id if explicitly provided
      const payload = { ...data }
      if (!payload.owner_id) {
        delete payload.owner_id
      }
      
      // Call the backend API
      const response = await tasksAPI.createTask(payload)
      console.log('Create task response:', response)
      const newTask = response.data.data
      console.log('New task created from API:', newTask)
      
      // Add the new task to the list
      state.value.tasks.unshift(newTask)
      state.value.meta.total += 1
      
      return newTask
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }, status?: number }, config?: any }
      console.error('API create failed:', err)
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
      
      state.value.error = error.response?.data?.message || 'Failed to create task'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateTask = async (id: number, data: Partial<TaskFormData>): Promise<Task> => {
    state.value.loading = true
    state.value.error = null

    try {
      console.log('Updating task with data:', data)
      console.log('Task ID:', id)
      
      // Prepare payload - only include owner_id if explicitly provided
      const payload = { ...data }
      if (!payload.owner_id) {
        delete payload.owner_id
      }
      
      // Call the backend API
      const response = await tasksAPI.updateTask(id, payload)
      console.log('Update task response:', response)
      const updatedTask = response.data.data
      console.log('Updated task from API:', updatedTask)
      
      // Update in list
      const index = state.value.tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        state.value.tasks[index] = updatedTask
        console.log('Updated task in local list')
      }
      
      // Update selected task if it's the same
      if (state.value.selectedTask?.id === id) {
        state.value.selectedTask = updatedTask
        console.log('Updated selected task')
      }
      
      return updatedTask
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }, status?: number }, config?: any }
      console.error('API update failed:', err)
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
      
      state.value.error = error.response?.data?.message || 'Failed to update task'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteTask = async (id: number): Promise<void> => {
    state.value.loading = true
    state.value.error = null

    try {
      await tasksAPI.deleteTask(id)
      
      // Remove from list
      const index = state.value.tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        state.value.tasks.splice(index, 1)
        state.value.meta.total -= 1
      }
      
      // Clear selected task if it's the same
      if (state.value.selectedTask?.id === id) {
        state.value.selectedTask = null
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      state.value.error = error.response?.data?.message || 'Failed to delete task'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const completeTask = async (id: number): Promise<Task> => {
    try {
      const response = await tasksAPI.completeTask(id)
      const updatedTask = response.data.data
      
      // Update in list
      const index = state.value.tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        state.value.tasks[index] = updatedTask
      }
      
      // Update selected task if it's the same
      if (state.value.selectedTask?.id === id) {
        state.value.selectedTask = updatedTask
      }
      
      return updatedTask
    } catch (err: unknown) {
      console.error('Error completing task:', err)
      throw err
    }
  }

  const fetchTasksByAssignee = async (assigneeId: number): Promise<Task[]> => {
    try {
      const response = await tasksAPI.getTasksByAssignee(assigneeId)
      return response.data.data
    } catch (err: unknown) {
      console.error('Error fetching tasks by assignee:', err)
      return []
    }
  }

  const fetchTasksByOwner = async (ownerId: number): Promise<Task[]> => {
    try {
      const response = await tasksAPI.getTasksByOwner(ownerId)
      return response.data.data
    } catch (err: unknown) {
      console.error('Error fetching tasks by owner:', err)
      return []
    }
  }

  const fetchTodayTasks = async (): Promise<Task[]> => {
    try {
      const response = await tasksAPI.getTodayTasks()
      return response.data.data
    } catch (err: unknown) {
      console.error('Error fetching today tasks:', err)
      return []
    }
  }

  const fetchOverdueTasks = async (): Promise<Task[]> => {
    try {
      const response = await tasksAPI.getOverdueTasks()
      return response.data.data
    } catch (err: unknown) {
      console.error('Error fetching overdue tasks:', err)
      return []
    }
  }

  const fetchUpcomingTasks = async (days: number = 7): Promise<Task[]> => {
    try {
      const response = await tasksAPI.getUpcomingTasks(days)
      return response.data.data
    } catch (err: unknown) {
      console.error('Error fetching upcoming tasks:', err)
      return []
    }
  }

  const bulkUpdate = async (taskIds: number[], data: Partial<TaskFormData>): Promise<any> => {
    try {
      const response = await tasksAPI.bulkUpdate(taskIds, data)
      
      // Update tasks in list
      taskIds.forEach(taskId => {
        const index = state.value.tasks.findIndex(t => t.id === taskId)
        if (index !== -1) {
          state.value.tasks[index] = { ...state.value.tasks[index], ...data }
        }
      })
      
      return response.data
    } catch (err: unknown) {
      console.error('Error bulk updating tasks:', err)
      throw err
    }
  }

  const bulkComplete = async (taskIds: number[]): Promise<any> => {
    try {
      const response = await tasksAPI.bulkComplete(taskIds)
      
      // Update tasks in list
      taskIds.forEach(taskId => {
        const index = state.value.tasks.findIndex(t => t.id === taskId)
        if (index !== -1) {
          state.value.tasks[index] = { ...state.value.tasks[index], status: 'completed' }
        }
      })
      
      return response.data
    } catch (err: unknown) {
      console.error('Error bulk completing tasks:', err)
      throw err
    }
  }

  const setSelectedTask = (task: Task | null): void => {
    state.value.selectedTask = task
  }

  const clearError = (): void => {
    state.value.error = null
  }

  const resetFilters = (): void => {
    state.value.filters = {
      search: '',
      status: 'all',
      priority: 'all',
      assignee_id: undefined,
      owner_id: undefined,
      due_date_from: undefined,
      due_date_to: undefined,
      sort: '-created_at',
      page: 1,
      per_page: 15
    }
  }

  // Helper function to check if a task matches current filters
  const matchesFilters = (task: Task, filters: TaskFilters): boolean => {
    if (filters.status && filters.status !== 'all' && task.status !== filters.status) {
      return false
    }
    if (filters.priority && filters.priority !== 'all' && task.priority !== filters.priority) {
      return false
    }
    if (filters.assignee_id && task.assignee_id !== filters.assignee_id) {
      return false
    }
    if (filters.owner_id && task.owner_id !== filters.owner_id) {
      return false
    }
    if (filters.due_date_from && task.due_date && task.due_date < filters.due_date_from) {
      return false
    }
    if (filters.due_date_to && task.due_date && task.due_date > filters.due_date_to) {
      return false
    }
    return true
  }

  return {
    // State
    tasks,
    loading,
    error,
    meta,
    filters,
    summary,
    selectedTask,
    pendingTasks,
    completedTasks,
    overdueTasks,
    todayTasks,
    upcomingTasks,
    tasksByPriority,
    tasksByAssignee,
    tasksByOwner,
    
    // Actions
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    fetchTasksByAssignee,
    fetchTasksByOwner,
    fetchTodayTasks,
    fetchOverdueTasks,
    fetchUpcomingTasks,
    bulkUpdate,
    bulkComplete,
    setSelectedTask,
    clearError,
    resetFilters
  }
})
