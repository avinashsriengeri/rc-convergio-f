<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Domain Management</h2>
          <p class="text-sm text-gray-500 mt-1">Connect and manage your domains</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        <!-- Add Domain -->
        <div class="mb-6">
          <div class="flex space-x-2">
            <input
              v-model="newDomain"
              type="text"
              placeholder="yourdomain.com"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              @keyup.enter="addDomain"
            />
            <button
              @click="addDomain"
              :disabled="!newDomain"
              class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Domain
            </button>
          </div>
        </div>

        <!-- Domains List -->
        <div class="space-y-3">
          <div
            v-for="domain in domains"
            :key="domain.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3 flex-1">
                <div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-900">{{ domain.domain }}</h3>
                    <span
                      v-if="domain.is_primary"
                      class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      Primary
                    </span>
                  </div>
                  <div class="flex items-center space-x-4 mt-1">
                    <span
                      :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        domain.status === 'active' ? 'bg-green-100 text-green-800' :
                        domain.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ domain.status }}
                    </span>
                    <span
                      :class="[
                        'text-xs flex items-center',
                        domain.ssl_enabled ? 'text-green-600' : 'text-gray-500'
                      ]"
                    >
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      {{ domain.ssl_enabled ? 'SSL Enabled' : 'No SSL' }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  v-if="!domain.is_primary"
                  @click="setPrimary(domain)"
                  class="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                >
                  Set Primary
                </button>
                <button
                  @click="toggleSSL(domain)"
                  class="p-2 text-gray-600 hover:text-gray-900"
                  title="Toggle SSL"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </button>
                <button
                  @click="deleteDomain(domain)"
                  class="p-2 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- DNS Configuration Help -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex">
            <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div class="text-sm text-blue-800">
              <p class="font-medium mb-1">DNS Configuration Required</p>
              <p class="text-xs mb-2">Point your domain's DNS records to our servers:</p>
              <ul class="list-disc list-inside space-y-1 text-xs font-mono">
                <li>A Record: 192.168.1.1</li>
                <li>CNAME: www → cms.convergio.world</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCmsStore } from '@/stores/cms';

const emit = defineEmits(['close']);
const cmsStore = useCmsStore();

const newDomain = ref('');
const domains = ref([]);

const addDomain = async () => {
  if (!newDomain.value) return;
  
  try {
    await cmsStore.createDomain({
      domain: newDomain.value,
      is_primary: domains.value.length === 0,
      ssl_enabled: false,
      status: 'pending'
    });
    await loadDomains();
    newDomain.value = '';
  } catch (error) {
    alert('Failed to add domain');
  }
};

const setPrimary = async (domain) => {
  try {
    domains.value.forEach(d => d.is_primary = false);
    domain.is_primary = true;
    await cmsStore.updateDomain(domain.id, { is_primary: true });
  } catch (error) {
    alert('Failed to set primary domain');
  }
};

const toggleSSL = async (domain) => {
  try {
    domain.ssl_enabled = !domain.ssl_enabled;
    await cmsStore.updateDomain(domain.id, { ssl_enabled: domain.ssl_enabled });
  } catch (error) {
    alert('Failed to toggle SSL');
  }
};

const deleteDomain = async (domain) => {
  if (domain.is_primary) {
    alert('Cannot delete primary domain');
    return;
  }
  
  if (confirm(`Delete domain ${domain.domain}?`)) {
    try {
      await cmsStore.deleteDomain(domain.id);
      await loadDomains();
    } catch (error) {
      alert('Failed to delete domain');
    }
  }
};

const loadDomains = async () => {
  try {
    await cmsStore.fetchDomains();
    domains.value = cmsStore.domains;
  } catch (error) {
    // Mock data
    domains.value = [
      { id: 1, domain: 'example.com', is_primary: true, ssl_enabled: true, status: 'active' }
    ];
  }
};

onMounted(() => {
  loadDomains();
});
</script>





