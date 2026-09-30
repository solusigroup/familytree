<?php

use App\Models\PhotoMosaic;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('approved users can view photo mosaic wall', function () {
    $viewer = User::factory()->viewer()->create();

    $response = $this->actingAs($viewer)->get(route('mosaic.index'));
    $response->assertOk();
});

test('editor can upload photo with caption and it is compressed', function () {
    $editor = User::factory()->editor()->create();

    // Create a dummy image using UploadedFile::fake()
    $file = UploadedFile::fake()->image('family-gathering.jpg', 1200, 800);

    $response = $this->actingAs($editor)->post(route('mosaic.store'), [
        'photo' => $file,
        'caption' => 'Foto reuni keluarga besar bani ali dahlan',
        'title' => 'Reuni Akbar',
        'taken_at' => '2026-05-15',
    ]);

    $response->assertRedirect(route('mosaic.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('photo_mosaics', [
        'user_id' => $editor->id,
        'caption' => 'Foto reuni keluarga besar bani ali dahlan',
        'title' => 'Reuni Akbar',
    ]);

    $mosaic = PhotoMosaic::first();
    expect($mosaic)->not->toBeNull();
    expect($mosaic->image_path)->not->toBeNull();
    expect(Storage::disk('public')->exists($mosaic->image_path))->toBeTrue();
    expect($mosaic->file_size)->toBeGreaterThan(0);
});

test('viewer cannot upload photo mosaic', function () {
    $viewer = User::factory()->viewer()->create();
    $file = UploadedFile::fake()->image('test.jpg', 600, 600);

    $response = $this->actingAs($viewer)->post(route('mosaic.store'), [
        'photo' => $file,
        'caption' => 'Unauthorized mosaic',
    ]);

    $response->assertForbidden();
});

test('editor can update caption of their mosaic', function () {
    $editor = User::factory()->editor()->create();
    $mosaic = PhotoMosaic::create([
        'user_id' => $editor->id,
        'caption' => 'Keterangan lama',
        'image_path' => 'mosaics/full/sample.webp',
        'original_filename' => 'sample.jpg',
        'file_size' => 120000,
        'original_file_size' => 800000,
    ]);

    $response = $this->actingAs($editor)->put(route('mosaic.update', $mosaic), [
        'caption' => 'Keterangan baru yang sudah diperbarui',
    ]);

    $response->assertRedirect();
    $mosaic->refresh();
    expect($mosaic->caption)->toBe('Keterangan baru yang sudah diperbarui');
});

test('editor can delete their mosaic photo and clean up storage', function () {
    $editor = User::factory()->editor()->create();

    Storage::disk('public')->put('mosaics/full/delete-me.webp', 'dummy-data');
    Storage::disk('public')->put('mosaics/thumb/delete-me.webp', 'dummy-data');

    $mosaic = PhotoMosaic::create([
        'user_id' => $editor->id,
        'caption' => 'Foto yang akan dihapus',
        'image_path' => 'mosaics/full/delete-me.webp',
        'thumbnail_path' => 'mosaics/thumb/delete-me.webp',
        'original_filename' => 'delete-me.jpg',
        'file_size' => 100000,
        'original_file_size' => 500000,
    ]);

    $response = $this->actingAs($editor)->delete(route('mosaic.destroy', $mosaic));
    $response->assertRedirect();

    $this->assertDatabaseMissing('photo_mosaics', ['id' => $mosaic->id]);
    expect(Storage::disk('public')->exists('mosaics/full/delete-me.webp'))->toBeFalse();
    expect(Storage::disk('public')->exists('mosaics/thumb/delete-me.webp'))->toBeFalse();
});
