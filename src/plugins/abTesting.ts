/**
 * A/B Testing Plugin for Vue 3
 * Provides global A/B testing functionality and directives
 */

import { App } from 'vue';
import { abTestingService } from '@/services/abTesting';
import { abTestDirective } from '@/composables/useAbTesting';

export interface AbTestingPluginOptions {
  autoInit?: boolean;
  debugMode?: boolean;
  trackingEndpoint?: string;
}

export default {
  install(app: App, options: AbTestingPluginOptions = {}) {
    const {
      autoInit = true,
      debugMode = process.env.NODE_ENV === 'development',
      trackingEndpoint = '/api/ab-testing/track'
    } = options;

    // Add A/B testing service to global properties
    app.config.globalProperties.$abTesting = abTestingService;

    // Register A/B testing directive
    app.directive('ab-test', abTestDirective);

    // Add global methods
    app.config.globalProperties.$trackConversion = (testId: string, goalId: string, value?: number) => {
      abTestingService.trackConversion(testId, goalId, value);
    };

    app.config.globalProperties.$trackAbEvent = (testId: string, eventName: string, data?: any) => {
      abTestingService.trackEvent('custom_event', {
        test_id: testId,
        event_name: eventName,
        data,
        session_id: abTestingService.getSession().session_id,
        timestamp: new Date().toISOString()
      });
    };

    // Initialize A/B testing on app mount
    if (autoInit) {
      app.mixin({
        mounted() {
          // Initialize A/B testing for pages with data-page-id
          const pageId = document.documentElement.getAttribute('data-page-id');
          if (pageId) {
            this.$nextTick(() => {
              initializePageAbTesting(parseInt(pageId));
            });
          }
        }
      });
    }

    // Add debug logging in development
    if (debugMode) {
      console.log('[A/B Testing] Plugin initialized');
      
      // Add global debug methods
      (window as any).abTestingDebug = {
        getSession: () => abTestingService.getSession(),
        resetSession: () => abTestingService.resetSession(),
        trackConversion: (testId: string, goalId: string) => 
          abTestingService.trackConversion(testId, goalId),
        service: abTestingService
      };
    }
  }
};

/**
 * Initialize A/B testing for a specific page
 */
async function initializePageAbTesting(pageId: number) {
  try {
    // This would typically load active tests from the server
    // For now, we'll use the composable's logic
    console.log(`[A/B Testing] Initializing for page ${pageId}`);
  } catch (error) {
    console.error('[A/B Testing] Failed to initialize:', error);
  }
}

/**
 * Utility function to add A/B test tracking to elements
 */
export function addAbTestTracking(element: HTMLElement, testId: string, goalId: string) {
  element.setAttribute('data-ab-test', testId);
  element.setAttribute('data-ab-goal', goalId);
}

/**
 * Utility function to create A/B test variants programmatically
 */
export function createAbTestVariant(testId: string, variantId: string, content: any) {
  return {
    id: variantId,
    testId,
    content,
    render: (container: HTMLElement) => {
      // Custom rendering logic would go here
      container.innerHTML = content.html || '';
    }
  };
}

/**
 * Higher-order component for A/B testing
 */
export function withAbTesting(component: any, testId: string) {
  return {
    ...component,
    setup(props: any, context: any) {
      const originalSetup = component.setup?.(props, context);
      
      // Add A/B testing logic here
      return {
        ...originalSetup,
        testId,
        trackConversion: (goalId: string, value?: number) => {
          abTestingService.trackConversion(testId, goalId, value);
        }
      };
    }
  };
}
