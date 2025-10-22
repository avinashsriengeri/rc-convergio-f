import api from './api';

export interface Page {
  id?: number;
  title: string;
  slug: string;
  content: any; // JSON structure for page builder
  template_id?: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  status: 'draft' | 'published';
  access_level: 'public' | 'members' | 'role-based';
  language: string;
  domain_id?: number;
  personalization_rules?: any;
  created_at?: string;
  updated_at?: string;
}

export interface Template {
  id?: number;
  name: string;
  description?: string;
  thumbnail?: string;
  content: any; // JSON structure
  category?: string;
  is_public?: boolean;
}

export interface SeoAnalysis {
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    fix?: string;
  }>;
  suggestions: string[];
}

export interface ABTestVariant {
  id: string;
  name: string;
  content: any;
  traffic_percentage: number;
  is_control: boolean;
  views: number;
  conversions: number;
  conversion_rate: number;
}

export interface ABTestGoal {
  id: string;
  name: string;
  type: 'click' | 'form_submit' | 'page_view' | 'custom_event';
  selector?: string;
  event_name?: string;
  value?: number;
}

export interface ABTest {
  id?: number;
  page_id: number;
  name: string;
  description?: string;
  variants: ABTestVariant[];
  goals: ABTestGoal[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  traffic_allocation: number;
  start_date?: string;
  end_date?: string;
  winner_variant_id?: string;
  confidence_threshold: number;
  min_sample_size: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Domain {
  id?: number;
  domain: string;
  is_primary: boolean;
  ssl_enabled: boolean;
  status: 'active' | 'pending' | 'inactive';
}

export interface Language {
  code: string;
  name: string;
  flag_icon: string;
  is_default: boolean;
}

export interface Membership {
  id?: number;
  name: string;
  description?: string;
  access_level: string;
}

class CmsService {
  // Pages
  async getPages(params?: any) {
    const response = await api.get('/cms/pages', { params });
    return response.data;
  }

  async getPage(id: number) {
    const response = await api.get(`/cms/pages/${id}`);
    return response.data;
  }

  async createPage(page: Page) {
    // Validate page data before sending
    if (!page.title || page.title.trim().length === 0) {
      throw new Error('Page title is required');
    }
    
    if (!page.slug || page.slug.trim().length === 0) {
      throw new Error('Page slug is required');
    }
    
    if (!page.content || (Array.isArray(page.content) && page.content.length === 0)) {
      throw new Error('Page content is required. Please add at least one component to your page.');
    }
    
    console.log('Creating page with data:', page);
    
    const response = await api.post('/cms/pages', page);
    return response.data;
  }

  async updatePage(id: number, page: Partial<Page>) {
    const response = await api.put(`/cms/pages/${id}`, page);
    return response.data;
  }

  async deletePage(id: number) {
    const response = await api.delete(`/cms/pages/${id}`);
    return response.data;
  }

  async publishPage(id: number) {
    const response = await api.post(`/cms/pages/${id}/publish`);
    return response.data;
  }

  async unpublishPage(id: number) {
    const response = await api.post(`/cms/pages/${id}/unpublish`);
    return response.data;
  }

  // Templates
  async getTemplates(params?: any) {
    const response = await api.get('/cms/templates', { params });
    return response.data;
  }

  async getTemplate(id: number) {
    const response = await api.get(`/cms/templates/${id}`);
    return response.data;
  }

  async createTemplate(template: Template) {
    const response = await api.post('/cms/templates', template);
    return response.data;
  }

  async updateTemplate(id: number, template: Partial<Template>) {
    const response = await api.put(`/cms/templates/${id}`, template);
    return response.data;
  }

  async deleteTemplate(id: number) {
    const response = await api.delete(`/cms/templates/${id}`);
    return response.data;
  }

  // SEO
  async analyzeSeo(pageId: number, content: any) {
    const response = await api.post('/cms/seo/analyze', {
      page_id: pageId,
      content
    });
    return response.data;
  }

  async getSeoSuggestions(pageId: number) {
    const response = await api.get(`/cms/seo/suggestions/${pageId}`);
    return response.data;
  }

  // Personalization
  async createPersonalizationRule(rule: any) {
    const response = await api.post('/cms/personalization', rule);
    return response.data;
  }

  async getPersonalizationRules(pageId: number) {
    const response = await api.get(`/cms/personalization/${pageId}`);
    return response.data;
  }

  async updatePersonalizationRule(id: number, rule: any) {
    const response = await api.put(`/cms/personalization/${id}`, rule);
    return response.data;
  }

  async deletePersonalizationRule(id: number) {
    const response = await api.delete(`/cms/personalization/${id}`);
    return response.data;
  }

  // A/B Testing
  async getAbTests(pageId: number) {
    const response = await api.get('/cms/abtesting', {
      params: { page_id: pageId }
    });
    return response.data;
  }

  async createAbTest(test: Partial<ABTest>) {
    console.log('[CMS Service] Creating A/B test with data:', test);
    try {
      const response = await api.post('/cms/abtesting', test);
      console.log('[CMS Service] A/B test created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('[CMS Service] A/B test creation failed:', error);
      throw error;
    }
  }

  async updateAbTest(id: number, test: Partial<ABTest>) {
    const response = await api.put(`/cms/abtesting/${id}`, test);
    return response.data;
  }

  async setAbTestWinner(id: number) {
    const response = await api.post(`/cms/abtesting/${id}/winner`);
    return response.data;
  }

  async startAbTest(id: number) {
    const response = await api.post(`/cms/abtesting/${id}/start`);
    return response.data;
  }

  async stopAbTest(id: number) {
    const response = await api.post(`/cms/abtesting/${id}/stop`);
    return response.data;
  }

  async deleteAbTest(id: number) {
    const response = await api.delete(`/cms/abtesting/${id}`);
    return response.data;
  }

  // Enhanced A/B Testing Methods
  async getAbTestResults(id: number) {
    const response = await api.get(`/cms/abtesting/${id}/results`);
    return response.data;
  }

  async createAbTestVariant(testId: number, variant: Partial<ABTestVariant>) {
    const response = await api.post(`/cms/abtesting/${testId}/variants`, variant);
    return response.data;
  }

  async updateAbTestVariant(testId: number, variantId: string, variant: Partial<ABTestVariant>) {
    const response = await api.put(`/cms/abtesting/${testId}/variants/${variantId}`, variant);
    return response.data;
  }

  async deleteAbTestVariant(testId: number, variantId: string) {
    const response = await api.delete(`/cms/abtesting/${testId}/variants/${variantId}`);
    return response.data;
  }

  async addAbTestGoal(testId: number, goal: Partial<ABTestGoal>) {
    const response = await api.post(`/cms/abtesting/${testId}/goals`, goal);
    return response.data;
  }

  async updateAbTestGoal(testId: number, goalId: string, goal: Partial<ABTestGoal>) {
    const response = await api.put(`/cms/abtesting/${testId}/goals/${goalId}`, goal);
    return response.data;
  }

  async deleteAbTestGoal(testId: number, goalId: string) {
    const response = await api.delete(`/cms/abtesting/${testId}/goals/${goalId}`);
    return response.data;
  }

  async getActiveAbTests(pageId?: number) {
    const params = pageId ? { page_id: pageId } : {};
    const response = await api.get('/cms/abtesting/active', { params });
    return response.data;
  }

  async trackAbTestEvent(data: any) {
    const response = await api.post('/cms/abtesting/track', data);
    return response.data;
  }

  // A/B Testing Analytics
  async getAbTestAnalytics(testId?: number, startDate?: string, endDate?: string) {
    const params: any = {};
    if (testId) params.test_id = testId;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await api.get('/cms/abtesting/analytics', { params });
    return response.data;
  }

  async getAbTestMetrics() {
    const response = await api.get('/cms/abtesting/metrics');
    return response.data;
  }

  async pauseAbTest(id: number) {
    const response = await api.post(`/cms/abtesting/${id}/pause`);
    return response.data;
  }

  async resumeAbTest(id: number) {
    const response = await api.post(`/cms/abtesting/${id}/resume`);
    return response.data;
  }

  // Memberships
  async getMemberships() {
    const response = await api.get('/cms/memberships');
    return response.data;
  }

  async getMembership(id: number) {
    const response = await api.get(`/cms/memberships/${id}`);
    return response.data;
  }

  // Domains
  async getDomains() {
    const response = await api.get('/cms/domains');
    return response.data;
  }

  async createDomain(domain: Partial<Domain>) {
    const response = await api.post('/cms/domains', domain);
    return response.data;
  }

  async updateDomain(id: number, domain: Partial<Domain>) {
    const response = await api.put(`/cms/domains/${id}`, domain);
    return response.data;
  }

  async deleteDomain(id: number) {
    const response = await api.delete(`/cms/domains/${id}`);
    return response.data;
  }

  // Languages
  async getLanguages() {
    const response = await api.get('/cms/languages');
    return response.data;
  }

  async createLanguage(language: Partial<Language>) {
    const response = await api.post('/cms/languages', language);
    return response.data;
  }

  async updateLanguage(code: string, language: Partial<Language>) {
    const response = await api.put(`/cms/languages/${code}`, language);
    return response.data;
  }

  async deleteLanguage(code: string) {
    const response = await api.delete(`/cms/languages/${code}`);
    return response.data;
  }
}

export default new CmsService();


