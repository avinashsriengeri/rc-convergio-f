<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Smart Content & Personalization</h2>
          <p class="text-sm text-gray-500 mt-1">Show different content based on visitor attributes</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        <!-- Rules List -->
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Personalization Rules</h3>
          <button
            @click="addRule"
            class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            + Add Rule
          </button>
        </div>

        <!-- Rules -->
        <div v-if="rules.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">No personalization rules yet</p>
          <p class="text-xs text-gray-400">Create rules to show different content to different visitors</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(rule, index) in rules"
            :key="index"
            class="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <input
                  v-model="rule.name"
                  type="text"
                  placeholder="Rule name"
                  class="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                />
              </div>
              <div class="flex space-x-2">
                <button
                  @click="toggleRule(index)"
                  :class="[
                    'px-3 py-1 text-xs font-medium rounded-full',
                    rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                  ]"
                >
                  {{ rule.enabled ? 'Enabled' : 'Disabled' }}
                </button>
                <button
                  @click="deleteRule(index)"
                  class="p-1 text-red-600 hover:text-red-800"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Conditions -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Conditions</label>
              <div class="space-y-2">
                <div
                  v-for="(condition, cIndex) in rule.conditions"
                  :key="cIndex"
                  class="flex items-center space-x-2"
                >
                  <select
                    v-model="condition.attribute"
                    class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="country">Country</option>
                    <option value="device">Device Type</option>
                    <option value="referrer">Referrer</option>
                    <option value="language">Language</option>
                    <option value="lifecycle_stage">Lifecycle Stage</option>
                    <option value="list_membership">List Membership</option>
                  </select>
                  <select
                    v-model="condition.operator"
                    class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="equals">Equals</option>
                    <option value="not_equals">Not Equals</option>
                    <option value="contains">Contains</option>
                    <option value="starts_with">Starts With</option>
                  </select>
                  <input
                    v-model="condition.value"
                    type="text"
                    placeholder="Value"
                    class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    @click="removeCondition(index, cIndex)"
                    class="p-2 text-red-600 hover:text-red-800"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                @click="addCondition(index)"
                class="mt-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Condition
              </button>
            </div>

            <!-- Content Variant -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Show This Content</label>
              <textarea
                v-model="rule.content"
                rows="4"
                placeholder="Enter personalized content..."
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              ></textarea>
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
              <p class="font-medium mb-1">How Personalization Works</p>
              <ul class="list-disc list-inside space-y-1 text-xs">
                <li>Rules are evaluated in order from top to bottom</li>
                <li>First matching rule wins</li>
                <li>Visitors see default content if no rules match</li>
                <li>Preview different variants before publishing</li>
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
          Cancel
        </button>
        <button
          @click="saveRules"
          :disabled="saving"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ saving ? 'Saving...' : 'Save Rules' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCmsStore } from '@/stores/cms';

const props = defineProps({
  pageId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['close']);
const cmsStore = useCmsStore();

const rules = ref([]);
const saving = ref(false);

const addRule = () => {
  rules.value.push({
    name: 'New Rule',
    enabled: true,
    conditions: [
      {
        attribute: 'country',
        operator: 'equals',
        value: ''
      }
    ],
    content: ''
  });
};

const deleteRule = (index) => {
  if (confirm('Delete this rule?')) {
    rules.value.splice(index, 1);
  }
};

const toggleRule = (index) => {
  rules.value[index].enabled = !rules.value[index].enabled;
};

const addCondition = (ruleIndex) => {
  rules.value[ruleIndex].conditions.push({
    attribute: 'country',
    operator: 'equals',
    value: ''
  });
};

const removeCondition = (ruleIndex, conditionIndex) => {
  rules.value[ruleIndex].conditions.splice(conditionIndex, 1);
};

const saveRules = async () => {
  saving.value = true;
  try {
    for (const rule of rules.value) {
      if (rule.id) {
        await cmsStore.updatePersonalizationRule(rule.id, rule);
      } else {
        await cmsStore.createPersonalizationRule({
          ...rule,
          page_id: props.pageId
        });
      }
    }
    alert('Personalization rules saved successfully!');
    emit('close');
  } catch (error) {
    alert('Failed to save personalization rules');
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  if (props.pageId) {
    try {
      await cmsStore.fetchPersonalizationRules(props.pageId);
      rules.value = cmsStore.personalizationRules || [];
    } catch (error) {
      // Initialize with empty rules
      rules.value = [];
    }
  }
});
</script>





