<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumbs -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex py-4" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <div class="flex items-center">
                <router-link to="/marketing" class="text-gray-400 hover:text-gray-500">
                  <svg class="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span class="sr-only">Home</span>
                </router-link>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-500">{{ $t('common.marketing') }}</span>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-900">{{ $t('marketing.lead_scoring.title') }}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('marketing.lead_scoring.title') }}</h1>
          <p class="mt-2 text-lg text-gray-600">{{ $t('marketing.lead_scoring.subtitle') }}</p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="openRecalculateModal"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.lead_scoring.recalculate.title') }}
          </button>
          <button
            @click="openCreateRuleModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.lead_scoring.rules.create_rule') }}
          </button>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Rules Table -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <!-- Table Header -->
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.lead_scoring.rules.title') }}</h3>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="p-12 text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p class="mt-4 text-gray-600">{{ $t('marketing.lead_scoring.loading') }}</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="p-12 text-center">
              <div class="text-red-600 mb-4">
                <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.lead_scoring.error') }}</h3>
              <button
                @click="loadRules"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {{ $t('common.marketing_overview.retry_button') }}
              </button>
            </div>

            <!-- Empty State -->
            <div v-else-if="rules.length === 0" class="p-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.lead_scoring.empty_state.title') }}</h3>
              <p class="text-gray-600 mb-6">{{ $t('marketing.lead_scoring.empty_state.message') }}</p>
              <button
                @click="openCreateRuleModal"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                {{ $t('marketing.lead_scoring.empty_state.create_rule') }}
              </button>
            </div>

            <!-- Rules Table -->
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('marketing.lead_scoring.rules.name') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('marketing.lead_scoring.rules.points') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('marketing.lead_scoring.rules.priority') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('marketing.lead_scoring.rules.active') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('marketing.lead_scoring.rules.updated_at') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('marketing.lead_scoring.rules.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="rule in rules"
                    :key="rule.id"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ rule.name }}</div>
                      <div class="text-sm text-gray-500">{{ rule.description }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span class="font-semibold">{{ rule.points }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getPriorityColor(rule.priority)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{ $t(`marketing.lead_scoring.priorities.${rule.priority}`) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusColor(rule.is_active)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{ $t('marketing.lead_scoring.rules.active') }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDate(rule.updated_at) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex space-x-2">
                        <button
                          @click="editRule(rule)"
                          class="text-blue-600 hover:text-blue-900"
                        >
                          {{ $t('marketing.lead_scoring.rules.edit_rule') }}
                        </button>
                        <button
                          @click="deleteRule(rule)"
                          class="text-red-600 hover:text-red-900"
                        >
                          {{ $t('marketing.lead_scoring.rules.delete_rule') }}
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Column - Stats and Top Contacts -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Scoring Stats -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.lead_scoring.stats.title') }}</h3>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">{{ $t('marketing.lead_scoring.stats.total_contacts') }}</span>
                <span class="text-sm font-medium">{{ formatNumber(stats?.total_contacts_scored || 0) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">{{ $t('marketing.lead_scoring.stats.average_score') }}</span>
                <span class="text-sm font-medium">{{ Math.round(stats?.average_score || 0) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">{{ $t('marketing.lead_scoring.stats.high_score') }}</span>
                <span class="text-sm font-medium text-red-600">{{ stats?.high_score_contacts || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">{{ $t('marketing.lead_scoring.stats.medium_score') }}</span>
                <span class="text-sm font-medium text-yellow-600">{{ stats?.medium_score_contacts || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">{{ $t('marketing.lead_scoring.stats.low_score') }}</span>
                <span class="text-sm font-medium text-blue-600">{{ stats?.low_score_contacts || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">{{ $t('marketing.lead_scoring.stats.active_rules') }}</span>
                <span class="text-sm font-medium">{{ stats?.active_rules || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Top Contacts -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.lead_scoring.top_contacts.title') }}</h3>
            </div>
            <div class="p-6">
              <div class="space-y-3">
                <div
                  v-for="contact in topContacts.slice(0, 5)"
                  :key="contact.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900 truncate">{{ contact.name }}</div>
                    <div class="text-sm text-gray-500 truncate">{{ contact.company }}</div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span :class="getScoreColor(contact.score)" class="text-sm font-medium">
                      {{ contact.score }}
                    </span>
                    <span :class="getScoreChangeColor(contact.score_change)" class="text-xs">
                      {{ contact.score_change }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Rule Modal -->
    <div
      v-if="showRuleModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeRuleModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ editingRule ? $t('marketing.lead_scoring.rule_modal.edit_title') : $t('marketing.lead_scoring.rule_modal.create_title') }}
            </h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="saveRule">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.lead_scoring.rule_modal.name') }}</label>
                  <input
                    v-model="ruleForm.name"
                    type="text"
                    required
                    :placeholder="$t('marketing.lead_scoring.rule_modal.enter_name')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.lead_scoring.rule_modal.description') }}</label>
                  <textarea
                    v-model="ruleForm.description"
                    :placeholder="$t('marketing.lead_scoring.rule_modal.enter_description')"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.lead_scoring.rule_modal.points') }}</label>
                    <input
                      v-model="ruleForm.points"
                      type="number"
                      min="0"
                      max="100"
                      required
                      :placeholder="$t('marketing.lead_scoring.rule_modal.enter_points')"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.lead_scoring.rule_modal.priority') }}</label>
                    <select
                      v-model="ruleForm.priority"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{{ $t('marketing.lead_scoring.rule_modal.select_priority') }}</option>
                      <option value="1">{{ $t('marketing.lead_scoring.priorities.1') }}</option>
                      <option value="2">{{ $t('marketing.lead_scoring.priorities.2') }}</option>
                      <option value="3">{{ $t('marketing.lead_scoring.priorities.3') }}</option>
                      <option value="4">{{ $t('marketing.lead_scoring.priorities.4') }}</option>
                      <option value="5">{{ $t('marketing.lead_scoring.priorities.5') }}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="flex items-center">
                    <input
                      v-model="ruleForm.is_active"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">{{ $t('marketing.lead_scoring.rule_modal.is_active') }}</span>
                  </label>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.lead_scoring.rule_modal.condition') }}</label>
                  <textarea
                    v-model="ruleForm.condition"
                    :placeholder="$t('marketing.lead_scoring.rule_modal.enter_condition')"
                    rows="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  ></textarea>
                  <p class="mt-1 text-xs text-gray-500">Enter valid JSON condition</p>
                </div>
              </div>
              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  @click="closeRuleModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {{ $t('marketing.lead_scoring.rule_modal.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="savingRule"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
                >
                  {{ savingRule 
                    ? (editingRule ? $t('marketing.lead_scoring.rule_modal.updating') : $t('marketing.lead_scoring.rule_modal.creating'))
                    : (editingRule ? $t('marketing.lead_scoring.rule_modal.update') : $t('marketing.lead_scoring.rule_modal.create'))
                  }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Recalculate Score Modal -->
    <div
      v-if="showRecalculateModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeRecalculateModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.lead_scoring.recalculate.title') }}</h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="recalculateScore">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.lead_scoring.recalculate.contact_id') }}</label>
                  <input
                    v-model="recalculateForm.contact_id"
                    type="text"
                    required
                    :placeholder="$t('marketing.lead_scoring.recalculate.enter_contact_id')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  @click="closeRecalculateModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {{ $t('marketing.lead_scoring.rule_modal.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="recalculating"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
                >
                  {{ recalculating ? $t('marketing.lead_scoring.recalculate.recalculating') : $t('marketing.lead_scoring.recalculate.recalculate') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeConfirmModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.lead_scoring.confirmations.delete_title') }}</h3>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-6">{{ $t('marketing.lead_scoring.confirmations.delete_message') }}</p>
            <div class="flex justify-end space-x-3">
              <button
                @click="closeConfirmModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {{ $t('marketing.lead_scoring.confirmations.cancel') }}
              </button>
              <button
                @click="confirmDelete"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                {{ $t('marketing.lead_scoring.confirmations.confirm') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { leadScoringService, leadScoringHelpers } from '@/services/leadScoring'
import { error as showError, success as showSuccess } from '@/utils/notifications'

const { t } = useI18n()

// Reactive state
const loading = ref(false)
const error = ref(null)
const rules = ref([])
const stats = ref(null)
const topContacts = ref([])

// Modal states
const showRuleModal = ref(false)
const showRecalculateModal = ref(false)
const showConfirmModal = ref(false)
const savingRule = ref(false)
const recalculating = ref(false)
const editingRule = ref(null)
const ruleToDelete = ref(null)

// Forms
const ruleForm = ref({
  name: '',
  description: '',
  points: '',
  priority: '',
  is_active: true,
  condition: ''
})

const recalculateForm = ref({
  contact_id: ''
})

// Methods
const loadRules = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await leadScoringService.getScoringRules({ is_active: null })
    rules.value = response.data || []
  } catch (err) {
    error.value = err.message || 'Failed to load scoring rules'
    showError(error.value)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await leadScoringService.getScoringStats()
    stats.value = response.data
  } catch (err) {
    console.error('Failed to load stats:', err)
  }
}

const loadTopContacts = async () => {
  try {
    const response = await leadScoringService.getTopContacts(10)
    topContacts.value = response.data || []
  } catch (err) {
    console.error('Failed to load top contacts:', err)
  }
}

const openCreateRuleModal = () => {
  editingRule.value = null
  ruleForm.value = {
    name: '',
    description: '',
    points: '',
    priority: '',
    is_active: true,
    condition: '{\n  "event_type": "email_open",\n  "operator": "greater_than",\n  "value": 1,\n  "time_window": "30_days"\n}'
  }
  showRuleModal.value = true
}

const editRule = (rule) => {
  editingRule.value = rule
  ruleForm.value = {
    name: rule.name,
    description: rule.description || '',
    points: rule.points.toString(),
    priority: rule.priority.toString(),
    is_active: rule.is_active,
    condition: typeof rule.condition === 'string' ? rule.condition : JSON.stringify(rule.condition, null, 2)
  }
  showRuleModal.value = true
}

const closeRuleModal = () => {
  showRuleModal.value = false
  editingRule.value = null
  savingRule.value = false
}

const saveRule = async () => {
  savingRule.value = true
  
  try {
    // Validate JSON condition
    let condition
    try {
      condition = JSON.parse(ruleForm.value.condition)
    } catch (error) {
      showError('Invalid JSON condition format')
      return
    }

    const data = {
      name: ruleForm.value.name,
      description: ruleForm.value.description,
      points: parseInt(ruleForm.value.points),
      priority: parseInt(ruleForm.value.priority),
      is_active: ruleForm.value.is_active,
      condition: condition
    }

    if (editingRule.value) {
      await leadScoringService.updateScoringRule(editingRule.value.id, data)
      showSuccess('Scoring rule updated successfully')
    } else {
      await leadScoringService.createScoringRule(data)
      showSuccess('Scoring rule created successfully')
    }

    closeRuleModal()
    loadRules()
    loadStats()
  } catch (err) {
    showError(err.message || 'Failed to save scoring rule')
  } finally {
    savingRule.value = false
  }
}

const deleteRule = (rule) => {
  ruleToDelete.value = rule
  showConfirmModal.value = true
}

const confirmDelete = async () => {
  if (!ruleToDelete.value) return
  
  try {
    await leadScoringService.deleteScoringRule(ruleToDelete.value.id)
    showSuccess('Scoring rule deleted successfully')
    closeConfirmModal()
    loadRules()
    loadStats()
  } catch (err) {
    showError(err.message || 'Failed to delete scoring rule')
  }
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  ruleToDelete.value = null
}

const openRecalculateModal = () => {
  recalculateForm.value = { contact_id: '' }
  showRecalculateModal.value = true
}

const closeRecalculateModal = () => {
  showRecalculateModal.value = false
  recalculating.value = false
}

const recalculateScore = async () => {
  recalculating.value = true
  
  try {
    const result = await leadScoringService.recalculateScore(recalculateForm.value.contact_id)
    showSuccess(`${t('marketing.lead_scoring.recalculate.success')}: ${JSON.stringify(result)}`)
    closeRecalculateModal()
    loadTopContacts()
  } catch (err) {
    showError(err.message || 'Failed to recalculate score')
  } finally {
    recalculating.value = false
  }
}

// Helper methods
const getPriorityColor = (priority) => leadScoringHelpers.getPriorityColor(priority)
const getStatusColor = (isActive) => leadScoringHelpers.getStatusColor(isActive)
const getScoreColor = (score) => leadScoringHelpers.getScoreColor(score)
const getScoreChangeColor = (change) => leadScoringHelpers.getScoreChangeColor(change)
const formatDate = (dateString) => leadScoringHelpers.formatDate(dateString)
const formatNumber = (num) => leadScoringHelpers.formatNumber(num)

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadRules(),
    loadStats(),
    loadTopContacts()
  ])
})
</script>
