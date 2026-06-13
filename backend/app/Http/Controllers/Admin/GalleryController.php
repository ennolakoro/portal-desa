<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Gallery;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function index()
    {
        $galleries = Gallery::latest()->get();
        return response()->json($galleries);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'alt' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string'
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('gallery', $filename, 'public');
            $url = asset('storage/' . $path);

            $gallery = Gallery::create([
                'src' => $url,
                'alt' => $request->alt ?: 'Galeri Foto Desa',
                'keterangan' => $request->keterangan
            ]);

            return response()->json([
                'message' => 'Foto galeri berhasil ditambahkan',
                'data' => $gallery
            ]);
        }

        return response()->json(['error' => 'Gagal mengunggah foto'], 400);
    }

    public function update(Request $request, $id)
    {
        $gallery = Gallery::findOrFail($id);
        
        $request->validate([
            'alt' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string'
        ]);

        $gallery->update([
            'alt' => $request->alt ?: 'Galeri Foto Desa',
            'keterangan' => $request->keterangan
        ]);

        return response()->json([
            'message' => 'Data galeri berhasil diperbarui',
            'data' => $gallery
        ]);
    }

    public function destroy($id)
    {
        $gallery = Gallery::findOrFail($id);

        // Delete from storage if it was locally hosted
        if (str_contains($gallery->src, '/storage/gallery/')) {
            $path = str_replace(asset('storage/'), '', $gallery->src);
            Storage::disk('public')->delete($path);
        }

        $gallery->delete();

        return response()->json([
            'message' => 'Foto galeri berhasil dihapus'
        ]);
    }
}
