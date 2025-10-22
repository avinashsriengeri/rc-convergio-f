<template>
  <div class="personalization-view">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Personalization & Smart Content</h2>
        <p class="text-gray-600 mt-1">Manage personalization rules across all your pages</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Rule
      </button>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Rules</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ totalRules }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Rules</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ activeRules }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Pages with Rules</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ pagesWithRules }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M11 7.343V10a1 1 0 001 1h2.657" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Avg. Performance</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ avgPerformance }}%</p>
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
            placeholder="Search rules..."
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
          <option value="enabled">Active</option>
          <option value="disabled">Inactive</option>
        </select>

        <select
          v-model="filterAttribute"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Attributes</option>
          <option value="country">Country</option>
          <option value="device">Device Type</option>
          <option value="referrer">Referrer</option>
          <option value="language">Language</option>
          <option value="lifecycle_stage">Lifecycle Stage</option>
          <option value="list_membership">List Membership</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Rules List -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Personalization Rules</h3>
        <p class="text-sm text-gray-500 mt-1">Manage rules that show different content to different visitors</p>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rule
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conditions
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="rule in filteredRules" :key="rule.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ rule.name }}</div>
                    <div class="text-sm text-gray-500">Priority: {{ rule.priority || 1 }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ rule.page?.title || 'Unknown Page' }}</div>
                <div class="text-sm text-gray-500">{{ rule.page?.slug }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(condition, index) in rule.conditions"
                    :key="index"
                    class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                  >
                    {{ condition.attribute }} {{ condition.operator }} {{ condition.value }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                    rule.is_enabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ rule.is_enabled ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ rule.conversion_rate || 0 }}% CTR</div>
                <div class="text-sm text-gray-500">{{ rule.impressions || 0 }} views</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="editRule(rule)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="toggleRule(rule)"
                    :class="[
                      'hover:opacity-75',
                      rule.is_enabled ? 'text-orange-600' : 'text-green-600'
                    ]"
                    :title="rule.is_enabled ? 'Disable' : 'Enable'"
                  >
                    <svg v-if="rule.is_enabled" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    @click="duplicateRule(rule)"
                    class="text-gray-600 hover:text-gray-900"
                    title="Duplicate"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteRule(rule.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredRules.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No personalization rules found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ allRules.length === 0 ? 'Create your first personalization rule to get started.' : 'No rules match your current filters.' }}
        </p>
      </div>
    </div>

    <!-- Popular Attributes Section -->
    <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Popular Personalization Attributes</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="attribute in popularAttributes"
          :key="attribute.name"
          class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
          @click="createRuleWithAttribute(attribute)"
        >
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium text-gray-900">{{ attribute.name }}</h4>
              <p class="text-sm text-gray-500 mt-1">{{ attribute.description }}</p>
            </div>
            <div class="text-2xl">{{ attribute.icon }}</div>
          </div>
          <div class="mt-3 text-xs text-gray-400">
            Used in {{ attribute.usage_count }} rules
          </div>
        </div>
      </div>
    </div>

    <!-- Create Rule Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Create Personalization Rule</h3>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
              <input
                v-model="newRule.name"
                type="text"
                placeholder="e.g., Mobile Users, US Visitors"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Target Page</label>
              <select
                v-model="newRule.page_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a page</option>
                <option 
                  v-for="page in availablePages" 
                  :key="page.id" 
                  :value="page.id"
                  class="py-2"
                >
                  {{ getPageIcon(page.status) }} {{ page.title }} ({{ page.slug }}) - {{ page.status }}
                </option>
              </select>
              <div class="mt-2 text-xs text-gray-500">
                <p>💡 You can create personalization rules for both draft and published pages</p>
                <p class="mt-1">
                  <strong>Available pages:</strong> {{ availablePages.length }} 
                  | <strong>Total pages loaded:</strong> {{ cmsStore.pages.length }}
                </p>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <div class="grid grid-cols-3 gap-2">
                <select
                  v-model="newRule.condition.attribute"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="country">Country</option>
                  <option value="device">Device Type</option>
                  <option value="referrer">Referrer</option>
                  <option value="language">Language</option>
                  <option value="lifecycle_stage">Lifecycle Stage</option>
                  <option value="list_membership">List Membership</option>
                </select>
                <select
                  v-model="newRule.condition.operator"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="equals">Equals</option>
                  <option value="not_equals">Not Equals</option>
                  <option value="contains">Contains</option>
                  <option value="starts_with">Starts With</option>
                </select>
                <input
                  v-model="newRule.condition.value"
                  type="text"
                  :placeholder="getConditionPlaceholder(newRule.condition.attribute)"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="mt-2 text-xs text-gray-500">
                <strong>Examples:</strong> {{ getConditionExamples(newRule.condition.attribute) }}
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Alternative Content</label>
              <textarea
                v-model="newRule.content"
                rows="4"
                placeholder="Enter the content to show when this rule matches..."
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
            @click="createRule"
            :disabled="!newRule.name || !newRule.page_id"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Create Rule
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCmsStore } from '@/stores/cms';

