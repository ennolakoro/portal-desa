<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Penduduk;
use App\Models\Dusun;
use App\Models\Apbdes;

class InfografisController extends Controller
{
    public function demografi()
    {
        $summary = \App\Models\DemografiSummary::firstOrCreate(['id' => 1]);

        $total = $summary->total_laki + $summary->total_perempuan;
        $kk = $summary->total_kk;
        $laki = $summary->total_laki;
        $perempuan = $summary->total_perempuan;

        // Dusun
        $dusunList = [
            ['nama' => 'Buwoto', 'count' => $summary->dusun_buwoto],
            ['nama' => 'Dilipoga', 'count' => $summary->dusun_dilipoga],
            ['nama' => 'Tapalu', 'count' => $summary->dusun_tapalu],
        ];

        // Pendidikan
        $pendidikanList = [
            ['label' => 'Tidak Sekolah', 'value' => $summary->pendidikan_tidak_sekolah],
            ['label' => 'SD', 'value' => $summary->pendidikan_sd],
            ['label' => 'SMP', 'value' => $summary->pendidikan_smp],
            ['label' => 'SMA', 'value' => $summary->pendidikan_sma],
            ['label' => 'Diploma', 'value' => $summary->pendidikan_diploma],
            ['label' => 'Sarjana', 'value' => $summary->pendidikan_sarjana],
        ];

        // Pekerjaan
        $pekerjaanList = [
            ['title' => 'Ibu Rumah Tangga', 'count' => $summary->pekerjaan_ibu_rumah_tangga],
            ['title' => 'Belum/Tidak Bekerja', 'count' => $summary->pekerjaan_tidak_bekerja],
            ['title' => 'Pelajar/Mahasiswa', 'count' => $summary->pekerjaan_pelajar_mahasiswa],
            ['title' => 'Nelayan/Perikanan', 'count' => $summary->pekerjaan_nelayan],
            ['title' => 'Petani/Pekebun', 'count' => $summary->pekerjaan_petani],
            ['title' => 'Buruh Harian Lepas', 'count' => $summary->pekerjaan_buruh],
            ['title' => 'Swasta', 'count' => $summary->pekerjaan_swasta],
            ['title' => 'Wiraswasta', 'count' => $summary->pekerjaan_wiraswasta],
            ['title' => 'PNS/TNI/Polri', 'count' => $summary->pekerjaan_pns],
        ];

        // Agama
        $agamaList = [
            ['label' => 'Islam', 'value' => $summary->agama_islam],
            ['label' => 'Kristen', 'value' => $summary->agama_kristen],
            ['label' => 'Katolik', 'value' => $summary->agama_katolik],
            ['label' => 'Hindu', 'value' => $summary->agama_hindu],
            ['label' => 'Buddha', 'value' => $summary->agama_buddha],
            ['label' => 'Konghucu', 'value' => $summary->agama_konghucu],
        ];

        // Piramida
        $piramida = [
            ['label' => '0-5', 'L' => $summary->umur_0_5_l, 'P' => $summary->umur_0_5_p],
            ['label' => '06-10', 'L' => $summary->umur_6_10_l, 'P' => $summary->umur_6_10_p],
            ['label' => '11-15', 'L' => $summary->umur_11_15_l, 'P' => $summary->umur_11_15_p],
            ['label' => '16-20', 'L' => $summary->umur_16_20_l, 'P' => $summary->umur_16_20_p],
            ['label' => '21-25', 'L' => $summary->umur_21_25_l, 'P' => $summary->umur_21_25_p],
            ['label' => '26-30', 'L' => $summary->umur_26_30_l, 'P' => $summary->umur_26_30_p],
            ['label' => '31-35', 'L' => $summary->umur_31_35_l, 'P' => $summary->umur_31_35_p],
            ['label' => '36-40', 'L' => $summary->umur_36_40_l, 'P' => $summary->umur_36_40_p],
            ['label' => '41-45', 'L' => $summary->umur_41_45_l, 'P' => $summary->umur_41_45_p],
            ['label' => '46-50', 'L' => $summary->umur_46_50_l, 'P' => $summary->umur_46_50_p],
            ['label' => '51-55', 'L' => $summary->umur_51_55_l, 'P' => $summary->umur_51_55_p],
            ['label' => '56-60', 'L' => $summary->umur_56_60_l, 'P' => $summary->umur_56_60_p],
            ['label' => '61+', 'L' => $summary->umur_61_up_l, 'P' => $summary->umur_61_up_p],
        ];

        return response()->json([
            'summary' => [
                'total' => $total,
                'kk' => $kk,
                'laki' => $laki,
                'perempuan' => $perempuan
            ],
            'dusun' => $dusunList,
            'pendidikan' => $pendidikanList,
            'pekerjaan' => $pekerjaanList,
            'agama' => $agamaList,
            'piramida' => $piramida
        ]);
    }

    public function apbdes(Request $request)
    {
        $tahun = $request->query('tahun', '2024');
        $apbdes = Apbdes::where('tahun', $tahun)->first();

        if (!$apbdes) {
            return response()->json(['message' => 'Data APBDes tidak ditemukan'], 404);
        }

        return response()->json($apbdes);
    }
}
