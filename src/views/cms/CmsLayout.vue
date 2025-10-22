<template>
  <div class="cms-layout min-h-screen bg-gray-50">
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </div>

    <!-- Domain Settings Modal -->
    <DomainSettingsModal v-if="domainModalVisible" @close="domainModalVisible = false" />
    
    <!-- Language Settings Modal -->
    <LanguageSettingsModal v-if="languageModalVisible" @close="languageModalVisible = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DomainSettingsModal from '@/components/cms/DomainSettingsModal.vue';
import LanguageSettingsModal from '@/components/cms/LanguageSettingsModal.vue';

const domainModalVisible = ref(false);
const languageModalVisible = ref(false);

const showDomainSettings = () => {
  domainModalVisible.value = true;
};

const showLanguageSettings = () => {
  languageModalVisible.value = true;
};
</script>

<style scoped>
.cms-layout {
  min-height: 100vh;
}
</style>



