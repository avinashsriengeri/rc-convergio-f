<template>
  <div class="grid grid-cols-12 gap-4 items-start p-4 border border-gray-200 rounded-lg hover:border-primary-purple transition-colors">
    <div class="col-span-5">
      <input
        v-model="localItem.name"
        type="text"
        placeholder="e.g. Code Quality & Standards"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
        @input="updateItem"
      />
    </div>
    <div class="col-span-2">
      <input
        v-model.number="localItem.weight"
        type="number"
        min="0"
        max="100"
        step="0.1"
        placeholder="0"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
        @input="updateItem"
      />
    </div>
    <div class="col-span-4">
      <textarea
        v-model="localItem.description"
        rows="2"
        placeholder="Description / Target..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
        @input="updateItem"
      ></textarea>
    </div>
    <div class="col-span-1 flex justify-end">
      <button
        @click="$emit('remove')"
        class="text-red-600 hover:text-red-800 transition-colors"
        title="Remove KPI"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:item', 'remove'])

const localItem = ref({
  name: props.item.name || '',
  weight: props.item.weight || 0,
  description: props.item.description || ''
})

watch(() => props.item, (newItem) => {
  localItem.value = {
    name: newItem.name || '',
    weight: newItem.weight || 0,
    description: newItem.description || ''
  }
}, { deep: true })

const updateItem = () => {
  emit('update:item', { ...localItem.value })
}
</script>

