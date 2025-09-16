# Marketing Module - Complete Backend API Requirements

## Overview
This document outlines all the backend APIs required to achieve 100% functionality of the Marketing module. Currently, the frontend is using fallback data for development purposes.

## 1. Analytics APIs

### Core Analytics
- `GET /api/analytics/modules` - Get available analytics modules
- `GET /api/analytics/periods` - Get available time periods (week, month, quarter, year)
- `GET /api/analytics/dashboard?period={period}` - Get dashboard summary data
- `GET /api/analytics/{module}?period={period}` - Get module-specific analytics

### Required Data Structure for Dashboard
```json
{
  "contacts": {
    "total": 1247,
    "new": 89,
    "growth": 12.5,
    "trend": "up"
  },
  "deals": {
    "total": 156,
    "new": 23,
    "value": 2840000,
    "growth": 8.3,
    "trend": "up"
  },
  "campaigns": {
    "total": 45,
    "active": 12,
    "sent": 33,
    "growth": 15.2,
    "trend": "up"
  },
  "ads": {
    "total": 8,
    "active": 5,
    "spend": 12500,
    "impressions": 125000,
    "growth": 22.1,
    "trend": "up"
  },
  "events": {
    "total": 18,
    "upcoming": 6,
    "attendees": 234,
    "growth": 5.7,
    "trend": "up"
  },
  "meetings": {
    "total": 67,
    "scheduled": 12,
    "completed": 55,
    "growth": 18.9,
    "trend": "up"
  },
  "tasks": {
    "total": 234,
    "completed": 189,
    "pending": 45,
    "growth": 3.2,
    "trend": "up"
  },
  "companies": {
    "total": 89,
    "new": 12,
    "growth": 7.8,
    "trend": "up"
  },
  "forecast": {
    "projected": 3200000,
    "probability_weighted": 2560000,
    "accuracy": 87.5,
    "growth": 11.2,
    "trend": "up"
  },
  "lead_scoring": {
    "total_leads": 456,
    "qualified": 123,
    "avg_score": 78.5,
    "growth": 9.4,
    "trend": "up"
  },
  "journeys": {
    "total": 15,
    "active": 8,
    "completed": 7,
    "participants": 567,
    "growth": 13.6,
    "trend": "up"
  },
  "visitor_intent": {
    "total_visitors": 2341,
    "high_intent": 234,
    "medium_intent": 567,
    "low_intent": 1540,
    "growth": 16.8,
    "trend": "up"
  }
}
```

## 2. Email Marketing APIs

### Campaign Management
- `GET /api/campaigns?type=email&per_page=15&page={n}` - Get email campaigns
- `GET /api/campaigns/{campaign_id}` - Get campaign details
- `GET /api/campaigns/{campaign_id}/recipients?per_page=20` - Get campaign recipients
- `GET /api/campaigns/{campaign_id}/metrics` - Get campaign metrics
- `POST /api/campaigns` - Create new campaign
- `POST /api/campaigns/{id}/schedule` - Schedule campaign
- `GET /api/campaigns/templates` - Get email templates
- `GET /api/metadata/owners` - Get campaign owners

### Required Data Structure
```json
{
  "id": 1,
  "name": "Q4 Product Launch",
  "subject": "Introducing Our Latest Innovation",
  "status": "sent",
  "sent_count": 5420,
  "open_count": 1284,
  "click_count": 156,
  "bounce_count": 108,
  "unsubscribe_count": 23,
  "created_at": "2024-01-15T10:30:00Z",
  "sent_at": "2024-01-15T14:00:00Z",
  "owner": { "id": 1, "name": "John Smith" },
  "template": { "id": 1, "name": "Product Launch" }
}
```

## 3. Ads Management APIs

### Ad Account Management
- `GET /api/ad-accounts/providers` - Get ad account providers
- `GET /api/ad-accounts` - Get connected ad accounts
- `POST /api/ad-accounts` - Connect new ad account
- `PUT /api/ad-accounts/{id}` - Update ad account
- `DELETE /api/ad-accounts/{id}` - Delete ad account
- `POST /api/campaigns/{campaign_id}/ads` - Create ad campaign settings
- `GET /api/campaigns/{campaign_id}/ads-metrics` - Get ad metrics

