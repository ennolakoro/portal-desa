<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\IdmIndicator;

class IdmIndicatorSeeder extends Seeder
{
    public function run(): void
    {
        // Truncate first to avoid duplicates
        IdmIndicator::truncate();

        // --- IKS (Indeks Ketahanan Sosial) ---
        $iks = [
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Akses Sarkes',
                'skor' => 5,
                'keterangan' => 'Waktu tempuh dari ≤ 30 Menit',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => 'Dinkes, PU', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Dokter',
                'skor' => 0,
                'keterangan' => 'Jumlah Dokter Tidak ada',
                'kegiatan' => 'Pengadaan Min 1 org Dokter',
                'nilai_plus' => 0.0095,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => 'DINKES', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Bidan',
                'skor' => 5,
                'keterangan' => 'Jumlah bidan ≥ 1 orang',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => 'DINKES', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Nakes Lain',
                'skor' => 2,
                'keterangan' => 'Jumlah tenaga kesehatan lainnya 1 orang',
                'kegiatan' => 'Penambahan Nakes Min 4 Org',
                'nilai_plus' => 0.0057,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => 'DINKES', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Tingkat Kepesertaan BPJS',
                'skor' => 4,
                'keterangan' => 'Jumlah peserta BPJS/jumlah penduduk antara 0,6 s.d 0,75',
                'kegiatan' => 'Fasilitasi kepesertaan BPJS warga Desa hingga > 75%',
                'nilai_plus' => 0.0019,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => 'DINKES', 'desa' => '', 'csr' => '', 'lainnya' => 'BPJS'
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Akses Poskesdes',
                'skor' => 5,
                'keterangan' => 'Jarak tempuh menuju Poskesdes = 500 Meter',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => 'DINKES', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Aktivitas Posyandu',
                'skor' => 5,
                'keterangan' => 'Jumlah Posyandu aktif 1 bulan sekali/ Jumlah Posyandu > 0,75',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => 'DPMD', 'kabupaten' => 'DPMD, DINKES', 'desa' => 'DD', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Akses SD/MI',
                'skor' => 5,
                'keterangan' => 'Jarak tempuh menuju SD atau MI = 3000 Meter',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => 'DISDIK, PU', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Akses SMP/MTS',
                'skor' => 5,
                'keterangan' => 'Jarak tempuh menuju SMP atau MTs ≤ 6000 Meter',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => 'DISDIK, PU', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Akses SMA/SMK',
                'skor' => 3,
                'keterangan' => 'Jarak tempuh menuju SMU atau SMK antara 8000,01 s.d 10000 Meter',
                'kegiatan' => 'Perbaikan Akses',
                'nilai_plus' => 0.0038,
                'pusat' => '', 'provinsi' => 'DISDIK', 'kabupaten' => 'PU', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Ketersediaan PAUD',
                'skor' => 5,
                'keterangan' => 'Jumlah PAUD ≥ 1',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => 'DISDIK', 'kabupaten' => 'DISDIK', 'desa' => 'DD', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Ketersediaan PKBM/ Paket ABC',
                'skor' => 5,
                'keterangan' => 'Jumlah PKBM atau Paket ABC ≥ 1',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => 'DISDIK', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Ketersediaan Kursus',
                'skor' => 1,
                'keterangan' => 'Jumlah Pusat Keterampilan atau Kursus Tidak ada',
                'kegiatan' => 'Pengadaan Tempat Kursus/Pelatihan',
                'nilai_plus' => 0.0076,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => '', 'desa' => '', 'csr' => 'CSR', 'lainnya' => 'Swasta, Perorangan'
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Ketersediaan Taman Baca/ Perpus Desa',
                'skor' => 5,
                'keterangan' => 'Taman Bacaan Masyarakat atau perpustakaan Desa tersedia',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => 'Kemenperpus Arsip', 'provinsi' => 'Dinas Perpus', 'kabupaten' => 'Dinas Perpus', 'desa' => 'DD', 'csr' => 'CSR', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Kebiasaan Goryong',
                'skor' => 5,
                'keterangan' => 'Terdapat Kebiasaan Gotong Royong',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => '', 'desa' => 'Desa', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Frekuensi Goryong',
                'skor' => 5,
                'keterangan' => 'Frekuensi Gotong Royong > 2',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => '', 'desa' => 'Desa', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Ketersediaan Ruang Publik',
                'skor' => 1,
                'keterangan' => 'Ruang Publik tidak terdapat didesa',
                'kegiatan' => 'Pembangunan Ruang Publik',
                'nilai_plus' => 0.0076,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => 'PU', 'desa' => 'DD', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Kelompok OR',
                'skor' => 2,
                'keterangan' => 'Jumlah kelompok kegiatan olahraga 2 s.d 3',
                'kegiatan' => 'Penambahan Min 6 Kelp Olahraga',
                'nilai_plus' => 0.0057,
                'pusat' => '', 'provinsi' => 'DISPORA', 'kabupaten' => 'DISPORA', 'desa' => '', 'csr' => '', 'lainnya' => 'Karang Taruna'
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Kegiatan OR',
                'skor' => 2,
                'keterangan' => 'Jumlah kegiatan olahraga 2 s.d 3',
                'kegiatan' => 'Pembangunan Min 6 Lap Olahraga',
                'nilai_plus' => 0.0057,
                'pusat' => 'Kemepora/ Kemendes', 'provinsi' => 'DISPORA', 'kabupaten' => 'DISPORA', 'desa' => 'DD', 'csr' => 'CSR', 'lainnya' => 'Perorangan'
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Keragaman Agama',
                'skor' => 1,
                'keterangan' => 'Jumlah Jenis Agama di Desa terdapat 1',
                'kegiatan' => 'Pendataan Jenis Agama Penduduk Desa',
                'nilai_plus' => 0.0076,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => '', 'desa' => 'Desa', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Keragaman Bahasa',
                'skor' => 5,
                'keterangan' => 'Jumlah Bahasa yang digunakan sehari-hari > 1',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => '', 'desa' => 'Desa', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Keragaman Komunikasi',
                'skor' => 5,
                'keterangan' => 'Warga Desa terdiri dari Suku > 1',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => '', 'desa' => 'Desa', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Poskamling',
                'skor' => 5,
                'keterangan' => 'Terdapat Pos Keamanan di Desa',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => '', 'desa' => 'DD', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Siskamling',
                'skor' => 5,
                'keterangan' => 'Terdapat Sistem Keamanan Lingkungan warga di Desa',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => '', 'desa' => 'Desa', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Konflik',
                'skor' => 5,
                'keterangan' => 'Tidak terdapat atau tidak ada Konflik di Desa',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => 'Kesbangpol', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor PMKS',
                'skor' => 5,
                'keterangan' => 'Jumlah PMKS tidak ada atau 0',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => 'Dinsos', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor SLB',
                'skor' => 3,
                'keterangan' => 'Jumlah Skor SLB antara 4 s.d 5',
                'kegiatan' => 'Penanganan SLB',
                'nilai_plus' => 0.0038,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => 'DIKNAS', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Akses Listrik',
                'skor' => 2,
                'keterangan' => '(Jumlah Keluarga Memakai listrik + non Listrik/Jumlah keluarga memakai listrik) antara 0,5 s.d 0,59',
                'kegiatan' => 'Fasilitasi Akses Listrik warga hingga >90 % dari jumlah KK',
                'nilai_plus' => 0.0057,
                'pusat' => '', 'provinsi' => 'ESDM', 'kabupaten' => 'ESDM', 'desa' => 'DD', 'csr' => 'CSR', 'lainnya' => 'Perorangan'
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Sinyal Tlp',
                'skor' => 3,
                'keterangan' => 'Sinyal telepon seluler di Desa Lemah',
                'kegiatan' => 'Fasilitasi Upaya Penguatan Sinyal Telp',
                'nilai_plus' => 0.0038,
                'pusat' => '', 'provinsi' => 'Kominfo', 'kabupaten' => 'Diskominfo', 'desa' => 'Diskominfo', 'csr' => 'Operator Selular', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Internet Kantor Desa',
                'skor' => 5,
                'keterangan' => 'Terdapat fasilitas internet di kantor Desa',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => 'Kominfo/ Kemendes', 'provinsi' => '', 'kabupaten' => '', 'desa' => 'Desa', 'csr' => 'CSR', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Akses Internet Warga',
                'skor' => 5,
                'keterangan' => 'Terdapat Akses internet warga di Desa',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => 'Kominfo', 'kabupaten' => 'Diskominfo', 'desa' => 'Diskominfo', 'csr' => 'Operator Selular', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Akses Jamban',
                'skor' => 5,
                'keterangan' => 'Warga Desa BAB di Jamban Sendiri',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => 'DINSOS,DINKES', 'desa' => '', 'csr' => 'CSR', 'lainnya' => 'Perorangan'
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Sampah',
                'skor' => 4,
                'keterangan' => 'Warga desa membuang sampah di Lubang atau di Bakar',
                'kegiatan' => 'Pembangunan TPS danTPA Sampah',
                'nilai_plus' => 0.0019,
                'pusat' => '', 'provinsi' => 'DLH', 'kabupaten' => 'DLH, DKPP', 'desa' => 'DD', 'csr' => 'CSR', 'lainnya' => ''
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Air Minum',
                'skor' => 5,
                'keterangan' => 'Sumber air minum berasal dari PAM, Air Ledeng tanpa Meteran',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => 'PAMSIMAS, PU', 'provinsi' => '', 'kabupaten' => 'PU', 'desa' => 'DD', 'csr' => 'CSR', 'lainnya' => 'PDAM'
            ],
            [
                'grup' => 'IKS',
                'indikator' => 'Skor Air Mandi & Cuci',
                'skor' => 5,
                'keterangan' => 'Sumber air mandi dan cuci berasal dari PAM, Air Ledeng tanpa Meteran',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => 'PAMSIMAS, PU', 'provinsi' => '', 'kabupaten' => 'PU', 'desa' => 'DD', 'csr' => 'CSR', 'lainnya' => 'PDAM'
            ]
        ];

