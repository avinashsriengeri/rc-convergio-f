<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <!-- Timeline Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Customer Journey</h3>
        <div class="flex items-center space-x-2">
          <div class="relative">
            <button 
              @click="toggleFilters"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
              <span v-if="activeFilters.length > 0" class="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                {{ activeFilters.length }}
              </span>
            </button>
            
            <!-- Filter Dropdown -->
            <div v-if="showFilters" class="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div class="p-4 space-y-2">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Filter by event type</h4>
                <div v-for="type in eventTypes" :key="type.id" class="flex items-center">
                  <input
                    :id="`filter-${type.id}`"
                    v-model="selectedEventTypes"
                    type="checkbox"
                    :value="type.id"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label :for="`filter-${type.id}`" class="ml-3 text-sm text-gray-700 flex items-center">
                    <span class="mr-2">{{ type.icon }}</span>
                    {{ type.name }}
                  </label>
                </div>
                <div class="pt-2 border-t mt-3">
                  <button
                    @click="clearFilters"
                    class="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-2 text-sm text-gray-500">Loading journey events...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredEvents.length === 0" class="p-8 text-center">
      <div class="mx-auto h-12 w-12 text-gray-400">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No journey events found</h3>
      <p class="mt-1 text-sm text-gray-500">Start interacting with this contact to see their journey.</p>
    </div>

    <!-- Timeline -->
    <div v-else class="divide-y divide-gray-200">
      <div v-for="event in filteredEvents" :key="event.id" class="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
        <div class="flex">
          <!-- Event Icon -->
          <div class="flex-shrink-0 mr-4">
            <div class="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <span class="text-lg">{{ event.event_icon }}</span>
            </div>
          </div>
          
          <!-- Event Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-900">
                {{ event.event_label }}
              </p>
              <div class="ml-2 flex-shrink-0 flex">
                <p class="text-xs text-gray-500">
                  {{ formatDateTime(event.created_at) }}
                </p>
              </div>
            </div>
            
            <!-- Event Details -->
            <div class="mt-1 text-sm text-gray-600">
              <div v-if="event.event_type === 'contact_created'">
                Contact was created via {{ formatSource(event.event_source) }}
              </div>
              
              <div v-else-if="event.event_type === 'company_created'">
                Company "{{ event.details.company_name }}" was created and linked
              </div>
              
              <div v-else-if="event.event_type === 'deal_created'">
                New deal "{{ event.details.deal_name }}" created with amount {{ formatCurrency(event.details.amount) }}
              </div>
              
              <div v-else-if="event.event_type === 'deal_updated'">
                Deal "{{ event.details.deal_name }}" moved to {{ event.details.stage }}
                <span v-if="event.details.amount" class="text-gray-500">
                  ({{ formatCurrency(event.details.amount) }})
                </span>
              </div>
              
              <div v-else-if="event.event_type === 'activity_created'">
                {{ formatActivityType(event.details.type) }}: {{ event.details.summary || 'No summary provided' }}
              </div>
              
              <div v-else-if="event.event_type === 'email_sent'">
                Email sent: {{ event.details.subject || 'No subject' }}
              </div>
              
              <div v-else-if="event.event_type === 'email_opened'">
                Email opened: {{ event.details.subject || 'No subject' }}
              </div>
              
              <div v-else-if="event.event_type === 'email_clicked'">
                Clicked link in email: {{ event.details.subject || 'No subject' }}
                <div v-if="event.details.link" class="mt-1 text-xs text-blue-600 truncate">
                  {{ event.details.link }}
                </div>
              </div>
              
              <div v-else>
                <pre class="text-xs bg-gray-50 p-2 rounded overflow-auto">{{ JSON.stringify(event.details, null, 2) }}</pre>
              </div>
            </div>
            
            <!-- Related Model Link -->
            <div v-if="event.related_model" class="mt-2">
              <a 
                :href="getRelatedModelLink(event.related_model)" 
                class="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                target="_blank"
              >
                View {{ formatModelType(event.related_model.type) }}
                <svg class="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Load More Button -->
    <div v-if="hasMore && !loading" class="px-6 py-4 border-t border-gray-200 text-center">
      <button
        @click="loadMore"
        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        :disabled="loadingMore"
      >
        <span v-if="loadingMore" class="mr-2">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
        {{ loadingMore ? 'Loading...' : 'Load More' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '@/services/api';

interface EventType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface JourneyEvent {
  id: string | number;
  event_type: string;
  event_icon: string;
  event_label: string;
  event_source: string;
  details: Record<string, any>;
  created_at: string;
  related_model: {
    type: string;
    id: string | number;
  } | null;
}

interface Props {
  contactId: string | number;
  initialEvents?: JourneyEvent[];
  limit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  initialEvents: () => [],
  limit: 20,
});

const { t } = useI18n();

// State
const events = ref<JourneyEvent[]>([...props.initialEvents]);
const loading = ref(false);
const loadingMore = ref(false);
const page = ref(1);
const hasMore = ref(true);
const showFilters = ref(false);
type EventTypeId = 'contact_created' | 'company_created' | 'deal_created' | 'deal_updated' | 'activity_created' | 'email_sent' | 'email_opened' | 'email_clicked';

const selectedEventTypes = ref<EventTypeId[]>([]);
const eventTypes = ref<EventType[]>([
  { id: 'contact_created', name: 'Contact Created', icon: '🟢', description: 'When a contact is created' },
  { id: 'company_created', name: 'Company Created', icon: '🏢', description: 'When a company is created' },
  { id: 'deal_created', name: 'Deal Created', icon: '💼', description: 'When a deal is created' },
  { id: 'deal_updated', name: 'Deal Updated', icon: '📊', description: 'When a deal is updated' },
  { id: 'activity_created', name: 'Activity', icon: '📞', description: 'When an activity is logged' },
  { id: 'email_sent', name: 'Emails Sent', icon: '📧', description: 'When an email is sent' },
  { id: 'email_opened', name: 'Emails Opened', icon: '👁️', description: 'When an email is opened' },
  { id: 'email_clicked', name: 'Links Clicked', icon: '🔗', description: 'When a link in an email is clicked' },
]);

// Computed
const filteredEvents = computed(() => {
  if (selectedEventTypes.value.length === 0) {
    return events.value;
  }
  return events.value.filter(event => 
    selectedEventTypes.value.includes(event.event_type as EventTypeId)
  );
});

const activeFilters = computed(() => selectedEventTypes.value);

// Methods
interface TimelineResponse {
  success: boolean;
  data: JourneyEvent[];
  meta: {
    total_events: number;
    event_types: string[];
  };
}

const fetchEvents = async (reset = false) => {
  if (reset) {
    page.value = 1;
    hasMore.value = true;
    loading.value = true;
  } else {
    loadingMore.value = true;
  }

  try {
    const response = await api.get<TimelineResponse>(`/contacts/${props.contactId}/journey`, {
      params: {
        page: page.value,
        limit: props.limit
      }
    });

    if (reset) {
      events.value = response.data.data;
    } else {
      events.value = [...events.value, ...response.data.data];
    }

    // Check if there are more events to load
    hasMore.value = response.data.data.length === props.limit;
  } catch (error) {
    console.error('Error fetching journey events:', error);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMore = () => {
  if (hasMore.value && !loadingMore.value) {
    page.value += 1;
    fetchEvents(false);
  }
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const clearFilters = () => {
  selectedEventTypes.value = [];
  showFilters.value = false;
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

type EventSource = 'form_submission' | 'buyer_intent' | 'manual';

const formatSource = (source: string): string => {
  const sources: Record<EventSource, string> = {
    form_submission: 'Form Submission',
    buyer_intent: 'Buyer Intent',
    manual: 'Manual Entry'
  };
  return sources[source as EventSource] || source;
};

type ActivityType = 'call' | 'meeting' | 'note' | 'email' | 'task';

const formatActivityType = (type: string): string => {
  const types: Record<ActivityType, string> = {
    call: 'Call',
    meeting: 'Meeting',
    note: 'Note',
    email: 'Email',
    task: 'Task'
  };
  return types[type as ActivityType] || type;
};

const formatCurrency = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined) return '';
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '';
  if (amount === undefined || amount === null) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatModelType = (type: string): string => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

interface RelatedModel {
  type: string;
  id: string | number;
}

const getRelatedModelLink = (model: RelatedModel): string => {
  const base = `/${model.type.replace('_', '-')}s`;
  return `${base}/${model.id}`;
};

// Watch for contactId changes
watch(() => props.contactId, (newVal) => {
  if (newVal) {
    fetchEvents(true);
  }
});

// Initialize
onMounted(() => {
  if (props.contactId && (!props.initialEvents || props.initialEvents.length === 0)) {
    fetchEvents(true);
  }
});

// Close filters when clicking outside
const handleDocumentClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const isClickInside = target.closest?.('.relative') || target.closest?.('button');
  if (!isClickInside) {
    showFilters.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
  return () => {
    document.removeEventListener('click', handleDocumentClick);
  };
});
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
