<template>
  <div class="ab-test-dashboard">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">A/B Testing Dashboard</h2>
        <p class="text-gray-600 mt-2">Monitor and analyze your test performance</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="refreshData"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
        <button
          @click="$emit('switch-to-manage')"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 active:scale-95"
        >
          Manage Tests
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex">
        <svg class="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="text-sm text-red-800">
          <p class="font-medium">Error Loading Data</p>
          <p class="mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Loading A/B testing data...</span>
    </div>

    <!-- Key Metrics -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Tests</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ metrics.activeTests }}</p>
            <p class="text-sm text-green-600 mt-1">
              +{{ metrics.newTestsThisWeek }} this week
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Visitors</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ formatNumber(metrics.totalVisitors) }}</p>
            <p class="text-sm text-blue-600 mt-1">
              {{ metrics.visitorsGrowth }}% vs last period
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Conversions</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ formatNumber(metrics.totalConversions) }}</p>
            <p class="text-sm text-purple-600 mt-1">
              {{ metrics.conversionRate }}% conversion rate
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Avg. Improvement</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">+{{ metrics.avgImprovement }}%</p>
            <p class="text-sm text-yellow-600 mt-1">
              {{ metrics.significantTests }} significant tests
            </p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Results Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Test Results</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variants
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visitors
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conversions
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Improvement
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confidence
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="test in testResults" :key="test.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ test.name }}</div>
                <div class="text-sm text-gray-500">Page: {{ test.page?.title }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    test.status === 'running' ? 'bg-green-100 text-green-800' :
                    test.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    test.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ test.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ test.variants?.length || 0 }} variants
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatNumber(test.totalVisitors) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatNumber(test.totalConversions) }}
                <span class="text-gray-500">({{ test.conversionRate }}%)</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'text-sm font-medium',
                    test.improvement > 0 ? 'text-green-600' :
                    test.improvement < 0 ? 'text-red-600' :
                    'text-gray-600'
                  ]"
                >
                  {{ test.improvement > 0 ? '+' : '' }}{{ test.improvement }}%
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-sm text-gray-900">{{ test.confidence }}%</span>
                  <div
                    v-if="test.confidence >= 95"
                    class="ml-2 w-2 h-2 bg-green-400 rounded-full"
                    title="Statistically significant"
                  ></div>
                  <div
                    v-else-if="test.confidence >= 90"
                    class="ml-2 w-2 h-2 bg-yellow-400 rounded-full"
                    title="Approaching significance"
                  ></div>
                  <div
                    v-else
                    class="ml-2 w-2 h-2 bg-gray-300 rounded-full"
                    title="Not significant"
                  ></div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewTestDetails(test)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                  <button
                    v-if="test.status === 'running' && test.confidence >= 95"
                    @click="declareWinner(test)"
                    class="text-green-600 hover:text-green-900"
                  >
                    Declare Winner
                  </button>
                  <button
                    v-if="test.status === 'running'"
                    @click="pauseTest(test)"
                    class="text-yellow-600 hover:text-yellow-900"
                  >
                    Pause
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Performance Chart -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
      <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">Performance chart will be displayed here</p>
          <p class="text-xs text-gray-400">Integration with charting library needed</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCmsStore } from '@/stores/cms';
import { abTestingService } from '@/services/abTesting';

const emit = defineEmits(['switch-to-manage']);

const router = useRouter();
const cmsStore = useCmsStore();

const loading = ref(false);
const error = ref(null);
const testResults = ref([]);

// Metrics will be calculated from real data
const metrics = ref({
  activeTests: 0,
  newTestsThisWeek: 0,
  totalVisitors: 0,
  visitorsGrowth: 0,
  totalConversions: 0,
  conversionRate: 0,
  avgImprovement: 0,
  significantTests: 0
});

const formatNumber = (num) => {
  return num?.toLocaleString() || 0;
};

