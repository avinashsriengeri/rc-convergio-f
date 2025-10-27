import api from './api'

// Lead Assignment API endpoints with robust error handling
export const leadAssignmentAPI = {
  // Rules endpoints
  getRules: (params = {}) => api.get('/assignment-rules', { params }),
  getRule: (id) => api.get(`/assignment-rules/${id}`),
  createRule: (data) => api.post('/assignment-rules', data),
  updateRule: (id, data) => api.put(`/assignment-rules/${id}`, data),
  deleteRule: (id) => api.delete(`/assignment-rules/${id}`),
  toggleRule: (id) => api.patch(`/assignment-rules/${id}/toggle`),

  // Defaults endpoints
  getDefaults: () => api.get('/assignment-defaults'),
  updateDefaults: (data) => api.put('/assignment-defaults', data),
  resetCounters: () => api.post('/assignment-defaults/reset-counters'),
  toggleAutomatic: () => api.patch('/assignment-defaults/toggle-automatic'),

  // Audit logs endpoints - with fallback to logs endpoint if assignment-audits doesn't exist
  getAuditLogs: (params = {}) => api.get('/assignment-audits', { params }).catch(() => 
    api.get('/logs', { params: { type: 'assignment', ...params } })
  ),
  exportAuditLogs: (params = {}) => api.get('/assignment-audits/export', { params, responseType: 'blob' }).catch(() =>
    api.get('/logs/export', { params: { type: 'assignment', ...params }, responseType: 'blob' })
  ),

  // Users and teams for dropdowns - with optimized queries
  getUsers: (params = {}) => api.get('/users', { 
    params: { 
      per_page: 100, 
      fields: 'id,name,email', 
      ...params 
    } 
  }),
  getTeams: (params = {}) => api.get('/teams', { 
    params: { 
      per_page: 100, 
      fields: 'id,name', 
      ...params 
    } 
  }).catch(() => 
    // Fallback: if teams endpoint doesn't exist, return empty array
    Promise.resolve({ data: { data: [] } })
  ),
}

