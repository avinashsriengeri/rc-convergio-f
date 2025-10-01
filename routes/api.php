<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\FormController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Auth routes (no authentication required)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/user', [AuthController::class, 'user']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public event types endpoint (no authentication required)
Route::get('/events/types', function () {
    return response()->json([
        'success' => true,
        'data' => [
            ['id' => 'webinar', 'name' => 'Webinar', 'description' => 'Online presentation or training session'],
            ['id' => 'conference', 'name' => 'Conference', 'description' => 'Large-scale professional gathering'],
            ['id' => 'workshop', 'name' => 'Workshop', 'description' => 'Interactive training or learning session'],
            ['id' => 'demo', 'name' => 'Demo', 'description' => 'Product demonstration or showcase'],
            ['id' => 'meeting', 'name' => 'Meeting', 'description' => 'Business or team meeting'],
            ['id' => 'networking', 'name' => 'Networking', 'description' => 'Professional networking event'],
            ['id' => 'training', 'name' => 'Training', 'description' => 'Educational or skill development session']
        ]
    ]);
});

// Contact routes
Route::prefix('contacts')->group(function () {
    Route::get('/', [ContactController::class, 'index']);
    Route::post('/', [ContactController::class, 'store']);
    Route::get('/{id}', [ContactController::class, 'show']);
    Route::put('/{id}', [ContactController::class, 'update']);
    Route::delete('/{id}', [ContactController::class, 'destroy']);
    Route::post('/{id}/restore', [ContactController::class, 'restore']);
    
    // Contact-specific endpoints for the enhanced detail page
    Route::get('/{contactId}/deals', [ContactController::class, 'getDeals']);
    Route::get('/{contactId}/activities', [ContactController::class, 'getActivities']);
    Route::get('/{contactId}/company', [ContactController::class, 'getCompany']);
    
    // Search and import endpoints
    Route::get('/search', [ContactController::class, 'search']);
    Route::post('/import', [ContactController::class, 'import']);
    Route::get('/import/status/{jobId}', [ContactController::class, 'getImportStatus']);
});

// Form routes
Route::prefix('forms')->group(function () {
    // Basic CRUD operations
    Route::get('/{id}', [FormController::class, 'getForm']);
    Route::post('/', [FormController::class, 'createForm']);
    Route::put('/{id}', [FormController::class, 'updateForm']);
    Route::delete('/{id}', [FormController::class, 'deleteForm']);
    
    // Form settings
    Route::get('/{id}/settings', [FormController::class, 'getSettings']);
    Route::put('/{id}/settings', [FormController::class, 'updateSettings']);
    
    // Form field mapping
    Route::get('/{id}/mapping', [FormController::class, 'getFieldMapping']);
    Route::put('/{id}/mapping', [FormController::class, 'updateFieldMapping']);
    
    // Form submissions
    Route::get('/{id}/submissions', [FormController::class, 'getSubmissions']);
    Route::post('/{id}/submissions/{submissionId}/reprocess', [FormController::class, 'reprocessSubmission']);
});

// Public form routes (no authentication required)
Route::prefix('public/forms')->group(function () {
    Route::get('/{id}', [FormController::class, 'getPublicForm']);
    Route::post('/{id}/submit', [FormController::class, 'submitPublicForm']);
});

