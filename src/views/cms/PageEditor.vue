<template>
  <div class="page-editor flex flex-col h-screen bg-gray-100 overflow-hidden">
    <!-- Top Bar -->
    <div class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="goBack"
          class="text-gray-600 hover:text-gray-900"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-bold text-gray-900 flex items-center">
            {{ pageTitle || (isEditingTemplate ? `Edit Template: ${templateName}` : isTemplate ? `New Template: ${templateName}` : 'New Page') }}
            <span v-if="isEditingTemplate" class="ml-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
              Editing Template
            </span>
            <span v-else-if="pageId" class="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              Editing Page
            </span>
            <span v-else-if="isTemplate" class="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Creating Template
            </span>
            <span v-else class="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Creating Page
            </span>
          </h1>
          <p class="text-sm text-gray-500">
            {{ pageData.slug || 'Unsaved' }}
            <span v-if="pageId" class="ml-2 text-blue-600">ID: {{ pageId }}</span>
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <!-- View Mode Toggle -->
        <div class="flex rounded-lg border border-gray-300 overflow-hidden">
          <button
            @click="viewMode = 'desktop'"
            :class="[
              'px-4 py-2 text-sm font-medium',
              viewMode === 'desktop' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            Desktop
          </button>
          <button
            @click="viewMode = 'tablet'"
            :class="[
              'px-4 py-2 text-sm font-medium border-x border-gray-300',
              viewMode === 'tablet' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            Tablet
          </button>
          <button
            @click="viewMode = 'mobile'"
            :class="[
              'px-4 py-2 text-sm font-medium',
              viewMode === 'mobile' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            Mobile
          </button>
        </div>

        <!-- Preview Button -->
        <button
          @click="showPreview"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Preview
        </button>

        <!-- Save Draft -->
        <button
          @click="saveDraft"
          :disabled="saving"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          {{ saving ? 'Saving...' : (isTemplate ? 'Save Template' : 'Save Draft') }}
        </button>

        <!-- Publish -->
        <button
          @click="publish"
          :disabled="saving"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ isTemplate ? 'Publish Template' : 'Publish' }}
        </button>

        <!-- More Options -->
        <button
          @click="showMoreMenu = !showMoreMenu"
          class="p-2 text-gray-600 hover:text-gray-900 relative"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
          
          <!-- Dropdown Menu -->
          <div
            v-if="showMoreMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            <button
              @click="openSeoPanel"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              SEO Settings
            </button>
            <button
              @click="openPersonalizationPanel"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Personalization
            </button>
            <button
              @click="openAccessPanel"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Access Control
            </button>
            <button
              @click="openAbTestPanel"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              A/B Testing
            </button>
          </div>
        </button>
      </div>
    </div>

    <!-- Editor Area -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar - Components -->
      <div class="w-64 bg-white border-r border-gray-200 overflow-y-auto" style="max-height: calc(100vh - 80px);">
        <div class="p-4">
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Components</h3>
          
          <!-- Search -->
          <input
            v-model="componentSearch"
            type="text"
            placeholder="Search components..."
            class="w-full px-3 py-2 mb-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <!-- Component Categories -->
          <div class="space-y-4">
            <div v-for="category in componentCategories" :key="category.name">
              <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                {{ category.name }}
              </h4>
              <div class="space-y-2">
                <div
                  v-for="component in category.components"
                  :key="component.type"
                  draggable="true"
                  @dragstart="onDragStart($event, component)"
                  class="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-move hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                      <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path :d="component.icon" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <div class="text-sm font-medium text-gray-900">{{ component.name }}</div>
                      <div class="text-xs text-gray-500">{{ component.description }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Center - Canvas -->
      <div class="flex-1 overflow-auto p-8">
        <div
          :class="[
            'mx-auto bg-white shadow-lg rounded-lg overflow-hidden transition-all',
            viewMode === 'desktop' ? 'max-w-6xl' : '',
            viewMode === 'tablet' ? 'max-w-2xl' : '',
            viewMode === 'mobile' ? 'max-w-sm' : ''
          ]"
        >
          <!-- Canvas Header -->
          <div class="border-b border-gray-200 p-4 bg-gray-50">
            <input
              v-model="pageData.title"
              type="text"
              placeholder="Page Title"
              class="w-full text-2xl font-bold border-none focus:outline-none focus:ring-0 bg-transparent"
            />
            <input
              v-model="pageData.slug"
              type="text"
              placeholder="page-slug"
              class="w-full text-sm text-gray-600 border-none focus:outline-none focus:ring-0 bg-transparent mt-2"
            />
            <!-- Edit Mode Indicator -->
            <div v-if="pageId" class="mt-2 flex items-center text-xs text-blue-600">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editing Page ID: {{ pageId }} | Components: {{ pageComponents.length }}
            </div>
          </div>

          <!-- Drop Zone -->
          <div
            ref="dropZone"
            @dragover.prevent
            @drop="onDrop"
            class="min-h-[600px] p-6"
            :class="isDragging ? 'bg-blue-50' : ''"
          >
            <div v-if="pageComponents.length === 0" class="text-center py-20">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">
                {{ pageId ? 'Page Loaded - No Components' : 'Empty Canvas' }}
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ pageId ? 'This page has no components yet. Drag components from the left sidebar to add content.' : 'Drag components from the left sidebar to start building' }}
              </p>
              <div v-if="pageId" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left max-w-lg mx-auto">
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-blue-800 mb-2">✅ Page Editing Mode Active</p>
                    <div class="text-xs text-blue-700 space-y-1">
                      <p>• <strong>Page ID:</strong> {{ pageId }}</p>
                      <p>• <strong>Title:</strong> "{{ pageData.title || 'Untitled' }}"</p>
                      <p>• <strong>Status:</strong> {{ pageData.status || 'Unknown' }}</p>
                      <p>• <strong>Components:</strong> {{ pageComponents.length }}</p>
                    </div>
                    <div class="mt-3 p-2 bg-white rounded border border-blue-200">
                      <p class="text-xs text-blue-800 font-medium">🎯 How to Edit:</p>
                      <p class="text-xs text-blue-700 mt-1">
                        1. Drag components from left sidebar<br>
                        2. Click components to edit properties<br>
                        3. Use "Save Draft" or "Publish" when done
                      </p>
                      <button
                        @click="addSampleContent"
                        class="mt-2 px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        + Add Sample Content
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Render Components -->
            <div class="space-y-4">
              <div
                v-for="(element, index) in pageComponents"
                :key="element.id"
                class="component-handle"
              >
                <component
                  :is="getComponentType(element.type)"
                  :data="element.data"
                  :selected="selectedComponent === index"
                  @click="selectComponent(index)"
                  @delete="deleteComponent(index)"
                  @edit="editComponent(index)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar - Properties -->
      <div class="w-80 bg-white border-l border-gray-200 overflow-y-auto" style="max-height: calc(100vh - 80px);">
        <div class="p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-gray-900">Properties</h3>
            <button
              v-if="selectedComponent !== null"
              @click="selectedComponent = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="selectedComponent !== null">
            <ComponentProperties
              :component="pageComponents[selectedComponent]"
              @update="updateComponentProperties"
            />
            
            <!-- Save Properties Button -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <button
                @click="saveComponentProperties"
                class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Properties</span>
              </button>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p class="mt-2 text-sm text-gray-500">Select a component to edit its properties</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <SeoPanel v-if="showSeoPanel" :page="pageData" @close="showSeoPanel = false" @save="saveSeoData" />
    <PersonalizationPanel v-if="showPersonalizationPanel" :page-id="pageId" @close="showPersonalizationPanel = false" />
    <AccessControlPanel v-if="showAccessPanel" :page="pageData" @close="showAccessPanel = false" @save="saveAccessData" />
    <AbTestPanel v-if="showAbTestPanel" :page-id="pageId" @close="showAbTestPanel = false" />
    <PreviewModal v-if="previewVisible" :page="pageData" :components="pageComponents" @close="previewVisible = false" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCmsStore } from '@/stores/cms';

