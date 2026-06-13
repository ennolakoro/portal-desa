<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DesaSetting;

class DesaSettingController extends Controller
{
    public function show()
    {
        $setting = DesaSetting::firstOrCreate(['id' => 1]);
        return response()->json($setting);
    }

    public function update(Request $request)
    {
        $setting = DesaSetting::firstOrCreate(['id' => 1]);
        
        $request->validate([
            'hero_title' => 'required|string|max:255',
            'hero_tagline' => 'required|string',
            'footer_alamat_kantor' => 'required|string|max:255',
            'footer_detail_alamat' => 'nullable|string',
            'footer_kode_wilayah' => 'required|string|max:255',
            'footer_telepon' => 'required|string|max:255',
            'footer_email' => 'required|email|max:255',
            'footer_emergency_text' => 'nullable|string',
            'footer_emergency_phone' => 'required|string|max:255',
            'footer_link_kemendesa' => 'required|string',
            'footer_link_kemendagri' => 'required|string',
            'footer_link_dpt' => 'required|string',
        ]);

        $data = $request->only([
            'hero_title',
            'hero_tagline',
            'footer_alamat_kantor',
            'footer_detail_alamat',
            'footer_kode_wilayah',
            'footer_telepon',
            'footer_email',
            'footer_emergency_text',
            'footer_emergency_phone',
            'footer_link_kemendesa',
            'footer_link_kemendagri',
            'footer_link_dpt',
        ]);

        $setting->update($data);

        return response()->json([
            'message' => 'Pengaturan Desa berhasil diperbarui',
            'data' => $setting
        ]);
    }
}
