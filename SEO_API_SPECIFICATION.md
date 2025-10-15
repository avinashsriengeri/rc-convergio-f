# SEO Tools API Specification

This document outlines the required backend API endpoints for the SEO Tools module.

## Base URL
```
/api/seo
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer {access_token}
```

---

## Endpoints

### 1. Get Metrics
**Endpoint**: `GET /api/seo/metrics`

**Query Parameters**:
- `days` (optional): Number of days to fetch data for (default: 30)

**Response**:
```json
{
  "summary": {
    "totalImpressions": 45678,
    "totalClicks": 1234,
    "avgCTR": 0.027,
    "avgPosition": 8.4,
    "lastSynced": "2024-01-15T10:30:00Z"
  },
  "chartData": [
    {
      "date": "2024-01-01",
      "impressions": 1200,
      "clicks": 45,
      "ctr": 0.0375,
      "position": 8.2
    }
    // ... more data points
  ]
}
```

---

### 2. Get Pages
**Endpoint**: `GET /api/seo/pages`

**Response**:
```json
[
  {
    "id": 1,
    "url": "/features/crm",
    "title": "CRM Features - RC Convergio",
    "impressions": 8234,
    "clicks": 456,
    "ctr": 0.055,
    "avgPosition": 4.2,
    "recommendationsCount": 3,
    "lastScanned": "2024-01-15T08:00:00Z"
  }
  // ... more pages
]
```

---

### 3. Get Page Metrics
**Endpoint**: `GET /api/seo/pages/:id/metrics`

**URL Parameters**:
- `id`: Page ID

**Response**:
```json
{
  "url": "/features/crm",
  "title": "CRM Features - RC Convergio",
  "impressions": 8234,
  "clicks": 456,
  "ctr": 0.055,
  "avgPosition": 4.2,
  "chartData": [
    {
      "date": "2024-01-01",
      "impressions": 250,
      "clicks": 15,
      "ctr": 0.06,
      "position": 4.1
    }
    // ... 30 days of data
  ],
  "topQueries": [
    {
      "query": "crm software",
      "impressions": 1200,
      "clicks": 80,
      "ctr": 0.067,
      "position": 3.5
    }
    // ... top 10 queries
  ]
}
```

---

### 4. Scan Page
**Endpoint**: `POST /api/seo/pages/:id/scan`

**URL Parameters**:
- `id`: Page ID

**Response**:
```json
{
  "success": true,
  "message": "Page scan initiated",
  "scanId": "abc123"
}
```

---

### 5. Get Recommendations
**Endpoint**: `GET /api/seo/recommendations`

**Response**:
```json
[
  {
    "id": 1,
    "pageId": 1,
    "pageUrl": "/product-page",
    "type": "title",
    "severity": "high",
    "status": "open",
    "title": "Improve title tag for /product-page – low CTR (1.8%)",
    "description": "The current title tag is not compelling enough. Consider adding power words and benefits to increase click-through rate.",
    "impact": "Improving your title tag could increase CTR by 50-100%, resulting in more organic traffic without improving rankings.",
    "howToFix": "1. Add power words like 'Best', 'Ultimate', 'Complete'\n2. Include primary keyword near the beginning\n3. Add a benefit or unique value proposition\n4. Keep it under 60 characters",
    "createdAt": "2024-01-10T12:00:00Z",
    "resolvedAt": null
  }
  // ... more recommendations
]
```

**Type Values**:
- `meta` - Meta description issues
- `title` - Title tag issues
- `alt` - Image alt text issues
- `heading` - Heading structure issues
- `content` - Content quality issues
- `technical` - Technical SEO issues
- `performance` - Page speed/performance issues

**Severity Values**:
- `critical` - Must be fixed immediately
- `high` - Should be fixed soon
- `medium` - Should be addressed
- `low` - Nice to have

**Status Values**:
- `open` - Not yet addressed
- `resolved` - Fixed by user
- `ignored` - User chose to ignore

---

### 6. Resolve Recommendation
**Endpoint**: `POST /api/seo/recommendations/:id/resolve`

**URL Parameters**:
- `id`: Recommendation ID

**Response**:
```json
{
  "success": true,
  "message": "Recommendation resolved"
}
```

---

### 7. Connect Google Search Console
**Endpoint**: `POST /api/seo/connect`

**Response**:
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...",
  "state": "random_state_token"
}
```

**Implementation Notes**:
- Generate OAuth URL for Google Search Console
- Store state token for validation
- Redirect user to Google OAuth consent screen
- Handle callback at your OAuth callback endpoint
- Store access/refresh tokens securely

---

### 8. Disconnect Google Search Console
**Endpoint**: `POST /api/seo/disconnect`

**Response**:
```json
{
  "success": true,
  "message": "Google Search Console disconnected"
}
```

**Implementation Notes**:
- Revoke OAuth tokens
- Clear stored GSC credentials
- Stop automatic syncing

---

### 9. Get Connection Status
**Endpoint**: `GET /api/seo/connection-status`

**Response** (Connected):
```json
{
  "connected": true,
  "data": {
    "siteUrl": "https://example.com",
    "lastSynced": "2024-01-15T10:30:00Z",
    "dataRange": "Last 90 days"
  }
}
```

**Response** (Not Connected):
```json
{
  "connected": false
}
```

---

### 10. Full Site Scan
**Endpoint**: `POST /api/seo/scan`

**Request Body** (optional):
```json
{
  "depth": 3,
  "includeExternal": false
}
```

**Response**:
```json
{
  "success": true,
  "message": "Full site scan initiated",
  "scanId": "scan_abc123",
  "estimatedDuration": "5-10 minutes"
}
```

**Implementation Notes**:
- Queue scan job in background
- Crawl site starting from homepage
- Analyze each page for SEO issues
- Generate recommendations
- Send notification when complete

---

## Data Sync & Background Jobs

### Google Search Console Sync
**Frequency**: Daily (automatic)

**Process**:
1. Fetch performance data from GSC API
2. Update metrics in database
3. Calculate aggregations
4. Update `lastSynced` timestamp

**GSC API Endpoints Used**:
- Search Analytics API: Performance data
- URL Inspection API: Individual page data
- Sitemaps API: Sitemap status

### Recommendation Generation
**Triggers**:
- After page scan
- After full site scan
- After GSC data sync (new issues detected)

**Checks**:
- Title tag length & quality
- Meta description presence & length
- Image alt text presence
- Heading structure (H1, H2, etc.)
- Content length & quality
- Page speed metrics
- Mobile-friendliness
- Internal linking
- Schema markup
- HTTPS usage

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid days parameter. Must be between 1 and 90."
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication token is missing or invalid"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Page with ID 123 not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred. Please try again later."
}
```

