import api from './api'

export const featuresAPI = {
  // Get feature statuses
  async getFeatureStatuses() {
    try {
      const response = await api.get('/features/status')
      return response.data
    } catch (error) {
      console.error('Error fetching feature statuses:', error)
      throw error
    }
  },
  
  // Get feature by name
  async getFeature(featureName) {
    try {
      const response = await api.get(`/features/${featureName}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching feature ${featureName}:`, error)
      throw error
    }
  },
  
  // Update feature status
  async updateFeatureStatus(featureName, status) {
    try {
      const response = await api.put(`/features/${featureName}/status`, { status })
      return response.data
    } catch (error) {
      console.error(`Error updating feature ${featureName} status:`, error)
      throw error
    }
  }
}

export default featuresAPI