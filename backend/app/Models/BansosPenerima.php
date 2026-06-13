<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BansosPenerima extends Model
{
    protected $guarded = [];

    public function penduduk()
    {
        return $this->belongsTo(Penduduk::class);
    }
}
