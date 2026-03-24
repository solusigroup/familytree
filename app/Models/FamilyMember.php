<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Spouse;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FamilyMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'gender',
        'birth_date',
        'death_date',
        'birth_place',
        'bio',
        'photo',
        'parent_id',
        'parent_spouse_id',
        'generation',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'death_date' => 'date',
        ];
    }

    /**
     * Get the parent of this family member.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(FamilyMember::class, 'parent_id');
    }

    /**
     * Get the children of this family member.
     */
    public function children(): HasMany
    {
        return $this->hasMany(FamilyMember::class, 'parent_id');
    }

    /**
     * Get the spouse parent of this family member (if any).
     */
    public function parentSpouse(): BelongsTo
    {
        return $this->belongsTo(Spouse::class, 'parent_spouse_id');
    }

    /**
     * Get the spouses for this family member.
     */
    public function spouses(): HasMany
    {
        return $this->hasMany(Spouse::class);
    }

    /**
     * Recursively load all descendants with their spouses.
     */
    public function childrenRecursive(): HasMany
    {
        return $this->children()->with(['spouses', 'childrenRecursive']);
    }

    /**
     * Scope to get root members (no parent).
     */
    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    public static function getTree(): \Illuminate\Database\Eloquent\Collection
    {
        return static::roots()->with(['spouses', 'childrenRecursive'])->orderBy('birth_date')->get();
    }
}
