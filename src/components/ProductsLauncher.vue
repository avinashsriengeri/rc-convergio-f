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
      class="group relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer focus:outline-none bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md border border-white/20 hover:from-blue-500/20 hover:to-purple-500/20 hover:shadow-lg hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-400/50"
      :class="{ 'from-blue-500/20 to-purple-500/20 shadow-lg scale-105': isOpen }"
    >
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-sm">
          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/>
      </svg>
        </div>
        <span class="text-gray-700 font-medium text-sm hidden sm:block">Products</span>
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
        class="absolute right-0 top-full mt-4 w-[480px] max-w-[calc(100vw-1rem)] max-h-[calc(100vh-8rem)] bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 rounded-2xl shadow-2xl border border-white/60 z-50 overflow-hidden backdrop-blur-xl"
        :class="{ 'right-auto left-0': $i18n.locale === 'ar' }"
        style="box-shadow: 0 32px 64px -12px rgba(59, 130, 246, 0.15), 0 8px 32px -8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8);"
      >
        <!-- Compact Header -->
        <div class="px-6 py-4 bg-gradient-to-r from-white/80 via-blue-50/40 to-purple-50/30 backdrop-blur-sm border-b border-white/40 flex-shrink-0">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/>
            </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 tracking-tight">{{ $t('common.header.our_products') }}</h3>
              <p class="text-xs text-gray-600 font-medium">Professional solutions</p>
            </div>
          </div>
        </div>
 
        <!-- Scrollable Products Grid -->
        <div class="flex-1 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300/70 scrollbar-track-blue-50/30">
          <div class="p-6">
            <div v-if="rcProducts.length === 0" class="text-center py-12">
              <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-inner">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5"/>
                </svg>
              </div>
              <p class="text-gray-500 font-medium">{{ $t('common.header.no_products') }}</p>
            </div>
           
            <div v-else class="grid grid-cols-3 gap-4 min-h-0">
            <a
              v-for="product in rcProducts"
              :key="product.name"
              :href="product.url"
              :data-testid="`product-tile-${slugify(product.name)}`"
              :aria-label="`Open ${product.name}`"
              target="_blank"
              rel="noopener noreferrer"
                class="group relative flex flex-col items-center p-4 rounded-xl border border-white/60 hover:border-white/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-gradient-to-br from-white/60 via-white/40 to-transparent backdrop-blur-sm hover:from-white/80 hover:via-white/60 hover:to-white/20"
                style="box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6);"
            >
                <!-- Compact 3D Icon Container -->
              <div class="relative mb-3">
                  <div class="relative">
                    <!-- 3D Icon with realistic lighting -->
                    <div
                      class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
                      :style="getIconStyle(product.icon)"
                    >
                      <!-- Icon SVG -->
                      <div class="relative z-10" v-html="get3DIcon(product.icon)"></div>
                     
                      <!-- Lighting overlay -->
                      <div class="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10 rounded-2xl"></div>
                     
                      <!-- Glow effect -->
                      <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-sm" :style="getGlowStyle(product.icon)"></div>
                    </div>
                   
                    <!-- Compact reflection -->
                    <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-gradient-to-r from-transparent via-black/5 to-transparent rounded-full blur-sm opacity-50"></div>
                </div>
              </div>
             
                <!-- Compact Product Information -->
              <div class="text-center">
                  <h4 class="text-xs font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                  {{ product.name }}
                </h4>
                  <p class="text-xs text-gray-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
                    Solution
                  </p>
              </div>
             
                <!-- Compact External Link -->
                <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110">
                  <div class="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                  </div>
              </div>
            </a>
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
 
const isOpen = ref(false)
const dropdownRef = ref(null)
const triggerRef = ref(null)
 