        // --- IKE (Indeks Ketahanan Ekonomi) ---
        $ike = [
            [
                'grup' => 'IKE',
                'indikator' => 'Skor Keragaman Produksi',
                'skor' => 3,
                'keterangan' => 'Jumlah Industri Mikro/ Jumlah KK antara 0,001 s.d 0,003',
                'kegiatan' => 'Peningkatan Jumlah Industri Mikro/UKM hingga >=0,4% jumlah KK di Desa',
                'nilai_plus' => 0.0111,
                'pusat' => '', 'provinsi' => 'DISPERINDAKOP UKM', 'kabupaten' => 'DISPERINDAKOP UKM', 'desa' => 'DD', 'csr' => 'CSR', 'lainnya' => 'Perorangan'
            ],
            [
                'grup' => 'IKE',
                'indikator' => 'Skor Pertokoan',
                'skor' => 1,
                'keterangan' => 'Jarak ke kelompok pertokoan terdekat > 25 KM',
                'kegiatan' => 'Pembangunan Pusat pertokoan melalui kerjasama antar desa/melayani beberapa desa',
                'nilai_plus' => 0.0222,
                'pusat' => '', 'provinsi' => 'DISPERINDAKOP UKM', 'kabupaten' => '', 'desa' => '', 'csr' => '', 'lainnya' => 'Perorangan, Swasta'
            ],
            [
                'grup' => 'IKE',
                'indikator' => 'Skor Pasar',
                'skor' => 1,
                'keterangan' => '(Total KK/jumlah pasar(permanen)) = 0',
                'kegiatan' => 'Pembangunan Pasar Permanen',
                'nilai_plus' => 0.0222,
                'pusat' => 'Kemenperind, Kemendes', 'provinsi' => 'DISPERINDAKOP UKM', 'kabupaten' => 'DISPERINDAKOP UKM', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKE',
                'indikator' => 'Skor Toko/ Warung Kelontong',
                'skor' => 5,
                'keterangan' => 'Jumlah Toko dan warung kelontong > 3',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => '', 'desa' => 'DD', 'csr' => '', 'lainnya' => 'Perorangan'
            ],
            [
                'grup' => 'IKE',
                'indikator' => 'Skor Kedai & Penginapan',
                'skor' => 3,
                'keterangan' => 'Jumlah Kedai dan Penginapan = 1',
                'kegiatan' => 'Pembangunan 1 Unit Penginapan',
                'nilai_plus' => 0.0111,
                'pusat' => '', 'provinsi' => 'Dinas Pariwisata', 'kabupaten' => 'Dinas Pariwisata', 'desa' => 'DD', 'csr' => '', 'lainnya' => 'Perorangan, Swasta'
            ],
            [
                'grup' => 'IKE',
                'indikator' => 'Skor POS & Logistik',
                'skor' => 0,
                'keterangan' => 'Jumlah pos dan jasa logistik = 0',
                'kegiatan' => 'Pembangunan Jasa Logistik dan Kantor Pos',
                'nilai_plus' => 0.0278,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => '', 'desa' => 'BUMDES', 'csr' => '', 'lainnya' => 'Kantor Pos, Swasta'
            ],
            [
                'grup' => 'IKE',
                'indikator' => 'Skor Bank & BPR',
                'skor' => 3,
                'keterangan' => 'Jumlah bank dan BPR = 1',
                'kegiatan' => 'Fasilitasi Pembangunan Bank Swasta/BPR',
                'nilai_plus' => 0.0111,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => '', 'desa' => '', 'csr' => '', 'lainnya' => 'Perbankan'
            ],
            [
                'grup' => 'IKE',
                'indikator' => 'Skor Kredit',
                'skor' => 3,
                'keterangan' => 'Jumlah fasilitas kredit = 2',
                'kegiatan' => 'Penambahan 2 jenis Fasilitas Kredit (KUR/KKPE/KUK/Kredit lainnya)(Identifikasi kekurangan akses kredit)',
                'nilai_plus' => 0.0111,
                'pusat' => '', 'provinsi' => 'DISPERINDAKOP UKM', 'kabupaten' => '', 'desa' => 'BUMDES/ Koperasi', 'csr' => '', 'lainnya' => 'Bank, Swasta'
            ],
            [
                'grup' => 'IKE',
                'indikator' => 'Skor Lembaga Ekonomi',
                'skor' => 5,
                'keterangan' => 'Jumlah koperasi aktif dan BUMDESA > 1',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => 'DISPERINDAKOP UKM', 'kabupaten' => '', 'desa' => 'Desa', 'csr' => 'CSR', 'lainnya' => ''
            ],
            [
                'grup' => 'IKE',
                'indikator' => 'Skor Moda Transportasi Umum',
                'skor' => 5,
                'keterangan' => 'Transportasi Umum ada dengan trayek tetap',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => '', 'kabupaten' => 'DISHUB', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKE',
                'indikator' => 'Skor Keterbukaan Wilayah',
                'skor' => 5,
                'keterangan' => 'Jalan di Desa dilalui oleh kendaraan bermotor roda empat atau lebih Sepanjang Tahun',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => 'PU', 'kabupaten' => '', 'desa' => 'DD', 'csr' => 'CSR', 'lainnya' => ''
            ],
            [
                'grup' => 'IKE',
                'indikator' => 'Skor Kualitas Jalan',
                'skor' => 5,
                'keterangan' => 'Jenis permukaan jalan desa Aspal atau beton',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => 'PU', 'kabupaten' => '', 'desa' => 'DD', 'csr' => 'CSR', 'lainnya' => ''
            ]
        ];

