import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { Environment } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // Environment configuration
  const getEnvironment = (): Environment => ({
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/',
    VITE_TENANT_ID: import.meta.env.VITE_TENANT_ID || '',
    VITE_AUTH_TOKEN: import.meta.env.VITE_AUTH_TOKEN || localStorage.getItem('auth_token') || undefined,
    VITE_USERS_ENDPOINT: import.meta.env.VITE_USERS_ENDPOINT || '/api/users'
  })

  // Computed headers for API requests
  const authHeaders = computed(() => {
    const env = getEnvironment()
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    if (env.VITE_AUTH_TOKEN) {
      headers['Authorization'] = `Bearer ${env.VITE_AUTH_TOKEN}`
    }

    return headers
  })

  // Get auth token
  const getAuthToken = (): string | null => {
    return getEnvironment().VITE_AUTH_TOKEN || localStorage.getItem('auth_token')
  }

  // Get tenant ID
  const getTenantId = (): string => {
    return ''
  }

  // Get users endpoint
  const getUsersEndpoint = (): string => {
    return getEnvironment().VITE_USERS_ENDPOINT
  }

  return {
    getEnvironment,
    authHeaders,
    getAuthToken,
    getTenantId,
    getUsersEndpoint
  }
})