// Public event routes (no authentication required)
Route::prefix('public/events')->group(function () {
    Route::get('/{id}', function (Request $request, $id) {
        return response()->json([
            'success' => true,
            'data' => [
                'id' => (int)$id,
                'name' => 'Product Launch Event',
                'description' => 'Join us for an exclusive look at our latest product features.',
                'type' => 'webinar',
                'scheduled_at' => '2024-12-15T14:00:00Z',
                'duration' => 60,
                'location' => 'Virtual',
                'zoom_join_url' => 'https://zoom.us/j/mock_' . $id . '_' . time(),
                'max_attendees' => 100,
                'current_attendees' => 45,
                'rsvp_going' => 35,
                'rsvp_interested' => 10,
                'rsvp_declined' => 5,
                'settings' => [
                    'recording_enabled' => true,
                    'auto_reminder' => true,
                    'waiting_room' => false
                ]
            ]
        ]);
    });
    
    Route::post('/{id}/register', function (Request $request, $id) {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'rsvp_status' => 'required|in:going,interested,declined,maybe',
            'agreed_to_communications' => 'required|boolean'
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'data' => [
                'id' => rand(100, 999),
                'event_id' => (int)$id,
                'contact_id' => rand(100, 999),
                'rsvp_status' => $validated['rsvp_status'],
                'attended' => false,
                'rsvp_at' => now()->toISOString(),
                'contact' => [
                    'id' => rand(100, 999),
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'email' => $validated['email'],
                    'company' => $validated['company'] ?? null
                ]
            ]
        ]);
    });
    
    // GET route for RSVP - redirect to frontend
    Route::get('/{id}/rsvp', function (Request $request, $id) {
        $status = $request->get('status', 'going');
        $contactId = $request->get('contact_id', 'unknown');
        
        // Redirect to frontend interceptor page
        $frontendUrl = "http://localhost:5174/rsvp-interceptor.html?event_id={$id}&status={$status}&contact_id={$contactId}";
        
        return redirect($frontendUrl);
    });
    
    Route::post('/{id}/rsvp', function (Request $request, $id) {
        $validated = $request->validate([
            'status' => 'required|in:going,interested,declined,maybe',
            'contact_id' => 'required|integer'
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'RSVP processed successfully',
            'data' => [
                'event_id' => (int)$id,
                'contact_id' => $validated['contact_id'],
                'rsvp_status' => $validated['status'],
                'processed_at' => now()->toISOString()
            ]
        ]);
    });
});

