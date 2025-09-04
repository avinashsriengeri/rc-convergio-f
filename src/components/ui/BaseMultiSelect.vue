<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

interface Option {
  value: string | number
  label: string
}

interface Props {
  modelValue: (string | number)[]
  options: Option[]
  placeholder?: string
  searchable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select options...',
  searchable: true
})

const emit = defineEmits<{
  'update:modelValue': [(string | number)[]]
}>()

const searchInput = ref<HTMLInputElement>()
const showDropdown = ref(false)
const searchQuery = ref('')

// Computed properties
const selectedItems = computed(() => {
  return props.options.filter(option => props.modelValue.includes(option.value))
})

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options
  }
  
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(option => 
    option.label.toLowerCase().includes(query) &&
    !props.modelValue.includes(option.value)
  )
})

// Methods
const selectItem = (option: Option) => {
  if (!props.modelValue.includes(option.value)) {
    const newValue = [...props.modelValue, option.value]
    emit('update:modelValue', newValue)
  }
  
  searchQuery.value = ''
  nextTick(() => {
    searchInput.value?.focus()
  })
}

const removeItem = (value: string | number) => {
  const newValue = props.modelValue.filter(item => item !== value)
  emit('update:modelValue', newValue)
}

const isSelected = (value: string | number): boolean => {
  return props.modelValue.includes(value)
}

const handleSearch = () => {
  showDropdown.value = true
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (!event.target || !(event.target as Element).closest('.relative')) {
    showDropdown.value = false
  }
}

// Watch for modelValue changes
watch(() => props.modelValue, () => {
  // Update search query if needed
}, { deep: true })

// Event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
