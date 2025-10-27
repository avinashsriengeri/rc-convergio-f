<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900">A/B Testing</h2>
          <p class="text-sm text-gray-500 mt-1">Test different versions to optimize conversions</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        <!-- Create New Test -->
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Active Tests</h3>
            <p class="text-sm text-gray-500">Compare different versions of your page</p>
          </div>
        <button
          @click="showVariantEditor = true"
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          + Create Test
        </button>
        </div>

        <!-- Tests List -->
        <div v-if="tests.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">No A/B tests yet</p>
          <p class="text-xs text-gray-400">Create a test to compare page variants</p>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="(test, index) in tests"
            :key="test.id || index"
            class="border border-gray-200 rounded-lg overflow-hidden"
          >
            <!-- Test Header -->
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <h4 class="font-semibold text-gray-900">{{ test.variant_name }}</h4>
                <span
                  v-if="test.is_winner"
                  class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                >
                  Winner
                </span>
              </div>
              <div class="flex space-x-2">
                <button
                  v-if="!test.is_winner"
                  @click="setWinner(test)"
                  class="px-3 py-1 text-sm text-green-600 bg-green-50 rounded hover:bg-green-100"
                >
                  Set as Winner
                </button>
                <button
                  @click="deleteTest(test)"
                  class="p-1 text-red-600 hover:text-red-800"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Metrics -->
            <div class="p-4">
              <div class="grid grid-cols-3 gap-4 mb-4">
                <!-- Views -->
                <div class="bg-blue-50 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm text-gray-600">Views</div>
                      <div class="text-2xl font-bold text-gray-900">{{ formatNumber(test.views) }}</div>
                    </div>
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>

                <!-- Conversions -->
                <div class="bg-green-50 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm text-gray-600">Conversions</div>
                      <div class="text-2xl font-bold text-gray-900">{{ formatNumber(test.conversions) }}</div>
                    </div>
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>

                <!-- CTR -->
                <div class="bg-purple-50 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm text-gray-600">CTR</div>
                      <div class="text-2xl font-bold text-gray-900">{{ test.ctr }}%</div>
                    </div>
                    <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Performance Chart -->
              <div class="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  :style="{ width: `${test.ctr}%` }"
                ></div>
              </div>
              <div class="mt-1 text-xs text-gray-500 text-right">Performance: {{ test.ctr }}%</div>
            </div>
          </div>
        </div>

        <!-- Statistical Significance -->
        <div v-if="tests.length >= 2" class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex">
            <svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div class="text-sm text-yellow-800">
              <p class="font-medium">Statistical Significance</p>
              <p class="text-xs mt-1">Continue testing to reach statistical significance (typically 1000+ views per variant)</p>
            </div>
          </div>
        </div>

        <!-- Info Box -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex">
            <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div class="text-sm text-blue-800">
              <p class="font-medium mb-1">A/B Testing Best Practices</p>
              <ul class="list-disc list-inside space-y-1 text-xs">
                <li>Test one element at a time for clear results</li>
                <li>Run tests for at least 2 weeks for reliable data</li>
                <li>Ensure sufficient traffic before declaring a winner</li>
                <li>Consider seasonal variations in your data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Variant Editor Modal -->
    <div v-if="showVariantEditor" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">A/B Test Editor</h2>
          <button @click="showVariantEditor = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <AbTestVariantEditor
            :page-id="pageId"
            :existing-test="editingTest"
            @close="showVariantEditor = false"
            @saved="onTestSaved"
            @started="onTestStarted"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCmsStore } from '@/stores/cms';
import AbTestVariantEditor from './AbTestVariantEditor.vue';

const props = defineProps({
  pageId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['close']);
const cmsStore = useCmsStore();

const tests = ref([]);
const showVariantEditor = ref(false);
const editingTest = ref(null);

const createTest = () => {
  const newTest = {
    variant_name: `Variant ${String.fromCharCode(65 + tests.value.length)}`,
    variant_content: {},
    views: 0,
    conversions: 0,
    ctr: 0,
    is_winner: false
  };
  tests.value.push(newTest);
  saveTest(newTest);
};

const saveTest = async (test) => {
  try {
    await cmsStore.createAbTest({
      ...test,
      page_id: props.pageId
    });
  } catch (error) {
    alert('Failed to create test');
  }
};

const setWinner = async (test) => {
  if (confirm('Set this variant as the winner?')) {
    try {
      await cmsStore.setAbTestWinner(test.id);
      tests.value.forEach(t => {
        t.is_winner = t.id === test.id;
      });
    } catch (error) {
      alert('Failed to set winner');
    }
  }
};

const deleteTest = async (test) => {
  if (confirm('Delete this test variant?')) {
    try {
      if (test.id) {
        await cmsStore.deleteAbTest(test.id);
      }
      tests.value = tests.value.filter(t => t !== test);
    } catch (error) {
      alert('Failed to delete test');
    }
  }
};

const formatNumber = (num) => {
  return num?.toLocaleString() || 0;
};

const onTestSaved = (test) => {
  // Refresh tests list
  loadTests();
  showVariantEditor.value = false;
};

const onTestStarted = (test) => {
  // Refresh tests list
  loadTests();
  showVariantEditor.value = false;
};

const loadTests = async () => {
  if (props.pageId) {
    try {
      await cmsStore.fetchAbTests(props.pageId);
      tests.value = cmsStore.abTests || [];
    } catch (error) {
      console.error('Failed to load A/B tests:', error);
      tests.value = [];
    }
  }
};

onMounted(() => {
  loadTests();
});
</script>




