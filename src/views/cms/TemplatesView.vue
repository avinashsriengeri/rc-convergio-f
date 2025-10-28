<template>
  <div class="templates-view">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Templates</h2>
        <p class="text-gray-600 mt-1">Browse and manage page templates</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Template
      </button>
    </div>


    <!-- Categories -->
    <div class="mb-6">
      <div class="flex space-x-2">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Templates Grid -->
    <div v-if="cmsStore.loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
      >
        <!-- Template Preview -->
        <div class="relative aspect-video bg-gray-100 overflow-hidden">
          <img
            v-if="template.thumbnail"
            :src="template.thumbnail"
            :alt="template.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="flex items-center justify-center h-full">
            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          
          <!-- Hover Actions -->
          <div class="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
            <button
              @click="useTemplate(template)"
              class="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100"
            >
              Use Template
            </button>
            <button
              @click="previewTemplate(template)"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Preview
            </button>
          </div>
        </div>

        <!-- Template Info -->
        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 mb-1">{{ template.name }}</h3>
              <p class="text-sm text-gray-600">{{ template.description }}</p>
            </div>
            <div class="flex space-x-1">
              <button
                @click="editTemplate(template)"
                class="p-2 text-blue-600 hover:bg-blue-50 rounded"
                title="Edit"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="deleteTemplate(template.id)"
                class="p-2 text-red-600 hover:bg-red-50 rounded"
                title="Delete"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
              {{ template.category }}
            </span>
            <span
              v-if="template.is_public"
              class="text-xs text-green-600 flex items-center"
            >
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Public
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!cmsStore.loading && filteredTemplates.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new template.</p>
    </div>

    <!-- Create Template Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Create Template</h3>
            <button
              @click="showCreateModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Modal Content -->
        <div class="p-6">
          <div class="space-y-4">
            <!-- Template Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
              <input
                v-model="newTemplate.name"
                type="text"
                placeholder="e.g., Blog Post Layout"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <!-- Category Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                v-model="newTemplate.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Landing Page">Landing Page</option>
                <option value="Blog">Blog</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Portfolio">Portfolio</option>
                <option value="Business">Business</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            
            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="newTemplate.description"
                rows="3"
                placeholder="Describe this template..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            @click="showCreateModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="createTemplateWithCategory"
            :disabled="!newTemplate.name || !newTemplate.category"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Create Template
          </button>
        </div>
      </div>
    </div>

    <!-- Template Preview Modal -->
    <div v-if="showPreviewModal && selectedTemplateForPreview" class="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex flex-col">
      <!-- Preview Header -->
      <div class="bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h2 class="text-xl font-bold text-white">Preview: {{ selectedTemplateForPreview.name }}</h2>
          <span class="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">{{ selectedTemplateForPreview.category }}</span>
        </div>
        <button
          @click="showPreviewModal = false"
          class="text-gray-400 hover:text-white"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Preview Content -->
      <div class="flex-1 overflow-auto p-8 flex justify-center items-start">
        <div class="bg-white shadow-2xl w-full max-w-4xl rounded-lg">
          <!-- Template Info -->
          <div class="bg-blue-50 border-b border-blue-200 p-4">
            <h3 class="font-semibold text-blue-900">{{ selectedTemplateForPreview.name }}</h3>
            <p class="text-sm text-blue-700">{{ selectedTemplateForPreview.description || 'Template preview' }}</p>
            <p class="text-xs text-blue-600 mt-1">Category: {{ selectedTemplateForPreview.category }}</p>
          </div>

          <!-- Template Components Preview -->
          <div class="p-6">
            <div v-if="getTemplateContentForPreview(selectedTemplateForPreview).length > 0">
              <div v-for="(component, index) in getTemplateContentForPreview(selectedTemplateForPreview)" :key="index" class="mb-6">
                <div class="text-xs text-gray-500 mb-2 bg-gray-100 p-2 rounded">
                  Component {{ index + 1 }}: {{ component.type }}
                  <span v-if="component.isSample" class="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Sample Content</span>
                </div>
                <component
                  :is="getComponentType(component.type)"
                  :data="component.data || {}"
                  :selected="false"
                />
              </div>
            </div>
            
            <!-- Fallback for completely empty templates -->
            <div v-else class="text-center py-20">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              <h3 class="mt-2 text-lg font-medium text-gray-900">Empty Template</h3>
              <p class="mt-1 text-sm text-gray-500">This template doesn't have any components yet.</p>
              <p class="mt-1 text-xs text-gray-400">Edit the template to add components.</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="bg-gray-50 border-t border-gray-200 p-4 flex justify-end space-x-3">
            <button
              @click="showPreviewModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <button
              @click="useTemplateFromPreview"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Use This Template
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
import { useCmsStore } from '@/stores/cms';

