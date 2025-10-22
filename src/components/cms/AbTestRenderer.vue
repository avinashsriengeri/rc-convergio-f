<template>
  <div class="ab-test-renderer">
    <!-- Render the appropriate variant content -->
    <component
      v-if="activeVariant"
      :is="getComponentType(component.type)"
      v-for="(component, index) in variantContent?.components || []"
      :key="`${activeVariant.id}-${index}`"
      v-bind="component.props"
      :data-ab-test="testId"
      :data-ab-variant="activeVariant.id"
      @click="handleComponentClick"
    />
    
    <!-- Fallback to original content if no variant -->
    <component
      v-else
      :is="getComponentType(component.type)"
      v-for="(component, index) in originalContent?.components || []"
      :key="`original-${index}`"
      v-bind="component.props"
    />

    <!-- A/B Test Debug Panel (Development Only) -->
    <div
      v-if="showDebugPanel && isDevelopment"
      class="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50"
    >
      <div class="flex items-center justify-between mb-2">
        <h4 class="font-medium text-gray-900">A/B Test Debug</h4>
        <button @click="showDebugPanel = false" class="text-gray-400 hover:text-gray-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div v-if="activeTest" class="space-y-2 text-sm">
        <div><strong>Test:</strong> {{ activeTest.name }}</div>
        <div><strong>Variant:</strong> {{ activeVariant?.name || 'Control' }}</div>
        <div><strong>Traffic:</strong> {{ activeVariant?.traffic_percentage || 0 }}%</div>
        <div><strong>Session:</strong> {{ sessionId?.substring(0, 8) }}...</div>
        
        <div class="pt-2 border-t border-gray-200">
          <button
            @click="resetSession"
            class="text-xs text-blue-600 hover:text-blue-800"
          >
            Reset Session
          </button>
        </div>
      </div>
      
      <div v-else class="text-sm text-gray-500">
        No active A/B test
      </div>
    </div>

    <!-- Debug Toggle (Development Only) -->
    <button
      v-if="isDevelopment && !showDebugPanel"
      @click="showDebugPanel = true"
      class="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg z-50 hover:bg-blue-700"
      title="Show A/B Test Debug"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAbTesting } from '@/composables/useAbTesting';
import HeroComponent from './builder/HeroComponent.vue';
import TextComponent from './builder/TextComponent.vue';
import ImageComponent from './builder/ImageComponent.vue';
import FormComponent from './builder/FormComponent.vue';
import CtaComponent from './builder/CtaComponent.vue';

const props = defineProps({
  pageId: {
    type: Number,
    required: true
  },
  testId: {
    type: [String, Number],
    default: null
  },
  originalContent: {
    type: Object,
    default: () => ({ components: [] })
  },
  autoTrack: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['variant-loaded', 'conversion-tracked']);

// A/B Testing composable
const {
  activeTests,
  getVariant,
  getVariantContent,
  trackConversion,
  trackEvent,
  loadActiveTests,
  abTestingService
} = useAbTesting(props.pageId);

// Component state
const showDebugPanel = ref(false);
const isDevelopment = ref(process.env.NODE_ENV === 'development');

// Computed properties
const activeTest = computed(() => {
  if (props.testId) {
    return activeTests.value.find(test => test.id?.toString() === props.testId.toString());
  }
  return activeTests.value[0] || null;
});

const activeVariant = computed(() => {
  if (!activeTest.value) return null;
  return getVariant(activeTest.value.id);
});

const variantContent = computed(() => {
  if (!activeVariant.value) return null;
  return activeVariant.value.content || props.originalContent;
});

const sessionId = computed(() => {
  return abTestingService.getSession().session_id;
});

// Component mapping
const componentMap = {
  hero: HeroComponent,
  text: TextComponent,
  image: ImageComponent,
  form: FormComponent,
  cta: CtaComponent
};

const getComponentType = (type) => {
  return componentMap[type] || 'div';
};

// Event handlers
const handleComponentClick = (event) => {
  if (!props.autoTrack || !activeTest.value) return;

  const target = event.target;
  const goalId = target.getAttribute('data-ab-goal');
  
  if (goalId) {
    trackConversion(activeTest.value.id, goalId);
    emit('conversion-tracked', {
      testId: activeTest.value.id,
      variantId: activeVariant.value?.id,
      goalId
    });
  }
};

const resetSession = () => {
  abTestingService.resetSession();
  // Reload the page to get new variant assignment
  window.location.reload();
};

// Watchers
watch(activeVariant, (newVariant) => {
  if (newVariant) {
    emit('variant-loaded', {
      testId: activeTest.value?.id,
      variant: newVariant
    });
  }
}, { immediate: true });

// Lifecycle
onMounted(async () => {
  await loadActiveTests(props.pageId);
  
  // Track page view if user is in test
  if (activeTest.value && activeVariant.value) {
    abTestingService.trackPageView(activeTest.value.id.toString());
  }
});

// Expose methods for parent components
defineExpose({
  trackConversion: (goalId, value) => {
    if (activeTest.value) {
      trackConversion(activeTest.value.id, goalId, value);
    }
  },
  trackEvent: (eventName, data) => {
    if (activeTest.value) {
      trackEvent(activeTest.value.id, eventName, data);
    }
  },
  getActiveVariant: () => activeVariant.value,
  getActiveTest: () => activeTest.value
});
</script>

<style scoped>
.ab-test-renderer {
  position: relative;
}

/* Ensure debug panel is always visible */
.ab-test-renderer .fixed {
  position: fixed !important;
}
</style>
