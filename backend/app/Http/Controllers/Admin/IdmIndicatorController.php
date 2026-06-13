<?php

namespace App\Http\Controllers\Admin;

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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'grup' => 'required|string|in:IKS,IKE,IKL',
            'tahun' => 'required|integer',
            'indikator' => 'required|string',
            'skor' => 'required|integer',
            'keterangan' => 'nullable|string',
            'kegiatan' => 'nullable|string',
            'nilai_plus' => 'required|numeric',
            'pusat' => 'nullable|string',
            'provinsi' => 'nullable|string',
            'kabupaten' => 'nullable|string',
            'desa' => 'nullable|string',
            'csr' => 'nullable|string',
            'lainnya' => 'nullable|string',
        ]);

        $indicator = IdmIndicator::create($validated);
        return response()->json($indicator, 201);
    }

    public function show($id)
    {
        $indicator = IdmIndicator::findOrFail($id);
        return response()->json($indicator);
    }

    public function update(Request $request, $id)
    {
        $indicator = IdmIndicator::findOrFail($id);
        
        $validated = $request->validate([
            'grup' => 'required|string|in:IKS,IKE,IKL',
            'tahun' => 'required|integer',
            'indikator' => 'required|string',
            'skor' => 'required|integer',
            'keterangan' => 'nullable|string',
            'kegiatan' => 'nullable|string',
            'nilai_plus' => 'required|numeric',
            'pusat' => 'nullable|string',
            'provinsi' => 'nullable|string',
            'kabupaten' => 'nullable|string',
            'desa' => 'nullable|string',
            'csr' => 'nullable|string',
            'lainnya' => 'nullable|string',
        ]);

        $indicator->update($validated);
        return response()->json($indicator);
    }

    public function destroy($id)
    {
        $indicator = IdmIndicator::findOrFail($id);
        $indicator->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
