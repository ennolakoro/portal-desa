<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('desa_settings', function (Blueprint $table) {
            $table->id();
            $table->string('hero_title')->default('Portal Resmi Transformasi Digital Desa Dumbayabulan');
            $table->text('hero_tagline')->nullable();
            $table->string('footer_alamat_kantor')->default('[Alamat kantor]');
            $table->text('footer_detail_alamat')->nullable();
            $table->string('footer_kode_wilayah')->default('75.03.08.2003');
            $table->string('footer_telepon')->default('08xxxxxxxxxx');
            $table->string('footer_email')->default('emaildesa@digitaldesa.id');
            $table->text('footer_emergency_text')->nullable();
            $table->string('footer_emergency_phone')->default('08xxxxxxxxxx');
            $table->string('footer_link_kemendesa')->default('#');
            $table->string('footer_link_kemendagri')->default('#');
            $table->string('footer_link_dpt')->default('#');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('desa_settings');
    }
};
