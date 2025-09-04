<template>
  <label class="flex items-center cursor-pointer">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      :disabled="disabled"
    />
    <span class="ml-2 text-sm text-gray-700">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  label: string
  disabled?: boolean
}

defineEmits<{
  'update:modelValue': [boolean]
}>()

defineProps<Props>()
</script>
