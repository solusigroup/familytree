<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('superadmin can reset password of any user', function () {
    $superadmin = User::factory()->superadmin()->create();
    $targetUser = User::factory()->editor()->create([
        'password' => Hash::make('old-password-123'),
    ]);

    $response = $this->actingAs($superadmin)->post(route('admin.users.reset-password', $targetUser), [
        'password' => 'new-secret-password-456',
        'password_confirmation' => 'new-secret-password-456',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $targetUser->refresh();
    expect(Hash::check('new-secret-password-456', $targetUser->password))->toBeTrue();
});

test('non-superadmin cannot reset user password', function () {
    $editor = User::factory()->editor()->create();
    $targetUser = User::factory()->viewer()->create([
        'password' => Hash::make('old-password-123'),
    ]);

    $response = $this->actingAs($editor)->post(route('admin.users.reset-password', $targetUser), [
        'password' => 'new-secret-password-456',
        'password_confirmation' => 'new-secret-password-456',
    ]);

    $response->assertForbidden();
});

test('reset password requires at least 8 characters and confirmation', function () {
    $superadmin = User::factory()->superadmin()->create();
    $targetUser = User::factory()->viewer()->create();

    $response = $this->actingAs($superadmin)->post(route('admin.users.reset-password', $targetUser), [
        'password' => 'short',
        'password_confirmation' => 'mismatch',
    ]);

    $response->assertSessionHasErrors(['password']);
});
