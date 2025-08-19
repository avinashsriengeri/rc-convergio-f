<template>
  <form
    @submit.prevent="onSubmit"
    class="bg-white border border-secondary rounded-xl shadow-lg p-8 w-full max-w-md mx-auto animate-scale-in"
    autocomplete="off"
  >
    <slot />
    <button
      type="submit"
      class="mt-6 w-full px-4 py-2 rounded font-semibold bg-accent text-black border-2 border-black justify-center transition-all duration-150 hover:bg-highlight hover:scale-105"
    >
      {{ submitText }}
    </button>
  </form>
</template>

<script setup>
defineProps({
  onSubmit: Function,
  submitText: String,
})
</script>
