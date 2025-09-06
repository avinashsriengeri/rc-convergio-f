<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Deal;
use App\Models\Activity;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    /**
     * Get a specific contact
     */
    public function show($id): JsonResponse
    {
        try {
            $tenantId = Auth::user()->tenant_id ?? null;
            $contact = Contact::with(['owner', 'company'])
                ->where('tenant_id', $tenantId)
                ->where('id', $id)
                ->firstOrFail();
            
            return response()->json([
                'data' => [
                    'contact' => $contact
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Contact not found'
            ], 404);
        }
    }

    /**
     * Get deals for a specific contact
     */
    public function getDeals(Request $request, $contactId): JsonResponse
    {
        try {
            $tenantId = Auth::user()->tenant_id ?? null;
            $contact = Contact::where('tenant_id', $tenantId)
                ->where('id', $contactId)
                ->firstOrFail();
            
            $deals = Deal::where('contact_id', $contactId)
                ->with(['stage', 'pipeline'])
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('limit', 10));
            
            return response()->json([
                'data' => $deals->items(),
                'meta' => [
                    'current_page' => $deals->currentPage(),
                    'last_page' => $deals->lastPage(),
                    'per_page' => $deals->perPage(),
                    'total' => $deals->total(),
                    'from' => $deals->firstItem(),
                    'to' => $deals->lastItem()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to load deals'
            ], 500);
        }
    }

    /**
     * Get activities for a specific contact
     */
    public function getActivities(Request $request, $contactId): JsonResponse
    {
        try {
            $tenantId = Auth::user()->tenant_id ?? null;
            $contact = Contact::where('tenant_id', $tenantId)
                ->where('id', $contactId)
                ->firstOrFail();
            
            $activities = Activity::where('contact_id', $contactId)
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('limit', 10));
            
            return response()->json([
                'data' => $activities->items(),
                'meta' => [
                    'current_page' => $activities->currentPage(),
                    'last_page' => $activities->lastPage(),
                    'per_page' => $activities->perPage(),
                    'total' => $activities->total(),
                    'from' => $activities->firstItem(),
                    'to' => $activities->lastItem()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to load activities'
            ], 500);
        }
    }

    /**
     * Get company associated with a contact
     */
    public function getCompany($contactId): JsonResponse
    {
        try {
            $tenantId = Auth::user()->tenant_id ?? null;
            $contact = Contact::with('company')
                ->where('tenant_id', $tenantId)
                ->where('id', $contactId)
                ->firstOrFail();
            
            if (!$contact->company) {
                return response()->json([
                    'data' => null
                ]);
            }
            
            return response()->json([
                'data' => $contact->company
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to load company'
            ], 500);
        }
    }

    /**
     * Create a new contact
     */
    public function store(Request $request): JsonResponse
    {
        $tenantId = Auth::user()->tenant_id ?? null;

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:contacts,email,NULL,id,tenant_id,' . $tenantId,
            'phone' => 'nullable|string|max:20',
            'company_id' => 'nullable|exists:companies,id',
            'source' => 'nullable|string|max:255',
            'lifecycle_stage' => 'nullable|string|max:255',
            'owner_id' => 'nullable|exists:users,id'
        ]);

        try {
            $payload = $request->all();
            // Enforce tenant and default owner
            $payload['tenant_id'] = $tenantId;
            if (!isset($payload['owner_id'])) {
                $payload['owner_id'] = Auth::id();
            }
            $contact = Contact::create($payload);
            
            return response()->json([
                'data' => [
                    'contact' => $contact->load(['owner', 'company'])
                ],
                'message' => 'Contact created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create contact'
            ], 500);
        }
    }

    /**
     * Update a contact
     */
    public function update(Request $request, $id): JsonResponse
    {
        $tenantId = Auth::user()->tenant_id ?? null;

        $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:contacts,email,' . $id . ',id,tenant_id,' . $tenantId,
            'phone' => 'nullable|string|max:20',
            'company_id' => 'nullable|exists:companies,id',
            'source' => 'nullable|string|max:255',
            'lifecycle_stage' => 'nullable|string|max:255',
            'owner_id' => 'nullable|exists:users,id'
        ]);

        try {
            $contact = Contact::where('tenant_id', $tenantId)
                ->where('id', $id)
                ->firstOrFail();
            $contact->update($request->all());
            
            return response()->json([
                'data' => [
                    'contact' => $contact->load(['owner', 'company'])
                ],
                'message' => 'Contact updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update contact'
            ], 500);
        }
    }

    /**
     * Delete a contact
     */
    public function destroy($id): JsonResponse
    {
        try {
            $tenantId = Auth::user()->tenant_id ?? null;
            $contact = Contact::where('tenant_id', $tenantId)
                ->where('id', $id)
                ->firstOrFail();
            $contact->delete();
            
            return response()->json([
                'message' => 'Contact deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete contact'
            ], 500);
        }
    }
}
