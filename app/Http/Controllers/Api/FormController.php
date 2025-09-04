<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class FormController extends Controller
{
    /**
     * Get a form by ID
     */
    public function getForm($id): JsonResponse
    {
        // Mock form data for now - in a real app, this would fetch from database
        $form = [
            'id' => $id,
            'name' => 'Request Demo',
            'status' => 'active',
            'fields' => [
                [
                    'id' => 'field_1',
                    'name' => 'first_name',
                    'type' => 'text',
                    'label' => 'First Name',
                    'required' => true,
                    'options' => []
                ],
                [
                    'id' => 'field_2',
                    'name' => 'last_name',
                    'type' => 'text',
                    'label' => 'Last Name',
                    'required' => true,
                    'options' => []
                ],
                [
                    'id' => 'field_3',
                    'name' => 'email',
                    'type' => 'email',
                    'label' => 'Email',
                    'required' => true,
                    'options' => []
                ],
                [
                    'id' => 'field_4',
                    'name' => 'phone',
                    'type' => 'phone',
                    'label' => 'Phone',
                    'required' => false,
                    'options' => []
                ],
                [
                    'id' => 'field_5',
                    'name' => 'company',
                    'type' => 'text',
                    'label' => 'Company',
                    'required' => false,
                    'options' => []
                ],
                [
                    'id' => 'field_6',
                    'name' => 'job_title',
                    'type' => 'text',
                    'label' => 'Job Title',
                    'required' => false,
                    'options' => []
                ],
                [
                    'id' => 'field_7',
                    'name' => 'country',
                    'type' => 'text',
                    'label' => 'Country',
                    'required' => false,
                    'options' => []
                ],
                [
                    'id' => 'field_8',
                    'name' => 'message',
                    'type' => 'textarea',
                    'label' => 'Message',
                    'required' => false,
                    'options' => []
                ]
            ],
            'consent_required' => true,
            'created_at' => '2025-09-03T14:55:04.000000Z',
            'updated_at' => '2025-09-04T07:05:24.000000Z'
        ];

        return response()->json([
            'success' => true,
            'data' => $form
        ]);
    }

    /**
     * Get public form (no authentication required)
     */
    public function getPublicForm($id): JsonResponse
    {
        // Mock form data for now - in a real app, this would fetch from database
        $form = [
            'id' => $id,
            'name' => 'Pricing form',
            'status' => 'active',
            'fields' => [
                [
                    'id' => 'field_1',
                    'name' => 'first_name',
                    'type' => 'text',
                    'label' => 'First Name',
                    'required' => true,
                    'options' => []
                ],
                [
                    'id' => 'field_2',
                    'name' => 'last_name',
                    'type' => 'text',
                    'label' => 'Last Name',
                    'required' => true,
                    'options' => []
                ],
                [
                    'id' => 'field_3',
                    'name' => 'email',
                    'type' => 'email',
                    'label' => 'Email',
                    'required' => true,
                    'options' => []
                ],
                [
                    'id' => 'field_4',
                    'name' => 'phone',
                    'type' => 'phone',
                    'label' => 'Phone',
                    'required' => false,
                    'options' => []
                ],
                [
                    'id' => 'field_5',
                    'name' => 'company',
                    'type' => 'text',
                    'label' => 'Company',
                    'required' => false,
                    'options' => []
                ]
            ],
            'consent_required' => true,
            'created_at' => '2025-09-03T14:55:04.000000Z',
            'updated_at' => '2025-09-04T07:05:24.000000Z'
        ];

        return response()->json([
            'success' => true,
            'data' => $form
        ]);
    }

    /**
     * Submit public form (no authentication required)
     */
    public function submitPublicForm(Request $request, $id): JsonResponse
    {
        // Log the incoming request for debugging
        \Log::info('Public form submission received', [
            'form_id' => $id,
            'request_data' => $request->all(),
            'headers' => $request->headers->all()
        ]);

        $validator = Validator::make($request->all(), [
            'form_id' => 'required|integer',
            'payload' => 'required|array',
            'payload.first_name' => 'required|string|max:255',
            'payload.last_name' => 'required|string|max:255',
            'payload.email' => 'required|email|max:255',
            'payload.phone' => 'nullable|string|max:20',
            'payload.company' => 'nullable|string|max:255',
            'consent_given' => 'required|boolean|accepted',
        ]);

        if ($validator->fails()) {
            // Log validation failure details
            \Log::error('Form validation failed', [
                'form_id' => $id,
                'request_data' => $request->all(),
                'validation_errors' => $validator->errors()->toArray()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Extract validated data
        $validatedData = $validator->validated();
        
        // In a real app, this would save to database and process CRM automation
        
        \Log::info('Public form submitted successfully', [
            'form_id' => $id,
            'validated_data' => $validatedData,
            'payload' => $validatedData['payload'] ?? [],
            'consent_given' => $validatedData['consent_given'] ?? false
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Form submitted successfully',
            'data' => [
                'processed' => true,
                'submission_id' => rand(1000, 9999),
                'received_fields' => array_keys($validatedData['payload'] ?? [])
            ]
        ]);
    }

    /**
     * Create a new form
     */
    public function createForm(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'status' => 'string|in:active,inactive,draft',
            'fields' => 'array',
            'fields.*.name' => 'required|string',
            'fields.*.type' => 'required|string',
            'fields.*.label' => 'required|string',
            'fields.*.required' => 'boolean',
            'fields.*.options' => 'array',
            'consent_required' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // In a real app, save to database
        $formData = $request->all();
        $formData['id'] = rand(100, 999); // Mock ID
        $formData['created_at'] = now()->toISOString();
        $formData['updated_at'] = now()->toISOString();
        
        // Log the form creation for debugging
        \Log::info('Form created', [
            'form_data' => $formData
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Form created successfully',
            'data' => $formData
        ], 201);
    }

    /**
     * Update an existing form
     */
    public function updateForm(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'status' => 'string|in:active,inactive,draft',
            'fields' => 'array',
            'fields.*.name' => 'string',
            'fields.*.type' => 'string',
            'fields.*.label' => 'string',
            'fields.*.required' => 'boolean',
            'fields.*.options' => 'array',
            'consent_required' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // In a real app, update in database
        $formData = $request->all();
        $formData['id'] = $id;
        $formData['updated_at'] = now()->toISOString();
        
        // Log the form update for debugging
        \Log::info('Form updated', [
            'form_id' => $id,
            'form_data' => $formData
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Form updated successfully',
            'data' => $formData
        ]);
    }

    /**
     * Delete a form
     */
    public function deleteForm($id): JsonResponse
    {
        // In a real app, delete from database
        
        // Log the form deletion for debugging
        \Log::info('Form deleted', [
            'form_id' => $id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Form deleted successfully'
        ]);
    }

    /**
     * Get form settings
     */
    public function getSettings($id): JsonResponse
    {
        // For now, return default settings structure
        // In a real app, this would fetch from database
        $settings = [
            'create_company_from_domain' => true,
            'company_name_strategy' => 'domain_only',
            'dedupe_strategy' => 'email',
            'update_existing_contact' => true,
            'default_lifecycle_stage' => 'lead',
            'default_tags' => ['website_lead'],
            'assignment_rule' => 'round_robin',
            'assigned_owner_id' => null,
            'rate_limit' => 10,
            'enable_captcha' => false,
            'track_utm' => true,
            'track_referrer' => true,
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'settings' => $settings
            ]
        ]);
    }

    /**
     * Update form settings
     */
    public function updateSettings(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'create_company_from_domain' => 'boolean',
            'company_name_strategy' => 'string|in:domain_only,domain_clean,custom_field',
            'dedupe_strategy' => 'string|in:email,phone,both,none',
            'update_existing_contact' => 'boolean',
            'default_lifecycle_stage' => 'string|in:lead,prospect,qualified,customer',
            'default_tags' => 'array',
            'default_tags.*' => 'string',
            'assignment_rule' => 'string|in:round_robin,static,least_assigned,random',
            'assigned_owner_id' => 'nullable|integer',
            'rate_limit' => 'integer|min:1|max:100',
            'enable_captcha' => 'boolean',
            'track_utm' => 'boolean',
            'track_referrer' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // In a real app, save to database
        $settings = $request->all();
        
        // Log the settings for debugging
        \Log::info('Form settings updated', [
            'form_id' => $id,
            'settings' => $settings
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Form settings updated successfully',
            'data' => $settings
        ]);
    }

    /**
     * Get form field mapping
     */
    public function getFieldMapping($id): JsonResponse
    {
        // Default field mapping structure - transformed to frontend format
        $mapping = [
            'field_mapping' => [
                'contact' => [
                    'first_name' => 'first_name',
                    'first_name_type' => 'direct',
                    'last_name' => 'last_name',
                    'last_name_type' => 'direct',
                    'email' => 'email',
                    'email_type' => 'direct',
                    'phone' => 'phone',
                    'phone_type' => 'direct',
                    'job_title' => 'job_title',
                    'job_title_type' => 'direct',
                    'department' => '',
                    'department_type' => 'direct',
                    'source' => '',
                    'source_type' => 'static',
                    'lifecycle_stage' => '',
                    'lifecycle_stage_type' => 'static',
                    'custom_field_1' => '',
                    'custom_field_1_type' => 'direct',
                    'custom_field_2' => '',
                    'custom_field_2_type' => 'direct',
                    'tags' => '',
                    'tags_type' => 'static'
                ],
                'company' => [
                    'name' => 'company',
                    'name_type' => 'direct',
                    'domain' => 'email',
                    'domain_type' => 'derived',
                    'industry' => '',
                    'industry_type' => 'direct',
                    'size' => '',
                    'size_type' => 'direct',
                    'website' => '',
                    'website_type' => 'direct',
                    'description' => '',
                    'description_type' => 'direct'
                ]
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $mapping
        ]);
    }

    /**
     * Update form field mapping
     */
    public function updateFieldMapping(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'contact_fields' => 'array',
            'contact_fields.*.source_field' => 'string',
            'contact_fields.*.mapping_type' => 'string|in:direct,static,derived,conditional',
            'company_fields' => 'array',
            'company_fields.*.source_field' => 'string',
            'company_fields.*.mapping_type' => 'string|in:direct,static,derived,conditional',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $mapping = $request->all();
        
        // Log the mapping for debugging
        \Log::info('Form field mapping updated', [
            'form_id' => $id,
            'mapping' => $mapping
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Form field mapping updated successfully',
            'data' => $mapping
        ]);
    }

    /**
     * Get form submissions
     */
    public function getSubmissions($id): JsonResponse
    {
        // Mock submissions data for now
        $submissions = [
            [
                'id' => 1,
                'payload' => [
                    'first_name' => 'John',
                    'last_name' => 'Doe',
                    'email' => 'john@example.com'
                ],
                'contact_id' => 1,
                'company_id' => 1,
                'owner_id' => 1,
                'processed_at' => now()->toISOString(),
                'status' => 'processed'
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $submissions
        ]);
    }

    /**
     * Reprocess submission
     */
    public function reprocessSubmission(Request $request, $formId, $submissionId): JsonResponse
    {
        // In a real app, this would trigger reprocessing logic
        
        \Log::info('Submission reprocessed', [
            'form_id' => $formId,
            'submission_id' => $submissionId
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Submission reprocessed successfully'
        ]);
    }
}
