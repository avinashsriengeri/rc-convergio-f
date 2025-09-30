<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\JourneyEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JourneyController extends Controller
{
    /**
     * Get journey timeline for a contact
     */
    public function getTimeline($contactId)
    {
        $contact = Contact::findOrFail($contactId);
        
        $events = JourneyEvent::where('contact_id', $contactId)
            ->with('relatedModel')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'event_type' => $event->event_type,
                    'event_icon' => $event->event_icon,
                    'event_label' => $event->event_type_label,
                    'event_source' => $event->event_source,
                    'details' => $event->details,
                    'created_at' => $event->created_at->toIso8601String(),
                    'related_model' => $event->related_model_type ? [
                        'type' => $event->related_model_type,
                        'id' => $event->related_model_id,
                    ] : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $events,
            'meta' => [
                'contact_id' => $contact->id,
                'contact_name' => $contact->name,
                'contact_email' => $contact->email,
                'total_events' => $events->count(),
                'event_types' => $events->pluck('event_type')->unique()->values(),
            ]
        ]);
    }

    /**
     * Log a journey event
     */
    public function logEvent(Request $request)
    {
        $validated = $request->validate([
            'contact_id' => 'required|exists:contacts,id',
            'event_type' => 'required|string|in:contact_created,company_created,deal_created,deal_updated,activity_created,email_sent,email_opened,email_clicked',
            'event_source' => 'required|string|in:form_submission,buyer_intent,manual',
            'details' => 'nullable|array',
            'related_model_type' => 'nullable|string',
            'related_model_id' => 'nullable|integer',
        ]);

        $event = JourneyEvent::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Event logged successfully',
            'data' => $event
        ], 201);
    }

    /**
     * Get event types
     */
    public function getEventTypes()
    {
        return response()->json([
            'success' => true,
            'data' => [
                [
                    'id' => 'contact_created',
                    'name' => 'Contact Created',
                    'icon' => '🟢',
                    'description' => 'When a contact is created',
                ],
                [
                    'id' => 'company_created',
                    'name' => 'Company Created',
                    'icon' => '🏢',
                    'description' => 'When a company is created and linked',
                ],
                [
                    'id' => 'deal_created',
                    'name' => 'Deal Created',
                    'icon' => '💼',
                    'description' => 'When a deal is created',
                ],
                [
                    'id' => 'deal_updated',
                    'name' => 'Deal Updated',
                    'icon' => '📊',
                    'description' => 'When a deal stage is updated',
                ],
                [
                    'id' => 'activity_created',
                    'name' => 'Activity Logged',
                    'icon' => '📞',
                    'description' => 'When an activity is logged (call, meeting, note)',
                ],
                [
                    'id' => 'email_sent',
                    'name' => 'Email Sent',
                    'icon' => '📧',
                    'description' => 'When an email is sent to the contact',
                ],
                [
                    'id' => 'email_opened',
                    'name' => 'Email Opened',
                    'icon' => '👁️',
                    'description' => 'When the contact opens an email',
                ],
                [
                    'id' => 'email_clicked',
                    'name' => 'Link Clicked',
                    'icon' => '🔗',
                    'description' => 'When the contact clicks a link in an email',
                ],
            ]
        ]);
    }
}