// 3D Icon styles with realistic gradients and lighting
const getIconStyle = (iconKey) => {
  const styles = {
    'journal-bookmark': 'background: linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD23F 100%); box-shadow: 0 8px 32px rgba(255, 107, 53, 0.3);',
    'shield-lock': 'background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%); box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);',
    'shop': 'background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%); box-shadow: 0 8px 32px rgba(245, 87, 108, 0.3);',
    'bag-check': 'background: linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%); box-shadow: 0 8px 32px rgba(79, 172, 254, 0.3);',
    'phone': 'background: linear-gradient(135deg, #fa709a 0%, #fee140 50%, #fa709a 100%); box-shadow: 0 8px 32px rgba(250, 112, 154, 0.3);',
    'cloud': 'background: linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #a8edea 100%); box-shadow: 0 8px 32px rgba(168, 237, 234, 0.3);',
    'mortarboard': 'background: linear-gradient(135deg, #d299c2 0%, #fef9d7 50%, #d299c2 100%); box-shadow: 0 8px 32px rgba(210, 153, 194, 0.3);',
    'headset': 'background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 50%, #89f7fe 100%); box-shadow: 0 8px 32px rgba(137, 247, 254, 0.3);',
    'console': 'background: linear-gradient(135deg, #a8e6cf 0%, #dcedc8 50%, #ffd3a5 100%); box-shadow: 0 8px 32px rgba(168, 230, 207, 0.3);'
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
    'cloud': 'background: radial-gradient(circle, #a8edea, transparent);',
    'mortarboard': 'background: radial-gradient(circle, #d299c2, transparent);',
    'headset': 'background: radial-gradient(circle, #89f7fe, transparent);',
    'console': 'background: radial-gradient(circle, #a8e6cf, transparent);'
  }
  return glows[iconKey] || glows['shop']
}
 
