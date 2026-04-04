<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FamilyMember;
use App\Models\User;
use App\Models\UserBranchAssignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $query = User::query()->withCount('branchAssignments');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $users = $query->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'desc')
            ->get();

        $pendingCount = User::where('status', 'pending')->count();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'pendingCount' => $pendingCount,
            'currentFilter' => $request->status ?? 'all',
        ]);
    }

    /**
     * Display user details with branch assignments.
     */
    public function show(User $user): Response
    {
        $user->load(['branchAssignments.familyMember', 'assignedBranches']);

        // Get all root-level family members for branch assignment dropdown
        $familyMembers = FamilyMember::with('children')
            ->orderBy('generation')
            ->orderBy('name')
            ->get(['id', 'name', 'generation', 'parent_id']);

        return Inertia::render('admin/users/show', [
            'targetUser' => $user,
            'familyMembers' => $familyMembers,
        ]);
    }

    /**
     * Approve a pending user and set them as editor.
     */
    public function approve(User $user): RedirectResponse
    {
        if (!$user->isPendingStatus()) {
            return back()->with('error', 'User ini tidak berstatus pending.');
        }

        $user->update([
            'role' => User::ROLE_EDITOR,
            'status' => User::STATUS_ACTIVE,
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ]);

        return back()->with('success', "User \"{$user->name}\" berhasil disetujui sebagai Editor.");
    }

    /**
     * Reject a pending user.
     */
    public function reject(User $user): RedirectResponse
    {
        if (!$user->isPendingStatus()) {
            return back()->with('error', 'User ini tidak berstatus pending.');
        }

        $user->update([
            'status' => User::STATUS_REJECTED,
        ]);

        return back()->with('success', "User \"{$user->name}\" telah ditolak.");
    }

    /**
     * Update user role.
     */
    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'role' => 'required|in:superadmin,editor,pending',
        ]);

        // Prevent demoting yourself
        if ($user->id === auth()->id() && $request->role !== User::ROLE_SUPERADMIN) {
            return back()->with('error', 'Anda tidak dapat mengubah role Anda sendiri.');
        }

        $user->update([
            'role' => $request->role,
            'status' => $request->role === User::ROLE_PENDING ? User::STATUS_PENDING : User::STATUS_ACTIVE,
        ]);

        return back()->with('success', "Role user \"{$user->name}\" berhasil diubah.");
    }

    /**
     * Assign a branch to a user.
     */
    public function assignBranch(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'family_member_id' => 'required|exists:family_members,id',
        ]);

        // Check if already assigned
        $exists = UserBranchAssignment::where('user_id', $user->id)
            ->where('family_member_id', $request->family_member_id)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Cabang ini sudah di-assign ke user ini.');
        }

        UserBranchAssignment::create([
            'user_id' => $user->id,
            'family_member_id' => $request->family_member_id,
            'assigned_by' => auth()->id(),
        ]);

        $memberName = FamilyMember::find($request->family_member_id)->name;

        return back()->with('success', "Cabang \"{$memberName}\" berhasil di-assign ke \"{$user->name}\".");
    }

    /**
     * Remove a branch assignment from a user.
     */
    public function removeBranch(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'family_member_id' => 'required|exists:family_members,id',
        ]);

        UserBranchAssignment::where('user_id', $user->id)
            ->where('family_member_id', $request->family_member_id)
            ->delete();

        return back()->with('success', 'Assignment cabang berhasil dihapus.');
    }

    /**
     * Delete a user.
     */
    public function destroy(User $user): RedirectResponse
    {
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', "User \"{$user->name}\" berhasil dihapus.");
    }
}
