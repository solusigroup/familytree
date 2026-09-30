<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageCompressorService
{
    /**
     * Max dimensions for enlarged mosaic photo (width / height).
     */
    protected const MAX_WIDTH = 1600;
    protected const MAX_HEIGHT = 1600;

    /**
     * Thumbnail dimension for 3cm x 3cm tile (square 240px).
     */
    protected const THUMB_SIZE = 240;

    /**
     * Compress an uploaded image file, generate 3cm tile thumbnail, and return file metadata.
     *
     * @param UploadedFile $file
     * @return array
     */
    public function compressAndStore(UploadedFile $file): array
    {
        $originalFilename = $file->getClientOriginalName();
        $originalSize = $file->getSize();
        $tmpPath = $file->getRealPath();

        // Ensure target directories exist on public disk
        Storage::disk('public')->makeDirectory('mosaics/full');
        Storage::disk('public')->makeDirectory('mosaics/thumb');

        $uniqueName = Str::random(32) . '.webp';
        $fullRelativePath = 'mosaics/full/' . $uniqueName;
        $thumbRelativePath = 'mosaics/thumb/' . $uniqueName;

        $fullAbsolutePath = Storage::disk('public')->path($fullRelativePath);
        $thumbAbsolutePath = Storage::disk('public')->path($thumbRelativePath);

        // Load image resource using GD
        $sourceImage = $this->createImageResource($tmpPath, $file->getMimeType());

        if (!$sourceImage) {
            // Fallback: store standard if GD fails
            $fallbackPath = $file->store('mosaics/full', 'public');
            return [
                'image_path' => $fallbackPath,
                'thumbnail_path' => null,
                'original_filename' => $originalFilename,
                'original_file_size' => $originalSize,
                'file_size' => $originalSize,
                'width' => null,
                'height' => null,
            ];
        }

        // Auto rotate based on EXIF orientation if available
        $sourceImage = $this->correctOrientation($sourceImage, $tmpPath);

        $origWidth = imagesx($sourceImage);
        $origHeight = imagesy($sourceImage);

        // 1. Calculate resized dimensions for full view
        list($targetWidth, $targetHeight) = $this->calculateTargetDimensions($origWidth, $origHeight, self::MAX_WIDTH, self::MAX_HEIGHT);

        $fullImage = imagecreatetruecolor($targetWidth, $targetHeight);
        $this->preserveTransparency($fullImage, $sourceImage);

        imagecopyresampled(
            $fullImage,
            $sourceImage,
            0, 0, 0, 0,
            $targetWidth, $targetHeight,
            $origWidth, $origHeight
        );

        // Save compressed WebP for full view (quality 82 gives exceptional balance of sharpness & tiny file size)
        imagewebp($fullImage, $fullAbsolutePath, 82);
        imagedestroy($fullImage);

        // 2. Generate square thumbnail for 3cm x 3cm tile
        $thumbImage = imagecreatetruecolor(self::THUMB_SIZE, self::THUMB_SIZE);
        $this->preserveTransparency($thumbImage, $sourceImage);

        // Calculate center crop square
        $cropSize = min($origWidth, $origHeight);
        $cropX = (int) (($origWidth - $cropSize) / 2);
        $cropY = (int) (($origHeight - $cropSize) / 2);

        imagecopyresampled(
            $thumbImage,
            $sourceImage,
            0, 0,
            $cropX, $cropY,
            self::THUMB_SIZE, self::THUMB_SIZE,
            $cropSize, $cropSize
        );

        // Save compressed thumbnail (quality 75, ~15-25 KB)
        imagewebp($thumbImage, $thumbAbsolutePath, 75);
        imagedestroy($thumbImage);

        // Destroy original GD resource
        imagedestroy($sourceImage);

        $compressedSize = file_exists($fullAbsolutePath) ? filesize($fullAbsolutePath) : $originalSize;

        return [
            'image_path' => $fullRelativePath,
            'thumbnail_path' => $thumbRelativePath,
            'original_filename' => $originalFilename,
            'original_file_size' => $originalSize,
            'file_size' => $compressedSize,
            'width' => $targetWidth,
            'height' => $targetHeight,
        ];
    }

    /**
     * Create GD image resource based on file type.
     */
    protected function createImageResource(string $path, string $mime)
    {
        return match ($mime) {
            'image/jpeg', 'image/jpg' => @imagecreatefromjpeg($path),
            'image/png' => @imagecreatefrompng($path),
            'image/webp' => @imagecreatefromwebp($path),
            'image/gif' => @imagecreatefromgif($path),
            default => @imagecreatefromstring(file_get_contents($path)),
        };
    }

    /**
     * Rotate GD resource according to EXIF Orientation.
     */
    protected function correctOrientation($image, string $path)
    {
        if (!function_exists('exif_read_data')) {
            return $image;
        }

        try {
            $exif = @exif_read_data($path);
            if (!empty($exif['Orientation'])) {
                switch ($exif['Orientation']) {
                    case 3:
                        $image = imagerotate($image, 180, 0);
                        break;
                    case 6:
                        $image = imagerotate($image, -90, 0);
                        break;
                    case 8:
                        $image = imagerotate($image, 90, 0);
                        break;
                }
            }
        } catch (\Throwable $e) {
            // Ignore EXIF parsing errors
        }

        return $image;
    }

    /**
     * Calculate proportional dimensions within max constraints.
     */
    protected function calculateTargetDimensions(int $width, int $height, int $maxWidth, int $maxHeight): array
    {
        if ($width <= $maxWidth && $height <= $maxHeight) {
            return [$width, $height];
        }

        $ratio = min($maxWidth / $width, $maxHeight / $height);
        $newWidth = (int) round($width * $ratio);
        $newHeight = (int) round($height * $ratio);

        return [max(1, $newWidth), max(1, $newHeight)];
    }

    /**
     * Preserve transparency for alpha channels.
     */
    protected function preserveTransparency($target, $source): void
    {
        imagealphablending($target, false);
        imagesavealpha($target, true);
        $transparent = imagecolorallocatealpha($target, 255, 255, 255, 127);
        imagefilledrectangle($target, 0, 0, imagesx($target), imagesy($target), $transparent);
    }
}
