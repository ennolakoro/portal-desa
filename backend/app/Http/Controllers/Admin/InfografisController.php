<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Penduduk;
use App\Models\Apbdes;
use App\Models\Dusun;

class InfografisController extends Controller
{
    // Manage APBDes
    public function indexApbdes()
    {
        return response()->json(Apbdes::orderBy('tahun', 'desc')->get());
    }

    public function storeApbdes(Request $request)
    {
        $request->validate([
            'tahun' => 'required|string',
            'pendapatan_target' => 'required|numeric',
            'pendapatan_realisasi' => 'required|numeric',
            'belanja_pagu' => 'required|numeric',
            'belanja_realisasi' => 'required|numeric',
            'pembiayaan_penerimaan' => 'required|numeric',
            'pembiayaan_pengeluaran' => 'required|numeric',
        ]);

        $apbdes = Apbdes::updateOrCreate(
            ['tahun' => $request->tahun],
            $request->all()
        );

        return response()->json([
            'message' => 'Data APBDes berhasil disimpan',
            'data' => $apbdes
        ]);
    }

    // Manage Residents
    public function indexPenduduk(Request $request)
    {
        $search = $request->query('search');
        $query = Penduduk::with('dusun');

        if ($search) {
            $query->where('nama', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
        }

        return response()->json($query->paginate(15));
    }

    public function storePenduduk(Request $request)
    {
        $request->validate([
            'nik' => 'required|string|size:16|unique:penduduks,nik',
            'nama' => 'required|string',
            'jenis_kelamin' => 'required|in:L,P',
            'umur' => 'required|integer|min:0',
            'agama' => 'required|string',
            'pendidikan' => 'required|string',
            'pekerjaan' => 'required|string',
            'dusun_id' => 'nullable|exists:dusuns,id',
            'is_kepala_keluarga' => 'boolean',
        ]);

        $penduduk = Penduduk::create($request->all());

        return response()->json([
            'message' => 'Data Penduduk berhasil ditambahkan',
            'data' => $penduduk
        ]);
    }

    public function updatePenduduk(Request $request, $id)
    {
        $penduduk = Penduduk::findOrFail($id);

        $request->validate([
            'nik' => 'required|string|size:16|unique:penduduks,nik,' . $id,
            'nama' => 'required|string',
            'jenis_kelamin' => 'required|in:L,P',
            'umur' => 'required|integer|min:0',
            'agama' => 'required|string',
            'pendidikan' => 'required|string',
            'pekerjaan' => 'required|string',
            'dusun_id' => 'nullable|exists:dusuns,id',
            'is_kepala_keluarga' => 'boolean',
        ]);

        $penduduk->update($request->all());

        return response()->json([
            'message' => 'Data Penduduk berhasil diperbarui',
            'data' => $penduduk
        ]);
    }

    public function destroyPenduduk($id)
    {
        $penduduk = Penduduk::findOrFail($id);
        $penduduk->delete();

        return response()->json([
            'message' => 'Data Penduduk berhasil dihapus'
        ]);
    }

    // Manage Demografi Summary
    public function showDemografiSummary()
    {
        $summary = \App\Models\DemografiSummary::firstOrCreate(['id' => 1]);
        return response()->json($summary);
    }

    public function updateDemografiSummary(Request $request)
    {
        $summary = \App\Models\DemografiSummary::firstOrCreate(['id' => 1]);

        $request->validate([
            'total_kk' => 'required|integer|min:0',
            'total_laki' => 'required|integer|min:0',
            'total_perempuan' => 'required|integer|min:0',
            'dusun_buwoto' => 'required|integer|min:0',
            'dusun_dilipoga' => 'required|integer|min:0',
            'dusun_tapalu' => 'required|integer|min:0',
            'pendidikan_tidak_sekolah' => 'required|integer|min:0',
            'pendidikan_sd' => 'required|integer|min:0',
            'pendidikan_smp' => 'required|integer|min:0',
            'pendidikan_sma' => 'required|integer|min:0',
            'pendidikan_diploma' => 'required|integer|min:0',
            'pendidikan_sarjana' => 'required|integer|min:0',
            'pekerjaan_ibu_rumah_tangga' => 'required|integer|min:0',
            'pekerjaan_tidak_bekerja' => 'required|integer|min:0',
            'pekerjaan_pelajar_mahasiswa' => 'required|integer|min:0',
            'pekerjaan_nelayan' => 'required|integer|min:0',
            'pekerjaan_petani' => 'required|integer|min:0',
            'pekerjaan_buruh' => 'required|integer|min:0',
            'pekerjaan_swasta' => 'required|integer|min:0',
            'pekerjaan_wiraswasta' => 'required|integer|min:0',
            'pekerjaan_pns' => 'required|integer|min:0',
            'agama_islam' => 'required|integer|min:0',
            'agama_kristen' => 'required|integer|min:0',
            'agama_katolik' => 'required|integer|min:0',
            'agama_hindu' => 'required|integer|min:0',
            'agama_buddha' => 'required|integer|min:0',
            'agama_konghucu' => 'required|integer|min:0',
            'umur_0_5_l' => 'required|integer|min:0',
            'umur_0_5_p' => 'required|integer|min:0',
            'umur_6_10_l' => 'required|integer|min:0',
            'umur_6_10_p' => 'required|integer|min:0',
            'umur_11_15_l' => 'required|integer|min:0',
            'umur_11_15_p' => 'required|integer|min:0',
            'umur_16_20_l' => 'required|integer|min:0',
            'umur_16_20_p' => 'required|integer|min:0',
            'umur_21_25_l' => 'required|integer|min:0',
            'umur_21_25_p' => 'required|integer|min:0',
            'umur_26_30_l' => 'required|integer|min:0',
            'umur_26_30_p' => 'required|integer|min:0',
            'umur_31_35_l' => 'required|integer|min:0',
            'umur_31_35_p' => 'required|integer|min:0',
            'umur_36_40_l' => 'required|integer|min:0',
            'umur_36_40_p' => 'required|integer|min:0',
            'umur_41_45_l' => 'required|integer|min:0',
            'umur_41_45_p' => 'required|integer|min:0',
            'umur_46_50_l' => 'required|integer|min:0',
            'umur_46_50_p' => 'required|integer|min:0',
            'umur_51_55_l' => 'required|integer|min:0',
            'umur_51_55_p' => 'required|integer|min:0',
            'umur_56_60_l' => 'required|integer|min:0',
            'umur_56_60_p' => 'required|integer|min:0',
            'umur_61_up_l' => 'required|integer|min:0',
            'umur_61_up_p' => 'required|integer|min:0',
        ]);

        $data = $request->all();
        $summary->update($data);

        // Regenerate penduduk dummy data in transaction for compatibility with charts & bansos check
        \Illuminate\Support\Facades\DB::transaction(function() use ($summary) {
            $wawan = Penduduk::where('nik', '1234567890123456')->first();
            if (!$wawan) {
                $wawan = Penduduk::create([
                    'nik' => '1234567890123456',
                    'nama' => 'Wawan Hermawan',
                    'jenis_kelamin' => 'L',
                    'umur' => 24,
                    'agama' => 'Islam',
                    'pendidikan' => 'Tidak Sekolah',
                    'pekerjaan' => 'Nelayan/Perikanan',
                    'dusun_id' => 1,
                    'is_kepala_keluarga' => true
                ]);
                
                \App\Models\BansosPenerima::firstOrCreate([
                    'penduduk_id' => $wawan->id
                ], [
                    'status' => 'Penerima Aktif',
                    'pkh' => 'Terdaftar (Tahap 2)',
                    'bpnt' => 'Terdaftar',
                    'blt' => 'Terdaftar',
                ]);
            }

            Penduduk::where('id', '!=', $wawan->id)->delete();

            $dusuns = [];
            $pendidikans = [];
            $pekerjaans = [];
            $agamas = [];
            $is_kks = [];

            // Dusun
            $d1 = max(0, $summary->dusun_buwoto - 1);
            for ($i = 0; $i < $d1; $i++) $dusuns[] = 1;
            for ($i = 0; $i < $summary->dusun_dilipoga; $i++) $dusuns[] = 2;
            for ($i = 0; $i < $summary->dusun_tapalu; $i++) $dusuns[] = 3;

            // Pendidikan
            $p1 = max(0, $summary->pendidikan_tidak_sekolah - 1);
            for ($i = 0; $i < $p1; $i++) $pendidikans[] = 'Tidak Sekolah';
            for ($i = 0; $i < $summary->pendidikan_sd; $i++) $pendidikans[] = 'SD';
            for ($i = 0; $i < $summary->pendidikan_smp; $i++) $pendidikans[] = 'SMP';
            for ($i = 0; $i < $summary->pendidikan_sma; $i++) $pendidikans[] = 'SMA';
            for ($i = 0; $i < $summary->pendidikan_diploma; $i++) $pendidikans[] = 'Diploma';
            for ($i = 0; $i < $summary->pendidikan_sarjana; $i++) $pendidikans[] = 'Sarjana';

            // Pekerjaan
            $pe1 = max(0, $summary->pekerjaan_nelayan - 1);
            for ($i = 0; $i < $summary->pekerjaan_ibu_rumah_tangga; $i++) $pekerjaans[] = 'Ibu Rumah Tangga';
            for ($i = 0; $i < $summary->pekerjaan_tidak_bekerja; $i++) $pekerjaans[] = 'Belum/Tidak Bekerja';
            for ($i = 0; $i < $summary->pekerjaan_pelajar_mahasiswa; $i++) $pekerjaans[] = 'Pelajar/Mahasiswa';
            for ($i = 0; $i < $pe1; $i++) $pekerjaans[] = 'Nelayan/Perikanan';
            for ($i = 0; $i < $summary->pekerjaan_petani; $i++) $pekerjaans[] = 'Petani/Pekebun';
            for ($i = 0; $i < $summary->pekerjaan_buruh; $i++) $pekerjaans[] = 'Buruh Harian Lepas';
            for ($i = 0; $i < $summary->pekerjaan_swasta; $i++) $pekerjaans[] = 'Swasta';
            for ($i = 0; $i < $summary->pekerjaan_wiraswasta; $i++) $pekerjaans[] = 'Wiraswasta';
            for ($i = 0; $i < $summary->pekerjaan_pns; $i++) $pekerjaans[] = 'PNS/TNI/Polri';

            // Agama
            $ag1 = max(0, $summary->agama_islam - 1);
            for ($i = 0; $i < $ag1; $i++) $agamas[] = 'Islam';
            for ($i = 0; $i < $summary->agama_kristen; $i++) $agamas[] = 'Kristen';
            for ($i = 0; $i < $summary->agama_katolik; $i++) $agamas[] = 'Katolik';
            for ($i = 0; $i < $summary->agama_hindu; $i++) $agamas[] = 'Hindu';
            for ($i = 0; $i < $summary->agama_buddha; $i++) $agamas[] = 'Buddha';
            for ($i = 0; $i < $summary->agama_konghucu; $i++) $agamas[] = 'Konghucu';

            // KK
            $kk1 = max(0, $summary->total_kk - 1);
            $totalWargaLain = $summary->total_laki + $summary->total_perempuan - 1;
            for ($i = 0; $i < $totalWargaLain; $i++) {
                $is_kks[] = ($i < $kk1) ? 1 : 0;
            }

            shuffle($dusuns);
            shuffle($pendidikans);
            shuffle($pekerjaans);
            shuffle($agamas);
            shuffle($is_kks);

            $wargas = [];
            $groups = [
                ['l' => $summary->umur_0_5_l, 'p' => $summary->umur_0_5_p, 'min' => 0, 'max' => 5],
                ['l' => $summary->umur_6_10_l, 'p' => $summary->umur_6_10_p, 'min' => 6, 'max' => 10],
                ['l' => $summary->umur_11_15_l, 'p' => $summary->umur_11_15_p, 'min' => 11, 'max' => 15],
                ['l' => $summary->umur_16_20_l, 'p' => $summary->umur_16_20_p, 'min' => 16, 'max' => 20],
                ['l' => $summary->umur_21_25_l, 'p' => $summary->umur_21_25_p, 'min' => 21, 'max' => 25],
                ['l' => $summary->umur_26_30_l, 'p' => $summary->umur_26_30_p, 'min' => 26, 'max' => 30],
                ['l' => $summary->umur_31_35_l, 'p' => $summary->umur_31_35_p, 'min' => 31, 'max' => 35],
                ['l' => $summary->umur_36_40_l, 'p' => $summary->umur_36_40_p, 'min' => 36, 'max' => 40],
                ['l' => $summary->umur_41_45_l, 'p' => $summary->umur_41_45_p, 'min' => 41, 'max' => 45],
                ['l' => $summary->umur_46_50_l, 'p' => $summary->umur_46_50_p, 'min' => 46, 'max' => 50],
                ['l' => $summary->umur_51_55_l, 'p' => $summary->umur_51_55_p, 'min' => 51, 'max' => 55],
                ['l' => $summary->umur_56_60_l, 'p' => $summary->umur_56_60_p, 'min' => 56, 'max' => 60],
                ['l' => $summary->umur_61_up_l, 'p' => $summary->umur_61_up_p, 'min' => 61, 'max' => 90],
            ];

            foreach ($groups as $g) {
                $lCount = $g['l'];
                if ($g['min'] === 21 && $g['max'] === 25) {
                    $lCount = max(0, $lCount - 1);
                }
                for ($i = 0; $i < $lCount; $i++) {
                    $wargas[] = [
                        'jenis_kelamin' => 'L',
                        'umur' => rand($g['min'], $g['max'])
                    ];
                }
                for ($i = 0; $i < $g['p']; $i++) {
                    $wargas[] = [
                        'jenis_kelamin' => 'P',
                        'umur' => rand($g['min'], $g['max'])
                    ];
                }
            }

            $insertData = [];
            $now = now();
            foreach ($wargas as $index => $w) {
                $dusunVal = isset($dusuns[$index]) ? $dusuns[$index] : 1;
                $pendidikanVal = isset($pendidikans[$index]) ? $pendidikans[$index] : 'Tidak Sekolah';
                $pekerjaanVal = isset($pekerjaans[$index]) ? $pekerjaans[$index] : 'Belum/Tidak Bekerja';
                $agamaVal = isset($agamas[$index]) ? $agamas[$index] : 'Islam';
                $kkVal = isset($is_kks[$index]) ? $is_kks[$index] : 0;

                $insertData[] = [
                    'nik' => sprintf('7500000000%06d', $index + 1),
                    'nama' => ($w['jenis_kelamin'] === 'L' ? 'Warga Laki ' : 'Warga Perempuan ') . ($index + 1),
                    'jenis_kelamin' => $w['jenis_kelamin'],
                    'umur' => $w['umur'],
                    'agama' => $agamaVal,
                    'pendidikan' => $pendidikanVal,
                    'pekerjaan' => $pekerjaanVal,
                    'dusun_id' => $dusunVal,
                    'is_kepala_keluarga' => $kkVal,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }

            foreach (array_chunk($insertData, 200) as $chunk) {
                Penduduk::insert($chunk);
            }
        });

        return response()->json([
            'message' => 'Rekapitulasi Demografi berhasil diperbarui dan disinkronkan',
            'data' => $summary
        ]);
    }
}
