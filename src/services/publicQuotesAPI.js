import axios from 'axios'

// Use environment variable for API base URL
const base = import.meta.env.VITE_API_BASE_URL || '/api'

// Create axios instance for public quotes (no auth required)
const publicAPI = axios.create({
  baseURL: base,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export const publicQuotesAPI = {
  /**
   * Get public quote by UUID
   * @param {string} uuid - Quote UUID
   * @returns {Promise} API response
   */
  get(uuid) {
    return publicAPI.get(`/public/quotes/${uuid}`)
  },

  /**
   * Accept quote by UUID
   * @param {string} uuid - Quote UUID
   * @returns {Promise} API response
   */
  accept(uuid) {
    return publicAPI.post(`/public/quotes/${uuid}/accept`)
  },

  /**
   * Reject quote by UUID
   * @param {string} uuid - Quote UUID
   * @returns {Promise} API response
   */
  reject(uuid) {
    return publicAPI.post(`/public/quotes/${uuid}/reject`)
  }
}