// Import components for preview
import HeroComponent from '@/components/cms/builder/HeroComponent.vue';
import TextComponent from '@/components/cms/builder/TextComponent.vue';
import ImageComponent from '@/components/cms/builder/ImageComponent.vue';
import FormComponent from '@/components/cms/builder/FormComponent.vue';
import CtaComponent from '@/components/cms/builder/CtaComponent.vue';

const router = useRouter();
const cmsStore = useCmsStore();

const selectedCategory = ref('All');
const showCreateModal = ref(false);
const showPreviewModal = ref(false);
const selectedTemplateForPreview = ref(null);
const categories = ['All', 'Landing Page', 'Blog', 'E-commerce', 'Portfolio', 'Business', 'Custom'];

const newTemplate = ref({
  name: '',
  category: 'Landing Page',
  description: ''
});

const filteredTemplates = computed(() => {
  console.log('[Templates] Filtering templates:', {
    selectedCategory: selectedCategory.value,
    totalTemplates: cmsStore.templates.length,
    templates: cmsStore.templates.map(t => ({ id: t.id, name: t.name, category: t.category }))
  });
  
  if (selectedCategory.value === 'All') {
    return cmsStore.templates;
  }
  
  // Fix category filtering - ensure exact match
  const filtered = cmsStore.templates.filter(t => {
    const templateCategory = t.category || 'Custom';
    const matches = templateCategory === selectedCategory.value;
    console.log('[Templates] Category match:', { templateCategory, selectedCategory: selectedCategory.value, matches });
    return matches;
  });
  
  console.log('[Templates] Filtered result:', filtered.length, 'templates');
  return filtered;
});

const createTemplateWithCategory = () => {
  if (!newTemplate.value.name || !newTemplate.value.category) {
    alert('Please fill in template name and category');
    return;
  }
  
  console.log('[Templates] Creating template with category:', newTemplate.value.category);
  
  router.push({
    name: 'CmsPageEditor',
    params: { id: 'new' },
    query: { 
      saveAsTemplate: true, 
      templateName: newTemplate.value.name,
      templateCategory: newTemplate.value.category,
      templateDescription: newTemplate.value.description
    }
  });
  
  showCreateModal.value = false;
  
  // Reset form
  newTemplate.value = {
    name: '',
    category: 'Landing Page',
    description: ''
  };
};

const useTemplate = async (template) => {
  if (confirm(`Create a new page using "${template.name}" template?`)) {
    try {
      console.log('[Templates] Using template:', template);
      
      // Fetch the full template data from the API to ensure we have json_structure
      await cmsStore.fetchTemplate(template.id);
      const fullTemplate = cmsStore.currentTemplate || template;
      
      console.log('[Templates] Full template:', fullTemplate);
      
      // Ensure we have the template data
      const templateData = fullTemplate.json_structure || fullTemplate.content || [];
      console.log('[Templates] Template data:', templateData);
      console.log('[Templates] Template data length:', templateData.length);
      
      // Redirect directly to page editor with template data
      router.push({
        name: 'CmsPageEditor',
        params: { id: 'new' },
        query: {
          useTemplate: true,
          templateId: template.id,
          templateName: template.name,
          templateData: JSON.stringify(templateData)
        }
      });
    } catch (error) {
      console.error('Failed to redirect to page editor:', error);
      alert('Failed to open page editor with template');
    }
  }
};

const previewTemplate = (template) => {
  console.log('[Templates] Previewing template:', template);
  // Set template for preview modal
  selectedTemplateForPreview.value = template;
  showPreviewModal.value = true;
};

const editTemplate = async (template) => {
  try {
    // Load the template data first
    console.log('[Templates] Editing template:', template);
    
    // Navigate to page editor in template editing mode
    router.push({
      name: 'CmsPageEditor',
      params: { id: 'new' },
      query: {
        editTemplate: 'true',
        templateId: template.id,
        templateName: template.name,
        templateCategory: template.category,
        templateDescription: template.description,
        saveAsTemplate: 'true'
      }
    });
  } catch (error) {
    console.error('Failed to edit template:', error);
    alert('Failed to open template for editing');
  }
};

