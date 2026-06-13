<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IdmIndicator extends Model
{
    protected $fillable = [
        'grup',
        'tahun',
        'indikator',
        'skor',
        'keterangan',
        'kegiatan',
        'nilai_plus',
        'pusat',
        'provinsi',
        'kabupaten',
        'desa',
        'csr',
        'lainnya',
    ];
}