// Events routes (demo endpoints)
Route::prefix('events')->group(function () {
    Route::get('/', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => [
                [
                    'id' => 1,
                    'name' => 'Q4 Product Launch Webinar',
                    'description' => 'Join us for an exclusive look at our latest product features and roadmap updates.',
                    'type' => 'webinar',
                    'status' => 'upcoming',
                    'scheduled_at' => '2024-12-15T14:00:00Z',
                    'duration' => 60,
                    'location' => 'Virtual',
                    'max_attendees' => 200,
                    'rsvp_going' => 127,
                    'rsvp_interested' => 23,
                    'rsvp_declined' => 8,
                    'attended' => 0,
                    'utilization_rate' => 75,
                    'zoom_join_url' => 'https://zoom.us/j/123456789',
                    'recording_enabled' => true,
                    'created_at' => '2024-11-01T10:30:00Z',
                    'created_by' => ['id' => 1, 'name' => 'John Smith']
                ],
                [
                    'id' => 2,
                    'name' => 'Customer Success Summit 2025',
                    'description' => 'Annual customer success conference featuring industry leaders and best practices.',
                    'type' => 'conference',
                    'status' => 'upcoming',
                    'scheduled_at' => '2025-01-20T09:00:00Z',
                    'duration' => 480,
                    'location' => 'San Francisco, CA',
                    'max_attendees' => 500,
                    'rsvp_going' => 89,
                    'rsvp_interested' => 45,
                    'rsvp_declined' => 12,
                    'attended' => 0,
                    'utilization_rate' => 27,
                    'zoom_join_url' => null,
                    'recording_enabled' => false,
                    'created_at' => '2024-10-15T14:20:00Z',
                    'created_by' => ['id' => 2, 'name' => 'Sarah Johnson']
                ],
                [
                    'id' => 3,
                    'name' => 'Sales Training Workshop',
                    'description' => 'Interactive workshop on advanced sales techniques and CRM optimization.',
                    'type' => 'workshop',
                    'status' => 'completed',
                    'scheduled_at' => '2024-11-28T10:00:00Z',
                    'duration' => 240,
                    'location' => 'New York, NY',
                    'max_attendees' => 50,
                    'rsvp_going' => 42,
                    'rsvp_interested' => 8,
                    'rsvp_declined' => 3,
                    'attended' => 38,
                    'utilization_rate' => 100,
                    'zoom_join_url' => null,
                    'recording_enabled' => false,
                    'created_at' => '2024-10-01T08:15:00Z',
                    'created_by' => ['id' => 1, 'name' => 'John Smith']
                ]
            ],
            'meta' => [
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 15,
                'total' => 3,
                'from' => 1,
                'to' => 3
            ]
        ]);
    });
    
    Route::post('/', function (Request $request) {
        return response()->json([
            'success' => true,
            'message' => 'Event created successfully',
            'data' => [
                'id' => rand(100, 999),
                'name' => $request->input('name', 'New Event'),
                'description' => $request->input('description'),
                'type' => $request->input('type', 'meeting'),
                'status' => 'upcoming',
                'scheduled_at' => $request->input('scheduled_at'),
                'duration' => $request->input('duration', 60),
                'location' => $request->input('location'),
                'max_attendees' => $request->input('settings.max_attendees', 100),
                'zoom_join_url' => in_array($request->input('type'), ['webinar', 'meeting']) ? 'https://zoom.us/j/' . rand(100000000, 999999999) : null,
                'recording_enabled' => $request->input('settings.recording_enabled', false),
                'created_at' => now()->toISOString()
            ]
        ], 201);
    });
    
    Route::get('/analytics', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'total_events' => 25,
                'upcoming_events' => 8,
                'completed_events' => 17,
                'total_attendees' => 1247,
                'total_rsvps' => 2156,
                'avg_attendance_rate' => 78.5,
                'avg_rsvp_rate' => 85.2,
                'events_by_type' => [
                    ['type' => 'webinar', 'count' => 12, 'total_attendees' => 456, 'avg_attendance_rate' => 82.1],
                    ['type' => 'conference', 'count' => 3, 'total_attendees' => 234, 'avg_attendance_rate' => 75.8],
                    ['type' => 'workshop', 'count' => 6, 'total_attendees' => 312, 'avg_attendance_rate' => 79.2],
                    ['type' => 'demo', 'count' => 4, 'total_attendees' => 245, 'avg_attendance_rate' => 76.5]
                ],
                'top_performing_events' => [
                    [
                        'id' => 1,
                        'name' => 'Q4 Product Launch Webinar',
                        'type' => 'webinar',
                        'total_rsvps' => 158,
                        'total_attendees' => 127,
                        'attendance_rate' => 80.4,
                        'scheduled_at' => '2024-12-15T14:00:00Z'
                    ],
                    [
                        'id' => 2,
                        'name' => 'Customer Success Summit 2025',
                        'type' => 'conference',
                        'total_rsvps' => 146,
                        'total_attendees' => 89,
                        'attendance_rate' => 61.0,
                        'scheduled_at' => '2025-01-20T09:00:00Z'
                    ]
                ],
                'last_updated' => now()->toISOString()
            ]
        ]);
    });
    
    Route::get('/{id}/attendees', function (Request $request, $id) {
        return response()->json([
            'success' => true,
            'data' => [
                [
                    'id' => 1,
                    'name' => 'Alice Johnson',
                    'email' => 'alice.johnson@example.com',
                    'company' => 'Tech Corp',
                    'phone' => '+1-555-0123',
                    'rsvp_status' => 'going',
                    'attended' => false,
                    'registered_at' => '2024-11-01T10:35:00Z'
                ],
                [
                    'id' => 2,
                    'name' => 'Bob Smith',
                    'email' => 'bob.smith@example.com',
                    'company' => 'Innovation Inc',
                    'phone' => '+1-555-0124',
                    'rsvp_status' => 'going',
                    'attended' => false,
                    'registered_at' => '2024-11-02T14:20:00Z'
                ],
                [
                    'id' => 3,
                    'name' => 'Carol Davis',
                    'email' => 'carol.davis@example.com',
                    'company' => 'Future Systems',
                    'phone' => '+1-555-0125',
                    'rsvp_status' => 'interested',
                    'attended' => false,
                    'registered_at' => '2024-11-03T09:15:00Z'
                ]
            ]
        ]);
    });
    
    Route::post('/{eventId}/attendees/{attendeeId}/attended', function (Request $request, $eventId, $attendeeId) {
        return response()->json([
            'success' => true,
            'message' => 'Attendee marked as attended'
        ]);
    });
    
    Route::delete('/{id}', function (Request $request, $id) {
        return response()->json([
            'success' => true,
            'message' => 'Event deleted successfully'
        ]);
    });
});

// Public event registration (no authentication required)
Route::prefix('public/events')->group(function () {
    Route::post('/{id}/register', function (Request $request, $id) {
        return response()->json([
            'success' => true,
            'message' => 'Successfully registered for the event',
            'data' => [
                'id' => rand(100, 999),
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'rsvp_status' => $request->input('rsvp_status'),
                'registered_at' => now()->toISOString()
            ]
        ], 201);
    });
});

