<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Help & Support</h1>
            <p class="text-sm text-gray-600 mt-1">Get assistance and connect with our support team</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-6">
        
        

        <!-- Quick Actions Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Contact Us</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="mailto:info@reliancecorporation.co.za"
              class="group bg-gray-50 border border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg p-4 transition-all duration-200"
            >
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-semibold text-gray-900">Email Support</h4>
                  <p class="text-xs text-gray-600 truncate">info@reliancecorporation.co.za</p>
                </div>
              </div>
            </a>

            <a
              href="tel:+27872502288"
              class="group bg-gray-50 border border-gray-200 hover:border-green-500 hover:bg-green-50 rounded-lg p-4 transition-all duration-200"
            >
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-semibold text-gray-900">Customer Care</h4>
                  <p class="text-xs text-gray-600">(+27) 87 250 2288</p>
                </div>
              </div>
            </a>

            <a
              href="https://reliancecorporation.co.za"
              target="_blank"
              rel="noopener noreferrer"
              class="group bg-gray-50 border border-gray-200 hover:border-purple-500 hover:bg-purple-50 rounded-lg p-4 transition-all duration-200"
            >
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-semibold text-gray-900">Visit Website</h4>
                  <p class="text-xs text-gray-600 truncate">reliancecorporation.co.za</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        <!-- Office Contact & Location -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Office Information</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Office Phone -->
            <div>
              <div class="flex items-center space-x-2 mb-3">
                <div class="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h4 class="text-sm font-semibold text-gray-900">Office</h4>
              </div>
              <div class="text-sm space-y-3">
                <a 
                  href="tel:+27104471845"
                  class="block text-gray-900 font-medium hover:text-blue-600 transition-colors text-base"
                >
                  (+27) 10 447 1845
                </a>
                <div class="pt-2 border-t border-gray-100">
                  <p class="text-gray-700 font-semibold mb-2">Business Hours:</p>
                  <div class="space-y-2 bg-gray-50 rounded-lg p-3">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <span class="text-gray-700 text-sm font-medium">Monday - Friday</span>
                      </div>
                      <span class="text-gray-900 font-semibold text-sm">8:00 AM - 5:00 PM</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                        </svg>
                        <span class="text-gray-700 text-sm font-medium">Saturday & Sunday</span>
                      </div>
                      <span class="text-red-600 font-semibold text-sm">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Office Location -->
            <div>
              <div class="flex items-center space-x-2 mb-3">
                <div class="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 class="text-sm font-semibold text-gray-900">Office Address</h4>
              </div>
              <div class="text-sm space-y-1">
                <p class="text-gray-900">Fish Eagle Office Park</p>
                <p class="text-gray-900">Unit 7 & 8 Kingfisher Crescent</p>
                <p class="text-gray-900">Meyersdal</p>
                <p class="text-gray-900">Alberton, Johannesburg 1448</p>
                <a 
                  href="https://maps.google.com/?q=Fish+Eagle+Office+Park+Unit+7+8+Kingfisher+Crescent+Meyersdal+Alberton+Johannesburg" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mt-2 transition-colors"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Media -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-1">Connect With Us</h3>
              <p class="text-sm text-gray-600">Follow us on social media for updates</p>
            </div>
            <div class="flex items-center space-x-2">
              <a href="https://www.facebook.com/profile.php?id=61565640103470" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-gray-50 hover:bg-blue-600 border border-gray-200 hover:border-blue-600 text-gray-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200" title="Facebook - Reliance Corporation">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://x.com/SA_Reliance" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-gray-50 hover:bg-black border border-gray-200 hover:border-black text-gray-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200" title="X (Twitter) - Reliance Corporation">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/reliancecorporation/" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-gray-50 hover:bg-blue-700 border border-gray-200 hover:border-blue-700 text-gray-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200" title="LinkedIn - Reliance Corporation">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/reliancecorporation/" target="_blank" rel="noopener noreferrer" class="group w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:border-transparent relative overflow-hidden" title="Instagram - Reliance Corporation">
                <div class="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <svg class="w-4 h-4 relative z-10 text-gray-600 group-hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed for this static page
</script>

