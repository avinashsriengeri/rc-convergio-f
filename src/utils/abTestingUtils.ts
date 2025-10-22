/**
 * A/B Testing Utilities
 * Helper functions for A/B testing operations
 */

export interface UserBucket {
  userId?: string;
  sessionId: string;
  bucketId: string;
  testAssignments: Record<string, string>; // testId -> variantId
  createdAt: Date;
  lastSeen: Date;
}

export interface TestConfiguration {
  id: string;
  name: string;
  trafficAllocation: number; // 0-100
  variants: Array<{
    id: string;
    name: string;
    trafficPercentage: number;
    isControl: boolean;
  }>;
  targetingRules?: Array<{
    attribute: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in';
    value: any;
  }>;
}

/**
 * Generate a consistent hash for user bucketing
 */
export function generateUserHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Determine if user should be included in test based on traffic allocation
 */
export function shouldIncludeInTest(
  userId: string, 
  testId: string, 
  trafficAllocation: number
): boolean {
  const hash = generateUserHash(`${userId}_${testId}`);
  const bucket = hash % 100;
  return bucket < trafficAllocation;
}

/**
 * Assign user to variant within a test
 */
export function assignToVariant(
  userId: string,
  testId: string,
  variants: Array<{ id: string; trafficPercentage: number }>
): string | null {
  const hash = generateUserHash(`${userId}_${testId}_variant`);
  const bucket = hash % 100;
  
  let cumulativePercentage = 0;
  for (const variant of variants) {
    cumulativePercentage += variant.trafficPercentage;
    if (bucket < cumulativePercentage) {
      return variant.id;
    }
  }
  
  return null;
}

/**
 * Check if user meets targeting criteria
 */
export function meetsTargetingCriteria(
  userAttributes: Record<string, any>,
  targetingRules: Array<{
    attribute: string;
    operator: string;
    value: any;
  }>
): boolean {
  if (!targetingRules || targetingRules.length === 0) {
    return true; // No targeting rules means everyone qualifies
  }

  return targetingRules.every(rule => {
    const userValue = userAttributes[rule.attribute];
    
    switch (rule.operator) {
      case 'equals':
        return userValue === rule.value;
      case 'not_equals':
        return userValue !== rule.value;
      case 'contains':
        return typeof userValue === 'string' && userValue.includes(rule.value);
      case 'in':
        return Array.isArray(rule.value) && rule.value.includes(userValue);
      case 'not_in':
        return Array.isArray(rule.value) && !rule.value.includes(userValue);
      default:
        return false;
    }
  });
}

/**
 * Calculate statistical significance using chi-squared test
 */
export function calculateChiSquaredTest(
  controlConversions: number,
  controlVisitors: number,
  variantConversions: number,
  variantVisitors: number
): {
  chiSquared: number;
  pValue: number;
  significant: boolean;
  confidence: number;
} {
  // Calculate conversion rates
  const controlRate = controlConversions / controlVisitors;
  const variantRate = variantConversions / variantVisitors;
  
  // Calculate pooled rate
  const pooledRate = (controlConversions + variantConversions) / (controlVisitors + variantVisitors);
  
  // Calculate expected values
  const expectedControlConversions = controlVisitors * pooledRate;
  const expectedVariantConversions = variantVisitors * pooledRate;
  const expectedControlNonConversions = controlVisitors * (1 - pooledRate);
  const expectedVariantNonConversions = variantVisitors * (1 - pooledRate);
  
  // Calculate chi-squared statistic
  const chiSquared = 
    Math.pow(controlConversions - expectedControlConversions, 2) / expectedControlConversions +
    Math.pow((controlVisitors - controlConversions) - expectedControlNonConversions, 2) / expectedControlNonConversions +
    Math.pow(variantConversions - expectedVariantConversions, 2) / expectedVariantConversions +
    Math.pow((variantVisitors - variantConversions) - expectedVariantNonConversions, 2) / expectedVariantNonConversions;
  
  // Convert to p-value (simplified approximation for 1 degree of freedom)
  const pValue = chiSquaredToPValue(chiSquared);
  const confidence = (1 - pValue) * 100;
  
  return {
    chiSquared: Math.round(chiSquared * 1000) / 1000,
    pValue: Math.round(pValue * 10000) / 10000,
    significant: pValue < 0.05,
    confidence: Math.round(confidence * 100) / 100
  };
}

/**
 * Convert chi-squared statistic to p-value (simplified)
 */
function chiSquaredToPValue(chiSquared: number): number {
  // Simplified approximation for 1 degree of freedom
  // In production, use a proper statistical library
  if (chiSquared < 0.004) return 0.95;
  if (chiSquared < 0.016) return 0.90;
  if (chiSquared < 0.064) return 0.80;
  if (chiSquared < 0.148) return 0.70;
  if (chiSquared < 0.275) return 0.60;
  if (chiSquared < 0.455) return 0.50;
  if (chiSquared < 0.708) return 0.40;
  if (chiSquared < 1.074) return 0.30;
  if (chiSquared < 1.642) return 0.20;
  if (chiSquared < 2.706) return 0.10;
  if (chiSquared < 3.841) return 0.05;
  if (chiSquared < 5.024) return 0.025;
  if (chiSquared < 6.635) return 0.01;
  if (chiSquared < 7.879) return 0.005;
  return 0.001;
}

/**
 * Calculate minimum sample size needed for statistical power
 */