// Lead Assignment service with helper methods
export const leadAssignmentService = {
  // Rules management
  async loadRules(params = {}) {
    try {
      const response = await leadAssignmentAPI.getRules(params)
      return response.data
    } catch (error) {
      console.error('Error loading assignment rules:', error)
      throw error
    }
  },

  async createRule(ruleData) {
    try {
      console.log('createRule called with:', ruleData)
      console.log('createRule criteria:', ruleData.criteria)
      console.log('createRule conditions:', ruleData.criteria?.conditions)
      
      // Manually construct plain object to match backend validation expectations
      const payloadToSend = {
        name: ruleData.name,
        description: ruleData.description,
        priority: ruleData.priority,
        active: ruleData.active,
        criteria: {
          all: ruleData.criteria.conditions ? ruleData.criteria.conditions.map(condition => ({
            field: condition.field,
            op: condition.op,
            value: condition.value
          })) : []
        },
        action: ruleData.action
      }
      
      console.log('Payload to send via Axios:', payloadToSend)
      console.log('Payload to send criteria:', payloadToSend.criteria)
      console.log('Payload to send all array:', payloadToSend.criteria?.all)
      
      const response = await leadAssignmentAPI.createRule(payloadToSend)
      return response.data
    } catch (error) {
      console.error('Error creating assignment rule:', error)
      throw error
    }
  },

  async updateRule(id, ruleData) {
    try {
      // Manually construct plain object to match backend validation expectations
      const payloadToSend = {
        name: ruleData.name,
        description: ruleData.description,
        priority: ruleData.priority,
        active: ruleData.active,
        criteria: {
          all: ruleData.criteria.conditions ? ruleData.criteria.conditions.map(condition => ({
            field: condition.field,
            op: condition.op,
            value: condition.value
          })) : []
        },
        action: ruleData.action
      }
      
      const response = await leadAssignmentAPI.updateRule(id, payloadToSend)
      return response.data
    } catch (error) {
      console.error('Error updating assignment rule:', error)
      throw error
    }
  },

  async deleteRule(id) {
    try {
      const response = await leadAssignmentAPI.deleteRule(id)
      return response.data
    } catch (error) {
      console.error('Error deleting assignment rule:', error)
      throw error
    }
  },

  async toggleRule(id) {
    try {
      const response = await leadAssignmentAPI.toggleRule(id)
      return response.data
    } catch (error) {
      console.error('Error toggling assignment rule:', error)
      throw error
    }
  },

  // Defaults management
  async loadDefaults() {
    try {
      const response = await leadAssignmentAPI.getDefaults()
      return response.data
    } catch (error) {
      console.error('Error loading assignment defaults:', error)
      throw error
    }
  },

  async updateDefaults(defaultsData) {
    try {
      const response = await leadAssignmentAPI.updateDefaults(defaultsData)
      return response.data
    } catch (error) {
      console.error('Error updating assignment defaults:', error)
      throw error
    }
  },

  async resetCounters() {
    try {
      const response = await leadAssignmentAPI.resetCounters()
      return response.data
    } catch (error) {
      console.error('Error resetting assignment counters:', error)
      throw error
    }
  },

  async toggleAutomatic() {
    try {
      const response = await leadAssignmentAPI.toggleAutomatic()
      return response.data
    } catch (error) {
      console.error('Error toggling automatic assignment:', error)
      throw error
    }
  },

  // Audit logs management
  async loadAuditLogs(params = {}) {
    try {
      const response = await leadAssignmentAPI.getAuditLogs(params)
      return response.data
    } catch (error) {
      console.error('Error loading audit logs:', error)
      throw error
    }
  },

  async exportAuditLogs(params = {}) {
    try {
      const response = await leadAssignmentAPI.exportAuditLogs(params)
      return response
    } catch (error) {
      console.error('Error exporting audit logs:', error)
      throw error
    }
  },

  // Helper methods
  async loadUsers() {
    try {
      const response = await leadAssignmentAPI.getUsers({ per_page: 100 })
      return response.data.data || response.data || []
    } catch (error) {
      console.error('Error loading users:', error)
      return []
    }
  },

  async loadTeams() {
    try {
      const response = await leadAssignmentAPI.getTeams({ per_page: 100 })
      return response.data.data || response.data || []
    } catch (error) {
      console.error('Error loading teams:', error)
      return []
    }
  },

  // Visual form builder helpers
  getAvailableFields() {
    return [
      { value: 'record_type', label: 'Record Type', type: 'select', options: [
        { value: 'contact', label: 'Contact' },
        { value: 'deal', label: 'Deal' }
      ]},
      { value: 'source', label: 'Source', type: 'select', options: [
        { value: 'website', label: 'Website' },
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Phone' },
        { value: 'referral', label: 'Referral' },
        { value: 'social', label: 'Social Media' }
      ]},
      { value: 'country', label: 'Country', type: 'text' },
      { value: 'value', label: 'Deal Value', type: 'number' },
      { value: 'lifecycle_stage', label: 'Lifecycle Stage', type: 'select', options: [
        { value: 'lead', label: 'Lead' },
        { value: 'prospect', label: 'Prospect' },
        { value: 'customer', label: 'Customer' }
      ]},
      { value: 'company_size', label: 'Company Size', type: 'select', options: [
        { value: 'startup', label: 'Startup (1-10)' },
        { value: 'small', label: 'Small (11-50)' },
        { value: 'medium', label: 'Medium (51-200)' },
        { value: 'large', label: 'Large (200+)' }
      ]}
    ]
  },

  getAvailableOperators() {
    return [
      { value: 'eq', label: 'Equals' },
      { value: 'ne', label: 'Not Equals' },
      { value: 'contains', label: 'Contains' },
      { value: 'not_contains', label: 'Does Not Contain' },
      { value: 'gt', label: 'Greater Than' },
      { value: 'lt', label: 'Less Than' },
      { value: 'is_empty', label: 'Is Empty' },
      { value: 'is_not_empty', label: 'Is Not Empty' }
    ]
  },

  getActionTypes() {
    return [
      { value: 'assign_user', label: 'Assign to User' },
      { value: 'assign_team', label: 'Assign to Team' },
      { value: 'round_robin', label: 'Round Robin' }
    ]
  },

  // Convert visual form data to backend format
  buildCriteriaFromForm(formData) {
    console.log('buildCriteriaFromForm called with:', formData)
    console.log('formData.conditions:', formData.conditions)
    
    if (!formData.conditions || formData.conditions.length === 0) {
      console.log('No conditions found, returning empty object')
      return {}
    }

    // Backend expects logic to be an object with field and op properties (not array)
    const firstCondition = formData.conditions[0]
    const logic = {
      field: firstCondition.field,
      op: firstCondition.operator
    }

    const conditions = formData.conditions.map(condition => ({
      field: condition.field,
      op: condition.operator,
      value: condition.value
    }))
    
    console.log('Mapped conditions:', conditions)
    console.log('First condition details:', formData.conditions[0])
    
    const result = {
      logic: logic,
      conditions: conditions
    }
    
    console.log('buildCriteriaFromForm returning:', result)
    console.log('Result conditions array:', result.conditions)
    return result
  },

  // Convert backend format to visual form data
  parseCriteriaToForm(criteria) {
    if (!criteria || !criteria.conditions) {
      return {
        logic: 'all',
        conditions: []
      }
    }

    // Handle different logic formats
    let logic = 'all'
    if (typeof criteria.logic === 'object' && criteria.logic.field) {
      // New format: logic is an object with field and op
      logic = 'all' // We'll use 'all' as default for display
    } else if (Array.isArray(criteria.logic)) {
      // Array format: logic is an array
      logic = 'all'
    } else if (typeof criteria.logic === 'string') {
      // Old format: logic is a string
      logic = criteria.logic
    }

    return {
      logic: logic,
      conditions: criteria.conditions.map(condition => ({
        field: condition.field,
        operator: condition.op || condition.operator, // Handle both op and operator
        value: condition.value
      }))
    }
  },

  // Build action from form data
  buildActionFromForm(formData) {
    const action = {
      type: formData.actionType
    }

    if (formData.actionType === 'assign_user' && formData.userId) {
      action.user_id = parseInt(formData.userId) // Convert to integer
    } else if (formData.actionType === 'assign_team' && formData.teamId) {
      action.team_id = parseInt(formData.teamId) // Convert to integer
    }

    return action
  },

  // Parse action to form data
  parseActionToForm(action) {
    return {
      actionType: action.type,
      userId: action.user_id ? action.user_id.toString() : '',
      teamId: action.team_id ? action.team_id.toString() : ''
    }
  },

  // Build complete rule payload for backend
  buildRulePayload(formData) {
    console.log('buildRulePayload called with:', formData)
    
    const criteria = this.buildCriteriaFromForm(formData)
    const action = this.buildActionFromForm(formData)

    const result = {
      name: formData.name,
      description: formData.description,
      priority: parseInt(formData.priority),
      active: formData.is_active, // Backend expects 'active' not 'is_active'
      criteria: criteria,
      action: action
    }
    
    console.log('buildRulePayload returning:', result)
    console.log('Final criteria object:', result.criteria)
    console.log('Final conditions array:', result.criteria.conditions)
    return result
  },

  // Generate human-readable rule summary
  generateRuleSummary(rule) {
    // Handle new backend format with criteria.all
    let conditions = []
    let logicType = 'all'
    
    if (rule.criteria && rule.criteria.all && Array.isArray(rule.criteria.all)) {
      // New format: criteria.all array
      conditions = rule.criteria.all
      logicType = 'all'
    } else if (rule.criteria && rule.criteria.any && Array.isArray(rule.criteria.any)) {
      // New format: criteria.any array
      conditions = rule.criteria.any
      logicType = 'any'
    } else if (rule.criteria && rule.criteria.conditions && Array.isArray(rule.criteria.conditions)) {
      // Old format: criteria.conditions array
      conditions = rule.criteria.conditions
      // Determine logic type - handle different formats
      if (typeof rule.criteria.logic === 'object' && rule.criteria.logic.field) {
        logicType = 'all' // Default for object format
      } else if (Array.isArray(rule.criteria.logic)) {
        logicType = 'all' // Default for array format
      } else if (typeof rule.criteria.logic === 'string') {
        logicType = rule.criteria.logic
      }
    }

    if (!conditions || conditions.length === 0) {
      return 'No conditions defined'
    }

    const conditionTexts = conditions.map(condition => {
      const field = this.getAvailableFields().find(f => f.value === condition.field)
      const operator = this.getAvailableOperators().find(o => o.value === (condition.op || condition.operator))
      const fieldLabel = field ? field.label : condition.field
      const operatorLabel = operator ? operator.label : (condition.op || condition.operator)
      
      return `${fieldLabel} ${operatorLabel.toLowerCase()} ${condition.value || 'empty'}`
    }).join(` ${logicType === 'all' ? 'AND' : 'OR'} `)

    const actionType = this.getActionTypes().find(a => a.value === rule.action?.type)
    const actionLabel = actionType ? actionType.label : 'Unknown Action'

    return `If ${conditionTexts}, then ${actionLabel}`
  },

  // Validation helpers
  validateRuleData(ruleData) {
    const errors = {}
    
    if (!ruleData.name || ruleData.name.trim() === '') {
      errors.name = 'Rule name is required'
    }
    
    if (!ruleData.description || ruleData.description.trim() === '') {
      errors.description = 'Rule description is required'
    }
    
    if (!ruleData.priority || ruleData.priority < 1) {
      errors.priority = 'Priority must be a positive number'
    }
    
    // Validate criteria
    if (!ruleData.criteria || !ruleData.criteria.conditions || ruleData.criteria.conditions.length === 0) {
      errors.criteria = 'At least one condition is required'
    } else {
      ruleData.criteria.conditions.forEach((condition, index) => {
        if (!condition.field) {
          errors[`criteria.conditions.${index}.field`] = 'Field is required'
        }
        if (!condition.operator) {
          errors[`criteria.conditions.${index}.operator`] = 'Operator is required'
        }
        if (!condition.value && !['is_empty', 'is_not_empty'].includes(condition.operator)) {
          errors[`criteria.conditions.${index}.value`] = 'Value is required'
        }
      })
    }
    
    // Validate action
    if (!ruleData.action || !ruleData.action.type) {
      errors.action = 'Action type is required'
    } else if (ruleData.action.type === 'assign_user' && !ruleData.action.user_id) {
      errors.action = 'User must be selected for user assignment'
    } else if (ruleData.action.type === 'assign_team' && !ruleData.action.team_id) {
      errors.action = 'Team must be selected for team assignment'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  // Format helpers
  formatRuleForDisplay(rule) {
    return {
      ...rule,
      is_active: rule.active, // Map backend 'active' to frontend 'is_active'
      criteria_summary: this.generateRuleSummary(rule),
      action_summary: this.getActionSummary(rule.action),
      status_badge: rule.active ? 'Active' : 'Inactive',
      status_color: rule.active ? 'green' : 'gray',
      created_at_formatted: new Date(rule.created_at).toLocaleDateString()
    }
  },

  getActionSummary(action) {
    if (!action) return 'No action defined'
    
    const actionType = this.getActionTypes().find(a => a.value === action.type)
    if (!actionType) return 'Unknown action'
    
    if (action.type === 'assign_user' && action.user_id) {
      return `Assign to User (ID: ${action.user_id})`
    } else if (action.type === 'assign_team' && action.team_id) {
      return `Assign to Team (ID: ${action.team_id})`
    } else if (action.type === 'round_robin') {
      return 'Round Robin Assignment'
    }
    
    return actionType.label
  },

  formatAuditLogForDisplay(log) {
    return {
      ...log,
      created_at_formatted: new Date(log.created_at).toLocaleString(),
      assignment_type_badge: log.assignment_type === 'automatic' ? 'Automatic' : 'Manual',
      assignment_type_color: log.assignment_type === 'automatic' ? 'blue' : 'purple',
      assigned_to_name: log.assigned_user ? log.assigned_user.name : 'Unassigned',
      rule_name: log.rule ? log.rule.name : 'Default Assignment'
    }
  }
}

export default leadAssignmentService
