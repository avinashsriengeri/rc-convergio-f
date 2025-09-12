<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'type',
        'status',
        'owner_id',
        'tenant_id',
        'subject',
        'content',
        'scheduled_at',
        'sent_at',
        'is_template',
        'settings'
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'is_template' => 'boolean',
        'settings' => 'array'
    ];

    // Relationships
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function recipients()
    {
        return $this->hasMany(CampaignRecipient::class);
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    // Scopes
    public function scopeForTenant($query, $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }

    public function scopeTemplates($query)
    {
        return $query->where('is_template', true);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['draft', 'scheduled', 'sending']);
    }

    // Accessors
    public function getRecipientCountAttribute()
    {
        return $this->recipients()->count();
    }

    public function getSentCountAttribute()
    {
        return $this->recipients()->whereNotNull('sent_at')->count();
    }

    public function getOpenedCountAttribute()
    {
        return $this->recipients()->whereNotNull('opened_at')->count();
    }

    public function getClickedCountAttribute()
    {
        return $this->recipients()->whereNotNull('clicked_at')->count();
    }

    public function getBouncedCountAttribute()
    {
        return $this->recipients()->where('status', 'bounced')->count();
    }

    public function getUnsubscribedCountAttribute()
    {
        return $this->recipients()->where('status', 'unsubscribed')->count();
    }
}
