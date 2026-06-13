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
        Schema::create('profil_desas', function (Blueprint $table) {
            $table->id();
            $table->text('visi')->nullable();
            $table->json('misi')->nullable();
            $table->longText('sejarah')->nullable();
            $table->string('bagan_pemerintahan_url')->nullable();
            $table->string('bagan_bpd_url')->nullable();
            $table->string('batas_utara')->nullable();
            $table->string('batas_timur')->nullable();
            $table->string('batas_selatan')->nullable();
            $table->string('batas_barat')->nullable();
            $table->decimal('luas_wilayah', 8, 2)->nullable();
            $table->integer('populasi_sementara')->nullable();
            $table->string('peta_wilayah_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profil_desas');
    }
};
