import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { quotesAPI } from '@/services/api'
import { success, error } from '@/utils/notifications'

export const useQuotesStore = defineStore('quotes', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    quotes: [],
    selected: null,
    products: [],
    templates: [],
    selectedTemplate: null,
    pagination: {
      page: 1,
      per_page: 15,
      total: 0,
      last_page: 1,
      from: 0,
      to: 0
    },
    filters: {
      status: '',
      q: '',
      deal_id: '',
      date_from: '',
      date_to: ''
    }
  })

  // Getters
  const quotes = computed(() => state.value.quotes)
  const selected = computed(() => state.value.selected)
  const loading = computed(() => state.value.loading)
  const products = computed(() => state.value.products)
  const templates = computed(() => state.value.templates)
  const selectedTemplate = computed(() => state.value.selectedTemplate)
  const error = computed(() => state.value.error)
  const pagination = computed(() => state.value.pagination)
  const filters = computed(() => state.value.filters)

  // Actions
  const fetchQuotes = async (params = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedParams = { ...state.value.filters, ...params }
      const response = await quotesAPI.getQuotes(mergedParams)
      
      if (response.data && response.data.data) {
        state.value.quotes = response.data.data
        state.value.pagination = {
          page: response.data.current_page || 1,
          per_page: response.data.per_page || 15,
          total: response.data.total || 0,
          last_page: response.data.last_page || 1,
          from: response.data.from || 0,
          to: response.data.to || 0
        }
      } else {
        state.value.quotes = []
      }
    } catch (err) {
      state.value.error = 'Failed to fetch quotes'
      console.error('Error fetching quotes:', err)
      error('Failed to load quotes')
    } finally {
      state.value.loading = false
    }
  }

  const getQuote = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await quotesAPI.getQuote(id)
      console.log('Full quote API response:', response)
      
      // Extract quote data and documents from the response
      const quote = response.data.data || response.data
      const documents = response.data.documents || []
      
      // Add documents to the quote object if they exist
      if (documents.length > 0) {
        quote.documents = documents
        console.log(`Quote store: Added ${documents.length} documents to quote ${quote.id}`)
        console.log('Quote store: Documents data:', documents)
      }
      
      state.value.selected = quote
      console.log('Quote fetched from API with documents:', quote)
      return state.value.selected
    } catch (err) {
      state.value.error = 'Failed to fetch quote'
      console.error('Error fetching quote:', err)
      error('Failed to load quote')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const createQuote = async (payload) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await quotesAPI.createQuote(payload)
      const newQuote = response.data.data || response.data
      
      // Add to quotes list
      state.value.quotes.unshift(newQuote)
      
      success('Quote created successfully')
      return newQuote
    } catch (err) {
      state.value.error = 'Failed to create quote'
      console.error('Error creating quote:', err)
      error('Failed to create quote')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateQuote = async (id, payload) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await quotesAPI.updateQuote(id, payload)
      const updatedQuote = response.data.data || response.data
      
      // Update in quotes list
      const index = state.value.quotes.findIndex(q => q.id === id)
      if (index !== -1) {
        state.value.quotes[index] = updatedQuote
      }
      
      // Update selected if it's the same quote
      if (state.value.selected && state.value.selected.id === id) {
        state.value.selected = updatedQuote
      }
      
      success('Quote updated successfully')
      return updatedQuote
    } catch (err) {
      state.value.error = 'Failed to update quote'
      console.error('Error updating quote:', err)
      error('Failed to update quote')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteQuote = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      await quotesAPI.deleteQuote(id)
      
      // Remove from quotes list
      state.value.quotes = state.value.quotes.filter(q => q.id !== id)
      
      // Clear selected if it's the deleted quote
      if (state.value.selected && state.value.selected.id === id) {
        state.value.selected = null
      }
      
      success('Quote deleted successfully')
    } catch (err) {
      state.value.error = 'Failed to delete quote'
      console.error('Error deleting quote:', err)
      error('Failed to delete quote')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const sendQuote = async (id, payload = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      // Always fetch the full quote details to ensure we have the latest and complete data
      const response = await quotesAPI.getQuote(id)
      const quote = response.data.data || response.data
      
      // Use contact_id directly from the quote (already set during creation)
      const contactId = quote?.contact_id
      
      // If no contact_id is available, throw an error
      if (!contactId) {
        throw new Error('Contact ID is required to send quote. Please ensure the quote has an associated contact.')
      }
      
      // Store original deal_id to check if backend created a new deal
      const originalDealId = quote?.deal_id
      
      // Prepare payload with required contact_id
      const sendPayload = {
        ...payload,
        contact_id: contactId
      }
      
      // Debug logging
      console.log('DEBUG: Sending quote with payload:', sendPayload)
      
      const sendResponse = await quotesAPI.sendQuote(id, sendPayload)
      const updatedQuote = sendResponse.data.data || sendResponse.data
      
      // Check if backend created a deal (was null, now has value)
      if (!originalDealId && updatedQuote.deal_id) {
        console.log('DEBUG: Backend created new deal:', updatedQuote.deal_id)
      }
      
      // Update in quotes list
      const index = state.value.quotes.findIndex(q => q.id === id)
      if (index !== -1) {
        state.value.quotes[index] = updatedQuote
      }
      
      // Update selected if it's the same quote
      if (state.value.selected && state.value.selected.id === id) {
        state.value.selected = updatedQuote
      }
      
      success('Quote sent successfully')
      return updatedQuote
    } catch (err) {
      state.value.error = 'Failed to send quote'
      console.error('Error sending quote:', err)
      error(err.message || 'Failed to send quote')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const acceptQuote = async (id, payload = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await quotesAPI.acceptQuote(id, payload)
      const updatedQuote = response.data.data || response.data
      
      // Update in quotes list
      const index = state.value.quotes.findIndex(q => q.id === id)
      if (index !== -1) {
        state.value.quotes[index] = updatedQuote
      }
      
      // Update selected if it's the same quote
      if (state.value.selected && state.value.selected.id === id) {
        state.value.selected = updatedQuote
      }
      
      success('Quote accepted successfully')
      
      // Emit global event for deal integration
      if (window.eventBus) {
        window.eventBus.emit('quote.accepted', {
          quoteId: id,
          dealId: updatedQuote.deal_id
        })
      }
      
      return updatedQuote
    } catch (err) {
      state.value.error = 'Failed to accept quote'
      console.error('Error accepting quote:', err)
      error('Failed to accept quote')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const rejectQuote = async (id, payload = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await quotesAPI.rejectQuote(id, payload)
      const updatedQuote = response.data.data || response.data
      
      // Update in quotes list
      const index = state.value.quotes.findIndex(q => q.id === id)
      if (index !== -1) {
        state.value.quotes[index] = updatedQuote
      }
      
      // Update selected if it's the same quote
      if (state.value.selected && state.value.selected.id === id) {
        state.value.selected = updatedQuote
      }
      
      success('Quote rejected successfully')
      return updatedQuote
    } catch (err) {
      state.value.error = 'Failed to reject quote'
      console.error('Error rejecting quote:', err)
      error('Failed to reject quote')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const downloadPdf = async (id) => {
    try {
      const response = await quotesAPI.downloadPdf(id)
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `quote-${id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      success('PDF downloaded successfully')
    } catch (err) {
      console.error('Error downloading PDF:', err)
      error('Failed to download PDF')
      throw err
    }
  }

  // Filter management
  const setFilters = (newFilters) => {
    state.value.filters = { ...state.value.filters, ...newFilters }
  }

  const clearFilters = () => {
    state.value.filters = {
      status: '',
      q: '',
      deal_id: '',
      date_from: '',
      date_to: ''
    }
  }

  // Reset state
  const resetState = () => {
    state.value.quotes = []
    state.value.selected = null
    state.value.error = null
    state.value.loading = false
  }

  // Products actions
  const fetchProducts = async (params = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await quotesAPI.getProducts(params)
      console.log('DEBUG: Products API response:', response.data)
      state.value.products = response.data.data || []
      console.log('DEBUG: Products set to:', state.value.products)
    } catch (err) {
      state.value.error = 'Failed to fetch products'
      console.error('Error fetching products:', err)
      // Don't show error toast for initial load failures
      if (state.value.products.length === 0) {
        state.value.products = []
      }
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const createProduct = async (productData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await quotesAPI.createProduct(productData)
      const newProduct = response.data.data || response.data
      state.value.products.push(newProduct)
      success('Product created successfully')
      return newProduct
    } catch (err) {
      state.value.error = 'Failed to create product'
      console.error('Error creating product:', err)
      error('Failed to create product')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateProduct = async (id, productData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await quotesAPI.updateProduct(id, productData)
      const updatedProduct = response.data.data || response.data
      
      const index = state.value.products.findIndex(p => p.id === id)
      if (index !== -1) {
        state.value.products[index] = updatedProduct
      }
      
      success('Product updated successfully')
      return updatedProduct
    } catch (err) {
      state.value.error = 'Failed to update product'
      console.error('Error updating product:', err)
      error('Failed to update product')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteProduct = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      await quotesAPI.deleteProduct(id)
      state.value.products = state.value.products.filter(p => p.id !== id)
      success('Product deleted successfully')
    } catch (err) {
      state.value.error = 'Failed to delete product'
      console.error('Error deleting product:', err)
      error('Failed to delete product')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  // Templates actions
  const fetchTemplates = async (params = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await quotesAPI.getTemplates(params)
      state.value.templates = response.data.data || response.data || []
    } catch (err) {
      state.value.error = 'Failed to fetch templates'
      console.error('Error fetching templates:', err)
      // Don't show error toast for initial load failures
      if (state.value.templates.length === 0) {
        state.value.templates = []
      }
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const createTemplate = async (templateData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await quotesAPI.createTemplate(templateData)
      const newTemplate = response.data.data || response.data
      state.value.templates.push(newTemplate)
      success('Template created successfully')
      return newTemplate
    } catch (err) {
      state.value.error = 'Failed to create template'
      console.error('Error creating template:', err)
      error('Failed to create template')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateTemplate = async (id, templateData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await quotesAPI.updateTemplate(id, templateData)
      const updatedTemplate = response.data.data || response.data
      
      const index = state.value.templates.findIndex(t => t.id === id)
      if (index !== -1) {
        state.value.templates[index] = updatedTemplate
      }
      
      success('Template updated successfully')
      return updatedTemplate
    } catch (err) {
      state.value.error = 'Failed to update template'
      console.error('Error updating template:', err)
      error('Failed to update template')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteTemplate = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      await quotesAPI.deleteTemplate(id)
      state.value.templates = state.value.templates.filter(t => t.id !== id)
      success('Template deleted successfully')
    } catch (err) {
      state.value.error = 'Failed to delete template'
      console.error('Error deleting template:', err)
      error('Failed to delete template')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const previewTemplate = async (id) => {
    try {
      const response = await quotesAPI.previewTemplate(id)
      return response
    } catch (err) {
      console.error('Error previewing template:', err)
      throw err
    }
  }

  return {
    // State
    quotes,
    selected,
    loading,
    error,
    pagination,
    filters,
    products,
    templates,
    selectedTemplate,
    
    // Actions
    fetchQuotes,
    getQuote,
    createQuote,
    updateQuote,
    deleteQuote,
    sendQuote,
    acceptQuote,
    rejectQuote,
    downloadPdf,
    setFilters,
    clearFilters,
    resetState,
    // Products
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    // Templates
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    previewTemplate
  }
})
