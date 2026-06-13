<?php

namespace App\Http\Controllers;

use App\Models\DesaSetting;

class DesaSettingController extends Controller
{
    public function index()
    {
        $setting = DesaSetting::first();
        if (!$setting) {
            $setting = DesaSetting::create([
                'hero_title' => 'Portal Resmi Transformasi Digital Desa Dumbaya Bulan',
                'hero_tagline' => 'Pusat informasi pemerintahan terpadu, layanan publik modern, dan eksplorasi potensi lokal untuk kesejahteraan warga Desa Dumbaya Bulan, Kabupaten Bone Bolango.',
                'footer_alamat_kantor' => '[Alamat kantor]',
                'footer_detail_alamat' => 'Kecamatan Kabila Bone, Kabupaten Bone Bolango, Provinsi Gorontalo, 96553',
                'footer_kode_wilayah' => '75.03.08.2003',
                'footer_telepon' => '08xxxxxxxxxx',
                'footer_email' => 'emaildesa@digitaldesa.id',
                'footer_emergency_text' => 'Butuh bantuan segera? Hubungi pusat bantuan desa kami.',
                'footer_emergency_phone' => '08xxxxxxxxxx',
                'footer_link_kemendesa' => '#',
                'footer_link_kemendagri' => '#',
                'footer_link_dpt' => '#',
            ]);
        }
        return response()->json($setting);
    }
}
