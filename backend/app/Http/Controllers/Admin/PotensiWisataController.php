<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PotensiWisata;

class PotensiWisataController extends Controller
{
    public function index()
    {
        return response()->json(PotensiWisata::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:potensi,wisata',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);
        $item = PotensiWisata::create($validated);
        return response()->json($item, 201);
    }

    public function update(Request $request, $id)
    {
        $item = PotensiWisata::findOrFail($id);
        $validated = $request->validate([
            'type' => 'required|in:potensi,wisata',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);
        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = PotensiWisata::findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Potensi/Wisata berhasil dihapus']);
    }
}
