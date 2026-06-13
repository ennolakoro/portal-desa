<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermohonanSurat extends Model
{
    protected $fillable = [
        'nama_lengkap',
        'nomor_hp',
        'jenis_surat',
        'keterangan',
        'status',
    ];
}
