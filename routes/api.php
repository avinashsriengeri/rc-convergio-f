<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\FormController; // Added this import

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
