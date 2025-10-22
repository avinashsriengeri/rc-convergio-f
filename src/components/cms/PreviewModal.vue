<template>
  <div class="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex flex-col" style="display: block !important;">
    <!-- Preview Header -->
    <div class="bg-gray-900 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h2 class="text-xl font-bold text-white">Preview: {{ page.title }}</h2>
        <div class="flex rounded-lg border border-gray-700 overflow-hidden">
          <button
            @click="viewMode = 'desktop'"
            :class="[
              'px-4 py-2 text-sm font-medium',
              viewMode === 'desktop' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            Desktop
          </button>
          <button
            @click="viewMode = 'tablet'"
            :class="[
              'px-4 py-2 text-sm font-medium border-x border-gray-700',
              viewMode === 'tablet' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            Tablet
          </button>
          <button
            @click="viewMode = 'mobile'"
            :class="[
              'px-4 py-2 text-sm font-medium',
              viewMode === 'mobile' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            Mobile
          </button>
        </div>
      </div>
      <button
        @click="$emit('close')"
        class="text-gray-400 hover:text-white"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Preview Content -->
    <div class="flex-1 overflow-auto p-8 flex justify-center items-start">
      <div
        :class="[
          'bg-white shadow-2xl transition-all duration-300',
          viewMode === 'desktop' ? 'w-full max-w-6xl' : '',
          viewMode === 'tablet' ? 'w-full max-w-3xl' : '',
          viewMode === 'mobile' ? 'w-full max-w-sm' : ''
        ]"
      >
        <!-- Debug Info -->
        <div class="bg-yellow-100 border border-yellow-300 p-4 mb-4 rounded">
          <h4 class="font-medium text-yellow-800">🔍 Preview Debug Info</h4>
          <p class="text-sm text-yellow-700">✅ Preview modal is working!</p>
          <p class="text-sm text-yellow-700">Components to render: {{ components.length }}</p>
          <p class="text-sm text-yellow-700">Page title: {{ page.title || 'No title' }}</p>
          <p class="text-sm text-yellow-700">Modal z-index: 9999</p>
        </div>

        <!-- Render Page Components -->
        <div v-for="(component, index) in components" :key="index" class="mb-4">
          <div class="text-xs text-gray-500 mb-2 bg-gray-100 p-2 rounded">
            Component {{ index + 1 }}: {{ component.type }} (ID: {{ component.id }})
          </div>
          <component
            :is="getComponentType(component.type)"
            :data="component.data || {}"
            :selected="false"
          />
        </div>

        <!-- Empty State -->
        <div v-if="components.length === 0" class="text-center py-20">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">No content to preview</p>
          <p class="mt-1 text-xs text-gray-400">Add components to the page editor first</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HeroComponent from '@/components/cms/builder/HeroComponent.vue';
import TextComponent from '@/components/cms/builder/TextComponent.vue';
import ImageComponent from '@/components/cms/builder/ImageComponent.vue';
import FormComponent from '@/components/cms/builder/FormComponent.vue';
import CtaComponent from '@/components/cms/builder/CtaComponent.vue';

const props = defineProps({
  page: {
    type: Object,
    required: true
  },
  components: {
    type: Array,
    required: true
  }
});

defineEmits(['close']);

const viewMode = ref('desktop');

// Debug logging
console.log('[PreviewModal] Mounted with props:', {
  page: props.page,
  components: props.components,
  componentsLength: props.components.length
});

// Force modal to be visible
console.log('[PreviewModal] Modal should be visible now');

const getComponentType = (type) => {
  const components = {
    hero: HeroComponent,
    text: TextComponent,
    image: ImageComponent,
    form: FormComponent,
    cta: CtaComponent
  };
  return components[type];
};
</script>



