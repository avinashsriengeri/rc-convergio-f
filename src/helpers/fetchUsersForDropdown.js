import { usersAPI } from '@/services/api'

/**
 * Fetches users for dropdowns with team/tenant filtering
 * Uses the new /api/users/for-assignment endpoint that handles backend filtering
 * Backend rules: admin can see all users, team users can see only team users
 * @param {Object} options - Additional options for filtering
 * @returns {Promise<Array>} Array of filtered users
 */
export async function fetchUsersForDropdown(options = {}) {
  try {
    // Use the new backend endpoint that handles team/tenant filtering automatically
    // Backend rules: admin can see all users, team users can see only team users
    const response = await usersAPI.getUsersForAssignment(options)
    return response.data.data || response.data || []
  } catch (error) {
    console.error('Error fetching users for dropdown:', error)
    return []
  }
}

/**
 * Fetches teams for dropdowns with tenant filtering
 * @param {Object} options - Additional options for filtering
 * @returns {Promise<Array>} Array of filtered teams
 */
export async function fetchTeamsForDropdown(options = {}) {
  try {
    // Use direct API call for teams (no specific for-assignment endpoint yet)
    const { usersAPI } = await import('@/services/api')
    const response = await usersAPI.getUsersForAssignment({ ...options, type: 'teams' })
    return response.data.data || response.data || []
  } catch (error) {
    console.error('Error fetching teams for dropdown:', error)
    return []
  }
}

/**
 * Fetches companies for dropdowns with team/tenant filtering
 * @param {Object} options - Additional options for filtering
 * @returns {Promise<Array>} Array of filtered companies
 */
export async function fetchCompaniesForDropdown(options = {}) {
  try {
    // Use direct API call for companies (no specific for-assignment endpoint yet)
    const { usersAPI } = await import('@/services/api')
    const response = await usersAPI.getUsersForAssignment({ ...options, type: 'companies' })
    return response.data.data || response.data || []
  } catch (error) {
    console.error('Error fetching companies for dropdown:', error)
    return []
  }
}