### Required Data Structure
```json
{
  "id": 1,
  "provider": "google_ads",
  "name": "Google Ads Account",
  "account_id": "123-456-7890",
  "is_active": true,
  "connected_at": "2024-01-15T10:30:00Z",
  "last_sync": "2024-01-20T14:00:00Z",
  "spend": 12500,
  "impressions": 125000,
  "clicks": 2500,
  "conversions": 45
}
```

## 4. Events Management APIs

### Event Management
- `GET /api/events?status={upcoming|completed}&type={webinar|demo|...}&page={n}` - Get events
- `GET /api/events/types` - Get event types
- `GET /api/events/rsvp-statuses` - Get RSVP statuses
- `POST /api/events` - Create event
- `GET /api/events/{id}` - Get event details
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event
- `POST /api/events/{id}/attendees` - Add RSVP
- `GET /api/events/{id}/attendees?rsvp_status=going` - Get attendees
- `POST /api/events/{id}/attendees/{attendee_id}/attended` - Mark attended

### Required Data Structure
```json
{
  "id": 1,
  "name": "Q4 Product Launch Webinar",
  "description": "Join us for an exclusive look at our latest product features",
  "type": "webinar",
  "status": "upcoming",
  "scheduled_at": "2024-12-15T14:00:00Z",
  "duration": 60,
  "location": "Virtual",
  "max_attendees": 200,
  "rsvp_going": 127,
  "rsvp_interested": 23,
  "rsvp_declined": 8,
  "attended": 0,
  "created_at": "2024-11-01T10:30:00Z",
  "created_by": { "id": 1, "name": "John Smith" }
}
```

## 5. Buyer Intent APIs

### Intent Tracking
- `GET /api/tracking/actions` - Get tracking actions
- `GET /api/tracking/intent-levels` - Get intent levels
- `POST /api/tracking/events` - Log tracking event
- `GET /api/tracking/intent?company_id=&contact_id=&page_url=&action=&intent_level=&min_score=&date_from=&date_to=&sort_by=score&sort_order=desc&page={n}` - Get intent data
- `GET /api/tracking/analytics?date_from=&date_to=` - Get intent analytics

### Required Data Structure
```json
{
  "id": 1,
  "contact_id": 101,
  "company_id": 201,
  "page_url": "/pricing",
  "action": "page_view",
  "score": 85,
  "intent_level": "high",
  "timestamp": "2024-01-20T14:30:00Z",
  "contact": { "id": 101, "name": "John Smith", "email": "john@example.com" },
  "company": { "id": 201, "name": "Tech Corp" }
}
```

## 6. Lead Scoring APIs

### Scoring Rules Management
- `GET /api/lead-scoring/event-types` - Get event types
- `GET /api/lead-scoring/operators` - Get operators
- `GET /api/lead-scoring/rules?is_active=true|false&page={n}` - Get scoring rules
- `POST /api/lead-scoring/rules` - Create scoring rule
- `PUT /api/lead-scoring/rules/{id}` - Update scoring rule
- `DELETE /api/lead-scoring/rules/{id}` - Delete scoring rule
- `POST /api/lead-scoring/recalculate/{contact_id}` - Recalculate score
- `GET /api/lead-scoring/stats` - Get scoring statistics
- `GET /api/lead-scoring/top-contacts?limit=10` - Get top scoring contacts

### Required Data Structure
```json
{
  "id": 1,
  "name": "Email Engagement Rule",
  "points": 10,
  "priority": 1,
  "is_active": true,
  "condition": {
    "event_type": "email_click",
    "operator": "greater_than",
    "value": 3
  },
  "updated_at": "2024-01-20T10:30:00Z"
}
```

## 7. Journeys APIs

### Journey Management
- `GET /api/journeys/statuses` - Get journey statuses
- `GET /api/journeys/step-types` - Get step types
- `GET /api/journeys/step-schema?step_type={type}` - Get step schema
- `GET /api/journeys?status=&page={n}` - Get journeys
- `POST /api/journeys` - Create journey
- `GET /api/journeys/{id}` - Get journey details
- `PUT /api/journeys/{id}` - Update journey
- `DELETE /api/journeys/{id}` - Delete journey
- `POST /api/journeys/{journey_id}/run/{contact_id}` - Run journey on contact
- `GET /api/journeys/{journey_id}/executions?status=running` - Get journey executions

