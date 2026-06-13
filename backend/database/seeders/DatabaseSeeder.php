<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Admin Desa',
            'email' => 'admin@desadumbayabulan.id',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        // Default Profil Desa
        \App\Models\ProfilDesa::create([
            'id' => 1,
            'visi' => '"Terwujudnya Desa Dumbaya Bulan yang Mandiri, Sejahtera, dan Berkeadilan melalui Tata Kelola Pemerintahan yang Transparan dan Partisipatif."',
            'misi' => json_encode([
                'Meningkatkan kualitas pelayanan publik berbasis teknologi informasi untuk kemudahan akses warga.',
                'Mendorong pemberdayaan ekonomi masyarakat melalui optimalisasi potensi desa dan UMKM lokal.',
                'Mewujudkan pembangunan infrastruktur yang merata dan berkelanjutan dengan menjaga kelestarian alam.',
                'Memperkuat nilai-nilai religius dan budaya lokal dalam kehidupan bermasyarakat sehari-hari.'
            ]),
            'sejarah' => 'Sejarah adalah fondasi masa depan. Kami sedang mengumpulkan kepingan cerita dari para tetua dan arsip untuk mendokumentasikan perjalanan Desa Dumbaya Bulan secara akurat dan komprehensif.',
            'batas_utara' => 'Desa Tolotio',
            'batas_timur' => 'Desa Poowo',
            'batas_selatan' => 'Teluk Tomini',
            'batas_barat' => 'Desa Kabila Bone',
            'luas_wilayah' => 42.50,
            'populasi_sementara' => 1429,
            'map_lat' => 0.51488,
            'map_lng' => 123.2243,
            'map_zoom' => 14,
            'map_geojson' => '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"Batas Desa Dumbaya Bulan"},"geometry":{"type":"Polygon","coordinates":[[[123.215,0.525],[123.228,0.528],[123.238,0.520],[123.232,0.505],[123.218,0.502],[123.210,0.512],[123.215,0.525]]]}}]}'
        ]);

        // Default Settings
        \App\Models\DesaSetting::create([
            'hero_title' => 'Portal Resmi Transformasi Digital Desa Dumbaya Bulan',
            'hero_tagline' => 'Pusat informasi pemerintahan terpadu, layanan publik modern, dan eksplorasi potensi lokal untuk kesejahteraan warga Desa Dumbaya Bulan, Kabupaten Bone Bolango.',
            'footer_alamat_kantor' => '[Alamat kantor]',
            'footer_detail_alamat' => 'Kecamatan Kabila Bone, Kabupaten Bone Bolango, Provinsi Gorontalo, 96553',
            'footer_kode_wilayah' => '75.03.08.2003',
            'footer_telepon' => '08xxxxxxxxxx',
            'footer_email' => 'emaildesa@digitaldesa.id',
            'footer_emergency_text' => 'Butuh bantuan segera? Hubungi pusat bantuan desa kami.',
            'footer_emergency_phone' => '08xxxxxxxxxx',
            'footer_link_kemendesa' => 'https://kemendesa.go.id',
            'footer_link_kemendagri' => 'https://kemendagri.go.id',
            'footer_link_dpt' => 'https://cekdptonline.kpu.go.id',
        ]);

        // 3 Dusun
        $dusunBuwoto = \App\Models\Dusun::create(['id' => 1, 'nama_dusun' => 'Buwoto']);
        $dusunDilipoga = \App\Models\Dusun::create(['id' => 2, 'nama_dusun' => 'Dilipoga']);
        $dusunTapalu = \App\Models\Dusun::create(['id' => 3, 'nama_dusun' => 'Tapalu']);

        // Generate 1176 Penduduk records in chunks for optimal performance
        $penduduks = [];
        $kkBuwoto = 0;
        $kkDilipoga = 0;
        $kkTapalu = 0;

        for ($i = 0; $i < 1176; $i++) {
            $gender = $i < 592 ? 'L' : 'P';
            
            // Dusun Buwoto (529), Dilipoga (357), Tapalu (290)
            if ($i < 529) {
                $dusunId = 1;
            } elseif ($i < 886) {
                $dusunId = 2;
            } else {
                $dusunId = 3;
            }
            
            // Pendidikan (1176)
            if ($i < 240) $pendidikan = 'Tidak Sekolah';
            elseif ($i < 400) $pendidikan = 'SD';
            elseif ($i < 936) $pendidikan = 'SMP';
            elseif ($i < 1160) $pendidikan = 'SMA';
            else $pendidikan = 'Sarjana';

            // Pekerjaan (1176)
            if ($i < 296) $pekerjaan = 'Ibu Rumah Tangga';
            elseif ($i < 578) $pekerjaan = 'Belum/Tidak Bekerja';
            elseif ($i < 825) $pekerjaan = 'Pelajar/Mahasiswa';
            elseif ($i < 982) $pekerjaan = 'Nelayan/Perikanan';
            elseif ($i < 1166) $pekerjaan = 'Petani/Pekebun';
            else $pekerjaan = 'Buruh Harian Lepas';

            // Age groups based on image totals
            if ($i < 183) $umur = rand(0, 5); // 0-5
            elseif ($i < 279) $umur = rand(6, 10); // 06-10
            elseif ($i < 395) $umur = rand(11, 15); // 11-15
            elseif ($i < 519) $umur = rand(16, 20); // 16-20
            elseif ($i < 642) $umur = rand(21, 25); // 21-25
            elseif ($i < 746) $umur = rand(26, 30); // 26-30
            elseif ($i < 805) $umur = rand(31, 35); // 31-35
            elseif ($i < 884) $umur = rand(36, 40); // 36-40
            elseif ($i < 959) $umur = rand(41, 45); // 41-45
            elseif ($i < 1017) $umur = rand(46, 50); // 46-50
            elseif ($i < 1088) $umur = rand(51, 55); // 51-55
            elseif ($i < 1111) $umur = rand(56, 60); // 56-60
            else $umur = rand(61, 85); // 61+

            // Is Kepala Keluarga (Buwoto 156, Dilipoga 108, Tapalu 85)
            $isKepalaKeluarga = false;
            if ($umur >= 18) {
                if ($dusunId == 1 && $kkBuwoto < 156) {
                    $isKepalaKeluarga = true;
                    $kkBuwoto++;
                } elseif ($dusunId == 2 && $kkDilipoga < 108) {
                    $isKepalaKeluarga = true;
                    $kkDilipoga++;
                } elseif ($dusunId == 3 && $kkTapalu < 85) {
                    $isKepalaKeluarga = true;
                    $kkTapalu++;
                }
            }

            // Particular NIK for testing bansos check
            if ($i === 0) {
                $nik = '1234567890123456';
                $nama = 'Wawan Hermawan';
                $isKepalaKeluarga = true;
                $umur = 24;
                $pekerjaan = 'Nelayan/Perikanan';
                $dusunId = 1;
                // Since $i=0 has $umur=24 >= 18 and $dusunId=1, $kkBuwoto is already incremented.
            } else {
                $nik = sprintf('7500000000%06d', $i);
                $nama = ($gender === 'L' ? 'Warga Laki ' : 'Warga Perempuan ') . $i;
            }

            $penduduks[] = [
                'nik' => $nik,
                'nama' => $nama,
                'jenis_kelamin' => $gender,
                'umur' => $umur,
                'agama' => 'Islam',
                'pendidikan' => $pendidikan,
                'pekerjaan' => $pekerjaan,
                'dusun_id' => $dusunId,
                'is_kepala_keluarga' => $isKepalaKeluarga,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        foreach (array_chunk($penduduks, 200) as $chunk) {
            \App\Models\Penduduk::insert($chunk);
        }

        // Seed Bansos for Wawan Hermawan (first record)
        $wawan = \App\Models\Penduduk::where('nik', '1234567890123456')->first();
        \App\Models\BansosPenerima::create([
            'penduduk_id' => $wawan->id,
            'status' => 'Penerima Aktif',
            'pkh' => 'Terdaftar (Tahap 2)',
            'bpnt' => 'Terdaftar',
            'blt' => 'Terdaftar',
        ]);

        // Seed Demografi Summary
        \App\Models\DemografiSummary::create([
            'id' => 1,
            'total_kk' => 349,
            'total_laki' => 592,
            'total_perempuan' => 584,
            'dusun_buwoto' => 529,
            'dusun_dilipoga' => 357,
            'dusun_tapalu' => 290,
            'pendidikan_tidak_sekolah' => 240,
            'pendidikan_sd' => 160,
            'pendidikan_smp' => 536,
            'pendidikan_sma' => 224,
            'pendidikan_diploma' => 0,
            'pendidikan_sarjana' => 16,
            'pekerjaan_ibu_rumah_tangga' => 296,
            'pekerjaan_tidak_bekerja' => 282,
            'pekerjaan_pelajar_mahasiswa' => 247,
            'pekerjaan_nelayan' => 157,
            'pekerjaan_petani' => 184,
            'pekerjaan_buruh' => 10,
            'pekerjaan_swasta' => 0,
            'pekerjaan_wiraswasta' => 0,
            'pekerjaan_pns' => 0,
            'agama_islam' => 1176,
            'agama_kristen' => 0,
            'agama_katolik' => 0,
            'agama_hindu' => 0,
            'agama_buddha' => 0,
            'agama_konghucu' => 0,
            'umur_0_5_l' => 92,
            'umur_0_5_p' => 91,
            'umur_6_10_l' => 48,
            'umur_6_10_p' => 48,
            'umur_11_15_l' => 58,
            'umur_11_15_p' => 58,
            'umur_16_20_l' => 62,
            'umur_16_20_p' => 62,
            'umur_21_25_l' => 62,
            'umur_21_25_p' => 61,
            'umur_26_30_l' => 52,
            'umur_26_30_p' => 52,
            'umur_31_35_l' => 30,
            'umur_31_35_p' => 29,
            'umur_36_40_l' => 40,
            'umur_36_40_p' => 39,
            'umur_41_45_l' => 38,
            'umur_41_45_p' => 37,
            'umur_46_50_l' => 29,
            'umur_46_50_p' => 29,
            'umur_51_55_l' => 36,
            'umur_51_55_p' => 35,
            'umur_56_60_l' => 12,
            'umur_56_60_p' => 11,
            'umur_61_up_l' => 33,
            'umur_61_up_p' => 32,
        ]);

        // Seed APBDes for 2022, 2023, 2024
        \App\Models\Apbdes::create([
            'tahun' => '2024',
            'pendapatan_target' => 1700000000,
            'pendapatan_realisasi' => 1450000000,
            'belanja_pagu' => 1700000000,
            'belanja_realisasi' => 1200000000,
            'pembiayaan_penerimaan' => 45000000,
            'pembiayaan_pengeluaran' => 0,
        ]);

        \App\Models\Apbdes::create([
            'tahun' => '2023',
            'pendapatan_target' => 1600000000,
            'pendapatan_realisasi' => 1550000000,
            'belanja_pagu' => 1600000000,
            'belanja_realisasi' => 1500000000,
            'pembiayaan_penerimaan' => 30000000,
            'pembiayaan_pengeluaran' => 0,
        ]);

        \App\Models\Apbdes::create([
            'tahun' => '2022',
            'pendapatan_target' => 1500000000,
            'pendapatan_realisasi' => 1480000000,
            'belanja_pagu' => 1500000000,
            'belanja_realisasi' => 1420000000,
            'pembiayaan_penerimaan' => 20000000,
            'pembiayaan_pengeluaran' => 0,
        ]);

        $this->call([
            BeritaSeeder::class,
            LeaderGreetingSeeder::class,
            GallerySeeder::class,
            IdmIndicatorSeeder::class, // Call our indicators seeder here as well
        ]);

        // Seed IDM Summaries (2022, 2023, 2024)
        \App\Models\IdmSummary::create([
            'tahun' => 2022,
            'skor_idm' => 0.6850,
            'status' => 'BERKEMBANG',
            'target_status' => 'MAJU',
            'skor_minimal' => 0.7072,
            'penambahan' => 0.0222,
            'skor_iks' => 0.7010,
            'skor_ike' => 0.5920,
            'skor_ikl' => 0.7620,
        ]);

        \App\Models\IdmSummary::create([
            'tahun' => 2023,
            'skor_idm' => 0.7240,
            'status' => 'BERKEMBANG',
            'target_status' => 'MAJU',
            'skor_minimal' => 0.7072,
            'penambahan' => 0.0000,
            'skor_iks' => 0.7450,
            'skor_ike' => 0.6120,
            'skor_ikl' => 0.8150,
        ]);

        \App\Models\IdmSummary::create([
            'tahun' => 2024,
            'skor_idm' => 0.7684,
            'status' => 'MAJU',
            'target_status' => 'MANDIRI',
            'skor_minimal' => 0.8156,
            'penambahan' => 0.0472,
            'skor_iks' => 0.7886,
            'skor_ike' => 0.6500,
            'skor_ikl' => 0.8667,
        ]);

        // Seed Visitor Stats
        \App\Models\VisitorStat::create([
            'id' => 1,
            'hari_ini' => 32,
            'kemarin' => 56,
            'minggu_ini' => 320,
            'minggu_lalu' => 246,
            'bulan_ini' => 817,
            'bulan_lalu' => 714,
            'total' => 9926,
            'last_tracked_date' => now()->toDateString()
        ]);

        // Seed Potensi & Wisata
        \App\Models\PotensiWisata::create([
            'type' => 'potensi',
            'title' => 'Sektor Kelautan & Perikanan',
            'description' => 'Hasil perikanan laut yang melimpah seperti tongkol dan cakalang menjadi penopang ekonomi utama warga pesisir Desa Dumbaya Bulan.',
            'icon' => 'sailing'
        ]);
        \App\Models\PotensiWisata::create([
            'type' => 'potensi',
            'title' => 'Pertanian & Perkebunan',
            'description' => 'Lahan kelapa, jagung, dan ubi kayu berkualitas tinggi yang dikelola langsung oleh kelompok tani setempat.',
            'icon' => 'agriculture'
        ]);
        \App\Models\PotensiWisata::create([
            'type' => 'wisata',
            'title' => 'Destinasi Wisata Pantai Wisata Desa',
            'description' => 'Nikmati keindahan panorama alam pantai berpasir putih, kehangatan sunset, dan keramahan budaya kami.',
            'image_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwiuiu7aFDkeTXqejMRdYw_OQa5Xi08STkQz7VqahnSI_p5maV-EkW2y3-jQr8qtUn9aQ5PPVhNbStanQmzmYur32_R8niTgRGfQGxlv8w91r0Ee_TjFczDL-qPjq0U9Abj9AsEe7p_pwVvc5VkELBQORtSDER6XCWP5wv2K5Y-UqpHsnSzVSeTscMXPgEnli8SO7wy5uAwFPBt0Cbrdg6hr7WnT8UtNGzbLji0VD2HdmlzeDlCt9yojQ_hPrSoczPGpwqNgPnPFC7'
        ]);

        // Seed Stunting Stats for 2024, 2023, 2022
        \App\Models\StuntingStat::create([
            'id' => 1,
            'tahun' => '2024',
            'total_balita' => 150,
            'balita_normal' => 135,
            'balita_stunting' => 12,
            'balita_gizi_buruk' => 3,
            'kasus_pantai' => 8,
            'kasus_kampung_baru' => 3,
            'kasus_pemukiman' => 4,
            'umur_0_12_normal' => 30,
            'umur_0_12_stunting' => 2,
            'umur_13_24_normal' => 35,
            'umur_13_24_stunting' => 4,
            'umur_25_36_normal' => 40,
            'umur_25_36_stunting' => 3,
            'umur_37_60_normal' => 30,
            'umur_37_60_stunting' => 3,
            'tren_2022' => 22,
            'tren_2023' => 17,
            'tren_2024' => 12,
        ]);

        \App\Models\StuntingStat::create([
            'id' => 2,
            'tahun' => '2023',
            'total_balita' => 145,
            'balita_normal' => 125,
            'balita_stunting' => 17,
            'balita_gizi_buruk' => 3,
            'kasus_pantai' => 10,
            'kasus_kampung_baru' => 5,
            'kasus_pemukiman' => 5,
            'umur_0_12_normal' => 28,
            'umur_0_12_stunting' => 3,
            'umur_13_24_normal' => 32,
            'umur_13_24_stunting' => 5,
            'umur_25_36_normal' => 38,
            'umur_25_36_stunting' => 5,
            'umur_37_60_normal' => 27,
            'umur_37_60_stunting' => 4,
            'tren_2022' => 22,
            'tren_2023' => 17,
            'tren_2024' => 12,
        ]);

        \App\Models\StuntingStat::create([
            'id' => 3,
            'tahun' => '2022',
            'total_balita' => 140,
            'balita_normal' => 113,
            'balita_stunting' => 22,
            'balita_gizi_buruk' => 5,
            'kasus_pantai' => 12,
            'kasus_kampung_baru' => 6,
            'kasus_pemukiman' => 9,
            'umur_0_12_normal' => 25,
            'umur_0_12_stunting' => 4,
            'umur_13_24_normal' => 30,
            'umur_13_24_stunting' => 7,
            'umur_25_36_normal' => 33,
            'umur_25_36_stunting' => 6,
            'umur_37_60_normal' => 25,
            'umur_37_60_stunting' => 5,
            'tren_2022' => 22,
            'tren_2023' => 17,
            'tren_2024' => 12,
        ]);
    }
}
