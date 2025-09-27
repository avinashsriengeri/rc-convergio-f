<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-hidden"
    @click="$emit('close')"
  >
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.buyer_intent.event_intent_modal.title') }}</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.loading') }}</p>
          </div>
          <div v-else-if="error" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.buyer_intent.event_intent_modal.error') }}</h4>
            <p class="text-gray-600">{{ error }}</p>
          </div>
          <div v-else-if="eventIntent" class="space-y-6">
            <!-- Event Details -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">{{ $t('marketing.buyer_intent.event_intent_modal.event_details') }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.timestamp') }}:</span>
                  <span class="ml-2 text-gray-900">{{ formatTimestamp(eventIntent.timestamp || eventIntent.created_at) }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.action') }}:</span>
                  <span class="ml-2 text-gray-900">{{ getActionName(eventIntent.action) }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.page') }}:</span>
                  <span class="ml-2 text-gray-900">{{ getPageTitle(eventIntent.page_url) }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.score') }}:</span>
                  <span class="ml-2 text-gray-900 font-semibold" :class="getScoreColor(eventIntent.score)">{{ eventIntent.score || 0 }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.intent_level') }}:</span>
                  <span class="ml-2">
                    <span :class="getIntentLevelColor(eventIntent.intent_level)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ eventIntent.intent_level }}
                    </span>
                  </span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.source') }}:</span>
                  <span class="ml-2 text-gray-900">{{ eventIntent.metadata?.source || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div v-if="eventIntent.contact" class="bg-white border border-gray-200 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">{{ $t('marketing.buyer_intent.event_intent_modal.contact_info') }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.name') }}:</span>
                  <span class="ml-2 text-gray-900">{{ eventIntent.contact.name || `${eventIntent.contact.first_name || ''} ${eventIntent.contact.last_name || ''}`.trim() }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.email') }}:</span>
                  <span class="ml-2 text-gray-900">{{ eventIntent.contact.email || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.phone') }}:</span>
                  <span class="ml-2 text-gray-900">{{ eventIntent.contact.phone || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.title') }}:</span>
                  <span class="ml-2 text-gray-900">{{ eventIntent.contact.title || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Company Information -->
            <div v-if="eventIntent.company" class="bg-white border border-gray-200 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">{{ $t('marketing.buyer_intent.event_intent_modal.company_info') }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.name') }}:</span>
                  <span class="ml-2 text-gray-900">{{ eventIntent.company.name || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.industry') }}:</span>
                  <span class="ml-2 text-gray-900">{{ eventIntent.company.industry || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.website') }}:</span>
                  <span class="ml-2 text-gray-900">{{ eventIntent.company.website || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.size') }}:</span>
                  <span class="ml-2 text-gray-900">{{ eventIntent.company.size || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Campaign Information -->
            <div v-if="eventIntent.metadata?.campaign_id" class="bg-white border border-gray-200 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">{{ $t('marketing.buyer_intent.event_intent_modal.campaign_info') }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.campaign_name') }}:</span>
                  <span class="ml-2 text-gray-900">{{ eventIntent.metadata.campaign_name || `Campaign #${eventIntent.metadata.campaign_id}` }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.campaign_id') }}:</span>
                  <span class="ml-2 text-gray-900">{{ eventIntent.metadata.campaign_id }}</span>
                </div>
              </div>
            </div>

            <!-- Technical Details -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">{{ $t('marketing.buyer_intent.event_intent_modal.technical_details') }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.user_agent') }}:</span>
                  <span class="ml-2 text-gray-900 text-xs break-all">{{ eventIntent.metadata?.user_agent || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.ip_address') }}:</span>
                  <span class="ml-2 text-gray-900">{{ eventIntent.metadata?.ip_address || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.referrer') }}:</span>
                  <span class="ml-2 text-gray-900 text-xs break-all">{{ eventIntent.metadata?.referrer || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">{{ $t('marketing.buyer_intent.event_intent_modal.session_id') }}:</span>
                  <span class="ml-2 text-gray-900 text-xs break-all">{{ eventIntent.metadata?.session_id || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { buyerIntentService, buyerIntentHelpers } from '@/services/buyerIntent'

const { t } = useI18n()

// Helper functions are imported from buyerIntentHelpers

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  eventId: {
    type: [String, Number],
    default: null
  },
  eventData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const loading = ref(false)
const error = ref(null)
const eventIntent = ref(null)

const { getScoreColor, getIntentLevelColor, getActionName, getPageTitle, formatTimestamp } = buyerIntentHelpers

const loadEventIntent = async () => {
  if (!props.eventId) return
  
  loading.value = true
  error.value = null
  
  try {
    // Option 1: Use passed eventData (current approach - no API call)
    if (props.eventData) {
      eventIntent.value = props.eventData
      loading.value = false
      return
    }
    
    // Option 2: Make fresh API call for each modal open
    // Uncomment the lines below if you want to make API calls:
    /*
    const response = await buyerIntentService.getEvent(props.eventId)
    eventIntent.value = response.data
    */
    
    // Fallback: create basic event data
    eventIntent.value = {
      id: props.eventId,
      action: 'Unknown',
      score: 0,
      intent_level: 'unknown',
      page_url: 'Unknown',
      timestamp: new Date().toISOString(),
      contact: null,
      company: null,
      metadata: {}
    }
  } catch (err) {
    error.value = err.message || 'Failed to load event intent data'
  } finally {
    loading.value = false
  }
}

watch(() => props.show, (newValue) => {
  if (newValue && props.eventId) {
    loadEventIntent()
  }
})

watch(() => props.eventId, (newValue) => {
  if (props.show && newValue) {
    loadEventIntent()
  }
})

watch(() => props.eventData, (newValue) => {
  console.log('🔍 EventIntentModal: eventData prop changed:', newValue)
  if (props.show && newValue) {
    console.log('🔍 EventIntentModal: Setting eventIntent from eventData:', newValue)
    eventIntent.value = newValue
    loading.value = false
  }
}, { immediate: true })

// Watch for prop changes
watch(() => props.show, (newValue) => {
  if (newValue && props.eventId) {
    loadEventIntent()
  }
})

watch(() => props.eventId, (newValue) => {
  if (props.show && newValue) {
    loadEventIntent()
  }
})
</script>
