import api from './api';

interface JourneyEvent {
  id: string | number;
  event_type: string;
  event_icon: string;
  event_label: string;
  event_source: string;
  details: Record<string, any>;
  created_at: string;
  related_model: {
    type: string;
    id: string | number;
  } | null;
}

interface JourneyTimelineResponse {
  success: boolean;
  data: JourneyEvent[];
  meta: {
    contact_id: string | number;
    contact_name: string;
    contact_email: string;
    total_events: number;
    event_types: string[];
  };
}

interface LogEventParams {
  contact_id: string | number;
  event_type: string;
  event_source: 'form_submission' | 'buyer_intent' | 'manual';
  details?: Record<string, any>;
  related_model_type?: string;
  related_model_id?: string | number;
}

export const journeyService = {
  /**
   * Get journey timeline for a contact
   */
  async getTimeline(
    contactId: string | number,
    params: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<JourneyTimelineResponse> {
    const response = await api.get(`/contacts/${contactId}/journey`, { params });
    return response.data;
  },

  /**
   * Log a journey event
   */
  async logEvent(params: LogEventParams): Promise<{ success: boolean }> {
    const response = await api.post('/journey/events', params);
    return response.data;
  },

  /**
   * Get available event types
   */
  async getEventTypes(): Promise<{
    success: boolean;
    data: Array<{
      id: string;
      name: string;
      icon: string;
      description: string;
    }>;
  }> {
    const response = await api.get('/journey/event-types');
    return response.data;
  },

  /**
   * Helper to log contact creation event
   */
  async logContactCreated(
    contactId: string | number,
    source: 'form_submission' | 'buyer_intent' | 'manual',
    details: Record<string, any> = {}
  ) {
    return this.logEvent({
      contact_id: contactId,
      event_type: 'contact_created',
      event_source: source,
      details,
    });
  },

  /**
   * Helper to log company creation and linking event
   */
  async logCompanyCreated(
    contactId: string | number,
    companyId: string | number,
    companyName: string,
    source: 'form_submission' | 'buyer_intent' | 'manual' = 'manual'
  ) {
    return this.logEvent({
      contact_id: contactId,
      event_type: 'company_created',
      event_source: source,
      details: {
        company_id: companyId,
        company_name: companyName,
      },
      related_model_type: 'company',
      related_model_id: companyId,
    });
  },

  /**
   * Helper to log deal creation event
   */
  async logDealCreated(
    contactId: string | number,
    dealId: string | number,
    dealName: string,
    amount: number,
    source: 'form_submission' | 'buyer_intent' | 'manual' = 'manual'
  ) {
    return this.logEvent({
      contact_id: contactId,
      event_type: 'deal_created',
      event_source: source,
      details: {
        deal_id: dealId,
        deal_name: dealName,
        amount,
      },
      related_model_type: 'deal',
      related_model_id: dealId,
    });
  },

  /**
   * Helper to log deal stage update event
   */
  async logDealUpdated(
    contactId: string | number,
    dealId: string | number,
    dealName: string,
    stage: string,
    amount?: number,
    source: 'form_submission' | 'buyer_intent' | 'manual' = 'manual'
  ) {
    return this.logEvent({
      contact_id: contactId,
      event_type: 'deal_updated',
      event_source: source,
      details: {
        deal_id: dealId,
        deal_name: dealName,
        stage,
        amount,
      },
      related_model_type: 'deal',
      related_model_id: dealId,
    });
  },

  /**
   * Helper to log activity creation event
   */
  async logActivityCreated(
    contactId: string | number,
    activityId: string | number,
    type: 'call' | 'meeting' | 'note' | 'email' | 'task',
    summary: string,
    source: 'form_submission' | 'buyer_intent' | 'manual' = 'manual'
  ) {
    return this.logEvent({
      contact_id: contactId,
      event_type: 'activity_created',
      event_source: source,
      details: {
        activity_id: activityId,
        type,
        summary,
      },
      related_model_type: 'activity',
      related_model_id: activityId,
    });
  },

  /**
   * Helper to log email sent event
   */
  async logEmailSent(
    contactId: string | number,
    emailId: string | number,
    subject: string,
    source: 'form_submission' | 'buyer_intent' | 'manual' = 'manual'
  ) {
    return this.logEvent({
      contact_id: contactId,
      event_type: 'email_sent',
      event_source: source,
      details: {
        email_id: emailId,
        subject,
      },
      related_model_type: 'email',
      related_model_id: emailId,
    });
  },

  /**
   * Helper to log email opened event
   */
  async logEmailOpened(
    contactId: string | number,
    emailId: string | number,
    subject: string,
    source: 'form_submission' | 'buyer_intent' | 'manual' = 'manual'
  ) {
    return this.logEvent({
      contact_id: contactId,
      event_type: 'email_opened',
      event_source: source,
      details: {
        email_id: emailId,
        subject,
      },
      related_model_type: 'email',
      related_model_id: emailId,
    });
  },

  /**
   * Helper to log email link clicked event
   */
  async logEmailLinkClicked(
    contactId: string | number,
    emailId: string | number,
    subject: string,
    link: string,
    source: 'form_submission' | 'buyer_intent' | 'manual' = 'manual'
  ) {
    return this.logEvent({
      contact_id: contactId,
      event_type: 'email_clicked',
      event_source: source,
      details: {
        email_id: emailId,
        subject,
        link,
      },
      related_model_type: 'email',
      related_model_id: emailId,
    });
  },
};

export default journeyService;
