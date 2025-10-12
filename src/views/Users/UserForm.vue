<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit User' : 'Add New User' }}
            </h1>
            <p class="text-sm text-gray-600 mt-1">
              {{ isEditing ? 'Update user information and permissions' : 'Create a new user account with appropriate permissions' }}
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="secondary"
              @click="goBack"
            >
              Cancel
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="saveUser"
              :loading="saving"
              :disabled="!isFormValid"
            >
              {{ isEditing ? 'Update User' : 'Create User' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form @submit.prevent="saveUser" class="space-y-6">
          <!-- Basic Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div class="space-y-4">
              <!-- Full Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  v-model="form.name"
                  placeholder="Enter full name"
                  :error="errors.name"
                  @blur="validateField('name')"
                />
                <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
              </div>

              <!-- Email Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  v-model="form.email"
                  type="email"
                  placeholder="Enter email address"
                  :error="errors.email"
                  @blur="validateField('email')"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Password <span v-if="!isEditing" class="text-red-500">*</span>
                  <span v-if="isEditing" class="text-sm font-normal text-gray-500">(leave blank to keep current password)</span>
                </label>
                <div class="relative">
                  <BaseInput
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Enter password"
                    :error="errors.password"
                    @blur="validateField('password')"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                    <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                <p v-if="!isEditing" class="mt-1 text-sm text-gray-500">
                  Password must be at least 8 characters long and include uppercase, lowercase, and numbers.
                </p>
              </div>

              <!-- Confirm Password -->
              <div v-if="form.password">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  v-model="form.password_confirmation"
                  type="password"
                  placeholder="Confirm password"
                  :error="errors.password_confirmation"
                  @blur="validateField('password_confirmation')"
                />
                <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">{{ errors.password_confirmation }}</p>
              </div>
            </div>
          </div>

          <!-- Permissions & Role -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Permissions & Role</h3>
            <div class="space-y-4">
              <!-- Role Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  User Role <span class="text-red-500">*</span>
                </label>
                
                <!-- Loading state -->
                <div v-if="loadingRoles" class="text-center py-4">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p class="text-sm text-gray-500 mt-2">Loading available roles...</p>
                </div>
                
                <!-- Roles list -->
                <div v-else-if="roles.length > 0" class="space-y-3">
                  <div
                    v-for="role in roles"
                    :key="role.id"
                    @click="form.role = role.id"
                    class="relative border rounded-lg p-4 cursor-pointer transition-colors"
                    :class="form.role === role.id ? getRoleBorderClass(role.name) : 'border-gray-300 hover:border-gray-400'"
                  >
                    <div class="flex items-start">
                      <input
                        type="radio"
                        :name="'role-' + role.id"
                        :value="role.id"
                        v-model="form.role"
                        class="h-4 w-4 focus:ring-blue-500 border-gray-300 mt-1"
                        :class="getRoleRadioClass(role.name)"
                      />
                      <div class="ml-3">
                        <h4 class="text-sm font-medium text-gray-900">{{ role.display_name }}</h4>
                        <p class="text-sm text-gray-500 mt-1">
                          {{ getRoleDescription(role.name) }}
                        </p>
                        <div class="mt-2 flex flex-wrap gap-1">
                          <span
                            v-for="permission in getRolePermissions(role.name)"
                            :key="permission"
                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                            :class="getRolePermissionClass(role.name)"
                          >
                            {{ permission }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- No roles available -->
                <div v-else class="text-center py-4 text-gray-500">
                  <p>No roles available. Please contact your administrator.</p>
                </div>
                
                <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
              </div>

              <!-- Team Assignment -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Team
                </label>
                
                <!-- Loading state -->
                <div v-if="loadingTeams" class="text-center py-4">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p class="text-sm text-gray-500 mt-2">Loading available teams...</p>
                </div>
                
                <!-- Teams dropdown -->
                <select
                  v-else
                  v-model="form.team_id"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option :value="null">No team assigned</option>
                  <option
                    v-for="team in teams"
                    :key="team.id"
                    :value="team.id"
                  >
                    {{ team.name }}
                  </option>
                </select>
                
                <p class="mt-1 text-sm text-gray-500">
                  Assign the user to a team for better organization and collaboration.
                </p>
              </div>

              <!-- Account Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Account Status</label>
                <div class="flex items-center space-x-6">
                  <div class="flex items-center">
                    <input
                      id="status-active"
                      type="radio"
                      name="status"
                      value="active"
                      v-model="form.status"
                      class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label for="status-active" class="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      id="status-inactive"
                      type="radio"
                      name="status"
                      value="inactive"
                      v-model="form.status"
                      class="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300"
                    />
                    <label for="status-inactive" class="ml-2 block text-sm text-gray-900">
                      Inactive
                    </label>
                  </div>
                </div>
                <p class="mt-1 text-sm text-gray-500">
                  Inactive users cannot log in to the system.
                </p>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="border-t border-gray-200 pt-6 flex items-center justify-end space-x-3">
            <BaseButton
              type="button"
              variant="secondary"
              @click="goBack"
            >
              Cancel
            </BaseButton>
            <BaseButton
              type="submit"
              variant="primary"
              :loading="saving"
              :disabled="!isFormValid"
            >
              {{ isEditing ? 'Update User' : 'Create User' }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { usersAPI } from '@/services/api'
import { teamsAPI, type Team } from '@/services/teams'
import { useNotifications } from '@/composables/useNotifications'

interface UserFormData {
  name: string
  email: string
  password: string
  password_confirmation: string
  role: number | null // Changed to number for role ID
  team_id: number | null // Add team_id field
  status: 'active' | 'inactive'
}

interface Role {
  id: number
  name: string
  display_name: string
}

const route = useRoute()
const router = useRouter()
const { success, error: showError } = useNotifications()

// Reactive data
const saving = ref(false)
const showPassword = ref(false)
const isEditing = computed(() => route.name === 'UserEdit')
const roles = ref<Role[]>([])
const loadingRoles = ref(false)
const teams = ref<Team[]>([])
const loadingTeams = ref(false)

const form = reactive<UserFormData>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: null, // Default to null, will be set after roles are loaded
  team_id: null, // Default to null, will be set after teams are loaded
  status: 'active' // Default to 'active' status
 })

const errors = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: ''
})

