<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-2">
      <label class="text-sm font-medium text-gray-700">{{ label }}</label>
      <span class="text-sm font-bold text-primary-purple">{{ modelValue.toFixed(1) }}/10</span>
    </div>
    <div class="relative">
      <input
        type="range"
        :value="modelValue"
        @input="handleInput"
        min="0"
        max="10"
        step="0.1"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        :class="sliderClass"
      />
      <div class="flex justify-between mt-1 text-xs text-gray-500">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
      <div class="flex justify-between mt-1 text-xs">
        <span class="text-gray-400">Needs Improvement</span>
        <span class="text-gray-400">Exceeds Expectations</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
    default: 0
  },
  label: {
    type: String,
    default: 'Score'
  }
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event) => {
  const value = parseFloat(event.target.value)
  emit('update:modelValue', value)
}

const sliderClass = computed(() => {
  if (props.modelValue >= 8) {
    return 'slider-green'
  } else if (props.modelValue >= 6) {
    return 'slider-yellow'
  } else {
    return 'slider-red'
  }
})
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #9333ea;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #9333ea;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-green::-webkit-slider-thumb {
  background: #10b981;
}

.slider-green::-moz-range-thumb {
  background: #10b981;
}

.slider-yellow::-webkit-slider-thumb {
  background: #f59e0b;
}

.slider-yellow::-moz-range-thumb {
  background: #f59e0b;
}

.slider-red::-webkit-slider-thumb {
  background: #ef4444;
}

.slider-red::-moz-range-thumb {
  background: #ef4444;
}
</style>

