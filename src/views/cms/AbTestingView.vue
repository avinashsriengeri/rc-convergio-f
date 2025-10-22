<template>
  <div class="ab-testing-view">
    <!-- Navigation Tabs -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="activeTab = 'dashboard'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'dashboard'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Dashboard
        </button>
        <button
          @click="activeTab = 'tests'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'tests'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Manage Tests
        </button>
      </nav>
    </div>


    <!-- Dashboard Tab -->
    <div v-if="activeTab === 'dashboard'" class="transition-opacity duration-200">
      <AbTestDashboard @switch-to-manage="switchToManageTab" />
    </div>

    <!-- Tests Management Tab -->
    <div v-else-if="activeTab === 'tests'" class="transition-opacity duration-200">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Manage A/B Tests</h2>
          <p class="text-gray-600 mt-1">Create and manage your A/B tests</p>
        </div>
        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create A/B Test
        </button>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Tests</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ activeTests }}</p>
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
              <p class="text-sm font-medium text-gray-600">Total Views</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ totalViews.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Conversions</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ totalConversions.toLocaleString() }}</p>
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
              <p class="text-3xl font-bold text-gray-900 mt-2">+{{ avgImprovement }}%</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search A/B tests..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            v-model="filterStatus"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>

          <select
            v-model="filterPage"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Pages</option>
            <option v-for="page in cmsStore.pages" :key="page.id" :value="page.id">
              {{ page.title }}
            </option>
          </select>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex">
          <svg class="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div class="text-sm text-red-800">
            <p class="font-medium">Error Loading Tests</p>
            <p class="mt-1">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading A/B tests...</span>
      </div>

      <!-- A/B Tests List -->
      <div v-else class="space-y-6">
        <div
          v-for="test in filteredTests"
          :key="test.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <!-- Test Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ test.name || test.variant_name }}</h3>
                <p class="text-sm text-gray-500">Page: {{ test.page?.title || 'Unknown Page' }}</p>
              </div>
              <div class="flex items-center space-x-3">
                <span
                  :class="[
                    'px-3 py-1 text-xs font-medium rounded-full',
                    test.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ test.is_active ? 'Active' : 'Inactive' }}
                </span>
                <span
                  v-if="test.is_winner"
                  class="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full"
                >
                  Winner
                </span>
              </div>
            </div>
          </div>

          <!-- Test Metrics -->
          <div class="px-6 py-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900">{{ (test.views || 0).toLocaleString() }}</p>
                <p class="text-sm text-gray-500">Views</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900">{{ (test.conversions || 0).toLocaleString() }}</p>
                <p class="text-sm text-gray-500">Conversions</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900">{{ test.ctr || 0 }}%</p>
                <p class="text-sm text-gray-500">Conversion Rate</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900">
                  {{ test.confidence || 0 }}%
                </p>
                <p class="text-sm text-gray-500">Confidence</p>
              </div>
            </div>
          </div>

          <!-- Test Actions -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex space-x-3">
                <button
                  v-if="test.is_active"
                  @click="stopTest(test)"
                  class="px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100"
                >
                  Stop Test
                </button>
                <button
                  v-else-if="!test.is_winner"
                  @click="startTest(test)"
                  class="px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
                >
                  Start Test
                </button>
                <button
                  v-if="test.is_active && !test.is_winner"
                  @click="setWinner(test)"
                  class="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  Set as Winner
                </button>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editTest(test)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="deleteTest(test.id)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredTests.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No A/B tests found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ allTests.length === 0 ? 'Create your first A/B test to optimize your pages.' : 'No tests match your current filters.' }}
        </p>
      </div>

      <!-- Create A/B Test Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Create A/B Test</h3>
          </div>
          
          <div class="p-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
                <input
                  v-model="newTest.variant_name"
                  type="text"
                  placeholder="e.g., Hero Button Color Test"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Target Page</label>
                <select
                  v-model="newTest.page_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a page</option>
                  <option v-for="page in cmsStore.pages" :key="page.id" :value="page.id">
                    {{ page.title }} ({{ page.slug }})
                  </option>
                </select>
                <p v-if="!newTest.page_id && cmsStore.pages.length === 0" class="mt-1 text-sm text-red-600">
                  No pages available. Create a page first.
                </p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Variant Description</label>
                <textarea
                  v-model="newTest.description"
                  rows="3"
                  placeholder="Describe what you're testing (e.g., Different button color, new headline, etc.)"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
          
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              @click="showCreateModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="createTest"
              :disabled="!canCreateTest"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Create Test
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCmsStore } from '@/stores/cms';
import AbTestDashboard from '@/components/cms/AbTestDashboard.vue';

