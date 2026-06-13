<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Penduduk;

class BansosController extends Controller
{
    public function cekByNik(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|min:3',
            'dusun_id' => 'required|integer'
        ]);

        $penduduks = Penduduk::where('nama', 'like', '%' . $request->nama . '%')
            ->where('dusun_id', $request->dusun_id)
            ->with('bansos')
            ->get();

        if ($penduduks->isEmpty()) {
            return response()->json([
                'found' => false,
                'message' => 'Tidak ditemukan data warga dengan nama tersebut di dusun yang dipilih.'
            ]);
        }

        $results = $penduduks->map(function ($p) {
            return [
                'id' => $p->id,
                'nama' => $p->nama,
                'dusun' => $p->dusun ? $p->dusun->nama_dusun : '-',
                'is_penerima' => $p->bansos ? true : false,
                'status' => $p->bansos ? $p->bansos->status : 'Bukan Penerima',
                'pkh' => $p->bansos ? $p->bansos->pkh : 'Tidak Terdaftar',
                'bpnt' => $p->bansos ? $p->bansos->bpnt : 'Tidak Terdaftar',
                'blt'  => $p->bansos ? $p->bansos->blt  : 'Tidak Terdaftar',
                'bulog'=> $p->bansos ? $p->bansos->bulog : 'Tidak Terdaftar',
            ];
        });

        return response()->json([
            'found' => true,
            'results' => $results
        ]);
    }

    /**
     * Ringkasan jumlah KPM per program bansos.
     */
    public function summary()
    {
        $pkh   = \App\Models\BansosPenerima::where('pkh', '!=', 'Tidak Terdaftar')->count();
        $bpnt  = \App\Models\BansosPenerima::where('bpnt', '!=', 'Tidak Terdaftar')->count();
        $blt   = \App\Models\BansosPenerima::where('blt', '!=', 'Tidak Terdaftar')->count();
        $bulog = \App\Models\BansosPenerima::where('bulog', '!=', 'Tidak Terdaftar')->count();

        return response()->json([
            'pkh'   => $pkh,
            'bpnt'  => $bpnt,
            'blt'   => $blt,
            'bulog' => $bulog,
        ]);
    }
}
