<?php

namespace App\Http\Controllers;

use App\Models\FamilyMember;
use Inertia\Inertia;

class FamilyTreeController extends Controller
{
    /**
     * Display the public landing page with family tree preview.
     */
    public function index()
    {
        $tree = FamilyMember::getTree();
        $totalMembers = FamilyMember::count();
        $totalGenerations = FamilyMember::max('generation') ?? 0;

        return Inertia::render('welcome', [
            'tree' => $tree,
            'stats' => [
                'totalMembers' => $totalMembers,
                'totalGenerations' => $totalGenerations,
            ],
        ]);
    }
}
