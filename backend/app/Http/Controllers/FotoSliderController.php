<?php

namespace App\Http\Controllers;

use App\Models\FotoSlider;

class FotoSliderController extends Controller
{
    public function index()
    {
        $sliders = FotoSlider::where('aktif', true)
            ->orderBy('urutan')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($sliders);
    }
}
