<?php

namespace App\Http\Controllers;

use App\Models\FamilyMember;
use App\Models\User;
use Illuminate\Support\Facades\DB;
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

        $recentMembers = FamilyMember::latest()
            ->take(5)
            ->get();

        $superadminData = [];

        // Rich stats for superadmin
        if ($user->isSuperadmin()) {
            $stats['totalUsers'] = User::count();
            $stats['pendingUsers'] = User::where('status', 'pending')->count();
            $stats['membersThisMonth'] = FamilyMember::where('created_at', '>=', now()->startOfMonth())->count();
            $stats['activeUsers'] = User::where('status', 'active')->count();

            // Role distribution
            $superadminData['roleDistribution'] = User::select('role', DB::raw('count(*) as count'))
                ->groupBy('role')
                ->pluck('count', 'role')
                ->toArray();

            // Members per generation
            $superadminData['membersPerGeneration'] = FamilyMember::select('generation', DB::raw('count(*) as count'))
                ->groupBy('generation')
                ->orderBy('generation')
                ->pluck('count', 'generation')
                ->toArray();

            // Recent activity logs (disabled to fix 500 error on shared hosting)
            $superadminData['recentActivity'] = [];

            // Recent user registrations (last 5)
            $superadminData['recentRegistrations'] = User::latest()
                ->take(5)
                ->get(['id', 'name', 'email', 'role', 'status', 'created_at'])
                ->map(function ($u) {
                    return [
                        'id' => $u->id,
                        'name' => $u->name,
                        'email' => $u->email,
                        'role' => $u->role,
                        'status' => $u->status,
                        'created_at' => $u->created_at->diffForHumans(),
                    ];
                });
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentMembers' => $recentMembers,
            'superadminData' => $superadminData,
        ]);
    }
}
