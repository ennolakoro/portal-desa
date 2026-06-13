<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\IdmSummary;

class IdmSummaryController extends Controller
{
    public function index()
    {
        $summaries = IdmSummary::orderBy('tahun', 'desc')->get();
        return response()->json($summaries);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tahun' => 'required|integer|unique:idm_summaries,tahun',
            'skor_idm' => 'required|numeric',
            'status' => 'required|string',
            'target_status' => 'required|string',
            'skor_minimal' => 'required|numeric',
            'penambahan' => 'required|numeric',
            'skor_iks' => 'required|numeric',
            'skor_ike' => 'required|numeric',
            'skor_ikl' => 'required|numeric',
        ]);

        $summary = IdmSummary::create($validated);
        return response()->json($summary, 201);
    }

    public function show($id)
    {
        $summary = IdmSummary::findOrFail($id);
        return response()->json($summary);
    }

    public function update(Request $request, $id)
    {
        $summary = IdmSummary::findOrFail($id);
        
        $validated = $request->validate([
            'tahun' => 'required|integer|unique:idm_summaries,tahun,' . $id,
            'skor_idm' => 'required|numeric',
            'status' => 'required|string',
            'target_status' => 'required|string',
            'skor_minimal' => 'required|numeric',
            'penambahan' => 'required|numeric',
            'skor_iks' => 'required|numeric',
            'skor_ike' => 'required|numeric',
            'skor_ikl' => 'required|numeric',
        ]);

        $summary->update($validated);
        return response()->json($summary);
    }

    public function destroy($id)
    {
        $summary = IdmSummary::findOrFail($id);
        $summary->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
