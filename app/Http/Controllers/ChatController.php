<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    /**
     * Display the chat interface for editors and superadmins.
     */
    public function index(Request $request): Response
    {
        $currentUser = $request->user();

        // Get all active editors and superadmins
        $colleagues = User::query()
            ->where('status', User::STATUS_ACTIVE)
            ->whereIn('role', [User::ROLE_SUPERADMIN, User::ROLE_EDITOR])
            ->where('id', '!=', $currentUser->id)
            ->orderByRaw("CASE WHEN role = 'superadmin' THEN 0 ELSE 1 END")
            ->orderBy('name')
            ->select(['id', 'name', 'email', 'role'])
            ->get();

        $activeRecipientId = $request->query('recipient_id');
        $activeRecipient = null;

        if ($activeRecipientId) {
            $activeRecipient = User::query()
                ->where('status', User::STATUS_ACTIVE)
                ->whereIn('role', [User::ROLE_SUPERADMIN, User::ROLE_EDITOR])
                ->where('id', $activeRecipientId)
                ->select(['id', 'name', 'email', 'role'])
                ->first();

            if (!$activeRecipient) {
                $activeRecipientId = null;
            }
        }

        // Fetch initial messages
        $messagesQuery = ChatMessage::with('user:id,name,role,email');

        if ($activeRecipient) {
            $messagesQuery->betweenUsers($currentUser->id, $activeRecipient->id);
        } else {
            $messagesQuery->general();
        }

        $messages = $messagesQuery
            ->orderBy('created_at', 'desc')
            ->take(100)
            ->get()
            ->reverse()
            ->values();

        // Count unread or total recent messages for general
        $generalCount = ChatMessage::general()->count();

        return Inertia::render('chat/index', [
            'colleagues' => $colleagues,
            'activeRecipient' => $activeRecipient,
            'messages' => $messages,
            'generalCount' => $generalCount,
        ]);
    }

    /**
     * Poll for new messages (JSON endpoint for smooth real-time updates).
     */
    public function fetchMessages(Request $request): JsonResponse
    {
        $currentUser = $request->user();
        $recipientId = $request->query('recipient_id');
        $afterId = (int) $request->query('after_id', 0);

        $query = ChatMessage::with('user:id,name,role,email');

        if ($recipientId) {
            $query->betweenUsers($currentUser->id, (int) $recipientId);
        } else {
            $query->general();
        }

        if ($afterId > 0) {
            $query->where('id', '>', $afterId);
        }

        $messages = $query->orderBy('created_at', 'asc')->get();

        return response()->json([
            'messages' => $messages,
        ]);
    }

    /**
     * Send a new chat message.
     */
    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
            'recipient_id' => 'nullable|exists:users,id',
        ]);

        $recipientId = $request->recipient_id;

        // Verify recipient role if direct message
        if ($recipientId) {
            $recipient = User::find($recipientId);
            if (!$recipient || !$recipient->isEditorOrAbove()) {
                if ($request->wantsJson()) {
                    return response()->json(['error' => 'Penerima tidak valid.'], 422);
                }
                return back()->with('error', 'Penerima pesan tidak valid.');
            }
        }

        $chatMessage = ChatMessage::create([
            'user_id' => $request->user()->id,
            'recipient_id' => $recipientId,
            'message' => trim($request->message),
        ]);

        $chatMessage->load('user:id,name,role,email');

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => $chatMessage,
            ]);
        }

        return back();
    }

    /**
     * Delete a chat message.
     */
    public function destroy(Request $request, ChatMessage $chatMessage): RedirectResponse
    {
        $user = $request->user();

        if ($user->id !== $chatMessage->user_id && !$user->isSuperadmin()) {
            abort(403, 'Anda tidak berhak menghapus pesan ini.');
        }

        $chatMessage->delete();

        return back()->with('success', 'Pesan berhasil dihapus.');
    }
}
