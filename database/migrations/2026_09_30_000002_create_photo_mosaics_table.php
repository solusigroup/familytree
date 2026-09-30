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
        Schema::create('photo_mosaics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->text('caption');
            $table->string('image_path');
            $table->string('thumbnail_path')->nullable();
            $table->string('original_filename')->nullable();
            $table->unsignedBigInteger('file_size')->default(0); // compressed size in bytes
            $table->unsignedBigInteger('original_file_size')->default(0); // original size in bytes
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->date('taken_at')->nullable();
            $table->timestamps();

            $table->index(['created_at']);
            $table->index(['user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photo_mosaics');
    }
};
