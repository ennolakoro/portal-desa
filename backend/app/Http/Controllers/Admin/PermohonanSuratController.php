<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PermohonanSurat;
use App\Services\FonnteService;
use Illuminate\Http\Request;

class PermohonanSuratController extends Controller
{
    public function index()
    {
        $permohonan = PermohonanSurat::orderBy('created_at', 'desc')->get();
        return response()->json($permohonan);
    }

    public function updateStatus(Request $request, $id)
    {
        $permohonan = PermohonanSurat::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:pending,selesai',
        ]);

        $permohonan->status = $request->status;
        $permohonan->save();

        // If status changes to 'selesai', send WhatsApp notification to the citizen
        if ($permohonan->status === 'selesai') {
            $message = "Halo " . $permohonan->nama_lengkap . ",\n\n"
                     . "Permohonan surat Anda:\n"
                     . "Jenis Surat: " . $permohonan->jenis_surat . "\n"
                     . "Status: SELESAI\n\n"
                     . "Surat Anda telah selesai dibuat dan siap untuk diambil di Kantor Desa. Silakan datang langsung ke kantor desa dengan membawa dokumen pendukung (jika ada).\n\n"
                     . "Terima kasih.";

            FonnteService::sendMessage($permohonan->nomor_hp, $message);
        }

        return response()->json([
            'success' => true,
            'message' => 'Status permohonan berhasil diperbarui!',
            'data' => $permohonan
        ]);
    }

    public function destroy($id)
    {
        $permohonan = PermohonanSurat::findOrFail($id);
        $permohonan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Permohonan berhasil dihapus.'
        ]);
    }
}
