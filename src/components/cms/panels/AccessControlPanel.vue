<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Access Control</h2>
          <p class="text-sm text-gray-500 mt-1">Control who can view this page</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        <!-- Access Level Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">Access Level</label>
          <div class="space-y-3">
            <!-- Public -->
            <label
              class="relative flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              :class="accessData.access_level === 'public' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
            >
              <input
                v-model="accessData.access_level"
                type="radio"
                value="public"
                class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div class="ml-3 flex-1">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm font-medium text-gray-900">Public</span>
                </div>
                <p class="text-sm text-gray-500 mt-1">Anyone can view this page</p>
              </div>
            </label>

            <!-- Members Only -->
            <label
              class="relative flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              :class="accessData.access_level === 'members' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
            >
              <input
                v-model="accessData.access_level"
                type="radio"
                value="members"
                class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div class="ml-3 flex-1">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm font-medium text-gray-900">Members Only</span>
                </div>
                <p class="text-sm text-gray-500 mt-1">Only registered members can view this page</p>
              </div>
            </label>

            <!-- Role-based -->
            <label
              class="relative flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              :class="accessData.access_level === 'role-based' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
            >
              <input
                v-model="accessData.access_level"
                type="radio"
                value="role-based"
                class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div class="ml-3 flex-1">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span class="text-sm font-medium text-gray-900">Role-based</span>
                </div>
                <p class="text-sm text-gray-500 mt-1">Specific roles or memberships required</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Role Selection (shown when role-based is selected) -->
        <div v-if="accessData.access_level === 'role-based'" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Required Memberships</label>
          <div class="space-y-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-3">
            <label
              v-for="membership in memberships"
              :key="membership.id"
              class="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                v-model="accessData.allowed_memberships"
                type="checkbox"
                :value="membership.id"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900">{{ membership.name }}</div>
                <div class="text-xs text-gray-500">{{ membership.description }}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Redirect Settings -->
        <div v-if="accessData.access_level !== 'public'" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Unauthorized Access Behavior
          </label>
          <select
            v-model="accessData.unauthorized_redirect"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="login">Redirect to Login</option>
            <option value="signup">Redirect to Signup</option>
            <option value="custom">Custom URL</option>
            <option value="404">Show 404 Page</option>
          </select>

          <input
            v-if="accessData.unauthorized_redirect === 'custom'"
            v-model="accessData.custom_redirect_url"
            type="text"
            placeholder="https://..."
            class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Preview Message -->
        <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Preview Message</h4>
          <p class="text-sm text-gray-600">
            <template v-if="accessData.access_level === 'public'">
              ✅ This page will be accessible to everyone.
            </template>
            <template v-else-if="accessData.access_level === 'members'">
              🔒 This page will only be accessible to logged-in members.
            </template>
            <template v-else-if="accessData.access_level === 'role-based'">
              🔐 This page will only be accessible to members with specific roles.
            </template>
          </p>
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
          @click="saveAccess"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Save Access Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useCmsStore } from '@/stores/cms';

const props = defineProps({
  page: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save']);
const cmsStore = useCmsStore();

const accessData = reactive({
  access_level: props.page.access_level || 'public',
  allowed_memberships: props.page.allowed_memberships || [],
  unauthorized_redirect: props.page.unauthorized_redirect || 'login',
  custom_redirect_url: props.page.custom_redirect_url || ''
});

const memberships = reactive([]);

const saveAccess = () => {
  emit('save', accessData);
};

onMounted(async () => {
  try {
    await cmsStore.fetchMemberships();
    Object.assign(memberships, cmsStore.memberships || [
      { id: 1, name: 'Premium', description: 'Premium membership' },
      { id: 2, name: 'Basic', description: 'Basic membership' },
      { id: 3, name: 'Enterprise', description: 'Enterprise membership' }
    ]);
  } catch (error) {
    // Use mock data
    Object.assign(memberships, [
      { id: 1, name: 'Premium', description: 'Premium membership' },
      { id: 2, name: 'Basic', description: 'Basic membership' },
      { id: 3, name: 'Enterprise', description: 'Enterprise membership' }
    ]);
  }
});
</script>





