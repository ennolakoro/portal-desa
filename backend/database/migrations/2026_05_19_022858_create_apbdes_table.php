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
        Schema::create('apbdes', function (Blueprint $table) {
            $table->id();
            $table->string('tahun');
            $table->bigInteger('pendapatan_target')->default(0);
            $table->bigInteger('pendapatan_realisasi')->default(0);
            $table->bigInteger('belanja_pagu')->default(0);
            $table->bigInteger('belanja_realisasi')->default(0);
            $table->bigInteger('pembiayaan_penerimaan')->default(0);
            $table->bigInteger('pembiayaan_pengeluaran')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apbdes');
    }
};
