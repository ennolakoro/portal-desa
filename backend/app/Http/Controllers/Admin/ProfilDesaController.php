<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProfilDesa;

class ProfilDesaController extends Controller
{
    public function show()
    {
        $profil = ProfilDesa::firstOrCreate(['id' => 1]);
        if ($profil && $profil->misi && is_string($profil->misi)) {
            $profil->misi = json_decode($profil->misi);
        }
        return response()->json($profil);
    }

    public function update(Request $request)
    {
        $profil = ProfilDesa::firstOrCreate(['id' => 1]);

        $data = $request->except(['id', 'created_at', 'updated_at', 'file_bagan_pemerintahan', 'file_bagan_bpd']);

        if ($request->has('misi')) {
            $misi = $request->misi;
            if (is_string($misi)) {
                $decoded = json_decode($misi, true);
                if (is_array($decoded)) {
                    $misi = $decoded;
                }
            }
            $data['misi'] = is_array($misi) ? json_encode($misi) : $misi;
        }

        // Handle bagan pemerintahan upload
        if ($request->hasFile('file_bagan_pemerintahan')) {
            $file = $request->file('file_bagan_pemerintahan');
            $filename = 'pemerintahan_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('bagan', $filename, 'public');
            $data['bagan_pemerintahan_url'] = asset('storage/' . $path);
        }

        // Handle bagan BPD upload
        if ($request->hasFile('file_bagan_bpd')) {
            $file = $request->file('file_bagan_bpd');
            $filename = 'bpd_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('bagan', $filename, 'public');
            $data['bagan_bpd_url'] = asset('storage/' . $path);
        }

        $profil->update($data);

        if ($profil->misi && is_string($profil->misi)) {
            $profil->misi = json_decode($profil->misi);
        }

        return response()->json([
            'message' => 'Profil Desa berhasil diperbarui',
            'data' => $profil
        ]);
    }
}
