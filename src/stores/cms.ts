import { defineStore } from 'pinia';
import cmsService, { Page, Template, Domain, Language, ABTest } from '@/services/cms';

interface CmsState {
  pages: Page[];
  currentPage: Page | null;
  templates: Template[];
  currentTemplate: Template | null;
  domains: Domain[];
  languages: Language[];
  abTests: ABTest[];
  seoAnalysis: any;
  personalizationRules: any[];
  memberships: any[];
  loading: boolean;
  error: string | null;
}

export const useCmsStore = defineStore('cms', {
  state: (): CmsState => ({
    pages: [],
    currentPage: null,
    templates: [],
    currentTemplate: null,
    domains: [],
    languages: [],
    abTests: [],
    seoAnalysis: null,
    personalizationRules: [],
    memberships: [],
    loading: false,
    error: null
  }),

  getters: {
    publishedPages: (state) => state.pages.filter(p => p.status === 'published'),
    draftPages: (state) => state.pages.filter(p => p.status === 'draft'),
    pagesByLanguage: (state) => (lang: string) => 
      state.pages.filter(p => p.language === lang),
    primaryDomain: (state) => state.domains.find(d => d.is_primary),
    defaultLanguage: (state) => state.languages.find(l => l.is_default)
  },

  actions: {
    // Pages
    async fetchPages(params?: any) {
      this.loading = true;
      this.error = null;
      try {
        const data = await cmsService.getPages(params);
        
        // Debug logging to see API response structure
        console.log('[CMS Store] Raw API response:', data);
        console.log('[CMS Store] data.pages:', data.pages);
        console.log('[CMS Store] data.data:', data.data);
        console.log('[CMS Store] Type of data:', typeof data);
        
        // More flexible parsing that handles various response formats
        let rawPages = data.pages || data.data?.pages || data.data || data;
        
        // Ensure it's an array
        if (!Array.isArray(rawPages)) {
          rawPages = [];
        }
        
        // Map fields to handle different backend field names
        this.pages = rawPages.map((page: any) => ({
          id: page.id || page._id || page.page_id,
          title: page.title || page.page_title || page.name || 'Untitled',
          slug: page.slug || page.page_slug || page.url || 'untitled',
          status: page.status || page.page_status || 'draft',
          content: page.content || page.page_content || [],
          language: page.language || page.lang || 'en',
          access_level: page.access_level || page.access || 'public',
          seo_title: page.seo_title || page.meta_title,
          seo_description: page.seo_description || page.meta_description,
          seo_keywords: page.seo_keywords || page.keywords,
          template_id: page.template_id,
          created_at: page.created_at,
          updated_at: page.updated_at,
          published_at: page.published_at
        }));
        
        console.log('[CMS Store] Parsed pages:', this.pages);
        console.log('[CMS Store] Total pages parsed:', this.pages.length);
        
        return data;
      } catch (error: any) {
        console.error('[CMS Store] Error fetching pages:', error);
        this.error = error.message || 'Failed to fetch pages';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchPage(id: number) {
      this.loading = true;
      this.error = null;
      
      // ✅ VALIDATE: Check for valid ID
      if (!id || typeof id !== 'number' || isNaN(id)) {
        throw new Error(`Invalid page ID: ${id} (type: ${typeof id})`);
      }
      
      try {
        console.log('[CMS Store] Fetching page with ID:', id, typeof id);
        const response = await cmsService.getPage(id);
        console.log('[CMS Store] Fetch page response:', response);
        
        // ✅ CORRECT: Extract page data from response
        const page = response.data?.data || response.data?.page || response.page || response.data || response;
        
        if (!page.id) {
          console.error('[CMS Store] No ID in page response:', response);
          throw new Error('Invalid API response: missing page ID');
        }
        
        console.log('[CMS Store] Page loaded with ID:', page.id, 'Title:', page.title);
        this.currentPage = page;
        
        return { page };
      } catch (error: any) {
        console.error('[CMS Store] Failed to fetch page:', error);
        this.error = error.message || 'Failed to fetch page';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createPage(page: Page) {
      this.loading = true;
      this.error = null;
      try {
        const response = await cmsService.createPage(page);
        console.log('[CMS Store] Create page response:', response);
        
        // ✅ CORRECT: Extract real page data from API response
        const newPage = response.data?.data || response.data?.page || response.page || response.data || response;
        
        if (!newPage.id) {
          console.error('[CMS Store] No ID in page response:', response);
          throw new Error('Invalid API response: missing page ID');
        }
        
        console.log('[CMS Store] Page created with ID:', newPage.id, typeof newPage.id);
        this.pages.unshift(newPage);
        return { page: newPage, message: response.message || 'Page created successfully' };
      } catch (error: any) {
        this.error = error.message || 'Failed to create page';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updatePage(id: number, page: Partial<Page>) {
      this.loading = true;
      this.error = null;
      
      // ✅ VALIDATE: Check for valid ID
      if (!id || typeof id !== 'number' || isNaN(id)) {
        throw new Error(`Invalid page ID: ${id} (type: ${typeof id})`);
      }
      
      try {
        console.log('[CMS Store] Updating page with ID:', id, typeof id);
        const response = await cmsService.updatePage(id, page);
        console.log('[CMS Store] Update page response:', response);
        
        // ✅ CORRECT: Extract page data from response
        const updatedPage = response.data?.data || response.data?.page || response.page || response.data || response;
        
        const index = this.pages.findIndex(p => p.id === id);
        if (index !== -1) {
          this.pages[index] = { ...this.pages[index], ...updatedPage };
        }
        if (this.currentPage && this.currentPage.id === id) {
          this.currentPage = { ...this.currentPage, ...updatedPage };
        }
        
        return response;
      } catch (error: any) {
        this.error = error.message || 'Failed to update page';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deletePage(id: number) {
      this.loading = true;
      this.error = null;
      
      // ✅ VALIDATE: Check for valid ID
      if (!id || typeof id !== 'number' || isNaN(id)) {
        throw new Error(`Invalid page ID: ${id} (type: ${typeof id})`);
      }
      
      try {
        console.log('[CMS Store] Deleting page with ID:', id, typeof id);
        await cmsService.deletePage(id);
        
        // Remove from local state
        this.pages = this.pages.filter(p => p.id !== id);
        
        console.log('[CMS Store] Page deleted successfully');
      } catch (error: any) {
        this.error = error.message || 'Failed to delete page';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async publishPage(id: number) {
      this.loading = true;
      this.error = null;
      
      // ✅ VALIDATE: Check for valid ID
      if (!id || typeof id !== 'number' || isNaN(id)) {
        throw new Error(`Invalid page ID: ${id} (type: ${typeof id})`);
      }
      
      try {
        console.log('[CMS Store] Publishing page with ID:', id, typeof id);
        const response = await cmsService.publishPage(id);
        console.log('[CMS Store] Publish page response:', response);
        
        // ✅ CORRECT: Extract page data from response
        const updatedPage = response.data?.data || response.data?.page || response.page || response.data || response;
        
        const index = this.pages.findIndex(p => p.id === id);
        if (index !== -1) {
          this.pages[index] = { ...this.pages[index], ...updatedPage, status: 'published' };
        }
        
        return response;
      } catch (error: any) {
        this.error = error.message || 'Failed to publish page';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async unpublishPage(id: number) {
      this.loading = true;
      this.error = null;
      
      // ✅ VALIDATE: Check for valid ID
      if (!id || typeof id !== 'number' || isNaN(id)) {
        throw new Error(`Invalid page ID: ${id} (type: ${typeof id})`);
      }
      
      try {
        console.log('[CMS Store] Unpublishing page with ID:', id, typeof id);
        const response = await cmsService.unpublishPage(id);
        console.log('[CMS Store] Unpublish page response:', response);
        
        // ✅ CORRECT: Extract page data from response
        const updatedPage = response.data?.data || response.data?.page || response.page || response.data || response;
        
        const index = this.pages.findIndex(p => p.id === id);
        if (index !== -1) {
          this.pages[index] = { ...this.pages[index], ...updatedPage, status: 'draft' };
        }
        
        return response;
      } catch (error: any) {
        this.error = error.message || 'Failed to unpublish page';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Templates
    async fetchTemplates(params?: any) {
      this.loading = true;
      this.error = null;
      try {
        const data = await cmsService.getTemplates(params);
        
        // Debug logging for templates
        console.log('[CMS Store] Raw templates response:', data);
        
        // More flexible parsing
        let rawTemplates = data.templates || data.data?.templates || data.data || data;
        
        // Ensure it's an array
        if (!Array.isArray(rawTemplates)) {
          rawTemplates = [];
        }
        
        // Map fields to handle different backend field names
        this.templates = rawTemplates.map((template: any) => ({
          id: template.id || template._id || template.template_id,
          name: template.name || template.template_name || template.title || 'Untitled Template',
          description: template.description || template.template_description || '',
          thumbnail: template.thumbnail || template.image || null,
          content: template.content || template.template_content || [],
          category: template.category || template.template_category || 'Custom',
          is_public: template.is_public !== undefined ? template.is_public : false,
          created_at: template.created_at,
          updated_at: template.updated_at
        }));
        
        console.log('[CMS Store] Parsed templates:', this.templates);
        console.log('[CMS Store] Total templates parsed:', this.templates.length);
        
        return data;
      } catch (error: any) {
        console.error('[CMS Store] Error fetching templates:', error);
        this.error = error.message || 'Failed to fetch templates';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTemplate(id: number) {
      this.loading = true;
      this.error = null;
      
      // ✅ VALIDATE: Check for valid ID
      if (!id || typeof id !== 'number' || isNaN(id)) {
        throw new Error(`Invalid template ID: ${id} (type: ${typeof id})`);
      }
      
      try {
        console.log('[CMS Store] Fetching template with ID:', id, typeof id);
        const response = await cmsService.getTemplate(id);
        console.log('[CMS Store] Fetch template response:', response);
        
        // ✅ CORRECT: Extract template data from response
        const template = response.data?.data || response.data?.template || response.template || response.data || response;
        
        if (!template.id) {
          console.error('[CMS Store] No ID in template response:', response);
          throw new Error('Invalid API response: missing template ID');
        }
        
        console.log('[CMS Store] Template loaded with ID:', template.id, 'Name:', template.name);
        this.currentTemplate = template;
        
        return { template };
      } catch (error: any) {
        console.error('[CMS Store] Failed to fetch template:', error);
        this.error = error.message || 'Failed to fetch template';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createTemplate(template: Template) {
      this.loading = true;
      this.error = null;
      try {
        const response = await cmsService.createTemplate(template);
        console.log('[CMS Store] Create template response:', response);
        
        // ✅ CORRECT: Extract template data from response
        const newTemplate = response.data?.data || response.data?.template || response.template || response.data || response;
        
        if (!newTemplate.id) {
          console.error('[CMS Store] No ID in template response:', response);
          throw new Error('Invalid API response: missing template ID');
        }
        
        console.log('[CMS Store] Template created with ID:', newTemplate.id);
        this.templates.unshift(newTemplate);
        return { template: newTemplate, message: response.message || 'Template created successfully' };
      } catch (error: any) {
        this.error = error.message || 'Failed to create template';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTemplate(id: number, template: Partial<Template>) {
      this.loading = true;
      this.error = null;
      
      // ✅ VALIDATE: Check for valid ID
      if (!id || typeof id !== 'number' || isNaN(id)) {
        throw new Error(`Invalid template ID: ${id} (type: ${typeof id})`);
      }
      
      try {
        console.log('[CMS Store] Updating template with ID:', id, typeof id);
        const response = await cmsService.updateTemplate(id, template);
        console.log('[CMS Store] Update template response:', response);
        
        // ✅ CORRECT: Extract template data from response
        const updatedTemplate = response.data?.data || response.data?.template || response.template || response.data || response;
        
        const index = this.templates.findIndex(t => t.id === id);
        if (index !== -1) {
          this.templates[index] = { ...this.templates[index], ...updatedTemplate };
        }
        if (this.currentTemplate && this.currentTemplate.id === id) {
          this.currentTemplate = { ...this.currentTemplate, ...updatedTemplate };
        }
        
        return response;
      } catch (error: any) {
        this.error = error.message || 'Failed to update template';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTemplate(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await cmsService.deleteTemplate(id);
        this.templates = this.templates.filter(t => t.id !== id);
      } catch (error: any) {
        this.error = error.message || 'Failed to delete template';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // SEO
    async analyzeSeo(pageId: number, content: any) {
      this.loading = true;
      this.error = null;
      try {
        const data = await cmsService.analyzeSeo(pageId, content);
        this.seoAnalysis = data;
        return data;
      } catch (error: any) {
        this.error = error.message || 'Failed to analyze SEO';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Personalization
    async fetchPersonalizationRules(pageId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await cmsService.getPersonalizationRules(pageId);
        console.log('[CMS Store] Personalization rules response:', response);
        
        // ✅ CORRECT: Ensure personalizationRules is always an array
        const rules = response.data?.rules || response.rules || response.data || response;
        this.personalizationRules = Array.isArray(rules) ? rules : [];
        
        console.log('[CMS Store] Personalization rules loaded:', this.personalizationRules.length);
        return { rules: this.personalizationRules };
      } catch (error: any) {
        console.error('[CMS Store] Failed to fetch personalization rules:', error);
        // Ensure personalizationRules is always an array even on error
        this.personalizationRules = [];
        this.error = error.message || 'Failed to fetch personalization rules';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createPersonalizationRule(rule: any) {
      this.loading = true;
      this.error = null;
      
      // ✅ ENSURE: personalizationRules is always an array
      if (!Array.isArray(this.personalizationRules)) {
        console.warn('[CMS Store] personalizationRules was not an array, resetting to []');
        this.personalizationRules = [];
      }
      
      try {
        const response = await cmsService.createPersonalizationRule(rule);
        console.log('[CMS Store] Create personalization rule response:', response);
        
        // ✅ CORRECT: Extract rule data from response
        const newRule = response.data?.data || response.data?.rule || response.rule || response.data || response;
        
        if (!newRule.id) {
          console.error('[CMS Store] No ID in personalization rule response:', response);
          throw new Error('Invalid API response: missing rule ID');
        }
        
        console.log('[CMS Store] Personalization rule created with ID:', newRule.id);
        this.personalizationRules.push(newRule);
        
        return { rule: newRule, message: response.message || 'Rule created successfully' };
      } catch (error: any) {
        console.error('[CMS Store] Failed to create personalization rule:', error);
        this.error = error.message || 'Failed to create personalization rule';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deletePersonalizationRule(id: number) {
      this.loading = true;
      this.error = null;
      
      // ✅ VALIDATE: Check for valid ID
      if (!id || String(id) === 'undefined' || typeof id !== 'number') {
        throw new Error(`Invalid rule ID: ${id} (type: ${typeof id})`);
      }
      
      // ✅ ENSURE: personalizationRules is always an array
      if (!Array.isArray(this.personalizationRules)) {
        console.warn('[CMS Store] personalizationRules was not an array, resetting to []');
        this.personalizationRules = [];
      }
      
      try {
        console.log('[CMS Store] Deleting personalization rule with ID:', id, typeof id);
        await cmsService.deletePersonalizationRule(id);
        
        // Remove from local state
        this.personalizationRules = this.personalizationRules.filter(r => r.id !== id);
        
        console.log('[CMS Store] Personalization rule deleted successfully');
      } catch (error: any) {
        console.error('[CMS Store] Failed to delete personalization rule:', error);
        this.error = error.message || 'Failed to delete personalization rule';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // A/B Testing
    async fetchAbTests(pageId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await cmsService.getAbTests(pageId);
        console.log('[CMS Store] Fetch tests response:', response);
        
        // ✅ CORRECT: Extract tests array from response
        const tests = response.data?.tests || response.tests || response.data || response;
        this.abTests = Array.isArray(tests) ? tests : [];
        
        console.log('[CMS Store] Fetched tests for page', pageId, ':', this.abTests.length, 'tests');
        
        return { tests: this.abTests };
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch A/B tests';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createAbTest(test: Partial<ABTest>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await cmsService.createAbTest(test);
        console.log('[CMS Store] Raw API response:', response);
        
        // ✅ CORRECT: Extract real test data from API response
        const newTest = response.data?.test || response.test || response.data || response;
        
        if (!newTest.id) {
          console.error('[CMS Store] No ID in response:', response);
          throw new Error('Invalid API response: missing test ID');
        }
        
        console.log('[CMS Store] Extracted test with ID:', newTest.id);
        this.abTests.push(newTest);
        return { test: newTest, message: response.message || 'Test created successfully' };
      } catch (error: any) {
        // Development fallback - create mock test until backend is ready
        console.log('[A/B Testing] Error details:', { 
          code: error.code, 
          status: error.response?.status, 
          message: error.message,
          isDev: process.env.NODE_ENV === 'development'
        });
        
        if (process.env.NODE_ENV === 'development' && (
          error.code === 'NETWORK_ERROR' || 
          error.code === 'ERR_NETWORK' ||
          error.response?.status >= 500 || 
          error.response?.status === 404 ||
          error.response?.status === 422 || // Also fallback for validation errors in dev
          !error.response ||
          error.message?.includes('Network Error') ||
          error.message?.includes('fetch') ||
          error.message?.includes('timeout') ||
          error.request // Axios request made but no response received
        )) {
          console.warn('[A/B Testing] Using development fallback for createAbTest');
          
          const mockTest = {
            id: Date.now(),
            page_id: test.page_id || 1,
            name: test.name || 'Mock Test',
            description: test.description || '',
            status: 'draft' as const,
            traffic_allocation: test.traffic_allocation || 100,
            confidence_threshold: test.confidence_threshold || 95,
            min_sample_size: test.min_sample_size || 1000,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            variants: test.variants || [
              {
                id: 'control',
                name: 'Control',
                content: {},
                traffic_percentage: 50,
                is_control: true,
                views: 0,
                conversions: 0,
                conversion_rate: 0
              },
              {
                id: 'variant-a',
                name: 'Variant A',
                content: {},
                traffic_percentage: 50,
                is_control: false,
                views: 0,
                conversions: 0,
                conversion_rate: 0
              }
            ],
            goals: test.goals || []
          };
          
          this.abTests.push(mockTest);
          return { test: mockTest, message: 'A/B test created (development mode)' };
        }
        
        this.error = error.message || 'Failed to create A/B test';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async setAbTestWinner(id: number) {
      this.loading = true;
      this.error = null;
      
      // ✅ VALIDATE: Check for valid ID
      if (!id || String(id) === 'undefined' || typeof id !== 'number') {
        throw new Error(`Invalid test ID: ${id} (type: ${typeof id})`);
      }
      
      try {
        const response = await cmsService.setAbTestWinner(id);
        console.log('[CMS Store] Set winner response:', response);
        
        // ✅ CORRECT: Extract test data from response
        const updatedTest = response.data?.test || response.test || response.data || response;
        
        const index = this.abTests.findIndex(t => t.id === id);
        if (index !== -1) {
          this.abTests[index] = { ...this.abTests[index], ...updatedTest, is_winner: true, status: 'completed' };
        }
        
        return response;
      } catch (error: any) {
        this.error = error.message || 'Failed to set A/B test winner';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async startAbTest(id: number) {
      this.loading = true;
      this.error = null;
      
      // ✅ VALIDATE: Check for valid ID
      if (!id || String(id) === 'undefined' || typeof id !== 'number') {
        throw new Error(`Invalid test ID: ${id} (type: ${typeof id})`);
      }
      
      try {
        const response = await cmsService.startAbTest(id);
        console.log('[CMS Store] Start test response:', response);
        
        // ✅ CORRECT: Extract test data from response
        const updatedTest = response.data?.test || response.test || response.data || response;
        
        const index = this.abTests.findIndex(t => t.id === id);
        if (index !== -1) {
          this.abTests[index] = { ...this.abTests[index], ...updatedTest, is_active: true, status: 'running' };
        }
        
        return response;
      } catch (error: any) {
        // Development fallback
        if (process.env.NODE_ENV === 'development' && (error.code === 'NETWORK_ERROR' || error.response?.status >= 500)) {
          console.warn('[A/B Testing] Using development fallback for startAbTest');
          const index = this.abTests.findIndex(t => t.id === id);
          if (index !== -1) {
            this.abTests[index].is_active = true;
            this.abTests[index].status = 'running';
          }
          return { message: 'A/B test started (development mode)' };
        }
        
        this.error = error.message || 'Failed to start A/B test';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async stopAbTest(id: number) {
      this.loading = true;
      this.error = null;
      
      // ✅ VALIDATE: Check for valid ID
      if (!id || String(id) === 'undefined' || typeof id !== 'number') {
        throw new Error(`Invalid test ID: ${id} (type: ${typeof id})`);
      }
      
      try {
        const response = await cmsService.stopAbTest(id);
        console.log('[CMS Store] Stop test response:', response);
        
        // ✅ CORRECT: Extract test data from response
        const updatedTest = response.data?.test || response.test || response.data || response;
        
        const index = this.abTests.findIndex(t => t.id === id);
        if (index !== -1) {
          this.abTests[index] = { ...this.abTests[index], ...updatedTest, is_active: false, status: 'paused' };
        }
        
        return response;
      } catch (error: any) {
        this.error = error.message || 'Failed to stop A/B test';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteAbTest(id: number) {
      this.loading = true;
      this.error = null;
      
      // ✅ VALIDATE: Check for valid ID
      if (!id || String(id) === 'undefined' || typeof id !== 'number') {
        throw new Error(`Invalid test ID: ${id} (type: ${typeof id})`);
      }
      
      try {
        console.log('[CMS Store] Deleting A/B test with ID:', id, typeof id);
        const response = await cmsService.deleteAbTest(id);
        
        // Remove from local state
        this.abTests = this.abTests.filter(t => t.id !== id);
        
        console.log('[CMS Store] A/B test deleted successfully');
        return response;
      } catch (error: any) {
        this.error = error.message || 'Failed to delete A/B test';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Enhanced A/B Testing Methods
    async getAbTestResults(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const data = await cmsService.getAbTestResults(id);
        return data;
      } catch (error: any) {
        this.error = error.message || 'Failed to get A/B test results';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getActiveAbTests(pageId?: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await cmsService.getActiveAbTests(pageId);
        console.log('[CMS Store] Active tests response:', response);
        
        // ✅ CORRECT: Extract tests array from response
        const tests = response.data?.tests || response.tests || response.data || response;
        const testsArray = Array.isArray(tests) ? tests : [];
        
        console.log('[CMS Store] Extracted tests:', testsArray.length, 'tests');
        
        return { tests: testsArray };
      } catch (error: any) {
        // Development fallback - return empty tests until backend is ready
        if (process.env.NODE_ENV === 'development' && (error.code === 'NETWORK_ERROR' || error.response?.status >= 500)) {
          console.warn('[A/B Testing] Using development fallback for getActiveAbTests');
          return { tests: this.abTests.filter(t => !pageId || t.page_id === pageId) };
        }
        
        this.error = error.message || 'Failed to get active A/B tests';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createAbTestVariant(testId: number, variant: any) {
      this.loading = true;
      this.error = null;
      try {
        const data = await cmsService.createAbTestVariant(testId, variant);
        return data;
      } catch (error: any) {
        this.error = error.message || 'Failed to create A/B test variant';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addAbTestGoal(testId: number, goal: any) {
      this.loading = true;
      this.error = null;
      try {
        const data = await cmsService.addAbTestGoal(testId, goal);
        return data;
      } catch (error: any) {
        this.error = error.message || 'Failed to add A/B test goal';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async trackAbTestEvent(eventData: any) {
      try {
        const data = await cmsService.trackAbTestEvent(eventData);
        return data;
      } catch (error: any) {
        console.error('Failed to track A/B test event:', error);
        // Don't throw for tracking errors to avoid disrupting user experience
        return null;
      }
    },

    async getAbTestAnalytics(testId?: number, startDate?: string, endDate?: string) {
      this.loading = true;
      this.error = null;
      try {
        const data = await cmsService.getAbTestAnalytics(testId, startDate, endDate);
        return data;
      } catch (error: any) {
        this.error = error.message || 'Failed to get A/B test analytics';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getAbTestMetrics() {
      this.loading = true;
      this.error = null;
      try {
        const data = await cmsService.getAbTestMetrics();
        return data;
      } catch (error: any) {
        this.error = error.message || 'Failed to get A/B test metrics';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async pauseAbTest(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const data = await cmsService.pauseAbTest(id);
        const index = this.abTests.findIndex(t => t.id === id);
        if (index !== -1) {
          this.abTests[index].status = 'paused';
        }
        return data;
      } catch (error: any) {
        this.error = error.message || 'Failed to pause A/B test';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async resumeAbTest(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const data = await cmsService.resumeAbTest(id);
        const index = this.abTests.findIndex(t => t.id === id);
        if (index !== -1) {
          this.abTests[index].status = 'running';
        }
        return data;
      } catch (error: any) {
        this.error = error.message || 'Failed to resume A/B test';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Memberships
    async fetchMemberships() {
      this.loading = true;
      this.error = null;
      try {
        const data = await cmsService.getMemberships();
        this.memberships = data.memberships || data;
        return data;
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch memberships';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Domains
    async fetchDomains() {
      this.loading = true;
      this.error = null;
      try {
        const data = await cmsService.getDomains();
        this.domains = data.domains || data;
        return data;
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch domains';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createDomain(domain: Partial<Domain>) {
      this.loading = true;
      this.error = null;
      try {
        const data = await cmsService.createDomain(domain);
        this.domains.push(data.domain || data);
        return data;
      } catch (error: any) {
        this.error = error.message || 'Failed to create domain';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteDomain(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await cmsService.deleteDomain(id);
        this.domains = this.domains.filter(d => d.id !== id);
      } catch (error: any) {
        this.error = error.message || 'Failed to delete domain';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Languages
    async fetchLanguages() {
      this.loading = true;
      this.error = null;
      try {
        const data = await cmsService.getLanguages();
        this.languages = data.languages || data;
        return data;
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch languages';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    }
  }
});



