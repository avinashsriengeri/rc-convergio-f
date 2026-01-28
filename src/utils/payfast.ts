/**
 * PayFast Form Submission Utility
 * 
 * Creates and submits a POST form to PayFast with all payment parameters.
 * Used by both payment links and subscription checkouts.
 * 
 * @param payfastUrl - The PayFast process URL (e.g., https://sandbox.payfast.co.za/eng/process)
 * @param paymentData - Object containing all PayFast form fields (merchant_id, amount, signature, etc.)
 */
export function submitPayFastForm(payfastUrl: string, paymentData: Record<string, any>): void {
  // Validate inputs
  if (!payfastUrl) {
    console.error('PayFast URL is required')
    throw new Error('PayFast URL is required')
  }
  
  if (!paymentData || typeof paymentData !== 'object') {
    console.error('Payment data is required')
    throw new Error('Payment data is required')
  }
  
  // Filter out null, undefined, and empty string values
  const filteredPaymentData: Record<string, string> = {}
  Object.keys(paymentData).forEach(key => {
    const value = paymentData[key]
    // Only include valid values (not null, undefined, or empty string)
    if (value !== null && value !== undefined && value !== '') {
      filteredPaymentData[key] = String(value)
    }
  })
  
  console.log('Submitting PayFast form:', {
    url: payfastUrl,
    fieldsCount: Object.keys(filteredPaymentData).length,
    fields: Object.keys(filteredPaymentData)
  })
  
  // Create form element
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = payfastUrl
  form.style.display = 'none'
  
  // Add all payment fields as hidden inputs
  Object.keys(filteredPaymentData).forEach(key => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = filteredPaymentData[key]
    form.appendChild(input)
  })
  
  // Append form to body
  document.body.appendChild(form)
  
  // Submit form
  try {
    form.submit()
    console.log('PayFast form submitted successfully')
  } catch (error) {
    console.error('Error submitting PayFast form:', error)
    // Remove form from DOM on error
    document.body.removeChild(form)
    throw error
  }
}

