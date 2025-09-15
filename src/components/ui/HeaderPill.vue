<template>
  <div class="relative">
    <button
      :class="[
        'flex items-center gap-2 rounded-[10px] transition-all duration-200 cursor-pointer focus:outline-none',
        'bg-white/20 backdrop-blur-sm ring-1 ring-white/15',
        'hover:bg-white/30 hover:shadow-sm hover:scale-105',
        'focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-white/40',
        active ? 'ring-2 ring-offset-0 ring-white/40 bg-white/30 shadow-sm scale-105' : '',
        withText ? 'px-3 py-2 h-8' : 'p-2 h-9',
        'sm:h-9'
      ]"
      :aria-label="ariaLabel"
      :title="title"
      v-bind="$attrs"
      @click="$emit('click', $event)"
      @keydown="$emit('keydown', $event)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
      <!-- Icon slot -->
      <slot name="icon" />
      
      <!-- Text slot (for Language and Company pills) -->
      <slot name="text" v-if="withText" />
      
      <!-- Badge slot (for Notifications) -->
      <slot name="badge" v-if="badgeCount > 0" />
    </button>
    
    <!-- Badge positioned outside button for proper positioning -->
    <div
      v-if="badgeCount > 0"
      class="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] leading-[16px] px-[6px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-medium"
      aria-live="polite"
    >
      {{ badgeCount > 9 ? '9+' : badgeCount }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  },
  withText: {
    type: Boolean,
    default: false
  },
  ariaLabel: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  badgeCount: {
    type: Number,
    default: 0
  }
})

defineEmits(['click', 'keydown', 'focus', 'blur'])
</script>
