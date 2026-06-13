<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IdmSummary extends Model
{
    protected $fillable = [
        'tahun',
        'skor_idm',
        'status',
        'target_status',
        'skor_minimal',
        'penambahan',
        'skor_iks',
        'skor_ike',
        'skor_ikl',
    ];
}
