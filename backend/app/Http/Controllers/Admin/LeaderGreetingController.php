<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LeaderGreeting;

class LeaderGreetingController extends Controller
{
    public function show()
    {
        $greeting = LeaderGreeting::firstOrCreate(['id' => 1], [
            'name' => 'Taslim, S.Pd',
            'content' => 'Selamat datang di portal informasi digital Desa Dumbayabulan.',
            'photo' => ''
        ]);
        return response()->json($greeting);
    }

    public function update(Request $request)
    {
        $greeting = LeaderGreeting::firstOrCreate(['id' => 1]);

        $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
            'photo' => 'nullable|string',
            'file_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120'
        ]);

        $data = [
            'name' => $request->name,
            'content' => $request->content,
        ];

        // Handle photo file upload
        if ($request->hasFile('file_photo')) {
            $file = $request->file('file_photo');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('sambutan', $filename, 'public');
            $data['photo'] = asset('storage/' . $path);
        } else if ($request->has('photo')) {
            $data['photo'] = $request->photo;
        }

        $greeting->update($data);

        return response()->json([
            'message' => 'Sambutan Kepala Desa berhasil diperbarui',
            'data' => $greeting
        ]);
    }
}
