<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demografi_summaries', function (Blueprint $table) {
            $table->id();
            
            // Summary
            $table->integer('total_kk')->default(406);
            $table->integer('total_laki')->default(740);
            $table->integer('total_perempuan')->default(689);

            // Dusun
            $table->integer('dusun_buwoto')->default(529);
            $table->integer('dusun_dilipoga')->default(357);
            $table->integer('dusun_tapalu')->default(290);

            // Pendidikan
            $table->integer('pendidikan_tidak_sekolah')->default(240);
            $table->integer('pendidikan_sd')->default(160);
            $table->integer('pendidikan_smp')->default(536);
            $table->integer('pendidikan_sma')->default(224);
            $table->integer('pendidikan_diploma')->default(0);
            $table->integer('pendidikan_sarjana')->default(16);

            // Pekerjaan
            $table->integer('pekerjaan_ibu_rumah_tangga')->default(296);
            $table->integer('pekerjaan_tidak_bekerja')->default(282);
            $table->integer('pekerjaan_pelajar_mahasiswa')->default(247);
            $table->integer('pekerjaan_nelayan')->default(157);
            $table->integer('pekerjaan_petani')->default(184);
            $table->integer('pekerjaan_buruh')->default(10);
            $table->integer('pekerjaan_swasta')->default(0);
            $table->integer('pekerjaan_wiraswasta')->default(0);
            $table->integer('pekerjaan_pns')->default(0);

            // Agama
            $table->integer('agama_islam')->default(1176);
            $table->integer('agama_kristen')->default(0);
            $table->integer('agama_katolik')->default(0);
            $table->integer('agama_hindu')->default(0);
            $table->integer('agama_buddha')->default(0);
            $table->integer('agama_konghucu')->default(0);

            // Piramida (L / P)
            $table->integer('umur_0_5_l')->default(92);
            $table->integer('umur_0_5_p')->default(91);
            
            $table->integer('umur_6_10_l')->default(48);
            $table->integer('umur_6_10_p')->default(48);
            
            $table->integer('umur_11_15_l')->default(58);
            $table->integer('umur_11_15_p')->default(58);
            
            $table->integer('umur_16_20_l')->default(62);
            $table->integer('umur_16_20_p')->default(62);
            
            $table->integer('umur_21_25_l')->default(62);
            $table->integer('umur_21_25_p')->default(61);

            $table->integer('umur_26_30_l')->default(52);
            $table->integer('umur_26_30_p')->default(52);

            $table->integer('umur_31_35_l')->default(30);
            $table->integer('umur_31_35_p')->default(29);

            $table->integer('umur_36_40_l')->default(40);
            $table->integer('umur_36_40_p')->default(39);

            $table->integer('umur_41_45_l')->default(38);
            $table->integer('umur_41_45_p')->default(37);

            $table->integer('umur_46_50_l')->default(29);
            $table->integer('umur_46_50_p')->default(29);

            $table->integer('umur_51_55_l')->default(36);
            $table->integer('umur_51_55_p')->default(35);

            $table->integer('umur_56_60_l')->default(12);
            $table->integer('umur_56_60_p')->default(11);

            $table->integer('umur_61_up_l')->default(33);
            $table->integer('umur_61_up_p')->default(32);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demografi_summaries');
    }
};