// Component imports
import HeroComponent from '@/components/cms/builder/HeroComponent.vue';
import TextComponent from '@/components/cms/builder/TextComponent.vue';
import ImageComponent from '@/components/cms/builder/ImageComponent.vue';
import FormComponent from '@/components/cms/builder/FormComponent.vue';
import CtaComponent from '@/components/cms/builder/CtaComponent.vue';
import ComponentProperties from '@/components/cms/builder/ComponentProperties.vue';
import SeoPanel from '@/components/cms/panels/SeoPanel.vue';
import PersonalizationPanel from '@/components/cms/panels/PersonalizationPanel.vue';
import AccessControlPanel from '@/components/cms/panels/AccessControlPanel.vue';
import AbTestPanel from '@/components/cms/panels/AbTestPanel.vue';
import PreviewModal from '@/components/cms/PreviewModal.vue';

const router = useRouter();
const route = useRoute();
const cmsStore = useCmsStore();

const pageId = computed(() => route.params.id === 'new' ? null : parseInt(route.params.id));
const isTemplate = computed(() => route.query.saveAsTemplate === 'true');
const isEditingTemplate = computed(() => route.query.editTemplate === 'true');
const templateId = computed(() => route.query.templateId ? parseInt(route.query.templateId) : null);
const templateName = computed(() => route.query.templateName || '');
const templateCategory = computed(() => route.query.templateCategory || 'Custom');
const templateDescription = computed(() => route.query.templateDescription || '');
const templateIsPublic = computed(() => route.query.templateIsPublic === 'true');
const templateTags = computed(() => route.query.templateTags || '');
const pageTitle = ref('');
const viewMode = ref('desktop');
const componentSearch = ref('');
const selectedComponent = ref(null);
const isDragging = ref(false);
const saving = ref(false);
const showMoreMenu = ref(false);
const showSeoPanel = ref(false);
const showPersonalizationPanel = ref(false);
const showAccessPanel = ref(false);
const showAbTestPanel = ref(false);
const previewVisible = ref(false);

