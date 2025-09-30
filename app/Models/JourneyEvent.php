<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JourneyEvent extends Model
{
    protected $fillable = [
        'contact_id',
        'event_type',
        'event_source',
        'details',
        'related_model_type',
        'related_model_id',
    ];

    protected $casts = [
        'details' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the contact associated with the journey event.
     */
    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    /**
     * Get the parent related model.
     */
    public function relatedModel(): MorphTo
    {
        return $this->morphTo('related');
    }

    /**
     * Scope a query to filter by event type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('event_type', $type);
    }

    /**
     * Scope a query to filter by event source.
     */
    public function scopeFromSource($query, string $source)
    {
        return $query->where('event_source', $source);
    }

    /**
     * Get the event type label.
     */
    public function getEventTypeLabelAttribute(): string
    {
        return [
            'contact_created' => 'Contact Created',
            'company_created' => 'Company Created',
            'deal_created' => 'Deal Created',
            'deal_updated' => 'Deal Updated',
            'activity_created' => 'Activity Logged',
            'email_sent' => 'Email Sent',
            'email_opened' => 'Email Opened',
            'email_clicked' => 'Email Clicked',
        ][$this->event_type] ?? ucfirst(str_replace('_', ' ', $this->event_type));
    }

    /**
     * Get the event icon.
     */
    public function getEventIconAttribute(): string
    {
        return [
            'contact_created' => '🟢',
            'company_created' => '🏢',
            'deal_created' => '💼',
            'deal_updated' => '📊',
            'activity_created' => '📞',
            'email_sent' => '📧',
            'email_opened' => '👁️',
            'email_clicked' => '🔗',
        ][$this->event_type] ?? '⚪';
    }
}
