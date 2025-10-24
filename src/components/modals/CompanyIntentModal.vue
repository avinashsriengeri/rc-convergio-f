<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-hidden"
    @click="$emit('close')"
  >
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.buyer_intent.company_intent_modal.title') }}</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">{{ $t('marketing.buyer_intent.company_intent_modal.loading') }}</p>
          </div>
          <div v-else-if="error" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.buyer_intent.company_intent_modal.error') }}</h4>
            <p class="text-gray-600">{{ error }}</p>
          </div>
          <div v-else-if="companyIntent" class="space-y-6">
            <!-- Company Info -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">{{ $t('marketing.buyer_intent.company_intent_modal.company_info') }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.company_intent_modal.name') }}:</span>
                  <span class="ml-2 text-gray-900">{{ companyIntent.company?.name || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.company_intent_modal.industry') }}:</span>
                  <span class="ml-2 text-gray-900">{{ companyIntent.company?.industry || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.company_intent_modal.website') }}:</span>
                  <span class="ml-2 text-gray-900">{{ companyIntent.company?.website || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.company_intent_modal.total_score') }}:</span>
                  <span class="ml-2 text-gray-900 font-semibold" :class="getScoreColor(companyIntent.total_score)">{{ companyIntent.total_score || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Intent Summary -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">{{ $t('marketing.buyer_intent.company_intent_modal.intent_summary') }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900">{{ companyIntent.summary?.total_events || 0 }}</div>
                  <div class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.total_events') }}</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-red-600">{{ companyIntent.intent_breakdown?.high || 0 }}</div>
                  <div class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.high_intent') }}</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-yellow-600">{{ companyIntent.intent_breakdown?.medium || 0 }}</div>
                  <div class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.medium_intent') }}</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ companyIntent.intent_breakdown?.low || 0 }}</div>
                  <div class="text-sm text-gray-600">{{ $t('marketing.buyer_intent.analytics.overview.low_intent') }}</div>
                </div>
              </div>
            </div>

            <!-- Top Contacts -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">{{ $t('marketing.buyer_intent.company_intent_modal.top_contacts') }}</h4>
              <div v-if="companyIntent.top_contacts?.length" class="space-y-3">
                <div v-for="contact in companyIntent.top_contacts" :key="contact.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">{{ contact.name || `${contact.first_name || ''} ${contact.last_name || ''}`.trim() }}</div>
                    <div class="text-xs text-gray-500">{{ contact.email }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium" :class="getScoreColor(contact.total_score)">{{ contact.total_score }}</div>
                    <div class="text-xs text-gray-500">{{ contact.event_count }} events</div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-gray-500">
                {{ $t('marketing.buyer_intent.company_intent_modal.no_contacts') }}
              </div>
            </div>

            <!-- Recent Events -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">{{ $t('marketing.buyer_intent.company_intent_modal.recent_events') }}</h4>
              <div v-if="companyIntent.recent_events?.length" class="space-y-3">
                <div v-for="event in companyIntent.recent_events" :key="event.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3">
                      <span class="text-sm font-medium text-gray-900">{{ event.contact?.name || `${event.contact?.first_name || ''} ${event.contact?.last_name || ''}`.trim() }}</span>
                      <span class="text-sm text-gray-600">{{ getActionName(event.action) }}</span>
                      <span class="text-sm text-gray-600">{{ getPageTitle(event.page_url) }}</span>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">{{ formatTimestamp(event.timestamp || event.created_at) }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium" :class="getScoreColor(event.score)">{{ event.score }}</div>
                    <div class="text-xs text-gray-500">{{ event.intent_level }}</div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-gray-500">
                {{ $t('marketing.buyer_intent.company_intent_modal.no_events') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { buyerIntentService, buyerIntentHelpers } from '@/services/buyerIntent'

const { t } = useI18n()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  companyId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['close'])

const loading = ref(false)
const error = ref(null)
const companyIntent = ref(null)

const { getScoreColor, getActionName, getPageTitle, formatTimestamp } = buyerIntentHelpers

const loadCompanyIntent = async () => {
  if (!props.companyId) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await buyerIntentService.getCompanyIntent(props.companyId)
    companyIntent.value = response.data
  } catch (err) {
    error.value = err.message || 'Failed to load company intent data'
    console.error('Error loading company intent:', err)
  } finally {
    loading.value = false
  }
}

watch(() => props.show, (newValue) => {
  if (newValue && props.companyId) {
    loadCompanyIntent()
  }
})

watch(() => props.companyId, (newValue) => {
  if (props.show && newValue) {
    loadCompanyIntent()
  }
})
</script>









