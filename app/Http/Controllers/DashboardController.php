<?php

namespace App\Http\Controllers;

use App\Models\FamilyMember;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with family tree stats.
     */
    public function index(): Response
    {
        $stats = [
            'totalMembers' => FamilyMember::count(),
            'totalGenerations' => FamilyMember::max('generation') ?? 0,
        ];

        $recentMembers = FamilyMember::latest()
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentMembers' => $recentMembers,
        ]);
    }
}
