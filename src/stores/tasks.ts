import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tasksAPI, activitiesAPI } from '@/services/api'

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
      const createdTask = response.data.data || response.data
      
      // Log activity for task creation
      try {
        const activityData = {
          subject: `Task created: ${taskData.title}`,
          description: `Created task "${taskData.title}" with priority ${taskData.priority}`,
          type: 'task' as const,
          related_type: 'task',
          related_id: createdTask.id,
          scheduled_at: new Date().toISOString().slice(0, 19).replace('T', ' '), // MySQL datetime format
          status: 'completed' as const
        }
        
        console.log('Attempting to log activity for task creation:', activityData)
        await activitiesAPI.createActivity(activityData)
        console.log('Activity logged for task creation successfully')
      } catch (activityErr: any) {
        console.error('Failed to log activity for task creation:', activityErr)
        console.error('Activity error details:', activityErr.response?.data)
        // Don't throw - task was created successfully
      }
      
      await fetchTasks()
      return response.data
    } catch (err) {
      throw err
    }
  }

  const updateTask = async (id: number, taskData: any) => {
    try {
      const response = await tasksAPI.updateTask(id, taskData)
      const updatedTask = response.data.data || response.data
      
      // Log activity for task update
      try {
        const activityData = {
          subject: `Task updated: ${taskData.title || updatedTask.title}`,
          description: `Updated task "${taskData.title || updatedTask.title}"`,
          type: 'task' as const,
          related_type: 'task',
          related_id: id,
          scheduled_at: new Date().toISOString().slice(0, 19).replace('T', ' '), // MySQL datetime format
          status: 'completed' as const
        }
        
        console.log('Attempting to log activity for task update:', activityData)
        await activitiesAPI.createActivity(activityData)
        console.log('Activity logged for task update successfully')
      } catch (activityErr: any) {
        console.error('Failed to log activity for task update:', activityErr)
        console.error('Activity error details:', activityErr.response?.data)
        // Don't throw - task was updated successfully
      }
      
      await fetchTasks()
      return response.data
    } catch (err) {
      throw err
    }
  }

  const deleteTask = async (id: number) => {
    try {
      // Get task info before deleting for activity log
      const taskToDelete = state.value.tasks.find(t => t.id === id)
      
      await tasksAPI.deleteTask(id)
      
      // Log activity for task deletion
      if (taskToDelete) {
        try {
          const activityData = {
            subject: `Task deleted: ${taskToDelete.title}`,
            description: `Deleted task "${taskToDelete.title}"`,
            type: 'task' as const,
            scheduled_at: new Date().toISOString().slice(0, 19).replace('T', ' '), // MySQL datetime format
            status: 'completed' as const
          }
          
          console.log('Attempting to log activity for task deletion:', activityData)
          await activitiesAPI.createActivity(activityData)
          console.log('Activity logged for task deletion successfully')
        } catch (activityErr: any) {
          console.error('Failed to log activity for task deletion:', activityErr)
          console.error('Activity error details:', activityErr.response?.data)
        }
      }
      
      await fetchTasks()
    } catch (err) {
      throw err
    }
  }

  const bulkComplete = async (ids: number[]) => {
    try {
      await tasksAPI.bulkComplete(ids)
      
      // Log activity for bulk task completion
      try {
        const activityData = {
          subject: `Completed ${ids.length} task${ids.length > 1 ? 's' : ''}`,
          description: `Bulk completed ${ids.length} task(s)`,
          type: 'task' as const,
          scheduled_at: new Date().toISOString().slice(0, 19).replace('T', ' '), // MySQL datetime format
          status: 'completed' as const
        }
        
        console.log('Attempting to log activity for bulk completion:', activityData)
        await activitiesAPI.createActivity(activityData)
        console.log('Activity logged for bulk task completion successfully')
      } catch (activityErr: any) {
        console.error('Failed to log activity for bulk completion:', activityErr)
        console.error('Activity error details:', activityErr.response?.data)
      }
      
      await fetchTasks()
    } catch (err) {
      throw err
    }
  }

  // Complete a single task
  const completeTask = async (id: number) => {
    try {
      const taskToComplete = state.value.tasks.find(t => t.id === id)
      const response = await tasksAPI.completeTask(id)
      
      // Log activity for task completion
      if (taskToComplete) {
        try {
          const activityData = {
            subject: `Task completed: ${taskToComplete.title}`,
            description: `Completed task "${taskToComplete.title}"`,
            type: 'task' as const,
            related_type: 'task',
            related_id: id,
            scheduled_at: new Date().toISOString().slice(0, 19).replace('T', ' '), // MySQL datetime format
            status: 'completed' as const
          }
          
          console.log('Attempting to log activity for task completion:', activityData)
          await activitiesAPI.createActivity(activityData)
          console.log('Activity logged for task completion successfully')
        } catch (activityErr: any) {
          console.error('Failed to log activity for task completion:', activityErr)
          console.error('Activity error details:', activityErr.response?.data)
        }
      }
      
      await fetchTasks()
      return response
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
    completeTask,
    bulkComplete,
    bulkUpdate,
    exportTasks,
    fetchOverdueTasks,
    fetchUpcomingTasks,
    fetchTasksByAssignee,
    fetchTasksByOwner
  }
})
