<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProfilDesa;

class ProfilDesaController extends Controller
{
    public function index()
    {
        $profil = ProfilDesa::first();
        if ($profil && $profil->misi) {
            $profil->misi = json_decode($profil->misi);
        }
        return response()->json($profil);
    }
}
