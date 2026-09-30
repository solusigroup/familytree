<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'recipient_id',
        'message',
    ];

    /**
     * Get the sender of the message.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the recipient of the message (null for general room).
     */
    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    /**
     * Scope for general room messages.
     */
    public function scopeGeneral($query)
    {
        return $query->whereNull('recipient_id');
    }

    /**
     * Scope for direct messages between two users.
     */
    public function scopeBetweenUsers($query, int $userA, int $userB)
    {
        return $query->where(function ($q) use ($userA, $userB) {
            $q->where('user_id', $userA)->where('recipient_id', $userB);
        })->orWhere(function ($q) use ($userA, $userB) {
            $q->where('user_id', $userB)->where('recipient_id', $userA);
        });
    }
}
