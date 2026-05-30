<?php

namespace App\Http\Controllers;

use App\Models\FamilyMember;
use Inertia\Inertia;

class FamilyTreeController extends Controller
{
    /**
     * Display the public landing page.
     * Only aggregate stats are shared publicly — no personal family data.
     */
    public function index()
    {
        $totalMembers = FamilyMember::count();
        $totalGenerations = FamilyMember::max('generation') ?? 0;

        return Inertia::render('welcome', [
            'stats' => [
                'totalMembers' => $totalMembers,
                'totalGenerations' => $totalGenerations,
            ],
        ]);
    }
}

