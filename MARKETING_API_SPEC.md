# Marketing Module - Backend API Specification

## Quick Reference - All Endpoints

### 1. Analytics APIs
```
GET /api/analytics/modules
GET /api/analytics/periods  
GET /api/analytics/dashboard?period=month
GET /api/analytics/{module}?period=month
```

### 2. Email Marketing APIs
```
GET /api/campaigns?type=email&per_page=15&page=1
GET /api/campaigns/{id}
GET /api/campaigns/{id}/recipients
GET /api/campaigns/{id}/metrics
POST /api/campaigns
POST /api/campaigns/{id}/schedule
GET /api/campaigns/templates
```

### 3. Ads Management APIs
```
GET /api/ad-accounts/providers
GET /api/ad-accounts
POST /api/ad-accounts
PUT /api/ad-accounts/{id}
DELETE /api/ad-accounts/{id}
POST /api/campaigns/{id}/ads
GET /api/campaigns/{id}/ads-metrics
```

### 4. Events APIs
```
GET /api/events?status=upcoming&page=1
GET /api/events/types
GET /api/events/rsvp-statuses
POST /api/events
GET /api/events/{id}
PUT /api/events/{id}
DELETE /api/events/{id}
POST /api/events/{id}/attendees
GET /api/events/{id}/attendees
POST /api/events/{id}/attendees/{attendee_id}/attended
```

### 5. Buyer Intent APIs
```
GET /api/tracking/actions
GET /api/tracking/intent-levels
POST /api/tracking/events
GET /api/tracking/intent?page=1
GET /api/tracking/analytics
```

### 6. Lead Scoring APIs
```
GET /api/lead-scoring/event-types
GET /api/lead-scoring/operators
GET /api/lead-scoring/rules?page=1
POST /api/lead-scoring/rules
PUT /api/lead-scoring/rules/{id}
DELETE /api/lead-scoring/rules/{id}
POST /api/lead-scoring/recalculate/{contact_id}
GET /api/lead-scoring/stats
GET /api/lead-scoring/top-contacts
```

### 7. Journeys APIs
```
GET /api/journeys/statuses
GET /api/journeys/step-types
GET /api/journeys/step-schema?step_type=email
GET /api/journeys?page=1
POST /api/journeys
GET /api/journeys/{id}
PUT /api/journeys/{id}
DELETE /api/journeys/{id}
POST /api/journeys/{id}/run/{contact_id}
GET /api/journeys/{id}/executions
```

### 8. Forecasting APIs
```
GET /api/forecast?timeframe=monthly
GET /api/forecast/trends?months=6
GET /api/forecast/by-pipeline?timeframe=monthly
GET /api/forecast/accuracy?months=3
GET /api/forecast/timeframes
```

### 9. Meetings APIs
```
GET /api/meetings/statuses
GET /api/meetings/providers
GET /api/meetings?page=1
POST /api/meetings
POST /api/meetings/sync/google
POST /api/meetings/sync/outlook
```

## Detailed API Examples

### Analytics Dashboard
```http
GET /api/analytics/dashboard?period=month
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "data": {
    "contacts": {"total": 1247, "new": 89, "growth": 12.5, "trend": "up"},
    "deals": {"total": 156, "new": 23, "value": 2840000, "growth": 8.3, "trend": "up"},
    "campaigns": {"total": 45, "active": 12, "sent": 33, "growth": 15.2, "trend": "up"},
    "ads": {"total": 8, "active": 5, "spend": 12500, "impressions": 125000, "growth": 22.1, "trend": "up"},
    "events": {"total": 18, "upcoming": 6, "attendees": 234, "growth": 5.7, "trend": "up"},
    "meetings": {"total": 67, "scheduled": 12, "completed": 55, "growth": 18.9, "trend": "up"},
    "tasks": {"total": 234, "completed": 189, "pending": 45, "growth": 3.2, "trend": "up"},
    "companies": {"total": 89, "new": 12, "growth": 7.8, "trend": "up"},
    "forecast": {"projected": 3200000, "probability_weighted": 2560000, "accuracy": 87.5, "growth": 11.2, "trend": "up"},
    "lead_scoring": {"total_leads": 456, "qualified": 123, "avg_score": 78.5, "growth": 9.4, "trend": "up"},
    "journeys": {"total": 15, "active": 8, "completed": 7, "participants": 567, "growth": 13.6, "trend": "up"},
    "visitor_intent": {"total_visitors": 2341, "high_intent": 234, "medium_intent": 567, "low_intent": 1540, "growth": 16.8, "trend": "up"}
  }
}
```

### Email Campaigns
```http
GET /api/campaigns?type=email&per_page=15&page=1
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "data": [
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
      "owner": {"id": 1, "name": "John Smith"},
      "template": {"id": 1, "name": "Product Launch"}
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 15,
    "total": 45,
    "from": 1,
    "to": 15
  }
}
```

### Create Campaign
```http
POST /api/campaigns
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "New Campaign",
  "subject": "Campaign Subject",
  "template_id": 1,
  "recipient_list_id": 1,
  "scheduled_at": "2024-12-01T10:00:00Z"
}
```