const router = useRouter();
const cmsStore = useCmsStore();

const activeTab = ref('dashboard');
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const filterStatus = ref('');
const filterPage = ref('');
const showCreateModal = ref(false);

const allTests = ref([]);

const newTest = ref({
  variant_name: '',
  page_id: null,
  description: '',
  variant_content: {},
  is_active: false
});

const activeTests = computed(() => allTests.value.filter(t => t.is_active).length);
const totalViews = computed(() => allTests.value.reduce((sum, t) => sum + (t.views || 0), 0));
const totalConversions = computed(() => allTests.value.reduce((sum, t) => sum + (t.conversions || 0), 0));
const avgImprovement = computed(() => {
  if (allTests.value.length === 0) return 0;
  const improvements = allTests.value.map(t => t.improvement || 0);
  const sum = improvements.reduce((acc, imp) => acc + imp, 0);
  return Math.round(sum / improvements.length);
});

const canCreateTest = computed(() => {
  return newTest.value.variant_name && 
         newTest.value.variant_name.trim().length > 0 && 
         newTest.value.page_id && 
         parseInt(newTest.value.page_id) > 0;
});

const filteredTests = computed(() => {
  let tests = allTests.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    tests = tests.filter(t => 
      (t.variant_name || t.name)?.toLowerCase().includes(query) || 
      t.page?.title?.toLowerCase().includes(query)
    );
  }

  if (filterStatus.value) {
    if (filterStatus.value === 'active') {
      tests = tests.filter(t => t.is_active);
    } else if (filterStatus.value === 'completed') {
      tests = tests.filter(t => !t.is_active && t.is_winner);
    } else if (filterStatus.value === 'paused') {
      tests = tests.filter(t => !t.is_active && !t.is_winner);
    }
  }

  if (filterPage.value) {
    tests = tests.filter(t => t.page_id === parseInt(filterPage.value));
  }

  return tests;
});

const editTest = (test) => {
  // Navigate to page editor with A/B testing panel open
  router.push(`/cms/editor/${test.page_id}?openAbTesting=true`);
};

const startTest = async (test) => {
  // ✅ VALIDATE: Check test has valid ID
  if (!test.id || test.id === 'undefined' || typeof test.id === 'string') {
    console.error('[A/B Testing] Cannot start test: Invalid ID', test);
    alert('Error: Test ID is invalid. Please refresh the page and try again.');
    return;
  }
  
  try {
    console.log('[A/B Testing] Starting test with ID:', test.id, typeof test.id);
    await cmsStore.startAbTest(test.id);
    
    // Update local state
    const index = allTests.value.findIndex(t => t.id === test.id);
    if (index !== -1) {
      allTests.value[index].is_active = true;
      allTests.value[index].status = 'running';
    }
    
    alert('A/B test started successfully!');
  } catch (error) {
    console.error('Failed to start test:', error);
    alert(`Failed to start A/B test: ${error.message}`);
  }
};

const stopTest = async (test) => {
  // ✅ VALIDATE: Check test has valid ID
  if (!test.id || test.id === 'undefined' || typeof test.id === 'string') {
    console.error('[A/B Testing] Cannot stop test: Invalid ID', test);
    alert('Error: Test ID is invalid. Please refresh the page and try again.');
    return;
  }
  
  if (confirm('Are you sure you want to stop this A/B test?')) {
    try {
      console.log('[A/B Testing] Stopping test with ID:', test.id, typeof test.id);
      await cmsStore.stopAbTest(test.id);
      
      // Update local state
      const index = allTests.value.findIndex(t => t.id === test.id);
      if (index !== -1) {
        allTests.value[index].is_active = false;
        allTests.value[index].status = 'paused';
      }
      
      alert('A/B test stopped successfully!');
    } catch (error) {
      console.error('Failed to stop test:', error);
      alert(`Failed to stop A/B test: ${error.message}`);
    }
  }
};

