<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfilDesaController;
use App\Http\Controllers\InfografisController;
use App\Http\Controllers\BansosController;
use App\Http\Controllers\Admin\ProfilDesaController as AdminProfilDesaController;
use App\Http\Controllers\Admin\InfografisController as AdminInfografisController;

// Auth Routes
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'me']);
});

// Public Routes
Route::prefix('v1')->group(function () {
    Route::get('/profil-desa', [ProfilDesaController::class, 'index']);
    
    // Berita
    Route::get('/berita', [App\Http\Controllers\BeritaController::class, 'index']);
    Route::get('/berita/{id}', [App\Http\Controllers\BeritaController::class, 'show']);
    
    // Infografis
    Route::get('/infografis/demografi', [InfografisController::class, 'demografi']);
    Route::get('/infografis/apbdes', [InfografisController::class, 'apbdes']);
    Route::get('/infografis/idm', [App\Http\Controllers\Api\IdmSummaryController::class, 'index']);
    Route::get('/infografis/idm-indicators', [App\Http\Controllers\Api\IdmIndicatorController::class, 'index']);
    Route::post('/layanan/cek-bansos', [BansosController::class, 'cekByNik']);
    Route::get('/layanan/bansos-summary', [BansosController::class, 'summary']);
    Route::get('/visitor/stats', [App\Http\Controllers\VisitorController::class, 'getStats']);
    Route::get('/potensi-wisata', [App\Http\Controllers\PotensiWisataController::class, 'index']);
    Route::get('/infografis/stunting', [App\Http\Controllers\StuntingController::class, 'index']);

    // Leader Greeting & Gallery
    Route::get('/leader-greeting', [App\Http\Controllers\LeaderGreetingController::class, 'index']);
    Route::get('/gallery', [App\Http\Controllers\GalleryController::class, 'index']);
    Route::get('/desa-setting', [App\Http\Controllers\DesaSettingController::class, 'index']);
    Route::get('/foto-slider', [App\Http\Controllers\FotoSliderController::class, 'index']);

    // Permohonan Surat
    Route::post('/layanan/permohonan-surat', [App\Http\Controllers\PermohonanSuratController::class, 'store']);
});

// Admin Routes
Route::prefix('v1/admin')->middleware(['auth:sanctum'])->group(function () {
    Route::get('/profil-desa', [AdminProfilDesaController::class, 'show']);
    Route::post('/profil-desa', [AdminProfilDesaController::class, 'update']);
    Route::get('/desa-setting', [App\Http\Controllers\Admin\DesaSettingController::class, 'show']);
    Route::post('/desa-setting', [App\Http\Controllers\Admin\DesaSettingController::class, 'update']);

    // Admin Leader Greeting & Gallery
    Route::get('/leader-greeting', [App\Http\Controllers\Admin\LeaderGreetingController::class, 'show']);
    Route::post('/leader-greeting', [App\Http\Controllers\Admin\LeaderGreetingController::class, 'update']);
    Route::get('/gallery', [App\Http\Controllers\Admin\GalleryController::class, 'index']);
    Route::post('/gallery', [App\Http\Controllers\Admin\GalleryController::class, 'store']);
    Route::put('/gallery/{id}', [App\Http\Controllers\Admin\GalleryController::class, 'update']);
    Route::delete('/gallery/{id}', [App\Http\Controllers\Admin\GalleryController::class, 'destroy']);

    // Admin Berita
    Route::get('/berita', [App\Http\Controllers\Admin\BeritaController::class, 'index']);
    Route::post('/berita', [App\Http\Controllers\Admin\BeritaController::class, 'store']);
    Route::put('/berita/{id}', [App\Http\Controllers\Admin\BeritaController::class, 'update']);
    Route::delete('/berita/{id}', [App\Http\Controllers\Admin\BeritaController::class, 'destroy']);
    Route::post('/berita/upload-image', [App\Http\Controllers\Admin\BeritaController::class, 'uploadImage']);

    // Admin Infografis
    Route::get('/apbdes', [AdminInfografisController::class, 'indexApbdes']);
    Route::post('/apbdes', [AdminInfografisController::class, 'storeApbdes']);
    
    Route::get('/penduduk', [AdminInfografisController::class, 'indexPenduduk']);
    Route::post('/penduduk', [AdminInfografisController::class, 'storePenduduk']);
    Route::put('/penduduk/{id}', [AdminInfografisController::class, 'updatePenduduk']);
    Route::delete('/penduduk/{id}', [AdminInfografisController::class, 'destroyPenduduk']);
    Route::get('/demografi-summary', [AdminInfografisController::class, 'showDemografiSummary']);
    Route::post('/demografi-summary', [AdminInfografisController::class, 'updateDemografiSummary']);

    // Admin Visitor, Potensi & Stunting
    Route::get('/visitor-stats', [App\Http\Controllers\Admin\VisitorController::class, 'show']);
    Route::post('/visitor-stats', [App\Http\Controllers\Admin\VisitorController::class, 'update']);
    Route::apiResource('/potensi-wisata', App\Http\Controllers\Admin\PotensiWisataController::class);
    Route::get('/stunting-stats', [App\Http\Controllers\Admin\StuntingController::class, 'index']);
    Route::get('/stunting-stats/year', [App\Http\Controllers\Admin\StuntingController::class, 'show']);
    Route::post('/stunting-stats', [App\Http\Controllers\Admin\StuntingController::class, 'update']);
    Route::delete('/stunting-stats/{tahun}', [App\Http\Controllers\Admin\StuntingController::class, 'destroy']);

    // Admin IDM
    Route::apiResource('/idm', App\Http\Controllers\Admin\IdmSummaryController::class);
    Route::apiResource('/idm-indicators', App\Http\Controllers\Admin\IdmIndicatorController::class);

    // Admin Bansos Management
    Route::get('/bansos', [App\Http\Controllers\Admin\BansosController::class, 'index']);
    Route::post('/bansos', [App\Http\Controllers\Admin\BansosController::class, 'store']);
    Route::put('/bansos/{id}', [App\Http\Controllers\Admin\BansosController::class, 'update']);
    Route::delete('/bansos/{id}', [App\Http\Controllers\Admin\BansosController::class, 'destroy']);
    Route::get('/bansos-search-penduduk', [App\Http\Controllers\Admin\BansosController::class, 'searchPenduduk']);
    Route::get('/dusun-options', [App\Http\Controllers\Admin\BansosController::class, 'dusunOptions']);

    // Admin Foto Slider
    Route::get('/foto-slider', [App\Http\Controllers\Admin\FotoSliderController::class, 'index']);
    Route::post('/foto-slider', [App\Http\Controllers\Admin\FotoSliderController::class, 'store']);
    Route::post('/foto-slider/{id}', [App\Http\Controllers\Admin\FotoSliderController::class, 'update']);
    Route::delete('/foto-slider/{id}', [App\Http\Controllers\Admin\FotoSliderController::class, 'destroy']);

    // Admin Permohonan Surat
    Route::get('/permohonan-surat', [App\Http\Controllers\Admin\PermohonanSuratController::class, 'index']);
    Route::put('/permohonan-surat/{id}/status', [App\Http\Controllers\Admin\PermohonanSuratController::class, 'updateStatus']);
    Route::delete('/permohonan-surat/{id}', [App\Http\Controllers\Admin\PermohonanSuratController::class, 'destroy']);
});
