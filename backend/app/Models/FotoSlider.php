<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FotoSlider extends Model
{
    protected $fillable = ['image_url', 'caption', 'urutan', 'aktif'];

    protected $casts = [
        'aktif' => 'boolean',
    ];
}
