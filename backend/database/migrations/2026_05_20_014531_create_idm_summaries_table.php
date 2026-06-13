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
        Schema::create('idm_summaries', function (Blueprint $table) {
            $table->id();
            $table->year('tahun')->unique();
            $table->decimal('skor_idm', 8, 4);
            $table->string('status');
            $table->string('target_status');
            $table->decimal('skor_minimal', 8, 4);
            $table->decimal('penambahan', 8, 4);
            $table->decimal('skor_iks', 8, 4);
            $table->decimal('skor_ike', 8, 4);
            $table->decimal('skor_ikl', 8, 4);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('idm_summaries');
    }
};
