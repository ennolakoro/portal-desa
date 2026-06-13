<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StuntingStat;

class StuntingController extends Controller
{
    /**
     * List all year records (for CRUD table view).
     */
    public function index()
    {
        $records = StuntingStat::orderBy('tahun', 'desc')->get();
        return response()->json($records);
    }

    /**
     * Show one year's record. Creates a default if not found.
     */
    public function show(Request $request)
    {
        $tahun = $request->query('tahun', date('Y'));
        $stats = StuntingStat::where('tahun', $tahun)->first();

        if (!$stats) {
            return response()->json(['message' => 'Data tahun ' . $tahun . ' belum ada. Silakan buat baru.'], 404);
        }

        return response()->json($stats);
    }

    /**
     * Create or update a year record.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'tahun'            => 'required|string',
            'total_balita'     => 'required|integer|min:0',
            'balita_normal'    => 'required|integer|min:0',
            'balita_stunting'  => 'required|integer|min:0',
            'balita_gizi_buruk'=> 'required|integer|min:0',
            'kasus_pantai'     => 'required|integer|min:0',
            'kasus_kampung_baru'=> 'required|integer|min:0',
            'kasus_pemukiman'  => 'required|integer|min:0',
            'umur_0_12_normal' => 'required|integer|min:0',
            'umur_0_12_stunting'=> 'required|integer|min:0',
            'umur_13_24_normal'=> 'required|integer|min:0',
            'umur_13_24_stunting'=> 'required|integer|min:0',
            'umur_25_36_normal'=> 'required|integer|min:0',
            'umur_25_36_stunting'=> 'required|integer|min:0',
            'umur_37_60_normal'=> 'required|integer|min:0',
            'umur_37_60_stunting'=> 'required|integer|min:0',
        ]);

        $stats = StuntingStat::updateOrCreate(
            ['tahun' => $validated['tahun']],
            $validated
        );

        return response()->json($stats);
    }

    /**
     * Delete a year record.
     */
    public function destroy($tahun)
    {
        $stat = StuntingStat::where('tahun', $tahun)->first();
        if (!$stat) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }
        $stat->delete();
        return response()->json(['message' => 'Data tahun ' . $tahun . ' berhasil dihapus.']);
    }
}
