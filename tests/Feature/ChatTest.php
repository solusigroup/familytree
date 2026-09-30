<?php

use App\Models\ChatMessage;
use App\Models\User;

test('editor and superadmin can view chat interface', function () {
    $editor = User::factory()->editor()->create();
    $response = $this->actingAs($editor)->get(route('chat.index'));
    $response->assertOk();

    $superadmin = User::factory()->superadmin()->create();
    $responseSuper = $this->actingAs($superadmin)->get(route('chat.index'));
    $responseSuper->assertOk();
});

test('viewer and pending users cannot access chat', function () {
    $viewer = User::factory()->viewer()->create();
    $response = $this->actingAs($viewer)->get(route('chat.index'));
    $response->assertForbidden();

    $pending = User::factory()->pending()->create();
    $responsePending = $this->actingAs($pending)->get(route('chat.index'));
    // Pending user should be redirected to pending-approval or forbidden
    expect($responsePending->status())->toBeIn([302, 403]);
});

test('editor can send message to general room', function () {
    $editor = User::factory()->editor()->create();

    $response = $this->actingAs($editor)->post(route('chat.store'), [
        'message' => 'Halo tim editor silsilah!',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('chat_messages', [
        'user_id' => $editor->id,
        'recipient_id' => null,
        'message' => 'Halo tim editor silsilah!',
    ]);
});

test('editor can send direct message to another editor or superadmin', function () {
    $editor1 = User::factory()->editor()->create();
    $editor2 = User::factory()->editor()->create();

    $response = $this->actingAs($editor1)->post(route('chat.store'), [
        'message' => 'Pesan privat untuk editor 2',
        'recipient_id' => $editor2->id,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('chat_messages', [
        'user_id' => $editor1->id,
        'recipient_id' => $editor2->id,
        'message' => 'Pesan privat untuk editor 2',
    ]);
});

test('editor can fetch messages via json endpoint for polling', function () {
    $editor = User::factory()->editor()->create();

    ChatMessage::create([
        'user_id' => $editor->id,
        'recipient_id' => null,
        'message' => 'Test message for polling',
    ]);

    $response = $this->actingAs($editor)->getJson(route('chat.messages'));
    $response->assertOk();
    $response->assertJsonStructure(['messages']);
});

test('user can delete their own message', function () {
    $editor = User::factory()->editor()->create();
    $message = ChatMessage::create([
        'user_id' => $editor->id,
        'recipient_id' => null,
        'message' => 'Message to be deleted',
    ]);

    $response = $this->actingAs($editor)->delete(route('chat.destroy', $message));
    $response->assertRedirect();
    $this->assertDatabaseMissing('chat_messages', ['id' => $message->id]);
});
