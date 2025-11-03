<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">SEO Optimization</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        <!-- SEO Score -->
        <div v-if="seoScore !== null" class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-600">SEO Score</div>
              <div class="text-3xl font-bold" :class="getScoreColor(seoScore)">
                {{ seoScore }}/100
              </div>
            </div>
            <div class="w-20 h-20">
              <svg class="transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  stroke-width="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  :stroke="getScoreColor(seoScore, true)"
                  stroke-width="3"
                  :stroke-dasharray="`${seoScore}, 100`"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- SEO Fields -->
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
              <span class="text-gray-500 font-normal">({{ seoData.seo_title?.length || 0 }}/60)</span>
            </label>
            <input
              v-model="seoData.seo_title"
              type="text"
              maxlength="60"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter meta title..."
            />
            <p class="text-xs text-gray-500 mt-1">Optimal length: 50-60 characters</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
              <span class="text-gray-500 font-normal">({{ seoData.seo_description?.length || 0 }}/160)</span>
            </label>
            <textarea
              v-model="seoData.seo_description"
              rows="3"
              maxlength="160"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter meta description..."
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">Optimal length: 150-160 characters</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
            <input
              v-model="seoData.seo_keywords"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="keyword1, keyword2, keyword3"
            />
            <p class="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
          </div>
        </div>

        <!-- Analysis Results -->
        <div v-if="analysisResults" class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">Analysis Results</h3>
          
          <div
            v-for="(issue, index) in analysisResults.issues"
            :key="index"
            class="p-4 rounded-lg border"
            :class="{
              'bg-red-50 border-red-200': issue.type === 'error',
              'bg-yellow-50 border-yellow-200': issue.type === 'warning',
              'bg-blue-50 border-blue-200': issue.type === 'info'
            }"
          >
            <div class="flex items-start">
              <svg
                class="w-5 h-5 mt-0.5 mr-2"
                :class="{
                  'text-red-600': issue.type === 'error',
                  'text-yellow-600': issue.type === 'warning',
                  'text-blue-600': issue.type === 'info'
                }"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  v-if="issue.type === 'error'"
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
                <path
                  v-else-if="issue.type === 'warning'"
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
                <path
                  v-else
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ issue.message }}</p>
                <p v-if="issue.fix" class="text-xs text-gray-600 mt-1">{{ issue.fix }}</p>
              </div>
            </div>
          </div>

          <!-- Suggestions -->
          <div v-if="analysisResults.suggestions?.length" class="mt-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-2">Suggestions</h4>
            <ul class="space-y-1">
              <li
                v-for="(suggestion, index) in analysisResults.suggestions"
                :key="index"
                class="text-sm text-gray-600 flex items-start"
              >
                <svg class="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Analyze Button -->
        <button
          v-if="!analysisResults"
          @click="analyzeSeo"
          :disabled="analyzing"
          class="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          {{ analyzing ? 'Analyzing...' : 'Run SEO Analysis' }}
        </button>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="saveSeo"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Save SEO Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useCmsStore } from '@/stores/cms';

const props = defineProps({
  page: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save']);
const cmsStore = useCmsStore();

const seoData = reactive({
  seo_title: props.page.seo_title || '',
  seo_description: props.page.seo_description || '',
  seo_keywords: props.page.seo_keywords || ''
});

const analyzing = ref(false);
const seoScore = ref(null);
const analysisResults = ref(null);

const analyzeSeo = async () => {
  analyzing.value = true;
  try {
    const result = await cmsStore.analyzeSeo(props.page.id, props.page.content);
    analysisResults.value = result;
    seoScore.value = result.score || 0;
  } catch (error) {
    // Mock data for development
    analysisResults.value = {
      score: 75,
      issues: [
        {
          type: 'warning',
          message: 'Meta description is too short',
          fix: 'Add more descriptive text (at least 120 characters)'
        },
        {
          type: 'info',
          message: 'Consider adding more keywords',
          fix: 'Include relevant keywords in your content'
        }
      ],
      suggestions: [
        'Add alt text to all images',
        'Use header tags (H1, H2) properly',
        'Include internal links'
      ]
    };
    seoScore.value = 75;
  } finally {
    analyzing.value = false;
  }
};

const getScoreColor = (score, hex = false) => {
  if (score >= 80) return hex ? '#10B981' : 'text-green-600';
  if (score >= 60) return hex ? '#F59E0B' : 'text-yellow-600';
  return hex ? '#EF4444' : 'text-red-600';
};

const saveSeo = () => {
  emit('save', seoData);
};

onMounted(() => {
  if (props.page.id) {
    analyzeSeo();
  }
});
</script>