const setWinner = async (test) => {
  // ✅ VALIDATE: Check test has valid ID
  if (!test.id || test.id === 'undefined' || typeof test.id === 'string') {
    console.error('[A/B Testing] Cannot set winner: Invalid ID', test);
    alert('Error: Test ID is invalid. Please refresh the page and try again.');
    return;
  }
  
  if (confirm(`Set "${test.variant_name || test.name}" as the winning variant?`)) {
    try {
      console.log('[A/B Testing] Setting winner for test ID:', test.id, typeof test.id);
      await cmsStore.setAbTestWinner(test.id);
      
      // Update local state
      const index = allTests.value.findIndex(t => t.id === test.id);
      if (index !== -1) {
        allTests.value[index].is_winner = true;
        allTests.value[index].is_active = false;
        allTests.value[index].status = 'completed';
      }
      
      alert('Winner set successfully!');
    } catch (error) {
      console.error('Failed to set winner:', error);
      alert(`Failed to set A/B test winner: ${error.message}`);
    }
  }
};

const deleteTest = async (id) => {
  // ✅ VALIDATE: Check for valid ID
  if (!id || id === 'undefined' || typeof id === 'string') {
    console.error('[A/B Testing] Cannot delete test: Invalid ID', id);
    alert('Error: Test ID is invalid. Please refresh the page and try again.');
    return;
  }
  
  if (confirm('Are you sure you want to delete this A/B test?')) {
    try {
      console.log('[A/B Testing] Deleting test with ID:', id, typeof id);
      await cmsStore.deleteAbTest(id);
      
      // Remove from local state
      allTests.value = allTests.value.filter(t => t.id !== id);
      
      alert('A/B test deleted successfully!');
    } catch (error) {
      console.error('Failed to delete test:', error);
      alert(`Failed to delete A/B test: ${error.message}`);
    }
  }
};

const createTest = async () => {
  try {
    // Validate form data
    if (!newTest.value.variant_name || newTest.value.variant_name.trim().length === 0) {
      alert('Test name is required');
      return;
    }
    
    if (!newTest.value.page_id) {
      alert('Please select a target page');
      return;
    }
    
    console.log('[A/B Testing] Creating test with data:', newTest.value);
    
    const testData = {
      page_id: parseInt(newTest.value.page_id), // Ensure integer
      name: newTest.value.variant_name.trim(),
      description: newTest.value.description?.trim() || '',
      variants: [
        {
          id: 'control',
          name: 'Control',
          content: { components: [] },
          traffic_percentage: 50,
          is_control: true
        },
        {
          id: 'variant-a',
          name: 'Variant A',
          content: { components: [] },
          traffic_percentage: 50,
          is_control: false
        }
      ],
      goals: [
        {
          id: 'default-goal',
          name: 'Page Conversion',
          type: 'page_view',
          value: 1
        }
      ],
      traffic_allocation: 100,
      confidence_threshold: 95,
      min_sample_size: 1000
    };
    
    console.log('[A/B Testing] Sending test data:', testData);
    
    const result = await cmsStore.createAbTest(testData);
    console.log('[A/B Testing] Create result:', result);
    
    // ✅ CORRECT: Extract test with proper ID
    const createdTest = result.test || result;
    
    if (!createdTest.id) {
      console.error('[A/B Testing] No ID in created test:', createdTest);
      throw new Error('Test created but no ID returned');
    }
    
    console.log('[A/B Testing] Test created with ID:', createdTest.id);
    
    const newTestWithPage = {
      ...createdTest,
      page: cmsStore.pages.find(p => p.id === parseInt(newTest.value.page_id))
    };
    
    allTests.value.push(newTestWithPage);
    
    // Reset form
    newTest.value = {
      variant_name: '',
      page_id: null,
      description: '',
      variant_content: {},
      is_active: false
    };
    
    showCreateModal.value = false;
    
    // Show success message with development note if applicable
    const message = result.message?.includes('development mode') 
      ? 'A/B test created successfully in development mode! Backend API implementation needed for production.'
      : 'A/B test created successfully! You can now configure variants in the page editor.';
      
    alert(message);
    
  } catch (error) {
    console.error('Failed to create test:', error);
    
    let errorMessage = 'Failed to create A/B test.';
    
    if (error.response?.status === 401) {
      errorMessage = 'Authentication required. Please log in again.';
    } else if (error.response?.status === 422) {
      // Show detailed validation errors if available
      if (error.response?.data?.details) {
        const validationErrors = Object.values(error.response.data.details).flat();
        errorMessage = 'Validation errors:\n' + validationErrors.join('\n');
      } else {
        errorMessage = 'Invalid test data. Please check your inputs:\n- Test name is required\n- Target page must be selected\n- All fields must be properly filled';
      }
    } else if (error.response?.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      errorMessage = 'Network error. Backend API not available.\n\nThis is expected in development mode.\nPlease implement the backend endpoints using the provided documentation.';
    } else {
      errorMessage = `Error: ${error.message || 'Unknown error occurred'}`;
    }
    
    alert(errorMessage);
  }
};