        // --- IKL (Indeks Ketahanan Ekologi/Lingkungan) ---
        $ikl = [
            [
                'grup' => 'IKL',
                'indikator' => 'Skor Kualitas Lingkungan',
                'skor' => 5,
                'keterangan' => 'Pencemaran (air, udara, tanah, limbah disungai) di desa [jumlah pencemaran/4] = 0',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => 'DLH', 'kabupaten' => 'DLH, DINKES', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKL',
                'indikator' => 'Skor Rawan Bencana',
                'skor' => 5,
                'keterangan' => 'Jenis bencana (longsor, banjir, kebakaran hutan) jenis bencana di desa = 0',
                'kegiatan' => '-',
                'nilai_plus' => 0.0000,
                'pusat' => '', 'provinsi' => 'DISHUT/KPH, BPDB', 'kabupaten' => 'BPBD', 'desa' => '', 'csr' => '', 'lainnya' => ''
            ],
            [
                'grup' => 'IKL',
                'indikator' => 'Skor Tanggap Bencana',
                'skor' => 3,
                'keterangan' => 'Fasilitas mitigasi/tanggap bencana (peringatan dini bencana alam, peringatan dini tsunami, perlengkapan keselamatan, jalur evakuasi) jumlah fasilitas mitigasi / tanggap bencana = 1',
                'kegiatan' => 'Pembangunan/Pengadaan 2 Fasilitas Mitigasi Bencana Sesuai karakteristik wilayah (Kebutuhan sesuai hasil identifikasi kerawanan/potensi bencana)',
                'nilai_plus' => 0.0444,
                'pusat' => 'BNPB, Kemendes', 'provinsi' => 'DISHUT/KPH, BPDB, DINSOS', 'kabupaten' => 'DPBD, DINSOS', 'desa' => 'DD', 'csr' => 'CSR', 'lainnya' => ''
            ]
        ];

