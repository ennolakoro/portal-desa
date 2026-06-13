<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PotensiWisata;

class PotensiWisataController extends Controller
{
    public function index()
    {
        $items = PotensiWisata::all();

        // Seed default items if empty to keep home page loaded with demo content
        if ($items->isEmpty()) {
            PotensiWisata::create([
                'type' => 'potensi',
                'title' => 'Sektor Kelautan & Perikanan',
                'description' => 'Hasil perikanan laut yang melimpah seperti tongkol dan cakalang menjadi penopang ekonomi utama warga pesisir Desa Dumbayabulan.',
                'icon' => 'sailing'
            ]);
            PotensiWisata::create([
                'type' => 'potensi',
                'title' => 'Pertanian & Perkebunan',
                'description' => 'Lahan kelapa, jagung, dan ubi kayu berkualitas tinggi yang dikelola langsung oleh kelompok tani setempat.',
                'icon' => 'agriculture'
            ]);
            PotensiWisata::create([
                'type' => 'wisata',
                'title' => 'Destinasi Wisata Pantai Wisata Desa',
                'description' => 'Nikmati keindahan panorama alam pantai berpasir putih, kehangatan sunset, dan keramahan budaya kami.',
                'image_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwiuiu7aFDkeTXqejMRdYw_OQa5Xi08STkQz7VqahnSI_p5maV-EkW2y3-jQr8qtUn9aQ5PPVhNbStanQmzmYur32_R8niTgRGfQGxlv8w91r0Ee_TjFczDL-qPjq0U9Abj9AsEe7p_pwVvc5VkELBQORtSDER6XCWP5wv2K5Y-UqpHsnSzVSeTscMXPgEnli8SO7wy5uAwFPBt0Cbrdg6hr7WnT8UtNGzbLji0VD2HdmlzeDlCt9yojQ_hPrSoczPGpwqNgPnPFC7'
            ]);
            $items = PotensiWisata::all();
        }

        return response()->json($items);
    }
}