// Computed
const isFormValid = computed(() => {
  // Basic validation
  if (!form.name.trim() || !form.email.trim() || form.role === null) {
    return false
  }

  // Password validation for new users
  if (!isEditing.value && !form.password) {
    return false
  }

  // Password confirmation validation
  if (form.password && form.password !== form.password_confirmation) {
    return false
  }

  // Check for any errors
  return !Object.values(errors).some(error => error)
})

// Methods
const validateField = (field: keyof typeof errors) => {
  errors[field] = ''

  switch (field) {
    case 'name':
      if (!form.name.trim()) {
        errors.name = 'Full name is required'
      }
      break

    case 'email':
      if (!form.email.trim()) {
        errors.email = 'Email address is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email address'
      }
      break

    case 'password':
      if (!isEditing.value && !form.password) {
        errors.password = 'Password is required'
      } else if (form.password && form.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long'
      } else if (form.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
        errors.password = 'Password must include uppercase, lowercase, and numbers'
      }
      break

    case 'password_confirmation':
      if (form.password && !form.password_confirmation) {
        errors.password_confirmation = 'Please confirm your password'
      } else if (form.password && form.password !== form.password_confirmation) {
        errors.password_confirmation = 'Passwords do not match'
      }
      break

    case 'role':
      if (form.role === null) {
        errors.role = 'Please select a user role'
      }
      break
  }
}

const validateForm = () => {
  // Validate all fields
  Object.keys(errors).forEach(field => {
    validateField(field as keyof typeof errors)
  })

  return !Object.values(errors).some(error => error)
}