const pageData = reactive({
  title: '',
  slug: '',
  content: [],
  template_id: null,
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  status: 'draft',
  access_level: 'public',
  language: 'en',
  personalization_rules: null
});

const pageComponents = ref([]);

const componentCategories = [
  {
    name: 'Layout',
    components: [
      {
        type: 'hero',
        name: 'Hero Section',
        description: 'Full-width hero banner',
        icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
      }
    ]
  },
  {
    name: 'Content',
    components: [
      {
        type: 'text',
        name: 'Text Block',
        description: 'Rich text content',
        icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z'
      },
      {
        type: 'image',
        name: 'Image',
        description: 'Single image block',
        icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
      }
    ]
  },
  {
    name: 'Interactive',
    components: [
      {
        type: 'form',
        name: 'Form',
        description: 'Contact or lead form',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
      },
      {
        type: 'cta',
        name: 'Call to Action',
        description: 'CTA button section',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z'
      }
    ]
  }
];

const onDragStart = (event, component) => {
  isDragging.value = true;
  event.dataTransfer.effectAllowed = 'copy';
  event.dataTransfer.setData('component', JSON.stringify(component));
};

const onDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;
  
  const componentData = JSON.parse(event.dataTransfer.getData('component'));
  const newComponent = {
    id: Date.now(),
    type: componentData.type,
    data: getDefaultData(componentData.type)
  };
  
  console.log('Adding new component:', newComponent);
  pageComponents.value.push(newComponent);
  console.log('Total components after add:', pageComponents.value.length);
};

