<template>
  <div
    class="image-component relative group cursor-pointer p-6"
    :class="{ 'ring-2 ring-blue-500': selected }"
    @click.stop="$emit('click')"
  >
    <!-- Component Controls -->
    <div class="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <button
        class="component-handle p-2 bg-white rounded shadow-md hover:bg-gray-100 cursor-move"
        title="Drag to reorder"
      >
        <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      <button
        @click.stop="$emit('edit')"
        class="p-2 bg-white rounded shadow-md hover:bg-gray-100"
        title="Edit"
      >
        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        @click.stop="$emit('delete')"
        class="p-2 bg-white rounded shadow-md hover:bg-red-50"
        title="Delete"
      >
        <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- Image Content -->
    <div :style="{ textAlign: data.align || 'center' }">
      <img
        v-if="data.src"
        :src="data.src"
        :alt="data.alt || 'Image'"
        :style="{ width: data.width || '100%', maxWidth: '100%' }"
        class="rounded-lg"
      />
      <div
        v-else
        class="bg-gray-100 rounded-lg flex items-center justify-center"
        style="min-height: 300px"
      >
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">No image selected</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click', 'edit', 'delete']);
</script>





