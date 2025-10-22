<template>
  <div class="ab-test-variant-editor">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">A/B Test Variants</h3>
        <p class="text-sm text-gray-500">Create and manage different versions of your content</p>
      </div>
      <button
        @click="addVariant"
        class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
      >
        + Add Variant
      </button>
    </div>

    <!-- Test Configuration -->
    <div class="bg-gray-50 rounded-lg p-4 mb-6">
      <h4 class="font-medium text-gray-900 mb-3">Test Configuration</h4>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
          <input
            v-model="test.name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Hero Button Color Test"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Traffic Allocation (%)</label>
          <input
            v-model.number="test.traffic_allocation"
            type="number"
            min="1"
            max="100"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confidence Threshold (%)</label>
          <select
            v-model="test.confidence_threshold"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option :value="90">90%</option>
            <option :value="95">95%</option>
            <option :value="99">99%</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Min Sample Size</label>
          <input
            v-model.number="test.min_sample_size"
            type="number"
            min="100"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="1000"
          />
        </div>
      </div>
    </div>

    <!-- Variants List -->
    <div class="space-y-4">
      <div
        v-for="(variant, index) in test.variants"
        :key="variant.id"
        class="border border-gray-200 rounded-lg overflow-hidden"
      >
        <!-- Variant Header -->
        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex items-center">
              <input
                :id="`control-${variant.id}`"
                v-model="variant.is_control"
                type="radio"
                :name="`control-${test.id}`"
                @change="setAsControl(variant.id)"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label :for="`control-${variant.id}`" class="ml-2 text-sm text-gray-600">
                Control
              </label>
            </div>
            <input
              v-model="variant.name"
              type="text"
              class="font-medium text-gray-900 bg-transparent border-none focus:ring-0 focus:outline-none"
              :placeholder="`Variant ${String.fromCharCode(65 + index)}`"
            />
            <span
              v-if="variant.is_control"
              class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
            >
              Control
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="text-sm text-gray-500">
              {{ variant.traffic_percentage }}% traffic
            </div>
            <input
              v-model.number="variant.traffic_percentage"
              type="range"
              min="0"
              max="100"
              class="w-20"
              @input="normalizeTrafficSplit"
            />
            <button
              v-if="test.variants.length > 1"
              @click="removeVariant(variant.id)"
              class="p-1 text-red-600 hover:text-red-800"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Variant Content Editor -->
        <div class="p-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Variant Content
            </label>
            <div class="border border-gray-300 rounded-lg p-4 min-h-[200px] bg-white">
              <!-- Component Selector -->
              <div class="mb-4">
                <select
                  v-model="selectedComponentType[variant.id]"
                  @change="addComponentToVariant(variant.id)"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select component to modify...</option>
                  <option value="hero">Hero Section</option>
                  <option value="text">Text Block</option>
                  <option value="image">Image</option>
                  <option value="cta">Call to Action</option>
                  <option value="form">Form</option>
                </select>
              </div>

              <!-- Component List -->
              <div v-if="variant.content?.components?.length" class="space-y-3">
                <div
                  v-for="(component, compIndex) in variant.content.components"
                  :key="compIndex"
                  class="border border-gray-200 rounded-lg p-3"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700 capitalize">
                      {{ component.type }} Component
                    </span>
                    <button
                      @click="removeComponentFromVariant(variant.id, compIndex)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Component Properties -->
                  <div class="space-y-2">
                    <div v-if="component.type === 'hero'">
                      <input
                        v-model="component.props.heading"
                        type="text"
                        placeholder="Hero heading"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        v-model="component.props.subheading"
                        type="text"
                        placeholder="Hero subheading"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-2"
                      />
                      <input
                        v-model="component.props.buttonText"
                        type="text"
                        placeholder="Button text"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-2"
                      />
                    </div>
                    
                    <div v-else-if="component.type === 'text'">
                      <textarea
                        v-model="component.props.content"
                        placeholder="Text content"
                        rows="3"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>
                    
                    <div v-else-if="component.type === 'cta'">
                      <input
                        v-model="component.props.title"
                        type="text"
                        placeholder="CTA title"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        v-model="component.props.buttonText"
                        type="text"
                        placeholder="Button text"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-2"
                      />
                      <input
                        v-model="component.props.backgroundColor"
                        type="color"
                        class="w-full h-10 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-2"
                      />
                    </div>
                    
                    <div v-else-if="component.type === 'image'">
                      <input
                        v-model="component.props.src"
                        type="url"
                        placeholder="Image URL"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        v-model="component.props.alt"
                        type="text"
                        placeholder="Alt text"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-8 text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p class="mt-2 text-sm">No components added to this variant</p>
                <p class="text-xs text-gray-400">Select a component type above to start</p>
              </div>
            </div>
          </div>

          <!-- Preview Button -->
          <button
            @click="previewVariant(variant)"
            class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            Preview Variant
          </button>
        </div>
      </div>
    </div>

    <!-- Goals Configuration -->
    <div class="mt-8 border-t border-gray-200 pt-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h4 class="font-medium text-gray-900">Conversion Goals</h4>
          <p class="text-sm text-gray-500">Define what counts as a conversion</p>
        </div>
        <button
          @click="addGoal"
          class="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          + Add Goal
        </button>
      </div>

      <div v-if="test.goals?.length" class="space-y-3">
        <div
          v-for="(goal, index) in test.goals"
          :key="goal.id"
          class="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg"
        >
          <input
            v-model="goal.name"
            type="text"
            placeholder="Goal name"
            class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <select
            v-model="goal.type"
            class="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="click">Click</option>
            <option value="form_submit">Form Submit</option>
            <option value="page_view">Page View</option>
            <option value="custom_event">Custom Event</option>
          </select>
          <input
            v-if="goal.type === 'click'"
            v-model="goal.selector"
            type="text"
            placeholder="CSS selector"
            class="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <input
            v-if="goal.type === 'custom_event'"
            v-model="goal.event_name"
            type="text"
            placeholder="Event name"
            class="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="removeGoal(index)"
            class="p-2 text-red-600 hover:text-red-800"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div v-else class="text-center py-6 text-gray-500">
        <p class="text-sm">No conversion goals defined</p>
        <p class="text-xs text-gray-400">Add goals to track what success looks like</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-8 flex justify-between">
      <button
        @click="$emit('close')"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        Cancel
      </button>
      <div class="space-x-3">
        <button
          @click="saveAsDraft"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Save as Draft
        </button>
        <button
          @click="startTest"
          :disabled="!canStartTest"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Start Test
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useCmsStore } from '@/stores/cms';

