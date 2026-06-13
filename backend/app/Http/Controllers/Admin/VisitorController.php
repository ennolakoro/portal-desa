<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VisitorStat;

class VisitorController extends Controller
{
    public function show()
    {
        $stats = VisitorStat::firstOrCreate(['id' => 1], [
            'hari_ini' => 32,
            'kemarin' => 56,
            'minggu_ini' => 320,
            'minggu_lalu' => 246,
            'bulan_ini' => 817,
            'bulan_lalu' => 714,
            'total' => 9926,
            'last_tracked_date' => now()->toDateString()
        ]);
        return response()->json($stats);
    }

    public function update(Request $request)
    {
        $stats = VisitorStat::firstOrCreate(['id' => 1]);
        $stats->update($request->validate([
            'hari_ini' => 'required|integer|min:0',
            'kemarin' => 'required|integer|min:0',
            'minggu_ini' => 'required|integer|min:0',
            'minggu_lalu' => 'required|integer|min:0',
            'bulan_ini' => 'required|integer|min:0',
            'bulan_lalu' => 'required|integer|min:0',
            'total' => 'required|integer|min:0',
        ]));
        return response()->json($stats);
    }
}
