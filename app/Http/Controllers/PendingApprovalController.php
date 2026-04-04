<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PendingApprovalController extends Controller
{
    /**
     * Show the pending approval page.
     */
    public function index(): Response
    {
        // If user is already active, redirect to dashboard
        if (auth()->user()->isActive()) {
            return Inertia::render('dashboard');
        }

        return Inertia::render('pending-approval');
    }
}