const props = defineProps({
  pageId: {
    type: Number,
    required: true
  },
  existingTest: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'saved', 'started']);

const cmsStore = useCmsStore();
const selectedComponentType = ref({});

const test = ref({
  id: null,
  page_id: props.pageId,
  name: '',
  description: '',
  variants: [],
  goals: [],
  status: 'draft',
  traffic_allocation: 100,
  confidence_threshold: 95,
  min_sample_size: 1000
});

const canStartTest = computed(() => {
  return test.value.name && 
         test.value.variants.length >= 2 && 
         test.value.goals.length >= 1 &&
         test.value.variants.some(v => v.is_control);
});

// Initialize with existing test or create new
onMounted(() => {
  if (props.existingTest) {
    test.value = { ...props.existingTest };
  } else {
    // Create default control variant
    addVariant(true);
  }
});

const addVariant = (isControl = false) => {
  const variantId = generateId();
  const variant = {
    id: variantId,
    name: isControl ? 'Control' : `Variant ${String.fromCharCode(65 + test.value.variants.length)}`,
    content: { components: [] },
    traffic_percentage: isControl ? 50 : Math.floor(50 / Math.max(1, test.value.variants.length)),
    is_control: isControl,
    views: 0,
    conversions: 0,
    conversion_rate: 0
  };
  
  test.value.variants.push(variant);
  normalizeTrafficSplit();
};

const removeVariant = (variantId) => {
  if (test.value.variants.length <= 1) return;
  
  test.value.variants = test.value.variants.filter(v => v.id !== variantId);
  normalizeTrafficSplit();
};

const setAsControl = (variantId) => {
  test.value.variants.forEach(v => {
    v.is_control = v.id === variantId;
  });
};

const normalizeTrafficSplit = () => {
  const total = test.value.variants.reduce((sum, v) => sum + v.traffic_percentage, 0);
  if (total !== 100 && test.value.variants.length > 0) {
    const adjustment = 100 / total;
    test.value.variants.forEach(v => {
      v.traffic_percentage = Math.round(v.traffic_percentage * adjustment);
    });
  }
};

const addComponentToVariant = (variantId) => {
  const componentType = selectedComponentType.value[variantId];
  if (!componentType) return;
  
  const variant = test.value.variants.find(v => v.id === variantId);
  if (!variant) return;
  
  if (!variant.content) variant.content = { components: [] };
  if (!variant.content.components) variant.content.components = [];
  
  const component = {
    type: componentType,
    props: getDefaultProps(componentType)
  };
  
  variant.content.components.push(component);
  selectedComponentType.value[variantId] = '';
};

const removeComponentFromVariant = (variantId, componentIndex) => {
  const variant = test.value.variants.find(v => v.id === variantId);
  if (variant?.content?.components) {
    variant.content.components.splice(componentIndex, 1);
  }
};

const getDefaultProps = (type) => {
  const defaults = {
    hero: {
      heading: 'Your Heading Here',
      subheading: 'Your subheading here',
      buttonText: 'Get Started',
      backgroundColor: '#3B82F6'
    },
    text: {
      content: 'Your text content here...',
      alignment: 'left'
    },
    cta: {
      title: 'Ready to get started?',
      buttonText: 'Start Now',
      backgroundColor: '#10B981'
    },
    image: {
      src: 'https://via.placeholder.com/400x300',
      alt: 'Placeholder image',
      width: '100%'
    },
    form: {
      title: 'Contact Us',
      fields: [
        { type: 'text', label: 'Name', required: true },
        { type: 'email', label: 'Email', required: true }
      ]
    }
  };
  
  return defaults[type] || {};
};

const addGoal = () => {
  const goal = {
    id: generateId(),
    name: '',
    type: 'click',
    selector: '',
    event_name: '',
    value: 1
  };
  
  if (!test.value.goals) test.value.goals = [];
  test.value.goals.push(goal);
};

const removeGoal = (index) => {
  test.value.goals.splice(index, 1);
};

const previewVariant = (variant) => {
  // Emit event to parent to show preview
  emit('preview', { test: test.value, variant });
};

const saveAsDraft = async () => {
  try {
    if (test.value.id) {
      await cmsStore.updateAbTest(test.value.id, test.value);
    } else {
      const result = await cmsStore.createAbTest(test.value);
      test.value.id = result.test?.id || result.id;
    }
    
    emit('saved', test.value);
  } catch (error) {
    console.error('Failed to save test:', error);
    alert('Failed to save test');
  }
};

const startTest = async () => {
  try {
    await saveAsDraft();
    
    if (test.value.id) {
      test.value.status = 'running';
      await cmsStore.startAbTest(test.value.id);
      emit('started', test.value);
    }
  } catch (error) {
    console.error('Failed to start test:', error);
    alert('Failed to start test');
  }
};

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};
</script>

<style scoped>
.ab-test-variant-editor {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
