<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FotoSlider;
use Illuminate\Support\Facades\Storage;

class FotoSliderController extends Controller
{
    public function index()
    {
        $sliders = FotoSlider::orderBy('urutan')->orderBy('created_at', 'desc')->get();
        return response()->json($sliders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image'   => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'caption' => 'nullable|string|max:255',
            'urutan'  => 'nullable|integer',
            'aktif'   => 'nullable|boolean',
        ]);

        $file     = $request->file('image');
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path     = $file->storeAs('slider', $filename, 'public');
        $url      = asset('storage/' . $path);

        $slider = FotoSlider::create([
            'image_url' => $url,
            'caption'   => $request->caption,
            'urutan'    => $request->urutan ?? FotoSlider::max('urutan') + 1,
            'aktif'     => $request->boolean('aktif', true),
        ]);

        return response()->json(['message' => 'Foto slider berhasil ditambahkan', 'data' => $slider], 201);
    }

    public function update(Request $request, $id)
    {
        $slider = FotoSlider::findOrFail($id);

        $request->validate([
            'image'   => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'caption' => 'nullable|string|max:255',
            'urutan'  => 'nullable|integer',
            'aktif'   => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            // Delete old file
            if (str_contains($slider->image_url, '/storage/slider/')) {
                $old = str_replace(asset('storage/'), '', $slider->image_url);
                Storage::disk('public')->delete($old);
            }

            $file     = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path     = $file->storeAs('slider', $filename, 'public');
            $slider->image_url = asset('storage/' . $path);
        }

        $slider->caption = $request->caption ?? $slider->caption;
        $slider->urutan  = $request->urutan  ?? $slider->urutan;
        if ($request->has('aktif')) {
            $slider->aktif = $request->boolean('aktif');
        }
        $slider->save();

        return response()->json(['message' => 'Foto slider berhasil diperbarui', 'data' => $slider]);
    }

    public function destroy($id)
    {
        $slider = FotoSlider::findOrFail($id);

        if (str_contains($slider->image_url, '/storage/slider/')) {
            $path = str_replace(asset('storage/'), '', $slider->image_url);
            Storage::disk('public')->delete($path);
        }

        $slider->delete();

        return response()->json(['message' => 'Foto slider berhasil dihapus']);
    }
}
