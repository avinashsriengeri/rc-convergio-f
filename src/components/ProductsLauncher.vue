<template>
  <div class="relative" data-testid="header-products">
    <!-- Trigger Button -->
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
      class="flex items-center gap-2 rounded-[10px] transition-all duration-200 cursor-pointer focus:outline-none bg-white/20 backdrop-blur-sm ring-1 ring-white/15 hover:bg-white/30 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-white/40 p-2 h-9 sm:h-9"
      :class="{ 'ring-2 ring-offset-0 ring-white/40 bg-white/30 shadow-sm': isOpen }"
    >
      <!-- Professional grid icon - more visible -->
      <svg class="w-5 h-5 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
      </svg>
    </button>

    <!-- Dropdown Panel -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        ref="dropdownRef"
        @click.stop
        data-testid="products-grid"
        class="absolute right-0 top-full mt-3 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 backdrop-blur-sm"
        :class="{ 'right-auto left-0': $i18n.locale === 'ar' }"
        style="box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h3 class="text-xl font-bold text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
            </svg>
            {{ $t('common.header.our_products') }}
          </h3>
          <p class="text-sm text-gray-600 mt-1">Explore our suite of professional solutions</p>
        </div>

        <!-- Products Grid with Scroll -->
        <div class="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div v-if="rcProducts.length === 0" class="text-center py-12 text-gray-500 px-6">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
            {{ $t('common.header.no_products') }}
          </div>
          <div v-else class="grid grid-cols-3 gap-3 p-4">
            <a
              v-for="product in rcProducts"
              :key="product.name"
              :href="product.url"
              :data-testid="`product-tile-${slugify(product.name)}`"
              :aria-label="`Open ${product.name}`"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <!-- Icon Chip -->
              <div class="relative mb-3">
                <div 
                  class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
                  :style="{
                    background: `linear-gradient(135deg, ${product.chipBg.start} 0%, ${product.chipBg.end} 100%)`,
                    boxShadow: `0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px ${product.ring}`
                  }"
                >
                  <svg 
                    class="w-7 h-7 transition-colors duration-200" 
                    :style="{ color: product.iconColor }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    v-html="getIconSvg(product.icon)"
                  ></svg>
                </div>
              </div>
              
              <!-- Product Name -->
              <div class="text-center">
                <h4 class="text-xs font-medium text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
                  {{ product.name }}
                </h4>
              </div>
              
              <!-- External Link Icon -->
              <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </div>
            </a>
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

// Crisp inline SVG icons (outline variants)
const getIconSvg = (iconKey) => {
  const icons = {
    'journal-bookmark': '<path d="M5 3a2 2 0 0 0-2 2v14l7-3 7 3V5a2 2 0 0 0-2-2H5z"/>',
    'shield-lock': '<path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/><path d="M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M12 13v3"/>',
    'shop': '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>',
    'bag-check': '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="m9 12 2 2 4-4"/>',
    'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    'cloud': '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
    'mortarboard': '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    'headset': '<path d="M3 14v3a2 2 0 0 0 2 2h1"/><path d="M21 14v3a2 2 0 0 1-2 2h-1"/><path d="M21 14a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2"/><path d="M12 2a5 5 0 0 0-5 5v4a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z"/>'
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
