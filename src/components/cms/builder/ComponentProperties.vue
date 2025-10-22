<template>
  <div class="component-properties space-y-4">
    <!-- Hero Properties -->
    <template v-if="component.type === 'hero'">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          v-model="localData.title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
        <input
          v-model="localData.subtitle"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
        <input
          v-model="localData.buttonText"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
        <input
          v-model="localData.buttonLink"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
        <input
          v-model="localData.backgroundImage"
          type="text"
          placeholder="https://..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
        <select
          v-model="localData.textAlign"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </template>

    <!-- Text Properties -->
    <template v-else-if="component.type === 'text'">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <textarea
          v-model="localData.content"
          rows="10"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder="<p>Your HTML content...</p>"
        ></textarea>
        <p class="text-xs text-gray-500 mt-1">Supports HTML</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
        <select
          v-model="localData.textAlign"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>
    </template>

    <!-- Image Properties -->
    <template v-else-if="component.type === 'image'">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          v-model="localData.src"
          type="text"
          placeholder="https://..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
        <input
          v-model="localData.alt"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Width</label>
        <input
          v-model="localData.width"
          type="text"
          placeholder="100% or 500px"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
        <select
          v-model="localData.align"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </template>

    <!-- Form Properties -->
    <template v-else-if="component.type === 'form'">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
        <input
          v-model="localData.title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
        <input
          v-model="localData.buttonText"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Form Fields</label>
        <div class="space-y-2 mb-2">
          <div
            v-for="(field, index) in localData.fields"
            :key="index"
            class="flex items-center space-x-2 p-2 bg-gray-50 rounded"
          >
            <input
              v-model="field.label"
              type="text"
              placeholder="Field label"
              class="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
            />
            <select
              v-model="field.type"
              class="px-2 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="tel">Phone</option>
              <option value="textarea">Textarea</option>
            </select>
            <button
              @click="removeField(index)"
              class="p-1 text-red-600 hover:text-red-800"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <button
          @click="addField"
          class="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          + Add Field
        </button>
      </div>
    </template>

    <!-- CTA Properties -->
    <template v-else-if="component.type === 'cta'">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          v-model="localData.title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          v-model="localData.description"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
        <input
          v-model="localData.buttonText"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
        <input
          v-model="localData.buttonLink"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
        <input
          v-model="localData.backgroundColor"
          type="color"
          class="w-full h-10 border border-gray-300 rounded-lg"
        />
      </div>
    </template>

    <!-- Auto-apply enabled - changes apply instantly -->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  component: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update']);

const localData = ref({ ...props.component.data });

watch(() => props.component, (newComponent) => {
  localData.value = { ...newComponent.data };
}, { deep: true });

// Auto-apply changes when localData changes
watch(localData, (newData) => {
  emit('update', newData);
}, { deep: true });

const addField = () => {
  if (!localData.value.fields) {
    localData.value.fields = [];
  }
  localData.value.fields.push({
    type: 'text',
    label: 'New Field',
    required: false
  });
};

const removeField = (index) => {
  localData.value.fields.splice(index, 1);
};

const applyChanges = () => {
  emit('update', localData.value);
};
</script>