const getDefaultData = (type) => {
  const defaults = {
    hero: {
      title: 'Hero Title',
      subtitle: 'Hero Subtitle',
      buttonText: 'Get Started',
      buttonLink: '#',
      backgroundImage: '',
      textAlign: 'center'
    },
    text: {
      content: '<p>Add your text here...</p>',
      textAlign: 'left'
    },
    image: {
      src: '',
      alt: 'Image',
      width: '100%',
      align: 'center'
    },
    form: {
      title: 'Contact Us',
      fields: [
        { type: 'text', label: 'Name', required: true },
        { type: 'email', label: 'Email', required: true },
        { type: 'textarea', label: 'Message', required: true }
      ],
      buttonText: 'Submit'
    },
    cta: {
      title: 'Ready to get started?',
      description: 'Join thousands of satisfied customers',
      buttonText: 'Get Started',
      buttonLink: '#',
      backgroundColor: '#3B82F6'
    }
  };
  
  return defaults[type] || {};
};

const getComponentType = (type) => {
  const components = {
    hero: HeroComponent,
    text: TextComponent,
    image: ImageComponent,
    form: FormComponent,
    cta: CtaComponent
  };
  return components[type];
};

const selectComponent = (index) => {
  selectedComponent.value = index;
};

const deleteComponent = (index) => {
  pageComponents.value.splice(index, 1);
  selectedComponent.value = null;
};

const editComponent = (index) => {
  selectedComponent.value = index;
};

const updateComponentProperties = (updatedData) => {
  if (selectedComponent.value !== null) {
    pageComponents.value[selectedComponent.value].data = { 
      ...pageComponents.value[selectedComponent.value].data,
      ...updatedData 
    };
  }
};