const refreshData = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Load all A/B tests and calculate metrics
    await loadTestResults();
    await calculateMetrics();
  } catch (err) {
    console.error('Failed to refresh data:', err);
    error.value = 'Failed to load A/B testing data. Please check your connection and try again.';
  } finally {
    loading.value = false;
  }
};

const loadTestResults = async () => {
  try {
    // Load all A/B tests from API
    const response = await cmsStore.getActiveAbTests();
    testResults.value = response.tests || [];

    // Calculate statistical significance for each test
    testResults.value.forEach(test => {
      if (test.variants && test.variants.length >= 2) {
        const control = test.variants.find(v => v.is_control);
        const variant = test.variants.find(v => !v.is_control);
        
        if (control && variant) {
          const stats = abTestingService.calculateStatisticalSignificance(
            control.conversions || 0,
            control.views || 0,
            variant.conversions || 0,
            variant.views || 0
          );
          
          test.confidence = stats.confidence;
          test.improvement = abTestingService.calculateImprovement(
            (control.conversions || 0) / (control.views || 1),
            (variant.conversions || 0) / (variant.views || 1)
          );
          
          // Calculate totals
          test.totalVisitors = test.variants.reduce((sum, v) => sum + (v.views || 0), 0);
          test.totalConversions = test.variants.reduce((sum, v) => sum + (v.conversions || 0), 0);
          test.conversionRate = test.totalVisitors > 0 
            ? Math.round((test.totalConversions / test.totalVisitors) * 1000) / 10 
            : 0;
        }
      }
    });
  } catch (error) {
    console.error('Failed to load test results:', error);
    // Show user-friendly error message
    testResults.value = [];
  }
};

const calculateMetrics = () => {
  const activeTests = testResults.value.filter(t => t.status === 'running');
  const totalVisitors = testResults.value.reduce((sum, t) => sum + (t.totalVisitors || 0), 0);
  const totalConversions = testResults.value.reduce((sum, t) => sum + (t.totalConversions || 0), 0);
  const significantTests = testResults.value.filter(t => (t.confidence || 0) >= 95).length;
  
  metrics.value = {
    activeTests: activeTests.length,
    newTestsThisWeek: activeTests.filter(t => {
      const createdAt = new Date(t.created_at || Date.now());
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return createdAt >= weekAgo;
    }).length,
    totalVisitors,
    visitorsGrowth: 0, // Will be calculated from historical data in backend
    totalConversions,
    conversionRate: totalVisitors > 0 ? Math.round((totalConversions / totalVisitors) * 1000) / 10 : 0,
    avgImprovement: testResults.value.length > 0 
      ? Math.round(testResults.value.reduce((sum, t) => sum + Math.abs(t.improvement || 0), 0) / testResults.value.length * 10) / 10
      : 0,
    significantTests
  };
};

const viewTestDetails = (test) => {
  router.push(`/cms/ab-testing/${test.id}`);
};

const declareWinner = async (test) => {
  if (confirm(`Declare winner for "${test.name}"? This will stop the test and apply the winning variant.`)) {
    try {
      const winningVariant = test.variants.find(v => !v.is_control && v.conversions / v.visitors > test.variants.find(c => c.is_control).conversions / test.variants.find(c => c.is_control).visitors);
      
      if (winningVariant) {
        await cmsStore.setAbTestWinner(test.id);
        test.status = 'completed';
        test.winner_variant_id = winningVariant.id;
        
        alert(`Winner declared: ${winningVariant.name}`);
      }
    } catch (error) {
      console.error('Failed to declare winner:', error);
      alert('Failed to declare winner');
    }
  }
};

const pauseTest = async (test) => {
  if (confirm(`Pause "${test.name}"? You can resume it later.`)) {
    try {
      await cmsStore.stopAbTest(test.id);
      test.status = 'paused';
      
      alert('Test paused successfully');
    } catch (error) {
      console.error('Failed to pause test:', error);
      alert('Failed to pause test');
    }
  }
};

onMounted(() => {
  refreshData();
});
</script>

<style scoped>
.ab-test-dashboard {
  max-width: 100%;
  overflow-x: auto;
}
</style>
