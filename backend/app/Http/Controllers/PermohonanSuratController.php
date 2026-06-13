<?php

namespace App\Http\Controllers;

use App\Models\PermohonanSurat;
use App\Services\FonnteService;
use Illuminate\Http\Request;

class PermohonanSuratController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nomor_hp' => 'required|string|max:20',
            'jenis_surat' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
        ]);

        $permohonan = PermohonanSurat::create($validated);

        // Send WhatsApp notification to Admin
        $adminPhone = config('services.fonnte.admin_phone') ?: env('FONNTE_ADMIN_PHONE');
        
        if ($adminPhone) {
            $message = "[Permohonan Surat Baru]\n\n"
                     . "Nama: " . $permohonan->nama_lengkap . "\n"
                     . "No. HP: " . $permohonan->nomor_hp . "\n"
                     . "Jenis Surat: " . $permohonan->jenis_surat . "\n"
                     . "Keterangan: " . ($permohonan->keterangan ?: '-') . "\n"
                     . "Tanggal: " . $permohonan->created_at->format('d-m-Y H:i') . "\n\n"
                     . "Silahkan diproses, apabila sudah selesai silahkan update statusnya di dashboard admin.";
            
            FonnteService::sendMessage($adminPhone, $message);
        }

        return response()->json([
            'success' => true,
            'message' => 'Permohonan surat berhasil dikirim!',
            'data' => $permohonan
        ], 201);
    }
}
