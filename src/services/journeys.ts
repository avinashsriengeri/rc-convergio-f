import api from './api'

// Journeys API wrappers
export const journeysService = {
  // Get journey statuses
  async getJourneyStatuses() {
    try {
      const response = await api.get('/journeys/statuses')
      return response.data
    } catch (error) {
      console.error('Error fetching journey statuses:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            { id: 'active', name: 'Active', description: 'Journey is currently running' },
            { id: 'draft', name: 'Draft', description: 'Journey is being built' },
            { id: 'paused', name: 'Paused', description: 'Journey is temporarily stopped' },
            { id: 'archived', name: 'Archived', description: 'Journey is no longer active' }
          ]
        }
      }
      
      throw error
    }
  },

  // Get step types
  async getStepTypes() {
    try {
      const response = await api.get('/journeys/step-types')
      return response.data
    } catch (error) {
      console.error('Error fetching step types:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            { id: 'email', name: 'Send Email', description: 'Send an email to the contact', icon: 'email' },
            { id: 'wait', name: 'Wait', description: 'Wait for a specified time period', icon: 'clock' },
            { id: 'condition', name: 'Condition', description: 'Branch based on conditions', icon: 'branch' },
            { id: 'webhook', name: 'Webhook', description: 'Trigger an external webhook', icon: 'webhook' },
            { id: 'score', name: 'Score Update', description: 'Update contact score', icon: 'star' },
            { id: 'tag', name: 'Add Tag', description: 'Add tags to contact', icon: 'tag' },
            { id: 'sms', name: 'Send SMS', description: 'Send SMS message', icon: 'phone' },
            { id: 'task', name: 'Create Task', description: 'Create a task for sales team', icon: 'task' }
          ]
        }
      }
      
      throw error
    }
  },

  // Get step schema
  async getStepSchema(stepType) {
    try {
      const response = await api.get('/journeys/step-schema', { params: { step_type: stepType } })
      return response.data
    } catch (error) {
      console.error('Error fetching step schema:', error)
      
      // Return fallback schema
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        const schemas = {
          email: {
            fields: [
              { name: 'template_id', type: 'select', label: 'Email Template', required: true, options: [] },
              { name: 'subject', type: 'text', label: 'Subject Line', required: true },
              { name: 'delay', type: 'number', label: 'Delay (hours)', required: false, default: 0 }
            ]
          },
          wait: {
            fields: [
              { name: 'duration', type: 'number', label: 'Duration (hours)', required: true },
              { name: 'unit', type: 'select', label: 'Unit', required: true, options: ['hours', 'days', 'weeks'] }
            ]
          },
          condition: {
            fields: [
              { name: 'field', type: 'select', label: 'Field', required: true, options: ['score', 'tags', 'company_size'] },
              { name: 'operator', type: 'select', label: 'Operator', required: true, options: ['equals', 'greater_than', 'contains'] },
              { name: 'value', type: 'text', label: 'Value', required: true }
            ]
          },
          webhook: {
            fields: [
              { name: 'url', type: 'url', label: 'Webhook URL', required: true },
              { name: 'method', type: 'select', label: 'HTTP Method', required: true, options: ['POST', 'PUT', 'GET'] },
              { name: 'payload', type: 'textarea', label: 'Payload (JSON)', required: false }
            ]
          }
        }
        return { data: schemas[stepType] || { fields: [] } }
      }
      
      throw error
    }
  },

  // Get journeys
  async getJourneys(params = {}) {
    try {
      const response = await api.get('/journeys', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching journeys:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            {
              id: 1,
              name: 'New Lead Welcome Journey',
              description: 'Automated welcome sequence for new leads',
              status: 'active',
              steps_count: 4,
              active_executions: 342,
              completed_executions: 1567,
              completion_rate: 78.5,
              created_at: '2024-11-15T10:00:00Z',
              updated_at: '2024-12-10T14:30:00Z',
              created_by: { id: 1, name: 'John Smith' },
              steps: [
                {
                  id: 1,
                  type: 'email',
                  name: 'Welcome Email',
                  order: 1,
                  config: { template_id: 'welcome_001', subject: 'Welcome to our platform!' }
                },
                {
                  id: 2,
                  type: 'wait',
                  name: 'Wait 2 days',
                  order: 2,
                  config: { duration: 48, unit: 'hours' }
                },
                {
                  id: 3,
                  type: 'email',
                  name: 'Product Overview',
                  order: 3,
                  config: { template_id: 'product_001', subject: 'Discover our features' }
                },
                {
                  id: 4,
                  type: 'task',
                  name: 'Schedule Demo',
                  order: 4,
                  config: { task_type: 'demo_scheduling', priority: 'high' }
                }
              ]
            },
            {
              id: 2,
              name: 'Product Trial Journey',
              description: 'Onboarding sequence for trial users',
              status: 'active',
              steps_count: 5,
              active_executions: 156,
              completed_executions: 892,
              completion_rate: 84.2,
              created_at: '2024-11-10T09:00:00Z',
              updated_at: '2024-12-08T16:45:00Z',
              created_by: { id: 2, name: 'Sarah Johnson' },
              steps: [
                {
                  id: 5,
                  type: 'email',
                  name: 'Trial Setup Guide',
                  order: 1,
                  config: { template_id: 'trial_001', subject: 'Get started with your trial' }
                },
                {
                  id: 6,
                  type: 'wait',
                  name: 'Wait 1 day',
                  order: 2,
                  config: { duration: 24, unit: 'hours' }
                },
                {
                  id: 7,
                  type: 'email',
                  name: 'Feature Tutorials',
                  order: 3,
                  config: { template_id: 'tutorials_001', subject: 'Learn key features' }
                },
                {
                  id: 8,
                  type: 'condition',
                  name: 'Usage Check',
                  order: 4,
                  config: { field: 'usage_count', operator: 'greater_than', value: '5' }
                },
                {
                  id: 9,
                  type: 'email',
                  name: 'Upgrade Prompt',
                  order: 5,
                  config: { template_id: 'upgrade_001', subject: 'Ready to upgrade?' }
                }
              ]
            },
            {
              id: 3,
              name: 'Customer Retention Journey',
              description: 'Retention sequence for existing customers',
              status: 'draft',
              steps_count: 3,
              active_executions: 0,
              completed_executions: 0,
              completion_rate: 0,
              created_at: '2024-12-01T08:45:00Z',
              updated_at: '2024-12-01T08:45:00Z',
              created_by: { id: 3, name: 'Mike Wilson' },
              steps: [
                {
                  id: 10,
                  type: 'condition',
                  name: 'Usage Analytics',
                  order: 1,
                  config: { field: 'last_login', operator: 'less_than', value: '7_days' }
                },
                {
                  id: 11,
                  type: 'email',
                  name: 'Success Check-in',
                  order: 2,
                  config: { template_id: 'checkin_001', subject: 'How are you doing?' }
                },
                {
                  id: 12,
                  type: 'task',
                  name: 'Follow-up Call',
                  order: 3,
                  config: { task_type: 'customer_success', priority: 'medium' }
                }
              ]
            }
          ],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 3,
            from: 1,
            to: 3
          }
        }
      }
      
      throw error
    }
  },

  // Create journey
  async createJourney(data) {
    try {
      const response = await api.post('/journeys', data)
      return response.data
    } catch (error) {
      console.error('Error creating journey:', error)
      throw error
    }
  },

  // Get journey details
  async getJourney(id) {
    try {
      const response = await api.get(`/journeys/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching journey details:', error)
      throw error
    }
  },

  // Update journey
  async updateJourney(id, data) {
    try {
      const response = await api.put(`/journeys/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating journey:', error)
      throw error
    }
  },

  // Delete journey
  async deleteJourney(id) {
    try {
      const response = await api.delete(`/journeys/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting journey:', error)
      throw error
    }
  },

  // Run journey on contact
  async runJourneyOnContact(journeyId, contactId) {
    try {
      const response = await api.post(`/journeys/${journeyId}/run/${contactId}`)
      return response.data
    } catch (error) {
      console.error('Error running journey on contact:', error)
      throw error
    }
  },

  // Get journey executions
  async getJourneyExecutions(journeyId, params = {}) {
    try {
      const response = await api.get(`/journeys/${journeyId}/executions`, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching journey executions:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            {
              id: 101,
              contact: {
                id: 201,
                name: 'John Smith',
                email: 'john.smith@techcorp.com'
              },
              status: 'running',
              current_step: 2,
              progress_percentage: 50,
              started_at: '2024-12-10T10:00:00Z',
              next_step_at: '2024-12-12T10:00:00Z',
              completed_steps: 1,
              total_steps: 4
            },
            {
              id: 102,
              contact: {
                id: 202,
                name: 'Sarah Johnson',
                email: 'sarah.j@innovation.com'
              },
              status: 'completed',
              current_step: 4,
              progress_percentage: 100,
              started_at: '2024-12-08T14:30:00Z',
              completed_at: '2024-12-10T14:30:00Z',
              completed_steps: 4,
              total_steps: 4
            },
            {
              id: 103,
              contact: {
                id: 203,
                name: 'Mike Wilson',
                email: 'mike.w@futuretech.com'
              },
              status: 'running',
              current_step: 3,
              progress_percentage: 75,
              started_at: '2024-12-09T09:15:00Z',
              next_step_at: '2024-12-11T09:15:00Z',
              completed_steps: 2,
              total_steps: 4
            }
          ],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: 3,
            from: 1,
            to: 3
          }
        }
      }
      
      throw error
    }
  },

  // Get journeys analytics
  async getJourneysAnalytics(params = {}) {
    try {
      const response = await api.get('/analytics/journeys', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching journeys analytics:', error)
      
      // Return fallback data for development/demo purposes
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.log('Journeys analytics API timeout - using fallback data')
        return {
          data: {
            summary: {
              total_journeys: 12,
              active_journeys: 8,
              draft_journeys: 3,
              paused_journeys: 1,
              total_executions: 2847,
              active_executions: 498,
              completed_executions: 2349,
              avg_completion_rate: 78.5,
              total_contacts_in_journeys: 1247
            },
            journey_performance: [
              {
                journey_id: 1,
                journey_name: 'New Lead Welcome Journey',
                total_executions: 1247,
                completed_executions: 978,
                completion_rate: 78.5,
                avg_duration_hours: 72.5,
                conversion_rate: 15.2
              },
              {
                journey_id: 2,
                journey_name: 'Product Trial Journey',
                total_executions: 892,
                completed_executions: 751,
                completion_rate: 84.2,
                avg_duration_hours: 168.3,
                conversion_rate: 22.8
              },
              {
                journey_id: 3,
                journey_name: 'Customer Retention Journey',
                total_executions: 456,
                completed_executions: 389,
                completion_rate: 85.3,
                avg_duration_hours: 96.7,
                conversion_rate: 18.9
              }
            ],
            step_performance: [
              {
                step_type: 'email',
                total_executions: 4567,
                success_rate: 94.2,
                avg_open_rate: 28.5,
                avg_click_rate: 8.7
              },
              {
                step_type: 'wait',
                total_executions: 2341,
                success_rate: 99.8,
                avg_duration_hours: 48.2
              },
              {
                step_type: 'condition',
                total_executions: 1234,
                success_rate: 97.1,
                true_branch_rate: 34.2
              },
              {
                step_type: 'task',
                total_executions: 567,
                success_rate: 89.3,
                completion_rate: 76.8
              }
            ],
            execution_trends: [
              { date: '2024-12-04', started: 45, completed: 38, failed: 2 },
              { date: '2024-12-05', started: 52, completed: 44, failed: 1 },
              { date: '2024-12-06', started: 48, completed: 41, failed: 3 },
              { date: '2024-12-07', started: 61, completed: 52, failed: 2 },
              { date: '2024-12-08', started: 55, completed: 47, failed: 1 },
              { date: '2024-12-09', started: 67, completed: 58, failed: 2 },
              { date: '2024-12-10', started: 73, completed: 62, failed: 3 }
            ],
            top_performing_journeys: [
              {
                journey_name: 'Product Trial Journey',
                completion_rate: 84.2,
                conversion_rate: 22.8,
                total_revenue: 45600,
                contacts_converted: 203
              },
              {
                journey_name: 'Customer Retention Journey',
                completion_rate: 85.3,
                conversion_rate: 18.9,
                total_revenue: 28900,
                contacts_converted: 86
              },
              {
                journey_name: 'New Lead Welcome Journey',
                completion_rate: 78.5,
                conversion_rate: 15.2,
                total_revenue: 34200,
                contacts_converted: 189
              }
            ],
            step_analytics: [
              {
                step_type: 'email',
                total_steps: 45,
                avg_open_rate: 28.5,
                avg_click_rate: 8.7,
                avg_unsubscribe_rate: 0.8
              },
              {
                step_type: 'wait',
                total_steps: 23,
                avg_duration_hours: 48.2,
                completion_rate: 99.8
              },
              {
                step_type: 'condition',
                total_steps: 18,
                true_branch_rate: 34.2,
                false_branch_rate: 65.8
              },
              {
                step_type: 'task',
                total_steps: 12,
                completion_rate: 76.8,
                avg_completion_time_hours: 24.5
              }
            ],
            period: 'last_7_days',
            last_updated: '2024-01-20T15:30:00Z'
          }
        }
      }
      
      throw error
    }
  },

  // Get customer journey by email
  async getCustomerJourney(email) {
    try {
      const response = await api.get('/journeys/customer', { params: { email } })
      
      // Transform backend response to match frontend expectations
      if (response.data && response.data.data) {
        const backendData = response.data.data
        
        // Transform timeline to journey_entries format
        const transformedData = {
          ...response.data,
          data: {
            ...backendData,
            journey_entries: backendData.timeline || backendData.journey_entries || []
          }
        }
        
        return transformedData
      }
      
      return response.data
    } catch (error) {
      console.error('Error fetching customer journey:', error)
      
      // Return fallback data for development/demo purposes
      console.log('Customer journey API failed - using fallback data')
      
      // Generate demo data based on email
      const contactName = email.split('@')[0]
      const formattedName = contactName.charAt(0).toUpperCase() + contactName.slice(1).replace(/[._-]/g, ' ')
      
      return {
        data: {
          contact: {
            id: 201,
            name: formattedName,
            email: email,
            company: 'Tech Solutions Inc',
            created_at: '2024-11-15T10:00:00Z'
          },
          journey_entries: [
            {
              id: 1,
              type: 'contact_creation',
              title: 'Contact Created',
              description: 'Contact created via website form submission',
              status: 'success',
              timestamp: '2024-11-15T10:00:00Z',
              metadata: {
                source: 'website_form',
                form_name: 'Contact Us Form'
              }
            },
            {
              id: 2,
              type: 'welcome_email',
              title: 'Welcome Email Sent',
              description: 'Welcome email sent to new contact',
              status: 'success',
              timestamp: '2024-11-15T10:05:00Z',
              metadata: {
                template_id: 'welcome_001',
                subject: 'Welcome to our platform!'
              }
            },
            {
              id: 3,
              type: 'email_opened',
              title: 'Welcome Email Opened',
              description: 'Welcome email was opened by contact',
              status: 'success',
              timestamp: '2024-11-15T14:30:00Z',
              metadata: {
                open_count: 1,
                device: 'desktop'
              }
            },
            {
              id: 4,
              type: 'company_creation',
              title: 'Company Created',
              description: 'Company profile created for contact',
              status: 'success',
              timestamp: '2024-11-16T09:15:00Z',
              metadata: {
                company_name: 'Tech Solutions Inc',
                industry: 'Technology'
              }
            },
            {
              id: 5,
              type: 'deal_proposed',
              title: 'Deal Proposed',
              description: 'Sales deal proposed to contact',
              status: 'success',
              timestamp: '2024-11-18T11:20:00Z',
              metadata: {
                deal_value: 75000,
                deal_stage: 'proposal',
                sales_rep: 'Sarah Johnson'
              }
            },
            {
              id: 6,
              type: 'engagement_email',
              title: 'Engagement Email Sent',
              description: 'Follow-up email with product information sent',
              status: 'success',
              timestamp: '2024-11-20T08:45:00Z',
              metadata: {
                template_id: 'product_info_001',
                subject: 'Learn more about our solutions'
              }
            },
            {
              id: 7,
              type: 'email_opened',
              title: 'Engagement Email Opened',
              description: 'Engagement email was opened by contact',
              status: 'success',
              timestamp: '2024-11-20T16:22:00Z',
              metadata: {
                open_count: 1,
                device: 'mobile'
              }
            },
            {
              id: 8,
              type: 'deal_outcome',
              title: 'Deal Outcome',
              description: 'Deal status updated to negotiation',
              status: 'pending',
              timestamp: '2024-11-22T10:00:00Z',
              metadata: {
                deal_value: 75000,
                deal_stage: 'negotiation',
                expected_close: '2024-12-15'
              }
            }
          ]
        }
      }
    }
  }
}

// Helper functions for journeys data processing
export const journeysHelpers = {
  // Get status color
  getStatusColor(status) {
    const colors = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-blue-100 text-blue-800',
      paused: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  },

  // Get status text
  getStatusText(status) {
    const texts = {
      active: 'Active',
      draft: 'Draft',
      paused: 'Paused',
      archived: 'Archived'
    }
    return texts[status] || 'Unknown'
  },

  // Get execution status color
  getExecutionStatusColor(status) {
    const colors = {
      running: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      paused: 'bg-yellow-100 text-yellow-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  },

  // Get step type icon
  getStepTypeIcon(type) {
    const icons = {
      email: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      wait: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      condition: 'M8 9l4-4 4 4m0 6l-4 4-4-4',
      webhook: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
      score: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      tag: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      sms: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      task: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
    }
    return icons[type] || 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },

  // Format date
  formatDate(dateString) {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  },

  // Format date with time
  formatDateTime(dateString) {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  // Format number with commas
  formatNumber(num) {
    if (typeof num !== 'number') return num
    return num.toLocaleString()
  },

  // Calculate progress percentage
  calculateProgress(completed, total) {
    if (!total || total === 0) return 0
    return Math.round((completed / total) * 100)
  },

  // Get progress color
  getProgressColor(percentage) {
    if (percentage >= 80) return 'bg-green-600'
    if (percentage >= 60) return 'bg-blue-600'
    if (percentage >= 40) return 'bg-yellow-600'
    return 'bg-red-600'
  },

  // Validate step configuration
  validateStepConfig(stepType, config) {
    // Basic validation - can be extended based on step type
    if (!config || typeof config !== 'object') return false
    
    // Add specific validation logic based on step type
    switch (stepType) {
      case 'email':
        return config.template_id || config.subject
      case 'wait':
        return config.duration && config.unit
      case 'condition':
        return config.field && config.operator && config.value
      case 'webhook':
        return config.url && config.method
      default:
        return true
    }
  },

  // Format step configuration for display
  formatStepConfig(stepType, config) {
    if (!config) return 'No configuration'
    
    switch (stepType) {
      case 'email':
        return `Template: ${config.template_id || 'Custom'} | Subject: ${config.subject || 'N/A'}`
      case 'wait':
        return `Wait ${config.duration} ${config.unit}`
      case 'condition':
        return `${config.field} ${config.operator} ${config.value}`
      case 'webhook':
        return `${config.method} ${config.url}`
      case 'task':
        return `Type: ${config.task_type} | Priority: ${config.priority}`
      default:
        return JSON.stringify(config)
    }
  },

  // Get journey entry type icon
  getJourneyEntryIcon(type) {
    const icons = {
      contact_creation: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      contact_created: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      welcome_email: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      email_opened: 'M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828zM4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z',
      company_creation: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      deal_proposed: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      engagement_email: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      deal_outcome: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
      buyer_intent: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
    }
    return icons[type] || 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },

  // Get journey entry type color
  getJourneyEntryColor(type) {
    const colors = {
      contact_creation: 'text-blue-600 bg-blue-100',
      contact_created: 'text-blue-600 bg-blue-100',
      welcome_email: 'text-green-600 bg-green-100',
      email_opened: 'text-green-600 bg-green-100',
      company_creation: 'text-purple-600 bg-purple-100',
      deal_proposed: 'text-orange-600 bg-orange-100',
      engagement_email: 'text-indigo-600 bg-indigo-100',
      deal_outcome: 'text-yellow-600 bg-yellow-100',
      buyer_intent: 'text-pink-600 bg-pink-100'
    }
    return colors[type] || 'text-gray-600 bg-gray-100'
  },

  // Get journey entry status color
  getJourneyEntryStatusColor(status) {
    const colors = {
      success: 'text-green-800 bg-green-100',
      pending: 'text-yellow-800 bg-yellow-100',
      failed: 'text-red-800 bg-red-100'
    }
    return colors[status] || 'text-gray-800 bg-gray-100'
  },

  // Format journey entry timestamp
  formatJourneyTimestamp(timestamp) {
    if (!timestamp) return 'Unknown'
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}