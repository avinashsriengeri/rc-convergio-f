import api from '@/services/api'

// HR Module API endpoints
export const hrAPI = {
  // ==================== Departments Management ====================
  
  // Get all departments
  getDepartments: (params = {}) => api.get('/hr/departments', { params }),
  
  // Get department by ID
  getDepartment: (id) => api.get(`/hr/departments/${id}`),
  
  // Create department
  createDepartment: (data) => api.post('/hr/departments', data),
  
  // Update department
  updateDepartment: (id, data) => api.put(`/hr/departments/${id}`, data),
  
  // Delete department
  deleteDepartment: (id) => api.delete(`/hr/departments/${id}`),
  
  // ==================== Designations Management ====================
  
  // Get all designations
  getDesignations: (params = {}) => api.get('/hr/designations', { params }),
  
  // Get designation by ID
  getDesignation: (id) => api.get(`/hr/designations/${id}`),
  
  // Get designations by department (NEW)
  getDesignationsByDepartment: (departmentId) => api.get(`/hr/designations/by-department/${departmentId}`),
  
  // Create designation
  createDesignation: (data) => api.post('/hr/designations', data),
  
  // Update designation
  updateDesignation: (id, data) => api.put(`/hr/designations/${id}`, data),
  
  // Delete designation
  deleteDesignation: (id) => api.delete(`/hr/designations/${id}`),
  
  // ==================== Employee Management ====================
  
  // Get all employees with optional filters
  getEmployees: (params = {}) => api.get('/hr/employees', { params }),
  
  // Search employees
  searchEmployees: (query, params = {}) => api.get('/hr/employees/search', { params: { q: query, ...params } }),
  
  // Get employee by ID
  getEmployee: (id) => api.get(`/hr/employees/${id}`),
  
  // Get available managers (filtered by is_manager = true)
  getManagers: (params = {}) => api.get('/hr/employees/managers', { params }),
  
  // Create new employee (onboarding) - supports multipart/form-data
  createEmployee: (data) => {
    // Check if data contains file (profile_picture)
    if (data.profile_picture || data instanceof FormData) {
      const formData = data instanceof FormData ? data : new FormData()
      
      if (!(data instanceof FormData)) {
        Object.keys(data).forEach(key => {
          if (key === 'profile_picture' && data[key]) {
            formData.append('profile_picture', data[key])
          } else if (key === 'user_account' && typeof data[key] === 'object') {
            // Handle nested user_account object
            Object.keys(data[key]).forEach(subKey => {
              formData.append(`user_account[${subKey}]`, data[key][subKey])
            })
          } else if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key])
          }
        })
      }
      
      return api.post('/hr/employees', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
    
    return api.post('/hr/employees', data)
  },
  
  // Update employee - supports multipart/form-data
  updateEmployee: (id, data) => {
    // Check if data is FormData (for file uploads or multipart)
    if (data instanceof FormData) {
      return api.put(`/hr/employees/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
    return api.put(`/hr/employees/${id}`, data)
  },
  
  // Activate employee (onboarding -> active)
  activateEmployee: (id) => api.post(`/hr/employees/${id}/activate`),
  
  // Archive employee (offboarding)
  archiveEmployee: (id, data) => api.delete(`/hr/employees/${id}`, { data }),
  
  // ==================== Leave Management ====================
  
  // Get leave balances
  getLeaveBalances: (params = {}) => api.get('/hr/leave/balances', { params }),
  
  // Adjust leave balance (HR Admin only)
  adjustLeaveBalance: (data) => api.post('/hr/leave/balances/adjust', data),
  
  // Get leave requests
  getLeaveRequests: (params = {}) => api.get('/hr/leave/requests', { params }),
  
  // Get leave request by ID
  getLeaveRequest: (id) => api.get(`/hr/leave/requests/${id}`),
  
  // Create leave request
  createLeaveRequest: (data) => api.post('/hr/leave/requests', data),
  
  // Cancel leave request
  cancelLeaveRequest: (id) => api.post(`/hr/leave/requests/${id}/cancel`),
  
  // Get leave calendar (Manager view)
  getLeaveCalendar: (params = {}) => api.get('/hr/leave/calendar', { params }),
  
  // Get leave types
  getLeaveTypes: () => api.get('/hr/leave/types'),
  
  // ==================== Payslip Management ====================
  
  // Get payslips
  getPayslips: (params = {}) => api.get('/hr/payslips', { params }),
  
  // Get payslip by ID
  getPayslip: (id) => api.get(`/hr/payslips/${id}`),
  
  // Upload payslip (HR Admin only)
  uploadPayslip: (data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (key === 'file') {
        formData.append('file', data[key])
      } else {
        formData.append(key, data[key])
      }
    })
    return api.post('/hr/payslips', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // Download payslip
  downloadPayslip: (id) => api.get(`/hr/payslips/${id}/download`, { responseType: 'blob' }),
  
  // Delete payslip (HR Admin only)
  deletePayslip: (id) => api.delete(`/hr/payslips/${id}`),
  
  // Get employee payslips
  getEmployeePayslips: (employeeId, params = {}) => api.get(`/hr/employees/${employeeId}/payslips`, { params }),
  
  // ==================== Document Management ====================
  
  // Get employee documents
  getEmployeeDocuments: (employeeId, params = {}) => api.get(`/hr/employees/${employeeId}/documents`, { params }),
  
  // Upload employee document (HR Admin only) - Enhanced with document_type_id
  uploadEmployeeDocument: (employeeId, data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (key === 'file') {
        formData.append('file', data[key])
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    return api.post(`/hr/employees/${employeeId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // Download document
  downloadDocument: (employeeId, documentId) => api.get(`/hr/employees/${employeeId}/documents/${documentId}/download`, { responseType: 'blob' }),
  
  // Preview document (same pattern as download - uses Authorization header)
  previewDocument: (employeeId, documentId) => api.get(`/hr/employees/${employeeId}/documents/${documentId}/preview`, { responseType: 'blob' }),
  
  // Verify document (HR Admin only)
  verifyDocument: (employeeId, documentId) => api.post(`/hr/employees/${employeeId}/documents/${documentId}/verify`),
  
  // Reject document (HR Admin only)
  rejectDocument: (employeeId, documentId, data) => api.post(`/hr/employees/${employeeId}/documents/${documentId}/reject`, data),
  
  // Delete document (HR Admin only)
  deleteDocument: (employeeId, documentId) => api.delete(`/hr/employees/${employeeId}/documents/${documentId}`),
  
  // ==================== Performance Notes ====================
  
  // Get performance notes
  getPerformanceNotes: (employeeId, params = {}) => api.get(`/hr/employees/${employeeId}/performance-notes`, { params }),
  
  // Get performance note by ID
  getPerformanceNote: (employeeId, noteId) => api.get(`/hr/employees/${employeeId}/performance-notes/${noteId}`),
  
  // Create performance note
  createPerformanceNote: (employeeId, data) => api.post(`/hr/employees/${employeeId}/performance-notes`, data),
  
  // Update performance note
  updatePerformanceNote: (employeeId, noteId, data) => api.put(`/hr/employees/${employeeId}/performance-notes/${noteId}`, data),
  
  // Delete performance note
  deletePerformanceNote: (employeeId, noteId) => api.delete(`/hr/employees/${employeeId}/performance-notes/${noteId}`),
  
  // ==================== Dashboards ====================
  
  // HR Admin dashboard
  getHrAdminDashboard: () => api.get('/hr/dashboard'),
  
  // Manager dashboard
  getManagerDashboard: () => api.get('/hr/dashboard/manager'),
  
  // Employee dashboard
  getEmployeeDashboard: () => api.get('/hr/dashboard/employee'),
  
  // ==================== Onboarding Management ====================
  
  // Get onboarding employees
  getOnboardingEmployees: (params = {}) => api.get('/hr/onboarding/employees', { params }),
  
  // Get employee onboarding progress
  getEmployeeOnboardingProgress: (employeeId) => api.get(`/hr/employees/${employeeId}/onboarding/progress`),
  
  // Get employee onboarding details
  getEmployeeOnboarding: (employeeId) => api.get(`/hr/employees/${employeeId}/onboarding`),
  
  // Get employee onboarding checklist
  getEmployeeOnboardingChecklist: (employeeId) => api.get(`/hr/employees/${employeeId}/onboarding/checklist`),
  
  // Get employee onboarding tasks
  getEmployeeOnboardingTasks: (employeeId) => api.get(`/hr/employees/${employeeId}/onboarding/tasks`),
  
  // Complete checklist item
  completeChecklistItem: (employeeId, itemId, data = {}) => api.post(`/hr/employees/${employeeId}/onboarding/checklist/${itemId}/complete`, data),
  
  // Update onboarding task
  updateOnboardingTask: (employeeId, taskId, data) => api.put(`/hr/employees/${employeeId}/onboarding/tasks/${taskId}`, data),
  
  // Complete onboarding
  completeOnboarding: (employeeId, data = {}) => api.post(`/hr/employees/${employeeId}/onboarding/complete`, data),
  
  // Get my onboarding tasks
  getMyOnboardingTasks: (params = {}) => api.get('/hr/onboarding/my-tasks', { params }),
  
  // Send onboarding reminder
  sendOnboardingReminder: (employeeId) => api.post(`/hr/employees/${employeeId}/onboarding/reminder`),
  
  // ==================== Onboarding Template Management ====================
  
  // Get onboarding templates
  getOnboardingTemplates: (params = {}) => api.get('/hr/onboarding/templates', { params }),
  
  // Get onboarding template by ID
  getOnboardingTemplate: (id) => api.get(`/hr/onboarding/templates/${id}`),
  
  // Create onboarding template
  createOnboardingTemplate: (data) => api.post('/hr/onboarding/templates', data),
  
  // Update onboarding template
  updateOnboardingTemplate: (id, data) => api.put(`/hr/onboarding/templates/${id}`, data),
  
  // Delete onboarding template
  deleteOnboardingTemplate: (id) => api.delete(`/hr/onboarding/templates/${id}`),

  // ==================== Induction & Training Management ====================

  // HR Admin - Content Management
  getInductionContents: (params = {}) => api.get('/hr/induction/contents', { params }),
  getInductionContent: (id) => api.get(`/hr/induction/contents/${id}`),
  createInductionContent: (data) => api.post('/hr/induction/contents', data),
  updateInductionContent: (id, data) => api.put(`/hr/induction/contents/${id}`, data),
  publishInductionContent: (id) => api.post(`/hr/induction/contents/${id}/publish`),
  deleteInductionContent: (id) => api.delete(`/hr/induction/contents/${id}`),

  // HR Admin - Tracking
  getInductionTracking: (params = {}) => api.get('/hr/induction/tracking', { params }),
  getEmployeeInductionProgress: (employeeId) => api.get(`/hr/induction/employees/${employeeId}/progress`),
  sendInductionReminders: (data) => api.post('/hr/induction/reminders', data),

  // Employee - My Induction
  getMyInduction: (params = {}) => api.get('/employee/induction', { params }),
  viewInductionContent: (assignmentId) => api.get(`/employee/induction/${assignmentId}/view`),
  startInductionContent: (assignmentId) => api.post(`/employee/induction/${assignmentId}/start`),
  acknowledgeInductionContent: (assignmentId, data = {}) => api.post(`/employee/induction/${assignmentId}/acknowledge`, data),

  // ==================== Document Types Management ====================
  
  // HR Admin - Document Types
  getDocumentTypes: (params = {}) => api.get('/hr/document-types', { params }),
  getDocumentType: (id) => api.get(`/hr/document-types/${id}`),
  createDocumentType: (data) => api.post('/hr/document-types', data),
  updateDocumentType: (id, data) => api.put(`/hr/document-types/${id}`, data),
  deleteDocumentType: (id) => api.delete(`/hr/document-types/${id}`),

  // Employee - My Documents
  getMyDocuments: (params = {}) => api.get('/employee/documents', { params }),
  getMyDocumentTypes: () => api.get('/employee/documents/document-types'),
  getMissingMandatoryDocuments: () => api.get('/employee/documents/missing-mandatory'),
  downloadMyDocument: (documentId) => api.get(`/employee/documents/${documentId}/download`, { responseType: 'blob' }),
  uploadMyDocument: (data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (key === 'file') {
        formData.append('file', data[key])
      } else {
        formData.append(key, data[key])
      }
    })
    return api.post('/employee/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // ==================== KPI Management ====================
  
  // HR Admin - KPI Templates
  getKpiTemplates: (params = {}) => api.get('/hr/kpi/templates', { params }),
  getKpiTemplate: (id) => api.get(`/hr/kpi/templates/${id}`),
  createKpiTemplate: (data) => api.post('/hr/kpi/templates', data),
  updateKpiTemplate: (id, data) => api.put(`/hr/kpi/templates/${id}`, data),
  deleteKpiTemplate: (id) => api.delete(`/hr/kpi/templates/${id}`),
  
  // HR Admin - KPI Assignment
  assignKpiTemplate: (data) => api.post('/hr/kpi/templates/assign', data),
  
  // HR Admin - KPI Analytics
  getKpiAnalytics: (params = {}) => api.get('/hr/kpi/analytics', { params }),
  
  // Manager - KPI Reviews
  getMyTeamKpiReviews: (params = {}) => api.get('/hr/kpi/reviews/my-team', { params }),
  getKpiReview: (id) => api.get(`/hr/kpi/reviews/${id}`),
  submitManagerReview: (id, data) => api.post(`/hr/kpi/reviews/${id}/manager-review`, data),
  
  // Employee - KPI
  getMyKpiAssignments: (params = {}) => api.get('/employee/kpi', { params }),
  getMyKpiAssignment: (id) => api.get(`/employee/kpi/${id}`),
  submitSelfReview: (id, data) => api.post(`/employee/kpi/${id}/self-review`, data),
  getMyKpiHistory: (params = {}) => api.get('/employee/kpi/history', { params }),

  // ==================== Announcement Management ====================
  
  // HR Admin - Announcements
  getAnnouncements: (params = {}) => api.get('/hr/announcements', { params }),
  getAnnouncement: (id) => api.get(`/hr/announcements/${id}`),
  createAnnouncement: (data) => api.post('/hr/announcements', data),
  updateAnnouncement: (id, data) => api.put(`/hr/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/hr/announcements/${id}`),
  publishAnnouncement: (id) => api.post(`/hr/announcements/${id}/publish`),
  archiveAnnouncement: (id) => api.post(`/hr/announcements/${id}/archive`),
  getAnnouncementAnalytics: (params = {}) => api.get('/hr/announcements/analytics', { params }),
  sendAnnouncementReminders: (id) => api.post(`/hr/announcements/${id}/remind`),

  // Employee - Announcements
  getEmployeeAnnouncements: (params = {}) => api.get('/employee/announcements', { params }),
  getEmployeeAnnouncement: (id) => api.get(`/employee/announcements/${id}`),
  markAnnouncementAsViewed: (id) => api.post(`/employee/announcements/${id}/view`),
  acknowledgeAnnouncement: (id) => api.post(`/employee/announcements/${id}/acknowledge`),
  toggleAnnouncementLike: (id) => api.post(`/employee/announcements/${id}/like`),
  addAnnouncementComment: (id, data) => api.post(`/employee/announcements/${id}/comment`, data),
  deleteAnnouncementComment: (announcementId, commentId) => api.delete(`/employee/announcements/${announcementId}/comment/${commentId}`)
}

export default hrAPI

