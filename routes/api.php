<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\FormController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JourneyController;

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
    Route::get('/{contactId}/journey', [JourneyController::class, 'getTimeline']);
    
    // Search and import endpoints
    Route::get('/search', [ContactController::class, 'search']);
    Route::post('/import', [ContactController::class, 'import']);
    Route::get('/import/status/{jobId}', [ContactController::class, 'getImportStatus']);
});

// Journey routes
Route::prefix('journey')->group(function () {
    Route::post('/events', [JourneyController::class, 'logEvent']);
    Route::get('/event-types', [JourneyController::class, 'getEventTypes']);
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
