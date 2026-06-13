<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\IdmIndicator;

class IdmIndicatorController extends Controller
{
    public function index(Request $request)
    {
        $query = IdmIndicator::query();
        if ($request->has('tahun')) {
            $query->where('tahun', $request->integer('tahun'));
        } else {
            $latestYear = IdmIndicator::max('tahun') ?: 2024;
            $query->where('tahun', $latestYear);
        }
        $indicators = $query->orderBy('id', 'asc')->get();
        return response()->json($indicators);
    }
}
