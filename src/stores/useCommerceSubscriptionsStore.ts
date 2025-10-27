import { defineStore } from 'pinia'
import { commerceAPI } from '@/services/api.js'

export const useCommerceSubscriptionsStore = defineStore('commerceSubscriptions', {
  state: () => ({
    // Subscription Plans
    plans: [],
    plansMeta: null, // Store pagination and metadata from backend
    plansLoading: false,
    plansError: null,
    
    // Subscriptions
    subscriptions: [],
    subscriptionsLoading: false,
    subscriptionsError: null,
    
    // Selected subscription for details
    selectedSubscription: null,
    
    // Analytics
    analytics: {
      activeSubscriptions: 0,
      monthlyRecurringRevenue: 0,
      churnRate: 0,
      revenueThisMonth: 0,
      mrrTrend: []
    },
    analyticsLoading: false,
    analyticsError: null,
    
    // General loading and error states
    loading: false,
    error: null,
    
    // Invoice preview
    invoicePreview: null,
    
    // Activity
    activity: [],
    activityLoading: false,
    activityError: null
  }),

  getters: {
    // Get active plans
    activePlans: (state) => state.plans.filter(plan => plan.active !== false),
    
    // Get active plans count from backend response
    activePlansCount: (state) => {
      console.log('=== ACTIVE PLANS COUNT DEBUG ===')
      console.log('plansMeta:', state.plansMeta)
      console.log('active_count from meta:', state.plansMeta?.active_count)
      console.log('plans length:', state.plans.length)
      console.log('plans with active !== false:', state.plans.filter(plan => plan.active !== false).length)
      
      const count = state.plansMeta?.active_count || state.plans.filter(plan => plan.active !== false).length
      console.log('Final active plans count:', count)
      return count
    },
    
    // Get active subscriptions
    activeSubscriptions: (state) => state.subscriptions.filter(sub => sub.status === 'active'),
    
    // Get trialing subscriptions
    trialingSubscriptions: (state) => state.subscriptions.filter(sub => sub.status === 'trialing'),
    
    // Get cancelled subscriptions
    cancelledSubscriptions: (state) => state.subscriptions.filter(sub => sub.status === 'cancelled'),
    
    // Get past due subscriptions
    pastDueSubscriptions: (state) => state.subscriptions.filter(sub => sub.status === 'past_due'),
    
    // Get subscription by ID
    getSubscriptionById: (state) => (id) => state.subscriptions.find(sub => sub.id === id),
    
    // Get plan by ID
    getPlanById: (state) => (id) => state.plans.find(plan => plan.id === id)
  },

  actions: {
    // Subscription Plans Actions
    async fetchPlans() {
      this.plansLoading = true
      this.plansError = null
      try {
        const response = await commerceAPI.getSubscriptionPlans()
        console.log('fetchPlans response:', response)
        console.log('response.data:', response.data)
        
        // Handle the response structure: response.data = { success: true, data: { data: [...] } }
        if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
          // Backend returns paginated response wrapped in success object
          this.plans = response.data.data.data
          this.plansMeta = response.data.data // Store metadata including active_count
          console.log('Plans set from paginated response:', this.plans.length, 'plans')
          console.log('Plans metadata:', this.plansMeta)
          console.log('Active count from backend:', this.plansMeta?.active_count)
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          // Backend returns direct array in data
          this.plans = response.data.data
          this.plansMeta = response.data // Store metadata
          console.log('Plans set from direct data array:', this.plans.length, 'plans')
        } else if (Array.isArray(response.data)) {
          // Backend returns direct array
          this.plans = response.data
          this.plansMeta = null
          console.log('Plans set from direct array:', this.plans.length, 'plans')
        } else {
          this.plans = []
          this.plansMeta = null
          console.error('No valid data found in response')
        }
      } catch (error) {
        this.plansError = error.response?.data?.message || 'Failed to fetch subscription plans'
        console.error('Error fetching subscription plans:', error)
        // Fallback to mock data for development
        this.plans = [
          {
            id: 1,
            name: 'Basic Plan',
            description: 'Perfect for small businesses',
            price: 29.99,
            currency: 'usd',
            interval: 'month',
            trial_days: 7,
            stripe_price_id: 'price_basic_monthly',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: 2,
            name: 'Pro Plan',
            description: 'For growing businesses',
            price: 99.99,
            currency: 'usd',
            interval: 'month',
            trial_days: 14,
            stripe_price_id: 'price_pro_monthly',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
          }
        ]
      } finally {
        this.plansLoading = false
      }
    },

    async createPlan(planData) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.createSubscriptionPlan(planData)
        await this.fetchPlans() // Refresh the list
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create subscription plan'
        console.error('Error creating subscription plan:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePlan(id, planData) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.updateSubscriptionPlan(id, planData)
        await this.fetchPlans() // Refresh the list
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update subscription plan'
        console.error('Error updating subscription plan:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deletePlan(id) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.deleteSubscriptionPlan(id)
        await this.fetchPlans() // Refresh the list
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete subscription plan'
        console.error('Error deleting subscription plan:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Subscriptions Actions
    async fetchSubscriptions() {
      this.subscriptionsLoading = true
      this.subscriptionsError = null
      try {
        const response = await commerceAPI.getSubscriptions()
        console.log('fetchSubscriptions response:', response)
        console.log('response.data:', response.data)
        
        // Handle the response structure: response.data = { success: true, data: { data: [...] } }
        if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
          // Backend returns paginated response wrapped in success object
          this.subscriptions = response.data.data.data
          console.log('Subscriptions set from paginated response:', this.subscriptions.length, 'subscriptions')
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          // Backend returns direct array in data
          this.subscriptions = response.data.data
          console.log('Subscriptions set from direct data array:', this.subscriptions.length, 'subscriptions')
        } else if (Array.isArray(response.data)) {
          // Backend returns direct array
          this.subscriptions = response.data
          console.log('Subscriptions set from direct array:', this.subscriptions.length, 'subscriptions')
        } else {
          this.subscriptions = []
          console.error('No valid subscription data found in response')
        }
      } catch (error) {
        this.subscriptionsError = error.response?.data?.message || 'Failed to fetch subscriptions'
        console.error('Error fetching subscriptions:', error)
        // Fallback to mock data for development
        this.subscriptions = [
          {
            id: 1,
            customer_email: 'customer@example.com',
            customer_name: 'John Doe',
            plan_id: 1,
            plan_name: 'Basic Plan',
            status: 'active',
            current_period_start: '2024-01-01T00:00:00Z',
            current_period_end: '2024-02-01T00:00:00Z',
            cancel_at_period_end: false,
            created_at: '2024-01-01T00:00:00Z',
            plan: {
              id: 1,
              name: 'Basic Plan',
              amount_cents: 2999,
              currency: 'usd',
              interval: 'monthly'
            }
          },
          {
            id: 2,
            customer_email: 'customer2@example.com',
            customer_name: 'Jane Smith',
            plan_id: 2,
            plan_name: 'Pro Plan',
            status: 'trialing',
            current_period_start: '2024-01-15T00:00:00Z',
            current_period_end: '2024-02-15T00:00:00Z',
            cancel_at_period_end: false,
            created_at: '2024-01-15T00:00:00Z',
            plan: {
              id: 2,
              name: 'Pro Plan',
              amount_cents: 9999,
              currency: 'usd',
              interval: 'monthly'
            }
          }
        ]
      } finally {
        this.subscriptionsLoading = false
      }
    },

    async getSubscription(id) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getSubscription(id)
        console.log('Single subscription response:', response)
        
        // Handle the response structure
        if (response.data?.data) {
          this.selectedSubscription = response.data.data
          console.log('Selected subscription set:', this.selectedSubscription)
        } else if (response.data) {
          this.selectedSubscription = response.data
          console.log('Selected subscription set (direct):', this.selectedSubscription)
        } else {
          throw new Error('No subscription data found in response')
        }
        
        return this.selectedSubscription
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch subscription details'
        console.error('Error fetching subscription:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async cancelSubscription(id, atPeriodEnd = true) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.cancelSubscription(id, { at_period_end: atPeriodEnd })
        await this.fetchSubscriptions() // Refresh the list
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to cancel subscription'
        console.error('Error cancelling subscription:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async changePlan(id, newPlanId) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.changePlan(id, { new_plan_id: newPlanId })
        await this.fetchSubscriptions() // Refresh the list
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to change subscription plan'
        console.error('Error changing subscription plan:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async openPortal(id) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.openPortal(id)
        // Redirect to Stripe billing portal
        if (response.data.portal_url) {
          window.open(response.data.portal_url, '_blank')
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to open billing portal'
        console.error('Error opening billing portal:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Checkout Actions
    async createCheckoutSession(planId, customerEmail, customerName = null) {
      this.loading = true
      this.error = null
      try {
        // Generate return and cancel URLs for the checkout session
        const baseUrl = window.location.origin
        const returnUrl = `${baseUrl}/commerce/subscription-checkout/success`
        const cancelUrl = `${baseUrl}/commerce/subscription-plans`
        
        // Find the plan to get the Stripe price ID
        const plan = this.plans.find(p => p.id === planId)
        const stripePriceId = plan?.stripe_price_id
        
        const payload = {
          plan_id: planId,
          customer_email: customerEmail,
          customer_name: customerName || customerEmail.split('@')[0], // Use provided name or extract from email
          return_url: returnUrl,
          cancel_url: cancelUrl
        }
        
        // Add Stripe price ID if available
        if (stripePriceId) {
          payload.stripe_price_id = stripePriceId
        }
        
        console.log('Creating checkout session with payload:', payload)
        console.log('Payload keys:', Object.keys(payload))
        console.log('Payload values:', Object.values(payload))
        console.log('Timestamp:', new Date().toISOString())
        
        const response = await commerceAPI.createCheckoutSession(payload)
        console.log('=== CHECKOUT SESSION DEBUG ===')
        console.log('Full response:', response)
        console.log('Response data:', response.data)
        console.log('Response success:', response.data?.success)
        console.log('Response data.data:', response.data?.data)
        
        // Handle both demo mode and real Stripe responses
        if (response.data?.success && response.data?.data) {
          const sessionData = response.data.data
          console.log('Session data:', sessionData)
          console.log('Session URL:', sessionData.session_url)
          console.log('Demo mode:', sessionData.demo_mode)
          
          // Return the data in a format the frontend expects
          const result = {
            success: true,
            checkout_url: sessionData.session_url, // Map session_url to checkout_url for frontend compatibility
            session_url: sessionData.session_url,
            plan: sessionData.plan,
            customer_id: sessionData.customer_id,
            demo_mode: sessionData.demo_mode || false
          }
          
          console.log('Returning result:', result)
          return result
        }
        
        console.log('No valid session data found, returning raw response.data')
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create checkout session'
        console.error('Error creating checkout session:', error)
        console.error('Error response:', error.response?.data)
        throw error
      } finally {
        this.loading = false
      }
    },

    async getCheckoutSession(sessionId) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getCheckoutSession(sessionId)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch checkout session'
        console.error('Error fetching checkout session:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Analytics Actions
    async fetchAnalytics() {
      this.analyticsLoading = true
      this.analyticsError = null
      try {
        const response = await commerceAPI.getCommerceAnalytics({ type: 'subscriptions' })
        console.log('Analytics response:', response)
        if (response && response.data && response.data.data) {
          // Transform the API response to match our expected format
          const apiData = response.data.data
          this.analytics = {
            activeSubscriptions: apiData.overview?.total_orders || 0,
            monthlyRecurringRevenue: parseFloat(apiData.overview?.total_revenue || 0),
            churnRate: 0, // Not provided in API
            revenueThisMonth: parseFloat(apiData.overview?.total_revenue || 0),
            mrrTrend: this.transformTrendData(apiData.trends?.daily_revenue || {})
          }
          console.log('Analytics set from API:', this.analytics)
        } else {
          // Use existing analytics or fallback to mock data
          this.analytics = this.analytics || {
            activeSubscriptions: 15,
            monthlyRecurringRevenue: 1250.00,
            churnRate: 5.2,
            revenueThisMonth: 1250.00,
            mrrTrend: [
              { month: 'Jan', mrr: 1000 },
              { month: 'Feb', mrr: 1100 },
              { month: 'Mar', mrr: 1200 },
              { month: 'Apr', mrr: 1250 }
            ]
          }
          console.log('Analytics set from fallback:', this.analytics)
        }
      } catch (error) {
        this.analyticsError = error.response?.data?.message || 'Failed to fetch subscription analytics'
        console.error('Error fetching subscription analytics:', error)
        // Fallback to mock data
        this.analytics = {
          activeSubscriptions: 15,
          monthlyRecurringRevenue: 1250.00,
          churnRate: 5.2,
          revenueThisMonth: 1250.00,
          mrrTrend: [
            { month: 'Jan', mrr: 1000 },
            { month: 'Feb', mrr: 1100 },
            { month: 'Mar', mrr: 1200 },
            { month: 'Apr', mrr: 1250 }
          ]
        }
        console.log('Analytics set from error fallback:', this.analytics)
      } finally {
        this.analyticsLoading = false
      }
    },

    // Transform daily revenue data to monthly format for chart
    transformTrendData(dailyRevenue) {
      const monthlyData = []
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      // Group by month and sum daily revenue
      const monthlyTotals = {}
      Object.entries(dailyRevenue).forEach(([date, revenue]) => {
        const month = new Date(date).getMonth()
        const monthName = months[month]
        monthlyTotals[monthName] = (monthlyTotals[monthName] || 0) + parseFloat(revenue)
      })
      
      // Convert to chart format
      Object.entries(monthlyTotals).forEach(([month, revenue]) => {
        monthlyData.push({ month, mrr: revenue })
      })
      
      return monthlyData.length > 0 ? monthlyData : [
        { month: 'Jan', mrr: 1000 },
        { month: 'Feb', mrr: 1100 },
        { month: 'Mar', mrr: 1200 },
        { month: 'Apr', mrr: 1250 }
      ]
    },

    // Invoice Actions
    async viewInvoicePDF(invoiceId) {
      try {
        const response = await commerceAPI.viewInvoicePDF(invoiceId)
        
        // Handle preview response (JSON with HTML content)
        if (response.data && response.data.success && response.data.data) {
          const invoiceData = response.data.data
          
          // Store the HTML content for display in UI
          this.invoicePreview = {
            id: invoiceId,
            htmlContent: invoiceData.html_content,
            invoiceNumber: invoiceData.invoice_number,
            filename: invoiceData.filename,
            previewUrl: invoiceData.preview_url,
            downloadUrl: invoiceData.download_url
          }
          
          return invoiceData
        } else {
          // Fallback for direct HTML response
          this.invoicePreview = {
            id: invoiceId,
            htmlContent: response.data,
            invoiceNumber: `Invoice #${invoiceId}`,
            filename: `invoice-${invoiceId}.html`
          }
          
          return response.data
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to view invoice PDF'
        console.error('Error viewing invoice PDF:', error)
        throw error
      }
    },

    async downloadInvoicePDF(invoiceId) {
      try {
        const response = await commerceAPI.downloadInvoicePDF(invoiceId)
        
        // Handle PDF blob response
        const contentType = response.headers['content-type'] || ''
        
        // Get filename from content-disposition header or use default
        const contentDisposition = response.headers['content-disposition'] || ''
        let filename = `invoice-${invoiceId}.pdf`
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="([^"]+)"/)
          if (filenameMatch) {
            filename = filenameMatch[1]
          }
        }
        
        if (contentType.includes('application/pdf')) {
          // Handle actual PDF response
          const blob = new Blob([response.data], { type: 'application/pdf' })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = filename
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          // Don't revoke immediately to allow download to start
          setTimeout(() => window.URL.revokeObjectURL(url), 1000)
        } else if (contentType.includes('text/html')) {
          // Handle HTML response (fallback)
          const blob = new Blob([response.data], { 
            type: 'text/html; charset=utf-8' 
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = filename.replace('.pdf', '.html')
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          setTimeout(() => window.URL.revokeObjectURL(url), 1000)
        } else {
          // Handle JSON response (fallback)
          if (response.data && response.data.success && response.data.data) {
            const invoiceData = response.data.data
            
            if (invoiceData.html_content) {
              const htmlFilename = `invoice-${invoiceData.invoice_number || invoiceId}.html`
              const blob = new Blob([invoiceData.html_content], { 
                type: 'text/html; charset=utf-8' 
              })
              const url = window.URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = htmlFilename
              link.style.display = 'none'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              setTimeout(() => window.URL.revokeObjectURL(url), 1000)
            } else if (invoiceData.download_url) {
              window.open(invoiceData.download_url, '_blank')
            }
          }
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to download invoice PDF'
        console.error('Error downloading invoice PDF:', error)
        throw error
      }
    },

    async sendInvoiceEmail(invoiceId) {
      try {
        const response = await commerceAPI.sendInvoiceEmail(invoiceId)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to send invoice email'
        console.error('Error sending invoice email:', error)
        throw error
      }
    },

    // Clear invoice preview
    clearInvoicePreview() {
      this.invoicePreview = null
    },

    // Utility Actions
    clearError() {
      this.error = null
      this.plansError = null
      this.subscriptionsError = null
      this.analyticsError = null
    },

    setSelectedSubscription(subscription) {
      this.selectedSubscription = subscription
    },

    // Activity Actions
    async fetchActivity(subscriptionId) {
      this.activityLoading = true
      this.activityError = null
      try {
        const response = await commerceAPI.getSubscriptionActivity(subscriptionId)
        console.log('Activity response:', response)
        
        // Handle the API response structure: response.data = { success: true, data: { activity: [...] } }
        if (response?.data?.data?.activity && Array.isArray(response.data.data.activity)) {
          this.activity = response.data.data.activity
          console.log('Activity set from API:', this.activity.length, 'activities')
        } else if (response?.data?.activity && Array.isArray(response.data.activity)) {
          this.activity = response.data.activity
          console.log('Activity set from direct activity array:', this.activity.length, 'activities')
        } else if (Array.isArray(response.data)) {
          this.activity = response.data
          console.log('Activity set from direct array:', this.activity.length, 'activities')
        } else {
          this.activity = []
          console.log('No activity data found, setting empty array')
        }
      } catch (error) {
        this.activityError = error.response?.data?.message || 'Failed to fetch subscription activity'
        console.error('Error fetching subscription activity:', error)
        // Fallback to mock activity data
        this.activity = [
          {
            id: 1,
            event_type: 'customer.subscription.created',
            description: 'Subscription created',
            timestamp: new Date().toISOString(),
            payload: {
              plan_name: 'Basic Plan',
              amount: 2999,
              currency: 'usd'
            }
          },
          {
            id: 2,
            event_type: 'invoice.payment_succeeded',
            description: 'Payment received',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            payload: {
              amount_paid: 2999,
              currency: 'usd',
              payment_method: 'card'
            }
          }
        ]
      } finally {
        this.activityLoading = false
      }
    },

    clearActivity() {
      this.activity = []
      this.activityError = null
    }
  }
})
