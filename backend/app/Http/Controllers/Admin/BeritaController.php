<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Berita;

class BeritaController extends Controller
{
    public function index()
    {
        $berita = Berita::orderBy('created_at', 'desc')->get();
        return response()->json($berita);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'title' => 'required|string',
            'excerpt' => 'nullable|string',
            'body' => 'required|string',
            'author' => 'required|string',
            'initials' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        if (empty($validated['initials'])) {
            $words = explode(' ', $validated['author']);
            $initials = '';
            foreach ($words as $w) {
                if(strlen($w) > 0) $initials .= strtoupper($w[0]);
            }
            if (strlen($initials) > 2) $initials = substr($initials, 0, 2);
            $validated['initials'] = $initials;
        }

        $berita = Berita::create($validated);
        return response()->json(['message' => 'Berita berhasil ditambahkan', 'berita' => $berita]);
    }

    public function update(Request $request, $id)
    {
        $berita = Berita::find($id);
        if (!$berita) {
            return response()->json(['message' => 'Berita tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'category' => 'required|string',
            'title' => 'required|string',
            'excerpt' => 'nullable|string',
            'body' => 'required|string',
            'author' => 'required|string',
            'initials' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        if (empty($validated['initials'])) {
            $words = explode(' ', $validated['author']);
            $initials = '';
            foreach ($words as $w) {
                if(strlen($w) > 0) $initials .= strtoupper($w[0]);
            }
            if (strlen($initials) > 2) $initials = substr($initials, 0, 2);
            $validated['initials'] = $initials;
        }

        $berita->update($validated);
        return response()->json(['message' => 'Berita berhasil diperbarui', 'berita' => $berita]);
    }

    public function destroy($id)
    {
        $berita = Berita::find($id);
        if (!$berita) {
            return response()->json(['message' => 'Berita tidak ditemukan'], 404);
        }
        $berita->delete();
        return response()->json(['message' => 'Berita berhasil dihapus']);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('berita', $filename, 'public');
            $url = asset('storage/' . $path);

            return response()->json([
                'success' => true,
                'url' => $url
            ]);
        }

        return response()->json(['message' => 'File tidak ditemukan'], 400);
    }
}