const router = useRouter();
const cmsStore = useCmsStore();

const loading = ref(true);
const searchQuery = ref('');
const filterStatus = ref('');
const filterAttribute = ref('');
const showCreateModal = ref(false);

const allRules = ref([]);

const newRule = ref({
  name: '',
  page_id: null,
  condition: {
    attribute: 'country',
    operator: 'equals',
    value: ''
  },
  content: '',
  is_enabled: true,
  priority: 1
});

const popularAttributes = ref([
  {
    name: 'Country',
    description: 'Target visitors by geographic location',
    icon: '🌍',
    usage_count: 12
  },
  {
    name: 'Device Type',
    description: 'Show different content for mobile vs desktop',
    icon: '📱',
    usage_count: 8
  },
  {
    name: 'Referrer',
    description: 'Personalize based on traffic source',
    icon: '🔗',
    usage_count: 6
  },
  {
    name: 'Language',
    description: 'Adapt content to visitor language',
    icon: '🗣️',
    usage_count: 5
  },
  {
    name: 'Lifecycle Stage',
    description: 'Target leads vs customers differently',
    icon: '🎯',
    usage_count: 4
  },
  {
    name: 'List Membership',
    description: 'Show content based on email list membership',
    icon: '📧',
    usage_count: 3
  }
]);

const totalRules = computed(() => allRules.value.length);
const activeRules = computed(() => allRules.value.filter(r => r.is_enabled).length);
const pagesWithRules = computed(() => {
  const uniquePages = new Set(allRules.value.map(r => r.page_id));
  return uniquePages.size;
});
const avgPerformance = computed(() => {
  if (allRules.value.length === 0) return 0;
  const sum = allRules.value.reduce((acc, r) => acc + (r.conversion_rate || 0), 0);
  return Math.round(sum / allRules.value.length);
});

const availablePages = computed(() => {
  // Show all pages (draft and published) for personalization rules
  return cmsStore.pages.filter(page => page.title && page.slug);
});

const filteredRules = computed(() => {
  let rules = allRules.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    rules = rules.filter(r => 
      r.name?.toLowerCase().includes(query) || 
      r.page?.title?.toLowerCase().includes(query)
    );
  }

  if (filterStatus.value) {
    const isEnabled = filterStatus.value === 'enabled';
    rules = rules.filter(r => r.is_enabled === isEnabled);
  }

  if (filterAttribute.value) {
    rules = rules.filter(r => 
      r.conditions?.some(c => c.attribute === filterAttribute.value)
    );
  }

  return rules;
});

const editRule = (rule) => {
  // Navigate to page editor with personalization panel open
  router.push(`/cms/editor/${rule.page_id}?openPersonalization=true`);
};

const toggleRule = async (rule) => {
  try {
    const updatedRule = { ...rule, is_enabled: !rule.is_enabled };
    await cmsStore.updatePersonalizationRule(rule.id, updatedRule);
    
    // Update local state
    const index = allRules.value.findIndex(r => r.id === rule.id);
    if (index !== -1) {
      allRules.value[index] = updatedRule;
    }
    
    const status = updatedRule.is_enabled ? 'enabled' : 'disabled';
    alert(`Rule ${status} successfully!`);
  } catch (error) {
    console.error('Failed to toggle rule:', error);
    alert('Failed to update rule status');
  }
};

const duplicateRule = async (rule) => {
  try {
    const duplicatedRule = {
      ...rule,
      name: `${rule.name} (Copy)`,
      id: undefined
    };
    
    const result = await cmsStore.createPersonalizationRule(duplicatedRule);
    allRules.value.push(result.rule || result);
    alert('Rule duplicated successfully!');
  } catch (error) {
    console.error('Failed to duplicate rule:', error);
    alert('Failed to duplicate rule');
  }
};

const deleteRule = async (id) => {
  if (confirm('Are you sure you want to delete this personalization rule?')) {
    try {
      await cmsStore.deletePersonalizationRule(id);
      allRules.value = allRules.value.filter(r => r.id !== id);
      alert('Rule deleted successfully!');
    } catch (error) {
      console.error('Failed to delete rule:', error);
      alert('Failed to delete rule');
    }
  }
};

