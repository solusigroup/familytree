<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('family_members', function (Blueprint $table) {
            $table->dropColumn('spouse_name');
            $table->foreignId('parent_spouse_id')->nullable()->after('parent_id')->constrained('spouses')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('family_members', function (Blueprint $table) {
            $table->dropForeign(['parent_spouse_id']);
            $table->dropColumn('parent_spouse_id');
            $table->string('spouse_name')->nullable()->after('parent_id');
        });
    }
};
