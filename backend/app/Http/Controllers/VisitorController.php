<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VisitorStat;

class VisitorController extends Controller
{
    public function getStats(Request $request)
    {
        $stats = VisitorStat::firstOrCreate(['id' => 1], [
            'hari_ini' => 32,
            'kemarin' => 56,
            'minggu_ini' => 320,
            'minggu_lalu' => 246,
            'bulan_ini' => 817,
            'bulan_lalu' => 714,
            'total' => 9926,
            'last_tracked_date' => now()->toDateString()
        ]);

        $today = now()->toDateString();

        if ($stats->last_tracked_date !== $today) {
            $lastDate = \Carbon\Carbon::parse($stats->last_tracked_date);
            $currDate = now();

            // Yesterday rotation
            if ($lastDate->diffInDays($currDate) === 1) {
                $stats->kemarin = $stats->hari_ini;
            } else {
                $stats->kemarin = 0;
            }

            // Check new week (Monday)
            if ($currDate->copy()->startOfWeek()->toDateString() !== $lastDate->copy()->startOfWeek()->toDateString()) {
                $stats->minggu_lalu = $stats->minggu_ini;
                $stats->minggu_ini = 0;
            }

            // Check new month
            if ($currDate->format('Y-m') !== $lastDate->format('Y-m')) {
                $stats->bulan_lalu = $stats->bulan_ini;
                $stats->bulan_ini = 0;
            }

            $stats->hari_ini = 0;
            $stats->last_tracked_date = $today;
        }

        // Get request IP address
        $ip = $request->ip();

        // Check unique IP visitor for today
        $alreadyLogged = \Illuminate\Support\Facades\DB::table('visitor_logs')
            ->where('ip_address', $ip)
            ->where('visit_date', $today)
            ->exists();

        if (!$alreadyLogged) {
            try {
                \Illuminate\Support\Facades\DB::table('visitor_logs')->insert([
                    'ip_address' => $ip,
                    'visit_date' => $today,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Increment counts on unique visitor hit
                $stats->hari_ini += 1;
                $stats->minggu_ini += 1;
                $stats->bulan_ini += 1;
                $stats->total += 1;
                $stats->save();
            } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                // Concurrency safeguard
            }
        }

        return response()->json($stats);
    }
}
