<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StuntingStat;

class StuntingController extends Controller
{
    /**
     * Returns all records (no tahun) for trend chart,
     * or a single record for a specific tahun.
     */
    public function index(Request $request)
    {
        $tahun = $request->query('tahun');

        // No year param → return all years sorted ascending (for trend chart)
        if (!$tahun) {
            return response()->json(StuntingStat::orderBy('tahun', 'asc')->get());
        }

        // Specific year requested
        $stats = StuntingStat::where('tahun', $tahun)->first();

        // Fallback to most recent if requested year not yet created
        if (!$stats) {
            $stats = StuntingStat::orderBy('tahun', 'desc')->first();
        }

        return response()->json($stats);
    }
}