// Activities routes (demo endpoints)
Route::prefix('activities')->group(function () {
    Route::get('/', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => [],
            'meta' => [
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 15,
                'total' => 0,
                'from' => 0,
                'to' => 0
            ]
        ]);
    });
    Route::post('/', function (Request $request) {
        return response()->json([
            'success' => true,
            'message' => 'Activity created successfully',
            'data' => [
                'id' => 1,
                'type' => $request->input('type', 'task'),
                'title' => $request->input('title', 'New Activity'),
                'description' => $request->input('description'),
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    });
});

// Campaigns routes (demo endpoints)
Route::prefix('campaigns')->group(function () {
    Route::get('/', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => [],
            'meta' => [
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 15,
                'total' => 0,
                'from' => 0,
                'to' => 0
            ]
        ]);
    });
    Route::post('/', function (Request $request) {
        return response()->json([
            'success' => true,
            'message' => 'Campaign created successfully',
            'data' => [
                'id' => 1,
                'name' => $request->input('name', 'New Campaign'),
                'type' => $request->input('type', 'email'),
                'status' => 'draft',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    });
    Route::post('/{id}/test', function (Request $request, $id) {
        return response()->json([
            'success' => true,
            'message' => 'Test email sent successfully'
        ]);
    });
    Route::get('/metrics', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => [
                'delivered' => '114',
                'opens' => 0,
                'clicks' => 0,
                'bounces' => '4',
                'range' => '14d'
            ]
        ]);
    });

    // Template routes
    Route::get('/templates', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => [
                [
                    'id' => 1,
                    'name' => 'Welcome Email Template',
                    'subject' => 'Welcome to Our Platform!',
                    'content' => '<h1>Welcome!</h1><p>Thank you for joining us.</p>',
                    'description' => 'A welcome email for new users',
                    'type' => 'email',
                    'created_at' => now(),
                    'updated_at' => now()
                ],
                [
                    'id' => 2,
                    'name' => 'Newsletter Template',
                    'subject' => 'Weekly Newsletter',
                    'content' => '<h1>Weekly Newsletter</h1><p>Here are this week\'s updates.</p>',
                    'description' => 'Weekly newsletter template',
                    'type' => 'email',
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            ]
        ]);
    });

    Route::get('/templates/{id}', function (Request $request, $id) {
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $id,
                'name' => 'Sample Template',
                'subject' => 'Sample Subject',
                'content' => '<h1>Sample Content</h1>',
                'description' => 'Sample template description',
                'type' => 'email',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    });

    Route::post('/templates', function (Request $request) {
        // Validate required fields
        $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'description' => 'nullable|string',
            'type' => 'required|string|in:email,sms',
            'owner_id' => 'nullable|integer'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Template created successfully',
            'data' => [
                'id' => rand(10, 1000), // Generate a random ID for demo
                'name' => $request->input('name'),
                'subject' => $request->input('subject'),
                'content' => $request->input('content'),
                'description' => $request->input('description'),
                'type' => $request->input('type'),
                'owner_id' => $request->input('owner_id'),
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    });

    Route::put('/templates/{id}', function (Request $request, $id) {
        return response()->json([
            'success' => true,
            'message' => 'Template updated successfully',
            'data' => [
                'id' => $id,
                'name' => $request->input('name', 'Updated Template'),
                'subject' => $request->input('subject', 'Updated Subject'),
                'content' => $request->input('content', 'Updated content'),
                'description' => $request->input('description'),
                'type' => $request->input('type', 'email'),
                'updated_at' => now()
            ]
        ]);
    });

    Route::delete('/templates/{id}', function (Request $request, $id) {
        return response()->json([
            'success' => true,
            'message' => 'Template deleted successfully'
        ]);
    });

    Route::post('/templates/{id}/instantiate', function (Request $request, $id) {
        // Validate overrides
        $request->validate([
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'subject' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'owner_id' => 'nullable|integer'
        ]);

        // Get template data (in real app, fetch from database)
        $templateData = [
            'name' => 'Welcome Email Template',
            'subject' => 'Welcome to Our Platform!',
            'content' => '<h1>Welcome!</h1><p>Thank you for joining us.</p>',
            'description' => 'A welcome email for new users',
            'type' => 'email'
        ];

        // Apply overrides
        $campaignData = array_merge($templateData, $request->only(['name', 'description', 'subject', 'content', 'owner_id']));
        
        // Generate unique name if not provided
        if (empty($campaignData['name'])) {
            $campaignData['name'] = $templateData['name'] . ' - ' . date('Y-m-d H:i:s');
        }

        // Set campaign defaults (not template defaults)
        $campaignData['status'] = 'draft';
        $campaignData['is_template'] = false;
        $campaignData['scheduled_at'] = null;

        return response()->json([
            'success' => true,
            'message' => 'Campaign created from template successfully',
            'data' => [
                'id' => rand(1000, 9999), // Generate new campaign ID
                'template_id' => $id, // Reference to original template
                'name' => $campaignData['name'],
                'subject' => $campaignData['subject'],
                'content' => $campaignData['content'],
                'description' => $campaignData['description'],
                'type' => $campaignData['type'],
                'status' => $campaignData['status'],
                'is_template' => $campaignData['is_template'],
                'owner_id' => $campaignData['owner_id'],
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    });
});

// Metadata routes (demo endpoints)
Route::prefix('metadata')->group(function () {
    Route::get('/owners', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => [
                ['id' => 1, 'name' => 'Demo User', 'email' => 'demo@example.com'],
                ['id' => 2, 'name' => 'Admin User', 'email' => 'admin@example.com']
            ]
        ]);
    });
});

