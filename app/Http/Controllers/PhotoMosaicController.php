<?php

namespace App\Http\Controllers;

use App\Models\PhotoMosaic;
use App\Services\ImageCompressorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PhotoMosaicController extends Controller
{
    /**
     * Display the photo mosaic wall.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $mosaics = PhotoMosaic::with('user:id,name,role')
            ->orderBy('created_at', 'desc')
            ->get();

        $totalOriginal = (int) PhotoMosaic::sum('original_file_size');
        $totalCompressed = (int) PhotoMosaic::sum('file_size');
        $totalSaved = max(0, $totalOriginal - $totalCompressed);
        $percentSaved = $totalOriginal > 0 ? round(($totalSaved / $totalOriginal) * 100, 1) : 0;

        return Inertia::render('mosaic/index', [
            'mosaics' => $mosaics,
            'stats' => [
                'total_photos' => $mosaics->count(),
                'total_original_bytes' => $totalOriginal,
                'total_compressed_bytes' => $totalCompressed,
                'total_saved_bytes' => $totalSaved,
                'percent_saved' => $percentSaved,
            ],
            'canManage' => $user ? $user->isEditorOrAbove() : false,
            'currentUserId' => $user ? $user->id : null,
            'isSuperadmin' => $user ? $user->isSuperadmin() : false,
        ]);
    }

    /**
     * Store newly uploaded mosaic photo(s) with compression.
     */
    public function store(Request $request, ImageCompressorService $compressor): RedirectResponse
    {
        $request->validate([
            'photos' => 'nullable|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,webp,gif|max:25600', // up to 25MB before compression
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:25600',
            'caption' => 'required|string|max:1000',
            'title' => 'nullable|string|max:255',
            'taken_at' => 'nullable|date',
        ]);

        $files = [];
        if ($request->hasFile('photos')) {
            $files = $request->file('photos');
        } elseif ($request->hasFile('photo')) {
            $files = [$request->file('photo')];
        }

        if (empty($files)) {
            return back()->with('error', 'Silakan pilih minimal satu foto untuk diunggah.');
        }

        $user = $request->user();
        $totalOrig = 0;
        $totalComp = 0;
        $count = 0;

        foreach ($files as $file) {
            $result = $compressor->compressAndStore($file);

            PhotoMosaic::create([
                'user_id' => $user->id,
                'title' => $request->title,
                'caption' => $request->caption,
                'image_path' => $result['image_path'],
                'thumbnail_path' => $result['thumbnail_path'],
                'original_filename' => $result['original_filename'],
                'file_size' => $result['file_size'],
                'original_file_size' => $result['original_file_size'],
                'width' => $result['width'],
                'height' => $result['height'],
                'taken_at' => $request->taken_at,
            ]);

            $totalOrig += $result['original_file_size'];
            $totalComp += $result['file_size'];
            $count++;
        }

        $savedPercent = $totalOrig > 0 ? round((($totalOrig - $totalComp) / $totalOrig) * 100, 1) : 0;

        if (function_exists('activity')) {
            activity()
                ->causedBy($user)
                ->log("Mengunggah {$count} foto ke Mozaik Foto (hemat {$savedPercent}%)");
        }

        $msg = $count === 1
            ? "Foto mozaik berhasil diunggah! Ukuran dikompresi sebesar {$savedPercent}% agar hemat penyimpanan."
            : "{$count} foto mozaik berhasil diunggah dan dikompresi sebesar {$savedPercent}%!";

        return redirect()->route('mosaic.index')->with('success', $msg);
    }

    /**
     * Update caption/title of a mosaic photo.
     */
    public function update(Request $request, PhotoMosaic $photoMosaic): RedirectResponse
    {
        $user = $request->user();

        if ($user->id !== $photoMosaic->user_id && !$user->isSuperadmin()) {
            abort(403, 'Anda tidak memiliki hak untuk mengubah foto mozaik ini.');
        }

        $data = $request->validate([
            'caption' => 'required|string|max:1000',
            'title' => 'nullable|string|max:255',
            'taken_at' => 'nullable|date',
        ]);

        $photoMosaic->update($data);

        return back()->with('success', 'Keterangan foto mozaik berhasil diperbarui.');
    }

    /**
     * Delete a mosaic photo and clean up compressed files.
     */
    public function destroy(Request $request, PhotoMosaic $photoMosaic): RedirectResponse
    {
        $user = $request->user();

        if ($user->id !== $photoMosaic->user_id && !$user->isSuperadmin()) {
            abort(403, 'Anda tidak memiliki hak untuk menghapus foto mozaik ini.');
        }

        if ($photoMosaic->image_path) {
            Storage::disk('public')->delete($photoMosaic->image_path);
        }

        if ($photoMosaic->thumbnail_path) {
            Storage::disk('public')->delete($photoMosaic->thumbnail_path);
        }

        $photoMosaic->delete();

        return back()->with('success', 'Foto mozaik berhasil dihapus.');
    }
}
