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
        Schema::table('profil_desas', function (Blueprint $table) {
            $table->decimal('map_lat', 10, 8)->nullable()->after('peta_wilayah_url');
            $table->decimal('map_lng', 11, 8)->nullable()->after('map_lat');
            $table->integer('map_zoom')->nullable()->default(13)->after('map_lng');
            $table->longText('map_geojson')->nullable()->after('map_zoom');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profil_desas', function (Blueprint $table) {
            $table->dropColumn(['map_lat', 'map_lng', 'map_zoom', 'map_geojson']);
        });
    }
};