const deleteTemplate = async (id) => {
  if (confirm('Delete this template?')) {
    try {
      await cmsStore.deleteTemplate(id);
    } catch (error) {
      console.error('Failed to delete template:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete template';
      alert(errorMessage);
    }
  }
};

const useTemplateFromPreview = async () => {
  if (selectedTemplateForPreview.value) {
    showPreviewModal.value = false;
    await useTemplate(selectedTemplateForPreview.value);
  }
};

const getTemplateContentForPreview = (template) => {
  if (!template) return [];
  
  // If template has content, return it
  if (template.content && template.content.length > 0) {
    return template.content;
  }
  
  // If template is empty, provide sample content based on category
  const sampleContent = getSampleContentByCategory(template.category || 'Custom');
  return sampleContent.map(component => ({
    ...component,
    isSample: true // Mark as sample content
  }));
};

const getSampleContentByCategory = (category) => {
  const sampleContent = {
    'Landing Page': [
      {
        type: 'hero',
        data: {
          title: 'Welcome to Our Amazing Product',
          subtitle: 'Transform your business with our innovative solution',
          backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
          buttonText: 'Get Started',
          buttonLink: '#'
        }
      },
      {
        type: 'text',
        data: {
          content: '<h2>Why Choose Us?</h2><p>We provide cutting-edge solutions that help businesses grow and succeed in today\'s competitive market.</p>'
        }
      },
      {
        type: 'image',
        data: {
          src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Business analytics dashboard',
          width: '100%',
          align: 'center'
        }
      },
      {
        type: 'cta',
        data: {
          title: 'Ready to get started?',
          description: 'Join thousands of satisfied customers',
          buttonText: 'Start Free Trial',
          buttonLink: '#',
          backgroundColor: '#3B82F6'
        }
      }
    ],
    'Blog': [
      {
        type: 'hero',
        data: {
          title: 'Blog Post Title',
          subtitle: 'Insights and stories from our team',
          backgroundImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
        }
      },
      {
        type: 'image',
        data: {
          src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Team collaboration',
          width: '100%',
          align: 'center'
        }
      },
      {
        type: 'text',
        data: {
          content: '<h2>Article Content</h2><p>This is where your blog post content would appear. You can write about industry insights, company updates, or helpful tutorials.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>'
        }
      }
    ],
    'E-commerce': [
      {
        type: 'hero',
        data: {
          title: 'Shop Our Products',
          subtitle: 'Discover amazing deals and quality products',
          backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
        }
      },
      {
        type: 'text',
        data: {
          content: '<h2>Featured Products</h2><p>Browse our collection of high-quality products designed to meet your needs.</p>'
        }
      },
      {
        type: 'image',
        data: {
          src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Featured products showcase',
          width: '100%',
          align: 'center'
        }
      },
      {
        type: 'cta',
        data: {
          title: 'Start Shopping Today',
          description: 'Free shipping on orders over $50',
          buttonText: 'Shop Now',
          buttonLink: '#'
        }
      }
    ],
    'Portfolio': [
      {
        type: 'hero',
        data: {
          title: 'My Portfolio',
          subtitle: 'Showcasing my best work and projects',
          backgroundImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
        }
      },
      {
        type: 'text',
        data: {
          content: '<h2>About My Work</h2><p>I specialize in creating beautiful, functional designs that solve real problems and delight users.</p>'
        }
      },
      {
        type: 'image',
        data: {
          src: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Portfolio showcase',
          width: '100%',
          align: 'center'
        }
      }
    ],
    'Business': [
      {
        type: 'hero',
        data: {
          title: 'Your Business Name',
          subtitle: 'Professional services you can trust',
          backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
        }
      },
      {
        type: 'text',
        data: {
          content: '<h2>Our Services</h2><p>We provide comprehensive business solutions to help your company achieve its goals.</p>'
        }
      },
      {
        type: 'image',
        data: {
          src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Professional business team',
          width: '100%',
          align: 'center'
        }
      },
      {
        type: 'cta',
        data: {
          title: 'Get in Touch',
          description: 'Let\'s discuss how we can help your business',
          buttonText: 'Contact Us',
          buttonLink: '#'
        }
      }
    ]
  };
  
  // Return sample content for the category, or default to Landing Page
  return sampleContent[category] || sampleContent['Landing Page'];
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

onMounted(async () => {
  await cmsStore.fetchTemplates();
});
</script>


