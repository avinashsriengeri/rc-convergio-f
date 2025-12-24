<template>
  <div class="relative" data-testid="header-products">
    <!-- Modern Trigger Button -->
    <button
      ref="triggerRef"
      @click="toggleDropdown"
      @keydown.enter="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      @keydown.escape="closeDropdown"
      :aria-haspopup="true"
      :aria-expanded="isOpen"
      :aria-label="$t('common.header.open_products_menu')"
      data-testid="header-products"
      class="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
      :class="{ 'border-blue-500 shadow-sm bg-blue-50/50': isOpen }"
    >
      <div class="flex items-center space-x-2">
        <div class="w-5 h-5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-md flex items-center justify-center">
          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/>
      </svg>
        </div>
        <span class="text-gray-700 font-semibold text-sm hidden sm:block">Products</span>
      </div>
    </button>
 
    <!-- Futuristic Dropdown Panel -->
    <Transition
      enter-active-class="transition duration-400 ease-out"
      enter-from-class="transform scale-90 opacity-0 -translate-y-4"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-90 opacity-0 -translate-y-4"
    >
      <div
        v-if="isOpen"
        ref="dropdownRef"
        @click.stop
        data-testid="products-grid"
        class="absolute right-0 top-full mt-2 w-[520px] max-w-[calc(100vw-1rem)] max-h-[calc(100vh-8rem)] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
        :class="{ 'right-auto left-0': $i18n.locale === 'ar' }"
        style="box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);"
      >
        <!-- Compact Header -->
        <div class="px-6 py-4 bg-gradient-to-br from-gray-50 to-gray-100/50 border-b border-gray-200 flex-shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ $t('common.header.our_products') }}</h3>
              <p class="text-xs text-gray-600 mt-0.5">Professional business solutions</p>
            </div>
          </div>
        </div>
 
        <!-- Scrollable Products Grid -->
        <div class="flex-1 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div class="p-6">
            <div v-if="rcProducts.length === 0" class="text-center py-12">
              <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5"/>
                </svg>
              </div>
              <p class="text-gray-500 font-medium">{{ $t('common.header.no_products') }}</p>
            </div>
           
            <div v-else class="grid grid-cols-3 gap-3 min-h-0">
            <template v-for="product in rcProducts" :key="product.name">
              <!-- RC Console uses SSO - button with click handler -->
              <button
                v-if="product.name === 'RC Console'"
                @click="handleConsoleClick(product)"
                :data-testid="`product-tile-${slugify(product.name)}`"
                :aria-label="`Open ${product.name}`"
                class="group relative flex flex-col items-center p-5 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-white hover:shadow-md cursor-pointer"
              >
                <!-- Professional Icon Container -->
                <div class="relative mb-3">
                  <div class="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 relative overflow-hidden" :style="getIconStyle(product.icon)">
                    <div v-html="get3DIcon(product.icon)"></div>
                    <!-- Subtle overlay -->
                    <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 rounded-xl"></div>
                  </div>
                </div>
               
                <!-- Product Information -->
                <div class="text-center w-full">
                  <h4 class="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2 leading-snug mb-1">
                    {{ product.name }}
                  </h4>
                </div>
             
                <!-- Compact External Link Icon -->
                <div class="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div class="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center shadow-sm">
                    <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </div>
                </div>
              </button>

              <!-- Other products use regular links -->
              <a
                v-else
                :href="product.url"
                :data-testid="`product-tile-${slugify(product.name)}`"
                :aria-label="`Open ${product.name}`"
                target="_blank"
                rel="noopener noreferrer"
                class="group relative flex flex-col items-center p-5 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-white hover:shadow-md"
              >
                <!-- Professional Icon Container -->
                <div class="relative mb-3">
                  <div class="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 relative overflow-hidden" :style="getIconStyle(product.icon)">
                    <div v-html="get3DIcon(product.icon)"></div>
                    <!-- Subtle overlay -->
                    <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 rounded-xl"></div>
                  </div>
                </div>
               
                <!-- Product Information -->
                <div class="text-center w-full">
                  <h4 class="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2 leading-snug mb-1">
                    {{ product.name }}
                  </h4>
                </div>
             
                <!-- Compact External Link Icon -->
                <div class="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div class="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center shadow-sm">
                    <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </div>
                </div>
              </a>
            </template>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
 
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { rcProducts } from '../constants/rcProducts'
import { useClickOutside } from '../composables/useClickOutside'
import { useNotifications } from '../composables/useNotifications'

