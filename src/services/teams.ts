import api from './api'

// Team interfaces
export interface Team {
  id: number
  name: string
  description?: string
  members_count?: number
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: number
  name: string
  email: string
  role: 'manager' | 'member'
  team_id: number
  user_id: number
  created_at: string
}

export interface CreateTeamData {
  name: string
  description?: string
}

export interface UpdateTeamData {
  name?: string
  description?: string
}

export interface AddMemberData {
  user_id: number
  role: 'manager' | 'member'
}

export interface UpdateMemberRoleData {
  role: 'manager' | 'member'
}

// Teams API endpoints
export const teamsAPI = {
  // Get all teams
  getTeams: (params = {}) => api.get('/teams', { params }),

  // Get single team
  getTeam: (id: number) => api.get(`/teams/${id}`),

  // Create team
  createTeam: (data: CreateTeamData) => api.post('/teams', data),

  // Update team
  updateTeam: (id: number, data: UpdateTeamData) => api.put(`/teams/${id}`, data),

  // Delete team
  deleteTeam: (id: number) => api.delete(`/teams/${id}`),

  // Get team members
  getTeamMembers: (teamId: number, params = {}) => api.get(`/teams/${teamId}/members`, { params }),

  // Add member to team
  addMember: (teamId: number, data: AddMemberData) => api.post(`/teams/${teamId}/members`, data),

  // Remove member from team
  removeMember: (teamId: number, userId: number) => api.delete(`/teams/${teamId}/members/${userId}`),

  // Update member role
  updateMemberRole: (teamId: number, userId: number, data: UpdateMemberRoleData) => 
    api.put(`/teams/${teamId}/members/${userId}/role`, data),

  // Get available users for adding to teams
  getAvailableUsers: (params = {}) => api.get('/users', { params: { per_page: 100, ...params } })
}

// Helper functions for team management
export const teamHelpers = {
  // Format team member count
  formatMemberCount: (count: number) => {
    if (count === 0) return 'No members'
    if (count === 1) return '1 member'
    return `${count} members`
  },

  // Get role badge class
  getRoleBadgeClass: (role: string) => {
    const classes = {
      manager: 'bg-purple-100 text-purple-800',
      member: 'bg-green-100 text-green-800'
    }
    return classes[role as keyof typeof classes] || 'bg-gray-100 text-gray-800'
  },

  // Get role display name
  getRoleDisplayName: (role: string) => {
    const displayNames = {
      manager: 'Manager',
      member: 'Member'
    }
    return displayNames[role as keyof typeof displayNames] || role.charAt(0).toUpperCase() + role.slice(1)
  },

  // Format date
  formatDate: (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

export default teamsAPI
