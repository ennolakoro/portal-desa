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
        Schema::create('visitor_stats', function (Blueprint $table) {
            $table->id();
            $table->integer('hari_ini')->default(0);
            $table->integer('kemarin')->default(0);
            $table->integer('minggu_ini')->default(0);
            $table->integer('minggu_lalu')->default(0);
            $table->integer('bulan_ini')->default(0);
            $table->integer('bulan_lalu')->default(0);
            $table->integer('total')->default(0);
            $table->date('last_tracked_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitor_stats');
    }
};
