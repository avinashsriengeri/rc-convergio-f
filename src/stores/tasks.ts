import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tasksAPI } from '@/services/api'

export const useTasksStore = defineStore('tasks', () => {
  // State
  const state = ref({
    loading: false,
    error: null as string | null,
    tasks: [] as any[],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    }
  })

  // Computed
  const tasks = computed(() => state.value.tasks)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const meta = computed(() => state.value.meta)

  // Actions
  const fetchTasks = async (filters: any = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await tasksAPI.getTasks(filters)
      
      // Based on your network logs, the API returns: { data: [...tasks], meta: {...} }
      // So tasks are in response.data.data and meta is in response.data.meta
      state.value.tasks = response.data.data || []
      state.value.meta = response.data.meta || {}
    } catch (err) {
      console.error('Store: Error fetching tasks:', err)
      state.value.error = 'Failed to fetch tasks'
      state.value.tasks = []
    } finally {
      state.value.loading = false
    }
  }

  const createTask = async (taskData: any) => {
    try {
      const response = await tasksAPI.createTask(taskData)
      await fetchTasks()
      return response.data
    } catch (err) {
      throw err
    }
  }

  const updateTask = async (id: number, taskData: any) => {
    try {
      const response = await tasksAPI.updateTask(id, taskData)
      await fetchTasks()
      return response.data
    } catch (err) {
      throw err
    }
  }

  const deleteTask = async (id: number) => {
    try {
      await tasksAPI.deleteTask(id)
      await fetchTasks()
    } catch (err) {
      throw err
    }
  }

  const bulkComplete = async (ids: number[]) => {
    try {
      await tasksAPI.bulkComplete(ids)
      await fetchTasks()
    } catch (err) {
      throw err
    }
  }

  const exportTasks = async (params: any) => {
    try {
      const response = await tasksAPI.exportTasks(params)
      return response
    } catch (err) {
      throw err
    }
  }

  // Fetch overdue tasks
  const fetchOverdueTasks = async () => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await tasksAPI.getOverdueTasks()
      state.value.tasks = response.data.data || []
      state.value.meta = response.data.meta || state.value.meta
    } catch (err) {
      state.value.error = 'Failed to fetch overdue tasks'
      state.value.tasks = []
    } finally {
      state.value.loading = false
    }
  }

  // Fetch upcoming tasks
  const fetchUpcomingTasks = async (days = 7) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await tasksAPI.getUpcomingTasks(days)
      state.value.tasks = response.data.data || []
      state.value.meta = response.data.meta || state.value.meta
    } catch (err) {
      state.value.error = 'Failed to fetch upcoming tasks'
      state.value.tasks = []
    } finally {
      state.value.loading = false
    }
  }

  // Fetch tasks by assignee
  const fetchTasksByAssignee = async (assigneeId: number) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await tasksAPI.getTasksByAssignee(assigneeId)
      state.value.tasks = response.data.data || []
      state.value.meta = response.data.meta || state.value.meta
    } catch (err) {
      state.value.error = 'Failed to fetch tasks by assignee'
      state.value.tasks = []
    } finally {
      state.value.loading = false
    }
  }

  // Fetch tasks by owner
  const fetchTasksByOwner = async (ownerId: number) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await tasksAPI.getTasksByOwner(ownerId)
      state.value.tasks = response.data.data || []
      state.value.meta = response.data.meta || state.value.meta
    } catch (err) {
      state.value.error = 'Failed to fetch tasks by owner'
      state.value.tasks = []
    } finally {
      state.value.loading = false
    }
  }

  // Bulk update tasks
  const bulkUpdate = async (taskIds: number[], data: any) => {
    try {
      await tasksAPI.bulkUpdate(taskIds, data)
      await fetchTasks()
    } catch (err) {
      throw err
    }
  }

  return {
    // State
    tasks,
    loading,
    error,
    meta,
    
    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    bulkComplete,
    bulkUpdate,
    exportTasks,
    fetchOverdueTasks,
    fetchUpcomingTasks,
    fetchTasksByAssignee,
    fetchTasksByOwner
  }
})
