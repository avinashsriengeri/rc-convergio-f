# 🚀 RC Convergio Journey Module - Complete API Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Authentication APIs](#authentication-apis)
3. [Contact Journey APIs](#contact-journey-apis)
4. [User Management APIs](#user-management-apis)
5. [Feature Management APIs](#feature-management-apis)
6. [Automation Flows](#automation-flows)
7. [Business Process APIs](#business-process-apis)
8. [Error Handling](#error-handling)
9. [Response Formats](#response-formats)

---

## 🎯 Overview

The Journey Module provides comprehensive APIs for tracking customer journeys through the complete business process from lead generation to deal closure. It includes automation triggers, email campaigns, deal management, and analytics.

### Base URL
```
http://127.0.0.1:8000/api
```

### Authentication
All APIs use Bearer token authentication:
```
Authorization: Bearer {access_token}
```

---

## 🔐 Authentication APIs

### 1. User Login
**Endpoint:** `POST /api/auth/login`

**Purpose:** Authenticate users and generate access tokens

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Demo User",
      "email": "user@example.com",
      "email_verified_at": "2025-10-01T21:51:50+02:00",
      "created_at": "2025-10-01T21:51:50+02:00",
      "updated_at": "2025-10-01T21:51:50+02:00"
    },
    "access_token": "eeb116b9eb334772019f3186d0c1a5e1b52869093f0429296007ab22cdee",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

**Automation Triggers:**
- ✅ User session creation
- ✅ Activity logging
- ✅ Permission validation

---

## 👤 User Management APIs

### 2. Get Current User
**Endpoint:** `GET /api/users/me`

**Purpose:** Retrieve current authenticated user information

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Demo User",
    "email": "demo@example.com",
    "email_verified_at": "2025-10-01T21:51:50+02:00",
    "created_at": "2025-10-01T21:51:50+02:00",
    "updated_at": "2025-10-01T21:51:50+02:00",
    "organization_name": "RC Demo Organization"
  }
}
```

**Automation Triggers:**
- ✅ User activity tracking
- ✅ Session validation
- ✅ Permission checks

---

## ⚙️ Feature Management APIs

### 3. Get Feature Status
**Endpoint:** `GET /api/features/status`

**Purpose:** Retrieve feature flags and user permissions

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "feature": "manage_users",
      "enabled": true,
      "restrictions": {
        "roles": ["admin"]
      }
    },
    {
      "feature": "manage_campaigns",
      "enabled": true,
      "restrictions": {
        "roles": ["admin", "manager"]
      }
    },
    {
      "feature": "export_data",
      "enabled": true,
      "restrictions": {
        "roles": ["admin", "manager"]
      }
    },
    {
      "feature": "bulk_operations",
      "enabled": true,
      "restrictions": {
        "roles": ["admin", "manager"]
      }
    },
    {
      "feature": "system_settings",
      "enabled": true,
      "restrictions": {
        "roles": ["admin"]
      }
    },
    {
      "feature": "advanced_analytics",
      "enabled": true,
      "restrictions": {
        "roles": ["admin", "manager"]
      }
    }
  ]
}
```

**Automation Triggers:**
- ✅ UI component rendering
- ✅ Permission-based access control
- ✅ Feature availability checks

---

## 📊 Contact Journey APIs

### 4. Get Contact Journey by Email
**Endpoint:** `GET /api/contacts/journey/{email}`

**Purpose:** Retrieve complete journey data for a contact by email

**Parameters:**
- `email` (string): Contact email address (URL encoded)

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "contact": {
      "id": 123,
      "name": "Ashok Kumar",
      "email": "ashok@reliance.in",
      "phone": "+91-9876543210",
      "company": "Reliance Industries",
      "status": "customer",
      "last_activity": "2025-10-03T05:20:39+00:00",
      "source": "website",
      "created_at": "2025-09-29T02:32:52+00:00",
      "updated_at": "2025-10-03T05:20:39+00:00"
    },
    "events": [
      {
        "id": 7,
        "type": "email",
        "message": "Welcome email sent successfully",
        "details": "Enterprise welcome email sent as part of onboarding journey",
        "metadata": {
          "journey_id": 4,
          "step_id": 1,
          "template": "enterprise_welcome",
          "sent_at": "2025-10-03T05:20:39.097335Z"
        },
        "created_at": "2025-10-03T05:20:39+00:00"
      },
      {
        "id": 8,
        "type": "task",
        "message": "Discovery call task created",
        "details": "Task created to schedule discovery call with Ashok Ambani from Reliance Industries",
        "metadata": {
          "journey_id": 4,
          "step_id": 3,
          "task_title": "Schedule Discovery Call with Ashok Ambani",
          "priority": "high",
          "assigned_to": 41
        },
        "created_at": "2025-10-03T05:20:39+00:00"
      },
      {
        "id": 6,
        "type": "email",
        "message": "Welcome email sent and opened",
        "details": "Welcome email was sent and opened by the contact",
        "metadata": {
          "campaign": "welcome_enterprise",
          "opened": true,
          "opened_at": "2025-10-02T17:16:16.769956Z",
          "clicked": true
        },
        "created_at": "2025-10-02T17:16:16+00:00"
      },
      {
        "id": 5,
        "type": "form_submission",
        "message": "Submitted enterprise inquiry form",
        "details": "Ashok submitted an inquiry form for enterprise solutions",
        "metadata": {
          "form_name": "Enterprise Inquiry",
          "company": "Reliance Industries",
          "requirements": "Large scale deployment"
        },
        "created_at": "2025-10-02T05:16:16+00:00"
      }
    ],
    "metrics": {
      "total_interactions": 4,
      "email_open_rate": 0,
      "email_click_rate": 0,
      "last_activity": "2025-10-03T05:20:39+00:00",
      "interactions_by_type": {
        "form_submission": 1,
        "email": 2,
        "task": 1
      }
    },
    "recentActivities": [
      {
        "id": 7,
        "type": "email",
        "message": "Welcome email sent successfully",
        "details": "Enterprise welcome email sent as part of onboarding journey",
        "metadata": {
          "journey_id": 4,
          "step_id": 1,
          "template": "enterprise_welcome",
          "sent_at": "2025-10-03T05:20:39.097335Z"
        },
        "created_at": "2025-10-03T05:20:39+00:00"
      }
    ]
  }
}
```

**Automation Triggers:**
- ✅ Journey analytics update
- ✅ Contact engagement scoring
- ✅ Next action recommendations
- ✅ Drop-off point analysis

### 5. Get Contact Journey by ID
**Endpoint:** `GET /api/contacts/{id}/journey`

**Purpose:** Retrieve journey data for a contact by ID

**Parameters:**
- `id` (integer): Contact ID

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "contact": {
      "id": 123,
      "name": "Demo Contact #123",
      "email": "contact123@example.com",
      "phone": "+1 (555) 123-0123",
      "company": "Demo Company #123",
      "status": "lead",
      "last_activity": "2025-10-01T21:51:50+02:00",
      "source": "website",
      "created_at": "2025-09-01T21:51:50+02:00",
      "updated_at": "2025-10-01T21:51:50+02:00"
    },
    "events": [
      {
        "id": 1,
        "type": "created",
        "message": "Contact created from website form",
        "details": "Initial contact registration",
        "timestamp": "2025-09-01T21:51:50+02:00"
      },
      {
        "id": 2,
        "type": "email_sent",
        "message": "Welcome email sent",
        "details": "Automated welcome sequence",
        "timestamp": "2025-09-02T21:51:50+02:00"
      },
      {
        "id": 3,
        "type": "email_opened",
        "message": "Welcome email opened",
        "details": "Email opened on mobile device",
        "timestamp": "2025-09-03T21:51:50+02:00"
      }
    ],
    "metrics": {
      "totalInteractions": 3,
      "emailsSent": 1,
      "emailsOpened": 1,
      "emailsClicked": 0,
      "emailOpenRate": 100,
      "clickThroughRate": 0,
      "lastActive": "2025-09-03T21:51:50+02:00"
    },
    "activities": [
      {
        "id": 1,
        "type": "email",
        "title": "Email Opened",
        "description": "Welcome email opened on mobile device",
        "timestamp": "2025-09-03T21:51:50+02:00",
        "metadata": []
      }
    ]
  }
}
```

**Automation Triggers:**
- ✅ Contact activity logging
- ✅ Journey stage progression
- ✅ Performance metrics calculation

---

## 🤖 Automation Flows

### 1. Lead Generation Automation

#### Form Submission Trigger
```json
{
  "trigger": "form_submission",
  "conditions": {
    "form_type": "contact_inquiry",
    "required_fields": ["name", "email", "company"]
  },
  "actions": [
    {
      "type": "create_contact",
      "data": {
        "name": "{form.name}",
        "email": "{form.email}",
        "company": "{form.company}",
        "source": "website_form"
      }
    },
    {
      "type": "create_company",
      "data": {
        "name": "{form.company}",
        "contact_id": "{created_contact.id}"
      }
    },
    {
      "type": "log_event",
      "event": {
        "type": "form_submission",
        "message": "Contact inquiry form submitted",
        "metadata": {
          "form_name": "Contact Inquiry",
          "source": "website"
        }
      }
    },
    {
      "type": "trigger_email_campaign",
      "campaign": "welcome_sequence",
      "delay": "immediate"
    }
  ]
}
```

#### Buyer Intent Trigger
```json
{
  "trigger": "buyer_intent_detected",
  "conditions": {
    "intent_score": "> 0.7",
    "company_domain": "valid"
  },
  "actions": [
    {
      "type": "create_contact",
      "data": {
        "name": "{intent.name}",
        "email": "{intent.email}",
        "company": "{intent.company}",
        "source": "buyer_intent"
      }
    },
    {
      "type": "log_event",
      "event": {
        "type": "buyer_intent",
        "message": "High-intent prospect identified",
        "metadata": {
          "intent_score": "{intent.score}",
          "intent_signals": "{intent.signals}"
        }
      }
    },
    {
      "type": "assign_priority",
      "priority": "high"
    }
  ]
}
```

### 2. Email Campaign Automation

#### Welcome Email Sequence
```json
{
  "trigger": "contact_created",
  "conditions": {
    "source": ["website_form", "buyer_intent"],
    "email_verified": true
  },
  "actions": [
    {
      "type": "send_email",
      "template": "welcome_enterprise",
      "recipient": "{contact.email}",
      "personalization": {
        "contact_name": "{contact.name}",
        "company_name": "{contact.company}"
      }
    },
    {
      "type": "log_event",
      "event": {
        "type": "email_sent",
        "message": "Welcome email sent successfully",
        "metadata": {
          "template": "welcome_enterprise",
          "campaign": "welcome_sequence"
        }
      }
    },
    {
      "type": "schedule_followup",
      "delay": "3 days",
      "action": "send_followup_email"
    }
  ]
}
```

#### Email Engagement Tracking
```json
{
  "trigger": "email_opened",
  "conditions": {
    "email_type": "welcome_sequence"
  },
  "actions": [
    {
      "type": "log_event",
      "event": {
        "type": "email_opened",
        "message": "Welcome email opened",
        "metadata": {
          "opened_at": "{timestamp}",
          "device": "{user_agent}",
          "location": "{ip_location}"
        }
      }
    },
    {
      "type": "update_engagement_score",
      "score_increase": 10
    },
    {
      "type": "trigger_next_action",
      "action": "schedule_demo_call"
    }
  ]
}
```

#### Email Click Tracking
```json
{
  "trigger": "email_clicked",
  "conditions": {
    "link_type": "cta_button"
  },
  "actions": [
    {
      "type": "log_event",
      "event": {
        "type": "email_clicked",
        "message": "Clicked demo booking link",
        "metadata": {
          "clicked_at": "{timestamp}",
          "link_url": "{clicked_url}",
          "link_text": "{link_text}"
        }
      }
    },
    {
      "type": "update_engagement_score",
      "score_increase": 25
    },
    {
      "type": "create_task",
      "task": {
        "title": "Follow up with high-engagement lead",
        "priority": "high",
        "assigned_to": "sales_team"
      }
    }
  ]
}
```

### 3. Deal Management Automation

#### Deal Creation Trigger
```json
{
  "trigger": "deal_created",
  "conditions": {
    "contact_engagement_score": "> 50",
    "contact_status": "qualified"
  },
  "actions": [
    {
      "type": "log_event",
      "event": {
        "type": "deal_created",
        "message": "Deal proposal created for qualified lead",
        "metadata": {
          "deal_value": "{deal.amount}",
          "deal_stage": "proposal",
          "probability": "{deal.probability}"
        }
      }
    },
    {
      "type": "send_email",
      "template": "deal_proposal",
      "recipient": "{contact.email}",
      "attachments": ["proposal.pdf"]
    },
    {
      "type": "create_task",
      "task": {
        "title": "Follow up on deal proposal",
        "due_date": "+7 days",
        "assigned_to": "sales_rep"
      }
    }
  ]
}
```

#### Deal Status Updates
```json
{
  "trigger": "deal_status_changed",
  "conditions": {
    "new_status": ["won", "lost", "in_progress"]
  },
  "actions": [
    {
      "type": "log_event",
      "event": {
        "type": "deal_status_update",
        "message": "Deal status updated to {new_status}",
        "metadata": {
          "old_status": "{old_status}",
          "new_status": "{new_status}",
          "deal_value": "{deal.amount}",
          "reason": "{status_reason}"
        }
      }
    },
    {
      "type": "update_contact_status",
      "status": "{new_status === 'won' ? 'customer' : 'lead'}"
    },
    {
      "type": "trigger_celebration",
      "condition": "new_status === 'won'",
      "action": "send_celebration_email"
    }
  ]
}
```

### 4. Company Creation Automation

#### Company Setup Trigger
```json
{
  "trigger": "company_created",
  "conditions": {
    "contact_status": "customer",
    "deal_status": "won"
  },
  "actions": [
    {
      "type": "log_event",
      "event": {
        "type": "company_created",
        "message": "Company entity created for new customer",
        "metadata": {
          "company_name": "{company.name}",
          "registration_number": "{company.reg_number}",
          "legal_entity_type": "{company.entity_type}"
        }
      }
    },
    {
      "type": "send_email",
      "template": "company_welcome",
      "recipient": "{contact.email}",
      "attachments": ["company_documents.pdf"]
    },
    {
      "type": "create_onboarding_tasks",
      "tasks": [
        "Setup company account",
        "Configure billing",
        "Schedule training session"
      ]
    }
  ]
}
```

---

## 📈 Business Process APIs

### 6. Journey Analytics
**Endpoint:** `GET /api/journey/analytics`

**Purpose:** Get comprehensive journey analytics and insights

**Query Parameters:**
- `date_from` (optional): Start date (ISO 8601)
- `date_to` (optional): End date (ISO 8601)
- `stage` (optional): Specific journey stage
- `company_id` (optional): Filter by company

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_contacts": 1250,
      "active_journeys": 890,
      "completed_journeys": 360,
      "conversion_rate": 28.8
    },
    "stage_analytics": {
      "lead_generation": {
        "total": 1250,
        "completed": 1200,
        "success_rate": 96.0,
        "avg_time_to_complete": "2 hours"
      },
      "email_campaign": {
        "total": 1200,
        "completed": 980,
        "success_rate": 81.7,
        "avg_time_to_complete": "3 days"
      },
      "deal_proposal": {
        "total": 980,
        "completed": 450,
        "success_rate": 45.9,
        "avg_time_to_complete": "7 days"
      },
      "company_creation": {
        "total": 450,
        "completed": 360,
        "success_rate": 80.0,
        "avg_time_to_complete": "5 days"
      },
      "deal_closure": {
        "total": 360,
        "completed": 360,
        "success_rate": 100.0,
        "avg_time_to_complete": "14 days"
      }
    },
    "drop_off_analysis": {
      "email_campaign": {
        "drop_off_count": 220,
        "drop_off_rate": 18.3,
        "common_reasons": [
          "Email not opened",
          "Unsubscribed",
          "Invalid email"
        ]
      },
      "deal_proposal": {
        "drop_off_count": 530,
        "drop_off_rate": 54.1,
        "common_reasons": [
          "No response to proposal",
          "Budget constraints",
          "Competitor chosen"
        ]
      }
    },
    "top_performing_campaigns": [
      {
        "campaign_name": "Enterprise Welcome",
        "open_rate": 85.2,
        "click_rate": 42.1,
        "conversion_rate": 28.5
      }
    ]
  }
}
```

### 7. Journey Stage Management
**Endpoint:** `POST /api/journey/stages/{stage}/complete`

**Purpose:** Mark a journey stage as completed

**Parameters:**
- `stage` (string): Journey stage name
- `contact_id` (integer): Contact ID

**Request Body:**
```json
{
  "contact_id": 123,
  "completion_data": {
    "completed_at": "2025-10-03T05:20:39+00:00",
    "completion_notes": "Stage completed successfully",
    "metadata": {
      "additional_info": "Any additional data"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Stage completed successfully",
  "data": {
    "stage": "email_campaign",
    "contact_id": 123,
    "completed_at": "2025-10-03T05:20:39+00:00",
    "next_stage": "deal_proposal",
    "automated_actions_triggered": [
      "Deal proposal email sent",
      "Sales task created",
      "Follow-up scheduled"
    ]
  }
}
```

---

## 🚨 Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  },
  "timestamp": "2025-10-03T05:20:39+00:00",
  "request_id": "req_123456789"
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2025-10-03T05:20:39+00:00",
    "version": "1.0.0"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 100,
      "last_page": 5,
      "has_more": true
    }
  }
}
```

---

## 🔄 Automation Workflow Summary

### Complete Business Journey Flow:

1. **Lead Generation** → Contact created via form/buyer intent
2. **Email Campaign** → Welcome emails and follow-ups sent
3. **Deal Proposal** → Business offers and proposals created
4. **Company Creation** → Business entity setup
5. **Deal Closure** → Final outcome (won/lost)

### Automation Triggers:
- ✅ Form submissions
- ✅ Email interactions
- ✅ Deal status changes
- ✅ Company creation
- ✅ Task completions
- ✅ User actions

### Real-time Updates:
- ✅ Journey progress tracking
- ✅ Engagement scoring
- ✅ Drop-off detection
- ✅ Performance analytics
- ✅ Automated follow-ups

---

## 🚀 Getting Started

1. **Authenticate** using `/api/auth/login`
2. **Get user info** from `/api/users/me`
3. **Check features** via `/api/features/status`
4. **Track journeys** with `/api/contacts/journey/{email}`
5. **Monitor analytics** through `/api/journey/analytics`

This comprehensive API system provides complete automation and tracking for your customer journey management! 🎊