// Professional 3D Icons with realistic designs and depth
const get3DIcon = (iconKey) => {
  const icons = {
    'journal-bookmark': `
      <svg class="w-8 h-8 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2 2V6a2 2 0 0 1 2-2z" opacity="0.9"/>
        <path d="M12 4v16M8 8h3M8 11h3M13 8h3M13 11h3" stroke="rgba(255,255,255,0.8)" stroke-width="1" fill="none"/>
        <rect x="16" y="6" width="3" height="1" rx="0.5" fill="rgba(255,255,255,0.9)"/>
        <circle cx="6" cy="6" r="0.8" fill="rgba(255,255,255,0.7)"/>
      </svg>
    `,
    'shield-lock': `
      <svg class="w-8 h-8 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L4 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-8-4z" opacity="0.9"/>
        <rect x="9" y="9" width="6" height="4" rx="1" stroke="rgba(255,255,255,0.9)" stroke-width="1.2" fill="none"/>
        <path d="M10 9V7.5a2 2 0 0 1 4 0V9" stroke="rgba(255,255,255,0.9)" stroke-width="1.2" fill="none"/>
        <circle cx="12" cy="11" r="0.8" fill="rgba(255,255,255,1)"/>
        <path d="M8 8h8M8 15h8" stroke="rgba(255,255,255,0.5)" stroke-width="0.8"/>
      </svg>
    `,
    'shop': `
      <svg class="w-8 h-8 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8 2 5 5 5 9v1h14V9c0-4-3-7-7-7z" opacity="0.9"/>
        <path d="M5 10h14v8c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-8z" opacity="0.8"/>
        <path d="M9 6v4M12 4v6M15 6v4" stroke="rgba(255,255,255,0.8)" stroke-width="1"/>
        <circle cx="12" cy="15" r="1.5" fill="rgba(255,255,255,0.9)"/>
        <path d="M10.5 15h3M12 13.5v3" stroke="rgba(0,0,0,0.3)" stroke-width="0.8"/>
      </svg>
    `,
    'bag-check': `
      <svg class="w-8 h-8 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 4h2l.4 2M7 16h10l4-8H5.4" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" fill="none"/>
        <rect x="6" y="9" width="14" height="8" rx="1" opacity="0.8"/>
        <circle cx="9" cy="20" r="1.5" stroke="rgba(255,255,255,0.8)" stroke-width="1" fill="none"/>
        <circle cx="20" cy="20" r="1.5" stroke="rgba(255,255,255,0.8)" stroke-width="1" fill="none"/>
        <path d="M10 12l2 2 4-4" stroke="rgba(255,255,255,1)" stroke-width="1.5" fill="none"/>
        <circle cx="15" cy="11" r="2.5" stroke="rgba(255,255,255,0.4)" stroke-width="1" fill="none"/>
      </svg>
    `,
    'phone': `
      <svg class="w-8 h-8 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="6" width="16" height="12" rx="2" opacity="0.9"/>
        <rect x="6" y="8" width="12" height="6" rx="1" stroke="rgba(255,255,255,0.7)" stroke-width="1" fill="none"/>
        <rect x="8" y="16" width="2" height="1.5" rx="0.5" fill="rgba(255,255,255,0.9)"/>
        <rect x="11" y="16" width="2" height="1.5" rx="0.5" fill="rgba(255,255,255,0.9)"/>
        <rect x="14" y="16" width="2" height="1.5" rx="0.5" fill="rgba(255,255,255,0.9)"/>
        <path d="M9 10h6M9 12h4" stroke="rgba(255,255,255,0.6)" stroke-width="0.8"/>
        <circle cx="18" cy="10" r="1" fill="rgba(255,255,255,0.8)"/>
      </svg>
    `,
    'cloud': `
      <svg class="w-8 h-8 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.5 10.2c-.2-4.4-3.8-7.9-8.3-7.9-3.1 0-5.8 1.7-7.2 4.2-2.4.4-4.2 2.5-4.2 5 0 2.8 2.3 5.1 5.1 5.1h13.6c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.2-3.9-4.5-.2-.5-.4-.9-.6-1.4z" opacity="0.9"/>
        <path d="M12 13v4M10 15l2-2 2 2" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" fill="none"/>
        <circle cx="9" cy="11" r="1" fill="rgba(255,255,255,0.8)"/>
        <circle cx="15" cy="11.5" r="0.8" fill="rgba(255,255,255,0.7)"/>
        <path d="M8 17h8" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
      </svg>
    `,
    'mortarboard': `
      <svg class="w-8 h-8 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" opacity="0.9"/>
        <path d="M6 20v-2c0-3.3 2.7-6 6-6s6 2.7 6 6v2" stroke="rgba(255,255,255,0.8)" stroke-width="1.5" fill="none"/>
        <circle cx="10" cy="7" r="0.8" fill="rgba(255,255,255,0.9)"/>
        <circle cx="14" cy="7" r="0.8" fill="rgba(255,255,255,0.9)"/>
        <path d="M10 9c0 1.1.9 2 2 2s2-.9 2-2" stroke="rgba(255,255,255,0.8)" stroke-width="1" fill="none"/>
        <rect x="8" y="14" width="8" height="2" rx="1" fill="rgba(255,255,255,0.7)"/>
        <path d="M10 14.5h4" stroke="rgba(0,0,0,0.4)" stroke-width="0.8"/>
      </svg>
    `,
    'headset': `
      <svg class="w-8 h-8 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" opacity="0.9"/>
        <path d="M6 20v-2c0-3.3 2.7-6 6-6s6 2.7 6 6v2" stroke="rgba(255,255,255,0.8)" stroke-width="1.5" fill="none"/>
        <path d="M8 8C8 5.8 9.8 4 12 4s4 1.8 4 4v2" stroke="rgba(255,255,255,0.9)" stroke-width="1.2" fill="none"/>
        <rect x="4" y="9" width="2.5" height="4" rx="1.2" fill="rgba(255,255,255,0.9)"/>
        <rect x="17.5" y="9" width="2.5" height="4" rx="1.2" fill="rgba(255,255,255,0.9)"/>
        <path d="M8 14c0 1 1 2 2 2h4c1 0 2-1 2-2" stroke="rgba(255,255,255,0.8)" stroke-width="1" fill="none"/>
        <circle cx="9" cy="18" r="0.8" fill="rgba(255,255,255,0.8)"/>
      </svg>
    `,
    'console': `
      <svg class="w-8 h-8 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2" opacity="0.9"/>
        <rect x="4" y="6" width="16" height="12" rx="1" stroke="rgba(255,255,255,0.5)" stroke-width="1" fill="none"/>
        <path d="M6 9l2 2-2 2" stroke="rgba(255,255,255,1)" stroke-width="1.5" fill="none"/>
        <path d="M10 13h6" stroke="rgba(255,255,255,0.9)" stroke-width="1.2"/>
        <path d="M6 15h4M12 15h2M16 15h2" stroke="rgba(255,255,255,0.7)" stroke-width="0.8"/>
        <circle cx="6" cy="6.5" r="0.5" fill="rgba(255,87,87,0.9)"/>
        <circle cx="8" cy="6.5" r="0.5" fill="rgba(255,206,84,0.9)"/>
        <circle cx="10" cy="6.5" r="0.5" fill="rgba(104,211,145,0.9)"/>
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
</script>