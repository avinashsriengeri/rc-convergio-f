<template>
  <div class="pages-view">
    <!-- Header with Actions -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Pages</h2>
        <p class="text-gray-600 mt-1">Manage your website pages and landing pages</p>
      </div>
      <button
        @click="createNewPage"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Page
      </button>
    </div>


    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search pages..."
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
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select
          v-model="filterLanguage"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Languages</option>
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>

        <select
          v-model="filterAccess"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Access Levels</option>
          <option value="public">Public</option>
          <option value="members">Members Only</option>
          <option value="role-based">Role-based</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="cmsStore.loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Pages List -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Language
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Access
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="page in filteredPages" :key="page.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ page.title }}</div>
                    <div class="text-sm text-gray-500">{{ page.slug }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                    page.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  ]"
                >
                  {{ page.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ page.language?.toUpperCase() || 'EN' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {{ page.access_level }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(page.updated_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="editPage(page.id)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="duplicatePage(page)"
                    class="text-gray-600 hover:text-gray-900"
                    title="Duplicate"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    v-if="page.status === 'draft'"
                    @click="publishPage(page.id)"
                    class="text-green-600 hover:text-green-900"
                    title="Publish"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    v-else
                    @click="unpublishPage(page.id)"
                    class="text-orange-600 hover:text-orange-900"
                    title="Unpublish"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </button>
                  <button
                    @click="deletePage(page.id)"
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
      <div v-if="!cmsStore.loading && filteredPages.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No pages found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ cmsStore.pages.length === 0 ? 'Get started by creating a new page.' : 'No pages match your current filters.' }}
        </p>
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

const searchQuery = ref('');
const filterStatus = ref('');
const filterLanguage = ref('');
const filterAccess = ref('');

const languages = computed(() => cmsStore.languages);

const filteredPages = computed(() => {
  let pages = cmsStore.pages;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    pages = pages.filter(p => 
      p.title?.toLowerCase().includes(query) || 
      p.slug?.toLowerCase().includes(query)
    );
  }

  if (filterStatus.value) {
    pages = pages.filter(p => p.status === filterStatus.value);
  }

  if (filterLanguage.value) {
    pages = pages.filter(p => p.language === filterLanguage.value);
  }

  if (filterAccess.value) {
    pages = pages.filter(p => p.access_level === filterAccess.value);
  }

  return pages;
});

const createNewPage = () => {
  router.push('/cms/editor/new');
};

const editPage = (id) => {
  router.push(`/cms/editor/${id}`);
};

const duplicatePage = async (page) => {
  if (confirm('Create a duplicate of this page?')) {
    try {
      const newPage = {
        ...page,
        title: `${page.title} (Copy)`,
        slug: `${page.slug}-copy`,
        status: 'draft',
        id: undefined
      };
      await cmsStore.createPage(newPage);
    } catch (error) {
      console.error('Failed to duplicate page:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to duplicate page';
      alert(errorMessage);
    }
  }
};

const publishPage = async (id) => {
  try {
    await cmsStore.publishPage(id);
  } catch (error) {
    console.error('Failed to publish page:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to publish page';
    alert(errorMessage);
  }
};

const unpublishPage = async (id) => {
  try {
    await cmsStore.unpublishPage(id);
  } catch (error) {
    console.error('Failed to unpublish page:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to unpublish page';
    alert(errorMessage);
  }
};

const deletePage = async (id) => {
  console.log('[CMS Pages] Delete page called with ID:', id);
  
  // Validate ID
  if (!id) {
    alert('Error: Page ID is missing. Please refresh the page and try again.');
    console.error('[CMS Pages] Cannot delete page: ID is undefined or null');
    return;
  }
  
  if (confirm('Are you sure you want to delete this page?')) {
    try {
      console.log('[CMS Pages] Attempting to delete page with ID:', id);
      await cmsStore.deletePage(id);
      alert('Page deleted successfully!');
    } catch (error) {
      console.error('[CMS Pages] Failed to delete page:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete page';
      alert(errorMessage);
    }
  }
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

onMounted(async () => {
  try {
    console.log('[CMS Pages] Fetching pages and languages...');
    await Promise.all([
      cmsStore.fetchPages(),
      cmsStore.fetchLanguages()
    ]);
    console.log('[CMS Pages] Pages fetched:', cmsStore.pages);
    console.log('[CMS Pages] Total pages:', cmsStore.pages.length);
    
    // Check if pages have IDs
    if (cmsStore.pages.length > 0) {
      const firstPage = cmsStore.pages[0];
      console.log('[CMS Pages] First page structure:', firstPage);
      console.log('[CMS Pages] First page ID:', firstPage.id);
    }
  } catch (error) {
    console.error('[CMS Pages] Error fetching data:', error);
    alert('Failed to load pages. Please check your API connection.');
  }
});
</script>


