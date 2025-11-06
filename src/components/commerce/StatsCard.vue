<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="p-5">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div :class="iconBgClass" class="w-8 h-8 rounded-md flex items-center justify-center">
            <component :is="icon" :class="iconClass" class="w-5 h-5" />
          </div>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ title }}
            </dt>
            <dd class="flex items-baseline">
              <div class="text-2xl font-semibold text-gray-900">
                {{ formattedValue }}
              </div>
              <div v-if="change" class="ml-2 flex items-baseline text-sm font-semibold" :class="changeClass">
                <svg v-if="change > 0" class="self-center flex-shrink-0 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <svg v-else class="self-center flex-shrink-0 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                <span class="sr-only">{{ change > 0 ? 'Increased' : 'Decreased' }} by</span>
                {{ Math.abs(change) }}%
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <div v-if="footer" class="bg-gray-50 px-5 py-3">
      <div class="text-sm">
        <router-link v-if="footerLink" :to="footerLink" class="font-medium text-primary-purple hover:text-primary-purple-600">
          {{ footer }}
        </router-link>
        <span v-else class="text-gray-500">{{ footer }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue'

interface Props {
  title: string
  value: string | number
  icon: any
  iconBgClass?: string
  iconClass?: string
  change?: number
  footer?: string
  footerLink?: string
  format?: 'currency' | 'number' | 'percentage'
}

const props = withDefaults(defineProps<Props>(), {
  iconBgClass: 'bg-blue-500',
  iconClass: 'text-white',
  format: 'number'
})

const formattedValue = computed(() => {
  if (props.format === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(props.value))
  }
  
  if (props.format === 'percentage') {
    return `${props.value}%`
  }
  
  return props.value
})

const changeClass = computed(() => {
  if (!props.change) return ''
  return props.change > 0 ? 'text-green-600' : 'text-red-600'
})
</script>
