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
        Schema::create('stunting_stats', function (Blueprint $table) {
            $table->id();
            $table->string('tahun')->unique();
            $table->integer('total_balita')->default(0);
            $table->integer('balita_normal')->default(0);
            $table->integer('balita_stunting')->default(0);
            $table->integer('balita_gizi_buruk')->default(0);
            $table->integer('kasus_pantai')->default(0);
            $table->integer('kasus_kampung_baru')->default(0);
            $table->integer('kasus_pemukiman')->default(0);
            $table->integer('umur_0_12_normal')->default(0);
            $table->integer('umur_0_12_stunting')->default(0);
            $table->integer('umur_13_24_normal')->default(0);
            $table->integer('umur_13_24_stunting')->default(0);
            $table->integer('umur_25_36_normal')->default(0);
            $table->integer('umur_25_36_stunting')->default(0);
            $table->integer('umur_37_60_normal')->default(0);
            $table->integer('umur_37_60_stunting')->default(0);
            $table->integer('tren_2022')->default(0);
            $table->integer('tren_2023')->default(0);
            $table->integer('tren_2024')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stunting_stats');
    }
};
