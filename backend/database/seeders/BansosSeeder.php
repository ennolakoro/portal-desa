<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Penduduk;
use App\Models\BansosPenerima;

class BansosSeeder extends Seeder
{
    /**
     * Seed bansos data sesuai angka yang diinginkan:
     * PKH: 24 KPM, BPNT: 47 KPM, BLT Dana Desa: 11 KPM, Bulog: 101 KPM
     */
    public function run(): void
    {
        $existing = BansosPenerima::pluck('penduduk_id')->toArray();
        $candidates = Penduduk::whereNotIn('id', $existing)->get();

        $pkhTarget   = 24;
        $bpntTarget  = 47;
        $bltTarget   = 11;
        $bulogTarget = 101;

        // Hitung sudah berapa yang terdaftar dari seed sebelumnya
        $pkhCount   = BansosPenerima::where('pkh',   '!=', 'Tidak Terdaftar')->count();
        $bpntCount  = BansosPenerima::where('bpnt',  '!=', 'Tidak Terdaftar')->count();
        $bltCount   = BansosPenerima::where('blt',   '!=', 'Tidak Terdaftar')->count();
        $bulogCount = BansosPenerima::where('bulog', '!=', 'Tidak Terdaftar')->count();

        foreach ($candidates as $p) {
            // Hentikan jika semua target sudah terpenuhi
            if ($pkhCount >= $pkhTarget && $bpntCount >= $bpntTarget && $bltCount >= $bltTarget && $bulogCount >= $bulogTarget) {
                break;
            }

            $pkh   = $pkhCount   < $pkhTarget   ? 'Terdaftar' : 'Tidak Terdaftar';
            $bpnt  = $bpntCount  < $bpntTarget  ? 'Terdaftar' : 'Tidak Terdaftar';
            $blt   = $bltCount   < $bltTarget   ? 'Terdaftar' : 'Tidak Terdaftar';
            $bulog = $bulogCount < $bulogTarget  ? 'Terdaftar' : 'Tidak Terdaftar';

            // Lewati jika tidak ada program sama sekali
            if ($pkh === 'Tidak Terdaftar' && $bpnt === 'Tidak Terdaftar' && $blt === 'Tidak Terdaftar' && $bulog === 'Tidak Terdaftar') {
                continue;
            }

            BansosPenerima::create([
                'penduduk_id' => $p->id,
                'status'      => 'Penerima Aktif',
                'pkh'         => $pkh,
                'bpnt'        => $bpnt,
                'blt'         => $blt,
                'bulog'       => $bulog,
            ]);

            if ($pkh   === 'Terdaftar') $pkhCount++;
            if ($bpnt  === 'Terdaftar') $bpntCount++;
            if ($blt   === 'Terdaftar') $bltCount++;
            if ($bulog === 'Terdaftar') $bulogCount++;
        }

        $this->command->info("Selesai seeding bansos:");
        $this->command->info("PKH:   " . BansosPenerima::where('pkh',   '!=', 'Tidak Terdaftar')->count() . " KPM");
        $this->command->info("BPNT:  " . BansosPenerima::where('bpnt',  '!=', 'Tidak Terdaftar')->count() . " KPM");
        $this->command->info("BLT:   " . BansosPenerima::where('blt',   '!=', 'Tidak Terdaftar')->count() . " KPM");
        $this->command->info("Bulog: " . BansosPenerima::where('bulog', '!=', 'Tidak Terdaftar')->count() . " KPM");
    }
}
