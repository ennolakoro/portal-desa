<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Berita;

class BeritaController extends Controller
{
    public function index()
    {
        $berita = Berita::orderBy('created_at', 'desc')->get();
        return response()->json($berita);
    }

    public function show($id)
    {
        $berita = Berita::find($id);
        if (!$berita) {
            return response()->json(['message' => 'Berita tidak ditemukan'], 404);
        }
        
        $berita->increment('views');
        return response()->json($berita);
    }
}
