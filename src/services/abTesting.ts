/**
 * A/B Testing Service - Complete Implementation
 * Handles variant serving, tracking, and statistical analysis
 */

export interface ABTestVariant {
  id: string;
  name: string;
  content: any;
  traffic_percentage: number;
  is_control: boolean;
}

export interface ABTestGoal {
  id: string;
  name: string;
  type: 'click' | 'form_submit' | 'page_view' | 'custom_event';
  selector?: string; // CSS selector for click goals
  event_name?: string; // Custom event name
  value?: number; // Goal value for revenue tracking
}

export interface ABTest {
  id: string;
  page_id: number;
  name: string;
  description?: string;
  variants: ABTestVariant[];
  goals: ABTestGoal[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  traffic_allocation: number; // Percentage of users to include in test
  start_date?: Date;
  end_date?: Date;
  winner_variant_id?: string;
  confidence_threshold: number; // Default 95%
  min_sample_size: number; // Minimum conversions before declaring winner
  created_at: Date;
  updated_at: Date;
}

export interface ABTestResult {
  variant_id: string;
  variant_name: string;
  visitors: number;
  conversions: number;
  conversion_rate: number;
  confidence: number;
  improvement: number;
  is_winner: boolean;
  statistical_significance: boolean;
}

export interface UserSession {
  session_id: string;
  user_id?: string;
  variant_assignments: Record<string, string>; // test_id -> variant_id
  created_at: Date;
}

class ABTestingService {
  private sessionKey = 'ab_test_session';
  private trackingQueue: any[] = [];
  private session: UserSession;

  constructor() {
    this.initializeSession();
    this.setupEventListeners();
  }

  /**
   * Initialize or load user session for consistent variant assignment
   */
  private initializeSession(): void {
    const stored = localStorage.getItem(this.sessionKey);
    
    if (stored) {
      this.session = JSON.parse(stored);
    } else {
      this.session = {
        session_id: this.generateSessionId(),
        variant_assignments: {},
        created_at: new Date()
      };
      this.saveSession();
    }
  }

  private saveSession(): void {
    localStorage.setItem(this.sessionKey, JSON.stringify(this.session));
  }