const saveUser = async () => {
  if (!validateForm()) {
    return
  }

  saving.value = true

  try {
    // Format data for backend (Spatie compatible)
    const userData = {
      name: form.name,
      email: form.email,
      roles: [form.role], // Send role ID as array for backend validation
      team_id: form.team_id, // Include team_id
      status: form.status,
      ...(form.password && { 
        password: form.password,
        password_confirmation: form.password_confirmation
      })
    }

    // Debug: Log the payload being sent
    console.log('Sending user data to backend:', userData)
    console.log('Roles array:', userData.roles)
    console.log('Role ID being sent:', form.role)
    console.log('Roles is array:', Array.isArray(userData.roles))

    if (isEditing.value) {
      await usersAPI.updateUser(route.params.id as string, userData)
      success('User updated successfully')
    } else {
      await usersAPI.createUser(userData)
      success('User created successfully')
    }

    // Navigate back to users list
    router.push('/users')
  } catch (err: any) {
    console.error('Failed to save user:', err)
    console.error('Error response:', err.response?.data)
    showError('Failed to save user')
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push('/users')
}

const fetchRoles = async () => {
  loadingRoles.value = true
  try {
    const response = await usersAPI.getRoles()
    const apiRoles = response.data.data || response.data
    
    // Transform roles to match our interface
    roles.value = apiRoles.map((role: any) => ({
      id: role.id,
      name: role.name,
      display_name: role.display_name || role.name
    }))
    
    // Set default role if not editing
    if (!isEditing.value && roles.value.length > 0) {
      // Find the default 'user' role or use the first available
      const defaultRole = roles.value.find((r: Role) => r.name === 'user') || roles.value[0]
      form.role = defaultRole.id
    }
  } catch (err) {
    console.error('Failed to fetch roles:', err)
    // Fallback to default roles if API fails
    roles.value = [
      { id: 1, name: 'admin', display_name: 'Administrator' },
      { id: 2, name: 'manager', display_name: 'Manager' },
      { id: 3, name: 'user', display_name: 'Standard User' }
    ]
    form.role = 3 // Default to user role ID
  } finally {
    loadingRoles.value = false
  }
}

const fetchTeams = async () => {
  loadingTeams.value = true
  try {
    const response = await teamsAPI.getTeams()
    
    // Handle Laravel pagination structure: response.data.data.data
    let apiTeams = []
    if (response.data.success && response.data.data && response.data.data.data) {
      // Laravel paginated response
      apiTeams = response.data.data.data
    } else if (response.data.data && Array.isArray(response.data.data)) {
      // Direct array response
      apiTeams = response.data.data
    } else if (Array.isArray(response.data)) {
      // Simple array response
      apiTeams = response.data
    }
    
    // Transform teams to match our interface
    teams.value = apiTeams.map((team: any) => ({
      id: team.id,
      name: team.name,
      description: team.description,
      members_count: team.members?.length || 0,
      created_at: team.created_at,
      updated_at: team.updated_at
    }))
  } catch (err) {
    console.error('Failed to fetch teams:', err)
    // Teams are optional, so we can continue without them
    teams.value = []
  } finally {
    loadingTeams.value = false
  }
}

// Helper functions for role styling and descriptions
const getRoleBorderClass = (roleName: string) => {
  switch (roleName) {
    case 'admin': return 'border-red-500 bg-red-50'
    case 'manager': return 'border-purple-500 bg-purple-50'
    case 'user': return 'border-green-500 bg-green-50'
    default: return 'border-blue-500 bg-blue-50'
  }
}

const getRoleRadioClass = (roleName: string) => {
  switch (roleName) {
    case 'admin': return 'text-red-600 focus:ring-red-500'
    case 'manager': return 'text-purple-600 focus:ring-purple-500'
    case 'user': return 'text-green-600 focus:ring-green-500'
    default: return 'text-blue-600 focus:ring-blue-500'
  }
}

const getRolePermissionClass = (roleName: string) => {
  switch (roleName) {
    case 'admin': return 'bg-red-100 text-red-800'
    case 'manager': return 'bg-purple-100 text-purple-800'
    case 'user': return 'bg-green-100 text-green-800'
    default: return 'bg-blue-100 text-blue-800'
  }
}

const getRoleDescription = (roleName: string) => {
  switch (roleName) {
    case 'admin': return 'Full system access including user management, system settings, and all data'
    case 'manager': return 'Team management access with ability to view and edit team data and reports'
    case 'user': return 'Basic access to CRM features with ability to manage own contacts and deals'
    default: return 'Standard access to system features'
  }
}

const getRolePermissions = (roleName: string) => {
  switch (roleName) {
    case 'admin': return ['User Management', 'System Settings', 'All Data Access']
    case 'manager': return ['Team Management', 'Reports Access', 'Team Data Edit']
    case 'user': return ['Own Data Access', 'Basic CRM Features', 'Contact Management']
    default: return ['Basic Access', 'Standard Features']
  }
}

const loadUser = async () => {
  if (isEditing.value) {
    const userId = route.params.id

    try {
      const response = await usersAPI.getUser(userId as string)
      const userData = response.data.data || response.data // Handle nested response structure
      
      // Handle roles array from backend (Spatie compatible)
      let userRoleId = null
      if (userData.roles && Array.isArray(userData.roles)) {
        // Get the first role ID from the array
        userRoleId = userData.roles[0]?.id || userData.roles[0] || null
      } else if (userData.role) {
        // Fallback to single role field (could be ID or name)
        userRoleId = typeof userData.role === 'number' ? userData.role : null
      }
      
      Object.assign(form, {
        name: userData.name,
        email: userData.email,
        password: '',
        password_confirmation: '',
        role: userRoleId,
        team_id: userData.team_id || null,
        status: userData.status || 'active'
      })
    } catch (err) {
      console.error('Failed to load user:', err)
      showError('Failed to load user')
    }
  }
}

// Lifecycle
onMounted(async () => {
  // Fetch roles and teams in parallel
  await Promise.all([
    fetchRoles(),
    fetchTeams()
  ])
  
  if (isEditing.value) {
    await loadUser()
  }
})
</script>