// Analytics API Routes
Route::prefix('analytics')->group(function () {
    // Configuration endpoints
    Route::get('/modules', function () {
        return response()->json([
            'success' => true,
            'data' => [
                ['id' => 'contacts', 'name' => 'Contacts', 'icon' => 'users'],
                ['id' => 'deals', 'name' => 'Deals', 'icon' => 'handshake'],
                ['id' => 'campaigns', 'name' => 'Campaigns', 'icon' => 'megaphone'],
                ['id' => 'ads', 'name' => 'Ads', 'icon' => 'target'],
                ['id' => 'events', 'name' => 'Events', 'icon' => 'calendar'],
                ['id' => 'meetings', 'name' => 'Meetings', 'icon' => 'video'],
                ['id' => 'tasks', 'name' => 'Tasks', 'icon' => 'checklist'],
                ['id' => 'companies', 'name' => 'Companies', 'icon' => 'building'],
                ['id' => 'forecast', 'name' => 'Forecast', 'icon' => 'trending-up'],
                ['id' => 'lead_scoring', 'name' => 'Lead Scoring', 'icon' => 'star'],
                ['id' => 'journeys', 'name' => 'Journeys', 'icon' => 'route'],
                ['id' => 'visitor_intent', 'name' => 'Visitor Intent', 'icon' => 'eye'],
            ]
        ]);
    });

    Route::get('/periods', function () {
        return response()->json([
            'success' => true,
            'data' => [
                ['id' => 'week', 'name' => 'This Week', 'label' => 'week'],
                ['id' => 'month', 'name' => 'This Month', 'label' => 'month'],
                ['id' => 'quarter', 'name' => 'This Quarter', 'label' => 'quarter'],
                ['id' => 'year', 'name' => 'This Year', 'label' => 'year'],
            ]
        ]);
    });

    // Dashboard summary endpoint
    Route::get('/dashboard', function (Request $request) {
        $period = $request->query('period', 'month');
        
        return response()->json([
            'success' => true,
            'data' => [
                'contacts' => [
                    'total' => 1247,
                    'new' => 89,
                    'growth' => 12.5,
                    'trend' => 'up'
                ],
                'deals' => [
                    'total' => 156,
                    'new' => 23,
                    'value' => 2840000,
                    'growth' => 8.3,
                    'trend' => 'up'
                ],
                'campaigns' => [
                    'total' => 45,
                    'active' => 12,
                    'sent' => 33,
                    'growth' => 15.2,
                    'trend' => 'up'
                ],
                'ads' => [
                    'total' => 8,
                    'active' => 5,
                    'spend' => 12500,
                    'impressions' => 125000,
                    'growth' => 22.1,
                    'trend' => 'up'
                ],
                'events' => [
                    'total' => 18,
                    'upcoming' => 6,
                    'attendees' => 234,
                    'growth' => 5.7,
                    'trend' => 'up'
                ],
                'meetings' => [
                    'total' => 67,
                    'scheduled' => 12,
                    'completed' => 55,
                    'growth' => 18.9,
                    'trend' => 'up'
                ],
                'tasks' => [
                    'total' => 234,
                    'completed' => 189,
                    'pending' => 45,
                    'growth' => 3.2,
                    'trend' => 'up'
                ],
                'companies' => [
                    'total' => 89,
                    'new' => 12,
                    'growth' => 7.8,
                    'trend' => 'up'
                ],
                'forecast' => [
                    'projected' => 3200000,
                    'probability_weighted' => 2560000,
                    'accuracy' => 87.5,
                    'growth' => 11.2,
                    'trend' => 'up'
                ],
                'lead_scoring' => [
                    'total_leads' => 456,
                    'qualified' => 123,
                    'avg_score' => 78.5,
                    'growth' => 9.4,
                    'trend' => 'up'
                ],
                'journeys' => [
                    'total' => 15,
                    'active' => 8,
                    'completed' => 7,
                    'participants' => 567,
                    'growth' => 13.6,
                    'trend' => 'up'
                ],
                'visitor_intent' => [
                    'total_visitors' => 2341,
                    'high_intent' => 234,
                    'medium_intent' => 567,
                    'low_intent' => 1540,
                    'growth' => 16.8,
                    'trend' => 'up'
                ]
            ]
        ]);
    });

    // Module-specific analytics endpoints
    Route::get('/contacts', function (Request $request) {
        $period = $request->query('period', 'month');
        
        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'summary' => [
                    'total' => 1247,
                    'growth' => 12.5,
                    'trend' => 'up'
                ],
                'chart_data' => [
                    ['date' => '2024-01-01', 'value' => 1100],
                    ['date' => '2024-01-08', 'value' => 1150],
                    ['date' => '2024-01-15', 'value' => 1200],
                    ['date' => '2024-01-22', 'value' => 1247]
                ],
                'metrics' => [
                    'new_contacts' => 89,
                    'converted' => 23,
                    'active' => 456
                ]
            ]
        ]);
    });

    Route::get('/companies', function (Request $request) {
        $period = $request->query('period', 'month');
        
        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'summary' => [
                    'total' => 89,
                    'growth' => 7.8,
                    'trend' => 'up'
                ],
                'chart_data' => [
                    ['date' => '2024-01-01', 'value' => 82],
                    ['date' => '2024-01-08', 'value' => 84],
                    ['date' => '2024-01-15', 'value' => 86],
                    ['date' => '2024-01-22', 'value' => 89]
                ],
                'metrics' => [
                    'new_companies' => 12,
                    'active' => 67,
                    'converted' => 8
                ]
            ]
        ]);
    });

    Route::get('/deals', function (Request $request) {
        $period = $request->query('period', 'month');
        
        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'summary' => [
                    'total' => 156,
                    'growth' => 8.3,
                    'trend' => 'up'
                ],
                'chart_data' => [
                    ['date' => '2024-01-01', 'value' => 140],
                    ['date' => '2024-01-08', 'value' => 145],
                    ['date' => '2024-01-15', 'value' => 150],
                    ['date' => '2024-01-22', 'value' => 156]
                ],
                'metrics' => [
                    'total_value' => 2840000,
                    'avg_deal_size' => 18205,
                    'win_rate' => 34.2
                ]
            ]
        ]);
    });

    Route::get('/campaigns', function (Request $request) {
        $period = $request->query('period', 'month');
        
        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'summary' => [
                    'total' => 45,
                    'growth' => 15.2,
                    'trend' => 'up'
                ],
                'chart_data' => [
                    ['date' => '2024-01-01', 'value' => 35],
                    ['date' => '2024-01-08', 'value' => 38],
                    ['date' => '2024-01-15', 'value' => 42],
                    ['date' => '2024-01-22', 'value' => 45]
                ],
                'metrics' => [
                    'open_rate' => 24.5,
                    'click_rate' => 3.2,
                    'conversion_rate' => 1.8
                ]
            ]
        ]);
    });

    Route::get('/ads', function (Request $request) {
        $period = $request->query('period', 'month');
        
        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'summary' => [
                    'total' => 8,
                    'growth' => 22.1,
                    'trend' => 'up'
                ],
                'chart_data' => [
                    ['date' => '2024-01-01', 'value' => 6],
                    ['date' => '2024-01-08', 'value' => 7],
                    ['date' => '2024-01-15', 'value' => 7],
                    ['date' => '2024-01-22', 'value' => 8]
                ],
                'metrics' => [
                    'spend' => 12500,
                    'impressions' => 125000,
                    'clicks' => 2500,
                    'ctr' => 2.0
                ]
            ]
        ]);
    });

    Route::get('/events', function (Request $request) {
        $period = $request->query('period', 'month');
        
        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'summary' => [
                    'total' => 18,
                    'growth' => 5.7,
                    'trend' => 'up'
                ],
                'chart_data' => [
                    ['date' => '2024-01-01', 'value' => 16],
                    ['date' => '2024-01-08', 'value' => 17],
                    ['date' => '2024-01-15', 'value' => 17],
                    ['date' => '2024-01-22', 'value' => 18]
                ],
                'metrics' => [
                    'attendees' => 234,
                    'rsvp_rate' => 78.5,
                    'attendance_rate' => 65.2
                ]
            ]
        ]);
    });

    Route::get('/meetings', function (Request $request) {
        $period = $request->query('period', 'month');
        
        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'summary' => [
                    'total' => 67,
                    'growth' => 18.9,
                    'trend' => 'up'
                ],
                'chart_data' => [
                    ['date' => '2024-01-01', 'value' => 55],
                    ['date' => '2024-01-08', 'value' => 58],
                    ['date' => '2024-01-15', 'value' => 62],
                    ['date' => '2024-01-22', 'value' => 67]
                ],
                'metrics' => [
                    'scheduled' => 12,
                    'completed' => 55,
                    'avg_duration' => 32
                ]
            ]
        ]);
    });

    Route::get('/tasks', function (Request $request) {
        $period = $request->query('period', 'month');
        
        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'summary' => [
                    'total' => 234,
                    'growth' => 3.2,
                    'trend' => 'up'
                ],
                'chart_data' => [
                    ['date' => '2024-01-01', 'value' => 225],
                    ['date' => '2024-01-08', 'value' => 228],
                    ['date' => '2024-01-15', 'value' => 231],
                    ['date' => '2024-01-22', 'value' => 234]
                ],
                'metrics' => [
                    'completed' => 189,
                    'pending' => 45,
                    'completion_rate' => 80.8
                ]
            ]
        ]);
    });

    Route::get('/forecast', function (Request $request) {
        $period = $request->query('period', 'month');
        
        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'summary' => [
                    'total' => 3200000,
                    'growth' => 11.2,
                    'trend' => 'up'
                ],
                'chart_data' => [
                    ['date' => '2024-01-01', 'value' => 2800000],
                    ['date' => '2024-01-08', 'value' => 2900000],
                    ['date' => '2024-01-15', 'value' => 3050000],
                    ['date' => '2024-01-22', 'value' => 3200000]
                ],
                'metrics' => [
                    'probability_weighted' => 2560000,
                    'accuracy' => 87.5,
                    'active_deals' => 45
                ]
            ]
        ]);
    });

    Route::get('/lead_scoring', function (Request $request) {
        $period = $request->query('period', 'month');
        
        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'summary' => [
                    'total' => 456,
                    'growth' => 9.4,
                    'trend' => 'up'
                ],
                'chart_data' => [
                    ['date' => '2024-01-01', 'value' => 410],
                    ['date' => '2024-01-08', 'value' => 425],
                    ['date' => '2024-01-15', 'value' => 440],
                    ['date' => '2024-01-22', 'value' => 456]
                ],
                'metrics' => [
                    'qualified' => 123,
                    'avg_score' => 78.5,
                    'high_score' => 89
                ]
            ]
        ]);
    });

    Route::get('/journeys', function (Request $request) {
        $period = $request->query('period', 'month');
        
        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'summary' => [
                    'total' => 15,
                    'growth' => 13.6,
                    'trend' => 'up'
                ],
                'chart_data' => [
                    ['date' => '2024-01-01', 'value' => 12],
                    ['date' => '2024-01-08', 'value' => 13],
                    ['date' => '2024-01-15', 'value' => 14],
                    ['date' => '2024-01-22', 'value' => 15]
                ],
                'metrics' => [
                    'active' => 8,
                    'completed' => 7,
                    'participants' => 567
                ]
            ]
        ]);
    });

    Route::get('/visitor_intent', function (Request $request) {
        $period = $request->query('period', 'month');
        
        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'summary' => [
                    'total' => 2341,
                    'growth' => 16.8,
                    'trend' => 'up'
                ],
                'chart_data' => [
                    ['date' => '2024-01-01', 'value' => 2000],
                    ['date' => '2024-01-08', 'value' => 2100],
                    ['date' => '2024-01-15', 'value' => 2200],
                    ['date' => '2024-01-22', 'value' => 2341]
                ],
                'metrics' => [
                    'high_intent' => 234,
                    'medium_intent' => 567,
                    'low_intent' => 1540
                ]
            ]
        ]);
    });
});