  private generateSessionId(): string {
    return 'ab_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  /**
   * Get the variant for a user in a specific test
   * Uses consistent hashing to ensure same user gets same variant
   */
  getVariantForUser(test: ABTest): ABTestVariant | null {
    // Check if user is already assigned to a variant
    if (this.session.variant_assignments[test.id]) {
      const variantId = this.session.variant_assignments[test.id];
      return test.variants.find(v => v.id === variantId) || null;
    }

    // Check if test is running
    if (test.status !== 'running') {
      return null;
    }

    // Check if user should be included in test (traffic allocation)
    const userHash = this.hashString(this.session.session_id + test.id);
    const userPercentile = (userHash % 100) + 1;
    
    if (userPercentile > test.traffic_allocation) {
      return null; // User not in test
    }

    // Assign user to variant based on traffic percentage
    const variants = test.variants.sort((a, b) => a.traffic_percentage - b.traffic_percentage);
    let cumulativePercentage = 0;
    
    for (const variant of variants) {
      cumulativePercentage += variant.traffic_percentage;
      if (userPercentile <= cumulativePercentage) {
        // Assign user to this variant
        this.session.variant_assignments[test.id] = variant.id;
        this.saveSession();
        
        // Track variant assignment
        this.trackEvent('variant_assigned', {
          test_id: test.id,
          variant_id: variant.id,
          session_id: this.session.session_id
        });
        
        return variant;
      }
    }

    return null;
  }

  /**
   * Simple hash function for consistent user bucketing
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Track conversion events
   */
  trackConversion(testId: string, goalId: string, value?: number): void {
    const variantId = this.session.variant_assignments[testId];
    
    if (!variantId) {
      console.warn('No variant assigned for test:', testId);
      return;
    }

    this.trackEvent('conversion', {
      test_id: testId,
      variant_id: variantId,
      goal_id: goalId,
      value: value || 1,
      session_id: this.session.session_id,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track page view for A/B test
   */
  trackPageView(testId: string): void {
    const variantId = this.session.variant_assignments[testId];
    
    if (!variantId) {
      return;
    }

    this.trackEvent('page_view', {
      test_id: testId,
      variant_id: variantId,
      session_id: this.session.session_id,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Generic event tracking
   */
  private trackEvent(eventType: string, data: any): void {
    const event = {
      type: eventType,
      data,
      timestamp: new Date().toISOString()
    };

    // Add to queue
    this.trackingQueue.push(event);

    // Send to backend (with batching)
    this.flushEvents();
  }

  /**
   * Send tracking events to backend
   */
  private async flushEvents(): Promise<void> {
    if (this.trackingQueue.length === 0) return;

    const events = [...this.trackingQueue];
    this.trackingQueue = [];

    try {
      const response = await fetch('https://api.convergio.world/api/cms/abtesting/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ events })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`[A/B Testing] Tracked ${result.processed || events.length} events`);
      
    } catch (error) {
      console.error('Failed to send A/B testing events:', error);
      
      // Re-add events to queue for retry (max 3 retries)
      const retriedEvents = events.map(event => ({
        ...event,
        retries: (event.retries || 0) + 1
      })).filter(event => event.retries <= 3);
      
      this.trackingQueue.unshift(...retriedEvents);
      
      // If network error, retry after delay
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        setTimeout(() => this.flushEvents(), 5000);
      }
    }
  }

  /**
   * Setup automatic event listeners for common goals
   */
  private setupEventListeners(): void {
    // Track clicks on elements with data-ab-goal attribute
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const goalId = target.getAttribute('data-ab-goal');
      const testId = target.getAttribute('data-ab-test');
      
      if (goalId && testId) {
        this.trackConversion(testId, goalId);
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      const goalId = form.getAttribute('data-ab-goal');
      const testId = form.getAttribute('data-ab-test');
      
      if (goalId && testId) {
        this.trackConversion(testId, goalId);
      }
    });

    // Flush events before page unload
    window.addEventListener('beforeunload', () => {
      this.flushEvents();
    });

    // Periodic flush
    setInterval(() => {
      this.flushEvents();
    }, 5000);
  }

  /**
   * Calculate statistical significance using chi-squared test
   */
  calculateStatisticalSignificance(
    controlConversions: number,
    controlVisitors: number,
    variantConversions: number,
    variantVisitors: number
  ): { significant: boolean; confidence: number; pValue: number } {
    // Chi-squared test for statistical significance
    const controlRate = controlConversions / controlVisitors;
    const variantRate = variantConversions / variantVisitors;
    
    const pooledRate = (controlConversions + variantConversions) / (controlVisitors + variantVisitors);
    
    const expectedControlConversions = controlVisitors * pooledRate;
    const expectedVariantConversions = variantVisitors * pooledRate;
    
    const chiSquared = 
      Math.pow(controlConversions - expectedControlConversions, 2) / expectedControlConversions +
      Math.pow(variantConversions - expectedVariantConversions, 2) / expectedVariantConversions;
    
    // Convert chi-squared to p-value (simplified)
    const pValue = this.chiSquaredToPValue(chiSquared);
    const confidence = (1 - pValue) * 100;
    
    return {
      significant: pValue < 0.05, // 95% confidence
      confidence: Math.round(confidence * 100) / 100,
      pValue: Math.round(pValue * 10000) / 10000
    };
  }

  /**
   * Simplified chi-squared to p-value conversion
   */
  private chiSquaredToPValue(chiSquared: number): number {
    // Simplified approximation for 1 degree of freedom
    if (chiSquared < 0.01) return 0.92;
    if (chiSquared < 0.1) return 0.75;
    if (chiSquared < 1) return 0.32;
    if (chiSquared < 2.71) return 0.10;
    if (chiSquared < 3.84) return 0.05;
    if (chiSquared < 6.64) return 0.01;
    return 0.001;
  }

  /**
   * Calculate improvement percentage
   */
  calculateImprovement(controlRate: number, variantRate: number): number {
    if (controlRate === 0) return 0;
    return Math.round(((variantRate - controlRate) / controlRate) * 10000) / 100;
  }

  /**
   * Get current session info
   */
  getSession(): UserSession {
    return { ...this.session };
  }

  /**
   * Reset session (for testing)
   */
  resetSession(): void {
    localStorage.removeItem(this.sessionKey);
    this.initializeSession();
  }

  /**
   * Check if user is in test
   */
  isUserInTest(testId: string): boolean {
    return !!this.session.variant_assignments[testId];
  }

  /**
   * Get user's variant for test
   */
  getUserVariant(testId: string): string | null {
    return this.session.variant_assignments[testId] || null;
  }
}

// Export singleton instance
export const abTestingService = new ABTestingService();
export default abTestingService;