const saveComponentProperties = () => {
  if (selectedComponent.value !== null) {
    // Force a deep copy to ensure Vue reactivity is triggered
    const currentComponent = pageComponents.value[selectedComponent.value];
    const updatedComponent = {
      id: currentComponent.id,
      type: currentComponent.type,
      data: { ...currentComponent.data }
    };
    
    // Replace the component with the updated copy
    pageComponents.value[selectedComponent.value] = updatedComponent;
    
    // Force Vue to recognize the change
    pageComponents.value = [...pageComponents.value];
    
    console.log('Component properties saved:', pageComponents.value[selectedComponent.value]);
    
    // Show success feedback
    const button = document.querySelector('.bg-blue-600');
    if (button) {
      const originalText = button.innerHTML;
      button.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>Saved!</span>
      `;
      button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
      button.classList.add('bg-green-600', 'hover:bg-green-700');
      
      // Reset after 2 seconds
      setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('bg-green-600', 'hover:bg-green-700');
        button.classList.add('bg-blue-600', 'hover:bg-blue-700');
      }, 2000);
    }
  }
};

// Helper function for category icons
const getCategoryIcon = (category) => {
  const icons = {
    'Landing Page': '🚀',
    'Blog': '📝',
    'E-commerce': '🛒',
    'Portfolio': '🎨',
    'Business': '💼',
    'Custom': '⚡'
  };
  return icons[category] || '📄';
};

const saveDraft = async () => {
  saving.value = true;
  try {
    // Template-specific validation
    if (isTemplate.value) {
      if (!templateName.value || templateName.value.trim().length === 0) {
        alert('Template name is required');
        saving.value = false;
        return;
      }
    } else {
      // Page validation
      if (!pageData.title || pageData.title.trim().length === 0) {
        alert('Please enter a page title');
        saving.value = false;
        return;
      }
      
      if (!pageData.slug || pageData.slug.trim().length === 0) {
        alert('Please enter a page slug');
        saving.value = false;
        return;
      }
    }
    
    
    // Check if there are any components
    if (!pageComponents.value || pageComponents.value.length === 0) {
      alert('Please add at least one component to your page before saving. Drag a component from the left sidebar to the canvas.');
      saving.value = false;
      return;
    }
    
    // Ensure content is properly structured
    const contentToSave = pageComponents.value.map(component => ({
      id: component.id,
      type: component.type,
      data: component.data || {}
    }));
    
    console.log('Content to save:', contentToSave);
    console.log('Is template mode:', isTemplate.value);
    console.log('Template name:', templateName.value);
    
    // Check if we're saving/updating a template
    if (isTemplate.value || isEditingTemplate.value) {
      const templateData = {
        name: templateName.value || pageData.title,
        title: templateName.value || pageData.title,
        description: templateDescription.value || `Professional ${templateCategory.value} template`,
        json_structure: contentToSave,
        category: templateCategory.value,
        type: 'page',
        template_type: 'page',
        is_public: templateIsPublic.value,
        thumbnail: null,
        status: 'draft',
        language: pageData.language || 'en',
        slug: (templateName.value || pageData.title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tags: templateTags.value ? templateTags.value.split(',').map(t => t.trim()) : [],
        usage_count: 0,
        metadata: {
          components_count: contentToSave.length,
          created_from: 'page_editor',
          category_icon: getCategoryIcon(templateCategory.value),
          professional_grade: true
        }
      };
      
      console.log('Saving template:', templateData);
      
      if (isEditingTemplate.value && templateId.value) {
        // Update existing template
        const result = await cmsStore.updateTemplate(templateId.value, templateData);
        console.log('Template updated:', result);
        alert('Template updated successfully!');
      } else {
        // Create new template
        const result = await cmsStore.createTemplate(templateData);
        console.log('Template created:', result);
        alert('Template saved successfully!');
      }
      
      router.push('/cms/templates');
    } else {
      // Save as regular page
      pageData.content = contentToSave;
      pageData.status = 'draft';
      
      if (pageId.value) {
        await cmsStore.updatePage(pageId.value, pageData);
      } else {
        const result = await cmsStore.createPage(pageData);
        router.push(`/cms/editor/${result.page?.id || result.id}`);
      }
      
      alert('Draft saved successfully!');
    }
  } catch (error) {
    console.error('Failed to save draft:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save draft';
    alert(errorMessage);
  } finally {
    saving.value = false;
  }
};

const publish = async () => {
  saving.value = true;
  try {
    // Validation checks
    if (!pageData.title || pageData.title.trim().length === 0) {
      alert('Please enter a page title');
      saving.value = false;
      return;
    }
    
    if (!pageData.slug || pageData.slug.trim().length === 0) {
      alert('Please enter a page slug');
      saving.value = false;
      return;
    }
    
    // Check if there are any components
    if (!pageComponents.value || pageComponents.value.length === 0) {
      alert('Please add at least one component to your page before publishing. Drag a component from the left sidebar to the canvas.');
      saving.value = false;
      return;
    }
    
    // Ensure content is properly structured
    const contentToSave = pageComponents.value.map(component => ({
      id: component.id,
      type: component.type,
      data: component.data || {}
    }));
    
    // Check if we're publishing as a template
    if (isTemplate.value) {
      // Save as public template with enhanced professional data
      const templateData = {
        name: templateName.value || pageData.title,
        title: templateName.value || pageData.title,
        description: templateDescription.value || `Professional ${templateCategory.value} template`,
        json_structure: contentToSave,
        category: templateCategory.value,
        type: 'page',
        template_type: 'page',
        is_public: true, // Published templates are public
        thumbnail: null,
        status: 'published',
        language: pageData.language || 'en',
        slug: (templateName.value || pageData.title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tags: templateTags.value ? templateTags.value.split(',').map(t => t.trim()) : [],
        usage_count: 0,
        metadata: {
          components_count: contentToSave.length,
          created_from: 'page_editor',
          category_icon: getCategoryIcon(templateCategory.value),
          professional_grade: true
        }
      };
      
      console.log('Publishing as public template:', templateData);
      const result = await cmsStore.createTemplate(templateData);
      console.log('Template published:', result);
      
      alert('Template published successfully!');
      router.push('/cms/templates');
    } else {
      // Publish as regular page
      pageData.content = contentToSave;
      pageData.status = 'published';
      
      if (pageId.value) {
        await cmsStore.updatePage(pageId.value, pageData);
        await cmsStore.publishPage(pageId.value);
      } else {
        const result = await cmsStore.createPage(pageData);
        await cmsStore.publishPage(result.page?.id || result.id);
      }
      
      alert('Page published successfully!');
      router.push('/cms/pages');
    }
  } catch (error) {
    console.error('Failed to publish page:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to publish page';
    alert(errorMessage);
  } finally {
    saving.value = false;
  }
};

const showPreview = () => {
  previewVisible.value = true;
};

const addSampleContent = () => {
  // Add sample components to help users get started with editing
  const sampleComponents = [
    {
      id: `comp-${Date.now()}-1`,
      type: 'hero',
      data: {
        heading: pageData.title || 'Welcome to Our Page',
        subheading: 'This is a sample hero section. Click to edit this content.',
        buttonText: 'Get Started',
        backgroundColor: '#3B82F6'
      }
    },
    {
      id: `comp-${Date.now()}-2`,
      type: 'text',
      data: {
        content: 'This is a sample text block. You can edit this content by clicking on it. Add your own text, format it, and make it your own.',
        alignment: 'left'
      }
    }
  ];
  
  pageComponents.value = sampleComponents;
  
  // Show success message
  alert('Sample content added! Click on any component to edit it, or drag new components from the left sidebar.');
};

const goBack = () => {
  if (confirm('Are you sure? Unsaved changes will be lost.')) {
    router.push(isTemplate.value ? '/cms/templates' : '/cms/pages');
  }
};

const openSeoPanel = () => {
  showSeoPanel.value = true;
  showMoreMenu.value = false;
};

const openPersonalizationPanel = () => {
  showPersonalizationPanel.value = true;
  showMoreMenu.value = false;
};

const openAccessPanel = () => {
  showAccessPanel.value = true;
  showMoreMenu.value = false;
};

const openAbTestPanel = () => {
  showAbTestPanel.value = true;
  showMoreMenu.value = false;
};

const saveSeoData = (seoData) => {
  Object.assign(pageData, seoData);
  showSeoPanel.value = false;
};

const saveAccessData = (accessData) => {
  Object.assign(pageData, accessData);
  showAccessPanel.value = false;
};

onMounted(async () => {
  // Handle template editing mode
  if (isEditingTemplate.value && templateId.value) {
    try {
      console.log('[PageEditor] Loading template for editing, ID:', templateId.value);
      
      // Fetch the template data
      await cmsStore.fetchTemplate(templateId.value);
      
      if (cmsStore.currentTemplate) {
        const template = cmsStore.currentTemplate;
        
        // Load template data into form
        pageData.title = template.name || template.title || '';
        pageData.slug = template.slug || template.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '';
        pageTitle.value = template.name || template.title || '';
        
        // Load template components from json_structure
        pageComponents.value = Array.isArray(template.json_structure) 
          ? template.json_structure.map((comp, index) => ({
              id: comp.id || `comp-${Date.now()}-${index}`,
              type: comp.type,
              data: comp.data || comp.props || comp
            }))
          : [];
          
        console.log('[PageEditor] Template loaded for editing:', {
          id: templateId.value,
          name: template.name,
          components: pageComponents.value.length
        });
      }
    } catch (error) {
      console.error('[PageEditor] Failed to load template:', error);
      alert('Failed to load template for editing. Redirecting to templates list.');
      router.push('/cms/templates');
    }
  }
  // Initialize template mode if creating a template
  else if (isTemplate.value && templateName.value) {
    pageData.title = templateName.value;
    pageData.slug = templateName.value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    pageTitle.value = templateName.value;
    
    // Load pre-configured components for the category
    if (route.query.preloadComponents) {
      try {
        const preloadedComponents = JSON.parse(route.query.preloadComponents);
        if (Array.isArray(preloadedComponents) && preloadedComponents.length > 0) {
          pageComponents.value = preloadedComponents.map((comp, index) => ({
            id: `comp-${Date.now()}-${index}`,
            type: comp.type,
            data: comp.data
          }));
        }
      } catch (error) {
        console.warn('[PageEditor] Failed to parse preloaded components:', error);
      }
    }
    
  }
  
  // Handle using template for new page creation
  else if (route.query.useTemplate && route.query.templateData) {
    try {
      console.log('[PageEditor] Loading template for new page creation');
      console.log('[PageEditor] Route query:', route.query);
      
      // Set page title from template
      const templateName = route.query.templateName || 'New Page';
      pageData.title = `New Page from ${templateName}`;
      pageData.slug = `new-page-${Date.now()}`;
      pageTitle.value = pageData.title;
      
      // Load template components
      const templateData = JSON.parse(route.query.templateData);
      console.log('[PageEditor] Parsed template data:', templateData);
      
      if (Array.isArray(templateData) && templateData.length > 0) {
        pageComponents.value = templateData.map((comp, index) => ({
          id: comp.id || `comp-${Date.now()}-${index}`,
          type: comp.type,
          data: comp.data || comp.props || comp
        }));
        
        console.log('[PageEditor] Template loaded for new page:', {
          templateName: templateName,
          components: pageComponents.value.length,
          pageComponents: pageComponents.value
        });
      } else {
        console.log('[PageEditor] Template has no components, starting with empty page');
        console.log('[PageEditor] Template data was:', templateData);
      }
    } catch (error) {
      console.error('[PageEditor] Failed to load template data:', error);
      console.error('[PageEditor] Error details:', error);
      alert('Failed to load template data. Starting with empty page.');
    }
  }
  
  if (pageId.value) {
    try {
      const result = await cmsStore.fetchPage(pageId.value);
      
      if (cmsStore.currentPage) {
        
        // ✅ CORRECT: Load existing page data into form (ensure reactivity)
        const loadedPage = cmsStore.currentPage;
        
        pageData.title = loadedPage.title || '';
        pageData.slug = loadedPage.slug || '';
        pageData.content = loadedPage.content || [];
        pageData.template_id = loadedPage.template_id || null;
        pageData.seo_title = loadedPage.seo_title || '';
        pageData.seo_description = loadedPage.seo_description || '';
        pageData.seo_keywords = loadedPage.seo_keywords || '';
        pageData.status = loadedPage.status || 'draft';
        pageData.access_level = loadedPage.access_level || 'public';
        pageData.language = loadedPage.language || 'en';
        pageData.personalization_rules = loadedPage.personalization_rules || null;
        
        // ✅ CORRECT: Load existing components
        pageComponents.value = Array.isArray(loadedPage.content) 
          ? loadedPage.content.map((comp, index) => ({
              id: comp.id || `comp-${Date.now()}-${index}`,
              type: comp.type,
              data: comp.data || comp.props || comp
            }))
          : [];
          
        pageTitle.value = loadedPage.title || '';
        
      } else {
        console.error('[PageEditor] No current page data after fetch');
        throw new Error('Page data not loaded properly');
      }
    } catch (error) {
      console.error('[PageEditor] Failed to load page:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load page for editing';
      alert(`Error loading page: ${errorMessage}\n\nRedirecting to pages list.`);
      router.push(isTemplate.value ? '/cms/templates' : '/cms/pages');
    }
  }
});

watch(() => pageData.title, (newTitle) => {
  pageTitle.value = newTitle;
  // Auto-generate slug if creating new page
  if (!pageId.value && newTitle && !pageData.slug) {
    pageData.slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
});
</script>

<style scoped>
.page-editor {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
</style>


