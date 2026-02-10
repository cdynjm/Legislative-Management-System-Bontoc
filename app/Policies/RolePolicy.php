<?php

namespace App\Policies;

use App\Models\User;

class RolePolicy
{
    /**
     * Create a new policy instance.
     */
    public function accessAdmin(User $user): bool
    {
        return $user->role === 1;
    }

    public function accessUser(User $user): bool
    {
        return $user->role === 2;
    }
}
