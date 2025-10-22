/**
 * A/B Testing Composable
 * Provides reactive A/B testing functionality for Vue components
 */

import { ref, computed, onMounted, watch } from 'vue';
import { abTestingService } from '@/services/abTesting';
import { useCmsStore } from '@/stores/cms';
import type { ABTest, ABTestVariant, ABTestGoal } from '@/services/cms';

export function useAbTesting(pageId?: number) {
  const cmsStore = useCmsStore();
  
  const activeTests = ref<ABTest[]>([]);
  const userVariants = ref<Record<string, ABTestVariant>>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Load active A/B tests for current page
   */
  const loadActiveTests = async (targetPageId?: number) => {
    if (!targetPageId && !pageId) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await cmsStore.getActiveAbTests(targetPageId || pageId);
      activeTests.value = response.tests || [];
      
      // Get user variants for each test
      for (const test of activeTests.value) {
        const variant = abTestingService.getVariantForUser(test);
        if (variant) {
          userVariants.value[test.id!.toString()] = variant;
          
          // Track page view for this test
          abTestingService.trackPageView(test.id!.toString());
        }
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load A/B tests';
      console.error('Failed to load A/B tests:', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get the active variant for a specific test
   */
  const getVariant = (testId: string | number): ABTestVariant | null => {
    return userVariants.value[testId.toString()] || null;
  };

  /**
   * Check if user is in a specific test
   */
  const isInTest = (testId: string | number): boolean => {
    return !!userVariants.value[testId.toString()];
  };

  /**
   * Get variant content for rendering
   */
  const getVariantContent = (testId: string | number, fallbackContent?: any): any => {
    const variant = getVariant(testId);
    return variant?.content || fallbackContent;
  };

  /**
   * Track a conversion for a specific goal
   */
  const trackConversion = (testId: string | number, goalId: string, value?: number) => {
    abTestingService.trackConversion(testId.toString(), goalId, value);
  };

  /**
   * Track a custom event
   */
  const trackEvent = (testId: string | number, eventName: string, data?: any) => {
    const variant = getVariant(testId);
    if (!variant) return;

    abTestingService.trackEvent('custom_event', {
      test_id: testId.toString(),
      variant_id: variant.id,
      event_name: eventName,
      data,
      session_id: abTestingService.getSession().session_id,
      timestamp: new Date().toISOString()
    });
  };

  /**
   * Get test results and statistics
   */
  const getTestResults = async (testId: string | number) => {
    try {
      const response = await cmsStore.getAbTestResults(Number(testId));
      return response.results;
    } catch (err) {
      console.error('Failed to get test results:', err);
      return null;
    }
  };

  /**
   * Check if a test has statistical significance
   */
  const hasStatisticalSignificance = (testId: string | number): boolean => {
    const test = activeTests.value.find(t => t.id?.toString() === testId.toString());
    if (!test || test.variants.length < 2) return false;

    const control = test.variants.find(v => v.is_control);
    const variant = test.variants.find(v => !v.is_control);
    
    if (!control || !variant) return false;

    const result = abTestingService.calculateStatisticalSignificance(
      control.conversions,
      control.views,
      variant.conversions,
      variant.views
    );

    return result.significant && result.confidence >= test.confidence_threshold;
  };

  /**
   * Get improvement percentage for a variant
   */
  const getImprovement = (testId: string | number): number => {
    const test = activeTests.value.find(t => t.id?.toString() === testId.toString());
    if (!test || test.variants.length < 2) return 0;

    const control = test.variants.find(v => v.is_control);
    const variant = test.variants.find(v => !v.is_control);
    
    if (!control || !variant) return 0;

    return abTestingService.calculateImprovement(
      control.conversion_rate,
      variant.conversion_rate
    );
  };

  /**
   * Computed properties
   */
  const hasActiveTests = computed(() => activeTests.value.length > 0);
  const testCount = computed(() => activeTests.value.length);
  const userTestCount = computed(() => Object.keys(userVariants.value).length);

  /**
   * Initialize on mount
   */
  onMounted(() => {
    if (pageId) {
      loadActiveTests(pageId);
    }
  });

  return {
    // State
    activeTests: computed(() => activeTests.value),
    userVariants: computed(() => userVariants.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    
    // Computed
    hasActiveTests,
    testCount,
    userTestCount,
    
    // Methods
    loadActiveTests,
    getVariant,
    isInTest,
    getVariantContent,
    trackConversion,
    trackEvent,
    getTestResults,
    hasStatisticalSignificance,
    getImprovement,
    
    // Service access
    abTestingService
  };
}

/**
 * Global A/B Testing composable for app-wide usage
 */
export function useGlobalAbTesting() {
  const { loadActiveTests, ...rest } = useAbTesting();
  
  /**
   * Load tests for multiple pages
   */
  const loadTestsForPages = async (pageIds: number[]) => {
    for (const pageId of pageIds) {
      await loadActiveTests(pageId);
    }
  };

  /**
   * Initialize A/B testing for the entire app
   */
  const initializeAbTesting = async () => {
    try {
      // Load all active tests
      const cmsStore = useCmsStore();
      const response = await cmsStore.getActiveAbTests();
      
      // Process each test
      for (const test of response.tests || []) {
        const variant = abTestingService.getVariantForUser(test);
        if (variant) {
          rest.userVariants.value[test.id!.toString()] = variant;
        }
      }
    } catch (error) {
      console.error('Failed to initialize A/B testing:', error);
    }
  };

  return {
    ...rest,
    loadTestsForPages,
    initializeAbTesting
  };
}

/**
 * A/B Testing directive for Vue templates
 * Usage: v-ab-test="{ testId: '1', goalId: 'button_click' }"
 */
export const abTestDirective = {
  mounted(el: HTMLElement, binding: any) {
    const { testId, goalId, eventType = 'click' } = binding.value || {};
    
    if (!testId || !goalId) {
      console.warn('A/B test directive requires testId and goalId');
      return;
    }

    // Add data attributes for automatic tracking
    el.setAttribute('data-ab-test', testId);
    el.setAttribute('data-ab-goal', goalId);
    
    // Add manual event listener if needed
    if (eventType !== 'click' && eventType !== 'submit') {
      el.addEventListener(eventType, () => {
        abTestingService.trackConversion(testId, goalId);
      });
    }
  }
};

export default useAbTesting;
