<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LeaderGreeting;

class LeaderGreetingSeeder extends Seeder
{
    public function run(): void
    {
        LeaderGreeting::create([
            'name' => 'Taslim, S.Pd',
            'photo' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa9O_m3WqTLvLKWda4SY2Og6R4y53xxme1dSahHyILi_SK_YaDeK4XZFWAo_-vWYBj_uHYGqjOeclI3ToXw_wgw9zerr99L21rAox6tSa3LAOhIsGqcM2T6xNTb4XDFH0uMvqYA-R0M5KiYJKHMD64JfpSj4TpotItufMD1XeOBsOBh8BvsBET-qV4GOI5-uoacJYRrtVmXCYXclD_Al8W74TEKuVBr_uFJHVAoFm5TFTEbacYIT3w7E23lAu_bSf89JLysZTvDho-',
            'content' => 'Selamat datang di portal informasi digital Desa Dumbaya Bulan. Kami berkomitmen untuk mewujudkan tata kelola pemerintahan yang transparan dan akuntabel melalui pemanfaatan teknologi informasi bagi seluruh warga.'
        ]);
    }
}