        // Insert All for years 2022, 2023, 2024
        $years = [2022, 2023, 2024];
        foreach ($years as $year) {
            foreach ($iks as $idx => $item) {
                $item['tahun'] = $year;
                // Add some slight variation in scores for older years to make it realistic
                if ($year == 2022 && isset($item['skor'])) {
                    $item['skor'] = max(0, $item['skor'] - 1);
                } elseif ($year == 2023 && isset($item['skor'])) {
                    $item['skor'] = max(0, $item['skor'] - ($idx % 2 == 0 ? 1 : 0));
                }
                IdmIndicator::create($item);
            }
            foreach ($ike as $idx => $item) {
                $item['tahun'] = $year;
                if ($year == 2022 && isset($item['skor'])) {
                    $item['skor'] = max(0, $item['skor'] - 1);
                } elseif ($year == 2023 && isset($item['skor'])) {
                    $item['skor'] = max(0, $item['skor'] - ($idx % 2 == 0 ? 1 : 0));
                }
                IdmIndicator::create($item);
            }
            foreach ($ikl as $idx => $item) {
                $item['tahun'] = $year;
                if ($year == 2022 && isset($item['skor'])) {
                    $item['skor'] = max(0, $item['skor'] - 1);
                } elseif ($year == 2023 && isset($item['skor'])) {
                    $item['skor'] = max(0, $item['skor'] - ($idx % 2 == 0 ? 1 : 0));
                }
                IdmIndicator::create($item);
            }
        }
    }
}
