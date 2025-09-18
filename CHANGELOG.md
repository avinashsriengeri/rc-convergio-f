# Changelog

## [Latest] - 2025-01-16

### UI Enhancement
- **Email Performance Trends Chart**: Polished Email Performance Trends chart with improved design, tooltips, and responsive layout
  - Redesigned chart layout with grouped bars and proper spacing
  - Added professional color scheme (Sent: Blue, Delivered: Green, Opens: Amber, Clicks: Purple, Bounces: Red)
  - Implemented hover tooltips showing exact values for each metric
  - Enhanced responsive design for mobile and desktop
  - Added axis titles ("Count" for Y-axis, "Date" for X-axis)
  - Improved loading, error, and empty states with professional styling
  - Enhanced filter dropdowns with labels and better accessibility
  - Polished summary statistics with gradient backgrounds and hover effects

### Bug Fixes
- **Email Metrics**: Fixed NaN% values in campaign metrics by correcting field names in helper functions
- **Test Campaign**: Fixed test campaign payload format from {email: "value"} to {test_emails: ["value"]}
- **Trends Chart**: Fixed console errors and safe data handling for Email Performance Trends chart
- **Email Tracking**: Corrected Email Tracking API calls to use /api/public/* endpoints and proper backend base URL
- **Email Open Tracking**: Fixed Email Open Tracking integration to include required recipient_id parameter
- **Email Opens Button**: Fixed Email Opens button functionality to properly load tracking data
- **Campaign-Level Tracking**: Updated Email Tracking to use new campaign-level reporting endpoints
- **Campaign Selector**: Added campaign selector dropdown to Email Tracking tab for proper campaign selection
- **Tracking Isolation**: Fixed campaign selection in Email Tracking tab to prevent unwanted drawer opening
- **Professional Tracking Table**: Updated Email Tracking table to show professional columns with device info, location, and tooltips
- **Create Automation Fix**: Fixed Create Automation button to require campaign selection and use correct API endpoint
- **Email Automations UI/UX Upgrade**: Upgraded Email Automations tab to professional HubSpot-style automation builder with dynamic UI rules, toggle switches, and execution logs
- **Email Template Dropdown Fix**: Fixed Email Template dropdown to fetch real templates from backend API with loading states and proper formatting
- **API Endpoint Fix**: Fixed duplicate /api/ in emailMarketingService endpoints causing 404 errors for templates and automations
- **Email Automation Form Fix**: Fixed Email Automation form validation, submission flow, and error handling for Create Automation modal
- **Email Automation Dropdowns Fix**: Fixed empty dropdowns in Create Automation modal by properly loading automation options and templates when modal opens
- **Email Automation Loading Fix**: Fixed TypeError and infinite loading states by properly handling API response format and ensuring fallback data is always available
- **Email Automation CRUD Fix**: Fixed all automation operations including toggle status, edit, delete, and logs with correct API URLs and proper error handling
- **Email Automation API Endpoints Update**: Updated all automation API endpoints to use correct /api/campaigns/ namespace matching backend campaign_automations table
- **Email Automation API Base URL Fix**: Fixed automation API calls to use backend server (localhost:8000) instead of frontend server (localhost:5173) by creating dedicated automationApi instance
- **Email Automation Environment Integration**: Reverted automationApi hack and properly integrated automations into existing global api axios instance for professional environment-based configuration
- **Email Automation Status Toggle Fix**: Fixed automation status toggle payload to send `is_active` field instead of `active` to match backend validation requirements
- **Email Automation Form Logic Update**: Updated automation form to match new backend flow with conditional campaign selection, campaign metrics display, and updated API payload structure
- **Email Automation Form Fixes**: Fixed template_id handling, campaign dropdown logic, button validation, and campaign metrics display for professional UX
- **Email Automation UX Fixes**: Removed duplicate Create Automation buttons and fixed Contact Created trigger validation to work without requiring campaign selection
- **Email Automation Validation Fix**: Improved error message for campaign selection to clearly guide users to select from the page dropdown
- **Email Automation Backend Rules Compliance**: Fixed automation form to exactly match backend rules - contact_created/form_submitted triggers now work without campaign selection, campaign metrics display for email_opened/link_clicked, removed debug text, ensured numeric template_id submission
- **Email Automation Template ID Fix**: Fixed 422 error "The selected template id is invalid" by ensuring template dropdown binds numeric template.id instead of template name string, added proper validation for template selection
- **Backend API Endpoints Fix**: Added missing /campaigns/templates and /campaigns/{id}/automations endpoints to backend with proper validation and sample template data to resolve template ID validation errors
- **Email Automation Professional Cleanup**: Removed unprofessional hacks including template ID display in UI, debug logging, and fake backend endpoints. Now uses clean UI with template names only and real backend API integration
- **Email Automation Campaign ID Fix**: Fixed "No query results for model [App\\Models\\Campaign]" error by properly handling campaign_id logic - contact_created/form_submitted triggers now send campaign_id: null, while email_opened/link_clicked triggers require and send valid campaign_id

### Features
- **Email Marketing Integration**: Complete integration of all email marketing APIs and UI components
- **Campaign Management**: Added test, preview, archive, restore, bulk operations, and import/export functionality
- **Email Tracking**: Integrated email performance trends with real-time API data

---

## Previous Entries
[Previous changelog entries would go here]