export function calculateMinimumSampleSize(
  baselineConversionRate: number,
  minimumDetectableEffect: number,
  statisticalPower: number = 0.8,
  significanceLevel: number = 0.05
): number {
  // Simplified calculation - in production, use proper statistical formulas
  const effectSize = minimumDetectableEffect / 100;
  const p1 = baselineConversionRate;
  const p2 = p1 * (1 + effectSize);
  
  // Z-scores for power and significance
  const zAlpha = getZScore(1 - significanceLevel / 2);
  const zBeta = getZScore(statisticalPower);
  
  // Pooled proportion
  const pPooled = (p1 + p2) / 2;
  
  // Sample size calculation
  const numerator = Math.pow(zAlpha * Math.sqrt(2 * pPooled * (1 - pPooled)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
  const denominator = Math.pow(p2 - p1, 2);
  
  return Math.ceil(numerator / denominator);
}

/**
 * Get Z-score for given probability
 */
function getZScore(probability: number): number {
  // Simplified Z-score lookup
  const zScores: Record<string, number> = {
    '0.5': 0,
    '0.6': 0.253,
    '0.7': 0.524,
    '0.8': 0.842,
    '0.9': 1.282,
    '0.95': 1.645,
    '0.975': 1.96,
    '0.99': 2.326,
    '0.995': 2.576
  };
  
  const key = probability.toString();
  return zScores[key] || 1.96; // Default to 95% confidence
}

/**
 * Calculate lift (improvement) percentage
 */
export function calculateLift(controlRate: number, variantRate: number): number {
  if (controlRate === 0) return 0;
  return Math.round(((variantRate - controlRate) / controlRate) * 10000) / 100;
}

/**
 * Determine test winner based on statistical significance and business rules
 */
export function determineWinner(
  variants: Array<{
    id: string;
    name: string;
    visitors: number;
    conversions: number;
    isControl: boolean;
  }>,
  confidenceThreshold: number = 95,
  minimumSampleSize: number = 1000
): {
  winner: string | null;
  reason: string;
  confidence: number;
  recommendation: string;
} {
  const control = variants.find(v => v.isControl);
  const testVariants = variants.filter(v => !v.isControl);
  
  if (!control || testVariants.length === 0) {
    return {
      winner: null,
      reason: 'Invalid test configuration',
      confidence: 0,
      recommendation: 'Ensure test has control and at least one variant'
    };
  }
  
  // Check minimum sample size
  const totalVisitors = variants.reduce((sum, v) => sum + v.visitors, 0);
  if (totalVisitors < minimumSampleSize) {
    return {
      winner: null,
      reason: 'Insufficient sample size',
      confidence: 0,
      recommendation: `Continue test until reaching ${minimumSampleSize} total visitors`
    };
  }
  
  // Find best performing variant
  let bestVariant = control;
  let bestRate = control.conversions / control.visitors;
  let highestConfidence = 0;
  
  for (const variant of testVariants) {
    const variantRate = variant.conversions / variant.visitors;
    const stats = calculateChiSquaredTest(
      control.conversions,
      control.visitors,
      variant.conversions,
      variant.visitors
    );
    
    if (variantRate > bestRate && stats.confidence >= confidenceThreshold) {
      bestVariant = variant;
      bestRate = variantRate;
      highestConfidence = stats.confidence;
    }
  }
  
  if (bestVariant === control) {
    return {
      winner: control.id,
      reason: 'Control performs best or no variant reaches significance threshold',
      confidence: highestConfidence,
      recommendation: 'Consider running test longer or trying different variants'
    };
  }
  
  return {
    winner: bestVariant.id,
    reason: `Variant shows significant improvement over control`,
    confidence: highestConfidence,
    recommendation: `Implement ${bestVariant.name} as the new default`
  };
}

/**
 * Generate test report
 */
export function generateTestReport(
  testName: string,
  variants: Array<{
    id: string;
    name: string;
    visitors: number;
    conversions: number;
    isControl: boolean;
  }>,
  startDate: Date,
  endDate?: Date
): {
  testName: string;
  duration: number;
  totalVisitors: number;
  totalConversions: number;
  variants: Array<{
    name: string;
    visitors: number;
    conversions: number;
    conversionRate: number;
    lift: number;
    confidence: number;
    isWinner: boolean;
  }>;
  winner: string | null;
  recommendation: string;
} {
  const control = variants.find(v => v.isControl);
  const controlRate = control ? control.conversions / control.visitors : 0;
  
  const processedVariants = variants.map(variant => {
    const conversionRate = variant.conversions / variant.visitors;
    const lift = calculateLift(controlRate, conversionRate);
    
    let confidence = 0;
    if (control && variant !== control) {
      const stats = calculateChiSquaredTest(
        control.conversions,
        control.visitors,
        variant.conversions,
        variant.visitors
      );
      confidence = stats.confidence;
    }
    
    return {
      name: variant.name,
      visitors: variant.visitors,
      conversions: variant.conversions,
      conversionRate: Math.round(conversionRate * 10000) / 100,
      lift,
      confidence,
      isWinner: false
    };
  });
  
  // Determine winner
  const winnerResult = determineWinner(variants);
  if (winnerResult.winner) {
    const winnerVariant = processedVariants.find(v => 
      variants.find(orig => orig.id === winnerResult.winner)?.name === v.name
    );
    if (winnerVariant) {
      winnerVariant.isWinner = true;
    }
  }
  
  const duration = endDate 
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    testName,
    duration,
    totalVisitors: variants.reduce((sum, v) => sum + v.visitors, 0),
    totalConversions: variants.reduce((sum, v) => sum + v.conversions, 0),
    variants: processedVariants,
    winner: winnerResult.winner,
    recommendation: winnerResult.recommendation
  };
}
