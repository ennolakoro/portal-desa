<?php

namespace App\Http\Controllers;

use App\Models\LeaderGreeting;

class LeaderGreetingController extends Controller
{
    public function index()
    {
        $greeting = LeaderGreeting::first() ?: LeaderGreeting::create([
            'name' => 'Bapak Taslim, S.Pd',
            'content' => 'Selamat datang di portal informasi digital Desa Dumbaya Bulan.',
            'photo' => ''
        ]);
        return response()->json($greeting);
    }
}
