<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-semibold text-gray-900">Journeys</h1>
          <button
            @click="openCreateModal"
            class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Journey
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Active Journeys -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-gray-500 truncate">Active Journeys</p>
                <p class="text-2xl font-semibold text-gray-900">{{ activeJourneysCount }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Contacts -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-gray-500 truncate">Total Contacts</p>
                <p class="text-2xl font-semibold text-gray-900">{{ totalContactsInJourneys }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Completion Rate -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-gray-500 truncate">Avg. Completion</p>
                <p class="text-2xl font-semibold text-gray-900">{{ averageCompletionRate }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Journeys Table -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Your Journeys</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">A list of all your customer journeys</p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacts</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="journey in journeys" :key="journey.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ journey.name }}</div>
                  <div class="text-sm text-gray-500">{{ journey.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(journey.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ formatStatus(journey.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ journey.contacts_count || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: journey.completion_rate + '%' }"></div>
                  </div>
                  <span class="text-xs text-gray-500 mt-1">{{ journey.completion_rate || 0 }}%</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="openBuilder(journey)" class="text-blue-600 hover:text-blue-900 mr-4">Design</button>
                  <button @click="viewJourney(journey)" class="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                  <button @click="confirmDelete(journey)" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
              <tr v-if="journeys.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                  No journeys found. Create your first journey to get started.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Journey Builder Drawer -->
    <div
      v-if="showBuilderDrawer"
      class="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeBuilder" aria-hidden="true"></div>
        <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div class="w-screen max-w-4xl">
            <div class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div class="flex-1 py-6 overflow-y-auto">
                <div class="px-4 sm:px-6">
                  <div class="flex items-start justify-between">
                    <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">
                      {{ builderJourneyId ? 'Edit Journey' : 'Create New Journey' }}
                    </h2>
                    <div class="ml-3 h-7 flex items-center">
                      <button
                        type="button"
                        class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        @click="closeBuilder"
                      >
                        <span class="sr-only">Close panel</span>
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="mt-6">
                  <JourneyBuilder 
                    v-if="showBuilderDrawer" 
                    :journey-id="builderJourneyId"
                    @saved="handleJourneySaved"
                    @cancel="closeBuilder"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeDeleteModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Delete Journey</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to delete "{{ journeyToDelete?.name }}"? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="deleteJourney"
            >
              Delete
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              @click="closeDeleteModal"
            >
              Cancel
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
import { useI18n } from 'vue-i18n';
import JourneyBuilder from './JourneyBuilder.vue';

const { t } = useI18n();
const router = useRouter();

// State
const journeys = ref([
  {
    id: 1,
    name: 'Welcome Series',
    description: 'Onboarding journey for new users',
    status: 'active',
    contacts_count: 1245,
    completion_rate: 78,
    created_at: '2023-05-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Abandoned Cart',
    description: 'Recover abandoned carts',
    status: 'paused',
    contacts_count: 342,
    completion_rate: 45,
    created_at: '2023-06-22T14:15:00Z'
  },
  {
    id: 3,
    name: 'Re-engagement',
    description: 'Win back inactive users',
    status: 'draft',
    contacts_count: 0,
    completion_rate: 0,
    created_at: '2023-07-10T09:45:00Z'
  }
]);

const showBuilderDrawer = ref(false);
const builderJourneyId = ref(null);
const showDeleteModal = ref(false);
const journeyToDelete = ref(null);

// Computed
const activeJourneysCount = computed(() => {
  return journeys.value.filter(j => j.status === 'active').length;
});

const totalContactsInJourneys = computed(() => {
  return journeys.value.reduce((total, journey) => total + journey.contacts_count, 0);
});

const averageCompletionRate = computed(() => {
  if (journeys.value.length === 0) return 0;
  const total = journeys.value.reduce((sum, journey) => sum + journey.completion_rate, 0);
  return Math.round(total / journeys.value.length);
});

// Methods
function getStatusBadgeClass(status) {
  const classes = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-gray-100 text-gray-800',
    archived: 'bg-gray-200 text-gray-600'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
}

function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function openBuilder(journey = null) {
  builderJourneyId.value = journey ? journey.id : null;
  showBuilderDrawer.value = true;
}

function closeBuilder() {
  showBuilderDrawer.value = false;
  builderJourneyId.value = null;
}

function handleJourneySaved(journey) {
  // Update or add the journey to the list
  const index = journeys.value.findIndex(j => j.id === journey.id);
  if (index >= 0) {
    journeys.value[index] = { ...journeys.value[index], ...journey };
  } else {
    journeys.value.unshift({
      ...journey,
      contacts_count: 0,
      completion_rate: 0,
      created_at: new Date().toISOString()
    });
  }
  closeBuilder();
}

function viewJourney(journey) {
  router.push(`/marketing/journeys/${journey.id}`);
}

function confirmDelete(journey) {
  journeyToDelete.value = journey;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  journeyToDelete.value = null;
}

async function deleteJourney() {
  if (!journeyToDelete.value) return;
  
  // In a real app, you would call an API here
  console.log('Deleting journey:', journeyToDelete.value.id);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Remove from the list
  journeys.value = journeys.value.filter(j => j.id !== journeyToDelete.value.id);
  
  closeDeleteModal();
}

function openCreateModal() {
  openBuilder();
}

// Lifecycle
onMounted(() => {
  // In a real app, you would fetch journeys from an API here
  console.log('Journeys component mounted');
});
</script>
