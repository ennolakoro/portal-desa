<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Penduduk;
use App\Models\BansosPenerima;
use App\Models\Dusun;

class BansosController extends Controller
{
    /**
     * List all bansos recipients with penduduk details.
     */
    public function index(Request $request)
    {
        $query = BansosPenerima::with(['penduduk', 'penduduk.dusun']);

        if ($request->search) {
            $search = $request->search;
            $query->whereHas('penduduk', function ($q) use ($search) {
                $q->where('nama', 'like', "%$search%")
                  ->orWhere('nik', 'like', "%$search%");
            });
        }

        if ($request->dusun_id) {
            $query->whereHas('penduduk', function ($q) use ($request) {
                $q->where('dusun_id', $request->dusun_id);
            });
        }

        $data = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($data);
    }

    /**
     * Store a new bansos recipient.
     */
     public function store(Request $request)
     {
         $validated = $request->validate([
             'nama'        => 'required|string|max:255',
             'dusun_id'    => 'required|integer|exists:dusuns,id',
             'status'      => 'required|string|max:100',
             'pkh'         => 'nullable|string|max:100',
             'bpnt'        => 'nullable|string|max:100',
             'blt'         => 'nullable|string|max:100',
             'bulog'       => 'nullable|string|max:100',
         ]);

         // Find or create resident (Penduduk)
         $penduduk = Penduduk::where('nama', $validated['nama'])
             ->where('dusun_id', $validated['dusun_id'])
             ->first();

         if (!$penduduk) {
             // Generate unique NIK (16 digits)
             do {
                 $nik = '75' . str_pad(mt_rand(10000000000000, 99999999999999), 14, '0', STR_PAD_LEFT);
             } while (Penduduk::where('nik', $nik)->exists());

             $penduduk = Penduduk::create([
                 'nik'                => $nik,
                 'nama'               => $validated['nama'],
                 'dusun_id'           => $validated['dusun_id'],
                 'jenis_kelamin'      => 'L', // default value
                 'umur'               => 35, // default value
                 'agama'              => 'Islam', // default value
                 'pendidikan'         => 'SMA', // default value
                 'pekerjaan'          => 'Wiraswasta', // default value
                 'is_kepala_keluarga' => false,
             ]);
         }

         // Prevent duplicate bansos entries for this resident
         $exists = BansosPenerima::where('penduduk_id', $penduduk->id)->first();
         if ($exists) {
             return response()->json(['message' => 'Warga ini sudah terdaftar sebagai penerima bansos.'], 422);
         }

         $bansos = BansosPenerima::create([
             'penduduk_id' => $penduduk->id,
             'status'      => $validated['status'],
             'pkh'         => $validated['pkh']  ?? 'Tidak Terdaftar',
             'bpnt'        => $validated['bpnt'] ?? 'Tidak Terdaftar',
             'blt'         => $validated['blt']  ?? 'Tidak Terdaftar',
             'bulog'       => $validated['bulog'] ?? 'Tidak Terdaftar',
         ]);

         $bansos->load(['penduduk', 'penduduk.dusun']);

         return response()->json($bansos, 201);
     }

    /**
     * Update an existing bansos recipient.
     */
    public function update(Request $request, $id)
    {
        $bansos = BansosPenerima::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|max:100',
            'pkh'    => 'nullable|string|max:100',
            'bpnt'   => 'nullable|string|max:100',
            'blt'    => 'nullable|string|max:100',
            'bulog'  => 'nullable|string|max:100',
        ]);

        $bansos->update($validated);
        $bansos->load(['penduduk', 'penduduk.dusun']);

        return response()->json($bansos);
    }

    /**
     * Delete a bansos recipient.
     */
    public function destroy($id)
    {
        $bansos = BansosPenerima::findOrFail($id);
        $bansos->delete();

        return response()->json(['message' => 'Data bansos berhasil dihapus.']);
    }

    /**
     * Search penduduk for assignment.
     */
    public function searchPenduduk(Request $request)
    {
        $q = $request->query('q', '');
        $dusun_id = $request->query('dusun_id');

        $query = Penduduk::with('dusun')
            ->where(function ($query) use ($q) {
                $query->where('nama', 'like', "%$q%")
                      ->orWhere('nik', 'like', "%$q%");
            });

        if ($dusun_id) {
            $query->where('dusun_id', $dusun_id);
        }

        $results = $query->limit(15)->get(['id', 'nik', 'nama', 'dusun_id']);

        return response()->json($results);
    }

    /**
     * Return all dusun options.
     */
    public function dusunOptions()
    {
        return response()->json(Dusun::all());
    }
}
