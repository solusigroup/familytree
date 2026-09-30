<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class PhotoMosaic extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'caption',
        'image_path',
        'thumbnail_path',
        'original_filename',
        'file_size',
        'original_file_size',
        'width',
        'height',
        'taken_at',
    ];

    protected $casts = [
        'taken_at' => 'date',
        'file_size' => 'integer',
        'original_file_size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
    ];

    protected $appends = [
        'image_url',
        'thumbnail_url',
        'compression_ratio',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getImageUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->image_path);
    }

    public function getThumbnailUrlAttribute(): string
    {
        if ($this->thumbnail_path && Storage::disk('public')->exists($this->thumbnail_path)) {
            return Storage::disk('public')->url($this->thumbnail_path);
        }

        return $this->getImageUrlAttribute();
    }

    /**
     * Percentage of file size reduced through compression.
     */
    public function getCompressionRatioAttribute(): ?float
    {
        if ($this->original_file_size > 0 && $this->file_size > 0) {
            $saved = $this->original_file_size - $this->file_size;
            return round(($saved / $this->original_file_size) * 100, 1);
        }

        return null;
    }
}