const createRuleWithAttribute = (attribute) => {
  newRule.value.condition.attribute = attribute.name.toLowerCase().replace(' ', '_');
  showCreateModal.value = true;
};

// Helper functions for better UX
const getConditionPlaceholder = (attribute) => {
  const placeholders = {
    'country': 'US, UK, CA, etc.',
    'device': 'mobile, desktop, tablet',
    'referrer': 'google.com, facebook.com',
    'language': 'en, es, fr, etc.',
    'lifecycle_stage': 'lead, customer, subscriber',
    'list_membership': 'newsletter, vip, etc.'
  };
  return placeholders[attribute] || 'Enter value';
};

const getConditionExamples = (attribute) => {
  const examples = {
    'country': 'US, United Kingdom, Canada, Australia',
    'device': 'mobile, desktop, tablet',
    'referrer': 'google.com, facebook.com, twitter.com, direct',
    'language': 'en, es, fr, de, pt, zh',
    'lifecycle_stage': 'lead, prospect, customer, subscriber',
    'list_membership': 'newsletter, vip, premium, beta'
  };
  return examples[attribute] || 'Enter appropriate value';
};

const getPageIcon = (status) => {
  const icons = {
    'published': '🟢',
    'draft': '🟡',
    'archived': '🔴'
  };
  return icons[status] || '📄';
};

const createRule = async () => {
  try {
    // Enhanced validation
    if (!newRule.value.name || newRule.value.name.trim().length === 0) {
      alert('Rule name is required');
      return;
    }
    
    if (!newRule.value.page_id) {
      alert('Please select a target page');
      return;
    }
    
    if (!newRule.value.condition.value || newRule.value.condition.value.trim().length === 0) {
      alert('Condition value is required');
      return;
    }
    
    if (!newRule.value.content || newRule.value.content.trim().length === 0) {
      alert('Alternative content is required');
      return;
    }
    
    console.log('[Personalization] Creating rule with data:', {
      name: newRule.value.name,
      page_id: newRule.value.page_id,
      condition: newRule.value.condition,
      content: newRule.value.content
    });
    
    const ruleData = {
      name: newRule.value.name.trim(),
      page_id: parseInt(newRule.value.page_id),
      conditions: [newRule.value.condition],
      variant_content: newRule.value.content.trim(),
      is_enabled: true,
      priority: allRules.value.length + 1
    };
    
    console.log('[Personalization] Sending rule data:', ruleData);
    
    const result = await cmsStore.createPersonalizationRule(ruleData);
    console.log('[Personalization] Rule created:', result);
    
    // ✅ ENSURE: allRules is an array before pushing
    if (!Array.isArray(allRules.value)) {
      console.warn('[Personalization] allRules was not an array, resetting');
      allRules.value = [];
    }
    
    const createdRule = result.rule || result;
    console.log('[Personalization] Adding rule to array:', createdRule);
    allRules.value.push(createdRule);
    
    // Reset form
    newRule.value = {
      name: '',
      page_id: null,
      condition: {
        attribute: 'country',
        operator: 'equals',
        value: ''
      },
      content: '',
      is_enabled: true,
      priority: 1
    };
    
    showCreateModal.value = false;
    alert('Personalization rule created successfully!');
  } catch (error) {
    console.error('[Personalization] Failed to create rule:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create personalization rule';
    alert(`Error: ${errorMessage}`);
  }
};

const loadPersonalizationData = async () => {
  loading.value = true;
  try {
    // Load pages first
    await cmsStore.fetchPages();
    
    // Load all personalization rules across all pages
    const rulesPromises = cmsStore.pages.map(async (page) => {
      try {
        await cmsStore.fetchPersonalizationRules(page.id);
        return cmsStore.personalizationRules.map(rule => ({
          ...rule,
          page: page
        }));
      } catch (error) {
        console.warn(`Failed to load rules for page ${page.id}:`, error);
        return [];
      }
    });
    
    const rulesArrays = await Promise.all(rulesPromises);
    // ✅ ENSURE: Result is always an array
    const flattenedRules = rulesArrays.flat();
    allRules.value = Array.isArray(flattenedRules) ? flattenedRules : [];
    
    console.log('[Personalization] Loaded rules:', allRules.value.length, 'rules');
  } catch (error) {
    console.error('[Personalization] Failed to load data:', error);
    allRules.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadPersonalizationData();
});
</script>
