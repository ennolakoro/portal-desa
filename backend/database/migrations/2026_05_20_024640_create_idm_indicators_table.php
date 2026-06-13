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
        Schema::create('idm_indicators', function (Blueprint $table) {
            $table->id();
            $table->string('grup'); // IKS, IKE, IKL
            $table->integer('tahun')->default(2024);
            $table->string('indikator');
            $table->integer('skor');
            $table->text('keterangan')->nullable();
            $table->text('kegiatan')->nullable();
            $table->decimal('nilai_plus', 8, 4);
            $table->string('pusat')->nullable();
            $table->string('provinsi')->nullable();
            $table->string('kabupaten')->nullable();
            $table->string('desa')->nullable();
            $table->string('csr')->nullable();
            $table->string('lainnya')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('idm_indicators');
    }
};
