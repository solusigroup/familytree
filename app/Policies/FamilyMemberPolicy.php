<?php

namespace App\Policies;

use App\Models\FamilyMember;
use App\Models\User;

class FamilyMemberPolicy
{
    /**
     * Anyone active can view the list.
     */
    public function viewAny(User $user): bool
    {
        return $user->isActive();
    }

    /**
     * Anyone active can view a single member.
     */
    public function view(User $user, FamilyMember $familyMember): bool
    {
        return $user->isActive();
    }

    /**
     * Superadmin: always. Editor: only if parent belongs to their branch.
     */
    public function create(User $user): bool
    {
        if ($user->isSuperadmin()) {
            return true;
        }

        if ($user->isEditor() && $user->isActive()) {
            // Actual parent validation happens in the controller/request
            return true;
        }

        return false;
    }

    /**
     * Superadmin: always. Editor: only if the member is in their branch.
     */
    public function update(User $user, FamilyMember $familyMember): bool
    {
        if ($user->isSuperadmin()) {
            return true;
        }

        return $user->isEditor() && $user->isActive() && $user->canManageMember($familyMember);
    }

    /**
     * Superadmin: always. Editor: only if the member is in their branch.
     */
    public function delete(User $user, FamilyMember $familyMember): bool
    {
        if ($user->isSuperadmin()) {
            return true;
        }

        return $user->isEditor() && $user->isActive() && $user->canManageMember($familyMember);
    }
}
