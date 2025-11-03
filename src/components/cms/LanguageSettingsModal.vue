<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Language Settings</h2>
          <p class="text-sm text-gray-500 mt-1">Manage multi-language support</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        <!-- Active Languages -->
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Active Languages</h3>
          <div class="space-y-2">
            <div
              v-for="language in languages"
              :key="language.code"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center space-x-3">
                <img
                  :src="`/flags/${language.code}.svg`"
                  :alt="language.name"
                  class="w-6 h-4 object-cover rounded"
                  @error="handleFlagError"
                />
                <div>
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-gray-900">{{ language.name }}</span>
                    <span class="text-xs text-gray-500 uppercase">{{ language.code }}</span>
                    <span
                      v-if="language.is_default"
                      class="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      Default
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  v-if="!language.is_default"
                  @click="setDefault(language)"
                  class="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                >
                  Set Default
                </button>
                <button
                  v-if="!language.is_default"
                  @click="removeLanguage(language)"
                  class="p-2 text-red-600 hover:text-red-800"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Language -->
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Add Language</h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="lang in availableLanguages"
              :key="lang.code"
              @click="addLanguage(lang)"
              class="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <img
                :src="`/flags/${lang.code}.svg`"
                :alt="lang.name"
                class="w-6 h-4 object-cover rounded"
                @error="handleFlagError"
              />
              <span class="text-sm font-medium text-gray-900">{{ lang.name }}</span>
            </button>
          </div>
        </div>

        <!-- Translation Options -->
        <div class="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-purple-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
            </svg>
            <div class="flex-1">
              <h4 class="text-sm font-semibold text-purple-900">Auto-Translation</h4>
              <p class="text-xs text-purple-700 mt-1 mb-3">
                Enable automatic translation for new content using AI-powered translations
              </p>
              <button class="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
                Enable Auto-Translate
              </button>
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
import { ref, computed, onMounted } from 'vue';
import { useCmsStore } from '@/stores/cms';

const emit = defineEmits(['close']);
const cmsStore = useCmsStore();

const languages = ref([]);

const allLanguages = [
  { code: 'en', name: 'English', flag_icon: 'en.svg' },
  { code: 'fr', name: 'French', flag_icon: 'fr.svg' },
  { code: 'ar', name: 'Arabic', flag_icon: 'ar.svg' },
  { code: 'zh', name: 'Chinese', flag_icon: 'zh.svg' },
  { code: 'pt', name: 'Portuguese', flag_icon: 'pt.svg' },
  { code: 'sw', name: 'Swahili', flag_icon: 'sw.svg' },
  { code: 'zu', name: 'Zulu', flag_icon: 'zu.svg' },
  { code: 'af', name: 'Afrikaans', flag_icon: 'af.svg' },
  { code: 'tn', name: 'Setswana', flag_icon: 'tn.svg' }
];

const availableLanguages = computed(() => {
  const activeCodes = languages.value.map(l => l.code);
  return allLanguages.filter(l => !activeCodes.includes(l.code));
});

const addLanguage = async (lang) => {
  try {
    await cmsStore.createLanguage({
      ...lang,
      is_default: languages.value.length === 0
    });
    await loadLanguages();
  } catch (error) {
    // Add locally if API fails
    languages.value.push({
      ...lang,
      is_default: languages.value.length === 0
    });
  }
};

const setDefault = async (language) => {
  try {
    languages.value.forEach(l => l.is_default = false);
    language.is_default = true;
    await cmsStore.updateLanguage(language.code, { is_default: true });
  } catch (error) {
    alert('Failed to set default language');
  }
};

const removeLanguage = async (language) => {
  if (confirm(`Remove ${language.name}?`)) {
    try {
      await cmsStore.deleteLanguage(language.code);
      await loadLanguages();
    } catch (error) {
      languages.value = languages.value.filter(l => l.code !== language.code);
    }
  }
};

const handleFlagError = (event) => {
  event.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16"><rect fill="%23ccc" width="24" height="16"/></svg>';
};

const loadLanguages = async () => {
  try {
    await cmsStore.fetchLanguages();
    languages.value = cmsStore.languages;
  } catch (error) {
    // Default languages
    languages.value = [
      { code: 'en', name: 'English', flag_icon: 'en.svg', is_default: true }
    ];
  }
};

onMounted(() => {
  loadLanguages();
});
</script>





