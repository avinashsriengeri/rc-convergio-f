<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Deal;
use App\Models\Activity;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    /**
     * Get a specific contact
     */
    public function show($id): JsonResponse
    {
        try {
            $contact = Contact::with(['owner', 'company'])->findOrFail($id);
            
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
            $contact = Contact::findOrFail($contactId);
            
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
            $contact = Contact::findOrFail($contactId);
            
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
            $contact = Contact::with('company')->findOrFail($contactId);
            
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
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:contacts,email',
            'phone' => 'nullable|string|max:20',
            'company_id' => 'nullable|exists:companies,id',
            'source' => 'nullable|string|max:255',
            'lifecycle_stage' => 'nullable|string|max:255',
            'owner_id' => 'nullable|exists:users,id'
        ]);

        try {
            $contact = Contact::create($request->all());
            
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
        $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:contacts,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'company_id' => 'nullable|exists:companies,id',
            'source' => 'nullable|string|max:255',
            'lifecycle_stage' => 'nullable|string|max:255',
            'owner_id' => 'nullable|exists:users,id'
        ]);

        try {
            $contact = Contact::findOrFail($id);
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
            $contact = Contact::findOrFail($id);
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
