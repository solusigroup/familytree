<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FamilyMemberController;
use App\Http\Controllers\FamilyTreeController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [FamilyTreeController::class, 'index'])->name('home');

// Authenticated + verified routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('family-members', FamilyMemberController::class);
    Route::get('family-tree', [FamilyMemberController::class, 'tree'])->name('family-tree');
});

require __DIR__.'/settings.php';

