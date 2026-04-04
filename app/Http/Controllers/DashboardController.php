<?php

namespace App\Http\Controllers;

use App\Models\FamilyMember;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with family tree stats.
     */
    public function index(): Response
    {
        $user = auth()->user();

        $stats = [
            'totalMembers' => FamilyMember::count(),
            'totalGenerations' => FamilyMember::max('generation') ?? 0,
        ];

        // Add admin stats for superadmin
        if ($user->isSuperadmin()) {
            $stats['totalUsers'] = User::count();
            $stats['pendingUsers'] = User::where('status', 'pending')->count();
        }

        $recentMembers = FamilyMember::latest()
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentMembers' => $recentMembers,
        ]);
    }
}