const { error: showError } = useNotifications()

const isOpen = ref(false)
const dropdownRef = ref(null)
const triggerRef = ref(null)
 
// Professional icon styles with subtle gradients
const getIconStyle = (iconKey) => {
  const styles = {
    'book': 'background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);',
    'baby': 'background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); box-shadow: 0 4px 12px rgba(236, 72, 153, 0.25);',
    'journal-bookmark': 'background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);',
    'shield-lock': 'background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);',
    'shop': 'background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); box-shadow: 0 4px 12px rgba(236, 72, 153, 0.25);',
    'bag-check': 'background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);',
    'phone': 'background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);',
    'mortarboard': 'background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%); box-shadow: 0 4px 12px rgba(168, 85, 247, 0.25);',
    'headset': 'background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); box-shadow: 0 4px 12px rgba(20, 184, 166, 0.25);',
    'console': 'background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);',
    'credit-card': 'background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.30);'
  }
  return styles[iconKey] || styles['shop']
}
 
// Glow effects for hover states
const getGlowStyle = (iconKey) => {
  const glows = {
    'journal-bookmark': 'background: radial-gradient(circle, #FF6B35, transparent);',
    'shield-lock': 'background: radial-gradient(circle, #667eea, transparent);',
    'shop': 'background: radial-gradient(circle, #f5576c, transparent);',
    'bag-check': 'background: radial-gradient(circle, #4facfe, transparent);',
    'phone': 'background: radial-gradient(circle, #fa709a, transparent);',
    'mortarboard': 'background: radial-gradient(circle, #d299c2, transparent);',
    'headset': 'background: radial-gradient(circle, #89f7fe, transparent);',
    'console': 'background: radial-gradient(circle, #a8e6cf, transparent);',
    'credit-card': 'background: radial-gradient(circle, #60a5fa, transparent);'
  }
  return glows[iconKey] || glows['shop']
}
 
