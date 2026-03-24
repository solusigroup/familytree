<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFamilyMemberRequest;
use App\Http\Requests\UpdateFamilyMemberRequest;
use App\Models\FamilyMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FamilyMemberController extends Controller
{
    /**
     * Display a listing of family members.
     */
    public function index(): Response
    {
        $members = FamilyMember::with(['parent', 'spouses'])
            ->orderBy('generation')
            ->orderBy('name')
            ->get();

        return Inertia::render('family-members/index', [
            'members' => $members,
        ]);
    }

    /**
     * Show the form for creating a new family member.
     */
    public function create(): Response
    {
        $parents = FamilyMember::with('spouses')
            ->orderBy('generation')
            ->orderBy('name')
            ->get(['id', 'name', 'gender', 'generation']);

        return Inertia::render('family-members/form', [
            'parents' => $parents,
        ]);
    }

    /**
     * Store a newly created family member.
     */
    public function store(StoreFamilyMemberRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $spousesData = $data['spouses'] ?? [];
        unset($data['spouses']);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('family-photos', 'public');
        }

        // Auto-calculate generation
        if (isset($data['parent_id']) && $data['parent_id']) {
            $parent = FamilyMember::find($data['parent_id']);
            $data['generation'] = $parent ? $parent->generation + 1 : 1;
        } else {
            $data['generation'] = 1;
        }

        $member = FamilyMember::create($data);

        // Save spouses
        if (!empty($spousesData)) {
            $member->spouses()->createMany($spousesData);
        }

        return redirect()->route('family-members.index')
            ->with('success', 'Anggota keluarga berhasil ditambahkan.');
    }

    /**
     * Display the specified family member.
     */
    public function show(FamilyMember $familyMember): Response
    {
        $familyMember->load(['parent', 'children', 'spouses', 'parentSpouse']);

        return Inertia::render('family-members/show', [
            'member' => $familyMember,
        ]);
    }

    /**
     * Show the form for editing the specified family member.
     */
    public function edit(FamilyMember $familyMember): Response
    {
        $familyMember->load('spouses');
        $parents = FamilyMember::with('spouses')
            ->where('id', '!=', $familyMember->id)
            ->orderBy('generation')
            ->orderBy('name')
            ->get(['id', 'name', 'gender', 'generation']);

        return Inertia::render('family-members/form', [
            'member' => $familyMember,
            'parents' => $parents,
        ]);
    }

    /**
     * Update the specified family member.
     */
    public function update(UpdateFamilyMemberRequest $request, FamilyMember $familyMember): RedirectResponse
    {
        $data = $request->validated();
        $spousesData = $data['spouses'] ?? [];
        unset($data['spouses']);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo
            if ($familyMember->photo) {
                Storage::disk('public')->delete($familyMember->photo);
            }
            $data['photo'] = $request->file('photo')->store('family-photos', 'public');
        }

        // Auto-calculate generation
        if (isset($data['parent_id']) && $data['parent_id']) {
            $parent = FamilyMember::find($data['parent_id']);
            $data['generation'] = $parent ? $parent->generation + 1 : 1;
        } else {
            $data['generation'] = 1;
        }

        $familyMember->update($data);

        // Update spouses
        $existingSpouseIds = [];
        foreach ($spousesData as $spouseData) {
            if (!empty($spouseData['id'])) {
                $familyMember->spouses()->where('id', $spouseData['id'])->update($spouseData);
                $existingSpouseIds[] = $spouseData['id'];
            } else {
                $newSpouse = $familyMember->spouses()->create($spouseData);
                $existingSpouseIds[] = $newSpouse->id;
            }
        }
        $familyMember->spouses()->whereNotIn('id', $existingSpouseIds)->delete();

        return redirect()->route('family-members.index')
            ->with('success', 'Data anggota keluarga berhasil diperbarui.');
    }

    /**
     * Remove the specified family member.
     */
    public function destroy(FamilyMember $familyMember): RedirectResponse
    {
        // Delete photo if exists
        if ($familyMember->photo) {
            Storage::disk('public')->delete($familyMember->photo);
        }

        $familyMember->delete();

        return redirect()->route('family-members.index')
            ->with('success', 'Anggota keluarga berhasil dihapus.');
    }

    /**
     * Display the interactive family tree.
     */
    public function tree(): Response
    {
        $tree = FamilyMember::getTree();

        return Inertia::render('family-tree', [
            'tree' => $tree,
        ]);
    }
}
