<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penduduk extends Model
{
    protected $guarded = [];

    public function dusun()
    {
        return $this->belongsTo(Dusun::class);
    }

    public function bansos()
    {
        return $this->hasOne(BansosPenerima::class);
    }
}