// Professional icons with clean, modern design
const get3DIcon = (iconKey) => {
  const icons = {
    'book': `
      <svg class="w-8 h-8 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="rgba(255,255,255,0.95)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="rgba(255,255,255,0.3)"/>
        <path d="M8 6h8M8 10h8M8 14h5" stroke="rgba(255,255,255,0.95)" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
    `,
    'baby': `
      <svg class="w-8 h-8 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
        <!-- Graduation Cap -->
        <path d="M12 3L2 8l10 5 10-5-10-5z" fill="rgba(255,255,255,0.95)"/>
        <path d="M12 13l-8-4v5c0 2 3.5 4 8 4s8-2 8-4v-5l-8 4z" fill="rgba(255,255,255,0.3)"/>
        <!-- Cap Tassel -->
        <rect x="12" y="2" width="0.5" height="3" fill="rgba(255,255,255,0.95)"/>
        <circle cx="12" cy="2" r="0.8" fill="rgba(255,255,255,0.95)"/>
        <!-- Student Head -->
        <circle cx="12" cy="16" r="2" fill="rgba(255,255,255,0.95)"/>
        <!-- Student Body -->
        <path d="M12 18.5c-2 0-3.5 1-3.5 2.5v1h7v-1c0-1.5-1.5-2.5-3.5-2.5z" fill="rgba(255,255,255,0.8)"/>
        <!-- Book in hand -->
        <rect x="14.5" y="17.5" width="2" height="3" rx="0.3" fill="rgba(255,255,255,0.95)"/>
        <path d="M14.5 18.5h2M14.5 19.5h2" stroke="rgba(0,0,0,0.15)" stroke-width="0.3"/>
      </svg>
    `,
    'journal-bookmark': `
      <svg class="w-8 h-8 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="rgba(255,255,255,0.3)"/>
        <path d="M7 7h10M7 11h10M7 15h7" stroke="rgba(255,255,255,0.95)" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M17 17l-2-2 2-2v4z" fill="rgba(255,255,255,0.95)"/>
      </svg>
    `,
    'shield-lock': `
      <svg class="w-8 h-8 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L4 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-8-4z" fill="rgba(255,255,255,0.3)"/>
        <rect x="9" y="10" width="6" height="5" rx="1" fill="rgba(255,255,255,0.95)"/>
        <path d="M10 10V8.5a2 2 0 0 1 4 0V10" stroke="rgba(255,255,255,0.95)" stroke-width="1.5" fill="none"/>
        <circle cx="12" cy="12.5" r="0.8" fill="rgba(0,0,0,0.3)"/>
      </svg>
    `,
    'shop': `
      <svg class="w-8 h-8 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" fill="rgba(255,255,255,0.3)"/>
        <rect x="9" y="13" width="6" height="7" fill="rgba(255,255,255,0.95)"/>
        <path d="M9 9h6v3H9z" fill="rgba(255,255,255,0.95)"/>
      </svg>
    `,
    'bag-check': `
      <svg class="w-8 h-8 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z" fill="rgba(255,255,255,0.3)"/>
        <path d="M3 6h18" stroke="rgba(255,255,255,0.95)" stroke-width="1.5"/>
        <path d="M9 12l2 2 4-4" stroke="rgba(255,255,255,0.95)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    `,
    'phone': `
      <svg class="w-8 h-8 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
        <rect x="5" y="2" width="14" height="20" rx="2" fill="rgba(255,255,255,0.3)"/>
        <rect x="7" y="4" width="10" height="14" rx="1" fill="rgba(255,255,255,0.95)"/>
        <circle cx="12" cy="19.5" r="1" fill="rgba(255,255,255,0.95)"/>
      </svg>
    `,
    'mortarboard': `
      <svg class="w-8 h-8 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="rgba(255,255,255,0.95)"/>
        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="rgba(255,255,255,0.3)"/>
      </svg>
    `,
    'headset': `
      <svg class="w-8 h-8 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2a9 9 0 0 0-9 9v7.5c0 1.38 1.12 2.5 2.5 2.5h2A1.5 1.5 0 0 0 9 19.5v-5A1.5 1.5 0 0 0 7.5 13h-2v-2a6.5 6.5 0 1 1 13 0v2h-2a1.5 1.5 0 0 0-1.5 1.5v5a1.5 1.5 0 0 0 1.5 1.5h2c1.38 0 2.5-1.12 2.5-2.5V11a9 9 0 0 0-9-9z" fill="rgba(255,255,255,0.95)"/>
      </svg>
    `,
    'console': `
      <svg class="w-8 h-8 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="2" fill="rgba(255,255,255,0.3)"/>
        <path d="M6 10l3 2-3 2M10 14h4" stroke="rgba(255,255,255,0.95)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    'credit-card': `
      <svg class="w-8 h-8 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" fill="rgba(255,255,255,0.95)"/>
        <rect x="2" y="5" width="20" height="4" rx="2" fill="rgba(255,255,255,0.95)"/>
        <rect x="2" y="9" width="20" height="3" fill="rgba(0,0,0,0.15)"/>
        <rect x="4" y="14" width="4" height="2" rx="0.5" fill="rgba(0,0,0,0.2)"/>
        <rect x="9" y="14" width="3" height="2" rx="0.5" fill="rgba(0,0,0,0.2)"/>
        <circle cx="18" cy="15" r="1.5" fill="rgba(255,200,0,0.9)"/>
        <circle cx="16" cy="15" r="1.5" fill="rgba(255,100,0,0.8)" opacity="0.7"/>
      </svg>
    `
  }
  return icons[iconKey] || icons['shop']
}
 
// Utility function to slugify product names for test IDs
const slugify = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
 
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}
 
const closeDropdown = () => {
  isOpen.value = false
}
 
// Use click-outside composable
useClickOutside([triggerRef, dropdownRef], () => {
  if (isOpen.value) {
    closeDropdown()
  }
})
 
// Handle escape key
const handleEscape = (event) => {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}
 
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})
 
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})

// Handle RC Console click with SSO
const handleConsoleClick = async (product) => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      showError('Please log in to access RC Console')
      return
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL || '/api'

    // Call SSO API (now returns JSON, not 302)
    const response = await fetch(`${apiUrl}/sso/redirect?product_id=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      showError(error.error || 'Failed to redirect to RC Console. Please try again.')
      return
    }

    const data = await response.json()

    // Extract redirect_url from JSON response
    if (data.success && data.data && data.data.redirect_url) {
      // Open in new tab/window
      window.open(data.data.redirect_url, '_blank')
    } else {
      showError('Failed to redirect to RC Console. Please try again.')
    }
  } catch (err) {
    console.error('SSO redirect error:', err)
    showError('Failed to connect to RC Console. Please try again.')
  }
}
</script>