const switchToManageTab = () => {
  activeTab.value = 'tests';
};

const openCreateModal = async () => {
  // Ensure pages are loaded before showing modal
  if (cmsStore.pages.length === 0) {
    try {
      await cmsStore.fetchPages();
    } catch (error) {
      console.error('Failed to load pages:', error);
      alert('Failed to load pages. Please refresh and try again.');
      return;
    }
  }
  
  if (cmsStore.pages.length === 0) {
    alert('No pages available. Please create a page first before creating A/B tests.');
    return;
  }
  
  showCreateModal.value = true;
};

const loadAbTestData = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Load pages first
    await cmsStore.fetchPages();
    
    // Load all A/B tests from API
    const response = await cmsStore.getActiveAbTests();
    allTests.value = (response.tests || []).map(test => {
      // Ensure page information is included
      const page = cmsStore.pages.find(p => p.id === test.page_id);
      return {
        ...test,
        page: page || { title: 'Unknown Page', slug: 'unknown' },
        // Calculate metrics from variants
        views: test.variants ? test.variants.reduce((sum, v) => sum + (v.views || 0), 0) : 0,
        conversions: test.variants ? test.variants.reduce((sum, v) => sum + (v.conversions || 0), 0) : 0,
        ctr: test.variants && test.variants.length > 0 
          ? Math.round((test.variants.reduce((sum, v) => sum + (v.conversion_rate || 0), 0) / test.variants.length) * 100) / 100
          : 0,
        // Use existing fields or defaults
        variant_name: test.name || test.variant_name || 'Unnamed Test',
        is_active: test.status === 'running',
        is_winner: test.status === 'completed' && !!test.winner_variant_id
      };
    });
    
    console.log('[A/B Testing] Loaded tests:', allTests.value);
  } catch (err) {
    console.error('[A/B Testing] Failed to load data:', err);
    allTests.value = [];
    
    // Set user-friendly error message
    if (err.response?.status === 404) {
      console.info('No A/B tests found - this is normal for new installations');
      error.value = null; // Don't show error for 404 - it's expected for new installations
    } else if (err.response?.status === 401) {
      error.value = 'Authentication required. Please log in again.';
    } else if (err.response?.status >= 500) {
      error.value = 'Server error. Please try again later or contact support.';
    } else if (err.code === 'NETWORK_ERROR' || !err.response) {
      error.value = 'Network error. Please check your connection and try again.';
    } else {
      error.value = 'Failed to load A/B tests. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadAbTestData();
});
</script>

<style scoped>
.ab-testing-view {
  max-width: 100%;
  overflow-x: auto;
}
</style>