### Events List
```http
GET /api/events?status=upcoming&page=1
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "data": [
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
      "created_by": {"id": 1, "name": "John Smith"}
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 2,
    "per_page": 15,
    "total": 18,
    "from": 1,
    "to": 15
  }
}
```

### Create Event
```http
POST /api/events
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "New Webinar",
  "description": "Event description",
  "type": "webinar",
  "scheduled_at": "2024-12-20T14:00:00Z",
  "duration": 60,
  "location": "Virtual",
  "max_attendees": 100
}
```

### Ad Accounts
```http
GET /api/ad-accounts
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "data": [
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
  ]
}
```

### Connect Ad Account
```http
POST /api/ad-accounts
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "provider": "google_ads",
  "account_id": "123-456-7890",
  "access_token": "ya29.a0AfH6SMC...",
  "refresh_token": "1//04..."
}
```

### Buyer Intent Data
```http
GET /api/tracking/intent?page=1&sort_by=score&sort_order=desc
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "contact_id": 101,
      "company_id": 201,
      "page_url": "/pricing",
      "action": "page_view",
      "score": 85,
      "intent_level": "high",
      "timestamp": "2024-01-20T14:30:00Z",
      "contact": {"id": 101, "name": "John Smith", "email": "john@example.com"},
      "company": {"id": 201, "name": "Tech Corp"}
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 20,
    "total": 89,
    "from": 1,
    "to": 20
  }
}
```

### Lead Scoring Rules
```http
GET /api/lead-scoring/rules?page=1
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "data": [
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
  ],
  "meta": {
    "current_page": 1,
    "last_page": 2,
    "per_page": 15,
    "total": 23,
    "from": 1,
    "to": 15
  }
}
```

### Create Lead Scoring Rule
```http
POST /api/lead-scoring/rules
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "New Scoring Rule",
  "points": 15,
  "priority": 1,
  "is_active": true,
  "condition": {
    "event_type": "form_submit",
    "operator": "equals",
    "value": "demo_request"
  }
}
```

### Journeys
```http
GET /api/journeys?page=1
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Welcome Series",
      "description": "New contact welcome journey",
      "status": "active",
      "steps_count": 5,
      "participants": 567,
      "created_at": "2024-01-15T10:30:00Z",
      "created_by": {"id": 1, "name": "John Smith"},
      "steps": [
        {
          "id": 1,
          "type": "email",
          "name": "Welcome Email",
          "order": 1,
          "config": {"template_id": 1, "delay": 0}
        }
      ]
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 2,
    "per_page": 15,
    "total": 15,
    "from": 1,
    "to": 15
  }
}
```

### Create Journey
```http
POST /api/journeys
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "New Journey",
  "description": "Journey description",
  "status": "active",
  "steps": [
    {
      "type": "email",
      "name": "Welcome Email",
      "order": 1,
      "config": {"template_id": 1, "delay": 0}
    },
    {
      "type": "wait",
      "name": "Wait 3 days",
      "order": 2,
      "config": {"duration": 3, "unit": "days"}
    }
  ]
}
```

### Forecasting Data
```http
GET /api/forecast?timeframe=monthly
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "data": {
    "projected_value": 2400000,
    "probability_weighted": 1800000,
    "forecast_accuracy": 87.5,
    "active_deals": 89,
    "pipeline_breakdown": [
      {"stage": "Prospecting", "value": 450000, "count": 23},
      {"stage": "Qualification", "value": 380000, "count": 18},
      {"stage": "Proposal", "value": 620000, "count": 15},
      {"stage": "Negotiation", "value": 480000, "count": 12},
      {"stage": "Closed Won", "value": 470000, "count": 21}
    ],
    "trends": {
      "projected_value_trend": "+15%",
      "probability_weighted_trend": "+12%",
      "accuracy_trend": "+3%",
      "active_deals_trend": "+8"
    }
  }
}
```

### Meetings
```http
GET /api/meetings?page=1
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "data": [
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
      "contact": {"id": 101, "name": "John Smith", "email": "john@example.com"},
      "created_by": {"id": 1, "name": "Current User"}
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 67,
    "from": 1,
    "to": 15
  }
}
```

### Create Meeting
```http
POST /api/meetings
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "title": "New Meeting",
  "description": "Meeting description",
  "start_time": "2024-12-01T10:00:00Z",
  "end_time": "2024-12-01T10:30:00Z",
  "contact_id": 101,
  "provider": "google",
  "meeting_link": "https://meet.google.com/xyz-abc-123"
}
```

## Authentication
All endpoints require:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

## Error Response Format
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Common Query Parameters
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 15)
- `sort_by` - Sort field
- `sort_order` - Sort direction (asc/desc)
- `status` - Filter by status
- `type` - Filter by type
- `date_from` - Start date filter
- `date_to` - End date filter

## Implementation Notes
1. All endpoints support pagination
2. Use JWT tokens for authentication
3. Implement tenant isolation
4. Return consistent response format
5. Include proper error handling
6. Support filtering and sorting
7. Use UTC timestamps
8. Implement rate limiting

