import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { debounce } from 'lodash-es'
import { contactsAPI, companiesAPI } from '../services/api'
import { useAuthStore } from './auth'
import { fetchUsersForDropdown } from '../helpers/fetchUsersForDropdown'
import type { User, Contact, Company, LoadingState } from '../types'

interface RefsState extends LoadingState {
  users: User[]
  contacts: Contact[]
  companies: Company[]
  usersLoading: boolean
  contactsLoading: boolean
  companiesLoading: boolean
  usersError: string | null
  contactsError: string | null
  companiesError: string | null
}

export const useRefsStore = defineStore('refs', () => {
  const authStore = useAuthStore()

  // State
  const state = ref<RefsState>({
    loading: false,
    error: null,
    users: [],
    contacts: [],
    companies: [],
    usersLoading: false,
    contactsLoading: false,
    companiesLoading: false,
    usersError: null,
    contactsError: null,
    companiesError: null
  })

  // Getters
  const users = computed(() => state.value.users)
  const contacts = computed(() => state.value.contacts)
  const companies = computed(() => state.value.companies)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)

  const usersLoading = computed(() => state.value.usersLoading)
  const contactsLoading = computed(() => state.value.contactsLoading)
  const companiesLoading = computed(() => state.value.companiesLoading)

  const usersError = computed(() => state.value.usersError)
  const contactsError = computed(() => state.value.contactsError)
  const companiesError = computed(() => state.value.companiesError)

  // Actions
  const fetchUsers = async (search?: string) => {
    state.value.usersLoading = true
    state.value.usersError = null

    try {
      // Use team-aware helper to fetch users filtered by tenant/team
      state.value.users = await fetchUsersForDropdown()
    } catch (err: any) {
      state.value.usersError = err.message || 'Failed to fetch users'
      console.error('Error fetching users:', err)
      
      // Add sample users for testing when API fails
      state.value.users = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    } finally {
      state.value.usersLoading = false
    }
  }

  const fetchContacts = async (params: { search?: string; page?: number; per_page?: number } = {}) => {
    state.value.contactsLoading = true
    state.value.contactsError = null

    try {
      console.log('Fetching contacts with params:', params)
      const response = await contactsAPI.getContacts(params)
      console.log('Contacts API response:', response)
      state.value.contacts = response.data.data || []
      console.log('Contacts loaded:', state.value.contacts)
    } catch (err: any) {
      state.value.contactsError = err.response?.data?.message || 'Failed to fetch contacts'
      console.error('Error fetching contacts:', err)
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        config: err.config
      })
      // Temporary sample data so you can test the form
      state.value.contacts = [
        {
          id: 1,
          name: 'Alice Smith',
          email: 'alice@example.com',
          phone: '+1-555-0123',
          position: 'CEO',
          company_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Bob Johnson',
          email: 'bob@example.com',
          phone: '+1-555-0124',
          position: 'CTO',
          company_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Carol Davis',
          email: 'carol@example.com',
          phone: '+1-555-0125',
          position: 'Marketing Manager',
          company_id: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    } finally {
      state.value.contactsLoading = false
    }
  }

  const fetchCompanies = async (params: { search?: string; page?: number; per_page?: number } = {}) => {
    state.value.companiesLoading = true
    state.value.companiesError = null

    try {
      const response = await companiesAPI.getCompanies(params)
      state.value.companies = response.data.data || []
    } catch (err: any) {
      state.value.companiesError = err.response?.data?.message || 'Failed to fetch companies'
      console.error('Error fetching companies:', err)
      // Sample data for testing when API fails
      state.value.companies = [
        {
          id: 1,
          name: 'Acme Corporation',
          industry: 'Technology',
          website: 'https://acme.com',
          phone: '+1-555-0100',
          email: 'info@acme.com',
          address: '123 Tech Street, Silicon Valley, CA',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Globex Inc',
          industry: 'Manufacturing',
          website: 'https://globex.com',
          phone: '+1-555-0200',
          email: 'contact@globex.com',
          address: '456 Industrial Ave, Detroit, MI',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Initech Solutions',
          industry: 'Software',
          website: 'https://initech.com',
          phone: '+1-555-0300',
          email: 'hello@initech.com',
          address: '789 Code Blvd, Austin, TX',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    } finally {
      state.value.companiesLoading = false
    }
  }

  // Debounced search functions
  const debouncedSearchContacts = debounce(async (search: string) => {
    if (search.trim().length >= 2) {
      await fetchContacts({ search: search.trim() })
    } else if (search.trim().length === 0) {
      await fetchContacts()
    }
  }, 300)

  const debouncedSearchCompanies = debounce(async (search: string) => {
    if (search.trim().length >= 2) {
      await fetchCompanies({ search: search.trim() })
    } else if (search.trim().length === 0) {
      await fetchCompanies()
    }
  }, 300)

  const debouncedSearchUsers = debounce(async (search: string) => {
    if (search.trim().length >= 2) {
      await fetchUsers(search.trim())
    } else if (search.trim().length === 0) {
      await fetchUsers()
    }
  }, 300)

  // Initialize data
  const initializeData = async () => {
    state.value.loading = true
    state.value.error = null

    try {
      await Promise.all([
        fetchUsers(),
        fetchContacts(),
        fetchCompanies()
      ])
    } catch (err: any) {
      state.value.error = err.message || 'Failed to initialize reference data'
      console.error('Error initializing reference data:', err)
    } finally {
      state.value.loading = false
    }
  }

  // Get user by ID
  const getUserById = (id: number): User | undefined => {
    return state.value.users.find(user => user.id === id)
  }

  // Get contact by ID
  const getContactById = (id: number): Contact | undefined => {
    return state.value.contacts.find(contact => contact.id === id)
  }

  // Get company by ID
  const getCompanyById = (id: number): Company | undefined => {
    return state.value.companies.find(company => company.id === id)
  }

  // Clear errors
  const clearErrors = () => {
    state.value.error = null
    state.value.usersError = null
    state.value.contactsError = null
    state.value.companiesError = null
  }

  // Reset state
  const reset = () => {
    state.value = {
      loading: false,
      error: null,
      users: [],
      contacts: [],
      companies: [],
      usersLoading: false,
      contactsLoading: false,
      companiesLoading: false,
      usersError: null,
      contactsError: null,
      companiesError: null
    }
  }

  return {
    // State
    users,
    contacts,
    companies,
    loading,
    error,
    usersLoading,
    contactsLoading,
    companiesLoading,
    usersError,
    contactsError,
    companiesError,
    
    // Actions
    fetchUsers,
    fetchContacts,
    fetchCompanies,
    debouncedSearchContacts,
    debouncedSearchCompanies,
    debouncedSearchUsers,
    initializeData,
    getUserById,
    getContactById,
    getCompanyById,
    clearErrors,
    reset
  }
})
