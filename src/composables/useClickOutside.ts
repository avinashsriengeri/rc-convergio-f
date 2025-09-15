import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export type ClickOutsideTarget = Ref<HTMLElement | null> | HTMLElement | null

export function useClickOutside(
  targets: ClickOutsideTarget | ClickOutsideTarget[],
  onOutside: () => void
) {
  const isListening = ref(false)

  const handleClickOutside = (event: Event) => {
    if (!event.target) return

    const targetArray = Array.isArray(targets) ? targets : [targets]
    
    // Check if click is inside any of the target elements
    for (const target of targetArray) {
      const element = target && 'value' in target ? target.value : target
      
      if (element && element instanceof HTMLElement && element.contains(event.target as Node)) {
        return // Click is inside target, don't call onOutside
      }
    }
    
    // Click is outside all targets
    onOutside()
  }

  const startListening = () => {
    if (isListening.value) return
    
    isListening.value = true
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
  }

  const stopListening = () => {
    if (!isListening.value) return
    
    isListening.value = false
    document.removeEventListener('mousedown', handleClickOutside)
    document.removeEventListener('touchstart', handleClickOutside)
  }

  onMounted(() => {
    startListening()
  })

  onUnmounted(() => {
    stopListening()
  })

  return {
    startListening,
    stopListening,
    isListening: isListening.value
  }
}