### 503 Service Unavailable
```json
{
  "error": "Service Unavailable",
  "message": "Google Search Console API is currently unavailable. Please try again later."
}
```

---

## Rate Limiting

- **Per User**: 100 requests per minute
- **Per Endpoint**:
  - GET requests: 60 per minute
  - POST requests: 20 per minute
  - Scan operations: 5 per hour

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Webhooks (Optional)

### Scan Complete
```json
{
  "event": "scan.completed",
  "scanId": "scan_abc123",
  "userId": 123,
  "timestamp": "2024-01-15T11:00:00Z",
  "data": {
    "pagesScanned": 42,
    "issuesFound": 15,
    "duration": "5m 32s"
  }
}
```

### New Critical Issue
```json
{
  "event": "recommendation.critical",
  "recommendationId": 456,
  "userId": 123,
  "timestamp": "2024-01-15T11:00:00Z",
  "data": {
    "pageUrl": "/important-page",
    "title": "Critical SEO issue detected",
    "severity": "critical"
  }
}
```

---

## Database Schema Suggestions

### `seo_pages` Table
```sql
CREATE TABLE seo_pages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    url VARCHAR(2048) NOT NULL,
    title VARCHAR(255),
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    ctr DECIMAL(5,4) DEFAULT 0,
    avg_position DECIMAL(5,2) DEFAULT 0,
    last_scanned TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_url (url(255))
);
```

### `seo_recommendations` Table
```sql
CREATE TABLE seo_recommendations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    page_id BIGINT NOT NULL,
    type ENUM('meta', 'title', 'alt', 'heading', 'content', 'technical', 'performance'),
    severity ENUM('critical', 'high', 'medium', 'low'),
    status ENUM('open', 'resolved', 'ignored') DEFAULT 'open',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    impact TEXT,
    how_to_fix TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (page_id) REFERENCES seo_pages(id) ON DELETE CASCADE,
    INDEX idx_page_id (page_id),
    INDEX idx_status (status),
    INDEX idx_severity (severity)
);
```

### `seo_metrics` Table
```sql
CREATE TABLE seo_metrics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    date DATE NOT NULL,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    ctr DECIMAL(5,4) DEFAULT 0,
    avg_position DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_date (user_id, date),
    INDEX idx_user_date (user_id, date)
);
```

### `seo_connections` Table
```sql
CREATE TABLE seo_connections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    provider VARCHAR(50) DEFAULT 'google_search_console',
    site_url VARCHAR(2048),
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    last_synced TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
);
```

---

## Testing

### Sample cURL Requests

**Get Metrics:**
```bash
curl -X GET 'https://api.example.com/api/seo/metrics?days=30' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Get Pages:**
```bash
curl -X GET 'https://api.example.com/api/seo/pages' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Resolve Recommendation:**
```bash
curl -X POST 'https://api.example.com/api/seo/recommendations/1/resolve' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Start Full Scan:**
```bash
curl -X POST 'https://api.example.com/api/seo/scan' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"depth": 3, "includeExternal": false}'
```

---

## Integration with Google Search Console API

### Prerequisites
1. Create project in Google Cloud Console
2. Enable Search Console API
3. Create OAuth 2.0 credentials
4. Configure redirect URI

### OAuth Flow
1. User clicks "Connect Google Search Console"
2. Backend generates authorization URL
3. User authorizes in Google
4. Google redirects to callback URL with code
5. Backend exchanges code for tokens
6. Store tokens securely
7. Use tokens to fetch data

### API Calls
```python
# Example using Google API Python Client
from googleapiclient.discovery import build

service = build('searchconsole', 'v1', credentials=credentials)

# Get performance data
request = service.searchanalytics().query(
    siteUrl='https://example.com',
    body={
        'startDate': '2024-01-01',
        'endDate': '2024-01-31',
        'dimensions': ['page', 'query'],
        'rowLimit': 1000
    }
)
response = request.execute()
```

---

## Performance Considerations

### Caching
- Cache metrics for 1 hour
- Cache page data for 30 minutes
- Cache recommendations until scan

### Pagination
- For large datasets, implement pagination
- Default page size: 50 items
- Max page size: 100 items

### Async Processing
- Queue background jobs for:
  - Full site scans
  - GSC data syncs
  - Recommendation generation

---

## Security

### Data Protection
- Encrypt OAuth tokens at rest
- Use HTTPS for all API calls
- Validate all user inputs
- Implement CSRF protection

### Access Control
- Users can only access their own data
- Admin role can view all data
- Rate limiting per user

---

## Support Contact

For questions or issues with this API specification:
- Email: dev@example.com
- Slack: #seo-tools-dev
- Documentation: https://docs.example.com/seo-api



