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
        Schema::create('family_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('gender', ['male', 'female']);
            $table->date('birth_date')->nullable();
            $table->date('death_date')->nullable();
            $table->string('birth_place')->nullable();
            $table->text('bio')->nullable();
            $table->string('photo')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('family_members')->nullOnDelete();
            $table->string('spouse_name')->nullable();
            $table->integer('generation')->default(1);
            $table->timestamps();

            $table->index('parent_id');
            $table->index('generation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('family_members');
    }
};