### Required Data Structure
```json
{
  "id": 1,
  "name": "Welcome Series",
  "description": "New contact welcome journey",
  "status": "active",
  "steps_count": 5,
  "participants": 567,
  "created_at": "2024-01-15T10:30:00Z",
  "created_by": { "id": 1, "name": "John Smith" },
  "steps": [
    {
      "id": 1,
      "type": "email",
      "name": "Welcome Email",
      "order": 1,
      "config": { "template_id": 1, "delay": 0 }
    }
  ]
}
```

## 8. Forecasting APIs

### Forecast Data
- `GET /api/forecast?timeframe={monthly|quarterly|yearly}&include_trends=true&include_pipeline_breakdown=true&include_accuracy=true` - Get forecast data
- `GET /api/forecast/trends?months=6` - Get forecast trends
- `GET /api/forecast/by-pipeline?timeframe=monthly` - Get pipeline breakdown
- `GET /api/forecast/accuracy?months=3` - Get forecast accuracy
- `GET /api/forecast/timeframes` - Get available timeframes

### Required Data Structure
```json
{
  "projected_value": 2400000,
  "probability_weighted": 1800000,
  "forecast_accuracy": 87.5,
  "active_deals": 89,
  "pipeline_breakdown": [
    { "stage": "Prospecting", "value": 450000, "count": 23 },
    { "stage": "Qualification", "value": 380000, "count": 18 },
    { "stage": "Proposal", "value": 620000, "count": 15 },
    { "stage": "Negotiation", "value": 480000, "count": 12 },
    { "stage": "Closed Won", "value": 470000, "count": 21 }
  ],
  "trends": {
    "projected_value_trend": "+15%",
    "probability_weighted_trend": "+12%",
    "accuracy_trend": "+3%",
    "active_deals_trend": "+8"
  }
}
```

## 9. Meetings APIs

### Meeting Management
- `GET /api/meetings/statuses` - Get meeting statuses
- `GET /api/meetings/providers` - Get meeting providers
- `GET /api/meetings?status=&provider=&user_id=&contact_id=&start_date=&end_date=&upcoming=&per_page=15&page={n}` - Get meetings
- `POST /api/meetings` - Create meeting
- `POST /api/meetings/sync/google` - Sync Google Calendar
- `POST /api/meetings/sync/outlook` - Sync Outlook Calendar

### Required Data Structure
```json
{
  "id": 1,
  "title": "Product Demo with John Smith",
  "description": "Demonstrate new features of the CRM",
  "start_time": "2024-12-01T10:00:00Z",
  "end_time": "2024-12-01T10:30:00Z",
  "duration": 30,
  "status": "scheduled",
  "provider": "google",
  "meeting_link": "https://meet.google.com/abc-defg-hij",
  "contact": { "id": 101, "name": "John Smith", "email": "john@example.com" },
  "created_by": { "id": 1, "name": "Current User" }
}
```

## 10. Metadata APIs (Already Exists)

### Existing APIs (No changes needed)
- `GET /api/metadata/owners` - Get owners
- `GET /api/metadata/industries` - Get industries
- `GET /api/metadata/company-types` - Get company types
- `GET /api/metadata/lead-sources` - Get lead sources
- `GET /api/metadata/contact-types` - Get contact types

## Implementation Priority

### Phase 1 (Critical - Core Functionality)
1. **Analytics APIs** - Dashboard and module-specific data
2. **Email Marketing APIs** - Campaign management and metrics
3. **Events APIs** - Event management and RSVP tracking

### Phase 2 (Important - Advanced Features)
4. **Ads Management APIs** - Ad account integration
5. **Buyer Intent APIs** - Intent tracking and analytics
6. **Lead Scoring APIs** - Scoring rules and statistics

### Phase 3 (Enhancement - Advanced Automation)
7. **Journeys APIs** - Marketing automation
8. **Forecasting APIs** - Sales forecasting
9. **Meetings APIs** - Meeting scheduling and sync

## Authentication & Authorization

All APIs should:
- Require authentication (JWT token)
- Support tenant isolation
- Include proper error handling
- Return consistent response formats
- Support pagination where applicable
- Include rate limiting

## Response Format

All APIs should return data in this format:
```json
{
  "data": { /* actual data */ },
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75,
    "from": 1,
    "to": 15
  }
}
```

## Error Handling

All APIs should return errors in this format:
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { /* additional error details */ }
  }
}
```

This comprehensive API specification will enable 100% functionality of the Marketing module with real backend data instead of fallback data.

